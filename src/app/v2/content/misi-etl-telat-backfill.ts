import type { V2Mission } from "../lib/types";

// ── MISI ETL: Batch yang Datang Terlambat ───────────────────────────────
// M2 grup DATA-ENGINEERING — Data Engineer, core (kompleksitas sedang).
// Dataset 100% SINTETIS (generator Python, seed 42). Snapshot:
// public/misi/misi-etl-telat-backfill/{manifest.csv,event_log.csv,METODE.md}

const BASE = "/misi/misi-etl-telat-backfill";

export const misiEtlTelat: V2Mission = {
  slug: "misi-etl-telat-backfill",
  track: "Data Engineer",
  module: "Misi",
  title: "Misi ETL: Batch yang Datang Terlambat",
  estMinutes: 135,
  role: "Data engineer — pemilik pipeline ETL revenue",
  client:
    "Head of Finance — dashboard revenue “final” berubah-ubah setiap hari; tim finance tidak percaya angka lagi",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Angka “final” yang tidak pernah diam",
      prose: [],
      tasks: [],
      briefing: {
        role: "Data engineer — pemilik pipeline ETL revenue sebuah marketplace",
        client:
          "Head of Finance. Dashboard revenue “final” berubah tiga kali dalam seminggu: Senin 1,80 miliar, Rabu 1,93 miliar, tadi pagi 1,80 lagi. Finance tidak tahu angka mana yang benar — dan angka itu keluar dari pipelinemmu.",
        story: [
          "Kamis, 09:12. Head of Finance menelepon — suaranya tegang. “Angka revenue final kemarin berubah tiga kali minggu ini. Senin 1,80 miliar, Rabu 1,93 miliar, tadi pagi 1,80 lagi. Angka mana yang benar?” Kamu tidak punya jawaban yang berani kamu pertahankan.",
          "Arsitekturnya sederhana: event order harian dikumpulkan per partisi tanggal, di-ingest dalam batch, lalu diagregasi menjadi angka revenue harian. Masalahnya: partisi sering datang telat 2–3 hari, kadang ada yang ke-skip, dan setiap kali kamu menjalankan backfill manual untuk mengejar ketertinggalan, angka “final” hari-hari sebelumnya ikut bergeser.",
          "Misi ini mensimulasikan 18 hari pipeline yang bermasalah. Tugasmu: audit manifest ingest, tulis ulang agregasi menjadi idempoten, dan tinggalkan runbook agar tim tidak mengulang kesalahan yang sama. Backfill yang tidak idempoten — dijalankan dua kali, hasilnya beda — adalah racun yang pelan.",
        ],
        objectives: [
          "Mengaudit manifest ingest: mengidentifikasi partisi yang telat (>2 hari), hilang, dan duplikat — lengkap dengan bukti baris per baris.",
          "Menulis ulang agregasi revenue menjadi idempoten (dedupe berbasis event_id) sehingga total stabil berapa pun kali backfill dijalankan ulang.",
          "Menyusun runbook backfill + rekomendasi guardrail (constraint, verifikasi manifest-vs-aktual) agar angka “final” benar-benar final.",
        ],
        prereqSummary:
          "Partisi = potongan data untuk satu tanggal; pipeline memproses satu partisi per batch. Backfill = menjalankan ulang proses untuk partisi lama yang telat atau rusak. Idempoten = sifat operasi yang hasilnya identik meski dijalankan berkali-kali — seperti menekan tombol lift yang sudah menyala: tidak ada efek kedua. Misi ini membuktikan agregasi revenue-mu saat ini tidak idempoten, lalu memperbaikinya.",
        datasetNote:
          "**100% SINTETIS** — seluruh file dibuat oleh generator Python (seed 42) khusus untuk misi ini; bukan data perusahaan nyata.\nFile: manifest.csv (18 baris klaim ingest per partisi), event_log.csv (±14.600 event), METODE.md (metode generator + nilai referensi).\nPeringatan: data ini SENGAJA kotor — partisi telat 2–3 hari, satu partisi hilang, satu partisi duplikat, satu partisi kosong yang diklaim “lengkap”.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Klaim vs kenyataan",
      prose: [
        "Dua file adalah seluruh semesta misi ini. `manifest.csv` adalah KLAIM pipeline: 18 baris yang menyatakan setiap partisi tanggal berapa, berapa baris yang diharapkan, berapa yang diterima, statusnya, dan kapan di-ingest. `event_log.csv` adalah KENYATAAN: ±14.600 baris event mentah dengan `event_id`, `partition_date`, `event_time`, `order_id`, dan `amount`.",
        "Pekerjaan auditor dimulai dari membandingkan klaim dengan kenyataan. Manifest bilang “lengkap”? Hitung sendiri baris aktualnya. Manifest bilang satu baris per tanggal? Cek duplikatnya. Jangan percaya; verifikasi.",
        "Semua angka di sini sintetis (lihat METODE.md), tetapi polanya nyata: inilah bentuk kegagalan ETL batch yang paling sering ditemui — keterlambatan, partisi hilang, dan ingest ganda dari retry yang tidak idempoten.",
      ],
      tasks: [
        { id: "t1", text: "Buka `manifest.csv`: catat nama kolom dan berapa baris per tanggal partisi" },
        { id: "t2", text: "Buka `event_log.csv`: catat jumlah baris dan arti tiap kolom" },
      ],
      note: {
        title: "Miskonsepsi #1: backfill = tinggal dijalankan ulang",
        type: "pitfall",
        body: "“Datanya telat? Ya sudah, backfill saja.” SALAH — dan ini akar seluruh misi. Menjalankan ulang agregasi di atas data yang mengandung duplikat (mis. partisi yang ter-ingest dua kali karena retry) akan menghitung event yang sama dua kali. Backfill hanya aman bila operasinya idempoten: hasil run ke-1, ke-2, dan ke-10 harus identik. Kalau tidak, setiap backfill justru merusak angka “final”.",
      },
      reference:
        "manifest.csv (18 baris klaim) vs event_log.csv (±14.600 baris kenyataan). Audit = klaim × kenyataan.",
    },
    {
      id: "lab-deteksi",
      eyebrow: "Langkah 3 · Lab 1 — Audit partisi + agregasi idempoten",
      title: "Buktikan angkanya berbohong, lalu perbaiki",
      prose: [
        "Empat tugas, satu prinsip: angka “final” harus bisa direproduksi. Pertama petakan keterlambatan: partisi mana yang di-ingest lebih dari 2 hari setelah tanggalnya? Kedua, cari tanggal yang hilang dari manifest dalam rentang 2026-09-25 s.d. 2026-10-12. Ketiga, temukan tanggal yang muncul lebih dari sekali. Keempat — yang paling penting — tulis ulang agregasi: satu `event_id` dihitung tepat satu kali, berapa pun kali datanya di-ingest.",
        "Definisi operasional idempoten di sini: `total_pendapatan` dari agregasimu harus sama persis apakah dihitung dari data mentah (yang mengandung 958 duplikat) atau dari data yang sudah dibersihkan. Selisih antara total naif dan total idempoten adalah ukuran kebohongan dashboard saat ini: Rp124.907.383.",
        "Bonus audit: 5 event memiliki `event_time` di masa depan (setelah tanggal partisinya). Mereka tidak mengubah total — tetapi bendera merah kualitas data yang wajib kamu laporkan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `partisi_telat`: ingest > 2 hari setelah tanggal partisi" },
        { id: "t2", text: "Hitung `partisi_hilang`: tanggal dalam rentang tanpa baris manifest" },
        { id: "t3", text: "Hitung `partisi_duplikat`: tanggal yang muncul >1× di manifest" },
        { id: "t4", text: "Agregasi idempoten: `total_pendapatan`, `n_duplikat_dihapus`, `n_event_masa_depan`, `pendapatan_2026_10_08`" },
      ],
      expected:
        "telat: 2026-09-28, 2026-10-02, 2026-10-09 | hilang: 2026-09-30 | duplikat: 2026-10-08 | total idempoten: 1.802.720.342 (naif: 1.927.627.725) | duplikat dihapus: 958 | masa depan: 5",
      hints: [
        "Ubah kolom tanggal jadi date: `pd.to_datetime(manifest[\"ingested_at\"]).dt.date`, lalu kurangkan dua kolom tanggal — `.apply(lambda d: d.days)` memberi selisih hari.",
        "Rentang penuh: `pd.date_range(manifest[\"partition_date\"].min(), manifest[\"partition_date\"].max())` — yang hilang = selisih himpunan dengan tanggal di manifest.",
        "Duplikat: `manifest.duplicated(\"partition_date\", keep=False)` menandai SEMUA kemunculan tanggal yang ganda.",
        "Idempoten: `events.drop_duplicates(\"event_id\")` — agregasi SELALU dari data unik ini, bukan dari data mentah.",
      ],
      note: {
        title: "Miskonsepsi #2: status “lengkap” = data lengkap",
        type: "pitfall",
        body: "Manifest adalah klaim yang ditulis oleh pipeline yang sama yang sedang kamu audit — mempercayainya mentah-mentah adalah konflik kepentingan. Di misi ini satu partisi berstatus “lengkap” dengan 0 baris diterima. Aturan auditor: status tidak pernah jadi bukti; bukti = hitungan baris aktual dibandingkan dengan ekspektasi.",
      },
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-etl-telat-backfill\"",
          "manifest = pd.read_csv(open_url(BASE + \"/manifest.csv\"))",
          "events = pd.read_csv(open_url(BASE + \"/event_log.csv\"))",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "",
          "# t1: partisi yang di-ingest LEBIH DARI 2 hari setelah tanggal partisinya",
          "manifest[\"ingested_day\"] = ...",
          "manifest[\"tgl_partisi\"] = ...",
          "manifest[\"telat_hari\"] = ...",
          "partisi_telat = ...",
          "",
          "# t2: tanggal dalam rentang yang TIDAK punya baris manifest",
          "semua_tanggal = ...",
          "partisi_hilang = ...",
          "",
          "# t3: tanggal partisi yang muncul lebih dari sekali di manifest",
          "partisi_duplikat = ...",
          "",
          "# t4: agregasi IDEMPOTEN — satu event_id dihitung tepat satu kali",
          "n_duplikat_dihapus = ...",
          "unik = ...",
          "total_pendapatan = ...",
          "n_event_masa_depan = ...   # 10 char pertama event_time > partition_date",
          "pendapatan_2026_10_08 = ...",
          "",
          "print(\"telat:\", partisi_telat)",
          "print(\"hilang:\", partisi_hilang)",
          "print(\"duplikat:\", partisi_duplikat)",
          "print(\"total idempoten:\", total_pendapatan)",
          "print(\"duplikat dihapus:\", n_duplikat_dihapus, \"| masa depan:\", n_event_masa_depan)",
          "print(\"pendapatan 2026-10-08:\", pendapatan_2026_10_08)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-etl-telat-backfill\"",
          "manifest = pd.read_csv(open_url(BASE + \"/manifest.csv\"))",
          "events = pd.read_csv(open_url(BASE + \"/event_log.csv\"))",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "",
          "# t1: partisi yang di-ingest LEBIH DARI 2 hari setelah tanggal partisinya",
          "manifest[\"ingested_day\"] = pd.to_datetime(manifest[\"ingested_at\"]).dt.date",
          "manifest[\"tgl_partisi\"] = pd.to_datetime(manifest[\"partition_date\"]).dt.date",
          "manifest[\"telat_hari\"] = (manifest[\"ingested_day\"] - manifest[\"tgl_partisi\"]).apply(lambda d: d.days)",
          "partisi_telat = sorted(manifest.loc[manifest[\"telat_hari\"] > 2, \"partition_date\"].unique().tolist())",
          "",
          "# t2: tanggal dalam rentang yang TIDAK punya baris manifest",
          "semua_tanggal = pd.date_range(manifest[\"partition_date\"].min(), manifest[\"partition_date\"].max()).strftime(\"%Y-%m-%d\").tolist()",
          "partisi_hilang = sorted(set(semua_tanggal) - set(manifest[\"partition_date\"].tolist()))",
          "",
          "# t3: tanggal partisi yang muncul lebih dari sekali di manifest",
          "partisi_duplikat = sorted(manifest.loc[manifest.duplicated(\"partition_date\", keep=False), \"partition_date\"].unique().tolist())",
          "",
          "# t4: agregasi IDEMPOTEN — satu event_id dihitung tepat satu kali",
          "n_duplikat_dihapus = int(events.duplicated(\"event_id\").sum())",
          "unik = events.drop_duplicates(\"event_id\")",
          "total_pendapatan = int(unik[\"amount\"].sum())",
          "n_event_masa_depan = int((unik[\"event_time\"].str[:10] > unik[\"partition_date\"]).sum())",
          "pendapatan_2026_10_08 = int(unik.loc[unik[\"partition_date\"] == \"2026-10-08\", \"amount\"].sum())",
          "",
          "print(\"telat:\", partisi_telat)",
          "print(\"hilang:\", partisi_hilang)",
          "print(\"duplikat:\", partisi_duplikat)",
          "print(\"total idempoten:\", total_pendapatan)",
          "print(\"duplikat dihapus:\", n_duplikat_dihapus, \"| masa depan:\", n_event_masa_depan)",
          "print(\"pendapatan 2026-10-08:\", pendapatan_2026_10_08)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`manifest` termuat", name: "manifest", msg: "manifest harus berisi DataFrame dari manifest.csv." },
          { kind: "equal", task: "t1", label: "`partisi_telat` tepat 3 tanggal", name: "partisi_telat", value: ["2026-09-28", "2026-10-02", "2026-10-09"], msg: "Telat = ingested_at lebih dari 2 hari setelah partition_date." },
          { kind: "equal", task: "t2", label: "`partisi_hilang` = 2026-09-30", name: "partisi_hilang", value: ["2026-09-30"], msg: "Satu tanggal dalam rentang tidak punya baris manifest sama sekali." },
          { kind: "equal", task: "t3", label: "`partisi_duplikat` = 2026-10-08", name: "partisi_duplikat", value: ["2026-10-08"], msg: "Satu tanggal muncul dua kali dengan ingested_at berbeda." },
          { kind: "equal", task: "t4", label: "`n_duplikat_dihapus` = 958", name: "n_duplikat_dihapus", value: 958, msg: "Hitung event_id yang muncul lebih dari sekali di event_log." },
          { kind: "equal", task: "t4", label: "`total_pendapatan` = 1.802.720.342", name: "total_pendapatan", value: 1802720342, msg: "Jumlahkan amount SETELAH drop_duplicates(event_id) — bukan dari data mentah." },
          { kind: "equal", task: "t4", label: "`n_event_masa_depan` = 5", name: "n_event_masa_depan", value: 5, msg: "Bandingkan 10 karakter pertama event_time dengan partition_date." },
          { kind: "equal", task: "t4", label: "`pendapatan_2026_10_08` = 124.907.383", name: "pendapatan_2026_10_08", value: 124907383, msg: "Agregat idempoten untuk partisi yang duplikat — tanpa dedupe angkanya 2× lipat." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Audit kilat dengan SQL",
      title: "Satu query untuk menemukan yang mencurigakan",
      prose: [
        "Tim finance memberimu tabel ringkas `manifest_audit(partition_date, status, rows_reported, rows_actual)` — 8 baris sampel. Mereka curiga ada yang tidak beres tetapi tidak bisa menunjuknya. Tulis satu query yang menemukan SEMUA partisi mencurigakan: yang berstatus “lengkap” tetapi baris aktualnya 0, ATAU yang tanggalnya muncul lebih dari sekali.",
        "Ini pola yang sama dengan Lab 1, diterjemahkan ke SQL — bahasa yang dipakai analis untuk audit cepat tanpa membuka notebook.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query partisi mencurigakan (lengkap-tapi-0 ATAU tanggal ganda), urut tanggal" },
      ],
      expected: "2 baris: 2026-10-04 (lengkap tapi 0 baris) dan 2026-10-08 (muncul 2×)",
      sqlLab: {
        task: "Temukan partisi mencurigakan: status 'lengkap' tetapi rows_actual = 0, ATAU partition_date muncul lebih dari sekali. Tampilkan DISTINCT partition_date, urut menaik.",
        schema: "CREATE TABLE manifest_audit (partition_date TEXT, status TEXT, rows_reported INT, rows_actual INT);",
        seedData: [
          "INSERT INTO manifest_audit VALUES",
          "('2026-10-04','lengkap',1001,0),",
          "('2026-10-08','lengkap',958,958),",
          "('2026-10-08','lengkap',958,958),",
          "('2026-10-09','lengkap',860,860),",
          "('2026-10-10','lengkap',751,751),",
          "('2026-10-11','lengkap',848,848),",
          "('2026-10-12','lengkap',984,984),",
          "('2026-10-13','lengkap',912,912);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT DISTINCT partition_date\nFROM manifest_audit\n",
        solution: [
          "SELECT DISTINCT partition_date",
          "FROM manifest_audit",
          "WHERE (status = 'lengkap' AND rows_actual = 0)",
          "   OR partition_date IN (",
          "        SELECT partition_date FROM manifest_audit",
          "        GROUP BY partition_date HAVING COUNT(*) > 1)",
          "ORDER BY partition_date;",
        ].join("\n"),
        expectedColumns: ["partition_date"],
        expectedRows: [
          ["2026-10-04"],
          ["2026-10-08"],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiEtlTelat;

// ── lanjutan misiEtlTelat: langkah 5–12 ──────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_ETL: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Backfill minggu depan: strategi apa yang jadi standar?",
    prose: [
      "Audit selesai, agregasi idempoten terbukti. Sekarang keputusan organisasi: backfill minggu depan memakai strategi apa sebagai standar tim? Ini bukan kuis — tidak ada jawaban “benar”. Setiap opsi mengubah apa yang terjadi padamu dan tim sesudahnya. Pilih seperti kamu akan mempertahankannya di depan Head of Finance.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Strategi backfill apa yang kamu tetapkan sebagai standar tim? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-rebuild",
          label: "Rebuild idempoten penuh dari event mentah",
          rationale:
            "Satu-satunya cara angka “final” bisa dipercaya: agregasi selalu dedupe event_id, backfill = rebuild dari event mentah, bukan patch angka. Mahal di awal, murah selamanya.",
          nextStepId: "cabang-rebuild",
          consequenceNote:
            "Kamu lembur dua akhir pekan membangun ulang pipeline. Sejak itu angka final tidak pernah bergeser lagi — finance berhenti menelepon. Mahal, tapi ini terakhir kalinya masalah ini muncul.",
        },
        {
          id: "opt-patch",
          label: "Patch manual per kejadian",
          rationale:
            "Hapus duplikat 10-08, isi 10-04 dari backup, jalan terus. Cepat, tidak mengganggu sprint, tidak ada lembur.",
          nextStepId: "cabang-patch",
          consequenceNote:
            "Dua minggu tenang. Lalu partisi 10-19 duplikat lagi — dengan pola berbeda yang tidak kamu antisipasi. Kamu memadamkan kebakaran yang sama setiap bulan, selamanya.",
        },
        {
          id: "opt-tunda",
          label: "Tandai “preliminary”, rilis final belakangan",
          rationale:
            "Jangan rilis angka final sampai semua partisi tiba lengkap. Jujur soal ketidakpastian — tidak ada angka yang diklaim final padahal belum.",
          nextStepId: "cabang-tunda",
          consequenceNote:
            "Dashboard “preliminary” diabaikan direksi — mereka tetap memakai angka itu untuk keputusan, hanya sekarang tanpa rasa bersalah. Label tidak mengubah perilaku; yang berubah hanya siapa yang disalahkan.",
        },
      ],
    },
  },
  {
    id: "cabang-rebuild",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: rebuild idempoten",
    prose: [
      "Kamu memilih jalan berat: pipeline dibangun ulang. Setiap agregasi membaca event mentah, dedupe berbasis `event_id` (dengan unique constraint di tabel staging agar duplikat tidak bisa masuk dua kali), dan backfill didefinisikan sebagai rebuild penuh per partisi — bukan patch angka.",
      "Dua akhir pekan lembur. Lalu Senin pagi yang aneh: tidak ada telepon dari finance. Angka final 25 September–12 Oktober tidak bergeser satu rupiah pun sejak rebuild. Head of Finance mengirim satu kalimat: “Akhirnya angkanya diam.” Mahal — tapi ini terakhir kalinya masalah ini muncul.",
    ],
    tasks: [],
    note: {
      title: "Kenapa rebuild menang",
      body: "Idempotensi bukan fitur tambahan — ia adalah definisi “final”. Angka yang berubah saat dihitung ulang bukan angka final, melainkan angka sementara yang berbohong soal statusnya.",
    },
  },
  {
    id: "cabang-patch",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: patch manual",
    prose: [
      "Kamu memilih jalan cepat: hapus 958 duplikat partisi 2026-10-08, isi partisi 2026-10-04 dari backup, angka kembali “benar”. Tidak ada yang diubah di pipeline — sprint berjalan normal, tidak ada lembur.",
      "Tiga minggu kemudian partisi 10-19 ter-ingest dua kali — kali ini bukan karena retry, melainkan karena job scheduler yang overlap. Polanya berbeda, patch-mu tidak mengenalinya, dan angka final bergeser lagi. Kamu memadamkan kebakaran yang sama setiap bulan, selamanya — karena yang diperbaiki gejalanya, bukan penyakitnya: pipeline yang tidak idempoten.",
    ],
    tasks: [],
    note: {
      title: "Patch vs perbaikan",
      body: "Patch menjawab “bagaimana angka hari ini jadi benar”; perbaikan menjawab “bagaimana angka besok tetap benar”. Keduanya terlihat sama di minggu pertama — bedanya baru terlihat di insiden kedua.",
    },
  },
  {
    id: "cabang-tunda",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: label “preliminary”",
    prose: [
      "Kamu memilih kejujuran prosedural: dashboard diberi label “preliminary” sampai semua partisi tiba lengkap; angka final hanya dirilis setelahnya. Tidak ada angka yang diklaim final padahal belum.",
      "Direksi tetap memakai angka “preliminary” untuk keputusan — hanya sekarang tanpa rasa bersalah, karena “kan sudah diberi label”. Ketika angka bergeser, yang disalahkan labelnya, bukan datanya. Label tidak mengubah perilaku; ia hanya memindahkan akuntabilitas. Tiga bulan kemudian seseorang bertanya: “Kenapa angka final kita selalu telat seminggu?” — dan jawabannya adalah keputusanmu hari ini.",
    ],
    tasks: [],
    note: {
      title: "Label bukan kontrol",
      body: "Menandai data “preliminary” adalah komunikasi, bukan pengendalian kualitas. Kontrol = mekanisme yang mencegah angka salah terbit (constraint, verifikasi, idempotensi). Tanpa kontrol, label hanya memperhalus kebohongan.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 18 baris: laporan kesiapan yang “final” itu bohong",
    prose: [
      "Sebelum menulis runbook, satu misi audit. Di bawah ini 18 baris “Laporan Kesiapan Partisi — 12 Okt”, dokumen yang diklaim final oleh tim ingest. Tiga suntikan disembunyikan di dalamnya. Senjatamu: hasil Lab 1 dan Lab 2.",
      "Untuk setiap baris yang mencurigakan, catat: apa kejanggalannya, baris bukti pendukungnya, dan apa bahayanya bila lolos ke dashboard.",
    ],
    tasks: [],
    auditDossier: {
      version: "etl-m2a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Kesiapan Partisi 12 Okt yang menyatakan semua partisi “lengkap & final”.",
      columns: ["Partisi", "Status manifest", "Baris diterima", "Klaim"],
      rows: [
        { rowId: 1, cells: { "Partisi": "2026-09-25", "Status manifest": "lengkap", "Baris diterima": "927", "Klaim": "Final" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 2, cells: { "Partisi": "2026-09-26", "Status manifest": "lengkap", "Baris diterima": "874", "Klaim": "Final" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 3, cells: { "Partisi": "2026-09-27", "Status manifest": "lengkap", "Baris diterima": "634", "Klaim": "Final" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 4, cells: { "Partisi": "2026-09-28", "Status manifest": "lengkap", "Baris diterima": "1.027", "Klaim": "Final (telat 3 hari)" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 5, cells: { "Partisi": "2026-09-29", "Status manifest": "lengkap", "Baris diterima": "683", "Klaim": "Final" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 6, cells: { "Partisi": "2026-10-01", "Status manifest": "lengkap", "Baris diterima": "895", "Klaim": "Final" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 7, cells: { "Partisi": "2026-10-02", "Status manifest": "lengkap", "Baris diterima": "857", "Klaim": "Final (telat 3 hari)" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 8, cells: { "Partisi": "2026-10-03", "Status manifest": "lengkap", "Baris diterima": "736", "Klaim": "Final" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        // ── I1: "lengkap" palsu ──
        { rowId: 9, cells: { "Partisi": "2026-10-04", "Status manifest": "lengkap", "Baris diterima": "0", "Klaim": "Final" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 10, cells: { "Partisi": "2026-10-05", "Status manifest": "lengkap", "Baris diterima": "818", "Klaim": "Final (telat 2 hari)" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 11, cells: { "Partisi": "2026-10-06", "Status manifest": "lengkap", "Baris diterima": "938", "Klaim": "Final" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 12, cells: { "Partisi": "2026-10-07", "Status manifest": "lengkap", "Baris diterima": "842", "Klaim": "Final" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        // ── I2: duplikat dua timestamp ──
        { rowId: 13, cells: { "Partisi": "2026-10-08", "Status manifest": "lengkap", "Baris diterima": "958", "Klaim": "Final (ingest 09:12)" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 14, cells: { "Partisi": "2026-10-08", "Status manifest": "lengkap", "Baris diterima": "958", "Klaim": "Final (ingest 14:47)" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 15, cells: { "Partisi": "2026-10-09", "Status manifest": "lengkap", "Baris diterima": "860", "Klaim": "Final (telat 3 hari)" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 16, cells: { "Partisi": "2026-10-10", "Status manifest": "lengkap", "Baris diterima": "751", "Klaim": "Final" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        { rowId: 17, cells: { "Partisi": "2026-10-11", "Status manifest": "lengkap", "Baris diterima": "848", "Klaim": "Final (telat 2 hari)" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
        // ── I3: event masa depan ──
        { rowId: 18, cells: { "Partisi": "2026-10-12", "Status manifest": "lengkap", "Baris diterima": "984", "Klaim": "Final" }, claims: [{ label: "Klaim", value: "Lengkap & final" }] },
      ],
      injections: [
        { key: "lengkap-palsu", rowIds: [9], title: "Status “lengkap” palsu", clue: "Baris 9: partisi 2026-10-04 berstatus “lengkap” dengan 0 baris diterima — tidak ada satu pun event-nya di event_log. Bandingkan dengan Lab 1: partisi ini memang kosong.", danger: "Dashboard yang percaya manifest menampilkan Rp0 untuk hari itu — finance mengira hari itu sepi, padahal datanya tidak pernah tiba." },
        { key: "duplikat-timestamp", rowIds: [13, 14], title: "Partisi duplikat, dua timestamp", clue: "Baris 13–14: partisi 2026-10-08 muncul dua kali (ingest 09:12 dan 14:47). Di event_log, 958 event_id muncul tepat dua kali — retry tanpa idempotency key.", danger: "Agregat naif menghitung 2× lipat: Rp124.907.383 revenue hantu. Obatnya satu baris: unique constraint di event_id." },
        { key: "masa-depan", rowIds: [18], title: "Event dari masa depan", clue: "Baris 18 terlihat bersih — tetapi 5 event ber-partition_date 2026-10-12 memiliki event_time 2026-10-20, lima hari setelah “hari ini”.", danger: "Tidak mengubah total, tetapi merusak setiap analisis berbasis waktu: cohort, funnel, dan SLA menjadi tidak bisa dipercaya." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Runbook backfill untuk tim",
    prose: [
      "Terakhir: artefak portofoliomu — runbook backfill satu halaman untuk tim. Runbook yang baik membuat insiden berikutnya membosankan: siapa pun yang piket bisa mengikuti langkahnya tanpa meneleponmu jam 2 pagi.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan temuan audit: partisi telat/hilang/duplikat + 1 partisi “lengkap” palsu — dengan nomor baris bukti.",
        "Metodologi agregasi idempoten: dedupe berbasis event_id, definisi “final”, dan bukti total stabil (angka naif vs idempoten).",
        "Runbook backfill langkah-demi-langkah: deteksi → verifikasi manifest-vs-aktual → rebuild per partisi → validasi ulang.",
        "Rekomendasi guardrail: unique constraint event_id, alert keterlambatan >2 hari, job verifikasi harian manifest-vs-aktual.",
        "Batas & risiko sisa: apa yang TIDAK ditangani runbook ini (mis. event_time masa depan, perubahan skema event).",
      ],
      rubric: [
        { criterion: "Kebenaran audit partisi", weight: 30, levels: ["Partisi bermasalah tidak teridentifikasi", "Sebagian teridentifikasi tanpa bukti baris", "Telat/hilang/duplikat/“lengkap” palsu — semua dengan bukti"] },
        { criterion: "Idempotensi agregasi", weight: 25, levels: ["Agregasi masih menghitung duplikat", "Dedupe ada tetapi definisi kabur", "Dedupe event_id + bukti total stabil (1.802.720.342)"] },
        { criterion: "Kualitas runbook", weight: 25, levels: ["Langkah tidak bisa diikuti orang lain", "Bisa diikuti, tanpa validasi", "Langkah + validasi + kriteria selesai yang eksplisit"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim runbook menyelesaikan segalanya", "Menyebut sebagian batas", "Batas (event masa depan, schema drift) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Tiga suntikan di laporan kesiapan partisi:",
      "1) **“Lengkap” palsu** (baris 9): partisi 2026-10-04 berstatus “lengkap” dengan 0 baris diterima — tidak ada satu pun event-nya di event_log. Dashboard yang jujur menampilkan hari itu sebagai “data belum tersedia”; dashboard yang percaya manifest menampilkan Rp0 — dan finance mengira hari itu sepi.",
      "2) **Duplikat dua timestamp** (baris 13–14): partisi 2026-10-08 muncul dua kali dengan `ingested_at` 09:12:33 dan 14:47:05. Klasik retry tanpa idempotency key: 958 event dihitung dua kali, menggelembungkan revenue Rp124.907.383. Obatnya satu baris: unique constraint di `event_id`.",
      "3) **Event dari masa depan** (baris 18): 5 event ber-`partition_date` 2026-10-12 tetapi `event_time` 2026-10-20 — lima hari setelah “hari ini”. Penyebab klasik: jam server tidak sinkron atau event yang di-replay. Tidak memengaruhi total, tetapi merusak setiap analisis berbasis waktu.",
      "Skor deteksimu (x/3) mengukur satu kebiasaan: memverifikasi klaim terhadap data mentah, bukan memercayai stempel “lengkap”. Dan ingat keputusan bercabangmu — rebuild, patch, atau tunda — tidak ada opsi yang gratis. Insinyur data yang baik bukan yang tidak pernah memilih jalan cepat, melainkan yang tahu harga jalan cepat dan menuliskannya sebelum insiden kedua datang.",
    ],
    tasks: [],
    note: {
      title: "Bahaya nyata: angka “final” yang hidup",
      type: "risk",
      body: "Di dunia nyata, dashboard revenue yang bergeser diam-diam merusak lebih dari kepercayaan: forecast meleset, bonus dihitung dari angka yang salah, dan audit eksternal menemukan “pengendalian tidak memadai”. Idempotensi pipeline bukan kemewahan arsitektur — ia adalah prasyarat sebuah angka boleh disebut final.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Audit manifest 18 partisi: telat >2 hari = 2026-09-28, 2026-10-02, 2026-10-09; hilang = 2026-09-30; duplikat = 2026-10-08 (2× ingest).",
      "Agregasi idempoten = dedupe event_id sebelum menjumlah: total stabil 1.802.720.342 vs total naif 1.927.627.725 (selisih 124.907.383 dari 958 duplikat).",
      "Tiga pola sabotase kesiapan data: status “lengkap” palsu (0 baris), partisi duplikat dua timestamp, event_time di masa depan.",
      "Keputusan backfill selalu punya harga: rebuild (mahal sekali, murah selamanya), patch (cepat, insiden berulang), tunda-dengan-label (jujur di kertas, diabaikan di praktik).",
      "Data: 100% SINTETIS (generator Python seed 42), dibuat 2026-10-15 — pola kegagalannya nyata, angkanya fiksi.",
    ],
  },
];

(misiEtlTelat.steps as V2Step[]).push(...LANJUTAN_ETL);

import type { V2Mission } from "../lib/types";

// ── MISI LINEAGE: Skema Berubah, Tak Ada yang Tahu ─────────────────────
// M2 grup DATA-ENGINEERING, track Data Management — Misi B (edge).
// Dataset: 100% SINTETIS (generator build-misi/gen_misi_lineage.py,
// seed 7, dibekukan 2026-10-15). File: public/misi/misi-lineage-terputus/
// (skema_v1.csv, skema_v2.csv, changelog.csv, pipeline.csv,
// audit_log.csv + METODE.md).

const BASE = "/misi/misi-lineage-terputus";

export const misiLineageTerputus: V2Mission = {
  slug: "misi-lineage-terputus",
  track: "Data Management",
  module: "Misi",
  title: "Misi Lineage: Skema Berubah, Tak Ada yang Tahu",
  estMinutes: 150,
  role: "Data engineer",
  client:
    "Head of Data — tiket #4812: laporan pendapatan harian turun 55% tanpa penjelasan; tim upstream mengklaim tidak ada perubahan breaking",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Pendapatan turun 55% — dan tidak ada yang error",
      prose: [],
      tasks: [
        { id: "t1", text: "Baca cerita misi sampai selesai" },
        { id: "t2", text: "Catat 3 tujuan terukur misimu" },
      ],
      briefing: {
        role: "Data engineer di PT Bank Cakrawala Digital (fiktif) — pemilik pipeline downstream",
        client:
          "Head of Data. Jumat 09:00, analis Rina mengirim tiket #4812 dengan huruf kapital semua: “PENDAPATAN HARIAN TURUN 55%, DATA HILANG??” Dashboard pendapatan pagi itu menunjukkan setengah transaksi menguap. Tidak ada error di log ETL. Tidak ada alert yang bunyi. Tim upstream — pemilik tabel transaksi — menjawab santai: “Tidak ada perubahan breaking di sisi kami.” Seseorang berbohong, atau seseorang tidak tahu. Kamu diminta mencari tahu yang mana.",
        story: [
          "Kamu membuka dashboard itu sendiri. Grafiknya tidak menunjukkan error — ia menunjukkan ketiadaan: batang-batang yang seharusnya ada, tidak ada. Seperti kota yang setengah penduduknya hilang tanpa jejak, tanpa jeritan. Pipeline-mu berjalan “sukses” setiap malam. Query-mu tidak melempar satu exception pun. Dan justru itu yang menakutkan.",
          "Kamu tahu polanya. Ini bukan bug — ini schema drift: perubahan skema diam-diam di hulu. Kolom di-rename tanpa pemberitahuan. Tipe data berubah. Makna kolom bergeser sementara namanya tetap. Downstream tidak error; ia hanya diam-diam menjadi salah. Join yang dulu cocok kini tidak cocok — dan baris-baris yang tidak cocok itu tidak protes, mereka hanya hilang.",
          "Misimu: buktikan apa yang berubah antara skema v1 dan v2, temukan baris-baris yang “hilang”, petakan pipeline mana saja yang terdampak, temukan kebohongan di klaim tim upstream, dan rancang data contract agar ini tidak terulang. Semua data di misi ini 100% sintetis — tapi tiket #4812 seperti ini terjadi setiap minggu di industri.",
        ],
        objectives: [
          "Melakukan diff skema v1 vs v2 dan mengklasifikasikan setiap perubahan: hilang, baru, tipe berubah, makna berubah, kandidat rename (Lab 1 — Python).",
          "Menemukan baris yang “hilang” dari laporan akibat join yang pecah pasca-rename (Lab 2 — SQL).",
          "Memetakan pipeline terdampak, menemukan 5 suntikan di klaim tim upstream, dan menulis laporan root-cause + draf data contract v1.",
        ],
        prereqSummary:
          "Lineage = peta aliran data antar tabel dan pipeline: siapa membaca dari siapa. Schema drift = perubahan skema diam-diam (rename, ubah tipe, ubah makna) yang tidak diumumkan sebagai breaking change. Data contract = perjanjian tertulis antara produsen dan konsumen data: definisi tiap kolom, pemiliknya, dan aturan main perubahannya. Tiga konsep ini cukup; sisanya kamu buktikan sendiri.",
        datasetNote:
          "STATUS DATA: 100% SINTETIS — tidak ada data nyata, tidak ada PII nyata. “PT Bank Cakrawala Digital”, semua tim, kolom, angka, dan tiket adalah fiktif.\nIsi: skema_v1.csv (6 kolom, pra-perubahan), skema_v2.csv (7 kolom, pasca-perubahan), changelog.csv (4 entri — SENGAJA tidak mencatat satu rename), pipeline.csv (7 pipeline downstream), audit_log.csv (7 baris kronologi fiktif).\nGenerator: build-misi/gen_misi_lineage.py, seed 7, dibekukan 2026-10-15. Metode: METODE.md di folder yang sama.\nKejujuran: di dunia nyata diff dibaca dari schema registry / migration log, bukan dari dua file CSV — ini miniaturnya.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Lima file, dua versi kebenaran",
      prose: [
        "`skema_v1.csv` adalah skema tabel `transaksi` per 1 September — 6 kolom, dunia yang tertib. `skema_v2.csv` adalah skema per 2 September — 7 kolom, dunia setelah “tidak ada perubahan breaking”. Tugas pertamamu: temukan sendiri apa yang berbeda. Jangan percaya siapa pun dulu.",
        "`changelog.csv` adalah klaim resmi tim upstream: 4 entri perubahan. `audit_log.csv` adalah catatan mesin: 7 baris tentang apa yang SEBENARNYA terjadi — termasuk rentetan deploy jam 03:12 sampai 03:15. Dua dokumen ini tidak sepakat, dan ketidaksepakatan itu adalah inti misimu.",
        "`pipeline.csv` adalah daftar 7 pipeline downstream-mu: kolom apa yang mereka baca, statusnya. Satu di antaranya mengklaim “lolos tanpa error” — ingat kalimat itu baik-baik.",
        "Aturan main: (1) diff dihitung dari file skema, bukan dari klaim; (2) changelog adalah kesaksian, audit log adalah bukti forensik — saat keduanya bertentangan, bukti menang; (3) “tidak error” bukan vonis “tidak rusak”.",
      ],
      tasks: [
        { id: "t1", text: "Buka `skema_v1.csv` dan `skema_v2.csv`: catat perbedaan kasatmata" },
        { id: "t2", text: "Buka `changelog.csv` vs `audit_log.csv`: tandai yang tidak sinkron" },
        { id: "t3", text: "Buka `pipeline.csv`: tandai pipeline yang mengklaim “lolos tanpa error”" },
      ],
      note: {
        title: "Miskonsepsi #1: tidak ada error = tidak ada yang rusak",
        type: "pitfall",
        body: "“Pipeline sukses, jadi data benar.” SALAH — dan inilah jebakan paling mahal di data engineering. Error itu berisik dan jujur; yang berbahaya adalah silent breakage: join yang diam-diam kehilangan baris, agregasi yang diam-diam menjumlahkan teks, filter yang diam-diam tidak cocok lagi. Semua query tetap jalan. Semua angka bergeser. Tidak ada yang berteriak. Pelajaran misi ini: kebenaran data tidak dibuktikan oleh tidak adanya error, melainkan oleh rekonsiliasi yang aktif.",
      },
      reference:
        "skema_v1.csv + skema_v2.csv (diff) vs changelog.csv (klaim) + audit_log.csv (bukti) + pipeline.csv (korban). Semua 100% sintetis.",
    },
    {
      id: "lab-diff",
      eyebrow: "Langkah 3 · Lab 1 — Bedah skema",
      title: "Delapan perbedaan, lima di antaranya breaking",
      prose: [
        "Buktikan dengan kode, bukan firasat. Bandingkan `skema_v1.csv` dan `skema_v2.csv` kolom per kolom, lalu klasifikasikan setiap perbedaan ke dalam 5 jenis: HILANG (ada di v1, tidak di v2), BARU (sebaliknya), TIPE BERUBAH (nama sama, tipe beda), MAKNA BERUBAH (nama dan tipe sama, deskripsi beda), dan KANDIDAT RENAME (kolom hilang + kolom baru yang namanya mirip).",
        "Kandidat rename dideteksi dengan kemiripan nama (SequenceMatcher, ambang 0,7) — tapi ingat: kemiripan nama BUKAN bukti rename. Itu hanya daftar tersangka; putusannya ada di audit log pada Langkah 5.",
      ],
      tasks: [
        { id: "t1", text: "Muat kedua skema; bangun himpunan `kolom_v1` dan `kolom_v2`" },
        { id: "t2", text: "Hitung kolom `hilang`, `baru`, `n_hilang`, `n_baru`" },
        { id: "t3", text: "Hitung `tipe_berubah` dan `makna_berubah` (nama sama, pembanding beda)" },
        { id: "t4", text: "Hitung `kandidat_rename` (kemiripan > 0,7) dan `n_kandidat_rename`" },
      ],
      expected:
        "hilang=2 (customer_id, cust_segment), baru=3 (cust_id, customer_segment, promo_code), tipe_berubah=1 (amount), makna_berubah=1 (trx_date), kandidat_rename=2",
      note: {
        title: "Miskonsepsi #2: nama mirip = rename yang sah",
        type: "pitfall",
        body: "Deteksimu akan menemukan 2 kandidat: (customer_id → cust_id) dan (cust_segment → customer_segment). Hanya SATU yang rename asli. Pasangan kedua adalah jebakan: cust_segment = segmen dari CRM (diisi manual), customer_segment = segmen hasil model ML (otomatis) — nama mirip, makna beda total. Kemiripan nama tidak membuktikan apa-apa; verifikasi makna lewat deskripsi dan audit log. Di dunia nyata, jebakan “nama mirip” membuat analis memakai kolom yang salah selama berbulan-bulan tanpa sadar.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(V1))` — tidak ada sel kosong di file ini.",
        "Himpunan kolom: `set(v1[\"kolom\"])`; hilang = `kolom_v1 - kolom_v2`, baru = sebaliknya; urutkan dengan `sorted` agar deterministik.",
        "Untuk tipe/makna: buat dict via `v1.set_index(\"kolom\")[\"tipe\"].to_dict()`, bandingkan hanya pada irisan `kolom_v1 & kolom_v2`.",
        "Kandidat rename: `SequenceMatcher(None, a, b).ratio() > 0.7` untuk setiap pasangan (hilang × baru).",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "from difflib import SequenceMatcher",
          "",
          "V1 = \"/misi/misi-lineage-terputus/skema_v1.csv\"",
          "V2 = \"/misi/misi-lineage-terputus/skema_v2.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "v1 = pd.read_csv(open_url(V1))",
          "v2 = pd.read_csv(open_url(V2))",
          "",
          "kolom_v1 = ...",
          "kolom_v2 = ...",
          "",
          "hilang = ...",
          "baru = ...",
          "n_hilang = ...",
          "n_baru = ...",
          "",
          "t1 = ...",
          "t2 = ...",
          "d1 = ...",
          "d2 = ...",
          "sama = ...",
          "",
          "tipe_berubah = ...",
          "n_tipe_berubah = ...",
          "",
          "makna_berubah = ...",
          "n_makna_berubah = ...",
          "",
          "kandidat_rename = ...",
          "n_kandidat_rename = ...",
          "",
          "print(\"hilang:\", hilang)",
          "print(\"baru:\", baru)",
          "print(\"tipe berubah:\", tipe_berubah, \"| makna berubah:\", makna_berubah)",
          "print(\"kandidat rename:\", kandidat_rename)",
        ].join("\n"),
        lockLines: 11,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "from difflib import SequenceMatcher",
          "",
          "V1 = \"/misi/misi-lineage-terputus/skema_v1.csv\"",
          "V2 = \"/misi/misi-lineage-terputus/skema_v2.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "v1 = pd.read_csv(open_url(V1))",
          "v2 = pd.read_csv(open_url(V2))",
          "",
          "kolom_v1 = set(v1[\"kolom\"])",
          "kolom_v2 = set(v2[\"kolom\"])",
          "",
          "hilang = sorted(kolom_v1 - kolom_v2)",
          "baru = sorted(kolom_v2 - kolom_v1)",
          "n_hilang = len(hilang)",
          "n_baru = len(baru)",
          "",
          "t1 = v1.set_index(\"kolom\")[\"tipe\"].to_dict()",
          "t2 = v2.set_index(\"kolom\")[\"tipe\"].to_dict()",
          "d1 = v1.set_index(\"kolom\")[\"deskripsi\"].to_dict()",
          "d2 = v2.set_index(\"kolom\")[\"deskripsi\"].to_dict()",
          "sama = kolom_v1 & kolom_v2",
          "",
          "tipe_berubah = sorted(k for k in sama if t1[k] != t2[k])",
          "n_tipe_berubah = len(tipe_berubah)",
          "",
          "makna_berubah = sorted(k for k in sama if t1[k] == t2[k] and d1[k] != d2[k])",
          "n_makna_berubah = len(makna_berubah)",
          "",
          "kandidat_rename = sorted(",
          "    (a, b) for a in hilang for b in baru",
          "    if SequenceMatcher(None, a, b).ratio() > 0.7",
          ")",
          "n_kandidat_rename = len(kandidat_rename)",
          "",
          "print(\"hilang:\", hilang)",
          "print(\"baru:\", baru)",
          "print(\"tipe berubah:\", tipe_berubah, \"| makna berubah:\", makna_berubah)",
          "print(\"kandidat rename:\", kandidat_rename)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`v1` dan `v2` termuat", name: "v1", msg: "v1 harus berisi DataFrame dari skema_v1.csv." },
          { kind: "equal", task: "t2", label: "`n_hilang` = 2", name: "n_hilang", value: 2, msg: "hilang = kolom_v1 - kolom_v2 (set difference)." },
          { kind: "equal", task: "t2", label: "`n_baru` = 3", name: "n_baru", value: 3, msg: "baru = kolom_v2 - kolom_v1." },
          { kind: "equal", task: "t3", label: "`n_tipe_berubah` = 1", name: "n_tipe_berubah", value: 1, msg: "Nama sama di irisan, tipe beda: hanya amount." },
          { kind: "equal", task: "t3", label: "`n_makna_berubah` = 1", name: "n_makna_berubah", value: 1, msg: "Nama + tipe sama, deskripsi beda: hanya trx_date." },
          { kind: "equal", task: "t4", label: "`n_kandidat_rename` = 2", name: "n_kandidat_rename", value: 2, msg: "Ambang kemiripan > 0,7: (customer_id,cust_id) dan (cust_segment,customer_segment)." },
        ],
      },
    },
  ],
};

export default misiLineageTerputus;

// ── lanjutan misiLineageTerputus: langkah 4–7 ──────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_LINEAGE: V2Step[] = [
  {
    id: "lab-sql",
    eyebrow: "Langkah 4 · Lab 2 — Baris yang hilang",
    title: "Join yang pecah tidak berteriak",
    prose: [
      "Sekarang buktikan mekanisme “hilangnya” pendapatan. Laporan downstream-mu menjalankan pola ini setiap malam: `transaksi JOIN pelanggan ON t.cust_id = p.customer_id`. Setelah rename diam-diam, sebagian baris transaksi memakai format ID baru (`004`) sementara tabel pelanggan masih memakai format lama (`C-004`). Join tidak error — ia hanya tidak cocok.",
      "Di tabel kecil ini: 5 pelanggan (`C-001` s.d. `C-005`) dan 6 transaksi — 3 masih berformat lama, 3 sudah berformat baru. Temukan transaksi YATIM: yang `cust_id`-nya tidak cocok dengan `customer_id` mana pun. Merekalah yang “hilang” dari laporan.",
    ],
    tasks: [
      { id: "t1", text: "Tulis query transaksi yatim (LEFT JOIN + IS NULL), urut abjad cust_id" },
    ],
    expected: "3 baris yatim — 004, 005, 006 — total Rp5.500.000 “hilang” dari laporan tanpa satu pun error",
    sqlLab: {
      task: "Temukan transaksi YATIM: cust_id yang TIDAK cocok dengan customer_id mana pun di tabel pelanggan. Tampilkan cust_id + amount, urut abjad cust_id.",
      schema: "CREATE TABLE pelanggan (customer_id TEXT, nama TEXT);\nCREATE TABLE transaksi (cust_id TEXT, amount INTEGER);",
      seedData: [
        "INSERT INTO pelanggan VALUES",
        "('C-001','Andi'),",
        "('C-002','Budi'),",
        "('C-003','Citra'),",
        "('C-004','Dewi'),",
        "('C-005','Eko');",
        "INSERT INTO transaksi VALUES",
        "('C-001',1500000),",
        "('C-002',2500000),",
        "('C-003',1000000),",
        "('004',3000000),",
        "('005',2000000),",
        "('006',500000);",
      ].join("\n"),
      starter: "-- Tulis query-mu di sini\nSELECT t.cust_id, t.amount\nFROM transaksi t\n",
      solution: [
        "SELECT t.cust_id, t.amount",
        "FROM transaksi t",
        "LEFT JOIN pelanggan p ON t.cust_id = p.customer_id",
        "WHERE p.customer_id IS NULL",
        "ORDER BY t.cust_id;",
      ].join("\n"),
      expectedColumns: ["cust_id", "amount"],
      expectedRows: [
        ["004", 3000000],
        ["005", 2000000],
        ["006", 500000],
      ],
      orderMatters: true,
    },
  },
  {
    id: "forensik",
    eyebrow: "Langkah 5 · Forensik — audit log",
    title: "Empat menit yang mengubah segalanya",
    prose: [
      "Buka `audit_log.csv` dan baca seperti penyidik. 2 September, jam 03:12 sampai 03:15 — empat menit, empat operasi oleh `deploy_bot`: RENAME kolom, ALTER tipe, ADD kolom, ubah deskripsi. Tidak ada jendela pemberitahuan. Tidak ada persetujuan downstream. Hanya bot yang bekerja di jam orang tidur.",
      "Lalu 5 September: tiket #4812 dari analis Rina — “pendapatan harian turun 55%”. Lalu 6 September: lead upstream mengklaim “tidak ada perubahan breaking” dan “changelog v2.0 lengkap”. Kronologinya tidak berbohong: klaim itu dibuat EMPAT HARI setelah deploy — cukup waktu untuk lupa, atau cukup waktu untuk menyusun cerita.",
      "Mini-case untukmu: bila kamu menjadi Rina pada 5 September — hanya bermodal dashboard yang turun dan log ETL yang “sukses” — dari mana kamu mulai? Jawabannya selalu sama: dari perubahan paling baru di hulu. Forensik data dimulai dari pertanyaan “apa yang berubah?”, bukan “apa yang error?”.",
    ],
    tasks: [
      { id: "t1", text: "Urutkan kronologi 2–6 September dari audit_log" },
      { id: "t2", text: "Identifikasi 4 operasi deploy_bot dalam 4 menit + apa yang hilang dari changelog" },
    ],
    note: {
      title: "Jam 03:12 adalah jam deploy — bukan jam pemberitahuan",
      type: "risk",
      body: "Perubahan skema di jam sepi tanpa pemberitahuan adalah pola klasik insiden data. Di dunia nyata, solusinya bukan “jangan deploy malam” — melainkan setiap perubahan skema otomatis tercatat di schema registry DAN disiarkan ke pemilik downstream SEBELUM merge. Pemberitahuan adalah bagian dari deploy, bukan sopan santun tambahan.",
    },
  },
  {
    id: "bedah-changelog",
    eyebrow: "Langkah 6 · Bedah changelog",
    title: "Dokumen resmi vs bukti mesin",
    prose: [
      "Sekarang letakkan `changelog.csv` dan `audit_log.csv` berdampingan. Changelog mencatat 4 entri: tambah `customer_segment`, tambah `promo_code`, ubah tipe `amount`, tambah `status` (versi lama). Audit log mencatat 7 baris — termasuk satu yang TIDAK ADA di changelog: `RENAME COLUMN customer_id TO cust_id` pada 03:12.",
      "Rename itulah yang memecahkan join-mu di Lab 2. Perubahan paling breaking justru yang tidak tercatat. Dan lead upstream mengklaim changelog “lengkap” — klaim yang kini terbukti salah oleh bukti mesin.",
      "Ini bukan soal niat jahat. Changelog ditulis manusia — manusia lupa, manusia menganggap rename “sepele”, manusia menulis dokumentasi belakangan. Audit log ditulis mesin — mesin tidak punya opini. Saat keduanya bertentangan, percayai mesin, lalu perbaiki proses manusianya.",
    ],
    tasks: [
      { id: "t1", text: "Daftarkan perubahan yang ada di audit log tapi TIDAK di changelog" },
      { id: "t2", text: "Tulis 2 kalimat: kenapa rename adalah perubahan paling breaking di kasus ini" },
    ],
    note: {
      title: "Miskonsepsi #3: changelog lengkap = semua perubahan tercatat",
      type: "pitfall",
      body: "“Sudah ada changelog, jadi aman.” SALAH — changelog hanya selengkap kedisiplinan penulisnya. Di kasus ini, changelog “lengkap” justru melewatkan satu-satunya perubahan yang memecahkan join. Pelajaran industri: dokumentasi manual adalah niat baik, bukan kontrol. Kontrol yang nyata adalah schema registry yang MENOLAK merge bila ada perubahan tak tercatat — mesin yang memaksa, bukan manusia yang diingatkan.",
    },
  },
  {
    id: "lab-dampak",
    eyebrow: "Langkah 7 · Lab 3 — Peta dampak",
    title: "Siapa saja korbannya?",
    prose: [
      "Satu tabel berubah, tujuh pipeline membaca. Dari `pipeline.csv`, petakan: pipeline aktif mana yang membaca kolom bermasalah (4 kolom dari Lab 1: `customer_id`, `amount`, `cust_segment`, `trx_date`)? Itulah daftar korbanmu.",
      "Dan perhatikan satu baris istimewa: `backup_mingguan` membaca `*` — SELECT bintang. Ia “lolos tanpa error” sejak v2. Di langkah audit nanti kamu akan menilai: apakah lolos = aman?",
    ],
    tasks: [
      { id: "t1", text: "Muat `pipeline.csv`" },
      { id: "t2", text: "Hitung pipeline aktif yang terdampak (`n_terdampak`)" },
      { id: "t3", text: "Temukan pipeline SELECT * (`n_select_bintang`)" },
    ],
    expected: "terdampak=4 (etl_harian, agg_pendapatan, dashboard_crm, laporan_keuangan); SELECT *=1 (backup_mingguan — “lolos” tapi paling rapuh)",
    note: {
      title: "SELECT * adalah bom waktu — bukan jalan pintas",
      type: "pitfall",
      body: "“Pakai SELECT * saja, praktis.” Praktis hari ini, rapuh selamanya. Pipeline SELECT * tidak tahu kolom apa yang ia baca: rename diam-diam tidak memecahkannya — ia hanya diam-diam membaca kolom yang salah. Arsip backup_mingguan kini menyimpan cust_id tanpa tahu itu dulunya customer_id. Pipeline yang “tidak pernah error” belum tentu benar; kadang ia hanya tidak pernah memeriksa.",
    },
    hints: [
      "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))`.",
      "Kolom bermasalah (dari Lab 1): customer_id, amount, cust_segment, trx_date — tulis lengkap sebagai \"transaksi.<nama>\" sesuai format di pipeline.csv.",
      "Saring dulu yang `status == \"aktif\"`, lalu cek `kolom_dipakai` dengan `isin(...)`.",
      "SELECT *: `kolom_dipakai == \"*\"` — hanya yang aktif.",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "URL = \"/misi/misi-lineage-terputus/pipeline.csv\"",
        "",
        "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
        "pipe = pd.read_csv(open_url(URL))",
        "",
        "kolom_bermasalah = [...]  # lengkapi dari hasil Lab 1: 4 kolom, format \"transaksi.<nama>\"",
        "",
        "aktif = ...",
        "terdampak = ...",
        "n_terdampak = ...",
        "",
        "select_bintang = ...",
        "n_select_bintang = ...",
        "",
        "print(\"terdampak:\", ...)",
        "print(\"SELECT *:\", ...)",
      ].join("\n"),
      lockLines: 8,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "URL = \"/misi/misi-lineage-terputus/pipeline.csv\"",
        "",
        "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
        "pipe = pd.read_csv(open_url(URL))",
        "",
        "kolom_bermasalah = [\"transaksi.customer_id\", \"transaksi.amount\",",
        "                    \"transaksi.cust_segment\", \"transaksi.trx_date\"]",
        "",
        "aktif = pipe[pipe[\"status\"] == \"aktif\"]",
        "terdampak = aktif[aktif[\"kolom_dipakai\"].isin(kolom_bermasalah)]",
        "n_terdampak = len(terdampak)",
        "",
        "select_bintang = aktif[aktif[\"kolom_dipakai\"] == \"*\"]",
        "n_select_bintang = len(select_bintang)",
        "",
        "print(\"terdampak:\", terdampak[\"pipeline\"].tolist())",
        "print(\"SELECT *:\", select_bintang[\"pipeline\"].tolist())",
      ].join("\n"),
      checks: [
        { kind: "defined", task: "t1", label: "`pipe` termuat", name: "pipe", msg: "pipe harus berisi DataFrame dari pipeline.csv." },
        { kind: "equal", task: "t2", label: "`n_terdampak` = 4", name: "n_terdampak", value: 4, msg: "Hanya pipeline AKTIF yang membaca 4 kolom bermasalah." },
        { kind: "equal", task: "t3", label: "`n_select_bintang` = 1", name: "n_select_bintang", value: 1, msg: "Cari kolom_dipakai == \"*\" pada pipeline aktif." },
      ],
    },
  },
];

(misiLineageTerputus.steps as V2Step[]).push(...LANJUTAN_LINEAGE);

// ── lanjutan misiLineageTerputus: langkah 8–9 (keputusan + cabang) ─────
const LANJUTAN_LINEAGE_2: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 8 · Checkpoint keputusan",
    title: "Upstream menolak rollback — apa responsmu?",
    prose: [
      "Buktimu lengkap: 8 perbedaan skema, 3 baris yatim senilai Rp5.500.000, 4 pipeline terdampak, 1 rename tak tercatat. Kamu bawa ke Head of Data — dan tim upstream menolak rollback: “v2 sudah terlanjur dipakai 5 hari, banyak yang sudah menyesuaikan.”",
      "Mereka tidak sepenuhnya salah: rollback buta bisa merusak yang sudah adaptasi. Tapi “biarkan saja” juga bukan jawaban — tanpa perubahan proses, tiket #4813 hanya soal waktu. Pilih responsmu. Tiap opsi mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [
      { id: "t1", text: "Baca ketiga opsi + rationale sebelum memilih (keputusan final)" },
    ],
    decision: {
      prompt:
        "Tim upstream menolak rollback. Respons apa yang kamu dorong ke Head of Data?",
      options: [
        {
          id: "opt-kontrak",
          label: "Data contract + schema registry: breaking change wajib versi mayor",
          rationale:
            "Masalahnya bukan insiden sekali ini — tanpa kontrak, deploy diam-diam berikutnya tinggal menunggu waktu. Perbaiki sistemnya, bukan gejalanya.",
          nextStepId: "cabang-kontrak",
          consequenceNote:
            "Head of Data setuju. Tiga bulan implementasi yang melelahkan — tapi deploy diam-diam berikutnya TERTAHAN otomatis oleh registry sebelum merge. Tiket #4812 tidak terulang. Kamu memperbaiki mesin, bukan menambal ban.",
        },
        {
          id: "opt-adaptasi",
          label: "Perbaiki semua downstream mengikuti v2 (tanpa kontrak formal)",
          rationale:
            "Pragmatis: v2 sudah jalan 5 hari. Perbaiki 4 pipeline yang terdampak, move on.",
          nextStepId: "cabang-adaptasi",
          consequenceNote:
            "Dua minggu lembur, 4 pipeline diperbaiki. Berhasil — sampai 6 bulan kemudian upstream mengubah skema diam-diam LAGI, dan kamu mengulang semuanya dari nol. Adaptasi tanpa kontrak = langganan lembur tiap ada deploy.",
        },
        {
          id: "opt-eskalasi",
          label: "Eskalasi ke CTO: paksa rollback ke v1",
          rationale:
            "Prinsip: produsen tidak boleh mengubah kontrak sepihak. Rollback mengirim sinyal keras ke seluruh organisasi.",
          nextStepId: "cabang-rollback",
          consequenceNote:
            "CTO memaksa rollback. Upstream marah — dan 2 pipeline yang sudah adaptasi ke v2 ikut rusak. Kamu menang prinsip, kalah koalisi: tiga bulan berikutnya setiap usulanmu dipersulit tim upstream.",
        },
      ],
    },
  },
  {
    id: "cabang-kontrak",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: data contract + schema registry",
    prose: [
      "Tiga bulan yang melelahkan. Kamu menulis definisi tiap kolom tabel `transaksi` — termasuk kalimat yang dulu tidak ada: “`trx_date` = tanggal settlement, BUKAN tanggal input”. Setiap perubahan skema kini wajib lewat registry: breaking change = versi mayor + pemberitahuan 14 hari + jendela migrasi. Merge yang melanggar DITOLAK otomatis — bukan diingatkan, ditolak.",
      "Tim upstream protes di bulan pertama: “birokrasi!”. Lalu datang deploy pertama di era baru: seorang engineer mencoba rename kolom diam-diam — dan registry menolak merge-nya sebelum sempat merusak apa pun. Protes berhenti hari itu juga.",
      "Setahun kemudian, tidak ada lagi tiket seperti #4812. Harga yang kamu bayar: tiga bulan membangun sistem saat semua orang ingin “cepat”. Pelajaran: kecepatan tanpa kontrak adalah utang yang dibayar dengan insiden.",
    ],
    tasks: [
      { id: "t1", text: "Catat 3 klausul wajib data contract untuk deliverable-mu" },
    ],
    note: {
      title: "Kontrak tanpa enforcement = dokumen hiasan",
      body: "Data contract yang hanya berupa dokumen Word akan bernasib sama seperti changelog: ditulis sekali, dilupakan. Yang membuatnya bekerja adalah enforcement otomatis — schema registry yang menolak merge melanggar. Tulis di deliverable-mu: siapa yang menegakkan, bukan hanya apa aturannya.",
    },
  },
  {
    id: "cabang-adaptasi",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: adaptasi tanpa kontrak",
    prose: [
      "Dua minggu lembur. Kamu memperbaiki `etl_harian` (baca `cust_id` sekarang), menulis parser untuk `amount` berformat teks “1.250.000”, mengganti filter `dashboard_crm` ke `customer_segment` — dan untuk `trx_date`, kamu mencatat di wiki tim: “sekarang artinya tanggal input”. Selesai. Dashboard kembali normal.",
      "Enam bulan kemudian, jam 02:47 pagi, ponselmu bunyi. Tiket #5177: “PENDAPATAN HARIAN TURUN 40%”. Upstream mengubah skema lagi — diam-diam, lagi. Kamu menatap langit-langit dan menyadari: kamu tidak memperbaiki apa pun enam bulan lalu. Kamu hanya menunda tagihan.",
      "Kali ini kamu tidak lembur memperbaiki downstream. Kamu menulis proposal data contract — dengan lampiran dua tiket, dua lembur, dan satu pola yang sama persis. Kadang orang butuh merasakan dua kali sebelum mau membangun sistem.",
    ],
    tasks: [
      { id: "t1", text: "Catat untuk deliverable: kenapa adaptasi tanpa kontrak adalah utang" },
    ],
    note: {
      title: "Menambal gejala vs memperbaiki sistem",
      body: "Adaptasi itu tidak salah — yang salah adalah BERHENTI di adaptasi. Pola yang benar: adaptasi dulu (padamkan api), lalu kontrak (pasang alarm kebakaran). Di deliverable-mu, tulis keduanya sebagai fase 1 dan fase 2.",
    },
  },
  {
    id: "cabang-rollback",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: eskalasi + rollback paksa",
    prose: [
      "CTO memihakmu. Rollback dieksekusi Jumat malam — dan Senin pagi, dua pipeline yang sudah adaptasi ke v2 rusak total. Tim upstream menatapmu di pantry dengan tatapan yang tidak perlu dijelaskan. Kamu memenangkan prinsip “produsen tidak boleh mengubah sepihak” — dan kehilangan koalisi yang kamu butuhkan untuk membangun apa pun setelahnya.",
      "Tiga bulan berikutnya, setiap usulanmu — termasuk proposal data contract yang sebenarnya bagus — dipersulit. Bukan karena idenya buruk, tapi karena kamu adalah “orang yang memaksa rollback”. Di organisasi, cara kamu menang menentukan apakah kamu bisa menang lagi besok.",
      "Pelajaran yang tidak diajarkan di buku data engineering: kebenaran teknis tanpa modal politik adalah kemenangan sekali pakai. Eskalasi adalah alat terakhir, bukan alat pertama.",
    ],
    tasks: [
      { id: "t1", text: "Catat untuk deliverable: kapan eskalasi tepat vs kapan merusak" },
    ],
    note: {
      title: "Kebenaran teknis ≠ kemenangan organisasi",
      body: "Datamu benar — rollback memang “seharusnya” terjadi. Tapi perubahan yang dipaksakan tanpa koalisi melahirkan resistensi yang lebih mahal dari insidennya. Validator yang baik membawa bukti; pemimpin yang baik membawa bukti DAN orang.",
    },
  },
];

(misiLineageTerputus.steps as V2Step[]).push(...LANJUTAN_LINEAGE_2);

// ── lanjutan misiLineageTerputus: langkah 10–13 ────────────────────────
const LANJUTAN_LINEAGE_3: V2Step[] = [
  {
    id: "audit",
    eyebrow: "Langkah 10 · Misi audit",
    title: "Dossier 16 baris: “Klaim Perubahan Skema v2.0”",
    prose: [
      "Sebelum menulis laporan root-cause, satu misi audit. Tim upstream merilis “Klaim Perubahan Skema v2.0” — 16 baris yang menurut mereka membuktikan “tidak ada perubahan breaking”. Lima suntikan disembunyikan di dalamnya.",
      "Senjatamu: diff v1→v2 versimu, 3 baris yatim, kronologi audit log 03:12–03:15, dan 4 pipeline terdampak. Uji setiap klaim terhadap bukti.",
    ],
    tasks: [
      { id: "t1", text: "Tandai setiap baris yang klaimnya bertentangan dengan bukti forensikmu" },
    ],
    auditDossier: {
      version: "lineage-m2b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai “Klaim Perubahan Skema v2.0” versi tim upstream — dinyatakan membuktikan tidak ada perubahan breaking.",
      columns: ["Perubahan", "Klaim tim upstream", "Status klaim"],
      rows: [
        // ── I1: rename tak tercatat ──
        { rowId: 1, cells: { "Perubahan": "customer_id → cust_id", "Klaim tim upstream": "Tidak ada perubahan pada kolom ID", "Status klaim": "dinyatakan aman" }, claims: [{ label: "Bukti", value: "Tidak ada" }] },
        // ── I3: ubah tipe diklaim sepele ──
        { rowId: 2, cells: { "Perubahan": "amount: DECIMAL → VARCHAR", "Klaim tim upstream": "Tercatat di changelog; hanya beda format tampilan", "Status klaim": "dinyatakan aman" }, claims: [{ label: "Dampak", value: "Tidak ada" }] },
        // ── I2: kolom mirip diklaim pengganti ──
        { rowId: 3, cells: { "Perubahan": "customer_segment (kolom baru)", "Klaim tim upstream": "Pengganti cust_segment", "Status klaim": "dinyatakan aman" }, claims: [{ label: "Definisi", value: "Sama dengan cust_segment" }] },
        { rowId: 4, cells: { "Perubahan": "cust_segment (kolom hilang)", "Klaim tim upstream": "Sudah digantikan; definisi sama", "Status klaim": "dinyatakan aman" }, claims: [{ label: "Migrasi", value: "Otomatis" }] },
        // ── I4: makna berubah diklaim tetap ──
        { rowId: 5, cells: { "Perubahan": "trx_date", "Klaim tim upstream": "Dokumentasi diperjelas, makna tetap", "Status klaim": "dinyatakan aman" }, claims: [{ label: "Makna", value: "Tidak berubah" }] },
        { rowId: 6, cells: { "Perubahan": "promo_code (kolom baru)", "Klaim tim upstream": "Kolom baru, tercatat di changelog", "Status klaim": "tercatat" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        { rowId: 7, cells: { "Perubahan": "channel", "Klaim tim upstream": "Tidak berubah", "Status klaim": "terverifikasi" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        { rowId: 8, cells: { "Perubahan": "status", "Klaim tim upstream": "Tidak berubah", "Status klaim": "terverifikasi" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        { rowId: 9, cells: { "Perubahan": "etl_harian", "Klaim tim upstream": "Terdampak — membaca customer_id yang sudah tidak ada", "Status klaim": "diakui" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        // ── I3 lanjutan: agg_pendapatan diklaim aman ──
        { rowId: 10, cells: { "Perubahan": "agg_pendapatan", "Klaim tim upstream": "Aman — tidak ada error sejak v2", "Status klaim": "dinyatakan aman" }, claims: [{ label: "Bukti", value: "Log ETL sukses" }] },
        { rowId: 11, cells: { "Perubahan": "dashboard_crm", "Klaim tim upstream": "Terdampak — filter cust_segment yang sudah hilang", "Status klaim": "diakui" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        // ── I5: SELECT * diklaim aman ──
        { rowId: 12, cells: { "Perubahan": "backup_mingguan", "Klaim tim upstream": "AMAN — tidak ada error sejak v2", "Status klaim": "dinyatakan aman" }, claims: [{ label: "Metode", value: "SELECT *" }] },
        { rowId: 13, cells: { "Perubahan": "laporan_keuangan", "Klaim tim upstream": "Terdampak — cutoff memakai trx_date yang maknanya berubah", "Status klaim": "diakui" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        { rowId: 14, cells: { "Perubahan": "etl_arsip", "Klaim tim upstream": "Tidak terdampak — hanya memakai channel", "Status klaim": "terverifikasi" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        { rowId: 15, cells: { "Perubahan": "notifikasi_wa", "Klaim tim upstream": "Nonaktif — tidak terdampak", "Status klaim": "terverifikasi" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        // ── I1 lanjutan: changelog diklaim lengkap ──
        { rowId: 16, cells: { "Perubahan": "changelog v2.0", "Klaim tim upstream": "Lengkap — semua perubahan tercatat", "Status klaim": "dinyatakan lengkap" }, claims: [{ label: "Verifikasi", value: "Internal tim upstream" }] },
      ],
      injections: [
        { key: "rename-tak-tercatat", rowIds: [1, 16], title: "Rename tidak tercatat di changelog", clue: "Baris 1 mengklaim “tidak ada perubahan pada kolom ID” dan baris 16 mengklaim changelog “lengkap” — tapi audit log 2026-09-02 03:12 mencatat RENAME COLUMN customer_id TO cust_id. Inilah perubahan yang memecahkan join-mu di Lab 2.", danger: "Perubahan yang tidak tercatat = perubahan yang tidak bisa diantisipasi downstream. Inilah definisi breaking change diam-diam." },
        { key: "kolom-mirip-beda-makna", rowIds: [3, 4], title: "Nama mirip diklaim sebagai pengganti", clue: "Baris 3–4 mengklaim customer_segment “pengganti” cust_segment dengan “definisi sama”. Deskripsi aslinya: cust_segment = segmen dari CRM (diisi manual), customer_segment = segmen hasil model ML (otomatis). Dashboard yang tertukar memfilter segmen yang salah total.", danger: "“Nama mirip” adalah jebakan paling mahal — analis memakai kolom yang salah selama berbulan-bulan tanpa sadar, karena query-nya tetap jalan." },
        { key: "tipe-berubah-dikecilkan", rowIds: [2, 10], title: "Ubah tipe diklaim “hanya format tampilan”", clue: "Baris 2 mengklaim VARCHAR “hanya beda format tampilan” dan baris 10 mengklaim agg_pendapatan “aman” karena log ETL sukses. Kenyataannya SUM('1.250.000') di engine downstream melempar error — atau lebih buruk, diam-diam mengembalikan 0. Log “sukses” hanya berarti query jalan, bukan angkanya benar.", danger: "Perubahan tipe tanpa migrasi = bom waktu agregasi. Dan “tidak ada error” bukan bukti kebenaran — itu pelajaran Lab 2." },
        { key: "makna-berubah-diam-diam", rowIds: [5], title: "Makna berubah diklaim “hanya dokumentasi”", clue: "Baris 5 mengklaim “makna tetap”. Deskripsi v1: “tanggal settlement”; v2: “tanggal input operator”. Laporan keuangan yang cutoff-nya memakai trx_date kini memotong periode yang salah — tanpa satu pun query yang berubah.", danger: "Perubahan makna tanpa ganti nama adalah sabotase paling sulit dideteksi: semua query tetap jalan, semua angka bergeser, tidak ada yang protes." },
        { key: "select-bintang-lolos", rowIds: [12], title: "“Aman” karena SELECT *", clue: "Baris 12 mengklaim backup_mingguan AMAN karena “tidak ada error sejak v2” — dengan metode SELECT *. Ia lolos justru karena tidak tahu kolom apa yang ia baca: arsipnya kini menyimpan cust_id tanpa tahu itu dulunya customer_id.", danger: "Pipeline yang tidak pernah error belum tentu benar — kadang ia hanya tidak pernah memeriksa. Arsip yang korup diam-diam adalah utang yang jatuh tempo saat audit." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 11 · Deliverable",
    title: "Laporan Root-Cause + Draf Data Contract v1",
    prose: [
      "Semua bukti di tangan. Tulis dua artefak portofoliomu: (1) laporan root-cause tiket #4812 — kronologi, bukti, dampak terukur; (2) draf data contract v1 untuk tabel `transaksi` — agar ini tidak terulang. Kontrak yang baik bukan dokumen hiasan: ia menyebut siapa menegakkan, bukan hanya apa aturannya.",
    ],
    tasks: [
      { id: "t1", text: "Tulis draf laporan + kontrak mengikuti template (di luar app, lalu bawa kembali)" },
    ],
    deliverable: {
      template: [
        "Ringkasan insiden (3 kalimat): apa yang terjadi di tiket #4812, akar masalahnya, dan dampak terukur (Rp5,5 jt “hilang” dari laporan).",
        "Bukti root-cause: diff v1→v2 (2 hilang, 3 baru, 1 tipe berubah, 1 makna berubah, 1 rename tak tercatat) + kronologi audit log 03:12–03:15 + 4 pipeline terdampak.",
        "Temuan audit dossier: 5 suntikan di klaim tim upstream, baris per baris — apa yang diklaim vs kenyataannya.",
        "Draf data contract v1 untuk tabel transaksi: definisi tiap kolom, pemilik kolom, dan aturan perubahan (breaking = versi mayor + pemberitahuan 14 hari + jendela migrasi + enforcement otomatis).",
        "Batas & risiko sisa: apa yang TIDAK dicakup (mis. kualitas isi data; kontrak butuh enforcement, bukan sekadar dokumen).",
      ],
      rubric: [
        { criterion: "Ketepatan diff", weight: 25, levels: ["Diff salah/tidak lengkap", "Sebagian kategori benar", "2 hilang / 3 baru / 1 tipe / 1 makna / 2 kandidat rename — semua tepat"] },
        { criterion: "Kekuatan bukti root-cause", weight: 25, levels: ["Menyalahkan tanpa bukti", "Ada bukti, kronologi kabur", "Kronologi 03:12–03:15 + 4 pipeline + Rp5,5 jt — runtut dan terukur"] },
        { criterion: "Deteksi suntikan", weight: 30, levels: ["Tidak menyebut suntikan", "Menyebut sebagian tanpa nomor baris", "Kelima suntikan disebut dengan nomor baris + bukti"] },
        { criterion: "Kualitas kontrak", weight: 20, levels: ["Kontrak tanpa aturan perubahan", "Ada aturan, kabur/tanpa enforcement", "Breaking = versi mayor + 14 hari + jendela migrasi + enforcement otomatis + pemilik kolom"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 12 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Lima suntikan di “Klaim Perubahan Skema v2.0”:",
      "1) **Rename tak tercatat** (baris 1, 16): “tidak ada perubahan pada kolom ID” + changelog “lengkap” — vs audit log 03:12 yang mencatat RENAME. Satu-satunya perubahan yang memecahkan join justru yang tidak tercatat. Inilah kenapa forensik dimulai dari log mesin, bukan dokumen manusia.",
      "2) **Nama mirip beda makna** (baris 3–4): customer_segment diklaim “pengganti” cust_segment. Manual CRM vs model ML — dua dunia berbeda dengan nama yang hampir sama. Kemiripan nama adalah tersangka, bukan vonis.",
      "3) **Ubah tipe dikecilkan** (baris 2, 10): “hanya format tampilan” + agg_pendapatan “aman”. SUM atas teks berformat “1.250.000” — error di engine yang jujur, nol diam-diam di engine yang tidak. “Tidak ada error” sekali lagi terbukti bukan bukti.",
      "4) **Makna berubah diam-diam** (baris 5): “dokumentasi diperjelas”. Settlement menjadi input operator — cutoff laporan keuangan bergeser tanpa satu pun query berubah. Ini sabotase paling senyap dari kelimanya.",
      "5) **“Aman” karena SELECT *** (baris 12): pipeline yang lolos justru yang paling rapuh — ia tidak tahu apa yang ia baca. Arsipnya kini korup secara diam-diam.",
      "Skor deteksimu (x/5) mengukur satu hal: apakah kamu menguji klaim terhadap bukti, atau memercayai kalimat “dinyatakan aman”. Dan ingat keputusan bercabangmu: kontrak memperbaiki mesin (mahal di depan, murah selamanya); adaptasi menambal gejala (murah di depan, langganan lembur); eskalasi memenangkan prinsip tapi menghabiskan modal politik. Tidak ada opsi gratis — hanya harga yang kamu pilih sadar.",
      "Bahaya nyata terakhir: schema drift tidak membunuh dengan error — ia membunuh dengan angka yang salah tapi terlihat benar. Laporan yang salah 55% selama berminggu-minggu sebelum ada yang sadar: itulah harga “tidak ada perubahan breaking”.",
    ],
    tasks: [
      { id: "t1", text: "Bandingkan temuanmu dengan 5 suntikan di atas; catat yang terlewat" },
    ],
    note: {
      title: "Tiga lapis pertahanan schema drift",
      type: "risk",
      body: "Lapis 1: schema registry — perubahan tak tercatat ditolak sebelum merge. Lapis 2: data contract — aturan perubahan tertulis + enforcement. Lapis 3: rekonsiliasi downstream — setiap pipeline kritis punya cek “apakah baris/angkaku masih masuk akal?” (seperti query yatim di Lab 2, dijalankan otomatis tiap hari). Satu lapis bisa jebol; tiga lapis jarang jebol bersamaan.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 13 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [
      { id: "t1", text: "Tutup misi: pastikan summary 5 poin di bawah kamu pahami" },
    ],
    summary: [
      "Diff v1→v2: 2 kolom hilang, 3 baru, 1 tipe berubah, 1 makna berubah, 2 kandidat rename — 8 perbedaan, 5 di antaranya breaking.",
      "Join yang pecah tidak melempar error: 3 transaksi yatim (Rp5.500.000) “hilang” dari laporan — silent breakage lebih berbahaya dari error.",
      "Lima pola sabotase perubahan skema: rename tak tercatat, nama mirip beda makna, ubah tipe yang dikecilkan, makna berubah diam-diam, “aman” karena SELECT *.",
      "Changelog ditulis manusia, audit log ditulis mesin — saat keduanya bertentangan, percayai mesin; data contract + enforcement mencegah, bukan mengobati.",
      "Data: 100% SINTETIS (generator seed 7, dibekukan 2026-10-15); di dunia nyata diff dibaca dari schema registry, bukan dua file CSV.",
    ],
  },
];

(misiLineageTerputus.steps as V2Step[]).push(...LANJUTAN_LINEAGE_3);

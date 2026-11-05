import type { V2Mission } from "../lib/types";

// ── Misi Indeks: Query Lambat dan Indeks Hantu ───────────────────────────
// M2 — Database Administrator Misi B (edge). Dataset: 100% SINTETIS
// (generator /tmp/build_misi_dba.py, seed 42): simulasi EXPLAIN +
// pg_stat_user_indexes + statistik tabel untuk skenario tuning indeks.
// File: public/misi/misi-indeks-hantu/*.csv + METODE.md.

const BASE = "/misi/misi-indeks-hantu";

export const misiIndeksHantu: V2Mission = {
  slug: "misi-indeks-hantu",
  track: "Database Administrator",
  module: "Misi",
  title: "Misi Indeks: Query Lambat dan Indeks Hantu",
  estMinutes: 150,
  role: "Database Administrator",
  client:
    "Head of Engineering — laporan keuangan bulanan melambat 40×; indeks “sudah ada semua” menurut DBA sebelumnya, tapi angka berkata lain",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Indeksnya ada. Query-nya tetap lambat. Kok bisa?",
      prose: [],
      tasks: [],
      briefing: {
        role: "Database Administrator — dipanggil untuk mengaudit performa database yang “sudah diindeks”",
        client:
          "Head of Engineering. Laporan keuangan bulanan yang biasanya selesai 3 detik kini memakan 2 menit — 40× lebih lambat. DBA sebelumnya bersikeras: “Indeksnya sudah ada semua, saya yang buat.” Tim engineering menunjuk database; DBA lama menunjuk kode aplikasi. Kamu dipanggil sebagai arbiter independen: buktikan dengan rencana eksekusi siapa yang benar, dan bereskan tanpa merusak yang sudah jalan.",
        story: [
          "Kamis, 16:40. Head of Engineering menunjukkan dua angka di layar: staging 180 ms, produksi 7.400 ms — query yang SAMA, laporan per kota yang SAMA. “Di staging ngebut, di produksi ngesot,” katanya. “DBA lama bilang indeksnya lengkap. Kalau indeksnya lengkap, kenapa planner memilih memindai 2,1 juta baris satu per satu?”",
          "Kamu tahu jawabannya sebelum membuka laptop: indeks yang ADA belum tentu indeks yang DIPAKAI. Indeks di atas kolom yang selalu dibungkus fungsi, indeks di atas tipe yang tidak cocok, statistik basi yang membuat planner buta — semua terlihat “ada” di daftar, semua tidak bekerja. Dan yang lebih licik: indeks yang tidak dipakai tetap MEMBAYAR pajak — setiap INSERT/UPDATE harus memeliharanya.",
          "Misi ini memakai data sintetis “Toko Warisan” jilid dua: 40 baris log query (simulasi EXPLAIN), 12 indeks, 3 tabel statistik. Tugasmu: baca rencana eksekusi, buru indeks hantu, hitung biaya sebelum/sesudah, temukan sabotase di dossier “semua indeks sehat”, dan putuskan nasib tiap indeks.",
        ],
        objectives: [
          "Mengidentifikasi query full table scan dari tabel simulasi rencana eksekusi dan mengurutkannya berdasarkan baris yang dipindai.",
          "Menemukan indeks hantu (tidak dipakai 30 hari tapi membebani write) dan menghitung biaya query sebelum/sesudah indeks yang tepat (rasio ~40×).",
          "Menemukan minimal 3 sabotase di dossier “semua indeks sehat” dan menulis rencana indeks (buat/pertahankan/drop) yang dipertahankan.",
        ],
        prereqSummary:
          "Indeks = daftar isi buku: tanpa indeks, database memindai tiap baris (Seq Scan / full table scan); dengan indeks yang tepat, ia melompat ke baris yang dicari (Index Scan). Rencana eksekusi (EXPLAIN) = keputusan planner tentang cara menjalankan query — di sinilah kamu melihat apakah indeks dipakai atau diabaikan. Statistik tabel = peta yang dipakai planner; peta basi = keputusan salah. Indeks hantu = indeks yang tidak pernah dipakai tapi tetap dibayar mahal lewat setiap operasi tulis.",
        datasetNote:
          "Sumber: 100% SINTETIS — dibangkitkan generator /tmp/build_misi_dba.py (seed 42). Meniru POLA keluaran EXPLAIN, pg_stat_user_indexes, dan pg_stat_all_tables PostgreSQL. BUKAN hasil EXPLAIN sungguhan, BUKAN statistik database produksi nyata.\nFile: query_log.csv (40 baris simulasi rencana), indeks.csv (12 indeks), statistik_tabel.csv (3 tabel).\nKejujuran: pola-pola (full scan, indeks hantu, statistik basi, skew staging-vs-produksi) disuntik SENGAJA sebagai bahan latihan; angka ms dan hitungan pemakaian dipilih untuk mengilustrasikan pola, bukan pengukuran nyata. Lab SQL memakai TABEL SIMULASI rencana eksekusi (bukan EXPLAIN sungguhan di sql.js) — dinyatakan eksplisit di langkah lab. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga file, satu kebohongan kolektif",
      prose: [
        "`query_log.csv` adalah 40 baris simulasi rencana eksekusi: tiap baris mencatat operasi yang dipilih planner (`Seq Scan` vs `Index Scan`), berapa baris dipindai vs total baris tabel, waktu dalam ms, dan indeks yang dipakai (kalau ada). `indeks.csv` adalah daftar 12 indeks: kolom yang diindeks, berapa kali dipakai 30 hari terakhir, ukuran, dan berapa tulis per hari yang harus memeliharanya. `statistik_tabel.csv` membandingkan baris TERCATAT (yang dipercaya planner) vs baris AKTUAL.",
        "Cara membaca ketiganya seperti detektif: query lambat + Seq Scan + baris_dipindai = baris_total → indeks hilang atau diabaikan. Indeks dengan dipakai_30_hari = 0 + tulis_per_hari besar → hantu yang membebani. baris_tercatat jauh dari baris_aktual → planner menyusun rencana dari peta yang salah.",
        "Aturan main: (1) tidak ada indeks yang di-drop sebelum kamu tahu SIAPA yang (tidak) memakainya; (2) “cepat di staging” bukan bukti — staging di misi ini hanya 1% sampel acak; (3) setiap rekomendasi indeks wajib menyebut query yang diuntungkan dan biaya write yang dibayar.",
      ],
      tasks: [
        { id: "t1", text: "Buka `query_log.csv`: temukan baris dengan operasi `Seq Scan` dan baris_dipindai = baris_total" },
        { id: "t2", text: "Buka `indeks.csv`: hitung berapa indeks dengan dipakai_30_hari = 0" },
        { id: "t3", text: "Buka `statistik_tabel.csv`: bandingkan baris_tercatat vs baris_aktual tabel orders" },
      ],
      note: {
        title: "Miskonsepsi #1: “indeks sudah ada = query pasti cepat”",
        type: "pitfall",
        body: "Keberadaan indeks tidak menjamin pemakaian. Planner mengabaikan indeks bila: kolom dibungkus fungsi (WHERE UPPER(email) vs indeks atas email), tipe tak cocok (kolom TEXT di-join ke INTEGER memaksa cast implisit), selektivitas buruk (indeks atas kolom kota di mana 90% baris satu kota), atau statistik basi (planner mengira tabel kecil). “Sudah ada indeks” adalah klaim tentang skema; “query cepat” adalah klaim tentang rencana eksekusi. Keduanya hal berbeda.",
      },
      reference:
        "query_log.csv (rencana, sintetis) + indeks.csv (daftar indeks) + statistik_tabel.csv (peta planner). Diagnosis dari ketiganya; vonis untuk klaim “semua sehat”.",
    },
    {
      id: "lab-rencana",
      eyebrow: "Langkah 3 · Lab 1 — Baca rencana eksekusi (SQL)",
      title: "Siapa yang memindai 2,1 juta baris?",
      prose: [
        "Rencana eksekusi adalah hasil rontgen query. Di lab ini kamu bekerja dengan tabel SIMULASI rencana eksekusi — karena sql.js di browser tidak menjalankan EXPLAIN sungguhan, dan itu dinyatakan jujur di sini. Tabel `rencana(query_id, operasi, baris_dipindai, baris_total, indeks_dipakai)` meniru kolom-kolom penting EXPLAIN.",
        "Targetmu: query yang melakukan full table scan — `operasi = 'Seq Scan'` DAN `baris_dipindai = baris_total` (planner menyerah dan membaca seluruh tabel). Tampilkan `query_id` dan `baris_dipindai`, urut dari pemindaian terbesar: itulah daftar tersangka utama kelambatan 40×.",
        "Catatan: Q07 juga Seq Scan tapi hanya memindai 500.000 dari 2.100.000 baris — itu bukan full scan (mungkin filter parsial atau limit). Jangan tangkap yang tidak bersalah.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query full scan: operasi Seq Scan + baris_dipindai = baris_total, urut terbesar" },
      ],
      expected: "3 baris — Q03 (2.100.000), lalu Q02 dan Q05 (1.000.000)",
      hints: [
        "Kondisi ganda: `WHERE operasi = 'Seq Scan' AND baris_dipindai = baris_total`.",
        "Urut menurun: `ORDER BY baris_dipindai DESC`.",
        "Q07 sengaja jadi pengecoh — 500.000 ≠ 2.100.000, jadi ia tersaring keluar.",
      ],
      sqlLab: {
        task: "Temukan FULL TABLE SCAN: operasi = 'Seq Scan' dan baris_dipindai = baris_total. Tampilkan query_id + baris_dipindai, urut dari yang terbesar.",
        schema:
          "CREATE TABLE rencana (query_id TEXT, operasi TEXT, baris_dipindai INTEGER, baris_total INTEGER, indeks_dipakai TEXT);",
        seedData: [
          "INSERT INTO rencana VALUES",
          "('Q01','Index Scan',860,2100000,'idx_orders_tanggal'),",
          "('Q02','Seq Scan',1000000,1000000,''),",
          "('Q03','Seq Scan',2100000,2100000,''),",
          "('Q04','Index Scan',3,8400000,'idx_pay_order'),",
          "('Q05','Seq Scan',1000000,1000000,''),",
          "('Q06','Index Scan',45000,2100000,'idx_orders_tanggal'),",
          "('Q07','Seq Scan',500000,2100000,''),",
          "('Q08','Index Scan',120,1000000,'pk_customers');",
        ].join("\n"),
        starter: [
          "-- Tulis query-mu di sini",
          "-- Kolom: query_id | baris_dipindai",
          "SELECT query_id, baris_dipindai",
          "FROM rencana",
          "WHERE ...",
        ].join("\n"),
        solution: [
          "SELECT query_id, baris_dipindai",
          "FROM rencana",
          "WHERE operasi = 'Seq Scan' AND baris_dipindai = baris_total",
          "ORDER BY baris_dipindai DESC;",
        ].join("\n"),
        expectedColumns: ["query_id", "baris_dipindai"],
        expectedRows: [
          ["Q03", 2100000],
          ["Q02", 1000000],
          ["Q05", 1000000],
        ],
        orderMatters: true,
      },
      note: {
        title: "Cara membaca rencana eksekusi (dan yang sering disalahpahami)",
        type: "pitfall",
        body: "“Seq Scan” bukan vonis bersalah otomatis — untuk tabel 500 baris, memindai semua justru LEBIH cepat daripada membuka indeks. Yang berbahaya adalah Seq Scan atas JUTAAN baris untuk query yang sering jalan. Selalu baca tiga angka bersama: operasi + baris dipindai + frekuensi query. Satu Seq Scan 2,1 juta baris yang jalan tiap jam = bencana; yang jalan setahun sekali = bukan prioritas.",
      },
    },
    {
      id: "lab-indeks",
      eyebrow: "Langkah 4 · Lab 2 — Buru indeks hantu (SQL)",
      title: "Indeks yang tidak bekerja tapi tetap digaji",
      prose: [
        "Setiap indeks memungut pajak: tiap INSERT, UPDATE, dan DELETE harus memperbarui SEMUA indeks di tabel itu. Indeks yang dipakai 12.400× sebulan membayar pajaknya dengan keringat. Indeks yang dipakai 0× dalam 30 hari? Itu hantu — memungut pajak tanpa bekerja.",
        "Tabel `indeks(nama, kolom, dipakai_30_hari, tulis_per_hari, ukuran_kb)`. Tugasmu: tampilkan SEMUA indeks hantu (`dipakai_30_hari = 0`) beserta `tulis_per_hari` dan `ukuran_kb`-nya, urut dari pajak write terbesar. Inilah daftar kandidat drop-mu — tapi ingat aturan data room: kandidat drop, bukan vonis. Vonisnya di langkah keputusan.",
        "Perhatikan kolom `kolom`: ada `LOWER(email)` (indeks ekspresi) dan `(kota, total)` (indeks komposit). Detail ini penting untuk misi audit.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query indeks hantu: dipakai_30_hari = 0, urut tulis_per_hari terbesar" },
        { id: "t2", text: "Catat: indeks mana yang pajak write-nya paling besar?" },
      ],
      expected:
        "4 baris hantu — idx_cust_kota (3.200 tulis/hari) teratas, lalu idx_orders_total, idx_cust_email_lower, idx_cust_nama",
      hints: [
        "Filter hantu: `WHERE dipakai_30_hari = 0`.",
        "Urut pajak: `ORDER BY tulis_per_hari DESC, ukuran_kb DESC` (seri 950 tulis/hari dipecah oleh ukuran).",
        "Kolom keluaran: nama, tulis_per_hari, ukuran_kb — persis urutan itu.",
      ],
      sqlLab: {
        task: "Tampilkan INDEKS HANTU: dipakai_30_hari = 0. Kolom: nama, tulis_per_hari, ukuran_kb. Urut: tulis_per_hari terbesar dulu (seri → ukuran_kb terbesar).",
        schema:
          "CREATE TABLE indeks (nama TEXT, kolom TEXT, dipakai_30_hari INTEGER, tulis_per_hari INTEGER, ukuran_kb INTEGER);",
        seedData: [
          "INSERT INTO indeks VALUES",
          "('idx_orders_tanggal','tanggal',12400,2100,45000),",
          "('idx_cust_email_lower','LOWER(email)',0,950,28000),",
          "('idx_cust_kota','kota',0,3200,12000),",
          "('idx_pay_order','order_id',45200,8400,61000),",
          "('idx_orders_total','total',0,2100,38000),",
          "('idx_orders_kota','kota',312,2100,15000),",
          "('idx_cust_nama','nama',0,950,16000),",
          "('idx_pay_tanggal','tanggal',8100,8400,52000);",
        ].join("\n"),
        starter: [
          "-- Tulis query-mu di sini",
          "-- Kolom: nama | tulis_per_hari | ukuran_kb",
          "SELECT nama, tulis_per_hari, ukuran_kb",
          "FROM indeks",
          "WHERE ...",
        ].join("\n"),
        solution: [
          "SELECT nama, tulis_per_hari, ukuran_kb",
          "FROM indeks",
          "WHERE dipakai_30_hari = 0",
          "ORDER BY tulis_per_hari DESC, ukuran_kb DESC;",
        ].join("\n"),
        expectedColumns: ["nama", "tulis_per_hari", "ukuran_kb"],
        expectedRows: [
          ["idx_cust_kota", 3200, 12000],
          ["idx_orders_total", 2100, 38000],
          ["idx_cust_email_lower", 950, 28000],
          ["idx_cust_nama", 950, 16000],
        ],
        orderMatters: true,
      },
      note: {
        title: "Miskonsepsi #2: “indeks tidak terpakai = gratis”",
        type: "pitfall",
        body: "Indeks hantu tidak gratis: ia dibayar setiap ada tulis (pajak write), memakan ruang disk (ukuran_kb), dan memperlambat VACUUM serta backup. Di tabel dengan 8.400 tulis/hari, satu indeks hantu berarti 8.400 pemeliharaan sia-sia per hari — 200 ribu per hari kerja. “Tidak dipakai” bukan “tidak berbiaya”.",
      },
    },
    {
      id: "lab-biaya",
      eyebrow: "Langkah 5 · Lab 3 — Hitung biayanya (Python)",
      title: "40× itu bukan firasat — itu aritmetika",
      prose: [
        "“Lambat 40×” terdengar seperti keluhan. Di lab ini kamu membuktikan ia adalah ARITMETIKA. Model biaya sederhana yang dipakai planner: **biaya Seq Scan** = jumlah baris tabel (planner harus menyentuh semuanya); **biaya Index Scan** = 3 (overhead menuruni B-tree) + selektivitas × baris tabel (baris yang benar-benar cocok). **Rasio perbaikan** = biaya_seq / biaya_index.",
        "Kasus Q03 (laporan per kota): tabel orders 2.100.000 baris, selektivitas 0,025 (2,5% baris cocok untuk satu kota), waktu aktual Seq Scan 7.400 ms. Hitung rasio perbaikannya, lalu estimasikan waktu query bila indeks yang tepat dipasang: waktu_baru = waktu_lama / rasio.",
        "Bagian kedua: audit statistik. Planner percaya tabel orders berisi `tercatat` baris; kenyataannya `aktual` baris. Hitung `selisih_pct` = |aktual − tercatat| / aktual × 100%. Statistik dinyatakan BASI bila selisih > 20% — karena planner menyusun rencana dari peta yang salah total.",
        "Rumusnya sudah disiapkan di petunjuk — kamu tinggal menerjemahkannya ke kode. Tidak ada library khusus; Python murni cukup.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rasio_perbaikan` dan `waktu_dengan_indeks_ms` untuk Q03" },
        { id: "t2", text: "Hitung `selisih_pct` statistik orders dan tentukan `statistik_basi`" },
      ],
      expected:
        "rasio_perbaikan = 40,0× → waktu turun 7.400 ms → ~185 ms; selisih_pct = 99,52% → statistik BASI",
      formula: String.raw`\text{rasio} = \frac{n}{3 + s \cdot n}`,
      formulaNote:
        "n = baris tabel (2.100.000), s = selektivitas (0,025 = fraksi baris yang cocok). Pembilang = biaya Seq Scan (sentuh semua baris). Penyebut = biaya Index Scan: 3 langkah menuruni B-tree + hanya baris yang cocok yang dibaca. Rasio 40 artinya: indeks yang tepat memangkas ~97,5% kerja.",
      hints: [
        "biaya_seq = baris_total; biaya_index = 3 + selektivitas * baris_total.",
        "rasio = biaya_seq / biaya_index, bulatkan 1 desimal: `round(x, 1)`.",
        "waktu_dengan_indeks_ms = round(waktu_seq_ms / rasio_perbaikan, 1).",
        "selisih_pct = round(abs(aktual - tercatat) / aktual * 100, 2); basi = selisih_pct > 20.",
      ],
      code: {
        starter: [
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "# Kasus Q03: laporan per kota di tabel orders",
          "",
          "baris_total = 2100000",
          "selektivitas = 0.025      # 2,5% baris cocok untuk satu kota",
          "waktu_seq_ms = 7400       # waktu aktual Seq Scan (ms)",
          "",
          "biaya_seq = ...",
          "biaya_index = ...         # 3 + selektivitas * baris_total",
          "rasio_perbaikan = ...     # round(..., 1)",
          "waktu_dengan_indeks_ms = ...  # round(waktu_seq_ms / rasio, 1)",
          "",
          "# Audit statistik tabel orders",
          "tercatat, aktual = 10000, 2100000",
          "selisih_pct = ...         # round(..., 2)",
          "statistik_basi = ...      # True bila selisih_pct > 20",
          "",
          "print(\"rasio:\", rasio_perbaikan, \"x\")",
          "print(\"waktu baru:\", waktu_dengan_indeks_ms, \"ms\")",
          "print(\"selisih statistik:\", selisih_pct, \"% | basi:\", statistik_basi)",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "# Kasus Q03: laporan per kota di tabel orders",
          "",
          "baris_total = 2100000",
          "selektivitas = 0.025      # 2,5% baris cocok untuk satu kota",
          "waktu_seq_ms = 7400       # waktu aktual Seq Scan (ms)",
          "",
          "biaya_seq = baris_total",
          "biaya_index = 3 + selektivitas * baris_total",
          "rasio_perbaikan = round(biaya_seq / biaya_index, 1)",
          "waktu_dengan_indeks_ms = round(waktu_seq_ms / rasio_perbaikan, 1)",
          "",
          "# Audit statistik tabel orders",
          "tercatat, aktual = 10000, 2100000",
          "selisih_pct = round(abs(aktual - tercatat) / aktual * 100, 2)",
          "statistik_basi = selisih_pct > 20",
          "",
          "print(\"rasio:\", rasio_perbaikan, \"x\")",
          "print(\"waktu baru:\", waktu_dengan_indeks_ms, \"ms\")",
          "print(\"selisih statistik:\", selisih_pct, \"% | basi:\", statistik_basi)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`biaya_seq` terhitung", name: "biaya_seq", msg: "Biaya Seq Scan = seluruh baris tabel." },
          { kind: "equal", task: "t1", label: "`rasio_perbaikan` = 40,0", name: "rasio_perbaikan", value: 40.0, tol: 0.1, msg: "2.100.000 / (3 + 0,025 × 2.100.000) — periksa penyebutnya." },
          { kind: "equal", task: "t1", label: "`waktu_dengan_indeks_ms` ≈ 185", name: "waktu_dengan_indeks_ms", value: 185.0, tol: 1.0, msg: "7.400 / 40,0 — dari 2 menit menjadi sekejap mata." },
          { kind: "equal", task: "t2", label: "`selisih_pct` ≈ 99,52", name: "selisih_pct", value: 99.52, tol: 0.1, msg: "|2.100.000 − 10.000| / 2.100.000 × 100%." },
          { kind: "equal", task: "t2", label: "`statistik_basi` = True", name: "statistik_basi", value: true, msg: "99,52% > 20% — planner buta total soal ukuran tabel ini." },
        ],
      },
      note: {
        title: "Miskonsepsi #3: “tambah indeks, pasti tambah cepat”",
        type: "pitfall",
        body: "Rasio 40× hanya berlaku bila selektivitasnya bagus (sedikit baris cocok). Untuk query “tampilkan semua order berstatus batal” di mana 60% baris berstatus batal, indeks hampir tidak membantu — planner BENAR memilih Seq Scan. Indeks bukan vitamin yang diminum tiap pagi; ia obat yang diresepkan setelah diagnosis (EXPLAIN + selektivitas + frekuensi query).",
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 6 · Checkpoint keputusan",
      title: "Senin pagi: indeks mana yang hidup, mana yang mati?",
      prose: [
        "Diagnosis lengkap: Q03 full scan 2,1 juta baris (rasio perbaikan 40× bila diindeks dengan benar), 4 indeks hantu memungut pajak write, statistik orders basi 99,52% (planner buta), dan satu misteri: Q03 cepat di staging (180 ms) tapi lambat di produksi (7.400 ms). Head of Engineering menunggumu Senin pagi dengan satu pertanyaan: “Jadi apa rencananya?” Pilihanmu menentukan apa yang terjadi pada write throughput — dan pada laporan keuangan triwulanan yang jarang jalan.",
      ],
      tasks: [
        { id: "t1", text: "Pilih satu rencana — keputusan ini final seperti memo yang sudah dikirim" },
      ],
      decision: {
        prompt:
          "Rencana indeks apa yang kamu eksekusi Senin pagi? (Keputusan final — seperti memo yang sudah dikirim.)",
        options: [
          {
            id: "opt-drop",
            label: "Agresif: drop 4 indeks hantu + ANALYZE malam ini",
            rationale:
              "Pajak write turun seketika (~18%), planner dapat peta baru malam ini juga. Indeks yang dipakai 0× dalam 30 hari tidak akan dirindukan — dan kalau ternyata dibutuhkan, CREATE INDEX bisa dijalankan lagi.",
            nextStepId: "cabang-drop",
            consequenceNote:
              "Write throughput naik 18% dalam seminggu — kemenangan. Tapi bulan berikutnya laporan keuangan TRIWULANAN (yang hanya jalan 4× setahun, tak tercatat di “30 hari”) melambat 25× karena memakai idx_orders_status yang ikut kamu drop. “0× dalam 30 hari” ternyata bukan “tidak pernah dipakai”.",
          },
          {
            id: "opt-bertahap",
            label: "Bertahap: drop satu per satu, pantau tiap minggu",
            rationale:
              "Tiap indeks hantu di-drop satu per satu dengan jeda seminggu + monitoring query lambat. Lambat tapi aman: kalau ada query jarang yang protes, indeksnya dikembalikan sebelum yang berikutnya di-drop.",
            nextStepId: "cabang-bertahap",
            consequenceNote:
              "Empat minggu, empat drop, nol insiden. Laporan triwulanan aman karena kamu sempat melihatnya memakai idx_orders_status di minggu kedua — indeks itu kamu PERTAHANKAN. Write membaik bertahap (+4–5% per minggu). Head of Engineering belajar satu hal: “bertahap” bukan “lambat”, melainkan “terkendali”.",
          },
          {
            id: "opt-tahan",
            label: "Tahan: pertahankan semua, “siapa tahu dipakai nanti”",
            rationale:
              "Risiko drop (query jarang yang rusak) lebih menakutkan daripada biaya hantu yang sudah berjalan bertahun-tahun. Fokus saja ke ANALYZE + indeks baru untuk Q03; yang lama jangan disentuh.",
            nextStepId: "cabang-tahan",
            consequenceNote:
              "Q03 membaik (ANALYZE + indeks baru bekerja). Tapi 4 hantu tetap memungut pajak — dan 6 bulan kemudian tabel payments tumbuh 3×, write throughput jebol duluan di beban indeks hantu. Masalah yang “nanti saja” selalu menagih dengan bunga.",
          },
        ],
      },
    },
    {
      id: "cabang-drop",
      goto: "audit",
      eyebrow: "Langkah 7 · Konsekuensi",
      title: "Diputuskan: drop agresif",
      prose: [
        "Senin malam: 4 indeks hantu di-drop, ANALYZE jalan. Seminggu kemudian write throughput naik 18% — tim merayakannya. Kamu merasa seperti pahlawan. Sampai bulan berikutnya.",
        "Laporan keuangan triwulanan jalan — dan melambat 25×. Penyelidikan: ia memakai `idx_orders_status`… bukan, tunggu — ia memakai pola query yang hanya muncul 4× setahun, di bawah radar “dipakai 30 hari”. Metrik 30 hari mengkhianatimu: “tidak dipakai SEBULAN terakhir” bukan “tidak dipakai SELAMANYA”.",
        "Pelajaran yang mahal: agresivitas tanpa memahami SIKLUS BISNIS (harian? bulanan? triwulanan? tahunan?) adalah kecerobohan yang dibungkus efisiensi. Drop boleh agresif — tapi jendela observasinya harus mencakup siklus terpanjang bisnis, bukan 30 hari kalender.",
      ],
      tasks: [],
      note: {
        title: "Metrik yang benar, jendela yang salah",
        body: "“dipakai_30_hari = 0” adalah FAKTA yang benar — dan kesimpulan yang salah, karena jendelanya tidak mencakup siklus triwulanan. Di deliverable-mu, setiap rekomendasi drop wajib menyebut: “jendela observasi X mencakup siklus bisnis terpanjang (triwulanan)”.",
      },
    },
    {
      id: "cabang-bertahap",
      goto: "audit",
      eyebrow: "Langkah 7 · Konsekuensi",
      title: "Diputuskan: drop bertahap",
      prose: [
        "Minggu 1: `idx_cust_kota` di-drop (pajak terbesar). Monitoring diam — aman. Minggu 2: `idx_orders_total` di-drop. Monitoring menangkap sesuatu: laporan triwulanan memakai pola yang mirip `idx_orders_status` — indeks yang hampir ikut kamu drop. Kamu membatalkannya dari daftar.",
        "Minggu 3–4: dua hantu terakhir tumbang tanpa insiden. Write throughput naik total 17% — hanya 1% di bawah skenario agresif, dengan NOL insiden. Head of Engineering mencatat: “bertahap bukan lambat — terkendali.”",
        "Ini harga kehati-hatian: empat minggu untuk pekerjaan yang bisa selesai semalam. Tapi minggu-minggu itu membeli sesuatu yang tidak bisa dibeli: kepastian bahwa tidak ada query jarang yang menjadi korban. Dalam operasi database, “tidak ada insiden” adalah mata uang yang paling mahal.",
      ],
      tasks: [],
      note: {
        title: "Kecepatan vs kepastian: pilih kepastian",
        body: "Skenario agresif lebih cepat 3 minggu dan hanya 1% lebih baik — dengan satu insiden triwulanan sebagai harga. Trade-off ini hampir selalu dimenangkan kehati-hatian di database produksi. Cepat itu bagus; benar itu wajib.",
      },
    },
    {
      id: "cabang-tahan",
      goto: "audit",
      eyebrow: "Langkah 7 · Konsekuensi",
      title: "Diputuskan: pertahankan semua",
      prose: [
        "Q03 membaik drastis (ANALYZE + indeks baru: 7.400 ms → 190 ms). Semua senang — kecuali database-nya. Empat hantu tetap memungut pajak write setiap hari, dan tidak ada yang mengingat mereka ada.",
        "Enam bulan kemudian tabel payments tumbuh 3× lipat. Write throughput mencapai batas — dan ketika tim akhirnya memprofilkan, 22% beban tulis berasal dari indeks-hantu yang “siapa tahu dipakai nanti” itu. Ternyata tidak pernah dipakai. Tidak sekalipun.",
        "Pelajaran: “nanti saja” adalah keputusan juga — keputusan untuk membayar pajak tiap hari tanpa batas waktu. Setiap indeks yang dipertahankan “jaga-jaga” harus punya tanggal kedaluwarsa peninjauan, atau ia menjadi permanen secara diam-diam.",
      ],
      tasks: [],
      note: {
        title: "Biaya diam-diam > biaya terlihat",
        body: "Insiden triwulanan (skenario agresif) terlihat dan diperbaiki dalam sehari. Pajak hantu tidak terlihat dan dibayar 180 hari berturut-turut. Dalam operasi, biaya yang tidak terlihat hampir selalu lebih besar totalnya — karena tidak ada yang mematikannya.",
      },
    },
    {
      id: "audit",
      eyebrow: "Langkah 8 · Misi audit",
      title: "Dossier 16 baris: “semua indeks sehat” yang bohong",
      prose: [
        "Sebelum menulis rencana indeks, satu misi audit. Di bawah ini 16 baris “Laporan Kesehatan Indeks — DBA Lama”, dokumen yang menyatakan SEMUA indeks sehat. Seseorang menyuntikkan 4 sabotase ke dalamnya. Senjatamu: 3 full scan dari Lab 1, 4 hantu dari Lab 2, rasio 40× dan statistik basi dari Lab 3.",
        "Fokus pada baris yang terlihat “sehat” tapi angkanya bercerita lain — indeks hantu yang baik selalu punya alasan yang terdengar masuk akal.",
      ],
      tasks: [],
      auditDossier: {
        version: "indeks-m2b-v1",
        snapshotDate: "2026-10-15",
        intro:
          "Dossier ini diklaim sebagai Laporan Kesehatan Indeks dari DBA sebelumnya yang menyatakan SEMUA indeks sehat dan bekerja.",
        columns: ["Indeks / Objek", "Tabel", "Dipakai 30 hari", "Klaim", "Catatan"],
        rows: [
          { rowId: 1, cells: { "Indeks / Objek": "idx_orders_tanggal", "Tabel": "orders", "Dipakai 30 hari": "12.400", "Klaim": "Mempercepat laporan harian", "Catatan": "Sehat" }, claims: [{ label: "Status", value: "Sehat" }] },
          // ── I1: indeks fungsi tak dipakai ──
          { rowId: 2, cells: { "Indeks / Objek": "idx_cust_email_lower", "Tabel": "customers", "Dipakai 30 hari": "0", "Klaim": "Mempercepat pencarian email", "Catatan": "Kolom: LOWER(email)" }, claims: [{ label: "Status", value: "Sehat — cadangan" }] },
          { rowId: 3, cells: { "Indeks / Objek": "idx_cust_kota", "Tabel": "customers", "Dipakai 30 hari": "0", "Klaim": "Filter kota", "Catatan": "Tulis/hari: 3.200" }, claims: [{ label: "Status", value: "Jarang dipakai" }] },
          { rowId: 4, cells: { "Indeks / Objek": "idx_pay_order", "Tabel": "payments", "Dipakai 30 hari": "45.200", "Klaim": "Join pembayaran", "Catatan": "Sehat" }, claims: [{ label: "Status", value: "Sehat" }] },
          { rowId: 5, cells: { "Indeks / Objek": "idx_orders_total", "Tabel": "orders", "Dipakai 30 hari": "0", "Klaim": "Filter nominal", "Catatan": "Tulis/hari: 2.100" }, claims: [{ label: "Status", value: "Jarang dipakai" }] },
          // ── I2: statistik basi ──
          { rowId: 6, cells: { "Indeks / Objek": "Statistik orders", "Tabel": "orders", "Dipakai 30 hari": "—", "Klaim": "Rencana eksekusi akurat", "Catatan": "Tercatat 10.000 / aktual 2.100.000 — analyze 2026-01-02" }, claims: [{ label: "Status", value: "Sehat" }] },
          { rowId: 7, cells: { "Indeks / Objek": "idx_orders_kota", "Tabel": "orders", "Dipakai 30 hari": "312", "Klaim": "Laporan per kota", "Catatan": "Lambat di produksi" }, claims: [{ label: "Status", value: "Perlu tuning" }] },
          // ── I3: skew staging vs prod ──
          { rowId: 8, cells: { "Indeks / Objek": "Q03 laporan per kota", "Tabel": "orders", "Dipakai 30 hari": "—", "Klaim": "180 ms (staging)", "Catatan": "7.400 ms di produksi" }, claims: [{ label: "Akar masalah", value: "Kode aplikasi" }] },
          // ── I4: cast mematikan indeks ──
          { rowId: 9, cells: { "Indeks / Objek": "idx_orders_kodepos", "Tabel": "orders", "Dipakai 30 hari": "0", "Klaim": "Join kode pos", "Catatan": "Kolom TEXT di-join ke INTEGER" }, claims: [{ label: "Status", value: "Sehat — cadangan" }] },
          { rowId: 10, cells: { "Indeks / Objek": "pk_customers", "Tabel": "customers", "Dipakai 30 hari": "90.000", "Klaim": "Primary key", "Catatan": "Sehat" }, claims: [{ label: "Status", value: "Sehat" }] },
          { rowId: 11, cells: { "Indeks / Objek": "idx_pay_tanggal", "Tabel": "payments", "Dipakai 30 hari": "8.100", "Klaim": "Laporan harian", "Catatan": "Sehat" }, claims: [{ label: "Status", value: "Sehat" }] },
          { rowId: 12, cells: { "Indeks / Objek": "idx_orders_kota_total", "Tabel": "orders", "Dipakai 30 hari": "0", "Klaim": "Filter kota+nominal", "Catatan": "Duplikat leftmost idx_orders_kota" }, claims: [{ label: "Status", value: "Sehat — cadangan" }] },
          { rowId: 13, cells: { "Indeks / Objek": "idx_cust_nama", "Tabel": "customers", "Dipakai 30 hari": "0", "Klaim": "Cari nama", "Catatan": "Tulis/hari: 950" }, claims: [{ label: "Status", value: "Jarang dipakai" }] },
          { rowId: 14, cells: { "Indeks / Objek": "idx_orders_status", "Tabel": "orders", "Dipakai 30 hari": "44", "Klaim": "Filter status", "Catatan": "Jarang dipakai" }, claims: [{ label: "Status", value: "Sehat" }] },
          { rowId: 15, cells: { "Indeks / Objek": "Data staging", "Tabel": "—", "Dipakai 30 hari": "—", "Klaim": "Mewakili produksi", "Catatan": "Sampel acak 1%" }, claims: [{ label: "Status", value: "Valid" }] },
          { rowId: 16, cells: { "Indeks / Objek": "Kesimpulan DBA lama", "Tabel": "—", "Dipakai 30 hari": "—", "Klaim": "Semua indeks sehat", "Catatan": "—" }, claims: [{ label: "Kesimpulan", value: "Tidak ada tindakan" }] },
        ],
        injections: [
          { key: "indeks-fungsi", rowIds: [2], title: "Indeks di atas fungsi yang tak pernah dipakai", clue: "Indeks atas LOWER(email), dipakai 0× — karena query aplikasi memakai UPPER(email). Beda fungsi = beda ekspresi = indeks tak tersentuh planner. Label “cadangan” menutupi fakta: ia tidak pernah BISA dipakai.", danger: "Indeks ekspresi hanya berguna bila query memakai ekspresi yang PERSIS sama. Satu huruf beda (LOWER vs UPPER) = pajak write tanpa manfaat, selamanya." },
          { key: "statistik-basi", rowIds: [6], title: "Statistik basi 9 bulan, diklaim “akurat”", clue: "Tercatat 10.000 vs aktual 2.100.000 — selisih 99,52% (hitunganmu di Lab 3). Analyze terakhir 2026-01-02. Klaim “rencana eksekusi akurat” berdiri di atas peta yang salah total.", danger: "Planner yang buta ukuran tabel akan memilih rencana yang salah untuk SEMUA query — bukan satu. Satu ANALYZE kedaluwarsa meracuni seluruh database." },
          { key: "skew-staging", rowIds: [7, 8, 15], title: "Cepat di staging, lambat di produksi: skew", clue: "Staging = sampel ACAK 1% — skew distribusi (90% order dari 1 kota) hilang dalam sampel. Di produksi, indeks kota tidak selektif untuk kota dominan itu. Baris 8 malah menyalahkan “kode aplikasi”.", danger: "Uji performa pada sampel kecil yang tidak mereplikasi distribusi produksi adalah pengujian terhadap database yang tidak ada. Skew adalah pembunuh diam-diam tuning indeks." },
          { key: "cast-mematikan", rowIds: [9], title: "Tipe tak cocok: cast implisit mematikan indeks", clue: "Kolom kode_pos TEXT di-join ke kolom INTEGER — database me-cast tiap baris sebelum membandingkan, dan indeks (yang menyimpan nilai TEXT mentah) tidak bisa dipakai. Dipakai 0×, selamanya.", danger: "Satu ketidakcocokan tipe di DDL = full scan permanen untuk query itu. Selaraskan tipe di skema — bukan di query dengan CAST." },
        ],
      },
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 9 · Deliverable",
      title: "Rencana indeks untuk Head of Engineering",
      prose: [
        "Semua bukti di tangan. Tulis rencana indeks satu halaman untuk Head of Engineering — artefak portofoliomu. Rencana yang baik tidak hanya bilang “drop ini, buat itu”, tapi menunjukkan ANGKA diagnosisnya, nasib TIAP indeks beserta alasannya, dan apa yang dipantau setelah eksekusi.",
      ],
      tasks: [],
      deliverable: {
        template: [
          "Ringkasan eksekutif (3 kalimat): query terlambat (Q03, 7.400 ms), akar penyebab (3 full scan + statistik basi + skew), hasil yang dijanjikan (angka sebelum/sesudah).",
          "Bukti diagnosis: temuan Lab 1 (3 full scan), Lab 2 (4 indeks hantu + pajak write-nya), Lab 3 (rasio 40×, statistik basi 99,52%).",
          "Rencana indeks per indeks: mana yang DIBUAT (untuk Q03 + mengapa kolom itu), mana DIPERTAHANKAN, mana DI-DROP (bertahap, satu per minggu) + alasan tiap keputusan merujuk dossier.",
          "Temuan audit dossier: anomali apa yang kamu temukan di laporan “semua indeks sehat”, baris per baris, + rekomendasi perbaikan.",
          "Batas & risiko sisa: apa yang TIDAK diukur (write amplification pasca-drop, skew masa depan, query triwulanan di luar jendela 30 hari) + metrik pemantauan pasca-eksekusi.",
        ],
        rubric: [
          { criterion: "Ketepatan diagnosis", weight: 25, levels: ["Menyalahkan kode aplikasi / tebakan", "Menyebut lambat tanpa angka rencana eksekusi", "3 full scan + rasio 40× + statistik basi 99,52% + skew — semua dengan angka"] },
          { criterion: "Kualitas rencana indeks", weight: 25, levels: ["Drop/buat tanpa alasan per indeks", "Ada daftar, alasan kabur", "Tiap indeks punya nasib + alasan (query yang diuntungkan, pajak write, siklus bisnis) + drop bertahap"] },
          { criterion: "Deteksi anomali dossier", weight: 25, levels: ["Tidak menyebut anomali", "Menyebut sebagian tanpa nomor baris", "Keempat anomali disebut dengan nomor baris + rekomendasi perbaikan"] },
          { criterion: "Kejujuran batas & monitoring", weight: 25, levels: ["Mengklaim masalah selesai permanen", "Menyebut sebagian batas", "Batas (skew, siklus triwulanan, write pasca-drop) eksplisit + metrik pantauan konkret"] },
        ],
      },
    },
    {
      id: "debrief",
      eyebrow: "Langkah 10 · Debrief",
      title: "Yang sebenarnya terjadi — dan kenapa ini penting",
      prose: [
        "Debrief dibuka. Empat sabotase di laporan “semua indeks sehat”:",
        "1) **Indeks fungsi yang tak bisa dipakai** (baris 2): LOWER vs UPPER — satu fungsi beda membuat indeks mati total, tapi berlabel “cadangan” seolah disengaja. Pelajaran: indeks ekspresi menuntut query memakai ekspresi yang persis sama; audit indeks harus membandingkan definisi indeks DENGAN teks query, bukan sekadar menghitung jumlah indeks.",
        "2) **Statistik basi** (baris 6): 99,52% selisih, analyze 9 bulan lalu, diklaim “akurat”. Ini akar dari banyak “misteri” performa: planner yang buta. Pelajaran: sebelum menyalahkan query atau menambah indeks, cek kapan terakhir ANALYZE — seringkali itu seluruh masalahnya.",
        "3) **Skew staging-vs-produksi** (baris 7, 8, 15): staging 1% sampel acak menghapus skew; 90% order dari 1 kota membuat indeks kota tak selektif di produksi. Baris 8 menyalahkan kode aplikasi — pola klasik: ketika angka tidak cocok, cari kambing hitam, bukan distribusi data. Pelajaran: uji performa harus mereplikasi DISTRIBUSI produksi, bukan sekadar volumenya.",
        "4) **Cast implisit** (baris 9): TEXT vs INTEGER — indeks ada tapi tak tersentuh selamanya. Pelajaran termurah di misi ini: selaraskan tipe di DDL; satu baris ALTER COLUMN mengalahkan seribu jam tuning.",
        "Skor deteksimu (x/4) mengukur satu hal: apakah kamu membaca ANGKA di balik label “sehat”, atau memercayai labelnya. Dan ingat keputusan bercabangmu: tidak ada opsi gratis. Agresif cepat tapi buta siklus bisnis; bertahap lambat tapi terkendali; menahan berarti membayar pajak diam-diam. DBA terbaik bukan yang paling berani me-drop — melainkan yang jendela observasinya mencakup siklus bisnis terpanjang.",
        "Bahaya nyata terakhir: indeks hantu adalah utang yang tidak tercatat di neraca mana pun — tidak ada alert, tidak ada error, hanya write throughput yang perlahan tercekik. Database tidak mati karena indeks hantu; ia mati pelan-pelan, dan tidak ada yang tahu kenapa — sampai seseorang membaca rencana eksekusi.",
      ],
      tasks: [],
      note: {
        title: "Label “sehat” bukan diagnosis",
        type: "risk",
        body: "Empat sabotase di dossier semuanya berlabel “sehat”/“cadangan”/“jarang dipakai”. Label adalah klaim; angka (dipakai 0×, selisih 99,52%, 7.400 ms) adalah bukti. DBA yang baik tidak mengoleksi label — ia mengadili angka.",
      },
    },
    {
      id: "rangkuman",
      eyebrow: "Langkah 11 · Rangkuman",
      title: "Poin penting misi ini",
      prose: [],
      tasks: [],
      summary: [
        "Diagnosis Q03: full table scan 2,1 juta baris; model biaya memberi rasio perbaikan 40× (7.400 ms → ~185 ms) bila indeks yang tepat dipasang — kelambatan adalah aritmetika, bukan firasat.",
        "4 indeks hantu (dipakai 0×/30 hari) memungut pajak write tiap hari — “tidak dipakai” bukan “tidak berbiaya”; keputusan drop wajib mencakup siklus bisnis terpanjang (triwulanan, bukan 30 hari), dieksekusi bertahap satu per minggu.",
        "Statistik orders basi 99,52% (analyze 9 bulan lalu): planner menyusun rencana dari peta yang salah — cek ANALYZE sebelum menyalahkan query.",
        "Empat pola sabotase laporan indeks: indeks fungsi yang tak bisa dipakai (LOWER vs UPPER), statistik basi diklaim akurat, skew staging-vs-produksi (sampel 1% menghapus skew), cast implisit TEXT↔INTEGER yang mematikan indeks.",
        "Data: 100% SINTETIS (seed 42) — simulasi EXPLAIN/indeks/statistik, bukan pengukuran nyata. Metode: METODE.md.",
      ],
    },
  ],
};

export default misiIndeksHantu;

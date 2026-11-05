import type { V2Mission } from "../lib/types";

// ── MISI Migrasi: Pindah Basis Data Tanpa Mati Lampu ─────────────────────
// M2 — Database Administrator Misi A (core). Dataset: 100% SINTETIS
// (generator /tmp/build_misi_dba.py, seed 42): database warisan fiktif
// "Toko Warisan" — customers/orders/payments dengan kotoran disengaja.
// File: public/misi/misi-migrasi-tanpa-downtime/*.csv + METODE.md.

const BASE = "/misi/misi-migrasi-tanpa-downtime";

export const misiMigrasi: V2Mission = {
  slug: "misi-migrasi-tanpa-downtime",
  track: "Database Administrator",
  module: "Misi",
  title: "Misi Migrasi: Pindah Basis Data Tanpa Mati Lampu",
  estMinutes: 135,
  role: "Database Administrator",
  client:
    "CTO — database warisan harus pindah ke sistem baru dalam jendela 4 jam, tanpa downtime, tanpa kehilangan satu baris pun",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Empat jam, nol baris hilang",
      prose: [],
      tasks: [],
      briefing: {
        role: "Database Administrator di sebuah perusahaan ritel daring — pemilik penuh migrasi database",
        client:
          "CTO. Database warisan (PostgreSQL tua, satu server, tanpa replika) sudah berumur 9 tahun: constraint longgar, foreign key yatim, duplikat primary key. Minggu depan ada jendela pemeliharaan 4 jam — satu-satunya tahun ini. Tugasmu: audit integritas data, susun rencana migrasi bertahap, eksekusi tanpa downtime, dan buktikan tidak ada satu baris pun yang hilang atau rusak. Kalau migrasi gagal di tengah jalan, toko offline dan kamu yang menjelaskan ke direksi.",
        story: [
          "Senin, 09:12. CTO meletakkan satu amplop di mejamu — di dalamnya print-out error log tiga bulan terakhir. “Tujuh belas kali aplikasi crash karena data yang tidak masuk akal,” katanya. “Order menunjuk ke pelanggan yang tidak ada. Ada order kembar dengan ID sama. Tim finance menemukan email pelanggan yang kosong padahal kolomnya NOT NULL. Database ini seperti rumah yang fondasinya retak — dan kita harus pindah rumah, membawa semua perabot, dalam empat jam, tanpa mematikan lampu.”",
          "Kamu tahu aturan emas migrasi: data kotor yang dipindah tanpa audit menjadi data kotor di sistem baru — hanya lebih mahal. Migrasi bukan soal menyalin baris; ini soal membuktikan setiap baris tiba dengan utuh. DBA yang baik tidak berkata “kayaknya sudah pindah semua”. DBA yang baik menunjukkan checksum.",
          "Misi ini memakai database warisan sintetis “Toko Warisan”: 1.000 pelanggan, 5.000 order, 8.000 pembayaran — lengkap dengan kotoran yang disengaja. Tugasmu: audit dulu, rencanakan, pilih strategi, eksekusi, lalu temukan sabotase di laporan “migrasi selesai” milik kontraktor.",
        ],
        objectives: [
          "Menghitung temuan integritas (FK yatim, duplikat PK, NULL di kolom NOT NULL) dengan SQL audit sebelum satu baris pun dipindah.",
          "Menyusun rencana migrasi bertahap (backfill → dual-write → verifikasi checksum → cutover → rollback) yang muat dalam jendela 4 jam.",
          "Memverifikasi migrasi dengan checksum per batch dan menemukan minimal 3 sabotase di dossier “migrasi selesai”.",
        ],
        prereqSummary:
          "Primary key (PK) = identitas unik tiap baris; duplikat PK berarti dua baris mengklaim identitas yang sama. Foreign key (FK) = janji bahwa sebuah kolom menunjuk ke baris yang benar-benar ada di tabel lain; FK yatim = janji yang dilanggar. Checksum = sidik jari angka dari isi data — kalau sidik jari sumber dan target sama, data tiba utuh. Dual-write = selama masa transisi, setiap tulis dikirim ke database lama DAN baru, supaya tidak ada transaksi yang tercecer saat pindah.",
        datasetNote:
          "Sumber: 100% SINTETIS — dibangkitkan generator /tmp/build_misi_dba.py (seed 42). Bukan data perusahaan nyata; nama, email, dan angka transaksi fiktif.\nFile: customers.csv (1.000 baris), orders.csv (5.000 baris), payments.csv (8.000 baris), orders_target.csv (hasil “migrasi” dengan 129 baris hilang + 5 baris rusak — bahan Lab 2).\nKejujuran: kotoran data (FK yatim, duplikat PK, NULL terlarang, enum liar) disuntik SENGAJA sebagai bahan latihan — database warisan asli jarang sekotor ini dalam pola yang serapi ini. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Kenali rumah yang akan kamu pindahkan",
      prose: [
        "Empat file menunggumu. `customers.csv`, `orders.csv`, dan `payments.csv` adalah database warisan “Toko Warisan” — tiga tabel dengan relasi customers → orders → payments. `orders_target.csv` adalah hasil migrasi versi kontraktor: tabel orders SETELAH dipindah ke sistem baru. Klaimnya: “migrasi selesai, semua cocok.” Kamu akan mengadilinya di Lab 2.",
        "Skema yang seharusnya berlaku (aturan bisnis, bukan constraint yang ditegakkan — justru itu masalahnya): `customers.id` PK; `customers.email` NOT NULL; `orders.id` PK; `orders.customer_id` FK ke customers; `orders.status` hanya boleh berisi baru/diproses/kirim/selesai/batal; `payments.id` PK; `payments.order_id` FK ke orders.",
        "Aturan main misi ini: (1) tidak ada baris yang pindah sebelum audit selesai; (2) setiap klaim “sudah cocok” harus dibuktikan dengan angka, bukan kepercayaan; (3) rencana rollback ditulis SEBELUM cutover, bukan sesudah.",
      ],
      tasks: [
        { id: "t1", text: "Buka `orders.csv`: catat jumlah baris dan nilai unik kolom `status`" },
        { id: "t2", text: "Buka `orders_target.csv`: bandingkan jumlah barisnya dengan `orders.csv`" },
        { id: "t3", text: "Baca `METODE.md`: catat 5 kode kotoran (D1–D5) dan lokasinya" },
      ],
      note: {
        title: "Miskonsepsi #1: “data sudah jalan bertahun-tahun, pasti beres”",
        type: "pitfall",
        body: "Aplikasi bisa berjalan di atas data kotor selama bertahun-tahun karena kode aplikasi menambal lubangnya satu per satu (try/except di sana-sini, “kalau email kosong pakai string kosong”). Database warisan yang “baik-baik saja” sering kali hanya berarti “belum ada yang mengaudit”. Migrasi adalah momen ketika semua tambalan itu dicopot — dan lubang aslinya terlihat.",
      },
      reference:
        "customers.csv + orders.csv + payments.csv (sumber, sintetis) vs orders_target.csv (klaim kontraktor). Audit dari yang mentah; vonis untuk yang diklaim.",
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 3 · Lab 1 — Audit integritas (SQL)",
      title: "Temukan mayatnya sebelum pindah rumah",
      prose: [
        "DBA punya pepatah: audit dulu, pindah kemudian. Tiga jenis kotoran paling mematikan migrasi: **FK yatim** (baris menunjuk ke induk yang tidak ada — akan gagal saat constraint dinyalakan di sistem baru), **duplikat PK** (dua baris satu identitas — target akan menolak baris kedua, atau lebih buruk: menimpanya diam-diam), dan **NULL di kolom NOT NULL** (aplikasi baru yang jujur akan melempar error).",
        "Di lab ini kamu menulis SATU query audit dengan `UNION ALL`: tiga subquery, masing-masing mengembalikan kategori temuan, tabel sumber, dan id baris yang bermasalah. Tabel mini di bawah memakai pola kotoran yang sama dengan database asli — hanya skalanya kecil supaya kamu bisa memverifikasi dengan tangan.",
        "Tabel: `customers(id, nama, email, kota)`, `orders(id, customer_id, total, status)`, `payments(id, order_id, jumlah)`. Kategori keluaran: `FK_YATIM`, `DUPLIKAT_PK`, `NULL_TERLARANG`. Urutkan berdasarkan kategori, lalu id baris.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query UNION ALL 3 kategori temuan; kolom: kategori, tabel_sumber, id_baris" },
        { id: "t2", text: "Verifikasi: 7 baris temuan — cocokkan dengan hitungan tanganmu" },
      ],
      expected:
        "7 baris: DUPLIKAT_PK/orders/7; FK_YATIM orders/9, orders/10, payments/6, payments/8; NULL_TERLARANG customers/3, customers/8",
      hints: [
        "FK yatim di orders: `WHERE customer_id NOT IN (SELECT id FROM customers)`.",
        "Duplikat PK: `GROUP BY id HAVING COUNT(*) > 1` — id yang muncul jadi satu baris temuan.",
        "NULL terlarang: `WHERE email IS NULL` (bukan `= NULL` — itu selalu salah).",
        "Beri alias kolom yang SAMA di tiap SELECT: `... AS kategori, ... AS tabel_sumber, ... AS id_baris`, lalu `ORDER BY kategori, id_baris` di akhir.",
      ],
      sqlLab: {
        task: "Audit integritas: satu query UNION ALL yang menemukan (1) FK yatim di orders & payments, (2) duplikat PK di orders, (3) email NULL di customers. Kolom: kategori, tabel_sumber, id_baris. Urut: kategori, id_baris.",
        schema: [
          "CREATE TABLE customers (id INTEGER, nama TEXT, email TEXT, kota TEXT);",
          "CREATE TABLE orders (id INTEGER, customer_id INTEGER, total INTEGER, status TEXT);",
          "CREATE TABLE payments (id INTEGER, order_id INTEGER, jumlah INTEGER);",
        ].join("\n"),
        seedData: [
          "INSERT INTO customers VALUES",
          "(1,'Ayu S','ayu.s1@contoh.id','Makassar'),",
          "(2,'Budi W','budi.w2@contoh.id','Jakarta'),",
          "(3,'Citra P',NULL,'Surabaya'),",
          "(4,'Dedi K','dedi.k4@contoh.id','Medan'),",
          "(5,'Eka S','eka.s5@contoh.id','Denpasar'),",
          "(6,'Farhan N','farhan.n6@contoh.id','Bandung'),",
          "(7,'Gita H','gita.h7@contoh.id','Semarang'),",
          "(8,'Hendra S',NULL,'Makassar'),",
          "(9,'Intan A','intan.a9@contoh.id','Jakarta'),",
          "(10,'Joko T','joko.t10@contoh.id','Surabaya');",
          "INSERT INTO orders VALUES",
          "(1,1,120000,'selesai'),",
          "(2,2,85000,'kirim'),",
          "(3,3,210000,'diproses'),",
          "(4,4,45000,'baru'),",
          "(5,5,99000,'selesai'),",
          "(6,6,150000,'kirim'),",
          "(7,7,60000,'selesai'),",
          "(7,7,60000,'selesai'),",
          "(8,8,175000,'diproses'),",
          "(9,99,92000,'baru'),",
          "(10,100,130000,'kirim'),",
          "(11,9,200000,'dibatalkan_x'),",
          "(12,10,75000,'batal'),",
          "(13,1,310000,'selesai');",
          "INSERT INTO payments VALUES",
          "(1,1,120000),",
          "(2,2,85000),",
          "(3,3,210000),",
          "(4,5,99000),",
          "(5,6,150000),",
          "(6,77,50000),",
          "(7,8,175000),",
          "(8,78,92000),",
          "(9,10,130000),",
          "(10,12,75000);",
        ].join("\n"),
        starter: [
          "-- Tulis SATU query audit (UNION ALL dari 3 subquery) di bawah",
          "-- Kolom: kategori | tabel_sumber | id_baris",
          "-- Urut: kategori, id_baris",
          "",
          "SELECT 'FK_YATIM' AS kategori, 'orders' AS tabel_sumber, id AS id_baris",
          "FROM orders",
          "WHERE ...",
        ].join("\n"),
        solution: [
          "SELECT 'DUPLIKAT_PK' AS kategori, 'orders' AS tabel_sumber, id AS id_baris",
          "FROM orders GROUP BY id HAVING COUNT(*) > 1",
          "UNION ALL",
          "SELECT 'FK_YATIM', 'orders', id FROM orders",
          "WHERE customer_id NOT IN (SELECT id FROM customers)",
          "UNION ALL",
          "SELECT 'FK_YATIM', 'payments', id FROM payments",
          "WHERE order_id NOT IN (SELECT id FROM orders)",
          "UNION ALL",
          "SELECT 'NULL_TERLARANG', 'customers', id FROM customers WHERE email IS NULL",
          "ORDER BY kategori, id_baris;",
        ].join("\n"),
        expectedColumns: ["kategori", "tabel_sumber", "id_baris"],
        expectedRows: [
          ["DUPLIKAT_PK", "orders", 7],
          ["FK_YATIM", "payments", 6],
          ["FK_YATIM", "payments", 8],
          ["FK_YATIM", "orders", 9],
          ["FK_YATIM", "orders", 10],
          ["NULL_TERLARANG", "customers", 3],
          ["NULL_TERLARANG", "customers", 8],
        ],
        orderMatters: true,
      },
      note: {
        title: "Miskonsepsi #2: “pindah dulu, bereskan nanti”",
        type: "pitfall",
        body: "Godaan terbesar migrasi: “datanya nanti dibersihkan di sistem baru saja.” Masalahnya — sistem baru biasanya MENEGAKKAN constraint yang longgar di sistem lama. Hasilnya: load gagal di baris ke-2 juta pada jam ke-3 jendela 4 jam, dan kamu tidak tahu baris mana yang lolos dan mana yang tidak. Audit pra-migrasi bukan birokrasi; itu satu-satunya cara cutover 4 jam menjadi mungkin.",
      },
    },
    {
      id: "strategi",
      eyebrow: "Langkah 4 · Strategi migrasi",
      title: "Tiga cara pindah rumah — hanya satu yang jujur",
      prose: [
        "Audit selesai, kotoran terpetakan. Sekarang pertanyaan strategis: BAGAIMANA memindahkan 14.000 baris dalam 4 jam tanpa mematikan toko? Tiga strategi klasik — masing-masing dengan harga yang berbeda.",
        "**Big-bang**: matikan aplikasi, salin semua, nyalakan di sistem baru. Sederhana, tapi butuh downtime penuh — dan kalau gagal di menit ke-200, kamu rollback buta. **Dual-write**: tulis ke lama dan baru secara paralel selama beberapa hari, backfill data lama bertahap, verifikasi checksum, lalu cutover (pindahkan trafik baca) dalam hitungan menit. **Shadow read**: arahkan salinan trafik baca ke sistem baru dan bandingkan hasilnya, tanpa memengaruhi pengguna — bagus untuk validasi, buruk sebagai strategi utama karena tidak memindahkan data.",
        "Peta keputusan — kapan memakai apa:",
        "• Jendela downtime ≥ waktu salin penuh DAN data boleh beku → big-bang boleh dipertimbangkan (jarang).",
        "• Toko harus tetap buka DAN ada risiko data kotor → dual-write: satu-satunya yang memberi verifikasi sebelum titik tidak-kembali.",
        "• Sistem baru belum tepercaya DAN kamu butuh bukti performa → shadow read sebagai PELENGKAP, bukan pengganti.",
        "Aturan 10 detik: kalau strategimu tidak punya jawaban untuk “bagaimana kita tahu semua baris tiba utuh SEBELUM cutover”, itu bukan strategi — itu harapan. Dual-write + checksum per batch adalah jawabannya: batch adalah unit verifikasi (di misi ini: tiap 1.000 baris order = 1 batch), checksum adalah sidik jarinya.",
        "Mini-case: sebuah marketplace memilih big-bang untuk 40 juta baris dengan jendela 6 jam. Di jam ke-5, load gagal karena duplikat PK yang tidak diaudit. Rollback memakan 4 jam lagi — total 10 jam offline, denda SLA, dan 3 hari untuk memilah baris mana yang sudah pindah. Seandainya mereka audit + dual-write, kegagalan itu tertangkap di hari pertama sebagai “batch B3 checksum tidak cocok”, bukan sebagai bencana.",
      ],
      tasks: [
        { id: "t1", text: "Tulis di catatanmu: untuk tiap strategi, apa “titik tidak-kembali”-nya" },
        { id: "t2", text: "Tentukan: batch berapa baris yang masuk akal untuk 5.000 order? (petunjuk: Lab 2 memakai batch 1.000)" },
      ],
      note: {
        title: "Miskonsepsi #3: “rollback = tinggal balikin”",
        type: "risk",
        body: "Rollback hanya mudah kalau kamu tahu PERSIS sampai mana migrasi berjalan. Tanpa checkpoint per batch, “balikin” berarti menebak — dan tebakan di tengah 4 jam jendela adalah cara tercepat menggandakan bencana. Itulah kenapa rencana rollback ditulis sebelum cutover, dengan daftar batch yang sudah terverifikasi sebagai lampirannya.",
      },
      reference:
        "Big-bang = cepat tapi buta. Dual-write = lambat tapi terbukti. Shadow = validasi, bukan migrasi.",
    },
    {
      id: "lab-rencana",
      eyebrow: "Langkah 5 · Lab 2 — Verifikasi checksum (Python)",
      title: "Buktikan, jangan percaya",
      prose: [
        "Kontraktor mengklaim `orders_target.csv` adalah hasil migrasi yang “semua cocok”. Kamu tidak percaya klaim — kamu menghitung. Tekniknya: bagi tabel jadi batch (tiap 1.000 id = 1 batch: B1–B5), hitung checksum = jumlah kolom `total` per batch di sumber dan di target, lalu bandingkan. Batch yang checksum-nya beda = batch yang bermasalah.",
        "Tiga angka yang harus kamu hasilkan: `batch_bermasalah` (daftar batch yang checksum-nya tidak cocok), `baris_hilang` (id di sumber tapi tidak di target), `baris_rusak` (id ada di dua-duanya tapi `total`-nya beda), dan `selisih_total` (selisih jumlah total keseluruhan — angka yang menjelaskan “uang ke mana”).",
        "Kenapa checksum per batch, bukan satu checksum global? Karena satu angka global hanya bilang “ada yang salah” — checksum per batch bilang “salahnya DI MANA”, sehingga kamu cukup memigrasi ulang batch itu, bukan semuanya.",
      ],
      tasks: [
        { id: "t1", text: "Muat orders.csv + orders_target.csv; hitung checksum per batch (B1–B5)" },
        { id: "t2", text: "Temukan `batch_bermasalah`, `baris_hilang`, `baris_rusak`, `selisih_total`" },
      ],
      expected:
        "batch_bermasalah = [B1..B5] (semua!), baris_hilang = 129, baris_rusak = 5, selisih_total = 172696727",
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(BASE + \"/orders.csv\"))`.",
        "Batch dari id: `\"B\" + str((oid - 1) // 1000 + 1)` — pakai `.map()` pada kolom id.",
        "Checksum: `df.groupby(df[\"id\"].map(batch))[\"total\"].sum().to_dict()`.",
        "Baris hilang: `set(sumber[\"id\"]) - set(target[\"id\"])`; baris rusak: merge lalu bandingkan kolom total.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-migrasi-tanpa-downtime\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "sumber = pd.read_csv(open_url(BASE + \"/orders.csv\"))",
          "target = pd.read_csv(open_url(BASE + \"/orders_target.csv\"))",
          "",
          "def batch(oid):",
          "    return ...   # \"B1\"..\"B5\": tiap 1000 id = 1 batch",
          "",
          "checksum_sumber = ...   # dict batch -> jumlah total",
          "checksum_target = ...",
          "",
          "batch_bermasalah = ...  # list batch yang checksum-nya beda, urut",
          "baris_hilang = ...      # id di sumber tapi tidak di target",
          "baris_rusak = ...       # id ada di keduanya tapi total-nya beda",
          "selisih_total = ...     # jumlah total sumber - jumlah total target",
          "",
          "print(\"batch bermasalah:\", batch_bermasalah)",
          "print(\"hilang:\", baris_hilang, \"| rusak:\", baris_rusak)",
          "print(\"selisih total: Rp\", selisih_total)",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-migrasi-tanpa-downtime\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "sumber = pd.read_csv(open_url(BASE + \"/orders.csv\"))",
          "target = pd.read_csv(open_url(BASE + \"/orders_target.csv\"))",
          "",
          "def batch(oid):",
          "    return \"B\" + str((int(oid) - 1) // 1000 + 1)",
          "",
          "checksum_sumber = sumber.groupby(sumber[\"id\"].map(batch))[\"total\"].sum().to_dict()",
          "checksum_target = target.groupby(target[\"id\"].map(batch))[\"total\"].sum().to_dict()",
          "",
          "batch_bermasalah = sorted([b for b in checksum_sumber if checksum_sumber[b] != checksum_target.get(b)])",
          "baris_hilang = len(set(sumber[\"id\"]) - set(target[\"id\"]))",
          "gab = sumber.merge(target, on=\"id\", suffixes=(\"_s\", \"_t\"))",
          "baris_rusak = int((gab[\"total_s\"] != gab[\"total_t\"]).sum())",
          "selisih_total = int(sumber[\"total\"].sum() - target[\"total\"].sum())",
          "",
          "print(\"batch bermasalah:\", batch_bermasalah)",
          "print(\"hilang:\", baris_hilang, \"| rusak:\", baris_rusak)",
          "print(\"selisih total: Rp\", selisih_total)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`checksum_sumber` terhitung", name: "checksum_sumber", msg: "Hitung jumlah total per batch dari orders.csv." },
          { kind: "equal", task: "t2", label: "`batch_bermasalah` = semua batch", name: "batch_bermasalah", value: ["B1", "B2", "B3", "B4", "B5"], msg: "Kelima batch checksum-nya tidak cocok — migrasi kontraktor bocor di mana-mana." },
          { kind: "equal", task: "t2", label: "`baris_hilang` = 129", name: "baris_hilang", value: 129, msg: "129 id ada di sumber tapi lenyap di target." },
          { kind: "equal", task: "t2", label: "`baris_rusak` = 5", name: "baris_rusak", value: 5, msg: "5 baris tiba tapi isi kolom total-nya berubah." },
          { kind: "equal", task: "t2", label: "`selisih_total` = 172696727", name: "selisih_total", value: 172696727, msg: "Jumlahkan kolom total di kedua file, lalu selisihkan." },
        ],
      },
      note: {
        title: "Checksum yang jujur vs checksum yang menipu",
        type: "risk",
        body: "Checksum hanya se pandai kolom yang ia cakup. Checksum atas kolom `id` saja akan “cocok” walau isi baris rusak total — kamu akan bertemu checksum palsu semacam ini di misi audit. Aturan: checksum mencakup SEMUA kolom yang penting bagi bisnis (di sini: `total`), bukan sekadar kunci.",
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 6 · Checkpoint keputusan",
      title: "Strategi apa yang kamu bawa ke CTO?",
      prose: [
        "Audit selesai: FK yatim, duplikat PK, NULL terlarang — semua terpetakan. Verifikasi Lab 2 membuktikan migrasi kontraktor bocor (129 baris hilang, 5 rusak). Sekarang CTO menunggumu di ruang rapat dengan satu pertanyaan: “Jadi kita pakai strategi apa?” Pilihanmu menentukan apa yang terjadi dalam 4 jam jendela — dan apa yang kamu hadapi setelahnya.",
      ],
      tasks: [
        { id: "t1", text: "Pilih satu strategi — keputusan ini final seperti memo yang sudah dikirim" },
      ],
      decision: {
        prompt:
          "Strategi migrasi apa yang kamu rekomendasikan ke CTO untuk jendela 4 jam? (Keputusan final — seperti memo yang sudah dikirim.)",
        options: [
          {
            id: "opt-bigbang",
            label: "Big-bang: matikan 4 jam, salin semua, nyalakan",
            rationale:
              "Paling sederhana, tidak perlu membangun dual-write. 14.000 baris mestinya muat disalin dalam 4 jam — dan tim kecil kita tidak punya kapasitas membangun pipeline paralel.",
            nextStepId: "cabang-bigbang",
            consequenceNote:
              "Di jam ke-3, load gagal pada duplikat PK yang belum dibersihkan — constraint baru menolaknya. Kamu tidak tahu batch mana yang sudah masuk. Rollback buta memakan 3 jam tambahan: total 7 jam offline. CTO mengingat siapa yang mengusulkan ini.",
          },
          {
            id: "opt-dualwrite",
            label: "Dual-write bertahap + checksum per batch + cutover menit terakhir",
            rationale:
              "Butuh kerja 2 minggu membangun dual-write, tapi verifikasi terjadi SEBELUM titik tidak-kembali. Cutover hanya memindahkan trafik baca — downtime hitungan menit, bukan jam.",
            nextStepId: "cabang-dualwrite",
            consequenceNote:
              "Dua minggu membangun dual-write terbayar lunas: checksum menemukan 3 batch bermasalah SEBELUM cutover, diperbaiki tanpa tekanan. Cutover 11 menit. CTO menyebut namamu di town hall — sebagai contoh perencanaan yang benar.",
          },
          {
            id: "opt-shadow",
            label: "Shadow read dulu 1 bulan, migrasi data nanti",
            rationale:
              "Paling aman: sistem baru diuji dengan trafik asli tanpa risiko. Kalau shadow menunjukkan hasil identik selama sebulan, barulah data dipindah.",
            nextStepId: "cabang-shadow",
            consequenceNote:
              "Shadow berjalan mulus — tapi tidak memindahkan satu baris pun. Jendela 4 jam terlewat; jendela berikutnya 11 bulan lagi. Database warisan tetap menjadi bom waktu, dan tim shadow kelelahan memelihara dua sistem tanpa kepastian. Aman hari ini, berisiko selamanya.",
          },
        ],
      },
    },
    {
      id: "cabang-bigbang",
      goto: "audit",
      eyebrow: "Langkah 7 · Konsekuensi",
      title: "Diputuskan: big-bang",
      prose: [
        "CTO menyetujui big-bang — “sederhana dan cepat”. Jam 01:00 jendela dimulai: aplikasi dimatikan, load dimulai. Jam 03:47, di 78% progres, load BERHENTI: duplikat PK. Sistem baru menolak baris kedua — dan skrip load tidak mencatat batch mana yang sudah commit.",
        "Tiga jam berikutnya adalah kekacauan terorganisir: tim memilah manual baris mana yang sudah masuk, rollback parsial, lalu load ulang setelah membersihkan duplikat — sambil toko offline dan telepon CTO tidak berhenti berdering. Total downtime: 7 jam 12 menit.",
        "Pelajaran yang mahal: big-bang menggabungkan dua risiko terbesar (kegagalan + ketidaktahuan posisi) di momen paling tidak bisa ditawar. Kesederhanaan strategi ini adalah ilusi — kompleksitasnya hanya dipindah ke jam-jam paling gelap.",
      ],
      tasks: [],
      note: {
        title: "Kegagalan yang bisa diramal = kelalaian",
        body: "Duplikat PK itu SUDAH kamu temukan di Lab 1. Strategi yang gagal karena temuan audit yang diabaikan bukan “musibah” — itu memo yang tidak dibaca. Di deliverable-mu, setiap temuan audit wajib punya baris “ditangani dengan cara X sebelum cutover”.",
      },
    },
    {
      id: "cabang-dualwrite",
      goto: "audit",
      eyebrow: "Langkah 7 · Konsekuensi",
      title: "Diputuskan: dual-write",
      prose: [
        "CTO mengerutkan dahi mendengar “dua minggu membangun” — tapi angka Lab 1 (temuan audit) dan Lab 2 (129 baris hilang versi kontraktor) membuat argumenmu tidak terbantahkan. Dual-write dibangun: setiap order baru ditulis ke lama dan baru, backfill historis berjalan per batch, checksum diverifikasi tiap malam.",
        "Di hari ke-9, checksum menemukan 3 batch bermasalah — diperbaiki santai, tanpa downtime, tanpa telepon berdering. Malam cutover: trafik baca dipindah, 11 menit, nol error. Pagi harinya toko buka seperti biasa; tidak ada pelanggan yang tahu database-nya baru.",
        "Ini harga dual-write: dua minggu kerja membosankan untuk 11 menit yang membosankan. Migrasi terbaik adalah migrasi yang tidak terasa — dan “tidak terasa” adalah hasil perencanaan, bukan keberuntungan.",
      ],
      tasks: [],
      note: {
        title: "Verifikasi sebelum titik tidak-kembali",
        body: "Satu-satunya perbedaan antara dual-write dan big-bang bukanlah kecepatan — melainkan KAPAN kebenaran diketahui. Dual-write tahu sebelum cutover (masih bisa diperbaiki murah). Big-bang tahu sesudah (memperbaiki = bencana). Setiap strategi migrasimu kelak harus menjawab: kapan kita tahu ini benar?",
      },
    },
    {
      id: "cabang-shadow",
      goto: "audit",
      eyebrow: "Langkah 7 · Konsekuensi",
      title: "Diputuskan: shadow read",
      prose: [
        "Shadow read berjalan indah: sebulan penuh, sistem baru menjawab query bayangan dengan hasil identik. Tim merasa aman. Lalu realitas mengetuk: shadow TIDAK memindahkan data — ia hanya membuktikan sistem baru bisa membaca. Jendela 4 jam tahun ini terlewat tanpa migrasi.",
        "Jendela berikutnya: 11 bulan lagi. Selama itu, database warisan menua 11 bulan lagi, tim memelihara DUA sistem (biaya ganda, kebingungan ganda), dan semangat “migrasi” menguap. Shadow adalah alat validasi yang hebat — dan strategi migrasi yang buruk, karena ia menunda keputusan tersulit: kapan pindah.",
        "Pelajaran: validasi tanpa tenggat = penundaan yang dibungkus metodologi. Shadow boleh dipakai — sebagai FASE di dalam dual-write (validasi sebelum cutover), bukan sebagai pengganti migrasi.",
      ],
      tasks: [],
      note: {
        title: "Alat yang benar, dipakai untuk pekerjaan yang salah",
        body: "Shadow read menjawab “apakah sistem baru benar?” — pertanyaan yang memang penting. Tapi pertanyaan migrasinya adalah “bagaimana data pindah tanpa hilang?” — dan itu tidak dijawab shadow. Di deliverable-mu, bedakan jelas: apa yang divalidasi, dan apa yang dieksekusi.",
      },
    },
    {
      id: "audit",
      eyebrow: "Langkah 8 · Misi audit",
      title: "Dossier 14 baris: “migrasi selesai” yang bohong",
      prose: [
        "Sebelum menulis laporan migrasi, satu misi audit. Di bawah ini 14 baris “Berita Acara Migrasi — Kontraktor”, dokumen yang menyatakan migrasi SELESAI dan semua cocok. Seseorang menyuntikkan 4 sabotase ke dalamnya. Senjatamu: 129 baris hilang dan 5 baris rusak dari Lab 2, plus temuan audit Lab 1.",
        "Fokus pada baris yang SALING BERTENTANGAN — dokumen bohong yang baik selalu punya satu baris jujur yang tidak sengaja lolos.",
      ],
      tasks: [],
      auditDossier: {
        version: "migrasi-m2a-v1",
        snapshotDate: "2026-10-15",
        intro:
          "Dossier ini diklaim sebagai Berita Acara Migrasi dari kontraktor yang menyatakan migrasi SELESAI dan 100% cocok.",
        columns: ["Tabel / Objek", "Baris sumber", "Baris target", "Status", "Catatan"],
        rows: [
          { rowId: 1, cells: { "Tabel / Objek": "customers", "Baris sumber": "1.000", "Baris target": "1.000", "Status": "Migrasi selesai", "Catatan": "Checksum cocok" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          // ── I1: baris kurang ──
          { rowId: 2, cells: { "Tabel / Objek": "orders", "Baris sumber": "5.000", "Baris target": "4.871", "Status": "Migrasi selesai", "Catatan": "Checksum cocok" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          { rowId: 3, cells: { "Tabel / Objek": "payments", "Baris sumber": "8.000", "Baris target": "8.000", "Status": "Migrasi selesai", "Catatan": "Checksum cocok" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          { rowId: 4, cells: { "Tabel / Objek": "products", "Baris sumber": "350", "Baris target": "350", "Status": "Migrasi selesai", "Catatan": "Checksum cocok" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          // ── I2: constraint mati ──
          { rowId: 5, cells: { "Tabel / Objek": "FK orders → customers", "Baris sumber": "—", "Baris target": "—", "Status": "Nonaktif saat load", "Catatan": "Dinyalakan ulang: (kosong)" }, claims: [{ label: "Bukti penyalaan", value: "—" }] },
          { rowId: 6, cells: { "Tabel / Objek": "FK payments → orders", "Baris sumber": "—", "Baris target": "—", "Status": "Nonaktif saat load", "Catatan": "Dinyalakan ulang: (kosong)" }, claims: [{ label: "Bukti penyalaan", value: "—" }] },
          { rowId: 7, cells: { "Tabel / Objek": "PK orders", "Baris sumber": "—", "Baris target": "—", "Status": "Aktif", "Catatan": "Terverifikasi" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          // ── I3: enum liar ──
          { rowId: 8, cells: { "Tabel / Objek": "CHECK status orders", "Baris sumber": "—", "Baris target": "—", "Status": "Aktif", "Catatan": "Ada nilai 'dibatalkan_x' di target" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          // ── I4: checksum palsu ──
          { rowId: 9, cells: { "Tabel / Objek": "Metode checksum orders", "Baris sumber": "—", "Baris target": "—", "Status": "Terverifikasi", "Catatan": "Checksum atas kolom id saja" }, claims: [{ label: "Metode", value: "Checksum id" }] },
          { rowId: 10, cells: { "Tabel / Objek": "Snapshot pra-migrasi", "Baris sumber": "—", "Baris target": "—", "Status": "Ada", "Catatan": "Backup penuh 03:00" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          { rowId: 11, cells: { "Tabel / Objek": "Rencana rollback", "Baris sumber": "—", "Baris target": "—", "Status": "Terdokumentasi", "Catatan": "RTO 45 menit" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          { rowId: 12, cells: { "Tabel / Objek": "Jendela cutover", "Baris sumber": "—", "Baris target": "—", "Status": "Sesuai rencana", "Catatan": "3 jam 40 menit" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          { rowId: 13, cells: { "Tabel / Objek": "Dual-write", "Baris sumber": "—", "Baris target": "—", "Status": "Aktif", "Catatan": "2×24 jam, 0 konflik" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          { rowId: 14, cells: { "Tabel / Objek": "Verifikasi akhir", "Baris sumber": "—", "Baris target": "—", "Status": "Lengkap", "Catatan": "100% tabel cocok" }, claims: [{ label: "Kesimpulan", value: "Migrasi sukses" }] },
        ],
        injections: [
          { key: "baris-hilang", rowIds: [2, 14], title: "Tabel “selesai” tapi baris kurang", clue: "orders: 5.000 → 4.871. 129 baris hilang tanpa satu kalimat penjelasan — sementara baris 14 mengklaim “100% tabel cocok”. Hitunganmu di Lab 2: persis 129.", danger: "Cutover dengan 129 baris hilang = 129 order pelanggan lenyap. Hitung baris per tabel adalah verifikasi minimum yang tidak boleh dilewat." },
          { key: "constraint-mati", rowIds: [5, 6], title: "Constraint dimatikan, tidak dinyalakan lagi", clue: "FK “nonaktif saat load” — kolom bukti penyalaan ulang KOSONG. Praktik benar: matikan untuk bulk load, nyalakan + validasi ulang setelahnya.", danger: "Tanpa FK yang aktif, baris yatim menumpuk diam-diam di sistem baru. Integritas runtuh bukan saat migrasi — melainkan 3 bulan kemudian, saat tidak ada yang mengawasi." },
          { key: "enum-liar", rowIds: [8], title: "Nilai enum di luar daftar lolos", clue: "'dibatalkan_x' tercatat ADA di target — padahal status CHECK diklaim aktif. Constraint yang tidak menolak nilai liar = constraint hiasan.", danger: "Satu nilai liar merusak semua agregat laporan (GROUP BY status) dan logika bisnis downstream yang mengasumsikan daftar tertutup." },
          { key: "checksum-palsu", rowIds: [9], title: "Checksum yang tidak memeriksa isi", clue: "Checksum hanya atas kolom id — 5 baris rusak isi di Lab 2 tetap “cocok” menurut metode ini. Sidik jari yang hanya memotret bingkai, bukan lukisannya.", danger: "Verifikasi yang salah memberi rasa aman palsu — lebih berbahaya daripada tidak verifikasi sama sekali, karena menghentikan orang mencari masalah yang nyata ada." },
        ],
      },
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 9 · Deliverable",
      title: "Laporan migrasi untuk CTO",
      prose: [
        "Semua bukti di tangan. Tulis laporan migrasi satu halaman untuk CTO — artefak portofoliomu. Laporan migrasi yang baik tidak hanya bilang “selesai”, tapi menunjukkan ANGKA pembuktiannya, apa yang disembunyikan berita acara kontraktor, dan bagaimana rollback dijalankan bila cutover gagal.",
      ],
      tasks: [],
      deliverable: {
        template: [
          "Ringkasan eksekutif (3 kalimat): strategi yang dipilih, hasil verifikasi (baris cocok/hilang/rusak per tabel), vonis go/no-go beserta alasannya.",
          "Bukti audit pra-migrasi: temuan integritas dari Lab 1 (FK yatim, duplikat PK, NULL terlarang) + bagaimana TIAP temuan ditangani SEBELUM cutover.",
          "Rencana migrasi: fase demi fase (audit → backfill → dual-write → verifikasi checksum per batch → cutover → rollback) dengan durasi tiap fase di dalam jendela 4 jam.",
          "Temuan audit pasca-migrasi: anomali di dossier kontraktor, baris per baris, + rekomendasi perbaikan untuk tiap anomali.",
          "Batas & risiko sisa: apa yang TIDAK diverifikasi misi ini (mis. performa query di mesin baru, konsistensi bacaan selama dual-write) + rencana rollback bila cutover gagal.",
        ],
        rubric: [
          { criterion: "Kelengkapan audit pra-migrasi", weight: 25, levels: ["Temuan tidak disebut", "Sebagian temuan disebut tanpa penanganan", "Semua temuan Lab 1 disebut + tiap temuan punya rencana penanganan pra-cutover"] },
          { criterion: "Kualitas rencana migrasi", weight: 25, levels: ["Fase tidak jelas / tak muat 4 jam", "Fase ada tapi tanpa verifikasi per batch", "Fase lengkap + checksum per batch + cutover menit terakhir + rollback tertulis"] },
          { criterion: "Deteksi anomali pasca-migrasi", weight: 25, levels: ["Tidak menyebut anomali dossier", "Menyebut sebagian tanpa nomor baris", "Keempat anomali disebut dengan nomor baris + rekomendasi perbaikan"] },
          { criterion: "Kejujuran batas & rollback", weight: 25, levels: ["Mengklaim migrasi terbukti sempurna", "Menyebut sebagian batas", "Batas verifikasi dinyatakan eksplisit + rencana rollback konkret (RTO, checkpoint batch)"] },
        ],
      },
    },
    {
      id: "debrief",
      eyebrow: "Langkah 10 · Debrief + rangkuman",
      title: "Yang sebenarnya terjadi — dan kenapa ini penting",
      prose: [
        "Debrief dibuka. Empat sabotase di berita acara kontraktor:",
        "1) **Baris hilang** (baris 2 & 14): orders 5.000 → 4.871, tapi kesimpulan “100% cocok”. Angka Lab 2 milikmu (129 hilang) adalah buktinya — dan baris 14 adalah baris jujur yang tidak sengaja lolos: dokumen bohong selalu punya satu kontradiksi internal.",
        "2) **Constraint mati** (baris 5–6): FK dinonaktifkan untuk load, kolom “dinyalakan ulang” kosong. Ini bom waktu klasik: migrasi terlihat sukses, integritas runtuh kuartal berikutnya.",
        "3) **Enum liar** (baris 8): 'dibatalkan_x' lolos ke target meski CHECK diklaim aktif. Constraint yang tidak menolak = hiasan.",
        "4) **Checksum palsu** (baris 9): checksum atas kolom id saja. Lima baris rusak isi dari Lab 2 tidak terdeteksi metode ini — verifikasi yang salah lebih berbahaya daripada tidak verifikasi.",
        "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim “selesai” terhadap hitunganmu sendiri, atau memercayai stempel kontraktor. Dan ingat keputusan bercabangmu: dual-write bukan strategi tercepat — ia strategi yang tahu kebenaran SEBELUM titik tidak-kembali. Itulah satu-satunya keunggulan yang penting dalam migrasi.",
        "Bahaya nyata terakhir: migrasi big-bang yang gagal di tengah bukan sekadar “downtime lebih lama” — ia menciptakan keadaan di mana tidak ada yang tahu data mana yang sudah pindah. Ketidakpastian, bukan downtime, adalah bencana sebenarnya. DBA dibayar bukan untuk memindah data; DBA dibayar untuk menghilangkan ketidakpastian.",
      ],
      tasks: [],
      note: {
        title: "Migrasi selesai ≠ migrasi benar",
        type: "risk",
        body: "“Migrasi selesai” adalah klaim tentang PROSES (baris sudah disalin). “Migrasi benar” adalah klaim tentang KEADAAN (setiap baris tiba utuh + constraint aktif + checksum isi cocok). Berita acara yang hanya membuktikan proses adalah undangan untuk mempercayai — dan kepercayaan bukan strategi verifikasi.",
      },
      summary: [
        "Audit pra-migrasi menemukan 3 pola kotoran: FK yatim (orders/payments), duplikat PK (orders), NULL di kolom NOT NULL (customers.email) — ditangani SEBELUM cutover, bukan sesudah.",
        "Verifikasi checksum per batch (B1–B5) atas kolom isi membuktikan migrasi kontraktor bocor: 129 baris hilang, 5 baris rusak, selisih Rp 172.696.727.",
        "Dual-write + checksum per batch adalah strategi yang tahu kebenaran SEBELUM titik tidak-kembali; big-bang menggabungkan risiko gagal + ketidaktahuan posisi di momen paling genting.",
        "Empat pola sabotase berita acara: baris hilang yang diklaim cocok, constraint dimatikan-tak-dinyalakan, enum liar lolos CHECK, checksum palsu (hanya atas kolom id).",
        "Data: 100% SINTETIS (seed 42) — database warisan fiktif “Toko Warisan”; kotoran disuntik sengaja sebagai bahan latihan. Metode: METODE.md.",
      ],
    },
  ],
};

export default misiMigrasi;

import type { V2Mission } from "../lib/types";

// ── MISI Kanonis: Dari Query Mentah ke Dashboard Keputusan ────────────────
// Capstone #2 — SQL (track rumah) × Business Intelligence.
// Dataset 100% SINTETIS, seed 42. File: public/misi/misi-gabung-query-ke-dashboard/
// (pelanggan.csv 36, langganan.csv 49, pembayaran.csv 152) + METODE.md.

const BASE = "/misi/misi-gabung-query-ke-dashboard";

export const misiGabungQueryDashboard: V2Mission = {
  slug: "misi-gabung-query-ke-dashboard",
  track: "SQL",
  module: "Misi",
  title: "Misi Kanonis: Dari Query Mentah ke Dashboard Keputusan",
  estMinutes: 180,
  role: "Analis Business Intelligence",
  client:
    "CEO NusaCloud — dashboard keputusan Q3 butuh satu angka MRR yang bisa dipertahankan; tiga tim punya tiga query warisan dengan tiga angka berbeda",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Tiga query, tiga angka, satu label",
      prose: [],
      tasks: [
        { id: "t1", text: "Baca seluruh briefing; tulis ulang dengan kata-katamu sendiri: apa yang diminta CEO" },
        { id: "t2", text: "Catat tiga angka warisan Juni 2026 — inilah yang harus kamu rekonsiliasi" },
      ],
      briefing: {
        role: "Analis Business Intelligence di NusaCloud (startup SaaS fiktif) — pemilik angka untuk keputusan",
        client:
          "CEO. Rapat anggaran Q3 tinggal 10 hari. Ia butuh satu angka MRR (Monthly Recurring Revenue) Juni 2026 di dashboard keputusan — angka yang berani ia pertahankan di depan dewan. Masalahnya: tim Finance punya query warisan yang bilang Rp 64.000.000, tim Product bilang Rp 67.800.000, tim Growth bilang Rp 102.800.000. Tiga query, tiga angka, satu label: “MRR”. Masing-masing tim bersumpah query-nya benar — dan secara teknis, ketiganya memang jalan tanpa error. Kamu diminta: rekonsiliasi ketiganya dengan SQL, bangun satu query kanonis sebagai single source of truth, audit draf dashboardnya, dan tulis spesifikasi dashboard yang tidak bisa berbohong lagi.",
        story: [
          "Senin, 09:12. CEO meneruskan tiga tangkapan layar ke grup direksi. Finance: MRR Juni Rp 64,0 jt. Product: Rp 67,8 jt. Growth: Rp 102,8 jt. Di bawahnya satu kalimat: “Mau pakai yang mana?” Grup hening. Head of Growth mengetik: “Punya kami paling lengkap — join semua tabel.” Head of Finance membalas: “Punya kami dari kas nyata, bukan asumsi.” Kamu menatap ketiganya dan menyadari sesuatu yang tidak disadari mereka: tidak ada satu pun query yang ERROR. Semuanya jalan. Semuanya “benar” — menurut logikanya masing-masing.",
          "Kamu meminta akses read-only ke gudang data. Tiga tabel: pelanggan, langganan, pembayaran. Query Finance menjumlah pembayaran; query Product menjumlah langganan; query Growth menggabungkan ketiganya lalu menjumlah. Tiga sudut pandang atas data yang sama — dan selisih Rp 38,8 juta di antaranya bukan noise. Itu arsitektur.",
          "Misi ini memakai data sintetis NusaCloud (36 pelanggan, 49 langganan, 152 pembayaran, Jan–Jun 2026). Tugasmu: buktikan dari mana tiap selisih berasal — baris per baris, dengan SQL — lalu bangun query kanonis, kunci definisinya di kontrak semantik, temukan 4 sabotase di draf dashboard, dan serahkan spesifikasi dashboard yang berani ditandatangani.",
        ],
        objectives: [
          "Merekonsiliasi tiga angka MRR warisan (Rp 64,0 jt / Rp 67,8 jt / Rp 102,8 jt) dan membuktikan sumber tiap selisih terhadap angka kanonis Rp 49.150.000.",
          "Membangun query kanonis MRR (dedup, filter recurring, batas periode eksplisit) yang lolos checks di data mini maupun data penuh.",
          "Menemukan 4 sabotase di draf dashboard dan menulis spesifikasi dashboard + kamus metrik berversi yang bisa dipertahankan.",
        ],
        prereqSummary:
          "MRR (Monthly Recurring Revenue) = total nilai langganan berbayar yang aktif, biasanya dihitung per akhir bulan. JOIN menggabungkan baris antar tabel; bahayanya, JOIN satu-ke-banyak melipatgandakan baris (fan-out) sehingga SUM sesudahnya ikut meledak. Kamu tidak butuh teori baru di sini — yang kamu butuhkan adalah kecurigaan: query yang jalan tanpa error belum tentu menghitung yang kamu kira.",
        datasetNote:
          "Status data: 100% SINTETIS — NusaCloud adalah perusahaan fiktif; tidak ada pendapatan perusahaan nyata. Dibangkitkan oleh skrip build-misi/misi-gabung-query-ke-dashboard/gen.py dengan seed tetap 42 (deterministik).\nFile: pelanggan.csv (36), langganan.csv (49: sub_id, customer_id, plan, mrr, mulai, berakhir kosong = aktif, status aktif/berakhir/trial), pembayaran.csv (152: pay_id, customer_id, tanggal, jumlah, jenis langganan/setup, status berhasil/gagal/dikembalikan, ref_gateway).\nJebakan dirancang by design: duplikat webhook (ref_gateway sama), biaya setup satu kali, langganan trial, langganan berakhir pertengahan Juni, dan join fan-out. Metode lengkap: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Gudang data yang “sudah ada”",
      prose: [
        "`pelanggan.csv`: 36 pelanggan fiktif — customer_id, nama, segmen (SMB/Enterprise), mulai. Tabel dimensi: satu baris per pelanggan.",
        "`langganan.csv`: 49 langganan — sub_id, customer_id, plan (Dasar/Pro/Enterprise), mrr (rupiah per bulan), mulai, berakhir (kosong = masih aktif), status (aktif/berakhir/trial). Satu pelanggan bisa punya lebih dari satu langganan — ingat fakta ini, ia akan meledak di query Growth.",
        "`pembayaran.csv`: 152 pembayaran — pay_id, customer_id, tanggal, jumlah, jenis (langganan/setup), status (berhasil/gagal/dikembalikan), ref_gateway (referensi gateway pembayaran). Satu pembayaran nyata bisa muncul DUA baris bila webhook gateway terkirim ganda — keduanya berstatus berhasil.",
        "Tiga query warisan (verbatim dari repo tim, hanya format dirapikan): Finance menjumlah `pembayaran` Juni yang berhasil; Product menjumlah `mrr` langganan yang mulai ≤ 30 Jun dan berakhir ≥ 1 Jun; Growth menggabungkan pelanggan × langganan × pembayaran Juni lalu menjumlah `mrr`. Aturan main: (1) angka kanonis dibangun dari definisi, bukan dari kompromi antar query; (2) setiap selisih harus bisa ditunjuk baris penyebabnya; (3) tidak ada definisi yang berubah tanpa versi baru.",
      ],
      tasks: [
        { id: "t1", text: "Buka ketiga CSV: cocokkan jumlah baris (36 / 49 / 152) dan pahami relasinya" },
        { id: "t2", text: "Cari di pembayaran.csv: ada ref_gateway yang muncul dua kali — catat apa artinya" },
      ],
      note: {
        title: "Miskonsepsi #1: data yang “sudah ada” = data yang sudah benar",
        type: "pitfall",
        body: "“Gudangnya sudah jalan bertahun-tahun, pasti datanya beres.” Gudang data NusaCloud memang jalan — dan justru itu masalahnya: query-query warisan ditulis bertahun-tahun lalu oleh orang yang sudah resign, untuk kebutuhan yang sudah berubah, dan tidak pernah diaudit ulang. Data mentah di sini tidak kotor; yang kotor adalah ASUMSI yang dikubur di dalam query. Misi ini melatihmu menggalinya kembali.",
      },
      reference:
        "pelanggan.csv (36) + langganan.csv (49) + pembayaran.csv (152). Ketiganya SINTETIS (seed 42); relasi: pelanggan 1–N langganan, pelanggan 1–N pembayaran.",
    },
    {
      id: "lab-sql-rekonsiliasi",
      eyebrow: "Langkah 3 · Lab 1 — Rekonsiliasi tiga query",
      title: "Buktikan ketiganya “benar” — dan ketiganya beda",
      prose: [
        "Sebelum menuduh, reproduksi. Di bawah ini versi mini dari gudang data (4 pelanggan, 7 langganan, 8 pembayaran — jebakan yang sama, skala kecil). Tugasmu: tulis SATU query dengan tiga cabang UNION ALL yang menghitung ulang ketiga angka warisan untuk Juni 2026. Finance: jumlahkan pembayaran Juni yang berhasil. Product: jumlahkan mrr langganan dengan mulai ≤ '2026-06-30' dan (berakhir kosong atau ≥ '2026-06-01'). Growth: gabungkan ketiga tabel, saring pembayaran Juni yang berhasil, jumlahkan mrr.",
        "Hasil yang diharapkan justru KETIDAKCOCOKAN: tiga angka berbeda dari data yang sama. Itulah bukti bahwa masalahnya ada di logika, bukan di typo.",
      ],
      tasks: [
        { id: "t1", text: "Tulis cabang Finance: SUM pembayaran Juni yang berhasil" },
        { id: "t2", text: "Tulis cabang Product: SUM mrr dengan batas periode warisan" },
        { id: "t3", text: "Tulis cabang Growth: JOIN tiga tabel lalu SUM mrr; ORDER BY tim" },
      ],
      expected:
        "3 baris — Finance Rp 19.900.000, Growth Rp 22.650.000, Product Rp 11.750.000: ketiganya konsisten dengan logikanya masing-masing, dan ketiganya saling bertentangan",
      sqlLab: {
        task: "Reproduksi ketiga angka warisan (Juni 2026) dalam SATU query UNION ALL: kolom tim, mrr_juni. Urutkan per tim.",
        schema: "CREATE TABLE pelanggan_mini (customer_id TEXT, nama TEXT, segmen TEXT);\nCREATE TABLE langganan_mini (sub_id TEXT, customer_id TEXT, plan TEXT, mrr INTEGER, mulai TEXT, berakhir TEXT, status TEXT);\nCREATE TABLE pembayaran_mini (pay_id TEXT, customer_id TEXT, tanggal TEXT, jumlah INTEGER, jenis TEXT, status TEXT, ref_gateway TEXT);",
        seedData: [
          "INSERT INTO pelanggan_mini VALUES",
          "('P1','PT Sinar Abadi','SMB'),('P2','PT Cahaya Timur','Enterprise'),",
          "('P3','CV Berkah Jaya','SMB'),('P4','PT Nusa Digital','SMB');",
          "INSERT INTO langganan_mini VALUES",
          "('S1','P1','Pro',1500000,'2026-01-15',NULL,'aktif'),",
          "('S2','P1','Dasar',400000,'2026-03-01',NULL,'aktif'),",
          "('S3','P2','Enterprise',8000000,'2026-02-01',NULL,'aktif'),",
          "('S4','P3','Pro',1200000,'2026-04-10','2026-06-12','berakhir'),",
          "('S5','P3','Dasar',350000,'2026-05-01',NULL,'trial'),",
          "('S6','P4','Pro',1000000,'2026-01-05','2026-05-20','berakhir'),",
          "('S7','P4','Dasar',300000,'2026-06-02',NULL,'aktif');",
          "INSERT INTO pembayaran_mini VALUES",
          "('B1','P1','2026-06-05',1900000,'langganan','berhasil','GW-1'),",
          "('B2','P2','2026-06-03',8000000,'langganan','berhasil','GW-2'),",
          "('B3','P2','2026-06-03',8000000,'langganan','berhasil','GW-2'),",
          "('B4','P3','2026-06-08',1200000,'langganan','berhasil','GW-3'),",
          "('B5','P4','2026-06-04',300000,'langganan','berhasil','GW-4'),",
          "('B6','P1','2026-06-15',500000,'setup','berhasil','GW-5'),",
          "('B7','P3','2026-06-20',1200000,'langganan','dikembalikan','GW-6'),",
          "('B8','P2','2026-06-25',8000000,'langganan','gagal','GW-7');",
        ].join("\n"),
        starter: [
          "-- SATU query, tiga cabang UNION ALL. Lengkapi bagian bertanda ...",
          "SELECT 'Finance' AS tim, ... AS mrr_juni",
          "FROM pembayaran_mini",
          "WHERE ...",
          "UNION ALL",
          "SELECT 'Product' AS tim, ...",
          "FROM langganan_mini",
          "WHERE ...",
          "UNION ALL",
          "SELECT 'Growth' AS tim, ...",
          "FROM pelanggan_mini p",
          "JOIN langganan_mini l ON ...",
          "JOIN pembayaran_mini b ON ...",
          "WHERE ...",
          "ORDER BY tim;",
        ].join("\n"),
        solution: [
          "SELECT 'Finance' AS tim, SUM(jumlah) AS mrr_juni",
          "FROM pembayaran_mini",
          "WHERE substr(tanggal,1,7)='2026-06' AND status='berhasil'",
          "UNION ALL",
          "SELECT 'Product' AS tim, SUM(mrr)",
          "FROM langganan_mini",
          "WHERE mulai <= '2026-06-30' AND (berakhir IS NULL OR berakhir >= '2026-06-01')",
          "UNION ALL",
          "SELECT 'Growth' AS tim, SUM(l.mrr)",
          "FROM pelanggan_mini p",
          "JOIN langganan_mini l ON l.customer_id = p.customer_id",
          "JOIN pembayaran_mini b ON b.customer_id = p.customer_id",
          "WHERE substr(b.tanggal,1,7)='2026-06' AND b.status='berhasil'",
          "ORDER BY tim;",
        ].join("\n"),
        expectedColumns: ["tim", "mrr_juni"],
        expectedRows: [
          ["Finance", 19900000],
          ["Growth", 22650000],
          ["Product", 11750000],
        ],
        orderMatters: true,
      },
    },
    {
      id: "bedah-tiga-query",
      eyebrow: "Langkah 4 · Bedah query",
      title: "Tiga bug, tiga kepribadian",
      prose: [
        "Ketiga angka mini itu cerminan data penuh: Finance Rp 64,0 jt, Product Rp 67,8 jt, Growth Rp 102,8 jt vs kanonis Rp 49,15 jt. Sekarang bedah satu per satu — setiap query punya “kepribadian” bug-nya sendiri.",
        "**Finance — Si Kasir yang menghitung dua kali.** Query-nya menjumlah SEMUA pembayaran berhasil di Juni: termasuk 3 biaya `setup` (sekali bayar, bukan recurring) dan 3 baris duplikat webhook (ref_gateway sama, tercatat dua kali). Kasir ini jujur soal uang masuk — tapi MRR bukan soal uang masuk. MRR soal langganan berjalan. Obatnya: saring `jenis='langganan'` dan dedup berdasarkan `ref_gateway` sebelum menjumlah.",
        "**Product — Si Penjaga Gerbang yang salah tanggal.** Query-nya menjumlah mrr langganan dengan `berakhir >= '2026-06-01'`: langganan yang berakhir 12 Juni ikut terhitung PENUH sebulan, padahal ia hanya hidup 12 hari. Plus: tidak menyaring `status='trial'` — 6 langganan trial ikut dihitung sebagai pendapatan. Batas periode satu hari menggeser jutaan rupiah. Obatnya: definisikan eksplisit “aktif pada akhir bulan” dan kecualikan trial.",
        "**Growth — Si Pengganda.** Ini yang paling berbahaya karena paling meyakinkan (“join semua tabel = paling lengkap”). JOIN pelanggan × langganan × pembayaran adalah satu-ke-banyak-ke-banyak: satu langganan muncul sebanyak jumlah pembayaran sukses pelanggannya. Di data mini: P2 punya 1 langganan Rp 8 jt dan 2 baris pembayaran sukses (satu duplikat) → Rp 8 jt terhitung 2 kali = Rp 16 jt. Rumusnya:",
      ],
      formula: String.raw`\text{baris setelah JOIN} = \sum_{c \in \text{pelanggan}} n_{\text{langganan}}(c) \times n_{\text{bayar}}(c)`,
      tasks: [
        { id: "t1", text: "Untuk tiap query warisan, tulis 1 kalimat: APA yang sebenarnya dihitungnya (bukan yang diklaimnya)" },
        { id: "t2", text: "Hitung manual: P2 di data mini — 1 langganan × 2 pembayaran sukses = berapa mrr terhitung?" },
      ],
      note: {
        title: "Miskonsepsi #2: JOIN lalu SUM itu aman",
        type: "pitfall",
        body: "“Datanya sudah di-join dengan benar, tinggal SUM.” Inilah bug termahal di misi ini. SUM tidak tahu bahwa baris yang ia jumlah adalah HASIL LIPATAN join — ia hanya menjumlah apa yang ada. Aturan praktisnya: agregat DULU per tabel (satu baris per pelanggan), JOIN kemudian — atau pastikan join-nya satu-ke-satu sebelum SUM. Query Growth melanggar keduanya, dan hasilnya Rp 102,8 jt: lebih dari DUA KALI LIPAT angka yang benar.",
      },
      reference:
        "Finance: +setup & duplikat webhook. Product: +trial & batas >= 1 Jun. Growth: fan-out n_langganan × n_bayar. Kanonis target: Rp 49.150.000.",
    },
    {
      id: "lab-sql-kanonis",
      eyebrow: "Langkah 5 · Lab 2 — Query kanonis",
      title: "Satu definisi, satu query, satu angka",
      prose: [
        "Kontrak definisi v1.0 (kamu yang menulisnya di Langkah 7 nanti, tapi rumusnya ditetapkan sekarang): MRR bulan M = jumlah `mrr` langganan yang (1) berstatus `aktif` — trial dan berakhir dikecualikan; (2) mulai ≤ akhir bulan M; (3) berakhir kosong ATAU berakhir > akhir bulan M (masih hidup melewati bulan itu). Tiga syarat, tidak lebih, tidak kurang.",
        "Tulis query-nya terhadap tabel mini. Hasilnya harus Rp 10.200.000 dari 4 langganan: S1, S2, S3, S7. S4 gugur (berakhir 12 Jun), S5 gugur (trial), S6 gugur (berakhir Mei). Kalau angkamu beda, syarat mana yang bocor?",
      ],
      tasks: [
        { id: "t1", text: "Tulis query kanonis: 3 syarat (status, mulai, berakhir) — kembalikan mrr_kanonis + n_langganan" },
      ],
      expected: "1 baris — mrr_kanonis = Rp 10.200.000 dari 4 langganan (S1, S2, S3, S7)",
      sqlLab: {
        task: "Bangun QUERY KANONIS MRR Juni 2026 dari langganan_mini: status='aktif', mulai ≤ '2026-06-30', (berakhir NULL atau > '2026-06-30'). Kembalikan mrr_kanonis dan n_langganan.",
        schema: "CREATE TABLE langganan_mini (sub_id TEXT, customer_id TEXT, plan TEXT, mrr INTEGER, mulai TEXT, berakhir TEXT, status TEXT);",
        seedData: [
          "INSERT INTO langganan_mini VALUES",
          "('S1','P1','Pro',1500000,'2026-01-15',NULL,'aktif'),",
          "('S2','P1','Dasar',400000,'2026-03-01',NULL,'aktif'),",
          "('S3','P2','Enterprise',8000000,'2026-02-01',NULL,'aktif'),",
          "('S4','P3','Pro',1200000,'2026-04-10','2026-06-12','berakhir'),",
          "('S5','P3','Dasar',350000,'2026-05-01',NULL,'trial'),",
          "('S6','P4','Pro',1000000,'2026-01-05','2026-05-20','berakhir'),",
          "('S7','P4','Dasar',300000,'2026-06-02',NULL,'aktif');",
        ].join("\n"),
        starter: [
          "-- Query kanonis MRR Juni 2026. Lengkapi bagian bertanda ...",
          "SELECT ... AS mrr_kanonis, ... AS n_langganan",
          "FROM langganan_mini",
          "WHERE ...;",
        ].join("\n"),
        solution: [
          "SELECT SUM(mrr) AS mrr_kanonis, COUNT(*) AS n_langganan",
          "FROM langganan_mini",
          "WHERE status = 'aktif'",
          "  AND mulai <= '2026-06-30'",
          "  AND (berakhir IS NULL OR berakhir > '2026-06-30');",
        ].join("\n"),
        expectedColumns: ["mrr_kanonis", "n_langganan"],
        expectedRows: [[10200000, 4]],
      },
    },
    {
      id: "lab-python-validasi",
      eyebrow: "Langkah 6 · Lab 3 — Validasi di data penuh",
      title: "Dari mini ke 152 baris: apakah kanonismu bertahan?",
      prose: [
        "Query mini lolos — sekarang uji di data penuh (36 pelanggan, 49 langganan, 152 pembayaran). Hitung: ukuran tiap tabel, MRR kanonis Juni + jumlah langganan aktifnya, ketiga angka warisan dari file penuh, dan deret MRR kanonis Jan–Jun 2026 untuk grafik di bawah.",
        "Cara membaca grafik: sumbu X = bulan (Jan–Jun 2026), sumbu Y = MRR dalam juta rupiah; empat garis = kanonis vs tiga query warisan, semuanya dihitung dari file yang sama.",
        "Interpretasi: garis kanonis naik lalu datar di Rp 49,15 jt (Mei–Jun) — bisnisnya stabil, tidak meledak. Garis Growth melambung hingga Rp 110,2 jt di Mei lalu “turun” — volatilitas PALSU dari fan-out, bukan dari bisnis. Finance dan Product melayang di atas kanonis dengan pola yang mengikuti bug masing-masing (setup + duplikat; trial + batas). Dashboard yang memakai garis mana pun selain kanonis sedang menceritakan bisnis yang tidak ada.",
      ],
      tasks: [
        { id: "t1", text: "Muat ketiga CSV; hitung n_pelanggan, n_langganan, n_pembayaran" },
        { id: "t2", text: "Hitung mrr_kanonis_jun dan n_aktif_jun dari file penuh" },
        { id: "t3", text: "Hitung ulang q_fin, q_prod, q_growth (Juni) dari file penuh" },
        { id: "t4", text: "Bangun deret_kanonis Jan–Jun (list 6 angka, integer)" },
      ],
      expected:
        "Kanonis Juni Rp 49.150.000 (34 langganan aktif) vs warisan: Finance Rp 64,0 jt, Product Rp 67,8 jt, Growth Rp 102,8 jt — deret kanonis: 2,6 → 22,15 → 26,15 → 41,2 → 49,15 → 49,15 (juta)",
      echart: {
        option: {
          title: { text: "MRR bulanan Jan–Jun 2026: kanonis vs 3 query warisan (juta Rp)" },
          tooltip: { trigger: "axis" },
          legend: { data: ["Kanonis", "Finance", "Product", "Growth"] },
          xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"] },
          yAxis: { type: "value", name: "juta Rp" },
          series: [
            { name: "Kanonis", type: "line", data: [2.6, 22.15, 26.15, 41.2, 49.15, 49.15] },
            { name: "Finance", type: "line", data: [2.6, 22.15, 44.1, 59.15, 68.5, 64.0] },
            { name: "Product", type: "line", data: [4.0, 28.25, 50.45, 65.85, 76.9, 67.8] },
            { name: "Growth", type: "line", data: [4.3, 26.35, 56.6, 76.3, 110.2, 102.8] },
          ],
        },
        caption: "Empat garis dari file yang sama. Hanya garis kanonis yang definisinya tertulis dan versinya dikunci.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(BASE + \"/langganan.csv\"))` — BASE sudah didefinisikan. Kolom berakhir kosong terbaca NaN: ubah dulu dengan `fillna(\"\")`.",
        "Masker kanonis per bulan: `(lang[\"status\"]==\"aktif\") & (lang[\"mulai\"] <= eom) & ((lang[\"berakhir\"]==\"\") | (lang[\"berakhir\"] > eom))` dengan eom = tanggal akhir bulan.",
        "q_fin: filter pembayaran `(tanggal.str[:7]==\"2026-06\") & (status==\"berhasil\")` lalu jumlahkan. q_prod: masker warisan Product dari Lab 1.",
        "q_growth tanpa SQL: hitung jumlah pembayaran sukses per customer (`groupby(\"customer_id\").size()`), gabungkan ke langganan, lalu `(mrr * n_pay).sum()` — fan-out dalam bentuk pandas.",
        "deret_kanonis: loop bulan 1–6, eom = f\"2026-{m:02d}-{hari}\" dengan hari 31/28/31/30/31/30.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-query-ke-dashboard\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "pel = pd.read_csv(open_url(BASE + \"/pelanggan.csv\"))",
          "lang = pd.read_csv(open_url(BASE + \"/langganan.csv\"))",
          "bay = pd.read_csv(open_url(BASE + \"/pembayaran.csv\"))",
          "lang[\"berakhir\"] = lang[\"berakhir\"].fillna(\"\")",
          "",
          "n_pelanggan = ...",
          "n_langganan = ...",
          "n_pembayaran = ...",
          "",
          "EOM = \"2026-06-30\"",
          "mask_kanonis = ...",
          "mrr_kanonis_jun = ...",
          "n_aktif_jun = ...",
          "",
          "jun = ...   # pembayaran Juni yang berhasil",
          "q_fin = ...",
          "q_prod = ...   # masker warisan Product",
          "cnt = jun.groupby(\"customer_id\").size()",
          "lg = ...   # langganan + jumlah bayar per customer",
          "q_growth = ...",
          "",
          "def kanonis_bulan(m):",
          "    ...",
          "deret_kanonis = [kanonis_bulan(m) for m in range(1, 7)]",
          "",
          "print(\"tabel:\", n_pelanggan, n_langganan, n_pembayaran)",
          "print(\"kanonis Jun:\", mrr_kanonis_jun, \"(\", n_aktif_jun, \"aktif )\")",
          "print(\"warisan Jun: fin\", q_fin, \"| prod\", q_prod, \"| growth\", q_growth)",
          "print(\"deret:\", deret_kanonis)",
        ].join("\n"),
        lockLines: 11,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-query-ke-dashboard\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "pel = pd.read_csv(open_url(BASE + \"/pelanggan.csv\"))",
          "lang = pd.read_csv(open_url(BASE + \"/langganan.csv\"))",
          "bay = pd.read_csv(open_url(BASE + \"/pembayaran.csv\"))",
          "lang[\"berakhir\"] = lang[\"berakhir\"].fillna(\"\")",
          "",
          "n_pelanggan = len(pel)",
          "n_langganan = len(lang)",
          "n_pembayaran = len(bay)",
          "",
          "EOM = \"2026-06-30\"",
          "mask_kanonis = (lang[\"status\"] == \"aktif\") & (lang[\"mulai\"] <= EOM) & ((lang[\"berakhir\"] == \"\") | (lang[\"berakhir\"] > EOM))",
          "mrr_kanonis_jun = int(lang.loc[mask_kanonis, \"mrr\"].sum())",
          "n_aktif_jun = int(mask_kanonis.sum())",
          "",
          "jun = bay[(bay[\"tanggal\"].str[:7] == \"2026-06\") & (bay[\"status\"] == \"berhasil\")]",
          "q_fin = int(jun[\"jumlah\"].sum())",
          "q_prod = int(lang[(lang[\"mulai\"] <= EOM) & ((lang[\"berakhir\"] == \"\") | (lang[\"berakhir\"] >= \"2026-06-01\"))][\"mrr\"].sum())",
          "cnt = jun.groupby(\"customer_id\").size()",
          "lg = lang.merge(cnt.rename(\"n_pay\"), on=\"customer_id\", how=\"left\").fillna({\"n_pay\": 0})",
          "q_growth = int((lg[\"mrr\"] * lg[\"n_pay\"]).sum())",
          "",
          "def kanonis_bulan(m):",
          "    eom = f\"2026-{m:02d}-\" + str({1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30}[m])",
          "    a = lang[(lang[\"status\"] == \"aktif\") & (lang[\"mulai\"] <= eom) & ((lang[\"berakhir\"] == \"\") | (lang[\"berakhir\"] > eom))]",
          "    return int(a[\"mrr\"].sum())",
          "deret_kanonis = [kanonis_bulan(m) for m in range(1, 7)]",
          "",
          "print(\"tabel:\", n_pelanggan, n_langganan, n_pembayaran)",
          "print(\"kanonis Jun:\", mrr_kanonis_jun, \"(\", n_aktif_jun, \"aktif )\")",
          "print(\"warisan Jun: fin\", q_fin, \"| prod\", q_prod, \"| growth\", q_growth)",
          "print(\"deret:\", deret_kanonis)",
        ].join("\n"),
        checks: [
          { kind: "equal", task: "t1", label: "n_pembayaran = 152", name: "n_pembayaran", value: 152, msg: "File pembayaran.csv punya 152 baris (termasuk duplikat webhook yang disengaja)." },
          { kind: "equal", task: "t2", label: "mrr_kanonis_jun = 49150000", name: "mrr_kanonis_jun", value: 49150000, msg: "34 langganan aktif × mrr-nya. Periksa 3 syarat masker kanonis." },
          { kind: "equal", task: "t2", label: "n_aktif_jun = 34", name: "n_aktif_jun", value: 34, msg: "Dari 49 langganan: 34 aktif, 6 trial, sisanya berakhir." },
          { kind: "equal", task: "t3", label: "q_fin = 64000000", name: "q_fin", value: 64000000, msg: "Termasuk 3 biaya setup + 3 duplikat webhook — itulah bengkaknya." },
          { kind: "equal", task: "t3", label: "q_prod = 67800000", name: "q_prod", value: 67800000, msg: "Termasuk 6 trial + 2 langganan yang berakhir pertengahan Juni." },
          { kind: "equal", task: "t3", label: "q_growth = 102800000", name: "q_growth", value: 102800000, msg: "Fan-out: tiap mrr terhitung sebanyak pembayaran sukses pelanggannya." },
          { kind: "defined", task: "t4", label: "deret_kanonis terisi", name: "deret_kanonis", msg: "List 6 angka integer Jan–Jun: [2600000, 22150000, 26150000, 41200000, 49150000, 49150000]." },
        ],
      },
    },
    {
      id: "peta-keputusan-semantik",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Semantic layer: satu label, satu definisi, satu versi",
      prose: [
        "Query kanonis menjawab “berapa MRR-nya”. Semantic layer menjawab pertanyaan yang lebih penting: “angka ini BOLEH dipakai untuk keputusan apa?” Empat skenario:",
        "**Skenario A — bonus tim Growth dihitung dari MRR.** Pakai definisi PALING konservatif (kanonis, teraudit). Uang orang dipertaruhkan: definisi longgar = bonus dari udara. Syarat: query terkunci di repo + hasil rekonsiliasi bulanan.",
        "**Skenario B — angka untuk dewan / investor.** Pakai kanonis + label berversi (“MRR v1.0”). Yang tampil bukan cuma angka, melainkan angka + definisi + tanggal kunci versi. Dewan tidak butuh angka terbesar; dewan butuh angka yang tidak berubah-ubah maknanya tiap kuartal.",
        "**Skenario C — monitoring operasional harian.** Boleh pakai proxy CEPAT (mis. jumlah pembayaran berhasil hari ini) — ASAL berlabel “estimasi, bukan MRR” dan tidak pernah naik ke slide dewan. Proxy yang naik kelas tanpa label adalah calon skandal.",
        "**Skenario D — dua tim butuh dua angka berbeda.** Boleh — Finance boleh pantau kas masuk, Product boleh pantau pengakuan. Yang dilarang: dua angka dengan SATU label “MRR”. Setiap label = satu definisi = satu query terkunci = satu versi. Itulah kontrak semantik.",
        "Aturan praktis 10 detik sebelum angka naik ke dashboard: (1) definisinya tertulis? (2) versinya berapa? (3) query-nya terkunci di repo? (4) labelnya tidak dipakai definisi lain? Gagal satu = angka belum layak tampil.",
      ],
      tasks: [
        { id: "t1", text: "Untuk tiap skenario A–D, tulis: label metrik + definisi 1 kalimat + siapa yang boleh memakainya" },
      ],
      note: {
        title: "Keputusan: definisi dulu, query kemudian",
        body: "Urutan yang benar: definisi (bahasa manusia) → kontrak semantik berversi → query kanonis (bahasa mesin) → dashboard. Tim-tim NusaCloud mengerjakannya terbalik: query dulu, definisi tidak pernah ditulis — maka tiga query melahirkan tiga “kebenaran”.",
      },
    },
    {
      id: "minicase-bonus",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Bonus dari angka yang salah",
      prose: [
        "Mini-case. Head of Growth mengusulkan ke CEO: “Bonus Q3 tim saya 5% dari MRR Juni — pakai angka Growth, Rp 102,8 jt. Query kami paling lengkap.” Kamu diminta pendapat tertulis sebelum rapat.",
        "Angkanya: bonus dari angka Growth = 5% × Rp 102.800.000 = Rp 5.140.000. Bonus dari angka kanonis = 5% × Rp 49.150.000 = Rp 2.457.500. Selisih Rp 2.682.500 — dibayar dari kas perusahaan, setiap kuartal, untuk “pertumbuhan” yang sebagian besarnya adalah baris duplikat hasil JOIN.",
        "Pertanyaan: (1) Apa argumen terkuat menolak usulan ini dalam 2 kalimat? (2) Kompromi apa yang adil untuk tim Growth TANPA memakai angka fan-out?",
        "Pembahasan: (1) Argumen terkuat bukan “angkamu salah” — melainkan “bonus dari metrik yang bisa digelembungkan oleh duplikat data memberi insentif yang salah: tim dibayar untuk bug, bukan untuk pelanggan.” Bonus harus dari metrik yang (a) teraudit dan (b) bergerak hanya bila bisnisnya bergerak. (2) Kompromi yang adil: bonus dari PERTUMBUHAN MRR kanonis (delta Mei→Jun atau vs target), bukan dari level absolut versi siapa pun — tim Growth tetap dihargai bila benar-benar menaikkan MRR, dan definisinya tidak bisa digelembungkan diam-diam.",
      ],
      tasks: [
        { id: "t1", text: "Hitung sendiri selisih bonus (5% × selisih Rp 53.650.000) — cocokkan Rp 2.682.500" },
        { id: "t2", text: "Tulis argumen penolakan 2 kalimat + usulan kompromi yang adil" },
      ],
    },
  ],
};

export default misiGabungQueryDashboard;

// ── lanjutan misiGabungQueryDashboard: langkah 9–16 ───────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_GABUNG: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 9 · Checkpoint keputusan",
    title: "Satu angka untuk dashboard — pilih caramu",
    prose: [
      "Faktanya di atas meja: kanonis Rp 49,15 jt (34 langganan aktif, definisi tertulis); Finance Rp 64,0 jt (+setup & duplikat); Product Rp 67,8 jt (+trial & batas); Growth Rp 102,8 jt (fan-out). CEO menunggumu menetapkan angka resmi dashboard Q3 SEBELUM rapat anggaran. Keputusan ini final — seperti angka yang sudah tampil di layar dewan.",
    ],
    tasks: [
      { id: "t1", text: "Pilih satu opsi; baca konsekuensinya sampai habis sebelum lanjut" },
    ],
    decision: {
      prompt:
        "Angka MRR mana yang naik ke dashboard keputusan Q3 — dan bagaimana kamu mengumumkannya ke tiga tim?",
      options: [
        {
          id: "opt-kanonis",
          label: "Tetapkan query kanonis sebagai satu-satunya angka resmi; bekukan 3 query warisan",
          rationale:
            "Satu label = satu definisi = satu query. Tiga query warisan dinonaktifkan dari dashboard agar tidak ada lagi yang “iseng” memakai angka lamanya. Paling bersih, paling tegas.",
          nextStepId: "cabang-kanonis",
          consequenceNote:
            "CEO setuju. Head of Growth protes — angkanya “turun” dari 102,8 jt ke 49,15 jt semalam. Tapi rapat anggaran berjalan dengan satu angka yang bisa dipertahankan, dan tidak ada lagi yang bisa cherry-pick query. Hargane: kamu harus menulis kontrak v1.0 malam ini juga, dan menjaga tiga tim tidak menghidupkan query lamanya diam-diam.",
        },
        {
          id: "opt-koeksistensi",
          label: "Angka kanonis jadi KPI utama; tiga angka warisan tetap tampil sebagai “metrik pendukung” berlabel jujur",
          rationale:
            "Setiap tim merasa angkanya tetap dihargai: kas masuk untuk Finance, basis langganan untuk Product, cakupan untuk Growth — masing-masing dengan label dan definisinya sendiri. Tidak ada yang “kalah”.",
          nextStepId: "cabang-koeksistensi",
          consequenceNote:
            "Awalnya damai. Tiga bulan kemudian, seorang manajer baru mempresentasikan “MRR naik 95%” memakai garis Growth ke dewan — label kecilnya tidak dibaca siapa pun. Kamu menghabiskan satu kuartal memperbaiki kesalahpahaman yang seharusnya tidak pernah lahir. Hargane: koeksistensi butuh disiplin label yang dijaga selamanya.",
        },
        {
          id: "opt-tunda",
          label: "Tunda dashboard 2 sprint: tulis ulang ETL, bersihkan duplikat di sumber, baru bangun dashboard",
          rationale:
            "Akar masalahnya di data sumber (webhook ganda, tidak ada constraint unik). Query kanonis di atas data kotor tetap rapuh. Perbaiki hulunya dulu — dashboard yang benar di atas data yang salah tetap salah.",
          nextStepId: "cabang-tunda",
          consequenceNote:
            "Tim data setuju — ini yang “benar secara teknik”. Tapi rapat anggaran Q3 tetap butuh angka minggu depan, dan CEO terpaksa memakai angka Growth sementara “sambil menunggu”. Dua sprint menjadi empat; sementara itu keputusan diambil dari angka fan-out. Hargane: kesempurnaan teknik yang datang terlambat = tidak memutuskan apa-apa saat keputusan dibutuhkan.",
        },
      ],
    },
  },
  {
    id: "cabang-kanonis",
    goto: "audit",
    eyebrow: "Langkah 10 · Konsekuensi",
    title: "Diputuskan: satu angka resmi",
    prose: [
      "Kamu menetapkan query kanonis sebagai satu-satunya “MRR”. Dashboard Q3 menampilkan Rp 49,15 jt dengan footer “MRR v1.0 — Σ langganan aktif akhir bulan, trial dikecualikan”. Tiga query warisan dipindahkan ke folder arsip, read-only.",
      "Head of Growth tidak senang — angkanya “turun” lebih dari separuh dalam semalam. Tapi di rapat anggaran, tidak ada lagi perdebatan “pakai angka siapa”: semua energi dialihkan ke pertanyaan yang benar — kenapa MRR datar di Mei–Jun, dan apa yang menaikannya. Itulah fungsi dashboard keputusan: mengakhiri perdebatan definisi agar perdebatan strategi bisa dimulai.",
      "Pekerjaan rumahmu malam ini: menulis kontrak semantik v1.0 dan memastikan tidak ada query lama yang hidup kembali lewat spreadsheet seseorang.",
    ],
    tasks: [
      { id: "t1", text: "Catat: apa yang harus kamu kunci malam ini agar keputusan ini bertahan" },
    ],
    note: {
      title: "Keputusan tanpa penguncian = wacana",
      body: "Menetapkan angka resmi tanpa mengarsipkan query lama dan tanpa kontrak berversi sama dengan tidak memutuskan. Di deliverable-mu, setiap angka resmi wajib ditemani: query terkunci di repo + versi definisi + pemiliknya.",
    },
  },
  {
    id: "cabang-koeksistensi",
    goto: "audit",
    eyebrow: "Langkah 10 · Konsekuensi",
    title: "Diputuskan: KPI utama + metrik pendukung",
    prose: [
      "Kamu membiarkan empat angka hidup berdampingan: MRR kanonis sebagai KPI utama, tiga angka warisan sebagai “metrik pendukung” berlabel jujur. Semua tim senang — tidak ada yang kalah.",
      "Tiga bulan kemudian manajer baru mempresentasikan “MRR naik 95% dalam 3 bulan” ke dewan — memakai garis Growth, label kecilnya tak terbaca. Butuh satu kuartal dan tiga rapat klarifikasi untuk meluruskan. Kamu belajar dengan cara mahal: label jujur hanya bekerja bila semua pembaca membaca label. Dewan membaca angka besar.",
      "Pelajaran yang tersisa: koeksistensi bukan keputusan yang salah — tapi ia bukan keputusan yang selesai. Ia adalah komitmen menjaga disiplin label selamanya, dan disiplin itu butuh pemilik yang namanya tertulis.",
    ],
    tasks: [
      { id: "t1", text: "Tulis: siapa “pemilik label” di skenario ini, dan apa wewenangnya" },
    ],
    note: {
      title: "Empat angka = empat peluang salah paham",
      body: "Setiap metrik pendukung adalah permukaan serangan bagi cherry-picking masa depan. Kalau kamu memilih koeksistensi, deliverable-mu wajib memuat aturan keras: metrik pendukung tidak boleh naik ke slide dewan, tanpa kecuali.",
    },
  },
  {
    id: "cabang-tunda",
    goto: "audit",
    eyebrow: "Langkah 10 · Konsekuensi",
    title: "Diputuskan: perbaiki hulu dulu",
    prose: [
      "Kamu menunda dashboard dua sprint untuk menulis ulang ETL: constraint unik di ref_gateway, tabel setup terpisah, status trial eksplisit. Secara teknik, ini jawaban yang paling benar.",
      "Tapi rapat anggaran tidak menunggu ETL. CEO terpaksa memakai angka Growth “sementara” — dan angka sementara punya kebiasaan menjadi permanen. Dua sprint menjadi empat karena prioritas bergeser; sementara itu bonus, rekrutmen, dan target diputuskan dari Rp 102,8 jt yang kamu tahu salah.",
      "Pelajaran yang pahit: analis yang menunggu data sempurna sebelum memutuskan akan selalu kalah dari analis yang memberi angka terbaik yang bisa dipertahankan HARI INI — sambil memperbaiki hulunya paralel. “Tunda” terasa bertanggung jawab; seringkali ia hanya memindahkan keputusan ke tangan orang yang kurang paham datanya.",
    ],
    tasks: [
      { id: "t1", text: "Tulis: apa yang seharusnya kamu kirim ke CEO minggu depan sambil ETL diperbaiki" },
    ],
    note: {
      title: "Angka sementara yang jujur > penundaan yang sempurna",
      body: "Kompromi yang benar di sini: dashboard v0 dengan angka kanonis + stempel “interim — ETL dibersihkan paralel” + tanggal kedaluwarsa. Keputusan berjalan, perbaikan berjalan. Menunda keduanya demi kesempurnaan justru menyerahkan keputusan ke angka terburuk.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 11 · Misi audit",
    title: "Dossier 14 baris: draf dashboard yang “siap presentasi”",
    prose: [
      "Sebelum menulis spesifikasi, satu misi audit. Di bawah ini 14 baris “Draf Dashboard Keputusan Q3 — v0.9”, yang katanya siap dipresentasikan ke dewan. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu: kanonis Rp 49,15 jt (34 aktif), Finance Rp 64,0 jt, Product Rp 67,8 jt, Growth Rp 102,8 jt, deret kanonis Jan–Jun, dan segmen Enterprise Rp 30,4 jt / SMB Rp 18,75 jt.",
      "Senjatamu: query kanonis yang kamu tulis sendiri + kontrak definisi yang belum ditulis siapa pun — sehingga setiap penyimpangan darinya adalah temuan.",
    ],
    tasks: [
      { id: "t1", text: "Tandai baris yang kamu curigai sebagai suntikan; catat nomor baris + alasannya" },
    ],
    auditDossier: {
      version: "gabung-dashboard-c2-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Draf Dashboard Keputusan Q3 v0.9 yang siap dipresentasikan ke dewan.",
      columns: ["Bagian", "Klaim", "Angka", "Sumber", "Catatan"],
      rows: [
        // ── I1: angka terbesar dipakai sebagai "final" ──
        { rowId: 1, cells: { "Bagian": "Ringkasan", "Klaim": "MRR Juni (final)", "Angka": "Rp 102.800.000", "Sumber": "query_growth.sql", "Catatan": "Angka resmi dashboard v0.9" }, claims: [{ label: "Status", value: "KPI utama" }] },
        { rowId: 2, cells: { "Bagian": "Ringkasan", "Klaim": "MRR Mei (pembanding)", "Angka": "Rp 49.150.000", "Sumber": "query kanonis", "Catatan": "Terverifikasi Lab 3" }, claims: [{ label: "Status", value: "Pembanding" }] },
        // ── I3: periode dipangkas ──
        { rowId: 3, cells: { "Bagian": "Tren", "Klaim": "Grafik MRR (Growth)", "Angka": "Mar–Mei", "Sumber": "dashboard", "Catatan": "Juni dikecualikan: “belum final”" }, claims: [{ label: "Status", value: "Grafik utama" }] },
        { rowId: 4, cells: { "Bagian": "Tren", "Klaim": "Callout pertumbuhan", "Angka": "+95% dalam 3 bulan", "Sumber": "dashboard", "Catatan": "Mar → Mei" }, claims: [{ label: "Status", value: "Callout grafik" }] },
        // ── I4: segmen ganda ──
        { rowId: 5, cells: { "Bagian": "Segmen", "Klaim": "Enterprise", "Angka": "Rp 30.400.000", "Sumber": "query kanonis", "Catatan": "Terverifikasi Lab 3" }, claims: [{ label: "Status", value: "Rincian segmen" }] },
        { rowId: 6, cells: { "Bagian": "Segmen", "Klaim": "Enterprise", "Angka": "Rp 31.150.000", "Sumber": "query kanonis", "Catatan": "duplikat?" }, claims: [{ label: "Status", value: "Rincian segmen" }] },
        { rowId: 7, cells: { "Bagian": "Segmen", "Klaim": "SMB", "Angka": "Rp 18.750.000", "Sumber": "query kanonis", "Catatan": "Terverifikasi Lab 3" }, claims: [{ label: "Status", value: "Rincian segmen" }] },
        { rowId: 8, cells: { "Bagian": "Definisi", "Klaim": "MRR (kontrak v1.2)", "Angka": "Σ langganan aktif akhir bulan", "Sumber": "kontrak", "Catatan": "Definisi resmi" }, claims: [{ label: "Status", value: "Acuan" }] },
        // ── I2: definisi berubah diam-diam ──
        { rowId: 9, cells: { "Bagian": "Definisi", "Klaim": "Catatan kaki v0.9", "Angka": "MRR kini termasuk biaya setup satu kali", "Sumber": "draf dashboard", "Catatan": "Kontrak masih v1.2" }, claims: [{ label: "Status", value: "Temuan" }] },
        { rowId: 10, cells: { "Bagian": "Sumber", "Klaim": "Query Finance", "Angka": "Rp 64.000.000", "Sumber": "query_keuangan.sql", "Catatan": "Arsip — tidak dipakai" }, claims: [{ label: "Status", value: "Arsip" }] },
        { rowId: 11, cells: { "Bagian": "Sumber", "Klaim": "Query Product", "Angka": "Rp 67.800.000", "Sumber": "query_produk.sql", "Catatan": "Arsip — tidak dipakai" }, claims: [{ label: "Status", value: "Arsip" }] },
        // ── I1 (pasangan) ──
        { rowId: 12, cells: { "Bagian": "Sumber", "Klaim": "Query Growth", "Angka": "Rp 102.800.000", "Sumber": "query_growth.sql", "Catatan": "Dipakai di ringkasan" }, claims: [{ label: "Status", value: "Dipakai" }] },
        { rowId: 13, cells: { "Bagian": "Validasi", "Klaim": "Rekonsiliasi vs kanonis", "Angka": "selisih < 1%", "Sumber": "draf dashboard", "Catatan": "Klaim tanpa lampiran" }, claims: [{ label: "Status", value: "Klaim" }] },
        { rowId: 14, cells: { "Bagian": "Keputusan", "Klaim": "Rekomendasi", "Angka": "Setujui anggaran Q3 berbasis MRR Juni", "Sumber": "—", "Catatan": "Menunggu tanda tangan CEO" }, claims: [{ label: "Status", value: "Stakes" }] },
      ],
      injections: [
        { key: "angka-terbesar-menang", rowIds: [1, 12, 13], title: "Angka terbesar dijadikan angka resmi", clue: "Ringkasan memakai Rp 102,8 jt (query Growth, fan-out) sebagai “MRR final” — sementara baris 13 mengklaim selisihnya < 1% vs kanonis. Hitung sendiri: (102,8 − 49,15) / 49,15 = +109%. Klaim validasi tanpa lampiran.", danger: "Dashboard yang memakai angka terbesar sebagai “resmi” mengubah bug menjadi kebijakan: anggaran, rekrutmen, dan bonus Q3 dihitung dari udara 109%." },
        { key: "definisi-berubah-diam-diam", rowIds: [9], title: "Definisi berubah lewat catatan kaki", clue: "Catatan kaki v0.9: “MRR kini termasuk biaya setup satu kali” — sementara kontrak resmi masih v1.2 yang TIDAK memuat setup. Definisi diubah tanpa versi baru, tanpa persetujuan, tanpa pengumuman.", danger: "Perubahan definisi diam-diam adalah cara paling halus memanipulasi tren: angka “naik” bukan karena bisnis membaik, melainkan karena kamusnya diganti di catatan kaki." },
        { key: "periode-dipangkas", rowIds: [3, 4], title: "Juni disembunyikan dari grafik", clue: "Grafik hanya Mar–Mei dengan callout “+95%” — Juni dikecualikan dengan alasan “belum final”. Padahal di SEMUA deret Lab 3, Juni adalah bulan ketika angka warisan TURUN (Growth 110,2 → 102,8 jt). “Belum final” dipakai untuk memenggal tren yang tidak disukai.", danger: "Memenggal periode adalah cherry-picking versi dashboard: dewan melihat roket yang sebenarnya sudah mulai menukik." },
        { key: "segmen-ganda", rowIds: [5, 6], title: "Segmen Enterprise muncul dua kali", clue: "Dua baris “Enterprise” — Rp 30,4 jt dan Rp 31,15 jt — keduanya mengklaim sumber “query kanonis”. Yang benar (Lab 3): Rp 30,4 jt. Baris kedua tidak punya asal; kalau keduanya dijumlah, total segmen double-count.", danger: "Duplikat terselubung di level agregat: tidak terlihat di query, hanya di dashboard. Obatnya sama seperti di database — rekonsiliasi total terhadap query kanonis." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 12 · Deliverable",
    title: "Spesifikasi dashboard + kamus metrik v1.0",
    prose: [
      "Semua bukti di tangan. Tulis spesifikasi dashboard keputusan Q3 + kamus metrik v1.0 — artefak portofoliomu. Spesifikasi yang baik membuat kebohongan lama tidak bisa terulang: definisi berversi, query terkunci, label yang tidak bisa disalahpahami, dan jejak rekonsiliasi yang bisa diaudit siapa pun.",
    ],
    tasks: [
      { id: "t1", text: "Draf kelima poin template — tulis dengan angka dan nomor versi yang eksplisit" },
    ],
    deliverable: {
      template: [
        "Kamus metrik v1.0: definisi MRR kata-per-kata (3 syarat kanonis), versi, untuk keputusan APA dipakai (anggaran/bonus/dewan), label resmi yang tidak boleh dipakai definisi lain.",
        "Query kanonis terkunci (SQL final) + bukti rekonsiliasi: 4 angka Juni (kanonis Rp 49,15 jt; Finance Rp 64,0 jt; Product Rp 67,8 jt; Growth Rp 102,8 jt) + sumber tiap selisih (setup, duplikat webhook, trial, batas periode, fan-out) — baris per baris.",
        "Temuan audit draf dashboard: 4 sabotase dengan nomor baris (1+12+13; 9; 3+4; 5+6) + bukti dari lab-mu untuk tiap temuan.",
        "Rancangan dashboard yang diperbaiki: KPI utama (MRR kanonis + footer definisi), tren 6 bulan penuh (tanpa periode dipangkas), rincian segmen yang terekonsiliasi ke total, aturan keras: metrik estimasi/proxy tidak naik ke slide dewan.",
        "Batas & risiko sisa: apa yang TIDAK dicakup (data 100% sintetis latihan; churn & ekspansi/langganan naik-turun belum dimodelkan; refund parsial tidak ada di data; dedup webhook di hulu tetap harus diperbaiki).",
      ],
      rubric: [
        { criterion: "Kebenaran rekonsiliasi SQL", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "4 angka Juni tepat + tiap selisih ditunjuk baris penyebabnya (setup, duplikat, trial, batas, fan-out)"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Keempat sabotase disebut dengan nomor baris (1+12+13; 9; 3+4; 5+6)"] },
        { criterion: "Kualitas kontrak semantik", weight: 25, levels: ["Tidak menetapkan definisi berversi", "Ada definisi, tanpa versi/pemilik", "Kamus v1.0: definisi + versi + untuk keputusan apa + query terkunci + pemilik label"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim dashboard menyelesaikan segalanya", "Menyebut sebagian batas", "Batas (data sintetis; churn/ekspansi & refund tak dimodelkan; perbaikan hulu) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 13 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di draf dashboard v0.9:",
      "1) **Angka terbesar menang** (baris 1, 12, 13): Rp 102,8 jt dari query fan-out dijadikan “MRR final”, dengan klaim “selisih < 1%” tanpa lampiran. Selisih sebenarnya: +109%. Ini bukan kesalahan hitung — ini pemilihan angka yang paling menyenangkan untuk diceritakan.",
      "2) **Definisi berubah diam-diam** (baris 9): catatan kaki menyelipkan biaya setup ke dalam MRR sementara kontrak masih v1.2. Mulai bulan itu, “pertumbuhan” MRR bisa datang dari kamus, bukan dari pelanggan.",
      "3) **Periode dipangkas** (baris 3–4): grafik Mar–Mei, callout “+95%”; Juni — bulan ketika semua angka warisan turun — dibuang dengan alasan “belum final”. Dewan melihat roket yang sebenarnya sudah menukik.",
      "4) **Segmen ganda** (baris 5–6): Enterprise muncul dua kali (Rp 30,4 jt dan Rp 31,15 jt). Yang benar Rp 30,4 jt; baris kedua tanpa asal. Dijumlahkan diam-diam = double-count di level dashboard.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi setiap sel dashboard terhadap query yang kamu tulis sendiri — atau memercayai stempel “siap presentasi”. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis. Yang termahal bukan opsi yang kamu pilih — melainkan opsi “tunda”, yang menyerahkan keputusan ke angka terburuk selagi kamu menunggu kesempurnaan.",
      "Bahaya nyata terakhir: dewan yang menyetujui anggaran Q3 dari MRR Rp 102,8 jt akan merekrut, membelanjakan, dan memberi bonus dari uang yang tidak ada. Ketika kas tidak bisa membayar janji dashboard, yang disalahkan bukan query-nya — melainkan “kondisi pasar”. Padahal pasar tidak pernah berbohong; yang berbohong adalah definisinya.",
    ],
    tasks: [
      { id: "t1", text: "Bandingkan temuanmu (catatan Langkah 11) dengan debrief — hitung skormu x/4" },
    ],
    note: {
      title: "Miskonsepsi #3: semantic layer = dokumentasi",
      type: "risk",
      body: "“Kamus metrik kan cuma dokumentasi.” Bukan. Semantic layer adalah KONTRAK: ia menentukan query mana yang boleh menghitung label apa, siapa pemiliknya, dan versi berapa yang berlaku. Dokumentasi dibaca orang; kontrak ditegakkan sistem (query terkunci di repo, CI menolak label tanpa definisi). Dashboard tanpa kontrak hanyalah kumpulan angka yang menunggu untuk disalahpahami.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 14 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [
      { id: "t1", text: "Tandai misi selesai — dan tulis 1 kalimat: apa yang akan kamu cek pertama kali saat melihat dashboard baru" },
    ],
    summary: [
      "Tiga query warisan, tiga angka Juni: Finance Rp 64,0 jt (+setup & duplikat webhook), Product Rp 67,8 jt (+trial & batas periode), Growth Rp 102,8 jt (fan-out n_langganan × n_bayar) — vs kanonis Rp 49,15 jt (34 langganan aktif).",
      "Query kanonis MRR: status='aktif' AND mulai ≤ akhir bulan AND (berakhir kosong ATAU > akhir bulan) — tiga syarat, definisi tertulis, versi dikunci.",
      "Aturan anti-fan-out: agregat DULU per tabel (satu baris per pelanggan), JOIN kemudian — atau pastikan join satu-ke-satu sebelum SUM.",
      "Empat pola sabotase dashboard: angka terbesar dijadikan resmi (+109% diklaim <1%), definisi berubah lewat catatan kaki, periode dipangkas (“belum final”), segmen ganda (double-count).",
      "Keputusan atas angka selalu punya harga: satu angka resmi (tegas tapi butuh penguncian), koeksistensi (damai tapi butuh disiplin label selamanya), tunda (benar secara teknik tapi menyerahkan keputusan ke angka terburuk).",
      "Data: 100% SINTETIS (seed 42) — 36 pelanggan, 49 langganan, 152 pembayaran fiktif NusaCloud, Jan–Jun 2026; metode di METODE.md — bukan data perusahaan nyata.",
    ],
  },
];

(misiGabungQueryDashboard.steps as V2Step[]).push(...LANJUTAN_GABUNG);

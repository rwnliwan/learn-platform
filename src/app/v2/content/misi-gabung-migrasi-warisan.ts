import type { V2Mission } from "../lib/types";

// ── MISI CAPSTONE #5: Database Administrator × Data Management ────────────
// Migrasi + audit kualitas & performa basis data warisan 10 tahun.
// Dataset 100% SINTETIS (generator /tmp/cap5_gen_dataset.py, seed 42).
// Snapshot: public/misi/misi-gabung-migrasi-warisan/ (740K) + METODE.md.

export const misiGabungMigrasiWarisan: V2Mission = {
  slug: "misi-gabung-migrasi-warisan",
  track: "Database Administrator",
  module: "Misi",
  title: "Misi Migrasi Warisan: Audit Dulu Sebelum Pindah",
  estMinutes: 180,
  role: "Database Administrator",
  client:
    "CTO Toko Warisan — database 10 tahun harus dimigrasi tanpa sedetik pun downtime; audit kualitas data & performa query adalah gerbang wajib sebelum strategi migrasi dipilih",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Sepuluh tahun warisan, nol detik boleh mati",
      prose: [],
      tasks: [
        { id: "t1", text: "Baca cerita briefing sampai selesai" },
        { id: "t2", text: "Catat 5 objectives di catatanmu — itu kontrak kerja misi ini" },
        { id: "t3", text: "Buka `METODE.md` di folder snapshot dan baca pernyataan kejujurannya" },
      ],
      briefing: {
        role: "Database Administrator di Toko Warisan — pemilik penuh audit pra-migrasi",
        client:
          "CTO Toko Warisan. Database “Si Warisan” — jantung toko daring sejak 2016 — harus dimigrasi tahun ini karena versi database-nya sudah end-of-life. Syarat CTO: tidak boleh mati sedetik pun (toko buka 24/7). Vendor konsultan yang disewa mengirim “Laporan Kesiapan Migrasi” 40 halaman dengan kesimpulan satu baris: data sudah bersih, query sudah cepat, tinggal pindah. CTO tidak percaya: “Laporan yang tidak menemukan satu pun masalah di database 10 tahun itu bukan laporan — itu brosur.” Kamu diminta audit independen: profil kualitas data, audit performa query, dan tata kelola tabel warisan — SEBELUM strategi migrasi dipilih.",
        story: [
          "Jumat, 16:40. CTO memanggilmu ke ruang server — bukan ruang rapat. Di depannya monitor menampilkan dashboard yang sudah ia hafal 10 tahun: “Si Warisan”, database yang menopang Toko Warisan sejak 2016. Tiga generasi DBA sudah mencoba menatanya; ketiganya menyerah dan memilih doktrin “jangan sentuh yang masih jalan”.",
          "Masalahnya: Si Warisan harus dimigrasi tahun ini — versi database-nya end-of-life, patch keamanan berhenti. Vendor konsultan yang disewa untuk migrasi mengirim “Laporan Kesiapan Migrasi” setebal 40 halaman dengan kesimpulan satu baris: data sudah bersih, query sudah cepat, tinggal pindah. CTO melempar laporan itu ke meja: laporan yang tidak menemukan satu pun masalah di database berusia 10 tahun itu bukan laporan — itu brosur.",
          "Tugasmu: audit independen sebelum satu baris pun dimigrasi. Dua lensa sekaligus. Lensa operasi database: profil kualitas data dan audit performa query — indeks apa yang hantu, query apa yang full scan, statistik apa yang basi. Lensa tata kelola: siapa pemilik tabel-tabel warisan ini, dan aturan validasi apa yang harus hidup sebelum pindah. Strategi migrasi baru boleh dipilih setelah audit selesai — karena strategi yang dipilih tanpa tahu kondisi data adalah judi, bukan engineering.",
        ],
        objectives: [
          "Menyusun profil kualitas data 4 tabel warisan (kelengkapan, duplikat, nilai tak valid per kolom kunci) dengan SQL — angka per kolom, bukan firasat.",
          "Mengaudit log query lambat dan katalog indeks: menemukan full scan, indeks hantu, dan statistik basi yang akan memperpanjang jendela migrasi.",
          "Memetakan kepemilikan tabel warisan dan merumuskan aturan validasi kontrak yang wajib hidup di database baru.",
          "Memilih strategi migrasi (big-bang, bertahap, replikasi) dengan justifikasi berbasis temuan audit — bukan preferensi.",
          "Menemukan minimal 3 suntikan impostor di “Laporan Kesiapan Migrasi” vendor dan menulis rencana migrasi ber-rubrik.",
        ],
        prereqSummary:
          "Indeks database mempercepat baca tapi memperlambat tulis — indeks yang tidak pernah dipakai (“indeks hantu”) murni beban. Query plan adalah cara database mengeksekusi query: full scan (membaca seluruh tabel) vs index scan (melompat via indeks). Kualitas data diukur dari kelengkapan (completeness), keunikan (uniqueness), dan keabsahan nilai (validity). Migrasi minim downtime memindahkan data selagi sistem lama tetap melayani — spektrumnya dari big-bang (sekali potong) sampai replikasi kontinu.",
        datasetNote:
          "100% SINTETIS — dibangkitkan generator /tmp/cap5_gen_dataset.py (seed 42), meniru pola database ritel warisan 10 tahun: skema pelanggan/produk/orders/pembayaran, log 30 query, katalog 10 indeks, statistik planner, profil kualitas, dan register kepemilikan.\nBUKAN data produksi nyata; angka ms dan hitungan pemakaian dipilih untuk mengilustrasikan pola (NULL, duplikat, baris yatim, full scan, indeks hantu, statistik basi), bukan pengukuran nyata.\nFolder: public/misi/misi-gabung-migrasi-warisan/ — baca METODE.md dulu.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Kenali rumah tua sebelum direnovasi",
      prose: [
        "Empat tabel inti: `pelanggan` (2000 baris), `produk` (300), `orders` (8012), `pembayaran` (7500). `skema.sql` adalah hasil reverse-engineering — baca komentarnya baik-baik: tidak ada satu pun foreign key aktif, tidak ada CHECK constraint. Sepuluh tahun aplikasi “percaya” pada data yang tidak pernah dijaga oleh database-nya sendiri.",
        "`profil_kualitas.csv` adalah titik awal auditmu: 8 baris agregat (null_pct, duplikat, nilai_tak_valid per kolom) plus kolom terakhir yang paling penting — `aturan_yang_seharusnya_ada`. Setiap baris di file itu adalah janji yang dilanggar.",
        "`query_audit.csv` (30 query), `indeks.csv` (10 indeks), `statistik_tabel.csv` (4 tabel): tiga file untuk lensa performa. Dan `kepemilikan.csv`: 6 tabel warisan, dua di antaranya — `retur` dan `voucher_lama` — pemiliknya “TIDAK DIKETAHUI”. Seseorang harus memutuskan nasib mereka sebelum migrasi; tidak ada yang bisa.",
        "Aturan main: (1) audit dibangun dari data mentah, bukan dari klaim vendor; (2) setiap temuan butuh angka + lokasi (tabel, kolom, query_id); (3) “tidak ada masalah” bukan temuan — itu kegagalan mencari.",
      ],
      tasks: [
        { id: "t1", text: "Buka `skema.sql`: catat 4 tabel inti + constraint apa saja yang hilang" },
        { id: "t2", text: "Buka `profil_kualitas.csv`: kolom mana saja yang `nilai_tak_valid` > 0" },
        { id: "t3", text: "Buka `query_audit.csv`: catat query_id yang Seq Scan penuh" },
        { id: "t4", text: "Buka `kepemilikan.csv`: tabel mana yang tanpa pemilik" },
      ],
      note: {
        title: "Miskonsepsi #1: “data sudah jalan 10 tahun, pasti beres”",
        type: "pitfall",
        body: "SALAH — dan justru sebaliknya. Data yang lama menumpuk pengecualian: 3x migrasi parsial, 2x merge CRM, 1x bug jam server. Umur data berkorelasi dengan jumlah “tapi”-nya, bukan dengan kebersihannya. Database 10 tahun yang “tidak pernah bermasalah” biasanya berarti: masalahnya belum ada yang mengukur.",
      },
      reference:
        "skema.sql + 6 CSV di /misi/misi-gabung-migrasi-warisan/. Audit dari yang mentah; vonis untuk klaim vendor.",
    },
    {
      id: "lab-kualitas",
      eyebrow: "Langkah 3 · Lab 1 — Audit kualitas data (SQL)",
      title: "Temukan mayatnya sebelum pindah rumah",
      prose: [
        "Empat aturan validasi yang seharusnya hidup — dan tidak satu pun hidup di Si Warisan: total tidak boleh negatif, tanggal tidak boleh di masa depan, setiap order harus punya pelanggan yang benar-benar ada, status harus dari daftar tertutup. Satu query audit bisa memeriksa keempatnya sekaligus dengan UNION ALL: tiap SELECT mengembalikan baris pelanggar beserta label masalahnya.",
        "“Hari ini” untuk lab ini adalah 2026-10-15 (tanggal misi dibekukan) — tanggal di atas itu adalah masa depan. Perhatikan order 107: satu baris bisa melanggar DUA aturan sekaligus, dan UNION ALL (bukan UNION) memastikan keduanya tercatat — karena audit yang menggabungkan dua masalah menjadi satu sedang berbohong tentang jumlah masalah.",
      ],
      tasks: [
        { id: "t1", text: "Pahami skema mini: `pelanggan_mini` + `orders_mini` (8 order)" },
        { id: "t2", text: "Tulis query UNION ALL untuk 4 aturan, urutkan berdasarkan `order_id`, `masalah`" },
      ],
      expected:
        "6 baris: 102 total_negatif; 103 tanggal_masa_depan; 104 pelanggan_yatim; 105 status_liar; 107 DUA baris (tanggal_masa_depan, total_negatif).",
      formula: String.raw`skor\_kelengkapan = 1 - \frac{baris\_null}{total\_baris}`,
      formulaNote:
        "skor_kelengkapan = fraksi baris yang terisi (1,0 = sempurna); baris_null = baris bernilai kosong di kolom itu; total_baris = semua baris tabel. Contoh: email pelanggan 60 NULL dari 2000 → skor 1 − 60/2000 = 0,97. Satu angka tidak cukup — audit butuh skor PER KOLOM, bukan per database.",
      sqlLab: {
        task: "Audit 4 aturan validasi pada orders_mini: total negatif, tanggal masa depan (> 2026-10-15), pelanggan yatim (tidak ada di pelanggan_mini), status di luar daftar (baru, diproses, selesai, batal). Kembalikan order_id + label masalah, urut order_id lalu masalah.",
        schema: "CREATE TABLE pelanggan_mini (id INTEGER PRIMARY KEY, nama TEXT, email TEXT);\nCREATE TABLE orders_mini (id INTEGER PRIMARY KEY, pelanggan_id INTEGER, tanggal TEXT, total INTEGER, status TEXT);",
        seedData: [
          "CREATE TABLE pelanggan_mini (id INTEGER PRIMARY KEY, nama TEXT, email TEXT);",
          "CREATE TABLE orders_mini (id INTEGER PRIMARY KEY, pelanggan_id INTEGER, tanggal TEXT, total INTEGER, status TEXT);",
          "INSERT INTO pelanggan_mini VALUES",
          "(1,'Ayu','ayu@toko.id'),",
          "(2,'Budi','budi@toko.id'),",
          "(3,'Citra','citra@toko.id'),",
          "(4,'Dedi','dedi@toko.id'),",
          "(5,'Eka','eka@toko.id'),",
          "(6,'Fajar','fajar@toko.id');",
          "INSERT INTO orders_mini VALUES",
          "(101,1,'2026-09-01',250000,'selesai'),",
          "(102,2,'2026-09-02',-150000,'selesai'),",
          "(103,3,'2027-02-10',320000,'diproses'),",
          "(104,99,'2026-09-04',180000,'baru'),",
          "(105,4,'2026-09-05',410000,'DIBATALKAN'),",
          "(106,5,'2026-09-06',275000,'selesai'),",
          "(107,6,'2027-01-20',-99000,'baru'),",
          "(108,1,'2026-09-08',150000,'batal');",
        ].join("\n"),
        starter: "-- Tulis query audit-mu di sini\nSELECT id AS order_id, '...' AS masalah FROM orders_mini WHERE ...\n",
        solution: [
          "SELECT id AS order_id, 'total_negatif' AS masalah FROM orders_mini WHERE total < 0",
          "UNION ALL",
          "SELECT id, 'tanggal_masa_depan' FROM orders_mini WHERE tanggal > '2026-10-15'",
          "UNION ALL",
          "SELECT o.id, 'pelanggan_yatim' FROM orders_mini o WHERE NOT EXISTS (SELECT 1 FROM pelanggan_mini p WHERE p.id = o.pelanggan_id)",
          "UNION ALL",
          "SELECT id, 'status_liar' FROM orders_mini WHERE status NOT IN ('baru','diproses','selesai','batal')",
          "ORDER BY order_id, masalah;",
        ].join("\n"),
        expectedColumns: ["order_id", "masalah"],
        expectedRows: [
          [102, "total_negatif"],
          [103, "tanggal_masa_depan"],
          [104, "pelanggan_yatim"],
          [105, "status_liar"],
          [107, "tanggal_masa_depan"],
          [107, "total_negatif"],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiGabungMigrasiWarisan;

// ── lanjutan: langkah 4–9 ────────────────────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_MIGRASI: V2Step[] = [
  {
    id: "lab-performa",
    eyebrow: "Langkah 4 · Lab 2 — Audit performa query (SQL)",
    title: "Query mana yang akan membunuh jendela migrasimu?",
    prose: [
      "Dua pemboros yang harus kamu buru. Pertama: full scan — operasi Seq Scan di mana baris_dipindai = baris_total. Query seperti ini membaca seluruh tabel untuk menjawab; di database 10 tahun, “seluruh tabel” berarti menunggu. Q2 dan Q4 berjalan di atas tabel terbesar — merekalah yang akan memperpanjang jendela cutover bila ikut dimigrasi apa adanya.",
      "Kedua: indeks hantu — dipakai_30_hari = 0. Indeks tidak gratis: setiap tulis membayar pajak ke semua indeks, dan setiap indeks ikut didump saat migrasi. idx_orders_status (46 MB, 0x dipakai) dan idx_produk_nama murni beban. Waspada jebakan: Q7 memakai Index Scan tapi tetap memindai 8012 baris — ia lolos saringan “full scan”-mu, tapi tetap PR optimasi (indeks yang tidak selektif).",
      "Satu query, dua buruan, UNION ALL — pola yang sama seperti Lab 1. Kolom detail menjelaskan temuanmu dalam bahasa manusia, karena hasil audit dibaca CTO, bukan cuma mesin.",
    ],
    tasks: [
      { id: "t1", text: "Pahami skema mini: `query_log_mini` (8 query) + `indeks_mini` (6 indeks)" },
      { id: "t2", text: "Tulis query UNION ALL: full scan + indeks hantu, urutkan berdasarkan `jenis`, `nama`" },
    ],
    expected:
      "6 baris: full_scan Q2, Q4, Q8; indeks_hantu idx_orders_status, idx_pelanggan_telp_lower, idx_produk_nama. Q6 dan Q7 sengaja lolos saringan — pahami kenapa.",
    formula: String.raw`rasio\_pindai = \frac{baris\_dipindai}{baris\_total}`,
    formulaNote:
      "rasio_pindai = 1,0 berarti query membaca 100% tabel (full scan); mendekati 0 berarti selektif. Q2: 8012/8012 = 1,0 → full scan. Q6: 420/8012 = 0,05 → Seq Scan tapi BUKAN full scan (bukan target buruan ini).",
    note: {
      title: "Miskonsepsi #2: “tambah indeks biar cepat”",
      type: "pitfall",
      body: "SALAH bila indeksnya tidak dipakai. Indeks hantu memperlambat setiap INSERT/UPDATE (pajak tulis), membengkakkan backup dan dump migrasi, dan tidak mempercepat satu pun query. Aturan praktis: indeks tanpa pemakaian 30 hari = kandidat hapus, bukan aset. “Tambah indeks” tanpa mengukur pemakaian adalah cara mahal untuk tidak menyelesaikan masalah.",
    },
    sqlLab: {
      task: "Buru dua pemboros: (1) full scan — operasi 'Seq Scan' DAN baris_dipindai = baris_total; (2) indeks hantu — dipakai_30_hari = 0. Kembalikan jenis + nama + detail, urut jenis lalu nama.",
      schema: "CREATE TABLE query_log_mini (query_id TEXT, teks TEXT, tabel TEXT, operasi TEXT, baris_dipindai INTEGER, baris_total INTEGER, ms INTEGER);\nCREATE TABLE indeks_mini (nama TEXT, tabel TEXT, kolom TEXT, dipakai_30_hari INTEGER, ukuran_kb INTEGER);",
      seedData: [
        "CREATE TABLE query_log_mini (query_id TEXT, teks TEXT, tabel TEXT, operasi TEXT, baris_dipindai INTEGER, baris_total INTEGER, ms INTEGER);",
        "CREATE TABLE indeks_mini (nama TEXT, tabel TEXT, kolom TEXT, dipakai_30_hari INTEGER, ukuran_kb INTEGER);",
        "INSERT INTO query_log_mini VALUES",
        "('Q1','cari order by id','orders','Index Scan',1,8012,12),",
        "('Q2','laporan status selesai','orders','Seq Scan',8012,8012,2340),",
        "('Q3','cari pelanggan by id','pelanggan','Index Scan',1,2000,8),",
        "('Q4','rekap pembayaran bulanan','pembayaran','Seq Scan',7500,7500,1620),",
        "('Q5','cari produk by id','produk','Index Scan',1,300,5),",
        "('Q6','order 7 hari terakhir','orders','Seq Scan',420,8012,310),",
        "('Q7','hitung semua order','orders','Index Scan',8012,8012,940),",
        "('Q8','daftar semua produk','produk','Seq Scan',300,300,95);",
        "INSERT INTO indeks_mini VALUES",
        "('idx_orders_pelanggan','orders','pelanggan_id',1200,20480),",
        "('idx_orders_status','orders','status',0,46080),",
        "('idx_pelanggan_telp_lower','pelanggan','LOWER(telepon)',0,15360),",
        "('idx_produk_nama','produk','nama',0,5120),",
        "('idx_bayar_order','pembayaran','order_id',800,12288),",
        "('idx_orders_tgl_status','orders','(tanggal, status)',450,30720);",
      ].join("\n"),
      starter: "-- Tulis query audit performa-mu di sini\nSELECT 'full_scan' AS jenis, query_id AS nama, ...\n",
      solution: [
        "SELECT 'full_scan' AS jenis, query_id AS nama,",
        "       'pindai ' || baris_dipindai || ' dari ' || baris_total || ' baris · ' || ms || ' ms' AS detail",
        "FROM query_log_mini WHERE operasi = 'Seq Scan' AND baris_dipindai = baris_total",
        "UNION ALL",
        "SELECT 'indeks_hantu', nama,",
        "       'kolom ' || kolom || ' · dipakai ' || dipakai_30_hari || 'x/30 hari · ' || ukuran_kb || ' KB'",
        "FROM indeks_mini WHERE dipakai_30_hari = 0",
        "ORDER BY jenis, nama;",
      ].join("\n"),
      expectedColumns: ["jenis", "nama", "detail"],
      expectedRows: [
        ["full_scan", "Q2", "pindai 8012 dari 8012 baris · 2340 ms"],
        ["full_scan", "Q4", "pindai 7500 dari 7500 baris · 1620 ms"],
        ["full_scan", "Q8", "pindai 300 dari 300 baris · 95 ms"],
        ["indeks_hantu", "idx_orders_status", "kolom status · dipakai 0x/30 hari · 46080 KB"],
        ["indeks_hantu", "idx_pelanggan_telp_lower", "kolom LOWER(telepon) · dipakai 0x/30 hari · 15360 KB"],
        ["indeks_hantu", "idx_produk_nama", "kolom nama · dipakai 0x/30 hari · 5120 KB"],
      ],
      orderMatters: true,
    },
  },
  {
    id: "kepemilikan",
    eyebrow: "Langkah 5 · Lensa tata kelola",
    title: "Tabel yatim, pemilik hilang",
    prose: [
      "Lensa kedua: tata kelola data. `kepemilikan.csv` mencatat 6 tabel warisan — dan dua di antaranya, `retur` (warisan 2018) dan `voucher_lama` (warisan 2019), pemilik bisnisnya “TIDAK DIKETAHUI”, steward teknisnya “TIDAK DIKETAHUI”. Tidak ada manusia yang bisa menjawab: tabel ini masih dipakai aplikasi apa? Boleh dihapus? Aturan validasinya apa?",
      "Ini bukan masalah arsip — ini masalah migrasi. Setiap tabel tanpa pemilik adalah keputusan yang tidak bisa dibuat: ikut dimigrasi (membawa sampah 8 tahun ke sistem baru) atau ditinggal (risiko ada aplikasi yang masih membaca diam-diam). DBA yang memigrasikan tabel yatim tanpa keputusan pemilik sedang memindahkan masalah, bukan menyelesaikannya.",
      "Keluaran lensa ini ada dua: (1) daftar tabel yatim + rekomendasi nasibnya (arsip baca-saja vs migrasi penuh), dan (2) aturan validasi sebagai KONTRAK — NOT NULL, UNIQUE, CHECK, FOREIGN KEY — yang wajib hidup di database baru SEBELUM data masuk. Constraint yang dipasang setelah migrasi hanya menghukum; yang dipasang sebelum migrasi mencegah.",
    ],
    tasks: [
      { id: "t1", text: "Dari `kepemilikan.csv`: sebutkan 2 tabel tanpa pemilik + tahun warisannya" },
      { id: "t2", text: "Rumuskan 3 aturan validasi kontrak (mis. email NOT NULL + UNIQUE; total CHECK >= 0; orders.pelanggan_id FK ke pelanggan.id)" },
      { id: "t3", text: "Tulis rekomendasi nasib tabel `retur`: arsip baca-saja atau migrasi penuh — dengan alasan dan siapa yang harus menyetujui" },
    ],
    note: {
      title: "Miskonsepsi #3: “tata kelola = dokumen, bukan kerjaan DBA”",
      type: "risk",
      body: "Berbahaya. Keputusan “tabel ini ikut / tidak ikut migrasi” adalah keputusan migrasi paling mahal: salah buang = aplikasi mati diam-diam; salah bawa = sistem baru mewarisi sampah 8 tahun. DBA yang tidak menagih keputusan kepemilikan akan disalahkan atas keduanya — padahal itu bukan keputusan teknis.",
    },
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 6 · Checkpoint keputusan",
    title: "Strategi apa yang kamu bawa ke CTO?",
    prose: [
      "Audit selesai. Temuanmu: ratusan nilai tak valid di 7 kolom, full scan di tabel terbesar, 3 indeks hantu, statistik basi (tercatat 50.000 vs aktual 8.012), 2 tabel yatim tanpa pemilik. CTO bertanya satu hal: “Jadi strateginya apa?” Tiga opsi — tiap opsi mengubah apa yang terjadi berikutnya, dan tidak ada yang gratis.",
    ],
    tasks: [
      { id: "t1", text: "Baca ketiga opsi beserta rationale-nya" },
      { id: "t2", text: "Pilih SATU opsi dan catat kenapa dua lainnya kamu tolak — keputusan final seperti memo yang sudah dikirim" },
    ],
    decision: {
      prompt:
        "Strategi migrasi apa yang kamu rekomendasikan ke CTO untuk Si Warisan? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-bigbang",
          label: "Big-bang: potong sekali, Sabtu 02:00–06:00",
          rationale:
            "Dump 4 tabel + restore + verifikasi dalam satu jendela 4 jam. Paling sederhana, paling cepat selesai — dan paling tidak memaafkan: bila ada yang salah, tidak ada jalan kembali parsial.",
          nextStepId: "konsekuensi-bigbang",
          consequenceNote:
            "Jendela 4 jam jebol di menit ke-192: constraint baru menolak 316 baris (total negatif, tanggal 2027, status liar) — persis temuan Lab 1 yang belum dibersihkan. Rollback 40 menit. Toko mati total 62 menit di Sabtu pagi.",
        },
        {
          id: "opt-bertahap",
          label: "Bertahap per tabel: pelanggan → produk → orders → pembayaran",
          rationale:
            "Migrasi satu tabel per minggu dengan dual-read. Setiap tabel dibersihkan dulu (aturan validasi jadi gerbang), rollback per tabel. Lambat (4–6 minggu) tapi tiap langkah bisa dibatalkan.",
          nextStepId: "konsekuensi-bertahap",
          consequenceNote:
            "Minggu 1 (pelanggan): 40 email duplikat memaksa keputusan merge — pemiliknya Tim CRM, untung jelas. Minggu 3 (orders): 97 baris yatim ditahan di karantina, tidak ikut migrasi. Total 5 minggu, nol downtime, nol baris hilang.",
        },
        {
          id: "opt-replikasi",
          label: "Replikasi kontinu (CDC): sistem lama tetap hidup, baca dialihkan bertahap",
          rationale:
            "Change-data-capture mereplikasi ke database baru secara kontinu; aplikasi dialihkan baca per modul. Downtime nyaris nol — tapi replikasi butuh disiplin: lag, konflik tulis, dan data kotor ikut terreplikasi bila tidak difilter.",
          nextStepId: "konsekuensi-replikasi",
          consequenceNote:
            "Replikasi jalan 2 minggu mulus — lalu lag membengkak: 3 indeks hantu ikut direplikasi strukturnya dan membebani applier. Setelah indeks hantu dibuang (temuan Lab 2), lag normal. Cutover akhir 90 detik. Tapi 316 baris kotor ikut masuk — filter validasi tidak dipasang di jalur replikasi.",
        },
      ],
    },
  },
  {
    id: "konsekuensi-bigbang",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: big-bang",
    prose: [
      "Sabtu 02:00. Dump berjalan mulus — selesai 40 menit. Restore ke database baru: menit ke-192, constraint CHECK total >= 0 menolak batch orders. Lalu tanggal 2027. Lalu status liar. 316 baris — persis temuan Lab 1 yang “nanti dibersihkan setelah pindah”.",
      "Rollback 40 menit. Toko mati total 62 menit di Sabtu pagi — jam belanja. Seninnya CTO menunjukkan satu slide: temuan auditmu sendiri, bertanggal tiga minggu lalu. Pelajaran yang mahal: big-bang tidak memaafkan data kotor. Ia mengubah “nanti dibersihkan” menjadi “sekarang darurat”.",
    ],
    tasks: [
      { id: "t1", text: "Catat: berapa baris ditolak constraint dan dari temuan lab mana asalnya" },
      { id: "t2", text: "Tulis satu kalimat gerbang pra-migrasi yang akan mencegah insiden ini" },
    ],
    note: {
      title: "Keputusan tanpa gerbang = judi",
      body: "Big-bang BISA bekerja — bila gerbang pra-migrasi (“nol baris tak valid”) dipenuhi dulu. Tanpa gerbang, big-bang adalah cara tercepat mengubah masalah data menjadi insiden produksi. Di deliverable-mu, tulis gerbangnya eksplisit: angka, bukan niat.",
    },
  },
  {
    id: "konsekuensi-bertahap",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: bertahap per tabel",
    prose: [
      "Minggu 1 — pelanggan: 40 email duplikat warisan CRM-merge 2019 muncul di gerbang validasi. Keputusannya bukan teknis: email mana yang dipertahankan? Untung pemiliknya jelas (Tim CRM) — diputuskan dalam 2 hari.",
      "Minggu 3 — orders: 97 baris yatim + 76 tanggal masa depan + 108 total negatif ditahan di tabel karantina. Tidak ikut migrasi, tidak hilang — menunggu keputusan bisnis. Lima minggu kemudian: nol downtime, nol baris hilang, dan database baru lahir dengan constraint aktif sejak hari pertama.",
    ],
    tasks: [
      { id: "t1", text: "Catat: keputusan non-teknis apa yang muncul di minggu 1 dan siapa pemiliknya" },
      { id: "t2", text: "Tulis fungsi tabel karantina dalam satu kalimat" },
    ],
    note: {
      title: "Lambat yang terkendali mengalahkan cepat yang berharap",
      body: "Harga bertahap: 5 minggu dual-run dan satu tabel karantina yang nasibnya harus diputuskan. Tapi setiap minggu adalah keputusan kecil yang bisa dibatalkan — kebalikan dari big-bang yang satu keputusannya tidak bisa dibatalkan.",
    },
  },
  {
    id: "konsekuensi-replikasi",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: replikasi kontinu",
    prose: [
      "Dua minggu replikasi mulus. Lalu lag applier membengkak dari detik ke menit: struktur 3 indeks hantu ikut direplikasi, dan setiap batch tulis membayar pajak ke indeks yang tidak dipakai siapa pun — temuan Lab 2 yang belum dieksekusi. Setelah indeks hantu dibuang, lag kembali ke hitungan detik.",
      "Cutover akhir: 90 detik pengalihan baca. Nyaris tanpa downtime — tapi 316 baris kotor ikut masuk ke database baru, karena tidak ada filter validasi di jalur replikasi. Replikasi memindahkan data dengan setia — termasuk dosa-dosanya.",
    ],
    tasks: [
      { id: "t1", text: "Catat: apa penyebab lag applier dan dari temuan lab mana asalnya" },
      { id: "t2", text: "Tulis di mana seharusnya filter validasi dipasang pada arsitektur replikasi" },
    ],
    note: {
      title: "Replikasi itu cermin, bukan filter",
      body: "CDC mereplikasi apa adanya. Tanpa filter validasi di jalur replikasi, “database baru yang bersih” hanyalah database lama dengan alamat baru. Pasang aturan validasi SEBELUM replikasi berjalan, bukan sesudah.",
    },
  },
];

(misiGabungMigrasiWarisan.steps as V2Step[]).push(...LANJUTAN_MIGRASI);

// ── lanjutan: langkah 10–13 ──────────────────────────────────────────────
const LANJUTAN_MIGRASI_2: V2Step[] = [
  {
    id: "audit",
    eyebrow: "Langkah 10 · Misi audit",
    title: "Dossier 14 baris: “laporan kesiapan” vendor yang terlalu bersih",
    prose: [
      "Sebelum menulis rencana migrasi, satu misi audit. Di bawah ini 14 baris “Laporan Kesiapan Migrasi” dari vendor konsultan — dokumen yang menyimpulkan Si Warisan “siap pindah”. Seseorang menyuntikkan 4 sabotase ke dalamnya.",
      "Senjatamu: profil_kualitas.csv (angka per kolom), query_audit.csv (Q03, Q07, Q11), indeks.csv (kolom dipakai_30_hari), statistik_tabel.csv, dan hasil kedua lab-mu. Laporan yang tidak menemukan satu pun masalah di database 10 tahun sedang berbohong — temukan di mana.",
    ],
    tasks: [
      { id: "t1", text: "Bandingkan setiap baris dossier dengan file mentah di snapshot" },
      { id: "t2", text: "Catat minimal 3 baris yang kamu curigai + alasannya per baris" },
    ],
    auditDossier: {
      version: "migrasi-warisan-cap5-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai kutipan “Laporan Kesiapan Migrasi” vendor konsultan yang menyatakan Si Warisan SIAP dimigrasi tanpa temuan.",
      columns: ["Bagian", "Klaim", "Angka", "Status"],
      rows: [
        { rowId: 1, cells: { "Bagian": "Kualitas · pelanggan.email", "Klaim": "NULL 3,0% — di bawah ambang 5%", "Angka": "60 dari 2000", "Status": "Lolos" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 2, cells: { "Bagian": "Kualitas · pelanggan.telepon", "Klaim": "Format liar perlu perbaikan", "Angka": "83 baris", "Status": "Perlu perbaikan" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 3, cells: { "Bagian": "Kualitas · orders.total", "Klaim": "Total negatif perlu dibersihkan", "Angka": "108 baris", "Status": "Perlu perbaikan" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 4, cells: { "Bagian": "Kualitas · orders.tanggal", "Klaim": "Tanggal masa depan perlu dibersihkan", "Angka": "76 baris", "Status": "Perlu perbaikan" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 5, cells: { "Bagian": "Performa · Q03", "Klaim": "Laporan status: full scan, perlu indeks", "Angka": "2340 ms", "Status": "Perlu indeks" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 6, cells: { "Bagian": "Performa · Q11", "Klaim": "Arsip pembayaran: full scan, perlu indeks", "Angka": "1620 ms", "Status": "Perlu indeks" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 7, cells: { "Bagian": "Indeks · idx_orders_pelanggan", "Klaim": "Produktif", "Angka": "dipakai 1200x/30 hari", "Status": "Sehat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 8, cells: { "Bagian": "Indeks · idx_orders_tgl_status", "Klaim": "Produktif", "Angka": "dipakai 450x/30 hari", "Status": "Sehat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I2: indeks hantu dipoles ──
        { rowId: 9, cells: { "Bagian": "Indeks · idx_orders_status", "Klaim": "Produktif, dipakai harian", "Angka": "dipakai 1400x/30 hari", "Status": "Sehat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 10, cells: { "Bagian": "Indeks · idx_produk_nama", "Klaim": "Produktif", "Angka": "dipakai 900x/30 hari", "Status": "Sehat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I3: statistik basi disembunyikan ──
        { rowId: 11, cells: { "Bagian": "Statistik · orders", "Klaim": "Planner akurat", "Angka": "error < 5%", "Status": "Sehat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I4: baris yatim dihapus ──
        { rowId: 12, cells: { "Bagian": "Integritas · baris yatim", "Klaim": "Tidak ada baris yatim", "Angka": "0 di semua tabel", "Status": "Lolos" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I1: ringkasan “data sudah bersih” ──
        { rowId: 13, cells: { "Bagian": "Ringkasan kualitas", "Klaim": "0 nilai tak valid di semua tabel", "Angka": "0", "Status": "Bersih" }, claims: [{ label: "Kesimpulan", value: "Data sudah bersih" }] },
        { rowId: 14, cells: { "Bagian": "Rekomendasi", "Klaim": "Siap migrasi, tidak ada temuan", "Angka": "—", "Status": "Disetujui vendor" }, claims: [{ label: "Rekomendasi", value: "Lanjut migrasi" }] },
      ],
      injections: [
        { key: "indeks-hantu-dipoles", rowIds: [9, 10], title: "Indeks hantu dipoles jadi “produktif”", clue: "idx_orders_status diklaim dipakai 1.400x/30 hari — di indeks.csv: 0x. idx_produk_nama diklaim 900x — aslinya 0x. Vendor mengubah kolom dipakai_30_hari, berharap tidak ada yang membuka file mentahnya.", danger: "Indeks hantu yang “disetujui” ikut dimigrasi: setiap tulis di sistem baru membayar pajak ke indeks tak berguna, dan dump migrasi membengkak tanpa alasan." },
        { key: "statistik-basi-disembunyikan", rowIds: [11], title: "Statistik basi disembunyikan", clue: "“Planner akurat, error < 5%” — kenyataannya tercatat 50.000 vs aktual 8.012 (error 524%), analyze terakhir 2026-01-02. Query plan di database baru akan kacau sampai ANALYZE dijalankan.", danger: "Statistik basi = query plan salah = query lambat di sistem baru yang “seharusnya lebih cepat”. Masalah performa yang lahir di hari pertama migrasi dan disalahkan ke vendor hardware." },
        { key: "baris-yatim-dihapus", rowIds: [12], title: "Baris yatim dihapus dari laporan", clue: "“0 di semua tabel” — padahal ~97 order yatim + ~91 pembayaran yatim (FK tidak pernah ditegakkan). Tanpa FK, baris yatim menumpuk diam-diam; migrasi memindahkannya apa adanya.", danger: "Baris yatim yang ikut migrasi = order tanpa pelanggan = laporan omzet yang tidak bisa dipertanggungjawabkan. Ditemukan 3 bulan kemudian oleh auditor, bukan oleh DBA." },
        { key: "ringkasan-bersih-palsu", rowIds: [13, 14], title: "Ringkasan “data sudah bersih”", clue: "“0 nilai tak valid di semua tabel” — padahal 8 baris profil_kualitas mencatat 7 kolom bermasalah (baris 2, 3, 4 dossier ini sendiri mengakuinya!). Satu kalimat ringkasan yang salah membuat 40 halaman laporan tidak berguna.", danger: "Ringkasan adalah satu-satunya bagian yang dibaca direksi. Ringkasan yang bohong = keputusan migrasi diambil di atas pasir — dan pasirnya ditandatangani vendor." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 11 · Deliverable",
    title: "Rencana migrasi untuk CTO",
    prose: [
      "Semua bukti di tangan. Tulis rencana migrasi satu dokumen untuk CTO — artefak portofoliomu. Rencana yang baik tidak hanya memilih strategi, tapi menunjukkan ANGKA temuannya, siapa pemilik setiap tabel, aturan validasi apa yang menjadi gerbang, dan apa yang terjadi bila gerbang tidak terpenuhi.",
    ],
    tasks: [
      { id: "t1", text: "Draf 6 bagian template di bawah ini dengan angka temuanmu sendiri" },
      { id: "t2", text: "Nilai drafmu dengan rubrik — bagian mana yang masih di bawah level 3" },
    ],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): kondisi Si Warisan dalam angka, strategi yang dipilih, dan gerbang pra-migrasi.",
        "Profil kualitas data: temuan per tabel/kolom dengan angka dari profil_kualitas.csv + aturan validasi kontrak yang wajib hidup sebelum migrasi.",
        "Audit performa: full scan yang harus diindeks, indeks hantu yang harus dibuang, statistik basi yang harus di-ANALYZE — beserta dampaknya ke jendela migrasi.",
        "Tata kelola: register kepemilikan 6 tabel warisan; keputusan nasib tabel yatim (retur, voucher_lama) + siapa yang menyetujui.",
        "Strategi & eksekusi: strategi terpilih (rujuk keputusanmu di Langkah 6), jadwal, jendela downtime yang dijanjikan, dan trigger rollback yang eksplisit.",
        "Batas & risiko sisa: apa yang TIDAK dicakup audit ini (mis. beban tulis puncak, perilaku aplikasi terhadap constraint baru).",
      ],
      rubric: [
        { criterion: "Kebenaran profil kualitas", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar tanpa lokasi kolom", "Angka per kolom tepat (NULL, duplikat, tak valid) + aturan kontraknya"] },
        { criterion: "Kebenaran audit performa", weight: 25, levels: ["Tidak menyebut full scan/indeks hantu", "Menyebut sebagian tanpa bukti", "Full scan, indeks hantu, dan statistik basi disebut dengan query_id/nama indeks + dampak ke jendela migrasi"] },
        { criterion: "Tata kelola & kepemilikan", weight: 20, levels: ["Tabel yatim tidak dibahas", "Disebut tanpa rekomendasi nasib", "Register 6 tabel + rekomendasi nasib retur/voucher_lama + penanggung jawab keputusan"] },
        { criterion: "Kualitas strategi + gerbang", weight: 20, levels: ["Strategi tanpa gerbang pra-migrasi", "Ada strategi, gerbang kabur", "Strategi + gerbang eksplisit berangka + trigger rollback"] },
        { criterion: "Kejujuran batas", weight: 10, levels: ["Mengklaim audit menjamin migrasi sukses", "Menyebut sebagian batas", "Batas audit dinyatakan eksplisit (beban puncak, perilaku aplikasi)"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 12 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di “Laporan Kesiapan Migrasi” vendor:",
      "1) **Indeks hantu dipoles** (baris 9–10): idx_orders_status diklaim “dipakai 1.400x/30 hari” — angka sebenarnya: 0x. idx_produk_nama diklaim “900x” — aslinya 0x. Vendor mengubah kolom dipakai_30_hari, berharap tidak ada yang membuka indeks.csv.",
      "2) **Statistik basi disembunyikan** (baris 11): “planner akurat, error < 5%” — kenyataannya tercatat 50.000 vs aktual 8.012 (error 524%), analyze terakhir 2026-01-02. Query plan di database baru akan kacau sampai ANALYZE dijalankan.",
      "3) **Baris yatim dihapus** (baris 12): “0 di semua tabel” — padahal ~97 order yatim + ~91 pembayaran yatim. Tanpa FK yang aktif, baris yatim menumpuk diam-diam; migrasi memindahkannya apa adanya.",
      "4) **Ringkasan “data sudah bersih”** (baris 13–14): “0 nilai tak valid di semua tabel” + “siap migrasi, tidak ada temuan” — padahal baris 2, 3, 4 dossier ini sendiri mengakui 83 + 108 + 76 baris bermasalah. Satu kalimat ringkasan yang salah membuat 40 halaman laporan tidak berguna.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim vendor terhadap data mentah, atau memercayai stempel “kesiapan”. Dan ingat keputusan bercabangmu: big-bang menghukum data kotor seketika, bertahap memberi waktu membersihkan, replikasi memindahkan dosa-dosanya — tidak ada opsi yang gratis, tapi semuanya lebih murah daripada percaya brosur vendor.",
      "Bahaya nyata terakhir: database yang “tidak boleh mati sedetik pun” adalah alasan paling umum untuk tidak pernah mengaudit — dan tidak diaudit adalah cara paling pasti untuk mati di saat terburuk. Sepuluh tahun “jangan sentuh yang masih jalan” menghasilkan 316 baris yang menolak dimigrasi.",
    ],
    tasks: [
      { id: "t1", text: "Hitung skor deteksimu (x/4) dan catat suntikan mana yang lolos darimu" },
      { id: "t2", text: "Tulis satu kalimat: apa yang berubah jika kamu memilih strategi berbeda di Langkah 6" },
    ],
    note: {
      title: "Miskonsepsi penutup: migrasi selesai = migrasi benar",
      type: "risk",
      body: "Data pindah 100% bukan berarti data benar 100% — baris yatim dan total negatif ikut pindah dengan setia. Migrasi yang benar diukur dari constraint yang aktif dan aturan yang ditegakkan di sistem baru, bukan dari selesainya dump-restore.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 13 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [
      { id: "t1", text: "Baca ulang 5 poin dan tandai mana yang paling mengubah caramu melihat database warisan" },
    ],
    summary: [
      "Audit pra-migrasi memakai dua lensa: operasi database (profil kualitas data + audit performa query) dan tata kelola (kepemilikan tabel + aturan validasi kontrak).",
      "Temuan Si Warisan: 60 email NULL + 40 duplikat, ~4% telepon liar, ~97 order yatim, 76 tanggal masa depan, 108 total negatif, 180 status liar; full scan di tabel terbesar; 3 indeks hantu; statistik orders basi (tercatat 50.000 vs aktual 8.012); 2 tabel yatim tanpa pemilik.",
      "Empat sabotase laporan vendor: indeks hantu dipoles, statistik basi disembunyikan, baris yatim dihapus, ringkasan “data sudah bersih”.",
      "Strategi migrasi selalu punya harga: big-bang (tidak memaafkan data kotor), bertahap (lambat tapi tiap langkah bisa dibatalkan), replikasi (cermin, bukan filter). Setiap strategi butuh gerbang pra-migrasi yang eksplisit dan berangka.",
      "Data: 100% SINTETIS (generator seed 42, dibekukan 2026-10-15) — pola database ritel warisan 10 tahun, bukan produksi nyata.",
    ],
  },
];

(misiGabungMigrasiWarisan.steps as V2Step[]).push(...LANJUTAN_MIGRASI_2);

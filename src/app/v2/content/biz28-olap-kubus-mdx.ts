import type { V2Lesson } from "../lib/types";

export const biz28: V2Lesson = {
  slug: "biz28-olap-kubus-mdx",
  track: "Business Intelligence",
  module: "Analisis & Insight",
  title: "BI28 — OLAP, Kubus, dan MDX: Bertanya ke Kubus, Bukan ke Tabel",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Direksi bertanya 'kenapa', dan dashboard hanya bisa menjawab 'berapa'",
      prose: [
        "Rapat direksi Kopi Nusantara. Revenue turun 8 persen. Direksi bertanya: turun di wilayah mana, produk apa, bulan apa — dan apakah penurunan itu pola atau anomali. Dashboard menjawab 'berapa' dengan satu angka; ia tidak bisa menjawab 'di mana' dan 'kapan' tanpa sepuluh filter manual dan tiga query baru.",
        "Analis senior membuka kubus OLAP: revenue per wilayah, per produk, per bulan — sudah diagregasi sebelumnya. Ia melakukan slice (hanya Jawa), dice (Jawa dan Minuman), lalu drill down (Jawa ke kota, bulan ke minggu). Dalam 4 menit jawabannya ketahuan: penurunan terkonsentrasi di Surabaya, kategori Bahan, minggu kedua — pemasok gula aren terlambat.",
        "Lesson ini mengajarkan OLAP, kubus, dan MDX: operasi multidimensi dan bahasa query-nya. Setelah lesson ini kamu bisa: (1) menjelaskan kubus, dimensi, dan measure; (2) menghitung sel kubus; (3) melakukan slice, dice, drill down, roll up, dan pivot; (4) membaca dan menulis MDX dasar; (5) memutuskan kapan kubus layak dan kapan query langsung cukup.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Grep seluruh track BI untuk OLAP, MDX, dan kubus menghasilkan 0 hit substantif — satu-satunya kemunculan kata Cube adalah nama produk Cube di BI20 (semantic layer). Tidak ada lesson yang mengajarkan kubus, operasi OLAP, atau MDX. Lesson ini membangun ketiganya dari nol.",
      },
      reference: "Kubus 4 wilayah dikali 3 produk dikali 12 bulan: 144 sel. Slice Jawa: 3 dikali 12 sama dengan 36 sel.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjawab pertanyaan direksi yang berlapis — bukan dengan query baru, melainkan dengan memutar kubus.",
        "(1) Menjelaskan kubus: dimensi, hierarki, measure, dan sel;",
        "(2) Menghitung jumlah sel dari kardinalitas tiap dimensi;",
        "(3) Melakukan slice, dice, drill down, roll up, dan pivot;",
        "(4) Membaca MDX: SELECT measure ON COLUMNS, dimensi ON ROWS, FROM kubus;",
        "(5) Memutuskan kubus vs query langsung dari pola pertanyaan.",
      ],
      tasks: [],
    },
    {
      id: "kubus-operasi",
      eyebrow: "Langkah 3 · Teori",
      title: "Kubus dan lima operasinya",
      prose: [
        "Kubus adalah tabel fakta yang sudah diagregasi di semua kombinasi dimensi. Dimensinya: wilayah (4), produk (3), bulan (12). Jumlah sel: 4 dikali 3 dikali 12 sama dengan 144 sel — tiap sel menyimpan measure, misalnya revenue. Kubus tidak menyimpan baris transaksi; ia menyimpan jawaban yang sudah dihitung untuk pertanyaan agregat.",
        "Lima operasi. Slice: potong satu irisan — hanya wilayah Jawa — tersisa 3 dikali 12 sama dengan 36 sel. Dice: potong dua dimensi sekaligus — Jawa dan Minuman — tersisa 12 sel. Drill down: turun hierarki — dari wilayah ke kota, dari bulan ke minggu — detail bertambah. Roll up: naik hierarki — dari kota ke wilayah, dari minggu ke bulan — detail berkurang, pola terlihat. Pivot: putar sumbu — wilayah yang tadinya baris menjadi kolom — pertanyaan yang sama, sudut yang berbeda.",
        "Harga kubus adalah pra-agregasi: 144 sel murah, tetapi kubus dengan 10 dimensi berkardinalitas besar meledak kombinatorial — jutaan sel yang sebagian besar kosong. Kubus modern (MOLAP) mengatasi dengan kompresi dan agregasi parsial; ROLAP tidak menyimpan kubus sama sekali melainkan menerjemahkan operasi OLAP menjadi query SQL ke star schema. Pilihannya mengikuti pola: pertanyaan berulang dan terprediksi cocok MOLAP; pertanyaan ad-hoc cocok ROLAP.",
      ],
      tasks: [],
      note: {
        title: "Kubus bukan pengganti dashboard",
        body: "Dashboard menjawab pertanyaan yang sudah diketahui; kubus menjawab pertanyaan yang muncul saat rapat. Keduanya hidup berdampingan: dashboard untuk monitoring rutin, kubus untuk eksplorasi saat angka menyimpang. Tim yang hanya punya dashboard akan selalu butuh tiga query baru di tiap rapat.",
      },
      reference: "144 sel total; slice Jawa 36 sel; dice Jawa dan Minuman 12 sel. MOLAP: pra-agregasi; ROLAP: terjemahan ke SQL.",
    },
    {
      id: "mdx",
      eyebrow: "Langkah 4 · Teori",
      title: "MDX: bahasa bertanya ke kubus",
      prose: [
        "MDX (Multidimensional Expressions) adalah SQL-nya kubus. Bentuk dasarnya: SELECT measure ON COLUMNS, dimensi ON ROWS, FROM nama_kubus. Contoh: SELECT [Measures].[Revenue] ON COLUMNS, [Produk].[Kategori].Members ON ROWS FROM [Penjualan] — revenue per kategori, satu baris per kategori.",
        "WHERE di MDX adalah slicer: ia memotong kubus sebelum jawaban dihitung — SELECT revenue ON COLUMNS, [Bulan].Members ON ROWS FROM [Penjualan] WHERE [Wilayah].[Jawa] berarti revenue per bulan hanya untuk Jawa. Perbedaan dengan SQL: di MDX, dimensi dan hierarki adalah warga kelas satu — drill down ditulis sebagai navigasi hierarki, bukan join tambahan.",
        "MDX modern jarang ditulis tangan oleh analis bisnis — tool OLAP men-generate-nya dari klik slice dan drill down. Tetapi analis yang bisa membaca MDX bisa memeriksa apa yang sebenarnya ditanyakan tool-nya: apakah slicer-nya Jawa saja atau Jawa plus satu filter tersembunyi yang mengubah angka.",
      ],
      tasks: [],
      reference: "MDX: SELECT measure ON COLUMNS, dimensi ON ROWS, FROM kubus. WHERE adalah slicer.",
    },
    {
      id: "lab-kubus",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung sel kubus dan hasil slice",
      prose: [
        "Lab ini menghitung aritmetika kubus: total sel dari kardinalitas dimensi, dan sel tersisa setelah slice.",
        "Hitung dulu di kepala. Total sel: 4 dikali 3 dikali 12 sama dengan 144. Slice Jawa: wilayah terkunci ke 1, tersisa 1 dikali 3 dikali 12 sama dengan 36 sel. Dice Jawa dan Minuman: 1 dikali 1 dikali 12 sama dengan 12 sel.",
        "Tugas lab: tulis fungsi yang menerima kardinalitas wilayah, produk, dan bulan — lalu mencetak tiga angka: sel_total, sel_slice, sel_dice.",
        "Setelah lolos, coba eksperimen: tambah dimensi kanal dengan 5 nilai dan lihat sel total menjadi 720 — itulah ledakan kombinatorial yang harus diwaspadai.",
      ],
      tasks: [
        { id: "t1", text: "Hitung sel_total kubus" },
        { id: "t2", text: "Hitung sel_slice untuk satu wilayah" },
        { id: "t3", text: "Hitung sel_dice untuk satu wilayah dan satu produk" },
      ],
      expected: "sel_total=144\nsel_slice=36\nsel_dice=12",
      hints: [
        "Total sel = perkalian kardinalitas semua dimensi.",
        "Slice mengunci satu dimensi ke 1 nilai.",
        "Dice mengunci dua dimensi ke 1 nilai.",
      ],
      code: {
        starter: `# Kubus penjualan Kopi Nusantara: wilayah, produk, bulan.\nwilayah = 4\nproduk = 3\nbulan = 12\n\n# TULIS KODEMU: hitung sel_total, sel_slice, sel_dice.\n# Cetak, per baris: sel_total, sel_slice, sel_dice.\n\n\nmesin_kubus(wilayah, produk, bulan)`,
        lockLines: 4,
        solution: `# Kubus penjualan Kopi Nusantara: wilayah, produk, bulan.\nwilayah = 4\nproduk = 3\nbulan = 12\n\n\ndef mesin_kubus(wilayah, produk, bulan):\n    sel_total = wilayah * produk * bulan\n    sel_slice = 1 * produk * bulan\n    sel_dice = 1 * 1 * bulan\n    print(f"sel_total={sel_total}")\n    print(f"sel_slice={sel_slice}")\n    print(f"sel_dice={sel_dice}")\n\n\nmesin_kubus(wilayah, produk, bulan)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "sel_total=144", label: "144 sel total", msg: "4 x 3 x 12 = 144 sel." },
          { kind: "stdout_matches", task: "t2", pattern: "sel_slice=36", label: "Slice Jawa: 36 sel", msg: "1 x 3 x 12 = 36 sel." },
          { kind: "stdout_matches", task: "t3", pattern: "sel_dice=12", label: "Dice Jawa dan Minuman: 12 sel", msg: "1 x 1 x 12 = 12 sel." },
        ],
      },
      reference: "144 sel total; slice 36; dice 12.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: 4 menit dari 'turun 8 persen' ke 'gula aren terlambat'",
      prose: [
        "Kembali ke Kopi Nusantara. Analis membuka kubus dan melakukan slice Jawa (36 sel), dice Minuman dan Bahan (24 sel), lalu drill down bulan ke minggu. Polanya muncul: Bahan di Surabaya turun 66,7 persen di minggu kedua — sementara Minuman stabil. Satu telepon ke pemasok mengonfirmasi: pengiriman gula aren terlambat 5 hari.",
        "Tanpa kubus, diagnosis yang sama butuh tiga query baru dan persetujuan akses — sekitar 2 hari. Dengan kubus, 4 menit di tengah rapat. Perbedaannya bukan kecepatan analis, melainkan jawaban yang sudah diagregasi sebelum pertanyaan diajukan.",
        "Keputusan rapat: kubus dibangun untuk tiga pertanyaan berulang direksi (revenue per wilayah-produk-bulan, margin per kanal, dan stok per gudang). Pertanyaan ad-hoc tetap lewat query langsung — kubus tidak dibangun untuk semua pertanyaan, hanya untuk yang berulang.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat kubus ini berhasil. Pertama, dimensinya hanya tiga — ledakan kombinatorial terkendali. Kedua, kubus dibangun untuk pertanyaan berulang, bukan semua pertanyaan. Ketiga, drill down mengikuti hierarki bisnis (wilayah ke kota, bulan ke minggu) — bukan hierarki teknis.",
      },
      reference: "Slice, dice, drill down: 4 menit ke akar masalah. Kubus untuk pertanyaan berulang; query langsung untuk ad-hoc.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Lab: 144 sel total; slice Jawa 36; dice Jawa dan Minuman 12.",
        "Kubus menyimpan jawaban agregat, bukan baris transaksi.",
        "Slice, dice, drill down, roll up, pivot — lima operasi OLAP.",
        "MDX: SELECT measure ON COLUMNS, dimensi ON ROWS, FROM kubus; WHERE adalah slicer.",
        "Kubus untuk pertanyaan berulang; query langsung untuk ad-hoc.",
      ],
      next: { label: "BI29 — Forecasting di Dashboard: Ramalan yang Jujur di Layar Direksi", href: "/v2/learn/biz29-forecasting-di-dashboard" },
      quiz: [
        {
          q: "Kubus 4 wilayah, 3 produk, 12 bulan. Berapa sel total dan sel slice Jawa?",
          options: [
            { text: "144 total, 12 slice", why: "Salah: 12 adalah hasil dice (Jawa dan Minuman), bukan slice." },
            { text: "36 total, 144 slice", why: "Salah: terbalik — total selalu lebih besar dari slice." },
            { text: "19 total — jumlah dimensi dijumlah", why: "Salah: sel adalah perkalian kardinalitas, bukan penjumlahan." },
            { text: "144 total, 36 slice", why: "Tepat: 4 x 3 x 12 = 144; slice mengunci wilayah ke 1: 1 x 3 x 12 = 36.", correct: true },
          ],
        },
        {
          q: "Apa beda drill down dan roll up?",
          options: [
            { text: "Drill down turun hierarki (wilayah ke kota); roll up naik hierarki (kota ke wilayah)", why: "Tepat: drill down menambah detail, roll up mengurangi detail dan menampakkan pola.", correct: true },
            { text: "Drill down menambah dimensi baru; roll up menghapus dimensi", why: "Salah: keduanya bergerak di hierarki yang sama — bukan menambah atau menghapus dimensi." },
            { text: "Keduanya sama — hanya nama berbeda", why: "Salah: arahnya berlawanan — turun vs naik hierarki." },
            { text: "Drill down untuk MOLAP, roll up untuk ROLAP", why: "Salah: keduanya operasi OLAP yang berlaku di MOLAP maupun ROLAP." },
          ],
        },
        {
          q: "Dalam MDX, apa fungsi WHERE?",
          options: [
            { text: "Memfilter baris hasil seperti di SQL", why: "Salah: di MDX, WHERE adalah slicer — ia memotong kubus sebelum jawaban dihitung." },
            { text: "Slicer: memotong kubus ke irisan tertentu sebelum agregasi", why: "Tepat: WHERE [Wilayah].[Jawa] berarti seluruh jawaban hanya untuk Jawa.", correct: true },
            { text: "Mengurutkan hasil", why: "Salah: pengurutan bukan tugas WHERE di MDX." },
            { text: "Memilih measure yang ditampilkan", why: "Salah: measure dipilih di SELECT ON COLUMNS, bukan di WHERE." },
          ],
        },
        {
          q: "Kapan kubus MOLAP menjadi masalah?",
          options: [
            { text: "Dimensi sedikit dan pertanyaan berulang", why: "Salah: itu justru kasus terbaik MOLAP — sel sedikit dan terpakai." },
            { text: "Pertanyaan selalu sama setiap hari", why: "Salah: pertanyaan yang sama adalah alasan membangun kubus." },
            { text: "Banyak dimensi berkardinalitas besar — sel meledak kombinatorial dan sebagian besar kosong", why: "Tepat: 10 dimensi besar berarti jutaan sel kosong yang tetap memakan pra-agregasi.", correct: true },
            { text: "Data hanya 1.000 baris", why: "Salah: data kecil tidak butuh kubus — tetapi bukan karena ledakan sel." },
          ],
        },
        {
          q: "Direksi bertanya kenapa revenue turun, dan jawabannya butuh 3 query baru. Apa pelajaran BI-nya?",
          options: [
            { text: "Dashboard harus punya lebih banyak chart", why: "Salah: chart lebih banyak tidak menjawab 'di mana' dan 'kapan' tanpa eksplorasi." },
            { text: "Analis harus menulis query lebih cepat", why: "Salah: kecepatan menulis bukan masalahnya — jawabannya belum diagregasi." },
            { text: "Revenue tidak boleh turun", why: "Salah: itu bukan pelajaran BI — itu harapan yang tidak realistis." },
            { text: "Dashboard menjawab 'berapa'; kubus menjawab 'di mana, kapan, dan kenapa' lewat slice dan drill down", why: "Tepat: kubus menyimpan agregat multidimensi sehingga pertanyaan berlapis terjawab tanpa query baru.", correct: true },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

export const biz27: V2Lesson = {
  slug: "biz27-snowflake-schema",
  track: "Business Intelligence",
  module: "Fondasi BI",
  title: "BI27 — Snowflake Schema: Dimensi yang Di-normalisasi Bertingkat",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dimensi produk yang menyimpan nama kategori 1.200 kali",
      prose: [
        "Dimensi produk Kopi Nusantara punya 1.200 baris — dan nama kategori 'Minuman' tertulis 1.200 kali, sekali per produk. Suatu hari kategori 'Minuman' berganti nama menjadi 'Beverage'. Update harus menyentuh 1.200 baris; satu baris terlewat, dan dashboard menampilkan dua kategori untuk barang yang sama selama seminggu sebelum ada yang sadar.",
        "Itulah harga denormalisasi star schema: cepat dibaca, tetapi satu fakta disimpan berkali-kali. Snowflake schema memecah dimensi menjadi bertingkat — produk menunjuk kategori, kategori menunjuk departemen — sehingga nama kategori hanya tertulis sekali, di tabelnya sendiri.",
        "Lesson ini mengajarkan snowflake schema secara eksplisit: struktur bertingkat, trade-off melawan star, dan kapan memakainya. Setelah lesson ini kamu bisa: (1) merancang snowflake dari dimensi yang datar; (2) menghitung join dan penghematan storage; (3) menjelaskan trade-off snowflake vs star vs wide table; (4) menulis query snowflake yang benar; (5) memutuskan kapan snowflake layak.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "BI2 mengajarkan star schema secara mendalam dan menyebut snowflake hanya sebagai trade-off satu kalimat: dimensi di-normalisasi bertingkat menghemat storage tetapi menambah join. Tidak ada lesson yang merancang snowflake, menghitung join-nya, atau memberi lab. Lesson ini membangun snowflake sebagai topik sendiri — pelengkap BI2, bukan pengulangan.",
      },
      reference: "1.200 produk, 40 kategori, 8 departemen. Join snowflake 3, star 1. Hemat storage 58.000 byte untuk nama kategori 50 byte.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memutuskan kapan dimensi dipecah bertingkat — dan membayar harga join-nya dengan sadar.",
        "(1) Merancang snowflake: produk ke kategori ke departemen;",
        "(2) Menghitung jumlah join dan penghematan storage;",
        "(3) Menjelaskan trade-off snowflake vs star vs wide table;",
        "(4) Menulis query agregat melewati dimensi bertingkat;",
        "(5) Memutuskan snowflake vs star dari pola query dan frekuensi update.",
      ],
      tasks: [],
    },
    {
      id: "struktur",
      eyebrow: "Langkah 3 · Teori",
      title: "Struktur bertingkat: satu fakta disimpan sekali",
      prose: [
        "Snowflake memecah dimensi menjadi tabel-tabel kecil yang saling menunjuk. Tabel produk menyimpan kategori_id; tabel kategori menyimpan nama kategori dan departemen_id; tabel departemen menyimpan nama departemen. Nama kategori 'Minuman' tertulis sekali — di tabel kategori — bukan 1.200 kali di tabel produk. Ganti nama kategori berarti update satu baris.",
        "Hitung penghematannya: nama kategori 50 byte dikali 1.200 produk sama dengan 60.000 byte di star; di snowflake hanya 40 kategori dikali 50 byte sama dengan 2.000 byte. Hemat 58.000 byte — hanya untuk kolom nama kategori; kolom lain yang diduplikasi tidak dihitung di sini. Angka itu kecil untuk satu kolom — tetapi untuk dimensi jutaan baris dengan puluhan atribut berulang, penghematannya nyata, dan yang lebih penting: inkonsistensi NAMA itu menjadi jauh lebih sulit terjadi — satu sumber kebenaran untuk nama kategori. 'Tidak mungkin' terlalu kuat: inkonsistensi masih bisa muncul lewat data yang salah di tabel kategori itu sendiri, atau lewat duplikasi di tempat lain (misalnya cache atau laporan yang menyalin nama).",
        "Harganya adalah join: query revenue per departemen di star butuh 1 join (fact ke produk); di snowflake butuh 3 join (fact ke produk ke kategori ke departemen). Tiap join tambahan adalah biaya baca dan risiko kesalahan — analis yang lupa satu join mendapat angka yang salah, bukan error. Aturan: snowflake layak bila atribut dimensi sering berubah atau dimensinya sangat besar; star menang bila query didominasi analis bisnis yang butuh join sederhana.",
      ],
      tasks: [],
      note: {
        title: "Snowflake bukan normalisasi membabi buta",
        body: "Snowflake yang memecah sampai atribut atomik (misalnya tabel terpisah untuk tiap kota) menghasilkan join 7 lapis yang tidak dibaca siapa pun. Pecah hanya pada batas yang bermakna bisnis: kategori dan departemen adalah entitas yang dikelola sendiri; kota dan kode pos bukan — keduanya atribut produk yang jarang berubah sendiri.",
      },
      reference: "Star: 60.000 byte untuk nama kategori. Snowflake: 2.000 byte. Hemat 58.000 byte (kolom nama kategori saja). Harga: 3 join melawan 1 join.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Teori",
      title: "Peta keputusan: star, snowflake, atau wide table",
      prose: [
        "Tiga skenario. Satu: dashboard dan laporan rutin dengan banyak analis bisnis — star schema. Join sederhana, SUM aman, dan analis baru paham dalam sehari. Dua: dimensi sangat besar dengan atribut yang sering berubah nama atau berpindah induk — snowflake. Satu update mengganti satu baris, dan inkonsistensi nama praktis hilang. Tiga: satu tabel wide untuk machine learning atau export sekali jalan — wide table tercepat dibaca, tetapi boros dan rawan inkonsistensi, jadi jangan jadikan ia sumber kebenaran.",
        "Keputusan ini per dimensi, bukan per warehouse: satu warehouse boleh punya dimensi produk snowflake dan dimensi pelanggan star. Dan keputusan bisa berubah: dimensi yang dulu kecil dan stabil bisa tumbuh menjadi snowflake saat atributnya mulai dikelola tim lain.",
        "Jebakan yang paling umum: snowflake demi kerapian semata. Bila tidak ada yang pernah update nama kategori dan dimensi hanya 1.200 baris, 58.000 byte yang dihemat tidak sepadan dengan 2 join tambahan di tiap query. Kerapian yang dibayar analis tiap hari adalah kerapian yang mahal.",
      ],
      tasks: [],
      reference: "Star untuk analis banyak; snowflake untuk dimensi besar yang sering berubah; wide table untuk konsumsi sekali jalan, bukan sumber kebenaran.",
    },
    {
      id: "lab-snowflake",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung join dan hemat storage snowflake",
      prose: [
        "Lab ini menghitung aritmetika snowflake: jumlah join dan penghematan storage nama kategori.",
        "Hitung dulu di kepala. Storage star: 1.200 produk dikali 50 byte sama dengan 60.000 byte. Storage snowflake: 40 kategori dikali 50 byte sama dengan 2.000 byte. Hemat: 60.000 dikurangi 2.000 sama dengan 58.000 byte. Join snowflake: fact ke produk, produk ke kategori, kategori ke departemen — 3 join.",
        "Tugas lab: tulis fungsi yang menerima jumlah produk, kategori, dan byte per nama — lalu mencetak dua angka: join_snowflake dan hemat_byte.",
        "Setelah lolos, coba eksperimen: ubah produk menjadi 12.000 dan lihat hemat naik menjadi 598.000 byte — penghematan snowflake tumbuh bersama ukuran dimensi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung join_snowflake: fact-produk-kategori-departemen" },
        { id: "t2", text: "Hitung hemat_byte star vs snowflake" },
      ],
      expected: "join_snowflake=3\nhemat_byte=58000",
      hints: [
        "Join snowflake = jumlah lompatan dari fact ke departemen.",
        "Star menyimpan nama per produk; snowflake per kategori.",
        "Hemat = star dikurangi snowflake.",
      ],
      code: {
        starter: `# Dimensi produk Kopi Nusantara: produk, kategori, nama.\njumlah_produk = 1200\njumlah_kategori = 40\nbyte_per_nama = 50\n\n# TULIS KODEMU: hitung join_snowflake dan hemat_byte.\n# Cetak, per baris: join_snowflake, hemat_byte.\n\n\nmesin_snowflake(jumlah_produk, jumlah_kategori, byte_per_nama)`,
        lockLines: 4,
        solution: `# Dimensi produk Kopi Nusantara: produk, kategori, nama.\njumlah_produk = 1200\njumlah_kategori = 40\nbyte_per_nama = 50\n\n\ndef mesin_snowflake(jumlah_produk, jumlah_kategori, byte_per_nama):\n    join_snowflake = 3\n    star = jumlah_produk * byte_per_nama\n    snowflake = jumlah_kategori * byte_per_nama\n    hemat_byte = star - snowflake\n    print(f"join_snowflake={join_snowflake}")\n    print(f"hemat_byte={hemat_byte}")\n\n\nmesin_snowflake(jumlah_produk, jumlah_kategori, byte_per_nama)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "join_snowflake=3", label: "3 join snowflake", msg: "Fact ke produk, produk ke kategori, kategori ke departemen." },
          { kind: "stdout_matches", task: "t2", pattern: "hemat_byte=58000", label: "Hemat 58.000 byte", msg: "60.000 - 2.000 = 58.000 byte. Nama kategori hanya tertulis 40 kali." },
        ],
      },
      note: {
        title: "Query agregat snowflake lengkap (contoh)",
        body: "SELECT d.nama_departemen, k.nama_kategori, SUM(f.revenue) AS revenue FROM fact_penjualan f JOIN dim_produk p ON f.produk_id = p.produk_id JOIN dim_kategori k ON p.kategori_id = k.kategori_id JOIN dim_departemen d ON k.departemen_id = d.departemen_id GROUP BY d.nama_departemen, k.nama_kategori ORDER BY revenue DESC; — tiga join itu harga yang dibayar untuk satu sumber kebenaran; view datar di atasnya mengembalikan query analis ke 1 join tanpa mengembalikan duplikasi.",
      },
      reference: "Join snowflake 3; hemat 58.000 byte.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: ganti nama kategori tanpa seminggu dua kategori",
      prose: [
        "Kembali ke Kopi Nusantara. Dimensi produk dipecah menjadi snowflake: kategori pindah ke tabel sendiri. Saat 'Minuman' berganti nama menjadi 'Beverage', update menyentuh satu baris — dan semua dashboard berubah serentak tanpa satu pun baris terlewat.",
        "Tetapi analis mengeluh: query mereka kini butuh 3 join. Solusinya: view yang menyatukan kembali produk, kategori, dan departemen menjadi satu tampilan datar untuk analis — snowflake di penyimpanan, star di tampilan. Analis tetap menulis 1 join ke view; kerapian tetap terjaga di tabel dasar.",
        "Keputusan rapat: snowflake untuk dimensi yang dikelola (kategori, departemen); view datar untuk analis. Kerapian dan kemudahan tidak perlu saling mengalahkan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini bekerja. Pertama, pemecahan hanya pada batas entitas yang dikelola — bukan semua atribut. Kedua, view datar menyembunyikan join dari analis. Ketiga, penghematan dan harga join dihitung dulu — bukan diasumsikan.",
      },
      reference: "Update satu baris mengganti nama kategori di semua dashboard. View datar menjaga query analis tetap 1 join.",
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
        "Lab: join snowflake 3; hemat 58.000 byte (60.000 vs 2.000).",
        "Snowflake menyimpan tiap fakta sekali — update satu baris, inkonsistensi nama praktis hilang (bukan mustahil mutlak).",
        "Harga snowflake: join tambahan di tiap query.",
        "Star untuk banyak analis; snowflake untuk dimensi besar yang sering berubah.",
        "View datar bisa menyembunyikan join snowflake dari analis.",
      ],
      next: { label: "BI28 — OLAP, Kubus, dan MDX: Bertanya ke Kubus, Bukan ke Tabel", href: "/v2/learn/biz28-olap-kubus-mdx" },
      quiz: [
        {
          q: "1.200 produk, 40 kategori, nama kategori 50 byte. Berapa hemat storage snowflake?",
          options: [
            { text: "60.000 byte — seluruh storage star", why: "Salah: snowflake tetap menyimpan nama kategori 40 kali (2.000 byte); hematnya selisih, bukan seluruhnya." },
            { text: "2.000 byte — itu storage snowflake", why: "Salah: 2.000 adalah storage snowflake, bukan penghematannya." },
            { text: "58.000 byte", why: "Tepat: star 1.200 x 50 = 60.000; snowflake 40 x 50 = 2.000; hemat 58.000.", correct: true },
            { text: "0 byte — nama kategori tidak memakan tempat", why: "Salah: teks memakan byte; 1.200 salinan nama adalah 60.000 byte nyata." },
          ],
        },
        {
          q: "Revenue per departemen: berapa join di snowflake vs star?",
          options: [
            { text: "Snowflake 1, star 3 — terbalik", why: "Salah: justru snowflake yang bertingkat dan butuh join lebih banyak." },
            { text: "Keduanya 1 join", why: "Salah: snowflake memecah dimensi sehingga butuh lompatan tambahan." },
            { text: "Keduanya 3 join", why: "Salah: star menaruh semua atribut dimensi di satu tabel sehingga 1 join cukup." },
            { text: "Snowflake 3, star 1", why: "Tepat: snowflake fact-produk-kategori-departemen (3); star fact-produk saja karena departemen ada di produk (1).", correct: true },
          ],
        },
        {
          q: "Kapan snowflake layak dipilih?",
          options: [
            { text: "Dimensi sangat besar dengan atribut yang sering berubah atau berpindah induk", why: "Tepat: di situlah satu-update-satu-baris dan anti-inkonsistensi membayar harga join.", correct: true },
            { text: "Dimensi kecil dan stabil, analis banyak — demi kerapian", why: "Salah: kerapian semata tidak sepadan dengan join tambahan di tiap query." },
            { text: "Selalu — snowflake adalah bentuk normal yang benar", why: "Salah: tidak ada bentuk yang selalu benar; star menang untuk query analis yang sederhana." },
            { text: "Untuk machine learning sekali jalan", why: "Salah: itu kasus wide table, bukan snowflake." },
          ],
        },
        {
          q: "Analis mengeluh query snowflake butuh 3 join. Solusi yang menjaga kerapian sekaligus kemudahan?",
          options: [
            { text: "Kembalikan semua ke star dan terima duplikasi", why: "Salah: itu membuang manfaat snowflake; ada jalan tengah." },
            { text: "Buat view datar yang menyatukan dimensi untuk analis", why: "Tepat: snowflake di penyimpanan, star di tampilan — analis tetap 1 join.", correct: true },
            { text: "Minta analis belajar menulis 3 join dengan benar", why: "Salah: itu memindahkan beban ke tiap analis dan tiap query — risiko lupa join tetap ada." },
            { text: "Hapus tabel kategori", why: "Salah: menghapus tabel berarti kembali ke duplikasi." },
          ],
        },
        {
          q: "Apa risiko terbesar bila analis lupa satu join di query snowflake?",
          options: [
            { text: "Query error dan tidak jalan", why: "Salah: lupa join biasanya tidak error — ia menghasilkan angka yang salah secara diam-diam." },
            { text: "Database crash", why: "Salah: lupa join tidak membuat database crash." },
            { text: "Angka yang salah tanpa error — agregat atas grain yang keliru", why: "Tepat: itulah bahaya join bertingkat — kesalahan sunyi, bukan kegagalan keras.", correct: true },
            { text: "Storage membengkak", why: "Salah: query tidak mengubah storage." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

export const de34: V2Lesson = {
  slug: "de34-hadoop-hdfs-legacy",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE34 — Hadoop dan HDFS: Arsitektur Legacy yang Masih Menjelaskan Banyak Hal",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Klaster tua yang tidak boleh dimatikan",
      prose: [
        "Bank Artha Dana masih menjalankan klaster Hadoop dari 2016. Tiap tahun seseorang mengusulkan mematikannya — dan tiap tahun tim risk menolak: 12 tahun arsip transaksi tinggal di sana, dan tidak ada yang tahu persis apa yang akan rusak bila klaster itu padam. Engineer muda menganggap Hadoop fosil; engineer senior menganggapnya fondasi yang kebetulan masih berdiri.",
        "Keduanya setengah benar. Hadoop memang legacy — hampir tidak ada yang membangun klaster baru hari ini. Tetapi ide-idenya hidup di semua yang datang sesudahnya: HDFS mengajarkan penyimpanan terdistribusi, MapReduce mengajarkan komputasi yang dibawa ke data, dan kegagalannya mengajarkan kenapa lakehouse lahir.",
        "Lesson ini mengajarkan Hadoop dan HDFS sebagai warisan: cara kerja blok dan replikasi, NameNode dan DataNode, MapReduce dan kenapa ia lambat, serta kapan memigrasi dan kapan membiarkan. Setelah lesson ini kamu bisa: (1) menjelaskan arsitektur HDFS; (2) menghitung blok, replikasi, dan kebutuhan memori NameNode; (3) menjelaskan MapReduce dan batasnya; (4) menilai kapan legacy dipertahankan; (5) merencanakan migrasi keluar Hadoop.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Satu-satunya singgungan Hadoop di track DE adalah satu kalimat di DE14: merawat HDFS lebih mahal dari lakehouse managed. Tidak ada lesson yang menjelaskan cara kerja HDFS, replikasi, NameNode, atau MapReduce. Lesson ini mengisi kekosongan itu — sebagai pelajaran legacy, bukan sebagai anjuran membangun klaster baru.",
      },
      reference: "File 1.024 MB, blok 128 MB, replikasi 3: 8 blok, 24 blok tersimpan, 3.072 MB mentah. NameNode: 1 juta blok memakai sekitar 150 MB memori.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca arsitektur legacy tanpa takut — dan memutuskan nasibnya dengan angka, bukan nostalgia atau gengsi.",
        "(1) Menjelaskan HDFS: blok, replikasi, NameNode, DataNode;",
        "(2) Menghitung jumlah blok, penyimpanan mentah, dan memori NameNode;",
        "(3) Menjelaskan MapReduce: map, shuffle, reduce — dan kenapa ia lambat;",
        "(4) Membandingkan Hadoop dengan lakehouse modern;",
        "(5) Merencanakan migrasi: baca dulu, pindah bertahap, matikan terakhir.",
      ],
      tasks: [],
    },
    {
      id: "hdfs",
      eyebrow: "Langkah 3 · Teori",
      title: "HDFS: file dipotong blok, disebar, digandakan",
      prose: [
        "HDFS memotong file menjadi blok — default 128 MB — lalu menyebar blok itu ke banyak DataNode dan menggandakannya, default replikasi 3. File 1.024 MB menjadi 8 blok; dengan replikasi 3, ada 24 salinan blok tersimpan dan penyimpanan mentah 3.072 MB. Replikasi membeli ketahanan: satu DataNode mati, salinan lain mengambil alih — tetapi membayar 3x penyimpanan.",
        "NameNode adalah otaknya: ia menyimpan metadata — file apa terdiri dari blok apa, di DataNode mana. DataNode adalah tangannya: menyimpan blok dan melayani baca tulis. NameNode menyimpan metadata di memori: sekitar 150 byte per blok, jadi 1 juta blok memakai sekitar 150 MB memori. Klaster yang tumbuh tanpa batas akhirnya menabrak memori NameNode — batas arsitektur yang paling sering mengejutkan tim yang mewarisi klaster tua.",
        "Bacanya cerdas: klien bertanya ke NameNode di mana blok berada, lalu membaca langsung dari DataNode terdekat — NameNode tidak menjadi bottleneck transfer data. Tulisnya hati-hati: blok ditulis ke satu DataNode lalu direplikasi berantai ke dua node lain, idealnya di rak yang berbeda supaya satu rak mati tidak mematikan semua salinan.",
      ],
      tasks: [],
      note: {
        title: "Kenapa replikasi 3, bukan 2 atau 5",
        body: "Replikasi 2 bertahan dari satu kegagalan node tetapi rapuh saat node kedua mati di tengah perbaikan yang pertama. Replikasi 3 bertahan dari dua kegagalan berurutan dengan harga penyimpanan 3x. Replikasi 5 hampir tidak pernah sepadan: biaya 5x untuk ketahanan yang nyaris tidak pernah dibutuhkan. Angka 3 adalah kompromi yang dihitung, bukan kebiasaan.",
      },
      reference: "Blok 128 MB, replikasi 3. NameNode sekitar 150 byte metadata per blok.",
    },
    {
      id: "mapreduce-migrasi",
      eyebrow: "Langkah 4 · Teori",
      title: "MapReduce dan kenapa ia kalah — lalu kapan migrasi",
      prose: [
        "MapReduce membawa komputasi ke data: fungsi map berjalan di node tempat blok berada, hasilnya di-shuffle lewat jaringan, lalu fungsi reduce menggabungkannya. Idenya brilian untuk 2004: pindah kode lebih murah dari pindah data. Batasnya: tiap tahap menulis hasil antara ke disk. Job bertingkat berarti baca-tulis disk berulang — dan di situlah Spark menang telak dengan komputasi di memori.",
        "Hadoop kalah bukan karena salah, melainkan karena zamannya berubah: penyimpanan objek murah, komputasi dan penyimpanan terpisah, dan format tabel terbuka memberi ACID tanpa NameNode. Tetapi klaster legacy tidak dimatikan dengan argumen zaman — ia dimatikan dengan rencana: inventarisasi workload yang masih jalan, migrasi baca dulu (query dialihkan ke lakehouse), pindah tulis bertahap, dan matikan terakhir setelah masa paralel berjalan tanpa insiden.",
        "Kapan membiarkan legacy hidup: arsip yang jarang dibaca, workload batch stabil yang biayanya sudah tenggelam, dan sistem yang terikat regulasi arsip. Kapan memigrasi: tim yang merawat tinggal satu orang, hardware mendekati akhir dukungan, atau biaya operasional melebihi biaya migrasi. Keputusan itu dihitung, bukan dirasakan.",
      ],
      tasks: [],
      reference: "MapReduce: komputasi dibawa ke data, tetapi hasil antara ditulis ke disk — Spark menang di memori. Migrasi: baca dulu, tulis bertahap, matikan terakhir.",
    },
    {
      id: "lab-hdfs",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung blok, replikasi, dan memori NameNode",
      prose: [
        "Lab ini menghitung aritmetika HDFS dari ukuran file, ukuran blok, faktor replikasi, dan jumlah blok di klaster.",
        "Hitung dulu di kepala. Blok: 1.024 dibagi 128 sama dengan 8 blok. Blok tersimpan: 8 dikali 3 sama dengan 24. Penyimpanan mentah: 1.024 dikali 3 sama dengan 3.072 MB. Memori NameNode: 1.000.000 blok dikali 150 byte sama dengan 150.000.000 byte, sama dengan 150 MB.",
        "Tugas lab: tulis fungsi yang menerima ukuran file, ukuran blok, replikasi, dan jumlah blok — lalu mencetak empat angka: blok, blok_tersimpan, penyimpanan_mb, namenode_mb.",
        "Setelah lolos, coba eksperimen: ubah replikasi menjadi 2 dan lihat penyimpanan turun menjadi 2.048 MB — lalu tanyakan: berapa harga ketahanan yang hilang itu?",
      ],
      tasks: [
        { id: "t1", text: "Hitung blok dan blok_tersimpan" },
        { id: "t2", text: "Hitung penyimpanan_mb mentah" },
        { id: "t3", text: "Hitung namenode_mb dari jumlah blok" },
      ],
      expected: "blok=8\nblok_tersimpan=24\npenyimpanan_mb=3072\nnamenode_mb=150",
      hints: [
        "Blok = ukuran file dibagi ukuran blok.",
        "Blok tersimpan = blok dikali replikasi.",
        "Memori NameNode = jumlah blok dikali 150 byte, dibagi 1.000.000 menjadi MB.",
      ],
      code: {
        starter: `# Arsip transaksi di HDFS: file, blok, replikasi, metadata.\nukuran_file_mb = 1024\nukuran_blok_mb = 128\nreplikasi = 3\njumlah_blok = 1000000\n\n# TULIS KODEMU: hitung blok, blok_tersimpan, penyimpanan_mb, namenode_mb.\n# Cetak, per baris: blok, blok_tersimpan, penyimpanan_mb, namenode_mb.\n\n\nmesin_hdfs(ukuran_file_mb, ukuran_blok_mb, replikasi, jumlah_blok)`,
        lockLines: 5,
        solution: `# Arsip transaksi di HDFS: file, blok, replikasi, metadata.\nukuran_file_mb = 1024\nukuran_blok_mb = 128\nreplikasi = 3\njumlah_blok = 1000000\n\n\ndef mesin_hdfs(ukuran_file_mb, ukuran_blok_mb, replikasi, jumlah_blok):\n    blok = ukuran_file_mb // ukuran_blok_mb\n    blok_tersimpan = blok * replikasi\n    penyimpanan_mb = ukuran_file_mb * replikasi\n    namenode_mb = jumlah_blok * 150 // 1000000\n    print(f"blok={blok}")\n    print(f"blok_tersimpan={blok_tersimpan}")\n    print(f"penyimpanan_mb={penyimpanan_mb}")\n    print(f"namenode_mb={namenode_mb}")\n\n\nmesin_hdfs(ukuran_file_mb, ukuran_blok_mb, replikasi, jumlah_blok)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "blok=8", label: "8 blok", msg: "1.024 / 128 = 8 blok." },
          { kind: "stdout_matches", task: "t1", pattern: "blok_tersimpan=24", label: "24 blok tersimpan", msg: "8 blok x replikasi 3 = 24 salinan blok." },
          { kind: "stdout_matches", task: "t2", pattern: "penyimpanan_mb=3072", label: "3.072 MB mentah", msg: "1.024 MB x 3 = 3.072 MB. Replikasi membayar 3x penyimpanan." },
          { kind: "stdout_matches", task: "t3", pattern: "namenode_mb=150", label: "NameNode 150 MB", msg: "1.000.000 blok x 150 byte = 150 MB metadata di memori." },
        ],
      },
      reference: "8 blok, 24 tersimpan, 3.072 MB mentah, NameNode 150 MB.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: mematikan klaster tanpa mematikan arsip",
      prose: [
        "Kembali ke Bank Artha Dana. Rencana migrasi disusun dalam tiga fase. Fase satu: inventarisasi — ternyata hanya 9 dari 47 job yang masih jalan tiap minggu; sisanya sudah mati tetapi tidak ada yang berani menghapusnya. Fase dua: baca dialihkan — query arsip dipindah ke lakehouse, klaster Hadoop hanya melayani 9 job itu. Fase tiga: setelah 6 bulan paralel tanpa insiden, 9 job dipindah dan klaster dimatikan.",
        "Biaya migrasi tertutup dalam 14 bulan dari penghematan operasional. Arsip 12 tahun tetap bisa dibaca — karena yang dipindah bukan hanya file, melainkan juga katalog metadata dan jejak lineage-nya.",
        "Keputusan rapat: legacy dimatikan bukan karena tua, melainkan karena aritmetikanya sudah tidak masuk akal — dan dimatikan terakhir, setelah penggantinya terbukti.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat migrasi ini berhasil. Pertama, inventarisasi jujur: 38 dari 47 job ternyata sudah mati. Kedua, masa paralel 6 bulan sebagai bukti, bukan janji. Ketiga, metadata dan lineage ikut pindah — file tanpa katalog adalah arsip yang tidak bisa ditemukan.",
      },
      reference: "9 dari 47 job masih aktif. Masa paralel 6 bulan. Biaya migrasi tertutup dalam 14 bulan.",
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
        "HDFS: file dipotong blok 128 MB, disebar ke DataNode, digandakan replikasi 3.",
        "Lab: 8 blok, 24 tersimpan, 3.072 MB mentah, NameNode 150 MB.",
        "NameNode menyimpan metadata di memori — sekitar 150 byte per blok.",
        "MapReduce lambat karena hasil antara ditulis ke disk tiap tahap.",
        "Migrasi: inventarisasi, alihkan baca, pindah tulis bertahap, matikan terakhir.",
      ],
      next: { label: "DE35 — Pola Ingest API dan ELT vs ETL: Dari Polling Sampai Load Dulu, Transform Kemudian", href: "/v2/learn/de35-ingest-api-elt-vs-etl" },
      quiz: [
        {
          q: "File 1.024 MB, blok 128 MB, replikasi 3. Berapa blok tersimpan dan penyimpanan mentah?",
          options: [
            { text: "8 blok tersimpan, 1.024 MB — replikasi tidak dihitung", why: "Salah: replikasi 3 berarti tiap blok punya 3 salinan; penyimpanan mentah adalah 3x ukuran file." },
            { text: "11 blok tersimpan, 3.072 MB", why: "Salah: 8 + 3 bukan cara menghitungnya — blok dikali replikasi, bukan ditambah." },
            { text: "24 blok tersimpan, 1.024 MB", why: "Salah: jumlah blok benar, tetapi penyimpanan mentah ikut dikali replikasi." },
            { text: "24 blok tersimpan, 3.072 MB", why: "Tepat: 1.024 / 128 = 8 blok; 8 x 3 = 24; 1.024 x 3 = 3.072 MB.", correct: true },
          ],
        },
        {
          q: "Klaster punya 1 juta blok. Berapa memori NameNode untuk metadata?",
          options: [
            { text: "150 MB — 1 juta dikali 150 byte", why: "Tepat: 1.000.000 x 150 byte = 150.000.000 byte = 150 MB.", correct: true },
            { text: "1 GB — metadata selalu 1 GB", why: "Salah: memori NameNode tumbuh sebanding jumlah blok, bukan angka tetap." },
            { text: "128 MB — sama dengan ukuran blok", why: "Salah: ukuran blok tidak menentukan memori metadata; jumlah blok yang menentukan." },
            { text: "Tidak ada — metadata disimpan di DataNode", why: "Salah: metadata disimpan NameNode di memori; DataNode menyimpan blok data." },
          ],
        },
        {
          q: "Kenapa MapReduce kalah dari Spark untuk job bertingkat?",
          options: [
            { text: "MapReduce tidak bisa membaca dari HDFS", why: "Salah: MapReduce justru dirancang membaca dari HDFS di node tempat blok berada." },
            { text: "Tiap tahap MapReduce menulis hasil antara ke disk", why: "Tepat: baca-tulis disk berulang di tiap tahap; Spark menyimpan hasil antara di memori.", correct: true },
            { text: "MapReduce tidak mendukung fungsi reduce", why: "Salah: reduce adalah setengah dari namanya — MapReduce adalah map lalu reduce." },
            { text: "MapReduce hanya jalan di satu node", why: "Salah: MapReduce terdistribusi ke banyak node; itulah inti desainnya." },
          ],
        },
        {
          q: "Kapan klaster Hadoop legacy sebaiknya DIBIARKAN hidup?",
          options: [
            { text: "Selalu — legacy tidak boleh dimatikan", why: "Salah: legacy yang biayanya melebihi manfaat dan tinggal satu orang yang merawat harus dimigrasi." },
            { text: "Saat hardware mendekati akhir dukungan dan tim tinggal satu orang", why: "Salah: itu justru sinyal migrasi — risiko operasionalnya sudah terlalu tinggi." },
            { text: "Arsip jarang dibaca dengan biaya sudah tenggelam dan workload stabil", why: "Tepat: bila arsip jarang dibaca dan biaya operasional kecil, migrasi bisa lebih mahal dari manfaatnya.", correct: true },
            { text: "Saat ada teknologi baru apa pun yang muncul", why: "Salah: teknologi baru saja bukan alasan migrasi; aritmetika biaya dan risiko yang menentukan." },
          ],
        },
        {
          q: "Urutan migrasi keluar Hadoop yang benar?",
          options: [
            { text: "Matikan dulu, pindah kemudian — supaya tim terpaksa", why: "Salah: mematikan dulu berarti arsip tidak bisa dibaca selama migrasi; risikonya tidak dapat diterima." },
            { text: "Pindah semua job sekaligus dalam satu akhir pekan", why: "Salah: big-bang migration menumpuk semua risiko di satu jendela; kegagalan berarti seluruh platform mati." },
            { text: "Salin file saja — metadata dan lineage tidak penting", why: "Salah: file tanpa katalog adalah arsip yang tidak bisa ditemukan; lineage adalah jejak auditnya." },
            { text: "Inventarisasi, alihkan baca, pindah tulis bertahap, matikan terakhir setelah masa paralel", why: "Tepat: tiap langkah bisa dibatalkan; pematian adalah langkah terakhir setelah pengganti terbukti.", correct: true },
          ],
        },
      ],
    },
  ],
};

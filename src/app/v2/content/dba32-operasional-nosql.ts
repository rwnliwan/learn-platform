import type { V2Lesson } from "../lib/types";

export const dba32: V2Lesson = {
  slug: "dba32-operasional-nosql",
  track: "Database Administrator",
  module: "Skala & Cloud",
  title: "DBA32 — Operasional NoSQL: Replikasi dan Sharding MongoDB, Admin Cassandra",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Primary MongoDB mati saat flash sale",
      prose: [
        "Flash sale KirimCepat jam 20:00. Primary MongoDB mati — disk penuh. Replica set memilih primary baru dalam 12 detik, dan aplikasi yang memakai write concern majority tetap menulis dengan aman. Tetapi satu layanan lama memakai write concern 1: tulisannya diakui sebelum direplikasi, dan 340 order hilang saat primary lama mati — order yang dibayar pelanggan tetapi tidak tercatat.",
        "Di klaster Cassandra yang lain, tim menemukan satu node menampung 50 persen data sementara 5 node lain berbagi sisanya — token range tidak seimbang sejak penambahan node yang tidak di-rebalance. Hot node itu lambat, dan seluruh klaster ikut lambat.",
        "Lesson ini mengajarkan operasional NoSQL: replica set dan sharding MongoDB, serta administrasi Cassandra. Setelah lesson ini kamu bisa: (1) menjelaskan write concern dan read concern; (2) menghitung mayoritas dan distribusi shard; (3) memilih shard key yang tidak hot; (4) menjalankan repair dan compaction Cassandra; (5) merencanakan failover dan rebalance.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DBA19 mengajarkan model NoSQL secara konseptual (dokumen, wide-column, kapan relasional tidak cocok) dan DBA9 menyebut sharding sebagai pilihan terakhir secara umum. Tidak ada lesson operasional: write concern, pemilihan primary, shard key, token range, repair, dan compaction. Lesson ini membangun lapisan operasional itu.",
      },
      reference: "Replica set 3 node: mayoritas 2. 8 juta dokumen di 4 shard: 2 juta per shard. Cassandra RF 3 di 6 node: tiap node menampung 50 persen data.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengoperasikan klaster NoSQL tanpa kehilangan tulis saat node mati — dan tanpa satu node menanggung separuh klaster.",
        "(1) Menjelaskan replica set: pemilihan primary, mayoritas, dan failover;",
        "(2) Menghitung write concern majority dan risikonya bila memakai 1;",
        "(3) Memilih shard key dan menghitung distribusi per shard;",
        "(4) Menjelaskan token range, replication factor, dan repair Cassandra;",
        "(5) Menjadwalkan compaction dan rebalance sebagai pekerjaan rutin.",
      ],
      tasks: [],
    },
    {
      id: "mongodb",
      eyebrow: "Langkah 3 · Teori",
      title: "MongoDB: replica set, write concern, sharding",
      prose: [
        "Replica set adalah 3 node atau lebih: satu primary menerima tulis, sisanya secondary mereplikasi. Bila primary mati, secondary yang tersisa memilih primary baru — butuh mayoritas: dari 3 node, mayoritas adalah 2. Tanpa mayoritas, klaster tidak memilih primary baru dan tulis berhenti — itulah harga konsistensi.",
        "Write concern menentukan berapa node harus mengakui tulis sebelum aplikasi lanjut. Write concern 1: hanya primary — cepat, tetapi tulis bisa hilang bila primary mati sebelum replikasi (340 order di cerita pembuka). Write concern majority: mayoritas node — lebih lambat sedikit, tetapi tulis yang diakui tidak hilang saat satu node mati. Aturan: data yang dibayar pelanggan memakai majority; log dan metrik boleh memakai 1.",
        "Sharding membagi koleksi ke banyak shard menurut shard key. 8 juta dokumen di 4 shard berarti 2 juta per shard — bila key-nya tersebar merata. Shard key yang buruk adalah key monotonik (misalnya timestamp naik): semua tulis baru mendarat di satu shard — hot shard — sementara shard lain menganggur. Shard key yang baik punya kardinalitas tinggi dan tersebar: hashed user_id, bukan tanggal. Sejak MongoDB 5.0, shard key BISA diubah lewat reshardCollection (dan disempurnakan lewat refineShardKey) — tetapi biayanya mahal: resharding memindahkan data, memakan sumber daya, dan bisa mengganggu beban — jadi pilihlah dengan hati-hati sejak awal, bukan karena 'tidak bisa diubah'.",
      ],
      tasks: [],
      note: {
        title: "Read concern majority MENGURANGI — bukan menghilangkan — baca basi",
        body: "Write concern majority tanpa read concern majority masih bisa membaca data basi dari secondary yang tertinggal. Tetapi pasangan tulis-majority plus baca-majority pun masih bisa mengembalikan data yang tertinggal dari tulis terbaru yang sudah diakui: snapshot majority yang dibaca bisa tertinggal dari titik commit terbaru. Yang menjamin kebaruan adalah read concern linearizable — mahal, hanya dari primary, dan bukan default. Untuk saldo dan status order, pakai majority dan sadari batasnya; untuk dashboard agregat, baca secondary boleh — basi beberapa detik tidak mengubah keputusan.",
      },
      reference: "Mayoritas dari 3 node adalah 2. Write concern 1: cepat, bisa hilang. Majority: tulis yang diakui bertahan. Shard key monotonik membuat hot shard.",
    },
    {
      id: "cassandra",
      eyebrow: "Langkah 4 · Teori",
      title: "Cassandra: token range, replication factor, repair",
      prose: [
        "Cassandra membagi data ke token range: tiap node memiliki rentang token, dan baris ditempatkan menurut hash kunci partisinya. Replication factor (RF) 3 di 6 node berarti tiap baris punya 3 salinan di 3 node — dan RATA-RATA tiap node menampung 3 dari 6 bagian data, sama dengan 50 persen, bila token range seimbang dan ukuran node sebanding. Itu rata-rata ideal, bukan jaminan per node — cerita pembuka sendiri menunjukkan satu node bisa menampung 50 persen sementara sisanya berbagi separuh. Tambah node tanpa rebalance berarti token range tidak seimbang: node baru men-stream hanya sebagian kecil data (bootstrap men-stream rentang tokennya dari node lama), dan node lama tetap penuh — persis hot node di cerita pembuka.",
        "Repair adalah pekerjaan wajib: node yang mati sementara lalu kembali membawa data basi; repair membandingkan dan menyinkronkan salinan. Tanpa repair terjadwal, baca dengan konsistensi rendah bisa mengembalikan data lama yang sudah dihapus — zombie data. Jadwalkan repair tiap minggu untuk data yang sering di-update, dan pantau repair yang tidak pernah selesai sebagai alarm. Aturan yang mengikat jadwal ini ke keselamatan: seluruh rentang data harus berhasil di-repair dalam gc_grace_seconds (default 10 hari) — bila sebuah node mati lebih lama dari itu tanpa repair, data yang sudah dihapus bisa bangkit kembali (resurrected deletes) karena tombstone-nya kedaluwarsa sebelum semua salinan sempat disinkronkan. Repair mingguan muat dalam jendela 10 hari; outage panjang plus repair yang lambat adalah kombinasi yang berbahaya. Aturan yang mengikat jadwal ini ke keselamatan: seluruh rentang data harus berhasil di-repair dalam gc_grace_seconds (default 10 hari) — bila sebuah node mati lebih lama dari itu tanpa repair, data yang sudah dihapus bisa bangkit kembali (resurrected deletes) karena tombstone-nya kedaluwarsa sebelum semua salinan sempat disinkronkan. Repair mingguan muat dalam jendela 10 hari; outage panjang plus repair yang lambat adalah kombinasi yang berbahaya. Aturan yang mengikat jadwal ini ke keselamatan: seluruh rentang data harus berhasil di-repair dalam gc_grace_seconds (default 10 hari) — bila sebuah node mati lebih lama dari itu tanpa repair, data yang sudah dihapus bisa bangkit kembali (resurrected deletes) karena tombstone-nya kedaluwarsa sebelum semua salinan sempat disinkronkan. Repair mingguan muat dalam jendela 10 hari; outage panjang plus repair yang lambat adalah kombinasi yang berbahaya.",
        "Compaction menggabungkan SSTable dan membuang data yang sudah dihapus (tombstone). Tanpa compaction, baca harus memindai banyak file dan tombstone menumpuk — query melambat bertahap. Pilih strategi compaction dari pola beban: SizeTiered untuk tulis berat, Leveled untuk baca berat. Dan ingat: DELETE di Cassandra tidak menghapus langsung — ia menulis tombstone yang baru hilang setelah compaction dan masa grace.",
      ],
      tasks: [],
      reference: "RF 3 di 6 node: RATA-RATA 50 persen per node bila seimbang. Repair mingguan (dalam gc_grace_seconds 10 hari) mencegah zombie data. DELETE menulis tombstone; compaction yang menghapusnya.",
    },
    {
      id: "lab-nosql",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung mayoritas, shard, dan beban node",
      prose: [
        "Lab ini menghitung tiga angka operasional NoSQL dari ukuran klaster.",
        "Hitung dulu di kepala. Mayoritas replica set 3 node: floor(3/2) + 1 sama dengan 2 — rumus umumnya floor(n/2) + 1, bukan ceil(n/2): untuk 4 node, mayoritas ketat adalah 3, bukan 2. Per shard: 8.000.000 dibagi 4 sama dengan 2.000.000 dokumen. Beban node Cassandra: RF 3 dibagi 6 node dikali 100 sama dengan 50 persen — rata-rata, bila token range seimbang.",
        "Tugas lab: tulis fungsi yang menerima jumlah node replica set, total dokumen, jumlah shard, RF, dan total node Cassandra — lalu mencetak tiga angka: mayoritas, per_shard, persen_per_node.",
        "Setelah lolos, coba eksperimen: ubah replica set menjadi 5 node dan lihat mayoritas menjadi 3 — klaster 5 node bertahan dari 2 kegagalan, bukan 1.",
      ],
      tasks: [
        { id: "t1", text: "Hitung mayoritas replica set" },
        { id: "t2", text: "Hitung per_shard dari total dokumen" },
        { id: "t3", text: "Hitung persen_per_node Cassandra" },
      ],
      expected: "mayoritas=2\nper_shard=2000000\npersen_per_node=50",
      hints: [
        "Mayoritas ketat = floor(jumlah node / 2) + 1 — untuk 4 node hasilnya 3, bukan 2.",
        "Per shard = total dokumen dibagi jumlah shard.",
        "Persen per node = RF dibagi total node, dikali 100.",
      ],
      code: {
        starter: `# Klaster NoSQL KirimCepat: replica set, shard, Cassandra.\nnode_replica = 3\ntotal_dokumen = 8000000\njumlah_shard = 4\nrf = 3\nnode_cassandra = 6\n\n# TULIS KODEMU: hitung mayoritas, per_shard, persen_per_node.\n# Cetak, per baris: mayoritas, per_shard, persen_per_node.\n\n\nmesin_nosql(node_replica, total_dokumen, jumlah_shard, rf, node_cassandra)`,
        lockLines: 6,
        solution: `# Klaster NoSQL KirimCepat: replica set, shard, Cassandra.\nnode_replica = 3\ntotal_dokumen = 8000000\njumlah_shard = 4\nrf = 3\nnode_cassandra = 6\n\n\ndef mesin_nosql(node_replica, total_dokumen, jumlah_shard, rf, node_cassandra):\n    mayoritas = node_replica // 2 + 1\n    per_shard = total_dokumen // jumlah_shard\n    persen_per_node = rf * 100 // node_cassandra\n    print(f"mayoritas={mayoritas}")\n    print(f"per_shard={per_shard}")\n    print(f"persen_per_node={persen_per_node}")\n\n\nmesin_nosql(node_replica, total_dokumen, jumlah_shard, rf, node_cassandra)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "mayoritas=2", label: "Mayoritas 2 dari 3", msg: "3 // 2 + 1 = 2. Tanpa 2 node, tidak ada primary baru." },
          { kind: "stdout_matches", task: "t2", pattern: "per_shard=2000000", label: "2 juta per shard", msg: "8.000.000 / 4 = 2.000.000 — bila shard key tersebar merata." },
          { kind: "stdout_matches", task: "t3", pattern: "persen_per_node=50", label: "50 persen per node", msg: "RF 3 / 6 node = 50 persen data di tiap node — RATA-RATA bila token range seimbang, bukan jaminan per node." },
        ],
      },
      reference: "Mayoritas 2, per shard 2.000.000, per node 50 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: 340 order yang hilang dan node yang menanggung separuh klaster",
      prose: [
        "Kembali ke KirimCepat. Dua perbaikan diterapkan. Satu: layanan lama dipindah ke write concern majority — tulis yang dibayar pelanggan tidak lagi diakui sebelum mayoritas node menyimpannya. Uji failover dijadwalkan tiap bulan: primary dimatikan sengaja, dan tim mengukur berapa detik pemilihan primary baru plus berapa tulis yang hilang (target: nol).",
        "Dua: klaster Cassandra di-rebalance setelah penambahan node, dan token range dipantau di dashboard — selisih beban antar node di atas 20 persen memicu alert. Repair mingguan dan compaction dijadwalkan; repair yang tidak selesai dalam 7 hari menjadi insiden, bukan catatan.",
        "Keputusan rapat: tidak ada layanan baru yang memakai write concern 1 untuk data transaksional — pengecualian harus disetujui DBA dengan alasan tertulis. Shard key baru wajib lolos review distribusi sebelum koleksi di-shard.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini bertahan. Pertama, write concern diputuskan dari nilai data, bukan dari kecepatan. Kedua, failover diuji dengan mematikan primary sengaja — bukan ditunggu mati sendiri. Ketiga, keseimbangan beban dipantau sebagai metrik, bukan ditemukan saat sudah lambat.",
      },
      reference: "Write concern majority untuk data berbayar; uji failover bulanan; alert bila selisih beban antar node di atas 20 persen.",
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
        "Lab: mayoritas 2 dari 3 (rumus floor(n/2)+1); 2 juta dokumen per shard; 50 persen data per node Cassandra (rata-rata bila seimbang).",
        "Write concern 1 cepat tetapi tulis bisa hilang; majority melindungi tulis yang diakui.",
        "Shard key monotonik membuat hot shard; pilih key berkardinalitas tinggi dan tersebar.",
        "RF 3 di 6 node: rata-rata 50 persen data per node bila seimbang; tambah node wajib rebalance.",
        "Repair mingguan mencegah zombie data; DELETE menulis tombstone, compaction menghapusnya.",
      ],
      next: { label: "DBA33 — Data Pump, SQL*Loader, dan Flashback: Pindah dan Kembalikan Data Oracle", href: "/v2/learn/dba33-data-pump-sqlloader-flashback" },
      quiz: [
        {
          q: "Replica set 3 node, 8 juta dokumen di 4 shard, Cassandra RF 3 di 6 node. Berapa mayoritas, per shard, dan persen per node?",
          options: [
            { text: "Mayoritas 3, per shard 2.000.000, per node 50 persen", why: "Salah: mayoritas dari 3 bukan 3 — mayoritas adalah setengah dibulatkan ke atas, yaitu 2." },
            { text: "Mayoritas 2, per shard 4.000.000, per node 50 persen", why: "Salah: 8.000.000 / 4 = 2.000.000, bukan 4.000.000." },
            { text: "Mayoritas 2, per shard 2.000.000, per node 33 persen", why: "Salah: 3 / 6 = 50 persen, bukan 33 persen." },
            { text: "Mayoritas 2, per shard 2.000.000, per node 50 persen", why: "Tepat: 3 // 2 + 1 = 2; 8.000.000 / 4 = 2.000.000; 3 / 6 = 50 persen.", correct: true },
          ],
        },
        {
          q: "340 order hilang saat primary mati. Apa penyebabnya?",
          options: [
            { text: "Write concern 1: tulis diakui primary saja, hilang sebelum replikasi", why: "Tepat: tulis yang hanya diakui primary lenyap bila primary mati sebelum mereplikasi.", correct: true },
            { text: "Replica set tidak punya secondary", why: "Salah: secondary ada — masalahnya tulis diakui sebelum direplikasi." },
            { text: "Shard key yang buruk", why: "Salah: shard key memengaruhi distribusi, bukan kehilangan tulis saat failover." },
            { text: "Compaction yang tidak terjadwal", why: "Salah: compaction memengaruhi kecepatan baca Cassandra, bukan kehilangan tulis MongoDB." },
          ],
        },
        {
          q: "Shard key apa yang paling berbahaya?",
          options: [
            { text: "Hashed user_id — tersebar merata", why: "Salah: itu justru shard key yang baik — kardinalitas tinggi dan tersebar." },
            { text: "Timestamp yang selalu naik — semua tulis baru ke satu shard", why: "Tepat: key monotonik menciptakan hot shard; shard lain menganggur.", correct: true },
            { text: "Kode negara dengan 200 nilai", why: "Salah: kardinalitas 200 masih bisa tersebar — tidak ideal tetapi bukan yang terburuk." },
            { text: "UUID acak", why: "Salah: UUID acak tersebar sangat merata — hanya buruk untuk query rentang." },
          ],
        },
        {
          q: "Node Cassandra baru ditambahkan tetapi beban tidak berubah. Apa yang terjadi?",
          options: [
            { text: "Node baru otomatis mengambil separuh data", why: "Salah: node baru men-stream sebagian data lewat bootstrap, tetapi bila token range-nya kecil/tidak seimbang, bebannya tetap timpang — perlu rebalance." },
            { text: "Replication factor otomatis turun", why: "Salah: RF tidak berubah karena tambah node." },
            { text: "Token range tidak seimbang — node baru hanya men-stream sebagian kecil, node lama tetap penuh", why: "Tepat: bootstrap men-stream data ke node baru, tetapi tanpa rebalance yang seimbang bebannya tetap timpang.", correct: true },
            { text: "Data otomatis terhapus di node lama", why: "Salah: tidak ada yang terhapus — justru tidak ada yang pindah." },
          ],
        },
        {
          q: "Kenapa repair terjadwal wajib di Cassandra?",
          options: [
            { text: "Untuk mempercepat tulis", why: "Salah: repair adalah sinkronisasi salinan, bukan optimasi tulis." },
            { text: "Untuk menghemat ruang disk", why: "Salah: menghemat ruang adalah tugas compaction, bukan repair." },
            { text: "Untuk mengganti shard key", why: "Salah: shard key BISA diubah lewat reshardCollection sejak MongoDB 5.0 — hanya saja mahal; repair bukan caranya.", correct: false },
            { text: "Node yang kembali setelah mati membawa data basi; tanpa repair, baca bisa mengembalikan data yang sudah dihapus", why: "Tepat: itulah zombie data — repair menyinkronkan salinan sebelum basi dibaca.", correct: true },
          ],
        },
      ],
    },
  ],
};

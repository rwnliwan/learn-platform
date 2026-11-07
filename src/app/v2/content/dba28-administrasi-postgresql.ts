import type { V2Lesson } from "../lib/types";

export const dba28: V2Lesson = {
  slug: "dba28-administrasi-postgresql",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA28 — Administrasi PostgreSQL: WAL, VACUUM, dan pg_stat",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Disk penuh jam 3 pagi: WAL yang tidak terarsip dan tabel yang menggembung",
      prose: [
        "Pukul 03.00, pager DBA berbunyi: disk database PostgreSQL tinggal 2 persen. Dua masalah tiba bersamaan. Pertama, pengarsipan WAL gagal sejak enam jam lalu — file WAL menumpuk karena tidak ada yang memindahkannya ke arsip, dan tiap file 16 MB itu bertambah tanpa henti. Kedua, tabel pesanan 100 GB ternyata hanya berisi 30 GB data hidup — 70 GB sisanya baris mati yang belum di-vacuum.",
        "Malam itu DBA belajar dua pelajaran yang tidak pernah lupa: WAL adalah nyawa recovery tetapi juga bom disk bila arsipnya macet, dan autovacuum yang tertinggal adalah utang yang dibayar dengan downtime. Lesson ini mengajarkan administrasi PostgreSQL khusus — mesin yang paling sering dipakai di Learn dan di banyak perusahaan Indonesia.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan WAL, checkpoint, dan point-in-time recovery; (2) menghitung kebutuhan disk WAL dari laju transaksi; (3) mengatur autovacuum agar tidak pernah tertinggal; (4) membaca keluarga pg_stat untuk diagnosis; (5) mengenali bahaya transaction ID wraparound sebelum ia mematikan database.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "VACUUM dan pg_stat sudah disinggung di DBA6 (sebagai bagian dari lesson indeks), DBA8 (pg_stat_statements sebagai alat monitoring), dan DBA3 (autovacuum di checklist instalasi). Lesson ini TIDAK mengulang singgungan itu: ia membangun administrasi PostgreSQL sebagai satu sistem — WAL dan checkpoint, tuning autovacuum per tabel, wraparound XID, dan keluarga pg_stat sebagai alat diagnosis harian.",
      },
      reference: "WAL gagal arsip 6 jam + tabel 100 GB berisi 30 GB data hidup = pager jam 3 pagi.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengoperasikan PostgreSQL produksi dan membaca tanda-tanda bahayanya sebelum pager berbunyi.",
        "(1) Menjelaskan rantai WAL, checkpoint, dan arsip untuk point-in-time recovery;",
        "(2) Menghitung produksi WAL per hari dan kebutuhan disk arsip dari laju transaksi;",
        "(3) Menyetel autovacuum per tabel dari ambang dan skala faktornya;",
        "(4) Membaca pg_stat_user_tables, pg_stat_statements, dan pg_stat_activity untuk diagnosis;",
        "(5) Menjelaskan transaction ID wraparound dan peran VACUUM FREEZE.",
      ],
      tasks: [],
    },
    {
      id: "wal",
      eyebrow: "Langkah 3 · Teori",
      title: "WAL dan checkpoint: nyawa recovery PostgreSQL",
      prose: [
        "WAL — Write-Ahead Log — adalah aturan pertama PostgreSQL: setiap perubahan ditulis dulu ke log berurutan sebelum halaman datanya diubah. Bila listrik padam, PostgreSQL memutar ulang WAL saat start dan mengembalikan semua transaksi yang sudah commit. Tanpa WAL, commit adalah janji tanpa bukti.",
        "WAL disimpan dalam segmen 16 MB. Checkpoint adalah momen ketika semua halaman kotor ditulis ke disk dan WAL lama boleh didaur ulang. Dua parameter mengendalikan checkpoint: checkpoint_timeout (waktu) dan max_wal_size (ukuran). Checkpoint yang terlalu jarang berarti recovery yang lama — makin banyak WAL yang harus diputar ulang. Checkpoint yang terlalu sering berarti tulis berulang yang membebani disk. Nilai yang sehat untuk beban tulis sedang: checkpoint setiap 5 sampai 15 menit.",
        "Pengarsipan WAL adalah yang memisahkan backup biasa dari point-in-time recovery. Dengan archive_mode menyala dan archive_command yang bekerja, tiap segmen WAL disalin ke arsip saat penuh. Restore-nya: kembalikan base backup, lalu putar arsip WAL sampai detik yang diminta — database kembali ke keadaan pukul 14.32, bukan hanya ke keadaan backup semalam. Bila archive_command gagal, segmen menumpuk di pg_wal — persis seperti cerita pembuka — dan disk penuh mematikan database lebih cepat daripada kehilangan data itu sendiri.",
        "Hitungan kasar dari cerita pembuka: 2.400 transaksi per menit, tiap transaksi rata-rata 4 KB WAL. Per menit: 2.400 dikali 4 sama dengan 9.600 KB. Per jam: 9.600 dikali 60 sama dengan 576.000 KB, sama dengan 576 MB. Per hari: 576 dikali 24 sama dengan 13.824 MB. Arsip 24 jam butuh 13.824 MB — sekitar 13,2 GiB — dan arsip 7 hari butuh sekitar 92,4 GiB. Bila arsip gagal 6 jam, WAL menumpuk 6 dikali 576 sama dengan 3.456 MB — cukup untuk menghabiskan sisa disk yang hanya 4.000 MB. Hitungan ini adalah yang DBA bawa ke rapat kapasitas: bukan firasat, melainkan perkalian.",
      ],
      tasks: [],
      note: {
        title: "Disk terpisah untuk WAL",
        body: "DBA3 sudah mengajarkan: data, WAL, dan backup di disk atau volume terpisah. Alasannya di sini menjadi nyata: disk data yang penuh tidak boleh membunuh WAL, dan WAL yang menumpuk tidak boleh membunuh data. Pemisahan ini adalah satu baris konfigurasi infrastruktur yang menyelamatkan database di malam insiden.",
      },
      reference: "2.400 transaksi per menit dikali 4 KB = 9.600 KB per menit; 576 MB per jam; 13.824 MB per hari.",
    },
    {
      id: "vacuum",
      eyebrow: "Langkah 4 · Teori",
      title: "VACUUM, autovacuum, dan bloat",
      prose: [
        "PostgreSQL memakai MVCC: setiap UPDATE atau DELETE meninggalkan baris mati (dead tuple). VACUUM membersihkan baris mati, memperbarui visibility map — peta yang memungkinkan index-only scan tanpa menyentuh heap — dan membekukan transaction ID tua. Autovacuum melakukannya otomatis, dipicu bila jumlah baris mati melewati ambang: 50 baris ditambah 20 persen dari jumlah baris tabel. Untuk tabel 60.000.000 baris, ambangnya 50 ditambah 12.000.000 sama dengan 12.000.050 baris mati.",
        "Ambang default itu berbahaya untuk tabel tulis-berat. Tabel 60.000.000 baris dengan 18.000.000 baris mati sudah 30 persen mati — tetapi autovacuum baru jalan setelah 12.000.050. Selama menunggu, tabel menggembung: 30 GB data hidup menempati 100 GB disk — bloat 70 GB, sama dengan 70 persen dari ukuran tabel. Planner membaca halaman sampah, index-only scan gagal karena visibility map basi, dan query melambat tanpa satu pun query yang berubah. Solusinya: setel autovacuum_vacuum_scale_factor per tabel — 0,02 atau 0,01 untuk tabel panas — dan naikkan maintenance_work_mem agar vacuum bekerja lebih cepat.",
        "VACUUM biasa tidak mengembalikan ruang ke sistem operasi; ia hanya menandai halaman kosong untuk dipakai ulang. VACUUM FULL mengembalikan ruang — tetapi mengunci tabel secara eksklusif selama proses. Di tabel produksi, VACUUM FULL adalah downtime terencana, bukan perintah iseng. Alternatif tanpa lock penuh: pg_repack, yang membangun ulang tabel di belakang layar. Aturan operasional: bloat di atas 20 persen pada tabel besar adalah alert; autovacuum yang tidak jalan lebih dari 1 jam pada tabel panas adalah insiden yang sedang menunggu giliran.",
        "Bahaya terbesar yang jarang dibicarakan: transaction ID wraparound. Transaction ID PostgreSQL berputar setelah sekitar 2,1 miliar transaksi. Bila sebuah tabel tidak pernah di-vacuum sampai ID-nya mendekati batas, PostgreSQL memaksa shutdown untuk melindungi data — database berhenti total. VACUUM FREEZE membekukan ID tua sehingga putaran aman. Pantau umur transaksi tertua di pg_stat_activity dan datfrozenxid — bila angkanya mendekati 2 miliar, itu pager yang belum berbunyi.",
      ],
      tasks: [],
      note: {
        title: "ANALYZE setelah bulk load",
        body: "VACUUM membersihkan; ANALYZE memperbarui statistik planner. Setelah bulk load jutaan baris, statistik basi membuat planner memilih rencana yang salah — seq scan di tabel yang sebenarnya punya indeks bagus. Autovacuum menjalankan ANALYZE juga, tetapi setelah bulk load, jalankan ANALYZE manual. Biayanya detik; hematnya jam.",
      },
      reference: "Ambang autovacuum: 50 + 20 persen baris. Bloat 70 GB dari 100 GB = 70 persen. Wraparound di 2,1 miliar transaksi.",
    },
    {
      id: "lab-wal",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: kalkulator WAL, bloat, dan ambang autovacuum",
      prose: [
        "Lab ini membangun kalkulator administrasi PostgreSQL: produksi WAL per hari, persentase bloat, persentase baris mati, dan ambang autovacuum.",
        "Hitung dulu di kepala. WAL: 2.400 transaksi per menit dikali 4 KB sama dengan 9.600 KB per menit; dikali 1.440 menit sehari sama dengan 13.824.000 KB; dibagi 1.000 sama dengan 13.824,0 MB per hari. Bloat: tabel 100 GB dengan 30 GB data hidup — selisih 70 GB dibagi 100 dikali 100 sama dengan 70,0 persen. Baris mati: 18.000.000 dari 60.000.000 sama dengan 30,0 persen. Ambang autovacuum: 50 ditambah 0,2 dikali 60.000.000 sama dengan 12.000.050 baris mati.",
        "Tugas lab: tulis fungsi yang menerima laju transaksi, ukuran WAL per transaksi, ukuran tabel, data hidup, jumlah baris, dan baris mati — lalu mencetak empat angka: wal_hari_mb, bloat_persen, dead_persen, autovacuum_trigger. Keempat angka ini adalah dasbor mini DBA: satu untuk kapasitas, satu untuk kebersihan, satu untuk ambang.",
        "Setelah lolos, coba eksperimen: ubah scale factor menjadi 0,02 untuk tabel panas dan hitung ambang barunya — 50 ditambah 1.200.000 sama dengan 1.200.050, sepuluh kali lebih cepat terpicu. Lalu tanyakan: kenapa tidak setel 0,01 untuk semua tabel? Jawabannya: vacuum yang terlalu sering pada tabel kecil membuang CPU untuk pekerjaan yang tidak perlu — tuning adalah soal proporsi, bukan soal maksimum.",
      ],
      tasks: [
        { id: "t1", text: "Hitung produksi WAL per hari dalam MB dari laju transaksi" },
        { id: "t2", text: "Hitung persen bloat dan persen baris mati" },
        { id: "t3", text: "Hitung ambang autovacuum dari jumlah baris tabel" },
      ],
      expected: "wal_hari_mb=13824.0\nbloat_persen=70.0\ndead_persen=30.0\nautovacuum_trigger=12000050",
      hints: [
        "WAL per menit = transaksi per menit dikali KB per transaksi; sehari = 1.440 menit; MB desimal = KB dibagi 1.000.",
        "Bloat persen = (ukuran tabel dikurangi data hidup) dibagi ukuran tabel, dikali 100.",
        "Dead persen = baris mati dibagi total baris, dikali 100.",
        "Ambang = 50 + 0,2 dikali jumlah baris.",
      ],
      code: {
        starter: `# Data administrasi PostgreSQL: laju transaksi, ukuran tabel, baris mati.\ntpm = 2400  # transaksi per menit\nwal_kb = 4  # KB WAL per transaksi\nukuran_gb = 100\ndata_hidup_gb = 30\nbaris_total = 60000000\nbaris_mati = 18000000\n\n# TULIS KODEMU: hitung empat angka administrasi di bawah ini.\n# Cetak, per baris: wal_hari_mb, bloat_persen, dead_persen, autovacuum_trigger.\n\n\nkalkulator_pg(tpm, wal_kb, ukuran_gb, data_hidup_gb, baris_total, baris_mati)`,
        lockLines: 7,
        solution: `# Data administrasi PostgreSQL: laju transaksi, ukuran tabel, baris mati.\ntpm = 2400  # transaksi per menit\nwal_kb = 4  # KB WAL per transaksi\nukuran_gb = 100\ndata_hidup_gb = 30\nbaris_total = 60000000\nbaris_mati = 18000000\n\n\ndef kalkulator_pg(tpm, wal_kb, ukuran_gb, data_hidup_gb, baris_total, baris_mati):\n    wal_hari_mb = tpm * wal_kb * 1440 / 1000\n    bloat_persen = (ukuran_gb - data_hidup_gb) / ukuran_gb * 100\n    dead_persen = baris_mati / baris_total * 100\n    autovacuum_trigger = int(50 + 0.2 * baris_total)\n    print(f"wal_hari_mb={wal_hari_mb}")\n    print(f"bloat_persen={bloat_persen}")\n    print(f"dead_persen={dead_persen}")\n    print(f"autovacuum_trigger={autovacuum_trigger}")\n\n\nkalkulator_pg(tpm, wal_kb, ukuran_gb, data_hidup_gb, baris_total, baris_mati)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "wal_hari_mb=13824.0", label: "WAL 13.824,0 MB per hari", msg: "2.400 x 4 x 1.440 / 1.000 = 13.824,0 MB. Arsip 7 hari butuh sekitar 92,4 GiB." },
          { kind: "stdout_matches", task: "t2", pattern: "bloat_persen=70.0", label: "Bloat 70,0 persen", msg: "(100 - 30) / 100 x 100 = 70,0. Tiga perempat tabel adalah sampah." },
          { kind: "stdout_matches", task: "t2", pattern: "dead_persen=30.0", label: "Baris mati 30,0 persen", msg: "18.000.000 / 60.000.000 x 100 = 30,0. Ambang default 12.000.050 sudah terlewati." },
          { kind: "stdout_matches", task: "t3", pattern: "autovacuum_trigger=12000050", label: "Ambang autovacuum 12.000.050", msg: "50 + 0,2 x 60.000.000 = 12.000.050. Untuk tabel panas, turunkan scale factor per tabel." },
        ],
      },
      reference: "WAL 13.824,0 MB per hari; bloat 70,0 persen; baris mati 30,0 persen; ambang autovacuum 12.000.050.",
    },
    {
      id: "pgstat",
      eyebrow: "Langkah 6 · Teori",
      title: "Keluarga pg_stat: mata DBA di dalam database",
      prose: [
        "Diagnosis PostgreSQL dimulai dari tiga view. pg_stat_user_tables menunjukkan kesehatan tiap tabel: n_dead_tup (baris mati saat ini), last_autovacuum (kapan terakhir dibersihkan), dan seq_scan versus idx_scan (apakah tabel dibaca lewat indeks atau dipindai penuh). Tabel dengan n_dead_tup besar dan last_autovacuum berhari-hari lalu adalah tabel yang sedang menggembung — periksa scale factor-nya.",
        "pg_stat_statements adalah ekstensi yang mencatat statistik tiap query: berapa kali dipanggil, total waktu, rata-rata waktu, dan baris dikembalikan. DBA8 sudah mengajarkan cara membacanya: query rata-rata 850 ms yang dipanggil 12.000 kali berarti total 10.200 detik — 2,83 jam waktu eksekusi per hari. Query itulah yang pertama diselidiki, bukan query yang paling lambat sekali jalan. Urutan kerjanya: pg_stat_statements menemukan APA yang lambat, EXPLAIN ANALYZE menjelaskan mengapa, dan indeks atau penulisan ulang memperbaikinya.",
        "pg_stat_activity menunjukkan siapa sedang melakukan apa sekarang: tiap koneksi, query yang berjalan, sudah berapa lama, dan apakah ia menunggu lock (wait_event_type = Lock). Digabung dengan pg_locks, ia menjawab pertanyaan insiden paling penting: siapa memblokir siapa. Aturan operasional: query yang berjalan lebih dari 5 menit di OLTP adalah kandidat interogasi; transaksi idle-in-transaction lebih dari 10 menit adalah kandidat kill — ia menahan vacuum dan menahan horizon MVCC untuk semua orang.",
        "Satu metrik yang wajib ada di dasbor: rasio cache hit buffer — shared_buffers yang mengenai cache versus baca disk. Di bawah 99 persen untuk beban OLTP, periksa ukuran shared_buffers dan pola query. Dan satu jadwal yang wajib ada di kalender: VACUUM FREEZE berkala untuk tabel yang jarang di-vacuum — perlindungan terhadap wraparound yang dibahas di langkah 4.",
      ],
      tasks: [],
      note: {
        title: "Jangan menonaktifkan autovacuum",
        type: "pitfall",
        body: "Godaan terbesar saat autovacuum mengganggu beban puncak adalah mematikannya. Itu seperti mematikan petugas kebersihan karena menghalangi jalan: lorong segera penuh sampah, dan VACUUM FULL darurat yang mengikuti jauh lebih mengganggu daripada autovacuum yang dijadwalkan. Atur, jangan matikan — throttle dengan autovacuum_vacuum_cost_delay bila perlu.",
      },
      reference: "pg_stat_user_tables = kesehatan tabel; pg_stat_statements = query termahal; pg_stat_activity = siapa jalan sekarang.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: arsip WAL macet 6 jam — berapa lama lagi disk bertahan?",
      prose: [
        "Kembali ke cerita pembuka. Pukul 03.00, disk tinggal 2 persen — sekitar 4.000 MB tersisa dari disk 200 GB. Arsip WAL sudah macet 6 jam. Laju WAL 576 MB per jam. Dalam 6 jam, WAL menumpuk 6 dikali 576 sama dengan 3.456 MB — hampir seluruh sisa disk. Tanpa tindakan, disk penuh dalam waktu kurang dari satu jam: 4.000 dibagi 576 sama dengan 6,9 jam sejak arsip macet — dan 6 jam sudah lewat, jadi tersisa sekitar 0,94 jam, sama dengan sekitar 57 menit.",
        "DBA mengambil tiga tindakan berurutan. Pertama, perbaiki archive_command — ternyata kredensial arsip kedaluwarsa — dan arsip mulai mengejar ketertinggalan. Kedua, hapus WAL yang sudah terarsip dari pg_wal secara manual dengan pg_archivecleanup, bukan dengan rm sembarangan — rm pada file WAL yang belum terarsip menghancurkan kemampuan PITR. Ketiga, setelah insiden, setel alert: arsip tertinggal lebih dari 15 menit adalah pager, bukan dasbor.",
        "Pelajaran yang dicatat di runbook: arsip WAL adalah rantai yang putus di mata rantai terlemah — kredensial, disk arsip, izin direktori. Monitor rantai itu seperti monitor database itu sendiri: umur file WAL tertua yang belum terarsip adalah metrik yang tidak boleh kosong di dasbor mana pun.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Hitungan 57 menit sisa waktu adalah yang mengubah insiden dari panik menjadi rencana: cukup waktu untuk memperbaiki kredensial dan mengejar arsip, tidak cukup waktu untuk rapat. DBA yang menghitung tidak menebak — dan yang tidak menebak tidak membuang 30 menit pertama untuk berdebat.",
      },
      reference: "Arsip macet 6 jam = 3.456 MB WAL menumpuk; sisa disk 4.000 MB; waktu tersisa sekitar 57 menit.",
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
        "WAL ditulis dulu, checkpoint mendaur ulang; arsip WAL memungkinkan PITR ke detik yang diminta.",
        "Lab: WAL 13.824,0 MB per hari; bloat 70,0 persen; baris mati 30,0 persen; ambang autovacuum 12.000.050.",
        "Ambang autovacuum default 50 + 20 persen baris — terlalu longgar untuk tabel tulis-berat; setel per tabel.",
        "pg_stat_user_tables, pg_stat_statements, pg_stat_activity adalah tiga mata diagnosis DBA.",
        "Wraparound XID di sekitar 2,1 miliar transaksi — VACUUM FREEZE adalah pelindungnya.",
      ],
      next: { label: "DBA29 — Transaksi dan Konkurensi: Lock, Deadlock, dan MVCC untuk DBA", href: "/v2/learn/dba29-transaksi-konkurensi-dba" },
      quiz: [
        {
          q: "Arsip WAL macet 6 jam, laju 576 MB per jam, sisa disk 4.000 MB. Berapa lama lagi disk bertahan?",
          options: [
            { text: "Sekitar 57 menit — 6 jam sudah memakai 3.456 MB dari 4.000 MB", why: "Tepat: 6 x 576 = 3.456 MB menumpuk; tersisa 544 MB, sama dengan 0,94 jam atau sekitar 57 menit. Hitungan ini mengubah panik menjadi rencana.", correct: true },
            { text: "Sekitar 7 jam — 4.000 dibagi 576 sama dengan 6,9 jam penuh", why: "Salah: 6,9 jam dihitung sejak arsip macet, dan 6 jam sudah lewat. Sisa waktunya hanya 0,94 jam." },
            { text: "Tidak akan penuh — WAL berhenti ditulis saat arsip macet", why: "Salah: WAL terus ditulis selama database menerima tulis. Arsip yang macet tidak menghentikan produksi WAL." },
            { text: "Langsung penuh saat itu juga — disk 2 persen berarti nol", why: "Salah: 2 persen dari 200 GB masih 4.000 MB. Kecil, tetapi terukur — dan keterukuran itulah yang memberi waktu bertindak." },
          ],
        },
        {
          q: "Tabel 60.000.000 baris, 18.000.000 baris mati, bloat 70 persen. Apa diagnosis dan tindakan yang benar?",
          options: [
            { text: "Autovacuum bekerja normal — tunggu saja sampai ambang default tercapai", why: "Salah: ambang default 12.000.050 sudah terlewati (18 juta mati) dan tabel tetap menggembung. Ambang default terlalu longgar untuk tabel ini." },
            { text: "Turunkan scale factor autovacuum per tabel dan naikkan maintenance_work_mem", why: "Tepat: ambang 20 persen terlalu longgar untuk 60 juta baris. Scale factor 0,02 memicu vacuum sepuluh kali lebih cepat.", correct: true },
            { text: "Jalankan VACUUM FULL sekarang juga di tengah beban puncak", why: "Salah: VACUUM FULL mengunci tabel eksklusif — itu downtime, bukan perbaikan. Di produksi, ia dijadwalkan atau diganti pg_repack." },
            { text: "Matikan autovacuum agar tidak mengganggu beban", why: "Salah: mematikan petugas kebersihan membuat lorong penuh sampah. Atur dan throttle, jangan matikan." },
          ],
        },
        {
          q: "Kenapa VACUUM penting untuk index-only scan?",
          options: [
            { text: "Karena VACUUM membuat indeks baru secara otomatis", why: "Salah: VACUUM tidak membuat indeks. Ia merawat visibility map yang membuat index-only scan mungkin." },
            { text: "Karena VACUUM merawat visibility map — tanpa itu PostgreSQL tidak yakin halaman bersih dan harus memeriksa heap", why: "Tepat: index-only scan butuh kepastian halaman tidak berubah sejak transaksi lama. Kepastian itu ditulis VACUUM ke visibility map.", correct: true },
            { text: "Karena VACUUM menghapus indeks yang tidak terpakai", why: "Salah: menghapus indeks adalah DROP INDEX manual dari audit pg_stat_user_indexes. VACUUM tidak menghapus indeks." },
            { text: "Karena VACUUM memperbesar shared_buffers", why: "Salah: ukuran shared_buffers adalah konfigurasi, bukan hasil vacuum." },
          ],
        },
        {
          q: "Transaction ID mendekati 2,1 miliar dan satu tabel tidak pernah di-vacuum. Apa risikonya?",
          options: [
            { text: "Tidak ada — ID berputar otomatis tanpa konsekuensi", why: "Salah: wraparound tanpa freeze memaksa PostgreSQL shutdown untuk melindungi data. Database berhenti total." },
            { text: "PostgreSQL memaksa shutdown untuk melindungi data — VACUUM FREEZE adalah pencegahannya", why: "Tepat: ID tua yang belum dibekukan membuat putaran tidak aman. Pantau datfrozenxid dan jadwalkan FREEZE berkala.", correct: true },
            { text: "Query menjadi lambat tetapi database tetap jalan", why: "Salah: ini bukan soal performa. Ini soal kebenaran — database memilih berhenti daripada merusak data." },
            { text: "Hanya tabel itu yang terkunci, database lain tetap jalan", why: "Salah: wraparound adalah peristiwa tingkat database. Shutdown melindungi seluruh database, bukan satu tabel." },
          ],
        },
        {
          q: "Query rata-rata 850 ms dipanggil 12.000 kali sehari. Query lain 9 detik sekali jalan. Mana yang diselidiki dulu?",
          options: [
            { text: "Query 9 detik — paling lambat sekali jalan pasti paling mahal", why: "Salah: 9 detik sekali jalan adalah 9 detik. Query 850 ms dikali 12.000 adalah 10.200 detik — 2,83 jam per hari." },
            { text: "Query 850 ms — total waktunya 10.200 detik atau 2,83 jam per hari", why: "Tepat: pg_stat_statements mengurutkan dari total waktu, bukan dari satu eksekusi. Total waktu adalah biaya sebenarnya.", correct: true },
            { text: "Keduanya sama — selidiki yang namanya paling pendek", why: "Salah: nama tidak ada hubungannya dengan biaya. Total waktu eksekusi adalah metriknya." },
            { text: "Tidak satu pun — tunggu sampai ada yang mengeluh", why: "Salah: DBA proaktif membaca pg_stat_statements sebelum keluhan. Keluhan berarti biaya sudah dibayar pengguna." },
          ],
        },
      ],
    },
  ],
};

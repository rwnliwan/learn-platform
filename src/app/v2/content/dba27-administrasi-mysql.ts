import type { V2Lesson } from "../lib/types";

export const dba27: V2Lesson = {
  slug: "dba27-administrasi-mysql",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA27 — Administrasi MySQL: InnoDB, Buffer Pool, dan Replikasi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Flash sale jam 7 malam: MySQL dengan buffer pool 4 GB di RAM 16 GB",
      prose: [
        "Toko online KirimCepat mengadakan flash sale jam 7 malam. MySQL-nya berjalan di server RAM 16 GB — tetapi buffer pool InnoDB disetel 4 GB, warisan instalasi awal saat data masih kecil. Pukul 19.05, halaman produk melambat. Pukul 19.20, halaman checkout mulai timeout. Dasbor menunjukkan hit ratio buffer pool 82 persen: hampir satu dari lima baca harus turun ke disk.",
        "DBA menaikkan buffer pool menjadi 12 GB — 75 persen dari RAM — dan me-restart dengan cara yang direncanakan. Hit ratio naik menjadi 96 persen. Disk read turun dari 180.000 menjadi 40.000 per satu juta baca. Flash sale selamat, dan tidak ada satu baris kode aplikasi pun yang diubah.",
        "Lesson ini mengajarkan administrasi MySQL khusus: mesin yang dipakai mayoritas startup Indonesia ini punya anatomi, kebiasaan, dan jebakan sendiri. Setelah lesson ini kamu bisa: (1) menjelaskan anatomi InnoDB — buffer pool, redo log, doublewrite, dan binlog; (2) menghitung ukuran buffer pool dan membaca hit ratio; (3) memilih strategi backup dari jendela dan RPO; (4) menjalankan replikasi GTID dan membaca lag-nya; (5) mendiagnosis query lambat dengan slow query log dan performance_schema.",
      ],
      tasks: [],
      note: {
        title: "Kenapa MySQL pantas satu lesson sendiri",
        body: "DBA2 sudah memperkenalkan MySQL sebagai salah satu mesin SQL — lisensi gratis, InnoDB, budaya cukup cepat dan ringan — tetapi itu pengenalan pemilihan mesin, bukan administrasi. Oracle dan SQL Server sudah punya lesson sendiri di DBA21 dan DBA22. Lesson ini menutup kesenjangan yang sama untuk MySQL: administrasi hariannya.",
      },
      reference: "Buffer pool 4 GB di RAM 16 GB: hit ratio 82 persen. Naik ke 12 GB: 96 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengoperasikan MySQL produksi — bukan sekadar menginstalnya.",
        "(1) Menjelaskan anatomi InnoDB dan peran tiap komponennya saat tulis dan baca;",
        "(2) Menghitung buffer pool dari RAM dan menilai hit ratio dari angka mentah;",
        "(3) Membandingkan mysqldump, XtraBackup, dan snapshot dari jendela backup dan RPO;",
        "(4) Menjelaskan replikasi GTID, membaca lag replika, dan tahu kapan failover aman;",
        "(5) Mendeteksi query lambat lewat slow query log dan performance_schema.",
      ],
      tasks: [],
    },
    {
      id: "innodb",
      eyebrow: "Langkah 3 · Teori",
      title: "Anatomi InnoDB: buffer pool, redo log, dan binlog",
      prose: [
        "InnoDB adalah storage engine default MySQL dan satu-satunya yang serius dipakai di produksi. Memahami InnoDB berarti memahami empat komponen. Pertama, buffer pool: cache halaman data dan indeks di memori. Baca yang mengenai buffer pool tidak menyentuh disk sama sekali — inilah alasan satu angka konfigurasi bisa menyelamatkan flash sale.",
        "Kedua, redo log: catatan tulis berurutan (write-ahead log versi MySQL). Saat transaksi commit, InnoDB cukup menulis redo log ke disk — data halamannya sendiri boleh ditulis belakangan, saat checkpoint. Itulah yang membuat commit cepat: menulis berurutan jauh lebih murah daripada menulis acak ke halaman data.",
        "Ketiga, doublewrite buffer: pelindung terhadap halaman yang tertulis setengah saat listrik padam. InnoDB menulis halaman dulu ke area doublewrite secara berurutan, baru ke lokasi aslinya. Bila listrik padam di tengah tulis, halaman utuh bisa dipulihkan dari doublewrite. Keempat, binlog: catatan perubahan logis yang dipakai replikasi dan point-in-time recovery. Redo log untuk crash recovery di satu server; binlog untuk menyalin perubahan ke server lain dan memutar ulang ke titik waktu tertentu.",
        "Satu parameter yang paling sering salah dipahami: innodb_flush_log_at_trx_commit. Nilai 1 berarti redo log di-flush ke disk di setiap commit — paling aman, paling lambat. Nilai 2 berarti flush ke sistem operasi tiap commit tetapi fsync tiap detik — bila listrik padam, transaksi satu detik terakhir bisa hilang. Nilai 0 berarti flush tiap detik — paling cepat, paling berisiko. Untuk data uang, jawabannya 1. Untuk log analitik yang bisa dihitung ulang, 2 boleh dipertimbangkan — dengan persetujuan tertulis dari pemilik data.",
      ],
      tasks: [],
      note: {
        title: "MyISAM: jangan",
        type: "pitfall",
        body: "MyISAM adalah engine lama MySQL: tanpa transaksi, tanpa foreign key, tanpa crash recovery. Tabel MyISAM yang crash di tengah tulis bisa rusak dan butuh repair. Bila menemukan tabel MyISAM di produksi, migrasikan ke InnoDB — satu ALTER TABLE per tabel, di jam sepi, dengan backup dulu.",
      },
      reference: "Buffer pool = cache halaman. Redo log = crash recovery. Binlog = replikasi dan PITR.",
    },
    {
      id: "pool-backup",
      eyebrow: "Langkah 4 · Teori",
      title: "Buffer pool, hit ratio, dan strategi backup",
      prose: [
        "Aturan praktis buffer pool di server khusus database: 70 sampai 80 persen dari RAM. Di RAM 16 GB, 75 persen sama dengan 12 GB. Sisanya untuk sistem operasi, koneksi, dan sort buffer. Di server bersama aplikasi, turunkan — buffer pool yang merebut RAM aplikasi hanya memindahkan kemacetan.",
        "Hit ratio dihitung dari dua angka: total baca halaman dan baca dari disk. Rumusnya: total baca dikurangi baca disk, dibagi total baca, dikali 100. Di cerita pembuka sebelum perbaikan: 1.000.000 baca dengan 180.000 dari disk sama dengan 82 persen. Sesudah perbaikan: 40.000 dari disk sama dengan 96 persen. Target operasional: di atas 95 persen untuk beban OLTP. Di bawah 90 persen, periksa dulu ukuran pool sebelum menyalahkan query — query yang baik pun lambat bila datanya tidak muat di memori.",
        "Backup punya tiga pilihan, dan pilihannya ditentukan jendela dan RPO. mysqldump: backup logis, file SQL yang bisa dibaca manusia, tetapi lambat — data 240 GB pada 120 GB per jam butuh 2 jam, sama dengan 120 menit. Percona XtraBackup: backup fisik panas tanpa mengunci, data yang sama pada 400 GB per jam butuh 36 menit, plus incremental dan persiapan restore yang lebih cepat. Snapshot storage: tercepat, tetapi butuh kerja sama dengan tim infrastruktur dan restore yang diuji.",
        "RPO menentukan binlog: tanpa binlog, restore hanya sampai backup terakhir — RPO sama dengan interval backup. Dengan binlog dan mysqlbinlog, restore bisa diputar sampai detik sebelum insiden — RPO mendekati nol. Aturan yang tidak boleh dilanggar: backup yang belum pernah di-restore di staging dianggap tidak ada. Jadwalkan restore test tiap bulan dan catat waktunya.",
      ],
      tasks: [],
      note: {
        title: "Resize buffer pool tanpa restart",
        body: "MySQL modern mengizinkan resize buffer pool online lewat SET GLOBAL innodb_buffer_pool_size. Tetapi menaikkan pool di tengah flash sale tetap berisiko: halaman baru harus diisi (warming) dan memori harus tersedia. Perubahan ukuran pool adalah perubahan terencana — diumumkan, di jam sepi, dengan rollback berupa nilai lama yang dicatat.",
      },
      reference: "Pool 70 sampai 80 persen RAM. Hit ratio OLTP di atas 95 persen. Backup belum di-restore = tidak ada.",
    },
    {
      id: "lab-pool",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: kalkulator kesehatan MySQL",
      prose: [
        "Lab ini membangun kalkulator kesehatan MySQL: ukuran buffer pool dari RAM, hit ratio dari angka baca, dan jendela backup dari dua strategi.",
        "Hitung dulu di kepala. RAM 16 GB dengan aturan 75 persen: 16 dikali 0,75 sama dengan 12,0 GB. Hit ratio: 1.000.000 baca total dikurangi 40.000 baca disk sama dengan 960.000 baca dari memori; 960.000 dibagi 1.000.000 dikali 100 sama dengan 96,0 persen. Backup data 240 GB dengan mysqldump 120 GB per jam: 240 dibagi 120 sama dengan 2 jam, sama dengan 120,0 menit. Dengan XtraBackup 400 GB per jam: 240 dibagi 400 sama dengan 0,6 jam, sama dengan 36,0 menit.",
        "Tugas lab: tulis fungsi yang menerima RAM, total baca, baca disk, ukuran data, dan dua laju backup — lalu mencetak empat angka: pool_gb, hit_ratio, dump_menit, xtra_menit. Keempat angka ini adalah yang DBA bawa ke rapat kapasitas: bukan opini, melainkan hitungan.",
        "Setelah lolos, coba eksperimen: ubah RAM menjadi 32 GB dan lihat pool menjadi 24,0 GB — lalu tanyakan: apakah pool yang lebih besar selalu lebih baik? Jawabannya ada di langkah berikutnya: pool yang terlalu besar membuat restart dan crash recovery lebih lama, karena lebih banyak halaman kotor yang harus ditulis ulang.",
      ],
      tasks: [
        { id: "t1", text: "Hitung buffer pool dari RAM dengan aturan 75 persen" },
        { id: "t2", text: "Hitung hit ratio dari total baca dan baca disk" },
        { id: "t3", text: "Hitung jendela backup mysqldump dan XtraBackup dalam menit" },
      ],
      expected: "pool_gb=12.0\nhit_ratio=96.0\ndump_menit=120.0\nxtra_menit=36.0",
      hints: [
        "Pool = RAM dikali 0,75.",
        "Hit ratio = (total baca dikurangi baca disk) dibagi total baca, dikali 100.",
        "Menit backup = ukuran data dibagi laju per jam, dikali 60.",
        "XtraBackup jauh lebih cepat karena backup fisik, bukan logis.",
      ],
      code: {
        starter: `# Data kesehatan MySQL: RAM, angka baca, ukuran data, laju backup.\nram_gb = 16\ntotal_baca = 1000000\nbaca_disk = 40000\nukuran_gb = 240\ndump_rate = 120  # GB per jam\nxtra_rate = 400  # GB per jam\n\n# TULIS KODEMU: hitung empat angka kesehatan di bawah ini.\n# Cetak, per baris: pool_gb, hit_ratio, dump_menit, xtra_menit.\n\n\nkalkulator_mysql(ram_gb, total_baca, baca_disk, ukuran_gb, dump_rate, xtra_rate)`,
        lockLines: 7,
        solution: `# Data kesehatan MySQL: RAM, angka baca, ukuran data, laju backup.\nram_gb = 16\ntotal_baca = 1000000\nbaca_disk = 40000\nukuran_gb = 240\ndump_rate = 120  # GB per jam\nxtra_rate = 400  # GB per jam\n\n\ndef kalkulator_mysql(ram_gb, total_baca, baca_disk, ukuran_gb, dump_rate, xtra_rate):\n    pool_gb = ram_gb * 0.75\n    hit_ratio = (total_baca - baca_disk) / total_baca * 100\n    dump_menit = ukuran_gb / dump_rate * 60\n    xtra_menit = ukuran_gb / xtra_rate * 60\n    print(f"pool_gb={pool_gb}")\n    print(f"hit_ratio={hit_ratio}")\n    print(f"dump_menit={dump_menit}")\n    print(f"xtra_menit={xtra_menit}")\n\n\nkalkulator_mysql(ram_gb, total_baca, baca_disk, ukuran_gb, dump_rate, xtra_rate)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "pool_gb=12.0", label: "Buffer pool 12,0 GB", msg: "16 x 0,75 = 12,0. Aturan 70 sampai 80 persen RAM di server khusus database." },
          { kind: "stdout_matches", task: "t2", pattern: "hit_ratio=96.0", label: "Hit ratio 96,0 persen", msg: "(1.000.000 - 40.000) / 1.000.000 x 100 = 96,0. Target OLTP di atas 95 persen." },
          { kind: "stdout_matches", task: "t3", pattern: "dump_menit=120.0", label: "mysqldump 120,0 menit", msg: "240 / 120 = 2 jam = 120 menit. Backup logis itu lambat." },
          { kind: "stdout_matches", task: "t3", pattern: "xtra_menit=36.0", label: "XtraBackup 36,0 menit", msg: "240 / 400 = 0,6 jam = 36 menit. Backup fisik panas jauh lebih cepat." },
        ],
      },
      reference: "Pool 12,0 GB; hit ratio 96,0 persen; mysqldump 120,0 menit; XtraBackup 36,0 menit.",
    },
    {
      id: "replikasi-diagnosis",
      eyebrow: "Langkah 6 · Teori",
      title: "Replikasi GTID dan diagnosis query lambat",
      prose: [
        "Replikasi MySQL menyalin binlog dari primary ke replika. GTID — Global Transaction Identifier — memberi tiap transaksi satu ID unik global, sehingga replika tahu persis transaksi mana yang sudah diterapkan dan mana yang belum. Tanpa GTID, failover adalah tebak-tebakan posisi binlog; dengan GTID, failover adalah perbandingan himpunan ID yang bisa diverifikasi.",
        "Lag replika dibaca dari Seconds_Behind_Master di SHOW REPLICA STATUS — tetapi angka itu berbohong dengan sopan: ia nol saat replika tidak menerima apa-apa (misalnya thread I/O mati) dan ia mengukur selisih timestamp, bukan jumlah transaksi tertunda. DBA yang serius memantau juga transaksi tertunda (GTID yang belum diterapkan) dan umur transaksi tertua di antrean. Aturan failover: jangan promosikan replika yang lag-nya tidak nol dan tidak diverifikasi — promosi prematur berarti data hilang yang baru ketahuan besok.",
        "Diagnosis query lambat punya dua alat. Slow query log mencatat query yang melewati ambang — setel long_query_time ke 1 detik di produksi dan baca ringkasannya dengan mysqldumpslow atau pt-query-digest. performance_schema mencatat statistik tiap query secara real-time: events_statements_summary_by_digest menunjukkan query mana yang paling sering dipanggil dan total waktunya — persis seperti pg_stat_statements di PostgreSQL (DBA8). Urutan kerja yang benar: temukan query termahal dari total waktu, bukan dari satu eksekusi paling lambat; lalu EXPLAIN dan periksa apakah ia memakai indeks atau memindai penuh.",
        "Pengguna dan hak akses adalah bagian administrasi yang paling sering diabaikan. Prinsip least privilege: aplikasi mendapat hanya hak yang ia butuhkan di database yang ia butuhkan — SELECT, INSERT, UPDATE, DELETE di satu schema, tanpa DROP, tanpa GRANT OPTION, tanpa akses ke schema mysql. Akun root tidak dipakai aplikasi; akun backup hanya bisa membaca dan mengunci; akun replika hanya bisa replikasi. Audit user tiap kuartal: akun yang tidak dipakai 90 hari dicabut.",
      ],
      tasks: [],
      note: {
        title: "Jebakan Seconds_Behind_Master = 0",
        type: "pitfall",
        body: "Lag nol tidak selalu berarti replika sehat. Bila thread I/O replika mati, tidak ada binlog baru yang datang dan selisih timestamp tetap nol — replika tampak sehat sambil tertinggal jauh. Pantau selalu status thread I/O dan SQL, bukan hanya satu angka lag.",
      },
      reference: "GTID = ID unik per transaksi, failover terverifikasi. Lag nol bisa bohong — cek thread I/O dan SQL.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: pukul 19.20 — naikkan pool atau matikan query?",
      prose: [
        "Kembali ke cerita pembuka. Pukul 19.20, checkout timeout dan hit ratio 82 persen. Dua suara di ruang insiden. Satu suara berkata: naikkan buffer pool sekarang juga — data tidak muat di memori, itu akar masalahnya. Suara lain berkata: jangan sentuh konfigurasi di tengah flash sale — matikan dulu query laporan yang memindai penuh dan naikkan pool setelah sale selesai.",
        "Jawaban yang benar: keduanya, berurutan. Pertama matikan query laporan berat — satu query yang memindai 10 juta baris tiap menit mengusir halaman panas dari pool dan memperburuk hit ratio untuk semua orang. Setelah beban liar berhenti, hit ratio naik sebagian — cukup untuk checkout bernapas. Lalu, setelah flash sale selesai, naikkan pool ke 12 GB dengan restart terencana dan warming.",
        "Alasannya: resize pool online di tengah beban puncak adalah perubahan konfigurasi saat sistem paling rapuh — bila memori tidak tersedia, MySQL bisa gagal alokasi dan crash. Mematikan query liar adalah perubahan yang reversibel dalam hitungan detik. DBA yang baik memilih perubahan yang bisa dibatalkan dulu, dan perubahan permanen kemudian — saat kepala dingin dan jendela tersedia.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Urutan tindakan saat insiden: (1) hentikan beban yang tidak perlu — reversibel, instan; (2) ukur lagi — apakah hit ratio pulih cukup untuk bertahan; (3) perubahan permanen dijadwalkan, bukan dipaksakan. Mengubah konfigurasi di tengah puncak adalah taruhan; mematikan query liar adalah pertolongan pertama.",
      },
      reference: "Insiden: matikan query liar dulu (reversibel), naikkan pool kemudian (terencana).",
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
        "InnoDB: buffer pool untuk baca, redo log untuk crash recovery, binlog untuk replikasi dan PITR.",
        "Pool 70 sampai 80 persen RAM; hit ratio OLTP di atas 95 persen.",
        "Lab: pool 12,0 GB; hit ratio 96,0 persen; mysqldump 120,0 menit; XtraBackup 36,0 menit.",
        "GTID membuat failover terverifikasi; lag nol bisa bohong bila thread I/O mati.",
        "Query termahal dicari dari total waktu, bukan satu eksekusi paling lambat.",
      ],
      next: { label: "DBA28 — Administrasi PostgreSQL: WAL, VACUUM, dan pg_stat", href: "/v2/learn/dba28-administrasi-postgresql" },
      quiz: [
        {
          q: "MySQL RAM 16 GB, hit ratio 82 persen, flash sale sedang berjalan. Apa tindakan pertama yang benar?",
          options: [
            { text: "Naikkan buffer pool ke 12 GB saat itu juga di tengah sale", why: "Salah: resize pool di tengah puncak adalah taruhan — bila memori tidak tersedia, MySQL bisa crash. Perubahan permanen dijadwalkan." },
            { text: "Matikan query laporan berat yang memindai penuh, ukur lagi, lalu jadwalkan naik pool", why: "Tepat: mematikan query liar reversibel dan instan; perubahan konfigurasi dilakukan terencana setelah beban reda.", correct: true },
            { text: "Tambah RAM server tanpa restart apa pun", why: "Salah: RAM fisik tidak bisa ditambah tanpa downtime di kebanyakan lingkungan — dan bukan itu akar masalah sesaatnya." },
            { text: "Biarkan saja — hit ratio 82 persen masih cukup baik", why: "Salah: 82 persen berarti satu dari lima baca turun ke disk saat beban puncak. Checkout sudah timeout — itu bukan cukup baik." },
          ],
        },
        {
          q: "Apa perbedaan peran redo log dan binlog di MySQL?",
          options: [
            { text: "Keduanya sama — catatan perubahan untuk replikasi", why: "Salah: redo log untuk crash recovery di satu server; binlog untuk replikasi dan point-in-time recovery." },
            { text: "Redo log untuk crash recovery satu server; binlog untuk replikasi dan PITR", why: "Tepat: redo log memulihkan server yang crash; binlog menyalin perubahan ke replika dan memutar ulang ke titik waktu.", correct: true },
            { text: "Redo log untuk backup logis; binlog untuk backup fisik", why: "Salah: terbalik dan salah konsep. Backup logis adalah mysqldump; backup fisik adalah XtraBackup." },
            { text: "Redo log hanya ada di MyISAM; binlog hanya ada di InnoDB", why: "Salah: redo log adalah komponen InnoDB. MyISAM tidak punya redo log — salah satu alasan ia tidak dipakai di produksi." },
          ],
        },
        {
          q: "Data 240 GB. mysqldump 120 GB per jam, XtraBackup 400 GB per jam. Berapa jendela masing-masing?",
          options: [
            { text: "mysqldump 120 menit, XtraBackup 36 menit", why: "Tepat: 240/120 = 2 jam = 120 menit; 240/400 = 0,6 jam = 36 menit.", correct: true },
            { text: "mysqldump 36 menit, XtraBackup 120 menit", why: "Salah: tertukar. Backup logis (mysqldump) yang lambat; backup fisik (XtraBackup) yang cepat." },
            { text: "Keduanya 60 menit — laju tidak memengaruhi jendela", why: "Salah: jendela = ukuran dibagi laju. Laju tiga kali lipat berarti jendela sepertiganya." },
            { text: "mysqldump 240 menit, XtraBackup 100 menit", why: "Salah: 240/120 = 2 jam, bukan 4 jam; 240/400 = 0,6 jam, bukan 100 menit." },
          ],
        },
        {
          q: "Replika menunjukkan Seconds_Behind_Master = 0, tetapi laporan dari replika tampak basi. Apa yang paling mungkin?",
          options: [
            { text: "Replika memang sehat — laporan basi pasti salah baca", why: "Salah: lag nol bisa bohong. Bila thread I/O mati, tidak ada binlog baru dan selisih timestamp tetap nol." },
            { text: "Thread I/O replika mati sehingga tidak ada binlog baru yang datang", why: "Tepat: tanpa binlog baru, selisih timestamp nol — replika tampak sehat sambil tertinggal. Cek status kedua thread.", correct: true },
            { text: "GTID replika terlalu baru sehingga laporan mendahului primary", why: "Salah: replika tidak bisa mendahului primary. GTID yang lebih baru di replika tidak mungkin dari replikasi normal." },
            { text: "Buffer pool replika terlalu besar", why: "Salah: buffer pool memengaruhi kecepatan baca, bukan kebaruan data replikasi." },
          ],
        },
        {
          q: "innodb_flush_log_at_trx_commit = 1 untuk data uang. Kenapa bukan 0 atau 2?",
          options: [
            { text: "Karena 1 paling cepat — commit tidak menunggu disk", why: "Salah: 1 paling lambat karena flush ke disk di tiap commit. Kecepatan bukan alasannya — keamanan yang jadi alasan." },
            { text: "Karena 1 mem-flush redo log ke disk di tiap commit — transaksi yang di-commit tidak hilang saat listrik padam", why: "Tepat: untuk data uang, kehilangan satu detik transaksi tidak bisa diterima. Nilai 2 bisa kehilangan satu detik terakhir.", correct: true },
            { text: "Karena 0 dan 2 tidak didukung MySQL modern", why: "Salah: keduanya didukung dan sah untuk data yang bisa dihitung ulang — hanya tidak untuk data uang." },
            { text: "Karena 1 membuat binlog tidak diperlukan lagi", why: "Salah: binlog tetap diperlukan untuk replikasi dan PITR. Flush log tidak menggantikan binlog." },
          ],
        },
      ],
    },
  ],
};

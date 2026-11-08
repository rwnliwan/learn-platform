import type { V2Lesson } from "../lib/types";

export const dba34: V2Lesson = {
  slug: "dba34-troubleshooting-korupsi-data",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA34 — Troubleshooting dan Korupsi Data: Saat Database Tidak Bisa Dipercaya",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Query yang mengembalikan angka berbeda tiap kali dijalankan",
      prose: [
        "Selasa pagi, laporan saldo EduPay mengembalikan angka berbeda tiap kali dijalankan — tanpa ada transaksi baru. DBA junior mengira cache; DBA senior langsung curiga korupsi: query yang sama memberi jawaban berbeda berarti database membaca halaman yang rusak, bukan data yang berubah.",
        "Pemeriksaan integritas menemukan 12 dari 50.000 halaman korup — 0,024 persen. Penyebabnya: storage yang menulis setengah halaman saat listrik padam. Dan yang lebih menakutkan: backup 3 hari terakhir juga korup, karena job backup menyalin halaman rusak tanpa pernah memverifikasi isinya.",
        "Lesson ini mengajarkan troubleshooting dan korupsi data: mendeteksi, mengisolasi, memperbaiki, dan mencegah. Setelah lesson ini kamu bisa: (1) mengenali gejala korupsi; (2) menjalankan pemeriksaan integritas; (3) menghitung cakupan kerusakan; (4) memilih perbaikan — REINDEX, restore halaman, atau restore penuh; (5) menghitung RPO dan waktu restore; (6) membangun pencegahan agar backup tidak korup diam-diam.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DBA4 memakai disk corrupt sebagai cerita pembuka backup dan DBA16 memberi runbook 5 langkah untuk indeks korup dalam konteks disaster recovery. Tidak ada lesson troubleshooting dan korupsi data sebagai disiplin: gejala, pemeriksaan integritas menyeluruh, taksonomi kerusakan (halaman, indeks, WAL, logis), dan keputusan perbaikannya. Lesson ini membangun disiplin itu.",
      },
      reference: "12 dari 50.000 halaman korup (0,024 persen). Backup 02:00, corrupt 14:35, WAL tiap 5 menit: RPO 5 menit. Restore 40 GB pada 200 MB per detik: 200 detik.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menghadapi database yang tidak bisa dipercaya dengan tenang — karena kamu punya urutan tindakan, bukan kepanikan.",
        "(1) Mengenali gejala korupsi: jawaban berbeda, crash berulang, checksum gagal;",
        "(2) Menjalankan pemeriksaan integritas dan membaca hasilnya;",
        "(3) Menghitung cakupan kerusakan dalam persen dan baris;",
        "(4) Memilih perbaikan: REINDEX, restore halaman, restore penuh;",
        "(5) Menghitung RPO dari jadwal backup dan arsip WAL;",
        "(6) Membangun verifikasi backup agar korup tidak ditemukan saat restore.",
      ],
      tasks: [],
    },
    {
      id: "gejala-deteksi",
      eyebrow: "Langkah 3 · Teori",
      title: "Gejala dan deteksi: buktikan dulu, tebak kemudian",
      prose: [
        "Gejala korupsi ada empat. Satu: query yang sama memberi jawaban berbeda tanpa perubahan data. Dua: crash atau error checksum yang berulang di halaman yang sama. Tiga: indeks mengembalikan baris yang tidak ada di tabel (atau sebaliknya). Empat: restore atau replikasi gagal di titik yang sama berulang kali.",
        "Deteksi dimulai dari pemeriksaan integritas: di Postgres, pg_amcheck untuk indeks dan pg_checksums untuk halaman; di Oracle, DBV (DBVERIFY) dan RMAN VALIDATE; di SQL Server, DBCC CHECKDB. Jalankan pada jam sepi — pemeriksaan penuh memindai seluruh database dan membebani I/O. Hasilnya dibaca apa adanya: halaman mana, tabel mana, indeks mana — jangan menebak dari gejala.",
        "Hitung cakupannya: 12 dari 50.000 halaman sama dengan 0,024 persen. Angka kecil itu menipu: 12 halaman di tabel transaksi bisa berarti ribuan baris. Cakupan persen mengukur luas; dampak diukur dari tabel apa yang kena dan berapa baris di halaman itu. Keduanya dilaporkan — persen untuk manajemen, baris untuk rencana perbaikan.",
      ],
      tasks: [],
      note: {
        title: "Korupsi logis vs fisik",
        body: "Korupsi fisik: halaman rusak di disk — checksum gagal, storage bermasalah. Korupsi logis: data salah tetapi database sehat — DELETE tanpa WHERE, bug aplikasi, duplikat. Fisik diperbaiki dari backup atau salinan sehat; logis diperbaiki dari flashback atau koreksi data. Salah diagnosis berarti salah obat: me-restore backup untuk DELETE yang salah membuang transaksi sore yang sehat.",
      },
      reference: "12 dari 50.000 halaman = 0,024 persen. Deteksi: amcheck, DBVERIFY, DBCC CHECKDB — pada jam sepi.",
    },
    {
      id: "perbaikan-pencegahan",
      eyebrow: "Langkah 4 · Teori",
      title: "Perbaikan dan pencegahan: pilih obatnya, lalu kunci pintunya",
      prose: [
        "Perbaikan dipilih dari jenis kerusakan. Indeks korup: REINDEX CONCURRENTLY — membangun ulang tanpa blokir tulis. Halaman data korup sedikit: restore halaman dari backup (bila didukung) atau salin baris sehat dari standby. Kerusakan luas atau WAL korup: restore penuh plus replay WAL — dan RPO-nya dihitung dari jadwal: backup 02:00, corrupt 14:35, WAL tiap 5 menit berarti kehilangan maksimal 5 menit data.",
        "Waktu restore juga dihitung, bukan ditebak: 40 GB pada 200 MB per detik sama dengan 40.000 dibagi 200 sama dengan 200 detik untuk salinan data — ditambah replay WAL dan verifikasi. Angka ini masuk runbook supaya direksi tahu berapa lama downtime saat insiden, bukan menebak di tengah krisis.",
        "Pencegahan ada tiga lapis. Satu: checksum halaman aktif sejak awal — tanpa checksum, korupsi ditemukan terlambat. Dua: verifikasi backup otomatis — restore percobaan berkala ke server staging membuktikan backup bisa dipakai, bukan sekadar berhasil disalin. Tiga: monitoring SMART storage dan alert error I/O — storage yang sekarat memberi tanda sebelum membunuh halaman.",
      ],
      tasks: [],
      reference: "Indeks korup: REINDEX CONCURRENTLY. Halaman sedikit: restore halaman. Luas: restore penuh. RPO 5 menit. Restore 40 GB: 200 detik plus replay dan verifikasi.",
    },
    {
      id: "lab-korupsi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung cakupan korupsi, RPO, dan waktu restore",
      prose: [
        "Lab ini menghitung tiga angka insiden korupsi dari angka mentah pemeriksaan dan jadwal backup.",
        "Hitung dulu di kepala. Persen korup: 12 dibagi 50.000 dikali 100 sama dengan 0,024 persen. RPO: arsip WAL tiap 5 menit berarti kehilangan maksimal 5 menit. Waktu restore: 40.000 dibagi 200 sama dengan 200 detik.",
        "Tugas lab: tulis fungsi yang menerima halaman korup, total halaman, interval WAL, ukuran MB, dan kecepatan restore — lalu mencetak tiga angka: korup_persen, rpo_menit, restore_detik.",
        "Setelah lolos, coba eksperimen: ubah halaman korup menjadi 500 dan lihat persen naik menjadi 1,0 persen — pada cakupan berapa kamu memilih restore penuh dibanding restore halaman?",
      ],
      tasks: [
        { id: "t1", text: "Hitung korup_persen" },
        { id: "t2", text: "Teruskan rpo_menit dari interval WAL" },
        { id: "t3", text: "Hitung restore_detik" },
      ],
      expected: "korup_persen=0.024\nrpo_menit=5\nrestore_detik=200",
      hints: [
        "Persen = korup dibagi total, dikali 100.",
        "RPO sama dengan interval arsip WAL.",
        "Restore detik = ukuran MB dibagi kecepatan MB per detik.",
      ],
      code: {
        starter: `# Insiden korupsi EduPay: pemeriksaan + jadwal backup.\nhalaman_korup = 12\ntotal_halaman = 50000\ninterval_wal_menit = 5\nukuran_mb = 40000\nkecepatan_mbps = 200\n\n# TULIS KODEMU: hitung korup_persen, rpo_menit, restore_detik.\n# Cetak, per baris: korup_persen, rpo_menit, restore_detik.\n\n\nmesin_korupsi(halaman_korup, total_halaman, interval_wal_menit, ukuran_mb, kecepatan_mbps)`,
        lockLines: 6,
        solution: `# Insiden korupsi EduPay: pemeriksaan + jadwal backup.\nhalaman_korup = 12\ntotal_halaman = 50000\ninterval_wal_menit = 5\nukuran_mb = 40000\nkecepatan_mbps = 200\n\n\ndef mesin_korupsi(halaman_korup, total_halaman, interval_wal_menit, ukuran_mb, kecepatan_mbps):\n    korup_persen = halaman_korup / total_halaman * 100\n    rpo_menit = interval_wal_menit\n    restore_detik = ukuran_mb // kecepatan_mbps\n    print(f"korup_persen={korup_persen}")\n    print(f"rpo_menit={rpo_menit}")\n    print(f"restore_detik={restore_detik}")\n\n\nmesin_korupsi(halaman_korup, total_halaman, interval_wal_menit, ukuran_mb, kecepatan_mbps)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "korup_persen=0.024", label: "Korup 0,024 persen", msg: "12 / 50.000 x 100 = 0,024 persen. Kecil — tetapi ukur juga baris yang kena." },
          { kind: "stdout_matches", task: "t2", pattern: "rpo_menit=5", label: "RPO 5 menit", msg: "WAL tiap 5 menit berarti kehilangan maksimal 5 menit data." },
          { kind: "stdout_matches", task: "t3", pattern: "restore_detik=200", label: "Restore 200 detik", msg: "40.000 / 200 = 200 detik salinan data, ditambah replay WAL dan verifikasi." },
        ],
      },
      reference: "Korup 0,024 persen; RPO 5 menit; restore 200 detik.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: backup korup yang ditemukan saat restore",
      prose: [
        "Kembali ke EduPay. Pelajaran terpahit insiden itu bukan 12 halaman korup — melainkan backup 3 hari terakhir yang ikut korup. Job backup 'sukses' setiap malam karena ia hanya menyalin; tidak ada yang pernah memverifikasi isinya. Rencana restore penuh gagal di hari pertama, dan tim harus memakai backup 4 hari lalu plus replay WAL 4 hari.",
        "Perbaikan permanennya: restore percobaan otomatis tiap minggu ke server staging — backup yang tidak pernah di-restore dianggap tidak ada. Checksum halaman diaktifkan di semua database baru. Pemeriksaan integritas dijadwalkan tiap bulan, dan alert error I/O storage masuk ke pager DBA.",
        "Keputusan rapat: 'backup sukses' tidak lagi berarti apa-apa tanpa bukti restore. Laporan backup mingguan kini berisi satu baris: tanggal restore percobaan terakhir dan hasilnya.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini bertahan. Pertama, verifikasi backup adalah restore percobaan — bukan cek ukuran file. Kedua, checksum aktif sejak awal — korupsi ditemukan saat terjadi, bukan saat restore. Ketiga, runbook berisi angka RPO dan waktu restore yang dihitung — direksi tahu berapa lama downtime sebelum insiden terjadi.",
      },
      reference: "Backup 3 hari korup; restore memakai backup 4 hari lalu. Restore percobaan mingguan kini wajib.",
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
        "Lab: korup 0,024 persen; RPO 5 menit; restore 200 detik.",
        "Gejala korupsi: jawaban berbeda, crash berulang, checksum gagal, restore gagal di titik sama.",
        "Korupsi fisik vs logis: obatnya berbeda — jangan salah diagnosis.",
        "Indeks korup: REINDEX CONCURRENTLY. Luas: restore penuh plus replay WAL.",
        "Backup yang tidak pernah di-restore dianggap tidak ada.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "12 dari 50.000 halaman korup. Berapa persennya?",
          options: [
            { text: "0,24 persen — salah menaruh koma", why: "Salah: 12 / 50.000 = 0,00024 = 0,024 persen, bukan 0,24 persen." },
            { text: "0,024 persen", why: "Tepat: 12 / 50.000 x 100 = 0,024 persen.", correct: true },
            { text: "2,4 persen", why: "Salah: 2,4 persen berarti 1.200 halaman, bukan 12." },
            { text: "12 persen — sama dengan jumlah halaman", why: "Salah: 12 adalah jumlah halaman, bukan persen." },
          ],
        },
        {
          q: "Query yang sama memberi jawaban berbeda tanpa perubahan data. Apa dugaan pertama?",
          options: [
            { text: "Cache aplikasi yang basi", why: "Salah: cache basi memberi jawaban lama yang konsisten — bukan jawaban yang berubah-ubah tiap eksekusi." },
            { text: "Indeks yang terlalu banyak", why: "Salah: indeks berlebih memperlambat tulis, bukan mengubah jawaban query." },
            { text: "Korupsi halaman — database membaca halaman rusak", why: "Tepat: jawaban yang berubah tanpa perubahan data adalah gejala klasik korupsi.", correct: true },
            { text: "Koneksi jaringan yang lambat", why: "Salah: jaringan lambat membuat query lama, bukan jawabannya berbeda." },
          ],
        },
        {
          q: "Backup 02:00, corrupt 14:35, WAL tiap 5 menit. Berapa RPO?",
          options: [
            { text: "12 jam 35 menit — dari backup terakhir", why: "Salah: WAL mengisi jarak antara backup dan insiden; yang hilang hanya sejak arsip WAL terakhir." },
            { text: "0 menit — WAL menjamin nol kehilangan", why: "Salah: WAL yang belum ter-arsip saat corrupt ikut hilang; RPO sama dengan interval arsip." },
            { text: "200 detik — waktu restore", why: "Salah: 200 detik adalah waktu restore (RTO), bukan kehilangan data (RPO)." },
            { text: "5 menit", why: "Tepat: arsip WAL tiap 5 menit berarti kehilangan maksimal 5 menit data.", correct: true },
          ],
        },
        {
          q: "Indeks korup di produksi. Perbaikan yang benar?",
          options: [
            { text: "REINDEX CONCURRENTLY setelah membuktikan dengan amcheck", why: "Tepat: diagnosis dulu, lalu bangun ulang tanpa blokir tulis.", correct: true },
            { text: "REINDEX biasa — paling cepat", why: "Salah: REINDEX biasa mengunci tulis; di produksi itu downtime." },
            { text: "DROP tabel dan buat ulang", why: "Salah: menghapus tabel menghancurkan data yang sehat bersama indeksnya." },
            { text: "Abaikan — planner akan memakai sequential scan", why: "Salah: scan penuh untuk tiap query adalah pelambatan permanen, bukan perbaikan." },
          ],
        },
        {
          q: "Job backup 'sukses' tiap malam selama setahun. Apa yang membuktikan backup itu berguna?",
          options: [
            { text: "Ukuran file backup normal tiap pagi", why: "Salah: ukuran normal tidak mendeteksi isi korup — kasus EduPay membuktikannya." },
            { text: "Restore percobaan berkala ke server staging yang berhasil", why: "Tepat: satu-satunya bukti backup bisa dipakai adalah restore yang pernah dilakukan.", correct: true },
            { text: "Ada 2 copy backup di lokasi berbeda", why: "Salah: 2 copy dari backup korup sama dengan 2x keyakinan palsu." },
            { text: "Job tidak pernah error", why: "Salah: job menyalin halaman rusak tanpa error — sukses job bukan sukses restore." },
          ],
        },
      ],
    },
  ],
};

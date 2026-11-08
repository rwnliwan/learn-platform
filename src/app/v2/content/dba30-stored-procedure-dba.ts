import type { V2Lesson } from "../lib/types";

export const dba30: V2Lesson = {
  slug: "dba30-stored-procedure-dba",
  track: "Database Administrator",
  module: "Fondasi Operasi",
  title: "DBA30 — Stored Procedure dari Sudut DBA: Logika di Dalam Database",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Prosedur yang berjalan 40 menit dan mengunci semua orang",
      prose: [
        "Jumat malam, prosedur bulanan tutup-buku EduPay berjalan 40 menit dan mengunci tabel transaksi — kasir tidak bisa menyimpan pembayaran selama itu. Developer berkata prosedurnya sudah benar: ia memindahkan 5.000 baris dengan benar. DBA berkata prosedurnya berbahaya: ia memindahkan 5.000 baris dalam satu transaksi raksasa tanpa batch, tanpa commit berkala, dan tanpa penanganan error per batch.",
        "Keduanya benar dari sudutnya masing-masing. Developer menilai kebenaran hasil; DBA menilai perilaku operasional: berapa lama lock dipegang, apa yang terjadi bila gagal di tengah, dan apakah prosedur itu bisa di-rerun dengan aman.",
        "Lesson ini mengajarkan stored procedure dari sudut DBA: batching, transaksi, error handling, keamanan, dan versioning. Setelah lesson ini kamu bisa: (1) membedakan logika yang pantas di database vs di aplikasi; (2) merancang prosedur batch yang aman; (3) menghitung batch dan waktu eksekusi; (4) menulis error handling yang tidak menyembunyikan kegagalan; (5) mengatur hak akses dan versioning prosedur.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Grep seluruh track DBA untuk frasa stored procedure menghasilkan 0 hit — tidak ada satu pun lesson yang membahas prosedur tersimpan. Lesson ini membangun topik itu dari sudut operasional DBA, bukan sudut developer: batch, lock, transaksi, dan rerun yang aman.",
      },
      reference: "5.000 baris, batch 500: 10 batch; 3 detik per batch: 30 detik; retry 2 batch gagal: tambah 6 detik, total 36 detik.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa me-review stored procedure seperti DBA: bukan apakah hasilnya benar, melainkan apakah ia aman dijalankan di produksi.",
        "(1) Memutuskan logika apa yang pantas tinggal di database;",
        "(2) Merancang batch dengan commit berkala dan ukuran yang terukur;",
        "(3) Menghitung jumlah batch dan total waktu eksekusi termasuk retry;",
        "(4) Menulis error handling: tangkap, catat, lanjut atau batalkan dengan sadar;",
        "(5) Mengatur SECURITY DEFINER, hak akses, dan versioning prosedur.",
      ],
      tasks: [],
    },
    {
      id: "batch-transaksi",
      eyebrow: "Langkah 3 · Teori",
      title: "Batch dan transaksi: kecil, ter-commit, bisa di-rerun",
      prose: [
        "Satu transaksi raksasa untuk 5.000 baris memegang lock selama 40 menit dan menahan semua tulis lain. Pecah menjadi batch 500 baris: 10 batch, masing-masing commit sendiri. Batch yang gagal hanya mengulang 500 baris, bukan 5.000 — dan lock terlama yang dipegang hanya selama satu batch.",
        "Hitungannya: 10 batch dikali 3 detik sama dengan 30 detik. Dua batch gagal dan di-retry: tambah 2 dikali 3 sama dengan 6 detik, total 36 detik. Bandingkan dengan 40 menit prosedur lama — dan dengan risiko lock yang hilang. Ukuran batch dipilih dari pengukuran: terlalu kecil berarti overhead commit mendominasi; terlalu besar berarti lock kembali panjang. Mulai dari 500 sampai 1.000, ukur, lalu sesuaikan.",
        "Idempotensi adalah syarat rerun: prosedur yang di-rerun tidak boleh menggandakan data. Polanya: tandai baris yang sudah diproses (kolom status atau tabel watermark), atau tulis dengan kunci yang membuat tulis kedua menjadi no-op. Prosedur tanpa idempotensi adalah prosedur yang hanya boleh jalan sekali — dan di produksi, semua hal akhirnya jalan dua kali.",
      ],
      tasks: [],
      note: {
        title: "Kapan logika TIDAK boleh di database",
        body: "Logika yang memanggil API luar, mengirim email, atau bergantung pada library aplikasi tidak tinggal di database — ia tidak bisa di-test seperti kode aplikasi, tidak bisa di-scale terpisah, dan gagalnya sulit dilacak. Aturan praktis: di database hanya logika yang dekat dengan data — validasi, agregasi, dan pemindahan antar tabel.",
      },
      reference: "Batch 500: 10 batch, 30 detik, retry 2 batch tambah 6 detik, total 36 detik. Bandingkan: prosedur lama 40 menit dengan satu lock raksasa.",
    },
    {
      id: "error-keamanan",
      eyebrow: "Langkah 4 · Teori",
      title: "Error handling dan keamanan: gagal dengan cara yang ketahuan",
      prose: [
        "Error handling yang buruk lebih berbahaya dari tidak ada error handling: prosedur yang menelan exception dan commit sebagian membuat data setengah jadi tanpa ada yang tahu. Pola yang benar: tangkap error per batch, tulis ke tabel log error (batch berapa, baris berapa, pesan apa), lalu putuskan — lanjut ke batch berikut atau batalkan seluruh run. Keputusan itu tertulis di prosedur, bukan di kepala operator.",
        "Keamanan: prosedur berjalan dengan hak pembuatnya (SECURITY DEFINER) atau pemanggilnya (SECURITY INVOKER). DEFINER memberi prosedur hak lebih dari pemanggil — berguna untuk prosedur tutup-buku yang butuh tulis ke tabel arsip, tetapi berbahaya bila prosedur menerima input mentah tanpa validasi: satu injeksi SQL di prosedur DEFINER adalah injeksi dengan hak pemilik tabel.",
        "Versioning: prosedur adalah kode — ia tinggal di version control, di-deploy lewat migrasi bernomor, dan perubahannya bisa di-rollback. Prosedur yang diubah langsung di produksi lewat klien SQL adalah prosedur yang tidak bisa dilacak siapa mengubah apa dan kapan. Aturan: tidak ada perubahan prosedur tanpa migrasi.",
      ],
      tasks: [],
      reference: "Tangkap error per batch, catat ke tabel log, putuskan lanjut atau batal. DEFINER: hak pemilik; validasi input wajib. Prosedur di-deploy lewat migrasi bernomor.",
    },
    {
      id: "lab-batch",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung batch dan waktu prosedur",
      prose: [
        "Lab ini menghitung aritmetika batch prosedur migrasi: jumlah batch, waktu normal, dan total waktu termasuk retry.",
        "Hitung dulu di kepala. Batch: 5.000 dibagi 500 sama dengan 10 batch. Waktu normal: 10 dikali 3 sama dengan 30 detik. Retry: 2 batch gagal dikali 3 detik sama dengan 6 detik. Total: 30 tambah 6 sama dengan 36 detik.",
        "Tugas lab: tulis fungsi yang menerima total baris, ukuran batch, detik per batch, dan jumlah batch gagal — lalu mencetak tiga angka: batch, waktu_detik, total_detik.",
        "Setelah lolos, coba eksperimen: ubah ukuran batch menjadi 1.000 dan lihat batch turun menjadi 5 dengan waktu 15 detik — lalu tanyakan: berapa lama lock terlama yang kamu berani pegang?",
      ],
      tasks: [
        { id: "t1", text: "Hitung batch dari total baris dan ukuran batch" },
        { id: "t2", text: "Hitung waktu_detik normal" },
        { id: "t3", text: "Hitung total_detik termasuk retry batch gagal" },
      ],
      expected: "batch=10\nwaktu_detik=30\ntotal_detik=36",
      hints: [
        "Batch = total baris dibagi ukuran batch.",
        "Waktu normal = batch dikali detik per batch.",
        "Total = waktu normal ditambah batch gagal dikali detik per batch.",
      ],
      code: {
        starter: `# Prosedur migrasi tutup-buku: 5.000 baris, batch 500.\ntotal_baris = 5000\nukuran_batch = 500\ndetik_per_batch = 3\nbatch_gagal = 2\n\n# TULIS KODEMU: hitung batch, waktu_detik, total_detik.\n# Cetak, per baris: batch, waktu_detik, total_detik.\n\n\nmesin_batch(total_baris, ukuran_batch, detik_per_batch, batch_gagal)`,
        lockLines: 5,
        solution: `# Prosedur migrasi tutup-buku: 5.000 baris, batch 500.\ntotal_baris = 5000\nukuran_batch = 500\ndetik_per_batch = 3\nbatch_gagal = 2\n\n\ndef mesin_batch(total_baris, ukuran_batch, detik_per_batch, batch_gagal):\n    batch = total_baris // ukuran_batch\n    waktu_detik = batch * detik_per_batch\n    total_detik = waktu_detik + batch_gagal * detik_per_batch\n    print(f"batch={batch}")\n    print(f"waktu_detik={waktu_detik}")\n    print(f"total_detik={total_detik}")\n\n\nmesin_batch(total_baris, ukuran_batch, detik_per_batch, batch_gagal)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "batch=10", label: "10 batch", msg: "5.000 / 500 = 10 batch." },
          { kind: "stdout_matches", task: "t2", pattern: "waktu_detik=30", label: "30 detik normal", msg: "10 batch x 3 detik = 30 detik." },
          { kind: "stdout_matches", task: "t3", pattern: "total_detik=36", label: "36 detik dengan retry", msg: "30 + 2 x 3 = 36 detik. Jauh dari 40 menit prosedur lama." },
        ],
      },
      reference: "10 batch, 30 detik normal, 36 detik dengan retry 2 batch.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: tutup-buku yang tidak lagi mengunci kasir",
      prose: [
        "Kembali ke EduPay. Prosedur tutup-buku ditulis ulang: batch 500 dengan commit per batch, watermark status per baris, error log per batch, dan retry hanya untuk batch gagal. Waktu eksekusi turun dari 40 menit menjadi 36 detik — dan lock terlama yang dipegang hanya 3 detik, di tengah malam pula.",
        "Tiga bulan kemudian prosedur itu gagal di batch ke-7 karena satu baris korup. Operator tidak panik: log menunjukkan batch 7, baris ke-3.412, pesan error jelas. Baris itu diperbaiki, batch 7 di-rerun sendiri, dan 9 batch lain tidak disentuh. Tutup-buku selesai 10 menit terlambat — bukan 40 menit, dan tanpa mengunci kasir.",
        "Keputusan rapat: semua prosedur batch baru wajib lolos review DBA dengan checklist — batch, idempotensi, error log, dan migrasi bernomor. Prosedur lama yang masih satu transaksi raksasa didaftar untuk ditulis ulang.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat prosedur baru aman. Pertama, batch kecil dengan commit berkala — lock pendek, gagal murah. Kedua, idempotensi lewat watermark — rerun tidak menggandakan. Ketiga, error log per batch — kegagalan ketahuan barisnya, bukan sekadar 'prosedur gagal'.",
      },
      reference: "40 menit menjadi 36 detik; lock terlama 3 detik; gagal batch 7 diperbaiki dengan rerun satu batch.",
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
        "Lab: 10 batch, 30 detik normal, 36 detik dengan retry 2 batch.",
        "Batch kecil: lock pendek, gagal murah, rerun hanya batch yang gagal.",
        "Idempotensi lewat watermark atau kunci — rerun tidak menggandakan.",
        "Error ditangkap per batch, dicatat ke log, diputuskan lanjut atau batal.",
        "Prosedur adalah kode: version control dan migrasi bernomor.",
      ],
      next: { label: "DBA31 — Indeks Mendalam: Jenis, Statistik, dan Maintenance", href: "/v2/learn/dba31-indeks-mendalam" },
      quiz: [
        {
          q: "Prosedur memindahkan 5.000 baris, batch 500, 3 detik per batch, 2 batch gagal dan di-retry. Total waktu?",
          options: [
            { text: "30 detik — retry tidak dihitung", why: "Salah: retry memakan waktu nyata; 2 batch gagal berarti 6 detik tambahan." },
            { text: "36 detik", why: "Tepat: 10 batch x 3 = 30 detik, tambah 2 x 3 = 6 detik retry, total 36 detik.", correct: true },
            { text: "40 menit — sama seperti prosedur lama", why: "Salah: 40 menit adalah prosedur lama satu transaksi raksasa; batching memangkasnya menjadi detik." },
            { text: "15 detik — batch dihitung setengah", why: "Salah: tidak ada yang dibelah dua; 10 batch x 3 detik = 30 detik, bukan 15." },
          ],
        },
        {
          q: "Kenapa satu transaksi raksasa untuk 5.000 baris berbahaya?",
          options: [
            { text: "Ia memakai terlalu sedikit memori", why: "Salah: transaksi raksasa justru memakai lebih banyak log dan lock, bukan lebih sedikit." },
            { text: "Ia tidak bisa memakai indeks", why: "Salah: transaksi tidak ada hubungannya dengan pemakaian indeks." },
            { text: "Ia memegang lock selama seluruh eksekusi dan gagal berarti mengulang semuanya", why: "Tepat: lock panjang memblokir tulis lain; gagal di baris terakhir berarti 5.000 baris diulang.", correct: true },
            { text: "Ia selalu lebih cepat dari batch", why: "Salah: satu commit besar bukan jaminan cepat — dan harga kegagalannya jauh lebih mahal." },
          ],
        },
        {
          q: "Prosedur di-rerun setelah timeout. Apa yang mencegah data ganda?",
          options: [
            { text: "Menjalankan rerun di malam hari", why: "Salah: jam eksekusi tidak mencegah duplikasi." },
            { text: "Menghapus log error sebelum rerun", why: "Salah: menghapus log justru menghilangkan jejak apa yang sudah diproses." },
            { text: "Menambah ukuran batch saat rerun", why: "Salah: ukuran batch tidak ada hubungannya dengan duplikasi." },
            { text: "Idempotensi: watermark status atau kunci yang membuat tulis kedua menjadi no-op", why: "Tepat: rerun hanya aman bila tulis kedua tidak menggandakan baris.", correct: true },
          ],
        },
        {
          q: "Prosedur menelan exception lalu commit sebagian. Apa bahayanya?",
          options: [
            { text: "Data setengah jadi tanpa ada yang tahu — kegagalan disembunyikan", why: "Tepat: error handling yang menelan error membuat kegagalan tidak ketahuan.", correct: true },
            { text: "Tidak ada — commit sebagian lebih baik dari gagal total", why: "Salah: data setengah jadi tanpa jejak error adalah kerusakan diam-diam yang ditemukan berminggu-minggu kemudian." },
            { text: "Prosedur menjadi lebih lambat", why: "Salah: kecepatan bukan masalahnya — ketidakjujuran statusnya yang berbahaya." },
            { text: "Tabel log menjadi penuh", why: "Salah: justru tidak ada yang ditulis ke log — itulah masalahnya." },
          ],
        },
        {
          q: "Logika apa yang TIDAK pantas tinggal di stored procedure?",
          options: [
            { text: "Validasi antar tabel sebelum tulis", why: "Salah: validasi dekat dengan data adalah kasus klasik yang pantas di database." },
            { text: "Memanggil API luar dan mengirim email", why: "Tepat: logika yang bergantung pada dunia luar sulit di-test, di-scale, dan dilacak gagalnya dari database.", correct: true },
            { text: "Agregasi bulanan untuk laporan", why: "Salah: agregasi dekat dengan data dan cocok di database." },
            { text: "Pemindahan baris antar tabel arsip", why: "Salah: pemindahan antar tabel adalah pekerjaan database yang wajar." },
          ],
        },
      ],
    },
  ],
};

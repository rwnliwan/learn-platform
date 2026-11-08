import type { V2Lesson } from "../lib/types";

export const dba33: V2Lesson = {
  slug: "dba33-data-pump-sqlloader-flashback",
  track: "Database Administrator",
  module: "Fondasi Operasi",
  title: "DBA33 — Data Pump, SQL*Loader, dan Flashback: Pindah dan Kembalikan Data Oracle",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "DELETE tanpa WHERE, dan 2,1 juta baris yang hilang dalam 3 detik",
      prose: [
        "Jumat 16:40, analis magang FinLog menjalankan DELETE FROM transaksi tanpa WHERE di database produksi — 2,1 juta baris hilang dalam 3 detik. Database-nya sehat; tidak ada disk rusak. Yang hilang adalah data — dan backup semalam tidak bisa mengembalikan 5 menit terakhir tanpa kehilangan transaksi sore itu.",
        "DBA senior tidak me-restore backup. Ia memakai flashback: mengembalikan tabel ke keadaan 13:59, satu menit sebelum DELETE — 2,1 juta baris kembali dalam hitungan menit, tanpa kehilangan transaksi lain. Di minggu yang sama, tim migrasi memakai Data Pump untuk memindahkan skema 40 GB ke server baru, dan SQL*Loader untuk memuat 1 juta baris file CSV — 2.500 baris ditolak karena format tanggal salah.",
        "Lesson ini mengajarkan tiga perkakas Oracle: Data Pump untuk pindah, SQL*Loader untuk muat massal, dan flashback untuk kembali. Setelah lesson ini kamu bisa: (1) menghitung waktu export Data Pump paralel; (2) membaca dan memperbaiki file bad SQL*Loader; (3) memakai flashback query dan flashback table; (4) menghitung tingkat penolakan load; (5) memutuskan kapan flashback cukup dan kapan butuh restore.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DBA21 menyinggung flashback dalam satu kalimat (delayed apply atau flashback sebagai pelindung dari DELETE yang salah) dan DBA4 menyebut flashback hanya sebagai distractor kuis. Tidak ada lesson yang mengajarkan Data Pump, SQL*Loader, atau flashback sebagai perkakas — tidak ada hitungan waktu export, tidak ada file bad, tidak ada langkah flashback. Lesson ini membangun ketiganya.",
      },
      reference: "Export 40.000 MB paralel 4 (600 MB per detik): 66,7 menit. SQL*Loader: 1.000.000 baris, 2.500 ditolak (0,25 persen), 997.500 dimuat. Flashback: 2,1 juta baris kembali.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memindahkan data Oracle dalam jumlah besar dan mengembalikan kesalahan manusia tanpa restore semalam suntuk.",
        "(1) Menghitung waktu Data Pump dari ukuran, paralelisme, dan throughput;",
        "(2) Menjalankan SQL*Loader dan membaca file bad serta file discard;",
        "(3) Memakai flashback query untuk melihat data sebelum kesalahan;",
        "(4) Memakai flashback table untuk mengembalikan tabel;",
        "(5) Memutuskan flashback vs restore dari jendela undo dan cakupan kerusakan.",
      ],
      tasks: [],
    },
    {
      id: "datapump-loader",
      eyebrow: "Langkah 3 · Teori",
      title: "Data Pump dan SQL*Loader: pindah dan muat massal",
      prose: [
        "Data Pump (expdp dan impdp) adalah perkakas export-import Oracle: cepat karena paralel dan membaca langsung dari file data. Hitung waktunya sebelum berjanji: 40.000 MB dengan paralel 4 dan throughput 150 MB per detik per worker berarti 600 MB per detik — 40.000 dibagi 600 sama dengan 66,7 menit. Paralelisme bukan sulap: ia dibatasi CPU, I/O, dan jumlah dump file — menaikkan paralel di atas jumlah worker yang didukung hanya menambah antrean.",
        "SQL*Loader memuat file flat ke tabel dengan kecepatan tinggi lewat direct path — melewati buffer cache dan menulis langsung ke file data. Harganya: direct path mengunci tabel untuk tulis lain dan tidak mencatat redo sebanyak conventional path. File bad menampung baris yang ditolak (format salah, tanggal tidak valid): 2.500 dari 1.000.000 berarti 0,25 persen ditolak dan 997.500 dimuat. File bad bukan sampah — ia adalah daftar perbaikan: tiap baris di sana punya alasan penolakan yang bisa diperbaiki dan di-load ulang.",
        "Aturan load massal: muat ke tabel staging dulu, validasi di staging, baru pindah ke tabel produksi. Load langsung ke produksi berarti baris buruk dan baris baik tercampur — dan membersihkannya lebih mahal dari staging itu sendiri.",
      ],
      tasks: [],
      note: {
        title: "Direct path vs conventional path",
        body: "Conventional path memakai INSERT biasa: lewat buffer cache, mencatat redo penuh, dan membiarkan tulis lain berjalan. Direct path menulis langsung: jauh lebih cepat untuk jutaan baris, tetapi mengunci tabel dan membuat indeks tidak terpakai selama load (indeks dibangun ulang sesudahnya). Pilih conventional untuk load kecil yang butuh konkurensi; direct untuk load besar di jendela sepi.",
      },
      reference: "40.000 MB / 600 MB per detik = 66,7 menit. SQL*Loader: 2.500 ditolak (0,25 persen), 997.500 dimuat. Muat ke staging dulu.",
    },
    {
      id: "flashback",
      eyebrow: "Langkah 4 · Teori",
      title: "Flashback: kembali tanpa restore",
      prose: [
        "Flashback query melihat data seperti pada waktu tertentu: SELECT dari tabel AS OF TIMESTAMP satu menit sebelum DELETE menunjukkan 2,1 juta baris yang hilang — tanpa mengubah apa pun. Itu langkah diagnosis: buktikan dulu datanya masih bisa dilihat, baru kembalikan.",
        "Flashback table mengembalikan tabel ke keadaan masa lalu memakai undo data: FLASHBACK TABLE transaksi TO TIMESTAMP satu menit sebelum DELETE. Syaratnya: undo retention masih mencakup jendela itu, dan tidak ada perubahan DDL pada tabel sejak saat itu (DDL memutus rantai flashback). Bila undo sudah terhapus, flashback gagal — dan saat itulah restore dari backup menjadi satu-satunya jalan.",
        "Batas yang wajib dihafal: flashback memperbaiki kesalahan logis (DELETE salah, UPDATE salah) dalam jendela undo — biasanya menit sampai jam. Ia tidak memperbaiki kerusakan fisik (disk rusak, file hilang) dan tidak mengembalikan database yang sudah di-drop. Keputusan flashback vs restore ditanyakan dalam satu kalimat: apakah undo masih mencakup saat sebelum kesalahan, dan apakah hanya tabel ini yang rusak?",
      ],
      tasks: [],
      reference: "Flashback query: lihat dulu, ubah belakangan. Flashback table butuh undo retention dan tanpa DDL sejak saat itu. Bukan obat kerusakan fisik.",
    },
    {
      id: "lab-oracle",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung waktu export dan tingkat penolakan load",
      prose: [
        "Lab ini menghitung aritmetika Data Pump dan SQL*Loader dari angka mentah migrasi.",
        "Hitung dulu di kepala. Throughput paralel: 4 dikali 150 sama dengan 600 MB per detik. Waktu export: 40.000 dibagi 600 sama dengan 66,7 menit (dibulatkan 1 desimal). Baris dimuat: 1.000.000 dikurangi 2.500 sama dengan 997.500. Persen ditolak: 2.500 dibagi 1.000.000 dikali 100 sama dengan 0,25 persen.",
        "Tugas lab: tulis fungsi yang menerima ukuran MB, paralel, throughput per worker, total baris, dan baris ditolak — lalu mencetak tiga angka: waktu_menit, dimuat, ditolak_persen.",
        "Setelah lolos, coba eksperimen: naikkan paralel menjadi 8 dan lihat waktu turun menjadi 33,3 menit — lalu tanyakan: apakah CPU dan I/O server barumu sanggup 8 worker?",
      ],
      tasks: [
        { id: "t1", text: "Hitung waktu_menit export Data Pump" },
        { id: "t2", text: "Hitung dimuat dari total dan ditolak" },
        { id: "t3", text: "Hitung ditolak_persen" },
      ],
      expected: "waktu_menit=66.7\ndimuat=997500\nditolak_persen=0.25",
      hints: [
        "Throughput total = paralel dikali throughput per worker.",
        "Waktu = ukuran dibagi throughput total, bulatkan 1 desimal.",
        "Persen ditolak = ditolak dibagi total, dikali 100.",
      ],
      code: {
        starter: `# Migrasi FinLog: export Data Pump + load SQL*Loader.\nukuran_mb = 40000\nparalel = 4\nthroughput_worker = 150\ntotal_baris = 1000000\nditolak = 2500\n\n# TULIS KODEMU: hitung waktu_menit, dimuat, ditolak_persen.\n# Cetak, per baris: waktu_menit, dimuat, ditolak_persen.\n\n\nmesin_oracle(ukuran_mb, paralel, throughput_worker, total_baris, ditolak)`,
        lockLines: 6,
        solution: `# Migrasi FinLog: export Data Pump + load SQL*Loader.\nukuran_mb = 40000\nparalel = 4\nthroughput_worker = 150\ntotal_baris = 1000000\nditolak = 2500\n\n\ndef mesin_oracle(ukuran_mb, paralel, throughput_worker, total_baris, ditolak):\n    throughput = paralel * throughput_worker\n    waktu_menit = round(ukuran_mb / throughput, 1)\n    dimuat = total_baris - ditolak\n    ditolak_persen = ditolak / total_baris * 100\n    print(f"waktu_menit={waktu_menit}")\n    print(f"dimuat={dimuat}")\n    print(f"ditolak_persen={ditolak_persen}")\n\n\nmesin_oracle(ukuran_mb, paralel, throughput_worker, total_baris, ditolak)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "waktu_menit=66.7", label: "Export 66,7 menit", msg: "40.000 / (4 x 150) = 40.000 / 600 = 66,7 menit." },
          { kind: "stdout_matches", task: "t2", pattern: "dimuat=997500", label: "997.500 baris dimuat", msg: "1.000.000 - 2.500 = 997.500." },
          { kind: "stdout_matches", task: "t3", pattern: "ditolak_persen=0.25", label: "Ditolak 0,25 persen", msg: "2.500 / 1.000.000 x 100 = 0,25 persen. Perbaiki file bad dan load ulang." },
        ],
      },
      reference: "Export 66,7 menit; dimuat 997.500; ditolak 0,25 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: 2,1 juta baris kembali tanpa restore",
      prose: [
        "Kembali ke FinLog. DBA menjalankan flashback query AS OF TIMESTAMP 13:59 — 2,1 juta baris terlihat lagi. Undo retention 4 jam masih mencakup jendela itu, dan tidak ada DDL sejak DELETE. FLASHBACK TABLE dijalankan: 2,1 juta baris kembali dalam 6 menit. Transaksi sore yang masuk setelah DELETE tidak tersentuh — flashback hanya mengembalikan tabel ke keadaan 13:59 untuk baris yang berubah, dan transaksi baru setelah itu tetap tercatat lewat undo yang sama.",
        "Perbaikan permanennya: akun analis magang dicabut hak DELETE di produksi; DELETE produksi wajib memakai transaksi dengan SELECT hitungan dulu; undo retention dinaikkan dari 1 jam ke 4 jam; dan prosedur flashback ditulis di runbook dengan contoh perintah lengkap.",
        "Keputusan rapat: flashback adalah garis pertahanan pertama untuk kesalahan logis — restore backup adalah garis terakhir. Keduanya diuji: flashback diuji tiap kuartal, restore diuji tiap semester.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat penyelamatan ini berhasil. Pertama, diagnosis dulu lewat flashback query — bukti sebelum tindakan. Kedua, undo retention yang cukup — flashback hanya sebagus jendela undo-nya. Ketiga, perbaikan permanen menyentuh hak akses dan prosedur, bukan sekadar mengembalikan data.",
      },
      reference: "Flashback query membuktikan data terlihat; flashback table mengembalikan 2,1 juta baris dalam 6 menit; undo retention naik ke 4 jam.",
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
        "Lab: export 66,7 menit; dimuat 997.500; ditolak 0,25 persen.",
        "Data Pump paralel dibatasi CPU, I/O, dan dump file — bukan sulap.",
        "SQL*Loader: file bad adalah daftar perbaikan, bukan sampah; muat ke staging dulu.",
        "Flashback query membuktikan dulu; flashback table mengembalikan — butuh undo retention dan tanpa DDL.",
        "Flashback untuk kesalahan logis dalam jendela undo; kerusakan fisik butuh restore.",
      ],
      next: { label: "DBA34 — Troubleshooting dan Korupsi Data: Saat Database Tidak Bisa Dipercaya", href: "/v2/learn/dba34-troubleshooting-korupsi-data" },
      quiz: [
        {
          q: "Export 40.000 MB, paralel 4, throughput 150 MB per detik per worker. Berapa waktu export?",
          options: [
            { text: "66,7 menit", why: "Tepat: throughput total 600 MB per detik; 40.000 / 600 = 66,7 menit.", correct: true },
            { text: "266,7 menit — paralel tidak dihitung", why: "Salah: paralel mengalikan throughput; 40.000 / 150 = 266,7 mengabaikan 4 worker." },
            { text: "16,7 menit — ukuran dibagi paralel dua kali", why: "Salah: tidak ada pembagian ganda; throughput total adalah 4 x 150." },
            { text: "40 menit — satu menit per GB", why: "Salah: tidak ada aturan satu menit per GB; hitung dari throughput." },
          ],
        },
        {
          q: "SQL*Loader: 1.000.000 baris, 2.500 ditolak. Berapa dimuat dan persen ditolak?",
          options: [
            { text: "Dimuat 997.500, ditolak 2,5 persen", why: "Salah: 2.500 / 1.000.000 = 0,0025 = 0,25 persen, bukan 2,5 persen." },
            { text: "Dimuat 997.500, ditolak 0,25 persen", why: "Tepat: 1.000.000 - 2.500 = 997.500; 2.500 / 1.000.000 = 0,25 persen.", correct: true },
            { text: "Dimuat 1.000.000, ditolak 0 persen — file bad diabaikan", why: "Salah: baris ditolak tidak masuk tabel; mengabaikannya berarti laporan kehilangan 2.500 baris." },
            { text: "Dimuat 975.000, ditolak 2,5 persen", why: "Salah: 1.000.000 - 2.500 = 997.500, bukan 975.000." },
          ],
        },
        {
          q: "DELETE tanpa WHERE baru saja terjadi. Langkah pertama yang benar?",
          options: [
            { text: "Langsung restore backup semalam", why: "Salah: restore kehilangan transaksi setelah backup; flashback query dulu untuk membuktikan data masih bisa dilihat." },
            { text: "Jalankan DELETE lagi untuk membersihkan sisa", why: "Salah: DELETE kedua hanya menambah kerusakan." },
            { text: "Flashback query AS OF TIMESTAMP sebelum DELETE — buktikan datanya terlihat", why: "Tepat: diagnosis dulu, tindakan kemudian; flashback query tidak mengubah apa pun.", correct: true },
            { text: "Restart database", why: "Salah: restart tidak mengembalikan baris yang terhapus." },
          ],
        },
        {
          q: "Kapan flashback table GAGAL menyelamatkan tabel?",
          options: [
            { text: "Tabelnya terlalu besar", why: "Salah: ukuran memengaruhi waktu, bukan kemungkinan flashback." },
            { text: "DELETE dilakukan di hari Jumat", why: "Salah: hari tidak relevan — jendela undo yang relevan." },
            { text: "Ada indeks pada tabel", why: "Salah: indeks tidak menghalangi flashback." },
            { text: "Undo retention sudah tidak mencakup saat sebelum kesalahan, atau ada DDL sejak saat itu", why: "Tepat: flashback hidup dari undo; DDL memutus rantainya.", correct: true },
          ],
        },
        {
          q: "Kenapa load massal memakai tabel staging dulu?",
          options: [
            { text: "Baris buruk tertahan di staging; hanya baris tervalidasi yang pindah ke produksi", why: "Tepat: membersihkan campuran buruk dan baik di produksi jauh lebih mahal.", correct: true },
            { text: "Supaya load lebih lambat dan aman", why: "Salah: staging bukan soal kecepatan — soal isolasi baris buruk dari produksi." },
            { text: "Staging membuat file bad tidak diperlukan", why: "Salah: file bad tetap diperlukan sebagai daftar perbaikan." },
            { text: "Produksi tidak bisa menerima load langsung", why: "Salah: produksi bisa — hanya saja berisiko; staging adalah pilihan disiplin, bukan keterbatasan teknis." },
          ],
        },
      ],
    },
  ],
};

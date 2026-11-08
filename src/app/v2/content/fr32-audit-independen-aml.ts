import type { V2Lesson } from "../lib/types";

export const fr32: V2Lesson = {
  slug: "fr32-audit-independen-aml",
  track: "Fraud & AML Analytics",
  module: "AML & Kepatuhan",
  title: "FR32 — Audit Independen Program AML: Menguji Penjaga",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Program AML yang lulus uji sendiri, gagal di uji independen",
      prose: [
        "Sebuah bank menjalankan program AML selama tiga tahun dan selalu lulus penilaian internalnya sendiri: transaction monitoring berjalan, STR terkirim tepat waktu, pelatihan selesai 100 persen. Lalu datang audit independen — auditor dari luar yang tidak terlibat merancang program itu. Dalam 300 keputusan STR yang disampel dari 12.000 keputusan setahun, auditor menemukan 9 kesalahan. Tetapi 9 dari 300 TIDAK berarti 3,0 persen dari 12.000 — sampelnya berstrata: 200 keputusan 'melapor' (5 salah, 2,5 persen) dan 100 keputusan 'tidak melapor' (4 salah, 4,0 persen), sementara di populasi 'tidak melapor' hanya 1.200 dari 12.000. Proyeksi yang benar memakai BOBOT strata: 2,5 persen × 10.800 + 4,0 persen × 1.200 = 270 + 48 = 318 keputusan salah setahun. Hitungan naif 9/300 = 3,0 persen → 360 melebih-lebihkan karena strata yang error-nya lebih tinggi sengaja di-oversample. Lebih penting lagi: dari 450 nasabah berisiko tinggi, hanya 405 yang EDD-nya masih berlaku dan lolos reviu kualitas — cakupan 90,0 persen, berarti 45 nasabah paling berisiko justru EDD-nya belum pernah dilakukan atau sudah kedaluwarsa.",
        "Temuan itu bukan dakwaan bahwa programnya buruk — proyeksi tertimbang 318 keputusan salah setahun dan cakupan 90,0 persen adalah program yang bekerja tetapi berlubang. Temuan itu adalah alasan audit independen ada: penjaga tidak bisa menguji dirinya sendiri. Lesson ini mengajarkan cara kerja audit independen program AML — ruang lingkup, sampling, pengujian, dan tindak lanjut — serta cara membaca hasilnya tanpa defensif.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "FR15 mengajarkan AML — placement, layering, integration, structuring, transaction monitoring, dan STR — tetapi dari sudut OPERATOR program. Audit independen tidak pernah disebut di track FR (pencarian 'audit independen' menghasilkan nol). Lesson ini membangun sudut pengujinya: siapa mengaudit, apa yang diuji, dan bagaimana hasilnya dibaca.",
      },
      reference: "300 sampel berstrata (200 melapor: 5 salah; 100 tidak melapor: 4 salah): proyeksi TERTIMBANG 318 (bukan 360 naif). Nasabah risiko tinggi: 405 dari 450 EDD berlaku (90,0 persen).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang dan membaca audit independen program AML.",
        "(1) Menjelaskan kenapa audit AML harus independen dan apa yang dimaksud independen;",
        "(2) Menghitung error rate sampel dan proyeksinya ke populasi;",
        "(3) Menghitung cakupan enhanced due diligence atas nasabah berisiko tinggi;",
        "(4) Menyebutkan lima area yang wajib diuji audit AML;",
        "(5) Menilai temuan audit: mana yang kritis, mana yang administratif, dan bagaimana tindak lanjutnya.",
      ],
      tasks: [],
    },
    {
      id: "independen",
      eyebrow: "Langkah 3 · Teori",
      title: "Independen berarti apa — dan lima area yang diuji",
      prose: [
        "Independen berarti tiga hal. Pertama, auditor tidak terlibat merancang atau menjalankan program yang diaudit — ia tidak menguji pekerjaannya sendiri. Kedua, auditor melapor ke dewan atau komite audit, bukan ke kepala kepatuhan yang programnya diaudit — garis lapor yang bengkok membuat temuan lunak. Ketiga, auditor punya akses penuh — ke data, sistem, dan orang — tanpa perlu izin dari yang diaudit. Audit yang butuh izin dari yang diaudit bukan audit.",
        "Lima area yang wajib diuji. Satu: tata kelola — apakah ada penanggung jawab program, kebijakan tertulis, dan pelaporan ke dewan. Dua: penilaian risiko — apakah risk assessment mutakhir dan apakah ia benar-benar mengarahkan sumber daya ke risiko tertinggi. Tiga: transaction monitoring — apakah aturan deteksinya masuk akal, apakah alert ditindaklanjuti tepat waktu, dan apakah ambangnya pernah dikalibrasi. Empat: pelaporan STR — apakah keputusan melapor atau tidak melapor didokumentasikan dengan alasan. Lima: pelatihan dan pengujian — apakah staf yang berhadapan dengan nasabah benar-benar bisa mengenali red flag.",
        "Kesalahan yang paling sering ditemukan bukan di area yang glamor. Bukan di model monitoring yang canggih, melainkan di hal dasar: keputusan 'tidak melapor' yang tidak didokumentasikan, nasabah berisiko tinggi yang EDD-nya kedaluwarsa, dan risk assessment yang tidak diperbarui setelah produk baru diluncurkan. Audit independen adalah pengingat bahwa program AML hidup di dokumen dan disiplin, bukan di slide presentasi.",
      ],
      tasks: [],
      note: {
        title: "Audit bukan musuh kepatuhan",
        body: "Tim kepatuhan yang defensif terhadap audit independen sedang melindungi egonya, bukan programnya. Temuan audit adalah hadiah: ia menunjukkan lubang sebelum regulator yang menemukannya — dan regulator tidak memberi hadiah, ia memberi sanksi.",
      },
      reference: "Lima area: tata kelola, penilaian risiko, transaction monitoring, pelaporan STR, pelatihan.",
    },
    {
      id: "sampling",
      eyebrow: "Langkah 4 · Teori",
      title: "Sampling: dari 300 keputusan ke 12.000",
      prose: [
        "Audit tidak memeriksa semua 12.000 keputusan STR setahun — ia mengambil sampel 300 dan menghitung error rate per strata. Strata 'melapor': 5 salah dari 200 = 2,5 persen; populasi strata itu 10.800 → proyeksi 270. Strata 'tidak melapor': 4 salah dari 100 = 4,0 persen; populasi strata itu 1.200 → proyeksi 48. Total proyeksi TERTIMBANG: 270 + 48 = 318 keputusan salah setahun. Hitungan naif 9/300 = 3,0 persen → 360 SALAH karena mengabaikan bobot: strata 'tidak melapor' yang error-nya lebih tinggi sengaja diambil dengan porsi lebih besar dari proporsinya di populasi (oversampling), sehingga rata-rata tanpa bobot melebih-lebihkan. Proyeksi ini adalah estimasi, bukan kepastian — tetapi ia mengubah 9 kesalahan yang terasa kecil menjadi 318 yang tidak bisa diabaikan.",
        "Sampel yang baik bukan sampel yang nyaman. Ia acak — bukan 300 keputusan termudah — dan ia berstrata: keputusan 'tidak melapor' diambil dengan porsi LEBIH BESAR dari proporsinya di populasi (oversampling — bukan 'proporsional lebih banyak', frasa itu kontradiktif: proporsional berarti sesuai proporsi), karena di situlah kesalahan paling mahal bersembunyi (STR yang tidak terkirim tidak pernah terlihat). Sampel yang hanya mengambil keputusan 'melapor' akan selalu terlihat bagus — karena yang diperiksa hanyalah yang sudah dianggap bermasalah.",
        "Cakupan EDD dihitung terpisah — dan 'pernah menjalani EDD' TIDAK sama dengan 'EDD-nya berlaku'. Nasabah yang EDD-nya dilakukan tiga tahun lalu lalu risikonya berubah, atau yang EDD-nya dilakukan tetapi tidak pernah direviu kualitasnya, tidak boleh dihitung sebagai 'tercakup'. Di lesson ini 405 dari 450 berarti EDD masih berlaku (dalam siklus reviu, misalnya 12 bulan) DAN lolos reviu kualitas — 405 dibagi 450 dikali 100 sama dengan 90,0 persen. Sisanya 45 nasabah adalah temuan tersendiri: bukan soal berapa persen, melainkan siapa mereka — bila di antara 45 itu ada nasabah yang transaksinya paling besar, cakupan 90 persen itu menyesatkan. Audit yang baik selalu menyebut nama dan nilai, bukan hanya persen.",
      ],
      tasks: [],
      note: {
        title: "Error rate 3 persen: besar atau kecil?",
        body: "Tidak ada ambang universal — tetapi bayangkan: 318 keputusan salah setahun berarti hampir satu per hari. Bila satu dari 318 itu adalah kasus pencucian yang tidak dilaporkan, biayanya bukan statistik — ia adalah sanksi regulator dan reputasi. Yang dinilai bukan hanya ratenya, melainkan jenis kesalahannya.",
      },
      reference: "Proyeksi TERTIMBANG 318 (270 + 48) — bukan 360 naif. Cakupan EDD 90,0 persen (EDD berlaku + lolos reviu); 45 nasabah belum/tidak berlaku.",
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung error rate dan cakupan audit AML",
      prose: [
        "Lab ini menghitung tiga angka audit dari data cerita pembuka: error rate per strata, proyeksi TERTIMBANG kesalahan ke populasi, dan cakupan EDD yang masih berlaku. Hitung dulu di kepala. Melapor: 5 dibagi 200 dikali 100 sama dengan 2,5 persen → proyeksi 2,5 persen dari 10.800 sama dengan 270. Tidak melapor: 4 dibagi 100 dikali 100 sama dengan 4,0 persen → proyeksi 4,0 persen dari 1.200 sama dengan 48. Total proyeksi: 270 + 48 = 318 keputusan (bukan 360 dari hitungan naif 9/300). Cakupan EDD: 405 dibagi 450 dikali 100 sama dengan 90,0 persen.",
        "Tugas lab: isi empat variabel — error_melapor, error_tidak, proyeksi_salah, cakupan_edd — lalu cetak keempatnya. Empat angka ini adalah ringkasan eksekutif laporan audit: seberapa sering program salah di tiap strata, seberapa besar skalanya setelah dibobot, dan siapa yang EDD-nya belum berlaku.",
        "Setelah lolos, coba eksperimen: naikkan kesalahan sampel strata 'tidak melapor' menjadi 8 dari 100 (8,0 persen) dan lihat proyeksi naik menjadi 270 + 96 = 366 — lalu tanyakan: pada error rate berapa komite audit harus meminta rencana perbaikan 30 hari, bukan 90 hari? Jawabannya ada di kebijakan: tetapkan ambangnya sebelum audit, bukan setelah melihat hasilnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung error rate per strata (melapor dan tidak melapor) dalam persen" },
        { id: "t2", text: "Hitung proyeksi TERTIMBANG keputusan salah setahun" },
        { id: "t3", text: "Hitung cakupan EDD yang masih berlaku dalam persen" },
      ],
      expected: "error_melapor=2.5\nerror_tidak=4.0\nproyeksi_salah=318.0\ncakupan_edd=90.0",
      hints: [
        "Error rate per strata = kesalahan strata dibagi sampel strata, dikali 100.",
        "Proyeksi = jumlah (error rate strata dibagi 100 dikali populasi strata) — JANGAN pakai rata-rata tanpa bobot.",
        "Cakupan EDD = nasabah dengan EDD berlaku dibagi total nasabah berisiko tinggi, dikali 100.",
      ],
      code: {
        starter: "# Audit independen program AML setahun. JANGAN UBAH.\nsampel_melapor, salah_melapor, populasi_melapor = 200, 5, 10800\nsampel_tidak, salah_tidak, populasi_tidak = 100, 4, 1200\nedd_diaudit = 405\nnasabah_risiko_tinggi = 450\n\n# TULIS KODEMU: error rate per strata, proyeksi TERTIMBANG, cakupan EDD\nerror_melapor = \nerror_tidak = \nproyeksi_salah = \ncakupan_edd = \nprint(f\"error_melapor={round(error_melapor, 1)}\")\nprint(f\"error_tidak={round(error_tidak, 1)}\")\nprint(f\"proyeksi_salah={round(proyeksi_salah, 1)}\")\nprint(f\"cakupan_edd={round(cakupan_edd, 1)}\")",
        lockLines: 6,
        solution: "# Audit independen program AML setahun. JANGAN UBAH.\nsampel_melapor, salah_melapor, populasi_melapor = 200, 5, 10800\nsampel_tidak, salah_tidak, populasi_tidak = 100, 4, 1200\nedd_diaudit = 405\nnasabah_risiko_tinggi = 450\n\n# TULIS KODEMU: error rate per strata, proyeksi TERTIMBANG, cakupan EDD\nerror_melapor = salah_melapor / sampel_melapor * 100\nerror_tidak = salah_tidak / sampel_tidak * 100\nproyeksi_salah = error_melapor / 100 * populasi_melapor + error_tidak / 100 * populasi_tidak\ncakupan_edd = edd_diaudit / nasabah_risiko_tinggi * 100\nprint(f\"error_melapor={round(error_melapor, 1)}\")\nprint(f\"error_tidak={round(error_tidak, 1)}\")\nprint(f\"proyeksi_salah={round(proyeksi_salah, 1)}\")\nprint(f\"cakupan_edd={round(cakupan_edd, 1)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "error_melapor=2.5", label: "Error melapor 2,5 persen", msg: "5 / 200 x 100 = 2,5." },
          { kind: "stdout_matches", task: "t1", pattern: "error_tidak=4.0", label: "Error tidak-melapor 4,0 persen", msg: "4 / 100 x 100 = 4,0. Strata yang di-oversample memang error-nya lebih tinggi." },
          { kind: "stdout_matches", task: "t2", pattern: "proyeksi_salah=318.0", label: "Proyeksi tertimbang 318 keputusan salah", msg: "270 + 48 = 318. Hitungan naif 9/300 x 12.000 = 360 melebih-lebihkan karena mengabaikan bobot strata." },
          { kind: "stdout_matches", task: "t3", pattern: "cakupan_edd=90.0", label: "Cakupan EDD 90,0 persen", msg: "405 / 450 x 100 = 90,0. 45 nasabah EDD-nya belum berlaku — sebut siapa mereka, bukan hanya persennya." },
        ],
      },
      reference: "Error melapor 2,5 persen; tidak-melapor 4,0 persen; proyeksi tertimbang 318; cakupan EDD 90,0 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: 45 nasabah yang belum pernah diperiksa",
      prose: [
        "Dari 45 nasabah berisiko tinggi yang belum pernah diaudit EDD, tiga ternyata adalah perusahaan cangkang dengan transaksi Rp18 miliar setahun — pola klasik layering yang tidak pernah diperiksa karena EDD mereka 'dijadwalkan kuartal depan' selama enam kuartal berturut-turut. Audit independen tidak menemukan pencucian yang terbukti — tetapi ia menemukan bahwa sistem penjadwalan EDD tidak punya alarm keterlambatan: nasabah bisa tertunda selamanya tanpa ada yang tahu.",
        "Tindak lanjutnya bukan menghukum tim kepatuhan, melainkan memperbaiki tiga hal: alarm otomatis bila EDD melewati tenggat 30 hari, daftar 45 nasabah itu diselesaikan dalam 60 hari dengan prioritas berdasarkan nilai transaksi, dan risk assessment diperbarui untuk memasukkan produk baru yang diluncurkan tahun lalu. Audit berikutnya, setahun kemudian: error rate turun ke 1,2 persen dan cakupan EDD 99,1 persen.",
        "Tindak lanjut yang tidak diuji efektivitasnya adalah janji, bukan perbaikan. Tiga uji yang dilakukan sebelum temuan dinyatakan TUTUP: (1) ukur ulang dengan sampel baru — error rate dan cakupan dihitung lagi dari sampel segar, bukan dari data yang sama (angka 1,2 persen dan 99,1 persen di atas berasal dari audit ulang setahun kemudian, bukan dari laporan tim sendiri); (2) uji alarmnya sendiri — buat satu EDD kedaluwarsa buatan dan periksa apakah alarm benar-benar berbunyi dalam 30 hari, bukan hanya apakah kodenya ada; (3) uji ketahanan — periksa apakah 45 nama yang diselesaikan TETAP berlaku enam bulan kemudian, atau kembali kedaluwarsa karena siklus reviunya tidak jalan. Temuan ditutup oleh KOMITE AUDIT berdasarkan bukti re-audit — bukan oleh tim yang memperbaiki berdasarkan janji.",
        "Satu hal yang tidak berubah: audit tetap independen. Auditor tahun kedua adalah firma yang berbeda — rotasi yang disengaja, karena auditor yang terlalu lama bersama tim yang diaudit mulai berpikir seperti tim itu. Independensi bukan hanya struktur; ia juga soal kesegaran mata yang melihat.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat tindak lanjut ini benar. Pertama, temuan diubah menjadi perbaikan sistem (alarm keterlambatan), bukan sekadar menyelesaikan 45 nama. Kedua, prioritas berdasarkan nilai transaksi, bukan urutan alfabet. Ketiga, auditor dirotasi agar mata yang melihat tetap segar.",
      },
      reference: "3 perusahaan cangkang, Rp18 miliar — ditemukan lewat 45 nama yang tertunda. Tahun berikut: error 1,2 persen, cakupan 99,1 persen.",
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
        "Independen: tidak merancang program, lapor ke dewan, akses penuh tanpa izin yang diaudit.",
        "Lab: error melapor 2,5 persen, tidak-melapor 4,0 persen; proyeksi tertimbang 318; cakupan EDD 90,0 persen.",
        "Lima area: tata kelola, penilaian risiko, transaction monitoring, STR, pelatihan.",
        "Sampel harus acak dan berstrata — keputusan 'tidak melapor' diambil proporsional lebih banyak.",
        "Temuan diubah menjadi perbaikan sistem, bukan sekadar menyelesaikan nama.",
      ],
      next: { label: "FR33 — BSA vs EU AMLD: Dua Rezim, Satu Uang", href: "/v2/learn/fr33-bsa-vs-eu-amld" },
      quiz: [
        {
          q: "Sampel berstrata: 200 keputusan 'melapor' (5 salah) dari populasi 10.800; 100 keputusan 'tidak melapor' (4 salah) dari populasi 1.200. Berapa proyeksi keputusan salah setahun?",
          options: [
            { text: "318 — proyeksi tertimbang (270 + 48)", why: "Tepat: 2,5 persen x 10.800 = 270; 4,0 persen x 1.200 = 48; total 318.", correct: true },
            { text: "360 — 9/300 = 3,0 persen dari 12.000", why: "Salah: itu hitungan naif tanpa bobot — strata 'tidak melapor' yang error-nya lebih tinggi di-oversample, sehingga rata-rata tanpa bobot melebih-lebihkan." },
            { text: "9 — hanya kesalahan di sampel", why: "Salah: 9 adalah kesalahan di sampel, bukan proyeksi ke populasi." },
            { text: "48 — hanya dari strata 'tidak melapor'", why: "Salah: proyeksi harus menjumlahkan kedua strata." },
          ],
        },
        {
          q: "405 dari 450 nasabah berisiko tinggi sudah diaudit EDD. Apa bacaan yang benar?",
          options: [
            { text: "Cakupan 90,0 persen — program sudah baik, tidak ada yang perlu dilakukan", why: "Salah: 45 nasabah belum diperiksa, dan yang penting adalah SIAPA mereka — bila ada perusahaan cangkang Rp18 miliar di antaranya, 90 persen itu menyesatkan." },
            { text: "Cakupan 90,0 persen, tetapi 45 sisanya harus diperiksa berdasarkan nilai transaksi", why: "Tepat: persen tanpa nama adalah laporan yang tidak lengkap.", correct: true },
            { text: "Cakupan 90,0 persen — gagal total", why: "Salah: 90,0 persen bukan gagal total; ia adalah program yang bekerja tetapi berlubang." },
            { text: "Cakupan 111,1 persen — melebihi target", why: "Salah: 450/405 = 111,1 persen adalah perhitungan terbalik yang tidak berarti." },
          ],
        },
        {
          q: "Auditor AML melapor ke kepala kepatuhan yang programnya diaudit. Apa masalahnya?",
          options: [
            { text: "Tidak ada masalah — kepala kepatuhan paling paham programnya", why: "Salah: garis lapor yang bengkok membuat temuan lunak. Auditor harus melapor ke dewan atau komite audit." },
            { text: "Independensi rusak — auditor tidak boleh melapor ke yang diaudit", why: "Tepat: garis lapor adalah bagian dari definisi independen.", correct: true },
            { text: "Hanya masalah bila auditor menemukan temuan kritis", why: "Salah: struktur yang salah adalah masalah sejak awal, bukan hanya saat ada temuan." },
            { text: "Masalahnya hanya administratif", why: "Salah: ini masalah substansial — temuan yang tidak sampai ke dewan tidak pernah diperbaiki." },
          ],
        },
        {
          q: "Kenapa sampel audit harus berstrata dengan porsi lebih besar untuk keputusan 'tidak melapor'?",
          options: [
            { text: "Karena keputusan 'tidak melapor' lebih mudah diperiksa", why: "Salah: kemudahan bukan alasannya." },
            { text: "Karena STR yang tidak terkirim tidak pernah terlihat — di situlah kesalahan paling mahal bersembunyi", why: "Tepat: sampel yang hanya mengambil keputusan 'melapor' akan selalu terlihat bagus.", correct: true },
            { text: "Karena keputusan 'melapor' sudah pasti benar", why: "Salah: keputusan 'melapor' juga bisa salah — misalnya melapor terlambat atau dengan data yang salah." },
            { text: "Karena regulator meminta begitu", why: "Salah: ini soal logika sampling, bukan permintaan regulator." },
          ],
        },
        {
          q: "Audit menemukan sistem penjadwalan EDD tidak punya alarm keterlambatan. Apa tindak lanjut yang benar?",
          options: [
            { text: "Selesaikan 45 nama yang tertunda dan selesai", why: "Salah: menyelesaikan nama tanpa memperbaiki sistem berarti 45 nama berikutnya akan tertunda lagi." },
            { text: "Perbaiki sistem dengan alarm otomatis, selesaikan 45 nama berdasarkan nilai transaksi, perbarui risk assessment", why: "Tepat: temuan diubah menjadi perbaikan sistem, bukan sekadar menyelesaikan nama.", correct: true },
            { text: "Hukum tim kepatuhan yang lalai", why: "Salah: temuan audit adalah hadiah untuk memperbaiki sistem, bukan alasan menghukum." },
            { text: "Minta auditor berikutnya tidak memeriksa penjadwalan", why: "Salah: menyembunyikan area dari audit adalah pelanggaran terhadap independensi audit." },
          ],
        },
      ],
    },
  ],
};

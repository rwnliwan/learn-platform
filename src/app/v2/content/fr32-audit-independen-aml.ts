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
        "Sebuah bank menjalankan program AML selama tiga tahun dan selalu lulus penilaian internalnya sendiri: transaction monitoring berjalan, STR terkirim tepat waktu, pelatihan selesai 100 persen. Lalu datang audit independen — auditor dari luar yang tidak terlibat merancang program itu. Dalam 300 keputusan STR yang disampel dari 12.000 keputusan setahun, auditor menemukan 9 kesalahan — error rate 3,0 persen, atau sekitar 360 keputusan salah setahun. Lebih penting lagi: dari 450 nasabah berisiko tinggi, hanya 405 yang pernah diaudit enhanced due diligence — cakupan 90,0 persen, berarti 45 nasabah paling berisiko justru belum pernah diperiksa mendalam.",
        "Temuan itu bukan dakwaan bahwa programnya buruk — 3,0 persen error dan 90,0 persen cakupan adalah program yang bekerja tetapi berlubang. Temuan itu adalah alasan audit independen ada: penjaga tidak bisa menguji dirinya sendiri. Lesson ini mengajarkan cara kerja audit independen program AML — ruang lingkup, sampling, pengujian, dan tindak lanjut — serta cara membaca hasilnya tanpa defensif.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "FR15 mengajarkan AML — placement, layering, integration, structuring, transaction monitoring, dan STR — tetapi dari sudut OPERATOR program. Audit independen tidak pernah disebut di track FR (pencarian 'audit independen' menghasilkan nol). Lesson ini membangun sudut pengujinya: siapa mengaudit, apa yang diuji, dan bagaimana hasilnya dibaca.",
      },
      reference: "300 sampel dari 12.000 keputusan: 9 kesalahan (3,0 persen, proyeksi 360). Nasabah risiko tinggi: 405 dari 450 diaudit (90,0 persen).",
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
        "Audit tidak memeriksa semua 12.000 keputusan STR setahun — ia mengambil sampel 300 dan menghitung error rate: 9 kesalahan dibagi 300 sama dengan 3,0 persen. Proyeksi ke populasi: 3,0 persen dikali 12.000 sama dengan sekitar 360 keputusan salah setahun. Proyeksi ini adalah estimasi, bukan kepastian — tetapi ia mengubah 9 kesalahan yang terasa kecil menjadi 360 yang tidak bisa diabaikan.",
        "Sampel yang baik bukan sampel yang nyaman. Ia acak — bukan 300 keputusan termudah — dan ia berstrata: keputusan 'tidak melapor' diambil proporsional lebih banyak, karena di situlah kesalahan paling mahal bersembunyi (STR yang tidak terkirim tidak pernah terlihat). Sampel yang hanya mengambil keputusan 'melapor' akan selalu terlihat bagus — karena yang diperiksa hanyalah yang sudah dianggap bermasalah.",
        "Cakupan EDD dihitung terpisah: 405 dari 450 nasabah berisiko tinggi sudah diaudit mendalam — 405 dibagi 450 dikali 100 sama dengan 90,0 persen. Sisanya 45 nasabah adalah temuan tersendiri: bukan soal berapa persen, melainkan siapa mereka — bila di antara 45 itu ada nasabah yang transaksinya paling besar, cakupan 90 persen itu menyesatkan. Audit yang baik selalu menyebut nama dan nilai, bukan hanya persen.",
      ],
      tasks: [],
      note: {
        title: "Error rate 3 persen: besar atau kecil?",
        body: "Tidak ada ambang universal — tetapi bayangkan: 360 keputusan salah setahun berarti hampir satu per hari. Bila satu dari 360 itu adalah kasus pencucian yang tidak dilaporkan, biayanya bukan statistik — ia adalah sanksi regulator dan reputasi. Yang dinilai bukan hanya ratenya, melainkan jenis kesalahannya.",
      },
      reference: "Error rate 3,0 persen → proyeksi 360 keputusan salah. Cakupan EDD 90,0 persen; 45 nasabah belum diperiksa.",
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung error rate dan cakupan audit AML",
      prose: [
        "Lab ini menghitung tiga angka audit dari data cerita pembuka: error rate sampel, proyeksi kesalahan ke populasi, dan cakupan EDD. Hitung dulu di kepala. Error rate: 9 dibagi 300 dikali 100 sama dengan 3,0 persen. Proyeksi: 3,0 persen dari 12.000 sama dengan 360 keputusan. Cakupan EDD: 405 dibagi 450 dikali 100 sama dengan 90,0 persen.",
        "Tugas lab: isi tiga variabel — error_rate, proyeksi_salah, cakupan_edd — lalu cetak ketiganya. Tiga angka ini adalah ringkasan eksekutif laporan audit: seberapa sering program salah, seberapa besar skalanya, dan siapa yang belum diperiksa.",
        "Setelah lolos, coba eksperimen: naikkan kesalahan sampel menjadi 15 dan lihat error rate menjadi 5,0 persen dengan proyeksi 600 — lalu tanyakan: pada error rate berapa komite audit harus meminta rencana perbaikan 30 hari, bukan 90 hari? Jawabannya ada di kebijakan: tetapkan ambangnya sebelum audit, bukan setelah melihat hasilnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung error rate sampel dalam persen" },
        { id: "t2", text: "Hitung proyeksi keputusan salah setahun" },
        { id: "t3", text: "Hitung cakupan EDD nasabah berisiko tinggi dalam persen" },
      ],
      expected: "error_rate=3.0\nproyeksi_salah=360.0\ncakupan_edd=90.0",
      hints: [
        "Error rate = kesalahan dibagi ukuran sampel, dikali 100.",
        "Proyeksi = error rate dibagi 100, dikali populasi.",
        "Cakupan EDD = nasabah yang diaudit dibagi total nasabah berisiko tinggi, dikali 100.",
      ],
      code: {
        starter: "# Audit independen program AML setahun. JANGAN UBAH.\nsampel = 300\nkesalahan = 9\npopulasi = 12000\nedd_diaudit = 405\nnasabah_risiko_tinggi = 450\n\n# TULIS KODEMU: error rate, proyeksi, cakupan EDD\nerror_rate = \nproyeksi_salah = \ncakupan_edd = \nprint(f\"error_rate={round(error_rate, 1)}\")\nprint(f\"proyeksi_salah={round(proyeksi_salah, 1)}\")\nprint(f\"cakupan_edd={round(cakupan_edd, 1)}\")",
        lockLines: 7,
        solution: "# Audit independen program AML setahun. JANGAN UBAH.\nsampel = 300\nkesalahan = 9\npopulasi = 12000\nedd_diaudit = 405\nnasabah_risiko_tinggi = 450\n\n# TULIS KODEMU: error rate, proyeksi, cakupan EDD\nerror_rate = kesalahan / sampel * 100\nproyeksi_salah = error_rate / 100 * populasi\ncakupan_edd = edd_diaudit / nasabah_risiko_tinggi * 100\nprint(f\"error_rate={round(error_rate, 1)}\")\nprint(f\"proyeksi_salah={round(proyeksi_salah, 1)}\")\nprint(f\"cakupan_edd={round(cakupan_edd, 1)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "error_rate=3.0", label: "Error rate 3,0 persen", msg: "9 / 300 x 100 = 3,0. Kecil di sampel, besar bila diproyeksikan." },
          { kind: "stdout_matches", task: "t2", pattern: "proyeksi_salah=360.0", label: "Proyeksi 360 keputusan salah", msg: "3,0 persen dari 12.000 = 360. Hampir satu per hari." },
          { kind: "stdout_matches", task: "t3", pattern: "cakupan_edd=90.0", label: "Cakupan EDD 90,0 persen", msg: "405 / 450 x 100 = 90,0. 45 nasabah belum diperiksa — sebut siapa mereka, bukan hanya persennya." },
        ],
      },
      reference: "Error rate 3,0 persen; proyeksi 360; cakupan EDD 90,0 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: 45 nasabah yang belum pernah diperiksa",
      prose: [
        "Dari 45 nasabah berisiko tinggi yang belum pernah diaudit EDD, tiga ternyata adalah perusahaan cangkang dengan transaksi Rp18 miliar setahun — pola klasik layering yang tidak pernah diperiksa karena EDD mereka 'dijadwalkan kuartal depan' selama enam kuartal berturut-turut. Audit independen tidak menemukan pencucian yang terbukti — tetapi ia menemukan bahwa sistem penjadwalan EDD tidak punya alarm keterlambatan: nasabah bisa tertunda selamanya tanpa ada yang tahu.",
        "Tindak lanjutnya bukan menghukum tim kepatuhan, melainkan memperbaiki tiga hal: alarm otomatis bila EDD melewati tenggat 30 hari, daftar 45 nasabah itu diselesaikan dalam 60 hari dengan prioritas berdasarkan nilai transaksi, dan risk assessment diperbarui untuk memasukkan produk baru yang diluncurkan tahun lalu. Audit berikutnya, setahun kemudian: error rate turun ke 1,2 persen dan cakupan EDD 99,1 persen.",
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
        "Lab: error rate 3,0 persen; proyeksi 360; cakupan EDD 90,0 persen.",
        "Lima area: tata kelola, penilaian risiko, transaction monitoring, STR, pelatihan.",
        "Sampel harus acak dan berstrata — keputusan 'tidak melapor' diambil proporsional lebih banyak.",
        "Temuan diubah menjadi perbaikan sistem, bukan sekadar menyelesaikan nama.",
      ],
      next: { label: "FR33 — BSA vs EU AMLD: Dua Rezim, Satu Uang", href: "/v2/learn/fr33-bsa-vs-eu-amld" },
      quiz: [
        {
          q: "Sampel 300 keputusan STR, 9 kesalahan, populasi 12.000. Berapa error rate dan proyeksinya?",
          options: [
            { text: "3,0 persen dan 360 keputusan", why: "Tepat: 9/300 = 3,0 persen; 3,0 persen dari 12.000 = 360.", correct: true },
            { text: "3,0 persen dan 9 keputusan", why: "Salah: 9 adalah kesalahan di sampel, bukan proyeksi ke populasi." },
            { text: "0,3 persen dan 36 keputusan", why: "Salah: 9/300 = 3,0 persen, bukan 0,3 persen — koma salah tempat." },
            { text: "30,0 persen dan 3.600 keputusan", why: "Salah: 9/300 = 3,0 persen, bukan 30,0 persen." },
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

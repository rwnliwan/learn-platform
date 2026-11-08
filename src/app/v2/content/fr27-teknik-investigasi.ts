import type { V2Lesson } from "../lib/types";

export const fr27: V2Lesson = {
  slug: "fr27-teknik-investigasi",
  track: "Fraud & AML Analytics",
  module: "Investigasi",
  title: "FR27 — Teknik Investigasi: Bukti, Rantai, dan Wawancara",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kasus yang menang di data, kalah di pengadilan",
      prose: [
        "Investigator menemukan pola yang sempurna: 31 transaksi kecil dari rekening teller ke rekening kerabatnya, total Rp4,2 miliar. Tetapi di pengadilan, kasus itu runtuh. Log server yang menjadi bukti utama tidak punya catatan siapa yang mengaksesnya dan kapan — rantai penyimpanannya putus. Dua saksi kunci diwawancara bersamaan di satu ruangan, sehingga kesaksian mereka dianggap terkontaminasi. Dan satu dokumen penting ternyata fotokopi tanpa aslinya — tidak bisa dipakai.",
        "Pelajaran yang mahal: investigasi fraud bukan soal menemukan kebenaran, melainkan soal menemukan kebenaran dengan cara yang bisa dipertahankan. Lesson ini mengajarkan tiga tekniknya: mengelola bukti dengan rantai penyimpanan yang utuh, mewawancarai saksi dan subjek dengan urutan yang benar, dan mendokumentasikan setiap langkah agar temuanmu bertahan di hadapan auditor, manajemen, dan pengadilan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "FR14 mengajarkan case management — antrean, prioritas, dan alokasi waktu investigator — tetapi tidak satu pun lesson yang mengajarkan teknik investigasi itu sendiri: bukti, chain of custody, dan wawancara. Pencarian kata bukti, wawancara, dan chain of custody di FR14 menghasilkan nol. Lesson ini membangun tekniknya dari nol.",
      },
      reference: "31 transaksi, Rp4,2 miliar — kasus runtuh karena rantai bukti putus dan saksi diwawancara bersamaan.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjalankan investigasi yang temuannya bisa dipertahankan.",
        "(1) Menjelaskan hierarki bukti dan syarat bukti digital diterima;",
        "(2) Menghitung skor kelengkapan rantai penyimpanan (chain of custody);",
        "(3) Merancang urutan wawancara: saksi netral dulu, subjek terakhir;",
        "(4) Membedakan pertanyaan terbuka, tertutup, dan pertanyaan yang menggiring;",
        "(5) Menulis laporan investigasi yang memisahkan fakta, analisis, dan rekomendasi.",
      ],
      tasks: [],
    },
    {
      id: "bukti",
      eyebrow: "Langkah 3 · Teori",
      title: "Bukti: hierarki dan rantai penyimpanan",
      prose: [
        "Tidak semua bukti sama kuat — tetapi tidak ada hierarki baku yang berlaku di semua konteks. Sebagai TITIK AWAL yang umum: bukti dokumenter asli (kontrak bertanda tangan, log sistem yang tidak bisa diubah, rekaman transaksi dari core banking) biasanya paling kuat; di bawahnya bukti digital yang disalin dengan benar (hash yang dicatat saat penyalinan, sehingga salinan bisa dibuktikan identik dengan aslinya); kesaksian sering paling lemah karena ingatan manusia berubah dan saksi bisa salah tanpa berbohong. Tetapi urutan ini BUKAN ranking tetap: dokumen asli bisa dipalsukan; log tanpa rantai penyimpanan bisa tidak admissible; sebaliknya, kesaksian yang dikuatkan bukti forensik dan konsisten antar saksi independen bisa mengalahkan satu dokumen yang ambigu. Yang menentukan kekuatan bukti adalah autentikasi (bisakah dibuktikan asli?), rantai penyimpanan (utuh atau putus?), dan koroborasi (didukung bukti independen lain?) — bukan jenisnya semata. Standar pembuktian juga berbeda: pengadilan pidana, audit internal, dan komite manajemen memakai ambang yang berbeda.",
        "Chain of custody adalah riwayat hidup setiap barang bukti: siapa yang mengambilnya, kapan, dari mana, disimpan di mana, siapa yang mengaksesnya, dan kapan dikembalikan. Dalam data cerita pembuka, dari 40 item bukti, 34 dinyatakan admissible — 85,0 persen — dan 37 punya rantai lengkap — 92,5 persen. Tiga item yang rantainya putus tidak bisa dipakai sebagai bukti di pengadilan — berapa pun kuat isinya — KECUALI rantainya bisa dipulihkan (misalnya lewat kesaksian petugas yang menanganinya atau catatan sekunder yang mengisi celah). Untuk keperluan internal — sebagai petunjuk investigasi atau dasar meminta bukti lain — item itu tetap bisa dipakai, tetapi bukan sebagai bukti. Aturannya brutal dan sederhana: bukti tanpa rantai adalah rumor yang mahal.",
        "Untuk bukti digital, tiga praktik wajib. Pertama, buat salinan forensik (bit-by-bit) dan bekerja dari salinan — jangan pernah menganalisis media asli. Kedua, catat hash (misalnya SHA-256) saat pengambilan dan saat penyerahan; hash yang berubah berarti bukti berubah. Ketiga, catat jam pengambilan dengan sumber waktu yang sama — log server yang jamnya tidak sinkron dengan jam CCTV membuat dua bukti tidak bisa disandingkan dalam satu garis waktu.",
      ],
      tasks: [],
      note: {
        title: "Fotokopi tanpa aslinya",
        body: "Dokumen fotokopi bisa dipakai sebagai petunjuk untuk mencari aslinya, tetapi bukan sebagai bukti. Bila aslinya hilang, catat kapan dan bagaimana hilangnya — kehilangan yang terdokumentasi masih lebih baik daripada fotokopi yang disajikan seolah-olah asli.",
      },
      reference: "40 item bukti: 34 admissible (85,0 persen), 37 rantai lengkap (92,5 persen).",
    },
    {
      id: "wawancara",
      eyebrow: "Langkah 4 · Teori",
      title: "Wawancara: urutan, pertanyaan, dan jebakan",
      prose: [
        "Urutan wawancara menentukan kualitas kesaksian. Pertama, saksi netral — orang yang melihat tetapi tidak terlibat. Kedua, saksi yang dekat dengan peristiwa. Ketiga dan terakhir, subjek — orang yang diduga. Alasannya: subjek yang diwawancara lebih dulu akan memperingatkan yang lain, dan saksi yang diwawancara setelah subjek sudah mendengar versi subjek. Dalam cerita pembuka, dua saksi diwawancara bersamaan — kesalahan yang membuat kesaksian mereka dianggap saling memengaruhi.",
        "Jenis pertanyaan juga menentukan. Pertanyaan terbuka ('Ceritakan apa yang terjadi pada hari itu') mengundang narasi — biarkan saksi bicara, jangan dipotong. Pertanyaan tertutup ('Apakah Anda melihat Budi di ruangan itu?') hanya untuk mengonfirmasi detail spesifik. Pertanyaan yang menggiring ('Budi yang mengambil uang itu, kan?') dilarang — ia menanam jawaban di mulut saksi, dan di pengadilan jawaban itu tidak ada nilainya.",
        "Ukur konsistensi, jangan paksa kesepakatan. Dalam data cerita pembuka, 12 wawancara menghasilkan 9 yang konsisten satu sama lain — 75,0 persen. Tiga yang tidak konsisten bukan berarti berbohong: ingatan berbeda adalah normal, dan perbedaan itu sendiri adalah informasi — ia menunjukkan dari sudut mana tiap saksi melihat peristiwa. Tugas investigator adalah mencatat perbedaan itu dengan jujur, bukan memaksa semua saksi berkata sama.",
      ],
      tasks: [],
      note: {
        title: "Jangan wawancara subjek tanpa persiapan",
        body: "Wawancara subjek adalah satu-satunya kesempatan mendapatkan pengakuan — dan pengakuan yang diperoleh tanpa persiapan (tanpa bukti yang sudah dikunci, tanpa saksi yang sudah didengar) hampir selalu berakhir dengan penyangkalan yang rapi. Aturan: subjek diwawancara terakhir, dengan bukti di tangan, dan selalu berdua — satu bertanya, satu mencatat.",
      },
      reference: "Urutan: saksi netral, saksi dekat, subjek terakhir. Konsistensi wawancara 9 dari 12 (75,0 persen).",
    },
    {
      id: "lab-investigasi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: skor kelayakan bukti investigasi",
      prose: [
        "Lab ini menghitung tiga skor kualitas investigasi: tingkat bukti yang admissible, kelengkapan rantai penyimpanan, dan konsistensi wawancara. Hitung dulu di kepala. Admissible: 34 dibagi 40 dikali 100 sama dengan 85,0 persen. Rantai lengkap: 37 dibagi 40 dikali 100 sama dengan 92,5 persen. Konsistensi: 9 dibagi 12 dikali 100 sama dengan 75,0 persen.",
        "Tugas lab: isi tiga variabel — admissible_rate, rantai_rate, konsistensi_rate — lalu cetak ketiganya. Tiga angka ini adalah gerbang sebelum laporan investigasi diserahkan: ambang contoh di lesson ini — admissible di bawah 80 persen atau rantai di bawah 90 persen, kasus belum layak dibawa ke komite; perbaiki dulu buktinya. Ambang 80/90 persen ini adalah CONTOH kebijakan, bukan standar universal: tiap organisasi dan tiap yurisdiksi menetapkan ambangnya sendiri (dan pengadilan tidak memakai ambang persen seperti ini sama sekali). Yang universal adalah prinsipnya: bukti yang lemah diperbaiki atau dikeluarkan secara terbuka — bukan disembunyikan atau dipaksakan lolos.",
        "Setelah lolos, coba eksperimen: turunkan rantai lengkap menjadi 30 dan lihat rantai_rate jatuh ke 75,0 persen — lalu tanyakan: apakah kasus ini masih layak dibawa ke pengadilan? Jawabannya: tidak, sampai tiga item yang rantainya putus diganti dengan bukti lain atau dikeluarkan dari dakwaan dengan jujur.",
      ],
      tasks: [
        { id: "t1", text: "Hitung tingkat bukti admissible dalam persen" },
        { id: "t2", text: "Hitung kelengkapan rantai penyimpanan dalam persen" },
        { id: "t3", text: "Hitung konsistensi wawancara dalam persen" },
      ],
      expected: "admissible_rate=85.0\nrantai_rate=92.5\nkonsistensi_rate=75.0",
      hints: [
        "Admissible rate = bukti admissible dibagi total item bukti, dikali 100.",
        "Rantai rate = item dengan rantai lengkap dibagi total item bukti, dikali 100.",
        "Konsistensi = wawancara yang konsisten dibagi total wawancara, dikali 100.",
      ],
      code: {
        starter: "# Investigasi 40 item bukti dan 12 wawancara. JANGAN UBAH.\ntotal_bukti = 40\nadmissible = 34\nrantai_lengkap = 37\ntotal_wawancara = 12\nkonsisten = 9\n\n# TULIS KODEMU: tiga skor kualitas investigasi\nadmissible_rate = \nrantai_rate = \nkonsistensi_rate = \nprint(f\"admissible_rate={round(admissible_rate, 1)}\")\nprint(f\"rantai_rate={round(rantai_rate, 1)}\")\nprint(f\"konsistensi_rate={round(konsistensi_rate, 1)}\")",
        lockLines: 7,
        solution: "# Investigasi 40 item bukti dan 12 wawancara. JANGAN UBAH.\ntotal_bukti = 40\nadmissible = 34\nrantai_lengkap = 37\ntotal_wawancara = 12\nkonsisten = 9\n\n# TULIS KODEMU: tiga skor kualitas investigasi\nadmissible_rate = admissible / total_bukti * 100\nrantai_rate = rantai_lengkap / total_bukti * 100\nkonsistensi_rate = konsisten / total_wawancara * 100\nprint(f\"admissible_rate={round(admissible_rate, 1)}\")\nprint(f\"rantai_rate={round(rantai_rate, 1)}\")\nprint(f\"konsistensi_rate={round(konsistensi_rate, 1)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "admissible_rate=85.0", label: "Admissible 85,0 persen", msg: "34 / 40 x 100 = 85,0. Di bawah ambang contoh 80 persen, kasus belum layak diserahkan." },
          { kind: "stdout_matches", task: "t2", pattern: "rantai_rate=92.5", label: "Rantai lengkap 92,5 persen", msg: "37 / 40 x 100 = 92,5. Bukti tanpa rantai adalah rumor yang mahal." },
          { kind: "stdout_matches", task: "t3", pattern: "konsistensi_rate=75.0", label: "Konsistensi 75,0 persen", msg: "9 / 12 x 100 = 75,0. Perbedaan kesaksian dicatat jujur, bukan dipaksa sama." },
        ],
      },
      reference: "Admissible 85,0 persen; rantai 92,5 persen; konsistensi 75,0 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: mengulang investigasi yang runtuh",
      prose: [
        "Setelah kasus Rp4,2 miliar itu runtuh, tim mengulang investigasi dari nol — dengan cara yang benar. Log server disalin secara forensik dengan hash yang dicatat; setiap item bukti mendapat formulir rantai penyimpanan; saksi diwawancara satu per satu, saksi netral dulu, subjek terakhir, selalu berdua. Kali ini 40 item bukti menghasilkan 34 yang admissible dan 37 dengan rantai lengkap — dan tiga item yang rantainya putus dikeluarkan dari dakwaan secara terbuka, bukan disembunyikan.",
        "Hasilnya: kasus kembali ke pengadilan dengan dakwaan yang lebih kecil tetapi tidak bisa digoyahkan — Rp3,6 miliar dari Rp4,2 miliar, dengan bukti yang rantainya utuh. Hakim menerima semuanya. Pelajaran yang dicatat tim: dakwaan yang jujur dan kecil mengalahkan dakwaan besar yang berlubang.",
        "Satu perubahan proses yang bertahan: tidak ada lagi wawancara tunggal. Setiap wawancara subjek wajib berdua dan direkam (dengan izin sesuai kebijakan), dan setiap bukti digital wajib punya hash di dua titik — saat pengambilan dan saat penyerahan. Tiga item yang dikeluarkan itu dipajang di ruang tim sebagai pengingat: bukti tanpa rantai adalah rumor yang mahal.",
        "Laporan investigasi yang diserahkan mengikuti struktur baku — dan struktur ini yang membedakan laporan dari kumpulan catatan. (1) Ringkasan eksekutif — temuan dan rekomendasi dalam 1 halaman, dibaca direksi tanpa membaca sisanya. (2) Ruang lingkup & metodologi — apa yang diselidiki, apa yang tidak, dan bagaimana (sumber data, wawancara, batasan). (3) Kronologi fakta — peristiwa berurutan, tiap fakta dirujuk ke item bukti (B-014, W-03) — TANPA kesimpulan di bagian ini. (4) Analisis — fakta dihubungkan ke kesimpulan, dengan alternatif yang dipertimbangkan dan mengapa ditolak. (5) Temuan — apa yang terbukti, apa yang tidak terbukti, apa yang tidak bisa diputuskan. (6) Rekomendasi — tindakan yang diminta, dengan pemilik dan tenggat. (7) Lampiran — log bukti, daftar wawancara, dan dokumen kunci. Aturan pemisahnya: fakta, analisis, dan rekomendasi TIDAK boleh bercampur — pembaca harus bisa melihat mana yang terbukti, mana yang disimpulkan, dan mana yang disarankan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat pengulangan ini berhasil. Pertama, bukti digital ditangani secara forensik sejak menit pertama. Kedua, urutan wawancara dihormati — saksi netral dulu, subjek terakhir. Ketiga, kelemahan diakui secara terbuka: tiga item dikeluarkan, bukan disembunyikan, sehingga kredibilitas investigator justru naik.",
      },
      reference: "Dakwaan Rp3,6 miliar dari Rp4,2 miliar — lebih kecil, tetapi tidak bisa digoyahkan.",
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
        "Hierarki bukti: dokumen asli biasanya terkuat — tetapi urutan bergantung konteks (autentikasi, rantai, koroborasi), bukan ranking tetap.",
        "Lab: admissible 85,0 persen; rantai 92,5 persen; konsistensi wawancara 75,0 persen.",
        "Chain of custody: siapa, kapan, dari mana, disimpan di mana, siapa mengakses.",
        "Urutan wawancara: saksi netral, saksi dekat, subjek terakhir — selalu berdua.",
        "Pertanyaan menggiring dilarang; perbedaan kesaksian dicatat, bukan dipaksa sama.",
      ],
      next: { label: "FR28 — Financial Statement Fraud: Sinyal Analitik dari Angka", href: "/v2/learn/fr28-financial-statement-fraud" },
      quiz: [
        {
          q: "40 item bukti: 34 admissible, 37 rantai lengkap. Berapa admissible rate dan rantai rate?",
          options: [
            { text: "85,0 persen dan 92,5 persen", why: "Tepat: 34/40 = 85,0; 37/40 = 92,5.", correct: true },
            { text: "92,5 persen dan 85,0 persen — tertukar", why: "Salah: admissible 34 lebih kecil dari rantai lengkap 37, jadi ratenya lebih kecil." },
            { text: "85,0 persen dan 85,0 persen", why: "Salah: rantai lengkap 37, bukan 34." },
            { text: "75,0 persen dan 92,5 persen", why: "Salah: 75,0 persen adalah konsistensi wawancara, bukan admissible rate." },
          ],
        },
        {
          q: "Dua saksi kunci diwawancara bersamaan di satu ruangan. Apa masalahnya?",
          options: [
            { text: "Tidak ada masalah — lebih hemat waktu", why: "Salah: kesaksian mereka dianggap terkontaminasi karena saling memengaruhi." },
            { text: "Kesaksian mereka dianggap saling memengaruhi dan nilainya jatuh", why: "Tepat: saksi harus diwawancara terpisah agar tiap kesaksian berdiri sendiri.", correct: true },
            { text: "Hanya masalah bila mereka berteman", why: "Salah: masalahnya adalah prosesnya, bukan hubungannya. Saksi yang diwawancara bersamaan selalu terkontaminasi." },
            { text: "Masalahnya hanya bila mereka tidak sepakat", why: "Salah: kesepakatan mereka justru yang dicurigai — kesepakatan setelah wawancara bersamaan tidak membuktikan apa-apa." },
          ],
        },
        {
          q: "Manakah pertanyaan yang dilarang dalam wawancara investigasi?",
          options: [
            { text: "'Ceritakan apa yang terjadi pada hari itu' — pertanyaan terbuka", why: "Salah: pertanyaan terbuka adalah yang terbaik untuk mengundang narasi." },
            { text: "'Apakah Anda melihat Budi di ruangan itu?' — pertanyaan tertutup", why: "Salah: pertanyaan tertutup boleh dipakai untuk mengonfirmasi detail spesifik." },
            { text: "'Budi yang mengambil uang itu, kan?' — pertanyaan yang menggiring", why: "Tepat: pertanyaan menggiring menanam jawaban di mulut saksi; jawabannya tidak ada nilainya.", correct: true },
            { text: "'Jam berapa Anda pulang hari itu?' — pertanyaan detail", why: "Salah: pertanyaan detail yang netral adalah bagian normal dari wawancara." },
          ],
        },
        {
          q: "Log server menjadi bukti utama tetapi tidak ada catatan siapa yang mengaksesnya. Apa akibatnya?",
          options: [
            { text: "Tidak apa-apa selama isinya benar", why: "Salah: isi yang benar tanpa rantai tidak bisa dibuktikan tidak diubah. Bukti tanpa rantai adalah rumor yang mahal." },
            { text: "Bukti itu tidak bisa dipakai — rantainya putus", why: "Tepat: chain of custody yang putus membuat bukti tidak admissible.", correct: true },
            { text: "Cukup dengan kesaksian IT bahwa log itu asli", why: "Salah: kesaksian adalah bukti paling lemah dan tidak menggantikan rantai penyimpanan." },
            { text: "Bukti itu tetap dipakai dengan catatan kecil", why: "Salah: catatan kecil tidak memperbaiki rantai yang putus. Item itu harus dikeluarkan atau diganti bukti lain." },
          ],
        },
        {
          q: "Tiga dari 12 wawancara tidak konsisten satu sama lain. Apa respons yang benar?",
          options: [
            { text: "Tuduh ketiga saksi berbohong", why: "Salah: ingatan berbeda adalah normal; perbedaan bukan bukti kebohongan." },
            { text: "Catat perbedaan itu dengan jujur — ia menunjukkan sudut pandang tiap saksi", why: "Tepat: perbedaan kesaksian adalah informasi, bukan kegagalan. Memaksa semua berkata sama justru merusak bukti.", correct: true },
            { text: "Buang ketiga wawancara itu", why: "Salah: wawancara yang tidak konsisten tetap berisi fakta; membuangnya menghilangkan informasi." },
            { text: "Wawancara ulang ketiganya sampai mereka sepakat", why: "Salah: memaksa kesepakatan adalah bentuk pertanyaan menggiring yang sistematis." },
          ],
        },
      ],
    },
  ],
};

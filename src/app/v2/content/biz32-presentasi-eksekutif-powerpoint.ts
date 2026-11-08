import type { V2Lesson } from "../lib/types";

export const biz32: V2Lesson = {
  slug: "biz32-presentasi-eksekutif-powerpoint",
  track: "Business Intelligence",
  module: "Insight & Komunikasi",
  title: "BI32 — Presentasi Eksekutif: Dari Dashboard ke PowerPoint yang Didengar",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "40 slide, 3 menit, dan direksi yang tidak ingat satu pun angka",
      prose: [
        "Analis KirimCepat membawa 40 slide ke rapat direksi — tiap chart dari dashboard disalin ke PowerPoint. Waktu yang tersedia 3 menit. Direksi mengingat satu hal: revenue naik. Mereka tidak ingat berapa, kenapa, dan apa yang harus dilakukan. Presentasi itu gagal bukan karena datanya salah, melainkan karena ia memindahkan dashboard ke slide — dan dashboard bukan presentasi.",
        "Dashboard menjawab pertanyaan yang diajukan pengguna; presentasi menjawab pertanyaan sebelum diajukan — lalu meminta keputusan. Keduanya punya tata bahasa berbeda: dashboard padat dan bisa dijelajahi; presentasi linier, satu pesan per slide, dan berakhir dengan aksi.",
        "Lesson ini mengajarkan presentasi eksekutif: struktur 3 menit, satu pesan per slide, dan chart yang dipilih untuk keputusan. Setelah lesson ini kamu bisa: (1) menyusun narasi what-so what-now what; (2) memilih satu pesan per slide; (3) menghitung kenaikan dan konteksnya; (4) merancang slide yang dibaca dalam 18 detik; (5) menutup dengan aksi, pemilik, dan tenggat.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "BI7 mengajarkan storytelling dari data dan BI1 menyinggung narasi 3 menit di capstone — tetapi tidak ada lesson tentang presentasi eksekutif sebagai artefak: struktur slide, satu pesan per slide, dan PowerPoint sebagai medium keputusan. Lesson ini membangun keterampilan itu.",
      },
      reference: "Revenue 526 ke 550: naik 24, sama dengan 4,6 persen. 10 slide dalam 3 menit: 18 detik per slide.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, presentasi-mu tidak lagi memindahkan dashboard ke slide — melainkan mengubah angka menjadi keputusan.",
        "(1) Menyusun narasi what-so what-now what dalam 3 menit;",
        "(2) Menulis satu pesan per slide sebagai judul kalimat;",
        "(3) Menghitung kenaikan absolut dan persen beserta konteksnya;",
        "(4) Memilih chart yang menjawab pertanyaan keputusan;",
        "(5) Menutup dengan aksi, pemilik, dan tenggat yang jelas.",
      ],
      tasks: [],
    },
    {
      id: "struktur-3menit",
      eyebrow: "Langkah 3 · Teori",
      title: "Struktur 3 menit: what, so what, now what",
      prose: [
        "Menit pertama, what: satu kalimat fakta. Revenue Oktober naik 4,6 persen ke Rp550 ribu — dari Rp526 ribu, naik Rp24 ribu. Satu chart: dua batang kategori dengan anotasi. Tidak ada latar belakang 10 slide; fakta dulu, konteks menyusul.",
        "Menit kedua, so what: kenapa fakta itu penting. Kenaikan ini 100 persen ditopang Minuman; kategori Bahan anjlok 66,7 persen. Headline baik menyembunyikan peringatan dini — Bahan adalah 16 persen revenue September, dan bila tren ini menular ke Minuman, perusahaan kehilangan Rp180 ribu per bulan. Angka konteks mengubah 'naik' menjadi 'naik tetapi rapuh'.",
        "Menit ketiga, now what: aksi yang diminta. Investigasi pasokan gula aren minggu ini; pemilik: manajer operasional; tenggat: Jumat. Presentasi tanpa permintaan keputusan adalah laporan yang dibacakan — dan laporan bisa dikirim lewat email. Rapat ada untuk memutuskan.",
      ],
      tasks: [],
      note: {
        title: "Judul slide adalah pesan, bukan label",
        body: "Judul 'Revenue Oktober' adalah label — ia tidak memberi tahu apa pun. Judul 'Revenue naik 4,6 persen, ditopang Minuman sementara Bahan anjlok' adalah pesan — direksi yang hanya membaca judul sudah paham. Tulis judul sebagai kalimat kesimpulan, dan chart sebagai buktinya.",
      },
      reference: "What: naik 4,6 persen ke 550. So what: Bahan anjlok 66,7 persen, risiko 180 ribu per bulan. Now what: investigasi pasokan, pemilik dan tenggat jelas.",
    },
    {
      id: "slide-18detik",
      eyebrow: "Langkah 4 · Teori",
      title: "Slide 18 detik: satu pesan, satu chart, satu anotasi",
      prose: [
        "Hitungannya: 10 slide dalam 3 menit berarti 18 detik per slide. Slide yang tidak bisa dipahami dalam 18 detik adalah slide yang tidak akan dipahami — direksi tidak akan meminta waktu tambahan untuk membaca tabel 20 baris.",
        "Aturan satu pesan: satu slide, satu pesan, satu chart, satu anotasi yang menunjuk ke angka penting. Tabel panjang dipindah ke lampiran; chart 3D dilarang — distorsi perspektif mengubah perbandingan batang. Warna dipakai untuk makna (merah untuk peringatan, hijau untuk sehat), bukan untuk hiasan.",
        "Latihan sebelum rapat: presentasikan ke rekan dalam 3 menit dengan timer. Bila kamu kehabisan waktu di slide 6, potong 4 slide — bukan berbicara lebih cepat. Presentasi yang dipotong adalah presentasi yang menghormati waktu direksi; presentasi yang dipercepat adalah presentasi yang tidak menghormati pesannya sendiri.",
      ],
      tasks: [],
      reference: "10 slide dalam 3 menit: 18 detik per slide. Satu pesan, satu chart, satu anotasi. Tabel panjang ke lampiran.",
    },
    {
      id: "lab-presentasi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung kenaikan dan waktu per slide",
      prose: [
        "Lab ini menghitung dua angka presentasi: kenaikan revenue dalam persen, dan detik per slide.",
        "Hitung dulu di kepala. Kenaikan: 550 dikurangi 526 sama dengan 24; 24 dibagi 526 dikali 100 sama dengan 4,6 persen (dibulatkan 1 desimal). Detik per slide: 3 menit sama dengan 180 detik; 180 dibagi 10 sama dengan 18 detik.",
        "Tugas lab: tulis fungsi yang menerima revenue lama, revenue baru, menit presentasi, dan jumlah slide — lalu mencetak dua angka: kenaikan_persen dan detik_per_slide.",
        "Setelah lolos, coba eksperimen: ubah slide menjadi 20 dan lihat waktu per slide jatuh menjadi 9 detik — itulah kenapa 40 slide dalam 3 menit tidak mungkin dipahami.",
      ],
      tasks: [
        { id: "t1", text: "Hitung kenaikan_persen revenue" },
        { id: "t2", text: "Hitung detik_per_slide" },
      ],
      expected: "kenaikan_persen=4.6\ndetik_per_slide=18",
      hints: [
        "Kenaikan persen = baru dikurangi lama, dibagi lama, dikali 100.",
        "Bulatkan persen ke 1 desimal.",
        "Detik per slide = menit dikali 60, dibagi jumlah slide.",
      ],
      code: {
        starter: `# Presentasi direksi Kopi Nusantara: revenue dan waktu.\nrevenue_lama = 526\nrevenue_baru = 550\nmenit = 3\njumlah_slide = 10\n\n# TULIS KODEMU: hitung kenaikan_persen dan detik_per_slide.\n# Cetak, per baris: kenaikan_persen, detik_per_slide.\n\n\nmesin_presentasi(revenue_lama, revenue_baru, menit, jumlah_slide)`,
        lockLines: 5,
        solution: `# Presentasi direksi Kopi Nusantara: revenue dan waktu.\nrevenue_lama = 526\nrevenue_baru = 550\nmenit = 3\njumlah_slide = 10\n\n\ndef mesin_presentasi(revenue_lama, revenue_baru, menit, jumlah_slide):\n    kenaikan_persen = round((revenue_baru - revenue_lama) / revenue_lama * 100, 1)\n    detik_per_slide = menit * 60 // jumlah_slide\n    print(f"kenaikan_persen={kenaikan_persen}")\n    print(f"detik_per_slide={detik_per_slide}")\n\n\nmesin_presentasi(revenue_lama, revenue_baru, menit, jumlah_slide)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "kenaikan_persen=4.6", label: "Naik 4,6 persen", msg: "(550 - 526) / 526 x 100 = 4,6 persen." },
          { kind: "stdout_matches", task: "t2", pattern: "detik_per_slide=18", label: "18 detik per slide", msg: "180 detik / 10 slide = 18 detik. Slide harus dipahami dalam waktu itu." },
        ],
      },
      reference: "Naik 4,6 persen; 18 detik per slide.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: 40 slide menjadi 10 — dan keputusan diambil",
      prose: [
        "Kembali ke KirimCepat. Presentasi dibangun ulang: 10 slide, struktur what-so what-now what, judul berupa kalimat pesan, satu chart per slide dengan anotasi. Latihan dengan timer: 3 menit pas. Di rapat, direksi menyetujui investigasi pasokan gula aren sebelum slide ke-8 selesai — karena pesannya sudah sampai di slide ke-3.",
        "Tiga bulan kemudian selisih antar platform stabil dan rapat bulanan tidak lagi berdebat soal angka. Presentasi yang baik tidak diingat karena slidenya indah — melainkan karena keputusannya diambil.",
        "Keputusan rapat: template presentasi eksekutif disahkan — 10 slide maksimal untuk 3 menit, judul kalimat pesan, lampiran untuk tabel panjang. Template itu dipakai semua tim, bukan hanya analis BI.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat presentasi baru berhasil. Pertama, struktur 3 menit memaksa prioritas — hanya yang penting yang masuk. Kedua, judul sebagai pesan — direksi paham tanpa membaca chart. Ketiga, latihan dengan timer — waktu adalah kendala nyata, bukan saran.",
      },
      reference: "40 slide menjadi 10; keputusan diambil sebelum slide ke-8; template 10 slide disahkan untuk semua tim.",
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
        "Lab: naik 4,6 persen; 18 detik per slide.",
        "Struktur 3 menit: what, so what, now what — berakhir dengan aksi, pemilik, tenggat.",
        "Judul slide adalah pesan berupa kalimat, bukan label.",
        "Satu slide: satu pesan, satu chart, satu anotasi; tabel panjang ke lampiran.",
        "Presentasi tanpa permintaan keputusan adalah laporan yang dibacakan.",
      ],
      next: { label: "BI33 — Cognos, Qlik, dan MicroStrategy: Tiga Suite Enterprise di Luar Power BI", href: "/v2/learn/biz33-cognos-qlik-microstrategy" },
      quiz: [
        {
          q: "Revenue 526 ke 550; presentasi 3 menit, 10 slide. Berapa kenaikan persen dan detik per slide?",
          options: [
            { text: "4,6 persen; 30 detik — 3 menit dibagi 6", why: "Salah: 180 / 10 = 18 detik, bukan 30." },
            { text: "24 persen; 18 detik — kenaikan disalahhitung", why: "Salah: 24 adalah kenaikan absolut (ribu rupiah), bukan persen." },
            { text: "4,6 persen; 9 detik — menit tidak dikali 60", why: "Salah: 3 menit = 180 detik; 180 / 10 = 18 detik." },
            { text: "4,6 persen; 18 detik", why: "Tepat: (550 - 526) / 526 = 4,6 persen; 180 / 10 = 18 detik.", correct: true },
          ],
        },
        {
          q: "Apa beda dashboard dan presentasi eksekutif?",
          options: [
            { text: "Dashboard menjawab pertanyaan pengguna; presentasi menjawab sebelum ditanya lalu meminta keputusan", why: "Tepat: presentasi linier, satu pesan per slide, berakhir dengan aksi.", correct: true },
            { text: "Tidak ada — presentasi adalah dashboard yang disalin ke slide", why: "Salah: itulah kesalahan cerita pembuka — 40 slide salinan dashboard gagal total." },
            { text: "Presentasi harus punya lebih banyak chart dari dashboard", why: "Salah: presentasi justru lebih sedikit — satu chart per slide." },
            { text: "Dashboard untuk direksi, presentasi untuk analis", why: "Salah: terbalik — presentasi eksekutif justru untuk direksi." },
          ],
        },
        {
          q: "Judul slide yang benar menurut lesson ini?",
          options: [
            { text: "'Revenue Oktober'", why: "Salah: itu label — tidak memberi tahu apa pun tentang pesannya." },
            { text: "'Revenue naik 4,6 persen, ditopang Minuman sementara Bahan anjlok'", why: "Tepat: judul sebagai kalimat pesan — pembaca judul saja sudah paham.", correct: true },
            { text: "'Slide 3'", why: "Salah: nomor slide bukan pesan." },
            { text: "'Grafik Batang Revenue per Kategori'", why: "Salah: itu deskripsi chart, bukan kesimpulan." },
          ],
        },
        {
          q: "Latihan dengan timer menunjukkan kamu kehabisan waktu di slide 6 dari 10. Apa yang benar?",
          options: [
            { text: "Berbicara lebih cepat di rapat", why: "Salah: berbicara cepat mengorbankan pemahaman — pesan tidak sampai." },
            { text: "Minta waktu rapat ditambah menjadi 10 menit", why: "Salah: waktu direksi adalah kendala nyata; presentasi harus muat di dalamnya." },
            { text: "Potong 4 slide — prioritaskan pesan yang penting", why: "Tepat: memotong menghormati waktu dan pesan; mempercepat tidak menghormati keduanya.", correct: true },
            { text: "Hapus semua chart agar lebih cepat", why: "Salah: chart adalah bukti pesan — menghapusnya menghilangkan bukti." },
          ],
        },
        {
          q: "Apa penutup presentasi eksekutif yang benar?",
          options: [
            { text: "'Terima kasih' dan selesai", why: "Salah: terima kasih bukan keputusan — rapat berakhir tanpa aksi." },
            { text: "Ringkasan semua 40 chart yang ditampilkan", why: "Salah: mengulang semua chart justru menghapus pesan utama." },
            { text: "Pertanyaan 'ada yang ditanyakan?' tanpa aksi", why: "Salah: pertanyaan terbuka tanpa aksi membiarkan keputusan menggantung." },
            { text: "Aksi yang diminta, pemilik, dan tenggat yang jelas", why: "Tepat: rapat ada untuk memutuskan; penutup tanpa aksi adalah laporan yang dibacakan.", correct: true },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

export const fdp12: V2Lesson = {
  slug: "fdp12-dashboard-visualisasi",
  track: "Financial Data Pipeline",
  module: "Visualisasi & Pelaporan",
  title: "FDP12 — Dashboard & Visualisasi Keuangan: Dari Pipeline ke Layar",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dashboard yang cantik, data yang basi",
      prose: [
        "Sebuah perusahaan meluncurkan dashboard keuangan yang indah: grafik revenue, margin, dan arus kas yang bergerak halus. Direksi memujinya — sampai seorang analis memeriksa stempel waktunya. Data terakhir masuk pukul 06:00, dashboard dibaca pukul 06:47 — lag 47 menit, masih di dalam SLA 60 menit. Tetapi dari 50 emiten yang seharusnya tampil, hanya 48 yang datanya lengkap — cakupan 96,0 persen — dan dua yang hilang justru emiten terbesar kedua dan ketiga. Dashboard itu cantik, tetapi ia bercerita tentang 48 emiten seolah-olah mereka adalah 50.",
        "Lesson ini mengajarkan dashboard dari sudut pipeline — bukan dari sudut desain grafik. Yang menentukan apakah dashboard keuangan bisa dipercaya bukan warnanya, melainkan tiga hal: kesegaran data (lag), kelengkapan (cakupan), dan kejujuran tentang apa yang hilang. Seorang analis pipeline membangun dashboard sebagai ujung dari pipeline-nya, bukan sebagai hiasan di atasnya.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Dashboard sebagai topik BI sudah ada di MK25 (dashboard marketing) — tetapi itu sudut pemasaran. Di track FDP, tidak ada lesson tentang dashboard sama sekali: FDP8 membahas otomasi penjadwalan pipeline, FDP9 membahas penggabungan harga dengan filings, tetapi tidak ada yang membahas ujung pipeline — layar tempat angka itu dibaca dan diputuskan. Lesson ini membangun sudut FDP-nya: lag, cakupan, refresh, dan kejujuran data.",
      },
      reference: "Lag 47 menit (SLA 60 menit); cakupan 48 dari 50 emiten (96,0 persen); 2 emiten terbesar hilang.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun dan menilai dashboard keuangan dari sudut pipeline.",
        "(1) Menjelaskan tiga metrik kesehatan dashboard: lag, cakupan, dan kesegaran;",
        "(2) Menghitung lag refresh dan cakupan emiten dari data pipeline;",
        "(3) Memilih visualisasi yang benar untuk tiap jenis angka keuangan;",
        "(4) Menandai data yang hilang atau basi secara eksplisit di layar;",
        "(5) Menentukan kapan dashboard harus dimatikan sementara, bukan dibiarkan menampilkan angka salah.",
      ],
      tasks: [],
    },
    {
      id: "tiga-metrik",
      eyebrow: "Langkah 3 · Teori",
      title: "Tiga metrik: lag, cakupan, kesegaran",
      prose: [
        "Lag refresh: selisih antara waktu data terakhir masuk dan waktu dashboard dibaca. Di cerita pembuka, data masuk 06:00 dan dibaca 06:47 — lag 47 menit, di dalam SLA 60 menit. Lag bukan soal kecepatan absolut; ia soal janji: dashboard yang berjanji 'data per jam' tetapi lag-nya 47 menit masih jujur, sementara dashboard yang berjanji 'real-time' dengan lag 47 menit adalah kebohongan. Tulis SLA di layar, dan tampilkan lag aktual di sampingnya.",
        "Cakupan: proporsi entitas yang datanya lengkap. 48 dari 50 emiten berarti 96,0 persen — tetapi persen itu menipu bila dua yang hilang adalah yang terbesar. Cakupan harus dilaporkan dua kali: cakupan jumlah (48 dari 50) dan cakupan nilai (berapa persen kapitalisasi pasar yang terwakili). Bila dua emiten hilang itu mewakili 30 persen kapitalisasi, dashboard itu hanya bercerita tentang 70 persen pasar — dan harus mengatakannya.",
        "Kesegaran (freshness): apakah data di layar adalah data terbaru yang ADA, atau data terbaru yang SEHARUSNYA ada. Pipeline yang gagal mengambil data pukul 06:00 tetapi menampilkan data 05:00 tanpa tanda adalah dashboard yang berbohong dengan sopan. Aturannya: setiap panel menampilkan stempel waktu sumbernya, dan panel yang datanya lebih tua dari SLA diberi tanda basi yang tidak bisa diabaikan — bukan catatan kaki kecil.",
      ],
      tasks: [],
      note: {
        title: "Dashboard yang dimatikan lebih baik dari dashboard yang berbohong",
        body: "Bila pipeline gagal total dan tidak ada data baru, pilihan yang benar adalah menampilkan layar 'data belum tersedia' — bukan menampilkan data kemarin seolah-olah data hari ini. Satu keputusan yang diambil dari data basi bisa lebih mahal daripada satu hari tanpa dashboard.",
      },
      reference: "Lag 47 menit (SLA 60); cakupan 96,0 persen jumlah — tetapi cek cakupan nilai; stempel waktu di tiap panel.",
    },
    {
      id: "visualisasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Memilih grafik: tren, komposisi, perbandingan",
      prose: [
        "Tiga jenis pertanyaan, tiga jenis grafik. Tren — 'bagaimana revenue bergerak?' — dijawab garis waktu (line chart) dengan sumbu yang dimulai dari nol bila yang dibandingkan adalah level, atau dipotong bila yang dibandingkan adalah perubahan kecil. Komposisi — 'dari mana revenue datang?' — dijawab batang bertumpuk (stacked bar), bukan pie yang berpotongan lebih dari lima — mata manusia buruk membandingkan sudut. Perbandingan — 'mana emiten yang marginnya tertinggi?' — dijawab batang horizontal yang diurutkan, bukan batang vertikal yang acak.",
        "Dua jebakan visual yang paling mahal di keuangan. Pertama, sumbu yang dipotong pada grafik batang: batang yang dimulai dari 80, bukan 0, membuat selisih 5 persen terlihat seperti dua kali lipat. Kedua, dua sumbu Y yang berbeda skala pada satu grafik: revenue dan margin yang digambar bersama dengan skala yang diatur agar garisnya bertemu — pertemuan itu adalah artefak skala, bukan hubungan. Aturan: satu grafik, satu pesan; bila butuh dua pesan, buat dua grafik.",
        "Satu prinsip yang mengikat semuanya: dashboard menjawab pertanyaan, bukan memamerkan data. Setiap panel harus bisa menjawab satu pertanyaan dalam lima detik — 'apakah kita di atas anggaran?' — dengan satu angka besar dan satu perbandingan. Panel yang butuh penjelasan satu paragraf bukan panel, melainkan laporan yang menyamar.",
      ],
      tasks: [],
      note: {
        title: "Angka besar dulu, grafik kemudian",
        body: "Panel yang baik dimulai dengan satu angka besar (KPI) — revenue Rp540 juta, naik 8,0 persen — lalu grafik sebagai bukti. Dashboard yang dimulai dengan grafik memaksa pembaca menghitung sendiri angka yang seharusnya sudah ditulis. Jangan membuat direksi berhitung; itu pekerjaanmu.",
      },
      reference: "Tren: garis. Komposisi: batang bertumpuk. Perbandingan: batang horizontal terurut. Satu grafik, satu pesan.",
    },
    {
      id: "lab-dashboard",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung lag dan cakupan dashboard",
      prose: [
        "Lab ini menghitung tiga metrik kesehatan dashboard: lag refresh dalam menit, cakupan emiten dalam persen, dan jumlah emiten yang hilang. Hitung dulu di kepala. Lag: 06:47 dikurangi 06:00 sama dengan 47 menit. Cakupan: 48 dibagi 50 dikali 100 sama dengan 96,0 persen. Emiten hilang: 50 dikurangi 48 sama dengan 2.",
        "Tugas lab: isi tiga variabel — lag_menit, cakupan_pct, hilang — lalu cetak ketiganya. Tiga angka ini adalah header kesehatan yang harus tampil di atas setiap dashboard keuangan: seberapa segar, seberapa lengkap, dan apa yang hilang.",
        "Setelah lolos, coba eksperimen: ubah emiten lengkap menjadi 44 dan lihat cakupan jatuh ke 88,0 persen — lalu tanyakan: apakah dashboard ini masih boleh dipakai untuk keputusan? Jawabannya: hanya bila 6 yang hilang itu kecil nilainya dan ditandai jelas; bila salah satunya adalah emiten terbesar, dashboard harus dimatikan sementara.",
      ],
      tasks: [
        { id: "t1", text: "Hitung lag refresh dalam menit" },
        { id: "t2", text: "Hitung cakupan emiten dalam persen" },
        { id: "t3", text: "Hitung jumlah emiten yang datanya hilang" },
      ],
      expected: "lag_menit=47\ncakupan_pct=96.0\nhilang=2",
      hints: [
        "Lag = waktu baca dikurangi waktu data masuk, dalam menit.",
        "Cakupan = emiten lengkap dibagi total emiten, dikali 100.",
        "Hilang = total emiten dikurangi emiten lengkap.",
      ],
      code: {
        starter: "# Kesehatan dashboard keuangan. JANGAN UBAH.\njam_data_masuk = 6 * 60 + 0  # 06:00 dalam menit\njam_dibaca = 6 * 60 + 47  # 06:47 dalam menit\nemiten_lengkap = 48\ntotal_emiten = 50\n\n# TULIS KODEMU: lag, cakupan, emiten hilang\nlag_menit = \ncakupan_pct = \nhilang = \nprint(f\"lag_menit={lag_menit}\")\nprint(f\"cakupan_pct={round(cakupan_pct, 1)}\")\nprint(f\"hilang={hilang}\")",
        lockLines: 6,
        solution: "# Kesehatan dashboard keuangan. JANGAN UBAH.\njam_data_masuk = 6 * 60 + 0  # 06:00 dalam menit\njam_dibaca = 6 * 60 + 47  # 06:47 dalam menit\nemiten_lengkap = 48\ntotal_emiten = 50\n\n# TULIS KODEMU: lag, cakupan, emiten hilang\nlag_menit = jam_dibaca - jam_data_masuk\ncakupan_pct = emiten_lengkap / total_emiten * 100\nhilang = total_emiten - emiten_lengkap\nprint(f\"lag_menit={lag_menit}\")\nprint(f\"cakupan_pct={round(cakupan_pct, 1)}\")\nprint(f\"hilang={hilang}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "lag_menit=47", label: "Lag 47 menit", msg: "06:47 - 06:00 = 47 menit. Di dalam SLA 60 menit." },
          { kind: "stdout_matches", task: "t2", pattern: "cakupan_pct=96.0", label: "Cakupan 96,0 persen", msg: "48 / 50 x 100 = 96,0. Tetapi cek juga cakupan nilai — dua yang hilang bisa jadi yang terbesar." },
          { kind: "stdout_matches", task: "t3", pattern: "hilang=2", label: "2 emiten hilang", msg: "50 - 48 = 2. Dua yang hilang harus disebutkan namanya di dashboard, bukan disembunyikan." },
        ],
      },
      reference: "Lag 47 menit; cakupan 96,0 persen; 2 emiten hilang.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: direksi yang mengambil keputusan dari data basi",
      prose: [
        "Direksi menyetujui ekspansi Rp2 miliar berdasarkan dashboard yang menunjukkan margin 22 persen. Dua minggu kemudian ketahuan: data margin itu sudah basi tiga hari — pipeline gagal mengambil data terbaru, dan dashboard menampilkan angka lama tanpa tanda. Margin sebenarnya 14 persen. Ekspansi tetap jalan karena kontrak sudah ditandatangani — dan kerugiannya baru terlihat dua kuartal kemudian.",
        "Perbaikannya bukan mengganti grafik, melainkan mengganti kontrak dashboard: setiap panel menampilkan stempel waktu sumber dan status kesegaran; panel yang datanya lebih tua dari SLA berubah warna dan menampilkan peringatan; bila pipeline gagal total, dashboard menampilkan layar 'data belum tersedia' alih-alih angka lama. Sejak itu, tidak ada lagi keputusan yang diambil dari angka tanpa stempel waktu.",
        "Satu perubahan budaya yang ikut terjadi: rapat direksi kini dimulai dengan satu pertanyaan — 'data ini per jam berapa?' — sebelum pertanyaan apa pun tentang angkanya. Pertanyaan itu terdengar sepele, tetapi ia mengubah dashboard dari hiasan menjadi instrumen: angka yang tidak tahu umurnya tidak layak dipakai untuk keputusan Rp2 miliar.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini benar. Pertama, stempel waktu dan status kesegaran di tiap panel — bukan di catatan kaki. Kedua, mode gagal yang jujur — 'data belum tersedia' lebih baik dari angka basi. Ketiga, budaya bertanya umur data sebelum membahas isinya.",
      },
      reference: "Margin 22 persen ternyata basi; sebenarnya 14 persen. Ekspansi Rp2 miliar terlanjur jalan.",
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
        "Tiga metrik: lag, cakupan (jumlah dan nilai), kesegaran.",
        "Lab: lag 47 menit; cakupan 96,0 persen; 2 emiten hilang.",
        "Tren: garis. Komposisi: batang bertumpuk. Perbandingan: batang horizontal terurut.",
        "Satu grafik, satu pesan; sumbu batang mulai dari nol; jangan dua sumbu Y.",
        "Dashboard yang gagal harus menampilkan 'data belum tersedia', bukan angka basi.",
      ],
      next: { label: "FDP13 — Kerangka Data Quality Formal: Enam Dimensi, Satu Skor", href: "/v2/learn/fdp13-kerangka-data-quality" },
      quiz: [
        {
          q: "Data masuk 06:00, dashboard dibaca 06:47, 48 dari 50 emiten lengkap. Berapa lag dan cakupannya?",
          options: [
            { text: "Lag 47 menit; cakupan 96,0 persen", why: "Tepat: 06:47 - 06:00 = 47 menit; 48/50 = 96,0 persen.", correct: true },
            { text: "Lag 47 menit; cakupan 48,0 persen", why: "Salah: 48,0 persen adalah hasil bila pembaginya 100, bukan 50." },
            { text: "Lag 60 menit; cakupan 96,0 persen", why: "Salah: 60 menit adalah SLA-nya, bukan lag aktualnya." },
            { text: "Lag 47 menit; cakupan 100 persen — dua yang hilang tidak dihitung", why: "Salah: cakupan justru mengukur yang hilang. Menyembunyikannya adalah kebohongan." },
          ],
        },
        {
          q: "Cakupan jumlah 96,0 persen, tetapi dua emiten yang hilang mewakili 30 persen kapitalisasi pasar. Apa bacaan yang benar?",
          options: [
            { text: "Dashboard tetap bisa dipakai — 96 persen sudah sangat baik", why: "Salah: cakupan nilai hanya 70 persen. Persen jumlah menipu bila yang hilang adalah yang terbesar." },
            { text: "Dashboard hanya bercerita tentang 70 persen pasar dan harus mengatakannya", why: "Tepat: laporkan cakupan jumlah DAN cakupan nilai.", correct: true },
            { text: "Cakupan sebenarnya 66 persen — 96 dikurangi 30", why: "Salah: 96 dan 30 mengukur hal yang berbeda; tidak bisa dikurangkan begitu saja." },
            { text: "Tidak ada masalah — kapitalisasi bukan ukuran cakupan", why: "Salah: untuk keputusan investasi, cakupan nilai jauh lebih penting daripada cakupan jumlah." },
          ],
        },
        {
          q: "Pipeline gagal total semalam dan tidak ada data baru. Apa yang harus ditampilkan dashboard?",
          options: [
            { text: "Data kemarin seolah-olah data hari ini — agar rapat tetap jalan", why: "Salah: itu kebohongan yang sopan. Satu keputusan dari data basi bisa lebih mahal daripada satu hari tanpa dashboard." },
            { text: "Layar 'data belum tersedia' dengan penjelasan", why: "Tepat: mode gagal yang jujur adalah satu-satunya pilihan yang benar.", correct: true },
            { text: "Data kemarin dengan catatan kaki kecil", why: "Salah: catatan kaki kecil tidak dibaca direksi. Tanda basi harus tidak bisa diabaikan." },
            { text: "Dashboard dimatikan permanen", why: "Salah: kegagalan sementara tidak berarti dashboard gagal selamanya." },
          ],
        },
        {
          q: "Grafik batang membandingkan margin lima emiten, sumbu Y dimulai dari 80. Apa masalahnya?",
          options: [
            { text: "Tidak ada — sumbu boleh dimulai dari mana saja", why: "Salah: batang yang dimulai dari 80 membuat selisih 5 persen terlihat seperti dua kali lipat." },
            { text: "Selisih kecil terlihat besar — batang harus mulai dari nol", why: "Tepat: ini jebakan visual paling klasik di keuangan.", correct: true },
            { text: "Grafik batang tidak cocok untuk margin", why: "Salah: batang adalah pilihan yang benar untuk perbandingan — yang salah adalah sumbunya." },
            { text: "Lima emiten terlalu banyak untuk satu grafik", why: "Salah: lima kategori masih sangat wajar untuk batang." },
          ],
        },
        {
          q: "Panel dashboard mana yang paling baik?",
          options: [
            { text: "Panel dengan grafik paling detail dan lima indikator sekaligus", why: "Salah: satu grafik, satu pesan. Lima indikator sekaligus berarti tidak ada pesan." },
            { text: "Panel dengan satu angka besar, satu perbandingan, dan grafik sebagai bukti", why: "Tepat: panel menjawab satu pertanyaan dalam lima detik.", correct: true },
            { text: "Panel tanpa angka — hanya grafik agar terlihat bersih", why: "Salah: grafik tanpa angka memaksa pembaca menghitung sendiri. Jangan membuat direksi berhitung." },
            { text: "Panel yang menampilkan semua data mentah agar transparan", why: "Salah: dashboard menjawab pertanyaan, bukan memamerkan data. Data mentah adalah laporan, bukan panel." },
          ],
        },
      ],
    },
  ],
};

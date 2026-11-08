import type { V2Lesson } from "../lib/types";

export const fdp17: V2Lesson = {
  slug: "fdp17-streaming-realtime",
  track: "Financial Data Pipeline",
  module: "Market Data",
  title: "FDP17 — Streaming & Real-Time Market Data: Harga yang Tak Menunggu",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Empat ribu pesan per detik, dan satu yang terlambat",
      prose: [
        "Sebuah pipeline streaming menerima 4.000 pesan harga per detik dari bursa — tick demi tick, tanpa henti, dari pembukaan sampai penutupan. Latensi p95-nya 180 milidetik — di dalam SLA 250 milidetik. Tetapi dari 240.000 pesan dalam satu menit, 120 tiba terlambat (0,05 persen) dan 480 adalah duplikat (0,2 persen). Satu pesan yang terlambat itu adalah harga pembukaan yang masuk setelah perdagangan berjalan tiga detik — dan satu strategi yang membacanya mengambil keputusan dari harga kemarin.",
        "Lesson ini mengajarkan streaming dan real-time market data: perbedaan batch dan streaming, cara mengukur latensi, keterlambatan, dan duplikasi — serta tiga keputusan desain yang menentukan apakah pipeline streaming-mu bisa dipercaya: watermark, idempotency, dan mode gagal. Batch menunggu data lengkap; streaming memutuskan dengan data yang ada — dan kejujuran tentang apa yang belum tiba adalah bagian dari desainnya.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "FDP8 mengajarkan otomasi dan penjadwalan pipeline batch — cron, retry, idempotency, monitoring — tetapi semuanya dalam dunia batch yang berjalan berkala. Streaming tidak pernah dibahas di track FDP (pencarian 'streaming' menghasilkan nol di fdp). Real-time hanya ada di track FR (FR13, sudut deteksi fraud). Lesson ini membangun sudut FDP-nya: market data yang mengalir terus.",
      },
      reference: "4.000 pesan/detik; latensi p95 180 ms (SLA 250 ms); terlambat 120 dari 240.000 (0,05 persen); duplikat 480 (0,2 persen).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang dan menilai pipeline streaming market data.",
        "(1) Menjelaskan perbedaan batch dan streaming serta kapan tiap pendekatan dipakai;",
        "(2) Menghitung throughput, latensi p95, tingkat keterlambatan, dan tingkat duplikasi;",
        "(3) Menjelaskan watermark dan cara menangani pesan yang terlambat;",
        "(4) Menjelaskan idempotency untuk pesan duplikat;",
        "(5) Merancang mode gagal streaming: apa yang terjadi saat sumber mati.",
      ],
      tasks: [],
    },
    {
      id: "batch-vs-streaming",
      eyebrow: "Langkah 3 · Teori",
      title: "Batch vs streaming: menunggu vs memutuskan",
      prose: [
        "Batch menunggu: pipeline FDP1 sampai FDP8 bekerja dengan cara mengambil data yang sudah lengkap — filing kuartal yang sudah terbit, harga penutupan yang sudah final — lalu memprosesnya. Kelebihannya: data lengkap, hasil bisa dihitung ulang persis, dan kesalahan bisa diperbaiki dengan menjalankan ulang. Kekurangannya: ia selalu terlambat — keputusan hari ini memakai data kemarin.",
        "Streaming memutuskan: pesan harga diproses saat ia tiba, dalam milidetik. Kelebihannya: keputusan memakai harga yang sedang berjalan — penting untuk trading, monitoring risiko, dan alert. Kekurangannya: data tidak pernah lengkap — pesan bisa terlambat, duplikat, atau tidak datang sama sekali — dan hasil tidak bisa dihitung ulang persis, karena urutan kedatangan tidak bisa diputar ulang dengan sempurna.",
        "Aturan pemilihannya sederhana: bila keputusanmu bisa menunggu sampai data lengkap — laporan bulanan, backtest, rekonsiliasi — pakai batch. Bila keputusanmu harus diambil sekarang — alert harga, monitoring eksposur, eksekusi — pakai streaming. Dan bila keduanya dibutuhkan, pakai keduanya: streaming untuk keputusan cepat, batch untuk koreksi dan rekonsiliasi. Arsitektur ini disebut lambda — dua jalur yang saling mengoreksi.",
      ],
      tasks: [],
      note: {
        title: "Streaming bukan batch yang lebih cepat",
        body: "Kesalahan klasik adalah menganggap streaming sebagai batch yang dijalankan tiap detik. Bukan — streaming punya masalah yang tidak ada di batch: urutan yang tidak terjamin, pesan yang terlambat, dan keadaan (state) yang harus dijaga di memori. Merancang streaming dengan pola pikir batch menghasilkan pipeline yang rapuh dan sulit di-debug.",
      },
      reference: "Batch: lengkap, bisa dihitung ulang, terlambat. Streaming: cepat, tidak lengkap, tidak bisa dihitung ulang persis.",
    },
    {
      id: "watermark-duplikat",
      eyebrow: "Langkah 4 · Teori",
      title: "Watermark, keterlambatan, dan duplikat",
      prose: [
        "Watermark adalah jam yang berkata 'data sampai titik ini sudah lengkap'. Bila watermark berada di pukul 10:00:00, pipeline boleh menutup jendela perhitungan sampai 10:00:00 dan mengeluarkan hasilnya. Pesan yang tiba setelah watermark — seperti harga pembukaan yang terlambat tiga detik — ditangani secara eksplisit: diterima dan mengoreksi hasil (late update), atau ditolak dan dicatat. Yang tidak boleh terjadi adalah pesan terlambat yang masuk diam-diam dan mengubah hasil tanpa jejak.",
        "Dalam data cerita pembuka, 120 dari 240.000 pesan tiba terlambat — 0,05 persen. Angka kecil ini bukan alasan untuk mengabaikannya: bila 120 itu terkonsentrasi di pembukaan pasar — saat volatilitas tertinggi — dampaknya jauh lebih besar daripada 0,05 persen. Selalu ukur keterlambatan per jendela waktu, bukan hanya total: terlambat yang merata adalah noise, terlambat yang berkelompok adalah insiden.",
        "Duplikat ditangani dengan idempotency: setiap pesan punya ID unik, dan pipeline menyimpan ID yang sudah diproses — pesan dengan ID yang sama diproses sekali, sisanya dibuang. Dalam cerita pembuka, 480 dari 240.000 pesan adalah duplikat — 0,2 persen. Tanpa idempotency, 480 duplikat itu akan menggandakan volume perdagangan yang tercatat dan merusak setiap perhitungan yang memakai volume.",
      ],
      tasks: [],
      note: {
        title: "Latensi p95, bukan rata-rata",
        body: "Latensi rata-rata menyembunyikan ekor yang buruk: rata-rata 50 ms bisa menyembunyikan 5 persen pesan yang tiba setelah 1 detik. p95 — latensi yang hanya dilampaui 5 persen pesan — adalah ukuran yang jujur. Di cerita pembuka, p95 180 ms di dalam SLA 250 ms berarti 95 persen pesan tiba tepat waktu — dan 5 persen sisanya harus dipantau, bukan diabaikan.",
      },
      reference: "Terlambat 0,05 persen; duplikat 0,2 persen; latensi p95 180 ms (SLA 250 ms). Watermark menutup jendela.",
    },
    {
      id: "lab-streaming",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung metrik kesehatan streaming",
      prose: [
        "Lab ini menghitung tiga metrik streaming dari data semenit: tingkat keterlambatan, tingkat duplikasi, dan keputusan SLA latensi. Hitung dulu di kepala. Keterlambatan: 120 dibagi 240.000 dikali 100 sama dengan 0,05 persen. Duplikasi: 480 dibagi 240.000 dikali 100 sama dengan 0,2 persen. SLA: latensi p95 180 ms di bawah SLA 250 ms — 'LOLOS'.",
        "Tugas lab: isi tiga variabel — telat_pct, duplikat_pct, dan sla ('LOLOS' bila p95 di bawah SLA; 'GAGAL' bila tidak) — lalu cetak ketiganya. Tiga output ini adalah header kesehatan pipeline streaming: seberapa banyak yang terlambat, seberapa banyak yang ganda, dan apakah latensinya memenuhi janji.",
        "Setelah lolos, coba eksperimen: naikkan pesan terlambat menjadi 2.400 dan lihat tingkatnya menjadi 1,0 persen — lalu tanyakan: apakah pipeline ini masih boleh dipakai untuk alert? Jawabannya: hanya bila keterlambatan itu merata; bila berkelompok di pembukaan pasar, alert harus ditahan sampai watermark lewat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung tingkat pesan terlambat dalam persen" },
        { id: "t2", text: "Hitung tingkat pesan duplikat dalam persen" },
        { id: "t3", text: "Tentukan apakah latensi p95 lolos SLA" },
      ],
      expected: "telat_pct=0.05\nduplikat_pct=0.2\nsla=LOLOS",
      hints: [
        "Tingkat = jumlah pesan dibagi total pesan, dikali 100.",
        "Bulatkan ke 2 desimal untuk telat dan 1 desimal untuk duplikat.",
        "LOLOS bila p95 di bawah SLA 250 ms.",
      ],
      code: {
        starter: "# Pipeline streaming semenit (ms). JANGAN UBAH.\ntotal_pesan = 240000\nterlambat = 120\nduplikat = 480\nlatensi_p95 = 180\nsla_ms = 250\n\n# TULIS KODEMU: tingkat telat, tingkat duplikat, keputusan SLA\ntelat_pct = \nduplikat_pct = \nsla = \nprint(f\"telat_pct={round(telat_pct, 2)}\")\nprint(f\"duplikat_pct={round(duplikat_pct, 1)}\")\nprint(f\"sla={sla}\")",
        lockLines: 7,
        solution: "# Pipeline streaming semenit (ms). JANGAN UBAH.\ntotal_pesan = 240000\nterlambat = 120\nduplikat = 480\nlatensi_p95 = 180\nsla_ms = 250\n\n# TULIS KODEMU: tingkat telat, tingkat duplikat, keputusan SLA\ntelat_pct = terlambat / total_pesan * 100\nduplikat_pct = duplikat / total_pesan * 100\nsla = \"LOLOS\" if latensi_p95 < sla_ms else \"GAGAL\"\nprint(f\"telat_pct={round(telat_pct, 2)}\")\nprint(f\"duplikat_pct={round(duplikat_pct, 1)}\")\nprint(f\"sla={sla}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "telat_pct=0.05", label: "Terlambat 0,05 persen", msg: "120 / 240.000 x 100 = 0,05. Kecil totalnya — tetapi cek apakah ia berkelompok." },
          { kind: "stdout_matches", task: "t2", pattern: "duplikat_pct=0.2", label: "Duplikat 0,2 persen", msg: "480 / 240.000 x 100 = 0,2. Tanpa idempotency, volume tercatat membengkak." },
          { kind: "stdout_matches", task: "t3", pattern: "sla=LOLOS", label: "SLA: LOLOS", msg: "p95 180 ms di bawah SLA 250 ms. Pantau 5 persen ekornya, jangan abaikan." },
        ],
      },
      reference: "Terlambat 0,05 persen; duplikat 0,2 persen; SLA LOLOS (180 ms di bawah 250 ms).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: tiga detik yang mengubah keputusan",
      prose: [
        "Strategi itu membaca harga pembukaan yang terlambat tiga detik dan mengira harga kemarin masih berlaku — ia membeli saham yang sebenarnya sudah naik 2 persen. Kerugiannya kecil — Rp8 juta — tetapi penyelidikannya mengungkap masalah sistemik: pipeline tidak punya watermark, sehingga tidak ada yang tahu kapan data 'lengkap'; tidak ada penanda pesan terlambat, sehingga pesan yang terlambat masuk diam-diam; dan tidak ada mode gagal, sehingga saat sumber mati lima menit, pipeline menampilkan harga terakhir seolah-olah harga berjalan.",
        "Perbaikannya tiga lapis. Pertama, watermark 5 detik: jendela perhitungan hanya ditutup setelah watermark lewat, dan pesan terlambat dicatat serta mengoreksi hasil secara eksplisit. Kedua, idempotency dengan ID pesan: duplikat dibuang sebelum diproses. Ketiga, mode gagal yang jujur: bila tidak ada pesan masuk selama 10 detik, dashboard menampilkan 'feed terputus' — bukan harga terakhir yang membeku.",
        "Sejak itu, tidak ada lagi keputusan yang diambil dari harga yang tidak tahu umurnya — pelajaran yang sama dengan FDP12 tentang dashboard, kini di dunia yang bergerak 4.000 pesan per detik. Kecepatan tanpa kejujuran tentang keterlambatan adalah kecepatan menuju keputusan yang salah.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini benar. Pertama, watermark membuat 'lengkap' menjadi definisi yang eksplisit, bukan perasaan. Kedua, idempotency menghilangkan duplikat sebelum ia merusak perhitungan. Ketiga, mode gagal yang jujur — 'feed terputus' lebih baik dari harga yang membeku.",
      },
      reference: "Kerugian Rp8 juta dari harga pembukaan yang terlambat 3 detik; watermark 5 detik + idempotency + mode gagal.",
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
        "Batch: lengkap, bisa dihitung ulang, terlambat. Streaming: cepat, tidak lengkap.",
        "Lab: terlambat 0,05 persen; duplikat 0,2 persen; SLA LOLOS.",
        "Watermark: jam yang berkata data sampai titik ini sudah lengkap.",
        "Idempotency: pesan dengan ID yang sama diproses sekali.",
        "Mode gagal yang jujur: 'feed terputus', bukan harga terakhir yang membeku.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "240.000 pesan semenit: 120 terlambat, 480 duplikat, p95 180 ms, SLA 250 ms. Berapa tingkat telat dan duplikat?",
          options: [
            { text: "0,05 persen dan 0,2 persen; SLA LOLOS", why: "Tepat: 120/240.000 = 0,05; 480/240.000 = 0,2; 180 di bawah 250.", correct: true },
            { text: "0,5 persen dan 2,0 persen; SLA LOLOS", why: "Salah: keduanya sepuluh kali lebih besar — koma desimal salah tempat." },
            { text: "0,05 persen dan 0,2 persen; SLA GAGAL", why: "Salah: p95 180 ms di BAWAH SLA 250 ms — lolos, bukan gagal." },
            { text: "5,0 persen dan 20,0 persen; SLA GAGAL", why: "Salah: tidak ada kombinasi definisi yang menghasilkan angka ini." },
          ],
        },
        {
          q: "Laporan bulanan dan rekonsiliasi sebaiknya memakai pendekatan apa?",
          options: [
            { text: "Streaming — karena lebih cepat", why: "Salah: laporan dan rekonsiliasi butuh data lengkap yang bisa dihitung ulang — itu batch." },
            { text: "Batch — data lengkap, bisa dihitung ulang persis", why: "Tepat: keputusan yang bisa menunggu memakai batch.", correct: true },
            { text: "Streaming — karena batch sudah ketinggalan zaman", why: "Salah: batch bukan ketinggalan zaman — ia adalah pendekatan yang benar untuk data lengkap." },
            { text: "Keduanya sekaligus untuk semua hal", why: "Salah: arsitektur lambda memakai keduanya untuk tujuan yang berbeda, bukan keduanya untuk semua hal." },
          ],
        },
        {
          q: "Apa fungsi watermark dalam pipeline streaming?",
          options: [
            { text: "Menandai pesan duplikat", why: "Salah: itu fungsi idempotency, bukan watermark." },
            { text: "Menandai titik waktu di mana data sampai titik itu sudah lengkap", why: "Tepat: watermark membuat 'lengkap' menjadi definisi eksplisit.", correct: true },
            { text: "Mengukur latensi rata-rata", why: "Salah: latensi diukur dengan p95, bukan watermark." },
            { text: "Menyimpan pesan yang terlambat", why: "Salah: watermark tidak menyimpan — ia memutuskan kapan jendela boleh ditutup dan bagaimana pesan terlambat ditangani." },
          ],
        },
        {
          q: "Feed market data terputus 10 detik. Apa yang harus ditampilkan dashboard?",
          options: [
            { text: "Harga terakhir seolah-olah harga berjalan", why: "Salah: harga yang membeku adalah kebohongan — satu keputusan dari harga basi bisa merugikan." },
            { text: "'Feed terputus' dengan jelas", why: "Tepat: mode gagal yang jujur adalah satu-satunya pilihan yang benar.", correct: true },
            { text: "Harga kemarin — lebih baik dari kosong", why: "Salah: harga kemarin yang disajikan sebagai harga hari ini adalah data basi yang menyamar." },
            { text: "Tidak ada — dashboard dimatikan permanen", why: "Salah: gangguan sementara tidak berarti dashboard gagal selamanya." },
          ],
        },
        {
          q: "Kenapa latensi diukur dengan p95, bukan rata-rata?",
          options: [
            { text: "Karena rata-rata lebih sulit dihitung", why: "Salah: rata-rata lebih mudah dihitung. Alasannya adalah kejujuran." },
            { text: "Karena rata-rata menyembunyikan ekor yang buruk — 5 persen pesan yang sangat terlambat", why: "Tepat: p95 menunjukkan latensi yang hanya dilampaui 5 persen pesan.", correct: true },
            { text: "Karena p95 selalu lebih kecil dari rata-rata", why: "Salah: p95 biasanya LEBIH BESAR dari rata-rata — ia mengukur ekor, bukan tengah." },
            { text: "Karena regulator mewajibkan p95", why: "Salah: ini soal praktik yang baik, bukan regulasi spesifik." },
          ],
        },
      ],
    },
  ],
};

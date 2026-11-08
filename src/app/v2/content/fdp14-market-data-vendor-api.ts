import type { V2Lesson } from "../lib/types";

export const fdp14: V2Lesson = {
  slug: "fdp14-market-data-vendor-api",
  track: "Financial Data Pipeline",
  module: "Market Data",
  title: "FDP14 — Market Data Vendor & API: Membeli Harga yang Benar",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga vendor, tiga harga, satu saham",
      prose: [
        "Sebuah tim riset membandingkan tiga penyedia market data untuk satu saham yang sama pada tanggal yang sama. Vendor A — terminal premium — Rp12 juta per bulan, cakupan 98 persen dari universe. Vendor B — API menengah — Rp8 juta per bulan, cakupan 92 persen. Vendor C — API publik plus engineering internal Rp3 juta — total Rp8 juta per bulan, cakupan 85 persen. Harga per poin cakupan: A Rp122.449, B Rp86.957, C Rp94.118. Vendor B ternyata paling murah per poin cakupan — dan tim itu hampir memilih A hanya karena namanya paling terkenal.",
        "Tetapi harga per poin bukan satu-satunya ukuran. Vendor A menyesuaikan corporate action dalam semalam; vendor C butuh dua hari — dan dua hari itu berarti backtest yang memakai data C akan 'melihat' stock split sebagai crash 50 persen. Lesson ini mengajarkan cara memilih market data vendor dan API: cakupan, harga, penyesuaian corporate action, lisensi, dan satu pertanyaan yang paling sering dilupakan — apakah datanya boleh dipakai untuk apa yang akan kamu lakukan dengannya.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "FDP9 mengajarkan market data sebagai satu langkah — sumber harga, return, volume, dan penjajaran tanggal — dengan Yahoo Finance dan Stooq disebut sebagai contoh penyedia publik. Tetapi tidak ada lesson yang membandingkan vendor secara sistematis: harga per cakupan, corporate action, lisensi, dan API. Lesson ini membangun perbandingan itu, dengan FDP9 sebagai fondasi penjajaran tanggalnya.",
      },
      reference: "A: Rp12 jt, 98 persen. B: Rp8 jt, 92 persen. C: Rp8 jt, 85 persen. Per poin: A Rp122.449, B Rp86.957, C Rp94.118.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memilih penyedia market data dengan perhitungan, bukan dengan merek.",
        "(1) Menjelaskan empat kriteria pemilihan vendor: cakupan, harga, kualitas penyesuaian, lisensi;",
        "(2) Menghitung harga per poin cakupan dan membandingkan vendor;",
        "(3) Menjelaskan penyesuaian corporate action dan risikonya bila terlambat;",
        "(4) Membaca batas lisensi: redistribusi, tampilan, dan penyimpanan;",
        "(5) Merancang strategi dua sumber: primer dan cadangan.",
      ],
      tasks: [],
    },
    {
      id: "empat-kriteria",
      eyebrow: "Langkah 3 · Teori",
      title: "Empat kriteria: cakupan, harga, penyesuaian, lisensi",
      prose: [
        "Cakupan: berapa persen universe yang tersedia, dan seberapa dalam sejarahnya. Vendor dengan cakupan 98 persen tetapi sejarah hanya lima tahun tidak berguna untuk backtest sepuluh tahun. Selalu tanyakan dua hal: cakupan saat ini dan kedalaman sejarah — keduanya, bukan salah satu.",
        "Harga: bukan harga absolut, melainkan harga per poin cakupan dan harga per kegunaan. Vendor B di cerita pembuka paling murah per poin (Rp86.957) — tetapi bila tim itu hanya butuh 100 saham besar yang ada di semua vendor, cakupan 98 persen tidak ada nilainya dan vendor termurah absolut yang menang. Hitung harga untuk KEBUTUHANMU, bukan untuk katalog vendor.",
        "Kualitas penyesuaian dan lisensi adalah dua kriteria yang tidak terlihat di brosur. Penyesuaian corporate action: stock split, dividen, rights issue — harga yang tidak disesuaikan akan menampilkan crash palsu dan memicu sinyal beli palsu (lihat WQB9). Lisensi: apakah datanya boleh disimpan, ditampilkan ke klien, atau dipakai untuk produk komersial? Data termurah yang tidak boleh ditampilkan adalah data yang tidak bisa dipakai — dan pelanggaran lisensi adalah masalah hukum, bukan masalah teknis.",
      ],
      tasks: [],
      note: {
        title: "Harga yang tidak disesuaikan adalah bom waktu",
        body: "Stock split 2:1 tanpa penyesuaian terlihat sebagai harga jatuh 50 persen dalam sehari. Model yang membaca data itu akan 'membeli' saham yang sebenarnya tidak jatuh. Selalu verifikasi: apakah adjusted close tersedia, dan berapa lama jeda penyesuaiannya setelah corporate action terjadi.",
      },
      reference: "Per poin cakupan: A Rp122.449, B Rp86.957, C Rp94.118. B termurah per poin.",
    },
    {
      id: "api-dua-sumber",
      eyebrow: "Langkah 4 · Teori",
      title: "API dan strategi dua sumber",
      prose: [
        "API modern memberi harga lewat endpoint yang bisa dipanggil berkali-kali — tetapi tiap vendor punya batas dan perilakunya sendiri. Rate limit: berapa panggilan per menit sebelum diblokir. Format: JSON yang rapi atau CSV yang harus diparsing. Keandalan: apakah API itu pernah mati di jam bursa, dan apakah ada status page yang jujur. Pilih vendor yang dokumentasinya bisa dibaca tanpa menelepon sales — dokumentasi yang buruk adalah pertanda dukungan yang buruk.",
        "Strategi dua sumber: satu primer, satu cadangan. Primer dipakai sehari-hari; cadangan dipakai saat primer mati atau saat angkanya perlu diverifikasi. Cadangan tidak harus semahal primer — API publik yang lebih lambat cukup sebagai cadangan, asalkan ia independen: dua sumber yang mengambil dari penyedia hulu yang sama bukan dua sumber, melainkan satu sumber dengan dua nama.",
        "Satu aturan yang mengikat semuanya: catat sumber di provenance setiap angka (lihat FDP4). Harga yang tidak tahu asalnya tidak bisa dipercaya, tidak bisa direkonsiliasi, dan tidak bisa dipertahankan di hadapan auditor. Provenance bukan birokrasi — ia adalah satu-satunya cara menjawab pertanyaan 'dari mana angka ini?' saat angka itu dipertanyakan.",
      ],
      tasks: [],
      note: {
        title: "Gratis bukan berarti tanpa biaya",
        body: "API publik gratis sering punya rate limit rendah, sejarah pendek, dan tanpa jaminan ketersediaan. Untuk riset pribadi ia cukup; untuk pipeline produksi ia adalah risiko. Hitung biaya 'gratis' itu: engineering untuk mengatasi limit, jeda saat API mati, dan backtest yang salah karena data yang hilang.",
      },
      reference: "Primer + cadangan yang independen; provenance di setiap angka; dokumentasi sebagai sinyal dukungan.",
    },
    {
      id: "lab-vendor",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: membandingkan vendor per poin cakupan",
      prose: [
        "Lab ini menghitung harga per poin cakupan tiga vendor dan menentukan yang termurah. Hitung dulu di kepala. Vendor A: 12.000.000 dibagi 98 sama dengan Rp122.449 (pembulatan). Vendor B: 8.000.000 dibagi 92 sama dengan Rp86.957. Vendor C: 8.000.000 dibagi 85 sama dengan Rp94.118. Termurah: B.",
        "Tugas lab: isi tiga variabel — per_poin_b, termurah, dan selisih_ab (harga per poin A dikurangi B) — lalu cetak ketiganya. Tiga output ini adalah baris pertama memo pemilihan vendor: berapa harga per poin, siapa termurah, dan berapa selisihnya.",
        "Setelah lolos, coba eksperimen: naikkan cakupan C menjadi 95 persen dan lihat harga per poinnya turun menjadi Rp84.211 — lebih murah dari B. Lalu tanyakan: apakah C tiba-tiba menang? Jawabannya: belum tentu — C butuh dua hari untuk penyesuaian corporate action, dan dua hari itu bisa lebih mahal daripada selisih harga per poinnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung harga per poin cakupan vendor B (Rp)" },
        { id: "t2", text: "Tentukan vendor termurah per poin cakupan" },
        { id: "t3", text: "Hitung selisih harga per poin A dikurangi B (Rp)" },
      ],
      expected: "per_poin_b=86957\ntermurah=B\nselisih_ab=35492",
      hints: [
        "Harga per poin = harga bulanan dibagi cakupan persen.",
        "Bulatkan ke rupiah terdekat.",
        "Termurah = vendor dengan harga per poin terkecil.",
      ],
      code: {
        starter: "# Tiga vendor market data (Rp/bulan, cakupan persen). JANGAN UBAH.\nharga = {\"A\": 12000000, \"B\": 8000000, \"C\": 8000000}\ncakupan = {\"A\": 98, \"B\": 92, \"C\": 85}\n\n# TULIS KODEMU: harga per poin B, termurah, selisih A-B\nper_poin_b = \ntermurah = \nselisih_ab = \nprint(f\"per_poin_b={round(per_poin_b)}\")\nprint(f\"termurah={termurah}\")\nprint(f\"selisih_ab={round(selisih_ab)}\")",
        lockLines: 4,
        solution: "# Tiga vendor market data (Rp/bulan, cakupan persen). JANGAN UBAH.\nharga = {\"A\": 12000000, \"B\": 8000000, \"C\": 8000000}\ncakupan = {\"A\": 98, \"B\": 92, \"C\": 85}\n\n# TULIS KODEMU: harga per poin B, termurah, selisih A-B\nper_poin = {k: harga[k] / cakupan[k] for k in harga}\nper_poin_b = per_poin[\"B\"]\ntermurah = min(per_poin, key=lambda k: per_poin[k])\nselisih_ab = per_poin[\"A\"] - per_poin[\"B\"]\nprint(f\"per_poin_b={round(per_poin_b)}\")\nprint(f\"termurah={termurah}\")\nprint(f\"selisih_ab={round(selisih_ab)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "per_poin_b=86957", label: "B: Rp86.957 per poin", msg: "8.000.000 / 92 = 86.956,52, dibulatkan 86.957." },
          { kind: "stdout_matches", task: "t2", pattern: "termurah=B", label: "Termurah: B", msg: "B 86.957 di bawah C 94.118 dan A 122.449." },
          { kind: "stdout_matches", task: "t3", pattern: "selisih_ab=35492", label: "Selisih A-B: Rp35.492", msg: "122.448,98 - 86.956,52 = 35.492,46, dibulatkan 35.492." },
        ],
      },
      reference: "Per poin: A Rp122.449, B Rp86.957, C Rp94.118. Termurah B; selisih A-B Rp35.492.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: backtest yang membeli crash palsu",
      prose: [
        "Sebuah tim memakai vendor C untuk backtest sepuluh tahun. Hasilnya spektakuler: Sharpe 2,4 — jauh di atas tim lain. Penyelidikan menemukan penyebabnya: vendor C butuh dua hari untuk menyesuaikan stock split, dan dalam dua hari itu harga terlihat jatuh 50 persen — model 'membeli' di harga yang tidak pernah ada. Sharpe 2,4 itu adalah Sharpe dari crash palsu yang berulang puluhan kali dalam sepuluh tahun.",
        "Perbaikannya: tim itu pindah ke vendor B sebagai primer — penyesuaian dalam semalam — dan memakai vendor C hanya sebagai cadangan untuk verifikasi. Backtest diulang: Sharpe jatuh ke 1,1. Mengecewakan, tetapi jujur. Dan satu aturan baru ditulis: setiap backtest wajib melewati cek corporate action — daftar split dan dividen dibandingkan dengan deret harga sebelum hasil apa pun dipercaya.",
        "Pelajaran yang dicatat: vendor termurah per poin bukan vendor termurah bila datanya menyesatkan. Harga data yang salah bukan harga langganannya — melainkan keputusan yang diambil dari data itu. Sharpe 2,4 yang palsu hampir membuat tim itu mengalokasikan modal nyata ke strategi yang tidak pernah ada.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini benar. Pertama, penyebab dicari di data, bukan di model. Kedua, vendor dipilih ulang berdasarkan kualitas penyesuaian, bukan hanya harga per poin. Ketiga, cek corporate action dijadikan gerbang permanen sebelum backtest dipercaya.",
      },
      reference: "Sharpe 2,4 palsu dari split yang tidak disesuaikan; setelah perbaikan Sharpe 1,1 yang jujur.",
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
        "Empat kriteria: cakupan, harga per poin, kualitas penyesuaian, lisensi.",
        "Lab: B Rp86.957 per poin (termurah); selisih A-B Rp35.492.",
        "Stock split tanpa penyesuaian terlihat sebagai crash 50 persen.",
        "Strategi dua sumber: primer + cadangan yang independen.",
        "Provenance di setiap angka — harga tanpa asal tidak bisa dipertahankan.",
      ],
      next: { label: "FDP15 — Riset Filings Berbantuan AI: RAG di Atas 10-K", href: "/v2/learn/fdp15-riset-filings-ai" },
      quiz: [
        {
          q: "Vendor A Rp12 jt (98 persen), B Rp8 jt (92 persen), C Rp8 jt (85 persen). Berapa harga per poin B dan siapa termurah?",
          options: [
            { text: "Rp86.957 dan B termurah", why: "Tepat: 8.000.000/92 = 86.957; B di bawah C 94.118 dan A 122.449.", correct: true },
            { text: "Rp86.957 dan C termurah", why: "Salah: C 8.000.000/85 = 94.118 — lebih mahal per poin dari B." },
            { text: "Rp122.449 dan A termurah", why: "Salah: 122.449 adalah harga per poin A — yang TERMAHAL, bukan termurah." },
            { text: "Rp94.118 dan B termurah", why: "Salah: 94.118 adalah harga per poin C, bukan B." },
          ],
        },
        {
          q: "Stock split 2:1 terjadi tetapi harga belum disesuaikan. Apa yang terlihat di data?",
          options: [
            { text: "Harga naik 100 persen", why: "Salah: terbalik. Split 2:1 membagi harga menjadi separuh." },
            { text: "Harga terlihat jatuh 50 persen — crash palsu yang memicu sinyal beli palsu", why: "Tepat: inilah bom waktu data yang tidak disesuaikan.", correct: true },
            { text: "Tidak ada perubahan — split tidak memengaruhi harga", why: "Salah: split membagi harga per lembar menjadi separuh; tanpa penyesuaian, deret harga terlihat jatuh." },
            { text: "Volume berlipat ganda tetapi harga tetap", why: "Salah: volume memang berlipat, tetapi harga per lembar juga berubah — dan itulah yang tidak disesuaikan." },
          ],
        },
        {
          q: "Dua 'sumber' market data ternyata mengambil dari penyedia hulu yang sama. Apa masalahnya?",
          options: [
            { text: "Tidak ada — dua sumber tetap lebih baik dari satu", why: "Salah: dua sumber dari hulu yang sama adalah satu sumber dengan dua nama. Saat hulunya mati, keduanya mati." },
            { text: "Bukan dua sumber yang independen — cadangan gagal tepat saat dibutuhkan", why: "Tepat: independensi adalah syarat strategi dua sumber.", correct: true },
            { text: "Harganya menjadi dua kali lipat tanpa manfaat", why: "Salah: harga bukan masalah utamanya — masalahnya adalah kegagalan yang berkorelasi." },
            { text: "Data keduanya pasti berbeda", why: "Salah: terbalik — data keduanya akan sama persis, termasuk kesalahannya." },
          ],
        },
        {
          q: "Vendor termurah tidak mengizinkan datanya ditampilkan ke klien. Apa yang harus dilakukan?",
          options: [
            { text: "Pakai saja — lisensi adalah urusan legal, bukan analis", why: "Salah: pelanggaran lisensi adalah masalah hukum yang menjadi tanggung jawab tim yang memakai datanya." },
            { text: "Jangan pakai untuk keperluan itu — data yang tidak boleh ditampilkan tidak bisa dipakai", why: "Tepat: lisensi adalah kriteria pemilihan, bukan catatan kaki.", correct: true },
            { text: "Tampilkan tetapi jangan sebut sumbernya", why: "Salah: menyembunyikan sumber tidak menghapus pelanggaran — ia menambahnya." },
            { text: "Beli lisensi yang lebih mahal diam-diam", why: "Salah: keputusan lisensi adalah keputusan anggaran yang harus disetujui, bukan dibeli diam-diam." },
          ],
        },
        {
          q: "Backtest menunjukkan Sharpe 2,4 tetapi memakai data yang penyesuaian split-nya terlambat dua hari. Apa tindakan yang benar?",
          options: [
            { text: "Terima Sharpe 2,4 — hasil adalah hasil", why: "Salah: Sharpe dari crash palsu bukan hasil — ia adalah artefak data." },
            { text: "Ulangi backtest dengan data yang penyesuaiannya benar dan jadikan cek corporate action sebagai gerbang", why: "Tepat: seperti di mini-case — Sharpe jatuh ke 1,1 yang jujur.", correct: true },
            { text: "Buang dua hari setelah split dari data", why: "Salah: membuang data menyembunyikan masalah, bukan memperbaikinya — dan split terjadi puluhan kali." },
            { text: "Ganti modelnya agar tidak membeli crash", why: "Salah: modelnya tidak salah — datanya yang salah. Memperbaiki model untuk data yang salah adalah menambal yang salah." },
          ],
        },
      ],
    },
  ],
};

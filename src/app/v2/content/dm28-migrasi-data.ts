import type { V2Lesson } from "../lib/types";

export const dm28: V2Lesson = {
  slug: "dm28-migrasi-data",
  track: "Data Management",
  module: "Pipeline",
  title: "DM28 — Migrasi Data: Strategi, Cutover, dan Validasi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sabtu malam cutover: 1,2 juta rekening pindah rumah",
      prose: [
        "Bank Artha Dana memindahkan data nasabah dari core banking lama ke sistem baru. Jendelanya Sabtu malam pukul 22.00 sampai Minggu pukul 04.00 — enam jam. Di dalamnya: 1.248.000 rekening harus pindah, lengkap dengan saldo, riwayat, dan status. Senin pagi pukul 07.00, 400 cabang membuka pintu dan sistem baru harus sudah menjawab.",
        "Pukul 01.30, tim migrasi melihat angka yang membuat ruangan hening: tabel tujuan berisi 1.247.960 baris — 40 baris kurang dari sumber. Total saldo berbeda 40.000.000. Bukan angka besar untuk bank sebesar ini — tapi 40 rekening yang hilang berarti 40 nasabah yang Senin pagi tidak bisa menarik uangnya.",
        "Lesson ini mengajarkan migrasi sebagai disiplin: strategi (sekaligus atau bertahap), validasi (bagaimana tahu pindahannya benar), dan keputusan tersulit malam itu — lanjut atau putar balik. Setelah lesson ini kamu bisa: (1) memilih strategi migrasi dari karakteristik datanya; (2) merancang validasi rekonsiliasi yang menangkap kehilangan sekecil 40 baris; (3) menghitung jendela cutover dari kecepatan dan buffer; (4) memutuskan rollback dengan kriteria yang ditulis sebelum cutover, bukan saat panik.",
      ],
      tasks: [],
      note: {
        title: "Migrasi bukan ETL biasa",
        body: "ETL harian memindahkan data yang kemarin sudah benar; bila gagal, ulangi besok. Migrasi memindahkan data sekali, dengan sistem lama yang akan dimatikan. Tidak ada 'ulangi besok' — ada cutover yang berhasil, atau rollback yang direncanakan. Itu sebabnya migrasi butuh validasi dan rencana putar balik yang ditulis sebelum malam cutover.",
      },
      reference: "Migrasi = pindah sekali, sistem lama dimatikan. Validasi dan rollback direncanakan sebelum cutover.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang dan memvalidasi sebuah migrasi data dari ujung ke ujung.",
        "(1) Membedakan migrasi big-bang, trickle, dan phased — dan memilih dari ukuran, risiko, dan toleransi downtime;",
        "(2) Merancang validasi empat lapis: jumlah baris, checksum agregat, perbandingan per baris, dan sampel mendalam;",
        "(3) Menghitung jendela cutover dari kecepatan transfer, validasi, dan buffer rollback;",
        "(4) Menulis kriteria rollback sebelum cutover — dan mematuhinya saat malam cutover.",
      ],
      tasks: [],
    },
    {
      id: "strategi",
      eyebrow: "Langkah 3 · Teori",
      title: "Strategi: big-bang, trickle, phased",
      prose: [
        "Big-bang memindahkan semuanya sekaligus dalam satu jendela cutover: matikan sistem lama, pindahkan semua data, nyalakan sistem baru. Keuntungannya: sederhana, satu kali, tidak ada periode dua sistem berjalan bersamaan. Kerugiannya: semua risiko terkonsentrasi di satu malam — bila gagal, dampaknya total. Big-bang cocok untuk data kecil, jendela panjang, dan sistem yang memang akan dimatikan.",
        "Trickle memindahkan data sedikit demi sedikit selama berminggu-minggu, sambil kedua sistem berjalan dan disinkronisasi. Keuntungannya: risiko tersebar, kegagalan satu batch tidak menggagalkan semuanya. Kerugiannya: sinkronisasi dua arah itu rumit — perubahan yang terjadi di sistem baru selama migrasi harus ditulis balik ke sistem lama, atau sebaliknya. Trickle cocok untuk data besar yang tidak boleh berhenti.",
        "Phased memindahkan per bagian: per segmen, per wilayah, atau per modul — misal Ritel dulu, UKM minggu depan, Korporat terakhir. Keuntungannya: pelajaran dari fase pertama memperbaiki fase berikutnya. Kerugiannya: periode dua sistem berjalan bersamaan lebih panjang, dan ada ketergantungan antar fase. Untuk 1.248.000 rekening bank, phased per segmen adalah pilihan yang paling masuk akal — dan di cerita pembuka, Ritel yang pindah duluan justru yang memberi sinyal dini bahwa ada 40 baris hilang.",
        "Tidak ada strategi yang benar untuk semua kasus. Pilihannya ditentukan tiga pertanyaan: berapa besar datanya, berapa lama downtime yang ditoleransi, dan seberapa mahal kegagalan total. Jawaban yang jujur atas ketiganya memilihkan strateginya sendiri.",
      ],
      tasks: [],
      note: {
        title: "Jebakan periode dua sistem",
        body: "Selama dua sistem berjalan bersamaan, satu pertanyaan harus terjawab setiap hari: sistem mana sumber kebenaran untuk data yang berubah? Bila jawabannya tidak ditulis, dua sistem akan menyimpang diam-diam — dan rekonsiliasi akhir menemukan selisih yang tidak bisa dijelaskan siapa pun. Tetapkan satu sumber kebenaran per fase, dan tulis.",
      },
      reference: "Big-bang: sekaligus, risiko terkonsentrasi. Trickle: sedikit demi sedikit, sinkronisasi rumit. Phased: per bagian, belajar dari fase awal.",
    },
    {
      id: "validasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Validasi empat lapis: dari hitungan ke per baris",
      prose: [
        "Lapis pertama adalah jumlah baris: sumber 1.248.000, tujuan harus 1.248.000. Selisih 40 baris — 0,0032 persen — terlihat kecil, tapi 40 rekening adalah 40 manusia. Jumlah baris adalah pemeriksaan termurah dan tercepat; ia harus selalu nol selisih sebelum lapis berikutnya dibaca.",
        "Lapis kedua adalah checksum agregat: jumlahkan satu kolom numerik di kedua sisi dan bandingkan. Di cerita pembuka, total saldo sumber 4.872.350.000.000 dan tujuan 4.872.310.000.000 — selisih 40.000.000. Bagi dengan 40 baris yang hilang: rata-rata 1.000.000 per baris. Dua lapis ini bersama-sama sudah bercerita: bukan 40 baris acak yang hilang, melainkan 40 baris dengan rata-rata saldo satu juta.",
        "Lapis ketiga adalah perbandingan per baris: cocokkan kunci demi kunci, dan laporkan baris mana yang berbeda — bukan hanya ada berapa. Lapis keempat adalah sampel mendalam: ambil 100 baris acak dan bandingkan semua kolomnya, termasuk yang tidak masuk checksum. Keempat lapis ini saling melengkapi: total bisa terlihat benar bila dua kesalahan saling menutupi, tapi perbandingan per baris tidak bisa ditipu.",
        "Satu metrik untuk dilaporkan ke manajemen: match rate — baris tujuan dibagi baris sumber. Di sini 1.247.960 dibagi 1.248.000 sama dengan 99,9968 persen. Kedengarannya hampir sempurna — sampai diingat bahwa 0,0032 persennya adalah 40 nasabah yang tidak bisa menarik uang Senin pagi.",
      ],
      tasks: [],
      note: {
        title: "Kenapa total saja tidak cukup",
        body: "Dua kesalahan bisa saling menutupi di total: satu baris kelebihan 40 juta dan satu baris kekurangan 40 juta menghasilkan total yang sama persis. Checksum agregat adalah alarm, bukan bukti. Bukti hanya datang dari perbandingan per baris.",
      },
      reference: "Empat lapis: jumlah baris, checksum, perbandingan per baris, sampel mendalam. Match rate 99,9968 persen pun masih berarti 40 nasabah.",
    },
    {
      id: "lab-rekonsiliasi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin rekonsiliasi migrasi",
      prose: [
        "Lab ini membangun mesin rekonsiliasi kecil: bandingkan sumber dan tujuan per segmen, hitung baris yang hilang, selisih total saldo, rata-rata saldo baris yang hilang, dan match rate. Datanya dari cerita pembuka: sumber 1.248.000 baris (Ritel 980.000, UKM 210.000, Korporat 58.000) dengan total saldo 4.872.350.000.000; tujuan 1.247.960 baris (Ritel 979.970, UKM 209.995, Korporat 57.995) dengan total saldo 4.872.310.000.000.",
        "Hitung dulu di kepala: baris hilang 40 (Ritel 30, UKM 5, Korporat 5). Selisih saldo 40.000.000. Rata-rata saldo baris hilang 40.000.000 dibagi 40 sama dengan 1.000.000. Match rate 1.247.960 dibagi 1.248.000 sama dengan 99,9968 persen.",
        "Tugas lab: tulis fungsi rekonsiliasi yang menerima dua kamus (sumber dan tujuan, masing-masing berisi jumlah baris dan total saldo per segmen) dan mencetak lima angka: baris hilang per segmen, total baris hilang, selisih saldo, rata-rata saldo baris hilang, dan match rate dalam persen. Fungsi ini — bukan angkanya — adalah yang dibawa pulang: pola yang sama dipakai untuk rekonsiliasi ETL harian, migrasi, dan audit data.",
        "Setelah lolos, coba eksperimen: ubah satu segmen tujuan menjadi sama dengan sumber dan lihat match rate naik — lalu tanyakan pada dirimu: pada match rate berapa kamu berani menandatangani berita acara migrasi? Jawabannya ada di langkah berikutnya.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi rekonsiliasi: selisih baris per segmen dari dua kamus sumber dan tujuan" },
        { id: "t2", text: "Hitung total baris hilang, selisih saldo, dan rata-rata saldo baris hilang" },
        { id: "t3", text: "Hitung match rate persen dan cetak kelima angka" },
      ],
      expected: "Ritel: 30\nUKM: 5\nKorporat: 5\n40\n40000000\n1000000.0\n99.9968",
      hints: [
        "Baris hilang per segmen = sumber dikurangi tujuan, per kunci segmen.",
        "Selisih saldo = total sumber dikurangi total tujuan.",
        "Rata-rata = selisih saldo dibagi total baris hilang.",
        "Match rate = total baris tujuan dibagi total baris sumber, dikali 100 — bulatkan 4 desimal.",
      ],
      code: {
        starter: `# Data migrasi: jumlah baris dan total saldo (rupiah) per segmen.\nsumber = {\n    "Ritel": (980000, 3120000000000),\n    "UKM": (210000, 1260000000000),\n    "Korporat": (58000, 492350000000),\n}\ntujuan = {\n    "Ritel": (979970, 3119970000000),\n    "UKM": (209995, 1259995000000),\n    "Korporat": (57995, 492345000000),\n}\n\n# TULIS KODEMU: fungsi rekonsiliasi di bawah ini.\n# Cetak, per baris: \"Segmen: hilang\" untuk tiap segmen,\n# lalu total hilang, selisih saldo, rata-rata saldo hilang, match rate (4 desimal).\n\n\nrekonsiliasi(sumber, tujuan)`,
        lockLines: 13,
        solution: `# Data migrasi: jumlah baris dan total saldo (rupiah) per segmen.\nsumber = {\n    "Ritel": (980000, 3120000000000),\n    "UKM": (210000, 1260000000000),\n    "Korporat": (58000, 492350000000),\n}\ntujuan = {\n    "Ritel": (979970, 3119970000000),\n    "UKM": (209995, 1259995000000),\n    "Korporat": (57995, 492345000000),\n}\n\n\ndef rekonsiliasi(sumber, tujuan):\n    total_hilang = 0\n    for segmen in sumber:\n        hilang = sumber[segmen][0] - tujuan[segmen][0]\n        total_hilang += hilang\n        print(f\"{segmen}: {hilang}\")\n    total_sumber = sum(v[0] for v in sumber.values())\n    total_tujuan = sum(v[0] for v in tujuan.values())\n    selisih = sum(v[1] for v in sumber.values()) - sum(v[1] for v in tujuan.values())\n    print(total_hilang)\n    print(selisih)\n    print(selisih / total_hilang)\n    print(round(total_tujuan / total_sumber * 100, 4))\n\n\nrekonsiliasi(sumber, tujuan)`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "99.9968", label: "Match rate 99,9968 persen", msg: "Match rate = 1.247.960 / 1.248.000 x 100 = 99,9968. Periksa pembilang (tujuan) dan penyebut (sumber) tidak tertukar." },
          { kind: "stdout_matches", task: "t2", pattern: "40000000", label: "Selisih saldo 40.000.000", msg: "Selisih = 4.872.350.000.000 - 4.872.310.000.000 = 40.000.000. Periksa total saldo sumber dan tujuan." },
          { kind: "stdout_matches", task: "t2", pattern: "1000000.0", label: "Rata-rata saldo baris hilang 1.000.000", msg: "Rata-rata = 40.000.000 / 40 = 1.000.000. Periksa pembaginya adalah total baris hilang (40)." },
          { kind: "stdout_matches", task: "t1", pattern: "Ritel: 30", label: "Ritel hilang 30 baris", msg: "Ritel: 980.000 - 979.970 = 30. Periksa pengurangan per segmen." },
        ],
      },
      reference: "Hilang 40 baris (Ritel 30, UKM 5, Korporat 5); selisih saldo 40.000.000; rata-rata 1.000.000; match rate 99,9968 persen.",
    },
    {
      id: "jendela-cutover",
      eyebrow: "Langkah 6 · Teori",
      title: "Jendela cutover: kecepatan, validasi, buffer",
      prose: [
        "Jendela cutover dihitung dari tiga komponen: waktu transfer, waktu validasi, dan buffer rollback. Waktu transfer adalah jumlah baris dibagi kecepatan: 1.248.000 baris pada 850 baris per detik sama dengan 1.468 detik — sekitar 24,47 menit. Kecepatan ini bukan tebakan: ia diukur dari rehearsal migrasi di lingkungan staging dengan data yang sama besarnya.",
        "Waktu validasi adalah waktu menjalankan empat lapis pemeriksaan dari langkah sebelumnya: 10 menit untuk hitungan baris, checksum, dan sampel di data sebesar ini. Buffer rollback adalah waktu yang dicadangkan bila keputusan malam itu adalah putar balik: 15 menit untuk mengembalikan sistem lama ke keadaan sebelum cutover.",
        "Totalnya: 24,47 tambah 10 tambah 15 sama dengan 49,47 menit — dibulatkan menjadi jendela 50 menit. Jendela enam jam di cerita pembuka ternyata jauh lebih longgar dari yang dibutuhkan — dan kelonggaran itu disengaja. Migrasi yang jendelanya pas-pasan adalah migrasi yang gagal saat satu hal kecil meleset.",
        "Satu aturan yang tidak boleh dilanggar: rehearsal wajib dilakukan dengan data produksi yang sama besarnya, bukan data contoh kecil. Kecepatan transfer tidak linear — 1.000 baris yang pindah dalam 1 detik tidak berarti 1.248.000 baris pindah dalam 21 menit. Index, lock, dan log transaksi membuat kecepatan menurun seiring ukuran.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jendela cutover adalah janji kepada bisnis: sistem kembali pada jam yang dijanjikan, atau rollback dimulai. Janji yang dihitung dari rehearsal dengan data nyata bisa dipertahankan; janji yang dihitung dari asumsi kecepatan tidak bisa. Dalam risk reporting, janji yang tidak bisa dipertahankan adalah risiko itu sendiri.",
      },
      reference: "Jendela = transfer + validasi + buffer rollback. 24,47 + 10 + 15 = 49,47 menit, dibulatkan 50 menit.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: pukul 01.30 — lanjut atau putar balik?",
      prose: [
        "Kembali ke cerita pembuka. Pukul 01.30, validasi menemukan 40 baris hilang dan selisih saldo 40.000.000. Tim terbagi dua. Satu pihak berkata: lanjut — 99,9968 persen sudah sangat baik, 40 rekening bisa diperbaiki Senin pagi secara manual. Pihak lain berkata: putar balik — kriteria rollback yang ditulis sebelum cutover berbunyi 'selisih baris berapa pun di atas nol berarti rollback'.",
        "Jawaban yang benar: putar balik. Bukan karena 40 baris itu besar, melainkan karena kriteria ditulis sebelum cutover justru untuk momen seperti ini — saat tekanan, kelelahan, dan keinginan 'hampir selesai' membuat orang menawar standarnya sendiri. Kriteria yang bisa ditawar saat panik bukan kriteria, melainkan saran.",
        "Dan ada alasan teknis juga: 40 baris yang hilang dengan rata-rata saldo satu juta bukan pola acak. Bila penyebabnya adalah filter yang salah di skrip migrasi, baris yang sama akan hilang di fase berikutnya — dan 40 bisa menjadi 400. Menyelidiki sekarang, dengan sistem lama masih hidup, jauh lebih murah daripada menyelidiki Senin pagi dengan 400 cabang sudah buka.",
        "Migrasi itu akhirnya diulang dua minggu kemudian — dengan filter diperbaiki dan validasi yang sama. Match rate 100 persen. Jendela 50 menit terpakai 47 menit. Tidak ada nasabah yang kehilangan akses.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Kriteria rollback harus ditulis SEBELUM cutover, saat kepala dingin, dan dipatuhi saat panik. Di sini kriterianya 'selisih baris di atas nol' — ketat, tapi disepakati. Hasilnya: rollback yang tertib, perbaikan dalam dua minggu, migrasi kedua 100 persen. Menawar kriteria di tengah malam adalah cara paling mahal untuk 'menghemat' dua minggu.",
      },
      reference: "Kriteria rollback ditulis sebelum cutover dan dipatuhi saat panik. 40 baris hilang = rollback.",
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
        "Strategi: big-bang sekaligus, trickle sedikit demi sedikit, phased per bagian.",
        "Validasi empat lapis: jumlah baris, checksum, perbandingan per baris, sampel mendalam.",
        "Lab: hilang 40 baris (Ritel 30, UKM 5, Korporat 5); selisih 40.000.000; rata-rata 1.000.000; match rate 99,9968 persen.",
        "Jendela cutover = transfer + validasi + buffer rollback: 24,47 + 10 + 15 = 49,47 menit, dibulatkan 50 menit.",
        "Kriteria rollback ditulis sebelum cutover dan dipatuhi saat panik.",
        "Total saja tidak cukup: dua kesalahan bisa saling menutupi.",
      ],
      next: { label: "DM29 — Inmon vs Kimball: Dua Arsitektur Data Warehouse", href: "/v2/learn/dm29-inmon-vs-kimball" },
      quiz: [
        {
          q: "Migrasi 1,2 juta rekening dengan downtime maksimal 1 jam dan kegagalan total yang sangat mahal. Strategi yang paling masuk akal?",
          options: [
            { text: "Big-bang — pindahkan semuanya sekaligus dalam satu malam", why: "Salah: big-bang menumpuk semua risiko di satu malam. Bila gagal, dampaknya total — dan itulah yang paling mahal di sini." },
            { text: "Phased per segmen — Ritel dulu, pelajari, lalu UKM dan Korporat", why: "Tepat: risiko tersebar, pelajaran fase pertama memperbaiki fase berikutnya, dan kegagalan satu fase tidak menggagalkan semuanya.", correct: true },
            { text: "Trickle tanpa sinkronisasi — pindahkan sedikit demi sedikit dan biarkan kedua sistem berbeda", why: "Salah: trickle tanpa sinkronisasi berarti dua sistem menyimpang diam-diam. Sinkronisasi adalah harga trickle." },
            { text: "Tidak usah migrasi — biarkan sistem lama jalan selamanya", why: "Salah: itu menghindari keputusan, bukan mengambilnya. Sistem lama akan dimatikan — pertanyaannya kapan dan bagaimana, bukan apakah." },
          ],
        },
        {
          q: "Validasi menemukan total saldo sumber dan tujuan SAMA PERSIS. Apa kesimpulan yang benar?",
          options: [
            { text: "Migrasi pasti benar — total yang sama membuktikan semua baris benar", why: "Salah: dua kesalahan bisa saling menutupi di total. Satu baris kelebihan 40 juta dan satu kekurangan 40 juta menghasilkan total yang sama." },
            { text: "Total sama adalah kabar baik, tapi bukti hanya datang dari perbandingan per baris", why: "Tepat: checksum agregat adalah alarm, bukan bukti. Lanjutkan ke lapis ketiga: bandingkan per baris.", correct: true },
            { text: "Total sama berarti tidak perlu validasi lebih lanjut", why: "Salah: berhenti di total adalah cara paling murah untuk melewatkan kesalahan yang saling menutupi." },
            { text: "Total sama membuktikan match rate 100 persen", why: "Salah: match rate dihitung dari jumlah baris, bukan dari total saldo. Keduanya harus diperiksa terpisah." },
          ],
        },
        {
          q: "Match rate migrasi 99,9968 persen (40 dari 1.248.000 baris hilang). Apa sikap yang benar?",
          options: [
            { text: "Terima — 99,9968 persen sudah hampir sempurna", why: "Salah: 0,0032 persennya adalah 40 nasabah nyata yang tidak bisa menarik uang. Persentase menyembunyikan manusia di baliknya." },
            { text: "Tahan dan selidiki — 40 baris hilang adalah 40 nasabah, dan polanya (rata-rata 1 juta) menandakan penyebab sistematis", why: "Tepat: angka absolut yang penting, bukan persentasenya. Dan rata-rata yang bulat menandakan filter yang salah, bukan keacakan.", correct: true },
            { text: "Perbaiki 40 baris itu secara manual Senin pagi tanpa menyelidiki", why: "Salah: memperbaiki gejala tanpa mencari penyebab berarti penyebabnya tetap ada — dan akan memakan baris lain di fase berikutnya." },
            { text: "Hitung ulang match rate dengan pembilang dan penyebut ditukar", why: "Salah: menukar pembilang dan penyebut menghasilkan angka di atas 100 persen — itu bukan perbaikan, itu kesalahan hitung." },
          ],
        },
        {
          q: "Jendela cutover dihitung 49,47 menit dan dibulatkan menjadi 50 menit. Kenapa dibulatkan ke atas?",
          options: [
            { text: "Karena pembulatan ke atas memberi ruang untuk hal kecil yang meleset", why: "Tepat: migrasi yang jendelanya pas-pasan gagal saat satu hal kecil meleset. Kelonggaran adalah bagian dari rencana, bukan pemborosan.", correct: true },
            { text: "Karena 49,47 menit sulit diingat", why: "Salah: kemudahan mengingat bukan alasan perencanaan. Alasannya adalah buffer terhadap ketidakpastian." },
            { text: "Karena kecepatan transfer selalu tepat seperti rehearsal", why: "Salah: justru sebaliknya — kecepatan di produksi bisa lebih lambat dari rehearsal. Itulah kenapa buffer diperlukan." },
            { text: "Karena validasi 10 menit sebenarnya butuh 11 menit", why: "Salah: tidak ada angka 11 menit di perhitungan ini. Pembulatan adalah buffer umum, bukan koreksi satu komponen." },
          ],
        },
        {
          q: "Kriteria rollback 'selisih baris di atas nol berarti rollback' ditulis sebelum cutover. Pukul 01.30 ditemukan 40 baris hilang dan tim ingin lanjut karena 'hampir selesai'. Apa yang benar?",
          options: [
            { text: "Lanjut — kriteria boleh ditawar bila sudah hampir selesai", why: "Salah: kriteria yang bisa ditawar saat panik bukan kriteria. Ia ditulis justru untuk momen seperti ini." },
            { text: "Putar balik — patuhi kriteria yang ditulis saat kepala dingin", why: "Tepat: menawar standar di tengah malam adalah cara paling mahal untuk 'menghemat' dua minggu. Rollback yang tertib lebih murah daripada perbaikan Senin pagi.", correct: true },
            { text: "Lanjut, lalu perbaiki 40 baris itu secara diam-diam tanpa mencatat", why: "Salah: perbaikan diam-diam tanpa catatan menghancurkan jejak audit. Dalam data management, yang tidak tercatat dianggap tidak terjadi — sampai auditor menemukannya." },
            { text: "Tanyakan ke manajemen di tengah malam dan biarkan mereka memutuskan tanpa data", why: "Salah: manajemen memutuskan dari data validasi, bukan dari tekanan. Data validasi sudah berkata: 40 baris hilang — dan kriteria sudah menjawabnya." },
          ],
        },
      ],
    },
  ],
};

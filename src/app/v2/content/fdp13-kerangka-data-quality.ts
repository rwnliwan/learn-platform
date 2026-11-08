import type { V2Lesson } from "../lib/types";

export const fdp13: V2Lesson = {
  slug: "fdp13-kerangka-data-quality",
  track: "Financial Data Pipeline",
  module: "Kualitas Data",
  title: "FDP13 — Kerangka Data Quality Formal: Enam Dimensi, Satu Skor",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dataset yang lolos pembersihan tetapi gagal dipakai",
      prose: [
        "Sebuah tim pipeline membersihkan dataset laporan keuangan 50 emiten — duplikat dihapus, format diseragamkan, mata uang disamakan. Semua cek pembersihan lolos. Tetapi saat analis memakainya, masalah muncul bertubi-tubi: 4 persen revenue tidak bisa ditelusuri ke filing aslinya, 12 persen emiten memakai definisi 'revenue' yang berbeda tanpa catatan, dan data kuartal terbaru terlambat tiga hari dari jadwal. Dataset itu bersih — tetapi tidak berkualitas. Pembersihan dan kualitas adalah dua hal yang berbeda.",
        "Lesson ini mengajarkan kerangka data quality formal: enam dimensi yang diukur, diberi skor, dan dipantau — completeness, validity, accuracy, consistency, timeliness, uniqueness — plus satu skor gabungan dan satu ambang yang menentukan apakah dataset boleh dipakai. FDP4 mengajarkan cara membersihkan; lesson ini mengajarkan cara MENILAI apakah hasil pembersihan itu cukup baik.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "FDP4 mengajarkan cleaning — restatement, duplikat, skala, dan provenance — sebagai teknik memperbaiki data. Tetapi tidak ada lesson yang mengukur kualitas secara formal: tidak ada dimensi, tidak ada skor, tidak ada SLA, tidak ada pemantauan. Kerangka formal inilah yang dibangun di sini, dengan FDP4 sebagai teknik di bawahnya.",
      },
      reference: "Enam dimensi, skor gabungan 94,2; dimensi terendah consistency 88 — di bawah ambang 90.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengukur dan memantau kualitas data keuangan secara formal.",
        "(1) Menjelaskan enam dimensi data quality dan cara mengukur tiap dimensinya;",
        "(2) Menghitung skor gabungan dan mengidentifikasi dimensi terlemah;",
        "(3) Menetapkan ambang (floor) per dimensi dan SLA timeliness;",
        "(4) Membedakan cleaning dari quality — memperbaiki vs menilai;",
        "(5) Merancang pemantauan kualitas yang berjalan otomatis tiap batch.",
      ],
      tasks: [],
    },
    {
      id: "enam-dimensi",
      eyebrow: "Langkah 3 · Teori",
      title: "Enam dimensi: dari lengkap sampai unik",
      prose: [
        "Completeness: apakah semua yang seharusnya ada, ada. Diukur sebagai persentase field yang terisi — revenue yang kosong di 4 persen baris berarti completeness 96. Validity: apakah nilai sesuai format dan aturan — tanggal yang valid, kode emiten yang ada di daftar, angka yang bukan teks. Accuracy: apakah nilai itu benar di dunia nyata — revenue yang formatnya valid tetapi salah Rp1 miliar adalah valid tetapi tidak akurat; accuracy hanya bisa diukur dengan membandingkan ke sumber kebenaran.",
        "Consistency: apakah nilai yang sama ditulis dengan cara yang sama di semua tempat — 'revenue' yang di satu filing berarti penjualan kotor dan di filing lain berarti penjualan bersih adalah inkonsistensi definisi, bukan inkonsistensi ejaan. Timeliness: apakah data tiba saat masih bisa dipakai — data kuartal yang terlambat tiga hari dari jadwal membuat semua analisis yang menunggunya terlambat juga. Uniqueness: apakah tidak ada duplikat — satu transaksi yang tercatat dua kali menggandakan revenue.",
        "Dalam data cerita pembuka, skor per dimensi adalah: completeness 96, validity 94, accuracy 91, consistency 88, timeliness 97, uniqueness 99. Skor gabungan — rata-rata keenamnya — adalah 565 dibagi 6 sama dengan 94,2. Angka gabungan itu terlihat baik. Tetapi dimensi terendahnya, consistency 88, berada di bawah ambang (floor) 90 — dan satu dimensi di bawah floor berarti dataset TIDAK boleh dipakai tanpa perbaikan, berapa pun bagusnya skor gabungan.",
      ],
      tasks: [],
      note: {
        title: "Skor gabungan menipu; floor yang melindungi",
        body: "Rata-rata menyembunyikan kelemahan: lima dimensi 97 dan satu dimensi 60 memberi rata-rata 91 — terlihat baik, tetapi satu dimensi yang rusak bisa meracuni seluruh analisis. Itulah kenapa kerangka formal memakai floor per dimensi, bukan hanya skor gabungan. Floor adalah gerbang; skor gabungan adalah ringkasan.",
      },
      reference: "Completeness 96, validity 94, accuracy 91, consistency 88, timeliness 97, uniqueness 99. Gabungan 94,2; floor 90.",
    },
    {
      id: "sla-monitoring",
      eyebrow: "Langkah 4 · Teori",
      title: "SLA, floor, dan pemantauan tiap batch",
      prose: [
        "Floor ditetapkan per dimensi berdasarkan dampaknya. Consistency floor 90 — di bawah itu, definisi yang berbeda membuat perbandingan antar emiten tidak berarti. Timeliness punya SLA waktu, bukan persen: data kuartal harus tiba maksimal 2 hari setelah rilis filing; keterlambatan 3 hari di cerita pembuka adalah pelanggaran SLA, bukan sekadar skor rendah. Accuracy floor 90 — di bawah itu, angka tidak bisa dipakai untuk keputusan investasi.",
        "Pemantauan berjalan tiap batch, bukan tiap kuartal. Setiap kali pipeline selesai mengambil dan membersihkan satu batch, enam skor dihitung otomatis dan ditulis ke log kualitas. Bila satu dimensi jatuh di bawah floor, batch itu ditandai dan tidak diteruskan ke dashboard — ia masuk antrean perbaikan. Bila tiga batch berturut-turut gagal di dimensi yang sama, itu bukan lagi masalah data — itu masalah sumber atau definisi yang harus diperbaiki di hulu.",
        "Satu praktik yang membedakan kerangka formal dari cek ad-hoc: data quality report menyertai setiap dataset yang dibagikan. Satu halaman: enam skor, floor, tren tiga batch terakhir, dan daftar masalah yang diketahui. Analis yang menerima dataset tanpa laporan kualitas sedang menerima angka tanpa mengetahui seberapa kuat lantai tempat angka itu berdiri — sama seperti lesson MK31 tentang profiling, tetapi kini dengan floor dan SLA yang mengikat.",
      ],
      tasks: [],
      note: {
        title: "Quality gate di pipeline, bukan di kepala analis",
        body: "Bila penilaian kualitas hanya ada di kepala analis yang memeriksa manual, ia akan dilewati saat tenggat menekan. Kerangka formal berarti gerbangnya ada di KODE pipeline: batch yang gagal floor tidak bisa diteruskan tanpa override yang tercatat dengan nama dan alasan.",
      },
      reference: "Floor 90 per dimensi; SLA timeliness 2 hari; tiga batch gagal berturut-turut berarti masalah hulu.",
    },
    {
      id: "lab-dq",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung skor gabungan dan dimensi terlemah",
      prose: [
        "Lab ini menghitung skor gabungan enam dimensi dan menemukan dimensi terlemah. Hitung dulu di kepala. Jumlah skor: 96 ditambah 94 ditambah 91 ditambah 88 ditambah 97 ditambah 99 sama dengan 565. Skor gabungan: 565 dibagi 6 sama dengan 94,2 (pembulatan satu desimal). Dimensi terlemah: consistency, 88 — di bawah floor 90.",
        "Tugas lab: isi tiga variabel — skor_gabungan, terlemah, dan lolos ('TIDAK' bila ada dimensi di bawah floor 90; 'YA' bila semua di atas floor) — lalu cetak ketiganya. Tiga output ini adalah stempel kualitas pada tiap batch pipeline.",
        "Setelah lolos, coba eksperimen: naikkan consistency menjadi 92 dan lihat keputusan berubah menjadi 'YA' — lalu tanyakan: apakah dataset itu tiba-tiba sempurna? Jawabannya: tidak — lolos floor berarti layak dipakai, bukan berarti sempurna. Skor gabungan 94,8 tetap harus dilaporkan bersama dimensinya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor gabungan enam dimensi" },
        { id: "t2", text: "Tentukan dimensi terlemah" },
        { id: "t3", text: "Tentukan apakah batch lolos floor 90" },
      ],
      expected: "skor_gabungan=94.2\nterlemah=consistency\nlolos=TIDAK",
      hints: [
        "Skor gabungan = rata-rata keenam skor dimensi.",
        "Dimensi terlemah = nama dengan skor terkecil.",
        "Lolos hanya bila SEMUA dimensi di atas floor 90.",
      ],
      code: {
        starter: "# Skor enam dimensi data quality (0-100). JANGAN UBAH.\nskor = {\"completeness\": 96, \"validity\": 94, \"accuracy\": 91, \"consistency\": 88, \"timeliness\": 97, \"uniqueness\": 99}\nfloor = 90\n\n# TULIS KODEMU: skor gabungan, dimensi terlemah, lolos floor\nskor_gabungan = \nterlemah = \nlolos = \nprint(f\"skor_gabungan={round(skor_gabungan, 1)}\")\nprint(f\"terlemah={terlemah}\")\nprint(f\"lolos={lolos}\")",
        lockLines: 4,
        solution: "# Skor enam dimensi data quality (0-100). JANGAN UBAH.\nskor = {\"completeness\": 96, \"validity\": 94, \"accuracy\": 91, \"consistency\": 88, \"timeliness\": 97, \"uniqueness\": 99}\nfloor = 90\n\n# TULIS KODEMU: skor gabungan, dimensi terlemah, lolos floor\nskor_gabungan = sum(skor.values()) / len(skor)\nterlemah = min(skor, key=lambda k: skor[k])\nlolos = \"YA\" if min(skor.values()) >= floor else \"TIDAK\"\nprint(f\"skor_gabungan={round(skor_gabungan, 1)}\")\nprint(f\"terlemah={terlemah}\")\nprint(f\"lolos={lolos}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "skor_gabungan=94.2", label: "Skor gabungan 94,2", msg: "565 / 6 = 94,17, dibulatkan 94,2. Skor gabungan yang baik tidak menghapus dimensi yang gagal." },
          { kind: "stdout_matches", task: "t2", pattern: "terlemah=consistency", label: "Terlemah: consistency", msg: "Consistency 88 adalah skor terkecil — definisi 'revenue' yang berbeda antar filing." },
          { kind: "stdout_matches", task: "t3", pattern: "lolos=TIDAK", label: "Lolos: TIDAK", msg: "Consistency 88 di bawah floor 90 — batch tidak boleh diteruskan tanpa perbaikan." },
        ],
      },
      reference: "Skor gabungan 94,2; terlemah consistency 88; lolos TIDAK (floor 90).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: batch yang ditahan dan analis yang berterima kasih",
      prose: [
        "Suatu pagi, pipeline menahan satu batch: consistency jatuh ke 88 karena dua emiten mengubah definisi 'revenue' di filing terbarunya tanpa pemberitahuan. Dashboard hari itu menampilkan data kemarin dengan tanda 'batch terbaru ditahan — masalah definisi'. Seorang analis marah — ia butuh angka itu untuk rapat pukul 10:00. Tetapi pukul 09:30, tim pipeline menemukan penyebabnya, memperbaiki pemetaan definisi, dan batch lolos dengan consistency 93. Rapat pukul 10:00 memakai angka yang benar.",
        "Bila gerbang itu tidak ada, rapat pukul 10:00 akan memakai angka yang salah — dua emiten dengan definisi berbeda dibandingkan seolah-olah sama — dan keputusan yang diambil dari perbandingan itu akan salah juga. Analis yang marah itu mengirim pesan pukul 11:00: 'Terima kasih sudah menahan batch-nya. Saya hampir mempresentasikan angka yang salah.'",
        "Sejak itu, aturan override ditulis dengan jelas: siapa pun boleh meminta override gerbang, tetapi override itu tercatat dengan nama, alasan, dan tenggat perbaikan — dan override yang sama tidak boleh diminta dua kali untuk masalah yang sama. Gerbang yang bisa dilewati diam-diam bukan gerbang; gerbang yang bisa dilewati dengan nama terang adalah gerbang yang jujur.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat gerbang ini bekerja. Pertama, gerbang ada di kode pipeline — bukan di kepala seseorang. Kedua, mode gagalnya jujur — dashboard menampilkan data lama dengan tanda, bukan angka baru yang salah. Ketiga, override tercatat dengan nama — sehingga gerbang tidak bisa dilewati diam-diam.",
      },
      reference: "Batch ditahan di consistency 88; diperbaiki ke 93 sebelum rapat pukul 10:00.",
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
        "Enam dimensi: completeness, validity, accuracy, consistency, timeliness, uniqueness.",
        "Lab: skor gabungan 94,2; terlemah consistency 88; lolos TIDAK (floor 90).",
        "Floor per dimensi adalah gerbang; skor gabungan hanya ringkasan.",
        "Cleaning memperbaiki data; quality menilai apakah hasilnya cukup baik.",
        "Batch yang gagal floor ditahan; override tercatat dengan nama dan alasan.",
      ],
      next: { label: "FDP14 — Market Data Vendor & API: Membeli Harga yang Benar", href: "/v2/learn/fdp14-market-data-vendor-api" },
      quiz: [
        {
          q: "Skor enam dimensi: 96, 94, 91, 88, 97, 99. Floor 90. Berapa skor gabungan dan apakah batch lolos?",
          options: [
            { text: "94,2 dan TIDAK — consistency 88 di bawah floor", why: "Tepat: 565/6 = 94,2; tetapi satu dimensi di bawah floor berarti tidak lolos.", correct: true },
            { text: "94,2 dan YA — skor gabungan di atas 90", why: "Salah: floor berlaku per dimensi, bukan pada gabungan. Skor gabungan yang baik tidak menghapus dimensi yang gagal." },
            { text: "90,8 dan TIDAK", why: "Salah: 90,8 adalah hasil bila salah satu skor dihitung dua kali atau ada yang terlewat. Jumlahnya 565." },
            { text: "94,2 dan YA — consistency 88 masih di atas 85", why: "Salah: floor-nya 90, bukan 85. Ambang tidak boleh diubah setelah melihat hasil." },
          ],
        },
        {
          q: "Revenue sebuah emiten formatnya valid tetapi salah Rp1 miliar. Dimensi apa yang gagal?",
          options: [
            { text: "Validity — formatnya salah", why: "Salah: formatnya valid. Yang gagal adalah kebenaran nilainya." },
            { text: "Accuracy — nilainya salah di dunia nyata", why: "Tepat: valid tetapi tidak akurat. Accuracy hanya bisa diukur dengan membandingkan ke sumber kebenaran.", correct: true },
            { text: "Completeness — datanya tidak lengkap", why: "Salah: datanya ada dan terisi; yang salah adalah isinya." },
            { text: "Uniqueness — datanya duplikat", why: "Salah: tidak ada duplikasi di soal ini." },
          ],
        },
        {
          q: "Dua emiten memakai definisi 'revenue' yang berbeda tanpa catatan. Dimensi apa yang gagal?",
          options: [
            { text: "Consistency — nilai yang sama ditulis dengan definisi yang berbeda", why: "Tepat: ini inkonsistensi definisi, yang membuat perbandingan antar emiten tidak berarti.", correct: true },
            { text: "Completeness — ada data yang hilang", why: "Salah: datanya lengkap; yang berbeda adalah artinya." },
            { text: "Timeliness — datanya terlambat", why: "Salah: tidak ada keterlambatan di soal ini." },
            { text: "Validity — formatnya tidak sesuai aturan", why: "Salah: formatnya sesuai; definisinya yang berbeda." },
          ],
        },
        {
          q: "Tiga batch berturut-turut gagal di dimensi timeliness. Apa diagnosis yang benar?",
          options: [
            { text: "Masalah data acak — tunggu batch berikutnya", why: "Salah: tiga kali berturut-turut di dimensi yang sama adalah pola, bukan noise." },
            { text: "Masalah hulu — sumber atau jadwal yang harus diperbaiki", why: "Tepat: kegagalan berulang di satu dimensi berarti masalah sistemik di hulu.", correct: true },
            { text: "Floor terlalu tinggi — turunkan floor timeliness", why: "Salah: mengubah floor untuk meloloskan kegagalan adalah manipulasi, bukan perbaikan." },
            { text: "Salah analis — mereka terlalu lambat memakai data", why: "Salah: timeliness mengukur ketibaan data, bukan kecepatan analis." },
          ],
        },
        {
          q: "Apa perbedaan cleaning (FDP4) dan kerangka data quality (lesson ini)?",
          options: [
            { text: "Tidak ada perbedaan — keduanya membersihkan data", why: "Salah: cleaning memperbaiki; quality menilai apakah hasil perbaikan itu cukup baik." },
            { text: "Cleaning memperbaiki data; quality menilai dan memantau apakah hasilnya memenuhi floor", why: "Tepat: FDP4 adalah teknik di bawah kerangka ini.", correct: true },
            { text: "Quality lebih penting sehingga cleaning tidak perlu lagi", why: "Salah: tanpa cleaning, tidak ada yang dinilai. Keduanya berlapis, bukan pengganti." },
            { text: "Cleaning untuk data kecil; quality untuk data besar", why: "Salah: ukuran data bukan pembedanya. Pembedanya adalah memperbaiki vs menilai." },
          ],
        },
      ],
    },
  ],
};

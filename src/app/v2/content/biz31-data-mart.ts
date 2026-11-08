import type { V2Lesson } from "../lib/types";

export const biz31: V2Lesson = {
  slug: "biz31-data-mart",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI31 — Data Mart: Warehouse Kecil untuk Satu Tim",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tim marketing yang menunggu antrean warehouse pusat",
      prose: [
        "Tim marketing KirimCepat butuh analisis kampanye tiap pagi. Warehouse pusat melayani 12 tim — query marketing antre di belakang query finance yang berat, dan dashboard pagi sering selesai jam 11. Tim marketing meminta data mart sendiri: salinan kecil yang hanya berisi data mereka, di-refresh tiap pagi, dengan model yang mereka pahami.",
        "Tim pusat menolak: data mart berarti duplikasi, dan duplikasi berarti dua versi kebenaran. Tim marketing menjawab: antrean 4 jam juga berarti dua versi kebenaran — versi yang seharusnya dan versi yang sempat dibaca. Perdebatan itu berakhir dengan kompromi: data mart yang dibangun dari warehouse pusat, dengan definisi metrik yang sama, dan refresh terjadwal.",
        "Lesson ini mengajarkan data mart: kapan membangun, bagaimana merancangnya, dan bagaimana menjaganya tetap selaras. Setelah lesson ini kamu bisa: (1) menjelaskan data mart vs warehouse; (2) menghitung ukuran dan subset mart; (3) memilih dependent vs independent mart; (4) merancang refresh dan SLA; (5) menjaga definisi tetap selaras dengan pusat.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Grep seluruh track BI untuk data mart menghasilkan 0 hit — tidak ada satu pun lesson yang membahasnya. BI2 dan BI20 membahas warehouse dan semantic layer di tingkat pusat, tetapi tidak ada data mart sebagai unit untuk satu tim. Lesson ini membangun topik itu.",
      },
      reference: "Fact 2 juta baris dikali 200 byte: 400 MB. Mart 30 persen baris: 120 MB. Refresh 15 menit tiap pagi.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun data mart yang mempercepat satu tim tanpa memecah kebenaran perusahaan.",
        "(1) Menjelaskan data mart: subset warehouse untuk satu tim atau subjek;",
        "(2) Menghitung ukuran mart dari subset baris dan kolom;",
        "(3) Membedakan dependent mart (dari warehouse) vs independent mart (langsung dari sumber);",
        "(4) Merancang refresh, SLA, dan kepemilikan mart;",
        "(5) Menjaga definisi metrik selaras dengan semantic layer pusat.",
      ],
      tasks: [],
    },
    {
      id: "jenis-rancangan",
      eyebrow: "Langkah 3 · Teori",
      title: "Dependent vs independent: dari mana mart diisi",
      prose: [
        "Dependent mart diisi dari warehouse pusat: data sudah dibersihkan dan dimodelkan sekali, lalu subset-nya disalin ke mart. Kelebihannya: satu definisi kebenaran — metrik di mart sama dengan di pusat karena berasal dari sumber yang sama. Kekurangannya: mart menunggu warehouse selesai; bila pusat terlambat, mart ikut terlambat.",
        "Independent mart diisi langsung dari sumber operasional: cepat dibangun karena tidak menunggu pusat, tetapi tiap mart mendefinisikan metriknya sendiri — dan dua mart bisa memberi dua jawaban untuk pertanyaan yang sama. Itulah yang ditakutkan tim pusat di cerita pembuka, dan ketakutan itu beralasan: independent mart yang tumbuh liar adalah awal dari kekacauan definisi.",
        "Aturan: dependent sebagai default; independent hanya untuk data yang belum ada di warehouse dan dibutuhkan mendesak — dengan rencana migrasi ke dependent dan tanggalnya. Mart yang independent selamanya adalah warehouse bayangan yang tidak diakui.",
      ],
      tasks: [],
      note: {
        title: "Mart bukan dump tabel mentah",
        body: "Data mart berisi model yang sudah dimodelkan untuk tim itu: fact dan dimensi dengan grain yang jelas, bukan salinan mentah tabel sumber. Mart yang hanya menyalin tabel operasional tanpa modeling adalah replikasi, bukan mart — dan analisnya tetap harus membangun model sendiri di tiap query.",
      },
      reference: "Dependent: dari warehouse, satu kebenaran, menunggu pusat. Independent: dari sumber, cepat, risiko dua kebenaran.",
    },
    {
      id: "ukuran-refresh",
      eyebrow: "Langkah 4 · Teori",
      title: "Ukuran, refresh, dan kepemilikan",
      prose: [
        "Hitung ukuran sebelum membangun: fact 2 juta baris dikali 200 byte sama dengan 400.000.000 byte, sama dengan 400 MB. Mart marketing hanya butuh 30 persen baris (kampanye 2 tahun terakhir): 120 MB. Angka itu menentukan biaya storage dan waktu refresh — refresh 15 menit tiap pagi untuk 120 MB adalah janji yang bisa dipegang.",
        "Refresh mart mengikuti ritme keputusan tim: marketing memutuskan tiap pagi, jadi refresh tiap pagi sebelum jam 7. SLA ditulis: data tersedia jam 7, keterlambatan lebih dari 30 menit memicu alert ke pemilik mart. Tanpa SLA, mart perlahan menjadi basi dan tim kembali antre ke warehouse pusat.",
        "Kepemilikan jelas: pemilik mart adalah tim yang memakainya (marketing), bukan tim pusat. Pemilik bertanggung jawab atas model di mart, daftar pengguna, dan pensiunnya mart saat tidak dipakai. Mart tanpa pemilik menjadi zombie — seperti dashboard zombie di BI1, hanya saja berbentuk tabel.",
      ],
      tasks: [],
      reference: "Fact 400 MB; mart 30 persen: 120 MB; refresh 15 menit tiap pagi; SLA tersedia jam 7, alert bila telat 30 menit.",
    },
    {
      id: "lab-mart",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung ukuran warehouse dan data mart",
      prose: [
        "Lab ini menghitung ukuran fact warehouse dan ukuran mart dari subset baris.",
        "Hitung dulu di kepala. Ukuran fact: 2.000.000 dikali 200 sama dengan 400.000.000 byte, sama dengan 400 MB. Ukuran mart: 30 persen dari 400 sama dengan 120 MB.",
        "Tugas lab: tulis fungsi yang menerima jumlah baris, byte per baris, dan persen subset — lalu mencetak dua angka: ukuran_mb dan mart_mb.",
        "Setelah lolos, coba eksperimen: ubah subset menjadi 10 persen dan lihat mart menjadi 40 MB — mart yang kecil dan fokus adalah mart yang cepat di-refresh.",
      ],
      tasks: [
        { id: "t1", text: "Hitung ukuran_mb fact warehouse" },
        { id: "t2", text: "Hitung mart_mb dari persen subset" },
      ],
      expected: "ukuran_mb=400\nmart_mb=120",
      hints: [
        "Ukuran byte = baris dikali byte per baris; bagi 1.000.000 menjadi MB.",
        "Mart = ukuran dikali persen subset dibagi 100.",
      ],
      code: {
        starter: `# Fact penjualan KirimCepat dan mart marketing.\njumlah_baris = 2000000\nbyte_per_baris = 200\npersen_subset = 30\n\n# TULIS KODEMU: hitung ukuran_mb dan mart_mb.\n# Cetak, per baris: ukuran_mb, mart_mb.\n\n\nmesin_mart(jumlah_baris, byte_per_baris, persen_subset)`,
        lockLines: 4,
        solution: `# Fact penjualan KirimCepat dan mart marketing.\njumlah_baris = 2000000\nbyte_per_baris = 200\npersen_subset = 30\n\n\ndef mesin_mart(jumlah_baris, byte_per_baris, persen_subset):\n    ukuran_mb = jumlah_baris * byte_per_baris // 1000000\n    mart_mb = ukuran_mb * persen_subset // 100\n    print(f"ukuran_mb={ukuran_mb}")\n    print(f"mart_mb={mart_mb}")\n\n\nmesin_mart(jumlah_baris, byte_per_baris, persen_subset)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "ukuran_mb=400", label: "Fact 400 MB", msg: "2.000.000 x 200 byte = 400.000.000 byte = 400 MB." },
          { kind: "stdout_matches", task: "t2", pattern: "mart_mb=120", label: "Mart 120 MB", msg: "30 persen dari 400 MB = 120 MB." },
        ],
      },
      reference: "Fact 400 MB; mart 120 MB.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: dashboard pagi yang selesai jam 7",
      prose: [
        "Kembali ke KirimCepat. Data mart marketing dibangun sebagai dependent mart: subset warehouse dengan model kampanye yang sudah dimodelkan, refresh tiap pagi jam 6, SLA tersedia jam 7. Dashboard pagi selesai jam 7:05 — bukan jam 11. Tim marketing berhenti antre, dan tim pusat berhenti menerima tiket 'query saya lambat' tiap pagi.",
        "Keselarasan dijaga lewat semantic layer: definisi revenue dan ROAS di mart sama dengan di pusat karena keduanya membaca definisi yang sama. Saat definisi ROAS berubah, perubahan dilakukan sekali di semantic layer — mart dan pusat berubah bersama.",
        "Keputusan rapat: setiap tim boleh meminta mart, dengan syarat — dependent dari warehouse, pemilik bernama, SLA tertulis, dan review pemakaian tiap kuartal. Mart yang tidak dibuka siapa pun selama satu kuartal dipensiunkan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat mart ini berhasil. Pertama, dependent dari warehouse — satu kebenaran, bukan dua. Kedua, SLA dan pemilik yang jelas — mart yang basi ketahuan dalam 30 menit. Ketiga, review pemakaian kuartalan — mart zombie dipensiunkan, bukan dibiarkan.",
      },
      reference: "Dependent mart, refresh jam 6, SLA jam 7, dashboard selesai 7:05. Review pemakaian tiap kuartal.",
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
        "Lab: fact 400 MB; mart 30 persen: 120 MB.",
        "Dependent mart dari warehouse: satu kebenaran. Independent dari sumber: cepat, risiko dua kebenaran.",
        "Mart berisi model untuk tim itu — bukan salinan mentah tabel sumber.",
        "Refresh mengikuti ritme keputusan; SLA tertulis; pemilik bernama.",
        "Definisi metrik selaras lewat semantic layer pusat.",
      ],
      next: { label: "BI32 — Presentasi Eksekutif: Dari Dashboard ke PowerPoint yang Didengar", href: "/v2/learn/biz32-presentasi-eksekutif-powerpoint" },
      quiz: [
        {
          q: "Fact 2 juta baris dikali 200 byte; mart 30 persen baris. Berapa ukuran fact dan mart?",
          options: [
            { text: "Fact 400 MB; mart 400 MB — mart menyalin semua", why: "Salah: mart hanya 30 persen baris; menyalin semua berarti bukan mart melainkan duplikat warehouse." },
            { text: "Fact 40 MB; mart 12 MB — salah menaruh nol", why: "Salah: 2.000.000 x 200 = 400.000.000, bukan 40.000.000." },
            { text: "Fact 400 MB; mart 120 MB", why: "Tepat: 2.000.000 x 200 = 400.000.000 byte = 400 MB; 30 persen dari 400 = 120 MB.", correct: true },
            { text: "Fact 400 MB; mart 30 MB — persen disalahartikan", why: "Salah: 30 persen dari 400 adalah 120, bukan 30." },
          ],
        },
        {
          q: "Apa risiko terbesar independent mart?",
          options: [
            { text: "Ia terlalu lambat dibangun", why: "Salah: independent justru cepat dibangun karena tidak menunggu warehouse." },
            { text: "Ia tidak bisa di-refresh", why: "Salah: independent mart bisa di-refresh dari sumbernya." },
            { text: "Ia selalu lebih besar dari warehouse", why: "Salah: mart adalah subset — ukurannya lebih kecil." },
            { text: "Tiap mart mendefinisikan metrik sendiri — dua mart bisa memberi dua jawaban", why: "Tepat: itulah awal kekacauan definisi — dua versi kebenaran.", correct: true },
          ],
        },
        {
          q: "Tim marketing memutuskan tiap pagi. Kapan mart harus di-refresh?",
          options: [
            { text: "Tiap pagi sebelum jam keputusan, dengan SLA tertulis", why: "Tepat: refresh mengikuti ritme keputusan — tersedia jam 7 untuk keputusan pagi.", correct: true },
            { text: "Tiap bulan — cukup untuk laporan bulanan", why: "Salah: keputusan harian butuh data harian; refresh bulanan berarti data basi 29 hari." },
            { text: "Real-time terus-menerus", why: "Salah: real-time mahal dan tidak dibutuhkan untuk keputusan pagi; refresh terjadwal sudah cukup." },
            { text: "Bila ada yang meminta", why: "Salah: refresh berdasarkan permintaan berarti data basi sampai ada yang mengeluh." },
          ],
        },
        {
          q: "Mart yang tidak dibuka siapa pun selama satu kuartal sebaiknya apa?",
          options: [
            { text: "Dibiarkan — storage murah", why: "Salah: mart zombie menumpuk biaya, kebingungan, dan risiko definisi basi." },
            { text: "Dipensiunkan setelah review pemakaian", why: "Tepat: review kuartalan memensiunkan mart yang tidak dipakai — seperti dashboard zombie.", correct: true },
            { text: "Diperbesar agar lebih menarik", why: "Salah: memperbesar mart yang tidak dipakai hanya memperbesar pemborosan." },
            { text: "Dipindah ke warehouse pusat", why: "Salah: memindah tidak menyelesaikan masalah — tidak ada yang memakainya di mana pun." },
          ],
        },
        {
          q: "Bagaimana menjaga definisi metrik di mart tetap sama dengan di pusat?",
          options: [
            { text: "Menyalin definisi ke tiap mart dan berharap tidak berubah", why: "Salah: salinan akan menyimpang saat definisi berubah di satu tempat saja." },
            { text: "Melarang mart memakai metrik pusat", why: "Salah: itu justru memaksa tiap mart mendefinisikan sendiri — sumber dua kebenaran." },
            { text: "Keduanya membaca definisi yang sama dari semantic layer pusat", why: "Tepat: satu definisi, banyak konsumen — perubahan sekali, berlaku di semua tempat.", correct: true },
            { text: "Menghapus semantic layer pusat", why: "Salah: menghapus pusat menghilangkan satu-satunya jangkar keselarasan." },
          ],
        },
      ],
    },
  ],
};

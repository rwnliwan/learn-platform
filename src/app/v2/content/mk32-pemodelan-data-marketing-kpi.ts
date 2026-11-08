import type { V2Lesson } from "../lib/types";

export const mk32: V2Lesson = {
  slug: "mk32-pemodelan-data-marketing-kpi",
  track: "Marketing Analytics",
  module: "Tracking & Data",
  title: "MK32 — Pemodelan Data Marketing dan KPI Framework: Dari Spend ke Keputusan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga channel, tiga definisi ROAS, satu rapat yang ricuh",
      prose: [
        "KirimCepat membelanjakan Rp150 juta di Google, Rp100 juta di Meta, Rp80 juta di TikTok. Tiap channel melaporkan ROAS-nya sendiri — tetapi definisi revenue-nya berbeda: Google memakai revenue 7 hari, Meta memakai 28 hari, TikTok memakai revenue yang belum dikurangi refund. Rapat alokasi budget ricuh: tiap tim membela angkanya, dan tidak ada yang bisa membandingkan ketiganya.",
        "Akar masalahnya: tidak ada model data marketing yang disepakati dan tidak ada KPI framework. Spend, revenue, dan akuisisi tinggal di tiga tabel berbeda dengan grain berbeda — dan tiap analis menghitung ROAS dengan caranya sendiri.",
        "Lesson ini mengajarkan pemodelan data marketing (star schema untuk marketing) dan KPI framework: dari spend ke CAC, LTV, dan rasio LTV banding CAC. Setelah lesson ini kamu bisa: (1) merancang fact spend, transaksi, dan akuisisi; (2) menjelaskan grain tiap fact; (3) menghitung CAC, LTV, dan rasio LTV banding CAC; (4) menulis definisi KPI yang tidak bisa di-gaming; (5) memutuskan KPI mana untuk keputusan apa.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MK25 sudah memakai star schema untuk dashboard marketing (3 tabel inti) dan BI5 mengajarkan KPI yang tidak bisa di-gaming — tetapi tidak ada lesson yang merancang model data marketing sebagai topik (grain tiap fact, snowflake untuk segmen) dan KPI framework marketing (CAC, LTV, rasio LTV banding CAC) sebagai satu sistem. Lesson ini membangun sistem itu.",
      },
      reference: "Spend 150 juta, akuisisi 3.000: CAC 50.000. LTV 180.000: rasio LTV banding CAC 3,6.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun model data marketing yang membuat ROAS tiga channel bisa dibandingkan — dan KPI yang tidak bisa di-gaming.",
        "(1) Merancang fact spend_harian, transaksi, dan user_akuisisi dengan grain yang jelas;",
        "(2) Memilih star vs snowflake untuk dimensi segmen dan kampanye;",
        "(3) Menghitung CAC, LTV, dan rasio LTV banding CAC;",
        "(4) Menulis definisi KPI: rumus, sumber, jendela, dan pemilik;",
        "(5) Memetakan KPI ke keputusan: alokasi, target, dan evaluasi channel.",
      ],
      tasks: [],
    },
    {
      id: "model-data",
      eyebrow: "Langkah 3 · Teori",
      title: "Model data: tiga fact, satu grain tiap fact",
      prose: [
        "Tiga fact inti marketing. spend_harian: grain satu baris per kampanye per hari — menyimpan spend, impresi, klik. transaksi: grain satu baris per order — menyimpan revenue, refund, dan kanal atribusi. user_akuisisi: grain satu baris per pengguna — menyimpan tanggal akuisisi, kanal pertama, dan segmen.",
        "Dimensinya: kanal, kampanye, tanggal, segmen pelanggan. Star schema: fact di tengah, dimensi di sekeliling — join fact ke dimensi tidak menggandakan baris. Snowflake dipakai seperlunya: segmen yang berhirarki (segmen ke persona ke tier) boleh dinormalisasi bertingkat bila tim segmen mengelolanya sendiri — pelajaran yang sama seperti BI27.",
        "Aturan grain yang paling sering dilanggar: mencampur grain dalam satu fact — baris harian dan baris bulanan di tabel yang sama. Agregat dari fact campuran adalah angka yang salah dengan keyakinan penuh. Satu fact, satu grain — tulis grain-nya di nama tabel atau di dokumentasi yang dibaca semua orang.",
      ],
      tasks: [],
      note: {
        title: "Refund adalah bagian dari model, bukan koreksi",
        body: "Revenue yang belum dikurangi refund adalah revenue yang salah — seperti di cerita pembuka, TikTok terlihat paling bagus karena refund tidak dihitung. Fact transaksi menyimpan revenue kotor dan refund sebagai kolom terpisah, dan KPI memakai revenue bersih. Keputusan itu ditulis di definisi KPI, bukan di kepala analis.",
      },
      reference: "Tiga fact: spend_harian, transaksi, user_akuisisi. Satu fact, satu grain. Revenue KPI memakai revenue bersih setelah refund.",
    },
    {
      id: "kpi-framework",
      eyebrow: "Langkah 4 · Teori",
      title: "KPI framework: CAC, LTV, dan rasio yang jujur",
      prose: [
        "CAC (Customer Acquisition Cost) sama dengan spend dibagi akuisisi baru: Rp150 juta dibagi 3.000 sama dengan Rp50.000 per pelanggan. LTV (Lifetime Value) adalah laba kotor yang diharapkan dari pelanggan selama hubungannya dengan perusahaan — di lesson ini Rp180.000. Rasio LTV banding CAC sama dengan 180.000 dibagi 50.000 sama dengan 3,6 — tiap Rp1 biaya akuisisi menghasilkan Rp3,6 nilai.",
        "Aturan praktis: rasio di bawah 1 berarti bakar uang — tiap pelanggan baru merugikan. Rasio 1 sampai 3 berarti sehat tetapi rapuh — sedikit kenaikan CAC atau penurunan LTV membaliknya. Rasio di atas 3 berarti kuat — ada ruang untuk menaikkan spend. Tetapi rasio tanpa jendela adalah angka yang menipu: LTV 12 bulan melawan CAC bulan ini tidak sebanding — samakan jendelanya, dan tulis jendela itu di definisi.",
        "KPI framework menata KPI dalam tiga lapis: north star (satu metrik yang menentukan keberhasilan — misalnya revenue bersih per pelanggan), input (yang bisa dikendalikan — spend, CTR, conversion rate), dan guardrail (yang tidak boleh dikorbankan — refund rate, churn, keluhan). Tiap KPI punya rumus, sumber, jendela, pemilik, dan ambang — tanpa kelimanya, KPI itu opini.",
      ],
      tasks: [],
      reference: "CAC 50.000; LTV 180.000; rasio 3,6. Di bawah 1 bakar uang; 1 sampai 3 rapuh; di atas 3 kuat. North star, input, guardrail.",
    },
    {
      id: "lab-kpi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung CAC dan rasio LTV banding CAC",
      prose: [
        "Lab ini menghitung CAC dan rasio LTV banding CAC dari spend, akuisisi, dan LTV.",
        "Hitung dulu di kepala. CAC: 150.000.000 dibagi 3.000 sama dengan 50.000. Rasio: 180.000 dibagi 50.000 sama dengan 3,6.",
        "Tugas lab: tulis fungsi yang menerima spend, akuisisi, dan LTV — lalu mencetak dua angka: cac dan rasio_ltv_cac.",
        "Setelah lolos, coba eksperimen: naikkan spend menjadi 180 juta dan lihat CAC naik menjadi 60.000 dan rasio turun menjadi 3,0 — masih kuat, tetapi ruangnya menyempit.",
      ],
      tasks: [
        { id: "t1", text: "Hitung cac dari spend dan akuisisi" },
        { id: "t2", text: "Hitung rasio_ltv_cac dari LTV dan CAC" },
      ],
      expected: "cac=50000\nrasio_ltv_cac=3.6",
      hints: [
        "CAC = spend dibagi akuisisi.",
        "Rasio = LTV dibagi CAC.",
      ],
      code: {
        starter: `# Kampanye Google KirimCepat: spend, akuisisi, LTV.\nspend = 150000000\nakuisisi = 3000\nltv = 180000\n\n# TULIS KODEMU: hitung cac dan rasio_ltv_cac.\n# Cetak, per baris: cac, rasio_ltv_cac.\n\n\nmesin_kpi(spend, akuisisi, ltv)`,
        lockLines: 4,
        solution: `# Kampanye Google KirimCepat: spend, akuisisi, LTV.\nspend = 150000000\nakuisisi = 3000\nltv = 180000\n\n\ndef mesin_kpi(spend, akuisisi, ltv):\n    cac = spend // akuisisi\n    rasio_ltv_cac = ltv / cac\n    print(f"cac={cac}")\n    print(f"rasio_ltv_cac={rasio_ltv_cac}")\n\n\nmesin_kpi(spend, akuisisi, ltv)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "cac=50000", label: "CAC Rp50.000", msg: "150.000.000 / 3.000 = 50.000 per pelanggan." },
          { kind: "stdout_matches", task: "t2", pattern: "rasio_ltv_cac=3.6", label: "Rasio 3,6", msg: "180.000 / 50.000 = 3,6. Di atas 3 — kuat." },
        ],
      },
      reference: "CAC 50.000; rasio LTV banding CAC 3,6.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: rapat alokasi yang akhirnya membandingkan apel dengan apel",
      prose: [
        "Kembali ke KirimCepat. Model data disepakati: tiga fact dengan grain tertulis, revenue bersih setelah refund, jendela atribusi 7 hari yang sama untuk semua channel. KPI framework ditulis satu halaman: CAC, LTV, rasio, north star, input, dan guardrail — masing-masing dengan rumus, sumber, jendela, dan pemilik.",
        "Rapat alokasi berikutnya: Google CAC 50.000 rasio 3,6; Meta CAC 80.000 rasio 2,2; TikTok CAC 45.000 rasio 3,1 setelah refund dihitung. Keputusan: tambah spend Google dan TikTok, kurangi Meta — dan pantau guardrail refund rate tiap minggu. Tidak ada yang membela angkanya sendiri, karena angkanya berasal dari model yang sama.",
        "Keputusan rapat: definisi KPI tidak boleh diubah tanpa persetujuan pemilik KPI dan catatan perubahan. Tiga bulan kemudian definisi ROAS diubah — dengan catatan, tanggal, dan alasan — dan semua laporan historis diberi label versi definisi.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat model ini bertahan. Pertama, grain tertulis per fact — agregat tidak lagi salah diam-diam. Kedua, revenue bersih setelah refund — channel tidak lagi terlihat bagus karena refund disembunyikan. Ketiga, definisi berversi — perubahan definisi tercatat, bukan diam-diam.",
      },
      reference: "Google rasio 3,6; Meta 2,2; TikTok 3,1 setelah refund. Definisi KPI berversi dan tercatat.",
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
        "Lab: CAC 50.000; rasio LTV banding CAC 3,6.",
        "Tiga fact: spend_harian, transaksi, user_akuisisi — satu fact, satu grain.",
        "Revenue KPI memakai revenue bersih setelah refund.",
        "Rasio di bawah 1 bakar uang; 1 sampai 3 rapuh; di atas 3 kuat.",
        "KPI butuh rumus, sumber, jendela, pemilik, dan ambang — tanpanya ia opini.",
      ],
      next: { label: "MK33 — Social Network Analysis: Siapa Mempengaruhi Siapa", href: "/v2/learn/mk33-social-network-analysis" },
      quiz: [
        {
          q: "Spend Rp150 juta, akuisisi 3.000, LTV Rp180.000. Berapa CAC dan rasio LTV banding CAC?",
          options: [
            { text: "CAC 50.000, rasio 0,28 — terbalik", why: "Salah: rasio adalah LTV dibagi CAC, bukan CAC dibagi LTV." },
            { text: "CAC 500.000, rasio 0,36 — salah nol", why: "Salah: 150.000.000 / 3.000 = 50.000, bukan 500.000." },
            { text: "CAC 50.000, rasio 3,6", why: "Tepat: 150.000.000 / 3.000 = 50.000; 180.000 / 50.000 = 3,6.", correct: true },
            { text: "CAC 50.000, rasio 3,6 tetapi tanpa jendela tetap valid", why: "Salah: angkanya benar, tetapi rasio tanpa jendela yang sama bisa menipu — LTV 12 bulan vs CAC bulan ini tidak sebanding." },
          ],
        },
        {
          q: "Kenapa revenue TikTok terlihat paling bagus di cerita pembuka?",
          options: [
            { text: "Karena TikTok memang channel terbaik", why: "Salah: setelah refund dihitung, rasionya 3,1 — di bawah Google 3,6." },
            { text: "Karena jendela atribusinya paling panjang", why: "Salah: jendela berbeda adalah masalah terpisah — yang membuat TikTok terlihat bagus adalah refund." },
            { text: "Karena spend TikTok paling kecil", why: "Salah: spend kecil tidak membuat ROAS besar — revenue per spend yang menentukan." },
            { text: "Karena revenue-nya belum dikurangi refund", why: "Tepat: revenue kotor membesarkan ROAS; KPI wajib memakai revenue bersih.", correct: true },
          ],
        },
        {
          q: "Apa yang salah dengan fact yang mencampur baris harian dan bulanan?",
          options: [
            { text: "Agregatnya salah dengan keyakinan penuh — satu fact harus satu grain", why: "Tepat: grain campuran adalah sumber angka salah yang tidak ketahuan.", correct: true },
            { text: "Tidak ada — agregat tetap benar", why: "Salah: agregat dari grain campuran menghitung baris yang tidak sebanding." },
            { text: "Hanya memperlambat query", why: "Salah: masalahnya kebenaran, bukan kecepatan." },
            { text: "Hanya membingungkan analis baru", why: "Salah: analis berpengalaman pun akan salah bila grain tidak tertulis." },
          ],
        },
        {
          q: "Rasio LTV banding CAC 0,8. Apa artinya?",
          options: [
            { text: "Sehat — di bawah 1 berarti efisien", why: "Salah: terbalik — di bawah 1 berarti tiap pelanggan baru merugikan." },
            { text: "Bakar uang — tiap Rp1 biaya akuisisi hanya menghasilkan Rp0,8 nilai", why: "Tepat: rasio di bawah 1 berarti akuisisi merugikan.", correct: true },
            { text: "Kuat — ruang menaikkan spend besar", why: "Salah: itu rasio di atas 3, bukan 0,8." },
            { text: "Tidak bisa dinilai tanpa tahu spend-nya", why: "Salah: rasio sudah menormalkan spend — 0,8 selalu berarti merugikan." },
          ],
        },
        {
          q: "KPI tanpa rumus, sumber, jendela, pemilik, dan ambang adalah apa?",
          options: [
            { text: "KPI yang fleksibel", why: "Salah: fleksibel tanpa definisi berarti tiap orang menghitung berbeda." },
            { text: "KPI north star", why: "Salah: north star justru KPI yang definisinya paling ketat." },
            { text: "Opini — tiap analis menghitung dengan caranya sendiri", why: "Tepat: itulah akar ricuh di cerita pembuka — tiga definisi ROAS.", correct: true },
            { text: "KPI guardrail", why: "Salah: guardrail juga butuh definisi lengkap." },
          ],
        },
      ],
    },
  ],
};

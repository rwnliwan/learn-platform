import type { V2Lesson } from "../lib/types";

export const fr34: V2Lesson = {
  slug: "fr34-correspondent-banking",
  track: "Fraud & AML Analytics",
  module: "AML & Kepatuhan",
  title: "FR34 — Correspondent Banking: Bank di Balik Bank",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Delapan puluh bank responden, dua belas yang paling berisiko",
      prose: [
        "Sebuah bank besar menyediakan jasa correspondent banking untuk 80 bank responden di seluruh dunia — bank-bank kecil yang tidak punya akses langsung ke sistem pembayaran dolar dan euro, sehingga mereka 'menumpang' pada bank besar itu. Dari 80 itu, 12 dinilai berisiko tinggi (15,0 persen), 38 berisiko sedang, dan 30 berisiko rendah. Bank besar itu menghadapi pilihan: mengakhiri 12 hubungan berisiko tinggi — de-risking — dengan penghematan bersih Rp1.020 juta (biaya monitoring Rp2.160 juta dikurangi pendapatan yang hilang Rp1.140 juta) — atau mempertahankannya dengan pengawasan yang lebih mahal.",
        "Pilihan itu tidak sesederhana aritmetika. Mengakhiri hubungan berarti memutus akses pembayaran bagi jutaan orang di negara yang bank-bank itu layani — termasuk pekerja migran yang mengirim uang ke keluarganya. Mempertahankannya berarti menanggung risiko bahwa salah satu dari 12 bank itu dipakai untuk pencucian uang — dan regulator akan bertanya kenapa bank besar itu tetap melayani mereka. Lesson ini mengajarkan correspondent banking: cara kerjanya, risikonya, dan cara memutuskan dengan angka dan dengan tanggung jawab.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Correspondent banking tidak pernah disebut di track FR (pencarian menghasilkan nol). FR15 membahas AML dari sudut transaksi, FR23 dari sudut regulasi Indonesia — tetapi tidak ada lesson tentang hubungan antar bank itu sendiri: nested account, payable-through account, dan de-risking. Lesson ini membangun semuanya.",
      },
      reference: "80 bank responden: 12 risiko tinggi (15,0 persen), 38 sedang, 30 rendah. De-risking: hemat bersih Rp1.020 juta.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menilai dan memutuskan hubungan correspondent banking.",
        "(1) Menjelaskan cara kerja correspondent banking dan kenapa ia diperlukan;",
        "(2) Menjelaskan tiga risiko khusus: nested account, payable-through, dan downstream;",
        "(3) Menghitung pangsa risiko tinggi dan ekonomi keputusan de-risking;",
        "(4) Menjelaskan uji tuntas (due diligence) atas bank responden;",
        "(5) Menilai de-risking terhadap dampaknya pada inklusi keuangan.",
      ],
      tasks: [],
    },
    {
      id: "cara-kerja",
      eyebrow: "Langkah 3 · Teori",
      title: "Cara kerja: menumpang di rekening nostro dan vostro",
      prose: [
        "Correspondent banking adalah layanan di mana satu bank (correspondent) menyediakan jasa pembayaran dan kliring untuk bank lain (respondent) yang tidak punya akses langsung ke sistem pembayaran suatu mata uang. Bank responden membuka rekening di bank koresponden — rekening itu disebut nostro dari sisi responden dan vostro dari sisi koresponden — dan semua pembayaran dolarnya mengalir lewat rekening itu.",
        "Tanpa layanan ini, perdagangan internasional berhenti: bank kecil di negara berkembang tidak bisa membayar eksportir dalam dolar bila tidak ada bank besar yang menjadi perantaranya. Sistem ini adalah infrastruktur pembayaran global yang tidak terlihat — dan justru karena tidak terlihat, ia menjadi jalur yang menarik bagi pencucian uang: satu transfer yang masuk ke rekening vostro bisa berasal dari ratusan nasabah bank responden yang tidak pernah dilihat oleh bank koresponden.",
        "Di sinilah letak risiko intinya: bank koresponden melihat bank responden sebagai satu nasabah, tetapi di balik satu nasabah itu ada ribuan nasabah akhir yang tidak dikenalnya. Bila bank responden tidak melakukan uji tuntas yang baik atas nasabahnya sendiri, bank koresponden tanpa sadar menjadi perantara pencucian uang — dan regulator akan menanyai bank koresponden, bukan hanya bank responden.",
      ],
      tasks: [],
      note: {
        title: "Nostro vs vostro — satu rekening, dua nama",
        body: "Rekening yang sama disebut nostro ('milik kami') oleh bank yang menitipkan dananya, dan vostro ('milik kalian') oleh bank yang menyimpannya. Kebingungan istilah ini adalah sumber kesalahan klasik dalam rekonsiliasi antar bank — pastikan selalu jelas dari sisi mana kamu membaca.",
      },
      reference: "80 responden menumpang pada satu koresponden; koresponden melihat satu nasabah, di baliknya ribuan nasabah akhir.",
    },
    {
      id: "tiga-risiko",
      eyebrow: "Langkah 4 · Teori",
      title: "Tiga risiko: nested, payable-through, dan downstream",
      prose: [
        "Risiko pertama: nested account. Bank responden A melayani bank B yang tidak punya hubungan dengan bank koresponden — sehingga bank B 'menumpang ganda' lewat A. Bank koresponden bahkan tidak tahu bank B ada. Bila B dipakai untuk pencucian, jejaknya masuk lewat A yang terlihat bersih. Uji tuntas yang baik wajib bertanya: apakah respondenmu sendiri melayani bank lain?",
        "Risiko kedua: payable-through account. Bank responden memberi nasabahnya akses langsung ke rekening vostro — nasabah akhir bisa bertransaksi seolah-olah ia nasabah bank koresponden. Ini umumnya dianggap risiko tertinggi di antara ketiganya — tetapi itu penilaian, bukan hukum alam: bank yang mengenal baik respondennya dan memonitor transaksinya bisa menilai risiko ini lebih rendah daripada nested yang tidak terlihat. Praktiknya bervariasi: sebagian bank besar melarang payable-through, sebagian mengizinkannya hanya dengan daftar nasabah akhir yang disetujui sebelumnya, batas transaksi, monitoring, dan hak untuk memblokir sub-rekening tertentu. Yang benar dalam semua varian: bank koresponden tidak mengenal tiap nasabah akhir secara langsung, sehingga ia harus mengompensasi dengan kontrol atas respondennya — bukan dengan berpura-pura mengenal mereka.",
        "Risiko ketiga: downstream — nasabah akhir bank responden yang berisiko tinggi (politically exposed person, perusahaan cangkang, atau nasabah dari yurisdiksi berisiko) yang transaksinya mengalir tanpa filter tambahan. Pertahanan terhadap ketiganya adalah satu: due diligence atas responden yang mencakup pertanyaan tentang nasabah AKHIR mereka — dan hak untuk mengakhiri hubungan bila jawabannya tidak memuaskan.",
        "Uji tuntas atas responden — enam langkah operasional. (1) Kumpulkan fakta dasar: lisensi dan regulator, struktur kepemilikan dan pemilik manfaat, yurisdiksi operasi, dan laporan keuangan. (2) Nilai program AML responden: kebijakan tertulis, penanggung jawab kepatuhan, pelatihan, audit independen, dan riwayat sanksi atau denda. (3) Tanyakan soal menumpang: apakah responden melayani bank lain (nested)? Apakah ia memberi akses payable-through, dan kepada siapa? (4) Nilai nasabah akhirnya: profil downstream — berapa PEP, berapa perusahaan cangkang, berapa dari yurisdiksi berisiko — dan apakah responden melakukan EDD atas mereka. (5) Tetapkan syarat hubungan: monitoring transaksi, batas volume, review tahunan, hak audit atas responden, dan hak mengakhiri bila syarat dilanggar. (6) Dokumentasikan semuanya dan laporkan penilaian ke komite — termasuk alasan mempertahankan responden yang berisiko tinggi, bukan hanya alasan mengakhirinya. Uji tuntas yang tidak didokumentasikan sama dengan tidak dilakukan: auditor dan regulator akan meminta buktinya.",
      ],
      tasks: [],
      note: {
        title: "De-risking vs risk-based approach",
        body: "Regulator (termasuk FATF) berulang kali menegaskan: de-risking massal — memutus semua hubungan dengan satu negara atau satu kategori — BUKAN pendekatan yang diminta. Yang diminta adalah pendekatan berbasis risiko: nilai tiap responden satu per satu, pertahankan yang bisa dikelola, akhiri yang tidak bisa. De-risking massal merusak inklusi keuangan tanpa membuat sistem lebih aman.",
      },
      reference: "Nested: menumpang ganda. Payable-through: nasabah akhir bertransaksi langsung. Downstream: nasabah akhir berisiko.",
    },
    {
      id: "lab-koresponden",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung pangsa risiko dan ekonomi de-risking",
      prose: [
        "Lab ini menghitung dua angka dari data cerita pembuka: pangsa bank responden berisiko tinggi, dan penghematan bersih bila 12 hubungan itu diakhiri. Hitung dulu di kepala. Pangsa risiko tinggi: 12 dibagi 80 dikali 100 sama dengan 15,0 persen. Penghematan bersih: biaya monitoring 12 dikali Rp180 juta sama dengan Rp2.160 juta; pendapatan hilang 12 dikali Rp95 juta sama dengan Rp1.140 juta; selisihnya Rp1.020 juta.",
        "Tugas lab: isi tiga variabel — pangsa_tinggi, hemat_bersih, dan keputusan ('PERTAHANKAN_DENGAN_EDD' bila pangsa di bawah 20 persen dan hemat bersih positif tetapi ada dampak inklusi — karena angka saja tidak cukup untuk memutus akses pembayaran) — lalu cetak ketiganya. Perhatian: 'keputusan' di lab ini adalah REKOMENDASI AWAL hasil penyaringan, BUKAN keputusan final. Aturan ambang tunggal tidak boleh memutuskan sendiri: responden dengan pangsa 15 persen tetapi EDD-nya gagal tetap harus diakhiri, dan responden 25 persen yang EDD-nya bersih bisa dipertahankan dengan syarat. Keputusan final dibuat komite manusia setelah membaca hasil uji tuntas tiap responden (enam langkah di Langkah 4), dampak inklusi, dan ekspektasi regulator. Tiga output ini adalah memo keputusan ke komite: berapa besar risikonya, berapa hematnya, dan apa rekomendasi awalnya.",
        "Setelah lolos, coba eksperimen: naikkan bank berisiko tinggi menjadi 24 dan lihat pangsa menjadi 30,0 persen — lalu tanyakan: apakah rekomendasi awal berubah? Jawabannya: ya — di atas 20 persen, konsentrasi risiko itu sendiri menjadi temuan, dan de-risking sebagian menjadi kandidat kuat — tetapi tetap diputuskan per bank setelah uji tuntas, bukan otomatis. Ambang 20 persen harus disepakati sebelum audit, bukan setelah melihat hasilnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung pangsa bank responden berisiko tinggi dalam persen" },
        { id: "t2", text: "Hitung penghematan bersih de-risking (Rp juta)" },
        { id: "t3", text: "Tentukan rekomendasi AWAL dari ambang pangsa 20 persen (bukan keputusan final — keputusan final dibuat komite setelah uji tuntas)" },
      ],
      expected: "pangsa_tinggi=15.0\nhemat_bersih=1020\nkeputusan=PERTAHANKAN_DENGAN_EDD",
      hints: [
        "Pangsa = bank risiko tinggi dibagi total responden, dikali 100.",
        "Hemat bersih = (12 x 180) - (12 x 95).",
        "Pangsa 15,0 persen di bawah ambang 20 persen — pertahankan dengan EDD yang diperketat.",
      ],
      code: {
        starter: "# Correspondent banking: 80 bank responden (Rp juta). JANGAN UBAH.\ntotal_responden = 80\nrisiko_tinggi = 12\nbiaya_monitoring = 180\npendapatan_per_bank = 95\n\n# TULIS KODEMU: pangsa risiko tinggi, hemat bersih, keputusan\npangsa_tinggi = \nhemat_bersih = \nkeputusan = \nprint(f\"pangsa_tinggi={round(pangsa_tinggi, 1)}\")\nprint(f\"hemat_bersih={hemat_bersih}\")\nprint(f\"keputusan={keputusan}\")",
        lockLines: 6,
        solution: "# Correspondent banking: 80 bank responden (Rp juta). JANGAN UBAH.\ntotal_responden = 80\nrisiko_tinggi = 12\nbiaya_monitoring = 180\npendapatan_per_bank = 95\n\n# TULIS KODEMU: pangsa risiko tinggi, hemat bersih, keputusan\npangsa_tinggi = risiko_tinggi / total_responden * 100\nhemat_bersih = risiko_tinggi * biaya_monitoring - risiko_tinggi * pendapatan_per_bank\nkeputusan = \"PERTAHANKAN_DENGAN_EDD\" if pangsa_tinggi < 20 else \"DE-RISKING_SEBAGIAN\"\nprint(f\"pangsa_tinggi={round(pangsa_tinggi, 1)}\")\nprint(f\"hemat_bersih={hemat_bersih}\")\nprint(f\"keputusan={keputusan}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "pangsa_tinggi=15.0", label: "Pangsa risiko tinggi 15,0 persen", msg: "12 / 80 x 100 = 15,0. Di bawah ambang 20 persen." },
          { kind: "stdout_matches", task: "t2", pattern: "hemat_bersih=1020", label: "Hemat bersih Rp1.020 juta", msg: "2.160 - 1.140 = 1.020. Hemat finansial saja tidak cukup untuk memutus akses pembayaran." },
          { kind: "stdout_matches", task: "t3", pattern: "keputusan=PERTAHANKAN_DENGAN_EDD", label: "Rekomendasi awal: pertahankan dengan EDD", msg: "Pangsa di bawah ambang — rekomendasi awal pertahankan dengan pengawasan diperketat, bukan de-risking massal. Keputusan final tetap di komite setelah uji tuntas." },
        ],
      },
      reference: "Pangsa 15,0 persen; hemat bersih Rp1.020 juta; keputusan PERTAHANKAN_DENGAN_EDD.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: negara yang kehilangan akses dolar",
      prose: [
        "Sebuah bank besar pernah mengakhiri SEMUA hubungan correspondent banking dengan satu negara kecil — de-risking massal — setelah satu bank respondennya terkena sanksi. Akibatnya: eksportir negara itu tidak bisa dibayar dalam dolar, pekerja migran tidak bisa mengirim uang pulang, dan bantuan kemanusiaan tertahan berminggu-minggu. Ironisnya, pencucian uang tidak berhenti — ia pindah ke jalur informal yang tidak terpantau sama sekali. Sistem menjadi lebih buta, bukan lebih aman.",
        "Regulator menegur bank itu: pendekatan berbasis risiko berarti menilai tiap responden satu per satu, bukan memutus satu negara sekaligus. Bank itu kembali — dengan syarat: hanya bank responden yang lulus uji tuntas yang dipertahankan, dengan monitoring transaksi yang diperketat dan review tahunan. Dari 9 bank responden di negara itu, 6 dipertahankan dan 3 diakhiri — keputusan per bank, bukan per negara.",
        "Pelajaran yang dicatat: de-risking massal adalah jalan pintas yang merusak. Ia terlihat tegas di laporan, tetapi ia memutus akses bagi yang sah dan mendorong yang jahat ke jalur yang lebih gelap. Analis yang merekomendasikan de-risking harus selalu menjawab satu pertanyaan: siapa yang kehilangan akses bila hubungan ini diputus — dan apakah mereka punya alternatif yang sah?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan kedua benar. Pertama, penilaian per bank, bukan per negara. Kedua, syarat yang jelas — uji tuntas dan monitoring diperketat — bukan penolakan tanpa syarat. Ketiga, dampak inklusi dihitung sebagai bagian dari keputusan, bukan sebagai renungan sesudahnya.",
      },
      reference: "De-risking massal satu negara: 6 dari 9 bank akhirnya dipertahankan dengan syarat.",
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
        "Correspondent banking: bank kecil menumpang pada bank besar untuk akses pembayaran dolar dan euro.",
        "Lab: pangsa risiko tinggi 15,0 persen; hemat bersih Rp1.020 juta; rekomendasi awal PERTAHANKAN_DENGAN_EDD (keputusan final di komite setelah uji tuntas).",
        "Tiga risiko: nested account, payable-through, downstream.",
        "Uji tuntas responden: 6 langkah — fakta dasar, program AML, nested/payable-through, nasabah akhir, syarat hubungan, dokumentasi ke komite.",
        "FATF menolak de-risking massal — yang diminta adalah pendekatan berbasis risiko per responden.",
        "De-risking harus menghitung dampak inklusi: siapa yang kehilangan akses.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "80 bank responden, 12 berisiko tinggi. Biaya monitoring Rp180 jt per bank, pendapatan Rp95 jt per bank. Berapa pangsa dan hemat bersih de-risking?",
          options: [
            { text: "15,0 persen dan Rp1.020 juta", why: "Tepat: 12/80 = 15,0 persen; 12 x 180 - 12 x 95 = 2.160 - 1.140 = 1.020.", correct: true },
            { text: "15,0 persen dan Rp2.160 juta — lupa mengurangi pendapatan hilang", why: "Salah: 2.160 adalah biaya monitoring saja; hemat bersih mengurangkan pendapatan yang hilang." },
            { text: "12,0 persen dan Rp1.020 juta", why: "Salah: 12,0 persen adalah jumlah banknya, bukan pangsanya. Pangsa = 12/80 = 15,0 persen." },
            { text: "15,0 persen dan Rp1.140 juta", why: "Salah: 1.140 adalah pendapatan yang hilang, bukan penghematan bersih." },
          ],
        },
        {
          q: "Apa itu nested account dalam correspondent banking?",
          options: [
            { text: "Rekening bank responden yang dipakai bank lain yang tidak dikenal koresponden", why: "Tepat: bank B menumpang ganda lewat bank A — koresponden tidak tahu B ada.", correct: true },
            { text: "Rekening nostro dan vostro yang sama", why: "Salah: itu satu rekening dengan dua nama, bukan nested account." },
            { text: "Rekening nasabah akhir di bank responden", why: "Salah: itu downstream, bukan nested. Nested adalah bank di balik bank." },
            { text: "Rekening bersama dua bank koresponden", why: "Salah: tidak ada konsep seperti itu dalam correspondent banking." },
          ],
        },
        {
          q: "Bank besar mengakhiri semua hubungan dengan satu negara setelah satu bank terkena sanksi. Apa penilaian yang benar?",
          options: [
            { text: "Benar — tegas dan aman", why: "Salah: de-risking massal merusak inklusi dan mendorong pencucian ke jalur informal yang tidak terpantau." },
            { text: "Salah — yang diminta FATF adalah pendekatan berbasis risiko per responden", why: "Tepat: nilai tiap bank satu per satu; pertahankan yang bisa dikelola.", correct: true },
            { text: "Benar — bila satu bank bermasalah, semua bank di negara itu bermasalah", why: "Salah: generalisasi per negara adalah prasangka, bukan penilaian risiko." },
            { text: "Salah — bank tidak boleh mengakhiri hubungan apa pun", why: "Salah: bank boleh dan harus mengakhiri hubungan dengan responden yang tidak bisa dikelola — tetapi per bank, bukan per negara." },
          ],
        },
        {
          q: "Apa risiko terbesar payable-through account?",
          options: [
            { text: "Biayanya mahal", why: "Salah: biaya bukan risiko utamanya." },
            { text: "Nasabah akhir bertransaksi langsung lewat rekening vostro tanpa pernah dikenal bank koresponden", why: "Tepat: koresponden menanggung eksposur atas nasabah yang tidak pernah ia kenal.", correct: true },
            { text: "Rekonsiliasi nostro-vostro menjadi sulit", why: "Salah: itu masalah operasional, bukan risiko terbesar." },
            { text: "Bank responden kehilangan pendapatannya", why: "Salah: terbalik — payable-through justru menguntungkan responden." },
          ],
        },
        {
          q: "Sebelum merekomendasikan de-risking satu hubungan, pertanyaan apa yang wajib dijawab analis?",
          options: [
            { text: "Berapa hemat bersihnya saja", why: "Salah: hemat finansial saja tidak cukup — dampak inklusi harus dihitung." },
            { text: "Siapa yang kehilangan akses bila hubungan diputus, dan apakah mereka punya alternatif yang sah", why: "Tepat: de-risking tanpa jawaban ini adalah keputusan yang buta terhadap dampaknya.", correct: true },
            { text: "Apakah bank lain sudah melakukan de-risking juga", why: "Salah: mengikuti bank lain bukan penilaian risiko — itu kawanan." },
            { text: "Apakah regulator akan memuji keputusan ini", why: "Salah: regulator justru menegur de-risking massal yang tidak berbasis risiko." },
          ],
        },
      ],
    },
  ],
};

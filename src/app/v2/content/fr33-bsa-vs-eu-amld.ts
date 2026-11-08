import type { V2Lesson } from "../lib/types";

export const fr33: V2Lesson = {
  slug: "fr33-bsa-vs-eu-amld",
  track: "Fraud & AML Analytics",
  module: "AML & Kepatuhan",
  title: "FR33 — BSA vs EU AMLD: Dua Rezim, Satu Uang",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu transaksi, dua laporan, dua ambang",
      prose: [
        "Sebuah bank global memproses 40 transaksi tunai besar dalam sehari di dua yurisdiksi. Di Amerika, aturan Bank Secrecy Act (BSA) mewajibkan Currency Transaction Report (CTR) untuk transaksi tunai di atas USD 10.000 — dari 40 transaksi itu, 22 melewati ambang dan wajib dilaporkan. Di Eropa, aturan Uni Eropa membatasi pembayaran tunai di atas EUR 10.000 — yang setara dengan sekitar USD 10.800 — dan dari 40 transaksi yang sama, hanya 15 yang melewati ambang itu. Tujuh transaksi yang wajib dilaporkan di Amerika tidak wajib dilaporkan di Eropa — bukan karena risikonya berbeda, melainkan karena ambangnya berbeda.",
        "Perbedaan kecil itu adalah inti lesson ini: pencucian uang adalah kejahatan lintas batas, tetapi aturan yang melawannya adalah aturan nasional dan regional. Analis AML yang bekerja di bank global harus bisa membaca dua rezim sekaligus — BSA Amerika dan AMLD Eropa — dan tahu persis di mana keduanya sama, di mana berbeda, dan di mana perbedaan itu dieksploitasi. Lesson ini membandingkan keduanya secara sistematis.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "FR15 dan FR23 membahas AML dari sudut Indonesia dan mekanisme umum — placement, layering, integration, STR. Perbandingan rezim BSA Amerika dan AMLD Eropa tidak pernah dibahas (pencarian 'BSA' dan 'AMLD' di track FR menghasilkan nol). Lesson ini membangun perbandingan komparatifnya dari nol.",
      },
      reference: "40 transaksi tunai: 22 wajib CTR di atas USD 10.000 (BSA); 15 melewati EUR 10.000 atau sekitar USD 10.800 (aturan UE). Selisih 7 transaksi.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membandingkan rezim AML Amerika dan Eropa dan menerapkan keduanya pada satu transaksi.",
        "(1) Menjelaskan kewajiban inti BSA: CTR, SAR, dan program AML;",
        "(2) Menjelaskan kewajiban inti AMLD: batas tunai, beneficial ownership, dan pendekatan berbasis risiko;",
        "(3) Menghitung transaksi yang wajib dilaporkan di tiap rezim dari satu dataset;",
        "(4) Menjelaskan perbedaan SAR Amerika dan STR Eropa dalam tenggat dan kerahasiaan;",
        "(5) Mengidentifikasi celah arbitrase rezim yang dieksploitasi pencuci uang.",
      ],
      tasks: [],
    },
    {
      id: "bsa",
      eyebrow: "Langkah 3 · Teori",
      title: "BSA Amerika: lapor transaksi, lapor kecurigaan",
      prose: [
        "Bank Secrecy Act (1970) adalah fondasi AML Amerika, dan ia bekerja dengan dua laporan. Currency Transaction Report (CTR): setiap transaksi tunai di atas USD 10.000 wajib dilaporkan ke FinCEN — tanpa penilaian risiko. Ambangnya kaku: USD 10.001 dilaporkan, USD 9.999 tidak. Kekakuan itu sengaja — ia membuat aturan bisa diaudit mesin, dan ia melahirkan kejahatan structuring: memecah transaksi menjadi di bawah USD 10.000 agar tidak dilaporkan (lihat FR15). Dua kualifikasi penting. Pertama, ada PENGECUALIAN terbatas: 'exempt persons' tertentu — bank, instansi pemerintah, perusahaan tercatat, dan beberapa kategori lain (31 CFR 1020.311) — dapat dikecualikan dari CTR oleh banknya, jadi 'tanpa pengecualian' adalah pernyataan yang salah. Kedua, aturan AGREGASI: beberapa transaksi tunai dalam satu hari usaha yang totalnya di atas USD 10.000 untuk orang yang sama WAJIB dijumlahkan dan dilaporkan sebagai satu CTR — memecah USD 90.000 menjadi sembilan setoran USD 10.000 di hari yang sama tidak menghindari CTR sama sekali.",
        "Laporan kedua: Suspicious Activity Report (SAR). Bila bank mencurigai transaksi, ia wajib melapor ke FinCEN dalam 30 hari (ditambah 30 hari bila tidak ada tersangka yang teridentifikasi). Tetapi 'berapa pun nilainya' adalah pernyataan yang salah: ada AMBANG SAR — USD 5.000 bila ada tersangka teridentifikasi, USD 25.000 bila tidak ada tersangka yang teridentifikasi (31 CFR 1020.320); pengecualiannya adalah penyalahgunaan oleh orang dalam (insider abuse), yang wajib dilaporkan berapa pun nilainya. SAR bersifat rahasia: bank dilarang memberi tahu nasabah bahwa SAR telah diajukan. Pelanggaran terhadap kerahasiaan itu sendiri adalah pelanggaran hukum. Di Amerika, SAR diajukan ke satu pintu — FinCEN — dan FinCEN yang membagikannya ke penegak hukum.",
        "BSA juga mewajibkan program AML tertulis dengan empat pilar: kebijakan dan prosedur, penanggung jawab kepatuhan, pelatihan, dan audit independen (lihat FR32). Di luar CTR, program AML BSA sendiri BERBASIS RISIKO: bank menilai risiko nasabah dan produknya lalu mengalokasikan sumber daya sesuai risiko — jadi dikotomi 'BSA = ambang kaku, Eropa = berbasis risiko' adalah penyederhanaan yang salah; yang kaku hanyalah CTR, bukan seluruh programnya. Yang membedakan BSA dari banyak rezim lain adalah penegakannya: denda Amerika adalah yang terbesar di dunia — miliaran dolar untuk satu bank. Soal jangkauan: BSA secara langsung mengikat lembaga keuangan Amerika serta cabang dan agensi bank asing di AS. Bank asing tanpa kehadiran di AS TIDAK langsung tunduk pada BSA hanya karena bertransaksi dalam dolar — tetapi kliring dolar melewati bank koresponden AS, dan bank koresponden AS itu WAJIB menerapkan due diligence atas rekening koresponden asingnya (USA PATRIOT Act §312, lihat FR34), sehingga praktiknya bank asing yang ingin kliring dolar harus memenuhi standar yang diminta bank korespondennya — ditambah risiko sanksi OFAC dan tindakan khusus FinCEN (§311).",
      ],
      tasks: [],
      note: {
        title: "USD 10.000 adalah ambang paling terkenal di AML",
        body: "Ambang CTR USD 10.000 tidak berubah sejak 1970 — tidak disesuaikan inflasi. Bila disesuaikan, ambang itu hari ini setara dengan sekitar USD 80.000. Kekakuan nominal inilah yang membuat structuring tetap menjadi kejahatan yang relevan setengah abad kemudian.",
      },
      reference: "CTR: tunai di atas USD 10.000 (pengecualian 'exempt persons' terbatas; agregasi harian wajib). SAR: ambang USD 5.000 (ada tersangka) / USD 25.000 (tanpa tersangka); 30 hari (+30 bila tanpa tersangka), rahasia, ke FinCEN.",
    },
    {
      id: "amld",
      eyebrow: "Langkah 4 · Teori",
      title: "AMLD Eropa: batas tunai, pemilik manfaat, dan risiko",
      prose: [
        "Anti-Money Laundering Directives (AMLD) Eropa — kini sampai AMLD keenam — bekerja dengan filosofi yang berbeda: pendekatan berbasis risiko. Alih-alih ambang kaku untuk semua, AMLD meminta bank menilai risiko tiap nasabah dan produk, lalu menerapkan due diligence yang proporsional: sederhana untuk risiko rendah, enhanced untuk risiko tinggi. Fleksibilitas ini kuat tetapi menuntut penilaian risiko yang jujur — bank yang menilai semua nasabahnya 'risiko rendah' sedang melanggar semangat direktifnya.",
        "Dua kewajiban Uni Eropa yang tidak ada padanannya yang sama di BSA. Pertama, batas pembayaran tunai: Regulasi AML Uni Eropa — AMLR (EU) 2024/1624, mulai berlaku 10 Juli 2027 — membatasi pembayaran tunai di atas EUR 10.000 — sekitar USD 10.800 — yang berarti transaksi tunai besar tidak hanya dilaporkan, melainkan dilarang di atas batas itu. Perhatikan atribusi yang benar: batas ini berasal dari AMLR, BUKAN dari AMLD keenam; AMLD6 tidak memuat batas tunai. Kedua, register beneficial ownership: perusahaan wajib mengungkapkan siapa pemilik manfaat sebenarnya, dan bank wajib memverifikasinya. Di Amerika, kewajiban serupa baru datang belakangan lewat Corporate Transparency Act — Eropa lebih dulu satu dekade.",
        "Perbedaan praktis terbesar ada di pelaporan kecurigaan. Eropa memakai Suspicious Transaction Report (STR) yang diajukan ke Financial Intelligence Unit (FIU) tiap negara anggota — bukan satu pintu seperti FinCEN, melainkan 27 pintu dengan tenggat dan format yang berbeda-beda. Inilah tantangan bank global di Eropa: satu transaksi yang sama bisa punya tenggat berbeda di Jerman dan di Prancis. Dan di sinilah arbitrase rezim lahir: pencuci uang memilih yurisdiksi dengan tenggat terpanjang dan pengawasan terlemah.",
        "Tabel per tanggal dan yurisdiksi — aturan berubah menurut waktu, jadi selalu cek tanggal berlakunya sebelum mengutip. Batas tunai: AS — tidak ada larangan, hanya pelaporan CTR di atas USD 10.000 (sejak 1970, tidak disesuaikan inflasi); UE — larangan pembayaran tunai di atas EUR 10.000 berdasarkan AMLR (EU) 2024/1624, berlaku 10 Juli 2027 (sebelum tanggal itu, batas tunai hanya ada di hukum nasional masing-masing negara anggota, dengan nilai yang berbeda-beda). Laporan kecurigaan: AS — SAR ke FinCEN, 30 hari (+30 bila tanpa tersangka), ambang USD 5.000/25.000; UE — STR ke FIU nasional, tenggat dan format berbeda per negara anggota. Pemilik manfaat: AS — Corporate Transparency Act, laporan ke FinCEN; UE — register nasional berdasarkan AMLD. Pengawas: AS — FinCEN + regulator perbankan; UE — AMLA (otoritas baru, mulai beroperasi 2025, pengawasan langsung dari 2028) + otoritas nasional. Aturan yang benar hari ini bisa salah tahun depan — catat tanggalnya, bukan hanya isinya.",
      ],
      tasks: [],
      note: {
        title: "AMLD adalah direktif, bukan regulasi",
        body: "Direktif harus ditransposisikan ke hukum nasional tiap negara anggota — sehingga 'AMLD' di Jerman dan 'AMLD' di Prancis tidak identik. Sejak 2024, Eropa bergerak ke regulasi langsung (AMLR) dengan otoritas baru (AMLA) untuk menyeragamkan — tetapi transisi itu masih berjalan saat lesson ini ditulis.",
      },
      reference: "UE: batas tunai EUR 10.000 dari AMLR (EU) 2024/1624 (berlaku 10 Jul 2027), bukan AMLD6; beneficial ownership; STR ke FIU tiap negara; pendekatan berbasis risiko.",
    },
    {
      id: "lab-bsa-amld",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung transaksi wajib lapor di dua rezim",
      prose: [
        "Lab ini menghitung dari 40 transaksi tunai: berapa yang wajib CTR di Amerika (di atas USD 10.000), berapa yang melewati batas tunai Eropa (di atas USD 10.800, setara EUR 10.000), dan selisihnya. Hitung dulu di kepala dengan daftar yang diberikan: 22 transaksi di atas USD 10.000; 15 transaksi di atas USD 10.800; selisihnya 7 transaksi — tujuh transaksi yang wajib dilaporkan di Amerika tetapi tidak melewati batas Eropa.",
        "Tugas lab: isi tiga variabel — ctr_as, batas_eu, selisih — lalu cetak ketiganya. Tiga angka ini adalah baris pertama matriks kepatuhan lintas yurisdiksi: satu dataset, dua jawaban, dan selisih yang harus dijelaskan ke auditor.",
        "Setelah lolos, coba eksperimen: naikkan ambang Eropa menjadi USD 12.000 dan lihat yang melewati batas turun menjadi 10 — selisih naik menjadi 12 (22 − 10). Lalu tanyakan: apakah selisih yang lebih besar berarti Eropa lebih lemah? Jawabannya: tidak serta-merta — Eropa mengandalkan pendekatan berbasis risiko dan batas tunai sebagai larangan, bukan sekadar pelaporan. Ambang yang berbeda bukan berarti rezim yang lemah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung transaksi wajib CTR Amerika (di atas USD 10.000)" },
        { id: "t2", text: "Hitung transaksi melewati batas Eropa (di atas USD 10.800)" },
        { id: "t3", text: "Hitung selisih keduanya" },
      ],
      expected: "ctr_as=22\nbatas_eu=15\nselisih=7",
      hints: [
        "CTR Amerika: hitung transaksi dengan nilai di atas 10.000.",
        "Batas Eropa: hitung transaksi dengan nilai di atas 10.800.",
        "Selisih = CTR Amerika dikurangi batas Eropa.",
      ],
      code: {
        starter: "# 40 transaksi tunai (USD). JANGAN UBAH.\ntransaksi = [8200, 9500, 10100, 12400, 9800, 15300, 7200, 10800, 11000, 8900, 13700, 9900, 10250, 6800, 14900, 11500, 9400, 10150, 7600, 12900, 8700, 10400, 11800, 9100, 14200, 7900, 10600, 9900, 13100, 8400, 9700, 10900, 11200, 9300, 12600, 8100, 10300, 14700, 8800, 12100]\n\n# TULIS KODEMU: CTR Amerika, batas Eropa, selisih\nctr_as = \nbatas_eu = \nselisih = \nprint(f\"ctr_as={ctr_as}\")\nprint(f\"batas_eu={batas_eu}\")\nprint(f\"selisih={selisih}\")",
        lockLines: 3,
        solution: "# 40 transaksi tunai (USD). JANGAN UBAH.\ntransaksi = [8200, 9500, 10100, 12400, 9800, 15300, 7200, 10800, 11000, 8900, 13700, 9900, 10250, 6800, 14900, 11500, 9400, 10150, 7600, 12900, 8700, 10400, 11800, 9100, 14200, 7900, 10600, 9900, 13100, 8400, 9700, 10900, 11200, 9300, 12600, 8100, 10300, 14700, 8800, 12100]\n\n# TULIS KODEMU: CTR Amerika, batas Eropa, selisih\nctr_as = sum(1 for t in transaksi if t > 10000)\nbatas_eu = sum(1 for t in transaksi if t > 10800)\nselisih = ctr_as - batas_eu\nprint(f\"ctr_as={ctr_as}\")\nprint(f\"batas_eu={batas_eu}\")\nprint(f\"selisih={selisih}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "ctr_as=22", label: "CTR Amerika: 22 transaksi", msg: "22 dari 40 transaksi di atas USD 10.000. Ambang kaku — di atas berarti lapor." },
          { kind: "stdout_matches", task: "t2", pattern: "batas_eu=15", label: "Batas Eropa: 15 transaksi", msg: "15 dari 40 transaksi di atas USD 10.800 (setara EUR 10.000)." },
          { kind: "stdout_matches", task: "t3", pattern: "selisih=7", label: "Selisih: 7 transaksi", msg: "22 - 15 = 7. Tujuh transaksi wajib lapor di Amerika tetapi tidak melewati batas Eropa." },
        ],
      },
      reference: "CTR 22; batas Eropa 15; selisih 7 transaksi.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: structuring yang pindah benua",
      prose: [
        "Sebuah jaringan pencucian memecah USD 90.000 menjadi sepuluh transaksi USD 9.000 — masing-masing di bawah ambang CTR — tersebar melintasi beberapa cabang dan hari usaha sehingga agregat harian di bank mana pun tidak pernah melewati USD 10.000. Inilah structuring yang benar-benar menghindari CTR: bukan sembilan setoran USD 10.000 dalam dua hari — agregasi harian BSA justru akan mewajibkan CTR atas total tiap hari (USD 40.000–50.000 per hari) — melainkan pecahan kecil yang dijaga agar agregat hariannya tetap di bawah ambang. Saat pola itu terdeteksi, jaringan itu memindahkan operasinya ke Eropa: sepuluh transaksi EUR 9.500 — di bawah batas tunai EUR 10.000 — di tiga negara berbeda. Di Amerika mereka menghindari pelaporan; di Eropa mereka menghindari larangan. Polanya sama, rezimnya berbeda, celahnya berbeda.",
        "Bank itu menangkapnya bukan dari satu transaksi, melainkan dari agregasi: sepuluh transaksi di bawah ambang dalam satu minggu dari rekening yang sama adalah structuring di Amerika — dan di Eropa, pola yang sama memicu enhanced due diligence berbasis risiko, meskipun tidak satu pun transaksi melewati batas tunai. Pelajaran yang dicatat: ambang adalah garis, tetapi pola adalah bukti. Analis yang hanya memeriksa ambang akan selalu kalah dari penjahat yang bisa berhitung.",
        "Sejak itu, aturan monitoring bank itu tidak lagi memeriksa transaksi tunggal terhadap ambang, melainkan agregat 48 jam per nasabah terhadap ambang — di kedua rezim sekaligus. Tujuh transaksi selisih dari lab menjadi pengingat harian: satu dataset, dua jawaban, dan penjahat yang membaca keduanya lebih teliti daripada banknya.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat respons ini benar. Pertama, agregasi lintas waktu — structuring hanya terlihat bila transaksi dijumlahkan. Kedua, penerapan dua rezim sekaligus — pola yang lolos di satu rezim ditangkap di rezim lain. Ketiga, aturan diubah secara permanen, bukan tambalan untuk satu kasus.",
      },
      reference: "Sepuluh transaksi di bawah ambang dalam seminggu — structuring di Amerika, pemicu EDD di Eropa.",
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
        "BSA: CTR di atas USD 10.000 (pengecualian terbatas; agregasi harian wajib); SAR ambang USD 5.000/25.000, 30 hari (+30), rahasia, ke FinCEN.",
        "Lab: CTR 22; batas Eropa 15; selisih 7 transaksi.",
        "UE: batas tunai EUR 10.000 dari AMLR (EU) 2024/1624 (berlaku 10 Jul 2027); beneficial ownership; STR ke FIU tiap negara.",
        "CTR BSA memakai ambang kaku; program AML kedua rezim tetap berbasis risiko — AMLD menerapkannya lebih luas.",
        "Arbitrase rezim: penjahat memilih yurisdiksi dengan tenggat terpanjang dan pengawasan terlemah.",
      ],
      next: { label: "FR34 — Correspondent Banking: Bank di Balik Bank", href: "/v2/learn/fr34-correspondent-banking" },
      quiz: [
        {
          q: "Dari 40 transaksi tunai: 22 di atas USD 10.000 dan 15 di atas USD 10.800. Berapa selisihnya dan apa artinya?",
          options: [
            { text: "7 transaksi — wajib lapor di Amerika tetapi tidak melewati batas Eropa", why: "Tepat: 22 - 15 = 7. Ambang yang berbeda menghasilkan jawaban yang berbeda atas dataset yang sama.", correct: true },
            { text: "7 transaksi — wajib lapor di Eropa tetapi tidak di Amerika", why: "Salah: terbalik. Ambang Amerika lebih rendah, jadi lebih banyak yang wajib lapor di Amerika." },
            { text: "37 transaksi — jumlah keduanya", why: "Salah: 37 adalah penjumlahan yang tidak berarti; yang dicari adalah selisih." },
            { text: "0 transaksi — kedua rezim memakai ambang yang sama", why: "Salah: USD 10.000 tidak sama dengan EUR 10.000 (sekitar USD 10.800)." },
          ],
        },
        {
          q: "Transaksi tunai USD 10.001 di Amerika. Apa kewajibannya?",
          options: [
            { text: "Tidak ada — di bawah ambang pembulatan", why: "Salah: ambang CTR adalah 'di atas USD 10.000' — USD 10.001 wajib dilaporkan." },
            { text: "CTR wajib dilaporkan ke FinCEN", why: "Tepat: ambang kaku — di atas berarti lapor, tanpa penilaian risiko.", correct: true },
            { text: "Hanya bila bank mencurigainya — CTR memakai pendekatan berbasis risiko", why: "Salah: itu AMLD, bukan BSA. CTR tidak memakai penilaian risiko." },
            { text: "Dilarang — transaksi tunai di atas USD 10.000 tidak boleh dilakukan", why: "Salah: BSA mewajibkan pelaporan, bukan pelarangan. Larangan tunai adalah pendekatan Eropa." },
          ],
        },
        {
          q: "Apa perbedaan paling praktis antara SAR Amerika dan STR Eropa?",
          options: [
            { text: "Tidak ada perbedaan — keduanya sama", why: "Salah: SAR ke satu pintu (FinCEN); STR ke FIU tiap negara anggota dengan tenggat berbeda." },
            { text: "SAR ke satu pintu FinCEN; STR ke 27 FIU nasional dengan tenggat berbeda", why: "Tepat: inilah tantangan bank global di Eropa.", correct: true },
            { text: "SAR bersifat publik; STR bersifat rahasia", why: "Salah: terbalik — SAR bersifat rahasia dan bank dilarang memberi tahu nasabah." },
            { text: "SAR untuk transaksi tunai; STR untuk transfer elektronik", why: "Salah: keduanya untuk aktivitas mencurigakan apa pun, bukan berdasarkan jenis transaksi." },
          ],
        },
        {
          q: "Sebuah bank menilai semua nasabahnya 'risiko rendah' agar tidak perlu EDD. Apa masalahnya?",
          options: [
            { text: "Tidak ada — itu hak bank menilai risikonya sendiri", why: "Salah: pendekatan berbasis risiko menuntut penilaian yang jujur. Semua-rendah adalah pelanggaran semangat AMLD." },
            { text: "Melanggar semangat AMLD — pendekatan berbasis risiko menuntut penilaian jujur dan proporsional", why: "Tepat: fleksibilitas AMLD adalah tanggung jawab, bukan kebebasan.", correct: true },
            { text: "Hanya masalah bila regulator memeriksa", why: "Salah: pelanggaran adalah pelanggaran sejak dilakukan, bukan sejak ketahuan." },
            { text: "Bukan masalah di Amerika — BSA tidak memakai pendekatan berbasis risiko", why: "Salah: BSA memang memakai ambang kaku untuk CTR, tetapi program AML-nya tetap berbasis risiko." },
          ],
        },
        {
          q: "Sepuluh transaksi USD 9.000 dalam satu minggu dari satu rekening, tersebar sehingga agregat harian tidak pernah melewati USD 10.000. Apa yang harus dilakukan analis?",
          options: [
            { text: "Tidak ada — tidak satu pun melewati ambang CTR", why: "Salah: sepuluh transaksi di bawah ambang dalam satu minggu adalah pola structuring klasik — dan agregasi harian memang tidak terpicu di sini, justru karena itulah polanya harus dibaca sebagai structuring." },
            { text: "Agregasikan dan periksa sebagai dugaan structuring", why: "Tepat: ambang adalah garis, pola adalah bukti. Structuring hanya terlihat bila dijumlahkan — dan bila kesepuluhnya terjadi dalam satu hari usaha yang sama, agregasi BSA justru mewajibkan CTR atas totalnya.", correct: true },
            { text: "Laporkan sepuluh CTR", why: "Salah: tidak satu pun agregat harian melewati ambang, jadi tidak ada CTR. Yang ada adalah dugaan structuring untuk SAR (bila di atas ambang SAR)." },
            { text: "Blokir rekeningnya segera", why: "Salah: pemblokiran adalah keputusan manusia berdasarkan investigasi, bukan reaksi otomatis terhadap pola." },
          ],
        },
      ],
    },
  ],
};

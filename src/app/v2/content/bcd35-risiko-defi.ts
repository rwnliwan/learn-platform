import type { V2Lesson } from "../lib/types";

export const bcd35: V2Lesson = {
  slug: "bcd35-risiko-defi",
  track: "Blockchain Data Scientist",
  module: "Investigasi & Risiko",
  title: "BCD35 — Kerangka Risiko DeFi: Menilai Protokol Sebelum Percaya",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga protokol, tiga skor — dan satu yang menipu",
      prose: [
        "Seorang analis diminta menilai tiga protokol pinjaman DeFi sebelum perusahaannya menaruh dana. Protokol A: TVL 800 juta dolar, diaudit dua kali, skor risikonya 2,15 dari 5 — rendah. Protokol B: TVL 2 miliar dolar, tetapi skornya 3,70 — tinggi, melewati ambang 3,5. Protokol C: skor 2,70 — sedang. Manajemen tergoda B karena TVL-nya terbesar. Analis menolak: TVL besar bukan bukti aman — ia hanya bukti banyak orang belum keluar.",
        "Skor itu berasal dari kerangka risiko sistematis: enam keluarga risiko — smart contract, oracle, governance, likuiditas, kustodi, pasar — masing-masing dinilai 1 sampai 5 lalu dibobot. B jatuh karena governance-nya 5 (satu alamat menguasai 60 persen voting) dan smart contract-nya 4 (satu audit, kode upgradeable oleh satu kunci). Tiga bulan kemudian B kehilangan 90 juta dolar lewat proposal governance yang diloloskan flash loan — persis risiko yang dicatat di skornya.",
        "Lesson ini mengajarkan kerangka risiko DeFi sebagai sistem: taksonomi, skoring berbobot, ambang keputusan, dan pemantauan. Setelah lesson ini kamu bisa: (1) menyebutkan enam keluarga risiko DeFi dan contoh tiap keluarga; (2) menghitung skor risiko berbobot sebuah protokol; (3) menjelaskan mengapa TVL bukan ukuran keamanan; (4) memakai ambang skor untuk keputusan invest; (5) menyusun daftar pantau risiko yang berubah tiap minggu.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Risiko DeFi sudah tersebar di track ini: BCD15 (ekonomi serangan oracle, biaya vs hadiah), BCD27 (governance dan flash loan Beanstalk 182 juta dolar), BCD30 (enam kelas exploit + custody + multisig). Tidak ada lesson yang MENYATUKAN semuanya menjadi satu kerangka penilaian — taksonomi, bobot, skor, ambang, dan pemantauan. Lesson ini membangun kerangka itu di atas fondasi yang sudah ada, bukan mengulang isinya.",
      },
      reference: "Skor berbobot (maks 5): A 2,15 rendah; B 3,70 tinggi (ambang 3,5); C 2,70 sedang.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memberi angka pada risiko DeFi — dan mempertahankan angka itu.",
        "(1) Menyebutkan enam keluarga risiko DeFi beserta contoh nyatanya;",
        "(2) Menghitung skor risiko berbobot dari penilaian per keluarga;",
        "(3) Menjelaskan tiga jebakan: TVL, audit, dan APY tinggi;",
        "(4) Memakai ambang skor untuk keputusan: masuk, pantau, atau tolak;",
        "(5) Menyusun pemantauan risiko mingguan dari data on-chain.",
      ],
      tasks: [],
    },
    {
      id: "taksonomi",
      eyebrow: "Langkah 3 · Teori",
      title: "Enam keluarga risiko — dan contohnya",
      prose: [
        "KELUARGA 1 — Smart contract: bug di kode. Reentrancy, aritmetika, kontrol akses (BCD30). Penilaian: berapa audit independen, apakah ada bug bounty berjalan, apakah kode upgradeable dan siapa memegang kunci upgrade. Satu audit bukan jaminan — tiga audit pun bukan, bila ketiganya memeriksa kode yang sama dengan asumsi yang sama.",
        "KELUARGA 2 — Oracle: harga yang salah. Manipulasi spot di DEX dangkal, TWAP yang kalah dari serangan 25 menit (BCD15). Penilaian: berapa sumber harga, apakah ada circuit breaker, berapa biaya menyerang vs nilai yang dilindungi. Aturan BCD15 tetap berlaku: keamanan sama dengan ekonomi — bila biaya serang lebih kecil dari hadiah, serangan hanya soal waktu.",
        "KELUARGA 3 — Governance: kekuasaan yang dipinjam. Flash loan membeli voting mayoritas sesaat (Beanstalk, BCD27). Penilaian: distribusi voting, quorum, timelock, dan apakah voting power bisa dipinjam. Proposal yang bisa lolos dalam satu blok adalah proposal yang tidak pernah di-review manusia.",
        "KELUARGA 4 — Likuiditas dan DEX: pasar yang mengering. Penarikan besar menggerakkan harga, pool dangkal, bank run pada stablecoin. KELUARGA 5 — Kustodi: siapa memegang kunci. Admin key tunggal, multisig 2 dari 3 yang anggotanya satu orang, jembatan yang menyimpan dana di satu dompet (BCD30). KELUARGA 6 — Pasar: risiko yang bukan salah siapa-siapa — harga agunan jatuh 40 persen dalam sehari, likuidasi berantai, dan korelasi yang naik ke 1 saat panik.",
      ],
      tasks: [],
      note: {
        title: "Risiko berinteraksi, bukan berjumlah",
        body: "Enam keluarga ini tidak independen: oracle yang buruk memperbesar risiko likuidasi pasar; governance yang buruk memperbesar risiko smart contract (upgrade jahat); kustodi yang buruk memperbesar semuanya. Skor berbobot di lesson ini adalah penyederhanaan yang jujur — ia mengurutkan risiko, bukan mengukur kebenaran absolut. Protokol dengan skor 2,15 masih bisa runtuh; protokol 3,70 masih bisa bertahan. Skor adalah alat prioritas, bukan ramalan.",
      },
      reference: "Enam keluarga: smart contract, oracle, governance, likuiditas/DEX, kustodi, pasar.",
    },
    {
      id: "skoring",
      eyebrow: "Langkah 4 · Teori",
      title: "Skoring berbobot: dari opini ke angka",
      prose: [
        "Tiap keluarga dinilai 1 sampai 5: 1 berarti terkendali, 5 berarti kritis. Bobot mencerminkan seberapa sering keluarga itu menjadi penyebab kerugian historis: smart contract 0,25; oracle 0,20; governance 0,15; likuiditas 0,15; kustodi 0,15; pasar 0,10. Bobot berjumlah 1,00 — skor akhir berada di skala 1 sampai 5.",
        "Contoh hitungan protokol A: smart contract 2, oracle 3, governance 2, likuiditas 2, kustodi 1, pasar 3. Skor sama dengan 0,25 dikali 2 ditambah 0,20 dikali 3 ditambah 0,15 dikali 2 ditambah 0,15 dikali 2 ditambah 0,15 dikali 1 ditambah 0,10 dikali 3 — sama dengan 0,50 tambah 0,60 tambah 0,30 tambah 0,30 tambah 0,15 tambah 0,30 — sama dengan 2,15. Protokol B: 4, 4, 5, 3, 2, 4 — sama dengan 1,00 tambah 0,80 tambah 0,75 tambah 0,45 tambah 0,30 tambah 0,40 — sama dengan 3,70. Protokol C: 3, 2, 1, 4, 4, 2 — sama dengan 0,75 tambah 0,40 tambah 0,15 tambah 0,60 tambah 0,60 tambah 0,20 — sama dengan 2,70.",
        "Ambang keputusan: di bawah 2,5 berarti rendah — boleh masuk dengan pemantauan rutin. 2,5 sampai 3,5 berarti sedang — masuk hanya dengan batas eksposur dan pemantauan mingguan. Di atas 3,5 berarti tinggi — tolak, atau masuk hanya bila ada mitigasi spesifik yang tertulis. Ambang bukan hukum alam: ia adalah kesepakatan yang ditulis sebelum dana masuk, supaya keputusan tidak berubah karena FOMO.",
        "Tiga jebakan yang tidak ditangkap skor apa pun bila penilainya ceroboh. TVL: dana besar berarti banyak orang percaya — atau banyak orang belum sempat keluar. Audit: stempel 'sudah diaudit' tanpa membaca TEMUAN auditnya sama dengan membeli mobil karena pernah diperiksa — tanpa membaca hasil pemeriksaannya. APY tinggi: imbal hasil 40 persen bukan hadiah — ia adalah harga risiko yang sedang dibayar kepadamu.",
      ],
      tasks: [],
      note: {
        title: "Bobot adalah pendapat yang ditulis",
        body: "Bobot 0,25 untuk smart contract bukan hukum fisika — ia adalah pendapat tim ini tentang sejarah kerugian DeFi, ditulis dan bisa diperdebatkan. Tim lain boleh memakai bobot berbeda. Yang tidak boleh: bobot yang tidak tertulis, atau bobot yang diubah diam-diam setelah skor keluar. Kerangka yang jujur menunjukkan bobotnya di depan.",
      },
      reference: "Bobot: SC 0,25; oracle 0,20; gov 0,15; likuiditas 0,15; kustodi 0,15; pasar 0,10. Ambang: rendah di bawah 2,5; sedang 2,5–3,5; tinggi di atas 3,5.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin skor risiko DeFi",
      prose: [
        "Lab ini membangun mesin skor risiko: dari enam penilaian per protokol, hitung skor berbobot dan vonisnya terhadap ambang 3,5.",
        "Hitung dulu di kepala untuk protokol B. Smart contract 4 dikali 0,25 sama dengan 1,00. Oracle 4 dikali 0,20 sama dengan 0,80. Governance 5 dikali 0,15 sama dengan 0,75. Likuiditas 3 dikali 0,15 sama dengan 0,45. Kustodi 2 dikali 0,15 sama dengan 0,30. Pasar 4 dikali 0,10 sama dengan 0,40. Jumlah: 1,00 tambah 0,80 tambah 0,75 tambah 0,45 tambah 0,30 tambah 0,40 sama dengan 3,70 — melewati ambang 3,5, vonis TINGGI. Protokol A menghasilkan 2,15 (RENDAH) dan C menghasilkan 2,70 (SEDANG).",
        "Tugas lab: tulis fungsi yang menerima enam penilaian (sc, oracle, gov, liq, cust, mkt) — lalu mencetak empat angka: skor_a, skor_b, skor_c, dan ambang_lampaui_b (1 bila B melewati 3,5, 0 bila tidak). Empat angka ini adalah satu baris dashboard risiko yang dibaca komite investasi sebelum menyetujui eksposur.",
        "Setelah lolos, coba eksperimen: turunkan governance B dari 5 menjadi 2 (misalnya timelock 48 jam + quorum dinaikkan) dan lihat skornya menjadi 3,25 — di bawah ambang. Lalu tanyakan: mitigasi mana yang paling murah per poin skor — dan apakah tim B mau melakukannya sebelum kamu masuk?",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor berbobot protokol A (2,15)" },
        { id: "t2", text: "Hitung skor berbobot protokol B (3,70) dan C (2,70)" },
        { id: "t3", text: "Tentukan apakah B melewati ambang tinggi 3,5" },
      ],
      expected: "skor_a=2.15\nskor_b=3.7\nskor_c=2.7\nambang_lampaui_b=1",
      hints: [
        "Skor = 0,25*sc + 0,20*oracle + 0,15*gov + 0,15*liq + 0,15*cust + 0,10*mkt.",
        "Protokol A: (2,3,2,2,1,3). B: (4,4,5,3,2,4). C: (3,2,1,4,4,2).",
        "Bulatkan skor ke 2 desimal agar 2,15 dan 3,70 tampil bersih.",
        "Ambang: 1 bila skor di atas 3,5 — bukan sama dengan.",
      ],
      code: {
        starter: `# Mesin skor risiko DeFi: enam keluarga, bobot tetap, ambang 3,5.\n# Penilaian per protokol: (sc, oracle, gov, liq, cust, mkt), skala 1-5.\nprot_a = (2, 3, 2, 2, 1, 3)\nprot_b = (4, 4, 5, 3, 2, 4)\nprot_c = (3, 2, 1, 4, 4, 2)\nambang = 3.5\n\n# TULIS KODEMU: hitung skor berbobot tiap protokol.\n# Cetak, per baris: skor_a, skor_b, skor_c, ambang_lampaui_b.\n\n\nmesin_skor(prot_a, prot_b, prot_c, ambang)`,
        lockLines: 5,
        solution: `# Mesin skor risiko DeFi: enam keluarga, bobot tetap, ambang 3,5.\n# Penilaian per protokol: (sc, oracle, gov, liq, cust, mkt), skala 1-5.\nprot_a = (2, 3, 2, 2, 1, 3)\nprot_b = (4, 4, 5, 3, 2, 4)\nprot_c = (3, 2, 1, 4, 4, 2)\nambang = 3.5\n\n\ndef skor(p):\n    bobot = (0.25, 0.20, 0.15, 0.15, 0.15, 0.10)\n    return round(sum(b * x for b, x in zip(bobot, p)), 2)\n\n\ndef mesin_skor(prot_a, prot_b, prot_c, ambang):\n    skor_a = skor(prot_a)\n    skor_b = skor(prot_b)\n    skor_c = skor(prot_c)\n    lampaui = 1 if skor_b > ambang else 0\n    print(f"skor_a={skor_a}")\n    print(f"skor_b={skor_b}")\n    print(f"skor_c={skor_c}")\n    print(f"ambang_lampaui_b={lampaui}")\n\n\nmesin_skor(prot_a, prot_b, prot_c, ambang)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "skor_a=2.15", label: "Skor A 2,15", msg: "0,50+0,60+0,30+0,30+0,15+0,30 = 2,15. Rendah — boleh masuk dengan pemantauan rutin." },
          { kind: "stdout_matches", task: "t2", pattern: "skor_b=3.7", label: "Skor B 3,70", msg: "1,00+0,80+0,75+0,45+0,30+0,40 = 3,70. Tinggi — governance 5 dan smart contract 4 yang menjatuhkannya." },
          { kind: "stdout_matches", task: "t2", pattern: "skor_c=2.7", label: "Skor C 2,70", msg: "0,75+0,40+0,15+0,60+0,60+0,20 = 2,70. Sedang — masuk hanya dengan batas eksposur." },
          { kind: "stdout_matches", task: "t3", pattern: "ambang_lampaui_b=1", label: "B melewati ambang", msg: "3,70 di atas 3,5 — vonis TINGGI. TVL 2 miliar tidak mengubah vonis ini." },
        ],
      },
      reference: "Skor: A 2,15 (rendah); B 3,70 (tinggi, lampaui 3,5); C 2,70 (sedang).",
    },
    {
      id: "pemantauan",
      eyebrow: "Langkah 6 · Teori",
      title: "Pemantauan: skor hari ini bukan skor minggu depan",
      prose: [
        "Skor risiko adalah foto; protokol adalah film. Lima sinyal yang dipantau tiap minggu dari data on-chain. Pertama, perubahan governance: proposal baru, perubahan quorum, dan lonjakan voting power di sekitar snapshot — pola Beanstalk. Kedua, perubahan kunci: rotasi admin, upgrade proxy, dan perubahan multisig — siapa pun yang bisa mengganti kode bisa mengganti segalanya.",
        "Ketiga, kesehatan oracle: deviasi harga protokol terhadap CEX, dan frekuensi pembaruan feed — oracle yang berhenti update adalah oracle yang menunggu dimanipulasi. Keempat, likuiditas: kedalaman pool dan konsentrasi penyedia — bila 3 dompet memasok 70 persen likuiditas, penarikan satu dompet adalah peristiwa sistemik. Kelima, perilaku TVL: penurunan TVL 20 persen dalam seminggu bukan sekadar 'pasar turun' — ia bisa berarti orang dalam sudah keluar.",
        "Aturan pemantauan: tiap sinyal punya ambang dan pemilik. Deviasi oracle di atas 5 persen: alert ke analis. Proposal governance tanpa timelock: alert ke komite. Penurunan TVL 20 persen: review eksposur dalam 24 jam. Tanpa ambang dan pemilik, pemantauan adalah dashboard yang tidak pernah dibaca — dan dashboard yang tidak dibaca sama dengan tidak ada pemantauan.",
      ],
      tasks: [],
      note: {
        title: "Skor ulang, bukan skor sekali",
        body: "Kerangka ini diulang tiap kuartal — atau tiap kali ada peristiwa: audit baru, upgrade, proposal besar, atau insiden di protokol sejenis. Protokol A yang hari ini 2,15 bisa menjadi 3,70 besok bila kuncinya dipindah ke satu alamat. Yang dinilai bukan protokolnya saja, melainkan protokolnya HARI INI.",
      },
      reference: "Lima sinyal mingguan: governance, kunci/upgrade, oracle, likuiditas, perilaku TVL. Tiap sinyal punya ambang + pemilik.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: komite menolak protokol B",
      prose: [
        "Kembali ke komite investasi. Manajemen membawa satu argumen: TVL B 2 miliar dolar — 'tidak mungkin 2 miliar dolar salah'. Analis membawa skor: 3,70, dengan governance 5 dan smart contract 4. Ia menunjukkan dua fakta: satu alamat menguasai 60 persen voting, dan kunci upgrade dipegang satu alamat tanpa multisig. 'TVL mengukur kepercayaan masa lalu,' katanya. 'Skor mengukur risiko masa depan.'",
        "Komite memutuskan: tolak B, masuk A dengan batas 5 persen portofolio, pantau C mingguan. Tiga bulan kemudian B kehilangan 90 juta dolar lewat proposal yang diloloskan flash loan — serangan yang sama persis dengan Beanstalk di BCD27. Dana perusahaan selamat bukan karena beruntung, melainkan karena ada kerangka yang ditulis sebelum FOMO datang.",
        "Tiga hal yang membuat keputusan ini benar. Pertama, skor dihitung SEBELUM dana masuk — bukan sebagai pembenaran sesudahnya. Kedua, bobot dan ambang ditulis terbuka, sehingga manajemen bisa memperdebatkan angkanya — bukan menolak 'perasaan' analis. Ketiga, ada alternatif: menolak B bukan berarti menolak DeFi — A dan C tetap jalan dengan batas yang jelas.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Pelajaran umumnya: kerangka risiko bukan alat untuk menolak segalanya — ia alat untuk menolak dengan alasan yang bisa diaudit dan menerima dengan batas yang jelas. Komite yang punya kerangka tidak berdebat soal 'apakah ini berisiko' — ia berdebat soal angka, bobot, dan ambang. Itulah perdebatan yang produktif.",
      },
      reference: "Komite: tolak B (3,70), masuk A batas 5 persen, pantau C mingguan. B runtuh 3 bulan kemudian: 90 juta dolar via flash loan governance.",
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
        "Enam keluarga: smart contract, oracle, governance, likuiditas/DEX, kustodi, pasar.",
        "Bobot: SC 0,25; oracle 0,20; gov 0,15; likuiditas 0,15; kustodi 0,15; pasar 0,10.",
        "Lab: A 2,15 rendah; B 3,70 tinggi (lampaui 3,5); C 2,70 sedang.",
        "TVL, audit, dan APY tinggi bukan bukti aman.",
        "Lima sinyal mingguan: governance, kunci/upgrade, oracle, likuiditas, perilaku TVL.",
      ],
      next: { label: "BCD36 — Tokenisasi RWA: Membawa Aset Nyata ke Rantai", href: "/v2/learn/bcd36-tokenisasi-rwa" },
      quiz: [
        {
          q: "Protokol B dinilai (4,4,5,3,2,4) untuk (SC, oracle, gov, likuiditas, kustodi, pasar) dengan bobot (0,25; 0,20; 0,15; 0,15; 0,15; 0,10). Berapa skornya dan apa vonisnya?",
          options: [
            { text: "3,70 — tinggi, melewati ambang 3,5", why: "Tepat: 1,00+0,80+0,75+0,45+0,30+0,40 = 3,70. Governance 5 adalah penyumbang terbesar.", correct: true },
            { text: "3,50 — tepat di ambang, masih sedang", why: "Salah: hitung ulang — 0,25x4=1,00 dan 0,15x5=0,75; totalnya 3,70, bukan 3,50." },
            { text: "2,70 — sedang", why: "Salah: 2,70 adalah skor protokol C, bukan B. Jangan tertukar barisnya." },
            { text: "4,00 — rata-rata sederhana penilaiannya", why: "Salah: rata-rata sederhana (4+4+5+3+2+4)/6 = 3,67, bukan 4,00 — dan kerangka ini memakai bobot, bukan rata-rata." },
          ],
        },
        {
          q: "Mengapa TVL 2 miliar dolar bukan bukti sebuah protokol aman?",
          options: [
            { text: "Karena TVL dihitung dari harga token yang fluktuatif", why: "Sebagian benar tetapi bukan intinya: TVL memang fluktuatif, tetapi masalah utamanya adalah TVL mengukur kepercayaan masa lalu, bukan risiko masa depan." },
            { text: "Karena TVL mengukur berapa banyak dana yang percaya sejauh ini — bukan seberapa besar risiko yang menunggu; dana besar juga bisa keluar bersamaan", why: "Tepat: TVL adalah ukuran adopsi, bukan ukuran keamanan. Banyak orang belum keluar bukan berarti tidak ada yang salah.", correct: true },
            { text: "Karena TVL selalu dimanipulasi protokol", why: "Salah: 'selalu dimanipulasi' terlalu kuat — TVL bisa jujur dan tetap bukan ukuran keamanan." },
            { text: "Karena TVL tidak termasuk dana di jembatan", why: "Salah: itu soal cakupan definisi TVL, bukan soal apakah TVL mengukur keamanan." },
          ],
        },
        {
          q: "Serangan Beanstalk (BCD27) termasuk keluarga risiko apa, dan apa mitigasi strukturnya?",
          options: [
            { text: "Oracle — mitigasinya Chainlink feed", why: "Salah: Beanstalk bukan serangan harga. Ia serangan governance lewat flash loan." },
            { text: "Governance — mitigasinya timelock, quorum yang sehat, dan snapshot yang tidak bisa dipinjam sesaat", why: "Tepat: penyerang meminjam voting mayoritas sesaat; timelock memberi waktu review dan snapshot yang tahan pinjaman menutup celahnya.", correct: true },
            { text: "Kustodi — mitigasinya multisig", why: "Salah: kustodi soal kunci admin; Beanstalk soal voting yang dipinjam." },
            { text: "Pasar — tidak ada mitigasi, hanya diversifikasi", why: "Salah: ini bukan risiko pasar (harga jatuh), melainkan risiko tata kelola yang bisa dimitigasi strukturnya." },
          ],
        },
        {
          q: "Oracle protokol menyimpang 6 persen dari harga CEX selama 30 menit. Apa tindakan yang benar menurut kerangka pemantauan?",
          options: [
            { text: "Abaikan — 6 persen masih dalam noise pasar", why: "Salah: ambang alert adalah 5 persen. 6 persen berarti alert ke analis — bukan diabaikan." },
            { text: "Alert ke analis dan periksa feed: frekuensi update, sumber harga, dan apakah ada flash loan di blok yang sama", why: "Tepat: deviasi di atas ambang memicu pemeriksaan — sidik jari serangan oracle dari BCD15.", correct: true },
            { text: "Langsung tarik semua dana tanpa memeriksa", why: "Salah: penarikan panik tanpa diagnosis bisa lebih mahal dari risikonya — periksa dulu, lalu putuskan dengan data." },
            { text: "Naikkan ambang menjadi 10 persen agar tidak berisik", why: "Salah: mengubah ambang untuk membungkam alert adalah manipulasi — ambang diubah hanya dengan data baru dan alasan tercatat." },
          ],
        },
        {
          q: "Tim B menawarkan menurunkan governance dari 5 ke 2 dengan timelock 48 jam. Apa dampaknya pada skor B dan keputusanmu?",
          options: [
            { text: "Skor tetap 3,70 — governance tidak memengaruhi skor", why: "Salah: governance berbobot 0,15; turun 3 poin berarti skor turun 0,45 menjadi 3,25." },
            { text: "Skor menjadi 3,25 — di bawah ambang 3,5 — tetapi keputusan tetap butuh verifikasi bahwa timelock benar-benar diterapkan, bukan dijanjikan", why: "Tepat: 3,70 - 0,45 = 3,25. Janji mitigasi bukan mitigasi — verifikasi on-chain dulu.", correct: true },
            { text: "Skor menjadi 2,15 — sama dengan A", why: "Salah: hanya satu keluarga yang berubah; 3,70 - 0,45 = 3,25, bukan 2,15." },
            { text: "Skor menjadi 0 — risiko governance hilang total", why: "Salah: skor 2 masih berarti risiko tersisa. Tidak ada keluarga risiko yang bisa nol selama protokol masih berjalan." },
          ],
        },
      ],
    },
  ],
};

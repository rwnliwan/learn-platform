import type { V2Lesson } from "../lib/types";

export const mr36: V2Lesson = {
  slug: "mr36-repo-risk",
  track: "Market Risk",
  module: "Risiko Likuiditas",
  title: "MR36 — Risiko Repo: Haircut, Rehypothecation, dan Repo Run",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Bank yang 'solven' tetapi tidak bisa meminjam Rp1 pun besok pagi",
      prose: [
        "September 2008. Bank investasi memegang SBN dan obligasi korporat Rp500 miliar — aset berkualitas, portofolio 'aman'. Setiap pagi ia mendanai aset itu lewat repo semalam: menggadaikan obligasi, meminjam Rp490 miliar (haircut 2 persen), membayar kembali besok pagi, dan mengulanginya. Selama bertahun-tahun, mesin itu bekerja. Lalu satu pagi, pemberi pinjaman menaikkan haircut menjadi 10 persen: dari Rp500 miliar collateral, bank itu kini hanya bisa meminjam Rp450 miliar — kekurangan Rp40 miliar dalam semalam. Tidak ada yang membeli obligasinya dengan harga wajar saat itu. Bank itu solven di atas kertas — dan bangkrut karena likuiditas dalam 48 jam.",
        "Inilah risiko repo: pendanaan jangka pendek untuk aset jangka panjang, dengan haircut sebagai katupnya. Saat pasar tenang, haircut kecil dan pendanaan melimpah. Saat stres, haircut naik, pendanaan menyusut, dan bank dipaksa menjual aset ke pasar yang sedang jatuh — yang menaikkan haircut lebih jauh. Spiral ini — haircut naik, jual paksa, harga jatuh, haircut naik lagi — disebut margin spiral, dan ia membunuh Lehman serta Bear Stearns.",
        "Lesson ini mengambil sudut market risk yang belum ada: E14 sudah mengajarkan repo sebagai mekanisme pasar uang (bunga repo Rp100 miliar 7 hari 5,5 persen = Rp106,94 juta, konvensi 360 hari) — tetapi tidak pernah membahas RISIKO-nya. Setelah lesson ini kamu bisa: (1) menghitung pendanaan maksimum repo dari haircut; (2) menghitung funding gap saat haircut naik; (3) menjelaskan margin spiral dan repo run; (4) menjelaskan rehypothecation dan risiko tri-party; (5) merancang pengaman likuiditas repo (staggered maturity, HQLA buffer).",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "E14 (Pasar Uang, Repo dan Sekuritisasi) mengajarkan repo sebagai mekanisme: jual SBN hari ini plus janji beli kembali, bunga repo Rp100 miliar 7 hari 5,5 persen = Rp106,94 juta, konvensi tahun 360 hari, plus lab. Tidak ada pembahasan risiko: tidak ada haircut, tidak ada margin spiral, tidak ada repo run, tidak ada rehypothecation. Lesson ini membangun sudut risiko Market Risk itu dari nol.",
      },
      reference: "Collateral Rp500 miliar: haircut 2 persen → pinjam Rp490 miliar; 5 persen → Rp475 miliar; 10 persen → Rp450 miliar. Kenaikan haircut 2 ke 10 persen membuka gap Rp40 miliar.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa melihat repo bukan sebagai mesin pendanaan yang murah — melainkan sebagai utang semalam yang bisa ditarik kapan saja.",
        "(1) Menghitung pendanaan maksimum repo dari haircut;",
        "(2) Menghitung funding gap saat haircut naik;",
        "(3) Menjelaskan margin spiral dan repo run;",
        "(4) Menjelaskan rehypothecation dan risiko tri-party repo;",
        "(5) Merancang pengaman likuiditas repo.",
      ],
      tasks: [],
    },
    {
      id: "haircut",
      eyebrow: "Langkah 3 · Teori",
      title: "Haircut: katup pendanaan repo",
      prose: [
        "Repo (repurchase agreement) adalah pinjaman beragunan semalam: peminjam 'menjual' obligasi ke pemberi pinjaman hari ini dan berjanji membelinya kembali besok dengan harga sedikit lebih tinggi — selisihnya adalah bunga repo (E14). Haircut adalah selisih antara nilai collateral dan jumlah yang dipinjamkan: haircut 2 persen berarti dari collateral Rp500 miliar, pemberi pinjaman hanya meminjamkan Rp490 miliar. Haircut adalah bantalan pemberi pinjaman: bila peminjam gagal dan collateral harus dijual, harga collateral bisa turun 2 persen tanpa merugikan pemberi pinjaman.",
        "Haircut ditentukan oleh tiga hal: kualitas collateral (SBN 2 persen, obligasi korporat 5–10 persen, CDO 20–50 persen sebelum 2008 — lalu tidak diterima sama sekali), volatilitas harga collateral (semakin bergejolak, semakin besar haircut), dan kepercayaan pada peminjam (bank yang diragukan membayar haircut lebih besar). Haircut bukan harga pasar — ia kebijakan risiko pemberi pinjaman, dan ia bisa berubah dalam semalam tanpa peringatan.",
        "Hitung funding gap dari cerita pembuka. Collateral Rp500 miliar. Haircut 2 persen → pinjam 500 × 0,98 = Rp490 miliar. Haircut naik ke 5 persen → pinjam 500 × 0,95 = Rp475 miliar — gap Rp15 miliar dari posisi awal. Haircut naik ke 10 persen → pinjam 500 × 0,90 = Rp450 miliar — gap Rp40 miliar. Bank itu harus menemukan Rp40 miliar dalam semalam — menjual aset (ke pasar yang jatuh), meminjam tanpa agunan (tidak ada yang mau), atau gagal bayar. Inilah aritmatika repo run: gap-nya kecil dibanding neraca, tetapi harus dipenuhi dalam hitungan jam.",
        "Aturan praktis: ukur pendanaan repo-mu pada haircut STRES, bukan haircut hari ini. Bila haircut SBN-mu 2 persen hari ini, tanyakan: berapa bila naik ke 10 persen? Bila jawabannya 'kami bangkrut', maka pendanaanmu rapuh — tidak peduli seberapa 'aman' collateral-mu. LCR Basel III (MR13) mewajibkan bank memegang HQLA untuk 30 hari arus keluar — sebagian untuk menutup gap seperti ini.",
      ],
      tasks: [],
      formula: String.raw`\text{Pinjam maks} = C \times (1 - h) \qquad \text{Gap} = C \times (h_{stres} - h_{awal})`,
      formulaNote: "C = nilai collateral (500); h = haircut. Haircut 2 persen → pinjam 490; 5 persen → 475 (gap 15); 10 persen → 450 (gap 40). Gap = collateral dikali kenaikan haircut.",
      reference: "Haircut 2 persen → Rp490 miliar; 5 persen → Rp475 miliar; 10 persen → Rp450 miliar; gap Rp40 miliar.",
    },
    {
      id: "spiral-run",
      eyebrow: "Langkah 4 · Teori",
      title: "Margin spiral dan repo run: kematian dalam 48 jam",
      prose: [
        "Margin spiral (Brunnermeier dan Pedersen, 2009) adalah lingkaran setan repo: harga aset jatuh → pemberi pinjaman menaikkan haircut (margin) → peminjam harus menjual aset untuk memenuhi margin → penjualan menekan harga lebih jauh → haircut naik lagi. Tiap putaran spiral mengecilkan neraca dan membesarkan ketakutan. Di 2008, spiral ini bekerja dalam hitungan hari: harga CDO jatuh, haircut CDO naik dari 5 persen ke 100 persen (tidak diterima sama sekali), bank yang mendanai CDO lewat repo kehilangan seluruh pendanaannya dalam semalam.",
        "Repo run adalah bank run versi pasar modal. Bank run klasik: deposan mengantre di depan cabang. Repo run: pemberi pinjaman repo menarik pendanaannya secara bersamaan — tidak memperpanjang repo semalam, menaikkan haircut, menolak collateral. Bear Stearns Maret 2008: dalam satu minggu, pemberi pinjaman repo menarik Rp400 triliun lebih pendanaan — bank dengan aset Rp400 miliar dolar itu tidak bisa mendanai dirinya sendiri dan diselamatkan lewat akuisisi darurat oleh JPMorgan. Lehman September 2008: pola yang sama, tanpa penyelamatan.",
        "Tri-party repo menambah satu titik kegagalan: dua bank kliring (JPMorgan dan BNY Mellon) menjadi perantara antara peminjam dan pemberi pinjaman — mereka mengurus collateral dan penyelesaian. Bila satu bank kliring goyah, seluruh pasar tri-party (triliunan dolar) membeku — bukan karena peminjamnya gagal, melainkan karena perantaranya goyah. Reformasi pasca-2008 mengurangi ketergantungan intraday ini, tetapi konsentrasi tetap ada: dua bank masih menguasai sebagian besar kliring tri-party.",
        "Rehypothecation adalah risiko yang tidak terlihat di laporan repo: pemberi pinjaman boleh memakai collateral yang diterimanya untuk keperluannya sendiri — meminjamkannya lagi, menggadaikannya lagi. Rantai ini berarti satu obligasi bisa menjadi collateral untuk beberapa pinjaman sekaligus. Bila satu mata rantai gagal (Lehman), semua yang memegang collateral itu sebagai agunan menemukan agunannya tersangkut dalam kebangkrutan. MR34 membahas rehypothecation dari sisi hedge fund; mekanismenya sama di repo — dan risikonya sama: collateral yang kamu kira milikmu ternyata sudah dipakai orang lain.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira bank yang solven tidak bisa bangkrut karena likuiditas. Bear Stearns dan Lehman solven di atas kertas saat repo run menghantam mereka. Solvabilitas adalah tentang nilai aset; likuiditas adalah tentang WAKTU — dan repo run tidak memberimu waktu.",
      },
      reference: "Margin spiral: harga jatuh → haircut naik → jual paksa → harga jatuh lagi. Bear Stearns: pendanaan repo ditarik dalam satu minggu.",
    },
    {
      id: "lab-repo",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin funding gap repo",
      prose: [
        "Lab ini membangun mesin funding gap repo: dari nilai collateral dan tiga skenario haircut — hitung pendanaan maksimum tiap skenario dan gap terhadap posisi awal.",
        "Hitung dulu di kepala. Haircut 2 persen: 500 × 0,98 = Rp490 miliar. Haircut 5 persen: 500 × 0,95 = Rp475 miliar — gap 490 − 475 = Rp15 miliar. Haircut 10 persen: 500 × 0,90 = Rp450 miliar — gap 490 − 450 = Rp40 miliar.",
        "Tugas lab: tulis fungsi yang menerima nilai collateral dan tiga haircut — lalu mencetak pendanaan pada haircut awal, gap pada haircut 5 persen, dan gap pada haircut 10 persen. Tiga angka ini adalah ukuran kerapuhan pendanaanmu dalam satu baris.",
        "Setelah lolos, coba eksperimen: naikkan collateral menjadi Rp1.000 miliar dan lihat gap 10 persen menjadi Rp80 miliar — lalu tanyakan: berapa HQLA yang harus kamu pegang untuk menutup gap itu selama 30 hari (LCR)?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pinjam_awal` (collateral dikali 1 dikurangi haircut awal)" },
        { id: "t2", text: "Hitung `gap5` (pinjam awal dikurangi pinjam pada haircut 5 persen)" },
        { id: "t3", text: "Hitung `gap10` (pinjam awal dikurangi pinjam pada haircut 10 persen)" },
      ],
      expected: "pinjam_awal=490.0\ngap5=15.0\ngap10=40.0",
      hints: [
        "Pinjam = collateral x (1 - haircut).",
        "Gap = pinjam awal - pinjam pada haircut stres.",
        "Haircut sebagai desimal: 2% = 0,02.",
      ],
      code: {
        starter: `# Bank: collateral Rp500 M, haircut awal 2%, stres 5% dan 10%.\ncollateral = 500.0\nh_awal = 0.02\nh5 = 0.05\nh10 = 0.10\n\n# TULIS KODEMU: hitung pinjam_awal, gap5, gap10.\n# Cetak, per baris: pinjam_awal, gap5, gap10.\n\n`,
        lockLines: 5,
        solution: `# Bank: collateral Rp500 M, haircut awal 2%, stres 5% dan 10%.\ncollateral = 500.0\nh_awal = 0.02\nh5 = 0.05\nh10 = 0.10\n\n\npinjam_awal = collateral * (1 - h_awal)\ngap5 = pinjam_awal - collateral * (1 - h5)\ngap10 = pinjam_awal - collateral * (1 - h10)\nprint(f"pinjam_awal={pinjam_awal:.1f}")\nprint(f"gap5={gap5:.1f}")\nprint(f"gap10={gap10:.1f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "pinjam_awal", value: 490.0, tol: 0.01, label: "Pinjam awal Rp490 miliar", msg: "500 x 0,98 = 490. Itulah pendanaan semalam bank ini." },
          { kind: "equal", task: "t2", name: "gap5", value: 15.0, tol: 0.01, label: "Gap 5 persen Rp15 miliar", msg: "490 - 475 = 15. Masih bisa ditutup dari kas — tetapi peringatan pertama." },
          { kind: "equal", task: "t3", name: "gap10", value: 40.0, tol: 0.01, label: "Gap 10 persen Rp40 miliar", msg: "490 - 450 = 40. Harus ditemukan dalam semalam — atau bank gagal bayar." },
        ],
      },
      reference: "Pinjam awal Rp490 miliar; gap 5 persen Rp15 miliar; gap 10 persen Rp40 miliar.",
    },
    {
      id: "pengaman",
      eyebrow: "Langkah 6 · Teori",
      title: "Pengaman: staggered maturity, HQLA, dan limit",
      prose: [
        "Pengaman pertama: staggered maturity — jangan danai seluruh aset dengan repo semalam. Sebarkan jatuh tempo repo: sebagian semalam, sebagian 1 minggu, sebagian 1 bulan, sebagian 3 bulan. Bila pasar membeku satu pagi, hanya sebagian kecil pendanaan yang perlu diperpanjang hari itu. Bank yang mendanai 100 persen asetnya dengan repo semalam sedang bertaruh seluruh hidupnya setiap pagi.",
        "Pengaman kedua: buffer HQLA (high-quality liquid assets) — SBN dan kas yang bisa dijual atau di-repo-kan bahkan saat stres, untuk menutup funding gap selama 30 hari (LCR). Ukuran buffer yang benar: cukup untuk menutup gap pada haircut stres (Rp40 miliar di contoh kita) PLUS arus keluar lain selama 30 hari. Bank yang menghitung buffer dari haircut hari ini sedang menghitung payung dari cuaca cerah.",
        "Pengaman ketiga: limit konsentrasi pemberi pinjaman dan collateral. Jangan bergantung pada satu pemberi pinjaman repo untuk lebih dari 20 persen pendanaan — bila ia menarik diri, gap-nya mematikan. Jangan memusatkan collateral pada satu jenis aset — bila aset itu ditolak pasar, seluruh pendanaanmu ikut ditolak. Dan yang terpenting: uji repo run dalam stress test (MR7) — simulasikan haircut naik 10 poin dan pemberi pinjaman terbesar menarik diri, lalu lihat apakah bank bertahan 30 hari. Bila tidak, kurangi ketergantungan repo hari ini — bukan saat krisis datang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengukur risiko repo dari bunga repo-nya. Bunga repo 5,5 persen terlihat murah — tetapi harga repo bukan bunganya, melainkan haircut dan ketersediaannya. Repo yang murah hari ini dan tidak tersedia besok adalah repo yang paling mahal.",
      },
      reference: "Pengaman: staggered maturity, buffer HQLA 30 hari (LCR), limit konsentrasi pemberi pinjaman dan collateral.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: bendahara yang melihat spiral datang",
      prose: [
        "Juni 2008, bendahara sebuah bank investasi melihat tiga sinyal: haircut obligasi korporatnya naik dari 5 persen ke 8 persen dalam sebulan; satu pemberi pinjaman repo besar mulai mempersingkat tenor (dari 1 bulan ke semalam); dan harga CDO di portofolionya turun 3 persen. Ia tidak menunggu — ia menjual CDO dengan diskon 5 persen (rugi Rp10 miliar), memperpanjang tenor repo yang tersisa ke 3 bulan, dan menumpuk HQLA Rp50 miliar. Direksi marah: 'Kenapa menjual dengan rugi saat kita solven?'",
        "Tiga bulan kemudian, September 2008: haircut CDO menjadi 100 persen (tidak diterima), pemberi pinjaman itu menarik seluruh pendanaannya, dan bank-bank yang tidak bersiap runtuh. Bank bendahara itu bertahan — dengan kerugian Rp10 miliar yang terlihat bodoh di Juni dan terlihat jenius di September. Bendahara itu tidak memprediksi krisis — ia hanya membaca haircut sebagai termometer dan bertindak saat termometer naik, bukan saat pasiennya sudah demam tinggi.",
        "Keputusan yang benar bukan 'jual semua' atau 'tahan semua' — melainkan kurangi ketergantungan repo SEBELUM pasar memaksamu. Likuiditas dibeli saat murah; saat mahal, ia tidak tersedia dengan harga berapa pun.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, haircut dibaca sebagai sinyal dini — bukan sebagai biaya administratif. Kedua, tindakan diambil saat masih bisa memilih (menjual dengan diskon 5 persen), bukan saat dipaksa (menjual dengan diskon 50 persen). Ketiga, kerugian Rp10 miliar diterima sebagai premi asuransi — bukan sebagai kesalahan.",
      },
      reference: "Jual CDO dengan diskon 5 persen (rugi Rp10 miliar) di Juni; bertahan saat haircut CDO 100 persen di September.",
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
        "Pinjam awal Rp490 miliar; gap 5 persen Rp15 miliar; gap 10 persen Rp40 miliar.",
        "Haircut adalah bantalan pemberi pinjaman — bisa berubah dalam semalam.",
        "Margin spiral: harga jatuh → haircut naik → jual paksa → harga jatuh lagi.",
        "Repo run adalah bank run versi pasar modal — pendanaan ditarik bersamaan.",
        "Pengaman: staggered maturity, buffer HQLA 30 hari, limit konsentrasi.",
      ],
      next: { label: "MR37 — Extreme Value Theory untuk VaR dan ES: Mengukur Ekor", href: "/v2/learn/mr37-evt-var-es" },
      quiz: [
        {
          q: "Collateral Rp500 miliar, haircut awal 2 persen. Haircut naik ke 5 persen lalu 10 persen. Berapa pinjam awal dan gap-nya?",
          options: [
            { text: "Pinjam Rp490 miliar; gap 5 persen Rp15 miliar; gap 10 persen Rp40 miliar", why: "Tepat: 500 × 0,98 = 490; 490 − 475 = 15; 490 − 450 = 40.", correct: true },
            { text: "Pinjam Rp500 miliar; gap 5 persen Rp25 miliar; gap 10 persen Rp50 miliar", why: "Salah: pinjam awal bukan 500 — haircut 2 persen berarti hanya 490 yang dipinjamkan. Gap dihitung dari 490, bukan dari 500." },
            { text: "Pinjam Rp490 miliar; gap 5 persen Rp25 miliar; gap 10 persen Rp50 miliar", why: "Salah: gap 5 persen = 490 − 475 = 15, bukan 25. 25 adalah 5 persen dari 500 — rumus gap yang salah." },
            { text: "Pinjam Rp450 miliar; gap 5 persen Rp0; gap 10 persen Rp0", why: "Salah: 450 adalah pinjam pada haircut 10 persen — bukan pinjam awal. Gap diukur dari posisi awal 490." },
          ],
        },
        {
          q: "Apa itu margin spiral?",
          options: [
            { text: "Harga aset naik → haircut turun → bank meminjam lebih banyak", why: "Salah: itu spiral ke atas (leverage cycle saat booming). Margin spiral yang mematikan adalah arah sebaliknya." },
            { text: "Harga jatuh → haircut naik → jual paksa → harga jatuh lagi — lingkaran setan yang mengecilkan neraca", why: "Tepat: tiap putaran menaikkan haircut dan memaksa penjualan, yang menekan harga lebih jauh.", correct: true },
            { text: "Bank sentral menaikkan suku bunga berulang kali", why: "Salah: itu siklus pengetatan moneter — berbeda dari margin spiral yang digerakkan haircut dan harga collateral." },
            { text: "Repo diperpanjang otomatis setiap pagi tanpa negosiasi", why: "Salah: itu rollover repo normal. Spiral adalah dinamika harga-haircut-penjualan, bukan mekanisme perpanjangan." },
          ],
        },
        {
          q: "Bear Stearns 2008: pemberi pinjaman repo menarik pendanaannya dalam satu minggu. Apa pelajaran utamanya?",
          options: [
            { text: "Bank yang solven tidak bisa bangkrut", why: "Salah: Bear Stearns solven di atas kertas — dan bangkrut karena likuiditas. Solvabilitas bukan perlindungan dari repo run." },
            { text: "Likuiditas bisa membunuh lebih cepat dari kerugian — bank solven bisa bangkrut dalam 48 jam bila pendanaan repo ditarik", why: "Tepat: repo run tidak memberi waktu. Itulah alasan LCR dan staggered maturity.", correct: true },
            { text: "Repo adalah pendanaan yang aman karena beragunan", why: "Salah: agunan tidak membantu bila pemberi pinjaman menaikkan haircut atau menolak collateral itu sama sekali." },
            { text: "Bank seharusnya tidak memakai repo sama sekali", why: "Salah: repo adalah pendanaan normal dan berguna. Yang berbahaya adalah ketergantungan 100 persen pada repo semalam tanpa buffer." },
          ],
        },
        {
          q: "Apa risiko rehypothecation dalam repo?",
          options: [
            { text: "Pemberi pinjaman memakai collateral yang diterimanya untuk keperluannya sendiri — bila ia gagal, collateral tersangkut", why: "Tepat: satu obligasi bisa menjadi collateral beberapa pinjaman sekaligus. Kegagalan satu mata rantai menyangkut semuanya.", correct: true },
            { text: "Peminjam menjual collateral sebelum repo jatuh tempo", why: "Salah: peminjam sudah 'menjual' collateral sebagai bagian repo — itu mekanismenya, bukan risikonya. Risikonya adalah pemakaian ULANG oleh pemberi pinjaman." },
            { text: "Bank sentral menolak collateral SBN", why: "Salah: SBN adalah collateral terbaik (haircut terkecil). Rehypothecation menyangkut pemakaian ulang collateral, bukan penolakan bank sentral." },
            { text: "Haircut naik secara otomatis setiap hari", why: "Salah: haircut tidak naik otomatis — ia kebijakan pemberi pinjaman yang berubah saat stres." },
          ],
        },
        {
          q: "Bank mendanai 100 persen asetnya dengan repo semalam. Apa pengaman pertama yang harus diterapkan?",
          options: [
            { text: "Menaikkan bunga repo agar pemberi pinjaman senang", why: "Salah: bunga bukan masalahnya — ketersediaan dan haircut adalah masalahnya. Bunga lebih tinggi tidak mencegah repo run." },
            { text: "Staggered maturity — sebarkan jatuh tempo repo ke 1 minggu, 1 bulan, 3 bulan — agar tidak seluruh pendanaan jatuh tempo besok pagi", why: "Tepat: bila pasar membeku satu pagi, hanya sebagian kecil pendanaan yang perlu diperpanjang hari itu.", correct: true },
            { text: "Membeli lebih banyak aset untuk dijadikan collateral", why: "Salah: menambah aset menambah kebutuhan pendanaan — memperbesar masalah, bukan mengecilkannya." },
            { text: "Mengurangi haircut yang dibayar dengan negosiasi", why: "Salah: haircut ditentukan pemberi pinjaman berdasarkan risiko — negosiasi tidak mengubah risiko collateral-mu." },
          ],
        },
      ],
    },
  ],
};

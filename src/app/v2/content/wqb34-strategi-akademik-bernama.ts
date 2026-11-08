import type { V2Lesson } from "../lib/types";

export const wqb34: V2Lesson = {
  slug: "wqb34-strategi-akademik-bernama",
  track: "WorldQuant Brain",
  module: "Strategi & Riset",
  title: "WQB34 — Strategi Akademik Bernama: Piotroski, PEAD, Accruals, BAB, Momentum Crash",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Lima nama, lima ide, satu pertanyaan: mana yang masih hidup?",
      prose: [
        "Seorang peneliti alpha membaca lima paper klasik dan menemukan lima ide yang masing-masing pernah menghasilkan premia: Piotroski F-score (saham value yang sehat secara fundamental), PEAD (drift setelah pengumuman laba), accruals (laba tanpa kas adalah laba yang lemah), betting against beta (saham beta rendah mengalahkan beta tinggi), dan momentum crash (momentum yang runtuh saat pasar berbalik). Pertanyaannya bukan 'mana yang benar di paper' — semuanya benar di paper — melainkan 'mana yang masih hidup setelah semua orang membacanya, dan bagaimana ia diterjemahkan ke FASTEXPR?'",
        "Lesson ini mengajarkan kelima strategi bernama itu dari sudut peneliti WorldQuant Brain: logika ekonominya, rumus intinya, bukti empirisnya — dan yang paling penting, kapan masing-masing mati: crowding, perubahan struktur pasar, dan implementasi yang ceroboh. Strategi akademik bukan resep; ia adalah titik awal riset yang harus diuji ulang di datamu sendiri.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Tidak satu pun dari lima nama ini muncul di track WQB (pencarian Piotroski, PEAD, accruals, dan betting against beta menghasilkan nol; momentum crash hanya disinggung di PM-D7 dan PM-B8 dari sudut manajemen portofolio, bukan sebagai alpha). Lesson ini membangun kelimanya dari sudut riset alpha dan FASTEXPR.",
      },
      reference: "F-score A=8, B=4, C=6. PEAD: drift +3,1 persen abnormal. Accruals: 3,5 persen. BAB: beta 0,6 vs 1,5.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan, menghitung, dan menguji lima strategi akademik bernama.",
        "(1) Menghitung Piotroski F-score dari sembilan sinyal biner;",
        "(2) Menjelaskan PEAD dan mengukur drift abnormal pasca-pengumuman;",
        "(3) Menghitung rasio accruals dan membaca sinyalnya;",
        "(4) Menjelaskan betting against beta dan kenapa beta rendah menang;",
        "(5) Menjelaskan momentum crash dan cara melindungi alpha darinya.",
      ],
      tasks: [],
    },
    {
      id: "piotroski-pead",
      eyebrow: "Langkah 3 · Teori",
      title: "Piotroski dan PEAD: kesehatan dan kejutan",
      prose: [
        "Piotroski F-score (2000) menilai kesehatan fundamental saham value dengan sembilan sinyal biner — masing-masing 1 bila baik, 0 bila tidak. Profitabilitas: laba bersih positif, arus kas operasi positif, ROA naik, arus kas operasi lebih besar dari laba bersih. Leverage dan likuiditas: utang jangka panjang turun, current ratio naik, tidak ada penerbitan saham baru. Efisiensi operasi: margin kotor naik, perputaran aset naik. Skor 0 sampai 9; saham value dengan skor 8 sampai 9 mengalahkan saham value dengan skor 0 sampai 1 secara konsisten dalam penelitian aslinya. Dalam FASTEXPR, kesembilan sinyal ini ditulis sebagai kondisi biner yang dijumlahkan, accruals sebagai (laba bersih − arus kas operasi) dibagi total aset, dan kejutan laba PEAD sebagai (laba aktual − laba ekspektasi) dibagi harga — ketiganya ilustratif, sesuaikan nama field dengan data yang tersedia.",
        "Dalam data cerita pembuka, perusahaan A mencetak 8, B mencetak 4, dan C mencetak 6. A adalah kandidat beli, B adalah kandidat buang, C adalah zona abu-abu. Tetapi F-score bukan sinyal beli yang berdiri sendiri — ia adalah filter: ia memisahkan value yang murah karena sehat dari value yang murah karena sekarat. Di FASTEXPR, F-score diterjemahkan sebagai kombinasi data field fundamental — dan tantangannya adalah lag: laporan keuangan tiba 45 sampai 90 hari setelah periode berakhir, sehingga sinyal harus di-lag manual (lihat WQB9).",
        "PEAD — post-earnings announcement drift — adalah anomali tertua yang terdokumentasi: saham yang laba-nya mengejutkan positif terus naik selama 60 hari setelah pengumuman, dan yang mengejutkan negatif terus turun. Dalam data cerita pembuka, saham dengan kejutan laba +8 persen naik 4,2 persen dalam 60 hari sementara pasar naik 1,1 persen — drift abnormal +3,1 persen. Penjelasannya: investor bereaksi lambat (underreaction) — dan analis yang mengandalkan PEAD bertaruh bahwa kelambatan itu masih ada, meskipun ia menyusut setiap tahun karena semakin banyak yang mengeksploitasinya.",
      ],
      tasks: [],
      note: {
        title: "Anomali yang dipublikasikan adalah anomali yang sekarat",
        body: "McLean dan Pontiff (2016) menunjukkan premia anomali menyusut rata-rata 58 persen setelah publikasi. Bukan berarti strategi itu mati — melainkan berarti implementasi naif-nya mati. Yang tersisa adalah versi yang lebih baik: eksekusi yang lebih murah, universe yang lebih luas, atau kombinasi dengan sinyal lain.",
      },
      reference: "F-score: 9 sinyal biner, 0-9. PEAD: kejutan +8 persen, drift abnormal +3,1 persen dalam 60 hari.",
    },
    {
      id: "accruals-bab-crash",
      eyebrow: "Langkah 4 · Teori",
      title: "Accruals, betting against beta, dan momentum crash",
      prose: [
        "Accruals (Sloan, 1996): laba terdiri dari kas dan accruals — dan bagian accruals-nya kurang persisten. Rasio accruals sama dengan (laba bersih dikurangi arus kas operasi) dibagi total aset. Dalam data cerita pembuka: (120 dikurangi 85) dibagi 1.000 sama dengan 3,5 persen. Perusahaan dengan accruals tinggi — laba yang sebagian besar bukan kas — cenderung berkinerja buruk kemudian, karena accruals berbalik (reversal). Sinyalnya: beli accruals rendah, jual accruals tinggi. Di FASTEXPR, ini adalah rank dari data field laba dan arus kas — sederhana, tetapi lag fundamental berlaku.",
        "Betting against beta (Frazzini dan Pedersen, 2014): saham beta rendah mengalahkan saham beta tinggi setelah disesuaikan risiko — karena banyak investor tidak bisa atau tidak mau memakai leverage, mereka membeli saham beta tinggi untuk mengejar return, sehingga harganya mahal dan return-nya rendah. Strateginya: beli beta rendah (0,6 dalam contoh) dengan leverage, jual beta tinggi (1,5). Tetapi leverage adalah pedang bermata dua: di krisis, posisi ber-leverage dipaksa likuidasi tepat saat harga termurah — dan itulah yang menghubungkan BAB dengan strategi kelima.",
        "Momentum crash: momentum — beli pemenang, jual pecundang — bekerja sebagian besar waktu, tetapi runtuh secara brutal saat pasar berbalik, seperti 2009: momentum kehilangan lebih dari 40 persen dalam beberapa bulan karena pecundang lama (saham yang jatuh paling dalam) tiba-tiba menjadi pemenang saat pasar pulih. Perlindungannya bukan berhenti memakai momentum, melainkan mengenalinya: volatilitas momentum yang melonjak, korelasi dengan pasar yang berbalik, dan drawdown yang mempercepat adalah tanda untuk mengurangi eksposur — atau meneutralkan beta momentum (lihat WQB8).",
      ],
      tasks: [],
      note: {
        title: "Lima strategi, satu musuh: crowding",
        body: "Crowding adalah SALAH SATU penyebab kematian strategi — bukan satu-satunya dan bukan kepastian: strategi bisa mati karena perubahan struktur pasar, perubahan regulasi, atau implementasi yang ceroboh, dan crowding sendiri adalah hipotesis yang harus diuji (misalnya lewat penyusutan premia pasca-publikasi — McLean dan Pontiff mengukur penyusutan rata-rata 58 persen, rata-rata, bukan jaminan untuk tiap strategi). Crowding menaikkan harga masuk, menaikkan korelasi antar pemain, dan mempercepat crash saat semua keluar bersamaan — bila ia memang terjadi. Pertahanan peneliti bukan rahasia — melainkan kombinasi: F-score dengan momentum, accruals dengan value, BAB dengan netralisasi — kombinasi yang korelasinya rendah satu sama lain.",
      },
      reference: "Accruals 3,5 persen. BAB: beta 0,6 vs 1,5. Momentum crash 2009: kehilangan lebih dari 40 persen dalam beberapa bulan.",
    },
    {
      id: "lab-strategi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: F-score, accruals, dan drift PEAD",
      prose: [
        "Lab ini menghitung tiga angka dari data cerita pembuka: F-score perusahaan A, rasio accruals, dan drift abnormal PEAD. Hitung dulu di kepala. F-score A: 8 dari 9 sinyal positif. Accruals: (120 dikurangi 85) dibagi 1.000 dikali 100 sama dengan 3,5 persen. Drift abnormal: 4,2 dikurangi 1,1 sama dengan 3,1 persen.",
        "Tugas lab: isi tiga variabel — f_score_a, accruals_pct, drift_abnormal — lalu cetak ketiganya. Tiga angka ini adalah kartu skor satu perusahaan: sehatkah ia, seberapa besar labanya yang bukan kas, dan seberapa besar kejutan labanya masih berlanjut.",
        "Setelah lolos, coba eksperimen: ubah arus kas operasi menjadi 130 — lebih besar dari laba bersih 120 — dan lihat accruals menjadi minus 1,0 persen. Lalu tanyakan: apakah perusahaan itu tiba-tiba menjadi kandidat beli? Jawabannya: accruals negatif adalah sinyal BAIK sebagai titik awal — labanya lebih dari didukung kas — tetapi periksa penyebabnya: write-down atau restrukturisasi besar juga bisa membuat accruals negatif tanpa berarti kualitas laba membaik. Satu sinyal tidak pernah cukup; baca bersama F-score dan valuasinya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung F-score perusahaan A (jumlah sinyal positif)" },
        { id: "t2", text: "Hitung rasio accruals dalam persen" },
        { id: "t3", text: "Hitung drift abnormal PEAD dalam persen" },
      ],
      expected: "f_score_a=8\naccruals_pct=3.5\ndrift_abnormal=3.1",
      hints: [
        "F-score = jumlah sinyal biner yang bernilai 1.",
        "Accruals = (laba bersih - arus kas operasi) / total aset x 100.",
        "Drift abnormal = return saham dikurangi return pasar.",
      ],
      code: {
        starter: "# Strategi akademik bernama. JANGAN UBAH.\nsinyal_a = [1, 1, 1, 1, 1, 0, 1, 1, 1]  # 9 sinyal Piotroski perusahaan A\nlaba_bersih, arus_kas, total_aset = 120, 85, 1000\nret_saham, ret_pasar = 4.2, 1.1  # persen, 60 hari pasca-pengumuman\n\n# TULIS KODEMU: F-score A, rasio accruals, drift abnormal\nf_score_a = \naccruals_pct = \ndrift_abnormal = \nprint(f\"f_score_a={f_score_a}\")\nprint(f\"accruals_pct={round(accruals_pct, 1)}\")\nprint(f\"drift_abnormal={round(drift_abnormal, 1)}\")",
        lockLines: 5,
        solution: "# Strategi akademik bernama. JANGAN UBAH.\nsinyal_a = [1, 1, 1, 1, 1, 0, 1, 1, 1]  # 9 sinyal Piotroski perusahaan A\nlaba_bersih, arus_kas, total_aset = 120, 85, 1000\nret_saham, ret_pasar = 4.2, 1.1  # persen, 60 hari pasca-pengumuman\n\n# TULIS KODEMU: F-score A, rasio accruals, drift abnormal\nf_score_a = sum(sinyal_a)\naccruals_pct = (laba_bersih - arus_kas) / total_aset * 100\ndrift_abnormal = ret_saham - ret_pasar\nprint(f\"f_score_a={f_score_a}\")\nprint(f\"accruals_pct={round(accruals_pct, 1)}\")\nprint(f\"drift_abnormal={round(drift_abnormal, 1)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "f_score_a=8", label: "F-score A: 8", msg: "Delapan dari sembilan sinyal positif — kandidat beli menurut Piotroski." },
          { kind: "stdout_matches", task: "t2", pattern: "accruals_pct=3.5", label: "Accruals 3,5 persen", msg: "(120 - 85) / 1.000 x 100 = 3,5. Laba yang sebagian bukan kas — waspadai reversal." },
          { kind: "stdout_matches", task: "t3", pattern: "drift_abnormal=3.1", label: "Drift abnormal 3,1 persen", msg: "4,2 - 1,1 = 3,1. Kejutan laba +8 persen masih berlanjut 60 hari." },
        ],
      },
      reference: "F-score A 8; accruals 3,5 persen; drift abnormal 3,1 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: alpha yang mati di tangan semua orang",
      prose: [
        "Seorang peneliti membangun alpha PEAD yang bersih: Sharpe 1,6 di backtest sepuluh tahun, turnover rendah, self-correlation 0,3. Ia submit — dan enam bulan kemudian Sharpe live-nya 0,4. Penyelidikan menemukan penyebabnya bukan kesalahan implementasi, melainkan crowding: tiga paper baru tentang PEAD terbit tahun itu, dan puluhan ribu peneliti membangun sinyal yang sama. Drift yang dulu berlangsung 60 hari kini selesai dalam 6 hari — sinyal itu masih 'benar', tetapi kecepatannya sudah tidak bisa ditangkap dengan delay dan decay yang ia pakai.",
        "Perbaikannya: ia tidak membuang PEAD, melainkan mengombinasikannya — PEAD yang hanya diambil bila F-score perusahaan di atas 6, dan dengan decay yang lebih cepat (3 hari, bukan 10). Kombinasi itu mengembalikan Sharpe ke 1,2 — bukan karena PEAD-nya lebih baik, melainkan karena filternya mengeluarkan perusahaan yang labanya tidak sehat, dan decay yang lebih cepat menangkap drift yang menyusut.",
        "Pelajaran yang dicatat: strategi akademik adalah bahan mentah, bukan produk jadi. Yang membedakan peneliti yang bertahan bukan siapa yang paling banyak membaca paper, melainkan siapa yang paling cepat menguji ulang, mengombinasikan, dan mengakui saat premia menyusut — lalu beradaptasi sebelum modalnya yang membayar.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini benar. Pertama, penyebab dicari di crowding dan kecepatan drift, bukan di bug. Kedua, kombinasi dengan filter fundamental (F-score) mengurangi universe ke perusahaan yang sehat. Ketiga, decay disesuaikan dengan kecepatan drift yang baru — parameter mengikuti pasar, bukan paper.",
      },
      reference: "PEAD Sharpe 1,6 di backtest, 0,4 live; kombinasi F-score + decay cepat mengembalikan ke 1,2.",
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
        "Piotroski: 9 sinyal biner, skor 0–9; 8–9 adalah kandidat beli.",
        "Lab: F-score A 8; accruals 3,5 persen; drift abnormal 3,1 persen.",
        "PEAD: kejutan laba berlanjut 60 hari karena underreaction.",
        "BAB: beta rendah menang karena investor tidak bisa memakai leverage.",
        "Momentum crash 2009: lebih dari 40 persen hilang saat pasar berbalik.",
      ],
      next: { label: "WQB35 — Treynor & Jensen's Alpha: Sharpe Tidak Sendiri", href: "/v2/learn/wqb35-treynor-jensen" },
      quiz: [
        {
          q: "Sinyal Piotroski A: [1,1,1,1,1,0,1,1,1]. Laba 120, arus kas 85, aset 1.000. Berapa F-score dan accruals?",
          options: [
            { text: "F-score 8; accruals 3,5 persen", why: "Tepat: delapan sinyal 1; (120-85)/1.000 = 3,5 persen.", correct: true },
            { text: "F-score 9; accruals 3,5 persen", why: "Salah: ada satu sinyal 0 — jumlahnya 8, bukan 9." },
            { text: "F-score 8; accruals 12,0 persen", why: "Salah: 12,0 persen adalah laba dibagi aset, bukan accruals. Accruals memakai laba dikurangi arus kas." },
            { text: "F-score 7; accruals 8,5 persen", why: "Salah: keduanya salah hitung — hitung ulang sinyal dan rumusnya." },
          ],
        },
        {
          q: "Saham naik 4,2 persen dalam 60 hari pasca-pengumuman; pasar naik 1,1 persen. Berapa drift abnormalnya?",
          options: [
            { text: "3,1 persen", why: "Tepat: 4,2 - 1,1 = 3,1. Itulah PEAD.", correct: true },
            { text: "5,3 persen — jumlah keduanya", why: "Salah: drift abnormal adalah selisih, bukan jumlah." },
            { text: "4,2 persen — return sahamnya", why: "Salah: return saham mencakup return pasar. Abnormal mengurangkan pasar." },
            { text: "1,1 persen — return pasarnya", why: "Salah: itu return pasar, bukan drift saham di atas pasar." },
          ],
        },
        {
          q: "Kenapa premia anomali menyusut setelah paper-nya terbit?",
          options: [
            { text: "Karena paper-nya salah", why: "Salah: paper-nya benar — yang berubah adalah pasar setelah semua orang membacanya." },
            { text: "Karena crowding: semakin banyak yang mengeksploitasinya, semakin cepat premia menyusut", why: "Tepat: McLean dan Pontiff mengukur penyusutan rata-rata 58 persen pasca-publikasi.", correct: true },
            { text: "Karena data historisnya dihapus", why: "Salah: data tidak dihapus — perilakunya yang berubah." },
            { text: "Karena anomali hanya berlaku di Amerika", why: "Salah: PEAD dan accruals terdokumentasi di banyak pasar." },
          ],
        },
        {
          q: "Accruals sebuah perusahaan negatif (arus kas lebih besar dari laba). Apa artinya?",
          options: [
            { text: "Sinyal buruk — labanya tidak didukung kas", why: "Salah: terbalik. Arus kas lebih besar dari laba berarti labanya LEBIH dari didukung kas." },
            { text: "Sinyal baik — labanya didukung kas bahkan lebih", why: "Tepat sebagai sinyal awal: accruals negatif berarti laba didukung kas — tetapi periksa penyebabnya: write-down atau restrukturisasi besar juga bisa membuat accruals negatif tanpa berarti kualitas laba membaik.", correct: true },
            { text: "Tidak ada arti — accruals negatif tidak mungkin", why: "Salah: accruals negatif sangat mungkin — saat arus kas melebihi laba." },
            { text: "Perusahaan pasti memanipulasi laporan", why: "Salah: accruals negatif adalah tanda kesehatan, bukan manipulasi." },
          ],
        },
        {
          q: "Momentum kehilangan lebih dari 40 persen dalam beberapa bulan di 2009. Apa perlindungan yang benar?",
          options: [
            { text: "Berhenti memakai momentum selamanya", why: "Salah: momentum bekerja sebagian besar waktu; crash adalah risiko yang dikelola, bukan alasan berhenti." },
            { text: "Kenali tandanya — volatilitas momentum melonjak, korelasi berbalik — dan kurangi eksposur atau netralkan beta", why: "Tepat: perlindungan adalah pengenalan dan pengurangan eksposur, bukan penghapusan strategi.", correct: true },
            { text: "Gandakan posisi momentum saat crash — pasti pulih", why: "Salah: menggandakan saat crash adalah cara tercepat menghabiskan modal." },
            { text: "Pindah ke saham beta tinggi", why: "Salah: beta tinggi justru memperparah crash — pecundang lama yang berbalik adalah saham beta tinggi." },
          ],
        },
      ],
    },
  ],
};

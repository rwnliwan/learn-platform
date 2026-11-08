import type { V2Lesson } from "../lib/types";

export const wqb36: V2Lesson = {
  slug: "wqb36-survivorship-lookahead-bias",
  track: "WorldQuant Brain",
  module: "Strategi & Riset",
  title: "WQB36 — Survivorship & Look-Ahead Bias: Kuburan dan Masa Depan yang Bocor",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Backtest 9 persen yang sebenarnya 3,36 persen",
      prose: [
        "Seorang peneliti menguji strategi di 100 saham selama lima tahun dan mendapat return tahunan 9,0 persen — cukup untuk submit. Tetapi saat ia menguji ulang dengan daftar saham yang benar-benar ada di tiap tanggal — termasuk 12 saham yang bangkrut dan delisted selama periode itu, dengan return rata-rata minus 38 persen — rata-rata lintas saham jatuh ke 3,36 persen: (88 dikali 9,0 ditambah 12 dikali minus 38,0) dibagi 100 sama dengan 3,36. Selisihnya 5,64 poin persen adalah survivorship bias: backtest pertamanya tidak pernah 'membeli' pecundang yang mati, karena daftar sahamnya diambil dari tahun terakhir. Perhatian: 3,36 persen di sini adalah RATA-RATA LINTAS SAHAM (cross-sectional mean) dari return satu periode — ilustrasi besarnya bias — BUKAN return tahunan portofolio selama 5 tahun. Return tahunan portofolio yang sebenarnya memerlukan bobot portofolio dan compounding tahunan tiap saham; angka 3,36 tidak boleh dibaca sebagai 'portofolio ini menghasilkan 3,36 persen per tahun selama lima tahun'.",
        "Di saat yang sama, sinyalnya memakai data laba yang diumumkan — tetapi tanggal yang dipakai adalah tanggal AKHIR periode laporan, bukan tanggal PENGUMUMAN. Sinyal itu 'tahu' laba tiga minggu sebelum pasar mengetahuinya. Dengan tanggal yang benar (di-lag), return sinyal jatuh dari 18,4 persen menjadi 6,1 persen — inflasi look-ahead 12,3 poin persen. Dua bias, satu backtest, dan keduanya membuat strategi yang biasa terlihat hebat. Lesson ini mengajarkan kedua bias bernama itu — cara mengenalinya, mengukurnya, dan mencegahnya.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Kedua bias ini sudah disinggung sebagai langkah: WQB7 punya satu langkah 'Konstruksi universe dan jebakan survivorship' (return menggelembung 2–4 persen per tahun) dan WQB9 punya satu langkah 'Katalog jebakan look-ahead' (empat jebakan). Tetapi tidak ada LESSON yang membangun keduanya secara penuh — dengan lab yang mengukur besarnya bias dan prosedur pencegahan. Lesson ini membangun lesson-nya, dengan WQB7 dan WQB9 sebagai prasyarat.",
      },
      reference: "Survivorship: 9,0 persen naive vs 3,36 persen rata-rata lintas saham (ilustrasi, bukan return tahunan portofolio) — bias 5,64 pp. Look-ahead: 18,4 persen vs 6,1 persen — inflasi 12,3 pp.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengenali, mengukur, dan mencegah dua bias paling mahal di backtest.",
        "(1) Menjelaskan survivorship bias dan menghitung besarnya dari data;",
        "(2) Menjelaskan look-ahead bias dan tiga bentuknya (plus jebakan data corporate action dan restatement);",
        "(3) Menerapkan disiplin point-in-time pada universe dan data fundamental;",
        "(4) Menghitung return yang benar dengan memasukkan saham yang mati;",
        "(5) Menyusun checklist anti-bias sebelum submit alpha.",
      ],
      tasks: [],
    },
    {
      id: "survivorship",
      eyebrow: "Langkah 3 · Teori",
      title: "Survivorship bias: kuburan yang disembunyikan",
      prose: [
        "Survivorship bias terjadi saat backtest memakai universe hari ini untuk menguji masa lalu. Perusahaan yang bangkrut, delisted, atau diakuisisi murah tidak ada di daftar hari ini — sehingga backtest tidak pernah membeli mereka. Yang tersisa hanyalah para penyintas — tetapi 'penyintas' TIDAK berarti 'berkinerja baik' menurut definisi: saham bisa bertahan bertahun-tahun dengan return mediocre atau negatif kecil tanpa pernah bangkrut, dan perusahaan yang diakuisisi dengan premium justru hilang dari daftar padahal ia pemenang. Yang hilang dari daftar adalah yang TIDAK ADA LAGI — campuran pecundang yang bangkrut dan pemenang yang diakuisisi — dan arah biasnya bergantung pada campuran itu. Dalam contoh lesson ini pecundang mendominasi, sehingga return terlihat lebih tinggi dari realitas — arah yang paling umum dan paling berbahaya.",
        "Hitungannya dari cerita pembuka: 88 penyintas dengan return rata-rata 9,0 persen, 12 saham mati dengan return rata-rata minus 38,0 persen. Rata-rata lintas saham yang benar: (88 dikali 9,0 ditambah 12 dikali minus 38,0) dibagi 100 sama dengan (792 dikurangi 456) dibagi 100 sama dengan 3,36 persen. Return naive 9,0 persen menggelembung 5,64 poin persen — lebih dari dua setengah kali lipat rata-rata yang benar. Sekali lagi: 3,36 persen adalah rata-rata lintas saham, bukan return tahunan portofolio 5 tahun — ia mengilustrasikan besarnya bias, bukan kinerja portofolio. Dan ini bukan kasus ekstrem: WQB7 mencatat penggelembungan tipikal 2 sampai 4 persen per tahun — cukup untuk mengubah 'layak submit' menjadi 'sampah'.",
        "Pencegahannya adalah disiplin point-in-time: backtest wajib memakai konstituen historis — daftar universe sebagaimana ia terlihat pada tiap tanggal di masa lalu. Di WorldQuant Brain, universe dibangun ulang berkala dengan filter ADV dan harga — tetapi peneliti tetap harus memeriksa: apakah sinyalnya memakai universe point-in-time, atau daftar hari ini yang diproyeksikan ke belakang? Pertanyaan itu harus dijawab sebelum backtest dipercaya.",
      ],
      tasks: [],
      note: {
        title: "Survivorship tidak hanya soal bangkrut",
        body: "Perusahaan yang diakuisisi dengan premium juga 'hilang' dari daftar — dan mereka adalah pemenang, bukan pecundang. Mengeluarkan mereka justru MENGURANGI return backtest. Survivorship bias tidak selalu menggelembungkan ke satu arah — tetapi arah yang paling umum dan paling berbahaya adalah penggelembungan oleh pecundang yang hilang.",
      },
      reference: "Rata-rata lintas saham benar 3,36 persen; naive 9,0 persen; bias 5,64 pp. Obat: konstituen historis (point-in-time).",
    },
    {
      id: "lookahead",
      eyebrow: "Langkah 4 · Teori",
      title: "Look-ahead bias: masa depan yang bocor ke masa lalu",
      prose: [
        "Look-ahead bias terjadi saat sinyal memakai informasi yang belum tersedia pada tanggal trading-nya. Tiga bentuknya — dari katalog WQB9. Satu: fiscal-period dating — memakai tanggal akhir periode laporan, bukan tanggal pengumuman; laba kuartal yang berakhir Maret tetapi diumumkan Mei tidak bisa ditradingkan di April. Obatnya: pakai tanggal pengumuman aktual atau field point-in-time bila tersedia. Lag tetap 45 sampai 90 hari HANYA aturan praktis kasar — bukan jaminan: tanggal pengumuman bervariasi antar perusahaan, ada yang melapor terlambat, dan ada restatement (lihat paragraf terakhir langkah ini). Lag yang sama untuk semua saham tetap bisa bocor pada saham yang pengumumannya terlambat.",
        "Dua: konstituen masa depan — memakai daftar saham hari ini untuk backtest masa lalu (ini juga survivorship bias; kedua bias sering datang bersamaan). Tiga: timestamp pengumuman — rilis after-hours tidak bisa ditradingkan hari itu juga; tanggal boleh benar tetapi jamnya salah berarti delay semu satu hari. Corporate action yang tidak disesuaikan — stock split 2:1 tanpa penyesuaian terlihat sebagai crash minus 50 persen dan memicu sinyal beli palsu — adalah JEBAKAN DATA yang terpisah, BUKAN look-ahead: ia tidak melibatkan informasi masa depan yang bocor, melainkan harga historis yang salah dihitung. Ia tetap harus diperbaiki (sesuaikan harga historis dengan aksi korporasi), tetapi jangan menyebutnya look-ahead.",
        "Satu bentuk kebocoran yang tidak ada di tiga bentuk di atas: restatement. Laporan keuangan sering direvisi setelah pengumuman awal — angka yang kamu unduh hari ini adalah versi RESTATED, bukan versi yang dilihat pasar saat itu. Sinyal yang memakai angka restated 'tahu' revisi yang belum terjadi pada tanggal trading-nya. Obatnya adalah versi data point-in-time: simpan setiap versi data beserta tanggal berlakunya (versi awal, revisi 1, revisi 2), dan backtest hanya boleh memakai versi yang sudah tersedia pada tanggal itu. Bila penyedia datamu tidak menyediakan versi point-in-time, perlakukan data fundamental dengan lag yang lebih panjang dan uji sensitivitas: bila sinyal berubah drastis saat angka restated diganti angka awal, sinyalmu bergantung pada revisi.",
        "Hitungannya dari cerita pembuka: sinyal yang memakai tanggal periode (bocor) menghasilkan 18,4 persen; sinyal yang sama dengan tanggal pengumuman (benar) menghasilkan 6,1 persen — inflasi look-ahead 12,3 poin persen. Dua pertiga return sinyal itu adalah masa depan yang bocor, bukan alpha. Dan inilah yang membuat look-ahead begitu berbahaya: ia tidak terlihat di angka headline — backtest terlihat hijau, Sharpe terlihat bagus — sampai live trading membuktikan bahwa sinyal itu tidak pernah ada.",
      ],
      tasks: [],
      note: {
        title: "Tes delay +1: tes eksekusi, bukan tes look-ahead yang definitif",
        body: "Geser sinyalmu satu hari ke depan (delay +1) dan lihat apa yang terjadi pada return. Bila return runtuh, sinyalmu mungkin bergantung pada eksekusi yang tidak mungkin — atau pada informasi yang bocor. Tetapi tes ini TIDAK definitif untuk look-ahead: sinyal bisa lolos delay +1 tetapi tetap bocor (misalnya memakai data restated yang 'tersedia' terlambat), dan sinyal horizon pendek yang sah bisa runtuh karena delay semata. Tes yang benar untuk look-ahead adalah audit point-in-time: bandingkan tanggal tiap data dengan tanggal ketersediaannya. Sinyal yang sehat menurun perlahan dengan delay; sinyal yang bocor mati mendadak — tetapi yang lolos belum tentu bersih.",
      },
      reference: "Bocor 18,4 persen vs benar 6,1 persen — inflasi 12,3 pp. Tiga bentuk look-ahead: dating, konstituen, timestamp — plus jebakan data terpisah: corporate action; dan restatement butuh versi data point-in-time.",
    },
    {
      id: "lab-bias",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mengukur survivorship dan look-ahead bias",
      prose: [
        "Lab ini menghitung tiga angka dari data cerita pembuka: rata-rata lintas saham yang benar (dengan saham mati), bias survivorship, dan inflasi look-ahead. Hitung dulu di kepala. Rata-rata benar: (88 dikali 9,0 ditambah 12 dikali minus 38,0) dibagi 100 sama dengan 336 dibagi 100 sama dengan 3,36 persen — ingat, ini rata-rata lintas saham, bukan return tahunan portofolio 5 tahun. Bias survivorship: 9,0 dikurangi 3,36 sama dengan 5,64 poin persen. Inflasi look-ahead: 18,4 dikurangi 6,1 sama dengan 12,3 poin persen.",
        "Tugas lab: isi tiga variabel — ret_benar, bias_surv, inflasi_la — lalu cetak ketiganya. Tiga angka ini adalah laporan kejujuran backtest: berapa return yang sebenarnya, berapa yang merupakan kuburan yang disembunyikan, dan berapa yang merupakan masa depan yang bocor.",
        "Setelah lolos, coba eksperimen: ubah return saham mati menjadi minus 10 persen dan lihat rata-rata lintas saham naik menjadi 6,72 persen dengan bias 2,28 poin persen. Lalu tanyakan: apakah bias itu tiba-tiba bisa diterima? Jawabannya: tidak — bias 2,28 poin persen masih cukup untuk mengubah keputusan submit. Yang berubah hanya besarnya, bukan sifatnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung rata-rata lintas saham dengan saham mati (persen)" },
        { id: "t2", text: "Hitung bias survivorship (poin persen)" },
        { id: "t3", text: "Hitung inflasi look-ahead (poin persen)" },
      ],
      expected: "ret_benar=3.36\nbias_surv=5.64\ninflasi_la=12.3",
      hints: [
        "Rata-rata lintas saham yang benar = rata-rata tertimbang penyintas dan saham mati.",
        "Bias survivorship = return naive dikurangi rata-rata lintas saham yang benar.",
        "Inflasi look-ahead = return bocor dikurangi return benar (di-lag).",
      ],
      code: {
        starter: "# Backtest 100 saham, 5 tahun (persen). JANGAN UBAH.\npenyintas, ret_penyintas = 88, 9.0\nmati, ret_mati = 12, -38.0\nret_bocor, ret_lag = 18.4, 6.1\n\n# TULIS KODEMU: rata-rata lintas saham, bias survivorship, inflasi look-ahead\nret_benar = \nbias_surv = \ninflasi_la = \nprint(f\"ret_benar={round(ret_benar, 2)}\")\nprint(f\"bias_surv={round(bias_surv, 2)}\")\nprint(f\"inflasi_la={round(inflasi_la, 1)}\")",
        lockLines: 5,
        solution: "# Backtest 100 saham, 5 tahun (persen). JANGAN UBAH.\npenyintas, ret_penyintas = 88, 9.0\nmati, ret_mati = 12, -38.0\nret_bocor, ret_lag = 18.4, 6.1\n\n# TULIS KODEMU: rata-rata lintas saham, bias survivorship, inflasi look-ahead\ntotal = penyintas + mati\nret_benar = (penyintas * ret_penyintas + mati * ret_mati) / total\nret_naive = ret_penyintas\nbias_surv = ret_naive - ret_benar\ninflasi_la = ret_bocor - ret_lag\nprint(f\"ret_benar={round(ret_benar, 2)}\")\nprint(f\"bias_surv={round(bias_surv, 2)}\")\nprint(f\"inflasi_la={round(inflasi_la, 1)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "ret_benar=3.36", label: "Rata-rata lintas saham 3,36 persen", msg: "(792 - 456) / 100 = 3,36. Bukan 9,0 persen — dan bukan return tahunan portofolio." },
          { kind: "stdout_matches", task: "t2", pattern: "bias_surv=5.64", label: "Bias survivorship 5,64 pp", msg: "9,0 - 3,36 = 5,64. Lebih dari dua setengah kali lipat return sebenarnya." },
          { kind: "stdout_matches", task: "t3", pattern: "inflasi_la=12.3", label: "Inflasi look-ahead 12,3 pp", msg: "18,4 - 6,1 = 12,3. Dua pertiga return sinyal adalah masa depan yang bocor." },
        ],
      },
      reference: "Rata-rata lintas saham 3,36 persen; bias 5,64 pp; inflasi look-ahead 12,3 pp.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: alpha yang lolos semua gerbang, lalu mati di live",
      prose: [
        "Alpha itu lolos semua gerbang WQB11: Sharpe 1,48, fitness 1,12, turnover 0,55, drawdown 9,3 persen, self-correlation 0,44. Ia disubmit — dan tiga bulan live, return-nya nol. Penyelidikan menemukan dua bias sekaligus: universe-nya memakai daftar TOP3000 tahun berjalan (survivorship), dan sinyal fundamentalnya memakai tanggal akhir periode (look-ahead). Kedua bias itu tidak terlihat di panel hasil simulasi — karena panel itu mengukur apa yang terjadi di backtest, bukan apakah backtest itu jujur.",
        "Perbaikannya: backtest diulang dengan konstituen historis dan lag fundamental 60 hari. Sharpe jatuh dari 1,48 menjadi 0,62 — di bawah gerbang 1,25. Alpha itu dibuang. Keputusan yang menyakitkan, tetapi benar: alpha yang dibuang sebelum submit menghemat slot submit dan reputasi; alpha yang mati di live menghabiskan keduanya.",
        "Sejak itu, tim itu menambahkan checklist anti-bias sebelum submit: konstituen historis, lag fundamental, corporate action disesuaikan, timestamp pengumuman, dan tes delay +1. Lima baris — dan tidak ada alpha yang lolos gerbang tanpa kelimanya dicentang. Checklist itu tidak membuat peneliti lebih lambat; ia membuat mereka berhenti membuang waktu pada alpha yang tidak pernah ada.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini benar. Pertama, penyebab dicari di kejujuran backtest, bukan di parameter. Kedua, alpha dibuang berdasarkan bukti — Sharpe 0,62 yang jujur lebih berharga dari Sharpe 1,48 yang palsu. Ketiga, checklist dijadikan gerbang permanen sebelum submit.",
      },
      reference: "Sharpe 1,48 palsu → 0,62 jujur setelah konstituen historis + lag 60 hari. Alpha dibuang.",
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
        "Survivorship: backtest dengan universe hari ini tidak pernah membeli pecundang yang mati — tetapi penyintas bukan menurut definisi berkinerja baik.",
        "Lab: rata-rata lintas saham 3,36 persen (ilustrasi bias, bukan return tahunan portofolio); bias 5,64 pp; inflasi look-ahead 12,3 pp.",
        "Look-ahead: tiga bentuk — dating, konstituen, timestamp — plus jebakan data terpisah (corporate action) dan restatement yang butuh versi data point-in-time.",
        "Obat: konstituen historis (point-in-time), tanggal pengumuman aktual (lag 45–90 hari hanya aturan kasar), dan audit point-in-time.",
        "Tes delay +1: tes eksekusi, bukan bukti bersih dari look-ahead.",
      ],
      next: { label: "WQB37 — Reinforcement Learning untuk Trading: Agen yang Belajar dari Rugi", href: "/v2/learn/wqb37-reinforcement-learning-trading" },
      quiz: [
        {
          q: "88 penyintas return 9,0 persen; 12 saham mati return minus 38,0 persen. Berapa rata-rata lintas saham yang benar dan bias survivorship?",
          options: [
            { text: "3,36 persen dan 5,64 pp", why: "Tepat: (792 - 456)/100 = 3,36; 9,0 - 3,36 = 5,64. Ingat: 3,36 adalah rata-rata lintas saham (ilustrasi bias), bukan return tahunan portofolio 5 tahun.", correct: true },
            { text: "9,0 persen dan 0 pp — saham mati tidak dihitung", why: "Salah: mengabaikan saham mati adalah definisi survivorship bias itu sendiri." },
            { text: "3,36 persen dan 3,36 pp", why: "Salah: bias adalah selisih naive dan benar (9,0 - 3,36), bukan rata-rata itu sendiri." },
            { text: "5,64 persen dan 3,36 pp — tertukar", why: "Salah: 3,36 adalah rata-rata yang benar; 5,64 adalah biasnya." },
          ],
        },
        {
          q: "Sinyal memakai tanggal akhir periode laporan, bukan tanggal pengumuman. Apa yang terjadi?",
          options: [
            { text: "Tidak ada — tanggal periode dan pengumuman sama saja", why: "Salah: laba kuartal Maret diumumkan Mei — memakai tanggal Maret berarti tahu laba dua bulan sebelum pasar." },
            { text: "Look-ahead bias — sinyal tahu laba sebelum pasar mengetahuinya", why: "Tepat: ini bentuk fiscal-period dating. Obatnya lag 45–90 hari.", correct: true },
            { text: "Survivorship bias — saham yang bangkrut tidak ikut", why: "Salah: itu bias yang berbeda, soal universe, bukan soal tanggal." },
            { text: "Overfitting — terlalu banyak parameter", why: "Salah: ini bukan soal parameter; ini soal informasi masa depan yang bocor." },
          ],
        },
        {
          q: "Sinyal return 18,4 persen tanpa lag dan 6,1 persen dengan lag 60 hari. Berapa inflasi look-ahead?",
          options: [
            { text: "12,3 poin persen", why: "Tepat: 18,4 - 6,1 = 12,3. Dua pertiga return adalah kebocoran.", correct: true },
            { text: "6,1 poin persen — return yang benar", why: "Salah: 6,1 adalah return yang benar, bukan inflasinya." },
            { text: "24,5 poin persen — jumlah keduanya", why: "Salah: inflasi adalah selisih, bukan jumlah." },
            { text: "18,4 poin persen — return tanpa lag", why: "Salah: itu return yang bocor, bukan inflasinya." },
          ],
        },
        {
          q: "Geser sinyal satu hari ke depan (delay +1) dan return-nya runtuh total. Apa diagnosisnya?",
          options: [
            { text: "Sinyal sehat — delay memang merusak semua sinyal", why: "Salah: sinyal sehat menurun perlahan dengan delay; yang mati mendadak kemungkinan bocor atau tidak bisa dieksekusi." },
            { text: "Kemungkinan look-ahead atau eksekusi yang tidak mungkin — tetapi tes ini tidak definitif", why: "Tepat: tes delay +1 adalah tes eksekusi, bukan bukti bersih dari look-ahead; sinyal bisa lolos delay +1 tetapi tetap bocor lewat data restated. Yang definitif adalah audit point-in-time.", correct: true },
            { text: "Overfitting — terlalu banyak parameter", why: "Salah: runtuhnya return saat delay bukan gejala overfitting." },
            { text: "Turnover terlalu tinggi", why: "Salah: turnover tidak menjelaskan keruntuhan mendadak saat delay satu hari." },
          ],
        },
        {
          q: "Alpha lolos semua gerbang (Sharpe 1,48) tetapi setelah konstituen historis + lag 60 hari Sharpe-nya 0,62. Apa keputusan yang benar?",
          options: [
            { text: "Submit saja — gerbang sudah lolos", why: "Salah: gerbang itu lolos dengan backtest yang tidak jujur. Sharpe 0,62 yang jujur adalah vonisnya." },
            { text: "Buang alpha — Sharpe jujur di bawah gerbang 1,25", why: "Tepat: alpha yang dibuang sebelum submit menghemat slot dan reputasi.", correct: true },
            { text: "Ubah gerbang menjadi 0,6 agar lolos", why: "Salah: mengubah gerbang untuk meloloskan alpha adalah manipulasi, bukan perbaikan." },
            { text: "Sembunyikan hasil backtest ulang dari tim", why: "Salah: menyembunyikan bukti adalah pelanggaran integritas riset." },
          ],
        },
      ],
    },
  ],
};

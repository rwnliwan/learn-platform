import type { V2Lesson } from "../lib/types";

export const wqb32: V2Lesson = {
  slug: "wqb32-pairs-trading",
  track: "WorldQuant Brain",
  module: "Strategi Riset Alpha",
  title: "WQB32 — Pairs Trading dan Cointegration",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua saham yang berjalan beriringan 29 hari — lalu berpisah di hari ke-30",
      prose: [
        "Dua saham bank, A dan B, bergerak beriringan selama 29 hari. Harganya naik-turun bersama seperti dua gerbong kereta yang sama. Di hari ke-30, B melonjak sementara A diam di tempat. Spread di antara keduanya melebar ke 2,14 standar deviasi di atas rata-ratanya. Pertanyaannya: apakah ini peluang — spread akan kembali merapat — atau ini perpisahan permanen, karena sesuatu yang fundamental berubah di B?",
        "Jawaban atas pertanyaan itu bernama cointegration. Dua harga yang berkointegrasi punya hubungan ekuilibrium jangka panjang: mereka boleh berpisah sementara, tetapi ada gaya yang menarik mereka kembali. Tanpa cointegration, spread yang melebar hanyalah dua harga yang kebetulan berjalan searah — dan bertaruh bahwa mereka akan kembali adalah bertaruh pada kebetulan.",
        "Setelah lesson ini kamu bisa: (1) membedakan korelasi dengan cointegration dan menjelaskan kenapa korelasi saja tidak cukup; (2) mengestimasi hedge ratio lewat regresi dan menghitung spread serta z-score-nya; (3) menghitung half-life mean reversion dan merancang aturan entry dan exit; (4) mengenali regime break — saat spread tidak kembali dan posisi harus ditutup.",
      ],
      tasks: [],
      note: {
        title: "Korelasi bukan cointegration",
        body: "Dua harga yang sama-sama naik karena pasar naik akan berkorelasi tinggi — tetapi spread di antara keduanya bisa melebar tanpa batas. Cointegration berarti spread-nya stasioner: ia berosilasi di sekitar rata-rata dan kembali. Korelasi menjawab apakah mereka bergerak bersama; cointegration menjawab apakah jarak mereka punya rumah untuk kembali.",
      },
      reference: "Korelasi = bergerak bersama. Cointegration = jaraknya punya rumah. Hanya yang kedua yang bisa ditradingkan sebagai pairs.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menguji sepasang saham, menghitung sinyalnya, dan memutuskan apakah ia layak menjadi alpha — atau hanya ilusi statistik.",
        "(1) Menjelaskan cointegration dan uji Engle-Granger dua langkah;",
        "(2) Mengestimasi hedge ratio dari regresi log-harga dan menghitung spread serta z-score-nya;",
        "(3) Menghitung half-life dari AR(1) spread dan memakai z-score untuk aturan entry dan exit;",
        "(4) Menentukan kapan menutup posisi karena regime break, dan bagaimana biaya serta kapasitas membatasi strategi ini.",
      ],
      tasks: [],
    },
    {
      id: "cointegration",
      eyebrow: "Langkah 3 · Teori",
      title: "Cointegration dan uji Engle-Granger",
      prose: [
        "Harga saham umumnya non-stasioner: ia berjalan tanpa kecenderungan kembali ke rata-rata (random walk). Dua harga yang masing-masing non-stasioner tetapi kombinasi linearnya stasioner disebut berkointegrasi. Kombinasi itu adalah spread: log harga B dikurangi beta dikali log harga A, dengan beta sebagai hedge ratio — berapa lembar A untuk menetralkan satu lembar B.",
        "Uji Engle-Granger dua langkah: pertama, regresikan log harga B ke log harga A dan simpan residunya sebagai spread. Kedua, uji apakah residu itu stasioner — praktisnya, regresikan spread hari ini ke spread kemarin (AR(1)) dan lihat koefisiennya: bila di bawah 1 secara signifikan, spread mean-reverting. Di lesson ini, koefisien AR(1) adalah 0,572 — jauh di bawah 1 — sehingga spread terbukti kembali ke rata-rata.",
        "Hedge ratio dari lab adalah 0,846: untuk setiap 1 lembar B, pegang 0,846 lembar A di sisi berlawanan. Bila beta diestimasi dari jendela yang terlalu pendek, ia goyang — dan spread yang dihitung dari beta yang goyang adalah spread palsu. Aturan praktis: estimasi beta dari minimal 60 hari, dan uji kestabilannya di dua sub-periode sebelum percaya.",
      ],
      tasks: [],
      formula: String.raw`s_t = \ln P^B_t - \beta \ln P^A_t, \quad z_t = \frac{s_t - \bar{s}}{\sigma_s}, \quad s_t = \rho s_{t-1} + \epsilon_t`,
      formulaNote: "s_t = spread (log harga B dikurangi beta kali log harga A); z_t = z-score spread; rho = koefisien AR(1) — di bawah 1 berarti mean-reverting. Beta = hedge ratio dari regresi.",
      reference: "Spread stasioner = pairs yang bisa ditradingkan. Beta dari 60 hari minimum, uji kestabilan di dua sub-periode.",
    },
    {
      id: "zscore-halflife",
      eyebrow: "Langkah 4 · Teori",
      title: "Z-score, half-life, dan aturan trading",
      prose: [
        "Z-score mengubah spread menjadi sinyal: z di atas +2 berarti spread terlalu lebar — jual B, beli A (short spread), bertaruh spread akan merapat. Z di bawah -2 berarti spread terlalu sempit — beli B, jual A (long spread). Keluar saat z kembali ke 0. Aturan ini sederhana, tetapi ketergantungannya pada half-life: half-life sama dengan minus ln 2 dibagi ln rho — waktu yang dibutuhkan spread untuk menutup separuh jaraknya ke rata-rata.",
        "Di lab, rho 0,572 memberi half-life 1,24 hari: spread menutup separuh jaraknya dalam sekitar satu hari perdagangan. Itu cepat — dan cepat berarti dua hal. Pertama, peluangnya singkat: sinyal hari ini harus dieksekusi hari ini juga, bukan minggu depan. Kedua, biayanya penting: bila half-life hanya 1,24 hari tetapi biaya transaksi memakan 0,3 persen per putaran, maka sebagian besar keuntungan mean reversion habis untuk biaya.",
        "Risiko terbesarnya adalah regime break: spread yang tidak kembali karena sesuatu yang fundamental berubah — misal B diakuisisi, atau A kehilangan kontrak besar. Tanda-tandanya: z melewati 3,5 dan bertahan, atau half-life yang tiba-tiba memanjang di jendela terbaru. Aturannya: pasang stop — bila z melewati 3,5, tutup posisi dan periksa berita, jangan tambah posisi dengan asumsi ia pasti kembali.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih pasangan dari korelasi tertinggi di seluruh universe tanpa uji cointegration. Korelasi tinggi antar saham satu sektor hampir pasti — tetapi spread mereka bisa melebar tanpa batas. Pasangan yang dipilih dari korelasi saja adalah pasangan yang paling mungkin mengecewakan saat spread melebar dan tidak kembali.",
      },
      reference: "Entry di |z| di atas 2, exit di 0, stop di 3,5. Half-life pendek = eksekusi cepat dan biaya menentukan.",
    },
    {
      id: "lab-pairs",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hedge ratio, z-score, dan half-life sepasang saham",
      prose: [
        "Hitung pairs trading untuk saham A dan B dari 30 hari harga penutupan. Langkahnya: ambil log harga, regresikan log B ke log A untuk mendapat hedge ratio beta, hitung spread sebagai residu, hitung z-score hari terakhir, regresikan spread ke spread kemarin untuk rho, lalu hitung half-life.",
        "Hasil yang diharapkan: beta 0,8462, z-score hari terakhir 2,14, rho 0,572, half-life 1,24 hari. Z 2,14 di atas ambang 2 berarti sinyal SHORT spread: jual B, beli A sebanyak beta lembar per lembar B. Half-life 1,24 hari berarti separuh jarak spread tertutup dalam sekitar satu hari — eksekusi tidak bisa ditunda.",
        "Setelah lolos, coba ubah ambang entry menjadi 1,5 dan hitung berapa hari dalam 30 hari itu yang memberi sinyal — lalu tanyakan: apakah lebih banyak sinyal berarti lebih banyak untung, atau lebih banyak biaya? Itulah trade-off ambang entry: ambang rendah memberi lebih banyak trading, ambang tinggi memberi sinyal yang lebih kuat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `beta` dari regresi log B ke log A, lalu `spread` sebagai residu" },
        { id: "t2", text: "Hitung `z_last`, `rho`, dan `half_life`, lalu cetak ketiganya" },
      ],
      expected: "beta=0.85 z_last=2.14 rho=0.57 half_life=1.24 hari -> SHORT spread",
      hints: [
        "Log harga: math.log tiap harga. Beta = kovarians dibagi varians log A.",
        "Spread = log B - (alpha + beta × log A); alpha = rata-rata log B - beta × rata-rata log A.",
        "z_last = (spread terakhir - rata-rata spread) / standar deviasi spread (pembagi n-1).",
        "Rho = slope regresi spread[1:] ke spread[:-1]; half-life = -ln(2) / ln(rho).",
      ],
      code: {
        starter: `# Pairs trading: 30 hari harga A dan B (JANGAN UBAH)\nimport math\nPA = [100.0, 99.74, 100.26, 100.03, 99.71, 98.79, 98.58, 99.68, 100.11, 101.15, 101.4, 101.8, 101.99, 100.31, 101.17, 101.68, 102.19, 100.48, 98.74, 97.87, 97.41, 97.71, 97.66, 98.17, 97.54, 97.84, 98.23, 97.58, 99.27, 99.83]\nPB = [119.43, 120.33, 119.89, 118.9, 118.44, 117.68, 118.25, 119.49, 119.36, 119.49, 119.54, 121.47, 120.77, 119.57, 120.85, 119.81, 120.71, 120.58, 116.81, 116.1, 115.95, 115.77, 116.63, 117.23, 115.4, 116.96, 118.08, 118.25, 120.93, 121.15]\n\n# TULIS KODEMU: log harga, beta, spread\nla = [math.log(x) for x in PA]\nlb = [math.log(x) for x in PB]\nbeta = \nspread = \n\n# TULIS KODEMU: z_last, rho, half_life\nz_last = \nrho = \nhalf_life = \n\nsinyal = "SHORT spread (jual B, beli A)" if z_last > 2 else ("LONG spread (beli B, jual A)" if z_last < -2 else "TUNGGU")\nprint(f"beta={beta:.2f} z_last={z_last:.2f} rho={rho:.2f} half_life={half_life:.2f} hari -> {sinyal}")`,
        lockLines: 4,
        solution: `# Pairs trading: 30 hari harga A dan B (JANGAN UBAH)\nimport math\nPA = [100.0, 99.74, 100.26, 100.03, 99.71, 98.79, 98.58, 99.68, 100.11, 101.15, 101.4, 101.8, 101.99, 100.31, 101.17, 101.68, 102.19, 100.48, 98.74, 97.87, 97.41, 97.71, 97.66, 98.17, 97.54, 97.84, 98.23, 97.58, 99.27, 99.83]\nPB = [119.43, 120.33, 119.89, 118.9, 118.44, 117.68, 118.25, 119.49, 119.36, 119.49, 119.54, 121.47, 120.77, 119.57, 120.85, 119.81, 120.71, 120.58, 116.81, 116.1, 115.95, 115.77, 116.63, 117.23, 115.4, 116.96, 118.08, 118.25, 120.93, 121.15]\n\n# TULIS KODEMU: log harga, beta, spread\nla = [math.log(x) for x in PA]\nlb = [math.log(x) for x in PB]\nma = sum(la) / len(la)\nmb = sum(lb) / len(lb)\nbeta = sum((a - ma) * (b - mb) for a, b in zip(la, lb)) / sum((a - ma) ** 2 for a in la)\nalpha = mb - beta * ma\nspread = [b - (alpha + beta * a) for a, b in zip(la, lb)]\n\n# TULIS KODEMU: z_last, rho, half_life\nms = sum(spread) / len(spread)\nsd = math.sqrt(sum((x - ms) ** 2 for x in spread) / (len(spread) - 1))\nz_last = (spread[-1] - ms) / sd\nxs, ys = spread[:-1], spread[1:]\nmx, my = sum(xs) / len(xs), sum(ys) / len(ys)\nrho = sum((a - mx) * (b - my) for a, b in zip(xs, ys)) / sum((a - mx) ** 2 for a in xs)\nhalf_life = -math.log(2) / math.log(rho)\n\nsinyal = "SHORT spread (jual B, beli A)" if z_last > 2 else ("LONG spread (beli B, jual A)" if z_last < -2 else "TUNGGU")\nprint(f"beta={beta:.2f} z_last={z_last:.2f} rho={rho:.2f} half_life={half_life:.2f} hari -> {sinyal}")`,
        checks: [
          { kind: "equal", task: "t1", name: "beta", value: 0.8462, tol: 0.01, label: "`beta` ≈ 0,85", msg: "Hedge ratio dari regresi log B ke log A (30 hari)." },
          { kind: "equal", task: "t2", name: "z_last", value: 2.14, tol: 0.05, label: "`z_last` ≈ 2,14", msg: "Spread hari terakhir 2,14 standar deviasi di atas rata-rata — di atas ambang entry 2." },
          { kind: "equal", task: "t2", name: "rho", value: 0.572, tol: 0.01, label: "`rho` ≈ 0,57", msg: "Koefisien AR(1) spread — di bawah 1, spread mean-reverting." },
          { kind: "equal", task: "t2", name: "half_life", value: 1.24, tol: 0.1, label: "`half_life` ≈ 1,24 hari", msg: "-ln(2)/ln(0,572) = 1,24 hari." },
          { kind: "stdout_matches", task: "t2", pattern: "z_last=2\\.14 rho=0\\.57 half_life=1\\.24 hari -> SHORT spread", label: "`print` menampilkan sinyal SHORT spread", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Beta 0,8462; z terakhir 2,14; rho 0,572; half-life 1,24 hari — SHORT spread, eksekusi hari ini.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: spread melebar ke 3,5 — tambah atau tutup?",
      prose: [
        "Kamu sudah short spread di z 2,14: jual B, beli A. Dua hari kemudian spread tidak merapat — ia melebar ke z 3,5. Posisi merugi. Godaannya adalah menambah posisi: spread makin jauh dari rata-rata, jadi makin pasti kembali, bukan? Itulah logika yang menghancurkan banyak trader pairs.",
        "Jawabannya: tutup posisi dan periksa berita. Z 3,5 melewati stop yang ditetapkan sebelumnya — dan stop ada untuk satu alasan: di atas 3,5, peluang regime break lebih besar daripada peluang mean reversion. Pemeriksaan berita menemukan penyebabnya: B baru saja mengumumkan akuisisi yang menaikkan valuasinya secara permanen. Spread yang lama sudah tidak punya rumah untuk kembali — ekuilibriumnya pindah.",
        "Pelajaran untuk riset alpha: pairs trading bukan sekadar statistik. Statistik berkata spread kembali; fundamental berkata ekuilibriumnya pindah. Trader yang hanya mendengar statistik akan menambah posisi sampai modalnya habis. Riset alpha yang baik menggabungkan keduanya: sinyal statistik untuk entry, dan pemeriksaan fundamental untuk membedakan mean reversion dari regime break.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Z 3,5 melewati stop: tutup posisi, periksa berita. Akuisisi B memindahkan ekuilibrium — spread lama tidak akan kembali. Menambah posisi di atas stop adalah mengubah mean reversion menjadi taruhan buta.",
      },
      reference: "Di atas z 3,5: tutup dan periksa berita. Mean reversion tanpa pemeriksaan fundamental adalah taruhan.",
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
        "Korelasi = bergerak bersama; cointegration = spread stasioner dan punya rumah untuk kembali.",
        "Engle-Granger: regresi log harga, lalu uji stasioneritas residu (AR(1) di bawah 1).",
        "Lab: beta 0,8462; z terakhir 2,14; rho 0,572; half-life 1,24 hari — SHORT spread.",
        "Entry di |z| di atas 2, exit di 0, stop di 3,5 — dan periksa berita saat stop tersentuh.",
        "Half-life pendek = eksekusi cepat dan biaya menentukan; regime break = ekuilibrium pindah, bukan spread yang terlambat kembali.",
      ],
      next: { label: "WQB33 — Eksekusi: VWAP, TWAP, Market Impact, dan Slippage", href: "/v2/learn/wqb33-eksekusi" },
      quiz: [
        {
          q: "Dua saham berkorelasi 0,95 selama setahun. Apakah mereka otomatis pasangan pairs trading yang baik?",
          options: [
            { text: "Ya — korelasi 0,95 sudah cukup", why: "Salah: korelasi tinggi bisa datang dari pasar yang sama-sama naik. Yang dibutuhkan adalah spread yang stasioner." },
            { text: "Tidak — butuh cointegration: spread-nya harus stasioner dan kembali ke rata-rata", why: "Tepat: korelasi menjawab apakah mereka bergerak bersama; cointegration menjawab apakah jarak mereka punya rumah untuk kembali.", correct: true },
            { text: "Ya — asal keduanya dari sektor yang sama", why: "Salah: sektor yang sama justru membuat korelasi tinggi tanpa menjamin cointegration." },
            { text: "Tidak — pairs trading tidak memakai korelasi sama sekali", why: "Salah: korelasi adalah titik awal pencarian pasangan — hanya saja ia bukan bukti yang cukup." },
          ],
        },
        {
          q: "Beta (hedge ratio) 0,8462 artinya apa dalam posisi pairs?",
          options: [
            { text: "Untuk setiap 1 lembar B, pegang 0,846 lembar A di sisi berlawanan", why: "Tepat: beta adalah rasio netral — posisi A menetralkan pergerakan pasar dari posisi B.", correct: true },
            { text: "Beli 0,846 lembar B untuk setiap lembar A", why: "Salah: kebalikannya — beta mengukur B terhadap A, dan posisi A adalah sisi penyeimbang." },
            { text: "Return B adalah 84,62 persen dari return A", why: "Salah: beta regresi log-harga bukan rasio return. Ia adalah hedge ratio, bukan perbandingan return." },
            { text: "Spread akan kembali dalam 0,846 hari", why: "Salah: 0,846 adalah beta, bukan half-life. Half-life dihitung dari rho, bukan dari beta." },
          ],
        },
        {
          q: "Z-score spread 2,14 dan half-life 1,24 hari. Apa sinyal dan implikasi eksekusinya?",
          options: [
            { text: "LONG spread, dan bisa ditunda minggu depan", why: "Salah: z positif berarti spread terlalu lebar — sinyalnya SHORT spread. Dan half-life 1,24 hari berarti tidak bisa ditunda." },
            { text: "SHORT spread (jual B, beli A), dieksekusi hari ini karena half-life hanya 1,24 hari", why: "Tepat: z di atas 2 memicu entry short spread; half-life pendek berarti peluangnya singkat.", correct: true },
            { text: "TUNGGU — z 2,14 belum melewati ambang", why: "Salah: ambang entry adalah 2. Z 2,14 sudah melewatinya." },
            { text: "SHORT spread, tetapi beli B dan jual A", why: "Salah: short spread berarti jual yang mahal (B) dan beli yang murah (A) — bukan sebaliknya." },
          ],
        },
        {
          q: "Spread melebar ke z 3,5 setelah kamu short di z 2,14. Apa tindakan yang benar?",
          options: [
            { text: "Tambah posisi — spread makin jauh berarti makin pasti kembali", why: "Salah: itulah logika yang menghancurkan trader pairs. Di atas 3,5, peluang regime break lebih besar dari mean reversion." },
            { text: "Tutup posisi dan periksa berita — stop tersentuh, ekuilibrium mungkin sudah pindah", why: "Tepat: stop ada untuk memisahkan mean reversion dari regime break. Berita (misal akuisisi) bisa memindahkan ekuilibrium permanen.", correct: true },
            { text: "Tunggu sampai z kembali ke 0 tanpa melakukan apa-apa", why: "Salah: menunggu tanpa stop berarti membiarkan kerugian membesar bila ternyata regime break." },
            { text: "Ganti beta dan hitung ulang spread", why: "Salah: mengganti beta di tengah posisi adalah mengubah definisi spread agar kerugian terlihat hilang." },
          ],
        },
        {
          q: "Koefisien AR(1) spread adalah 0,572. Apa artinya?",
          options: [
            { text: "Spread tidak mean-reverting — koefisien harus di atas 1", why: "Salah: kebalikannya — koefisien di bawah 1 berarti mean-reverting. Di atas 1 berarti meledak." },
            { text: "Spread mean-reverting: tiap hari ia menutup sebagian jaraknya ke rata-rata, dengan half-life 1,24 hari", why: "Tepat: rho 0,572 berarti 57,2 persen jarak kemarin terbawa ke hari ini — sisanya tertutup. Half-life = -ln(2)/ln(0,572).", correct: true },
            { text: "Spread stasioner tetapi tidak bisa ditradingkan", why: "Salah: spread yang mean-reverting dengan half-life terukur justru bisa ditradingkan — selama biaya lebih kecil dari keuntungannya." },
            { text: "Beta hedge ratio adalah 0,572", why: "Salah: 0,572 adalah rho AR(1), bukan beta. Beta di lab ini 0,8462." },
          ],
        },
      ],
    },
  ],
};

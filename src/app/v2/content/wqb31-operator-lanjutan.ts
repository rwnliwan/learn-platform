import type { V2Lesson } from "../lib/types";

export const wqb31: V2Lesson = {
  slug: "wqb31-operator-lanjutan",
  track: "WorldQuant Brain",
  module: "Menulis Alpha",
  title: "WQB31 — Operator Lanjutan FASTEXPR: Winsorize, Rank & Keluarga Vec",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Delapan operator, satu sinyal yang tidak bisa ditulis",
      prose: [
        "Kamu sudah menulis alpha dengan delapan operator inti (WQB10): rank, ts_mean, ts_std_dev, ts_delay, ts_corr, ts_decay_linear, ts_backfill, group_neutralize. Lalu datang ide yang tidak bisa ditulis dengan delapan itu: 'beri skor 1 untuk 20 persen saham dengan momentum tertinggi, 0 untuk sisanya — tetapi skornya dihitung di dalam tiap sektor, bukan di seluruh pasar.'",
        "Idemu butuh tiga hal yang tidak ada di kotak perkakasmu: memotong outlier sebelum meranking (winsorize), meranking di dalam kelompok (group_rank), dan meranking terhadap sejarah saham itu sendiri (ts_rank). Tanpa ketiganya, idemu hanya bisa ditulis dengan perkiraan kasar — dan perkiraan kasar adalah tempat overfitting bersembunyi.",
        "Lesson ini menambah lapis kedua kotak perkakas FASTEXPR: winsorize, ts_rank, group_rank, ts_sum, ts_max dan ts_min, ts_argmax, dan keluarga vec_*. Bukan hafalan daftar — tiap operator diajarkan lewat pertanyaan yang hanya bisa dijawab olehnya.",
      ],
      tasks: [],
      note: {
        title: "Prasyarat ringkas",
        body: "Delapan operator inti dari WQB10 dan keluarga vec_* dari WQB23 (vec_avg, vec_median). Lesson ini mengasumsikan kamu sudah bisa membaca ekspresi FASTEXPR dan menulis rank serta ts_mean tanpa melihat catatan.",
      },
      reference: "Lapis kedua FASTEXPR: potong outlier, rank di dalam grup, rank terhadap sejarah, agregat vektor.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menulis ekspresi yang memakai operator di luar delapan inti.",
        "(1) Menjelaskan winsorize dan kapan memotong outlier sebelum meranking;",
        "(2) Membedakan rank, ts_rank, dan group_rank — tiga arah ranking yang berbeda;",
        "(3) Memakai ts_sum, ts_max, ts_min, dan ts_argmax untuk membaca jendela waktu;",
        "(4) Memakai keluarga vec_* untuk merangkum banyak field menjadi satu sinyal.",
      ],
      tasks: [],
    },
    {
      id: "winsorize",
      eyebrow: "Langkah 3 · Konsep",
      title: "Winsorize: potong ekor sebelum ia berteriak",
      prose: [
        "Winsorize memotong nilai ekstrem ke batas yang ditentukan: nilai di bawah batas bawah diganti batas bawah, nilai di atas batas atas diganti batas atas. Beda dengan membuang outlier: data yang dipotong tetap ada — hanya suaranya dikecilkan. Satu saham dengan return 200 persen karena corporate action tidak lagi mendominasi ranking seluruh universe.",
        "Kapan memakainya: sebelum rank atau sebelum agregat yang sensitif terhadap outlier (ts_mean, ts_sum). Kapan TIDAK memakainya: bila outlier itu sendiri sinyalnya — mis. mendeteksi saham yang baru saja melonjak karena berita. Winsorize yang membabi buta memotong justru informasi yang kamu cari.",
        "Aturan praktis: potong pada persentil, bukan pada angka absolut. Batas 1 dan 99 persen lebih tahan terhadap perubahan regime daripada batas 'return di atas 50 persen'. Dan catat batasmu di catatan riset — dua peneliti dengan batas winsorize berbeda sedang menguji dua alpha yang berbeda, walau ekspresinya terlihat sama.",
      ],
      formula: String.raw`\text{winsorize}(x, lo, hi) = \min(\max(x, lo), hi)`,
      formulaNote: "x = nilai field; lo, hi = batas bawah dan atas (biasanya persentil 1 dan 99 dari universe hari itu). Nilai di luar batas diganti batasnya — tidak dibuang, hanya dijinakkan.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Winsorize dengan batas absolut ('potong return di atas 10 persen') lalu heran kenapa alpha mati saat volatilitas pasar naik. Batas absolut tidak mengikuti regime; batas persentil mengikuti. Bila pasarmu berubah, batasmu harus berubah bersamanya.",
      },
      reference: "Winsorize = potong ke batas, bukan buang. Batas persentil, bukan absolut.",
    },
    {
      id: "tiga-rank",
      eyebrow: "Langkah 4 · Konsep",
      title: "Tiga arah ranking: rank, ts_rank, group_rank",
      prose: [
        "Rank (WQB10) meranking lintas saham pada satu hari: saham mana yang momentumnya tertinggi HARI INI. Arahnya melintang — membandingkan saham dengan saham lain.",
        "Ts_rank meranking satu saham terhadap SEJARAHNYA sendiri: nilai hari ini berada di persentil berapa dari 20 hari terakhir saham yang sama. Arahnya memanjang — membandingkan hari ini dengan masa lalu. Pertanyaan yang dijawabnya: 'apakah saham ini sedang berada di titik ekstremnya sendiri?' Momentum yang memakai ts_rank mendeteksi breakout dari kebiasaan saham itu, bukan dari kebiasaan pasar.",
        "Group_rank meranking di DALAM kelompok: saham mana yang momentumnya tertinggi di dalam SEKTORNYA. Arahnya melintang tetapi terbatas — membandingkan saham dengan tetangga sekelompoknya. Pertanyaan yang dijawabnya: 'apakah saham ini pemimpin di sektornya, atau hanya sektornya yang sedang naik?' Tanpa group_rank, ranking lintas pasar sering hanya menemukan sektor yang sedang panas, bukan saham yang unggul.",
        "Ketiganya bisa dirangkai: winsorize dulu, lalu group_rank untuk pemimpin sektor, lalu ts_rank untuk memastikan pemimpin itu juga sedang di titik ekstrem sejarahnya. Rangkaian itu adalah satu kalimat riset yang utuh — dan tidak satu pun dari delapan operator inti bisa menuliskannya sendirian.",
      ],
      formula: String.raw`\text{ts\_rank}(x, d) = \frac{\text{posisi } x_t \text{ di antara } x_{t-d+1} \dots x_t}{d} \qquad \text{group\_rank}(x) = \text{rank } x \text{ di dalam grupnya}`,
      formulaNote: "ts_rank: posisi nilai hari ini di antara d hari terakhir saham yang sama, dibagi d — hasilnya 0 sampai 1. group_rank: rank nilai di dalam kelompoknya (mis. sektor) pada hari yang sama — hasilnya juga 0 sampai 1.",
      tasks: [],
      reference: "Rank = lintas saham hari ini. Ts_rank = saham vs sejarahnya. Group_rank = saham vs sektornya.",
    },
    {
      id: "jendela",
      eyebrow: "Langkah 5 · Konsep",
      title: "Membaca jendela: ts_sum, ts_max, ts_min, ts_argmax",
      prose: [
        "Ts_sum menjumlahkan d hari terakhir: berguna untuk akumulasi — mis. total volume 10 hari, atau total return seminggu. Beda dengan ts_mean: sum menjaga skala akumulasi, mean meratakannya. Bila pertanyaanmu 'berapa besar totalnya', pakai sum; bila 'berapa rata-ratanya', pakai mean.",
        "Ts_max dan ts_min mengambil nilai tertinggi dan terendah dalam jendela: berguna untuk jarak dari puncak (berapa jauh harga dari tertinggi 20 hari) dan untuk mendeteksi breakout (harga hari ini = ts_max 20 hari berarti menembus tertinggi sebulan).",
        "Ts_argmax menjawab pertanyaan yang berbeda: BUKAN 'berapa nilai tertingginya', melainkan 'KAPAN terjadinya' — posisinya di dalam jendela. Harga yang mencapai puncak 19 hari lalu adalah cerita yang berbeda dari harga yang mencapai puncak kemarin, walau ts_max-nya sama. Argmax mengubah 'berapa' menjadi 'kapan' — dan 'kapan' sering lebih informatif daripada 'berapa'.",
        "Keluarga vec_* (WQB23) merangkum banyak field menjadi satu: vec_avg mengambil rata-rata sejumlah field pada hari yang sama, vec_median mengambil mediannya, vec_sum menjumlahkannya. Gunanya: menggabungkan sinyal-sinyal sejenis (mis. 12 field sentimen berita) menjadi satu skor yang lebih tenang daripada field mana pun sendirian — diversifikasi di dalam satu ekspresi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai ts_max saat yang dibutuhkan ts_argmax. 'Harga tertinggi 20 hari adalah 100' tidak menjawab apakah puncak itu kemarin atau tiga minggu lalu — dan untuk sinyal breakout, perbedaan itu adalah seluruh sinyalnya.",
      },
      reference: "Ts_sum = total. Ts_max/min = berapa. Ts_argmax = kapan. Vec_* = rangkum banyak field jadi satu.",
    },
    {
      id: "lab-operator",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: tulis operator lanjutan dalam Python",
      prose: [
        "Deret uji (10 hari, satu saham): x = [12, 15, 11, 40, 13, 14, 18, 16, 19, 25]. Dua nilai ekstrem di dalamnya: 40 dan 11. Tugasmu: tulis lima fungsi dan hitung tujuh angka.",
        "Winsorize dengan batas 12 sampai 20: potong 11 menjadi 12 dan 40 menjadi 20, lalu jumlahkan hasilnya. Ts_sum dan ts_max dengan jendela 3: ambil nilai terakhirnya (tiga hari terakhir: 16, 19, 25). Ts_rank dengan jendela 5: persentil nilai terakhir (25) di antara lima hari terakhir (14, 18, 16, 19, 25). Ts_argmax dengan jendela 5: posisi nilai maksimum di dalam lima hari terakhir (0 sampai 4). Group_rank: di grup A [10, 30, 20], berapa rank 20 (posisi dibagi jumlah anggota). Vec_avg: rata-rata [1, 2, 3].",
        "Eksperimen setelah selesai: hitung ts_sum(3) TANPA winsorize, lalu DENGAN winsorize — selisihnya adalah suara outlier 40 di dalam agregat. Itulah alasan winsorize selalu didahulukan sebelum agregat.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `winsorize`, `ts_sum`, `ts_max`, `ts_rank`, `ts_argmax`, `group_rank`, `vec_avg`" },
        { id: "t2", text: "Hitung ketujuh angka dan cetak dalam satu baris" },
      ],
      expected: "winsor_sum=159 | ts_sum3_akhir=60 | ts_max3_akhir=25 | ts_rank5_akhir=1.0 | ts_argmax5=4 | gr_A_20=0.667 | vec_avg=2.0",
      note: {
        title: "Kunci hitungan",
        body: "Winsorize 12 sampai 20: [12, 15, 12, 20, 13, 14, 18, 16, 19, 20] — jumlah 159. Tiga hari terakhir 16 + 19 + 25 = 60; maksimumnya 25. Lima hari terakhir [14, 18, 16, 19, 25]: 25 adalah yang terbesar — ts_rank 5/5 = 1,0; posisinya indeks 4. Grup A [10, 20, 30]: 20 di posisi 2 dari 3 — 0,667. Vec_avg [1, 2, 3] = 2,0.",
      },
      hints: [
        "Winsorize: min(max(v, lo), hi) untuk tiap elemen.",
        "Ts_rank: hitung berapa nilai di jendela yang kurang dari atau sama dengan nilai terakhir, dibagi panjang jendela.",
        "Ts_argmax: indeks (0 sampai 4) nilai maksimum di dalam jendela — bukan nilai maksimumnya.",
        "Group_rank: posisi nilai setelah diurutkan, dibagi jumlah anggota grup.",
      ],
      code: {
        starter: `x = [12, 15, 11, 40, 13, 14, 18, 16, 19, 25]\n\n# TULIS KODEMU\ndef winsorize(v, lo, hi):\n    return\ndef ts_sum(v, d):\n    return\ndef ts_max(v, d):\n    return\ndef ts_rank(v, d):\n    return\ndef ts_argmax(v, d):\n    return\ndef group_rank(v, grup):\n    return\ndef vec_avg(v):\n    return\n\nws = sum(winsorize(x, 12, 20))\ns3 = ts_sum(x, 3)[-1]\nm3 = ts_max(x, 3)[-1]\nr5 = ts_rank(x, 5)[-1]\na5 = ts_argmax(x, 5)[-1]\ngr = group_rank(20, [10, 30, 20])\nva = vec_avg([1, 2, 3])\nprint(f"winsor_sum={ws} | ts_sum3_akhir={s3} | ts_max3_akhir={m3} | ts_rank5_akhir={r5:.1f} | ts_argmax5={a5} | gr_A_20={gr:.3f} | vec_avg={va:.1f}")`,
        lockLines: 1,
        solution: `x = [12, 15, 11, 40, 13, 14, 18, 16, 19, 25]\n\ndef winsorize(v, lo, hi):\n    return [min(max(i, lo), hi) for i in v]\ndef ts_sum(v, d):\n    return [sum(v[max(0, i-d+1):i+1]) for i in range(len(v))]\ndef ts_max(v, d):\n    return [max(v[max(0, i-d+1):i+1]) for i in range(len(v))]\ndef ts_rank(v, d):\n    out = []\n    for i in range(len(v)):\n        win = v[max(0, i-d+1):i+1]\n        out.append(sum(1 for j in win if j <= v[i]) / len(win))\n    return out\ndef ts_argmax(v, d):\n    out = []\n    for i in range(len(v)):\n        win = v[max(0, i-d+1):i+1]\n        out.append(win.index(max(win)))\n    return out\ndef group_rank(v, grup):\n    s = sorted(grup)\n    return (s.index(v) + 1) / len(s)\ndef vec_avg(v):\n    return sum(v) / len(v)\n\nws = sum(winsorize(x, 12, 20))\ns3 = ts_sum(x, 3)[-1]\nm3 = ts_max(x, 3)[-1]\nr5 = ts_rank(x, 5)[-1]\na5 = ts_argmax(x, 5)[-1]\ngr = group_rank(20, [10, 30, 20])\nva = vec_avg([1, 2, 3])\nprint(f"winsor_sum={ws} | ts_sum3_akhir={s3} | ts_max3_akhir={m3} | ts_rank5_akhir={r5:.1f} | ts_argmax5={a5} | gr_A_20={gr:.3f} | vec_avg={va:.1f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "ws", value: 159, tol: 0, label: "`ws` = 159", msg: "Winsorize 12..20: 11 menjadi 12, 40 menjadi 20; jumlah 159." },
          { kind: "equal", task: "t2", name: "s3", value: 60, tol: 0, label: "`s3` = 60", msg: "Tiga hari terakhir 16 + 19 + 25." },
          { kind: "equal", task: "t2", name: "m3", value: 25, tol: 0, label: "`m3` = 25", msg: "Maksimum tiga hari terakhir." },
          { kind: "equal", task: "t2", name: "r5", value: 1.0, tol: 0.001, label: "`r5` = 1,0", msg: "25 adalah nilai terbesar di lima hari terakhir." },
          { kind: "equal", task: "t2", name: "a5", value: 4, tol: 0, label: "`a5` = 4", msg: "Maksimum berada di indeks 4 dalam jendela 5 hari." },
          { kind: "equal", task: "t2", name: "gr", value: 0.667, tol: 0.001, label: "`gr` sekitar 0,667", msg: "20 di posisi 2 dari 3 di grup A." },
          { kind: "equal", task: "t2", name: "va", value: 2.0, tol: 0.001, label: "`va` = 2,0", msg: "Rata-rata [1, 2, 3]." },
        ],
      },
      reference: "Winsorize dulu, baru agregat. Rank punya tiga arah — pilih yang menjawab pertanyaanmu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Operator apa untuk pertanyaan apa",
      prose: [
        "Pertanyaan 'apakah saham ini ekstrem terhadap sejarahnya sendiri?' → ts_rank. 'Apakah saham ini pemimpin di sektornya?' → group_rank. 'Apakah saham ini ekstrem terhadap pasar hari ini?' → rank.",
        "Pertanyaan 'berapa total akumulasi 10 hari terakhir?' → ts_sum. 'Berapa tertinggi sebulan terakhir?' → ts_max. 'Kapan terakhir kali mencapai tertinggi itu?' → ts_argmax.",
        "Pertanyaan 'bagaimana merangkum 12 field sentimen menjadi satu skor?' → vec_avg atau vec_median. 'Bagaimana menjinakkan outlier sebelum ranking?' → winsorize — selalu SEBELUM rank atau agregat, tidak pernah sesudah.",
        "Aturan 10 detik: bila ekspresimu memakai rank atas data yang belum di-winsorize, tanyakan dulu 'saham ekstrem apa yang sedang mendominasi ranking ini?' Bila jawabannya satu saham dengan corporate action, winsorize dulu.",
      ],
      tasks: [],
      reference: "Ekstrem vs sejarah = ts_rank. Pemimpin sektor = group_rank. Kapan = ts_argmax. Rangkum field = vec_*.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: ranking yang dimenangkan satu saham",
      prose: [
        "Alpha memakai rank(ts_mean(volume, 20)) atas seluruh universe. Tiga bulan berjalan baik — lalu satu saham mengalami stock split dan volume hariannya melonjak 40 kali lipat selama seminggu. Alpha itu menempatkan saham tersebut di rank 1 setiap hari selama seminggu, menggeser seluruh portofolio ke satu taruhan.",
        "Pertanyaan: operator apa yang hilang, dan di mana ia dipasang?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Yang hilang: winsorize — dipasang SEBELUM rank, pada volume yang sudah dinormalisasi (mis. volume dibagi rata-rata volume saham itu sendiri), dengan batas persentil. Tanpa winsorize, satu corporate action mendominasi ranking lintas universe. Pelajaran yang lebih dalam: rank lintas pasar tanpa winsorize adalah ranking yang didikte oleh outlier terbesar hari itu — bukan oleh sinyalmu.",
      },
      reference: "Winsorize sebelum rank. Outlier mendikte ranking bila tidak dijinakkan dulu.",
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
        "Winsorize memotong nilai ekstrem ke batas persentil — dipasang SEBELUM rank atau agregat.",
        "Rank = lintas saham hari ini; ts_rank = saham vs sejarahnya; group_rank = saham vs sektornya.",
        "Ts_sum = total; ts_max/min = berapa; ts_argmax = kapan terjadinya.",
        "Keluarga vec_* merangkum banyak field menjadi satu skor yang lebih tenang.",
        "Lab: winsor_sum 159, ts_sum3 60, ts_max3 25, ts_rank5 1,0, ts_argmax5 4, group_rank 0,667, vec_avg 2,0.",
      ],
      quiz: [
        {
          q: "Deret [12, 15, 11, 40, 13] di-winsorize ke batas 12–20, lalu dijumlahkan. Hasilnya?",
          options: [
            { text: "91 (tanpa winsorize sama sekali)", why: "Salah: itu jumlah deret mentah. Winsorize memotong 11 menjadi 12 dan 40 menjadi 20." },
            { text: "92 (11 menjadi 12, 40 menjadi 20: 12+15+12+20+13)", why: "Salah: hitung lagi — 12+15=27, +12=39, +20=59, +13=72. Bukan 92." },
            { text: "72 (11 menjadi 12, 40 menjadi 20)", why: "Tepat: 12 + 15 + 12 + 20 + 13 = 72. Winsorize memotong, bukan membuang.", correct: true },
            { text: "111 (tanpa perubahan)", why: "Salah: tanpa winsorize jumlahnya 12+15+11+40+13 = 91, bukan 111." },
          ],
        },
        {
          q: "Kapan group_rank menjawab pertanyaan yang tidak bisa dijawab rank biasa?",
          options: [
            { text: "Saat ingin tahu saham tertinggi di seluruh pasar hari ini", why: "Salah: itu tepat pertanyaan rank biasa." },
            { text: "Saat ingin tahu pemimpin di dalam sektornya — bukan sekadar sektor yang sedang panas", why: "Tepat: group_rank membatasi perbandingan ke dalam kelompok; rank biasa bisa hanya menemukan sektor panas.", correct: true },
            { text: "Saat ingin tahu posisi saham terhadap sejarahnya sendiri", why: "Salah: itu pertanyaan ts_rank, bukan group_rank." },
            { text: "Saat ingin merangkum 12 field sentimen", why: "Salah: itu pekerjaan vec_avg/vec_median." },
          ],
        },
        {
          q: "Ts_max 20 hari = 100 untuk dua saham. Apa yang membedakan keduanya dan operator apa yang menunjukkannya?",
          options: [
            { text: "Tidak ada yang membedakan — nilainya sama", why: "Salah: nilai sama tidak berarti cerita sama. Kapan puncak itu terjadi bisa berbeda jauh." },
            { text: "Kapan puncak terjadi — ts_argmax", why: "Tepat: argmax mengubah 'berapa' menjadi 'kapan' — puncak kemarin vs tiga minggu lalu adalah dua sinyal berbeda.", correct: true },
            { text: "Volatilitasnya — ts_std_dev", why: "Salah: ts_std_dev mengukur sebaran, bukan posisi puncak di dalam jendela." },
            { text: "Rata-ratanya — ts_mean", why: "Salah: mean tidak menjawab kapan maksimum terjadi." },
          ],
        },
        {
          q: "Urutan yang benar saat memakai winsorize dan rank?",
          options: [
            { text: "Rank dulu, winsorize belakangan", why: "Salah: ranking yang sudah didikte outlier tidak bisa diperbaiki dengan memotong sesudahnya." },
            { text: "Winsorize dulu, baru rank — agar outlier tidak mendikte ranking", why: "Tepat: jinakkan dulu, baru bandingkan.", correct: true },
            { text: "Keduanya tidak boleh dipakai bersamaan", why: "Salah: keduanya justru dirancang untuk dirangkai — winsorize menyiapkan data untuk rank." },
            { text: "Urutan tidak penting — hasilnya sama", why: "Salah: rank atas data mentah vs rank atas data winsorize adalah dua ranking yang berbeda." },
          ],
        },
        {
          q: "Keluarga vec_* (vec_avg, vec_median) paling berguna untuk apa?",
          options: [
            { text: "Menghitung return harian satu saham", why: "Salah: itu pekerjaan operator deret waktu seperti ts_delay atau ts_mean." },
            { text: "Merangkum banyak field sejenis (mis. 12 field sentimen) menjadi satu skor yang lebih tenang", why: "Tepat: agregasi lintas field pada hari yang sama — diversifikasi di dalam satu ekspresi.", correct: true },
            { text: "Meranking saham di dalam sektornya", why: "Salah: itu group_rank." },
            { text: "Memotong outlier sebelum ranking", why: "Salah: itu winsorize." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

export const e35: V2Lesson = {
  slug: "e35-kebijakan-moneter",
  track: "Financial Markets",
  module: "Makro & Kebijakan",
  title: "E35 — Kebijakan Moneter dan Bank Sentral: Cara Suku Bunga Menggerakkan Pasar",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu kalimat gubernur, IHSG bergerak 2 persen dalam satu jam",
      prose: [
        "Rabu siang, gubernur bank sentral berkata dalam konferensi pers: 'Kami melihat ruang untuk pelonggaran lebih lanjut.' Satu kalimat. Dalam satu jam, IHSG naik 2 persen, yield obligasi 10 tahun turun 15 bps, dan rupiah menguat 0,8 persen. Tidak ada data baru, tidak ada perubahan suku bunga hari itu — hanya satu kalimat tentang masa depan.",
        "Inilah kekuatan kebijakan moneter modern: bukan suku bunga hari ini yang menggerakkan pasar, melainkan ekspektasi tentang suku bunga besok — dan bank sentral adalah pembentuk ekspektasi itu. Investor yang menunggu keputusan suku bunga resmi sudah terlambat; pasar bergerak saat ekspektasi berubah, dan ekspektasi berubah saat bank sentral berbicara.",
        "Lesson ini membangun topik yang hanya disinggung di E17 (bank sentral menaikkan bunga melawan inflasi, dalam konteks siklus) dan E12/E14 (suku bunga acuan sebagai angka). Yang belum pernah diajarkan: transmisi kebijakan, perangkat bank sentral, Taylor rule, dan forward guidance. Setelah lesson ini kamu bisa: (1) menjelaskan empat jalur transmisi kebijakan moneter; (2) menghitung suku bunga acuan dengan Taylor rule; (3) menjelaskan perangkat bank sentral — suku bunga, operasi pasar, giro wajib minimum; (4) membaca forward guidance dan dot plot; (5) menghitung efek pengganda uang.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "E17 menyebut bank sentral dua kali dalam konteks siklus bisnis (pengetatan melawan inflasi, yield 2Y vs 10Y) dan E12/E14 memakai suku bunga acuan sebagai angka dalam perhitungan. Tidak ada lesson yang menjelaskan transmisi kebijakan, perangkat bank sentral, Taylor rule, quantitative easing, atau forward guidance. Lesson ini membangun kerangka itu dari nol.",
      },
      reference: "Taylor rule: inflasi 3,5 persen, target 2,5 persen, output gap minus 1 persen → suku bunga acuan 5,0 persen. Pengganda uang 20x (GWM 5 persen).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca bank sentral seperti membaca laporan keuangan — dari angka dan kalimatnya.",
        "(1) Menjelaskan empat jalur transmisi kebijakan moneter ke pasar;",
        "(2) Menghitung suku bunga acuan dengan Taylor rule;",
        "(3) Menjelaskan perangkat: suku bunga kebijakan, operasi pasar terbuka, giro wajib minimum, fasilitas simpanan dan pinjaman;",
        "(4) Membaca forward guidance dan dot plot The Fed;",
        "(5) Menghitung pengganda uang dan jumlah uang beredar.",
      ],
      tasks: [],
    },
    {
      id: "transmisi",
      eyebrow: "Langkah 3 · Teori",
      title: "Transmisi: empat jalur dari suku bunga ke harga aset",
      prose: [
        "Bank sentral tidak mengendalikan harga saham atau yield obligasi secara langsung — ia mengendalikan suku bunga jangka pendek, dan pengaruhnya menjalar lewat empat jalur transmisi. Jalur suku bunga: suku bunga acuan naik → suku bunga kredit naik → investasi dan konsumsi turun → laba perusahaan tertekan → harga saham turun. Jalur ini paling lambat (6–18 bulan) tetapi paling kuat.",
        "Jalur ekspektasi: pasar bereaksi terhadap apa yang bank sentral AKAN lakukan, bukan yang sudah dilakukan. Inilah sebabnya satu kalimat gubernur bisa menggerakkan IHSG 2 persen: kalimat itu mengubah ekspektasi suku bunga 12 bulan ke depan, dan harga aset hari ini adalah nilai kini dari ekspektasi itu. Bank sentral modern mengelola ekspektasi sama seriusnya dengan mengelola suku bunga — ini yang disebut forward guidance.",
        "Jalur nilai tukar: suku bunga naik → imbal hasil aset domestik menarik → modal masuk → mata uang menguat → eksportir terpukul, importir diuntungkan, inflasi impor turun. Bagi Indonesia, jalur ini sangat penting: rupiah yang melemah 10 persen bisa menambah inflasi 0,5–1 poin lewat harga impor. Jalur kredit (bank lending channel): suku bunga naik → bank memperketat penyaluran kredit → perusahaan kecil yang bergantung pada bank terpukul lebih dulu dari perusahaan besar yang bisa menerbitkan obligasi.",
        "Keempat jalur bekerja bersamaan — dan kadang berlawanan arah. Suku bunga naik menekan saham lewat jalur suku bunga, tetapi menguatkan rupiah lewat jalur nilai tukar, yang menolong importir. Investor yang hanya melihat satu jalur akan salah membaca pasar. Aturan praktis: saat bank sentral menaikkan suku bunga, tanyakan empat hal — kredit mana yang mengering, ekspektasi apa yang berubah, mata uang ke mana, dan siapa yang paling bergantung pada bank.",
      ],
      tasks: [],
      note: {
        title: "Lag yang mematikan",
        body: "Kebijakan moneter bekerja dengan lag 6–18 bulan — seperti mengemudikan kapal dengan kemudi yang baru merespons setengah jam kemudian. Bank sentral yang menaikkan suku bunga terlalu lama karena 'inflasi masih tinggi' akan menemukan ekonominya sudah mendingin saat pengetatan itu akhirnya bekerja. Investor yang memahami lag ini bisa memposisikan diri sebelum pasar menyadarinya.",
      },
      reference: "Empat jalur: suku bunga, ekspektasi, nilai tukar, kredit. Lag transmisi 6–18 bulan.",
    },
    {
      id: "taylor-perangkat",
      eyebrow: "Langkah 4 · Teori",
      title: "Taylor rule dan perangkat bank sentral",
      prose: [
        "Taylor rule (1993) adalah rumus praktis untuk suku bunga acuan yang 'seharusnya': r = r* + inflasi + 0,5 × (inflasi − target inflasi) + 0,5 × (output gap). r* adalah suku bunga riil netral (biasanya sekitar 1,5 persen). Contoh cerita pembuka: inflasi 3,5 persen, target 2,5 persen, output gap minus 1 persen, r* 1,5 persen. Hitung: 1,5 + 3,5 + 0,5 × (3,5 − 2,5) + 0,5 × (−1) = 1,5 + 3,5 + 0,5 − 0,5 = 5,0 persen. Bila suku bunga aktual di bawah 5,0 persen, kebijakan itu longgar; di atasnya, ketat.",
        "Taylor rule bukan perintah — bank sentral tidak mengikutinya secara mekanis. Ia adalah benchmark: bila suku bunga aktual jauh dari Taylor rule, pasar bertanya kenapa. Selama 2021–2022, Taylor rule menyarankan suku bunga jauh lebih tinggi dari yang diterapkan The Fed — dan pasar memakai selisih itu untuk memprediksi pengetatan agresif yang akhirnya datang. Investor yang menghitung Taylor rule sendiri tidak pernah kaget oleh 'tiba-tiba' hawkish.",
        "Perangkat bank sentral ada empat. Suku bunga kebijakan (BI Rate, Fed Funds Rate): harga uang semalam antarbank — perangkat utama. Operasi pasar terbuka: bank sentral membeli atau menjual SBN untuk menambah atau mengurangi likuiditas — membeli SBN berarti mencetak likuiditas. Giro wajib minimum (GWM): persentase dana pihak ketiga yang wajib disimpan bank di bank sentral — menaikkan GWM mengunci likuiditas. Fasilitas simpanan dan pinjaman (standing facilities): lantai dan atap suku bunga — bank bisa menyimpan kelebihan dana di bank sentral (deposit facility) atau meminjam darurat (lending facility).",
        "Dua perangkat luar biasa lahir dari krisis. Quantitative easing (QE): bank sentral membeli obligasi jangka panjang dalam jumlah besar untuk menekan yield panjang saat suku bunga pendek sudah nol. Quantitative tightening (QT): kebalikannya — membiarkan obligasi jatuh tempo tanpa dibeli lagi. Dan pengganda uang: dengan GWM 5 persen, setiap Rp100 miliar uang primer bisa menjadi Rp2.000 miliar uang beredar (pengganda 1 dibagi 0,05 = 20). Menurunkan GWM dari 5 persen ke 4 persen menaikkan pengganda dari 20 ke 25 — likuiditas bertambah tanpa mencetak uang baru.",
      ],
      tasks: [],
      formula: String.raw`r = r^{*} + \pi + 0{,}5(\pi - \pi^{*}) + 0{,}5(y - y^{*}) \qquad m = \frac{1}{GWM}`,
      formulaNote: "r = suku bunga acuan; r* = suku bunga riil netral (1,5 persen); pi = inflasi (3,5 persen); pi* = target inflasi (2,5 persen); y − y* = output gap (minus 1 persen). Hasil: 5,0 persen. m = pengganda uang; GWM 5 persen → m = 20.",
      reference: "Taylor rule: 5,0 persen. Pengganda uang 20x (GWM 5 persen).",
    },
    {
      id: "lab-taylor",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin Taylor rule dan pengganda uang",
      prose: [
        "Lab ini membangun mesin kebijakan moneter: dari inflasi, target, output gap, dan GWM — hitung suku bunga Taylor rule, pengganda uang, dan jumlah uang beredar.",
        "Hitung dulu di kepala. Taylor: 1,5 + 3,5 + 0,5 × (3,5 − 2,5) + 0,5 × (−1) = 1,5 + 3,5 + 0,5 − 0,5 = 5,0 persen. Pengganda: 1 dibagi 0,05 = 20. Uang beredar: 100 × 20 = Rp2.000 triliun dari uang primer Rp100 triliun.",
        "Tugas lab: tulis fungsi yang menerima inflasi, target inflasi, output gap, suku bunga riil netral, GWM, dan uang primer — lalu mencetak suku bunga Taylor, pengganda, dan uang beredar. Tiga angka ini adalah bacaan pertama setiap kali bank sentral berbicara.",
        "Setelah lolos, coba eksperimen: naikkan inflasi menjadi 5,5 persen dan lihat Taylor rule melonjak ke 6,5 persen — lalu tanyakan: bila suku bunga aktual masih 5,0 persen, berapa lama pasar akan percaya bank sentral 'di belakang kurva'?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `taylor` (suku bunga acuan Taylor rule, persen)" },
        { id: "t2", text: "Hitung `pengganda` (1 dibagi GWM)" },
        { id: "t3", text: "Hitung `uang_beredar` (uang primer dikali pengganda)" },
      ],
      expected: "taylor=5.0\npengganda=20.0\nuang_beredar=2000.0",
      hints: [
        "Taylor = r_netral + inflasi + 0,5 x (inflasi - target) + 0,5 x output_gap.",
        "Pengganda = 1 / GWM.",
        "Uang beredar = uang primer x pengganda.",
      ],
      code: {
        starter: `# Ekonomi: inflasi 3,5%, target 2,5%, output gap -1%, r* 1,5%, GWM 5%, uang primer Rp100 T.\ninflasi = 3.5\ntarget = 2.5\ngap = -1.0\nr_netral = 1.5\ngwm = 0.05\nprimer = 100.0  # triliun rupiah\n\n# TULIS KODEMU: hitung taylor, pengganda, uang_beredar.\n# Cetak, per baris: taylor, pengganda, uang_beredar.\n\n`,
        lockLines: 7,
        solution: `# Ekonomi: inflasi 3,5%, target 2,5%, output gap -1%, r* 1,5%, GWM 5%, uang primer Rp100 T.\ninflasi = 3.5\ntarget = 2.5\ngap = -1.0\nr_netral = 1.5\ngwm = 0.05\nprimer = 100.0  # triliun rupiah\n\n\ntaylor = r_netral + inflasi + 0.5 * (inflasi - target) + 0.5 * gap\npengganda = 1 / gwm\nuang_beredar = primer * pengganda\nprint(f"taylor={taylor:.1f}")\nprint(f"pengganda={pengganda:.1f}")\nprint(f"uang_beredar={uang_beredar:.1f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "taylor", value: 5.0, tol: 0.01, label: "Taylor rule 5,0 persen", msg: "1,5 + 3,5 + 0,5 x 1,0 + 0,5 x (-1) = 5,0. Suku bunga aktual di bawah ini berarti kebijakan longgar." },
          { kind: "equal", task: "t2", name: "pengganda", value: 20.0, tol: 0.01, label: "Pengganda 20x", msg: "1 / 0,05 = 20. Setiap rupiah primer menjadi 20 rupiah beredar." },
          { kind: "equal", task: "t3", name: "uang_beredar", value: 2000.0, tol: 0.01, label: "Uang beredar Rp2.000 triliun", msg: "100 x 20 = 2.000. Turunkan GWM ke 4 persen dan pengganda menjadi 25." },
        ],
      },
      reference: "Taylor rule 5,0 persen; pengganda 20x; uang beredar Rp2.000 triliun.",
    },
    {
      id: "guidance-dotplot",
      eyebrow: "Langkah 6 · Teori",
      title: "Forward guidance dan dot plot: membaca pikiran bank sentral",
      prose: [
        "Forward guidance adalah janji bank sentral tentang suku bunga masa depan — dan janji itu sendiri adalah kebijakan. Bila The Fed berkata 'suku bunga akan tetap rendah sampai pengangguran di bawah 4 persen', pasar langsung menurunkan ekspektasi suku bunga 2 tahun ke depan, yield turun, saham naik — tanpa satu dolar pun dicetak. Guidance yang kredibel menggerakkan pasar lebih murah dari intervensi apa pun. Guidance yang tidak kredibel — janji yang dilanggar berulang kali — justru merusak: pasar berhenti mendengarkan, dan bank sentral kehilangan alat termurahnya.",
        "Dot plot The Fed adalah peta pikiran 19 anggota FOMC: tiap titik adalah prediksi satu anggota untuk suku bunga akhir tahun. Median dot plot adalah perkiraan konsensus pasar tentang jalur suku bunga. Investor membandingkan dot plot dengan harga futures Fed Funds: bila futures mengimplikasikan pemotongan lebih agresif dari dot plot, salah satu pihak akan salah — dan selisihnya adalah peluang trading.",
        "Di Indonesia, Bank Indonesia memakai BI Rate plus komunikasi yang sama: pernyataan 'ruang pelonggaran' dalam konferensi pers adalah forward guidance versi lokal. Investor rupiah wajib membaca dua hal: angka BI Rate hari ini, dan kata-kata tentang besok. Sejarah membuktikan kata-kata tentang besok lebih sering menggerakkan rupiah daripada angka hari ini.",
        "Satu peringatan: bank sentral bisa salah, dan sering salah. Proyeksi inflasi The Fed 2021 ('transitory') menjadi contoh klasik — pasar yang percaya penuh pada guidance itu membeli obligasi panjang di yield rendah dan menanggung kerugiannya saat pengetatan agresif datang. Aturan praktis: dengarkan bank sentral, tetapi verifikasi dengan data. Guidance adalah pendapat, bukan jaminan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira keputusan suku bunga hari ini adalah berita utama. Berita utama adalah PERUBAHAN ekspektasi: bila pasar sudah mengharapkan kenaikan 25 bps dan bank sentral menaikkan 25 bps, pasar hampir tidak bergerak. Yang menggerakkan pasar adalah kejutan — dan kejutan hidup di kalimat tentang masa depan, bukan di angka hari ini.",
      },
      reference: "Forward guidance menggerakkan pasar tanpa mencetak uang. Dot plot: median 19 anggota FOMC adalah konsensus jalur suku bunga.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: rapat FOMC — harga sudah bergerak sebelum pengumuman",
      prose: [
        "Pukul 01.00 WIB, FOMC mengumumkan kenaikan 25 bps — persis seperti ekspektasi pasar. Saham hampir tidak bergerak. Lalu ketua The Fed berkata dalam konferensi pers: 'Kami belum selesai — masih ada pekerjaan.' Dalam 30 menit, saham jatuh 1,5 persen dan yield 2 tahun naik 20 bps. Kenaikan 25 bps tidak menggerakkan apa pun; satu kalimat hawkish menggerakkan segalanya.",
        "Analis yang hanya membaca angka pengumuman akan menulis 'sesuai ekspektasi, pasar tenang' — dan salah. Analis yang menghitung Taylor rule tahu suku bunga 5,0 persen masih di bawah yang disarankan data inflasi — jadi kalimat hawkish itu konsisten dengan data. Dan analis yang membandingkan dot plot dengan futures tahu pasar sudah bertaruh pada pemotongan tahun depan — taruhan yang kini terancam.",
        "Keputusan: jangan trading pengumuman suku bunga — tradinglah PERUBAHAN ekspektasi. Sebelum rapat, hitung Taylor rule-mu sendiri, baca dot plot terakhir, dan catat posisi futures. Bila pengumuman dan konferensi pers tidak mengubah ketiganya, tidak ada trade. Bila salah satunya berubah, di situlah peluang — dan risikonya.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat analisis ini benar. Pertama, ekspektasi — bukan angka — yang diukur. Kedua, Taylor rule dipakai sebagai jangkar independen, bukan sekadar mengulang kata bank sentral. Ketiga, keputusan trading dikaitkan dengan perubahan ekspektasi yang terukur, bukan dengan perasaan terhadap berita.",
      },
      reference: "Kenaikan 25 bps sesuai ekspektasi: pasar diam. Kalimat hawkish: saham jatuh 1,5 persen dalam 30 menit.",
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
        "Taylor rule 5,0 persen; pengganda 20x; uang beredar Rp2.000 triliun.",
        "Empat jalur transmisi: suku bunga, ekspektasi, nilai tukar, kredit. Lag 6–18 bulan.",
        "Perangkat: suku bunga kebijakan, operasi pasar terbuka, GWM, fasilitas simpanan dan pinjaman.",
        "Forward guidance menggerakkan pasar tanpa mencetak uang; dot plot adalah median 19 anggota FOMC.",
        "Yang menggerakkan pasar adalah perubahan ekspektasi, bukan angka hari ini.",
      ],
      next: { label: "E36 — Private Equity dan Venture Capital: Siklus Dana, J-Curve, dan Dilusi", href: "/v2/learn/e36-pe-vc" },
      quiz: [
        {
          q: "Inflasi 3,5 persen, target 2,5 persen, output gap minus 1 persen, suku bunga riil netral 1,5 persen. Berapa suku bunga acuan menurut Taylor rule?",
          options: [
            { text: "5,0 persen", why: "Tepat: 1,5 + 3,5 + 0,5 × (3,5 − 2,5) + 0,5 × (−1) = 1,5 + 3,5 + 0,5 − 0,5 = 5,0.", correct: true },
            { text: "3,5 persen — sama dengan inflasi", why: "Salah: Taylor rule menambah suku bunga riil netral dan koreksi gap — bukan sekadar menyamakan dengan inflasi." },
            { text: "6,0 persen — inflasi ditambah target", why: "Salah: rumusnya memakai SELISIH inflasi terhadap target (dikalikan 0,5), bukan penjumlahan keduanya." },
            { text: "4,0 persen — netral dikurangi gap", why: "Salah: hitungan lengkapnya 1,5 + 3,5 + 0,5 − 0,5 = 5,0. Menghilangkan komponen inflasi adalah kesalahan." },
          ],
        },
        {
          q: "GWM 5 persen, uang primer Rp100 triliun. Berapa uang beredar maksimum menurut pengganda uang?",
          options: [
            { text: "Rp100 triliun — uang primer sama dengan uang beredar", why: "Salah: sistem perbankan melipatgandakan uang primer lewat pinjaman berantai. Pengganda 1 / 0,05 = 20." },
            { text: "Rp2.000 triliun", why: "Tepat: 100 × 20 = 2.000. Menurunkan GWM ke 4 persen menaikkan pengganda menjadi 25.", correct: true },
            { text: "Rp105 triliun — hanya bunga yang bertambah", why: "Salah: pengganda bekerja lewat penciptaan kredit berantai, bukan lewat bunga." },
            { text: "Rp500 triliun — pengganda adalah 1 dibagi GWM dalam persen", why: "Salah: GWM dipakai sebagai desimal (0,05), bukan persen (5). 1 / 5 = 0,2 adalah kesalahan satuan." },
          ],
        },
        {
          q: "Bank sentral menaikkan suku bunga 25 bps persis seperti ekspektasi pasar, lalu gubernur berkata 'kami belum selesai'. Apa yang paling mungkin terjadi?",
          options: [
            { text: "Pasar tidak bergerak — kenaikannya sudah sesuai ekspektasi", why: "Salah: angka pengumuman memang sesuai ekspektasi, tetapi kalimat hawkish MENGUBAH ekspektasi masa depan — dan itulah yang menggerakkan pasar." },
            { text: "Saham jatuh dan yield naik — ekspektasi suku bunga masa depan naik", why: "Tepat: kalimat itu menaikkan jalur suku bunga yang diharapkan; harga aset hari ini adalah nilai kini dari ekspektasi itu.", correct: true },
            { text: "Saham naik — kenaikan suku bunga selalu bagus untuk saham", why: "Salah: kenaikan suku bunga menekan saham lewat jalur suku bunga dan kredit. Tidak ada 'selalu bagus' di sini." },
            { text: "Rupiah melemah — suku bunga tinggi mengusir modal", why: "Salah: terbalik. Suku bunga lebih tinggi justru MENARIK modal masuk dan menguatkan mata uang lewat jalur nilai tukar." },
          ],
        },
        {
          q: "Jalur transmisi mana yang paling cepat menggerakkan harga aset setelah bank sentral berbicara?",
          options: [
            { text: "Jalur suku bunga — kredit langsung mengering", why: "Salah: jalur suku bunga butuh 6–18 bulan untuk bekerja penuh lewat investasi dan konsumsi." },
            { text: "Jalur ekspektasi — pasar langsung mengubah harga berdasarkan suku bunga masa depan yang diharapkan", why: "Tepat: harga aset adalah nilai kini dari ekspektasi; satu kalimat bisa menggerakkan pasar dalam hitungan menit.", correct: true },
            { text: "Jalur kredit — bank langsung menghentikan pinjaman", why: "Salah: bank memperketat secara bertahap, bukan seketika. Jalur ini bekerja dalam hitungan kuartal." },
            { text: "Jalur nilai tukar — mata uang bergerak paling lambat", why: "Salah: nilai tukar memang bergerak cepat, tetapi ia mengikuti perubahan ekspektasi suku bunga — bukan mendahuluinya." },
          ],
        },
        {
          q: "The Fed membeli obligasi jangka panjang dalam jumlah besar saat suku bunga pendek sudah nol. Apa nama kebijakan ini dan apa tujuannya?",
          options: [
            { text: "Quantitative tightening — mengurangi jumlah uang beredar", why: "Salah: itu kebalikannya. Membeli obligasi adalah pelonggaran (QE), bukan pengetatan (QT)." },
            { text: "Quantitative easing — menekan yield jangka panjang saat suku bunga pendek sudah tidak bisa turun lagi", why: "Tepat: QE bekerja di ujung panjang kurva ketika ujung pendek sudah di nol.", correct: true },
            { text: "Operasi pasar terbuka biasa — sama seperti hari normal", why: "Salah: operasi biasa mengelola likuiditas jangka pendek; QE adalah pembelian skala besar yang menargetkan yield jangka panjang." },
            { text: "Forward guidance — janji tanpa pembelian aset", why: "Salah: forward guidance adalah komunikasi, bukan pembelian. QE adalah pembelian aset nyata." },
          ],
        },
      ],
    },
  ],
};

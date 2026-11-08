import type { V2Lesson } from "../lib/types";

export const pmc16: V2Lesson = {
  slug: "pm-c16-goals-based-investing",
  track: "Portfolio Management",
  module: "Private Wealth",
  title: "C16 — Goals-Based Investing dan Behavioral Coaching: Portofolio per Tujuan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Portofolio 'optimal' yang dijual di titik terendah — karena tujuannya tidak pernah ditulis",
      prose: [
        "Ibu Ratna punya Rp1 miliar di portofolio 'optimal' mean-variance: Sharpe tertinggi, frontier efisien, semua metrik hijau. Maret 2020, pasar jatuh 30 persen. Portofolionya tinggal Rp700 juta. Ia panik — bukan karena angkanya, melainkan karena ia tidak tahu: apakah Rp700 juta ini masih cukup untuk kuliah anaknya tahun depan (Rp300 juta)? Apakah dana pensiunnya aman? Portofolio itu optimal secara matematis — tetapi tidak menjawab satu pun pertanyaan yang sebenarnya ia tanyakan. Ia menjual semuanya di titik terendah.",
        "Kesalahannya bukan pada optimisasi — melainkan pada pertanyaan yang dijawab. Mean-variance menjawab 'portofolio apa yang memberi return tertinggi per risiko?' — pertanyaan yang tidak pernah ditanyakan manusia sungguhan. Manusia bertanya: 'Apakah uang kuliah anak saya aman? Apakah saya bisa pensiun di 60 tahun? Apakah dana darurat saya cukup bila saya sakit?' Goals-based investing (GBI) membalik urutan: mulai dari tujuan, bangun sub-portofolio untuk tiap tujuan, dan ukur keberhasilan dari tercapai-tidaknya tujuan — bukan dari Sharpe ratio.",
        "Lesson ini membangun topik yang mendapat NOL hit di seluruh track Portfolio Management: 'goals-based', 'goal-based', dan 'bucket' tidak pernah muncul. PM-C6 membahas bias behavioral dan PM-C1 membahas IPS — tetapi tidak ada yang memecah portofolio menjadi sub-portofolio per tujuan atau mengajarkan behavioral coaching sebagai disiplin penasihat. Setelah lesson ini kamu bisa: (1) memecah kekayaan menjadi sub-portofolio per tujuan; (2) menghitung dana yang dibutuhkan tiap tujuan hari ini; (3) menetapkan alokasi dan risiko berbeda per tujuan; (4) menjelaskan mental accounting — kapan membantu, kapan merugikan; (5) melakukan behavioral coaching saat klien panik.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "PM-C6 membahas bias behavioral (loss aversion, overconfidence, herding) dan PM-C1 membahas IPS dengan tujuan umum. Grep menyeluruh: 'goals-based', 'goal-based', dan 'bucket' mendapat NOL hit di seluruh track Portfolio Management — tidak ada pemecahan portofolio per tujuan, tidak ada sub-portofolio, tidak ada behavioral coaching sebagai praktik penasihat. Lesson ini membangun ketiganya dari nol.",
      },
      reference: "Tujuan 1 (kuliah 5 tahun): PV Rp224,18 juta. Tujuan 2 (pensiun 20 tahun): PV Rp623,61 juta. Dana darurat: Rp100 juta. Total kebutuhan hari ini: Rp947,79 juta.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun portofolio yang menjawab pertanyaan manusia — bukan hanya persamaan matematika.",
        "(1) Memecah kekayaan menjadi sub-portofolio per tujuan;",
        "(2) Menghitung nilai kini yang dibutuhkan tiap tujuan;",
        "(3) Menetapkan alokasi dan risiko berbeda untuk tiap sub-portofolio;",
        "(4) Menjelaskan mental accounting — kapan membantu, kapan merugikan;",
        "(5) Melakukan behavioral coaching saat klien panik.",
      ],
      tasks: [],
    },
    {
      id: "sub-portofolio",
      eyebrow: "Langkah 3 · Teori",
      title: "Sub-portofolio: satu kekayaan, banyak tujuan",
      prose: [
        "Goals-based investing memecah kekayaan menjadi sub-portofolio — satu per tujuan — masing-masing dengan horizon, return yang dibutuhkan, dan risiko yang bisa ditanggung SENDIRI. Tiga tujuan Ibu Ratna: kuliah anak Rp300 juta dalam 5 tahun; pensiun Rp2.000 juta dalam 20 tahun; dana darurat Rp100 juta yang harus tersedia sekarang. Total kebutuhan nominal: Rp2.400 juta — tetapi kebutuhan HARI INI jauh lebih kecil, karena uang punya waktu untuk bertumbuh.",
        "Nilai kini tiap tujuan dihitung dengan mendiskonto: PV = FV dibagi (1+r)^n. Dengan return 6 persen: kuliah = 300 dibagi 1,06^5 = 300 dibagi 1,338226 = Rp224,18 juta. Pensiun = 2.000 dibagi 1,06^20 = 2.000 dibagi 3,207135 = Rp623,61 juta. Dana darurat = Rp100 juta (tidak didiskonto — dibutuhkan sekarang). Total kebutuhan hari ini: 224,18 + 623,61 + 100 = Rp947,79 juta. Ibu Ratna punya Rp1.000 juta — surplus Rp52,21 juta. Rencana ini BERHASIL — dan yang terpenting, Ibu Ratna bisa MELIHAT keberhasilannya per tujuan.",
        "Tiap sub-portofolio punya alokasi sendiri. Dana darurat (horizon 0): 100 persen deposito dan pasar uang — return rendah, risiko nol. Kuliah (horizon 5 tahun): 40 persen saham, 60 persen obligasi — moderat, dengan glidepath ke 100 persen obligasi di tahun ke-4. Pensiun (horizon 20 tahun): 80 persen saham, 20 persen obligasi — agresif, karena waktu menyerap volatilitas. Portofolio gabungannya terlihat seperti 60/40 biasa — tetapi maknanya berbeda: tiap rupiah punya pekerjaan dan tenggat yang jelas.",
        "Keberhasilan diukur per tujuan, bukan per portofolio. Bila saham jatuh 30 persen, sub-portofolio pensiun jatuh — tetapi sub-portofolio kuliah (yang sebagian besar obligasi) dan dana darurat tidak tersentuh. Ibu Ratna bisa melihat: 'Kuliah anak aman, dana darurat utuh, hanya pensiun yang terpukul — dan pensiun masih 20 tahun lagi.' Itulah yang mencegah penjualan panik: bukan nasihat 'tetap tenang', melainkan BUKTI bahwa tujuan terdekatnya aman.",
      ],
      tasks: [],
      formula: String.raw`PV = \frac{FV}{(1+r)^n} \qquad \text{Kebutuhan hari ini} = \sum PV_i`,
      formulaNote: "PV = nilai kini yang dibutuhkan; FV = kebutuhan masa depan; r = return 6 persen; n = tahun. Kuliah: 300/1,06^5 = 224,18. Pensiun: 2.000/1,06^20 = 623,61. Total: 947,79.",
      reference: "PV kuliah Rp224,18 juta; PV pensiun Rp623,61 juta; darurat Rp100 juta; total Rp947,79 juta; surplus Rp52,21 juta.",
    },
    {
      id: "mental-accounting",
      eyebrow: "Langkah 4 · Teori",
      title: "Mental accounting dan behavioral coaching",
      prose: [
        "Mental accounting (Thaler) adalah kecenderungan manusia mengelompokkan uang ke dalam 'akun' mental yang berbeda — uang gaji, uang bonus, uang warisan — dan memperlakukannya berbeda, meski uang itu fungible (satu rupiah sama dengan rupiah lain). Dalam teori keuangan klasik, ini bias yang harus dihapus. Dalam goals-based investing, ini FITUR yang dimanfaatkan: sub-portofolio per tujuan ADALAH mental accounting yang dilembagakan — dan ia bekerja karena sesuai dengan cara otak manusia benar-benar berpikir.",
        "Tetapi mental accounting juga bisa merugikan. Tiga jebakannya. Pertama, mengabaikan totalitas: klien yang 'aman' di tiap tujuan secara terpisah bisa over-allocated ke saham secara keseluruhan — karena tiap sub-portofolio terlihat moderat, tetapi gabungannya agresif. Penasihat harus memeriksa total portofolio, bukan hanya tiap bucket. Kedua, utang mahal sambil menabung: klien yang menyimpan dana darurat Rp100 juta sambil berutang kartu kredit 36 persen sedang membayar mahal untuk kenyamanan mental — solusinya: lunasi utang dulu, lalu bangun darurat. Ketiga, 'uang rumah' (house money): keuntungan dianggap 'uang gratis' yang boleh dipertaruhkan — padahal ia uang yang sama.",
        "Behavioral coaching adalah pekerjaan penasihat yang paling bernilai — dan paling sulit diukur. Vanguard menghitung 'advisor alpha' sekitar 3 persen per tahun — dan sebagian besar berasal dari behavioral coaching, bukan dari pemilihan saham. Tekniknya ada empat. Pertama, pre-commitment: tulis aturan SEBELUM krisis — 'bila pasar jatuh 20 persen, saya rebalance, bukan menjual' — dan tanda tangani. Kedua, reframing: tunjukkan tujuan per tujuan, bukan total portofolio — 'kuliah anak aman' lebih menenangkan dari 'portofolio turun 30 persen'. Ketiga, circuit breaker: jeda 48 jam sebelum keputusan jual besar — emosi memudar, korteks prefrontal kembali bekerja. Keempat, cerita masa depan: 'Bayangkan dirimu 10 tahun lagi — apakah ia berterima kasih karena kamu menjual di 2020, atau karena kamu bertahan?'",
        "Coaching yang gagal adalah coaching yang berdebat dengan angka saat klien panik. Otak yang panik tidak memproses angka — ia memproses ancaman. Penasihat yang berkata 'pasar selalu pulih, lihat data 100 tahun' sedang berbicara dengan bagian otak yang sedang tidak mendengarkan. Yang didengarkan adalah: 'Uang kuliah anakmu aman. Dana daruratmu utuh. Yang jatuh adalah bagian pensiun — dan pensiunmu 20 tahun lagi.' Konkret, per tujuan, dan benar — itulah coaching.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira goals-based investing berarti mengabaikan optimisasi. Sub-portofolio tetap dioptimasi (PM-D2) — tetapi optimisasi dilakukan PER TUJUAN, dengan horizon dan risiko tiap tujuan, bukan pada satu portofolio gabungan yang tujuannya tidak jelas.",
      },
      reference: "Advisor alpha sekitar 3 persen per tahun — sebagian besar dari behavioral coaching, bukan pemilihan saham.",
    },
    {
      id: "lab-tujuan",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin kebutuhan per tujuan",
      prose: [
        "Lab ini membangun mesin goals-based: dari tiga tujuan dengan nominal dan horizon berbeda — hitung nilai kini tiap tujuan dan total kebutuhan hari ini.",
        "Hitung dulu di kepala. Kuliah: 300 dibagi 1,06^5. 1,06^5 = 1,338226 → 300 dibagi 1,338226 = Rp224,18 juta. Pensiun: 2.000 dibagi 1,06^20. 1,06^20 = 3,207135 → 2.000 dibagi 3,207135 = Rp623,61 juta. Darurat: Rp100 juta. Total: 224,18 + 623,61 + 100 = Rp947,79 juta.",
        "Tugas lab: tulis fungsi yang menerima nominal dan horizon tiap tujuan plus return — lalu mencetak PV kuliah, PV pensiun, dan total kebutuhan. Tiga angka ini adalah jawaban atas pertanyaan 'berapa uang yang saya butuhkan HARI INI?'",
        "Setelah lolos, coba eksperimen: majukan pensiun menjadi 15 tahun dan lihat PV-nya naik menjadi Rp834,53 juta — total kebutuhan menjadi Rp1.158,71 juta, di atas kekayaan Rp1.000 juta. Lalu tanyakan: tuas mana yang kamu tarik — tunda pensiun, tambah tabungan, atau turunkan target?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pv_kuliah` (300 dibagi 1,06 pangkat 5)" },
        { id: "t2", text: "Hitung `pv_pensiun` (2000 dibagi 1,06 pangkat 20)" },
        { id: "t3", text: "Hitung `total` (pv_kuliah + pv_pensiun + darurat 100)" },
      ],
      expected: "pv_kuliah=224.18\npv_pensiun=623.61\ntotal=947.79",
      hints: [
        "PV = FV / (1 + r)^n.",
        "Kuliah: n=5. Pensiun: n=20. Return 6%.",
        "Total = pv_kuliah + pv_pensiun + 100.",
      ],
      code: {
        starter: `# Ibu Ratna: kuliah Rp300 jt (5 thn), pensiun Rp2.000 jt (20 thn), darurat Rp100 jt. Return 6%.\nkuliah = 300.0\nn_kuliah = 5\npensiun = 2000.0\nn_pensiun = 20\ndarurat = 100.0\nr = 0.06\n\n# TULIS KODEMU: hitung pv_kuliah, pv_pensiun, total.\n# Cetak, per baris: pv_kuliah, pv_pensiun, total.\n\n`,
        lockLines: 7,
        solution: `# Ibu Ratna: kuliah Rp300 jt (5 thn), pensiun Rp2.000 jt (20 thn), darurat Rp100 jt. Return 6%.\nkuliah = 300.0\nn_kuliah = 5\npensiun = 2000.0\nn_pensiun = 20\ndarurat = 100.0\nr = 0.06\n\n\npv_kuliah = kuliah / (1 + r) ** n_kuliah\npv_pensiun = pensiun / (1 + r) ** n_pensiun\ntotal = pv_kuliah + pv_pensiun + darurat\nprint(f"pv_kuliah={pv_kuliah:.2f}")\nprint(f"pv_pensiun={pv_pensiun:.2f}")\nprint(f"total={total:.2f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "pv_kuliah", value: 224.18, tol: 0.01, label: "PV kuliah Rp224,18 juta", msg: "300 / 1,338226 = 224,18. Lima tahun pertumbuhan mengurangi kebutuhan hari ini seperempatnya." },
          { kind: "equal", task: "t2", name: "pv_pensiun", value: 623.61, tol: 0.01, label: "PV pensiun Rp623,61 juta", msg: "2.000 / 3,207135 = 623,61. Dua puluh tahun pertumbuhan mengurangi kebutuhan hari ini dua pertiganya." },
          { kind: "equal", task: "t3", name: "total", value: 947.79, tol: 0.01, label: "Total kebutuhan Rp947,79 juta", msg: "224,18 + 623,61 + 100 = 947,79. Di bawah kekayaan Rp1.000 juta — surplus Rp52,21 juta." },
        ],
      },
      reference: "PV kuliah Rp224,18 juta; PV pensiun Rp623,61 juta; total Rp947,79 juta.",
    },
    {
      id: "praktik",
      eyebrow: "Langkah 6 · Teori",
      title: "Praktik: membangun dan merawat portofolio per tujuan",
      prose: [
        "Membangun portofolio goals-based punya lima langkah. Pertama, daftarkan SEMUA tujuan dengan nominal dan tanggal — termasuk yang 'nanti saja' seperti warisan dan wakaf; tujuan yang tidak ditulis tidak akan didanai. Kedua, urutkan berdasarkan prioritas dan keharusan: dana darurat dan kuliah anak adalah 'harus'; liburan mewah adalah 'ingin' — dan 'harus' didanai dulu. Ketiga, hitung PV tiap tujuan (lab di atas) dan bandingkan dengan kekayaan — bila total melebihi kekayaan, negosiasikan: tunda, kurangi, atau tambah tabungan. Keempat, tetapkan alokasi per sub-portofolio sesuai horizon. Kelima, tulis aturan rebalancing dan coaching (pre-commitment) untuk tiap sub-portofolio.",
        "Merawatnya berarti meninjau per tujuan, bukan per portofolio. Tinjauan tahunan menanyakan tiga hal per tujuan: apakah nominalnya masih sama (biaya kuliah naik 8 persen per tahun — lebih cepat dari inflasi umum)? Apakah tanggalnya masih sama (anak mempercepat kuliah 1 tahun)? Apakah dananya masih di jalur (Monte Carlo per tujuan, PM-C14)? Tujuan yang sudah tercapai 'dikunci' — dipindah ke aset bebas risiko — dan tidak lagi dipertaruhkan di pasar. Mengunci tujuan yang tercapai adalah disiplin yang paling sulit: ia berarti menolak return lebih tinggi demi kepastian yang sudah dimiliki.",
        "Satu peringatan terakhir: goals-based investing bukan alasan untuk mengabaikan pajak dan biaya. Sub-portofolio yang banyak berarti lebih banyak akun, lebih banyak transaksi, dan potensi pajak yang lebih besar. Konsolidasikan di mana mungkin — satu akun kena pajak bisa menampung beberapa sub-portofolio secara mental tanpa pemisahan fisik — dan selalu hitung biaya totalnya. Portofolio yang sempurna secara perilaku tetapi boros secara pajak tetap portofolio yang buruk.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membuat terlalu banyak tujuan — 12 bucket yang masing-masing terlalu kecil untuk dikelola. Tiga sampai lima tujuan sudah cukup: darurat, jangka menengah (kuliah/rumah), pensiun, dan satu 'ingin'. Lebih dari itu, pengelolaannya memakan waktu yang lebih berharga dari manfaatnya.",
      },
      reference: "Lima langkah: daftar, urutkan, hitung PV, alokasi per tujuan, tulis aturan. Kunci tujuan yang sudah tercapai.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: Ibu Ratna, Maret 2020 — dengan sub-portofolio",
      prose: [
        "Kali ini ceritanya berbeda. Ibu Ratna punya sub-portofolio: dana darurat Rp100 juta di deposito (utuh), kuliah Rp224 juta di 40 persen saham dan 60 persen obligasi (turun menjadi Rp205 juta — masih di jalur karena 5 tahun lagi dan obligasi menahan), pensiun Rp624 juta di 80 persen saham (turun menjadi Rp470 juta — terpukul, tetapi 20 tahun lagi). Totalnya Rp775 juta — turun dari Rp1.000 juta. Secara total, ia 'rugi' Rp225 juta. Secara tujuan, hanya pensiun yang terpukul.",
        "Penasihatnya tidak berkata 'tetap tenang'. Ia menunjukkan tiga baris: darurat utuh, kuliah di jalur, pensiun terpukul tetapi punya 20 tahun. Lalu ia mengajukan satu tindakan: rebalance sub-portofolio pensiun — jual obligasi, beli saham yang murah — karena aturan pre-commitment yang ditandatangani Ibu Ratna 2 tahun lalu memerintahkannya. Ibu Ratna setuju — karena ia melihat kuliah anaknya aman.",
        "Dua tahun kemudian, pensiun pulih ke Rp720 juta — di atas jalur. Ibu Ratna tidak pernah menjual di titik terendah — bukan karena ia pemberani, melainkan karena strukturnya membuatnya tidak perlu berani. Itulah janji goals-based investing: keberanian yang tidak bergantung pada karakter, melainkan pada struktur.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat respons ini benar. Pertama, kerugian ditunjukkan per tujuan — bukan sebagai satu angka yang menakutkan. Kedua, tindakan diambil dari aturan yang sudah ditandatangani (pre-commitment), bukan dari keberanian sesaat. Ketiga, struktur — bukan karakter — yang mencegah penjualan panik.",
      },
      reference: "Total turun ke Rp775 juta, tetapi kuliah di jalur dan darurat utuh. Rebalance pensiun sesuai pre-commitment; 2 tahun kemudian Rp720 juta.",
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
        "PV kuliah Rp224,18 juta; PV pensiun Rp623,61 juta; total Rp947,79 juta; surplus Rp52,21 juta.",
        "Tiap sub-portofolio punya horizon, alokasi, dan risiko sendiri.",
        "Mental accounting adalah fitur yang dimanfaatkan GBI — tetapi bisa merugikan bila totalitas diabaikan.",
        "Behavioral coaching: pre-commitment, reframing per tujuan, circuit breaker 48 jam, cerita masa depan.",
        "Keberhasilan diukur per tujuan tercapai — bukan dari Sharpe ratio.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Kuliah Rp300 juta (5 tahun), pensiun Rp2.000 juta (20 tahun), darurat Rp100 juta, return 6 persen. Berapa total kebutuhan hari ini?",
          options: [
            { text: "Rp2.400 juta — jumlah nominal semua tujuan", why: "Salah: itu jumlah nominal masa depan. Kebutuhan hari ini memakai nilai kini — uang punya waktu bertumbuh." },
            { text: "Rp947,79 juta", why: "Tepat: 224,18 + 623,61 + 100 = 947,79. Di bawah kekayaan Rp1.000 juta — rencana berhasil dengan surplus Rp52,21 juta.", correct: true },
            { text: "Rp847,79 juta — darurat tidak dihitung karena sudah tersedia", why: "Salah: darurat Rp100 juta adalah bagian dari kekayaan yang harus dicadangkan — ia dihitung, bukan diabaikan." },
            { text: "Rp1.000 juta — sama dengan kekayaan yang dimiliki", why: "Salah: kebutuhan hari ini dihitung dari tujuan, bukan dari kekayaan. Kebetulan dekat bukan berarti sama." },
          ],
        },
        {
          q: "Pasar jatuh 30 persen. Sub-portofolio pensiun (20 tahun lagi) terpukul, tetapi kuliah (5 tahun) dan darurat utuh. Apa respons coaching yang benar?",
          options: [
            { text: "Jual semuanya — total portofolio turun 30 persen berarti rencana gagal", why: "Salah: rencana tidak gagal — hanya satu tujuan yang terpukul, dan tujuan itu punya 20 tahun untuk pulih." },
            { text: "Tunjukkan per tujuan: kuliah aman, darurat utuh, pensiun punya 20 tahun — lalu rebalance sesuai pre-commitment", why: "Tepat: reframing per tujuan menenangkan; pre-commitment memberi tindakan. Itulah coaching, bukan sekadar 'tetap tenang'.", correct: true },
            { text: "Tunjukkan data 100 tahun bahwa pasar selalu pulih", why: "Salah: otak yang panik tidak memproses angka historis. Yang didengarkan adalah bukti konkret bahwa tujuan terdekatnya aman." },
            { text: "Pindahkan pensiun ke deposito agar tidak jatuh lagi", why: "Salah: memindahkan ke deposito setelah jatuh berarti mengunci kerugian dan kehilangan pemulihan. Rebalance membeli saham murah — bukan menjualnya." },
          ],
        },
        {
          q: "Klien menyimpan dana darurat Rp100 juta sambil berutang kartu kredit 36 persen. Apa masalah mental accounting di sini?",
          options: [
            { text: "Tidak ada masalah — dana darurat harus selalu dipertahankan", why: "Salah: ia membayar 36 persen untuk kenyamanan mental sementara tabungannya memberi 4 persen. Lunasi utang dulu, lalu bangun darurat." },
            { text: "Ia membayar mahal untuk kenyamanan mental — utang 36 persen harus dilunasi dulu sebelum menabung darurat penuh", why: "Tepat: uang itu fungible. Memegang kas sambil berutang mahal adalah mental accounting yang merugikan.", correct: true },
            { text: "Masalahnya adalah dana daruratnya terlalu kecil", why: "Salah: ukuran darurat bukan masalah di sini — masalahnya adalah kombinasi kas dan utang mahal secara bersamaan." },
            { text: "Kartu kredit harus dipakai lebih banyak agar skor kredit naik", why: "Salah: skor kredit bukan alasan membayar bunga 36 persen. Itu rasionalisasi, bukan strategi." },
          ],
        },
        {
          q: "Apa itu pre-commitment dalam behavioral coaching?",
          options: [
            { text: "Janji penasihat untuk selalu memberi return positif", why: "Salah: tidak ada penasihat yang bisa menjanjikan return. Pre-commitment adalah aturan yang ditulis klien untuk dirinya sendiri." },
            { text: "Aturan tertulis yang ditandatangani SEBELUM krisis — misalnya 'bila pasar jatuh 20 persen, saya rebalance, bukan menjual'", why: "Tepat: aturan dibuat saat tenang dan dijalankan saat panik — ketika otak rasional tidak lagi memegang kendali.", correct: true },
            { text: "Kontrak yang mengikat klien secara hukum untuk tidak menjual", why: "Salah: pre-commitment bukan kontrak hukum — ia komitmen psikologis. Kekuatannya dari penandatanganan dan pengingat, bukan dari pengadilan." },
            { text: "Janji untuk tidak pernah mengubah alokasi portofolio", why: "Salah: alokasi HARUS berubah (glidepath, rebalancing, life event). Pre-commitment mengatur BAGAIMANA berubah, bukan melarang perubahan." },
          ],
        },
        {
          q: "Tujuan kuliah sudah tercapai dan dananya cukup. Apa yang harus dilakukan terhadap sub-portofolio itu?",
          options: [
            { text: "Biarkan tetap di saham — siapa tahu bisa tumbuh lebih besar", why: "Salah: tujuan yang tercapai harus DIKUNCI ke aset bebas risiko. Mempertaruhkannya lagi berarti mempertaruhkan tujuan yang sudah pasti." },
            { text: "Kunci ke aset bebas risiko — menolak return lebih tinggi demi kepastian yang sudah dimiliki", why: "Tepat: disiplin tersulit dalam GBI. Tujuan yang tercapai bukan lagi investasi — ia kewajiban yang harus dibayar.", correct: true },
            { text: "Pindahkan ke sub-portofolio pensiun — biar tumbuh lebih lama", why: "Salah: memindahkan dana kuliah ke pensiun berarti kuliah tidak lagi didanai. Tiap tujuan punya dananya sendiri." },
            { text: "Belanjakan untuk liburan — tujuan sudah tercapai", why: "Salah: dana kuliah yang sudah tercapai adalah untuk kuliah — bukan untuk liburan. Itu tujuan lain yang butuh dananya sendiri." },
          ],
        },
      ],
    },
  ],
};

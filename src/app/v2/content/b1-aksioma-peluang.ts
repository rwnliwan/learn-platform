import type { V2Lesson } from "../lib/types";

export const b1: V2Lesson = {
  slug: "b1-aksioma-peluang",
  track: "Probabilitas",
  module: "Fondasi Peluang",
  title: "B1. Peluang: Tiga Aturan yang Mengatur Ketidakpastian",
  estMinutes: 55,
  steps: [
    {
      id: "ruang-sampel",
      eyebrow: "Langkah 1 · Ruang sampel",
      title: "Tulis panggungnya dulu",
      prose: [
        "Risk manager bank mengumumkan: \u201CPeluang gagal bayar portofolio kita 5%.\u201D Direksi mengangguk tenang. Tapi analis junior bertanya: \u201CArtinya dari 100 nasabah, pasti 5 yang gagal bayar?\u201D",
        "Jawabannya tidak. Peluang 5% bukan janji bahwa tepat 5 dari 100 akan gagal. Artinya: kalau pola yang sama diulang berkali-kali dalam kondisi sama, dalam jangka panjang sekitar 5% yang gagal \u2014 tapi 100 nasabah berikutnya bisa 2, bisa 9, bisa 0. Peluang mengatur ketidakpastian, bukan meramal satu kejadian.",
        "Sebelum menghitung peluang apa pun, tulis dulu ruang sampel `S` \u2014 himpunan semua hasil yang mungkin. Separuh kesalahan peluang berasal dari `S` yang salah didefinisikan. Untuk dua koin: S = {AA, AG, GA, GG}, bukan {0, 1, 2} angka, karena \u201Csatu angka\u201D dan \u201Cdua angka\u201D tidak equally likely.",
      ],
      formula: String.raw`P(A) = \frac{n(A)}{n(S)}`,
      formulaNote: "Peluang klasik: banyak hasil yang kamu minati dibagi banyak seluruh hasil, jika semua hasil equally likely.",
      tasks: [
        { id: "t1", text: "Tentukan `nA` = banyak sisi dadu yang lebih dari 4" },
        { id: "t2", text: "Hitung `p = nA / nS` lalu cetak dengan `print`" },
      ],
      expected: "p=0.3333",
      note: {
        title: "Sering salah",
        body: "Langsung menebak angka tanpa menulis S. Untuk dadu: S = {1,2,3,4,5,6}, jadi n(S) = 6, bukan angka yang kamu kira-kira.",
      },
      hints: [
        "Dadu punya 6 sisi: nS = 6.",
        "Sisi yang lebih dari 4 adalah {5, 6}, jadi nA = 2.",
        "p = nA / nS, lalu print(f\"p={p:.4f}\")",
      ],
      code: {
        starter: `nS = 6  # seluruh sisi dadu\n\n# TULIS KODEMU: banyak sisi dadu yang > 4, lalu peluangnya\nnA = \np = \n\nprint(f"p={p:.4f}")`,
        lockLines: 1,
        solution: `nS = 6  # seluruh sisi dadu\n\n# TULIS KODEMU: banyak sisi dadu yang > 4, lalu peluangnya\nnA = 2\np = nA / nS\n\nprint(f"p={p:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "nA", value: 2, tol: 1e-9, label: "`nA` seharusnya 2", msg: "Sisi dadu yang lebih dari 4 hanya 5 dan 6." },
          { kind: "equal", task: "t2", name: "p", value: 1 / 3, tol: 1e-3, label: "`p` seharusnya 1/3", msg: "p = nA / nS = 2/6." },
          { kind: "stdout_matches", task: "t2", pattern: "p=0\\.333", label: "`print` menampilkan peluang", msg: "Cetak dengan format p=... seperti contoh." },
        ],
      },
      reference: "P(A) = n(A)/n(S). Tulis S dulu sebelum menghitung.",
    },
    {
      id: "tiga-aksioma",
      eyebrow: "Langkah 2 · Aksioma Kolmogorov",
      title: "Tiga aturan yang tidak bisa dilanggar",
      prose: [
        "Tahun 1933, Andrey Kolmogorov merumuskan tiga aksioma. Semua aturan peluang \u2014 serumit apa pun \u2014 adalah konsekuensi dari tiga ini: sesuatu pasti terjadi (total peluang seluruh hasil = 1), peluang tidak pernah negatif, dan untuk kejadian yang saling lepas, peluang \u201Csalah satu terjadi\u201D = jumlah peluangnya.",
        "Aksioma ketiga adalah \u201Caturan tambah\u201D versi murni \u2014 hanya berlaku jika kejadiannya tidak tumpang tindih. Dadu muncul 1 atau 2: P = 1/6 + 1/6 = 1/3, karena \u201Cmuncul 1\u201D dan \u201Cmuncul 2\u201D tidak bisa terjadi bareng.",
        "Konsekuensi praktisnya: angka peluang selalu terbaca sebagai \u201Cdalam jangka panjang, terjadi sekian persen dari pengulangan\u201D. P = 0,05 berarti sekitar 5 dari 100 pengulangan \u2014 bukan janji untuk 100 berikutnya.",
      ],
      formula: String.raw`P(S) = 1 \qquad P(A) \geq 0 \qquad A \cap B = \emptyset \Rightarrow P(A \cup B) = P(A) + P(B)`,
      formulaNote: "\\cup = \u201Catau\u201D (gabungan), \\cap = \u201Cdan\u201D (irisan), \\emptyset = tidak ada hasil bersama.",
      tasks: [
        { id: "t1", text: "Jumlahkan semua peluang di `dist` menjadi `total`" },
        { id: "t2", text: "Cetak `total` dengan `print`" },
      ],
      expected: "total=1.0",
      note: {
        title: "Sering salah",
        body: "Hasil hitungan peluang 1,4 atau \u22120,2 lalu dianggap \u201Cya sudah\u201D. Aksioma 1+2 memaksa 0 \u2264 P(A) \u2264 1: kalau hitunganmu keluar dari rentang itu, hitungannya yang salah, bukan teorinya.",
      },
      hints: [
        "Jumlahkan semua nilai di dictionary dist.",
        "Fungsi bawaan sum() bekerja pada dist.values().",
        "total = sum(dist.values())",
      ],
      code: {
        starter: `dist = {"lancar": 0.90, "telat": 0.07, "gagal": 0.03}\n\n# TULIS KODEMU: total peluang seluruh hasil (aksioma 1)\ntotal = \n\nprint(f"total={total}")`,
        lockLines: 1,
        solution: `dist = {"lancar": 0.90, "telat": 0.07, "gagal": 0.03}\n\n# TULIS KODEMU: total peluang seluruh hasil (aksioma 1)\ntotal = sum(dist.values())\n\nprint(f"total={total}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: 1.0, tol: 1e-9, label: "`total` seharusnya 1.0", msg: "0,90 + 0,07 + 0,03 = 1,0. Itulah aksioma 1." },
          { kind: "stdout_matches", task: "t2", pattern: "total=1(\\.0)?", label: "`print` menampilkan total", msg: "Cetak dengan format total=... ." },
        ],
      },
      reference: "sum(dict.values()). Peluang valid selalu menjumlah ke 1.",
    },
    {
      id: "aturan-turunan",
      eyebrow: "Langkah 3 · Aturan turunan",
      title: "Komplemen, tambah, kali",
      prose: [
        "Tiga aturan yang kamu pakai tiap hari diturunkan dari aksioma. Komplemen: P(A tidak terjadi) = 1 \u2212 P(A) \u2014 dipakai saat menghitung langsung susah tapi kebalikannya gampang. Peluang minimal satu gagal dari 10 nasabah jauh lebih mudah via komplemen: 1 \u2212 P(tidak ada yang gagal).",
        "Penjumlahan umum: P(A atau B) = P(A) + P(B) \u2212 P(A dan B). Kalau asal tambah, irisan dihitung dua kali \u2014 harus dikurangi sekali. Contoh: peluang kartu merah atau king = 26/52 + 4/52 \u2212 2/52 = 28/52, karena 2 king merah terhitung ganda.",
        "Perkalian: P(A dan B) = P(A) \u00D7 P(B|A). Versi sederhananya, P(A) \u00D7 P(B), hanya berlaku jika A dan B independen. Contoh: peluang dua nasabah berturut-turut gagal (independen, PD 5%) = 0,05 \u00D7 0,05 = 0,0025 = 0,25%.",
      ],
      formula: String.raw`P(A^c) = 1 - P(A) \qquad P(A \cup B) = P(A) + P(B) - P(A \cap B) \qquad P(A \cap B) = P(A) \times P(B \mid A)`,
      formulaNote: "A^c = komplemen A, kejadian A tidak terjadi; ∪ = gabungan, atau; ∩ = irisan, dan; P(B|A) = peluang B setelah diketahui A terjadi. Rumus pertama: peluang kebalikan = 1 minus peluangnya — dipakai saat menghitung langsung susah tetapi kebalikannya gampang. Rumus kedua: peluang A atau B = jumlah keduanya minus irisannya, karena irisan terhitung dua kali. Rumus ketiga: peluang A dan B = peluang A dikali peluang B dengan syarat A sudah terjadi. Contoh angka dari lesson ini: kartu merah atau king = 26/52 + 4/52 − 2/52 = 28/52 ≈ 53,8% — angka ini artinya dari 52 kartu, 28 memenuhi kriteria; tanpa mengurangkan 2/52 (dua king merah yang terhitung ganda), hasilnya 30/52 yang salah. Dua nasabah gagal berurutan dengan PD 5% independen = 0,05 × 0,05 = 0,0025 = 0,25% — artinya dari 10.000 pasangan nasabah, sekitar 25 pasang gagal bersamaan; versi sederhananya P(A)×P(B) hanya sah jika independensi sudah diperiksa.",
      tasks: [
        { id: "t1", text: "Hitung `p_benar` = P(merah atau king) dengan rumus yang benar" },
        { id: "t2", text: "Hitung `p_salah` = hasil \u201Casal tambah\u201D lalu cetak keduanya" },
      ],
      expected: "benar=0.5385  salah=0.5769",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Selisih 28/52 vs 30/52 terlihat kecil, tapi di portofolio 10.000 nasabah kesalahan seperti ini berarti ratusan nasabah salah klasifikasi risiko.",
      },
      hints: [
        "Rumus benar: 26/52 + 4/52 - 2/52.",
        "\u201CAsal tambah\u201D: 26/52 + 4/52 tanpa dikurangi irisan.",
        "print(f\"benar={p_benar:.4f}  salah={p_salah:.4f}\")",
      ],
      code: {
        starter: `# 52 kartu: 26 merah, 4 king, 2 di antaranya king merah\n\n# TULIS KODEMU: P(merah atau king) yang benar vs asal tambah\np_benar = \np_salah = \n\nprint(f"benar={p_benar:.4f}  salah={p_salah:.4f}")`,
        lockLines: 1,
        solution: `# 52 kartu: 26 merah, 4 king, 2 di antaranya king merah\n\n# TULIS KODEMU: P(merah atau king) yang benar vs asal tambah\np_benar = 26/52 + 4/52 - 2/52\np_salah = 26/52 + 4/52\n\nprint(f"benar={p_benar:.4f}  salah={p_salah:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_benar", value: 28 / 52, tol: 1e-9, label: "`p_benar` seharusnya 28/52", msg: "26/52 + 4/52 \u2212 2/52. Irisannya (2 king merah) dikurangi sekali." },
          { kind: "equal", task: "t2", name: "p_salah", value: 30 / 52, tol: 1e-9, label: "`p_salah` seharusnya 30/52", msg: "\u201CAsal tambah\u201D = 26/52 + 4/52 tanpa pengurang." },
          { kind: "stdout_matches", task: "t2", pattern: "benar=0\\.5385\\s+salah=0\\.5769", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Atau -> tambah lalu kurangi irisan. Dan -> kali, cek independen dulu.",
    },
    {
      id: "lab-atau",
      eyebrow: "Langkah 4 · Lab simulasi",
      title: "Buktikan aturan \u201Catau\u201D dengan koin kartu",
      prose: [
        "Rumus bisa dihafal tanpa dipahami. Simulasi memaksa kamu melihatnya bekerja: tarik kartu acak berulang kali, hitung frekuensi \u201Cmerah atau king\u201D, lalu bandingkan dengan rumus benar (28/52) dan \u201Casal tambah\u201D (30/52).",
        "Gunakan `random.seed` agar hasilmu bisa direproduksi. Jumlah iterasi 5.000 cukup untuk melihat frekuensi menempel ke 0,538 \u2014 iterasi jauh lebih besar tidak perlu di browser.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan `N=5000` tarikan kartu acak" },
        { id: "t2", text: "Hitung `freq` = proporsi kartu merah atau king" },
        { id: "t3", text: "Cetak `freq` dengan 4 desimal" },
      ],
      expected: "freq=0.538x (mendekati 28/52)",
      note: {
        title: "Sering salah",
        body: "Membandingkan simulasi dengan angka yang salah (30/52). Simulasi menempel ke rumus yang benar, bukan ke tebakan \u201Casal tambah\u201D.",
      },
      hints: [
        "deck = [(w, a) for w in [0,1] for a in range(1,14)]: w=1 merah, a=13 king.",
        "Hitung yang memenuhi c[0]==1 or c[1]==13, bagi N.",
        "Gunakan random.choice(deck) di dalam loop.",
      ],
      code: {
        starter: `import random\nrandom.seed(7)\nN = 5000\ndeck = [(w, a) for w in [0,1] for a in range(1,14)]\n\n# TULIS KODEMU: hitung banyak kartu merah atau king, lalu frekuensinya\nkena = \nfreq = \n\nprint(f"freq={freq:.4f}")\nprint(f"rumus benar = {28/52:.4f}, asal tambah = {30/52:.4f}")`,
        lockLines: 3,
        solution: `import random\nrandom.seed(7)\nN = 5000\ndeck = [(w, a) for w in [0,1] for a in range(1,14)]\n\n# TULIS KODEMU: hitung banyak kartu merah atau king, lalu frekuensinya\nkena = sum(1 for _ in range(N) if (lambda c: c[0]==1 or c[1]==13)(random.choice(deck)))\nfreq = kena / N\n\nprint(f"freq={freq:.4f}")\nprint(f"rumus benar = {28/52:.4f}, asal tambah = {30/52:.4f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "kena", label: "`kena` terdefinisi", msg: "Hitung banyak kartu yang merah atau king." },
          { kind: "equal", task: "t2", name: "freq", value: 28 / 52, tol: 0.03, label: "`freq` mendekati 28/52", msg: "Dengan seed 7 dan N=5000, freq harus di sekitar 0,54." },
          { kind: "stdout_matches", task: "t3", pattern: "freq=0\\.5[0-9]", label: "`print` menampilkan frekuensi", msg: "Cetak dengan format freq=... ." },
        ],
      },
      reference: "random.choice(list), random.seed(angka). Simulasi kecil cukup.",
    },
    {
      id: "independen-lepas",
      eyebrow: "Langkah 5 · Independen vs saling lepas",
      title: "Dua konsep yang paling sering tertukar",
      prose: [
        "Dua kejadian independen jika terjadinya satu tidak mengubah peluang yang lain: P(B|A) = P(B). Koin kedua tidak peduli hasil koin pertama. Dua kejadian saling lepas jika tidak bisa terjadi bersama: P(A dan B) = 0. Dadu tidak bisa 1 dan 6 sekaligus.",
        "Justru kebalikannya dari yang sering dikira: jika A dan B saling lepas (dengan peluang positif), terjadinya A membuat B mustahil \u2014 sangat tidak independen. \u201CNasabah lancar\u201D vs \u201Cnasabah gagal\u201D saling lepas, dan jelas tidak independen.",
        "Satu jebakan lagi: gambler's fallacy. Koin yang 5x muncul angka tetap 50% untuk lemparan ke-6 jika tiap lemparan independen. Yang \u201Cjatuh tempo\u201D hanya berlaku jika ada mekanisme penghubung \u2014 misal pengambilan tanpa pengembalian, yang justru tidak independen.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di risiko kredit, default antar nasabah tidak independen saat krisis \u2014 gagal bayar bergerak bareng. Asumsi independen meremehkan risiko gabungan. Ini dibahas di B13 (Vasicek).",
      },
      quiz: [
        {
          q: "Dadu adil. A = \u201Cgenap\u201D, B = \u201C> 3\u201D. Apakah A dan B independen?",
          options: [
            { text: "Ya, karena tidak saling lepas", why: "Tidak saling lepas bukan syarat independen. Cek angkanya: P(A\u2229B) = 2/6 \u2248 0,333 \u2260 P(A)P(B) = 0,25." },
            { text: "Tidak independen, karena P(A\u2229B) \u2260 P(A)P(B)", why: "Tepat: 2/6 \u2260 0,25. Mengetahui B mengubah peluang A menjadi 2/3.", correct: true },
            { text: "Ya, saling lepas berarti independen", why: "Kebalikannya: saling lepas justru membuat dua kejadian sangat tidak independen." },
          ],
        },
        {
          q: "Koin adil 5x muncul angka beruntun. Peluang angka di lemparan ke-6?",
          options: [
            { text: "Lebih dari 50%, sudah jatuh tempo gambar", why: "Gambler's fallacy: koin tidak punya ingatan." },
            { text: "Tetap 50%", why: "Lemparan independen \u2014 sejarah tidak mengubah peluang.", correct: true },
            { text: "Kurang dari 50%, angka sedang \u201Choki\u201D", why: "Tidak ada mekanisme yang membuat angka \u201Choki\u201D berlanjut." },
          ],
        },
      ],
      reference: "Independen: P(B|A)=P(B). Saling lepas: P(A\u2229B)=0.",
    },
    {
      id: "minicase-994",
      eyebrow: "Langkah 6 · Mini-case",
      title: "\u201C99,4%\u201D yang mengejutkan direksi",
      prose: [
        "Portofolio 100 nasabah, masing-masing PD = 5%, asumsikan independen. Direksi: \u201CRisiko kita kecil, cuma 5%.\u201D Kamu menghitung: P(tidak ada yang gagal) = 0,95^100 \u2248 0,006, jadi P(minimal satu gagal) = 1 \u2212 0,006 = 99,4%.",
        "Ini bukan kontradiksi: 5% adalah peluang per nasabah, 99,4% adalah peluang minimal satu dari 100. Dengan 100 percobaan, hampir pasti ada yang gagal \u2014 itu konsekuensi aturan komplemen, bukan kenaikan risiko per nasabah. Ekspektasi jumlah gagal tetap 5 (ini dibahas di B5).",
        "Tapi awas asumsi independennya: dalam resesi, PHK massal membuat gagal bayar berkorelasi \u2014 peluang gabungannya lebih besar dari perkalian sederhana. Itulah mengapa B13 (Vasicek) ada: memodelkan korelasi default.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p_nol` = peluang tidak ada yang gagal dari 100 nasabah" },
        { id: "t2", text: "Hitung `p_min1` = peluang minimal satu gagal, cetak keduanya" },
      ],
      expected: "p_nol=0.0059  p_min1=0.9941",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Portofolio 100 nasabah dengan \u201Ccuma 5%\u201D hampir pasti menelan minimal satu gagal. Angka per nasabah tidak boleh dibaca sebagai angka portofolio.",
      },
      hints: [
        "P(tidak ada) = 0.95**100.",
        "P(minimal satu) = 1 - p_nol.",
        "print(f\"p_nol={p_nol:.4f}  p_min1={p_min1:.4f}\")",
      ],
      code: {
        starter: `pd = 0.05   # peluang gagal per nasabah\nn = 100     # banyak nasabah\n\n# TULIS KODEMU: komplemen untuk "minimal satu gagal"\np_nol = \np_min1 = \n\nprint(f"p_nol={p_nol:.4f}  p_min1={p_min1:.4f}")`,
        lockLines: 2,
        solution: `pd = 0.05   # peluang gagal per nasabah\nn = 100     # banyak nasabah\n\n# TULIS KODEMU: komplemen untuk "minimal satu gagal"\np_nol = (1 - pd) ** n\np_min1 = 1 - p_nol\n\nprint(f"p_nol={p_nol:.4f}  p_min1={p_min1:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_nol", value: 0.95 ** 100, tol: 1e-6, label: "`p_nol` seharusnya 0,95^100", msg: "P(tidak ada yang gagal) = 0,95 pangkat 100." },
          { kind: "equal", task: "t2", name: "p_min1", value: 1 - 0.95 ** 100, tol: 1e-6, label: "`p_min1` seharusnya \u2248 0,994", msg: "Komplemen: 1 \u2212 p_nol." },
          { kind: "stdout_matches", task: "t2", pattern: "p_nol=0\\.0059\\s+p_min1=0\\.9941", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "\u201CMinimal satu\u201D hampir selalu = 1 \u2212 P(nol). Satu suku mengalahkan seratus suku.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan \u2014 baca semuanya sebelum lanjut ke B2.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tiga pertanyaan sebelum menyentuh kalkulator",
        body: "Praktisi yang baik jarang salah hitung — mereka salah memilih hitungan. Sebelum menulis angka apa pun, tanyakan tiga hal. Pertama, apa ruang sampel S saya? Separuh error peluang berasal dari S yang salah ditetapkan: peluang kartu tanpa memastikan 52 kartu, atau peluang default tanpa mendefinisikan populasinya. Kedua, apakah saya menghitung yang susah padahal kebalikannya gampang? Peluang minimal satu gagal dari 200 nasabah hampir mustahil dihitung langsung, tetapi 1 minus peluang tidak ada yang gagal adalah satu baris. Komplemen adalah jalan pintas profesional, bukan trik ujian. Ketiga, untuk kata dan: apakah kedua kejadian ini benar-benar independen? Mengalikan P(A) dengan P(B) tanpa memeriksa independensi adalah kesalahan diam-diam paling mahal — ia menghasilkan angka yang terlihat presisi tetapi salah arah. Aturan praktisnya: tulis S dulu, cari komplemen dulu, curigai independensi dulu. Tiga kalimat ini menangkap sebagian besar jebakan sebelum mereka sempat menjadi keputusan. Untuk tiga kejadian atau lebih, inclusion-exclusion menjadi berlapis-lapis — di situlah komplemen atau simulasi biasanya menang atas ketelitian manual.",
      },
      summary: [
        "Tulis ruang sampel S dulu \u2014 separuh error berasal dari S yang salah.",
        "Tiga aksioma: total = 1, tak negatif, saling lepas boleh dijumlah.",
        "\u201CAtau\u201D \u2192 tambah lalu kurangi irisan; \u201Cdan\u201D \u2192 kali setelah cek independen; \u201Cminimal satu\u201D \u2192 komplemen.",
        "Independen \u2260 saling lepas \u2014 saling lepas justru pasti tidak independen.",
        "Peluang = frekuensi jangka panjang, bukan janji untuk kejadian berikutnya.",
      ],
      next: { label: "B2 \u2014 Kombinatorik", href: "/learn/b2-kombinatorik" },
      quiz: [
        {
          q: "Ruang sampel lempar dua koin yang benar adalah\u2026",
          options: [
            { text: "{AA, AG, GA, GG}", why: "Benar: 4 hasil equally likely.", correct: true },
            { text: "{0 angka, 1 angka, 2 angka}", why: "Salah: tidak equally likely \u2014 P(1 angka) = 1/2, bukan 1/3." },
            { text: "{AA, GG}", why: "Salah: melewatkan hasil campuran AG dan GA." },
            { text: "{angka, gambar}", why: "Salah: itu ruang sampel satu koin, bukan dua." },
          ],
        },
        {
          q: "P(merah atau king) dari 52 kartu = 28/52. Kesalahan \u201Casal tambah\u201D (30/52) terjadi karena\u2026",
          options: [
            { text: "King merah dihitung dua kali", why: "Benar: 2 king merah ada di kedua kejadian \u2014 irisan harus dikurangi sekali.", correct: true },
            { text: "Kartu merah terlalu banyak", why: "Salah: 26 kartu merah memang benar." },
            { text: "King bukan kartu", why: "Salah: king adalah 4 dari 52 kartu." },
            { text: "52 bukan ruang sampel", why: "Salah: 52 kartu adalah ruang sampel yang tepat." },
          ],
        },
        {
          q: "Mana pasangan yang SALING LEPAS tapi TIDAK independen?",
          options: [
            { text: "Koin pertama angka & koin kedua angka", why: "Salah: ini independen, bukan saling lepas." },
            { text: "Dadu 1 & dadu 6", why: "Saling lepas, benar sebagian \u2014 tapi opsi D lebih tepat karena peluangnya positif di kedua sisi." },
            { text: "Hujan hari ini & hujan besok", why: "Salah: tidak saling lepas dan tidak independen." },
            { text: "Lulus & tidak lulus ujian", why: "Benar: tidak bisa terjadi bersama (saling lepas), dan terjadinya satu membuat yang lain mustahil \u2014 sangat tidak independen.", correct: true },
          ],
        },
        {
          q: "10 nasabah independen, PD 5% tiap nasabah. P(tidak ada yang gagal) \u2248 60%. Maka P(minimal satu gagal) =\u2026",
          options: [
            { text: "5% \u00D7 10 = 50%", why: "Salah: mengalikan peluang bukan aturan komplemen." },
            { text: "1 \u2212 0,60 = 40%", why: "Benar: aturan komplemen \u2014 1 \u2212 P(tidak ada). Jauh lebih mudah dari menjumlah 10 suku.", correct: true },
            { text: "0,05^10", why: "Salah: itu peluang semuanya gagal, bukan minimal satu." },
            { text: "Tidak bisa dihitung", why: "Salah: bisa, dengan komplemen." },
          ],
        },
        {
          q: "Setelah 5x gagal beruntun, peluang berhasil berikutnya (independen, p=10%) adalah\u2026",
          options: [
            { text: "Lebih dari 10% \u2014 sudah jatuh tempo", why: "Salah: gambler's fallacy. Independen berarti sejarah tidak mengubah peluang." },
            { text: "Tetap 10%", why: "Benar: independen = sejarah tidak mengubah peluang.", correct: true },
            { text: "Kurang dari 10%", why: "Salah: tidak ada mekanisme yang menurunkan peluang." },
            { text: "50%", why: "Salah: angka 50% tidak punya dasar di sini." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

// Strip figure authored for the kit mockup (mean vs median, 9 dots + CEO outlier).
// Uses var(--chart-*) so it follows the active theme.
const STRIP_SVG = `<svg viewBox="0 0 480 132" role="img" aria-label="Sembilan titik di nilai 8 dan satu titik di 500. Garis median di 8, garis mean di 57,2.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="24" y1="104" x2="456" y2="104"/><line x1="24.0" y1="104" x2="24.0" y2="108"/><line x1="110.4" y1="104" x2="110.4" y2="108"/><line x1="196.8" y1="104" x2="196.8" y2="108"/><line x1="283.2" y1="104" x2="283.2" y2="108"/><line x1="369.6" y1="104" x2="369.6" y2="108"/><line x1="456.0" y1="104" x2="456.0" y2="108"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="24.0" y="122">0</text><text x="110.4" y="122">100</text><text x="196.8" y="122">200</text><text x="283.2" y="122">300</text><text x="369.6" y="122">400</text><text x="456.0" y="122">500</text></g>
<g fill="var(--text-muted)" opacity=".85"><circle cx="30.9" cy="98.0" r="4.2"/><circle cx="30.9" cy="88.8" r="4.2"/><circle cx="30.9" cy="79.6" r="4.2"/><circle cx="30.9" cy="70.4" r="4.2"/><circle cx="30.9" cy="61.2" r="4.2"/><circle cx="30.9" cy="52.0" r="4.2"/><circle cx="30.9" cy="42.8" r="4.2"/><circle cx="30.9" cy="33.6" r="4.2"/><circle cx="30.9" cy="24.4" r="4.2"/></g>
<circle cx="456" cy="98" r="4.6" fill="var(--text)"/>
<text x="450" y="84" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="500">CEO · 500</text>
<line x1="30.9" y1="10" x2="30.9" y2="104" stroke="var(--c1)" stroke-width="2"/>
<line x1="73.4" y1="10" x2="73.4" y2="104" stroke="var(--c4)" stroke-width="2"/>
<rect x="40" y="6" width="9" height="9" fill="var(--c1)"/><text x="54" y="15" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="500">median 8</text>
<rect x="84" y="26" width="9" height="9" fill="var(--c4)"/><text x="98" y="35" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="500">mean 57,2</text>
</svg>`;

export const a12: V2Lesson = {
  slug: "a12-pemusatan",
  track: "Statistika",
  module: "Deskriptif",
  title: "A1.2 Mean, median, modus",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "\u201cRata-rata 8 hari\u201d: RS yang terlihat buruk padahal efisien",
      prose: [
        "RS Harapan Bangsa diprotes media: rata-rata lama rawat inap (LOS) 8 hari \u2014 \u201ctidak efisien!\u201d. Datanya: 12 pasien pulang dalam 2 hari, 2 pasien 3 hari, dan 1 pasien komplikasi 90 hari. Mean = 8,0 hari.",
        "Mediannya? 2 hari \u2014 14 dari 15 pasien pulang dalam 3 hari atau kurang. Angka 8 hari benar secara matematis, tetapi menceritakan kisah yang salah: ia menggambarkan satu pasien komplikasi, bukan pasien tipikal. Twist lesson ini: satu angka ringkasan tanpa melihat distribusi adalah jebakan. Hari ini kamu belajar tiga ukuran pemusatan \u2014 dan kapan masing-masing berbohong.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mean` dari daftar `los`" },
        { id: "t2", text: "Hitung `median` dari daftar `los`" },
      ],
      expected: "mean=8.0  median=2",
      note: {
        title: "Sering salah",
        body: "Percaya satu angka ringkasan tanpa melihat distribusi. Mean 8 hari di sini tidak menggambarkan siapa pun: 14 pasien pulang dalam 3 hari atau kurang, satu pasien 90 hari. Selalu tanya dulu: distribusinya seperti apa?",
      },
      hints: [
        "Rata-rata = sum(data) / len(data).",
        "Median dari 15 data terurut = data ke-8.",
        "Gunakan statistics.median seperti di lesson ini.",
      ],
      code: {
        starter: `import statistics as st\n\nlos = [2]*12 + [3]*2 + [90]  # hari\n\n# TULIS KODEMU: mean dan median lama rawat inap\nmean = \nmedian = \n\nprint(f"mean={mean}  median={median}")`,
        lockLines: 3,
        solution: `import statistics as st\n\nlos = [2]*12 + [3]*2 + [90]  # hari\n\n# TULIS KODEMU: mean dan median lama rawat inap\nmean = sum(los) / len(los)\nmedian = st.median(los)\n\nprint(f"mean={mean}  median={median}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean", value: 8.0, tol: 1e-9, label: "`mean` seharusnya 8.0", msg: "(12x2 + 2x3 + 90)/15 = 8.0. Cek komposisi list-nya." },
          { kind: "equal", task: "t2", name: "median", value: 2, tol: 1e-9, label: "`median` seharusnya 2", msg: "15 data terurut: data ke-8 = 2. Mayoritas pasien pulang 2 hari." },
          { kind: "stdout_matches", task: "t2", pattern: "mean=8(\\.0)?\\s+median=2", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "st.median(list). Satu angka tanpa distribusi = jebakan.",
    },
    {
      id: "mean-dasar",
      eyebrow: "Langkah 2 · Mean",
      title: "Mean: rata-rata yang kamu kenal",
      prose: [
        "Kamu analis junior. Manajer bertanya: gaji tim kita berapa? Datanya: 8, 9, 10, 11, 12 (juta rupiah). Kamu tidak bisa menyebut lima angka sekaligus, jadi kamu butuh satu angka yang mewakili.",
        "Mean menjumlahkan semuanya lalu membagi dengan banyaknya data. Untuk data yang simetris dan tanpa outlier, mean adalah ringkasan yang jujur.",
      ],
      formula: String.raw`\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i`,
      formulaNote: "x-bar = rata-rata (mean); x_i = data ke-i; n = banyaknya data; jumlahkan semua nilai lalu bagi n.",
      tasks: [
        { id: "t1", text: "Hitung `mean` dari daftar `gaji`" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "mean=10.0",
      note: {
        title: "Sering salah",
        body: "Membagi dengan angka tebakan. Banyaknya data = len(gaji), bukan angka yang kamu kira-kira.",
      },
      hints: [
        "Jumlahkan semua elemen, lalu bagi dengan banyaknya data.",
        "Fungsi bawaan sum() dan len() bisa membantu.",
        "mean = sum(gaji) / len(gaji)",
      ],
      code: {
        starter: `gaji = [8, 9, 10, 11, 12]  # juta rupiah\n\n# TULIS KODEMU: hitung rata-rata gaji\nmean = \n\nprint(f"mean={mean}")`,
        lockLines: 1,
        solution: `gaji = [8, 9, 10, 11, 12]  # juta rupiah\n\n# TULIS KODEMU: hitung rata-rata gaji\nmean = sum(gaji) / len(gaji)\n\nprint(f"mean={mean}")`,
        checks: [
          { kind: "defined", task: "t1", name: "mean", label: "`mean` terdefinisi", msg: "Buat variabel bernama mean di kode editable." },
          { kind: "equal", task: "t1", name: "mean", value: 10, tol: 1e-9, label: "`mean` seharusnya 10", msg: "(8+9+10+11+12)/5 = 10. Cek pembaginya." },
          { kind: "stdout_matches", task: "t2", pattern: "mean=10", label: "`print` menampilkan mean", msg: "Cetak dengan format mean=... seperti contoh." },
        ],
      },
      reference: "sum(list), len(list). Mean = jumlah / banyak data.",
    },
    {
      id: "median-modus",
      eyebrow: "Langkah 3 · Median dan modus",
      title: "Median dan modus: kebal terhadap outlier",
      prose: [
        "Sekarang datanya: 8, 8, 9, 10, 100. Satu angka 100 ikut masuk, mungkin data direktur tercampur. Mean-nya melompat ke 27, padahal empat dari lima orang gajinya di bawah 11.",
        "Median mengurutkan data lalu mengambil yang di tengah: tetap 9, tidak peduli seberapa besar angka 100 itu. Modus mengambil nilai yang paling sering muncul: 8.",
        "Aturan praktis: data miring atau ada outlier, pakai median. Data kategori, pakai modus.",
        "Anggota keluarga robust yang ketiga: trimmed mean. Ia memotong p% data terkecil dan terbesar, lalu merata-ratakan sisanya \u2014 kompromi antara mean (memakai semua data) dan median (hampir membuang semuanya kecuali titik tengah). Trimmed mean 20% dari [8, 9, 10, 11, 100]: potong satu dari tiap ujung (20% x 5), lalu rata-ratakan [9, 10, 11] = 10. Hasilnya 10 \u2014 tidak setinggi mean 27,6 yang terseret outlier, tidak sekasar median yang hanya melihat satu titik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `median` dari `gaji2`" },
        { id: "t2", text: "Hitung `modus` dari `gaji2`" },
      ],
      expected: "median=9  modus=8",
      note: {
        title: "Sering salah",
        body: "Mengurutkan manual lalu salah ambil tengah. Untuk data ganjil, median = elemen ke-(n+1)/2 setelah diurutkan. Percayakan pada statistics.median.",
      },
      hints: [
        "Modul statistics sudah diimpor sebagai st.",
        "Modus = nilai dengan frekuensi tertinggi. Coba max(set(...), key=....count).",
        "median = st.median(gaji2)\nmodus = max(set(gaji2), key=gaji2.count)",
      ],
      code: {
        starter: `import statistics as st\n\ngaji2 = [8, 8, 9, 10, 100]  # juta rupiah\n\n# TULIS KODEMU: median dan modus\nmedian = \nmodus = \n\nprint(f"median={median}  modus={modus}")`,
        lockLines: 3,
        solution: `import statistics as st\n\ngaji2 = [8, 8, 9, 10, 100]  # juta rupiah\n\n# TULIS KODEMU: median dan modus\nmedian = st.median(gaji2)\nmodus = max(set(gaji2), key=gaji2.count)\n\nprint(f"median={median}  modus={modus}")`,
        checks: [
          { kind: "equal", task: "t1", name: "median", value: 9, tol: 1e-9, label: "`median` seharusnya 9", msg: "Data terurut: 8, 8, 9, 10, 100. Yang di tengah = 9." },
          { kind: "equal", task: "t2", name: "modus", value: 8, tol: 1e-9, label: "`modus` seharusnya 8", msg: "Nilai 8 muncul dua kali, sisanya sekali. Itu modusnya." },
          { kind: "stdout_matches", task: "t2", pattern: "median=9\\s+modus=8", label: "`print` menampilkan keduanya", msg: "Format: median=...  modus=... ." },
        ],
      },
      reference: "st.median(list). Modus = nilai tersering.",
    },
    {
      id: "outlier-ratio",
      eyebrow: "Langkah 4 · Satu outlier",
      title: "Satu outlier, dua angka yang bergerak berbeda",
      prose: [
        "Startup MajuTerus punya 10 karyawan: sembilan digaji Rp8 juta, satu orang (CEO) Rp500 juta. HRD melaporkan \u201Crata-rata gaji Rp57,2 juta\u201D. Angkanya benar, tetapi tidak mewakili siapa pun.",
        "Median hanya peduli urutan, jadi ia tetap di Rp8 juta. Rasio `mean / median` adalah cara cepat mengukur seberapa jauh outlier menarik mean.",
      ],
      formula: String.raw`\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i`,
      formulaNote: "Rumus sama dengan mean dasar: x-bar = jumlah/n. Di sini ia sengaja diulang untuk menunjukkan seberapa jauh satu outlier (CEO Rp500 juta) menarik mean menjauh dari median.",
      figure: {
        svg: STRIP_SVG,
        alt: "Sembilan titik di nilai 8 dan satu titik di 500. Garis median di 8, garis mean di 57,2.",
        caption: "Sembilan titik menumpuk di 8, satu titik di 500. Mean tertarik ke ekor; median tidak.",
      },
      tasks: [
        { id: "t1", text: "Tambahkan gaji CEO (500) ke daftar `gaji`" },
        { id: "t2", text: "Hitung `ratio = mean / median`, dibulatkan 1 desimal" },
        { id: "t3", text: "Cetak mean, median, dan ratio dengan `print`" },
      ],
      expected: "mean=57.2  median=8.0  ratio=7.2",
      note: {
        title: "Sering salah",
        body: "Membulatkan di tengah jalan. Hitung rasio dari mean dan median asli, lalu bulatkan hasilnya satu kali.",
      },
      hints: [
        "Rasio dihitung dari dua variabel yang sudah ada.",
        "Gunakan fungsi bawaan round() untuk membulatkan.",
        "ratio = round(mean / median, 1)",
      ],
      code: {
        starter: `import statistics as st\n\ngaji = [8, 8, 8, 8, 8, 8, 8, 8, 8]   # juta rupiah\ngaji.append(500)                     # gaji CEO\n\nmean   = st.mean(gaji)\nmedian = st.median(gaji)\n\n# TULIS KODEMU: rasio mean terhadap median, bulatkan 1 desimal\nratio = \n\nprint(f"mean={mean:.1f}  median={median:.1f}  ratio={ratio}")`,
        lockLines: 8,
        solution: `import statistics as st\n\ngaji = [8, 8, 8, 8, 8, 8, 8, 8, 8]   # juta rupiah\ngaji.append(500)                     # gaji CEO\n\nmean   = st.mean(gaji)\nmedian = st.median(gaji)\n\n# TULIS KODEMU: rasio mean terhadap median, bulatkan 1 desimal\nratio = round(mean / median, 1)\n\nprint(f"mean={mean:.1f}  median={median:.1f}  ratio={ratio}")`,
        checks: [
          { kind: "contains", task: "t1", name: "gaji", value: 500, label: "`gaji` berisi 500", msg: "Tambahkan 500 ke daftar dengan gaji.append(500)." },
          { kind: "equal", task: "t2", name: "ratio", value: 7.2, tol: 1e-9, label: "`ratio` seharusnya 7.2", msg: "Soal meminta satu desimal. Lihat fungsi round(angka, 1)." },
          { kind: "stdout_matches", task: "t3", pattern: "mean=57\\.2\\s+median=8\\.0\\s+ratio=7\\.2", label: "`print` menampilkan tiga angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "st.mean, st.median, round(angka, 1).",
    },
    {
      id: "minicase-risiko",
      eyebrow: "Langkah 5 · Mini-case risiko",
      title: "Rata-rata 9 hari yang menenangkan, dan menipu",
      prose: [
        "Kamu analis risiko di fintech. Dashboard menampilkan \u201CRata-rata keterlambatan bayar: 9 hari\u201D. Direksi tenang-tenang saja.",
        "Kamu tarik distribusinya: 80 nasabah membayar 1\u20135 hari (pakai 3), 9 nasabah 20\u201340 hari (pakai 30), dan 1 nasabah macet 300 hari. Mean 9 hari tertarik oleh satu nasabah macet itu.",
        "Median-nya 3 hari: itulah nasabah tipikal. Satu angka tidak cukup. Laporkan mean dan median bersamaan, dan waspadai ekornya.",
      ],
      tasks: [
        { id: "t1", text: "Bangun daftar `dpd` lalu hitung `mean`" },
        { id: "t2", text: "Hitung `median` dari `dpd`" },
      ],
      expected: "mean=9.0  median=3",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dalam risiko kredit, ekor kanan distribusi adalah potensi loss besar. Mean yang tertarik ekor bisa menyembunyikan konsentrasi risiko dari direksi.",
      },
      hints: [
        "Bangun list dengan perkalian: [3]*80.",
        "statistics.mean dan statistics.median.",
        "dpd = [3]*80 + [30]*9 + [300]",
      ],
      code: {
        starter: `import statistics as st\n\n# 80 nasabah x 3 hari, 9 x 30 hari, 1 x 300 hari\ndpd = \nmean = \nmedian = \n\nprint(f"mean={mean}  median={median}")`,
        lockLines: 1,
        solution: `import statistics as st\n\n# 80 nasabah x 3 hari, 9 x 30 hari, 1 x 300 hari\ndpd = [3]*80 + [30]*9 + [300]\nmean = st.mean(dpd)\nmedian = st.median(dpd)\n\nprint(f"mean={mean}  median={median}")`,
        checks: [
          { kind: "defined", task: "t1", name: "dpd", label: "`dpd` terdefinisi", msg: "Buat list dpd berisi 90 angka." },
          { kind: "equal", task: "t1", name: "mean", value: 9.0, tol: 1e-9, label: "`mean` seharusnya 9.0", msg: "(80x3 + 9x30 + 300)/90 = 9.0. Cek komposisi list-nya." },
          { kind: "equal", task: "t2", name: "median", value: 3, tol: 1e-9, label: "`median` seharusnya 3", msg: "90 data: median = rata-rata data ke-45 dan ke-46, keduanya 3." },
          { kind: "stdout_matches", task: "t2", pattern: "mean=9(\\.0)?\\s+median=3", label: "`print` menampilkan keduanya", msg: "Format: mean=...  median=... ." },
        ],
      },
      reference: "List bisa digabung dengan +. st.mean, st.median.",
    },
    {
      id: "geometric-weighted",
      eyebrow: "Langkah 6 · Kawan-kawan",
      title: "Geometric dan weighted mean: rata-rata untuk kasus khusus",
      prose: [
        "Return investasi bersifat perkalian, bukan penjumlahan. Rata-rata aritmatika melebih-lebihkan hasilnya.",
        "Contoh: return +10%, -5%, +20%. Mean aritmatika = 8,3%. Geometric mean = 7,8% — itulah angka yang benar secara finansial.",
        "Untuk data berbobot, pakai weighted mean. Portofolio 60% saham (return 12%) dan 40% obligasi (return 5%): 0,6 x 12 + 0,4 x 5 = 9,2%.",
        "Dan untuk laju atau kecepatan, ada harmonic mean: n dibagi jumlah kebalikan tiap nilai. Pergi 60 km/jam, pulang 40 km/jam — mean aritmatikanya 50, tetapi kecepatan rata-rata yang sebenarnya 48 km/jam: 2 / (1/60 + 1/40) = 48. Memakai mean biasa untuk laju sama berbahayanya dengan memakai mean aritmatika untuk return: ia melebih-lebihkan hasilmu secara sistematis.",
      ],
      formula: String.raw`G = \sqrt[n]{x_1 \times x_2 \times \cdots \times x_n} - 1 \qquad \bar{x}_w = \sum w_i x_i`,
      formulaNote: "G = geometric mean (untuk return yang bersifat perkalian, dikurangi 1 agar menjadi laju); x_i = tiap observasi (harus positif); x-bar_w = weighted mean; w_i = bobot tiap observasi (jumlah bobot = 1).",
      tasks: [
        { id: "t1", text: "Hitung `gmean` (desimal, bukan persen) dari `rets`" },
        { id: "t2", text: "Hitung `wmean` portofolio" },
      ],
      expected: "gmean=0.078  wmean=9.2",
      note: {
        title: "Sering salah",
        body: "Memakai mean aritmatika untuk return. (10 - 5 + 20)/3 = 8,3% terlihat benar, tetapi salah secara finansial. Uangmu tumbuh secara perkalian.",
      },
      hints: [
        "Kalikan semua faktor, pangkatkan 1/3, kurangi 1.",
        "Weighted mean = jumlah dari (bobot x nilai).",
        "gmean = (rets[0]*rets[1]*rets[2])**(1/3) - 1",
      ],
      code: {
        starter: `rets = [1.10, 0.95, 1.20]  # faktor pengali\n\nw_saham, r_saham = 0.6, 12\nw_oblig, r_oblig = 0.4, 5\n\n# TULIS KODEMU\ngmean = \nwmean = \n\nprint(f"gmean={gmean:.3f}  wmean={wmean}")`,
        lockLines: 4,
        solution: `rets = [1.10, 0.95, 1.20]  # faktor pengali\n\nw_saham, r_saham = 0.6, 12\nw_oblig, r_oblig = 0.4, 5\n\n# TULIS KODEMU\ngmean = (rets[0]*rets[1]*rets[2])**(1/3) - 1\nwmean = w_saham*r_saham + w_oblig*r_oblig\n\nprint(f"gmean={gmean:.3f}  wmean={wmean}")`,
        checks: [
          { kind: "equal", task: "t1", name: "gmean", value: 0.0784, tol: 0.002, label: "`gmean` sekitar 0.078", msg: "(1.10 x 0.95 x 1.20)^(1/3) - 1. Jangan lupa kurangi 1 di akhir." },
          { kind: "equal", task: "t2", name: "wmean", value: 9.2, tol: 1e-9, label: "`wmean` seharusnya 9.2", msg: "0.6 x 12 + 0.4 x 5 = 9.2." },
          { kind: "stdout_matches", task: "t2", pattern: "gmean=0\\.078\\s+wmean=9\\.2", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Pangkat pecahan: x**(1/3). Bobot biasanya dijumlahkan = 1.",
    },
    {
      id: "kapan-mean-tepat",
      eyebrow: "Langkah 7 · Kapan mean tepat",
      title: "Membela mean: empat situasi di mana mean adalah pilihan benar",
      prose: [
        "Lesson ini banyak memperingatkan soal mean — tetapi mean bukan musuh. Mean adalah alat yang tepat dalam empat situasi, dan analis senior tahu kapan membelanya. Pertama, data simetris unimodal: saat mean, median, dan modus hampir sama, mean justru paling informatif karena memakai semua data. Contoh (ilustratif): skor ujian 48, 49, 50, 51, 52 — mean 50, median 50, keduanya sama. Cek cepatnya: kalau mean dan median berdekatan, mean aman dipakai.",
        "Kedua, keputusan berbasis expected value. Harga, cadangan, dan expected loss adalah nilai harapan — dan nilai harapan secara definisi adalah mean. Peluang macet 2 persen dikali loss Rp50 juta sama dengan expected loss Rp1 juta: 0,02 × 50.000.000 = 1.000.000. Di sini median tidak berguna: median skenario macet atau tidak adalah nol, tetapi bank tetap harus mencadangkan Rp1 juta per debitur. Expected loss yang dihitung dari median adalah cadangan yang salah harga.",
        "Ketiga, agregasi linear atau aditif yang butuh total. Pendapatan total, biaya total, dan total eksposur adalah mean dikali banyaknya data — hanya mean yang bisa dikalikan kembali menjadi total. Kalau direksi bertanya berapa total pendapatan 1.000 nasabah, median tidak bisa menjawab; mean bisa, karena total = mean × n. Keempat, inferensi statistik yang butuh mean: Central Limit Theorem, confidence interval, dan uji hipotesis dibangun di atas mean sampel — median tidak punya mesin inferensi semudah itu.",
        "Uji lakmusnya satu kalimat: tanyakan apa yang akan dilakukan dengan angka itu. Kalau dipakai untuk menggambarkan orang tipikal di data miring — pakai median. Kalau dipakai untuk mengalikan menjadi total, mencadangkan expected loss, atau masuk ke rumus statistik — mean adalah jawabannya, dan memaksakan median justru salah.",
      ],
      formula: String.raw`E[L] = p \times L = 0{,}02 \times \text{Rp }50.000.000 = \text{Rp }1.000.000`,
      formulaNote: "E[L] = expected loss; p = 0,02 = peluang macet 2 persen; L = Rp50 juta = loss jika macet; 0,02 × 50.000.000 = 1.000.000 = cadangan per debitur.",
      tasks: [
        { id: "t1", text: "Hitung `mean` skor simetris [48, 49, 50, 51, 52]" },
        { id: "t2", text: "Hitung `median` skor yang sama" },
        { id: "t3", text: "Hitung `expected_loss` = peluang macet 2% × loss Rp50 juta" },
      ],
      expected: "mean=50.0  median=50  expected_loss=1000000.0",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "CKPN dan expected loss adalah mean, bukan median: cadangan = PD × LGD × EAD dirata-rata atas portofolio. Analis yang mengganti mean dengan median karena trauma outlier akan membuat bank kekurangan cadangan tepat saat ekor kanan datang.",
      },
      hints: [
        "Mean = sum(skor) / len(skor); median = st.median(skor).",
        "expected_loss = 0.02 * 50_000_000.",
        "Bandingkan mean dan median: keduanya 50 — data simetris.",
      ],
      code: {
        starter: `import statistics as st\n\nskor = [48, 49, 50, 51, 52]  # simetris, tanpa outlier (ilustratif)\n\np_macat = 0.02          # peluang macet 2%\nloss = 50_000_000       # Rp, loss jika macet\n\n# TULIS KODEMU\nmean = \nmedian = \nexpected_loss = \n\nprint(f"mean={mean}  median={median}  expected_loss={expected_loss}")`,
        lockLines: 6,
        solution: `import statistics as st\n\nskor = [48, 49, 50, 51, 52]  # simetris, tanpa outlier (ilustratif)\n\np_macat = 0.02          # peluang macet 2%\nloss = 50_000_000       # Rp, loss jika macet\n\n# TULIS KODEMU\nmean = sum(skor) / len(skor)\nmedian = st.median(skor)\nexpected_loss = p_macat * loss\n\nprint(f"mean={mean}  median={median}  expected_loss={expected_loss}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean", value: 50, tol: 1e-9, label: "`mean` seharusnya 50", msg: "(48+49+50+51+52)/5 = 50." },
          { kind: "equal", task: "t2", name: "median", value: 50, tol: 1e-9, label: "`median` seharusnya 50", msg: "Data simetris: nilai tengah = 50." },
          { kind: "equal", task: "t3", name: "expected_loss", value: 1000000, tol: 1e-9, label: "`expected_loss` seharusnya 1000000", msg: "0,02 × 50.000.000 = 1.000.000." },
          { kind: "stdout_matches", task: "t3", pattern: "mean=50\\.0\\s+median=50\\s+expected_loss=1000000\\.0", label: "`print` menampilkan ketiganya", msg: "Format: mean=...  median=...  expected_loss=... ." },
        ],
      },
      quiz: [
        {
          q: "Data simetris unimodal, mean 50 dan median 50. Mana yang dipakai?",
          options: [
            { text: "Median — mean selalu dilarang", why: "Tidak ada larangan umum atas mean; di data simetris mean justru memakai semua informasi." },
            { text: "Mean — karena data simetris, mean ≈ median dan mean memakai semua data", why: "Saat ketiganya hampir sama, mean adalah ringkasan yang jujur dan paling informatif.", correct: true },
            { text: "Modus saja", why: "Modus untuk kategori; di data kontinu simetris ia membuang informasi." },
            { text: "Tidak satu pun — laporkan semua data mentah", why: "Ringkasan tetap dibutuhkan; data mentah bukan pengganti ringkasan." },
          ],
        },
        {
          q: "Peluang macet 2% × loss Rp50 juta = expected loss Rp1 juta. Kenapa median tidak bisa menggantikan mean di sini?",
          options: [
            { text: "Karena median skenario macet/tidak adalah 0 — cadangan Rp0 berarti bank tidak mencadangkan apa-apa", why: "Expected loss adalah nilai harapan (mean); median skenario biner tidak mengandung informasi peluang.", correct: true },
            { text: "Karena median lebih besar dari mean", why: "Di sini median 0, lebih kecil — dan justru itu masalahnya." },
            { text: "Karena median tidak bisa dihitung untuk data biner", why: "Median bisa dihitung; masalahnya maknanya, bukan hitungannya." },
            { text: "Karena regulator melarang median", why: "Regulator tidak melarang median — yang salah adalah memakai ukuran yang tidak sesuai keputusan." },
          ],
        },
        {
          q: "Direksi bertanya berapa total pendapatan 1.000 nasabah. Ukuran pemusatan mana yang bisa menjawab?",
          options: [
            { text: "Median — kalikan median dengan 1.000", why: "Median × n bukan total; hanya mean × n = total." },
            { text: "Mean — total = mean × n, hanya mean yang bisa dikalikan kembali menjadi total", why: "Agregasi aditif butuh mean; inilah situasi ketiga di mana mean benar.", correct: true },
            { text: "Modus — kalikan modus dengan 1.000", why: "Modus × n juga bukan total." },
            { text: "Tidak ada — total tidak bisa diturunkan dari ringkasan", why: "Total justru bisa diturunkan dari mean — itulah keunggulan mean." },
          ],
        },
      ],
      reference: "Data simetris → mean. Expected value, total, dan inferensi → mean. Tipikal di data miring → median.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Mean untuk data simetris; median untuk data miring atau ber-outlier; modus untuk kategori.",
        "Outlier menarik mean tetapi tidak menggeser median.",
        "Return investasi selalu pakai geometric mean, bukan aritmatika.",
        "Kecepatan rata-rata pakai harmonic mean; data berbobot pakai weighted mean.",
        "Selalu laporkan pemusatan bersama sebaran. Mean tanpa SD hanya setengah cerita.",
      ],
      next: { label: "A1.3 — Ukuran Sebaran", href: "/learn/a13-sebaran" },
      quiz: [
        {
          q: "Data: 5, 5, 5, 5, 100. Mana yang paling mewakili \u201Ctipikal\u201D?",
          options: [
            { text: "Mean = 24", why: "Benar secara aritmetika, tetapi tidak mewakili siapa pun." },
            { text: "Median = 5", why: "Median kebal outlier, tetapi opsi D lebih lengkap." },
            { text: "Modus = 5", why: "Modus tepat untuk kategori; di sini opsi D lebih lengkap." },
            { text: "B dan C benar", why: "Median dan modus = 5 jauh lebih representatif daripada mean 24.", correct: true },
          ],
        },
        {
          q: "Investasi naik 100% tahun pertama, turun 50% tahun kedua. Rata-rata return tahunan yang benar?",
          options: [
            { text: "25%", why: "Itu mean aritmatika, salah total untuk return." },
            { text: "0%", why: "Rp100 menjadi Rp200 lalu kembali Rp100. Geometric mean = 0%.", correct: true },
            { text: "50%", why: "Tidak ada dasarnya." },
          ],
        },
        {
          q: "Kapan median lebih tepat daripada mean?",
          options: [
            { text: "Data simetris tanpa outlier", why: "Di situ mean justru lebih informatif." },
            { text: "Data miring atau ada outlier", why: "Median robust; mean tertarik ekor.", correct: true },
            { text: "Data nominal", why: "Untuk nominal pakai modus." },
          ],
        },
        {
          q: "Trimmed mean 20% dari [8, 9, 10, 11, 100]?",
          options: [
            { text: "10", why: "Potong 8 dan 100, rata-rata [9, 10, 11] = 10.", correct: true },
            { text: "27,6", why: "Itu mean biasa, justru yang ingin dihindari." },
            { text: "9", why: "Itu bukan hasil pemotongan yang benar." },
          ],
        },
      ],
      note: {
        title: "Intuisi: rata-rata adalah titik impas, bukan titik tipikal",
        body: "Lima heuristik. Satu: mean adalah titik impas — total kelebihan sama dengan total kekurangan; ia “adil”, bukan “mewakili”; jangan tanya “berapa tipikalnya” lalu menjawab dengan mean. Dua: rasio mean terhadap median adalah detektor outlier 10 detik — jauh dari 1 berarti ada yang menarik; dekat 1 berarti aman. Tiga: untuk data perkalian seperti return, mean aritmatika berbohong secara sistematis — geometric mean adalah satu-satunya rata-rata yang benar secara finansial. Empat: pilih alat sesuai skala — modus untuk kategori, median untuk miring atau ber-outlier, mean untuk simetris dan bersih; alat yang salah menghasilkan angka yang rapi tetapi dusta. Lima: satu angka ringkasan selalu menyembunyikan sesuatu — analis senior selalu bertanya “distribusinya seperti apa?” sebelum percaya pada angka tunggal; mean 9 hari yang menenangkan bisa menyembunyikan satu nasabah macet 300 hari. Enam: untuk data kategori, modus adalah rajanya — mean dan median tidak bermakna untuk label; ringkasan yang jujur untuk nominal adalah frekuensi dan kategori tersering, bukan angka.",
      },
    },
  ],
};

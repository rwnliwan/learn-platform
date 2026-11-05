import type { V2Lesson } from "../lib/types";

export const a18: V2Lesson = {
  slug: "a18-visualisasi",
  track: "Statistika",
  module: "Deskriptif",
  title: "A1.8 Chart Cantik yang Berbohong: Visualisasi Data Tanpa Menyesatkan",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-nasabah",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Nasabah naik 180% — padahal 4,6%",
      prose: [
        "Rapat direksi MajuBank. Kepala marketing membuka slide: Pertumbuhan Nasabah 180%! — bar chart dua batang. Batang kiri (Kuartal 1) pendek mungil, batang kanan (Kuartal 2) menjulang tiga kali lipat. Direksi bertepuk tangan. Kamu analis risiko di pojok zoom angka kecil di bawah chart: Kuartal 1 = 41.200, Kuartal 2 = 43.100 nasabah.",
        "Kenaikan riil: 4,6%. Sumbu Y-nya mulai dari 40.000 — bukan nol. Tidak ada satu pun angka di slide itu yang salah. Yang berbohong bukan angkanya — melainkan kesan yang ditanamkan chart ke otak penonton. Otak manusia membaca tinggi batang, bukan membaca sumbu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kenaikan` riil dalam persen (2 desimal)" },
        { id: "t2", text: "Hitung `rasio_bohong` = 180 / kenaikan, dibulatkan" },
      ],
      expected: "kenaikan=4.61  rasio_bohong=39",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Chart adalah alat persuasi sekuat alat analisis. Analis risiko yang baik tidak hanya membuat chart jujur — ia juga menjaga direksi dari chart yang tidak jujur. Selalu cek sumbu sebelum percaya bar chart orang lain.",
      },
      hints: [
        "kenaikan = (q2 − q1)/q1 × 100.",
        "rasio_bohong = round(180/kenaikan).",
        "kenaikan = round((q2-q1)/q1*100, 2)",
      ],
      code: {
        starter: `q1, q2 = 41200, 43100  # nasabah\n\n# TULIS KODEMU\nkenaikan = \nrasio_bohong = \n\nprint(f"kenaikan={kenaikan}  rasio_bohong={rasio_bohong}")`,
        lockLines: 1,
        solution: `q1, q2 = 41200, 43100  # nasabah\n\n# TULIS KODEMU\nkenaikan = round((q2-q1)/q1*100, 2)\nrasio_bohong = round(180/kenaikan)\n\nprint(f"kenaikan={kenaikan}  rasio_bohong={rasio_bohong}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kenaikan", value: 4.61, tol: 0.01, label: "`kenaikan` seharusnya 4.61", msg: "(43.100 − 41.200)/41.200 × 100% = 4,61%." },
          { kind: "equal", task: "t2", name: "rasio_bohong", value: 39, tol: 1, label: "`rasio_bohong` seharusnya 39", msg: "Klaim 180% adalah 39× kenaikan riil." },
          { kind: "stdout_matches", task: "t2", pattern: "kenaikan=4\\.61\\s+rasio_bohong=39", label: "`print` menampilkan keduanya", msg: "Format: kenaikan=...  rasio_bohong=... ." },
        ],
      },
      reference: "Angka benar ≠ pesan benar. Otak membaca proporsi batang, bukan sumbu.",
    },
    {
      id: "bar-liefactor",
      eyebrow: "Langkah 2 · Bar chart dan lie factor",
      title: "Sumbu Y wajib dari nol — atau lie factor bicara",
      prose: [
        "Bar chart mengkodekan nilai menjadi tinggi batang, dan otak membaca perbandingan panjang secara proporsional. Karena itu sumbu Y wajib mulai dari nol. Lie Factor Tufte mengukur seberapa besar chart berbohong: efek visual (%) dibagi efek data (%). Batas jujur: 1,05.",
        "Bank A = 51, Bank B = 52, sumbu dipotong 50–53. Tinggi batang relatif sumbu: A = 1/3, B = 2/3 → efek visual 100% (B terlihat 2× A). Efek data = (52−51)/51 = 1,96%. Lie factor = 100/1,96 ≈ 51 — distorsi berat, 51× lipat. Versi jujur (sumbu dari nol) terlihat membosankan — justru itu tandanya benar.",
      ],
      formula: String.raw`LF = \frac{\text{efek visual (\%)}}{\text{efek data (\%)}} \qquad \text{jujur jika } LF \le 1{,}05`,
      formulaNote: "LF = lie factor Tufte; efek visual = perubahan persen yang terlihat di chart; efek data = perubahan persen pada angka sebenarnya; LF di atas 1,05 = chart berbohong secara visual.",
      tasks: [
        { id: "t1", text: "Hitung `efek_data` = (52−51)/51 × 100 (2 desimal)" },
        { id: "t2", text: "Hitung `lf` = 100 / efek_data, dibulatkan" },
      ],
      expected: "efek_data=1.96  lf=51",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Sumbu boleh mulai dari mana saja, yang penting angkanya benar. Salah: pada bar chart, panjang batang adalah pesannya. Sumbu terpotong mengubah pesan tanpa mengubah angka — itulah definisi visual yang menyesatkan. (Pengecualian: line chart boleh tidak dari nol asal diberi anotasi — karena dibaca sebagai tren, bukan proporsi.)",
      },
      hints: [
        "efek_data = (b − a)/a × 100.",
        "Efek visual = 100% (batang B dua kali batang A).",
        "lf = round(100/efek_data)",
      ],
      code: {
        starter: `a, b = 51, 52  # skor Bank A dan B\n\n# TULIS KODEMU\nefek_data = \nlf = \n\nprint(f"efek_data={efek_data}  lf={lf}")`,
        lockLines: 1,
        solution: `a, b = 51, 52  # skor Bank A dan B\n\n# TULIS KODEMU\nefek_data = round((b-a)/a*100, 2)\nlf = round(100/efek_data)\n\nprint(f"efek_data={efek_data}  lf={lf}")`,
        checks: [
          { kind: "equal", task: "t1", name: "efek_data", value: 1.96, tol: 0.01, label: "`efek_data` seharusnya 1.96", msg: "(52 − 51)/51 × 100% = 1,96%." },
          { kind: "equal", task: "t2", name: "lf", value: 51, tol: 1, label: "`lf` seharusnya 51", msg: "100/1,96 ≈ 51 — jauh di atas batas jujur 1,05." },
          { kind: "stdout_matches", task: "t2", pattern: "efek_data=1\\.96\\s+lf=51", label: "`print` menampilkan keduanya", msg: "Format: efek_data=...  lf=... ." },
        ],
      },
      reference: "Bar chart: sumbu Y dari nol. Pie: maksimal 5 slice. Satu chart, satu pesan.",
    },
    {
      id: "line-chart",
      eyebrow: "Langkah 3 · Line chart",
      title: "Garis untuk waktu — bukan untuk kategori",
      prose: [
        "Line chart menghubungkan titik-titik berurutan waktu: mata langsung menangkap tren, percepatan, titik balik. NPL Jan 10% → Feb 12%: laju = (12−10)/10 = 20%. Garis menanjak tajam = laju besar. Naik/turun itu netral — maknanya tergantung metrik: NPL naik = kabar buruk, DPK naik = kabar baik. Selalu baca label sumbu Y sebelum bereaksi.",
        "Jebakan: memplot 8 produk sebagai line chart. Garis menghubungkan P12→P07→P03 seolah ada tren antar produk — padahal urutan produk itu acak. Garis antar titik menyiratkan kontinuitas bermakna; kalau sumbu X-nya kategori tanpa urutan, garis itu dusta — pakai bar chart.",
      ],
      formula: String.raw`g_t = \frac{x_t - x_{t-1}}{x_{t-1}} \times 100\%`,
      formulaNote: "g_t = laju pertumbuhan periode t; x_t = nilai periode ini; x_{t-1} = nilai periode sebelumnya; laju = perubahan relatif, bukan selisih absolut.",
      tasks: [
        { id: "t1", text: "Hitung `g_feb` = laju NPL Jan→Feb (%)" },
        { id: "t2", text: "Hitung `g_mar` = laju NPL Feb→Mar (%)" },
      ],
      expected: "g_feb=20.0  g_mar=25.0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Garis naik = kabar baik. Salah: arah garis netral. NPL naik dari 10% ke 18% dalam 6 bulan dengan percepatan di kuartal kedua = kualitas kredit memburuk. Analis yang bereaksi pada bentuk tanpa membaca label adalah korban empuk chart marketing.",
      },
      hints: [
        "g = (nilai_baru − nilai_lama)/nilai_lama × 100.",
        "NPL: Jan 10, Feb 12, Mar 15.",
        "g_mar = (npl[2]-npl[1])/npl[1]*100",
      ],
      code: {
        starter: `npl = [10, 12, 15]  # %, Jan-Mar\n\n# TULIS KODEMU\ng_feb = \ng_mar = \n\nprint(f"g_feb={g_feb}  g_mar={g_mar}")`,
        lockLines: 1,
        solution: `npl = [10, 12, 15]  # %, Jan-Mar\n\n# TULIS KODEMU\ng_feb = (npl[1]-npl[0])/npl[0]*100\ng_mar = (npl[2]-npl[1])/npl[1]*100\n\nprint(f"g_feb={g_feb}  g_mar={g_mar}")`,
        checks: [
          { kind: "equal", task: "t1", name: "g_feb", value: 20.0, tol: 1e-9, label: "`g_feb` seharusnya 20.0", msg: "(12 − 10)/10 × 100% = 20%." },
          { kind: "equal", task: "t2", name: "g_mar", value: 25.0, tol: 1e-9, label: "`g_mar` seharusnya 25.0", msg: "(15 − 12)/12 × 100% = 25% — percepatan." },
          { kind: "stdout_matches", task: "t2", pattern: "g_feb=20(\\.0)?\\s+g_mar=25(\\.0)?", label: "`print` menampilkan keduanya", msg: "Format: g_feb=...  g_mar=... ." },
        ],
      },
      reference: "Line chart: X harus urutan waktu. Kategori acak → bar chart.",
    },
    {
      id: "histogram",
      eyebrow: "Langkah 4 · Histogram",
      title: "Histogram: tes kejujuran angka ringkasan",
      prose: [
        "Histogram memotong rentang data menjadi bin lalu menghitung frekuensi tiap bin — menjawab bentuk data: simetris, miring, atau malah dua kelompok? Aturan Sturges untuk jumlah bin yang wajar: k = 1 + 3,322 × log10(n). Untuk n = 100 → 8 bin. Terlalu sedikit bin menyembunyikan pola; terlalu banyak menampilkan noise.",
        "Contoh nyata: penghasilan 22 nasabah — mean ≈ 17 jt, median ≈ 8,5 jt. Histogramnya dua punuk: menumpuk di ±8 jt dan ±34 jt. Ini bimodal: dua kelompok nasabah (mikro vs menengah). Rata-rata 17 jt tidak dialami siapa pun. Tanpa histogram kamu menetapkan satu kebijakan untuk dua populasi berbeda.",
      ],
      formula: String.raw`k = 1 + 3{,}322 \times \log_{10}(n)`,
      formulaNote: "k = jumlah bin yang wajar; n = banyaknya data; log_10 = logaritma basis 10; aturan Sturges — titik awal yang masuk akal, bukan hukum.",
      tasks: [
        { id: "t1", text: "Hitung `k` = jumlah bin Sturges untuk n = 100, dibulatkan" },
        { id: "t2", text: "Hitung `selisih` = mean − median (indikasi kemiringan)" },
      ],
      expected: "k=8  selisih=8.5",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Histogram hanya versi cantik tabel frekuensi. Salah: tabel memberi angka, histogram memberi bentuk — dan bentuklah yang menentukan keputusan (mean vs median, satu segmen vs dua). Sebelum percaya mean/median apapun, tanya bentuk distribusinya.",
      },
      hints: [
        "math.log10 untuk logaritma basis 10.",
        "k = round(1 + 3.322*log10(100)).",
        "selisih = 17 - 8.5",
      ],
      code: {
        starter: `import math\n\nn = 100  # data\nmean, median = 17, 8.5  # juta\n\n# TULIS KODEMU\nk = \nselisih = \n\nprint(f"k={k}  selisih={selisih}")`,
        lockLines: 4,
        solution: `import math\n\nn = 100  # data\nmean, median = 17, 8.5  # juta\n\n# TULIS KODEMU\nk = round(1 + 3.322*math.log10(n))\nselisih = mean - median\n\nprint(f"k={k}  selisih={selisih}")`,
        checks: [
          { kind: "equal", task: "t1", name: "k", value: 8, tol: 1e-9, label: "`k` seharusnya 8", msg: "1 + 3,322 × 2 = 7,64 → 8 bin." },
          { kind: "equal", task: "t2", name: "selisih", value: 8.5, tol: 1e-9, label: "`selisih` seharusnya 8.5", msg: "Mean jauh di atas median → curigai miring kanan / bimodal." },
          { kind: "stdout_matches", task: "t2", pattern: "k=8\\s+selisih=8\\.5", label: "`print` menampilkan keduanya", msg: "Format: k=...  selisih=... ." },
        ],
      },
      reference: "Histogram di awal tiap variabel numerik — fondasi EDA.",
    },
    {
      id: "komposisi",
      eyebrow: "Langkah 5 · Komposisi",
      title: "Pie vs stacked bar: sudut kalah dari panjang",
      prose: [
        "Chart komposisi menunjukkan bagian dari keseluruhan: proporsi = nilai kategori / total. Masalahnya: pie mengkodekan proporsi menjadi sudut — dan manusia buruk membandingkan sudut. Bisakah kamu mengurutkan 8 juring dari terbesar ke terkecil tanpa membaca label? Hampir mustahil.",
        "Versi jujurnya: stacked bar. Tiap batang = 100% DPK satu tahun, segmen dibandingkan lewat panjang — akurat. Tabungan naik 55%→58%, Giro turun 30%→27%: pergeseran antar tahun yang di pie mustahil, di sini seketika. Aturan: pie maksimal 5 slice, satu periode, satu pesan. Selain itu → stacked bar.",
      ],
      formula: String.raw`p_i = \frac{x_i}{\sum x}`,
      formulaNote: "p_i = proporsi kategori i; x_i = nilai kategori i; sigma x = total semua kategori; jumlah semua p_i = 1.",
      tasks: [
        { id: "t1", text: "Hitung `total` DPK dari tiga produk" },
        { id: "t2", text: "Hitung `prop_tab` = proporsi Tabungan (2 desimal)" },
      ],
      expected: "total=100  prop_tab=0.58",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Pie chart warna-warni terlihat profesional dan meyakinkan. Salah: terlihat meyakinkan ≠ terbaca. Pie 8 slice membuat penonton merasa paham tanpa benar-benar bisa membandingkan — itu ilusi, bukan profesionalisme. Profesional = penonton bisa menjawab pertanyaan dari chart tanpa menebak.",
      },
      hints: [
        "total = 58 + 27 + 15.",
        "proporsi = nilai / total.",
        "prop_tab = 58/total",
      ],
      code: {
        starter: `tabungan, giro, deposito = 58, 27, 15  # % DPK\n\n# TULIS KODEMU\ntotal = \nprop_tab = \n\nprint(f"total={total}  prop_tab={prop_tab}")`,
        lockLines: 1,
        solution: `tabungan, giro, deposito = 58, 27, 15  # % DPK\n\n# TULIS KODEMU\ntotal = tabungan + giro + deposito\nprop_tab = round(tabungan/total, 2)\n\nprint(f"total={total}  prop_tab={prop_tab}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: 100, tol: 1e-9, label: "`total` seharusnya 100", msg: "58 + 27 + 15 = 100." },
          { kind: "equal", task: "t2", name: "prop_tab", value: 0.58, tol: 1e-9, label: "`prop_tab` seharusnya 0.58", msg: "58/100 = 0,58." },
          { kind: "stdout_matches", task: "t2", pattern: "total=100\\s+prop_tab=0\\.58", label: "`print` menampilkan keduanya", msg: "Format: total=...  prop_tab=... ." },
        ],
      },
      reference: "Akurasi mata: panjang > sudut > luas > warna.",
    },
    {
      id: "scatterplot",
      eyebrow: "Langkah 6 · Scatterplot",
      title: "Scatterplot: poligraf untuk klaim hubungan",
      prose: [
        "Scatterplot memplot tiap observasi sebagai titik pada dua sumbu — satu-satunya chart yang menunjukkan hubungan apa adanya: arah, kekuatan, pola non-linear, outlier. Tenor vs default membentuk huruf U: default tinggi di tenor sangat pendek dan sangat panjang, rendah di tengah. Pearson r ≈ 0 — bukan berarti tidak ada hubungan, tapi tidak ada hubungan linear.",
        "Dual axis (dua sumbu Y) mainkan sangat hati-hati: dengan mengatur skala, deret acak manapun bisa tampak bergerak bersama. Kalau terpaksa (NPL % vs total kredit Rp), kedua sumbu mulai dari nol, beri warna berbeda, tulis anotasi. Alternatif jujur: dua panel terpisah, atau normalisasi ke indeks (periode awal = 100).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `idx_q4` = indeks Q4 dengan Q3 = 100 (2 desimal)" },
      ],
      expected: "idx_q4=104.12",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Dua garis yang bergerak bersama di dual-axis chart = keduanya berhubungan. Salah: kesamaan gerak visual bisa murni artefak pilihan skala. Bukti hubungan = scatterplot + ukuran efek yang dihitung, bukan dua garis yang kebetulan sejajar.",
      },
      hints: [
        "Indeks = nilai / nilai_awal × 100.",
        "Q3 = 485, Q4 = 505.",
        "idx_q4 = round(505/485*100, 2)",
      ],
      code: {
        starter: `# normalisasi ke indeks: Q3 = 100\nq3, q4 = 485, 505  # Rp M\n\n# TULIS KODEMU\nidx_q4 = \n\nprint(f"idx_q4={idx_q4}")`,
        lockLines: 2,
        solution: `# normalisasi ke indeks: Q3 = 100\nq3, q4 = 485, 505  # Rp M\n\n# TULIS KODEMU\nidx_q4 = round(q4/q3*100, 2)\n\nprint(f"idx_q4={idx_q4}")`,
        checks: [
          { kind: "equal", task: "t1", name: "idx_q4", value: 104.12, tol: 0.01, label: "`idx_q4` seharusnya 104.12", msg: "505/485 × 100 = 104,12 — naik 4,12%, bukan 3× lipat." },
          { kind: "stdout_matches", task: "t1", pattern: "idx_q4=104\\.12", label: "`print` menampilkan indeks", msg: "Format: idx_q4=104.12." },
        ],
      },
      reference: "Setiap klaim hubungan tanpa scatterplot = belum terbukti.",
    },
    {
      id: "minicase-slide",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Bedah slide direksi yang menipu",
      prose: [
        "Kamu analis di Bank Sejahtera. Tim marketing mengirim slide untuk rapat direksi: judul Pertumbuhan Tabungan Melonjak 3× Lipat! Chart bar 3D dua batang — Q3 pendek vs Q4 menjulang ±3× lebih tinggi. Footnote kecil: Q3 = Rp485 M, Q4 = Rp505 M. Sumbu Y mulai dari Rp480 M. Hanya Q3–Q4 2025 yang ditampilkan.",
        "Trik 1 — sumbu terpotong: Y mulai dari 480, bukan 0. Trik 2 — efek 3D: distorsi perspektif membuat batang depan tampak lebih besar. Trik 3 — cherry-picking periode: Q1–Q2 disembunyikan; mungkin Q4 hanya rebound dari Q3 yang anjlok. Lie factor: efek visual ≈ 200% (3× = +200%); efek data = (505−485)/485 ≈ 4,1%. LF ≈ 49 — distorsi berat.",
        "Kalimat koreksi untuk direksi: Tabungan naik 4,1% dari Rp485 M ke Rp505 M pada Q4 — pertumbuhan positif namun moderat, bukan tiga kali lipat; saya lampirkan versi sumbu-nol dan tren 4 kuartal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `efek_data` = (505−485)/485 × 100 (2 desimal)" },
        { id: "t2", text: "Hitung `lf` = 200 / efek_data, dibulatkan" },
      ],
      expected: "efek_data=4.12  lf=49",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Peta keputusan 10 detik: tanya tujuannya dulu — bandingkan? tren? distribusi? hubungan? komposisi? Bar → sumbu dari nol. Line → X harus urutan waktu. Pie → maks 5 slice. Satu chart, satu pesan. Sebelum percaya chart orang: cek sumbu, cek skala, hitung lie factor kalau curiga.",
      },
      hints: [
        "efek_data = (q4 − q3)/q3 × 100.",
        "Efek visual 3× lipat = +200%.",
        "lf = round(200/efek_data)",
      ],
      code: {
        starter: `q3, q4 = 485, 505  # Rp M\n\n# TULIS KODEMU\nefek_data = \nlf = \n\nprint(f"efek_data={efek_data}  lf={lf}")`,
        lockLines: 1,
        solution: `q3, q4 = 485, 505  # Rp M\n\n# TULIS KODEMU\nefek_data = round((q4-q3)/q3*100, 2)\nlf = round(200/efek_data)\n\nprint(f"efek_data={efek_data}  lf={lf}")`,
        checks: [
          { kind: "equal", task: "t1", name: "efek_data", value: 4.12, tol: 0.01, label: "`efek_data` seharusnya 4.12", msg: "(505 − 485)/485 × 100% = 4,12%." },
          { kind: "equal", task: "t2", name: "lf", value: 49, tol: 1, label: "`lf` seharusnya 49", msg: "200/4,12 ≈ 49 — jauh di atas batas jujur 1,05." },
          { kind: "stdout_matches", task: "t2", pattern: "efek_data=4\\.12\\s+lf=49", label: "`print` menampilkan keduanya", msg: "Format: efek_data=...  lf=... ." },
        ],
      },
      reference: "LF ≤ 1,05 jujur; LF ≈ 49 = murni kebohongan visual.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Tujuan dulu, chart kemudian: bandingkan → bar; tren → line; distribusi → histogram; hubungan → scatterplot; komposisi → stacked bar.",
        "Bar chart: sumbu Y dari nol. Lie factor > 1,05 = distorsi; contoh 51 vs 52 memberi LF ≈ 51.",
        "Line chart hanya untuk X berurutan waktu; kategori acak → bar chart.",
        "Pie maksimal 5 slice; selebihnya stacked bar — mata akurat pada panjang, buruk pada sudut.",
        "Dual axis bisa membuktikan apa saja lewat skala; bukti hubungan = scatterplot + ukuran efek.",
      ],
      next: { label: "A1.9 — EDA End-to-End", href: "/learn/a19-eda-end-to-end" },
      quiz: [
        {
          q: "Bandingkan penjualan 15 produk. Chart terbaik?",
          options: [
            { text: "Pie chart 15 slice", why: "15 sudut tidak terbaca — mata buruk membandingkan sudut." },
            { text: "Horizontal bar chart, urut terbesar–terkecil", why: "Bar horizontal mudah dibaca; urutan membantu perbandingan.", correct: true },
            { text: "3D pie chart", why: "3D mendistorsi proporsi — memperparah masalah pie." },
            { text: "Line chart", why: "Line chart untuk tren waktu, bukan kategori produk." },
          ],
        },
        {
          q: "Dashboard risiko menampilkan 12 metrik dalam satu chart garis warna-warni. Masalahnya?",
          options: [
            { text: "Tidak ada — semakin banyak semakin baik", why: "12 garis = spageti yang tak terbaca." },
            { text: "Melanggar satu chart, satu pesan; pecah menjadi beberapa chart fokus", why: "Kalau butuh 3 paragraf menjelaskan chart, chart-nya gagal.", correct: true },
            { text: "Harus diganti pie chart", why: "12 kategori di pie lebih buruk lagi." },
            { text: "Warna kurang banyak", why: "Warna bukan masalahnya — pesannya yang tercerai." },
          ],
        },
        {
          q: "Bar chart nilai 51 vs 52 dengan sumbu Y 50–53. Berapa lie factor-nya, dan artinya?",
          options: [
            { text: "≈ 1 — jujur, visual proporsional dengan data", why: "Sumbu terpotong membuat visual tidak proporsional." },
            { text: "≈ 2 — sedikit melebih-lebihkan", why: "Jauh lebih besar dari itu." },
            { text: "≈ 51 — distorsi berat, chart membesar-besarkan 51x lipat", why: "Efek visual 100% / efek data 1,96% ≈ 51 — jauh di atas batas jujur 1,05.", correct: true },
            { text: "≈ 0,5 — chart justru mengecilkan perbedaan", why: "Chart membesar-besarkan, bukan mengecilkan." },
          ],
        },
        {
          q: "Komposisi 8 produk DPK harus dipresentasikan ke direksi. Pilihan terbaik?",
          options: [
            { text: "Pie chart 8 slice warna-warni", why: "Mata buruk membandingkan 8 sudut pie." },
            { text: "Stacked bar (atau gabungkan slice kecil jadi Lainnya hingga ≤ 5)", why: "Stacked bar memakai panjang (akurat) dan memungkinkan perbandingan antar periode.", correct: true },
            { text: "3D pie chart agar terlihat modern", why: "3D mendistorsi — modern bukan berarti jujur." },
            { text: "Tabel angka mentah tanpa chart", why: "Tabel boleh, tapi stacked bar memberi bentuk yang lebih cepat dibaca." },
          ],
        },
        {
          q: "Scatterplot tenor vs default membentuk pola huruf U, tapi korelasi Pearson r ≈ 0. Kesimpulan tepat?",
          options: [
            { text: "Tidak ada hubungan — r = 0 membuktikannya", why: "r ≈ 0 hanya berarti tidak ada hubungan linear." },
            { text: "Ada hubungan non-linear (U-shape); r hanya mengukur hubungan linear", why: "Pola U = hubungan kuadratik yang nyata. Plot dulu, baru percaya angka.", correct: true },
            { text: "Datanya salah, buang saja", why: "Datanya valid — yang salah adalah koefisien yang dipilih." },
            { text: "Ganti ke pie chart", why: "Pie tidak menjawab pertanyaan hubungan dua variabel." },
          ],
        },
      ],
      note: {
        title: "Intuisi: chart adalah argumen visual yang bisa berbohong tanpa angka yang salah",
        body: "Lima heuristik. Satu: sumbu Y bar chart wajib dari nol — otak membaca perbandingan panjang secara proporsional; sumbu terpotong membuat kenaikan 4,6 persen terlihat 180 persen, dan lie factor mengukurnya. Dua: pilih chart dari pertanyaan, bukan kebiasaan — bandingkan pakai bar, tren pakai garis, distribusi pakai histogram, hubungan pakai scatterplot, komposisi pakai stacked bar; garis antar kategori acak adalah kebohongan visual. Tiga: dual axis adalah main api — dengan mengatur dua skala, deret acak mana pun bisa tampak bergerak bersama; bila terpaksa, kedua sumbu dari nol dan beri peringatan. Empat: pie di atas lima kategori adalah teka-teki sudut — manusia buruk membandingkan sudut; stacked bar membandingkan panjang dan selalu menang. Lima: sebelum percaya chart mana pun, baca sumbu, judul, dan periode — tiga detik yang menyelamatkan: sumbu terpotong, efek 3D, dan cherry-picking periode adalah tiga trik tertua di ruang rapat. Enam: satu chart satu pesan — slide yang memuat lima pesan tidak menyampaikan apa-apa; bila butuh lima pesan, buat lima chart.",
      },
    },
  ],
};

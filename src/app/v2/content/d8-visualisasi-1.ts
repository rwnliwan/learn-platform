import type { V2Lesson } from "../lib/types";

export const d8_1: V2Lesson = {
  slug: "d8-visualisasi-1",
  track: "Python",
  module: "Visualisasi",
  title: "D8-1 Visualisasi: Memilih Chart yang Jujur (matplotlib)",
  estMinutes: 55,
  steps: [
    {
      id: "pilih-chart",
      eyebrow: "Langkah 1 · Memilih chart",
      title: "Cerita pembuka: chart yang 'membuktikan' kenaikan 300%",
      prose: [
        "Slide presentasi: bar chart menunjukkan penjualan naik 300% — batang kedua 4x lebih tinggi. Faktanya: dari 100 ke 115, naik 15%. Triknya? Sumbu Y dimulai dari 90, bukan 0. Visualisasi bisa jujur atau menipu — dan yang perlu dilatih bukan matamu, melainkan kecurigaanmu pada sumbu.",
        "Pertanyaan dulu, chart kemudian: perbandingan kategori pakai bar, tren waktu pakai line, distribusi pakai histogram, hubungan dua variabel pakai scatter, sebaran per grup pakai boxplot, komposisi pakai stacked bar. Satu pertanyaan = satu chart.",
      ],
      tasks: [],
      reference: "bar = kategori (Y dari 0!); line = waktu; hist/box = distribusi; scatter = hubungan.",
    },
    {
      id: "bar-jujur",
      eyebrow: "Langkah 2 · Bar chart",
      title: "Batang yang jujur mulai dari 0",
      prose: [
        "Panjang batang proporsional dengan nilai — hanya benar jika sumbu Y dari 0. `ax.set_ylim(0, max*1.2)` membuatnya eksplisit. Satu baris `ylim(90, 120)` mengubah +15% jadi terlihat +300%.",
        "Di runtime ini figure tidak ditampilkan — kita verifikasi propertinya: jumlah batang dan batas sumbu. Di Colab atau lokal, tambah `plt.show()` untuk melihat gambarnya.",
      ],
      requires: ["numpy", "matplotlib"],
      tasks: [
        { id: "t1", text: "Hitung `rata` = rata-rata gaji per kota (dict)" },
        { id: "t2", text: "Set sumbu Y dari 0, lalu baca `y0` = batas bawah" },
      ],
      expected: "y0=0.0  batang=3  jkt=8270942",
      note: {
        title: "Sering salah",
        body: "Membiarkan matplotlib memilih batas sumbu otomatis untuk bar chart — sering tidak dari 0 dan terlihat menipu. Selalu set eksplisit untuk bar. Pengecualian: line chart boleh tidak dari 0 (yang penting perubahan), tapi nyatakan eksplisit.",
      },
      hints: [
        "rata = {k: gaji[kota == k].mean() for k in [...]}.",
        "ax.set_ylim(0, max(rata.values()) * 1.2).",
        "y0, y1 = ax.get_ylim()",
      ],
      code: {
        starter: `import matplotlib\nmatplotlib.use("Agg")  # backend non-interaktif\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nrng = np.random.default_rng(7)\ngaji = rng.normal(9_000_000, 2_500_000, 200).clip(3_000_000)\nkota = rng.choice(["Jakarta", "Bandung", "Surabaya"], 200)\n\n# TULIS KODEMU\nrata = \nfig, ax = plt.subplots()\nax.bar(rata.keys(), rata.values())\nax.set_ylabel("Rata-rata gaji")\n\ny0, y1 = ax.get_ylim()\nprint(f"y0={y0}  batang={len(ax.patches)}  jkt={rata['Jakarta']:.0f}")`,
        lockLines: 9,
        solution: `import matplotlib\nmatplotlib.use("Agg")  # backend non-interaktif\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nrng = np.random.default_rng(7)\ngaji = rng.normal(9_000_000, 2_500_000, 200).clip(3_000_000)\nkota = rng.choice(["Jakarta", "Bandung", "Surabaya"], 200)\n\n# TULIS KODEMU\nrata = {k: gaji[kota == k].mean() for k in ["Jakarta", "Bandung", "Surabaya"]}\nfig, ax = plt.subplots()\nax.bar(rata.keys(), rata.values())\nax.set_ylabel("Rata-rata gaji")\nax.set_ylim(0, max(rata.values()) * 1.2)\n\ny0, y1 = ax.get_ylim()\nprint(f"y0={y0}  batang={len(ax.patches)}  jkt={rata['Jakarta']:.0f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "y0", value: 0.0, tol: 1e-9, label: "`y0` = 0 (jujur)", msg: "ax.set_ylim(0, ...) — bar chart wajib dari 0." },
          { kind: "contains", task: "t1", name: "rata", value: "Jakarta", label: "`rata` memuat Jakarta", msg: "Dict rata-rata per kota untuk 3 kota." },
          { kind: "stdout_matches", task: "t2", pattern: "y0=0\\.0\\s+batang=3\\s+jkt=8270942", label: "`print` menampilkan y0, batang, jkt", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "ax.bar(x, y); ax.set_ylim(0, ...) untuk bar. plt.show() di Colab/lokal.",
    },
    {
      id: "histogram",
      eyebrow: "Langkah 3 · Histogram",
      title: "Melihat bentuk distribusi",
      prose: [
        "Rata-rata menyembunyikan bentuk: dua kota bisa punya rata-rata sama dengan sebaran beda jauh. Histogram menunjukkan bentuk — miring, bimodal, outlier. `ax.hist(gaji/1e6, bins=20)`; jumlah bin mengubah kesan, jadi coba beberapa.",
        "Pertanyaan 'berapa persen di bawah 10 juta' adalah pertanyaan distribusi — jawabnya histogram plus garis batas, bukan bar rata-rata. `(gaji < 10_000_000).mean()` memberi angkanya.",
      ],
      requires: ["numpy", "matplotlib"],
      tasks: [
        { id: "t1", text: "Buat histogram gaji (juta) 20 bin, tangkap `n` (isi tiap bin)" },
        { id: "t2", text: "Hitung `mean_jt` dan `total_bin`" },
      ],
      expected: "mean_jt=8.7  total_bin=200",
      note: {
        title: "Sering salah",
        body: "Memakai terlalu sedikit bin (bentuk hilang) atau terlalu banyak (noise). Tidak ada angka ajaib — coba 10, 20, 50 dan lihat mana yang menunjukkan bentuk tanpa mengada-ada.",
      },
      hints: [
        "n, tepi, _ = ax.hist(gaji / 1e6, bins=20).",
        "mean_jt = gaji.mean() / 1e6.",
        "total_bin = int(n.sum())  # semua 200 data masuk bin",
      ],
      code: {
        starter: `import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nrng = np.random.default_rng(7)\ngaji = rng.normal(9_000_000, 2_500_000, 200).clip(3_000_000)\n\n# TULIS KODEMU\nfig, ax = plt.subplots()\nn, tepi, _ = \nmean_jt = \ntotal_bin = \n\nprint(f"mean_jt={mean_jt:.1f}  total_bin={total_bin}")`,
        lockLines: 8,
        solution: `import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nrng = np.random.default_rng(7)\ngaji = rng.normal(9_000_000, 2_500_000, 200).clip(3_000_000)\n\n# TULIS KODEMU\nfig, ax = plt.subplots()\nn, tepi, _ = ax.hist(gaji / 1e6, bins=20)\nmean_jt = gaji.mean() / 1e6\ntotal_bin = int(n.sum())\n\nprint(f"mean_jt={mean_jt:.1f}  total_bin={total_bin}")`,
        checks: [
          { kind: "equal", task: "t2", name: "mean_jt", value: 8.7, tol: 0.05, label: "`mean_jt` sekitar 8.7", msg: "Rata-rata gaji 8.671.555 / 1e6." },
          { kind: "equal", task: "t2", name: "total_bin", value: 200, tol: 1e-9, label: "`total_bin` = 200", msg: "Semua 200 data masuk ke bin." },
          { kind: "stdout_matches", task: "t2", pattern: "mean_jt=8\\.7\\s+total_bin=200", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "ax.hist(x, bins=20). Coba beberapa jumlah bin sebelum menyimpulkan bentuk.",
    },
    {
      id: "scatter",
      eyebrow: "Langkah 4 · Scatter",
      title: "Hubungan dua variabel",
      prose: [
        "Scatter gaji vs DPD: apakah yang bergaji rendah cenderung telat lebih lama? `ax.scatter(gaji/1e6, dpd, alpha=0.5)` — alpha mengatasi overplotting saat titik bertumpuk. Korelasinya -0,65: hubungan negatif sedang-kuat.",
        "Hati-hati: korelasi bukan kausalitas. Gaji rendah berpasangan dengan DPD tinggi bisa lewat faktor ketiga (mis. pendidikan atau jenis pekerjaan). Scatter menunjukkan pola; penjelasan butuh analisis lanjutan.",
      ],
      requires: ["numpy", "matplotlib"],
      tasks: [
        { id: "t1", text: "Buat scatter gaji (juta) vs dpd" },
        { id: "t2", text: "Hitung `kor` = korelasi gaji-dpd" },
      ],
      expected: "kor=-0.65  n_titik=150",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Scatter bivariat adalah cara tercepat memvalidasi asumsi model risiko: apakah hubungan yang dipakai model terlihat di data? Jika scatter menunjukkan tidak ada pola tapi model mengandalkannya, model itu fiksi.",
      },
      hints: [
        "ax.scatter(gaji / 1e6, dpd, alpha=0.5).",
        "kor = np.corrcoef(gaji, dpd)[0, 1].",
        "n_titik = len(ax.collections[0].get_offsets())",
      ],
      code: {
        starter: `import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nrng = np.random.default_rng(11)\nn = 150\ngaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)\ndpd = rng.poisson(12, n) + (gaji < 7_000_000).astype(int) * rng.poisson(20, n)\n\n# TULIS KODEMU\nfig, ax = plt.subplots()\nax.scatter(gaji / 1e6, dpd, alpha=0.5)\nkor = \nn_titik = \n\nprint(f"kor={kor:.2f}  n_titik={n_titik}")`,
        lockLines: 10,
        solution: `import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nrng = np.random.default_rng(11)\nn = 150\ngaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)\ndpd = rng.poisson(12, n) + (gaji < 7_000_000).astype(int) * rng.poisson(20, n)\n\n# TULIS KODEMU\nfig, ax = plt.subplots()\nax.scatter(gaji / 1e6, dpd, alpha=0.5)\nkor = np.corrcoef(gaji, dpd)[0, 1]\nn_titik = len(ax.collections[0].get_offsets())\n\nprint(f"kor={kor:.2f}  n_titik={n_titik}")`,
        checks: [
          { kind: "equal", task: "t2", name: "kor", value: -0.647, tol: 0.01, label: "`kor` sekitar -0.65", msg: "Korelasi negatif: gaji rendah berpasangan dpd tinggi." },
          { kind: "equal", task: "t2", name: "n_titik", value: 150, tol: 1e-9, label: "`n_titik` = 150", msg: "Scatter memuat 150 titik." },
          { kind: "stdout_matches", task: "t2", pattern: "kor=-0\\.65\\s+n_titik=150", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "ax.scatter(x, y, alpha=0.5). np.corrcoef(x, y)[0,1]. Korelasi bukan kausalitas.",
    },
    {
      id: "boxplot",
      eyebrow: "Langkah 5 · Boxplot",
      title: "Sebaran per grup sekilas",
      prose: [
        "`ax.boxplot([data_jkt, data_bdg, data_sby], labels=[...])` membandingkan sebaran gaji per kota: garis tengah = median, box = IQR, titik di luar = outlier. Satu gambar menjawab: kota mana mediannya tertinggi, mana sebarannya terlebar.",
        "Grammar of graphics merangkum semuanya: plot = data + aesthetic (x, y, warna) + geometri (bar/line/titik). `hue` menambah dimensi ketiga via warna; facet menambah keempat via subplot. Maksimal 3-4 dimensi per chart — lebih dari itu, pecah jadi beberapa chart.",
      ],
      tasks: [],
      reference: "ax.boxplot(list_data, labels=[...]). hue = warna per grup; facet = subplot per grup.",
    },
    {
      id: "advanced-jujur",
      eyebrow: "Langkah 6 · Advanced",
      title: "Advanced: figure vs axes, sumbu yang jujur, data-ink",
      prose: [
        "Tiga penguasaan matplotlib yang membedakan chart analis dari chart desainer. Pertama, FIGURE vs AXES: matplotlib punya dua level API — `plt.plot()` (stateful: menggambar di \"axes aktif\" yang implisit) vs `fig, ax = plt.subplots()` lalu `ax.plot()` (object-oriented: eksplisit). Aturannya: pyplot untuk eksplorasi 1 chart sekali pakai; OO untuk SEMUA yang lain — multi-panel, fungsi yang dipanggil berulang, atau chart untuk laporan. Alasannya: API stateful dalam loop/fungsi menggambar di atas chart sebelumnya diam-diam (chart \"hantu\" bertumpuk); OO selalu tahu persis axes mana yang digambar. Senior membaca `plt.` di kode produksi sebagai code smell.",
        "Kedua, SUMBU YANG JUJUR: bar chart WAJIB mulai dari 0 (panjang batang = nilai — memotong sumbu memalsukan perbandingan, sudah kamu praktikkan di Langkah 2). Untuk line chart, sumbu boleh tidak dari 0 — tetapi pemotongan harus disadari dan dijustifikasi, karena ia memperbesar kemiringan visual secara artifisial. Dua dosa besar: DUAL Y-AXIS — dua skala berbeda yang disejajarkan sembarang menciptakan korelasi palsu (geser sedikit sumbunya, \"korelasinya\" hilang); gantinya: normalisasi ke indeks (100 = baseline) atau small multiples. Dan ASPEK RASIO: banking to 45° — kemiringan tren rata-rata dimiringkan ~45° agar perubahan terbaca proporsional, bukan dramatis atau datar.",
        "Ketiga, DATA-INK RATIO (Tufte): maksimalkan tinta yang mengkodekan data, minimalkan dekorasi — buang chartjunk (efek 3D, grid tebal, bayangan), ganti legend dengan label langsung pada garis, anotasi SATU titik yang penting (\"di sini kebijakan berubah\") alih-alih paragraf caption. Uji seniornya: tutup judul chart — bisakah pembaca menebak pesannya dalam 5 detik? Bila tidak, chart itu dekorasi, bukan argumen. Dan ingat hierarki: chart menjawab SATU pertanyaan; bila butuh dua kalimat untuk menjelaskan satu chart, itu dua chart yang dipaksa menjadi satu.",
      ],
      tasks: [],
      reference: "Produksi = OO API (fig, ax). Bar dari 0; dual y-axis = dosa; banking 45°. Data-ink maksimal; judul = kesimpulan; 1 chart = 1 pertanyaan.",
    },
    {
      id: "minicase-sumbu",
      eyebrow: "Langkah 7 · Mini-case",
      requires: ["numpy", "matplotlib"],
      title: "Mini-case: kenaikan 0,5pp yang terlihat seperti krisis",
      prose: [
        "Skenario (angka konkret): NPL bank naik dari 3,1% (Jan) ke 3,6% (Mei) — kenaikan 0,5 poin persentase dalam 5 bulan, perlu perhatian tetapi bukan krisis. Chart di slide direksi memakai sumbu Y 3,0–3,7%: garisnya menanjak TAJAM, terlihat seperti ledakan. Direksi panik, memerintahkan pengetatan kredit menyeluruh — penyaluran turun 18% kuartal itu, kehilangan pendapatan bunga Rp 4,2 miliar. Setelah itu analis membuat ulang chart yang sama dengan sumbu dari 0: garisnya nyaris datar — tren naik yang moderat, bukan krisis.",
        "Pertanyaan analisis: (1) Hitung faktor pembesaran visual akibat pemotongan sumbu. (2) Apa yang seharusnya dilakukan analis SEBELUM chart naik ke direksi? (3) Kapan pemotongan sumbu bisa dibenarkan?",
        "Pembahasan: (1) Rentang jujur 0–4,32 vs rentang dipotong 3,0–3,7 (lebar 0,7) → faktor ≈ 6,2× — kemiringan terlihat 6 kali lebih curam dari realitasnya. Praktikkan di lab: dua subplot, satu data, dua kejujuran. (2) Uji 5 detik + tanya \"pesan apa yang dibaca orang dari chart ini\" — dan untuk metrik yang diawasi (NPL, DPD), tetapkan KONVENSI sumbu di tim (mis. NPL selalu 0–10%) agar tidak ada yang \"kebetulan\" memotong. (3) Pemotongan dibenarkan bila variasi kecil di sekitar baseline besar adalah FOKUS analisisnya (mis. tracking 3,10% vs 3,12%) — tetapi WAJIB dianotasi jelas (\"sumbu dipotong, perhatikan skala\") dan tidak untuk audiens non-teknis tanpa penjelasan.",
        "Kaitan ke karier: chart bukan ilustrasi — ia argumen. Analis yang chart-nya menyesatkan (meski tidak sengaja) kehilangan kepercayaan yang butuh 2 tahun dibangun.",
      ],
      tasks: [
        { id: "t1", text: "Buat 2 subplot: kiri sumbu dipotong (3.0–3.7), kanan jujur (0–maks*1.2)" },
        { id: "t2", text: "Hitung `faktor` pembesaran visual, cetak `y0_menipu`, `y0_jujur`, `faktor`" },
      ],
      expected: "y0_menipu=3.0 y0_jujur=0.0 faktor=6.2x",
      hints: [
        "fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4)).",
        "ax1.set_ylim(3.0, 3.7); ax2.set_ylim(0, npl.max() * 1.2).",
        "faktor = (npl.max()*1.2 - 0) / (3.7 - 3.0); baca y0 via ax.get_ylim()[0].",
      ],
      code: {
        starter: `import matplotlib\\nmatplotlib.use("Agg")  # backend non-interaktif\\nimport matplotlib.pyplot as plt\\nimport numpy as np\\n\\nbulan = ["Jan", "Feb", "Mar", "Apr", "Mei"]\\nnpl = np.array([3.1, 3.2, 3.15, 3.3, 3.6])  # persen\\n\\n# TULIS KODEMU: dua versi chart yang SAMA datanya, beda kejujurannya\\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))\\n\\nax1.plot(bulan, npl, marker="o")\\nax1.set_ylim( , )\\nax1.set_title("Versi menipu (sumbu dipotong)")\\n\\nax2.plot(bulan, npl, marker="o")\\nax2.set_ylim( , )\\nax2.set_title("Versi jujur (dari 0)")\\n\\n# Faktor pembesaran visual\\nrentang_menipu =\\nrentang_jujur =\\nfaktor =\\n\\ny0_menipu = ax1.get_ylim()[0]\\ny0_jujur = ax2.get_ylim()[0]\\nprint(f"y0_menipu={y0_menipu} y0_jujur={y0_jujur} faktor={faktor:.1f}x")\\n`,
        lockLines: 7,
        solution: `import matplotlib\\nmatplotlib.use("Agg")  # backend non-interaktif\\nimport matplotlib.pyplot as plt\\nimport numpy as np\\n\\nbulan = ["Jan", "Feb", "Mar", "Apr", "Mei"]\\nnpl = np.array([3.1, 3.2, 3.15, 3.3, 3.6])  # persen\\n\\n# TULIS KODEMU: dua versi chart yang SAMA datanya, beda kejujurannya\\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))\\n\\nax1.plot(bulan, npl, marker="o")\\nax1.set_ylim(3.0, 3.7)\\nax1.set_title("Versi menipu (sumbu dipotong)")\\n\\nax2.plot(bulan, npl, marker="o")\\nax2.set_ylim(0, npl.max() * 1.2)\\nax2.set_title("Versi jujur (dari 0)")\\n\\n# Faktor pembesaran visual: berapa kali kemiringan terlihat lebih curam\\nrentang_menipu = 3.7 - 3.0\\nrentang_jujur = npl.max() * 1.2 - 0\\nfaktor = rentang_jujur / rentang_menipu\\n\\ny0_menipu = ax1.get_ylim()[0]\\ny0_jujur = ax2.get_ylim()[0]\\nprint(f"y0_menipu={y0_menipu} y0_jujur={y0_jujur} faktor={faktor:.1f}x")\\n`,
        checks: [
          { kind: "equal", task: "t2", name: "y0_menipu", value: 3.0, tol: 1e-09, label: "`y0_menipu` = 3.0", msg: "Sumbu kiri dipotong: set_ylim(3.0, 3.7)." },
          { kind: "equal", task: "t2", name: "y0_jujur", value: 0.0, tol: 1e-09, label: "`y0_jujur` = 0.0", msg: "Sumbu kanan jujur: mulai dari 0." },
          { kind: "equal", task: "t2", name: "faktor", value: 6.2, tol: 0.05, label: "`faktor` sekitar 6.2", msg: "4.32 / 0.7 = 6.17 — kemiringan terlihat 6x lebih curam." },
          { kind: "stdout_matches", task: "t2", pattern: "faktor=6.2x", label: "Faktor tercetak", msg: "Format: faktor=6.2x." },
        ],
      },
      reference: "Satu data, dua kejujuran — faktor 6,2x. Konvensi sumbu per metrik di tim.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 8 · Intuisi",
      title: "Intuisi: chart adalah argumen, bukan ilustrasi",
      prose: [
        "Heuristik penutup: setiap chart yang kamu buat sedang berargumen — pastikan argumennya adalah yang kamu maksud.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: chart adalah argumen, bukan ilustrasi",
        body: "Chart yang baik tidak \"menampilkan data\" — ia MENJAWAB pertanyaan. Heuristik pertama: pilih chart dari pertanyaannya — perbandingan antar grup → bar, sebaran → histogram, hubungan dua variabel → scatter, komposisi → stacked bar (pie hanya untuk 2–3 kategori yang sangat beda). Salah jenis chart = menjawab pertanyaan yang tidak ditanya. Heuristik kedua: judul adalah kesimpulan, bukan label — \"NPL naik 0,5pp dalam 5 bulan (3,1% → 3,6%)\" menghemat 30 detik penjelasan per slide; \"Grafik NPL\" membuangnya. Heuristik ketiga: uji 5 detik — tutup judul, tunjukkan ke rekan, tanyakan pesannya; bila ia butuh lebih dari 5 detik, chart itu dekorasi. Heuristik keempat: ketidakpastian adalah bagian dari kejujuran — rata-rata tanpa sebaran (atau tanpa n) adalah klaim yang belum lengkap; tampilkan CI/error bar atau tulis n-nya. Heuristik kelima, yang paling senior: waspadai chart yang \"terlalu meyakinkan\" — sumbu terpotong, dual axis, 3D — dan tanyakan selalu \"bagaimana chart ini terlihat bila digambar jujur\" sebelum mempercayainya, apalagi sebelum menunjukkannya ke direksi.",
      },
      reference: "Chart dari pertanyaan; judul = kesimpulan; uji 5 detik; tampilkan ketidakpastian; curigai chart yang terlalu meyakinkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat soal campuran. Setiap opsi punya alasan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Bar chart yang jujur...",
          options: [
            { text: "Sumbu Y dari nilai minimum", why: "Itu yang membuat +15% terlihat +300%." },
            { text: "Sumbu Y dari 0", why: "Panjang batang proporsional dengan nilai hanya jika dari 0.", correct: true },
            { text: "3D agar menarik", why: "3D = chartjunk yang mengaburkan." },
            { text: "Tanpa label sumbu", why: "Tanpa label, chart tidak bisa dibaca." },
          ],
        },
        {
          q: "Pie chart sebaiknya...",
          options: [
            { text: "10+ slice", why: "Mata buruk membandingkan sudut — 10 slice tidak terbaca." },
            { text: "Maks 3-4 slice, atau pakai bar", why: "Manusia akurat membandingkan panjang, bukan sudut.", correct: true },
            { text: "3D", why: "3D memperburuk perbandingan sudut." },
            { text: "Tanpa label persen", why: "Tanpa label, slice kecil tidak terbaca." },
          ],
        },
        {
          q: "Melihat chart orang lain, cek pertama...",
          options: [
            { text: "Warna", why: "Warna tidak mengubah kesimpulan angka." },
            { text: "Sumbu (skala, mulai dari mana)", why: "5 detik cek sumbu menyelamatkan dari manipulasi.", correct: true },
            { text: "Judul", why: "Judul bisa menipu; sumbu tidak berbohong." },
            { text: "Font", why: "Font tidak relevan dengan kejujuran." },
          ],
        },
        {
          q: "Untuk tren waktu, chart yang tepat...",
          options: [
            { text: "Bar", why: "Bar untuk kategori diskret." },
            { text: "Line", why: "Kontinu = line; tertukar = menyesatkan.", correct: true },
            { text: "Pie", why: "Pie untuk komposisi, bukan tren." },
            { text: "Scatter", why: "Scatter untuk hubungan dua variabel." },
          ],
        },
      ],
      summary: [
        "Pilih: bar (kategori), line (waktu), hist/box (distribusi), scatter (hubungan).",
        "Jujur: bar dari 0; 2D; konteks penuh; nyatakan pengecualian.",
        "Grammar: data + aesthetic (x/y/hue) + geometri.",
        "1 pertanyaan = 1 chart. Maks 3-4 dimensi.",
        "Cek sumbu dulu saat membaca chart orang lain.",
      ],
      next: { label: "D8-2 — Plotly", href: "/learn/d8-visualisasi-2" },
    },
  ],
};

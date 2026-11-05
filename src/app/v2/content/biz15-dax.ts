import type { V2Lesson } from "../lib/types";

const DAXAVG_SVG = `<svg viewBox="0 0 520 300" role="img" aria-label="Rata-rata bulanan 320-360 juta vs baris total implisit 169 juta: jebakan AVERAGE.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="40" y1="20" x2="500" y2="20"/><line x1="40" y1="80" x2="500" y2="80"/><line x1="40" y1="140" x2="500" y2="140"/><line x1="40" y1="200" x2="500" y2="200"/><line x1="40" y1="260" x2="500" y2="260"/></g>
<g font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">
<rect x="58" y="47" width="55" height="213" fill="var(--c1)"/><text x="86" y="41" text-anchor="middle">320</text><text x="86" y="278" text-anchor="middle">Jan</text>
<rect x="150" y="40" width="55" height="220" fill="var(--c1)"/><text x="178" y="34" text-anchor="middle">330</text><text x="178" y="278" text-anchor="middle">Feb</text>
<rect x="242" y="33" width="55" height="227" fill="var(--c1)"/><text x="270" y="27" text-anchor="middle">340</text><text x="270" y="278" text-anchor="middle">Mar</text>
<rect x="334" y="20" width="55" height="240" fill="var(--c1)"/><text x="362" y="14" text-anchor="middle">360</text><text x="362" y="278" text-anchor="middle">Apr</text>
<rect x="426" y="147" width="55" height="113" fill="var(--error)"/><text x="454" y="141" text-anchor="middle">169</text><text x="454" y="278" text-anchor="middle">Total (implisit)</text>
</g>
<text x="40" y="294" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">juta Rp</text>
</svg>`;
export const biz15: V2Lesson = {
  slug: "biz15-dax",
  track: "Business Intelligence",
  module: "Power BI Mendalam",
  title: "BI15 — DAX: Ukuran yang Tahu Konteks",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua analis, satu data, dua angka",
      prose: [
        "Rapat direksi PT MajuLogistik, slide 5: 'Penjualan Q1 2026 = Rp990 juta'. Slide 8: 'Penjualan Q1 2026 = Rp1.350 juta'. Satu perusahaan, satu kuartal, dua angka — dan keduanya diklaim berasal dari measure yang SAMA: [Total Penjualan]. Ruangan hening. CFO menatap tim BI seperti menatap pesulap yang triknya terbongkar.",
        "Investigasi 20 menit menemukan pelakunya — bukan rumus yang salah, melainkan slicer bulan. Slide 5 punya filter Jan–Mar; slide 8 tidak sengaja mencakup April (slicer 'tahun 2026' tanpa filter bulan). Measure-nya identik: SUM(Sales[amount]). Angkanya beda karena KONTEKS-nya beda.",
        "Twist yang mengubah cara pandang: di DAX tidak ada yang namanya 'angka penjualan'. Yang ada hanya 'cara menghitung penjualan DALAM KONTEKS'. Rumus yang sama + konteks berbeda = angka berbeda — dan itu BUKAN bug, itu desain. Analis yang tidak melihat konteks sedang membaca setengah rumus.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan filter context dan row context dengan contoh konkret; (2) menulis measure yang benar (bukan calculated column yang salah tempat); (3) memakai CALCULATE untuk memodifikasi konteks; (4) menghitung YTD/YoY dengan time intelligence — plus tabel Date yang wajib ada.",
      ],
      tasks: [],
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa:",
        "(1) Membedakan measure vs calculated column: kapan memakai yang mana, dan apa harga salah pilih;",
        "(2) Menjelaskan filter context — kenapa visual, slicer, dan baris total mengubah hasil measure yang sama;",
        "(3) Menulis CALCULATE untuk menimpa/menambah filter secara eksplisit;",
        "(4) Membangun time intelligence (YTD, YoY) dengan syarat tabel Date yang kontinu;",
        "(5) Mendeteksi jebakan klasik: total implisit AVERAGE dan filter yang 'bocor' antar visual.",
      ],
      tasks: [],
    },
    {
      id: "konteks",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Measure: koki yang memasak sesuai pesanan",
      prose: [
        "Bayangkan measure sebagai koki, bukan sebagai resep beku. Calculated column = makanan kaleng: dimasak sekali saat data di-load, isinya tetap apa pun yang dipesan. Measure = koki yang memasak SETELAH melihat pesanan (konteks): 'total untuk region Barat, bulan Maret' — baru ia menghitung.",
        "Filter context adalah 'pesanan' itu: kumpulan filter yang aktif saat measure dievaluasi — dari slicer, dari baris/kolom visual, dari CALCULATE. SUM(Sales[amount]) tidak berarti 'jumlah semua'; ia berarti 'jumlah dari baris yang LOLOS filter context saat ini'.",
        "Contoh langkah-demi-langkah: visual tabel dengan baris Region. (a) Pada baris 'Barat', filter context = {Region=Barat}; measure menjumlahkan hanya baris Barat = 570. (b) Pada baris 'Total', filter context = {} (tidak ada filter region); measure menjumlahkan semua = 1.350. Rumus SAMA, konteks BEDA, hasil BEDA.",
        "💡 Intuisi kunci: kalau measure-mu 'kadang benar kadang salah', jangan debug rumusnya dulu — debug KONTEKS-nya. Tampilkan filter context (slicer apa yang aktif? visual ini memfilter apa?) sebelum menyentuh DAX-nya.",
        "Kapan memakai: SEMUA agregat yang harus responsif terhadap slicer/visual = measure. Aturannya satu kalimat: apakah angkanya harus berubah saat user mengklik slicer? Ya → measure. Tidak → bukan measure.",
      ],
      formula: String.raw`M = f(C)`,
      formulaNote:
        "M = hasil measure; C = filter context (filter dari visual + slicer + CALCULATE); f = logika agregat. Measure tidak menyimpan angka — ia menyimpan CARA menghitung sebagai fungsi dari konteks. Ganti C, berubah M — tanpa mengubah f.",
      note: {
        title: "🚨 Miskonsepsi: DAX = rumus Excel yang lebih panjang",
        body: "Di Excel, =SUM(A:A) selalu menjumlah kolom A — konteksnya tetap (sel tempat rumus ditulis). Di DAX, SUM(Sales[amount]) sebagai measure TIDAK punya arti sampai dievaluasi dalam konteks. Rumus Excel = nilai; measure DAX = fungsi dari konteks. Memperlakukan measure seperti rumus Excel ('kan rumusnya sama, harusnya angkanya sama') adalah sumber 80% kebingungan DAX.",
      },
      tasks: [],
    },
    {
      id: "calculate",
      eyebrow: "Langkah 4 · CALCULATE",
      title: "CALCULATE: mesin penjelajah konteks",
      prose: [
        "Jika filter context adalah 'pesanan', CALCULATE adalah 'cara mengubah pesanan'. Sintaks: CALCULATE(<measure>, <filter1>, <filter2>, ...). Ia mengevaluasi measure dalam konteks yang DIMODIFIKASI — menambah, menimpa, atau menghapus filter.",
        "Contoh: [Total] = 1.350 (tanpa filter). CALCULATE([Total], Sales[Region]=\"Barat\") = 570 — filter context asli ditambah Region=Barat. CALCULATE([Total], ALL(Sales)) = 1.350 bahkan di dalam visual yang terfilter — ALL menghapus filter.",
        "Contoh langkah-demi-langkah (dari lab): total_barat = measure(lambda r: r[1]==\"Barat\") — persis CALCULATE: ambil logika [Total], terapkan dalam konteks baru. ytd_mar = measure(lambda r: r[0]<=\"2026-03-31\") — filter tanggal menggantikan konteks bulan visual.",
        "💡 Intuisi kunci: CALCULATE adalah 80% DAX profesional. Hampir semua yang 'canggih' (YTD, YoY, % of total, ranking) = CALCULATE + fungsi filter. Kuasai satu fungsi ini dalam-dalam, sisanya adalah kosakata.",
        "Kapan memakai: butuh angka yang 'melanggar' konteks visual — total keseluruhan di samping subtotal (% of total), YTD di samping bulanan, tahun lalu di samping tahun ini. Kalau angkanya harus mengabaikan filter yang ada → CALCULATE + ALL/REMOVEFILTERS.",
      ],
      formula: String.raw`\text{Barat} = \text{CALCULATE}([\text{Total}],\ \text{Region}=\text{'Barat'})`,
      formulaNote:
        "Dibaca: 'hitung [Total] dalam konteks di mana Region=Barat'. CALCULATE memodifikasi filter context: filter baru DITAMBAHKAN ke konteks yang ada (kecuali ditimpa eksplisit). Hasil lab: 570 = 120+150+130+170.",
      note: {
        title: "🚨 Miskonsepsi: SUM di DAX sama dengan SUM di Excel",
        body: "SUM(Sales[amount]) di dalam calculated column = jumlah per BARIS? Bukan — di row context, SUM mengagregat SELURUH kolom (konteks baris tidak otomatis jadi filter!). Inilah jebakan paling klasik: calculated column [Total2] = SUM(Sales[amount]) menghasilkan 1.350 di SEMUA baris. Yang benar untuk per-baris: Sales[amount] langsung (row context), atau SUMX untuk iterasi. SUM yang sama, konteks berbeda, arti berbeda.",
      },
      tasks: [],
    },
    {
      id: "jebakan-total",
      eyebrow: "Langkah 5 · Visual",
      title: "Jebakan baris total: 169 vs 337,5",
      prose: [
        "Cara membaca: empat batang = rata-rata penjualan per bulan (Jan 320, Feb 330, Mar 340, Apr 360 — dalam juta Rp). Batang merah kelima = 'Total (implisit)': 169 — nilai yang ditampilkan Power BI di baris total jika measure-nya AVERAGE(Sales[amount]).",
        "Interpretasi: 169 BUKAN rata-rata dari (320, 330, 340, 360) — yang itu 337,5. 169 = total SEMUA baris (1.350) dibagi 8 baris transaksi. Baris total punya filter context-nya SENDIRI (semua baris), bukan 'rata-rata dari subtotal di atasnya'. Inilah kenapa total implisit untuk AVERAGE hampir selalu menyesatkan — dan kenapa measure rata-rata yang benar ditulis eksplisit: DIVIDE([Total], DISTINCTCOUNT(...)).",
        "💡 Intuisi kunci: baris total BUKAN jumlah/rata-rata dari angka-angka di atasnya. Ia adalah evaluasi ulang measure dalam konteks 'tanpa filter baris'. Kalau measure-mu tidak masuk akal di baris total, measure-mu belum benar — bukan visualnya yang salah.",
      ],
      figure: {
        svg: DAXAVG_SVG,
        alt: "Rata-rata bulanan 320-360 juta vs baris total implisit 169 juta: jebakan AVERAGE.",
        caption:
          "Jebakan klasik DAX: baris total mengevaluasi ulang measure dalam konteksnya sendiri — bukan meringkas angka di atasnya.",
      },
      tasks: [],
    },
    {
      id: "time-intel",
      eyebrow: "Langkah 6 · Time intelligence",
      title: "YTD, YoY, dan tabel Date yang wajib ada",
      prose: [
        "Time intelligence = fungsi DAX yang 'paham kalender': DATESYTD (dari awal tahun s.d. tanggal konteks), SAMEPERIODLASTYEAR (periode yang sama tahun lalu), DATEADD (geser N bulan). Contoh: [YTD] = CALCULATE([Total], DATESYTD('Date'[Date])). Pada konteks Maret 2026 → 990 (Jan–Mar). Pada konteks April → 1.350.",
        "Syarat yang tidak bisa ditawar: tabel DATE yang kontinu (tidak boleh ada tanggal bolong) dan berelasi ke tabel fact. Tanpa tabel Date, DATESYTD mengembalikan angka ngawur DIAM-DIAM — tidak error, hanya salah. Inilah 'pajak' time intelligence: satu tabel kecil yang menyelamatkan semua perhitungan waktu.",
        "Contoh langkah-demi-langkah (YoY yang benar): [YoY %] = DIVIDE([Total] - CALCULATE([Total], SAMEPERIODLASTYEAR('Date'[Date])), CALCULATE([Total], SAMEPERIODLASTYEAR('Date'[Date]))). Q1 2026 (990) vs Q1 2025 (910) = +8,8%. Bandingkan PERIODE SAMA — bukan YTD vs full-year (lihat mini-case).",
        "💡 Intuisi kunci: setiap kali melihat perbandingan waktu yang 'aneh' (turun 74% padahal bisnis baik-baik saja), curigai dulu PERIODE-nya, bukan datanya. 90% 'anomali YoY' = YTD dibandingkan dengan full-year.",
        "Kapan memakai: SEMUA perbandingan waktu (YTD, MTD, YoY, MoM) = time intelligence + tabel Date. Jangan hitung manual dengan filter bulan (rapuh saat tahun berganti); serahkan ke fungsi yang paham kalender.",
      ],
      formula: String.raw`\text{YTD}_m = \sum_{t \le m} S_t \qquad \text{YoY} = \frac{S_m - S_{m-12}}{S_{m-12}}`,
      formulaNote:
        "YTD bulan m = jumlah penjualan S_t untuk semua bulan t ≤ m dalam tahun kalender yang sama (DATESYTD). YoY = (bulan ini − bulan yang sama tahun lalu) / bulan yang sama tahun lalu (SAMEPERIODLASTYEAR). Keduanya butuh tabel Date kontinu.",
      tasks: [],
    },
    {
      id: "lab-konteks",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: mesin filter-context mini",
      prose: [
        "Kamu akan menirukan cara DAX berpikir: measure = fungsi dari filter context. Data penjualan 8 baris (Jan–Apr 2026) sudah disediakan.",
        "Tugasmu: tulis fungsi measure(pred) yang menjumlahkan amount untuk baris yang lolos predikat — lalu pakai untuk tiga konteks: tanpa filter (total), filter Region='Barat' (tiruan CALCULATE), dan filter tanggal ≤ 2026-03-31 (tiruan DATESYTD).",
        "Coba juga: hitung ytd_apr (≤ 2026-04-30) dan YoY Maret (butuh data 2025 — apa yang terjadi tanpa tabel Date? Inilah kenapa time intelligence butuh tabel Date kontinu).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total`: measure tanpa filter (tirukan SUM)" },
        { id: "t2", text: "Hitung `total_barat`: measure dengan filter Region='Barat' (tirukan CALCULATE)" },
        { id: "t3", text: "Hitung `ytd_mar`: measure dengan filter tanggal ≤ 2026-03-31 (tirukan DATESYTD)" },
      ],
      expected: "total=1350  total_barat=570  ytd_mar=990",
      note: {
        title: "Sering salah",
        body: "Menjumlahkan SEMUA baris untuk total_barat ('kan measure-nya sama'). Measure yang sama + konteks beda = angka beda. Itulah pelajarannya — filter context HARUS diterapkan sebelum agregat.",
      },
      hints: [
        "measure(pred): sum amount baris yang pred(r) True; pred None = semua.",
        "total_barat: pred = lambda r: r[1] == 'Barat'.",
        "ytd_mar: pred = lambda r: r[0] <= '2026-03-31' (string tanggal ISO bisa dibandingkan).",
      ],
      code: {
        starter: `# Penjualan 2026: (tanggal, region, amount_jt)\nSALES = [\n    ("2026-01-05", "Barat", 120), ("2026-01-18", "Timur", 200),\n    ("2026-02-03", "Barat", 150), ("2026-02-20", "Timur", 180),\n    ("2026-03-02", "Barat", 130), ("2026-03-25", "Timur", 210),\n    ("2026-04-08", "Barat", 170), ("2026-04-19", "Timur", 190),\n]\n# DAX: Total = SUM(Sales[amount])  -- measure, dievaluasi dalam filter context\n# TULIS KODEMU: total, total_barat, ytd_mar\ndef measure(pred=None):\n    ...\n\ntotal = ...\ntotal_barat = ...\nytd_mar = ...\n\nprint(f"total={total}  total_barat={total_barat}  ytd_mar={ytd_mar}")\n`,
        lockLines: 8,
        solution: `# Penjualan 2026: (tanggal, region, amount_jt)\nSALES = [\n    ("2026-01-05", "Barat", 120), ("2026-01-18", "Timur", 200),\n    ("2026-02-03", "Barat", 150), ("2026-02-20", "Timur", 180),\n    ("2026-03-02", "Barat", 130), ("2026-03-25", "Timur", 210),\n    ("2026-04-08", "Barat", 170), ("2026-04-19", "Timur", 190),\n]\n# DAX: Total = SUM(Sales[amount])  -- measure, dievaluasi dalam filter context\n\n# TULIS KODEMU: total, total_barat, ytd_mar\n# (tirukan DAX: filter context = predikat yang memfilter baris SEBELUM agregat)\ndef measure(pred=None):\n    return sum(a for _, _, a in (r for r in SALES if pred is None or pred(r)))\n\ntotal = measure()                                            # tanpa filter\ntotal_barat = measure(lambda r: r[1] == "Barat")              # CALCULATE([Total], Region="Barat")\nytd_mar = measure(lambda r: r[0] <= "2026-03-31")             # DATESYTD s.d. Maret\n\nprint(f"total={total}  total_barat={total_barat}  ytd_mar={ytd_mar}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: 1350, label: "`total` = 1350", msg: "SUM tanpa filter: 8 baris." },
          { kind: "equal", task: "t2", name: "total_barat", value: 570, label: "`total_barat` = 570", msg: "CALCULATE dengan Region=Barat: 120+150+130+170." },
          { kind: "equal", task: "t3", name: "ytd_mar", value: 990, label: "`ytd_mar` = 990", msg: "DATESYTD s.d. Maret: 320+330+340." },
          { kind: "stdout_matches", task: "t3", pattern: "total=1350  total_barat=570  ytd_mar=990", label: "output lengkap benar", msg: "Samakan format print." },
        ],
      },
      reference: "Filter context DAX: agregat setelah filter — tiruan Python dari CALCULATE.",
    },    {
      id: "lab2-yoy",
      eyebrow: "Langkah 8 · Lab",
      title: "Lab: kalkulator YoY",
      prose: [
        "Time intelligence kedua: Year-over-Year. Dengan data bulanan 2025 vs 2026, hitung YoY% tiap bulan — tiruan SAMEPERIODLASTYEAR.",
        "Tugasmu: bangun dict yoy {bulan: persen}, hitung pertumbuhan Q1 (Jan–Mar), dan tentukan bulan dengan YoY tertinggi.",
        "Coba juga: apa yang terjadi jika April 2025 tidak ada datanya (tanggal bolong)? YoY April menjadi tidak terdefinisi — inilah kenapa tabel Date harus kontinu.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `yoy`: dict bulan → YoY% (1 desimal)" },
        { id: "t2", text: "Hitung `q1_growth`: pertumbuhan Q1 2026 vs Q1 2025" },
        { id: "t3", text: "Tentukan `terbaik`: bulan dengan YoY tertinggi" },
      ],
      expected: "q1_growth=8.8  terbaik=01",
      note: {
        title: "Sering salah",
        body: "Membagi dengan 2026 (tahun berjalan) sebagai penyebut. YoY = (baru − lama) / LAMA — penyebutnya selalu periode pembanding.",
      },
      hints: [
        "Loop zip(S2025, S2026); yoy[bulan] = (v26-v25)/v25*100.",
        "q1 = sum 3 bulan pertama tiap tahun.",
        "max(yoy, key=yoy.get).",
      ],
      code: {
        starter: `# Penjualan bulanan (juta Rp): 2025 vs 2026\nS2025 = [("2025-01", 290), ("2025-02", 310), ("2025-03", 310), ("2025-04", 330)]\nS2026 = [("2026-01", 320), ("2026-02", 330), ("2026-03", 340), ("2026-04", 360)]\n# DAX: YoY % = DIVIDE([Total] - CALCULATE([Total], SAMEPERIODLASTYEAR(Date[Date])),\n#                     CALCULATE([Total], SAMEPERIODLASTYEAR(Date[Date])))\n# TULIS KODEMU: yoy, q1_growth, terbaik\nyoy = {}\nq1_growth = 0.0\nterbaik = ''\n\nprint(f"yoy={yoy}")\nprint(f"q1_growth={q1_growth}  terbaik={terbaik}")\n`,
        lockLines: 5,
        solution: `# Penjualan bulanan (juta Rp): 2025 vs 2026\nS2025 = [("2025-01", 290), ("2025-02", 310), ("2025-03", 310), ("2025-04", 330)]\nS2026 = [("2026-01", 320), ("2026-02", 330), ("2026-03", 340), ("2026-04", 360)]\n# DAX: YoY % = DIVIDE([Total] - CALCULATE([Total], SAMEPERIODLASTYEAR(Date[Date])),\n#                     CALCULATE([Total], SAMEPERIODLASTYEAR(Date[Date])))\n\n# TULIS KODEMU: yoy, q1_growth, terbaik\nyoy = {}\nfor (b25, v25), (b26, v26) in zip(S2025, S2026):\n    bln = b26[-2:]\n    yoy[bln] = round((v26 - v25) / v25 * 100, 1)\nq1_2025 = sum(v for _, v in S2025[:3]); q1_2026 = sum(v for _, v in S2026[:3])\nq1_growth = round((q1_2026 - q1_2025) / q1_2025 * 100, 1)\nterbaik = max(yoy, key=yoy.get)\n\nprint(f"yoy={yoy}")\nprint(f"q1_growth={q1_growth}  terbaik={terbaik}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "'01': 10\\.3, '02': 6\\.5, '03': 9\\.7, '04': 9\\.1", label: "yoy per bulan benar", msg: "DIVIDE((2026-2025)/2025) per bulan." },
          { kind: "equal", task: "t2", name: "q1_growth", value: 8.8, tol: 0.05, label: "`q1_growth` = 8,8", msg: "(990-910)/910." },
          { kind: "equal", task: "t3", name: "terbaik", value: "01", label: "`terbaik` = 01", msg: "YoY tertinggi: Januari 10,3%." },
        ],
      },
      reference: "SAMEPERIODLASTYEAR: (periode ini − periode sama tahun lalu) / periode tahun lalu.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 9 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Jangan tulis filter di dalam SUM — bungkus dengan CALCULATE. CALCULATE([Total], Region=\"Barat\") terbaca sebagai 'total dalam konteks Barat'; SUMX(FILTER(...)) menyembunyikan konteks di dalam rumus. Eksplisit > pintar.",
        "💡 Selalu punya tabel Date — bahkan jika 'sudah ada kolom tanggal di fact'. Kolom tanggal fact berlubang (hari tanpa transaksi); time intelligence butuh kalender kontinu. Satu tabel kecil, 10 tahun tanggal = fondasi semua YTD/YoY.",
        "💡 Uji measure-mu di tiga tempat: satu sel visual (konteks sempit), baris total (konteks lebar), dan kartu KPI (konteks kosong). Measure yang benar di ketiganya = measure yang memahami konteks.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kolom kalkulasi dan measure hidup di dua dunia berbeda",
        body: "DAX punya dua dunia yang tidak saling mendengar — dan sebagian besar kebingungan DAX berasal dari tidak tahu sedang berada di dunia yang mana. Dunia pertama: row context — \"baris ini\". Ia hidup di calculated column dan fungsi iterator (SUMX, FILTER): untuk tiap baris, hitung sesuatu. Dunia kedua: filter context — \"filter yang sedang aktif\". Ia hidup di measure: visual, slicer, dan baris total menentukan filter, lalu measure menghitung di dalamnya. Jebakan klasiknya: memanggil measure di dalam calculated column dan heran kenapa semua baris nilainya sama — karena calculated column tidak punya filter context per baris; measure di sana dihitung dalam konteks kosong, sekali, lalu diulang. Heuristik praktisinya: butuh \"untuk tiap baris, agregatkan sesuatu\" → pakai iterator X (SUMX/AVERAGEX), jangan berharap measure mengerti baris. Butuh \"angka ini harus berubah saat user memfilter\" → measure, jangan calculated column. Uji tiga detiknya: tanyakan \"apakah hasilku seharusnya BERBEDA untuk tiap baris?\" Ya → kamu butuh row context (iterator/kolom). \"Apakah hasilnya harus berubah saat filter berubah?\" Ya → filter context (measure). Kalau jawaban keduanya ya — misalnya total per kategori yang responsif terhadap slicer — bungkus iterator di dalam measure: SUMX(VALUES(Kategori), [MeasureKu]). Pola ini menyelesaikan separuh kasus DAX yang \"aneh\". Dan CALCULATE? Ia adalah jembatan antar dunia: memodifikasi filter context dari dalam measure. Kuasai dulu dua dunianya — jembatannya jadi intuitif.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: measure, kolom, atau Power Query?",
      prose: [
        "Skenario 1 — Agregat harus berubah saat user klik slicer (total penjualan per filter). → MEASURE. Alasan: measure dievaluasi dalam filter context visual. Contoh: [Total] = SUM(Sales[amount]).",
        "Skenario 2 — Nilai per baris untuk filter/sort/axis (kategori harga per produk). → CALCULATED COLUMN (row context). Alasan: dihitung sekali saat load, bisa dipakai sebagai filter. Harga: menambah ukuran model.",
        "Skenario 3 — Transformasi data sebelum analisis (bersihkan, gabung tabel). → POWER QUERY (biz16). Alasan: DAX bukan alat transformasi; M adalah. Jangan pakai calculated column untuk pekerjaan Power Query.",
        "Skenario 4 — Perbandingan waktu (YTD, YoY, MoM). → MEASURE + CALCULATE + tabel Date. Alasan: time intelligence butuh konteks tanggal dinamis — calculated column (statis) tidak bisa.",
        "Skenario 5 — Filter kompleks sekali pakai di satu measure. → FILTER di dalam CALCULATE. Alasan: tidak perlu kolom bantu; konteks tertulis eksplisit di measure.",
        "Aturan praktis 10 detik: tanya 'haruskah angka ini berubah saat slicer diklik?' Ya → measure. Tidak → calculated column. 'Haruskah ini terjadi sebelum data masuk model?' Ya → Power Query.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Mini-case: penurunan 74% yang tidak pernah terjadi",
      prose: [
        "PT MajuLogistik, April 2026. Laporan: 'Penjualan turun 74%!'. Angkanya: YTD Mar 2026 = Rp990 juta vs full-year 2025 = Rp3.800 juta. Direksi panik, rapat darurat dijadwalkan, ekspansi ditunda.",
        "Analis BI memeriksa: pembandingnya SALAH. YTD (3 bulan) dibandingkan dengan full-year (12 bulan) — tentu saja 'turun'. Pembanding yang benar: YTD Mar 2025 = Rp910 juta (dari tabel Date + SAMEPERIODLASTYEAR). Growth sebenarnya: (990 − 910) / 910 = +8,8%. Bisnis TUMBUH hampir 9%, bukan runtuh 74%.",
        "Biaya kesalahan: satu rapat darurat (12 orang × 2 jam × Rp300 ribu = Rp7,2 juta) + keputusan ekspansi yang nyaris dibatalkan (nilai opsi: ratusan juta). Akar masalah: tidak ada measure [YTD] dan [YoY] kanonis — tiap analis menghitung manual dengan filter bulan.",
        "Pembahasan: (a) selalu bandingkan periode SAMA (YTD vs YTD, bukan YTD vs full-year); (b) sediakan measure time intelligence kanonis di model (satu definisi, dipakai semua — pelajaran BI11); (c) tabel Date kontinu adalah prasyarat, bukan aksesori.",
        "💡 Intuisi kunci: 'penurunan' terbesar dalam BI hampir selalu artefak periode, bukan fakta bisnis. Sebelum panik, tanyakan: 'dibandingkan dengan apa, tepatnya?'",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Pertanyaan tentang lesson ini. Setiap opsi menjelaskan alasannya — baca semua why meski jawabanmu benar.",
      ],
      tasks: [],
      summary: [
        "Measure = fungsi dari filter context: rumus sama + konteks beda = angka beda.",
        "Calculated column (row context, statis) untuk filter/sort; measure (filter context, dinamis) untuk agregat responsif.",
        "CALCULATE memodifikasi konteks: filter baru menimpa filter lama pada kolom yang sama.",
        "Baris total mengevaluasi ulang measure dalam konteksnya sendiri — bukan meringkas angka di atasnya.",
        "Time intelligence wajib tabel Date kontinu; YTD vs full-year adalah perbandingan yang tidak sah.",
      ],
      next: { label: "BI16 — Power Query: Dapur Data", href: "/v2/learn/biz16-power-query" },
      quiz: [
        {
          q: "Measure [Total]=SUM(Sales[amount]) dipasang di visual tabel dengan baris Region. Pada baris 'Barat' nilainya 570, pada baris 'Total' 1.350. Penjelasan yang benar?",
          options: [
            { text: "Rumusnya error di baris Total", why: "Bukan error — baris Total mengevaluasi measure dalam filter context {} (tanpa filter region). 1.350 = jumlah semua baris. Inilah desain DAX, bukan bug." },
            { text: "Filter context berbeda: baris Barat = {Region=Barat}, baris Total = {}", why: "Tepat: measure yang sama, konteks berbeda, hasil berbeda. Baris Barat menjumlahkan 4 baris Barat (570); baris Total menjumlahkan 8 baris (1.350). Memahami ini = memahami 80% DAX.", correct: true },
            { text: "Harusnya 570 juga di baris Total", why: "Baris total BUKAN penjumlahan angka-angka di atasnya — ia evaluasi ulang dalam konteksnya sendiri. 'Harusnya sama' = mental model Excel yang tidak berlaku di DAX." },
            { text: "Data Barat terduplikasi", why: "Tidak ada duplikasi; 570 + 780 (Timur) = 1.350. Konsisten." },
          ],
        },
        {
          q: "Kapan memakai calculated column BUKAN measure?",
          options: [
            { text: "Saat angkanya harus berubah mengikuti slicer", why: "Itu definisi measure. Calculated column dihitung sekali saat load — ia tidak merespons slicer." },
            { text: "Saat butuh nilai per baris untuk dipakai sebagai filter/sort/axis kategori", why: "Tepat: calculated column hidup di row context, dihitung saat refresh, tersimpan di model — sehingga bisa dipakai memfilter, mengurut, menjadi axis. Harganya: ukuran model bertambah.", correct: true },
            { text: "Saat butuh YTD", why: "YTD butuh konteks tanggal dinamis → measure + CALCULATE + tabel Date. Calculated column (statis) tidak bisa." },
            { text: "Tidak pernah — measure selalu lebih baik", why: "'Selalu' salah: measure tidak bisa dipakai sebagai slicer/axis. Tiap alat punya tempatnya (lihat peta keputusan)." },
          ],
        },
        {
          q: "CALCULATE([Total], Sales[Region]=\"Barat\") menghasilkan 570 di dalam visual yang sedang memfilter Region=\"Timur\". Kenapa?",
          options: [
            { text: "CALCULATE menimpa filter Region yang ada dengan Barat", why: "Tepat: filter baru pada kolom yang SAMA menimpa filter lama (kecuali memakai KEEPFILTERS). Konteks {Region=Timur} + filter {Region=Barat} → {Region=Barat}. Hasil 570.", correct: true },
            { text: "Bug — harusnya 0 (Timur ∩ Barat = kosong)", why: "Bukan bug: semantik DAX = filter pada kolom sama MENIMPA, bukan beririsan. 'Harusnya 0' = ekspektasi logika himpunan yang tidak berlaku di sini." },
            { text: "CALCULATE menjumlahkan keduanya (570+780)", why: "Tidak: filter menimpa, bukan menggabungkan. 1.350 hanya jika memakai ALL/REMOVEFILTERS." },
            { text: "Visualnya rusak", why: "Visual baik-baik saja; yang perlu dipahami adalah semantik penimpaan filter CALCULATE." },
          ],
        },
        {
          q: "Time intelligence (DATESYTD, SAMEPERIODLASTYEAR) mensyaratkan tabel Date yang kontinu. Kenapa?",
          options: [
            { text: "Agar query lebih cepat", why: "Kecepatan bukan alasannya — tabel Date kecil (3.650 baris/10 tahun), dampak performa minimal." },
            { text: "Fungsi time intelligence bernavigasi pada kalender kontinu; tanggal bolong = periode hilang diam-diam", why: "Tepat: DATESYTD menghitung '1 Jan s.d. konteks' — jika tabel Date bolong (hari tanpa transaksi), navigasinya melompati hari dan hasilnya salah TANPA error. Kontinu = tidak ada tanggal yang hilang.", correct: true },
            { text: "Syarat lisensi Power BI", why: "Tidak ada syarat lisensi semacam itu. Ini syarat kebenaran, bukan administrasi." },
            { text: "Agar bisa join ke banyak fact", why: "Satu tabel Date untuk banyak fact memang praktik baik (conformed dimension), tetapi bukan alasan syarat kontinuitasnya." },
          ],
        },
        {
          q: "Manajer meminta 'rata-rata penjualan per bulan' dan memakai AVERAGE(Sales[amount]). Baris total menunjukkan 169, padahal rata-rata 4 bulan = 337,5. Solusi yang benar?",
          options: [
            { text: "Ganti ke SUM", why: "SUM menjawab pertanyaan berbeda ('berapa totalnya'). Masalahnya bukan fungsi yang salah, melainkan konteks baris total." },
            { text: "Tulis measure eksplisit: DIVIDE([Total], DISTINCTCOUNT bulan) agar baris total dihitung dengan benar", why: "Tepat: AVERAGE implisit di baris total = total semua baris / jumlah baris transaksi (1.350/8 = 168,75). Measure eksplisit mendefinisikan 'rata-rata per bulan' = [Total] / jumlah bulan — benar di tiap baris MAUPUN di total.", correct: true },
            { text: "Sembunyikan baris total", why: "Menyembunyikan gejala, bukan menyembuhkan. Pengguna lain akan menemukan 169 itu di tempat lain." },
            { text: "Rata-ratakan manual di Excel", why: "Ekspor ke Excel = menyerah pada masalah dan menciptakan dua kebenaran. Perbaiki di model." },
          ],
        },
      ],
    },
  ],
};

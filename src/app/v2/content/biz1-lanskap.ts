import type { V2Lesson } from "../lib/types";

// Bar chart: total views per dashboard selama 90 hari (data lab, seed 7).
// Skala linear 0..420; Executive 360 (3 views, biaya Rp180 jt) disorot merah.
const VIEWS_SVG = `<svg viewBox="0 0 520 300" role="img" aria-label="Bar chart: Penjualan Harian 414 views, Executive 360 hanya 3 views.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="150" y1="16" x2="500" y2="16"/><line x1="150" y1="56" x2="500" y2="56"/><line x1="150" y1="96" x2="500" y2="96"/><line x1="150" y1="136" x2="500" y2="136"/><line x1="150" y1="176" x2="500" y2="176"/><line x1="150" y1="216" x2="500" y2="216"/><line x1="150" y1="256" x2="500" y2="256"/></g>
<g font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">
<text x="140" y="35" text-anchor="end">Penjualan Harian</text><rect x="150" y="20" width="345" height="18" fill="var(--c1)"/><text x="500" y="34" text-anchor="end" fill="var(--bg-app)" font-weight="600">414</text>
<text x="140" y="75" text-anchor="end">Stok Gudang</text><rect x="150" y="60" width="82.5" height="18" fill="var(--c1)"/><text x="238" y="74">99</text>
<text x="140" y="115" text-anchor="end">Marketing Funnel</text><rect x="150" y="100" width="30" height="18" fill="var(--c1)"/><text x="186" y="114">36</text>
<text x="140" y="155" text-anchor="end">Executive 360</text><rect x="150" y="140" width="3" height="18" fill="var(--error)"/><text x="160" y="154" fill="var(--error)" font-weight="600">3</text>
<text x="140" y="195" text-anchor="end">HR Attrition</text><rect x="150" y="180" width="45" height="18" fill="var(--c1)"/><text x="201" y="194">54</text>
<text x="140" y="235" text-anchor="end">Finance Close</text><rect x="150" y="220" width="165" height="18" fill="var(--c1)"/><text x="321" y="234">198</text>
<text x="140" y="275" text-anchor="end">CSAT Real-time</text><rect x="150" y="260" width="105" height="18" fill="var(--c1)"/><text x="261" y="274">126</text>
</g>
<text x="150" y="294" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0</text><text x="495" y="294" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="end">420 views / 90 hari</text>
</svg>`;

export const biz1: V2Lesson = {
  slug: "biz1-lanskap",
  track: "Business Intelligence",
  module: "Fondasi BI",
  title: "BI1 — BI: Dari Data ke Keputusan",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dashboard Rp180 juta yang dibuka 3 kali",
      prose: [
        "PT SinarJaya Ritel punya 8 dashboard. Yang paling mahal — Executive 360, dibuat konsultan seharga Rp180 juta, 6 bulan pengerjaan, 23 KPI, animasi 3D — dibuka tepat 3 kali dalam 90 hari. Dua kali oleh pembuatnya sendiri, sekali oleh direksi yang salah klik.",
        "Sementara itu dashboard Penjualan Harian — dibuat intern magang dalam 4 hari, biaya nyaris nol, satu layar, lima angka — dibuka 414 kali dalam 90 hari yang sama. Kasir, supervisor, sampai direktur operasional mengeceknya tiap pagi seperti mengecek cuaca.",
        "Twist-nya: yang mahal bukan gagal karena datanya salah. Datanya benar. Ia gagal karena tidak menjawab pertanyaan siapa pun. Dashboard termurah menang bukan karena murah, melainkan karena ia lahir dari satu pertanyaan nyata: \u201CHari ini kita jual berapa, dan kurang berapa dari target?\u201D",
        "Itulah inti Business Intelligence: BI bukan pabrik grafik. BI adalah sistem pendukung keputusan — rantai dari data mentah menjadi keputusan yang diambil seseorang, tepat waktu. Dashboard yang tidak mengubah satu keputusan pun adalah biaya, bukan aset.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan apa itu BI sebagai rantai keputusan, bukan sekadar reporting; (2) mengukur kesehatan BI dengan adoption rate dan mendeteksi zombie dashboard; (3) memilih medium yang tepat — dashboard, laporan terjadwal, alert, atau analisis ad-hoc — untuk tiap jenis keputusan.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan BI sebagai rantai lima mata (sumber → model → metrik → sajian → keputusan) dan menunjuk mata mana yang putus pada kasus nyata.",
        "(1) Menghitung adoption rate dan biaya terbuang dashboard zombie dari view log; (2) menerapkan ambang zombie (< 10 views/90 hari) sebagai kebijakan audit portofolio;",
        "(3) Memilih medium konsumsi yang tepat — dashboard, laporan terjadwal, alert, atau ad-hoc — dari frekuensi keputusan penggunanya;",
        "(4) Menjelaskan kenapa 'umur paruh' adopsi menentukan nasib dashboard sejak minggu pertama.",
      ],
      tasks: [],
    },

    {
      id: "rantai-bi",
      eyebrow: "Langkah 3 · Rantai BI",
      title: "BI adalah rantai, bukan tumpukan tools",
      prose: [
        "Bayangkan BI sebagai rantai lima mata: sumber data → pemodelan → metrik → penyajian → keputusan. Rantai ini hanya sekuat mata terlemahnya. Data sempurna yang tidak pernah dibaca sama nilainya dengan tidak punya data.",
        "Setiap mata punya pertanyaan uji. Sumber: apakah datanya bisa dipercaya? Pemodelan: apakah angka ini dihitung dengan benar? Metrik: apakah definisinya disepakati? Penyajian: apakah orang yang tepat melihatnya tepat waktu? Keputusan: apakah ada keputusan yang berubah karena ini?",
        "💡 Intuisi kunci: nilai BI tidak diukur dari bagusnya chart, melainkan dari keputusan yang berubah. Kalau setelah dashboard rilis tidak ada satu pun rapat yang keputusannya berbeda, BI-nya gagal — seindah apa pun visualnya.",
        "Mata rantai yang paling sering putus adalah yang terakhir: keputusan. Makanya lesson ini dibuka dengan cerita dashboard mati — karena 70% kegagalan BI adalah kegagalan adopsi, bukan kegagalan teknologi.",
      ],
      formula: String.raw`A = \frac{U_{aktif}}{U_{target}} \qquad W = \sum_{d \in Z} C_d`,
      formulaNote:
        "A = adoption rate: U_aktif = pengguna unik yang membuka dalam periode, U_target = pengguna yang seharusnya memakai. W = biaya terbuang: jumlah biaya pembuatan C_d semua dashboard zombie Z (definisi kerja: dibuka < 10 kali dalam 90 hari).",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: BI = bikin dashboard",
        body: "Dashboard hanyalah satu dari empat medium konsumsi BI (tiga lainnya: laporan terjadwal, alert, analisis ad-hoc). Tim yang mengukur kesuksesan BI dari jumlah dashboard yang rilis sedang mengukur output, bukan outcome. Ukur keputusan yang berubah, bukan grafik yang terbit.",
      },
    },
    {
      id: "zombie",
      eyebrow: "Langkah 4 · Zombie dashboard",
      title: "Mendeteksi dashboard mati sebelum ia memakan budget",
      prose: [
        "Zombie dashboard punya tiga ciri: dibuka kurang dari 10 kali dalam 90 hari, tidak ada pemilik yang jelas (\u201Citu bikinan vendor lama\u201D), dan tidak ada yang protes saat ia error seminggu. Dashboard yang penting selalu ada yang marah kalau ia mati.",
        "Cara membaca: sumbu Y = nama dashboard, panjang batang = total dibuka dalam 90 hari. Batang merah Executive 360 nyaris tak terlihat: 3 views untuk biaya Rp180 juta. Bandingkan dengan Penjualan Harian: 414 views, biaya nyaris nol.",
        "Interpretasi: biaya tidak berkorelasi dengan pemakaian. Yang berkorelasi dengan pemakaian adalah kedekatan dengan keputusan harian seseorang. Audit 90-harian seperti ini adalah vaksinasi termurah terhadap pemborosan BI.",
        "💡 Intuisi kunci: tanyakan \u201Ckeputusan apa yang berubah minggu lalu karena dashboard ini?\u201D Kalau jawabannya butuh mikir lebih dari 5 detik, dashboard itu kandidat zombie. Dashboard hidup selalu punya jawaban instan.",
      ],
      figure: {
        svg: VIEWS_SVG,
        alt: "Bar chart views 8 dashboard: Penjualan Harian 414, Executive 360 hanya 3.",
        caption:
          "Total dibuka per dashboard selama 90 hari (data sintetis lab, seed 7). Executive 360 — termahal — nyaris nol pemakaian.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: dashboard mahal = dashboard bagus",
        body: "Harga mencerminkan biaya konsultan, bukan nilai keputusan. Executive 360 gagal bukan karena jelek, melainkan karena menjawab pertanyaan yang tidak dimiliki siapa pun. Validasi termurah sebelum membangun: minta calon pengguna menuliskan satu keputusan yang akan ia ambil dari dashboard itu. Tidak bisa menulis? Jangan dibangun.",
      },
    },
    {
      id: "lab-adopsi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: audit 90 hari dalam 5 menit",
      prose: [
        "Kamu diberi view log 90 hari dari 8 dashboard SinarJaya (dibangkitkan dengan seed agar bisa direproduksi). Tugasmu: hitung total views per dashboard, temukan zombie-nya (views < 10), dan hitung biaya yang terbuang.",
        "Coba juga: ubah ambang zombie dari 10 menjadi 30. Dashboard apa saja yang ikut mati? Ambang adalah kebijakan — tidak ada angka sakral, yang penting konsisten dan disepakati.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `views`: dict nama dashboard → total views" },
        { id: "t2", text: "Isi `zombie`: list nama dashboard dengan views < 10" },
        { id: "t3", text: "Hitung `waste_jt`: total biaya (juta Rp) dashboard zombie" },
      ],
      expected: "zombie=['Executive 360']  waste_jt=180",
      note: {
        title: "Sering salah",
        body: "Menjumlahkan biaya SEMUA dashboard, bukan hanya zombie. Filter dulu mana yang zombie, baru jumlahkan biayanya.",
      },
      hints: [
        "Loop log, tambah 1 ke views[nama] untuk tiap baris.",
        "Zombie = [nama for nama, v in views.items() if v < 10].",
        "waste_jt = sum(biaya for nama, _, biaya in DASHBOARDS if nama in zombie)",
      ],
      code: {
        starter: `import random\nrandom.seed(7)\n\n# (nama, intended_users, biaya_jt)\nDASHBOARDS = [\n    ("Penjualan Harian", 24, 12), ("Stok Gudang", 9, 8),\n    ("Marketing Funnel", 15, 45), ("Executive 360", 6, 180),\n    ("HR Attrition", 4, 20), ("Finance Close", 7, 30),\n    ("Logistik SLA", 11, 15), ("CSAT Real-time", 13, 25),\n]\nRATE = [4.6, 1.1, 0.4, 0.03, 0.6, 2.2, 0.9, 1.4]  # rata-rata views/hari\n\nlog = []  # list of (nama_dashboard, user_id)\nfor di, r in enumerate(RATE):\n    nama, intended, biaya = DASHBOARDS[di]\n    for _ in range(round(r * 90)):\n        log.append((nama, random.randrange(intended)))\n\n# TULIS KODEMU: views, zombie, waste_jt\nviews = {}\nzombie = []\nwaste_jt = 0\n\nprint(f"total_views={sum(views.values())}")\nprint(f"exec360_views={views['Executive 360']}")\nprint(f"zombie={zombie}  waste_jt={waste_jt}")`,
        lockLines: 18,
        solution: `import random\nrandom.seed(7)\n\n# (nama, intended_users, biaya_jt)\nDASHBOARDS = [\n    ("Penjualan Harian", 24, 12), ("Stok Gudang", 9, 8),\n    ("Marketing Funnel", 15, 45), ("Executive 360", 6, 180),\n    ("HR Attrition", 4, 20), ("Finance Close", 7, 30),\n    ("Logistik SLA", 11, 15), ("CSAT Real-time", 13, 25),\n]\nRATE = [4.6, 1.1, 0.4, 0.03, 0.6, 2.2, 0.9, 1.4]  # rata-rata views/hari\n\nlog = []  # list of (nama_dashboard, user_id)\nfor di, r in enumerate(RATE):\n    nama, intended, biaya = DASHBOARDS[di]\n    for _ in range(round(r * 90)):\n        log.append((nama, random.randrange(intended)))\n\n# TULIS KODEMU: views, zombie, waste_jt\nviews = {}\nfor nama, _ in log:\n    views[nama] = views.get(nama, 0) + 1\nzombie = [nama for nama, v in views.items() if v < 10]\nwaste_jt = sum(biaya for nama, _, biaya in DASHBOARDS if nama in zombie)\n\nprint(f"total_views={sum(views.values())}")\nprint(f"exec360_views={views['Executive 360']}")\nprint(f"zombie={zombie}  waste_jt={waste_jt}")`,
        checks: [
          { kind: "defined", task: "t1", name: "views", label: "`views` terdefinisi", msg: "Bangun dict views dari log dengan loop." },
          { kind: "stdout_matches", task: "t1", pattern: "exec360_views=3", label: "Executive 360 = 3 views", msg: "Hitung dari log: hanya 3 baris bernama Executive 360." },
          { kind: "equal", task: "t2", name: "zombie", value: ["Executive 360"], label: "`zombie` tepat satu", msg: "Hanya Executive 360 yang di bawah 10 views." },
          { kind: "equal", task: "t3", name: "waste_jt", value: 180, tol: 1e-9, label: "`waste_jt` = 180", msg: "Biaya Executive 360 = 180 juta." },
          { kind: "stdout_matches", task: "t3", pattern: "zombie=\\['Executive 360'\\]\\s+waste_jt=180", label: "`print` menampilkan hasil audit", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "dict.get(kunci, 0) untuk akumulasi hitungan. List comprehension untuk filter.",
    },    {
      id: "lab2-umur-paruh",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: umur paruh sebuah dashboard",
      prose: [
        "Dashboard yang hidup pun menua: antusiasme minggu pertama hampir selalu memudar. Tugasmu: ukur seberapa cepat sebuah dashboard kehilangan separuh penontonnya — 'umur paruh' adopsi.",
        "Kamu diberi log harian 84 hari dashboard Stok Real-time. Agregasikan per minggu, temukan minggu pertama saat views turun di bawah 50% minggu pertama, dan hitung total penurunannya.",
        "Coba juga: ubah faktor decay 0,90 menjadi 0,97 (penurunan minat lebih lambat). Berapa minggu umur paruhnya sekarang? Inilah beda dashboard 'nice to have' vs 'tak bisa hidup tanpanya'.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `minggu`: list 12 total views mingguan dari `log`" },
        { id: "t2", text: "Temukan `paruh`: minggu pertama dengan views < 50% minggu ke-1" },
        { id: "t3", text: "Hitung `turun_pct`: % penurunan minggu ke-12 vs minggu ke-1 (1 desimal)" },
      ],
      expected: "minggu1=119  minggu12=39",
      note: {
        title: "Sering salah",
        body: "Membandingkan tiap minggu dengan minggu SEBELUMNYA (bukan minggu pertama). Umur paruh selalu diukur dari titik awal — minggu ke-1 adalah baseline.",
      },
      hints: [
        "minggu[h // 7] += v untuk agregasi 7-harian.",
        "paruh = minggu pertama (1-based) dengan v < 0.5 * minggu[0].",
        "turun_pct = (minggu[0] - minggu[11]) / minggu[0] * 100.",
      ],
      code: {
        starter: `import random\nrandom.seed(11)\n\n# log harian 84 hari (12 minggu): (hari_ke, views) utk dashboard "Stok Real-time"\nBASE = 17.0\nlog = []\nfor h in range(84):\n    decay = 0.90 ** (h // 7)          # minat turun 10% per minggu\n    noise = random.uniform(-2.5, 2.5)\n    log.append((h, max(0, round(BASE * decay + noise))))\n# TULIS KODEMU: minggu, paruh, turun_pct\nminggu = [0] * 12\nparuh = 0\nturun_pct = 0.0\n`,
        lockLines: 10,
        solution: `import random\nrandom.seed(11)\n\n# log harian 84 hari (12 minggu): (hari_ke, views) utk dashboard "Stok Real-time"\nBASE = 17.0\nlog = []\nfor h in range(84):\n    decay = 0.90 ** (h // 7)          # minat turun 10% per minggu\n    noise = random.uniform(-2.5, 2.5)\n    log.append((h, max(0, round(BASE * decay + noise))))\n\n# TULIS KODEMU: minggu, paruh, turun_pct\nminggu = [0] * 12\nfor h, v in log:\n    minggu[h // 7] += v\nparuh = next(w + 1 for w, v in enumerate(minggu) if v < 0.5 * minggu[0])\nturun_pct = round((minggu[0] - minggu[11]) / minggu[0] * 100, 1)\n\nprint(f"minggu1={minggu[0]}  minggu12={minggu[11]}")\nprint(f"paruh=minggu_ke-{paruh}  turun_pct={turun_pct}")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "minggu", label: "`minggu` terdefinisi", msg: "Agregasi log harian menjadi 12 total mingguan." },
          { kind: "equal", task: "t2", name: "paruh", value: 9, label: "`paruh` = minggu ke-9", msg: "Minggu pertama dengan views < 50% minggu ke-1." },
          { kind: "stdout_matches", task: "t3", pattern: "turun_pct=67\\.2", label: "`turun_pct` = 67,2", msg: "Penurunan minggu ke-12 vs minggu ke-1." },
        ],
      },
      reference: "Agregasi mingguan dengan integer division; pencarian kondisi pertama dengan next().",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Adopsi adalah metrik BI yang paling jujur dan paling murah diukur. Sebelum mengusulkan dashboard baru, minta datanya: berapa view 90 hari terakhir untuk dashboard sejenis? Kalau tidak ada yang mengukur, itu sendiri jawabannya.",
        "💡 Dashboard yang penting selalu punya 'detak jantung' — pola buka yang berirama (tiap pagi, tiap Senin). Dashboard yang dibuka acak 2-3 kali sebulan tidak punya detak jantung; ia mayat yang belum dikubur.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: bangun dari keputusan, bukan dari permintaan",
        body: "Setiap permintaan dashboard yang masuk ke mejamu harus bisa menjawab tiga kalimat: siapa yang memutuskan apa, kapan keputusan itu diambil, dan apa yang terjadi kalau angka ini tidak dibaca. Kalau peminta tidak bisa menjawab dalam tiga kalimat, jangan dibangun — bukan ditunda, jangan dibangun. Praktisi BI yang berpengalaman tahu polanya: dashboard yang lahir dari keputusan spesifik (\"manajer gudang memutuskan reorder tiap Senin jam 8\") hidup bertahun-tahun; dashboard yang lahir dari permintaan abstrak (\"direksi ingin visibility\") mati dalam satu kuartal. Aturan praktisnya: sebelum satu baris query ditulis, minta peminta menuliskan satu keputusan nyata yang akan berubah minggu depan karena dashboard ini. Tidak bisa menulis = tidak ada dashboard. Kedua, setiap dashboard yang rilis wajib punya tanggal review 90 hari yang ditulis di dashboard itu sendiri, bukan di dokumen terpisah. Saat review tiba, uji satu pertanyaan: keputusan apa yang berubah dalam 90 hari terakhir karena dashboard ini? Nol jawaban = matikan, dan umumkan pematiannya agar tim belajar. Ketiga, waspadai permintaan dari orang yang tidak memakai: eksekutif meminta, staf yang seharusnya memakai tidak pernah dilibatkan. Dashboard semacam ini hampir selalu berakhir jadi museum. BI yang sehat diukur dari keputusan yang berubah — dan keputusan selalu punya nama orang, tanggal, dan taruhan.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: medium apa untuk keputusan apa",
      prose: [
        "Skenario 1 — Keputusan harian berulang, data berubah tiap jam (stok gudang, antrian kasir). → Dashboard operasional: satu layar, refresh otomatis, dilihat tiap pagi. Contoh nyata: Penjualan Harian SinarJaya.",
        "Skenario 2 — Keputusan bulanan/kuartalan (review budget, OKR). → Laporan terjadwal: dikirim tiap periode, tidak perlu dibuka tiap hari. Dashboard untuk ini = zombie-in-waiting.",
        "Skenario 3 — Anomali butuh aksi dalam hitungan menit (server down, fraud spike). → Alert: push saat ambang terlampaui, diam saat normal. Tidak ada yang membuka dashboard tiap 5 menit dengan benar.",
        "Skenario 4 — Pertanyaan sekali jawab (\u201Ckenapa retur naik bulan lalu?\u201D). → Analisis ad-hoc: jawab, presentasikan, selesai. Dijadikan dashboard = monumen untuk pertanyaan yang sudah terjawab.",
        "Skenario 5 — Banyak stakeholder, pertanyaan berbeda-beda, tim data kecil. → Self-service dataset: satu dataset tepercaya, mereka eksplorasi sendiri (dibahas penuh di BI6).",
        "Aturan praktis 10 detik: tanya frekuensi keputusan. Harian → dashboard. Periodik → laporan terjadwal. Insidental-mendesak → alert. Sekali → ad-hoc. Tak tentu → self-service.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membangun dashboard untuk keputusan kuartalan \u201Csupaya siap saat dibutuhkan\u201D. Saat dibutuhkan 3 bulan lagi, datanya basi, definisinya lupa, dan tidak ada yang ingat cara bacanya. Laporan terjadwal yang datang 2 hari sebelum rapat jauh lebih hidup.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: audit portofolio 30 dashboard",
      prose: [
        "PT MajuLogistik punya 30 dashboard. Audit 90 hari: 22 dashboard dibuka kurang dari 10 kali (zombie), 5 dashboard dibuka 10–50 kali, 3 dashboard dibuka > 100 kali. Rata-rata biaya pembuatan Rp25 juta per dashboard, biaya maintenance Rp3 juta per dashboard per tahun.",
        "Hitung: (a) biaya pembuatan terbuang pada zombie; (b) biaya maintenance tahunan yang bisa dihemat bila 22 zombie dimatikan; (c) rekomendasi: matikan semua, atau ada yang diselamatkan?",
        "Jawaban: (a) 22 × 25 = Rp550 juta terbuang. (b) 22 × 3 = Rp66 juta/tahun. (c) Jangan matikan buta-buta: cek dulu 5 dashboard \u201C10–50 views\u201D — mungkin itu laporan kuartalan yang memang wajar sepi (skenario 2 peta keputusan!). Untuk 22 zombie: umumkan sunset 30 hari; yang tidak ada pemiliknya protes → matikan. Biasanya < 10% yang diprotes, dan itulah yang sebenarnya hidup.",
        "💡 Intuisi kunci: dashboard yang tidak ada pemiliknya adalah liabilitas. Setiap dashboard wajib punya nama pemilik dan tanggal review berikutnya. Tanpa itu, portofolio BI membusuk diam-diam.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang fondasi BI. Setiap opsi menjelaskan alasannya — baca semua why meski jawabanmu benar.",
      ],
      tasks: [],
      summary: [
        "BI adalah rantai keputusan (sumber → model → metrik → sajian → keputusan), bukan pabrik grafik.",
        "Nilai BI diukur dari keputusan yang berubah, bukan jumlah dashboard yang rilis.",
        "Zombie dashboard: < 10 views/90 hari, tanpa pemilik, tidak ada yang protes saat error.",
        "Pilih medium dari frekuensi keputusan: harian → dashboard, periodik → laporan, insidental → alert, sekali → ad-hoc.",
        "Setiap dashboard wajib punya pemilik dan tanggal review — tanpa itu ia jadi liabilitas.",
      ],
      next: { label: "BI2 — Data Modeling: Star Schema", href: "/v2/learn/biz2-modeling" },
      quiz: [
        {
          q: "Executive 360 (Rp180 jt, 3 views/90 hari) vs Penjualan Harian (gratis, 414 views). Pelajaran utamanya?",
          options: [
            { text: "Konsultan selalu lebih buruk dari intern", why: "Generalisasi berlebihan; masalahnya bukan siapa yang membuat." },
            { text: "Dashboard mahal pasti gagal", why: "Harga bukan penyebab — ada dashboard mahal yang hidup karena menjawab kebutuhan nyata." },
            { text: "Nilai dashboard ditentukan kedekatannya dengan keputusan nyata", why: "Tepat: Penjualan Harian menjawab pertanyaan harian yang dimiliki orang; Executive 360 tidak menjawab pertanyaan siapa pun.", correct: true },
            { text: "Perusahaan harus berhenti membuat dashboard", why: "Solusi yang salah; yang perlu diperbaiki adalah proses validasi kebutuhan, bukan mediumnya." },
          ],
        },
        {
          q: "Adoption rate sebuah dashboard = 12 pengguna unik dari 24 target dalam 90 hari. Artinya?",
          options: [
            { text: "A = 0,5 — separuh target tidak tersentuh", why: "12/24 = 0,5. Separuh audiens target tidak pernah membuka — sinyal untuk investigasi kebutuhan.", correct: true },
            { text: "A = 2,0 — melebihi target", why: "Terbalik: rumusnya U_aktif/U_target = 12/24, bukan sebaliknya." },
            { text: "Dashboard pasti zombie", why: "Belum tentu: 12 pengguna aktif bisa jadi sehat jika 12 itu adalah seluruh pengambil keputusan yang relevan." },
            { text: "Tidak bisa dihitung tanpa biaya", why: "Adoption rate tidak memakai biaya; itu metrik pemakaian, bukan efisiensi." },
          ],
        },
        {
          q: "Direksi butuh review angka kuartalan, 2 hari sebelum rapat. Medium terbaik?",
          options: [
            { text: "Dashboard real-time", why: "Keputusan kuartalan tidak butuh real-time; dashboard akan jadi zombie di antara kuartal." },
            { text: "Laporan terjadwal yang dikirim otomatis", why: "Tepat: datang saat dibutuhkan, tidak perlu dibuka tiap hari, selalu versi terbaru.", correct: true },
            { text: "Alert tiap ada perubahan", why: "Alert untuk anomali mendesak, bukan untuk review rutin — akan jadi noise." },
            { text: "Dataset self-service mentah", why: "Direksi tidak punya waktu eksplorasi; mereka butuh jawaban yang sudah diringkas." },
          ],
        },
        {
          q: "Mana yang PALING menandakan sebuah dashboard adalah zombie?",
          options: [
            { text: "Warnanya tidak menarik", why: "Estetika tidak menentukan nasib dashboard; banyak dashboard jelek yang hidup." },
            { text: "Tidak ada yang protes saat ia error seminggu", why: "Tepat: dashboard penting selalu ada yang marah kalau mati. Keheningan = tidak ada yang memakai.", correct: true },
            { text: "Datanya di-refresh tiap jam", why: "Frekuensi refresh tidak berkorelasi dengan pemakaian." },
            { text: "Dibuat lebih dari setahun lalu", why: "Umur bukan masalah; dashboard 5 tahun yang dibuka tiap hari adalah aset." },
          ],
        },
        {
          q: "Rantai BI: sumber → model → metrik → sajian → keputusan. Jika sajian bagus tapi tidak ada keputusan yang berubah, maka?",
          options: [
            { text: "BI berhasil karena chart-nya bagus", why: "Mengukur output bukan outcome — jebakan klasik." },
            { text: "BI gagal — mata rantai terakhir putus", why: "Tepat: nilai BI ada di keputusan yang berubah. Rantai hanya sekuat mata terlemahnya.", correct: true },
            { text: "Tambah lebih banyak chart", why: "Menambah yang tidak bekerja bukan solusi; masalahnya di relevansi, bukan kuantitas." },
            { text: "Ganti tools visualisasi", why: "Tools jarang menjadi akar masalah adopsi." },
          ],
        },
        {
          q: "Dashboard 'Laporan Mingguan' dibuka 8 kali dalam 90 hari oleh 2 orang, padahal targetnya 40 manajer. Tindakan pertama yang benar?",
          options: [
            { text: "Hapus dashboard-nya minggu ini juga", why: "Terlalu cepat: 8 views bisa berarti laporannya memang periodik (skenario 2 peta keputusan). Audit dulu polanya sebelum eksekusi." },
            { text: "Tanya ke 2 penggunanya: keputusan apa yang mereka ambil darinya", why: "Tepat: mulai dari keputusan, bukan dari angka views. Kalau keduanya menyebut keputusan nyata, dashboard ini hidup meski sepi — mungkin distribusinya yang salah (email vs portal).", correct: true },
            { text: "Tambahkan 10 chart agar lebih menarik", why: "Menambah konten ke dashboard yang tidak dipakai = menghias zombie. Masalahnya relevansi, bukan kelengkapan." },
            { text: "Naikkan target views menjadi 100", why: "Target tanpa intervensi = angka hiasan. Views tidak naik karena targetnya diganti." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

// Mock dashboard yang dipakai: 1 headline + 3 driver + 1 aksi.
const GOOD_DASH_SVG = `<svg viewBox="0 0 520 300" role="img" aria-label="Mock dashboard: satu angka headline conversion turun 15,8 persen, tiga driver di bawahnya.">
<rect x="16" y="16" width="488" height="268" rx="10" fill="var(--bg-panel)" stroke="var(--border)" stroke-width="1.5"/>
<text x="36" y="46" font-size="13" font-weight="700" fill="var(--text)" font-family="var(--font-ui)">Kopi Nusantara · Ringkasan Mingguan</text>
<text x="36" y="66" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Satu layar, satu keputusan: perbaiki conversion checkout.</text>
<rect x="36" y="80" width="448" height="86" rx="8" fill="var(--error-soft)" stroke="var(--error)" stroke-width="1.5"/>
<text x="56" y="108" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">HEADLINE · Conversion rate</text>
<text x="56" y="144" font-size="30" font-weight="700" fill="var(--error)" font-family="var(--font-ui)">3,2% <tspan font-size="15">▼ -15,8%</tspan></text>
<text x="300" y="144" font-size="12" fill="var(--text)" font-family="var(--font-ui)">dari 3,8% minggu lalu.</text>
<g font-family="var(--font-ui)">
<rect x="36" y="180" width="141" height="84" rx="8" fill="var(--bg-app)" stroke="var(--border)"/>
<text x="52" y="204" font-size="11" fill="var(--text-muted)">Avg ticket</text>
<text x="52" y="230" font-size="19" font-weight="700" fill="var(--error)">-7,8%</text>
<text x="52" y="250" font-size="11" fill="var(--text-muted)">Rp389 rb</text>
<rect x="189" y="180" width="141" height="84" rx="8" fill="var(--bg-app)" stroke="var(--border)"/>
<text x="205" y="204" font-size="11" fill="var(--text-muted)">CAC</text>
<text x="205" y="230" font-size="19" font-weight="700" fill="var(--error)">+7,1%</text>
<text x="205" y="250" font-size="11" fill="var(--text-muted)">Rp45 rb</text>
<rect x="343" y="180" width="141" height="84" rx="8" fill="var(--bg-app)" stroke="var(--border)"/>
<text x="359" y="204" font-size="11" fill="var(--text-muted)">NPS</text>
<text x="359" y="230" font-size="19" font-weight="700" fill="var(--success)">+6,9%</text>
<text x="359" y="250" font-size="11" fill="var(--text-muted)">62 poin</text>
</g>
</svg>`;

export const biz4: V2Lesson = {
  slug: "biz4-dashboard",
  track: "Business Intelligence",
  module: "Fondasi BI",
  title: "BI4 — Dashboard yang Dipakai",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "32 KPI yang tak pernah dibuka",
      prose: [
        "Dashboard \u201CKomando\u201D milik PT MajuLogistik punya 32 KPI, 14 chart, 2 peta, dan 1 pie 3D. Dibuka rata-rata 2 kali seminggu — oleh orang yang membuatnya, untuk memastikan ia tidak error. Direksi tidak pernah membukanya.",
        "Tim BI lalu melakukan hal yang terasa salah: memangkasnya menjadi 1 angka headline + 3 driver + 1 kalimat aksi. \u201CConversion 3,2%, turun 15,8%. Driver: avg ticket -7,8%, CAC +7,1%. Aksi: audit checkout minggu ini.\u201D Dashboard baru ini dibuka 31 kali dalam seminggu pertama.",
        "Twist-nya: yang membuat dashboard dipakai bukan kelengkapan, melainkan keberanian membuang. Setiap KPI yang dibuang adalah satu keputusan yang diperjelas. Dashboard 32 KPI tidak menjawab 32 pertanyaan — ia menghindari menjawab satu pun.",
        "Di lesson ini kamu akan bisa: (1) menyusun hierarki visual headline → driver → detail; (2) memilih SATU headline metric dari data dengan kriteria dampak; (3) mengenali pola dashboard gagal; (4) memilih jenis dashboard sesuai horizon keputusan.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang dashboard yang dibaca dalam 3 detik dan membuktikannya dengan data.",
        "(1) Memilih satu headline dari data (KPI dengan |Δ%| terbesar), bukan dari firasat atau jabatan peminta;",
        "(2) Menghitung 'skor keterbacaan' = sinyal/(1+noise) untuk membandingkan dua desain secara objektif;",
        "(3) Menerapkan hierarki visual: headline → driver → aksi, maksimal tanpa chart ke-5 yang tidak ditanya;",
        "(4) Menjelaskan kenapa 32 KPI dalam satu layar menjamin tidak ada yang dibaca.",
      ],
      tasks: [],
    },

    {
      id: "hierarki",
      eyebrow: "Langkah 3 · Hierarki visual",
      title: "Hierarki: headline, driver, detail — dalam urutan itu",
      prose: [
        "Otak membaca layar dalam 3 detik pertama: apa yang besar, apa yang berwarna, apa yang bergerak. Hierarki visual yang benar: LAPISAN 1 — satu angka headline yang menjawab \u201Capa yang paling penting berubah?\u201D. LAPISAN 2 — 2 sampai 4 driver yang menjelaskan kenapa. LAPISAN 3 — detail untuk yang mau mengebor (tabel, filter).",
        "Aturan satu layar satu keputusan: sebelum menambah chart, tulis keputusan yang akan diambil dari layar ini. \u201CLayar ini untuk memutuskan apakah perlu intervensi conversion minggu ini.\u201D Kalau keputusannya tidak bisa ditulis dalam satu kalimat, layarnya belum selesai didesain.",
        "Kepribadian: dashboard yang baik adalah \u201Csi pramusaji\u201D — datang dengan yang kamu butuhkan sebelum kamu bertanya. Dashboard yang buruk adalah \u201Csi gudang\u201D — semua ada, kamu cari sendiri.",
        "💡 Intuisi kunci: pre-attentive attributes (warna, ukuran, posisi) dibaca otak tanpa usaha. Satu angka merah besar 3,2% ▼ langsung terbaca sebagai \u201Cmasalah\u201D. Empat belas chart abu-abu sama besar dibaca sebagai \u201Cwallpaper\u201D. Desain bukan dekorasi — desain adalah cara tercepat menyampaikan makna.",
      ],
      formula: String.raw`\Delta\% = \frac{x_{baru} - x_{lama}}{x_{lama}} \times 100\%`,
      formulaNote:
        "Delta persen: perubahan relatif metrik vs periode pembanding. Headline dipilih dari |Δ%| terbesar yang juga penting secara bisnis — bukan sekadar terbesar, karena metrik kecil yang volatil bisa menipu.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: semakin lengkap semakin bagus",
        body: "Kelengkapan menaikkan beban kognitif. Miller's law: working memory menampung ~7 objek; dashboard 32 KPI melebihi itu 4x lipat. Hasilnya bukan pemahaman 4x, melainkan pengabaian total. Lengkap = arsip; fokus = dashboard.",
      },
    },
    {
      id: "pola-gagal",
      eyebrow: "Langkah 4 · Pola gagal",
      title: "Galeri kegagalan: dashboard yang mati gaya",
      prose: [
        "Pola gagal 1 — Vanity metrics: \u201Ctotal user terdaftar 2 juta\u201D yang tidak pernah turun dan tidak bisa ditindaklanjuti. Metrik yang selalu naik bukan metrik, itu dekorasi.",
        "Pola gagal 2 — Pie 3D 12 slice: manusia buruk membandingkan sudut, apalagi miring. Bar chart horizontal selalu menang untuk perbandingan kategori.",
        "Pola gagal 3 — Sumbu Y tidak mulai dari nol TANPA label jelas: perubahan 2% terlihat seperti krisis. Kalau zoom, beri anotasi \u201Csumbu dipotong\u201D.",
        "Pola gagal 4 — 14 chart tanpa hierarki: semua sama besar, semua sama penting, artinya tidak ada yang penting.",
        "Cara membaca mock di bawah: kotak merah besar = headline (conversion 3,2%, -15,8%) — mata mendarat di sini pertama. Tiga kotak kecil = driver. Satu baris aksi = keputusan. Tidak ada chart ke-5.",
        "Interpretasi: dalam 3 detik pembaca tahu (a) ada masalah, (b) seberapa besar, (c) apa penyebabnya, (d) apa yang harus dilakukan. Itulah definisi operasional \u201Cdashboard yang dipakai\u201D.",
        "💡 Intuisi kunci: uji 3 detik — tunjukkan dashboard ke kolega selama 3 detik lalu tutup. Kalau ia tidak bisa menyebut headline dan arahnya (naik/turun, baik/buruk), desainnya gagal.",
      ],
      figure: {
        svg: GOOD_DASH_SVG,
        alt: "Mock dashboard: headline conversion 3,2 persen turun 15,8 persen, tiga driver di bawahnya.",
        caption: "Dashboard yang dipakai: 1 headline + 3 driver + 1 aksi. Uji 3 detik: masalahnya langsung terbaca.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: dashboard harus real-time",
        body: "Real-time mahal (infra, perhatian) dan sering tidak dibutuhkan. Keputusan mingguan tidak butuh data per menit — malah menambah noise dan \u201Crefresh anxiety\u201D. Samakan frekuensi refresh dengan frekuensi keputusan: harian untuk operasional, mingguan untuk taktis.",
      },
    },
    {
      id: "lab-headline",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: pilih headline dari data, bukan dari firasat",
      prose: [
        "Data KPI mingguan Kopi Nusantara (6 metrik, kini vs lalu) tersedia. Tugasmu: (1) hitung delta persen tiap metrik; (2) pilih `headline` = metrik dengan |Δ%| terbesar; (3) pilih 3 `drivers` berikutnya; (4) tentukan status tiap metrik (BAIK/BURUK) dengan memperhatikan arah_baik — CAC naik itu BURUK, bukan baik.",
        "Coba juga: bagaimana jika headline dipilih dari Δ absolut (bukan persen)? Metrik mana yang menang? Pelajarannya: pilihan metrik headline adalah keputusan desain, bukan sekadar sorting.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `delta`: dict nama → delta persen (desimal)" },
        { id: "t2", text: "Pilih `headline` (|Δ%| terbesar) dan `drivers` (3 berikutnya)" },
        { id: "t3", text: "Cetak headline, drivers, dan delta conversion" },
      ],
      expected: "headline=Conversion (%)  conv_delta=-0.1579",
      note: {
        title: "Sering salah",
        body: "Mengabaikan arah_baik saat menilai BAIK/BURUK. CAC +7,1% terlihat \u201Cnaik\u201D tapi itu buruk. Selalu pasangkan angka dengan arah yang diinginkan — dashboard tanpa arah adalah teka-teki.",
      },
      hints: [
        "delta[nama] = (kini - lalu) / lalu untuk tiap baris KPI.",
        "headline = max(delta, key=lambda k: abs(delta[k])).",
        "drivers = 3 nama berikutnya setelah diurutkan berdasarkan abs(delta), menurun.",
      ],
      code: {
        starter: `# (nama, lalu, kini, arah_baik): arah_baik=+1 naik itu baik, -1 turun itu baik\nKPI = [\n    ("Revenue", 5100, 4820, +1),\n    ("Transaksi", 12100, 12400, +1),\n    ("Avg Ticket (rb)", 421.5, 388.7, +1),\n    ("Conversion (%)", 3.8, 3.2, +1),\n    ("CAC (rb)", 42.0, 45.0, -1),\n    ("NPS", 58, 62, +1),\n]\n\n# TULIS KODEMU: delta, headline, drivers\ndelta = {}\nheadline = ""\ndrivers = []\n\nprint(f"headline={headline}  drivers={drivers}")\nprint(f"conv_delta={delta['Conversion (%)']:.4f}")`,
        lockLines: 9,
        solution: `# (nama, lalu, kini, arah_baik): arah_baik=+1 naik itu baik, -1 turun itu baik\nKPI = [\n    ("Revenue", 5100, 4820, +1),\n    ("Transaksi", 12100, 12400, +1),\n    ("Avg Ticket (rb)", 421.5, 388.7, +1),\n    ("Conversion (%)", 3.8, 3.2, +1),\n    ("CAC (rb)", 42.0, 45.0, -1),\n    ("NPS", 58, 62, +1),\n]\n\n# TULIS KODEMU: delta, headline, drivers\ndelta = {}\nfor nama, lalu, kini, baik in KPI:\n    delta[nama] = (kini - lalu) / lalu\nperingkat = sorted(delta, key=lambda k: abs(delta[k]), reverse=True)\nheadline = peringkat[0]\ndrivers = peringkat[1:4]\n\nprint(f"headline={headline}  drivers={drivers}")\nprint(f"conv_delta={delta['Conversion (%)']:.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "headline", value: "Conversion (%)", label: "`headline` = Conversion (%)", msg: "|Δ%| terbesar = conversion -15,79%." },
          { kind: "equal", task: "t2", name: "drivers", value: ["Avg Ticket (rb)", "CAC (rb)", "NPS"], label: "`drivers` tepat 3", msg: "Urutan |Δ%|: avg ticket, CAC, NPS." },
          { kind: "defined", task: "t1", name: "delta", label: "`delta` terdefinisi", msg: "Hitung delta = (kini - lalu) / lalu untuk tiap metrik." },
          { kind: "stdout_matches", task: "t3", pattern: "headline=Conversion \\(%\\)\\s+drivers=\\[", label: "`print` menampilkan headline", msg: "Samakan format dengan hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t3", pattern: "conv_delta=-0\\.1579", label: "Delta conversion tercetak", msg: "Format 4 desimal: -0.1579." },
        ],
      },
      reference: "sorted(dict, key=lambda k: abs(dict[k]), reverse=True) untuk ranking.",
    },    {
      id: "lab2-skor-keterbacaan",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: skor keterbacaan 3 detik",
      prose: [
        "Dua mockup menampilkan angka yang sama untuk Conversion (-15,8%), tapi satu dibaca dalam 3 detik dan satunya butuh 30 detik. Bedanya: noise. Tugasmu: kuantifikasi dengan 'skor keterbacaan' = |headline| / (1 + noise), di mana headline = KPI dengan |Δ%| terbesar dan noise = KPI lain dengan |Δ%| < 2.",
        "Hitung skor kedua mockup dan tentukan pemenangnya. Angka ini bukan kebenaran mutlak — tapi ia memaksa diskusi desain memakai data, bukan selera.",
        "Coba juga: naikkan ambang noise dari 2 menjadi 5. Apakah pemenang berubah? Ambang adalah asumsi — catat asumsimu, jangan sembunyikan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `analisis(mock)` → (headline, noise, skor)" },
        { id: "t2", text: "Hitung skor kedua mockup" },
        { id: "t3", text: "Tentukan `pemenang` = mockup dengan skor lebih tinggi" },
      ],
      expected: "A: headline=Conversion noise=5 skor=2.63",
      note: {
        title: "Sering salah",
        body: "Menghitung noise dari SEMUA KPI termasuk headline. Headline dikeluarkan dulu — ia sinyalnya, bukan noise-nya.",
      },
      hints: [
        "headline = max(mock, key=lambda k: abs(mock[k])).",
        "noise = KPI selain headline dengan abs(v) < 2.",
        "skor = abs(mock[headline]) / (1 + noise), bulatkan 2 desimal.",
      ],
      code: {
        starter: `# Dua mockup dashboard: {nama_kpi: delta_persen}\nmock_a = {"Conversion": -15.8, "Traffic": 2.1, "AOV": -1.2, "Retur": 0.8,\n          "CSAT": 1.5, "NPS": -0.9, "CAC": 3.3, "Churn": 1.1}\nmock_b = {"Conversion": -15.8, "Traffic": 12.4, "AOV": -9.6}\n# TULIS KODEMU: headline_a, noise_a, skor_a, headline_b, noise_b, skor_b, pemenang\nheadline_a, noise_a, skor_a = '', 0, 0.0\nheadline_b, noise_b, skor_b = '', 0, 0.0\npemenang = ''\n`,
        lockLines: 4,
        solution: `# Dua mockup dashboard: {nama_kpi: delta_persen}\nmock_a = {"Conversion": -15.8, "Traffic": 2.1, "AOV": -1.2, "Retur": 0.8,\n          "CSAT": 1.5, "NPS": -0.9, "CAC": 3.3, "Churn": 1.1}\nmock_b = {"Conversion": -15.8, "Traffic": 12.4, "AOV": -9.6}\n\n# TULIS KODEMU: headline_a, noise_a, skor_a, pemenang\ndef analisis(mock):\n    headline = max(mock, key=lambda k: abs(mock[k]))\n    noise = sum(1 for k, v in mock.items() if k != headline and abs(v) < 2)\n    skor = round(abs(mock[headline]) / (1 + noise), 2)\n    return headline, noise, skor\n\nheadline_a, noise_a, skor_a = analisis(mock_a)\nheadline_b, noise_b, skor_b = analisis(mock_b)\npemenang = "A" if skor_a > skor_b else "B"\n\nprint(f"A: headline={headline_a} noise={noise_a} skor={skor_a}")\nprint(f"B: headline={headline_b} noise={noise_b} skor={skor_b}")\nprint(f"pemenang=mock_{pemenang}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "A: headline=Conversion noise=5 skor=2\\.63", label: "skor mock A = 2,63", msg: "|−15,8| / (1+5)." },
          { kind: "stdout_matches", task: "t2", pattern: "B: headline=Conversion noise=0 skor=15\\.8", label: "skor mock B = 15,8", msg: "|−15,8| / (1+0)." },
          { kind: "equal", task: "t3", name: "pemenang", value: "B", label: "`pemenang` = B", msg: "Skor lebih tinggi = lebih terbaca." },
        ],
      },
      reference: "Skor keterbacaan = sinyal / (1 + noise): metrik mainan untuk melatih intuisi desain.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Uji 3 detik: tunjukkan dashboard ke rekan selama 3 detik, tutup, tanya 'ada masalah apa?'. Kalau ia tidak bisa jawab, dashboard-mu gagal — seberapa pun bagusnya chart keenamnya.",
        "💡 Satu dashboard = satu keputusan. Kalau stakeholder berkata 'tambahkan juga chart X biar lengkap', tanyakan 'keputusan apa yang berubah karena chart X?' Tidak ada jawaban = tidak ada chart.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: stempel 'data per' adalah fitur terpenting dashboard",
        body: "Fitur terpenting sebuah dashboard bukan chart-nya, melainkan stempel kecil yang sering dilupakan: \"data per kemarin 23:59, refresh berikutnya 06:00\". Tanpa stempel ini, dashboard adalah pembohong yang sopan — ia menampilkan angka lama dengan wajah angka baru, dan penggunanya mengambil keputusan dengan asumsi data segar. Praktisi dashboard yang berpengalaman punya aturan keras: setiap dashboard wajib menampilkan tiga hal di tempat yang selalu terlihat — kapan data terakhir masuk, kapan refresh berikutnya dijadwalkan, dan status refresh terakhir (sukses atau gagal). Ketika pipeline gagal, dashboard harus berteriak, bukan diam menampilkan angka kemarin seolah-olah hari ini. Jebakan klasiknya: rapat Senin pagi membahas \"penurunan 12%\" yang ternyata hanya keterlambatan ETL — dua jam rapat terbuang karena tidak ada yang tahu datanya basi. Aturan praktis kedua: kesegaran data harus mengikuti irama keputusan. Keputusan harian butuh data berumur <24 jam; keputusan mingguan toleran 2–3 hari. Dashboard yang refresh-nya lebih lambat dari irama keputusannya bukan sekadar lambat — ia menyesatkan secara sistematis. Dan yang ketiga: uji dashboard-mu dengan skenario \"pipeline mati 3 hari\" — kalau tidak ada yang sadar dari tampilannya, desainmu gagal. Stempel \"data per\" adalah sabuk pengaman; dashboard tanpa itu sedang berkendara tanpa rem.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: jenis dashboard per horizon",
      prose: [
        "Skenario 1 — Operasional (horizon: jam/hari, pengguna: frontline). → Detail tinggi, refresh sering, alert ambang. Contoh: antrian kasir, stok gudang. Satu layar = satu area kerja.",
        "Skenario 2 — Taktis (horizon: minggu/bulan, pengguna: manajer). → Tren + perbandingan vs target + driver. Contoh: dashboard marketing mingguan. Keputusan: alokasi budget, intervensi.",
        "Skenario 3 — Strategis (horizon: kuartal/tahun, pengguna: direksi). → Sedikit angka besar, komparasi YoY, narasi. Contoh: executive summary. Direksi tidak mengebor — mereka memutuskan arah.",
        "Skenario 4 — Analitik/eksplorasi (horizon: tak tentu, pengguna: analis). → Bukan dashboard — ini wilayah self-service (BI6) atau notebook. Memaksa eksplorasi ke dalam dashboard menghasilkan \u201Cdashboard gudang\u201D.",
        "Aturan praktis 10 detik: tanya siapa dan seberapa sering keputusannya. Frontline-harian → operasional. Manajer-mingguan → taktis. Direksi-kuartalan → strategis. Analis-kapan saja → jangan dashboard.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: redesign dashboard penjualan",
      prose: [
        "Dashboard penjualan PT SinarJaya saat ini: 18 chart — revenue per hari, per kategori, per kota, per channel, per sales, top 10 produk, bottom 10 produk, ... Dibuka 4x seminggu oleh 2 orang. Target: dipakai 20+ manajer tiap Senin pagi.",
        "Redesign: LAPISAN 1 — headline: revenue vs target minggu ini (mis. Rp4,82M vs target Rp5,10M = -5,5%, merah). LAPISAN 2 — 3 driver terbesar: conversion -15,8%, avg ticket -7,8%, traffic +2,5% (hijau — bukan masalah). LAPISAN 3 — tombol \u201Clihat per kota/kategori\u201D untuk yang mau mengebor.",
        "Hasil yang diharapkan: Senin pagi, manajer membaca dalam 10 detik: target meleset 5,5% karena conversion anjlok — traffic justru naik. Keputusan: investigasi checkout, bukan tambah iklan. Satu layar, satu keputusan.",
        "💡 Intuisi kunci: redesign dashboard selalu dimulai dengan MENGHAPUS, bukan menambah. Minta tiap pemilik chart menuliskan keputusan yang diambil dari chart-nya bulan lalu. Yang tidak bisa menulis → hapus.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang dashboard yang dipakai. Ingat uji 3 detik.",
      ],
      tasks: [],
      summary: [
        "Hierarki: 1 headline → 2-4 driver → detail untuk pengeboran.",
        "Satu layar satu keputusan — tulis keputusannya sebelum menambah chart.",
        "Headline = perubahan terbesar yang penting secara bisnis, bukan sekadar terbesar.",
        "Kenali pola gagal: vanity metrics, pie 3D, sumbu menipu, gudang chart.",
        "Samakan refresh dengan frekuensi keputusan; uji 3 detik untuk validasi.",
      ],
      next: { label: "BI5 — KPI yang Tidak Bisa Di-gaming", href: "/v2/learn/biz5-kpi" },
      quiz: [
        {
          q: "Dashboard 32 KPI tidak dibuka; versi 1+3 dipakai tiap hari. Pelajaran desainnya?",
          options: [
            { text: "KPI harus selalu 4", why: "Angka 4 bukan sakral; intinya hierarki dan keberanian membuang." },
            { text: "Kelengkapan kalah oleh fokus — buang yang tidak menjawab keputusan", why: "Tepat: tiap KPI yang dibuang memperjelas keputusan yang tersisa.", correct: true },
            { text: "Direksi tidak suka angka", why: "Direksi suka angka — yang relevan dan cepat dibaca." },
            { text: "Chart harus berwarna merah", why: "Warna hanya penanda arah; bukan sebab dashboard dipakai." },
          ],
        },
        {
          q: "Metrik dengan |Δ%| terbesar adalah CAC (+7,1%, arah baik = turun). Untuk headline…",
          options: [
            { text: "Tetap jadikan headline karena terbesar", why: "Terbesar kedua setelah conversion; dan headline harus yang paling penting, bukan sekadar terbesar." },
            { text: "Pertimbangkan, tapi conversion (-15,8%) lebih besar dan lebih sentral", why: "Tepat: conversion menang di |Δ%| DAN sentral untuk revenue. Kriteria ganda: besar + penting.", correct: true },
            { text: "Jangan tampilkan karena angkanya buruk", why: "Menyembunyikan kabar buruk = dashboard propaganda, bukan BI." },
            { text: "Tampilkan tanpa arah baik/buruk", why: "Tanpa arah, pembaca harus menebak — gagal uji 3 detik." },
          ],
        },
        {
          q: "Manajer butuh alokasi budget mingguan. Jenis dashboard yang tepat?",
          options: [
            { text: "Strategis kuartalan", why: "Terlalu jarang dan terlalu tinggi levelnya untuk keputusan mingguan." },
            { text: "Taktis: tren + vs target + driver", why: "Tepat: horizon mingguan, butuh perbandingan dan penjelasan.", correct: true },
            { text: "Operasional real-time", why: "Berlebihan untuk keputusan mingguan; menambah noise." },
            { text: "Notebook eksplorasi", why: "Itu untuk analis, bukan untuk keputusan rutin manajer." },
          ],
        },
        {
          q: "Pie 3D dengan 12 slice untuk pangsa kategori. Masalah utamanya?",
          options: [
            { text: "Terlalu berwarna", why: "Warna bukan masalah utama di sini." },
            { text: "Manusia buruk membandingkan sudut miring — pakai bar horizontal", why: "Tepat: perbandingan panjang batang jauh lebih akurat dibaca daripada sudut 3D.", correct: true },
            { text: "Datanya pasti salah", why: "Data bisa benar; masalahnya pada encoding visual." },
            { text: "Tidak bisa di-print", why: "Bukan masalah desain yang substantif." },
          ],
        },
        {
          q: "Uji 3 detik gagal — kolega tak bisa menyebut headline. Langkah pertama?",
          options: [
            { text: "Tambah chart penjelasan", why: "Menambah = memperburuk; masalahnya kelebihan, bukan kekurangan." },
            { text: "Hapus sampai tersisa 1 headline + driver-nya", why: "Tepat: redesign dimulai dengan menghapus.", correct: true },
            { text: "Ganti warna tema", why: "Kosmetik tidak memperbaiki hierarki informasi." },
            { text: "Tambah tooltip interaktif", why: "Tooltip membantu eksplorasi, bukan keterbacaan 3 detik." },
          ],
        },
        {
          q: "Stakeholder minta 'tambahkan tren 12 bulan + breakdown per kota + tabel detail' ke dashboard 1 layar. Respons terbaik?",
          options: [
            { text: "Tambahkan semuanya — lengkap lebih baik", why: "Lengkap = tidak ada yang dibaca. Tiap tambahan menurunkan probabilitas headline dibaca dalam 3 detik." },
            { text: "Tanya keputusan apa yang butuh tiap tambahan; yang tak terjawab masuk laporan terpisah/drill-down", why: "Tepat: dashboard 1 layar = 1 keputusan. Detail yang sah tetap disediakan — selapis di bawah (progressive disclosure), bukan di layar utama.", correct: true },
            { text: "Tolak mentah-mentah", why: "Menolak tanpa alternatif = konflik. Tawarkan rumah yang tepat untuk tiap kebutuhan." },
            { text: "Buat tab baru untuk tiap permintaan", why: "Tab = kuburan: tab kedua dibuka < 10% pengguna (pelajaran BI12). Masalahnya bukan tempat, tapi prioritas." },
          ],
        },
      ],
    },
  ],
};

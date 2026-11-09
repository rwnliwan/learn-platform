import type { V2Lesson } from "../lib/types";

// Tradeoff batch vs streaming: latency turun, biaya & kompleksitas naik.
const TRADEOFF_SVG = `<svg viewBox="0 0 560 230" role="img" aria-label="Grafik tradeoff: semakin kecil latency, semakin tinggi biaya dan kompleksitas.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="20" x2="60" y2="180"/><line x1="60" y1="180" x2="520" y2="180"/>
<line x1="60" y1="140" x2="520" y2="140" stroke-dasharray="4 4"/><line x1="60" y1="100" x2="520" y2="100" stroke-dasharray="4 4"/><line x1="60" y1="60" x2="520" y2="60" stroke-dasharray="4 4"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="30" y="184">0</text><text x="528" y="196" text-anchor="end">latency makin kecil →</text>
<text x="12" y="64">tinggi</text><text x="12" y="144">rendah</text>
<text x="60" y="200">batch harian</text><text x="210" y="200">batch 5 mnt</text><text x="360" y="200">micro-batch</text><text x="470" y="200">streaming</text>
</g>
<path d="M80,150 C180,140 260,110 340,80 S460,40 500,34" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<path d="M80,158 C180,150 260,130 340,100 S460,60 500,52" fill="none" stroke="var(--c2)" stroke-width="2.5" stroke-dasharray="7 4"/>
<g font-family="var(--font-ui)" font-size="12">
<rect x="392" y="8" width="10" height="10" fill="var(--c4)"/><text x="408" y="17" fill="var(--text)">biaya</text>
<rect x="452" y="8" width="10" height="10" fill="var(--c2)"/><text x="468" y="17" fill="var(--text)">kompleksitas</text>
</g>
<circle cx="222" cy="138" r="6" fill="var(--c3)" stroke="var(--text)" stroke-width="1.5"/>
<text x="222" y="162" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">sweet spot</text>
<text x="222" y="176" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">kebanyakan kasus</text>
</svg>`;

export const de2: V2Lesson = {
  slug: "de2-pipeline",
  track: "Data Engineer",
  module: "Fondasi Pipeline",
  title: "DE2 — Merancang Pipeline: Batch vs Streaming",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp32 juta untuk 'real-time' yang tidak dipakai",
      prose: [
        "Startup logistik 'KirimCepat' baru saja menutup putaran pendanaan. CTO-nya, Dimas, punya mimpi: semua dashboard real-time. 'Kita perusahaan teknologi, masa datanya telat?' Timnya membangun pipeline streaming penuh: cluster Kafka, job streaming 24 jam, tim on-call.",
        "Tagihannya: Rp32 juta per bulan. Hasilnya: dashboard yang di-refresh direksi... sekali sehari, tiap pagi jam 8. Keputusan operasional — tambah armada, buka rute baru — tetap dibahas di rapat mingguan Senin jam 10.",
        "Twist-nya: setelah audit, ternyata 11 dari 12 kebutuhan 'real-time' mereka baik-baik saja dengan batch tiap 5 menit — keterlambatan rata-rata cuma 2,5 menit, biaya Rp1,3 juta per bulan. 25x lebih murah. Satu-satunya yang benar-benar butuh streaming: alert keterlambatan paket untuk CS.",
        "Lesson ini: memilih arsitektur pipeline bukan soal gengsi teknologi, melainkan soal mencocokkan latency dengan keputusan yang dilayaninya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: semakin real-time semakin baik",
        type: "pitfall",
        body: "Real-time adalah spektrum biaya, bukan piala. Setiap lompatan latency (harian → per jam → 5 menit → detik) mengalikan biaya dan kompleksitas — sementara nilai bisnisnya sering datar. Tanya dulu: 'keputusan apa yang berubah jika datanya 5 menit lebih segar?' Kalau jawabannya 'tidak ada', batch sudah menang.",
      },
      reference: "Pilih latency berdasarkan keputusan yang dilayani, bukan berdasarkan yang paling canggih.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memilih antara batch, micro-batch, dan streaming dengan argumen biaya.",
        "(1) Membedakan tiga pola dari sisi latency, biaya, dan kompleksitas; (2) Menghitung biaya batch dari interval run dengan rumus C_batch;",
        "(3) Membangun pipeline batch mini (extract → transform → load) yang idempoten;",
        "(4) Menjelaskan 'ekonomi latency': kenapa real-time yang tidak dipakai = pajak gengsi teknologi.",
      ],
      tasks: [],
    },

    {
      id: "tiga-arus",
      eyebrow: "Langkah 3 · Tiga arus",
      title: "Batch, micro-batch, streaming: tiga kepribadian",
      prose: [
        "Batch adalah kurir terjadwal: datang tiap jam/hari, mengantar semua paket sekaligus, murah dan bisa diandalkan. Kepribadiannya: 'biar lambat asal selamat dan murah'. Cocok untuk laporan harian, training model, rekonsiliasi keuangan.",
        "Streaming adalah wartawan live: melaporkan tiap kejadian detik itu juga. Kepribadiannya: 'kecepatan di atas segalanya'. Tapi ia butuh kru siaga 24 jam (on-call), peralatan mahal (cluster selalu nyala), dan kalau salah lapor, koreksinya rumit (replay event).",
        "Micro-batch adalah kompromi cerdas: kurir yang datang tiap 5 menit. Keterlambatan rata-rata hanya 2,5 menit — setengah interval — dengan biaya mendekati batch. Inilah sweet spot yang ditemukan KirimCepat.",
        "💡 Intuisi: latency batch ≈ interval / 2. Batch per jam berarti data rata-rata telat 30 menit; batch 5 menit berarti telat 2,5 menit. Kamu tidak perlu streaming untuk mengalahkan 'telat 30 menit' — cukup perkecil interval batch.",
        "💡 Intuisi: kompleksitas streaming bukan di kode, melainkan di operasi: exactly-once, ordering, late event, replay, dan on-call 24 jam. Kode streaming 50 baris bisa butuh tim siaga semalam suntuk.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: micro-batch = streaming yang gagal",
        type: "pitfall",
        body: "Micro-batch adalah pilihan arsitektur yang sah, bukan streaming KW. Banyak sistem 'real-time' terkenal sebenarnya micro-batch 1–5 menit. Yang penting adalah SLA latency terpenuhi, bukan label teknologinya.",
      },
      reference: "Batch = murah & andal. Micro-batch = sweet spot. Streaming = tercepat, termahal, tersulit dioperasi.",
    },
    {
      id: "ekonomi-latency",
      eyebrow: "Langkah 4 · Ekonomi",
      title: "Ekonomi latency: rumus biayanya",
      prose: [
        "Biaya batch tumbuh sebanding dengan frekuensi run: dua kali lebih sering = dua kali run = dua kali biaya komputasi. Sederhananya:",
        "Cara membaca: sumbu X = latency mengecil (batch harian → batch 5 menit → micro-batch → streaming). Dua kurva naik: 'biaya' dan 'kompleksitas'. Titik 'sweet spot' ditandai di micro-batch/batch menitan.",
        "Interpretasi: kurvanya naik TAJAM — bukan linear. Dari batch harian ke streaming, biaya dan kompleksitas berlipat ganda berkali-kali. Sweet spot kebanyakan kasus = batch menitan: 'cukup segar' dengan harga wajar.",
      ],
      formula: String.raw`C_{batch} = \frac{24 \times 60}{I} \times c_{run} \times 30`,
      formulaNote: "C_batch = biaya batch per bulan (rupiah); I = interval batch dalam menit (mis. 5); c_run = biaya komputasi per run (rupiah). Makin kecil I, makin besar pembilang — biaya naik.",
      figure: {
        svg: TRADEOFF_SVG,
        alt: "Kurva biaya dan kompleksitas naik tajam saat latency mengecil; sweet spot di batch 5 menit.",
        caption: "Latency mengecil → biaya & kompleksitas naik. Sweet spot kebanyakan kasus: batch/micro-batch menit-an.",
      },
      tasks: [],
    },
    {
      id: "lab-batch",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: pipeline batch mini (ETL)",
      prose: [
        "Teori tanpa praktik = opini. Lab ini membangun pipeline batch mini lengkap: extract (ambil data tanggal tertentu), transform (agregasi per kategori), load (tulis ke data mart). Pola ETL tiga fungsi ini adalah kerangka semua pipeline batch di dunia nyata.",
        "Cara membaca: setiap fungsi murni (tidak mengubah inputnya) — itu fondasi idempotensi yang dibahas di DE4. Jalankan, lalu ubah tanggal extract ke '2026-10-12' dan lihat mart berubah.",
        "Interpretasi: di produksi, extract = query ke database, transform = SQL/Python, load = tulis ke warehouse. Bentuknya sama, skalanya beda.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `extract`: kembalikan baris yang tanggalnya cocok" },
        { id: "t2", text: "Lengkapi `transform`: agregasi nominal per kategori" },
        { id: "t3", text: "Jalankan pipeline untuk tanggal \"2026-10-13\" dan cetak mart + total" },
      ],
      expected: "baris_batch=4 | mart={'makanan': 215000, 'transport': 60000, 'hiburan': 200000} | total=475000",
      note: {
        title: "Sering salah",
        body: "Menulis transform yang mengubah list input (mis. pop atau sort in-place). Fungsi ETL harus murni: baca input, kembalikan output baru. Kalau transform merusak input, rerun pipeline menghasilkan angka berbeda — mimpi buruk debugging.",
      },
      hints: [
        "extract: list comprehension dengan filter t[\"tanggal\"] == tanggal.",
        "transform: dict agg; agg[kat] = agg.get(kat, 0) + nominal.",
        "load sudah disediakan; panggil berurutan: load(transform(extract(...))).",
      ],
      code: {
        starter: `# Data transaksi mentah (simulasi tabel source)\ntransaksi = [\n    {"id": 1, "tanggal": "2026-10-12", "kategori": "makanan", "nominal": 85000},\n    {"id": 2, "tanggal": "2026-10-12", "kategori": "transport", "nominal": 45000},\n    {"id": 3, "tanggal": "2026-10-13", "kategori": "makanan", "nominal": 120000},\n    {"id": 4, "tanggal": "2026-10-13", "kategori": "makanan", "nominal": 95000},\n    {"id": 5, "tanggal": "2026-10-13", "kategori": "transport", "nominal": 60000},\n    {"id": 6, "tanggal": "2026-10-13", "kategori": "hiburan", "nominal": 200000},\n]\n\n# TULIS KODEMU: extract\ndef extract(data, tanggal):\n    return \n\n# TULIS KODEMU: transform -> {kategori: total_nominal}\ndef transform(rows):\n    agg = {}\n    \n    return agg\n\ndef load(agg, mart):\n    for k, v in agg.items():\n        mart[k] = mart.get(k, 0) + v\n    return mart\n\n# TULIS KODEMU: jalankan pipeline\nbatch = \nmart = load(transform(batch), {})\nprint(f"baris_batch={len(batch)}")\nprint(f"mart={mart}")\nprint(f"total={sum(mart.values())}")`,
        lockLines: 9,
        solution: `# Data transaksi mentah (simulasi tabel source)\ntransaksi = [\n    {"id": 1, "tanggal": "2026-10-12", "kategori": "makanan", "nominal": 85000},\n    {"id": 2, "tanggal": "2026-10-12", "kategori": "transport", "nominal": 45000},\n    {"id": 3, "tanggal": "2026-10-13", "kategori": "makanan", "nominal": 120000},\n    {"id": 4, "tanggal": "2026-10-13", "kategori": "makanan", "nominal": 95000},\n    {"id": 5, "tanggal": "2026-10-13", "kategori": "transport", "nominal": 60000},\n    {"id": 6, "tanggal": "2026-10-13", "kategori": "hiburan", "nominal": 200000},\n]\n\n# TULIS KODEMU: extract\ndef extract(data, tanggal):\n    return [t for t in data if t["tanggal"] == tanggal]\n\n# TULIS KODEMU: transform -> {kategori: total_nominal}\ndef transform(rows):\n    agg = {}\n    for r in rows:\n        agg[r["kategori"]] = agg.get(r["kategori"], 0) + r["nominal"]\n    return agg\n\ndef load(agg, mart):\n    for k, v in agg.items():\n        mart[k] = mart.get(k, 0) + v\n    return mart\n\n# TULIS KODEMU: jalankan pipeline\nbatch = extract(transaksi, "2026-10-13")\nmart = load(transform(batch), {})\nprint(f"baris_batch={len(batch)}")\nprint(f"mart={mart}")\nprint(f"total={sum(mart.values())}")`,
        checks: [
          { kind: "equal", task: "t1", name: "batch", value: [{"id": 3, "tanggal": "2026-10-13", "kategori": "makanan", "nominal": 120000}, {"id": 4, "tanggal": "2026-10-13", "kategori": "makanan", "nominal": 95000}, {"id": 5, "tanggal": "2026-10-13", "kategori": "transport", "nominal": 60000}, {"id": 6, "tanggal": "2026-10-13", "kategori": "hiburan", "nominal": 200000}], label: "`batch` berisi 4 baris tgl 13", msg: "extract harus memfilter tanggal == '2026-10-13'." },
          { kind: "stdout_matches", task: "t3", pattern: "baris_batch=4", label: "`print` baris_batch=4", msg: "Ada 4 transaksi tanggal 2026-10-13." },
          { kind: "stdout_matches", task: "t3", pattern: "'makanan': 215000", label: "agregasi makanan=215000", msg: "120000 + 95000 = 215000." },
          { kind: "stdout_matches", task: "t3", pattern: "total=475000", label: "`print` total=475000", msg: "215000 + 60000 + 200000 = 475000." },
        ],
      },
      reference: "ETL = extract (filter) → transform (agregasi) → load (tulis mart). Fungsi murni, jangan ubah input.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Latency adalah fitur yang dibayar mahal: tiap pengurangan interval batch melipatgandakan biaya komputasi. Sebelum meminta 'lebih real-time', tulis angkanya: berapa rupiah per menit latency yang dihemat?",
        "💡 Micro-batch sering menjadi jawaban paling jujur: 'cukup segar' (menitan) dengan 'cukup murah' (satu pipeline). Streaming penuh hanya untuk keputusan yang benar-benar butuh hitungan detik.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: streaming adalah pajak kemewahan — bayar hanya bila keputusannya butuh",
        body: "Setiap kali seseorang berkata \"bikin real-time dong\", praktisi senior mendengar \"naikkan tagihan sekian kali lipat\". Heuristik biayanya kasar tapi jujur: setiap pemotongan interval batch menjadi setengahnya kira-kira melipatgandakan biaya komputasi — dari harian ke per-jam bukan 24 kali lebih mahal secara linear, tetapi mendekati itu setelah ditambah orkestrasi, monitoring, dan retry. Maka aturan keputusannya selalu dimulai dari manusia, bukan teknologi: \"siapa yang bertindak dalam X menit atas angka ini, dan berapa rupiah nilai keputusannya?\". Tidak ada nama dan tidak ada angka berarti tidak butuh streaming — titik. Jebakan paling mahal bernama real-time theater: pipeline streaming yang megah, dashboard yang berkedip tiap detik, dan tidak seorang pun melihatnya sebelum rapat mingguan. Itu animasi mahal, bukan sistem. Jalan tengah yang jujur adalah micro-batch menitan: cukup segar untuk keputusan operasional, cukup murah untuk dipertahankan tim kecil. Dan ingat asimetrinya: menaikkan latency itu mudah — ubah schedule; menurunkannya butuh arsitektur ulang. Mulailah dari batch, naikkan hanya saat ada keputusan yang benar-benar mati bila telat.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: batch atau streaming?",
      prose: [
        "Skenario 1 — Laporan keuangan harian. Kondisi: direksi baca tiap pagi, angka harus rekonsiliasi sempurna. Keputusan: batch harian. Alasan: kebenaran > kecepatan; rerun murah jika salah.",
        "Skenario 2 — Dashboard operasional gudang. Kondisi: manajer pantau tiap 10 menit, keputusan 'kirim armada tambahan'. Keputusan: micro-batch 5 menit. Alasan: lag rata-rata 2,5 menit cukup; biaya 25x lebih murah dari streaming.",
        "Skenario 3 — Alert fraud kartu kredit. Kondisi: transaksi mencurigakan harus diblokir dalam detik sebelum dana hilang. Keputusan: streaming. Alasan: di sini latency = uang; batch 5 menit berarti pencuri sudah kabur.",
        "Skenario 4 — Training model ML mingguan. Kondisi: butuh data 6 bulan, konsisten, bisa diulang. Keputusan: batch. Alasan: reproducibility mengalahkan kesegaran; streaming tidak memberi nilai tambah.",
        "Aturan praktis 10 detik: tanya 'berapa rupiah hilang jika data telat 1 jam?' Jika jawabannya kecil → batch. Jika besar → streaming. Jika ragu → mulai dari micro-batch, naikkan hanya jika terbukti kurang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih streaming karena 'skalabilitas'. Streaming tidak otomatis lebih scalable — ia hanya lebih cepat. Skala (volume data) dan kecepatan (latency) adalah dua sumbu berbeda; batch memproses petabyte dengan baik, streaming memproses kilobyte dengan cepat.",
      },
      reference: "Uang hilang karena telat = streaming. Selain itu = batch/micro-batch dulu.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: audit arsitektur KirimCepat",
      prose: [
        "Kamu konsultan yang mengaudit KirimCepat. Datanya: 2 juta event per hari. Opsi A: batch tiap 5 menit — 288 run per hari, tiap run Rp150 (serverless singkat). Opsi B: streaming penuh — cluster Rp45.000 per jam, nyala 24 jam.",
        "Hitung biaya bulanan (30 hari) kedua opsi dan rasionya. Lalu jawab: untuk dashboard yang dibuka direksi tiap pagi jam 8, opsi mana yang rasional? Tulis jawabanmu sebagai komentar di kode.",
        "Interpretasi: selisih Rp31 juta per bulan ini adalah 'pajak gengsi teknologi' — dibayar setiap bulan, tanpa ada keputusan yang membaik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_batch` per bulan (30 hari)" },
        { id: "t2", text: "Hitung `biaya_stream` per bulan dan `rasio` keduanya (1 desimal)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "biaya_batch=Rp1,296,000 | biaya_stream=Rp32,400,000 | rasio=25.0x",
      hints: [
        "Batch: 288 run/hari × Rp150 × 30 hari.",
        "Streaming: Rp45.000 × 24 jam × 30 hari.",
        "rasio = round(biaya_stream / biaya_batch, 1)",
      ],
      code: {
        starter: `# Audit KirimCepat: 2 juta event/hari\nrun_per_hari = 288  # batch tiap 5 menit\nbiaya_per_run = 150  # Rp, serverless singkat\nbiaya_stream_per_jam = 45_000  # Rp, cluster 24 jam\n\n# TULIS KODEMU\nbiaya_batch = \nbiaya_stream = \nrasio = \n\nprint(f"biaya_batch=Rp{biaya_batch:,}")\nprint(f"biaya_stream=Rp{biaya_stream:,}")\nprint(f"rasio={rasio}x")\n# Jawabanmu (tulis sbg komentar): untuk dashboard pagi, opsi mana?`,
        lockLines: 4,
        solution: `# Audit KirimCepat: 2 juta event/hari\nrun_per_hari = 288  # batch tiap 5 menit\nbiaya_per_run = 150  # Rp, serverless singkat\nbiaya_stream_per_jam = 45_000  # Rp, cluster 24 jam\n\n# TULIS KODEMU\nbiaya_batch = run_per_hari * biaya_per_run * 30\nbiaya_stream = biaya_stream_per_jam * 24 * 30\nrasio = round(biaya_stream / biaya_batch, 1)\n\nprint(f"biaya_batch=Rp{biaya_batch:,}")\nprint(f"biaya_stream=Rp{biaya_stream:,}")\nprint(f"rasio={rasio}x")\n# Jawaban: batch 5 menit. Dashboard dibaca pagi hari tidak butuh data detik-an;\n# hemat Rp31 juta/bulan, lag rata-rata hanya 2,5 menit.`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya_batch", value: 1296000, tol: 1, label: "`biaya_batch` = Rp1.296.000", msg: "288 × 150 × 30 = 1.296.000." },
          { kind: "equal", task: "t2", name: "biaya_stream", value: 32400000, tol: 1, label: "`biaya_stream` = Rp32.400.000", msg: "45.000 × 24 × 30 = 32.400.000." },
          { kind: "equal", task: "t2", name: "rasio", value: 25.0, tol: 1e-9, label: "`rasio` = 25.0", msg: "32,4jt / 1,296jt = 25,0." },
          { kind: "stdout_matches", task: "t3", pattern: "rasio=25\\.0x", label: "`print` menampilkan rasio", msg: "Baris terakhir: rasio=25.0x." },
        ],
      },
      reference: "Hitung dulu, gengsi kemudian. Selisih 25x = Rp31 juta/bulan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran. Perhatikan jebakan 'skala vs kecepatan'.",
      ],
      tasks: [],
      summary: [
        "Batch = kurir terjadwal (murah, andal); streaming = wartawan live (cepat, mahal, butuh siaga 24 jam); micro-batch = sweet spot kebanyakan kasus.",
        "Latency batch ≈ interval/2; biaya batch naik sebanding frekuensi: C = (1440/I) × c_run × 30.",
        "Pola ETL: extract → transform → load, dengan fungsi murni yang tidak merusak input.",
        "Pilih berdasarkan harga keterlambatan: rupiah hilang karena telat → streaming; selain itu → batch/micro-batch dulu.",
        "Skala (volume) ≠ kecepatan (latency): batch memproses petabyte dengan baik, streaming memproses kilobyte dengan cepat.",
      ],
      next: { label: "DE3 — SQL Lanjutan untuk DE", href: "/v2/learn/de3-sql" },
      quiz: [
        {
          q: "Dashboard gudang dipantau tiap 10 menit untuk keputusan kirim armada. Arsitektur paling rasional?",
          options: [
            { text: "Streaming penuh dengan Kafka", why: "Berlebihan: keputusan tiap 10 menit tidak butuh latency detik; biayanya 25x lipat tanpa nilai tambah." },
            { text: "Micro-batch tiap 5 menit", why: "Tepat: lag rata-rata 2,5 menit < 10 menit kebutuhan, biaya mendekati batch.", correct: true },
            { text: "Batch harian jam 6 pagi", why: "Terlalu lambat: keputusan tiap 10 menit tidak bisa menunggu data kemarin." },
            { text: "Query langsung ke database produksi", why: "Berbahaya: membebani DB transaksional dan tidak punya histori/kualitas terjaga." },
          ],
        },
        {
          q: "Batch dijalankan tiap 15 menit. Berapa keterlambatan rata-rata datanya?",
          options: [
            { text: "15 menit", why: "Itu keterlambatan maksimum, bukan rata-rata." },
            { text: "7,5 menit", why: "Tepat: rata-rata = interval/2. Event datang acak di antara dua run.", correct: true },
            { text: "30 menit", why: "Terlalu besar; tidak ada dasarnya." },
            { text: "0 menit", why: "Batch tidak pernah 0 — selalu ada jeda antar run." },
          ],
        },
        {
          q: "Mana pernyataan yang benar tentang streaming?",
          options: [
            { text: "Streaming otomatis lebih scalable daripada batch", why: "Skala (volume) dan kecepatan (latency) adalah sumbu berbeda — streaming tidak otomatis lebih scalable." },
            { text: "Kompleksitas utama streaming ada di operasi: exactly-once, ordering, replay, on-call", why: "Tepat: kode boleh 50 baris, tapi operasinya butuh siaga 24 jam.", correct: true },
            { text: "Streaming selalu lebih murah karena tidak menyimpan data", why: "Salah total: cluster 24 jam justru jauh lebih mahal dari batch terjadwal." },
            { text: "Streaming tidak butuh monitoring", why: "Sebaliknya: streaming paling butuh monitoring karena gagal dalam detik, bukan jam." },
          ],
        },
        {
          q: "Dalam lab ETL, kenapa fungsi transform tidak boleh mengubah list input?",
          options: [
            { text: "Karena Python melarangnya", why: "Python tidak melarang; ini soal disiplin desain, bukan aturan bahasa." },
            { text: "Agar rerun pipeline menghasilkan angka yang sama (reproducible)", why: "Tepat: fungsi murni = input sama → output sama, fondasi debugging dan idempotensi.", correct: true },
            { text: "Agar kode berjalan lebih cepat", why: "Kecepatan bukan alasannya; kebenaran dan keterulangan yang dipertaruhkan." },
            { text: "Karena data mart akan penuh", why: "Tidak berhubungan dengan kapasitas mart." },
          ],
        },
        {
          q: "Kasus mana yang WAJIB streaming?",
          options: [
            { text: "Laporan keuangan bulanan untuk direksi", why: "Batch bulanan/harian cukup; kebenaran > kecepatan." },
            { text: "Training model churn tiap minggu", why: "Batch mingguan cukup; reproducibility lebih penting." },
            { text: "Pemblokiran transaksi kartu kredit mencurigakan dalam hitungan detik", why: "Tepat: setiap detik telat = dana hilang. Di sini latency = uang.", correct: true },
            { text: "Dashboard jumlah pengunjung website kemarin", why: "Batch harian lebih dari cukup." },
          ],
        },
        {
          q: "E-commerce butuh 'stok real-time' untuk 200 gerai. Setelah dihitung: batch 5 menit cukup (keputusan restock harian), streaming 12x lebih mahal. Keputusan?",
          options: [
            { text: "Tetap streaming — real-time selalu lebih baik", why: "'Selalu lebih baik' = mitos termahal DE. 12x biaya untuk keputusan harian = pajak gengsi teknologi Rp31 juta/bulan (mini-case lesson ini)." },
            { text: "Batch 5 menit — latency mengikuti kebutuhan keputusan", why: "Tepat ekonomi latency: bayar latency yang DIBUTUHKAN keputusan, bukan yang TERKECIL secara teknis. 5 menit << 24 jam (siklus restock) dengan 1/12 biaya.", correct: true },
            { text: "Batch harian saja — paling murah", why: "Harian berisiko: stok habis siang hari baru ketahuan besok. 'Paling murah' yang mengorbankan keputusan = mahal juga." },
            { text: "Tunda sampai ada budget streaming", why: "Menunda solusi yang cukup demi solusi yang sempurna = 200 gerai tetap tanpa data stok. Solusi cukup hari ini > solusi sempurna tahun depan." },
          ],
        },
        {
          q: "Rumus C_batch = (24×60/I) × c_run × 30. Jika interval I diperkecil dari 60 ke 5 menit, biaya menjadi?",
          options: [
            { text: "2x lipat", why: "Salah hitung: (1440/5)/(1440/60) = 288/24 = 12. Interval 12x lebih kecil = 12x run = 12x biaya." },
            { text: "12x lipat", why: "Tepat: biaya batch berbanding terbalik dengan interval. I: 60→5 = 12x lebih sering = 12x biaya. Inilah kenapa 'sedikit lebih real-time' tidak pernah sedikit biayanya.", correct: true },
            { text: "Tetap — c_run turun sendiri", why: "c_run (biaya per run) tidak otomatis turun saat interval mengecil. Asumsi gratis = bug anggaran." },
            { text: "Setengahnya", why: "Terbalik: memperkecil interval MENAMBAH run, bukan mengurangi." },
          ],
        },
      ],
    },
  ],
};

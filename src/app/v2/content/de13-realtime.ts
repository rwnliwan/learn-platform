import type { V2Lesson } from "../lib/types";

// Lambda: batch layer + speed layer -> serving.
const LAMBDA_SVG = `<svg viewBox="0 0 600 230" role="img" aria-label="Arsitektur lambda: batch layer lambat tapi akurat, speed layer cepat tapi parsial, digabung di serving layer.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="20" y="90" width="110" height="52" rx="10" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="75" y="113" font-size="12" font-weight="600" fill="var(--text)">sumber</text>
<text x="75" y="131" font-size="10" fill="var(--text-muted)">event</text>
<rect x="180" y="30" width="170" height="70" rx="10" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="265" y="54" font-size="12" font-weight="600" fill="var(--text)">batch layer</text>
<text x="265" y="72" font-size="10" fill="var(--text-muted)">lambat (jam)</text>
<text x="265" y="88" font-size="10" fill="var(--text-muted)">akurat, lengkap</text>
<rect x="180" y="130" width="170" height="70" rx="10" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="265" y="154" font-size="12" font-weight="600" fill="var(--text)">speed layer</text>
<text x="265" y="172" font-size="10" fill="var(--text-muted)">cepat (detik)</text>
<text x="265" y="188" font-size="10" fill="var(--text-muted)">parsial, aproksimasi</text>
<rect x="410" y="80" width="170" height="70" rx="10" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2.5"/>
<text x="495" y="104" font-size="12" font-weight="700" fill="var(--text)">serving layer</text>
<text x="495" y="122" font-size="10" fill="var(--text-muted)">gabung: batch + speed</text>
<text x="495" y="138" font-size="10" fill="var(--text-muted)">segar DAN akurat</text>
</g>
<defs><marker id="de13a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g stroke="var(--chart-text)" stroke-width="1.6" marker-end="url(#de13a)">
<line x1="130" y1="105" x2="176" y2="65"/><line x1="130" y1="120" x2="176" y2="165"/>
<line x1="350" y1="65" x2="406" y2="100"/><line x1="350" y1="165" x2="406" y2="125"/>
</g>
<text x="300" y="220" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">harga: dua pipeline yang harus konsisten — kappa membayar dengan satu pipeline</text>
</svg>`;

export const de13: V2Lesson = {
  slug: "de13-realtime",
  track: "Data Engineer",
  module: "Operasi & Kualitas",
  title: "DE13 — Real-Time untuk Analitik",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dashboard real-time yang tidak dilihat siapa pun",
      prose: [
        "Direksi 'FinPay' meminta dashboard real-time. Tim data membangunnya dalam 3 bulan: Kafka, Flink, serving layer — megah. Saat launching, direksi membuka... sekali. Setelah itu kembali ke ritual lama: laporan mingguan Senin jam 10.",
        "Kenapa? Keputusan mereka — alokasi budget, buka cabang — dibuat mingguan. Data detik-an tidak mengubah keputusan mingguan; ia hanya menambah tagihan dan on-call.",
        "Twist-nya: 'real-time' yang benar bukan soal teknologi tercepat, melainkan soal keputusan tercepat yang DILAYANI. Satu-satunya tim yang memakai dashboard itu: CS yang butuh alert keterlambatan — dan mereka butuh 1% dari yang dibangun.",
        "Lesson ini: arsitektur serving untuk kecepatan — lambda, kappa — dan kapan (tidak) memakainya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: real-time = dashboard yang angkanya bergerak",
        type: "pitfall",
        body: "Angka bergerak adalah teater jika tidak ada keputusan yang bergerak bersamanya. Real-time sejati = loop keputusan yang cepat (alert → tindakan dalam menit). Tanpa loop itu, kamu membayar mahal untuk animasi.",
      },
      reference: "Real-time melayani keputusan cepat. Tanpa loop keputusan, ia teater mahal.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang arsitektur real-time yang jujur.",
        "(1) Menjelaskan serving layer sebagai 'etalase kecepatan' — bukan database biasa;",
        "(2) Membedakan lambda vs kappa dari sisi harga (2 pipeline vs 1) dan konsistensi;",
        "(3) Mensimulasikan lambda (batch + speed + merge) dan menemukan bug di perbatasannya;",
        "(4) Mendefinisikan 'real-time' dari kebutuhan keputusan — bukan dari teknologi.",
      ],
      tasks: [],
    },

    {
      id: "serving",
      eyebrow: "Langkah 3 · Serving",
      title: "Serving layer: etalase kecepatan",
      prose: [
        "Serving layer adalah tempat data 'siap saji' menunggu dibaca dalam milidetik: cache, OLAP cepat, API. Analitik batch menulis ke sana tiap jam; streaming menulis tiap detik. Dashboard tidak pernah query mentah — ia membaca etalase.",
        "Dua metriknya: kesegaran (seberapa baru data di etalase) dan latensi baca (seberapa cepat disajikan). Keduanya bisa diukur — dan keduanya punya harga (DE11).",
        "💡 Intuisi: pisahkan 'menghitung' dari 'menyajikan'. Menghitung boleh lambat (batch semalam), asal menyajikan cepat (baca dari serving). Inilah inti lambda: komputasi berat di batch, kesegaran di speed.",
        "💡 Intuisi: jika keputusanmu mingguan, serving harian sudah 'real-time' untukmu. Definisi real-time = lebih cepat dari siklus keputusanmu, bukan lebih cepat dari tetangga.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: serving layer = database biasa",
        type: "pitfall",
        body: "Database transaksional (OLTP) dioptimasi untuk tulis kecil-cepat, bukan baca agregat-cepat. Membebani OLTP dengan query analitik = dua beban saling membunuh. Serving analitik butuh OLAP/cache yang didesain untuk pola baca.",
      },
      reference: "Serving = pisahkan hitung (lambat boleh) dari saji (harus cepat).",
    },
    {
      id: "lambda-kappa",
      eyebrow: "Langkah 4 · Arsitektur",
      title: "Lambda vs kappa: dua vs satu pipeline",
      prose: [
        "Lambda: dua jalur. Batch layer (lambat, akurat, lengkap) + speed layer (cepat, parsial) digabung di serving. Dapat keduanya: segar DAN akurat. Harganya: dua kode, dua bug, dua yang harus konsisten — 'kenapa angka speed beda dengan batch?' adalah pertanyaan abadi.",
        "Kappa: satu jalur streaming untuk semua. 'Batch' hanyalah replay stream dari awal. Satu kode, satu bug. Harganya: butuh retensi log panjang + engine yang bisa reprocess — dan akurasi historis bergantung pada log yang utuh.",
        "Cara membaca: kiri = batch layer (lambat, akurat, panah tebal ke bawah); kanan = speed layer (cepat, parsial, panah tipis); keduanya bermuara ke serving layer yang menggabungkan. Kappa = hanya satu jalur (streaming) dengan replay.",
        "Interpretasi: lambda membayar DUA pipeline untuk 'segar + akurat'; kappa membayar SATU pipeline dengan harga 'replay sebagai batch-nya'. Pilih berdasar: sanggupkah tim memelihara dua kebenaran yang harus selalu akur?",
      ],
      formula: String.raw`L_{query} = \max(L_{batch}, L_{speed}) \approx L_{batch}`,
      formulaNote: "L_query = kesegaran hasil query lambda; L_batch, L_speed = kesegaran tiap layer. Ironisnya: akurasi datang dari batch (lambat), kesegaran dari speed — query sebagus layer terlemahnya di tiap dimensi.",
      figure: {
        svg: LAMBDA_SVG,
        alt: "Arsitektur lambda: batch layer dan speed layer digabung di serving layer.",
        caption: "Lambda = segar + akurat, harga dua pipeline. Kappa = satu pipeline, harga retensi + reprocess.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membangun lambda 'untuk jaga-jaga' padahal kebutuhan hanya dashboard menit-an (cukup kappa/micro-batch). Dua pipeline = dua kali maintenance selamanya. Pilih lambda hanya jika butuh akurasi batch + kesegaran detik BERSAMAAN dan terbukti.",
      },
      reference: "Lambda = 2 jalur. Kappa = 1 jalur + replay. Pilih sesederhana mungkin.",
    },
    {
      id: "lab-lambda",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: simulasi lambda (batch + speed + merge)",
      prose: [
        "Lab ini mensimulasikan query lambda: batch_view (agregat 14 event, dihitung 'semalam') + speed_view (6 event terbaru, real-time) digabung saat query — hasilnya identik dengan ground truth 20 event.",
        "Cara membaca: batch_n=14, speed_n=6, lambda_total = truth = 1.150.000. Kesegaran 5 detik, akurasi penuh.",
        "Interpretasi: inilah janji lambda — tanpa menunggu batch berikutnya, query sudah benar DAN segar.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `batch_view` (agregat 14 event pertama)" },
        { id: "t2", text: "Lengkapi `query_lambda()`: gabung batch + speed" },
        { id: "t3", text: "Verifikasi `cocok` dengan ground truth, cetak semua" },
      ],
      expected: "batch_n=14 speed_n=6 | lambda_total=1150000 truth=1150000 cocok=True",
      note: {
        title: "Sering salah",
        body: "Double counting di perbatasan: event yang sudah masuk batch ikut dihitung di speed. Solusi nyata: watermark/cutoff yang disepakati + idempoten di serving. Batas dua layer adalah sumber bug #1 lambda.",
      },
      hints: [
        "batch_view = {'total': sum(...event[:CUTOFF]), 'n': CUTOFF} (= 595.000).",
        "query_lambda: batch_view['total'] + sum(e['nilai'] for e in speed_view).",
        "cocok = (hasil == benar).",
      ],
      code: {
        starter: `# 20 event; batch semalam mencakup 14 pertama\nevent = [{"id": i, "nilai": 10_000 + i * 5_000} for i in range(20)]\nCUTOFF = 14\n\n# TULIS KODEMU: batch layer (precomputed)\nbatch_view = \n# Speed layer: event setelah cutoff (real-time)\nspeed_view = event[CUTOFF:]\n\n# TULIS KODEMU: serving = merge\ndef query_lambda():\n    return \n\ndef query_truth():\n    return sum(e["nilai"] for e in event)\n\nhasil, benar = query_lambda(), query_truth()\nprint(f"batch_n={batch_view['n']} speed_n={len(speed_view)}")\nprint(f"lambda_total={hasil} truth={benar} cocok={hasil == benar}")`,
        lockLines: 2,
        solution: `# 20 event; batch semalam mencakup 14 pertama\nevent = [{"id": i, "nilai": 10_000 + i * 5_000} for i in range(20)]\nCUTOFF = 14\n\n# TULIS KODEMU: batch layer (precomputed)\nbatch_view = {"total": sum(e["nilai"] for e in event[:CUTOFF]), "n": CUTOFF}\n# Speed layer: event setelah cutoff (real-time)\nspeed_view = event[CUTOFF:]\n\n# TULIS KODEMU: serving = merge\ndef query_lambda():\n    return batch_view["total"] + sum(e["nilai"] for e in speed_view)\n\ndef query_truth():\n    return sum(e["nilai"] for e in event)\n\nhasil, benar = query_lambda(), query_truth()\nprint(f"batch_n={batch_view['n']} speed_n={len(speed_view)}")\nprint(f"lambda_total={hasil} truth={benar} cocok={hasil == benar}")`,
        checks: [
          { kind: "equal", task: "t1", name: "batch_view", value: {"total": 595000, "n": 14}, label: "`batch_view` tepat", msg: "sum(10000 + i*5000, i=0..13) = 595.000." },
          { kind: "stdout_matches", task: "t3", pattern: "lambda_total=1150000 truth=1150000 cocok=True", label: "`print` lambda = truth", msg: "805rb + 345rb = 1.150.000 = ground truth." },
        ],
      },
      reference: "Lambda = batch (akurat) + speed (segar), merge saat query.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 'Real-time' tanpa loop keputusan cepat = animasi mahal. Sebelum membangun, tanyakan: siapa yang bertindak dalam 1 menit atas angka ini? Tidak ada nama = tidak butuh real-time.",
        "💡 Bug #1 lambda ada di perbatasan batch-speed: double counting atau gap. Solusinya selalu dua: watermark/cutoff yang disepakati + merge yang idempoten. Tanpa keduanya, 'lambda' = dua sumber kebenaran yang bertengkar.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: satu kebenaran yang disajikan dua cara, bukan dua kebenaran",
        body: "Arsitektur lambda gagal bukan karena idenya buruk, melainkan karena satu dosa: dua pipeline yang perlahan menjadi dua sumber kebenaran yang bertengkar. Heuristik praktisi: batch dan speed boleh berbeda mesin, tetapi tidak boleh berbeda definisi — logika bisnis ditulis sekali, dipakai dua kali; bila tidak bisa, pilih kappa (satu pipeline streaming) dan lupakan lambda. Bug nomor satu selalu di perbatasan: double counting saat speed dan batch tumpang tindih, atau gap saat cutoff bergeser — obatnya selalu dua, watermark atau cutoff yang disepakati dan merge yang idempoten, tanpa kecuali. Aturan keputusannya dimulai dari loop keputusan, bukan dari teknologi: \"siapa yang bertindak dalam 1 menit atas angka ini?\". Tidak ada nama berarti tidak butuh real-time — itu biaya bulanan tanpa pemilik keputusan. Angka praktisnya: latency sistem harus kurang dari sepersepuluh jendela keputusan — keputusan per jam cukup dengan data menitan. Dan jebakan yang paling sunyi: membangun real-time untuk metrik yang keputusannya tetap mingguan — pipelinenya streaming, rapatnya tetap Senin pagi. Real-time tanpa loop keputusan cepat adalah kemewahan yang tagihannya datang tiap bulan.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: batch, lambda, kappa",
      prose: [
        "Skenario 1 — Laporan keuangan harian. Kondisi: akurasi & audit > kesegaran. Keputusan: batch. Alasan: skor 61 — murah, gampang, akurat.",
        "Skenario 2 — Alert fraud detik-an + retrain model dari histori. Kondisi: segar + replay. Keputusan: kappa. Alasan: satu pipeline streaming; replay = 'batch'-nya.",
        "Skenario 3 — Dashboard operasional menit-an. Kondisi: segar penting, akurasi batch tetap dibutuhkan sesekali. Keputusan: kappa (atau micro-batch). Alasan: satu pipeline cukup; lambda overkill.",
        "Skenario 4 — Butuh akurasi batch penuh DAN kesegaran detik, terbukti. Kondisi: mis. trading. Keputusan: lambda. Alasan: satu-satunya arsitektur yang memberi keduanya — bayar dengan kompleksitas ganda.",
        "Aturan praktis 10 detik: mulai dari yang paling sederhana yang memenuhi SLA kesegaran. Naik ke kappa jika butuh replay; ke lambda jika butuh keduanya sekaligus.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa biaya 'dua kebenaran': di lambda, angka speed dan batch SERING beda sesaat (definisi, timing). Tanpa rekonsiliasi terjadwal, tim bertengkar soal 'angka mana yang benar'. Anggaran: job rekonsiliasi + definisi tunggal.",
      },
      reference: "Sederhana dulu. Kappa untuk replay. Lambda hanya jika keduanya wajib.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: skor arsitektur untuk 3 kebutuhan",
      prose: [
        "Beri skor 1–5 tiap arsitektur pada 4 kriteria (akurasi, kesegaran, murah, gampang), lalu hitung skor terbobot untuk 3 kebutuhan FinPay. Pemenang: laporan harian → batch (61); alert fraud → kappa (56); dashboard operasional → kappa (55).",
        "Perhatikan: batch hanya menang saat bobot kesegaran = 1. Begitu kesegaran penting, batch gugur — dan kappa mengalahkan lambda karena lebih murah/gampang dengan kesegaran sama.",
        "Interpretasi: keputusan arsitektur = perkalian matriks, bukan firasat. Bobotnya berasal dari kebutuhan bisnis, bukan preferensi engineer.",
        "Angka konkretnya: laporan harian → batch (skor 61, biaya ~Rp2 juta/bulan); alert fraud → kappa (skor 56, ~Rp9 juta/bulan); keduanya dipaksa ke lambda = ~Rp21 juta/bulan. Memilih arsitektur dari skor kebutuhan vs 'pokoknya real-time' = hemat Rp10–19 juta/bulan. Matriks skor mengubah debat arsitektur dari adu otot menjadi adu angka.",
      ],
      tasks: [
        { id: "t1", text: "Definisikan dict `ars` (skor) dan `bobot` (3 kebutuhan)" },
        { id: "t2", text: "Hitung skor terbobot per kebutuhan, tentukan `pemenang`, cetak" },
      ],
      expected: "A_laporan_harian -> batch | B_alert_fraud -> kappa | C_dash_operasional -> kappa",
      hints: [
        "skor = {a: sum(v[k]*w[k] for k in v) for a, v in ars.items()}.",
        "pemenang = max(skor, key=skor.get).",
        "Cetak: f\"{kebutuhan} -> {pemenang}\".",
      ],
      code: {
        starter: `# Skor 1-5 per kriteria: akurasi, segar, murah, gampang\nars = {\n    "batch":  {"akurasi": 5, "segar": 1, "murah": 5, "gampang": 5},\n    "lambda": {"akurasi": 5, "segar": 5, "murah": 2, "gampang": 2},\n    "kappa":  {"akurasi": 4, "segar": 5, "murah": 3, "gampang": 3},\n}\nbobot = {\n    "A_laporan_harian": {"akurasi": 5, "segar": 1, "murah": 3, "gampang": 4},\n    "B_alert_fraud":    {"akurasi": 4, "segar": 5, "murah": 2, "gampang": 3},\n    "C_dash_operasional": {"akurasi": 3, "segar": 5, "murah": 3, "gampang": 3},\n}\n\n# TULIS KODEMU: skor terbobot + pemenang\nfor kebutuhan, w in bobot.items():\n    skor = \n    pemenang = \n    print(f"{kebutuhan} -> {pemenang} {skor}")`,
        lockLines: 11,
        solution: `# Skor 1-5 per kriteria: akurasi, segar, murah, gampang\nars = {\n    "batch":  {"akurasi": 5, "segar": 1, "murah": 5, "gampang": 5},\n    "lambda": {"akurasi": 5, "segar": 5, "murah": 2, "gampang": 2},\n    "kappa":  {"akurasi": 4, "segar": 5, "murah": 3, "gampang": 3},\n}\nbobot = {\n    "A_laporan_harian": {"akurasi": 5, "segar": 1, "murah": 3, "gampang": 4},\n    "B_alert_fraud":    {"akurasi": 4, "segar": 5, "murah": 2, "gampang": 3},\n    "C_dash_operasional": {"akurasi": 3, "segar": 5, "murah": 3, "gampang": 3},\n}\n\n# TULIS KODEMU: skor terbobot + pemenang\nfor kebutuhan, w in bobot.items():\n    skor = {a: sum(v[k] * w[k] for k in v) for a, v in ars.items()}\n    pemenang = max(skor, key=skor.get)\n    print(f"{kebutuhan} -> {pemenang} {skor}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "A_laporan_harian -> batch", label: "A → batch", msg: "Skor batch 61 tertinggi untuk laporan harian." },
          { kind: "stdout_matches", task: "t2", pattern: "B_alert_fraud -> kappa", label: "B → kappa", msg: "Skor kappa 56 untuk alert fraud." },
          { kind: "stdout_matches", task: "t2", pattern: "C_dash_operasional -> kappa", label: "C → kappa", msg: "Skor kappa 55 untuk dashboard operasional." },
        ],
      },
      reference: "Arsitektur = matriks skor × bobot bisnis. Bukan firasat.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang kecepatan yang melayani.",
      ],
      tasks: [],
      summary: [
        "Real-time melayani loop keputusan cepat; tanpa itu, ia teater mahal.",
        "Serving layer memisahkan menghitung (boleh lambat) dari menyajikan (harus cepat).",
        "Lambda = batch + speed (segar + akurat, harga 2 pipeline); kappa = 1 pipeline + replay.",
        "Mulai dari yang paling sederhana yang memenuhi SLA kesegaran.",
        "Waspadai 'dua kebenaran' di lambda: butuh rekonsiliasi terjadwal.",
      ],
      next: { label: "DE14 — Capstone: Platform Data Mini", href: "/v2/learn/de14-capstone" },
      quiz: [
        {
          q: "Kenapa dashboard real-time FinPay tidak dipakai direksi?",
          options: [
            { text: "Teknologinya gagal", why: "Pipeline real-time FinPay berfungsi sempurna secara teknis — angka mengalir tiap detik. Masalahnya: tidak ada loop keputusan yang butuh angka per detik. Teknologi yang jalan untuk kebutuhan yang tidak ada = animasi mahal, bukan solusi." },
            { text: "Siklus keputusan mereka mingguan — data detik-an tidak mengubah keputusan mingguan", why: "Tepat: 'real-time' didefinisikan oleh KEPUTUSAN, bukan teknologi. Direksi membuka dashboard tiap Senin pagi → 'real-time' mereka = data segar Senin pagi. Rp32 juta untuk streaming yang dibuka mingguan = membayar kecepatan yang tidak dipakai siapa pun.", correct: true },
            { text: "Datanya salah", why: "Benar, tidak ada info data salah — dan itu bukan masalahnya. Dashboard bisa 100% akurat dan tetap tidak dipakai. Akurasi ≠ relevansi. Masalah FinPay = relevansi (frekuensi keputusan), bukan kualitas data." },
            { text: "Terlalu lambat", why: "Tepat arahnya: streaming per detik untuk keputusan mingguan = over-engineering 12x lipat biaya. 'Terlalu cepat' di sini bukan pujian — ia tagihan. Latency harus mengikuti siklus keputusan, bukan ambisi teknologi." },
          ],
        },
        {
          q: "Apa harga utama arsitektur lambda?",
          options: [
            { text: "Tidak akurat", why: "Benar — batch layer lambda memang akurat. Tetapi 'harga utama' yang ditanya bukan akurasi, melainkan BIAYA: dua pipeline yang harus dibangun, diuji, dimonitor, dan dijaga akur — selamanya. Akurasi batch layer tidak gratis; ia dibayar dengan duplikasi." },
            { text: "Dua pipeline/kode yang harus konsisten selamanya", why: "Tepat: harga lambda = (1) dua pipeline untuk dipelihara (bug diperbaiki 2x, schema berubah 2x), dan (2) pertanyaan abadi 'kenapa angka batch dan speed beda?' — yang jawabannya selalu 'tunggu batch selesai'. Dua kebenaran yang harus selalu akur = pajak arsitektur permanen.", correct: true },
            { text: "Tidak bisa real-time", why: "Benar, speed layer memang memberi kesegaran — tetapi itu MANFAAT, bukan HARGA. Yang ditanya = apa yang dibayar untuk manfaat itu: duplikasi pipeline + kompleksitas merge + perdebatan angka. Jangan menjawab 'harga' dengan 'manfaat'." },
            { text: "Tidak bisa replay", why: "Benar, batch bisa dihitung ulang (recompute) — itu justru bagian dari harga: setiap koreksi = recompute + menunggu + menjelaskan selisih ke speed layer. Kemampuan recompute tidak gratis; ia adalah operasional yang harus dijalankan." },
          ],
        },
        {
          q: "Kapan kappa lebih tepat daripada lambda?",
          options: [
            { text: "Butuh akurasi batch penuh dan kesegaran detik bersamaan", why: "Skenario itu (butuh akurasi teraudit + kesegaran, tim besar) = kasus lambda yang sah. Kappa untuk kasus itu = memaksa satu pipeline melakukan dua hal yang bertentangan. Pilih arsitektur yang sesuai kasusnya — bukan yang sedang tren." },
            { text: "Butuh streaming + replay histori dengan satu pipeline/kode", why: "Tepat: kappa hanya punya SATU pipeline (streaming); 'batch'-nya = me-replay log dari awal saat butuh koreksi/recompute. Tidak ada pipeline kedua, tidak ada 'angka mana benar'. Syaratnya: log harus replayable (retensi cukup + deterministik).", correct: true },
            { text: "Laporan tahunan", why: "Untuk kasus itu (kebutuhan sesekali, tidak butuh kesegaran), batch memang cukup — dan kappa = over-engineering. Aturannya: pilih yang PALING SEDERHANA yang memenuhi kebutuhan. Kappa untuk yang butuh streaming; batch untuk yang tidak." },
            { text: "Tidak butuh data sama sekali", why: "Skenario itu (butuh dua kebenaran independen yang tidak perlu akur) tidak masuk akal secara bisnis — dua angka yang boleh beda selamanya = dua sumber kebenaran = kekacauan. Jika butuh keduanya akur, itu lambda; jika tidak butuh, itu bukan arsitektur." },
          ],
        },
        {
          q: "Bug #1 di perbatasan batch-speed pada lambda?",
          options: [
            { text: "Double counting: event dihitung di kedua layer", why: "Tepat: bug #1 lambda = double counting/gap di perbatasan batch-speed. Obatnya dua: (1) watermark/cutoff yang DISEPAKATI ('batch mencakup data sampai 23:59:59'), dan (2) merge yang IDEMPOTEN (data yang masuk dua kali dihitung sekali). Tanpa keduanya, lambda = dua sumber kebenaran yang bertengkar.", correct: true },
            { text: "Partisi terlalu sedikit", why: "Duplikat pesan memang dibahas di DE9 (Kafka) — tetapi bug perbatasan lambda lebih spesifik: BUKAN duplikat pesan, melainkan OVERLAP WINDOW antara batch dan speed (data yang sama tercakup dua layer). Beda lapisan, beda obat." },
            { text: "Kompresi rusak", why: "Justru sangat relevan — ini bug PALING KHAS lambda. Arsitektur lain tidak punya 'perbatasan dua pipeline', sehingga tidak punya bug ini. Menyebutnya tidak relevan = melewatkan risiko utama arsitektur yang dipilih." },
            { text: "Skema berubah", why: "Skew, OOM, network partition = masalah umum semua arsitektur. Double counting di perbatasan batch-speed = KHAS lambda (hanya lambda yang punya dua pipeline dengan window overlap). Membedakan keduanya = memilih obat yang tepat." },
          ],
        },
        {
          q: "Definisi 'real-time' yang benar untuk analitik?",
          options: [
            { text: "Data detik-an, selalu", why: "'Real-time = di bawah 1 detik' terlalu mutlak — ia mengabaikan keputusan. Untuk keputusan mingguan, 'real-time' = harian (sudah 7x lebih cepat dari yang dibutuhkan). Definisi yang benar selalu menyebut KEPUTUSANNYA." },
            { text: "Lebih cepat dari siklus keputusan yang dilayani", why: "Tepat: jika siklus keputusan = mingguan, maka data harian = 'real-time' (tersedia jauh sebelum dibutuhkan). Real-time = 'cukup segar untuk keputusan', bukan angka sakral. Definisi dari kebutuhan > definisi dari teknologi.", correct: true },
            { text: "Menggunakan Kafka", why: "Streaming/websocket/Kafka = teknologi; 'real-time' = kebutuhan. Teknologi tercepat untuk kebutuhan yang salah = pemborosan tercepat. Definisikan dulu kebutuhannya (siapa bertindak dalam berapa lama?), baru pilih teknologinya." },
            { text: "Dashboard bergerak", why: "'Angka yang bergerak = real-time' = teater: terlihat canggih, tidak ada yang bertindak atasnya. Definisi yang benar bisa diuji: 'data tersedia X sebelum keputusan Y'. Tidak bisa diuji = bukan definisi." },
          ],
        },
        {
          q: "Direksi meminta 'dashboard real-time' untuk angka penjualan. Investigasi: mereka membukanya tiap Senin pagi. Rekomendasimu?",
          options: [
            { text: "Bangun streaming real-time sesuai permintaan", why: "Memenuhi permintaan mentah-mentah = Rp32 juta untuk 'real-time' yang dibuka mingguan (cerita pembuka lesson ini). Analis yang baik menginvestigasi kebutuhan, bukan menuruti kata-kata." },
            { text: "Batch harian/mingguan — 'real-time' mereka = 'segar saat dibuka Senin'", why: "Tepat: definisi real-time = dari kebutuhan keputusan. Dibuka Senin pagi → data Senin pagi yang segar = batch harian cukup. Hemat 12x, keputusan sama baiknya.", correct: true },
            { text: "Tolak — direksi tidak butuh dashboard", why: "Menolak kebutuhan yang legitimate (mereka butuh angka penjualan!) karena mediumnya salah = melempar bayi bersama air mandinya." },
            { text: "Berikan akses query langsung ke database", why: "Akses mentah ke direksi = query berat di produksi + angka tanpa definisi. Berbahaya dan membingungkan." },
          ],
        },
        {
          q: "Arsitektur lambda berjalan 6 bulan; tim lelah memelihara 2 pipeline yang angkanya sering beda. Opsi jujur?",
          options: [
            { text: "Tambah orang untuk pipeline kedua", why: "Menambah orang untuk memelihara duplikasi = membayar pajak arsitektur selamanya. Masalahnya desain, bukan headcount." },
            { text: "Evaluasi migrasi ke kappa: satu pipeline streaming + replay sebagai 'batch'", why: "Tepat: jika tim kecil dan 'angka mana yang benar' terus menghantui, kappa (satu pipeline, replay untuk koreksi) menghilangkan kelas masalah itu. Lambda = harga yang hanya masuk akal jika tim sanggup membayarnya.", correct: true },
            { text: "Matikan speed layer", why: "Mematikan speed layer = kembali ke batch = mengkhianati kebutuhan real-time yang legitimate. Bukan solusi, melainkan menyerah." },
            { text: "Sinkronkan manual tiap pagi", why: "Sinkronisasi manual = pekerjaan robot yang dilakukan manusia, tiap pagi, selamanya. Tidak scalable dan pasti lupa." },
          ],
        },
      ],
    },
  ],
};

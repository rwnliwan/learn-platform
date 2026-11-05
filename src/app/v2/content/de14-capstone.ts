import type { V2Lesson } from "../lib/types";

// Medallion: bronze -> silver -> gold.
const MEDALLION_SVG = `<svg viewBox="0 0 600 210" role="img" aria-label="Arsitektur medallion: bronze mentah, silver bersih tervalidasi, gold agregat siap pakai.">
<defs><marker id="de14a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="30" y="55" width="150" height="100" rx="10" fill="#b0793a" opacity="0.3" stroke="#b0793a" stroke-width="2"/>
<text x="105" y="82" font-size="13" font-weight="700" fill="var(--text)">BRONZE</text>
<text x="105" y="102" font-size="11" fill="var(--text-muted)">mentah, apa adanya</text>
<text x="105" y="118" font-size="11" fill="var(--text-muted)">semua sumber</text>
<text x="105" y="138" font-size="11" fill="var(--text-muted)">lemari bukti</text>
<rect x="225" y="55" width="150" height="100" rx="10" fill="#a8a8a8" opacity="0.3" stroke="#a8a8a8" stroke-width="2"/>
<text x="300" y="82" font-size="13" font-weight="700" fill="var(--text)">SILVER</text>
<text x="300" y="102" font-size="11" fill="var(--text-muted)">bersih, tervalidasi</text>
<text x="300" y="118" font-size="11" fill="var(--text-muted)">satu kebenaran</text>
<text x="300" y="138" font-size="11" fill="var(--text-muted)">+ quality gate</text>
<rect x="420" y="55" width="150" height="100" rx="10" fill="#d4af37" opacity="0.3" stroke="#d4af37" stroke-width="2"/>
<text x="495" y="82" font-size="13" font-weight="700" fill="var(--text)">GOLD</text>
<text x="495" y="102" font-size="11" fill="var(--text-muted)">agregat siap pakai</text>
<text x="495" y="118" font-size="11" fill="var(--text-muted)">per tim / use case</text>
<text x="495" y="138" font-size="11" fill="var(--text-muted)">dimodel dimensional</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.8" marker-end="url(#de14a)">
<line x1="180" y1="105" x2="221" y2="105"/><line x1="375" y1="105" x2="416" y2="105"/>
</g>
<text x="300" y="190" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">makin ke kanan makin bersih, makin teragregasi, makin sedikit yang boleh akses mentahnya</text>
</svg>`;

export const de14: V2Lesson = {
  slug: "de14-capstone",
  track: "Data Engineer",
  module: "Operasi & Kualitas",
  title: "DE14 — Capstone: Platform Data Mini",
  estMinutes: 75,
  steps: [
    {
      id: "brief",
      eyebrow: "Langkah 1 · Brief",
      title: "Brief: e-commerce 'MajuJaya' butuh platform data",
      prose: [
        "MajuJaya: 500 ribu event checkout per hari (~15 GB), 3 sumber (checkout API, aplikasi mobile, gudang). Kebutuhan: (A) laporan revenue harian untuk direksi — harus akurat & teraudit; (B) alert fraud < 1 menit untuk tim CS; (C) dashboard operasional menit-an untuk manajer gudang.",
        "Kendala: tim data 3 orang, budget Rp10 juta/bulan, tidak ada tim on-call 24 jam. Kamu arsiteknya. Lesson capstone ini merangkum 13 lesson menjadi satu keputusan arsitektur — lalu kamu membangun versi mininya.",
        "Twist-nya: tidak ada jawaban 'benar' tunggal — yang ada adalah tradeoff yang bisa dipertahankan dengan angka. Itulah pekerjaan data engineer sesungguhnya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: capstone = membangun semuanya dari nol",
        type: "pitfall",
        body: "Capstone yang baik bukan membangun ulang Kafka di garasi, melainkan membuat keputusan arsitektur yang tepat lalu membuktikan pola kuncinya (medallion + gate + lineage) dalam skala mini. Kedalaman di pola, bukan luas di komponen.",
      },
      reference: "3 kebutuhan, 3 orang, Rp10 jt/bln. Keputusan = tradeoff berangka.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang platform data mini end-to-end.",
        "(1) Menyusun arsitektur referensi medallion + serving ganda untuk kasus e-commerce;",
        "(2) Menghitung budget (Rp9,75 juta/bulan) dan menerjemahkannya ke unit economics;",
        "(3) Menerapkan quality gate (Q-score) yang membedakan gagal baris vs gagal batch;",
        "(4) Memutuskan build vs buy per komponen dan mempertahankannya dengan angka.",
      ],
      tasks: [],
    },

    {
      id: "arsitektur",
      eyebrow: "Langkah 3 · Arsitektur",
      title: "Arsitektur referensi: medallion + serving ganda",
      prose: [
        "Jawaban referensi MajuJaya: medallion di lakehouse. Bronze: semua event mentah (bukti). Silver: bersih + quality gate (satu kebenaran). Gold: agregat per tim — gold_revenue (laporan, dimodel star), gold_ops (dashboard gudang).",
        "Untuk kebutuhan B (alert fraud < 1 menit): satu topik streaming kecil khusus event pembayaran mencurigakan → consumer idempoten → alert. BUKAN seluruh platform di-streaming-kan — hanya 1% yang butuh detik-an (DE2, DE13).",
        "Orkestrasi: DAG harian bronze→silver→gold dengan sensor kedatangan file; backfill idempoten per tanggal. Governance: lineage otomatis, akses per peran, PII masking di silver.",
        "💡 Intuisi: arsitektur yang bagus terlihat 'membosankan' — pola standar (medallion, star, gate) yang dirangkai tepat. Kreativitas di data engineering = memilih tradeoff yang tepat, bukan menemukan pola baru.",
        "💡 Intuisi: setiap komponen harus punya 'alasan angka': kenapa streaming hanya untuk fraud (biaya 25x), kenapa warehouse untuk gold (baca 1000x/hari), kenapa lake untuk bronze (tulis-sekali).",
        "Cara membaca: tiga zona berurutan — bronze (mentah, apa adanya), silver (bersih, tervalidasi), gold (agregat, siap pakai). Makin ke kanan makin bersih dan teragregasi. Dua serving layer di kanan: batch dan real-time.",
        "Interpretasi: medallion = progres kepercayaan. Bronze = bukti, silver = kebenaran, gold = etalase. Aturannya: jangan biarkan analis memakan bronze (bahan mentah) — dan jangan biarkan gold tanpa validasi silver.",
      ],
      figure: {
        svg: MEDALLION_SVG,
        alt: "Arsitektur medallion: bronze, silver, gold.",
        caption: "Medallion: makin ke kanan makin bersih dan teragregasi.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: satu arsitektur untuk semua kebutuhan",
        type: "pitfall",
        body: "Memaksa alert fraud lewat batch harian (telat) atau laporan keuangan lewat streaming (mahal + sulit diaudit). Tiga kebutuhan MajuJaya = tiga pola: batch akurat, streaming cepat, micro-batch tengah. Satu platform, pola ganda.",
      },
      reference: "Medallion + pola ganda: batch untuk akurat, streaming hanya untuk yang detik-an.",
    },
    {
      id: "lab-platform",
      eyebrow: "Langkah 4 · Lab capstone",
      title: "Lab capstone: platform mini end-to-end",
      prose: [
        "Bangun platform mini MajuJaya: bronze (6 event mentah: 1 duplikat retry, 1 null) → silver (dedup + quality gate Q) → gold (agregat per kategori) + lineage otomatis.",
        "Cara membaca: gate TAHAN (Q=0,50) karena ada null — baris gagal dikarantina, bukan seluruh batch dibuang; gold dihitung dari baris bersih: total Rp3.470.000.",
        "Interpretasi: inilah 'hari biasa' platform data — kotoran datang tiap hari, gate + karantina menanganinya tanpa drama, lineage mencatat semuanya.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `silver`: dedup berdasarkan `id`" },
        { id: "t2", text: "Hitung `Q` (2 cek) dan `gate`; karantina baris gagal ke `silver_ok`" },
        { id: "t3", text: "Bangun `gold` per kategori + lineage, cetak semua" },
      ],
      expected: "silver_n=5 Q=0.50 gate=TAHAN | gold={'elektronik': 2500000, 'fashion': 850000, 'makanan': 120000} | total=3470000",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Gate TAHAN lalu seluruh batch dibuang (data hilang sehari). Praktik nyata: karantina baris gagal + lanjutkan yang bersih + alert. Block total hanya untuk kegagalan katastrofik (skema hancur).",
      },
      hints: [
        "Dedup: lacak id terlihat dalam set.",
        "cek: no_null_nominal + id_unik; Q = sum/len; gate = 'LANJUT' jika Q >= 1.0.",
        "silver_ok = [r for r in silver if r['nominal'] is not None]; gold agregat per kat.",
      ],
      code: {
        starter: `LINEAGE = []\ndef catat(dari, ke):\n    LINEAGE.append((dari, ke))\n\nbronze = [\n    {"id": 1, "kat": "elektronik", "nominal": 2_500_000, "tgl": "2026-10-13"},\n    {"id": 2, "kat": "fashion", "nominal": 350_000, "tgl": "2026-10-13"},\n    {"id": 2, "kat": "fashion", "nominal": 350_000, "tgl": "2026-10-13"},\n    {"id": 3, "kat": "elektronik", "nominal": None, "tgl": "2026-10-13"},\n    {"id": 4, "kat": "fashion", "nominal": 500_000, "tgl": "2026-10-13"},\n    {"id": 5, "kat": "makanan", "nominal": 120_000, "tgl": "2026-10-13"},\n]\ncatat("sumber:checkout-api", "bronze_events")\n\n# TULIS KODEMU: SILVER (dedup)\nterlihat, silver = set(), []\n\ncatat("bronze_events", "silver_orders")\n\n# TULIS KODEMU: QUALITY GATE\ncek = {\n    "no_null_nominal": ,\n    "id_unik": ,\n}\nQ = sum(cek.values()) / len(cek)\ngate = "LANJUT" if Q >= 1.0 else "TAHAN"\nprint(f"silver_n={len(silver)} Q={Q:.2f} gate={gate}")\nsilver_ok = [r for r in silver if r["nominal"] is not None]\n\n# TULIS KODEMU: GOLD\ncatat("silver_orders", "gold_revenue_harian")\ngold = {}\n\nprint(f"gold={gold}")\nprint(f"total={sum(gold.values())}")\nprint("lineage=" + " -> ".join([a for a, b in LINEAGE] + [LINEAGE[-1][1]]))`,
        lockLines: 12,
        solution: `LINEAGE = []\ndef catat(dari, ke):\n    LINEAGE.append((dari, ke))\n\nbronze = [\n    {"id": 1, "kat": "elektronik", "nominal": 2_500_000, "tgl": "2026-10-13"},\n    {"id": 2, "kat": "fashion", "nominal": 350_000, "tgl": "2026-10-13"},\n    {"id": 2, "kat": "fashion", "nominal": 350_000, "tgl": "2026-10-13"},\n    {"id": 3, "kat": "elektronik", "nominal": None, "tgl": "2026-10-13"},\n    {"id": 4, "kat": "fashion", "nominal": 500_000, "tgl": "2026-10-13"},\n    {"id": 5, "kat": "makanan", "nominal": 120_000, "tgl": "2026-10-13"},\n]\ncatat("sumber:checkout-api", "bronze_events")\n\n# TULIS KODEMU: SILVER (dedup)\nterlihat, silver = set(), []\nfor r in bronze:\n    if r["id"] in terlihat:\n        continue\n    terlihat.add(r["id"])\n    silver.append(r)\ncatat("bronze_events", "silver_orders")\n\n# TULIS KODEMU: QUALITY GATE\ncek = {\n    "no_null_nominal": all(r["nominal"] is not None for r in silver),\n    "id_unik": len({r["id"] for r in silver}) == len(silver),\n}\nQ = sum(cek.values()) / len(cek)\ngate = "LANJUT" if Q >= 1.0 else "TAHAN"\nprint(f"silver_n={len(silver)} Q={Q:.2f} gate={gate}")\nsilver_ok = [r for r in silver if r["nominal"] is not None]\n\n# TULIS KODEMU: GOLD\ncatat("silver_orders", "gold_revenue_harian")\ngold = {}\nfor r in silver_ok:\n    gold[r["kat"]] = gold.get(r["kat"], 0) + r["nominal"]\n\nprint(f"gold={gold}")\nprint(f"total={sum(gold.values())}")\nprint("lineage=" + " -> ".join([a for a, b in LINEAGE] + [LINEAGE[-1][1]]))`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "silver_n=5 Q=0\\.50 gate=TAHAN", label: "gate TAHAN (Q=0.50)", msg: "Dedup: 6→5; null membuat 1 cek gagal." },
          { kind: "equal", task: "t3", name: "gold", value: {"elektronik": 2500000, "fashion": 850000, "makanan": 120000}, label: "`gold` tepat", msg: "Dari baris bersih (null dikarantina)." },
          { kind: "stdout_matches", task: "t3", pattern: "total=3470000", label: "`print` total=3470000", msg: "2,5jt + 850rb + 120rb." },
          { kind: "stdout_matches", task: "t3", pattern: "lineage=sumber:checkout-api -> bronze_events -> silver_orders -> gold_revenue_harian", label: "lineage lengkap", msg: "4 simpul tercatat otomatis." },
        ],
      },
      reference: "Bronze = bukti. Silver = kebenaran + gate. Gold = etalase. Lineage = otomatis.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 5 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Capstone platform dinilai dari keputusan yang dipertahankan, bukan komponen yang dibangun. 'Kenapa tidak pakai X?' harus punya jawaban angka — bukan 'belum sempat'.",
        "💡 Quality gate yang menahan SEMUA karena 1 baris null = gate yang akan di-bypass. Bedakan gagal baris (quarantine) vs gagal batch (tahan) — gate yang bijak dipertahankan, gate yang kaku ditinggalkan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: rancang dari anggaran, pertahankan dengan angka",
        body: "Capstone platform tidak dinilai dari komponen yang dibangun, melainkan dari keputusan yang bisa dipertahankan. Heuristiknya: mulai dari angka, bukan dari katalog fitur — anggaran Rp9,75 juta per bulan dibagi dulu secara kasar: sekitar 40 persen compute, 30 persen storage, 20 persen buffer insiden, 10 persen monitoring; setiap komponen yang diusulkan harus muat di amplopnya masing-masing. \"Kenapa tidak pakai X?\" harus dijawab dengan angka — \"X menambah Rp2,1 juta per bulan untuk latency yang tidak dibutuhkan SLA\" — bukan dengan \"belum sempat\". Aturan ketahanan yang membedakan platform produksi dari demo: setiap komponen wajib punya dua hal — pemilik bernama dan runbook satu halaman (\"kalau ini merah jam 3 pagi, lakukan A, B, C\"). Tanpa keduanya, itu hobi, bukan platform. Jebakan klasik capstone: gold-plating infrastruktur sementara SLA tidak pernah diukur — pipeline yang \"canggih\" tetapi tidak ada yang tahu apakah datanya telat. Dan soal quality gate: bedakan gagal baris (masuk karantina, batch jalan terus) dari gagal batch (tahan semuanya) — gate yang menahan semua karena satu baris null akan di-bypass diam-diam, dan bypass yang diam-diam itulah utang yang paling mahal.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: build vs buy per komponen",
      prose: [
        "Ingest (3 sumber): BUY — konektor managed / serverless. Alasan: bukan keunggulan kompetitif; tim 3 orang tidak boleh merawat konektor.",
        "Storage + warehouse: BUY — lakehouse managed. Alasan: Rp1,5–4 jt/bln < gaji setengah engineer untuk merawat HDFS.",
        "Orchestrator: BUY (managed) — DAG-as-code tetap ditulis sendiri. Alasan: scheduling adalah komoditas; logika DAG adalah aset.",
        "Transformasi inti (dedup, SCD, agregat): BUILD — SQL/Python milik sendiri. Alasan: inilah logika bisnis; tidak ada vendor yang tahu definisi 'revenue' MajuJaya.",
        "Quality gate + lineage: BUILD di atas framework (Great Expectations / OpenLineage). Alasan: aturan kualitas spesifik perusahaan; framework hanya kerangkanya.",
        "Aturan praktis 10 detik: beli komoditas (infra), bangun yang spesifik (logika bisnis + kualitas).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Build semuanya ('biar tidak vendor lock-in') dengan tim 3 orang. Hasilnya: 3 orang merawat infra alih-alih membangun logika bisnis — lock-in ke kode sendiri yang tidak terdokumentasi, lebih buruk dari lock-in vendor.",
      },
      reference: "Beli infra komoditas; bangun logika + kualitas spesifik.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: budget Rp9,75 juta & SLA",
      prose: [
        "Estimasi bulanan MajuJaya: ingest 0,5jt + lake 1,5jt + warehouse 4jt + orchestrator 1jt + streaming alert 2jt + observability 0,75jt = Rp9.750.000 — di bawah budget Rp10 juta. Biaya per 1000 event: Rp650.",
        "SLA yang dijanjikan: dashboard ≤ 1 jam segar; alert fraud ≤ 1 menit; gate Q ≥ 0,98; availability 99,5% (= 216 menit downtime/bln).",
        "Interpretasi: arsitektur selesai ketika ada DUA angka: biaya dan SLA. Tanpa keduanya, itu sketsa — bukan rencana. Unit economics-nya:",
      ],
      formula: String.raw`c = \frac{C_{bulan}}{E_{hari} \times 30 / 1000}`,
      formulaNote: "c = biaya per 1000 event (rupiah); C_bulan = total biaya bulanan; E_hari = event per hari. Contoh: 9.750.000 / (500.000 × 30 / 1000) = Rp650. Naik 10x volume → c naik tak linear jika ada biaya tetap.",
      tasks: [
        { id: "t1", text: "Hitung `total` dari dict `komponen`" },
        { id: "t2", text: "Hitung `downtime_menit` (99,5%) dan `rp_per_1000_event`, cetak" },
      ],
      expected: "total_bulanan=Rp9,750,000 | downtime_99_5=216 menit/bln | rp_per_1000_event=650",
      hints: [
        "total = sum(komponen.values()).",
        "downtime = 0.005 × 30 × 24 × 60 menit.",
        "per 1000 event = total / (500.000 × 30 / 1000).",
      ],
      code: {
        starter: `komponen = {\n    "ingest_serverless": 500_000,\n    "storage_lake_5TB": 1_500_000,\n    "warehouse": 4_000_000,\n    "orchestrator": 1_000_000,\n    "streaming_alert": 2_000_000,\n    "observability": 750_000,\n}\nevent_per_hari = 500_000\n\n# TULIS KODEMU\ntotal = \ndowntime_menit = \nrp_per_1000 = \n\nprint(f"total_bulanan=Rp{total:,}")\nprint(f"downtime_99_5={downtime_menit:.0f} menit/bln")\nprint(f"rp_per_1000_event={rp_per_1000:.0f}")`,
        lockLines: 8,
        solution: `komponen = {\n    "ingest_serverless": 500_000,\n    "storage_lake_5TB": 1_500_000,\n    "warehouse": 4_000_000,\n    "orchestrator": 1_000_000,\n    "streaming_alert": 2_000_000,\n    "observability": 750_000,\n}\nevent_per_hari = 500_000\n\n# TULIS KODEMU\ntotal = sum(komponen.values())\ndowntime_menit = 0.005 * 30 * 24 * 60\nrp_per_1000 = total / (event_per_hari * 30 / 1000)\n\nprint(f"total_bulanan=Rp{total:,}")\nprint(f"downtime_99_5={downtime_menit:.0f} menit/bln")\nprint(f"rp_per_1000_event={rp_per_1000:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: 9750000, tol: 1, label: "`total` = Rp9.750.000", msg: "Jumlahkan 6 komponen." },
          { kind: "stdout_matches", task: "t2", pattern: "downtime_99_5=216 menit/bln", label: "`print` downtime 216", msg: "0,5% × 30 × 24 × 60 = 216." },
          { kind: "stdout_matches", task: "t2", pattern: "rp_per_1000_event=650", label: "`print` Rp650/1000 event", msg: "9,75jt / 15.000 = 650." },
        ],
      },
      reference: "Rencana = arsitektur + biaya + SLA. Tanpa angka = sketsa.",
    },
    {
      id: "design-review-fraud",
      eyebrow: "Langkah 8 · Design review",
      title: "Design review 1: pipeline fraud real-time",
      prose: [
        "Brief baru, bukan dari MajuJaya. BankMini: 2 juta transaksi kartu per hari (~23 per detik rata-rata, puncak 120/detik saat flash sale). Aturannya: setiap transaksi mendapat skor risiko dalam ≤300 ms (p99), dan transaksi mencurigakan harus memicu alert ke tim CS dalam 1 menit. False positive = nasabah sah diblokir (marah, churn). False negative = fraud lolos (rugi uang).",
        "Ini BUKAN masalah batch: tidak ada yang menunggu laporan besok. Ini masalah streaming dengan dua musuh — latensi dan label yang telat. Label kebenaran (chargeback) baru datang berhari-hari kemudian; model hari ini menilai dengan data kemarin.",
        "Keputusan yang harus kamu ambil (tasks di bawah): (1) di mana skor dihitung — inline di API checkout, di stream processor, atau di layanan skor terpisah; (2) semantik pengiriman alert — at-least-once + consumer idempoten vs exactly-once end-to-end; (3) dari mana fitur datang — dihitung on-the-fly atau dibaca dari feature store online; (4) apa yang terjadi saat model mati.",
        "Jawaban referensi: topik Kafka khusus transaksi → stream processor (exactly-once) yang membaca fitur dari feature store online dengan point-in-time correctness ('3 transaksi 5 menit terakhir' harus dihitung dari data SEBELUM event ini, bukan sesudahnya) → skor dihitung di dalam processor (bukan di API) → consumer alert idempoten → keputusan + penjelasan ditulis ke bronze sebagai bukti audit. Budget latensi p99: 50 ms ingest + 100 ms fitur + 80 ms model + 70 ms publish = 300 ms.",
        "Kenapa tidak inline di API checkout? Karena itu mengikat nasib checkout ke nasib model: model lambat = checkout lambat = revenue mati. Scoring di stream processor + API checkout hanya membaca hasil skor dari cache (TTL 5 menit) = checkout tetap jalan saat pipeline fraud gangguan. Circuit breaker + kebijakan default bertingkat: saat skor tak tersedia, transaksi kecil lolos (default-allow) dengan flag review, transaksi besar ditahan.",
        "Retraining: batch harian dari bronze (keputusan + label chargeback yang masuk belakangan), challenger diuji shadow 1 minggu sebelum naik tahta. Model fraud membusuk cepat — pola fraud berubah tiap musim, drift di sini bukan teori.",
        "Cara membaca brief ini: pisahkan tiga jalur — jalur skor (cepat, boleh perkiraan), jalur alert (tepat, idempoten), jalur audit (lengkap, immutable). Ketiganya membaca event yang sama, tetapi dengan janji yang berbeda.",
        "Interpretasi: design review fraud dinilai dari jawaban atas empat pertanyaan — di mana latensi dibayar, di mana konsistensi dibayar, apa yang terjadi saat komponen mati, dan dari mana label belajar datang. Arsitektur yang tidak menjawab keempatnya = sketsa.",
      ],
      tasks: [
        { id: "t1", text: "Pilih di mana skor dihitung: inline di API checkout, di stream processor, atau layanan skor terpisah? Tulis 1 kalimat alasan latensi/ketahanan." },
        { id: "t2", text: "Pilih semantik alert: at-least-once + consumer idempoten, atau exactly-once end-to-end? Tulis tradeoff biaya vs duplikasi." },
        { id: "t3", text: "Tulis kebijakan saat model mati: transaksi kecil vs besar diperlakukan bagaimana, dan siapa yang me-review?" },
        { id: "t4", text: "Tulis dari mana label training berasal dan kapan ia tersedia — lalu jelaskan kenapa 'label kemarin' berbahaya tanpa point-in-time." },
      ],
      note: {
        title: "🚨 Jebakan: melatih ulang dengan label yang belum matang",
        type: "pitfall",
        body: "Chargeback datang berhari-hari setelah transaksi. Melatih model dengan 'label sementara' (belum ada chargeback = dianggap sah) = data leakage terbalik: model belajar bahwa fraud terbaru 'tidak terjadi'. Selalu join label dengan point-in-time correctness: label untuk event tanggal X hanya boleh yang sudah final per tanggal X. Dan soal false positive: 1% FP dari 2 juta transaksi = 20 ribu nasabah sah diblokir per hari — threshold bukan angka statistik, melainkan keputusan bisnis.",
      },
      reference: "Fraud real-time: skor di stream, checkout baca cache; default-allow bertingkat saat model mati; label telat = point-in-time.",
    },
    {
      id: "design-review-regulatory",
      eyebrow: "Langkah 9 · Design review",
      title: "Design review 2: regulatory data mart",
      prose: [
        "Brief kedua. Regulator meminta laporan bulanan eksposur portofolio per segmen debitur, dengan 5 tahun histori. Syarat kerasnya: angka laporan HARUS cocok rupiah-per-rupiah dengan sumber (core banking) — selisih Rp1 pun harus bisa dijelaskan; setiap angka harus bisa dilacak: dihitung oleh kode versi apa, dari snapshot data tanggal berapa, oleh siapa, kapan.",
        "Ini kebalikan dari fraud: tidak ada yang butuh cepat, semuanya butuh BENAR dan BISA DIBUKTIKAN. Pola jawabannya batch terjadwal + snapshot immutable + rekonsiliasi sebagai gerbang penerbitan.",
        "Keputusan yang harus kamu ambil (tasks di bawah): (1) seberapa sering data dibekukan — snapshot harian atau bulanan; (2) strategi rekonsiliasi — apa yang dibandingkan dengan apa, toleransi berapa; (3) apa yang di-pin saat laporan diterbitkan; (4) siapa boleh baca/tulis di tiap lapisan; (5) apa yang terjadi saat rekonsiliasi gagal.",
        "Jawaban referensi: bronze immutable 7 tahun (retensi regulasi) → silver harian → snapshot bulanan `mart_regulatory_YYYYMM` yang TIDAK PERNAH diubah setelah diterbitkan (koreksi = versi baru, bukan edit). Job rekonsiliasi membandingkan total per segmen mart vs core banking: toleransi Rp0 — selisih apa pun = investigasi, bukan footnote. Setiap penerbitan mencatat (versi kode, tanggal snapshot, run id, pelaksana) di tabel audit. Akses: tim compliance baca gold, auditor read-only, PII di-masking; analis produk tidak punya akses ke mart regulasi.",
        "Aturan emasnya: laporan yang sudah diterbitkan adalah artefak beku. 'Hitung ulang saat auditor bertanya' = angka berubah = kepercayaan hilang. Kalau rekonsiliasi gagal, laporan DITAHAN dan diinvestigasi — menerbitkan dengan catatan kaki 'ada selisih kecil' adalah cara tercepat kehilangan lisensi.",
        "Cara membaca brief ini: cari tiga hal — apa yang dibekukan (snapshot), apa yang membuktikan (rekonsiliasi + lineage), siapa yang boleh menyentuh (akses). Ketiganya harus ada sebelum laporan pertama terbit.",
        "Interpretasi: design review regulasi dinilai dari jawaban atas satu pertanyaan — 'bisakah kamu membuktikan angka 14 bulan lalu, rupiah-per-rupiah, beserta siapa yang menghitungnya?' Kalau jawabannya 'hitung ulang saja', arsitekturnya gagal.",
      ],
      tasks: [
        { id: "t1", text: "Tentukan frekuensi snapshot dan retensi: harian atau bulanan? Berapa tahun bronze disimpan? Tulis alasannya." },
        { id: "t2", text: "Tulis aturan rekonsiliasi: apa dibandingkan dengan apa, toleransi berapa, dan apa yang terjadi saat gagal." },
        { id: "t3", text: "Tulis apa saja yang di-pin saat laporan diterbitkan (versi kode, snapshot, run id, pelaksana) dan di mana dicatat." },
        { id: "t4", text: "Tulis matriks akses: siapa boleh baca/tulis di bronze, silver, dan mart regulasi." },
      ],
      note: {
        title: "🚨 Jebakan: snapshot yang bisa ditulis ulang",
        type: "pitfall",
        body: "Mart yang di-overwrite tiap bulan = tidak ada bukti historis. Auditor meminta angka 14 bulan lalu dan kamu tidak bisa mereproduksinya — karena datanya sudah tertimpa tiga kali. Snapshot = append-only; koreksi = versi baru dengan catatan koreksi, bukan edit diam-diam. Versi yang diedit diam-diam = pemalsuan dokumen di mata regulator.",
      },
      reference: "Regulasi: batch + snapshot beku + rekonsiliasi Rp0 + versi tercatat + akses ketat.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — dan selamat!",
      prose: [
        "Enam pertanyaan terakhir track ini. Setelah ini, kamu punya peta lengkap fondasi data engineering.",
      ],
      tasks: [],
      summary: [
        "DE menjaga makna + keandalan data; analis hebat gagal di atas fondasi bergeser.",
        "Pilih latency dari keputusan yang dilayani; batch/micro-batch dulu, streaming jika latency = uang.",
        "SQL deterministik + berlapis (staging→clean→mart); Python idempoten + backoff.",
        "Warehouse/lake/lakehouse dipilih dari pola baca; Parquet untuk analitik.",
        "Model: grain kontrak, star untuk serving, vault untuk labil; DAG untuk dependensi; quality gate + kontrak untuk kebenaran; Kafka untuk cepat/replay/decouple; Spark untuk yang tak muat memori; tuning = kecilkan B_scan; governance = kode; real-time melayani keputusan.",
        "Capstone: medallion + pola ganda + build-vs-buy + biaya & SLA berangka.",
      ],
      next: { label: "DE15 — CI/CD untuk Data Pipeline", href: "/v2/learn/de15-cicd" },
      quiz: [
        {
          q: "MajuJaya butuh alert fraud <1 menit DAN laporan harian teraudit. Arsitektur tepat?",
          options: [
            { text: "Semua streaming", why: "Laporan harian yang teraudit butuh recompute deterministik + jejak audit — mahal dan sulit di streaming murni. Memaksa satu arsitektur (streaming) untuk dua kebutuhan yang bertentangan = overkill: bayar mahal untuk yang butuh murah." },
            { text: "Semua batch harian", why: "Benar: batch harian tidak bisa memberi alert <1 menit — latency minimumnya 24 jam. Kebutuhan ini WAJIB streaming (atau micro-batch menitan). Satu kebutuhan, satu pola yang cocok — tidak bisa ditawar." },
            { text: "Pola ganda: streaming kecil khusus fraud + batch medallion untuk laporan", why: "Tepat: alert fraud <1 menit → streaming/kappa; laporan harian teraudit → batch. Dua kebutuhan, dua pola — digabung di serving layer. Inilah inti DE2 (pilih pola dari kebutuhan) + DE13 (jujur soal harga). Satu arsitektur untuk semua = kompromi yang merugikan keduanya.", correct: true },
            { text: "Query langsung ke DB produksi", why: "Satu pipeline 'tengah-tengah' (mis. micro-batch 1 jam) = gagal di keduanya: terlalu lambat untuk alert <1 menit, terlalu rumit untuk laporan teraudit. Kompromi arsitektur sering berarti kalah dua kali." },
          ],
        },
        {
          q: "Gate Q=0,50 (TAHAN) karena 1 null. Respons tepat?",
          options: [
            { text: "Buang seluruh batch", why: "Benar: menahan 1 juta baris karena 1 null = 99,9999% data sehat dikorbankan untuk 0,0001% yang sakit. Respons proporsional: quarantine 1 baris, alirkan sisanya, perbaiki barisnya, replay jika perlu." },
            { text: "Karantina baris gagal, lanjutkan yang bersih, kirim alert", why: "Tepat: 1 null = gagal BARIS (quarantine); 40% null = gagal BATCH (tahan). Gate yang bijak punya ambang dan membedakan keduanya. Gate all-or-nothing = gate yang akan di-bypass — dan memang seharusnya, karena ia salah desain.", correct: true },
            { text: "Abaikan gate, lanjutkan semua", why: "Gate yang di-bypass 'sementara' lalu selamanya = pajangan. Tetapi solusinya bukan mengunci bypass — melainkan memperbaiki gate-nya (quarantine + ambang) sehingga tidak perlu di-bypass. Pajangan lahir dari desain yang kaku." },
            { text: "Hapus test-nya", why: "Menurunkan ambang diam-diam agar 'lolos' = menipu diri sendiri: gate hijau, data tetap kotor. Integritas gate = integritas data. Kalau gate terlalu ketat, UBAH DESAINNYA secara terbuka (quarantine), bukan angkanya diam-diam." },
          ],
        },
        {
          q: "Komponen mana yang paling tepat di-BUILD (bukan buy)?",
          options: [
            { text: "Konektor ingest standar", why: "Message queue, object storage, managed warehouse = komoditas: buy/managed. Membangun ulang Kafka sendiri = reinventing the wheel dengan biaya engineer. Bedakan 'spesifik perusahaan' vs 'komoditas'." },
            { text: "Cluster Kafka dari nol", why: "Spark cluster, orchestrator = komoditas berat: buy/managed (atau layanan terkelola). Build hanya jika menjadi pembeda bisnis — klaster komputasi bukan pembeda untuk e-commerce." },
            { text: "Logika transformasi + definisi metrik bisnis", why: "Tepat: yang di-BUILD = logika spesifik MajuJaya (aturan fraud-nya, definisi metriknya, kontrak datanya) — tidak ada vendor yang tahu. Komoditas (queue, storage, compute) = buy. Aturannya: build yang membedakan, buy yang generik.", correct: true },
            { text: "Object storage", why: "DNS, CDN, object storage = komoditas murni: buy tanpa diskusi. Energi desain dihabiskan untuk yang spesifik perusahaan." },
          ],
        },
        {
          q: "Anggaran Rp9,75 jt/bln untuk 15 juta event/bln. Metrik kunci?",
          options: [
            { text: "Rp650 per 1000 event — untuk menilai skala biaya saat volume naik 10x", why: "Tepat: Rp9,75 jt / 15 juta event = Rp650 per 1.000 event. Unit economics ini memprediksi: saat 30 juta event, butuh Rp19,5 jt. Metrik kunci arsitektur = biaya per unit — ia yang menentukan apakah arsitektur scalable secara FINANSIAL.", correct: true },
            { text: "Jumlah tabel", why: "Total event 15 juta = vanity: besar, membanggakan, tidak bisa ditindaklanjuti. Yang bisa ditindaklanjuti = biaya per 1.000 event (naik? turun? kenapa?). Vanity metric = angka yang enak dilihat, tidak berguna diputuskan." },
            { text: "Jumlah engineer", why: "'15 juta event' = INPUT (diberikan pasar), bukan metrik arsitektur. Metrik arsitektur = yang bisa diubah desain: biaya per 1.000 event, latency p99, error rate. Jangan mengukur yang tidak bisa kamu pengaruhi." },
            { text: "Warna dashboard", why: "'Rp9,75 juta' = budget (batas), bukan metrik (pengukur kinerja). Budget menjawab 'boleh belanja berapa'; metrik menjawab 'seefisien apa'. Keduanya dibutuhkan — jangan tertukar." },
          ],
        },
        {
          q: "SLA 99,5% artinya downtime berapa per bulan?",
          options: [
            { text: "~216 menit", why: "Tepat: downtime/bulan = (1 − 0,995) × 30 × 24 × 60 = 0,005 × 43.200 = 216 menit (3,6 jam). Rumus umum: (1−SLO) × periode. Hafalkan polanya, bukan angkanya.", correct: true },
            { text: "~36 menit", why: "216 menit/bulan = 99,5%. Yang ~43 menit = 99,9%; ~4,3 menit = 99,99%. Tiap 'sembilan' tambahan = 10x lebih ketat. Jangan tertukar: 99,5% jauh lebih longgar dari 99,9%." },
            { text: "~7 jam", why: "432 menit/bulan (7,2 jam) = ~99%. 216 menit = 99,5% — tepat di tengah 99% dan 99,9%. Presisi itu penting: salah satu 'sembilan' = salah 10x lipat budget downtime." },
            { text: "Nol", why: "Benar sebagai prinsip — tetapi bukan jawaban untuk '99,5% = berapa menit'. 100% tidak realistis justru alasan SLA ditulis 99,x%: agar downtime-nya TERUKUR (216 menit) bukan disangkal. Yang tidak diukur = tidak dikelola." },
          ],
        },
        {
          q: "Satu kalimat: apa pekerjaan data engineer?",
          options: [
            { text: "Menulis query tercepat", why: "'Data engineer = orang SQL yang rajin' = terlalu sempit (mitos DE1). DE = pipeline + kualitas + biaya + keandalan + governance. Satu kalimat harus merangkum 14 lesson, bukan satu skill." },
            { text: "Menjaga makna, keandalan, dan keteramatan data dari sumber sampai keputusan — dengan tradeoff berangka", why: "Tepat jika kalimatnya: 'DE membangun pipa data yang tepercaya, terjangkau, dan tepat waktu — dari ingest hingga serving.' 14 lesson = 14 aspek dari kalimat itu. Satu kalimat yang baik = kompas, bukan slogan.", correct: true },
            { text: "Mengelola server", why: "'Mengotomasi deploy dan menjaga uptime' = DevOps. DE meminjam disiplinnya (CI/CD, monitoring) tetapi objeknya DATA: kualitas, lineage, biaya per query. Mirip alat, beda bahan." },
            { text: "Membuat dashboard", why: "'Menganalisis data untuk insight' = analis. DE membangun PIPA agar analis BISA menganalisis — tanpa menunggu CSV manual. Hilir vs hulu: analis di hilir, DE di hulu." },
          ],
        },
        {
          q: "Budget Rp9,75 jt/bulan untuk 15 juta event/bulan. Vendor A: Rp500/juta event. Vendor B: flat Rp8 jt + Rp100/juta. Pilih?",
          options: [
            { text: "Vendor A — pay as you go fleksibel", why: "15 × 500rb = Rp7,5 jt < Rp9,75 jt — muat. Tetapi 'fleksibel' tanpa hitung = keputusan malas. Hitung dulu." },
            { text: "Hitung: A = Rp7,5 jt, B = Rp9,5 jt — keduanya muat; pilih berdasar growth", why: "Tepat: unit economics dulu. Keduanya di bawah budget; A lebih murah hari ini, tetapi B lebih murah saat > 20 juta event (titik impas). Keputusan = proyeksi growth, bukan harga hari ini.", correct: true },
            { text: "Vendor B — flat lebih aman", why: "'Aman' tanpa hitung = Rp2 jt/bulan lebih mahal tanpa alasan. Flat bukan otomatis murah." },
            { text: "Build sendiri — paling murah", why: "Build sendiri tidak pernah 'paling murah' jika dihitung jujur (gaji engineer!). Opsi ini butuh TCO, bukan asumsi." },
          ],
        },
        {
          q: "Quality gate menahan SEMUA data karena 1 baris null dari 1 juta. Operator me-bypass gate 'sementara'. Respons arsitek?",
          options: [
            { text: "Marahi operator", why: "Menyalahkan manusia atas desain yang kaku = mengulangi kesalahan. Operator benar: gate-nya yang salah." },
            { text: "Perbaiki gate: quarantine baris gagal, tahan hanya jika gagal batch (>ambang)", why: "Tepat: bedakan gagal baris vs gagal batch. Gate yang bijak (quarantine + ambang) dipertahankan; gate yang kaku (all-or-nothing) DITINGGALKAN — dan memang seharusnya, karena ia memaksa bypass.", correct: true },
            { text: "Hapus gate-nya", why: "Menghapus = kembali ke 'data kotor mengalir diam-diam'. Yang dihapus = kekakuannya, bukan gerbangnya." },
            { text: "Kunci bypass secara teknis", why: "Mengunci bypass pada gate yang salah = memaksa data telat total karena 1 baris. Itu bukan keamanan, itu sabotase." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

export const mle5: V2Lesson = {
  slug: "mle5-serving",
  track: "Machine Learning Engineer",
  module: "Serving & Operasi",
  title: "MLE5 — Model Serving: Batch vs Online",
  estMinutes: 70,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model yang sudah dilatih harus 'dihidangkan' ke pengguna — dan cara menghidangkannya menentukan biaya, kecepatan, dan keandalan. Salah pilih arsitektur = bayar 20x lipat untuk manfaat yang sama.",
        "Tujuan lesson ini:",
        "• Membedakan batch, online, dan streaming serving beserta tradeoff-nya.",
        "• Menghitung perbandingan biaya batch vs online dari angka nyata.",
        "• Merancang arsitektur serving: API, model server, versioning endpoint.",
        "• Menghitung kebutuhan kapasitas dengan Little's Law.",
        "• Memutuskan pola serving untuk 4 skenario bisnis berbeda.",
        "Isi lesson: cerita tagihan 20x lipat → 3 pola serving + lab biaya → arsitektur & kapasitas + lab → SLO & operasional → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Tagihan $2.000/hari untuk pekerjaan $100/hari",
      prose: [
        "Sebuah marketplace mendeploy model prediksi demand sebagai API online: GPU menyala 24 jam, autoscaling siap melayani request kapan pun. Kedengarannya modern dan benar.",
        "Masalahnya: model itu hanya dipakai SEKALI sehari — jam 2 pagi, untuk menghitung prediksi 5 juta SKU yang dibaca tim merchandising jam 8 pagi. Tidak ada satu pun request real-time. GPU mahal itu menganggur 23 jam sehari menunggu pekerjaan yang sebenarnya batch.",
        "Twist-nya: tim memilih online serving bukan karena kebutuhan, melainkan karena 'itu yang modern'. Tagihannya $2.000/hari vs $100/hari jika dikerjakan sebagai batch job — 20x lipat untuk hasil yang identik.",
        "Pelajaran: pola serving dipilih dari KEBUTUHAN LATENSI pengguna, bukan dari tren teknologi. 'Kapan hasilnya dibutuhkan?' adalah pertanyaan pertama, bukan terakhir.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'serving modern = API real-time'",
        type: "pitfall",
        body: "Yang benar: mayoritas workload ML di perusahaan adalah batch (laporan harian, scoring mingguan, ETL). Real-time hanya untuk kasus yang benar-benar butuh respons < detik. Memaksakan online pada workload batch = membayar kemewahan yang tidak dipakai.",
      },
    },
    {
      id: "pola",
      eyebrow: "Langkah 3 · Tiga pola serving",
      title: "Batch, online, streaming: pilih senjatamu",
      prose: [
        "Batch: kumpulkan request, proses sekaligus dalam jadwal (harian/mingguan). Latency: menit–jam. Biaya: termurah (compute dipakai penuh, bisa spot/preemptible). Cocok: laporan, scoring portofolio, rekomendasi harian.",
        "Online: satu request → satu respons, dalam milidetik. Latency: <100ms tipikal. Biaya: termahal (kapasitas standby 24/7). Cocok: fraud real-time, search ranking, rekomendasi saat browsing.",
        "Streaming: data mengalir kontinu, diproses per event/window kecil. Latency: detik. Cocok: deteksi anomali sensor, agregat real-time ('transaksi 1 jam terakhir').",
        "Karakteristik kunci: batch memaksimalkan throughput per rupiah; online meminimalkan latency per request; streaming menyeimbangkan keduanya untuk data yang tak pernah berhenti.",
        "Lab berikut menghitungnya: 5 juta prediksi/hari — berapa biaya online vs batch?",
        "Biaya standby — angka yang menyakitkan. GPU A100 $3/jam × 24 × 30 = $2.160/bulan untuk model yang dipakai 1× sehari (5 menit). Utilisasi: 5/(24×60) = 0,35%! $2.160 untuk utilisasi 0,35% = $617 per 1% utilisasi. Batch untuk kasus ini: 5 menit × $3/jam = $0,25/hari = $7,5/bulan. Rasio: 288×. “Modern” (online) vs “tepat” (batch) = $2.152/bulan selisih. Arsitektur = keputusan ekonomi yang menyamar sebagai keputusan teknik.",
        "Hybrid — pola yang paling umum di produksi. Fraud: online untuk skor REAL-TIME (blokir transaksi mencurigakan dalam 100ms) + batch untuk skor PORTFOLIO (laporan risiko harian). Rekomendasi: online untuk ranking saat browsing + batch untuk precompute kandidat. Satu model, dua pola serving — karena dua KEBUTUHAN berbeda. “Satu pola untuk semua” = mengorbankan satu kebutuhan. Desain serving = petakan kebutuhan → pola, satu per satu.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 200" role="img" aria-label="Biaya serving 5 jt prediksi/hari ($)">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Biaya serving 5 jt prediksi/hari ($)</text>
<line x1="46" y1="166.0" x2="466" y2="166.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="170.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<line x1="46" y1="131.0" x2="466" y2="131.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="135.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">500.0</text>
<line x1="46" y1="96.0" x2="466" y2="96.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="100.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1000.0</text>
<line x1="46" y1="61.0" x2="466" y2="61.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="65.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1500.0</text>
<line x1="46" y1="26.0" x2="466" y2="26.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="30.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2000.0</text>
<rect x="83.8" y="26.0" width="134.4" height="140.0" fill="var(--c4)" rx="3"/>
<text x="151.0" y="20.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2000</text>
<text x="151.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">online</text>
<rect x="293.8" y="159.0" width="134.4" height="7.0" fill="var(--c2)" rx="3"/>
<text x="361.0" y="153.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">100</text>
<text x="361.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">batch</text>
<line x1="46" y1="166" x2="466" y2="166" stroke="var(--chart-grid)" stroke-width="1"/>
</svg>`,
        alt: "Bar chart: biaya online $2.000/hari, batch $100/hari.",
        caption: "Cara membaca: tinggi batang = biaya harian dalam dolar. Interpretasi: untuk workload yang sama (5 juta prediksi/hari), online 20x lebih mahal — selisih $1.900/hari atau ~$57.000/bulan untuk 'kemewahan' yang tidak dibutuhkan workload batch.",
      },
      tasks: [
        { id: "t1", text: "Hitung `online` dan `batch`: biaya harian dalam dolar" },
        { id: "t2", text: "Hitung `rasio` = online / batch" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: tanyakan 'kapan hasilnya dibaca manusia?'",
        body: "Jika jawabannya 'besok pagi di dashboard' → batch. 'Detik ini di aplikasi' → online. 'Terus-menerus dari sensor' → streaming. Pertanyaan satu kalimat ini mencegah 80% kesalahan arsitektur.",
      },
      hints: [
        "biaya = (req_per_hari / 1000) × tarif_per_1k.",
        "rasio = online / batch.",
        "f-string {x:.0f} untuk tanpa desimal.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 3 baris berikut ===
req_per_hari = 5_000_000
tarif_online_per_1k = 0.40   # $ per 1000 request (GPU standby)
tarif_batch_per_1k = 0.02    # $ per 1000 request (job terjadwal)

# TULIS KODEMU
online = 
batch = 
rasio = 

print(f"online=\${online:.0f}/hari  batch=\${batch:.0f}/hari  rasio={rasio:.0f}x")`,
        lockLines: 4,
        solution: `# === SEED TERKUNCI: jangan ubah 3 baris berikut ===
req_per_hari = 5_000_000
tarif_online_per_1k = 0.40   # $ per 1000 request (GPU standby)
tarif_batch_per_1k = 0.02    # $ per 1000 request (job terjadwal)

# TULIS KODEMU
online = req_per_hari / 1000 * tarif_online_per_1k
batch = req_per_hari / 1000 * tarif_batch_per_1k
rasio = online / batch

print(f"online=\${online:.0f}/hari  batch=\${batch:.0f}/hari  rasio={rasio:.0f}x")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`online` = $2000/hari",
            "name": "online",
            "value": 2000.0,
            "tol": 1e-09,
            "msg": "5.000.000/1000 × 0.40 = 2000.",
          },
          {
            "kind": "equal",
            "task": "t1",
            "label": "`batch` = $100/hari",
            "name": "batch",
            "value": 100.0,
            "tol": 1e-09,
            "msg": "5.000.000/1000 × 0.02 = 100.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan rasio",
            "pattern": "rasio=20x",
            "msg": "2000/100 = 20x.",
          },
        ],
      },
      reference: "5_000_000 = 5 juta (underscore hanya pemisah baca).",
    },
    {
      id: "arsitektur",
      eyebrow: "Langkah 4 · Arsitektur serving",
      title: "Dari request ke prediksi: siapa melakukan apa",
      prose: [
        "Arsitektur online tipikal: client → API gateway (auth, rate limit) → model server (memuat model berversion) → feature lookup → prediksi → monitoring/logging. Setiap panah adalah tempat kegagalan — dan tempat dioptimasi.",
        "Dua keputusan penting. Pertama, versioning endpoint: /v1 dan /v2 berjalan paralel saat model baru diuji (canary/shadow). Tanpa ini, rollback = deploy ulang yang panik.",
        "Kedua, kapasitas: Little's Law — jumlah request yang sedang diproses = laju kedatangan × latency. 500 request/detik × 0,08 detik = 40 request concurrent. Dengan target utilisasi 70%, butuh 58 worker. Ini bukan tebakan — ini aritmetika.",
        "Cold start: model besar butuh detik untuk dimuat ke memori. Solusi: keep-warm, model kecil untuk fallback, atau pisahkan loading dari request path.",
        "Titik kegagalan per panah — audit 5 menit. API gateway down → semua request gagal (single point!). Mitigasi: multi-AZ. Model server OOM → 500 error. Mitigasi: memory limit + autoscaling. Feature lookup lambat → p99 jebol. Mitigasi: cache + timeout. Monitoring mati → buta. Mitigasi: monitoring untuk monitoring (dead man’s switch). Setiap panah = 1 baris di runbook. Arsitektur yang tidak bisa digambar = arsitektur yang tidak bisa di-debug.",
      ],
      formula: String.raw`L = \lambda \times W`,
      formulaNote: "L = λ × W (Hukum Little): L = rata-rata request DALAM sistem; λ (lambda) = laju kedatangan (request/detik); W = waktu respons rata-rata (detik). Contoh minicase: λ=0,56, W=0,06 → L=0,03 — sistem hampir selalu idle, 1 worker cukup. Jika λ naik 100× (56/detik): L=3,4 → butuh ≥4 worker. Hukum Little = kalkulator kapasitas 10 detik.",
      tasks: [
        { id: "t1", text: "Hitung `concurrent` = rps × latency (Little's Law)" },
        { id: "t2", text: "Hitung `workers` = ceil(concurrent / util_target)" },
        { id: "t3", text: "Cetak keduanya" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'tambah server = latency turun'",
        type: "pitfall",
        body: "Yang benar: menambah worker menaikkan THROUGHPUT (request/detik), bukan menurunkan LATENCY per request. Latency per request diturunkan dengan model lebih kecil, optimasi, atau caching — bukan dengan menambah mesin.",
      },
      hints: [
        "concurrent = rps * latency.",
        "import math; workers = math.ceil(concurrent / util_target).",
        "ceil = pembulatan ke atas — worker tidak bisa pecahan.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
import math
rps, latency, util_target = 500, 0.08, 0.7

# TULIS KODEMU: Little's Law
concurrent = 
workers = 

print(f"concurrent={concurrent:.0f}  workers={workers}")`,
        lockLines: 3,
        solution: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
import math
rps, latency, util_target = 500, 0.08, 0.7

# TULIS KODEMU: Little's Law
concurrent = rps * latency
workers = math.ceil(concurrent / util_target)

print(f"concurrent={concurrent:.0f}  workers={workers}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`concurrent` = 40",
            "name": "concurrent",
            "value": 40.0,
            "tol": 1e-09,
            "msg": "500 × 0.08 = 40 request sedang diproses.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`workers` = 58",
            "name": "workers",
            "value": 58,
            "tol": 1e-09,
            "msg": "ceil(40 / 0.7) = ceil(57.14) = 58.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan keduanya",
            "pattern": "concurrent=40\\s+workers=58",
            "msg": "Format: concurrent=...  workers=....",
          },
        ],
      },
      reference: "Little's Law: L (concurrent) = λ (laju) × W (latency). math.ceil untuk kapasitas.",
    },
    {
      id: "slo",
      eyebrow: "Langkah 5 · SLO dan operasional",
      title: "Kontrak yang dijaga mesin, bukan janji",
      prose: [
        "SLO (Service Level Objective): '99% request < 200ms dalam 30 hari'. Bukan rata-rata — pakai persentil (p99), karena rata-rata menyembunyikan 1% pengguna yang menderita.",
        "Autoscaling menaikkan worker saat antrean tumbuh — tetapi butuh menit untuk siap, sementara lonjakan butuh detik. Solusi: overprovision baseline + autoscaling untuk tren, bukan untuk spike.",
        "Shadow deployment: model baru menerima traffic salinan (tidak memengaruhi pengguna) — validasi gratis dengan data produksi nyata. Canary: 5% traffic ke model baru, bandingkan metrik, naikkan bertahap.",
        "Circuit breaker: jika model server gagal, fallback ke model sederhana/cache/default — lebih baik prediksi mediocre daripada error 500.",
        "Mengapa p99, bukan rata-rata — contoh. 99 request @ 50ms + 1 request @ 10.000ms. Rata-rata = 149ms (“bagus”!). p99 = 10.000ms (1% pengguna MENDERITA 10 detik). Rata-rata berbohong; persentil jujur. SLO yang benar: “p99 < 500ms” — melindungi 99% pengguna, mengakui 1% ekor. Dan ukur p99 PER ENDPOINT: endpoint lambat yang “tenggelam” di agregat global = bom waktu.",
        "Error budget — SLO yang hidup. SLO 99,9% = budget error 0,1% = 43 menit/bulan downtime. Budget HABIS (banyak insiden) → FREEZE deploy fitur, fokus keandalan. Budget SISA BANYAK → boleh ambil risiko (deploy agresif). Error budget = mengubah SLO dari “angka di slide” menjadi KEBIJAKAN OPERASIONAL. Tanpa error budget: debat “boleh deploy atau tidak?” = opini. Dengan: lihat sisa budget — keputusan 10 detik.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: rencanakan kegagalan, bukan kesempurnaan",
        body: "Setiap komponen serving AKAN gagal suatu hari. Desain yang baik bukan yang tidak pernah gagal, melainkan yang gagal dengan anggun (graceful degradation) dan pulih tanpa drama.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Pola serving untuk 4 skenario",
      prose: [
        "Skenario 1 — Skor kredit saat pengajuan online (user menunggu) → online serving, p99 < 300ms. Alasan: keputusan harus keluar sebelum user menutup aplikasi.",
        "Skenario 2 — Prediksi demand 5 juta SKU untuk perencanaan mingguan → batch harian. Alasan: tidak ada yang menunggu real-time; batch 20x lebih murah.",
        "Skenario 3 — Fraud kartu kredit saat transaksi → online (< 100ms) + fallback rule-based jika timeout. Alasan: transaksi tidak bisa menunggu; tetapi kegagalan harus graceful.",
        "Skenario 4 — Agregat fitur 'transaksi 1 jam terakhir' untuk model fraud → streaming. Alasan: fitur bergantung pada event yang terus mengalir; batch harian terlalu basi.",
        "Aturan praktis 10 detik: (1) Berapa lama user boleh menunggu? (2) Berapa biaya standby vs batch? (3) Apa yang terjadi jika serving mati 5 menit? Jawaban menentukan pola.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Bank Digital Nusa: 12.000 pengajuan/hari",
      prose: [
        "Bank Digital Nusa memproses 12.000 pengajuan kredit per hari (puncak 2.000/jam). Model scoring latency 60ms. SLO: p99 < 500ms end-to-end.",
        "Opsi A — online: 2.000/3600 = 0,56 request/detik rata-rata puncak; concurrent = 0,56 × 0,06 ≈ 0,03 → 1 worker cukup secara teori, tetapi butuh minimal 2 untuk redundansi + autoscaling. Biaya: $900/bulan.",
        "Opsi B — batch per jam: kumpulkan pengajuan, skor sekaligus tiap jam. Biaya: $60/bulan. Tetapi user menunggu hingga 1 jam untuk keputusan — conversion drop terukur 18% pada pengajuan yang menunggu > 10 menit.",
        "Pertanyaan: (a) Hitung concurrent request puncak. (b) Opsi mana yang dipilih? (c) Kapan jawabannya berubah?",
        "Pembahasan: (a) 2000/3600 × 0,06 = 0,033 → praktis 1–2 worker + redundansi. (b) Online: selisih $840/bulan tidak sebanding dengan kehilangan 18% conversion pada 12.000 pengajuan/hari — satu nasabah kredit bernilai jauh lebih dari itu. (c) Jika produknya pengajuan KPR yang memang diproses manual 3 hari → batch cukup; latency bukan faktor conversion.",
        "Opsi B — batch (yang benar untuk kasus ini): 12.000 pengajuan/hari diproses jam 2 pagi dalam 30 menit di 1 mesin $0,50/jam = $0,25/hari = $7,5/bulan. Tidak ada SLO p99 (tidak ada yang menunggu), tidak ada autoscaling, tidak ada on-call malam. Total: $7,5 vs $900/bulan (opsi A online) — 120× lebih murah untuk HASIL YANG SAMA (keputusan dibaca jam 8 pagi). Pertanyaan yang seharusnya ditanya di awal: “apakah ada yang menunggu respons ini?” — satu pertanyaan, $892/bulan.",
        "Kapan opsi A (online) BENAR? Jika pengajuan datang dari aplikasi mobile dan user menunggu keputusan (SLO 500ms). Maka $900/bulan = harga pengalaman pengguna. Keputusan = fungsi dari KEBUTUHAN, bukan dari “yang modern”. Matriks: user menunggu + volume tinggi → online; tidak menunggu → batch; menunggu + volume rendah → online minimal (1–2 worker, bukan autoscaling mewah). Tiga baris, nol over-engineering.",
        "Redundansi — yang dilupakan opsi A. “1 worker cukup” (L=0,03) TETAPI: 1 worker = single point of failure (restart = downtime!). Minimal 2 worker di AZ berbeda — bukan untuk kapasitas, melainkan untuk KEANDALAN. Biaya: 2× $900 = $1.800/bln. Aturan: kapasitas dihitung dengan Hukum Little; JUMLAH MINIMAL ditentukan oleh keandalan (≥2). Jangan tertukar: “cukup” secara matematika ≠ “cukup” secara operasional.",
      ],
      tasks: [
      ],
    },
    {
      id: "fastapi-serving",
      eyebrow: "Langkah 8 · API serving",
      title: "FastAPI: validasi dulu, model belakangan",
      prose: [
        "Endpoint `/predict` yang baik punya anatomi tetap: request masuk → validasi skema → rakit fitur → model memprediksi → respons terstruktur. Urutan ini bukan gaya — validasi adalah GARIS PERTAHANAN PERTAMA model: input kotor ditolak SEBELUM menyentuh model, bukan setelah menghasilkan skor sampah.",
        "Validasi bergaya pydantic memeriksa tiga hal: tipe (usia harus int, bukan string 'tiga puluh'), rentang (usia 17–80, tenor 1–60 bulan), dan field wajib (plafon_jt tidak boleh hilang). Yang gagal mendapat kode 422 — artinya 'request-mu yang salah' — bukan 500 yang artinya 'server-ku yang rusak'. Membedakan keduanya membuat debugging 10x lebih cepat: 422 = perbaiki client, 500 = perbaiki server.",
        "Kontrak kode status yang sehat: 200 sukses; 422 validasi gagal; 404 versi model tidak dikenal (minta /v9/predict padahal yang ada v1/v2); 503 model belum siap (cold start atau sedang reload); 500 bug internal. Client yang baik melakukan retry HANYA untuk 503/500 — me-retry request yang gagal validasi hanya membuang compute.",
        "Dua endpoint wajib selain `/predict`: `/health` (proses hidup — untuk liveness probe) dan `/ready` (model sudah dimuat dan siap — untuk readiness probe). Load balancer hanya mengirim traffic ke pod yang `/ready`-nya hijau. Tanpa `/ready`, deploy baru menerima request saat model masih dimuat → gelombang 503 setiap rilis.",
        "Versioning endpoint (`/v1/predict`, `/v2/predict`) membuat langkah 4 (canary/shadow) menjadi mungkin: dua versi hidup paralel, client lama tidak pecah saat model baru diuji. Versi di URL adalah kontrak publik yang eksplisit — jauh lebih aman daripada deploy diam-diam dan berdoa.",
        "💡 Intuisi: model yang menerima usia='tiga puluh' tidak error — ia memproduksi skor sampah DENGAN PERCAYA DIRI. Bug paling mahal di serving bukan model yang salah, melainkan input salah yang lolos diam-diam. Pydantic/FastAPI memasang pagar ini otomatis; di lab berikut kita tulis manual agar prinsipnya terlihat jelas.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `validasi(data)`: cek field wajib, tipe (tolak bool untuk int), dan rentang sesuai `skema`; raise ValueError bila gagal" },
        { id: "t2", text: "Proses tiap `requests`: validasi DULU, baru panggil `model_skor`; kumpulkan tuple (index, status, detail) ke `hasil`" },
        { id: "t3", text: "Hitung `n_ok` dan `n_ditolak`, lalu cetak ringkasan" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'validasi di frontend sudah cukup'",
        type: "pitfall",
        body: "Yang benar: validasi client hanya untuk UX — ia bisa dilewati dengan satu perintah curl. Request bisa datang dari skrip, client lama, atau penyerang. Model server yang tidak memvalidasi ulang = menerima apa pun dari internet. Validasi server-side adalah garis pertahanan terakhir, bukan duplikasi.",
      },
      hints: [
        "Loop `for field, (tipe, lo, hi) in skema.items()` untuk memeriksa satu per satu.",
        "bool adalah subclass int — tolak eksplisit dengan isinstance(nilai, bool).",
        "Bungkus validasi + pemanggilan model dalam try/except ValueError.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 11 baris berikut ===
model_version = "v2.1"
skema = {"usia": (int, 17, 80), "tenor_bulan": (int, 1, 60), "plafon_jt": (float, 1.0, 500.0)}
requests = [
    {"usia": 34, "tenor_bulan": 36, "plafon_jt": 150.0},
    {"usia": 16, "tenor_bulan": 36, "plafon_jt": 150.0},
    {"usia": 34, "tenor_bulan": 36},
    {"usia": "tiga puluh", "tenor_bulan": 36, "plafon_jt": 150.0},
]
def model_skor(fitur):
    return 0.02 * fitur["usia"] + 0.5 * fitur["tenor_bulan"] + 0.01 * fitur["plafon_jt"]

# TULIS KODEMU: validasi gaya pydantic, lalu layani request
def validasi(data):
    # kembalikan dict bersih, atau raise ValueError

hasil = []`,
        lockLines: 11,
        solution: `# === SEED TERKUNCI: jangan ubah 11 baris berikut ===
model_version = "v2.1"
skema = {"usia": (int, 17, 80), "tenor_bulan": (int, 1, 60), "plafon_jt": (float, 1.0, 500.0)}
requests = [
    {"usia": 34, "tenor_bulan": 36, "plafon_jt": 150.0},
    {"usia": 16, "tenor_bulan": 36, "plafon_jt": 150.0},
    {"usia": 34, "tenor_bulan": 36},
    {"usia": "tiga puluh", "tenor_bulan": 36, "plafon_jt": 150.0},
]
def model_skor(fitur):
    return 0.02 * fitur["usia"] + 0.5 * fitur["tenor_bulan"] + 0.01 * fitur["plafon_jt"]

# TULIS KODEMU: validasi gaya pydantic, lalu layani request
def validasi(data):
    bersih = {}
    for field, (tipe, lo, hi) in skema.items():
        if field not in data:
            raise ValueError(f"field wajib hilang: {field}")
        nilai = data[field]
        if isinstance(nilai, bool) or not isinstance(nilai, tipe):
            raise ValueError(f"{field} harus bertipe {tipe.__name__}")
        if not (lo <= nilai <= hi):
            raise ValueError(f"{field}={nilai} di luar rentang [{lo}, {hi}]")
        bersih[field] = nilai
    return bersih

hasil = []
for i, req in enumerate(requests):
    try:
        skor = model_skor(validasi(req))
        hasil.append((i, "OK", round(skor, 2)))
        print(f"req{i}: OK skor={skor:.2f}")
    except ValueError as e:
        hasil.append((i, "DITOLAK", str(e)))
        print(f"req{i}: DITOLAK ({e})")

n_ok = sum(1 for r in hasil if r[1] == "OK")
n_ditolak = len(hasil) - n_ok
print(f"ok={n_ok}  ditolak={n_ditolak}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t3",
            "label": "`n_ok` = 1 (hanya request valid lolos)",
            "name": "n_ok",
            "value": 1,
            "tol": 1e-09,
            "msg": "Hanya req0 yang lolos semua cek: req1 usia di bawah rentang, req2 kehilangan field, req3 tipe salah.",
          },
          {
            "kind": "equal",
            "task": "t3",
            "label": "`n_ditolak` = 3",
            "name": "n_ditolak",
            "value": 3,
            "tol": 1e-09,
            "msg": "4 request − 1 lolos = 3 ditolak.",
          },
          {
            "kind": "stdout_matches",
            "task": "t2",
            "label": "req0 lolos dengan skor 20.18",
            "pattern": "req0: OK skor=20\\.18",
            "msg": "0.02×34 + 0.5×36 + 0.01×150 = 20.18.",
          },
          {
            "kind": "stdout_matches",
            "task": "t2",
            "label": "req1 ditolak karena rentang usia",
            "pattern": "req1: DITOLAK",
            "msg": "usia=16 di bawah batas 17 → ValueError.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "Ringkasan ok/ditolak tercetak",
            "pattern": "ok=1\\s+ditolak=3",
            "msg": "Format: ok=...  ditolak=....",
          },
        ],
      },
      reference: "422 = salah di client (perbaiki request, jangan retry); 500 = salah di server; 503 = coba lagi nanti.",
    },
    {
      id: "onnx-vs-pickle",
      eyebrow: "Langkah 9 · Format model",
      title: "ONNX vs pickle: jangan unpickle barang orang",
      prose: [
        "Model yang sudah dilatih harus disimpan sebagai FILE sebelum di-serve — dan format file menentukan keamanan sekaligus portabilitas. Dua format paling populer: pickle (dunia Python) dan ONNX (format terbuka).",
        "pickle menyimpan objek Python ARBITRER: file .pkl berisi instruksi yang DIJALANKAN saat `pickle.load()` dipanggil. File pickle jahat = eksekusi kode jarak jauh dalam satu baris load. Kerapuhan kedua: model yang dipickle dengan versi library A bisa gagal dimuat di versi B, dan class kustom harus tersedia di path import yang sama. `joblib` — standar scikit-learn — dibangun di atas pickle, jadi risikonya IDENTIK.",
        "ONNX (Open Neural Network Exchange) menyimpan model sebagai graph operator matematika standar, bukan objek Python. Runtime mana pun (ONNX Runtime, TensorRT) bisa memuatnya tanpa mengeksekusi kode arbitrer — dan lintas bahasa pemrograman. Trade-off-nya: tidak semua operator didukung semua framework, dan konversi kadang menggeser hasil — maka WAJIB verifikasi paritas: bandingkan output ONNX vs model asli pada ribuan sampel sebelum go-live.",
        "Aturan produksi: JANGAN PERNAH unpickle file dari luar tim — perlakukan seperti menjalankan .exe dari email asing. Model dari vendor atau publik = ONNX atau format bobot aman (mis. safetensors), bukan pickle. Di dalam tim sendiri dengan versi library terkunci, pickle masih praktis untuk eksperimen cepat.",
        "💡 Intuisi: pickle berkata 'percaya padaku, jalankan ini'; ONNX berkata 'ini daftar instruksi matematika — cek sendiri'. Di produksi, kepercayaan adalah liabilitas: format yang tidak mengeksekusi kode menghapus satu KELAS serangan sekaligus, bukan satu bug.",
        "Apapun formatnya, simpan versi + hash file di model registry. File model tanpa identitas = tidak bisa di-rollback dengan percaya diri saat insiden.",
      ],
      tasks: [
        { id: "t1", text: "Serialisasi `model` ke JSON (sort_keys, encode utf-8) sebagai `data_json` dan ke pickle (protocol=4) sebagai `data_pkl`" },
        { id: "t2", text: "Muat ulang keduanya; hitung `pred_json` dan `pred_pkl` untuk `sampel` memakai fungsi `prediksi`" },
        { id: "t3", text: "Bandingkan ukuran (`lebih_besar`) dan keterbacaan (`teks_json`); cetak ringkasan" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'pickle dari sumber terkenal pasti aman'",
        type: "pitfall",
        body: "Yang benar: pickle MENGEKSEKUSI kode saat load — titik. Reputasi sumber tidak mengubah mekanikanya; serangan supply-chain justru menargetkan sumber 'terkenal'. Model dari luar tim = ONNX atau format aman lain, bukan pickle.",
      },
      hints: [
        "json.dumps(..., sort_keys=True).encode('utf-8') agar deterministik.",
        "pickle.dumps(model, protocol=4) untuk format stabil.",
        "Keterbacaan: cek apakah string 'intercept' ada di teks JSON.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 4 baris berikut ===
import json, pickle
model = {"intercept": 1.5, "koefisien": [0.4, -0.2, 0.7]}
sampel = [1.0, 2.0, 3.0]

# TULIS KODEMU
def prediksi(m, x):
    return `,
        lockLines: 4,
        solution: `# === SEED TERKUNCI: jangan ubah 4 baris berikut ===
import json, pickle
model = {"intercept": 1.5, "koefisien": [0.4, -0.2, 0.7]}
sampel = [1.0, 2.0, 3.0]

# TULIS KODEMU
def prediksi(m, x):
    return m["intercept"] + sum(c * v for c, v in zip(m["koefisien"], x))

data_json = json.dumps(model, sort_keys=True).encode("utf-8")
data_pkl = pickle.dumps(model, protocol=4)

teks_json = data_json.decode("utf-8")
model_dari_json = json.loads(teks_json)
model_dari_pkl = pickle.loads(data_pkl)

pred_json = prediksi(model_dari_json, sampel)
pred_pkl = prediksi(model_dari_pkl, sampel)
lebih_besar = len(data_pkl) > len(data_json)

print(f"json={len(data_json)} byte  pickle={len(data_pkl)} byte")
print(f"prediksi_json={pred_json:.2f}  prediksi_pickle={pred_pkl:.2f}")
print(f"json_terbaca_manusia={'intercept' in teks_json}  pickle_lebih_besar={lebih_besar}")`,
        checks: [
          {
            "kind": "contains",
            "task": "t3",
            "label": "JSON terbaca manusia (ada kata 'intercept')",
            "name": "teks_json",
            "value": "intercept",
            "msg": "decode data_json ke str, lalu cek keanggotaan substring.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`pred_json` = 3.6",
            "name": "pred_json",
            "value": 3.6,
            "tol": 1e-09,
            "msg": "1.5 + 0.4×1 − 0.2×2 + 0.7×3 = 3.6.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`pred_pkl` = 3.6 (paritas format)",
            "name": "pred_pkl",
            "value": 3.6,
            "tol": 1e-09,
            "msg": "Format berbeda, prediksi harus identik — ini inti verifikasi paritas.",
          },
          {
            "kind": "equal",
            "task": "t3",
            "label": "pickle lebih besar dari JSON",
            "name": "lebih_besar",
            "value": true,
            "msg": "Bandingkan len(data_pkl) > len(data_json).",
          },
          {
            "kind": "stdout_matches",
            "task": "t2",
            "label": "Kedua prediksi tercetak",
            "pattern": "prediksi_json=3\\.60",
            "msg": "Format: prediksi_json=....",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "Ukuran kedua format tercetak",
            "pattern": "json=\\d+ byte",
            "msg": "Format: json=... byte  pickle=... byte.",
          },
        ],
      },
      reference: "protocol=4: format pickle stabil dan portabel antar Python 3.4+.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah.",
        "Refleksi serving: tiga pertanyaan sebelum memilih. (1) “Ada yang menunggu?” — tidak → batch. (2) “Berapa p99 yang dijanjikan?” — tulis angkanya, bagi ke komponen (Hukum Little!). (3) “Apa yang terjadi saat komponen X mati?” — jawab per panah. Tiga jawaban tertulis = arsitektur. Dan satu prinsip: mulai dari yang TERMURAH (batch) — naik ke online hanya jika kebutuhan MEMAKSA. Kesederhanaan = keandalan = uang.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Model dipakai sekali sehari jam 2 pagi untuk 5 juta SKU. Pola serving terbaik?",
          options: [
            {
              text: "API online 24/7",
              why: "20x lebih mahal untuk pekerjaan yang tidak butuh real-time.",
            },
            {
              text: "Batch job terjadwal",
              why: "Tepat: tidak ada yang menunggu real-time; batch termurah dan paling sederhana.",
              correct: true,
            },
            {
              text: "Streaming",
              why: "Streaming untuk data kontinu, bukan job harian terjadwal.",
            },
            {
              text: "Manual via notebook",
              why: "Tidak reproducible dan tidak terpantau — pelajaran MLE1.",
            },
          ],
        },
        {
          q: "500 rps, latency 0,08s, target utilisasi 70%. Berapa worker?",
          options: [
            {
              text: "40",
              why: "Itu concurrent request (500×0,08), belum dibagi utilisasi target.",
            },
            {
              text: "58",
              why: "Tepat: ceil(40/0,7) = 58.",
              correct: true,
            },
            {
              text: "28",
              why: "Itu 40×0,7 — terbalik; utilisasi target di bawah 100% butuh LEBIH banyak worker.",
            },
            {
              text: "500",
              why: "Satu worker melayani banyak request concurrent; bukan 1:1 dengan rps.",
            },
          ],
        },
        {
          q: "Latency p99 naik tapi rata-rata tetap. Artinya?",
          options: [
            {
              text: "Tidak ada masalah",
              why: "p99 naik = 1% pengguna mengalami keburukan yang makin parah.",
            },
            {
              text: "Ekor distribusi memburuk — investigasi",
              why: "Tepat: rata-rata menyembunyikan penderitaan 1% pengguna; p99 adalah metrik SLO yang benar.",
              correct: true,
            },
            {
              text: "Tambah worker segera",
              why: "Belum tentu kapasitas; bisa jadi satu query lambat atau GC pause.",
            },
            {
              text: "Rata-rata lebih penting",
              why: "Untuk SLO, persentil (p99) lebih jujur daripada rata-rata.",
            },
          ],
        },
        {
          q: "Fungsi utama shadow deployment?",
          options: [
            {
              text: "Mengurangi biaya",
              why: "Shadow justru menambah compute (traffic ganda).",
            },
            {
              text: "Menguji model baru dengan traffic produksi nyata tanpa memengaruhi pengguna",
              why: "Tepat: validasi gratis terhadap data dunia nyata sebelum go-live.",
              correct: true,
            },
            {
              text: "Mempercepat inference",
              why: "Tidak berhubungan dengan kecepatan.",
            },
            {
              text: "Menggantikan unit test",
              why: "Shadow adalah validasi tambahan, bukan pengganti test.",
            },
          ],
        },
        {
          q: "Model server mati 5 menit. Respons terbaik?",
          options: [
            {
              text: "Biarkan error 500 sampai diperbaiki",
              why: "Pengguna kabur; tidak ada graceful degradation.",
            },
            {
              text: "Circuit breaker: fallback ke model sederhana/cache/default",
              why: "Tepat: prediksi mediocre sementara > tidak ada prediksi sama sekali.",
              correct: true,
            },
            {
              text: "Restart manual tiap kali",
              why: "Tidak scalable dan lambat; butuh otomatisasi.",
            },
            {
              text: "Sembunyikan error dari monitoring",
              why: "Menyembunyikan masalah = bom waktu yang lebih besar.",
            },
          ],
        },
      ],
      summary: [
        "Pola serving dipilih dari kebutuhan latency, bukan tren teknologi.",
        "Batch: termurah, latency jam; online: termahal, latency ms; streaming: untuk data kontinu.",
        "Workload batch yang di-serve online = membayar 20x untuk manfaat nol.",
        "Little's Law: concurrent = laju × latency → dasar perhitungan kapasitas.",
        "Tambah worker = tambah throughput, BUKAN turunkan latency.",
        "Shadow/canary untuk rilis aman; circuit breaker untuk gagal yang anggun.",
      ],
      next: { label: "MLE6 — Monitoring: Drift & Performance Decay", href: "/v2/learn/mle6-monitoring" },
    },
  ],
};

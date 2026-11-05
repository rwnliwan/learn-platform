import type { V2Lesson } from "../lib/types";

// Topic -> partisi -> consumer group.
const KAFKA_SVG = `<svg viewBox="0 0 600 220" role="img" aria-label="Topik order dibagi dua partisi; consumer group membaca paralel dengan offset masing-masing.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="20" y="85" width="110" height="52" rx="10" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="75" y="108" font-size="12" font-weight="600" fill="var(--text)">producer</text>
<text x="75" y="126" font-size="10" fill="var(--text-muted)">kirim per key</text>
<rect x="180" y="30" width="200" height="70" rx="10" fill="var(--c2)" opacity="0.22" stroke="var(--c2)" stroke-width="2"/>
<text x="280" y="52" font-size="12" font-weight="600" fill="var(--text)">partisi 0</text>
<text x="280" y="70" font-size="10" fill="var(--text-muted)">offset: 0 1 2 3...</text>
<text x="280" y="86" font-size="10" fill="var(--text-muted)">urutan terjaga per partisi</text>
<rect x="180" y="120" width="200" height="70" rx="10" fill="var(--c3)" opacity="0.22" stroke="var(--c3)" stroke-width="2"/>
<text x="280" y="142" font-size="12" font-weight="600" fill="var(--text)">partisi 1</text>
<text x="280" y="160" font-size="10" fill="var(--text-muted)">offset: 0 1 2 3...</text>
<text x="280" y="176" font-size="10" fill="var(--text-muted)">key sama → partisi sama</text>
<rect x="440" y="55" width="140" height="110" rx="10" fill="none" stroke="var(--chart-grid)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="510" y="80" font-size="12" font-weight="600" fill="var(--text)">consumer group</text>
<text x="510" y="100" font-size="10" fill="var(--text-muted)">C1: partisi 0</text>
<text x="510" y="116" font-size="10" fill="var(--text-muted)">C2: partisi 1</text>
<text x="510" y="136" font-size="10" fill="var(--text-muted)">offset dicommit</text>
<text x="510" y="152" font-size="10" fill="var(--text-muted)">per partisi</text>
</g>
<defs><marker id="de9a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g stroke="var(--chart-text)" stroke-width="1.6" marker-end="url(#de9a)">
<line x1="130" y1="100" x2="176" y2="65"/><line x1="130" y1="115" x2="176" y2="155"/>
<line x1="380" y1="65" x2="436" y2="95"/><line x1="380" y1="155" x2="436" y2="125"/>
</g>
<text x="300" y="210" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">paralelisme = jumlah partisi · urutan hanya dijamin DALAM satu partisi</text>
</svg>`;

export const de9: V2Lesson = {
  slug: "de9-streaming",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE9 — Streaming: Konsep Kafka",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Promo 11.11 dan kartu yang ke-charge dua kali",
      prose: [
        "Promo 11.11 'TokoKita': 50.000 order per detik. Sistem streaming baru mereka memproses pembayaran... lalu crash di tengah malam. Saat restart, 3.000 order terakhir dikirim ulang — dan 3.000 kartu pelanggan ke-charge dua kali.",
        "Tim menyalahkan 'Kafka yang tidak exactly-once'. Padahal Kafka mengirim ulang karena offset belum di-commit — itu kontraknya (at-least-once). Yang salah adalah consumer mereka: tidak idempoten, sehingga pesan yang sama dieksekusi dua kali.",
        "Twist-nya: exactly-once hampir tidak pernah datang dari infrastrukturnya saja. Ia dibangun di consumer: kunci idempoten + commit offset yang disiplin. Lesson ini membongkar cara kerja streaming agar kamu tidak menagih janji yang tidak pernah dibuat.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'pakai Kafka = exactly-once otomatis'",
        type: "pitfall",
        body: "Kafka menjamin at-least-once secara default (tidak ada pesan hilang, tapi bisa dobel). Exactly-once butuh transaksi + consumer idempoten — dan bahkan itu pun 'exactly-once effect', bukan sihir. Menyalahkan broker atas duplikat adalah salah alamat.",
      },
      reference: "At-least-once = dobel mungkin. Exactly-once effect = dibangun di consumer.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan konsep streaming/Kafka tanpa mitos.",
        "(1) Menjelaskan topic, partisi, offset, dan consumer group dengan tepat;",
        "(2) Membedakan at-most-once, at-least-once, dan exactly-once dari sisi jaminan dan harga;",
        "(3) Mensimulasikan Kafka mini dan menunjukkan efek exactly-once;",
        "(4) Menjawab 'butuh streaming?' dengan jujur — kapan batch sebenarnya cukup.",
      ],
      tasks: [],
    },

    {
      id: "anatomi-kafka",
      eyebrow: "Langkah 3 · Anatomi",
      title: "Topic, partisi, offset: tiga kata kunci",
      prose: [
        "Topic adalah 'nama saluran' (mis. order). Partisi adalah 'jalur' di dalam saluran — topic order dengan 2 partisi = 2 antrean paralel. Key menentukan partisi: order-7 selalu ke partisi yang sama, sehingga urutan event satu order terjaga.",
        "Offset adalah 'nomor antrean' per partisi: 0, 1, 2, ... Consumer group membaca paralel — tiap consumer memegang subset partisi dan me-commit offset ('saya sudah sampai sini'). Crash sebelum commit = redelivery saat restart.",
        "💡 Intuisi: paralelisme maksimal consumer group = jumlah partisi. 10 partisi + 3 consumer = tiap consumer ~3-4 partisi; 10 partisi + 20 consumer = 10 menganggur. Mau lebih cepat? Tambah partisi dulu, bukan consumer.",
        "💡 Intuisi: urutan hanya dijamin DALAM satu partisi, tidak antar partisi. Butuh urutan global? Satu partisi — tapi kehilangan paralelisme. Ini tradeoff abadi streaming.",
        "Cara membaca: kotak 'topik order' dibagi dua partisi (P0, P1). Key menentukan partisi (urutan per key terjaga). Consumer group dengan 2 consumer membaca paralel, masing-masing punya offset (posisi baca) sendiri.",
        "Interpretasi: partisi = unit paralelisme DAN unit urutan. 2 partisi = maksimal 2 consumer aktif. Offset per consumer = 'pembatas baca' yang memungkinkan replay. Tiga konsep ini = 80% pemahaman Kafka.",
      ],
      figure: {
        svg: KAFKA_SVG,
        alt: "Producer menulis ke dua partisi; consumer group membaca paralel dengan offset per partisi.",
        caption: "Key → partisi (urutan per key). Offset → posisi baca. Group → paralelisme.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: tambah consumer selalu mempercepat",
        type: "pitfall",
        body: "Consumer menganggur jika melebihi jumlah partisi — partisi tidak bisa dibagi ke dua consumer dalam satu group. Bottleneck-nya di desain topik, bukan jumlah worker.",
      },
      reference: "Topic = saluran. Partisi = paralelisme + urutan per key. Offset = posisi.",
    },
    {
      id: "semantik",
      eyebrow: "Langkah 4 · Semantik",
      title: "At-most, at-least, exactly: pilih racunmu",
      prose: [
        "At-most-once: commit offset DULU, proses kemudian. Crash di tengah = pesan hilang. Cepat, tapi data boleh hilang — cocok untuk metrik yang hilang satu-dua tidak masalah.",
        "At-least-once: proses DULU, commit kemudian. Crash di tengah = redelivery = duplikat. Tidak ada yang hilang, tapi efek bisa dobel — cocok jika consumer idempoten (aman diproses ulang).",
        "Exactly-once (effect): at-least-once + consumer idempoten (kunci unik: 'order-7 sudah diproses? lewati'). Pesan boleh tiba dua kali, efeknya sekali. Inilah standar untuk uang.",
      ],
      formula: String.raw`P_{duplikat} = 1 - (1 - p_{crash})^{N}`,
      formulaNote: "P_duplikat = peluang minimal satu redelivery; p_crash = peluang crash per batch; N = jumlah batch. Makin besar N, makin pasti redelivery terjadi — desainlah seolah ia PASTI terjadi.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Commit offset otomatis (auto-commit) dengan interval — terlihat praktis, tapi commit bisa terjadi SEBELUM proses selesai. Crash di antaranya = pesan hilang diam-diam. Untuk data penting: commit manual setelah efek berhasil ditulis.",
      },
      reference: "Uang → exactly-once effect (idempoten). Metrik → at-most boleh. Default aman → at-least.",
    },
    {
      id: "lab-kafka",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: Kafka mini + exactly-once effect",
      prose: [
        "Lab ini mensimulasikan semuanya: producer menulis 10 order ke 2 partisi (key → partisi via hash), consumer crash menyebabkan 3 redelivery, lalu dua mode consumer dibandingkan.",
        "Cara membaca: tanpa idempoten, 13 delivery = 13 efek DB (3 double-charge!). Dengan kunci idempoten, 13 delivery = 10 efek (tepat sekali per order).",
        "Interpretasi: broker-nya sama persis di kedua mode — bedanya hanya di consumer. Exactly-once adalah sifat aplikasi, bukan sifat infrastruktur.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `partisi()`: hash key → nomor partisi" },
        { id: "t2", text: "Lengkapi `Consumer.proses()`: lewati key yang sudah ada jika idempoten" },
        { id: "t3", text: "Jalankan kedua mode, cetak delivery & efek_db" },
      ],
      expected: "idempoten=False: delivery=13 efek_db=13 (3 dobel!) | idempoten=True: delivery=13 efek_db=10",
      note: {
        title: "Sering salah",
        body: "Menyimpan 'sudah diproses' di memori lalu restart consumer — set-nya hilang, duplikat lolos lagi. Di produksi, kunci idempoten disimpan di storage persisten (DB dengan unique constraint), bukan di RAM.",
      },
      hints: [
        "partisi: int(md5(key.encode()).hexdigest(), 16) % N_PARTISI.",
        "Di proses(): if self.idempoten and m['key'] in self.sudah: continue.",
        "efek += 1 hanya untuk pesan yang benar-benar diproses.",
      ],
      code: {
        starter: `import hashlib\nN_PARTISI = 2\npesan = [{"key": f"order-{i}", "nilai": 100_000 + i*10_000} for i in range(10)]\n\n# TULIS KODEMU: key -> partisi\ndef partisi(key):\n    return \n\n# Producer: tulis ke partisi + beri offset\ntopik = {0: [], 1: []}\nfor m in pesan:\n    p = partisi(m["key"])\n    topik[p].append({"offset": len(topik[p]), **m})\nprint(f"partisi_0={len(topik[0])} pesan partisi_1={len(topik[1])} pesan")\n\nclass Consumer:\n    def __init__(self, idempoten):\n        self.idempoten = idempoten\n        self.sudah, self.efek, self.delivery = set(), 0, 0\n    # TULIS KODEMU: proses batch\n    def proses(self, batch):\n        for p, msgs in batch.items():\n            for m in msgs:\n                self.delivery += 1\n                \n                self.sudah.add(m["key"])\n                self.efek += 1  # tulis DB / charge kartu\n\n# Crash: 10 pesan + 3 redelivery (offset belum commit)\nsemua = [m for p in (0, 1) for m in topik[p]]\nkirim = semua + semua[7:10]\nfor mode in [False, True]:\n    c = Consumer(idempoten=mode)\n    c.proses({0: [m for m in kirim if partisi(m["key"]) == 0],\n              1: [m for m in kirim if partisi(m["key"]) == 1]})\n    print(f"idempoten={mode}: delivery={c.delivery} efek_db={c.efek}")`,
        lockLines: 6,
        solution: `import hashlib\nN_PARTISI = 2\npesan = [{"key": f"order-{i}", "nilai": 100_000 + i*10_000} for i in range(10)]\n\n# TULIS KODEMU: key -> partisi\ndef partisi(key):\n    return int(hashlib.md5(key.encode()).hexdigest(), 16) % N_PARTISI\n\n# Producer: tulis ke partisi + beri offset\ntopik = {0: [], 1: []}\nfor m in pesan:\n    p = partisi(m["key"])\n    topik[p].append({"offset": len(topik[p]), **m})\nprint(f"partisi_0={len(topik[0])} pesan partisi_1={len(topik[1])} pesan")\n\nclass Consumer:\n    def __init__(self, idempoten):\n        self.idempoten = idempoten\n        self.sudah, self.efek, self.delivery = set(), 0, 0\n    # TULIS KODEMU: proses batch\n    def proses(self, batch):\n        for p, msgs in batch.items():\n            for m in msgs:\n                self.delivery += 1\n                if self.idempoten and m["key"] in self.sudah:\n                    continue\n                self.sudah.add(m["key"])\n                self.efek += 1  # tulis DB / charge kartu\n\n# Crash: 10 pesan + 3 redelivery (offset belum commit)\nsemua = [m for p in (0, 1) for m in topik[p]]\nkirim = semua + semua[7:10]\nfor mode in [False, True]:\n    c = Consumer(idempoten=mode)\n    c.proses({0: [m for m in kirim if partisi(m["key"]) == 0],\n              1: [m for m in kirim if partisi(m["key"]) == 1]})\n    print(f"idempoten={mode}: delivery={c.delivery} efek_db={c.efek}")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "idempoten=False: delivery=13 efek_db=13", label: "tanpa idempoten: 13 efek", msg: "3 redelivery = 3 double-charge." },
          { kind: "stdout_matches", task: "t3", pattern: "idempoten=True: delivery=13 efek_db=10", label: "idempoten: 10 efek", msg: "Exactly-once effect: tiap order tepat sekali." },
          { kind: "uses", task: "t1", token: "md5", label: "memakai hash `md5`", msg: "Hash key untuk penempatan partisi yang stabil." },
        ],
      },
      reference: "Key → partisi. Offset → posisi. Idempoten → exactly-once effect.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 'Pakai Kafka = exactly-once otomatis' adalah mitos paling mahal di streaming. Exactly-once butuh idempotent consumer + transactional producer + broker yang mendukung — tiga syarat, bukan satu brand.",
        "💡 Partisi menentukan paralelisme MAKSIMAL consumer group. 2 partisi = maksimal 2 consumer aktif; consumer ke-3 menganggur. Sizing partisi = sizing throughput.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: partisi adalah satuan paralelisme — ukur dua kali, tambah sekali",
        body: "Di streaming, satu angka mengendalikan segalanya: jumlah partisi. Ia adalah batas atas paralelisme consumer group — 2 partisi berarti maksimal 2 consumer aktif, consumer ketiga hanya menganggur menonton. Heuristik sizing-nya: partisi sama dengan throughput puncak dibagi throughput per partisi, dibulatkan ke atas, lalu beri headroom 2 kali lipat untuk lonjakan — tetapi jangan berlebihan, karena tiap partisi menambah beban rebalancing dan latency failover. Jebakan yang paling menyakitkan: menambah partisi di tengah jalan pada topik ber-key — hash key ke partisi berubah, urutan per key pecah, dan consumer yang mengandalkan ordering diam-diam menghasilkan angka salah. Putuskan jumlah partisi di awal seolah permanen. Lalu soal exactly-once: anggap ia kontrak tiga pihak — producer transaksional, broker yang mendukung, consumer idempoten — bukan fitur yang otomatis menyala karena memakai brand tertentu. Praktik yang jujur di lapangan: at-least-once plus consumer idempoten (dedupe by key) sudah mencapai efek exactly-once untuk mayoritas kasus bisnis, dengan kompleksitas jauh lebih rendah. Dan satu heuristik operasional: consumer lag adalah SLA-mu yang sebenarnya — dashboard boleh hijau, tetapi bila lag 2 jam, bisnismu 2 jam buta.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: butuh streaming?",
      prose: [
        "Skenario 1 — Alert fraud detik-an. Kondisi: tiap detik telat = uang hilang. Keputusan: streaming (Kafka + consumer idempoten). Alasan: DE2 — di sini latency = uang.",
        "Skenario 2 — Dashboard operasional menit-an. Kondisi: keputusan tiap 10 menit. Keputusan: micro-batch. Alasan: 25x lebih murah, lag 2,5 menit cukup.",
        "Skenario 3 — Event sourcing / audit trail. Kondisi: butuh replay histori kapan saja. Keputusan: streaming + retensi panjang (log abadi). Alasan: topik sebagai sumber kebenaran yang bisa dibaca ulang.",
        "Skenario 4 — Integrasi antar tim (decouple). Kondisi: 5 tim butuh event yang sama. Keputusan: streaming sebagai bus (publish-subscribe). Alasan: produsen tidak perlu tahu konsumennya — tambah tim tanpa ubah produsen.",
        "Aturan praktis 10 detik: streaming untuk kecepatan, replay, atau decoupling. Selain itu, batch lebih murah dan sederhana.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai Kafka sebagai 'database' (query langsung ke topik). Kafka adalah log, bukan DB: tidak ada query ad-hoc, tidak ada update. Butuh query? Sink ke warehouse/DB dulu.",
      },
      reference: "Kafka = log terdistribusi. Tiga alasan pakai: cepat, replay, decouple.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: sizing topik 11.11",
      prose: [
        "Rancang topik order untuk puncak 50.000 msg/detik. Satu partisi ~5.000 msg/detik. Tiap pesan 1 KB, retensi 7 hari. Consumer hanya mampu 40.000 msg/detik.",
        "Hitung: partisi dibutuhkan, ukuran retensi (TB), dan lag yang menumpuk dalam 1 jam jika consumer kalah cepat.",
        "Interpretasi: 36 juta pesan tertinggal per jam = consumer lag adalah metrik yang wajib di-alert (DE1: Observe). Partisi 10 berarti butuh 10 consumer untuk mengejar.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_partisi` = ceil(target / per_partisi)" },
        { id: "t2", text: "Hitung `retensi_TB` dan `lag_1jam_juta`, cetak semua" },
      ],
      expected: "partisi_dibutuhkan=10 | retensi_TB=30.2 | lag_1jam_juta=36",
      hints: [
        "import math; n_partisi = math.ceil(50_000 / 5_000).",
        "retensi byte = 50.000 × 1000 × 86400 × 7; /1e12 = TB.",
        "lag/jam = (50.000 − 40.000) × 3600; /1e6 = juta.",
      ],
      code: {
        starter: `import math\n\ntarget, per_partisi = 50_000, 5_000  # msg/detik\nbyte_per_msg = 1000\nconsumer_mampu = 40_000\n\n# TULIS KODEMU\nn_partisi = \nretensi_TB = \nlag_1jam_juta = \n\nprint(f"partisi_dibutuhkan={n_partisi}")\nprint(f"retensi_TB={retensi_TB:.1f}")\nprint(f"lag_1jam_juta={lag_1jam_juta:.0f}")`,
        lockLines: 5,
        solution: `import math\n\ntarget, per_partisi = 50_000, 5_000  # msg/detik\nbyte_per_msg = 1000\nconsumer_mampu = 40_000\n\n# TULIS KODEMU\nn_partisi = math.ceil(target / per_partisi)\nretensi_TB = target * byte_per_msg * 86400 * 7 / 1e12\nlag_1jam_juta = (target - consumer_mampu) * 3600 / 1e6\n\nprint(f"partisi_dibutuhkan={n_partisi}")\nprint(f"retensi_TB={retensi_TB:.1f}")\nprint(f"lag_1jam_juta={lag_1jam_juta:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_partisi", value: 10, tol: 0, label: "`n_partisi` = 10", msg: "ceil(50000/5000) = 10." },
          { kind: "stdout_matches", task: "t2", pattern: "retensi_TB=30\\.2", label: "`print` retensi_TB=30.2", msg: "50rb×1KB×86400×7 = 30,24 TB." },
          { kind: "stdout_matches", task: "t2", pattern: "lag_1jam_juta=36", label: "`print` lag_1jam_juta=36", msg: "(50rb−40rb)×3600 = 36jt pesan/jam." },
        ],
      },
      reference: "Sizing: partisi = target/throughput. Lag = (in − out) × waktu.",
    },
    {
      id: "schema-registry",
      eyebrow: "Langkah 9 · Schema registry",
      title: "Schema registry: mengubah kontrak tanpa memutus stream",
      prose: [
        "Promo 11.11 TokoKita, pukul 00:07. Tim pembayaran deploy perubahan kecil: field `voucher_kode` diganti `promo_kode` — 'lebih jelas', kata mereka. Pukul 00:09, consumer tim fraud mulai crash-loop: deserializer mengharapkan `voucher_kode` dan melempar exception untuk setiap pesan. Dua jam data fraud tidak diproses — di malam paling sibuk setahun.",
        "Twist-nya: tidak ada yang 'salah' secara teknis. Producer mengirim data valid menurut versinya; consumer membaca valid menurut versinya. Yang rusak adalah KONTRAK di antara mereka — dan kontrak itu tidak ditulis di mana pun. Di streaming, produsen dan konsumen sering tim yang berbeda, deploy di hari yang berbeda. Tanpa kontrak yang dibaca mesin, setiap deploy producer adalah potensi ledakan di semua consumer-nya.",
        "Schema registry adalah 'notaris' untuk kontrak itu: repositori pusat yang menyimpan versi skema (Avro, Protobuf, atau JSON Schema). Setiap skema punya ID + nomor versi. Producer tidak mengirim skema penuh di tiap pesan — ia menyertakan ID skema di header; consumer mengambil skema dari registry untuk deserialize. Ringan di wire, ketat di kontrak.",
        "Kenapa ini menyelamatkan stream: registry menegakkan schema-on-write. Saat producer mencoba mendaftarkan skema v2 yang tidak kompatibel dengan v1, registry MENOLAK di titik deploy — fail fast di hulu, sebelum satu pesan pun mengalir. Tanpa registry, ketidakcocokan baru ketahuan di hilir: dashboard menampilkan angka aneh 3 minggu kemudian, dan tidak ada yang tahu sejak kapan artinya berubah.",
        "Tiga mode kompatibilitas yang wajib dihafal. BACKWARD: consumer lama bisa membaca data baru — contoh: menambah field optional `diskon` dengan nilai default 0; consumer v1 mengabaikannya, tetap jalan. FORWARD: consumer baru bisa membaca data lama — contoh yang sama dari sisi sebaliknya. FULL: dua-duanya. Rename `voucher_kode` → `promo_kode`? TIDAK kompatibel ke dua arah — registry menolak, dan tim fraud selamat tanpa tahu apa-apa.",
        "Avro vs Protobuf vs JSON Schema: Avro = biner ringkas, skema disimpan terpisah (butuh registry) — standar untuk event Kafka analitik. Protobuf = biner + evolusi field yang rapi — standar antar microservice. JSON Schema = manusiawi dibaca, payload lebih besar — untuk event yang jarang dan butuh dibaca mata. Heuristik: event Kafka 50 ribu/detik → Avro + registry; kontrak antar layanan gRPC → Protobuf.",
        "💡 Intuisi: schema registry adalah 'CI untuk kontrak data'. Test menolak kode yang merusak sebelum merge; registry menolak skema yang merusak sebelum deploy. Keduanya memindahkan kegagalan dari produksi (mahal, memalukan) ke pipeline (murah, privat).",
        "💡 Intuisi: data quality di streaming dimulai di registry, bukan di dashboard. Angka yang lahir dari schema mismatch adalah jenis bug PALING sulit dilacak — ia terlihat valid (ada angkanya, tidak error), hanya saja artinya sudah berubah. Fail fast di registry mencegah kelas bug ini seluruhnya.",
      ],
      tasks: [
        { id: "t1", text: "Tambah field optional `diskon` (default 0) ke skema v2 — mode kompatibilitas apa yang terpenuhi?" },
        { id: "t2", text: "Rename `user_id` → `customer_id` — kompatibel apa? Apa yang dilakukan registry saat dideploy?" },
        { id: "t3", text: "Pilih format: (a) event Kafka 50rb/detik antar tim, (b) kontrak gRPC antar microservice — dan alasannya" },
      ],
      note: {
        title: "🚨 Mitos: 'JSON polos lebih fleksibel, tidak butuh skema'",
        type: "pitfall",
        body: "Fleksibel tanpa kontrak = setiap consumer menebak-nebak arti field. 'Tiba-tiba null' atau 'string jadi angka' adalah bug yang butuh berminggu-minggu untuk ditemukan — karena tidak ada yang error, hanya angkanya yang salah. JSON pun butuh JSON Schema + registry. Dan menyimpan skema 'di repo producer saja' tidak cukup: consumer tim lain tidak membacanya. Registry adalah satu-satunya sumber kebenaran yang dibaca mesin oleh SEMUA pihak.",
      },
      reference: "Registry = notaris skema. Backward = lama baca baru. Forward = baru baca lama.",
    },
    {
      id: "watermark-late-data",
      eyebrow: "Langkah 10 · Watermark & late data",
      title: "Watermark: kapan jendela boleh ditutup",
      prose: [
        "Dashboard 'transaksi per menit' TokoKita menunjukkan 4.120 untuk menit 10:00. Laporan finance untuk menit yang sama: 4.305. Keduanya benar menurut datanya. Bedanya: dashboard menghitung dari waktu TIBA di sistem (processing time); finance dari waktu TRANSAKSI terjadi (event time). Dua 'menit 10:00' yang berbeda — dan tanpa membedakan keduanya, angka-angka itu tidak bisa dibandingkan, apalagi diperdebatkan.",
        "Event time = kapan kejadian benar-benar terjadi (timestamp di payload, mis. kartu di-tap pukul 10:00:23). Processing time = kapan sistem memprosesnya (tiba di consumer pukul 10:02:41 karena antrean). Streaming yang serius memakai event time — transaksi yang telat 5 menit bukan berarti terjadi 5 menit kemudian. Analitik yang memakai processing time diam-diam menggeser seluruh sejarah setiap kali ada lag.",
        "Tiga jenis window. Tumbling: tidak tumpang tindih — [10:00,10:01), [10:01,10:02): 'hitung order per menit'. Sliding: tumpang tindih — window 5 menit yang geser tiap 1 menit: 'rata-rata bergerak 5 menit'. Session: terbentuk dari data — 'satu sesi belanja = event-event yang jaraknya < 30 menit': window-nya ditentukan perilaku, bukan jam dinding.",
        "Watermark menjawab pertanyaan tersulit streaming: 'kapan boleh menutup jendela?' Watermark W berarti 'semua event dengan event time ≤ W sudah terlihat'. Jendela [10:00,10:01) boleh di-fire saat watermark ≥ 10:01. Tanpa watermark, kamu tidak pernah tahu apakah masih ada data menit itu yang sedang dalam perjalanan — jendela tidak pernah berani ditutup, atau ditutup terlalu dini.",
        "Late data = event yang tiba SETELAH jendelanya ditutup (event time < watermark saat tiba). Tiga perlakuan: (1) buang — default, murah, tapi data hilang; (2) side output — kirim ke topik khusus 'terlambat' untuk audit; (3) allowed lateness — terima keterlambatan s.d. N detik dan KOREKSI hasil yang sudah di-fire. Contoh dari lab di bawah: order-F (event time detik ke-30) tiba saat watermark sudah 62 → dibuang. Dengan allowed lateness 45 detik, ia masih diterima dan window [0,60) dikoreksi dari 3 menjadi 4 event.",
        "Di balik window ada STATE: agregat parsial (count, sum) yang disimpan engine per window. State inilah yang membuat stream processing beda dari consumer stateless — dan ia harus di-checkpoint (mis. RocksDB + snapshot ke object storage) supaya restart tidak mengulang hitungan dari nol. Jebakan klasik: session window tanpa batas gap → state tumbuh selamanya → OOM jam 3 pagi. Selalu batasi: gap maksimum + idle timeout.",
        "Dua mesin utama. Apache Flink = true streaming: event diproses satu per satu saat tiba, watermark dan state adalah warga kelas satu — untuk latensi sub-detik dan logika event-time yang rumit (fraud real-time). Spark Structured Streaming = micro-batch: stream dipotong menjadi batch kecil (mis. tiap 1 detik); watermark didukung dengan semantik trigger — untuk tim yang sudah di ekosistem Spark dan SLA beberapa detik masih oke. Heuristik: butuh < 1 detik + watermark kompleks → Flink; sudah punya klaster Spark + SLA detik → Spark Structured Streaming.",
        "💡 Intuisi: watermark adalah 'jam yang jujur' — ia tidak pernah maju melebihi data yang benar-benar terlihat. Terlalu agresif (keterlambatan wajar dikecilkan) = data terlambat dibuang: angka cepat tapi salah. Terlalu konservatif = hasil telat keluar: angka benar tapi basi. Menyetel watermark = menyetel tradeoff akurasi vs ketepatan waktu, dan itu keputusan bisnis, bukan konstanta.",
      ],
      formula: String.raw`W = t_{max} - \Delta`,
      formulaNote: "W = watermark (batas event time yang dianggap lengkap); t_max = event time terbesar yang terlihat sejauh ini; Δ (delta) = keterlambatan wajar yang masih ditoleransi (mis. 10 detik). Jendela [s, e) boleh di-fire saat W ≥ e; event dengan event time < W yang baru tiba = late data.",
      tasks: [
        { id: "t1", text: "Tulis update watermark: `wm = maks_t - LAMBAT_IZIN` (update `maks_t` dulu tiap event)" },
        { id: "t2", text: "Tulis aturan late: event dengan `t < wm` → catat ke `terlambat`, lewati; tentukan window `[s, e)`" },
        { id: "t3", text: "Jalankan: cetak `diterima`/`terlambat` + isi tiap window + status tutup" },
      ],
      expected: "diterima=7 terlambat=2 | window[0,60)=3 tutup=True | window[60,120)=2 tutup=True | window[120,180)=2 tutup=False",
      note: {
        title: "Sering salah: watermark dari jam dinding",
        type: "risk",
        body: "Menurunkan watermark dari processing time (jam sistem) alih-alih event time di data = kembali memakai 'jam dinding' — seluruh tujuan event time hancur. Gejalanya: hasil berubah-ubah setiap re-run dengan data yang sama (tidak reproducible). Watermark yang benar diturunkan dari timestamp DI DALAM event, bukan dari kapan event itu tiba.",
      },
      hints: [
        "Tiap event: if t > maks_t: maks_t = t — lalu wm = maks_t - LAMBAT_IZIN.",
        "Terlambat: if t < wm: terlambat.append(nama); continue.",
        "Window: s = (t // WINDOW) * WINDOW; e = s + WINDOW.",
      ],
      code: {
        starter: `# Simulasi watermark: window tumbling 60 detik, toleransi keterlambatan 10 detik\nWINDOW, LAMBAT_IZIN = 60, 10\nstream = [(5,"order-A"),(58,"order-B"),(61,"C"),(59,"D"),(72,"E"),(30,"F"),(121,"G"),(65,"H"),(135,"I")]\n\nwm, maks_t = -10**9, -10**9\nditerima, terlambat, jendela = [], [], {}\nfor t, nama in stream:\n    # TULIS KODEMU: update maks_t, lalu watermark = max event time - LAMBAT_IZIN\n\n\n    # TULIS KODEMU: terlambat jika t < wm -> catat ke terlambat, lewati event\n\n\n    # TULIS KODEMU: tentukan window [s, e), catat event ke jendela & diterima\n\n\nn_diterima, n_terlambat = len(diterima), len(terlambat)\nprint(f"diterima={n_diterima} terlambat={n_terlambat}")\nfor (s, e), ev in sorted(jendela.items()):\n    print(f"window[{s},{e})={len(ev)} tutup={wm >= e}")`,
        lockLines: 7,
        solution: `# Simulasi watermark: window tumbling 60 detik, toleransi keterlambatan 10 detik\nWINDOW, LAMBAT_IZIN = 60, 10\nstream = [(5,"order-A"),(58,"order-B"),(61,"C"),(59,"D"),(72,"E"),(30,"F"),(121,"G"),(65,"H"),(135,"I")]\n\nwm, maks_t = -10**9, -10**9\nditerima, terlambat, jendela = [], [], {}\nfor t, nama in stream:\n    # TULIS KODEMU: update maks_t, lalu watermark = max event time - LAMBAT_IZIN\n    if t > maks_t:\n        maks_t = t\n    wm = maks_t - LAMBAT_IZIN\n    # TULIS KODEMU: terlambat jika t < wm -> catat ke terlambat, lewati event\n    if t < wm:\n        terlambat.append(nama)\n        continue\n    # TULIS KODEMU: tentukan window [s, e), catat event ke jendela & diterima\n    s = (t // WINDOW) * WINDOW\n    e = s + WINDOW\n    jendela.setdefault((s, e), []).append(nama)\n    diterima.append(nama)\n\nn_diterima, n_terlambat = len(diterima), len(terlambat)\nprint(f"diterima={n_diterima} terlambat={n_terlambat}")\nfor (s, e), ev in sorted(jendela.items()):\n    print(f"window[{s},{e})={len(ev)} tutup={wm >= e}")`,
        checks: [
          { kind: "equal", task: "t2", name: "n_terlambat", value: 2, label: "`n_terlambat` = 2", msg: "order-F (t=30) dan order-H (t=65) tiba saat watermark sudah melewatinya → dibuang sebagai late." },
          { kind: "equal", task: "t2", name: "n_diterima", value: 7, label: "`n_diterima` = 7", msg: "7 event masuk window; 2 terlambat." },
          { kind: "stdout_matches", task: "t3", pattern: "diterima=7 terlambat=2", label: "ringkasan diterima/terlambat tercetak", msg: "Cetak ringkasan dengan format persis." },
          { kind: "stdout_matches", task: "t3", pattern: "window\\[60,120\\)=2 tutup=True", label: "window [60,120) = 2 dan tutup", msg: "Watermark akhir = 125 ≥ 120 → window [60,120) ditutup dengan 2 event (C, E)." },
        ],
      },
      reference: "Event time = kapan terjadi. Watermark = kapan boleh menutup. Late = tiba setelah tutup.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang dunia event.",
      ],
      tasks: [],
      summary: [
        "Kafka default = at-least-once (bisa dobel); exactly-once effect dibangun di consumer idempoten.",
        "Topic = saluran; partisi = paralelisme + urutan per key; offset = posisi baca.",
        "Paralelisme maks = jumlah partisi; urutan hanya dalam satu partisi.",
        "At-most (boleh hilang) vs at-least (bisa dobel) vs exactly-once effect (idempoten).",
        "Streaming untuk: kecepatan = uang, replay, decoupling. Kafka = log, bukan database.",
      ],
      next: { label: "DE10 — Spark: Distributed Processing", href: "/v2/learn/de10-spark" },
      quiz: [
        {
          q: "Kenapa 3.000 kartu ke-charge dua kali saat restart?",
          options: [
            { text: "Kafka corrupt", why: "Kafka bekerja sesuai kontrak: redelivery karena offset belum commit." },
            { text: "Consumer tidak idempoten: pesan yang dikirim ulang dieksekusi ulang", why: "Tepat: at-least-once + consumer naive = efek ganda.", correct: true },
            { text: "Partisinya kurang", why: "Partisi soal paralelisme, bukan duplikasi." },
            { text: "Producer mengirim dua kali", why: "Producer mengirim sekali; redelivery berasal dari sisi consumer." },
          ],
        },
        {
          q: "Topik 8 partisi, consumer group 12 consumer. Berapa yang bekerja?",
          options: [
            { text: "12", why: "Partisi tidak bisa dibagi ke dua consumer dalam satu group — 4 akan menganggur." },
            { text: "8 (4 menganggur)", why: "Tepat: 1 partisi = 1 consumer maks dalam satu group.", correct: true },
            { text: "6", why: "Tidak ada dasarnya." },
            { text: "20", why: "Tidak mungkin melebihi partisi." },
          ],
        },
        {
          q: "Butuh urutan global semua event. Konsekuensinya?",
          options: [
            { text: "Satu partisi — kehilangan paralelisme", why: "Tepat: urutan global = satu antrean = satu penulis cepat.", correct: true },
            { text: "Banyak partisi — otomatis urut", why: "Antar partisi tidak ada jaminan urutan — urutan hanya di dalam satu partisi." },
            { text: "Tambah consumer", why: "Consumer tidak menciptakan urutan." },
            { text: "Pakai batch saja", why: "Batch tidak menyelesaikan kebutuhan urutan event." },
          ],
        },
        {
          q: "Kapan at-most-once bisa diterima?",
          options: [
            { text: "Pembayaran", why: "Kehilangan pembayaran = bencana." },
            { text: "Metrik operasional yang hilang satu-dua tidak masalah", why: "Tepat: tradeoff kecepatan vs kelengkapan yang sadar.", correct: true },
            { text: "Billing pelanggan", why: "Uang → minimal at-least + idempoten." },
            { text: "Audit regulator", why: "Audit butuh kelengkapan penuh." },
          ],
        },
        {
          q: "Apa arti 'consumer lag 36 juta'?",
          options: [
            { text: "36 juta pesan hilang", why: "Lag = tertinggal, bukan hilang." },
            { text: "Consumer tertinggal 36 juta pesan dari producer — butuh alert & scale", why: "Tepat: (in−out)×waktu; sinyal kapasitas kurang.", correct: true },
            { text: "36 juta partisi", why: "Tidak masuk akal." },
            { text: "Throughput 36 juta/detik", why: "Itu kecepatan, bukan ketertinggalan." },
          ],
        },
        {
          q: "Promo 11.11: kartu pelanggan ke-charge dua kali. Sistem pakai Kafka dengan at-least-once. Akar masalahnya?",
          options: [
            { text: "Kafka-nya rusak", why: "Kafka bekerja sesuai jaminan: at-least-once = pesan BISA datang 2x. Yang rusak = asumsi consumer." },
            { text: "Consumer tidak idempoten — retry menghasilkan charge ganda", why: "Tepat: at-least-once + consumer yang tidak idempoten = efek ganda. 'Pakai Kafka = exactly-once otomatis' adalah mitos; exactly-once butuh idempotent consumer (dedupe by key).", correct: true },
            { text: "Partisi kurang banyak", why: "Partisi = paralelisme, bukan jaminan semantik. 100 partisi tidak mencegah double charge." },
            { text: "Harusnya pakai database saja", why: "Database pun butuh idempotensi untuk retry. Masalahnya pola, bukan produk." },
          ],
        },
        {
          q: "Butuh urutan ketat per pelanggan + throughput 50.000 msg/detik. Desain partisi?",
          options: [
            { text: "1 partisi — urutan global terjamin", why: "Urutan global ya, tetapi 1 partisi = 1 consumer = throughput terbatas. 50.000/detik tidak muat." },
            { text: "Banyak partisi dengan key = customer_id", why: "Tepat: key → partisi menjamin urutan PER KEY (per pelanggan), sementara banyak partisi memberi paralelisme. Urutan yang dibutuhkan (per pelanggan) + throughput (paralel) = keduanya terpenuhi.", correct: true },
            { text: "Partisi acak per pesan", why: "Acak = tidak ada urutan sama sekali. Pesan pelanggan bisa datang terbalik." },
            { text: "50.000 partisi (satu per msg/detik)", why: "Partisi berlebihan = overhead broker + rebalance lambat. Partisi = puluhan/ratusan, bukan puluhan ribu." },
          ],
        },
      ],
    },
  ],
};

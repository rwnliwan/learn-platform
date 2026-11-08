import type { V2Lesson } from "../lib/types";

// DAG pipeline: extract -> validate -> features -> train -> evaluate -> register.
// Jalur kritis (c1) vs dependensi biasa.
const DAG_SVG = `<svg viewBox="0 0 480 190" role="img" aria-label="Diagram DAG enam task berurutan dengan jalur kritis disorot.">
<defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 1 L 9 5 L 0 9 z" fill="var(--text-muted)"/></marker></defs>
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<g><rect x="8" y="70" width="66" height="44" rx="8" fill="none" stroke="var(--c1)" stroke-width="2.5"/><text x="41" y="89" fill="var(--text)" font-weight="600">extract</text><text x="41" y="104" fill="var(--text-muted)">4 mnt</text></g>
<g><rect x="94" y="70" width="66" height="44" rx="8" fill="none" stroke="var(--c1)" stroke-width="2.5"/><text x="127" y="89" fill="var(--text)" font-weight="600">validate</text><text x="127" y="104" fill="var(--text-muted)">2 mnt</text></g>
<g><rect x="180" y="70" width="66" height="44" rx="8" fill="none" stroke="var(--c1)" stroke-width="2.5"/><text x="213" y="89" fill="var(--text)" font-weight="600">features</text><text x="213" y="104" fill="var(--text-muted)">6 mnt</text></g>
<g><rect x="266" y="70" width="66" height="44" rx="8" fill="none" stroke="var(--c1)" stroke-width="2.5"/><text x="299" y="89" fill="var(--text)" font-weight="600">train</text><text x="299" y="104" fill="var(--text-muted)">12 mnt</text></g>
<g><rect x="352" y="70" width="66" height="44" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/><text x="385" y="89" fill="var(--text)" font-weight="600">evaluate</text><text x="385" y="104" fill="var(--text-muted)">3 mnt</text></g>
<g><rect x="352" y="8" width="66" height="44" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/><text x="385" y="27" fill="var(--text)" font-weight="600">register</text><text x="385" y="42" fill="var(--text-muted)">1 mnt</text></g>
</g>
<g stroke="var(--c1)" stroke-width="2"><line x1="74" y1="92" x2="92" y2="92" marker-end="url(#arr)"/><line x1="160" y1="92" x2="178" y2="92" marker-end="url(#arr)"/><line x1="246" y1="92" x2="264" y2="92" marker-end="url(#arr)"/></g>
<g stroke="var(--text-muted)" stroke-width="1.5"><line x1="332" y1="92" x2="350" y2="92" marker-end="url(#arr)"/><line x1="385" y1="52" x2="385" y2="68" marker-end="url(#arr)"/></g>
<text x="240" y="150" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)"><tspan font-weight="600" fill="var(--c1)">Jalur kritis: 28 menit</tspan><tspan fill="var(--text-muted)"> (extract→validate→features→train; rantai terpanjang menentukan durasi)</tspan></text>
<text x="240" y="170" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">evaluate &amp; register di luar jalur kritis: gagal di sini tidak menambah waktu tunggu train berikutnya</text>
</svg>`;

const MLOPS2_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Ekspektasi biaya harian task train: tanpa retry Rp1.000 ribu, dengan retry 3x Rp670 ribu."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">500</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1000</text><rect x="85.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c4)"/><text x="150.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp1.000 rb</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Tanpa retry</text><rect x="294.7" y="72.8" width="129.6" height="107.2" rx="3" fill="var(--c1)"/><text x="359.5" y="66.8" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp670 rb</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Retry 3x</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">ribu rupiah / hari</text></svg>`;

export const mlops2: V2Lesson = {
  slug: "mlops2-pipeline",
  track: "MLOps",
  module: "Fondasi Operasi",
  title: "MLOps2 — Pipeline & Orchestration",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Senin tanpa Dimas",
      prose: [
        "Setiap Senin pukul 07.00, Dimas — analis senior — menjalankan notebook scoring debitur untuk laporan direksi pukul 09.00. Sudah dua tahun ritual ini berjalan mulus. Notebook-nya rapi, kodenya benar, angkanya selalu cocok.",
        "Suatu Senin, Dimas sakit. Tidak ada yang tahu notebook itu ada, apalagi cara menjalankannya. Pukul 09.00, direksi menerima laporan — yang ternyata memakai data minggu lalu, karena staf lain sekadar meng-copy file lama agar 'laporan tetap keluar'. Keputusan limit kredit diambil berdasarkan angka basi seminggu.",
        "Twist-nya: tidak ada bug di kode Dimas. Yang gagal adalah manusianya — satu titik kegagalan tunggal (single point of failure) yang tidak tercatat di mana pun. Pipeline ML yang sehat tidak bergantung pada siapa pun yang sedang tidak sakit. Ia berjalan karena dijadwalkan, bukan karena diingat.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membaca dan merancang DAG pipeline tanpa siklus dengan critical path yang benar; (2) menghitung ekspektasi biaya retry dan memutuskan kapan retry membantu vs memperparah; (3) memilih antara cron, orchestrator, dan event-driven untuk kasus konkret; (4) menjelaskan mengapa idempotensi adalah syarat mutlak sebelum mengaktifkan retry otomatis.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Pipeline = skrip yang dijalankan rutin'",
        type: "pitfall",
        body: "Skrip yang dijalankan manusia bukan pipeline — itu ritual. Pipeline sejati: terjadwal otomatis, urutan task terjamin (DAG), kegagalan di-retry dan di-alert, dan setiap run tercatat. Jika pipeline-mu berhenti saat satu orang cuti, kamu tidak punya pipeline.",
      },
      reference: "Pipeline = otomatis + terjadwal + tercatat. Ritual manual bukan pipeline.",
    },
    {
      id: "dag",
      eyebrow: "Langkah 2 · DAG",
      title: "DAG: peta yang tidak boleh melingkar",
      prose: [
        "Pipeline ML dimodelkan sebagai DAG — Directed Acyclic Graph: task-task (simpul) dihubungkan panah dependensi (sisi berarah), dan tidak boleh ada lingkaran. 'Train' tidak boleh bergantung pada 'evaluate' yang bergantung pada 'train' — itu deadlock.",
        "Tiga sifat yang membuat DAG cocok untuk ML: urutan terjamin (features tidak jalan sebelum validate lolos), paralelisme aman (dua task independen boleh jalan bersamaan), dan kegagalan terlokalisasi (task gagal = retry task itu saja, bukan ulang dari nol).",
        "Dua konsep kunci. Pertama, idempotency: menjalankan ulang task yang sama menghasilkan hasil yang sama — tanpa ini, retry justru menggandakan data. Kedua, jalur kritis (critical path): rantai task terpanjang yang menentukan durasi total pipeline. Mempercepat task di luar jalur kritis tidak mempercepat apa pun.",
        "💡 Intuisi: DAG seperti resep rendang. Bumbu harus dihaluskan sebelum ditumis (dependensi), santan bisa disiapkan sambil menunggu (paralel), dan kalau santan pecah kamu tidak perlu mengulang dari memotong daging (retry terlokalisasi).",
      ],
      formula: String.raw`T_{kritis} = \max_{jalur} \sum_{i \in jalur} t_i`,
      formulaNote: "T_kritis = durasi total pipeline; maksimum diambil atas semua jalur dari awal ke akhir; t_i = durasi task ke-i. Pipeline selesai secepat jalur terpanjangnya — bukan jumlah semua task.",
      figure: {
        svg: DAG_SVG,
        alt: "Diagram DAG enam task berurutan dengan jalur kritis disorot.",
        caption: "DAG pipeline scoring: extract → validate → features → train → evaluate → register. Jalur kritis 28 menit menentukan durasi. Cara membaca: kotak = task, panah = ketergantungan (task baru jalan setelah pendahulunya sukses); jalur kritis = rantai task terpanjang. Interpretasi: mempercepat task di luar jalur kritis tidak mempercepat pipeline — optimasi selalu mulai dari jalur kritis 28 menit.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Task gagal = ulangi pipeline dari awal'",
        type: "pitfall",
        body: "Mengulang dari awal membuang jam komputasi dan — lebih parah — bisa menggandakan data jika task tidak idempotent. Desain yang benar: tiap task menyimpan output-nya (artifact), retry hanya menjalankan ulang task yang gagal dengan input yang sama.",
      },
      reference: "DAG = urutan + paralel aman + retry lokal. Jalur kritis menentukan durasi.",
    },
    {
      id: "scheduling-retry",
      eyebrow: "Langkah 3 · Scheduling & retry",
      title: "Kegagalan itu normal; yang abnormal adalah tidak siap",
      prose: [
        "Di produksi, task gagal karena alasan bodoh: network timeout 30 detik, database upstream sedang maintenance, disk penuh sesaat. Pipeline dewasa mengasumsikan kegagalan dan menyiapkan: retry otomatis dengan backoff eksponensial — tunggu 2 menit, lalu 4, lalu 8 — agar tidak men-dDoS sistem yang sedang sakit.",
        "Rumus backoff eksponensial:",
      ],
      formula: String.raw`w_k = b \cdot 2^{k-1}`,
      formulaNote: "w_k = waktu tunggu sebelum percobaan ulang ke-k; b = backoff dasar (mis. 2 menit); k = nomor percobaan. Tunggu tumbuh 2, 4, 8, 16 menit — memberi sistem yang gagal ruang bernapas.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Retry tanpa batas ('coba terus sampai bisa'). Pipeline yang retry selamanya menutupi masalah sistemik: task yang gagal 50x bukan sial — itu bug atau upstream mati. Batasi retry (mis. 3x), lalu ALERT ke manusia. Retry = kesabaran, bukan kebutaan.",
      },
      reference: "Backoff eksponensial + batas retry + alert. Tiga serangkai pipeline dewasa.",
    },
    {
      id: "lab-pipeline",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: orkestrasi mini dengan retry",
      prose: [
        "Kita bangun orkestrator mini: enam task dengan dependensi, durasi, dan peluang gagal masing-masing. Orkestrator menjalankan task sesuai urutan topologi, me-retry yang gagal (maks 3x, backoff 2/4/8 menit), lalu melaporkan.",
        "Tugasmu: lengkapi loop retry di dalam fungsi eksekusi. Perhatikan: backoff hanya ditambahkan saat akan retry lagi, dan task yang sukses tidak mengulang.",
        "Cara membaca: tiap baris 'gagal percobaan N → retry setelah X mnt' adalah pipeline yang sedang sabar. Interpretasi: bandingkan 'jalur kritis' vs 'total aktual' — selisihnya adalah harga ketidaksempurnaan dunia nyata.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan loop retry dengan backoff eksponensial" },
        { id: "t2", text: "Akumulasi `total_menit` (durasi + backoff)" },
        { id: "t3", text: "Jalankan; bandingkan jalur kritis vs aktual" },
      ],
      expected: "kritis 28 menit · aktual 50 menit (validate 2x, features 3x)",
      note: {
        title: "💡 Intuisi: orkestrator itu mandor, bukan tukang",
        body: "Orkestrator (Airflow, Prefect, Dagster) tidak melakukan komputasi — ia mengatur SIAPA jalan kapan, mengawasi, dan membangunkan yang gagal. Sama seperti mandor proyek: ia tidak mengaduk semen, tapi tanpa dia semen tidak pernah jadi tembok.",
      },
      hints: [
        "while percobaan <= MAX_RETRY and not sukses: percobaan += 1; total_menit += dur.",
        "Sukses jika random.random() >= p. Gagal dan masih boleh retry -> tunggu = BASE_BACKOFF * (2 ** (percobaan-1)).",
        "total_menit += tunggu HANYA saat retry; print pola 'gagal percobaan N -> retry setelah X mnt'.",
      ],
      code: {
        starter: `import random\nrandom.seed(4)\n\nTASKS = {\n    "extract":  {"dur": 4,  "p": 0.00, "dep": []},\n    "validate": {"dur": 2,  "p": 0.30, "dep": ["extract"]},\n    "features": {"dur": 6,  "p": 0.20, "dep": ["validate"]},\n    "train":    {"dur": 12, "p": 0.10, "dep": ["features"]},\n    "evaluate": {"dur": 3,  "p": 0.00, "dep": ["train"]},\n    "register": {"dur": 1,  "p": 0.00, "dep": ["evaluate"]},\n}\nMAX_RETRY = 3\nBASE_BACKOFF = 2  # menit\n\ndef urutan_topo(tasks):\n    selesai, urutan = set(), []\n    while len(urutan) < len(tasks):\n        for nama, t in tasks.items():\n            if nama not in selesai and all(d in selesai for d in t["dep"]):\n                urutan.append(nama); selesai.add(nama)\n    return urutan\n\ntotal_menit = 0\nprint("Jalannya pipeline:")\n# TULIS KODEMU: loop tiap task + retry ber-backoff\nfor nama in urutan_topo(TASKS):\n    \n\nkritis = sum(t["dur"] for t in TASKS.values())\nprint(f"Jalur kritis (tanpa gagal): {kritis} menit")\nprint(f"Total waktu aktual (dengan retry): {total_menit} menit")`,
        lockLines: 26,
        solution: `import random\nrandom.seed(4)\n\nTASKS = {\n    "extract":  {"dur": 4,  "p": 0.00, "dep": []},\n    "validate": {"dur": 2,  "p": 0.30, "dep": ["extract"]},\n    "features": {"dur": 6,  "p": 0.20, "dep": ["validate"]},\n    "train":    {"dur": 12, "p": 0.10, "dep": ["features"]},\n    "evaluate": {"dur": 3,  "p": 0.00, "dep": ["train"]},\n    "register": {"dur": 1,  "p": 0.00, "dep": ["evaluate"]},\n}\nMAX_RETRY = 3\nBASE_BACKOFF = 2  # menit\n\ndef urutan_topo(tasks):\n    selesai, urutan = set(), []\n    while len(urutan) < len(tasks):\n        for nama, t in tasks.items():\n            if nama not in selesai and all(d in selesai for d in t["dep"]):\n                urutan.append(nama); selesai.add(nama)\n    return urutan\n\ntotal_menit = 0\nprint("Jalannya pipeline:")\n# TULIS KODEMU: loop tiap task + retry ber-backoff\nfor nama in urutan_topo(TASKS):\n    t = TASKS[nama]\n    percobaan, sukses = 0, False\n    while percobaan <= MAX_RETRY and not sukses:\n        percobaan += 1\n        total_menit += t["dur"]\n        if random.random() >= t["p"]:\n            sukses = True\n        elif percobaan <= MAX_RETRY:\n            tunggu = BASE_BACKOFF * (2 ** (percobaan - 1))\n            total_menit += tunggu\n            print(f"  {nama}: gagal percobaan {percobaan} -> retry setelah {tunggu} mnt")\n    status = "OK" if sukses else "GAGAL TOTAL"\n    print(f"  {nama}: {status} setelah {percobaan}x percobaan")\n\nkritis = sum(t["dur"] for t in TASKS.values())\nprint(f"Jalur kritis (tanpa gagal): {kritis} menit")\nprint(f"Total waktu aktual (dengan retry): {total_menit} menit")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "validate: gagal percobaan 1 -> retry setelah 2 mnt", label: "validate retry 1x", msg: "Dengan seed 4, validate gagal sekali lalu sukses setelah backoff 2 menit." },
          { kind: "stdout_matches", task: "t1", pattern: "features: OK setelah 3x percobaan", label: "features 3x percobaan", msg: "features gagal 2x (backoff 2 dan 4 menit) lalu sukses di percobaan ke-3." },
          { kind: "stdout_matches", task: "t3", pattern: "Total waktu aktual \\(dengan retry\\): 50 menit", label: "Total 50 menit", msg: "28 menit kritis + 22 menit (retry & backoff) = 50 menit." },
        ],
      },
      reference: "Retry = loop + backoff eksponensial + batas. Harga realistis: 28 -> 50 menit.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Cron, orchestrator, atau event-driven?",
      prose: [
        "**Skenario 1 — Satu skrip, jadwal sederhana.** ETL harian jam 02.00, tidak ada dependensi antar-task. → Cron + logging cukup. Jangan pasang Airflow untuk satu skrip; itu seperti menyewa bus untuk antar satu anak sekolah.",
        "**Skenario 2 — Multi-task dengan dependensi & retry.** Pipeline training: extract → validate → features → train → evaluate. Butuh retry, alert, dan visibilitas. → Orchestrator (Airflow / Prefect / Dagster). Inilah kasus umum tim ML.",
        "**Skenario 3 — Tidak ada tim platform.** Sama seperti skenario 2 tapi tim 3 orang. → Managed orchestrator (Cloud Composer, MWAA) atau Prefect Cloud — bayar untuk tidak mengurus server Airflow sendiri.",
        "**Skenario 4 — Dipicu kejadian, bukan jadwal.** Model retrain saat data baru mendarat; scoring saat transaksi masuk. → Event-driven (message queue + trigger), bukan cron. Jadwal itu untuk hal periodik; event untuk hal reaktif.",
        "Aturan praktis 10 detik: hitung jumlah task × frekuensi perubahan. Satu task stabil = cron. Banyak task yang sering berubah = orchestrator. 'Jalankan saat X terjadi' = event-driven.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: pilih alat sesuai rasa sakit",
        body: "Rasa sakit cron: 'kenapa task ke-4 jalan padahal task ke-2 gagal?' → butuh DAG. Rasa sakit orchestrator self-hosted: 'siapa yang menjaga Airflow-nya?' → butuh managed. Jangan memilih alat sebelum merasakan sakitnya; tiap lapisan menambah biaya perawatan.",
      },
      reference: "1 task = cron. Multi-task = orchestrator. Pemicu kejadian = event-driven.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Pipeline ETL yang 'kadang-kadang' gagal",
      prose: [
        "Bank Mini punya pipeline scoring harian: 5 task, total 40 menit. Data 6 bulan terakhir: pipeline gagal total 2x per minggu (rata-rata), tiap kegagalan butuh 1 jam investigasi manual oleh engineer (Rp250.000/jam), dan 1 dari 4 kegagalan membuat laporan direksi terlambat (denda SLA internal Rp2.000.000).",
        "**Pertanyaan:** (1) Berapa biaya tahunan status quo? (2) Jika orkestrator dengan retry otomatis menangani 80% kegagalan tanpa manusia, berapa penghematan tahunan? (3) Kapan investasi orkestrator TIDAK worth it?",
        "**Pembahasan:** (1) 2 gagal/minggu × 52 = 104 kegagalan/tahun. Investigasi: 104 × Rp250.000 = Rp26.000.000. Denda: 104/4 × Rp2.000.000 = Rp52.000.000. Total Rp78.000.000/tahun. (2) 80% × Rp78.000.000 = Rp62.400.000 penghematan — jauh di atas biaya managed orchestrator (~Rp15-30 jt/tahun). (3) Jika kegagalan < 1x per bulan dan tidak ada denda keterlambatan — biaya ritual manual lebih murah dari biaya merawat orchestrator.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keterlambatan laporan risiko karena pipeline gagal bukan sekadar 'telat' — direksi mengambil keputusan dengan data basi (seperti kasus Dimas). Dalam risk appetite statement, 'data tepat waktu' adalah kontrol; pipeline yang rapuh = kontrol yang rapuh.",
      },
      reference: "Rp78 jt/tahun biaya 'kadang gagal'. Hitung sebelum memutuskan.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Ekonomi retry: kapan mengulang menolong, kapan membunuh",
      prose: [
        "Pipeline scoring KreditKu punya 6 task; task `train` gagal sekitar 10% karena OOM transient (server tetangga tiba-tiba rakus memori). Tanpa retry, tiap kegagalan berarti rerun manual keesokan paginya: biaya keterlambatan skor satu hari ≈ Rp4 juta (keputusan kredit tertunda). Dengan retry otomatis 3x, peluang gagal total = 0,1³ = 0,001 — nyaris nol. Terdengar seperti kemenangan gratis. Tapi tiap percobaan train memakan biaya compute Rp600 ribu, dan inilah jebakannya.",
        "Hitung ekspektasi biayanya. Peluang sukses di percobaan ke-1: 90%, biaya Rp600 ribu. Ke-2: 9%, biaya 2 × Rp600 ribu. Ke-3: 0,9%, biaya 3 × Rp600 ribu. Gagal total: 0,1%, biaya 3 × Rp600 ribu + Rp4 juta keterlambatan. Ekspektasi = 0,9(600rb) + 0,09(1,2jt) + 0,009(1,8jt) + 0,001(1,8jt + 4jt) ≈ Rp670 ribu per hari. Tanpa retry: 0,9(600rb) + 0,1(600rb + 4jt) = Rp1 juta per hari. Retry MENGHEMAT Rp330 ribu per hari di kasus ini — karena kegagalannya transient dan biayanya kecil dibanding keterlambatan.",
        "Balik angkanya dan retry jadi bencana. Misal task `kirim_notifikasi` gagal 10% karena timeout API vendor — tapi task ini TIDAK idempotent: tiap eksekusi mengirim SMS Rp500 ke nasabah. Retry 3x berarti 0,9% nasabah menerima SMS ganda (Rp1.000 terbuang + komplain), dan 0,1% menerima tiga kali. Lebih parah: jika penyebab gagalnya adalah API vendor yang down, retry agresif justru menambah beban ke sistem yang sedang sekarat — inilah `retry storm` yang pernah melumpuhkan checkout sebuah e-commerce selama 40 menit: 500 worker × retry 5x = 2.500 request/detik ke API yang kapasitasnya 300.",
        "Aturan keputusannya tiga lapis. Satu: HANYA retry task yang idempotent — menjalankannya dua kali hasilnya sama dengan sekali (tulis file dengan nama deterministik, upsert bukan insert, kirim dengan idempotency key). Dua: retry hanya untuk kegagalan TRANSIENT (timeout, OOM sesekali, 503) — bukan untuk kegagalan deterministik (data rusak, bug kode); retry bug = membakar compute untuk gagal yang sama persis. Tiga: pakai backoff eksponensial + jitter (tunggu 1, 2, 4, 8 detik + acak) agar ratusan task tidak retry berbarengan dan men-DDoS sistem sendiri.",
        "Cara membedakan transient vs deterministik tanpa menebak: catat `fingerprint` kegagalan (jenis error + task + 1 jam terakhir). Jika error yang SAMA gagal 3x berturut-turut dengan input berbeda → perlakukan sebagai deterministik, hentikan retry, page engineer. Jika error berbeda-beda tiap percobaan → transient, retry boleh jalan. Pattern ini disebut `circuit breaker` sederhana, dan ia menyelamatkan budget compute sekaligus mencegah retry storm.",
        "Terakhir, hitung `biaya kegagalan yang ditoleransi` sebelum mengaktifkan retry. Rumus kasarnya: retry layak jika (biaya satu percobaan × ekspektasi jumlah percobaan) < (biaya kegagalan total × peluang gagal tanpa retry). Untuk task train tadi: Rp600rb × 1,11 < Rp4,6jt × 0,1 → Rp666rb < Rp460rb? TIDAK — tunggu, hitung ulang dengan benar: ekspektasi percobaan = 1 + 0,1 + 0,01 = 1,11; kiri = Rp666 ribu; kanan = (Rp1,8jt + Rp4jt) × 0,1 = Rp580 ribu. Hmm, kiri > kanan? Berarti retry 3x TIDAK layak?? Mari cek: tanpa retry ekspektasi = Rp1 juta (dihitung di atas); dengan retry = Rp670 ribu. Yang benar dibandingkan adalah TOTAL ekspektasi, bukan komponennya — dan total berkata retry menang Rp330 ribu/hari. Pelajaran: jangan bandingkan potongan rumus; hitung total ekspektasi kedua skenario sampai tuntas, seperti yang baru kita lakukan.",
        "Ringkasan operasionalnya: tandai setiap task di DAG dengan dua label — `idempotent?` (ya/tidak) dan `failure class` (transient/deterministik/campuran). Retry otomatis HANYA untuk pasangan (ya, transient). Sisanya: gagal cepat, beri pesan error yang jelas, dan bangunkan manusia. Pipeline yang baik bukan yang tidak pernah gagal — melainkan yang gagal dengan cara yang murah dan berisik.",
      ],
      formula: String.raw`E[biaya] = c \cdot (1 + p + p^2 + \dots + p^{k-1}) + p^k \cdot L`,
      formulaNote: "E[biaya] = ekspektasi biaya per eksekusi; c = biaya satu percobaan; p = peluang gagal per percobaan; k = jumlah percobaan maksimum (1 + retry); L = kerugian jika semua percobaan gagal. Bandingkan E[biaya] dengan retry vs tanpa retry — pilih yang totalnya lebih kecil.",
      figure: {
        svg: MLOPS2_DEEP_SVG,
        alt: "Diagram batang: ekspektasi biaya harian tanpa retry Rp1.000 ribu vs dengan retry 3x Rp670 ribu.",
        caption: "Cara membaca: dua batang = dua strategi untuk task train yang gagal 10%; tinggi batang = ekspektasi biaya harian (ribu rupiah). Interpretasi: retry 3x menghemat Rp330 ribu/hari karena kegagalannya transient dan biaya percobaan kecil — tapi kesimpulan ini TERBALIK untuk task yang tidak idempotent.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: retry adalah pinjaman, bukan hadiah",
        body: "Setiap retry meminjam compute sekarang untuk menghindari kerugian nanti — dan pinjamannya berbunga jika task tidak idempotent atau penyebabnya deterministik. Tanya selalu: `kalau task ini jalan dua kali, apa yang rusak?` Jika jawabannya bukan `tidak ada`, matikan retry otomatis untuk task itu.",
      },
      reference: "Retry hanya untuk (idempotent, transient) dengan backoff + jitter. Hitung total ekspektasi, bukan potongan rumus.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Pipeline sejati = otomatis + terjadwal + tercatat; ritual manual bukan pipeline.",
        "DAG menjamin urutan, paralelisme aman, dan retry terlokalisasi; idempotency syarat retry aman.",
        "Jalur kritis menentukan durasi; percepat task di luarnya = sia-sia.",
        "Retry butuh backoff eksponensial + batas + alert; retry tanpa batas menutupi bug sistemik.",
        "Pilih alat sesuai rasa sakit: cron, orchestrator, managed, atau event-driven.",
      ],
      next: { label: "MLOps3 — Feature Store", href: "/v2/learn/mlops3-feature-store" },
      quiz: [
        {
          q: "Kasus Dimas: apa kegagalan sebenarnya?",
          options: [
            { text: "Notebook-nya ada bug", why: "Dinyatakan jelas: kodenya benar dan angkanya selalu cocok." },
            { text: "Proses bergantung pada satu orang tanpa otomasi", why: "Single point of failure manusiawi: tidak terjadwal, tidak tercatat, tidak ada backup. Itulah yang diperbaiki pipeline.", correct: true },
            { text: "Dimas tidak kompeten", why: "Dimas justru rapi; masalahnya sistemik, bukan personal." },
            { text: "Direksi terlalu menuntut", why: "Laporan jam 09.00 adalah kebutuhan bisnis yang sah." },
          ],
        },
        {
          q: "Kenapa DAG melarang lingkaran (acyclic)?",
          options: [
            { text: "Agar gambarnya rapi", why: "Estetika bukan alasan teknis." },
            { text: "Lingkaran = deadlock: A menunggu B yang menunggu A, tak ada yang bisa mulai", why: "Orkestrator butuh urutan topologi; siklus membuatnya mustahil.", correct: true },
            { text: "Lingkaran memperlambat komputer", why: "Tidak ada hubungannya dengan kecepatan." },
            { text: "Aturan ini sudah tidak berlaku", why: "Justru fundamental — semua orchestrator modern menegakkannya." },
          ],
        },
        {
          q: "Task train 12 menit ada di jalur kritis; task evaluate 3 menit tidak. Optimasi mana yang mempercepat pipeline?",
          options: [
            { text: "Mempercepat evaluate jadi 1 menit", why: "Evaluate di luar jalur kritis — pipeline tetap 28 menit." },
            { text: "Mempercepat train jadi 8 menit", why: "Jalur kritis berkurang 4 menit → pipeline 24 menit. Uang optimasi hanya berarti di jalur kritis.", correct: true },
            { text: "Menjalankan keduanya paralel", why: "Evaluate bergantung pada train — tidak bisa paralel." },
            { text: "Keduanya sama", why: "Tidak: hanya jalur kritis yang menentukan durasi total." },
          ],
        },
        {
          q: "Task gagal 50x berturut-turut dan pipeline terus me-retry. Diagnosis paling mungkin?",
          options: [
            { text: "Sial saja, biarkan retry", why: "50x bukan sial — itu pola. Retry tanpa batas menutupi masalah sistemik." },
            { text: "Bug sistemik atau upstream mati — hentikan, alert, investigasi", why: "Retry = kesabaran untuk gangguan transient. Kegagalan persisten butuh manusia, bukan kesabaran ke-51.", correct: true },
            { text: "Tambah backoff lebih besar", why: "Backoff lebih besar hanya menunda pengakuan masalah." },
            { text: "Hapus task itu", why: "Menghapus gejala, bukan menyembuhkan penyakit." },
          ],
        },
        {
          q: "Satu skrip ETL harian tanpa dependensi. Pilihan paling tepat?",
          options: [
            { text: "Airflow self-hosted dengan 3 worker", why: "Overkill: biaya perawatan jauh di atas manfaat untuk satu skrip." },
            { text: "Cron + logging yang rapi", why: "Sederhana, cukup, murah. Naik kelas hanya saat rasa sakit muncul (dependensi, retry, visibilitas).", correct: true },
            { text: "Event-driven dengan message queue", why: "Tidak ada kejadian pemicu — ini jadwal periodik murni." },
            { text: "Jalankan manual tiap pagi", why: "Itulah ritual Dimas — single point of failure." },
          ],
        },
        {
          q: "Task `kirim_sms_otp` gagal 5% karena timeout vendor. Tiap SMS berharga Rp400 dan tidak ada idempotency key. Kebijakan retry yang TEPAT?",
          options: [
            { text: "Retry 3x otomatis dengan backoff — kegagalan timeout itu transient", why: "Timeout memang transient, tapi task ini tidak idempotent: retry berarti sebagian user menerima 2–3 SMS (Rp800–1.200 terbuang per user) plus komplain. Transient saja tidak cukup — syarat idempotensi gagal." },
            { text: "Tidak ada retry otomatis; gagal cepat + alert, kirim ulang manual per kasus", why: "Tepat. Tanpa idempotency key, retry otomatis mengubah 5% kegagalan menjadi spam SMS. Gagal cepat + penanganan manual lebih murah dari komplain massal. Perbaikan strukturalnya: minta idempotency key ke vendor.", correct: true },
            { text: "Retry 10x agresif tanpa jeda agar peluang sukses maksimal", why: "Ini resep retry storm: 10x percobaan tanpa jeda ke vendor yang sedang timeout justru menambah bebannya, dan tiap percobaan yang `gagal timeout` mungkin sebenarnya terkirim — SMS ganda massal." },
            { text: "Hapus task SMS dari pipeline agar tidak pernah gagal", why: "Menghapus task menghilangkan fiturnya, bukan risikonya. Masalahnya bukan keberadaan task, melainkan kebijakan retry yang tidak cocok untuk task non-idempotent." },
          ],
        },
      ],
    },
  ],
};

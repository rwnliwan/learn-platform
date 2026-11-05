import type { V2Lesson } from "../lib/types";

// DAG: extract -> validate -> transform -> load -> laporan.
const DAG_SVG = `<svg viewBox="0 0 600 190" role="img" aria-label="DAG lima task berurutan: extract, validate, transform, load, laporan, dengan panah dependensi searah.">
<defs><marker id="de7a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="var(--chart-text)"/></marker></defs>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="10" y="65" width="96" height="52" rx="10" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="58" y="88" font-size="12" font-weight="600" fill="var(--text)">extract</text>
<text x="58" y="106" font-size="10" fill="var(--text-muted)">tanpa dep</text>
<rect x="136" y="65" width="96" height="52" rx="10" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="184" y="88" font-size="12" font-weight="600" fill="var(--text)">validate</text>
<text x="184" y="106" font-size="10" fill="var(--text-muted)">retry 1x</text>
<rect x="262" y="65" width="96" height="52" rx="10" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="310" y="88" font-size="12" font-weight="600" fill="var(--text)">transform</text>
<text x="310" y="106" font-size="10" fill="var(--text-muted)">tunggu validate</text>
<rect x="388" y="65" width="96" height="52" rx="10" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="436" y="88" font-size="12" font-weight="600" fill="var(--text)">load</text>
<text x="436" y="106" font-size="10" fill="var(--text-muted)">tunggu transform</text>
<rect x="504" y="65" width="86" height="52" rx="10" fill="var(--c5)" opacity="0.3" stroke="var(--c5)" stroke-width="2"/>
<text x="547" y="88" font-size="12" font-weight="600" fill="var(--text)">laporan</text>
<text x="547" y="106" font-size="10" fill="var(--text-muted)">terakhir</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.8" marker-end="url(#de7a)">
<line x1="106" y1="91" x2="132" y2="91"/><line x1="232" y1="91" x2="258" y2="91"/>
<line x1="358" y1="91" x2="384" y2="91"/><line x1="484" y1="91" x2="500" y2="91"/>
</g>
<text x="300" y="160" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">panah = "jalan setelah" · tidak boleh ada siklus (makanan tidak bisa dimasak sebelum dibeli)</text>
</svg>`;

export const de7: V2Lesson = {
  slug: "de7-orchestration",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE7 — Orchestration: DAG & Scheduling",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Cron, sleep 3600, dan doa",
      prose: [
        "Di 'FinPay', pipeline laporan berjalan dengan tiga cron job: extract jam 1 pagi, transform jam 2 pagi (dengan sleep 3600 'untuk memastikan extract selesai'), load jam 4 pagi. Berjalan mulus... sampai Black Friday. Extract molor sampai jam 3:30 karena volume 5x lipat.",
        "Transform tetap jalan jam 2 — memproses data setengah jadi. Load jam 4 menyajikan laporan 'resmi' yang salah ke direksi. Tidak ada yang error; semua job 'sukses'. Doa tidak termasuk dalam SLA.",
        "Twist-nya: masalahnya bukan jadwalnya, melainkan caranya menunggu. sleep adalah tebakan; dependensi adalah kepastian. Lesson ini tentang orchestrator: sistem yang menjalankan task karena pendahulunya selesai — bukan karena jam menunjukkan angka.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: cron + sleep cukup untuk pipeline",
        type: "pitfall",
        body: "sleep menebak durasi; dependensi mengetahui selesainya task. Saat volume berubah (promo, akhir bulan), tebakan meleset dan pipeline 'sukses' dengan data setengah jadi. Cron tidak tahu task gagal — ia hanya tahu jam berapa sekarang.",
      },
      reference: "Orchestrator = jalankan karena dependensi terpenuhi, bukan karena jam.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengorkestrasi pipeline dengan DAG yang benar.",
        "(1) Menjelaskan kenapa cron + sleep tidak cukup untuk pipeline (tidak ada dependensi, retry, backfill);",
        "(2) Membangun executor DAG mini dengan retry dan sensor; (3) Merancang backfill 30 hari yang aman;",
        "(4) Memilih cron, orchestrator, atau event-driven berdasar kompleksitas dependensi.",
      ],
      tasks: [],
    },

    {
      id: "dag",
      eyebrow: "Langkah 3 · DAG",
      title: "DAG: resep masak yang tidak bisa dibalik",
      prose: [
        "DAG (Directed Acyclic Graph) adalah peta dependensi: panah berarti 'jalan setelah'. Directed = panah punya arah; Acyclic = tidak boleh ada siklus. Kamu tidak bisa menumis sebelum memotong — dan tidak boleh memotong membutuhkan tumisan (siklus = mustahil).",
        "Kepribadian DAG: 'kepala dapur yang tegas'. Ia tahu urutan topologis (siapa dulu), menjalankan yang independen secara paralel, me-retry yang gagal, dan menghentikan downstream jika upstream gagal — agar laporan tidak dibangun di atas data setengah jadi.",
        "💡 Intuisi: DAG memisahkan APA (definisi task + dependensi) dari KAPAN/BAGAIMANA (eksekutor). Kamu menggambar resep; orchestrator yang memasak, mencuci piring (retry), dan mematikan kompor (alert).",
        "💡 Intuisi: idempoten (DE4) adalah syarat DAG yang sehat. Retry task transform aman hanya jika di-rerun tidak merusak — DAG + idempoten = pipeline yang menyembuhkan diri sendiri.",
        "Cara membaca: lima kotak berurutan — extract → validate → transform → load → laporan — dengan panah searah. Tidak ada panah yang kembali: itu syarat DAG (acyclic).",
        "Interpretasi: panah = 'jangan mulai sebelum saya selesai'. Load tidak boleh jalan sebelum validate lolos — inilah yang tidak bisa dilakukan cron + sleep. Siklus dilarang karena berarti deadlock logika.",
      ],
      figure: {
        svg: DAG_SVG,
        alt: "DAG lima task: extract, validate, transform, load, laporan.",
        caption: "Panah = dependensi. Siklus dilarang: tidak ada jalan kembali.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: semakin banyak task kecil semakin baik",
        type: "pitfall",
        body: "Task yang terlalu granular (100 task @ 10 detik) membuat overhead scheduling mendominasi dan DAG sulit dibaca. Aturan: satu task = satu unit yang masuk akal untuk di-retry (menit-an, bukan detik-an).",
      },
      reference: "DAG = dependensi eksplisit + tanpa siklus. Retry butuh idempoten.",
    },
    {
      id: "schedule-backfill",
      eyebrow: "Langkah 4 · Jadwal",
      title: "Scheduling, backfill, dan sensor",
      prose: [
        "Scheduling menjawab 'kapan': cron-like (tiap jam 1 pagi), interval (tiap 30 menit), atau event-driven (jalan saat file mendarat). Pilihan jadwal = pilihan latency (DE2) — jangan jadwalkan per jam jika keputusan butuh harian.",
        "Backfill menjawab 'bagaimana memperbaiki masa lalu': jalankan ulang DAG untuk 30 tanggal ke belakang. Inilah kenapa idempoten + partisi tanggal adalah fondasi — backfill hanyalah 'rerun massal yang direncanakan'.",
        "Sensor menjawab 'bagaimana menunggu dengan elegan': bukan sleep, melainkan task yang mengecek kondisi ('apakah file sudah ada?') lalu membiarkan downstream jalan. Menunggu berbasis kondisi, bukan tebakan waktu.",
      ],
      formula: String.raw`T_{backfill} = \left\lceil \frac{N_{task}}{W} \right\rceil \times t_{task}`,
      formulaNote: "T_backfill = waktu backfill; N_task = total task (hari × task per hari); W = jumlah worker paralel; t_task = durasi per task. Contoh: 120 task, 4 worker, 3 menit → 90 menit.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Backfill tanpa batas paralelisme hingga menenggelamkan database sumber (120 query berat serentak). Selalu batasi concurrency backfill — memperbaiki masa lalu tidak boleh membunuh masa kini.",
      },
      reference: "Schedule = kapan. Backfill = perbaiki masa lalu. Sensor = tunggu berbasis kondisi.",
    },
    {
      id: "lab-dag",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: executor DAG mini dengan retry",
      prose: [
        "Lab ini membangun orchestrator sungguhan (versi mini): topological sort untuk urutan, lalu eksekusi dengan retry otomatis. Task validate diset 'gagal_dulu' — mensimulasikan transient failure yang sembuh saat retry.",
        "Cara membaca: log menunjukkan validate GAGAL di percobaan 1 lalu OK di percobaan 2 — tanpa menghentikan task lain yang independen. Total 6 percobaan untuk 5 task.",
        "Interpretasi: inilah yang dilakukan Airflow/Prefect/Dagster di balik layar — hanya dengan UI, database metadata, dan 10 tahun fitur tambahan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `topo()`: urutan topologis via Kahn (indegree)" },
        { id: "t2", text: "Lengkapi `jalankan()`: eksekusi + retry (max 2x), catat `log` dan `percobaan`" },
        { id: "t3", text: "Jalankan dan cetak log + `total_percobaan`" },
      ],
      expected: "validate: GAGAL (percobaan 1) -> retry | validate: OK (percobaan 2) | total_percobaan=6",
      note: {
        title: "Sering salah",
        body: "Retry tanpa batas percobaan (while True). Executor nyata selalu punya max_retry — task yang gagal permanen harus berhenti dan membangunkan manusia, bukan mengulang selamanya sambil membakar biaya.",
      },
      hints: [
        "Kahn: mulai dari task indegree 0, kurangi indegree anak tiap task selesai.",
        "Loop percobaan 1..max_retry+1; jika gagal_dulu dan a==1 → catat GAGAL, continue.",
        "percobaan[t] = a setiap iterasi; total = sum(percobaan.values()).",
      ],
      code: {
        starter: `from collections import deque\n\nTASKS = {\n    "extract":   {"deps": [], "gagal_dulu": False},\n    "validate":  {"deps": ["extract"], "gagal_dulu": True},\n    "transform": {"deps": ["validate"], "gagal_dulu": False},\n    "load":      {"deps": ["transform"], "gagal_dulu": False},\n    "laporan":   {"deps": ["load"], "gagal_dulu": False},\n}\n\n# TULIS KODEMU: topological sort (Kahn)\ndef topo(tasks):\n    indeg = {t: len(v["deps"]) for t, v in tasks.items()}\n    anak = {t: [] for t in tasks}\n    for t, v in tasks.items():\n        for d in v["deps"]:\n            anak[d].append(t)\n    q = deque([t for t, d in indeg.items() if d == 0])\n    urutan = []\n    \n    return urutan\n\n# TULIS KODEMU: eksekutor + retry\ndef jalankan(tasks, max_retry=2):\n    log = []\n    percobaan = {}\n    \n    return log, percobaan\n\nlog, percobaan = jalankan(TASKS)\nfor l in log:\n    print(l)\nprint(f"total_percobaan={sum(percobaan.values())}")`,
        lockLines: 9,
        solution: `from collections import deque\n\nTASKS = {\n    "extract":   {"deps": [], "gagal_dulu": False},\n    "validate":  {"deps": ["extract"], "gagal_dulu": True},\n    "transform": {"deps": ["validate"], "gagal_dulu": False},\n    "load":      {"deps": ["transform"], "gagal_dulu": False},\n    "laporan":   {"deps": ["load"], "gagal_dulu": False},\n}\n\n# TULIS KODEMU: topological sort (Kahn)\ndef topo(tasks):\n    indeg = {t: len(v["deps"]) for t, v in tasks.items()}\n    anak = {t: [] for t in tasks}\n    for t, v in tasks.items():\n        for d in v["deps"]:\n            anak[d].append(t)\n    q = deque([t for t, d in indeg.items() if d == 0])\n    urutan = []\n    while q:\n        t = q.popleft()\n        urutan.append(t)\n        for c in anak[t]:\n            indeg[c] -= 1\n            if indeg[c] == 0:\n                q.append(c)\n    return urutan\n\n# TULIS KODEMU: eksekutor + retry\ndef jalankan(tasks, max_retry=2):\n    log = []\n    percobaan = {}\n    for t in topo(tasks):\n        for a in range(1, max_retry + 2):\n            percobaan[t] = a\n            if tasks[t]["gagal_dulu"] and a == 1:\n                log.append(f"{t}: GAGAL (percobaan {a}) -> retry")\n                continue\n            log.append(f"{t}: OK (percobaan {a})")\n            break\n    return log, percobaan\n\nlog, percobaan = jalankan(TASKS)\nfor l in log:\n    print(l)\nprint(f"total_percobaan={sum(percobaan.values())}")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "validate: GAGAL \\(percobaan 1\\) -> retry", label: "log retry validate", msg: "validate harus tercatat GAGAL di percobaan 1 lalu retry." },
          { kind: "stdout_matches", task: "t3", pattern: "validate: OK \\(percobaan 2\\)", label: "log sukses validate", msg: "validate sukses di percobaan 2." },
          { kind: "stdout_matches", task: "t3", pattern: "total_percobaan=6", label: "`print` total_percobaan=6", msg: "5 task + 1 retry = 6 percobaan." },
          { kind: "uses", task: "t1", token: "popleft", label: "memakai `popleft` (Kahn)", msg: "Gunakan deque + popleft untuk topological sort." },
        ],
      },
      reference: "Topo sort = urutan. Retry = penyembuh. Keduanya butuh idempoten.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 DAG yang baik dibaca seperti resep: dari atas ke bawah, tidak ada lompatan. Jika kamu tidak bisa menjelaskan urutan task ke non-teknis dalam 1 menit, DAG-mu terlalu pintar untuk kebaikannya sendiri.",
        "💡 Sensor > sleep. 'Tunggu file datang' harus berupa sensor yang memeriksa kondisi, bukan sleep 3600 yang berharap. Harapan bukan strategi orkestrasi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: catchup adalah tombol yang mengubah insiden kecil jadi bencana",
        body: "Ada satu opsi di scheduler yang paling sering disesali: catchup. Kedengarannya mulia — \"kejar semua jadwal yang terlewat\" — tetapi saat DAG rusak selama 30 hari, catchup berarti 30 run backfill menumpuk antrean, berebut resource, dan saling gagal dalam retry storm yang indah. Heuristik praktisi: catchup mati secara default; backfill adalah operasi sadar dengan rencana, bukan efek samping. Aturan desain DAG-nya tiga: pertama, setiap task harus atomic dan idempoten — bisa di-retry sendiri tanpa merusak tetangga; kedua, \"tunggu file datang\" harus berupa sensor yang memeriksa kondisi, bukan sleep 3600 yang berharap — harapan bukan strategi; ketiga, DAG yang baik dibaca seperti resep dari atas ke bawah — bila kamu tidak bisa menjelaskan urutannya ke non-teknis dalam satu menit, DAG-mu terlalu pintar untuk kebaikannya sendiri. Jebakan lain: task raksasa \"lakukan semuanya\" yang gagal di menit ke-59 dan mengulang dari nol — pecah menjadi task kecil yang checkpoint-nya murah. Dan soal SLA: definisikan sebagai janji freshness ke konsumen — \"mart siap pukul 07.00\" — bukan sebagai \"job selesai\". Orkestrasi yang baik tidak terlihat: datanya selalu ada saat dibutuhkan, dan tidak ada yang tahu namamu jam 3 pagi.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: cron, orchestrator, atau event?",
      prose: [
        "Skenario 1 — Satu skrip, satu jadwal, tanpa dependensi. Kondisi: kirim laporan harian jam 7. Keputusan: cron cukup. Alasan: orchestrator untuk satu task = meriam untuk nyamuk.",
        "Skenario 2 — Multi-task dengan dependensi dan retry. Kondisi: extract → validate → transform → load. Keputusan: orchestrator (Airflow/Prefect/Dagster). Alasan: dependensi, retry, backfill, UI monitoring — inilah habitat aslinya.",
        "Skenario 3 — Jalan saat data tiba (tidak tentu jamnya). Kondisi: file mendarat jam acak. Keputusan: event-driven / sensor. Alasan: jadwal tetap = menunggu sia-sia atau telat; trigger oleh kedatangan data.",
        "Skenario 4 — Ratusan DAG, banyak tim. Kondisi: butuh ownership, versioning, testing DAG. Keputusan: orchestrator + DAG-as-code + CI. Alasan: skala organisasi butuh disiplin kode, bukan klik UI.",
        "Aturan praktis 10 detik: 1 task → cron. Dependensi/retry/backfill → orchestrator. Waktu kedatangan acak → event-driven.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih orchestrator karena 'semua orang pakai Airflow'. Jika kebutuhanmu cron + satu skrip, Airflow menambah server, database metadata, dan kompleksitas tanpa nilai. Mulai dari yang paling sederhana yang memenuhi syarat.",
      },
      reference: "Kompleksitas orchestrator harus dibayar oleh kompleksitas dependensi.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: backfill 30 hari",
      prose: [
        "Bug mapping kategori ditemukan — 30 hari data mart harus dihitung ulang. Tiap hari = 4 task × 3 menit. Tanpa paralelisme: 360 menit (6 jam). Dengan 4 worker paralel: 90 menit.",
        "Hitung total task, waktu serial, waktu paralel (4 worker), dan penghematannya. Asumsi task independen antar hari (benar jika idempoten + partisi tanggal — DE4!).",
        "Interpretasi: inilah ROI idempoten dalam rupiah waktu. Tanpa idempoten, backfill 30 hari = proyek 2 minggu dengan validasi manual; dengan idempoten = satu perintah + 90 menit.",
        "Angka konkretnya: 30 hari × 4 task = 120 task × 3 menit = 360 menit (6 jam) serial vs 90 menit dengan 4 worker — hemat 4,5 jam. Dengan biaya engineer Rp250 ribu/jam, satu backfill menghemat Rp1,1 juta waktu-tunggu; tanpa idempoten, backfill yang sama = proyek 2 minggu validasi manual (±Rp20 juta). Idempoten bukan teori — ia uang.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total_task`, `serial`, `paralel` (math.ceil)" },
        { id: "t2", text: "Hitung `penghematan` (rasio, bulatkan) dan cetak semua" },
      ],
      expected: "total_task=120 | waktu_serial_menit=360 | waktu_paralel4_menit=90 | penghematan=4x",
      hints: [
        "total_task = 30 × 4; serial = total_task × 3.",
        "paralel = ceil(total_task / 4) × 3 (import math).",
        "penghematan = round(serial / paralel).",
      ],
      code: {
        starter: `import math\n\nhari = 30\ntask_per_hari = 4\nmenit_per_task = 3\nworker = 4\n\n# TULIS KODEMU\ntotal_task = \nserial = \nparalel = \npenghematan = round(serial / paralel)\n\nprint(f"total_task={total_task}")\nprint(f"waktu_serial_menit={serial}")\nprint(f"waktu_paralel4_menit={paralel}")\nprint(f"penghematan={penghematan}x")`,
        lockLines: 6,
        solution: `import math\n\nhari = 30\ntask_per_hari = 4\nmenit_per_task = 3\nworker = 4\n\n# TULIS KODEMU\ntotal_task = hari * task_per_hari\nserial = total_task * menit_per_task\nparalel = math.ceil(total_task / worker) * menit_per_task\npenghematan = round(serial / paralel)\n\nprint(f"total_task={total_task}")\nprint(f"waktu_serial_menit={serial}")\nprint(f"waktu_paralel4_menit={paralel}")\nprint(f"penghematan={penghematan}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_task", value: 120, tol: 0, label: "`total_task` = 120", msg: "30 hari × 4 task." },
          { kind: "equal", task: "t1", name: "serial", value: 360, tol: 0, label: "`serial` = 360 menit", msg: "120 × 3 menit = 360." },
          { kind: "equal", task: "t1", name: "paralel", value: 90, tol: 0, label: "`paralel` = 90 menit", msg: "ceil(120/4) × 3 = 90." },
          { kind: "stdout_matches", task: "t2", pattern: "penghematan=4x", label: "`print` penghematan=4x", msg: "360/90 = 4." },
        ],
      },
      reference: "Backfill = rerun massal. Murah hanya jika idempoten + paralel.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang menjalankan pipeline dengan benar.",
      ],
      tasks: [],
      summary: [
        "Orchestrator menjalankan task karena dependensi terpenuhi — bukan karena jam (cron + sleep = tebakan).",
        "DAG = dependensi eksplisit, tanpa siklus; pisahkan APA (definisi) dari BAGAIMANA (eksekusi).",
        "Scheduling = kapan; backfill = perbaiki masa lalu; sensor = tunggu berbasis kondisi.",
        "Retry butuh idempoten + max_retry; backfill butuh batas paralelisme.",
        "1 task → cron; dependensi → orchestrator; kedatangan acak → event-driven.",
      ],
      next: { label: "DE8 — Data Quality: Test & Contract", href: "/v2/learn/de8-quality" },
      quiz: [
        {
          q: "Kenapa pipeline FinPay menghasilkan laporan salah saat Black Friday?",
          options: [
            { text: "Cron-nya error", why: "Cron berjalan normal; masalahnya bukan error." },
            { text: "sleep menebak durasi extract; saat volume naik, tebakan meleset dan transform memproses data setengah jadi", why: "Tepat: dependensi tidak eksplisit — semua 'sukses' dengan data yang salah.", correct: true },
            { text: "Datanya terlalu sedikit", why: "Justru terlalu banyak (5x lipat) hingga extract molor." },
            { text: "Server mati", why: "Tidak ada yang mati; semua job 'sukses' — itulah bahayanya." },
          ],
        },
        {
          q: "Apa syarat agar retry task otomatis AMAN?",
          options: [
            { text: "Task harus cepat", why: "Kecepatan bukan syarat keamanan retry." },
            { text: "Task harus idempoten", why: "Tepat: rerun tidak boleh merusak/menduplikasi hasil.", correct: true },
            { text: "Task harus ditulis dalam Python", why: "Bahasa tidak relevan dengan keamanan retry." },
            { text: "Task harus jalan jam 1 pagi", why: "Jadwal tidak relevan." },
          ],
        },
        {
          q: "Backfill 30 hari paling tepat diartikan sebagai…",
          options: [
            { text: "Menghapus data 30 hari", why: "Kebalikannya: menghitung ulang, bukan menghapus." },
            { text: "Rerun massal yang direncanakan untuk memperbaiki historis — murah jika idempoten + paralel", why: "Tepat: 120 task, 90 menit dengan 4 worker.", correct: true },
            { text: "Backup database", why: "Backup = salinan pengaman, bukan hitung ulang." },
            { text: "Menambah 30 kolom baru", why: "Tidak berhubungan dengan skema." },
          ],
        },
        {
          q: "File sumber mendarat jam acak tiap hari. Pola tunggu terbaik?",
          options: [
            { text: "sleep 3600 lalu asumsikan file ada", why: "Tebakan waktu — dosa FinPay." },
            { text: "Sensor: task menunggu berbasis kondisi (file ada?), bukan tebakan waktu", why: "Tepat: menunggu elegan = reaktif terhadap kondisi.", correct: true },
            { text: "Jadwalkan tiap 5 menit selamanya", why: "Boros dan tetap bisa telat/miss." },
            { text: "Minta sumber selalu kirim jam 1 pagi", why: "Tidak realistis mengatur dunia luar." },
          ],
        },
        {
          q: "Rumus T_backfill = ceil(N_task/W) × t_task. N=200, W=5, t=2 menit. T = ?",
          options: [
            { text: "80 menit", why: "Tepat: ceil(200/5)=40 batch × 2 menit.", correct: true },
            { text: "400 menit", why: "Itu tanpa paralelisme (200×2)." },
            { text: "40 menit", why: "Lupa dikali t_task=2 menit." },
            { text: "200 menit", why: "Tidak ada dasarnya." },
          ],
        },
        {
          q: "Pipeline cron: extract 02.00, transform 02.30 (sleep 1800), load 03.00. Extract molor 45 menit suatu hari. Yang terjadi?",
          options: [
            { text: "Transform menunggu otomatis", why: "Cron tidak tahu dependensi — transform jalan 02.30 dengan data setengah. Sleep = harapan, bukan koordinasi." },
            { text: "Transform jalan dengan data tidak lengkap — silent corruption", why: "Tepat: inilah dosa cron+sleep. Tidak ada yang error (job 'sukses'), tetapi datanya salah. Diam-diam salah > berisik gagal.", correct: true },
            { text: "Semua tertunda rapi 45 menit", why: "Cron tidak 'tergeser rapi' — tiap job jalan pada jadwalnya sendiri-sendiri, tidak peduli tetangganya." },
            { text: "Load otomatis retry", why: "Cron tidak punya konsep retry antar-job. Gagal diam-diam = tetap diam." },
          ],
        },
        {
          q: "Backfill 30 hari untuk tabel dengan constraint unik tanggal. Strategi aman?",
          options: [
            { text: "Hapus 30 hari lalu tulis ulang sekaligus", why: "Menghapus 30 hari = jendela tanpa data + risiko gagal di tengah (0 hari tertulis). All-or-nothing yang sembrono." },
            { text: "Tulis per hari dengan upsert/overwrite partisi — idempoten per hari", why: "Tepat: backfill = 30 operasi kecil yang masing-masing idempoten. Gagal di hari ke-17? Ulangi hari ke-17 saja. Inilah 'backfill aman' yang diminta pasar.", correct: true },
            { text: "Insert langsung 30 hari tanpa cek", why: "Tanpa idempotensi, gangguan di tengah = duplikat parsial yang sulit dibersihkan. Backfill tanpa jaring pengaman." },
            { text: "Minta analis hitung manual", why: "Manual 30 hari = 30 peluang salah ketik. Backfill adalah pekerjaan mesin." },
          ],
        },
      ],
    },
  ],
};

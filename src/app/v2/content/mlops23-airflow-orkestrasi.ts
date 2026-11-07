import type { V2Lesson } from "../lib/types";

export const mlops23: V2Lesson = {
  slug: "mlops23-airflow-orkestrasi",
  track: "MLOps",
  module: "Orkestrasi",
  title: "MLOps23 — Orkestrasi dengan Airflow: DAG, Retry & Backfill",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Training yang jalan padahal validasi datanya gagal",
      prose: [
        "Tim ML di bank digital DanaKu menjalankan pipeline training dengan lima skrip cron: extract jam 02.00, validate 02.30, features 03.00, train 03.30, evaluate 05.00. Suatu Selasa, validate gagal karena ada kolom baru yang tidak dikenal — tetapi cron tidak peduli: features jalan di atas data mentah, train melatih model di atas fitur basi, dan evaluate memberi skor bagus pada model yang salah. Model itu di-deploy Rabu pagi. Kamis, tim fraud menemukan skor kreditnya tidak berubah sama sekali selama dua hari.",
        "Akar masalahnya bukan skripnya, melainkan tidak ada yang mengatur urutan dan kegagalan. Cron hanya tahu jam, bukan dependensi. MLOps2 sudah mengajarkan konsepnya: orkestrator mengatur siapa jalan kapan, mengawasi, dan membangunkan yang gagal. Lesson ini memberi orkestrator itu nama dan tangan: Apache Airflow — DAG yang bisa ditulis, diuji, di-retry, dan di-backfill.",
        "Setelah lesson ini kamu bisa: (1) menulis DAG Airflow dengan operator, dependensi, dan XCom yang benar; (2) menghitung anggaran retry dengan exponential backoff dan waktu terburuk sebuah task; (3) merencanakan backfill dan catchup tanpa membanjiri cluster; (4) memutuskan kapan Airflow tepat dan kapan cron masih cukup.",
      ],
      tasks: [],
      note: {
        title: "Hubungan dengan MLOps2 dan MLOps11",
        body: "MLOps2 mengajarkan pipeline dan orkestrasi secara konseptual — Airflow hanya disebut sebagai nama di antara Prefect dan Dagster, tanpa satu baris DAG pun. MLOps11 mengajarkan Kubernetes sebagai tempat menjalankan beban kerja. Lesson ini TIDAK mengulang keduanya: di sini Airflow ditulis sebagai kode, dihitung retry-nya, dan diuji backfill-nya.",
      },
      reference: "Cron tahu jam, bukan dependensi. Airflow = DAG yang bisa ditulis, diuji, di-retry, di-backfill.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menulis dan mengoperasikan DAG Airflow untuk pipeline training ML, dan mempertahankan anggaran waktu serta kebijakan catchup-nya dengan angka.",
        "(1) Menjelaskan anatomi DAG — task, operator, dependensi, schedule, dan XCom — serta apa yang terjadi bila satu task gagal;",
        "(2) Menghitung jadwal retry exponential backoff dan waktu terburuk sebuah task dari durasi dan jumlah retry;",
        "(3) Merencanakan backfill dan catchup: berapa run yang tercipta, berapa lama antreannya, dan kapan mematikannya;",
        "(4) Memilih executor dan mode deployment Airflow dari ukuran tim dan beban, termasuk kapan tidak memakai Airflow sama sekali.",
      ],
      tasks: [],
    },
    {
      id: "anatomi-dag",
      eyebrow: "Langkah 3 · Teori",
      title: "Anatomi DAG: task, operator, dan XCom",
      prose: [
        "DAG, Directed Acyclic Graph, adalah kontrak pipeline yang bisa dibaca mesin: simpul adalah task, panah adalah dependensi, dan tidak boleh ada siklus — task tidak boleh menunggu dirinya sendiri. Satu DAG training yang sehat: extract menarik data, validate memeriksa skema, features membangun fitur, train melatih model, evaluate mengukur, deploy menerbitkan, notify mengabari. Panah extract ke validate berarti validate tidak pernah jalan bila extract gagal — inilah yang hilang di cerita cron DanaKu.",
        "Tiap task memakai operator: PythonOperator menjalankan fungsi Python, BashOperator menjalankan perintah shell, dan ada operator khusus seperti S3 atau BigQuery. Operator yang baik bersifat idempotent — dijalankan dua kali menghasilkan keadaan yang sama. Task train yang menulis model ke path bertanggal adalah idempotent; task yang menambahkan baris ke tabel tanpa kunci bukan — di-run ulang, datanya ganda.",
        "XCom adalah cara task berbagi nilai kecil: validate mengembalikan jumlah baris ke XCom, train membacanya untuk memutuskan lanjut atau berhenti. Aturannya: XCom untuk metadata kecil — jumlah baris, path file, skor — bukan untuk dataset. Dataset lewat storage, bukan lewat XCom; XCom yang membawa dataframe adalah bom memori yang menunggu meledak.",
        "Schedule ditulis sebagai cron atau interval: setiap hari jam 02.00, atau tiap 6 jam. Satu konsep yang membingungkan pemula: Airflow menjadwalkan run berdasarkan AKHIR interval, bukan awal. DAG harian dengan schedule jam 02.00 baru membuat run tanggal kemarin setelah jam 02.00 hari ini lewat — karena interval kemarin baru lengkap saat itu. Salah paham ini membuat orang mengira scheduler-nya terlambat satu hari.",
      ],
      tasks: [],
      note: {
        title: "Sensor: menunggu, bukan polling buta",
        body: "Bila extract harus menunggu file masuk dari vendor, jangan tulis task yang tidur 10 menit lalu cek lagi. Pakai sensor — FileSensor atau S3KeySensor — yang menunggu dengan timeout dan mode reschedule, sehingga slot worker tidak diblokir selama menunggu. Sensor dengan mode poke memblokir slot; mode reschedule membebaskannya.",
      },
      reference: "DAG = kontrak: task, panah dependensi, tanpa siklus. XCom = metadata kecil, bukan dataset.",
    },
    {
      id: "retry-backoff",
      eyebrow: "Langkah 4 · Teori",
      title: "Retry, backoff, dan waktu terburuk",
      prose: [
        "Task yang gagal karena sebab sementara — jaringan putus sedetik, database sibuk — tidak seharusnya membangunkan manusia. Retry menanganinya: retries 3 berarti tiga percobaan ulang setelah kegagalan pertama. Tetapi retry tanpa jeda adalah serangan DDoS ke sistemmu sendiri: lima task gagal yang retry serentak tiap detik akan menenggelamkan database yang baru saja pulih.",
        "Exponential backoff memberi jeda yang membesar: 60 detik, lalu 120, lalu 240 — total 420 detik jeda untuk tiga retry. Rumusnya: jeda ke-i adalah basis dikali faktor pangkat i. Dengan basis 60 detik dan faktor 2, tiga retry berarti 60, 120, 240 detik. Waktu terburuk sebuah task menjadi mudah dihitung: empat kali percobaan dikali 300 detik durasi, ditambah 420 detik jeda, sama dengan 1.620 detik alias 27 menit. Angka inilah yang masuk ke SLA — bukan durasi suksesnya.",
        "Dua aturan keras. Pertama, retry hanya untuk kegagalan sementara: kegagalan karena skema berubah atau kredensial kedaluwarsa tidak akan sembuh dengan menunggu — retry hanya menunda vonis dan menghabiskan slot. Kedua, pasang retry_delay dan max_retry_delay: tanpa batas atas, backoff eksponensial bisa menjeda berjam-jam dan membuat DAG macet diam-diam melewati SLA.",
        "Untuk kegagalan yang butuh manusia, Airflow punya on_failure_callback: kirim alert ke Slack atau PagerDuty dengan konteks task dan log-nya. Alert tanpa konteks — hanya 'DAG gagal' — sama tidak bergunanya dengan tidak ada alert.",
      ],
      tasks: [],
      formula: String.raw`t_{\text{terburuk}} = (r + 1) \times t_{\text{jalan}} + \sum_{i=0}^{r-1} b \times f^{i}`,
      formulaNote: "t_terburuk = waktu terburuk satu task. r = jumlah retry, t_jalan = durasi satu percobaan, b = basis jeda, f = faktor backoff. Contoh lab: r=3, t_jalan=300 detik, b=60, f=2, maka 4 x 300 + (60 + 120 + 240) = 1.620 detik = 27 menit.",
      reference: "Retry = untuk gagal sementara. Backoff = jeda membesar. Waktu terburuk masuk SLA, bukan durasi sukses.",
    },
    {
      id: "backfill-eksekutor",
      eyebrow: "Langkah 5 · Teori",
      title: "Backfill, catchup, dan executor",
      prose: [
        "Backfill adalah menjalankan ulang DAG untuk tanggal-tanggal yang terlewat — misalnya setelah dua hari libur, atau setelah memperbaiki bug fitur. Airflow CLI melakukannya dengan satu perintah: airflow dags backfill dengan tanggal mulai dan akhir. Tujuh hari yang terlewat berarti tujuh run. Bila tiap run memakan waktu terburuk 27 menit dan catchup berjalan berurutan, antreannya 189 menit — lebih dari tiga jam. Tanpa max_active_runs, ketujuh run itu berebut slot worker dan menenggelamkan run harian yang baru.",
        "Catchup adalah sepupunya yang otomatis: bila DAG dimatikan seminggu lalu dinyalakan lagi, Airflow membuat run untuk setiap interval yang terlewat — kecuali catchup dimatikan. Aturan praktis: untuk pipeline training harian, matikan catchup bila data lama sudah tidak relevan — model hari ini tidak butuh training ulang tujuh kali untuk minggu lalu. Nyalakan catchup hanya bila tiap tanggal wajib punya artefak — misalnya laporan harian untuk regulator.",
        "Executor menentukan di mana task berjalan. SequentialExecutor menjalankan satu task dalam satu proses — cukup untuk belajar, tidak untuk produksi. CeleryExecutor menyebar task ke worker — standar produksi bertahun-tahun. KubernetesExecutor membuat satu pod per task — isolasi dependensi per task, tetapi butuh cluster Kubernetes yang dirawat, seperti di MLOps11. Bila timmu tiga orang tanpa tim platform, jawaban yang jujur adalah managed Airflow — Cloud Composer atau MWAA — bayar untuk tidak mengurus server Airflow sendiri.",
        "Dan kapan TIDAK memakai Airflow: satu skrip, satu jadwal, tanpa dependensi — cron plus logging cukup, seperti kata MLOps2. Airflow adalah server, database metadata, scheduler, dan webserver: empat hal yang harus dirawat. Jangan membayarnya sebelum merasakan sakitnya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: backfill = menjalankan ulang dengan data hari ini",
        body: "Backfill menjalankan DAG dengan tanggal logis masing-masing run — task extract tanggal 3 November menarik data 3 November, bukan data hari ini. Bila task-mu memakai tanggal hari ini dari jam sistem, bukan dari tanggal logis DAG, backfill-mu menghasilkan tujuh salinan data yang sama. Selalu pakai tanggal logis dari konteks Airflow.",
      },
      reference: "Backfill 7 hari = 7 run. Catchup mati bila data lama tak relevan. Executor = tempat task berjalan.",
    },
    {
      id: "lab-dag",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: urutan topologi, backoff, dan antrean backfill",
      prose: [
        "Sekarang simulasikan scheduler-nya dengan Python murni. DAG training DanaKu: extract, lalu validate, lalu features, lalu train, lalu evaluate, lalu dua cabang — deploy dan notify. Urutan topologi dengan algoritma Kahn: mulai dari task tanpa dependensi, keluarkan satu per satu, bebaskan task yang dependensinya sudah terpenuhi. Hasilnya: extract, validate, features, train, evaluate, deploy, notify.",
        "Retry task train: basis 60 detik, faktor 2, tiga retry — jedanya 60, 120, 240 detik, total 420 detik. Durasi satu percobaan 300 detik. Waktu terburuk: empat percobaan dikali 300 detik ditambah 420 detik jeda, sama dengan 1.620 detik alias 27 menit. Inilah angka yang masuk SLA, bukan 5 menit durasi suksesnya.",
        "Backfill tujuh hari yang terlewat berarti tujuh run. Bila catchup berjalan berurutan dan tiap run memakan waktu terburuk 27 menit, antreannya 189 menit — lebih dari tiga jam. Tanpa max_active_runs, ketujuh run itu berebut slot worker dan menenggelamkan run harian yang baru. Hitung ketiganya di lab, dan kamu tidak akan pernah lagi menulis SLA dari durasi sukses.",
        "Setelah lolos, coba eksperimen: ubah retries menjadi 5 dan lihat waktu terburuk melonjak — jedanya menjadi 60, 120, 240, 480, 960 detik, total 1.860 detik jeda saja. Retry murah di tulisan, mahal di antrean.",
      ],
      tasks: [
        { id: "t1", text: "Tulis urutan topologi DAG training dengan algoritma Kahn" },
        { id: "t2", text: "Hitung jadwal backoff 60 detik, faktor 2, tiga retry, dan waktu terburuk task 300 detik" },
        { id: "t3", text: "Hitung antrean backfill tujuh hari bila tiap run memakan waktu terburuk" },
      ],
      expected: "terburuk=27 menit",
      hints: [
        "Kahn: antrean awal berisi task tanpa dependensi; tiap task yang dikeluarkan membebaskan tetangganya.",
        "Jeda retry ke-i = 60 dikali 2 pangkat i, untuk i = 0, 1, 2.",
        "Waktu terburuk = 4 x 300 + (60 + 120 + 240) = 1.620 detik; bagi 60 menjadi menit.",
      ],
      code: {
        starter: `# DAG training: panah A ke B berarti B menunggu A selesai.\ndag = {\n    "extract": [],\n    "validate": ["extract"],\n    "features": ["validate"],\n    "train": ["features"],\n    "evaluate": ["train"],\n    "deploy": ["evaluate"],\n    "notify": ["evaluate"],\n}\n\n# TULIS KODEMU: (1) urutan topologi Kahn; (2) backoff 60 detik faktor 2, 3 retry;\n# (3) waktu terburuk task 300 detik; (4) antrean backfill 7 hari.\n\nurutan = []\nbackoff = []\nterburuk = 0\nbackfill = 0\n\nprint("urutan=" + ", ".join(urutan))\nprint("backoff=" + ", ".join(str(v) for v in backoff) + " detik")\nprint(f"terburuk={terburuk} menit")\nprint(f"backfill={backfill} menit")`,
        lockLines: 10,
        solution: `# DAG training: panah A ke B berarti B menunggu A selesai.\ndag = {\n    "extract": [],\n    "validate": ["extract"],\n    "features": ["validate"],\n    "train": ["features"],\n    "evaluate": ["train"],\n    "deploy": ["evaluate"],\n    "notify": ["evaluate"],\n}\n\n\ndef topo(dag):\n    masuk = {}\n    for task in dag:\n        masuk[task] = len(dag[task])\n    siap = [t for t in dag if masuk[t] == 0]\n    hasil = []\n    while siap:\n        kini = siap.pop(0)\n        hasil.append(kini)\n        for task in dag:\n            if kini in dag[task]:\n                masuk[task] -= 1\n                if masuk[task] == 0:\n                    siap.append(task)\n    return hasil\n\n\nurutan = topo(dag)\nbackoff = [60 * (2 ** i) for i in range(3)]\nterburuk = (4 * 300 + sum(backoff)) // 60\nbackfill = 7 * terburuk\n\nprint("urutan=" + ", ".join(urutan))\nprint("backoff=" + ", ".join(str(v) for v in backoff) + " detik")\nprint(f"terburuk={terburuk} menit")\nprint(f"backfill={backfill} menit")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "urutan=extract, validate, features, train, evaluate, deploy, notify\\nbackoff=60, 120, 240 detik\\nterburuk=27 menit\\nbackfill=189 menit", label: "Urutan, backoff, waktu terburuk, dan antrean backfill sesuai hitungan", msg: "Urutan: extract, validate, features, train, evaluate, deploy, notify. Backoff: 60, 120, 240. Terburuk 27 menit. Backfill 189 menit." },
          { kind: "equal", task: "t2", name: "terburuk", value: 27, tol: 0.01, label: "`terburuk` = 27 menit", msg: "4 x 300 + (60 + 120 + 240) = 1.620 detik = 27 menit." },
          { kind: "equal", task: "t3", name: "backfill", value: 189, tol: 0.01, label: "`backfill` = 189 menit", msg: "7 run dikali 27 menit = 189 menit antrean." },
          { kind: "uses", task: "t1", token: "topo", label: "Fungsi urutan topologi dipakai", msg: "Implementasikan Kahn: bebaskan task yang dependensinya sudah terpenuhi — panggil topo pada DAG." },
        ],
      },
      reference: "Urutan: extract, validate, features, train, evaluate, deploy, notify. Terburuk 27 menit. Backfill 189 menit.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: SLA 60 menit dan antrean backfill yang menenggelamkan run harian",
      prose: [
        "DanaKu menetapkan SLA 60 menit untuk pipeline training harian. Durasi sukses p95-nya 42 menit — headroom 18 menit. Tetapi waktu terburuk satu task train adalah 27 menit, dan pipeline punya enam task berurutan. Bila dua task mengalami retry penuh di hari yang sama, totalnya bisa melewati 60 menit — SLA yang ditulis dari durasi sukses adalah janji yang tidak bisa ditepati di hari buruk.",
        "Keputusan pertama: SLA ditulis ulang dari waktu terburuk, bukan dari p95 sukses. Bila waktu terburuk pipeline melebihi 60 menit, pilihannya adalah menambah worker, memecah task train yang 300 detik itu, atau menerima SLA 90 menit dengan jujur. Memalsukan SLA lebih mahal daripada mengakuinya: tim yang dibangunkan tengah malam karena SLA mustahil akan berhenti percaya pada alert.",
        "Keputusan kedua: backfill tujuh hari — 189 menit antrean — dijadwalkan di akhir pekan dengan max_active_runs 2, supaya run harian Senin pagi tidak tertahan di belakang antrean. Catchup dimatikan untuk pipeline ini: model hari ini tidak butuh training ulang tujuh kali untuk minggu lalu. Satu-satunya yang di-backfill adalah laporan evaluate untuk regulator, bukan training-nya.",
        "Keputusan ketiga: task validate yang gagal karena skema berubah diberi retries 0 — kegagalan skema tidak sembuh dengan menunggu. Retry hanya untuk extract dan train yang gagal karena jaringan dan database sibuk.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "SLA 60 menit vs p95 42 menit menyisakan headroom 18 menit — tetapi waktu terburuk task 27 menit membuat SLA dari durasi sukses tidak bisa ditepati di hari buruk. Backfill 189 menit dijadwalkan akhir pekan dengan max_active_runs 2; catchup dimatikan; retries 0 untuk gagal skema.",
      },
      reference: "SLA dari waktu terburuk, bukan p95 sukses. Backfill akhir pekan, max_active_runs 2.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "DAG = kontrak: task, panah dependensi, tanpa siklus; XCom untuk metadata kecil, bukan dataset.",
        "Retry hanya untuk gagal sementara; backoff 60, 120, 240 detik; waktu terburuk task 27 menit.",
        "Backfill 7 hari = 7 run = antrean 189 menit; catchup dimatikan bila data lama tak relevan.",
        "Executor: Sequential untuk belajar, Celery standar produksi, Kubernetes untuk isolasi per task.",
        "Satu skrip tanpa dependensi tetap cron — jangan membayar Airflow sebelum merasakan sakitnya.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Di cerita DanaKu, kenapa model yang salah bisa sampai di-deploy?",
          options: [
            { text: "Karena modelnya dilatih dengan algoritma yang salah", why: "Salah: algoritmanya tidak disalahkan dalam cerita. Yang gagal adalah orkestrasi — tidak ada yang menghentikan rantai saat validate gagal." },
            { text: "Karena cron hanya tahu jam, bukan dependensi — train jalan walau validate gagal", why: "Tepat: tanpa DAG, tidak ada yang mencegah task downstream jalan di atas output yang gagal.", correct: true },
            { text: "Karena evaluate memberi skor yang salah", why: "Salah: evaluate memberi skor bagus pada model yang salah — skornya benar untuk data yang ia lihat, datanya yang basi." },
            { text: "Karena tidak ada monitoring model di produksi", why: "Salah: monitoring ada — tim fraud yang menemukan skor tidak berubah. Masalahnya adalah rantai yang tidak berhenti saat gagal." },
          ],
        },
        {
          q: "Task train durasi 300 detik, retries 3, backoff basis 60 detik faktor 2. Berapa waktu terburuknya?",
          options: [
            { text: "5 menit — durasi satu percobaan yang sukses", why: "Salah: itu durasi sukses, bukan terburuk. SLA dari angka ini tidak bisa ditepati di hari buruk." },
            { text: "15 menit — tiga percobaan dikali 5 menit", why: "Salah: retries 3 berarti total empat percobaan, dan jeda backoff belum dihitung." },
            { text: "27 menit — 4 kali 300 detik ditambah jeda 60, 120, 240 detik", why: "Tepat: 1.200 + 420 = 1.620 detik = 27 menit.", correct: true },
            { text: "32 menit — empat percobaan ditambah jeda 60 detik tiga kali", why: "Salah: jedanya membesar secara eksponensial — 60, 120, 240 — bukan 60 tiga kali." },
          ],
        },
        {
          q: "Task validate gagal karena ada kolom baru yang tidak dikenal. Berapa retries yang tepat?",
          options: [
            { text: "3 — semua task harus punya retries 3", why: "Salah: retry hanya menyembuhkan gagal sementara. Skema berubah tidak sembuh dengan menunggu." },
            { text: "0 — kegagalan skema tidak sembuh dengan menunggu; yang dibutuhkan alert dan manusia", why: "Tepat: retry di sini hanya menunda vonis dan menghabiskan slot worker.", correct: true },
            { text: "10 — makin banyak retry makin besar peluang sembuh", why: "Salah: peluang sembuh dari skema yang berubah adalah nol, berapa pun retry-nya. Retry bukan doa." },
            { text: "1 — satu retry cukup untuk memastikan", why: "Salah: satu retry tetap membuang 5 menit plus jeda untuk kegagalan yang deterministik. Langsung gagal berisik lebih baik." },
          ],
        },
        {
          q: "DAG harian dijadwalkan jam 02.00. Kapan run untuk tanggal kemarin dibuat?",
          options: [
            { text: "Jam 02.00 tanggal kemarin — di awal interval", why: "Salah: Airflow menjadwalkan run di akhir interval, bukan awal. Interval kemarin baru lengkap setelah jam 02.00 hari ini." },
            { text: "Setelah jam 02.00 hari ini — saat interval kemarin lengkap", why: "Tepat: inilah yang membuat pemula mengira scheduler terlambat satu hari.", correct: true },
            { text: "Jam 02.00 lusa — scheduler selalu tertinggal dua hari", why: "Salah: keterlambatannya satu interval, bukan dua hari." },
            { text: "Bersamaan dengan run hari ini — keduanya dibuat sekaligus", why: "Salah: tiap interval punya run-nya sendiri, dibuat saat intervalnya lengkap." },
          ],
        },
        {
          q: "Kapan catchup sebaiknya dimatikan?",
          options: [
            { text: "Selalu — catchup tidak pernah berguna", why: "Salah: catchup wajib menyala bila tiap tanggal harus punya artefak, misalnya laporan harian untuk regulator." },
            { text: "Bila data lama sudah tidak relevan — model hari ini tidak butuh training ulang tujuh kali untuk minggu lalu", why: "Tepat: backfill tujuh run untuk training yang sudah basi hanya membanjiri antrean.", correct: true },
            { text: "Bila DAG-nya berjalan setiap jam", why: "Salah: frekuensi bukan penentunya. Penentunya adalah apakah artefak tiap interval masih dibutuhkan." },
            { text: "Bila memakai KubernetesExecutor", why: "Salah: executor menentukan tempat task berjalan, bukan kebijakan catchup." },
          ],
        },
      ],
    },
  ],
};

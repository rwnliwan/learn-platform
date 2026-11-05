import type { V2Lesson } from "../lib/types";

// Bin packing: 3 node (4 CPU / 16 GB), 6 job; j6 (3 CPU/14 GB) tidak muat di sisa mana pun.
const BINPACK_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Bin packing: enam job ke tiga node, j6 tertunda.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<text x="90" y="28" fill="var(--text)">node 0</text>
<text x="230" y="28" fill="var(--text)">node 1</text>
<text x="370" y="28" fill="var(--text)">node 2</text>
<rect x="40" y="45" width="100" height="18" fill="var(--c2)" fill-opacity="0.25"/>
<rect x="40" y="45" width="88" height="18" fill="var(--c1)" fill-opacity="0.85"/>
<rect x="180" y="45" width="100" height="18" fill="var(--c2)" fill-opacity="0.25"/>
<rect x="180" y="45" width="75" height="18" fill="var(--c1)" fill-opacity="0.85"/>
<rect x="320" y="45" width="100" height="18" fill="var(--c2)" fill-opacity="0.25"/>
<rect x="320" y="45" width="50" height="18" fill="var(--c1)" fill-opacity="0.85"/>
<text x="90" y="80" fill="var(--chart-text)" font-size="10">3,5 / 4 CPU</text>
<text x="230" y="80" fill="var(--chart-text)" font-size="10">3 / 4 CPU</text>
<text x="370" y="80" fill="var(--chart-text)" font-size="10">2 / 4 CPU</text>
<rect x="40" y="105" width="100" height="18" fill="var(--c2)" fill-opacity="0.25"/>
<rect x="40" y="105" width="88" height="18" fill="var(--c3)" fill-opacity="0.85"/>
<rect x="180" y="105" width="100" height="18" fill="var(--c2)" fill-opacity="0.25"/>
<rect x="180" y="105" width="75" height="18" fill="var(--c3)" fill-opacity="0.85"/>
<rect x="320" y="105" width="100" height="18" fill="var(--c2)" fill-opacity="0.25"/>
<rect x="320" y="105" width="63" height="18" fill="var(--c3)" fill-opacity="0.85"/>
<text x="90" y="140" fill="var(--chart-text)" font-size="10">14 / 16 GB</text>
<text x="230" y="140" fill="var(--chart-text)" font-size="10">12 / 16 GB</text>
<text x="370" y="140" fill="var(--chart-text)" font-size="10">10 / 16 GB</text>
<rect x="450" y="45" width="90" height="96" rx="6" fill="none" stroke="var(--c1)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="495" y="85" fill="var(--c1)" font-size="12">j6</text>
<text x="495" y="105" fill="var(--chart-text)" font-size="10">3 CPU / 14 GB</text>
<text x="495" y="122" fill="var(--c1)" font-size="10">PENDING</text>
<text x="90" y="170" fill="var(--chart-text)" font-size="10">j1, j2, j3</text>
<text x="230" y="170" fill="var(--chart-text)" font-size="10">j4</text>
<text x="370" y="170" fill="var(--chart-text)" font-size="10">j5</text>
</g>
<text x="280" y="205" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">first-fit: j6 butuh 3 CPU/14 GB, sisa terbesar hanya 2 CPU/6 GB</text>
<text x="280" y="225" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">node 0 jenuh (sisa di bawah ambang) — waktunya tambah node atau kecilkan job</text>
</svg>`;

export const de28: V2Lesson = {
  slug: "de28-kubernetes-data",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE28 — Kubernetes untuk Workload Data",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Job 4 jam yang mati di menit ke-237",
      prose: [
        "Maret 2026. NusantaraPay memindahkan job rekonsiliasi harian — Spark, 4 jam, 800 GB — dari VM tua ke cluster Kubernetes baru yang dibanggakan tim platform. Malam pertama: job mati di menit ke-237 dengan status `OOMKilled`. Diulang. Mati lagi di menit ke-241. Tim platform menaikkan memori node; job tetap mati di titik yang sama.",
        "Akar masalahnya ditemukan di file YAML yang ditulis sore itu: `requests: {cpu: 2, memory: 8Gi}` dan `limits: {cpu: 2, memory: 8Gi}` — disalin dari laptop developer. Di menit ke-237, fase shuffle butuh 11 GB. Limit 8 GB = algojo yang mengeksekusi tepat waktu, setiap waktu. Cluster-nya punya 200 GB menganggur; yang membunuh job bukan kekurangan kapasitas, melainkan ANGKA DI KERTAS yang salah.",
        "Twist keduanya datang seminggu kemudian, dari arah berlawanan. Setelah YAML diperbaiki (request dari p50, limit dari p99 × 1,2) dan job stabil, CTO bertanya: 'Tim kita 4 orang, cron job kita 5 buah — kenapa kita memelihara cluster $800/bulan yang butuh satu orang setengah waktu untuk merawatnya?' Tidak ada yang bisa menjawab dengan angka. Lesson ini tentang dua sisi mata uang yang sama: cara menjalankan workload data di Kubernetes dengan BENAR — dan kapan Kubernetes adalah jawaban yang SALAH.",
      ],
      tasks: [],
      reference: "K8s untuk data = Job/CronJob + request/limit yang diukur + tahu kapan tidak perlu K8s.",
    },
    {
      id: "job-cronjob",
      eyebrow: "Langkah 2 · Konsep",
      title: "Job & CronJob: Si Pekerja Lepas",
      prose: [
        "Di Kubernetes ada dua jenis warga: yang MENETAP dan yang LEPAS. Deployment adalah Si Penjaga Toko — hidup terus, di-restart bila mati, melayani trafik. Job adalah Si Pekerja Lepas — datang, mengerjakan satu tugas sampai selesai, lalu pulang (pod-nya selesai dan tidak dihidupkan lagi). Pipeline data batch = pekerjaan lepas, bukan penjaga toko.",
        "Job menjamin SEMANTIK SELESAI: Kubernetes me-restart pod yang gagal sampai `completions` tercapai atau `backoffLimit` habis. ETL yang mati di tengah karena OOM masih bisa sukses pada percobaan ke-3 — tanpa cron eksternal, tanpa operator begadang. CronJob = Job + jadwal cron: `0 2 * * *` untuk rekonsiliasi jam 2 pagi, dengan `concurrencyPolicy: Forbid` agar run kemarin yang telat tidak tumpang tindih dengan run hari ini.",
        "Tiga field yang paling sering salah. `restartPolicy: OnFailure` (bukan Always — Job yang Always = loop abadi). `activeDeadlineSeconds`: bunuh job yang menggantung lebih dari X detik — tanpa ini, job macet = pod zombie selamanya. `ttlSecondsAfterFinished`: bersihkan pod selesai setelah N detik — tanpa ini, 365 run × N pod = kuburan pod di etcd.",
        "💡 Intuisi: kalau workload-mu `berakhir`, pakai Job. Kalau `tidak pernah berakhir`, pakai Deployment. Menjalankan ETL batch sebagai Deployment = mempekerjakan penjaga toko untuk pekerjaan kuli panggul — ia tidak pulang-pulang dan memakan gaji (resource) 24 jam.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: CronJob K8s = cron Linux yang lebih canggih",
        type: "pitfall",
        body: "CronJob K8s punya perilaku yang mengejutkan pengguna cron: ia bisa MELEWATKAN jadwal bila controller down lebih dari 100 detik (startingDeadlineSeconds), dan dua run BISA tumpang tindih kecuali concurrencyPolicy diset. Jangan migrasikan cron begitu saja — baca dulu tiga field di atas, atau jadwal pertamamu akan menjadi insiden pertamamu.",
      },
      reference: "Batch = Job/CronJob. restartPolicy OnFailure, activeDeadlineSeconds, ttlSecondsAfterFinished, concurrencyPolicy.",
    },
    {
      id: "request-limit",
      eyebrow: "Langkah 3 · Konsep",
      title: "Request vs Limit: Si Janji dan Si Atasan",
      prose: [
        "Request adalah JANJI ke scheduler: 'job ini butuh segini'. Scheduler memakai janji itu untuk bin packing — menaruh pod ke node yang muat. Limit adalah ATASAN yang galak: 'lewat segini, kamu saya bunuh' — kernel OOM killer mengeksekusi pod yang melewati limit memorinya, tanpa negosiasi, tanpa peringatan.",
        "Keduanya menjawab pertanyaan berbeda. Request menjawab 'di node mana pod ini boleh tinggal' (scheduling). Limit menjawab 'kapan pod ini dieksekusi' (enforcement). Tragedi NusantaraPay: request = limit = 8 GB. Scheduler menaruh pod di node yang 'muat' 8 GB, lalu atasan membunuhnya saat butuh 11 GB — sistem bekerja persis seperti yang ditulis, dan yang ditulis salah.",
        "Aturan praktis yang waras: request = p50 pemakaian historis (agar bin packing efisien), limit = p99 × 1,2 (ruang untuk spike shuffle). Untuk CPU, limit boleh longgar (CPU adalah resource compressible — throttling hanya melambatkan). Untuk MEMORY, limit adalah garis hidup-mati (memory incompressible — lewat = mati). Inilah kenapa OOMKilled adalah error K8s paling populer di tim data: workload data punya spike memori yang tajam.",
        "Cara membaca rumus: utilisasi terjadwal = total janji dibagi kapasitas. Di atas 100% = overcommit (boleh untuk CPU, berbahaya untuk memory). Di bawah 50% = kamu membayar node yang menganggur.",
        "Interpretasi: angka request yang terlalu BESAR = pod Pending selamanya (tidak ada node yang 'muat'); terlalu KECIL = pod terusir saat node penuh. Keduanya adalah bug konfigurasi, bukan bug Kubernetes.",
      ],
      formula: String.raw`U = \frac{\sum r_i}{C}`,
      formulaNote: "U = utilisasi terjadwal (fraksi); r_i = request tiap pod yang dijadwalkan di node itu; C = kapasitas node. Contoh lab: node 4 CPU menampung j1+j2+j3 (1 + 2 + 0,5 = 3,5) → U = 3,5/4 = 0,875. Interpretasi: 87,5% janji terpakai — sehat; di atas 1,0 = overcommit.",
      tasks: [],
      note: {
        title: "🚨 Mitos: limit = request yang disalin-tempel",
        type: "pitfall",
        body: "Menyalin request ke limit 'agar aman' justru menciptakan OOMKilled pada spike pertama — seperti cerita ini. Limit harus diukur dari PUNCAK historis (p99), bukan dari rata-rata. Kalau tidak punya histori, jalankan dulu TANPA limit (atau limit longgar) seminggu, ukur, baru kunci angkanya.",
      },
      reference: "Request = p50 (scheduling). Limit = p99 × 1,2 (hukum). CPU compressible, memory tidak.",
    },
    {
      id: "operator",
      eyebrow: "Langkah 4 · Konsep",
      title: "Operator: Si Mandor",
      prose: [
        "Job mentah cukup untuk skrip Python. Untuk Spark, Airflow, atau Kafka, kamu butuh MANDOR — operator: controller K8s yang paham aplikasi spesifik. Spark operator tahu bahwa satu 'aplikasi Spark' = 1 driver + N executor, dan ia mengelola siklus hidup semuanya sebagai satu kesatuan (bukan 11 pod yang tidak saling kenal).",
        "Dua pola menjalankan Airflow di K8s. Pola 1 — KubernetesPodOperator: Airflow-nya di luar (atau scheduler saja di K8s), tiap task = pod terisolasi dengan resource-nya sendiri. Cocok untuk tim yang sudah punya Airflow: isolasi dependensi per task tanpa satu image raksasa. Pola 2 — Airflow penuh di K8s (via Helm chart resmi): scheduler, webserver, worker semua sebagai deployment. Cocok bila K8s adalah rumah utamamu.",
        "Kapan operator WAJIB dipertimbangkan: workload stateful/distributed yang butuh koordinasi (Spark butuh driver-executor discovery; database butuh failover). Kapan operator BERLEBIHAN: skrip Python 200 baris yang jalan 10 menit — CronJob mentah + image Python cukup; operator Spark untuk ini = mempekerjakan mandor untuk mengawasi satu kuli.",
        "💡 Intuisi: operator = pengetahuan operasional yang dikodekan. Tanpa operator, pengetahuan 'cara menjalankan Spark dengan benar' tinggal di kepala satu senior engineer. Dengan operator, ia tinggal di YAML yang bisa dibaca semua orang — termasuk penggantimu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: semua workload data butuh operator",
        type: "pitfall",
        body: "Operator menambah lapisan yang harus dipelajari, di-upgrade, dan di-debug (CRD, RBAC, versi operator vs versi aplikasi). Untuk ETL sederhana, CronJob + image Python seringkali menang telak dalam total biaya kepemilikan. Aturannya: mulai dari yang paling sederhana yang berhasil; naik ke operator saat rasa sakitnya nyata (koordinasi manual, restart berantakan), bukan saat hype-nya nyata.",
      },
      reference: "Operator = pengetahuan operasional terkodekan. Pakai saat koordinasi terdistribusi sakit; hindari untuk skrip sederhana.",
    },
    {
      id: "kapan-berlebihan",
      eyebrow: "Langkah 5 · Konsep",
      title: "Kapan K8s berlebihan: Si Traktor di Kebun Cabai",
      prose: [
        "Kubernetes adalah traktor: luar biasa untuk ladang 100 hektar, konyol untuk kebun cabai 10 meter persegi. Pertanyaan CTO di cerita tadi layak dijawab dengan angka: cluster 3 node × $270 = $810/bulan + ~0,5 FTE untuk merawat (upgrade, RBAC, monitoring cluster itu sendiri). Lima cron job yang total jalan 6 jam/hari = utilisasi < 10%. Alternatif: satu VM 8 CPU/32 GB seharga $90/bulan + systemd timer — atau Cloud Run / Fargate yang dibayar per detik.",
        "Aturan jempolnya: K8s MULAI masuk akal saat (1) > 20 workload terjadwal dengan pola resource berbeda-beda, ATAU (2) butuh isolasi/kuota antar tim, ATAU (3) workload-nya memang cloud-native (Spark operator, serving autoscale). Di bawah itu, managed (Cloud Composer, Fargate, Cloud Run Jobs) hampir selalu menang dalam total biaya — ingat, gajimu juga biaya.",
        "Jebakan psikologisnya: K8s terlihat 'serius' dan 'skalabel' di CV. Tapi arsitektur yang tepat untuk tim 4 orang dengan 5 cron job BUKAN arsitektur yang membuatmu terlihat pintar — melainkan yang membuatmu tidur nyenyak. Traktor tidak membuatmu petani yang lebih baik bila ladangmu sepetak.",
        "Cara membaca diagram: tiga batang node menunjukkan porsi CPU/RAM yang terpakai setelah penjadwalan first-fit — node 0 hampir penuh (jenuh), node 1-2 longgar, dan j6 (3 CPU/14 GB) tidak muat di sisa mana pun sehingga PENDING. Inilah cara scheduler berpikir setiap detik.",
        "Interpretasi: Pending BUKAN OOMKilled. Pending = 'tidak ada kamar' (tambah node / kecilkan request); OOMKilled = 'diusir dari kamar' (naikkan limit / turunkan pemakaian puncak). Mendiagnosis yang salah = memperbaiki yang salah.",
      ],
      figure: {
        svg: BINPACK_SVG,
        alt: "Bin packing: enam job ke tiga node, j6 tertunda karena tidak muat.",
        caption: "First-fit scheduling: j1–j3 ke node 0, j4 ke node 1, j5 ke node 2; j6 (3 CPU/14 GB) PENDING — sisa terbesar hanya 2 CPU/6 GB.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: K8s = gratis karena open source",
        type: "pitfall",
        body: "Lisensinya gratis; OPERASIONALNYA tidak. Upgrade cluster, CVE patching, RBAC audit, monitoring untuk monitoring — semua memakan jam engineer. Untuk tim kecil, 'gratis' ini seringkali lebih mahal dari layanan managed $200/bulan. Hitung TCO (total cost of ownership) termasuk gajimu sebelum memutuskan.",
      },
      reference: "K8s masuk akal: >20 workload, butuh isolasi antar tim, atau workload cloud-native. Selain itu: managed/VM.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: jadi scheduler sehari",
      prose: [
        "Waktunya duduk di kursi scheduler Kubernetes. Lab ini mensimulasikan 3 node (masing-masing 4 CPU / 16 GB RAM) dan 6 job dengan request berbeda. Kamu akan mengimplementasikan logika first-fit persis seperti yang dilakukan kube-scheduler: job ditempatkan di node PERTAMA yang muat.",
        "Perhatikan j6: ia butuh 3 CPU dan 14 GB — setelah j1–j5 ditempatkan, tidak ada node yang sisa kapasitasnya cukup. Statusnya PENDING: bukan error, melainkan sinyal 'tambah node atau kecilkan request'. Inilah bedanya dengan OOMKilled di cerita: Pending = tidak dapat kamar; OOMKilled = diusir dari kamar.",
        "Cara membaca output: baris pertama = pasangan (job, node); baris kedua = job yang tertunda; baris ketiga = node yang jenuh (sisa di bawah ambang 1 CPU / 4 GB) — kandidat untuk ditambah kapasitasnya.",
        "Interpretasi: node 0 jenuh setelah menampung 3 job kecil — inilah kenapa bin packing first-fit bisa timpang: ia mengisi node 0 sampai penuh sebelum menyentuh node 1. Scheduler asli memakai scoring yang lebih halus, tetapi prinsipnya sama.",
      ],
      formula: String.raw`\text{muat} \iff (cpu_{sisa} \ge cpu_{job}) \land (ram_{sisa} \ge ram_{job})`,
      formulaNote: "Syarat penempatan: sisa CPU node harus ≥ request CPU job DAN sisa RAM ≥ request RAM job — keduanya harus terpenuhi (AND). Contoh: j4 (3 CPU/12 GB) tidak muat di node 0 (sisa 0,5/2) tetapi muat di node 1 (sisa 4/16).",
      tasks: [
        { id: "t1", text: "Lengkapi `cocok` — True bila job muat di sisa node (kedua resource harus cukup)" },
        { id: "t2", text: "Lengkapi loop first-fit di `jadwalkan` — job ke node pertama yang cocok, sisanya ke `tertunda`" },
        { id: "t3", text: "Lengkapi `node_jenuh` — node dengan sisa cpu < 1 ATAU sisa ram < 4" },
      ],
      expected: "terjadwal: [['j1', 0], ['j2', 0], ['j3', 0], ['j4', 1], ['j5', 2]]\ntertunda: ['j6']\nnode jenuh: [0]",
      note: {
        title: "Sering salah",
        body: "Memakai OR alih-alih AND di fungsi cocok ('cpu cukup ATAU ram cukup'). Pod butuh KEDUANYA — node dengan 100 CPU bebas tetapi 0 GB RAM bebas tetap tidak bisa menampung job 1 GB. Inilah kenapa OOMKilled sering menimpa pod di node yang 'CPU-nya masih longgar'.",
      },
      hints: [
        "cocok: return sisa_cpu >= job['cpu'] and sisa_ram >= job['ram'].",
        "jadwalkan: untuk tiap job, loop node 0..2; bila cocok → catat [nama, i], kurangi sisa, break; bila tidak ada yang cocok → tertunda.",
        "node_jenuh: [i for i, (c, r) in enumerate(sisa) if c < 1.0 or r < 4.0].",
      ],
      code: {
        starter: `# Cluster: 3 node @ 4 CPU / 16 GB RAM\n` +
`node = [\n` +
`    {"cpu": 4.0, "ram": 16.0},\n` +
`    {"cpu": 4.0, "ram": 16.0},\n` +
`    {"cpu": 4.0, "ram": 16.0},\n` +
`]\n` +
`jobs = [\n` +
`    {"nama": "j1", "cpu": 1.0, "ram": 4.0},\n` +
`    {"nama": "j2", "cpu": 2.0, "ram": 8.0},\n` +
`    {"nama": "j3", "cpu": 0.5, "ram": 2.0},\n` +
`    {"nama": "j4", "cpu": 3.0, "ram": 12.0},\n` +
`    {"nama": "j5", "cpu": 2.0, "ram": 10.0},\n` +
`    {"nama": "j6", "cpu": 3.0, "ram": 14.0},\n` +
`]\n` +
`\n` +
`# TUGAS 1: apakah job muat di sisa node?\n` +
`def cocok(sisa_cpu, sisa_ram, job):\n` +
`    return\n` +
`\n` +
`# TUGAS 2: first-fit scheduling\n` +
`def jadwalkan(node, jobs):\n` +
`    sisa = [[n["cpu"], n["ram"]] for n in node]\n` +
`    terjadwal = []\n` +
`    tertunda = []\n` +
`    for job in jobs:\n` +
`        ditempatkan = False\n` +
`        for i in range(len(node)):\n` +
`            if cocok(sisa[i][0], sisa[i][1], job):\n` +
`                terjadwal.append([job["nama"], i])\n` +
`                sisa[i][0] -= job["cpu"]\n` +
`                sisa[i][1] -= job["ram"]\n` +
`                ditempatkan = True\n` +
`                break\n` +
`        if not ditempatkan:\n` +
`            tertunda.append(job["nama"])\n` +
`    return terjadwal, tertunda, sisa\n` +
`\n` +
`# TUGAS 3: node dengan sisa di bawah ambang\n` +
`def node_jenuh(sisa):\n` +
`    return []\n` +
`\n` +
`terjadwal, tertunda, sisa = jadwalkan(node, jobs)\n` +
`jenuh = node_jenuh(sisa)\n` +
`print(f"terjadwal: {terjadwal}")\n` +
`print(f"tertunda: {tertunda}")\n` +
`print(f"node jenuh: {jenuh}")\n`,
        lockLines: 14,
        solution: `# Cluster: 3 node @ 4 CPU / 16 GB RAM\n` +
`node = [\n` +
`    {"cpu": 4.0, "ram": 16.0},\n` +
`    {"cpu": 4.0, "ram": 16.0},\n` +
`    {"cpu": 4.0, "ram": 16.0},\n` +
`]\n` +
`jobs = [\n` +
`    {"nama": "j1", "cpu": 1.0, "ram": 4.0},\n` +
`    {"nama": "j2", "cpu": 2.0, "ram": 8.0},\n` +
`    {"nama": "j3", "cpu": 0.5, "ram": 2.0},\n` +
`    {"nama": "j4", "cpu": 3.0, "ram": 12.0},\n` +
`    {"nama": "j5", "cpu": 2.0, "ram": 10.0},\n` +
`    {"nama": "j6", "cpu": 3.0, "ram": 14.0},\n` +
`]\n` +
`\n` +
`# TUGAS 1: apakah job muat di sisa node?\n` +
`def cocok(sisa_cpu, sisa_ram, job):\n` +
`    return sisa_cpu >= job["cpu"] and sisa_ram >= job["ram"]\n` +
`\n` +
`# TUGAS 2: first-fit scheduling\n` +
`def jadwalkan(node, jobs):\n` +
`    sisa = [[n["cpu"], n["ram"]] for n in node]\n` +
`    terjadwal = []\n` +
`    tertunda = []\n` +
`    for job in jobs:\n` +
`        ditempatkan = False\n` +
`        for i in range(len(node)):\n` +
`            if cocok(sisa[i][0], sisa[i][1], job):\n` +
`                terjadwal.append([job["nama"], i])\n` +
`                sisa[i][0] -= job["cpu"]\n` +
`                sisa[i][1] -= job["ram"]\n` +
`                ditempatkan = True\n` +
`                break\n` +
`        if not ditempatkan:\n` +
`            tertunda.append(job["nama"])\n` +
`    return terjadwal, tertunda, sisa\n` +
`\n` +
`# TUGAS 3: node dengan sisa di bawah ambang\n` +
`def node_jenuh(sisa):\n` +
`    return [i for i, (c, r) in enumerate(sisa) if c < 1.0 or r < 4.0]\n` +
`\n` +
`terjadwal, tertunda, sisa = jadwalkan(node, jobs)\n` +
`jenuh = node_jenuh(sisa)\n` +
`print(f"terjadwal: {terjadwal}")\n` +
`print(f"tertunda: {tertunda}")\n` +
`print(f"node jenuh: {jenuh}")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "cocok", label: "fungsi `cocok` terdefinisi", msg: "Definisikan cocok(sisa_cpu, sisa_ram, job) yang mengembalikan True/False." },
          { kind: "equal", task: "t2", name: "terjadwal", value: [["j1", 0], ["j2", 0], ["j3", 0], ["j4", 1], ["j5", 2]], label: "`terjadwal` sesuai first-fit", msg: "Urutan first-fit: j1–j3 ke node 0, j4 ke node 1, j5 ke node 2." },
          { kind: "equal", task: "t2", name: "tertunda", value: ["j6"], label: "`tertunda` = ['j6']", msg: "j6 (3 CPU/14 GB) tidak muat di sisa node mana pun." },
          { kind: "equal", task: "t3", name: "jenuh", value: [0], label: "`jenuh` = [0]", msg: "Hanya node 0 yang sisa CPU < 1 atau RAM < 4." },
          { kind: "stdout_matches", task: "t2", pattern: "tertunda: \\['j6'\\]", label: "`print` baris tertunda", msg: "Baris kedua harus mencetak tertunda: ['j6']." },
          { kind: "stdout_matches", task: "t3", pattern: "node jenuh: \\[0\\]", label: "`print` baris node jenuh", msg: "Baris ketiga harus mencetak node jenuh: [0]." },
        ],
      },
      reference: "Pending = tidak dapat kamar (tambah node/kecilkan request). OOMKilled = diusir (naikkan limit).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: workload apa, di mana",
      prose: [
        "Skenario 1 — Skrip Python/DBT 10 menit, jalan harian, tim 3 orang. → CronJob K8s ATAU Cloud Run Jobs / VM + timer. Alasan: overhead cluster tidak terbayar; pilih yang paling sederhana yang berhasil.",
        "Skenario 2 — Spark job 4 jam dengan shuffle besar, tim punya platform team. → Spark operator di K8s. Alasan: butuh koordinasi driver-executor dan resource elastis; operator mengkodenya.",
        "Skenario 3 — 50+ pipeline milik 4 tim dengan kuota berbeda. → K8s + namespace + ResourceQuota. Alasan: isolasi dan penjatahan yang tidak bisa diberikan VM tunggal.",
        "Skenario 4 — Job mati OOMKilled padahal cluster sepi. → Bukan tambah node: ukur p99, naikkan limit, pisahkan fase shuffle. Alasan: algojo-nya limit, bukan kapasitas.",
        "Skenario 5 — Pod Pending berjam-jam. → Cek request vs kapasitas node; kecilkan request atau tambah node (cluster-autoscaler). Alasan: Pending = tidak ada kamar yang muat janji.",
        "Aturan praktis 10 detik: berakhir = Job; tak berakhir = Deployment. OOMKilled = limit salah; Pending = request/node salah; tim kecil + job sedikit = managed/VM dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih K8s karena 'nanti pasti scale'. 'Nanti' yang tidak pernah datang telah menghabiskan ribuan dolar biaya cluster dan ratusan jam maintenance. Scale saat metriknya nyata (antrean, insiden kapasitas), bukan saat ambisinya nyata.",
      },
      reference: "Keputusan = f(jenis workload, ukuran tim, rasa sakit nyata). Bukan f(hype).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: ArusPay dan tagihan $810",
      prose: [
        "ArusPay: 12 cron job (rata-rata 30 menit/job/hari = 6 jam komputasi per hari), tim data 4 orang, cluster GKE 3 node × $270 = $810/bulan. Utilisasi CPU rata-rata: 9%. Setengah waktu satu engineer habis untuk merawat cluster (upgrade, IAM, memantau monitoring-nya monitoring).",
        "Hitung kasarnya: 6 jam/hari × 30 hari = 180 jam/bulan komputasi aktual. Satu VM 8 CPU/32 GB ($90/bulan) menampung semuanya dengan systemd timer — atau Cloud Run Jobs yang ditagih per detik (~$25/bulan untuk 180 jam). Bahkan dengan buffer 3x, VM tetap 9x lebih murah dari cluster — belum termasuk 0,5 FTE yang kembali menjadi engineer data beneran.",
        "Pertanyaan analisis: (1) Dalam kondisi apa ArusPay BOLEH tetap di K8s? (2) Bila tetap di K8s, apa yang harus diubah dari sisi request/limit? (3) Apa risiko terbesar pindah ke VM tunggal?",
        "Pembahasan: (1) Boleh tetap bila 12 job tumbuh menjadi 50+ dalam 6 bulan ke depan (ada roadmap tertulis), atau butuh isolasi antar tim, atau workload-nya butuh Spark operator. 'Boleh' butuh alasan berangka, bukan firasat. (2) Ukur p50/p99 tiap job seminggu, set request = p50 dan limit = p99 × 1,2; nyalakan cluster-autoscaler agar node mengikuti beban. (3) Single point of failure: VM mati = 12 job mati — mitigasinya VM kedua sebagai standby ($180/bulan, tetap 4,5x lebih murah) atau pindah bertahap per job.",
      ],
      tasks: [],
      reference: "TCO = tagihan cloud + (jam engineer × gaji per jam). Yang kedua sering lebih besar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam soal. Semua jawaban ada di lesson ini — yang diuji adalah pemahaman, bukan hafalan.",
      ],
      tasks: [],
      summary: [
        "Workload batch yang berakhir = Job/CronJob (restartPolicy OnFailure, activeDeadlineSeconds, ttlSecondsAfterFinished, concurrencyPolicy).",
        "Request = janji untuk scheduling (p50); limit = batas keras eksekusi (p99 × 1,2). CPU compressible, memory tidak.",
        "Operator = pengetahuan operasional terkodekan; pakai saat koordinasi terdistribusi sakit, hindari untuk skrip sederhana.",
        "Pending = tidak ada node yang muat (request/kapasitas); OOMKilled = melewati limit (ukur ulang puncak).",
        "K8s masuk akal: >20 workload, butuh isolasi antar tim, atau workload cloud-native. Selain itu: managed/VM.",
      ],
      next: { label: "DE29 — Semantic Layer & Metrics Store", href: "/learn/de29-semantic-layer" },
      quiz: [
        {
          q: "Job Spark mati OOMKilled di menit ke-237 padahal cluster sepi (200 GB menganggur). Diagnosis paling mungkin?",
          options: [
            { text: "Cluster kekurangan memori — tambah node", why: "Node punya 200 GB menganggur; menambah node tidak mengubah limit 8 GB di YAML.", },
            { text: "Limit memori (8 GB) lebih kecil dari puncak pemakaian (11 GB) — algojo-nya limit, bukan kapasitas", why: "Tepat: OOMKilled = kernel membunuh pod yang melewati limit-nya sendiri. Solusinya ukur p99 dan naikkan limit, bukan tambah node.", correct: true },
            { text: "Spark-nya corrupt — install ulang", why: "Job mati di titik yang SAMA dua kali = deterministik, bukan corrupt acak.", },
            { text: "Scheduler salah menaruh pod", why: "Scheduler menaruh pod sesuai request; yang membunuh adalah limit saat runtime.", },
          ],
        },
        {
          q: "Manakah pernyataan yang BENAR tentang request vs limit?",
          options: [
            { text: "Keduanya sama saja — isi dengan angka yang sama agar aman", why: "Inilah mitos yang memakan NusantaraPay: limit = request membuat spike pertama = OOMKilled.", },
            { text: "Request dipakai scheduler untuk bin packing; limit adalah batas keras yang memicu OOMKill bila dilewati", why: "Tepat: request menjawab 'boleh tinggal di node mana', limit menjawab 'kapan dieksekusi'.", correct: true },
            { text: "Request harus selalu lebih besar dari limit", why: "Terbalik: request ≤ limit adalah konfigurasi waras (janji tidak boleh melebihi batas).", },
            { text: "Limit hanya berlaku untuk CPU, bukan memory", why: "Kebalikannya yang berbahaya: limit memory = garis hidup-mati (incompressible).", },
          ],
        },
        {
          q: "ETL harian yang jalan 30 menit lalu selesai. Resource K8s yang tepat?",
          options: [
            { text: "Deployment dengan 3 replika", why: "Deployment untuk yang tidak pernah berakhir; ETL 30 menit = pekerjaan lepas.", },
            { text: "CronJob (Job terjadwal) dengan restartPolicy OnFailure dan concurrencyPolicy Forbid", why: "Tepat: semantik selesai + jadwal + tidak tumpang tindih bila run telat.", correct: true },
            { text: "DaemonSet di semua node", why: "DaemonSet = satu pod per node (untuk agen monitoring), bukan untuk ETL.", },
            { text: "Pod biasa yang dijalankan manual tiap pagi", why: "Manual = tidak ada retry otomatis, tidak ada jadwal, tidak ada jejak — kembali ke zaman kegelapan.", },
          ],
        },
        {
          q: "Kapan memakai Spark operator (bukan Spark di CronJob mentah)?",
          options: [
            { text: "Untuk semua job Spark, tanpa kecuali", why: "Skrip Spark 200 baris tidak butuh mandor — CronJob mentah menang di TCO.", },
            { text: "Saat butuh koordinasi driver-executor sebagai satu kesatuan dan lifecycle yang dikelola (job besar, multi-executor, tim platform ada)", why: "Tepat: operator mengkodenya pengetahuan operasional Spark — worth it saat koordinasinya nyata.", correct: true },
            { text: "Hanya bila cluster-nya di AWS", why: "Operator tidak peduli cloud apa — ia peduli kompleksitas workload.", },
            { text: "Tidak pernah — operator selalu berlebihan", why: "Untuk Spark production multi-executor, koordinasi manual = restart berantakan.", },
          ],
        },
        {
          q: "Tim 4 orang, 5 cron job, tagihan cluster $810/bulan, utilisasi 9%. Langkah paling waras?",
          options: [
            { text: "Tambah node agar utilisasi terlihat lebih baik", why: "Menambah node MENURUNKAN utilisasi dan MENAIKKAN tagihan — arah yang salah.", },
            { text: "Evaluasi pindah ke VM/managed dengan hitungan TCO (tagihan + jam engineer), kecuali ada roadmap 50+ workload", why: "Tepat: traktor untuk kebun cabai = salah alat. Keputusan butuh angka, bukan gengsi.", correct: true },
            { text: "Pertahankan — K8s terlihat serius di mata investor", why: "Arsitektur untuk CV, bukan untuk tidur nyenyak — mahal dan rapuh.", },
            { text: "Naikkan limit semua job 10x lipat", why: "Limit raksasa = bin packing hancur + tidak ada proteksi dari memory leak.", },
          ],
        },
        {
          q: "Pod berstatus Pending berjam-jam. Artinya?",
          options: [
            { text: "Pod kehabisan memori saat jalan", why: "Itu OOMKilled, bukan Pending. Pending = belum pernah dapat tempat.", },
            { text: "Tidak ada node dengan sisa kapasitas ≥ request pod — cek request vs kapasitas, kecilkan request atau tambah node", why: "Tepat: Pending = 'tidak ada kamar yang muat janji'. Solusinya di sisi request/kapasitas.", correct: true },
            { text: "Image-nya corrupt", why: "Image bermasalah = ImagePullBackOff, bukan Pending.", },
            { text: "Normal — tunggu saja pasti jalan", why: "Pending berjam-jam tidak pernah sembuh sendiri; ia butuh intervensi.", },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

// Stream koneksi 24 jam: baseline berisik 75-165, spike 450 selama 20 mnt.
// Threshold 150 -> 183 flaps (berisik); 400 -> 1 alert (tepat).
const THRESH_SVG = `<svg viewBox="0 0 480 180" role="img" aria-label="Grafik koneksi 24 jam dengan dua ambang: 150 berisik, 400 tepat.">
<g font-family="var(--font-ui)">
<line x1="30" y1="150" x2="450" y2="150" stroke="var(--chart-grid)" stroke-width="1"/>
<polyline points="30,120 60,108 90,128 120,100 150,132 180,112 210,126 240,104 270,130 300,96 315,40 330,34 345,44 360,118 390,124 420,108 450,120" fill="none" stroke="var(--c1)" stroke-width="2"/>
<line x1="30" y1="112" x2="450" y2="112" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6,4"/>
<text x="444" y="106" text-anchor="end" font-size="11" fill="var(--c4)" font-weight="600">ambang 150 → 183x bunyi/hari</text>
<line x1="30" y1="52" x2="450" y2="52" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="6,4"/>
<text x="444" y="46" text-anchor="end" font-size="11" fill="var(--c2)" font-weight="600">ambang 400 → 1x bunyi (tepat)</text>
<text x="322" y="30" text-anchor="middle" font-size="11" fill="var(--text-muted)">spike nyata 20 mnt</text>
<text x="240" y="170" text-anchor="middle" font-size="11" fill="var(--text-muted)">Koneksi per menit, 24 jam · baseline berisik 75–165</text>
</g></svg>`;

export const dba8: V2Lesson = {
  slug: "dba8-monitoring",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA8 — Monitoring & Alerting",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-alert-fatigue",
      eyebrow: "Langkah 1 · Cerita",
      title: "300 alert sehari, dan satu yang penting terlewat",
      prose: [
        "Tim Ops RitelKu menerima ~300 alert database per hari: \u201CCPU 82%\u201D, \u201Ckoneksi 130\u201D, \u201Creplikasi lag 2 detik\u201D. Setiap alert berbunyi di Slack; setiap alert di-dismiss dengan emoji 👀. Tiga bulan kemudian tidak ada yang benar-benar membaca alert lagi — semuanya noise.",
        "Selasa 01:40, disk database mencapai 100%. Postgres berhenti menerima tulis. Alert \u201CDISK 98%\u201D sebenarnya sudah bunyi 6 jam sebelumnya — tenggelam di antara 41 alert \u201CCPU > 80%\u201D yang semuanya false alarm. Downtime 3,5 jam; 12 ribu transaksi gagal.",
        "Twist-nya: masalahnya bukan kurang monitoring — melainkan terlalu banyak alert yang tidak actionable. Alert fatigue adalah kegagalan desain: tiap alert berisik melatih tim untuk mengabaikan SEMUA alert, termasuk yang penting. Monitoring yang baik bukan soal banyaknya metrik, melainkan sedikitnya alert yang salah bunyi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CSemakin banyak alert semakin aman\u201D",
        body: "Alert yang tidak pernah ditindaklanjuti adalah spam yang kamu kirim ke dirimu sendiri. Aturan emas: setiap alert harus (1) menandakan masalah nyata, (2) membutuhkan tindakan manusia SEKARANG, (3) punya runbook. Jika tidak memenuhi ketiganya, ia bukan alert — ia dashboard.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun monitoring yang didengar — bukan yang di-mute.",
        "(1) Membedakan metrik RED/USE dan memilih metrik yang tepat untuk database;",
        "(2) Menghitung presisi alert (bunyi benar/total) dan menandai rule di bawah 50% untuk dituning;",
        "(3) Menjelaskan kenapa alert yang flapping lebih berbahaya daripada tidak ada alert;",
        "(4) Merancang ambang dengan syarat durasi agar presisi naik tanpa kehilangan sensitivitas.",
      ],
      tasks: [],
    },

    {
      id: "metrik-kunci",
      eyebrow: "Langkah 3 · Metrik",
      title: "Enam metrik yang wajib ada di dashboard",
      prose: [
        "**Koneksi aktif vs max_connections** — Si Antrean. Jika > 80% sustained, kamu dekat dengan penolakan massal (ingat DBA1). Alert: > 85% selama 5 menit.",
        "**Ruang disk (data, WAL, backup)** — Si Bom Waktu. Database berhenti total saat disk penuh — tidak degradasi, berhenti. Alert: > 80% warning, > 90% critical. Prediksi kapan penuh = DBA9.",
        "**Replication lag** — Si Bayangan (DBA5). Alert pada max/p99 5-menit > ambang RPO-mu, bukan rata-rata.",
        "**Bloat (dead tuples)** — Si Sampah. Baris mati yang belum di-vacuum membuat tabel menggembung: baca makin lambat, disk terbuang. Alert: rasio bloat > 20% pada tabel besar, atau autovacuum tidak jalan > 1 jam.",
        "**Lock & blocking** — Si Macet. Query yang menunggu lock > 30 detik = ada yang menghalangi. Alert: blocking session > 60 detik (bukan sekadar \u201Cada lock\u201D — lock pendek itu normal).",
        "**Cache hit ratio & slow queries** — Si Detektif (DBA2, DBA6). Hit ratio < 95% sustained atau query > 1 detik yang baru muncul = selidiki. 💡 Intuisi: monitor GEJALA yang dekat dengan kegagalan (disk, koneksi, lag), bukan semua angka yang bisa diukur. Enam di atas menangkap > 90% insiden database nyata.",
      ],
      tasks: [],
    },
    {
      id: "ambang-tenang",
      eyebrow: "Langkah 4 · Ambang",
      title: "Ambang yang tidak berisik: seni membedakan sinyal dan noise",
      prose: [
        "Cara membaca grafik di bawah: garis biru = koneksi per menit selama 24 jam (baseline berisik 75–165, plus satu spike nyata 450 selama 20 menit). Garis merah putus-putus = ambang 150: ia memotong baseline berisik ratusan kali → 183 alert/hari, semuanya false alarm kecuali spike. Garis hijau = ambang 400: hanya bunyi sekali, tepat pada spike nyata.",
        "Interpretasi: ambang 150 \u201Caman\u201D secara teori (batas bawah masalah) tetapi berisik secara praktik — ia mengukur noise, bukan insiden. Ambang 400 tenang tetapi butuh keyakinan bahwa spike di bawah 400 memang bukan masalah. Tiga teknik anti-noise: (1) threshold di atas noise floor (pahami baseline-mu!); (2) durasi — \u201C> ambang selama 5 menit\u201D bukan \u201Csekali lewat\u201D; (3) rate-of-change — alert pada lonjakan mendadak, bukan level absolut.",
        "💡 Intuisi: setiap alert berisik yang kamu biarkan hidup adalah pajak yang dibayar oleh alert penting di masa depan. Audit alert tiap kuartal dan hapus yang tidak pernah ditindaklanjuti — keberanian menghapus sama pentingnya dengan kepintaran membuat.",
      ],
      figure: {
        svg: THRESH_SVG,
        alt: "Grafik koneksi 24 jam: ambang 150 memicu 183 alert, ambang 400 hanya sekali pada spike nyata.",
        caption: "Ambang 150 mengukur noise (183x bunyi). Ambang 400 mengukur insiden (1x, tepat).",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CAlert harus bunyi sedini mungkin\u201D",
        body: "Terlalu dini = noise (ambang 150). Terlalu lambat = terlambat bertindak. Titik manisnya: sedini mungkin TANPA false alarm — dicapai dengan memahami baseline + durasi + rate-of-change, bukan dengan menurunkan ambang membabi buta.",
        type: "pitfall",
      },
    },
    {
      id: "lab-threshold",
      eyebrow: "Langkah 5 · Lab simulasi",
      title: "Lab: uji dua ambang, hitung kebisingannya",
      prose: [
        "Simulasi 1.440 menit (24 jam) koneksi: baseline 120 ± 45 (berisik, 75–165) + satu spike nyata 450 ± 30 selama 20 menit (menit 600–620). Definisi \u201Cflap\u201D: tiap kali metrik melewati ambang dari bawah (satu insiden = satu bunyi, bukan tiap menit).",
        "Tugasmu: hitung jumlah bunyi untuk ambang 150 (flap_150) dan ambang 400 (flap_400), plus persentase waktu di atas 400. Interpretasi: 183 vs 1 — ambang 150 menghasilkan 183 gangguan/hari untuk SATU insiden nyata. Jika tiap false alarm butuh 2 menit perhatian, itu 6 jam kerja/hari terbuang. Inilah aritmetika alert fatigue.",
        "Coba eksplorasi: tambahkan syarat durasi — hitung ulang flap_150 tetapi hanya jika di atas ambang ≥ 5 menit berturut-turut. Berapa sekarang? (Petunjuk: butuh loop dengan counter.) Teknik inilah yang dipakai di produksi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `flap_150` (bunyi saat melewati 150 dari bawah)" },
        { id: "t2", text: "Hitung `flap_400` (bunyi saat melewati 400 dari bawah)" },
        { id: "t3", text: "Hitung `pct_400` (% menit di atas 400, 2 desimal)" },
      ],
      expected: "flap_150=183  flap_400=1  pct_400=1.39",
      note: {
        title: "Sering salah",
        body: "Menghitung tiap menit di atas ambang sebagai bunyi (akan dapat ratusan untuk spike juga). Satu insiden = satu bunyi: deteksi transisi dari bawah ke atas, bukan levelnya.",
      },
      hints: [
        "Gunakan flag above: jika v > thr dan not above → bunyi, above=True; jika v <= thr → above=False.",
        "pct_400 = sum(1 for v in conns if v > 400) / len(conns) * 100.",
        "Fungsi flap bisa ditulis sekali lalu dipanggil dua kali.",
      ],
      code: {
        starter: `import random\nrandom.seed(11)  # pola 24 jam tetap\n\nconns = []\nfor m in range(24 * 60):\n    v = 120 + 45 * random.uniform(-1, 1)\n    if 600 <= m < 620:\n        v = 450 + 30 * random.uniform(-1, 1)\n    conns.append(round(v))\n\ndef flap(series, thr):\n    n, above = 0, False\n    for v in series:\n        if v > thr and not above:\n            n += 1\n            above = True\n        elif v <= thr:\n            above = False\n    return n\n\n# TULIS KODEMU\nflap_150 = \nflap_400 = \npct_400 = \n\nprint(f"flap_150={flap_150}  flap_400={flap_400}  pct_400={pct_400:.2f}")`,
        lockLines: 17,
        solution: `import random\nrandom.seed(11)  # pola 24 jam tetap\n\nconns = []\nfor m in range(24 * 60):\n    v = 120 + 45 * random.uniform(-1, 1)\n    if 600 <= m < 620:\n        v = 450 + 30 * random.uniform(-1, 1)\n    conns.append(round(v))\n\ndef flap(series, thr):\n    n, above = 0, False\n    for v in series:\n        if v > thr and not above:\n            n += 1\n            above = True\n        elif v <= thr:\n            above = False\n    return n\n\n# TULIS KODEMU\nflap_150 = flap(conns, 150)\nflap_400 = flap(conns, 400)\npct_400 = round(sum(1 for v in conns if v > 400) / len(conns) * 100, 2)\n\nprint(f"flap_150={flap_150}  flap_400={flap_400}  pct_400={pct_400:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "flap_150", value: 183, tol: 0.01, label: "`flap_150` = 183", msg: "Ambang 150 memotong baseline berisik ratusan kali." },
          { kind: "equal", task: "t2", name: "flap_400", value: 1, tol: 0.01, label: "`flap_400` = 1", msg: "Hanya spike nyata yang lewat 400." },
          { kind: "equal", task: "t3", name: "pct_400", value: 1.39, tol: 0.02, label: "`pct_400` = 1,39%", msg: "20/1440×100 = 1,39% waktu." },
          { kind: "stdout_matches", task: "t3", pattern: "flap_150=183\\s+flap_400=1\\s+pct_400=1\\.39", label: "`print` menampilkan tiga angka", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Flap = transisi bawah→atas. pct = count/len*100.",
    },    {
      id: "lab2-presisi-alert",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: presisi alert — siapa yang berisik?",
      prose: [
        "120 bunyi, 8 benar: presisi 6,7%. Rule cpu>90% bukan monitoring — ia mesin pembuat kelelahan. Tugasmu: hitung presisi tiap rule, tunjuk yang paling berisik, dan daftarkan rule di bawah 50% untuk dituning ulang.",
        "Alert fatigue membunuh dengan pelan: tim yang terpapar 112 false alarm berhenti merespons — termasuk saat alarm ke-113 benar. Presisi < 50% = rule yang lebih banyak merugikan daripada membantu.",
        "Coba juga: apa perbaikan untuk cpu>90%? Opsi: naikkan ambang + syarat durasi ('>90% selama 10 menit') — presisi naik tanpa kehilangan sensitivitas pada insiden nyata.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `presisi`: dict rule → benar/total (3 desimal)" },
        { id: "t2", text: "Tentukan `paling_berisik`: presisi terendah" },
        { id: "t3", text: "Isi `ambang_bising`: rule dengan presisi < 0,5" },
      ],
      expected: "presisi={'cpu>90%': 0.067, 'disk>85%': 0.8, 'repl_lag>60s': 0.875, 'conn>80%': 0.167}",
      note: {
        title: "Sering salah",
        body: "Menghitung recall (berapa insiden tertangkap) alih-alih precision (berapa bunyi yang benar). Keduanya penting, tetapi yang membunuh tim = presisi rendah.",
      },
      hints: [
        "presisi[r] = benar / total.",
        "min(presisi, key=presisi.get).",
        "Filter p < 0.5.",
      ],
      code: {
        starter: `# Riwayat alert 30 hari: (rule, total_bunyi, bunyi_benar)\nRIWAYAT = [\n    ("cpu>90%", 120, 8),\n    ("disk>85%", 15, 12),\n    ("repl_lag>60s", 40, 35),\n    ("conn>80%", 60, 10),\n]\n# TULIS KODEMU: presisi, paling_berisik, ambang_bising\npresisi = {}\npaling_berisik = ''\nambang_bising = []\n`,
        lockLines: 7,
        solution: `# Riwayat alert 30 hari: (rule, total_bunyi, bunyi_benar)\nRIWAYAT = [\n    ("cpu>90%", 120, 8),\n    ("disk>85%", 15, 12),\n    ("repl_lag>60s", 40, 35),\n    ("conn>80%", 60, 10),\n]\n\n# TULIS KODEMU: presisi, paling_berisik, ambang_bising\npresisi = {r: round(b / t, 3) for r, t, b in RIWAYAT}\npaling_berisik = min(presisi, key=presisi.get)\nambang_bising = [r for r, p in presisi.items() if p < 0.5]\n\nprint(f"presisi={presisi}")\nprint(f"paling_berisik={paling_berisik}  ambang_bising={ambang_bising}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "'cpu>90%': 0\\.067", label: "presisi cpu = 0,067", msg: "8/120." },
          { kind: "equal", task: "t2", name: "paling_berisik", value: "cpu>90%", label: "`paling_berisik` = cpu>90%", msg: "Presisi terendah." },
          { kind: "equal", task: "t3", name: "ambang_bising", value: ["cpu>90%", "conn>80%"], label: "`ambang_bising` benar", msg: "Presisi < 0,5." },
        ],
      },
      reference: "Alert precision = true alerts / total fires; <50% = tuning ulang.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Alert yang baik membangunkanmu untuk bertindak; alert yang buruk membangunkanmu untuk meng-mute. Setiap alert wajib punya runbook: 'kalau bunyi, lakukan X'. Tanpa X, itu bukan alert — itu gangguan tidur.",
        "💡 Ukur presisi tiap rule tiap bulan. Rule yang presisinya < 50% selama 2 bulan = utang monitoring: perbaiki ambangnya atau hapus rule-nya. Tidak ada opsi ketiga.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: alert yang baik meramalkan, bukan melaporkan",
        body: "Alert yang baik meramalkan; alert yang buruk melaporkan. \"Disk 85%\" adalah laporan — ia tidak memberitahumu KAPAN masalahnya tiba. 85% dari 100 GB berarti sekitar 2 hari; 85% dari 10 TB berarti sekitar 8 bulan. Persentase yang sama, urgensi yang berbeda 100× lipat — tetapi pager-mu berbunyi sama kerasnya untuk keduanya. Heuristik praktisinya: setiap alert kapasitas harus berbasis WAKTU menuju kehabisan, bukan persentase. \"Disk diperkirakan penuh dalam <72 jam\" adalah alert; \"disk 85%\" hanyalah fakta. Hitung dari laju pertumbuhan aktual (GB per hari dari 14 hari terakhir), bukan dari tebakan. Aturan keduanya: alert pada GEJALA yang dirasakan pengguna, bukan pada SEBAB di server. \"Checkout gagal >1% dalam 5 menit\" membangunkanmu untuk alasan yang benar; \"CPU 90%\" membangunkanmu untuk melihat-lihat. CPU boleh 95% seharian kalau pengguna tidak merasakan apa-apa — dan boleh 40% tetapi checkout mati karena lock. Jebakan yang menghabiskan karier on-call: 300 alert sehari yang 299-nya noise. Setiap alert yang tidak memicu TINDAKAN dalam 3 bulan terakhir adalah kandidat hapus — bukan kandidat \"nanti diperbaiki\". Dan uji jujur tiap rule: \"kalau ini bunyi jam 3 pagi, apa yang kulakukan?\" Tidak ada jawaban konkret = bukan alert, itu spam berseragam. Monitoring yang baik itu sepi — ia hanya bersuara saat masa depan benar-benar perlu diubah.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: alert, dashboard, atau abaikan?",
      prose: [
        "Skenario 1 — Disk > 90%. → ALERT critical + runbook (hapus WAL lama / tambah disk). Alasan: disk penuh = database berhenti total; selalu actionable.",
        "Skenario 2 — CPU 82% sesaat. → Dashboard saja, bukan alert. Alasan: CPU tinggi sesaat itu normal (vacuum, backup); alert di sini = noise murni.",
        "Skenario 3 — Lag replica naik ke 30 detik selama 2 menit lalu turun. → Dashboard + catat; alert jika > 5 menit. Alasan: lonjakan singkat = batch load normal; yang berbahaya adalah lag sustained (DBA5).",
        "Skenario 4 — Query baru > 1 detik muncul di slow log. → Alert info ke tim data (bukan pager tengah malam). Alasan: butuh tindakan manusia (tuning), tetapi tidak darurat detik ini — severity harus proporsional.",
        "Aturan praktis 10 detik: sebelum membuat alert, tulis runbook-nya dulu. Tidak bisa menulis \u201Cjika bunyi, lakukan X\u201D? Berarti itu bukan alert.",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: malam disk penuh yang seharusnya tidak terjadi",
      prose: [
        "Kembali ke RitelKu. Data forensik: pertumbuhan WAL 11 GB/hari (naik dari 4 GB/hari setelah fitur baru), disk 500 GB, alert \u201Cdisk 98%\u201D bunyi 6 jam sebelum penuh — terabaikan. Setelah insiden, tim tidak menambah alert; mereka MENGHAPUS 47 alert berisik dan menyisakan 9.",
        "Sembilan alert final: disk > 85%, koneksi > 85% (5 mnt), lag p99 > RPO (5 mnt), bloat > 25%, blocking > 60 dtk, hit ratio < 90% (30 mnt), backup gagal, replica unreachable, WAL growth 2x baseline. Masing-masing punya runbook 5 baris. Hasil 6 bulan: 0 insiden terlewat, rata-rata 2 alert/minggu (dari 300/hari), dan — yang paling penting — tiap alert yang bunyi benar-benar dibaca.",
        "Pembahasan: solusinya bukan \u201Clebih banyak monitoring\u201D melainkan \u201Clebih sedikit alert yang tepat\u201D + proyeksi kapasitas (DBA9 akan membuat \u201Cdisk 98% mendadak\u201D mustahil terlewat). Pelajaran: kepercayaan tim pada sistem alert adalah aset yang bisa bangkrut — dan kebangkrutan dibayar dengan insiden.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang monitoring dan alerting.",
      ],
      tasks: [],
      summary: [
        "Alert harus: masalah nyata + butuh tindakan sekarang + punya runbook; sisanya = dashboard.",
        "Enam metrik kunci: koneksi, disk, lag, bloat, lock/blocking, hit ratio & slow queries.",
        "Ambang di atas noise floor + syarat durasi + rate-of-change = anti alert fatigue.",
        "Lag di-alert pada max/p99 jendela pendek, bukan rata-rata.",
        "Audit alert berkala: hapus yang tak pernah ditindaklanjuti.",
      ],
      next: { label: "DBA9 — Capacity Planning", href: "/v2/learn/dba9-kapasitas" },
      quiz: [
        {
          q: "300 alert/hari, semuanya di-dismiss, lalu alert disk 98% terlewat. Akar masalah?",
          options: [
            { text: "Kurang metrik dimonitor", why: "Metriknya ada (disk 98% bunyi) — masalahnya tidak didengar." },
            { text: "Alert fatigue: terlalu banyak alert tak-actionable melatih tim mengabaikan semua", why: "Inilah desain yang gagal: noise membunuh sinyal. Solusinya kurangi, bukan tambah.", correct: true },
            { text: "Slack tidak cocok untuk alert", why: "Medianya bukan masalah; 300 alert akan tenggelam di media apa pun." },
            { text: "Tim malas", why: "Menyalahkan manusia atas kegagalan desain sistem adalah jalan pintas berpikir." },
          ],
        },
        {
          q: "Ambang 150 memberi 183 bunyi/hari, ambang 400 memberi 1 bunyi tepat pada insiden. Kesimpulan?",
          options: [
            { text: "150 lebih baik karena lebih dini", why: "183 bunyi = 182 false alarm; kedinian tanpa presisi = noise." },
            { text: "400 lebih baik: mengukur insiden, bukan noise — dengan syarat memahami baseline", why: "Ambang harus di atas noise floor. Dini tetapi salah = melatih tim mengabaikan.", correct: true },
            { text: "Keduanya sama baiknya", why: "183 vs 1 bunyi untuk 1 insiden = sangat tidak sama." },
            { text: "Tidak perlu ambang, lihat dashboard saja", why: "Dashboard tidak membangunkan orang jam 2 pagi; alert tetap butuh." },
          ],
        },
        {
          q: "Sebelum membuat alert baru, syarat wajibnya?",
          options: [
            { text: "Mendapat persetujuan manajer", why: "Birokrasi bukan syarat teknis." },
            { text: "Bisa menulis runbook: \u201Cjika bunyi, lakukan X\u201D — jika tidak bisa, itu bukan alert", why: "Inilah tes actionable: alert tanpa tindakan yang jelas = spam.", correct: true },
            { text: "Ambang serendah mungkin", why: "Itu resep noise (ambang 150)." },
            { text: "Bunyi ke semua orang", why: "Broadcast ke semua = tanggung jawab tidak ada." },
          ],
        },
        {
          q: "Lag replica sempat 30 detik selama 2 menit lalu normal. Respons tepat?",
          options: [
            { text: "Pager DBA tengah malam", why: "Lonjakan 2 menit = batch normal; pager = noise." },
            { text: "Catat di dashboard; alert hanya jika sustained > 5 menit", why: "Proporsional: observasi untuk transien, alert untuk sustained.", correct: true },
            { text: "Failover segera", why: "Failover untuk 2 menit lag = memindahkan risiko tanpa alasan." },
            { text: "Abaikan total", why: "Pola berulang bisa jadi gejala; catat untuk tren." },
          ],
        },
        {
          q: "Metrik mana yang PALING dekat dengan \u201Cdatabase berhenti total\u201D?",
          options: [
            { text: "CPU 85%", why: "CPU tinggi = lambat, bukan berhenti." },
            { text: "Ruang disk 100%", why: "Disk penuh = database menolak tulis = berhenti. Satu-satunya yang biner.", correct: true },
            { text: "Hit ratio 88%", why: "Berarti lambat, bukan mati." },
            { text: "Koneksi 70%", why: "Masih ada headroom 30%." },
          ],
        },
        {
          q: "Rule 'cpu>90%' berbunyi 120x/bulan dengan presisi 6,7%. Tim sudah mengabaikannya. Tindakanmu?",
          options: [
            { text: "Hapus rule-nya", why: "Menghapus menghilangkan 8 bunyi benar juga. Yang rusak = ambangnya, bukan konsepnya." },
            { text: "Tuning: ambang + syarat durasi, mis. >90% selama 10 menit", why: "Tepat: presisi 6,7% = rule lebih banyak merugikan (fatigue) daripada membantu. Syarat durasi memangkas spike sesaat tanpa kehilangan sensitivitas pada insiden nyata. Ukur lagi presisinya bulan depan.", correct: true },
            { text: "Turunkan ambang ke 80% agar lebih sensitif", why: "Menurunkan ambang pada rule yang sudah berisik = menambah kebisingan. Arahnya terbalik." },
            { text: "Kirim ke channel yang berbeda", why: "Memindahkan kebisingan ke channel lain = kebisingan yang sama. Masalahnya isi, bukan alamat." },
          ],
        },
      ],
    },
  ],
};

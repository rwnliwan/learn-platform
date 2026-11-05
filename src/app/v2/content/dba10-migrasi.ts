import type { V2Lesson } from "../lib/types";

// Blue-green: hijau (lama) melayani, biru (baru) disiapkan + disinkron; cutover = pindah traffic; rollback = pindah kembali.
const BG_SVG = `<svg viewBox="0 0 480 190" role="img" aria-label="Diagram blue-green: traffic pindah dari hijau (lama) ke biru (baru) setelah sinkronisasi.">
<g font-family="var(--font-ui)">
<rect x="30" y="30" width="90" height="130" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="1.5"/>
<text x="75" y="55" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">HIJAU</text>
<text x="75" y="72" text-anchor="middle" font-size="10" fill="var(--text-muted)">v1 · lama</text>
<text x="75" y="140" text-anchor="middle" font-size="11" fill="var(--text-muted)">siap rollback</text>
<rect x="360" y="30" width="90" height="130" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="405" y="55" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">BIRU</text>
<text x="405" y="72" text-anchor="middle" font-size="10" fill="var(--text-muted)">v2 · baru</text>
<text x="405" y="140" text-anchor="middle" font-size="11" fill="var(--text-muted)">menerima traffic</text>
<rect x="180" y="70" width="120" height="50" rx="8" fill="var(--chart-grid)" opacity="0.25" stroke="var(--text-muted)" stroke-width="1"/>
<text x="240" y="90" text-anchor="middle" font-size="11" fill="var(--text)" font-weight="600">Traffic</text>
<text x="240" y="106" text-anchor="middle" font-size="10" fill="var(--text-muted)">cutover = pindah saklar</text>
<line x1="120" y1="95" x2="176" y2="95" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="5,4"/>
<line x1="304" y1="95" x2="356" y2="95" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="150" y1="140" x2="330" y2="140" stroke="var(--text-muted)" stroke-width="1.2" stroke-dasharray="4,4"/>
<text x="240" y="132" text-anchor="middle" font-size="10" fill="var(--text-muted)">sinkronisasi (dual-write / CDC)</text>
<text x="240" y="178" text-anchor="middle" font-size="11" fill="var(--text-muted)">Rollback = pindahkan saklar kembali ke HIJAU</text>
</g></svg>`;

export const dba10: V2Lesson = {
  slug: "dba10-migrasi",
  track: "Database Administrator",
  module: "Skala & Cloud",
  title: "DBA10 — Migrasi & Upgrade Tanpa Downtime",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-upgrade",
      eyebrow: "Langkah 1 · Cerita",
      title: "Upgrade \u201Cterencana\u201D yang memakan korban",
      prose: [
        "PayNusa merencanakan upgrade Postgres 13 → 16: downtime terjadwal 2 jam, Minggu 01:00–03:00, pengumuman ke pengguna sudah dikirim. Upgrade berjalan mulus… sampai 02:47, saat aplikasi baru gagal konek karena driver lama tidak kompatibel. Rollback? Tidak ada rencana rollback — \u201Ckan upgrade-nya sudah dites\u201D. Tim menghabiskan 4 jam berikutnya memperbaiki driver sambil sistem mati total: 6 jam downtime, bukan 2.",
        "Twist-nya: yang gagal bukan database-nya — upgrade database-nya sukses sempurna. Yang gagal adalah asumsi \u201Cupgrade = soal database saja\u201D. Migrasi adalah sistem: database + aplikasi + driver + skema + data. Satu rantai tak teruji (driver!), dan tidak ada jalan pulang, mengubah 2 jam terencana menjadi 6 jam bencana.",
        "Dua pelajaran mahal: (1) downtime terencana tetap downtime — pelanggan yang kabur tidak peduli pengumumanmu; (2) setiap migrasi tanpa rollback plan yang TERUJI adalah perjalanan satu arah. Lesson ini tentang cara pindah tanpa mati: blue-green, dual-write, dan jalan pulang.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CSudah dites di staging = aman di produksi\u201D",
        body: "Staging jarang mereplikasi volume, konkurensi, dan data kotor produksi. Tes staging itu perlu tetapi tidak cukup — yang membedakan migrasi aman adalah strategi (blue-green), sinkronisasi (dual-write/CDC), dan rollback yang sudah dilatih, bukan sekadar \u201Cpernah jalan di staging\u201D.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merencanakan migrasi/upgrade tanpa downtime dengan keyakinan terukur.",
        "(1) Membedakan strategi blue-green, dual-write/CDC, dan dump-restore dari sisi risiko dan downtime;",
        "(2) Menentukan waktu cutover dari lag replikasi (aman saat lag < ambang);",
        "(3) Menghitung durasi rollback dan menjadikannya syarat keputusan cutover;",
        "(4) Menilai gladi cutover dengan P95 — bukan rata-rata — terhadap jendela maintenance.",
      ],
      tasks: [],
    },

    {
      id: "blue-green",
      eyebrow: "Langkah 3 · Strategi",
      title: "Blue-green: dua dunia, satu saklar",
      prose: [
        "Idenya sederhana: jalankan DUA environment. HIJAU = produksi saat ini (v1). BIRU = environment baru (v2) yang disiapkan diam-diam: skema termigrasi, data disinkronkan dari hijau. Saat biru siap dan terverifikasi, \u201Csaklar\u201D traffic dipindah: hijau → biru. Cutover hanya butuh detik–menit, bukan jam.",
        "Cara membaca diagram: kotak kiri (hijau, v1) melayani traffic lewat garis putus-putus; kotak kanan (biru, v2) disiapkan; garis bawah = sinkronisasi data berjalan terus. Setelah cutover (garis tebal ke biru), hijau TIDAK langsung dimatikan — ia standby sebagai jalan pulang. Interpretasi: rollback = pindahkan saklar kembali. Downtime hanya sebesar waktu pindah saklar + verifikasi.",
        "Syarat keberhasilannya: (1) skema v2 harus kompatibel mundur selama transisi (expand-then-contract: tambah kolom dulu, hapus kemudian); (2) data tersinkron real-time (dual-write atau CDC); (3) verifikasi otomatis sebelum cutover (smoke test + hitung baris). 💡 Intuisi: blue-green menukar \u201Cdowntime lama\u201D dengan \u201Cbiaya ganda sementara\u201D — dua environment berjalan paralel. Mahal? Ya, sementara. Lebih murah dari 6 jam downtime? Hampir selalu.",
      ],
      figure: {
        svg: BG_SVG,
        alt: "Diagram blue-green: traffic berpindah dari hijau ke biru; hijau standby untuk rollback.",
        caption: "Blue-green: siapkan biru sambil hijau melayani; cutover = pindah saklar; rollback = pindah kembali.",
      },
      tasks: [],
    },
    {
      id: "dual-write",
      eyebrow: "Langkah 4 · Sinkronisasi",
      title: "Dual-write & CDC: menjaga dua dunia tetap sama",
      prose: [
        "Selama biru disiapkan, hijau tetap menerima tulis. Dua cara menjaga biru tetap sinkron. **Dual-write** — Si Rajin Ganda: aplikasi menulis ke hijau DAN biru sekaligus. Sederhana, tetapi aplikasi harus diubah dan ada risiko tulis ganda/tidak konsisten saat satu gagal.",
        "**CDC (Change Data Capture)** — Si Penyadap. Membaca WAL/log hijau dan memutar ulang perubahan ke biru (mis. Debezium). Aplikasi tidak berubah; tetapi butuh infrastruktur CDC dan lag replikasi harus dimonitor (lag = data biru basi — ingat DBA5).",
        "Kapan cutover aman? Saat lag < ambang (mis. < 100 baris) sustained beberapa menit DAN verifikasi lolos (jumlah baris cocok, smoke test hijau). Cutover yang terburu-buru dengan lag besar = data hilang — migrasi yang \u201Ctanpa downtime\u201D tetapi kehilangan data adalah kegagalan yang lebih buruk.",
        "💡 Intuisi: sinkronisasi adalah replikasi (DBA5) dengan nama lain — lag, monitoring, dan verifikasi yang sama. Jika kamu paham replikasi, kamu sudah paham separuh migrasi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CCutover = selesai\u201D",
        body: "Cutover hanyalah pertengahan. Setelah pindah, ada periode \u201Csoak\u201D (pantau 24–72 jam), baru dekomisikan hijau. Tim yang menghapus hijau 10 menit setelah cutover membuang asuransi termurahnya tepat saat paling dibutuhkan.",
        type: "pitfall",
      },
    },
    {
      id: "lab-cutover",
      eyebrow: "Langkah 5 · Lab simulasi",
      title: "Lab: kapan aman cutover? (dan berapa lama rollback?)",
      prose: [
        "Simulasi lag sinkronisasi (baris) per menit selama dual-write: mulai 50.000 baris, meluruh ~18%/menit + noise. Aturan: cutover aman saat lag < 100 baris. Tugasmu: (1) temukan menit pertama cutover aman; (2) hitung lag pada menit itu; (3) hitung estimasi rollback = restore snapshot 40 GB @ 200 MB/s (menit).",
        "Interpretasi: cutover menit ke-34 berarti 34 menit fase sinkronisasi — bukan 34 menit downtime; downtime sebenarnya hanya detik pindah saklar. Rollback 3,4 menit berarti \u201Cjalan pulang\u201D selalu tersedia dan cepat — inilah yang tidak dimiliki PayNusa.",
        "Coba eksplorasi: ubah ambang menjadi < 10 baris — di menit ke berapa sekarang? Trade-off-nya: ambang ketat = tunggu lebih lama (biaya ganda lebih lama) tetapi risiko lebih kecil. Tidak ada angka sempurna; ada angka yang disepakati.",
      ],
      tasks: [
        { id: "t1", text: "Temukan `cutover_mnt` pertama dengan lag < 100" },
        { id: "t2", text: "Hitung `rollback_mnt` restore 40 GB @ 200 MB/s (1 desimal)" },
      ],
      expected: "cutover_mnt=34  lag=83.0  rollback_mnt=3.4",
      note: {
        title: "Sering salah",
        body: "Memakai <= 100 vs < 100 — untuk data ini hasilnya sama (menit 34, lag 83), tetapi biasakan membaca syarat dengan teliti. Di produksi, off-by-one pada ambang bisa berarti cutover prematur.",
      },
      hints: [
        "Gunakan next(m for m, v in enumerate(lag) if v < 100).",
        "lag_pada_cutover = lag[cutover_mnt].",
        "rollback_mnt = round(40*1024/200/60, 1).",
      ],
      code: {
        starter: `import random\nrandom.seed(31)  # skenario lag tetap\n\n# Lag sinkronisasi (baris) tiap menit: decay + noise\nlag = [round(50000 * 0.82**m + random.uniform(0, 800), 1) for m in range(60)]\n\n# TULIS KODEMU: menit cutover aman + estimasi rollback\ncutover_mnt = \nlag_cutover = \nrollback_mnt = \n\nprint(f"cutover_mnt={cutover_mnt}  lag={lag_cutover}  rollback_mnt={rollback_mnt}")`,
        lockLines: 5,
        solution: `import random\nrandom.seed(31)  # skenario lag tetap\n\n# Lag sinkronisasi (baris) tiap menit: decay + noise\nlag = [round(50000 * 0.82**m + random.uniform(0, 800), 1) for m in range(60)]\n\n# TULIS KODEMU: menit cutover aman + estimasi rollback\ncutover_mnt = next(m for m, v in enumerate(lag) if v < 100)\nlag_cutover = lag[cutover_mnt]\nrollback_mnt = round(40*1024/200/60, 1)\n\nprint(f"cutover_mnt={cutover_mnt}  lag={lag_cutover}  rollback_mnt={rollback_mnt}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cutover_mnt", value: 34, tol: 0.01, label: "`cutover_mnt` = 34", msg: "Menit pertama lag < 100 dengan seed 31." },
          { kind: "equal", task: "t1", name: "lag_cutover", value: 83.0, tol: 1.0, label: "`lag_cutover` ≈ 83 baris", msg: "lag[34] ≈ 83." },
          { kind: "equal", task: "t2", name: "rollback_mnt", value: 3.4, tol: 0.05, label: "`rollback_mnt` = 3,4", msg: "40×1024/200/60 = 3,41 → 3,4." },
          { kind: "stdout_matches", task: "t2", pattern: "cutover_mnt=34\\s+lag=83\\.0\\s+rollback_mnt=3\\.4", label: "`print` menampilkan tiga angka", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "next() + enumerate untuk pencarian pertama. rollback = ukuran/throughput.",
    },    {
      id: "lab2-gladi-cutover",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: apakah gladi cutover-mu meyakinkan?",
      prose: [
        "Lima gladi cutover: 18, 22, 19, 35, 21 menit. Rata-rata 23 — aman untuk jendela 30? Tugasmu: hitung P95 (bukan rata-rata!), putuskan aman/tidak, dan tunjuk gladi yang jebol.",
        "Satu gladi 35 menit > jendela 30 = bukti bahwa skenario terburuk realistis ADA. Cutover sungguhan tidak memakai rata-rata; ia memakai keyakinan bahwa yang terburuk pun muat.",
        "Coba juga: andai gladi ke-4 (35) disebabkan langkah manual — apa tindak lanjutnya? Otomasi langkah itu, gladi ulang, dan lihat P95 turun. Itulah gunanya gladi: menemukan 35 SEBELUM hari-H.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p95` dari GLADI (metode sorted + index 95%)" },
        { id: "t2", text: "Tentukan `aman`: p95 ≤ JENDELA" },
        { id: "t3", text: "Isi `gladi_buruk`: nilai > JENDELA" },
      ],
      expected: "p95=35  aman=False  gladi_buruk=[35]",
      note: {
        title: "Sering salah",
        body: "Memakai rata-rata untuk keputusan cutover. Rata-rata 23 menenangkan; P95 35 membatalkan. Untuk keputusan sekali-jalan-tanpa-kembali, pakai tail, bukan tengah.",
      },
      hints: [
        "urut = sorted(GLADI); p95 = urut[int(0.95*len(urut))].",
        "aman = p95 <= JENDELA (boolean).",
        "gladi_buruk = [g for g in GLADI if g > JENDELA].",
      ],
      code: {
        starter: `# Waktu cutover rehearsal (menit) dari 5 gladi bersih + jendela maintenance 30 menit\nGLADI = [18, 22, 19, 35, 21]\nJENDELA = 30\n# TULIS KODEMU: p95, aman, gladi_buruk\np95 = 0\naman = True\ngladi_buruk = []\n`,
        lockLines: 3,
        solution: `# Waktu cutover rehearsal (menit) dari 5 gladi bersih + jendela maintenance 30 menit\nGLADI = [18, 22, 19, 35, 21]\nJENDELA = 30\n\n# TULIS KODEMU: p95, aman, gladi_buruk\nurut = sorted(GLADI)\np95 = urut[int(0.95 * len(urut))]\naman = p95 <= JENDELA\ngladi_buruk = [g for g in GLADI if g > JENDELA]\n\nprint(f"p95={p95}  aman={aman}  gladi_buruk={gladi_buruk}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "p95", value: 35, label: "`p95` = 35", msg: "P95 dari 5 gladi." },
          { kind: "equal", task: "t2", name: "aman", value: false, label: "`aman` = False", msg: "35 > 30." },
          { kind: "equal", task: "t3", name: "gladi_buruk", value: [35], label: "`gladi_buruk` = [35]", msg: "Yang jebol jendela." },
        ],
      },
      reference: "Cutover confidence = P95 rehearsal ≤ jendela.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Rencana rollback BUKAN rencana cadangan — ia rencana utama yang ditulis duluan. Jika kamu tidak bisa menjelaskan cara kembali dalam 5 menit, kamu belum siap maju.",
        "💡 Gladi cutover yang tidak menemukan masalah = gladi yang gagal. Tujuannya BUKAN membuktikan 'kita siap', melainkan menemukan '35 menit' itu minggu ini, bukan di hari-H.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: migrasi dibunuh oleh detail kecil — collation, sequence, timezone",
        body: "Migrasi besar jarang dibunuh oleh arsitektur — ia dibunuh oleh detail kecil yang tidak masuk slide presentasi: collation, sequence, timezone. Tiga pembunuh senyap ini punya pola yang sama: migrasi \"sukses\", aplikasi jalan, lalu 3 hari kemudian keanehan muncul. Collation berbeda → ORDER BY dan perbandingan string berubah → \"kok sorting-nya beda?\" Sequence tidak terbawa → last_value kembali ke 1 → duplicate key pada INSERT pertama setelah cutover. Timestamp tanpa timezone dimigrasi ke server dengan timezone berbeda → \"kok semua jamnya mundur 7 jam?\" Heuristik praktisinya: buat \"daftar pembunuh\" (killer checklist) SEBELUM migrasi — collation per kolom, sequence + last_value, timezone setting, urutan FK constraint, default value, trigger — dan verifikasi satu per satu, bukan \"kayaknya sama\". Aturan keduanya: reconciler berjalan TERUS selama migrasi, bukan sekali di akhir. Job sederhana yang membandingkan row count + checksum per tabel tiap jam antara sumber dan target. Selisih yang ketahuan jam ke-2 diperbaiki dalam hitungan menit; selisih yang ketahuan setelah cutover diperbaiki dalam begadang. Dan yang ketiga: gladi cutover dengan DATA PRODUKSI (di environment terisolasi), bukan data dummy 100 baris — karena collation hanya menggigit di data nyata berkarakter aneh, dan sequence hanya penting saat volumenya nyata. Migrasi adalah 10% strategi, 90% verifikasi detail. Yang pertama bisa di-slide-kan; yang kedua menentukan apakah kamu tidur di hari-H.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: strategi migrasi per situasi",
      prose: [
        "Skenario 1 — Upgrade minor (13.1 → 13.5), downtime 5 menit diizinkan. → In-place upgrade terjadwal + snapshot sebelum + rollback plan. Alasan: blue-green overkill untuk risiko kecil; tetapi rollback TETAP wajib.",
        "Skenario 2 — Upgrade mayor / pindah cloud, RTO ketat. → Blue-green + CDC + cutover saat lag < ambang. Alasan: downtime detik-menit; biaya ganda sementara < biaya downtime.",
        "Skenario 3 — Migrasi skema besar (tambah kolom NOT NULL ke 1 miliar baris). → Expand-then-contract multi-fase: tambah kolom nullable → backfill bertahap → baru NOT NULL. Alasan: ALTER TABLE ... ADD COLUMN NOT NULL me-rewrite tabel = lock lama; pecah menjadi fase tanpa lock.",
        "Skenario 4 — \u201CKita rollback manual saja kalau gagal.\u201D → Tolak: rollback harus TERUJI sebelum cutover (latihan di staging + runbook). Alasan: rollback yang belum pernah dicoba = harapan, bukan rencana (DBA4 mengajarkan ini untuk backup; berlaku sama untuk migrasi).",
        "Aturan praktis 10 detik: setiap migrasi punya (1) kriteria cutover terukur, (2) rollback teruji, (3) periode soak sebelum dekomisikan yang lama.",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: 800 GB pindah cloud dalam 47 detik",
      prose: [
        "ECom Kita (DBA5) memindahkan 800 GB database ke cloud. Strategi: CDC dari on-prem ke cloud selama 6 hari (lag turun dari jutaan ke < 50 baris), verifikasi: checksum per 10 ribu baris + smoke test 200 query, cutover Minggu 02:00: pindah DNS + connection string → downtime 47 detik.",
        "Angka: biaya ganda 6 hari ≈ Rp18 juta (dua environment). Downtime 47 detik ≈ 0 transaksi hilang (lag < 50 baris, di-replay setelah cutover). Periode soak 72 jam; hijau on-prem dimatikan hari ke-4. Bandingkan alternatif \u201Cdump & restore\u201D: 800 GB @ 150 MB/s ≈ 90 menit downtime + risiko gagal di menit 80.",
        "Pembahasan: kunci sukses bukan teknologinya (CDC itu standar), melainkan disiplinnya: kriteria cutover tertulis (< 50 baris sustained 10 menit), verifikasi otomatis, rollback teruji (DNS kembali = 2 menit), dan kesabaran menunggu 6 hari sinkronisasi. Pelajaran: migrasi tanpa downtime = 95% persiapan + 5% saklar.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang migrasi dan upgrade.",
      ],
      tasks: [],
      summary: [
        "Downtime terencana tetap downtime — targetkan tanpa downtime via blue-green.",
        "Blue-green: siapkan biru + sinkronisasi; cutover = pindah saklar (detik–menit).",
        "Dual-write (ubah aplikasi) vs CDC (baca WAL, tanpa ubah aplikasi); cutover saat lag < ambang.",
        "Expand-then-contract untuk perubahan skema tanpa lock lama.",
        "Rollback teruji + periode soak sebelum dekomisikan yang lama.",
      ],
      next: { label: "DBA11 — Managed Database di Cloud", href: "/v2/learn/dba11-cloud" },
      quiz: [
        {
          q: "Upgrade sukses tetapi aplikasi gagal konek (driver lama); tanpa rollback plan → 6 jam down. Pelajaran?",
          options: [
            { text: "Jangan pernah upgrade", why: "Upgrade perlu; yang salah strateginya." },
            { text: "Migrasi = sistem (DB+app+driver); rollback teruji wajib; downtime terencana tetap downtime", why: "Tiga pelajaran PayNusa dalam satu kalimat.", correct: true },
            { text: "Staging tidak berguna", why: "Staging perlu; hanya tidak cukup sendirian." },
            { text: "Upgrade di jam sepi selalu aman", why: "Jam sepi tidak menyelamatkan dari driver tak kompatibel." },
          ],
        },
        {
          q: "Keuntungan utama blue-green dibanding dump & restore?",
          options: [
            { text: "Lebih murah", why: "Justru lebih mahal sementara (dua environment)." },
            { text: "Cutover detik–menit + rollback instan (pindah saklar kembali)", why: "Inilah intinya: downtime minimal dan jalan pulang selalu ada.", correct: true },
            { text: "Tidak perlu sinkronisasi", why: "Sinkronisasi (dual-write/CDC) adalah syaratnya." },
            { text: "Tidak perlu tes", why: "Verifikasi sebelum cutover adalah syaratnya." },
          ],
        },
        {
          q: "Pilih CDC dibanding dual-write ketika?",
          options: [
            { text: "Aplikasi boleh diubah bebas", why: "Itu justru kondisi dual-write." },
            { text: "Aplikasi tidak boleh/diubah sulit — CDC membaca WAL tanpa menyentuh aplikasi", why: "Trade-off klasik: CDC = tanpa ubah app, tetapi butuh infra + monitor lag.", correct: true },
            { text: "Ingin lag nol", why: "CDC tetap punya lag." },
            { text: "Data kecil", why: "Ukuran data bukan penentunya." },
          ],
        },
        {
          q: "Menambah kolom NOT NULL ke tabel 1 miliar baris tanpa downtime. Cara?",
          options: [
            { text: "ALTER TABLE langsung jam sepi", why: "Rewrite + lock lama = downtime de facto." },
            { text: "Expand-then-contract: tambah nullable → backfill bertahap → baru NOT NULL", why: "Memecah operasi berat menjadi fase-fase tanpa lock lama.", correct: true },
            { text: "Hapus tabel lalu buat ulang", why: "Kehilangan data + downtime total." },
            { text: "Tambah di aplikasi saja", why: "Skema database tetap harus berubah." },
          ],
        },
        {
          q: "Kapan environment lama (hijau) boleh dimatikan?",
          options: [
            { text: "10 menit setelah cutover", why: "Membuang asuransi tepat saat paling dibutuhkan." },
            { text: "Setelah periode soak 24–72 jam monitoring tanpa anomali", why: "Banyak masalah migrasi muncul dalam 1–3 hari pertama; hijau adalah jalan pulang.", correct: true },
            { text: "Tidak pernah", why: "Biaya ganda selamanya = pemborosan; soak cukup." },
            { text: "Sebelum cutover", why: "Itu menghilangkan rollback sebelum dibutuhkan." },
          ],
        },
        {
          q: "Gladi cutover: 18, 22, 19, 35, 21 menit. Jendela 30 menit. Rata-rata 23 < 30. Lanjut cutover?",
          options: [
            { text: "Lanjut — rata-rata aman", why: "Rata-rata 23 menenangkan tetapi P95 = 35 > 30. Cutover sungguhan terjadi SEKALI — ia tidak mendapat 'rata-rata', ia mendapat satu hasil. Satu gladi jebol = bukti skenario jebol itu nyata." },
            { text: "Tahan — P95 35 > jendela; otomasi langkah penyebab 35, gladi ulang", why: "Tepat: keputusan sekali-jalan memakai tail (P95), bukan tengah. Gladi yang menemukan '35' = gladi yang SUKSES (menemukan masalah minggu ini, bukan di hari-H). Perbaiki, ulangi, baru lanjut.", correct: true },
            { text: "Perpanjang jendela jadi 40 menit", why: "Memperpanjang jendela tanpa tahu penyebab 35 = menutupi, bukan memperbaiki. Jika 35 disebabkan langkah manual, ia bisa jadi 50 di hari-H." },
            { text: "Buang gladi 35 sebagai outlier", why: "Membuang data yang tidak disukai = memalsukan keyakinan. Outlier hanya boleh dibuang jika penyebabnya dipahami DAN diperbaiki." },
          ],
        },
      ],
    },
  ],
};

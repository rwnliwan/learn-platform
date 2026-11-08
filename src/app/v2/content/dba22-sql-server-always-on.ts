import type { V2Lesson } from "../lib/types";

// ── Figure: SYNC vs ASYNC — latensi commit dan jendela kehilangan data ──────
const SYNC_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Perbandingan mode SYNC dan ASYNC: latensi commit 8 versus 0,2 milidetik, dan jendela kehilangan data 0 versus 64 MB">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="200" y1="20" x2="200" y2="190"/><line x1="200" y1="190" x2="540" y2="190"/>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)">
<text x="10" y="60">latensi SYNC</text><text x="10" y="100">latensi ASYNC</text>
<text x="10" y="150">data-loss SYNC</text><text x="10" y="190">data-loss ASYNC</text>
</g>
<g opacity="0.9">
<rect x="202" y="48" width="320" height="18" rx="4" fill="var(--c1)"/>
<rect x="202" y="88" width="8" height="18" rx="4" fill="var(--c2)"/>
<rect x="202" y="138" width="4" height="18" rx="4" fill="var(--c3)"/>
<rect x="202" y="178" width="256" height="18" rx="4" fill="var(--c4)"/>
</g>
<g font-size="10" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="528" y="62">8,0 ms</text><text x="216" y="102">0,2 ms</text>
<text x="212" y="152">0 MB</text><text x="464" y="192">64 MB</text>
</g>
</svg>`;

export const dba22: V2Lesson = {
  slug: "dba22-sql-server-always-on",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA22 — SQL Server: Always On & T-SQL untuk DBA",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Tujuan, rute, dan bekal",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan cara kerja Availability Groups — synchronous vs asynchronous commit, readable secondary, dan listener; (2) membedakan automatic vs manual failover dan menjelaskan peran quorum/witness; (3) memakai DMV kunci SQL Server (`sys.dm_os_wait_stats`, `sys.dm_db_index_physical_stats`) untuk diagnosis; (4) memilih antara index rebuild dan reorganize berdasar tingkat fragmentasi; (5) menghitung trade-off SYNC vs ASYNC dari laju log dan lag replikasi.",
        "Rutenya: cerita cluster dua node yang menjadi dua “primary” → Availability Groups → quorum dan failover → DMV dan T-SQL administrasi → lab simulasi latensi & jendela kehilangan data → jebakan readable secondary → peta keputusan → mini-case RPO = 0 → kuis → rangkuman. Estimasi 60 menit; lab-nya ±10 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Replikasi database menyalin perubahan ke server kedua; ada dua mode: sinkron (primary menunggu konfirmasi — tidak ada data hilang, tetapi lebih lambat) dan asinkron (primary tidak menunggu — cepat, tetapi ada jeda). Failover = memindahkan peran primary ke server cadangan. Fragmentasi indeks = halaman data yang berantakan sehingga baca menjadi tidak efisien; solusinya membangun ulang atau menata ulang indeks. Lesson ini memakai konsep yang sama dengan yang kamu kenal di Postgres — hanya dialek dan tooling-nya yang berbeda.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: pindah dari Postgres ke SQL Server seperti pindah dari mobil manual ke matic — tujuannya sama (sampai dengan selamat), tetapi tuas, indikator, dan kebiasaannya berbeda. DBA yang baik mengemudikan keduanya.",
      ],
      reference: "Bekal: replikasi sync/async, failover, fragmentasi indeks. Lesson ini = konsep yang sama, dialek SQL Server.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Cluster dua node yang melahirkan dua “primary”",
      prose: [
        "Sebuah perusahaan ritel memasang Always On Availability Group dua node — satu di kantor pusat, satu di cabang — dan mengaktifkan automatic failover dengan bangga. “Sekarang kita anti-downtime,” kata manajer IT. Tiga bulan kemudian, link antar-kantor putus selama 40 menit. Kedua node sama-sama tidak bisa melihat satu sama lain — dan keduanya memutuskan mengambil alih sebagai primary.",
        "Selama 40 menit, kasir di dua lokasi menulis ke “primary” masing-masing. Saat link pulih, cluster dihadapkan pada dua versi kebenaran yang bertentangan: 1.800 transaksi ganda, stok yang tidak bisa direkonsiliasi, dan satu malam panjang tim DBA memilih transaksi mana yang dibuang. Akar masalahnya sepele: tidak ada witness/quorum yang dikonfigurasi — tidak ada pihak ketiga yang memutuskan siapa primary yang sah.",
        "Twist-nya: fitur “automatic failover” yang dibeli untuk mencegah downtime justru MENCIPTAKAN downtime — karena otomatisasi tanpa quorum adalah otomatisasi bencana. Pelajaran lesson ini: high availability bukan soal menyalakan fitur, melainkan soal memahami kontraknya — siapa yang memutuskan, dalam kondisi apa, dan apa harganya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “sudah Always On = sudah aman”",
        body: "Yang benar: Always On adalah kerangka kerja, bukan jaminan. Tanpa quorum/witness yang benar, tanpa latihan failover, dan tanpa pemahaman sync/async, ia hanya memberi rasa aman yang palsu — persis seperti cerita di atas.",
        type: "pitfall",
      },
    },
    {
      id: "konsep-ag",
      eyebrow: "Langkah 3 · Konsep",
      title: "Availability Groups — Si Penjaga Ganda",
      prose: [
        "Availability Group (AG) mengelompokkan satu set database yang di-failover bersama sebagai satu unit — bukan per database seperti mirroring lama. Tiap AG punya satu primary dan satu atau lebih secondary. Mode commit-nya dua: synchronous (primary menunggu secondary mengeraskan log sebelum commit dikonfirmasi — RPO = 0) dan asynchronous (primary langsung konfirmasi — ada lag, ada jendela kehilangan data).",
        "Dua fitur yang membuatnya praktis: readable secondary (secondary bisa melayani query baca — laporan tidak mengganggu OLTP) dan listener (nama jaringan virtual yang selalu menunjuk ke primary aktif — aplikasi tidak perlu tahu siapa primary hari ini). Jendela kehilangan data mode ASYNC bisa dihitung dengan rumus di bawah — dan angka inilah yang harus kamu laporkan ke manajemen, bukan “kecil kok”.",
      ],
      formula: String.raw`W = r \times l`,
      formulaNote: "W = jendela kehilangan data (MB) — data berisiko hilang bila failover terjadi; r = laju redo/log (MB per detik); l = lag replikasi secondary (detik). W = 0 hanya bila l = 0 (mode SYNC).",
      tasks: [],
      hints: [
        "💡 Listener adalah kontrak dengan aplikasi: “kamu bicara ke nama ini, biar cluster yang mengatur siapa menjawab.” Tanpa listener, tiap failover = ubah connection string = downtime manusia.",
      ],
    },
    {
      id: "konsep-quorum",
      eyebrow: "Langkah 4 · Konsep",
      title: "Quorum dan failover — Si Wasit yang Menentukan",
      prose: [
        "Automatic failover hanya aman bila ada WASIT: quorum. Quorum = mayoritas suara yang menentukan siapa primary yang sah. Dua node tanpa witness = 1 lawan 1 saat link putus — tidak ada mayoritas, tidak ada keputusan yang sah. Witness (file share atau cloud witness) memberi suara ketiga yang memecah kebuntuan. Inilah yang hilang dalam cerita pembuka.",
        "Aturannya: automatic failover hanya untuk mode SYNC dengan quorum sehat; ASYNC hanya boleh manual failover (dengan kesadaran penuh akan data loss sebesar W). Failover yang “otomatis” tanpa kondisi ini bukan high availability — melainkan undian.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “automatic failover selalu lebih baik dari manual”",
        body: "Yang benar: automatic failover tanpa quorum dan tanpa SYNC = split-brain seperti cerita pembuka. Manual failover yang direncanakan (dengan runbook) sering lebih aman daripada otomatisasi yang salah konfigurasi.",
        type: "pitfall",
      },
    },
    {
      id: "konsep-tsql",
      eyebrow: "Langkah 5 · Konsep",
      title: "T-SQL administrasi — Si Kotak Perkakas Khas",
      prose: [
        "DBA SQL Server hidup di dalam DMV (Dynamic Management Views) — jendela observasi bawaan, padanannya AWR di Oracle. Dua yang paling sering dibuka: `sys.dm_os_wait_stats` (jenis tunggu dominan — “database-nya menunggu apa?”) dan `sys.dm_db_index_physical_stats` (fragmentasi indeks per tabel — “seberapa berantakan halamannya?”). Pola diagnosisnya sama seperti di mana pun: ukur dulu, tebak kemudian.",
        "Untuk fragmentasi, T-SQL memberi dua alat: REORGANIZE (menata ulang halaman, ringan, online — untuk fragmentasi ringan-sedang) dan REBUILD (membangun ulang indeks dari nol, butuh sumber daya dan bisa mengunci — untuk fragmentasi berat). Beda dari Postgres: tidak ada VACUUM di sini — perawatan indeks adalah pekerjaan eksplisit yang dijadwalkan, bukan proses latar yang berjalan sendiri. DBA yang datang dari Postgres wajib menyesuaikan kalender perawatannya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “REBUILD selalu lebih baik karena lebih bersih”",
        body: "Yang benar: REBUILD menulis ulang seluruh indeks — mahal dan berpotensi mengunci. Untuk fragmentasi 10–30%, REORGANIZE cukup dan jauh lebih murah. Ukur fragmentasinya dulu via DMV, baru pilih alatnya.",
        type: "pitfall",
      },
      hints: [
        "💡 Kebiasaan lintas-platform: di Postgres kamu bertanya “kapan terakhir VACUUM?”, di SQL Server “kapan terakhir REBUILD/REORGANIZE?”. Pertanyaannya sama — perawatannya terjadwal — hanya nama obatnya beda.",
      ],
    },
    {
      id: "lab-latensi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Simulasi latensi commit dan jendela data-loss",
      prose: [
        "Waktunya menghitung kontrak Always On dengan angka. Skenario SINTETIS: laju redo 120 GB/hari; mode SYNC menunggu ack secondary (RTT 8 ms); mode ASYNC mengonfirmasi lokal (0,2 ms) dengan secondary yang lag 45 detik. Tugasmu: (1) hitung laju redo per detik; (2) hitung jendela kehilangan data mode ASYNC; (3–4) bandingkan latensi commit dan faktor kelambatannya; (5) putuskan mode untuk syarat RPO = 0.",
        "Coba: setelah lolos, naikkan `lag_detik` menjadi 300 (5 menit — secondary yang sibuk) dan lihat jendela data-loss-nya. Lalu tanyakan: masih beranikah kamu menjanjikan “hampir tidak ada data hilang” ke direksi?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `laju_mb_detik` = laju GB/hari × 1024 / 86400" },
        { id: "t2", text: "Hitung `window_mb` = laju per detik × lag (jendela kehilangan data ASYNC)" },
        { id: "t3", text: "Isi `lat_sync` dan `lat_async` dari angka RTT/lokal" },
        { id: "t4", text: "Hitung `faktor` = lat_sync / lat_async" },
        { id: "t5", text: "Isi `rpo_nol` dengan mode yang memenuhi RPO = 0" },
        { id: "t6", text: "Jalankan dan pastikan keempat baris tercetak" },
      ],
      expected: "Laju redo: 1.42 MB/detik\nJendela kehilangan data (ASYNC, lag 45 dtk): 64.0 MB\nLatensi commit SYNC 8.0 ms vs ASYNC 0.2 ms -> SYNC 40x lebih lambat\nUntuk RPO = 0 pilih mode: SYNC",
      code: {
        starter: `# Lab DBA22 — angka SINTETIS, bukan SQL Server sungguhan
laju_gb_hari = 120.0                        # JANGAN UBAH
rtt_ms, lokal_ms, lag_detik = 8.0, 0.2, 45.0  # JANGAN UBAH

# TULIS KODEMU DI BAWAH INI
laju_mb_detik = 0.0   # TODO t1
window_mb = 0.0       # TODO t2

lat_sync = 0.0        # TODO t3
lat_async = 0.0       # TODO t3
faktor = 0.0          # TODO t4

rpo_nol = ""          # TODO t5: "SYNC" atau "ASYNC"

print(f"Laju redo: {laju_mb_detik:.2f} MB/detik")
print(f"Jendela kehilangan data (ASYNC, lag 45 dtk): {window_mb:.1f} MB")
print(f"Latensi commit SYNC {lat_sync:.1f} ms vs ASYNC {lat_async:.1f} ms -> SYNC {faktor:.0f}x lebih lambat")
print(f"Untuk RPO = 0 pilih mode: {rpo_nol}")`,
        lockLines: 5,
        solution: `# Lab DBA22 — angka SINTETIS, bukan SQL Server sungguhan
laju_gb_hari = 120.0                        # JANGAN UBAH
rtt_ms, lokal_ms, lag_detik = 8.0, 0.2, 45.0  # JANGAN UBAH

# TULIS KODEMU DI BAWAH INI
laju_mb_detik = laju_gb_hari * 1024 / 86400
window_mb = laju_mb_detik * lag_detik

lat_sync = rtt_ms
lat_async = lokal_ms
faktor = lat_sync / lat_async

rpo_nol = "SYNC"

print(f"Laju redo: {laju_mb_detik:.2f} MB/detik")
print(f"Jendela kehilangan data (ASYNC, lag 45 dtk): {window_mb:.1f} MB")
print(f"Latensi commit SYNC {lat_sync:.1f} ms vs ASYNC {lat_async:.1f} ms -> SYNC {faktor:.0f}x lebih lambat")
print(f"Untuk RPO = 0 pilih mode: {rpo_nol}")`,
        checks: [
          { kind: "equal", task: "t1", name: "laju_mb_detik", value: 1.42, tol: 0.01, label: "`laju_mb_detik` ≈ 1,42 MB/detik", msg: "120 × 1024 / 86400." },
          { kind: "equal", task: "t2", name: "window_mb", value: 64.0, tol: 0.5, label: "`window_mb` ≈ 64 MB", msg: "Laju per detik × lag 45 detik." },
          { kind: "equal", task: "t4", name: "faktor", value: 40, tol: 0.5, label: "`faktor` = 40×", msg: "8,0 / 0,2." },
          { kind: "equal", task: "t5", name: "rpo_nol", value: "SYNC", tol: 0, label: "`rpo_nol` = SYNC", msg: "Hanya SYNC yang memberi jendela kehilangan nol." },
          { kind: "stdout_matches", task: "t6", pattern: "Jendela kehilangan data", label: "Baris jendela tercetak", msg: "Pastikan baris kedua tercetak." },
          { kind: "stdout_matches", task: "t6", pattern: "pilih mode: SYNC", label: "Keputusan tercetak", msg: "Baris terakhir: “Untuk RPO = 0 pilih mode: SYNC”." },
        ],
      },
      reference: "SYNC = RPO 0 dengan harga latensi; ASYNC = cepat dengan jendela kehilangan W = r × l. Pilih berdasar angka, bukan perasaan.",
    },
    {
      id: "readable-secondary",
      eyebrow: "Langkah 7 · Konsep",
      title: "Readable secondary: berkah yang bisa basi",
      prose: [
        "Readable secondary adalah fitur favorit tim BI: laporan berat dialihkan ke secondary, OLTP di primary tidak terganggu. Tetapi ada jebakan yang persis menimpa “cari dengan foto” versi laporan: data di secondary hanya se-SEGAR lag replikasinya. Laporan keuangan yang dibaca dari secondary dengan lag 20 menit bisa menampilkan angka yang sudah tidak benar — dan tidak ada yang memberi tahu pembacanya.",
        "Cara membaca chart di Langkah 3: dua pasang batang — latensi commit (SYNC 8,0 ms vs ASYNC 0,2 ms) dan jendela kehilangan data (SYNC 0 MB vs ASYNC 64 MB). Interpretasi: SYNC membayar 40× latensi untuk membeli jendela nol; ASYNC membeli kecepatan dengan 64 MB risiko. Tidak ada yang gratis — hanya ada yang harganya terlihat dan yang tidak.",
        "Aturan operasionalnya: tandai dengan jelas sumber tiap laporan (primary vs secondary + lag saat dibaca), dan jangan pernah biarkan laporan regulasi/audit membaca dari secondary tanpa batas lag yang disepakati tertulis.",
      ],
      figure: {
        svg: SYNC_SVG,
        alt: "Perbandingan mode SYNC dan ASYNC: latensi commit dan jendela kehilangan data",
        caption: "SYNC: latensi 8,0 ms, jendela 0 MB. ASYNC: latensi 0,2 ms, jendela 64 MB. Harga selalu ada — tinggal pilih membayar di mana.",
      },
      tasks: [],
      note: {
        title: "Catatan jujur — secondary yang bisa dibaca ≠ data segar",
        body: "Lag replikasi adalah kontrak yang harus dipantau seperti SLA. Secondary dengan lag 20 menit untuk laporan operasional = keputusan bisnis berdasar masa lalu.",
        type: "risk",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan Always On",
      prose: [
        "Skenario 1 — RPO harus 0 (keuangan inti): SYNC + automatic failover + witness/quorum sehat + listener. Bayar 40× latensi commit; itu harga RPO nol.",
        "Skenario 2 — Butuh HA tetapi toleran kehilangan kecil + sensitif latensi: ASYNC + manual failover + ukur dan laporkan W setiap hari. Jujur soal angkanya ke manajemen.",
        "Skenario 3 — Laporan berat mengganggu OLTP: readable secondary + batas lag tertulis + tandai sumber data di tiap laporan. Jangan biarkan audit membaca data basi.",
        "Skenario 4 — Query melambat misterius: buka `sys.dm_os_wait_stats` dulu (menunggu apa?), lalu `sys.dm_db_index_physical_stats` (fragmentasi berapa?) — REORGANIZE untuk ringan, REBUILD untuk berat.",
        "Aturan praktis 10 detik: (1) Tulis RPO dalam MB/menit, bukan “kecil”. (2) Tanpa witness, tidak ada automatic failover yang sah. (3) SYNC tanpa ukur latensi = janji kosong. (4) DMV dulu, tebak kemudian.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "RPO = 0 dengan 1.000 commit per detik?",
      prose: [
        "E-commerce memproses 1.000 commit/detik di jam sibuk dan direksi menuntut RPO = 0 “karena ini uang pelanggan”. Link ke secondary: RTT 8 ms. Pertanyaan: (1) Mode apa yang memenuhi syarat? (2) Berapa throughput maksimum per koneksi bila tiap commit menunggu 8 ms? (3) Dengan 1.000 commit/detik, berapa koneksi konkuren minimum yang dibutuhkan — dan apa implikasinya pada arsitektur aplikasi?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "(1) Hanya SYNC — RPO = 0 tidak bisa ditawar. (2) Tiap koneksi serial hanya bisa 1000/8 = 125 commit/detik. (3) Butuh minimal 8 koneksi konkuren yang benar-benar paralel (1.000/125) — praktisnya jauh lebih banyak dengan connection pooling (lihat DBA18: pool menyerap burst tanpa membanjiri server dengan koneksi). Implikasinya: aplikasi harus dirancang untuk konkurensi nyata, bukan satu koneksi raksasa. Pelajarannya: RPO = 0 bukan sekadar “nyalakan SYNC” — ia menuntut arsitektur aplikasi yang mampu membayar harganya.",
        type: "risk",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "Availability Group = failover per grup database; SYNC (RPO 0, lambat) vs ASYNC (cepat, jendela loss W = r × l); readable secondary + listener.",
        "Automatic failover hanya sah dengan quorum/witness — tanpanya, otomatisasi = undian split-brain.",
        "DMV adalah AWR-nya SQL Server: `sys.dm_os_wait_stats` untuk tunggu, `sys.dm_db_index_physical_stats` untuk fragmentasi.",
        "REORGANIZE untuk fragmentasi ringan (murah, online); REBUILD untuk berat (mahal, berpotensi mengunci).",
        "Readable secondary ≠ data segar — lag-nya adalah kontrak yang harus dipantau dan ditandai di laporan.",
        "Tulis RPO dalam angka (MB/menit) sebelum memilih mode — dan pastikan aplikasinya mampu membayar harganya.",
      ],
      next: {
        label: "DBA23 — Database di Kubernetes & IaC untuk DBA",
        href: "/v2/learn/dba23-database-kubernetes-iac",
      },
      quiz: [
        {
          q: "`sys.dm_os_wait_stats` menunjukkan `PAGEIOLATCH_SH` dominan. Artinya?",
          options: [
            { text: "CPU kurang — tambah core", why: "Salah: PAGEIOLATCH = menunggu halaman dibaca dari disk ke memori — soal I/O, bukan CPU.", correct: false },
            { text: "Bottleneck di I/O penyimpanan: sesi menunggu data dibaca dari disk; selidiki storage/latihan indeks", why: "Benar: DMV memberi tahu JENIS tunggunya — obati I/O, bukan CPU.", correct: true },
            { text: "Jaringan lambat", why: "Salah: wait jaringan punya nama berbeda (mis. ASYNC_NETWORK_IO).", correct: false },
            { text: "Indeks perlu di-rebuild", why: "Salah melompat: tunggu I/O belum tentu fragmentasi — cek dulu pola query dan storage.", correct: false },
          ],
        },
        {
          q: "`sys.dm_db_index_physical_stats` melaporkan fragmentasi 8%. Tindakan tepat?",
          options: [
            { text: "REBUILD segera — makin bersih makin baik", why: "Salah: 8% = ringan; REBUILD mahal dan berpotensi mengunci untuk hasil yang tak terasa.", correct: false },
            { text: "REORGANIZE (atau biarkan) — fragmentasi ringan tidak layak membayar biaya REBUILD", why: "Benar: pilih alat sesuai tingkat kerusakan — 8% adalah wilayah reorganize.", correct: true },
            { text: "Hapus dan buat ulang indeksnya", why: "Salah: itu REBUILD yang lebih kasar tanpa manfaat tambahan.", correct: false },
            { text: "Tambah RAM", why: "Salah: fragmentasi adalah keteraturan halaman, bukan kapasitas memori.", correct: false },
          ],
        },
        {
          q: "Cluster 2 node tanpa witness, link putus, keduanya jadi primary. Pencegahnya?",
          options: [
            { text: "Tambah node ketiga", why: "Bisa, tetapi bukan jawaban termurah/termudah — witness file share/cloud cukup.", correct: false },
            { text: "Konfigurasi witness/quorum sehingga hanya satu pihak yang memegang mayoritas suara", why: "Benar: wasit pihak ketiga memecah kebuntuan 1 lawan 1.", correct: true },
            { text: "Matikan automatic failover permanen", why: "Salah: membuang fitur bukan solusi — yang salah adalah ketiadaan wasit.", correct: false },
            { text: "Perbesar bandwidth link", why: "Salah: link lebih besar tetap bisa putus — masalahnya keputusan, bukan kapasitas.", correct: false },
          ],
        },
        {
          q: "Laporan keuangan dibaca dari readable secondary dengan lag 20 menit. Risikonya?",
          options: [
            { text: "Tidak ada — secondary selalu sinkron", why: "Salah: secondary hanya se-segar lag-nya.", correct: false },
            { text: "Stale read: angka laporan bisa basi 20 menit — untuk laporan regulasi/audit ini bisa fatal", why: "Benar: keterbacaan ≠ kesegaran; lag adalah kontrak yang harus tertulis.", correct: true },
            { text: "Primary menjadi lambat", why: "Salah: justru tujuan readable secondary adalah melindungi primary.", correct: false },
            { text: "Data hilang permanen", why: "Salah: lag = keterlambatan terlihat, bukan kehilangan.", correct: false },
          ],
        },
        {
          q: "Syarat RPO = 0 ditegakkan. Konsekuensi arsitekturnya?",
          options: [
            { text: "Cukup nyalakan SYNC, aplikasi tidak perlu berubah", why: "Salah: SYNC menambah latensi per commit — aplikasi butuh konkurensi/pooling yang mampu membayarnya.", correct: false },
            { text: "SYNC + aplikasi harus dirancang untuk konkurensi nyata (connection pooling) karena tiap commit menunggu ack", why: "Benar: RPO = 0 adalah kontrak dua belah pihak — database DAN aplikasi.", correct: true },
            { text: "ASYNC dengan lag 1 detik sudah cukup", why: "Salah: 1 detik lag = jendela kehilangan > 0.", correct: false },
            { text: "Tambah secondary lebih banyak", why: "Salah: jumlah secondary tidak mengubah RPO bila semuanya ASYNC.", correct: false },
          ],
        },
        {
          q: "DBA Postgres pindah ke SQL Server. Kebiasaan apa yang harus diubah?",
          options: [
            { text: "Tidak ada — semua database sama", why: "Salah: tooling dan kebiasaan operasionalnya berbeda nyata.", correct: false },
            { text: "Perawatan indeks menjadi pekerjaan terjadwal eksplisit (REBUILD/REORGANIZE), bukan proses latar seperti VACUUM; diagnosis lewat DMV", why: "Benar: konsepnya sama (keteraturan, observasi), tetapi ritualnya beda.", correct: true },
            { text: "Berhenti memakai indeks sama sekali", why: "Salah: indeks tetap fondasi performa di semua platform.", correct: false },
            { text: "Selalu pakai REBUILD tiap malam", why: "Salah: REBUILD buta tiap malam = membayar mahal untuk yang tak perlu.", correct: false },
          ],
        },
      ],
    },
  ],
};

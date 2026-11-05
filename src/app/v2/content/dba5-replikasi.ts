import type { V2Lesson } from "../lib/types";

// Primary -> replica (async, lag), lalu failover: replica dipromosikan, aplikasi dialihkan.
const FAILOVER_SVG = `<svg viewBox="0 0 480 180" role="img" aria-label="Diagram replikasi: primary mengirim WAL ke replica; saat primary mati, replica dipromosikan dan aplikasi dialihkan.">
<g font-family="var(--font-ui)">
<rect x="30" y="30" width="120" height="56" rx="8" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="1.5"/>
<text x="90" y="52" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">Primary</text>
<text x="90" y="68" text-anchor="middle" font-size="10" fill="var(--text-muted)">baca + tulis</text>
<rect x="30" y="110" width="120" height="56" rx="8" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="1.5"/>
<text x="90" y="132" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">Replica</text>
<text x="90" y="148" text-anchor="middle" font-size="10" fill="var(--text-muted)">baca saja · lag 0,76 dtk</text>
<line x1="150" y1="52" x2="150" y2="110" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="6,4" marker-end="url(#ah5)"/>
<text x="162" y="86" font-size="10" fill="var(--text-muted)">stream WAL (async)</text>
<rect x="330" y="30" width="120" height="56" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="1.5"/>
<text x="390" y="52" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">Primary MATI</text>
<text x="390" y="68" text-anchor="middle" font-size="10" fill="var(--text-muted)">02:14</text>
<rect x="330" y="110" width="120" height="56" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="390" y="132" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">Dipromosikan</text>
<text x="390" y="148" text-anchor="middle" font-size="10" fill="var(--text-muted)">baca + tulis · 90 dtk</text>
<path d="M150 138 Q 240 170 330 138" fill="none" stroke="var(--c1)" stroke-width="2" marker-end="url(#ah5)"/>
<text x="240" y="166" text-anchor="middle" font-size="10" fill="var(--text-muted)">promote + alihkan aplikasi</text>
<defs><marker id="ah5" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="var(--text-muted)" stroke-width="1.2"/></marker></defs>
</g></svg>`;

export const dba5: V2Lesson = {
  slug: "dba5-replikasi",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA5 — Replikasi & High Availability",
  estMinutes: 70,
  steps: [
    {
      id: "cerita-failover",
      eyebrow: "Langkah 1 · Cerita",
      title: "Failover 4 menit yang \u201Cberhasil\u201D — dan 37 menit yang hilang",
      prose: [
        "Minggu 02:14, primary database PayNusa mati (PSU meledak). Tim jaga mengeksekusi runbook failover dengan sempurna: deteksi 1 menit, promosi replica 2 menit, alihkan aplikasi 1 menit. Total 4 menit — di bawah RTO 15 menit. Slack penuh emoji 🎉.",
        "Senin 09:00, tim finance melapor: 1.842 transaksi antara 01:37–02:14 tidak ada di database. Replica ternyata lag 37 menit saat primary mati — dan tidak ada yang memonitor lag karena \u201Ckan sudah ada replica, pasti aman.\u201D RTO tercapai dengan gemilang; RPO jebol tanpa ampun.",
        "Twist-nya: memiliki replica tidak sama dengan memiliki high availability. Replica yang lag-nya tidak dimonitor hanyalah backup mahal yang kebetulan online. HA adalah sistem: replikasi + monitoring lag + failover teruji + aplikasi yang tahu cara pindah. Satu rantai putus, semua gagal.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CSudah ada replica = sudah HA\u201D",
        body: "Replica menjawab \u201Cdi mana cadangan berdirinya\u201D, bukan \u201Cseberapa siap ia mengambil alih\u201D. Replica yang tidak pernah diuji promosinya, lag-nya tidak dialert, dan aplikasinya tidak tahu cara reconnect — adalah teater keamanan, bukan high availability.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang replikasi yang jujur soal RPO-nya.",
        "(1) Membedakan replikasi sync vs async dari sisi jaminan dan harga (latency tulis);",
        "(2) Menghitung RPO jujur = P99 lag replikasi, bukan rata-rata;",
        "(3) Mensimulasikan failover dan menghitung total downtime-nya (deteksi + promosi + drain);",
        "(4) Memilih sync untuk data yang kehilangan 1 detiknya = bencana, async untuk yang bisa di-replay.",
      ],
      tasks: [],
    },

    {
      id: "async-sync",
      eyebrow: "Langkah 3 · Replikasi",
      title: "Async vs sync: tawar-menawar antara kecepatan dan kepastian",
      prose: [
        "**Replikasi async** — Si Kilat. Primary meng-commit transaksi lalu mengirim WAL ke replica \u201Csecepatnya\u201D, tanpa menunggu. Latensi tulis minimal (aplikasi tidak menunggu replica), tetapi ada jendela lag: jika primary mati sebelum WAL terkirim, transaksi itu hilang. Lag normal < 1 detik; saat beban puncak bisa melonjak (lihat lab).",
        "**Replikasi sync** — Si Penjamin. Primary menunggu minimal satu replica mengonfirmasi terima WAL sebelum commit. RPO = 0 untuk kegagalan satu node — tetapi tiap tulis membayar round-trip network. Di region yang sama: +1–5 ms; antar region: +50–200 ms. Untuk checkout yang butuh < 100 ms, ini bisa terasa.",
        "Cara membaca diagram: panah putus-putus adalah stream WAL async dari primary ke replica; saat primary mati, replica dipromosikan (kotak tebal) dan aplikasi dialihkan. Interpretasi: seluruh proses ini hanya secepat langkah paling lambatnya — deteksi + promosi + reconnect. Dan data yang selamat hanya sebanyak yang sempat di-stream sebelum kematian.",
        "💡 Intuisi: pilih sync untuk data yang kehilangan 1 detiknya = bencana (saldo, pembayaran); pilih async untuk yang bisa ditoleransi atau di-replay (log analitik, sesi). Banyak sistem dewasa memakai keduanya: sync untuk tabel kritis, async untuk sisanya.",
      ],
      figure: {
        svg: FAILOVER_SVG,
        alt: "Primary men-stream WAL ke replica; saat primary mati, replica dipromosikan dalam 90 detik.",
        caption: "Alur failover: stream WAL (async) menjaga replica tetap dekat; saat primary mati, promosi + pengalihan aplikasi.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CSync replication = tidak mungkin kehilangan data\u201D",
        body: "Sync hanya menjamin data ada di ≥2 node sebelum commit — ia tidak melindungimu dari DELETE tanpa WHERE (ter-replikasi juga!), corrupt logis, atau region-wide outage. Itulah kenapa backup (DBA4) tetap wajib walau sudah sync.",
        type: "pitfall",
      },
    },
    {
      id: "lab-failover",
      eyebrow: "Langkah 4 · Lab simulasi",
      title: "Lab: simulasi failover dan hitung biayanya",
      prose: [
        "Skenario: 60 menit data lag replikasi (detik). 55 menit pertama normal (0,2–1,5 dtk); 5 menit terakhir primary kepayahan — lag melonjak 8–14 dtk — lalu primary mati di menit ke-60. Timeline failover: deteksi 30 dtk + promosi 45 dtk + reconnect aplikasi 15 dtk.",
        "Tugasmu: (1) hitung rata-rata lag normal (55 menit pertama) — inilah \u201Csehat\u201D menurut monitor; (2) hitung RPO aktual = lag maksimum 5 menit terakhir (data yang belum sampai saat kematian); (3) hitung total downtime failover.",
        "Interpretasi: rata-rata 0,76 dtk terlihat indah — tetapi RPO aktual 12,59 dtk, 16x lipatnya. Pelajaran: alert lag harus pada lonjakan/persentil tinggi, bukan rata-rata. Dan downtime 90 dtk vs RTO 15 menit (900 dtk) berarti masih ada 810 dtk \u201Cbudget\u201D — cukup untuk satu kali percobaan ulang yang gagal. Coba ubah: bagaimana jika promosi butuh 600 dtk (promosi manual)? Masih di bawah RTO?",
      ],
      formula: String.raw`\text{downtime} = t_{\text{deteksi}} + t_{\text{promosi}} + t_{\text{reconnect}} \qquad \text{RPO} = \text{lag}_{\text{max saat mati}}`,
      formulaNote: "Downtime failover adalah jumlah tiga fase berurutan. RPO = lag terbesar tepat sebelum kematian — data yang belum tereplikasi = data yang hilang.",
      tasks: [
        { id: "t1", text: "Hitung `avg_lag_normal` (55 menit pertama, 2 desimal)" },
        { id: "t2", text: "Hitung `rpo_loss_dtk` = max 5 menit terakhir (2 desimal)" },
        { id: "t3", text: "Hitung `downtime_dtk` total failover" },
      ],
      expected: "avg_lag_normal=0.76  rpo_loss_dtk=12.59  downtime_dtk=90",
      note: {
        title: "💡 Intuisi: rata-rata menyembunyikan bencana",
        body: "Monitor yang hanya melihat rata-rata lag akan selalu terlihat hijau — sampai hari bencana. Untuk replikasi, yang penting adalah max/p99 dalam jendela 5 menit terakhir. Rata-rata adalah untuk laporan; persentil adalah untuk bertahan hidup.",
      },
      hints: [
        "avg = sum(lag[:55]) / 55.",
        "rpo = max(lag[-5:]).",
        "downtime = 30 + 45 + 15.",
      ],
      code: {
        starter: `import random\nrandom.seed(7)  # skenario lag tetap\n\n# 55 mnt normal + 5 mnt primary kepayahan (detik)\nlag = [round(random.uniform(0.2, 1.5), 2) for _ in range(55)]\nlag += [round(random.uniform(8, 14), 2) for _ in range(5)]\n\n# TULIS KODEMU\navg_lag_normal = \nrpo_loss_dtk = \ndowntime_dtk = \n\nprint(f"avg_lag_normal={avg_lag_normal:.2f}  rpo_loss_dtk={rpo_loss_dtk:.2f}  downtime_dtk={downtime_dtk}")`,
        lockLines: 6,
        solution: `import random\nrandom.seed(7)  # skenario lag tetap\n\n# 55 mnt normal + 5 mnt primary kepayahan (detik)\nlag = [round(random.uniform(0.2, 1.5), 2) for _ in range(55)]\nlag += [round(random.uniform(8, 14), 2) for _ in range(5)]\n\n# TULIS KODEMU\navg_lag_normal = round(sum(lag[:55]) / 55, 2)\nrpo_loss_dtk = round(max(lag[-5:]), 2)\ndowntime_dtk = 30 + 45 + 15\n\nprint(f"avg_lag_normal={avg_lag_normal:.2f}  rpo_loss_dtk={rpo_loss_dtk:.2f}  downtime_dtk={downtime_dtk}")`,
        checks: [
          { kind: "equal", task: "t1", name: "avg_lag_normal", value: 0.76, tol: 0.01, label: "`avg_lag_normal` = 0,76 dtk", msg: "Rata-rata 55 nilai pertama dengan seed 7." },
          { kind: "equal", task: "t2", name: "rpo_loss_dtk", value: 12.59, tol: 0.01, label: "`rpo_loss_dtk` = 12,59 dtk", msg: "max dari 5 nilai terakhir = 12,59." },
          { kind: "equal", task: "t3", name: "downtime_dtk", value: 90, tol: 0.01, label: "`downtime_dtk` = 90 dtk", msg: "30 + 45 + 15 = 90." },
          { kind: "stdout_matches", task: "t3", pattern: "avg_lag_normal=0\\.76\\s+rpo_loss_dtk=12\\.59\\s+downtime_dtk=90", label: "`print` menampilkan tiga angka", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "avg=mean(55 pertama). RPO=max(5 terakhir). downtime=jumlah 3 fase.",
    },    {
      id: "lab2-p99-rpo",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: P99 lag = RPO jujurmu",
      prose: [
        "Rata-rata lag 8 detik terdengar aman — sampai kamu lihat P99-nya 60 detik. Tugasmu: hitung P99 lag async sebagai RPO jujur, bandingkan dengan sync (RPO ≈ 0), dan beri rekomendasi untuk data pembayaran.",
        "Rata-rata menyembunyikan bencana (pelajaran lab 1); P99 menampakkannya. Untuk tabel pembayaran, RPO 60 detik = 60 detik transaksi hilang saat failover — tidak bisa ditoleransi.",
        "Coba juga: bagaimana jika lag 45 dan 60 adalah anomali satu kali? Keputusan sync/async tidak boleh berdasar 'semoga tidak terulang' — ia berdasar P99 yang diukur rutin.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p99` dari lag_async (metode: sorted, index 99%)" },
        { id: "t2", text: "Tetapkan `rpo_async` = p99, `rpo_sync` = 0" },
        { id: "t3", text: "Tentukan `rekomendasi`: 'sync' jika rpo_async > 30" },
      ],
      expected: "p99=60  rpo_async=60  rpo_sync=0",
      note: {
        title: "Sering salah",
        body: "Memakai rata-rata sebagai RPO. RPO = data yang HILANG saat bencana — yang hilang adalah lag TERBURUK yang realistis (P99), bukan rata-rata.",
      },
      hints: [
        "urut = sorted(lag_async); p99 = urut[int(0.99*len(urut))].",
        "rpo_async = p99 (detik).",
        "rekomendasi = 'sync' jika rpo_async > 30 else 'async'.",
      ],
      code: {
        starter: `# Lag replikasi (detik), sampel 20 menit terakhir. async vs sync (sync: lag ~0).\nlag_async = [2,3,2,5,4,3,12,4,3,2, 45,3,4,2,3,60,4,3,2,5]\n# TULIS KODEMU: p99, rpo_async, rpo_sync, rekomendasi\np99 = 0\nrpo_async, rpo_sync = 0, 0\nrekomendasi = ''\n`,
        lockLines: 2,
        solution: `# Lag replikasi (detik), sampel 20 menit terakhir. async vs sync (sync: lag ~0).\nlag_async = [2,3,2,5,4,3,12,4,3,2, 45,3,4,2,3,60,4,3,2,5]\n\n# TULIS KODEMU: p99, rpo_async, rpo_sync, rekomendasi\nurut = sorted(lag_async)\np99 = urut[int(0.99 * len(urut))]\nrpo_async = p99\nrpo_sync = 0\nrekomendasi = "sync" if rpo_async > 30 else "async"\n\nprint(f"p99={p99}  rpo_async={rpo_async}  rpo_sync={rpo_sync}")\nprint(f"rekomendasi={rekomendasi}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "p99", value: 60, label: "`p99` = 60", msg: "P99 dari 20 sampel lag." },
          { kind: "equal", task: "t2", name: "rpo_async", value: 60, label: "`rpo_async` = 60", msg: "RPO jujur = P99." },
          { kind: "equal", task: "t3", name: "rekomendasi", value: "sync", label: "`rekomendasi` = sync", msg: "60 > 30 untuk data pembayaran." },
        ],
      },
      reference: "RPO jujur = P99 lag replikasi, bukan rata-rata.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Pilih sync/async per TABEL, bukan per database. Tabel pembayaran sync (RPO 0), tabel log analitik async (RPO 60 detik oke). Satu ukuran untuk semua = membayar mahal untuk yang tidak butuh, atau murah untuk yang butuh.",
        "💡 Failover yang tidak pernah dilatih = failover yang gagal saat dibutuhkan. Latih failover seperti latihan kebakaran: saat api benar-benar datang, otot yang bekerja, bukan dokumen.",
      ],
      tasks: [],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: arsitektur HA untuk tiap kebutuhan",
      prose: [
        "Skenario 1 — RTO 4 jam, RPO 24 jam (internal tools). → Single instance + backup harian teruji. Alasan: restore 4 jam masih di bawah RTO; replica adalah kemewahan yang tidak dibayar kembali.",
        "Skenario 2 — RTO 15 menit, RPO 5 menit (SaaS). → Primary + 1 async replica + alert lag + failover teruji tiap kuartal. Alasan: failover menit-menit memenuhi RTO; WAL tiap 5 menit memenuhi RPO.",
        "Skenario 3 — RPO ≈ 0 untuk data uang (payment). → Sync replica di AZ berbeda untuk tabel kritis + async untuk sisanya. Alasan: bayar latensi tulis hanya di mana kehilangan data = bencana.",
        "Skenario 4 — Butuh baca 10x lipat tanpa mengganggu tulis. → 2–3 read replica async + load balancing baca. Alasan: replica ganda juga memisahkan beban analitik dari transaksional (pola CQRS sederhana).",
        "Aturan praktis 10 detik: (1) alert pada lag p99/5-menit, bukan rata-rata; (2) uji promosi replica tiap kuartal — failover yang belum pernah dicoba = failover yang belum ada; (3) pastikan aplikasi bisa reconnect otomatis (retry + DNS/endpoint failover).",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: promosi yang setengah hati",
      prose: [
        "ECom Kita punya primary + replica async. Saat primary mati, runbook berkata \u201Cpromosikan replica\u201D — tetapi tidak berkata \u201Cmatikan primary lama\u201D. Primary ternyata tidak mati total, hanya network partition 6 menit. Hasil: dua primary hidup bersamaan 6 menit, masing-masing menerima tulis berbeda → split brain. Rekonsiliasi: 312 order ganda, 45 stok negatif, 3 hari kerja tim.",
        "Angka: downtime \u201Cresmi\u201D hanya 4 menit (failover cepat!), tetapi biaya insiden = 3 hari × 4 orang × Rp2 juta ≈ Rp24 juta + refund ganda Rp31 juta. Failover tercepat pun bisa menjadi termahal jika prosedurnya tidak fencing.",
        "Pembahasan: HA yang benar butuh (1) fencing/STONITH — pastikan primary lama benar-benar mati/tidak bisa tulis sebelum promosi; (2) aplikasi memakai single endpoint failover (bukan IP hardcode dua-duanya); (3) uji skenario partition, bukan cuma \u201Cmatikan primary\u201D. Pelajaran: kecepatan failover tanpa keamanan prosedur = memindahkan bencana, bukan mengakhirinya.",
      ],
      tasks: [],
    },
    {
      id: "patroni-failover",
      eyebrow: "Langkah 9 · Failover otomatis",
      title: "Failover otomatis dengan Patroni: wasit yang tidak panik",
      prose: [
        "Jam 3 pagi, primary mati. Runbook failover manual berisi 14 langkah: cek ini, hentikan itu, promosikan ini, alihkan itu. Di langkah ke-9, dengan mata setengah terbuka, kamu salah urutan — dan lahirlah split-brain seperti mini-case ECom Kita. Failover manual bukan cuma lambat; ia rapuh tepat saat paling dibutuhkan: di bawah tekanan.",
        "Patroni mengubah runbook menjadi mesin. Gagasannya sederhana: agen Patroni berjalan di setiap node database; keputusan \u201Csiapa primary\u201D disimpan di penyimpanan konsensus terdistribusi (DCS) seperti etcd — wasit yang tidak tidur, tidak panik, dan tidak salah baca. Primary memegang kunci pemimpin (leader lock) di DCS dan memperbaruinya tiap detik. Saat heartbeat berhenti, lease kedaluwarsa, dan kandidat yang tersisa berebut kunci — pemenang dipromosikan otomatis.",
        "Tiga peran yang perlu dipahami di level gagasan: DCS (etcd, ZooKeeper, atau Consul) menyimpan satu kebenaran — \u201Cprimary saat ini = N2\u201D — plus lease tiap node; agen Patroni di tiap node memeriksa kesehatan dan mengeksekusi promote/failover; HAProxy (atau endpoint terkelola) mengarahkan koneksi aplikasi ke primary yang benar — aplikasi bicara ke satu alamat, bukan IP node yang bisa berganti peran. Failover = keputusan DCS, aksi agen, perpindahan trafik. Tanpa jari manusia di keyboard.",
        "Tetapi Patroni bukan sulap: ia mempercepat KEPUTUSAN, bukan memperbaiki DATA. Promosi otomatis atas replika yang lag 37 menit tetap menghasilkan failover \u201Csukses\u201D dengan 37 menit data hilang (ingat kasus PayNusa di Langkah 1). Kebijakan yang jujur: \u201Cjangan promosikan replika dengan lag lebih dari X detik\u201D — yang berarti kadang sistem memilih menunggu daripada mempromosikan yang salah. Kecepatan vs kebenaran adalah trade-off yang harus ditulis eksplisit, bukan ditemukan saat insiden.",
        "\uD83D\uDCA1 Intuisi: Patroni seperti wasit sepak bola yang juga menunjuk kapten pengganti. Wasit (DCS) yang memutuskan siapa kapten, bukan para pemain yang berebut ban kapten. Dan wasit yang baik memastikan kapten lama benar-benar keluar lapangan sebelum kapten baru memimpin — itulah fencing, topik langkah berikutnya.",
        "Uji failover seperti latihan kebakaran: jadwalkan drill tiap kuartal — matikan primary di staging (lalu di produksi saat sudah berani), ukur RTO dan RPO nyata, catat sebagai angka jujur untuk SLA. Failover yang pertama kali dicoba saat insiden sungguhan adalah latihan kebakaran pertama yang dilakukan saat gedung benar-benar terbakar.",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDEA8 Mitos: \u201CSudah pakai Patroni = tidak perlu mikir failover\u201D",
        body: "Patroni mengeksekusi kebijakan yang kamu tulis — termasuk yang salah. Tanpa drill terjadwal, tanpa kebijakan lag maksimum, dan tanpa fencing yang dikonfigurasi, failover otomatis hanya berarti kegagalan yang terjadi lebih cepat dan lebih konsisten. Otomatisasi mempercepat, bukan membenarkan.",
        type: "pitfall",
      },
      reference: "Patroni = agen per node + DCS sebagai wasit. Cepat memutuskan, tidak memperbaiki lag.",
    },
    {
      id: "split-brain",
      eyebrow: "Langkah 10 · Lab",
      title: "Split-brain: bencana dua primary",
      prose: [
        "Partisi jaringan membelah klaster jadi dua sisi yang tidak bisa saling bicara. Sisi A mengira sisi B mati; sisi B mengira sisi A mati. Tanpa wasit yang disepakati, masing-masing sisi mempromosikan primary-nya sendiri — dan dua primary menerima tulis yang berbeda. Inilah split-brain. Mini-case ECom Kita di Langkah 8 adalah contohnya: bukan \u201Cprimary mati\u201D, melainkan \u201Cprimary terisolasi\u201D — runbook hanya berkata \u201Cpromosikan replica\u201D, tidak berkata \u201Cpastikan primary lama mati dulu\u201D.",
        "Kenapa ini bencana data, bukan sekadar gangguan? Dua riwayat transaksi menyimpang dan tidak bisa digabung otomatis: nomor order bentrok, stok negatif, saldo ganda. Rekonsiliasi berarti memilih SATU riwayat sebagai kebenaran dan membuang — atau mengkompensasi manual — riwayat yang lain. 312 order ganda ECom Kita bukan \u201Cdata yang hilang\u201D; itu data yang ditulis dengan susah payah lalu dibuang karena kalah dalam pemungutan suara kebenaran.",
        "Tiga pagar pencegah, dari yang paling prinsipil: (1) Kuorum ganjil — hanya sisi dengan mayoritas node yang boleh menulis; sisi minoritas wajib menolak tulis (read-only atau menolak koneksi). Di klaster 3 node, sisi 2-vs-1 selalu jelas pemenangnya. (2) Fencing/STONITH — sebelum primary baru menulis, node lama DIPASTIKAN tidak bisa menulis: dimatikan paksa lewat power atau network (\u201CShoot The Other Node In The Head\u201D). (3) Watchdog — node yang kehilangan kontak dengan wasit menghentikan dirinya sendiri daripada menebak-nebak.",
        "Membaca tanda partisi dari metrik: heartbeat hilang di satu sisi SEMENTARA node-nya terlihat sehat di monitoring lain (CPU normal, tidak ada crash log) = curigai partisi, bukan kematian. Lonjakan timeout dua arah yang simetris, DCS melaporkan lease hilang padahal agen di node mengklaim lease masih valid — itu sidik jari partisi. Aturan praktis: \u201Cnode tidak bisa dihubungi + node tampak sehat di tempat lain\u201D berarti jangan promosikan dulu — selidiki.",
        "\uD83D\uDCA1 Intuisi: dua kapten di satu kapal saat radio mati. Solusinya bukan \u201Ckapten yang suaranya lebih keras\u201D, melainkan aturan yang disepakati SEBELUM radio mati: hanya sisi dengan mayoritas awak yang boleh memerintah; sisi lain wajib menurunkan layar. Kuorum adalah aturan yang ditulis saat tenang untuk ditaati saat panik.",
        "Pemulihan: tunjuk SATU riwayat sebagai kebenaran (biasanya sisi mayoritas), buang atau kompensasi riwayat yang kalah, lalu bangun ulang node yang kalah dari nol sebagai replika baru — jangan pernah \u201Cmenggabungkan\u201D dua primary yang menyimpang. Dan janji ketersediaan adalah trade-off sadar: kebijakan ketat (tunggu kepastian kuorum) = RTO lebih lama tetapi tidak pernah split-brain; kebijakan longgar = failover cepat dengan risiko divergensi. Tulis pilihanmu di runbook — bukan menemukannya saat insiden.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `keputusan(sisi, n1_hidup)` yang mengembalikan tuple (boleh_jadi_primary, perlu_fencing)" },
        { id: "t2", text: "Hitung `hasil` untuk S1/S2/S3 dan lima variabel skalar: `promo_S2`, `tulis_minoritas_S2`, `fencing_S2`, `fencing_S1`, `tulis_minoritas_S3`" },
        { id: "t3", text: "Cetak satu baris per sisi dengan format `SK | sisi=... | ... | ...`" },
      ],
      expected: "S1 | sisi=N1 | TOLAK TULIS | fencing=Tidak\nS1 | sisi=N2+N3 | PROMOSI/MENULIS | fencing=Tidak\nS2 | sisi=N1 | TOLAK TULIS | fencing=Tidak\nS2 | sisi=N2+N3 | PROMOSI/MENULIS | fencing=Wajib\nS3 | sisi=N1+N2 | PROMOSI/MENULIS | fencing=Tidak\nS3 | sisi=N3 | TOLAK TULIS | fencing=Tidak",
      note: {
        title: "\uD83D\uDEA8 Mitos: \u201CSplit-brain sudah mustahil dengan tool modern\u201D",
        body: "Tool hanya mengeksekusi kebijakan: tanpa kuorum mayoritas dan fencing yang dikonfigurasi benar, Patroni pun bisa mempromosikan di kedua sisi — misalnya saat DCS-nya sendiri terpartisi tanpa mayoritas. Pencegah split-brain adalah arsitektur (node ganjil + wasit + fencing), bukan merek software.",
        type: "pitfall",
      },
      hints: [
        "Mayoritas dari 3 node = 2. len(sisi) < 2 berarti (False, False) — wajib menolak tulis.",
        "Fencing wajib bila N1 masih hidup DAN tidak ada di sisi ini: n1_hidup and 'N1' not in sisi.",
        "Gunakan kunci='+'.join(sorted(sisi)) agar urutan sisi stabil di semua run.",
      ],
      code: {
        starter: `# Klaster 3 node + DCS (etcd) sebagai wasit. Kuorum = mayoritas: 2 dari 3.
NODES = ["N1", "N2", "N3"]

# Skenario partisi: daftar sisi yang masih bisa saling bicara.
# S1: N1 benar-benar mati. S2: N1 hidup tapi terisolasi. S3: N3 terisolasi.
SKENARIO = {
    "S1": [["N1"], ["N2", "N3"]],
    "S2": [["N1"], ["N2", "N3"]],
    "S3": [["N1", "N2"], ["N3"]],
}
N1_HIDUP = {"S1": False, "S2": True, "S3": True}

# TULIS KODEMU
def keputusan(sisi, n1_hidup):
    return (False, False)

hasil = {}
`,
        lockLines: 13,
        solution: `# Klaster 3 node + DCS (etcd) sebagai wasit. Kuorum = mayoritas: 2 dari 3.
NODES = ["N1", "N2", "N3"]

# Skenario partisi: daftar sisi yang masih bisa saling bicara.
# S1: N1 benar-benar mati. S2: N1 hidup tapi terisolasi. S3: N3 terisolasi.
SKENARIO = {
    "S1": [["N1"], ["N2", "N3"]],
    "S2": [["N1"], ["N2", "N3"]],
    "S3": [["N1", "N2"], ["N3"]],
}
N1_HIDUP = {"S1": False, "S2": True, "S3": True}

# TULIS KODEMU
def keputusan(sisi, n1_hidup):
    """Kembalikan (boleh_jadi_primary, perlu_fencing) untuk satu sisi."""
    if len(sisi) < 2:
        return (False, False)
    perlu_fencing = n1_hidup and "N1" not in sisi
    return (True, perlu_fencing)

hasil = {}
for sk, daftar_sisi in SKENARIO.items():
    for sisi in daftar_sisi:
        kunci = "+".join(sorted(sisi))
        boleh, fencing = keputusan(sisi, N1_HIDUP[sk])
        hasil[(sk, kunci)] = (boleh, fencing)
        status = "PROMOSI/MENULIS" if boleh else "TOLAK TULIS"
        fg = "fencing=Wajib" if fencing else "fencing=Tidak"
        print(f"{sk} | sisi={kunci} | {status} | {fg}")

promo_S2 = hasil[("S2", "N2+N3")][0]
tulis_minoritas_S2 = hasil[("S2", "N1")][0]
fencing_S2 = hasil[("S2", "N2+N3")][1]
fencing_S1 = hasil[("S1", "N2+N3")][1]
tulis_minoritas_S3 = hasil[("S3", "N3")][0]
`,
        checks: [
          { kind: "defined", task: "t1", name: "keputusan", label: "Fungsi `keputusan` terdefinisi", msg: "Definisikan def keputusan(sisi, n1_hidup)." },
          { kind: "equal", task: "t2", name: "promo_S2", value: true, label: "Sisi mayoritas S2 boleh promosi", msg: "Sisi [N2,N3] punya 2 dari 3 suara: boleh menjadi primary." },
          { kind: "equal", task: "t2", name: "tulis_minoritas_S2", value: false, label: "Sisi minoritas S2 wajib menolak tulis", msg: "Sisi [N1] hanya 1 suara: tidak boleh menulis." },
          { kind: "equal", task: "t2", name: "fencing_S2", value: true, label: "S2 wajib fencing", msg: "N1 masih hidup di sisi lain: primary baru wajib mem-fence dulu." },
          { kind: "equal", task: "t2", name: "fencing_S1", value: false, label: "S1 tidak perlu fencing", msg: "N1 benar-benar mati: tidak ada yang perlu di-fence." },
          { kind: "equal", task: "t2", name: "tulis_minoritas_S3", value: false, label: "N3 terisolasi wajib menolak tulis", msg: "Sisi [N3] minoritas: menolak tulis walau nodenya sehat." },
          { kind: "stdout_matches", task: "t3", pattern: "S2 \\| sisi=N2\\+N3 \\| PROMOSI/MENULIS \\| fencing=Wajib", label: "Baris keputusan S2 tercetak", msg: "Samakan format print dengan contoh di Hasil yang diharapkan." },
        ],
      },
      reference: "Mayoritas menulis, minoritas menolak. Fence dulu, tulis kemudian.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang replikasi dan HA. Ingat kasus PayNusa dan ECom Kita.",
      ],
      tasks: [],
      summary: [
        "Replica ≠ HA: butuh monitoring lag, failover teruji, dan aplikasi yang bisa pindah.",
        "Async = cepat, RPO = lag; sync = RPO ≈ 0, bayar latensi tulis.",
        "Alert lag pada max/p99 jendela pendek — rata-rata menyembunyikan bencana.",
        "Downtime failover = deteksi + promosi + reconnect; fencing mencegah split brain.",
        "Backup tetap wajib walau sync: replikasi tidak melindungimu dari DELETE tanpa WHERE.",
      ],
      next: { label: "DBA6 — Performance Tuning", href: "/v2/learn/dba6-performa" },
      quiz: [
        {
          q: "Failover 4 menit sukses, tetapi 1.842 transaksi (37 menit) hilang. Kegagalan utamanya?",
          options: [
            { text: "Failover terlalu lambat", why: "4 menit di bawah RTO 15 menit — kecepatan bukan masalah." },
            { text: "Lag replica tidak dimonitor: RTO tercapai, RPO jebol", why: "Replica lag 37 menit tanpa alert. HA butuh monitoring lag, bukan sekadar keberadaan replica.", correct: true },
            { text: "Tidak punya backup", why: "Backup tidak relevan dengan kehilangan 37 menit transaksi pada failover." },
            { text: "Aplikasi tidak bisa reconnect", why: "Aplikasi berhasil pindah dalam 4 menit — reconnect bukan masalah." },
          ],
        },
        {
          q: "Kapan memilih replikasi sinkron?",
          options: [
            { text: "Untuk semua tabel agar aman", why: "Membayar latensi tulis di semua tabel termasuk yang tidak kritis = boros." },
            { text: "Untuk data yang kehilangan sedetiknya = bencana (saldo, pembayaran)", why: "Sync memberi RPO≈0 untuk kegagalan satu node; harganya pantas hanya untuk data kritis.", correct: true },
            { text: "Agar baca lebih cepat", why: "Sync tidak mempercepat baca; itu tugas read replica." },
            { text: "Agar tidak perlu backup", why: "Sync tidak melindungi dari kesalahan logis — backup tetap wajib." },
          ],
        },
        {
          q: "Metrik terbaik untuk alert lag replikasi?",
          options: [
            { text: "Rata-rata lag 1 jam", why: "Rata-rata 0,76 dtk terlihat hijau sementara max 12,59 dtk — bencana tersembunyi." },
            { text: "Max/p99 lag dalam jendela 5 menit", why: "Menangkap lonjakan yang menentukan RPO aktual saat kematian.", correct: true },
            { text: "Total WAL terkirim", why: "Volume bukan keterlambatan; tidak menjawab \u201Cseberapa jauh tertinggal\u201D." },
            { text: "Jumlah replica", why: "Jumlah replica bukan metrik keterlambatan." },
          ],
        },
        {
          q: "Setelah failover, primary lama ternyata hidup lagi (network partition) dan ikut menerima tulis. Ini disebut?",
          options: [
            { text: "Split brain — dua primary menulis berbeda; pencegahnya fencing", why: "Tanpa fencing/STONITH, promosi + primary lama yang hidup = divergensi data.", correct: true },
            { text: "Replication lag", why: "Lag adalah keterlambatan, bukan dua penulis bersamaan." },
            { text: "Failback", why: "Failback adalah kembali ke primary semula secara terkendali — bukan kecelakaan ini." },
            { text: "WAL replay", why: "WAL replay adalah mekanisme recovery, bukan kondisi dua primary." },
          ],
        },
        {
          q: "RTO 15 menit, RPO 5 menit, database 300 GB. Kombinasi paling tepat?",
          options: [
            { text: "Single instance + backup harian", why: "Restore 300 GB > 15 menit; RTO tidak terpenuhi." },
            { text: "Primary + async replica + alert lag + failover teruji, WAL tiap 5 menit", why: "Failover menit-menit memenuhi RTO; WAL 5 menit memenuhi RPO; alert + drill membuat HA nyata.", correct: true },
            { text: "Backup tiap 5 menit", why: "Backup 300 GB tiap 5 menit tidak realistis dan tidak mempercepat restore." },
            { text: "Sync replica antar benua", why: "Overkill untuk RPO 5 menit; latensi antar-benua menghukum setiap tulis." },
          ],
        },
        {
          q: "Tabel pembayaran direplikasi async dengan P99 lag 60 detik. Failover terjadi. Dampaknya?",
          options: [
            { text: "Tidak ada — async tetap aman", why: "60 detik lag = hingga 60 detik transaksi pembayaran HILANG (sudah dibayar user, tidak tercatat). Untuk uang, ini bencana." },
            { text: "Hingga 60 detik data pembayaran hilang — tabel ini harusnya sync", why: "Tepat: RPO = P99 lag. Uang tidak bisa 'di-replay' dari log analitik. Aturannya: sync untuk data yang kehilangan 1 detiknya = bencana; async untuk yang bisa ditoleransi.", correct: true },
            { text: "Tunggu 60 detik lalu failover", why: "Menunggu tidak mengembalikan data yang belum tereplikasi — lag adalah keterlambatan, bukan antrean yang bisa dikejar saat primary mati." },
            { text: "Naikkan bandwidth", why: "Bandwidth jarang akar masalah lag (biasanya apply lag di replica). Dan 'coba naikkan' bukan strategi RPO." },
          ],
        },
      ],
    },
  ],
};

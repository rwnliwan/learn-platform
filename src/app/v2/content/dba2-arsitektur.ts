import type { V2Lesson } from "../lib/types";

// Alur baca: aplikasi -> buffer pool (RAM, cepat) -> disk (lambat); tulis: WAL dulu baru data.
const ARCH_SVG = `<svg viewBox="0 0 480 190" role="img" aria-label="Diagram alur: aplikasi membaca dari buffer pool di RAM, meleset ke disk; tulis selalu lewat WAL dulu.">
<g font-family="var(--font-ui)">
<rect x="16" y="70" width="92" height="52" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="1.5"/>
<text x="62" y="92" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">Aplikasi</text>
<text x="62" y="108" text-anchor="middle" font-size="10" fill="var(--text-muted)">query</text>
<rect x="180" y="14" width="130" height="76" rx="8" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="1.5"/>
<text x="245" y="34" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">Buffer pool (RAM)</text>
<text x="245" y="50" text-anchor="middle" font-size="10" fill="var(--text-muted)">halaman panas · 0,1 ms</text>
<rect x="196" y="60" width="26" height="16" fill="var(--c2)"/><rect x="226" y="60" width="26" height="16" fill="var(--c2)"/><rect x="256" y="60" width="26" height="16" fill="var(--c2)" opacity="0.4"/>
<rect x="180" y="104" width="130" height="72" rx="8" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="1.5"/>
<text x="245" y="124" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">Disk</text>
<text x="245" y="140" text-anchor="middle" font-size="10" fill="var(--text-muted)">semua data · 8 ms</text>
<text x="245" y="156" text-anchor="middle" font-size="10" fill="var(--text-muted)">80x lebih lambat</text>
<rect x="360" y="70" width="104" height="52" rx="8" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="1.5"/>
<text x="412" y="92" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">WAL</text>
<text x="412" y="108" text-anchor="middle" font-size="10" fill="var(--text-muted)">tulis dulu ke sini</text>
<line x1="108" y1="80" x2="176" y2="52" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#ah)"/>
<text x="140" y="60" font-size="10" fill="var(--text-muted)">hit</text>
<line x1="108" y1="112" x2="176" y2="140" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#ah)"/>
<text x="138" y="136" font-size="10" fill="var(--text-muted)">miss</text>
<line x1="310" y1="52" x2="356" y2="80" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#ah)"/>
<text x="318" y="60" font-size="10" fill="var(--text-muted)">tulis</text>
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="var(--text-muted)" stroke-width="1.2"/></marker></defs>
</g></svg>`;

export const dba2: V2Lesson = {
  slug: "dba2-arsitektur",
  track: "Database Administrator",
  module: "Fondasi Operasi",
  title: "DBA2 — Arsitektur Database",
  estMinutes: 70,
  steps: [
    {
      id: "cerita-query-lambat",
      eyebrow: "Langkah 1 · Cerita",
      title: "Server sepi, query tetap 40 detik",
      prose: [
        "Rabu pagi, tim analis BankMini melapor: dashboard KPI yang biasanya 2 detik kini 40 detik. Tim infra mengecek: CPU database 12%, RAM 40% terpakai, tidak ada deploy baru semalam. \u201CServer-nya sehat,\u201D kata mereka, \u201Cmungkin aplikasinya yang berat.\u201D",
        "DBA yang dipanggil tidak melihat CPU — ia melihat disk. Grafik I/O read melonjak 60x tepat saat dashboard dibuka. Penyebabnya: semalam job ETL menambah 40 juta baris ke tabel transaksi, dan statistik tabel belum di-refresh. Query planner mengira tabel itu kecil, memilih full table scan, dan buffer pool (RAM) yang hanya 4 GB tidak muat menampungnya. Setiap baris dibaca dari disk yang 80x lebih lambat dari RAM.",
        "Twist-nya: tidak ada yang \u201Crusak\u201D. Server sehat, query-nya sama persis seperti kemarin, data-nya valid. Yang berubah hanya satu: planner salah menebak ukuran data. Memahami arsitektur — dari mana database membaca, ke mana ia menulis — adalah satu-satunya cara mendiagnosis ini dalam 10 menit, bukan 10 hari.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CDatabase lambat = server kurang besar\u201D",
        body: "Mayoritas kasus lambat bukan soal ukuran server, melainkan soal jalur data: apakah yang dibaca sudah ada di RAM (0,1 ms) atau harus ke disk (8 ms)? Menambah RAM tanpa memahami buffer pool seperti membeli ember lebih besar untuk atap yang bocor — kadang membantu, sering tidak.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan arsitektur database dari sisi aliran data — bukan hafalan komponen.",
        "(1) Menelusuri jalur baca (buffer pool → disk) dan jalur tulis (selalu lewat WAL dulu);",
        "(2) Menghitung volume WAL harian dari throughput tulis dan menerjemahkannya ke kebutuhan disk/retensi;",
        "(3) Menjelaskan kenapa statistik planner yang basi membuat query lambat meski index sudah benar;",
        "(4) Mendiagnosis 'query lambat' menjadi: miss rate, planner salah, atau WAL tidak di-flush.",
      ],
      tasks: [],
    },

    {
      id: "komponen-inti",
      eyebrow: "Langkah 3 · Komponen",
      title: "Tiga serangkai: storage, memori, dan WAL",
      prose: [
        "Bayangkan database sebagai perpustakaan. **Storage engine** adalah sistem raknya: mengatur bagaimana baris data disusun di halaman-halaman disk (biasanya 8 KB per halaman di Postgres), bagaimana halaman ditulis, dan bagaimana dibaca kembali. Pilihan engine menentukan trade-off baca vs tulis — persis seperti memilih rak terbuka (cepat diambil) vs arsip tertutup (hemat tempat).",
        "**Buffer pool** — Si Penjaga Pintu. Ini adalah cache halaman di RAM. Setiap query pertama-tama mencari halamannya di sini (hit, ~0,1 ms); kalau tidak ada, baru ke disk (miss, ~8 ms) lalu halamannya disimpan di pool untuk akses berikutnya. Kepribadiannya: pelit tempat tetapi murah hati pada data yang sering dipakai. Hit ratio 99% vs 80% bisa berarti beda 10x latensi — tanpa mengubah satu baris query pun.",
        "**WAL (Write-Ahead Log)** — Si Pencatat Setia. Setiap perubahan ditulis dulu ke log berurutan (sequential, cepat) sebelum halaman datanya diubah. Kalau listrik mati di tengah jalan, database me-replay WAL saat start dan tidak ada transaksi committed yang hilang. Kepribadiannya: paranoid yang menyelamatkanmu — ia tidak percaya memori, hanya percaya apa yang sudah tertulis.",
        "💡 Intuisi: 90% tuning database adalah mengatur aliran di antara tiga serangkai ini. Query lambat? Biasanya miss rate tinggi atau planner salah. Data hilang saat crash? WAL tidak di-flush dengan benar. Pahami ketiganya, dan separuh misteri DBA terpecahkan.",
        "Cara membaca: kotak 'Aplikasi' di kiri; panah baca menuju 'Buffer Pool (RAM)' — panah putus-putus ke 'Disk' menandai cache miss. Panah tulis SELALU melewati kotak 'WAL' terlebih dahulu sebelum menyentuh data.",
        "Interpretasi: dua jalur, dua nasib. Jalur baca yang sering meleset ke disk = query lambat (obatnya: tuning cache, bukan tambah index). Jalur tulis yang melewatkan WAL = data bisa hilang saat crash (obatnya: pastikan WAL di-flush dan di-archive).",
      ],
      figure: {
        svg: ARCH_SVG,
        alt: "Aplikasi membaca dari buffer pool di RAM (0,1 ms), meleset ke disk (8 ms); semua tulis melewati WAL.",
        caption: "Jalur baca dan tulis. Baca: RAM dulu, disk kalau meleset. Tulis: selalu lewat WAL agar crash-safe.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CWAL bikin database lambat, matikan saja\u201D",
        body: "WAL memang menambah satu tulis berurutan per transaksi — tetapi tulis berurutan ke log jauh lebih murah daripada tulis acak ke halaman data. Mematikan WAL (atau mode synchronous_commit=off tanpa sadar risikonya) menukar milidetik dengan risiko kehilangan transaksi committed saat crash. Jangan pernah menyentuhnya tanpa memahami RPO (DBA4).",
        type: "pitfall",
      },
    },
    {
      id: "lab-cache",
      eyebrow: "Langkah 4 · Lab simulasi",
      title: "Lab: seberapa mahal satu miss?",
      prose: [
        "Di lab ini kamu mensimulasikan 20.000 pembacaan halaman dengan pola akses realistis: 80% akses mengarah ke 1.000 halaman \u201Cpanas\u201D, sisanya tersebar ke 5.000 halaman. Cache (buffer pool) hanya muat 1.000 halaman dengan penggusuran FIFO sederhana.",
        "Rumus latensi rata-rata yang dipakai: t_rata = (hit_ratio × 0,1 ms) + ((1 − hit_ratio) × 8 ms). Perhatikan betapa dominannya suku kedua: setiap 1% miss menambah ~0,08 ms ke rata-rata — miss itu mahal.",
        "Cara membaca hasil: hit_ratio 0,56 berarti 44% bacaan harus ke disk. Interpretasi: pola aksesmu tidak cukup \u201Cpanas\u201D untuk cache sekecil ini — solusinya menaikkan ukuran buffer pool, membuat indeks agar halaman yang dibaca lebih sedikit, atau keduanya. Coba ubah: apa yang terjadi pada hit_ratio jika CACHE = 2000? (Ubah angkanya, jalankan ulang, bandingkan.)",
      ],
      formula: String.raw`t_{rata} = (h \times t_{hit}) + ((1-h) \times t_{miss})`,
      formulaNote: "h = hit ratio (fraksi bacaan dari RAM), t_hit ≈ 0,1 ms, t_miss ≈ 8 ms. Rumus ini menjelaskan kenapa menaikkan hit ratio dari 0,80 ke 0,99 memangkas latensi ~4x.",
      tasks: [
        { id: "t1", text: "Hitung `hit_ratio` = hits / N" },
        { id: "t2", text: "Hitung `avg_ms` dari rumus latensi rata-rata" },
        { id: "t3", text: "Cetak hit_ratio (4 desimal) dan avg_ms (3 desimal)" },
      ],
      expected: "hit_ratio=0.5588  avg_ms=3.585",
      note: {
        title: "💡 Intuisi: cache kecil + akses acak = bencana",
        body: "Hit ratio bukan sifat cache semata, melainkan pernikahan antara ukuran cache dan pola akses. Akses yang tersebar acak (full scan tabel besar) membuat cache sebesar apa pun tidak berguna — inilah kenapa query analitik berat sering \u201Cmengusir\u201D halaman panas milik query lain dari buffer pool.",
      },
      hints: [
        "hit_ratio = hits / N — pembagian biasa.",
        "avg_ms = hit_ratio*0.1 + (1-hit_ratio)*8.",
        "Format: print(f\"hit_ratio={hit_ratio:.4f}  avg_ms={avg_ms:.3f}\")",
      ],
      code: {
        starter: `import random\nrandom.seed(42)  # pola akses tetap, hasil bisa dibandingkan\n\nPAGES, CACHE, N = 5000, 1000, 20000\nhot = list(range(1000))\ncache, hits = {}, 0\nfor _ in range(N):\n    p = random.choice(hot) if random.random() < 0.8 else random.randrange(PAGES)\n    if p in cache:\n        hits += 1\n    else:\n        if len(cache) >= CACHE:\n            cache.pop(next(iter(cache)))\n        cache[p] = True\n\n# TULIS KODEMU: hit ratio dan latensi rata-rata (ms)\nhit_ratio = \navg_ms = \n\nprint(f"hit_ratio={hit_ratio:.4f}  avg_ms={avg_ms:.3f}")`,
        lockLines: 13,
        solution: `import random\nrandom.seed(42)  # pola akses tetap, hasil bisa dibandingkan\n\nPAGES, CACHE, N = 5000, 1000, 20000\nhot = list(range(1000))\ncache, hits = {}, 0\nfor _ in range(N):\n    p = random.choice(hot) if random.random() < 0.8 else random.randrange(PAGES)\n    if p in cache:\n        hits += 1\n    else:\n        if len(cache) >= CACHE:\n            cache.pop(next(iter(cache)))\n        cache[p] = True\n\n# TULIS KODEMU: hit ratio dan latensi rata-rata (ms)\nhit_ratio = hits / N\navg_ms = hit_ratio * 0.1 + (1 - hit_ratio) * 8\n\nprint(f"hit_ratio={hit_ratio:.4f}  avg_ms={avg_ms:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "hit_ratio", value: 0.5588, tol: 0.002, label: "`hit_ratio` ≈ 0,5588", msg: "hits/N dengan seed 42 = 11177/20000. Jangan ubah baris seed/simulasi." },
          { kind: "equal", task: "t2", name: "avg_ms", value: 3.585, tol: 0.01, label: "`avg_ms` ≈ 3,585 ms", msg: "0,5588×0,1 + 0,4412×8. Suku miss mendominasi." },
          { kind: "stdout_matches", task: "t3", pattern: "hit_ratio=0\\.5588\\s+avg_ms=3\\.585", label: "`print` menampilkan keduanya", msg: "Format 4 dan 3 desimal seperti contoh." },
        ],
      },
      reference: "hit_ratio = hits/N. avg = h*0.1 + (1-h)*8.",
    },    {
      id: "lab2-volume-wal",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: berapa besar WAL yang kamu hasilkan?",
      prose: [
        "Arsitektur bukan diagram — ia angka. 850 transaksi/detik × 1,2 KB = aliran WAL yang harus ditampung disk, direplikasi, dan di-backup. Tugasmu: hitung volume WAL per hari dan kebutuhan retensi 2 jam untuk replica.",
        "Hasilnya (~84 GB/hari) menjelaskan kenapa 'disk penuh tiba-tiba' hampir selalu WAL yang tidak ter-archive — bukan datanya.",
        "Coba juga: TPS naik 3x saat flash sale. Berapa WAL per hari? Inilah cara DBA menerjemahkan 'trafik naik' menjadi 'beli disk berapa'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `wal_gb_hari` (2 desimal)" },
        { id: "t2", text: "Hitung `wal_retensi_gb` untuk 2 jam (2 desimal)" },
        { id: "t3", text: "Hitung `ckpt_per_hari` (checkpoint tiap 15 menit)" },
      ],
      expected: "wal_gb_hari=84.05  wal_retensi_gb=7.0",
      note: {
        title: "Sering salah",
        body: "Tertukar KB→GB: bagi 1024 dua kali (KB→MB→GB), bukan sekali. 84 GB vs 86.000 GB = beda keputusan beli disk.",
      },
      hints: [
        "wal per detik (KB) = TPS * KB_PER_TX; kali 86400 detik.",
        "GB = KB / 1024 / 1024.",
        "Retensi 2 jam = wal_gb_hari / 24 * 2.",
      ],
      code: {
        starter: `# Beban tulis: 850 transaksi/detik, rata-rata 1 WAL record = 1,2 KB per transaksi.\n# Checkpoint tiap 15 menit; retensi WAL untuk replica: 2 jam.\nTPS, KB_PER_TX = 850, 1.2\n# TULIS KODEMU: wal_gb_hari, wal_retensi_gb, ckpt_per_hari\nwal_gb_hari = 0.0\nwal_retensi_gb = 0.0\nckpt_per_hari = 0\n`,
        lockLines: 3,
        solution: `# Beban tulis: 850 transaksi/detik, rata-rata 1 WAL record = 1,2 KB per transaksi.\n# Checkpoint tiap 15 menit; retensi WAL untuk replica: 2 jam.\nTPS, KB_PER_TX = 850, 1.2\n\n# TULIS KODEMU: wal_gb_hari, wal_retensi_gb, ckpt_per_hari\nwal_kb_detik = TPS * KB_PER_TX\nwal_gb_hari = round(wal_kb_detik * 86400 / 1024 / 1024, 2)\nwal_retensi_gb = round(wal_gb_hari / 24 * 2, 2)\nckpt_per_hari = 24 * 60 // 15\n\nprint(f"wal_gb_hari={wal_gb_hari}  wal_retensi_gb={wal_retensi_gb}")\nprint(f"ckpt_per_hari={ckpt_per_hari}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "wal_gb_hari", value: 84.05, tol: 0.01, label: "`wal_gb_hari` = 84,05", msg: "850×1,2 KB×86400 → GB." },
          { kind: "equal", task: "t2", name: "wal_retensi_gb", value: 7.0, tol: 0.01, label: "`wal_retensi_gb` = 7,0", msg: "2 jam dari 84,05/hari." },
          { kind: "equal", task: "t3", name: "ckpt_per_hari", value: 96, label: "`ckpt_per_hari` = 96", msg: "24×60/15." },
        ],
      },
      reference: "WAL sizing: throughput tulis × ukuran record × retensi.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Kalau hanya boleh mengingat satu kalimat arsitektur: 'baca dari RAM, tulis lewat WAL'. 90% diagnosis performa dan 90% skenario kehilangan data bermuara ke dua jalur ini.",
        "💡 WAL adalah 'kotak hitam' database: saat crash, yang menyelamatkanmu bukan backup kemarin — melainkan WAL yang belum ter-backup. Lindungi WAL seperti melindungi data itu sendiri.",
      ],
      tasks: [],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: baca arsitektur, tentukan aksi",
      prose: [
        "Skenario 1 — Query lambat, CPU rendah, I/O disk tinggi. → Cek hit ratio buffer pool dan query plan (apakah full scan?). Alasan: gejala klasik miss cache atau planner salah tebak; menambah CPU tidak menyentuh masalahnya.",
        "Skenario 2 — Database lambat SETELAH crash/restart. → Wajar sementara: buffer pool kosong (cold cache) dan WAL replay. Alasan: butuh waktu hingga halaman panas kembali ke RAM; jangan panik lalu scale-up — ukur hit ratio 30 menit kemudian.",
        "Skenario 3 — Tulis (INSERT/UPDATE) lambat tetapi baca cepat. → Cek WAL: disk WAL penuh/lambat, checkpoint terlalu agresif, atau terlalu banyak indeks (setiap tulis meng-update semua indeks). Alasan: jalur tulis ≠ jalur baca; masalahnya di sisi pencatatan, bukan pembacaan.",
        "Skenario 4 — Ingin menaikkan shared_buffers. → Boleh hingga ~25% RAM, tetapi sisakan untuk OS cache + koneksi. Alasan: OS juga meng-cache file database (double buffering); RAM yang \u201Cdihemat\u201D dari database tidak terbuang — ia dipakai OS cache. Detail angkanya di DBA3.",
        "Aturan praktis 10 detik: lambat + CPU sepi = lihat disk & cache dulu; lambat setelah restart = tunggu cache hangat; tulis lambat = selidiki WAL & indeks.",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: 40 juta baris semalam",
      prose: [
        "Kembali ke BankMini. Fakta: tabel transaksi 40 juta baris baru (≈ 8 GB, halaman 8 KB → ~1 juta halaman). Buffer pool 4 GB menampung ~500 ribu halaman. Query dashboard memindai seluruh tabel setiap dibuka (full scan). Hit ratio efektif untuk query ini ≈ 0% — setiap halaman diambil dari disk.",
        "Hitung kasar: 1 juta halaman × 8 ms = 8.000 detik? Tidak — disk modern membaca berurutan jauh lebih cepat (~0,05 ms/halaman sequential), jadi ~50 detik. Cocok dengan laporan \u201C40 detik\u201D. Dua perbaikan diusulkan: (A) naikkan buffer pool ke 16 GB (Rp2 juta/bulan), (B) buat indeks pada kolom tanggal + refresh statistik (gratis, 20 menit kerja).",
        "Pembahasan: opsi B menyerang akar masalah — dengan indeks, query hanya membaca halaman yang berisi 1 hari data (≈ 110 ribu baris ≈ 1.100 halaman ≈ muat di cache, ~0,1 ms/halaman → ~0,1 detik). Opsi A membantu tetapi tabel tumbuh 40 juta baris/bulan; 16 GB akan penuh lagi dalam 2 bulan. Keputusan DBA yang benar: B sekarang (gratis, permanen untuk pola query ini), A hanya jika working set keseluruhan memang melebihi RAM. Pelajaran: pahami dulu arsitekturnya — dari mana data dibaca — sebelum membeli hardware.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: statistik planner adalah \u201Cpeta\u201D database",
        body: "Planner tidak melihat datamu; ia melihat statistik ringkas (ANALYZE) tentang datamu. Statistik basi = peta kedaluwarsa = keputusan rute yang salah. Banyak \u201Cmisteri performa\u201D selesai hanya dengan menjalankan ANALYZE setelah load data besar.",
      },
    },
    {
      id: "mvcc-isolation",
      eyebrow: "Langkah 9 · Konkurensi",
      title: "MVCC, level isolasi, dan locking",
      prose: [
        "Dua teller, satu rekening berisi Rp1.000.000. Hampir bersamaan, keduanya mendebit Rp200.000: masing-masing membaca saldo 1.000.000, mengurangi 200.000, lalu menulis 800.000. Saldo akhir: 800.000 — padahal seharusnya 600.000. Rp200.000 lenyap tanpa satu pun error tercatat. Ini namanya lost update, kejahatan paling sunyi di database: setiap transaksi benar sendirian, salah bersama-sama.",
        "Inilah masalah konkurensi: puluhan hingga ratusan transaksi berjalan tumpang tindih. Tanpa aturan main, urutan baca-tulis yang sedikit bergeser menghasilkan angka yang tidak bisa dipertanggungjawabkan. Solusinya bukan \u201Cjalankan satu per satu\u201D (terlalu lambat), melainkan aturan tentang versi data apa yang boleh dilihat siapa: itulah MVCC.",
        "MVCC (Multi-Version Concurrency Control) — Si Tukang Foto. Setiap transaksi membaca snapshot yang konsisten: potret data pada satu titik waktu. Penulis membuat versi baru baris tanpa memblokir pembaca — pembaca tetap melihat versi lama yang \u201Cdifoto\u201D tadi. Versi-versi lama dibersihkan setelah tidak ada transaksi yang membutuhkannya. Akibatnya: baca tidak pernah antre di belakang tulis. Dua penulis berebut baris yang sama? Yang kedua menunggu yang pertama selesai, atau dibatalkan bila konflik.",
        "Level isolasi = seberapa paranoid kamu pada transaksi tetangga. READ COMMITTED (bawaan Postgres): setiap statement melihat data yang sudah committed saat statement itu mulai — mencegah dirty read, yaitu membaca data yang ternyata dibatalkan. REPEATABLE READ: seluruh transaksi memakai satu snapshot; baca ulang hasilnya sama — mencegah non-repeatable read. SERIALIZABLE: transaksi diperlakukan seolah berjalan satu per satu; mencegah segalanya termasuk phantom (baris baru yang tiba-tiba muncul di tengah hitunganmu). Harganya: makin tinggi level, makin sering transaksi dibatalkan karena konflik saat beban tinggi — aplikasimu wajib siap mengulang (retry). Catatan jujur: detail persis tiap level berbeda antar mesin; ini gambaran umumnya.",
        "Locking eksplisit — Si Penjaga Antrean. UPDATE dan DELETE otomatis mengunci barisnya. Kalau kamu membaca lalu berencana meng-update (pola baca-dulu-tulis-kemudian seperti kasus dua teller), kunci duluan dengan SELECT ... FOR UPDATE agar tidak disalip. Deadlock: transaksi A mengunci baris 1 lalu menunggu baris 2, sementara B mengunci baris 2 lalu menunggu baris 1 — keduanya macet selamanya. Database menyelamatkanmu dengan mematikan salah satunya (deadlock error). Obatnya: kunci dalam urutan yang konsisten dan buat transaksi sependek mungkin.",
        "💡 Intuisi: level isolasi adalah tombol paranoia. Nol paranoia = cepat tapi bisa membaca halusinasi; paranoia maksimal = tenang tapi sering diminta mengulang. Kebanyakan aplikasi OLTP hidup nyaman di read committed ditambah kehati-hatian di kode aplikasi; penyelesaian keuangan yang tidak boleh salah hitung memilih serializable dan membayar harganya dengan retry.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan dengan kata-katamu: kenapa pembaca tidak pernah memblokir penulis di MVCC?" },
        { id: "t2", text: "Transfer antarbank 10.000 transaksi/detik tidak boleh salah hitung. Level isolasi apa yang kamu usulkan, dan apa harganya?" },
      ],
      expected: "t1: pembaca membaca snapshot versi lama, bukan menunggu tulis selesai. t2: serializable; harga = konflik & pembatalan naik, aplikasi wajib retry, throughput bisa turun.",
      note: {
        title: "🚨 Mitos: \u201CSet SERIALIZABLE, beres, paling aman\u201D",
        body: "Serializable memang mencegah semua anomali — tetapi ia bisa menggagalkan transaksimu (serialization failure) begitu ada konflik. Aplikasi yang tidak menangani retry akan meledak dengan error acak di produksi. Keamanan tanpa retry = bom waktu. Pilih level sesuai kebutuhan dan uji perilakunya di beban nyata, bukan yang terdengar paling aman.",
        type: "pitfall",
      },
      reference: "MVCC: baca snapshot, tulis tak blokir baca. Isolasi = paranoia; bayar dengan konflik & retry.",
    },
    {
      id: "perbandingan-mesin-sql",
      eyebrow: "Langkah 10 · Mesin SQL",
      title: "Mesin SQL lain: MySQL, SQL Server, Oracle",
      prose: [
        "DBA jarang memilih mesin dari kertas kosong. Yang memilih biasanya warisan: kontrak dukungan yang sudah dibayar, tim yang hanya kenal satu mesin, atau aplikasi vendor yang tulisannya jelas — \u201Chanya didukung di Oracle\u201D. Tugasmu bukan memenangkan perang mesin, melainkan membaca peta perbedaannya agar tidak kaget saat pindah.",
        "Lisensi & ekosistem. PostgreSQL dan MySQL: open source, gratis, komunitas besar — kamu yang bertanggung jawab penuh. SQL Server dan Oracle: komersial — lisensi per core atau per edisi, dukungan vendor resmi dengan SLA. Biaya sesungguhnya bukan cuma lisensi: termasuk keahlian tim yang tersedia dan perkakas yang menyertainya.",
        "Dialek & fitur khas. MySQL: sintaks LIMIT yang sederhana, storage engine InnoDB, budaya \u201Ccukup cepat dan ringan\u201D. SQL Server: T-SQL (pakai TOP, bukan LIMIT), menyatu dengan Windows dan Active Directory, perkakas SSMS yang disukai operator. Oracle: PL/SQL untuk logika di dalam database, optimizer legendaris untuk query kompleks, RAC untuk klaster multi-node. Satu-dua ciri tiap mesin — cukup untuk mengenali aksennya, bukan untuk fasih.",
        "Model konkurensi default pun berbeda. Postgres memakai MVCC snapshot untuk semua pembaca (pelajaran Langkah 9). SQL Server secara default bisa membuat pembaca menunggu penulis — ada mode snapshot, tetapi harus dinyalakan secara sadar. Oracle menjamin baca konsisten multi-versi sejak lama. Akibatnya: asumsi \u201Cbaca tidak memblokir\u201D tidak bisa dibawa pindah mesin begitu saja. Selalu uji perilaku konkurensi di mesin target, bukan di kepalamu.",
        "Kapan faktor non-teknis menang? Hampir selalu, di dunia nyata: kontrak dukungan 3 tahun yang sudah ditandatangani, tim 20 orang yang semuanya bersertifikat satu vendor, aplikasi ERP yang vendornya menolak bertanggung jawab bila dijalankan di mesin lain. Peringatan portabilitas: memindahkan skema itu mudah; memindahkan logika yang tertulis dalam dialek (prosedur PL/SQL, fungsi khusus vendor) itu sulit dan mahal. Setiap baris kode dialek adalah rantai.",
        "💡 Intuisi: prinsipnya sama, dialeknya berbeda. DBA senior di mesin mana pun mengenali pola yang sama — isolasi, locking, WAL/redo log, statistik planner. Pelajari prinsipnya sekali sampai dalam, lalu pelajari dialek barunya. Urutan belajar yang benar: prinsip dulu, aksen kemudian.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan fungsi `rekomendasi(sk)` mengikuti aturan keputusan di komentar starter" },
        { id: "t2", text: "Bangun `mesin_saja` (daftar mesin per skenario) dan cetak ringkasannya" },
        { id: "t3", text: "Cetak tiap skenario beserta mesin yang direkomendasikan" },
      ],
      expected: "saas_startup -> MySQL, bank_legacy -> Oracle, toko_windows -> SQL Server, blog_pribadi -> MySQL, erp_java -> PostgreSQL; ringkasan: MySQL=2, Oracle=1, PostgreSQL=1, SQL Server=1",
      note: {
        title: "🚨 Mitos: \u201CMesin X selalu lebih cepat dari Y\u201D",
        body: "Benchmark tanpa beban kerjamu sendiri adalah iklan. Mesin yang tercepat untuk OLTP ringan bisa jadi yang paling lambat untuk analitik berat — di hardware dan data yang sama. Kalau ada yang mengklaim \u201Ctercepat\u201D tanpa menyebut workload, tanyakan workload-nya; kalau tidak ada jawabannya, abaikan klaimnya.",
        type: "pitfall",
      },
      code: {
        starter: `# Lima kebutuhan nyata. Aturan keputusan (sederhana, untuk latihan berpikir):
# - vendor "kontrak oracle"       -> Oracle      (kontrak & dukungan sudah mengikat)
# - vendor "ekosistem microsoft"  -> SQL Server  (menyatu dengan Windows/AD)
# - dana "ketat"                  -> MySQL       (gratis & ringan untuk beban umum)
# - selain itu                    -> PostgreSQL  (fitur lengkap tanpa biaya lisensi)
SKENARIO = [
    {"id": "saas_startup", "dana": "ketat", "vendor": "bebas", "butuh": "JSON + replikasi sederhana"},
    {"id": "bank_legacy", "dana": "longgar", "vendor": "kontrak oracle", "butuh": "dukungan vendor 24/7"},
    {"id": "toko_windows", "dana": "sedang", "vendor": "ekosistem microsoft", "butuh": "login Active Directory"},
    {"id": "blog_pribadi", "dana": "ketat", "vendor": "bebas", "butuh": "paling ringan, baca-berat"},
    {"id": "erp_java", "dana": "sedang", "vendor": "bebas", "butuh": "SQL standar ketat, transaksi berat"},
]

def rekomendasi(sk):
    # TULIS KODEMU: kembalikan tuple (mesin, alasan) sesuai aturan di atas
    return ("?", "?")

# TULIS KODEMU: mesin_saja = daftar mesin untuk tiap skenario, sesuai urutan SKENARIO
mesin_saja = []

for sk, m in zip(SKENARIO, mesin_saja):
    print(f"{sk['id']} -> {m}")
from collections import Counter
ringkas = Counter(mesin_saja)
print("ringkasan:", ", ".join(f"{k}={v}" for k, v in sorted(ringkas.items())))`,
        lockLines: 14,
        solution: `# Lima kebutuhan nyata. Aturan keputusan (sederhana, untuk latihan berpikir):
# - vendor "kontrak oracle"       -> Oracle      (kontrak & dukungan sudah mengikat)
# - vendor "ekosistem microsoft"  -> SQL Server  (menyatu dengan Windows/AD)
# - dana "ketat"                  -> MySQL       (gratis & ringan untuk beban umum)
# - selain itu                    -> PostgreSQL  (fitur lengkap tanpa biaya lisensi)
SKENARIO = [
    {"id": "saas_startup", "dana": "ketat", "vendor": "bebas", "butuh": "JSON + replikasi sederhana"},
    {"id": "bank_legacy", "dana": "longgar", "vendor": "kontrak oracle", "butuh": "dukungan vendor 24/7"},
    {"id": "toko_windows", "dana": "sedang", "vendor": "ekosistem microsoft", "butuh": "login Active Directory"},
    {"id": "blog_pribadi", "dana": "ketat", "vendor": "bebas", "butuh": "paling ringan, baca-berat"},
    {"id": "erp_java", "dana": "sedang", "vendor": "bebas", "butuh": "SQL standar ketat, transaksi berat"},
]

def rekomendasi(sk):
    if sk["vendor"] == "kontrak oracle":
        return ("Oracle", "kontrak & dukungan vendor sudah mengikat")
    if sk["vendor"] == "ekosistem microsoft":
        return ("SQL Server", "menyatu dengan ekosistem Windows/AD")
    if sk["dana"] == "ketat":
        return ("MySQL", "gratis dan ringan untuk beban umum")
    return ("PostgreSQL", "fitur lengkap tanpa biaya lisensi")

mesin_saja = [rekomendasi(sk)[0] for sk in SKENARIO]

for sk, m in zip(SKENARIO, mesin_saja):
    print(f"{sk['id']} -> {m}")
from collections import Counter
ringkas = Counter(mesin_saja)
print("ringkasan:", ", ".join(f"{k}={v}" for k, v in sorted(ringkas.items())))`,
        checks: [
          { kind: "defined", task: "t1", name: "rekomendasi", label: "Fungsi `rekomendasi` terdefinisi", msg: "Definisikan fungsi rekomendasi(sk) yang mengembalikan tuple (mesin, alasan)." },
          { kind: "equal", task: "t2", name: "mesin_saja", value: ["MySQL", "Oracle", "SQL Server", "MySQL", "PostgreSQL"], label: "`mesin_saja` sesuai aturan keputusan", msg: "Urutan vendor dulu: kontrak oracle -> Oracle, ekosistem microsoft -> SQL Server, dana ketat -> MySQL, sisanya PostgreSQL." },
          { kind: "stdout_matches", task: "t3", pattern: "ringkasan: MySQL=2, Oracle=1, PostgreSQL=1, SQL Server=1", label: "Ringkasan per mesin tercetak", msg: "Format persis: ringkasan: MySQL=2, Oracle=1, PostgreSQL=1, SQL Server=1" },
        ],
      },
      reference: "Prinsip sama (isolasi, locking, WAL, statistik), dialek berbeda. Pilih mesin = pilih ekosistem, bukan cuma kecepatan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang arsitektur. Fokus pada hubungan sebab-akibat antar komponen.",
      ],
      tasks: [],
      summary: [
        "Storage engine mengatur susunan halaman di disk; buffer pool meng-cache halaman panas di RAM (0,1 ms vs 8 ms); WAL mencatat dulu sebelum mengubah data agar crash-safe.",
        "Latensi rata-rata = h×t_hit + (1−h)×t_miss — miss mendominasi, jadi hit ratio adalah metrik kunci.",
        "Query lambat + CPU sepi → selidiki disk, cache, dan query plan; bukan langsung scale-up.",
        "Setelah restart, cache dingin membuat database sementara lambat — ukur ulang setelah hangat.",
        "Planner memutuskan berdasar statistik; statistik basi setelah bulk load = rencana eksekusi salah.",
      ],
      next: { label: "DBA3 — Instalasi & Konfigurasi", href: "/v2/learn/dba3-instalasi" },
      quiz: [
        {
          q: "Query 40 detik, CPU 12%, I/O disk 60x normal. Diagnosis paling mungkin?",
          options: [
            { text: "CPU kurang besar", why: "CPU justru sepi (12%) — menambah CPU tidak menyentuh I/O." },
            { text: "Buffer pool miss / full table scan: data dibaca dari disk, bukan RAM", why: "Kombinasi CPU sepi + I/O meledak adalah sidik jari klasik: query memindai dari disk karena tidak ada di cache atau planner salah pilih.", correct: true },
            { text: "Koneksi database habis", why: "Koneksi habis menimbulkan error penolakan, bukan query lambat 40 detik." },
            { text: "WAL corrupt", why: "WAL corrupt menyebabkan crash/gagal start, bukan sekadar lambat." },
          ],
        },
        {
          q: "Hit ratio naik dari 0,80 ke 0,99 (t_hit=0,1 ms, t_miss=8 ms). Berapa kira-kira speedup latensi rata-rata?",
          options: [
            { text: "1,2x", why: "Terlalu kecil; hitung: sebelum = 0,8×0,1+0,2×8 = 1,68 ms." },
            { text: "~9x", why: "Sebelum 1,68 ms; sesudah 0,99×0,1+0,01×8 = 0,179 ms. 1,68/0,179 ≈ 9,4x.", correct: true },
            { text: "80x", why: "80x adalah rasio t_miss/t_hit, bukan speedup latensi rata-rata." },
            { text: "Tidak berubah signifikan", why: "Suku miss turun dari 1,6 ms ke 0,08 ms — sangat signifikan." },
          ],
        },
        {
          q: "Kenapa semua tulis harus lewat WAL dulu?",
          options: [
            { text: "Agar tulis lebih cepat", why: "WAL menambah satu tulis; tujuannya bukan kecepatan." },
            { text: "Agar transaksi yang sudah committed selamat dari crash (durability)", why: "WAL adalah catatan berurutan yang bisa di-replay saat start ulang — inilah penjamin durability.", correct: true },
            { text: "Agar bisa dibaca aplikasi lain", why: "WAL adalah struktur internal, bukan antarmuka baca." },
            { text: "Agar hemat disk", why: "WAL justru memakai ruang disk tambahan." },
          ],
        },
        {
          q: "Database lambat tepat setelah restart, 30 menit kemudian normal sendiri. Penjelasan terbaik?",
          options: [
            { text: "Ada bug yang hilang sendiri", why: "Bug tidak sembuh sendiri terjadwal 30 menit." },
            { text: "Cold cache: buffer pool kosong setelah restart, lalu menghangat seiring query", why: "Setelah restart semua halaman harus dibaca ulang dari disk; hit ratio pulih bertahap. Inilah perilaku yang diharapkan.", correct: true },
            { text: "WAL replay merusak data", why: "WAL replay memulihkan, bukan merusak; dan tidak butuh 30 menit untuk query normal." },
            { text: "Koneksi bocor lalu tertutup", why: "Koneksi bocor tidak sembuh sendiri tanpa restart aplikasi." },
          ],
        },
        {
          q: "Setelah bulk load 40 juta baris, planner memilih full scan untuk query yang kemarin memakai indeks. Langkah pertama?",
          options: [
            { text: "Buat indeks baru", why: "Indeksnya sudah ada; masalahnya planner tidak tahu data berubah." },
            { text: "Jalankan ANALYZE untuk refresh statistik planner", why: "Planner memutuskan dari statistik; bulk load membuatnya basi. ANALYZE murah dan sering menyelesaikan masalah.", correct: true },
            { text: "Naikkan shared_buffers", why: "Tidak menyentuh akar masalah: keputusan plan yang salah." },
            { text: "Restart database", why: "Restart tidak memperbarui statistik dan mengosongkan cache — memperburuk keadaan." },
          ],
        },
        {
          q: "Setelah crash, database pulih tetapi 5 menit transaksi terakhir hilang. Padahal backup tadi malam ada. Yang gagal?",
          options: [
            { text: "Backup-nya corrupt", why: "Backup tadi malam tidak relevan untuk 5 menit terakhir — ia hanya sampai tadi malam. Yang seharusnya menyelamatkan 5 menit terakhir = WAL yang belum ter-archive." },
            { text: "WAL tidak di-flush/di-archive dengan benar", why: "Tepat: jalur tulis = WAL dulu, data kemudian. Transaksi yang WAL-nya belum mencapai disk/archive hilang saat crash. Backup = titik kemarin; WAL = jembatan ke kini. Jembatan yang putus = 5 menit hilang.", correct: true },
            { text: "Buffer pool terlalu kecil", why: "Buffer pool memengaruhi kecepatan baca, bukan daya tahan tulis." },
            { text: "Planner salah pilih index", why: "Planner memengaruhi performa query, bukan kehilangan data." },
          ],
        },
      ],
    },
  ],
};

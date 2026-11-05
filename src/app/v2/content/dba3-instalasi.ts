import type { V2Lesson } from "../lib/types";

// Anggaran memori 64 GB: shared_buffers 25%, OS cache ~50%, koneksi+work_mem sisanya.
const MEM_SVG = `<svg viewBox="0 0 480 150" role="img" aria-label="Anggaran memori 64 GB: shared buffers 16 GB, OS cache 32 GB, koneksi dan work mem 16 GB.">
<g font-family="var(--font-ui)">
<rect x="30" y="52" width="105" height="44" fill="var(--c2)" opacity="0.85"/>
<rect x="135" y="52" width="210" height="44" fill="var(--c3)" opacity="0.85"/>
<rect x="345" y="52" width="105" height="44" fill="var(--c4)" opacity="0.85"/>
<text x="82" y="72" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">16 GB</text>
<text x="82" y="88" text-anchor="middle" font-size="10" fill="var(--text-muted)">shared_buffers</text>
<text x="240" y="72" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">32 GB</text>
<text x="240" y="88" text-anchor="middle" font-size="10" fill="var(--text-muted)">OS cache (jangan diambil!)</text>
<text x="397" y="72" text-anchor="middle" font-size="12" fill="var(--text)" font-weight="600">16 GB</text>
<text x="397" y="88" text-anchor="middle" font-size="10" fill="var(--text-muted)">koneksi + work_mem</text>
<text x="240" y="30" text-anchor="middle" font-size="12" fill="var(--text-muted)">Anggaran memori server 64 GB</text>
<text x="240" y="122" text-anchor="middle" font-size="11" fill="var(--text-muted)">shared_buffers 25% · sisakan ruang untuk OS cache — ia juga meng-cache file database</text>
</g></svg>`;

export const dba3: V2Lesson = {
  slug: "dba3-instalasi",
  track: "Database Administrator",
  module: "Fondasi Operasi",
  title: "DBA3 — Instalasi & Konfigurasi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-default",
      eyebrow: "Langkah 1 · Cerita",
      title: "Server 64 GB yang berperilaku seperti 128 MB",
      prose: [
        "Startup LogiTrack menyewa server 64 GB RAM untuk database Postgres-nya. Sebulan kemudian, CEO protes: \u201CNgapain bayar server mahal kalau query tetap 5 detik?\u201D Tim infra menunjuk grafik: RAM terpakai cuma 9 GB. \u201CDatabase-nya yang memang seberat itu,\u201D kata mereka.",
        "DBA freelance yang dipanggil membuka satu file: postgresql.conf. Isinya nyaris bawaan installer: shared_buffers = 128 MB, work_mem = 4 MB, max_connections = 100, effective_cache_size = 4 GB. Database 64 GB itu dikonfigurasi seolah ia berjalan di laptop tahun 2008. Setelah tuning 30 menit (shared_buffers 16 GB, work_mem 64 MB, dst.), query 5 detik menjadi 300 ms — tanpa ganti server, tanpa ganti query.",
        "Twist-nya: tidak ada yang salah dengan instalasinya — installer memang sengaja memberi default konservatif agar database bisa jalan di mesin sekecil apa pun. Default itu aman untuk install, tetapi hampir selalu salah untuk produksi. Pekerjaan DBA dimulai tepat di titik ini: menerjemahkan \u201Caman untuk semua\u201D menjadi \u201Coptimal untuk beban kita\u201D.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CInstall selesai = database siap produksi\u201D",
        body: "Install hanyalah 10% pekerjaan. 90%-nya adalah konfigurasi: parameter memori, checkpoint, WAL, koneksi, dan monitoring. Database yang \u201Cbaru di-install dan langsung dipakai produksi\u201D adalah bom waktu ber-timer acak — biasanya meledak saat traffic naik.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa meracik konfigurasi database dari spesifikasi server — bukan copy-paste dari internet.",
        "(1) Menghitung shared_buffers (25% RAM), effective_cache_size (75%), dan work_mem dari RAM dan max_connections;",
        "(2) Menghitung kebutuhan koneksi (server × pool) vs max_connections dan memutuskan: naikkan atau pasang pooler;",
        "(3) Menjelaskan kenapa 'tambah RAM' tidak selalu mempercepat (bottleneck bisa di tempat lain);",
        "(4) Mendokumentasikan alasan tiap parameter agar bisa diaudit 6 bulan kemudian.",
      ],
      tasks: [],
    },

    {
      id: "parameter-penting",
      eyebrow: "Langkah 3 · Parameter",
      title: "Lima parameter yang menentukan nasibmu",
      prose: [
        "**shared_buffers** — Si Gudang Utama. Buffer pool Postgres (DBA2): berapa RAM yang dipakai meng-cache halaman data. Aturan praktis: 25% dari RAM server. Kepribadiannya: rakus tetapi efisien — terlalu kecil = miss terus; terlalu besar = mencuri jatah OS cache dan koneksi.",
        "**effective_cache_size** — Si Penasihat Planner. Bukan alokasi nyata, melainkan tebakan \u201Ctotal cache yang tersedia (shared_buffers + OS cache)\u201D, biasanya 50–75% RAM. Planner memakainya untuk memutuskan index scan vs full scan. Salah set = planner salah rute (ingat BankMini di DBA2).",
        "**work_mem** — Si Meja Kerja. Memori per operasi sort/hash per query. 4 MB default sering kekecilan untuk agregasi besar (sort tumpah ke disk = lambat 10–100x), tetapi terlalu besar berbahaya: 200 koneksi × 500 MB = 100 GB, server OOM dan mati. Rumus aman di lab bawah.",
        "**max_connections** — Si Penjaga Pintu (lanjutan DBA1). Tiap koneksi makan ~10 MB + work_mem potensial. 100 default terlalu kecil untuk aplikasi modern; 1000 tanpa pooling terlalu besar untuk RAM. Solusi dewasa: angka moderat (200–300) + connection pooler (PgBouncer).",
        "**checkpoint & WAL** — Si Tukang Bersih-bersih. checkpoint_timeout / max_wal_size mengatur seberapa sering halaman kotor ditulis ke disk. Terlalu agresif = I/O terus-menerus; terlalu jarang = recovery setelah crash lama (banyak WAL di-replay). Untuk produksi: checkpoint_timeout 15 menit, max_wal_size 4–8 GB adalah titik awal yang waras.",
        "💡 Intuisi: konfigurasi adalah anggaran, bukan angka ajaib. RAM itu tetap; yang kamu lakukan hanyalah membaginya antar penghuni (lihat grafik). Setiap parameter yang kamu naikkan mengambil dari kantong penghuni lain — tidak ada makan siang gratis di dalam satu server.",
        "Cara membaca: satu bar 64 GB dibagi tiga segmen — shared_buffers 16 GB (25%), OS cache 32 GB (~50%), koneksi + work_mem 16 GB (sisanya). Yang penting proporsinya, bukan angka mutlaknya.",
        "Interpretasi: OS cache mendapat porsi TERBESAR — PostgreSQL sengaja mengandalkan page cache OS untuk baca. shared_buffers raksasa (mis. 48 GB) mencuri jatah OS dan justru memperlambat. Anggaran memori = soal prioritas, bukan soal rakus.",
      ],
      figure: {
        svg: MEM_SVG,
        alt: "Anggaran memori 64 GB: shared_buffers 16 GB, OS cache 32 GB, koneksi dan work_mem 16 GB.",
        caption: "Anggaran memori: shared_buffers 25%, OS cache ~50% (jangan diambil — ia meng-cache file database juga), sisanya untuk koneksi dan work_mem.",
      },
      tasks: [],
    },
    {
      id: "lab-konfigurasi",
      eyebrow: "Langkah 4 · Lab simulasi",
      title: "Lab: racik konfigurasi dari spesifikasi server",
      prose: [
        "Server: RAM 64 GB, aplikasi butuh hingga 200 koneksi. Tugasmu meracik tiga parameter memakai aturan praktis industri: shared_buffers = 25% RAM; effective_cache_size = 75% RAM; work_mem = (RAM − shared_buffers) / max_connections / 2 (faktor /2 sebagai margin karena tidak semua koneksi sort bersamaan).",
        "Cara membaca hasil: shared_buffers 16.384 MB adalah \u201Cgudang\u201D-mu; effective_cache_size 49.152 MB adalah angka yang kamu laporkan ke planner; work_mem ~123 MB per operasi adalah meja kerja tiap query. Interpretasi: jika query analis sering sort 500 MB data, work_mem 123 MB berarti sort tumpah ke disk — solusinya bukan menaikkan work_mem membabi buta (risiko OOM), melainkan connection pool + menaikkan secukupnya.",
        "Coba eksplorasi: ubah RAM menjadi 16 GB (server kecil) — berapa work_mem-mu? Apakah masih aman? Inilah cara DBA berpikir: angka mengikuti aritmetika, bukan firasat.",
      ],
      formula: String.raw`\text{work\_mem} = \frac{\text{RAM} - \text{shared\_buffers}}{\text{max\_connections} \times 2}`,
      formulaNote: "Semua dalam MB. Pembagi 2 adalah margin keamanan: asumsinya tidak semua koneksi melakukan sort/hash besar pada saat yang persis sama. Tanpa margin, lonjakan bersamaan = OOM.",
      tasks: [
        { id: "t1", text: "Hitung `shared_buffers` (MB) = 25% dari RAM" },
        { id: "t2", text: "Hitung `effective_cache_size` (MB) = 75% dari RAM" },
        { id: "t3", text: "Hitung `work_mem` (MB), dibulatkan 1 desimal" },
      ],
      expected: "shared_buffers=16384  effective_cache_size=49152  work_mem=122.9",
      note: {
        title: "Sering salah",
        body: "Lupa konversi GB ke MB (1 GB = 1024 MB), atau membagi work_mem tanpa margin /2. Selalu tulis satuannya di tiap langkah — bug unit adalah pembunuh diam-diam di konfigurasi.",
      },
      hints: [
        "RAM_MB = 64 * 1024.",
        "shared_buffers = RAM_MB * 0.25; effective = RAM_MB * 0.75.",
        "work_mem = round((RAM_MB - shared_buffers) / max_conn / 2, 1)",
      ],
      code: {
        starter: `# Peracik konfigurasi Postgres\n# Baris ini disiapkan (jangan diubah)\nRAM_GB = 64\nmax_conn = 200\nRAM_MB = RAM_GB * 1024\n\n# TULIS KODEMU: tiga parameter kunci (MB)\nshared_buffers = \neffective_cache_size = \nwork_mem = \n\nprint(f"shared_buffers={shared_buffers}  effective_cache_size={effective_cache_size}  work_mem={work_mem}")`,
        lockLines: 5,
        solution: `# Peracik konfigurasi Postgres\n# Baris ini disiapkan (jangan diubah)\nRAM_GB = 64\nmax_conn = 200\nRAM_MB = RAM_GB * 1024\n\n# TULIS KODEMU: tiga parameter kunci (MB)\nshared_buffers = int(RAM_MB * 0.25)\neffective_cache_size = int(RAM_MB * 0.75)\nwork_mem = round((RAM_MB - shared_buffers) / max_conn / 2, 1)\n\nprint(f"shared_buffers={shared_buffers}  effective_cache_size={effective_cache_size}  work_mem={work_mem}")`,
        checks: [
          { kind: "equal", task: "t1", name: "shared_buffers", value: 16384, tol: 1, label: "`shared_buffers` = 16384 MB", msg: "25% dari 65536 MB = 16384. Cek konversi GB→MB." },
          { kind: "equal", task: "t2", name: "effective_cache_size", value: 49152, tol: 1, label: "`effective_cache_size` = 49152 MB", msg: "75% dari 65536 MB = 49152." },
          { kind: "equal", task: "t3", name: "work_mem", value: 122.9, tol: 0.1, label: "`work_mem` ≈ 122,9 MB", msg: "(65536−16384)/200/2 = 122,9. Jangan lupa margin /2." },
          { kind: "stdout_matches", task: "t3", pattern: "shared_buffers=16384\\s+effective_cache_size=49152\\s+work_mem=122\\.9", label: "`print` menampilkan ketiganya", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "1 GB = 1024 MB. work_mem pakai margin /2.",
    },    {
      id: "lab2-matematika-koneksi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: matematika koneksi",
      prose: [
        "12 server × 25 pool = 300 koneksi mengantre ke max_connections 200. Tugasmu: hitung kebutuhan, defisit, dan biaya memorinya — lalu putuskan: naikkan max_connections, atau pasang PgBouncer?",
        "Jebakan: menaikkan max_connections ke 300 'menyelesaikan' antrean tetapi tiap koneksi idle makan 10 MB — plus context switch. Pooling di tengah (PgBouncer) menyelesaikan tanpa pajak memori.",
        "Coba juga: pool 25 → 10 per server. Berapa defisitnya? Seringkali aplikasi tidak butuh pool sebesar itu — ukur dulu, baru beli.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `butuh`: total koneksi yang diminta" },
        { id: "t2", text: "Hitung `defisit`: max(0, butuh − MAXCONN)" },
        { id: "t3", text: "Hitung `mem_gb`: memori untuk semua koneksi (2 desimal)" },
      ],
      expected: "butuh=300  defisit=100  mem_gb=2.93",
      note: {
        title: "Sering salah",
        body: "Lupa bahwa koneksi IDLE tetap makan memori dan slot. Defisit 100 bukan 'nanti saja' — ia error 'too many clients' saat traffic puncak.",
      },
      hints: [
        "butuh = SERVER * POOL.",
        "defisit = max(0, butuh - MAXCONN).",
        "mem_gb = butuh * MB_PER_CONN / 1024.",
      ],
      code: {
        starter: `# 12 app server, tiap server pool 25 koneksi. max_connections database = 200.\n# Setiap koneksi idle memakai ~10 MB.\nSERVER, POOL, MAXCONN, MB_PER_CONN = 12, 25, 200, 10\n# TULIS KODEMU: butuh, defisit, mem_gb\nbutuh = 0\ndefisit = 0\nmem_gb = 0.0\n`,
        lockLines: 3,
        solution: `# 12 app server, tiap server pool 25 koneksi. max_connections database = 200.\n# Setiap koneksi idle memakai ~10 MB.\nSERVER, POOL, MAXCONN, MB_PER_CONN = 12, 25, 200, 10\n\n# TULIS KODEMU: butuh, defisit, mem_gb\nbutuh = SERVER * POOL\ndefisit = max(0, butuh - MAXCONN)\nmem_gb = round(butuh * MB_PER_CONN / 1024, 2)\n\nprint(f"butuh={butuh}  defisit={defisit}  mem_gb={mem_gb}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "butuh", value: 300, label: "`butuh` = 300", msg: "12×25." },
          { kind: "equal", task: "t2", name: "defisit", value: 100, label: "`defisit` = 100", msg: "300−200." },
          { kind: "equal", task: "t3", name: "mem_gb", value: 2.93, tol: 0.01, label: "`mem_gb` = 2,93", msg: "300×10 MB → GB." },
        ],
      },
      reference: "Connection math: kebutuhan = server × pool; bandingkan dengan max_connections.",
    },

    {
      id: "checklist-produksi",
      eyebrow: "Langkah 6 · Checklist",
      title: "Checklist setup produksi (tempel di dinding)",
      prose: [
        "Delapan item yang membedakan install asal jalan dengan install siap produksi. (1) Parameter memori diracik dari aritmetika (lab di atas), bukan default. (2) Data, WAL, dan backup di disk/volume terpisah — disk data penuh tidak boleh membunuh WAL. (3) Autovacuum ON dan dimonitor (Postgres tidak membersihkan baris mati sendiri tanpa ini → bloat, DBA8). (4) Log lambat: log_min_duration_statement = 1000 ms — tanpa ini kamu buta terhadap query bermasalah.",
        "(5) Backup terjadwal + uji restore (DBA4) — backup yang belum pernah di-restore = harapan, bukan backup. (6) Monitoring dasar: koneksi, replikasi lag, ruang disk, bloat (DBA8). (7) Kredensial: tidak ada superuser untuk aplikasi; password di vault, bukan di chat (DBA7). (8) Dokumentasi runbook 1 halaman: cara restart, cara failover, siapa dihubungi — ditulis SEBELUM insiden pertama.",
        "💡 Intuisi: checklist ini membosankan — dan justru itu intinya. Insiden database hampir tidak pernah disebabkan hal eksotis; ia disebabkan hal membosankan yang terlewat: disk penuh, backup tak teruji, password default. DBA hebat adalah orang yang rajin pada hal membosankan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CNanti saja di-tuning kalau sudah lambat\u201D",
        body: "Tuning reaktif selalu lebih mahal: kamu melakukannya di bawah tekanan, di jam sibuk, dengan pengguna marah. Tuning proaktif (saat setup) butuh 30 menit yang sama tetapi tanpa drama. \u201CNanti\u201D dalam operasi database hampir selalu berarti \u201Csaat insiden\u201D.",
        type: "pitfall",
      },
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Konfigurasi default adalah konfigurasi untuk laptop developer, bukan server produksi. Setiap parameter yang tidak kamu setel secara sadar adalah keputusan yang dibuat orang lain untukmu.",
        "💡 Ubah satu parameter dalam satu waktu, ukur, catat. DBA yang mengubah 5 parameter sekaligus lalu 'jadi lebih cepat' tidak tahu mana yang bekerja — dan tidak bisa mengulanginya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: sisakan RAM untuk OS — database bukan satu-satunya penghuni",
        body: "Database bukan satu-satunya penghuni server — dan DBA pemula yang memberi 80% RAM ke shared_buffers akan segera berkenalan dengan OOM killer. Heuristik klasik yang masih valid: shared_buffers 25% RAM, effective_cache_size 50–75% RAM agar planner tahu OS cache itu ada, dan jangan pernah biarkan database dan OS berebut memori yang sama. Logikanya: PostgreSQL mengandalkan OS page cache untuk membaca data — shared_buffers yang terlalu besar justru menciptakan double buffering (data disalin dua kali: sekali di shared_buffers, sekali di page cache) sambil membuat OS kelaparan. Aturan praktis keduanya: work_mem × max_connections tidak boleh melebihi RAM yang tersedia — karena tiap koneksi bisa memakai work_mem BERKALI-KALI per query (satu query dengan 5 sort/hash = 5× work_mem). Inilah matematika yang membunuh server 64 GB \"tiba-tiba\": 200 koneksi × 64 MB work_mem × beberapa operasi = ledakan yang tidak terlihat di monitoring normal. Uji termurahnya: setelah mengubah parameter, jalankan beban puncak SINTETIS (bukan tebakan) dan pantau OOM score + swap. Swap yang tersentuh = konfigurasi salah, bukan \"server kurang besar\". Dan catat semuanya: parameter yang diubah tanpa dokumentasi adalah utang yang dibayar dengan begadang. Server yang berperilaku seperti punya RAM seuprit biasanya bukan kekurangan RAM — melainkan RAM yang dialokasikan dengan percaya diri ke tempat yang salah.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: parameter mana dulu?",
      prose: [
        "Skenario 1 — Database baru, belum ada data produksi. → Terapkan racikan lab (25%/75%/work_mem aman) + checklist 8 item. Alasan: fondasi murah; mengubah parameter butuh restart — lakukan selagi belum ada pengguna.",
        "Skenario 2 — Query agregat analis sering lambat, RAM masih lega. → Naikkan work_mem bertahap (2x lipat, ukur, ulangi) khusus via SET per sesi analis. Alasan: menaikkan global berisiko OOM; analis boleh dapat meja lebih besar tanpa membahayakan semua orang.",
        "Skenario 3 — Koneksi sering ditolak (too many clients). → Jangan langsung naikkan max_connections; pasang connection pooler (PgBouncer) dulu. Alasan: tiap koneksi makan RAM; pooler melayani ribuan aplikasi dengan puluhan koneksi database sungguhan.",
        "Skenario 4 — Ingin meniru konfigurasi \u201Cmaster\u201D dari blog. → Jangan copy-paste mentah; racik ulang dari RAM dan bebanmu. Alasan: konfigurasi untuk server 256 GB dengan 2000 koneksi bisa membunuh server 16 GB-mu. Angka tanpa konteks adalah racun.",
        "Aturan praktis 10 detik: ubah satu parameter dalam satu waktu, catat sebelum-sesudahnya, dan selalu tahu cara rollback (komentar di file config + backup config lama).",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: warung analitik yang OOM tiap Jumat",
      prose: [
        "DataWarung menjalankan database 32 GB RAM untuk 80 analis. Setiap Jumat sore (laporan mingguan), database mati: OOM killer membunuh proses Postgres. Konfigurasi: shared_buffers 8 GB (25% — benar), max_connections 300, work_mem 256 MB (diwarisi dari \u201Ctuning blog\u201D).",
        "Hitung skenario terburuk: 300 koneksi × 256 MB = 76.800 MB ≈ 75 GB — lebih dari dua kali RAM server. Jumat sore semua analis menjalankan agregat besar bersamaan; masing-masing boleh memakai 256 MB untuk sort; total meledak. Inilah aritmetika yang tidak pernah dihitung si peniru blog.",
        "Pembahasan: perbaikan tiga lapis. (1) Segera: turunkan work_mem ke 64 MB → worst case 300 × 64 MB = 19,2 GB, masih muat. (2) Struktural: pasang PgBouncer, turunkan max_connections ke 100 → worst case 6,4 GB. (3) Adil: analis berat diberi SET work_mem = '256MB' per sesi (meja pribadi lebih besar, risiko terkendali). Pelajaran: work_mem adalah anggaran PER OPERASI PER KONEKSI — mengalikannya dengan max_connections adalah langkah yang tidak boleh dilewatkan.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang instalasi dan konfigurasi. Perhatikan aritmetikanya.",
      ],
      tasks: [],
      summary: [
        "Default installer aman untuk jalan, salah untuk produksi — tuning adalah pekerjaan DBA, bukan opsional.",
        "shared_buffers 25% RAM; effective_cache_size 50–75% RAM (untuk planner); work_mem = (RAM − shared_buffers)/(max_conn × 2).",
        "Konfigurasi adalah anggaran: menaikkan satu parameter mengambil dari kantong penghuni lain.",
        "Koneksi ditolak → pooler dulu (PgBouncer), bukan max_connections membabi buta.",
        "Checklist 8 item: parameter, disk terpisah, autovacuum, slow log, backup teruji, monitoring, kredensial, runbook.",
      ],
      next: { label: "DBA4 — Backup & Recovery: RPO/RTO", href: "/v2/learn/dba4-backup" },
      quiz: [
        {
          q: "Server 64 GB dikonfigurasi shared_buffers=128 MB (default). Akibat paling mungkin?",
          options: [
            { text: "Database tidak bisa start", why: "128 MB valid dan bisa start — masalahnya performa, bukan startup." },
            { text: "RAM terbuang: buffer pool kecil → miss tinggi → query lambat padahal RAM lega", why: "Persis kasus LogiTrack: 55 GB RAM menganggur sementara query antre ke disk.", correct: true },
            { text: "Data corrupt", why: "Ukuran buffer tidak menyebabkan corrupt." },
            { text: "Koneksi ditolak", why: "Itu wilayah max_connections, bukan shared_buffers." },
          ],
        },
        {
          q: "work_mem 256 MB dengan max_connections 300 di server 32 GB. Risiko utama?",
          options: [
            { text: "Query menjadi lambat", why: "work_mem besar justru mempercepat sort individual." },
            { text: "OOM: worst case 300 × 256 MB = 75 GB > RAM → OOM killer", why: "work_mem adalah janji per operasi per koneksi; total janji bisa melebihi RAM fisik.", correct: true },
            { text: "Indeks rusak", why: "Tidak ada hubungan dengan indeks." },
            { text: "Backup gagal", why: "Backup tidak dipengaruhi work_mem." },
          ],
        },
        {
          q: "Aplikasi butuh 2.000 koneksi bersamaan. Langkah paling tepat?",
          options: [
            { text: "max_connections = 2000", why: "2.000 koneksi × overhead RAM = bencana memori; bukan cara dewasa." },
            { text: "Pasang connection pooler (mis. PgBouncer) dengan max_connections moderat", why: "Pooler multipleks ribuan koneksi aplikasi ke puluhan koneksi database sungguhan — standar industri.", correct: true },
            { text: "Tambah RAM 10x", why: "Mahal dan tidak menyentuh akar masalah arsitektur koneksi." },
            { text: "Batasi aplikasi 100 koneksi", why: "Mematahkan kebutuhan bisnis tanpa solusi teknis." },
          ],
        },
        {
          q: "Untuk apa effective_cache_size diset 75% RAM?",
          options: [
            { text: "Mengalokasikan 75% RAM untuk database", why: "Ia bukan alokasi nyata — tidak memesan memori apa pun." },
            { text: "Memberi tahu planner total cache yang tersedia agar pilihannya (index vs full scan) tepat", why: "Planner memakai angka ini sebagai asumsi; salah set = salah rute, seperti kasus BankMini.", correct: true },
            { text: "Membatasi memori OS", why: "Tidak membatasi apa pun di OS." },
            { text: "Menambah kecepatan tulis", why: "Tidak berpengaruh ke jalur tulis/WAL." },
          ],
        },
        {
          q: "Mana yang PALING tepat menggambarkan filosofi konfigurasi?",
          options: [
            { text: "Copy-paste konfigurasi terbaik dari blog", why: "Angka tanpa konteks bebanmu adalah racun (kasus DataWarung)." },
            { text: "Set semua parameter semaksimal mungkin", why: "RAM tetap; maksimal semua = OOM." },
            { text: "Anggaran: bagi RAM antar penghuni berdasar aritmetika, ubah satu per satu, catat & bisa rollback", why: "Inilah disiplin konfigurasi: terukur, bertahap, dan dapat dikembalikan.", correct: true },
            { text: "Biarkan default selamanya", why: "Default konservatif; produksi butuh racikan beban sendiri." },
          ],
        },
        {
          q: "Server 64 GB RAM. Seorang 'senior' menyarankan shared_buffers = 48 GB 'biar kencang'. Masalahnya?",
          options: [
            { text: "Tidak ada — makin besar makin kencang", why: "Salah: shared_buffers 48 GB menyisakan 16 GB untuk OS + koneksi + work_mem. OS butuh ~50% untuk page cache — yang justru mempercepat baca. 25% (16 GB) adalah titik manis yang teruji." },
            { text: "Menyisakan terlalu sedikit untuk OS cache dan koneksi — aturan praktis 25%", why: "Tepat: PostgreSQL mengandalkan OS page cache untuk baca. shared_buffers raksasa = double buffering + kelaparan OS. Aturan: 25% shared_buffers, ~50% untuk OS, sisanya koneksi/work_mem.", correct: true },
            { text: "Harusnya 64 GB penuh", why: "Database bukan satu-satunya penghuni server: OS, koneksi, backup agent butuh ruang. Penuh = OOM killer datang berkunjung." },
            { text: "shared_buffers tidak berpengaruh", why: "Berpengaruh besar — tetapi hubungannya tidak linear dan ada titik jenuh. 'Besar' ≠ 'benar'." },
          ],
        },
      ],
    },
  ],
};

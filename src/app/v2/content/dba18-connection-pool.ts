import type { V2Lesson } from "../lib/types";

// ── Figure: koneksi langsung vs pooling: memori & latensi ────────────────────
const POOL_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Perbandingan koneksi langsung vs PgBouncer: jumlah koneksi database dan latensi">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="52" y1="206" x2="528" y2="206"/>
<line x1="52" y1="166" x2="528" y2="166"/><line x1="52" y1="126" x2="528" y2="126"/>
<line x1="52" y1="86" x2="528" y2="86"/><line x1="52" y1="46" x2="528" y2="46"/>
</g>
<g>
<text x="52" y="30" font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">koneksi ke database (kiri) &amp; latensi koneksi baru (kanan) — ilustrasi</text>
<rect x="100" y="46" width="70" height="160" fill="var(--chart-text)" opacity="0.5"/>
<text x="135" y="38" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">2.000</text>
<text x="135" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Langsung</text>
<rect x="230" y="186" width="70" height="20" fill="var(--c1)" opacity="0.9"/>
<text x="265" y="178" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">40</text>
<text x="265" y="224" text-anchor="middle" font-size="11" fill="var(--text)">PgBouncer</text>
<rect x="400" y="66" width="70" height="140" fill="var(--chart-text)" opacity="0.5"/>
<text x="435" y="58" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">50 ms</text>
<text x="435" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Handshake baru</text>
<rect x="490" y="196" width="40" height="10" fill="var(--c1)" opacity="0.9"/>
<text x="510" y="188" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">~0</text>
<text x="510" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Reuse pool</text>
</g>
</svg>`;

export const dba18: V2Lesson = {
  slug: "dba18-connection-pool",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "Connection Pooling: PgBouncer & Koneksi yang Tidak Bocor",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Database yang mati bukan karena query berat — melainkan karena 2.000 koneksi",
      prose: [
        "Flash sale sebuah e-commerce: traffic naik 20× dalam 10 menit. Tim sudah menyiapkan segalanya — query dioptimasi, indeks dicek, cache dipanaskan. Lima menit setelah sale dimulai, database Postgres berhenti merespons. Bukan karena CPU habis oleh query — melainkan karena 2.000 koneksi serentak: tiap request aplikasi membuka koneksi baru, tiap koneksi memakan ~10MB memori kerja + satu proses backend, dan database menghabiskan waktunya untuk context switching antar 2.000 proses, bukan mengeksekusi query. Twist-nya: query-nya ringan-ringan saja. Pembunuhnya bukan beban kerja — melainkan cara koneksi dikelola. Database tidak mati karena kelelahan; ia mati karena dikeroyok.",
        "Solusinya adalah connection pooling: perantara (seperti PgBouncer) yang memegang sedikit koneksi permanen ke database dan meminjamkannya bergantian ke ribuan klien aplikasi. Aplikasi “membuka koneksi” ke pooler dalam milidetik; pooler meneruskan ke salah satu dari 40 koneksi database yang sesungguhnya. Rasio 2.000:40 — dan database hanya melayani 40 proses yang tertib.",
        "Di lesson ini kamu belajar anatomi pooling, tiga mode PgBouncer (session, transaction, statement), dan cara mendiagnosis kebocoran koneksi — sebelum flash sale berikutnya.",
      ],
      tasks: [],
      note: {
        title: "Kenapa pooling adalah pekerjaan DBA",
        type: "risk",
        body: "Aplikasi modern (microservices × instance × thread) melipatgandakan koneksi secara eksponensial — keputusan yang tidak pernah dibuat sadar oleh siapa pun. DBA yang tidak memasang pooler sedang membiarkan arsitektur aplikasi menentukan nasib database. Pooler adalah benteng terakhir antara pola aplikasi dan keterbatasan database.",
      },
      reference: "Pooling = sedikit koneksi permanen ke DB, dipinjamkan bergantian ke banyak klien. Rasio tipikal puluhan banding ribuan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan kenapa koneksi database mahal (proses + memori + handshake); (2) membedakan tiga mode PgBouncer — session, transaction, statement — dan memilihnya; (3) menghitung ukuran pool yang tepat; (4) mendiagnosis kebocoran koneksi dan pool exhaustion.",
        "Rutenya: cerita → bekal ringkas → dua konsep inti (anatomi pooling; mode PgBouncer) → lab Python (simulator pool + deteksi kebocoran) → chart langsung vs pooling → peta keputusan → mini-case pool exhaustion → kuis → rangkuman. Estimasi 45 menit; lab-nya ±10 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Dari arsitektur database: Postgres memakai model satu proses per koneksi — tiap koneksi adalah proses OS dengan memori kerjanya sendiri (work_mem × operasi); 2.000 koneksi = 2.000 proses yang berebut CPU. Koneksi juga punya biaya handshake (TCP + TLS + autentikasi ≈ 5–50 ms) — untuk query 2 ms, handshake 20× lebih mahal dari query-nya. Dari monitoring: metrik kunci database mencakup koneksi aktif, idle, dan waktu tunggu — pooler yang sehat terlihat dari antrean kecil dan stabil, bukan nol.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: koneksi database seperti jalur telepon operator zaman dulu — membuatnya mahal (operator mencolokkan kabel), mempertahankannya murah. Pooler = operator yang mencolokkan sekali, lalu menyambungkan ribuan penelepon bergantian.",
      ],
      reference: "Bekal: (1) 1 koneksi = 1 proses + memori; (2) handshake bisa 20× lebih mahal dari query singkat.",
    },
    {
      id: "konsep-anatomi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi Pooling — Si Operator Telepon",
      prose: [
        "Definisi: connection pooler (PgBouncer untuk Postgres; ProxySQL untuk MySQL) duduk di antara aplikasi dan database — biasanya di port 6432. Ia memegang N koneksi server (ke database) yang permanen, dan menerima M koneksi klien (dari aplikasi) dengan M jauh lebih besar dari N. Saat aplikasi butuh database, pooler meminjamkan satu koneksi server yang menganggur; selesai dipakai, dikembalikan — tanpa menutup koneksi TCP ke database.",
        "Kepribadiannya: seperti operator telepon yang punya 40 jalur ke sentral tetapi melayani 2.000 pelanggan — penelepon tidak menunggu jalur fisik baru dipasang (handshake), ia langsung disambungkan ke jalur menganggur. Tiga parameter kuncinya: pool_size (berapa koneksi server), max_client_conn (berapa klien boleh antre), dan reserve_pool (cadangan darurat). Klien yang datang saat semua koneksi sibuk MENGANTRE — antrean yang tumbuh adalah sinyal pool kekecilan atau ada kebocoran.",
        "Kapan memakai: selalu, untuk aplikasi dengan banyak koneksi singkat (web, microservices, serverless — yang terakhir WAJIB karena tiap fungsi membuka koneksi baru). Kapan TIDAK: sedikit koneksi panjang yang stabil (mis. 5 worker ETL) — pooler menambah hop tanpa manfaat berarti. Aturan ukuran: mulai dari rumus di bawah, lalu sesuaikan dari metrik antrean.",
      ],
      formula: String.raw`\text{pool\_size} = (\text{core} \times 2) + \text{spindle efektif}`,
      formulaNote: "Titik awal klasik (dari panduan Postgres). core = jumlah core CPU database; spindle efektif = disk paralel (untuk SSD/NVMe modern, gunakan angka kecil seperti 2–4). Contoh: 8 core + SSD → (8×2)+2 = 18 koneksi server. Interpretasi: ini BATAS ATAS koneksi yang benar-benar bisa kerja paralel — lebih dari ini = antrean di dalam database (context switching), bukan throughput. Pooler menampung ribuan klien di depan 18 koneksi ini.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Pool makin besar makin cepat”",
        type: "pitfall",
        body: "Yang benar: pool yang terlalu besar SAMA BURUKNYA dengan tidak pakai pool — 500 koneksi server = 500 proses berebut CPU = context switching seperti cerita pembuka. Throughput maksimal tercapai di pool KECIL yang jenuh (semua koneksi kerja, tidak antre di dalam DB). Besarkan pool hanya bila metrik menunjukkan koneksi menganggur karena menunggu I/O.",
      },
      hints: [
        "💡 Intuisi: antrean ada DUA tempat — di pooler (klien menunggu koneksi, terlihat & terkendali) dan di dalam database (koneksi berebut CPU, tak terlihat & merusak). Pooler yang benar memindahkan antrean ke tempat yang terlihat.",
      ],
      reference: "Pooler di port 6432; pool_size kecil & jenuh > besar & berebut. Antrean di pooler = sinyal, bukan musuh.",
    },
    {
      id: "konsep-mode",
      eyebrow: "Langkah 4 · Konsep",
      title: "Tiga Mode PgBouncer — Si Penjaga Pintu Tiga Gaya",
      prose: [
        "Definisi: mode menentukan kapan koneksi server boleh dipinjamkan ke klien lain. Session pooling: koneksi server terikat ke klien selama SESI penuh (sampai klien disconnect) — aman untuk semua fitur, tetapi tidak menghemat bila sesi panjang dan menganggur. Transaction pooling: koneksi dikembalikan setiap TRANSAKSI selesai — penghematan maksimal, tetapi fitur terikat-sesi (prepared statement, LISTEN/NOTIFY, advisory lock, SET lokal) RUSAK. Statement pooling: dikembalikan setiap STATEMENT — paling agresif, melarang transaksi multi-statement.",
        "Kepribadiannya: tiga penjaga pintu dengan aturan pinjam berbeda. Si Setia (session) — “bukumu kupinjam sampai kamu pulang”; aman, tetapi rak bukunya cepat habis oleh peminjam yang membaca di tempat. Si Disiplin (transaction) — “kembalikan tiap selesai satu urusan”; rak selalu tersedia, tetapi kamu tidak boleh menandai halaman (prepared statement) atau memesan buku (advisory lock). Si Kilat (statement) — “satu kalimat, langsung kembali”; tercepat, tetapi tidak untuk urusan bersambung (transaksi).",
        "Kapan memakai: session untuk aplikasi yang butuh fitur sesi (prepared statements, LISTEN) dan koneksinya tidak terlalu banyak; transaction untuk web/microservices standar — mode paling umum dan paling hemat; statement jarang — hanya untuk query tunggal tanpa transaksi. Jebakan klasik: pindah ke transaction pooling lalu heran kenapa prepared statement error — karena memang tidak didukung; solusinya matikan prepared statement di driver atau kembali ke session.",
      ],
      formula: String.raw`\text{penghematan} = 1 - \frac{\text{pool\_size}}{\text{klien}}`,
      formulaNote: "Fraksi koneksi database yang dihemat. Contoh: 2.000 klien → pool 40 → penghematan = 1 − 40/2000 = 98%. Interpretasi: 98% beban proses/memori database hilang — tetapi ingat, klien tetap “merasa” punya koneksi sendiri; yang dihemat adalah sisi database, bukan ilusi aplikasi.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Transaction pooling = session pooling yang lebih cepat”",
        type: "pitfall",
        body: "Yang benar: keduanya punya KONTRAK berbeda, bukan kecepatan berbeda. Transaction pooling melarang fitur terikat-sesi — aplikasi yang memakai prepared statement, SET, atau advisory lock akan error dengan cara misterius (error muncul acak tergantung koneksi mana yang didapat). Pilih mode berdasar FITUR yang dipakai aplikasi, bukan berdasar kecepatan.",
      },
      hints: [
        "💡 Intuisi: sebelum ganti mode, audit fitur sesi aplikasi: cari `PREPARE`, `SET `, `LISTEN`, `pg_advisory_lock` di codebase. Satu temuan = transaction pooling butuh penyesuaian driver dulu.",
      ],
      reference: "Session = aman, boros. Transaction = hemat, tanpa fitur sesi. Statement = khusus query tunggal. Pilih berdasar fitur.",
    },
    {
      id: "lab-pool",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Simulator pool & deteksi kebocoran",
      prose: [
        "Waktunya jadi operatornya. Di bawah ada simulator pool (sintetis): klien datang meminjam koneksi, sebagian mengembalikan, sebagian “lupa” (bocor). Tugasmu: tulis `simulasi()` yang memproses daftar kejadian (pinjam/kembali), hitung pemakaian maksimum, deteksi kebocoran (klien yang pinjam tanpa kembali), dan tentukan apakah pool perlu dibesarkan (pemakaian max ≥ 90% kapasitas).",
        "Coba: setelah lolos, tambahkan 5 klien bocor lagi dan lihat kapan pool “habis” (exhaustion). Lalu tanya: di produksi, apa yang membedakan kebocoran dari beban normal? (Petunjuk: kebocoran tumbuh TERUS; beban normal naik-turun.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `simulasi(kejadian, kapasitas)`: kembalikan (max_pakai, bocor) — bocor = klien pinjam tanpa kembali" },
        { id: "t2", text: "Hitung `max_pakai` dari simulasi" },
        { id: "t3", text: "Kumpulkan `bocor` = daftar klien yang bocor" },
        { id: "t4", text: "Hitung `perlu_besarkan` = True bila max_pakai >= 0.9 * kapasitas" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "max pakai: 4 dari 5\nbocor: ['C', 'F']\nperlu besarkan pool: False",
      code: {
        starter: `# Kejadian pool (SINTETIS): (aksi, klien)
kejadian = [
    ("pinjam", "A"), ("pinjam", "B"), ("kembali", "A"),
    ("pinjam", "C"), ("pinjam", "D"), ("kembali", "B"),
    ("pinjam", "E"), ("pinjam", "F"), ("kembali", "D"),
    ("kembali", "E"),
]
KAPASITAS = 5

# TULIS KODEMU DI BAWAH INI
def simulasi(kejadian, kapasitas):
    return

max_pakai = 0  # TODO: dari simulasi

bocor = []  # TODO: dari simulasi

perlu_besarkan = False  # TODO: max_pakai >= 0.9 * KAPASITAS

print(f"max pakai: {max_pakai} dari {KAPASITAS}")
print(f"bocor: {bocor}")
print(f"perlu besarkan pool: {perlu_besarkan}")`,
        lockLines: 8,
        solution: `# Kejadian pool (SINTETIS): (aksi, klien)
kejadian = [
    ("pinjam", "A"), ("pinjam", "B"), ("kembali", "A"),
    ("pinjam", "C"), ("pinjam", "D"), ("kembali", "B"),
    ("pinjam", "E"), ("pinjam", "F"), ("kembali", "D"),
    ("kembali", "E"),
]
KAPASITAS = 5

# TULIS KODEMU DI BAWAH INI
def simulasi(kejadian, kapasitas):
    dipakai = set()
    max_pakai = 0
    for aksi, klien in kejadian:
        if aksi == "pinjam":
            dipakai.add(klien)
            max_pakai = max(max_pakai, len(dipakai))
        else:
            dipakai.discard(klien)
    bocor = sorted(dipakai)
    return max_pakai, bocor

max_pakai, bocor = simulasi(kejadian, KAPASITAS)

perlu_besarkan = max_pakai >= 0.9 * KAPASITAS

print(f"max pakai: {max_pakai} dari {KAPASITAS}")
print(f"bocor: {bocor}")
print(f"perlu besarkan pool: {perlu_besarkan}")`,
        checks: [
          { kind: "equal", task: "t2", name: "max_pakai", value: 4, tol: 0, label: "`max_pakai` = 4", msg: "Puncak: B,C,D,E atau C,D,E,F — 4 bersamaan." },
          { kind: "equal", task: "t3", name: "bocor", value: ["C", "F"], tol: 0, label: "`bocor` = ['C', 'F']", msg: "C dan F pinjam tanpa pernah kembali." },
          { kind: "equal", task: "t4", name: "perlu_besarkan", value: false, tol: 0, label: "`perlu_besarkan` = False", msg: "4 < 0.9×5=4.5 — tetapi 2 bocor harus diperbaiki dulu sebelum menambah kapasitas." },
          { kind: "stdout_matches", task: "t5", pattern: "max pakai: 4 dari 5", label: "Ringkasan pemakaian tercetak", msg: "Baris pertama: 'max pakai: 4 dari 5'." },
          { kind: "stdout_matches", task: "t5", pattern: "bocor: \\['C', 'F'\\]", label: "Daftar bocor tercetak", msg: "Baris kedua: \"bocor: ['C', 'F']\"." },
        ],
      },
      reference: "Simulator pool: lacak pinjam/kembali, puncak pemakaian, kebocoran. Bocor diperbaiki, bukan ditutup dengan kapasitas.",
    },
    {
      id: "chart-pool",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca chart langsung vs pooling",
      prose: [
        "Chart di bawah membandingkan koneksi langsung vs via PgBouncer (ilustrasi dari cerita pembuka).",
        "Cara membaca: dua batang kiri = jumlah koneksi ke database (2.000 langsung vs 40 via pooler). Dua batang kanan = latensi membuka “koneksi baru” dari sisi aplikasi (50 ms handshake langsung vs ~0 reuse dari pool).",
        "Interpretasi: pooler memangkas 98% proses database DAN menghilangkan biaya handshake per request — dua pembunuh yang berbeda dalam satu solusi. Tetapi perhatikan: batang “40” bukan angka ajaib — ia harus dihitung dari rumus pool_size dan divalidasi metrik antrean. Pelajaran chart ini: pooling bukan “tambah komponen”, melainkan “pindahkan antrean ke tempat yang terlihat dan terkendali”.",
      ],
      figure: {
        svg: POOL_SVG,
        alt: "Perbandingan: 2.000 koneksi langsung vs 40 via PgBouncer; handshake 50 ms vs ~0 reuse.",
        caption: "Koneksi langsung vs PgBouncer: jumlah koneksi DB dan latensi buka koneksi (ilustrasi).",
      },
      tasks: [],
      reference: "Pooling = 98% proses DB hilang + handshake ~0. Ukuran pool dihitung, bukan ditebak.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Koneksi bermasalah — keputusan apa?",
      prose: [
        "Empat skenario keputusan pooling:",
        "Skenario 1 — Aplikasi web baru dengan 500 pod, tiap pod 20 thread. → Pasang PgBouncer transaction pooling sejak hari pertama. Alasan: 10.000 koneksi potensial vs database yang sanggup puluhan — tanpa pooler ini bom waktu yang sudah dipasang.",
        "Skenario 2 — Setelah pindah ke transaction pooling, muncul error prepared statement acak. → Audit fitur sesi; matikan prepared statement di driver ATAU pindah ke session pooling untuk aplikasi itu. Alasan: error acak = gejala klasik fitur sesi yang rusak oleh mode pool — bukan bug aplikasi.",
        "Skenario 3 — Metrik menunjukkan koneksi pool jenuh + antrean tumbuh TERUS (tidak naik-turun). → Jangan besarkan pool dulu — cari kebocoran (koneksi yang tidak ditutup). Alasan: kebocoran yang ditutup dengan kapasitas = menunda ledakan, bukan mencegahnya. Perbaiki bocor, baru evaluasi ukuran.",
        "Skenario 4 — Serverless (ribuan fungsi, tiap fungsi buka koneksi). → Pooler WAJIB + statement/transaction pooling + idle timeout agresif. Alasan: serverless = pola koneksi terburuk (buka-tutup massal); tanpa pooler, handshake storm membunuh database sebelum query pertama selesai.",
        "Aturan praktis 10 detik: masalah koneksi? → (1) pasang/cek pooler; (2) mode sesuai fitur sesi; (3) ukuran dari rumus + metrik antrean; (4) antrean tumbuh terus = cari bocor, bukan tambah kapasitas.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menambah max_connections di database sebagai “solusi” koneksi habis. Itu seperti melebarkan pintu darurat saat gedung kebakaran — menunda, bukan memadamkan. max_connections besar = ribuan proses berebut CPU = database lambat untuk SEMUA orang, bukan cuma yang antre.",
      },
      reference: "Pooler dulu, mode sesuai fitur, ukuran dari rumus, bocor diperbaiki — bukan ditutup kapasitas.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Malam flash sale: pool exhaustion jam 20:05",
      prose: [
        "Skenario (sintetis, untuk latihan): e-commerce memasang PgBouncer (pool_size 40, transaction pooling) sebelum flash sale. Jam 20:05 — 5 menit setelah sale — aplikasi mulai error “pool exhausted”, antrean pooler 800 dan tumbuh. Database CPU 40% (tidak jenuh!), query rata-rata 50 ms.",
        "Pertanyaan analisis: (1) Bila database tidak jenuh, kenapa pool habis? (2) Tiga hipotesis penyebab + cara memverifikasi tiap hipotesis? (3) Respons 10 menit pertama yang benar?",
        "Pembahasan: (1) Pool habis ≠ database sibuk — pool habis berarti 40 koneksi server semuanya TERPAKAI (tidak kembali). Database 40% CPU menunjukkan koneksi-koneksi itu MENUNGGU sesuatu, bukan bekerja. (2) Hipotesis A: kebocoran — aplikasi tidak menutup transaksi (lupa commit) → verifikasi: cek `idle in transaction` di pg_stat_activity. Hipotesis B: satu query lambat menahan koneksi → verifikasi: query terlama yang sedang jalan. Hipotesis C: deadlock/lock contention — koneksi saling menunggu → verifikasi: pg_locks + wait events. (3) 10 menit pertama: JANGAN besarkan pool (menutup gejala); identifikasi koneksi yang menahan (kill yang `idle in transaction` terlama bila darurat); bila hipotesis A benar → hotfix aplikasi / turunkan idle_in_transaction_timeout; catat untuk postmortem. Setelah sale: perbaiki aplikasi + tambah alert “idle in transaction > 1 menit”.",
        "Catatan metrik: tiga metrik pooler yang wajib di-dashboard — pemakaian pool (%), panjang antrean, dan waktu tunggu antrean. Ketiganya naik bersamaan = pool kekecilan; antrean naik + pemakaian penuh + DB idle = kebocoran/lock.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pool exhaustion saat flash sale = checkout gagal = pendapatan hilang per menit + pelanggan yang tidak kembali. Dalam risk register operasional, “pool belum di-load-test” adalah risiko yang murah dicegah (load test + metrik) dan mahal diderita.",
      },
      reference: "Pool habis + DB idle = koneksi menunggu (bocor/lock/lambat), bukan DB sibuk. Diagnosis dulu, kapasitas kemudian.",
    },
    {
      id: "pendalaman-beban",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Di Bawah Beban: Little's Law, Timeout & Kegagalan Beruntun",
      prose: [
        "Rumus pool_size = (core×2)+spindle adalah titik awal yang baik — tetapi DBA senior menentukan ukuran dari PENGUKURAN, bukan dari hafalan. Alatnya: Little's Law — jumlah koneksi rata-rata yang terpakai sama dengan laju kedatangan dikali rata-rata lama ditahan (L = λW). Ukur λ (transaksi per detik, dari pg_stat_database atau statistik pooler) dan W (rata-rata durasi transaksi termasuk network, dari log atau pg_stat_statements). Contoh: λ = 500/detik, W = 40 ms → L = 20 koneksi rata-rata; beri headroom 1,5–2× untuk burst → pool 40. Keunggulan pendekatan ini: ia menjelaskan KENAPA pool 40 cukup — bukan karena “kata buku”, melainkan karena aritmetika bebanmu sendiri. Batasnya: traffic nyata itu bursty — gunakan λ dan W pada persentil 95, bukan rata-rata; rata-rata berbohong saat flash sale. Dan bila W naik (query melambat), L ikut naik — pool yang kemarin cukup bisa tiba-tiba “kekecilan” padahal yang berubah adalah kecepatan query, bukan jumlah pengguna.",
        "Keputusan desain yang lebih penting dari ukuran: antre atau gagal cepat? Antrean pooler yang tumbuh tanpa batas berarti thread aplikasi menumpuk menunggu — lalu thread pool aplikasi habis — lalu health check gagal — lalu load balancer membunuh instance — lalu instance yang tersisa mendapat traffic lebih besar: spiral kematian beruntun. Alternatifnya: fail fast — pooler menolak atau timeout dengan cepat, aplikasi menerima error yang terkontrol dan mengaktifkan circuit breaker atau backoff. Aturan senior: timeout antrean pooler harus LEBIH KECIL dari timeout aplikasi — agar yang menyerah adalah pooler yang terkontrol, bukan aplikasi yang kacau. Tiga timeout Postgres yang wajib disetel: statement_timeout (bunuh query liar sehingga koneksi terbebaskan), idle_in_transaction_session_timeout (bunuh transaksi yang lupa commit — pembunuh pool nomor satu), dan query_wait_timeout di pooler (batas antre). Pool tanpa timeout adalah deadlock yang menunggu waktu.",
        "Perilaku saat exhaustion juga menentukan pilihan perkakas. PgBouncer — ringan, tiga mode pooling, nyaris tanpa kejutan — adalah pilihan default untuk pooling murni. pgpool-II lebih berat: selain pooling ia menawarkan load balancing (merutekan query baca ke replika berdasar statement), watchdog (HA untuk pooler itu sendiri), dan query cache. Harganya: perutean berdasar statement bisa salah merutekan tulis di dalam transaksi multi-statement, dan perilakunya lebih sulit diprediksi. Aturan keputusan: butuh read-scaling lewat pooler → pgpool-II dengan pengujian ketat terhadap pola query; butuh pooling yang membosankan dan terprediksi → PgBouncer. Satu hal yang sering dilupakan: pooler adalah single point of failure — jalankan dua instance di balik VIP/keepalived atau load balancer, atau “benteng terakhirmu” justru menjadi titik tunggal kegagalan.",
        "Menutup lingkaran ke mode pooling: kenapa transaction pooling merusak prepared statement? Karena prepared statement hidup di KONEKSI SERVER, bukan di sesi klien. Sesi A menyiapkan statement di koneksi server #3; transaksi berikutnya dari sesi yang sama bisa dipinjamkan koneksi server #7 — yang tidak mengenal statement itu — sehingga muncul error acak “prepared statement does not exist”. Keacakan inilah yang membuat bug ini terkenal sulit di-debug: ia tergantung koneksi mana yang kebetulan didapat. Perbaikannya di level kontrak, bukan di level kode aplikasi: matikan prepared statement di driver, kembali ke session pooling untuk aplikasi itu, atau manfaatkan dukungan prepared statement level-protokol di PgBouncer versi baru. Pelajaran umumnya: setiap fitur “terikat koneksi server” — prepared statement, SET lokal, LISTEN, advisory lock, temporary table, cursor WITH HOLD — adalah kandidat rusak saat pindah mode; daftar inilah yang diaudit sebelum ganti mode, bukan sekadar prepared statement.",
        "Contoh perhitungan end-to-end agar angkanya hidup. Skenario: aplikasi checkout, diukur dari pg_stat_database: λ = 800 transaksi/detik (p95), dari pg_stat_statements: W = 60 ms (p95, termasuk network). L = 800 × 0,06 = 48 koneksi. Headroom 2× → pool_size 96? Tunggu — cek dulu terhadap rumus fisik: database 8 core → (8×2)+2 = 18 koneksi yang benar-benar bisa kerja paralel. Kontradiksi? Tidak: 48 adalah kebutuhan KONKUREN (termasuk yang menunggu I/O), 18 adalah kapasitas CPU-paralel. Bila W didominasi I/O (query menunggu disk/jaringan), 48 koneksi tidak akan membuat CPU 100% — mereka bergantian menunggu. Tetapi bila W didominasi CPU, 48 koneksi di 8 core = antrean di dalam database. Putusannya: ukur juga pembagian W (cpu vs io wait); bila cpu-bound, turunkan W dulu (optimasi query) sebelum menaikkan pool. Konfigurasi PgBouncer hasil akhirnya mis. pool_size=48, max_client_conn=2000, query_wait_timeout=5s (< app timeout 10s), reserve_pool_size=5 untuk darurat. Tiap angka punya alasan — dan tiap alasan bisa ditunjukkan ke siapa pun yang bertanya. Itulah bedanya DBA yang me-sizing pool dengan DBA yang menebak ukurannya.",
      ],
      formula: String.raw`\text{koneksi\_rata2} = \lambda \times W`,
      formulaNote: "Little's Law untuk sizing pool. λ = laju kedatangan transaksi per detik (ukur dari pg_stat_database atau statistik pooler); W = rata-rata lama satu koneksi dipakai per transaksi dalam detik, termasuk network (ukur dari pg_stat_statements atau log). Contoh: λ=500, W=0,04 → 20 koneksi; headroom 2× → pool 40. Gunakan persentil-95 untuk λ dan W bila traffic bursty. Interpretasi: bila antrean tumbuh padahal pool “cukup”, ukur ulang — biasanya W naik (query melambat) atau λ naik; jangan besarkan pool sebelum tahu yang mana.",
      tasks: [],
      note: {
        title: "Intuisi: timeout adalah jaring pengaman, pool hanyalah ember",
        body: "Ember (pool) menampung; jaring (timeout) yang menyelamatkanmu saat ember penuh. Heuristik para praktisi: pertama, setel timeout DULU sebelum mengutak-atik ukuran — idle_in_transaction_session_timeout 1–5 menit di produksi membunuh kebocoran paling umum tanpa belas kasihan. Kedua, timeout antrean pooler harus lebih kecil dari timeout aplikasi, selalu — yang boleh menyerah duluan adalah pooler yang terkontrol. Ketiga, ukur λ dan W tiap minggu (atau tiap rilis besar); pool yang tidak diukur ulang adalah tebakan yang menua. Keempat, pool yang “kekecilan” sering kali berarti query melambat (W naik) — perbaiki query dulu, pool kemudian; membesarkan pool untuk query lambat seperti membeli ember lebih besar untuk atap yang bocor. Kelima, fail fast mengalahkan antre selamanya — error terkontrol yang memicu circuit breaker jauh lebih murah daripada spiral kematian beruntun. Keenam, uji perilaku exhaustion SEBELUM flash sale: matikan separuh pool di staging dan lihat apakah aplikasi tetap graceful atau ikut mati — lebih baik tahu di staging. Ketujuh: dokumentasikan tiap angka konfigurasi pooler dengan alasannya (λ, W, headroom, timeout) — pool yang tidak bisa dijelaskan angkanya akan diubah orang berikutnya berdasar firasat, dan firasat adalah awal dari insiden berikutnya.",
      },
      reference: "Sizing dari λ×W (p95 bila bursty). Timeout antrean < timeout aplikasi. Exhaustion = fail fast + circuit breaker.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Koneksi mahal: 1 proses + memori + handshake (5–50 ms); ribuan koneksi = context switching, bukan throughput.",
        "Pooler (PgBouncer :6432): N koneksi server permanen dipinjamkan ke M klien; antrean di pooler = terlihat & terkendali.",
        "Mode: session (aman, boros) / transaction (hemat, tanpa fitur sesi) / statement (query tunggal); pilih berdasar fitur aplikasi.",
        "pool_size = (core × 2) + spindle efektif — titik awal; validasi dari metrik antrean, bukan tebakan.",
        "Antrean tumbuh terus = kebocoran/lock — perbaiki dulu, baru evaluasi kapasitas. Load test sebelum flash sale.",
      ],
      next: { label: "DBA19 — NoSQL & Database Lainnya: Memilih Mesin yang Tepat", href: "/v2/learn/dba19-nosql" },
      quiz: [
        {
          q: "Kenapa 2.000 koneksi langsung bisa melumpuhkan database walau query-nya ringan?",
          options: [
            { text: "Tiap koneksi = 1 proses OS + memori; ribuan proses berebut CPU untuk context switching, bukan mengeksekusi query", why: "Benar: model proses-per-koneksi berarti koneksi itu sendiri adalah beban — sebelum query bicara.", correct: true },
            { text: "Karena query ringan menumpuk menjadi berat", why: "Salah: query ringan tetap ringan — yang berat adalah overhead 2.000 proses." },
            { text: "Karena network tidak sanggup", why: "Salah: bottleneck-nya di proses/CPU database, bukan bandwidth network." },
            { text: "Karena indeks rusak oleh banyak koneksi", why: "Salah: jumlah koneksi tidak merusak indeks — tidak ada hubungan sebab-akibat di sini." },
          ],
        },
        {
          q: "Aplikasi memakai prepared statement dan LISTEN/NOTIFY. Mode PgBouncer yang aman?",
          options: [
            { text: "Session pooling — fitur terikat-sesi butuh koneksi yang setia selama sesi", why: "Benar: transaction/statement pooling akan merusak prepared statement dan LISTEN dengan error acak.", correct: true },
            { text: "Transaction pooling — paling hemat", why: "Salah: hemat tetapi merusak fitur sesi — “hemat” yang salah tempat." },
            { text: "Statement pooling — paling cepat", why: "Salah: tercepat tetapi melarang transaksi multi-statement; tidak cocok untuk aplikasi ini." },
            { text: "Tanpa pooler — paling aman", why: "Salah: menghindari pooler karena fitur sesi = membuang 98% penghematan; session pooling memberi keduanya." },
          ],
        },
        {
          q: "Antrean pooler tumbuh TERUS sepanjang hari (tidak naik-turun). Diagnosis paling mungkin?",
          options: [
            { text: "Kebocoran koneksi — ada yang pinjam tanpa kembali; antrean beban normal naik-turun", why: "Benar: pola monoton naik = akumulasi, bukan beban. Cari idle-in-transaction / koneksi tak tertutup.", correct: true },
            { text: "Pool kekecilan — langsung besarkan 10×", why: "Salah: membesarkan tanpa diagnosis menutup kebocoran sementara — bomnya tetap ada, sumbunya lebih panjang." },
            { text: "Normal — antrean memang selalu tumbuh", why: "Salah: antrean sehat berfluktuasi mengikuti beban; tumbuh monoton = patologi." },
            { text: "Database perlu di-upgrade", why: "Salah: database tidak jenuh (kasus tipikal) — masalahnya di manajemen koneksi, bukan kapasitas DB." },
          ],
        },
        {
          q: "Setelah pindah ke transaction pooling muncul error acak terkait prepared statement. Penyebab & solusi?",
          options: [
            { text: "Mode pool merusak fitur sesi — matikan prepared statement di driver atau kembali ke session pooling", why: "Benar: error acak = gejala klasik — tergantung koneksi mana yang didapat. Solusinya di level mode/driver.", correct: true },
            { text: "Bug di aplikasi — debug kodenya", why: "Salah: kode tidak berubah; yang berubah mode pool. Debug aplikasi = mencari di tempat yang salah." },
            { text: "Pool kekecilan — besarkan pool", why: "Salah: ukuran pool tidak ada hubungannya dengan rusaknya fitur sesi." },
            { text: "Restart PgBouncer tiap jam", why: "Salah: restart tidak mengubah kontrak mode — error akan kembali dalam hitungan menit." },
          ],
        },
        {
          q: "Serverless dengan ribuan fungsi yang tiap invoc-nya buka koneksi DB. Strategi yang benar?",
          options: [
            { text: "Pooler wajib + transaction/statement pooling + idle timeout agresif — pola koneksi terburuk butuh perlindungan maksimal", why: "Benar: buka-tutup massal = handshake storm; hanya pooler yang memisahkan pola fungsi dari keterbatasan DB.", correct: true },
            { text: "Naikkan max_connections ke 10.000", why: "Salah: 10.000 proses = database mati context switching — “solusi” yang membunuh pasien." },
            { text: "Biarkan — serverless otomatis scalable", why: "Salah: yang scalable adalah fungsinya; database-nya tidak ikut scalable otomatis." },
            { text: "Satu koneksi global dibagi semua fungsi", why: "Salah: koneksi tidak thread-safe untuk dipakai bersamaan tanpa pooler — race condition menanti." },
          ],
        },
        {
          q: "Diukur: λ = 1.000 transaksi/detik (p95), W = 50 ms (p95). Ukuran pool yang masuk akal?",
          options: [
            { text: "L = 50 → pool 75–100 dengan headroom; angka final divalidasi dari metrik antrean", why: "Benar: 1000 × 0,05 = 50 koneksi rata-rata; headroom 1,5–2× untuk burst; metrik antrean yang mengonfirmasi, bukan firasat.", correct: true },
            { text: "1.000 — satu koneksi per transaksi per detik", why: "Salah: λ adalah LAJU, bukan jumlah konkuren; Little's Law menunjukkan konkuren = laju × durasi = 50, bukan 1.000." },
            { text: "50 tepat — tanpa headroom, sesuai rumus", why: "Salah: rumus memberi rata-rata; tanpa headroom, setiap burst kecil langsung antre. Headroom adalah bagian dari desain." },
            { text: "10 — pool harus sekecil mungkin", why: "Salah: “sekecil mungkin” bukan prinsip; prinsipnya sekecil yang TERUKUR cukup — 10 jauh di bawah kebutuhan 50." },
          ],
        },
        {
          q: "Pool exhausted, thread aplikasi menumpuk, health check mulai gagal. Respons 10 menit pertama yang benar?",
          options: [
            { text: "Fail fast: kecilkan timeout antrean / shed load + circuit breaker; cari penyebab (idle-in-transaction terlama) — jangan besarkan pool membabi buta", why: "Benar: memperbesar pool saat cascade berjalan menambah bahan bakar spiral; hentikan pendarahan dulu, diagnosis kemudian.", correct: true },
            { text: "Besarkan pool 10× agar antrean hilang", why: "Salah: pool 10× berarti ratusan proses berebut CPU — menukar antrean yang terlihat dengan kemacetan tak terlihat yang lebih buruk." },
            { text: "Restart database agar koneksi bersih", why: "Salah: restart = downtime total + semua transaksi dibunuh; “bersih” yang menghancurkan segalanya bukan solusi." },
            { text: "Tunggu — beban pasti turun sendiri", why: "Salah: cascade tidak sembuh sendiri; thread yang menumpuk tidak menguap saat beban turun — ia sudah terlanjur macet." },
          ],
        },
      ],
    },
  ],
};

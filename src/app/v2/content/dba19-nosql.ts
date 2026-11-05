import type { V2Lesson } from "../lib/types";

// ── Figure: profil pola akses per keluarga mesin ─────────────────────────────
const ENGINE_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Profil pola akses lima keluarga mesin database: dominasi tulis, dominasi baca, relasi, fleksibilitas skema">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="120" y1="20" x2="120" y2="200"/><line x1="120" y1="200" x2="540" y2="200"/>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)">
<text x="10" y="55">key-value</text><text x="10" y="95">document</text><text x="10" y="135">wide-column</text><text x="10" y="175">graph</text>
<text x="120" y="220">kunci sederhana</text><text x="300" y="220">dokumen fleksibel</text><text x="450" y="220">relasi dalam</text>
</g>
<g opacity="0.85">
<rect x="122" y="42" width="180" height="18" rx="4" fill="var(--c1)"/>
<rect x="122" y="82" width="250" height="18" rx="4" fill="var(--c2)"/>
<rect x="122" y="122" width="380" height="18" rx="4" fill="var(--c3)"/>
<rect x="360" y="162" width="150" height="18" rx="4" fill="var(--c4)"/>
</g>
<g font-size="10" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="308" y="55">tulis/baca secepat kilat</text>
<text x="378" y="95">baca dokumen utuh</text>
<text x="508" y="135">tulis masif per waktu</text>
<text x="516" y="175">lompat antar relasi</text>
</g>
</svg>`;

export const dba19: V2Lesson = {
  slug: "dba19-nosql",
  track: "Database Administrator",
  module: "Skala & Cloud",
  title: "DBA19 — NoSQL & Database Lainnya: Memilih Mesin yang Tepat",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Tujuan, rute, dan bekal",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan kenapa satu mesin database tidak cukup untuk semua pola akses; (2) membedakan lima keluarga NoSQL — key-value, document, wide-column, graph, time-series — lengkap dengan harga yang dibayar tiap pilihan; (3) membaca trade-off konsistensi (eventual consistency, CAP, quorum baca/tulis) dan memilihnya secara sadar; (4) mengantisipasi bagaimana pekerjaan DBA bergeser saat skema pindah ke aplikasi; (5) merancang polyglot persistence tanpa membangun kebun binatang yang tidak terurus.",
        "Rutenya: cerita migrasi yang berbalik arah → kenapa dunia tak berhenti di relasional → dua langkah keluarga NoSQL → konsistensi & CAP → lab klasifikasi mesin → tugas DBA yang bergeser → peta keputusan → mini-case polyglot → kuis → rangkuman. Estimasi 65 menit; lab-nya ±10 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Database relasional (Postgres, MySQL) menyimpan data sebagai tabel dengan skema kaku, menegakkan integritas lewat constraint dan transaksi ACID, dan menjawab pertanyaan lintas tabel dengan JOIN. Kekuatannya: satu bahasa (SQL), jaminan konsistensi kuat, dan tooling matang. Batasnya: skema kaku menyakitkan saat struktur data berubah cepat, JOIN lintas jutaan baris untuk relasi berlapis menjadi lambat, dan skala tulis horizontal tidak selalu mulus. Lesson ini berangkat dari batas-batas itu — bukan dari kebencian pada SQL.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: mesin database seperti kendaraan — truk, sedan, motor, dan perahu semuanya “kendaraan”, tetapi kamu tidak mengangkut kontainer dengan motor. NoSQL bukan “database yang lebih modern”; ia adalah kendaraan untuk medan yang berbeda.",
      ],
      reference: "Bekal: relasional = tabel + skema kaku + ACID + JOIN. Batasnya: skema kaku, JOIN berlapis lambat, skala tulis tidak selalu mulus.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Satu JOIN yang berubah menjadi proyek tiga minggu",
      prose: [
        "Sebuah tim e-commerce memutuskan memindahkan SELURUH database mereka dari Postgres ke document store. Alasannya terdengar masuk akal: “skema produk kami berubah terus — tiap minggu ada atribut baru; di relasional tiap perubahan = migrasi ALTER TABLE yang menakutkan. Di document store, tiap dokumen boleh beda bentuk. Fleksibel!” Migrasi selesai dalam dua bulan. Katalog produk memang jadi lincah: atribut baru tinggal ditempel ke dokumen, tanpa migrasi. Tim merayakan.",
        "Tiga bulan kemudian datang bulan tutup buku. Laporan keuangan bulanan — yang dulunya SATU query JOIN antara tabel pesanan, pembayaran, dan pengembalian — tidak bisa lagi ditulis sebagai satu query. Data yang dulu terhubung lewat foreign key kini tersebar di dokumen-dokumen yang strukturnya tidak seragam: field `total` kadang bernama `total`, kadang `grand_total`, kadang tidak ada karena dihitung di aplikasi. Tim menghabiskan TIGA MINGGU menulis skrip rekonsiliasi, menemukan selisih Rp340 juta antara tiga versi angka, dan akhirnya menarik data mentah ke Postgres sementara hanya untuk menjawab satu pertanyaan: “berapa pendapatan bersih bulan ini?”",
        "Twist-nya: document store-nya tidak rusak dan tidak “salah”. Yang salah adalah memakainya untuk pekerjaan yang tidak cocok dengannya: agregasi lintas entitas dengan integritas ketat adalah pekerjaan relasional. Fleksibilitas skema yang menyelamatkan katalog produk adalah racun yang sama yang meracuni laporan keuangan. Pelajaran lesson ini: tidak ada mesin yang salah — yang ada hanya mesin yang dipakai di medan yang salah. Dan pekerjaan DBA modern adalah memilih medan untuk tiap mesin, bukan memilih satu mesin untuk semua medan.",
      ],
      tasks: [],
      note: {
        title: "Kenapa cerita ini urusan DBA, bukan cuma developer",
        type: "risk",
        body: "Keputusan “pindah mesin” sering dibuat developer demi kecepatan fitur — tetapi yang menanggung akibatnya adalah DBA: backup yang tidak konsisten, query analitik yang tidak bisa dijawab, dan data yang tidak bisa direkonsiliasi saat audit. DBA yang tidak dilibatkan di awal akan dilibatkan di akhir — saat masalahnya sudah berbentuk insiden.",
      },
      reference: "Tidak ada mesin yang salah — ada mesin yang dipakai di medan yang salah. Fleksibilitas skema = obat untuk katalog, racun untuk laporan keuangan.",
    },
    {
      id: "kenapa-nonrelasional",
      eyebrow: "Langkah 3 · Konsep",
      title: "Kenapa Dunia Tak Berhenti di Relasional — Si Tukang Jahit vs Konveksi",
      prose: [
        "Definisi masalahnya: relasional mengasumsikan data berbentuk tabel rapi dengan skema yang stabil, dan pertanyaan utamanya adalah “hubungkan baris-baris ini”. Tiga medan melanggar asumsi itu. Medan pertama: bentuk data yang berubah cepat — katalog produk dengan atribut berbeda per kategori, profil pengguna dengan preferensi arbitrer. Memaksanya ke tabel berarti kolom `attr_1 … attr_50` yang setengahnya kosong, atau tabel EAV (entity-attribute-value) yang JOIN-nya mengerikan. Medan kedua: skala tulis ekstrem — jutaan event per detik dari sensor atau log; relasional single-node kehabisan napas, dan sharding manual adalah proyek tersendiri. Medan ketiga: relasi berlapis dalam — “teman dari teman dari teman yang pernah membeli X”; di relasional ini JOIN berulang yang eksponensial, padahal pertanyaannya pada dasarnya adalah perjalanan di atas graph.",
        "Kepribadiannya: relasional adalah tukang jahit bespoke — presisi, ukuran pas, jahitan kuat (constraint, transaksi), tetapi lambat dan mahal untuk pesanan massal yang modelnya ganti tiap minggu. Mesin NoSQL adalah konveksi: cepat memproduksi ribuan potong pola longgar, tetapi jangan minta setelan jas tiga potong yang pas di badan. Keduanya “pakaian”; medan yang menentukan siapa yang dipakai.",
        "Kapan relasional TETAP menang: data keuangan/akuntansi (integritas > segalanya), agregat lintas entitas (laporan, BI), dan tim yang sudah mahir SQL dengan tooling matang. Kapan ia kalah: tiga medan di atas. Aturan praktisnya: bila pertanyaan utamamu “hubungkan dan jumlahkan dengan benar”, relasional. Bila “simpan dan ambil secepat mungkin dengan bentuk bebas”, lihat keluarga NoSQL.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “NoSQL = pengganti SQL yang lebih modern”",
        type: "pitfall",
        body: "Yang benar: NoSQL adalah singkatan dari “not only SQL” — tambahan, bukan pengganti. Perusahaan yang “pindah total” dari relasional ke NoSQL hampir selalu membangun ulang separuh fitur relasional (transaksi, constraint, JOIN) dengan tangan, lebih buruk, di lapisan aplikasi. Modern ≠ cocok.",
      },
      hints: [
        "💡 Intuisi: tanyakan “pertanyaan tersulit apa yang harus dijawab data ini dalam 2 tahun ke depan?” — bukan “bentuk datanya seperti apa hari ini?”. Bentuk berubah; pertanyaan tersulit jarang berubah.",
      ],
      reference: "Relasional menang di: integritas, agregat lintas entitas, tooling. Kalah di: skema berubah cepat, tulis ekstrem, relasi berlapis.",
    },
    {
      id: "keluarga-kv-doc",
      eyebrow: "Langkah 4 · Konsep",
      title: "Keluarga 1–2: Key-Value & Document — Si Laci dan Si Map Fleksibel",
      prose: [
        "Key-value store (contoh: Redis, Memcached) adalah model paling sederhana: kamus raksasa `kunci → nilai`. Kekuatannya: kecepatan brutal untuk baca/tulis per kunci (mikrodetik, jutaan operasi per detik) dan kesederhanaan operasional. Harganya: tidak ada query selain per kunci — “tampilkan semua sesi pengguna Jakarta yang login minggu ini” tidak bisa dijawab; dan datanya biasanya di memori (mahal per GB, hilang saat restart kecuali persistensi dikonfigurasi). Medan alaminya: cache, sesi login, rate limiter, antrean — data yang selalu diakses lewat kuncinya dan boleh hilang (cache) atau mudah dibangun ulang.",
        "Document store (contoh: MongoDB, Couchbase) menyimpan dokumen mirip JSON — tiap dokumen boleh beda bentuk. Kekuatannya: baca satu entitas utuh dalam sekali ambil (profil pengguna + preferensinya sekaligus, tanpa JOIN), dan skema longgar yang ramah perubahan. Harganya: JOIN lintas dokumen mahal/tidak ada — hubungan antar entitas harus di-denormalisasi (data diduplikasi) atau di-resolve di aplikasi; dan “skema longgar” berarti validasi pindah ke aplikasi — inkonsistensi bentuk diam-diam menumpuk (field `total` vs `grand_total` di cerita pembuka). Medan alaminya: katalog, konten, profil — entitas yang dibaca utuh dan jarang dihubungkan silang.",
        "Kepribadiannya: key-value adalah laci arsip bernomor — ambil nomor 42, dapat map 42, secepat kilat; tetapi jangan minta “semua map tentang kucing”. Document adalah map fleksibel — tiap map boleh beda isi dan tebal; enak untuk arsip per kasus, mimpi buruk untuk sensus.",
        "Cara membaca chart di bawah: sumbu X = dari “kunci sederhana” ke “relasi dalam” (kompleksitas pola akses); panjang batang = keunggulan relatif tiap mesin di medannya; label = pekerjaan yang paling cocok. Interpretasi: tidak ada batang yang menutupi seluruh sumbu — tiap mesin unggul di segmennya dan melemah di luar itu. Pelajaran chart ini: memilih mesin = mencocokkan pola aksesmu dengan segmen terpanjang, bukan memilih “yang paling populer”.",
      ],
      figure: {
        svg: ENGINE_SVG,
        alt: "Diagram batang profil pola akses: key-value unggul di kunci sederhana, document di dokumen fleksibel, wide-column di tulis masif, graph di relasi dalam.",
        caption: "Profil pola akses per keluarga mesin: tiap mesin unggul di segmennya sendiri.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: “Skema longgar = tidak butuh skema”",
        type: "pitfall",
        body: "Yang benar: skema longgar = skema PINDAH ke aplikasi, bukan hilang. Tanpa validasi eksplisit di aplikasi (atau JSON Schema), “fleksibel” berubah menjadi “setiap dokumen adalah kejutan”. DBA tetap butuh katalog bentuk data — hanya saja ia hidup di kode, bukan di DDL.",
      },
      reference: "Key-value: tercepat per kunci, tanpa query silang. Document: entitas utuh sekali ambil, JOIN mahal, validasi pindah ke aplikasi.",
    },
    {
      id: "keluarga-wc-graph-ts",
      eyebrow: "Langkah 5 · Konsep",
      title: "Keluarga 3–5: Wide-Column, Graph, Time-Series — Si Gudang, Si Detektif, Si Pencatat Waktu",
      prose: [
        "Wide-column store (contoh: Cassandra, ScyllaDB, Bigtable) menyimpan baris dengan kolom dinamis, dioptimasi untuk TULIS MASIF yang tersebar ke banyak node: jutaan baris per detik dari sensor, log, atau event. Kekuatannya: throughput tulis linear mengikuti jumlah node, dan baca cepat bila mengikuti kunci partisi + rentang waktu. Harganya: pola bacanya kaku — query yang tidak mengikuti desain partisi menjadi full scan yang lambat; dan tidak ada JOIN. Desain tabelnya dimulai dari pertanyaan, bukan dari entitas (“query-first modeling”). Medan alaminya: deret waktu masif, log, metrik, inbox per pengguna.",
        "Graph database (contoh: Neo4j) menyimpan node dan relasi sebagai warga kelas satu, dioptimasi untuk perjalanan berlapis (“teman dari teman yang membeli X dan tinggal di Bandung”). Kekuatannya: query relasi dalam yang di relasional butuh JOIN eksponensial menjadi traversal linear. Harganya: agregat global dan tulis masif bukan medannya; dan tim harus berpikir dalam graph, bukan tabel. Medan alaminya: jaringan sosial, deteksi fraud berjejaring, rekomendasi, lineage data.",
        "Time-series database (contoh: InfluxDB, TimescaleDB) adalah spesialis deret waktu: kompresi kolom per waktu, retensi otomatis (data lama di-downsample/dihaus), dan fungsi agregasi jendela waktu bawaan. Kekuatannya: menyimpan metrik bertahun-tahun dengan murah. Harganya: bukan database umum — jangan simpan data transaksional di sini. Catatan jujur: TimescaleDB sendiri dibangun di atas Postgres — “NoSQL” di sini lebih soal pola akses daripada ideologi.",
        "Kepribadiannya: wide-column adalah gudang logistik raksasa — menerima kontainer bertubi-tubi dan tahu persis di rak mana tiap kontainer, tetapi jangan minta ia merakit furnitur. Graph adalah detektif — brilian menelusuri “siapa kenal siapa”, payah menghitung sensus. Time-series adalah pencatat waktu yang disiplin — ingat setiap detik, melupakan yang tidak penting sesuai jadwal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memodelkan wide-column seperti tabel relasional (normalisasi penuh), lalu heran kenapa bacanya lambat. Wide-column menuntut denormalisasi sadar: satu query = satu tabel yang dirancang untuknya. “Satu tabel untuk banyak query” adalah pola pikir relasional yang harus ditinggal di pintu.",
      },
      hints: [
        "💡 Intuisi: di wide-column, kamu tidak bertanya “data apa yang kumiliki?” lalu “bagaimana query-nya?” — urutannya dibalik: “query apa yang harus cepat?” lalu “tabel seperti apa yang melayaninya?”. Skema MENGIKUTI query.",
      ],
      reference: "Wide-column: tulis masif + baca mengikuti partisi; desain dari query. Graph: traversal relasi dalam. Time-series: deret waktu + retensi otomatis.",
    },
    {
      id: "konsistensi-cap",
      eyebrow: "Langkah 6 · Konsep",
      title: "Konsistensi: Harga yang Dibayar untuk Skala",
      prose: [
        "Definisi: eventual consistency berarti setelah tulis, replika lain akan SAMA — “segera”, tetapi tidak seketika. Selama jendela itu, dua pembaca bisa melihat dua versi berbeda. Ini bukan bug; ini harga yang dibayar agar tulis tetap tersedia saat jaringan terpartisi atau replika jauh. Contoh konkret: pengguna mengganti foto profil; temannya di benua lain masih melihat foto lama selama 2 detik. Untuk foto profil: tidak masalah. Untuk saldo rekening: masalah besar.",
        "Teorema CAP — disajikan jujur sebagai kerangka, bukan hukum fisika: saat terjadi partisi jaringan (P — dan partisi PASTI terjadi), sistem memilih antara Konsistensi (C: semua node setuju, atau tolak tulis) dan Ketersediaan (A: terima tulis walau replika belum sinkron). Versi populer “pilih 2 dari 3” adalah penyederhanaan yang menyesatkan — realitanya adalah spektrum trade-off latensi vs konsistensi, dan CAP hanya bicara saat partisi terjadi. Yang perlu diingat praktisi: tidak ada sistem terdistribusi yang sekaligus selalu konsisten, selalu tersedia, dan tahan partisi. Pilihlah secara sadar per kasus penggunaan, bukan per produk.",
        "Quorum baca/tulis adalah kenop penyetelnya. Dengan N replika, W = jumlah replika yang harus mengakui tulis, R = jumlah replika yang dibaca. Aturan praktis di bawah memberi konsistensi kuat: bila himpunan penulis dan pembaca pasti beririsan, pembaca pasti melihat tulis terbaru.",
      ],
      formula: String.raw`W + R > N \;\Rightarrow\; \text{baca-melihat-tulis-terbaru}`,
      formulaNote: "N = jumlah replika; W = quorum tulis (replika yang harus OK sebelum tulis dianggap berhasil); R = quorum baca (replika yang ditanya). Contoh: N=3, W=2, R=2 → 2+2>3 ✓ kuat. N=3, W=1, R=1 → 1+1≯3 ✗ eventual (cepat, tapi bisa baca data basi). Interpretasi: menaikkan W melambatkan tulis; menaikkan R melambatkan baca; W+R>N adalah harga konsistensi kuat — bayar di latensi.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Eventual consistency = data bisa hilang”",
        type: "pitfall",
        body: "Yang benar: eventual = TERLAMBAT, bukan hilang. Data yang ditulis dengan W memadai tidak hilang — ia hanya belum terlihat di semua replika seketika. Kehilangan data adalah soal durabilitas (apakah tulis di-persist), bukan soal konsistensi (kapan terlihat). Dua masalah berbeda, dua solusi berbeda.",
      },
      hints: [
        "💡 Intuisi: konsistensi kuat seperti rapat yang menunggu semua peserta hadir sebelum keputusan sah — benar, tetapi lambat. Eventual seperti pengumuman ditempel di papan: yang lewat belakangan membacanya belakangan. Pilih rapat untuk kontrak; pilih papan pengumuman untuk foto profil.",
      ],
      reference: "CAP = kerangka saat partisi: pilih C atau A secara sadar per kasus. W+R>N = harga konsistensi kuat, dibayar dengan latensi.",
    },
    {
      id: "lab-pilih-mesin",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab — Klasifikasikan mesin untuk enam kebutuhan",
      prose: [
        "Waktunya jadi arsitek. Di bawah ada enam kebutuhan aplikasi (SINTETIS) beserta pola aksesnya. Tugasmu: tulis `pilih_mesin(k)` yang mengembalikan mesin yang tepat — \"key-value\", \"document\", \"wide-column\", \"graph\", atau \"relasional\" — berdasar aturan yang diajarkan di lesson ini, lalu hitung ringkasannya: berapa kebutuhan per mesin, dan mana yang merupakan JEBAKAN (kebutuhan yang tampak cocok untuk NoSQL tetapi sebenarnya butuh relasional).",
        "Coba: setelah lolos, tambahkan kebutuhan ketujuh versimu sendiri (mis. “riwayat chat per pengguna”) dan lihat mesin apa yang dipilih aturanmu — lalu tanyakan: apakah aturan pilihannya masih masuk akal, atau butuh pengecualian?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `pilih_mesin(k)`: kembalikan mesin berdasar pola akses (relasi-dalam → graph; join+transaksi → relasional; rentang-waktu+append masif → wide-column; kunci saja → key-value; dokumen utuh → document)" },
        { id: "t2", text: "Bangun dict `mesin` = {nama: pilih_mesin(kebutuhan[nama])} untuk semua kebutuhan" },
        { id: "t3", text: "Hitung `ringkasan` = {mesin: jumlah} dari dict mesin" },
        { id: "t4", text: "Kumpulkan `jebakan` = kebutuhan yang mesinnya \"relasional\" (tampak NoSQL-able, tetapi butuh integritas)" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "ringkasan: {'key-value': 2, 'document': 1, 'wide-column': 1, 'graph': 1, 'relasional': 1}\njebakan: ['laporan_keuangan']",
      code: {
        starter: `# Kebutuhan aplikasi (SINTETIS): nama -> pola akses
kebutuhan = {
    "sesi_login":      {"pola": "kunci", "struktur": "tetap",     "join": False, "tulis": "tinggi"},
    "katalog_produk":  {"pola": "dokumen", "struktur": "fleksibel", "join": False, "tulis": "sedang"},
    "log_sensor_iot":  {"pola": "rentang-waktu", "struktur": "tetap", "join": False, "tulis": "sangat-tinggi"},
    "jaringan_fraud":  {"pola": "relasi-dalam", "struktur": "graf",  "join": True,  "tulis": "sedang"},
    "laporan_keuangan": {"pola": "agregat", "struktur": "tetap",     "join": True,  "tulis": "rendah"},
    "keranjang_belanja": {"pola": "kunci", "struktur": "fleksibel",  "join": False, "tulis": "tinggi"},
}

# TULIS KODEMU DI BAWAH INI
def pilih_mesin(k):
    return

mesin = {}  # TODO: {nama: pilih_mesin(...)} untuk semua kebutuhan

ringkasan = {}  # TODO: {mesin: jumlah}

jebakan = []  # TODO: kebutuhan yang mesinnya "relasional"

print(f"ringkasan: {ringkasan}")
print(f"jebakan: {jebakan}")`,
        lockLines: 9,
        solution: `# Kebutuhan aplikasi (SINTETIS): nama -> pola akses
kebutuhan = {
    "sesi_login":      {"pola": "kunci", "struktur": "tetap",     "join": False, "tulis": "tinggi"},
    "katalog_produk":  {"pola": "dokumen", "struktur": "fleksibel", "join": False, "tulis": "sedang"},
    "log_sensor_iot":  {"pola": "rentang-waktu", "struktur": "tetap", "join": False, "tulis": "sangat-tinggi"},
    "jaringan_fraud":  {"pola": "relasi-dalam", "struktur": "graf",  "join": True,  "tulis": "sedang"},
    "laporan_keuangan": {"pola": "agregat", "struktur": "tetap",     "join": True,  "tulis": "rendah"},
    "keranjang_belanja": {"pola": "kunci", "struktur": "fleksibel",  "join": False, "tulis": "tinggi"},
}

# TULIS KODEMU DI BAWAH INI
def pilih_mesin(k):
    if k["pola"] == "relasi-dalam":
        return "graph"
    if k["join"] and k["pola"] in ("agregat", "transaksi"):
        return "relasional"
    if k["pola"] == "rentang-waktu" and k["tulis"] == "sangat-tinggi":
        return "wide-column"
    if k["pola"] == "kunci":
        return "key-value"
    if k["pola"] == "dokumen":
        return "document"
    return "relasional"

mesin = {nama: pilih_mesin(k) for nama, k in kebutuhan.items()}

ringkasan = {}
for m in mesin.values():
    ringkasan[m] = ringkasan.get(m, 0) + 1

jebakan = [nama for nama, m in mesin.items() if m == "relasional"]

print(f"ringkasan: {ringkasan}")
print(f"jebakan: {jebakan}")`,
        checks: [
          { kind: "defined", task: "t1", name: "pilih_mesin", label: "Fungsi `pilih_mesin` terdefinisi", msg: "Definisikan def pilih_mesin(k) di bawah marker." },
          { kind: "equal", task: "t2", name: "mesin", value: {"sesi_login": "key-value", "katalog_produk": "document", "log_sensor_iot": "wide-column", "jaringan_fraud": "graph", "laporan_keuangan": "relasional", "keranjang_belanja": "key-value"}, tol: 0, label: "`mesin` terklasifikasi tepat", msg: "Ikuti aturan prioritas: relasi-dalam → graph; join+agregat → relasional; rentang-waktu masif → wide-column; kunci → key-value; dokumen → document." },
          { kind: "equal", task: "t3", name: "ringkasan", value: {"key-value": 2, "document": 1, "wide-column": 1, "graph": 1, "relasional": 1}, tol: 0, label: "`ringkasan` = hitungan per mesin", msg: "Hitung kemunculan tiap mesin dari dict mesin." },
          { kind: "equal", task: "t4", name: "jebakan", value: ["laporan_keuangan"], tol: 0, label: "`jebakan` = ['laporan_keuangan']", msg: "Satu-satunya kebutuhan bermesin relasional — persis seperti cerita pembuka." },
          { kind: "stdout_matches", task: "t5", pattern: "ringkasan: \\{'key-value': 2", label: "Ringkasan tercetak", msg: "Baris pertama diawali \"ringkasan: {'key-value': 2\"." },
          { kind: "stdout_matches", task: "t5", pattern: "jebakan: \\['laporan_keuangan'\\]", label: "Jebakan tercetak", msg: "Baris kedua: \"jebakan: ['laporan_keuangan']\"." },
        ],
      },
      reference: "Klasifikasi = cocokkan pola akses dengan medan tiap mesin. Aturan prioritas menentukan hasil saat pola bertabrakan.",
    },
    {
      id: "tugas-dba-bergeser",
      eyebrow: "Langkah 8 · Konsep",
      title: "Tugas DBA Bergeser — Dari Penjaga Skema ke Kurator Medan",
      prose: [
        "Perubahan pertama: skema pindah ke aplikasi — tetapi pekerjaan validasi tidak hilang. Di relasional, DBA menulis DDL dan constraint menolak data buruk di pintu. Di document store, “pintu” itu pindah ke kode aplikasi: validasi JSON Schema, kontrak versi dokumen, dan migrasi bentuk data yang berjalan diam-diam di background. DBA yang mengira “tidak ada skema = tidak ada kerjaan skema” akan menemukan setahun kemudian bahwa koleksi berisi 14 varian bentuk dokumen dan tidak ada yang tahu mana yang kanonis. Pekerjaan barunya: kurasi katalog bentuk data + memaksa validasi di pipeline tulis, bukan berharap.",
        "Perubahan kedua: backup, keamanan, dan observability berbeda per mesin. Backup key-value in-memory (snapshot + AOF) tidak sama dengan backup document (oplog point-in-time) atau wide-column (snapshot per node + repair). Model keamanan pun bergeser: dari GRANT per tabel menjadi kontrol akses per koleksi/keyspace — plus enkripsi antar-node yang di relasional single-node tidak pernah dipikirkan. Monitoring: metrik “query lambat” digantikan “hot partition”, “compaction tertunda”, atau “replica lag per keyspace”. DBA polyglot memelihara kamus operasional per mesin, bukan satu playbook.",
        "Perubahan ketiga — dan paling berbahaya: jebakan memilih NoSQL untuk masalah relasional. Tandanya: tim membangun “JOIN manual” di aplikasi (N+1 query ke document store), menulis “transaksi” sendiri dengan kompensasi yang rapuh, atau mengeluh “kenapa agregatnya lambat”. Setiap pola ini adalah sinyal bahwa medan yang dipilih salah — dan biaya memperbaikinya naik 10× setelah data terlanjur besar. Tugas DBA di fase desain: menjadi orang yang berani bertanya “pertanyaan tersulitnya apa?” sebelum mesin dipilih — seperti pelajaran di langkah 3.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko operasional polyglot yang paling mahal bukan lisensi — melainkan inkonsistensi bentuk data yang ditemukan saat audit atau insiden. Anggaran mitigasinya murah: validasi skema di pipeline tulis + katalog bentuk data yang dirawat. Anggaran penyesalannya mahal: rekonsiliasi tiga minggu seperti cerita pembuka, dikali setiap tutup buku.",
      },
      hints: [
        "💡 Intuisi: DBA relasional adalah penjaga gerbang (constraint menolak di pintu). DBA NoSQL adalah kurator museum (bentuknya bebas, tetapi tiap artefak tetap dikatalog dan diverifikasi). Gerbangnya pindah; pekerjaannya tidak hilang.",
      ],
      reference: "Skema pindah ke aplikasi ≠ skema hilang. Backup/keamanan/monitoring berbeda per mesin. Sinyal medan salah: JOIN manual, transaksi rakitan, agregat lambat.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Memilih mesin — lima skenario",
      prose: [
        "Skenario 1 — Sesi login 5 juta pengguna aktif, baca/tulis per kunci, boleh hilang (dibangun ulang saat login). → Key-value in-memory. Alasan: pola akses murni per kunci + toleransi kehilangan = medan key-value yang sempurna; relasional hanya menambah latensi tanpa manfaat.",
        "Skenario 2 — Katalog marketplace: 2 juta produk, atribut beda per kategori, dibaca utuh per produk, jarang dihubungkan silang. → Document store + validasi JSON Schema di pipeline tulis. Alasan: fleksibilitas bentuk adalah kebutuhan nyata; validasi mencegah 14 varian bentuk setahun kemudian.",
        "Skenario 3 — Sensor IoT: 500 ribu perangkat × 1 pesan/detik, dibaca per rentang waktu, retensi 90 hari. → Wide-column atau time-series DB. Alasan: tulis masif + pola baca rentang-waktu = medan tulis-append; relasional akan kehabisan napas di tulis dan mahal di retensi.",
        "Skenario 4 — Deteksi fraud: “apakah penerima transfer ini terhubung (≤3 lompatan) ke rekening berlabel fraud?” → Graph database. Alasan: pertanyaan relasi-dalam; di relasional ini JOIN 3× yang eksponensial, di graph ini traversal linear.",
        "Skenario 5 — Pembukuan & laporan keuangan perusahaan. → Tetap relasional. Alasan: integritas, audit trail, agregat lintas entitas — medan relasional murni. Ini skenario “jebakan”: godaan “modernisasi” ke document store berakhir seperti cerita pembuka.",
        "Aturan praktis 10 detik: (1) tulis pola akses tersulit dalam satu kalimat; (2) cocokkan ke medan — kunci / dokumen / tulis-masif / relasi-dalam / integritas-ketat; (3) bila jawabannya “integritas-ketat + agregat”, berhenti — relasional; (4) bila NoSQL, tulis juga harga yang dibayar (konsistensi? JOIN manual? validasi di aplikasi?) sebelum setuju.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih mesin berdasar “apa yang dipakai startup terkenal” alih-alih pola akses sendiri. Startup itu memilih untuk medannya — meniru pilihannya tanpa meniru medannya adalah kargo kultus berbiaya infrastruktur.",
      },
      reference: "Satu kalimat pola akses → medan → mesin. Tulis harganya sebelum setuju.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Arsitektur data TokoNusa: empat mesin, satu sistem",
      prose: [
        "Skenario (sintetis, untuk latihan): TokoNusa, marketplace dengan 8 juta pengguna. Tim mengusulkan arsitektur: (a) sesi & keranjang aktif di key-value (Redis) — 40 juta operasi/hari, TTL 24 jam; (b) katalog 3 juta produk di document store — atribut beda per kategori; (c) event klik & log 2 miliar baris/bulan di wide-column — retensi 90 hari untuk analitik funnel; (d) pembukuan, pesanan, pembayaran TETAP di Postgres — dengan replikasi baca untuk laporan. Estimasi biaya operasional: 4 mesin = 4 playbook backup, 4 dashboard monitoring, dan tim 3 DBA yang harus menguasai semuanya.",
        "Pertanyaan analisis: (1) Untuk tiap dari 4 pilihan (a–d), sebutkan pola akses yang membuatnya tepat — dan harga apa yang dibayar. (2) Di mana titik paling rapuh dari arsitektur ini? (Petunjuk: pikirkan apa yang terjadi bila data yang sama hidup di dua mesin.) (3) Satu usulan penyederhanaan: mesin mana yang bisa dihapus tanpa mengorbankan kebutuhan bisnis — dan apa syaratnya?",
        "Pembahasan: (1a) Pola per kunci + boleh hilang = key-value; harga: data tidak tahan lama, butuh TTL & strategi cache-aside yang benar. (1b) Dokumen dibaca utuh + bentuk fleksibel = document; harga: validasi di aplikasi + tanpa JOIN silang. (1c) Tulis masif + baca rentang waktu = wide-column; harga: desain partisi dari query, retensi otomatis. (1d) Integritas + agregat = relasional; harga: skala vertikal + replikasi baca. (2) Titik rapuh: sinkronisasi antar mesin — status pesanan di Postgres vs event di wide-column bisa berbeda selama jendela eventual; tanpa kontrak “sumber kebenaran per fakta”, rekonsiliasi menjadi proyek abadi. (3) Kandidat penyederhanaan: wide-column bisa diganti time-series DB bila pola bacanya murni deret waktu (lebih murah operasionalnya) — syaratnya: tidak ada query non-waktu atas data itu. Atau sebaliknya: bila tim hanya 1 DBA, pertimbangkan menunda (c) sampai volume benar-benar butuh — premature polyglot = kebun binatang tanpa penjaga.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Setiap mesin tambahan = permukaan risiko operasional baru (backup gagal, patch tertunda, akses salah konfigurasi). Dalam risk register, “N mesin database” harus tercatat sebagai risiko dengan mitigasi: playbook per mesin + drill restore per mesin + pemilik yang jelas per mesin. Mesin tanpa pemilik = insiden yang menunggu giliran.",
      },
      reference: "Polyglot yang sehat: tiap mesin punya medan, harga tertulis, dan pemilik. Sumber kebenaran per fakta — tunggal dan eksplisit.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Tidak ada mesin yang salah — ada mesin yang dipakai di medan yang salah; pilih berdasar pola akses tersulit.",
        "Key-value: tercepat per kunci, tanpa query silang — untuk cache, sesi, rate limiter.",
        "Document: entitas utuh sekali ambil, skema longgar — validasi pindah ke aplikasi, bukan hilang.",
        "Wide-column: tulis masif + baca mengikuti partisi; graph: traversal relasi dalam; time-series: deret waktu + retensi.",
        "CAP adalah kerangka trade-off saat partisi (bukan “pilih 2 dari 3” yang kaku); W+R>N membayar konsistensi kuat dengan latensi.",
        "Polyglot sehat = tiap mesin punya medan, harga tertulis, pemilik jelas, dan satu sumber kebenaran per fakta.",
      ],
      next: { label: "DBA20 — pgvector: Vector Search di PostgreSQL", href: "/learn/dba20-pgvector" },
      quiz: [
        {
          q: "Tim ingin memindahkan laporan keuangan ke document store demi “fleksibilitas”. Respons DBA yang tepat?",
          options: [
            { text: "Setuju — fleksibilitas selalu baik", why: "Salah: fleksibilitas skema adalah racun untuk agregat lintas entitas dengan integritas ketat — persis cerita pembuka.", correct: false },
            { text: "Tolak dengan alasan: agregat lintas entitas + integritas + audit = medan relasional; document store memindahkan JOIN ke aplikasi dan validasi ke kode", why: "Benar: medan menentukan mesin. Laporan keuangan butuh JOIN, constraint, dan angka yang bisa direkonsiliasi — ketiganya kekuatan relasional.", correct: true },
            { text: "Setuju asal pakai JSON Schema", why: "Salah: JSON Schema menyelesaikan validasi bentuk, bukan hilangnya JOIN dan transaksi lintas entitas.", correct: false },
            { text: "Tolak karena document store lebih lambat", why: "Salah alasan: document store bisa sangat cepat di medannya — penolakannya soal KECOCOKAN, bukan kecepatan.", correct: false },
          ],
        },
        {
          q: "Aplikasi butuh “tampilkan semua sesi pengguna Jakarta yang login minggu ini” dari key-value store. Masalahnya?",
          options: [
            { text: "Tidak masalah — key-value bisa query apa pun", why: "Salah: key-value hanya bisa diakses per kunci; query silang berdasar atribut bukan medannya.", correct: false },
            { text: "Pola aksesnya query silang per atribut, sedangkan key-value hanya melayani akses per kunci — butuh indeks sekunder (document/relasional) atau desain ulang kunci", why: "Benar: memilih mesin = mencocokkan pola akses. Query atribut ≠ akses kunci.", correct: true },
            { text: "Tambah RAM agar query-nya cepat", why: "Salah: RAM tidak menambah kemampuan query — masalahnya model data, bukan kapasitas.", correct: false },
            { text: "Itu eventual consistency, tunggu saja", why: "Salah: ini bukan soal keterlambatan replika, melainkan ketidakmampuan model.", correct: false },
          ],
        },
        {
          q: "N=3 replika, tim menyetel W=1, R=1 demi latensi tercepat. Konsekuensinya?",
          options: [
            { text: "Konsistensi kuat tetap terjaga", why: "Salah: 1+1 tidak lebih dari 3 — himpunan baca dan tulis bisa tidak beririsan.", correct: false },
            { text: "Eventual consistency: baca bisa mendapat data basi; kecepatannya dibayar dengan jendela ketidakpastian", why: "Benar: W+R>N tidak terpenuhi. Cocok untuk foto profil; berbahaya untuk saldo.", correct: true },
            { text: "Data bisa hilang permanen", why: "Salah: eventual = terlambat terlihat, bukan hilang — durabilitas soal persistensi, bukan quorum.", correct: false },
            { text: "Sistem tidak tahan partisi jaringan", why: "Salah: justru W=1,R=1 sangat tahan partisi (tetap tersedia) — yang dikorbankan adalah konsistensi.", correct: false },
          ],
        },
        {
          q: "Setelah setahun memakai document store tanpa validasi, koleksi berisi 14 varian bentuk dokumen. Akar masalahnya?",
          options: [
            { text: "Document store-nya rusak", why: "Salah: mesinnya bekerja sesuai desain — skema longgar memang mengizinkan ini.", correct: false },
            { text: "Skema longgar disalahartikan sebagai tanpa skema — validasi yang seharusnya pindah ke aplikasi tidak pernah ditulis", why: "Benar: skema tidak hilang, ia pindah. Tanpa kurasi, fleksibilitas menjadi akumulasi kejutan.", correct: true },
            { text: "Kurang indeks", why: "Salah: indeks mempercepat baca, tidak menyeragamkan bentuk.", correct: false },
            { text: "Harus kembali ke relasional", why: "Salah: solusinya validasi + katalog bentuk, bukan pindah mesin — medannya (dokumen fleksibel) tetap tepat.", correct: false },
          ],
        },
        {
          q: "Pertanyaan “rekening ini terhubung ≤3 lompatan ke rekening fraud?” paling tepat dijawab oleh?",
          options: [
            { text: "Relasional dengan 3× JOIN", why: "Salah bisa: JOIN berlapis eksponensial — bisa jalan untuk data kecil, tetapi bukan medan alaminya.", correct: false },
            { text: "Graph database — traversal relasi dalam adalah medan alaminya", why: "Benar: relasi sebagai warga kelas satu; traversal linear vs JOIN eksponensial.", correct: true },
            { text: "Key-value store", why: "Salah: tidak ada konsep relasi sama sekali di key-value.", correct: false },
            { text: "Time-series database", why: "Salah: time-series untuk deret waktu, bukan topologi relasi.", correct: false },
          ],
        },
        {
          q: "Perusahaan menjalankan 5 mesin database tetapi hanya 1 DBA yang paham 2 di antaranya. Risiko terbesar?",
          options: [
            { text: "Biaya lisensi", why: "Salah: sebagian besar mesin ini open-source — biaya lisensi bukan risiko terbesarnya.", correct: false },
            { text: "Mesin tanpa pemilik dan tanpa playbook: backup tak teruji, patch tertunda, akses salah konfigurasi — insiden menunggu giliran", why: "Benar: permukaan operasional tumbuh per mesin; tanpa pemilik, tiap mesin adalah risiko yang belum terjadwal.", correct: true },
            { text: "Kurang modern dibanding kompetitor", why: "Salah: “modern” bukan metrik risiko operasional.", correct: false },
            { text: "Query menjadi lebih lambat", why: "Salah: tiap mesin cepat di medannya — masalahnya operasional, bukan kecepatan query.", correct: false },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";


const SETUP_IDX = `import sqlite3, random
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE trx (
  id INTEGER PRIMARY KEY,
  kota TEXT,
  nominal REAL,
  tanggal TEXT
)""")
random.seed(42)
kotas = ['Jakarta','Bandung','Surabaya','Medan','Semarang',
         'Makassar','Denpasar','Palembang','Yogyakarta','Malang']
rows = [(i, kotas[i % 10], random.randint(1000000, 20000000),
         f"2026-{(i%12)+1:02d}-{(i%28)+1:02d}") for i in range(1, 5001)]
cur.executemany("INSERT INTO trx VALUES (?,?,?,?)", rows)
db.commit()
Q = "SELECT nominal FROM trx WHERE kota = 'Jakarta' AND nominal > 5000000"`;

const TAIL_IDX = `
# Rencana SEBELUM index dibuat:
print("== SEBELUM (tanpa index) ==")
for p in cur.execute("EXPLAIN QUERY PLAN " + Q).fetchall():
    print(p[3])
# TULIS statement CREATE INDEX-mu sebagai string sql, lalu jalankan.
sql = """

"""
cur.execute(sql)
db.commit()
print("== SESUDAH (dengan index) ==")
for p in cur.execute("EXPLAIN QUERY PLAN " + Q).fetchall():
    print(p[3])
print("== definisi index ==")
for r in cur.execute("SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='trx' AND sql IS NOT NULL").fetchall():
    print(r[0])`;

export const c17: V2Lesson = {
  slug: "c17-index-explain",
  track: "SQL",
  module: "Engineering",
  title: "C17 Index & EXPLAIN: Membuat Query Terbang",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-40detik",
      eyebrow: "Langkah 1 · Index",
      title: "Query 40 detik menjadi 0,2 detik",
      prose: [
        "Dashboard direksi loading 40 detik — tiap refresh, direksi menunggu sambil menatap analis. Satu baris `CREATE INDEX` mengubahnya jadi 0,2 detik. Bukan sihir — hanya memahami cara database mencari data. Analogi: tanpa index = baca buku halaman per halaman (full scan); dengan index (B-tree) = lihat daftar isi → lompat ke halaman (seek).",
        "Ironinya: index mempercepat baca tapi memperlambat tulis — tidak ada makan siang gratis, hanya tradeoff yang tepat. Tiap index = beban saat INSERT/UPDATE + storage + pilihan planner yang membingungkan. Aturan: index untuk pola query nyata (yang lambat & sering), bukan “jaga-jaga”. 3–5 index tepat > 20 index acak.",
        "`CREATE INDEX idx_transaksi_tanggal ON transaksi(tanggal);` — untuk WHERE selektif, JOIN key, ORDER BY. Tidak membantu: tabel kecil (< 10rb baris — full scan lebih cepat!), kolom low-cardinality (status 3 nilai), `LIKE '%x%'` (tak bisa pakai B-tree). Composite `(kota, tanggal)`: kolom EQUALITY dulu, RANGE belakangan — urutan menentukan cabang mana yang bisa dilompati.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Makin banyak index makin cepat.” Salah! Index = investasi: bayar di tulis, panen di baca — hanya untuk query yang sering. Dua harganya: write melambat (tiap INSERT/UPDATE harus update semua index) dan ruang + maintenance.",
      },
      reference: "Index (B-tree) = daftar isi; untuk WHERE selektif/JOIN/ORDER BY di tabel besar.",
    },
    {
      id: "explain",
      eyebrow: "Langkah 2 · EXPLAIN",
      title: "Membaca pikiran database",
      prose: [
        "`EXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE nasabah_id = 1;` — output menunjukkan strategi: `SEARCH transaksi USING INDEX idx_...` (bagus!) vs `SCAN transaksi` (full scan — waspadai di tabel besar!). Tanda lain: `USE TEMP B-TREE` (sort sementara — wajar untuk ORDER BY/GROUP BY besar), nested loop besar (JOIN mahal — cek index di kedua sisi).",
        "Alur diagnosis standar: EXPLAIN → hipotesis → perbaiki → EXPLAIN lagi → ukur waktu. Jangan tebak-tebak index; baca rencananya! `cost=` = estimasi kerja (bukan detik!). Klaim tanpa angka = opini.",
        "Contoh: `SELECT * FROM transaksi WHERE kota = 'Jakarta'` di 2 juta baris: 40 detik, EXPLAIN menunjukkan Seq Scan (baca SEMUA 2 juta baris, buang 1,8 juta). Setelah `CREATE INDEX idx_transaksi_kota ON transaksi(kota)`: Index Scan, 0,2 detik — 200× lipat. Tapi ingat: ukur di datamu; dan index yang salah tempat = 0× (malah memperlambat write).",
      ],
      tasks: [],
      quiz: [
        {
          q: "Index paling membantu untuk?",
          options: [
            { text: "SELECT * tabel kecil", why: "Salah — tabel kecil lebih cepat full scan." },
            { text: "WHERE selektif di tabel besar", why: "Benar. Selektif + besar = seek mengalahkan scan.", correct: true },
            { text: "LIKE '%x%'", why: "Salah — wildcard kiri tak bisa pakai B-tree." },
          ],
        },
        {
          q: "EXPLAIN menunjukkan SCAN pada tabel 100 juta baris. Artinya?",
          options: [
            { text: "Normal", why: "Salah — waspadai dulu." },
            { text: "Full scan — pertimbangkan index / atau memang butuh semua", why: "Benar. Agregat penuh memang butuh scan; filter selektif tidak.", correct: true },
            { text: "Error", why: "Salah — SCAN bukan error." },
          ],
        },
      ],
      reference: "EXPLAIN dulu: SEARCH USING INDEX (bagus) vs SCAN (waspadai).",
    },
    {
      id: "aturan-5",
      eyebrow: "Langkah 3 · Lima aturan",
      title: "Optimasi praktis",
      prose: [
        "Lima aturan: (1) Sargable — kolom polos di WHERE (`WHERE tanggal >= '2026-09-01'`, bukan `strftime(...)=...`; C4). (2) Kolom eksplisit — kurangi I/O (C1: bukan `SELECT *`). (3) Filter dulu, join kemudian — kecilkan dataset sebelum JOIN/agregat mahal (CTE filter dulu). (4) Jangan tutupi masalah dengan DISTINCT (C5). (5) Agregat di database — jangan tarik 1 juta baris lalu groupby di aplikasi!",
        "Kapan berhenti optimasi? Saat “cukup cepat” untuk kebutuhan (dashboard < 3 detik, laporan batch < SLA). Optimasi prematur = buang waktu. Ukur dulu, optimasi yang terbukti lambat. Dan ingat jebakan index tak terpakai: fungsi di kolom, `LIKE '%tengah'` (wildcard kiri!), OR antar kolom beda index, implisit cast.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Optimasi = tugas DBA.” Salah — analis menulis 90% query yang berjalan; analis yang buta performa = pembuat insiden. Kamu tidak perlu jadi DBA, tapi 5 aturan ini = tanggung jawab profesional.",
      },
      quiz: [
        {
          q: "`WHERE strftime('%Y', tanggal) = '2026'` dengan index di tanggal?",
          options: [
            { text: "Index terpakai", why: "Salah." },
            { text: "Index TIDAK terpakai (tidak sargable)", why: "Benar. Fungsi di kolom mematikan index.", correct: true },
            { text: "Lebih cepat", why: "Salah — justru full scan." },
          ],
        },
        {
          q: "Composite index (kota, tanggal) membantu?",
          options: [
            { text: "WHERE tanggal saja, optimal", why: "Salah — prefix-nya kota; tanpa filter kota, index setengah mati." },
            { text: "WHERE kota = ... AND tanggal >= ... (equality dulu)", why: "Benar. Urutan penting — kolom equality yang difilter dulu.", correct: true },
            { text: "ORDER BY nama", why: "Salah — kolom tidak ada di index." },
          ],
        },
      ],
      reference: "Sargable, kolom eksplisit, filter dulu, jangan tutupi, agregat di DB.",
    },
    {
      id: "minicase-dashboard",
      eyebrow: "Langkah 4 · Mini-case",
      title: "Dashboard 40 detik",
      prose: [
        "Situasi: dashboard “transaksi hari ini per kategori” loading 40 detik. Query: `SELECT kategori, SUM(jumlah) FROM transaksi WHERE date(tanggal) = date('now') GROUP BY kategori`. Tugas: (1) diagnosis via EXPLAIN; (2) perbaiki (2 perubahan!); (3) estimasi dampak.",
        "Pembahasan: (1) `date(tanggal)` di WHERE = tidak sargable → SCAN 1 tahun data padahal butuh 1 hari! + tidak ada index tanggal. (2) `WHERE tanggal >= date('now') AND tanggal < date('now','+1 day')` (sargable); ② `CREATE INDEX idx_tgl ON transaksi(tanggal)`. (3) SCAN 365 hari → SEEK 1 hari = ~300× lebih sedikit dibaca. 40 dtk → <1 dtk.",
        "Pelajaran: 90% “query lambat” = sargable + index. Dua baris perubahan, direksi tersenyum.",
      ],
      tasks: [],
      reference: "Diagnosis: fungsi di WHERE + tanpa index. Obat: sargable + CREATE INDEX.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Performa: alat mana untuk apa",
      prose: [
        "Query lambat → EXPLAIN dulu (jangan tebak; baca rencananya). SCAN di tabel besar → index kolom filter/join (B-tree seek vs full scan). Index tak terpakai → cek sargable (fungsi di kolom?). JOIN lambat → index kedua sisi (FK ter-index; JOIN tanpa index = mahal). Sudah cukup cepat → berhenti (optimasi prematur = buang waktu; ukur vs SLA).",
        "Aturan praktis 10 detik: EXPLAIN → hipotesis → perbaiki → ukur. Index untuk pola query nyata, bukan jaga-jaga. Sargable, kolom eksplisit, filter dulu. Agregat di DB; LIMIT untuk eksplorasi.",
      ],
      tasks: [],
      reference: "EXPLAIN → hipotesis → perbaiki → ukur. Berhenti saat cukup cepat.",
    },
    {
      id: "intuisi-index",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Index adalah jawaban atas pertanyaan yang sering ditanyakan",
      prose: [
        "Index yang baik tidak lahir dari teori — ia lahir dari log query produksi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: desain index dari pola query nyata, bukan dari skema",
        body: "Kesalahan paling umum dalam indexing adalah membuatnya dari diagram skema (“kolom ini kayaknya penting”) alih-alih dari query yang benar-benar berjalan. Heuristik praktisi: buka log query lambat (atau EXPLAIN dari 5 query terberat), catat kolom yang muncul di WHERE/JOIN/ORDER BY beserta kombinasinya — ITULAH daftar belanja index-mu. Index untuk query yang tidak ada adalah beban tulis tanpa manfaat baca. Heuristik kedua: satu index composite yang tepat mengalahkan tiga index tunggal — database memakai SATU index per tabel per query (umumnya), jadi index (kota, tanggal) melayani WHERE kota = ? AND tanggal > ? jauh lebih baik daripada index kota + index tanggal yang terpisah. Dan heuristik ketiga yang pahit: index tidak memperbaiki query yang salah — ia hanya membuat query yang salah berjalan lebih cepat. Perbaiki dulu logikanya (fan-out, fungsi di kolom), baru indeks.",
      },
      reference: "Index dari log query, bukan dari skema; composite mengalahkan tunggal.",
    },
    {
      id: "composite-covering",
      eyebrow: "Langkah 7 · Composite & covering",
      title: "Urutan kolom composite dan covering index",
      prose: [
        "Aturan urutan kolom dalam composite index adalah salah satu pengetahuan paling praktis dalam SQL: kolom EQUALITY dulu, kolom RANGE terakhir. Untuk WHERE kota = 'Jakarta' AND tanggal > '2026-01-01', index (kota, tanggal) optimal — database melompat ke blok “Jakarta” (equality) lalu memindai rentang tanggal di dalamnya. Index (tanggal, kota) jauh lebih buruk untuk query ini: rentang tanggal dulu berarti separuh index dipindai sebelum kota menyaring. Prinsipnya: equality mempersempit ke satu titik, range membuka jendela — titik dulu, jendela kemudian. Bila query punya DUA kolom range (tanggal > X AND nominal > Y), hanya kolom pertama yang efektif sebagai batas index; kolom kedua menjadi filter sisa — pilih yang lebih selektif sebagai kolom pertama.",
        "Covering index adalah lompatan berikutnya: index yang memuat SEMUA kolom yang dibutuhkan query, sehingga database tidak pernah menyentuh tabel. SELECT nominal FROM trx WHERE kota = 'Jakarta' — dengan index (kota, nominal), kolom nominal sudah ada di daun index; rencananya tertulis USING COVERING INDEX. Efeknya dramatis di tabel lebar: tabel 80 kolom yang query-nya butuh 3 kolom — tanpa covering, tiap baris cocok memicu random access ke tabel (mahal); dengan covering, semua dibaca sekuensial dari index yang ramping. Harganya: index lebih besar (menyimpan salinan kolom) dan lebih mahal saat tulis. Aturan: covering untuk query baca-berat yang spesifik dan sering (dashboard, laporan rutin); jangan covering untuk “siapa tahu butuh”.",
        "Kapan composite GAGAL membantu — tiga kasus: (1) kolom pertama tidak dipakai di query — WHERE tanggal > ? atas index (kota, tanggal) tidak bisa melompat (kota tidak dibatasi) sehingga index nyaris tak berguna; solusinya index terpisah atau urutan berbeda untuk pola query itu; (2) fungsi di kolom pertama — WHERE UPPER(kota) = ? membunuh pemakaian index composite sama seperti index tunggal (sargable berlaku di sini juga); (3) kolom ber-kardinalitas sangat rendah di depan — index (status, tanggal) dengan status hanya 2 nilai jarang lebih baik dari index (tanggal) saja, kecuali query selalu memfilter status. Validasi selalu dengan EXPLAIN: cari USING INDEX dengan kondisi yang menempel (kota=? AND tanggal>?), bukan sekadar nama index.",
        "Satu teknik yang jarang diajarkan: index untuk ORDER BY. Query ... WHERE kota = 'Jakarta' ORDER BY tanggal DESC LIMIT 20 dengan index (kota, tanggal DESC) tidak perlu sort sama sekali — baris keluar dari index sudah dalam urutan yang diminta. Tanpa index itu, database mengumpulkan SEMUA baris Jakarta, mengurutkan, baru mengambil 20 — boros bila yang cocok jutaan baris. Pola “filter + order + limit” (top-N per kategori!) adalah kandidat covering index terbaik: index (kota, tanggal DESC) INCLUDE (nominal) melayani seluruh query dari index. Inilah alasan senior selalu memeriksa ORDER BY saat mendesain index, bukan hanya WHERE.",
      ],
      tasks: [],
      reference: "Equality dulu, range terakhir; covering = semua kolom dibutuhkan ada di index; index juga untuk ORDER BY.",
    },
    {
      id: "partial-expression",
      eyebrow: "Langkah 8 · Partial & expression",
      title: "Partial index, expression index, dan kapan TIDAK membuat index",
      prose: [
        "Partial index — index hanya atas SEBAGIAN baris: CREATE INDEX idx_macat ON kredit (dpd) WHERE status = 'macet'. Bila 95% query menyaring status = 'macet', index ini 20× lebih kecil dari index penuh, lebih cepat ditulis, dan optimizer memakainya otomatis bila WHERE-nya cocok. Syaratnya: kondisi WHERE di query harus MENGIMPLIKASIKAN kondisi partial index — query dengan WHERE status = 'macet' AND dpd > 30 memakainya; query tanpa filter status tidak. Ini senjata presisi untuk tabel dengan “hot subset” (data aktif vs arsip, macet vs lancar) — dan alasan kuat untuk tidak mengarsip dengan DELETE fisik bila partial index bisa memisahkan.",
        "Expression index — index atas HASIL FUNGSI: CREATE INDEX idx ON nasabah (UPPER(nama)). Inilah jawaban resmi untuk “fungsi di kolom membunuh index”: bila query-mu memang selalu WHERE UPPER(nama) = ?, buat index atas ekspresi yang sama persis — maka ia sargable kembali. Aturan ketatnya: ekspresi di query harus SAMA PERSIS (karakter per karakter, termasuk spasi) dengan ekspresi di index — UPPER(nama) vs upper(nama) bisa gagal cocok di sebagian database. Pakai hemat: tiap expression index adalah beban tulis untuk SATU pola query; bila polanya bisa ditulis ulang tanpa fungsi (normalisasi data di hulu!), normalisasi hampir selalu menang.",
        "Kapan TIDAK membuat index — disiplin yang sama pentingnya: (1) tabel kecil (< 10 ribu baris) — full scan lebih murah, index hanya beban tulis; (2) kolom yang ditulis jauh lebih sering daripada dibaca (counter, log mentah) — tiap INSERT membayar semua index; (3) kolom ber-kardinalitas sangat rendah TANPA filter selektif (jenis_kelamin saja) — index tidak menyaring apa-apa; (4) “untuk jaga-jaga” — index yang tidak dipakai query nyata adalah utang. Cara mengetahuinya: pg_stat_user_indexes (Postgres) / sqlite_stat1 — index dengan idx_scan = 0 selama berminggu-minggu adalah kandidat DROP. Audit index tahunan menghapus lebih banyak masalah daripada menambah index baru.",
        "Menutup dengan biaya tulis yang konkret: tiap index menambah ~1 operasi tulis per INSERT/UPDATE/DELETE pada tabel itu (plus ukuran). Tabel transaksi dengan 8 index berarti 1 INSERT = 9 penulisan struktur. Untuk tabel OLTP tulis-berat (trading, event stream), ini alasan arsitektural memisahkan: tabel operasional ramping (sedikit index, tulis cepat) + replica/mart analitik ber-index lengkap (baca cepat). Index bukan gratis — ia dibayar di setiap tulis. Desain yang matang menempatkan tagihannya di tempat yang tepat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Index (a, b, c) juga melayani query yang filter b dan c saja.” Tidak — tanpa batasan pada a (kolom pertama), database tidak bisa melompat ke rentang index; ia hanya bisa skip-scan (itu pun tidak semua database mendukung, dan mahal). Butuh pola (b, c)? Buat index (b, c) sendiri, atau pastikan selalu ada filter pada a.",
      },
      reference: "Partial untuk hot subset; expression untuk fungsi yang tak terhindarkan; audit idx_scan = 0 → DROP.",
    },
    {
      id: "lab-index",
      eyebrow: "Langkah 9 · Lab index",
      title: "Lab: buat index, baca perbedaannya di plan",
      prose: [
        "Tabel trx sudah dimuat: 5.000 baris transaksi 10 kota. Query target: SELECT nominal FROM trx WHERE kota = 'Jakarta' AND nominal > 5000000. Tugasmu: buat SATU composite index yang membuat query ini memakai index — lalu lihat sendiri plan-nya berubah dari SCAN menjadi SEARCH. Perhatikan juga kata COVERING pada plan sesudah: kenapa ia muncul?",
        "Coba: setelah lolos, buat index kedua dengan urutan kolom TERBALIK (nominal, kota) di database baru (jalankan ulang dari awal tanpa index pertama) — apakah plan-nya masih memakai index untuk query ini? Mengapa urutan penting di sini?",
        "Satu kategori index yang paling sering TERLUPA: index pada FOREIGN KEY di sisi banyak (many-side). JOIN transaksi ke nasabah atas nasabah_id tanpa index di transaksi(nasabah_id) memaksa nested-loop tanpa pendorong — dan lebih buruk lagi, DELETE/UPDATE pada tabel nasabah memicu full scan transaksi untuk cek referential integrity (di Postgres, ini mengunci lama). Aturan: setiap FK yang dipakai di JOIN atau menjadi target DELETE/UPDATE parent WAJIB punya index — ini bukan optimasi, melainkan prasyarat agar constraint tidak menjadi bottleneck tulis. Audit FK tanpa index adalah 5 menit kerja dengan hasil yang sering dramatis.",
      ],
      tasks: [
        { id: "t1", text: "Tulis statement di variabel `sql`: CREATE INDEX atas (kota, nominal) — urutan equality dulu" },
        { id: "t2", text: "Jalankan dan pastikan plan SESUDAH memakai index (ada kata USING INDEX) dan definisinya (kota, nominal)" },
      ],
      expected: "== SEBELUM (tanpa index) ==\nSCAN trx\n== SESUDAH (dengan index) ==\nSEARCH trx USING COVERING INDEX ...\nindex: CREATE INDEX ... ON trx(kota, nominal)",
      note: {
        title: "Sering salah",
        body: "Urutan (nominal, kota) juga “memakai index” kadang-kadang — tetapi tidak seefektif (kota, nominal): equality di depan memungkinkan lompatan presisi, range di depan memaksa pemindaian lebar. Plan boleh sama-sama SEARCH, biayanya belum tentu sama.",
      },
      hints: [
        "Sintaks: CREATE INDEX nama_index ON trx(kota, nominal).",
        "Nama index bebas, mis. idx_kota_nominal — yang dinilai adalah kolom dan urutannya.",
        "Perhatikan kata COVERING pada plan sesudah: kolom nominal ikut tersimpan di index sehingga tabel tidak disentuh.",
      ],
      code: {
        starter: SETUP_IDX + TAIL_IDX,
        lockLines: 17,
        solution:
          SETUP_IDX +
          `
# TULIS statement CREATE INDEX-mu sebagai string sql, lalu jalankan.
sql = """CREATE INDEX idx_kota_nominal ON trx(kota, nominal)"""
cur.execute(sql)
db.commit()
print("== SESUDAH (dengan index) ==")
for p in cur.execute("EXPLAIN QUERY PLAN " + Q).fetchall():
    print(p[3])
print("== definisi index ==")
for r in cur.execute("SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='trx' AND sql IS NOT NULL").fetchall():
    print(r[0])`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis statement CREATE INDEX sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "CREATE INDEX", label: "Statement CREATE INDEX", msg: "Variabel sql harus berisi statement CREATE INDEX." },
          { kind: "stdout_matches", task: "t2", pattern: "SCAN trx", label: "Plan SEBELUM = SCAN", msg: "Sebelum index dibuat, rencananya harus SCAN (baca seluruh tabel)." },
          { kind: "stdout_matches", task: "t2", pattern: "USING (COVERING )?INDEX", label: "Plan SESUDAH memakai index", msg: "Sesudah CREATE INDEX, rencananya harus SEARCH ... USING INDEX." },
          { kind: "stdout_matches", task: "t2", pattern: "\\(kota, nominal\\)", label: "Urutan kolom (kota, nominal)", msg: "Composite index harus berurutan (kota, nominal) — equality dulu, range kemudian." },
        ],
      },
      reference: "EXPLAIN sebelum vs sesudah = bukti; equality dulu, range terakhir; COVERING = tabel tak disentuh.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "Index (B-tree) = daftar isi; untuk WHERE selektif/JOIN/ORDER BY.",
        "EXPLAIN: SCAN vs SEARCH — diagnosis sebelum tebak.",
        "5 aturan: sargable, kolom eksplisit, filter dulu, jangan tutupi, agregat di DB.",
        "Jangan: index jaga-jaga; fungsi di kolom; optimasi prematur.",
        "Index = investasi: bayar di tulis, panen di baca.",
      ],
      next: { label: "C18 — Transaksi & ACID", href: "/v2/learn/c18-transaksi-acid" },
      quiz: [
        {
          q: "Terlalu banyak index berakibat?",
          options: [
            { text: "Selalu lebih cepat", why: "Salah." },
            { text: "Write lambat + storage + planner bingung", why: "Benar. Index ada biayanya — untuk pola query nyata saja.", correct: true },
            { text: "Tidak ada efek", why: "Salah — efeknya nyata di write." },
          ],
        },
        {
          q: "EXPLAIN menunjukkan Nested Loop + Seq Scan: tabel kecil (100 baris) di-join ke tabel besar. Masalah?",
          options: [
            { text: "Ya, harus diperbaiki", why: "Salah — jangan perbaiki yang sudah optimal." },
            { text: "Bukan masalah — Seq Scan di 100 baris murah, optimizer memilih dengan benar", why: "Benar. Baca cost & actual time dulu.", correct: true },
            { text: "Selalu tambah index", why: "Salah — index untuk pola query nyata, bukan refleks." },
          ],
        },
        {
          q: "Tulis index untuk: `WHERE status = 'macet' AND dpd > 90 ORDER BY baki_debet DESC`",
          options: [
            { text: "CREATE INDEX i ON kredit(baki_debet)", why: "Salah — kolom filter (status) harus di depan." },
            { text: "CREATE INDEX i ON kredit(status, baki_debet DESC) WHERE dpd > 90", why: "Benar. Equality dulu (status), lalu kolom ORDER; bonus: partial index (WHERE dpd > 90) — kecil & fokus!", correct: true },
            { text: "CREATE INDEX i ON kredit(dpd, status)", why: "Kurang tepat — tidak membantu ORDER BY baki_debet." },
          ],
        },
        {
          q: "Mengapa “index semua kolom” ide buruk? (2 harga)",
          options: [
            { text: "Tidak ada harga", why: "Salah." },
            { text: "Write melambat + ruang & maintenance", why: "Benar. Tiap INSERT/UPDATE harus update semua index; index = duplikat data yang harus di-vacuum.", correct: true },
            { text: "Query jadi error", why: "Salah — tidak error, hanya mahal." },
          ],
        },
        {
          q: "Kapan berhenti mengoptimasi?",
          options: [
            { text: "Tidak pernah — selalu optimasi", why: "Salah — optimasi prematur = buang waktu." },
            { text: "Saat cukup cepat untuk kebutuhan (ukur vs SLA)", why: "Benar. Ukur dulu, optimasi yang terbukti lambat.", correct: true },
            { text: "Setelah 1 index", why: "Salah — patokannya kebutuhan, bukan jumlah index." },
          ],
        },
      ],
    },
  ],
};

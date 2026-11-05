import type { V2Lesson } from "../lib/types";

export const dm3a: V2Lesson = {
  slug: "dm3a-database-relasional",
  track: "Data Management",
  module: "Penyimpanan",
  title: "Database Relasional & ACID: Penjaga Uang yang Tidak Pernah Tidur",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-transfer",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Rp1 juta yang menguap",
      prose: [
        "Bayangkan kode transfer bank ditulis naif: (1) kurangi saldo A Rp1 juta, (2) tambah saldo B Rp1 juta. Suatu malam, persis setelah langkah 1, server mati lampu. Langkah 2 tidak pernah jalan. Hasil: saldo A berkurang, saldo B tidak bertambah — Rp1 juta menguap dari sistem. Tidak ada yang mencuri; sistemnya saja tidak atomik.",
        "Bug seperti ini tidak bisa ditemukan dengan testing biasa — ia hanya muncul saat kegagalan terjadi di jeda antar-langkah, yang mungkin sekali setahun. Solusinya bukan \"kode lebih hati-hati\", melainkan transaksi ACID: database menjamin langkah 1+2 terjadi semua atau tidak sama sekali, bahkan jika listrik padam di tengah.",
        "Ada disiplin yang lahir khusus untuk bug kelas ini: chaos engineering untuk database — sengaja mematikan node di tengah transaksi, memutuskan jaringan antar replika, memenuhi disk saat checkpoint — lalu verifikasi tidak ada uang yang menguap dan tidak ada transaksi setengah jadi. Framework seperti Jepsen menguji klaim ACID database dengan cara ini, dan beberapa database populer pernah ketahuan klaimnya tidak sesuai. Pelajaran praktisnya: untuk sistem yang menangani uang, jangan percaya brosur — uji sendiri dengan skenario kegagalan, atau pilih database yang sudah diuji pihak ketiga. Jaminan yang tidak pernah diuji adalah harapan.",
        "Ekonomi bug seperti ini brutal: ia lolos semua testing (karena testing tidak mematikan listrik di tengah transfer), lolos code review (kodenya terlihat benar), lalu merugikan Rp1 juta tepat saat paling tidak diharapkan — malam hari, tanpa saksi, tanpa jejak siapa yang salah. Dan Rp1 juta itu hanya satu kejadian; di sistem dengan 1 juta transfer per hari, kegagalan sekali setahun per pola berarti ratusan juta rupiah hilang tanpa bisa dijelaskan ke auditor. ACID memindahkan masalah dari disiplin manusia (yang pasti gagal sesekali) ke jaminan mesin (yang diuji jutaan kali sehari di seluruh dunia). Itulah kenapa bank membayar mahal untuk database relasional: bukan untuk fitur, melainkan untuk jaminan.",
      ],
      tasks: [],
      reference: "Transaksi = sekumpulan operasi yang diperlakukan sebagai satu unit tak terpisahkan.",
    },
    {
      id: "model-relasional",
      eyebrow: "Langkah 2 · Model relasional",
      title: "Si akuntan tua yang teliti",
      prose: [
        "Model relasional (E.F. Codd, 1970) menyimpan data sebagai tabel: baris = fakta, kolom = atribut. Tiga pilar integritasnya: primary key (identitas unik tiap baris, tidak boleh kembar atau kosong), foreign key (rujukan ke tabel lain — tidak ada transaksi \"yatim\" milik nasabah yang tidak ada), dan constraint (aturan bisnis di level database: CHECK saldo >= 0, UNIQUE(email), NOT NULL).",
        "Database menolak data yang melanggar aturan, bukan sekadar berharap aplikasi benar. Inilah alasan database relasional masih menjadi jantung setiap bank, 50 tahun setelah ditemukan.",
        "Pendalaman constraint: ON DELETE RESTRICT versus CASCADE. Menghapus nasabah yang masih punya rekening: RESTRICT menolak (aman, default yang tepat untuk data finansial); CASCADE menghapus semua rekeningnya (berbahaya kalau salah tabel — satu DELETE bisa menghapus ribuan baris anak tanpa peringatan). Untuk bank, hampir selalu RESTRICT plus soft delete (kolom status_nonaktif) — data historis tidak pernah benar-benar hilang. Satu lagi: constraint CHECK (saldo >= 0) di Postgres tidak bisa di-bypass aplikasi mana pun — bahkan DBA yang update manual pun ditolak. Inilah bedanya aturan di database versus aturan di aplikasi: yang pertama berlaku untuk semua jalur tulis, termasuk jalur yang belum kamu pikirkan — script migrasi, akses darurat, tool internal yang ditulis intern magang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Validasi hanya di aplikasi. Aplikasi bisa di-bypass, bisa punya bug, bisa ada dua aplikasi menulis ke tabel yang sama. Aturan yang benar-benar harus selalu berlaku (saldo tidak minus, email unik) wajib jadi constraint di database.",
        type: "pitfall",
      },
      reference: "Constraint di database = aturan yang tidak bisa dilanggar siapa pun.",
    },
    {
      id: "acid-lab",
      eyebrow: "Langkah 3 · ACID · lab",
      title: "Empat sumpah transaksi",
      prose: [
        "ACID: Atomicity (semua berhasil, atau semua batal — rollback; tidak ada \"setengah transfer\"), Consistency (transaksi membawa database dari satu kondisi valid ke kondisi valid lain), Isolation (transaksi berjalan bersamaan seolah sendirian — tidak saling mengintip pekerjaan yang belum selesai), Durability (setelah COMMIT, data selamat walau listrik padam sedetik kemudian, berkat write-ahead log).",
        "Coba sendiri: rekening A Rp5.000.000 transfer Rp1.000.000 ke rekening B Rp2.000.000. Crash terjadi tepat setelah debit. Tanpa transaksi, Rp1 juta menguap. Dengan rollback, total sistem tetap Rp7.000.000.",
        "Pendalaman durability: bagaimana data bisa selamat padahal listrik padam? Jawabannya write-ahead log (WAL): sebelum mengubah data, database menulis dulu niat perubahannya ke log sequential di disk — murah dan cepat karena sequential. COMMIT berarti log-nya sudah aman di disk. Saat crash, database memutar ulang log ketika startup: yang sudah commit di-redo, yang belum di-undo. Inilah kenapa COMMIT terasa instan walau data belum benar-benar tersebar ke semua file tabel — yang dijamin adalah log-nya. Konsekuensi praktis: untuk sistem kritis jangan letakkan WAL di disk yang sama dengan data (disk mati berarti log ikut mati), dan checkpoint yang jarang berarti recovery yang lama — ada trade-off antara performa runtime dan kecepatan bangkit setelah crash.",
        "Satu alat yang jarang diajarkan: SAVEPOINT. Transaksi besar dengan 10 langkah bisa menandai titik aman di tengah (SAVEPOINT s1), dan kalau langkah ke-8 gagal, cukup ROLLBACK TO s1 — 7 langkah pertama selamat, hanya langkah 8 yang diulang. Tanpa savepoint, pilihannya hanya commit semua atau batal semua. Praktiknya: batching 10.000 insert dengan savepoint tiap 1.000 — satu batch gagal tidak menghanguskan 9.000 yang sudah benar. Atomicity tidak berarti kaku; ia berarti kamu yang menentukan batas unitnya.",
      ],
      tasks: [
        { id: "t1", text: "Bungkus dua UPDATE dalam try, panggil `con.rollback()` saat crash" },
        { id: "t2", text: "Hitung `total` = SUM(saldo) setelah rollback" },
        { id: "t3", text: "Cetak total dengan `print`" },
      ],
      expected: "total=7000000",
      hints: [
        "Debit A dan kredit B sudah ditulis; kamu hanya perlu menangani crash-nya.",
        "Di blok except RuntimeError, panggil con.rollback().",
        "total = cur.execute(\"SELECT SUM(saldo) FROM rekening\").fetchone()[0]",
      ],
      code: {
        starter: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE rekening (id TEXT PRIMARY KEY, saldo INTEGER CHECK (saldo >= 0))")\ncur.executemany("INSERT INTO rekening VALUES (?, ?)", [("A", 5000000), ("B", 2000000)])\ncon.commit()  # saldo awal tersimpan permanen\n\ndef crash():\n    raise RuntimeError("server mati!")\n\n# TULIS KODEMU: transfer Rp1.000.000 A -> B; rollback jika crash\ntry:\n    cur.execute("UPDATE rekening SET saldo = saldo - 1000000 WHERE id = 'A'")\n    crash()  # server mati tepat setelah debit\n    cur.execute("UPDATE rekening SET saldo = saldo + 1000000 WHERE id = 'B'")\n    con.commit()\nexcept RuntimeError:\n    \n\ntotal = \nprint(f"total={total}")`,
        lockLines: 14,
        solution: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE rekening (id TEXT PRIMARY KEY, saldo INTEGER CHECK (saldo >= 0))")\ncur.executemany("INSERT INTO rekening VALUES (?, ?)", [("A", 5000000), ("B", 2000000)])\ncon.commit()  # saldo awal tersimpan permanen\n\ndef crash():\n    raise RuntimeError("server mati!")\n\n# TULIS KODEMU: transfer Rp1.000.000 A -> B; rollback jika crash\ntry:\n    cur.execute("UPDATE rekening SET saldo = saldo - 1000000 WHERE id = 'A'")\n    crash()  # server mati tepat setelah debit\n    cur.execute("UPDATE rekening SET saldo = saldo + 1000000 WHERE id = 'B'")\n    con.commit()\nexcept RuntimeError:\n    con.rollback()\n\ntotal = cur.execute("SELECT SUM(saldo) FROM rekening").fetchone()[0]\nprint(f"total={total}")`,
        checks: [
          { kind: "defined", task: "t1", name: "total", label: "`total` terdefinisi", msg: "Buat variabel total di bagian kode yang bisa diedit." },
          { kind: "equal", task: "t2", name: "total", value: 7000000, tol: 0, label: "`total` seharusnya 7.000.000", msg: "Rollback harus mengembalikan debit A. Total sistem tetap 5jt + 2jt." },
          { kind: "stdout_matches", task: "t3", pattern: "total=7000000", label: "`print` menampilkan total", msg: "Cetak dengan format total=... ." },
        ],
      },
      reference: "A = semua atau batal; C = selalu valid; I = tidak saling intip; D = selamat dari crash.",
    },
    {
      id: "isolasi",
      eyebrow: "Langkah 4 · Level isolasi",
      title: "Seberapa paranoid kamu?",
      prose: [
        "Isolasi sempurna (serializable) itu mahal — database harus mengunci banyak hal. Maka SQL menyediakan spektrum keamanan vs kecepatan. Read Committed: hanya baca data yang sudah di-commit; cepat, tapi bisa non-repeatable read (baca 2 kali hasil beda) dan phantom read (baris baru muncul di tengah).",
        "Repeatable Read: snapshot konsisten selama transaksi. Serializable: seolah transaksi berjalan satu-per-satu — tidak ada anomali, paling lambat, bisa deadlock.",
        "Default Postgres = Read Committed, cukup untuk kebanyakan aplikasi. Naikkan ke Serializable hanya untuk operasi kritis (transfer, alokasi stok terbatas). Untuk pola \"cek lalu update\" konkuren, pakai lock eksplisit (SELECT ... FOR UPDATE) — cek di aplikasi tidak cukup karena jeda antara cek dan tulis selalu bisa disela transaksi lain.",
        "Mode kegagalan nyata: deadlock. Transfer A ke B sebesar Rp1 juta dan transfer B ke A sebesar Rp500 ribu berjalan bersamaan. Transaksi 1 mengunci baris A, transaksi 2 mengunci baris B; lalu transaksi 1 menunggu kunci B dan transaksi 2 menunggu kunci A — keduanya menunggu selamanya. Database mendeteksi siklus ini dan mengorbankan salah satu transaksi (deadlock victim) agar yang lain jalan. Di dompet digital Indonesia dengan 50 ribu transfer per menit, deadlock puluhan kali sehari adalah normal — bukan bug, melainkan sesuatu yang harus ditangani: retry dengan backoff di aplikasi, bukan panik.",
        "Pencegahannya: kunci baris dalam urutan yang sama, selalu — urutkan id rekening sebelum update sehingga kedua transaksi mengunci A dulu baru B — atau perkecil jendela kunci: commit cepat, jangan buka transaksi lalu panggil API eksternal di tengahnya. Aturan praktisnya: transaksi yang memegang kunci tidak boleh menunggu hal yang tidak pasti (API, input user). Kunci sebentar, lepas cepat. Dan catat: retry tanpa backoff atas deadlock yang disebabkan urutan kunci yang salah hanya mengulang tabrakan — perbaiki urutannya, jangan cuma mengulang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\"Cek dulu di aplikasi, baru tulis\" dianggap cukup untuk mencegah duplikat. Di skala ribuan request per detik, dua request bisa sama-sama membaca \"tersedia\" sebelum salah satunya menulis. Kunci harus di database, bukan di aplikasi.",
        type: "pitfall",
      },
      reference: "Isolasi = menu harga, bukan peringkat kualitas. Bayar mahal hanya untuk operasi kritis.",
    },
    {
      id: "index-lab",
      eyebrow: "Langkah 5 · Index · lab",
      title: "Daftar isi buku setebal 1 juta halaman",
      prose: [
        "Index = struktur data tambahan (umumnya B-tree) yang memetakan nilai kolom ke lokasi baris, seperti daftar isi buku. Matematikanya: full scan memeriksa n baris — O(n); B-tree menemukan dalam O(log n) langkah. Untuk 1 juta baris: 1 juta pemeriksaan vs sekitar 20 langkah.",
        "Harganya: tiap INSERT/UPDATE/DELETE harus meng-update index juga, plus makan storage. Tabel yang ditulis ribuan kali per detik dengan 10 index = bunuh diri performa. Aturan: index untuk kolom yang sering di-WHERE/JOIN/ORDER BY pada tabel yang lebih sering dibaca daripada ditulis. EXPLAIN QUERY PLAN adalah cara memverifikasi, bukan menebak.",
        "Dua pendalaman: composite index dan covering index. Composite index atas (kota, tanggal) mempercepat WHERE kota = X AND tanggal > Y — tetapi hanya jika kolom pertama dipakai (urutan penting: index (kota, tanggal) tidak membantu filter tanggal saja). Covering index: kalau semua kolom yang di-SELECT ada di index, database tidak perlu menyentuh tabel sama sekali (index-only scan) — query 10 kali lebih cepat untuk laporan sempit. Aturannya: desain composite index dari pola WHERE yang sebenarnya (cek query log seminggu), kolom paling selektif dan paling sering difilter di depan.",
      ],
      tasks: [
        { id: "t1", text: "Buat index pada kolom `kota`" },
        { id: "t2", text: "Jalankan EXPLAIN QUERY PLAN untuk filter kota='Jakarta'" },
        { id: "t3", text: "Simpan hasil plan ke variabel `plan` dan cetak" },
      ],
      expected: "plan memakai SEARCH (index), bukan SCAN",
      hints: [
        "CREATE INDEX idx_kota ON nasabah(kota)",
        "EXPLAIN QUERY PLAN SELECT * FROM nasabah WHERE kota='Jakarta'",
        "plan = cur.execute(...).fetchall(); print(plan)",
      ],
      code: {
        starter: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE nasabah (id INTEGER PRIMARY KEY, kota TEXT)")\ncur.executemany("INSERT INTO nasabah (kota) VALUES (?)",\n                [("Jakarta",)] * 5000 + [("Bandung",)] * 5000 + [("Surabaya",)] * 5000)\n\n# TULIS KODEMU\n\n\n\nprint(plan)`,
        lockLines: 6,
        solution: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE nasabah (id INTEGER PRIMARY KEY, kota TEXT)")\ncur.executemany("INSERT INTO nasabah (kota) VALUES (?)",\n                [("Jakarta",)] * 5000 + [("Bandung",)] * 5000 + [("Surabaya",)] * 5000)\n\n# TULIS KODEMU\ncur.execute("CREATE INDEX idx_kota ON nasabah(kota)")\nplan = cur.execute("EXPLAIN QUERY PLAN SELECT * FROM nasabah WHERE kota='Jakarta'").fetchall()\n\nprint(plan)`,
        checks: [
          { kind: "defined", task: "t3", name: "plan", label: "`plan` terdefinisi", msg: "Simpan hasil EXPLAIN QUERY PLAN ke variabel plan." },
          { kind: "contains", task: "t1", name: "plan", value: "SEARCH", label: "plan memakai index (SEARCH)", msg: "Tanpa index, plan tertulis SCAN. Buat index dulu dengan CREATE INDEX." },
          { kind: "stdout_matches", task: "t3", pattern: "SEARCH", label: "`print` menampilkan plan", msg: "Cetak variabel plan agar terlihat isi rencananya." },
        ],
      },
      note: {
        title: "Intuisi: index adalah pinjaman berbunga",
        body: "Cara berpikir yang benar tentang index: ia pinjaman — kamu meminjam kecepatan baca dan membayar bunganya setiap ada tulis. Heuristiknya: index kolom yang menyaring (WHERE, JOIN, ORDER BY), bukan kolom yang berubah-ubah (kolom status yang di-update tiap menit berarti index-nya ditulis ulang tiap menit). Balik urutan pertanyaannya: jangan tanya kolom apa yang butuh index, tanya query apa yang paling sering dan paling lambat — lalu buat index untuk query itu dan verifikasi dengan EXPLAIN. Satu index yang tidak pernah dipakai query mana pun adalah pajak tanpa manfaat: hapus saja. Dan ingat batasnya: index tidak memperbaiki query yang salah bentuk — SELECT bintang dengan 50 kolom tetap memindahkan 50 kolom; index hanya mempercepat pencarian barisnya, bukan mengecilkan yang dibawa pulang.",
      },
      reference: "SCAN = baca semua baris; SEARCH ... USING INDEX = pakai daftar isi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Kapan relasional + ACID wajib",
      prose: [
        "Uang, stok, atau tiket berpindah tangan → relasional + transaksi ACID. Operasi multi-langkah yang harus atomik; salah sedikit = rugi nyata. Tidak ada teknologi yang menggantikan jaminan \"semua atau batal\" untuk uang.",
        "Query filter jutaan baris lambat → EXPLAIN dulu, baru index. Ingat pajak tulisnya. Dua user update saldo bersamaan dan saldo tidak boleh minus → naikkan isolasi atau pakai SELECT FOR UPDATE.",
        "Laporan agregat jutaan baris tiap pagi → jangan di OLTP, pindah ke warehouse (DM4). Index tidak menyelamatkan agregat masif; pola OLAP butuh rumah sendiri.",
        "Satu budaya kerja yang membedakan tim database yang sehat: EXPLAIN dulu sebelum menuduh. Query lambat bukan vonis untuk nambah index atau nambah mesin — ia undangan untuk membaca rencana eksekusi. Tim yang sehat punya kebiasaan: setiap query yang menyentuh tabel di atas 1 juta baris wajib ditempeli hasil EXPLAIN di pull request. Lima menit membaca rencana menghemat lima jam debat kusir tentang kenapa dashboard lambat — dan mencegah index-index liar yang lahir dari tebakan.",
        "Kapan tidak relasional — kejujuran yang perlu: data time-series sensor (jutaan titik per detik, jarang di-update, query selalu rentang waktu) lebih cocok di database time-series; cache session dan leaderboard real-time di in-memory store; pencarian teks fuzzy di search engine. Relasional bisa dipaksa untuk semuanya, tetapi arsitek yang baik memilih senjata dari bentuk bebannya. Aturannya: uang dan stok yang berpindah tangan wajib relasional + ACID; sisanya boleh dipertimbangkan ulang — dengan catatan keputusan dan alasannya ditulis, bukan asal ikut tren.",
      ],
      tasks: [],
      reference: "Ada uang/stok? → transaksi ACID, tidak bisa ditawar. Query lambat? → EXPLAIN dulu.",
    },
    {
      id: "minicase-tiket",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Tiket konser yang terjual 2 kali",
      prose: [
        "Platform tiket menjual 1.000 kursi konser. Saat war tiket, 2 pembeli mengklik kursi A12 bersamaan. Kode: cek \"apakah kursi tersedia?\" → jika ya, tandai terjual. Kedua request membaca \"tersedia\" sebelum salah satunya menulis. Hasil: kursi A12 terjual 2 kali, 1 pembeli kecewa, viral di media sosial.",
        "Ini kegagalan Isolation — race condition klasik check-then-act. Dua transaksi saling mengintip state yang belum final. Perbaikan minimal: SELECT ... FOR UPDATE (kunci baris saat dibaca) atau constraint UNIQUE(kursi_id) + tangani error duplikat. Kunci harus di database, bukan aplikasi.",
        "Satu lapis pertahanan yang lebih murah: idempotency key. Setiap klik beli membawa kunci unik (mis. UUID per klik); tabel pemesanan punya UNIQUE(idempotency_key). Klik ganda karena user menekan tombol dua kali — atau retry jaringan yang mengirim request dua kali — menghasilkan satu baris, bukan dua. Pola ini menyelesaikan dua masalah sekaligus: double-click user dan retry otomatis. Biayanya satu kolom dan satu index; manfaatnya menghilangkan seluruh kategori bug duplikasi. Untuk setiap endpoint tulis yang bisa di-retry, idempotency key bukan opsional — ia standar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Double-booking bukan cuma soal tiket konser. Pola check-then-act yang sama bisa menggandakan pencairan kredit, pembayaran klaim, atau alokasi limit. Setiap operasi \"cek lalu tulis\" atas resource terbatas wajib dikunci di level database.",
      },
      reference: "Jeda antara cek dan tulis selalu ada — di skala besar, tabrakan pasti terjadi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah."],
      tasks: [],
      summary: [
        "Relasional: tabel + primary/foreign key + constraint — standar untuk data yang tidak boleh salah (uang, stok).",
        "ACID: Atomicity (semua/batal), Consistency (selalu valid), Isolation (tidak saling intip), Durability (selamat dari crash).",
        "Isolasi: spektrum Read Committed → Serializable; default cukup, naikkan hanya untuk operasi kritis.",
        "Index: O(n) → O(log n) untuk baca; pajak untuk tulis. EXPLAIN dulu sebelum menuduh.",
        "Jangan: campur OLAP berat di OLTP; index semua kolom; andalkan cek-di-aplikasi untuk konkruensi.",
      ],
      next: { label: "DM3B — Database NoSQL", href: "/learn/dm3b-database-nosql" },
      quiz: [
        {
          q: "Server mati setelah debit tapi sebelum kredit. Properti ACID apa yang mencegah uang menguap?",
          options: [
            { text: "Consistency — karena constraint saldo >= 0", why: "Constraint menjaga validitas akhir, bukan membatalkan operasi yang setengah jalan." },
            { text: "Atomicity — transaksi dibatalkan total (rollback), seolah tidak pernah terjadi", why: "Semua-atau-tidak-sama-sekali: rollback mengembalikan debit yang sudah jalan.", correct: true },
            { text: "Isolation — karena transaksi lain tidak mengganggu", why: "Isolation soal transaksi bersamaan, bukan soal crash di tengah." },
            { text: "Durability — karena data tersimpan permanen", why: "Durability soal data selamat setelah COMMIT, bukan soal membatalkan yang gagal." },
          ],
        },
        {
          q: "Query filter 1 juta baris tanpa index vs dengan B-tree index. Perbedaan kompleksitasnya?",
          options: [
            { text: "Sama saja, O(n)", why: "Itu yang terjadi tanpa index." },
            { text: "O(n) vs O(log n) — 1 juta pemeriksaan vs sekitar 20 langkah", why: "B-tree memangkas pencarian jadi logaritmik.", correct: true },
            { text: "O(n²) vs O(n)", why: "Filter satu kolom tidak pernah kuadratik." },
            { text: "Index tidak mengubah kompleksitas", why: "Index mengubah cara mesin menemukan baris: dari scan linear ke pencarian logaritmik." },
          ],
        },
        {
          q: "Kapan kamu tidak boleh menambah index ke sebuah kolom?",
          options: [
            { text: "Kolom sering di-WHERE pada tabel yang jarang ditulis", why: "Ini justru kasus ideal untuk index: banyak baca, sedikit tulis." },
            { text: "Tabel OLTP yang di-INSERT/UPDATE ribuan kali per detik — tiap index adalah pajak tulis", why: "Index memperlambat tulis; pada tabel tulis-berat tiap index menurunkan throughput.", correct: true },
            { text: "Kolom primary key", why: "Primary key otomatis punya index; bukan larangan." },
            { text: "Tidak pernah ada larangan", why: "Ada: tabel tulis-berat dengan banyak index = bunuh diri performa." },
          ],
        },
        {
          q: "Dua pembeli bersamaan membeli kursi terakhir — keduanya lolos \"cek ketersediaan\". Ini kegagalan…",
          options: [
            { text: "Atomicity", why: "Masing-masing transaksi atomic; masalahnya tabrakan antar transaksi." },
            { text: "Durability", why: "Data yang ter-commit tetap tersimpan; masalahnya bukan crash." },
            { text: "Isolation — race condition check-then-act", why: "Dua transaksi saling mengintip state yang belum final.", correct: true },
            { text: "Consistency", why: "Constraint tidak dilanggar; yang gagal adalah isolasi antar transaksi." },
          ],
        },
        {
          q: "Operasi apa yang paling tepat memakai level isolasi Serializable?",
          options: [
            { text: "Menampilkan daftar produk di katalog", why: "Bacaan biasa cukup dengan Read Committed." },
            { text: "Transfer uang antar rekening — operasi kritis multi-langkah", why: "Serializable untuk operasi kritis saja.", correct: true },
            { text: "Menghitung total pengunjung kemarin untuk dashboard", why: "Agregat dashboard tidak butuh isolasi maksimal." },
            { text: "Semua query, biar aman", why: "Memakainya untuk semua query membunuh throughput tanpa alasan." },
          ],
        },
      ],
    },
  ],
};

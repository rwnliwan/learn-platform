import type { V2Lesson } from "../lib/types";

const LAB_SETUP = `import sqlite3, os
DB = "/tmp/c18_acid_lab.db"
# mulai bersih: hapus file DB sisa percobaan sebelumnya
for suffix in ("", "-journal", "-wal"):
    p = DB + suffix
    if os.path.exists(p):
        os.remove(p)
con = sqlite3.connect(DB, timeout=2)   # koneksi utama (transaksi A)
cur = con.cursor()
cur.execute("CREATE TABLE saldo (id INTEGER PRIMARY KEY, nama TEXT, jumlah INTEGER)")
cur.executemany("INSERT INTO saldo VALUES (?,?,?)",
                [(1, 'Andi', 1000), (2, 'Budi', 500)])
con.commit()
print("saldo awal:", cur.execute("SELECT SUM(jumlah) FROM saldo").fetchone()[0])`;

const LAB_TAIL = `
# ===== TULIS KODE-MU DI BAWAH (14 baris di atas terkunci) =====
# t1 — ATOMICITY: buka transaksi (con.execute("BEGIN")), tambah 3 baris
#      (id 3,4,5), lalu con.rollback(). Simpan total akhir ke variabel
#      total_setelah_rollback dan print.
# t2 — LOCKING: con.execute("BEGIN IMMEDIATE") lalu INSERT id=6
#      TANPA commit. Buka koneksi B baru: sqlite3.connect(DB, timeout=1),
#      coba INSERT id=7 dalam try/except sqlite3.OperationalError —
#      simpan str(e) ke err_msg. Lalu con.commit() (lock lepas), ulangi
#      INSERT id=7 dari B + commit, simpan True ke retry_ok.`;

export const c18: V2Lesson = {
  slug: "c18-transaksi-acid",
  track: "SQL",
  module: "Engineering",
  title: "C18 Transaksi & ACID: Ketika Data Tidak Boleh Salah",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-transfer",
      eyebrow: "Langkah 1 · ACID",
      title: "Transfer yang setengah jalan",
      prose: [
        "Transfer Rp 10 juta: sistem mengurangi saldo A berhasil, menambah saldo B gagal (koneksi putus). Hasil: Rp 10 juta hilang — tidak di A, tidak di B. Tanpa transaksi, ini bisa terjadi setiap hari. Transaksi database menjamin: semua berhasil, atau semua batal — tidak ada “setengah jalan”.",
        "Rp 10 juta “hilang” — tidak di A, tidak di B. Uang tidak bisa musnah di dunia nyata, tapi di database tanpa transaksi, ia bisa. ACID terdengar seperti teori database membosankan — sampai kamu sadar ia satu-satunya yang berdiri antara “transfer berhasil” dan “uang hilang”.",
        "Empat jaminan: A — Atomicity (semua atau tidak sama sekali; transfer = debit+credit satu paket). C — Consistency (aturan selalu terjaga; saldo tidak negatif, FK valid). I — Isolation (transaksi konkuren tak saling ganggu; dua tarik tunai bersamaan). D — Durability (yang di-commit tak hilang; mati lampu setelah commit = aman). `BEGIN` = mulai; `COMMIT` = sukses permanen; `ROLLBACK` = batal total. Di SQLite, tiap statement = transaksi sendiri (autocommit) kecuali BEGIN eksplisit.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“COMMIT membuat data langsung aman dari segala bencana.” Salah — durability = tahan crash (write-ahead log), bukan tahan bencana (kebakaran data center!). Butuh backup + replikasi untuk itu. ACID ≠ disaster recovery.",
      },
      reference: "Satu unit bisnis = satu transaksi: BEGIN ... COMMIT; error → ROLLBACK.",
    },
    {
      id: "kasus-transfer",
      eyebrow: "Langkah 2 · Atomicity",
      title: "Transfer Rp 10 juta — tulis transaksinya",
      prose: [
        "`BEGIN; UPDATE rekening SET saldo = saldo - 10000000 WHERE id = 'A'; UPDATE rekening SET saldo = saldo + 10000000 WHERE id = 'B'; COMMIT;` — sebelum COMMIT, semua perubahan sementara (hanya terlihat di transaksimu). Jika koneksi putus di tengah: otomatis ROLLBACK → A utuh. Tanpa BEGIN/COMMIT, tiap statement auto-commit sendiri — dan “setengah jalan” menjadi mungkin.",
        "Kasus dua teller: saldo Rp 5 juta; teller 1 tarik Rp 3 juta; teller 2 tarik Rp 4 juta — bersamaan. Keduanya baca 5jt → T1 tulis 2jt; T2 tulis 1jt (menimpa!) → hasil 1jt. Seharusnya 5−3−4 = −2jt → salah satu DITOLAK. Solusi: `UPDATE ... SET saldo = saldo - 3000000` (atomik, bukan baca-lalu-tulis di aplikasi!) + row lock sampai COMMIT + `CHECK (saldo >= 0)` — constraint = aturan bisnis di database, lapisan pertahanan terakhir yang tidak bisa di-bypass aplikasi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "ACID: A = ?",
          options: [
            { text: "Akurat", why: "Salah." },
            { text: "Atomicity — semua atau tidak sama sekali", why: "Benar. Tidak ada “setengah jalan”.", correct: true },
            { text: "Asinkron", why: "Salah." },
          ],
        },
        {
          q: "Transfer: debit A sukses, kredit B gagal, tanpa transaksi?",
          options: [
            { text: "Otomatis rollback", why: "Salah — tanpa transaksi, tidak ada yang me-rollback." },
            { text: "Uang hilang (tidak di A, tidak di B)", why: "Benar. Inilah yang dicegah transaksi.", correct: true },
            { text: "Otomatis retry", why: "Salah — tidak ada retry otomatis." },
          ],
        },
      ],
      reference: "Atomicity = Rp 10 juta tidak bisa hilang di tengah jalan.",
    },
    {
      id: "isolation",
      eyebrow: "Langkah 3 · Isolation level",
      title: "Seberapa terpisah?",
      prose: [
        "Dua transaksi jalan bersamaan → anomali. Dirty read: baca data yang belum di-commit (lalu di-rollback!) — dicegah READ COMMITTED ke atas. Non-repeatable read: baca 2× hasil beda (di-update orang) — dicegah REPEATABLE READ ke atas. Phantom read: baris baru muncul di tengah hitung — dicegah SERIALIZABLE.",
        "Level: READ COMMITTED (anti dirty read; default umum; laporan biasa) → REPEATABLE READ (+ baca konsisten; laporan yang hitung berulang) → SERIALIZABLE (maksimal, seolah serial; transfer dana; kritis). Level = trade-off proteksi vs performa. Untuk analis: laporan yang angkanya “berubah-ubah” saat di-refresh = kemungkinan isolation rendah + data ditulis bersamaan. Solusi: baca dari snapshot (warehouse!) bukan tabel live.",
        "Deadlock: dua transaksi saling tunggu (A kunci X tunggu Y; B kunci Y tunggu X). Database membunuh salah satu (error “deadlock detected”, otomatis rollback) — aplikasi harus retry. Pencegahan: akses tabel/baris dalam urutan yang sama di semua transaksi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Dirty read dicegah oleh?",
          options: [
            { text: "READ UNCOMMITTED", why: "Salah — level ini justru mengizinkan dirty read." },
            { text: "READ COMMITTED ke atas", why: "Benar. Jangan baca yang belum di-commit.", correct: true },
            { text: "Tidak bisa", why: "Salah — bisa, dengan level yang tepat." },
          ],
        },
        {
          q: "Isolation tertinggi?",
          options: [
            { text: "READ COMMITTED", why: "Salah — itu level dasar." },
            { text: "REPEATABLE READ", why: "Salah — masih di bawah SERIALIZABLE." },
            { text: "SERIALIZABLE", why: "Benar. Seolah serial — maksimal proteksi, maksimal biaya.", correct: true },
          ],
        },
      ],
      reference: "Level = trade-off proteksi vs performa; laporan dari snapshot, bukan tabel live.",
    },
    {
      id: "pipeline",
      eyebrow: "Langkah 4 · Pipeline & laporan",
      title: "Atomik, swap, idempoten",
      prose: [
        "Load atomik: ETL harian dalam 1 transaksi — gagal = tabel tetap kemarin (konsisten!), bukan setengah hari ini. Pola swap: tulis ke `mart_new` → validasi (recon!) → dalam transaksi: `DROP TABLE mart_npl_old; ALTER TABLE mart_npl RENAME TO mart_npl_old; ALTER TABLE mart_npl_new RENAME TO mart_npl; COMMIT;` — pembaca tak pernah lihat tabel setengah jadi.",
        "Transaksi (ACID) melindungi satu eksekusi; idempotensi melindungi eksekusi berulang (retry!). Pola ETL kanonis: “DELETE lalu INSERT per partisi dalam satu transaksi” — dijalankan 1× atau 5×, hasil SAMA. Tanpa ini, setiap retry = duplikat = laporan salah. Laporan multi-tabel yang konsisten: baca dalam 1 transaksi REPEATABLE READ — angka antar tabel cocok.",
        "Aturan: transaksi sependek mungkin — jangan taruh sleep/API call di dalamnya! Transaksi pendek (detik) = murah; transaksi panjang (menit, menahan lock) = mahal dan memblokir orang lain.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Transaksi membuat segalanya lambat.” Salah — transaksi pendek = murah. Yang mahal = transaksi panjang yang menahan lock. Jangan salahkan transaksi; salahkan transaksi yang kepanjangan.",
      },
      quiz: [
        {
          q: "Pola load pipeline yang aman?",
          options: [
            { text: "Langsung ke tabel live", why: "Salah — gagal di tengah = tabel setengah jadi terlihat." },
            { text: "Tulis ke tabel baru → validasi → swap atomik", why: "Benar. Pembaca tak pernah lihat setengah jadi.", correct: true },
            { text: "Hapus dulu baru isi", why: "Salah — antara hapus dan isi, tabel kosong terlihat." },
          ],
        },
        {
          q: "Job ETL crash di 90% lalu dijalankan ulang. Tanpa desain benar?",
          options: [
            { text: "Tidak masalah", why: "Salah." },
            { text: "Duplikat 1,8 juta baris", why: "Benar. Solusi: idempoten — DELETE lalu INSERT per partisi dalam satu transaksi.", correct: true },
            { text: "Data hilang", why: "Salah — masalahnya duplikat, bukan hilang." },
          ],
        },
      ],
      reference: "Pipeline: atomik + swap + idempoten; laporan dari snapshot.",
    },
    {
      id: "minicase-pipeline",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Pipeline setengah jalan",
      prose: [
        "Situasi: ETL harian gagal di langkah 7 dari 10 (disk penuh). Tabel mart terisi setengah — dashboard menampilkan angka campur kemarin + hari ini. Direksi sudah screenshot. Tugas: (1) apa yang salah dari desain? (2) rancang ulang dengan transaksi/swap; (3) bagaimana mencegah “sudah screenshot” terulang? (4) tulis penjelasan 3 kalimat untuk direksi.",
        "Pembahasan: (1) load langsung ke tabel live tanpa transaksi — gagal = setengah jadi terlihat. (2) tulis ke `mart_new` → validasi (recon!) → swap atomik dalam transaksi; gagal kapanpun = tabel live tetap kemarin. (3) dashboard baca dari tabel live saja + data freshness indicator (“data per 06:00”) — screenshot pun berlabel waktu. (4) “Pipeline gagal di tengah menyebabkan data tercampur. Kami beralih ke pola swap atomik: dashboard hanya melihat data yang lolos validasi penuh. Angka terkoreksi terlampir.”",
        "Pelajaran: keandalan = desain, bukan harapan. Transaksi + swap + recon = pipeline yang tidur nyenyak.",
      ],
      tasks: [],
      reference: "Keandalan = desain: transaksi + swap + recon + freshness indicator.",
    },
    {
      id: "intuisi-isolasi",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Pilih isolation level dari anomali yang tidak boleh terjadi",
      prose: [
        "Cara berpikir yang membalik kebiasaan: jangan mulai dari “level apa yang kumengerti”, melainkan dari “anomali apa yang bila terjadi akan menjadi insiden”.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: isolation level adalah premi asuransi — bayar sesuai risiko yang tidak bisa kamu tanggung",
        body: "Setiap level isolasi adalah premi: SERIALIZABLE mahal (konflik, retry, throughput turun) tetapi menanggung semua anomali; READ COMMITTED murah tetapi menanggung hampir tidak ada. Heuristik praktisi: daftarkan anomali yang FATAL untuk tiap alur — transfer dana: lost update = uang hilang (fatal) → butuh proteksi penuh; dashboard agregat harian: phantom read = angka sedikit bergeser (tidak fatal) → READ COMMITTED cukup. Kebanyakan sistem produksi yang sehat memakai DUA level: SERIALIZABLE (atau pola setara) untuk mutasi uang/saldo, READ COMMITTED untuk baca laporan — bukan satu level untuk semua. Dan satu kewaspadaan: level yang “lebih tinggi” bukan selalu “lebih benar” — REPEATABLE READ yang menahan snapshot lama di transaksi panjang bisa membuat laporan memakai data basi tanpa disadari. Pilih dari anomali yang tidak boleh terjadi, ukur biayanya, dan dokumentasikan kenapa level itu dipilih di komentar kode transaksi.",
      },
      reference: "Daftar anomali fatal per alur → pilih level termurah yang menanggungnya.",
    },
    {
      id: "anomali-lolos",
      eyebrow: "Langkah 7 · Anomali lanjut",
      title: "Write skew: anomali yang lolos dari REPEATABLE READ",
      prose: [
        "Ada anomali yang tidak tercantum di daftar klasik tiga (dirty read, non-repeatable, phantom) tetapi paling sering menjadi insiden nyata: write skew — “kemiringan tulis”. Skenarionya: aturan “minimal 1 dokter jaga”. Dokter A dan B membaca daftar jaga (keduanya melihat 2 dokter), A menghapus dirinya, B menghapus dirinya — keduanya memvalidasi “masih ada 1 lagi” dari snapshot MASING-MASING, dan hasil akhir: 0 dokter jaga. Tidak ada yang membaca data kotor, tidak ada yang membaca ulang — tiap transaksi konsisten dengan snapshotnya sendiri. REPEATABLE READ / snapshot isolation TIDAK mencegah ini; hanya SERIALIZABLE yang bisa.",
        "Write skew adalah pola umum, bukan kasus medis: “rekening tidak boleh overdraw” dengan dua tarik tunai bersamaan yang masing-masing melihat saldo cukup; “maksimal 100 peserta” dengan dua pendaftaran bersamaan yang masing-masing melihat 99. Ciri khasnya: constraint melibatkan AGREGAT atau kondisi lintas baris (“jumlah dokter ≥ 1”, “saldo − total tarik ≥ 0”) yang tidak bisa diungkapkan sebagai constraint satu baris. Database tidak bisa menebak aturan bisnismu — ia hanya melihat dua tulis yang tidak bertabrakan di baris yang sama.",
        "Tiga obat dengan trade-off berbeda. Obat 1 — SERIALIZABLE: database mendeteksi pola baca-tulis yang berbahaya dan menggagalkan salah satu transaksi (serialization failure) → aplikasi retry. Benar secara umum, mahal (abort + retry) bila konflik sering. Obat 2 — SELECT FOR UPDATE (pessimistic locking): kunci baris yang dibaca sejak awal sehingga transaksi kedua menunggu; sederhana dan deterministik, tetapi menahan lock = mengurangi konkurensi dan berisiko deadlock bila urutan penguncian tidak konsisten. Obat 3 — constraint di database: CHECK atau trigger yang menegakkan aturan di level baris bila bisa dirumuskan per baris; untuk aturan agregat, teknik “materialize counter” (simpan jumlah dokter jaga di satu baris yang di-lock/di-update atomik) mengubah kondisi lintas-baris menjadi satu baris yang bisa dikunci.",
        "Aturan keputusan senior: aturan per-baris (saldo >= 0) → CHECK constraint + UPDATE atomik (SET saldo = saldo - x), selesai — tidak butuh isolation tinggi. Aturan lintas-baris yang jarang konflik → SERIALIZABLE + retry (biaya abort jarang terbayar). Aturan lintas-baris yang SERING konflik (counter populer, slot terbatas) → materialize counter + UPDATE atomik atau SELECT FOR UPDATE — terima antrean sebagai harga kebenaran. Dan yang paling penting: JANGAN mengandalkan “baca lalu tulis di aplikasi” untuk aturan lintas-baris — celah antara baca dan tulis adalah tempat write skew tinggal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Pakai REPEATABLE READ, itu sudah cukup tinggi.” Untuk write skew, tidak: snapshot isolation justru level tempat write skew HIDUP — tiap transaksi melihat snapshot konsistennya sendiri dan keduanya lolos validasi. “Cukup tinggi” tanpa tahu anomali apa yang ditanggung adalah premi asuransi yang tidak menanggung risiko yang kamu punya.",
      },
      reference: "Aturan lintas-baris + baca-lalu-tulis = write skew; obat: SERIALIZABLE+retry, SELECT FOR UPDATE, atau materialize counter.",
    },
    {
      id: "retry-pattern",
      eyebrow: "Langkah 8 · Pola retry",
      title: "Retry yang benar saat database menolak transaksimu",
      prose: [
        "Di SERIALIZABLE (dan kadang REPEATABLE READ), database boleh menggagalkan transaksimu dengan serialization failure / deadlock detected — BUKAN karena kodemu salah, melainkan karena ia memilihmu sebagai korban demi menjaga konsistensi global. Ini perilaku NORMAL yang harus dirancang, bukan error yang harus “diperbaiki”. Respons yang benar: tangkap error retriable spesifik, rollback total, tunggu sebentar, ulangi SELURUH transaksi dari BEGIN — bukan statement terakhir, karena transaksi sudah di-rollback total dan mengulang satu statement tanpa konteksnya = setengah jalan.",
        "Pola retry kanonis memiliki empat komponen. (1) Klasifikasi error: retry HANYA untuk error retriable (serialization failure, deadlock, connection drop sebelum commit) — JANGAN retry constraint violation (akan gagal lagi selamanya) atau error bisnis. Daftar kode error retriable per database harus tertulis di kode, bukan di kepala. (2) Backoff dengan jitter: tunggu 50ms, 200ms, 800ms... dengan acak — tanpa jitter, 100 klien yang gagal bersamaan retry bersamaan dan gagal bersamaan lagi (thundering herd). (3) Batas: 3–5 percobaan lalu menyerah dengan error yang jelas — retry tak terbatas = hang tersamar. (4) Idempotensi: pastikan pengulangan aman — bila commit pertama SEBENARNYA berhasil tetapi responsnya hilang (network), retry buta = duplikat; pakai idempotency key (mis. INSERT dengan ON CONFLICT DO NOTHING atas kunci unik request).",
        "Dua jebakan retry yang menjadi insiden: pertama, retry di DALAM transaksi yang sama — setelah serialization failure, transaksi itu sudah mati; semua statement berikutnya error. Retry = koneksi/transaksi BARU dari BEGIN. Kedua, efek samping non-database di dalam transaksi yang di-retry: kirim email, panggil API pihak ketiga, tulis file — bila transaksi di-rollback dan diulang, email terkirim dua kali. Aturan keras: efek samping hanya SETELAH commit sukses (outbox pattern: tulis “email perlu dikirim” ke tabel dalam transaksi, worker terpisah mengirim setelah commit). Transaksi database hanya me-rollback database — dunia luar tidak ikut.",
        "Kapan TIDAK pakai SERIALIZABLE + retry? Bila konfliknya BUKAN anomali langka melainkan pola normal — mis. 1.000 user berebut 100 slot promo setiap detik. Retry di sini berarti 90% transaksi abort berulang: sistem sibuk saling menggagalkan. Untuk kontensi tinggi yang dapat diprediksi, beralihlah ke desain yang tidak butuh konflik: antrean (queue) + worker tunggal, atau UPDATE atomik atas counter (SET sisa = sisa - 1 WHERE sisa > 0 — satu statement atomik, tanpa baca-lalu-tulis, tanpa retry). Prinsip umumnya: SERIALIZABLE + retry untuk konflik JARANG tapi fatal; desain bebas-konflik untuk konflik SERING. Mengenali yang mana adalah separuh pekerjaannya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Tangkap semua exception lalu retry 3×.” Retry buta mengubah error permanen (constraint violation, data tidak valid) menjadi 3× beban sia-sia, dan mengubah duplikat menjadi insiden. Retry adalah obat untuk error RETRIABLE yang terdaftar eksplisit — selebihnya, gagal dengan cepat dan beri pesan yang jelas.",
      },
      reference: "Retry = error retriable + transaksi baru dari BEGIN + backoff+jitter + batas + idempotensi; efek samping hanya setelah commit.",
    },
    {
      id: "lab-atomik-kunci",
      eyebrow: "Lab · Atomik & kunci",
      title: "Buktikan sendiri: rollback menghapus, lock menolak",
      prose: [
        "ACID bukan slogan — dua hurufnya bisa kamu buktikan dalam 20 baris. ATOMICITY: tiga INSERT di dalam transaksi yang di-rollback harus hilang TOTAL — bukan sebagian. Kalau database hanya me-rollback 2 dari 3, itu bukan atomicity, itu bug. Eksperimen t1 mengujinya langsung: total sebelum 1500, di tengah transaksi 2400, setelah rollback harus kembali persis 1500.",
        "ISOLATION dalam bentuk paling fisiknya adalah LOCK. BEGIN IMMEDIATE mengambil reserved lock pada file database; selama lock dipegang dan belum commit, koneksi lain yang mencoba menulis mendapat penolakan keras: “database is locked”. Ini mekanisme yang sama — hanya dibungkus lebih halus — yang membuat isolation level bekerja: satu penulis pada satu waktu, pembaca lain menunggu atau membaca snapshot. Eksperimen t2 membuktikan lock itu nyata, bukan teori.",
        "Perhatikan desainnya: koneksi B memakai timeout=1 (menyerah setelah 1 detik), bukan menunggu selamanya. Di produksi, timeout yang terlalu panjang = antrean yang membeku; terlalu pendek = retry storm. Dan aturan emasnya: BEGIN tanpa COMMIT/ROLLBACK yang seimbang membuat lock menggantung — di lab ini timeout menyelamatkanmu, di produksi lock yang menggantung menahan seluruh aplikasi.",
      ],
      tasks: [
        { id: "t1", text: "Buktikan ATOMICITY: BEGIN → tambah 3 baris (id 3,4,5) → ROLLBACK; simpan total akhir ke total_setelah_rollback" },
        { id: "t2", text: "Buktikan LOCKING: BEGIN IMMEDIATE + INSERT id=6 tanpa commit; dari koneksi B (timeout=1) coba INSERT id=7, tangkap OperationalError ke err_msg; lalu commit A, ulangi INSERT dari B, simpan True ke retry_ok" },
      ],
      expected: "t1: 1500 → 2400 → 1500 (rollback menghapus total). t2: err_msg memuat 'locked'; retry_ok True.",
      note: {
        title: "Sering salah",
        body: "“Transaksi otomatis commit saat program selesai.” TIDAK — koneksi yang ditutup tanpa commit me-rollback (di sqlite) atau menggantung (di beberapa driver pool). Selalu tutup transaksi secara eksplisit: commit bila sukses, rollback bila gagal. “Lupa commit” adalah sumber lock menggantung nomor satu di aplikasi nyata.",
      },
      hints: [
        "t1: con.execute(\"BEGIN\") sebelum INSERT, con.rollback() sesudahnya — total dibaca ulang setelah rollback.",
        "t2: BEGIN IMMEDIATE (bukan BEGIN biasa) agar lock diambil segera; koneksi B = sqlite3.connect(DB, timeout=1).",
        "Pola tangkap: try: ... except sqlite3.OperationalError as e: err_msg = str(e).",
      ],
      code: {
        starter: LAB_SETUP + LAB_TAIL,
        lockLines: 14,
        solution:
          LAB_SETUP +
          `
# t1 — ATOMICITY
con.execute("BEGIN")
cur.executemany("INSERT INTO saldo VALUES (?,?,?)",
                [(3, 'Cici', 200), (4, 'Dedi', 300), (5, 'Eka', 400)])
print("sebelum rollback:", cur.execute("SELECT SUM(jumlah) FROM saldo").fetchone()[0])
con.rollback()
total_setelah_rollback = cur.execute("SELECT SUM(jumlah) FROM saldo").fetchone()[0]
print("setelah rollback:", total_setelah_rollback)
# t2 — LOCKING
con.execute("BEGIN IMMEDIATE")
cur.execute("INSERT INTO saldo VALUES (?,?,?)", (6, 'Fajar', 700))
conB = sqlite3.connect(DB, timeout=1)
err_msg = ""
try:
    conB.execute("INSERT INTO saldo VALUES (?,?,?)", (7, 'Gita', 800))
    conB.commit()
except sqlite3.OperationalError as e:
    err_msg = str(e)
print("error B:", err_msg)
con.commit()
conB.execute("INSERT INTO saldo VALUES (?,?,?)", (7, 'Gita', 800))
conB.commit()
retry_ok = cur.execute("SELECT COUNT(*) FROM saldo WHERE id IN (6,7)").fetchone()[0] == 2
print("retry_ok:", retry_ok)
conB.close()
con.close()
for suffix in ("", "-journal", "-wal"):
    p = DB + suffix
    if os.path.exists(p):
        os.remove(p)`,
        checks: [
          { kind: "defined", task: "t1", name: "total_setelah_rollback", label: "`total_setelah_rollback` terdefinisi", msg: "Jalankan eksperimen t1 dan simpan total akhir ke total_setelah_rollback." },
          { kind: "equal", task: "t1", name: "total_setelah_rollback", value: 1500, tol: 1e-9, label: "Total kembali 1500 setelah ROLLBACK", msg: "Atomicity: 3 baris yang di-rollback tidak boleh terlihat — total harus 1500." },
          { kind: "defined", task: "t2", name: "err_msg", label: "`err_msg` terdefinisi", msg: "Tangkap OperationalError dari koneksi B ke err_msg." },
          { kind: "contains", task: "t2", name: "err_msg", value: "locked", label: "Koneksi B ditolak: database is locked", msg: "Saat A menahan BEGIN IMMEDIATE + tulis tanpa commit, B harus mendapat 'database is locked'." },
          { kind: "equal", task: "t2", name: "retry_ok", value: true, tol: 1e-9, label: "Retry setelah commit sukses", msg: "Setelah A commit (lock lepas), INSERT dari B harus berhasil — retry_ok = True." },
        ],
      },
      reference: "Atomicity = semua-atau-tidak-sama-sekali (rollback menghapus total); lock = mekanisme fisik isolation; tutup transaksi eksplisit.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — Track C selesai!",
      prose: [
        "Lima pertanyaan terakhir track SQL. Kamu menempuh 19 lesson: SELECT → NULL → agregasi → fungsi → JOIN → subquery → CTE → himpunan → window (2 part) → pola analisis → cohort → rekursi → risk (DPD/fraud) → quality → modeling → index → ACID.",
        "Selanjutnya: Track D — Python for Data Analysis, di mana SQL bertemu Python.",
        "Satu catatan terakhir tentang isolation di DUNIA ANALIS (bukan engineer): kamu jarang memilih isolation level secara langsung, tetapi kamu memilih SUMBER BACAAN — dan itu keputusan isolation yang menyamar. Membaca laporan dari tabel OLTP live saat ETL berjalan = membaca di isolation rendah atas data yang berubah (angka “bergeser” saat di-refresh). Membaca dari snapshot/mart yang di-load atomik = membaca snapshot konsisten (REPEATABLE READ gratis, tanpa memintanya). Aturan praktis analis: angka yang dilaporkan ke direksi SELALU dari snapshot/mart, tidak pernah dari tabel operasional live — ini satu baris kebijakan yang menghilangkan seluruh kelas anomali “kok angkanya berubah-ubal”.",
      ],
      tasks: [],
      summary: [
        "ACID: Atomicity, Consistency, Isolation, Durability.",
        "BEGIN/COMMIT/ROLLBACK: satu unit bisnis = satu transaksi.",
        "Isolation: dirty/non-repeatable/phantom read; level = trade-off proteksi vs performa.",
        "Pipeline: atomik + swap + idempoten; laporan dari snapshot.",
        "Track C selesai — 19 lesson! Lanjut D: Python.",
      ],
      next: { label: "D1 — Python Dasar", href: "/v2/learn/d1-python-dasar" },
      quiz: [
        {
          q: "SAVEPOINT berguna untuk?",
          options: [
            { text: "Mempercepat query", why: "Salah." },
            { text: "“Pos simpanan” di tengah transaksi — batalkan sebagian tanpa mengulang dari awal", why: "Benar. `SAVEPOINT s1; ... ROLLBACK TO s1;` — 1 baris gagal tidak menggagalkan 999 lainnya.", correct: true },
            { text: "Backup database", why: "Salah." },
          ],
        },
        {
          q: "Dua transaksi deadlock (T1: A lalu B; T2: B lalu A). Apa yang dilakukan database?",
          options: [
            { text: "Menunggu selamanya", why: "Salah." },
            { text: "Memilih satu sebagai korban (error deadlock, otomatis rollback) — aplikasi harus retry", why: "Benar. Pencegahan: akses dalam urutan yang sama di semua transaksi.", correct: true },
            { text: "Menggabungkan keduanya", why: "Salah." },
          ],
        },
        {
          q: "Mengapa laporan keuangan memakai isolation level lebih ketat saat closing? Apa harganya?",
          options: [
            { text: "Agar cepat; tidak ada harga", why: "Salah." },
            { text: "Agar angka stabil (repeatable); harganya locking/waiting — transaksi lain antre", why: "Benar. Di luar closing, read committed cukup.", correct: true },
            { text: "Agar hemat storage", why: "Salah — tidak ada hubungannya." },
          ],
        },
        {
          q: "ROLLBACK manual vs crash otomatis — bedanya?",
          options: [
            { text: "Sama", why: "Salah." },
            { text: "Manual = keputusan aplikasi (validasi gagal, batalkan); crash = database otomatis rollback yang belum COMMIT", why: "Benar.", correct: true },
            { text: "Crash tidak rollback", why: "Salah — justru otomatis rollback." },
          ],
        },
        {
          q: "Prinsip satu kalimat untuk transaksi di pipeline?",
          options: [
            { text: "Transaksi selama mungkin", why: "Salah — sependek mungkin!" },
            { text: "Satu unit bisnis = satu transaksi; error → ROLLBACK; transaksi sependek mungkin", why: "Benar.", correct: true },
            { text: "Hindari transaksi", why: "Salah." },
          ],
        },
        {
          q: "Aplikasi menerima error “serialization failure” saat COMMIT di level SERIALIZABLE. Respons yang benar?",
          options: [
            { text: "Ulangi hanya statement terakhir yang gagal", why: "Salah — transaksi sudah di-rollback total; satu statement tanpa konteks transaksinya justru menciptakan “setengah jalan”." },
            { text: "Ulangi SELURUH transaksi dari BEGIN dengan backoff — setelah rollback total", why: "Benar. Serialization failure = database memilih transaksimu sebagai korban demi konsistensi; ulangi dari BEGIN (bukan statement terakhir) dengan jeda acak agar tidak tabrakan lagi.", correct: true },
            { text: "Abaikan error dan lanjutkan — datanya pasti tersimpan", why: "Salah — ROLLBACK berarti tidak ada yang tersimpan; melanjutkan diam-diam = data hilang tanpa jejak." },
            { text: "Naikkan ke isolation level yang lebih tinggi agar tidak terulang", why: "Salah — SERIALIZABLE sudah level tertinggi; error ini justru HARGA level tinggi. Solusinya pola retry, bukan naik level." },
          ],
        },
        {
          q: "Dua kasir melihat stok = 1, keduanya menjual 1 unit bersamaan → stok = -1. Anomali apa ini, dan apa pencegahnya?",
          options: [
            { text: "Dirty read — dicegah READ COMMITTED", why: "Salah — tidak ada yang membaca data belum-commit; keduanya membaca data committed." },
            { text: "Phantom read — dicegah REPEATABLE READ", why: "Salah — tidak ada baris baru yang muncul di tengah; masalahnya dua tulis atas dasar baca yang sama." },
            { text: "Write skew — hanya SERIALIZABLE yang mencegah (atau rumuskan ulang menjadi UPDATE atomik)", why: "Benar. Keduanya membaca snapshot konsisten (stok = 1) lalu menulis — pola baca-lalu-tulis lintas baris ini lolos dari REPEATABLE READ. Obat umum: SERIALIZABLE + retry; obat spesifik di sini: UPDATE atomik SET stok = stok - 1 WHERE stok > 0.", correct: true },
            { text: "Bukan anomali — hasil -1 sudah benar", why: "Salah — stok negatif melanggar aturan bisnis; dua penjualan atas 1 stok adalah tepat anomali yang harus dicegah." },
          ],
        },
      ],
    },
  ],
};

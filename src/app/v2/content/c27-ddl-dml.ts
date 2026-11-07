import type { V2Lesson } from "../lib/types";

const C27_SCHEMA = `CREATE TABLE rekening_migrasi (
  id INTEGER PRIMARY KEY,
  segmen TEXT,
  saldo_lama INTEGER,
  saldo_baru INTEGER
);`;

const C27_SEED = `INSERT INTO rekening_migrasi VALUES (1, 'Ritel', 12500000, 12500000);
INSERT INTO rekening_migrasi VALUES (2, 'Ritel', 8000000, 8000000);
INSERT INTO rekening_migrasi VALUES (3, 'UKM', 3250000, 3250000);
INSERT INTO rekening_migrasi VALUES (4, 'UKM', 15750000, 1575000);
INSERT INTO rekening_migrasi VALUES (5, 'Korporat', 42000000, 42000000);
INSERT INTO rekening_migrasi VALUES (6, 'Korporat', 9800000, 9800000);`;

export const c27: V2Lesson = {
  slug: "c27-ddl-dml",
  track: "SQL",
  module: "Lanjutan",
  title: "C27 — DDL/DML: Membuat dan Mengubah Data",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Akses tulis pertama — dan UPDATE tanpa WHERE",
      prose: [
        "Selama 26 lesson kamu membaca data: SELECT, JOIN, window function, CTE. Hari ini kamu mendapat akses tulis ke database staging. Tugas pertamamu tampak sepele: buat tabel nasabah baru, isi lima baris, koreksi satu saldo, hapus satu baris yang duplikat.",
        "Rekan satu tim bercerita tentang insiden minggu lalu: seorang analis menjalankan UPDATE nasabah SET status = 'macet' — tanpa WHERE. Dalam satu detik, 48.000 nasabah yang lancar ikut berubah status menjadi macet. Laporan NPL malam itu melonjak, komite risiko panik, dan tim menghabiskan tiga jam memulihkan dari backup. Query-nya benar secara sintaks. Kesalahannya adalah satu baris yang tidak ditulis.",
        "Lesson ini mengajarkan dua keluarga statement SQL yang selama ini hanya kamu lihat dari jauh: DDL untuk membentuk struktur (CREATE, ALTER, DROP) dan DML untuk mengubah isi (INSERT, UPDATE, DELETE). Plus satu kebiasaan yang membedakan analis yang dipercaya dengan akses tulis dari yang tidak: transaksi. Setelah lesson ini kamu bisa: (1) membuat dan mengubah tabel dengan DDL; (2) menulis DML yang aman dengan WHERE; (3) membungkus perubahan dalam transaksi agar bisa dibatalkan.",
      ],
      tasks: [],
      note: {
        title: "Aturan emas akses tulis",
        body: "Sebelum menjalankan DML di data nyata: tulis SELECT dengan WHERE yang sama dulu dan lihat berapa baris yang kena. Bila angkanya tidak sesuai harapan, jangan lanjutkan. Kebiasaan lima detik ini mencegah insiden tiga jam.",
      },
      reference: "DDL membentuk struktur; DML mengubah isi. UPDATE/DELETE tanpa WHERE adalah insiden yang menunggu terjadi.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengubah data dengan sengaja — dan membatalkan perubahan bila salah.",
        "(1) Menulis CREATE TABLE dengan tipe data, PRIMARY KEY, NOT NULL, dan DEFAULT yang tepat;",
        "(2) Mengubah struktur dengan ALTER TABLE dan menghapus dengan DROP TABLE secara aman;",
        "(3) Menulis INSERT, UPDATE, dan DELETE — selalu dengan WHERE pada dua yang terakhir;",
        "(4) Membungkus perubahan dalam transaksi BEGIN, COMMIT, dan ROLLBACK.",
      ],
      tasks: [],
    },
    {
      id: "ddl",
      eyebrow: "Langkah 3 · Teori",
      title: "DDL: CREATE, ALTER, DROP — membentuk struktur",
      prose: [
        "DDL (Data Definition Language) mengubah struktur database, bukan isinya. CREATE TABLE membuat tabel baru: kamu menyatakan nama kolom, tipe datanya, dan aturannya. INTEGER untuk bilangan bulat, TEXT untuk teks, REAL untuk desimal, dan NUMERIC bila presisi penting seperti uang. PRIMARY KEY menandai kolom identitas — nilainya unik dan tidak boleh kosong. NOT NULL melarang nilai kosong; DEFAULT memberi nilai bila tidak diisi.",
        "Contoh tabel nasabah: id INTEGER PRIMARY KEY, nama TEXT NOT NULL, saldo INTEGER NOT NULL DEFAULT 0. Tiga aturan dalam satu baris: id unik, nama wajib ada, saldo bila tidak diisi dianggap 0. Aturan yang ditulis di skema akan dijaga database selamanya — jauh lebih dapat diandalkan daripada aturan yang hanya ada di kepala analis.",
        "ALTER TABLE mengubah struktur tabel yang sudah ada: menambah kolom (ADD COLUMN), mengubah nama kolom, atau menghapus kolom. Menambah kolom dengan DEFAULT aman; menghapus kolom berbahaya — datanya hilang bersama kolomnya. DROP TABLE menghapus tabel beserta seluruh isinya. Tambahkan IF EXISTS agar skrip tidak gagal bila tabelnya sudah tidak ada, dan IF NOT EXISTS pada CREATE agar skrip bisa dijalankan ulang tanpa error.",
        "Sifat DDL yang harus diingat: di banyak database, DDL tidak bisa dibatalkan dengan ROLLBACK — ia langsung berlaku (auto-commit). Karena itu DDL ditulis dan diuji di staging dulu, tidak pernah langsung di produksi. Skrip DDL yang baik bersifat idempotent: dijalankan dua kali hasilnya sama seperti dijalankan sekali.",
      ],
      tasks: [],
      note: {
        title: "Tipe data uang",
        body: "Saldo dalam rupiah disimpan sebagai INTEGER (satuan rupiah, tanpa desimal), bukan REAL. Bilangan desimal biner tidak bisa mewakili semua nilai desimal dengan tepat — selisih satu rupiah dari pembulatan biner adalah bug yang hanya ketahuan saat rekonsiliasi. Aturan praktis: uang selalu INTEGER dalam satuan terkecil, atau NUMERIC/DECIMAL bila desimal memang diperlukan.",
      },
      reference: "CREATE TABLE + PRIMARY KEY + NOT NULL + DEFAULT. DDL bersifat auto-commit: uji di staging dulu.",
    },
    {
      id: "dml",
      eyebrow: "Langkah 4 · Teori",
      title: "DML: INSERT, UPDATE, DELETE — mengubah isi",
      prose: [
        "DML (Data Manipulation Language) mengubah isi tabel. INSERT menambah baris: sebutkan kolomnya secara eksplisit (INSERT INTO nasabah (id, nama, saldo) VALUES ...) — jangan pernah mengandalkan urutan kolom implisit, karena urutan itu berubah saat seseorang menambah kolom. INSERT bisa menambah banyak baris sekaligus, atau menyalin hasil SELECT ke tabel lain.",
        "UPDATE mengubah baris yang sudah ada — dan WHERE adalah bagiannya yang paling penting. UPDATE nasabah SET saldo = saldo + 250000 WHERE id = 3 hanya menyentuh satu baris. Tanpa WHERE, ia menyentuh semua baris. Tidak ada peringatan, tidak ada konfirmasi. Database menganggap kamu tahu apa yang kamu lakukan.",
        "DELETE menghapus baris — dengan aturan yang sama: selalu dengan WHERE. DELETE FROM nasabah WHERE id = 5 menghapus satu baris. DELETE FROM nasabah tanpa WHERE menghapus seluruh isi tabel (tabelnya tetap ada, isinya kosong). Bila ragu, tulis SELECT dengan WHERE yang sama dulu dan hitung barisnya.",
        "Satu pola yang menyelamatkan banyak analis: sebelum UPDATE atau DELETE, jalankan SELECT COUNT(*) dengan WHERE yang sama. Bila jumlahnya 1 padahal kamu mengharapkan 1, lanjutkan. Bila jumlahnya 48.000 padahal kamu mengharapkan 1, berhentilah dan periksa WHERE-mu. Lima detik melawan tiga jam pemulihan.",
      ],
      tasks: [],
      note: {
        title: "UPDATE tanpa WHERE di cerita pembuka",
        body: "Insiden 48.000 nasabah itu nyata polanya: UPDATE nasabah SET status = 'macet' tanpa WHERE. Pencegahannya berlapis: (1) kebiasaan SELECT COUNT dulu; (2) transaksi (langkah berikutnya); (3) hak akses — analis junior sebaiknya tidak punya akses UPDATE ke tabel produksi tanpa review. Ketiganya lebih murah daripada satu pemulihan backup.",
      },
      reference: "INSERT sebutkan kolomnya. UPDATE/DELETE selalu dengan WHERE. Cek COUNT dulu.",
    },
    {
      id: "transaksi",
      eyebrow: "Langkah 5 · Teori",
      title: "Transaksi: BEGIN, COMMIT, ROLLBACK — tombol batal",
      prose: [
        "Transaksi membungkus beberapa perubahan menjadi satu paket yang atomik: semuanya berhasil, atau semuanya batal. BEGIN memulai transaksi, COMMIT mengesahkannya, ROLLBACK membatalkannya. Di dalam transaksi, kamu bisa memeriksa hasil perubahan dengan SELECT sebelum memutuskan COMMIT atau ROLLBACK.",
        "Alur kerja yang aman: BEGIN, jalankan UPDATE/DELETE, SELECT untuk memeriksa (berapa baris berubah? apakah angkanya masuk akal?), lalu COMMIT bila benar atau ROLLBACK bila salah. Tanpa transaksi, setiap statement langsung permanen — tidak ada tombol batal.",
        "Sifat atomik ini sama dengan ACID di lesson C18: bila satu statement dalam transaksi gagal, seluruh paket batal. Inilah yang membuat migrasi data bisa aman: 1.000 baris dipindahkan dalam satu transaksi — bila baris ke-999 gagal, 998 baris sebelumnya ikut batal, bukan tertinggal setengah jalan.",
        "Satu peringatan: jangan biarkan transaksi terbuka berlama-lama. Transaksi yang dibiarkan menggantung mengunci baris dan menghambat analis lain. Aturannya: buka, kerjakan, periksa, putuskan — dalam hitungan menit, bukan jam.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dalam risk reporting, perubahan data tanpa jejak audit adalah temuan audit. Transaksi memberi batas yang jelas: satu paket perubahan, satu keputusan COMMIT, satu waktu. Gabungkan dengan kolom audit (diubah_oleh, diubah_pada) dan kamu punya jejak yang bisa dipertahankan di depan auditor.",
      },
      reference: "BEGIN, ubah, periksa dengan SELECT, lalu COMMIT atau ROLLBACK. Atomik: semua berhasil atau semua batal.",
    },
    {
      id: "lab-ddl-dml",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Bangun tabel nasabah, isi, koreksi, hapus",
      prose: [
        "Lab ini memakai sqlite3 lewat Python — cara yang sama dipakai lesson C16 untuk DDL. Tugasmu: buat tabel nasabah (id INTEGER PRIMARY KEY, nama TEXT NOT NULL, saldo INTEGER NOT NULL DEFAULT 0), isi lima baris, koreksi satu saldo, hapus satu baris, lalu cetak jumlah baris dan total saldo.",
        "Lima nasabahnya: Ayu 12.500.000, Budi 8.000.000, Citra 3.250.000, Dedi 15.750.000, Eka 900.000. Koreksinya: saldo Citra (id 3) naik 250.000 menjadi 3.500.000. Yang dihapus: Eka (id 5), baris duplikat. Hitung hasil akhirnya di kepala dulu: 4 baris tersisa; total saldo 12.500.000 tambah 8.000.000 tambah 3.500.000 tambah 15.750.000 sama dengan 39.750.000.",
        "Perhatikan urutannya: DDL dulu (CREATE TABLE), lalu DML (INSERT, UPDATE, DELETE), lalu SELECT untuk verifikasi. Dan perhatikan UPDATE memakai WHERE id = 3, DELETE memakai WHERE id = 5 — tanpa WHERE, lab ini akan menghancurkan datanya sendiri.",
        "Setelah lolos, coba eksperimen: jalankan skrip dua kali tanpa mengubah apa pun. CREATE TABLE tanpa IF NOT EXISTS akan gagal di percobaan kedua — tabelnya sudah ada. Tambahkan IF NOT EXISTS dan lihat skrip menjadi idempotent.",
      ],
      tasks: [
        { id: "t1", text: "Tulis CREATE TABLE nasabah dengan PRIMARY KEY, NOT NULL, dan DEFAULT 0" },
        { id: "t2", text: "INSERT 5 baris, UPDATE saldo id 3 (+250.000), DELETE id 5 — semua dengan WHERE" },
        { id: "t3", text: "SELECT COUNT(*) dan SUM(saldo), cetak keduanya" },
      ],
      expected: "4\n39750000",
      hints: [
        "Gunakan executescript untuk menjalankan beberapa statement sekaligus.",
        "UPDATE nasabah SET saldo = saldo + 250000 WHERE id = 3 — jangan lupa WHERE.",
        "DELETE FROM nasabah WHERE id = 5 — hapus berdasarkan id, bukan nama.",
        "Cetak COUNT(*) dulu, lalu SUM(saldo) — masing-masing di baris sendiri.",
      ],
      code: {
        starter: `import sqlite3\n\ndb = sqlite3.connect(":memory:")\ncur = db.cursor()\n\n# TULIS KODEMU: CREATE TABLE nasabah, INSERT 5 baris,\n# UPDATE saldo id 3 (+250000), DELETE id 5.\n# Lalu SELECT COUNT(*) dan SUM(saldo), cetak keduanya.\n\n\nprint("jumlah:", 0)\nprint("total:", 0)`,
        lockLines: 4,
        solution: `import sqlite3\n\ndb = sqlite3.connect(":memory:")\ncur = db.cursor()\n\ncur.executescript(\"\"\"CREATE TABLE nasabah (\n  id INTEGER PRIMARY KEY,\n  nama TEXT NOT NULL,\n  saldo INTEGER NOT NULL DEFAULT 0\n);\nINSERT INTO nasabah VALUES (1, 'Ayu', 12500000);\nINSERT INTO nasabah VALUES (2, 'Budi', 8000000);\nINSERT INTO nasabah VALUES (3, 'Citra', 3250000);\nINSERT INTO nasabah VALUES (4, 'Dedi', 15750000);\nINSERT INTO nasabah VALUES (5, 'Eka', 900000);\nUPDATE nasabah SET saldo = saldo + 250000 WHERE id = 3;\nDELETE FROM nasabah WHERE id = 5;\"\"\")\n\njumlah, total = cur.execute(\"SELECT COUNT(*), SUM(saldo) FROM nasabah\").fetchone()\nprint(jumlah)\nprint(total)`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "39750000", label: "Total saldo akhir 39.750.000", msg: "Total = 12.500.000 + 8.000.000 + 3.500.000 + 15.750.000 = 39.750.000. Periksa UPDATE Citra (+250.000) dan DELETE Eka." },
          { kind: "stdout_matches", task: "t3", pattern: "^4", label: "Jumlah baris akhir 4", msg: "Setelah DELETE id 5, tersisa 4 baris. Periksa DELETE memakai WHERE id = 5." },
        ],
      },
      reference: "4 baris, total 39.750.000. DDL dulu, DML dengan WHERE, SELECT untuk verifikasi.",
    },
    {
      id: "lab-audit-migrasi",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — Audit hasil migrasi: cari baris yang berubah",
      prose: [
        "Lab kedua membalik peranmu: kali ini kamu bukan yang menulis DML, melainkan yang memeriksa hasil DML orang lain. Sebuah migrasi baru saja memindahkan saldo enam rekening dari sistem lama ke sistem baru. Tabel rekening_migrasi menyimpan saldo lama dan saldo baru tiap rekening. Tugasmu: temukan rekening yang saldonya berubah akibat migrasi.",
        "Query-nya satu baris: SELECT id, segmen, saldo_lama, saldo_baru FROM rekening_migrasi WHERE saldo_lama <> saldo_baru. Operator <> berarti tidak sama. Bila migrasi berjalan sempurna, query ini mengembalikan nol baris — dan nol baris adalah kabar baik.",
        "Di data ini ada satu baris yang berubah: rekening id 4, segmen UKM — saldo lama 15.750.000, saldo baru 1.575.000. Satu nol hilang di tengah migrasi: 15,75 juta menjadi 1,575 juta. Selisihnya 14.175.000 — cukup besar untuk merusak laporan, cukup kecil untuk lolos dari pengecekan kasar.",
        "Pelajaran lab ini: audit migrasi bukan soal menghitung total saja. Total bisa terlihat benar bila dua kesalahan saling menutupi. Audit yang benar membandingkan per baris — dan satu baris yang berbeda sudah cukup untuk menahan migrasi.",
      ],
      tasks: [
        { id: "t1", text: "Tulis SELECT id, segmen, saldo_lama, saldo_baru dengan WHERE saldo_lama <> saldo_baru" },
      ],
      sqlLab: {
        task: "Dari tabel rekening_migrasi, tampilkan id, segmen, saldo_lama, dan saldo_baru HANYA untuk rekening yang saldonya berubah (saldo_lama berbeda dengan saldo_baru).",
        schema: C27_SCHEMA,
        seedData: C27_SEED,
        starter: "SELECT\n",
        solution: "SELECT id, segmen, saldo_lama, saldo_baru FROM rekening_migrasi WHERE saldo_lama <> saldo_baru",
        expectedColumns: ["id", "segmen", "saldo_lama", "saldo_baru"],
        expectedRows: [[4, "UKM", 15750000, 1575000]],
        orderMatters: true,
      },
      reference: "Satu baris berubah: id 4, UKM, 15.750.000 menjadi 1.575.000 — satu nol hilang. Audit per baris, bukan hanya total.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: skrip migrasi yang jalan dua kali",
      prose: [
        "Sebuah skrip migrasi memindahkan 1.000 rekening dari sistem lama ke sistem baru. Operator menjalankannya dua kali karena tidak yakin percobaan pertama berhasil. Hasilnya: 2.000 baris di tabel tujuan — 1.000 rekening asli plus 1.000 duplikat. Laporan saldo membengkak dua kali lipat.",
        "Akar masalahnya ada di dua tempat. Pertama, tabel tujuan tidak punya PRIMARY KEY pada id rekening — database tidak punya cara menolak baris duplikat. Kedua, skrip INSERT tidak idempotent — dijalankan dua kali, hasilnya berbeda dari dijalankan sekali.",
        "Perbaikannya juga dua lapis. Di sisi struktur: beri PRIMARY KEY pada id rekening, sehingga baris duplikat ditolak database. Di sisi skrip: pakai INSERT OR IGNORE atau ON CONFLICT — baris yang sudah ada dilewati, bukan diduplikasi. Dengan kedua lapis itu, skrip yang dijalankan dua kali tetap menghasilkan 1.000 baris — sama seperti dijalankan sekali.",
        "Pelajaran umumnya: setiap skrip yang mengubah data harus aman dijalankan ulang. Operator akan menjalankan ulang skrip — karena ragu, karena gagal di tengah, karena terputus. Pertanyaannya bukan apakah skrip akan dijalankan dua kali, melainkan apa yang terjadi saat itu terjadi.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tanpa PRIMARY KEY: 1.000 baris menjadi 2.000 setelah dua kali jalan. Dengan PRIMARY KEY + INSERT OR IGNORE: tetap 1.000 baris. Idempotent berarti f(f(x)) = f(x) — menjalankan dua kali sama dengan menjalankan sekali. Semua skrip migrasi dan ETL harus memenuhi sifat ini.",
      },
      reference: "Skrip DML harus idempotent: PRIMARY KEY + INSERT OR IGNORE. Dijalankan dua kali, hasil tetap sama.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "DDL membentuk struktur: CREATE, ALTER, DROP — bersifat auto-commit, uji di staging dulu.",
        "DML mengubah isi: INSERT sebutkan kolomnya; UPDATE/DELETE selalu dengan WHERE.",
        "Sebelum DML: SELECT COUNT(*) dengan WHERE yang sama — lima detik melawan tiga jam pemulihan.",
        "Transaksi: BEGIN, ubah, periksa, COMMIT atau ROLLBACK. Atomik: semua berhasil atau semua batal.",
        "Skrip DML harus idempotent: PRIMARY KEY + INSERT OR IGNORE.",
        "Lab: 4 baris, total 39.750.000; audit migrasi menemukan id 4 (15.750.000 menjadi 1.575.000).",
      ],
      next: { label: "A1.10 Capstone Track 10: Pipeline Kredit dari SQL ke Python", href: "/v2/learn/a110-capstone-track-10" },
      quiz: [
        {
          q: "Apa yang terjadi saat menjalankan UPDATE nasabah SET status = 'macet' tanpa WHERE?",
          options: [
            { text: "Database menolak karena WHERE wajib ditulis", why: "Salah: database tidak menolak. UPDATE tanpa WHERE adalah statement yang sah — dan itulah bahayanya." },
            { text: "Semua baris berubah status menjadi 'macet' — 48.000 nasabah ikut kena", why: "Tepat: tanpa WHERE, UPDATE menyentuh seluruh tabel. Tidak ada peringatan, tidak ada konfirmasi.", correct: true },
            { text: "Hanya baris pertama yang berubah", why: "Salah: tidak ada konsep 'baris pertama' di UPDATE tanpa WHERE — semua baris berubah." },
            { text: "Query gagal karena tidak ada kondisi", why: "Salah: query-nya valid secara sintaks. Database menganggap kamu tahu apa yang kamu lakukan." },
          ],
        },
        {
          q: "Kenapa INSERT sebaiknya selalu menyebutkan nama kolom secara eksplisit?",
          options: [
            { text: "Karena tanpa nama kolom INSERT selalu gagal", why: "Salah: INSERT tanpa nama kolom bisa jalan — selama urutan nilainya cocok dengan urutan kolom saat itu." },
            { text: "Karena urutan kolom bisa berubah saat seseorang menambah kolom — INSERT implisit akan memasukkan nilai ke kolom yang salah", why: "Tepat: skema berubah, INSERT implisit diam-diam salah. Menyebut kolom membuat INSERT tahan terhadap perubahan skema.", correct: true },
            { text: "Karena nama kolom mempercepat eksekusi", why: "Salah: penyebutan kolom tidak berpengaruh pada kecepatan. Pengaruhnya pada kebenaran dan ketahanan." },
            { text: "Karena PRIMARY KEY wajib disebutkan di INSERT", why: "Salah: PRIMARY KEY tidak wajib disebutkan — bila auto-increment, justru sebaiknya tidak disebutkan." },
          ],
        },
        {
          q: "Skrip CREATE TABLE dijalankan dua kali dan gagal di percobaan kedua. Perbaikan yang benar adalah?",
          options: [
            { text: "Menghapus tabel dulu setiap kali sebelum CREATE", why: "Salah: menghapus dulu berarti menghapus data. Itu bukan perbaikan — itu kehancuran yang terjadwal." },
            { text: "Menambahkan IF NOT EXISTS agar skrip idempotent", why: "Tepat: CREATE TABLE IF NOT EXISTS membuat skrip aman dijalankan ulang — percobaan kedua tidak melakukan apa-apa.", correct: true },
            { text: "Mengganti CREATE TABLE menjadi CREATE VIEW", why: "Salah: view bukan tabel — ia tidak menyimpan data. Mengganti jenis object bukan solusi." },
            { text: "Menjalankan skrip hanya sekali dan berharap tidak perlu diulang", why: "Salah: skrip pasti dijalankan ulang — karena ragu, gagal di tengah, atau terputus. Harapan bukan strategi." },
          ],
        },
        {
          q: "Dalam transaksi, kamu menjalankan UPDATE lalu SELECT untuk memeriksa — hasilnya salah. Apa langkah berikutnya?",
          options: [
            { text: "COMMIT dulu, lalu perbaiki dengan UPDATE kedua", why: "Salah: COMMIT mengesahkan kesalahan. Perbaikan sesudah COMMIT berarti satu kesalahan ditambah satu perubahan lagi — dengan jejak yang lebih rumit." },
            { text: "ROLLBACK untuk membatalkan seluruh paket, lalu perbaiki dan ulangi", why: "Tepat: itulah gunanya transaksi — tombol batal. Batalkan, perbaiki, ulangi dari awal.", correct: true },
            { text: "Menutup koneksi — transaksi batal otomatis", why: "Salah: mengandalkan penutupan koneksi untuk membatalkan adalah perilaku yang tidak dijamin dan tidak tercatat. ROLLBACK eksplisit adalah caranya." },
            { text: "Membiarkan transaksi terbuka sampai ada yang memeriksa", why: "Salah: transaksi terbuka mengunci baris dan menghambat analis lain. Putuskan segera: COMMIT atau ROLLBACK." },
          ],
        },
        {
          q: "Audit migrasi menemukan rekening id 4: saldo lama 15.750.000, saldo baru 1.575.000. Apa kesimpulan yang benar?",
          options: [
            { text: "Migrasi berhasil — selisih 14.175.000 masih dalam toleransi", why: "Salah: selisih 14.175.000 dari satu rekening bukan toleransi — itu satu nol yang hilang. Tidak ada toleransi untuk angka yang salah digit." },
            { text: "Ada kesalahan migrasi pada satu baris — tahan migrasi dan selidiki sebelum lanjut", why: "Tepat: satu baris yang berbeda sudah cukup untuk menahan migrasi. Total yang terlihat benar bisa menyembunyikan dua kesalahan yang saling menutupi.", correct: true },
            { text: "Baris itu bisa diabaikan karena hanya satu dari enam rekening", why: "Salah: satu baris yang salah berarti logika migrasinya punya celah — dan celah yang sama bisa mengenai baris lain yang belum terdeteksi." },
            { text: "Saldo baru yang benar — sistem lama yang salah mencatat", why: "Salah: tidak ada bukti sistem lama yang salah. Asumsi default: migrasi yang mengubah angka adalah migrasi yang rusak, sampai terbukti sebaliknya." },
          ],
        },
      ],
    },
  ],
};

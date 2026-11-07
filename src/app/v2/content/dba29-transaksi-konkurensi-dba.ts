import type { V2Lesson } from "../lib/types";

export const dba29: V2Lesson = {
  slug: "dba29-transaksi-konkurensi-dba",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA29 — Transaksi dan Konkurensi: Lock, Deadlock, dan MVCC untuk DBA",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Flash sale, 47 deadlock dalam 10 menit",
      prose: [
        "Flash sale KirimCepat pukul 19.00. Sepuluh menit pertama: 47 error deadlock detected di log aplikasi. Checkout gagal, pelanggan mengulang klik, dan tiap klik ulang menambah transaksi baru yang berebut stok yang sama. Tim aplikasi menunjuk database; tim database menunjuk aplikasi. DBA membuka pg_stat_activity dan pg_locks — dan melihat rantai blokir empat sesi: sesi 1 memblokir sesi 2, sesi 2 memblokir sesi 3, sesi 3 memblokir sesi 5.",
        "Akar masalahnya bukan volume, melainkan urutan: dua transaksi meng-update stok dalam urutan berlawanan — satu dari produk A ke B, satu dari B ke A. Masing-masing mengunci baris pertama, lalu menunggu baris kedua yang sudah dikunci lawannya. Database mendeteksi siklus itu dan membunuh salah satu sebagai korban — 47 kali dalam 10 menit.",
        "Lesson ini mengajarkan konkurensi dari kursi DBA: bukan teori ACID, melainkan diagnosis dan pencegahan di produksi. Setelah lesson ini kamu bisa: (1) membaca rantai blokir dari pg_locks dan pg_stat_activity; (2) menjelaskan deadlock, korban deadlock, dan pola pencegahannya; (3) menyetel lock_timeout, statement_timeout, dan idle_in_transaction_session_timeout; (4) mengenali transaksi panjang yang menahan horizon MVCC dan memicu bloat; (5) menulis runbook retry yang benar untuk aplikasi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "C18 sudah mengajarkan ACID, level isolasi, dan definisi deadlock dari sudut analis — dengan lab SQLite dua teller. DBA2 sudah mengajarkan MVCC sebagai konsep arsitektur. Lesson ini TIDAK mengulang keduanya: ia mengajarkan sisi operasional yang belum ada — diagnosis rantai blokir, pembacaan lock di produksi, timeout sebagai pagar, transaksi panjang sebagai sumber bloat, dan retry sebagai kontrak dengan aplikasi.",
      },
      reference: "47 deadlock dalam 10 menit: dua transaksi mengunci dalam urutan berlawanan.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mendiagnosis insiden konkurensi di produksi — dan mencegah yang berikutnya.",
        "(1) Membaca rantai blokir: siapa menunggu siapa, sudah berapa lama, di lock apa;",
        "(2) Menjelaskan deadlock, pemilihan korban, dan pencegahan lewat urutan akses yang konsisten;",
        "(3) Menyetel tiga timeout — lock, statement, dan idle-in-transaction — dengan nilai yang masuk akal;",
        "(4) Mengenali transaksi panjang yang menahan horizon MVCC dan memicu bloat;",
        "(5) Menulis kontrak retry: kapan aplikasi boleh mengulang, berapa kali, dan dengan jeda berapa.",
      ],
      tasks: [],
    },
    {
      id: "rantai-blokir",
      eyebrow: "Langkah 3 · Teori",
      title: "Membaca rantai blokir: pg_locks dan pg_stat_activity",
      prose: [
        "Lock adalah antrean yang tidak terlihat. Saat sesi A meng-update satu baris, ia memegang row lock sampai commit atau rollback. Sesi B yang meng-update baris yang sama harus menunggu — dan penantiannya tercatat. Di PostgreSQL, pg_locks menunjukkan setiap lock yang dipegang dan diminta, dengan kolom granted yang membedakan keduanya: granted false berarti sesi itu sedang menunggu.",
        "Rantai blokir dibaca dengan menggabungkan pg_locks dan pg_stat_activity: sesi yang menunggu (granted false) menunjuk ke sesi yang memegang lock yang sama. Di cerita pembuka, rantainya empat sesi: sesi 1 memegang lock stok produk A; sesi 2 menunggu A sambil memegang B; sesi 3 menunggu B sambil memegang C; sesi 5 menunggu C. Total waktu tunggu yang terblokir: 4,2 ditambah 8,5 ditambah 1,3 ditambah 12,0 sama dengan 26,0 detik — dan rantai terpanjang (sesi 1, 2, 3, 5) menunggu 4,2 ditambah 8,5 ditambah 12,0 sama dengan 24,7 detik.",
        "Diagnosis selalu mulai dari kepala rantai — sesi yang tidak menunggu siapa pun tetapi ditunggu banyak sesi. Membunuh sesi di tengah rantai hanya memindahkan kemacetan; membunuh atau menyelesaikan kepala rantai membebaskan semuanya. Sebelum membunuh apa pun, baca dulu query kepala rantai di pg_stat_activity: apakah ia transaksi yang sah tetapi lambat, transaksi yang lupa commit, atau query laporan yang nyasar ke database transaksi?",
        "Di MySQL, alat yang setara adalah performance_schema.data_locks dan data_lock_waits, plus SHOW ENGINE INNODB STATUS yang menampilkan transaksi terakhir yang terlibat deadlock lengkap dengan query-nya. Dua mesin, satu pola diagnosis: temukan kepala rantai, baca query-nya, lalu putuskan — tunggu, batalkan, atau perbaiki.",
      ],
      tasks: [],
      note: {
        title: "Jangan membunuh membabi buta",
        type: "pitfall",
        body: "pg_terminate_backend pada sesi yang salah bisa membatalkan transaksi bisnis yang sah — misalnya settlement yang sudah berjalan 20 menit. Aturan: baca query dan umur transaksi dulu; hubungi pemilik aplikasi bila ragu; catat setiap kill dengan alasan dan waktu. Kill tanpa catatan adalah insiden kedua yang menunggu ditemukan auditor.",
      },
      reference: "Kepala rantai = sesi yang ditunggu tetapi tidak menunggu. Bunuh kepala, bukan tengah rantai.",
    },
    {
      id: "deadlock-timeout",
      eyebrow: "Langkah 4 · Teori",
      title: "Deadlock, korban, dan tiga timeout sebagai pagar",
      prose: [
        "Deadlock adalah siklus tunggu: A menunggu B, B menunggu A. Database mendeteksinya — PostgreSQL memeriksa secara berkala, sekitar tiap detik — dan memilih satu korban untuk dibunuh: transaksi yang memegang lock lebih sedikit atau yang lebih muda, supaya biaya rollback-nya paling kecil. Korban mendapat error deadlock detected dan rollback otomatis; pemenang melanjutkan seolah tidak terjadi apa-apa. Aplikasi yang benar me-retry korban; aplikasi yang salah menampilkan error ke pengguna dan menyalahkan database.",
        "Pencegahan deadlock ada tiga. Pertama, urutan akses yang konsisten: semua transaksi mengunci baris dalam urutan yang sama — misalnya selalu ORDER BY id sebelum update — sehingga siklus tidak pernah terbentuk. Kedua, transaksi yang pendek: lock dipegang sesingkat mungkin; logika bisnis dan panggilan API tidak boleh berada di dalam transaksi. Ketiga, kunci yang lebih kasar bila perlu: satu lock di awal untuk seluruh batch lebih aman daripada puluhan lock baris yang berebut.",
        "Tiga timeout adalah pagar yang mencegah satu sesi buruk merusak semua orang. lock_timeout: berapa lama sesi boleh menunggu lock sebelum menyerah — 5 detik di OLTP adalah nilai awal yang sehat. statement_timeout: berapa lama satu query boleh berjalan — 30 detik untuk query aplikasi, lebih longgar untuk laporan terjadwal. idle_in_transaction_session_timeout: berapa lama transaksi boleh menganggur dengan lock dipegang — 10 menit, karena transaksi yang lupa commit adalah sumber bloat dan blokir yang paling memalukan. Ketiganya disetel di level database atau per peran, bukan diharap dari disiplin aplikasi semata.",
        "Satu peringatan: timeout yang terlalu ketat sama buruknya dengan tidak ada timeout. lock_timeout 100 milidetik di beban normal akan membunuh transaksi sah saat ada lonjakan wajar. Nilai awal yang sehat: lock 5 detik, statement 30 detik, idle-in-transaction 10 menit — lalu sesuaikan dari data, bukan dari firasat.",
      ],
      tasks: [],
      note: {
        title: "Deadlock bukan bug database",
        body: "Deadlock adalah konsekuensi dari konkurensi yang benar-benar berjalan — dua transaksi sah yang kebetulan berpapasan. Database yang tidak pernah deadlock mungkin database yang tidak pernah dipakai bersamaan. Yang dinilai bukan nol deadlock, melainkan: apakah aplikasi me-retry dengan benar, dan apakah polanya diperbaiki setelah insiden.",
      },
      reference: "Korban = rollback otomatis + error; aplikasi wajib retry. Pagar: lock 5 detik, statement 30 detik, idle 10 menit.",
    },
    {
      id: "lab-rantai",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: kalkulator rantai blokir",
      prose: [
        "Lab ini membangun kalkulator rantai blokir: dari data tunggu empat sesi, hitung total waktu tunggu yang terblokir, panjang rantai, dan waktu tunggu rantai terpanjang.",
        "Hitung dulu di kepala. Waktu tunggu: sesi 2 menunggu 4,2 detik, sesi 3 menunggu 8,5 detik, sesi 4 menunggu 1,3 detik, sesi 5 menunggu 12,0 detik. Total = 4,2 ditambah 8,5 ditambah 1,3 ditambah 12,0 sama dengan 26,0 detik. Rantai terpanjang adalah sesi 1, 2, 3, 5 — empat sesi — dengan waktu tunggu 4,2 ditambah 8,5 ditambah 12,0 sama dengan 24,7 detik. Sesi 4 menunggu sesi 1 langsung, di luar rantai terpanjang itu. Sesi yang menunggu paling lama adalah sesi 5, dengan 12,0 detik.",
        "Tugas lab: tulis fungsi yang menerima kamus waktu tunggu dan daftar sesi rantai terpanjang — lalu mencetak empat baris: total_tunggu, panjang_rantai, tunggu_rantai, dan sesi_paling_lama. Empat angka ini adalah ringkasan yang DBA tempel di laporan insiden: seberapa besar kemacetannya, seberapa dalam rantainya, dan siapa yang paling menderita.",
        "Setelah lolos, coba eksperimen: ubah waktu tunggu sesi 5 menjadi 30,0 detik dan lihat total menjadi 44,0 detik — lalu tanyakan: pada angka berapa kamu memutuskan membunuh kepala rantai? Jawabannya ada di langkah berikutnya: bukan dari angka absolut, melainkan dari apakah kepala rantai itu transaksi sah atau transaksi yang lupa commit.",
      ],
      tasks: [
        { id: "t1", text: "Hitung total waktu tunggu semua sesi yang terblokir" },
        { id: "t2", text: "Hitung panjang rantai terpanjang dan total tunggu di rantai itu" },
        { id: "t3", text: "Tentukan sesi dengan waktu tunggu paling lama" },
      ],
      expected: "total_tunggu=26.0\npanjang_rantai=4\ntunggu_rantai=24.7\nsesi_paling_lama=s5",
      hints: [
        "Total tunggu = jumlah semua nilai di kamus waktu tunggu.",
        "Panjang rantai = jumlah sesi di daftar rantai terpanjang.",
        "Tunggu rantai = jumlah waktu tunggu sesi di rantai itu saja (sesi 1 tidak menunggu).",
        "Sesi paling lama = kunci dengan nilai maksimum di kamus.",
      ],
      code: {
        starter: `# Data insiden konkurensi: waktu tunggu (detik) + rantai terpanjang.\ntunggu = {"s2": 4.2, "s3": 8.5, "s4": 1.3, "s5": 12.0}\nrantai = ["s1", "s2", "s3", "s5"]\n\n# TULIS KODEMU: hitung empat angka rantai blokir di bawah ini.\n# Cetak, per baris: total_tunggu, panjang_rantai, tunggu_rantai, sesi_paling_lama.\n\n\nkalkulator_rantai(tunggu, rantai)`,
        lockLines: 2,
        solution: `# Data insiden konkurensi: waktu tunggu (detik) + rantai terpanjang.\ntunggu = {"s2": 4.2, "s3": 8.5, "s4": 1.3, "s5": 12.0}\nrantai = ["s1", "s2", "s3", "s5"]\n\n\ndef kalkulator_rantai(tunggu, rantai):\n    total_tunggu = sum(tunggu.values())\n    panjang_rantai = len(rantai)\n    tunggu_rantai = sum(tunggu[s] for s in rantai if s in tunggu)\n    sesi_paling_lama = max(tunggu, key=tunggu.get)\n    print(f"total_tunggu={total_tunggu}")\n    print(f"panjang_rantai={panjang_rantai}")\n    print(f"tunggu_rantai={tunggu_rantai}")\n    print(f"sesi_paling_lama={sesi_paling_lama}")\n\n\nkalkulator_rantai(tunggu, rantai)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "total_tunggu=26.0", label: "Total tunggu 26,0 detik", msg: "4,2 + 8,5 + 1,3 + 12,0 = 26,0. Jumlah semua sesi yang terblokir." },
          { kind: "stdout_matches", task: "t2", pattern: "panjang_rantai=4", label: "Rantai terpanjang 4 sesi", msg: "Sesi 1, 2, 3, 5 — empat sesi dalam satu rantai blokir." },
          { kind: "stdout_matches", task: "t2", pattern: "tunggu_rantai=24.7", label: "Tunggu rantai 24,7 detik", msg: "4,2 + 8,5 + 12,0 = 24,7. Sesi 1 tidak menunggu siapa pun; sesi 4 di luar rantai ini." },
          { kind: "stdout_matches", task: "t3", pattern: "sesi_paling_lama=s5", label: "Sesi paling lama s5", msg: "12,0 detik — nilai maksimum di kamus waktu tunggu." },
        ],
      },
      reference: "Total tunggu 26,0 detik; rantai 4 sesi; tunggu rantai 24,7 detik; sesi paling lama s5 (12,0 detik).",
    },
    {
      id: "mvcc-transaksi-panjang",
      eyebrow: "Langkah 6 · Teori",
      title: "MVCC, transaksi panjang, dan kontrak retry",
      prose: [
        "MVCC berarti pembaca melihat snapshot — potret data pada satu titik waktu — dan tidak pernah memblokir penulis. Tetapi snapshot punya harga: selama satu transaksi lama masih berjalan, versi-versi lama baris tidak boleh dibersihkan, karena transaksi itu mungkin masih membacanya. Horizon MVCC — transaksi tertua yang masih aktif — menentukan berapa banyak baris mati yang harus dipertahankan. Satu transaksi laporan yang dibuka 6 jam dan lupa commit menahan vacuum untuk seluruh database: bloat tumbuh, dan VACUUM tidak bisa berbuat apa-apa.",
        "Gejalanya mudah dikenali: n_dead_tup naik di banyak tabel sekaligus, padahal autovacuum berjalan normal. Diagnosisnya: pg_stat_activity menunjukkan satu transaksi dengan state idle in transaction selama berjam-jam, dengan xact_start yang tua. Perbaikannya: hubungi pemilik aplikasi, batalkan bila perlu, dan setel idle_in_transaction_session_timeout agar tidak terulang. Di MySQL, pola yang sama muncul sebagai transaksi lama yang menahan purge InnoDB — history list length yang membengkak di SHOW ENGINE INNODB STATUS.",
        "Level isolasi adalah kesepakatan tentang anomali apa yang ditoleransi — C18 sudah mengajarkan READ COMMITTED, REPEATABLE READ, dan SERIALIZABLE dari sudut analis. Dari kursi DBA, tambahannya adalah operasional: SERIALIZABLE yang gagal harus di-retry aplikasi seperti deadlock; REPEATABLE READ yang lama menahan snapshot dan bloat; dan laporan yang angkanya berubah-ubah saat di-refresh hampir selalu berarti isolation rendah ditambah tulis bersamaan — solusinya baca dari snapshot atau replika, bukan dari tabel live.",
        "Kontrak retry adalah perjanjian tertulis antara DBA dan tim aplikasi. Isinya: error apa saja yang boleh di-retry (deadlock detected, serialization failure, lock timeout), berapa kali (3 kali), dengan jeda berapa (backoff 100 ms, 400 ms, 1.600 ms — dikali empat tiap percobaan), dan kapan berhenti dan mengangkat alert (gagal 3 kali berarti ada pola, bukan nasib buruk). Retry tanpa backoff adalah DDoS terhadap diri sendiri: 47 deadlock yang langsung diulang serentak menjadi 47 deadlock kedua.",
      ],
      tasks: [],
      note: {
        title: "Backoff, bukan retry membabi buta",
        type: "pitfall",
        body: "Retry langsung tanpa jeda mempertemukan kembali transaksi yang sama di lock yang sama — deadlock kedua hampir pasti. Backoff eksponensial memberi waktu pada pemenang pertama untuk commit dan pergi. Dan retry hanya untuk error transient: retry pada constraint violation atau data yang memang salah hanya mengulang kegagalan dengan lebih mahal.",
      },
      reference: "Transaksi idle menahan horizon MVCC dan vacuum. Retry: 3 kali, backoff 100, 400, 1.600 ms.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 47 deadlock — perbaiki urutan, bukan volumenya",
      prose: [
        "Kembali ke cerita pembuka. Setelah insiden, tim aplikasi mengusulkan menambah koneksi pool dan menaikkan timeout — mengobati gejala. DBA menolak: 47 deadlock dalam 10 menit bukan soal kapasitas, melainkan soal urutan. Dua transaksi meng-update stok dalam urutan berlawanan; volume hanya memperbesar peluang keduanya berpapasan.",
        "Perbaikannya satu baris: semua update stok diurutkan berdasarkan produk_id sebelum dieksekusi — ORDER BY id di dalam transaksi, di semua jalur kode. Ditambah kontrak retry: deadlock di-retry sampai 3 kali dengan backoff 100, 400, dan 1.600 ms. Hasil flash sale berikutnya: nol deadlock. Dari 47 error di insiden pertama, 45 transaksi sukses di retry pertama — 95,7 persen — dan 2 sisanya sukses di retry kedua. Retry menutupi insiden; urutan yang konsisten menghapus penyebabnya.",
        "Keputusan rapat: urutan akses yang konsisten menjadi aturan code review — pull request yang meng-update banyak baris tanpa ORDER BY ditolak otomatis. Timeout tetap disetel sebagai pagar, bukan sebagai solusi. Dan runbook deadlock ditulis: diagnosis rantai, kepala rantai, retry, lalu perbaikan urutan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga lapis pertahanan, berurutan: (1) cegah — urutan akses konsisten sehingga siklus tidak terbentuk; (2) pulihkan — retry dengan backoff untuk deadlock yang lolos; (3) batasi — timeout sebagai pagar agar satu sesi buruk tidak merusak semua. Menambah pool koneksi bukan salah satu lapis — ia menambah peserta antrean, bukan mengurangi tabrakan.",
      },
      reference: "47 deadlock menjadi 0: urutan konsisten + retry 3 kali. 45 dari 47 sukses di retry pertama (95,7 persen).",
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
        "Kepala rantai = sesi yang ditunggu tetapi tidak menunggu siapa pun.",
        "Deadlock = siklus tunggu; korban rollback otomatis; aplikasi wajib retry dengan backoff.",
        "Lab: total tunggu 26,0 detik; rantai 4 sesi; tunggu rantai 24,7 detik; sesi paling lama s5.",
        "Tiga pagar: lock 5 detik, statement 30 detik, idle-in-transaction 10 menit.",
        "Transaksi idle menahan horizon MVCC dan vacuum — bloat tumbuh di semua tabel sekaligus.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Rantai blokir empat sesi: s1 ditunggu s2, s2 ditunggu s3, s3 ditunggu s5. Apa tindakan pertama yang benar?",
          options: [
            { text: "Bunuh s3 — ia di tengah rantai dan paling mudah dijangkau", why: "Salah: membunuh tengah rantai hanya memindahkan kemacetan. Kepala rantai s1 yang harus diselesaikan." },
            { text: "Baca query dan umur transaksi s1 — kepala rantai — lalu putuskan tunggu atau batalkan", why: "Tepat: kepala rantai adalah akar kemacetan. Membebaskannya membebaskan semua; tetapi baca dulu apakah ia transaksi sah.", correct: true },
            { text: "Bunuh semua sesi sekaligus agar antrean bersih", why: "Salah: membunuh semua berarti membatalkan transaksi bisnis yang sah — termasuk yang tidak bersalah." },
            { text: "Naikkan lock_timeout agar semua sesi menunggu lebih lama", why: "Salah: menunggu lebih lama tidak membebaskan siapa pun — ia memperpanjang kemacetan." },
          ],
        },
        {
          q: "Dua transaksi meng-update stok dalam urutan berlawanan dan deadlock 47 kali. Apa perbaikan akar masalahnya?",
          options: [
            { text: "Tambah pool koneksi agar lebih banyak transaksi bisa jalan bersamaan", why: "Salah: lebih banyak peserta antrean berarti lebih banyak tabrakan, bukan lebih sedikit." },
            { text: "Samakan urutan akses — semua update stok diurutkan berdasarkan produk_id", why: "Tepat: urutan konsisten membuat siklus tidak terbentuk. Hasilnya nol deadlock di sale berikutnya.", correct: true },
            { text: "Matikan deteksi deadlock agar error tidak muncul", why: "Salah: mematikan deteksi tidak menghilangkan siklus — transaksi akan menunggu selamanya." },
            { text: "Naikkan statement_timeout menjadi 10 menit", why: "Salah: timeout lebih longgar hanya menunda korban. Deadlock tetap terjadi, hanya lebih lambat terdeteksi." },
          ],
        },
        {
          q: "Lab menghitung total tunggu 26,0 detik dan tunggu rantai 24,7 detik. Kenapa keduanya berbeda?",
          options: [
            { text: "Karena sesi 4 menunggu langsung dari sesi 1, di luar rantai terpanjang", why: "Tepat: total mencakup semua sesi (26,0); rantai terpanjang hanya s1, s2, s3, s5 (24,7). Selisihnya 1,3 detik milik sesi 4.", correct: true },
            { text: "Karena salah satu angka salah hitung — keduanya harus sama", why: "Salah: keduanya mengukur hal berbeda. Total semua sesi; rantai hanya sesi di rantai terpanjang." },
            { text: "Karena sesi 1 tidak tercatat di kamus tunggu", why: "Salah: sesi 1 memang tidak menunggu siapa pun — ia kepala rantai. Itu alasan ia tidak ada di kamus, bukan kesalahan." },
            { text: "Karena pembulatan desimal yang berbeda", why: "Salah: selisihnya 1,3 detik — tepat waktu tunggu sesi 4. Bukan soal pembulatan." },
          ],
        },
        {
          q: "n_dead_tup naik di banyak tabel sekaligus padahal autovacuum berjalan normal. Apa diagnosis paling mungkin?",
          options: [
            { text: "Autovacuum rusak di semua tabel pada saat yang sama", why: "Salah: autovacuum yang rusak biasanya terlihat di satu tabel dulu. Kenaikan serentak menunjuk ke penyebab global." },
            { text: "Satu transaksi lama idle menahan horizon MVCC sehingga vacuum tidak bisa membersihkan", why: "Tepat: selama transaksi tertua masih aktif, versi lama harus dipertahankan. Cari transaksi idle in transaction yang berumur jam.", correct: true },
            { text: "Disk penuh sehingga vacuum tidak punya tempat menulis", why: "Salah: vacuum tidak butuh banyak ruang baru — ia menandai halaman kosong. Disk penuh punya gejala lain." },
            { text: "Terlalu banyak indeks sehingga vacuum melambat", why: "Salah: indeks memperlambat vacuum per tabel, bukan memblokirnya di semua tabel sekaligus." },
          ],
        },
        {
          q: "Kontrak retry yang benar untuk deadlock adalah?",
          options: [
            { text: "Retry tanpa batas sampai berhasil — deadlock pasti hilang sendiri", why: "Salah: retry tanpa batas pada pola yang salah adalah loop tanpa akhir yang membebani database." },
            { text: "Retry 3 kali dengan backoff 100, 400, 1.600 ms; gagal 3 kali berarti angkat alert", why: "Tepat: backoff memberi waktu pemenang commit; batas 3 kali membedakan nasib buruk dari pola yang harus diperbaiki.", correct: true },
            { text: "Jangan retry — tampilkan error deadlock ke pengguna", why: "Salah: deadlock adalah error transient yang dirancang untuk di-retry. Menampilkannya ke pengguna adalah kegagalan aplikasi." },
            { text: "Retry hanya error constraint violation, bukan deadlock", why: "Salah: terbalik. Constraint violation tidak boleh di-retry — datanya memang salah. Deadlock justru yang wajib di-retry." },
          ],
        },
      ],
    },
  ],
};

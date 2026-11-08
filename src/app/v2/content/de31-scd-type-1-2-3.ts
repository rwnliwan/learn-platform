import type { V2Lesson } from "../lib/types";

export const de31: V2Lesson = {
  slug: "de31-scd-type-1-2-3",
  track: "Data Engineer",
  module: "Fondasi Pipeline",
  title: "DE31 — SCD Type 1/2/3: Saat Dimensi Berubah, Sejarah Ikut Berubah",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pelanggan yang pindah tiga kali, dan laporan yang berubah-ubah",
      prose: [
        "Tim analis KirimCepat melaporkan revenue per kota. Januari: pelanggan Andi tercatat di Jakarta. Maret: Andi pindah ke Bandung. Juni: Andi pindah lagi ke Surabaya. Laporan Januari yang dibuka ulang di bulan Juli tiba-tiba menunjukkan revenue Andi di Surabaya — padahal saat transaksi terjadi, Andi tinggal di Jakarta. Finance protes: laporan historis tidak boleh berubah hanya karena pelanggan pindah.",
        "Akar masalahnya ada di dimensi pelanggan. Pipeline menimpa alamat lama dengan alamat baru setiap kali ada perubahan — itu SCD Type 1. Laporan historis ikut berubah, dan tidak ada yang bisa menjawab pertanyaan sederhana: di kota mana Andi tinggal saat ia bertransaksi di bulan Februari?",
        "Lesson ini mengajarkan tiga tipe Slowly Changing Dimension: Type 1 menimpa, Type 2 menambah baris baru dengan rentang berlaku, Type 3 menambah kolom untuk nilai lama. Setelah lesson ini kamu bisa: (1) membedakan ketiga tipe dan konsekuensi masing-masing pada laporan; (2) merancang kunci surrogate dan rentang berlaku untuk Type 2; (3) menghitung berapa baris yang dihasilkan tiap tipe; (4) memilih tipe yang tepat per atribut; (5) menulis query as-of yang benar.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DE6 mengajarkan dimensional modeling dan Data Vault, tetapi 0 hit untuk SCD, Type 1, Type 2, maupun Type 3 — tidak ada satu pun langkah yang membahas bagaimana dimensi yang berubah diperlakukan. Lesson ini mengisi kekosongan itu secara eksplisit, dengan lab yang menghitung baris tiap tipe dari data perubahan yang sama.",
      },
      reference: "4 pelanggan, 6 perubahan alamat: Type 1 menghasilkan 4 baris, Type 2 menghasilkan 10 baris.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memutuskan bagaimana dimensi yang berubah disimpan — dan mempertanggungjawabkan pilihanmu di depan finance.",
        "(1) Menjelaskan SCD Type 1, 2, dan 3 beserta trade-off-nya;",
        "(2) Merancang Type 2 dengan surrogate key, valid_from, valid_to, dan flag current;",
        "(3) Menghitung jumlah baris tiap tipe dari riwayat perubahan;",
        "(4) Menulis query as-of: nilai dimensi pada tanggal transaksi;",
        "(5) Memilih tipe per atribut: alamat butuh sejarah, nama panggilan cukup ditimpa.",
      ],
      tasks: [],
    },
    {
      id: "tiga-tipe",
      eyebrow: "Langkah 3 · Teori",
      title: "Tiga tipe: timpa, tambah baris, tambah kolom",
      prose: [
        "Type 1 menimpa nilai lama dengan nilai baru. Satu baris per pelanggan, selalu. Murah dan sederhana — dan sejarah hilang selamanya. Cocok untuk atribut yang kesalahannya harus dikoreksi (misalnya nama yang salah ketik) atau atribut yang sejarahnya tidak bernilai (nama panggilan). Tidak cocok untuk apa pun yang dipakai di laporan historis: kota, segmen, kategori.",
        "Type 2 menambah baris baru setiap kali atribut berubah, dengan rentang berlaku. Andi punya tiga baris: Jakarta dari Januari sampai Maret, Bandung dari Maret sampai Juni, Surabaya dari Juni sampai sekarang. Satu baris ditandai current. Laporan historis stabil karena transaksi di-join ke baris dimensi yang berlaku pada tanggal transaksi. Harganya: tabel dimensi tumbuh, dan join butuh kondisi tanggal.",
        "Type 3 menambah kolom untuk nilai lama: alamat_saat_ini dan alamat_sebelumnya. Hanya menyimpan satu langkah ke belakang — pindahan ketiga menimpa pindahan kedua. Cocok bila bisnis hanya peduli perbandingan sekarang vs sebelumnya (misalnya segmen sekarang vs segmen sebelumnya). Bila butuh sejarah penuh, Type 3 adalah Type 1 yang menyamar.",
        "Aturan memilih: tanyakan berapa langkah sejarah yang dibutuhkan laporan. Nol: Type 1. Satu langkah: Type 3. Semua: Type 2. Dan tipe dipilih per atribut, bukan per tabel — satu dimensi pelanggan boleh memakai Type 2 untuk kota dan Type 1 untuk nama panggilan sekaligus.",
      ],
      tasks: [],
      note: {
        title: "Surrogate key itu perlu — tetapi bukan solusi as-of",
        body: "Kunci bisnis pelanggan (misalnya customer_id) sama di semua baris Type 2 — ia tidak lagi unik. Tambahkan surrogate key (sk_pelanggan) sebagai primary key tiap baris versi. Tetapi surrogate key SENDIRI tidak menyelesaikan masalah as-of: fact menyimpan customer_id dan tanggal transaksi, dan join as-of (business key + kondisi tanggal half-open) yang MENYELESAIKAN surrogate key mana yang berlaku saat itu. Surrogate key adalah identitas baris; kondisi tanggal adalah yang memilih barisnya. Join memakai customer_id saja — tanpa kondisi tanggal — akan menggandakan baris fact.",
      },
      reference: "Type 1: timpa, sejarah hilang. Type 2: baris baru per perubahan, sejarah penuh. Type 3: satu kolom nilai lama.",
    },
    {
      id: "query-asof",
      eyebrow: "Langkah 4 · Teori",
      title: "Query as-of: join dengan tanggal, bukan dengan pelanggan",
      prose: [
        "Join Type 2 yang benar memakai dua kondisi: customer_id cocok DAN tanggal transaksi berada di dalam rentang berlaku — dengan interval HALF-OPEN [valid_from, valid_to): valid_from <= tanggal transaksi < valid_to. Batas bawah inklusif, batas atas eksklusif. Ini penting: bila baris lama ditutup dengan valid_to = tanggal perubahan dan baris baru dibuka dengan valid_from = tanggal yang sama, interval yang kedua ujungnya inklusif membuat SATU tanggal cocok di DUA baris — revenue terhitung dua kali. Half-open menghilangkan ambiguitas itu: tiap tanggal hanya cocok di tepat satu baris.",
        "Pola yang aman: valid_to baris current diisi tanggal jauh di masa depan (misalnya 9999-12-31) supaya kondisi tanggal tetap sederhana, dan flag is_current sama dengan 1 menandai baris aktif. Saat perubahan datang, tutup baris lama (valid_to sama dengan tanggal perubahan, is_current sama dengan 0) lalu sisipkan baris baru (valid_from sama dengan tanggal perubahan, is_current sama dengan 1). Dua langkah itu harus dalam satu transaksi — baris lama tertutup tetapi baris baru gagal tersisip berarti pelanggan itu hilang dari laporan. Contoh SQL as-of lengkap:\n\nSELECT f.*, d.kota\nFROM fact_penjualan f\nJOIN dim_pelanggan d\n  ON d.customer_id = f.customer_id\n AND f.tanggal_transaksi >= d.valid_from\n AND f.tanggal_transaksi < d.valid_to;\n\nPerhatikan operatornya: >= di bawah, < di atas — itulah half-open. Varian dengan valid_to = '9999-12-31' pada baris current membuat baris aktif selalu cocok tanpa perlakuan khusus.",
        "Validasi yang wajib ada: tidak ada dua baris current untuk satu pelanggan; tidak ada celah antar rentang (valid_to baris lama harus sama dengan valid_from baris baru); tidak ada tumpang tindih. Tiga cek ini murah dan menangkap hampir semua bug SCD sebelum sampai ke dashboard.",
      ],
      tasks: [],
      reference: "Join as-of: customer_id cocok dan valid_from <= tanggal transaksi < valid_to (half-open). Validasi: satu current, tanpa celah, tanpa tumpang tindih.",
    },
    {
      id: "lab-scd",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung baris tiap tipe SCD",
      prose: [
        "Lab ini menghitung berapa baris yang dihasilkan tiap tipe dari riwayat perubahan yang sama: 4 pelanggan dengan jumlah perubahan 2, 1, 0, dan 3.",
        "Hitung dulu di kepala. Type 1: satu baris per pelanggan, berapa pun perubahannya — 4 baris. Type 2: satu baris awal per pelanggan ditambah satu baris per perubahan — 4 ditambah 2 ditambah 1 ditambah 0 ditambah 3 sama dengan 10 baris. Baris aktif (current) selalu sama dengan jumlah pelanggan: 4.",
        "Tugas lab: tulis fungsi yang menerima jumlah pelanggan dan daftar jumlah perubahan, lalu mencetak tiga angka: rows_t1, rows_t2, dan baris_aktif.",
        "Setelah lolos, coba eksperimen: tambah satu pelanggan dengan 5 perubahan dan lihat Type 2 tumbuh menjadi 16 baris (10 + 1 baris awal + 5 perubahan) sementara Type 1 menjadi 5 baris (satu per pelanggan — bertambah satu karena pelanggannya bertambah satu) — itulah harga sejarah penuh, dan alasan memilih tipe per atribut.",
      ],
      tasks: [
        { id: "t1", text: "Hitung rows_t1: satu baris per pelanggan" },
        { id: "t2", text: "Hitung rows_t2: baris awal ditambah satu per perubahan" },
        { id: "t3", text: "Hitung baris_aktif: sama dengan jumlah pelanggan" },
      ],
      expected: "rows_t1=4\nrows_t2=10\nbaris_aktif=4",
      hints: [
        "Type 1: jumlah pelanggan, berapa pun perubahannya.",
        "Type 2: jumlah pelanggan ditambah total seluruh perubahan.",
        "Baris aktif selalu sama dengan jumlah pelanggan.",
      ],
      code: {
        starter: `# Riwayat perubahan alamat: 4 pelanggan, perubahan per pelanggan.\njumlah_pelanggan = 4\nperubahan = [2, 1, 0, 3]\n\n# TULIS KODEMU: hitung rows_t1, rows_t2, baris_aktif.\n# Cetak, per baris: rows_t1, rows_t2, baris_aktif.\n\n\nmesin_scd(jumlah_pelanggan, perubahan)`,
        lockLines: 5,
        solution: `# Riwayat perubahan alamat: 4 pelanggan, perubahan per pelanggan.\njumlah_pelanggan = 4\nperubahan = [2, 1, 0, 3]\n\n\ndef mesin_scd(jumlah_pelanggan, perubahan):\n    rows_t1 = jumlah_pelanggan\n    rows_t2 = jumlah_pelanggan + sum(perubahan)\n    baris_aktif = jumlah_pelanggan\n    print(f"rows_t1={rows_t1}")\n    print(f"rows_t2={rows_t2}")\n    print(f"baris_aktif={baris_aktif}")\n\n\nmesin_scd(jumlah_pelanggan, perubahan)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "rows_t1=4", label: "Type 1: 4 baris", msg: "Satu baris per pelanggan, berapa pun perubahannya." },
          { kind: "stdout_matches", task: "t2", pattern: "rows_t2=10", label: "Type 2: 10 baris", msg: "4 + 2 + 1 + 0 + 3 = 10. Satu baris awal per pelanggan ditambah satu per perubahan." },
          { kind: "stdout_matches", task: "t3", pattern: "baris_aktif=4", label: "Baris aktif: 4", msg: "Baris current selalu sama dengan jumlah pelanggan." },
        ],
      },
      reference: "Type 1: 4 baris. Type 2: 10 baris. Baris aktif: 4.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: laporan Januari yang berubah di bulan Juli",
      prose: [
        "Kembali ke KirimCepat. Finance membuka laporan Januari di bulan Juli dan revenue Jakarta turun — karena Andi pindah ke Surabaya dan pipeline Type 1 menimpa alamatnya. Laporan yang sama, dibuka dua kali, memberi dua jawaban. Kepercayaan ke data runtuh bukan karena angkanya salah, melainkan karena angkanya tidak stabil.",
        "Perbaikan: kolom kota di dimensi pelanggan diubah ke Type 2. Andi kini punya tiga baris dengan rentang berlaku. Laporan Januari di-join as-of: transaksi Februari memakai baris Jakarta. Laporan Januari yang dibuka di bulan Juli memberi angka yang sama seperti saat pertama dibuat.",
        "Keputusan rapat: kota dan segmen memakai Type 2; nama panggilan dan nomor telepon memakai Type 1. Alasannya ditulis di kontrak data dimensi — supaya engineer berikutnya tidak menimpa kota demi menghemat baris.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini bertahan. Pertama, tipe dipilih per atribut berdasarkan kebutuhan laporan, bukan selera. Kedua, join as-of ditulis sekali sebagai view, bukan diulang di tiap query analis. Ketiga, tiga cek validasi (satu current, tanpa celah, tanpa tumpang tindih) masuk ke pipeline quality gate.",
      },
      reference: "Kota dan segmen: Type 2. Nama panggilan dan telepon: Type 1. Laporan historis stabil setelah perbaikan.",
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
        "Type 1 menimpa (sejarah hilang), Type 2 menambah baris (sejarah penuh), Type 3 menambah kolom (satu langkah ke belakang).",
        "Lab: 4 pelanggan, 6 perubahan — Type 1: 4 baris, Type 2: 10 baris, baris aktif: 4.",
        "Join Type 2 wajib as-of: customer_id cocok dan valid_from <= tanggal transaksi < valid_to (half-open).",
        "Tipe dipilih per atribut, bukan per tabel.",
        "Validasi: satu current, tanpa celah, tanpa tumpang tindih.",
      ],
      next: { label: "DE32 — Framework Keputusan Arsitektur: Memilih Stack dengan Skor, Bukan Selera", href: "/v2/learn/de32-framework-keputusan-arsitektur" },
      quiz: [
        {
          q: "4 pelanggan dengan perubahan 2, 1, 0, dan 3. Berapa baris Type 1 dan Type 2?",
          options: [
            { text: "Type 1: 4, Type 2: 10", why: "Tepat: Type 1 satu baris per pelanggan (4); Type 2 = 4 + 2 + 1 + 0 + 3 = 10.", correct: true },
            { text: "Type 1: 6, Type 2: 10 — Type 1 menghitung perubahan juga", why: "Salah: Type 1 menimpa — jumlah barisnya tetap jumlah pelanggan, berapa pun perubahannya." },
            { text: "Type 1: 4, Type 2: 6 — Type 2 hanya menghitung perubahan", why: "Salah: Type 2 menghitung baris awal per pelanggan DITAMBAH perubahan: 4 + 6 = 10, bukan 6." },
            { text: "Type 1: 10, Type 2: 4 — terbalik", why: "Salah: justru Type 2 yang tumbuh dengan perubahan; Type 1 yang tetap." },
          ],
        },
        {
          q: "Laporan historis berubah saat pelanggan pindah kota. Apa penyebab dan perbaikannya?",
          options: [
            { text: "Dashboard salah filter; perbaiki filternya", why: "Salah: filter tidak bisa mengembalikan sejarah yang sudah ditimpa di dimensi." },
            { text: "Pipeline menimpa alamat (Type 1); ubah kota ke Type 2 dengan join as-of", why: "Tepat: menimpa membuat sejarah ikut berubah; Type 2 plus join tanggal menstabilkan laporan historis.", correct: true },
            { text: "Gunakan Type 3 untuk semua atribut", why: "Salah: Type 3 hanya menyimpan satu langkah ke belakang — pindahan ketiga tetap menimpa pindahan kedua." },
            { text: "Hapus baris pelanggan lama dan buat ulang", why: "Salah: menghapus baris memutus join fact historis — laporan justru kehilangan revenue." },
          ],
        },
        {
          q: "Join fact ke dimensi Type 2 yang benar memakai kondisi apa?",
          options: [
            { text: "customer_id saja — surrogate key tidak diperlukan", why: "Salah: customer_id sama di semua baris sejarah; tanpa kondisi tanggal, revenue terhitung berkali-kali." },
            { text: "Surrogate key saja, tanpa tanggal transaksi", why: "Salah: fact tidak menyimpan surrogate key yang berlaku saat itu — ia harus dicari lewat tanggal." },
            { text: "customer_id cocok dan valid_from <= tanggal transaksi < valid_to (interval half-open)", why: "Tepat: dua kondisi itu yang memilih tepat satu baris sejarah per transaksi — batas atas eksklusif supaya tanggal perubahan tidak cocok di dua baris.", correct: true },
            { text: "Join ke baris current saja untuk semua transaksi", why: "Salah: baris current adalah alamat hari ini — transaksi lama akan memakai alamat yang salah." },
          ],
        },
        {
          q: "Atribut mana yang paling tepat memakai Type 1?",
          options: [
            { text: "Kota pelanggan — karena sering berubah", why: "Salah: justru karena sering berubah DAN dipakai laporan historis, kota butuh Type 2." },
            { text: "Segmen pelanggan yang dipakai membandingkan kuartal lalu vs kini", why: "Salah: perbandingan antar waktu butuh sejarah — Type 2 atau Type 3, bukan Type 1." },
            { text: "Kategori produk untuk analisis tren tahunan", why: "Salah: tren tahunan butuh sejarah kategori — Type 1 akan menulis ulang sejarah." },
            { text: "Nama yang salah ketik dan perlu dikoreksi", why: "Tepat: koreksi kesalahan adalah kasus klasik Type 1 — sejarah yang salah tidak bernilai disimpan.", correct: true },
          ],
        },
        {
          q: "Validasi Type 2 mana yang menangkap bug paling berbahaya?",
          options: [
            { text: "Satu baris current per pelanggan, tanpa celah dan tanpa tumpang tindih antar rentang", why: "Tepat: dua current berarti join ambigu; celah berarti transaksi tanpa dimensi; tumpang tindih berarti ganda.", correct: true },
            { text: "Jumlah baris genap — baris harus selalu genap", why: "Salah: tidak ada aturan genap-ganjil pada baris dimensi." },
            { text: "Semua alamat harus kota besar", why: "Salah: validitas isi alamat adalah urusan quality, bukan struktur SCD." },
            { text: "valid_from selalu hari Senin", why: "Salah: tanggal perubahan mengikuti kejadian nyata, bukan hari kerja." },
          ],
        },
      ],
    },
  ],
};

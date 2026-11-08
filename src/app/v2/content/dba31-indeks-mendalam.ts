import type { V2Lesson } from "../lib/types";

export const dba31: V2Lesson = {
  slug: "dba31-indeks-mendalam",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA31 — Indeks Mendalam: Jenis, Statistik, dan Maintenance",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Query yang kemarin 3 detik, hari ini 40 menit",
      prose: [
        "Laporan harian FinLog kemarin 3 detik, hari ini 40 menit — tanpa ada perubahan kode. DBA membuka rencana eksekusi: planner memilih sequential scan. Indeksnya masih ada. Yang berubah: statistik. Tabel tumbuh 5 juta baris dalam seminggu, tetapi ANALYZE terakhir jalan 9 hari lalu — planner mengira tabel itu kecil dan memilih scan penuh.",
        "Di audit yang sama, DBA menemukan 4 dari 12 indeks tidak pernah dipakai planner sama sekali (idx_scan sama dengan 0). Empat indeks itu tidak membantu satu query pun — tetapi tiap INSERT membayar pajak tulisnya.",
        "Lesson ini mengajarkan indeks secara mendalam: jenis di luar B-tree, statistik sebagai kompas planner, dan maintenance sebagai pekerjaan rutin. Setelah lesson ini kamu bisa: (1) memilih jenis indeks dari pola query; (2) menjelaskan peran statistik; (3) mengaudit indeks tak terpakai; (4) menghitung pajak tulis dan fragmentasi; (5) menjadwalkan maintenance tanpa downtime.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DBA6 mengajarkan B-tree, GIN, GiST, dan BRIN beserta cara membaca EXPLAIN, dan DBA24 menyinggung indeks saat load. Lesson ini TIDAK mengulang pengantar itu: ia membangun lapisan operasionalnya — siklus hidup statistik, audit indeks tak terpakai dengan hitungan pajak tulis, fragmentasi dan REINDEX CONCURRENTLY, serta jadwal maintenance.",
      },
      reference: "12 indeks, 4 tak terpakai (33,3 persen); pajak tulis 4 dikali 2 ms sama dengan 8 ms per INSERT; ANALYZE terakhir 9 hari lalu, ambang basi 7 hari.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merawat indeks seperti merawat mesin: tahu kapan disetel, kapan dibersihkan, dan kapan dipensiunkan.",
        "(1) Memetakan pola query ke jenis indeks: B-tree, GIN, GiST, BRIN, hash;",
        "(2) Menjelaskan statistik: apa yang diukur ANALYZE dan kenapa basi menyesatkan planner;",
        "(3) Mengaudit indeks tak terpakai dari pg_stat_user_indexes;",
        "(4) Menghitung pajak tulis indeks dan fragmentasi;",
        "(5) Menjadwalkan REINDEX CONCURRENTLY dan ANALYZE tanpa downtime.",
      ],
      tasks: [],
    },
    {
      id: "jenis-statistik",
      eyebrow: "Langkah 3 · Teori",
      title: "Jenis indeks dan statistik sebagai kompas planner",
      prose: [
        "Pemilihan jenis dimulai dari pola query, bukan kebiasaan. B-tree untuk kesetaraan dan rentang pada kolom skalar. Hash untuk kesetaraan murni yang tidak butuh urutan. GIN untuk pencarian di dalam teks, JSONB, dan array. GiST untuk geometri dan kedekatan. BRIN untuk tabel raksasa yang terurut alami oleh waktu — beberapa MB melawan B-tree 100 GB. Indeks yang salah jenis bukan sekadar lambat: ia besar, mahal, dan tetap tidak dipakai planner.",
        "Statistik adalah kompas planner: ANALYZE mengukur distribusi nilai, jumlah baris, dan nilai paling umum, lalu planner memakai angka itu untuk memilih antara index scan dan sequential scan. Statistik basi berarti kompas menunjuk arah yang salah — tabel 5 juta baris dikira 50 ribu, planner memilih scan, dan laporan 3 detik menjadi 40 menit. Autovacuum menjalankan ANALYZE otomatis, tetapi ambangnya (20 persen perubahan baris) terlalu lambat untuk tabel yang tumbuh cepat: jadwalkan ANALYZE manual untuk tabel terpanas.",
        "Tanda statistik basi: rencana eksekusi berubah tanpa perubahan query atau indeks; estimasi baris planner meleset 10x dari aktual; query lambat muncul bertahap mengikuti pertumbuhan tabel. Diagnosisnya murah: bandingkan estimasi dan aktual di EXPLAIN ANALYZE, lalu jalankan ANALYZE dan lihat apakah rencana kembali normal.",
      ],
      tasks: [],
      note: {
        title: "Statistik bukan kebenaran, melainkan sampel",
        body: "ANALYZE mengambil sampel, bukan sensus penuh. Untuk tabel dengan distribusi miring (misalnya 1 persen pelanggan menyumbang 80 persen transaksi), sampel default bisa melewatkan ekornya. Naikkan statistics target untuk kolom yang miring — harga sedikit waktu ANALYZE untuk rencana yang jauh lebih akurat.",
      },
      reference: "Statistik basi: estimasi planner meleset 10x, rencana berubah tanpa perubahan query. Autovacuum 20 persen terlalu lambat untuk tabel terpanas.",
    },
    {
      id: "maintenance",
      eyebrow: "Langkah 4 · Teori",
      title: "Maintenance: audit tak terpakai, fragmentasi, REINDEX",
      prose: [
        "Audit indeks tak terpakai memakai pg_stat_user_indexes: indeks dengan idx_scan sama dengan 0 sejak statistik terakhir di-reset adalah kandidat pensiun. Di cerita pembuka, 4 dari 12 indeks tak terpakai — 33,3 persen. Tiap indeks tak terpakai membebani tiap INSERT: 4 indeks dikali 2 ms sama dengan 8 ms pajak tulis per baris. Pada 1 juta INSERT sehari, itu 8.000 detik — lebih dari 2 jam CPU per hari untuk indeks yang tidak pernah dibaca.",
        "Aturan pensiun: jangan DROP langsung. Nonaktifkan dulu dengan membuatnya invisible (bila didukung) atau pantau satu siklus bisnis penuh — bila tidak ada query yang mengeluh dan idx_scan tetap 0, barulah DROP. Indeks yang di-drop tergesa-gesa dan ternyata dipakai laporan kuartalan adalah insiden yang menunggu tanggalnya.",
        "Fragmentasi membuat halaman indeks berantakan setelah banyak UPDATE dan DELETE: baca menjadi lompatan acak. Perbaikannya REINDEX CONCURRENTLY — membangun indeks baru di samping yang lama tanpa memblokir tulis. REINDEX biasa lebih cepat tetapi mengunci tulis — di produksi, itu downtime. Jadwalkan maintenance di jam sepi, dan catat ukuran indeks sebelum dan sesudah sebagai bukti.",
      ],
      tasks: [],
      reference: "4 dari 12 tak terpakai (33,3 persen); pajak 8 ms per INSERT; 1 juta INSERT sehari sama dengan 8.000 detik CPU. REINDEX CONCURRENTLY tanpa blokir tulis.",
    },
    {
      id: "lab-indeks",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: audit indeks tak terpakai dan pajak tulis",
      prose: [
        "Lab ini menghitung audit indeks: berapa indeks tak terpakai, berapa persennya, dan berapa pajak tulis yang mereka bebankan per INSERT.",
        "Hitung dulu di kepala. Persen tak terpakai: 4 dibagi 12 dikali 100 sama dengan 33,3 persen. Pajak tulis: 4 indeks dikali 2 ms sama dengan 8 ms per INSERT. Beban harian: 8 ms dikali 1.000.000 INSERT sama dengan 8.000.000 ms, sama dengan 8.000 detik.",
        "Tugas lab: tulis fungsi yang menerima total indeks, indeks tak terpakai, pajak per indeks, dan INSERT harian — lalu mencetak tiga angka: persen_tak_terpakai, pajak_ms, beban_detik.",
        "Setelah lolos, coba eksperimen: ubah indeks tak terpakai menjadi 0 dan lihat pajak menjadi 0 — itulah nilai audit yang dilakukan tiap kuartal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung persen_tak_terpakai" },
        { id: "t2", text: "Hitung pajak_ms per INSERT" },
        { id: "t3", text: "Hitung beban_detik per hari" },
      ],
      expected: "persen_tak_terpakai=33.3\npajak_ms=8\nbeban_detik=8000",
      hints: [
        "Persen = tak terpakai dibagi total, dikali 100, bulatkan 1 desimal.",
        "Pajak = tak terpakai dikali pajak per indeks.",
        "Beban detik = pajak ms dikali INSERT harian, dibagi 1.000.",
      ],
      code: {
        starter: `# Audit indeks tabel transaksi FinLog.\ntotal_indeks = 12\ntak_terpakai = 4\npajak_per_indeks_ms = 2\ninsert_harian = 1000000\n\n# TULIS KODEMU: hitung persen_tak_terpakai, pajak_ms, beban_detik.\n# Cetak, per baris: persen_tak_terpakai, pajak_ms, beban_detik.\n\n\nmesin_audit(total_indeks, tak_terpakai, pajak_per_indeks_ms, insert_harian)`,
        lockLines: 5,
        solution: `# Audit indeks tabel transaksi FinLog.\ntotal_indeks = 12\ntak_terpakai = 4\npajak_per_indeks_ms = 2\ninsert_harian = 1000000\n\n\ndef mesin_audit(total_indeks, tak_terpakai, pajak_per_indeks_ms, insert_harian):\n    persen_tak_terpakai = round(tak_terpakai / total_indeks * 100, 1)\n    pajak_ms = tak_terpakai * pajak_per_indeks_ms\n    beban_detik = pajak_ms * insert_harian // 1000\n    print(f"persen_tak_terpakai={persen_tak_terpakai}")\n    print(f"pajak_ms={pajak_ms}")\n    print(f"beban_detik={beban_detik}")\n\n\nmesin_audit(total_indeks, tak_terpakai, pajak_per_indeks_ms, insert_harian)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "persen_tak_terpakai=33.3", label: "33,3 persen tak terpakai", msg: "4 / 12 x 100 = 33,3 persen. Sepertiga indeks tidak pernah dibaca." },
          { kind: "stdout_matches", task: "t2", pattern: "pajak_ms=8", label: "Pajak 8 ms per INSERT", msg: "4 indeks x 2 ms = 8 ms per baris yang ditulis." },
          { kind: "stdout_matches", task: "t3", pattern: "beban_detik=8000", label: "8.000 detik per hari", msg: "8 ms x 1.000.000 = 8.000 detik CPU per hari untuk indeks yang tidak dipakai." },
        ],
      },
      reference: "33,3 persen tak terpakai; pajak 8 ms per INSERT; beban 8.000 detik per hari.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: laporan 40 menit yang sembuh dengan ANALYZE",
      prose: [
        "Kembali ke FinLog. Diagnosis memakan 15 menit: EXPLAIN ANALYZE menunjukkan estimasi 50 ribu baris melawan aktual 5 juta — statistik basi 9 hari. ANALYZE dijalankan manual: 4 menit. Rencana kembali ke index scan, laporan kembali 3 detik.",
        "Perbaikan permanennya tiga lapis. Satu: ANALYZE terjadwal tiap malam untuk 10 tabel terpanas — tidak menunggu ambang autovacuum 20 persen. Dua: audit indeks tak terpakai tiap kuartal; 4 indeks dipensiunkan setelah satu siklus bisnis tanpa keluhan, menghemat 8.000 detik CPU per hari. Tiga: REINDEX CONCURRENTLY tiap bulan untuk tabel dengan UPDATE berat.",
        "Keputusan rapat: statistik dan indeks masuk dashboard monitoring DBA — bukan hanya CPU dan disk. Query yang melambat bertahap kini memicu alert sebelum direksi yang menelepon.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini bertahan. Pertama, diagnosis dari selisih estimasi vs aktual — bukan dari tebakan. Kedua, perbaikan permanen berupa jadwal, bukan sekali jalan. Ketiga, pensiun indeks bertahap dengan masa pantau — bukan DROP langsung.",
      },
      reference: "ANALYZE 4 menit mengembalikan laporan 3 detik. Pensiun 4 indeks menghemat 8.000 detik CPU per hari.",
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
        "Lab: 33,3 persen indeks tak terpakai; pajak 8 ms per INSERT; beban 8.000 detik per hari.",
        "Statistik basi menyesatkan planner — estimasi meleset 10x, rencana berubah tanpa perubahan query.",
        "Jenis indeks dipilih dari pola query, bukan kebiasaan.",
        "Pensiun indeks bertahap: pantau satu siklus bisnis, baru DROP.",
        "REINDEX CONCURRENTLY tanpa blokir tulis; REINDEX biasa berarti downtime.",
      ],
      next: { label: "DBA32 — Operasional NoSQL: Replikasi dan Sharding MongoDB, Admin Cassandra", href: "/v2/learn/dba32-operasional-nosql" },
      quiz: [
        {
          q: "12 indeks, 4 tak terpakai, pajak 2 ms per indeks. Berapa persen tak terpakai dan pajak per INSERT?",
          options: [
            { text: "25 persen dan 8 ms", why: "Salah: 4 / 12 = 33,3 persen, bukan 25 persen." },
            { text: "33,3 persen dan 2 ms", why: "Salah: 2 ms adalah pajak satu indeks; empat indeks berarti 8 ms." },
            { text: "33,3 persen dan 8 ms", why: "Tepat: 4 / 12 = 33,3 persen; 4 x 2 ms = 8 ms per INSERT.", correct: true },
            { text: "4 persen dan 24 ms", why: "Salah: 4 adalah jumlah indeks, bukan persen; 24 ms tidak ada dasarnya." },
          ],
        },
        {
          q: "Laporan melambat bertahap tanpa perubahan query. Diagnosis pertama yang benar?",
          options: [
            { text: "Tambah indeks baru sebanyak-banyaknya", why: "Salah: menambah indeks tanpa diagnosis menambah pajak tulis dan belum tentu dipakai planner." },
            { text: "Restart database — biasanya sembuh", why: "Salah: restart tidak memperbarui statistik; masalah kembali saat tabel tumbuh lagi." },
            { text: "Naikkan memori server", why: "Salah: memori tidak memperbaiki kompas planner yang salah arah." },
            { text: "Bandingkan estimasi planner dengan aktual di EXPLAIN ANALYZE — curigai statistik basi", why: "Tepat: estimasi meleset jauh dari aktual adalah tanda klasik statistik basi.", correct: true },
          ],
        },
        {
          q: "Indeks dengan idx_scan 0 selama satu kuartal. Tindakan yang benar?",
          options: [
            { text: "Nonaktifkan atau pantau satu siklus bisnis penuh, baru DROP bila tetap 0", why: "Tepat: masa pantau menutup risiko pemakaian musiman sebelum pensiun permanen.", correct: true },
            { text: "DROP langsung — tidak dipakai berarti tidak berguna", why: "Salah: laporan kuartalan atau tahunan bisa memakainya; DROP tergesa-gesa adalah insiden yang menunggu tanggal." },
            { text: "Biarkan selamanya — indeks tak terpakai tidak merugikan", why: "Salah: tiap INSERT membayar pajak tulisnya; 4 indeks berarti 8.000 detik CPU per hari." },
            { text: "Buat duplikatnya dengan nama lain", why: "Salah: duplikat menggandakan pajak tanpa manfaat apa pun." },
          ],
        },
        {
          q: "Kenapa REINDEX CONCURRENTLY dipilih di produksi?",
          options: [
            { text: "Ia lebih cepat dari REINDEX biasa", why: "Salah: ia justru lebih lambat — kelebihannya bukan kecepatan." },
            { text: "Ia membangun indeks baru di samping yang lama tanpa memblokir tulis", why: "Tepat: tanpa blokir tulis berarti tanpa downtime; REINDEX biasa mengunci tulis.", correct: true },
            { text: "Ia tidak butuh ruang disk tambahan", why: "Salah: ia butuh ruang untuk indeks baru selama pembangunan." },
            { text: "Ia memperbaiki data yang korup otomatis", why: "Salah: REINDEX membangun ulang struktur indeks; korupsi data adalah masalah lain." },
          ],
        },
        {
          q: "Tabel mana yang paling cocok memakai BRIN?",
          options: [
            { text: "Tabel kecil 10 ribu baris dengan query acak", why: "Salah: BRIN butuh tabel raksasa yang terurut alami; tabel kecil cukup B-tree." },
            { text: "Tabel dengan pencarian kata di dalam kolom teks", why: "Salah: itu kasus GIN (full-text search), bukan BRIN." },
            { text: "Tabel time-series 5 miliar baris yang terurut oleh created_at", why: "Tepat: BRIN hanya menyimpan min-max per blok — beberapa MB melawan B-tree 100 GB.", correct: true },
            { text: "Tabel dengan query kesetaraan tanpa urutan", why: "Salah: itu kasus hash atau B-tree, bukan BRIN." },
          ],
        },
      ],
    },
  ],
};

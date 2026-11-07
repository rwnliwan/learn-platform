import type { V2Lesson } from "../lib/types";

export const dba26: V2Lesson = {
  slug: "dba26-normalisasi-dba",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA26 — Normalisasi dari Kursi DBA: BCNF, Review Skema, dan Denormalisasi Operasional",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Review skema yang ditolak: satu kolom, 237 sel redundan",
      prose: [
        "Tim produk BelanjaYuk mengajukan perubahan skema: tabel penugasan_dosen untuk fitur jadwal kuliah mitra kampus. Satu tabel, tiga kolom: mahasiswa, mata_kuliah, dosen. Kelihatannya polos — sampai DBA yang me-review bertanya satu kalimat: dosen ini mengajar berapa mata kuliah?",
        "Jawabannya: satu dosen mengajar tepat satu mata kuliah, selamanya. Artinya mata_kuliah ditentukan sepenuhnya oleh dosen — dan tabel itu menyimpan mata_kuliah yang sama di setiap baris mahasiswa yang diajar dosen itu. Dengan 120 mahasiswa dan 3 dosen, tabel berisi 240 baris, dan 237 sel mata_kuliah di antaranya adalah salinan dari tiga fakta yang sama.",
        "Lesson ini mengajarkan normalisasi dari kursi DBA: bukan sebagai teori ujian, melainkan sebagai alat review skema sebelum DDL menyentuh produksi. Setelah lesson ini kamu bisa: (1) membaca functional dependency dari sebuah skema dan menentukan kunci kandidatnya; (2) membedakan 3NF dan BCNF — dan tahu kapan 3NF saja tidak cukup; (3) menjalankan checklist review skema sebelum menyetujui perubahan; (4) memutuskan denormalisasi secara operasional, dengan hitungan biaya tulisnya, bukan dengan perasaan.",
      ],
      tasks: [],
      note: {
        title: "Hubungan dengan DM2",
        body: "DM2 sudah mengajarkan 1NF sampai 3NF, tiga anomali, dan denormalisasi terkontrol dari sudut data management. Lesson ini TIDAK mengulang DM2: ia mulai dari tempat DM2 berhenti — bentuk normal BCNF yang belum pernah dibahas, review skema sebagai gerbang produksi, dan denormalisasi sebagai keputusan operasional DBA dengan biaya tulis yang dihitung.",
      },
      reference: "DBA me-review skema sebelum DDL ke produksi. BCNF: setiap penentu harus kunci.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa me-review sebuah skema seperti DBA produksi, bukan seperti mahasiswa ujian.",
        "(1) Menulis functional dependency dari skema nyata dan menemukan semua kunci kandidat;",
        "(2) Menguji apakah sebuah skema memenuhi BCNF — dan mendekomposisi yang melanggar;",
        "(3) Menjalankan checklist review skema: kunci, dependensi, anomali, dan jejak audit perubahan;",
        "(4) Menghitung biaya denormalisasi (fan-out tulis dan rebuild snapshot) sebelum menyetujuinya.",
      ],
      tasks: [],
    },
    {
      id: "dependensi",
      eyebrow: "Langkah 3 · Teori",
      title: "Functional dependency: membaca skema seperti DBA",
      prose: [
        "Functional dependency, disingkat FD, adalah pernyataan: bila dua baris sama di kolom X, maka keduanya sama juga di kolom Y. Ditulis X menentukan Y. FD adalah fakta bisnis, bukan fakta teknis — ia datang dari aturan dunia nyata, dan DBA menemukannya dengan bertanya ke pemilik proses, bukan dengan menebak dari data contoh.",
        "Contoh pertama: tabel order_detail di BelanjaYuk dengan kolom order_id, produk_id, nama_produk, kategori_produk, gudang_id, alamat_gudang. FD yang berlaku: produk_id menentukan nama_produk dan kategori_produk — satu produk punya satu nama dan satu kategori. gudang_id menentukan alamat_gudang — satu gudang punya satu alamat. Kunci tabel ini adalah pasangan order_id dan produk_id: keduanya bersama-sama menentukan satu baris.",
        "Dari FD, pelanggaran bentuk normal terbaca langsung. nama_produk bergantung pada produk_id — hanya separuh kunci. Itu pelanggaran 2NF, persis seperti contoh tabel nilai mahasiswa di DM2: kolom deskriptif yang menempel pada separuh composite key. alamat_gudang bergantung pada gudang_id, yang bukan kunci dan bukan bagian kunci — ketergantungan transitif lewat gudang_id. Itu pelanggaran 3NF: alamat gudang sebenarnya milik tabel gudang, bukan tabel order.",
        "Anomali yang ditimbulkan bukan teori. Bila nama produk berubah, DBA harus mengubahnya di ribuan baris order_detail — dan satu baris yang terlewat membuat laporan memakai dua nama untuk produk yang sama. Bila sebuah gudang belum pernah dipakai order mana pun, alamatnya tidak bisa disimpan — anomali sisip. Bila satu-satunya order dari sebuah gudang dihapus, alamat gudang itu ikut hilang — anomali hapus. Tiga anomali DM2, dibaca dari FD.",
      ],
      tasks: [],
      note: {
        title: "FD tidak bisa ditebak dari data",
        body: "Data contoh yang ada hari ini mungkin tidak menunjukkan pelanggaran — kebetulan semua dosen mengajar satu mata kuliah di sampel kecil, atau semua produk punya satu gudang. FD adalah aturan yang BERLAKU, bukan pola yang TERAMATI. Tanyakan aturannya ke pemilik bisnis; jangan simpulkan dari 100 baris contoh.",
      },
      reference: "FD: X menentukan Y adalah fakta bisnis. Kunci = kolom yang menentukan seluruh baris.",
    },
    {
      id: "bcnf",
      eyebrow: "Langkah 4 · Teori",
      title: "BCNF: saat 3NF ternyata belum cukup",
      prose: [
        "Kembali ke tabel penugasan_dosen dari cerita pembuka: kolom mahasiswa, mata_kuliah, dosen. FD yang berlaku: pasangan mahasiswa dan mata_kuliah menentukan dosen — satu mahasiswa mengambil satu mata kuliah dari satu dosen. Dan dosen menentukan mata_kuliah — satu dosen mengajar tepat satu mata kuliah.",
        "Kunci kandidatnya ada dua: pasangan mahasiswa dan mata_kuliah, serta pasangan mahasiswa dan dosen. Keduanya menentukan seluruh baris. Sekarang uji 3NF: aturan 3NF melarang atribut non-prima bergantung transitif pada kunci. Di sini setiap atribut adalah bagian dari suatu kunci — mahasiswa, mata_kuliah, dan dosen semuanya prima. Tidak ada atribut non-prima sama sekali, jadi 3NF terpenuhi secara otomatis.",
        "Tapi BCNF lebih ketat: BCNF menuntut setiap penentu (determinan) adalah superkey — himpunan kolom yang menentukan seluruh baris. dosen menentukan mata_kuliah, tetapi dosen sendiri BUKAN superkey: satu dosen mengajar banyak mahasiswa, jadi dosen saja tidak menentukan satu baris. BCNF dilanggar, padahal 3NF lolos. Inilah celah yang hanya BCNF yang menangkap: dependensi dari penentu yang bukan kunci, menuju atribut prima.",
        "Anomalinya nyata. Tabel berisi 240 baris untuk 120 mahasiswa dan 3 dosen — tiap dosen muncul 80 kali, dan mata_kuliah yang sama ditulis 80 kali per dosen. Sel redundan: 240 baris dikurangi 3 fakta dosen-mata-kuliah sama dengan 237 sel yang hanya salinan. Bila Bu Ratna pindah dari Statistika ke Akuntansi, 80 baris harus diubah — dan satu baris yang terlewat berarti satu mahasiswa tercatat di mata kuliah yang salah. Dekomposisi BCNF memecahnya menjadi dua tabel: dosen_mata_kuliah (dosen, mata_kuliah) dengan 3 baris, dan mahasiswa_dosen (mahasiswa, dosen) dengan 240 baris tanpa redundansi. Perubahan mata kuliah Bu Ratna kini satu baris, bukan delapan puluh.",
        "Kapan BCNF penting di produksi? Setiap kali satu kolom menentukan kolom lain tetapi bukan kunci: kode pos menentukan kota, nomor polisi menentukan pemilik lama, kode mata kuliah menentukan dosen pengampu. Pola ini lolos 3NF bila kolom tujuannya prima — dan hanya review BCNF yang menangkapnya sebelum skema masuk produksi.",
      ],
      tasks: [],
      note: {
        title: "Dekomposisi yang aman",
        body: "Dekomposisi BCNF di atas lossless: gabungkan kedua tabel lewat kolom dosen dan kamu mendapat kembali tepat 240 baris asal, tanpa baris palsu. Aturan praktisnya: dekomposisi berdasarkan FD yang melanggar — satu tabel untuk FD itu sendiri (dosen, mata_kuliah), satu tabel untuk sisanya dengan penentunya (mahasiswa, dosen). Bila join-nya menghasilkan baris yang tidak pernah ada, dekomposisinya salah.",
      },
      reference: "BCNF: setiap penentu harus superkey. 3NF bisa lolos saat penentu menuju atribut prima.",
    },
    {
      id: "lab-redundansi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: kalkulator redundansi dan fan-out denormalisasi",
      prose: [
        "Lab ini membangun kalkulator kecil yang dipakai DBA saat review skema: dari tabel penugasan, hitung sel redundan dan baris yang harus diubah bila satu dosen pindah mata kuliah — lalu hitung biaya tulis denormalisasi di sisi lain keputusan.",
        "Hitung dulu di kepala. Tabel: 240 baris, 3 dosen. Sel redundan mata_kuliah = 240 dikurangi 3 sama dengan 237. Persentase redundan = 237 dibagi 240 dikali 100 sama dengan 98,75 persen — hampir seluruh kolom adalah salinan. Baris yang harus diubah bila satu dosen pindah mata kuliah = 240 dibagi 3 sama dengan 80 baris.",
        "Sisi denormalisasi: tim produk mengusulkan tabel baca terdenormalisasi berisi snapshot nama produk untuk mempercepat halaman pesanan. Setiap update satu produk harus ditulis ulang ke 12.000 baris snapshot. Update produk 500 kali per hari berarti 500 dikali 12.000 sama dengan 6.000.000 tulis tambahan per hari — harga yang dibayar untuk baca yang cepat.",
        "Tugas lab: tulis fungsi yang menerima jumlah baris, jumlah dosen, update produk per hari, dan fan-out snapshot — lalu mencetak lima angka: baris, sel redundan, persen redundan, baris yang diubah per pindah dosen, dan tulis tambahan per hari. Fungsi ini adalah alat review: angka yang keluar menentukan apakah skema disetujui, dikembalikan, atau disetujui dengan syarat.",
        "Setelah lolos, coba eksperimen: ubah jumlah dosen menjadi 12 (tiap dosen mengajar 20 mahasiswa) dan lihat sel redundan turun menjadi 228 — lalu tanyakan: apakah redundansi yang lebih kecil membuat skema itu boleh lolos? Jawabannya ada di langkah berikutnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung sel redundan dan persen redundan dari jumlah baris dan jumlah dosen" },
        { id: "t2", text: "Hitung baris yang harus diubah bila satu dosen pindah mata kuliah" },
        { id: "t3", text: "Hitung tulis tambahan per hari dari update produk dan fan-out snapshot" },
      ],
      expected: "baris=240\nsel_redundan=237\nredundan_persen=98.75\nbaris_diubah=80\ntulis_tambahan=6000000",
      hints: [
        "Sel redundan = jumlah baris dikurangi jumlah dosen (satu fakta per dosen).",
        "Persen redundan = sel redundan dibagi jumlah baris, dikali 100.",
        "Baris diubah per dosen = jumlah baris dibagi jumlah dosen.",
        "Tulis tambahan = update per hari dikali fan-out snapshot per produk.",
      ],
      code: {
        starter: `# Data review skema: tabel penugasan_dosen + rencana denormalisasi snapshot.\nbaris = 240\njumlah_dosen = 3\nupdate_produk_per_hari = 500\nfanout_snapshot = 12000\n\n# TULIS KODEMU: hitung lima angka review di bawah ini.\n# Cetak, per baris: baris, sel_redundan, redundan_persen,\n# baris_diubah, tulis_tambahan.\n\n\nkalkulator_review(baris, jumlah_dosen, update_produk_per_hari, fanout_snapshot)`,
        lockLines: 6,
        solution: `# Data review skema: tabel penugasan_dosen + rencana denormalisasi snapshot.\nbaris = 240\njumlah_dosen = 3\nupdate_produk_per_hari = 500\nfanout_snapshot = 12000\n\n\ndef kalkulator_review(baris, jumlah_dosen, update_produk_per_hari, fanout_snapshot):\n    sel_redundan = baris - jumlah_dosen\n    redundan_persen = sel_redundan / baris * 100\n    baris_diubah = baris // jumlah_dosen\n    tulis_tambahan = update_produk_per_hari * fanout_snapshot\n    print(f"baris={baris}")\n    print(f"sel_redundan={sel_redundan}")\n    print(f"redundan_persen={redundan_persen}")\n    print(f"baris_diubah={baris_diubah}")\n    print(f"tulis_tambahan={tulis_tambahan}")\n\n\nkalkulator_review(baris, jumlah_dosen, update_produk_per_hari, fanout_snapshot)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "sel_redundan=237", label: "Sel redundan 237", msg: "Sel redundan = 240 - 3 = 237. Satu fakta mata_kuliah per dosen; sisanya salinan." },
          { kind: "stdout_matches", task: "t1", pattern: "redundan_persen=98.75", label: "Redundan 98,75 persen", msg: "237 / 240 x 100 = 98,75. Hampir seluruh kolom adalah salinan." },
          { kind: "stdout_matches", task: "t2", pattern: "baris_diubah=80", label: "Baris diubah 80", msg: "240 / 3 = 80 baris per dosen. Satu baris terlewat = satu mahasiswa salah mata kuliah." },
          { kind: "stdout_matches", task: "t3", pattern: "tulis_tambahan=6000000", label: "Tulis tambahan 6.000.000 per hari", msg: "500 x 12.000 = 6.000.000. Itulah harga denormalisasi snapshot." },
        ],
      },
      reference: "240 baris, 237 sel redundan (98,75 persen); pindah dosen = 80 baris; denormalisasi = 6.000.000 tulis tambahan per hari.",
    },
    {
      id: "review-denorm",
      eyebrow: "Langkah 6 · Teori",
      title: "Checklist review skema dan denormalisasi operasional",
      prose: [
        "Checklist review skema DBA sebelum DDL disetujui. Pertama: tulis semua FD dan semua kunci kandidat — bila pengaju tidak bisa menulis FD-nya, skema belum siap di-review. Kedua: uji 3NF, lalu uji BCNF — penentu yang bukan superkey adalah penolakan atau syarat perbaikan. Ketiga: hitung redundansi seperti lab di atas — di atas 90 persen redundan, minta dekomposisi. Keempat: tanyakan beban tulis versus baca — tabel yang ditulis 10 kali lebih sering daripada dibaca tidak boleh didenormalisasi. Kelima: pastikan setiap perubahan skema punya rollback — DDL yang tidak bisa dibatalkan tidak masuk produksi.",
        "Denormalisasi operasional adalah keputusan DBA, bukan keputusan produk semata. DM2 sudah mengajarkan tiga pola yang sah — kolom turunan, tabel baca terpisah, snapshot historis — dan satu aturan keras: denormalisasi hanya di hilir sumber kebenaran, tidak pernah di sumbernya. Dari kursi DBA, aturan itu diterjemahkan menjadi tiga pertanyaan yang harus dijawab dengan angka. Berapa fan-out tulisnya — 500 update dikali 12.000 snapshot sama dengan 6.000.000 tulis tambahan per hari, dan apakah replika sanggup? Berapa biaya rebuild-nya — snapshot yang di-rebuild 12 menit setiap jam berarti 288 menit, sama dengan 4,8 jam komputasi per hari. Dan siapa pemilik sinkronisasinya — satu pipeline bernama, dengan jadwal dan monitoring, atau tidak ada?",
        "Bila satu pertanyaan tidak terjawab, jawabannya adalah tidak — atau ya dengan syarat: denormalisasi diizinkan di tabel baca, dengan job rebuild bernama, alert bila rebuild gagal dua kali berturut-turut, dan tanggal review ulang 30 hari. DBA yang menyetujui denormalisasi tanpa pemilik sinkronisasi sedang menyetujui inkonsistensi yang dilembagakan — dan enam bulan kemudian tidak ada yang tahu mana angka yang benar.",
        "Satu catatan terakhir: normalisasi bukan agama. Tabel konfigurasi kecil yang dibaca 1.000 kali sehari dan diubah dua kali setahun boleh saja menyimpan redundansi — biaya anomalinya nyaris nol. Yang DBA tolak adalah redundansi di tabel transaksi besar dengan tulis tinggi, tempat satu update yang terlewat menjadi laporan yang salah dan keputusan yang salah.",
      ],
      tasks: [],
      note: {
        title: "Jebakan 'nanti saja'",
        type: "pitfall",
        body: "Skema yang lolos review dengan janji 'nanti dirapikan' hampir tidak pernah dirapikan — setelah data produksi masuk, migrasi perbaikan menjadi proyek berminggu-minggu. Perbaikan skema termurah adalah sebelum baris pertama ditulis. Itu sebabnya review skema adalah gerbang, bukan saran.",
      },
      reference: "Review: FD, kunci, 3NF, BCNF, redundansi, beban tulis lawan baca, rollback. Denormalisasi butuh pemilik sinkronisasi bernama.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: rapat review — denormalisasi alamat gudang",
      prose: [
        "Tim produk mengusulkan: simpan alamat_gudang langsung di tabel order_detail supaya laporan pengiriman tidak perlu join ke tabel gudang. Alasannya kecepatan: laporan pengiriman dibaca 2 juta kali sebulan. FD-nya jelas: gudang_id menentukan alamat_gudang, dan gudang_id bukan kunci order_detail — pelanggaran 3NF yang sudah dikenal dari langkah 3.",
        "DBA menghitung. Gudang berpindah alamat rata-rata 40 kali setahun di seluruh jaringan — tiap pindah berarti update alamat di semua order_detail yang memakai gudang itu. Order_detail berisi 2,4 juta baris per bulan dan tidak pernah dihapus — satu pindah gudang menyentuh puluhan ribu baris historis, dan satu baris yang terlewat membuat satu pengiriman dikirim ke alamat lama. Alternatif DBA: materialized view laporan pengiriman yang di-rebuild tiap jam dari sumber kebenaran — join dibayar sekali per jam, bukan sekali per baca, dan alamat selalu benar.",
        "Keputusan rapat: usulan ditolak untuk tabel order_detail, disetujui sebagai materialized view dengan rebuild tiap jam dan pemilik bernama. Kecepatan laporan didapat, anomali tidak masuk ke tabel transaksi. Itulah review skema yang bekerja: bukan berkata tidak pada kecepatan, melainkan berkata tidak pada tempat yang salah untuk kecepatan itu.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, FD dibaca dulu — pelanggaran 3NF dikenali sebelum angka dibahas. Kedua, biaya dihitung dalam baris yang harus diubah, bukan dalam perasaan. Ketiga, kebutuhan kecepatan dipenuhi di lapisan baca (materialized view), bukan di sumber kebenaran. DBA yang baik tidak memblokir produk; ia memindahkan kecepatan ke tempat yang aman.",
      },
      reference: "Denormalisasi alamat gudang ditolak di order_detail, disetujui sebagai materialized view per jam.",
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
        "FD adalah fakta bisnis: X menentukan Y. Kunci = kolom yang menentukan seluruh baris.",
        "3NF bisa lolos saat penentu menuju atribut prima — BCNF menangkapnya: setiap penentu harus superkey.",
        "Lab: 240 baris, 237 sel redundan (98,75 persen); pindah dosen = 80 baris; denormalisasi = 6.000.000 tulis tambahan per hari.",
        "Review skema: FD, kunci, 3NF, BCNF, redundansi, beban tulis lawan baca, rollback.",
        "Denormalisasi hanya di hilir sumber kebenaran, dengan pemilik sinkronisasi bernama dan tanggal review ulang.",
      ],
      next: { label: "DBA27 — Administrasi MySQL: InnoDB, Buffer Pool, dan Replikasi", href: "/v2/learn/dba27-administrasi-mysql" },
      quiz: [
        {
          q: "Tabel penugasan (mahasiswa, mata_kuliah, dosen) dengan FD dosen menentukan mata_kuliah. Kunci kandidatnya (mahasiswa, mata_kuliah) dan (mahasiswa, dosen). Apa statusnya?",
          options: [
            { text: "Memenuhi 3NF dan BCNF — semua atribut adalah kunci", why: "Salah: BCNF menuntut setiap penentu adalah superkey. Dosen menentukan mata_kuliah tetapi dosen bukan superkey." },
            { text: "Memenuhi 3NF tetapi melanggar BCNF — dosen menentukan mata_kuliah padahal dosen bukan superkey", why: "Tepat: semua atribut prima sehingga 3NF lolos otomatis, tetapi BCNF gagal karena penentunya bukan superkey.", correct: true },
            { text: "Melanggar 1NF — ada kolom yang menyimpan banyak nilai", why: "Salah: tiap sel berisi satu nilai atomik. Masalahnya bukan 1NF, melainkan dependensi penentu-bukan-kunci." },
            { text: "Melanggar 2NF — mata_kuliah bergantung pada separuh kunci", why: "Salah: mata_kuliah bergantung pada dosen, bukan pada separuh kunci (mahasiswa, mata_kuliah). Ini soal BCNF, bukan 2NF." },
          ],
        },
        {
          q: "Dalam review skema, pengaju tidak bisa menulis functional dependency untuk tabel barunya. Apa langkah DBA yang benar?",
          options: [
            { text: "Setujui dulu, FD bisa dilengkapi setelah masuk produksi", why: "Salah: tanpa FD, tidak ada cara menguji bentuk normal. Skema yang masuk produksi tanpa FD hampir tidak pernah diperbaiki." },
            { text: "Kembalikan — skema belum siap di-review sampai FD-nya ditulis", why: "Tepat: FD adalah syarat masuk review. Tanpa FD, checklist 3NF dan BCNF tidak bisa dijalankan.", correct: true },
            { text: "Tebak FD dari 100 baris data contoh yang ada", why: "Salah: FD adalah aturan yang berlaku, bukan pola yang teramati. Data contoh bisa menyembunyikan pelanggaran." },
            { text: "Minta tim produk mengganti nama tabelnya saja", why: "Salah: nama tabel tidak ada hubungannya dengan dependensi. Itu kosmetik, bukan review." },
          ],
        },
        {
          q: "Lab menghitung 237 sel redundan dari 240 baris (98,75 persen). Apa arti angka itu bagi DBA?",
          options: [
            { text: "Kolom itu hampir seluruhnya salinan dari tiga fakta — dekomposisi hampir pasti lebih murah daripada anomali", why: "Tepat: 98,75 persen redundan berarti satu update yang terlewat hampir pasti terjadi. Dekomposisi memindahkan perubahan ke satu baris.", correct: true },
            { text: "Tabel itu efisien — redundansi tinggi berarti baca cepat", why: "Salah: redundansi memang bisa mempercepat baca, tetapi di tabel transaksi ia membeli kecepatan dengan anomali update. Baca cepat ada tempatnya: lapisan baca." },
            { text: "Angka itu tidak berarti apa-apa tanpa tahu ukuran disk", why: "Salah: redundansi adalah soal kebenaran, bukan soal disk. 237 sel salinan berarti 237 peluang inkonsistensi, berapa pun ukuran disknya." },
            { text: "Tabel itu memenuhi BCNF karena redundansinya terukur", why: "Salah: terukur bukan berarti memenuhi. Justru hitungan inilah yang membuktikan pelanggaran BCNF berdampak nyata." },
          ],
        },
        {
          q: "Denormalisasi snapshot diusulkan: 500 update produk per hari, tiap update menulis ulang 12.000 baris snapshot. Apa yang harus ditanyakan DBA sebelum menyetujui?",
          options: [
            { text: "Hanya apakah halaman menjadi lebih cepat — itu satu-satunya yang penting", why: "Salah: kecepatan baca adalah setengah cerita. 6.000.000 tulis tambahan per hari membebani replika dan memperbesar lag." },
            { text: "Fan-out tulis, biaya rebuild, dan siapa pemilik sinkronisasi bernama", why: "Tepat: ketiganya harus dijawab dengan angka dan nama. Tanpa pemilik sinkronisasi, itu duplikasi liar, bukan denormalisasi terkontrol.", correct: true },
            { text: "Apakah tim produk sudah mencoba dan merasa puas", why: "Salah: perasaan bukan metrik review. DBA memutuskan dari angka fan-out dan beban replika." },
            { text: "Berapa warna tema dashboard yang akan dipakai snapshot itu", why: "Salah: itu tidak relevan dengan kebenaran data. Review skema menilai dependensi dan biaya, bukan tampilan." },
          ],
        },
        {
          q: "Tim produk minta alamat gudang disimpan di order_detail agar laporan tidak join. Apa keputusan DBA yang benar?",
          options: [
            { text: "Setujui — join memang harus dihindari di tabel mana pun", why: "Salah: join dihindari di lapisan baca, bukan dengan merusak sumber kebenaran. Ini pelanggaran 3NF di tabel transaksi." },
            { text: "Tolak di order_detail, setujui sebagai materialized view per jam dari sumber kebenaran", why: "Tepat: kecepatan didapat di lapisan baca, anomali tidak masuk ke tabel transaksi. Join dibayar sekali per jam.", correct: true },
            { text: "Setujui dengan syarat alamat gudang tidak pernah berubah", why: "Salah: alamat gudang berubah 40 kali setahun. Syarat yang bertentangan dengan fakta bisnis bukan syarat." },
            { text: "Tolak sepenuhnya — laporan pengiriman tidak boleh cepat", why: "Salah: DBA tidak memblokir kecepatan; ia memindahkan kecepatan ke tempat yang aman." },
          ],
        },
      ],
    },
  ],
};

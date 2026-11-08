import type { V2Lesson } from "../lib/types";

export const bcd34: V2Lesson = {
  slug: "bcd34-cbdc",
  track: "Blockchain Data Scientist",
  module: "Kepatuhan & Regulasi",
  title: "BCD34 — CBDC: Uang Bank Sentral di Rel Digital",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rupiah digital: siapa yang melihat transaksimu?",
      prose: [
        "Bank sentral sebuah negara mengumumkan rupiah digital percontohan: 8,4 juta pengguna dari 70 juta penduduk dewasa sudah mencoba — adopsi 12 persen. Saldo yang beredar 60 triliun rupiah, 4 persen dari uang primer 1.500 triliun. Transaksi bulanan 240 triliun — uang itu berputar 4 kali sebulan. Angka-angkanya kecil, tetapi pertanyaannya besar: bila pembayaran pindah ke rel bank sentral, data siapa yang berubah?",
        "Bagi analis data, CBDC bukan sekadar 'uang digital' — ia adalah PERPINDAHAN PETA DATA. Hari ini aliran stablecoin antar-dompet terlihat di rantai publik oleh siapa pun. Bila aliran itu pindah ke rel CBDC yang tertutup, jejak publik menghilang dan digantikan statistik agregat resmi. Analis luar kehilangan granularitas; analis di dalam sistem mendapat data lebih lengkap. Pertanyaan bergeser dari 'apa yang bisa saya hitung?' menjadi 'data siapa yang saya lihat — dan apa yang tidak saya lihat lagi?'",
        "Lesson ini mengajarkan CBDC sebagai sistem: model arsitektur, ritel vs grosir, pembayaran lintas negara, programmabilitas, dan implikasi datanya. Setelah lesson ini kamu bisa: (1) membedakan CBDC ritel, grosir, dan instrumen digital lain; (2) menjelaskan tiga model arsitektur — langsung, perantara, hibrida; (3) menghitung adopsi, pangsa terhadap uang primer, dan velositas; (4) menjelaskan pembayaran lintas negara dan proyek jembatan antar-bank sentral; (5) menilai implikasi CBDC terhadap data yang tersedia bagi analis.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "BCD16 punya satu langkah penuh 'Langkah 9 · CBDC' — definisi ritel vs grosir, tiga instrumen (CBDC vs stablecoin vs e-money), dan dilema privasi. Lesson ini TIDAK mengulang langkah itu: ia membangun CBDC sebagai sistem lengkap — model arsitektur (langsung/perantara/hibrida), pembayaran lintas negara, programmabilitas dan uang bersyarat, serta dampaknya pada peta data analis — dengan lab yang menghitung adopsi, pangsa, dan velositas dari angka mentah.",
      },
      reference: "Adopsi 12 persen (8,4 dari 70 juta); saldo 60 triliun = 4 persen dari uang primer; velositas 4,0 kali per bulan.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca desain CBDC dan mengukur jejaknya di sistem moneter.",
        "(1) Membedakan CBDC ritel, CBDC grosir, stablecoin, dan e-money dari penerbit dan klaimnya;",
        "(2) Menjelaskan model langsung, perantara, dan hibrida — siapa memegang ledger dan siapa melayani pengguna;",
        "(3) Menghitung adopsi, pangsa terhadap uang primer, dan velositas CBDC;",
        "(4) Menjelaskan pembayaran lintas negara lewat jembatan antar-bank sentral;",
        "(5) Menilai apa yang berubah bagi analis data bila pembayaran pindah ke rel tertutup.",
      ],
      tasks: [],
    },
    {
      id: "arsitektur",
      eyebrow: "Langkah 3 · Teori",
      title: "Tiga model arsitektur: siapa memegang ledger?",
      prose: [
        "Model LANGSUNG: bank sentral memegang ledger dan melayani pengguna akhir secara langsung — setiap warga punya akun di bank sentral. Keunggulannya: kontrol penuh dan tidak ada perantara. Kelemahannya: bank sentral harus membangun layanan pelanggan untuk puluhan juta orang — pekerjaan yang bukan keahliannya, plus risiko disintermediasi bank komersial bila semua orang memindahkan dananya ke bank sentral.",
        "Model PERANTARA (two-tier): bank sentral menerbitkan CBDC ke bank komersial dan penyedia pembayaran, dan merekalah yang melayani pengguna — mirip uang tunai hari ini, di mana bank sentral mencetak tetapi bank mendistribusikan. Keunggulannya: memakai infrastruktur yang sudah ada dan menjaga peran bank. Kelemahannya: dalam model perantara MURNI, bank sentral hanya melihat data agregat perantara, bukan transaksi individu — kecuali desainnya memberi bank sentral salinan ledger, dan itu sudah masuk wilayah model hibrida.",
        "Model HIBRIDA: perantara melayani pengguna, tetapi bank sentral menyimpan salinan ledger dan bisa mengambil alih bila perantara gagal — cadangan yang membuat sistem tahan terhadap kegagalan satu perantara. Sebagian besar proyek percontohan di dunia memakai perantara atau hibrida, bukan langsung — karena pertanyaan 'siapa melayani pengguna' dijawab dengan 'yang sudah melayani mereka hari ini'.",
        "Satu dimensi yang sering luput: offline. Uang tunai bekerja tanpa listrik dan tanpa sinyal. CBDC ritel yang baik harus punya mode offline — kartu atau dompet yang menyimpan nilai dan bertransaksi lewat NFC, lalu sinkron saat kembali online. Tanpa mode offline, CBDC gagal di daerah tanpa sinyal dan saat bencana — persis saat uang tunai paling dibutuhkan. Desain offline berarti batas nilai dan risiko double-spend yang harus dikelola — bukan fitur gratis.",
        "Ritel vs grosir vs stablecoin vs e-money — empat instrumen, empat klaim yang berbeda. CBDC ritel adalah kewajiban bank sentral untuk publik; CBDC grosir adalah kewajiban bank sentral antar-bank untuk setelmen; stablecoin adalah kewajiban penerbit SWASTA yang dijaminkan aset; e-money adalah klaim ke penerbit swasta (saldo dompet/uang elektronik). Yang membedakan bukan 'digital atau tidak' — semuanya digital — melainkan SIAPA yang berutang kepadamu bila penerbit gagal, dan seberapa besar risikonya.",
      ],
      tasks: [],
      note: {
        title: "CBDC bukan kripto",
        body: "CBDC tidak memakai proof-of-work, tidak punya pasokan terbatas, dan tidak terdesentralisasi. Ia adalah kewajiban bank sentral dalam bentuk digital — sama seperti uang tunai, hanya medianya berubah. Menyebut CBDC 'kripto pemerintah' mengacaukan dua hal: kripto menghindari otoritas pusat, CBDC ADALAH otoritas pusat dalam bentuk baru.",
      },
      reference: "Langsung: bank sentral melayani pengguna. Perantara: bank mendistribusikan. Hibrida: perantara melayani + bank sentral pegang cadangan ledger.",
    },
    {
      id: "lintas-negara",
      eyebrow: "Langkah 4 · Teori",
      title: "Lintas negara: jembatan antar-bank sentral",
      prose: [
        "Pembayaran lintas negara hari ini lambat dan mahal: koresponden banking berantai, biaya 6 persen lebih untuk remitansi kecil, penyelesaian berhari-hari. CBDC grosir lintas negara menjanjikan penyelesaian langsung antar-bank sentral — tanpa rantai koresponden. Proyek jembatan seperti mBridge (Hong Kong, Thailand, Tiongkok, UEA, Arab Saudi) menguji platform bersama di mana bank sentral peserta saling menyelesaikan CBDC grosir dalam hitungan detik.",
        "Dua desain bersaing. Model KORESPONDEN yang ditingkatkan: tiap negara punya CBDC sendiri, dan jembatan menukar keduanya — mirip koresponden banking tetapi dengan aset digital. Model PLATFORM BERSAMA: satu platform dengan banyak CBDC, di mana bank komersial peserta memegang dan menukar CBDC negara lain langsung. Model kedua lebih cepat tetapi butuh tata kelola bersama yang jauh lebih sulit: siapa mengoperasikan platform, hukum mana yang berlaku, dan bagaimana sengketa diselesaikan.",
        "Programmabilitas adalah pedang bermata dua. Uang yang bisa diprogram berarti pembayaran bersyarat: dana bantuan yang hanya bisa dipakai untuk pangan, pembayaran pajak otomatis saat transaksi terjadi, atau escrow yang cair saat barang diterima. Manfaatnya nyata — tetapi uang yang bisa diprogram juga uang yang bisa dibatasi: masa berlaku, daftar belanja yang diizinkan, pemblokiran otomatis. Analis harus membaca DUA sisi: kemampuan teknisnya dan siapa yang memegang tombol pembatasnya.",
        "Untuk analis data, CBDC lintas negara mengubah sumber data perdagangan dan remitansi: aliran yang hari ini terlihat lewat data SWIFT dan laporan bank akan tercatat di platform jembatan — dengan granularitas yang ditentukan perjanjian antar-bank sentral, bukan oleh pasar. Pertanyaan 'berapa remitansi bulan ini' bisa menjadi lebih akurat — atau lebih tertutup — tergantung siapa yang boleh melihat platform itu.",
      ],
      tasks: [],
      note: {
        title: "Remitansi 6 persen",
        body: "Bank Dunia mencatat biaya rata-rata pengiriman remitansi global sekitar 6 persen — untuk pekerja migran yang mengirim 200 dolar, 12 dolar hilang di jalan. Inilah angka yang membuat CBDC lintas negara lebih dari sekadar proyek teknologi: ia adalah janji biaya yang lebih rendah bagi orang yang paling merasakan biaya itu. Janji itu harus diuji — bukan diterima — dari data percontohan yang sebenarnya.",
      },
      reference: "mBridge: platform bersama CBDC grosir lintas negara. Programmabilitas = pembayaran bersyarat + risiko pembatasan.",
    },
    {
      id: "lab-cbdc",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mengukur adopsi, pangsa, dan velositas CBDC",
      prose: [
        "Lab ini membangun pengukur jejak CBDC: dari pengguna, populasi dewasa, saldo beredar, uang primer, dan nilai transaksi bulanan — hitung adopsi, pangsa terhadap uang primer, dan velositas.",
        "Hitung dulu di kepala. Adopsi: 8,4 juta pengguna dibagi 70 juta penduduk dewasa dikali 100 sama dengan 12 persen. Pangsa terhadap uang primer: 60 triliun dibagi 1.500 triliun dikali 100 sama dengan 4 persen. Velositas: 240 triliun transaksi bulanan dibagi 60 triliun saldo sama dengan 4,0 kali per bulan — tiap rupiah digital berpindah tangan rata-rata 4 kali sebulan. Catatan: 60 triliun di sini dibaca sebagai saldo RATA-RATA selama sebulan — bila yang dipakai saldo akhir bulan, velositasnya bias bila saldo berfluktuasi dalam sebulan itu.",
        "Tugas lab: tulis fungsi yang menerima pengguna, populasi_dewasa, saldo, uang_primer, dan transaksi_bulanan — lalu mencetak tiga angka: adopsi_persen, pangsa_persen, velositas. Tiga angka ini adalah dashboard minimal untuk menjawab 'apakah CBDC ini sudah berarti?' — adopsi di bawah 5 persen berarti percontohan awal; 5 sampai 50 persen berarti adopsi berjalan tetapi belum arus utama; di atas 50 persen berarti arus utama. Pangsa di atas 10 persen berarti pergeseran moneter; velositas di atas 1 berarti uangnya dipakai, bukan ditimbun.",
        "Setelah lolos, coba eksperimen: naikkan pengguna menjadi 35 juta (adopsi 50 persen) dan lihat adopsi melonjak — lalu tanyakan: bila adopsi 50 persen tetapi velositas tetap 4,0, apa yang berubah bagi bank komersial? Hati-hati: adopsi 50 persen BUKAN berarti setengah dana nasabah pindah — berapa rupiah yang benar-benar pindah hanya bisa dijawab dari pangsa saldo, bukan dari adopsi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung adopsi CBDC sebagai persen penduduk dewasa" },
        { id: "t2", text: "Hitung pangsa saldo CBDC terhadap uang primer" },
        { id: "t3", text: "Hitung velositas: transaksi bulanan dibagi saldo beredar" },
      ],
      expected: "adopsi_persen=12.0\npangsa_persen=4.0\nvelositas=4.0",
      hints: [
        "Adopsi persen = pengguna dibagi populasi_dewasa, dikali 100. Bulatkan ke 1 desimal agar 12,0 tampil bersih.",
        "Pangsa persen = saldo dibagi uang_primer, dikali 100.",
        "Velositas = transaksi_bulanan dibagi saldo — tanpa dikali 100.",
        "Satuan harus konsisten: semua dalam triliun rupiah, atau semua dalam juta jiwa.",
      ],
      code: {
        starter: `# Pengukur jejak CBDC: adopsi, pangsa, velositas (satuan triliun Rp / juta jiwa).\npengguna = 8.4  # juta\npopulasi_dewasa = 70.0  # juta\nsaldo = 60.0  # triliun Rp\nuang_primer = 1500.0  # triliun Rp\ntransaksi_bulanan = 240.0  # triliun Rp\n\n# TULIS KODEMU: hitung tiga angka jejak CBDC di bawah ini.\n# Cetak, per baris: adopsi_persen, pangsa_persen, velositas.\n\n\npengukur_cbdc(pengguna, populasi_dewasa, saldo, uang_primer, transaksi_bulanan)`,
        lockLines: 5,
        solution: `# Pengukur jejak CBDC: adopsi, pangsa, velositas (satuan triliun Rp / juta jiwa).\npengguna = 8.4  # juta\npopulasi_dewasa = 70.0  # juta\nsaldo = 60.0  # triliun Rp\nuang_primer = 1500.0  # triliun Rp\ntransaksi_bulanan = 240.0  # triliun Rp\n\n\ndef pengukur_cbdc(pengguna, populasi_dewasa, saldo, uang_primer, transaksi_bulanan):\n    adopsi_persen = pengguna / populasi_dewasa * 100\n    pangsa_persen = saldo / uang_primer * 100\n    velositas = transaksi_bulanan / saldo\n    print(f"adopsi_persen={round(adopsi_persen, 1)}")\n    print(f"pangsa_persen={pangsa_persen}")\n    print(f"velositas={velositas}")\n\n\npengukur_cbdc(pengguna, populasi_dewasa, saldo, uang_primer, transaksi_bulanan)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "adopsi_persen=12.0", label: "Adopsi 12 persen", msg: "8,4 / 70 x 100 = 12 persen. Adopsi berjalan (5–50 persen) — sudah lewat percontohan awal, belum arus utama (ambang 50 persen)." },
          { kind: "stdout_matches", task: "t2", pattern: "pangsa_persen=4.0", label: "Pangsa 4 persen", msg: "60 / 1.500 x 100 = 4 persen dari uang primer. Kecil — belum pergeseran moneter." },
          { kind: "stdout_matches", task: "t3", pattern: "velositas=4.0", label: "Velositas 4,0", msg: "240 / 60 = 4,0 kali per bulan (saldo rata-rata sebulan). Uangnya dipakai berputar, bukan ditimbun." },
        ],
      },
      reference: "Adopsi 12 persen; pangsa 4 persen; velositas 4,0 kali per bulan.",
    },
    {
      id: "peta-data",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta data: apa yang hilang dan apa yang muncul",
      prose: [
        "Tiga hal hilang bila pembayaran pindah ke rel CBDC tertutup. Pertama, granularitas publik: aliran stablecoin hari ini bisa dilacak siapa pun sampai ke dompet; di rel tertutup, analis luar hanya mendapat agregat resmi. Kedua, komparabilitas: tiap bank sentral menerbitkan statistik dengan definisi sendiri — 'transaksi CBDC' di satu negara belum tentu sama dengan di negara lain. Ketiga, sinyal dini: pedagang dan analis yang hari ini membaca arus on-chain sebagai sinyal pasar kehilangan sumbernya.",
        "Tiga hal muncul sebagai gantinya. Pertama, data resmi yang lebih lengkap: bank sentral — dalam model langsung atau hibrida, di mana ia memegang ledger — melihat seluruh transaksi di relnya — distribusi, kecepatan, dan pola yang tidak pernah terlihat dari luar. Dalam model perantara murni, yang ia lihat hanyalah agregat dari perantara. Kedua, statistik baru: adopsi per wilayah, velositas per segmen, dan perpindahan dari tunai ke digital — ukuran yang berguna untuk kebijakan moneter. Ketiga, pertanyaan baru tentang akses: siapa boleh mengakses data transaksi individu, dengan perlindungan apa, dan untuk tujuan apa.",
        "Aturan kerja analis di era CBDC: catat SUMBER tiap angka — 'data rantai publik', 'statistik bank sentral', atau 'survei' — dan jangan membandingkan angka dari sumber berbeda seolah setara. Laporan yang menulis 'transaksi digital naik 40 persen' tanpa menyebut apakah itu rantai publik atau rel tertutup adalah laporan yang mencampur dua dunia.",
      ],
      tasks: [],
      note: {
        title: "Privasi adalah desain, bukan efek samping",
        body: "CBDC bisa dirancang dengan anonimitas terbatas — transaksi kecil anonim seperti tunai, transaksi besar terlacak seperti transfer bank. Atau sebaliknya: semua terlacak. Tidak ada yang otomatis. Saat membaca desain CBDC sebuah negara, cari tiga jawaban: berapa batas anonimitasnya, siapa yang menyimpan data transaksi, dan berapa lama data itu disimpan. Bila ketiganya tidak tertulis, desainnya belum selesai — apa pun yang dikatakan siaran persnya.",
      },
      reference: "Hilang: granularitas publik, komparabilitas, sinyal dini. Muncul: data resmi lengkap, statistik baru, pertanyaan akses.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: analis membaca laporan CBDC pertama",
      prose: [
        "Bank sentral menerbitkan laporan triwulan pertama rupiah digital: adopsi 12 persen, pangsa 4 persen, velositas 4,0. Media menulis 'rupiah digital meledak'. Analis di sebuah bank komersial membaca lebih dalam: 12 persen adopsi terkonsentrasi di dua kota besar; velositas 4,0 didorong transaksi antarbank, bukan ritel; dan pangsa 4 persen berarti 96 persen uang primer masih tunai dan giro.",
        "Ia menulis memo tiga baris: (1) adopsi ritel masih berjalan dan terkonsentrasi di dua kota — belum arus utama; jangan alokasikan anggaran transformasi berdasarkan angka nasional; (2) velositas didorong grosir — pisahkan ritel dan grosir sebelum menyimpulkan 'masyarakat memakai'; (3) pantau per kuartal dengan tiga angka yang sama — adopsi, pangsa, velositas — dan waspadai lonjakan adopsi tanpa lonjakan velositas, tanda uangnya dipegang, bukan dipakai.",
        "Memo itu menyelamatkan bank dari dua kesalahan: membangun produk ritel CBDC untuk pasar yang belum ada, dan mengabaikan pergeseran dana murah yang akan datang bila adopsi mencapai 50 persen dan pangsa saldo ikut naik — adopsi sendiri tidak membuktikan berapa rupiah yang pindah. Analis yang membaca angka dengan sumbernya — bukan dengan headline-nya — adalah analis yang dibayar untuk berpikir.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat memo ini benar. Pertama, angka dipecah (ritel vs grosir, kota vs nasional) sebelum disimpulkan. Kedua, tiga angka dipakai bersama — adopsi tanpa velositas menipu. Ketiga, memo memberi ambang tindakan (50 persen) sebelum ambang itu tercapai. Itulah pekerjaan analis: bukan melaporkan angka, melainkan memberi tahu kapan angka itu berarti.",
      },
      reference: "Adopsi 12 persen terkonsentrasi 2 kota; velositas 4,0 didorong grosir; pantau ambang 50 persen adopsi.",
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
        "Tiga model: langsung, perantara, hibrida — siapa memegang ledger dan siapa melayani pengguna.",
        "Lintas negara: jembatan antar-bank sentral; programmabilitas = bersyarat + risiko pembatasan.",
        "Lab: adopsi 12 persen; pangsa 4 persen; velositas 4,0 kali per bulan.",
        "Peta data: granularitas publik hilang, data resmi lengkap muncul — catat sumber tiap angka.",
        "CBDC adalah kewajiban bank sentral dalam bentuk digital — bukan kripto.",
      ],
      next: { label: "BCD35 — Kerangka Risiko DeFi: Menilai Protokol Sebelum Percaya", href: "/v2/learn/bcd35-risiko-defi" },
      quiz: [
        {
          q: "CBDC: 8,4 juta pengguna dari 70 juta penduduk dewasa; saldo 60 triliun dari uang primer 1.500 triliun; transaksi bulanan 240 triliun. Berapa adopsi, pangsa, dan velositas?",
          options: [
            { text: "Adopsi 12 persen; pangsa 4 persen; velositas 4,0", why: "Tepat: 8,4/70 = 12 persen; 60/1.500 = 4 persen; 240/60 = 4,0 kali per bulan.", correct: true },
            { text: "Adopsi 4 persen; pangsa 12 persen; velositas 0,25", why: "Salah: adopsi dan pangsa tertukar, velositas terbalik (60/240, bukan 240/60)." },
            { text: "Adopsi 12 persen; pangsa 40 persen; velositas 4,0", why: "Salah: pangsa 60/1.500 adalah 4 persen, bukan 40 — satu nol mengubah cerita dari percontohan menjadi pergeseran moneter." },
            { text: "Adopsi 8,4 persen; pangsa 60 persen; velositas 240", why: "Salah: 8,4 adalah jumlah pengguna (juta), bukan persen; 60 adalah saldo (triliun), bukan pangsa." },
          ],
        },
        {
          q: "Apa perbedaan inti model perantara (two-tier) dan model langsung?",
          options: [
            { text: "Perantara memakai blockchain, langsung tidak", why: "Salah: keduanya bisa memakai teknologi ledger yang sama — bedanya siapa melayani pengguna." },
            { text: "Langsung: bank sentral melayani pengguna akhir; perantara: bank komersial melayani pengguna, bank sentral menerbitkan ke mereka", why: "Tepat: pembeda model adalah siapa memegang hubungan dengan pengguna akhir.", correct: true },
            { text: "Langsung hanya untuk grosir, perantara hanya untuk ritel", why: "Salah: ritel vs grosir adalah dimensi lain — kedua model bisa dipakai untuk keduanya." },
            { text: "Tidak ada perbedaan — hanya nama berbeda", why: "Salah: perbedaannya menentukan siapa membangun layanan pelanggan dan siapa melihat data transaksi individu." },
          ],
        },
        {
          q: "Mengapa mode offline penting untuk CBDC ritel?",
          options: [
            { text: "Supaya transaksi lebih cepat dari rantai publik", why: "Salah: kecepatan bukan alasan offline — ketersediaanlah alasannya." },
            { text: "Karena uang tunai bekerja tanpa listrik dan sinyal — CBDC tanpa mode offline gagal di daerah tanpa sinyal dan saat bencana", why: "Tepat: uang harus bekerja saat infrastruktur mati — persis saat ia paling dibutuhkan.", correct: true },
            { text: "Supaya bank sentral tidak bisa melacak transaksi", why: "Salah: offline menunda sinkronisasi, bukan menghilangkan jejak — transaksi tetap tercatat saat sinkron." },
            { text: "Mode offline tidak penting — semua orang punya sinyal", why: "Salah: asumsi 'semua orang punya sinyal' mengabaikan daerah terpencil dan situasi bencana." },
          ],
        },
        {
          q: "Apa risiko utama programmabilitas CBDC bagi pengguna?",
          options: [
            { text: "Uang bisa diprogram untuk pembayaran bersyarat — dan dibatasi: masa berlaku, daftar belanja, pemblokiran otomatis", why: "Tepat: kemampuan yang sama memberi manfaat (escrow, bantuan tepat sasaran) dan risiko (pembatasan oleh pemegang tombol).", correct: true },
            { text: "Programmabilitas membuat CBDC tidak bisa dipakai lintas negara", why: "Salah: lintas negara adalah soal jembatan antar-bank sentral, bukan programmabilitas." },
            { text: "Programmabilitas menghilangkan peran bank komersial", why: "Salah: itu risiko model langsung, bukan programmabilitas — dan model perantara justru menjaga peran bank." },
            { text: "Tidak ada risiko — program hanya menambah fitur", why: "Salah: setiap kemampuan membatasi adalah kemampuan mengendalikan. Analis membaca siapa memegang tombolnya." },
          ],
        },
        {
          q: "Adopsi CBDC naik ke 50 persen tetapi velositas tetap 4,0. Apa kesimpulan yang benar untuk bank komersial?",
          options: [
            { text: "Tidak ada dampak — velositas tidak berubah", why: "Salah: velositas mengukur perputaran, bukan kepemilikan — dan adopsi 50 persen BUKAN berarti setengah dana pindah: adopsi mengukur berapa ORANG memakai, bukan berapa RUPIAH yang pindah. Dana yang pindah diukur dari pangsa saldo, bukan adopsi." },
            { text: "Bank kehilangan dana murah dalam jumlah besar — pantau pergeseran dana, bukan hanya velositas", why: "Tepat: adopsi mengukur berapa orang memakai; velositas mengukur seberapa cepat uang berputar; pangsa saldo mengukur berapa rupiah yang pindah. Ketiganya harus dibaca bersama — adopsi naik saja belum membuktikan berapa dana yang pindah.", correct: true },
            { text: "Bank mendapat untung karena transaksi lebih cepat", why: "Salah: kecepatan transaksi bukan keuntungan bank — dana yang pindah adalah kerugian pendanaan murah." },
            { text: "CBDC gagal karena velositas tidak naik", why: "Salah: velositas stabil 4,0 berarti uangnya dipakai normal — bukan gagal." },
          ],
        },
      ],
    },
  ],
};

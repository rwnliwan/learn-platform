import type { V2Lesson } from "../lib/types";

export const dm29: V2Lesson = {
  slug: "dm29-inmon-vs-kimball",
  track: "Data Management",
  module: "Arsitektur",
  title: "DM29 — Inmon vs Kimball: Dua Arsitektur Data Warehouse",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu perusahaan, dua arsitek, dua gudang yang berbeda",
      prose: [
        "Sebuah perusahaan ritel membangun data warehouse. Arsitek pertama mengusulkan Inmon: satu enterprise data warehouse ternormalisasi, lalu data mart per departemen. Arsitek kedua mengusulkan Kimball: langsung bangun data mart dimensional dengan bus architecture dan dimensi conformed. Keduanya benar — untuk masalah yang berbeda.",
        "Tim mengukur trade-off-nya. Gudang ternormalisasi Inmon: 12 tabel inti, kueri rata-rata 6 join, waktu kueri 4,8 detik, penyimpanan 850 GB, waktu ETL 3,5 jam. Gudang dimensional Kimball: 5 tabel per mart, kueri rata-rata 2 join, waktu kueri 1,2 detik (75 persen lebih cepat), penyimpanan 1.100 GB (29,4 persen lebih besar karena denormalisasi), waktu ETL 2,0 jam (1,5 jam lebih cepat). Tidak ada pemenang absolut — ada pilihan dengan harga yang berbeda.",
        "Lesson ini mengajarkan dua arsitektur data warehouse: Inmon top-down dan Kimball bottom-up — struktur, kelebihan, kekurangan, dan kapan memilih yang mana. Setelah lesson ini kamu bisa: (1) menjelaskan arsitektur Inmon dan Kimball; (2) membandingkan keduanya dari enam sisi; (3) menghitung trade-off kecepatan, penyimpanan, dan waktu ETL; (4) menjelaskan dimensi conformed dan bus architecture; (5) memutuskan arsitektur dari kebutuhan organisasi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Kimball sudah diajarkan di DM2 — model dimensional dan star schema disebut sebagai pola pemodelan (2 hit), dan DM4 membahas data warehouse secara umum. Inmon TIDAK PERNAH disebut di seluruh track DM (0 hit). Lesson ini TIDAK mengulang DM2: ia membangun perbandingan Inmon vs Kimball sebagai keputusan arsitektur — top-down vs bottom-up, EDW ternormalisasi vs bus dimensional, dan kapan memilih yang mana — dengan lab yang menghitung trade-off-nya.",
      },
      reference: "Inmon: 12 tabel, 6 join, 4,8 detik, 850 GB, ETL 3,5 jam. Kimball: 5 tabel, 2 join, 1,2 detik (75 persen lebih cepat), 1.100 GB (+29,4 persen), ETL 2,0 jam.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memilih arsitektur data warehouse — dan mempertahankan pilihanmu dengan angka.",
        "(1) Menjelaskan arsitektur Inmon: EDW ternormalisasi top-down, lalu data mart;",
        "(2) Menjelaskan arsitektur Kimball: data mart dimensional bottom-up, bus architecture;",
        "(3) Membandingkan keduanya: kecepatan, penyimpanan, ETL, tata kelola, waktu ke nilai, dan fleksibilitas;",
        "(4) Menghitung trade-off: persen lebih cepat, persen lebih besar, selisih jam ETL;",
        "(5) Memutuskan arsitektur dari kebutuhan: satu sumber kebenaran vs cepat ke nilai.",
      ],
      tasks: [],
    },
    {
      id: "inmon",
      eyebrow: "Langkah 3 · Teori",
      title: "Inmon: top-down — satu gudang, lalu mart",
      prose: [
        "Bill Inmon mendefinisikan data warehouse sebagai koleksi data yang subject-oriented, integrated, time-variant, dan non-volatile. Arsitekturnya top-down: bangun dulu ENTERPRISE DATA WAREHOUSE (EDW) — satu gudang pusat yang ternormalisasi (3NF), mengintegrasikan SEMUA sumber ke satu model. Baru sesudah itu, turunkan DATA MART per departemen — penjualan, keuangan, logistik — yang mengambil data dari EDW.",
        "Kelebihan Inmon: SATU sumber kebenaran. Karena semua data melewati EDW yang sama, dua departemen tidak akan melaporkan angka berbeda untuk hal yang sama — integrasi dikerjakan sekali, di pusat. Normalisasi 3NF menghilangkan redundansi: satu fakta disimpan sekali, sehingga update tidak menimbulkan inkonsistensi. Audit dan tata kelola lebih mudah: lineage jelas — semua mart berasal dari EDW yang sama.",
        "Kekurangannya: LAMBAT KE NILAI. EDW harus selesai — atau cukup selesai — sebelum mart pertama bisa dipakai. Proyek Inmon klasik memakan waktu berbulan-bulan sebelum pengguna melihat satu dashboard. Kompleksitasnya tinggi: memodelkan seluruh perusahaan dalam 3NF adalah pekerjaan besar yang butuh arsitek berpengalaman. Dan kueri analitik di atas model ternormalisasi butuh banyak join — 6 join rata-rata dalam contoh kita — sehingga lambat tanpa agregat dan indeks tambahan.",
        "Inmon cocok bila: organisasi besar dengan banyak sumber dan kebutuhan integrasi yang ketat; regulasi menuntut satu sumber kebenaran yang bisa diaudit; dan organisasi sanggup berinvestasi jangka panjang sebelum melihat hasil. Inmon tidak cocok bila: kebutuhan mendesak dan anggaran terbatas — pengguna yang menunggu 9 bulan untuk dashboard pertama akan membangun spreadsheet sendiri.",
      ],
      tasks: [],
      note: {
        title: "Non-volatile bukan berarti tidak pernah berubah",
        body: "Non-volatile berarti data warehouse tidak di-update seperti database operasional — data dimuat dan dibaca, bukan diubah-ubah. Bukan berarti data tidak pernah dikoreksi: koreksi dilakukan lewat pemuatan ulang atau versi baru, dengan jejak yang jelas. Prinsipnya: sejarah tidak ditulis ulang diam-diam.",
      },
      reference: "Inmon: EDW 3NF pusat → data mart per departemen. Kelebihan: satu sumber kebenaran. Kekurangan: lambat ke nilai, kompleks.",
    },
    {
      id: "kimball",
      eyebrow: "Langkah 4 · Teori",
      title: "Kimball: bottom-up — mart dimensional dan bus",
      prose: [
        "Ralph Kimball membalik urutannya: bangun DATA MART dimensional dulu — satu per proses bisnis — dan biarkan gudang tumbuh dari mart-mart itu. Tiap mart memakai STAR SCHEMA: satu tabel fakta (angka yang diukur) dikelilingi tabel dimensi (konteks: siapa, kapan, di mana) — pola yang diajarkan DM2. Mart pertama bisa jalan dalam hitungan minggu, bukan bulan.",
        "Yang mencegah kekacauan adalah BUS ARCHITECTURE dan DIMENSI CONFORMED. Bus adalah kerangka bersama: tiap mart memakai dimensi yang sama — dimensi pelanggan, produk, dan waktu yang DEFINISINYA SAMA di semua mart. Pelanggan 'aktif' berarti hal yang sama di mart penjualan dan mart layanan. Tanpa dimensi conformed, tiap mart menjadi pulau — dan perusahaan kembali punya banyak versi kebenaran.",
        "Kelebihan Kimball: CEPAT KE NILAI. Mart pertama memberi dashboard dalam minggu pertama; pengguna melihat hasil dan memberi umpan balik sebelum mart kedua dibangun. Kueri cepat: star schema hanya butuh 2 join rata-rata (fakta ke dimensi) — 1,2 detik vs 4,8 detik di contoh kita, 75 persen lebih cepat. Dan model dimensional mudah dipahami pengguna bisnis — fakta dan dimensi adalah bahasa mereka.",
        "Kekurangannya: DENORMALISASI memakan tempat — 1.100 GB vs 850 GB, 29,4 persen lebih besar — karena dimensi menyimpan atribut berulang. Risiko inkonsistensi: bila dimensi conformed tidak dijaga, dua mart akan menyimpang — dan 'cepat' menjadi 'cepat tetapi salah'. Dan integrasi lintas-mart butuh disiplin: bus architecture adalah perjanjian yang harus ditegakkan, bukan saran.",
      ],
      tasks: [],
      note: {
        title: "Kimball bukan 'tanpa gudang'",
        body: "Kesalahpahaman umum: Kimball berarti tidak ada data warehouse — hanya kumpulan mart. Yang sebenarnya: gudang Kimball ADALAH kumpulan mart yang terhubung bus architecture dan dimensi conformed. Gudang itu ada — hanya saja bentuknya terdistribusi, bukan satu EDW pusat. Menilai Kimball dari satu mart saja adalah menilai separuh arsitekturnya.",
      },
      reference: "Kimball: mart dimensional + bus architecture + dimensi conformed. Kelebihan: cepat ke nilai, kueri cepat. Kekurangan: denormalisasi +29,4 persen, disiplin bus.",
    },
    {
      id: "lab-tradeoff",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung trade-off Inmon vs Kimball",
      prose: [
        "Lab ini membangun kalkulator trade-off arsitektur: dari waktu kueri, penyimpanan, dan waktu ETL kedua arsitektur — hitung persen lebih cepat, persen lebih besar, dan selisih jam ETL.",
        "Hitung dulu di kepala. Kueri lebih cepat: 4,8 dikurangi 1,2 sama dengan 3,6; 3,6 dibagi 4,8 dikali 100 sama dengan 75,0 persen — kueri Kimball 75 persen lebih cepat. Penyimpanan lebih besar: 1.100 dikurangi 850 sama dengan 250; 250 dibagi 850 dikali 100 sama dengan 29,4 persen (tepatnya 29,4118 persen, dibulatkan satu desimal). Selisih ETL: 3,5 dikurangi 2,0 sama dengan 1,5 jam lebih cepat.",
        "Tugas lab: tulis fungsi yang menerima waktu kueri, penyimpanan, dan waktu ETL Inmon dan Kimball — lalu mencetak tiga angka: kueri_cepat_persen, simpan_besar_persen, etl_hemat_jam. Tiga angka ini adalah lampiran keputusan arsitektur yang dibaca komite sebelum menyetujui anggaran.",
        "Setelah lolos, coba eksperimen: naikkan penyimpanan Kimball menjadi 1.700 GB (100 persen lebih besar) dan lihat trade-off berubah — lalu tanyakan: pada titik berapa kecepatan kueri tidak lagi sebanding dengan biaya penyimpanan?",
      ],
      tasks: [
        { id: "t1", text: "Hitung persen kueri Kimball lebih cepat dari Inmon" },
        { id: "t2", text: "Hitung persen penyimpanan Kimball lebih besar dari Inmon" },
        { id: "t3", text: "Hitung selisih waktu ETL dalam jam" },
      ],
      expected: "kueri_cepat_persen=75.0\nsimpan_besar_persen=29.4\netl_hemat_jam=1.5",
      hints: [
        "Lebih cepat persen = (Inmon - Kimball) / Inmon x 100.",
        "Lebih besar persen = (Kimball - Inmon) / Inmon x 100, dibulatkan 1 desimal.",
        "Selisih ETL = ETL Inmon dikurangi ETL Kimball.",
        "Pembagi selalu nilai Inmon — ia adalah baseline perbandingan.",
      ],
      code: {
        starter: `# Kalkulator trade-off arsitektur: Inmon vs Kimball.\nkueri_inmon = 4.8  # detik\nkueri_kimball = 1.2  # detik\nsimpan_inmon = 850  # GB\nsimpan_kimball = 1100  # GB\netl_inmon = 3.5  # jam\netl_kimball = 2.0  # jam\n\n# TULIS KODEMU: hitung tiga angka trade-off di bawah ini.\n# Cetak, per baris: kueri_cepat_persen, simpan_besar_persen,\n# etl_hemat_jam.\n\n\nkalkulator_tradeoff(kueri_inmon, kueri_kimball, simpan_inmon, simpan_kimball, etl_inmon, etl_kimball)`,
        lockLines: 6,
        solution: `# Kalkulator trade-off arsitektur: Inmon vs Kimball.\nkueri_inmon = 4.8  # detik\nkueri_kimball = 1.2  # detik\nsimpan_inmon = 850  # GB\nsimpan_kimball = 1100  # GB\netl_inmon = 3.5  # jam\netl_kimball = 2.0  # jam\n\n\ndef kalkulator_tradeoff(kueri_inmon, kueri_kimball, simpan_inmon, simpan_kimball, etl_inmon, etl_kimball):\n    kueri_cepat_persen = (kueri_inmon - kueri_kimball) / kueri_inmon * 100\n    simpan_besar_persen = round((simpan_kimball - simpan_inmon) / simpan_inmon * 100, 1)\n    etl_hemat_jam = etl_inmon - etl_kimball\n    print(f"kueri_cepat_persen={kueri_cepat_persen}")\n    print(f"simpan_besar_persen={simpan_besar_persen}")\n    print(f"etl_hemat_jam={etl_hemat_jam}")\n\n\nkalkulator_tradeoff(kueri_inmon, kueri_kimball, simpan_inmon, simpan_kimball, etl_inmon, etl_kimball)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "kueri_cepat_persen=75.0", label: "Kueri 75 persen lebih cepat", msg: "(4,8-1,2)/4,8 x 100 = 75 persen. Star schema: 2 join vs 6 join." },
          { kind: "stdout_matches", task: "t2", pattern: "simpan_besar_persen=29.4", label: "Penyimpanan 29,4 persen lebih besar", msg: "(1.100-850)/850 x 100 = 29,4118 persen, dibulatkan 29,4. Harga denormalisasi." },
          { kind: "stdout_matches", task: "t3", pattern: "etl_hemat_jam=1.5", label: "ETL hemat 1,5 jam", msg: "3,5 - 2,0 = 1,5 jam. Mart dimensional memuat lebih sedikit transformasi." },
        ],
      },
      reference: "Kueri 75 persen lebih cepat; penyimpanan 29,4 persen lebih besar; ETL hemat 1,5 jam.",
    },
    {
      id: "memilih",
      eyebrow: "Langkah 6 · Teori",
      title: "Memilih: enam pertanyaan sebelum memutuskan",
      prose: [
        "Pertanyaan 1 — SEBERAPA MENDESAK NILAINYA? Bila pengguna butuh dashboard bulan ini, Kimball. Bila organisasi bisa menunggu 9 bulan untuk fondasi yang kokoh, Inmon. Pertanyaan 2 — SEBERAPA BESAR INTEGRASINYA? Bila 20 sumber harus menjadi satu kebenaran, Inmon. Bila 3 sumber per mart sudah cukup, Kimball.",
        "Pertanyaan 3 — SIAPA YANG MEMAKAI? Bila pengguna bisnis yang membaca star schema sendiri, Kimball. Bila tim data pusat yang mengelola EDW dan melayani mart, Inmon. Pertanyaan 4 — SEBERAPA KETAT TATA KELOLANYA? Bila regulator menuntut lineage dan satu sumber kebenaran yang diaudit, Inmon. Bila tata kelola bisa dijaga lewat dimensi conformed yang disiplin, Kimball.",
        "Pertanyaan 5 — BAGAIMANA PERTUMBUHANNYA? Bila perusahaan akan menambah banyak mart dan sumber, Inmon memberi fondasi yang tidak perlu dibangun ulang. Bila pertumbuhan tidak pasti, Kimball memberi nilai sekarang dan fleksibilitas nanti. Pertanyaan 6 — SIAPA TIMNYA? Inmon butuh arsitek EDW berpengalaman; Kimball butuh disiplin bus yang ditegakkan tiap mart.",
        "HIBRIDA adalah jawaban yang paling umum di praktik 2026: EDW yang ramping (tidak seluruh perusahaan, hanya domain inti) sebagai fondasi integrasi, dengan mart dimensional Kimball di atasnya untuk kecepatan dan kemudahan. Arsitektur modern — lakehouse, DM14 — sering memadukan keduanya: zona mentah dan terintegrasi ala Inmon, zona konsumsi dimensional ala Kimball. Pilihan bukan antara dua kubu — melainkan di mana menaruh garis antara integrasi dan kecepatan.",
      ],
      tasks: [],
      note: {
        title: "Arsitektur adalah keputusan yang bisa diubah",
        body: "Pilihan Inmon vs Kimball bukan pernikahan seumur hidup. Banyak organisasi mulai Kimball (cepat ke nilai), lalu membangun EDW saat mart mulai menyimpang. Sebaliknya, organisasi Inmon sering menambah mart dimensional untuk kecepatan. Yang mahal bukan memilih — melainkan memilih TANPA tahu harga pilihannya. Lesson ini memberimu harganya.",
      },
      reference: "Enam pertanyaan: mendesak? integrasi? pengguna? tata kelola? pertumbuhan? tim? Hibrida adalah jawaban paling umum.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: ritel yang memilih hibrida",
      prose: [
        "Kembali ke perusahaan ritel. Mereka tidak memilih satu kubu. Mereka membangun EDW ramping untuk tiga domain inti — pelanggan, produk, transaksi — sebagai satu sumber kebenaran (Inmon), dan mart dimensional untuk penjualan, logistik, dan keuangan di atasnya (Kimball). Mart penjualan jalan dalam 6 minggu; EDW selesai dalam 5 bulan; dua departemen tidak pernah lagi berdebat soal angka pelanggan.",
        "Angkanya: kueri mart 1,2 detik (bukan 4,8), penyimpanan total 1.100 GB (bukan 850 — harga yang dibayar dengan sadar), ETL 2,0 jam per mart. Yang paling penting: tidak ada spreadsheet bayangan — pengguna tidak perlu membangun laporan sendiri karena mart pertama datang sebelum mereka menyerah.",
        "Tiga hal yang membuat keputusan ini benar. Pertama, pilihan dibuat dari enam pertanyaan — bukan dari merek atau tren. Kedua, harga tiap pilihan dihitung dan diterima secara eksplisit — 29,4 persen penyimpanan lebih besar bukan kejutan. Ketiga, arsitektur bisa tumbuh: EDW ramping bisa diperluas, mart baru bisa ditambah tanpa membangun ulang.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Pelajaran umumnya: perdebatan Inmon vs Kimball yang paling produktif bukan 'mana yang benar', melainkan 'apa harga masing-masing untuk kebutuhan kita'. Arsitek yang membawa angka trade-off ke rapat adalah arsitek yang keputusannya bertahan — karena keputusannya bisa diperiksa, bukan hanya dipercaya.",
      },
      reference: "Hibrida: EDW ramping 3 domain + mart dimensional. Mart pertama 6 minggu; EDW 5 bulan; kueri 1,2 detik.",
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
        "Inmon: EDW 3NF top-down → mart. Kelebihan: satu sumber kebenaran. Kekurangan: lambat ke nilai.",
        "Kimball: mart dimensional bottom-up + bus + dimensi conformed. Kelebihan: cepat, kueri cepat.",
        "Lab: kueri 75 persen lebih cepat; penyimpanan 29,4 persen lebih besar; ETL hemat 1,5 jam.",
        "Enam pertanyaan: mendesak? integrasi? pengguna? tata kelola? pertumbuhan? tim?",
        "Hibrida adalah jawaban paling umum: EDW ramping + mart dimensional.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Inmon: kueri 4,8 detik, simpan 850 GB, ETL 3,5 jam. Kimball: 1,2 detik, 1.100 GB, 2,0 jam. Berapa persen lebih cepat, persen lebih besar, dan hemat ETL?",
          options: [
            { text: "75,0 persen lebih cepat; 29,4 persen lebih besar; hemat 1,5 jam", why: "Tepat: (4,8-1,2)/4,8 = 75 persen; (1.100-850)/850 = 29,4 persen; 3,5-2,0 = 1,5 jam.", correct: true },
            { text: "75,0 persen lebih cepat; 22,7 persen lebih besar; hemat 1,5 jam", why: "Salah: 22,7 persen adalah (1.100-850)/1.100 — pembagi yang salah. Baseline adalah Inmon (850), bukan Kimball." },
            { text: "25,0 persen lebih cepat; 29,4 persen lebih besar; hemat 1,5 jam", why: "Salah: 25 persen adalah rasio kueri Kimball terhadap Inmon (1,2/4,8) — lebih cepatnya adalah 100 dikurangi itu = 75 persen." },
            { text: "75,0 persen lebih cepat; 29,4 persen lebih besar; hemat 3,5 jam", why: "Salah: 3,5 jam adalah ETL Inmon — hematnya adalah selisih 3,5-2,0 = 1,5 jam." },
          ],
        },
        {
          q: "Apa fungsi dimensi conformed dalam arsitektur Kimball?",
          options: [
            { text: "Mempercepat kueri dengan indeks tambahan", why: "Salah: kecepatan kueri berasal dari star schema — dimensi conformed soal KONSISTENSI makna antar-mart." },
            { text: "Menjamin definisi yang sama (misalnya 'pelanggan aktif') di semua mart — mencegah tiap mart menjadi pulau kebenaran sendiri", why: "Tepat: bus architecture dan dimensi conformed adalah yang membuat kumpulan mart menjadi satu gudang.", correct: true },
            { text: "Menggantikan EDW — mart tidak butuh integrasi lagi", why: "Salah: dimensi conformed ADALAH integrasinya — tanpa itu, mart tidak terhubung." },
            { text: "Mengurangi penyimpanan dengan normalisasi", why: "Salah: terbalik — Kimball mendenormalisasi dan memakai LEBIH banyak penyimpanan (29,4 persen)." },
          ],
        },
        {
          q: "Organisasi butuh dashboard bulan ini, punya 3 sumber data, dan tim kecil. Arsitektur apa yang paling tepat?",
          options: [
            { text: "Inmon — satu sumber kebenaran selalu lebih baik", why: "Salah: Inmon butuh waktu berbulan-bulan sebelum nilai pertama — pengguna yang menunggu akan membangun spreadsheet sendiri." },
            { text: "Kimball — mart pertama cepat ke nilai; 3 sumber tidak butuh EDW besar; tim kecil bisa menjaga bus untuk sedikit mart", why: "Tepat: tiga dari enam pertanyaan (mendesak, integrasi kecil, tim kecil) menunjuk Kimball.", correct: true },
            { text: "Tidak membangun gudang — pakai spreadsheet saja", why: "Salah: spreadsheet adalah jalan pintas yang menjadi utang — 3 sumber masih layak digudangkan dengan mart dimensional." },
            { text: "Hibrida penuh — EDW lengkap plus semua mart sekaligus", why: "Salah: hibrida penuh butuh sumber daya besar — untuk tim kecil dan tenggat sebulan, itu over-engineering." },
          ],
        },
        {
          q: "Mengapa kueri Kimball 75 persen lebih cepat dari Inmon dalam contoh ini?",
          options: [
            { text: "Karena server Kimball lebih kuat", why: "Salah: servernya sama — bedanya ada di MODEL data, bukan perangkat keras." },
            { text: "Karena star schema hanya butuh 2 join rata-rata (fakta ke dimensi), sementara model ternormalisasi butuh 6 join", why: "Tepat: join adalah biaya kueri analitik — denormalisasi membayar kecepatan dengan penyimpanan.", correct: true },
            { text: "Karena Kimball tidak menyimpan sejarah", why: "Salah: Kimball menyimpan sejarah lewat slowly changing dimensions — bukan dengan menghapusnya." },
            { text: "Karena Inmon memakai database yang lebih lambat", why: "Salah: keduanya bisa memakai database yang sama — perbedaan kecepatannya berasal dari jumlah join." },
          ],
        },
        {
          q: "Dua departemen melaporkan angka pelanggan yang berbeda dari mart masing-masing. Apa diagnosis dan perbaikannya?",
          options: [
            { text: "Salah satu mart datanya rusak — bangun ulang mart itu", why: "Salah: kemungkinan besar bukan data rusak, melainkan definisi 'pelanggan' berbeda antar-mart." },
            { text: "Dimensi conformed gagal ditegakkan — samakan definisi pelanggan di bus architecture dan perbaiki kedua mart", why: "Tepat: inilah risiko Kimball yang diperingatkan — tanpa dimensi conformed, mart menjadi pulau.", correct: true },
            { text: "Pindah ke Inmon — Kimball tidak bisa diperbaiki", why: "Salah: masalahnya bukan arsitektur — melainkan disiplin bus. Pindah arsitektur tanpa memperbaiki disiplin hanya memindahkan masalah." },
            { text: "Abaikan — perbedaan kecil antar-departemen wajar", why: "Salah: dua angka pelanggan yang berbeda adalah kegagalan satu sumber kebenaran — bukan variasi yang wajar." },
          ],
        },
      ],
    },
  ],
};

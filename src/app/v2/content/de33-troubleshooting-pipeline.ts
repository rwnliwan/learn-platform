import type { V2Lesson } from "../lib/types";

export const de33: V2Lesson = {
  slug: "de33-troubleshooting-pipeline",
  track: "Data Engineer",
  module: "Operasi & Kualitas",
  title: "DE33 — Troubleshooting Pipeline: Mendiagnosis Job yang Gagal Jam 3 Pagi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dashboard kosong jam 7 pagi, dan log sepanjang 40 ribu baris",
      prose: [
        "Senin jam 7 pagi, dashboard revenue KirimCepat kosong. Job pipeline malamnya berstatus gagal, dan log-nya 40 ribu baris — sebagian besar INFO yang tidak relevan. Engineer pertama me-rerun job itu mentah-mentah: gagal lagi, 40 menit terbuang. Engineer kedua membuka log dari AKHIR, menemukan baris error pertama, dan dalam 10 menit tahu penyebabnya: 3.000 baris hilang dari sumber karena tabel sumber di-rename tanpa pemberitahuan.",
        "Perbedaan keduanya bukan pengalaman, melainkan metode: diagnosis yang sistematis mengalahkan tebakan yang cepat. Pipeline gagal punya pola — dan pola itu bisa dibaca bila kamu tahu di mana mencarinya.",
        "Lesson ini mengajarkan troubleshooting pipeline: klasifikasi kegagalan, membaca log dari akhir, mengisolasi lapisan (sumber, transformasi, tujuan), dan menghitung kehilangan data. Setelah lesson ini kamu bisa: (1) mengklasifikasikan kegagalan ke 5 keluarga; (2) membaca log secara efisien; (3) mengisolasi lapisan penyebab; (4) menghitung baris hilang, duplikat, dan terlambat; (5) memutuskan rerun, backfill, atau perbaikan dulu.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DE4 menyinggung idempotensi, retry, dan alert saat job gagal, dan DE22 punya satu soal kuis tentang disk penuh — tetapi tidak ada lesson troubleshooting pipeline sebagai disiplin: klasifikasi kegagalan, teknik membaca log, isolasi lapisan, dan hitungan kehilangan data. Lesson ini membangun disiplin itu.",
      },
      reference: "Diharapkan 100.000 baris, diterima 98.200 — tetapi 1.200 di antaranya duplikat, jadi unik 97.000: benar-benar hilang 3.000 (3,0 persen), duplikat 1.200, terlambat 350.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mendiagnosis pipeline gagal seperti dokter mendiagnosis pasien: dari gejala ke lapisan ke penyebab — bukan dari tebakan ke rerun.",
        "(1) Mengklasifikasikan kegagalan: sumber, transformasi, tujuan, infrastruktur, jadwal;",
        "(2) Membaca log dari akhir dan mencari error pertama, bukan error terbanyak;",
        "(3) Mengisolasi lapisan dengan tes kecil yang murah;",
        "(4) Menghitung kehilangan data: hilang, duplikat, terlambat;",
        "(5) Memutuskan rerun, backfill parsial, atau perbaiki dulu.",
      ],
      tasks: [],
    },
    {
      id: "lima-keluarga",
      eyebrow: "Langkah 3 · Teori",
      title: "Lima keluarga kegagalan",
      prose: [
        "Keluarga pertama: sumber. Tabel di-rename, kolom berubah tipe, API mengembalikan 429, file tidak datang. Gejalanya: job gagal di langkah baca, atau baris masuk jauh lebih sedikit dari biasanya. Tes murahnya: hitung baris sumber langsung — bila sumbernya sendiri sudah berubah, tidak ada gunanya men-debug transformasi.",
        "Keluarga kedua: transformasi. Join menggandakan baris, pembagian oleh nol, tipe data tidak cocok, logika baru yang salah. Gejalanya: job selesai tetapi angka aneh — revenue naik 3x lipat dalam semalam. Tes murahnya: jalankan transformasi pada sampel kecil dan bandingkan dengan hitungan manual.",
        "Keluarga ketiga: tujuan. Warehouse penuh, kredensial kedaluwarsa, tabel terkunci. Gejalanya: baca dan transformasi sukses, tulis yang gagal. Tes murahnya: tulis satu baris percobaan ke tabel tujuan.",
        "Keluarga keempat: infrastruktur. Disk penuh, memori habis, node mati. Gejalanya: job mati di tengah tanpa error bisnis yang jelas, sering di jam yang sama setiap hari. Tes murahnya: cek metrik resource pada jam kegagalan. Keluarga kelima: jadwal dan dependensi. Job hulu terlambat sehingga job hilir membaca data kemarin — gejalanya data basi, bukan error. Tes murahnya: bandingkan timestamp data dengan jadwal yang diharapkan.",
      ],
      tasks: [],
      note: {
        title: "Error pertama, bukan error terbanyak",
        body: "Satu kegagalan akar menimbulkan ratusan error turunan di log. Error yang paling sering muncul biasanya akibat, bukan penyebab. Baca log dari akhir ke awal sampai error pertama yang berbeda jenis — di situlah akarnya. Me-rerun tanpa menemukan akar berarti membayar kegagalan yang sama dua kali.",
      },
      reference: "5 keluarga: sumber, transformasi, tujuan, infrastruktur, jadwal dan dependensi.",
    },
    {
      id: "hitung-kehilangan",
      eyebrow: "Langkah 4 · Teori",
      title: "Menghitung kehilangan: hilang, duplikat, terlambat",
      prose: [
        "Diagnosis yang baik berakhir dengan angka, bukan perasaan. Tiga angka kehilangan di cerita pembuka: diharapkan 100.000 baris, diterima 98.200 — tetapi 1.200 dari yang diterima adalah DUPLIKAT, jadi baris unik yang benar-benar masuk hanya 97.000. Yang benar-benar hilang: 100.000 − 97.000 = 3.000 baris (3,0 persen) — bukan 1.800. Kesalahan klasiknya: mengurangkan diterima dari diharapkan tanpa mengeluarkan duplikat dari hitungan — duplikat membuat 'diterima' terlihat lebih besar dari yang sebenarnya masuk. Terlambat 350 baris — datang setelah jendela cut-off.",
        "Tiga angka itu menentukan tindakan. Hilang 3,0 persen karena sumber di-rename: perbaiki mapping lalu backfill 3.000 baris — bukan rerun penuh 100.000 baris. Duplikat 1.200: dedup by kunci sebelum menulis ulang. Terlambat 350: putuskan apakah masuk batch berikutnya atau backfill — tergantung apakah dashboard hari itu sudah terbit.",
        "Satu tingkat lebih dalam dari menghitung baris: rekonsiliasi BERBASIS IDENTITAS, bukan berbasis hitungan. Jumlah baris hanya berkata 'ada yang kurang' — ia tidak berkata 'baris mana yang kurang'. Rekonsiliasi yang benar membandingkan HIMPUNAN kunci: kunci bisnis yang diharapkan (dari sumber) minus kunci yang diterima (di tujuan) = daftar identitas yang hilang — lengkap dengan id-nya, sehingga backfill bisa menargetkan baris yang tepat, bukan menebak jendela tanggal. Tiga ceknya: (1) hitung distinct key di kedua sisi; (2) anti-join untuk daftar kunci yang hilang; (3) periksa kunci yang hanya ada di tujuan (duplikat atau data hantu). Hitungan baris adalah alarm; daftar kunci adalah diagnosis.",
        "Aturan rerun: rerun penuh hanya bila job idempoten dan penyebabnya sudah diperbaiki. Rerun job yang tidak idempoten menggandakan data — mengubah satu kegagalan menjadi dua. Bila tidak yakin job itu idempoten, backfill parsial dengan jendela tanggal yang sempit dan kunci dedup biasanya lebih aman — tetapi 'biasanya', bukan 'selalu': backfill parsial pun bisa menggandakan bila tidak memakai kunci dedup, dan bisa MENGHILANGKAN data bila jendelanya salah (misalnya jendela memakai tanggal load, bukan tanggal bisnis). Aman itu hasil dari kunci dedup + jendela yang benar + akar yang diperbaiki — bukan dari kata 'parsial' itu sendiri.",
      ],
      tasks: [],
      reference: "Hilang 3.000 (3,0 persen), duplikat 1.200, terlambat 350. Backfill parsial biasanya lebih aman dari rerun penuh bila idempotensi tidak yakin — bila memakai kunci dedup.",
    },
    {
      id: "lab-diagnosis",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin hitung kehilangan data",
      prose: [
        "Lab ini menghitung tiga angka kehilangan dari angka mentah pipeline: baris yang diharapkan, diterima, duplikat, dan terlambat.",
        "Hitung dulu di kepala. Diterima 98.200 — tetapi 1.200 di antaranya duplikat, jadi unik hanya 97.000. Hilang: 100.000 dikurangi 97.000 sama dengan 3.000. Persen hilang: 3.000 dibagi 100.000 dikali 100 sama dengan 3,0 persen. Duplikat 1.200 dan terlambat 350 tinggal dibaca dari laporan quality gate.",
        "Tugas lab: tulis fungsi yang menerima baris yang diharapkan, diterima, duplikat, dan terlambat — lalu mencetak empat angka: hilang, hilang_persen, duplikat, terlambat. Perhatian: hilang dihitung dari baris UNIK — keluarkan duplikat dari 'diterima' dulu (diterima − duplikat), baru kurangkan dari diharapkan.",
        "Setelah lolos, coba eksperimen: ubah baris diterima menjadi 95.000 (duplikat tetap 1.200) dan lihat hilang naik menjadi 6.200 (6,2 persen) — pada ambang berapa kamu menyatakan insiden, bukan sekadar anomali?",
      ],
      tasks: [
        { id: "t1", text: "Hitung hilang dan hilang_persen" },
        { id: "t2", text: "Teruskan duplikat ke output" },
        { id: "t3", text: "Teruskan terlambat ke output" },
      ],
      expected: "hilang=3000\nhilang_persen=3.0\nduplikat=1200\nterlambat=350",
      hints: [
        "Hilang = diharapkan dikurangi (diterima dikurangi duplikat) — duplikat dikeluarkan dulu.",
        "Persen hilang = hilang dibagi diharapkan, dikali 100.",
        "Bulatkan persen ke 1 desimal.",
      ],
      code: {
        starter: `# Angka quality gate pipeline semalam.\ndiharapkan = 100000\nditerima = 98200\nduplikat = 1200\nterlambat = 350\n\n# TULIS KODEMU: hitung hilang dan hilang_persen.\n# Cetak, per baris: hilang, hilang_persen, duplikat, terlambat.\n\n\nmesin_kehilangan(diharapkan, diterima, duplikat, terlambat)`,
        lockLines: 5,
        solution: `# Angka quality gate pipeline semalam.\ndiharapkan = 100000\nditerima = 98200\nduplikat = 1200\nterlambat = 350\n\n\ndef mesin_kehilangan(diharapkan, diterima, duplikat, terlambat):\n    hilang = diharapkan - (diterima - duplikat)\n    hilang_persen = hilang / diharapkan * 100\n    print(f"hilang={hilang}")\n    print(f"hilang_persen={round(hilang_persen, 1)}")\n    print(f"duplikat={duplikat}")\n    print(f"terlambat={terlambat}")\n\n\nmesin_kehilangan(diharapkan, diterima, duplikat, terlambat)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "hilang=3000", label: "Hilang 3.000 baris", msg: "100.000 - (98.200 - 1.200) = 3.000. Duplikat dikeluarkan dulu dari diterima." },
          { kind: "stdout_matches", task: "t1", pattern: "hilang_persen=3.0", label: "Hilang 3,0 persen", msg: "3.000 / 100.000 x 100 = 3,0 persen." },
          { kind: "stdout_matches", task: "t2", pattern: "duplikat=1200", label: "Duplikat 1.200 baris", msg: "Duplikat menandakan join salah atau retry tidak idempoten." },
          { kind: "stdout_matches", task: "t3", pattern: "terlambat=350", label: "Terlambat 350 baris", msg: "Datang setelah jendela cut-off — putuskan masuk batch berikut atau backfill." },
        ],
      },
      reference: "Hilang 3.000 (3,0 persen), duplikat 1.200, terlambat 350.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: rerun yang menggandakan masalah",
      prose: [
        "Kembali ke KirimCepat. Engineer pertama me-rerun job gagal tanpa diagnosis. Job itu ternyata tidak idempoten pada langkah tulis: rerun menulis ulang 98.200 baris yang sudah masuk, sehingga dashboard menampilkan revenue hampir dua kali lipat. Satu kegagalan menjadi dua — dan yang kedua lebih sulit dijelaskan ke direksi.",
        "Engineer kedua mengikuti metode: klasifikasi (sumber — tabel di-rename), hitung kehilangan (3.000 hilang, 1.200 duplikat awal dari rerun pertama), lalu backfill parsial 3.000 baris plus dedup 99.400 baris (98.200 baris ganda dari rerun + 1.200 duplikat awal). Dashboard pulih jam 9 pagi dengan angka yang benar dan jejak perbaikan yang tertulis.",
        "Keputusan rapat: tidak ada rerun tanpa diagnosis tertulis satu paragraf — keluarga kegagalan, akar, dan apakah job idempoten. Aturan itu ditempel di runbook, bukan dihafal.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membedakan kedua engineer. Pertama, membaca error pertama, bukan me-rerun. Kedua, menghitung kehilangan sebelum bertindak — angka menentukan backfill parsial vs rerun penuh. Ketiga, memeriksa idempotensi sebelum rerun — rerun buta pada job tidak idempoten selalu memperburuk keadaan.",
      },
      reference: "Rerun buta menggandakan 98.200 baris. Perbaikan: backfill 3.000 + dedup 99.400 (98.200 rerun + 1.200 awal). Aturan baru: diagnosis tertulis sebelum rerun.",
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
        "5 keluarga kegagalan: sumber, transformasi, tujuan, infrastruktur, jadwal dan dependensi.",
        "Lab: hilang 3.000 (3,0 persen — dari 97.000 unik), duplikat 1.200, terlambat 350.",
        "Baca log dari akhir; cari error pertama, bukan yang terbanyak.",
        "Rerun penuh hanya bila penyebab diperbaiki dan job idempoten.",
        "Diagnosis yang baik berakhir dengan angka kehilangan.",
      ],
      next: { label: "DE34 — Hadoop dan HDFS: Arsitektur Legacy yang Masih Menjelaskan Banyak Hal", href: "/v2/learn/de34-hadoop-hdfs-legacy" },
      quiz: [
        {
          q: "Diharapkan 100.000 baris, diterima 98.200 — tetapi 1.200 di antaranya duplikat. Berapa baris hilang dan persennya?",
          options: [
            { text: "Hilang 1.200, 1,2 persen — itu angka duplikat", why: "Salah: 1.200 adalah duplikat, bukan yang hilang. Jangan tukar angka kehilangan." },
            { text: "Hilang 3.000, 30 persen — salah menaruh koma", why: "Salah: 3.000 / 100.000 = 0,03 = 3,0 persen, bukan 30 persen." },
            { text: "Hilang 3.000, 3,0 persen", why: "Tepat: diterima 98.200 termasuk 1.200 duplikat → unik 97.000; 100.000 − 97.000 = 3.000 (3,0 persen).", correct: true },
            { text: "Hilang 1.800, 1,8 persen — 100.000 dikurangi 98.200", why: "Salah: itu lupa mengeluarkan duplikat — 98.200 bukan baris unik. Yang benar-benar masuk hanya 97.000." },
          ],
        },
        {
          q: "Log 40 ribu baris. Di mana mencari penyebab kegagalan?",
          options: [
            { text: "Baca dari awal — error pertama pasti di baris pertama", why: "Salah: log dimulai jauh sebelum kegagalan; baris awal berisi INFO normal." },
            { text: "Cari error yang paling sering muncul", why: "Salah: error terbanyak biasanya akibat, bukan penyebab — satu akar menimbulkan ratusan turunan." },
            { text: "Abaikan log — rerun saja, biasanya berhasil", why: "Salah: rerun tanpa diagnosis mengulang kegagalan yang sama dan membuang waktu." },
            { text: "Baca dari akhir ke awal sampai error pertama yang berbeda jenis", why: "Tepat: error pertama yang berbeda jenis adalah akar; sisanya turunan.", correct: true },
          ],
        },
        {
          q: "Job gagal di langkah tulis setelah baca dan transformasi sukses. Keluarga kegagalan apa?",
          options: [
            { text: "Tujuan — warehouse penuh, kredensial kedaluwarsa, atau tabel terkunci", why: "Tepat: pola gagal-di-tulis setelah baca dan transformasi sukses menunjuk lapisan tujuan.", correct: true },
            { text: "Sumber — tabel sumber pasti berubah", why: "Salah: langkah baca sukses berarti sumber terbaca dengan baik." },
            { text: "Jadwal — job hulu terlambat", why: "Salah: keterlambatan hulu membuat data basi, bukan gagal di langkah tulis." },
            { text: "Transformasi — join pasti menggandakan baris", why: "Salah: transformasi sukses; join ganda akan terlihat sebagai angka aneh, bukan gagal tulis." },
          ],
        },
        {
          q: "Kapan rerun penuh adalah tindakan yang benar?",
          options: [
            { text: "Selalu — rerun adalah obat pertama segala kegagalan", why: "Salah: rerun buta pada job tidak idempoten menggandakan data." },
            { text: "Bila penyebab sudah diperbaiki dan job terbukti idempoten", why: "Tepat: dua syarat itu yang membuat rerun aman — tanpa keduanya, pilih backfill parsial.", correct: true },
            { text: "Bila dashboard sudah kosong dan direksi menunggu", why: "Salah: tekanan waktu bukan pengganti diagnosis; rerun buta justru memperpanjang insiden." },
            { text: "Bila log terlalu panjang untuk dibaca", why: "Salah: log panjang adalah alasan memakai metode baca-dari-akhir, bukan alasan melewatkan diagnosis." },
          ],
        },
        {
          q: "Data 3,0 persen hilang karena tabel sumber di-rename. Tindakan yang tepat?",
          options: [
            { text: "Rerun penuh 100.000 baris", why: "Salah: 97.000 baris unik sudah benar — rerun penuh membuang waktu dan berisiko ganda bila tidak idempoten." },
            { text: "Abaikan — 3,0 persen terlalu kecil untuk diurus", why: "Salah: 3.000 transaksi hilang mengubah laporan revenue; ambang diabaikan harus disepakati, bukan diputuskan diam-diam." },
            { text: "Perbaiki mapping lalu backfill 3.000 baris yang hilang", why: "Tepat: perbaiki akar dulu, lalu isi hanya yang hilang — murah dan aman.", correct: true },
            { text: "Ubah ambang quality gate menjadi 5 persen agar lolos", why: "Salah: mengubah ambang untuk meloloskan kegagalan adalah manipulasi, bukan perbaikan." },
          ],
        },
      ],
    },
  ],
};

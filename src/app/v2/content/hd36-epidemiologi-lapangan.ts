import type { V2Lesson } from "../lib/types";

export const hd36: V2Lesson = {
  slug: "hd36-epidemiologi-lapangan",
  track: "Health Data Science",
  module: "Kesehatan Populasi",
  title: "HD36 — Epidemiologi Lapangan: Investigasi Wabah Langkah demi Langkah",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "48 dari 120 yang makan — dan 10 dari 200 yang tidak",
      prose: [
        "Jumat malam, puskesmas menerima 48 pasien diare dari satu desa — semua makan di hajatan yang sama. Tim investigasi lapangan berangkat Sabtu pagi dengan satu pertanyaan: makanan mana? Mereka mewawancarai 120 orang yang makan dan 200 yang tidak. Hasilnya: attack rate pada yang makan 40 persen (48 dari 120), pada yang tidak makan 5 persen (10 dari 200). Rasio risiko 8,0 — yang makan berisiko 8 kali lipat. Fraksi yang dapat diatribusikan 87,5 persen.",
        "Tetapi 'yang makan' belum cukup spesifik. Tim memecah menurut menu: yang makan ayam goreng — attack rate 52 persen; yang makan nasi saja — 8 persen. Kurva epidemi menunjukkan puncak tunggal 36 jam setelah hajatan — median masa inkubasi 36 jam — pola point source, bukan penularan antar-orang. Ayam yang disimpan semalaman pada suhu ruang adalah sumbernya. Intervensi: sisa makanan dimusnahkan, dapur hajatan dibina — wabah berhenti tanpa satu pun kasus baru.",
        "Lesson ini mengajarkan investigasi wabah lapangan: 10 langkah, definisi kasus, kurva epidemi, attack rate, dan rasio risiko. Setelah lesson ini kamu bisa: (1) menyebutkan 10 langkah investigasi wabah; (2) menulis definisi kasus yang tajam; (3) membaca kurva epidemi dan membedakan point source vs propagated; (4) menghitung attack rate, rasio risiko, dan fraksi atributabel; (5) memutuskan intervensi dari bukti lapangan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Tidak ada lesson HD yang membahas investigasi wabah lapangan — grep field epidemiology, investigasi wabah, dan outbreak investigation di seluruh track menghasilkan nol. HD16 mengajarkan SIR dan deteksi wabah (pemodelan dan ambang statistik), HD35 mengajarkan desain sistem surveilans end-to-end. Lesson ini adalah sisi lapangannya: sepatu bot, wawancara, dan keputusan di tempat — bukan model di belakang meja.",
      },
      reference: "Attack rate terpapar 40 persen (48/120); tidak terpapar 5 persen (10/200); RR 8,0; fraksi atributabel 87,5 persen; median inkubasi 36 jam.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjalankan investigasi wabah dari telepon pertama sampai laporan akhir.",
        "(1) Menyebutkan 10 langkah investigasi wabah menurut CDC;",
        "(2) Menulis definisi kasus: person, place, time — plus kriteria klinis dan laboratorium;",
        "(3) Membaca kurva epidemi: point source, common source berkelanjutan, dan propagated;",
        "(4) Menghitung attack rate, rasio risiko, dan fraksi yang dapat diatribusikan;",
        "(5) Memutuskan intervensi: sumber, jalur, atau pejamu — dari bukti yang ada.",
      ],
      tasks: [],
    },
    {
      id: "sepuluh-langkah",
      eyebrow: "Langkah 3 · Teori",
      title: "10 langkah: dari telepon pertama ke laporan",
      prose: [
        "Langkah 1 — SIAP: tim, logistik, alat pelindung, dan formulir sudah siap SEBELUM wabah datang. Tim yang menyiapkan formulir saat wabah berjalan sudah kehilangan data pertama. Langkah 2 — VERIFIKASI: benarkah ini wabah? Bandingkan jumlah kasus dengan baseline — 48 kasus diare dalam semalam di desa yang biasanya 2 per minggu adalah wabah; 48 kasus flu di musim flu mungkin bukan.",
        "Langkah 3 — DEFINISI KASUS: siapa dihitung sebagai kasus? Definisi yang tajam: 'diare 3 kali atau lebih dalam 24 jam, onset 12 sampai 72 jam setelah hajatan, warga Desa X'. Tanpa definisi, tiap pewawancara menghitung orang yang berbeda. Langkah 4 — DESKRIPSI: person, place, time — siapa, di mana, kapan. Tabel dan kurva epidemi dibuat di sini. Langkah 5 — HIPOTESIS: dari deskripsi — 'ayam goreng di hajatan' — hipotesis yang bisa diuji.",
        "Langkah 6 — UJI HIPOTESIS: studi analitik — kohor retrospektif (seperti cerita kita: semua yang hadir di hajatan) atau kasus-kontrol (bila populasi terpapar tidak diketahui). Langkah 7 — PERBAIKI HIPOTESIS: bila data menolak hipotesis pertama, revisi — jangan paksakan. Langkah 8 — STUDI TAMBAHAN: laboratorium (kultur tinja, sisa makanan), lingkungan (suhu penyimpanan, sumber air). Langkah 9 — INTERVENSI: hentikan sumbernya — jangan tunggu laporan akhir. Langkah 10 — KOMUNIKASI: laporan tertulis dan lisan ke yang berwenang dan masyarakat.",
        "Dua prinsip yang mengikat semuanya. Pertama, intervensi tidak menunggu kepastian sempurna: bila bukti menunjuk ayam goreng, musnahkan sisa ayamnya hari itu — bukan setelah kultur keluar minggu depan. Kedua, investigasi adalah iterasi: hipotesis yang salah bukan kegagalan — ia adalah informasi yang mempersempit pencarian.",
      ],
      tasks: [],
      note: {
        title: "Kohor vs kasus-kontrol di lapangan",
        body: "Bila populasi terpapar diketahui (semua tamu hajatan), pakai kohor retrospektif — hitung attack rate per kelompok terpapar. Bila populasi terpapar TIDAK diketahui (wabah di kota besar), pakai kasus-kontrol — bandingkan paparan kasus dan kontrol. Memilih desain yang salah berarti tidak bisa menghitung ukuran yang dibutuhkan: kohor memberi RR, kasus-kontrol memberi OR.",
      },
      reference: "10 langkah CDC: siap, verifikasi, definisi kasus, deskripsi, hipotesis, uji, perbaiki, studi tambahan, intervensi, komunikasi.",
    },
    {
      id: "kurva-attack-rate",
      eyebrow: "Langkah 4 · Teori",
      title: "Kurva epidemi dan attack rate: membaca wabah dari angkanya",
      prose: [
        "Kurva epidemi adalah histogram kasus menurut waktu onset — dan bentuknya adalah diagnosis. POINT SOURCE: satu puncak tajam, semua kasus dalam satu masa inkubasi — satu paparan, satu waktu (hajatan kita: puncak 36 jam setelah makan). COMMON SOURCE BERKELANJUTAN: puncak lebar dan mendatar — paparan terus terjadi (air tercemar yang terus diminum). PROPAGATED: puncak-puncak yang makin tinggi dengan jarak satu masa inkubasi — penularan antar-orang, tiap generasi lebih besar dari sebelumnya.",
        "Attack rate adalah insidens dalam kelompok terpapar selama wabah: kasus dibagi populasi berisiko. Pada yang makan: 48 dibagi 120 sama dengan 40 persen. Pada yang tidak makan: 10 dibagi 200 sama dengan 5 persen. Rasio risiko sama dengan 40 dibagi 5 sama dengan 8,0 — yang makan berisiko 8 kali lipat. Perbedaan attack rate: 40 dikurangi 5 sama dengan 35 poin persentase — ukuran dampak absolut yang kadang lebih penting dari rasio.",
        "Fraksi yang dapat diatribusikan pada kelompok terpapar sama dengan (RR dikurangi 1) dibagi RR: (8 dikurangi 1) dibagi 8 sama dengan 87,5 persen — dari kasus pada yang makan, 87,5 persen disebabkan paparan itu; sisanya 12,5 persen akan terjadi juga tanpa paparan (latar 5 persen). Angka ini menjawab pertanyaan intervensi: 'bila paparan ini dihilangkan, berapa kasus yang dicegah?' — 87,5 persen dari kasus terpapar.",
        "Masa inkubasi dibaca dari kurva: jarak dari paparan ke puncak adalah perkiraan median inkubasi — 36 jam dalam kasus kita. Bila median inkubasi 36 jam dan rentang kasus 12 sampai 72 jam, patogen yang masa inkubasinya 6 jam atau 7 hari bisa disingkirkan dari daftar tersangka. Kurva epidemi mempersempit daftar patogen sebelum laboratorium bekerja.",
      ],
      tasks: [],
      note: {
        title: "Attack rate bukan prevalensi",
        body: "Attack rate mengukur kasus BARU selama periode wabah pada populasi berisiko — ia adalah insidens kumulatif, bukan prevalensi. Kesalahan umum: membagi kasus dengan SELURUH penduduk desa, termasuk yang tidak hadir di hajatan — pembagi yang salah mengecilkan attack rate dan mengaburkan perbedaan antar-kelompok. Pembagi yang benar adalah populasi yang berisiko terpapar.",
      },
      reference: "Point source: satu puncak dalam satu inkubasi. RR 8,0; selisih AR 35 poin; fraksi atributabel 87,5 persen; median inkubasi 36 jam.",
    },
    {
      id: "lab-wabah",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung attack rate, RR, dan fraksi atributabel",
      prose: [
        "Lab ini membangun kalkulator investigasi wabah: dari kasus dan populasi terpapar dan tidak terpapar — hitung attack rate terpapar, attack rate tidak terpapar, rasio risiko, dan fraksi yang dapat diatribusikan.",
        "Hitung dulu di kepala. Attack rate terpapar: 48 dibagi 120 dikali 100 sama dengan 40 persen. Attack rate tidak terpapar: 10 dibagi 200 dikali 100 sama dengan 5 persen. Rasio risiko: 40 dibagi 5 sama dengan 8,0. Fraksi atributabel: (8 dikurangi 1) dibagi 8 dikali 100 sama dengan 87,5 persen.",
        "Tugas lab: tulis fungsi yang menerima kasus terpapar, populasi terpapar, kasus tidak terpapar, dan populasi tidak terpapar — lalu mencetak empat angka: ar_terpapar, ar_tidak_terpapar, rr, fraksi_atributabel. Empat angka ini adalah inti laporan investigasi yang dibaca kepala dinas kesehatan sebelum memutuskan intervensi.",
        "Setelah lolos, coba eksperimen: pecah menurut menu — ayam goreng 39 kasus dari 75 yang makan (52 persen) vs nasi saja 4 dari 50 (8 persen) — dan lihat RR menjadi 6,5. Lalu tanyakan: mengapa RR menu lebih kecil dari RR hajatan keseluruhan, dan apa artinya bagi intervensi?",
      ],
      tasks: [
        { id: "t1", text: "Hitung attack rate kelompok terpapar dan tidak terpapar" },
        { id: "t2", text: "Hitung rasio risiko" },
        { id: "t3", text: "Hitung fraksi yang dapat diatribusikan pada kelompok terpapar" },
      ],
      expected: "ar_terpapar=40.0\nar_tidak_terpapar=5.0\nrr=8.0\nfraksi_atributabel=87.5",
      hints: [
        "Attack rate persen = kasus dibagi populasi, dikali 100.",
        "RR = attack rate terpapar dibagi attack rate tidak terpapar.",
        "Fraksi atributabel persen = (RR - 1) / RR x 100.",
        "RR memakai attack rate dalam persen atau proporsi — hasilnya sama.",
      ],
      code: {
        starter: `# Kalkulator investigasi wabah: hajatan Desa X.\nkasus_terpapar = 48\npop_terpapar = 120\nkasus_tidak = 10\npop_tidak = 200\n\n# TULIS KODEMU: hitung empat angka investigasi di bawah ini.\n# Cetak, per baris: ar_terpapar, ar_tidak_terpapar, rr,\n# fraksi_atributabel.\n\n\nkalkulator_wabah(kasus_terpapar, pop_terpapar, kasus_tidak, pop_tidak)`,
        lockLines: 4,
        solution: `# Kalkulator investigasi wabah: hajatan Desa X.\nkasus_terpapar = 48\npop_terpapar = 120\nkasus_tidak = 10\npop_tidak = 200\n\n\ndef kalkulator_wabah(kasus_terpapar, pop_terpapar, kasus_tidak, pop_tidak):\n    ar_terpapar = kasus_terpapar / pop_terpapar * 100\n    ar_tidak_terpapar = kasus_tidak / pop_tidak * 100\n    rr = ar_terpapar / ar_tidak_terpapar\n    fraksi_atributabel = (rr - 1) / rr * 100\n    print(f"ar_terpapar={ar_terpapar}")\n    print(f"ar_tidak_terpapar={ar_tidak_terpapar}")\n    print(f"rr={rr}")\n    print(f"fraksi_atributabel={fraksi_atributabel}")\n\n\nkalkulator_wabah(kasus_terpapar, pop_terpapar, kasus_tidak, pop_tidak)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "ar_terpapar=40.0", label: "AR terpapar 40 persen", msg: "48 / 120 x 100 = 40 persen." },
          { kind: "stdout_matches", task: "t1", pattern: "ar_tidak_terpapar=5.0", label: "AR tidak terpapar 5 persen", msg: "10 / 200 x 100 = 5 persen. Ini latar — kasus yang terjadi tanpa paparan." },
          { kind: "stdout_matches", task: "t2", pattern: "rr=8.0", label: "RR 8,0", msg: "40 / 5 = 8,0. Yang makan berisiko 8 kali lipat." },
          { kind: "stdout_matches", task: "t3", pattern: "fraksi_atributabel=87.5", label: "Fraksi atributabel 87,5 persen", msg: "(8-1)/8 x 100 = 87,5 persen kasus terpapar disebabkan paparan — dan bisa dicegah." },
        ],
      },
      reference: "AR terpapar 40 persen; AR tidak terpapar 5 persen; RR 8,0; fraksi atributabel 87,5 persen.",
    },
    {
      id: "intervensi",
      eyebrow: "Langkah 6 · Teori",
      title: "Intervensi: sumber, jalur, atau pejamu",
      prose: [
        "Intervensi wabah punya tiga sasaran. SUMBER: hilangkan atau kendalikan sumbernya — musnahkan sisa makanan, tutup sumur tercemar, obati karier. JALUR: putus jalur penularan — air direbus, makanan disimpan dingin, tangan dicuci, vektor dikendalikan. PEJAMU: lindungi yang rentan — vaksinasi, profilaksis, edukasi. Intervensi terbaik menyerang ketiganya — tetapi bila harus memilih satu, pilih yang memutus rantai paling cepat.",
        "Waktu adalah segalanya: intervensi yang datang setelah puncak kurva sebagian besar hanya mendokumentasikan wabah, bukan menghentikannya. Aturan lapangan: intervensi dimulai saat hipotesis cukup kuat — bukan saat bukti sempurna. Dalam kasus kita, sisa ayam dimusnahkan Sabtu siang — sebelum kultur tinja keluar. Bila tim menunggu kultur, hajatan berikutnya sudah terjadi.",
        "Komunikasi adalah bagian dari intervensi, bukan sesudahnya. Masyarakat perlu tahu: apa yang terjadi, apa yang harus dilakukan, dan apa yang TIDAK perlu ditakuti. Pesan yang gagal: 'jangan makan ayam' tanpa penjelasan — menimbulkan panik dan mengabaikan sumber lain. Pesan yang berhasil: 'ayam hajatan semalam disimpan pada suhu ruang — jangan makan sisanya; cuci tangan; datang ke puskesmas bila diare' — spesifik, bisa dilakukan, dan jujur tentang apa yang diketahui dan belum diketahui.",
      ],
      tasks: [],
      note: {
        title: "Intervensi tanpa menunggu laporan akhir",
        body: "Kesalahan klasik tim baru: menulis laporan dulu, bertindak kemudian. Urutan yang benar: bertindak saat hipotesis cukup kuat, menulis sambil bertindak, melengkapi laporan sesudahnya. Laporan yang sempurna tentang wabah yang sudah menyebar ke tiga desa adalah kegagalan — laporan yang kasar tentang wabah yang berhenti di satu desa adalah keberhasilan.",
      },
      reference: "Tiga sasaran: sumber, jalur, pejamu. Bertindak saat hipotesis cukup kuat — jangan tunggu bukti sempurna.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: hajatan kedua yang tidak terjadi",
      prose: [
        "Kembali ke desa. Seminggu setelah wabah pertama, ada hajatan kedua — dengan menu yang sama dan dapur yang sama. Kali ini tim sudah di sana: ayam disimpan dingin sejak dimasak, sisa makanan tidak disimpan semalaman, dan satu petugas memeriksa suhu penyimpanan. Hasilnya: nol kasus.",
        "Tiga hal yang membuat pencegahan ini berhasil. Pertama, sumbernya diketahui spesifik — ayam goreng yang disimpan semalaman — bukan 'makanan hajatan' secara umum. Kedua, intervensinya spesifik dan bisa dilakukan — suhu dingin, bukan larangan hajatan. Ketiga, tim kembali — pencegahan tanpa kunjungan ulang adalah harapan, bukan program.",
        "Bila tim hanya menulis laporan tanpa kembali, hajatan kedua akan mengulang wabah pertama — dan laporan itu menjadi bukti bahwa mereka tahu tetapi tidak mencegah. Investigasi lapangan diukur dari kasus yang TIDAK terjadi.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Pelajaran umumnya: investigasi wabah bukan penelitian — ia adalah tindakan kesehatan masyarakat dengan tenggat. Angka yang dihitung (RR 8,0, fraksi 87,5 persen) bukan untuk makalah — melainkan untuk memutuskan apa yang dimusnahkan hari ini dan apa yang diubah minggu depan. Bila angkamu tidak mengubah tindakan, angkamu belum cukup tajam.",
      },
      reference: "Hajatan kedua: nol kasus. Pencegahan diukur dari kasus yang tidak terjadi.",
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
        "10 langkah CDC: siap → verifikasi → definisi kasus → deskripsi → hipotesis → uji → perbaiki → studi tambahan → intervensi → komunikasi.",
        "Kurva: point source satu puncak; propagated puncak berulang makin tinggi.",
        "Lab: AR terpapar 40 persen; AR tidak terpapar 5 persen; RR 8,0; fraksi atributabel 87,5 persen.",
        "Median inkubasi dibaca dari jarak paparan ke puncak kurva.",
        "Intervensi: sumber, jalur, pejamu — bertindak saat hipotesis cukup kuat.",
      ],
      next: { label: "HD37 — CDSS: Sistem Pendukung Keputusan Klinis", href: "/v2/learn/hd37-cdss" },
      quiz: [
        {
          q: "Wabah hajatan: 48 kasus dari 120 yang makan; 10 kasus dari 200 yang tidak makan. Berapa AR terpapar, AR tidak terpapar, RR, dan fraksi atributabel?",
          options: [
            { text: "40 persen; 5 persen; 8,0; 87,5 persen", why: "Tepat: 48/120 = 40 persen; 10/200 = 5 persen; 40/5 = 8,0; (8-1)/8 = 87,5 persen.", correct: true },
            { text: "40 persen; 5 persen; 8,0; 12,5 persen", why: "Salah: 12,5 persen adalah (1/8) — kebalikan fraksi atributabel. Fraksi yang disebabkan paparan adalah (RR-1)/RR = 87,5 persen." },
            { text: "48 persen; 10 persen; 4,8; 79,2 persen", why: "Salah: 48 dan 10 adalah JUMLAH kasus, bukan persen. Attack rate membagi dengan populasi." },
            { text: "40 persen; 5 persen; 35,0; 87,5 persen", why: "Salah: 35 adalah SELISIH attack rate (poin persentase), bukan rasio risiko. RR adalah 40/5 = 8,0." },
          ],
        },
        {
          q: "Kurva epidemi menunjukkan satu puncak tajam 36 jam setelah hajatan, semua kasus dalam satu masa inkubasi. Apa polanya?",
          options: [
            { text: "Propagated — penularan antar-orang", why: "Salah: propagated punya puncak berulang yang makin tinggi, tiap generasi satu inkubasi." },
            { text: "Point source — satu paparan, satu waktu", why: "Tepat: satu puncak dalam satu masa inkubasi adalah sidik jari point source.", correct: true },
            { text: "Common source berkelanjutan — paparan terus terjadi", why: "Salah: itu puncaknya lebar dan mendatar, bukan tajam — paparan terus-menerus, bukan sekali." },
            { text: "Bukan wabah — hanya variasi acak", why: "Salah: 48 kasus semalam di desa yang biasanya 2 per minggu bukan variasi acak." },
          ],
        },
        {
          q: "Mengapa definisi kasus harus ditulis SEBELUM wawancara dimulai?",
          options: [
            { text: "Supaya laporan terlihat rapi", why: "Salah: kerapian bukan alasannya — konsistensi penghitunganlah alasannya." },
            { text: "Supaya tiap pewawancara menghitung orang yang sama sebagai kasus — tanpa definisi, angka tidak bisa dibandingkan", why: "Tepat: definisi kasus adalah alat ukur. Alat ukur yang berbeda memberi angka yang berbeda.", correct: true },
            { text: "Supaya pasien tahu mereka masuk penelitian", why: "Salah: definisi kasus adalah alat investigasi, bukan informed consent — meski etika tetap berlaku." },
            { text: "Definisi kasus tidak penting — yang penting jumlah kasusnya", why: "Salah: jumlah tanpa definisi adalah angka tanpa arti — 48 'kasus' bisa berarti 48 hal berbeda." },
          ],
        },
        {
          q: "Bukti menunjuk ayam goreng, tetapi kultur tinja baru keluar minggu depan. Apa tindakan yang benar?",
          options: [
            { text: "Tunggu kultur — bertindak tanpa bukti laboratorium adalah spekulasi", why: "Salah: menunggu berarti membiarkan hajatan berikutnya terjadi. Intervensi dimulai saat hipotesis cukup kuat." },
            { text: "Musnahkan sisa ayam dan bina dapur sekarang; lengkapi dengan hasil kultur sesudahnya", why: "Tepat: intervensi tidak menunggu kepastian sempurna — ia menunggu hipotesis yang cukup kuat.", correct: true },
            { text: "Tutup seluruh desa — lebih aman", why: "Salah: intervensi harus setajam buktinya. Menutup desa untuk wabah point source adalah respons yang tidak proporsional." },
            { text: "Umumkan bahwa ayam goreng berbahaya di mana-mana", why: "Salah: buktinya spesifik — ayam hajatan itu, disimpan semalaman. Generalisasi menimbulkan panik tanpa dasar." },
          ],
        },
        {
          q: "Ayam goreng: 39 kasus dari 75 yang makan (52 persen). Nasi saja: 4 dari 50 (8 persen). Berapa RR ayam goreng vs nasi saja?",
          options: [
            { text: "6,5", why: "Tepat: 52/8 = 6,5. Lebih kecil dari RR hajatan keseluruhan (8,0) karena pembandingnya berbeda — nasi saja bukan 'tidak makan apa pun'.", correct: true },
            { text: "8,0", why: "Salah: 8,0 adalah RR 'makan di hajatan' vs 'tidak makan'. RR menu memakai pembanding menu lain." },
            { text: "44,0", why: "Salah: 44 adalah selisih poin persentase (52-8), bukan rasio." },
            { text: "0,15", why: "Salah: 0,15 adalah kebalikan (8/52) — RR dibaca dari kelompok berisiko lebih tinggi dibagi yang lebih rendah." },
          ],
        },
      ],
    },
  ],
};

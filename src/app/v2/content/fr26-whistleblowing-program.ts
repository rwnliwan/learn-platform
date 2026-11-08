import type { V2Lesson } from "../lib/types";

export const fr26: V2Lesson = {
  slug: "fr26-whistleblowing-program",
  track: "Fraud & AML Analytics",
  module: "Governance & Pelaporan",
  title: "FR26 — Whistleblowing Program: Saluran yang Berani Dipakai",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Saluran yang sepi, fraud yang ramai",
      prose: [
        "Sebuah bank memasang hotline whistleblowing, kotak saran anonim, dan alamat email khusus. Setahun berlalu: 240 laporan masuk. Sembilan puluh enam terbukti — 40 persen. Seratus enam puluh delapan laporan datang secara anonim — 70 persen. Tetapi enam pelapor mengeluh mendapat pembalasan, dan satu kasus besar — Rp4,2 miliar yang dicuri teller selama 14 bulan — baru terungkap setelah pelapor ketiga berani bicara, karena dua laporan pertama tidak pernah ditindaklanjuti.",
        "Pelajaran pahitnya: saluran whistleblowing bukan soal memasang nomor telepon. Ia soal kepercayaan: apakah pelapor percaya ia aman, apakah ia percaya laporannya dibaca, dan apakah ia percaya sesuatu akan berubah. Lesson ini mengajarkan merancang program whistleblowing sebagai sistem — saluran, triase, perlindungan, tindak lanjut — dan mengukurnya dengan angka, bukan dengan niat baik.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Whistleblowing hanya disinggung dua kali: FR23 menyebut saluran sebagai detektor asap termurah dalam satu paragraf, dan FR20 menyebutnya sebagai cara mengungkap kolusi internal dalam satu kalimat. Tidak ada lesson yang merancang programnya — saluran, triase, SLA, perlindungan dari pembalasan, dan metriknya. Lesson ini membangun semuanya.",
      },
      reference: "240 laporan, 96 terbukti (40 persen), 168 anonim (70 persen), 6 keluhan pembalasan.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang dan menilai program whistleblowing dari datanya.",
        "(1) Menjelaskan empat elemen program whistleblowing yang bekerja;",
        "(2) Menghitung substantiation rate, pangsa anonim, dan biaya per kasus terbukti;",
        "(3) Merancang triase dengan SLA yang bisa dipegang;",
        "(4) Menjelaskan perlindungan dari pembalasan sebagai syarat kepercayaan;",
        "(5) Menilai kesehatan program dari tren laporan, bukan dari jumlah laporan semata.",
      ],
      tasks: [],
    },
    {
      id: "empat-elemen",
      eyebrow: "Langkah 3 · Teori",
      title: "Empat elemen: saluran, triase, perlindungan, tindak lanjut",
      prose: [
        "Elemen pertama: saluran yang benar-benar bisa dijangkau. Bukan satu nomor telepon, melainkan beberapa pintu — hotline, formulir web anonim, kotak fisik, dan jalur ke pihak ketiga independen. Alasannya sederhana: pelapor yang takut pada atasannya tidak akan melapor lewat email kantor. Dalam data cerita pembuka, 70 persen laporan datang anonim — bila saluran anonim dihapus, program kehilangan 70 persen matanya.",
        "Elemen kedua: triase dengan SLA tertulis. Setiap laporan mendapat nomor tiket, diklasifikasikan dalam 3 hari kerja (median di cerita pembuka: 3 hari, target 5 hari), dan diberi pemilik. Laporan tentang fraud yang sedang berjalan didahulukan atas laporan tentang pelanggaran kebijakan lama. Tanpa SLA, laporan menumpuk di kotak masuk seseorang — dan seperti dua laporan pertama tentang teller Rp4,2 miliar itu, tidak pernah dibaca sampai terlambat.",
        "Elemen ketiga dan keempat: perlindungan dari pembalasan, dan tindak lanjut yang terlihat. Perlindungan berarti aturan tertulis — pelapor tidak boleh dimutasi, dinilai buruk, atau dipecat karena melapor — plus pemantauan: tim HR memeriksa nasib pelapor 3 dan 6 bulan setelah laporan. Tindak lanjut berarti pelapor diberi tahu hasilnya ('laporanmu ditindaklanjuti, kasus ditutup dengan temuan') tanpa membocorkan detail rahasia. Satu laporan yang masuk dan tidak pernah ditindaklanjuti membunuh saluran itu selamanya — karena pelapor bercerita ke rekan-rekannya.",
      ],
      tasks: [],
      note: {
        title: "Anonimitas yang palsu lebih buruk daripada tidak ada",
        body: "Saluran yang mengklaim anonim tetapi meminta login email kantor atau mencatat nomor telepon adalah jebakan: pelapor yang ketahuan identitasnya setelah dijanjikan anonim tidak akan pernah melapor lagi — dan akan memperingatkan semua orang. Uji anonimitas dari sisi pelapor: bisakah seseorang melapor tanpa meninggalkan jejak identitas apa pun? Dan jujurlah tentang batasnya: anonimitas penuh tidak selalu mungkin — laporan lewat email kantor atau sistem yang mencatat IP tetap meninggalkan jejak. Yang dijanjikan haruslah apa yang benar-benar bisa dijamin (misalnya: identitas tidak dicatat, tidak dilacak, dan tidak dibuka ke atasan pelapor) — bukan anonimitas absolut yang tidak bisa ditepati.",
      },
      reference: "Empat elemen: saluran, triase (SLA 3 hari), perlindungan, tindak lanjut yang terlihat.",
    },
    {
      id: "metrik",
      eyebrow: "Langkah 4 · Teori",
      title: "Mengukur program: substantiation rate dan biaya per kasus",
      prose: [
        "Tiga angka menilai kesehatan program. Substantiation rate: laporan terbukti dibagi total laporan — 96 dibagi 240 sama dengan 40,0 persen. Angka ini bukan nilai ujian: kisaran 30–50 persen adalah PATOKAN INTERNAL yang dipakai di lesson ini — bukan standar industri yang dikutip dari sumber tertentu. Bandingkan dengan program sejenis sebelum menjadikannya target; yang penting adalah tren dan tindak lanjutnya, bukan angkanya semata. Terlalu rendah (di bawah 15 persen) berarti saluran dipakai untuk pengaduan personal dan fitnah; terlalu tinggi (di atas 70 persen) berarti orang hanya melapor saat sudah yakin — dan banyak fraud kecil tidak pernah dilaporkan karena pelapor takut salah.",
        "Pangsa anonim: 168 dibagi 240 sama dengan 70,0 persen. Pangsa anonim yang tinggi bukan masalah — ia tanda kepercayaan pada jaminan anonimitas. Yang perlu diwaspadai adalah tren: bila pangsa anonim turun tajam sementara total laporan tetap, mungkin ada kebocoran identitas yang beredar sebagai gosip. Biaya per kasus terbukti: anggaran Rp480 juta dibagi 96 kasus terbukti sama dengan Rp5 juta per kasus. Bandingkan dengan satu kasus yang dicegah — rata-rata Rp150 juta menurut FR20 — dan program membayar dirinya 30 kali lipat.",
        "Satu metrik yang sering salah dibaca: jumlah laporan. Kenaikan laporan bukan kabar buruk — ia bisa berarti kepercayaan naik. Penurunan laporan bukan kabar baik — ia bisa berarti saluran sudah mati dan orang berhenti percaya. Baca jumlah laporan bersama substantiation rate dan waktu tindak lanjut: laporan naik + substantiation stabil + SLA terpenuhi berarti program sehat; laporan turun + keluhan pembalasan naik berarti program sekarat.",
      ],
      tasks: [],
      note: {
        title: "Enam keluhan pembalasan adalah enam terlalu banyak",
        body: "Dalam cerita pembuka, 6 dari 240 pelapor mengeluh mendapat pembalasan — 2,5 persen. Angka kecil ini bukan toleransi: satu kasus pembalasan yang terbukti dan tidak dihukum menghancurkan kepercayaan lebih cepat daripada seratus laporan yang berhasil. Target program yang serius adalah nol kasus pembalasan yang tidak ditindak.\n\nTata kelola investigasi (yang tidak terlihat di angka): Triase independen — laporan tidak ditriase oleh orang yang dilaporkan. Eskalasi — bila terlapor adalah atasan langsung atau pimpinan, laporan naik ke komite independen, bukan berhenti di jalurnya. Konflik kepentingan — investigator yang punya hubungan dengan terlapor wajib mundur dan diganti. Dan perlindungan pelapor — nasib pelapor dipantau pada bulan ke-3 dan ke-6, seperti di cerita pembuka. Tanpa tata kelola ini, saluran yang ramai pun hanya kotak saran yang tidak pernah ditindaklanjuti.",
      },
      reference: "Substantiation 40,0 persen; anonim 70,0 persen; biaya Rp5 jt per kasus terbukti.",
    },
    {
      id: "lab-whistle",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menilai kesehatan program whistleblowing",
      prose: [
        "Lab ini menghitung tiga metrik program dari data setahun: substantiation rate, pangsa anonim, dan biaya per kasus terbukti. Hitung dulu di kepala. Substantiation: 96 dibagi 240 dikali 100 sama dengan 40,0 persen. Anonim: 168 dibagi 240 dikali 100 sama dengan 70,0 persen. Biaya per kasus: 480 dibagi 96 sama dengan 5,0 juta.",
        "Tugas lab: isi tiga variabel — subst_rate, anon_rate, biaya_per_kasus — lalu cetak ketiganya. Tiga angka ini adalah dashboard triwulanan program ke komite audit: apakah saluran dipercaya, apakah ia menangkap kasus nyata, dan apakah ia sepadan dengan biayanya.",
        "Setelah lolos, coba eksperimen: turunkan laporan terbukti menjadi 36 dan lihat substantiation jatuh ke 15,0 persen — lalu tanyakan: apakah saluran itu masih detektor fraud, atau sudah menjadi kotak pengaduan? Jawabannya ada di langkah sebelumnya: di bawah 15 persen, program butuh kampanye edukasi tentang apa yang layak dilaporkan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung substantiation rate dalam persen" },
        { id: "t2", text: "Hitung pangsa laporan anonim dalam persen" },
        { id: "t3", text: "Hitung biaya program per kasus terbukti (Rp juta)" },
      ],
      expected: "subst_rate=40.0\nanon_rate=70.0\nbiaya_per_kasus=5.0",
      hints: [
        "Substantiation rate = laporan terbukti dibagi total laporan, dikali 100.",
        "Pangsa anonim = laporan anonim dibagi total laporan, dikali 100.",
        "Biaya per kasus = anggaran dibagi jumlah kasus terbukti.",
      ],
      code: {
        starter: "# Program whistleblowing setahun (Rp juta). JANGAN UBAH.\ntotal_laporan = 240\nterbukti = 96\nanonim = 168\nanggaran = 480\n\n# TULIS KODEMU: substantiation rate, pangsa anonim, biaya per kasus\nsubst_rate = \nanon_rate = \nbiaya_per_kasus = \nprint(f\"subst_rate={round(subst_rate, 1)}\")\nprint(f\"anon_rate={round(anon_rate, 1)}\")\nprint(f\"biaya_per_kasus={round(biaya_per_kasus, 1)}\")",
        lockLines: 6,
        solution: "# Program whistleblowing setahun (Rp juta). JANGAN UBAH.\ntotal_laporan = 240\nterbukti = 96\nanonim = 168\nanggaran = 480\n\n# TULIS KODEMU: substantiation rate, pangsa anonim, biaya per kasus\nsubst_rate = terbukti / total_laporan * 100\nanon_rate = anonim / total_laporan * 100\nbiaya_per_kasus = anggaran / terbukti\nprint(f\"subst_rate={round(subst_rate, 1)}\")\nprint(f\"anon_rate={round(anon_rate, 1)}\")\nprint(f\"biaya_per_kasus={round(biaya_per_kasus, 1)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "subst_rate=40.0", label: "Substantiation 40,0 persen", msg: "96 / 240 x 100 = 40,0. Kisaran sehat 30-50 persen." },
          { kind: "stdout_matches", task: "t2", pattern: "anon_rate=70.0", label: "Anonim 70,0 persen", msg: "168 / 240 x 100 = 70,0. Pangsa anonim tinggi = kepercayaan pada jaminan anonimitas." },
          { kind: "stdout_matches", task: "t3", pattern: "biaya_per_kasus=5.0", label: "Biaya Rp5,0 jt per kasus", msg: "480 / 96 = 5,0. Satu kasus yang dicegah (rata-rata Rp150 jt) membayar 30 kali lipat." },
        ],
      },
      reference: "Substantiation 40,0 persen; anonim 70,0 persen; biaya Rp5,0 jt per kasus terbukti.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: laporan ketiga tentang teller yang sama",
      prose: [
        "Dua laporan pertama tentang teller itu masuk lewat kotak saran — tanpa nomor tiket, tanpa pemilik, tanpa SLA. Keduanya tenggelam. Laporan ketiga masuk lewat hotline pihak ketiga independen, mendapat nomor tiket, diklasifikasikan dalam 2 hari, dan pemiliknya adalah investigator senior. Dalam tiga minggu, pola ketahuan: teller memindahkan Rp4,2 miliar lewat 31 transaksi kecil selama 14 bulan, masing-masing di bawah ambang review manual.",
        "Perbedaan antara laporan pertama dan ketiga bukan isi — ketiganya berkata hal yang sama. Perbedaannya adalah sistem: tiket, SLA, pemilik, dan perlindungan. Pelapor ketiga berani bicara karena ia tahu identitasnya tidak sampai ke cabang tempat teller itu bekerja. Pelapor pertama dan kedua diam setelah laporan mereka tidak berbuah — dan diam mereka berharga Rp4,2 miliar.",
        "Setelah kasus itu, bank mengubah tiga hal: semua saluran masuk ke satu antrean bertiket, SLA klasifikasi 3 hari ditulis di kebijakan, dan HR memantau nasib setiap pelapor anonim yang teridentifikasi secara sukarela pada bulan ke-3 dan ke-6. Setahun kemudian, laporan naik dari 240 menjadi 310 — dan substantiation rate tetap 40 persen. Kenaikan itu dirayakan, bukan ditakuti: saluran yang dipercaya memang ramai.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat laporan ketiga berhasil. Pertama, satu antrean bertiket — tidak ada laporan yang bisa tenggelam diam-diam. Kedua, SLA dan pemilik yang jelas — seseorang bertanggung jawab. Ketiga, perlindungan yang nyata — pelapor berani karena identitasnya tidak sampai ke cabang. Sistem, bukan keberanian individu, yang menangkap fraud.",
      },
      reference: "Rp4,2 miliar, 31 transaksi, 14 bulan — terungkap oleh laporan ketiga yang bertiket.",
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
        "Empat elemen: saluran, triase (SLA 3 hari), perlindungan, tindak lanjut yang terlihat.",
        "Lab: substantiation 40,0 persen; anonim 70,0 persen; biaya Rp5,0 jt per kasus terbukti.",
        "Substantiation sehat 30–50 persen; di bawah 15 persen berarti saluran disalahgunakan.",
        "Satu laporan yang tidak ditindaklanjuti membunuh saluran selamanya.",
        "Laporan naik + substantiation stabil = kepercayaan naik, bukan fraud naik.",
      ],
      next: { label: "FR27 — Teknik Investigasi: Bukti, Rantai, dan Wawancara", href: "/v2/learn/fr27-teknik-investigasi" },
      quiz: [
        {
          q: "240 laporan, 96 terbukti, anggaran Rp480 juta. Berapa substantiation rate dan biaya per kasus terbukti?",
          options: [
            { text: "40,0 persen dan Rp5,0 juta", why: "Tepat: 96/240 = 40,0 persen; 480/96 = 5,0.", correct: true },
            { text: "40,0 persen dan Rp2,0 juta — anggaran dibagi total laporan", why: "Salah: biaya per kasus terbukti memakai pembagi kasus TERBUKTI (96), bukan total laporan." },
            { text: "60,0 persen dan Rp5,0 juta", why: "Salah: 96/240 = 40,0 persen, bukan 60,0. Jangan tertukar dengan pangsa yang tidak terbukti." },
            { text: "25,0 persen dan Rp20,0 juta", why: "Salah: tidak ada kombinasi definisi yang menghasilkan angka ini." },
          ],
        },
        {
          q: "Substantiation rate sebuah program 8 persen. Apa diagnosis yang paling mungkin?",
          options: [
            { text: "Program sangat sehat — hampir semua laporan ditolak dengan cepat", why: "Salah: 8 persen jauh di bawah kisaran sehat 30–50 persen. Penolakan cepat bukan keberhasilan." },
            { text: "Saluran dipakai untuk pengaduan personal dan fitnah — butuh edukasi tentang apa yang layak dilaporkan", why: "Tepat: di bawah 15 persen, saluran bukan lagi detektor fraud.", correct: true },
            { text: "Fraud di perusahaan sudah hampir nol", why: "Salah: substantiation rendah tidak membuktikan fraud rendah — ia membuktikan saluran tidak menangkap fraud." },
            { text: "Investigator terlalu lambat", why: "Salah: kelambatan memengaruhi waktu tindak lanjut, bukan proporsi laporan yang terbukti." },
          ],
        },
        {
          q: "Jumlah laporan turun dari 240 menjadi 120 dalam setahun, substantiation tetap 40 persen. Apa bacaan yang benar?",
          options: [
            { text: "Kabar baik — fraud berkurang separuh", why: "Salah: jumlah laporan bukan jumlah fraud. Penurunan bisa berarti orang berhenti percaya pada saluran." },
            { text: "Perlu diselidiki: mungkin saluran mati, ada kebocoran identitas, atau laporan tidak ditindaklanjuti", why: "Tepat: laporan turun + substantiation stabil = sinyal kepercayaan, bukan sinyal fraud. Selidiki dulu.", correct: true },
            { text: "Kabar baik — program makin efisien", why: "Salah: efisiensi diukur dari biaya per kasus dan SLA, bukan dari sepinya laporan." },
            { text: "Tidak ada arti — jumlah laporan memang fluktuatif", why: "Salah: penurunan 50 persen bukan fluktuasi biasa. Itu perubahan yang butuh penjelasan." },
          ],
        },
        {
          q: "Seorang pelapor anonim mengeluh dimutasi ke cabang terpencil dua bulan setelah melapor. Apa respons yang benar?",
          options: [
            { text: "Anggap kebetulan — mutasi adalah wewenang manajemen", why: "Salah: pembalasan yang tidak ditindak menghancurkan kepercayaan lebih cepat daripada seratus laporan yang berhasil." },
            { text: "Selidiki sebagai dugaan pembalasan, lindungi pelapor, dan hukum bila terbukti", why: "Tepat: target program yang serius adalah nol kasus pembalasan yang tidak ditindak.", correct: true },
            { text: "Minta pelapor membuktikan mutasinya karena laporan", why: "Salah: beban pembuktian tidak boleh diletakkan pada pelapor yang sudah berani bicara." },
            { text: "Tutup saluran anonim agar pelapor bisa diidentifikasi", why: "Salah: menutup anonimitas menghilangkan 70 persen mata program. Itu membunuh saluran, bukan melindunginya." },
          ],
        },
        {
          q: "Apa yang paling membedakan laporan ketiga tentang teller dari dua laporan pertama?",
          options: [
            { text: "Isinya lebih detail", why: "Salah: ketiganya berkata hal yang sama. Isi bukan pembedanya." },
            { text: "Sistemnya: tiket, SLA, pemilik, dan perlindungan identitas", why: "Tepat: laporan pertama tenggelam karena tanpa tiket dan pemilik; laporan ketiga ditindak karena sistemnya bekerja.", correct: true },
            { text: "Pelapor ketiga lebih senior", why: "Salah: senioritas pelapor tidak disebut dan bukan penentunya." },
            { text: "Jumlah kerugiannya lebih besar saat itu", why: "Salah: kerugian tumbuh karena dua laporan pertama diabaikan — bukan alasan laporan ketiga berhasil." },
          ],
        },
      ],
    },
  ],
};

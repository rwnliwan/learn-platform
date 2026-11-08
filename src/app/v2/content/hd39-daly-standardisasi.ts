import type { V2Lesson } from "../lib/types";

export const hd39: V2Lesson = {
  slug: "hd39-daly-standardisasi",
  track: "Health Data Science",
  module: "Kesehatan Populasi",
  title: "HD39 — DALY dan Standardisasi Umur: Mengukur Beban Penyakit",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kabupaten A terlihat lebih buruk — sampai umurnya disetarakan",
      prose: [
        "Dua kabupaten: A (penduduk tua) angka kematian kasar 20,0 per 1.000; B (penduduk muda) 12,0 per 1.000. A terlihat lebih buruk — tetapi penduduknya memang lebih tua. Setelah disetarakan dengan populasi standar, A menjadi 15,6 dan B menjadi 16,3 per 1.000 — ternyata B sedikit lebih buruk. Peringkatnya berbalik. Inilah yang dilakukan standardisasi umur: memaksa kedua populasi 'berlomba di trek yang sama'.",
        "Tetapi kematian bukan satu-satunya beban. Penyakit X di kabupaten itu membunuh 120 orang pada usia rata-rata 55 tahun — dengan harapan hidup 75 tahun, tiap kematian kehilangan 20 tahun: YLL 2.400 tahun. Penyakit yang sama membuat 800 orang hidup dengan disabilitas (bobot 0,25) selama 2 tahun: YLD 400 tahun. Total DALY 2.800 tahun — 560 per 100.000 penduduk. Kematian menceritakan sebagian; DALY menceritakan beban penuhnya.",
        "Lesson ini mengajarkan DALY dan standardisasi umur: YLL, YLD, bobot disabilitas, standardisasi langsung, dan perbandingan yang adil. Setelah lesson ini kamu bisa: (1) menjelaskan DALY sebagai YLL + YLD; (2) menghitung YLL, YLD, DALY, dan DALY per 100.000; (3) menjelaskan standardisasi umur langsung dan mengapa peringkat bisa berbalik; (4) menjelaskan bobot disabilitas dan batasnya; (5) memutuskan kapan memakai angka kasar, terstandardisasi, atau DALY.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Standardisasi umur sudah diajarkan HD3 dalam satu langkah — contoh A 20,0 vs B 12,0 yang berbalik menjadi 15,6 vs 16,3 setelah standardisasi — dan DALY hanya disebut sebagai konsep penimbang di HD23. Tidak ada lesson yang MENGAJARKAN beban penyakit sebagai sistem: rumus YLL dan YLD, bobot disabilitas, perhitungan DALY lengkap dengan lab, dan kapan memakai tiap ukuran. Lesson ini membangun sistem itu, dengan memakai contoh HD3 sebagai titik berangkat, bukan mengulanginya.",
      },
      reference: "Standardisasi: A 20,0 vs B 12,0 kasar menjadi 15,6 vs 16,3 terstandardisasi. DALY: YLL 2.400 + YLD 400 = 2.800; 560 per 100.000.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengukur beban penyakit — bukan hanya menghitung kematian.",
        "(1) Menjelaskan DALY = YLL + YLD dan arti tiap komponen;",
        "(2) Menghitung YLL dari kematian dan harapan hidup, YLD dari insidens, bobot, dan durasi;",
        "(3) Menghitung DALY total dan DALY per 100.000 penduduk;",
        "(4) Menjelaskan standardisasi umur langsung dan membaca pembalikan peringkat;",
        "(5) Memutuskan kapan memakai angka kasar, terstandardisasi, atau DALY.",
      ],
      tasks: [],
    },
    {
      id: "daly",
      eyebrow: "Langkah 3 · Teori",
      title: "DALY: satu angka untuk kematian dan penderitaan",
      prose: [
        "DALY — Disability-Adjusted Life Years — mengukur tahun hidup sehat yang hilang: DALY sama dengan YLL ditambah YLD. YLL (Years of Life Lost) mengukur kematian dini: jumlah kematian dikali harapan hidup yang tersisa pada usia kematian. Contoh kita: 120 kematian pada usia rata-rata 55 tahun, harapan hidup 75 — tiap kematian kehilangan 20 tahun: YLL sama dengan 120 dikali 20 sama dengan 2.400 tahun.",
        "YLD (Years Lived with Disability) mengukur hidup dengan penyakit: insidens dikali bobot disabilitas dikali durasi. Bobot disabilitas (DW) bernilai 0 (sehat sempurna) sampai 1 (kematian): 0,25 berarti hidup dengan kondisi itu setara dengan kehilangan 25 persen kesehatan. Contoh kita: 800 kasus baru dikali 0,25 dikali 2 tahun sama dengan 400 tahun. DALY total: 2.400 ditambah 400 sama dengan 2.800 tahun. Per 100.000 penduduk (populasi 500.000): 2.800 dibagi 500.000 dikali 100.000 sama dengan 560.",
        "Yang membuat DALY berguna: ia membandingkan penyakit yang berbeda dalam satu satuan. Penyakit yang membunuh sedikit tetapi melumpuhkan banyak (misalnya depresi, nyeri punggung) bisa punya DALY lebih besar dari penyakit yang membunuh banyak tetapi cepat (misalnya kecelakaan fatal pada usia tua). Tanpa DALY, anggaran mengalir ke penyakit yang membunuh — dengan DALY, anggaran bisa mengalir ke penyakit yang membebani.",
        "Tiga batas DALY yang harus diakui. Pertama, bobot disabilitas adalah PENILAIAN — ditentukan lewat survei preferensi masyarakat, dan nilainya diperdebatkan (apakah kebutaan 'bernilai' 0,19 atau 0,6?). Kedua, DALY menghitung tahun — bukan kualitas hidup yang tidak tertangkap bobot, dan bukan beban keluarga dan pengasuh. Ketiga, DALY memakai harapan hidup standar global — yang mungkin tidak cocok untuk konteks lokal. DALY adalah alat perbandingan, bukan kebenaran absolut — dan alat yang jujur menunjukkan batasnya.",
      ],
      tasks: [],
      note: {
        title: "YLL memakai harapan hidup standar",
        body: "YLL dihitung dengan harapan hidup STANDAR (misalnya tabel WHO), bukan harapan hidup lokal — supaya kematian pada usia 55 tahun 'bernilai' sama di semua negara. Bila memakai harapan hidup lokal yang rendah, kematian di negara miskin akan 'bernilai' lebih sedikit — dan itu adalah ketidakadilan yang disembunyikan dalam rumus. Pilihan tabel adalah pilihan etis, bukan teknis.",
      },
      reference: "DALY = YLL + YLD. YLL 120 x 20 = 2.400. YLD 800 x 0,25 x 2 = 400. DALY 2.800; 560 per 100.000.",
    },
    {
      id: "standardisasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Standardisasi umur: trek yang sama untuk semua",
      prose: [
        "Standardisasi langsung menghitung 'berapa angka kematian populasi ini BILA struktur umurnya sama dengan populasi standar'. Caranya: kalikan angka per kelompok umur dengan proporsi kelompok itu di populasi standar, lalu jumlahkan. Populasi standar bisa WHO World Standard, populasi nasional, atau gabungan kedua populasi yang dibandingkan — yang penting SAMA untuk semua yang dibandingkan.",
        "Contoh HD3 yang dipakai di sini: A kasar 20,0 per 1.000 vs B kasar 12,0 — A terlihat lebih buruk. Setelah standardisasi: A 15,6 vs B 16,3 — B sedikit lebih buruk. Pembalikan terjadi karena A punya lebih banyak penduduk tua (yang angka kematiannya memang tinggi di semua tempat) dan B lebih muda. Angka kasar menghukum daerah tua; angka terstandardisasi menghukum penyakitnya.",
        "Kapan memakai yang mana? Angka KASAR untuk perencanaan layanan — berapa bed dan obat yang dibutuhkan populasi INI, dengan struktur umur INI. Angka TERSTANDARDISASI untuk perbandingan — apakah program kesehatan A lebih baik dari B, atau apakah kematian naik dari tahun ke tahun. DALY untuk prioritas — penyakit mana yang paling membebani, dan ke mana anggaran harus mengalir. Tiga ukuran, tiga pertanyaan — dan memakai yang salah berarti menjawab pertanyaan yang salah.",
        "Satu jebakan: standardisasi tidak memperbaiki data yang buruk. Bila pencatatan kematian di kabupaten A hanya menangkap 60 persen kematian, angka terstandardisasinya tetap 40 persen terlalu rendah — hanya dengan cara yang lebih rapi. Standardisasi memperbaiki PERBANDINGAN, bukan KUALITAS data.",
      ],
      tasks: [],
      note: {
        title: "Simpson's paradox dalam kesehatan",
        body: "Pembalikan peringkat A vs B adalah contoh Simpson's paradox: agregat berkata A lebih buruk, tiap kelompok umur berkata B lebih buruk. Paradoks ini muncul setiap kali pembagi (struktur umur) berbeda antar-kelompok. Aturan: bila membandingkan dua populasi dengan struktur umur berbeda, JANGAN pernah memakai angka kasar — selalu standardisasi dulu, atau laporkan per kelompok umur.",
      },
      reference: "Standardisasi langsung: angka per kelompok umur x proporsi standar, dijumlahkan. Kasar untuk layanan; terstandardisasi untuk perbandingan; DALY untuk prioritas.",
    },
    {
      id: "lab-daly",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung YLL, YLD, dan DALY",
      prose: [
        "Lab ini membangun kalkulator beban penyakit: dari kematian, usia kematian, harapan hidup, insidens, bobot disabilitas, durasi, dan populasi — hitung YLL, YLD, DALY, dan DALY per 100.000.",
        "Hitung dulu di kepala. YLL: 120 kematian dikali (75 dikurangi 55) sama dengan 120 dikali 20 sama dengan 2.400 tahun. YLD: 800 kasus dikali 0,25 dikali 2 tahun sama dengan 400 tahun. DALY: 2.400 ditambah 400 sama dengan 2.800 tahun. DALY per 100.000: 2.800 dibagi 500.000 dikali 100.000 sama dengan 560.",
        "Tugas lab: tulis fungsi yang menerima kematian, usia kematian, harapan hidup, insidens, bobot, durasi, dan populasi — lalu mencetak empat angka: yll, yld, daly, daly_per_100k. Empat angka ini adalah satu baris profil beban penyakit yang dibaca perencana kesehatan sebelum mengalokasikan anggaran.",
        "Setelah lolos, coba eksperimen: naikkan bobot disabilitas menjadi 0,5 dan lihat YLD menjadi 800 dan DALY 3.200 — lalu tanyakan: seberapa yakin kamu pada bobot 0,25, dan apa yang terjadi pada prioritas anggaran bila bobot yang benar adalah 0,5?",
      ],
      tasks: [
        { id: "t1", text: "Hitung YLL dari kematian dan tahun yang hilang" },
        { id: "t2", text: "Hitung YLD dari insidens, bobot, dan durasi" },
        { id: "t3", text: "Hitung DALY total dan DALY per 100.000 penduduk" },
      ],
      expected: "yll=2400\nyld=400.0\ndaly=2800.0\ndaly_per_100k=560.0",
      hints: [
        "Tahun hilang per kematian = harapan hidup dikurangi usia kematian.",
        "YLL = kematian dikali tahun hilang.",
        "YLD = insidens dikali bobot dikali durasi.",
        "DALY per 100.000 = DALY dibagi populasi, dikali 100.000.",
      ],
      code: {
        starter: `# Kalkulator beban penyakit: penyakit X di kabupaten (populasi 500.000).\nkematian = 120\nusia_kematian = 55\nharapan_hidup = 75\ninsidens = 800\nbobot = 0.25\ndurasi = 2  # tahun\npopulasi = 500000\n\n# TULIS KODEMU: hitung empat angka beban di bawah ini.\n# Cetak, per baris: yll, yld, daly, daly_per_100k.\n\n\nkalkulator_daly(kematian, usia_kematian, harapan_hidup, insidens, bobot, durasi, populasi)`,
        lockLines: 7,
        solution: `# Kalkulator beban penyakit: penyakit X di kabupaten (populasi 500.000).\nkematian = 120\nusia_kematian = 55\nharapan_hidup = 75\ninsidens = 800\nbobot = 0.25\ndurasi = 2  # tahun\npopulasi = 500000\n\n\ndef kalkulator_daly(kematian, usia_kematian, harapan_hidup, insidens, bobot, durasi, populasi):\n    yll = kematian * (harapan_hidup - usia_kematian)\n    yld = insidens * bobot * durasi\n    daly = yll + yld\n    daly_per_100k = daly / populasi * 100000\n    print(f"yll={yll}")\n    print(f"yld={yld}")\n    print(f"daly={daly}")\n    print(f"daly_per_100k={daly_per_100k}")\n\n\nkalkulator_daly(kematian, usia_kematian, harapan_hidup, insidens, bobot, durasi, populasi)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "yll=2400", label: "YLL 2.400 tahun", msg: "120 x (75-55) = 120 x 20 = 2.400 tahun hidup hilang karena kematian dini." },
          { kind: "stdout_matches", task: "t2", pattern: "yld=400.0", label: "YLD 400 tahun", msg: "800 x 0,25 x 2 = 400 tahun hidup dengan disabilitas." },
          { kind: "stdout_matches", task: "t3", pattern: "daly=2800.0", label: "DALY 2.800 tahun", msg: "2.400 + 400 = 2.800 tahun hidup sehat hilang." },
          { kind: "stdout_matches", task: "t3", pattern: "daly_per_100k=560.0", label: "DALY 560 per 100.000", msg: "2.800 / 500.000 x 100.000 = 560. Angka yang bisa dibandingkan antar-kabupaten." },
        ],
      },
      reference: "YLL 2.400; YLD 400; DALY 2.800; 560 per 100.000 penduduk.",
    },
    {
      id: "memakai",
      eyebrow: "Langkah 6 · Teori",
      title: "Memakai angka: kasar, terstandardisasi, atau DALY?",
      prose: [
        "Tiga skenario, tiga pilihan. Skenario 1 — kepala dinas bertanya 'berapa bed yang dibutuhkan tahun depan?': pakai angka KASAR dan prevalensi — layanan mengikuti populasi apa adanya, bukan populasi standar. Skenario 2 — gubernur bertanya 'apakah kesehatan kabupaten saya membaik dibanding 5 tahun lalu?': pakai angka TERSTANDARDISASI — struktur umur berubah selama 5 tahun, dan perubahan itu bukan prestasi program.",
        "Skenario 3 — menteri bertanya 'penyakit mana yang didahulukan dengan anggaran terbatas?': pakai DALY — bandingkan beban lintas penyakit dalam satu satuan. Penyakit dengan DALY tertinggi bukan otomatis pemenang anggaran — biaya intervensi dan kemudahan pencegahan ikut dihitung (cost-effectiveness) — tetapi DALY adalah titik berangkat yang jujur.",
        "Dua kesalahan yang paling mahal. Pertama, membandingkan angka kasar antar-daerah dengan struktur umur berbeda — menghukum daerah tua dan memuji daerah muda tanpa alasan. Kedua, memakai DALY tanpa menyebut bobotnya — 'DALY penyakit X 2.800' tanpa bobot 0,25 adalah angka yang tidak bisa diperiksa. Aturan pelaporan: tiap angka beban disertai definisinya — kasar atau terstandardisasi, tabel standar apa, bobot berapa, tahun berapa.",
      ],
      tasks: [],
      note: {
        title: "DALY dan keadilan",
        body: "DALY pernah dikritik karena mendiskon tahun hidup orang tua dan orang dengan disabilitas (versi lama memakai age-weighting dan discounting — keduanya sudah dihapus dalam Global Burden of Disease modern). Kritik itu penting: ukuran beban adalah pilihan nilai, bukan hanya rumus. Analis yang memakai DALY harus tahu sejarah kritiknya — dan menyebutkannya saat menyajikan angka.",
      },
      reference: "Kasar untuk layanan; terstandardisasi untuk tren/perbandingan; DALY untuk prioritas lintas penyakit.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: anggaran yang mengikuti beban, bukan headline",
      prose: [
        "Kembali ke kabupaten. Dinas kesehatan punya anggaran terbatas dan dua proposal: program skrining kanker (penyakit yang membunuh, headline besar) dan program kesehatan jiwa (penyakit yang melumpuhkan, headline kecil). DALY berkata: kanker 2.800, gangguan jiwa 3.400 — jiwa lebih membebani. Standardisasi berkata: kematian kasar turun, tetapi setelah disetarakan umur, kematian tidak turun — penduduk hanya lebih muda.",
        "Keputusan: anggaran dibagi — skrining kanker tetap jalan, tetapi program jiwa mendapat porsi yang sebelumnya nol. Tiga tahun kemudian, DALY jiwa turun 12 persen — penurunan yang tidak akan terlihat bila yang diukur hanya kematian. Kepala dinas yang dulu bertanya 'kenapa menganggarkan penyakit yang tidak membunuh' kini memakai DALY di tiap rapat anggaran.",
        "Tiga hal yang membuat keputusan ini benar. Pertama, beban diukur dengan DALY — bukan hanya kematian. Kedua, perbandingan memakai angka terstandardisasi — bukan kasar. Ketiga, ukuran dilaporkan bersama definisinya — bobot, tabel standar, tahun — sehingga siapa pun bisa memeriksa.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Pelajaran umumnya: apa yang diukur menentukan apa yang didanai. Mengukur hanya kematian berarti mendanai hanya penyakit yang membunuh — dan mengabaikan penyakit yang melumpuhkan jutaan orang selama puluhan tahun. DALY bukan jawaban sempurna, tetapi ia memaksa pertanyaan yang benar: beban siapa yang paling besar — dan siapa yang selama ini tidak terhitung?",
      },
      reference: "DALY kanker 2.800 vs jiwa 3.400; anggaran dibagi; DALY jiwa turun 12 persen dalam 3 tahun.",
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
        "DALY = YLL + YLD. YLL = kematian x tahun hilang; YLD = insidens x bobot x durasi.",
        "Lab: YLL 2.400; YLD 400; DALY 2.800; 560 per 100.000.",
        "Standardisasi: A 20,0 vs B 12,0 kasar menjadi 15,6 vs 16,3 — peringkat berbalik.",
        "Bobot disabilitas adalah penilaian — 0 sehat, 1 kematian — dan diperdebatkan.",
        "Kasar untuk layanan; terstandardisasi untuk perbandingan; DALY untuk prioritas.",
      ],
      next: { label: "HD40 — Hambatan Implementasi Informatika Klinis: dari Pilot ke Praktik", href: "/v2/learn/hd40-hambatan-implementasi" },
      quiz: [
        {
          q: "Penyakit X: 120 kematian usia 55 (harapan hidup 75); 800 kasus, bobot 0,25, durasi 2 tahun; populasi 500.000. Berapa YLL, YLD, DALY, dan DALY per 100.000?",
          options: [
            { text: "YLL 2.400; YLD 400; DALY 2.800; 560 per 100.000", why: "Tepat: 120x20 = 2.400; 800x0,25x2 = 400; 2.400+400 = 2.800; 2.800/500.000x100.000 = 560.", correct: true },
            { text: "YLL 2.400; YLD 400; DALY 2.800; 5,6 per 100.000", why: "Salah: 2.800/500.000 = 0,0056 — dikali 100.000 menjadi 560, bukan 5,6. Jangan lupa pengali." },
            { text: "YLL 6.600; YLD 400; DALY 7.000; 1.400 per 100.000", why: "Salah: YLL memakai tahun HILANG (75-55 = 20), bukan usia kematian (55) atau harapan hidup (75) sendiri." },
            { text: "YLL 2.400; YLD 200; DALY 2.600; 520 per 100.000", why: "Salah: YLD = 800 x 0,25 x 2 = 400 — durasi 2 tahun ikut dikalikan, bukan diabaikan." },
          ],
        },
        {
          q: "Kabupaten A kasar 20,0 vs B 12,0; terstandardisasi A 15,6 vs B 16,3. Apa kesimpulan yang benar?",
          options: [
            { text: "A lebih buruk — angka kasar yang menentukan", why: "Salah: angka kasar menghukum daerah tua. Setelah struktur umur disetarakan, B sedikit lebih buruk." },
            { text: "B sedikit lebih buruk setelah struktur umur disetarakan — peringkat berbalik karena A lebih tua", why: "Tepat: inilah Simpson's paradox — agregat dan per-kelompok umur bercerita berbeda.", correct: true },
            { text: "Keduanya sama — selisih 0,7 terlalu kecil", why: "Salah: 0,7 per 1.000 pada populasi 500.000 berarti 350 kematian per tahun — bukan selisih kecil." },
            { text: "Standardisasi salah — angka kasar tidak pernah berbalik", why: "Salah: pembalikan adalah hasil yang sah dan umum bila struktur umur berbeda jauh." },
          ],
        },
        {
          q: "Apa arti bobot disabilitas 0,25?",
          options: [
            { text: "25 persen pasien meninggal karena penyakit itu", why: "Salah: bobot bukan mortalitas — ia adalah penilaian kehilangan kesehatan." },
            { text: "Hidup dengan kondisi itu setara dengan kehilangan 25 persen kesehatan penuh — 0 sehat, 1 kematian", why: "Tepat: bobot adalah penilaian preferensi masyarakat, dan nilainya diperdebatkan.", correct: true },
            { text: "Penyakit itu berlangsung 25 persen dari hidup pasien", why: "Salah: durasi adalah komponen terpisah dalam YLD — bobot mengukur KEPARAHAN, bukan durasi." },
            { text: "25 persen populasi menderita penyakit itu", why: "Salah: itu prevalensi, bukan bobot. Bobot dan prevalensi adalah dua angka berbeda." },
          ],
        },
        {
          q: "Kepala dinas bertanya 'berapa bed yang dibutuhkan tahun depan?' Ukuran apa yang dipakai?",
          options: [
            { text: "DALY — karena paling lengkap", why: "Salah: DALY untuk prioritas lintas penyakit, bukan perencanaan kapasitas layanan." },
            { text: "Angka kasar dan prevalensi — layanan mengikuti populasi apa adanya", why: "Tepat: perencanaan kapasitas memakai populasi nyata dengan struktur umur nyata.", correct: true },
            { text: "Angka terstandardisasi — karena paling adil", why: "Salah: standardisasi untuk PERBANDINGAN, bukan perencanaan — bed dibutuhkan untuk penduduk yang ada, bukan penduduk standar." },
            { text: "YLL saja — karena kematian yang menentukan bed", why: "Salah: bed dibutuhkan juga untuk pasien yang hidup dengan penyakit — YLL hanya menghitung kematian." },
          ],
        },
        {
          q: "Bobot disabilitas dinaikkan dari 0,25 menjadi 0,5. Apa dampaknya pada DALY penyakit X?",
          options: [
            { text: "YLD menjadi 800, DALY menjadi 3.200 — prioritas anggaran bisa berubah; bobot harus dilaporkan dan diuji sensitivitasnya", why: "Tepat: 800x0,5x2 = 800; 2.400+800 = 3.200. Bobot adalah asumsi yang mengubah kesimpulan.", correct: true },
            { text: "Tidak ada dampak — DALY hanya menghitung kematian", why: "Salah: DALY = YLL + YLD — YLD separuh dari cerita." },
            { text: "DALY menjadi 5.600 — dua kali lipat", why: "Salah: hanya komponen YLD yang naik (400 menjadi 800); YLL tetap 2.400. DALY 3.200, bukan 5.600." },
            { text: "YLL menjadi 4.800 — bobot memengaruhi kematian juga", why: "Salah: bobot hanya masuk YLD. YLL dihitung dari kematian dan tahun hilang — tanpa bobot." },
          ],
        },
      ],
    },
  ],
};

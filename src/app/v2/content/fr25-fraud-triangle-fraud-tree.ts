import type { V2Lesson } from "../lib/types";

export const fr25: V2Lesson = {
  slug: "fr25-fraud-triangle-fraud-tree",
  track: "Fraud & AML Analytics",
  module: "Dasar Fraud",
  title: "FR25 — Fraud Triangle & Fraud Tree ACFE: Membaca Motif, Peluang, dan Pola",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga karyawan, tiga alasan, satu kerugian Rp31 miliar",
      prose: [
        "Dalam satu tahun, sebuah perusahaan menemukan 120 kasus fraud internal. Delapan puluh enam kasus adalah penyalahgunaan aset — kas kecil yang dicuri, stok yang hilang, klaim fiktif. Dua puluh enam kasus adalah korupsi — suap ke vendor, kickback pengadaan. Delapan kasus adalah kecurangan laporan keuangan — angka yang dipoles agar target tercapai. Total kerugian Rp31.250 juta — dan yang paling mengejutkan: delapan kasus laporan keuangan yang hanya 6,7 persen dari jumlah kasus menyumbang 44,8 persen dari total kerugian.",
        "Tanpa kerangka, 120 kasus itu hanya daftar panjang yang melelahkan. Dengan dua kerangka ACFE — fraud triangle dan fraud tree — daftar itu berubah menjadi peta: triangle menjelaskan MENGAPA seseorang berbuat curang, tree menjelaskan APA yang ia lakukan. Lesson ini mengajarkan keduanya, plus cara menghitung dari mana kerugian terbesar benar-benar datang — supaya sumber daya investigasi diarahkan ke tempat yang paling mahal, bukan yang paling ramai.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "FR1 menyebut sembilan tipe fraud dan FR2 membedakan fraud dari AML, tetapi tidak satu pun lesson yang mengajarkan fraud triangle (pressure, opportunity, rationalization) atau fraud tree ACFE (asset misappropriation, corruption, financial statement fraud) sebagai kerangka kerja. Lesson ini membangun keduanya dari nol, dengan lab yang menghitung distribusi kerugian per cabang tree.",
      },
      reference: "120 kasus: 86 penyalahgunaan aset, 26 korupsi, 8 kecurangan laporan keuangan. Total rugi Rp31.250 juta; FSF 44,8 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memetakan setiap kasus fraud ke kerangka yang tepat sebelum memutuskan respons.",
        "(1) Menjelaskan tiga sisi fraud triangle dan cara masing-masing sisi diukur dari data;",
        "(2) Mengklasifikasikan kasus ke tiga cabang fraud tree ACFE;",
        "(3) Menghitung total kerugian dan pangsa tiap cabang dari data kasus;",
        "(4) Menjelaskan kenapa cabang tersering belum tentu cabang termahal;",
        "(5) Merancang kontrol yang memotong satu sisi triangle, bukan sekadar menambah aturan.",
      ],
      tasks: [],
    },
    {
      id: "triangle",
      eyebrow: "Langkah 3 · Teori",
      title: "Fraud triangle: pressure, opportunity, rationalization",
      prose: [
        "Fraud triangle Donald Cressey berkata fraud terjadi saat tiga sisi bertemu. Pressure: tekanan yang tidak bisa dibagi — target penjualan yang mustahil, utang judi, gaya hidup di atas gaji. Opportunity: celah yang terlihat — satu orang memegang kas dan pembukuan sekaligus, tidak ada yang memeriksa. Rationalization: cerita yang membuat pelakunya merasa bukan penjahat — 'saya hanya meminjam', 'perusahaan sudah untung besar', 'semua orang melakukannya'.",
        "Tiga sisi itu tidak sama bobotnya untuk analis data. Pressure terlihat dari data HR dan kinerja: karyawan yang targetnya naik 40 persen sementara pasarnya turun, atau yang tidak pernah mengambil cuti — cuti adalah kontrol, karena pengganti sementara sering menemukan yang disembunyikan. Opportunity terlihat dari data akses: siapa yang bisa menyetujui pembayarannya sendiri. Rationalization tidak terlihat dari data — ia hanya terdengar di wawancara, dan itulah kenapa investigasi butuh manusia, bukan hanya model.",
        "Implikasi praktisnya: kontrol yang baik memotong opportunity, karena itu satu-satunya sisi yang sepenuhnya berada di tangan perusahaan. Kamu tidak bisa menghilangkan pressure hidup seseorang, dan kamu tidak bisa melarangnya merasionalisasi — tetapi kamu bisa memastikan tidak ada satu orang pun yang memegang ujung ke ujung sebuah transaksi. Segregation of duties adalah pemotong opportunity yang paling murah dan paling efektif.",
      ],
      tasks: [],
      note: {
        title: "Triangle bukan alat prediksi individu",
        body: "Triangle menjelaskan kondisi, bukan menuduh orang. Karyawan yang tertekan dan punya akses belum tentu curang — sebagian besar tidak. Memakai triangle untuk menandai 'karyawan berisiko' sebagai tersangka adalah penyalahgunaan: ia dipakai untuk merancang kontrol dan memprioritaskan audit, bukan untuk menuduh.",
      },
      reference: "Pressure, opportunity, rationalization — ketiganya harus bertemu. Kontrol memotong opportunity.",
    },
    {
      id: "tree",
      eyebrow: "Langkah 4 · Teori",
      title: "Fraud tree: tiga cabang, tiga harga",
      prose: [
        "Fraud tree ACFE membagi occupational fraud menjadi tiga cabang. Asset misappropriation: mencuri aset perusahaan — kas, stok, klaim palsu. Ini cabang tersering: dalam data cerita pembuka, 86 dari 120 kasus (71,7 persen). Corruption: penyalahgunaan jabatan untuk keuntungan — suap, kickback, konflik kepentingan. Financial statement fraud: memalsukan laporan — mengakui revenue lebih awal, menyembunyikan kewajiban.",
        "Pola harga ketiga cabang itu berlawanan dengan polanya frekuensi. Median kerugian per kasus: penyalahgunaan aset Rp125 juta, korupsi Rp250 juta, kecurangan laporan keuangan Rp1.750 juta — empat belas kali lipat cabang pertama. Totalnya: aset 86 dikali 125 sama dengan Rp10.750 juta; korupsi 26 dikali 250 sama dengan Rp6.500 juta; laporan keuangan 8 dikali 1.750 sama dengan Rp14.000 juta. Total Rp31.250 juta, dan cabang yang paling jarang justru paling mahal: 44,8 persen dari total kerugian.",
        "Kesalahan klasik manajemen adalah mengukur bahaya dari frekuensi: 86 kasus aset terasa paling mendesak karena paling sering muncul di antrean. Tetapi anggaran investigasi yang mengikuti frekuensi akan menghabiskan 70 persen waktunya untuk 34 persen kerugiannya. Aturan alokasi yang benar: urutkan dari nilai yang dipertaruhkan, bukan dari jumlah baris antrean — dan pastikan delapan kasus laporan keuangan mendapat investigator paling senior, bukan yang tersisa.",
      ],
      tasks: [],
      note: {
        title: "Median, bukan rata-rata",
        body: "Kerugian fraud berdistribusi sangat miring — satu kasus Rp14 miliar bisa menenggelamkan seratus kasus Rp100 juta. Rata-rata akan menyesatkan; median per cabang adalah angka yang jujur untuk perbandingan, dan total per cabang adalah angka untuk alokasi anggaran.",
      },
      reference: "Median per kasus: aset Rp125 jt, korupsi Rp250 jt, FSF Rp1.750 jt. Total: 10.750, 6.500, 14.000 — total Rp31.250 jt.",
    },
    {
      id: "lab-tree",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung kerugian per cabang fraud tree",
      prose: [
        "Lab ini menghitung dari data 120 kasus: total kerugian, pangsa cabang laporan keuangan, dan cabang tersering. Hitung dulu di kepala. Total: 86 dikali 125 sama dengan 10.750; 26 dikali 250 sama dengan 6.500; 8 dikali 1.750 sama dengan 14.000; jumlahnya 31.250 juta. Pangsa FSF: 14.000 dibagi 31.250 dikali 100 sama dengan 44,8 persen. Cabang tersering: asset, 86 kasus.",
        "Tugas lab: isi tiga variabel — total_rugi, pangsa_fsf, tersering — lalu cetak ketiganya. Tiga angka ini adalah satu baris pertama laporan triwulanan ke komite audit: dari mana kerugiannya datang, dan cabang mana yang paling mahal.",
        "Setelah lolos, coba eksperimen: ubah median FSF menjadi 2.000 dan lihat pangsa FSF naik menjadi 47,1 persen — lalu tanyakan: pada pangsa berapa komite audit harus memindahkan satu investigator senior dari kasus aset ke kasus laporan keuangan? Jawabannya bukan angka, melainkan kebijakan: cabang termahal selalu mendapat investigator terbaik, berapa pun frekuensinya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung total kerugian ketiga cabang (Rp juta)" },
        { id: "t2", text: "Hitung pangsa kerugian cabang laporan keuangan dalam persen" },
        { id: "t3", text: "Tentukan cabang dengan kasus tersering" },
      ],
      expected: "total_rugi_jt=31250\npangsa_fsf_pct=44.8\ntersering=asset",
      hints: [
        "Total = jumlah kasus tiap cabang dikali median kerugian cabang itu.",
        "Pangsa FSF = rugi FSF dibagi total, dikali 100.",
        "Cabang tersering = kunci dengan nilai jumlah kasus terbesar.",
      ],
      code: {
        starter: "# 120 kasus fraud internal menurut fraud tree ACFE (Rp juta). JANGAN UBAH.\njml = {\"asset\": 86, \"corruption\": 26, \"fsf\": 8}\nrugi_median = {\"asset\": 125, \"corruption\": 250, \"fsf\": 1750}\n\n# TULIS KODEMU: total rugi, pangsa FSF, kategori tersering\ntotal_rugi = \npangsa_fsf = \ntersering = \nprint(f\"total_rugi_jt={total_rugi}\")\nprint(f\"pangsa_fsf_pct={round(pangsa_fsf, 1)}\")\nprint(f\"tersering={tersering}\")",
        lockLines: 5,
        solution: "# 120 kasus fraud internal menurut fraud tree ACFE (Rp juta). JANGAN UBAH.\njml = {\"asset\": 86, \"corruption\": 26, \"fsf\": 8}\nrugi_median = {\"asset\": 125, \"corruption\": 250, \"fsf\": 1750}\n\n# TULIS KODEMU: total rugi, pangsa FSF, kategori tersering\ntotal_rugi = jml[\"asset\"] * rugi_median[\"asset\"] + jml[\"corruption\"] * rugi_median[\"corruption\"] + jml[\"fsf\"] * rugi_median[\"fsf\"]\npangsa_fsf = jml[\"fsf\"] * rugi_median[\"fsf\"] / total_rugi * 100\ntersering = max(jml, key=lambda k: jml[k])\nprint(f\"total_rugi_jt={total_rugi}\")\nprint(f\"pangsa_fsf_pct={round(pangsa_fsf, 1)}\")\nprint(f\"tersering={tersering}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "total_rugi_jt=31250", label: "Total rugi Rp31.250 juta", msg: "10.750 + 6.500 + 14.000 = 31.250. Jumlahkan per cabang, jangan rata-rata." },
          { kind: "stdout_matches", task: "t2", pattern: "pangsa_fsf_pct=44.8", label: "Pangsa FSF 44,8 persen", msg: "14.000 / 31.250 x 100 = 44,8. Cabang paling jarang adalah yang paling mahal." },
          { kind: "stdout_matches", task: "t3", pattern: "tersering=asset", label: "Cabang tersering: asset", msg: "86 kasus — tersering, tetapi bukan termahal. Frekuensi bukan ukuran bahaya." },
        ],
      },
      reference: "Total Rp31.250 jt; FSF 44,8 persen; tersering asset (86 kasus).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: komite audit meminta urutan prioritas",
      prose: [
        "Komite audit bertanya: dengan dua investigator senior dan sepuluh junior, bagaimana membagi 120 kasus? Jawaban yang mengikuti frekuensi: senior menangani 86 kasus aset, junior menangani sisanya. Jawaban yang mengikuti nilai: senior menangani 8 kasus laporan keuangan dan 26 kasus korupsi — 34 kasus yang menyumbang 65,6 persen kerugian — sementara junior menangani 86 kasus aset dengan pola yang sudah terdokumentasi dan checklist yang ketat.",
        "Triangle ikut menentukan urutan di dalam cabang. Kasus aset dengan opportunity yang masih terbuka — satu orang masih memegang kas dan pembukuan — didahulukan atas kasus yang pelakunya sudah keluar, karena celahnya masih bisa dipakai orang lain besok pagi. Investigasi yang baik tidak hanya menghukum masa lalu; ia menutup celah masa depan.",
        "Tiga bulan kemudian, komite melihat hasilnya: 8 kasus laporan keuangan selesai dengan recovery Rp9.100 juta, dan segregation of duties diterapkan di tiga titik yang ditemukan dari pola opportunity. Frekuensi kasus aset turun 30 persen kuartal berikutnya — bukan karena penipunya berkurang, melainkan karena celahnya tertutup.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, alokasi mengikuti nilai (44,8 persen kerugian dari 6,7 persen kasus), bukan frekuensi. Kedua, triangle dipakai untuk menutup opportunity, bukan untuk menuduh orang yang tertekan. Ketiga, keberhasilan diukur dari celah yang tertutup, bukan dari jumlah kasus yang dihukum.",
      },
      reference: "Senior ke cabang termahal (FSF + korupsi = 65,6 persen kerugian); junior ke kasus aset berpola.",
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
        "Fraud triangle: pressure, opportunity, rationalization — ketiganya harus bertemu.",
        "Fraud tree: asset misappropriation, corruption, financial statement fraud.",
        "Lab: total Rp31.250 jt; FSF 44,8 persen dari total; tersering asset (86 kasus).",
        "Median per kasus: aset Rp125 jt, korupsi Rp250 jt, FSF Rp1.750 jt — 14 kali lipat.",
        "Alokasi investigasi mengikuti nilai, bukan frekuensi; kontrol memotong opportunity.",
      ],
      next: { label: "FR26 — Whistleblowing Program: Saluran yang Berani Dipakai", href: "/v2/learn/fr26-whistleblowing-program" },
      quiz: [
        {
          q: "86 kasus aset (median Rp125 jt), 26 korupsi (Rp250 jt), 8 FSF (Rp1.750 jt). Berapa total kerugian?",
          options: [
            { text: "Rp31.250 juta", why: "Tepat: 10.750 + 6.500 + 14.000 = 31.250.", correct: true },
            { text: "Rp21.000 juta — hanya dari cabang tersering dan termahal", why: "Salah: korupsi 6.500 ikut dihitung. Total adalah jumlah ketiga cabang." },
            { text: "Rp14.000 juta — cabang termahal saja", why: "Salah: itu hanya FSF. Total mencakup semua cabang." },
            { text: "Rp37.500 juta — memakai rata-rata, bukan median", why: "Salah: tidak ada data rata-rata di soal; median per cabang yang diberikan menghasilkan 31.250." },
          ],
        },
        {
          q: "Cabang FSF hanya 8 dari 120 kasus tetapi menyumbang 44,8 persen kerugian. Apa implikasi alokasinya?",
          options: [
            { text: "Senior menangani FSF dan korupsi dulu — cabang termahal didahulukan", why: "Tepat: 8 + 26 kasus menyumbang 65,6 persen kerugian. Nilai, bukan frekuensi, menentukan prioritas.", correct: true },
            { text: "Semua investigator ke kasus aset karena paling banyak", why: "Salah: 86 kasus aset hanya 34,4 persen kerugian. Frekuensi bukan ukuran bahaya." },
            { text: "FSF ditunda karena jumlahnya kecil", why: "Salah: kecil jumlahnya, besar kerugiannya. Menunda FSF berarti membiarkan kerugian terbesar berjalan." },
            { text: "Bagi rata — tiap cabang dapat sepertiga investigator", why: "Salah: bagi rata mengabaikan bahwa FSF 14 kali lebih mahal per kasus daripada aset." },
          ],
        },
        {
          q: "Seorang karyawan memegang kas dan pembukuan sekaligus, targetnya naik 40 persen, dan ia berkata 'saya hanya meminjam'. Sisi triangle mana yang paling bisa dipotong perusahaan?",
          options: [
            { text: "Pressure — turunkan targetnya", why: "Salah: pressure hidup seseorang tidak sepenuhnya bisa diatur perusahaan, dan target adalah keputusan bisnis." },
            { text: "Rationalization — larang ia beralasan", why: "Salah: rationalization ada di kepala pelaku; tidak ada kebijakan yang bisa melarang seseorang bercerita pada dirinya sendiri." },
            { text: "Opportunity — pisahkan pemegang kas dari pembukuan (segregation of duties)", why: "Tepat: opportunity adalah satu-satunya sisi yang sepenuhnya di tangan perusahaan.", correct: true },
            { text: "Ketiganya sekaligus dengan satu kebijakan", why: "Salah: tidak ada satu kebijakan yang memotong ketiga sisi. Kontrol memotong opportunity; pressure dan rationalization butuh pendekatan lain." },
          ],
        },
        {
          q: "Kenapa perbandingan antar cabang memakai median, bukan rata-rata?",
          options: [
            { text: "Karena median lebih mudah dihitung", why: "Salah: kemudahan bukan alasannya. Alasannya adalah distribusi kerugian yang sangat miring." },
            { text: "Karena satu kasus raksasa bisa menenggelamkan seratus kasus kecil bila memakai rata-rata", why: "Tepat: distribusi fraud sangat miring — median kebal terhadap outlier, rata-rata tidak.", correct: true },
            { text: "Karena ACFE melarang rata-rata", why: "Salah: ACFE tidak melarang apa pun — ini soal statistik, bukan aturan." },
            { text: "Karena median selalu lebih besar dari rata-rata", why: "Salah: pada distribusi miring kanan, median justru lebih KECIL dari rata-rata." },
          ],
        },
        {
          q: "Karyawan yang tidak pernah cuti selama dua tahun. Menurut triangle, apa yang paling tepat dilakukan?",
          options: [
            { text: "Langsung tuduh ia menyembunyikan fraud", why: "Salah: tidak cuti adalah sinyal untuk diaudit, bukan bukti. Triangle menjelaskan kondisi, bukan menuduh orang." },
            { text: "Abaikan — dedikasi tidak ada hubungannya dengan fraud", why: "Salah: pengganti sementara saat cuti sering menemukan yang disembunyikan; tidak pernah cuti adalah red flag klasik." },
            { text: "Jadikan cuti wajib dan audit pekerjaannya selama ia cuti", why: "Tepat: cuti wajib adalah kontrol yang memotong opportunity — dan audit selama cuti adalah pemeriksaannya.", correct: true },
            { text: "Naikkan gajinya agar pressure hilang", why: "Salah: pressure tidak selalu soal uang, dan menaikkan gaji tidak menutup celah opportunity." },
          ],
        },
      ],
    },
  ],
};

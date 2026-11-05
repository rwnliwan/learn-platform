import type { V2Lesson } from "../lib/types";

export const mk3: V2Lesson = {
  slug: "mk3-deskriptif",
  track: "Marketing Analytics",
  module: "Analisis Deskriptif",
  title: "MK3 — Analisis Deskriptif: Cohort, RFM",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-sehatq",
      eyebrow: "Langkah 1 · Cerita SehatQ",
      title: "\u201CRetention 40%\u201D yang ternyata palsu",
      prose: [
        "SehatQ melaporkan retention 40% ke direksi. Lalu analisnya memecah per cohort: cohort Januari bertahan 55%, cohort Juni hanya 18%. Angka 40% adalah rata-rata yang menyembunyikan kemerosotan — kualitas akuisisi memburuk tiap bulan, tapi agregatnya terlihat stabil.",
        "Cohort = kelompok user yang mulai di periode yang sama, dilacak perilakunya seiring waktu. Ia menjawab pertanyaan yang tidak bisa dijawab angka agregat: apakah produk makin baik, atau kita hanya menutupi cohort baru yang makin buruk?",
        "Aturan: setiap metrik retention/lifetime selalu disajikan per cohort. Satu angka retention tanpa cohort = cerita yang belum selesai.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membandingkan retention antar-cohort tanpa menyamakan umur cohort. Cohort Juni umur 1 bulan tidak bisa dibandingkan dengan cohort Januari umur 6 bulan — bandingkan di umur yang sama (mis. M1 vs M1).",
        type: "pitfall",
      },
      reference: "Cohort: kelompokkan by waktu mulai, lacak per umur yang sama.",
    },
    {
      id: "dropoff-waktu",
      eyebrow: "Langkah 2 · Drop-off & waktu",
      title: "Absolut vs persen, mean vs median",
      prose: [
        "Drop-off absolut (1.000 orang hilang) dan persen (10% hilang) menjawab hal berbeda. Absolut = besarnya masalah dalam rupiah; persen = parahnya kebocoran relatif terhadap tahap itu. Laporkan keduanya — direksi butuh absolut, tim produk butuh persen.",
        "Time-to-convert SehatQ: mean 6,5 hari, median 1 hari. Mean ditarik segelintir user yang convert setelah berminggu-minggu; median bilang mayoritas convert dalam sehari. Untuk timing reminder, median yang dipakai: kirim di hari ke-2, bukan hari ke-7.",
        "Pola umum: untuk waktu dan uang yang miring kanan, median lebih jujur dari mean. Mean hanya aman untuk data simetris.",
      ],
      tasks: [],
      reference: "Median untuk distribusi miring; laporkan absolut + persen.",
    },
    {
      id: "retention-math",
      eyebrow: "Langkah 3 · Matematika cohort & lab",
      title: "Rumus retention dan tiga definisinya",
      prose: [
        "Retention cohort c di bulan m: R(c,m) = aktif dari cohort c di bulan m dibagi ukuran cohort c. Sederhana — tapi definisi \u201Caktif\u201D menentukan segalanya.",
        "Tiga definisi untuk kohor 1.000 user: N-day retention 25% (aktif tepat di hari ke-N), rolling retention 40% (aktif kapan pun setelah hari ke-N), unbounded 55% (pernah aktif). Berlaku ketidaksamaan: N-day ≤ rolling ≤ unbounded. Pilih definisi sesuai pertanyaan bisnis: rolling untuk produk non-harian.",
        "Di lab ini kamu menghitung retention dua cohort dari data mentah — persis seperti analis SehatQ menemukan 55% vs 18%.",
      ],
      formula: String.raw`R_{c,m} = \frac{\text{aktif dari kohor } c \text{ di bulan } m}{\text{ukuran kohor } c} \qquad R_N \le R_{\text{rolling}} \le R_{\text{unbounded}}`,
      formulaNote: "R_c,m = retention cohort c di bulan ke-m: pembilang = anggota cohort c yang aktif di bulan m; penyebut = ukuran awal cohort c (tetap, tidak menyusut). Ketidaksamaan definisi: N-day (aktif tepat di hari ke-N) ≤ rolling (aktif kapan pun setelah hari ke-N) ≤ unbounded (pernah aktif) — definisi yang lebih longgar selalu menghasilkan angka lebih besar, jadi pilihan definisi menentukan cerita.",
      tasks: [
        { id: "t1", text: "Hitung `retensi` tiap kohor = aktif / akuisisi" },
        { id: "t2", text: "Cetak dict `retensi` dengan `print`" },
      ],
      expected: "{'Jan': 0.55, 'Jun': 0.18}",
      note: {
        title: "Kaitan ke risk",
        body: "Definisi retention yang longgar (unbounded) membuat angka terlihat bagus dan menunda aksi. Pilih definisi yang membuat masalah terlihat — bukan yang membuat laporan indah.",
        type: "risk",
      },
      hints: [
        "Looping: for k, (akuisisi, aktif) in kohor.items().",
        "retensi[k] = aktif / akuisisi.",
        "Jan: 550/1000 = 0,55. Jun: 180/1000 = 0,18.",
      ],
      code: {
        starter: `# (akuisisi, aktif di bulan-1) per kohor\nkohor = {"Jan": (1000, 550), "Jun": (1000, 180)}\n\n# TULIS KODEMU: retention = aktif / akuisisi\nretensi = {}\nfor k, (akuisisi, aktif) in kohor.items():\n    retensi[k] =\n\nprint(retensi)`,
        lockLines: 2,
        solution: `# (akuisisi, aktif di bulan-1) per kohor\nkohor = {"Jan": (1000, 550), "Jun": (1000, 180)}\n\n# TULIS KODEMU: retention = aktif / akuisisi\nretensi = {}\nfor k, (akuisisi, aktif) in kohor.items():\n    retensi[k] = aktif / akuisisi\n\nprint(retensi)`,
        checks: [
          { kind: "equal", task: "t1", name: "retensi", value: 0.55, tol: 1e-9, label: "`retensi` Jan seharusnya 0,55", msg: "550 / 1000 = 0,55. Itu cohort yang sehat." },
          { kind: "contains", task: "t1", name: "retensi", value: "Jun", label: "`retensi` memuat cohort Jun", msg: "Hitung untuk semua key di kohor, bukan hanya Jan." },
          { kind: "stdout_matches", task: "t2", pattern: "0\\.18", label: "`print` menampilkan 0,18", msg: "Cohort Jun = 180/1000 = 0,18. Pastikan tercetak." },
        ],
      },
      reference: "R(c,m) = aktif / ukuran cohort. Bandingkan di umur yang sama.",
    },
    {
      id: "rfm",
      eyebrow: "Langkah 4 · RFM",
      title: "RFM: segmentasi tanpa model",
      prose: [
        "RFM = Recency (terakhir belanja kapan), Frequency (berapa sering), Monetary (berapa nilai). Masing-masing diskorkan 1–5 → 125 kombinasi. Champions = 555, At Risk = recency rendah tapi frequency/monetary tinggi.",
        "Bobot RFM = keputusan bisnis, bukan statistik. Untuk retensi, recency paling penting (yang lama tidak belanja = mau pergi). Untuk upsell, monetary. Tidak ada bobot \u201Cbenar\u201D universal — sesuaikan dengan aksi yang akan diambil.",
        "RFM adalah segmentasi tercepat yang actionable: tiap sel langsung dipetakan ke aksi (Champions → referral program, At Risk → win-back). Model canggih boleh menyusul; RFM jalan hari ini.",
      ],
      tasks: [],
      reference: "R, F, M masing-masing 1–5. Bobot mengikuti tujuan bisnis.",
    },
    {
      id: "simpson-champions",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Simpson's paradox dan Champions 5%",
      prose: [
        "Paradoks Simpson: Q1 conversion total 5%, Q2 naik ke 5,3% — padahal conversion tiap channel turun. Kok bisa? Porsi traffic bergeser ke channel yang conversion-nya memang lebih tinggi. Total naik karena komposisi berubah, bukan karena performa membaik.",
        "Mini-case: 5% pelanggan (Champions) menyumbang 40% revenue. Keputusan: potong agregator yang melayani segmen murah-meriah tapi menggerus margin, dan lindungi Champions dengan program retensi khusus.",
        "Dua pelajaran satu langkah: jangan percaya tren agregat tanpa memecah komposisinya, dan jangan perlakukan semua pelanggan sama — 5% teratas pantas dapat perlakuan berbeda.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Merayakan kenaikan metrik agregat tanpa cek per-segmen. Kenaikan bisa 100% berasal dari pergeseran mix — performa riil justru turun di semua lini.",
        type: "pitfall",
      },
      reference: "Agregat naik + tiap segmen turun = pergeseran mix. Selalu pecah.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek intuisimu",
      prose: [
        "Tiga soal cepat tentang keputusan berbasis deskriptif.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tabel cohort: Jan M1 = 55%, Jun M1 = 18%. Diagnosis?",
          options: [
            { text: "Cohort Jun bermasalah — kualitas akuisisi memburuk", why: "Umur sama (M1), hasil jauh beda = sesuatu berubah di akuisisi/onboarding Juni.", correct: true },
            { text: "Normal, cohort baru memang selalu rendah", why: "55% vs 18% terlalu jauh untuk disebut normal." },
            { text: "Produk makin bagus", why: "Terbalik: cohort baru justru jauh lebih buruk." },
          ],
        },
        {
          q: "Median time-to-convert = 1 hari. Kapan reminder dikirim?",
          options: [
            { text: "Hari ke-2", why: "Mayoritas convert dalam sehari; yang belum convert di hari ke-2 = butuh dorongan.", correct: true },
            { text: "Hari ke-7 (pakai mean 6,5)", why: "Mean ditarik outlier — menunggu 7 hari = kehilangan momentum mayoritas." },
            { text: "Hari ke-30", why: "Terlalu lama; user sudah dingin." },
          ],
        },
        {
          q: "Produk dipakai tidak harian (mis. tiket pesawat). Definisi retention yang tepat?",
          options: [
            { text: "Rolling retention", why: "N-day terlalu ketat untuk produk non-harian; rolling menangkap \u201Cmasih kembali\u201D.", correct: true },
            { text: "N-day retention", why: "Cocok untuk produk harian (game, sosmed), bukan yang dipakai sesekali." },
            { text: "Unbounded", why: "Terlalu longgar — hampir semua orang \u201Cpernah aktif\u201D." },
          ],
        },
      ],
    },
    {
      id: "adv-survivorship",
      eyebrow: "Langkah 7 · Survivorship bias",
      title: "Metrik dari yang selamat selalu terlihat bagus",
      prose: [
        "SehatQ menghitung rata-rata LTV dari pelanggan yang masih aktif: Rp850rb. Terdengar hebat — sampai kamu sadar 70% pelanggan sudah churn dan tidak masuk hitungan. LTV sebenarnya = 30% × Rp850rb + 70% × Rp120rb (nilai sebelum mereka pergi) = Rp339rb. Metrik 'dari yang selamat' selalu terlihat bagus karena yang gagal sudah disingkirkan dari pembagi.",
        "Varian yang sama berserakan di mana-mana: rating aplikasi 4,8 — dari user yang tidak uninstall (yang kecewa sudah pergi dan tidak memberi rating); 'rata-rata return manajer investasi' — manajer yang bangkrut tidak masuk sampel; NPS tinggi dari responden survei — yang marah tidak menjawab. Polanya satu: pembagi menyusut ke yang selamat, pembilang tetap.",
        "Penawarnya: selalu tanya siapa yang hilang dari pembagi ini, lalu hitung versi lengkapnya — semua yang mulai, bukan semua yang bertahan. Untuk LTV: sertakan yang churn dengan nilai aktual mereka, bukan nol dan bukan dikeluarkan. Angka yang jujur hampir selalu lebih jelek — dan justru karena itu lebih berguna.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Rata-rata LTV pelanggan aktif Rp850rb; 70% sudah churn dengan nilai Rp120rb sebelum pergi. LTV jujur?",
          options: [
            { text: "Rp339rb — 0,3×850rb + 0,7×120rb", why: "Semua yang mulai masuk hitungan, dengan nilai aktual masing-masing. Itulah versi lengkapnya.", correct: true },
            { text: "Rp850rb — fokus pada yang bertahan", why: "Itu metrik survivors; ia menjawab 'yang selamat seberapa bagus', bukan 'bisnis ini seberapa bagus'." },
            { text: "Rp120rb — pakai yang terburuk", why: "Terlalu pesimis; yang bertahan memang bernilai 850rb dan harus dihitung proporsional." },
            { text: "Rp485rb — rata-rata keduanya", why: "Rata-rata sederhana mengabaikan bobot 30/70; harus rata-rata tertimbang." },
          ],
        },
        {
          q: "Aplikasi berating 4,8 tetapi 76% peng-install sudah uninstall. Apa yang diukur rating itu?",
          options: [
            { text: "Kepuasan yang selamat — bukan pengalaman semua user", why: "Pembaginya hanya yang bertahan dan mau memberi rating; yang kecewa sudah pergi.", correct: true },
            { text: "Kualitas aplikasi secara keseluruhan", why: "76% pengalaman negatif tidak terwakili sama sekali." },
            { text: "Potensi pasar", why: "Rating tidak mengukur pasar; ia mengukur sisa yang puas." },
            { text: "Tidak ada artinya sama sekali", why: "Berarti untuk segmen survivors — hanya jangan digeneralisasi." },
          ],
        },
      ],
      reference: "Tanya siapa yang hilang dari pembagi; hitung versi semua-yang-mulai.",
    },
    {
      id: "adv-kontrak-metrik",
      eyebrow: "Langkah 8 · Kontrak metrik",
      title: "Satu paragraf kontrak sebelum satu dasbor",
      prose: [
        "Kontrak metrik = definisi tertulis yang dikunci: (1) definisi operasional — 'aktif = transaksi ≥ Rp10rb dalam 30 hari'; (2) pembagi — 'dari pendaftar terverifikasi'; (3) periode dan umur cohort — 'M1 = hari ke-31 setelah daftar'; (4) segmen — 'dipisah organik vs paid'; (5) anti-gaming — 'tidak termasuk transaksi yang di-refund < 7 hari'. Lima baris ini mencegah 90% perdebatan 'angkanya berapa'.",
        "Contoh kegagalan tanpa kontrak: tim growth merayakan 'activation naik 12% → 18%' — ternyata definisi activation diganti diam-diam dari 'transaksi pertama' menjadi 'verifikasi email'. Tidak ada yang berbohong; definisinya yang bergeser. Dengan kontrak, perubahan definisi tercatat sebagai versi baru dan tren lama tidak tercampur dengan tren baru.",
        "Aturan: setiap metrik di dasbor direksi wajib punya kontrak + pemilik + tanggal review. Metrik tanpa pemilik akan digeser definisinya diam-diam saat target terancam — dan tidak ada yang bisa membuktikan kapan pergeserannya terjadi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Activation 'naik' 12% → 18% setelah definisi diganti dari transaksi pertama menjadi verifikasi email. Masalahnya?",
          options: [
            { text: "Definisi bergeser — tren lama dan baru tidak bisa dibandingkan", why: "Kenaikannya berasal dari definisi, bukan performa. Tanpa kontrak versi, semua tren historis terkontaminasi.", correct: true },
            { text: "Tidak ada masalah — verifikasi email juga aktivasi", why: "Bisa jadi definisi yang sah, tetapi ia definisi BERBEDA; membandingkannya dengan angka lama menyesatkan." },
            { text: "Tim growth berbohong", why: "Tidak perlu niat jahat; pergeseran definisi diam-diam sudah cukup merusak." },
            { text: "Email memang lebih penting dari transaksi", why: "Tidak relevan dengan masalah komparabilitas tren." },
          ],
        },
      ],
      reference: "Kontrak metrik: definisi + pembagi + periode + segmen + anti-gaming.",
    },
    {
      id: "intuisi-janji",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Metrik yang tidak bisa ditulis satu paragraf belum siap dipakai",
      prose: [
        "Analis junior menghitung dulu, mendefinisikan kemudian. Analis senior menulis kontrak metrik sebelum menyentuh data — dan tiga heuristik ini menjelaskan kenapa.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: metrik adalah janji — tulis kontraknya sebelum menghitung, bukan setelah melihat angkanya",
        body: "Heuristik pertama: definisikan 'aktif', 'pelanggan', dan 'churn' sebelum query pertama dijalankan. Metrik yang didefinisikan setelah angkanya terlihat akan — secara tidak sadar — didefinisikan agar angkanya terlihat bagus. Inilah kenapa kontrak ditulis dulu: ia mengikatmu pada definisi yang jujur. Heuristik kedua: pilih definisi yang membuat masalah terlihat, bukan yang membuat laporan indah. Hierarki kejujuran retention sudah mengajarkan ini: N-day ≤ rolling ≤ unbounded. Unbounded membuat semua orang terlihat setia; N-day memaksa kejujuran. Pilih yang memaksa kejujuran — masalah yang terlihat bisa diperbaiki, masalah yang disembunyikan menagih bunga. Heuristik ketiga: curigai setiap metrik yang tiba-tiba membaik tanpa aksi yang jelas. Sembilan dari sepuluh kali, yang berubah adalah definisi, komposisi, atau pembagi — bukan performa. Tanya tiga hal: definisinya sama dengan bulan lalu? komposisi segmennya sama? siapa yang hilang dari pembagi? Tiga pertanyaan ini menangkap Simpson's paradox, pergeseran definisi, dan survivorship bias sekaligus. Metrik bukan cermin realitas — ia janji tentang cara mengukur realitas. Janji yang tidak tertulis akan diubah diam-diam saat target terancam.",
      },
      reference: "Definisi dulu, hitung kemudian. Pilih yang membuat masalah terlihat.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: analisis deskriptif yang tidak menipu diri sendiri",
      prose: [
        "Skenario satu — metrik rata-rata terlihat bagus: pecah per cohort waktu. Rating 4,8 dari survivors menyembunyikan 76% uninstall — cohort mengungkap siapa yang hilang dari hitungan.",
        "Skenario dua — mau segmentasi untuk kampanye: pakai RFM (Recency, Frequency, Monetary). Champions dan At Risk butuh pesan berbeda — satu pesan untuk semua adalah bakar budget.",
        "Skenario tiga — retention turun: jangan baca agregat. Baca kurva cohort per minggu akuisisi — apakah turun di semua cohort (masalah produk) atau hanya cohort baru (akuisisi buruk)?",
        "Skenario empat — memilih metrik North Star: tulis kontrak metrik dulu (definisi, denominasi, window). Metrik yang tidak bisa ditulis dalam satu paragraf belum siap dipakai.",
        "Skenario lima — presentasi ke direksi: selalu tampilkan denominasi. Angka 4,8 dari 5,0 berarti lain bila datang dari 2.000 rating di antara 50.000 install.",
        "Aturan praktis 10 detik: untuk setiap angka cantik, tanya — dari berapa orang? Siapa yang hilang dari hitungan? Bagaimana bila dipotong per cohort?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung dulu, mendefinisikan kemudian. Definisi 'aktif' yang berubah tiap kuartal membuat tren retention tidak bisa dibandingkan — kontrak metrik ditulis sebelum query, bukan sesudah.",
      },
      reference: "Kontrak metrik dulu → pecah per cohort → RFM untuk aksi.",
    },
    {
      id: "minicase-warungsehat",
      eyebrow: "Langkah 11 · Mini-case",
      title: "WarungSehat: rating 4,8 dari yang bertahan",
      prose: [
        "WarungSehat (kuliner online UMKM) bangga: rating aplikasi 4,8/5,0 dari 2.000 rating. Tetapi datanya: 50.000 install, 38.000 uninstall (76%). Yang memberi rating hanyalah 2.000 dari 12.000 yang bertahan — 16,7% dari survivors, hanya 4% dari semua yang pernah install.",
        "Ulasan 1-bintang yang tersisa mengeluh 'pesanan lama, CS tidak respons' — dan uninstall terkonsentrasi di minggu pertama: pola cold-start dan onboarding yang buruk, bukan produk yang dibenci semua orang. Rating 4,8 mengukur kepuasan yang selamat, bukan pengalaman semua user.",
        "Pertanyaan: (1) Metrik 'kepuasan' apa yang jujur untuk kasus ini? (2) Analisis apa yang membuktikan hipotesis onboarding buruk? (3) Aksi apa yang diambil — dan apa yang TIDAK boleh dilakukan?",
        "Pembahasan: (1) Rating × response rate per cohort + uninstall rate minggu-1; atau survei exit saat uninstall — metrik yang pembaginya semua yang mulai. (2) Cohort analysis: uninstall M1 per cohort mingguan; korelasikan dengan waktu tunggu pesanan pertama per user. Jika uninstall tinggi berpasangan dengan tunggu lama, hipotesis terkonfirmasi. (3) Perbaiki onboarding + SLA pesanan pertama. Yang TIDAK boleh: merayakan 4,8 di laporan dan menganggap tidak ada masalah — itu survivorship bias yang dilembagakan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "WarungSehat: rating 4,8 dari 2.000 rating; 50.000 install, 76% uninstall. Metrik kepuasan yang jujur?",
          options: [
            { text: "Uninstall minggu-1 per cohort + survei exit saat uninstall", why: "Pembaginya semua yang mulai; menangkap yang pergi, bukan hanya yang puas dan bertahan.", correct: true },
            { text: "Tetap pakai 4,8 — itu data resmi", why: "Data resmi dari 4% populasi yang paling puas = bias seleksi yang dilembagakan." },
            { text: "Rata-rata rating × 0,24 (proporsi bertahan)", why: "Mengalikan dua hal berbeda tidak menghasilkan metrik yang terdefinisi." },
            { text: "Jumlah download", why: "Download mengukur akuisisi, bukan kepuasan." },
          ],
        },
        {
          q: "Hipotesis 'uninstall karena onboarding buruk'. Bukti analisis yang paling kuat?",
          options: [
            { text: "Korelasi waktu tunggu pesanan pertama dengan uninstall M1 per user", why: "Menghubungkan pengalaman spesifik dengan kepergian di level individu — bukan sekadar agregat.", correct: true },
            { text: "Total uninstall naik tiap bulan", why: "Agregat naik bisa karena install naik; tidak membuktikan penyebab." },
            { text: "Kompetitor ratingnya 4,9", why: "Benchmark tidak menjelaskan penyebab di produk sendiri." },
            { text: "CS bilang banyak komplain", why: "Anekdot; butuh kuantifikasi sebelum jadi dasar aksi." },
          ],
        },
      ],
      reference: "Ukur yang pergi, bukan hanya yang tinggal dan puas.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Deskriptif yang baik = jujur tentang apa yang disembunyikan agregat.",
      ],
      tasks: [],
      summary: [
        "Cohort mengungkap tren kualitas akuisisi yang disembunyikan rata-rata (55% vs 18%).",
        "Laporkan drop-off absolut + persen; pakai median untuk waktu yang miring.",
        "R(c,m) = aktif/ukuran cohort; N-day ≤ rolling ≤ unbounded.",
        "RFM 1–5 (125 sel); bobot = keputusan bisnis, bukan rumus universal.",
        "Waspadai Simpson's paradox: agregat naik bisa berarti tiap segmen turun.",
        "Survivorship bias: metrik dari yang selamat selalu terlihat bagus — hitung versi semua-yang-mulai.",
        "Kontrak metrik: definisi + pembagi + periode + segmen + anti-gaming, ditulis sebelum menghitung.",
      ],
      next: { label: "MK4 — Segmentasi", href: "/learn/mk4-segmentasi" },
      quiz: [
        {
          q: "Total conversion naik 5% → 5,3% tapi tiap channel turun. Penjelasan?",
          options: [
            { text: "Paradoks Simpson — mix traffic bergeser ke channel ber-conversion tinggi", why: "Komposisi berubah menutupi penurunan performa tiap channel.", correct: true },
            { text: "Data salah input", why: "Bisa terjadi, tapi pola ini punya penjelasan statistik yang sah." },
            { text: "Semua channel sebenarnya naik", why: "Soal menyatakan tiap channel turun." },
          ],
        },
        {
          q: "Untuk kampanye retensi, bobot RFM yang paling penting?",
          options: [
            { text: "Recency — yang lama tidak belanja paling mungkin pergi", why: "Retensi = mencegah kepergian; recency adalah sinyal kepergian terkuat.", correct: true },
            { text: "Monetary selalu", why: "Monetary penting untuk upsell, bukan untuk deteksi churn." },
            { text: "Sama rata 1:1:1", why: "Bobot seragam = tidak ada prioritas = bukan keputusan." },
          ],
        },
        {
          q: "Champions 5% = 40% revenue. Aksi yang tepat?",
          options: [
            { text: "Program retensi khusus Champions; potong channel yang menggerus margin", why: "Lindungi sumber revenue terbesar; buang yang merusak profit.", correct: true },
            { text: "Diskon besar untuk semua pelanggan", why: "Mensubsidi 95% yang hanya menyumbang 60% — boros." },
            { text: "Abaikan, fokus akuisisi baru", why: "Akuisisi baru mahal; Champions yang ada jauh lebih bernilai." },
          ],
        },
        {
          q: "Kapan memakai N-day retention?",
          options: [
            { text: "Produk harian — ingin tahu siapa kembali tepat di hari ke-N", why: "N-day ketat dan presisi; cocok untuk habit harian.", correct: true },
            { text: "Produk non-harian", why: "Terlalu ketat — pakai rolling." },
            { text: "Selalu, karena paling sederhana", why: "Sederhana tapi bisa menyesatkan untuk produk yang dipakai sesekali." },
          ],
        },
        {
          q: "At Risk dalam RFM artinya?",
          options: [
            { text: "Recency rendah tapi frequency/monetary tinggi — dulu bernilai, sekarang menjauh", why: "Itulah target win-back paling berharga: pernah terbukti mau belanja.", correct: true },
            { text: "Skor 111 di semua dimensi", why: "Itu segmen \u201Clost\u201D — tidak pernah bernilai, bukan at risk." },
            { text: "Recency tinggi, frequency rendah", why: "Itu pelanggan baru — justru perlu onboarding, bukan win-back." },
          ],
        },
      ],
    },
  ],
};

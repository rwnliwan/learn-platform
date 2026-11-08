import type { V2Lesson } from "../lib/types";

export const mk2: V2Lesson = {
  slug: "mk2-tracking",
  track: "Marketing Analytics",
  module: "Tracking & Data",
  title: "MK2 — Tracking: Fondasi Data Marketing",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-belanjayuk",
      eyebrow: "Langkah 1 · Cerita BelanjaYuk",
      title: "ROAS 8,2 yang ternyata palsu",
      prose: [
        "BelanjaYuk merayakan 11.11: dashboard menunjukkan ROAS 8,2. Lalu analisnya mengaudit: 41% transaksi tercatat sebagai direct/none (sumbernya tidak diketahui), event purchase ter-fire dua kali di 18% transaksi, dan \u201Cnew user\u201D dihitung dari device_id — satu orang ganti HP dihitung dua orang.",
        "ROAS 8,2 itu dibangun di atas tiga lubang: atribusi sumber yang hilang, revenue yang dihitung ganda, dan definisi user yang salah. Keputusan budget yang diambil dari angka ini = keputusan dari data rusak.",
        "Lesson ini tentang fondasi yang membosankan tapi menentukan: penamaan event, UTM, server-side tracking, dan identity resolution. Semua analisis MK3–MK19 berdiri di atasnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Keputusan budget dari tracking yang rusak bukan sekadar salah hitung — ia bisa mengarahkan miliaran rupiah ke channel yang sebenarnya tidak menghasilkan.",
        type: "risk",
      },
      reference: "Audit tracking dulu sebelum percaya dashboard: sumber, duplikasi, definisi user.",
    },
    {
      id: "taxonomy",
      eyebrow: "Langkah 2 · Taksonomi event",
      title: "Satu bahasa untuk semua event",
      prose: [
        "Taksonomi = aturan penamaan event yang disepakati semua tim. Tiga aturan: snake_case (order_completed, bukan OrderCompleted), kata kerja bentuk lampau (completed, bukan complete — event mencatat yang sudah terjadi), dan satu bahasa (jangan campur order_selesai dengan order_completed).",
        "Tanpa taksonomi, analis menghabiskan 80% waktu membersihkan nama event: purchase, Purchase, pembelian, buy_success — empat nama untuk satu kejadian. Dashboard jadi tidak bisa dipercaya bukan karena datanya salah, tapi karena namanya berantakan.",
        "Aturan praktis: daftar event ditulis sekali, dikunci, dan setiap event baru harus lolos review. Taksonomi yang baik membosankan — dan itulah gunanya.",
      ],
      tasks: [],
      reference: "snake_case, lampau, satu bahasa. Contoh benar: order_completed.",
    },
    {
      id: "utm",
      eyebrow: "Langkah 3 · UTM & lab",
      title: "UTM: paspor setiap klik",
      prose: [
        "Lima parameter UTM: utm_source (tiktok), utm_medium (cpc), utm_campaign (2026q4_acq_1111), utm_term, utm_content. Tanpa UTM yang disiplin, 41% transaksi BelanjaYuk jatuh ke direct/none — channel paling mahal terlihat paling tidak efektif, atau sebaliknya.",
        "Taksonomi campaign sama pentingnya: daftar source tertutup (tidak boleh ada \u201Ctiktok\u201D, \u201CTikTok\u201D, \u201Ctik-tok\u201D sekaligus) dan pola nama campaign seperti 2026q4_acq_1111 (periode_tujuan_kode). Satu typo = satu baris direct/none baru.",
        "Di lab ini kamu menulis validator UTM sederhana: ia memeriksa apakah sebuah URL iklan membawa tiga parameter wajib. Validator kecil seperti ini, dipasang di CI, mencegah ratusan baris data rusak.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `validate_utm`: tambah masalah untuk tiap parameter wajib yang hilang" },
        { id: "t2", text: "Simpan hasilnya di `hasil` lalu cetak dengan `print`" },
      ],
      expected: "['tanpa utm_campaign']",
      note: {
        title: "Sering salah",
        body: "Hanya memeriksa utm_source. Campaign tanpa utm_campaign tidak bisa dihubungkan ke budget — tiga parameter (source, medium, campaign) adalah paket minimum.",
        type: "pitfall",
      },
      hints: [
        "parse_qs mengembalikan dict; cek keanggotaan dengan in.",
        "Pola: if \"utm_source\" not in q: masalah.append(\"tanpa utm_source\")",
        "URL uji hanya punya source dan medium — campaign yang hilang.",
      ],
      code: {
        starter: `from urllib.parse import urlparse, parse_qs\n\ndef validate_utm(url):\n    q = parse_qs(urlparse(url).query)\n    masalah = []\n    # TULIS KODEMU: cek utm_source, utm_medium, utm_campaign\n    return masalah\n\nurl_uji = "https://toko.id/promo?utm_source=tiktok&utm_medium=cpc"\nhasil = validate_utm(url_uji)\nprint(hasil)`,
        lockLines: 8,
        solution: `from urllib.parse import urlparse, parse_qs\n\ndef validate_utm(url):\n    q = parse_qs(urlparse(url).query)\n    masalah = []\n    if "utm_source" not in q:\n        masalah.append("tanpa utm_source")\n    if "utm_medium" not in q:\n        masalah.append("tanpa utm_medium")\n    if "utm_campaign" not in q:\n        masalah.append("tanpa utm_campaign")\n    return masalah\n\nurl_uji = "https://toko.id/promo?utm_source=tiktok&utm_medium=cpc"\nhasil = validate_utm(url_uji)\nprint(hasil)`,
        checks: [
          { kind: "defined", task: "t1", name: "validate_utm", label: "fungsi `validate_utm` terdefinisi", msg: "Jangan hapus definisi fungsi di baris terkunci." },
          { kind: "contains", task: "t1", name: "hasil", value: "tanpa utm_campaign", label: "`hasil` mendeteksi campaign hilang", msg: "URL uji tidak punya utm_campaign — validator harus menangkapnya." },
          { kind: "stdout_matches", task: "t2", pattern: "tanpa utm_campaign", label: "`print` menampilkan temuan", msg: "Cetak variabel hasil seperti di baris terakhir." },
        ],
      },
      reference: "urllib.parse: urlparse + parse_qs untuk membaca query URL.",
    },
    {
      id: "server-side",
      eyebrow: "Langkah 4 · Server-side & dedup",
      title: "Browser berbohong; server mencatat",
      prose: [
        "Client-side tracking (pixel di browser) gagal saat ad-blocker aktif, koneksi putus, atau user menutup tab sebelum pixel ter-fire. Server-side tracking mengirim event dari server kamu sendiri — jauh lebih lengkap dan tahan ad-blocker.",
        "Dedup dengan order_id: setiap purchase dikirim dengan ID unik; kalau event yang sama datang dua kali (kasus BelanjaYuk: 18% double-fire), yang kedua dibuang. Tanpa dedup, revenue tercatat 18% lebih tinggi dari aslinya — dan ROAS ikut terpompa.",
        "Aturan: event uang (purchase, refund) wajib server-side + dedup key. Event perilaku (view, click) boleh client-side. Third-party cookie sekarat — masa depan tracking adalah first-party data + server-side.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Dedup by timestamp atau by user. Dua purchase berbeda bisa terjadi di detik yang sama oleh user yang sama — satu-satunya dedup key yang aman adalah ID transaksi yang unik.",
        type: "pitfall",
      },
      reference: "Event uang: server-side + dedup by order_id. Selalu.",
    },
    {
      id: "identity",
      eyebrow: "Langkah 5 · Identity resolution",
      title: "Siapa sebenarnya user ini?",
      prose: [
        "Identity resolution = menggabungkan device_id, cookie, email, dan user_id menjadi satu orang. Dua pendekatan: deterministik (cocok by login/email — match rate 30–60%, tapi false merge ~0) dan probabilistik (cocok by pola perilaku — match rate 70–90%, tapi false merge 2–5%).",
        "Pilih sesuai kebutuhan: untuk LTV dan promo personal (salah orang = salah kirim uang), pakai deterministik. Untuk jangkauan iklan agregat, probabilistik acceptable.",
        "Mini-case Misteri ROAS 8,2 — terpecahkan: 41% direct/none karena UTM tidak disiplin, revenue +18% karena double-fire, new user inflated karena device_id. ROAS sebenarnya setelah dibersihkan: jauh lebih rendah — dan sekarang bisa dipercaya.",
      ],
      formula: String.raw`\text{match rate} = \frac{\text{identitas tercocokkan}}{\text{total identitas}}`,
      formulaNote: "match rate = fraksi identitas yang berhasil digabungkan menjadi satu profil orang: identitas tercocokkan = jumlah identifier (device_id, cookie, email, user_id) yang berhasil dipetakan ke profil yang sama; total identitas = seluruh identifier yang masuk. Deterministik (cocok by login/email): 30-60%, false merge nyaris nol. Probabilistik (cocok by pola perilaku): 70-90%, false merge 2-5%. Pilih deterministik untuk urusan uang per orang (LTV, promo), probabilistik untuk jangkauan agregat.",
      tasks: [],
      reference: "Deterministik: akurat, sempit. Probabilistik: luas, berisik.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek fondasimu",
      prose: [
        "Tiga soal cepat tentang keputusan tracking sehari-hari.",
      ],
      tasks: [],
      quiz: [
        {
          q: "41% transaksi tercatat direct/none. Perbaikan pertama?",
          options: [
            { text: "Disiplinkan UTM + taksonomi campaign", why: "Direct/none = klik tanpa identitas sumber. UTM yang disiplin mengembalikannya ke channel yang benar.", correct: true },
            { text: "Naikkan budget channel direct", why: "\u201CDirect\u201D di sini bukan channel — ia tempat sampah klik yang tak teridentifikasi." },
            { text: "Ganti platform analytics", why: "Platform tidak bisa menebak sumber yang tidak pernah dicatat." },
          ],
        },
        {
          q: "Purchase ter-fire dua kali di 18% transaksi. Solusi yang benar?",
          options: [
            { text: "Server-side + dedup by order_id", why: "ID unik per transaksi membuat pengiriman ganda terdeteksi dan dibuang.", correct: true },
            { text: "Bagi semua revenue dengan 1,18", why: "Koreksi rata-rata menyembunyikan transaksi mana yang ganda — audit jadi mustahil." },
            { text: "Abaikan, toh konsisten", why: "Konsisten salah = ROAS terpompa 18% setiap hari, selamanya." },
          ],
        },
        {
          q: "Untuk menghitung LTV per pelanggan, identity resolution mana?",
          options: [
            { text: "Deterministik (login/email)", why: "False merge ~0. Salah menggabung dua orang = LTV dan promo personal kacau.", correct: true },
            { text: "Probabilistik saja", why: "False merge 2–5% acceptable untuk reach, tapi beracun untuk uang per orang." },
            { text: "Tidak perlu, pakai device_id", why: "Satu orang ganti HP = dua \u201Cpelanggan\u201D. Itulah kesalahan BelanjaYuk." },
          ],
        },
      ],
    },
    {
      id: "adv-modeled",
      eyebrow: "Langkah 7 · Modeled measurement",
      title: "Mengukur tanpa identitas: modeled conversion & agregat",
      prose: [
        "Cookie pihak ketiga mati dan makin banyak user menolak consent — tetapi bisnis tetap butuh jawaban berapa hasil iklannya. Jawabannya bukan melanggar privasi, melainkan mengukur secara agregat dan memodelkan sisanya. Tiga teknik: (a) Consent Mode — saat user menolak, kirim ping anonim tanpa identifier; platform memakai pola agregat ini untuk memodelkan conversion yang hilang; (b) Privacy Sandbox / SKAdNetwork — atribusi dihitung di perangkat, platform hanya menerima agregat yang tertunda dan diberi noise; (c) data clean room — dua pihak mencocokkan data di ruang aman tanpa saling melihat data mentah.",
        "Konsekuensinya untuk analis: biasakan berpikir dalam rentang, bukan titik. Tulisan 'ROAS 3,2 (modeled)' berarti 3,2 adalah estimasi model dengan asumsi — bukan hitungan kas. Selalu pisahkan di laporan: observed vs modeled. Keputusan besar seperti memotong channel jangan diambil dari angka modeled sendirian; ia butuh jangkar eksperimen berkala.",
        "Aturan praktis: bangun pipeline yang bekerja dalam tiga mode — full tracking (user consent), agregat (user menolak), dan eksperimen berkala sebagai kalibrasi kebenaran. Perusahaan yang hanya punya mode pertama akan buta total saat regulasi mengetat — dan regulasi selalu mengetat.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Laporan menulis 'ROAS 3,2 (modeled)' setelah banyak user menolak consent. Sikap analis yang benar?",
          options: [
            { text: "Perlakukan sebagai estimasi ber-asumsi; pisahkan observed vs modeled di laporan", why: "Modeled = estimasi model atas data yang hilang, bukan hitungan. Mencampurnya dengan observed menyesatkan.", correct: true },
            { text: "Anggap sama akuratnya dengan ROAS terukur penuh", why: "Modeled bergantung pada asumsi model platform — ia black-box yang tidak bisa diaudit." },
            { text: "Buang angka modeled, hanya pakai observed", why: "Observed saja = undercount sistematis. Modeled tetap informasi, asal dilabeli jujur." },
            { text: "Minta platform membuka modelnya", why: "Tidak akan dibuka; yang realistis adalah kalibrasi dengan eksperimen sendiri." },
          ],
        },
        {
          q: "Kapan angka modeled TIDAK boleh dipakai sendirian untuk keputusan?",
          options: [
            { text: "Memotong channel secara permanen", why: "Keputusan ireversibel butuh jangkar kebenaran (eksperimen), bukan estimasi berasumsi.", correct: true },
            { text: "Monitoring tren mingguan", why: "Untuk tren, modeled cukup selama metodologinya konsisten." },
            { text: "Estimasi kasar budget kuartal", why: "Estimasi kasar memang habitat alami angka modeled." },
            { text: "Perbandingan antar-channel searah", why: "Perbandingan relatif masih berguna selama biasnya searah." },
          ],
        },
      ],
      reference: "Pisahkan observed vs modeled; keputusan besar butuh jangkar eksperimen.",
    },
    {
      id: "adv-dedup-math",
      eyebrow: "Langkah 8 · Dedup lanjutan",
      title: "Dedup adalah matematika: event_id + jendela waktu",
      prose: [
        "Dedup by order_id terdengar sederhana sampai menghadapi kenyataan: event purchase datang dari browser DAN server (Conversions API) — keduanya sah, keduanya membawa order_id yang sama. Aturannya: samakan event_id + event_name di kedua jalur, dan anggap duplikat bila keduanya tiba dalam jendela 48 jam. Tanpa event_id yang sama, dedup tidak bisa membedakan 'kirim ganda' dari 'beli dua kali'.",
        "Worked: 10.000 purchase tercatat; 1.800 di antaranya pasangan browser+server dengan event_id sama dalam 48 jam → 8.200 transaksi unik. Revenue terkoreksi = 8.200 × Rp250rb = Rp2,05 miliar (bukan Rp2,5 miliar). ROAS terkoreksi = Rp2,05M / Rp800jt spend = 2,56 (bukan 3,13). Satu aturan dedup mengubah keputusan scale.",
        "Jebakan jendela: terlalu pendek (1 jam) melewatkan kiriman server yang telat; terlalu panjang (30 hari) membuang pembelian ulang yang sah. 48 jam adalah kompromi industri — dan harus ditulis di kontrak metrik agar tidak digeser diam-diam.",
      ],
      tasks: [],
      quiz: [
        {
          q: "10.000 purchase tercatat, 1.800 pasangan browser+server ber-event_id sama dalam 48 jam. Transaksi unik?",
          options: [
            { text: "8.200 — pasangan dihitung sekali", why: "10.000 − 1.800 = 8.200. Itulah gunanya event_id yang disamakan di kedua jalur.", correct: true },
            { text: "10.000 — semua tercatat, semua dihitung", why: "Itu angka sebelum dedup; ROAS-nya terpompa 22%." },
            { text: "11.800 — tambahkan keduanya", why: "Menggandakan justru memperparah double-counting." },
            { text: "9.100 — bagi dua yang ganda", why: "Pasangan = 2 kiriman untuk 1 transaksi; yang dibuang 1.800, bukan 900." },
          ],
        },
      ],
      reference: "Samakan event_id browser+server; jendela 48 jam; tulis di kontrak metrik.",
    },
    {
      id: "intuisi-rantai",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Audit tracking dari ujung, bukan dari awal",
      prose: [
        "Praktisi tracking yang matang tidak bertanya apakah datanya lengkap, melainkan di titik mana ia berbohong. Tiga heuristik membedakan auditor dari penonton dasbor.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tracking adalah rantai kepercayaan — satu mata rantai bohong, semua metrik ikut bohong",
        body: "Heuristik pertama: audit dari ujung. Mulai dari revenue yang tercatat, tarik mundur ke event purchase, ke klik, ke impression — dan di setiap sambungan tanya tiga hal: apakah ada yang hilang (ad-blocker, pembatasan browser, cookie mati), apakah ada yang ganda (double-fire, kiriman server ganda), apakah definisinya sama (new user = device atau orang?). Tiga lubang BelanjaYuk — 41% direct/none, 18% double-fire, device_id sebagai user — ditemukan persis dengan cara ini, bukan dengan menatap dasbor. Heuristik kedua: event uang diperlakukan seperti uang. Tidak ada perusahaan serius yang mencatat kas dari ingatan kasir; purchase harus server-side dengan ID unik dan direkonsiliasi dengan sistem pembayaran. Jika angka analytics dan angka finance selisih lebih dari 2–3%, ada yang bocor — dan yang dipercaya adalah finance. Heuristik ketiga: consent adalah bagian dari tracking, bukan tempelan legal. Setiap event yang dikumpulkan tanpa dasar consent yang jelas adalah liabilitas yang menunggu tanggal kedaluwarsa: aturan privasi seperti UU PDP bisa memaksa data itu dihapus beserta seluruh turunannya. Tracking yang baik itu membosankan: nama konsisten, ID unik, server mencatat, consent jelas. Kebosanan itulah yang membuat ROAS bisa dipercaya.",
      },
      reference: "Audit mundur dari revenue; event uang = server-side + rekonsiliasi finance.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: audit tracking sebelum menambah satu rupiah budget",
      prose: [
        "Skenario satu — mau scale budget 3x seperti KopiKenangan (ROAS dashboard 6,0): audit dulu. Bandingkan revenue dashboard dengan revenue kas aktual. Selisih di atas 10% → berhenti, perbaiki dulu.",
        "Skenario dua — konversi naik tiba-tiba tanpa perubahan produk: jangan rayakan. Cek dedup server-side, perubahan definisi event, atau pixel yang double-firing.",
        "Skenario tiga — era ATT dan cookie sekarat: bangun server-side tracking plus modeled measurement. Keputusan budget tidak boleh bergantung pada pixel browser.",
        "Skenario empat — multi-platform (web, app, offline): tetapkan satu identity key seperti email atau HP. Tanpa itu satu orang dihitung tiga kali dan CAC terlihat murah secara palsu.",
        "Skenario lima — vendor mengklaim atribusi: selalu minta validasi holdout atau geo test. Angka atribusi tanpa validasi eksperimen adalah klaim sepihak.",
        "Aturan praktis 10 detik: sebelum menambah budget, tanya tiga hal — apakah revenue dashboard sama dengan revenue kas? Apakah definisi event sama dengan bulan lalu? Apakah ada holdout yang memvalidasi?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Scale iklan karena dashboard hijau. ROAS 6,0 di dashboard belum tentu ROAS 6,0 di kas. Audit ujung-ke-ujung selalu lebih murah daripada scale di atas data yang berbohong.",
      },
      reference: "Audit ujung dulu → definisi stabil → server-side plus holdout.",
    },
    {
      id: "minicase-kopikenangan",
      eyebrow: "Langkah 11 · Mini-case",
      title: "KopiKenangan: ROAS 6,0 yang menyusut",
      prose: [
        "KopiKenangan 12.12: spend iklan Rp800 juta, dashboard mencatat revenue Rp4,8 miliar → ROAS 6,0. Tim growth mengusulkan menaikkan budget 3x lipat. Analis menahan: audit dulu sebelum scale.",
        "Temuan audit: (a) 22% purchase adalah double-fire — browser dan server mengirim tanpa event_id yang sama, sehingga tidak ter-dedup → revenue unik hanya Rp3,94 miliar; (b) 35% revenue teratribusi berasal dari branded search — orang yang memang sudah mengetik nama brand, bukan hasil iklan (tidak inkremental); (c) new user inflated 15% karena dihitung dari device_id. Revenue inkremental ≈ Rp3,94M × 65% = Rp2,56 miliar → ROAS inkremental = 3,2. Dengan margin 40%, nilai kontribusi = Rp1,02 miliar vs spend Rp800 juta — masih positif, tetapi jauh dari cerita 'ROAS 6'.",
        "Pertanyaan: (1) Angka ROAS mana yang jujur dipakai untuk keputusan scale? (2) Perbaikan tracking apa yang diprioritaskan sebelum scale? (3) Kapan kenaikan budget 3x lipat dibenarkan?",
        "Pembahasan: (1) 3,2 (inkremental) untuk keputusan, 4,9 (unuk ter-dedup: 3,94M/800jt) untuk monitoring — bukan 6,0. (2) Samakan event_id browser+server dengan jendela 48 jam; pisahkan branded vs non-branded di setiap laporan; ganti definisi new user ke identifier orang. (3) Setelah tracking diperbaiki DAN incremental CAC per channel masih sehat pada spend yang lebih besar — scale adalah hipotesis yang harus diuji bertahap, bukan lompatan 3x.",
      ],
      tasks: [],
      quiz: [
        {
          q: "KopiKenangan: ROAS dashboard 6,0; ter-dedup 4,9; inkremental 3,2. Untuk proposal scale 3x, angka acuan?",
          options: [
            { text: "3,2 — inkremental, karena scale membeli pelanggan baru bukan mengklaim yang sudah datang", why: "Keputusan marginal pakai efek marginal. 6,0 mencampur double-count dan branded yang datang sendiri.", correct: true },
            { text: "6,0 — angka resmi dashboard", why: "Angka resmi yang salah tetap salah; audit membuktikan ia terpompa." },
            { text: "4,9 — sudah dibersihkan dari duplikat", why: "Bersih dari duplikat belum berarti inkremental; branded search masih di dalamnya." },
            { text: "Rata-rata ketiganya: 4,7", why: "Mencampur tiga konsep berbeda menghasilkan angka tanpa makna." },
          ],
        },
        {
          q: "Urutan kerja yang benar sebelum scale 3x lipat?",
          options: [
            { text: "Perbaiki dedup + pisahkan branded, uji scale bertahap, pantau incremental", why: "Ukur dengan benar dulu, baru uji hipotesis scale kecil-kecilan sebelum lompatan besar.", correct: true },
            { text: "Scale dulu, perbaiki tracking sambil jalan", why: "Scale di atas data rusak = mengalikan kesalahan; audit setelahnya tidak mengembalikan uang." },
            { text: "Potong branded search total", why: "Branded murah dan menangkap demand; yang dibutuhkan adalah pelaporan terpisah, bukan pemotongan buta." },
            { text: "Ganti agensi iklan", why: "Masalahnya di fondasi tracking internal, bukan di agensi." },
          ],
        },
      ],
      reference: "Scale butuh ROAS inkremental per channel — bukan angka dashboard.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Ingat: tracking yang buruk tidak terlihat buruk — ia terlihat seperti ROAS 8,2.",
      ],
      tasks: [],
      summary: [
        "Taksonomi event: snake_case, kata kerja lampau, satu bahasa — dikunci dan direview.",
        "UTM disiplin (source, medium, campaign + pola nama) mencegah lubang direct/none.",
        "Event uang wajib server-side + dedup by order_id; third-party cookie sekarat.",
        "Identity: deterministik (30–60%, false merge ~0) vs probabilistik (70–90%, false merge 2–5%).",
        "Audit tracking sebelum percaya dashboard: sumber, duplikasi, definisi user.",
        "Pisahkan observed vs modeled; keputusan ireversibel butuh jangkar eksperimen.",
        "Dedup butuh event_id yang sama di semua jalur + jendela 48 jam.",
      ],
      next: { label: "MK3 — Deskriptif", href: "/v2/learn/mk3-deskriptif" },
      quiz: [
        {
          q: "Mana nama event yang benar menurut taksonomi?",
          options: [
            { text: "order_completed", why: "snake_case, lampau, satu bahasa. Lolos tiga aturan.", correct: true },
            { text: "OrderCompleted", why: "Bukan snake_case — akan tercatat sebagai event berbeda." },
            { text: "order_selesai", why: "Campur bahasa — melanggar aturan satu bahasa." },
            { text: "complete_order", why: "Bukan bentuk lampau — event mencatat yang sudah terjadi." },
          ],
        },
        {
          q: "Kenapa server-side tracking lebih baik untuk event purchase?",
          options: [
            { text: "Tahan ad-blocker dan koneksi putus; datanya lebih lengkap", why: "Pixel browser gagal diam-diam; server mencatat saat transaksi benar terjadi.", correct: true },
            { text: "Lebih murah", why: "Justru lebih mahal dibangun — keunggulannya akurasi, bukan biaya." },
            { text: "Tidak butuh developer", why: "Terbalik: server-side butuh integrasi backend." },
          ],
        },
        {
          q: "Probabilistik matching 85% dengan false merge 3%. Kapan ini acceptable?",
          options: [
            { text: "Estimasi jangkauan iklan agregat", why: "Untuk agregat, 3% salah gabung tidak mengubah keputusan.", correct: true },
            { text: "Perhitungan LTV per pelanggan", why: "False merge = LTV orang A tercampur orang B. Butuh deterministik." },
            { text: "Promo personal bernilai uang", why: "Salah orang = salah kirim insentif. Terlalu berisiko." },
          ],
        },
        {
          q: "Third-party cookie sekarat. Strategi tracking jangka panjang?",
          options: [
            { text: "First-party data + server-side tracking", why: "Data milik sendiri yang dikumpulkan dengan consent tidak bergantung pada cookie pihak ketiga.", correct: true },
            { text: "Beli database pihak ketiga", why: "Itu justru memperdalam ketergantungan + risiko privasi (MK18)." },
            { text: "Kembali ke survei manual", why: "Tidak scalable dan tidak real-time." },
          ],
        },
        {
          q: "Setelah audit BelanjaYuk, ROAS terkoreksi turun. Apa sikap yang benar?",
          options: [
            { text: "Terima angka yang lebih rendah tapi benar — keputusan jadi bisa dipercaya", why: "ROAS palsu 8,2 mengarahkan budget ke tempat yang salah. Jujur > indah.", correct: true },
            { text: "Sembunyikan hasil audit agar target tercapai", why: "Itu manipulasi (MK18) — dan budget terus mengalir ke channel yang salah." },
            { text: "Ulangi audit sampai ROAS naik lagi", why: "Audit bukan alat mempercantik angka." },
          ],
        },
      ],
    },
  ],
};

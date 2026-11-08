import type { V2Lesson } from "../lib/types";

export const mk1: V2Lesson = {
  slug: "mk1-funnel-aarrr",
  track: "Marketing Analytics",
  module: "Funnel & Unit Economics",
  title: "MK1 — Funnel AARRR & Unit Economics",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-funnel",
      eyebrow: "Langkah 1 · Cerita KopiKilat",
      title: "Funnel: dari 50.000 install ke 300 pelanggan",
      prose: [
        "KopiKilat menghabiskan Rp500 juta dalam 3 bulan untuk iklan dan mendapat 50.000 install. Tapi yang pesan ulang hanya 300 orang. Di mana hilangnya 49.700 orang itu?",
        "Funnel AARRR memecahnya per tahap: 50.000 install → 8.000 daftar (16%) → 1.200 pesan pertama (15%) → 300 pesan ulang (25%) → 200 mereferensikan (67%) → 40 teman install (20%). Secara keseluruhan, hanya 0,4% install yang jadi pelanggan setia.",
        "Angka 0,4% itu bukan vonis — ia peta. Tanpa funnel, tim KopiKilat menebak-nebak: \u201Cmungkin iklannya kurang.\u201D Dengan funnel, mereka tahu persis di tahap mana uangnya bocor: activation, 8.000 daftar yang hanya 1.200 yang pesan (15%).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menghitung conversion dari total install untuk semua tahap. Conversion selalu dihitung antar-tahap yang berurutan, bukan dari puncak funnel.",
        type: "pitfall",
      },
      reference: "AARRR: Acquisition, Activation, Retention, Referral, Revenue.",
    },
    {
      id: "conversion-math",
      eyebrow: "Langkah 2 · Conversion rate",
      title: "Conversion rate dan K-factor",
      prose: [
        "Conversion rate tahap t = yang keluar dibagi yang masuk, dikali 100%. Untuk KopiKilat: activation = 1.200 / 8.000 = 15%. Rumus sederhananya menyembunyikan satu jebakan: pembaginya adalah tahap sebelumnya, bukan total install.",
        "K-factor mengukur viralitas: K = i × c, di mana i = rata-rata undangan per pengguna dan c = conversion undangannya. K = 0,3 artinya tiap 10 pengguna membawa 3 pengguna baru — membantu, tapi belum viral (K ≥ 1).",
        "Dua angka ini menjawab dua pertanyaan berbeda: conversion rate bilang \u201Cdi mana bocornya\u201D, K-factor bilang \u201Cseberapa besar mesin pertumbuhannya\u201D.",
      ],
      formula: String.raw`\text{CR}_t = \frac{\text{keluar}_t}{\text{masuk}_t} \times 100\% \qquad K = i \times c`,
      formulaNote: "CR_t = conversion rate tahap ke-t (dalam persen): keluar_t = jumlah yang lolos ke tahap berikutnya, masuk_t = jumlah yang memasuki tahap ini — pembaginya tahap sebelumnya, bukan total install. K = K-factor (viralitas): i = rata-rata undangan yang dikirim tiap pengguna, c = conversion rate undangan (fraksi undangan yang berujung install). K di atas 1 berarti tiap pengguna membawa lebih dari satu pengguna baru: pertumbuhan meledak.",
      tasks: [],
      reference: "CR antar-tahap; K = undangan per user × conversion undangan.",
    },
    {
      id: "unit-economics",
      eyebrow: "Langkah 3 · LTV, CAC, payback",
      title: "Unit economics: LTV, CAC, dan payback",
      prose: [
        "CAC KopiKilat = Rp500 juta / 200 pelanggan berbayar = Rp2,5 juta per pelanggan. LTV = ARPU × margin × (1 / churn) = Rp120rb × 0,6 × (1 / 0,15) = Rp480rb. Rasio LTV:CAC = 0,19 — tiap Rp1 yang dibakar untuk akuisisi hanya kembali Rp0,19.",
        "Payback = CAC / (ARPU × margin) = Rp2,5jt / Rp72rb = 34,7 bulan. Umur rata-rata pelanggan = 1 / 0,15 = 6,7 bulan. Kamu membayar 34,7 bulan untuk pelanggan yang hidup 6,7 bulan — bisnis ini bakar uang di setiap pelanggan baru.",
        "Aturan scale yang sehat: LTV:CAC ≥ 3 dan payback < 12 bulan. KopiKilat gagal di keduanya, jadi menambah budget iklan hanya mempercepat kebakarannya.",
      ],
      formula: String.raw`\text{LTV} = \text{ARPU} \times \text{margin} \times \frac{1}{\text{churn}} \qquad \text{payback} = \frac{\text{CAC}}{\text{ARPU} \times \text{margin}}`,
      formulaNote: "LTV = lifetime value per pelanggan (Rp): ARPU = rata-rata revenue per user per bulan, margin = fraksi kontribusi setelah biaya barang/operasional (bukan revenue kotor!), churn = fraksi pelanggan yang pergi per bulan — 1/churn adalah umur rata-rata pelanggan. payback = bulan balik modal: CAC = biaya akuisisi per pelanggan dibagi kontribusi margin per bulan (ARPU x margin). Sehat bila LTV:CAC minimal 3 dan payback di bawah 12 bulan.",
      tasks: [
        { id: "t1", text: "Hitung `ltv` dari `arpu`, `margin`, `churn`" },
        { id: "t2", text: "Hitung `rasio` = ltv / cac dan `payback` (bulan)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "ltv=480000 rasio=0.19 payback=34.7",
      note: {
        title: "Sering salah",
        body: "Memakai revenue sebagai ARPU tanpa dikali margin. LTV memakai kontribusi margin, bukan revenue kotor — biaya barang dan operasional harus dikeluarkan dulu.",
        type: "pitfall",
      },
      hints: [
        "LTV = arpu × margin / churn. Umur pelanggan = 1 / churn.",
        "Payback = cac dibagi kontribusi margin per bulan (arpu × margin).",
        "ltv = arpu * margin / churn; rasio = ltv / cac; payback = cac / (arpu * margin)",
      ],
      code: {
        starter: `# Data KopiKilat (Rp)\narpu = 120000\nmargin = 0.6\nchurn = 0.15\ncac = 2500000\n\n# TULIS KODEMU: LTV, rasio LTV:CAC, payback (bulan)\nltv =\nrasio =\npayback =\n\nprint(f"ltv={ltv:.0f} rasio={rasio:.2f} payback={payback:.1f}")`,
        lockLines: 5,
        solution: `# Data KopiKilat (Rp)\narpu = 120000\nmargin = 0.6\nchurn = 0.15\ncac = 2500000\n\n# TULIS KODEMU: LTV, rasio LTV:CAC, payback (bulan)\nltv = arpu * margin / churn\nrasio = ltv / cac\npayback = cac / (arpu * margin)\n\nprint(f"ltv={ltv:.0f} rasio={rasio:.2f} payback={payback:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ltv", value: 480000, tol: 1, label: "`ltv` seharusnya 480000", msg: "120.000 × 0,6 / 0,15 = 480.000. Cek urutan operasinya." },
          { kind: "equal", task: "t2", name: "rasio", value: 0.192, tol: 0.005, label: "`rasio` sekitar 0,19", msg: "480.000 / 2.500.000 = 0,192. Jauh di bawah 3." },
          { kind: "equal", task: "t2", name: "payback", value: 34.72, tol: 0.1, label: "`payback` sekitar 34,7 bulan", msg: "2.500.000 / 72.000 = 34,7. Bandingkan dengan umur 6,7 bulan." },
          { kind: "stdout_matches", task: "t3", pattern: "ltv=480000", label: "`print` menampilkan ltv", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "LTV = ARPU × margin / churn. Sehat jika LTV:CAC ≥ 3.",
    },
    {
      id: "leverage",
      eyebrow: "Langkah 4 · Leverage",
      title: "Tahap mana yang diperbaiki duluan?",
      prose: [
        "Tidak semua tahap funnel setara. Kenaikan Δt di tahap dengan conversion CRt menaikkan total sekitar total × Δt / CRt. Tahap dengan conversion rendah = leverage besar: perbaikan kecil di sana berdampak besar di ujung.",
        "Contoh KopiKilat: menaikkan activation dari 15% ke 20% (Δt = 5 poin) melipatgandakan efeknya: total pelanggan naik sekitar 300 × 5 / 15 = 100 pelanggan tambahan. Menaikkan referral dari 20% ke 25% (Δt sama) hanya menambah 300 × 5 / 20 = 75.",
        "Intuisinya: perbaiki sumbatan terbesar, bukan tahap yang paling mudah. Tim yang memperbaiki referral (67% → 80%) bekerja keras untuk hasil kecil, sementara activation yang bocor dibiarkan.",
      ],
      formula: String.raw`\Delta \text{total} \approx \text{total} \times \frac{\Delta_t}{\text{CR}_t}`,
      formulaNote: "Rumus leverage: Δtotal = tambahan pelanggan di ujung funnel; total = pelanggan akhir saat ini; Δt = kenaikan conversion (dalam poin) di tahap t; CR_t = conversion rate tahap t saat ini (dalam persen, mis. 15). Karena pembaginya CR_t, tahap dengan conversion paling rendah memberi tambahan terbesar untuk kenaikan poin yang sama — itulah kenapa sumbatan terbesar diperbaiki duluan.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Leverage hanya bicara volume, bukan kualitas. Menaikkan activation dengan diskon besar bisa menurunkan LTV — selalu cek unit economics setelah perbaikan funnel.",
        type: "risk",
      },
      reference: "Prioritaskan tahap dengan CR rendah: efeknya teramplifikasi.",
    },
    {
      id: "blended-incremental",
      eyebrow: "Langkah 5 · Mini-case WarungDigital",
      title: "Blended CAC menipu; incremental CAC jujur",
      prose: [
        "WarungDigital: 200.000 install, spend Rp1,2 miliar. Funnel: 60.000 daftar → 18.000 belanja pertama → 9.000 belanja ulang → 4.500 aktif. CAC blended = Rp1,2M / 4.500 = Rp266.667. LTV = Rp80rb × 0,25 / 0,20 = Rp100rb. Rasio 0,375, payback 13,3 bulan vs umur 5 bulan — tidak sehat.",
        "Lalu mereka menaikkan spend Rp400 juta dan mendapat 2.000 pelanggan tambahan. Incremental CAC = Rp400jt / 2.000 = Rp200rb — lebih murah dari blended Rp266.667. Blended mencampur pelanggan murah lama dengan yang mahal baru; keputusan scale harus pakai incremental.",
        "Satu pengecualian: segmen keluarga — LTV Rp625rb, CAC Rp150rb, rasio 4,2, payback 3 bulan. Sehat! Pelajaran: rata-rata menyembunyikan segmen yang sebenarnya menguntungkan. Potong yang tidak sehat, scale yang sehat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai blended CAC untuk keputusan menambah budget. Blended = rata-rata historis; incremental = biaya pelanggan berikutnya. Untuk scale, yang relevan selalu incremental.",
        type: "pitfall",
      },
      reference: "Incremental CAC = Δbiaya / Δpelanggan. Scale hanya jika incremental sehat.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek hitungan dasarmu",
      prose: [
        "Tiga soal cepat sebelum checkpoint. Semuanya memakai angka yang sudah kamu lihat di langkah sebelumnya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tahap funnel: 2.000 masuk, 400 keluar. Conversion rate-nya?",
          options: [
            { text: "20%", why: "400 / 2.000 = 20%. Pembaginya tahap sebelumnya, bukan total install.", correct: true },
            { text: "5%", why: "Itu 400 / 8.000 — pembagi yang salah." },
            { text: "80%", why: "Terbalik: itu 2.000 / 400 dikali 100%, bukan conversion." },
          ],
        },
        {
          q: "ARPU Rp50rb, margin 0,8, churn 0,1, CAC Rp200rb. Rasio LTV:CAC dan artinya?",
          options: [
            { text: "2,0 — marginal, belum boleh scale agresif", why: "LTV = 50rb × 0,8 / 0,1 = Rp400rb; 400rb / 200rb = 2,0. Di bawah 3 = belum aman.", correct: true },
            { text: "0,5 — bakar uang", why: "Kebalik: 200rb / 400rb = 0,5. Rasio = LTV dibagi CAC, bukan sebaliknya." },
            { text: "4,0 — sehat, scale sekarang", why: "Salah hitung: LTV-nya Rp400rb bukan Rp800rb." },
          ],
        },
        {
          q: "Activation rendah tapi retention tinggi. Apa diagnosis dan aksinya?",
          options: [
            { text: "Onboarding bermasalah — perbaiki activation", why: "Yang lolos activation bertahan baik, jadi produknya oke; yang bocor di pintu masuk.", correct: true },
            { text: "Produk jelek — redesign total", why: "Retention tinggi justru bilang produknya disukai yang sudah masuk." },
            { text: "Naikkan budget iklan", why: "Menambah orang ke funnel yang bocor di activation = bakar uang lebih cepat." },
          ],
        },
      ],
    },
    {
      id: "adv-cohort-funnel",
      eyebrow: "Langkah 7 · Cohort × funnel",
      title: "Funnel rata-rata menipu: jebakan komposisi cohort",
      prose: [
        "Funnel KopiKilat 15% activation adalah rata-rata — dan rata-rata menyembunyikan komposisi. Bayangkan dua cohort: cohort lama (2.000 pendaftar, activation 25% = 500 pelanggan) dan cohort baru dari kampanye TikTok (6.000 pendaftar, activation 8,3% = 500 pelanggan). Blended: 1.000 / 8.000 = 12,5%. Activation terlihat anjlok dari 25% ke 12,5% padahal produk tidak berubah sama sekali — yang berubah hanya baurannya.",
        "Ini jebakan komposisi: tim menyalahkan onboarding dan me-redesign aplikasi, padahal masalahnya adalah traffic baru yang lebih dingin. Keputusan yang benar bukan memperbaiki onboarding, melainkan menilai tiap sumber traffic secara terpisah — atau menerima bahwa activation blended memang wajar turun saat kamu scale ke sumber yang lebih dingin.",
        "Aturan praktis: pecah funnel berdasarkan cohort akuisisi (channel × minggu daftar). Funnel yang tidak dipecah cohort hanya boleh dibaca sebagai rata-rata tertimbang, bukan sebagai vonis kesehatan produk. Setiap kali melihat conversion 'tiba-tiba turun', pertanyaan pertama: komposisi traffic apa yang berubah?",
      ],
      tasks: [],
      quiz: [
        {
          q: "Activation blended turun 25% → 12,5% setelah kampanye TikTok. Cohort lama tetap 25%. Diagnosis yang benar?",
          options: [
            { text: "Jebakan komposisi — bauran bergeser ke traffic dingin, bukan produk rusak", why: "Cohort lama tidak berubah; penurunan blended murni efek rata-rata tertimbang dari 6.000 pendaftar baru ber-activation 8,3%.", correct: true },
            { text: "Onboarding rusak — redesign aplikasi", why: "Cohort lama tetap 25% membuktikan onboarding tidak rusak." },
            { text: "Hentikan semua kampanye TikTok", why: "Terlalu cepat menyimpulkan; yang dibutuhkan adalah menilai economics tiap cohort, bukan mematikannya buta." },
            { text: "Naikkan budget ke channel lama", why: "Channel lama mungkin sudah jenuh; keputusan butuh incremental CAC per channel, bukan nostalgia." },
          ],
        },
        {
          q: "Kapan funnel blended boleh dipakai sebagai ukuran kesehatan produk?",
          options: [
            { text: "Tidak pernah sendirian — selalu pecah per cohort dulu", why: "Blended = rata-rata tertimbang; tanpa pecahan cohort ia bisa menipu dua arah (terlihat baik atau buruk karena komposisi).", correct: true },
            { text: "Selalu — rata-rata adalah kebenaran", why: "Kasus TikTok di atas membuktikan rata-rata bisa berbohong tentang kesehatan produk." },
            { text: "Kalau angkanya naik", why: "Kenaikan blended juga bisa murni efek komposisi (mis. channel murah dihentikan)." },
            { text: "Kalau traffic-nya homogen", why: "Traffic tidak pernah benar-benar homogen; asumsi ini jarang terpenuhi di praktik." },
          ],
        },
      ],
      reference: "Pecah funnel per cohort; blended = rata-rata tertimbang, bukan vonis produk.",
    },
    {
      id: "adv-leverage-kualitas",
      eyebrow: "Langkah 8 · Leverage & kualitas",
      title: "Leverage buta kualitas: volume naik, ekonomi hancur",
      prose: [
        "Rumus leverage hanya bicara volume — ia tidak tahu dari mana tambahan pelanggan itu datang. KopiKilat menaikkan activation 15% → 20% dengan voucher Rp50rb untuk pendaftar baru. Tambahan 100 pelanggan tercapai, tetapi pemburu voucher punya churn 35% (bukan 15%): LTV mereka = Rp120rb × 0,6 / 0,35 = Rp205rb, kurang dari separuh pelanggan normal Rp480rb.",
        "Hitung ekonominya: 100 pelanggan × Rp205rb = Rp20,5 juta nilai baru, dengan biaya voucher 400 pendaftar tambahan × Rp50rb = Rp20 juta + CAC iklan yang tetap jalan. Perbaikan funnel yang 'berhasil' ini nyaris tidak menghasilkan nilai — dan dasbor volume menampilkannya sebagai kemenangan.",
        "Protokol yang benar: setiap perbaikan funnel wajib diikuti hitung ulang unit economics per cohort yang diperbaiki, minimal 2–3 bulan setelahnya. Funnel menjawab 'berapa banyak', unit economics menjawab 'apakah layak'. Merayakan volume tanpa memeriksa ekonomi adalah cara tercepat membakar uang dengan percaya diri.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Activation naik 15% → 20% via voucher, tetapi LTV cohort baru Rp205rb vs normal Rp480rb. Kesimpulan?",
          options: [
            { text: "Kemenangan volume yang meragukan — hitung ulang LTV:CAC cohort baru sebelum scale", why: "Leverage tidak melihat kualitas. Nilai 100 × Rp205rb nyaris habis oleh biaya voucher.", correct: true },
            { text: "Sukses besar — scale voucher ke semua channel", why: "Men-scale tanpa cek ekonomi = memperbesar eksperimen yang belum terbukti menguntungkan." },
            { text: "Gagal total — hentikan voucher", why: "Belum tentu gagal; mungkin masih positif setelah optimasi. Yang dibutuhkan adalah angka, bukan vonis." },
            { text: "Tidak ada masalah — volume adalah raja", why: "Volume tanpa ekonomi = bakar uang lebih cepat. Inilah tepatnya jebakan leverage." },
          ],
        },
      ],
      reference: "Setelah perbaiki funnel, hitung ulang unit economics per cohort.",
    },
    {
      id: "intuisi-corong",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Membaca funnel seperti mekanik, bukan seperti penonton",
      prose: [
        "Praktisi funnel yang bagus tidak membaca funnel dari atas ke bawah, melainkan dari bawah ke atas: mulai dari pelanggan akhir, naik satu tahap, dan tanya berapa persen yang hilang di sini serta berapa rupiah nilainya. Tiga heuristik memisahkan mekanik dari penonton.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: funnel adalah saringan berlapis — perbaiki dari lapisan yang paling tersumbat",
        body: "Heuristik pertama: selalu hitung conversion antar-tahap, tidak pernah dari puncak. Angka 'dari install' hanya untuk slide direksi, bukan untuk diagnosis — ia mencampur lima masalah berbeda menjadi satu angka yang tidak bisa diaksi. Heuristik kedua: perbaiki tahap dengan conversion terendah dulu. Kenaikan 5 poin di tahap 15% bernilai dua kali lipat kenaikan 5 poin di tahap 30%, karena rumusnya membagi dengan conversion tahap itu sendiri. Tim yang memperbaiki tahap termudah — biasanya referral atau poles UI — sedang mengerjakan pekerjaan yang terasa produktif tetapi bernilai kecil. Heuristik ketiga, dan ini yang paling sering dilupakan: setelah funnel membaik, hitung ulang unit economics. Perbaikan funnel hampir selalu mengubah komposisi pelanggan: diskon onboarding menarik pemburu diskon, traffic baru lebih dingin dari traffic lama. Volume naik, kualitas turun, dan LTV:CAC yang tadinya 3 bisa melorot ke 1,5 tanpa ada yang sadar karena dasbor hanya menampilkan volume. Funnel menjawab 'berapa banyak', unit economics menjawab 'apakah layak'. Jangan pernah merayakan yang pertama tanpa memeriksa yang kedua — dan jangan pernah percaya angka blended sebelum melihat pecahan cohort-nya.",
      },
      reference: "Antar-tahap, bukan dari puncak. Leverage tertinggi dulu. Cek ulang ekonomi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: baca funnel, lalu perbaiki yang paling mahal",
      prose: [
        "Skenario satu — rasio LTV/CAC di bawah 3: jangan scale dulu. Perbaiki satu metrik: naikkan LTV lewat retention dan pricing, atau turunkan CAC lewat bauran channel. ArusPay di rasio 1,44 — menggandakan spend hanya mempercepat bakar uang.",
        "Skenario dua — funnel atas bocor (kesadaran ke pendaftaran rendah): masalahnya biasanya bukan iklan, melainkan penawaran dan onboarding. Perbaiki landing page dan alur daftar sebelum menambah budget.",
        "Skenario tiga — funnel bawah bocor (trial ke aktif rendah): pelanggan datang tetapi tidak merasakan nilai. Percepat time-to-value di bawah 3 menit dengan onboarding terpandu.",
        "Skenario empat — angka blended menyesatkan: selalu pecah per channel dan segmen. Channel A berasio 4,2 dan channel B 0,8 menuntut keputusan berbeda — rata-rata menyembunyikan keduanya.",
        "Skenario lima — payback lebih dari 12 bulan: tanya apakah LTV 12 bulan menutup CAC. Bila tidak, ubah model harga (tahunan, upsell) sebelum mengakuisisi massal.",
        "Aturan praktis 10 detik: hitung rasio LTV/CAC per channel. Di bawah 1 → matikan channel. 1–3 → perbaiki dulu, jangan scale. Di atas 3 → scale agresif.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membanggakan CAC yang rendah. CAC Rp20 ribu dengan LTV Rp15 ribu tetap merugi. CAC selalu dibaca berpasangan dengan LTV — yang murah belum tentu sehat.",
      },
      reference: "Rasio per channel dulu → perbaiki metrik termurah → scale hanya yang di atas 3.",
    },
    {
      id: "minicase-aruspay",
      eyebrow: "Langkah 11 · Mini-case",
      title: "ArusPay: dua channel, dua kebenaran",
      prose: [
        "ArusPay (fintech UMKM) menghabiskan Rp3 miliar untuk 1 juta install. Funnel blended: 300.000 daftar (30%) → 90.000 transaksi pertama (30%) → 36.000 aktif (40%). CAC blended = Rp3M / 36.000 = Rp83.333. LTV blended = Rp60rb × 0,5 / 0,25 = Rp120rb. Rasio 1,44 — di bawah 3, direksi gelisah.",
        "Pecahan cohort bercerita lain. Organik (400.000 install, spend Rp0): 160.000 daftar → 64.000 transaksi → 32.000 aktif. LTV organik Rp150rb, CAC Rp0 — mesin yang sehat. Paid (600.000 install, spend Rp3M): 140.000 daftar → 26.000 transaksi → 4.000 aktif. CAC paid = Rp3M / 4.000 = Rp750rb; LTV paid = Rp60rb × 0,5 / 0,4 = Rp75rb. Rasio paid = 0,1 — setiap rupiah paid menghasilkan sepuluh sen.",
        "Pertanyaan: (1) Berapa incremental CAC jika paid spend ditambah Rp500 juta dan menghasilkan 700 pelanggan aktif baru? (2) Keputusan budget apa yang kamu ambil untuk kuartal depan? (3) Metrik apa yang kamu pantau agar jebakan komposisi tidak terulang?",
        "Pembahasan: (1) Rp500jt / 700 = Rp714rb — konsisten dengan CAC paid historis, jauh di atas LTV paid Rp75rb. (2) Potong paid agresif (atau perbaiki activation paid 18,6% dulu sebelum scale), alihkan ke organik: referral, SEO, kemitraan UMKM. (3) Funnel per channel × cohort mingguan; LTV:CAC per segmen; payback per channel — bukan angka blended.",
      ],
      tasks: [],
      quiz: [
        {
          q: "ArusPay: blended LTV:CAC 1,44 tetapi organik sehat dan paid 0,1. Keputusan kuartal depan?",
          options: [
            { text: "Potong paid, alihkan ke organik — blended menyembunyikan segmen beracun", why: "Paid: CAC Rp750rb vs LTV Rp75rb = bakar uang. Organik sehat. Rata-rata 1,44 menutupi keduanya.", correct: true },
            { text: "Naikkan total budget — blended masih di atas 1", why: "Di atas 1 tidak cukup (syarat 3); men-scale paid memperbesar kerugian." },
            { text: "Pertahankan 50:50 — diversifikasi itu penting", why: "Diversifikasi ke channel beracun bukan strategi; itu donasi." },
            { text: "Fokus perbaiki activation blended", why: "Activation blended 30%→? Masalahnya bukan di satu tahap, melainkan di komposisi channel." },
          ],
        },
        {
          q: "Incremental CAC paid Rp714rb vs LTV paid Rp75rb. Apa artinya untuk proposal 'tambah Rp500 juta paid'?",
          options: [
            { text: "Ditolak — biaya pelanggan baru 9,5x nilainya", why: "714rb / 75rb = 9,5. Setiap pelanggan baru = rugi Rp639rb.", correct: true },
            { text: "Disetujui — incremental lebih murah dari blended Rp83rb? ", why: "Kebalik: Rp714rb jauh LEBIH MAHAL dari blended Rp83.333." },
            { text: "Disetujui — volume paid menambah brand awareness", why: "Brand awareness bukan alasan untuk unit economics negatif tanpa batas waktu dan target." },
            { text: "Netral — tunggu data 6 bulan lagi", why: "Datanya sudah cukup: dua pengukuran konsisten (Rp750rb historis, Rp714rb incremental)." },
          ],
        },
      ],
      reference: "Pecah per channel × cohort; keputusan scale pakai incremental per segmen.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Setiap opsi punya alasan — baca juga opsi yang salah, di sanalah miskonsepsi bersembunyi.",
      ],
      tasks: [],
      summary: [
        "Funnel AARRR: conversion selalu antar-tahap berurutan; overall KopiKilat 0,4%.",
        "Unit economics sehat: LTV:CAC ≥ 3 dan payback < 12 bulan; KopiKilat 0,19 dan 34,7 bulan.",
        "Leverage: perbaiki tahap dengan conversion terendah dulu (Δtotal ≈ total × Δt / CRt).",
        "Keputusan scale pakai incremental CAC, bukan blended; waspadai rata-rata yang menyembunyikan segmen.",
        "K-factor = i × c; di bawah 1 = belum viral, hanya membantu.",
        "Jebakan komposisi: funnel blended bisa turun karena bauran cohort, bukan produk — selalu pecah per cohort.",
        "Leverage buta kualitas: perbaiki funnel lalu hitung ulang unit economics per cohort yang berubah.",
      ],
      next: { label: "MK2 — Tracking", href: "/v2/learn/mk2-tracking" },
      quiz: [
        {
          q: "Funnel KopiKilat: activation 15%, referral 20% (dari 200 → 40). Kenaikan 5 poin di tahap mana memberi tambahan pelanggan terbanyak?",
          options: [
            { text: "Activation (15% → 20%)", why: "Leverage = Δt / CRt = 5/15 > 5/20. Tahap dengan CR lebih rendah memberi efek lebih besar.", correct: true },
            { text: "Referral (20% → 25%)", why: "Leverage-nya 5/20 — lebih kecil dari activation." },
            { text: "Sama saja, Δt-nya sama", why: "Salah: rumus leverage membagi dengan CR tahap itu, jadi tidak sama." },
          ],
        },
        {
          q: "Rasio LTV:CAC = 0,19. Artinya?",
          options: [
            { text: "Setiap Rp1 CAC hanya menghasilkan Rp0,19 nilai — rugi di tiap pelanggan baru", why: "Di bawah 1 = CAC tidak pernah kembali. Jauh dari syarat sehat ≥ 3.", correct: true },
            { text: "Masih oke, di atas 0", why: "Di atas 0 tidak cukup — CAC harus kembali berkali-kali lipat untuk menutup biaya lain." },
            { text: "Bagus, hampir 20%", why: "0,19 bukan 19% keuntungan — ini rasio nilai terhadap biaya, dan ia di bawah 1." },
          ],
        },
        {
          q: "Blended CAC Rp266.667, incremental CAC Rp200rb. Tim mau menambah spend. Angka mana yang dipakai?",
          options: [
            { text: "Incremental Rp200rb — itu biaya pelanggan berikutnya", why: "Keputusan marginal pakai biaya marginal. Blended mencampur masa lalu yang murah.", correct: true },
            { text: "Blended Rp266.667 — lebih konservatif", why: "Konservatif di sini = salah ukur; keputusan scale butuh biaya pelanggan tambahan." },
            { text: "Rata-rata keduanya", why: "Tidak ada dasarnya — mencampur dua konsep berbeda." },
          ],
        },
        {
          q: "Payback 34,7 bulan, umur pelanggan 6,7 bulan. Kesimpulan?",
          options: [
            { text: "CAC tidak pernah kembali — pelanggan pergi sebelum modal balik", why: "Payback > umur = rugi pasti. Harus turunkan CAC atau naikkan LTV dulu.", correct: true },
            { text: "Tidak masalah selama LTV positif", why: "LTV Rp480rb < CAC Rp2,5jt — LTV-nya pun tidak menutup CAC." },
            { text: "Scale saja, nanti membaik sendiri", why: "Scale memperbesar kerugian per pelanggan — tidak ada mekanisme perbaikan otomatis." },
          ],
        },
        {
          q: "K-factor = 0,3. Interpretasi yang tepat?",
          options: [
            { text: "Tiap 10 pengguna membawa ~3 pengguna baru — membantu tapi belum viral", why: "K = i × c = 0,3. Viral butuh K ≥ 1 (tiap pengguna membawa ≥ 1).", correct: true },
            { text: "Sudah viral, tinggal scale", why: "K < 1 = pertumbuhan referral meluruh, bukan meledak." },
            { text: "Tidak berguna sama sekali", why: "0,3 tetap berarti akuisisi gratis 30% — hanya bukan mesin pertumbuhan utama." },
          ],
        },
      ],
    },
  ],
};

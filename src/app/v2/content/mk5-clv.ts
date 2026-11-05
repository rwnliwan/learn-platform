import type { V2Lesson } from "../lib/types";

export const mk5: V2Lesson = {
  slug: "mk5-clv",
  track: "Marketing Analytics",
  module: "Customer Lifetime Value",
  title: "MK5 — Customer Lifetime Value (CLV)",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-budi-ani",
      eyebrow: "Langkah 1 · Cerita Budi vs Ani",
      title: "Pelanggan Rp20 juta yang sebenarnya mati",
      prose: [
        "Budi sudah belanja total Rp20 juta. Ani baru Rp8 juta. Tim sales memprioritaskan Budi — wajar, kan? Lalu analis menghitung CLV: Budi berhenti belanja 24 bulan lalu (P(alive) ≈ 3%), Ani belanja 1 bulan lalu (P(alive) ≈ 92%). Nilai masa depan Budi ≈ Rp0; Ani ≈ Rp6,3 juta.",
        "Historis = kaca spion. CLV = lampu depan: berapa nilai yang akan dihasilkan pelanggan di masa depan. Keputusan budget (berapa berani bayar untuk akuisisi/retensi) harus pakai lampu depan.",
        "Lesson ini: rumus CLV sederhana, model BG/NBD untuk \u201Cmasih hidup atau tidak\u201D, dan Gamma-Gamma untuk \u201Cberapa nilainya\u201D.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memprioritaskan pelanggan by total historis. Rp20 juta yang berhenti 2 tahun lalu bernilai nol ke depan — yang hidup dan aktif jauh lebih berharga.",
        type: "pitfall",
      },
      reference: "CLV = nilai masa depan, bukan total masa lalu.",
    },
    {
      id: "rumus-clv",
      eyebrow: "Langkah 2 · Rumus CLV & lab",
      title: "CLV = m · r / (1 + d − r)",
      prose: [
        "Untuk bisnis kontraktual/langganan: CLV = margin per periode × retention / (1 + discount − retention). Ani: Rp400rb × 0,95 / (1 + 0,01 − 0,95) = Rp400rb × 0,95 / 0,06 = Rp6,33 juta.",
        "Rumus ini sangat sensitif terhadap retention: turunkan r dari 0,95 ke 0,90, CLV jatuh dari Rp6,33jt ke Rp3,27jt — hampir separuh. Itulah kenapa retensi 5 poin = separuh nilai perusahaan di bisnis subscription.",
        "Di lab ini kamu membangun kalkulator CLV + uji sensitivitasnya. Batas CAC per segmen = CLV / 3 (aturan MK1).",
      ],
      formula: String.raw`\text{CLV} = \frac{m \cdot r}{1 + d - r}`,
      formulaNote: "CLV kontraktual: m = margin kontribusi per periode (Rp, setelah biaya); r = retention rate per periode (fraksi yang bertahan, mis. 0,95); d = discount rate per periode (nilai waktu uang, mis. 0,01). Penyebut (1 + d − r): makin tinggi r, makin kecil penyebut, makin meledak CLV — inilah sumber sensitivitasnya. Berlaku untuk bisnis langganan dengan status hidup/mati yang jelas.",
      tasks: [
        { id: "t1", text: "Hitung `clv` Ani (m=400rb, r=0,95, d=0,01)" },
        { id: "t2", text: "Hitung `clv_turun` jika r=0,90 dan `batas_cac` = clv/3" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "clv=6333333 clv_turun=3272727 batas_cac=2111111",
      hints: [
        "clv = m * r / (1 + d - r).",
        "clv_turun memakai r=0,90 dengan m dan d yang sama.",
        "batas_cac = clv / 3 — aturan LTV:CAC ≥ 3.",
      ],
      code: {
        starter: `# Data Ani (Rp)\nm = 400000\nr = 0.95\nd = 0.01\n\n# TULIS KODEMU: CLV, CLV jika r turun ke 0,90, dan batas CAC\nclv =\nclv_turun =\nbatas_cac =\n\nprint(f"clv={clv:.0f} clv_turun={clv_turun:.0f} batas_cac={batas_cac:.0f}")`,
        lockLines: 4,
        solution: `# Data Ani (Rp)\nm = 400000\nr = 0.95\nd = 0.01\n\n# TULIS KODEMU: CLV, CLV jika r turun ke 0,90, dan batas CAC\nclv = m * r / (1 + d - r)\nclv_turun = m * 0.90 / (1 + d - 0.90)\nbatas_cac = clv / 3\n\nprint(f"clv={clv:.0f} clv_turun={clv_turun:.0f} batas_cac={batas_cac:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "clv", value: 6333333, tol: 1, label: "`clv` seharusnya 6333333", msg: "400.000 × 0,95 / 0,06. Cek penyebutnya: 1 + 0,01 − 0,95." },
          { kind: "equal", task: "t2", name: "clv_turun", value: 3272727, tol: 1, label: "`clv_turun` seharusnya 3272727", msg: "400.000 × 0,90 / 0,11. Retention turun 5 poin = CLV hampir separuh." },
          { kind: "equal", task: "t2", name: "batas_cac", value: 2111111, tol: 1, label: "`batas_cac` seharusnya 2111111", msg: "CLV / 3. Jangan berani bayar CAC di atas ini untuk segmen Ani." },
          { kind: "stdout_matches", task: "t3", pattern: "clv=6333333", label: "`print` menampilkan clv", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Sensitivitas retention: 5 poin = ~separuh CLV. Batas CAC = CLV/3.",
    },
    {
      id: "bgnbd",
      eyebrow: "Langkah 3 · BG/NBD",
      title: "\u201CMasih hidup?\u201D — model BG/NBD",
      prose: [
        "Untuk bisnis non-kontraktual (retail, e-commerce), pelanggan tidak \u201Cberhenti langganan\u201D — mereka diam-diam pergi. BG/NBD menjawab: berapa probabilitas pelanggan masih hidup, dari tiga angka: x (frekuensi), tx (terakhir transaksi), T (umur observasi).",
        "Budi: x=15, tx=2, T=26 → P(alive) ≈ 3%. Banyak transaksi tapi semuanya di awal observasi, lalu diam 24 bulan = kemungkinan besar sudah pergi. Ani: x=8, tx=25, T=26 → P(alive) ≈ 92%. Sedikit transaksi tapi yang terakhir baru kemarin = masih hidup.",
        "Intuisi kunci: recency mengalahkan frequency. 15 transaksi 2 tahun lalu < 8 transaksi yang terakhir bulan lalu. Model ini yang mengubah prioritas sales dari Budi ke Ani.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai frequency sebagai proksi loyalitas tanpa melihat recency. Pelanggan yang \u201Csering belanja dulu\u201D tapi diam 2 tahun = sudah churn, berapa pun total historisnya.",
        type: "pitfall",
      },
      reference: "BG/NBD: input (x, tx, T) → P(alive). Recency > frequency.",
    },
    {
      id: "gamma-gamma",
      eyebrow: "Langkah 4 · Gamma-Gamma & lab",
      title: "\u201CBerapa nilainya?\u201D — model Gamma-Gamma",
      prose: [
        "BG/NBD menjawab \u201Cmasih hidup?\u201D. Gamma-Gamma menjawab \u201Ckalau hidup, berapa nilai transaksinya?\u201D. CLV 12 bulan = ekspektasi jumlah transaksi × ekspektasi nilai × margin.",
        "Worked example: E[jumlah transaksi 12 bulan] = 9,5; E[nilai] = Rp850rb; margin 0,4 → CLV_12 = 9,5 × 850.000 × 0,4 = Rp3,23 juta. Batas CAC = Rp3,23jt / 3 = Rp1,07 juta.",
        "Dua model ini berpasangan: BG/NBD untuk probabilitas hidup, Gamma-Gamma untuk nilai. Kalikan keduanya (plus margin) = CLV probabilistik per pelanggan.",
      ],
      formula: String.raw`\text{CLV}_{12} = E[X] \times E[M] \times \text{margin}`,
      formulaNote: "CLV 12 bulan non-kontraktual: E[X] = ekspektasi jumlah transaksi 12 bulan ke depan (dari model frekuensi/BG-NBD); E[M] = ekspektasi nilai per transaksi (dari model Gamma-Gamma); margin = fraksi kontribusi. Dikalikan: ekspektasi transaksi × ekspektasi nilai × margin = ekspektasi nilai kontribusi 12 bulan.",
      tasks: [
        { id: "t1", text: "Hitung `clv12` = exp_tx × exp_m × margin" },
        { id: "t2", text: "Hitung `batas_cac` = clv12 / 3 lalu cetak keduanya" },
      ],
      expected: "clv12=3230000 batas_cac=1076667",
      hints: [
        "clv12 = exp_tx * exp_m * margin.",
        "batas_cac = clv12 / 3.",
        "9,5 × 850.000 × 0,4 = 3.230.000.",
      ],
      code: {
        starter: `# Estimasi model (Rp)\nexp_tx = 9.5      # ekspektasi jumlah transaksi 12 bln\nexp_m = 850000    # ekspektasi nilai per transaksi\nmargin = 0.4\n\n# TULIS KODEMU: CLV 12 bulan dan batas CAC\nclv12 =\nbatas_cac =\n\nprint(f"clv12={clv12:.0f} batas_cac={batas_cac:.0f}")`,
        lockLines: 4,
        solution: `# Estimasi model (Rp)\nexp_tx = 9.5      # ekspektasi jumlah transaksi 12 bln\nexp_m = 850000    # ekspektasi nilai per transaksi\nmargin = 0.4\n\n# TULIS KODEMU: CLV 12 bulan dan batas CAC\nclv12 = exp_tx * exp_m * margin\nbatas_cac = clv12 / 3\n\nprint(f"clv12={clv12:.0f} batas_cac={batas_cac:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "clv12", value: 3230000, tol: 1, label: "`clv12` seharusnya 3230000", msg: "9,5 × 850.000 × 0,4 = 3.230.000." },
          { kind: "equal", task: "t2", name: "batas_cac", value: 1076667, tol: 1, label: "`batas_cac` seharusnya 1076667", msg: "3.230.000 / 3. Channel dengan CAC di atas ini = potong." },
          { kind: "stdout_matches", task: "t2", pattern: "clv12=3230000", label: "`print` menampilkan clv12", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "CLV_12 = E[transaksi] × E[nilai] × margin.",
    },
    {
      id: "keputusan-clv",
      eyebrow: "Langkah 5 · Keputusan",
      title: "Dari CLV ke keputusan budget",
      prose: [
        "CLV bukan angka hiasan — ia aturan main. Tiap segmen punya batas CAC = CLV/3. Channel yang CAC-nya di atas batas segmen = tidak boleh dipakai untuk segmen itu, berapa pun \u201Cpotensinya\u201D.",
        "Peta keputusan: (1) hitung CLV per segmen (RFM dari MK3 + model di lesson ini); (2) tetapkan batas CAC; (3) coret channel-segmen yang melanggar; (4) alokasikan ke yang lolos by marginal ROI (MK13).",
        "Dan ingat hierarki sinyal: recency > frequency > monetary untuk prediksi. Pelanggan yang baru belanja sedikit tapi kemarin = lebih berharga dari yang banyak tapi 2 tahun lalu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "CLV adalah ekspektasi, bukan janji. Jangan menjaminkan budget tahunan pada satu angka CLV — selalu sertakan interval/sensitivitas (seperti lab langkah 2).",
        type: "risk",
      },
      reference: "Batas CAC per segmen = CLV/3. Coret yang melanggar.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek pemahaman CLV-mu",
      prose: [
        "Tiga soal cepat sebelum checkpoint.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Dua pelanggan: X total historis Rp20jt (terakhir 24 bln lalu), Y total Rp8jt (terakhir 1 bln lalu). Prioritas retensi?",
          options: [
            { text: "Y — P(alive) jauh lebih tinggi, CLV masa depan lebih besar", why: "Historis = spion. Y 92% hidup vs X 3% — nilai ke depan Y menang telak.", correct: true },
            { text: "X — historisnya 2,5x lipat", why: "Rp20jt itu masa lalu yang tidak kembali. X kemungkinan besar sudah pergi." },
            { text: "Sama saja", why: "Tidak sama: satu hidup, satu (hampir pasti) mati." },
          ],
        },
        {
          q: "r turun 0,95 → 0,90, CLV jatuh Rp6,33jt → Rp3,27jt. Pelajaran?",
          options: [
            { text: "CLV sangat sensitif terhadap retention — jaga retensi seperti jaga nyawa", why: "5 poin retention = separuh nilai. Investasi retensi sering ROI tertinggi.", correct: true },
            { text: "Naikkan discount rate saja", why: "Discount rate bukan tuas bisnis — retention yang bisa diperbaiki." },
            { text: "Rumusnya salah", why: "Rumusnya benar; sensitivitasnya memang setajam itu." },
          ],
        },
        {
          q: "CLV segmen Rp3,23jt. Channel A CAC Rp1,5jt, channel B CAC Rp900rb. Keputusan?",
          options: [
            { text: "Hanya B — batas CAC = Rp1,07jt", why: "3,23jt/3 = 1,07jt. A di atas batas = rugi.", correct: true },
            { text: "Keduanya — diversifikasi", why: "Diversifikasi tidak membenarkan CAC di atas batas." },
            { text: "Hanya A — jangkauan lebih luas", why: "Jangkauan luas dengan unit economics negatif = bakar uang luas." },
          ],
        },
      ],
    },
    {
      id: "adv-bgnbd-asumsi",
      eyebrow: "Langkah 7 · BG/NBD mendalam",
      title: "Lima asumsi BG/NBD — dan kapan ia berbohong",
      prose: [
        "BG/NBD terlihat seperti sihir tiga angka (x, tx, T), tetapi ia berdiri di atas lima asumsi: (1) tiap pelanggan bertransaksi mengikuti proses Poisson dengan ratenya sendiri; (2) rate antar-pelanggan menyebar mengikuti distribusi gamma (heterogenitas); (3) setelah tiap transaksi, pelanggan bisa 'mati' dengan probabilitas p (geometric dropout); (4) p antar-pelanggan menyebar beta; (5) rate transaksi dan probabilitas mati saling independen.",
        "Asumsi (5) adalah yang paling sering dilanggar: di dunia nyata, pelanggan yang jarang belanja juga yang paling mungkin pergi (rate rendah berkorelasi dengan p tinggi). Akibatnya BG/NBD cenderung terlalu optimis untuk pelanggan dorman — P(alive) Budi 3% mungkin sebenarnya lebih dekat ke 1%. Selalu validasi: bandingkan prediksi vs realisasi per decile recency.",
        "Kapan jangan pakai BG/NBD: bisnis kontraktual (pakai rumus sederhana — status hidupnya jelas), pola musiman ekstrem (Lebaran/Natal merusak asumsi Poisson stasioner), dan pelanggan dengan tepat-satu-transaksi-besar (properti, mobil — bukan proses berulang). Model yang dipakai di luar habitatnya = angka yang presisi tapi salah.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Pelanggan dorman: BG/NBD memberi P(alive) 15%. Mengapa analis senior curiga angka ini terlalu optimis?",
          options: [
            { text: "Asumsi independensi rate-vs-dropout dilanggar — yang jarang belanja juga paling mungkin pergi", why: "Korelasi ini membuat model melebih-lebihkan peluang hidup pelanggan dorman.", correct: true },
            { text: "Modelnya salah hitung", why: "Hitungannya benar di bawah asumsinya; masalahnya asumsinya tidak sesuai realitas." },
            { text: "Harusnya pakai rumus kontraktual", why: "Rumus kontraktual butuh status hidup/mati yang jelas — tidak ada di retail." },
            { text: "15% sudah cukup pesimis", why: "Justru kekhawatirannya: 15% masih terlalu tinggi untuk dorman." },
          ],
        },
        {
          q: "Kapan BG/NBD TIDAK boleh dipakai?",
          options: [
            { text: "Bisnis kontraktual dan pola musiman ekstrem", why: "Kontraktual punya status hidup jelas (pakai rumus sederhana); musiman merusak asumsi Poisson stasioner.", correct: true },
            { text: "E-commerce dengan data 2 tahun", why: "Itu habitat idealnya: non-kontraktual, transaksi berulang." },
            { text: "Pelanggan dengan 8 transaksi", why: "Frekuensi 8 = data cukup untuk model." },
            { text: "Selalu boleh — modelnya robust", why: "Tidak ada model yang robust di luar asumsinya." },
          ],
        },
      ],
      reference: "Cek 5 asumsi; validasi prediksi vs realisasi per decile recency.",
    },
    {
      id: "adv-batas-clv",
      eyebrow: "Langkah 8 · Batas model",
      title: "Tiga hal yang tidak dihitung CLV",
      prose: [
        "CLV yang kamu hitung mengabaikan tiga hal. Pertama, nilai referral: pelanggan yang membawa 3 teman bernilai lebih dari CLV individunya — K-factor (MK1) tidak masuk rumus. Kedua, biaya retensi: CLV memakai margin kotor, tetapi mempertahankan pelanggan butuh biaya (CS, loyalty program) yang tidak dikurangkan. Ketiga, opsi: pelanggan hari ini adalah opsi atas produk masa depan — nilai yang tidak tertangkap diskonto.",
        "Implikasinya praktis: jangan pakai CLV sebagai satu-satunya tuas. Untuk keputusan 'berani bayar berapa untuk mengakuisisi', batas CAC = CLV/3 sudah memberi margin aman atas tiga hal yang terabaikan ini. Angka 3 bukan sihir — ia buffer atas ketidakpastian model.",
        "Dan satu batas terakhir: CLV adalah ekspektasi atas distribusi yang miring. Rata-rata CLV segmen Rp3,23jt bisa berarti 10% pelanggan bernilai Rp25jt dan 90% bernilai Rp800rb. Keputusan retensi untuk ekor atas harus individual, bukan rata-rata.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Mengapa batas CAC = CLV/3, bukan CLV/1 (impas)?",
          options: [
            { text: "Buffer atas yang tidak dihitung CLV: referral, biaya retensi, dan ketidakpastian model", why: "CLV = ekspektasi dengan asumsi; /3 memberi margin aman agar keputusan tetap benar saat asumsi meleset.", correct: true },
            { text: "Agar terlihat konservatif di depan direksi", why: "Bukan soal penampilan — ini matematika kehati-hatian atas model yang tidak lengkap." },
            { text: "Karena LTV:CAC ≥ 3 adalah hukum alam", why: "Ia aturan praktis industri, bukan hukum alam — tetapi berakar pada logika buffer ini." },
            { text: "Agar budget tidak habis", why: "Budget habis bukan masalahnya; keputusan per pelanggan yang salah yang jadi masalah." },
          ],
        },
      ],
      reference: "CLV = ekspektasi; /3 = buffer. Ekor atas ditangani individual.",
    },
    {
      id: "intuisi-lampu",
      eyebrow: "Langkah 9 · Intuisi",
      title: "CLV mengubah siapa yang kamu anggap 'pelanggan besar'",
      prose: [
        "Sebelum CLV, 'pelanggan besar' = yang historisnya besar. Setelah CLV, 'pelanggan besar' = yang masa depannya besar. Tiga heuristik menjaga kompas ini tetap menunjuk ke depan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: perlakukan CLV sebagai distribusi yang miring, bukan titik yang rapi",
        body: "Heuristik pertama: recency mengalahkan segalanya. Pelanggan yang belanja kemarin — berapa pun nilainya — hampir selalu lebih berharga dari pelanggan yang belanja besar dua tahun lalu. Ini bukan sentimen; ini matematika BG/NBD: probabilitas hidup runtuh secara eksponensial terhadap waktu diam. Setiap kali tim sales memprioritaskan 'Budi Rp20 juta', tanya kapan terakhir ia belanja — jawabannya menentukan segalanya. Heuristik kedua: CLV adalah ekspektasi, bukan janji — jadi jangan pernah membuat keputusan ireversibel dari satu angka. Naikkan budget 3x lipat karena 'CLV Rp3,23jt' tanpa melihat sensitivitasnya terhadap retention adalah judi: turunkan retention 5 poin dan separuh nilainya hilang. Selalu sertakan skenario: CLV base, CLV jika retention turun 5 poin, CLV jika margin tertekan. Heuristik ketiga: rata-rata CLV menyembunyikan ekor. Di hampir semua bisnis, 10–20% pelanggan menyumbang mayoritas nilai masa depan. Keputusan untuk ekor atas (retensi personal, account manager) harus individual — memakai rata-rata segmen untuk mereka sama salahnya dengan memakai total historis untuk Budi. CLV mengubah pertanyaan dari 'siapa yang sudah memberi banyak' menjadi 'kepada siapa Rp1 retensi berikutnya menghasilkan paling banyak' — dan Rp1 itu hampir selalu jatuh ke yang baru aktif, bukan yang dulu besar.",
      },
      reference: "Recency > segalanya; CLV = ekspektasi + skenario; ekor atas individual.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: belanja akuisisi dengan kompas CLV",
      prose: [
        "Skenario satu — CAC channel versus batas CAC (CLV/3): TikTok Rp480rb di bawah Rp522.667 → lolos; Google Rp610rb → tolak atau negosiasi ulang; referral Rp90rb → scale habis-habisan.",
        "Skenario dua — CLV segmen berbeda jauh: hitung batas CAC per segmen, bukan satu angka perusahaan. Segmen premium boleh ber-CAC lima kali segmen massal.",
        "Skenario tiga — model CLV versus heuristik: pakai BG/NBD dan Gamma-Gamma bila data transaksi di atas 12 bulan dengan repeat purchase. Bila data tipis, rumus sederhana (margin × frekuensi / churn) lebih jujur.",
        "Skenario empat — retensi versus akuisisi: bandingkan CAC dengan biaya retensi per rupiah CLV. Seringkali Rp1 untuk retensi membeli CLV lebih banyak daripada Rp1 untuk akuisisi.",
        "Skenario lima — pelanggan 'besar' historis versus prospektif: alokasikan layanan premium ke CLV masa depan tertinggi, bukan ke yang dulu paling banyak belanja.",
        "Aturan praktis 10 detik: batas CAC = CLV/3. Channel di atasnya = bakar uang; di bawahnya = scale. Hitung per segmen, bukan per perusahaan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai CLV rata-rata perusahaan untuk semua keputusan. CLV 'Ibu Rutin' Rp1,5jt dan 'Anak Muda Coba-coba' Rp400rb — satu batas CAC untuk keduanya membuat channel murah tampak mahal dan sebaliknya.",
      },
      reference: "CLV per segmen → batas CAC = CLV/3 → channel lolos atau tolak per angka.",
    },
    {
      id: "minicase-sinarmart",
      eyebrow: "Langkah 11 · Mini-case",
      title: "SinarMart: tiga channel, satu segmen, nol ampun",
      prose: [
        "SinarMart (ritel omnichannel) menghitung CLV_12 segmen 'Ibu Rutin': E[transaksi] = 14, E[nilai] = Rp320rb, margin 0,35 → CLV_12 = 14 × 320.000 × 0,35 = Rp1.568.000. Batas CAC = Rp522.667. Tiga channel mengakuisisi segmen ini: (A) TikTok Ads CAC Rp480rb; (B) Google Search CAC Rp610rb; (C) referral member CAC Rp90rb (insentif Rp90rb per referral).",
        "Pertanyaan: (1) Channel mana yang lolos batas CAC? (2) TikTok mengklaim 'tapi CAC kami turun 20% tiap kuartal karena optimasi' — responsmu? (3) Referral murah tetapi volumenya kecil (200/bulan vs TikTok 5.000/bulan) — strategi scale?",
        "Pembahasan: (1) Lolos: TikTok (480rb < 522.667) dan referral (90rb). Google Search (610rb) dicoret untuk segmen ini — bukan dicoret total, tetapi tidak boleh dipakai mengakuisisi 'Ibu Rutin'. (2) Klaim penurunan CAC adalah proyeksi, bukan data. Aturan: channel dinilai dari CAC aktual 3 bulan terakhir, bukan janji optimasi. Jika 2 kuartal berturut-turut turun konsisten, batas dievaluasi ulang — dengan data, bukan slide. (3) Scale referral dulu sampai jenuh (referral ber-EV tertinggi: (1.568.000/3 − 90.000) = Rp432.667 per akuisisi), lalu TikTok dengan guardrail CAC mingguan. Jangan 'scale' Google Search dengan harapan — harapan bukan strategi alokasi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "SinarMart: batas CAC Rp522.667. Google Search CAC Rp610rb untuk segmen Ibu Rutin. Keputusan?",
          options: [
            { text: "Coret untuk segmen ini — CAC di atas batas, berapa pun 'potensinya'", why: "Aturan keras: 610rb > 522.667 = setiap akuisisi merugi secara ekspektasi.", correct: true },
            { text: "Tetap pakai — Search intent-nya tinggi", why: "Intent tinggi tidak mengubah matematika: bayar 610rb untuk nilai 1,568jt/3 tetap rugi." },
            { text: "Naikkan budget Search agar CAC turun (skala ekonomi)", why: "Scale channel ber-CAC-negatif = memperbesar kerugian; CAC turun karena skala adalah asumsi, bukan hukum." },
            { text: "Tunggu 6 bulan lalu nilai ulang", why: "6 bulan × CAC negatif = 6 bulan bakar uang tanpa dasar." },
          ],
        },
        {
          q: "Referral CAC Rp90rb tetapi hanya 200/bulan; TikTok 5.000/bulan. Strategi scale?",
          options: [
            { text: "Scale referral sampai jenuh dulu (EV tertinggi), lalu TikTok dengan guardrail", why: "EV per akuisisi referral Rp432.667 — tertinggi. Urutan scale = urutan EV, bukan urutan volume.", correct: true },
            { text: "Fokus TikTok — volumenya 25x lipat", why: "Volume besar ber-EV lebih kecil tetap kalah dari volume kecil ber-EV besar saat budget terbatas." },
            { text: "Bagi budget 50:50", why: "Merata = mengabaikan informasi EV; mensubsidi yang kurang efisien." },
            { text: "Hentikan referral — terlalu kecil untuk diurus", why: "Kecil tapi paling menguntungkan per rupiah; justru ini yang di-scale dulu." },
          ],
        },
      ],
      reference: "Nilai channel by CAC aktual vs batas; scale by urutan EV.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. CLV mengubah cara kamu melihat pelanggan: dari \u201Csiapa yang sudah belanja banyak\u201D menjadi \u201Csiapa yang akan menghasilkan\u201D.",
      ],
      tasks: [],
      summary: [
        "CLV = m·r/(1+d−r); sangat sensitif terhadap retention.",
        "BG/NBD: P(alive) dari (x, tx, T); recency mengalahkan frequency.",
        "Gamma-Gamma: CLV_12 = E[X]×E[M]×margin.",
        "Batas CAC per segmen = CLV/3; coret channel yang melanggar.",
        "Prioritaskan pelanggan by CLV masa depan, bukan total historis.",
        "BG/NBD berdiri di 5 asumsi; asumsi independensi paling sering dilanggar — validasi per decile recency.",
        "CLV mengabaikan referral, biaya retensi, dan opsi — batas CAC = CLV/3 adalah buffernya.",
      ],
      next: { label: "MK6 — Churn", href: "/learn/mk6-churn" },
      quiz: [
        {
          q: "Komponen mana yang PALING menggerakkan CLV di bisnis subscription?",
          options: [
            { text: "Retention rate — 5 poin = separuh CLV", why: "Terbukti di lab: 0,95→0,90 memangkas CLV hampir 50%.", correct: true },
            { text: "Discount rate", why: "Pengaruhnya kecil dibanding retention." },
            { text: "Margin per periode", why: "Linear 1:1 — kalah jauh dari efek non-linear retention." },
          ],
        },
        {
          q: "P(alive) Budi 3%, Ani 92%. Apa yang membedakan mereka di mata model?",
          options: [
            { text: "Recency — Ani transaksi terakhir 1 bulan lalu, Budi 24 bulan lalu", why: "BG/NBD menghukum diam yang lama, berapa pun frekuensinya.", correct: true },
            { text: "Frequency — Budi 15x vs Ani 8x", why: "Frequency Budi lebih tinggi tapi ia tetap \u201Cmati\u201D — recency menang." },
            { text: "Total historis", why: "Model tidak memakai total historis sebagai sinyal hidup." },
          ],
        },
        {
          q: "Kapan memakai rumus sederhana m·r/(1+d−r) vs BG/NBD + Gamma-Gamma?",
          options: [
            { text: "Rumus sederhana untuk kontraktual; BG/NBD untuk non-kontraktual", why: "Bisnis langganan punya status hidup/mati yang jelas; retail tidak.", correct: true },
            { text: "Selalu BG/NBD — lebih canggih", why: "Canggih tapi butuh data transaksi individual; untuk langganan, overkill." },
            { text: "Selalu rumus sederhana", why: "Untuk retail, asumsi \u201Cretention konstan\u201D terlalu kasar." },
          ],
        },
        {
          q: "Segmen CLV Rp900rb. Batas CAC dan implikasinya?",
          options: [
            { text: "Rp300rb — channel Rp500rb untuk segmen ini harus dipotong", why: "900rb/3 = 300rb. Aturan keras, bukan saran.", correct: true },
            { text: "Rp900rb — boleh sampai impas", why: "Impas = LTV:CAC 1, jauh dari syarat sehat 3." },
            { text: "Rp450rb — setengah CLV", why: "Tidak ada dasarnya; aturannya CLV/3." },
          ],
        },
        {
          q: "Tim sales protes: \u201CBudi pelanggan besar, jangan dianaktirikan!\u201D Respons berbasis data?",
          options: [
            { text: "Tunjukkan P(alive) 3% — effort retensi ke Budi ≈ membuang uang; alihkan ke Ani", why: "Data bicara: expected value retensi Budi ≈ 0.", correct: true },
            { text: "Ikuti sales — mereka kenal pelanggan", why: "Insting tanpa data = prioritas ke kaca spion." },
            { text: "Bagi effort sama rata", why: "Sama rata = mengabaikan informasi P(alive) yang sudah dihitung." },
          ],
        },
      ],
    },
  ],
};

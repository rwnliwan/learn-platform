import type { V2Lesson } from "../lib/types";

export const e38: V2Lesson = {
  slug: "e38-model-endowment-swensen",
  track: "Financial Markets",
  module: "Investor Institusi",
  title: "E38 — Model Endowment Yale (Swensen): Alokasi, Illiquiditas, dan Disiplin",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dana abadi yang mengalahkan pasar selama 20 tahun — dengan membeli yang tidak bisa dijual",
      prose: [
        "Dari 1985 sampai 2025, endowment Yale — dikelola David Swensen — menghasilkan return rata-rata sekitar 10 persen per tahun, mengalahkan hampir semua endowment dan sebagian besar manajer profesional. Rahasianya bukan prediksi pasar dan bukan trading — melainkan alokasi: hanya 15 persen di obligasi, 80 persen lebih di ekuitas dan aset alternatif, dengan 20 persen di private equity dan 20 persen di real assets. Portofolio yang sengaja illiquid — seperlima asetnya tidak bisa dijual cepat — justru menjadi sumber return tertingginya.",
        "Logika Swensen sederhana dan radikal: horizon abadi berarti kamu DIBAYAR untuk menanggung illiquiditas yang tidak bisa ditanggung orang lain. Investor dengan horizon 1 tahun harus memegang aset likuid; investor dengan horizon selamanya bisa membeli aset yang terkunci 10 tahun dan memanen premi illiquiditas 3 poin per tahun. Premi itu nyata — private equity 11 persen vs saham publik 8 persen — tetapi hanya bisa dipanen oleh yang benar-benar tidak butuh uangnya.",
        "Lesson ini membangun dari E29, yang sudah mengajarkan endowment, spending rule 5 persen, dan smoothing 3 tahun — tetapi tidak pernah membahas MODEL Swensen: alokasinya, logika illiquiditasnya, dan disiplin rebalancing-nya. Setelah lesson ini kamu bisa: (1) menjelaskan alokasi model Yale dan logikanya; (2) menghitung expected return portofolio endowment; (3) menghitung premi illiquiditas; (4) menjelaskan mean reversion dan rebalancing; (5) menilai bagian mana dari model Yale yang bisa ditiru investor individu — dan mana yang tidak.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "E29 membahas endowment sebagai lembaga: dana abadi, donor intent, intergenerational equity, spending rule 5 persen vs return riil 4 persen, dan smoothing rata-rata 3 tahun — plus lab spending rule. PM-C1 menyebut endowment sekilas (horizon abadi, spending rule sekitar 5 persen). Tidak ada lesson yang membahas MODEL Swensen: alokasi Yale, premi illiquiditas, diversifikasi antar kelas aset yang tidak berkorelasi, dan disiplin rebalancing. Lesson ini membangun itu.",
      },
      reference: "Alokasi ilustratif Yale: ekuitas domestik 10 persen, ekuitas asing 15 persen, private equity 20 persen, real assets 20 persen, absolute return 20 persen, obligasi 15 persen. Expected return 8,1 persen; premi illiquiditas 3 poin.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan kenapa dana abadi tertua justru memegang aset yang paling tidak likuid — dan kapan kamu boleh menirunya.",
        "(1) Menjelaskan alokasi model Yale dan logika tiap kelas aset;",
        "(2) Menghitung expected return portofolio endowment dari bobot dan return tiap kelas;",
        "(3) Menghitung premi illiquiditas;",
        "(4) Menjelaskan mean reversion dan disiplin rebalancing;",
        "(5) Menilai bagian model Yale yang bisa ditiru investor individu — dan mana yang tidak.",
      ],
      tasks: [],
    },
    {
      id: "alokasi",
      eyebrow: "Langkah 3 · Teori",
      title: "Alokasi Yale: ekuitas berat, obligasi ringan",
      prose: [
        "Alokasi model Yale (ilustratif, mengikuti target jangka panjangnya): ekuitas domestik 10 persen, ekuitas asing 15 persen, private equity 20 persen, real assets 20 persen (real estate, infrastruktur, komoditas), absolute return 20 persen (hedge fund market-neutral), dan obligasi 15 persen. Bandingkan dengan portofolio klasik 60/40: Yale hanya menaruh 15 persen di obligasi — sepertiga dari portofolio klasik. Logikanya: horizon abadi tidak butuh bantalan obligasi besar; yang dibutuhkan adalah return riil jangka panjang untuk mendanai spending rule 5 persen (E29) selamanya.",
        "Tiap kelas aset punya peran. Ekuitas domestik dan asing: mesin return utama — diversifikasi geografis mengurangi risiko negara tunggal. Private equity: return tertinggi (11 persen) dengan illiquiditas tertinggi — hanya mungkin karena horizon abadi. Real assets: perlindungan inflasi — sewa dan harga komoditas naik bersama inflasi, saat obligasi jatuh. Absolute return: diversifikasi yang return-nya tidak bergantung pada arah pasar — penstabil saat ekuitas jatuh. Obligasi 15 persen: bukan mesin return, melainkan cadangan likuid untuk spending dan capital call PE.",
        "Prinsip yang mengikat semuanya: diversifikasi antar kelas aset yang return-nya digerakkan oleh faktor BERBEDA. Ekuitas digerakkan pertumbuhan ekonomi; real assets oleh inflasi; obligasi oleh suku bunga; absolute return oleh skill manajer. Saat satu faktor memburuk, yang lain tidak ikut jatuh — itulah diversifikasi yang sesungguhnya, bukan sekadar memegang banyak saham yang semuanya jatuh bersamaan saat krisis (E8: correlation breakdown).",
        "Expected return portofolio dihitung dari bobot dan return tiap kelas. Dengan return ilustratif — domestik 7 persen, asing 8 persen, PE 11 persen, real assets 9 persen, absolute return 8 persen, obligasi 4 persen — expected return = 0,10×7 + 0,15×8 + 0,20×11 + 0,20×9 + 0,20×8 + 0,15×4 = 0,7 + 1,2 + 2,2 + 1,8 + 1,6 + 0,6 = 8,1 persen. Dengan inflasi 3 persen, return riil 5,1 persen — cukup mendanai spending rule 5 persen (E29) dengan sedikit margin. Perhatikan: bila PE hanya memberi 8 persen seperti saham publik, expected return jatuh ke 7,5 persen dan return riil 4,5 persen — di bawah spending rule. Premi illiquiditas bukan bonus; ia adalah penopang aritmatika seluruh model.",
      ],
      tasks: [],
      formula: String.raw`E(R_p) = \sum w_i E(R_i) \qquad \text{Premi illiquiditas} = E(R_{PE}) - E(R_{publik})`,
      formulaNote: "E(R p) = expected return portofolio; w = bobot; E(R) = expected return tiap kelas. Contoh: 8,1 persen. Premi illiquiditas = 11 persen − 8 persen = 3 poin.",
      reference: "Expected return 8,1 persen; return riil 5,1 persen (inflasi 3 persen); premi illiquiditas 3 poin.",
    },
    {
      id: "disiplin",
      eyebrow: "Langkah 4 · Teori",
      title: "Disiplin: mean reversion, rebalancing, dan manajer",
      prose: [
        "Swensen percaya pada mean reversion: kelas aset yang berkinerja buruk selama bertahun-tahun cenderung pulih, dan yang berkinerja luar biasa cenderung mendingin. Buktinya: value underperform 13 tahun (2007–2020) lalu rebound 30 persen (2021–2022) — PM-C8 membahasnya. Implikasinya: jangan mengejar kelas aset yang sedang panas dan jangan membuang yang sedang dingin. Rebalancing adalah pelaksanaannya: tiap tahun, jual kelas aset yang bobotnya naik di atas target dan beli yang turun di bawah target — menjual mahal, membeli murah, secara mekanis.",
        "Rebalancing Yale bukan kalender kaku — ia berbasis ambang: bila bobot menyimpang lebih dari 5 poin dari target, rebalance. Aturan ini memaksa disiplin contrarian: saat ekuitas jatuh 30 persen dan semua orang panik menjual, rebalancing memerintahkan MEMBELI ekuitas. Itulah sebabnya Yale membeli di 2009 sementara yang lain menjual — bukan karena berani, melainkan karena aturannya memerintahkannya.",
        "Pilar ketiga model Yale: manajer aktif terbaik. Swensen percaya pasar TIDAK efisien di aset illiquid — private equity, venture capital, real estate — karena informasinya tidak tersebar dan tidak ada indeks yang bisa dibeli. Di kelas aset itu, manajer top-quartile mengalahkan pasar secara konsisten, dan Yale menghabiskan upaya besar untuk menemukan mereka. Sebaliknya, di saham publik Amerika yang sangat efisien, Yale memakai indeks murah. Aturannya: bayar fee aktif HANYA di mana pasar tidak efisien; di mana efisien, bayar fee indeks.",
        "Pilar keempat: tata kelola. Komite investasi Yale bertemu rutin, tetapi TIDAK bereaksi terhadap berita harian — keputusan alokasi ditinjau tahunan, bukan mingguan. Swensen menulis bahwa musuh terbesar endowment bukan pasar, melainkan komite investasi itu sendiri yang panik saat krisis dan serakah saat booming. Struktur yang melindungi dari diri sendiri — aturan tertulis, ambang rebalancing, tinjauan tahunan — adalah bagian dari model, bukan hiasan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Meniru alokasi Yale tanpa horizon Yale. Alokasi 20 persen PE dan 20 persen real assets hanya bekerja dengan horizon 10 tahun lebih dan cadangan likuid untuk capital call. Investor individu yang meniru bobotnya tanpa meniru horizonnya akan menjual di titik terendah J-curve — dan menyalahkan modelnya.",
      },
      reference: "Rebalancing: ambang 5 poin dari target. Fee aktif hanya di pasar tidak efisien; saham publik memakai indeks murah.",
    },
    {
      id: "lab-endowment",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin expected return endowment",
      prose: [
        "Lab ini membangun mesin endowment: dari bobot dan return tiap kelas aset — hitung expected return portofolio, return riil, dan premi illiquiditas.",
        "Hitung dulu di kepala. Expected return = 0,10×7 + 0,15×8 + 0,20×11 + 0,20×9 + 0,20×8 + 0,15×4 = 0,7 + 1,2 + 2,2 + 1,8 + 1,6 + 0,6 = 8,1 persen. Return riil = 8,1 − 3,0 = 5,1 persen. Premi illiquiditas = 11 − 8 = 3,0 poin.",
        "Tugas lab: tulis fungsi yang menerima bobot, return tiap kelas, inflasi, return PE, dan return saham publik — lalu mencetak expected return, return riil, dan premi illiquiditas. Tiga angka ini adalah aritmatika yang menopang seluruh model Yale.",
        "Setelah lolos, coba eksperimen: turunkan return PE menjadi 8 persen (sama dengan saham publik) dan lihat expected return jatuh ke 7,5 persen, return riil 4,5 persen — di bawah spending rule 5 persen. Lalu tanyakan: masihkah model ini bekerja tanpa premi illiquiditas?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `exp_return` (jumlah bobot dikali return tiap kelas)" },
        { id: "t2", text: "Hitung `riil` (expected return dikurangi inflasi)" },
        { id: "t3", text: "Hitung `premi` (return PE dikurangi return saham publik)" },
      ],
      expected: "exp_return=8.1\nriil=5.1\npremi=3.0",
      hints: [
        "Expected return = jumlah (bobot x return) semua kelas aset.",
        "Return riil = expected return - inflasi.",
        "Premi illiquiditas = return PE - return saham publik.",
      ],
      code: {
        starter: `# Alokasi Yale (ilustratif): bobot dan expected return tiap kelas aset, dalam persen.\nbobot = [0.10, 0.15, 0.20, 0.20, 0.20, 0.15]\nret = [7.0, 8.0, 11.0, 9.0, 8.0, 4.0]  # domestik, asing, PE, real assets, absolute return, obligasi\ninflasi = 3.0\nret_pe = 11.0\nret_publik = 8.0\n\n# TULIS KODEMU: hitung exp_return, riil, premi.\n# Cetak, per baris: exp_return, riil, premi.\n\n`,
        lockLines: 6,
        solution: `# Alokasi Yale (ilustratif): bobot dan expected return tiap kelas aset, dalam persen.\nbobot = [0.10, 0.15, 0.20, 0.20, 0.20, 0.15]\nret = [7.0, 8.0, 11.0, 9.0, 8.0, 4.0]  # domestik, asing, PE, real assets, absolute return, obligasi\ninflasi = 3.0\nret_pe = 11.0\nret_publik = 8.0\n\n\nexp_return = sum(w * r for w, r in zip(bobot, ret))\nriil = exp_return - inflasi\npremi = ret_pe - ret_publik\nprint(f"exp_return={exp_return:.1f}")\nprint(f"riil={riil:.1f}")\nprint(f"premi={premi:.1f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "exp_return", value: 8.1, tol: 0.01, label: "Expected return 8,1 persen", msg: "0,7 + 1,2 + 2,2 + 1,8 + 1,6 + 0,6 = 8,1. Cukup mendanai spending rule 5 persen." },
          { kind: "equal", task: "t2", name: "riil", value: 5.1, tol: 0.01, label: "Return riil 5,1 persen", msg: "8,1 - 3,0 = 5,1. Di atas spending rule 5 persen — dengan margin tipis 0,1 poin." },
          { kind: "equal", task: "t3", name: "premi", value: 3.0, tol: 0.01, label: "Premi illiquiditas 3,0 poin", msg: "11 - 8 = 3,0. Tanpa premi ini, return riil jatuh ke 4,5 persen — di bawah spending rule." },
        ],
      },
      reference: "Expected return 8,1 persen; return riil 5,1 persen; premi illiquiditas 3,0 poin.",
    },
    {
      id: "tiruan",
      eyebrow: "Langkah 6 · Teori",
      title: "Meniru Yale: apa yang bisa dan tidak bisa ditiru",
      prose: [
        "Yang BISA ditiru investor individu: diversifikasi antar kelas aset yang digerakkan faktor berbeda (saham, obligasi, real estate, emas — PM-A8 dan E8 membahas korelasinya); rebalancing berbasis ambang (5 poin dari target) yang memaksa jual mahal dan beli murah; fee aktif hanya di mana pasar tidak efisien — untuk sebagian besar investor individu, itu berarti hampir tidak pernah, karena mereka tidak punya akses ke manajer top-quartile PE; dan tata kelola diri — aturan tertulis yang melindungimu dari panik dan serakah.",
        "Yang TIDAK bisa ditiru: akses. Yale mendapat alokasi di dana PE top-quartile karena reputasi 40 tahun dan komitmen miliaran dolar. Investor individu yang membeli dana PE ritel mendapat GP median — dan median PE setelah fee tidak jauh dari saham publik, dengan illiquiditas 10 tahun sebagai bonus yang tidak diminta. Premi illiquiditas 3 poin adalah premi untuk AKSES dan SKALA, bukan hanya untuk kesabaran.",
        "Jalan tengah yang masuk akal: tiru STRUKTUR-nya, bukan BOBOT-nya. Struktur Yale = diversifikasi faktor + rebalancing ambang + fee rendah di pasar efisien + aturan tertulis. Bobot Yale = 20 persen PE yang tidak bisa ditiru tanpa akses. Portofolio individu yang meniru struktur dengan instrumen likuid — ETF saham global, ETF obligasi, ETF REIT, emas — dan rebalancing 5 poin akan menangkap sebagian besar manfaat model Yale tanpa J-curve dan tanpa capital call.",
        "Aturan penutup Swensen untuk individu: 'Investor yang tidak bisa mengalahkan pasar harus puas dengan return pasar — dan itu sudah cukup.' Model Yale bukan undangan untuk menjadi Yale; ia adalah pelajaran bahwa return jangka panjang datang dari alokasi dan disiplin, bukan dari prediksi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira premi illiquiditas adalah hadiah untuk kesabaran. Sebagian premi itu adalah kompensasi risiko yang nyata — dana PE bisa gagal, manajer bisa buruk, dan uangmu terkunci saat kamu membutuhkannya. Premi adalah pembayaran untuk risiko, bukan hadiah untuk kebajikan.",
      },
      reference: "Tiru struktur Yale (diversifikasi faktor + rebalancing + fee rendah), bukan bobotnya (20 persen PE butuh akses).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: yayasan kecil yang meniru Yale",
      prose: [
        "Sebuah yayasan pendidikan di Indonesia dengan dana Rp50 miliar memutuskan 'meniru Yale': 20 persen ke private equity lokal, 20 persen ke properti, 15 persen obligasi. Tiga tahun kemudian, properti tidak laku dijual saat yayasan butuh dana beasiswa, dana PE memanggil modal Rp5 miliar di tengah krisis, dan spending rule 5 persen tidak terpenuhi karena return riil hanya 2 persen. Yayasan itu menyalahkan model Yale.",
        "Kesalahannya bukan pada model — melainkan pada peniruan bobot tanpa peniruan kondisi. Yale punya cadangan likuid besar, tim investasi puluhan orang, akses ke GP top-quartile, dan horizon yang benar-benar abadi. Yayasan itu punya satu bendahara paruh waktu, tidak ada cadangan likuid untuk capital call, dan kebutuhan beasiswa tahunan yang tidak bisa ditunda. Horizon 'abadi' di atas kertas tidak sama dengan horizon abadi di rekening bank.",
        "Keputusan yang benar untuk yayasan itu: tiru strukturnya — diversifikasi faktor dengan instrumen likuid (SBN, reksa dana saham global, reksa dana REIT), rebalancing ambang 5 poin, spending rule 4 persen (bukan 5 persen, karena return riil Indonesia lebih rendah), dan cadangan likuid 2 tahun belanja. Model Yale yang diterjemahkan dengan jujur ke skala kecil tetap model Yale — yang berbahaya adalah fotokopi tanpa terjemahan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat analisis ini benar. Pertama, kondisi (likuiditas, tim, akses, horizon nyata) diperiksa sebelum bobot ditiru. Kedua, spending rule disesuaikan dengan return riil lokal, bukan disalin dari Yale. Ketiga, struktur dipertahankan sementara bobot diterjemahkan — bukan sebaliknya.",
      },
      reference: "Tiru struktur, bukan bobot. Spending rule yayasan: 4 persen (return riil lokal lebih rendah dari Yale).",
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
        "Expected return 8,1 persen; return riil 5,1 persen; premi illiquiditas 3,0 poin.",
        "Alokasi Yale: PE 20 persen, real assets 20 persen, absolute return 20 persen, obligasi hanya 15 persen.",
        "Rebalancing berbasis ambang 5 poin — menjual mahal, membeli murah secara mekanis.",
        "Fee aktif hanya di pasar tidak efisien; saham publik memakai indeks murah.",
        "Tiru struktur Yale, bukan bobotnya — akses ke GP top-quartile tidak bisa ditiru individu.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Alokasi ilustratif Yale: domestik 10 persen (7 persen), asing 15 persen (8 persen), PE 20 persen (11 persen), real assets 20 persen (9 persen), absolute return 20 persen (8 persen), obligasi 15 persen (4 persen). Berapa expected return portofolio?",
          options: [
            { text: "7,5 persen — rata-rata return keenam kelas", why: "Salah: expected return memakai BOBOT, bukan rata-rata sederhana. (7+8+11+9+8+4)/6 = 7,83 pun bukan jawabannya." },
            { text: "8,1 persen", why: "Tepat: 0,7 + 1,2 + 2,2 + 1,8 + 1,6 + 0,6 = 8,1. Dengan inflasi 3 persen, return riil 5,1 persen — cukup untuk spending rule 5 persen.", correct: true },
            { text: "11,0 persen — sama dengan return PE tertinggi", why: "Salah: portofolio bukan seluruhnya PE. Bobot 20 persen berarti PE hanya menyumbang 2,2 poin." },
            { text: "4,0 persen — sama dengan return obligasi", why: "Salah: obligasi hanya 15 persen dari portofolio. Return portofolio didominasi ekuitas dan alternatif." },
          ],
        },
        {
          q: "Tanpa premi illiquiditas (PE hanya memberi 8 persen seperti saham publik), apa yang terjadi pada aritmatika model Yale?",
          options: [
            { text: "Tidak ada yang berubah — PE bukan bagian penting model", why: "Salah: PE 20 persen × selisih 3 poin = 0,6 poin expected return. Tanpanya, expected return jatuh ke 7,5 persen." },
            { text: "Expected return jatuh ke 7,5 persen, return riil 4,5 persen — di bawah spending rule 5 persen", why: "Tepat: 8,1 − 0,6 = 7,5; 7,5 − 3,0 = 4,5. Premi illiquiditas menopang seluruh model.", correct: true },
            { text: "Expected return naik — PE yang rendah justru membantu", why: "Salah: menurunkan return kelas aset tidak pernah menaikkan expected return portofolio." },
            { text: "Spending rule otomatis turun mengikuti", why: "Salah: spending rule adalah KEBIJAKAN (5 persen) — ia tidak menyesuaikan diri. Yang menyesuaikan adalah daya beli pokok yang tergerus." },
          ],
        },
        {
          q: "Ekuitas jatuh 30 persen dan bobotnya turun 8 poin di bawah target. Apa yang diperintahkan aturan rebalancing Yale?",
          options: [
            { text: "Jual ekuitas — tren turun harus diikuti", why: "Salah: itu momentum, bukan rebalancing. Rebalancing berbasis ambang memerintahkan sebaliknya." },
            { text: "Beli ekuitas sampai kembali ke target — menjual mahal, membeli murah secara mekanis", why: "Tepat: penyimpangan 8 poin melewati ambang 5 poin. Rebalancing memaksa contrarian — membeli saat semua orang panik.", correct: true },
            { text: "Tunggu sampai pasar pulih baru rebalance", why: "Salah: menunggu pulih berarti membeli setelah naik — kebalikan dari jual mahal beli murah." },
            { text: "Ubah target alokasi agar sesuai bobot baru", why: "Salah: mengubah target untuk menyesuaikan kenyataan adalah menyerah pada disiplin. Target diubah hanya dengan alasan strategis, bukan karena pasar bergerak." },
          ],
        },
        {
          q: "Kenapa Yale memakai manajer aktif mahal untuk private equity tetapi indeks murah untuk saham publik Amerika?",
          options: [
            { text: "Karena saham publik Amerika lebih berisiko dari PE", why: "Salah: bukan soal risiko. Ini soal EFISIENSI pasar: saham publik AS sangat efisien sehingga fee aktif jarang terbayar; PE tidak efisien sehingga manajer top bisa menang." },
            { text: "Karena pasar PE tidak efisien (informasi tidak tersebar, tidak ada indeks) — manajer top-quartile bisa menang; pasar saham AS efisien — fee aktif jarang terbayar", why: "Tepat: bayar fee aktif hanya di mana pasar tidak efisien. Di mana efisien, bayar fee indeks.", correct: true },
            { text: "Karena Yale tidak mampu membayar fee aktif untuk saham publik", why: "Salah: Yale mampu membayar apa pun. Keputusannya berdasarkan efisiensi pasar, bukan anggaran." },
            { text: "Karena indeks saham publik tidak tersedia untuk institusi besar", why: "Salah: indeks tersedia untuk siapa pun. Yale memilih indeks untuk saham publik karena keyakinan, bukan keterbatasan." },
          ],
        },
        {
          q: "Yayasan kecil dengan dana Rp50 miliar dan satu bendahara paruh waktu ingin 'meniru Yale' dengan 20 persen PE dan 20 persen properti. Apa nasihat yang benar?",
          options: [
            { text: "Lanjutkan — bobot Yale terbukti berhasil di mana pun", why: "Salah: bobot Yale bekerja dengan kondisi Yale (likuiditas, tim, akses, horizon nyata). Tanpa kondisinya, bobot itu berbahaya." },
            { text: "Tiru strukturnya (diversifikasi faktor + rebalancing + fee rendah), bukan bobotnya — pakai instrumen likuid dan spending rule 4 persen", why: "Tepat: struktur diterjemahkan ke skala kecil; bobot disesuaikan dengan likuiditas dan return riil lokal.", correct: true },
            { text: "Naikkan PE menjadi 40 persen — lebih Yale dari Yale", why: "Salah: menggandakan bobot tanpa akses dan likuiditas adalah cara tercepat menuju default capital call." },
            { text: "Jangan meniru apa pun dari Yale — model itu hanya untuk universitas besar", why: "Salah: terlalu ekstrem. Struktur model (diversifikasi, disiplin, fee) berlaku universal; yang tidak berlaku universal adalah bobot dan aksesnya." },
          ],
        },
      ],
    },
  ],
};

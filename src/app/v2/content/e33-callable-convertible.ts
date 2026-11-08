import type { V2Lesson } from "../lib/types";

export const e33: V2Lesson = {
  slug: "e33-callable-convertible",
  track: "Financial Markets",
  module: "Obligasi & Suku Bunga",
  title: "E33 — Obligasi Callable dan Convertible: Menilai Opsi yang Tersembunyi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Obligasi kupon 9 persen yang hilang tepat saat suku bunga turun",
      prose: [
        "Tahun 2024, Budi membeli obligasi korporat kupon 9 persen — jauh di atas pasar 7 persen — seharga Rp1.050.000 per Rp1.000.000 nominal. Ia menghitung yield to maturity 8,2 persen dan merasa menang. Tahun 2026, suku bunga turun ke 5 persen. Harga obligasi polos sejenis naik ke Rp1.120.000. Obligasi Budi? Dipanggil emiten di harga Rp1.050.000 — call price-nya — dan uangnya kembali. Ia kehilangan obligasi kupon 9 persen tepat saat obligasi seperti itu paling berharga, dan harus menginvestasikan ulang di 5 persen.",
        "Budi tidak membeli obligasi polos — ia membeli obligasi callable, dan tanpa sadar ia MENJUAL opsi call kepada emiten. Kupon 9 persen yang terlihat murah hati itu sebagian adalah premi yang dibayar emiten untuk hak memanggil obligasi itu kembali. Yield to maturity 8,2 persen yang ia hitung adalah dongeng: skenario itu hanya terjadi bila emiten TIDAK memanggil — dan emiten memanggil tepat saat pemanggilan itu paling merugikan Budi.",
        "Lesson ini membangun dari singgungan yang sudah ada: PM-A7 mengajarkan yield-to-worst untuk callable, PM-A7B mengajarkan effective duration dan negative convexity. Yang belum pernah diajarkan adalah VALUASI-nya: option-adjusted spread (OAS), pohon binomial, dan — untuk convertible — paritas konversi dan premi konversi. Setelah lesson ini kamu bisa: (1) menghitung yield-to-call dan yield-to-worst; (2) menjelaskan OAS; (3) menghitung paritas dan premi konversi; (4) menghitung harga impas saham untuk convertible; (5) memutuskan kapan callable atau convertible layak dibeli.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "PM-A7 menyebut callable sekali (YTM adalah skenario terbaik emiten; pakai yield-to-worst) dan PM-A7B membahas effective duration serta negative convexity untuk callable. Tidak ada lesson yang menghitung yield-to-call, OAS, atau valuasi convertible (paritas, premi, harga impas). Lesson ini membangun ketiganya dari nol dengan sudut valuasi Financial Markets.",
      },
      reference: "Convertible: rasio konversi 40, harga saham Rp25.000 → paritas Rp1.000.000; harga obligasi Rp1.100.000 → premi 10 persen; harga impas saham Rp27.500.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa melihat opsi yang tersembunyi di dalam obligasi — dan menagih harganya.",
        "(1) Menghitung yield-to-call dan memilih yield-to-worst;",
        "(2) Menjelaskan option-adjusted spread (OAS) dan kenapa ia lebih jujur dari spread biasa;",
        "(3) Menghitung paritas konversi dan premi konversi;",
        "(4) Menghitung harga saham impas untuk convertible;",
        "(5) Memutuskan kapan callable atau convertible layak dibeli — dan kapan tidak.",
      ],
      tasks: [],
    },
    {
      id: "callable",
      eyebrow: "Langkah 3 · Teori",
      title: "Callable: emiten memegang opsi atas uangmu",
      prose: [
        "Obligasi callable memberi emiten hak — bukan kewajiban — untuk membeli kembali obligasi sebelum jatuh tempo di harga call yang sudah ditentukan. Bagi emiten, ini asuransi suku bunga: bila suku bunga turun, ia memanggil obligasi kupon tinggi dan menerbitkan yang baru dengan kupon lebih rendah. Bagi investor, ini risiko reinvestasi yang dipaksakan: uangmu kembali tepat saat tidak ada tempat bagus untuk menginvestasikannya.",
        "Karena itu yield to maturity (YTM) untuk callable adalah skenario terbaik EMITEN, bukan kamu. Ukuran yang jujur adalah yield-to-worst (YTW): yang terendah dari YTM dan semua yield-to-call (YTC) di tiap tanggal call. Contoh yang dihitung penuh: obligasi 10 tahun kupon 7 persen, harga 102. YTM-nya ≈ 6,7 persen — yaitu y yang memenuhi 102 = 7 × anuitas 10 tahun + 100 yang didiskonto 10 tahun. Tetapi obligasi ini callable dalam 2 tahun di harga 100 (par): YTC-nya adalah y yang memenuhi 102 = 7/(1+y) + 107/(1+y)² — persamaan kuadrat yang memberi y ≈ 5,9 persen. YTW = min(6,7 persen; 5,9 persen) = 5,9 persen — bukan 6,7 persen. Investor yang membeli dengan ekspektasi 6,7 persen sedang membeli skenario yang emitennya akan batalkan begitu menguntungkan.",
        "Valuasi yang benar memisahkan harga obligasi callable menjadi dua bagian: harga obligasi polos DIKURANGI nilai opsi call yang dijual investor ke emiten. Opsi itu dinilai dengan pohon binomial suku bunga: di tiap node, emiten memanggil bila harga obligasi melebihi harga call. Selisih antara spread obligasi callable dan spread obligasi polos yang setara — setelah mengeluarkan nilai opsi — disebut option-adjusted spread (OAS). OAS adalah spread yang tersisa setelah opsi dikeluarkan: ia terutama mengukur kompensasi risiko kredit — tetapi OAS juga memuat premi likuiditas dan faktor pasar lain, jadi ia bukan 'kredit murni'.",
        "Contoh pohon binomial satu langkah (per Rp100 nominal) — cara OAS benar-benar dihitung. Obligasi 2 tahun, kupon 7, callable di harga 100 pada akhir tahun 1. Suku bunga tahun 1: 5 persen. Tahun 2: naik ke 8 persen atau turun ke 4 persen, masing-masing peluang risk-neutral 50 persen. Di akhir tahun 1, nilai ex-kupon: bila suku bunga naik, (7+100)/1,08 = 99,07; bila turun, (7+100)/1,04 = 102,88. Emiten memanggil bila nilai melebihi harga call 100 — hanya di skenario turun, nilainya dipangkas ke 100. Nilai callable hari ini = [0,5×(7+99,07) + 0,5×(7+100)]/1,05 = 101,46. Nilai obligasi polos yang sama = [0,5×(7+99,07) + 0,5×(7+102,88)]/1,05 = 102,84. Nilai opsi call = 102,84 − 101,46 = 1,37 per Rp100 nominal. OAS adalah spread konstan yang ditambahkan ke tiap suku bunga diskonto di pohon ini agar harga model sama dengan harga pasar callable — ia dihitung secara numerik, bukan dari rumus tertutup, dan ia berubah bila volatilitas suku bunga berubah.",
        "Aturan praktis: bandingkan OAS, bukan YTM, antar obligasi callable. Dua obligasi dengan YTM sama bisa punya OAS yang sangat berbeda — yang satu murah karena risiko kreditnya tinggi, yang lain murah karena opsinya mahal. Dan ingat negative convexity (PM-A7B): saat yield turun, harga callable tertahan di harga call — untungmu dipangkas tepat saat obligasi polos sedang berpesta.",
      ],
      tasks: [],
      formula: String.raw`\text{YTW} = \min(\text{YTM}, \text{YTC}_1, \text{YTC}_2, \dots) \qquad P_{callable} = P_{polos} - V_{opsi}`,
      formulaNote: "YTW = yield terendah dari semua skenario (jatuh tempo dan tiap tanggal call). Harga callable = harga obligasi polos dikurangi nilai opsi call milik emiten. Contoh: YTM 6,7 persen, YTC 5,9 persen → YTW 5,9 persen.",
      reference: "YTM 6,7 persen, YTC 5,9 persen → YTW 5,9 persen. OAS = spread setelah nilai opsi dikeluarkan. Pohon binomial 1 langkah: opsi call 1,37 per Rp100 nominal.",
    },
    {
      id: "convertible",
      eyebrow: "Langkah 4 · Teori",
      title: "Convertible: obligasi yang bisa berubah menjadi saham",
      prose: [
        "Obligasi convertible memberi INVESTOR hak untuk menukar obligasi menjadi saham emiten dengan rasio konversi yang sudah ditentukan. Ini kebalikan dari callable: opsinya di tanganmu, bukan emiten. Kamu mendapat kupon obligasi (lebih rendah dari obligasi polos, karena kamu membayar untuk opsi) plus partisipasi bila saham naik.",
        "Tiga angka yang menentukan segalanya. Paritas konversi = rasio konversi × harga saham saat ini. Rasio 40 dan harga saham Rp25.000 → paritas Rp1.000.000. Itulah nilai obligasi itu BILA langsung dikonversi hari ini. Premi konversi = (harga obligasi − paritas) dibagi paritas. Harga obligasi Rp1.100.000 → premi (1.100.000 − 1.000.000) dibagi 1.000.000 = 10 persen. Premi adalah harga yang kamu bayar untuk proteksi bawah (kupon + pokok obligasi) dan waktu (opsi masih hidup). Harga saham impas = harga obligasi dibagi rasio konversi = 1.100.000 dibagi 40 = Rp27.500 — saham harus naik ke Rp27.500 sebelum konversi menguntungkan.",
        "Convertible hidup di antara dua dunia. Saat saham jauh di bawah impas, ia berperilaku seperti obligasi (bond floor): harganya ditopang nilai obligasi polosnya. Saat saham jauh di atas impas, ia berperilaku seperti saham: naik turun mengikuti saham. Di tengah — dekat impas — ia paling menarik: naik mengikuti saham saat saham naik, tetapi jatuh lebih pelan saat saham turun karena lantai obligasi menahannya. Profil inilah yang dibeli investor convertible: partisipasi naik dengan bantalan turun.",
        "Jebakan terbesar: dilusi dan call paksa. Emiten bisa memaksa konversi dengan memanggil obligasi saat saham tinggi (forced conversion) — investor yang lengah kehilangan kuponnya. Dan rasio konversi bisa disesuaikan saat ada stock split atau dividen besar — baca prospektusnya. Aturan praktis: beli convertible bila premi di bawah 15 persen DAN kamu memang mau memiliki sahamnya; bila premi di atas 25 persen, kamu membayar terlalu mahal untuk opsi yang mungkin tidak pernah bernilai.",
      ],
      tasks: [],
      formula: String.raw`\text{Paritas} = R \times S \qquad \text{Premi} = \frac{P - \text{Paritas}}{\text{Paritas}} \qquad S_{impas} = \frac{P}{R}`,
      formulaNote: "R = rasio konversi (40 saham per obligasi); S = harga saham (Rp25.000); P = harga obligasi (Rp1.100.000). Paritas Rp1.000.000; premi 10 persen; harga impas Rp27.500.",
      reference: "Paritas Rp1.000.000; premi 10 persen; harga impas Rp27.500.",
    },
    {
      id: "lab-konversi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin valuasi convertible",
      prose: [
        "Lab ini membangun mesin valuasi convertible: dari rasio konversi, harga saham, dan harga obligasi — hitung paritas, premi konversi, dan harga saham impas.",
        "Hitung dulu di kepala. Paritas = 40 × 25.000 = Rp1.000.000. Premi = (1.100.000 − 1.000.000) dibagi 1.000.000 × 100 = 10,0 persen. Harga impas = 1.100.000 dibagi 40 = Rp27.500. Saham harus naik 10 persen (dari 25.000 ke 27.500) sebelum konversi menguntungkan.",
        "Tugas lab: tulis fungsi yang menerima rasio konversi, harga saham, dan harga obligasi — lalu mencetak paritas, premi persen, dan harga impas. Tiga angka ini adalah seluruh pertanyaan pertama sebelum membeli convertible apa pun.",
        "Setelah lolos, coba eksperimen: naikkan harga saham menjadi Rp30.000 dan lihat paritas menjadi Rp1.200.000 — di atas harga obligasi Rp1.100.000. Premi menjadi negatif: pasar memberi diskon, dan konversi langsung menguntungkan. Lalu tanyakan: kenapa pasar membiarkan premi negatif?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `paritas` (rasio konversi dikali harga saham)" },
        { id: "t2", text: "Hitung `premi_persen` ((harga obligasi - paritas) dibagi paritas, dikali 100)" },
        { id: "t3", text: "Hitung `harga_impas` (harga obligasi dibagi rasio konversi)" },
      ],
      expected: "paritas=1000000\npremi_persen=10.0\nharga_impas=27500",
      hints: [
        "Paritas = rasio konversi x harga saham.",
        "Premi persen = (harga obligasi - paritas) / paritas x 100.",
        "Harga impas = harga obligasi / rasio konversi.",
      ],
      code: {
        starter: `# Convertible: rasio 40 saham, harga saham Rp25.000, harga obligasi Rp1.100.000.\nrasio = 40\nharga_saham = 25_000\nharga_obligasi = 1_100_000\n\n# TULIS KODEMU: hitung paritas, premi_persen, harga_impas.\n# Cetak, per baris: paritas, premi_persen, harga_impas.\n\n`,
        lockLines: 4,
        solution: `# Convertible: rasio 40 saham, harga saham Rp25.000, harga obligasi Rp1.100.000.\nrasio = 40\nharga_saham = 25_000\nharga_obligasi = 1_100_000\n\n\nparitas = rasio * harga_saham\npremi_persen = (harga_obligasi - paritas) / paritas * 100\nharga_impas = harga_obligasi / rasio\nprint(f"paritas={paritas:.0f}")\nprint(f"premi_persen={premi_persen:.1f}")\nprint(f"harga_impas={harga_impas:.0f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "paritas", value: 1000000, tol: 1, label: "Paritas Rp1.000.000", msg: "40 x 25.000 = 1.000.000. Itulah nilai konversi hari ini." },
          { kind: "equal", task: "t2", name: "premi_persen", value: 10.0, tol: 0.01, label: "Premi 10,0 persen", msg: "(1.100.000 - 1.000.000) / 1.000.000 x 100 = 10,0. Premi di bawah 15 persen — masih wajar." },
          { kind: "equal", task: "t3", name: "harga_impas", value: 27500, tol: 1, label: "Harga impas Rp27.500", msg: "1.100.000 / 40 = 27.500. Saham harus naik 10 persen sebelum konversi menguntungkan." },
        ],
      },
      reference: "Paritas Rp1.000.000; premi 10,0 persen; harga impas Rp27.500.",
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 6 · Teori",
      title: "Keputusan: kapan membeli, kapan menolak",
      prose: [
        "Callable layak dibeli bila YTW — bukan YTM — masih mengalahkan obligasi polos sejenis setelah memperhitungkan risiko reinvestasi. Bila YTC jauh di bawah YTM (selisih lebih dari 1 poin), emiten hampir pasti memanggil: kamu membeli obligasi 3 tahun berkedok obligasi 10 tahun. Satu-satunya alasan membeli callable dengan YTC rendah adalah bila kamu memang butuh durasi pendek dan kuponnya masih lebih baik dari alternatif 3 tahun.",
        "Convertible layak dibeli bila dua syarat terpenuhi: premi di bawah 15 persen, dan kamu memang mau memiliki saham emiten itu. Bila premi di atas 25 persen, kamu membayar mahal untuk opsi — lebih baik beli obligasi polos plus opsi saham secara terpisah, di mana harganya transparan. Bila kamu tidak mau memiliki sahamnya, jangan beli convertible: opsi yang tidak kamu inginkan tetap kamu bayar lewat kupon yang lebih rendah.",
        "Satu peringatan terakhir untuk keduanya: likuiditas. Obligasi callable dan convertible diperdagangkan lebih tipis dari obligasi polos — spread bid-ask-nya lebih lebar (E31), dan saat stres, pembelinya menghilang lebih dulu. Harga yang terlihat di layar bisa menjadi fiksi bila kamu perlu menjual cepat. Selalu tanyakan spread-nya sebelum membeli, bukan setelah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membandingkan callable dengan obligasi polos memakai YTM. Perbandingan yang benar memakai YTW untuk callable dan OAS untuk keduanya. YTM callable adalah janji yang emitennya berhak batalkan.",
      },
      reference: "Callable: beli bila YTW masih menang. Convertible: beli bila premi di bawah 15 persen dan kamu mau sahamnya.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: Budi, dua tahun kemudian",
      prose: [
        "Kembali ke Budi. Obligasinya dipanggil di Rp1.050.000 dan ia harus menginvestasikan ulang di suku bunga 5 persen. Kerugian nyatanya: ia kehilangan kupon 9 persen selama 8 tahun tersisa — selisih 4 poin per tahun atas Rp1.000.000 nominal, atau Rp40.000 per tahun; nilai kini selisih itu (didiskonto 5 persen selama 8 tahun) sekitar Rp259.000. Itulah harga opsi call yang ia jual tanpa sadar — dan ia tidak pernah menerima premi yang sepadan, karena kupon 9 persen itu sebagian adalah kompensasi risiko kredit, bukan premi opsi.",
        "Seandainya Budi membaca lesson ini sebelum membeli, ia akan menghitung yield-to-worst — bukan yield-to-maturity — dan membandingkannya dengan obligasi polos yang setara. Ia akan melihat bahwa obligasi itu tidak murah sama sekali; ia hanya terlihat murah bagi yang tidak menghitung opsi. Atau ia akan membeli convertible sebagai gantinya: opsi di tangannya, bukan di tangan emiten.",
        "Pelajaran Budi adalah pelajaran seluruh lesson ini: obligasi dengan opsi tersembunyi harus dinilai dengan opsinya dikeluarkan. Harga yang mengabaikan opsi adalah harga yang salah — dan pasar akan menagih selisihnya tepat saat kamu paling tidak siap.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat analisis ini benar. Pertama, YTW dipakai sebagai ukuran, bukan YTM. Kedua, nilai opsi dihitung sebagai bagian dari harga — bukan diabaikan. Ketiga, keputusan dibandingkan dengan alternatif yang setara (obligasi polos atau convertible), bukan dengan angan-angan.",
      },
      reference: "Kerugian Budi sekitar Rp259.000 nilai kini (Rp40.000/tahun × 8 tahun didiskonto 5 persen) — harga opsi call yang ia jual tanpa sadar.",
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
        "YTW = yang terendah dari YTM dan semua YTC. Contoh: YTM 6,7 persen, YTC 5,9 persen → YTW 5,9 persen.",
        "Harga callable = harga obligasi polos dikurangi nilai opsi call milik emiten.",
        "Paritas Rp1.000.000; premi 10 persen; harga impas Rp27.500.",
        "Convertible: di bawah impas berperilaku seperti obligasi; di atas impas seperti saham.",
        "Callable: beli bila YTW masih menang. Convertible: beli bila premi di bawah 15 persen dan kamu mau sahamnya.",
      ],
      next: { label: "E34 — Swap sebagai Instrumen: Valuasi, Kurva, dan Swap Spread", href: "/v2/learn/e34-swap-valuasi" },
      quiz: [
        {
          q: "Obligasi 10 tahun kupon 7 persen, harga 102, YTM 6,7 persen, callable dalam 2 tahun di harga 100 dengan YTC 5,9 persen. Berapa yield-to-worst?",
          options: [
            { text: "6,7 persen — YTM selalu dipakai", why: "Salah: YTM adalah skenario terbaik emiten. Bila suku bunga turun, emiten memanggil dan kamu hanya mendapat YTC." },
            { text: "5,9 persen — yang terendah dari YTM dan YTC", why: "Tepat: YTW = min(6,7 persen; 5,9 persen) = 5,9 persen. Itulah return yang bisa kamu harapkan dengan jujur.", correct: true },
            { text: "6,3 persen — rata-rata YTM dan YTC", why: "Salah: YTW bukan rata-rata. Ia skenario terburuk — yang terendah — karena emiten memilih skenario yang menguntungkannya." },
            { text: "7,0 persen — kupon adalah yield-nya", why: "Salah: kupon bukan yield bila harga bukan par. Yield dihitung dari harga, kupon, dan skenario call." },
          ],
        },
        {
          q: "Convertible: rasio konversi 40, harga saham Rp25.000, harga obligasi Rp1.100.000. Berapa paritas, premi, dan harga impas saham?",
          options: [
            { text: "Paritas Rp1.000.000; premi 10 persen; impas Rp27.500", why: "Tepat: 40 × 25.000 = 1.000.000; (1.100.000 − 1.000.000) / 1.000.000 = 10 persen; 1.100.000 / 40 = 27.500.", correct: true },
            { text: "Paritas Rp1.100.000; premi 0 persen; impas Rp25.000", why: "Salah: paritas memakai harga saham saat ini (40 × 25.000), bukan harga obligasi. Premi tidak nol." },
            { text: "Paritas Rp1.000.000; premi 10 persen; impas Rp25.000", why: "Salah: harga impas = harga obligasi dibagi rasio = 1.100.000 / 40 = 27.500, bukan harga saham saat ini." },
            { text: "Paritas Rp625.000; premi 76 persen; impas Rp44.000", why: "Salah: 625.000 berasal dari pembagian yang terbalik (1.000.000 / 40 × 25). Paritas = rasio DIKALI harga saham." },
          ],
        },
        {
          q: "Dua obligasi callable punya YTM yang sama. Obligasi A OAS-nya 80 bps, obligasi B OAS-nya 150 bps. Mana yang lebih murah dari sisi risiko kredit?",
          options: [
            { text: "A — OAS lebih kecil berarti lebih murah", why: "Salah: terbalik. OAS lebih besar berarti spread kredit murni lebih besar — pasar membayar lebih untuk risiko yang sama." },
            { text: "B — OAS lebih besar berarti kompensasi risiko kreditnya lebih besar", why: "Tepat: OAS mengeluarkan nilai opsi, jadi sisanya adalah kompensasi kredit murni. OAS 150 bps berarti kamu dibayar lebih untuk risiko kredit yang sama.", correct: true },
            { text: "Tidak bisa dibandingkan — OAS tidak berlaku untuk callable", why: "Salah: OAS justru dirancang untuk obligasi beropsi — ia mengeluarkan nilai opsi agar spread bisa dibandingkan." },
            { text: "Keduanya sama — YTM sama berarti harga sama", why: "Salah: YTM yang sama bisa menyembunyikan komposisi berbeda antara nilai opsi dan spread kredit. OAS membongkarnya." },
          ],
        },
        {
          q: "Harga saham naik jauh di atas harga impas convertible-mu. Bagaimana perilaku convertible itu sekarang?",
          options: [
            { text: "Seperti obligasi — harganya ditopang lantai obligasi", why: "Salah: itu perilaku saat saham JAUH DI BAWAH impas. Di atas impas, convertible mengikuti saham." },
            { text: "Seperti saham — naik turun mengikuti harga saham", why: "Tepat: jauh di atas impas, nilai konversi mendominasi dan lantai obligasi tidak relevan lagi.", correct: true },
            { text: "Tetap di harga beli — convertible tidak bergerak", why: "Salah: convertible bergerak mengikuti saham dan suku bunga. Harga yang diam berarti pasarnya mati, bukan sifatnya." },
            { text: "Langsung dikonversi otomatis oleh emiten", why: "Salah: konversi adalah hak investor, bukan kewajiban otomatis. Emiten hanya bisa memaksa lewat call bila prospektus mengizinkan." },
          ],
        },
        {
          q: "Convertible dengan premi 30 persen, dan kamu tidak mau memiliki saham emiten itu. Apa keputusan yang benar?",
          options: [
            { text: "Beli — premi tinggi berarti perlindungan tinggi", why: "Salah: premi 30 persen berarti kamu membayar sangat mahal untuk opsi. Perlindungannya tidak sebanding dengan harganya." },
            { text: "Beli — kupon convertible selalu lebih tinggi dari obligasi polos", why: "Salah: terbalik. Kupon convertible LEBIH RENDAH dari obligasi polos karena kamu membayar untuk opsi." },
            { text: "Tolak — premi di atas 25 persen terlalu mahal, dan kamu membayar opsi yang tidak kamu inginkan", why: "Tepat: dua alasan sekaligus — premi mahal dan opsi tidak diinginkan. Beli obligasi polos saja.", correct: true },
            { text: "Beli lalu segera konversi — premi hilang setelah konversi", why: "Salah: konversi saat premi 30 persen berarti kamu membayar Rp1.300.000 untuk saham senilai Rp1.000.000. Premi tidak hilang — ia menjadi kerugianmu." },
          ],
        },
      ],
    },
  ],
};

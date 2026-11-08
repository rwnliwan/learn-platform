import type { V2Lesson } from "../lib/types";

export const mr34: V2Lesson = {
  slug: "mr34-hedge-fund-illiquidity",
  track: "Market Risk",
  module: "Risiko Likuiditas",
  title: "MR34 — Risiko Hedge Fund dan Illiquidity: Leverage, Gate, dan Side Pocket",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dana yang naik 20 persen setahun — lalu investornya tidak bisa keluar selama 2 tahun",
      prose: [
        "Tahun 2007, hedge fund Meridian Capital melaporkan return 20 persen — mengalahkan semua indeks. Investor mengantre masuk. Tahun 2008, portofolionya jatuh 4 persen — kecil, hanya 4 persen. Tetapi Meridian memakai leverage 25:1: aset Rp125 miliar didanai ekuitas Rp5 miliar. Kerugian 4 persen dari aset = Rp5 miliar — SELURUH ekuitasnya lenyap. Investor yang meminta penarikan mendapati pintu terkunci: gate 10 persen berarti hanya Rp100 miliar dari Rp300 miliar permintaan yang dibayar; sisanya ditunda. Side pocket memisahkan aset illiquid ke kantong terpisah yang tidak bisa dicairkan bertahun-tahun. Return 20 persen itu nyata — dan tidak bisa diambil.",
        "Inilah risiko hedge fund yang tidak terlihat di factsheet: leverage yang mengubah kerugian kecil menjadi kebangkrutan, illiquiditas yang mengubah 'dana' menjadi 'penjara', dan struktur penarikan yang mengubah investor menjadi antrean. LTCM 1998 adalah pola yang sama dalam skala lebih besar: leverage 25:1, kerugian 4 persen, dan penyelamatan oleh 14 bank karena kebangkrutannya mengancam sistem.",
        "Lesson ini membangun sudut market risk yang hanya disinggung sekali di track ini: MR26 menyebut hedge fund dalam satu skenario (investor agresif yang menolak lindung nilai), dan PM-A9B membahas hedge fund dari sudut investor (fee 2 and 20, strategi). Tidak ada lesson tentang RISIKO hedge fund itu sendiri: leverage, likuiditas, gate, side pocket, dan prime brokerage. Setelah lesson ini kamu bisa: (1) menghitung bagaimana leverage mengubah kerugian kecil menjadi kebangkrutan; (2) menjelaskan gate dan side pocket; (3) menghitung funding gap saat redemption; (4) menjelaskan risiko prime brokerage dan rehypothecation; (5) menilai hedge fund sebagai counterparty dan sebagai investasi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MR26 menyebut hedge fund dalam satu skenario dua kalimat (investor agresif menolak drag lindung nilai) dan PM-A9B membahas hedge fund dari sudut investor (strategi long-short, fee 2 and 20). Tidak ada lesson tentang risiko hedge fund sebagai objek risiko pasar: leverage, illiquiditas aset, gate, side pocket, lock-up, prime brokerage, dan rehypothecation. Lesson ini membangun sudut itu dari nol.",
      },
      reference: "Leverage 25:1 — kerugian 4 persen menghapus seluruh ekuitas Rp5 miliar. Gate 10 persen: permintaan Rp300 miliar, dibayar Rp100 miliar, ditunda Rp200 miliar.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca factsheet hedge fund dengan mata risiko — bukan mata return.",
        "(1) Menghitung bagaimana leverage mengubah kerugian kecil menjadi kebangkrutan;",
        "(2) Menjelaskan lock-up, gate, dan side pocket sebagai manajemen likuiditas dana;",
        "(3) Menghitung funding gap saat redemption melebihi gate;",
        "(4) Menjelaskan risiko prime brokerage dan rehypothecation;",
        "(5) Menilai hedge fund sebagai counterparty dan sebagai investasi.",
      ],
      tasks: [],
    },
    {
      id: "leverage",
      eyebrow: "Langkah 3 · Teori",
      title: "Leverage: pengali yang sama dengan 2008",
      prose: [
        "Matematika leverage hedge fund sama dengan matematika bank 2008 (E37): ekuitas = aset dibagi leverage; kerugian bangkrut = 1 dibagi leverage. Leverage 25:1 berarti ekuitas 4 persen dari aset — kerugian aset 4 persen menghapus seluruh ekuitas. Meridian: aset Rp125 miliar, ekuitas Rp5 miliar, kerugian 4 persen = Rp5 miliar — nol. LTCM 1998: aset 125 miliar dolar, ekuitas 5 miliar dolar, leverage 25:1 — kerugian 4 persen memicu penyelamatan sistemik.",
        "Yang membuat leverage hedge fund lebih berbahaya dari leverage bank: hedge fund tidak punya lender of last resort, tidak punya asuransi deposito, dan tidak wajib lapor posisi ke publik. Bank yang goyang bisa diselamatkan bank sentral; hedge fund yang goyang hanya bisa diselamatkan oleh investornya — yang sedang mengantre keluar. Dan leverage hedge fund sering tersembunyi: derivatif (MR11) memberi eksposur besar dengan modal kecil — leverage ekonomi bisa jauh lebih besar dari leverage akuntansi yang terlihat di neraca.",
        "Tiga ukuran leverage yang wajib ditanyakan sebelum berinvestasi. Gross leverage: total aset (long + short) dibagi ekuitas — mengukur ukuran taruhan. Net leverage: (long − short) dibagi ekuitas — mengukur arah taruhan. Leverage derivatif: notional derivatif dibagi ekuitas — mengukur eksposur yang tidak terlihat di neraca. Dana dengan gross leverage 5:1 dan net leverage 0,5:1 bisa terlihat aman — sampai pasar bergerak dan kedua sisinya rugi bersamaan (basis risk, korelasi naik saat stres).",
        "Aturan praktis: tanyakan leverage DALAM skenario stres, bukan leverage hari ini. Leverage 25:1 di masa tenang dengan volatilitas 10 persen berarti VaR harian 2,5 persen dari ekuitas — sudah besar. Saat volatilitas naik ke 30 persen (krisis), VaR harian menjadi 7,5 persen dari ekuitas — dan 4 hari buruk berturut-turut menghapus sepertiga dana. Leverage yang 'aman' di masa tenang adalah leverage yang mematikan di masa stres.",
      ],
      tasks: [],
      formula: String.raw`r_{bangkrut} = \frac{1}{L} \qquad \text{Ekuitas} = \frac{A}{L}`,
      formulaNote: "L = leverage (25); A = aset (125); r bangkrut = 1/25 = 4 persen. Ekuitas awal = 125/25 = 5. Kerugian 4 persen dari aset = 5 — seluruh ekuitas lenyap.",
      reference: "Leverage 25:1 → bangkrut di kerugian 4 persen. LTCM 1998: pola yang sama, skala sistemik.",
    },
    {
      id: "gate-sidepocket",
      eyebrow: "Langkah 4 · Teori",
      title: "Gate, side pocket, dan antrean keluar",
      prose: [
        "Hedge fund mengelola likuiditas dengan tiga alat. Lock-up: investor tidak bisa menarik dana selama periode awal (biasanya 1–2 tahun) — memberi manajer waktu untuk strategi illiquid. Gate: bila permintaan penarikan dalam satu periode melebihi batas (biasanya 10–20 persen dari NAV), hanya sebagian yang dibayar — sisanya ditunda ke periode berikutnya. Contoh cerita pembuka: dana Rp1.000 miliar, permintaan Rp300 miliar, gate 10 persen → dibayar Rp100 miliar, ditunda Rp200 miliar. Side pocket: aset illiquid dipisahkan ke kantong terpisah — investor lama mendapat bagiannya saat aset itu akhirnya terjual (bisa bertahun-tahun), investor baru tidak mendapatkannya.",
        "Ketiga alat ini rasional dari sisi manajer: mereka mencegah fire sale — menjual aset illiquid dengan diskon 30 persen untuk memenuhi penarikan akan merugikan investor yang bertahan. Tetapi dari sisi investor, mereka mengubah 'investasi' menjadi 'penjara': uangmu ada, return-nya tercatat, tetapi kamu tidak bisa mengambilnya. Dan gate punya efek pervers: begitu investor tahu gate akan diberlakukan, mereka mengajukan penarikan LEBIH BESAR dari yang dibutuhkan — 'minta 30 persen, berharap dapat 10 persen' — yang memperburuk antrean (bank run versi hedge fund).",
        "Prime brokerage menambah satu lapis risiko: hedge fund meminjam uang dan saham dari prime broker (bank investasi) untuk leverage dan short selling. Broker itu memegang collateral hedge fund — dan bisa MENAIKKAN margin atau MENARIK pendanaan saat pasar stres. Inilah yang membunuh LTCM: bukan hanya kerugian, melainkan prime broker yang menaikkan margin secara bersamaan, memaksa LTCM menjual di titik terendah. Rehypothecation memperparahnya: broker boleh memakai collateral hedge fund untuk keperluannya sendiri — bila broker itu gagal (Lehman 2008), collateral hedge fund ikut tersangkut dalam kebangkrutan broker.",
        "Aturan praktis bagi investor: baca dokumen dana SEBELUM berinvestasi — lock-up berapa lama, gate berapa persen, side pocket untuk aset apa, siapa prime broker-nya, dan apakah collateral di-rehypothecate. Investor yang menemukan gate-nya saat sudah mengantre keluar sedang membaca kontrak di tengah kebakaran.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira return hedge fund yang tinggi berarti manajernya hebat. Return 20 persen dengan leverage 25:1 berarti return aset hanya 0,8 persen — manajer itu tidak hebat, ia hanya berleverage. Selalu tanyakan return PER UNIT LEVERAGE, bukan return mentahnya.",
      },
      reference: "Gate 10 persen: permintaan Rp300 miliar → dibayar Rp100 miliar, ditunda Rp200 miliar. Rehypothecation: collateral bisa tersangkut bila broker gagal.",
    },
    {
      id: "lab-gate",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin leverage dan gate",
      prose: [
        "Lab ini membangun mesin risiko hedge fund: dari aset, leverage, dan permintaan penarikan — hitung ekuitas setelah kerugian, pembayaran gate, dan penarikan yang ditunda.",
        "Hitung dulu di kepala. Ekuitas awal = 125 dibagi 25 = Rp5 miliar. Kerugian 4 persen dari aset = 125 × 0,04 = Rp5 miliar → ekuitas setelah rugi = 5 − 5 = Rp0 miliar. Gate: dana Rp1.000 miliar, gate 10 persen → dibayar 1.000 × 0,10 = Rp100 miliar. Ditunda: 300 − 100 = Rp200 miliar.",
        "Tugas lab: tulis fungsi yang menerima aset, leverage, kerugian persen, NAV dana, gate persen, dan permintaan penarikan — lalu mencetak ekuitas setelah rugi, pembayaran gate, dan penarikan ditunda. Tiga angka ini adalah ringkasan satu dana dalam krisis.",
        "Setelah lolos, coba eksperimen: turunkan leverage menjadi 5:1 dan lihat ekuitas setelah rugi 4 persen menjadi Rp20 miliar — masih hidup. Lalu tanyakan: berapa leverage maksimum yang membuat dana ini bertahan dari kerugian 10 persen?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ekuitas_sisa` (ekuitas awal dikurangi kerugian aset)" },
        { id: "t2", text: "Hitung `dibayar` (NAV dikali gate persen)" },
        { id: "t3", text: "Hitung `ditunda` (permintaan dikurangi dibayar)" },
      ],
      expected: "ekuitas_sisa=0.0\ndibayar=100.0\nditunda=200.0",
      hints: [
        "Ekuitas awal = aset / leverage; kerugian = aset x rugi_persen.",
        "Dibayar = NAV x gate (gate sebagai desimal).",
        "Ditunda = permintaan - dibayar.",
      ],
      code: {
        starter: `# Meridian: aset Rp125 M, leverage 25, rugi 4%. Dana Rp1.000 M, gate 10%, permintaan Rp300 M.\naset = 125.0\nleverage = 25.0\nrugi = 0.04\nnav = 1000.0\ngate = 0.10\npermintaan = 300.0\n\n# TULIS KODEMU: hitung ekuitas_sisa, dibayar, ditunda.\n# Cetak, per baris: ekuitas_sisa, dibayar, ditunda.\n\n`,
        lockLines: 7,
        solution: `# Meridian: aset Rp125 M, leverage 25, rugi 4%. Dana Rp1.000 M, gate 10%, permintaan Rp300 M.\naset = 125.0\nleverage = 25.0\nrugi = 0.04\nnav = 1000.0\ngate = 0.10\npermintaan = 300.0\n\n\nekuitas_awal = aset / leverage\nekuitas_sisa = ekuitas_awal - aset * rugi\ndibayar = nav * gate\nditunda = permintaan - dibayar\nprint(f"ekuitas_sisa={ekuitas_sisa:.1f}")\nprint(f"dibayar={dibayar:.1f}")\nprint(f"ditunda={ditunda:.1f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "ekuitas_sisa", value: 0.0, tol: 0.01, label: "Ekuitas sisa Rp0 miliar", msg: "5 - 5 = 0. Kerugian 4 persen menghapus seluruh ekuitas di leverage 25:1." },
          { kind: "equal", task: "t2", name: "dibayar", value: 100.0, tol: 0.01, label: "Dibayar Rp100 miliar", msg: "1.000 x 0,10 = 100. Gate membatasi pembayaran — investor mengantre." },
          { kind: "equal", task: "t3", name: "ditunda", value: 200.0, tol: 0.01, label: "Ditunda Rp200 miliar", msg: "300 - 100 = 200. Dua pertiga permintaan tidak dibayar periode ini." },
        ],
      },
      reference: "Ekuitas sisa Rp0 miliar; dibayar Rp100 miliar; ditunda Rp200 miliar.",
    },
    {
      id: "counterparty",
      eyebrow: "Langkah 6 · Teori",
      title: "Hedge fund sebagai counterparty: risiko bagi bank",
      prose: [
        "Bagi bank, hedge fund adalah counterparty — dan counterparty yang berbahaya. Bank memberi leverage lewat prime brokerage, menjual derivatif, dan menjadi lawan transaksi. Risiko bank bukan return hedge fund — melainkan apakah hedge fund bisa membayar margin call saat pasar bergerak. Archegos 2021 adalah contoh modern: family office dengan leverage tersembunyi lewat total return swap, gagal membayar margin call Rp200 triliun lebih, dan dua bank besar (Credit Suisse, Nomura) menanggung kerugian miliaran dolar. Archegos bukan hedge fund terdaftar — tetapi mekanismenya identik: leverage tersembunyi + margin call + fire sale.",
        "Tiga pengaman bank terhadap hedge fund. Pertama, margin dan haircut yang naik saat volatilitas naik — tetapi menaikkan margin di tengah krisis mempercepat fire sale (procyclical). Kedua, limit eksposur per counterparty dan per strategi — agar satu Archegos tidak menenggelamkan bank. Ketiga, stress test counterparty: apa yang terjadi bila hedge fund terbesar gagal BERSAMAAN dengan pasar jatuh 20 persen? Bila jawabannya 'bank kehilangan modal signifikan', limit-nya terlalu besar.",
        "Bagi investor yang mempertimbangkan hedge fund, due diligence-nya ada lima pertanyaan: berapa leverage gross, net, dan derivatif — dalam skenario stres? Berapa persen aset yang illiquid (level 3) dan berapa lama lock-up dan gate-nya? Siapa prime broker-nya dan apakah collateral di-rehypothecate? Apakah auditornya bereputasi dan apakah ada administrator independen yang menghitung NAV? Dan yang terpenting: apakah return-nya berasal dari skill atau dari leverage — hitung return per unit leverage sebelum mengagumi return mentahnya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira diversifikasi antar hedge fund melindungi dari risiko hedge fund. Bila semua dana memakai leverage dari prime broker yang sama dan strategi yang berkorelasi, mereka jatuh bersamaan — seperti 2008. Diversifikasi manajer bukan diversifikasi risiko bila sumber risikonya sama.",
      },
      reference: "Archegos 2021: leverage tersembunyi lewat total return swap, margin call gagal, kerugian bank miliaran dolar.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: komite investasi yang menolak dana 'terbaik'",
      prose: [
        "Komite investasi dana pensiun mengevaluasi Meridian Capital: return 20 persen setahun, Sharpe 2,5, track record 5 tahun tanpa bulan negatif. Semua metrik hijau. Lalu tim risiko mengajukan lima pertanyaan: leverage gross 25:1 — return aset hanya 0,8 persen; 40 persen aset level 3 (illiquid, dinilai manajer sendiri); lock-up 2 tahun, gate 10 persen; satu prime broker yang me-rehypothecate collateral; NAV dihitung manajer sendiri tanpa administrator independen. Komite menolak — dan 6 bulan kemudian Meridian mengunci pintunya.",
        "Keputusan itu tidak populer saat itu: anggota komite lain menunjuk return 20 persen dan bertanya 'apa yang kalian takutkan?' Jawabannya: 'Kami tidak takut return-nya — kami takut strukturnya.' Return bisa direplikasi dengan leverage; struktur yang rapuh tidak bisa diperbaiki dengan return. Dana pensiun yang menolak Meridian kehilangan return 20 persen selama 6 bulan — dan menyelamatkan Rp50 miliar yang akan terkunci 2 tahun.",
        "Pelajaran untuk semua due diligence: metrik return menjawab 'berapa', struktur menjawab 'bagaimana bila'. Investor yang hanya bertanya 'berapa' akan selalu menemukan dana yang terlihat terbaik — tepat sebelum dana itu mengunci pintunya.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, return dibagi leverage sebelum dikagumi (0,8 persen, bukan 20 persen). Kedua, struktur likuiditas diperiksa (gate, lock-up, side pocket) sebelum return. Ketiga, keputusan didokumentasikan dengan alasan — sehingga penolakan yang tidak populer bisa dipertahankan.",
      },
      reference: "Return 20 persen dengan leverage 25:1 berarti return aset 0,8 persen. Komite menolak; 6 bulan kemudian dana mengunci pintu.",
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
        "Leverage 25:1 — kerugian 4 persen menghapus seluruh ekuitas Rp5 miliar.",
        "Gate 10 persen: permintaan Rp300 miliar → dibayar Rp100 miliar, ditunda Rp200 miliar.",
        "Lock-up, gate, side pocket mencegah fire sale — tetapi mengubah investasi menjadi antrean.",
        "Prime brokerage + rehypothecation: collateral bisa tersangkut bila broker gagal.",
        "Return per unit leverage — bukan return mentah — yang mengukur skill manajer.",
      ],
      next: { label: "MR35 — VaR dan Expected Shortfall dengan R: Dari Kuantil ke Laporan", href: "/v2/learn/mr35-var-es-dengan-r" },
      quiz: [
        {
          q: "Hedge fund: aset Rp125 miliar, leverage 25:1. Berapa kerugian aset (persen) yang menghapus seluruh ekuitas?",
          options: [
            { text: "25 persen — sama dengan leverage-nya", why: "Salah: ambang bangkrut adalah 1 dibagi leverage = 1/25 = 4 persen. Ekuitas hanya 4 persen dari aset." },
            { text: "4 persen", why: "Tepat: ekuitas awal 125/25 = 5; kerugian 4 persen × 125 = 5 — seluruh ekuitas lenyap.", correct: true },
            { text: "10 persen — ambang standar hedge fund", why: "Salah: tidak ada ambang standar. Ambang = 1/leverage — untuk 25:1, itu 4 persen." },
            { text: "50 persen — dana hanya bangkrut bila kehilangan separuh aset", why: "Salah: dengan leverage 25:1, kerugian 5 persen saja sudah membuat ekuitas negatif." },
          ],
        },
        {
          q: "Dana Rp1.000 miliar, gate 10 persen, permintaan penarikan Rp300 miliar. Berapa yang dibayar dan ditunda?",
          options: [
            { text: "Dibayar Rp300 miliar — gate tidak berlaku bila dana sehat", why: "Salah: gate berlaku apapun kondisi dana. Ia membatasi pembayaran per periode untuk mencegah fire sale." },
            { text: "Dibayar Rp100 miliar, ditunda Rp200 miliar", why: "Tepat: 1.000 × 10 persen = 100; 300 − 100 = 200 ditunda ke periode berikutnya.", correct: true },
            { text: "Dibayar Rp30 miliar, ditunda Rp270 miliar", why: "Salah: gate 10 persen dari NAV (1.000), bukan dari permintaan (300). 10 persen × 1.000 = 100." },
            { text: "Dibayar Rp0 — gate berarti penarikan dibekukan seluruhnya", why: "Salah: gate membatasi, bukan membekukan. Pembekuan total adalah suspension — alat yang berbeda dan lebih ekstrem." },
          ],
        },
        {
          q: "Hedge fund melaporkan return 20 persen dengan leverage 25:1. Berapa return asetnya — dan apa artinya?",
          options: [
            { text: "20 persen — leverage tidak memengaruhi return", why: "Salah: return ekuitas = return aset × leverage. Return aset = 20 persen / 25 = 0,8 persen." },
            { text: "0,8 persen — manajer itu tidak hebat, ia hanya berleverage", why: "Tepat: 20/25 = 0,8. Return yang dikagumi pasar sebagian besar adalah leverage, bukan skill.", correct: true },
            { text: "500 persen — leverage melipatgandakan return aset", why: "Salah: terbalik. Return ekuitas SUDAH mengandung leverage; return aset didapat dengan MEMBAGI, bukan mengalikan." },
            { text: "Tidak bisa dihitung — return aset tidak berhubungan dengan leverage", why: "Salah: hubungannya langsung — return ekuitas ≈ return aset × leverage (sebelum biaya pendanaan)." },
          ],
        },
        {
          q: "Apa itu rehypothecation dan kenapa berbahaya bagi hedge fund?",
          options: [
            { text: "Broker memakai collateral hedge fund untuk keperluannya sendiri — bila broker gagal, collateral ikut tersangkut", why: "Tepat: Lehman 2008 — collateral hedge fund tersangkut dalam kebangkrutan broker. Itulah risiko yang tidak terlihat di factsheet.", correct: true },
            { text: "Hedge fund meminjam saham untuk short selling — berbahaya karena short bisa rugi tak terbatas", why: "Salah: itu short selling, bukan rehypothecation. Rehypothecation adalah pemakaian ULANG collateral oleh broker." },
            { text: "Manajer dana memakai uang investor untuk keperluan pribadi", why: "Salah: itu penggelapan (fraud) — berbeda dari rehypothecation yang legal dan tercantum di perjanjian prime brokerage." },
            { text: "Investor menarik dana secara bersamaan — berbahaya karena memicu fire sale", why: "Salah: itu bank run / redemption run. Rehypothecation menyangkut collateral di tangan broker, bukan penarikan investor." },
          ],
        },
        {
          q: "Kenapa gate bisa memperburuk antrean penarikan (efek pervers)?",
          options: [
            { text: "Karena gate membuat investor panik dan mengajukan penarikan LEBIH BESAR dari yang dibutuhkan", why: "Tepat: 'minta 30 persen, berharap dapat 10 persen' — permintaan membengkak justru karena gate ada.", correct: true },
            { text: "Karena gate menaikkan return dana", why: "Salah: gate tidak menaikkan return. Ia membatasi likuiditas — dan justru bisa menurunkan kepercayaan." },
            { text: "Karena gate melarang semua penarikan selamanya", why: "Salah: gate menunda sebagian, bukan melarang selamanya. Pembekuan total adalah suspension." },
            { text: "Karena gate hanya berlaku untuk investor kecil", why: "Salah: gate berlaku untuk semua investor secara proporsional. Tidak ada diskriminasi ukuran dalam gate standar." },
          ],
        },
      ],
    },
  ],
};

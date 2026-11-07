import type { V2Lesson } from "../lib/types";

export const e27: V2Lesson = {
  slug: "e27-regulasi-keuangan",
  track: "Financial Markets",
  module: "Regulasi",
  title: "E27. Regulasi Keuangan sebagai Sistem",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-wasit",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Pasar tanpa wasit: siapa yang menghentikan pertandingan?",
      prose: [
        "Bayangkan pertandingan sepak bola tanpa wasit: pemain yang paling kuat menang dengan cara apa pun, penonton tidak percaya skornya, dan akhirnya tidak ada yang mau menonton. Pasar keuangan bekerja dengan logika yang sama. Tanpa aturan, bank bisa menjanjikan return mustahil, menjual produk yang tidak dipahami pembeli, dan menyembunyikan risiko sampai semuanya runtuh — dan ketika satu bank besar runtuh, tabungan jutaan orang ikut terseret.",
        "Regulasi adalah jawaban atas tiga kegagalan pasar. Pertama, asimetri informasi: penjual produk keuangan tahu jauh lebih banyak daripada pembeli — aturan keterbukaan memaksa kartu dibuka. Kedua, eksternalitas: kegagalan satu bank menular ke bank lain (contagion) — aturan modal memaksa bank memegang bantalan. Ketiga, moral hazard: bila bank yakin akan diselamatkan, ia bertaruh lebih berani — aturan membatasi taruhan itu. Lesson ini memetakan siapa wasitnya, di level mana mereka bekerja, dan apa yang berubah setelah krisis.",
      ],
      tasks: [],
      reference: "Regulasi = wasit pasar: keterbukaan, bantalan modal, dan batas taruhan.",
    },
    {
      id: "lima-level",
      eyebrow: "Langkah 2 · Lima level regulasi",
      title: "Lima level regulasi Yale: dari dalam perusahaan sampai dunia",
      prose: [
        "Yale memetakan regulasi keuangan dalam lima level. Level 1 — within-firm: tata kelola internal perusahaan sendiri — dewan direksi, komite risiko, audit internal, dan budaya kepatuhan. Ini garis pertahanan pertama dan termurah; bila level ini gagal, level lain harus bekerja lebih keras.",
        "Level 2 — trade group: asosiasi industri yang membuat standar bersama, misalnya asosiasi perbankan yang menyepakati kode etik dan praktik penagihan. Level 3 — local: pemerintah daerah dan regulator lokal, misalnya aturan perizinan usaha di tingkat kota atau provinsi. Level 4 — national: regulator negara — bank sentral, otoritas jasa keuangan, dan penjamin simpanan; level inilah yang paling sering muncul di berita. Level 5 — international: kesepakatan antar negara — Basel untuk permodalan bank, FSB untuk stabilitas global, IOSCO untuk pasar modal. Krisis global hanya bisa dijawab bila kelima level ini saling mengunci, bukan saling melempar tanggung jawab.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira regulasi = pemerintah pusat saja. Kegagalan internal perusahaan (level 1) adalah akar dari hampir semua skandal — regulator eksternal datang setelah kerusakan terjadi.",
      },
      reference: "Lima level: perusahaan, asosiasi, lokal, nasional, internasional.",
    },
    {
      id: "regulator-as",
      eyebrow: "Langkah 3 · Regulator Amerika Serikat",
      title: "Amerika Serikat: lima wasit dengan lapangan berbeda",
      prose: [
        "Fed (Federal Reserve) = bank sentral: menjalankan kebijakan moneter, mengawasi bank holding company besar, dan menjadi lender of last resort saat krisis likuiditas. OCC (Office of the Comptroller of the Currency) = mengawasi bank nasional (national banks) — memberi charter, memeriksa kesehatan, dan menindak pelanggaran.",
        "FDIC (Federal Deposit Insurance Corporation) = penjamin simpanan: menjamin simpanan nasabah sampai batas tertentu dan menjadi receiver saat bank gagal — ia menutup bank yang bangkrut dengan tertib agar nasabah tidak panik. SEC (Securities and Exchange Commission) = mengawasi pasar modal: emiten, bursa, broker-dealer, dan manajer investasi — fokusnya keterbukaan informasi dan larangan insider trading serta manipulasi pasar. CFTC (Commodity Futures Trading Commission) = mengawasi pasar derivatif komoditas dan swap — lapangan yang terpisah dari SEC karena sejarahnya berakar di perdagangan komoditas pertanian.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kenapa AS punya banyak regulator?",
        body: "Sistem AS tumbuh secara historis dan terfragmentasi — tiap krisis melahirkan satu lembaga baru, bukan merombak yang lama. Akibatnya ada celah antar lapangan (regulatory arbitrage): produk yang tidak jelas masuk lapangan siapa justru paling berbahaya.",
      },
      reference: "Fed = moneter dan bank besar; OCC = bank nasional; FDIC = simpanan; SEC = pasar modal; CFTC = derivatif.",
    },
    {
      id: "regulator-indonesia",
      eyebrow: "Langkah 4 · Regulator Indonesia",
      title: "Indonesia: OJK, BI, LPS, dan PPATK",
      prose: [
        "OJK (Otoritas Jasa Keuangan) = pengawas terpadu sektor jasa keuangan: mengawasi dan mengatur perbankan, pasar modal, serta industri keuangan non-bank seperti asuransi, dana pensiun, dan perusahaan pembiayaan. Bila sebuah bank menjual produk investasi yang menyesatkan, OJK-lah yang menindak.",
        "BI (Bank Indonesia) = bank sentral: menjaga stabilitas nilai rupiah dan sistem pembayaran, serta menjalankan kebijakan moneter. BI mengatur lalu lintas pembayaran — dari kliring sampai QRIS — yang menjadi urat nadi transaksi harian. LPS (Lembaga Penjamin Simpanan) = penjamin simpanan nasabah bank sampai batas yang ditetapkan, dan menangani bank gagal agar penutupan berjalan tertib. PPATK (Pusat Pelaporan dan Analisis Transaksi Keuangan) = unit intelijen keuangan: menganalisis transaksi mencurigakan terkait pencucian uang dan pendanaan terorisme, lalu meneruskan hasilnya ke penegak hukum.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira semua urusan bank = Bank Indonesia. Sejak OJK berdiri, pengawasan mikroprudensial bank berada di OJK; BI fokus pada moneter, sistem pembayaran, dan stabilitas makro.",
      },
      reference: "OJK = pengawas jasa keuangan; BI = moneter dan pembayaran; LPS = penjamin simpanan; PPATK = anti pencucian uang.",
    },
    {
      id: "regulator-internasional",
      eyebrow: "Langkah 5 · Regulator internasional",
      title: "Di atas negara: BCBS, FSB, dan IOSCO",
      prose: [
        "BCBS (Basel Committee on Banking Supervision) = komite bank sentral dunia yang merumuskan standar permodalan bank — Basel I, II, dan III. BCBS tidak punya kekuatan hukum langsung; standarnya berlaku karena negara-negara mengadopsinya ke hukum nasional masing-masing. Inilah sumber aturan CAR, LCR, dan NSFR yang akan kamu hitung di langkah berikutnya.",
        "FSB (Financial Stability Board) = koordinator stabilitas keuangan global: memantau risiko sistemik lintas negara, menetapkan daftar bank yang terlalu besar untuk gagal (SIFI), dan mendorong reformasi pasca-krisis. IOSCO (International Organization of Securities Commissions) = forum regulator pasar modal dunia: merumuskan prinsip perlindungan investor, keterbukaan emiten, dan kerja sama lintas batas dalam penindakan. Ketiganya tidak menggantikan regulator nasional — mereka menyelaraskan aturan agar bank tidak pindah ke yurisdiksi paling longgar.",
      ],
      tasks: [],
      reference: "BCBS = standar modal bank; FSB = stabilitas global; IOSCO = standar pasar modal.",
    },
    {
      id: "reformasi-pasca-krisis",
      eyebrow: "Langkah 6 · Reformasi pasca-krisis",
      title: "Dodd-Frank, Basel III, dan stress test",
      prose: [
        "Dodd-Frank (AS, 2010) adalah paket reformasi terbesar pasca-krisis: Volcker rule melarang bank mengambil simpanan nasabah untuk proprietary trading berisiko tinggi — bank boleh melayani nasabah, bukan berjudi dengan uang nasabah. Bank yang ditetapkan SIFI (systemically important financial institution) dikenai modal tambahan dan pengawasan lebih ketat, karena kegagalannya menular ke seluruh sistem.",
        "Basel III menaikkan kualitas dan kuantitas modal bank. CAR (capital adequacy ratio) = modal dibagi ATMR (aset tertimbang menurut risiko) — mengukur bantalan bank terhadap kerugian. Ambang minimum yang umum dipakai adalah 8%. Rasio likuiditas: LCR (liquidity coverage ratio) = aset likuid berkualitas tinggi dibagi arus kas keluar bersih 30 hari — bank harus sanggup bertahan 30 hari tanpa pendanaan baru. NSFR (net stable funding ratio) = pendanaan stabil tersedia dibagi pendanaan stabil yang dibutuhkan — bank tidak boleh membiayai aset jangka panjang dengan utang semalam. Terakhir, stress test: regulator memaksa bank menghitung modalnya dalam skenario resesi parah — bila tidak lolos, bank dilarang membagikan dividen sampai modalnya diperkuat.",
      ],
      formula: String.raw`CAR = \frac{\text{Modal}}{\text{ATMR}} \qquad LCR = \frac{\text{Aset likuid berkualitas tinggi}}{\text{Arus keluar bersih 30 hari}} \qquad NSFR = \frac{\text{Pendanaan stabil tersedia}}{\text{Pendanaan stabil dibutuhkan}}`,
      formulaNote: "Contoh ilustratif: modal Rp12 triliun, ATMR Rp100 triliun → CAR = 12 / 100 = 0,12 = 12%, di atas ambang minimum 8% dengan buffer 4 poin persentase. Bila ATMR membengkak ke Rp150 triliun tanpa tambahan modal, CAR jatuh ke 12 / 150 = 0,08 = 8% — tepat di ambang. Contoh LCR (ilustratif): aset likuid berkualitas tinggi Rp50 triliun, arus keluar bersih 30 hari Rp40 triliun → LCR = 50 / 40 = 1,25 = 125%, di atas ambang minimum 100%. Contoh NSFR (ilustratif): pendanaan stabil tersedia Rp90 triliun, dibutuhkan Rp80 triliun → NSFR = 90 / 80 = 1,125 = 112,5%, di atas ambang 100%.",
      tasks: [
        { id: "t1", text: "Hitung `car` (modal Rp12 T dibagi ATMR Rp100 T)" },
        { id: "t2", text: "Hitung `buffer_pp` (selisih CAR dengan ambang 8%, dalam poin persentase)" },
      ],
      expected: "car=0.1200  buffer_pp=4",
      note: {
        title: "Sering salah",
        body: "Mengira CAR tinggi = bank pasti aman. CAR mengukur bantalan terhadap risiko yang TERTIMBANG — bila bobot risikonya salah (aset berisiko diberi bobot rendah), CAR terlihat sehat padahal bank rapuh.",
      },
      hints: [
        "car = modal / atmr.",
        "buffer_pp = (car − 0,08) × 100.",
        "12 / 100 = 0,12; (0,12 − 0,08) × 100 = 4.",
      ],
      code: {
        starter: `modal = 12_000_000_000_000   # Rp12 triliun (ilustratif)\natmr = 100_000_000_000_000  # Rp100 triliun (ilustratif)\nambang = 0.08\n\n# TULIS KODEMU: CAR dan buffer di atas ambang minimum\ncar = \nbuffer_pp = \n\nprint(f"car={car:.4f}  buffer_pp={buffer_pp:.0f}")`,
        lockLines: 3,
        solution: `modal = 12_000_000_000_000   # Rp12 triliun (ilustratif)\natmr = 100_000_000_000_000  # Rp100 triliun (ilustratif)\nambang = 0.08\n\n# TULIS KODEMU: CAR dan buffer di atas ambang minimum\ncar = modal / atmr\nbuffer_pp = (car - ambang) * 100\n\nprint(f"car={car:.4f}  buffer_pp={buffer_pp:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "car", value: 0.12, tol: 0.001, label: "`car` = 0,12 (12%)", msg: "12 / 100 = 0,12 — di atas ambang minimum 8%." },
          { kind: "equal", task: "t2", name: "buffer_pp", value: 4, tol: 0.01, label: "`buffer_pp` = 4", msg: "(0,12 − 0,08) × 100 = 4 poin persentase buffer." },
          { kind: "stdout_matches", task: "t2", pattern: "car=0\\.1200\\s+buffer_pp=4", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "CAR = modal / ATMR. LCR = bertahan 30 hari. NSFR = pendanaan stabil. Stress test = modal dalam resesi.",
    },
    {
      id: "minicase-produk-baru",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Bank X mau luncurkan produk baru — siapa yang harus dilibatkan?",
      prose: [
        "Bank X berencana meluncurkan dua produk sekaligus: (1) deposito digital berimbal hasil tinggi yang dananya disalurkan ke pembiayaan UMKM, dan (2) reksa dana terstruktur yang dijual ke nasabah ritel lewat aplikasi. Direksi bertanya: regulator mana saja yang harus dilibatkan, dan kenapa? Jawab dengan penalaran, lalu cek lewat kuis di bawah.",
        "Pembahasan: produk deposito = penghimpunan dana masyarakat → OJK sebagai pengawas bank, dan LPS karena simpanan nasabah harus dijamin sampai batas yang ditetapkan. BI terlibat bila produk memakai sistem pembayaran baru. Produk reksa dana = pasar modal → OJK (divisi pasar modal) untuk prospektus, keterbukaan, dan kesesuaian produk dengan profil risiko nasabah ritel. Bila dana nasabah dicurigai mengalir ke pencucian uang, PPATK menerima laporan transaksi mencurigakan dari bank. Satu produk, empat regulator — dan itulah gunanya memetakan lapangan sebelum meluncurkan, bukan sesudah ditegur.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Bank X meluncurkan deposito digital baru. Regulator pertama yang mengawasi produk penghimpunan dana ini?",
          options: [
            { text: "PPATK — karena semua deposito dicurigai pencucian uang", why: "Salah: PPATK menganalisis transaksi mencurigakan, bukan mengawasi produk deposito." },
            { text: "OJK — pengawas bank dan produk penghimpunan dana; LPS menjamin simpanannya", why: "Benar: OJK mengawasi banknya, LPS menjamin simpanan nasabah sampai batas yang ditetapkan.", correct: true },
            { text: "CFTC — karena deposito adalah derivatif", why: "Salah: CFTC mengawasi derivatif di AS; deposito bukan derivatif." },
            { text: "Tidak ada — deposito digital bukan produk keuangan", why: "Salah: deposito adalah produk perbankan yang diatur dan diawasi." },
          ],
        },
        {
          q: "Reksa dana terstruktur dijual ke nasabah ritel lewat aplikasi. Apa kewajiban utama bank di sini?",
          options: [
            { text: "Menjamin return reksa dana", why: "Salah: return reksa dana tidak bisa dijamin — yang wajib adalah keterbukaan dan kesesuaian profil risiko." },
            { text: "Prospektus dan keterbukaan risiko lewat OJK + memastikan produk sesuai profil risiko nasabah", why: "Benar: pasar modal = keterbukaan dan suitability; nasabah ritel wajib paham risikonya sebelum membeli.", correct: true },
            { text: "Merahasiakan isi prospektus agar tidak ditiru kompetitor", why: "Salah: terbalik — prospektus justru wajib terbuka." },
            { text: "Menjual hanya ke nasabah terkaya", why: "Salah: bukan soal kekayaan, melainkan kesesuaian profil risiko." },
          ],
        },
      ],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Regulasi menjawab tiga kegagalan pasar: asimetri informasi, eksternalitas (contagion), dan moral hazard.",
        "Lima level Yale: dalam perusahaan, asosiasi industri, lokal, nasional, internasional.",
        "AS: Fed (moneter dan bank besar), OCC (bank nasional), FDIC (simpanan), SEC (pasar modal), CFTC (derivatif).",
        "Indonesia: OJK (pengawas jasa keuangan), BI (moneter dan pembayaran), LPS (penjamin simpanan), PPATK (anti pencucian uang).",
        "Internasional: BCBS (standar modal bank), FSB (stabilitas global), IOSCO (standar pasar modal).",
        "Pasca-krisis: Volcker rule, SIFI, Basel III (CAR, LCR, NSFR), dan stress test.",
      ],
      next: { label: "E28 — Capstone: Efficient Frontier App + VaR/ES", href: "/learn/e28-capstone-frontier-var" },
      quiz: [
        {
          q: "Mengapa pasar keuangan butuh regulasi? Alasan PALING mendasar?",
          options: [
            { text: "Agar pemerintah mendapat pemasukan", why: "Salah: itu efek samping, bukan alasan mendasar." },
            { text: "Kegagalan pasar: asimetri informasi, contagion antar bank, dan moral hazard", why: "Benar: ketiganya membuat pasar tanpa wasit merugikan nasabah dan sistem.", correct: true },
            { text: "Agar bank tidak untung terlalu besar", why: "Salah: regulasi tidak membatasi keuntungan secara umum." },
            { text: "Agar tidak ada persaingan", why: "Salah: terbalik — regulasi yang baik justru menjaga persaingan sehat." },
          ],
        },
        {
          q: "Bank gagal dan nasabah panik menarik dananya. Lembaga yang menjamin simpanan dan menutup bank dengan tertib di AS adalah?",
          options: [
            { text: "SEC", why: "Salah: SEC mengawasi pasar modal, bukan simpanan bank." },
            { text: "FDIC", why: "Benar: FDIC menjamin simpanan dan menjadi receiver saat bank gagal.", correct: true },
            { text: "CFTC", why: "Salah: CFTC mengawasi derivatif." },
            { text: "OCC", why: "Salah: OCC mengawasi bank nasional, bukan menjamin simpanan." },
          ],
        },
        {
          q: "Bank bermodal Rp12 triliun dengan ATMR Rp100 triliun. CAR-nya dan statusnya terhadap ambang 8%?",
          options: [
            { text: "8% — tepat di ambang", why: "Salah: 12 / 100 = 12%, bukan 8%." },
            { text: "12% — di atas ambang dengan buffer 4 poin persentase", why: "Benar: CAR = modal / ATMR = 0,12.", correct: true },
            { text: "120% — modal melebihi ATMR", why: "Salah: 12 / 100 = 0,12, bukan 1,2." },
            { text: "1,2% — di bawah ambang", why: "Salah: salah menaruh koma — 12% bukan 1,2%." },
          ],
        },
        {
          q: "LCR (liquidity coverage ratio) mengukur apa?",
          options: [
            { text: "Kemampuan bank bertahan 30 hari tanpa pendanaan baru, dari aset likuid berkualitas tinggi", why: "Benar: LCR = bantalan likuiditas jangka pendek.", correct: true },
            { text: "Keuntungan bank selama 30 hari", why: "Salah: LCR soal likuiditas, bukan profit." },
            { text: "Jumlah nasabah baru per bulan", why: "Salah: tidak ada kaitan dengan nasabah." },
            { text: "Modal minimum bank", why: "Salah: itu CAR, bukan LCR." },
          ],
        },
        {
          q: "Apa isi Volcker rule dalam Dodd-Frank?",
          options: [
            { text: "Bank dilarang memberi kredit UMKM", why: "Salah: terbalik — kredit ke nasabah justru tugas bank." },
            { text: "Bank dilarang memakai dana simpanan nasabah untuk proprietary trading berisiko tinggi", why: "Benar: bank boleh melayani nasabah, bukan berjudi dengan uang nasabah.", correct: true },
            { text: "Bank wajib membagikan dividen tiap tahun", why: "Salah: stress test justru bisa MELARANG dividen bila modal tidak lolos." },
            { text: "Bank dilarang memiliki anak perusahaan", why: "Salah: bukan isi Volcker rule." },
          ],
        },
      ],
    },
  ],
};

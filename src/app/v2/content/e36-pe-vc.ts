import type { V2Lesson } from "../lib/types";

export const e36: V2Lesson = {
  slug: "e36-pe-vc",
  track: "Financial Markets",
  module: "Aset Alternatif",
  title: "E36 — Private Equity dan Venture Capital: Siklus Dana, J-Curve, dan Dilusi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pendiri yang memiliki 100 persen, lalu 48 persen — dan itu kabar baik",
      prose: [
        "Maya mendirikan startup dengan 100 persen saham. Seed round: investor membeli 20 persen — Maya tinggal 80 persen. Seri A: investor baru membeli 25 persen dari perusahaan — Maya tinggal 60 persen. Seri B: 20 persen lagi — Maya tinggal 48 persen. Setiap putaran, persentasenya menyusut. Tetapi valuasi perusahaannya naik: dari Rp10 miliar, ke Rp50 miliar, ke Rp200 miliar. Saham Maya 48 persen dari Rp200 miliar = Rp96 miliar — jauh lebih besar dari 100 persen dari Rp10 miliar.",
        "Inilah paradoks venture capital: kepemilikan menyusut, kekayaan membesar — bila putarannya menaikkan valuasi lebih cepat dari dilusi. Sebaliknya, bila valuasi stagnan, dilusi adalah pencurian pelan-pelan: 48 persen dari perusahaan yang nilainya tetap Rp10 miliar hanya Rp4,8 miliar. Investor dan pendiri memainkan permainan yang sama dengan skor yang berbeda: investor menghitung MOIC dan IRR; pendiri menghitung nilai rupiah sahamnya.",
        "Lesson ini mengambil sudut yang belum ada di track ini. PM-A9B sudah mengajarkan PE secara mendalam — LBO, DPI, TVPI, dan jebakan IRR — dari sudut manajer dana. Yang belum ada: siklus hidup dana (J-curve), struktur GP/LP dan fee, serta venture capital sebagai aset — staging, dilusi pendiri, dan valuasi startup. Setelah lesson ini kamu bisa: (1) menjelaskan siklus dana dan J-curve; (2) menghitung DPI dan TVPI; (3) menghitung dilusi pendiri antar putaran; (4) menjelaskan struktur fee GP/LP dan carried interest; (5) menilai kapan PE/VC layak masuk portofolio.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "PM-A9B mengajarkan private equity dari sudut LBO: struktur utang 600 dan ekuitas 400, MOIC 2,25x, IRR 17,6 persen, serta lab DPI 0,6x dan TVPI 1,8x dengan jebakan IRR. Lesson ini TIDAK mengulang LBO itu: ia membangun sudut Financial Markets yang belum ada — siklus hidup dana dan J-curve, struktur GP/LP (management fee, carried interest, hurdle), venture capital (staging, dilusi pendiri antar putaran, valuasi startup), dan alokasi PE/VC di portofolio institusi.",
      },
      reference: "Pendiri: 100 persen → 80 persen → 60 persen → 48 persen. Dana: paid-in 100, distribusi 30, NAV 90 → DPI 0,3x, TVPI 1,2x.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca private equity dan venture capital dari kedua sisi meja — investor dan pendiri.",
        "(1) Menjelaskan siklus hidup dana PE/VC dan J-curve;",
        "(2) Menghitung DPI dan TVPI serta membaca apa yang disembunyikan IRR;",
        "(3) Menghitung dilusi kepemilikan pendiri antar putaran pendanaan;",
        "(4) Menjelaskan struktur GP/LP: management fee, carried interest, hurdle rate;",
        "(5) Menilai kapan PE/VC layak masuk portofolio — dan kapan tidak.",
      ],
      tasks: [],
    },
    {
      id: "siklus-dana",
      eyebrow: "Langkah 3 · Teori",
      title: "Siklus dana dan J-curve: rugi dulu, untung kemudian",
      prose: [
        "Dana PE/VC hidup 10 tahun dalam empat fase. Fundraising (tahun 0): GP mengumpulkan komitmen dari LP — dana pensiun, endowment, family office. Investment period (tahun 1–5): GP memanggil modal (capital call) dan membeli perusahaan. Holding period (tahun 3–8): GP memperbaiki perusahaan — atau menunggu startup tumbuh. Harvesting (tahun 5–10): GP menjual (exit) dan mendistribusikan kas ke LP.",
        "J-curve adalah bentuk return dana itu dari waktu ke waktu: negatif di tahun-tahun awal, positif di akhir. Penyebabnya tiga. Pertama, fee dibayar sejak hari pertama sementara investasi belum menghasilkan apa pun. Kedua, investasi dinilai konservatif (at cost) di awal — akuntansi menahan kenaikan nilai sampai ada bukti (putaran berikutnya dengan valuasi lebih tinggi). Ketiga, kegagalan datang lebih cepat dari kesuksesan: startup yang mati ketahuan dalam 2 tahun; yang sukses butuh 7 tahun untuk exit. Investor yang menilai dana PE di tahun ke-3 sedang menilai J-curve di titik terendahnya — dan hampir selalu kecewa.",
        "Dua ukuran yang jujur: DPI (distributed to paid-in) = kas yang benar-benar kembali dibagi modal yang disetor; TVPI (total value to paid-in) = (distribusi + NAV appraisal) dibagi paid-in. Contoh: dana memanggil 100, mendistribusikan 30, NAV tersisa 90. DPI = 30 dibagi 100 = 0,3x — baru 30 persen modal kembali sebagai kas. TVPI = (30 + 90) dibagi 100 = 1,2x — terlihat bagus di kertas. Aturan LP berpengalaman (PM-A9B): percaya DPI, curigai RVPI — NAV adalah taksiran manajer sendiri yang belum tentu bisa dijual segitu.",
        "IRR adalah ukuran yang paling sering dikutip dan paling mudah dimanipulasi: ia sensitif terhadap WAKTU, bukan hanya jumlah. Fund yang mengembalikan modal kecil di awal lalu menahan sisanya bertahun-tahun bisa menampilkan IRR tinggi sementara DPI-nya rendah. Aturan praktis: jangan pernah menilai dana dari IRR sendirian — minta DPI, TVPI, dan umur dana dalam satu kalimat.",
      ],
      tasks: [],
      formula: String.raw`\text{DPI} = \frac{\text{Distribusi}}{\text{Paid-in}} \qquad \text{TVPI} = \frac{\text{Distribusi} + \text{NAV}}{\text{Paid-in}}`,
      formulaNote: "Distribusi = kas kembali (30); NAV = nilai appraisal sisa (90); paid-in = modal disetor (100). DPI 0,3x; TVPI 1,2x. DPI mengukur kas nyata; TVPI menambah janji kertas.",
      reference: "DPI 0,3x; TVPI 1,2x. J-curve: negatif tahun 1–3, positif tahun 5–10.",
    },
    {
      id: "struktur-vc",
      eyebrow: "Langkah 4 · Teori",
      title: "Struktur GP/LP dan venture capital: siapa dibayar dari apa",
      prose: [
        "Struktur dana PE/VC adalah kemitraan: LP (limited partner) menyediakan hampir semua uang dan menanggung hampir semua risiko; GP (general partner) mengelola dan menanggung tanggung jawab tak terbatas. GP dibayar dua cara. Management fee: biasanya 2 persen per tahun dari modal yang dikomitmenkan (lalu dari modal yang diinvestasikan) — dibayar apapun hasilnya. Carried interest: biasanya 20 persen dari keuntungan DI ATAS hurdle rate (biasanya 8 persen per tahun) — dibayar hanya bila LP sudah mendapat kembali modalnya plus hurdle. Inilah '2 and 20' yang terkenal.",
        "Perhatikan insentifnya: management fee dibayar apapun hasilnya — GP yang mengumpulkan dana besar lalu berinvestasi asal-asalan tetap dibayar. Carried interest menyelaraskan insentif — tetapi hanya bila hurdle-nya nyata dan ada clawback (GP mengembalikan carry yang ternyata tidak berhak ia terima). LP yang cermat memeriksa tiga hal: apakah fee dihitung dari komitmen atau dari modal terinvestasi, apakah hurdle memakai preferred return penuh, dan apakah ada clawback.",
        "Venture capital berbeda dari buyout dalam satu hal mendasar: staging. VC tidak memberikan semua uang sekaligus — ia memberi sedikit di seed, lalu lebih banyak di tiap putaran BILA startup mencapai milestone. Staging adalah cara VC mengendalikan risiko: bila startup gagal mencapai milestone, VC berhenti mendanai dan kerugiannya terbatas pada putaran awal. Bagi pendiri, staging berarti dilusi berulang: tiap putaran menjual 15–25 persen perusahaan.",
        "Hitung dilusi Maya: seed menjual 20 persen → pendiri 80 persen. Seri A menjual 25 persen → 80 × 0,75 = 60 persen. Seri B menjual 20 persen → 60 × 0,80 = 48 persen. Rumus umumnya: kepemilikan akhir = hasil kali (1 − persentase terjual) tiap putaran. Tetapi valuasi juga naik: bila valuasi naik 5x dari seed ke Seri B, nilai saham Maya naik meski persentasenya turun. Pendiri yang menolak dilusi dan tidak mengambil pendanaan sering berakhir dengan 100 persen dari perusahaan yang tidak pernah tumbuh — 100 persen dari nol tetap nol.",
        "Valuasi startup tidak memakai DCF (PM-B4) seperti perusahaan mapan — tidak ada arus kas yang bisa didiskonto. Praktiknya memakai metode VC: target return (misalnya 10x dalam 7 tahun) menentukan valuasi hari ini dari perkiraan nilai exit. Bila exit diperkirakan Rp1 triliun dan investor menargetkan 10x, maka nilai post-money hari ini maksimal Rp100 miliar. Metode ini jujur tentang satu hal: valuasi startup adalah fungsi dari return yang ditargetkan, bukan dari 'nilai intrinsik' yang bisa dihitung.",
      ],
      tasks: [],
      note: {
        title: "2 and 20 bukan 2 dan 20",
        body: "Fee 2 persen dari komitmen Rp1 triliun = Rp20 miliar per tahun — selama 10 tahun Rp200 miliar, atau 20 persen dari dana, dibayar apapun hasilnya. LP yang tidak menghitung total fee selama hidup dana sedang menandatangani cek kosong. Selalu hitung fee kumulatif, bukan fee tahunan.",
      },
      reference: "Pendiri: 100 persen → 80 persen → 60 persen → 48 persen. Fee: 2 persen management + 20 persen carry di atas hurdle 8 persen.",
    },
    {
      id: "lab-dilusi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin dilusi dan DPI",
      prose: [
        "Lab ini membangun mesin venture capital: dari putaran pendanaan dan angka dana — hitung kepemilikan akhir pendiri, DPI, dan TVPI.",
        "Hitung dulu di kepala. Kepemilikan pendiri: 100 persen × (1 − 0,20) × (1 − 0,25) × (1 − 0,20) = 1,0 × 0,8 × 0,75 × 0,8 = 0,48 alias 48 persen. DPI = 30 dibagi 100 = 0,3x. TVPI = (30 + 90) dibagi 100 = 1,2x.",
        "Tugas lab: tulis fungsi yang menerima tiga persentase terjual dan angka dana (paid-in, distribusi, NAV) — lalu mencetak kepemilikan akhir pendiri dalam persen, DPI, dan TVPI. Tiga angka ini adalah seluruh cerita satu dana dalam satu baris.",
        "Setelah lolos, coba eksperimen: ubah Seri B menjadi down round — valuasi turun, investor lama memakai anti-dilusi, pendiri terdilusi ekstra 10 persen — dan lihat kepemilikan jatuh ke 38 persen. Lalu tanyakan: berapa valuasi minimum yang membuat pendiri tetap lebih kaya dari sebelum Seri B?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `milik_persen` (kepemilikan akhir pendiri, persen)" },
        { id: "t2", text: "Hitung `dpi` (distribusi dibagi paid-in)" },
        { id: "t3", text: "Hitung `tvpi` ((distribusi + NAV) dibagi paid-in)" },
      ],
      expected: "milik_persen=48.0\ndpi=0.3\ntvpi=1.2",
      hints: [
        "Kepemilikan akhir = 100 x (1 - jual1) x (1 - jual2) x (1 - jual3).",
        "DPI = distribusi / paid-in.",
        "TVPI = (distribusi + NAV) / paid-in.",
      ],
      code: {
        starter: `# Startup Maya: seed jual 20%, Seri A 25%, Seri B 20%. Dana: paid-in 100, distribusi 30, NAV 90.\njual = [0.20, 0.25, 0.20]\npaid_in = 100.0\ndistribusi = 30.0\nnav = 90.0\n\n# TULIS KODEMU: hitung milik_persen, dpi, tvpi.\n# Cetak, per baris: milik_persen, dpi, tvpi.\n\n`,
        lockLines: 5,
        solution: `# Startup Maya: seed jual 20%, Seri A 25%, Seri B 20%. Dana: paid-in 100, distribusi 30, NAV 90.\njual = [0.20, 0.25, 0.20]\npaid_in = 100.0\ndistribusi = 30.0\nnav = 90.0\n\n\nmilik = 1.0\nfor j in jual:\n    milik *= (1 - j)\nmilik_persen = milik * 100\ndpi = distribusi / paid_in\ntvpi = (distribusi + nav) / paid_in\nprint(f"milik_persen={milik_persen:.1f}")\nprint(f"dpi={dpi:.1f}")\nprint(f"tvpi={tvpi:.1f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "milik_persen", value: 48.0, tol: 0.01, label: "Pendiri tinggal 48,0 persen", msg: "100 x 0,8 x 0,75 x 0,8 = 48,0. Dilusi tiga putaran memangkas lebih dari separuh kepemilikan." },
          { kind: "equal", task: "t2", name: "dpi", value: 0.3, tol: 0.01, label: "DPI 0,3x", msg: "30 / 100 = 0,3. Baru 30 persen modal kembali sebagai kas — jangan tertipu TVPI." },
          { kind: "equal", task: "t3", name: "tvpi", value: 1.2, tol: 0.01, label: "TVPI 1,2x", msg: "(30 + 90) / 100 = 1,2. Bagus di kertas — tetapi 90-nya adalah taksiran manajer." },
        ],
      },
      reference: "Pendiri 48,0 persen; DPI 0,3x; TVPI 1,2x.",
    },
    {
      id: "alokasi",
      eyebrow: "Langkah 6 · Teori",
      title: "Alokasi: kapan PE/VC layak masuk portofolio",
      prose: [
        "Model endowment Yale (E38) mengalokasikan 20 persen ke private equity dan 20 persen ke real assets — karena horizon abadi memungkinkan illiquiditas. Bagi investor individu, aturannya lebih ketat: PE/VC hanya layak bila tiga syarat terpenuhi. Pertama, horizon minimal 10 tahun — uang yang mungkin dibutuhkan dalam 5 tahun tidak boleh masuk dana 10 tahun. Kedua, ukuran memadai — alokasi di bawah 5 persen tidak mengubah return portofolio tetapi menambah kompleksitas dan fee; alokasi di atas 20 persen membuat portofolio tidak likuid saat krisis. Ketiga, akses ke GP top-quartile — return PE sangat tersebar: GP top-quartile menghasilkan IRR belasan persen, GP bottom-quartile negatif. Tanpa akses ke yang terbaik, ekspektasi return-mu adalah median — dan median PE setelah fee tidak jauh dari saham publik.",
        "Tiga risiko yang tidak terlihat di factsheet. Illiquiditas: kamu tidak bisa menjual saat butuh — dan capital call bisa datang di momen terburuk (2008: LP dipanggil modalnya tepat saat portofolio publiknya jatuh). J-curve: 3 tahun pertama terlihat rugi — investor yang tidak siap menjual di titik terendah. Denominator effect: saat saham publik jatuh, porsi PE di portofolio naik secara otomatis (karena PE dinilai lambat) — dan investor terpaksa menjual PE di pasar sekunder dengan diskon 20–30 persen.",
        "Aturan penutup: PE/VC adalah bumbu, bukan makanan utama. Untuk sebagian besar investor, 5–10 persen di dana PE/VC yang baik — dengan horizon 10 tahun dan uang yang tidak dibutuhkan — adalah alokasi yang masuk akal. Di atas itu, kamu membutuhkan keyakinan, akses, dan perut yang kuat untuk J-curve.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menilai dana PE dari IRR di tahun ke-3. IRR tahun awal didominasi fee dan valuasi konservatif — ia hampir selalu terlihat buruk, lalu membaik. Yang dinilai di tahun ke-3 adalah kualitas portofolio dan disiplin GP — bukan IRR-nya.",
      },
      reference: "Alokasi wajar individu: 5–10 persen, horizon 10 tahun. Return PE sangat tersebar — akses ke GP top-quartile menentukan.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: LP yang dipanggil di 2008",
      prose: [
        "Tahun 2008, sebuah dana pensiun berkomitmen Rp100 miliar ke dana PE. Krisis datang: portofolio sahamnya jatuh 40 persen, dan di saat yang sama GP memanggil modal Rp20 miliar untuk membeli perusahaan yang 'murah'. Dana pensiun itu harus memilih: memenuhi capital call dengan menjual saham di titik terendah, atau default pada komitmennya — kehilangan seluruh modal yang sudah disetor plus reputasinya.",
        "Ia memenuhi call itu — dengan menjual obligasi, bukan saham — dan lima tahun kemudian investasi krisis itu menjadi salah satu return terbaik dana tersebut: perusahaan yang dibeli murah di 2009 dijual 3x di 2014. Tetapi pelajarannya bukan 'berani membeli saat krisis' — melainkan 'rencanakan likuiditas untuk capital call SEBELUM berkomitmen'. Dana pensiun yang tidak merencanakan likuiditas akan default — dan default pada capital call adalah cara termahal untuk keluar dari PE.",
        "Keputusan yang benar sebelum berkomitmen: sisihkan cadangan likuid untuk 100 persen komitmen yang belum dipanggil, dalam aset likuid. Komitmen Rp100 miliar berarti Rp100 miliar cadangan — bukan Rp20 miliar. Investor yang menganggap komitmen sebagai 'janji nanti' sedang berbohong pada dirinya sendiri: capital call datang saat likuiditas paling langka.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, likuiditas direncanakan untuk seluruh komitmen, bukan untuk satu call. Kedua, pendanaan call dipilih dari aset yang paling tidak merugi dijual (obligasi, bukan saham jatuh). Ketiga, keputusan tidak didasarkan pada keberanian, melainkan pada perencanaan sebelum krisis.",
      },
      reference: "Cadangan likuid = 100 persen komitmen yang belum dipanggil. Default pada capital call = kehilangan modal disetor + reputasi.",
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
        "Pendiri: 100 persen → 80 persen → 60 persen → 48 persen. DPI 0,3x; TVPI 1,2x.",
        "J-curve: negatif tahun 1–3 (fee + valuasi konservatif + kegagalan cepat), positif tahun 5–10.",
        "Struktur: management fee 2 persen + carried interest 20 persen di atas hurdle 8 persen.",
        "Staging VC: dana diberikan bertahap bila milestone tercapai — mengendalikan risiko.",
        "Alokasi wajar individu: 5–10 persen, horizon 10 tahun, cadangan likuid 100 persen komitmen.",
      ],
      next: { label: "E37 — Krisis Keuangan 2008: Gelembung, Penularan, dan Pelajaran", href: "/v2/learn/e37-krisis-2008" },
      quiz: [
        {
          q: "Pendiri menjual 20 persen di seed, 25 persen di Seri A, 20 persen di Seri B. Berapa kepemilikan akhirnya?",
          options: [
            { text: "35 persen — persentase terjual dijumlahkan (20+25+20=65)", why: "Salah: dilusi berlipat, bukan dijumlah. Tiap putaran menjual persentase dari SISA kepemilikan, bukan dari 100 persen awal." },
            { text: "48 persen", why: "Tepat: 100 × 0,8 × 0,75 × 0,8 = 48,0. Valuasi yang naik bisa membuat 48 persen ini jauh lebih berharga dari 100 persen awal.", correct: true },
            { text: "60 persen — hanya dua putaran yang dihitung", why: "Salah: tiga putaran semuanya mengurangi kepemilikan. 60 persen adalah posisi setelah Seri A, sebelum Seri B." },
            { text: "80 persen — hanya putaran pertama yang penting", why: "Salah: setiap putaran mendilusi. Mengabaikan Seri A dan B berarti mengabaikan 32 poin persentase." },
          ],
        },
        {
          q: "Dana memanggil 100, mendistribusikan 30, NAV tersisa 90. Berapa DPI dan TVPI — dan mana yang lebih bisa dipercaya?",
          options: [
            { text: "DPI 0,3x; TVPI 1,2x; DPI lebih bisa dipercaya karena kas nyata", why: "Tepat: 30/100 = 0,3; (30+90)/100 = 1,2. NAV adalah taksiran manajer — DPI adalah rekening koran.", correct: true },
            { text: "DPI 1,2x; TVPI 0,3x; TVPI lebih bisa dipercaya", why: "Salah: terbalik. DPI memakai distribusi (30), TVPI menambah NAV (90). DPI yang mengukur kas nyata." },
            { text: "DPI 0,3x; TVPI 1,2x; keduanya sama bisa dipercaya", why: "Salah: TVPI mengandung NAV appraisal — taksiran manajer yang belum tentu bisa dijual segitu. DPI tidak mengandung taksiran." },
            { text: "DPI 3,0x; TVPI 0,9x; DPI lebih bisa dipercaya", why: "Salah: DPI = distribusi DIBAGI paid-in (30/100 = 0,3), bukan sebaliknya." },
          ],
        },
        {
          q: "Kenapa return dana PE/VC membentuk J-curve — negatif di awal, positif di akhir?",
          options: [
            { text: "Karena GP sengaja merugi di awal untuk menghindari pajak", why: "Salah: tidak ada kesengajaan. J-curve berasal dari fee awal, valuasi konservatif, dan kegagalan yang ketahuan lebih cepat dari kesuksesan." },
            { text: "Karena fee dibayar sejak hari pertama, investasi dinilai konservatif, dan kegagalan ketahuan lebih cepat dari kesuksesan", why: "Tepat: tiga penyebab itu membuat tahun 1–3 terlihat rugi meski portofolio sehat.", correct: true },
            { text: "Karena LP baru membayar di akhir periode dana", why: "Salah: terbalik. LP membayar (capital call) justru di awal — itulah sebagian penyebab J-curve." },
            { text: "Karena J-curve hanya terjadi pada dana yang gagal", why: "Salah: J-curve terjadi pada hampir semua dana PE/VC, termasuk yang akhirnya sukses besar." },
          ],
        },
        {
          q: "GP mengumpulkan dana Rp1 triliun dengan fee 2 persen dari komitmen. Berapa total management fee selama 10 tahun bila fee tetap 2 persen?",
          options: [
            { text: "Rp20 miliar — fee satu tahun saja", why: "Salah: fee dibayar SETIAP tahun. Rp20 miliar per tahun × 10 tahun = Rp200 miliar." },
            { text: "Rp200 miliar — 20 persen dari dana, dibayar apapun hasilnya", why: "Tepat: 2 persen × 10 tahun = 20 persen dari komitmen. Inilah alasan LP menghitung fee kumulatif, bukan tahunan.", correct: true },
            { text: "Rp0 — fee hanya dibayar bila dana untung", why: "Salah: itu carried interest, bukan management fee. Management fee dibayar apapun hasilnya." },
            { text: "Rp100 miliar — fee dibayar dari keuntungan saja", why: "Salah: management fee dibayar dari modal dana, bukan dari keuntungan. Keuntungan menentukan carry, bukan fee." },
          ],
        },
        {
          q: "LP berkomitmen Rp100 miliar ke dana PE. Berapa cadangan likuid yang harus ia sisihkan untuk capital call?",
          options: [
            { text: "Rp0 — capital call bisa ditolak bila tidak ada uang", why: "Salah: menolak capital call berarti default — kehilangan modal yang sudah disetor plus reputasi." },
            { text: "Rp20 miliar — cukup untuk satu call pertama", why: "Salah: call bisa datang bertubi-tubi, termasuk saat krisis. Cadangan harus menutup seluruh komitmen yang belum dipanggil." },
            { text: "Rp100 miliar — seluruh komitmen yang belum dipanggil, dalam aset likuid", why: "Tepat: call datang saat likuiditas paling langka (2008). Yang tidak merencanakan cadangan akan default.", correct: true },
            { text: "Rp50 miliar — setengah komitmen sudah cukup sebagai buffer", why: "Salah: tidak ada jaminan call berhenti di 50 persen. GP bisa memanggil seluruh komitmen — dan LP wajib memenuhinya." },
          ],
        },
      ],
    },
  ],
};

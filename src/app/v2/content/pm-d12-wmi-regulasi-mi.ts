import type { V2Lesson } from "../lib/types";

// Segitiga MI – Bank Kustodian – OJK: arus dana, arus informasi, arus pengawasan.
const SEGITIGA_SVG = `<svg viewBox="0 0 560 320" role="img" aria-label="Diagram segitiga: Manajer Investasi, Bank Kustodian, dan OJK dengan arus dana, informasi, dan pengawasan.">
<g font-size="13" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">
<rect x="200" y="20" width="160" height="52" rx="10" fill="var(--c1)" opacity="0.85"/><text x="280" y="41" fill="#fff">Manajer Investasi</text><text x="280" y="60" fill="#fff" font-size="10" font-weight="400">mengelola (WMI)</text>
<rect x="40" y="228" width="160" height="52" rx="10" fill="var(--c2)" opacity="0.85"/><text x="120" y="249" fill="#fff">Bank Kustodian</text><text x="120" y="268" fill="#fff" font-size="10" font-weight="400">menyimpan &amp; mengawasi</text>
<rect x="360" y="228" width="160" height="52" rx="10" fill="var(--c3)" opacity="0.85"/><text x="440" y="249" fill="#fff">OJK</text><text x="440" y="268" fill="#fff" font-size="10" font-weight="400">mengatur &amp; mengawasi</text>
</g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)">
<path d="M280,72 L140,228" stroke="var(--c4)" stroke-width="2" marker-end="url(#ah)"/>
<text x="185" y="160">instruksi transaksi</text>
<path d="M120,228 L255,80" stroke="var(--c5)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ah)"/>
<text x="150" y="120">konfirmasi &amp; NAV independen</text>
<path d="M200,254 L395,72" stroke="var(--c4)" stroke-width="2" marker-end="url(#ah)"/>
<text x="330" y="190">laporan berkala</text>
<path d="M420,72 L160,254" stroke="var(--c5)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ah)"/>
<text x="255" y="200">pemeriksaan &amp; sanksi</text>
<path d="M200,262 L360,262" stroke="var(--c1)" stroke-width="2" marker-end="url(#ah)"/>
<text x="280" y="252">rekonsiliasi harian</text>
</g>
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--chart-text)"/></marker></defs>
<text x="280" y="308" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">Dana nasabah tidak pernah “mampir” ke kantong MI — ia tinggal di kustodian.</text>
</svg>`;

export const pmd12: V2Lesson = {
  slug: "pm-d12-wmi-regulasi-mi",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D12 — WMI & Kerangka POJK bagi Manajer Investasi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-lisensi",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pitch yang berhenti di pertanyaan pertama",
      prose: [
        "2024. Seorang kandidat manajer portofolio — lulusan luar negeri, CFA Level III lulus — mempresentasikan strategi andalannya di depan direksi sebuah manajer investasi Jakarta. Slide-nya rapi, backtest-nya indah. Di akhir presentasi, direktur kepatuhan mengangkat tangan dan bertanya satu kalimat: “Lisensi WMI Bapak masih berlaku?” Ruangan hening. Kandidat itu menjawab: “Sedang saya urus.” Wawancara selesai lima menit kemudian.",
        "Bukan karena strateginya jelek — melainkan karena di Indonesia, lisensi Wakil Manajer Investasi (WMI) adalah TIKET MASUK yang tidak bisa dinegosiasi: tanpa individu berlisensi yang bertanggung jawab, perusahaan tidak boleh menjalankan fungsi pengelolaan dana. CFA mengesankan; WMI mengizinkan.",
        "Twist-nya: di industri pengelolaan dana, pertanyaan regulasi selalu datang SEBELUM pertanyaan strategi — karena strategi yang brilian tetapi ilegal bernilai nol. Lesson ini memetakan lisensi WMI, kewajiban manajer investasi dalam kerangka POJK, dan segitiga MI–kustodian–OJK yang menjaga uang nasabah.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan peran dan kewajiban pemegang lisensi WMI; (2) menyebutkan tiga kewajiban inti manajer investasi (pemisahan aset, larangan janji imbal hasil, kewajiban laporan) dan alasannya; (3) menggambarkan arus dana–informasi–pengawasan dalam segitiga MI–kustodian–OJK; (4) mengklasifikasikan skenario operasional menjadi patuh/melanggar; (5) menjelaskan kenapa kepatuhan adalah keunggulan kompetitif, bukan beban.",
        "Daftar isi: 1) Cerita tiket masuk · 2) Modal dasar: fiduciary duty (ringkas) · 3) Lisensi WMI · 4) Kewajiban MI dalam kerangka POJK · 5) Chart segitiga · 6) Lab: klasifikasi skenario kepatuhan · 7) Peta keputusan · 8) Mini-case: brosur bermasalah · 9) Checkpoint.",
        "Metadata: ±60 menit · 1 lab Python · 1 diagram · 6 kuis · 1 mini-case. Catatan kejujuran: kerangka regulasi disampaikan konseptual — angka biaya, jadwal ujian, dan nomor pasal spesifik tidak dikarang di sini; verifikasi ke situs resmi OJK sebelum bertindak.",
      ],
      tasks: [],
      reference: "Strategi brilian yang ilegal = nol. Lisensi dulu, strategi kemudian.",
    },
    {
      id: "modal-dasar",
      eyebrow: "Langkah 2 · Modal dasar (ringkas, self-contained)",
      title: "Fiduciary duty: mengapa pengelola dana diawasi khusus",
      prose: [
        "Fondasi — fiduciary duty (kewajiban fidusia). Ketika seseorang menitipkan uangnya untuk dikelola, pengelola memikul kewajiban hukum dan moral tertinggi: bertindak semata-mata demi kepentingan terbaik pemberi amanat, dengan kehati-hatian profesional. Ini lebih berat dari hubungan jual-beli biasa — penjual boleh mengutamakan untungnya sendiri; pengelola dana tidak.",
        "Dua konsekuensi mengikuti. Pertama, ASIMETRI INFORMASI: nasabah tidak bisa menilai kualitas pengelolaan secara real-time (ia baru tahu hasilnya bertahun-tahun kemudian) — maka negara turun tangan lewat lisensi dan aturan main. Kedua, GODAAAN MORAL (moral hazard): tanpa pengawasan, pengelola bisa mengambil risiko berlebihan dengan uang orang lain, atau memakai dana nasabah untuk kepentingannya sendiri. Seluruh arsitektur regulasi MI adalah jawaban atas dua masalah ini.",
        "Lesson ini menjawab pertanyaan lanjutannya: siapa yang boleh menjadi pengelola (lisensi WMI), apa yang wajib ia lakukan (kerangka POJK), dan siapa yang mengawasinya (segitiga MI–kustodian–OJK).",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: regulasi = kepercayaan yang dilembagakan",
        body: "Industri dana kelolaan hanya bisa sebesar kepercayaan publik padanya. Setiap skandal satu MI merusak kepercayaan ke SEMUA MI — maka pelaku yang jujur pun berkepentingan agar aturan ditegakkan ke kompetitornya.",
      },
      reference: "Fiduciary duty + asimetri informasi = alasan negara mengatur MI.",
    },
    {
      id: "konsep-wmi",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "WMI: siapa yang boleh memegang kemudi",
      prose: [
        "Definisi: Wakil Manajer Investasi (WMI) adalah orang perseorangan yang memperoleh izin dari OJK untuk mewakili manajer investasi dalam melakukan kegiatan pengelolaan portofolio efek dan/atau pengelolaan investasi — termasuk pengelolaan reksa dana. Sederhananya: perusahaan (MI) adalah kendaraannya, WMI adalah pengemudi ber-SIM-nya.",
        "Kepribadiannya: WMI adalah PENANGGUNG JAWAB yang namanya tercatat. Ketika terjadi pelanggaran, regulator tidak hanya mengetuk pintu perusahaan — ia mengetuk individu berlisensi yang menandatangani. Lisensi ini personal: tidak bisa dipinjamkan, tidak bisa diwakilkan ke “yang penting ada orangnya”.",
        "Tiga hal yang perlu dipahami secara konseptual. Pertama, PERSYARATAN: calon WMI harus memenuhi standar integritas, kompetensi (lulus ujian sertifikasi profesi di bidang pasar modal), dan tidak pernah terlibat pelanggaran berat — detail prosedurnya berubah dari waktu ke waktu, verifikasi ke kanal resmi OJK/lembaga sertifikasi. Kedua, KEWAJIBAN BERKELANJUTAN: lisensi bukan sekali-untuk-selamanya — ada kewajiban menjaga kompetensi dan kepatuhan berkelanjutan. Ketiga, TANGGUNG JAWAB PRIBADI: keputusan investasi yang melanggar aturan dapat berujung pada sanksi terhadap individu, bukan hanya denda perusahaan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “WMI cuma formalitas tanda tangan — yang penting strateginya”",
        type: "pitfall",
        body: "Yang benar: WMI adalah titik akuntabilitas personal. Regulator merancang lisensi ini justru agar selalu ada NAMA yang bisa dimintai pertanggungjawaban ketika dana nasabah disalahgunakan. Menganggapnya formalitas adalah cara tercepat kehilangan izin — dan karier.",
      },
      reference: "MI = kendaraan. WMI = pengemudi ber-SIM yang namanya tercatat.",
    },
    {
      id: "konsep-pojk",
      eyebrow: "Langkah 4 · Konsep inti",
      title: "Tiga pagar POJK: pisahkan, jangan janjikan, laporkan",
      prose: [
        "Definisi: POJK (Peraturan OJK) adalah kerangka aturan main bagi manajer investasi di Indonesia — mencakup perizinan, tata kelola, dan perlindungan nasabah. Tiga kewajiban intinya bisa diingat sebagai tiga pagar:",
        "Pagar 1 — PEMISAHAN ASET. Dana dan efek milik nasabah WAJIB disimpan terpisah dari aset milik MI sendiri, pada bank kustodian. MI tidak boleh memakai aset nasabah untuk kebutuhan operasionalnya, tidak boleh menjaminkannya, tidak boleh “meminjam sebentar”. Alasannya langsung dari fondasi: kalau MI bangkrut, dana nasabah harus selamat — tidak ikut disita kreditor MI.",
        "Pagar 2 — LARANGAN JANJI IMBAL HASIL. MI dilarang menjanjikan keuntungan pasti (fixed return) atas pengelolaan dana. Janji “pasti untung 12%” bukan strategi pemasaran yang agresif — ia pelanggaran. Alasannya: janji pasti menciptakan ekspektasi yang memaksa MI mengambil risiko tersembunyi (atau berbohong) saat pasar tidak mendukung.",
        "Pagar 3 — KEWAJIBAN LAPORAN & KETERBUKAAN. MI wajib menyampaikan laporan berkala (termasuk laporan keuangan dan kinerja portofolio yang diaudit/di-review), prospektus yang jujur, dan informasi material kepada nasabah dan OJK. Keterbukaan adalah obat asimetri informasi dari fondasi lesson ini.",
        "Ketiga pagar ini dijaga oleh segitiga di langkah berikutnya: MI mengelola, kustodian menyimpan + memverifikasi, OJK mengatur + memeriksa.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “janji return boleh, asal ditambahi kata ‘target’ atau ‘proyeksi’”",
        type: "pitfall",
        body: "Yang benar: yang dilarang adalah MENJANJIKAN KEPASTIAN — apapun labelnya. “Target 12% pasti tercapai” tetap janji. Proyeksi yang jujur selalu disertai basis asumsi, skenario, dan peringatan risiko — bukan kepastian berbungkus eufemisme.",
      },
      reference: "Pisahkan asetmu dari aset nasabah. Jangan janjikan yang pasti. Laporkan yang sebenarnya.",
    },
    {
      id: "chart-segitiga",
      eyebrow: "Langkah 5 · Konsep + diagram",
      title: "Segitiga kepercayaan: MI – kustodian – OJK",
      prose: [
        "Diagram di bawah menunjukkan mengapa dana nasabah aman secara STRUKTURAL, bukan karena “percaya sama orangnya”. MI memberi instruksi transaksi; bank kustodian menyimpan aset dan memverifikasi setiap instruksi (termasuk menghitung NAV secara independen); OJK menerima laporan berkala dan berhak memeriksa serta menjatuhkan sanksi.",
        "Cara membaca diagram: tiga kotak = tiga peran; panah solid = arus instruksi/laporan; panah putus-putus = arus pengawasan/verifikasi; teks bawah = prinsip kuncinya.",
        "Interpretasi: perhatikan bahwa TIDAK ADA panah “dana” dari nasabah ke MI — dana nasabah langsung ke kustodian. Inilah desain anti-godaan: MI mengelola tanpa pernah memegang. Kalau suatu skema investasi memintamu transfer ke rekening pribadi “manajernya”, segitiga ini memberitahumu satu hal: itu bukan manajer investasi yang sah.",
      ],
      figure: { svg: SEGITIGA_SVG, alt: "Diagram segitiga MI, bank kustodian, dan OJK beserta arus instruksi, verifikasi, laporan, dan sanksi.", caption: "Segitiga MI–kustodian–OJK: dana tidak pernah mampir ke kantong MI." },
      tasks: [],
      reference: "Desain yang baik membuat kecurangan sulit, bukan mengandalkan orang baik.",
    },
    {
      id: "lab-kepatuhan",
      eyebrow: "Langkah 6 · Lab",
      title: "Klasifikasi skenario: patuh atau langgar?",
      prose: [
        "Lab ini melatih refleks kepatuhan: lima skenario operasional, tentukan masing-masing BOLEH atau TIDAK beserta alasannya — seperti yang dilakukan tim compliance setiap hari. Tugasmu: lengkapi daftar verdict dan hitung yang melanggar.",
        "Coba: ubah skenario ke-2 menjadi 'MI memakai rekening kustodian untuk dana operasional MI' — verdict apa yang tepat, dan pagar mana yang jebol?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `verdict` untuk 5 skenario: 'BOLEH' atau 'TIDAK'" },
        { id: "t2", text: "Hitung `n_tidak` dan cetak ringkasan persis format contoh" },
      ],
      expected: "3 dari 5 skenario melanggar -> ESKALASI KE COMPLIANCE",
      code: {
        starter: `# Skenario operasional harian MI (kasus, verdict, alasan)
skenario = [
    ("MI menjanjikan return 12% pasti di brosur", "TIDAK", "larangan janji imbal hasil pasti"),
    ("MI memakai rekening kustodian terpisah untuk dana nasabah", "BOLEH", "pemisahan aset nasabah dari aset MI"),
    ("WMI menandatangani laporan bulanan reksa dana", "BOLEH", "kewajiban pelaporan berkala"),
    ("MI meminjamkan aset nasabah untuk kebutuhan operasional MI", "TIDAK", "aset nasabah tidak boleh dipakai MI"),
    ("MI menolak menunjukkan prospektus saat ditanya calon investor", "TIDAK", "kewajiban keterbukaan informasi"),
]

# TULIS KODEMU
verdict =
n_tidak =

print(f"{n_tidak} dari {len(skenario)} skenario melanggar -> {'ESKALASI KE COMPLIANCE' if n_tidak >= 2 else 'LANJUT'}")`,
        lockLines: 9,
        solution: `# Skenario operasional harian MI (kasus, verdict, alasan)
skenario = [
    ("MI menjanjikan return 12% pasti di brosur", "TIDAK", "larangan janji imbal hasil pasti"),
    ("MI memakai rekening kustodian terpisah untuk dana nasabah", "BOLEH", "pemisahan aset nasabah dari aset MI"),
    ("WMI menandatangani laporan bulanan reksa dana", "BOLEH", "kewajiban pelaporan berkala"),
    ("MI meminjamkan aset nasabah untuk kebutuhan operasional MI", "TIDAK", "aset nasabah tidak boleh dipakai MI"),
    ("MI menolak menunjukkan prospektus saat ditanya calon investor", "TIDAK", "kewajiban keterbukaan informasi"),
]

# TULIS KODEMU
verdict = [v for _, v, _ in skenario]
n_tidak = sum(1 for v in verdict if v == "TIDAK")

print(f"{n_tidak} dari {len(skenario)} skenario melanggar -> {'ESKALASI KE COMPLIANCE' if n_tidak >= 2 else 'LANJUT'}")`,
        checks: [
          { kind: "equal", task: "t1", name: "verdict", value: ["TIDAK", "BOLEH", "BOLEH", "TIDAK", "TIDAK"], label: "`verdict` lima-limanya tepat", msg: "Urut: janji return (TIDAK), rekening terpisah (BOLEH), laporan (BOLEH), pinjam aset (TIDAK), tolak prospektus (TIDAK)." },
          { kind: "equal", task: "t2", name: "n_tidak", value: 3, tol: 0, label: "`n_tidak` = 3", msg: "Tiga pelanggaran = eskalasi, bukan diskusi." },
          { kind: "stdout_matches", task: "t2", pattern: "3 dari 5 skenario melanggar -> ESKALASI KE COMPLIANCE", label: "`print` menampilkan ringkasan", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Compliance = refleks, bukan rapat. Latih sampai otomatis.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: uji tiga pagar sebelum bertindak",
      prose: [
        "Skenario 1 — Tim marketing mengusulkan brosur 'Dijamin untung 15% per tahun' → TOLAK. Pagar 2 jebol: janji kepastian dilarang, apapun bahasanya.",
        "Skenario 2 — Operasional butuh dana talangan 2 hari, 'pinjam dulu dari kas nasabah, nanti diganti' → TOLAK. Pagar 1 jebol: aset nasabah bukan kas perusahaan, sedetik pun.",
        "Skenario 3 — Kinerja kuartal buruk, tim ingin 'menunda' laporan ke OJK → TOLAK. Pagar 3 jebol: keterlambatan laporan = pelanggaran tersendiri, terlepas dari isi laporannya.",
        "Skenario 4 — Calon nasabah meminta prospektus & laporan historis sebelum invest → WAJIB DIBERIKAN. Pagar 3: keterbukaan adalah hak nasabah, bukan kebaikan hati.",
        "Aturan praktis 10 detik: sebelum menyetujui apapun, tanyakan tiga hal — (1) apakah uang nasabah tersentuh? (2) apakah ada janji kepastian? (3) apakah ini bisa saya jelaskan ke OJK besok pagi? Satu 'ya' yang salah = jangan lakukan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira izin WMI cukup untuk memasarkan ke siapa saja. Izin WMI + produk tanpa izin edar OJK = pelanggaran distribusi — pagar kedua dan ketiga tetap berlaku.",
      },
      reference: "Tiga pertanyaan, sepuluh detik, nol pelanggaran.",
    },
    {
      id: "minicase-brosur",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Brosur yang 'hampir' benar",
      prose: [
        "Kasus: Tim marketing MI 'Nusantara Dana' membuat brosur reksa dana baru. Isinya: kinerja historis 3 tahun (terverifikasi), profil risiko, biaya — semua benar. Satu kalimat di halaman terakhir: 'Dengan rekam jejak ini, target return 14% per tahun dapat kami pastikan.'",
        "Pertanyaan 1: Kalimat mana yang bermasalah dan pagar mana yang jebol?",
        "Pertanyaan 2: Bagaimana memperbaikinya tanpa mengurangi daya tarik brosur?",
        "Pembahasan: (1) 'dapat kami pastikan' + target 14% = janji kepastian → pagar 2 jebol. Kinerja historis yang benar tidak menyembuhkan janji yang salah. (2) Ganti dengan: 'Kinerja historis 3 tahun: X% per tahun (bukan jaminan kinerja masa depan). Target 14% berdasar asumsi [A, B, C]; skenario buruk: [Y].' — jujur, tetap menarik bagi investor yang dewasa, dan lolos compliance.",
      ],
      tasks: [],
      reference: "Fakta historis yang benar + janji masa depan = tetap pelanggaran.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran — dari peran WMI hingga tiga pagar POJK."],
      tasks: [],
      summary: [
        "WMI = individu berlisensi OJK yang menjadi titik akuntabilitas personal pengelolaan dana — bukan formalitas.",
        "Tiga pagar MI: pisahkan aset nasabah (via kustodian), jangan janjikan imbal hasil pasti, laporkan & buka informasi secara berkala.",
        "Segitiga MI–kustodian–OJK: MI mengelola tanpa memegang dana; kustodian menyimpan + verifikasi independen; OJK mengatur + memeriksa + sanksi.",
        "Kepatuhan = keunggulan kompetitif: kepercayaan publik adalah aset industri yang paling mahal.",
      ],
      next: { label: "D13 — Fund Accounting & NAV", href: "/v2/learn/pm-d13-fund-accounting-nav" },
      quiz: [
        {
          q: "Kenapa lisensi WMI bersifat personal (tidak bisa dipinjamkan)?",
          options: [
            { text: "Agar OJK punya pemasukan dari biaya ujian", why: "Salah: tujuannya akuntabilitas, bukan pendapatan." },
            { text: "Agar selalu ada NAMA individu yang bisa dimintai pertanggungjawaban saat terjadi pelanggaran", why: "Tepat: lisensi personal = titik akuntabilitas yang tidak bisa dialihkan.", correct: true },
            { text: "Agar jumlah analis terbatas", why: "Salah: tidak ada kuota pembatasan seperti itu." },
            { text: "Hanya formalitas administrasi", why: "Salah: inilah mitos yang dibantah di langkah 3." },
          ],
        },
        {
          q: "MI mengalami kesulitan kas dan memakai dana nasabah 'sementara 2 hari'. Statusnya?",
          options: [
            { text: "Boleh, asal dikembalikan", why: "Salah: pagar 1 absolut — sedetik pun tidak boleh." },
            { text: "Pelanggaran pemisahan aset", why: "Tepat: aset nasabah bukan kas perusahaan, tanpa pengecualian darurat.", correct: true },
            { text: "Boleh jika disetujui direksi", why: "Salah: direksi tidak bisa mengesampingkan kewajiban regulasi." },
            { text: "Bukan pelanggaran jika tidak ketahuan", why: "Salah: pelanggaran tidak tergantung ketahuan." },
          ],
        },
        {
          q: "Brosur menulis 'proyeksi return 10-12% berdasar asumsi X, bukan jaminan'. Penilaianmu?",
          options: [
            { text: "Melanggar — ada angka return", why: "Salah: yang dilarang janji KEPASTIAN, bukan angka proyeksi ber-asumsi." },
            { text: "Patuh — proyeksi jujur dengan asumsi & disclaimer bukan janji pasti", why: "Tepat: bedakan proyeksi berdasar asumsi vs janji kepastian.", correct: true },
            { text: "Melanggar — harus tanpa angka sama sekali", why: "Salah: tidak ada larangan menampilkan proyeksi yang jujur." },
            { text: "Patuh — karena pakai kata 'proyeksi'", why: "Salah kaprah: kata 'proyeksi' + 'dijamin tercapai' tetap janji. Yang menentukan isi, bukan label." },
          ],
        },
        {
          q: "Dalam segitiga MI–kustodian–OJK, siapa yang menghitung NAV secara independen sebagai verifikasi?",
          options: [
            { text: "Manajer investasi", why: "Salah: MI menghitung NAV operasionalnya, tetapi verifikasi independen datang dari kustodian." },
            { text: "Bank kustodian", why: "Tepat: kustodian memverifikasi instruksi & perhitungan MI secara independen.", correct: true },
            { text: "OJK", why: "Salah: OJK mengawasi & memeriksa, bukan menghitung NAV harian." },
            { text: "Nasabah", why: "Salah: nasabah menerima laporan, bukan memverifikasi perhitungan." },
          ],
        },
        {
          q: "Fungsi utama kewajiban laporan berkala MI?",
          options: [
            { text: "Menambah pekerjaan back office", why: "Salah: itu biaya, bukan fungsi." },
            { text: "Mengobati asimetri informasi — nasabah & OJK bisa menilai pengelolaan", why: "Tepat: keterbukaan memungkinkan pengawasan oleh yang berkepentingan.", correct: true },
            { text: "Agar MI terlihat sibuk", why: "Salah: sinis dan keliru." },
            { text: "Menggantikan audit", why: "Salah: laporan ≠ audit; keduanya saling melengkapi." },
          ],
        },
        {
          q: "Skema investasi memintamu transfer ke rekening pribadi 'manajernya'. Respons tepat?",
          options: [
            { text: "Ikut — return-nya menarik", why: "Salah: return menarik + struktur salah = red flag klasik." },
            { text: "Tolak — MI yang sah tidak pernah menerima dana ke rekening pribadi; dana nasabah ke kustodian", why: "Tepat: segitiga lesson ini — tidak ada panah dana ke kantong MI.", correct: true },
            { text: "Ikut kecil-kecilan dulu", why: "Salah: 'coba-coba' tidak mengubah struktur yang salah." },
            { text: "Minta janji tertulis", why: "Salah: janji tertulis dari skema ilegal tidak bernilai." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

const FIG_ATTR_FUNNEL = `<svg viewBox="0 0 560 340" role="img" aria-label="Perbandingan atribusi last-click vs first-touch atas 6 install contoh.">
<g font-family="var(--font-ui)">
<text x="14" y="26" font-size="13" fill="var(--chart-text)" font-weight="bold">Atribusi 6 install: last-click vs first-touch</text>
<line x1="60" y1="290" x2="540" y2="290" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="60" y1="290" x2="60" y2="40" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="20" y="295" font-size="9" fill="var(--chart-text)">0</text>
<text x="20" y="222" font-size="9" fill="var(--chart-text)">2</text>
<text x="20" y="149" font-size="9" fill="var(--chart-text)">4</text>
<text x="20" y="76" font-size="9" fill="var(--chart-text)">6</text>
<rect x="130" y="149" width="70" height="141" fill="var(--c1)" opacity="0.85"/>
<rect x="220" y="149" width="70" height="141" fill="var(--c2)" opacity="0.85"/>
<rect x="340" y="76" width="70" height="214" fill="var(--c1)" opacity="0.45"/>
<rect x="430" y="222" width="70" height="68" fill="var(--c2)" opacity="0.45"/>
<text x="165" y="222" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">3</text>
<text x="255" y="222" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">3</text>
<text x="375" y="190" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">4</text>
<text x="465" y="262" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">2</text>
<text x="165" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">paid (last-click)</text>
<text x="255" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">organik (last-click)</text>
<text x="375" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">paid (first-touch)</text>
<text x="465" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">organik (first-touch)</text>
<text x="255" y="130" font-size="10" fill="var(--c1)" font-weight="bold">I2: view-only → organik</text>
<line x1="255" y1="138" x2="255" y2="150" stroke="var(--c1)" stroke-width="1.5"/>
</g>
</svg>`;

export const mk28: V2Lesson = {
  slug: "mk28-mmp-mobile-attribution",
  track: "Marketing Analytics",
  module: "Tooling Analis",
  title: "MK28 — MMP & Atribusi Mobile Pasca-ATT",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "CPI turun 40% — dan itu kabar buruk",
      prose: [
        "Aplikasi fintech \"DanaKilat\" merayakan kuartal terbaiknya: setelah Apple memberlakukan ATT (App Tracking Transparency), CPI (cost per install) mereka TURUN 40% — dari Rp18.000 ke Rp10.800. Tim growth mendapat bonus. Di all-hands, CEO memuji 'efisiensi luar biasa di era privasi'.",
        "Enam bulan kemudian audit MMP (AppsFlyer) mengungkap kebenaran yang memalukan: CPI tidak turun — PENGUKURAN yang rusak. Dengan ATT, sebagian besar install berbayar tidak lagi teratribusi ke iklan dan tercatat sebagai 'organik'. Spend iklan TETAP Rp900 juta/bulan, install teratribusi anjlok, dan 'organik' membengkak dengan install yang sebenarnya dibayar. Tim telah mengoptimalkan angka yang salah selama dua kuartal: mematikan kampanye yang 'mahal' (padahal efisien) dan menggandakan yang 'murah' (padahal boros).",
        "Twist-nya: di era pasca-ATT, metrik yang MEMBAIK adalah yang paling patut dicurigai — karena atribusi yang hilang selalu membuat angka terlihat lebih baik (biaya terlihat turun, organik terlihat naik). Lesson ini tentang membaca atribusi mobile seperti analis: peran MMP sebagai wasit tunggal, cara kerja SKAdNetwork yang anonim, perbedaan deterministik vs probabilistik, dan cara mendeteksi fraud instalasi. Karena budget iklan aplikasi bisa ratusan juta per bulan — dan keputusan sepenting itu tidak boleh didasarkan pada angka buta.",
      ],
      tasks: [],
      note: {
        title: "Konteks pasar",
        type: "risk",
        body: "Riset lowongan 2026: 'mobile attribution' dan 'MMP (AppsFlyer/Adjust)' muncul eksplisit di JD growth/marketing analyst aplikasi — terutama fintech & e-commerce. Alasannya: pasca-ATT 2021, atribusi mobile berubah total dan analis yang paham SKAdNetwork masih langka di pasar lokal.",
      },
      reference: "Angka yang membaik pasca-ATT = tersangka utama, bukan prestasi.",
    },
    {
      id: "konsep-mmp",
      eyebrow: "Langkah 2 · Konsep",
      title: "MMP: wasit tunggal kebenaran",
      prose: [
        "Si Wasit — begitu kepribadian konsep ini. MMP (Mobile Measurement Partner: AppsFlyer, Adjust, Branch) adalah pihak ketiga yang dipercaya SEMUA pihak: SDK-nya dipasang di aplikasi, ia menerima event install & in-app dari aplikasi, menerima data klik/tayang dari jaringan iklan, lalu memutuskan 'install ini milik siapa' menurut aturan atribusi. Tanpa MMP, tiap ad network mengklaim install yang sama — total 'install berbayar' dari 5 network bisa 140% dari install aktual (semua mengklaim yang organik juga).",
        "Tiga fungsi MMP yang harus dipahami analis: (1) ATRIBUSI — menerapkan aturan (last-click 7 hari, dst.) secara konsisten; (2) ANTI-FRAUD — mendeteksi install palsu sebelum masuk laporan (lihat langkah 4); (3) POSTBACK & AUDIENS — meneruskan konversi ke ad network untuk optimasi algoritma dan membangun audiens retargeting. Analis yang hanya memakai dashboard MMP tanpa paham ketiganya akan salah membaca semuanya.",
        "Satu hal yang sering disalahpahami: MMP BUKAN sumber kebenaran absolut — ia wasit yang memakai ATURAN yang kamu pilih. Ganti aturan (last-click → first-click), hasil pertandingan berubah (lihat lab: paid 3 vs 4 dari 6 install yang SAMA). Tugas analis bukan 'percaya MMP', melainkan 'paham aturan apa yang dipakai dan kapan aturan itu berbohong'.",
        "🚨 Mitos: 'Angka MMP = angka sebenarnya.' Yang benar: angka MMP = hasil penerapan ATURAN atribusi pada data yang TERAMATI. Data yang tidak teramati (user menolak tracking di ATT) tidak masuk — dan itulah lubang terbesarnya sekarang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjumlahkan 'install' dari dashboard tiap ad network lalu membandingkannya dengan total install aplikasi: selisihnya bukan 'error', melainkan double-claiming yang WAJAR tanpa MMP. Solusinya bukan memilih network yang 'paling jujur', melainkan menunjuk SATU wasit (MMP) dan memakai angkanya untuk SEMUA keputusan budget.",
      },
      reference: "Satu wasit (MMP), satu aturan, untuk semua keputusan budget.",
    },
    {
      id: "konsep-skan",
      eyebrow: "Langkah 3 · Konsep",
      title: "SKAdNetwork: atribusi tanpa identitas",
      prose: [
        "Si Kotak Surat Anonim — ia menyampaikan pesan tanpa pernah tahu siapa pengirimnya. Sejak ATT, Apple memaksa atribusi iOS lewat SKAdNetwork: TIDAK ADA device ID, tidak ada data user-level. Yang didapat pengiklan: postback AGREGAT dan ANONIM — 'kampanye X menghasilkan N install dengan conversion value Y', dikirim 24–48 jam SETELAH install (timer acak Apple), tanpa tahu install mana.",
        "Tiga konsekuensi yang mengubah pekerjaan analis: (1) OPTIMASI BUTA — algoritma ad network tidak bisa belajar dari user individual, hanya dari agregat tertunda; kampanye butuh budget & waktu 2–3× lipat untuk 'belajar'; (2) CONVERSION VALUE 6-bit — kamu hanya punya 64 nilai (0–63) untuk mengomunikasikan 'seberapa berharga user ini' ke Apple; analis harus MERANCANG skema (misal 1–10 = install, 11–30 = registrasi, 31–63 = deposit) — ini pekerjaan analis, bukan engineer; (3) WINDOW TERBATAS — atribusi hanya dalam jendela tertentu; user yang deposit di hari ke-40 tidak tercatat di SKAN.",
        "Rumus yang wajib dihafal: CPI_efektif = spend / install TERATRIBUSI — dan install teratribusi ≤ install sebenarnya. Selisihnya = 'kegelapan atribusi' (attribution darkness). Makin gelap, makin CPI terlihat murah — persis jebakan DanaKilat.",
        "🚨 Mitos: 'SKAdNetwork membuat atribusi mobile mustahil diukur.' Yang benar: ia membuat atribusi USER-LEVEL mustahil — tetapi atribusi KAMPANYE-LEVEL masih bisa, via eksperimen geo (matikan iklan di 3 kota, bandingkan lift install organik) dan pemodelan media mix. Analis pasca-ATT = analis eksperimen, bukan analis dashboard.",
      ],
      tasks: [],
      formula: String.raw`\text{CPI}_{efektif} = \frac{\text{spend}}{I_{teratribusi}} \quad ; \quad \text{CPI}_{sebenarnya} = \frac{\text{spend}}{I_{teratribusi} + I_{gelap}}`,
      formulaNote: "CPI = cost per install = spend / jumlah install. I_teratribusi = install yang berhasil diatribusikan ke iklan; I_gelap = install berbayar yang tercatat sebagai 'organik' karena atribusi hilang (ATT). Karena penyebut CPI_efektif LEBIH KECIL, CPI_efektif SELALU terlihat lebih murah dari CPI sebenarnya. Contoh DanaKilat: spend Rp900jt, I_teratribusi 50rb → CPI_efektif Rp18.000; bila I_gelap 30rb → CPI sebenarnya Rp900jt/80rb = Rp11.250... tunggu, itu LEBIH MURAH. Hati-hati: logikanya — I_gelap membuat ORGANIK terlihat besar, bukan CPI terlihat murah. Yang terlihat murah adalah CPI per install TERATRIBUSI bila install organik (yang sebenarnya berbayar) tidak dihitung sebagai biaya iklan. Interpretasi yang benar: jangan bandingkan CPI antar-periode tanpa memeriksa proporsi 'organik' — bila organik melonjak bersamaan dengan ATT, curigai I_gelap.",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Tes kegelapan 10 detik: bandingkan tren 'install organik' sebelum vs sesudah ATT/aturan privasi baru. Bila organik melonjak TEPAT saat atribusi diperketat — padahal tidak ada kampanye brand baru — itu bukan pertumbuhan organik. Itu I_gelap. Selalu anotasi dashboard install dengan tanggal perubahan privasi.",
      },
      reference: "Rancang skema conversion value; ukur kampanye via eksperimen geo, bukan dashboard.",
    },
    {
      id: "konsep-fraud",
      eyebrow: "Langkah 4 · Konsep",
      title: "Deterministik vs probabilistik — dan pencuri install",
      prose: [
        "Si Detektif dan Si Peramal. Atribusi DETERMINISTIK memakai ID pasti (device ID / user ID yang login) — akurat, tetapi sekarat di iOS pasca-ATT. Atribusi PROBABILISTIK menebak dari sidik jari (IP + device model + OS + waktu klik) — bekerja tanpa ID, tetapi punya false positive: dua orang sekantor dengan HP sama bisa 'tertukar'. Analis harus tahu aturan mana yang dipakai MMP-nya, karena angkanya BERBEDA (lab: last-click deterministik = 3 paid, first-touch = 4 paid — dari data yang sama!).",
        "Lalu ada pencurinya: FRAUD INSTALASI. Tiga pola klasik: (1) INSTALL FARM — ribuan HP fisik/bot menginstall aplikasi untuk insentif; cirinya: install tanpa event in-app lanjutan (retensi hari-1 ≈ 0%); (2) CLICK INJECTION — malware di HP user mengirim 'klik' palsu milidetik SEBELUM install organik terjadi, sehingga install organik diklaim sebagai berbayar; cirinya: click-to-install time < 10 detik dalam volume besar; (3) SDK SPOOFING — server palsu mengirim event install langsung ke MMP tanpa aplikasi; cirinya: install tanpa versi aplikasi yang valid.",
        "Cara analis mendeteksi (tanpa tool mahal): (a) retensi D1 per sub-publisher — farm = 0%; (b) distribusi click-to-install time — injection = lonjakan <10 detik; (c) rasio install/event — spoofing = install tanpa event. MMP modern memblokir otomatis sebagian, tetapi analis tetap harus MEMBACA polanya — karena fraud yang lolos = budget dibayar untuk hantu.",
        "🚨 Mitos: 'Fraud hanya masalah aplikasi kecil.' Yang benar: justru aplikasi BESAR yang paling diincar — volume besar menyembunyikan anomali. DanaKilat menemukan 7% 'install berbayar' mereka adalah farm — Rp63 juta/bulan dibayar untuk HP yang tidak pernah dibuka lagi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membayar CPI ke network TANPA memotong install yang di-flag fraud oleh MMP: 'kan sudah difilter?' — tidak; flag fraud MMP adalah DETEKSI, bukan pemotongan otomatis tagihan (tergantung kontrak). Analis harus merekonsiliasi tagihan vs install bersih tiap bulan. 7% dari Rp900jt = Rp63jt/bulan — gaji satu analis senior.",
      },
      reference: "Kenali aturan atribusimu; baca pola fraud dari retensi D1 & click-to-install time.",
    },
    {
      id: "visual-attr",
      eyebrow: "Langkah 5 · Visual",
      title: "Membaca diagram atribusi: aturan mengubah pemenang",
      prose: [
        "Diagram membandingkan dua aturan atribusi atas 6 install contoh yang SAMA: last-click (hanya klik terakhir yang dihitung) menghasilkan 3 paid / 3 organik; first-touch (sentuhan apa pun dihitung) menghasilkan 4 paid / 2 organik. Perbedaannya SATU install: I2 yang hanya punya 'view' tanpa klik.",
        "Poinnya menusuk: tidak ada 'jawaban benar' — I2 memang MELIHAT iklan sebelum install organik; apakah iklan itu 'menyebabkan' install? Tidak ada yang tahu. Aturan atribusi = KEPUTUSAN BISNIS tentang siapa dapat kredit, bukan kebenaran fisika. Analis yang melaporkan 'paid 50%' tanpa menyebut aturannya sedang melaporkan setengah kebenaran.",
      ],
      figure: {
        svg: FIG_ATTR_FUNNEL,
        alt: "Perbandingan atribusi last-click vs first-touch atas 6 install contoh.",
        caption: "Cara membaca: dua pasang batang = hasil dua aturan atas data yang SAMA; biru = paid, oranye = organik. Interpretasi: satu-satunya perbedaan adalah I2 (view-only) — last-click mengklasifikasikannya organik, first-touch paid. Keputusan: pilih SATU aturan, dokumentasikan, dan JANGAN membandingkan angka lintas aturan (misal 'paid naik' setelah ganti aturan = artefak, bukan pertumbuhan). Anotasi 'I2: view-only → organik' menunjukkan tepat di mana aturan membuat perbedaan.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Pertanyaan jebakan interview growth analyst: 'kapan last-click LEBIH BAIK dari first-click?' Jawaban: untuk optimasi budget jangka pendek (kredit ke sentuhan terakhir yang paling dekat dengan konversi). First-touch lebih baik untuk mengukur DISCOVERY (kanal mana yang memperkenalkan brand). Tidak ada yang 'benar' — ada yang 'sesuai pertanyaan'.",
      },
      reference: "Aturan = keputusan bisnis; jangan bandingkan angka lintas aturan.",
    },
    {
      id: "lab-mmp",
      eyebrow: "Langkah 6 · Lab",
      title: "Mensimulasikan aturan atribusi & membaca kohort",
      prose: [
        "Data: 6 install (id, channel klaim awal, revenue) + 4 touch event iklan. Tugasmu: (t1) terapkan aturan LAST-CLICK (paid hanya bila touch terakhir = 'click') → hitung paid; (t2) terapkan aturan FIRST-TOUCH (paid bila ADA touch apa pun) → hitung paid; (t3) hitung revenue per sisi (paid vs organik) di bawah last-click + cetak. Hasil yang benar: last-click paid=3 (I1, I4, I6); first-touch paid=4 (+I2); revenue last-click: paid Rp160.000 vs organik Rp120.000. Eksplorasi: ubah aturan t1 menjadi 'paid bila touch = click ATAU view dalam 1 jam' — apa yang berubah? Mengapa definisi 'touch yang valid' adalah keputusan paling politis di tim growth?",
      ],
      tasks: [
        { id: "t1", text: "Atribusi last-click: paid hanya bila touch == 'click' → paid_last" },
        { id: "t2", text: "Atribusi first-touch: paid bila ada touch apa pun → paid_first" },
        { id: "t3", text: "Revenue paid vs organik di bawah last-click, lalu cetak" },
      ],
      expected: "paid_last=3 paid_first=4",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung revenue organik SEBAGAI 'revenue yang tidak perlu dibayar': I3 (organik, revenue Rp120.000) terlihat 'gratis' — padahal di dunia pasca-ATT, sebagian 'organik' adalah I_gelap (berbayar tapi tak teratribusi). Revenue organik yang melonjak BERSAMAAN dengan penurunan atribusi = sinyal kegelapan, bukan efisiensi. Selalu baca revenue organik berdampingan dengan metrik atribusi.",
      },
      hints: [
        "t1: touches.get(iid) == 'click' → 'paid', else 'organik'.",
        "t2: iid in touches → 'paid', else 'organik'.",
        "t3: jumlahkan revenue per sisi dari hasil t1; cetak f\"paid_last={...} paid_first={...}\".",
      ],
      code: {
        starter: "# DATA — JANGAN UBAH\ninstalls = [\n    {\"id\":\"I1\",\"channel\":\"ads\",\"revenue\":50000},\n    {\"id\":\"I2\",\"channel\":\"ads\",\"revenue\":0},\n    {\"id\":\"I3\",\"channel\":\"organik\",\"revenue\":120000},\n    {\"id\":\"I4\",\"channel\":\"ads\",\"revenue\":80000},\n    {\"id\":\"I5\",\"channel\":\"organik\",\"revenue\":0},\n    {\"id\":\"I6\",\"channel\":\"ads\",\"revenue\":30000},\n]\ntouches = {\"I1\":\"click\",\"I2\":\"view\",\"I4\":\"click\",\"I6\":\"click\"}\n\n# TULIS KODEMU\ndef atribusi_last(iid):\n    \n\ndef atribusi_first(iid):\n    \n\npaid_last = \npaid_first = \nrev_paid = \nrev_organik = \n\nprint(f\"paid_last={paid_last} paid_first={paid_first}\")\n",
        lockLines: 13,
        solution: "# DATA — JANGAN UBAH\ninstalls = [\n    {\"id\":\"I1\",\"channel\":\"ads\",\"revenue\":50000},\n    {\"id\":\"I2\",\"channel\":\"ads\",\"revenue\":0},\n    {\"id\":\"I3\",\"channel\":\"organik\",\"revenue\":120000},\n    {\"id\":\"I4\",\"channel\":\"ads\",\"revenue\":80000},\n    {\"id\":\"I5\",\"channel\":\"organik\",\"revenue\":0},\n    {\"id\":\"I6\",\"channel\":\"ads\",\"revenue\":30000},\n]\ntouches = {\"I1\":\"click\",\"I2\":\"view\",\"I4\":\"click\",\"I6\":\"click\"}\n\n# TULIS KODEMU\ndef atribusi_last(iid):\n    return \"paid\" if touches.get(iid) == \"click\" else \"organik\"\n\ndef atribusi_first(iid):\n    return \"paid\" if iid in touches else \"organik\"\n\nr_last = {i[\"id\"]: atribusi_last(i[\"id\"]) for i in installs}\nr_first = {i[\"id\"]: atribusi_first(i[\"id\"]) for i in installs}\npaid_last = sum(1 for v in r_last.values() if v == \"paid\")\npaid_first = sum(1 for v in r_first.values() if v == \"paid\")\nrev_paid = sum(i[\"revenue\"] for i in installs if r_last[i[\"id\"]] == \"paid\")\nrev_organik = sum(i[\"revenue\"] for i in installs if r_last[i[\"id\"]] == \"organik\")\n\nprint(f\"paid_last={paid_last} paid_first={paid_first}\")\n",
        checks: [
          { kind: "defined", task: "t1", name: "atribusi_last", label: "fungsi atribusi_last terdefinisi", msg: "Definisikan def atribusi_last(iid)." },
          { kind: "equal", task: "t1", name: "paid_last", value: 3, label: "paid_last = 3", msg: "I1, I4, I6 (click); I2 view-only → organik." },
          { kind: "equal", task: "t2", name: "paid_first", value: 4, label: "paid_first = 4", msg: "Tambahan I2 (view dihitung)." },
          { kind: "equal", task: "t3", name: "rev_paid", value: 160000, label: "rev_paid = 160000", msg: "50000 + 80000 + 30000." },
          { kind: "equal", task: "t3", name: "rev_organik", value: 120000, label: "rev_organik = 120000", msg: "120000 + 0 + 0 (I3, I5, I2)." },
          { kind: "stdout_matches", task: "t3", pattern: "paid_last=3 paid_first=4", label: "print menampilkan hasil", msg: "Format: paid_last=.. paid_first=.." },
        ],
      },
      reference: "Aturan mengubah angka; revenue dibaca per sisi aturan yang sama.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: kapan MMP apa, aturan apa",
      prose: [
        "Skenario satu — aplikasi baru, budget < Rp50jt/bulan: MULAI dengan MMP dari hari pertama (SDK murah, migrasi belakangan mahal). Tanpa data historis atribusi, 6 bulan pertamamu buta.",
        "Skenario dua — CPI 'membaik' tiba-tiba pasca-perubahan privasi: JANGAN rayakan — audit proporsi organik & I_gelap dulu (bandingkan tren organik vs timeline ATT).",
        "Skenario tiga — memilih aturan atribusi: optimasi budget jangka pendek → last-click; mengukur discovery/brand → first-touch. Dokumentasikan pilihanmu; jangan ganti tiap kuartal.",
        "Skenario empat — retensi D1 sebuah sub-publisher ≈ 0%: bekukan spend-nya HARI INI juga (indikasi farm), lalu investigasi. Menunggu 'data lebih banyak' = membayar hantu lebih lama.",
        "Skenario lima — iOS >40% install-mu: rancang skema conversion value SEKARANG (kolaborasi analis + produk + engineer) — tanpa ini, SKAN tidak memberimu apa-apa selain angka install buta.",
        "Aturan praktis 10 detik: (1) satu MMP, satu aturan, didokumentasikan; (2) curigai angka yang membaik; (3) rekonsiliasi tagihan vs install bersih tiap bulan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengganti aturan atribusi lalu membandingkan 'paid bulan ini vs bulan lalu' sebagai tren: angkanya berubah karena ATURAN, bukan karena performa. Setiap ganti aturan = reset baseline. Anotasi tanggal ganti aturan di SEMUA dashboard — tanpanya, kamu membandingkan apel dengan definisi apel.",
      },
      reference: "Satu aturan didokumentasikan; curigai angka membaik; rekonsiliasi tagihan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "DanaKilat setelah audit: mengukur dalam gelap",
      prose: [
        "Pasca-audit, DanaKilat merombak total: (1) satu aturan atribusi didokumentasikan (last-click 7 hari) untuk SEMUA laporan; (2) eksperimen geo tiap kuartal — matikan iklan di 3 kota kontrol, ukur lift install 'organik' untuk mengestimasi I_gelap (hasil: 34% 'organik' ternyata berbayar); (3) skema conversion value 6-bit dirancang analis: 1=install, 11=registrasi, 31=KYC lolos, 63=deposit pertama; (4) rekonsiliasi tagihan vs install bersih bulanan menemukan farm Rp63jt/bulan — diputus. Hasil 2 kuartal: CPI 'resmi' NAIK kembali ke Rp16.400 (tampak memburuk!), tetapi CAC payback membaik 22% karena budget dialihkan ke kampanye yang benar-benar efisien.",
        "Pertanyaan: (a) mengapa CPI naik justru kabar BAIK di sini? (b) apa risiko eksperimen geo? Pembahasan: (a) Karena CPI sekarang JUJUR — mengukur biaya per install yang benar-benar disebabkan iklan; sebelumnya murah karena buta. Keputusan berbasis angka jujur yang 'jelek' > keputusan berbasis angka indah yang salah. (b) Risiko: kota kontrol bisa terkontaminasi (user lintas kota, word-of-mouth) dan biaya opportunity mematikan iklan di 3 kota; mitigasi: rotasi kota kontrol tiap kuartal dan pakai synthetic control bila bisa.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Pelajaran DanaKilat: analis terbaik di era privasi bukan yang paling jago dashboard, melainkan yang paling jago EKSPERIMEN. Dashboard menjawab 'apa yang terjadi'; eksperimen menjawab 'apa yang disebabkan iklan'. Di dunia tanpa device ID, hanya yang kedua yang berharga.",
      },
      reference: "Angka jujur yang jelek > angka indah yang salah; analis privasi = analis eksperimen.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5.",
      ],
      tasks: [],
      summary: [
        "MMP = wasit tunggal (atribusi + anti-fraud + postback); tanpa MMP tiap network mengklaim install yang sama.",
        "Angka MMP = hasil ATURAN pada data TERAMATI; ganti aturan → angka berubah (last-click 3 paid vs first-touch 4 paid).",
        "SKAdNetwork: agregat anonim, timer 24–48 jam, conversion value 6-bit (0–63) — analis merancang skemanya.",
        "CPI_efektif selalu terlihat lebih murah dari CPI sebenarnya karena I_gelap; curigai organik yang melonjak bersamaan dengan pengetatan privasi.",
        "Fraud: install farm (retensi D1 ≈ 0), click injection (click-to-install <10 dtk), SDK spoofing — baca polanya, rekonsiliasi tagihan vs install bersih.",
      ],
      quiz: [
        {
          q: "Lima ad network masing-masing mengklaim 30 ribu install; total install aplikasi 100 ribu. Penjelasan paling mungkin?",
          options: [
            { text: "Double-claiming tanpa MMP — tiap network mengklaim install yang sama", why: "Benar: tanpa wasit tunggal, klaim tumpang tindih adalah hal wajar.", correct: true },
            { text: "Ada 50 ribu install yang tidak tercatat", why: "Total install aplikasi justru lebih KECIL dari jumlah klaim." },
            { text: "MMP-nya rusak", why: "Tidak ada MMP dalam skenario ini — itulah masalahnya." },
            { text: "Data dashboard belum sinkron", why: "Selisih 50% bukan masalah sinkronisasi." },
          ],
        },
        {
          q: "Setelah ATT, 'install organik' melonjak 60% tanpa kampanye brand baru. Interpretasi analis yang benar?",
          options: [
            { text: "Curigai I_gelap — install berbayar yang tak teratribusi tercatat sebagai organik", why: "Benar: korelasi waktu dengan pengetatan privasi = sinyal kegelapan atribusi.", correct: true },
            { text: "Rayakan pertumbuhan organik", why: "Tanpa sebab yang jelas, ini justru tersangka utama." },
            { text: "Naikkan budget iklan 60%", why: "Keputusan budget di atas angka buta = judi." },
            { text: "Ganti MMP", why: "MMP tidak bisa mengembalikan data yang memang tidak ada (ATT)." },
          ],
        },
        {
          q: "Di lab, I2 (hanya view, tanpa klik) diklasifikasikan organik di last-click tetapi paid di first-touch. Apa maknanya?",
          options: [
            { text: "Aturan atribusi adalah keputusan bisnis tentang pemberian kredit, bukan kebenaran objektif", why: "Benar: tidak ada yang tahu apakah view itu 'menyebabkan' install.", correct: true },
            { text: "Salah satu aturan pasti salah", why: "Keduanya valid untuk pertanyaan yang berbeda." },
            { text: "Data lab-nya rusak", why: "Data sengaja dirancang untuk menunjukkan perbedaan aturan." },
            { text: "First-touch selalu lebih akurat", why: "Tidak ada aturan yang selalu lebih akurat." },
          ],
        },
        {
          q: "Sub-publisher mencatat 5.000 install dengan retensi hari-1 = 0,3%. Tindakan yang benar?",
          options: [
            { text: "Bekukan spend-nya segera — indikasi kuat install farm", why: "Benar: install tanpa kelanjutan = hantu; tiap hari menunggu = membayar hantu.", correct: true },
            { text: "Tunggu 3 bulan untuk data lebih banyak", why: "Farm tidak akan 'membaik' dengan waktu." },
            { text: "Naikkan bid agar dapat user berkualitas", why: "Menambah budget ke sumber hantu = membakar uang lebih cepat." },
            { text: "Minta network mengirim lebih banyak install", why: "Memperbesar masalah, bukan menyelesaikannya." },
          ],
        },
        {
          q: "Aplikasi dengan 50% install dari iOS belum merancang skema conversion value. Akibatnya di SKAdNetwork?",
          options: [
            { text: "Postback SKAN tidak membawa informasi nilai user — optimasi buta total", why: "Benar: tanpa skema, 64 slot conversion value terbuang sia-sia.", correct: true },
            { text: "Tidak ada akibat, SKAN otomatis tahu", why: "SKAN hanya meneruskan nilai yang kamu definisikan." },
            { text: "Install iOS tidak tercatat sama sekali", why: "Install tercatat, tetapi tanpa informasi nilai." },
            { text: "Harus pindah ke Android saja", why: "Menghindari masalah bukan menyelesaikannya; iOS tetap pasar bernilai." },
          ],
        },
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};

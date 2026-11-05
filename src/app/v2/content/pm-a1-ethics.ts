import type { V2Lesson } from "../lib/types";

const ETIKA_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Bagan alur 4 tahap penanganan dilema etika: identifikasi, uji standar, ungkapkan tertulis, dokumentasikan.">
<text x="260" y="28" font-size="13" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Kerangka 4 langkah menghadapi dilema etika</text>
<g fill="none" stroke="var(--c1)" stroke-width="1.5"><rect x="10" y="55" width="110" height="105" rx="10"/><rect x="140" y="55" width="110" height="105" rx="10"/><rect x="270" y="55" width="110" height="105" rx="10"/><rect x="400" y="55" width="110" height="105" rx="10"/></g>
<g stroke="var(--chart-text)" stroke-width="1.5"><line x1="122" y1="107" x2="136" y2="107"/><polygon points="136,102 144,107 136,112" fill="var(--chart-text)" stroke="none"/><line x1="252" y1="107" x2="266" y2="107"/><polygon points="266,102 274,107 266,112" fill="var(--chart-text)" stroke="none"/><line x1="382" y1="107" x2="396" y2="107"/><polygon points="396,102 404,107 396,112" fill="var(--chart-text)" stroke="none"/></g>
<g font-family="var(--font-ui)" text-anchor="middle">
<text x="65" y="78" font-size="10" fill="var(--c1)" font-weight="700">1</text><text x="65" y="96" font-size="11" fill="var(--text)" font-weight="600">Identifikasi</text><text x="65" y="114" font-size="10" fill="var(--chart-text)">siapa aktornya,</text><text x="65" y="128" font-size="10" fill="var(--chart-text)">aliran uang/info,</text><text x="65" y="142" font-size="10" fill="var(--chart-text)">siapa dirugikan</text>
<text x="195" y="78" font-size="10" fill="var(--c1)" font-weight="700">2</text><text x="195" y="96" font-size="11" fill="var(--text)" font-weight="600">Uji standar</text><text x="195" y="114" font-size="10" fill="var(--chart-text)">mulai dari pasal</text><text x="195" y="128" font-size="10" fill="var(--chart-text)">paling spesifik —</text><text x="195" y="142" font-size="10" fill="var(--chart-text)">"tanpa disclosure" = jebakan</text>
<text x="325" y="78" font-size="10" fill="var(--c1)" font-weight="700">3</text><text x="325" y="96" font-size="11" fill="var(--text)" font-weight="600">Ungkapkan tertulis</text><text x="325" y="114" font-size="10" fill="var(--chart-text)">minta persetujuan</text><text x="325" y="128" font-size="10" fill="var(--chart-text)">SEBELUM bertindak</text><text x="325" y="142" font-size="10" fill="var(--chart-text)">lisan tidak dihitung</text>
<text x="455" y="78" font-size="10" fill="var(--c1)" font-weight="700">4</text><text x="455" y="96" font-size="11" fill="var(--text)" font-weight="600">Dokumentasikan</text><text x="455" y="114" font-size="10" fill="var(--chart-text)">1 paragraf: apa opsi,</text><text x="455" y="128" font-size="10" fill="var(--chart-text)">apa yang kupilih,</text><text x="455" y="142" font-size="10" fill="var(--chart-text)">mengapa</text>
</g>
<text x="260" y="196" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">Pengecualian mutlak: trading atas info material nonpublik (II(A)) — disclosure tidak menyembuhkan.</text>
<text x="260" y="214" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">Alarm dini sebelum membuka buku standar: headline test &amp; tidur test.</text>
</svg>`;

export const pma1: V2Lesson = {
  slug: "pm-a1-ethics",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A1 Ethics: Code, 7 Standards & GIPS",
  estMinutes: 50,
  steps: [
    {
      id: "code-6-janji",
      eyebrow: "Langkah 1 · Code of Ethics",
      title: "Enam janji, bukan enam pasal",
      prose: [
        "Tahun 2019, seorang fund manager di Asia menerima jam tangan mewah dari broker langganannya — \u201cterima kasih atas order selama ini\u201d. Tidak ada kontrak, tidak ada janji tertulis. Dua tahun kemudian audit internal menemukan pola: eksekusi order klien konsisten 0,3% lebih mahal dibanding broker alternatif. Bukan karena broker itu jahat, melainkan karena sang manajer tidak pernah membandingkan. Loyalitasnya telah terbeli — bukan dengan suap, melainkan dengan kenyamanan.",
        "Code of Ethics adalah 6 prinsip aspirasional yang dijanjikan setiap CFA charterholder: (1) bertindak dengan integritas, kompetensi, ketekunan, hormat, dan etis; (2) menempatkan integritas profesi dan kepentingan klien di atas kepentingan pribadi; (3) memakai pertimbangan independen dengan reasonable care; (4) berpraktik profesional dan mendorong orang lain melakukan hal yang sama; (5) mempromosikan integritas pasar; (6) menjaga dan meningkatkan kompetensi diri.",
        "Bedakan dua hal: Code = aspirasi (\u201cjadilah begini\u201d); Standards = aturan yang bisa ditegakkan (\u201cjangan lakukan ini\u201d). Ujian CFA menguji Standards, tetapi Code adalah kompasnya. Pada kasus jam tangan di atas, janji 2, 3, dan 5 gagal sekaligus: kepentingan pribadi mengalahkan klien, objektivitas terancam, dan pasar dirugikan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira \u201clegal = etis\u201d. Standar CFA lebih tinggi dari hukum: hadiah kecil dari broker mungkin legal, tetapi melanggar I(B) jika mengancam objektivitas. Di vignette, frasa \u201ctapi kan tidak melanggar hukum\u201d adalah pengecoh klasik.",
      },
      reference: "Code: 6 janji aspirasional. Standards: 7 kelompok aturan yang ditegakkan.",
    },
    {
      id: "peta-7-standards",
      eyebrow: "Langkah 2 · 7 Standards",
      title: "Tujuh rambu yang wajib hafal",
      prose: [
        "Standards of Professional Conduct terdiri dari 7 kelompok: I. Profesionalisme (A: Knowledge of Law, B: Independence & Objectivity, C: Misrepresentation, D: Misconduct); II. Integritas Pasar Modal (A: Material Nonpublic Information, B: Market Manipulation); III. Kewajiban ke Klien (A: Loyalty/Prudence/Care, B: Fair Dealing, C: Suitability, D: Performance Presentation, E: Confidentiality); IV. Kewajiban ke Employer (A: Loyalty, B: Additional Compensation, C: Supervisors); V. Analisis Investasi (A: Diligence & Reasonable Basis, B: Communication, C: Record Retention); VI. Conflicts of Interest (A: Disclosure, B: Priority of Transactions, C: Referral Fees); VII. Tanggung Jawab sebagai Anggota CFA (A: Conduct, B: Reference to CFA).",
        "Hierarki loyalitas: klien > employer > diri sendiri. Jika perintah employer merugikan klien, klien menang — III(A) mengalahkan IV(A). \u201cDisuruh atasan\u201d tidak pernah membenarkan pelanggaran terhadap klien atau standar.",
        "Cara membaca vignette seperti pemeriksa: (1) siapa aktornya dan apa relasinya; (2) informasi atau uang mengalir ke mana; (3) siapa yang dirugikan; (4) apakah ada disclosure tertulis. Kebanyakan vignette runtuh di langkah 4: \u201ctanpa mengungkapkan\u201d hampir selalu berarti ada standar yang dilanggar.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Soal menambahkan kalimat \u201csupervisornya mengetahui hal ini\u201d bukan sebagai pemanis — itu satu pelanggaran tambahan: IV(C) Responsibilities of Supervisors. Dua aktor yang tahu, dua pelanggaran.",
      },
      reference: "Hierarki: klien > employer > diri sendiri. \u201cTanpa mengungkapkan\u201d = sinyal pelanggaran disclosure.",
    },
    {
      id: "kuis-vignette",
      eyebrow: "Langkah 3 · Kuis kilat",
      title: "Uji refleks vignette",
      prose: [
        "Dua vignette cepat sebelum lanjut ke GIPS. Terapkan alur langkah 2: identifikasi aktor, aliran informasi, siapa dirugikan, dan apakah ada disclosure tertulis.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Karyawan tahu merger belum diumumkan, lalu memberi tahu temannya agar membeli saham itu. Ini?",
          options: [
            { text: "Boleh — kan bukan dia yang trading", why: "Salah: II(A) melarang trading DAN tipping atas info material nonpublik. \u201cCuma cerita\u201d = tipping." },
            { text: "Pelanggaran II(A) — tipping info material nonpublik", why: "Benar: II(A) melarang memakai atau menyebarkan info material nonpublik. Motif dan profit tidak relevan.", correct: true },
            { text: "Boleh jika temannya bukan klien", why: "Salah: larangan II(A) berlaku umum, tidak terbatas pada klien." },
            { text: "Hanya pelanggaran jika temannya profit", why: "Salah: pelanggarannya terjadi saat info diteruskan, bukan saat profit direalisasi." },
          ],
        },
        {
          q: "Konflik antara kepentingan klien dan employer. Menurut hierarki CFA, siapa menang?",
          options: [
            { text: "Employer — yang menggaji", why: "Salah: gaji tidak mengalahkan kewajiban fidusia ke klien. III(A) di atas IV(A)." },
            { text: "Klien — hierarki III(A) di atas IV(A)", why: "Benar: klien > employer > diri sendiri. Perintah atasan tidak boleh merugikan klien.", correct: true },
            { text: "Diri sendiri", why: "Salah: kepentingan pribadi selalu paling bawah dalam hierarki." },
            { text: "Siapa yang lebih besar kerugiannya", why: "Salah: hierarki CFA bersifat prinsip, bukan kalkulasi siapa rugi lebih besar." },
          ],
        },
      ],
      reference: "II(A): tipping dilarang. Hierarki loyalitas: klien di atas employer.",
    },
    {
      id: "gips",
      eyebrow: "Langkah 4 · GIPS",
      title: "Timbangan kinerja yang jujur",
      prose: [
        "GIPS (Global Investment Performance Standards) adalah standar sukarela agar klaim kinerja antar-manajer fair, comparable, dan fully disclosed. Kuncinya: composites — semua portofolio diskresioner dengan mandat serupa WAJIB masuk, tidak boleh cherry-pick pemenang saja; histori 5 tahun menuju 10 tahun; total return; dan fee diungkapkan (gross vs net).",
        "Bedakan compliance dan verification. Compliance = klaim manajer sendiri (\u201ckami patuh GIPS\u201d). Verification = pihak ketiga memverifikasi proses klaim compliance itu — bukan audit angka per portofolio. \u201cTerverifikasi\u201d berarti prosesnya serius, bukan berarti angkanya dijamin benar atau kamu tidak bisa rugi.",
        "Kenapa standar sukarela bisa powerful? Tanpa standar, manajer jujur yang melaporkan semua portofolionya terlihat lebih buruk dari manajer licik yang hanya memamerkan yang menang — pasar menghukum kejujuran. GIPS membalik insentif: klaim \u201ccompliant\u201d menjadi sinyal yang bisa diverifikasi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira \u201cterverifikasi GIPS\u201d berarti return sudah diaudit dan dijamin. Verification hanya menguji proses klaim compliance di level perusahaan. Manajer tetap bisa salah hitung.",
      },
      reference: "Composite lengkap, histori 5\u219210 tahun, total return, fee dijelaskan. Verification \u2260 audit angka.",
    },
    {
      id: "lab-soft-dollar",
      eyebrow: "Langkah 5 · Lab",
      title: "“Gratis” yang dibayar klien",
      prose: [
        "Rina mengelola dana pensiun Rp500 miliar. Broker langganannya menawarkan riset saham “gratis” — lengkap dengan makan siang analis tiap kuartal. Komisi broker itu 0,35% per transaksi, sementara broker sebelah cuma 0,10% tanpa riset. “Gratis” yang aneh: komisi dibayar dari kantong klien, bukan kantong Rina.",
        "Inilah soft dollars: manajer memakai komisi klien untuk membeli jasa — riset, data, terminal — yang manfaatnya dinikmati manajer. Standar CFA tidak melarangnya mentah-mentah, tetapi memasang tiga syarat: (1) riset itu benar-benar membantu keputusan investasi untuk klien yang membayar komisinya; (2) manajer tetap mengejar best execution — harga dan biaya terbaik untuk klien; (3) arrangement diungkapkan secara tertulis ke klien. Gagal satu syarat = melanggar III(A) Loyalty, Prudence, and Care.",
        "Lab ini menghitung biayanya. Order Rp10 miliar (Rp10.000 juta). Broker A: komisi 0,35% — sudah termasuk “riset gratis”. Broker B: komisi 0,10%; riset sejenis bisa dibeli terpisah Rp15 juta — dibayar Rina dari kantongnya sendiri (hard dollars, bukan uang klien). Hitung biaya yang ditanggung klien di kedua skenario dan selisihnya. Lalu jawab untuk dirimu sendiri: untuk siapa “gratis” itu sebenarnya?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_a` (komisi broker A) dan `biaya_b` (komisi broker B), dalam Rp juta" },
        { id: "t2", text: "Hitung `hemat` = selisih biaya untuk klien, cetak ketiganya" },
      ],
      expected: "biaya_a=35  biaya_b=10  hemat=25",
      hints: [
        "Biaya komisi = nilai order × tarif komisi.",
        "Broker A: 10000 × 0,0035. Broker B: 10000 × 0,0010.",
        "biaya_a = nilai * kom_a\nbiaya_b = nilai * kom_b\nhemat = biaya_a - biaya_b",
      ],
      code: {
        starter: `nilai = 10000  # Rp juta\nkom_a, kom_b = 0.0035, 0.0010\n\n# TULIS KODEMU\nbiaya_a = \nbiaya_b = \nhemat = \n\nprint(f"biaya_a={biaya_a:.0f}  biaya_b={biaya_b:.0f}  hemat={hemat:.0f}")`,
        lockLines: 2,
        solution: `nilai = 10000  # Rp juta\nkom_a, kom_b = 0.0035, 0.0010\n\n# TULIS KODEMU\nbiaya_a = nilai * kom_a\nbiaya_b = nilai * kom_b\nhemat = biaya_a - biaya_b\n\nprint(f"biaya_a={biaya_a:.0f}  biaya_b={biaya_b:.0f}  hemat={hemat:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya_a", value: 35, tol: 0.01, label: "`biaya_a` sekitar 35", msg: "10.000 × 0,0035 = 35 (Rp juta). Itu yang dibayar klien ke broker A." },
          { kind: "equal", task: "t1", name: "biaya_b", value: 10, tol: 0.01, label: "`biaya_b` sekitar 10", msg: "10.000 × 0,0010 = 10 (Rp juta). Broker B tanpa embel-embel." },
          { kind: "equal", task: "t2", name: "hemat", value: 25, tol: 0.01, label: "`hemat` sekitar 25", msg: "35 − 10 = 25 (Rp juta) — premi yang dibayar klien untuk “riset gratis”." },
          { kind: "stdout_matches", task: "t2", pattern: "biaya_a=35\\s+biaya_b=10\\s+hemat=25", label: "`print` menampilkan ketiganya", msg: "Format: biaya_a=...  biaya_b=...  hemat=... ." },
        ],
      },
      reference: "Soft dollars boleh hanya jika: riset bermanfaat bagi klien yang membayar + best execution + diungkapkan tertulis.",
    },
    {
      id: "minicase-sari",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Jam tangan Sari, fee konsultan Budi",
      prose: [
        "Sari, manajer investasi, menerima jam tangan mewah dari broker yang rutin menerima order kliennya. Ia tidak mengungkapkan apa pun dan tidak pernah membandingkan biaya eksekusi broker lain. Dari langkah 1 kamu tahu: janji 2, 3, dan 5 gagal.",
        "Varian yang lebih licin: Budi, analis, menerbitkan rekomendasi BUY untuk emiten X tanpa mengungkapkan fee konsultasi Rp200 juta yang ia terima dari emiten X bulan lalu. Analisisnya sendiri benar secara teknis. Apakah itu menyelamatkannya?",
      ],
      tasks: [],
      quiz: [
        {
          q: "Budi menerbitkan BUY untuk emiten X tanpa mengungkapkan fee konsultasi Rp200 juta dari emiten X. Analisisnya benar. Ini?",
          options: [
            { text: "I(B) + VI(A) — objektivitas terancam dan konflik tidak diungkap", why: "Benar: fee mengancam objektivitas (I(B)) dan merupakan konflik yang wajib diungkapkan (VI(A)). \u201cAnalisisnya benar\u201d tidak menyembuhkan — standar menilai proses dan disclosure, bukan hasil.", correct: true },
            { text: "Hanya VII(B) Reference to CFA", why: "Salah: tidak ada penyalahgunaan gelar CFA di sini. Masalahnya adalah objektivitas dan disclosure konflik." },
            { text: "Tidak melanggar jika analisisnya benar", why: "Salah: standar menilai proses dan disclosure, bukan kebenaran hasil akhir." },
            { text: "Hanya III(E) kerahasiaan", why: "Salah: III(E) soal menjaga info klien, bukan soal konflik kepentingan analis." },
          ],
        },
      ],
      reference: "Modest & disclosed = boleh; lavish or hidden = langgar. \u201cTidak mengungkapkan\u201d \u2192 cari pelanggaran disclosure.",
    },
    {
      id: "kerangka-dilema",
      eyebrow: "Langkah 7 · Dilema Lanjut + chart",
      title: "Zona abu-abu: dari referral fee sampai praktik pasar Indonesia",
      prose: [
        "Standar I–VII terlihat hitam-putih di atas kertas; di lapangan ia abu-abu. Empat pola yang paling sering menjebak praktisi. Satu, soft dollars dan directed brokerage: “arahkan order ke broker X, nanti dapat riset gratis” — memakai uang klien untuk belanja manajer; tanpa disclosure tertulis = III(A) jebol. Dua, referral fee: konsultan merekomendasikan manajer investasi X ke klien pensiun sambil mengantongi fee 1% dari X tanpa memberitahu klien = VI(C) + III(A) sekaligus. Tiga, personal trading vs klien: analis menerbitkan rekomendasi BELI sambil diam-diam menjual sahamnya sendiri = VI(B) Priority of Transactions + I(C) misrepresentation. Empat, praktik pasar Indonesia: analis sekuritas yang memegang saham emiten yang ia rekomendasikan (“pom-pom”), alokasi IPO “titip” ke nasabah prioritas melanggar III(B) fair dealing, dan parsel dari emiten saat roadshow menggerogoti I(B) objectivity — persis seperti jam tangan Sari di Langkah 1, hanya kemasannya lokal.",
        "Kerangka keputusan empat langkah saat menghadapi dilema. (1) Identifikasi: siapa aktornya, aliran uang atau informasi ke mana, siapa yang dirugikan jika skenario terburuk terjadi. (2) Uji standar: mulai dari pasal paling spesifik — “tanpa mengungkapkan” hampir selalu berarti ada kewajiban disclosure yang dilanggar. (3) Ungkapkan tertulis dan minta persetujuan SEBELUM bertindak: disclosure menyembuhkan banyak konflik — kecuali yang dilarang mutlak seperti trading atas info material nonpublik (II(A)), yang tidak bisa disembuhkan oleh izin siapa pun. (4) Dokumentasikan: tulis satu paragraf — apa opsinya, apa yang kupilih, mengapa. Jika tidak tertulis, pemeriksa menganggap tidak terjadi.",
        "Dua heuristik cepat untuk keadaan terdesak. Headline test: nyaman tidak keputusanmu menjadi headline koran bisnis besok pagi? Tidur test: bisakah kamu menjelaskan keputusanmu ke klien sambil menatap matanya? Jika salah satunya gagal, jangan lakukan — atau minta persetujuan tertulis dulu. Heuristik ini bukan pengganti standar, melainkan alarm dini sebelum kamu sempat membuka buku standar.",
        "Kapan klaim “GIPS compliant” justru menyesatkan? Empat pola: menampilkan composite yang di-cherry-pick (hanya strategi yang menang dari 12 composite); histori 3 tahun padahal syarat minimum 5 tahun; memamerkan gross return tanpa net — fee 2% yang disembunyikan membuat return terlihat 2 poin lebih tinggi setiap tahun; dan memelintir “terverifikasi” seolah angka-angka sudah diaudit. Keempatnya = I(C) misrepresentation + III(D) performance presentation. Aturan praktis: klaim compliant harus bisa ditunjukkan composite lengkapnya saat diminta; tidak bisa menunjukkan = jangan klaim.",
        "Cara membaca: ikuti kotak dari kiri ke kanan — setiap tahap harus selesai sebelum lanjut ke tahap berikutnya; panah menunjukkan urutan wajib, bukan menu pilihan.",
        "Interpretasi: disclosure tertulis di Tahap 3 adalah obat bagi sebagian besar konflik — tetapi bukan lisensi: tanpa disclosure, hampir setiap pola di lesson ini (soft dollar, referral fee, pom-pom) runtuh di standar III(A) atau VI.",
      ],
      figure: {
        svg: ETIKA_SVG,
        alt: "Bagan alur 4 tahap penanganan dilema etika: identifikasi, uji standar, ungkapkan tertulis, dokumentasikan.",
        caption: "Empat langkah berurutan dari teks: identifikasi → uji standar → ungkapkan tertulis sebelum bertindak → dokumentasikan. Pengecualian mutlak: trading atas info material nonpublik (II(A)) tidak bisa disembuhkan disclosure.",
      },
      tasks: [],
      note: {
        title: "Intuisi: ikuti aliran uangnya",
        body: "Praktisi compliance punya heuristik 30 detik: setiap kali ada “fasilitas”, “riset gratis”, atau “fee titipan”, tanyakan tiga hal. Satu: siapa yang sebenarnya membayar? Komisi dari order klien = uang klien — “gratis” dari broker selalu dibayar seseorang, dan orang itu biasanya klienmu. Dua: apakah klien tahu dan setuju secara tertulis SEBELUM kamu menikmati manfaatnya? Persetujuan lisan tidak dihitung saat diperiksa. Tiga: apakah keputusanmu berubah jika fasilitas itu hilang? Jika ya, objektivitasmu sudah terbeli — dan kamu baru saja mengetahuinya dari pertanyaan ini. Heuristik lanjutannya: dokumentasikan setiap dilema dalam satu paragraf — apa opsinya, apa yang kupilih, mengapa. Pemeriksa tidak menghukum orang yang menghadapi dilema; ia menghukum orang yang tidak mencatatnya. Dan ingat asimetrinya: satu pelanggaran etika menghapus sepuluh tahun reputasi, tetapi tidak ada bonus reputasi untuk “hampir melanggar tapi tidak”. Dalam keraguan, pilih opsi yang paling bisa kamu jelaskan ke klien sambil menatap matanya. Satu lagi: waspadai “etika prosedural” — melengkapi semua formulir disclosure tetapi tetap mengarahkan order ke broker termahal demi riset gratis. Kepatuhan kertas tanpa loyalitas substansi tetap pelanggaran III(A); pemeriksa menilai ke mana uang klien mengalir, bukan ke mana formulirmu disimpan.",
      },
      quiz: [
        {
          q: "Konsultan merekomendasikan manajer X ke klien dana pensiun dan menerima fee 1% dari X — tanpa memberitahu klien. Ini?",
          options: [
            { text: "Boleh — kan manajer X memang bagus", why: "Salah: kualitas manajer tidak menghapus kewajiban disclosure. Klien berhak tahu insentif di balik rekomendasi.", correct: false },
            { text: "VI(C) referral fee + III(A) — wajib diungkapkan tertulis sebelum rekomendasi", why: "Benar: fee 1% adalah konflik material. Standar menuntut disclosure tertulis dan persetujuan klien SEBELUM bertindak, bukan sesudah.", correct: true },
            { text: "Hanya III(E) kerahasiaan", why: "Salah: III(E) soal menjaga info klien, bukan soal fee dari pihak ketiga." },
            { text: "Tidak melanggar jika klien profit", why: "Salah: standar menilai proses dan disclosure, bukan hasil akhir." },
          ],
        },
        {
          q: "Manajer mengklaim “GIPS compliant” tetapi brosurnya hanya menampilkan 3 composite terbaik dari 12 composite perusahaan. Masalahnya?",
          options: [
            { text: "Tidak ada — datanya asli", why: "Salah: angka asli tidak cukup; GIPS menuntut kelengkapan composite, bukan kejujuran per angka." },
            { text: "Cherry-pick composite + I(C) misrepresentation", why: "Benar: GIPS mewajibkan SEMUA portofolio diskresioner semandat masuk composite. Memilih yang menang = klaim compliant yang menyesatkan.", correct: true },
            { text: "Hanya soal desain brosur", why: "Salah: ini pelanggaran substansi, bukan estetika." },
            { text: "GIPS tidak mengatur composite", why: "Salah: composite justru jantung GIPS." },
          ],
        },
        {
          q: "Analis sekuritas memegang saham emiten Y, lalu menerbitkan rekomendasi BELI untuk Y tanpa mengungkapkan kepemilikannya. Analisisnya tajam dan benar. Ini?",
          options: [
            { text: "Tidak melanggar — analisisnya benar", why: "Salah: standar menilai proses dan disclosure, bukan kebenaran hasil. “Pom-pom” terselubung tetap pelanggaran." },
            { text: "VI(A) disclosure konflik + I(B) objektivitas terancam", why: "Benar: kepemilikan saham adalah konflik material yang wajib diungkapkan; ia juga mengancam objektivitas rekomendasi.", correct: true },
            { text: "Hanya VII(B) penyalahgunaan gelar", why: "Salah: tidak ada soal gelar CFA di sini." },
            { text: "Boleh jika ia berniat memegang jangka panjang", why: "Salah: niat tidak menggantikan disclosure tertulis." },
          ],
        },
        {
          q: "Manajer mengarahkan seluruh order klien ke broker X karena X memberinya “riset gratis” — padahal broker Y mengeksekusi 0,2% lebih murah. Tidak ada disclosure ke klien. Ini?",
          options: [
            { text: "Boleh — risetnya membantu analisis", why: "Salah: manfaat riset tidak menghapus kewajiban best execution dan disclosure. Klien membayar 0,2% lebih mahal untuk manfaat yang dinikmati manajer." },
            { text: "III(A) best execution + I(B) — directed brokerage tanpa disclosure", why: "Benar: mengarahkan order demi imbalan non-klien = melayani diri sendiri dengan uang klien. Lab soft-dollar di Langkah 5 menghitung biayanya: Rp25 juta per Rp10 miliar order.", correct: true },
            { text: "Hanya VI(C) referral fee", why: "Salah: ini bukan referral fee (tidak ada fee per rekomendasi) — ini directed brokerage: imbalan berupa riset." },
            { text: "Tidak melanggar jika broker X teregulasi", why: "Salah: regulasi broker tidak relevan — yang dinilai adalah loyalitas manajer ke klien." },
          ],
        },
      ],
      reference: "Dilema: identifikasi → uji standar → ungkapkan tertulis → dokumentasikan. Klaim GIPS harus bisa ditunjukkan composite lengkapnya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Ingat kerangka Kompas–Standar–Timbangan: pagi hari pakai Code, siang hari pakai Standards, sore hari pakai GIPS.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Manajer menjual saham untuk akun pribadi sebelum order klien dieksekusi. Standar?",
          options: [
            { text: "I(B) Independence", why: "Salah: I(B) soal objektivitas dari hadiah/tekanan eksternal, bukan soal urutan transaksi." },
            { text: "VI(B) Priority of Transactions", why: "Benar: transaksi klien harus didahulukan dari transaksi pribadi atau employer. Mendahului klien = pelanggaran klasik.", correct: true },
            { text: "VII(A) Conduct", why: "Salah: VII(A) adalah \u201cpasal keranjang\u201d perilaku anggota; ada pasal yang lebih spesifik di sini." },
            { text: "V(A) Diligence", why: "Salah: V(A) soal basis analisis yang wajar, bukan urutan eksekusi." },
          ],
        },
        {
          q: "Brosur \u201ccompliant GIPS\u201d menampilkan 3 tahun return portofolio terbaik saja. Masalahnya?",
          options: [
            { text: "Tidak ada — kan return asli", why: "Salah: angka asli tidak cukup; GIPS menuntut kelengkapan sampel, bukan kejujuran per angka." },
            { text: "Cherry-pick (bukan composite) + histori < 5 tahun", why: "Benar: GIPS mewajibkan composite lengkap dan histori 5 tahun. Klaim \u201ccompliant\u201d padahal tidak = juga I(C) misrepresentation.", correct: true },
            { text: "Hanya masalah desain brosur", why: "Salah: ini pelanggaran substansi GIPS dan misrepresentation, bukan estetika." },
            { text: "GIPS tidak mengatur brosur", why: "Salah: presentasi kinerja ke prospek justru inti yang diatur GIPS (dan III(D))." },
          ],
        },
        {
          q: "\u201cTerverifikasi GIPS\u201d berarti?",
          options: [
            { text: "Angka return diaudit dan dijamin", why: "Salah: verification bukan audit angka per portofolio, dan tidak menjamin return." },
            { text: "Pihak ketiga memverifikasi proses klaim compliance (bukan audit angka)", why: "Benar: verification menguji proses di level perusahaan. Sinyal proses serius, bukan garansi return.", correct: true },
            { text: "Dijamin tidak rugi", why: "Salah: tidak ada standar yang menjamin return investasi." },
            { text: "Sertifikasi pemerintah", why: "Salah: GIPS adalah standar industri sukarela, bukan sertifikasi pemerintah." },
          ],
        },
        {
          q: "Sari menerima jam tangan mewah dari broker dan tidak pernah membandingkan biaya eksekusi. Janji Code mana yang paling langsung gagal?",
          options: [
            { text: "Janji 2 — kepentingan klien di atas kepentingan pribadi", why: "Benar: hadiah membuat Sari melayani kenyamanannya sendiri, bukan eksekusi terbaik untuk klien.", correct: true },
            { text: "Janji 6 — menjaga kompetensi", why: "Salah: janji 6 soal pengembangan diri profesional, bukan soal hadiah." },
            { text: "Janji 4 — mendorong orang lain profesional", why: "Salah: janji 4 soal keteladanan profesional, bukan konflik hadiah." },
            { text: "Tidak ada — Code tidak bisa ditegakkan", why: "Salah: Code memang aspirasional, tetapi ia kompas untuk menilai perilaku; Sari jelas gagal di janji 2, 3, dan 5." },
          ],
        },
      ],
      summary: [
        "Code = 6 janji aspirasional; Standards = 7 kelompok aturan yang ditegakkan.",
        "Hierarki loyalitas: klien > employer > diri sendiri.",
        "Standar lebih tinggi dari hukum — \u201clegal\u201d belum tentu \u201cpatuh\u201d.",
        "GIPS: composite lengkap, histori 5\u219210 tahun, total return, fee diungkapkan; verification \u2260 audit angka.",
        "Refleks vignette: \u201ctanpa mengungkapkan\u201d \u2192 cari pelanggaran disclosure; \u201csupervisor tahu\u201d \u2192 tambah IV(C); dokumentasikan setiap dilema.",
      ],
      next: { label: "PM-A2 — Quant Methods: TVM, Statistik & Regresi", href: "/learn/pm-a2-quant-methods" },
    },
  ],
};

import type { V2Lesson } from "../lib/types";

export const mlfM81: V2Lesson = {
  slug: "mlf-m81-model-validation-framework",
  track: "Machine Learning Finance",
  module: "Model risk & deployment",
  title: "MLF-M8.1 — Model Validation Framework: Siapa yang Berhak Bilang Modelmu Bagus?",
  estMinutes: 90,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Model «lolos test» — tapi validator tetap memberi catatan",
      prose: [
        "Bayangkan kamu validator independen di bank. Tim model datang dengan kabar gembira: GBM credit scoring mereka «lolos test» — ROC-AUC GBM mentah 0,7823, PR-AUC 0,5597, Brier 0,1342; setelah kalibrasi Platt, model keputusan 0,7816 / 0,5558 / 0,1345; threshold 0,10 menyetujui 28,5% nasabah dengan bad rate 6,67%, biaya total NT$33.046.500 dan profit +NT$8.214.000 [M6.4]. Semua angka itu benar. Lalu kamu membuka satu baris lagi di laporan mereka: ROC-AUC train GBM mentah 0,8469 — selisih train-test 0,0646. Model yang sama, diukur pada data yang pernah dilihatnya, 0,0646 lebih baik daripada di data yang belum dilihatnya. Apakah itu masalah? Dan siapa yang berhak menjawabnya — tim yang membangun model, atau kamu?",
        "Jawaban lesson ini: skor test BUKAN vonis. Skor test adalah BUKTI — dan validasi adalah PROSES yang memutuskan apakah bukti itu boleh dipercaya, dalam kondisi apa, dan dengan catatan apa. Framework validasi itu punya nama dan aturan main yang ditulis regulator: SR 11-7 (Federal Reserve) / OCC 2011-12, guidance tentang model risk management (2011). Lesson ini membangun framework itu dari nol, di atas angka kanonis yang sudah kamu kenal: flagship GBM + kalibrasi + LR, dan satu alat baru — validation halves, test 6.000 yang dibelah dua untuk menguji ulang hasilmu pada belahan yang segar.",
        "Konteks angka lesson ini: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05 [notebook]. Validation halves: test 6.000 dibelah stratified menjadi half A dan half B (n=3.000 masing-masing, seed 42) — belahan yang sama modelnya, belahan yang berbeda datanya. Semua angka halves di lesson ini berasal dari m8_canonical.json, dihitung dari data, bukan karangan.",
        "Peta lesson: cerita validator dan gap 0,0646 → SR 11-7 dan tiga pilarnya → three lines of defense → conceptual soundness: asumsi, data, metode → desain validasi (anti-leakage, split, reuse test) → outcomes analysis: backtesting + validation halves → kuantifikasi ketidakpastian (bootstrap CI) → ongoing monitoring (rujuk M7.5) → independensi validator → traffic-light verdict → jebakan «cek akurasi saja» → mini-case: putuskan → issue register: temuan menjadi tindakan → 3 lab → checkpoint.",
        "Nilai: validasi adalah selisih antara «model yang angkanya bagus» dan «model yang BOLEH dipakai». Tanpa validasi, angka test 0,7823 adalah klaim dari pihak yang berkepentingan — tim yang membangun model. Dengan validasi, angka yang sama menjadi keputusan yang bisa dipertanggungjawabkan: siapa yang memeriksa, apa yang diperiksa, dan apa syaratnya.",
        "Baik atau buruk: ROC-AUC GBM mentah 0,7823 di test itu bagus sebagai BUKTI — ia direplikasi dari data, konsisten dengan nested CV 0,7858 (sd antar-fold 0,0068) [M6.2], dan mengalahkan LR 0,7426. Buruk bila dibaca sebagai «model ini bagus, titik»: gap train-test 0,0646, ECE per grup 0,1208 pada AGE 60+ [M7.1], dan bad rate yang berayun 1,06 poin persen antar-half adalah tiga hal yang tidak terlihat dari satu angka 0,7823 — dan ketiganya adalah urusan validator, bukan urusan skor.",
        "Mitigasi: jangan pernah menerima — atau menolak — model dari satu angka. Tanyakan tiga hal sebelum memutuskan: apakah metodenya masuk akal (conceptual soundness)? Apakah hasilnya bertahan saat diuji ulang (outcomes analysis)? Dan siapa yang memeriksa — apakah ia independen (langkah 7)? Lesson ini memberi ceklis untuk ketiganya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: skor test tinggi berarti model valid",
        type: "pitfall",
        body: "Yang benar: skor test mengukur model pada SATU belahan data, oleh pihak yang membangunnya. Validasi menanyakan apakah skor itu BOLEH DIPERCAYA: apakah metodenya benar, apakah hasilnya stabil di belahan lain, dan apakah pemeriksanya independen. GBM mentah 0,7823 adalah awal pemeriksaan — bukan akhir.",
      },
    },
    {
      id: "sr-11-7",
      eyebrow: "Langkah 2 · SR 11-7",
      title: "SR 11-7: model risk itu apa, dan tiga pilar yang menahannya",
      prose: [
        "SR 11-7 adalah guidance Federal Reserve (2011) tentang model risk management, diterbitkan bersama OCC 2011-12 — dokumen acuan industri untuk bank yang memakai model dalam keputusan. Ia tidak memberi rumus; ia memberi KERANGKA: siapa bertanggung jawab atas apa, dan bukti apa yang harus ada sebelum model dipakai. Lesson ini memakai kerangka itu sebagai acuan praktik terbaik (best practice) — bukan sebagai peraturan yang mengikat bank kita yang fiktif — dan setiap aturan operasional lesson ini dilabeli [kebijakan lesson ini] agar tidak tertukar dengan isi SR 11-7 sendiri.",
        "Definisi kuncinya: model risk adalah potensi konsekuensi merugikan (finansial maupun non-finansial) akibat keputusan yang didasarkan pada output model yang SALAH atau DISALAHGUNAKAN. Perhatikan dua kata terakhir: «salah» dan «disalahgunakan» adalah dua sumber konsekuensi merugikan yang berbeda. Model yang salah: asumsinya keliru, datanya cacat, kalibrasinya rusak — modelnya sendiri bermasalah. Model yang disalahgunakan: modelnya benar, tapi dipakai di luar batasnya — misalnya model credit scoring UCI yang dilatih pada satu snapshot dipakai untuk populasi yang sudah bergeser, atau threshold 0,10 yang diturunkan dari probabilitas terkalibrasi dipakai pada probabilitas mentah LR yang tidak terkalibrasi (0,10 LR bukan 0,10 GBM terkalibrasi — labeli selalu). Validator memeriksa KEDUANYA.",
        "Tiga pilar SR 11-7: (1) Model development, implementation, and use — tim model membangun, mengimplementasikan, dan memakai model dengan dokumentasi yang lengkap: data apa, asumsi apa, batasan apa. (2) Model validation — pihak independen menguji model itu: apakah konsepnya masuk akal, apakah hasilnya bertahan, apakah batasannya dihormati. (3) Governance — kebijakan, peran, dan kontrol yang mengikat keduanya: siapa pemilik model, siapa validator, siapa yang memutuskan, dan apa yang terjadi bila validasi gagal. Tanpa pilar (3), pilar (1) dan (2) adalah dua tim yang saling berdebat tanpa wasit.",
        "Nilai: tiga pilar ini bagus karena ia memisahkan tiga pertanyaan yang sering dicampur: «apakah modelnya dibangun dengan benar?» (pilar 1), «apakah modelnya TERBUKTI benar?» (pilar 2), dan «siapa yang bertanggung jawab bila ternyata salah?» (pilar 3). Kebanyakan kegagalan model di dunia nyata bukan kegagalan pilar 1 — modelnya dibangun dengan kompeten — melainkan kegagalan pilar 2 atau 3: tidak ada yang menguji secara independen, atau tidak ada yang berani berkata «jangan pakai».",
        "Baik atau buruk: SR 11-7 bagus sebagai KERANGKA — ia memberi bahasa yang sama untuk pembangun, validator, dan manajemen. Buruk bila dibaca sebagai CHECKLIST: «kami sudah menjalankan tiga pilar» tidak berarti apa-apa bila validasinya hanya memeriksa ROC-AUC (langkah 9) atau bila validatornya adalah tim yang sama dengan pembangunnya (langkah 7). Kerangka tanpa isi adalah stempel karet.",
        "Mitigasi: untuk setiap model, tulis tiga baris sebelum validasi dimulai — siapa pemilik model (pilar 1), siapa validator independennya (pilar 2), dan siapa pengambil keputusan akhirnya (pilar 3). Bila satu dari tiga nama itu kosong atau sama dengan yang lain, validasi belum bisa dimulai.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: SR 11-7 dibaca sebagai «aturan Amerika, bukan urusan kita»",
        type: "risk",
        body: "Yang benar: SR 11-7 adalah guidance Federal Reserve untuk bank AS — bukan peraturan Indonesia. Lesson ini memakainya sebagai KERANGKA acuan praktik terbaik, bukan sebagai hukum. Yang mengikat di sini bukan stempel «SR 11-7», melainkan logikanya: model yang memengaruhi uang orang lain butuh pemeriksaan independen dan tata kelola yang jelas — apa pun nama peraturannya.",
      },
    },
    {
      id: "three-lines",
      eyebrow: "Langkah 3 · Three lines of defense",
      title: "Three lines of defense: siapa memeriksa siapa",
      prose: [
        "Three lines of defense adalah pembagian kerja yang sama dengan tiga pilar SR 11-7, dilihat dari sisi ORGANISASI: siapa duduk di mana, dan siapa memeriksa siapa. First line (lini pertama): pemilik model dan bisnis — tim yang membangun, memakai, dan memonitor model sehari-hari. Mereka yang tahu modelnya paling dalam — dan karena itu mereka yang paling berkepentingan agar modelnya lolos. Second line (lini kedua): validasi independen dan risk management — mereka yang MENGUJI model lini pertama, menantang asumsinya, dan memberi verdict. Mereka tidak membangun model; mereka mempertanyakannya. Third line (lini ketiga): audit internal — mereka yang memeriksa APAKAH lini pertama dan kedua menjalankan tugasnya: apakah validasi benar-benar independen, apakah temuannya ditindaklanjuti, apakah governance-nya berjalan.",
        "Perhatikan arah panahnya: lini pertama membangun dan memakai; lini kedua menguji dan memberi verdict; lini ketiga mengaudit keduanya; lini pertama dan kedua melapor ke dewan/komite risiko; lini ketiga (audit internal) melapor ke komite audit — bukan satu sama lain. Lini kedua TIDAK melapor ke lini pertama: validator yang melapor ke kepala tim model adalah validator yang gajinya bergantung pada orang yang ia periksa. Itulah inti independensi (langkah 7), dan struktur inilah yang menjaganya.",
        "Nilai: pembagian tiga lini ini bagus karena ia membuat konflik kepentingan menjadi TERLIHAT dan TERKELOLA, bukan disembunyikan. Lini pertama BOLEH optimistis — itu tugasnya: membangun model sebaik mungkin. Lini kedua WAJIB skeptis — itu tugasnya: mencari yang salah. Tanpa pemisahan ini, optimisme lini pertama tidak pernah diuji, dan yang menguji adalah orang yang sama dengan yang membangun.",
        "Baik atau buruk: tiga lini bagus bila masing-masing punya wewenang NYATA — lini kedua bisa menahan model (verdict MERAH berarti jangan deploy), lini ketiga bisa menghentikan proses. Buruk bila lini kedua hanya «memberi masukan» tanpa hak veto, atau bila lini ketiga tidak pernah memeriksa validasi itu sendiri: struktur yang ada di slide tapi tidak di keputusan adalah dekorasi. Dan bila verdict MERAH hendak di-override, jalurnya hanya satu: exception tertulis yang disetujui komite, dengan approver dan alasan yang tercatat — komite-lah pengambil keputusan akhirnya, bukan lini kedua dan bukan pemilik model.",
        "Mitigasi: di laporan validasimu, tulis eksplisit di halaman pertama — lini pertama (siapa pemilik model), lini kedua (siapa validator), lini ketiga (kapan audit terakhir memeriksa proses ini). Bila validator dan pemilik model adalah orang yang sama, tulis itu juga — sebagai TEMUAN, bukan sebagai hal yang biasa.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Three lines of defense: lini pertama pemilik model dan bisnis, lini kedua validasi independen, lini ketiga audit internal; lini 1-2 melapor ke dewan/komite risiko, lini 3 melapor ke komite audit">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Three lines of defense — siapa memeriksa siapa</text>
<rect x="20" y="38" width="290" height="44" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="1.5"/>
<text x="34" y="56" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">Lini 1 — Pemilik model &amp; bisnis</text>
<text x="34" y="72" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Membangun, memakai, memonitor model sehari-hari</text>
<rect x="20" y="100" width="290" height="44" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="1.5"/>
<text x="34" y="118" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">Lini 2 — Validasi independen &amp; risk</text>
<text x="34" y="134" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Menguji, menantang asumsi, memberi verdict</text>
<rect x="20" y="162" width="290" height="44" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="1.5"/>
<text x="34" y="180" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">Lini 3 — Audit internal</text>
<text x="34" y="196" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Memeriksa apakah lini 1 &amp; 2 menjalankan tugasnya</text>
<rect x="340" y="80" width="120" height="84" fill="var(--c3)" opacity="0.2" stroke="var(--c3)" stroke-width="1.5"/>
<text x="400" y="104" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">Dewan /</text>
<text x="400" y="120" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">komite risiko</text>
<text x="400" y="140" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Pengambil keputusan</text>
<rect x="340" y="176" width="120" height="40" fill="var(--c3)" opacity="0.2" stroke="var(--c3)" stroke-width="1.5"/>
<text x="400" y="192" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">Komite audit</text>
<text x="400" y="208" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Lini 3 melapor ke sini</text>
<text x="400" y="154" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">akhir</text>
<line x1="310" y1="60" x2="340" y2="100" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="310" y1="122" x2="340" y2="122" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="310" y1="184" x2="340" y2="144" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="240" y="228" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Lini 2 TIDAK melapor ke lini 1 — validator melapor ke komite risiko, bukan ke tim model.</text>
</svg>`,
        alt: "Three lines of defense: lini pertama pemilik model dan bisnis, lini kedua validasi independen, lini ketiga audit internal; lini 1-2 melapor ke dewan/komite risiko, lini 3 melapor ke komite audit.",
        caption: "Cara membaca: tiga baris = tiga peran yang berbeda. Lini 1 membangun dan memakai; lini 2 menguji dan memberi verdict; lini 3 mengaudit keduanya. Lini 1-2 melapor ke dewan/komite risiko; lini 3 (audit internal) melapor ke komite audit — lini 2 tidak pernah melapor ke lini 1, karena validator tidak boleh dinilai oleh orang yang ia periksa.",
      },
      tasks: [],
    },
    {
      id: "conceptual-soundness",
      eyebrow: "Langkah 4 · Conceptual soundness",
      title: "Conceptual soundness: apakah metodenya masuk akal — sebelum melihat skornya",
      prose: [
        "Conceptual soundness adalah elemen pertama validasi: periksa KONSEP model sebelum memeriksa ANGKAnya. Validator menanyakan tiga hal: apakah ASUMSI metodenya cocok dengan masalahnya? Apakah DATAnya layak untuk metode itu? Dan apakah METODE yang dipilih sesuai dengan tujuan pemakaiannya? Skor yang bagus dari metode yang salah konsep adalah skor yang menipu — ia mengukur seberapa baik model yang keliru menyesuaikan diri dengan data.",
        "Asumsi — bandingkan dua model kita. Logistic Regression (LR) mengasumsikan hubungan yang LINEAR antara fitur dan log-odds default: tiap kenaikan PAY_MEAN satu satuan menaikkan log-odds dengan jumlah yang sama, berapa pun titik awalnya. GBM tidak membuat asumsi itu: ia non-parametrik, mempelajari bentuk hubungan apa pun dari data — termasuk ambang dan interaksi. Itu sebabnya GBM mentah (ROC-AUC 0,7823) mengalahkan LR (0,7426): hasil ini konsisten dengan hubungan yang tidak linear di data ini — bentuk pastinya (spline, interaksi, ambang) belum diuji di sini, jadi klaimnya adalah «konsisten dengan», bukan «terbukti». Tapi fleksibilitas itu ada harganya: GBM lebih mudah menghafal train — dan gap train-test 0,0646 (train 0,8469 vs test 0,7823) adalah harga yang terlihat. Validator tidak berkata «GBM lebih baik, selesai» — ia berkata «GBM lebih baik DAN lebih mudah overfit; tunjukkan bukti overfit-nya terkendali». Bukti itu ada: nested CV GBM 0,7858 (sd antar-fold 0,0068) [M6.2] — estimasi yang tidak bergantung pada satu split test — sejalan dengan test 0,7823, jadi gap 0,0646 adalah overfitting yang TERUKUR dan TERBATAS, bukan model yang runtuh.",
        "Data — dataset UCI ini SATU snapshot 30.000 baris tanpa tanggal: tidak ada deret waktu, tidak ada populasi masa depan. Validator mencatat batasan itu secara eksplisit: semua klaim validasi di lesson ini adalah klaim tentang POPULASI SNAPSHOT INI — bukan janji tentang populasi tahun depan. Itulah sebabnya ongoing monitoring (langkah 6) menjadi syarat deployment, bukan hiasan: validasi pada snapshot tidak bisa menjamin masa depan. Validator juga memeriksa representasi: base rate default 0,2212, 31 fitur, dan apakah ada grup kecil yang hasilnya tidak bisa dipercaya (AGE 60+ hanya n=76 di test — lihat langkah 9).",
        "Metode — kalibrasi Platt (sigmoid) dipakai karena keputusan uang (threshold 0,10) butuh probabilitas yang JUJUR, bukan sekadar ranking yang bagus. GBM mentah punya ranking yang sedikit lebih baik (ROC-AUC 0,7823 vs terkalibrasi 0,7816) — tapi ranking yang bagus tidak membayar tagihan: threshold 0,10 hanya bermakna bila skor 0,10 sungguh berarti peluang default 10%. Validator memeriksa pilihan ini: apakah kalibrasi memang dibutuhkan untuk pemakaian model? Ya — karena threshold diturunkan dari biaya (LGD 0,45, margin 0,05 [M6.4]), dan biaya itu dihitung dari probabilitas. Model yang ranking-nya bagus tapi kalibrasinya rusak akan memberi threshold yang salah — dan itu urusan conceptual soundness, bukan urusan ROC-AUC.",
        "Nilai: conceptual soundness bagus karena ia menangkap kesalahan yang TIDAK TERLIHAT di skor test. Model dengan asumsi yang salah bisa tetap punya ROC-AUC tinggi — ia hanya sedang menjawab pertanyaan yang salah dengan sangat baik. Menanyakan «apakah metodenya masuk akal?» sebelum «berapa skornya?» adalah urutan yang benar.",
        "Baik atau buruk: pemeriksaan konsep bagus bila ia SPESIFIK — «LR mengasumsikan linearitas log-odds; buktikan asumsi itu cukup baik di data ini» — dan buruk bila ia GENERIK — «metode sudah sesuai standar» tanpa menyebut asumsi mana yang diperiksa. Validator yang baik menulis asumsi yang ia periksa, satu per satu, beserta jawabannya.",
        "Mitigasi: sebelum validasi angka apa pun, tulis daftar asumsi model (linearitas? independensi? stasioneritas? snapshot?) dan untuk tiap asumsi: apakah ia masuk akal di data ini, dan apa yang terjadi bila ia salah. Daftar itu adalah halaman pertama laporan validasi — bukan lampiran.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: model yang skornya lebih tinggi pasti lebih «benar»",
        type: "pitfall",
        body: "Yang benar: GBM mentah 0,7823 mengalahkan LR 0,7426 — tapi itu bukti GBM lebih cocok dengan BENTUK hubungan di data ini, bukan bukti GBM «benar». GBM yang fleksibel juga lebih mudah overfit (gap 0,0646). Validator membandingkan metode pada ASUMSI dan BATASANNYA, bukan hanya pada skornya — dan bukti pengendali overfit-nya adalah nested CV 0,7858 (sd antar-fold 0,0068) [M6.2], bukan satu split test.",
      },
    },
    {
      id: "validation-design",
      eyebrow: "Langkah 4a · Sebelum outcomes analysis",
      title: "Desain validasi: cegah leakage, pilih split yang jujur, jangan pakai ulang test",
      prose: [
        "Outcomes analysis (langkah 5) menguji ulang hasil pada belahan data — tapi hasil uji itu hanya sejujur DESAIN validasinya. Desain validasi adalah keputusan yang diambil SEBELUM satu metrik pun dihitung: fitur apa yang boleh dipakai, data dibagi bagaimana, dan berapa kali test boleh dipakai ulang. Tiga keputusan desain, masing-masing dengan satu pertanyaan yang wajib dijawab tertulis.",
        "Satu — KETERSEDIAAN FITUR (feature availability): «fitur ini tersedia KAPAN?» Setiap fitur harus sudah ada pada saat keputusan diambil. Delapan fitur turunan flagship (PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT, UTILIZATION, PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, BILL_TREND [notebook]) semuanya dihitung dari riwayat pembayaran dan tagihan BULAN LALU — tersedia saat pengajuan diputuskan, jadi lolos cek ini. Yang GAGAL cek ini adalah fitur yang baru ada SETELAH keputusan: misalnya memakai «pembayaran bulan depan» untuk memutuskan bulan ini, atau memakai label default itu sendiri sebagai fitur. Fitur seperti itu membuat ROC-AUC terlihat bagus — dan membuat model tidak berguna di live, karena fitur itu tidak ada saat keputusan harus diambil. Ceklisnya: untuk tiap fitur, tulis TANGGAL ketersediaannya; bila tanggal itu setelah tanggal keputusan, fitur itu bocor (leakage) dan harus dibuang — berapa pun ROC-AUC yang ia sumbangkan. Anti-leakage di level pipeline (membangun fitur HANYA dari data train, di dalam Pipeline) sudah diajarkan di M6.2 — di sini yang baru adalah cek KETERSEDIAAN WAKTU-nya: pipeline yang benar pun bisa bocor bila fiturnya sendiri datang dari masa depan.",
        "Dua — PEMBAGIAN DATA (split): belahan acak (random split) menjawab «apakah model bekerja pada nasabah yang mirip dengan yang dilatih?» — dan hanya itu. Ia TIDAK menjawab dua pertanyaan yang lebih keras: «apakah model bekerja pada populasi MASA DEPAN?» (temporal split: latih pada periode lama, uji pada periode baru) dan «apakah model bekerja pada populasi yang BERBEDA?» (group/entity split: latih pada satu grup, uji pada grup lain — mis. latih tanpa AGE 60+, uji pada AGE 60+). Dataset UCI ini SATU snapshot tanpa tanggal (langkah 4) — split temporal TIDAK MUNGKIN dilakukan di sini, dan itu batasan yang harus ditulis, bukan disembunyikan: semua klaim validasi lesson ini adalah klaim tentang snapshot ini, dan kompensasinya adalah monitoring (langkah 6) + revalidasi. Split berdasarkan WAKTU untuk deret waktu sudah diajarkan di M6.2 (walk-forward pada BBCA) — pakai pola yang sama bila datamu punya tanggal: jangan pernah menguji masa depan dengan masa lalu yang diacak. Dan validation halves (langkah 5) adalah split ACAK — ia mengukur noise, bukan generalisasi ke populasi baru; jangan klaim halves membuktikan model tahan terhadap pergeseran populasi.",
        "Tiga — PAKAI ULANG TEST (test reuse): test 6.000 kita sudah dipakai BERKALI-KALI: memilih threshold (M6.4), membandingkan model (M6.5), memvalidasi (langkah 5), dan nanti memilih challenger (M8.4). Setiap kali test dipakai untuk MEMILIH — threshold, model, challenger — sebagian kejujurannya terkikis: yang dipilih adalah yang kebetulan bagus di test itu. Aturannya: test final dipakai SATU KALI untuk vonis akhir; sesudah itu ia REFERENSI, bukan test yang segar. Bila challenger baru datang sesudah vonis ini, ia TIDAK BOLEH dipilih berdasarkan test 6.000 yang sama tanpa catatan — bandingkan ia pada validation split yang segar, atau pada nested CV [M6.2], dan laporkan bahwa test 6.000 sudah dipakai memilih sebelumnya. Validator yang menemukan test dipakai memilih tiga kali tanpa catatan menulisnya sebagai TEMUAN — bukan sebagai hal yang biasa.",
        "Nilai: desain validasi bagus karena ia membuat batas bukti menjadi EKSPLISIT sebelum angka dibaca: «bukti ini berlaku untuk populasi snapshot, fitur yang tersedia saat keputusan, dan satu kali pemakaian test». Tanpa desain yang ditulis, outcomes analysis bisa menghasilkan angka yang benar untuk pertanyaan yang salah — dan tidak ada yang tahu pertanyaan mana yang dijawab.",
        "Baik atau buruk: desain yang bagus ditulis SEBELUM validasi berjalan — seperti ambang traffic-light yang ditulis sebelum melihat verdict (langkah 8). Buruk bila desain ditulis sesudah melihat hasil: split yang dipilih karena angkanya bagus adalah split yang dipilih karena kebetulan. Buruk juga bila satu jenis split dipakai untuk semua pertanyaan: random split untuk pertanyaan temporal adalah jawaban yang salah dengan angka yang benar.",
        "Mitigasi: di halaman pertama laporan validasi, tulis tiga baris desain — (1) cek ketersediaan fitur: semua fitur tersedia saat keputusan? (2) split apa yang dipakai, dan pertanyaan apa yang TIDAK bisa dijawab split itu? (3) berapa kali test ini sudah dipakai memilih, dan apa konsekuensinya? Bila satu baris tidak bisa dijawab, validasi belum siap dinilai.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: leakage tidak terlihat di ROC-AUC",
        type: "pitfall",
        body: "Yang benar: fitur bocor justru membuat ROC-AUC NAIK — leakage adalah cara termurah untuk mendapat skor test yang bagus. Satu-satunya yang menangkapnya adalah cek ketersediaan waktu: «kapan fitur ini ada?». Bila jawabannya «setelah keputusan», buang fitur itu — berapa pun ROC-AUC yang ia sumbangkan. Model yang ranking-nya bagus karena leakage adalah model yang tidak bisa dipakai, bukan model yang hebat.",
      },
    },
    {
      id: "outcomes-analysis",
      eyebrow: "Langkah 5 · Outcomes analysis",
      title: "Outcomes analysis: uji ulang hasilnya — validation halves A vs B",
      prose: [
        "Outcomes analysis adalah elemen kedua validasi (urutan di lesson ini adalah urutan pedagogis — SR 11-7 sendiri mengurutkan ketiga elemen validasi sebagai conceptual soundness, ongoing monitoring, outcomes analysis): UJI ULANG hasil model pada data yang belum dipakai untuk klaimnya. Backtesting pada test 6.000 sudah dilakukan — ROC-AUC GBM terkalibrasi 0,7816, ECE 0,0087, approval 28,5%, bad rate 6,67%. Tapi satu test, satu angka: berapa banyak dari angka itu yang merupakan «model yang bagus» dan berapa banyak yang merupakan «belahan data yang kebetulan menguntungkan»? Validator menjawabnya dengan VALIDATION HALVES: belah test 6.000 menjadi dua secara stratified (half A dan half B, n=3.000 masing-masing, seed 42) dan hitung SEMUA metrik di tiap belahan. Bila metriknya berayun lebar antar-belahan, maka «temuan» pada test penuh mungkin hanya noise belahan.",
        "Nilai [m8_canonical.json] — model keputusan GBM terkalibrasi, threshold 0,10. Half A: ROC-AUC 0,7885, PR-AUC 0,5656, approval 28,77%, bad rate 6,14%, ECE 0,0114, Brier 0,1329. Half B: ROC-AUC 0,7746, PR-AUC 0,5480, approval 28,23%, bad rate 7,20%, ECE 0,0104, Brier 0,1361. Selisih B−A: ROC-AUC −0,0139, PR-AUC −0,0176, approval −0,54 poin persen, bad rate +1,06 poin persen, ECE −0,0010, Brier +0,0032, base rate −0,03 poin persen. Base rate hampir IDENTIK (A 0,2213 vs B 0,2210) — belahannya memang setara, jadi ayunan metriknya bukan efek komposisi.",
        "Bacalah selisih itu seperti validator. ROC-AUC berayun 0,0139 antar-half — bandingkan dengan galat sampling SELISIH dua estimasi, bukan dengan sd satu skor: tiap half n=3.000, sd satu skor ROC-AUC ≈ 0,008–0,009 [ilustrasi], jadi sd selisihnya ≈ 0,011–0,013 — 0,0139 hanya sekitar 1,1–1,3 sd selisih, wajar untuk dua sampel yang masing-masing berisik. (Perbandingan dengan sd antar-fold 0,0068 [M6.2] memberi «≈2× sd» — 0,0139/0,0068 ≈ 2,04, benar secara aritmetika tetapi membandingkan hal yang salah: selisih dua estimasi harus dibandingkan dengan galat selisih, bukan dengan sd satu skor.) PR-AUC berayun 0,0176 — juga wajar untuk metrik yang lebih sensitif pada data tak seimbang. ECE berayun hanya 0,0010 (A 0,0114 vs B 0,0104) — kalibrasi STABIL di kedua belahan. Brier berayun 0,0032 — kecil. Satu-satunya ayunan yang menarik perhatian validator: bad rate yang disetujui, 6,14% di A vs 7,20% di B — selisih +1,06 poin persen. Bad rate dihitung pada nasabah yang DISETUJUI saja (sekitar 860 per half), jadi penyebutnya kecil dan ayunannya wajar secara statistik — tapi validator tidak boleh mengabaikannya begitu saja: bad rate adalah metrik UANG (ia menentukan kerugian), dan ayunan 1,06 poin persen pada 860 nasabah adalah selisih 8 nasabah default (A: 0,0614 × 863 ≈ 53; B: 0,0720 × 847 ≈ 61). Itulah yang membuat verdict lesson ini KUNING, bukan HIJAU (langkah 8).",
        "Satu pelajaran yang lebih dalam: RANKING INVARIAN ≠ APPROVAL INVARIAN. ROC-AUC A vs B hanya berbeda 0,0139 — ranking model hampir sama di kedua belahan. Tapi keputusan APPROVAL (siapa yang lolos threshold 0,10) bergeser: approval 28,77% vs 28,23%, dan bad rate di antara yang disetujui bergeser 1,06 poin persen. Ranking mengukur URUTAN; approval mengukur KEPUTUSAN pada satu titik potong — dan titik potong itu sensitif terhadap pergeseran kecil distribusi skor di sekitar 0,10. Validator yang hanya memeriksa ROC-AUC akan menyimpulkan «stabil» — dan melewatkan bahwa keputusan uangnya berayun. Outcomes analysis memeriksa KEDUANYA.",
        "Baik atau buruk: validation halves bagus karena ia MURAH dan JUJUR — tidak butuh data baru, hanya belahan baru dari data yang sama, dan ia memberi angka untuk pertanyaan «seberapa besar noise-nya?» — jawaban yang tidak bisa diberikan oleh satu test. Buruk bila dibaca sebagai «jadi test penuh tidak berguna»: halves BUKAN pengganti test — ia pelengkap. Test penuh (n=6.000) tetap estimasi terbaikmu; halves memberitahumu seberapa goyah estimasi itu. Dan buruk bila halves dipakai untuk MEMILIH model (memilih half yang angkanya bagus) — halves adalah alat UJI, bukan alat PILIH.",
        "Mitigasi: setiap klaim outcomes analysis tuliskan BERSAMA ukuran sampelnya: «ROC-AUC 0,7816 (n=6.000), halves 0,7885 / 0,7746 (n=3.000)». Tanpa n, selisih 0,0139 tidak bisa dinilai — dengan n, ia menjadi informasi: ayunan yang wajar untuk ukuran sampel itu.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Validation halves: ROC-AUC half A 0,7885, half B 0,7746, test penuh 0,7816; bad rate half A 6,14 persen, half B 7,20 persen">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Validation halves — model yang sama, belahan yang berbeda</text>
<text x="125.0" y="34" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">ROC-AUC (GBM terkalibrasi)</text>
<line x1="30" y1="40" x2="30" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="30" y1="206" x2="220" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="30" y1="118.0" x2="220" y2="118.0" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="24" y="43" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,80</text>
<text x="24" y="121" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<text x="24" y="209" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,70</text>
<rect x="48" y="50.2" width="40" height="155.8" fill="var(--c1)"/>
<text x="68" y="44.2" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7885</text>
<text x="68" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Half A</text>
<rect x="106" y="74.7" width="40" height="131.3" fill="var(--c4)"/>
<text x="126" y="68.7" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7746</text>
<text x="126" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Half B</text>
<rect x="164" y="62.4" width="40" height="143.6" fill="var(--c2)"/>
<text x="184" y="56.4" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7816</text>
<text x="184" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Test 6.000</text>
<text x="125" y="112" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">selisih B−A: −0,0139</text>
<text x="355.0" y="34" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Bad rate yang disetujui</text>
<line x1="260" y1="40" x2="260" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="260" y1="206" x2="450" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<text x="254" y="43" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">8%</text>
<text x="254" y="121" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4%</text>
<text x="254" y="209" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text>
<rect x="300" y="71.1" width="50" height="134.9" fill="var(--c1)"/>
<text x="325" y="65.1" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">6,14%</text>
<text x="325" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Half A</text>
<rect x="380" y="47.6" width="50" height="158.4" fill="var(--c2)"/>
<text x="405" y="41.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">7,20%</text>
<text x="405" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Half B</text>
<text x="355" y="112" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">selisih B−A: +1,06 pp</text>
</svg>`,
        alt: "Validation halves: ROC-AUC half A 0,7885, half B 0,7746, test penuh 0,7816; bad rate half A 6,14 persen, half B 7,20 persen.",
        caption: "Cara membaca: panel kiri = ROC-AUC hampir sama di kedua belahan (selisih −0,0139) — ranking stabil. Panel kanan = bad rate yang disetujui berayun 1,06 poin persen (6,14% vs 7,20%) — keputusan uangnya berayun walau ranking-nya stabil. Ranking invarian ≠ approval invarian. Angka dari m8_canonical.json, model GBM terkalibrasi, threshold 0,10.",
      },
      tasks: [],
      formula: String.raw`\mathrm{ECE} = \sum_{b=1}^{10} \frac{n_b}{n}\, \bigl|\bar{p}_b - \bar{y}_b\bigr|, \qquad \begin{array}{ll} \mathrm{ECE} < 0{,}02 & \text{lolos [kebijakan lesson ini]} \\ 0{,}02 \le \mathrm{ECE} < 0{,}05 & \text{catatan (KUNING)} \\ \mathrm{ECE} \ge 0{,}05 & \text{tolak (MERAH)} \end{array}`,
      formulaNote: "ECE (Expected Calibration Error): rata-rata tertimbang selisih |probabilitas prediksi rata-rata − laju default aktual| per bin (10 bin). ECE test 0,0087; half A 0,0114; half B 0,0104 — ketiganya di bawah 0,02, jadi kalibrasi lolos di semua belahan. Band 0,02/0,05 adalah [kebijakan lesson ini], bukan konstanta alam. Band ini berlaku untuk ECE overall dan ECE per half; untuk ECE per grup berlaku gate ukuran sampel (langkah 8): grup dengan n ≥ 200 masuk band, grup dengan n < 200 adalah TEMUAN-INVESTIGASI, bukan pemicu band.",
    },
    {
      id: "uncertainty-ci",
      eyebrow: "Langkah 5a · Setelah outcomes analysis",
      title: "Kuantifikasi ketidakpastian: tiap angka punya pita — dan pita itu bisa membalik verdict",
      prose: [
        "Langkah 5 memberimu angka: bad rate 6,67%, selisih antar-half +1,06 poin persen, ECE 0,0087. Tapi setiap angka itu adalah SATU pengukuran dari satu sampel — dan validator yang baik tidak pernah membaca angka tanpa menanyakan «seberapa lebar pitanya?». Alatnya: BOOTSTRAP — ambil test 6.000, acak-ulang barisnya dengan pengembalian (resampling) 2.000 kali, hitung metrik di tiap ulangan, dan baca persentil 2,5%–97,5% sebagai interval kepercayaan (CI) 95%. Modelnya TETAP (GBM terkalibrasi yang sama, tidak dilatih ulang) — yang diukur adalah ketidakpastian SAMPLING test, bukan ketidakpastian latih. Bedanya dengan CI naif M6.2: di M6.2 interval dihitung dari SE (sd antar-fold / √5) untuk skor nested CV — rumus yang hanya berlaku bila kamu punya simpangan baku antar-fold; di sini bad rate, ECE, dan profit tidak punya rumus SE yang sederhana, jadi intervalnya dibangun dengan bootstrap. Idenya sama — «angka ± pita» — konstruksinya berbeda. Semua interval di langkah ini [turunan] dari m8_bootstrap_ci: bootstrap B=2.000, seed 42, atas test yang sama.",
        "Nilai [turunan] — model keputusan GBM terkalibrasi, threshold 0,10, test 6.000. Bad rate yang disetujui 6,67% — CI95 [5,47%; 7,85%]: pita selebar 2,38 poin persen. Approval rate 28,5% — CI95 [27,33%; 29,65%]: pita selebar 2,32 poin persen. ECE overall 0,0087 — CI95 [0,0077; 0,0214]: perhatikan, batas ATAS-nya 0,0214 MELEWATI ambang lolos 0,02 — kalibrasi overall kemungkinan besar baik, tapi bukti tidak cukup kuat untuk mengklaimnya dengan pasti pada 95%. Profit terealisasi +NT$8.214.000 — CI95 [NT$5.575.975; NT$10.802.787]: pita selebar NT$5.226.812 — laba «8,2 juta» itu sebenarnya «antara 5,6 dan 10,8 juta». Selisih antar-half: bad rate +1,06 poin persen — CI95 [−1,26; +3,35] poin persen; ROC-AUC −0,0139 — CI95 [−0,0428; +0,0132]; ECE −0,0010 — CI95 [−0,0142; +0,0118].",
        "Bacalah CI selisih bad rate itu seperti validator — karena di sanalah pelajarannya. Titiknya +1,06 poin persen, yang memicu KUNING (langkah 8). Tapi CI-nya [−1,26; +3,35] MELEWATI NOL — sekitar 19,7% ulangan bootstrap memberi selisih ≤ 0 — artinya pada 95% keyakinan, selisih itu TIDAK TERBUKTI berbeda dari nol. CI yang sama juga MELEWATI ambang HIJAU 1,0 poin persen dan MELEWATI ambang MERAH 3,0 poin persen: satu interval yang mencakup «tidak ada selisih», «KUNING», dan «MERAH» sekaligus. Itulah yang dimaksud «verdict yang tidak konklusif»: angka titiknya berkata KUNING, pitanya berkata «bisa jadi apa saja». Aturan lesson ini — dan ini aturan yang ditulis dulu, bukan dinegosiasikan sesudah melihat CI: verdict traffic-light tetap mengikuti ESTIMASI TITIK (1,06 > 1,0 → KUNING, langkah 8) — CI tidak mengubah band dan tidak membatalkan verdict. Yang diubah CI adalah TINDAK LANJUTNYA: verdict KUNING yang CI-nya melintasi ambang DITANDAI «tidak konklusif — investigate» — validator menulis CI itu di laporan, memprioritaskan pengumpulan sampel lebih besar untuk bad rate, dan revalidasi tidak boleh ditunda. Sebaliknya, HIJAU yang CI-nya melintasi ambang KUNING adalah «HIJAU dengan peringatan» — deploy boleh jalan, tapi metrik itu masuk daftar pantau pertama. Dan MERAH yang CI-nya melintasi nol tetap MERAH — ketidakpastian tidak menyelamatkan model yang titiknya sudah melewati ambang tolak; ia hanya menjelaskan seberapa yakin kamu pada vonis itu.",
        "Dua CI per grup yang menunjukkan kenapa gate ukuran sampel (langkah 8) ada. ECE AGE 60+ 0,1208 (n=76) — CI95 [0,0839; 0,2225]: SELURUH interval di atas ambang MERAH 0,05 — mis-kalibrasi grup ini kemungkinan besar NYATA, bukan sekadar noise titik. Tetapi statusnya TETAP temuan-investigasi, bukan pemicu band: ECE dari 76 baris dalam 10 bin bisa terdistorsi komposisi bin (beberapa bin hanya berisi 1–2 nasabah), dan aturan lesson (gate n ≥ 200) adalah kebijakan yang ditulis dulu — CI memperkuat URGENSI penyelidikan (kumpulkan sampel lebih besar untuk grup ini SEBELUM revalidasi, jadikan prioritas pertama di daftar KUNING), ia tidak mengubah status temuan. Bandingkan dengan ECE Pascasarjana 0,0210 (n=2.130) — CI95 [0,0159; 0,0387]: intervalnya MELEWATI 0,02 — status KUNING grup itu pun tidak konklusif: ia bisa jadi HIJAU (0,0159) atau KUNING (0,0387) — dan validator yang jujur menulis keduanya, bukan hanya titiknya.",
        "Baik atau buruk: CI bagus karena ia mengubah «1,06 poin persen» dari vonis menjadi PERTANYAAN — «1,06 dengan pita berapa?» — dan pertanyaan itu punya jawaban yang bisa diaudit. Buruk bila CI dibaca sebagai «jadi angkanya tidak bisa dipercaya»: CI yang lebar bukan bukti angkanya salah — ia bukti SAMPELNYA kecil untuk pertanyaan itu. Dan buruk bila CI dipakai untuk menggeser ambang («CI-nya mencakup 0, jadi kita anggap HIJAU»): ambang ditulis dulu dari pertimbangan bisnis (langkah 8); CI memberitahu seberapa yakin kamu pada verdict itu, bukan verdict apa yang kamu inginkan.",
        "Mitigasi: setiap metrik yang masuk verdict tuliskan BERSAMA CI95-nya: «bad rate 6,67% [5,47%; 7,85%]», «selisih antar-half +1,06 pp [−1,26; +3,35]». Bila CI melintasi ambang, tulis satu baris tambahan di laporan: «tidak konklusif — investigate» beserta tindak lanjutnya (sampel lebih besar / pantau / revalidasi dipercepat). Verdict tanpa CI adalah verdict yang berpura-pura pasti.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Interval kepercayaan 95 persen bootstrap: bad rate test 6,67 persen dengan CI 5,47 sampai 7,85 persen; selisih bad rate antar-half plus 1,06 poin persen dengan CI minus 1,26 sampai plus 3,35 poin persen, melintasi nol dan ambang HIJAU 1,0">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">CI95 bootstrap (B=2.000) — titik vs pita [turunan]</text>
<text x="125.0" y="34" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Bad rate test (GBM terkalibrasi)</text>
<line x1="30" y1="40" x2="30" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="30" y1="206" x2="220" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<text x="24" y="43" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">9%</text>
<text x="24" y="121" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6,5%</text>
<text x="24" y="209" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4%</text>
<line x1="86" y1="90" x2="86" y2="150" stroke="var(--c1)" stroke-width="3"/>
<line x1="176" y1="90" x2="176" y2="150" stroke="var(--c1)" stroke-width="3"/>
<line x1="86" y1="120" x2="176" y2="120" stroke="var(--c1)" stroke-width="3"/>
<circle cx="131" cy="120" r="5" fill="var(--c2)"/>
<text x="131" y="104" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">6,67%</text>
<text x="86" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5,47%</text>
<text x="176" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">7,85%</text>
<text x="125" y="188" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">CI95 selebar 2,38 pp</text>
<text x="355.0" y="34" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Selisih bad rate B−A (pp)</text>
<line x1="260" y1="40" x2="260" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="260" y1="206" x2="450" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<text x="254" y="43" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">+4</text>
<text x="254" y="121" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="254" y="209" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−2</text>
<line x1="323" y1="40" x2="323" y2="206" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="355" y1="40" x2="355" y2="206" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="418" y1="40" x2="418" y2="206" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="323" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="355" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">1,0 HIJAU</text>
<text x="418" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">3,0 MERAH</text>
<line x1="283" y1="90" x2="283" y2="150" stroke="var(--c1)" stroke-width="3"/>
<line x1="429" y1="90" x2="429" y2="150" stroke="var(--c1)" stroke-width="3"/>
<line x1="283" y1="120" x2="429" y2="120" stroke="var(--c1)" stroke-width="3"/>
<circle cx="357" cy="120" r="5" fill="var(--c2)"/>
<text x="357" y="104" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+1,06</text>
<text x="283" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−1,26</text>
<text x="429" y="168" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">+3,35</text>
<text x="355" y="188" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">CI melintasi 0 dan 1,0 — tidak konklusif</text>
</svg>`,
        alt: "Interval kepercayaan 95 persen bootstrap: bad rate test 6,67 persen dengan CI 5,47 sampai 7,85 persen; selisih bad rate antar-half plus 1,06 poin persen dengan CI minus 1,26 sampai plus 3,35 poin persen, melintasi nol dan ambang HIJAU 1,0.",
        caption: "Cara membaca: panel kiri = bad rate test 6,67% dengan CI95 [5,47%; 7,85%] — pita selebar 2,38 poin persen. Panel kanan = selisih bad rate antar-half +1,06 pp dengan CI95 [−1,26; +3,35] — intervalnya melintasi nol (garis putus-putus), ambang HIJAU 1,0, dan ambang MERAH 3,0: satu interval yang mencakup «tidak ada selisih», «KUNING», dan «MERAH» sekaligus. Verdict titiknya tetap KUNING — tapi ditandai «tidak konklusif — investigate». Angka [turunan] dari m8_bootstrap_ci (bootstrap B=2.000, seed 42).",
      },
      tasks: [],
    },
    {
      id: "ongoing-monitoring",
      eyebrow: "Langkah 6 · Ongoing monitoring",
      title: "Ongoing monitoring: validasi tidak selesai saat model deploy",
      prose: [
        "Validasi punya tanggal kedaluwarsa. Semua bukti di langkah 4–5 — conceptual soundness, backtesting, halves — diukur pada snapshot UCI yang sama. Begitu model live, populasinya bergerak, dan bukti kemarin tidak menjamin hari ini. Karena itu SR 11-7 menuntut ONGOING MONITORING: validasi tidak selesai saat model deploy; ia berlanjut sebagai pemantauan yang validator TETAPKAN SYARATNYA sebelum memberi lampu hijau.",
        "Isi monitoringnya BUKAN materi baru lesson ini — ia adalah M7.5 (Monitoring & Drift), dan lesson ini hanya merujuknya, bukan mengajar ulang: PSI skor sebagai alarm pertama (train vs test 0,0017; ambang waspada 0,1 / geser besar 0,25); decay performa per periode (baseline test ROC-AUC 0,7816, PR-AUC 0,5558, ECE 0,0087, bad rate 6,67%); alerting dengan ambang yang ditulis dulu dan penanggung jawab yang ditulis dulu; dan pemicu retraining yang kuantitatif [M7.5]. Yang BARU di lesson ini adalah SUDUT PANDANGNYA: validator bukan yang memantau — validator yang MENULIS SYARAT pemantauan itu di laporan validasi, dan yang akan memeriksa di revalidasi berikutnya apakah syarat itu dipatuhi.",
        "Syarat monitoring yang validator tetapkan untuk model ini [kebijakan lesson ini]: (1) PSI skor harian vs train, ambang 0,1 / 0,25 [M7.5]; (2) ROC-AUC, PR-AUC, approval rate, dan bad rate per periode vs baseline test (0,7816 / 0,5558 / 28,5% / 6,67%) — dengan perhatian KHUSUS pada bad rate, karena halves menunjukkan ia berayun 1,06 poin persen bahkan tanpa drift; bad rate, ROC-AUC, PR-AUC, dan ECE memakai label «default bulan depan», jadi jendela observasinya 1 bulan [M7.5] — metrik berlabel baru bisa dibaca setelah jendela itu lewat, sementara label belum matang PSI skor dan approval rate adalah alarm yang dibaca duluan; (3) ECE per periode (setelah label matang, jendela 1 bulan), ambang 0,02 — karena threshold 0,10 bergantung pada kalibrasi; (4) revalidasi terjadwal 3 bulan setelah deploy, dipercepat bila satu metrik melewati ambangnya dua periode berturut-turut. Syarat-syarat ini adalah bagian dari verdict KUNING (langkah 8): model lolos DENGAN syarat-syarat ini, bukan tanpa syarat.",
        "Nilai: ongoing monitoring bagus karena ia mengakui batas validasi: validasi membuktikan model BAGUS DI DATA KEMARIN — monitoring membuktikan model MASIH BAGUS HARI INI. Tanpa monitoring, laporan validasi adalah sertifikat tanpa tanggal kedaluwarsa: benar saat ditulis, menyesatkan setahun kemudian.",
        "Baik atau buruk: monitoring bagus bila ambangnya DITULIS DULU dari angka validasi (baseline test, ayunan halves) — dan buruk bila ambangnya ditebak sesudah melihat live, karena ambang yang ditulis sesudah melihat angka adalah ambang yang tidak akan pernah berbunyi. Buruk juga bila monitoring diserahkan tanpa pemilik: «dipantau berkala» tanpa nama dan frekuensi adalah janji kosong.",
        "Mitigasi: di laporan validasi, tulis syarat monitoring sebagai DAFTAR yang bisa diaudit — metrik, ambang, frekuensi, pemilik, dan tanggal revalidasi. Di revalidasi berikutnya, validator pertama-tama memeriksa daftar itu: apakah yang dijanjikan benar-benar dipantau?",
      ],
      tasks: [],
      note: {
        title: "Batas lesson: monitoring diajarkan di M7.5, bukan di sini",
        type: "pitfall",
        body: "Yang benar: PSI, decay, alerting, dan retraining diajarkan lengkap di M7.5 — lesson ini tidak mengulang rumusnya. Bila kamu belum menguasai M7.5, kembali ke sana dulu. Di M8.1, monitoring hanya muncul sebagai SYARAT VALIDASI: apa yang validator tuntut, dan bagaimana ia memeriksa kepatuhannya nanti.",
      },
    },
    {
      id: "independence",
      eyebrow: "Langkah 7 · Independensi validator",
      title: "Independensi: validator bukan pembangun model — dan kenapa itu bukan formalitas",
      prose: [
        "Syarat yang mudah diucapkan, tapi sering dilanggar dalam praktik: validator harus INDEPENDEN dari pembangun model. Independen berarti tiga hal: validator tidak ikut membangun model itu; validator tidak dinilai atau digaji oleh tim yang membangunnya; dan validator punya wewenang MENAHAN model (verdict MERAH berarti jangan deploy — bukan «silakan deploy sambil diperbaiki»). Bila satu dari tiga ini tidak ada, yang terjadi bukan validasi — melainkan review oleh rekan sejawat yang sopan.",
        "Mengapa ini penting secara SUBSTANSI, bukan sekadar tata kelola? Karena pembangun model punya blind spot yang sistematis: mereka tahu ASUMSI yang mereka buat — dan asumsi yang paling berbahaya adalah asumsi yang terasa begitu wajar sehingga tidak pernah ditulis. Contoh dari modul kita sendiri: model flagship memakai SEX, EDUCATION, dan AGE sebagai fitur — dan premis «model tidak memakai SEX/EDUCATION/AGE» sempat beredar sampai diverifikasi SALAH (koefisien SEX −0,0626, SHAP 0,0314) [M7]. Pembangun yang menulis premis itu bukan berbohong — ia tidak memeriksa. Validator independen yang tidak ikut menulis kode itulah yang memeriksa. Blind spot lain: pembangun yang hanya memeriksa ROC-AUC (langkah 9) karena itulah metrik yang ia optimalkan — validator independen memeriksa ECE per grup, karena itulah yang pembangun tidak optimalkan.",
        "Apa yang terjadi bila independensi tidak ada? Tiga hal, semuanya diam-diam: (1) VALIDASI MENJADI STEMPEL — laporan validasi ditulis untuk membenarkan keputusan deploy yang sudah diambil, bukan untuk mengujinya; temuan yang mengganggu dihaluskan menjadi «catatan» tanpa syarat. (2) TEMUAN YANG TIDAK NYAMAN TIDAK NAIK — bad rate yang berayun 1,06 poin persen antar-half (langkah 5) akan ditulis sebagai «dalam batas wajar» tanpa ambang yang eksplisit — karena menulis ambang berarti mengakui ada ambang yang bisa dilanggar. (3) KESALAHAN BERULANG — tanpa pemeriksa independen, kelas kesalahan yang sama muncul di model berikutnya, karena tidak ada yang mencatatnya sebagai temuan formal. Ketiganya tidak terlihat di laporan — justru itu bahayanya.",
        "Nilai: independensi bagus karena ia kontrol yang tidak bisa digantikan oleh kepintaran: validator sepintar apa pun tidak bisa menguji modelnya sendiri dengan jujur, karena ia tahu jawaban yang ia harapkan. Skeptisisme yang DIBAYAR UNTUK SKEPTIS — itulah fungsi lini kedua.",
        "Baik atau buruk: independensi bagus bila ia STRUKTURAL (jalur pelaporan terpisah, wewenang menahan) — dan buruk bila ia hanya PERSONAL («validatornya orang yang jujur, kok»). Orang jujur yang melapor ke kepala tim model tetap berada dalam konflik kepentingan; struktur yang benar melindungi orang jujur itu dari keharusan memilih antara kejujuran dan kariernya.",
        "Mitigasi: sebelum validasi, periksa tiga pertanyaan dan tulis jawabannya di laporan: (1) Apakah validator ikut membangun model ini? (2) Apakah validator dinilai oleh pemilik model? (3) Bisakah validator menahan deploy? Bila jawaban (1) atau (2) adalah «ya», atau (3) adalah «tidak» — validasi belum independen, dan verdict apa pun darinya harus diberi tanda «tidak independen».",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: independensi berarti validator harus «bermusuhan» dengan tim model",
        type: "risk",
        body: "Yang benar: independen berarti BEBAS dari kepentingan — bukan bermusuhan. Validator yang baik adalah ADVERSARIAL terhadap KLAIM, bukan terhadap ORANG: ia menguji bukti sekeras mungkin, lalu menulis verdict sejujur mungkin — termasuk HIJAU bila memang hijau. Validator yang mencari-cari kesalahan demi membuktikan dirinya berguna sama buruknya dengan validator yang menstempel apa saja.",
      },
    },
    {
      id: "traffic-light",
      eyebrow: "Langkah 8 · Traffic-light verdict",
      title: "Traffic-light: HIJAU, KUNING, MERAH — dengan ambang yang ditulis eksplisit",
      prose: [
        "Verdict validasi harus bisa dibaca dalam satu detik — dan dipertahankan dalam satu jam. Lesson ini memakai traffic-light tiga band [kebijakan lesson ini — ambang dipilih dari angka lesson, bukan konstanta alam, dan ditulis SEBELUM melihat verdict]: HIJAU (lolos tanpa catatan), KUNING (lolos dengan catatan + syarat), MERAH (tolak — jangan deploy). Ambang tiap band di bawah ini; perhatikan bahwa setiap kondisi dirumuskan sebagai angka, bukan perasaan. Band ECE berlaku untuk ECE overall dan ECE per half (n=3.000–6.000); untuk ECE per grup berlaku gate ukuran sampel: grup dengan n ≥ 200 masuk band, grup dengan n < 200 adalah TEMUAN-INVESTIGASI — ia wajib ditulis dan diselidiki, tetapi tidak memicu band.",
        "HIJAU — lolos tanpa catatan — bila SEMUA ini terpenuhi: ROC-AUC test (GBM terkalibrasi) ≥ 0,75; ECE < 0,02; |selisih ROC-AUC antar-half| ≤ 0,02; |selisih bad rate antar-half| ≤ 1,0 poin persen; |selisih approval antar-half| ≤ 1,0 poin persen; dan conceptual soundness lolos (langkah 4). KUNING — lolos dengan catatan — bila SATU kondisi HIJAU dilanggar RINGAN: ECE 0,02–0,05; |selisih ROC-AUC| 0,02–0,05; |selisih bad rate| 1,0–3,0 poin persen; |selisih approval| 1,0–3,0 poin persen; atau ROC-AUC 0,70–0,75. Syarat KUNING: catatan tertulis + pemantauan diperketat pada metrik yang melanggar + revalidasi 3 bulan (langkah 6). MERAH — tolak — bila SATU PUN kondisi ini terjadi: ECE ≥ 0,05; |selisih ROC-AUC| > 0,05; |selisih bad rate| > 3,0 poin persen; |selisih approval| > 3,0 poin persen; ROC-AUC < 0,70; atau conceptual soundness GAGAL (asumsi/data/metode terbukti salah). MERAH berarti jangan deploy — bukan «deploy sambil diperbaiki».",
        "Terapkan pada model kita. ROC-AUC test GBM terkalibrasi 0,7816 — di atas 0,75 ✓ HIJAU. ECE test 0,0087, half A 0,0114, half B 0,0104 — semuanya di bawah 0,02 ✓ HIJAU. ECE per grup [M7.1] yang masuk band (n ≥ 200): Pascasarjana 0,0210, SMA 0,0362, AGE 50–59 0,0312 — ketiganya di rentang KUNING 0,02–0,05; SEX 0,0127/0,0139, Universitas 0,0100, dan grup AGE lainnya di bawah 0,02 ✓ HIJAU. Grup n < 200 (EDUCATION Lainnya 0,0455, n=82; AGE 60+ 0,1208, n=76) adalah TEMUAN-INVESTIGASI, bukan pemicu band. |Selisih ROC-AUC antar-half| 0,0139 — di bawah 0,02 ✓ HIJAU. |Selisih approval antar-half| 0,54 poin persen — di bawah 1,0 ✓ HIJAU. |Selisih bad rate antar-half| 1,06 poin persen — MELEWATI 1,0 poin persen, masuk rentang KUNING 1,0–3,0 — dan hanya 0,06 poin persen di atas ambang. Conceptual soundness: lolos (langkah 4). VERDICT: KUNING — lolos dengan catatan. Pemicunya: |Δbad rate| 1,06 poin persen DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312); catatan yang menyertainya: pantau bad rate yang disetujui per periode dengan perhatian khusus (langkah 6), selidiki ECE ketiga grup itu bersama temuan-investigasi AGE 60+ (langkah 9), dan revalidasi 3 bulan.",
        "Perhatikan betapa TIPISNYA batas itu — 1,06 vs 1,0 — dan betapa PENTINGNYA ia tetap ditulis. Ambang 1,0 poin persen dipilih sebelum melihat angka halves (dari pertimbangan: bad rate baseline 6,67%, ayunan 1,0 poin persen adalah sekitar 15% relatif — cukup besar untuk diperhatikan, cukup kecil untuk bukan vonis). Bahwa hasil akhirnya 1,06 — hanya 0,06 di atas ambang — adalah FAKTA yang harus ditulis, bukan alasan untuk menggeser ambang menjadi 1,1 sesudah melihat hasilnya. Menggeser ambang sesudah melihat angka adalah cara paling sopan untuk berbohong dengan statistik. Validator yang jujur menulis: «KUNING, dipicu selisih bad rate 1,06 poin persen — 0,06 poin persen di atas ambang 1,0 — dengan catatan pemantauan bad rate».",
        "Nilai: traffic-light bagus karena ia mengubah verdict dari OPINI («modelnya cukup bagus») menjadi KEPUTUSAN YANG BISA DIAUDIT («KUNING karena kondisi X, dengan syarat Y, revalidasi tanggal Z»). Siapa pun — termasuk auditor lini ketiga setahun kemudian — bisa memeriksa apakah verdict itu mengikuti aturannya sendiri.",
        "Baik atau buruk: band ini bagus bila ambangnya DITULIS DULU dan ALASANNYA DICATAT (kenapa 1,0 poin persen? kenapa 0,02?). Buruk bila ambang disalin apa adanya ke model lain: ambang yang benar untuk n=3.000 per half dan bad rate 6,67% belum tentu benar untuk n=100.000 atau bad rate 20%. Hitung noise-mu sendiri, baru tulis ambangmu — dan jangan pernah menggeser ambang sesudah melihat hasilnya.",
        "Mitigasi: di laporan validasi, tulis tabel band LENGKAP (HIJAU/KUNING/MERAH + ambang tiap kondisi) di halaman verdict, beserta verdict tiap kondisi untuk model ini — satu baris per kondisi, dengan angka dan ✓/✗. Tabel itu adalah bukti bahwa verdict mengikuti aturan — bukan aturan yang mengikuti verdict.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: KUNING dibaca sebagai «hampir MERAH» atau «hampir HIJAU»",
        type: "pitfall",
        body: "Yang benar: KUNING adalah verdict SENDIRI — «lolos dengan syarat» — bukan «gagal tipis» dan bukan «lolos dengan sedikit rasa bersalah». Model KUNING DEPLOY dengan syarat yang tertulis dan diaudit; model MERAH TIDAK DEPLOY. Mencampuradukkan keduanya — menahan model KUNING karena «takut» atau mendepoy model MERAH karena «hampir kuning» — adalah kegagalan governance, bukan kegagalan model.",
      },
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 9 · Jebakan",
      title: "Jebakan: validator yang hanya memeriksa akurasi",
      prose: [
        "Jebakan paling umum dalam validasi — dan paling sulit dikenali, karena ia terlihat seperti pekerjaan yang rajin: validator memeriksa ROC-AUC, PR-AUC, dan Brier — semuanya bagus — lalu menulis «model lolos». Yang tidak diperiksa: KALIBRASI PER GRUP. ROC-AUC mengukur ranking GLOBAL; ia tidak tahu — dan tidak peduli — apakah probabilitas model jujur untuk tiap kelompok nasabah. Model bisa meranking dengan sempurna sambil memberi probabilitas yang salah total pada satu grup — dan skor test-nya tetap 0,7823.",
        "Nilai [M7.1] — model keputusan yang sama, GBM terkalibrasi, threshold 0,10. ECE OVERALL test 0,0087 — sangat baik. Tapi ECE PER GRUP: SEX laki-laki 0,0127, perempuan 0,0139 — masih baik. EDUCATION: Lainnya 0,0455 (n=82), Pascasarjana 0,0210 (n=2.130), SMA 0,0362 (n=1.014), Universitas 0,0100 (n=2.774) — sudah di atas 0,02 pada tiga dari empat grup; dua di antaranya (Pascasarjana, SMA) masuk band karena n ≥ 200, Lainnya tidak. AGE: di bawah 30 tahun 0,0148 (n=1.912); 30–39 tahun 0,0156 (n=2.198); 40–49 tahun 0,0166 (n=1.341); 50–59 tahun 0,0312 (n=473) — masuk band, KUNING; 60+ tahun 0,1208 (n=76) — LEBIH DARI ENAM KALI ambang lolos 0,02, tetapi n < 200 sehingga TEMUAN-INVESTIGASI, bukan pemicu band. Grup AGE 60+ (n=76 di test) punya ECE 0,1208: probabilitas model untuk nasabah tertua meleset rata-rata 12 poin persen. Validator yang hanya memeriksa ECE overall 0,0087 akan menulis «kalibrasi bagus» — dan melewatkan satu grup yang kalibrasinya rusak.",
        "Dua hal harus dikatakan sekaligus, karena keduanya benar. Pertama: 0,1208 adalah TEMUAN yang wajib ditulis — ECE per grup adalah bagian dari outcomes analysis, dan band 0,02/0,05 berlaku per grup HANYA bila n ≥ 200 (gate ukuran sampel, langkah 8): grup dengan n < 200 adalah TEMUAN-INVESTIGASI, bukan pemicu band. AGE 60+ (n=76) jatuh di sisi itu — begitu juga EDUCATION Lainnya 0,0455 (n=82). Sebaliknya, tiga grup dengan n ≥ 200 yang ECE-nya di rentang KUNING — Pascasarjana 0,0210 (n=2.130), SMA 0,0362 (n=1.014), AGE 50–59 0,0312 (n=473) — MEMASUKI band dan ikut memicu KUNING. Kedua: n=76 adalah SAMPEL KECIL — ECE dari 76 nasabah berayun lebar, dan 0,1208 bisa jadi sebagian noise. Validator yang baik tidak menulis «model diskriminatif terhadap lansia» (vonis tanpa bukti cukup) DAN tidak menulis «abaikan, n kecil» (pengabaian tanpa bukti cukup). Yang ia tulis: «ECE AGE 60+ 0,1208 (n=76) — di atas ambang 0,02; temuan ini MEMBUTUHKAN penyelidikan lanjutan: kumpulkan sampel lebih besar untuk grup ini, periksa bin kalibrasinya, dan bila ECE bertahan di atas 0,02 pada n yang lebih besar, syaratkan mitigasi sebelum deploy». Itulah bedanya validator dengan alarm: validator menulis APA YANG HARUS TERJADI BERIKUTNYA.",
        "Pola yang sama sudah kamu kenal dari M7.2 — aggregation bias: satu angka global, lima cerita berbeda. Di M7.2 ceritanya adalah approval dan AIR per grup; di sini ceritanya adalah kalibrasi per grup. Kelas kesalahannya sama: MEMBACA ANGKA GLOBAL SEBAGAI BUKTI PER GRUP. Dan pola yang sama muncul di langkah 5: ROC-AUC global yang stabil menyembunyikan bad rate yang berayun. Validator memeriksa angka global DAN per grup DAN per belahan — ketiganya, selalu.",
        "Baik atau buruk: pemeriksaan per grup bagus karena ia murah — ECE per grup tidak butuh data baru, hanya pengelompokan ulang data yang sama — dan ia menangkap kegagalan yang tidak terlihat di angka global. Buruk bila dibaca tanpa n: ECE 0,1208 pada n=76 bukan bukti yang sama kuatnya dengan ECE 0,1208 pada n=7.600. Tulis n-nya di samping ECE-nya, selalu — atau jangan laporkan ECE itu.",
        "Mitigasi: ceklis outcomes analysis-mu WAJIB punya tiga kolom — overall, per grup (SEX/EDUCATION/AGE/MARRIAGE), dan per belahan (half A/B) — untuk SETIAP metrik yang kamu laporkan (ROC-AUC, ECE, Brier, approval, bad rate). Bila satu sel kosong, tulis alasannya («n terlalu kecil») — jangan biarkan kosong tanpa penjelasan.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: ECE overall 0,0087 berarti «kalibrasi model bagus»",
        type: "risk",
        body: "Yang benar: 0,0087 adalah ECE RATA-RATA tertimbang — grup besar yang kalibrasinya baik menutupi grup kecil yang kalibrasinya rusak. AGE 60+ ECE 0,1208 [M7.1] dengan n=76 (di bawah gate 200, langkah 8) adalah buktinya. Kalibrasi «bagus» hanya boleh diklaim per grup — dan grup dengan n kecil dilaporkan bersama n-nya, dengan tindak lanjut yang tertulis, bukan diabaikan.",
      },
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: putuskan — lolos dengan catatan, atau tolak?",
      prose: [
        "Sekarang giliranmu menjadi validator. Fakta di mejamu — semuanya dari angka kanonis yang sudah kamu lihat: model GBM, ROC-AUC mentah 0,7823 / terkalibrasi 0,7816, PR-AUC 0,5597 / 0,5558, ECE overall 0,0087; threshold 0,10, approval 28,5%, bad rate 6,67%, biaya NT$33.046.500, profit +NT$8.214.000 [M6.4]; nested CV 0,7858 (sd antar-fold 0,0068) [M6.2]; validation halves: half A ROC-AUC 0,7885 / bad rate 6,14% / ECE 0,0114, half B ROC-AUC 0,7746 / bad rate 7,20% / ECE 0,0104 — selisih B−A: ROC-AUC −0,0139, bad rate +1,06 poin persen; ECE AGE 60+ 0,1208 (n=76) [M7.1]; conceptual soundness lolos (langkah 4); validator independen (langkah 7); monitoring sudah disyaratkan (langkah 6). Band traffic-light [kebijakan lesson ini]: HIJAU bila semua kondisi terpenuhi; KUNING bila satu kondisi dilanggar ringan; MERAH bila ECE ≥ 0,05, |ΔROC| > 0,05, |Δbad rate| > 3,0 poin persen, |Δapproval| > 3,0 poin persen, ROC-AUC < 0,70, atau conceptual soundness gagal. Band ECE berlaku untuk ECE overall dan per half; ECE per grup masuk band hanya bila n ≥ 200 (grup n < 200 = TEMUAN-INVESTIGASI, bukan pemicu band).",
        "Putuskan — dan tulis alasanmu sebelum membaca paragraf berikutnya. Pertanyaan pertama: kondisi MERAH mana yang terpenuhi? ECE tertinggi 0,0114 (half A) — jauh di bawah 0,05. |ΔROC| 0,0139 — jauh di bawah 0,05. |Δbad rate| 1,06 poin persen — jauh di bawah 3,0. ROC-AUC 0,7816 — jauh di atas 0,70. Conceptual soundness lolos. TIDAK SATU PUN kondisi MERAH terpenuhi — jadi TOLAK bukan jawaban yang bisa dipertahankan dari angka ini. Pertanyaan kedua: kondisi HIJAU mana yang dilanggar? Dari lima kondisi numerik, empat lolos; satu dilanggar: |Δbad rate| 1,06 poin persen melewati ambang HIJAU 1,0 — masuk rentang KUNING 1,0–3,0. Ditambah ECE per grup yang masuk band (n ≥ 200): Pascasarjana 0,0210, SMA 0,0362, AGE 50–59 0,0312 — ketiganya di rentang KUNING 0,02–0,05. ECE AGE 60+ 0,1208 (n=76) dan EDUCATION Lainnya 0,0455 (n=82) TIDAK masuk band — n < 200, keduanya TEMUAN-INVESTIGASI. Jawabannya: KUNING — LOLOS DENGAN CATATAN.",
        "Catatan yang menyertai verdict itu — dan ini sama pentingnya dengan verdictnya: (1) pantau bad rate yang disetujui per periode dengan perhatian khusus, karena halves menunjukkan ia berayun 1,06 poin persen bahkan tanpa drift [langkah 6]; (2) selidiki ECE per grup yang masuk band KUNING (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312) DAN temuan-investigasi AGE 60+ 0,1208 (n=76) — kumpulkan sampel lebih besar untuk grup ini sebelum revalidasi, dan laporkan hasilnya [langkah 9]; (3) revalidasi terjadwal 3 bulan setelah deploy, dipercepat bila bad rate melewati ambangnya dua periode berturut-turut. Tiga syarat itu DITULIS di laporan validasi, dengan pemilik dan tanggal — bukan disimpan di kepala validator.",
        "Yang TIDAK boleh dilakukan validator di sini — dan ini bagian dari pelajarannya: (a) MENOLAK karena «bad rate B 7,20% terasa tinggi» — «terasa» bukan ambang; ambang MERAH-nya 3,0 poin persen selisih, dan 1,06 tidak mendekatinya. (b) MEMBERI HIJAU karena «cuma 0,06 di atas ambang» — menggeser ambang sesudah melihat angka adalah berbohong dengan statistik (langkah 8). (c) MENAHAN verdict karena ECE AGE 60+ 0,1208 — temuan itu butuh penyelidikan, bukan penahanan: n=76 di bawah gate 200, jadi ia tidak masuk band dan terlalu kecil untuk vonis, dan menahan deploy atas bukti yang belum cukup sama salahnya dengan mendepoy tanpa syarat atas bukti yang sama. Validator memutuskan dari ATURAN yang ditulis dulu — bukan dari perasaan sesudah melihat angka.",
        "Nilai: mini-case ini bagus karena jawabannya TIDAK ADA di angka mana pun secara sendirian — ia ada di PERBANDINGAN angka dengan ambang yang ditulis dulu. Itulah pekerjaan validator: bukan menghitung (mesin bisa menghitung), melainkan MEMUTUSKAN dari aturan yang bisa diaudit.",
        "Baik atau buruk: keputusan KUNING ini bagus bila syaratnya DIPATUHI dan DIAUDIT di revalidasi — dan buruk bila syaratnya hanya ditulis lalu dilupakan. Verdict tanpa tindak lanjut adalah stempel dengan langkah tambahan. Di revalidasi 3 bulan, validator pertama-tama memeriksa: apakah bad rate dipantau? Apakah ECE AGE 60+ diselidiki? Bila tidak — itu temuan GOVERNANCE, bukan temuan model.",
        "Mitigasi: setiap kali kamu menjadi validator — di pekerjaan, di proyek, di lesson ini — tulis verdictmu dalam SATU KALIMAT: «[HIJAU/KUNING/MERAH] karena [kondisi yang terpenuhi/dilanggar + angkanya], dengan syarat [syarat + pemilik + tanggal]». Bila kalimatmu tidak bisa ditulis, verdictmu belum siap.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «lolos dengan catatan» berarti «modelnya bermasalah»",
        type: "pitfall",
        body: "Yang benar: KUNING berarti model BOLEH DEPLOY dengan syarat yang tertulis — bukan model yang rusak. Model yang divalidasi dengan jujur sering KUNING pada sesuatu: data nyata sering punya satu metrik yang berayun, satu grup kecil yang berisik, atau satu asumsi yang tidak sempurna. HIJAU yang terlalu mudah didapat lebih mencurigakan daripada KUNING yang jujur.",
      },
    },
    {
      id: "issue-register",
      eyebrow: "Langkah 10a · Setelah mini-case",
      title: "Issue register: temuan validasi menjadi tindakan — dengan pemilik dan tanggal",
      prose: [
        "Verdict KUNING di mini-case datang dengan tiga syarat — tapi syarat yang tidak punya pemilik, tanggal, dan bukti penutupan bukanlah syarat: ia catatan yang menunggu dilupakan. ISSUE REGISTER adalah daftar yang mengubah temuan validasi menjadi tindakan yang bisa diaudit: satu baris per temuan, sepuluh kolom — finding_id, severity, evidence (angka + sumber), root_cause, action, owner, due_date, acceptance_test, status, closure_approver. Tanpa satu kolom pun dari sepuluh ini, baris itu belum bisa dikerjakan: tanpa owner tidak ada yang bertanggung jawab; tanpa due_date tidak ada yang terlambat; tanpa acceptance_test tidak ada yang tahu kapan ia selesai; tanpa closure_approver yang menutup adalah orang yang sama dengan yang mengerjakan.",
        "Tiga temuan KUNING lesson ini, ditulis sebagai register. F-01 — severity MEDIUM: selisih bad rate antar-half +1,06 poin persen [m8_canonical.json], CI95 [−1,26; +3,35] [turunan] — tidak konklusif (langkah 5a). Root cause: belum diketahui — bisa noise sampling, bisa pergeseran kecil distribusi skor di sekitar threshold 0,10. Action: pantau bad rate yang disetujui per periode + kumpulkan sampel lebih besar untuk bad rate (langkah 5a). Acceptance test: selisih antar-half periode berikutnya di dalam 1,0 poin persen ATAU CI-nya tidak lagi melintasi nol. F-02 — severity MEDIUM: ECE per grup yang masuk band KUNING — Pascasarjana 0,0210 (n=2.130), SMA 0,0362 (n=1.014), AGE 50–59 0,0312 (n=473) [M7.1]. Action: selidiki bin kalibrasi ketiga grup + periksa apakah threshold per grup (M7.4) relevan. Acceptance test: ECE ketiga grup di bawah 0,02 pada revalidasi. F-03 — severity INVESTIGATE: ECE AGE 60+ 0,1208 (n=76) [M7.1], CI95 [0,0839; 0,2225] [turunan] — seluruh interval di atas 0,05, tapi n di bawah gate 200. Action: kumpulkan sampel lebih besar untuk grup ini SEBELUM revalidasi + periksa bin kalibrasinya. Acceptance test: ECE grup ini dihitung ulang pada n ≥ 200 — berapa pun hasilnya, ia baru bisa dinilai. Pemilik dan tanggal tiap temuan [ilustrasi] — diisi komite saat verdict ditandatangani (M8.5), bukan oleh validator sendirian.",
        "Aturan penutupan (closure) — dan ini yang membedakan register dari daftar keinginan: temuan dinyatakan CLOSED hanya bila acceptance_test LULUS dan closure_approver (bukan owner yang mengerjakan) menandatangani. «Action sudah dilakukan» bukan penutupan — action yang dilakukan tanpa acceptance test yang lulus adalah pekerjaan yang belum terbukti. Dan satu aturan yang mengikat verdict: persetujuan KUNING tetap berlaku selama temuannya TERBUKA selama due_date belum lewat; temuan yang MELEWATI due_date tanpa perpanjangan tertulis dari komite adalah pemicu revalidasi (M8.5, langkah 7) — approval-nya dibekukan sampai temuan itu ditutup atau diperpanjang. Itulah yang membuat KUNING berbeda dari «lolos dengan catatan yang dilupakan»: catatannya punya tanggal, dan tanggal itu punya konsekuensi.",
        "Nilai: issue register bagus karena ia adalah JEMBATAN antara verdict dan revalidasi — validator di revalidasi 3 bulan tidak perlu menebak apa yang dijanjikan: ia membuka register, memeriksa tiga baris, dan bertanya «yang ini sudah ditutup? buktinya mana?». Tanpa register, revalidasi memulai dari nol — dan temuan lama yang tidak ditindaklanjuti tidak pernah ketahuan.",
        "Baik atau buruk: register bagus bila sepuluh kolomnya terisi SEMUA — baris dengan kolom kosong adalah baris yang belum bisa dikerjakan. Buruk bila severity ditulis dari perasaan («kayaknya medium») — severity ditulis dari ANGKA: berapa jauh dari ambang, dan berapa besar uang yang dipertaruhkan. Buruk juga bila closure_approver adalah owner sendiri — itu seperti siswa yang menilai ujiannya sendiri.",
        "Mitigasi: jadikan register ini LAMPIRAN WAJIB laporan validasi — verdict KUNING tanpa register adalah verdict yang belum selesai ditulis. Dan di revalidasi, baris pertama yang diperiksa adalah register lama: temuan yang masih terbuka dari validasi sebelumnya adalah temuan pertama di laporan baru.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 11 · Lab 1",
      title: "Lab: selisih validation halves — hitung, jangan tebak",
      prose: [
        "Sekarang hitung sendiri selisih antar-half dari angka kanonis [m8_canonical.json]. Half A (n=3.000): ROC-AUC 0,7885, PR-AUC 0,5656, approval 28,77%, bad rate 6,14%, ECE 0,0114, Brier 0,1329. Half B (n=3.000): ROC-AUC 0,7746, PR-AUC 0,5480, approval 28,23%, bad rate 7,20%, ECE 0,0104, Brier 0,1361. Semua metrik memakai model keputusan GBM terkalibrasi, threshold 0,10.",
        "Hasil yang diharapkan [lab]: roc_diff=-0.0139; pr_diff=-0.0176; approval_diff_pp=-0.54; bad_rate_diff_pp=1.06; ece_diff=-0.0010; brier_diff=0.0032; kuning_bad_rate=True. Perhatikan baris terakhir: |selisih bad rate| 1,06 poin persen melewati ambang HIJAU 1,0 poin persen [kebijakan lesson ini] — SATU-SATUNYA pemicu KUNING pada model ini. Selisih lain semuanya di dalam ambang HIJAU: |roc_diff| 0,0139 ≤ 0,02; |approval_diff_pp| 0,54 ≤ 1,0; |ece_diff| 0,0010 — kalibrasi stabil di kedua belahan.",
        "Setelah lab jalan, bandingkan dengan langkah 5: selisih ROC-AUC −0,0139 — bandingkan dengan galat sampling selisih (≈0,011–0,013; sd ROC-AUC per half n=3.000 ≈ 0,008–0,009), bukan dengan sd antar-fold nested CV 0,0068 [M6.2] — wajar untuk n=3.000 per belahan. Dan ingat: selisih ini dihitung dari DUA belahan data yang sama — ia mengukur NOISE, bukan kualitas model. Validator yang membaca «B lebih buruk dari A» sebagai «model memburuk» sedang membaca noise sebagai sinyal.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi roc_diff dan pr_diff: half B dikurangi half A" },
        { id: "t2", text: "Lengkapi approval_diff_pp dan bad_rate_diff_pp: selisih dalam poin persen (× 100)" },
        { id: "t3", text: "Lengkapi ece_diff dan brier_diff, lalu kuning_bad_rate: True bila |bad_rate_diff_pp| > 1,0" },
      ],
      expected: "roc_diff=-0.0139\npr_diff=-0.0176\napproval_diff_pp=-0.54\nbad_rate_diff_pp=1.06\nece_diff=-0.0010\nbrier_diff=0.0032\nkuning_bad_rate=True",
      hints: [
        "roc_diff = 0,7746 − 0,7885 = −0,0139; pr_diff = 0,5480 − 0,5656 = −0,0176 — keduanya negatif: half B sedikit lebih buruk dari half A.",
        "Selisih dalam poin persen = selisih fraksi × 100: bad rate (0,0720 − 0,0614) × 100 = +1,06; approval (0,2823 − 0,2877) × 100 = −0,54.",
        "ece_diff = 0,0104 − 0,0114 = −0,0010; brier_diff = 0,1361 − 0,1329 = +0,0032. kuning_bad_rate = abs(1,06) > 1,0 → True — pemicu KUNING pertama (pemicu lainnya: ECE per grup yang masuk band — lihat langkah 9).",
      ],
      code: {
        starter: `# Lab 1 — selisih validation halves A vs B [m8_canonical.json]
# Test 6.000 dibelah stratified: half A / half B (n=3.000, seed 42).
# Model keputusan: GBM terkalibrasi (Platt/sigmoid), threshold 0,10.
HALF_A = {"roc_auc": 0.7885, "pr_auc": 0.5656, "approval": 0.2877,
          "bad_rate": 0.0614, "ece": 0.0114, "brier": 0.1329}
HALF_B = {"roc_auc": 0.7746, "pr_auc": 0.5480, "approval": 0.2823,
          "bad_rate": 0.0720, "ece": 0.0104, "brier": 0.1361}

roc_diff = 0.0  # TODO: HALF_B["roc_auc"] - HALF_A["roc_auc"]
pr_diff = 0.0  # TODO: HALF_B["pr_auc"] - HALF_A["pr_auc"]
approval_diff_pp = 0.0  # TODO: (HALF_B["approval"] - HALF_A["approval"]) * 100
bad_rate_diff_pp = 0.0  # TODO: (HALF_B["bad_rate"] - HALF_A["bad_rate"]) * 100
ece_diff = 0.0  # TODO: HALF_B["ece"] - HALF_A["ece"]
brier_diff = 0.0  # TODO: HALF_B["brier"] - HALF_A["brier"]
kuning_bad_rate = None  # TODO: True bila abs(bad_rate_diff_pp) > 1,0
print(f"roc_diff={roc_diff:.4f}")
print(f"pr_diff={pr_diff:.4f}")
print(f"approval_diff_pp={approval_diff_pp:.2f}")
print(f"bad_rate_diff_pp={bad_rate_diff_pp:.2f}")
print(f"ece_diff={ece_diff:.4f}")
print(f"brier_diff={brier_diff:.4f}")
print(f"kuning_bad_rate={kuning_bad_rate}")`,
        lockLines: 8,
        solution: `# Lab 1 — selisih validation halves A vs B [m8_canonical.json]
# Test 6.000 dibelah stratified: half A / half B (n=3.000, seed 42).
# Model keputusan: GBM terkalibrasi (Platt/sigmoid), threshold 0,10.
HALF_A = {"roc_auc": 0.7885, "pr_auc": 0.5656, "approval": 0.2877,
          "bad_rate": 0.0614, "ece": 0.0114, "brier": 0.1329}
HALF_B = {"roc_auc": 0.7746, "pr_auc": 0.5480, "approval": 0.2823,
          "bad_rate": 0.0720, "ece": 0.0104, "brier": 0.1361}

roc_diff = HALF_B["roc_auc"] - HALF_A["roc_auc"]
pr_diff = HALF_B["pr_auc"] - HALF_A["pr_auc"]
approval_diff_pp = (HALF_B["approval"] - HALF_A["approval"]) * 100
bad_rate_diff_pp = (HALF_B["bad_rate"] - HALF_A["bad_rate"]) * 100
ece_diff = HALF_B["ece"] - HALF_A["ece"]
brier_diff = HALF_B["brier"] - HALF_A["brier"]
kuning_bad_rate = abs(bad_rate_diff_pp) > 1.0
print(f"roc_diff={roc_diff:.4f}")
print(f"pr_diff={pr_diff:.4f}")
print(f"approval_diff_pp={approval_diff_pp:.2f}")
print(f"bad_rate_diff_pp={bad_rate_diff_pp:.2f}")
print(f"ece_diff={ece_diff:.4f}")
print(f"brier_diff={brier_diff:.4f}")
print(f"kuning_bad_rate={kuning_bad_rate}")`,
        checks: [
          { kind: "equal", task: "t1", name: "roc_diff", value: -0.0139, tol: 0.00005, label: "`roc_diff` seharusnya -0.0139", msg: "Half B ROC-AUC 0,7746 − half A 0,7885 = −0,0139 — di dalam ambang HIJAU 0,02." },
          { kind: "equal", task: "t1", name: "pr_diff", value: -0.0176, tol: 0.00005, label: "`pr_diff` seharusnya -0.0176", msg: "Half B PR-AUC 0,5480 − half A 0,5656 = −0,0176." },
          { kind: "equal", task: "t2", name: "approval_diff_pp", value: -0.54, tol: 0.01, label: "`approval_diff_pp` seharusnya -0.54", msg: "Approval 28,23% − 28,77% = −0,54 poin persen — di dalam ambang HIJAU 1,0." },
          { kind: "equal", task: "t2", name: "bad_rate_diff_pp", value: 1.06, tol: 0.01, label: "`bad_rate_diff_pp` seharusnya 1.06", msg: "Bad rate 7,20% − 6,14% = +1,06 poin persen — melewati ambang HIJAU 1,0; pemicu KUNING pertama (lihat langkah 9 untuk pemicu ECE per grup)." },
          { kind: "equal", task: "t3", name: "ece_diff", value: -0.001, tol: 0.00005, label: "`ece_diff` seharusnya -0.0010", msg: "ECE 0,0104 − 0,0114 = −0,0010 — kalibrasi stabil di kedua belahan." },
          { kind: "equal", task: "t3", name: "brier_diff", value: 0.0032, tol: 0.00005, label: "`brier_diff` seharusnya 0.0032", msg: "Brier 0,1361 − 0,1329 = +0,0032 — kecil." },
          { kind: "stdout_matches", task: "t3", pattern: "kuning_bad_rate=True", label: "Output menampilkan kuning_bad_rate=True", msg: "|1,06| > 1,0 — bad rate adalah satu-satunya metrik yang memicu KUNING pada model ini." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 12 · Lab 2",
      title: "Lab: outcomes analysis — ECE per half dan band traffic-light",
      prose: [
        "Lab kedua menerapkan band ECE dan traffic-light langkah 8 pada angka kanonis. ECE per half [m8_canonical.json]: half A 0,0114, half B 0,0104; ECE overall test 0,0087. Ambang ECE [kebijakan lesson ini]: lolos bila ECE < 0,02; catatan (KUNING) bila 0,02–0,05; tolak (MERAH) bila ≥ 0,05. Band traffic-light memakai hasil lab 1: |ΔROC| 0,0139, |Δbad rate| 1,06 poin persen, ROC-AUC test (GBM terkalibrasi) 0,7816. Band ECE berlaku untuk ECE overall dan per half; ECE per grup masuk band hanya bila n ≥ 200 (langkah 8) — lab ini tidak menghitung ECE per grup. Lab ini juga hanya mengevaluasi empat dari lima kondisi traffic-light (|ΔROC|, |Δbad rate|, ROC-AUC test, ECE); kondisi kelima, |Δapproval| (0,54 poin persen, di bawah 1,0 — HIJAU), sudah dihitung di lab 1 dan tidak diulang di sini.",
        "Hasil yang diharapkan [lab]: ece_max=0.0114; ece_spread=0.0010; ece_lolos_A=True; ece_lolos_B=True; ece_lolos_overall=True; band=KUNING. Bacalah baris terakhir dengan saksama: SEMUA ECE lolos (maksimum 0,0114, jauh di bawah 0,02) — kalibrasi BUKAN masalah model ini. Band KUNING datang dari |Δbad rate| 1,06 poin persen — untuk angka-angka yang dihitung lab ini. Ingat: verdict KUNING model ini punya pemicu kedua di luar lab ini — ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312; semuanya n ≥ 200) — dan satu temuan-investigasi (ECE AGE 60+ 0,1208, n=76) yang tidak masuk band. Itulah gunanya memisahkan verdict per metrik: kamu tahu persis APA yang membuat model KUNING, dan syarat apa yang harus ditulis untuknya — pantau bad rate DAN kalibrasi ketiga grup itu, bukan hanya bad rate.",
        "Setelah lab jalan, tanyakan pada dirimu: bila ECE half B adalah 0,0210 (bukan 0,0104), apa yang berubah? ece_lolos_B menjadi False — dan band tetap KUNING (ECE 0,0210 masuk rentang KUNING 0,02–0,05), tapi kini dengan DUA catatan: bad rate DAN kalibrasi half B. Band yang sama, syarat yang berbeda — itulah kenapa verdict selalu ditulis bersama alasannya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi ece_max dan ece_spread: maksimum dan selisih ECE kedua half" },
        { id: "t2", text: "Lengkapi ece_lolos_A, ece_lolos_B, ece_lolos_overall: True bila ECE < 0,02" },
        { id: "t3", text: "Lengkapi band: HIJAU / KUNING / MERAH dari aturan langkah 8" },
      ],
      expected: "ece_max=0.0114\nece_spread=0.0010\nece_lolos_A=True\nece_lolos_B=True\nece_lolos_overall=True\nband=KUNING",
      hints: [
        "ece_max = max(0,0114, 0,0104) = 0,0114; ece_spread = |0,0114 − 0,0104| = 0,0010 — kalibrasi stabil antar-half.",
        "Ketiga ECE (0,0114; 0,0104; 0,0087) semuanya di bawah 0,02 — jadi ketiganya True.",
        "MERAH bila ECE (overall/per half, atau per grup n ≥ 200) ≥ 0,05 ATAU |ΔROC| > 0,05 ATAU |Δbad rate| > 3,0 ATAU |Δapproval| > 3,0 ATAU ROC test < 0,70 — tidak satu pun terpenuhi. KUNING bila |Δbad rate| > 1,0 — 1,06 > 1,0, jadi band = KUNING.",
      ],
      code: {
        starter: `# Lab 2 — outcomes analysis: ECE per half + band traffic-light
# ECE kanonis: half A 0,0114; half B 0,0104 [m8_canonical.json]; overall 0,0087 [M6.4]
# Ambang ECE [kebijakan lesson ini]: lolos < 0,02; KUNING 0,02-0,05; MERAH >= 0,05
ECE_A = 0.0114
ECE_B = 0.0104
ECE_OVERALL = 0.0087
# Hasil lab 1: |selisih ROC-AUC| 0,0139; |selisih bad rate| 1,06 pp; ROC test 0,7816
ROC_DIFF_ABS = 0.0139
BAD_RATE_DIFF_PP_ABS = 1.06
ROC_TEST = 0.7816

ece_max = 0.0  # TODO: max(ECE_A, ECE_B)
ece_spread = 0.0  # TODO: abs(ECE_A - ECE_B)
ece_lolos_A = None  # TODO: ECE_A < 0,02
ece_lolos_B = None  # TODO: ECE_B < 0,02
ece_lolos_overall = None  # TODO: ECE_OVERALL < 0,02
# TODO: band dari aturan langkah 8 (MERAH bila ECE >= 0,05 atau |dROC| > 0,05
#   atau |dBad| > 3,0 atau ROC_TEST < 0,70; KUNING bila |dBad| > 1,0 atau
#   |dROC| > 0,02 atau ECE >= 0,02 atau ROC_TEST < 0,75; selain itu HIJAU)
band = ""
print(f"ece_max={ece_max:.4f}")
print(f"ece_spread={ece_spread:.4f}")
print(f"ece_lolos_A={ece_lolos_A}")
print(f"ece_lolos_B={ece_lolos_B}")
print(f"ece_lolos_overall={ece_lolos_overall}")
print(f"band={band}")`,
        lockLines: 11,
        solution: `# Lab 2 — outcomes analysis: ECE per half + band traffic-light
# ECE kanonis: half A 0,0114; half B 0,0104 [m8_canonical.json]; overall 0,0087 [M6.4]
# Ambang ECE [kebijakan lesson ini]: lolos < 0,02; KUNING 0,02-0,05; MERAH >= 0,05
ECE_A = 0.0114
ECE_B = 0.0104
ECE_OVERALL = 0.0087
# Hasil lab 1: |selisih ROC-AUC| 0,0139; |selisih bad rate| 1,06 pp; ROC test 0,7816
ROC_DIFF_ABS = 0.0139
BAD_RATE_DIFF_PP_ABS = 1.06
ROC_TEST = 0.7816

ece_max = max(ECE_A, ECE_B)
ece_spread = abs(ECE_A - ECE_B)
ece_lolos_A = ECE_A < 0.02
ece_lolos_B = ECE_B < 0.02
ece_lolos_overall = ECE_OVERALL < 0.02
merah = (ece_max >= 0.05 or ROC_DIFF_ABS > 0.05
         or BAD_RATE_DIFF_PP_ABS > 3.0 or ROC_TEST < 0.70)
kuning = (ece_max >= 0.02 or ROC_DIFF_ABS > 0.02
          or BAD_RATE_DIFF_PP_ABS > 1.0 or ROC_TEST < 0.75)
band = "MERAH" if merah else ("KUNING" if kuning else "HIJAU")
print(f"ece_max={ece_max:.4f}")
print(f"ece_spread={ece_spread:.4f}")
print(f"ece_lolos_A={ece_lolos_A}")
print(f"ece_lolos_B={ece_lolos_B}")
print(f"ece_lolos_overall={ece_lolos_overall}")
print(f"band={band}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ece_max", value: 0.0114, tol: 0.00005, label: "`ece_max` seharusnya 0.0114", msg: "ECE maksimum antar-half: max(0,0114, 0,0104) = 0,0114 — jauh di bawah ambang lolos 0,02." },
          { kind: "equal", task: "t1", name: "ece_spread", value: 0.001, tol: 0.00005, label: "`ece_spread` seharusnya 0.0010", msg: "Selisih ECE antar-half: |0,0114 − 0,0104| = 0,0010 — kalibrasi stabil di kedua belahan." },
          { kind: "stdout_matches", task: "t2", pattern: "ece_lolos_A=True", label: "Output menampilkan ece_lolos_A=True", msg: "ECE half A 0,0114 < 0,02 — lolos." },
          { kind: "stdout_matches", task: "t2", pattern: "ece_lolos_B=True", label: "Output menampilkan ece_lolos_B=True", msg: "ECE half B 0,0104 < 0,02 — lolos." },
          { kind: "stdout_matches", task: "t2", pattern: "ece_lolos_overall=True", label: "Output menampilkan ece_lolos_overall=True", msg: "ECE overall 0,0087 < 0,02 — lolos. Kalibrasi bukan masalah model ini." },
          { kind: "stdout_matches", task: "t3", pattern: "band=KUNING", label: "Output menampilkan band=KUNING", msg: "Tidak ada kondisi MERAH; satu kondisi KUNING terpenuhi (|Δbad rate| 1,06 > 1,0) — verdict KUNING, lolos dengan catatan." },
        ],
      },
    },
    {
      id: "lab3",
      eyebrow: "Langkah 12a · Lab 3",
      title: "Lab: issue register — temuan KUNING menjadi baris yang bisa ditutup",
      prose: [
        "Lab ketiga membangun issue register untuk tiga temuan KUNING lesson ini (langkah 10a) dan menerapkan aturan penutupannya dengan mesin. Tiga temuan — F-01 selisih bad rate antar-half +1,06 poin persen (CI95 [−1,26; +3,35] [turunan]); F-02 ECE tiga grup yang masuk band KUNING (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312 [M7.1]); F-03 ECE AGE 60+ 0,1208 (n=76, CI95 [0,0839; 0,2225] [turunan]) — masing-masing dengan sepuluh kolom: finding_id, severity, evidence, root_cause, action, owner, due_date, acceptance_test, status, closure_approver. Tanggal memakai «hari ini» [ilustrasi] 2026-11-13: F-01 jatuh tempo 30 hari lagi (2026-12-13), F-02 jatuh tempo 60 hari lagi (2027-01-12), F-03 jatuh tempo 90 hari lagi (2027-02-11) — semuanya di masa depan, jadi tidak ada yang overdue pada tanggal ini.",
        "Hasil yang diharapkan [lab]: fields_per_finding=10; missing_fields=[]; n_open=3; n_overdue=0; approval_valid=True. Lalu skenario kedua — pindahkan due_date F-01 ke 2026-11-01 (sudah lewat) TANPA perpanjangan tertulis: n_overdue menjadi 1 dan approval_valid menjadi False — persetujuan KUNING dibekukan sampai temuan itu ditutup atau diperpanjang komite. Itulah aturan yang diajarkan langkah 10a: due_date punya konsekuensi, dan konsekuensinya bisa dihitung.",
        "Setelah lab jalan, tanyakan pada dirimu: temuan mana yang paling berbahaya bila due_date-nya dilewati tanpa kabar? F-03 — karena ECE-nya paling besar (0,1208) dan CI-nya seluruhnya di atas 0,05: temuan yang buktinya paling kuat adalah temuan yang paling berbahaya bila dilupakan. Register tidak menilai «temuan mana yang paling menakutkan» — ia menilai «temuan mana yang paling lama terbuka».",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fields_per_finding dan missing_fields: tiap temuan harus punya 10 kolom" },
        { id: "t2", text: "Lengkapi n_open dan n_overdue dari status dan due_date vs TODAY [ilustrasi]" },
        { id: "t3", text: "Lengkapi approval_valid, lalu skenario overdue: pindahkan due_date F-01 ke masa lalu dan hitung ulang" },
      ],
      expected: "fields_per_finding=10\nmissing=[]\nall_required=True\nn_open=3\nn_overdue=0\napproval_valid=True\nn_overdue_scenario=1\napproval_valid_scenario=False",
      hints: [
        "Sepuluh kolom register (langkah 10a): finding_id, severity, evidence, root_cause, action, owner, due_date, acceptance_test, status, closure_approver — hitung len() tiap dict temuan.",
        "n_open = temuan dengan status 'open' (ketiganya open); n_overdue = temuan open yang due_date-nya < TODAY (2026-11-13) — ketiganya jatuh tempo sesudah hari ini, jadi 0.",
        "approval_valid = n_overdue == 0 (dan semua temuan punya owner + due_date + acceptance_test). Skenario: ubah due_date F-01 menjadi '2026-11-01' — n_overdue_scenario = 1, approval_valid_scenario = False.",
      ],
      code: {
        starter: `# Lab 3 — issue register: tiga temuan KUNING lesson ini (langkah 10a)
# Tanggal "hari ini" [ilustrasi] 2026-11-13 — due_date ditulis sebagai string ISO
# Aturan penutupan: temuan CLOSED hanya bila acceptance_test lulus DAN
# closure_approver menandatangani; approval KUNING berlaku selama tidak ada
# temuan yang overdue tanpa perpanjangan tertulis dari komite.
TODAY = "2026-11-13"
COLUMNS = ["finding_id", "severity", "evidence", "root_cause", "action",
           "owner", "due_date", "acceptance_test", "status", "closure_approver"]

findings = [
    {"finding_id": "F-01", "severity": "MEDIUM",
     "evidence": "selisih bad rate antar-half +1,06 pp, CI95 [-1,26; +3,35] [turunan]",
     "root_cause": "belum diketahui — noise sampling atau pergeseran distribusi skor di sekitar 0,10",
     "action": "pantau bad rate per periode + kumpulkan sampel lebih besar",
     "owner": "[ilustrasi] Risk Analyst", "due_date": "2026-12-13",
     "acceptance_test": "selisih antar-half periode berikut <= 1,0 pp ATAU CI tidak lagi melintasi 0",
     "status": "open", "closure_approver": "[ilustrasi] Validator Independen"},
    {"finding_id": "F-02", "severity": "MEDIUM",
     "evidence": "ECE Pascasarjana 0,0210; SMA 0,0362; AGE 50-59 0,0312 [M7.1]",
     "root_cause": "kalibrasi per grup di atas 0,02 pada tiga grup n >= 200",
     "action": "selidiki bin kalibrasi ketiga grup + periksa relevansi threshold per grup [M7.4]",
     "owner": "[ilustrasi] Model Owner", "due_date": "2027-01-12",
     "acceptance_test": "ECE ketiga grup < 0,02 pada revalidasi",
     "status": "open", "closure_approver": "[ilustrasi] Validator Independen"},
    {"finding_id": "F-03", "severity": "INVESTIGATE",
     "evidence": "ECE AGE 60+ 0,1208 (n=76), CI95 [0,0839; 0,2225] [turunan]",
     "root_cause": "kalibrasi grup kecil rusak — penyebab belum diketahui",
     "action": "kumpulkan sampel lebih besar untuk AGE 60+ SEBELUM revalidasi + periksa bin kalibrasi",
     "owner": "[ilustrasi] Validator Independen", "due_date": "2027-02-11",
     "acceptance_test": "ECE grup ini dihitung ulang pada n >= 200",
     "status": "open", "closure_approver": "[ilustrasi] Ketua Komite Risiko"},
]

fields_per_finding = 0  # TODO: len() tiap dict temuan — harus 10
missing_fields = []  # TODO: kolom COLUMNS yang hilang dari satu temuan pun (daftar kosong bila lengkap)
all_required = False  # TODO: True bila missing_fields kosong
n_open = 0  # TODO: temuan dengan status "open"
n_overdue = 0  # TODO: temuan open yang due_date-nya < TODAY (bandingkan string ISO — urutan leksikal = urutan tanggal)
approval_valid = False  # TODO: True bila n_overdue == 0 DAN semua temuan punya owner + due_date + acceptance_test
# Skenario: F-01 lewat due_date tanpa perpanjangan tertulis
scenario = [dict(f) for f in findings]
scenario[0]["due_date"] = "2026-11-01"
n_overdue_scenario = 0  # TODO: temuan open yang due_date-nya < TODAY pada skenario
approval_valid_scenario = True  # TODO: False bila n_overdue_scenario > 0
print(f"fields_per_finding={fields_per_finding}")
print(f"missing={missing_fields}")
print(f"all_required={all_required}")
print(f"n_open={n_open}")
print(f"n_overdue={n_overdue}")
print(f"approval_valid={approval_valid}")
print(f"n_overdue_scenario={n_overdue_scenario}")
print(f"approval_valid_scenario={approval_valid_scenario}")`,
        lockLines: 36,
        solution: `# Lab 3 — issue register: tiga temuan KUNING lesson ini (langkah 10a)
# Tanggal "hari ini" [ilustrasi] 2026-11-13 — due_date ditulis sebagai string ISO
# Aturan penutupan: temuan CLOSED hanya bila acceptance_test lulus DAN
# closure_approver menandatangani; approval KUNING berlaku selama tidak ada
# temuan yang overdue tanpa perpanjangan tertulis dari komite.
TODAY = "2026-11-13"
COLUMNS = ["finding_id", "severity", "evidence", "root_cause", "action",
           "owner", "due_date", "acceptance_test", "status", "closure_approver"]

findings = [
    {"finding_id": "F-01", "severity": "MEDIUM",
     "evidence": "selisih bad rate antar-half +1,06 pp, CI95 [-1,26; +3,35] [turunan]",
     "root_cause": "belum diketahui — noise sampling atau pergeseran distribusi skor di sekitar 0,10",
     "action": "pantau bad rate per periode + kumpulkan sampel lebih besar",
     "owner": "[ilustrasi] Risk Analyst", "due_date": "2026-12-13",
     "acceptance_test": "selisih antar-half periode berikut <= 1,0 pp ATAU CI tidak lagi melintasi 0",
     "status": "open", "closure_approver": "[ilustrasi] Validator Independen"},
    {"finding_id": "F-02", "severity": "MEDIUM",
     "evidence": "ECE Pascasarjana 0,0210; SMA 0,0362; AGE 50-59 0,0312 [M7.1]",
     "root_cause": "kalibrasi per grup di atas 0,02 pada tiga grup n >= 200",
     "action": "selidiki bin kalibrasi ketiga grup + periksa relevansi threshold per grup [M7.4]",
     "owner": "[ilustrasi] Model Owner", "due_date": "2027-01-12",
     "acceptance_test": "ECE ketiga grup < 0,02 pada revalidasi",
     "status": "open", "closure_approver": "[ilustrasi] Validator Independen"},
    {"finding_id": "F-03", "severity": "INVESTIGATE",
     "evidence": "ECE AGE 60+ 0,1208 (n=76), CI95 [0,0839; 0,2225] [turunan]",
     "root_cause": "kalibrasi grup kecil rusak — penyebab belum diketahui",
     "action": "kumpulkan sampel lebih besar untuk AGE 60+ SEBELUM revalidasi + periksa bin kalibrasi",
     "owner": "[ilustrasi] Validator Independen", "due_date": "2027-02-11",
     "acceptance_test": "ECE grup ini dihitung ulang pada n >= 200",
     "status": "open", "closure_approver": "[ilustrasi] Ketua Komite Risiko"},
]

fields_per_finding = min(len(f) for f in findings)
missing_fields = [c for c in COLUMNS if any(c not in f or not str(f[c]).strip() for f in findings)]
all_required = len(missing_fields) == 0
n_open = sum(1 for f in findings if f["status"] == "open")
n_overdue = sum(1 for f in findings if f["status"] == "open" and f["due_date"] < TODAY)
approval_valid = (n_overdue == 0 and all(
    f["owner"] and f["due_date"] and f["acceptance_test"] for f in findings))
# Skenario: F-01 lewat due_date tanpa perpanjangan tertulis
scenario = [dict(f) for f in findings]
scenario[0]["due_date"] = "2026-11-01"
n_overdue_scenario = sum(1 for f in scenario if f["status"] == "open" and f["due_date"] < TODAY)
approval_valid_scenario = n_overdue_scenario == 0
print(f"fields_per_finding={fields_per_finding}")
print(f"missing={missing_fields}")
print(f"all_required={all_required}")
print(f"n_open={n_open}")
print(f"n_overdue={n_overdue}")
print(f"approval_valid={approval_valid}")
print(f"n_overdue_scenario={n_overdue_scenario}")
print(f"approval_valid_scenario={approval_valid_scenario}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fields_per_finding", value: 10, tol: 0.5, label: "`fields_per_finding` seharusnya 10", msg: "Setiap temuan punya tepat 10 kolom register — satu kolom hilang berarti baris itu belum bisa dikerjakan." },
          { kind: "stdout_matches", task: "t1", pattern: "missing=\\[\\]", label: "Output menampilkan missing=[]", msg: "Semua 10 kolom ada dan tidak kosong di ketiga temuan — register lengkap." },
          { kind: "stdout_matches", task: "t1", pattern: "all_required=True", label: "Output menampilkan all_required=True", msg: "Register lolos validasi kelengkapan — seperti kartu G10, kelengkapan diperiksa mesin, bukan mata." },
          { kind: "equal", task: "t2", name: "n_open", value: 3, tol: 0.5, label: "`n_open` seharusnya 3", msg: "Ketiga temuan KUNING masih open — verdict KUNING berarti deploy dengan tiga temuan yang masih hidup." },
          { kind: "equal", task: "t2", name: "n_overdue", value: 0, tol: 0.5, label: "`n_overdue` seharusnya 0", msg: "Tidak ada temuan yang lewat due_date pada 2026-11-13 — ketiganya jatuh tempo 30/60/90 hari lagi." },
          { kind: "stdout_matches", task: "t2", pattern: "approval_valid=True", label: "Output menampilkan approval_valid=True", msg: "Persetujuan KUNING berlaku: tidak ada temuan overdue dan semua temuan punya owner, due_date, dan acceptance_test." },
          { kind: "equal", task: "t3", name: "n_overdue_scenario", value: 1, tol: 0.5, label: "`n_overdue_scenario` seharusnya 1", msg: "Skenario: F-01 jatuh tempo 2026-11-01 (sudah lewat) tanpa perpanjangan — satu temuan overdue." },
          { kind: "stdout_matches", task: "t3", pattern: "approval_valid_scenario=False", label: "Output menampilkan approval_valid_scenario=False", msg: "Satu temuan overdue tanpa perpanjangan tertulis = approval KUNING dibekukan sampai temuan itu ditutup atau diperpanjang komite — due_date punya konsekuensi." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: skor test adalah bukti — validasi yang memutuskan",
      prose: [
        "Rangkuman: SR 11-7 (Federal Reserve) / OCC 2011-12 (2011) mendefinisikan model risk sebagai potensi konsekuensi merugikan (finansial maupun non-finansial) dari keputusan berbasis output model yang salah atau disalahgunakan, dan menahannya dengan tiga pilar — (1) development, implementation, and use; (2) validation; (3) governance. Three lines of defense membagi kerja: lini 1 pemilik model & bisnis (membangun, memakai, memonitor), lini 2 validasi independen & risk (menguji, memberi verdict), lini 3 audit internal (memeriksa lini 1 & 2) — lini 1–2 melapor ke dewan/komite risiko, lini 3 melapor ke komite audit; lini 2 tidak pernah melapor ke lini 1. Conceptual soundness: LR mengasumsikan linearitas log-odds, GBM non-parametrik — GBM mentah 0,7823 mengalahkan LR 0,7426, tapi gap train-test 0,0646 (train 0,8469) adalah harga fleksibilitasnya; pengendalinya nested CV 0,7858 (sd antar-fold 0,0068) [M6.2]. Kalibrasi Platt dipakai karena threshold 0,10 diturunkan dari biaya [M6.4] dan butuh probabilitas yang jujur. Outcomes analysis: validation halves (test 6.000 → A/B n=3.000, seed 42) — A: ROC-AUC 0,7885, PR-AUC 0,5656, approval 28,77%, bad rate 6,14%, ECE 0,0114, Brier 0,1329; B: ROC-AUC 0,7746, PR-AUC 0,5480, approval 28,23%, bad rate 7,20%, ECE 0,0104, Brier 0,1361; selisih B−A: ROC-AUC −0,0139, PR-AUC −0,0176, approval −0,54 pp, bad rate +1,06 pp, ECE −0,0010, Brier +0,0032, base rate −0,03 pp. Ranking invarian ≠ approval invarian: ROC-AUC hampir sama, keputusan uangnya berayun. Ongoing monitoring: rujuk M7.5 (PSI skor 0,0017, ambang 0,1/0,25; baseline test 0,7816/0,5558/0,0087/6,67%) — validator menulis SYARAT monitoring, bukan yang memantau. Independensi: validator tidak membangun model, tidak dinilai pemilik model, dan bisa menahan deploy — tanpanya validasi menjadi stempel. Traffic-light [kebijakan lesson ini]: HIJAU (ROC ≥ 0,75; ECE < 0,02; |ΔROC| ≤ 0,02; |Δbad rate| ≤ 1,0 pp; |Δapproval| ≤ 1,0 pp); KUNING (pelanggaran ringan: ECE 0,02–0,05; |ΔROC| 0,02–0,05; |Δbad rate| 1,0–3,0 pp; |Δapproval| 1,0–3,0 pp; ROC 0,70–0,75); MERAH (ECE ≥ 0,05; |ΔROC| > 0,05; |Δbad rate| > 3,0 pp; |Δapproval| > 3,0 pp; ROC < 0,70; conceptual soundness gagal). Band ECE berlaku untuk overall dan per half; per grup masuk band hanya bila n ≥ 200. Verdict model ini: KUNING — pemicu |Δbad rate| 1,06 pp (0,06 pp di atas ambang) DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312), dengan syarat pantau bad rate + selidiki ECE ketiga grup itu dan temuan-investigasi AGE 60+ + revalidasi 3 bulan. Jebakan: validator yang hanya cek akurasi — ECE overall 0,0087 menyembunyikan ECE AGE 60+ 0,1208 (n=76, di bawah gate 200 — tidak masuk band) [M7.1]; temuan itu butuh penyelidikan, bukan vonis dan bukan pengabaian. Lab: selisih halves (roc_diff −0,0139, bad_rate_diff_pp +1,06, kuning_bad_rate True); ECE per half lolos semua (maks 0,0114) dan band KUNING. Kuantifikasi ketidakpastian [turunan]: bad rate 6,67% CI95 [5,47%; 7,85%]; ECE 0,0087 CI95 [0,0077; 0,0214] (melintasi 0,02); profit +NT$8.214.000 CI95 [NT$5.575.975; NT$10.802.787]; selisih bad rate antar-half +1,06 pp CI95 [−1,26; +3,35] — melintasi nol, jadi verdict KUNING ditandai «tidak konklusif — investigate»; ECE AGE 60+ 0,1208 CI95 [0,0839; 0,2225] — seluruh interval di atas 0,05, tetap temuan-investigasi (n < 200) dengan prioritas penyelidikan tertinggi. Desain validasi: cek ketersediaan fitur (semua fitur flagship tersedia saat keputusan), split acak mengukur noise bukan generalisasi ke populasi baru (temporal split tidak mungkin — snapshot tanpa tanggal), test 6.000 sudah dipakai memilih berkali-kali — vonis akhir adalah satu pemakaian terakhirnya sebagai test segar. Issue register: tiga temuan KUNING (F-01 bad rate, F-02 ECE tiga grup, F-03 AGE 60+) masing-masing 10 kolom; approval berlaku selama tidak ada temuan overdue tanpa perpanjangan komite; lab 3 membuktikan aturannya (n_open 3, n_overdue 0, approval_valid True — dan skenario overdue membekukannya).",
        "Guided task di Colab — notebook mlf-m81-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data UCI: flagship GBM mentah + terkalibrasi + LR, validation halves A/B, outcomes analysis (ECE per half + band), dan traffic-light verdict dengan laporan validasi. Tautan Colab: https://colab.research.google.com/drive/10LvCVHcOnBtQdchAT507OunEBS0SwZD9",
        "Yang tersisa adalah kebiasaan: tiap kali seseorang membawakanmu model dengan skor test yang bagus, tanyakan tiga hal — apakah metodenya masuk akal, apakah hasilnya bertahan di belahan lain, dan siapa yang memeriksanya. Bila satu jawabannya kosong, skor itu belum menjadi keputusan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "SR 11-7 menahan model risk dengan tiga pilar. Apa ketiganya?",
          options: [
            { text: "Akurasi, kecepatan, dan biaya — tiga metrik yang harus dilaporkan tiap model", why: "Salah: itu metrik performa, bukan pilar tata kelola. SR 11-7 tidak berbicara tentang kecepatan model." },
            { text: "Model development, implementation, and use; model validation; governance", why: "Benar: pilar 1 — tim model membangun, mengimplementasikan, dan memakai model dengan dokumentasi; pilar 2 — pihak independen menguji; pilar 3 — kebijakan, peran, dan kontrol yang mengikat keduanya.", correct: true },
            { text: "Data, model, dan deployment — tiga tahap pipeline machine learning", why: "Salah: itu tahap pipeline, bukan pilar SR 11-7. Pipeline tidak menjawab «siapa yang memeriksa» dan «siapa yang bertanggung jawab»." },
            { text: "Training, testing, dan monitoring — tiga fase siklus hidup model", why: "Salah: itu fase siklus hidup — dan monitoring adalah BAGIAN dari pilar 1 dan 2, bukan pilar tersendiri dalam SR 11-7." },
          ],
        },
        {
          q: "Dalam three lines of defense, siapa yang memberi verdict validasi — dan kepada siapa ia melapor?",
          options: [
            { text: "Lini 1 (pemilik model) memberi verdict, melapor ke bisnis", why: "Salah: lini 1 MEMBANGUN dan MEMAKAI model — ia pihak yang berkepentingan agar model lolos, jadi ia tidak boleh memberi verdict atas dirinya sendiri." },
            { text: "Lini 2 (validasi independen) memberi verdict, melapor ke dewan/komite risiko — bukan ke lini 1", why: "Benar: lini 2 menguji dan memberi verdict; ia melapor ke dewan/komite risiko agar tidak dinilai oleh orang yang ia periksa. Itulah inti independensi.", correct: true },
            { text: "Lini 3 (audit internal) memberi verdict, melapor ke lini 2", why: "Salah: lini 3 mengaudit PROSES (apakah lini 1 dan 2 menjalankan tugasnya) — bukan memberi verdict atas model. Verdict model adalah tugas lini 2." },
            { text: "Ketiga lini bersama-sama memberi verdict, melapor ke regulator", why: "Salah: verdict adalah tanggung jawab SATU lini (lini 2). Verdict bersama berarti tidak ada yang bertanggung jawab bila verdict itu salah." },
          ],
        },
        {
          q: "Conceptual soundness: LR vs GBM. Pernyataan mana yang benar?",
          options: [
            { text: "LR dan GBM membuat asumsi yang sama — keduanya mengasumsikan linearitas log-odds", why: "Salah: hanya LR yang mengasumsikan linearitas log-odds. GBM non-parametrik — ia mempelajari bentuk hubungan apa pun dari data." },
            { text: "GBM mengasumsikan linearitas, LR tidak — karena itu GBM lebih kaku", why: "Terbalik: LR yang mengasumsikan linearitas; GBM yang fleksibel. GBM mentah 0,7823 mengalahkan LR 0,7426 justru karena hubungan di data ini tidak linear." },
            { text: "LR mengasumsikan linearitas log-odds; GBM tidak — tapi fleksibilitas GBM ada harganya: gap train-test 0,0646, yang pengendalinya adalah nested CV 0,7858 (sd antar-fold 0,0068)", why: "Benar: GBM lebih cocok dengan bentuk hubungan di data ini DAN lebih mudah overfit. Validator menerima GBM bukan karena skornya lebih tinggi saja, melainkan karena overfit-nya terukur dan terbatas (nested CV [M6.2] sejalan dengan test).", correct: true },
            { text: "Asumsi tidak penting — yang penting ROC-AUC test; GBM 0,7823 > LR 0,7426, selesai", why: "Salah: itu justru yang diperingatkan conceptual soundness — skor bagus dari metode yang salah konsep adalah skor yang menipu. Asumsi diperiksa SEBELUM skor dibaca." },
          ],
        },
        {
          q: "Outcomes analysis: validation halves menunjukkan ROC-AUC half A 0,7885 vs half B 0,7746 (selisih −0,0139), base rate hampir identik (−0,03 pp). Apa artinya bagi validator?",
          options: [
            { text: "Model memburuk di half B — harus di-retrain sebelum deploy", why: "Salah: kedua belahan berasal dari test yang sama; selisih 0,0139 adalah ayunan sampling antar-belahan (n=3.000), bukan «model memburuk». Retrain atas noise adalah membuang model bagus." },
            { text: "Selisih itu konsisten dengan noise sampling — base rate identik, ayunannya wajar untuk n=3.000 (≈1,1–1,3 sd selisih; sd ROC-AUC per half ≈ 0,008–0,009) — bukan bukti model rusak", why: "Benar: halves mengukur NOISE, bukan kualitas. Base rate yang hampir identik membuktikan belahannya setara; ayunan 0,0139 ≈ 1,1–1,3 sd selisih — bukan 2× sd antar-fold — wajar untuk ukuran sampel itu.", correct: true },
            { text: "Half A harus dipakai sebagai test yang benar; half B dibuang karena angkanya lebih buruk", why: "Salah: memilih belahan yang angkanya bagus adalah cherry-picking. Halves adalah alat UJI — keduanya dipakai, dan selisihnyalah informasinya." },
            { text: "Selisih −0,0139 membuktikan nested CV 0,7858 salah — test penuh 0,7816 tidak bisa dipercaya", why: "Salah: sebaliknya — nested CV 0,7858 (sd antar-fold 0,0068) [M6.2] dan test 0,7816 saling menguatkan. Selisih antar-half 0,0139 adalah ayunan yang diharapkan di sekitar estimasi itu, bukan sangkalannya." },
          ],
        },
        {
          q: "Mengapa validator harus independen dari pembangun model?",
          options: [
            { text: "Karena validator harus lebih pintar dari pembangun agar bisa menemukan kesalahannya", why: "Salah: independensi bukan soal kepintaran — validator sepintar apa pun tidak bisa menguji modelnya sendiri dengan jujur, karena ia tahu jawaban yang ia harapkan." },
            { text: "Karena pembangun punya blind spot sistematis (asumsi yang terasa wajar sehingga tak pernah ditulis) dan kepentingan agar modelnya lolos — hanya pemeriksa yang bebas dari keduanya yang bisa menguji dengan jujur", why: "Benar: contohnya premis «model tidak memakai SEX/EDUCATION/AGE» yang sempat beredar padahal salah [M7] — pembangun tidak memeriksa, validator independen yang memeriksa. Independensi bersifat struktural: tidak membangun, tidak dinilai pemilik model, bisa menahan deploy.", correct: true },
            { text: "Karena SR 11-7 melarang validator berbicara dengan tim model", why: "Salah: SR 11-7 tidak melarang komunikasi — validator BOLEH (dan harus) bertanya ke tim model. Yang dilarang adalah validator MENJADI bagian dari tim model atau DINILAI olehnya." },
            { text: "Karena validator independen tidak perlu memahami modelnya — ia hanya memeriksa angkanya", why: "Salah: sebaliknya — validator harus memahami modelnya DALAM (asumsi, data, metode) untuk bisa menantangnya. Independensi adalah kebebasan dari kepentingan, bukan kebebasan dari pemahaman." },
          ],
        },
        {
          q: "Terapkan traffic-light [kebijakan lesson ini] pada model ini: ROC-AUC test 0,7816; ECE maks antar-half 0,0114; |ΔROC| 0,0139; |Δbad rate| 1,06 pp; |Δapproval| 0,54 pp; conceptual soundness lolos. Verdict-nya?",
          options: [
            { text: "HIJAU — semua metrik bagus, satu selisih kecil tidak mengubah apa pun", why: "Salah: |Δbad rate| 1,06 pp MELEWATI ambang HIJAU 1,0 pp — satu kondisi HIJAU dilanggar. HIJAU mensyaratkan SEMUA kondisi terpenuhi." },
            { text: "MERAH — bad rate half B 7,20% terlalu tinggi untuk model yang boleh deploy", why: "Salah: «terlalu tinggi» bukan ambang — ambang MERAH untuk |Δbad rate| adalah > 3,0 pp, dan 1,06 jauh di bawahnya. Tidak satu pun kondisi MERAH terpenuhi." },
            { text: "KUNING — lolos dengan catatan; pemicunya |Δbad rate| 1,06 pp (0,06 pp di atas ambang 1,0) DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312), dengan syarat pantau bad rate + selidiki ECE ketiga grup itu + revalidasi 3 bulan", why: "Benar: |Δbad rate| 1,06 pp melewati ambang HIJAU 1,0 dan masuk rentang KUNING 1,0–3,0 pp; tiga grup dengan n ≥ 200 juga punya ECE di rentang KUNING 0,02–0,05. Verdict KUNING = deploy dengan syarat yang tertulis dan diaudit.", correct: true },
            { text: "Tidak bisa diputuskan — ambang 1,0 pp terlalu tipis (1,06 vs 1,0) untuk menjadi dasar verdict", why: "Salah: justru di situlah gunanya ambang yang ditulis DULU — 1,06 melewati 1,0, maka KUNING, dan selisih 0,06 pp itu DITULIS sebagai bagian dari verdict. Mengatakan «terlalu tipis untuk diputuskan» sama dengan membuang aturan saat hasilnya tidak nyaman." },
          ],
        },
        {
          q: "Jebakan akurasi-saja: ECE overall test 0,0087 — sangat baik. Tapi ECE AGE 60+ adalah 0,1208 (n=76) [M7.1]. Apa yang harus dilakukan validator?",
          options: [
            { text: "Menulis «kalibrasi bagus» — ECE overall 0,0087 sudah membuktikannya", why: "Salah: ECE overall adalah rata-rata tertimbang — grup besar yang kalibrasinya baik menutupi grup kecil yang kalibrasinya rusak. Itulah jebakan yang diperingatkan langkah 9." },
            { text: "Menolak model — ECE 0,1208 enam kali lipat ambang 0,02, jadi kalibrasi model rusak", why: "Salah: n=76 di bawah gate 200 (langkah 8) — ECE ini tidak masuk band, jadi ia tidak bisa memicu MERAH; ia adalah TEMUAN-INVESTIGASI. Menolak atas bukti yang belum cukup sama salahnya dengan meloloskan tanpa syarat." },
            { text: "Menulis temuan dengan n-nya dan tindak lanjut yang tertulis: selidiki dengan sampel lebih besar untuk grup ini sebelum revalidasi; bila ECE bertahan di atas 0,02 pada n yang lebih besar, syaratkan mitigasi", why: "Benar: 0,1208 adalah TEMUAN-INVESTIGASI yang WAJIB ditulis (di atas ambang 0,02, tetapi n=76 di bawah gate 200 — jadi ia tidak masuk band dan tidak memicu MERAH), tapi ia butuh penyelidikan lanjutan, bukan vonis dan bukan pengabaian. Validator menulis apa yang harus terjadi berikutnya.", correct: true },
            { text: "Menghapus grup AGE 60+ dari laporan — n=76 terlalu kecil untuk dilaporkan", why: "Salah: menghapus temuan karena n kecil adalah menyembunyikan bukti. Yang benar: laporkan BERSAMA n-nya dan tindak lanjutnya — «n terlalu kecil» adalah alasan untuk menyelidiki, bukan untuk menghapus." },
          ],
        },
        {
          q: "Mini-case: model ROC-AUC 0,7823 (mentah) / 0,7816 (terkalibrasi), ECE 0,0087, tapi half B bad rate 7,20% vs half A 6,14%. Keputusan validator?",
          options: [
            { text: "Tolak — bad rate 7,20% di half B membuktikan model tidak stabil", why: "Salah: tidak satu pun kondisi MERAH terpenuhi (ECE 0,0114 maks < 0,05; |ΔROC| 0,0139 < 0,05; |Δbad rate| 1,06 pp < 3,0 pp). «Membuktikan tidak stabil» butuh ambang yang dilanggar — dan tidak ada." },
            { text: "Lolos tanpa catatan (HIJAU) — selisih 1,06 pp cuma 0,06 di atas ambang, jadi abaikan saja", why: "Salah: menggeser ambang sesudah melihat angka adalah berbohong dengan statistik. 1,06 melewati 1,0 — maka KUNING, dan 0,06 pp itu ditulis sebagai bagian dari verdict." },
            { text: "Lolos dengan catatan (KUNING): pantau bad rate per periode, selidiki ECE per grup yang masuk band (Pascasarjana, SMA, AGE 50–59) dan temuan-investigasi AGE 60+, revalidasi 3 bulan — dengan pemilik dan tanggal tertulis", why: "Benar: tidak ada kondisi MERAH (ECE AGE 60+ 0,1208 tidak masuk band karena n=76 < 200), kondisi HIJAU dilanggar ringan oleh |Δbad rate| 1,06 pp dan ECE tiga grup n ≥ 200. KUNING = deploy dengan syarat yang tertulis, dipatuhi, dan diaudit di revalidasi.", correct: true },
            { text: "Tunda verdict sampai ECE AGE 60+ diselidiki — tidak ada keputusan sebelum itu selesai", why: "Salah: menahan deploy atas bukti yang belum cukup (n=76, di bawah gate 200) sama salahnya dengan mendepoy tanpa syarat. Temuan itu menjadi SYARAT KUNING (diselidiki sebelum revalidasi), bukan alasan penahanan." },
          ],
        },
        {
          q: "Bootstrap CI95 selisih bad rate antar-half adalah [+1,06 pp titik; CI −1,26; +3,35] [turunan] — intervalnya melintasi nol, ambang HIJAU 1,0, dan ambang MERAH 3,0. Apa yang harus dilakukan validator?",
          options: [
            { text: "Mengubah verdict menjadi HIJAU — CI mencakup 0, jadi selisihnya «tidak ada»", why: "Salah: CI yang melintasi nol berarti selisih TIDAK TERBUKTI berbeda dari nol — bukan berarti selisihnya nol. Aturan lesson: verdict mengikuti estimasi titik (1,06 > 1,0 → KUNING); CI tidak mengubah band." },
            { text: "Mengubah verdict menjadi MERAH — CI melewati 3,0, jadi model pasti gagal", why: "Salah: verdict mengikuti ESTIMASI TITIK (1,06 → KUNING) — batas atas CI 3,35 memang sudah melewati ambang MERAH 3,0, tapi itu alasan menandai verdict «tidak konklusif — investigate», bukan menaikkan verdict menjadi MERAH. CI yang lebar adalah bukti ketidakpastian, bukan bukti kegagalan." },
            { text: "Verdict tetap KUNING (titik 1,06 > ambang 1,0), TAPI ditandai «tidak konklusif — investigate»: tulis CI di laporan, prioritaskan sampel lebih besar untuk bad rate, dan revalidasi tidak boleh ditunda", why: "Benar: ambang ditulis dulu dan verdict mengikuti titik — CI tidak mengubah band. Yang diubah CI adalah tindak lanjutnya: verdict yang CI-nya melintasi ambang ditandai tidak konklusif, dengan penyelidikan sebagai syaratnya.", correct: true },
            { text: "Membuang selisih antar-half dari laporan — angka yang CI-nya melintasi nol tidak layak dilaporkan", why: "Salah: justru angka dengan CI lebar yang PALING layak dilaporkan bersama CI-nya — «+1,06 pp [−1,26; +3,35]» memberi tahu pembaca seberapa yakin kamu. Menyembunyikan ketidakpastian adalah berbohong dengan diam." },
          ],
        },
      ],
      summary: [
        "SR 11-7 (Federal Reserve) / OCC 2011-12 (2011): model risk = potensi konsekuensi merugikan (finansial maupun non-finansial) dari keputusan berbasis output model yang salah atau disalahgunakan; tiga pilar — (1) development, implementation, and use; (2) validation; (3) governance.",
        "Three lines of defense: lini 1 pemilik model & bisnis (membangun, memakai, memonitor); lini 2 validasi independen & risk (menguji, memberi verdict); lini 3 audit internal (memeriksa lini 1 & 2) — lini 1–2 melapor ke dewan/komite risiko, lini 3 melapor ke komite audit; lini 2 tidak pernah melapor ke lini 1.",
        "Conceptual soundness: LR mengasumsikan linearitas log-odds, GBM non-parametrik — GBM mentah 0,7823 mengalahkan LR 0,7426, tapi gap train-test 0,0646 (train 0,8469) adalah harga fleksibilitasnya; pengendalinya nested CV 0,7858 (sd antar-fold 0,0068) [M6.2]. Kalibrasi Platt dipakai karena threshold 0,10 diturunkan dari biaya [M6.4] dan butuh probabilitas yang jujur.",
        "Outcomes analysis — validation halves (test 6.000 → A/B n=3.000, seed 42): A ROC-AUC 0,7885 / bad rate 6,14% / ECE 0,0114; B ROC-AUC 0,7746 / bad rate 7,20% / ECE 0,0104; selisih B−A: ROC-AUC −0,0139, PR-AUC −0,0176, approval −0,54 pp, bad rate +1,06 pp, ECE −0,0010, Brier +0,0032, base rate −0,03 pp. Ranking invarian ≠ approval invarian.",
        "Ongoing monitoring: rujuk M7.5 (PSI skor 0,0017, ambang 0,1/0,25; baseline test 0,7816/0,5558/0,0087/6,67%) — validator menulis SYARAT monitoring, bukan yang memantau.",
        "Independensi: validator tidak membangun model, tidak dinilai pemilik model, dan bisa menahan deploy — tanpanya validasi menjadi stempel; blind spot pembangun (mis. premis SEX/EDUCATION/AGE yang salah [M7]) hanya tertangkap pemeriksa independen.",
        "Traffic-light [kebijakan lesson ini]: HIJAU (ROC ≥ 0,75; ECE < 0,02; |ΔROC| ≤ 0,02; |Δbad rate| ≤ 1,0 pp; |Δapproval| ≤ 1,0 pp); KUNING (pelanggaran ringan: ECE 0,02–0,05; |ΔROC| 0,02–0,05; |Δbad rate| 1,0–3,0 pp; |Δapproval| 1,0–3,0 pp; ROC 0,70–0,75); MERAH (ECE ≥ 0,05; |ΔROC| > 0,05; |Δbad rate| > 3,0 pp; |Δapproval| > 3,0 pp; ROC < 0,70; conceptual soundness gagal). Band ECE berlaku untuk overall dan per half; per grup masuk band hanya bila n ≥ 200. Verdict model ini: KUNING — pemicu |Δbad rate| 1,06 pp DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312).",
        "Jebakan akurasi-saja: ECE overall 0,0087 menyembunyikan ECE AGE 60+ 0,1208 (n=76) [M7.1] — temuan itu butuh penyelidikan lanjutan, bukan vonis dan bukan pengabaian; laporkan ECE selalu bersama n-nya.",
        "Mini-case: KUNING — lolos dengan catatan (pantau bad rate per periode, selidiki ECE AGE 60+, revalidasi 3 bulan); bukan tolak (tidak ada kondisi MERAH) dan bukan HIJAU (satu kondisi dilanggar).",
        "Lab: selisih halves (roc_diff −0,0139, bad_rate_diff_pp +1,06, kuning_bad_rate True); ECE per half lolos semua (maks 0,0114) dan band KUNING.",
        "Kuantifikasi ketidakpastian [turunan]: bad rate 6,67% CI95 [5,47%; 7,85%]; approval 28,5% CI95 [27,33%; 29,65%]; ECE 0,0087 CI95 [0,0077; 0,0214]; profit +NT$8.214.000 CI95 [NT$5.575.975; NT$10.802.787]; selisih bad rate antar-half +1,06 pp CI95 [−1,26; +3,35] — melintasi nol dan ambang, jadi KUNING ditandai «tidak konklusif — investigate»; ECE AGE 60+ 0,1208 CI95 [0,0839; 0,2225] (seluruh interval di atas 0,05) tetap temuan-investigasi; ECE Pascasarjana 0,0210 CI95 [0,0159; 0,0387] melintasi 0,02.",
        "Desain validasi: cek ketersediaan fitur (fitur flagship tersedia saat keputusan — leakage adalah fitur yang baru ada sesudah keputusan); split acak mengukur noise, bukan generalisasi ke populasi baru; temporal split tidak mungkin di snapshot tanpa tanggal; test 6.000 sudah dipakai memilih berkali-kali — vonis akhir adalah pemakaian terakhirnya sebagai test segar.",
        "Issue register: temuan menjadi tindakan — 10 kolom (finding_id, severity, evidence, root_cause, action, owner, due_date, acceptance_test, status, closure_approver); temuan CLOSED hanya bila acceptance_test lulus DAN closure_approver menandatangani; approval KUNING berlaku selama tidak ada temuan overdue tanpa perpanjangan komite.",
      ],
      next: { label: "Lanjut: MLF-M8.2 — Model Risk Rating & Inventory", href: "/v2/learn/mlf-m82-model-risk-rating-inventory" },
    },
  ],
};

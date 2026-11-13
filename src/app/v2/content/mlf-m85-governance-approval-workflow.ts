import type { V2Lesson } from "../lib/types";

export const mlfM85: V2Lesson = {
  slug: "mlf-m85-governance-approval-workflow",
  track: "Machine Learning Finance",
  module: "Model risk & deployment",
  title: "MLF-M8.5 — Model Risk Governance & Approval Workflow: Siapa yang Menyetujui, Siapa yang Bertanggung Jawab",
  estMinutes: 105,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Model tanpa tanda tangan dipakai bisnis — lalu merugi. Siapa yang bertanggung jawab?",
      prose: [
        "Bayangkan ini [ilustrasi — skenario, angkanya kanonis]: tim bisnis mengubah threshold model kredit dari 0,10 ke 0,50 diam-diam, tanpa proposal, tanpa validasi, tanpa satu pun tanda tangan. Di atas kertas, alasannya masuk akal — «supaya lebih banyak nasabah disetujui». Di atas angka [M6.4], yang terjadi adalah ini: approval rate melompat dari 28,5% ke 88,05%, bad rate yang disetujui naik dari 6,67% ke 15,96%, dan profit berubah dari +NT$8.214.000 menjadi −NT$18.994.456 — kerugian hampir NT$19 juta pada 6.000 nasabah test, dari SATU perubahan angka. Bisnis menelepon analis: «modelmu merugi». Analis menjawab: «saya tidak pernah mengubah threshold itu». Risk manager berkata: «saya tidak pernah menyetujuinya». Dan ketiganya benar — karena tidak ada satu pun dari mereka yang tercatat sebagai penanggung jawab.",
        "Itulah pertanyaan lesson ini — dan jawabannya bukan teknis, melainkan tata kelola: governance adalah sistem yang memastikan setiap model yang memutuskan nasib nasabah punya pemilik, punya penyetuju, dan punya jejak yang bisa diaudit. Tanpa governance, model yang bagus pun hanya menunggu satu perubahan diam-diam untuk berubah menjadi kerugian yang tidak bisa dipertanggungjawabkan.",
        "Konteks angka lesson ini: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05 [notebook]. Baseline [M6.4/M7.4]: ROC-AUC GBM terkalibrasi 0,7816, PR-AUC 0,5558, approval rate 28,5%, bad rate 6,67%, profit +NT$8.214.000, cost NT$33.046.500. Semua angka ekonomi threshold di lesson ini berasal dari tabel kebijakan M6.4 [M6.4] dan disalin ke kanonik M7 (m6_crossref) — tidak ada satu pun yang dikarang. Angka yang bersifat ilustrasi dilabeli [ilustrasi] eksplisit.",
        "Peta lesson: cerita model tanpa sign-off → struktur governance (komite, pemilik, validator, audit) → RACI: siapa Responsible, Accountable, Consulted, Informed → alur approval utuh dari proposal sampai monitoring → arti tanda tangan → exception: jalan darurat yang tercatat → change control enam gerbang G10 [M7.4] dengan contoh perubahan threshold 0,10 ke 0,15 → decision protocol: kuorum, recusal, jejak digital → pemicu revalidasi → audit trail sepuluh kolom G10 → jebakan stempel karet → mini-case perubahan threshold → capstone: satu perubahan, sembilan artefak → 2 lab → checkpoint.",
        "Nilai: governance adalah selisih antara «model yang merugi dan tidak ada yang bisa disalahkan» dan «model yang merugi dan semua orang tahu siapa yang memutuskan, berdasarkan angka apa, dan bagaimana cara kembali». Nilai itu tidak terlihat saat semuanya berjalan baik — ia baru terlihat pada hari kerugian itu datang, dan pada hari itu sudah terlambat untuk membangunnya.",
        "Baik atau buruk: model flagship kita bagus sebagai MESIN keputusan (ROC-AUC 0,7816, profit +NT$8.214.000 pada threshold 0,10 [M6.4]). Buruk bila mesin itu dipakai tanpa governance: angka yang sama — threshold 0,50, profit −NT$18.994.456 [M6.4] — menunjukkan betapa cepatnya mesin yang bagus berubah menjadi kerugian bila tidak ada yang menjaga gerbangnya. Kualitas model dan kualitas tata kelola adalah dua hal yang berbeda, dan yang kedua tidak mengikuti yang pertama secara otomatis.",
        "Mitigasi: sebelum model apa pun naik ke produksi, tuliskan tiga nama: siapa pemiliknya, siapa validatornya, siapa yang menandatangani persetujuannya. Bila satu dari tiga nama itu kosong, model itu belum siap live — sebagus apa pun ROC-AUC-nya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: governance adalah birokrasi yang memperlambat model bagus",
        type: "pitfall",
        body: "Yang benar: governance adalah yang membuat model bagus BERTAHAN bagus. Tanpa gerbang, satu perubahan threshold diam-diam (0,10 ke 0,50 [M6.4]) menghapus profit NT$8.214.000 dan menggantinya dengan kerugian NT$18.994.456 — dan tidak ada yang bisa menjelaskan kenapa. Gerbang tidak memperlambat model; gerbang memperlambat KERUGIAN.",
      },
    },
    {
      id: "governance-structure",
      eyebrow: "Langkah 2 · Struktur governance",
      title: "Empat peran yang menjaga model: komite, pemilik, validator, audit",
      prose: [
        "Struktur governance model risk punya empat peran — dan tidak satu pun boleh dirangkap oleh peran lain saat ia sedang menjalankan tugasnya. Pertama, KOMITE MODEL RISK: badan yang memutuskan model BOLEH atau TIDAK dipakai di produksi. Tugasnya: menyetujui atau menolak proposal, menetapkan tier risiko model [M8.2] (total limit test NT$1.007.777.680; approved NT$424.180.000, share 0,4209; EL approved NT$11.989.453; EL seluruh test NT$78.675.378), dan mencabut persetujuan bila revalidasi gagal. Komite tidak membangun model dan tidak memvalidasinya — ia MENILAI keduanya. Kedua, MODEL OWNER (pemilik model): satu orang yang accountable atas model itu selama ia live. Tugasnya: mengajukan perubahan, memastikan monitoring berjalan [M7.5], dan menjadi orang pertama yang dihubungi saat alert menyala. Ketiga, VALIDATOR INDEPENDEN: pihak yang memeriksa model tanpa ikut membangunnya [M8.1]. Tugasnya: menilai conceptual soundness desain, mengulang perhitungan pada data yang belum dipakai memilih (outcomes analysis), dan memakai hasil monitoring [M7.5] sebagai input — lalu menulis opini validasi — termasuk kelemahannya — dan berkata TIDAK bila buktinya tidak cukup. Pemetaannya ke three lines [M8.1]: owner = lini 1, validator/komite = lini 2, audit = lini 3 (melapor ke dewan/komite audit, bukan ke owner). Keempat, AUDIT INTERNAL: pihak yang memeriksa apakah PROSESNYA diikuti, bukan apakah modelnya bagus. Tugasnya: mengambil sampel keputusan, memeriksa audit trail, dan melaporkan bila gerbang dilewati diam-diam.",
        "Perhatikan pemisahannya: pembangun model TIDAK memvalidasi karyanya sendiri, validator TIDAK menyetujui pemakaiannya (itu tugas komite), dan komite TIDAK membangun apa pun. Setiap pemisahan ini ada karena satu kegagalan yang sama: orang yang paling tahu cara kerja model adalah orang yang paling sulit melihat kelemahannya — dan orang yang paling diuntungkan oleh model yang live adalah orang yang paling sulit menolaknya.",
        "Nilai: empat peran ini bagus karena masing-masing menjawab satu pertanyaan yang berbeda — komite menjawab «bolehkah dipakai?», owner menjawab «siapa yang bertanggung jawab saat live?», validator menjawab «apakah buktinya cukup?», audit menjawab «apakah prosesnya benar-benar diikuti?». Bila satu peran hilang, satu pertanyaan itu tidak terjawab — dan pertanyaan yang tidak terjawab itulah yang muncul sebagai kerugian yang tidak bisa dijelaskan.",
        "Baik atau buruk: struktur empat peran ini bagus bila tiap peran diisi orang yang berbeda dengan insentif yang berbeda — validator yang dinilai dari ketajaman temuannya, bukan dari kecepatan persetujuannya. Buruk bila peran-peran ini hanya nama di atas kertas: komite yang anggotanya adalah tim yang sama dengan pembangun model, validator yang melapor ke owner, audit yang tidak pernah mengambil sampel. Struktur yang sama, insentif yang berbeda, hasilnya berlawanan.",
        "Mitigasi: tuliskan empat nama itu untuk model flagship kita — komite, owner, validator, audit — dan satu kalimat tugas masing-masing, SEBELUM lesson ini selesai. Bila satu nama tidak bisa diisi, tuliskan «kosong» dengan jujur: kekosongan yang terlihat masih bisa diperbaiki; kekosongan yang disembunyikan tidak bisa.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: validator yang melapor ke pemilik model",
        type: "risk",
        body: "Yang benar: validator harus independen — laporannya sampai ke komite TANPA disaring owner. Validator yang dinilai oleh orang yang karyanya ia periksa akan belajar untuk tidak menemukan apa-apa. Di lesson ini, validator M8.1 mengulang perhitungan pada belahan data yang berbeda (A: ROC-AUC 0,7885; B: 0,7746 — selisih −0,0139) justru untuk membuktikan bahwa temuannya bukan hasil pilihan data yang menguntungkan.",
      },
    },
    {
      id: "roles-responsibilities",
      eyebrow: "Langkah 3 · RACI",
      title: "RACI: siapa yang mengerjakan, siapa yang menjawab, siapa yang diajak bicara",
      prose: [
        "RACI adalah matriks empat huruf yang menjawab «siapa melakukan apa» di setiap tahap — Responsible (R): yang MENGERJAKAN; Accountable (A): yang MENANGGUNG JAWABAN akhir atas keputusan itu, tepat satu orang per keputusan; Consulted (C): yang diajak bicara SEBELUM keputusan diambil; Informed (I): yang diberitahu SESUDAH keputusan diambil. Empat huruf ini bukan hiasan: setiap huruf yang salah tempat menghasilkan satu kegagalan yang spesifik — R tanpa A berarti pekerjaan selesai tapi tidak ada yang memilikinya; dua A berarti tidak ada yang memutuskan saat mereka tidak sepakat; C yang dilewati berarti keputusan diambil tanpa informasi yang ia miliki; I yang dilewati berarti orang yang harus bertindak tidak tahu keputusan sudah berubah.",
        "RACI untuk alur model kita — satu A per baris, tanpa kecuali. Proposal perubahan: R = model owner (menulis proposal + angka dampak), A = model owner, C = validator (hanya kelayakan data/metodologi, bukan isi keputusan) dan risk manager, I = komite dan tim bisnis. Validasi independen [M8.1]: R = validator, A = validator (atas isi opini — komite menerima atau menolak opini itu di baris sign-off), C = model owner (menjelaskan desain, bukan menilai hasilnya), I = audit internal. Sign-off: R = validator (opini), model owner (pemakaian bisnis), legal/risk (kepatuhan); A = komite; C = —; I = tim bisnis, audit. Deploy [M8.4]: R = owner bersama tim engineering, A = model owner, C = validator (memeriksa hasil shadow/canary), I = tim bisnis dan komite. Monitoring [M7.5]: R = analis monitoring, A = model owner, C = risk manager, I = komite. Rollback: R = model owner, A = komite (yang memerintahkan pencabutan), C = validator, I = tim bisnis dan audit.",
        "Nilai: RACI bagus karena ia mengubah «semua orang bertanggung jawab» — yang dalam praktik berarti tidak ada yang bertanggung jawab — menjadi SATU nama per keputusan. Pada hari kerugian datang (cerita langkah 1), RACI adalah dokumen yang menjawab «siapa» dalam satu baris, bukan rapat tiga jam yang berakhir tanpa nama.",
        "Baik atau buruk: RACI bagus sebagai PETA tanggung jawab — ia menunjukkan siapa yang harus dihubungi, siapa yang harus ditanyai, dan siapa yang tidak boleh dilewati. Buruk bila dibaca sebagai «bila namaku tidak ada di baris itu, bukan urusanku»: RACI membagi TANGGUNG JAWAB, bukan kepedulian. Analis monitoring yang melihat PSI simulasi drift S2 0,5811 [m75_drift_simulations.S2_pay_plus1.psi_score_vs_baseline_test] tetap harus berteriak walau hurufnya hanya R di baris monitoring — bukan A.",
        "Mitigasi: untuk setiap tahap alur (langkah 4), tuliskan RACI-nya dan periksa dua hal: tepat satu A per baris, dan tidak ada baris yang A-nya kosong. Bila satu baris punya dua A, putuskan satu — sebelum ada keputusan yang harus diambil di baris itu.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: Accountable sama dengan Responsible",
        type: "pitfall",
        body: "Yang benar: Responsible mengerjakan, Accountable menjawab. Validator adalah R untuk opini validasi — tapi komite adalah A untuk keputusan menerima opini itu. Bila keduanya dicampur, validator merasa ia yang memutuskan pemakaian (padahal bukan), dan komite merasa ia yang memeriksa modelnya (padahal bukan). Satu huruf yang tertukar, dua peran yang kehilangan tugasnya.",
      },
    },
    {
      id: "approval-workflow",
      eyebrow: "Langkah 4 · Alur approval",
      title: "Satu alur utuh: proposal → validasi → sign-off → deploy → monitoring",
      prose: [
        "Approval workflow adalah SATU alur dengan lima tahap — dan setiap tahap punya kriteria keluar yang tertulis, bukan perasaan. Tahap 1, PROPOSAL: owner menulis APA yang berubah, KENAPA berubah, dan DAMPAK yang diharapkan — lengkap dengan angka sebelum dan sesudah (untuk threshold, angka [M6.4]). Kriteria keluar: proposal tertulis dan lengkap; proposal lisan tidak pernah lolos tahap ini. Tahap 2, VALIDASI [M8.1]: validator independen mengulang perhitungan pada data yang belum dipakai memilih — belahan A vs B (ROC-AUC 0,7885 vs 0,7746, selisih −0,0139), sensitivitas seed, dan pemeriksaan ulang asumsi — lalu menulis opini: layak, layak dengan syarat, atau tidak layak. Kriteria keluar: opini tertulis, termasuk kelemahan yang ditemukan. Tahap 3, SIGN-OFF (langkah 5): para penandatangan membaca opini + model card [M8.3] + ekonomi [M6.4], lalu menandatangani — atau menolak dengan alasan tertulis. Kriteria keluar: semua tanda tangan terkumpul SEBELUM deploy. Tahap 4, DEPLOY [M8.4]: model baru berjalan shadow/canary berdampingan dengan champion — pada data kita, champion vs challenger berbeda keputusan pada 19,42% nasabah (1.165 dari 6.000), jadi shadow bukan formalitas: ia mengukur harga pergantian SEBELUM harga itu dibayar. Kriteria keluar: hasil shadow sesuai dengan yang dijanjikan proposal. Tahap 5, MONITORING [M7.5]: DUA kolom yang dibaca dengan kadensi berbeda. Harian (tanpa label, tersedia segera): PSI skor, distribusi skor, approval rate, dan AIR — dibaca tiap pagi oleh analis. Per periode SETELAH label matang (jendela observasi 1 bulan [M7.5]): ROC-AUC/PR-AUC, bad rate yang disetujui, dan ECE — dibaca mingguan oleh risk manager, karena metrik berlabel selalu tertinggal dari PSI: temuan berbasis label datang berminggu-minggu setelah PSI sudah berteriak. Kriteria keluar: tidak ada — monitoring tidak pernah selesai; ia hanya memberi sinyal kembali ke tahap 1 lewat revalidasi (langkah 7).",
        "Nilai: alur lima tahap ini bagus karena ia membuat setiap keputusan BISA DILACAK mundur: kerugian di produksi bisa ditelusuri ke proposalnya, proposalnya ke opini validasinya, opininya ke tanda tangannya. Tanpa alur, yang tersisa hanya ingatan orang — dan ingatan adalah audit trail yang paling buruk.",
        "Baik atau buruk: alur ini bagus bila tiap tahap benar-benar bisa MENGHENTIKAN alur — validator yang berkata tidak layak menghentikan deploy, komite yang menolak menghentikan semuanya. Buruk bila tahap-tahap ini hanya stempel berurutan: proposal yang ditulis sesudah deploy, validasi yang disalin dari proposal, sign-off yang dikumpulkan sesudah model live. Alur yang tidak bisa berhenti bukan alur — ia antrean stempel (langkah 9).",
        "Mitigasi: pasang SATU pengunci teknis — deploy tidak bisa dieksekusi tanpa nomor persetujuan komite yang tercatat di audit trail (langkah 8). Pengunci teknis lebih bisa diandalkan daripada pengingat prosedural: orang lupa, sistem tidak.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Alur approval lima tahap: Proposal, Validasi M8.1, Sign-off, Deploy M8.4, Monitoring M7.5; temuan monitoring kembali ke proposal lewat revalidasi">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Approval workflow — lima tahap, satu alur utuh</text>
<rect x="4" y="64" width="88" height="52" rx="6" fill="var(--c1)"/>
<text x="48" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1 Proposal</text>
<text x="48" y="102" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">tulis dulu</text>
<rect x="100" y="64" width="88" height="52" rx="6" fill="var(--c1)"/>
<text x="144" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2 Validasi</text>
<text x="144" y="102" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">[M8.1]</text>
<rect x="196" y="64" width="88" height="52" rx="6" fill="var(--c1)"/>
<text x="240" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3 Sign-off</text>
<text x="240" y="102" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">komite</text>
<rect x="292" y="64" width="88" height="52" rx="6" fill="var(--c1)"/>
<text x="336" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">4 Deploy</text>
<text x="336" y="102" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">[M8.4]</text>
<rect x="388" y="64" width="88" height="52" rx="6" fill="var(--c1)"/>
<text x="432" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">5 Monitoring</text>
<text x="432" y="102" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">[M7.5]</text>
<line x1="92" y1="90" x2="100" y2="90" stroke="var(--text)" stroke-width="2"/>
<polygon points="100,86 100,94 108,90" fill="var(--text)"/>
<line x1="188" y1="90" x2="196" y2="90" stroke="var(--text)" stroke-width="2"/>
<polygon points="196,86 196,94 204,90" fill="var(--text)"/>
<line x1="284" y1="90" x2="292" y2="90" stroke="var(--text)" stroke-width="2"/>
<polygon points="292,86 292,94 300,90" fill="var(--text)"/>
<line x1="380" y1="90" x2="388" y2="90" stroke="var(--text)" stroke-width="2"/>
<polygon points="388,86 388,94 396,90" fill="var(--text)"/>
<text x="48" y="140" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">owner</text>
<text x="144" y="140" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">independen</text>
<text x="240" y="140" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">tanda tangan</text>
<text x="336" y="140" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">shadow/canary</text>
<text x="432" y="140" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">PSI + fairness</text>
<polyline points="432,116 432,176 48,176 48,122" fill="none" stroke="var(--c2)" stroke-width="2" stroke-dasharray="5 3"/>
<polygon points="44,122 52,122 48,114" fill="var(--c2)"/>
<text x="240" y="196" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">temuan monitoring kembali ke proposal lewat revalidasi (langkah 7)</text>
<text x="240" y="214" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">setiap tahap bisa MENGHENTIKAN alur — tahap yang tidak bisa berhenti bukan gerbang</text>
</svg>`,
        alt: "Alur approval lima tahap: Proposal, Validasi M8.1, Sign-off, Deploy M8.4, Monitoring M7.5; panah putus-putus dari Monitoring kembali ke Proposal lewat revalidasi.",
        caption: "Cara membaca: lima tahap berurutan dari kiri ke kanan, masing-masing dengan pemiliknya (owner, validator independen, komite, owner, analis). Panah putus-putus di bawah adalah umpan baliknya: temuan monitoring tidak berhenti di dashboard — ia kembali ke proposal sebagai revalidasi (langkah 7).",
      },
      tasks: [],
    },
    {
      id: "sign-off",
      eyebrow: "Langkah 5 · Sign-off",
      title: "Apa arti tanda tangan: penandatangan ikut menanggung risiko",
      prose: [
        "Sign-off adalah momen ketika seseorang menuliskan namanya di bawah kalimat «saya sudah memeriksa ini, dan saya menyetujui pemakaiannya». Empat tanda tangan pada model kita, masing-masing atas bagiannya sendiri: VALIDATOR menandatangani opini validasi — «saya memeriksa model ini secara independen, dan inilah yang saya temukan, termasuk kelemahannya». MODEL OWNER menandatangani pemakaian bisnis — «saya memakai model ini untuk memutuskan kredit, dalam batas yang tertulis di model card, dan saya bertanggung jawab saat ia live». LEGAL/RISK menandatangani kepatuhan — «pemakaian ini sudah diperiksa terhadap aturan yang berlaku dan risiko yang diketahui». KOMITE menandatangani persetujuan akhir — «berdasarkan opini, model card, dan ekonomi, model ini BOLEH dipakai». Tidak ada satu pun dari keempatnya yang menandatangani pekerjaan orang lain — dan tidak ada satu pun yang bisa berkata «saya hanya mengikuti» sesudahnya.",
        "Syarat sebelum menandatangani — tiga dokumen yang WAJIB dibaca, bukan diringkas orang lain: opini validasi [M8.1] (termasuk belahan A vs B dan sensitivitas seed), model card [M8.3] (tujuan, batas, data, dan versi model), dan ekonomi threshold [M6.4] (biaya dan profit pada threshold yang disetujui — pada 0,10: cost NT$33.046.500, profit +NT$8.214.000). Penandatangan yang belum membaca ketiganya sedang menandatangani sesuatu yang tidak ia ketahui — dan itu bukan persetujuan, itu undian.",
        "Nilai: sign-off bagus karena ia mengubah «keputusan bersama» yang kabur menjadi EMPAT jawaban yang bisa ditagih satu per satu. Pada hari kerugian datang, tidak ada lagi kalimat «kami semua memutuskan» — yang ada adalah empat nama, empat bagian, dan empat dokumen yang masing-masing bisa dibuka dan diperiksa.",
        "Baik atau buruk: sign-off bagus bila penolakan adalah hasil yang NYATA dan pernah terjadi — komite yang tidak pernah menolak sedang tidak menilai, ia sedang mengesahkan (langkah 9). Buruk bila tanda tangan dikumpulkan sesudah deploy: tanda tangan yang datang belakangan bukan persetujuan — ia pembenaran. Urutannya tidak bisa dinegosiasikan: tanda tangan dulu, deploy kemudian.",
        "Mitigasi: tuliskan di lembar sign-off SATU baris penolakan: «saya menolak karena …» dengan ruang kosong yang sama besarnya dengan ruang tanda tangan. Formulir yang tidak menyediakan ruang untuk menolak sedang memberi tahu penandatangannya bahwa penolakan bukan pilihan.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: tanda tangan berarti model dijamin tidak pernah salah",
        type: "pitfall",
        body: "Yang benar: tanda tangan berarti «berdasarkan bukti yang ada saat ini, risiko pemakaian ini bisa diterima» — bukan jaminan. Model dengan ROC-AUC 0,7816 [M6.4] tetap salah mengurutkan 21,84% pasangan (positif, negatif) acak — 1 − AUC adalah peluang satu pasangan acak terbalik urutannya, bukan 21,84% nasabah; threshold 0,10 tetap menyetujui 114 nasabah yang kemudian default [M6.4]. Yang dijamin tanda tangan bukanlah kesempurnaan — melainkan bahwa risiko itu DIKETAHUI, DIUKUR, dan ada yang MENANGGUNGNYA.",
      },
    },
    {
      id: "exception-management",
      eyebrow: "Langkah 5a · Setelah sign-off",
      title: "Exception: jalan darurat yang tercatat — dengan tanggal kedaluwarsa",
      prose: [
        "Tidak semua penyimpangan dari alur adalah pelanggaran — kadang alur memang tidak bisa diikuti, dan yang dibutuhkan adalah JALAN DARURAT YANG TERCATAT: exception (pengecualian) atau override. Exception adalah izin TERTULIS untuk melewati satu gerbang atau satu aturan, untuk satu model, untuk waktu yang TERBATAS — dengan syarat yang ditulis di muka. Template exception request punya sepuluh kolom: reason (mengapa gerbang ini tidak bisa dilewati sekarang), affected model/version (model dan versi yang terkena — bukan «semua model»), gate bypassed (gerbang atau aturan mana yang dilewati — ditulis namanya, bukan «prosedur»), risk assessment (apa risikonya bila gerbang ini dilewati — dengan angka bila ada), compensating controls (kontrol pengganti selama exception berlaku — siapa yang memeriksa apa, seberapa sering), start/end time (kapan mulai, kapan berakhir — tanggal, bukan «sampai selesai»), approver (siapa yang menyetujui — komite, bukan owner sendiri), monitoring cadence (seberapa sering exception ini diperiksa selama berlaku), exit criteria (kondisi apa yang mengakhiri exception — gerbang dilewati, atau exception dicabut), ratification (komite meninjau dan mengesahkan atau mencabut exception itu pada pertemuan berikutnya).",
        "Tiga aturan yang membuat exception menjadi pengaman, bukan lubang. SATU — exception tanpa expiry OTOMATIS INVALID: exception yang tidak punya end time bukan exception — ia perubahan permanen yang menyamar. Bila end time lewat tanpa perpanjangan tertulis dari komite, exception itu MATI dengan sendirinya: model kembali ke aturan normal, dan bila itu berarti rollback, maka rollback (M8.4). DUA — hard constraint TIDAK BISA di-exception-kan: fairness AIR di bawah 0,80 [kebijakan M7.5] dan ECE di atas 0,02 [kebijakan lesson ini] adalah garis yang tidak boleh dilewati — berapa pun alasannya (langkah 6a, M8.4). Yang bisa di-exception-kan adalah gate PROSEDURAL — menunda revalidasi kalender 2 minggu karena validator belum tersedia, atau deploy dengan satu dokumen yang menyusul dalam 5 hari — bukan ambang keamanan. TIGA — exception yang diperpanjang DUA KALI menjadi change request: bila satu exception butuh diperpanjang kedua kalinya, itu bukan lagi «darurat sementara» — ia perubahan permanen yang harus lewat change control enam gerbang (langkah 6). Aturan ini mencegah exception menjadi cara untuk menghindari gerbang secara permanen, satu perpanjangan demi satu perpanjangan.",
        "Contoh [ilustrasi] — exception yang SAH. Revalidasi kalender flagship jatuh tempo minggu ini, tapi validator independen belum tersedia (cuti) selama 2 minggu. Exception: menunda revalidasi 14 hari. Gate bypassed: pemicu kalender (langkah 7). Risk assessment: model tetap dimonitor harian; PSI terakhir 0,0017, jauh di bawah 0,25 — risiko penundaan 2 minggu rendah. Compensating controls: risk manager memeriksa PSI + approval rate HARIAN selama 14 hari (bukan mingguan), dan alert fairness tetap menyala. Start/end: 13–27 November 2026 [ilustrasi]. Approver: komite. Monitoring cadence: harian. Exit criteria: laporan revalidasi diserahkan 27 November, atau exception dicabut dan revalidasi dipercepat. Ratification: komite meninjau pada pertemuan 20 November. Yang membuat exception ini sah bukan isinya yang «masuk akal» — melainkan kesepuluh kolomnya terisi, expiry-nya tertulis, dan kontrol penggantinya konkret. Contoh yang TIDAK sah: «deploy dulu, dokumen menyusul» tanpa tanggal, tanpa approver, tanpa kontrol pengganti — itu bukan exception, itu melewati gerbang tanpa izin.",
        "Nilai: exception bagus karena ia memberi jalan keluar yang JUJUR saat alur buntu: daripada melewati gerbang diam-diam (mini-case langkah 10), tim meminta izin tertulis dengan expiry dan kontrol pengganti — dan komite bisa menolak. Buruk bila exception menjadi kebiasaan: komite yang menyetujui exception tiap minggu sedang tidak mengelola pengecualian — ia sedang mengelola aturan yang tidak pernah ditegakkan. Dan buruk bila exception dicatat di chat atau email: exception yang tidak ada di audit trail (langkah 8) adalah exception yang tidak pernah ada saat audit datang.",
        "Mitigasi: simpan SEMUA exception di SATU register yang sama dengan issue register [M8.1] — dan di tiap pertemuan komite, baca daftar exception yang masih berlaku LEBIH DULU sebelum agenda lain: exception yang sudah lewat expiry tanpa perpanjangan adalah exception yang sudah mati — dan model yang masih berjalan atasnya adalah model yang berjalan tanpa izin.",
      ],
      tasks: [],
    },
    {
      id: "change-control",
      eyebrow: "Langkah 6 · Change control",
      title: "Change control G10 [M7.4]: enam gerbang — bahkan untuk perubahan threshold",
      prose: [
        "Change control adalah aturan bahwa SETIAP perubahan yang mengubah keputusan model harus melewati enam gerbang yang sama — template G10 [M7.4]: (1) PROPOSAL: tuliskan perubahan ini DULU, sebelum satu baris kode berubah; (2) OFFLINE VALIDATION: ukur paket lengkap (ROC-AUC/PR-AUC, kalibrasi, AIR, biaya, profit) pada validation yang belum dipakai memilih; (3) LEGAL/RISK APPROVAL: penasihat hukum dan risk manager menandatangani template-nya — bukan slide-nya; (4) SHADOW/CANARY: jalankan versi baru berdampingan dengan versi lama pada sebagian trafik, bandingkan keputusan per nasabah; (5) PRODUCTION: versi baru berlaku, versi lama menjadi rollback version; (6) ROLLBACK CRITERIA — VERIFIKASI kriteria rollback yang ditulis di gerbang (1), sebelum produksi: kapan versi baru dicabut, dan ke versi apa kembali. Rollback untuk perubahan threshold di lesson ini [M7.4]: kembali ke threshold tunggal 0,10. Enam gerbang ini berlaku untuk perubahan model, fitur, kalibrasi, data, kode, DAN threshold — karena semuanya mengubah keputusan. Pemetaan ke lima tahap (Langkah 4): gerbang 1 = tahap 1 (proposal); gerbang 2 = tahap 2 (validasi); gerbang 3 = legal/risk approval + sign-off komite (Langkah 5); gerbang 4–5 = tahap deploy (Langkah 4); gerbang 6 = verifikasi kriteria rollback yang ditulis di gerbang 1.",
        "Contoh yang akan kamu hitung di lab 1 — perubahan threshold 0,10 ke 0,15 [M6.4]: approval rate 28,5% ke 49,88% (naik 21,38 poin persen; nasabah disetujui 1.710 ke 2.993, naik 1.283); bad rate yang disetujui 6,67% ke 8,99% (naik 2,32 poin persen; nasabah default yang disetujui 114 ke 269, naik 155); total cost NT$33.046.500 ke NT$35.770.000 (naik NT$2.723.500); profit +NT$8.214.000 ke +NT$5.490.500 (turun NT$2.723.500). Perhatikan: threshold hanya «satu angka» — tapi satu angka itu menggerakkan 1.283 keputusan, 155 default tambahan, dan NT$2.723.500. Dan sebagai peringatan eskalasi: bila threshold yang sama dinaikkan ke 0,20 [M6.4], profit berubah menjadi −NT$216.500 — perubahan «kecil» yang kedua sudah membalik profit menjadi rugi. AIR SEX pada 0,15 justru 0,8906 [m71_air_sex_by_threshold.0.15.air], sedikit lebih baik dari 0,8694 pada 0,10 [M7.1] — jadi fairness BUKAN alasan menolak perubahan ini; ekonominya yang harus diputuskan komite dengan mata terbuka.",
        "Nilai: enam gerbang bagus karena masing-masing menangkap satu jenis kegagalan yang berbeda — proposal menangkap perubahan yang tidak terpikir dampaknya; offline validation menangkap angka yang terlihat bagus di train tapi tidak di validation; legal/risk menangkap risiko yang bukan angka; shadow menangkap perbedaan keputusan per nasabah (pada model kita, 19,42% keputusan berubah antara champion dan challenger [M8] — angka ini dari dua model yang berbeda, bukan dari perubahan threshold; untuk perubahan threshold, tabel keputusan yang berubah dihitung ulang di gerbang 4); production yang tertib menangkap kekacauan versi; rollback criteria yang ditulis dulu menangkap kepanikan saat keadaan memburuk. Gerbang yang dilewati adalah kegagalan yang dibiarkan masuk.",
        "Baik atau buruk: change control bagus bila ia diterapkan pada perubahan KECIL dengan serius yang sama seperti perubahan besar — karena data lesson ini membuktikan perubahan «kecil» (0,10 ke 0,15) menggerakkan NT$2.723.500. Buruk bila gerbang hanya diterapkan pada perubahan yang TERLIHAT besar: threshold yang diubah lewat satu baris konfigurasi adalah perubahan yang paling mudah lolos diam-diam — dan justru itu yang paling butuh gerbang.",
        "Mitigasi: definisikan «perubahan» secara operasional — APA PUN yang mengubah keputusan untuk satu nasabah pun adalah perubahan: threshold, fitur, kalibrasi, data training, kode scoring, bahkan urutan kolom. Bila definisinya kabur, orang akan berdebat apakah sesuatu itu «perubahan» atau bukan — dan perdebatan itu sendiri adalah celah.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Change control enam gerbang: 1 Proposal, 2 Offline validation, 3 Legal risk approval, 4 Shadow canary, 5 Production, 6 Rollback gate (verifikasi kriteria yang ditulis di gerbang 1); pemicu revalidasi kembali ke gerbang 1; rollback versi 2 adalah threshold tunggal 0,10">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Change control G10 [M7.4] — enam gerbang, berurutan</text>
<rect x="8" y="44" width="148" height="44" rx="6" fill="var(--c1)"/>
<text x="82" y="62" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1 Proposal</text>
<text x="82" y="78" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">tulis dulu</text>
<rect x="164" y="44" width="148" height="44" rx="6" fill="var(--c1)"/>
<text x="238" y="62" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2 Offline validation</text>
<text x="238" y="78" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">paket lengkap</text>
<rect x="320" y="44" width="148" height="44" rx="6" fill="var(--c1)"/>
<text x="394" y="62" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3 Legal / risk approval</text>
<text x="394" y="78" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">tanda tangani template</text>
<rect x="8" y="112" width="148" height="44" rx="6" fill="var(--c1)"/>
<text x="82" y="130" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">4 Shadow / canary</text>
<text x="82" y="146" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">berdampingan dulu</text>
<rect x="164" y="112" width="148" height="44" rx="6" fill="var(--c1)"/>
<text x="238" y="130" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">5 Production</text>
<text x="238" y="146" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">v1 jadi rollback</text>
<rect x="320" y="112" width="148" height="44" rx="6" fill="var(--c2)"/>
<text x="394" y="130" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">6 Rollback gate</text>
<text x="394" y="146" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">verifikasi — ditulis di gerbang 1</text>
<line x1="156" y1="66" x2="164" y2="66" stroke="var(--text)" stroke-width="2"/>
<polygon points="164,62 164,70 172,66" fill="var(--text)"/>
<line x1="312" y1="66" x2="320" y2="66" stroke="var(--text)" stroke-width="2"/>
<polygon points="320,62 320,70 328,66" fill="var(--text)"/>
<polyline points="394,88 394,100 82,100 82,112" fill="none" stroke="var(--text)" stroke-width="2"/>
<polygon points="78,112 86,112 82,120" fill="var(--text)"/>
<line x1="312" y1="134" x2="320" y2="134" stroke="var(--text)" stroke-width="2"/>
<polygon points="320,130 320,138 328,134" fill="var(--text)"/>
<line x1="156" y1="134" x2="164" y2="134" stroke="var(--text)" stroke-width="2"/>
<polygon points="164,130 164,138 172,134" fill="var(--text)"/>
<rect x="8" y="176" width="460" height="30" rx="6" fill="var(--c1)"/>
<text x="238" y="195" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Pemicu revalidasi kembali ke gerbang 1: data baru · penggunaan baru · temuan monitoring · kalender</text>
<text x="240" y="226" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Rollback v2 = threshold tunggal 0,10 [M7.4]</text>
</svg>`,
        alt: "Change control enam gerbang: 1 Proposal, 2 Offline validation, 3 Legal risk approval, 4 Shadow canary, 5 Production, 6 Rollback gate (verifikasi kriteria yang ditulis di gerbang 1); pemicu revalidasi kembali ke gerbang 1; rollback v2 adalah threshold tunggal 0,10.",
        caption: "Cara membaca: gerbang 1–3 di baris atas, 4–6 di baris bawah — ikuti panahnya, berurutan, tidak ada yang boleh dilewati. Gerbang 6 berwarna berbeda karena ia MEMVERIFIKASI kriteria rollback yang ditulis di gerbang 1, sebelum produksi — bukan sesudah masalah datang. Strip bawah: empat pemicu revalidasi (langkah 7) yang mengembalikan perubahan apa pun ke gerbang 1.",
      },
      tasks: [],
    },
    {
      id: "decision-protocol",
      eyebrow: "Langkah 6a · Setelah change control",
      title: "Decision protocol: keputusan komite yang sah — kuorum, recusal, dan jejak digital",
      prose: [
        "Change control (langkah 6) memberitahu gerbang apa yang dilewati — tapi tidak memberitahu BAGAIMANA komite memutuskan. DECISION PROTOCOL adalah aturan tentang keputusan komite itu sendiri. Tujuh unsur: (1) quorum minimum [kebijakan organisasi] — jumlah anggota minimum agar keputusan SAH; tanpa kuorum, keputusan tidak ada, berapa pun yang hadir setuju. (2) recusal — anggota yang punya conflict of interest (mis. ia yang membangun model itu, atau bonusnya bergantung pada deploy-nya) WAJIB mengundurkan diri dari pembahasan dan pemungutan suara atas model itu — dan recusal-nya dicatat. (3) delegated authority — apa yang bisa diputuskan ketua sendirian (mis. perpanjangan exception 3 hari [kebijakan organisasi]) dan apa yang wajib komite penuh (persetujuan deploy, pencabutan approval) — ditulis, bukan ditebak. (4) tie-breaker/eskalasi — bila suara seri, keputusan TIDAK diambil di ruangan itu: ia dieskalasikan ke tingkat yang lebih tinggi [kebijakan organisasi] — ketua tidak memaksakan suaranya sendiri. (5) approval timestamp — tanggal dan jam keputusan, tercatat bersama versinya. (6) digital evidence — bukti keputusan adalah rekaman yang ditandatangani secara digital (lembar sign-off + notulen), bukan pesan chat atau «katanya sudah disetujui». (7) SLA keputusan [kebijakan organisasi] — berapa lama komite harus memutuskan atas temuan KUNING dan MERAH: temuan MERAH diputuskan lebih cepat dari KUNING, dan keduanya punya batas waktu tertulis — komite yang menunda tanpa batas sedang membiarkan risiko berjalan.",
        "Mini-case [ilustrasi] — keputusan yang TIDAK SAH. Komite model risk beranggotakan 5 orang. Agenda: menyetujui deploy v2.1 flagship. Yang hadir: 2 anggota + ketua. Kuorum minimum [kebijakan organisasi] tidak tercapai — keputusan yang diambil ruangan itu TIDAK SAH, walau ketiga yang hadir semuanya setuju. Tambah lagi: salah satu dari 2 anggota itu adalah model owner v2.1 — ia punya conflict of interest dan seharusnya recusal, sehingga yang sah membahas tinggal 1 anggota + ketua. Dan suara akhirnya 1–1 (1 anggota yang sah + ketua — dua anggota yang tidak hadir mengirim suara tertulis, tetapi suara tertulis dari anggota yang tidak hadir dalam pembahasan TIDAK DIHITUNG [kebijakan organisasi]) — seri, jadi keputusannya dieskalasikan, bukan dipaksakan ketua. Tiga kesalahan dalam satu ruangan: tanpa kuorum, tanpa recusal, dan keputusan dipaksakan padahal suara seri dan ruangan tidak sah. Pelajarannya: keputusan yang prosedurnya salah adalah keputusan yang tidak ada — berapa pun isinya benar. Dan «semua yang hadir setuju» bukan bukti apa-apa bila yang hadir tidak cukup untuk memutuskan.",
        "Nilai: protokol bagus karena ia memisahkan ISI keputusan dari SAHNYA keputusan: komite bisa menyetujui model yang benar dengan cara yang salah — dan cara yang salah itu membatalkan persetujuannya. Tanpa protokol, «komite sudah menyetujui» adalah klaim yang tidak bisa diperiksa: siapa yang hadir, siapa yang recusal, berapa suaranya, kapan diputuskan — tidak ada yang tercatat. Buruk bila protokol hanya ada di atas kertas dan tidak pernah ditegakkan: kuorum yang «biasanya dilonggarkan» bukan kuorum — ia kebiasaan yang menunggu audit.",
        "Baik atau buruk: protokol bagus bila ditegakkan pada keputusan yang TIDAK POPULER — menolak deploy yang sudah dijadwalkan karena kuorum tidak tercapai adalah bukti protokolnya hidup. Buruk bila protokol hanya ditegakkan saat mudah: komite yang melonggarkan kuorum «karena mendesak» sedang memberi tahu semua orang bahwa kuorum adalah saran, bukan aturan. Dan buruk bila digital evidence-nya adalah tangkapan layar chat: bukti yang bisa diedit sesudahnya bukan bukti.",
        "Mitigasi: sebelum tiap pertemuan, periksa tiga hal: kuorum tercapai? ada yang harus recusal? siapa yang mencatat + menandatangani digital? Bila satu saja tidak, pertemuan itu bukan rapat komite — ia diskusi. Dan simpan protokol ini BERSAMA audit trail (langkah 8): keputusan tanpa jejak digital adalah keputusan yang tidak pernah diambil.",
      ],
      tasks: [],
    },
    {
      id: "revalidation-triggers",
      eyebrow: "Langkah 7 · Pemicu revalidasi",
      title: "Kapan validasi ulang wajib: data baru, penggunaan baru, temuan monitoring, kalender",
      prose: [
        "Revalidasi adalah pemeriksaan independen ULANG atas model yang sudah live — bukan retrain, bukan monitoring. Monitoring [M7.5] bertanya «apakah angkanya masih normal?»; revalidasi bertanya «apakah model ini MASIH LAYAK dipakai, dengan bukti yang sama ketatnya seperti saat pertama disetujui?». Empat pemicu yang mewajibkannya — dan tidak satu pun boleh dinegosiasikan oleh owner sendirian: (1) DATA BARU: snapshot data yang berbeda secara material dari yang dipakai melatih — populasi baru, periode baru, atau definisi kolom yang berubah. (2) PENGGUNAAN BARU: model dipakai untuk tujuan atau populasi yang tidak tercantum dalam persetujuan awal — misalnya model kredit kartu dipakai untuk menilai pinjaman lain, atau dipakai pada segmen yang dulu tidak termasuk. (3) TEMUAN MONITORING [M7.5]: PSI skor di atas 0,25 [kebijakan lesson ini] (geser besar — seperti simulasi drift S2, PSI 0,5811 [m75_drift_simulations.S2_pay_plus1.psi_score_vs_baseline_test]), ROC-AUC turun lebih dari 0,02 [kebijakan lesson ini] atau PR-AUC turun lebih dari 0,03 [kebijakan lesson ini] dalam 2 periode berturut-turut, ECE di atas 0,02 [kebijakan lesson ini] yang bertahan, atau alert fairness yang menyala — AIR grup mana pun di bawah 0,80 [kebijakan lesson ini] selama 2 periode berturut-turut. (4) KALENDER: revalidasi terjadwal — [keputusan kebijakan lesson ini] paling lambat 12 bulan sejak approval terakhir, walau tidak ada pemicu lain yang menyala; model yang tidak pernah diperiksa ulang adalah model yang menua diam-diam.",
        "Hasil revalidasi hanya ada tiga: MASIH LAYAK (lanjut, dengan catatan), LAYAK DENGAN SYARAT (lanjut dengan perbaikan dan batas waktu — misalnya threshold dibekukan sampai kalibrasi diperiksa ulang), atau TIDAK LAYAK (persetujuan dicabut, rollback ke versi sebelumnya — untuk threshold, kembali ke 0,10 [M7.4]). Yang penting: revalidasi dilakukan validator yang SAMA independennya dengan validasi awal [M8.1] — owner tidak memvalidasi ulang karyanya sendiri, dan komite yang memutuskan hasilnya.",
        "Nilai: pemicu revalidasi yang tertulis bagus karena ia menghilangkan perdebatan «apakah ini sudah cukup parah untuk diperiksa?» — jawabannya sudah ditulis sebelum masalah datang. PSI simulasi drift S2 0,5811 tidak perlu diperdebatkan; ia sudah masuk daftar pemicu sejak hari pertama.",
        "Baik atau buruk: revalidasi berkala bagus karena ia menangkap decay bertahap yang tidak pernah melewati ambang harian — model yang memburuk sedikit demi sedikit, periode demi periode. Buruk bila revalidasi hanya dipicu kalender dan temuan monitoring diabaikan: jadwal tahunan tidak menolong bila PSI sudah 0,5811 (simulasi drift S2) di bulan ketiga. Kedua jenis pemicu harus hidup bersamaan — kalender sebagai jaring pengaman, temuan sebagai alarm.",
        "Mitigasi: tuliskan keempat pemicu ini di model card [M8.3] — di samping tanggal approval — sehingga siapa pun yang membaca model card tahu persis kapan model ini harus diperiksa ulang, tanpa perlu bertanya kepada owner. Dan di revalidasi, baris pertama yang diperiksa adalah issue register lama [M8.1]: temuan yang masih terbuka dari validasi sebelumnya adalah temuan pertama di laporan baru — dan temuan yang melewati due_date tanpa perpanjangan tertulis dari komite adalah pemicu revalidasi (langkah 10a, M8.1).",
      ],
      tasks: [],
      note: {
        title: "Jebakan: satu periode buruk disangka pemicu revalidasi",
        type: "risk",
        body: "Yang benar: satu periode buruk adalah urusan MONITORING (waspada, pantau periode berikutnya), bukan revalidasi. Chunk 2 [waktu semu] — ROC-AUC 0,7428, bad rate 10,74% [m75_pseudo_time_chunks_test] — lalu chunk 3 membaik ke 0,8138; revalidasi di chunk 2 berarti memeriksa ulang model yang sehat karena noise. Pemicu monitoring butuh 2 periode berturut-turut atau PSI di atas 0,25 — syarat yang sama berlaku sebelum revalidasi dipanggil.",
      },
    },
    {
      id: "audit-trail",
      eyebrow: "Langkah 8 · Audit trail",
      title: "Audit trail: sepuluh kolom G10 [M7.4] — jejak yang bisa dibuka setahun kemudian",
      prose: [
        "Audit trail adalah catatan yang menjawab tiga pertanyaan tentang SETIAP keputusan model: APA yang berubah, KENAPA berubah, dan SIAPA yang menyetujui, KAPAN. Template G10 [M7.4] menetapkan sepuluh kolom wajib untuk setiap versi model — tidak sembilan, tidak «hampir lengkap»: (1) model version, (2) feature schema version, (3) calibration version, (4) threshold policy version, (5) data snapshot, (6) code/notebook hash, (7) approval date, (8) owner, (9) rollback version, (10) alasan perubahan. Sepuluh kolom ini adalah SATU paket: model card [M8.3] menjelaskan modelnya, audit trail menjelaskan KEPUTUSANNYA — dan keduanya merujuk ke versi yang sama, sehingga setahun kemudian siapa pun bisa merekonstruksi «versi berapa yang live pada tanggal itu, dengan threshold berapa, disetujui siapa, dan bagaimana cara kembali».",
        "Perhatikan kolom yang paling sering hilang — dan paling mahal saat hilang. Feature schema version: tanpa ini, kamu tidak tahu fitur apa yang dipakai versi itu — dan validasi ulangmu memakai skema yang salah. Calibration version: tanpa ini, kamu tidak tahu apakah 0,10 yang tercatat adalah 0,10 dari model terkalibrasi atau 0,10 dari model mentah — dan keduanya berarti hal yang berbeda (pemetaan probabilitas berbeda: Brier mentah 0,1342 vs terkalibrasi 0,1345; LR mentah pada 0,10 menyetujui 20,25% vs champion 28,5% [M8]). Code/notebook hash: tanpa ini, kamu tidak bisa membuktikan kode mana yang menghasilkan model itu. Rollback version: tanpa ini, kamu tahu harus kembali — tapi tidak tahu ke mana. Di lab 2, kamu akan memeriksa log [ilustrasi] yang kehilangan empat kolom ini dan membuktikan bahwa kelengkapan 0,6 berarti audit GAGAL.",
        "Nilai: audit trail yang lengkap bagus karena ia membuat keputusan BISA DIBUKTIKAN, bukan hanya diingat. «Kami menyetujui threshold 0,15 pada 13 November» adalah klaim; baris audit trail dengan sepuluh kolom terisi adalah bukti. Bedanya terasa pada hari audit datang — atau pada hari kerugian harus dijelaskan.",
        "Baik atau buruk: sepuluh kolom ini bagus sebagai STANDAR MINIMUM — cukup untuk merekonstruksi, tidak berlebihan sampai tidak ada yang mau mengisinya. Buruk bila trail ditulis BELAKANGAN dari ingatan: catatan yang direkonstruksi sesudah audit diumumkan bukan audit trail — ia karangan. Trail ditulis SAAT keputusan diambil, oleh sistem yang mencatatnya, bukan oleh orang yang mengingatnya.",
        "Mitigasi: jadikan kelengkapan audit trail sebagai SYARAT deploy, bukan tugas administrasi sesudahnya — deploy tidak jalan bila satu kolom kosong. Lab 2 menunjukkan alasannya: log dengan 6 dari 10 kolom terisi (completeness 0,6) tidak boleh naik produksi, betapa pun bagusnya model di baliknya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: audit trail sama dengan model card",
        type: "pitfall",
        body: "Yang benar: model card [M8.3] menjelaskan MODELNYA — tujuan, data, batas, performa. Audit trail menjelaskan KEPUTUSANNYA — siapa mengubah apa, kapan, kenapa, dan bagaimana kembali. Model card tanpa audit trail adalah spesifikasi tanpa sejarah; audit trail tanpa model card adalah sejarah tanpa isi. Keduanya dibutuhkan, dan keduanya merujuk ke versi model yang sama.",
      },
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 9 · Jebakan",
      title: "Jebakan: sign-off sebagai stempel karet — komite yang tidak pernah menolak",
      prose: [
        "Jebakan paling berbahaya di lesson ini tidak terlihat seperti kegagalan — ia terlihat seperti kelancaran. Komite yang menyetujui SEMUA proposal, validator yang tidak pernah menemukan kelemahan, sign-off yang selesai dalam lima menit, template G10 yang disalin dari proposal sebelumnya dengan tanggal diganti. Semuanya «berjalan lancar» — dan justru itu tandanya: sistem yang tidak pernah berkata tidak sedang tidak menilai apa pun. Stempel karet punya tiga gejala yang bisa diperiksa dari luar: (1) tingkat penolakan NOL dalam jangka panjang — komite yang sehat menolak atau meminta syarat pada sebagian proposal, karena sebagian proposal memang belum siap; (2) sign-off sesudah deploy — tanda tangan yang dikumpulkan belakangan adalah pembenaran, bukan persetujuan; (3) opini validasi yang tidak pernah menyebut kelemahan — padahal model dengan ROC-AUC 0,7816 [M6.4] punya kelemahan yang TERUKUR (belahan A vs B berselisih −0,0139 [M8.1]; seed menggerakkan approval 0,63 poin persen [M8.1]), jadi opini tanpa kelemahan adalah opini yang tidak memeriksa.",
        "Kenapa stempel karet terjadi — tiga penyebab yang semuanya manusiawi: TEKANAN WAKTU («bisnis sudah menunggu, jangan perlambat»); DEFERENSI («validator pasti sudah memeriksa, saya tidak perlu membaca»); dan INSENTIF («komite yang menolak dianggap penghambat, bukan penjaga»). Tidak satu pun dari ketiganya jahat — dan ketiganya cukup untuk melumpuhkan governance tanpa satu pun aturan yang dilanggar secara formal.",
        "Nilai: mengenali stempel karet bagus karena ia satu-satunya jebakan governance yang TIDAK menghasilkan alarm — PSI tidak berteriak, ROC-AUC tidak turun, dashboard hijau. Satu-satunya detektornya adalah audit internal (langkah 2) yang memeriksa PROSES: berapa proposal ditolak, berapa sign-off yang datang sesudah deploy, berapa opini yang menyebut kelemahan.",
        "Baik atau buruk: komite yang cepat menyetujui bagus bila kecepatannya datang dari proposal yang memang siap — validator yang tajam, angka yang lengkap, ekonomi yang jujur. Buruk bila kecepatannya datang dari tidak adanya pemeriksaan: persetujuan lima menit atas perubahan threshold yang menggerakkan NT$2.723.500 [M6.4] bukan efisiensi — ia kelalaian yang rapi.",
        "Mitigasi: tiga pengunci — (1) deploy diblokir sistem tanpa nomor persetujuan komite yang tercatat; (2) audit internal mengambil sampel keputusan tiap kuartal dan melaporkan tingkat penolakan serta sign-off terlambat; (3) penolakan dicatat sebagai HASIL KERJA yang sah — validator dan komite dinilai dari ketajaman temuannya, bukan dari kecepatan persetujuannya.",
      ],
      tasks: [],
      note: {
        title: "Gejala yang bisa dicek hari ini: kapan terakhir kali komite berkata tidak?",
        type: "risk",
        body: "Yang benar: bila jawabannya «tidak pernah» atau «tidak ingat», itu bukan bukti komite bekerja baik — itu bukti komite tidak sedang menilai. Tanyakan juga: berapa opini validasi terakhir yang menyebut kelemahan? Bila nol, validator sedang tidak memeriksa. Dua pertanyaan ini lebih murah daripada satu audit — dan lebih jujur daripada dashboard yang hijau.",
      },
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: alur perubahan threshold 0,10 ke 0,15 — siapa harus setuju, gerbang mana dilewati?",
      prose: [
        "Kasusnya nyata, angkanya kanonis [M6.4]: tim bisnis mengusulkan threshold naik dari 0,10 ke 0,15 — «supaya lebih banyak nasabah disetujui, volume naik». Ikuti alurnya gerbang demi gerbang. GERBANG 1 — PROPOSAL: owner menulis perubahan + alasannya + dampak yang dihitung DULU: approval 28,5% ke 49,88% (+21,38 poin persen, +1.283 nasabah), bad rate 6,67% ke 8,99% (+2,32 poin persen, +155 default yang disetujui), cost NT$33.046.500 ke NT$35.770.000 (+NT$2.723.500), profit +NT$8.214.000 ke +NT$5.490.500 (−NT$2.723.500). GERBANG 2 — OFFLINE VALIDATION: validator independen mengulang paket lengkap pada validation yang belum dipakai memilih — termasuk AIR SEX (0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air] — fairness sedikit MEMBAIK, jadi bukan alasan menolak) dan stabilitas belahan A vs B [M8.1]. GERBANG 3 — LEGAL/RISK APPROVAL: legal dan risk manager menandatangani template-nya — termasuk pertanyaan «apakah 155 default tambahan ini masih dalam selera risiko?» — bukan slide bisnisnya. GERBANG 4 — SHADOW/CANARY: threshold 0,15 dijalankan berdampingan dengan 0,10 pada sebagian trafik; keputusan per nasabah dibandingkan — berapa yang berubah, siapa mereka. GERBANG 5 — PRODUCTION: 0,15 berlaku, 0,10 menjadi rollback version. GERBANG 6 — ROLLBACK CRITERIA, VERIFIKASI kriteria yang ditulis di gerbang 1 sebelum produksi: cabut 0,15 dan kembali ke 0,10 bila bad rate yang disetujui melewati ambang yang ditulis (misalnya di atas 10% selama 2 periode [kebijakan lesson ini]) atau AIR SEX jatuh di bawah 0,80 [kebijakan lesson ini].",
        "Sekarang bandingkan dengan jalan pintasnya: threshold diubah diam-diam — satu baris konfigurasi, tanpa proposal, tanpa validasi, tanpa tanda tangan. Dampak angkanya SAMA (profit tetap turun NT$2.723.500) — tapi tiga hal hilang: tidak ada yang bisa dimintai pertanggungjawaban (RACI langkah 3 tidak punya nama), rollback version tidak tercatat (audit trail langkah 8 berlubang — kolom ke-9 kosong), dan komite tidak pernah mendapat kesempatan menolak atau meminta syarat. Bila bad rate yang disetujui kemudian benar-benar melewati 10%, tidak ada kriteria rollback yang ditulis — jadi tidak ada yang tahu kapan harus kembali, atau ke mana.",
        "Nilai: mini-case ini bagus karena ia menunjukkan bahwa governance BUKAN tentang menolak perubahan — threshold 0,15 MUNGKIN saja disetujui komite, karena AIR-nya membaik dan profitnya masih positif (+NT$5.490.500). Governance adalah tentang MEMUTUSKAN dengan mata terbuka, oleh orang yang tepat, dengan jejak yang lengkap — bukan tentang berkata tidak pada semua perubahan.",
        "Baik atau buruk: perubahan 0,10 ke 0,15 bagus sebagai CONTOH karena angkanya cukup besar untuk serius (NT$2.723.500) tapi cukup kecil untuk menggoda jalan pintas («hanya threshold»). Buruk bila dibaca sebagai «jadi 0,15 pasti disetujui»: komite bisa saja menolak — misalnya karena selera risiko tidak mengizinkan +155 default tambahan — dan penolakan itu adalah HASIL YANG SAH dari alur ini.",
        "Mitigasi: sebelum mengusulkan perubahan apa pun, hitung dulu dampaknya seperti di atas — approval, bad rate, cost, profit, jumlah nasabah yang keputusannya berubah — dan lampirkan angka itu pada proposal. Proposal tanpa angka dampak bukan proposal; ia permintaan.",
      ],
      tasks: [],
      note: {
        title: "Pertanyaan penutup mini-case: siapa yang rugi bila perubahan ini dilewati diam-diam?",
        type: "risk",
        body: "Yang benar: bukan hanya perusahaan (kerugian profit NT$2.723.500 dari perubahan threshold 0,10 ke 0,15 [M6.4]) — tapi juga analis yang akan disalahkan atas kerugian yang bukan keputusannya, dan nasabah yang keputusannya berubah tanpa ada yang menyetujui perubahan itu. Kerugian yang tidak bisa dipertanggungjawabkan merugikan SEMUA pihak — termasuk pihak yang mengubah threshold itu, yang kini tidak bisa membuktikan bahwa perubahannya sudah dipikirkan.",
      },
    },
    {
      id: "capstone",
      eyebrow: "Langkah 10a · Capstone wajib — akhir M8.5",
      title: "Capstone: satu perubahan, sembilan artefak — buktikan kamu bisa menjalankan governance-nya",
      prose: [
        "Capstone ini adalah ujian akhir Modul M8 — BUKAN lesson baru, melainkan tugas yang memakai SEMUA yang kamu pelajari di M8.1–M8.5. Kamu menerima SATU perubahan: threshold flagship diubah dari 0,10 menjadi 0,15 [M6.4]. Tugasmu: hasilkan SEMBILAN artefak — (1) validation report (M8.1): traffic-light verdict atas perubahan ini (apakah 0,15 masih layak — dengan CI bootstrap [turunan M8.1] dan desain validasi yang ditulis); (2) tiering score (M8.2): apakah tier flagship berubah karena perubahan ini (hitung skor 0,50×M + 0,30×C + 0,20×B — dan periksa shared dependency + vendor bila ada); (3) model card (M8.3): kartu 17 kolom (10 G10 + 7 penggunaan) untuk versi threshold baru — termasuk prohibited_use dan out_of_scope_trigger yang diperbarui; (4) shadow/canary decision (M8.4): apakah 0,15 naik langsung, lewat shadow, atau lewat canary — dengan ramp dan gate-nya; (5) gate sheet (M8.4): tujuh gate naik, masing-masing dengan angka dan status lolos/gagal; (6) rollback runbook (M8.4): 10 bagian, total di bawah 30 menit [kebijakan lesson ini]; (7) RACI/sign-off (M8.5): siapa R/A/C/I tiap tahap, dan empat tanda tangan atas bagiannya; (8) audit trail (M8.5): sepuluh kolom G10 untuk versi baru — kelengkapan 1,0; (9) keputusan final: NAIK / TIDAK NAIK / NAIK DENGAN SYARAT — dengan alasan satu paragraf yang merujuk ke artefak 1–8.",
        "Angka yang harus kamu pakai — semuanya sudah ada di lesson ini, jangan dihitung ulang dari nol dan jangan dikarang: approval 28,5% ke 49,88% (+21,38 poin persen, +1.283 nasabah), bad rate 6,67% ke 8,99% (+2,32 poin persen, +155 default disetujui), cost NT$33.046.500 ke NT$35.770.000 (+NT$2.723.500), profit +NT$8.214.000 ke +NT$5.490.500 (−NT$2.723.500); AIR SEX 0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air]; pada 0,20 profit sudah −NT$216.500. Keputusan yang diharapkan BUKAN «pasti naik» atau «pasti tidak naik» — mini-case lesson ini berkata 0,15 «mungkin saja disetujui» (AIR membaik, profit masih positif). Yang dinilai adalah APAKAH KEPUTUSANMU KONSISTEN dengan artefakmu: bila gate sheet-mu berkata G1 gagal tapi keputusan final-mu «NAIK», capstone-mu gagal — bukan karena vonisnya salah, melainkan karena artefakmu bertentangan satu sama lain.",
        "RUBRIC — sepuluh pemeriksaan, semuanya harus lolos (bukan skor rata-rata): (1) version ID konsisten — model_id, model_version, feature_schema_version, calibration_version, threshold_policy_version, deployment_id SAMA di kesembilan artefak (G13, M8.3); satu mismatch = GAGAL. (2) angka konsisten — approval, bad rate, cost, profit, AIR di semua artefak SAMA dengan angka di atas; satu angka yang berbeda tanpa penjelasan = GAGAL. (3) status gate konsisten — gate sheet, validation report, dan keputusan final berkata hal yang sama tentang tiap gate; gate yang «lolos» di satu artefak dan «gagal» di artefak lain = GAGAL. (4) owner tertulis — tiap artefak punya satu nama owner (bukan «tim»); artefak tanpa owner = GAGAL. (5) due date tertulis — tiap syarat dan temuan punya tanggal (issue register [M8.1]); syarat tanpa tanggal = GAGAL. (6) kondisi revalidation tertulis — pemicu revalidasi untuk versi baru ditulis di model card (langkah 7); tidak ada = GAGAL. (7) prohibited_use terisi — kartu tanpa penggunaan-terlarang = GAGAL (hard rule, M8.3). (8) rollback runbook < 30 menit — total di atas 30 menit [kebijakan lesson ini] = GAGAL. (9) RACI lengkap — tiap tahap punya tepat satu A; A kosong atau ganda = GAGAL. (10) keputusan final beralasan — satu paragraf yang merujuk ke artefak 1–8 dengan nomor; keputusan tanpa rujukan = GAGAL. Rubric ini adalah cermin dari governance itu sendiri: bukan «apakah kamu pintar», melainkan «apakah artefakmu bisa diaudit».",
        "Nilai: capstone bagus karena ia menguji hal yang tidak bisa diuji kuis: konsistensi LINTAS artefak. Kuis menguji apakah kamu tahu satu konsep; capstone menguji apakah sembilan dokumenmu bercerita tentang model yang SAMA. Di dunia nyata, itulah yang diperiksa auditor — bukan apakah kamu hafal definisi, melainkan apakah kartu, laporan, dan jejakmu cocok satu sama lain.",
        "Mitigasi: kerjakan capstone dengan checklist rubric di sampingmu — periksa satu item demi satu item SEBELUM menyerahkan. Dan bila kamu menemukan artefakmu bertentangan (gate sheet berkata lolos, validation report berkata gagal), jangan «memperbaiki» salah satunya diam-diam: tulis KENAPA mereka berbeda, dan mana yang benar menurut angka. Kontradiksi yang dijelaskan adalah temuan; kontradiksi yang disembunyikan adalah kegagalan audit.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 11 · Lab 1",
      title: "Lab: nilai perubahan threshold 0,10 ke 0,15 — dan putuskan gerbangnya",
      prose: [
        "Sekarang hitung sendiri harga perubahan threshold dari angka kanonis [M6.4] — GBM terkalibrasi, test 6.000, LGD 0,45, margin 0,05. Threshold 0,10: approval rate 0,285 (1.710 nasabah disetujui), bad rate yang disetujui 0,0667 (114 default disetujui), total cost NT$33.046.500, profit +NT$8.214.000. Threshold 0,15: approval rate 0,4988 (2.993 disetujui), bad rate 0,0899 (269 default disetujui), total cost NT$35.770.000, profit +NT$5.490.500. Threshold 0,20 sebagai pembanding: approval rate 0,6513, bad rate 0,1113, total cost NT$41.477.000, profit −NT$216.500.",
        "Hasil yang diharapkan [lab]: approval_delta_pp=21.38; bad_rate_delta_pp=2.32; cost_delta_NT=2723500; profit_delta_NT=-2723500; n_approved_delta=1283; approved_defaults_delta=155; profit_delta_020_NT=-8430500; gates_required=6. Bacalah dua baris terakhir berdampingan: perubahan 0,10 ke 0,15 «hanya» menggeser threshold 0,05 — tapi menggerakkan 1.283 keputusan dan NT$2.723.500, dan membutuhkan KEENAM gerbang G10 [M7.4] — tidak ada yang boleh dilewati, karena perubahan ini mengubah keputusan untuk 1.283 nasabah. Dan eskalasinya: pada 0,20, profit sudah negatif (−NT$216.500) — selisih profit terhadap 0,10 adalah −NT$8.430.500.",
        "Setelah lab jalan, tanyakan pada dirimu: bila seseorang berkata «ini perubahan kecil, cukup beri tahu bisnis», angka mana yang kamu tunjukkan? Jawabannya: semuanya — 21,38 poin persen, 155 default tambahan, NT$2.723.500. «Kecil» adalah pendapat; angka-angka ini adalah bukti bahwa perubahan ini butuh gerbang.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi selisih approval, bad rate, cost, profit 0,10 ke 0,15" },
        { id: "t2", text: "Lengkapi selisih jumlah nasabah disetujui dan default yang disetujui" },
        { id: "t3", text: "Lengkapi profit_delta_020 dan gates_required, lalu putuskan: perubahan ini butuh semua 6 gerbang" },
      ],
      expected: "approval_delta_pp=21.38\nbad_rate_delta_pp=2.32\ncost_delta_NT=2723500\nprofit_delta_NT=-2723500\nn_approved_delta=1283\napproved_defaults_delta=155\nprofit_delta_020_NT=-8430500\ngates_required=6",
      hints: [
        "approval_delta_pp = (0,4988 − 0,285) × 100 = 21,38; bad_rate_delta_pp = (0,0899 − 0,0667) × 100 = 2,32.",
        "cost_delta_NT = 35.770.000 − 33.046.500 = 2.723.500; profit_delta_NT = 5.490.500 − 8.214.000 = −2.723.500 — sama besarnya, berlawanan arah.",
        "profit_delta_020_NT = −216.500 − 8.214.000 = −8.430.500. gates_required = 6: perubahan yang mengubah keputusan untuk 1.283 nasabah wajib lewat keenam gerbang G10 [M7.4].",
      ],
      code: {
        starter: `# Change control: nilai perubahan threshold 0,10 ke 0,15 [M6.4]
# Angka kanonis [M6.4], GBM terkalibrasi, test 6.000, LGD 0,45, margin 0,05
T010 = {"threshold": 0.10, "approval_rate": 0.285, "bad_rate": 0.0667, "cost": 33046500, "profit": 8214000, "n_approved": 1710, "n_default_approved": 114}
T015 = {"threshold": 0.15, "approval_rate": 0.4988, "bad_rate": 0.0899, "cost": 35770000, "profit": 5490500, "n_approved": 2993, "n_default_approved": 269}
T020 = {"threshold": 0.20, "approval_rate": 0.6513, "bad_rate": 0.1113, "cost": 41477000, "profit": -216500, "n_approved": 3908, "n_default_approved": 435}

approval_delta_pp = 0.0  # TODO: (T015 approval - T010 approval) * 100
bad_rate_delta_pp = 0.0  # TODO: (T015 bad_rate - T010 bad_rate) * 100
cost_delta_NT = 0  # TODO: T015 cost - T010 cost
profit_delta_NT = 0  # TODO: T015 profit - T010 profit
n_approved_delta = 0  # TODO: T015 n_approved - T010 n_approved
approved_defaults_delta = 0  # TODO: T015 n_default_approved - T010 n_default_approved
profit_delta_020_NT = 0  # TODO: T020 profit - T010 profit
gates_required = 0  # TODO: berapa gerbang G10 [M7.4] yang wajib dilewati
print(f"approval_delta_pp={approval_delta_pp:.2f}")
print(f"bad_rate_delta_pp={bad_rate_delta_pp:.2f}")
print(f"cost_delta_NT={cost_delta_NT}")
print(f"profit_delta_NT={profit_delta_NT}")
print(f"n_approved_delta={n_approved_delta}")
print(f"approved_defaults_delta={approved_defaults_delta}")
print(f"profit_delta_020_NT={profit_delta_020_NT}")
print(f"gates_required={gates_required}")`,
        lockLines: 6,
        solution: `# Change control: nilai perubahan threshold 0,10 ke 0,15 [M6.4]
# Angka kanonis [M6.4], GBM terkalibrasi, test 6.000, LGD 0,45, margin 0,05
T010 = {"threshold": 0.10, "approval_rate": 0.285, "bad_rate": 0.0667, "cost": 33046500, "profit": 8214000, "n_approved": 1710, "n_default_approved": 114}
T015 = {"threshold": 0.15, "approval_rate": 0.4988, "bad_rate": 0.0899, "cost": 35770000, "profit": 5490500, "n_approved": 2993, "n_default_approved": 269}
T020 = {"threshold": 0.20, "approval_rate": 0.6513, "bad_rate": 0.1113, "cost": 41477000, "profit": -216500, "n_approved": 3908, "n_default_approved": 435}

approval_delta_pp = (T015["approval_rate"] - T010["approval_rate"]) * 100
bad_rate_delta_pp = (T015["bad_rate"] - T010["bad_rate"]) * 100
cost_delta_NT = T015["cost"] - T010["cost"]
profit_delta_NT = T015["profit"] - T010["profit"]
n_approved_delta = T015["n_approved"] - T010["n_approved"]
approved_defaults_delta = T015["n_default_approved"] - T010["n_default_approved"]
profit_delta_020_NT = T020["profit"] - T010["profit"]
gates_required = 6
print(f"approval_delta_pp={approval_delta_pp:.2f}")
print(f"bad_rate_delta_pp={bad_rate_delta_pp:.2f}")
print(f"cost_delta_NT={cost_delta_NT}")
print(f"profit_delta_NT={profit_delta_NT}")
print(f"n_approved_delta={n_approved_delta}")
print(f"approved_defaults_delta={approved_defaults_delta}")
print(f"profit_delta_020_NT={profit_delta_020_NT}")
print(f"gates_required={gates_required}")`,
        checks: [
          { kind: "equal", task: "t1", name: "approval_delta_pp", value: 21.38, tol: 0.01, label: "`approval_delta_pp` seharusnya 21.38", msg: "Approval 28,5% ke 49,88% [M6.4] — naik 21,38 poin persen, 1.283 nasabah tambahan." },
          { kind: "equal", task: "t1", name: "bad_rate_delta_pp", value: 2.32, tol: 0.01, label: "`bad_rate_delta_pp` seharusnya 2.32", msg: "Bad rate 6,67% ke 8,99% [M6.4] — naik 2,32 poin persen." },
          { kind: "equal", task: "t1", name: "cost_delta_NT", value: 2723500, tol: 1, label: "`cost_delta_NT` seharusnya 2723500", msg: "Cost NT$33.046.500 ke NT$35.770.000 [M6.4] — naik NT$2.723.500." },
          { kind: "equal", task: "t1", name: "profit_delta_NT", value: -2723500, tol: 1, label: "`profit_delta_NT` seharusnya -2723500", msg: "Profit +NT$8.214.000 ke +NT$5.490.500 [M6.4] — turun NT$2.723.500, sama besar dengan kenaikan cost." },
          { kind: "equal", task: "t2", name: "n_approved_delta", value: 1283, tol: 0.5, label: "`n_approved_delta` seharusnya 1283", msg: "Nasabah disetujui 1.710 ke 2.993 [M6.4] — 1.283 keputusan berubah." },
          { kind: "equal", task: "t2", name: "approved_defaults_delta", value: 155, tol: 0.5, label: "`approved_defaults_delta` seharusnya 155", msg: "Default yang disetujui 114 ke 269 [M6.4] — 155 nasabah yang kemudian default ikut disetujui." },
          { kind: "equal", task: "t3", name: "profit_delta_020_NT", value: -8430500, tol: 1, label: "`profit_delta_020_NT` seharusnya -8430500", msg: "Pada 0,20 profit sudah −NT$216.500 [M6.4] — selisih terhadap 0,10 adalah −NT$8.430.500." },
          { kind: "stdout_matches", task: "t3", pattern: "gates_required=6", label: "Output menampilkan gates_required=6", msg: "Keenam gerbang G10 [M7.4] wajib — perubahan yang mengubah 1.283 keputusan tidak punya gerbang yang boleh dilewati." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 12 · Lab 2",
      title: "Lab: audit trail — kolom G10 mana yang hilang dari log keputusan?",
      prose: [
        "Log keputusan berikut [ilustrasi — isinya ditulis eksplisit di bawah] mencatat perubahan threshold 0,10 ke 0,15 pada versi gbm-cal-v2.1: model version «gbm-cal-v2.1», threshold policy version «thr-0.15», data snapshot «uci-2026-11», approval date «2026-11-13», owner «Risk Analytics», alasan perubahan «naikkan approval» — enam kolom terisi. Empat kolom G10 [M7.4] bernilai kosong: feature schema version, calibration version, code/notebook hash, dan rollback version. Tugasmu: hitung kolom yang hilang, kelengkapannya, dan putuskan apakah log ini lolos audit.",
        "Hasil yang diharapkan [lab]: missing=feature schema version, calibration version, code/notebook hash, rollback version; missing_count=4; completeness=0.6; audit_pass=False. Bacalah hasil terakhir dengan saksama: completeness 0,6 BUKAN «hampir lolos» — audit trail mensyaratkan kelengkapan 1,0. Tanpa rollback version, tim tidak tahu ke versi apa kembali bila 0,15 gagal; tanpa calibration version, tidak ada yang bisa membuktikan apakah 0,15 itu 0,15 dari model terkalibrasi atau mentah; tanpa code/notebook hash, modelnya tidak bisa direproduksi; tanpa feature schema version, validasi ulang memakai skema yang mungkin salah. Empat lubang, empat kegagalan yang berbeda — dan satu vonis: v2.1 TIDAK BOLEH naik produksi sampai lognya lengkap.",
        "Setelah lab jalan, tanyakan pada dirimu: kolom mana yang paling berbahaya bila hilang? Jawaban yang jujur: tergantung keadaan — saat keadaan baik, semuanya tampak tidak penting; saat keadaan memburuk, kolom yang hilang itulah yang sedang kamu cari. Itulah kenapa syaratnya 1,0, bukan 0,6.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi missing: kolom G10 yang bernilai None, dalam urutan G10" },
        { id: "t2", text: "Lengkapi missing_count dan completeness" },
        { id: "t3", text: "Putuskan audit_pass dan jalankan: bolehkah v2.1 naik produksi?" },
      ],
      expected: "missing=feature schema version, calibration version, code/notebook hash, rollback version\nmissing_count=4\ncompleteness=0.6\naudit_pass=False",
      hints: [
        "missing = [kolom for kolom in G10_COLUMNS if LOG_V21[kolom] is None] — urutan mengikuti G10, bukan urutan abjad.",
        "completeness = (10 − missing_count) / 10 = 0,6. Syarat audit: completeness == 1.0 — bukan 0,6, bukan «mayoritas».",
        "audit_pass = (completeness == 1.0). Tanpa rollback version, tidak ada jalan kembali yang tercatat — v2.1 tidak boleh naik produksi.",
      ],
      code: {
        starter: `# Audit trail: periksa kelengkapan 10 kolom G10 [M7.4] pada log keputusan [ilustrasi]
# Log v2.1 [ilustrasi]: threshold 0,10 diubah ke 0,15 - catat kolom yang None
G10_COLUMNS = ["model version", "feature schema version", "calibration version", "threshold policy version", "data snapshot", "code/notebook hash", "approval date", "owner", "rollback version", "alasan perubahan"]
LOG_V21 = {"model version": "gbm-cal-v2.1", "feature schema version": None, "calibration version": None, "threshold policy version": "thr-0.15", "data snapshot": "uci-2026-11", "code/notebook hash": None, "approval date": "2026-11-13", "owner": "Risk Analytics", "rollback version": None, "alasan perubahan": "naikkan approval"}

missing = []  # TODO: kolom G10 yang bernilai None, urutan G10
missing_count = 0  # TODO: len(missing)
completeness = 0.0  # TODO: (10 - missing_count) / 10
audit_pass = True  # TODO: True hanya bila completeness == 1.0
print(f"missing={', '.join(missing)}")
print(f"missing_count={missing_count}")
print(f"completeness={completeness:.1f}")
print(f"audit_pass={audit_pass}")`,
        lockLines: 5,
        solution: `# Audit trail: periksa kelengkapan 10 kolom G10 [M7.4] pada log keputusan [ilustrasi]
# Log v2.1 [ilustrasi]: threshold 0,10 diubah ke 0,15 - catat kolom yang None
G10_COLUMNS = ["model version", "feature schema version", "calibration version", "threshold policy version", "data snapshot", "code/notebook hash", "approval date", "owner", "rollback version", "alasan perubahan"]
LOG_V21 = {"model version": "gbm-cal-v2.1", "feature schema version": None, "calibration version": None, "threshold policy version": "thr-0.15", "data snapshot": "uci-2026-11", "code/notebook hash": None, "approval date": "2026-11-13", "owner": "Risk Analytics", "rollback version": None, "alasan perubahan": "naikkan approval"}

missing = [c for c in G10_COLUMNS if LOG_V21[c] is None]
missing_count = len(missing)
completeness = (10 - missing_count) / 10
audit_pass = (completeness == 1.0)
print(f"missing={', '.join(missing)}")
print(f"missing_count={missing_count}")
print(f"completeness={completeness:.1f}")
print(f"audit_pass={audit_pass}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "feature schema version", label: "Output menampilkan feature schema version sebagai kolom hilang", msg: "Tanpa feature schema version, validasi ulang bisa memakai skema fitur yang salah." },
          { kind: "stdout_matches", task: "t1", pattern: "calibration version", label: "Output menampilkan calibration version sebagai kolom hilang", msg: "Tanpa calibration version, 0,15 tidak bisa dibuktikan berasal dari model terkalibrasi atau mentah." },
          { kind: "stdout_matches", task: "t1", pattern: "rollback version", label: "Output menampilkan rollback version sebagai kolom hilang", msg: "Tanpa rollback version, tim tahu harus kembali tapi tidak tahu ke mana." },
          { kind: "equal", task: "t2", name: "missing_count", value: 4, tol: 0.5, label: "`missing_count` seharusnya 4", msg: "Empat dari sepuluh kolom G10 kosong pada log v2.1 [ilustrasi]." },
          { kind: "equal", task: "t2", name: "completeness", value: 0.6, tol: 0.001, label: "`completeness` seharusnya 0.6", msg: "Kelengkapan 6 dari 10 = 0,6 — di bawah syarat audit 1,0." },
          { kind: "stdout_matches", task: "t3", pattern: "audit_pass=False", label: "Output menampilkan audit_pass=False", msg: "v2.1 TIDAK BOLEH naik produksi sampai keempat kolom dilengkapi — audit mensyaratkan kelengkapan 1,0." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: nama yang menandatangani, gerbang yang dilewati, jejak yang lengkap",
      prose: [
        "Rangkuman: governance empat peran — komite model risk (memutuskan boleh/tidak), model owner (accountable saat live), validator independen [M8.1] (memeriksa tanpa membangun), audit internal (memeriksa prosesnya). RACI: Responsible mengerjakan, Accountable menjawab (tepat satu per keputusan), Consulted diajak bicara sebelum, Informed diberitahu sesudah. Alur approval lima tahap: proposal → validasi [M8.1] → sign-off → deploy [M8.4] → monitoring [M7.5] — setiap tahap bisa menghentikan alur; temuan monitoring kembali ke proposal lewat revalidasi. Sign-off: empat tanda tangan atas bagiannya masing-masing (validator, owner, legal/risk, komite) sesudah membaca opini validasi + model card [M8.3] + ekonomi [M6.4]; penolakan adalah hasil yang sah; tanda tangan sesudah deploy adalah pembenaran, bukan persetujuan. Change control G10 [M7.4]: enam gerbang (proposal → offline validation → legal/risk approval → shadow/canary → production → rollback criteria, verifikasi kriteria yang ditulis di gerbang 1 sebelum produksi); rollback v2 = threshold tunggal 0,10. Perubahan threshold 0,10 ke 0,15 [M6.4]: approval 28,5% ke 49,88% (+21,38 poin persen, +1.283 nasabah), bad rate 6,67% ke 8,99% (+2,32 poin persen, +155 default disetujui), cost NT$33.046.500 ke NT$35.770.000 (+NT$2.723.500), profit +NT$8.214.000 ke +NT$5.490.500 (−NT$2.723.500); pada 0,20 profit sudah −NT$216.500; pada 0,50 profit −NT$18.994.456 dengan approval 88,05% dan bad rate 15,96%. Revalidasi wajib bila: data baru, penggunaan baru, temuan monitoring [M7.5] (PSI skor di atas 0,25 [kebijakan lesson ini], ROC-AUC turun lebih dari 0,02 [kebijakan lesson ini] / PR-AUC turun lebih dari 0,03 [kebijakan lesson ini] dalam 2 periode, ECE di atas 0,02 [kebijakan lesson ini] bertahan, AIR di bawah 0,80 [kebijakan lesson ini] selama 2 periode), atau kalender [keputusan kebijakan lesson ini: paling lambat 12 bulan sejak approval terakhir]. Audit trail G10 [M7.4]: sepuluh kolom wajib (model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, alasan perubahan) — kelengkapan 1,0, ditulis saat keputusan diambil. Jebakan: sign-off stempel karet — komite yang tidak pernah menolak, sign-off sesudah deploy, opini tanpa kelemahan. Mini-case: 0,10 ke 0,15 mungkin saja disetujui (AIR SEX 0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air], profit masih positif) — governance bukan tentang menolak semua perubahan, melainkan memutuskan dengan mata terbuka. Lab: perubahan 0,10 ke 0,15 menggerakkan 1.283 keputusan dan NT$2.723.500 serta butuh keenam gerbang; log v2.1 [ilustrasi] kehilangan 4 kolom G10 (completeness 0,6) — audit GAGAL, tidak boleh naik produksi. Exception (G11): template 10 kolom — exception tanpa expiry otomatis invalid; hard constraint (AIR < 0,80, ECE > 0,02) tidak bisa di-exception-kan; exception yang diperpanjang 2× menjadi change request (6 gerbang). Decision protocol (G12): kuorum minimum [kebijakan organisasi], recusal bila conflict of interest, delegated authority, tie-breaker/eskalasi, approval timestamp, digital evidence, SLA KUNING/MERAH [kebijakan organisasi] — keputusan tanpa kuorum INVALID walau semua yang hadir setuju. Capstone (G14): satu perubahan (threshold 0,10 → 0,15) → validation report, tiering score, model card, shadow/canary decision, gate sheet, rollback runbook, RACI/sign-off, audit trail, keputusan final — rubric 10 pemeriksaan (konsistensi version ID, angka, status gate, owner, due date, kondisi revalidation) semuanya harus lolos. Revalidasi memeriksa issue register lama [M8.1] lebih dulu: temuan yang masih terbuka adalah temuan pertama di laporan baru.",
        "Guided task di Colab — notebook mlf-m85-guided-task.ipynb mereplikasi flagship GBM + kalibrasi Platt, menghitung ekonomi threshold 0,10 vs 0,15 vs 0,20 vs 0,50 [M6.4] dari data UCI, menilai perubahan threshold lewat enam gerbang G10 [M7.4], dan membangun audit trail sepuluh kolom G10 lalu memeriksa kelengkapannya — semua dengan checks. Tautan Colab: https://colab.research.google.com/drive/10C2owTwkDO4Z3vW-LUdkeq_Z5RcWMZ2-",
        "Ini lesson terakhir Modul M8 — tidak ada lesson berikutnya. Yang tersisa adalah kebiasaan: sebelum model apa pun live, tanyakan tiga nama — pemiliknya, validatornya, penandatangannya — dan satu berkas: jejak sepuluh kolomnya. Bila satu saja kosong, model itu belum siap.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Siapa yang memutuskan model BOLEH dipakai di produksi?",
          options: [
            { text: "Model owner sendiri — ia yang paling tahu modelnya", why: "Salah: owner accountable atas pemakaian saat live, tapi persetujuan pemakaian adalah tugas komite model risk — owner tidak menyetujui karyanya sendiri." },
            { text: "Komite model risk, berdasarkan opini validator independen", why: "Benar: komite menilai proposal dan opini validasi, lalu memutuskan boleh/tidak — termasuk menolak. Validator memeriksa, komite memutuskan.", correct: true },
            { text: "Tim bisnis yang memakai model — mereka yang menanggung risikonya", why: "Salah: tim bisnis adalah PENGGUNA, bukan penyetuju. Mereka diberitahu (Informed) sesudah keputusan diambil — bukan yang memutuskan." },
            { text: "Developer yang membangun model — ia yang menulis kodenya", why: "Salah: pembangun tidak pernah menyetujui karyanya sendiri. Itu tugas validator (memeriksa) dan komite (memutuskan)." },
          ],
        },
        {
          q: "Dalam RACI, apa arti satu keputusan punya tepat satu Accountable?",
          options: [
            { text: "Hanya satu orang yang mengerjakan pekerjaan itu", why: "Salah: yang mengerjakan adalah Responsible. Accountable adalah yang menanggung jawaban akhir — ia bisa berbeda dari yang mengerjakan." },
            { text: "Tepat satu orang yang menanggung jawaban akhir atas keputusan itu", why: "Benar: satu A per keputusan — bila dua orang A, tidak ada yang memutuskan saat mereka tidak sepakat; bila nol A, pekerjaan selesai tapi tidak ada pemiliknya.", correct: true },
            { text: "Semua orang yang terlibat harus diajak bicara sebelum keputusan", why: "Salah: itu Consulted. Tidak semua orang harus diajak bicara — hanya yang informasinya dibutuhkan sebelum keputusan." },
            { text: "Accountable boleh kosong bila semua Responsible sudah setuju", why: "Salah: R tanpa A adalah pekerjaan yatim — selesai dikerjakan, tapi tidak ada yang menjawab bila hasilnya salah. A tidak pernah boleh kosong." },
          ],
        },
        {
          q: "Urutkan alur approval yang benar.",
          options: [
            { text: "Deploy → proposal → validasi → sign-off → monitoring", why: "Salah: deploy tidak pernah mendahului proposal, validasi, dan sign-off. Deploy adalah tahap 4, sesudah tanda tangan terkumpul." },
            { text: "Proposal → validasi → sign-off → deploy → monitoring", why: "Benar: proposal tertulis dulu, validator independen memeriksa [M8.1], para penandatangan membaca bukti lalu menandatangani, deploy lewat shadow/canary [M8.4], lalu monitoring [M7.5] yang tidak pernah selesai.", correct: true },
            { text: "Validasi → proposal → deploy → sign-off → monitoring", why: "Salah: validasi memeriksa proposal — tidak ada yang bisa divalidasi sebelum proposal tertulis. Dan sign-off sesudah deploy adalah pembenaran, bukan persetujuan." },
            { text: "Proposal → sign-off → validasi → monitoring → deploy", why: "Salah: sign-off mendahului validasi berarti penandatangan menandatangani sesuatu yang belum diperiksa. Validasi selalu sebelum sign-off." },
          ],
        },
        {
          q: "Apa arti tanda tangan pada lembar persetujuan model?",
          options: [
            { text: "Formalitas administrasi — tanda tangan sekadar melengkapi berkas", why: "Salah: bila tanda tangan hanya formalitas, komite sedang mengesahkan, bukan menilai — itu stempel karet (langkah 9). Tanda tangan adalah pernyataan yang bisa ditagih." },
            { text: "Penandatangan sudah membaca opini validasi, model card, dan ekonomi — dan ikut menanggung risiko keputusan itu", why: "Benar: empat tanda tangan (validator, owner, legal/risk, komite) masing-masing atas bagiannya — sesudah membaca bukti, bukan sesudah mendengar ringkasan. Penandatangan tidak bisa berkata «saya hanya mengikuti».", correct: true },
            { text: "Model dijamin tidak pernah salah selama dipakai", why: "Salah: tidak ada yang menjamin itu. Model ROC-AUC 0,7816 tetap salah pada sebagian ranking dan threshold 0,10 tetap menyetujui 114 nasabah yang kemudian default [M6.4]. Yang dijamin tanda tangan adalah risiko yang DIKETAHUI dan DITANGGUNG — bukan kesempurnaan." },
            { text: "Hanya developer yang menandatangani — ia yang membangun modelnya", why: "Salah: developer justru TIDAK menandatangani persetujuan pemakaian. Yang menandatangani adalah validator, owner, legal/risk, dan komite — masing-masing atas bagiannya." },
          ],
        },
        {
          q: "Perubahan threshold 0,10 ke 0,15 [M6.4] — pernyataan mana yang BENAR?",
          options: [
            { text: "Perubahan kecil — cukup beri tahu tim bisnis, tidak butuh gerbang", why: "Salah: «kecil» adalah pendapat. Angkanya: approval naik 21,38 poin persen, 1.283 keputusan berubah, cost naik NT$2.723.500 — perubahan yang mengubah keputusan untuk 1.283 nasabah wajib lewat keenam gerbang G10." },
            { text: "Approval naik 21,38 poin persen, cost naik NT$2.723.500, profit turun NT$2.723.500 — dan perubahan ini wajib lewat keenam gerbang G10", why: "Benar: 28,5% ke 49,88% (+21,38 pp), cost NT$33.046.500 ke NT$35.770.000 (+NT$2.723.500), profit +NT$8.214.000 ke +NT$5.490.500 (−NT$2.723.500) [M6.4]. Satu angka threshold menggerakkan 1.283 keputusan — keenam gerbang wajib.", correct: true },
            { text: "Approval naik dan cost TURUN — menaikkan threshold selalu lebih murah", why: "Salah arah: cost NAIK NT$2.723.500 (lebih banyak nasabah disetujui berarti lebih banyak eksposur default: 114 ke 269 default yang disetujui). Menaikkan threshold tidak pernah «lebih murah» di data ini." },
            { text: "Profit naik — lebih banyak nasabah disetujui berarti lebih banyak margin", why: "Salah: profit TURUN NT$2.723.500 (dari +NT$8.214.000 ke +NT$5.490.500). Margin tambahan dari 1.283 nasabah baru tidak menutup kerugian dari 155 default tambahan." },
          ],
        },
        {
          q: "Manakah yang WAJIB memicu revalidasi model yang sudah live?",
          options: [
            { text: "Satu periode buruk (seperti chunk 2: ROC-AUC 0,7428 lalu membaik)", why: "Salah: satu periode buruk adalah urusan monitoring — waspada dan pantau periode berikutnya. Chunk 2 membaik di chunk 3 (0,8138), membuktikan itu noise. Revalidasi butuh 2 periode berturut-turut atau PSI di atas 0,25." },
            { text: "Data baru, penggunaan baru, temuan monitoring [M7.5], atau jadwal kalender", why: "Benar: keempat pemicu ini tertulis sebelum masalah datang — data baru, pemakaian di luar persetujuan awal, temuan monitoring (PSI di atas 0,25, ROC-AUC turun lebih dari 0,02 dalam 2 periode, ECE di atas 0,02 bertahan, AIR di bawah 0,80 selama 2 periode), atau kalender (paling lambat 12 bulan).", correct: true },
            { text: "Model diganti nama filenya saja — tanpa perubahan isi apa pun", why: "Salah: perubahan kosmetik yang tidak mengubah satu pun keputusan bukan perubahan. Revalidasi dipicu oleh yang mengubah keputusan atau konteksnya — bukan oleh nama file." },
            { text: "ROC-AUC naik di satu periode — kabar baik juga harus divalidasi ulang", why: "Salah: satu periode — baik buruk maupun baik — adalah noise periode-kecil (fluktuasi antar-chunk 0,0710 tanpa TREN penurunan sistematis [m75_pseudo_time_roc_spread]). Kenaikan satu periode bukan pemicu revalidasi." },
          ],
        },
        {
          q: "Log keputusan v2.1 [ilustrasi] mencatat 6 dari 10 kolom G10 — yang hilang antara lain rollback version dan calibration version. Apa akibatnya?",
          options: [
            { text: "Tidak apa-apa selama approval date tercatat — tanggal sudah cukup sebagai bukti", why: "Salah: tanggal hanya menjawab KAPAN. Tanpa rollback version tidak ada jalan kembali yang tercatat; tanpa calibration version tidak bisa dibuktikan 0,15 itu dari model terkalibrasi atau mentah." },
            { text: "Audit GAGAL — perubahan tidak bisa direkonstruksi dan rollback tidak bisa dijalankan dengan pasti", why: "Benar: kelengkapan 0,6 di bawah syarat 1,0. Empat kolom hilang berarti empat pertanyaan tak terjawab — dan v2.1 tidak boleh naik produksi sampai lognya lengkap.", correct: true },
            { text: "Cukup dilengkapi nanti bila ada audit — trail boleh ditulis belakangan", why: "Salah: trail yang ditulis belakangan dari ingatan bukan audit trail — ia karangan. Trail ditulis SAAT keputusan diambil, oleh sistem yang mencatatnya." },
            { text: "6 dari 10 sudah cukup karena mayoritas kolom terisi", why: "Salah: syaratnya kelengkapan 1,0, bukan mayoritas. Satu kolom yang hilang pada saat yang salah — rollback version saat model gagal — sudah cukup untuk membuat audit gagal." },
          ],
        },
        {
          q: "Mini-case: threshold diubah diam-diam dari 0,10 ke 0,15 tanpa gerbang. Apa risiko terbesarnya?",
          options: [
            { text: "Approval rate naik 21,38 poin persen — volume naik terlalu cepat", why: "Salah: kenaikan approval adalah DAMPAK yang terukur, bukan risiko terbesarnya. Dampak yang sama terjadi bila perubahan itu lewat gerbang — bedanya, lewat gerbang ada yang menyetujui dan mencatatnya." },
            { text: "Tidak ada yang bisa dimintai pertanggungjawaban, rollback version tidak tercatat, dan kerugian NT$2.723.500 terjadi tanpa persetujuan siapa pun", why: "Benar: angka kerugiannya sama dengan perubahan yang disetujui — tapi tanpa nama, tanpa jejak, tanpa jalan kembali. Kerugian yang tidak bisa dipertanggungjawabkan merugikan semua pihak, termasuk yang mengubah threshold itu.", correct: true },
            { text: "AIR SEX memburuk — fairness model rusak oleh perubahan ini", why: "Salah: AIR SEX justru MEMBAIK, 0,8694 ke 0,8906 [M7.1]. Fairness bukan alasan menolak perubahan ini — ekonominya dan ketiadaan gerbanglah masalahnya." },
            { text: "Model harus segera di-retrain karena threshold berubah", why: "Salah: perubahan threshold bukan soal retrain — modelnya sama, hanya ambang keputusannya yang berubah. Yang hilang bukan model baru, melainkan gerbang, jejak, dan penanggung jawab." },
          ],
        },
        {
          q: "Exception disetujui untuk menunda revalidasi kalender 14 hari — tapi tidak ada end time yang tertulis. Apa status exception itu?",
          options: [
            { text: "Sah — 14 hari sudah disebut di alasan, jadi expiry-nya jelas", why: "Salah: «disebut di alasan» bukan end time tertulis. Kolom start/end time harus terisi tanggal — tanpa itu, exception tidak punya expiry, dan exception tanpa expiry otomatis invalid." },
            { text: "Otomatis invalid — exception tanpa expiry bukan exception, melainkan perubahan permanen yang menyamar; model kembali ke aturan normal", why: "Benar: end time adalah kolom yang membuat exception menjadi sementara. Tanpa tanggal berakhir, tidak ada yang tahu kapan exception itu mati — dan yang tidak bisa mati adalah perubahan permanen.", correct: true },
            { text: "Sah selama 14 hari — komite bisa mengingatnya tanpa menulis", why: "Salah: ingatan komite bukan bukti — dan exception yang hanya ada di ingatan tidak ada di audit trail. Bila tidak tertulis, ia tidak pernah ada saat audit datang." },
            { text: "Sah tanpa batas — exception yang disetujui komite berlaku sampai dicabut", why: "Salah: «berlaku sampai dicabut» adalah definisi perubahan permanen. Exception yang tidak mati sendiri adalah lubang di governance — ia membiarkan model berjalan di luar aturan tanpa batas waktu." },
          ],
        },
        {
          q: "Komite 5 orang membahas deploy v2.1. Yang hadir: 2 anggota + ketua. Kuorum minimum [kebijakan organisasi] tidak tercapai — tapi ketiganya setuju. Apa status keputusan itu?",
          options: [
            { text: "Sah — semua yang hadir setuju, jadi keputusan diambil secara bulat", why: "Salah: «semua yang hadir setuju» bukan bukti apa-apa bila yang hadir tidak cukup untuk memutuskan. Tanpa kuorum, keputusan tidak ada — berapa pun yang hadir setuju." },
            { text: "Sah bila ketuanya menandatangani — tanda tangan ketua menggantikan kuorum", why: "Salah: ketua tidak bisa menggantikan kuorum dengan tanda tangannya. Kuorum adalah syarat sahnya keputusan, bukan formalitas yang bisa dilonggarkan «karena mendesak»." },
            { text: "Tidak sah — tanpa kuorum keputusan tidak ada; bila salah satu yang hadir adalah model owner, ia seharusnya recusal, dan bila suara seri, keputusan dieskalasikan, bukan dipaksakan", why: "Benar: tiga kesalahan dalam satu ruangan — tanpa kuorum, tanpa recusal, dan seri yang dipaksakan. Keputusan yang prosedurnya salah adalah keputusan yang tidak ada, berapa pun isinya benar.", correct: true },
            { text: "Sah — kuorum hanya berlaku untuk persetujuan deploy, bukan untuk pembahasan", why: "Salah: kuorum berlaku untuk KEPUTUSAN — dan pembahasan yang diakhiri keputusan tanpa kuorum adalah diskusi, bukan rapat komite. Keputusan tanpa kuorum tidak bisa «disahkan belakangan»." },
          ],
        },
      ],
      summary: [
        "Governance empat peran: komite model risk (memutuskan boleh/tidak), model owner (accountable saat live), validator independen [M8.1] (memeriksa tanpa membangun), audit internal (memeriksa prosesnya).",
        "RACI: Responsible mengerjakan, Accountable menjawab (tepat satu per keputusan), Consulted diajak bicara sebelum, Informed diberitahu sesudah.",
        "Alur approval lima tahap: proposal → validasi [M8.1] → sign-off → deploy [M8.4] → monitoring [M7.5] — setiap tahap bisa menghentikan alur; temuan monitoring kembali ke proposal lewat revalidasi.",
        "Sign-off: empat tanda tangan (validator, owner, legal/risk, komite) sesudah membaca opini validasi + model card [M8.3] + ekonomi [M6.4]; penolakan adalah hasil yang sah; tanda tangan sesudah deploy adalah pembenaran.",
        "Change control G10 [M7.4]: enam gerbang (proposal → offline validation → legal/risk approval → shadow/canary → production → rollback criteria, verifikasi kriteria yang ditulis di gerbang 1 sebelum produksi); rollback v2 = threshold tunggal 0,10.",
        "Perubahan threshold 0,10 ke 0,15 [M6.4]: approval 28,5% ke 49,88% (+21,38 pp, +1.283 nasabah), bad rate 6,67% ke 8,99% (+2,32 pp, +155 default disetujui), cost +NT$2.723.500, profit −NT$2.723.500; pada 0,20 profit −NT$216.500; pada 0,50 profit −NT$18.994.456.",
        "Revalidasi wajib bila: data baru, penggunaan baru, temuan monitoring [M7.5] (PSI skor di atas 0,25 [kebijakan lesson ini], ROC-AUC turun lebih dari 0,02 [kebijakan lesson ini] / PR-AUC turun lebih dari 0,03 [kebijakan lesson ini] dalam 2 periode, ECE di atas 0,02 [kebijakan lesson ini] bertahan, AIR di bawah 0,80 [kebijakan lesson ini] selama 2 periode), atau kalender (paling lambat 12 bulan sejak approval terakhir).",
        "Audit trail G10 [M7.4]: sepuluh kolom wajib — kelengkapan 1,0, ditulis saat keputusan diambil; log v2.1 [ilustrasi] dengan 4 kolom hilang (completeness 0,6) berarti audit GAGAL.",
        "Exception: template 10 kolom (reason, model/version, gate bypassed, risk assessment, compensating controls, start/end time, approver, monitoring cadence, exit criteria, ratification) — exception tanpa expiry otomatis invalid; hard constraint (AIR < 0,80, ECE > 0,02) tidak bisa di-exception-kan; diperpanjang 2× menjadi change request.",
        "Decision protocol: kuorum minimum [kebijakan organisasi], recusal bila conflict of interest, delegated authority, tie-breaker/eskalasi, approval timestamp, digital evidence, SLA KUNING/MERAH [kebijakan organisasi] — keputusan tanpa kuorum INVALID walau semua yang hadir setuju.",
        "Capstone (akhir M8.5): satu perubahan (threshold 0,10 → 0,15) → validation report, tiering score, model card 17 kolom, shadow/canary decision, gate sheet, rollback runbook, RACI/sign-off, audit trail, keputusan final — rubric 10 pemeriksaan (konsistensi version ID, angka, status gate, owner, due date, kondisi revalidation) semuanya harus lolos.",
        "Jebakan: sign-off stempel karet — komite yang tidak pernah menolak, sign-off sesudah deploy, opini validasi tanpa kelemahan.",
        "Mini-case: 0,10 ke 0,15 mungkin saja disetujui (AIR SEX 0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air], profit masih positif) — governance memutuskan dengan mata terbuka, bukan menolak semua perubahan.",
        "Lab: perubahan 0,10 ke 0,15 menggerakkan 1.283 keputusan dan NT$2.723.500 serta butuh keenam gerbang; log v2.1 [ilustrasi] kehilangan 4 kolom G10 (completeness 0,6) — audit GAGAL.",
      ],
    },
  ],
};

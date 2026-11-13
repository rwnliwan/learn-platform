import type { V2Lesson } from "../lib/types";

export const mlfM82: V2Lesson = {
  slug: "mlf-m82-model-risk-rating-inventory",
  track: "Machine Learning Finance",
  module: "Model risk & deployment",
  title: "MLF-M8.2 — Model Risk Rating & Inventory: Tidak Semua Model Sama Berbahayanya",
  estMinutes: 80,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Dua model, dua nasib: satu memutuskan limit miliaran, satu membuat laporan internal",
      prose: [
        "Bayangkan kamu risk manager di sebuah bank. Di mejamu ada dua model. Model pertama adalah scorecard kredit flagship kita: GBM terkalibrasi Platt/sigmoid, threshold 0,10, memutuskan 6.000 pengajuan di test — menyetujui 1.710 nasabah (28,5%) dengan bad rate 6,67% [notebook]. Di balik 1.710 persetujuan itu ada LIMIT_BAL yang disetujui sebesar NT$424.180.000 dan expected loss NT$11.989.453 [notebook]. Model kedua adalah model churn marketing: memprediksi pelanggan mana yang mungkin berhenti langganan, supaya tim marketing mengirim promo. Model kedua tidak memutuskan satu rupiah pun kredit — keputusan terburuknya adalah promo yang dikirim ke orang yang salah.",
        "Pertanyaannya: apakah kedua model itu pantas mendapat pengawasan yang sama? Jawabannya tidak — dan lesson ini tentang cara menjawab «seberapa besar pengawasan» dengan angka, bukan dengan firasat: INVENTORY (daftar semua model yang kamu punya) dan TIERING (rating risiko tiap model — Tier 1, 2, atau 3 — yang menentukan seberapa dalam validasinya, seberapa sering ditinjau, dan siapa yang menandatangani).",
        "Konteks angka lesson ini [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05. Angka materiality [notebook, m8_tiering]: total LIMIT_BAL test NT$1.007.777.680; approved LIMIT_BAL NT$424.180.000 (42,09% dari total); expected loss approved NT$11.989.453; expected loss seluruh test NT$78.675.378; realised loss approved NT$11.695.500; margin approved NT$19.909.500; laba bersih approved NT$8.214.000; total cost pada threshold 0,10 NT$33.046.500 [M6.4]. Satu peringatan skala yang WAJIB dipegang sepanjang lesson: test 6.000 adalah sampel stratified 1/5 dari data 30.000 baris — BUKAN buku live. Untuk menskala ke buku penuh, kalikan angka test dengan (ukuran buku / 6.000). Angka-angka lesson ini adalah angka SAMPEL, bukan angka buku live.",
        "Peta lesson: cerita dua model → inventory: daftar semua model → risiko agregat: shared dependency, downstream, aggregate exposure → tiering: Tier 1/2/3 dan konsekuensinya → risiko inheren vs residual → materiality dengan angka flagship → matriks exposure × kompleksitas → skor tiering [kebijakan lesson ini] → kapan rating berubah (re-tiering) → model vendor: intake checklist + perubahan vendor = re-tiering → jebakan tiering → mini-case tiga model [ilustrasi] → 2 lab → checkpoint.",
        "Nilai: rating risiko adalah cara bank menjawab pertanyaan «model mana yang boleh salah, dan model mana yang tidak boleh?» dengan tertib. Tanpa rating, semua model diperlakukan sama — yang berbahaya kurang diawasi, yang sepele diawasi berlebihan, dan waktu validasi habis untuk model yang salah.",
        "Baik atau buruk: scorecard flagship dengan ROC-AUC GBM mentah 0,7823 (model keputusan terkalibrasi: 0,7816) itu bagus sebagai MODEL — ranking-nya kuat. Buruk bila angka itu dibaca sebagai «model ini aman»: ROC-AUC tidak berkata apa-apa tentang berapa uang yang dipertaruhkan. Model dengan ROC-AUC yang sama bisa Tier 1 atau Tier 3 — yang membedakan adalah dampak keputusannya, bukan akurasinya.",
        "Mitigasi: sebelum model apa pun naik ke produksi, tulis dulu dua baris: (1) berapa uang yang diputuskan model ini, dan (2) tier berapa ia. Dua baris itu — bukan ROC-AUC — yang menentukan seberapa dalam validasi yang ia butuhkan.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: model yang akurat = model yang aman",
        type: "pitfall",
        body: "Yang benar: akurasi (ROC-AUC 0,7816) mengukur seberapa baik model MERANGKING — bukan seberapa besar RISIKO bila ia salah. Scorecard yang menyetujui NT$424.180.000 limit dengan expected loss NT$11.989.453 adalah Tier 1 bukan karena ROC-AUC-nya, melainkan karena uang yang dipertaruhkan. Model churn dengan ROC-AUC yang sama tapi tanpa keputusan uang adalah Tier 3. Rating risiko menilai DAMPAK keputusan, bukan kualitas ranking.",
      },
    },
    {
      id: "inventory",
      eyebrow: "Langkah 2 · Inventory",
      title: "Inventory: daftar semua model — tanpa daftar, tidak ada governance",
      prose: [
        "Inventory adalah daftar LENGKAP semua model yang dipakai organisasi — hidup, bayangan (shadow-mode: model yang berjalan berdampingan dengan model live tanpa mengambil keputusan — keputusannya dicatat, tidak dijalankan), maupun pensiun. Satu baris per model, dengan kolom minimum: nama dan ID model; PEMILIK (satu nama orang, bukan tim); versi; TUJUAN dan keputusan yang diambilnya; data input; output; TIER (langkah 3); tanggal validasi terakhir; tanggal review berikutnya; status (live / shadow / retired). Inventory bukan arsip — ia adalah peta: dari sinilah risk manager tahu model apa saja yang sedang mengambil keputusan atas nama bank.",
        "Tanpa inventory, yang terjadi adalah MODEL TAK TERDAFTAR: model yang dipakai seseorang tanpa ada yang tahu. Contoh yang paling sering: spreadsheet scoring buatan analis yang dipakai cabang untuk menyetujui kredit kecil; notebook churn yang tiba-tiba dipakai marketing untuk menentukan siapa yang dapat diskon besar; model lama yang «sudah pensiun» tapi querynya masih jalan di produksi. Model-model ini tidak punya pemilik, tidak punya tier, tidak pernah divalidasi — dan ketika salah satunya merugikan, tidak ada yang bisa menjawab «model apa yang memutuskan ini?». Inventory yang tidak lengkap sama dengan tidak punya inventory: satu model yang luput dari daftar adalah satu model yang tidak diawasi.",
        "Nilai: inventory bagus karena ia mengubah governance dari «kami rasa semua model sudah diawasi» menjadi «ini daftarnya — 12 model, 3 Tier 1, 5 Tier 2, 4 Tier 3 — dan ini tanggal review masing-masing». Ia juga yang membuat lesson ini bisa dikerjakan: kamu tidak bisa memberi tier pada model yang tidak kamu ketahui keberadaannya.",
        "Baik atau buruk: inventory bagus bila ia HIDUP — diperbarui setiap kali model baru naik, model lama pensiun, atau penggunaan model berubah. Buruk bila ia dibuat sekali untuk audit lalu dibiarkan membusuk: inventory setahun lalu yang belum diperbarui adalah daftar model yang SUDAH TIDAK ADA ditambah model baru yang BELUM TERCATAT — dua-duanya menyesatkan. Buruk juga bila pemiliknya ditulis sebagai tim («Tim Data») — pemilik yang tidak bernama adalah pemilik yang tidak bisa dimintai pertanggungjawaban.",
        "Mitigasi: satu orang ditunjuk sebagai penjaga inventory; setiap deployment baru WAJIB mendaftarkan modelnya sebelum live (tanpa baris inventory, tidak ada deployment); setiap kuartal, inventory dicocokkan dengan log produksi — model yang jalan tapi tidak terdaftar dicatat sebagai temuan, bukan sebagai «nanti saja».",
      ],
      tasks: [],
      note: {
        title: "Jebakan: inventory = sekadar daftar nama model",
        type: "risk",
        body: "Yang benar: nama saja tidak cukup. Inventory tanpa pemilik, tanpa versi, tanpa tujuan, dan tanpa tanggal review adalah daftar belanja — ia tidak bisa dipakai untuk memutuskan apa pun. Uji inventory-mu: bila seorang auditor bertanya «model apa yang memutuskan limit nasabah X bulan lalu, siapa pemiliknya, kapan terakhir divalidasi, dan tier berapa ia?» — bila inventory-mu tidak bisa menjawab dalam lima menit, ia belum inventory.",
      },
    },
    {
      id: "shared-dependency",
      eyebrow: "Langkah 2a · Setelah inventory",
      title: "Risiko agregat: satu komponen bersama bisa menjatuhkan tiga model sekaligus",
      prose: [
        "Inventory (langkah 2) mencatat model satu per satu — tapi risiko tidak selalu tinggal di dalam satu model. RISIKO AGREGAT adalah risiko yang muncul dari HUBUNGAN antar-model: satu komponen yang dipakai bersama (shared dependency), satu model yang memakai output model lain (downstream), dan exposure yang dijumlahkan (aggregate exposure). Tiga kolom baru di inventory untuk menangkapnya: shared_dependency (komponen apa yang dipakai bersama, dan siapa pemiliknya), downstream_models (model apa saja yang memakai output model ini), aggregate_exposure (jumlah exposure semua model yang bergantung pada komponen itu), dan concentration_flag (bendera bila konsentrasi melewati batas).",
        "Nilai: tiga komponen bersama di sistem kita — semuanya sudah ada di lesson sebelumnya, dan semuanya belum pernah dilihat sebagai risiko agregat. SATU: feature pipeline [M6.2] — delapan fitur turunan flagship dibangun di satu pipeline, dan pipeline yang sama dipakai model churn [ilustrasi] dan model fraud [ilustrasi]. DUA: kalibrasi Platt [M6.4] — satu fungsi kalibrasi yang sama mengubah skor mentah flagship menjadi probabilitas terkalibrasi yang dipakai threshold, EL, dan EL rate. TIGA: snapshot UCI 30.000 — satu dataset yang sama melatih flagship, mengukur fairness [M7], dan memvalidasi [M8.1]. Aggregate exposure-nya: bila feature pipeline rusak diam-diam, yang dipertaruhkan BUKAN hanya flagship (approved limit NT$424.180.000, EL NT$11.989.453) — tapi juga seluruh alert triase fraud [ilustrasi] dan keputusan promo churn [ilustrasi] — tiga model gagal bersamaan dari SATU penyebab. Angka agregat di luar flagship adalah [ilustrasi]: lesson ini tidak punya angka exposure fraud/churn dari data — yang diajarkan adalah CARA menjumlahkannya, bukan jumlahnya.",
        "Kapan pengawasan dinaikkan: concentration_flag ditegakkan bila SATU dari tiga kondisi terpenuhi — (a) dua atau lebih model Tier 1 bergantung pada satu komponen yang sama (flagship + fraud pada pipeline yang sama); (b) aggregate exposure melewati band materiality tertinggi (mis. melewati NT$600 juta [kebijakan lesson ini] bila dijumlahkan); (c) single point of failure TANPA fallback — komponen itu tidak punya pengganti yang siap jalan (fallback adalah G7 di M8.4). Bila flag ditegakkan, yang berubah bukan tier modelnya — yang berubah adalah pengawasan KOMPONEN-nya: komponen bersama itu diperlakukan sebagai komponen Tier 1-kritis — tier-nya setidaknya setinggi dependen tertingginya — dengan review yang sama dalamnya (validasi independen, monitoring, dan uji kegagalan). Dan munculnya shared dependency baru adalah pemicu re-tiering event-driven (langkah 8): bila flagship mulai memakai output model lain, atau dua model mulai berbagi pipeline, inventory diperbarui dan tier ditinjau ulang.",
        "Baik atau buruk: inventory yang bagus mencatat dependensi — «model ini memakai apa, dan siapa yang memakai model ini» — sehingga satu baris yang rusak bisa dilacak ke semua model yang terkena. Buruk bila inventory hanya daftar nama: pipeline rusak, tiga model memberi keputusan salah, dan tidak ada yang tahu ketiganya berbagi penyebab yang sama — masing-masing diselidiki sebagai insiden terpisah. Buruk juga bila aggregate exposure tidak pernah dijumlahkan: tiap model terlihat «di bawah band» sendirian, padahal bersama-sama mereka sudah melewatinya — seperti tiga pinjaman kecil ke satu debitur yang sama.",
        "Mitigasi: di inventory, untuk tiap model isi DUA kolom tambahan — «bergantung pada» (komponen + pemiliknya) dan «dipakai oleh» (model downstream). Sekali per tahun, gambar ulang dependency graph-nya (gambar langkah ini) dan tanyakan: «komponen mana yang bila mati menjatuhkan paling banyak model Tier 1?» — komponen itu adalah konsentrasi terbesarmu, dan ia butuh fallback (M8.4) sebelum ia butuh penyelidikan.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Dependency graph: feature pipeline dipakai bersama oleh churn, flagship GBM, dan fraud; flagship memutuskan limit 424 juta rupiah NT, fraud memutuskan alert triase, churn memutuskan promo">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Dependency graph — satu pipeline, tiga model</text>
<rect x="30" y="28" width="420" height="30" rx="6" fill="none" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 3"/>
<text x="240" y="47" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Feature pipeline — SHARED [M6.2]</text>
<line x1="90" y1="58" x2="90" y2="84" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="240" y1="58" x2="240" y2="84" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="390" y1="58" x2="390" y2="84" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="30" y="84" width="120" height="34" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="90" y="98" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Churn (Tier 3)</text>
<text x="90" y="111" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[ilustrasi]</text>
<rect x="180" y="84" width="120" height="34" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="240" y="98" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Flagship GBM (Tier 1)</text>
<text x="240" y="111" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">skor + kalibrasi Platt</text>
<rect x="330" y="84" width="120" height="34" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="390" y="98" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Fraud (Tier 1)</text>
<text x="390" y="111" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[ilustrasi]</text>
<line x1="90" y1="118" x2="90" y2="146" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="240" y1="118" x2="240" y2="146" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="390" y1="118" x2="390" y2="146" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="30" y="146" width="120" height="34" rx="6" fill="var(--c2)" opacity="0.2"/>
<text x="90" y="160" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Promo</text>
<text x="90" y="173" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">dampak kecil</text>
<rect x="180" y="146" width="120" height="34" rx="6" fill="var(--c2)" opacity="0.2"/>
<text x="240" y="160" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Keputusan limit</text>
<text x="240" y="173" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">NT$424.180.000</text>
<rect x="330" y="146" width="120" height="34" rx="6" fill="var(--c2)" opacity="0.2"/>
<text x="390" y="160" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Alert triase</text>
<text x="390" y="173" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[ilustrasi]</text>
<text x="240" y="200" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Satu bug di pipeline = 3 model gagal bersamaan</text>
<text x="240" y="216" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Aggregate exposure: flagship NT$424.180.000 + alert fraud [ilustrasi] + promo [ilustrasi]</text>
<text x="240" y="232" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Concentration flag: ≥2 Tier 1 berbagi satu komponen, atau aggregate melewati band, atau tanpa fallback</text>
</svg>`,
        alt: "Dependency graph: feature pipeline dipakai bersama oleh churn, flagship GBM, dan fraud; flagship memutuskan limit 424 juta NT, fraud memutuskan alert triase, churn memutuskan promo; satu bug di pipeline menjatuhkan ketiganya.",
        caption: "Cara membaca: feature pipeline [M6.2] adalah shared dependency — satu komponen yang memberi makan tiga model. Bila ia rusak diam-diam, flagship (keputusan limit NT$424.180.000), fraud (alert triase [ilustrasi]), dan churn (promo [ilustrasi]) gagal bersamaan dari satu penyebab. Karena dua dependennya Tier 1, pipeline itu sendiri diperlakukan sebagai komponen Tier 1-kritis — dan aggregate exposure-nya dicatat di inventory sebagai konsentrasi, bukan hanya risiko per model.",
      },
      tasks: [],
    },
    {
      id: "tiering",
      eyebrow: "Langkah 3 · Tiering",
      title: "Tier 1, 2, 3: rating risiko dan konsekuensinya",
      prose: [
        "Tiering adalah RATING RISIKO tiap model — Tier 1 (risiko tertinggi), Tier 2 (menengah), Tier 3 (terendah). Tier BUKAN nilai kualitas model: Tier 1 tidak berarti «model terbaik», dan Tier 3 tidak berarti «model jelek». Tier berarti «seberapa besar pengawasan yang model ini butuhkan». Model yang sama bisa Tier 1 di satu bank dan Tier 2 di bank lain — karena yang dinilai adalah dampaknya di ORGANISASI itu, bukan modelnya secara abstrak.",
        "Konsekuensi tiap tier [kebijakan lesson ini — aturan internal yang ditulis eksplisit, bukan konstanta alam]: Tier 1 — validasi independen PENUH sebelum live dan review tahunan; sign-off oleh Chief Risk Officer (CRO); monitoring harian/mingguan — PSI skor dan approval rate tanpa label (bisa harian), bad rate dan ECE setelah label matang (jendela 1 bulan [M7.5]); model card lengkap (M8.3); champion-challenger wajib sebelum model baru menggantikan yang lama (M8.1). Tier 2 — validasi independen dengan cakupan yang lebih ringan dan review tiap 2 tahun; sign-off oleh Head of Risk; monitoring mingguan/bulanan. Tier 3 — self-assessment terdokumentasi oleh pemilik model dan review tiap 3 tahun atau saat ada perubahan; sign-off oleh pemilik model; monitoring bulanan/kuartalan. Perhatikan polanya: makin tinggi tier, makin DALAM validasi, makin SERING review, makin TINGGI level sign-off.",
        "Nilai: tiering bagus karena ia MEMPRIORITASKAN sumber daya yang langka. Validasi independen yang mendalam itu mahal — validator yang baik jumlahnya sedikit, waktunya terbatas. Tanpa tiering, validator menghabiskan minggu yang sama untuk model laporan internal dan untuk scorecard kredit — dan scorecard yang memutuskan ratusan juta justru mendapat perhatian yang sama dengan model yang keputusannya tidak berdampak apa-apa. Tiering memastikan jam validator yang paling mahal jatuh pada model yang paling berbahaya.",
        "Baik atau buruk: tiering bagus bila tier-nya DITULIS dengan alasan (skor dan angka — langkah 7) sehingga orang lain bisa mengauditnya. Buruk bila tier ditetapkan dari perasaan («model ini kelihatannya penting») — karena perasaan tidak bisa diaudit, tidak bisa dibandingkan, dan berubah-ubah tiap orang. Buruk juga bila semua model diberi Tier 1 «supaya aman»: bila semua Tier 1, tidak ada prioritas — validator kehabisan waktu di model sepele, dan model berbahaya justru antre.",
        "Mitigasi: tetapkan tier dari SKOR (langkah 7) dengan bobot dan ambang yang ditulis dulu; simpan skor + alasan di inventory; dan tinjau tier setiap tahun (langkah 8) — tier adalah rating yang hidup, bukan stempel permanen.",
      ],
      tasks: [],
    },
    {
      id: "inherent-vs-residual",
      eyebrow: "Langkah 4 · Inheren vs residual",
      title: "Risiko inheren vs residual: kontrol menurunkan yang kedua, bukan yang pertama",
      prose: [
        "Dua istilah yang wajib tidak tertukar. RISIKO INHEREN adalah risiko model SEBELUM kontrol apa pun: seberapa besar dampaknya bila model ini salah, dilihat dari materiality (berapa uang yang diputuskan) dan kompleksitas (seberapa sulit model ini dipahami dan diawasi). RISIKO RESIDUAL adalah risiko yang TERSISA setelah kontrol dipasang: validasi independen, monitoring [M7.5], threshold yang diturunkan dari biaya [M6.4], champion-challenger (M8.1), dan limit/otorisasi manusia. Rumus mentalnya: residual = inheren − efektivitas kontrol (bukan pengurangan aritmetik yang persis — tapi arahnya begitu).",
        "Aturan yang paling sering salah dipahami — dan paling penting di lesson ini: TIER DITETAPKAN DARI RISIKO INHEREN, bukan residual. Scorecard flagship kita tetap Tier 1 walau sudah dipasangi monitoring harian, kalibrasi Platt, dan champion-challenger — karena bila SEMUA kontrol itu gagal sekaligus, yang dipertaruhkan tetap NT$424.180.000 limit dan NT$11.989.453 expected loss. Kontrol yang kuat menurunkan risiko residual (dan itu bagus — itulah gunanya kontrol), tapi tidak menurunkan tier: tier hanya turun bila materiality atau kompleksitasnya sendiri yang turun — misalnya limit yang diputuskan mengecil, atau model diganti dengan yang lebih sederhana.",
        "Nilai: pemisahan ini bagus karena ia mencegah logika berbahaya «model ini sudah dimonitor ketat, jadi tier-nya boleh turun». Logika itu membalik sebab-akibat: monitoring ketat DIPASANG karena tier-nya tinggi — monitoring bukan alasan untuk menurunkan tier. Bila tier turun karena kontrol, maka kontrol yang sama akan dilonggarkan (karena tier-nya sudah rendah), dan risiko residual naik diam-diam. Itulah lingkaran yang dihindari dengan mengunci tier pada inheren.",
        "Baik atau buruk: membedakan inheren dan residual itu bagus karena ia memberi DUA pertanyaan yang berbeda untuk dua keputusan yang berbeda — «seberapa berbahaya model ini?» (inheren → tier) dan «apakah kontrol kita cukup?» (residual → apakah validasi/monitoring perlu diperkuat). Buruk bila keduanya dicampur: «risiko model ini rendah karena sudah divalidasi» adalah kalimat yang mencampur tier dengan kontrol — validasi adalah KONTROL, bukan pengurang tier.",
        "Mitigasi: di inventory, tulis tier dari inheren — dan di kolom terpisah, tulis penilaian kontrol (kuat/cukup/lemah) beserta buktinya (tanggal validasi terakhir, PSI skor terakhir [M7.5], temuan yang masih terbuka). Tier yang tinggi + kontrol yang lemah = prioritas pertama untuk diperbaiki; tier yang rendah + kontrol yang kuat = pemborosan yang boleh dilonggarkan.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: kontrol yang kuat menurunkan tier",
        type: "pitfall",
        body: "Yang benar: tier mengunci RISIKO INHEREN — dampak bila model salah tanpa kontrol. Monitoring harian, kalibrasi, dan champion-challenger menurunkan risiko RESIDUAL, bukan tier. Analogi yang dipakai lesson ini: helm tidak membuat jalanan yang berbahaya menjadi jalanan yang aman — helm membuatmu lebih selamat DI jalanan berbahaya itu. Tier adalah jalanannya; kontrol adalah helmnya.",
      },
    },
    {
      id: "materiality",
      eyebrow: "Langkah 5 · Materiality",
      title: "Materiality: berapa besar dampaknya bila model ini salah",
      prose: [
        "Materiality adalah jawaban atas pertanyaan «berapa besar?» — dalam uang. Untuk scorecard kredit, ukurannya adalah LIMIT yang diputuskan dan EXPECTED LOSS yang melekat padanya. Angka flagship [notebook, m8_tiering]: total LIMIT_BAL test NT$1.007.777.680; dari jumlah itu, model MENYETUJUI NT$424.180.000 (42,09% dari total limit — 1.710 dari 6.000 nasabah, 28,5% [notebook]); dan expected loss atas yang disetujui adalah NT$11.989.453. Expected loss dihitung dari probabilitas TERKALIBRASI — Σ p_cal × LGD × LIMIT_BAL atas nasabah yang disetujui, LGD 0,45, EAD = LIMIT_BAL — karena probabilitas yang dipakai untuk keputusan uang HARUS jujur (itulah gunanya kalibrasi Platt; probabilitas mentah yang mis-kalibrasi akan memberi EL yang salah).",
        "Bacalah angka-angka itu sebagai TIGA lapis. Lapis pertama — EXPOSURE: NT$424.180.000 limit disetujui; rata-rata NT$248.058 per nasabah yang disetujui (dari rata-rata limit test NT$167.963 — yang disetujui rata-rata berlimit lebih besar). Lapis kedua — EXPECTED LOSS: NT$11.989.453, atau 2,83% dari limit yang disetujui (EL rate approved 0,0283), atau rata-rata NT$7.011 per nasabah yang disetujui. Lapis ketiga — PERBANDINGAN: EL seluruh test (bila SEMUA disetujui) adalah NT$78.675.378; EL approved hanya 15,24% dari jumlah itu — artinya model, dengan threshold 0,10 [M6.4], MENAHAN NT$66.685.925 expected loss (EL atas yang ditolak) dari buku. Itulah EL bruto yang dihindari model secara counterfactual — BUKAN nilai bersih model: nilai bersihnya vs threshold 0,50 adalah NT$27.208.456, dan margin nasabah baik yang ditolak belum dikurangkan dari angka ini. Dan itulah juga yang dipertaruhkan bila model salah: bila model mulai menyetujui nasabah yang seharusnya ditolak, EL approved naik dari NT$11.989.453 menuju NT$78.675.378.",
        "Dan bandingkan EL dengan yang TERJADI (realised): realised loss approved NT$11.695.500 — EL NT$11.989.453 hanya NT$293.953 di atas realised (2,51% dari realised loss; bila dihitung dari EL, 2,45%). Kedekatan ini adalah kabar baik: EL dari probabilitas terkalibrasi memprediksi kerugian yang terjadi dengan cukup akurat di test ini. Tapi ingat: EL adalah HARAPAN (rata-rata atas banyak dunia yang mungkin), realised adalah SATU realisasi — keduanya boleh berbeda, dan selisih 2,51% di sini bukan jaminan selisih sekecil itu di periode berikutnya. Margin approved NT$19.909.500 (5% dari exposure nasabah non-default: 0,05 × NT$398.190.000; realised loss NT$11.695.500 = 0,45 × NT$25.990.000) dikurangi realised loss menghasilkan laba bersih approved NT$8.214.000 [M6.4]; total cost pada threshold 0,10 adalah NT$33.046.500 [M6.4] — total cost ini adalah biaya portofolio (bukan pengurang margin di atas); laba bersih = margin − realised loss, bukan margin − total cost. Angka-angka ini semuanya di test 6.000 — skala ke buku penuh 30.000 dengan mengalikan 5: approved limit menjadi NT$2.120.900.000 dan EL approved NT$59.947.265 (lab 1).",
        "Nilai: materiality bagus karena ia mengubah debat abstrak («model ini penting») menjadi angka yang bisa dibandingkan antar-model: NT$424.180.000 limit dan NT$11.989.453 EL untuk scorecard vs — sebagai pembanding [ilustrasi] — model churn yang keputusannya promo senilai jauh lebih kecil per nasabah. Angka yang sama juga yang menjadi input skor tiering (langkah 7).",
        "Baik atau buruk: EL dari probabilitas terkalibrasi itu bagus karena ia jujur — probabilitas 0,10 sungguh berarti peluang default 10% (ECE test 0,0087 [M6.4]). Buruk bila EL dihitung dari probabilitas MENTAH yang mis-kalibrasi: EL-nya akan salah sebesar kesalahan kalibrasinya, dan tier yang ditetapkan dari EL itu ikut salah. Buruk juga bila materiality hanya dihitung SEKALI: limit naik, threshold berubah, populasi bergeser — semuanya menggerakkan EL, dan materiality yang tidak diperbarui adalah materiality yang sudah kedaluwarsa.",
        "Mitigasi: hitung materiality dari probabilitas TERKALIBRASI (bukan mentah), laporkan ketiganya — exposure, EL, dan EL sebagai pangsa dari EL seluruh populasi — dan hitung ulang tiap kali threshold, limit, atau populasi berubah secara material. Materiality adalah angka hidup, seperti tier.",
      ],
      formula: String.raw`\mathrm{EL}_{\text{approved}} = \sum_{i \in \text{approved}} p_{\text{cal},i} \times \mathrm{LGD} \times \mathrm{LIMIT\_BAL}_i, \qquad \mathrm{LGD} = 0{,}45, \quad \mathrm{EAD} = \mathrm{LIMIT\_BAL}`,
      formulaNote: "Expected loss atas nasabah yang disetujui: p_cal = probabilitas default TERKALIBRASI (GBM + Platt, ROC-AUC 0,7816); LGD 0,45; EAD = LIMIT_BAL. Hasil kanonis: NT$11.989.453 atas approved limit NT$424.180.000 (EL rate 0,0283). EL seluruh test NT$78.675.378.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Panel kiri: total limit 1.007,78 juta vs approved limit 424,18 juta NT dolar. Panel kanan: EL seluruh test 78,68 juta; EL approved 11,99 juta; realised loss approved 11,70 juta; laba bersih approved 8,21 juta NT dolar.">
<text x="125.0" y="14" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Limit (NT$ juta) — test 6.000</text>
<text x="355.0" y="14" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">EL &amp; hasil (NT$ juta)</text>
<line x1="30" y1="200" x2="230" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="260" y1="200" x2="450" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="60" y="40" width="44" height="160" fill="var(--c1)"/>
<text x="82" y="36" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1.007,78</text>
<text x="82" y="214" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Total limit</text>
<rect x="150" y="132.6" width="44" height="67.4" fill="var(--c4)"/>
<text x="172" y="128.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">424,18</text>
<text x="172" y="214" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Approved limit</text>
<rect x="265" y="40" width="34" height="160" fill="var(--c2)"/>
<text x="282" y="36" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">78,68</text>
<text x="282" y="212" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">EL seluruh</text>
<text x="282" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">test</text>
<rect x="305" y="175.6" width="34" height="24.4" fill="var(--c4)"/>
<text x="322" y="171.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">11,99</text>
<text x="322" y="212" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">EL</text>
<text x="322" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">approved</text>
<rect x="345" y="176.2" width="34" height="23.8" fill="var(--c1)"/>
<text x="362" y="172.2" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">11,70</text>
<text x="362" y="212" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Rugi realised</text>
<text x="362" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">approved</text>
<rect x="385" y="183.3" width="34" height="16.7" fill="var(--c3)"/>
<text x="402" y="179.3" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">8,21</text>
<text x="402" y="212" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Laba bersih</text>
<text x="402" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">approved</text>
</svg>`,
        alt: "Panel kiri: total limit 1.007,78 juta vs approved limit 424,18 juta NT dolar. Panel kanan: EL seluruh test 78,68 juta; EL approved 11,99 juta; realised loss approved 11,70 juta; laba bersih approved 8,21 juta NT dolar.",
        caption: "Cara membaca: panel kiri memakai skala sendiri (maksimum 1.007,78) dan panel kanan memakai skala sendiri (maksimum 78,68) — keduanya dalam NT$ juta, test 6.000. Approved limit 424,18 adalah 42,09% dari total limit; EL approved 11,99 hanya 15,24% dari EL seluruh test (78,68) — model menahan NT$66,69 juta EL. EL approved (11,99) dekat dengan realised loss approved (11,70): selisih NT$293.953 (2,51%). Laba bersih approved NT$8,21 juta = margin NT$19,91 juta − realised loss NT$11,70 juta [M6.4]. Semua angka ini angka SAMPEL test 6.000 — skala ke buku penuh dengan ×(ukuran buku / 6.000).",
      },
      tasks: [],
    },
    {
      id: "exposure-complexity",
      eyebrow: "Langkah 6 · Matriks tiering",
      title: "Matriks exposure × kompleksitas: peta tiering dalam satu gambar",
      prose: [
        "Tiering tidak hanya soal «berapa uangnya» — ada sumbu kedua: KOMPLEKSITAS. Matriks 2D lesson ini memetakan kedua sumbu itu: sumbu horizontal EXPOSURE/MATERIALITY (rendah → tinggi: berapa uang dan berapa banyak keputusan yang diputuskan), sumbu vertikal KOMPLEKSITAS (rendah → tinggi: seberapa sulit model dipahami, dijelaskan, dan diawasi). Sembilan sel matriks dipetakan ke tiga tier [kebijakan lesson ini] dari JUMLAH LEVEL kedua sumbu (rendah=0, sedang=1, tinggi=2): Tier 1 bila jumlah level ≥ 3; Tier 2 bila jumlah level = 2; Tier 3 bila jumlah level ≤ 1. Jadi Tier 1 di sudut kanan-atas (tiga sel: exposure tinggi × kompleksitas sedang/tinggi, dan kompleksitas tinggi × exposure sedang); Tier 3 di sudut kiri-bawah (tiga sel: keduanya rendah, atau satu rendah + satu sedang); Tier 2 di antaranya (tiga sel diagonal, jumlah level = 2). Flagship kita duduk di sel (exposure TINGGI, kompleksitas SEDANG) — materiality M=3 dari approved limit NT$424,18 juta, kompleksitas C=2 karena GBM tunggal — dan sel itu Tier 1.",
        "Kenapa dua sumbu, bukan satu? Karena masing-masing sumbu menangkap kegagalan yang berbeda. Exposure tinggi + kompleksitas RENDAH (misal: aturan skor sederhana yang memutuskan limit miliaran) tetap berbahaya — bukan karena modelnya sulit dipahami, melainkan karena dampak keputusannya besar dan kesalahannya akan berskala besar. Exposure rendah + kompleksitas TINGGI (misal: deep learning untuk laporan internal) juga butuh pengawasan lebih dari Tier 3 — bukan karena uangnya, melainkan karena tidak ada yang bisa menjelaskan kenapa model itu memutuskan begitu, sehingga kesalahannya sulit dideteksi. (Matriks menempatkannya di Tier 2 — jumlah level 0 + 2 = 2 — tetapi skor yang mengikat berkata Tier 3: M=0, C=4, B=0 → 1,20; lihat mitigasi di bawah.) Satu sumbu saja akan melewatkan salah satu dari keduanya.",
        "Nilai: matriks bagus karena ia memaksa DUA pertanyaan sebelum memberi tier — «berapa besar dampaknya?» DAN «seberapa sulit model ini diawasi?» — dan karena ia membuat tier BISA DIPERDEBATKAN: dua orang yang tidak sepakat soal tier bisa menunjuk sel yang berbeda dan berdebat soal sumbu mana yang salah dinilai, bukan soal perasaan. Matriks juga yang membuat jebakan langkah 9 terlihat: tiering dari nama model («GBM = Tier 1») adalah tiering yang hanya memakai sumbu vertikal dan mengabaikan horizontal.",
        "Baik atau buruk: matriks 3×3 bagus karena ia SEDERHANA — sembilan sel cukup untuk memisahkan prioritas tanpa berpura-pura presisi. Buruk bila dibaca sebagai pengukuran yang persis: batas antara «sedang» dan «tinggi» adalah keputusan kebijakan (langkah 7 menulis ambangnya), bukan konstanta alam. Dua model yang jatuh di sel yang sama bisa tetap berbeda materiality-nya — matriks memberi PETA, bukan GPS.",
        "Mitigasi: pakai matriks sebagai LANGKAH PERTAMA (di sel mana model ini jatuh?), lalu hitung SKOR (langkah 7) sebagai langkah kedua yang menuliskan alasannya dengan angka. Bila matriks dan skor tidak sepakat, SKOR YANG MENGIKAT: matriks adalah saringan kasar, skor adalah perhitungan yang mengikat. Contoh: deep learning untuk laporan internal — matriks berkata Tier 2 (jumlah level 2), skor berkata Tier 3 (1,20) — tier-nya Tier 3. Bila matriks berkata Tier 2 tapi skor berkata Tier 1, selidiki: biasanya ada sumbu ketiga yang luput, yaitu BREADTH (berapa banyak keputusan — langkah 7) — tetapi selisih itu dicatat sebagai perbedaan metode, bukan dipakai menaikkan tier secara diam-diam.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Matriks 3 kali 3 exposure vs kompleksitas: Tier 1 bila jumlah level kompleksitas + exposure ≥ 3; Tier 3 bila jumlah level ≤ 1; Tier 2 bila jumlah level = 2. Flagship di sel exposure tinggi, kompleksitas sedang: Tier 1.">
<text x="270.0" y="14" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Matriks tiering — exposure × kompleksitas</text>
<text x="150" y="26" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Rendah</text>
<text x="270" y="26" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Sedang</text>
<text x="390" y="26" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Tinggi</text>
<text x="82" y="61" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Tinggi</text>
<text x="82" y="116" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Sedang</text>
<text x="82" y="171" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Rendah</text>
<rect x="90" y="30" width="120" height="55" fill="var(--c4)" opacity="0.55"/>
<text x="150" y="56" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tier 2</text>
<text x="150" y="71" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">sulit diawasi,</text>
<text x="150" y="82" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">dampak kecil</text>
<rect x="210" y="30" width="120" height="55" fill="var(--c2)" opacity="0.55"/>
<text x="270" y="56" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tier 1</text>
<text x="270" y="71" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">validasi penuh</text>
<rect x="330" y="30" width="120" height="55" fill="var(--c2)" opacity="0.55"/>
<text x="390" y="56" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tier 1</text>
<text x="390" y="71" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">validasi penuh</text>
<rect x="90" y="85" width="120" height="55" fill="var(--c1)" opacity="0.55"/>
<text x="150" y="111" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tier 3</text>
<text x="150" y="126" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">self-assessment</text>
<rect x="210" y="85" width="120" height="55" fill="var(--c4)" opacity="0.55"/>
<text x="270" y="111" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tier 2</text>
<text x="270" y="126" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">validasi ringan</text>
<rect x="330" y="85" width="120" height="55" fill="var(--c2)" opacity="0.55"/>
<text x="390" y="106" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tier 1 ★</text>
<text x="390" y="121" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">Flagship (M=3, C=2)</text>
<text x="390" y="132" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">validasi penuh</text>
<rect x="90" y="140" width="120" height="55" fill="var(--c1)" opacity="0.55"/>
<text x="150" y="166" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tier 3</text>
<text x="150" y="181" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">self-assessment</text>
<rect x="210" y="140" width="120" height="55" fill="var(--c1)" opacity="0.55"/>
<text x="270" y="166" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tier 3</text>
<text x="270" y="181" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">self-assessment</text>
<rect x="330" y="140" width="120" height="55" fill="var(--c4)" opacity="0.55"/>
<text x="390" y="166" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tier 2</text>
<text x="390" y="181" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">dampak besar,</text>
<text x="390" y="192" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">model sederhana</text>
<text x="270" y="212" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Exposure / materiality → (rendah ke tinggi)</text>
<text x="270" y="228" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Tier dari RISIKO INHEREN — kontrol tidak menurunkan tier (langkah 4). Sumbu vertikal: kompleksitas (tinggi di atas).</text>
</svg>`,
        alt: "Matriks 3 kali 3 exposure vs kompleksitas: Tier 1 bila jumlah level kompleksitas + exposure ≥ 3; Tier 3 bila jumlah level ≤ 1; Tier 2 bila jumlah level = 2. Flagship di sel exposure tinggi, kompleksitas sedang: Tier 1.",
        caption: "Cara membaca: sumbu horizontal = exposure/materiality (rendah → tinggi), sumbu vertikal = kompleksitas (rendah di bawah, tinggi di atas). Tier 1 menempati tiga sel kanan-atas; Tier 3 menempati tiga sel kiri-bawah; Tier 2 sisanya. ★ Flagship (M=3, C=2) duduk di sel exposure tinggi × kompleksitas sedang → Tier 1. Perhatikan sel kanan-bawah: exposure tinggi + kompleksitas rendah tetap Tier 2 — model sederhana yang memutuskan uang besar tetap butuh pengawasan, bukan Tier 3.",
      },
      tasks: [],
    },
    {
      id: "tiering-criteria",
      eyebrow: "Langkah 7 · Skor tiering",
      title: "Skor tiering: bobot ditulis dulu, tier dihitung — bukan ditebak",
      prose: [
        "Matriks langkah 6 memberi peta; skor tiering memberi ANGKA. Kebijakan skor lesson ini [kebijakan lesson ini — bobot dan ambang dipilih eksplisit di sini, bukan konstanta alam]: tiga komponen, masing-masing 0–4. M = MATERIALITY, dari approved LIMIT_BAL: di bawah NT$50 juta → 0; NT$50 juta ≤ limit < NT$150 juta → 1; NT$150 juta ≤ limit < NT$300 juta → 2; NT$300 juta ≤ limit < NT$600 juta → 3; limit ≥ NT$600 juta → 4. C = COMPLEXITY: 0 aturan bisnis/rule-based; 1 regresi logistik; 2 GBM tunggal; 3 ensemble/stacked; 4 deep learning atau data tidak terstruktur. B = BREADTH (berapa banyak keputusan): 0 laporan internal sesekali; 1 di bawah 100 keputusan/bulan; 2 sebanyak 100–1.000/bulan; 3 sebanyak 1.000–10.000/bulan; 4 di atas 10.000/bulan. Skor = 0,50×M + 0,30×C + 0,20×B. Tier: skor ≥ 2,5 → Tier 1; 1,5 ≤ skor < 2,5 → Tier 2; skor < 1,5 → Tier 3.",
        "Terapkan pada flagship: M=3 (approved limit NT$424,18 juta jatuh di band NT$300–600 juta [notebook]); C=2 (GBM tunggal); B=3 [ilustrasi — 6.000 aplikasi per periode di test, dipakai sebagai laju keputusan per periode]. Skor = 0,50×3 + 0,30×2 + 0,20×3 = 1,50 + 0,60 + 0,60 = 2,70 → Tier 1. Catatan sensitivitas [ilustrasi]: M dan B dihitung dari skala sampel (approved limit NT$424,18 juta; 6.000 aplikasi per periode) — bila keduanya dihitung dari buku penuh (total limit test NT$2.120.900.000; laju keputusan diskalakan), M=4 dan B=4 → skor 3,40 — tetap Tier 1; tier flagship tidak bergantung pada pilihan skala ini. Perhatikan bobotnya: materiality mendapat bobot TERBESAR (0,50) — karena uang yang dipertaruhkan adalah penentu utama risiko; kompleksitas 0,30; breadth 0,20. Bobot ini adalah KEPUTUSAN KEBIJAKAN: bank yang berbeda boleh memakai bobot berbeda — yang tidak boleh adalah bobot yang tidak ditulis.",
        "Nilai: skor bagus karena ia membuat tier DAPAT DIAUDIT. Bila seseorang tidak setuju flagship Tier 1, ia harus menunjukkan komponen mana yang salah — «M seharusnya 2, bukan 3» — dan perdebatan itu bisa diselesaikan dengan angka (approved limit NT$424,18 juta memang di band 300–600 juta). Tanpa skor, perdebatan tier adalah perdebatan selera.",
        "Baik atau buruk: skor tertimbang bagus karena ia memaksa ketiga sumbu dinilai — model dengan materiality tinggi tapi kompleksitas rendah tidak bisa lolos ke Tier 3 hanya karena «modelnya sederhana». Buruk bila skor dibaca sebagai presisi palsu: 2,70 vs 2,49 terlihat berbeda jauh (Tier 1 vs Tier 2) padahal selisihnya 0,21 — satu komponen yang dinilai satu tingkat berbeda. Di dekat ambang, skor adalah sinyal untuk BERDISKUSI, bukan vonis otomatis: model dengan skor 2,4–2,6 sebaiknya ditinjau manusia sebelum tier dikunci.",
        "Mitigasi: tulis bobot dan ambang di kebijakan, simpan tiap komponen (M, C, B) di inventory bersama tier-nya, dan tetapkan aturan: skor dalam 0,1 dari ambang → peninjauan manual oleh risk manager. Skor adalah alat bantu keputusan — bukan pengganti keputusan.",
      ],
      formula: String.raw`\text{Skor} = 0{,}50 \times M + 0{,}30 \times C + 0{,}20 \times B, \qquad \begin{array}{ll} \text{Skor} \ge 2{,}5 & \text{Tier 1} \\ 1{,}5 \le \text{Skor} < 2{,}5 & \text{Tier 2} \\ \text{Skor} < 1{,}5 & \text{Tier 3} \end{array}`,
      formulaNote: "Skor tiering [kebijakan lesson ini]. M = materiality 0–4 (dari approved LIMIT_BAL); C = complexity 0–4; B = breadth 0–4. Flagship: M=3, C=2, B=3 [ilustrasi untuk B] → skor 2,70 → Tier 1.",
      tasks: [],
    },
    {
      id: "re-tiering",
      eyebrow: "Langkah 8 · Re-tiering",
      title: "Re-tiering: kapan rating berubah — dan siapa yang memutuskan",
      prose: [
        "Tier bukan stempel permanen. RE-TIERING adalah peninjauan ulang tier — dan ia terjadi karena DUA pemicu. Pertama, TERJADWAL: tiap tahun, bersamaan dengan review tahunan Tier 1 (atau tiap 2–3 tahun untuk Tier 2/3). Kedua, EVENT-DRIVEN — kapan pun terjadi salah satu dari ini: (1) PENGGUNAAN BARU — model yang tadinya untuk laporan internal kini dipakai untuk keputusan kredit (atau sebaliknya); (2) EXPOSURE MELEWATI BAND — approved limit naik dari band NT$150–300 juta ke NT$300–600 juta, sehingga M naik satu tingkat; (3) TEMUAN VALIDASI MATERIAL — validasi independen menemukan kelemahan yang mengubah penilaian kompleksitas atau keandalan; (4) DRIFT BESAR yang bertahan — PSI skor di atas 0,25 [kebijakan lesson ini] atau kalibrasi yang rusak (ECE di atas 0,02 [kebijakan lesson ini]) menandakan model berperilaku di luar yang divalidasi; sebagai perbandingan, PSI skor chunk 1 vs chunk 5 di M7.5 hanya 0,0161 — jauh di bawah ambang ini. PSI tanpa label bisa dibaca harian; ECE dan bad rate butuh label matang (jendela 1 bulan [M7.5]); (5) INSIDEN KERUGIAN — kerugian nyata yang melibatkan model; (6) PERUBAHAN REGULASI — aturan baru yang menaikkan ekspektasi pengawasan.",
        "Contoh konkret dari angka lesson: flagship hari ini M=3 (approved limit NT$424,18 juta). Bila buku tumbuh dan approved limit melewati NT$600 juta, M menjadi 4 — skor naik dari 2,70 ke 3,20, tetap Tier 1 (tapi dengan materiality yang lebih besar, validasi tahunannya harus lebih dalam). Sebaliknya, bila threshold dinaikkan sehingga approval menyusut dan approved limit jatuh ke band NT$150–300 juta, M menjadi 2 — skor turun ke 2,20 → Tier 2. Perhatikan: tier TURUN di sini karena MATERIALITY-nya sendiri yang turun (langkah 4) — bukan karena kontrol. Dan satu arah yang tidak boleh dilupakan: model Tier 3 yang tiba-tiba dipakai untuk keputusan kredit NAIK tier-nya seketika — penggunaan baru adalah pemicu re-tiering yang paling sering terlewat, karena yang berubah bukan modelnya, melainkan CARA model itu dipakai.",
        "Nilai: re-tiering bagus karena ia menjaga tier tetap JUJUR terhadap dunia yang berubah. Model yang tier-nya tidak pernah ditinjau akan berakhir dengan tier yang salah di kedua arah: Tier 1 yang sebenarnya sudah Tier 2 (pemborosan validasi) atau — lebih berbahaya — Tier 3 yang sebenarnya sudah Tier 1 (model berbahaya yang diawasi seperti model sepele).",
        "Baik atau buruk: re-tiering terjadwal bagus karena ia mencegah tier membusuk diam-diam. Buruk bila re-tiering hanya terjadwal dan tidak event-driven: model yang penggunaannya berubah di tengah tahun tidak boleh menunggu review tahunan untuk naik tier — ia naik tier saat penggunaannya berubah. Dan buruk bila re-tiering diputuskan oleh pemilik model sendiri tanpa peninjau independen — pemilik model punya insentif untuk MENURUNKAN tier modelnya (validasi lebih ringan); keputusan re-tiering naik harus bisa dipicu oleh validator atau risk manager, bukan hanya oleh pemilik.",
        "Mitigasi: tulis enam pemicu event-driven di kebijakan; setiap perubahan penggunaan model WAJIB dilaporkan ke penjaga inventory dalam 5 hari kerja [kebijakan lesson ini]; dan catat setiap re-tiering — tanggal, pemicu, skor lama vs baru, dan siapa yang menyetujui — di inventory. Tanpa catatan ini, audit setahun kemudian tidak bisa menjawab «kapan model ini naik tier, dan kenapa?».",
      ],
      tasks: [],
      note: {
        title: "Jebakan: tier turun karena model «sudah lama aman»",
        type: "risk",
        body: "Yang benar: «sudah lama tidak bermasalah» bukan pemicu re-tiering turun — tier turun hanya bila skor tieringnya turun, yaitu bila materiality, kompleksitas, atau breadth-nya sendiri turun (langkah 4). Model Tier 1 yang tiga tahun tidak bermasalah tetap Tier 1 selama ia masih memutuskan NT$424,18 juta limit: tidak adanya insiden adalah bukti KONTROL bekerja, bukan bukti risiko inheren mengecil.",
      },
    },
    {
      id: "vendor-models",
      eyebrow: "Langkah 8a · Setelah re-tiering",
      title: "Model vendor: yang membeli tetap pemilik — dan perubahan vendor adalah re-tiering",
      prose: [
        "Tidak semua model dibangun di dalam bank. MODEL VENDOR adalah model yang dibeli atau disewa — skor kredit dari biro, model anti-fraud dari penyedia, API scoring dari pihak ketiga — dan godaan terbesarnya adalah menganggap «sudah divalidasi vendor, jadi kita tidak perlu memvalidasi». Yang benar adalah sebaliknya: model vendor TETAP butuh owner internal (satu nama orang di dalam organisasi — vendor tidak bisa menjadi owner), TETAP masuk inventory, dan TETAP punya tier — tier-nya mengikuti keputusan yang ia beri makan: skor vendor yang dipakai sebagai fitur flagship adalah Tier 1, karena flagship Tier 1. Membeli model tidak membeli tanggung jawabnya.",
        "Intake checklist — sepuluh hal yang harus ada SEBELUM model vendor dipakai untuk satu keputusan pun. (1) Owner internal: satu nama orang yang bertanggung jawab — bukan «tim vendor». (2) Model/version identifier: nama + versi vendor yang DIPIN (bukan «model terbaru» — «terbaru» berubah tanpa kabar). (3) Input-output contract: schema input, definisi tiap fitur, satuan, dan arti tiap output — ditulis, bukan ditebak dari dokumentasi pemasaran. (4) Validation evidence: bukti validasi vendor DITAMBAH validasi internal atas data kita — bukti vendor saja tidak cukup, karena vendor memvalidasi pada populasi vendor, bukan populasi kita. (5) SLA: uptime, latency, dan waktu respons insiden — dengan angka, bukan janji. (6) Incident notification: vendor WAJIB memberitahu perubahan model, bug, atau insiden dalam jangka waktu yang ditulis [kebijakan organisasi]. (7) Audit rights: hak audit + akses log keputusan vendor — tanpa itu, validator tidak bisa menguji apa pun. (8) Data residency: di mana data nasabah kita diproses dan disimpan — dan apakah itu diizinkan regulasi yang berlaku. (9) Fallback/exit plan: apa yang terjadi bila vendor mati, menaikkan harga, atau mengubah model — model pengganti apa yang siap jalan, dan berapa lama transisinya (fallback adalah G7 di M8.4). (10) Re-tiering: perubahan versi vendor adalah pemicu re-tiering event-driven — model yang tadinya Tier 2 bisa naik Tier 1 bila vendor mengubah perilakunya, dan tier itu ditinjau ulang pada tiap perubahan versi.",
        "Mini-case — vendor yang mengubah model tanpa pemberitahuan [ilustrasi]. Bank memakai «CreditScore-as-a-Service» dari vendor sebagai fitur ke-32 flagship: skor 0–100 yang masuk ke GBM bersama 31 fitur lain. Intake-nya lengkap di atas kertas — kecuali dua hal: versi tidak dipin («kami selalu memakai versi terbaru») dan incident notification tidak ada di kontrak. Enam bulan kemudian vendor mengganti definisi skornya (dari «peluang default 12 bulan» menjadi «peluang default 6 bulan») tanpa pemberitahuan. Yang terjadi: distribusi fitur ke-32 bergeser diam-diam; skor flagship bergeser; threshold 0,10 yang tadinya optimal kini menolak terlalu banyak nasabah bagus — dan tidak ada alert yang berbunyi, karena monitoring [M7.5] memantau skor AKHIR, bukan distribusi tiap fitur input. Yang menangkapnya akhirnya adalah validation halves di revalidasi — enam bulan kemudian, setelah ribuan keputusan yang salah. Dua item checklist yang seharusnya menangkapnya lebih dulu: (2) model/version identifier yang dipin — perubahan versi akan tertolak di pintu masuk, bukan ditemukan di revalidasi; dan (6) incident notification — vendor yang wajib memberitahu perubahan tidak bisa mengubah definisi diam-diam. Pelajarannya: untuk model vendor, yang paling berbahaya bukan modelnya — melainkan PERUBAHAN modelnya yang tidak kamu ketahui. Dan perubahan yang tidak kamu ketahui adalah perubahan yang tidak bisa kamu validasi.",
        "Nilai: intake checklist bagus karena ia memindahkan risiko vendor dari «kepercayaan» ke «kontrak»: tiap item adalah sesuatu yang bisa diperiksa sebelum keputusan pertama diambil. Buruk bila checklist diisi sesudah model dipakai — «kami sudah pakai enam bulan, mari lengkapi dokumennya» — karena pada titik itu vendor sudah memegang keputusanmu dan kamu tidak punya daya tawar untuk meminta audit rights atau fallback.",
        "Mitigasi: jangan pernah memakai output vendor tanpa version identifier yang dipin dan tanpa incident notification tertulis. Dan di model card (M8.3), cantumkan model vendor sebagai dependensi beserta versinya — agar G13 (lifecycle linkage) bisa mendeteksi mismatch antara versi yang divalidasi dan versi yang berjalan.",
      ],
      tasks: [],
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 9 · Jebakan",
      title: "Jebakan tiering: menilai nama model, bukan dampak keputusannya",
      prose: [
        "Jebakan pertama dan paling umum: tiering dari NAMA atau KOMPLEKSITAS model, bukan dari dampak keputusannya. «GBM itu kompleks, jadi Tier 1; regresi logistik itu sederhana, jadi Tier 3.» Salah di kedua arah. Regresi logistik sederhana yang memutuskan limit NT$ miliaran adalah Tier 1 — karena bila koefisiennya salah, kerugiannya miliaran, sesederhana apa pun rumusnya. Sebaliknya, GBM yang kompleks tapi hanya mengurutkan laporan internal adalah Tier 3 — karena keputusannya tidak menggerakkan uang. Yang dinilai adalah KEPUTUSAN, bukan ALGORITMA. Matriks langkah 6 sudah menunjukkan ini: sel kanan-bawah (exposure tinggi, kompleksitas rendah) tetap Tier 2, bukan Tier 3.",
        "Jebakan kedua: tiering SEKALI lalu dilupakan. Tier ditetapkan saat model live, lalu tidak pernah ditinjau — sementara limit naik, penggunaan berubah, dan populasi bergeser. Inilah yang ditangani re-tiering (langkah 8): tier yang tidak ditinjau adalah tier yang kedaluwarsa. Jebakan ketiga: «semua model Tier 1 supaya aman» — bila semua Tier 1, tidak ada prioritas, validator kehabisan waktu di model sepele, dan model berbahaya antre di belakang model laporan. Jebakan keempat: tiering TANPA inventory — memberi tier pada model yang diketahui sambil membiarkan model tak terdaftar tanpa tier sama sekali. Jebakan kelima: menyamakan tier dengan KUALITAS — «model Tier 3 itu model jelek» — lalu tim berebut menaikkan tier modelnya demi gengsi, atau menolak Tier 1 karena dianggap «nilai buruk». Tier bukan rapor; tier adalah jadwal pengawasan.",
        "Nilai: mengenali jebakan-jebakan ini bagus karena masing-masing punya TANDA yang bisa dikenali: tier yang sama untuk semua model (jebakan ketiga), tier yang tidak pernah berubah dalam tiga tahun (jebakan kedua), tier yang mengikuti nama algoritma (jebakan pertama), model yang jalan tanpa baris inventory (jebakan keempat), dan tim yang membanggakan tier-nya (jebakan kelima).",
        "Baik atau buruk: daftar jebakan bagus sebagai CHECKLIST audit — lima pertanyaan, lima jawaban ya/tidak. Buruk bila daftar ini dibaca lalu dilupakan: jebakan tiering bukan diteorikan, melainkan DIAUDIT — tiap tahun, ambil inventory, dan tanyakan kelima pertanyaan itu pada tiap baris.",
        "Mitigasi: jadikan kelima jebakan ini pertanyaan audit tahunan; dan satu aturan keras — tier model apa pun yang ditetapkan HANYA dari nama algoritmanya (tanpa skor M/C/B langkah 7) dianggap TIDAK SAH sampai dihitung ulang.",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: beri tier pada tiga model — dan bela dengan angka",
      prose: [
        "Sekarang giliranmu. Tiga model [ilustrasi — angka di bawah ini BUKAN angka kanonis, melainkan skenario yang ditulis untuk latihan; yang kanonis hanyalah flagship], beri tier pada masing-masing dengan skor langkah 7 (bobot 0,50/0,30/0,20; ambang 2,5 dan 1,5) dan bela jawabanmu.",
        "Model A — SCORECARD KREDIT flagship (angka kanonis): GBM terkalibrasi, threshold 0,10, approved limit NT$424.180.000, EL approved NT$11.989.453, 6.000 aplikasi per periode [notebook]. M=3 (band NT$300–600 juta), C=2 (GBM tunggal), B=3 [ilustrasi untuk B]. Skor = 0,50×3 + 0,30×2 + 0,20×3 = 2,70 → Tier 1. Pembelaan: yang dipertaruhkan NT$424,18 juta limit dan NT$11,99 juta EL — bila model salah menilai, kerugian bergerak dalam jutaan NT$ per periode; validasi independen penuh + review tahunan + sign-off CRO adalah harga yang wajar.",
        "Model B — MODEL CHURN MARKETING [ilustrasi]: regresi logistik yang memprediksi pelanggan berhenti langganan; keputusannya adalah mengirim promo/diskon kecil; exposure per keputusan kecil (M=1); kompleksitas rendah (C=1); breadth sedang (B=2, ratusan keputusan/bulan). Skor = 0,50×1 + 0,30×1 + 0,20×2 = 1,20 → Tier 3. Pembelaan: keputusan terburuknya adalah promo yang salah sasaran — kerugiannya biaya promo, bukan kredit macet; self-assessment terdokumentasi + review 3-tahunan sudah memadai. Perhatikan: model B BUKAN Tier 3 «karena regresi logistik» — ia Tier 3 karena DAMPAK keputusannya kecil. Regresi logistik yang sama, bila dipakai memutuskan limit, akan Tier 1 (jebakan langkah 9).",
        "Model C — MODEL DETEKSI FRAUD [ilustrasi]: ensemble yang memutuskan apakah transaksi diblokir; exposure tinggi (M=3 — nilai transaksi yang diputuskan per periode di band yang sama dengan flagship); kompleksitas tinggi (C=3 — ensemble); breadth tertinggi (B=4 — puluhan ribu keputusan/bulan). Skor = 0,50×3 + 0,30×3 + 0,20×4 = 3,20 → Tier 1. Pembelaan: skor TERTINGGI dari ketiganya — bukan hanya karena exposure, melainkan karena ketiganya tinggi sekaligus; kesalahan di sini dua arah (fraud lolos = kerugian; nasabah sah diblokir = kehilangan nasabah + komplain) dan terjadi puluhan ribu kali per bulan, sehingga kesalahan kecil pun berskala besar.",
        "Bacalah ketiganya berdampingan: A (2,70) dan C (3,20) sama-sama Tier 1 tapi dengan alasan yang berbeda — A karena uang per keputusan besar, C karena ketiganya tinggi sekaligus. B (1,20) Tier 3 walau modelnya «serius» (regresi logistik yang dilatih dengan benar) — karena tier menilai dampak, bukan keseriusan. Dan satu catatan kejujuran: B dan C adalah [ilustrasi] — di organisasimu, angka M/C/B mereka harus dihitung dari data nyata, bukan dari skenario latihan.",
        "Nilai: mini-case bagus karena ia memaksa satu kebiasaan — SETIAP tier harus bisa dibela dengan skor dan angka. «Tier 1 karena penting» bukan pembelaan; «Tier 1 karena skor 2,70 (M=3 dari approved limit NT$424,18 juta, C=2, B=3)» adalah pembelaan.",
        "Baik atau buruk: mini-case bagus sebagai latihan karena ketiga modelnya sengaja dibuat BERBEDA di semua sumbu — sehingga tidak ada jawaban yang «kebetulan benar». Buruk bila hasilnya dihafal («churn selalu Tier 3»): di bank lain, model churn yang menentukan diskon besar untuk nasabah prioritas bisa Tier 2 — yang dihafal haruslah CARA menghitungnya, bukan hasilnya.",
        "Mitigasi: untuk setiap model di inventory-mu, tulis satu kalimat pembelaan tier-nya dengan format yang sama — «Tier X karena skor Y (M=…, C=…, B=…)». Bila kalimat itu tidak bisa ditulis, tier-nya belum sah.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 11 · Lab 1",
      title: "Lab: hitung materiality flagship — approved limit, EL, dan skala buku penuh",
      prose: [
        "Sekarang hitung materiality dengan tanganmu sendiri dari angka kanonis [notebook, m8_tiering]: total LIMIT_BAL test NT$1.007.777.680; approved LIMIT_BAL NT$424.180.000; EL approved NT$11.989.453; EL seluruh test NT$78.675.378; LGD 0,45. Empat angka yang dihitung: pangsa approved limit (approved / total); EL rate approved (EL approved / approved limit); pangsa EL approved dari EL seluruh test; dan EL approved bila diskala ke buku penuh 30.000 baris (×5 — karena test 6.000 adalah 1/5 dari data). Terakhir, EL per nasabah dari rumus Σ p_cal × LGD × LIMIT_BAL, dihitung atas 4 nasabah yang disetujui [ilustrasi] — supaya kamu melihat rumus EL bekerja pada baris, bukan hanya pada agregat.",
        "Hasil yang diharapkan [lab]: approved_share=0.4209; el_rate_approved=0.0283; el_share=0.1524; el_full_book=59947265; el_sample=9225. Bacalah ketiganya: approved limit 42,09% dari total — model menyetujui kurang dari separuh uang yang diajukan; EL rate 2,83% — dari tiap NT$100 limit yang disetujui, NT$2,83 diharapkan hilang; EL approved hanya 15,24% dari EL seluruh test — model menahan 84,76% EL dengan menolak 57,91% limit. Dan el_sample=9225 menunjukkan rumus EL pada empat nasabah [ilustrasi]: 0,02×0,45×100.000 = 900; 0,05×0,45×200.000 = 4.500; 0,08×0,45×50.000 = 1.800; 0,03×0,45×150.000 = 2.025; jumlahnya 9.225.",
        "Setelah lab jalan, bandingkan EL approved NT$11.989.453 dengan realised loss approved NT$11.695.500 [notebook]: EL hanya NT$293.953 di atas realised (2,51% dari realised loss) — EL dari probabilitas terkalibrasi memprediksi kerugian yang terjadi dengan cukup akurat di test ini. Lalu tanyakan: bila EL dihitung dari probabilitas MENTAH yang mis-kalibrasi, apakah selisihnya akan sekecil ini? Itulah gunanya kalibrasi untuk keputusan uang.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi approved_share, el_rate_approved, dan el_share dari angka agregat kanonis" },
        { id: "t2", text: "Lengkapi el_full_book: skala EL approved ke buku penuh 30.000 (×5)" },
        { id: "t3", text: "Lengkapi el_sample: Σ p_cal × LGD × LIMIT_BAL atas 4 nasabah [ilustrasi]" },
      ],
      expected: "approved_share=0.4209\nel_rate_approved=0.0283\nel_share=0.1524\nel_full_book=59947265\nel_sample=9225",
      hints: [
        "approved_share = 424.180.000 / 1.007.777.680 = 0,4209; el_rate_approved = 11.989.453 / 424.180.000 = 0,0283; el_share = 11.989.453 / 78.675.378 = 0,1524.",
        "Test 6.000 adalah 1/5 dari data 30.000 — skala dengan ×(30.000 / 6.000) = ×5: 11.989.453 × 5 = 59.947.265.",
        "EL per nasabah = p_cal × LGD × LIMIT_BAL: (0,02×0,45×100.000) + (0,05×0,45×200.000) + (0,08×0,45×50.000) + (0,03×0,45×150.000) = 900 + 4.500 + 1.800 + 2.025 = 9.225.",
      ],
      code: {
        starter: `# Materiality flagship: approved LIMIT_BAL + expected loss (EL) [notebook]
# Test 6.000, threshold 0,10, LGD 0,45, EAD = LIMIT_BAL; p_cal = probabilitas terkalibrasi
# Angka agregat kanonis M8 (m8_tiering): total limit, approved limit, EL approved, EL seluruh test
TOTAL_LIMIT = 1007777680
APPROVED_LIMIT = 424180000
EL_APPROVED = 11989453
EL_ALL = 78675378
LGD = 0.45

# Contoh 4 nasabah yang DISETUJUI [ilustrasi]: (p_cal, LIMIT_BAL) — EL per nasabah = p_cal x LGD x LIMIT_BAL
SAMPLE_APPROVED = [(0.02, 100000), (0.05, 200000), (0.08, 50000), (0.03, 150000)]

approved_share = 0.0  # TODO: APPROVED_LIMIT / TOTAL_LIMIT
el_rate_approved = 0.0  # TODO: EL_APPROVED / APPROVED_LIMIT
el_share = 0.0  # TODO: EL_APPROVED / EL_ALL
el_full_book = 0  # TODO: EL_APPROVED * (30000 / 6000) — skala ke buku penuh 30.000
el_sample = 0  # TODO: sum(p_cal * LGD * limit untuk tiap nasabah di SAMPLE_APPROVED)
print(f"approved_share={approved_share:.4f}")
print(f"el_rate_approved={el_rate_approved:.4f}")
print(f"el_share={el_share:.4f}")
print(f"el_full_book={el_full_book:.0f}")
print(f"el_sample={el_sample:.0f}")`,
        lockLines: 12,
        solution: `# Materiality flagship: approved LIMIT_BAL + expected loss (EL) [notebook]
# Test 6.000, threshold 0,10, LGD 0,45, EAD = LIMIT_BAL; p_cal = probabilitas terkalibrasi
# Angka agregat kanonis M8 (m8_tiering): total limit, approved limit, EL approved, EL seluruh test
TOTAL_LIMIT = 1007777680
APPROVED_LIMIT = 424180000
EL_APPROVED = 11989453
EL_ALL = 78675378
LGD = 0.45

# Contoh 4 nasabah yang DISETUJUI [ilustrasi]: (p_cal, LIMIT_BAL) — EL per nasabah = p_cal x LGD x LIMIT_BAL
SAMPLE_APPROVED = [(0.02, 100000), (0.05, 200000), (0.08, 50000), (0.03, 150000)]

approved_share = APPROVED_LIMIT / TOTAL_LIMIT
el_rate_approved = EL_APPROVED / APPROVED_LIMIT
el_share = EL_APPROVED / EL_ALL
el_full_book = EL_APPROVED * (30000 / 6000)
el_sample = sum(p * LGD * lim for p, lim in SAMPLE_APPROVED)
print(f"approved_share={approved_share:.4f}")
print(f"el_rate_approved={el_rate_approved:.4f}")
print(f"el_share={el_share:.4f}")
print(f"el_full_book={el_full_book:.0f}")
print(f"el_sample={el_sample:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "approved_share", value: 0.4209, tol: 0.0005, label: "`approved_share` seharusnya 0.4209", msg: "Approved limit NT$424.180.000 adalah 42,09% dari total limit NT$1.007.777.680 — model menyetujui kurang dari separuh uang yang diajukan." },
          { kind: "equal", task: "t1", name: "el_rate_approved", value: 0.0283, tol: 0.0005, label: "`el_rate_approved` seharusnya 0.0283", msg: "EL approved NT$11.989.453 / approved limit NT$424.180.000 = 0,0283 — dari tiap NT$100 limit yang disetujui, NT$2,83 diharapkan hilang." },
          { kind: "equal", task: "t1", name: "el_share", value: 0.1524, tol: 0.0005, label: "`el_share` seharusnya 0.1524", msg: "EL approved hanya 15,24% dari EL seluruh test (NT$78.675.378) — model menahan 84,76% EL dengan menolak 57,91% limit." },
          { kind: "stdout_matches", task: "t2", pattern: "el_full_book=59947265", label: "Output menampilkan el_full_book=59947265", msg: "Test 6.000 adalah 1/5 dari data 30.000 — EL approved skala buku penuh = 11.989.453 × 5 = NT$59.947.265." },
          { kind: "equal", task: "t3", name: "el_sample", value: 9225, tol: 0.5, label: "`el_sample` seharusnya 9225", msg: "EL empat nasabah [ilustrasi]: 900 + 4.500 + 1.800 + 2.025 = 9.225 — rumus Σ p_cal × LGD × LIMIT_BAL bekerja per baris." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 12 · Lab 2",
      title: "Lab: skor tiering tiga model — flagship, churn, fraud",
      prose: [
        "Lab kedua menerapkan skor tiering [kebijakan lesson ini] pada tiga model mini-case (langkah 10): skor = 0,50×M + 0,30×C + 0,20×B; tier: skor ≥ 2,5 → Tier 1; 1,5 ≤ skor < 2,5 → Tier 2; skor < 1,5 → Tier 3. Flagship (scorecard kredit): M=3 (approved limit NT$424,18 juta [notebook]), C=2 (GBM tunggal), B=3 [ilustrasi]. Churn (marketing) [ilustrasi]: M=1, C=1 (regresi logistik), B=2. Fraud (deteksi fraud) [ilustrasi]: M=3, C=3 (ensemble), B=4.",
        "Hasil yang diharapkan [lab]: score_flagship=2.70; tier_flagship=1; score_churn=1.20; tier_churn=3; score_fraud=3.20; tier_fraud=1. Bacalah ketiganya berdampingan: flagship 2,70 Tier 1 — uang per keputusan besar; fraud 3,20 Tier 1 — skor TERTINGGI, ketiganya tinggi sekaligus; churn 1,20 Tier 3 — dampak keputusan kecil. Perhatikan juga: flagship (2,70) hanya 0,20 di atas ambang Tier 1 (2,5) — bila satu komponen dinilai satu tingkat lebih rendah (misal B=2 bukan 3), skornya 2,50 — TEPAT di ambang. Di dekat ambang, skor adalah sinyal untuk berdiskusi (langkah 7), bukan vonis otomatis.",
        "Setelah lab jalan, coba ubah satu komponen dan lihat apa yang terjadi: bila flagship diganti modelnya menjadi regresi logistik (C=1) tapi limitnya tetap, skor menjadi 2,40 → Tier 2. Apakah itu benar? Menurut kebijakan lesson ini, ya — tapi tanyakan pada dirimu: apakah penurunan kompleksitas satu tingkat SEHARUSNYA menurunkan tier model yang masih memutuskan NT$424,18 juta? Itulah diskusi yang skor tidak bisa gantikan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi score_flagship dan tier_flagship dari (M=3, C=2, B=3)" },
        { id: "t2", text: "Lengkapi score_churn dan tier_churn dari (M=1, C=1, B=2)" },
        { id: "t3", text: "Lengkapi score_fraud dan tier_fraud dari (M=3, C=3, B=4)" },
      ],
      expected: "score_flagship=2.70\ntier_flagship=1\nscore_churn=1.20\ntier_churn=3\nscore_fraud=3.20\ntier_fraud=1",
      hints: [
        "Flagship: 0,50×3 + 0,30×2 + 0,20×3 = 1,50 + 0,60 + 0,60 = 2,70 — di atas ambang 2,5, jadi Tier 1.",
        "Churn [ilustrasi]: 0,50×1 + 0,30×1 + 0,20×2 = 0,50 + 0,30 + 0,40 = 1,20 — di bawah 1,5, jadi Tier 3.",
        "Fraud [ilustrasi]: 0,50×3 + 0,30×3 + 0,20×4 = 1,50 + 0,90 + 0,80 = 3,20 — skor tertinggi, Tier 1.",
      ],
      code: {
        starter: `# Skor tiering [kebijakan lesson ini]: skor = 0,50*M + 0,30*C + 0,20*B
# M = materiality (0-4, dari approved LIMIT_BAL); C = complexity (0-4); B = breadth (0-4)
# Tier: skor >= 2,5 -> Tier 1; skor >= 1,5 -> Tier 2; skor < 1,5 -> Tier 3
W_M, W_C, W_B = 0.50, 0.30, 0.20

def tier_score(m, c, b):
    return W_M * m + W_C * c + W_B * b

def tier_of(score):
    if score >= 2.5:
        return 1
    if score >= 1.5:
        return 2
    return 3

# Tiga model [ilustrasi untuk churn & fraud; flagship dari angka kanonis]:
# flagship (scorecard kredit): M=3 (approved limit NT$424,18jt), C=2 (GBM tunggal), B=3 (6.000 aplikasi/periode)
# churn (marketing): M=1, C=1 (regresi logistik), B=2
# fraud (deteksi fraud): M=3, C=3 (ensemble), B=4
MODELS = {
    "flagship": (3, 2, 3),
    "churn": (1, 1, 2),
    "fraud": (3, 3, 4),
}

score_flagship = 0.0  # TODO: tier_score(*MODELS["flagship"])
tier_flagship = 0  # TODO: tier_of(score_flagship)
score_churn = 0.0  # TODO: tier_score(*MODELS["churn"])
tier_churn = 0  # TODO: tier_of(score_churn)
score_fraud = 0.0  # TODO: tier_score(*MODELS["fraud"])
tier_fraud = 0  # TODO: tier_of(score_fraud)
print(f"score_flagship={score_flagship:.2f}")
print(f"tier_flagship={tier_flagship}")
print(f"score_churn={score_churn:.2f}")
print(f"tier_churn={tier_churn}")
print(f"score_fraud={score_fraud:.2f}")
print(f"tier_fraud={tier_fraud}")`,
        lockLines: 25,
        solution: `# Skor tiering [kebijakan lesson ini]: skor = 0,50*M + 0,30*C + 0,20*B
# M = materiality (0-4, dari approved LIMIT_BAL); C = complexity (0-4); B = breadth (0-4)
# Tier: skor >= 2,5 -> Tier 1; skor >= 1,5 -> Tier 2; skor < 1,5 -> Tier 3
W_M, W_C, W_B = 0.50, 0.30, 0.20

def tier_score(m, c, b):
    return W_M * m + W_C * c + W_B * b

def tier_of(score):
    if score >= 2.5:
        return 1
    if score >= 1.5:
        return 2
    return 3

# Tiga model [ilustrasi untuk churn & fraud; flagship dari angka kanonis]:
# flagship (scorecard kredit): M=3 (approved limit NT$424,18jt), C=2 (GBM tunggal), B=3 (6.000 aplikasi/periode)
# churn (marketing): M=1, C=1 (regresi logistik), B=2
# fraud (deteksi fraud): M=3, C=3 (ensemble), B=4
MODELS = {
    "flagship": (3, 2, 3),
    "churn": (1, 1, 2),
    "fraud": (3, 3, 4),
}

score_flagship = tier_score(*MODELS["flagship"])
tier_flagship = tier_of(score_flagship)
score_churn = tier_score(*MODELS["churn"])
tier_churn = tier_of(score_churn)
score_fraud = tier_score(*MODELS["fraud"])
tier_fraud = tier_of(score_fraud)
print(f"score_flagship={score_flagship:.2f}")
print(f"tier_flagship={tier_flagship}")
print(f"score_churn={score_churn:.2f}")
print(f"tier_churn={tier_churn}")
print(f"score_fraud={score_fraud:.2f}")
print(f"tier_fraud={tier_fraud}")`,
        checks: [
          { kind: "equal", task: "t1", name: "score_flagship", value: 2.7, tol: 0.01, label: "`score_flagship` seharusnya 2.70", msg: "Flagship: 0,50×3 + 0,30×2 + 0,20×3 = 2,70 — materiality (M=3, dari approved limit NT$424,18 juta) menyumbang 1,50 dari 2,70." },
          { kind: "equal", task: "t1", name: "tier_flagship", value: 1, tol: 0.5, label: "`tier_flagship` seharusnya 1", msg: "Skor 2,70 di atas ambang 2,5 — flagship Tier 1: validasi independen penuh, review tahunan, sign-off CRO." },
          { kind: "equal", task: "t2", name: "score_churn", value: 1.2, tol: 0.01, label: "`score_churn` seharusnya 1.20", msg: "Churn [ilustrasi]: 0,50×1 + 0,30×1 + 0,20×2 = 1,20." },
          { kind: "equal", task: "t2", name: "tier_churn", value: 3, tol: 0.5, label: "`tier_churn` seharusnya 3", msg: "Skor 1,20 di bawah 1,5 — churn Tier 3: dampak keputusannya kecil (promo salah sasaran), bukan karena modelnya sederhana." },
          { kind: "equal", task: "t3", name: "score_fraud", value: 3.2, tol: 0.01, label: "`score_fraud` seharusnya 3.20", msg: "Fraud [ilustrasi]: 0,50×3 + 0,30×3 + 0,20×4 = 3,20 — skor tertinggi dari ketiganya." },
          { kind: "equal", task: "t3", name: "tier_fraud", value: 1, tol: 0.5, label: "`tier_fraud` seharusnya 1", msg: "Skor 3,20 di atas 2,5 — fraud Tier 1: exposure, kompleksitas, dan breadth ketiganya tinggi sekaligus." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: inventory dulu, tier dari dampak, skor yang bisa dibela",
      prose: [
        "Rangkuman: inventory adalah daftar lengkap semua model (nama, pemilik, versi, tujuan, data, tier, tanggal validasi terakhir, tanggal review berikutnya, status) — tanpa inventory, model tak terdaftar lolos tanpa pengawasan. Tiering adalah rating risiko: Tier 1 (risiko tertinggi — validasi independen penuh, review tahunan, sign-off CRO), Tier 2 (validasi lebih ringan, review tiap 2 tahun, sign-off Head of Risk), Tier 3 (self-assessment, review tiap 3 tahun, sign-off pemilik) [kebijakan lesson ini]. Tier ditetapkan dari RISIKO INHEREN — kontrol (validasi, monitoring [M7.5], champion-challenger M8.1) menurunkan risiko RESIDUAL, bukan tier. Materiality flagship [notebook]: total limit NT$1.007.777.680; approved limit NT$424.180.000 (42,09%, 1.710 dari 6.000 nasabah, 28,5%); EL approved NT$11.989.453 (Σ p_cal × LGD 0,45 × LIMIT_BAL; EL rate 0,0283; rata-rata NT$7.011 per nasabah yang disetujui); EL seluruh test NT$78.675.378 (EL approved hanya 15,24% — model menahan NT$66.685.925 EL); realised loss approved NT$11.695.500 (EL hanya NT$293.953 di atas realised — 2,51% dari realised loss); margin approved NT$19.909.500; laba bersih approved NT$8.214.000; total cost pada threshold 0,10 NT$33.046.500 [M6.4]. Matriks exposure × kompleksitas: Tier 1 bila jumlah level (kompleksitas + exposure) ≥ 3; Tier 3 bila jumlah level ≤ 1; Tier 2 bila jumlah level = 2 — flagship (M=3, C=2) duduk di sel Tier 1; exposure tinggi + kompleksitas rendah tetap Tier 2. Skor tiering [kebijakan lesson ini]: 0,50×M + 0,30×C + 0,20×B; ≥ 2,5 Tier 1; 1,5–2,5 Tier 2; < 1,5 Tier 3. Flagship 2,70 → Tier 1; churn [ilustrasi] 1,20 → Tier 3; fraud [ilustrasi] 3,20 → Tier 1. Re-tiering: terjadwal tahunan + event-driven (penggunaan baru, exposure melewati band, temuan validasi, drift besar PSI skor di atas 0,25 [kebijakan M7.5], insiden, regulasi) — dan tier turun hanya bila skor tieringnya turun, yaitu bila materiality/kompleksitas/breadth-nya sendiri turun. Jebakan: tiering dari nama/kompleksitas model bukan dampak; tiering sekali lalu dilupakan; semua Tier 1; tiering tanpa inventory; tier disamakan dengan kualitas. Risiko agregat: feature pipeline [M6.2], kalibrasi Platt [M6.4], dan snapshot UCI dipakai bersama — satu bug di pipeline menjatuhkan flagship (NT$424.180.000) + fraud + churn sekaligus; concentration_flag ditegakkan bila ≥2 Tier 1 berbagi satu komponen, aggregate exposure melewati band, atau single point of failure tanpa fallback — komponen bersama diperlakukan sebagai Tier 1-kritis. Model vendor: tetap butuh owner internal + inventory + tier (mengikuti keputusan yang ia beri makan); intake 10 item — owner, version identifier yang dipin, input-output contract, bukti validasi vendor + internal, SLA, incident notification, audit rights, data residency, fallback/exit plan, re-tiering tiap perubahan versi; perubahan vendor tanpa pemberitahuan adalah risiko yang tidak bisa divalidasi. Skala: test 6.000 adalah sampel stratified 1/5 dari data 30.000 — BUKAN buku live; skala ke buku penuh dengan ×(ukuran buku / 6.000): approved limit buku penuh 30.000 = NT$2.120.900.000, EL approved NT$59.947.265. Lab: approved_share=0.4209, el_rate_approved=0.0283, el_share=0.1524, el_full_book=59947265, el_sample=9225; skor tiering flagship 2,70 → Tier 1, churn 1,20 → Tier 3, fraud 3,20 → Tier 1.",
        "Guided task di Colab — notebook mlf-m82-guided-task.ipynb mereplikasi flagship GBM + kalibrasi Platt, menghitung materiality (total/approved LIMIT_BAL + EL dari probabilitas terkalibrasi), membangun inventory tiga model, dan menetapkan tier dari skor — dengan checks. Tautan Colab: https://colab.research.google.com/drive/18iBbofPJ62zrDXOXC6wpaYAj6qtbAXw6",
        "Yang tersisa adalah kebiasaan: sebelum model apa pun live, daftarkan di inventory, hitung skornya, tulis tier-nya — dan biarkan angka yang memutuskan seberapa dalam pengawasannya, bukan firasat.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Apa isi minimum inventory model, dan kenapa inventory yang tidak lengkap sama dengan tidak punya inventory?",
          options: [
            { text: "Nama model saja sudah cukup — sisanya bisa dicari belakangan", why: "Salah: nama saja tidak bisa dipakai untuk memutuskan apa pun. Inventory tanpa pemilik, versi, tujuan, tier, dan tanggal review adalah daftar belanja, bukan alat governance." },
            { text: "Nama, pemilik (satu nama orang), versi, tujuan/keputusan, data input, tier, tanggal validasi terakhir, tanggal review berikutnya, status — tanpa itu, model tak terdaftar lolos tanpa pengawasan", why: "Benar: satu baris per model dengan kolom-kolom ini membuat auditor bisa menjawab «model apa yang memutuskan ini, siapa pemiliknya, kapan terakhir divalidasi, tier berapa?» dalam lima menit. Model yang luput dari daftar adalah model yang tidak diawasi.", correct: true },
            { text: "Hanya model Tier 1 yang perlu dicatat — Tier 2 dan 3 terlalu sepele untuk di-inventory", why: "Salah: inventory mencakup SEMUA model — hidup, shadow, maupun pensiun. Model Tier 3 yang tidak tercatat bisa berubah penggunaannya menjadi keputusan kredit tanpa ada yang tahu (pemicu re-tiering langkah 8)." },
            { text: "Inventory cukup dibuat sekali untuk audit tahunan, lalu disimpan", why: "Salah: inventory yang dibuat sekali lalu dibiarkan membusuk adalah daftar model yang sudah tidak ada ditambah model baru yang belum tercatat — dua-duanya menyesatkan. Inventory harus hidup: diperbarui tiap deployment dan dicocokkan dengan log produksi tiap kuartal." },
          ],
        },
        {
          q: "Apa yang membedakan Tier 1 dari Tier 3 dalam kebijakan lesson ini?",
          options: [
            { text: "Tier 1 adalah model terbaik dan Tier 3 adalah model terjelek", why: "Salah: tier BUKAN nilai kualitas model. Tier berarti «seberapa besar pengawasan yang model ini butuhkan» — model yang sama bisa Tier 1 di satu bank dan Tier 2 di bank lain." },
            { text: "Tidak ada bedanya — semua tier mendapat validasi yang sama supaya adil", why: "Salah: menyamakan pengawasan untuk semua model adalah pemborosan sekaligus kelalaian — validator menghabiskan waktu yang sama untuk model laporan internal dan scorecard kredit. Tiering justru ada untuk MEMPRIORITASKAN." },
            { text: "Kedalaman validasi, frekuensi review, dan level sign-off: Tier 1 validasi independen penuh + review tahunan + sign-off CRO; Tier 3 self-assessment + review 3-tahunan + sign-off pemilik model", why: "Benar: makin tinggi tier, makin dalam validasi, makin sering review, makin tinggi level sign-off. Tier 2 di antaranya: validasi lebih ringan, review tiap 2 tahun, sign-off Head of Risk.", correct: true },
            { text: "Tier 1 memakai GBM dan Tier 3 memakai regresi logistik", why: "Salah: tier tidak ditentukan oleh nama algoritma (jebakan langkah 9). Regresi logistik yang memutuskan limit miliaran adalah Tier 1; GBM untuk laporan internal adalah Tier 3." },
          ],
        },
        {
          q: "Scorecard flagship Tier 1 dipasangi monitoring harian, kalibrasi Platt, dan champion-challenger. Apakah tier-nya turun menjadi Tier 2?",
          options: [
            { text: "Ya — kontrol yang kuat menurunkan risiko, jadi tier boleh turun", why: "Salah: kontrol menurunkan risiko RESIDUAL, bukan tier. Tier mengunci risiko INHEREN — dampak bila model salah tanpa kontrol. Monitoring dipasang KARENA tier-nya tinggi; ia bukan alasan menurunkan tier." },
            { text: "Tidak — tier ditetapkan dari risiko inheren; kontrol menurunkan risiko residual, bukan tier; tier hanya turun bila materiality atau kompleksitasnya sendiri turun", why: "Benar: bila semua kontrol gagal sekaligus, yang dipertaruhkan tetap NT$424.180.000 limit dan NT$11.989.453 EL. Tier turun hanya bila approved limit mengecil ke band yang lebih rendah atau model diganti dengan yang lebih sederhana.", correct: true },
            { text: "Ya, tapi hanya bila monitoring-nya sudah berjalan satu tahun tanpa alert", why: "Salah: «sudah lama tidak bermasalah» bukan pemicu re-tiering turun (langkah 8). Tidak adanya insiden adalah bukti kontrol bekerja, bukan bukti risiko inheren mengecil." },
            { text: "Tidak — tier tidak pernah bisa berubah setelah ditetapkan", why: "Salah: tier BISA berubah (re-tiering, langkah 8) — terjadwal tahunan dan event-driven. Yang tidak boleh adalah mengubah tier karena kontrol; yang boleh adalah mengubahnya karena materiality, kompleksitas, atau penggunaan berubah." },
          ],
        },
        {
          q: "Approved limit NT$424.180.000 dan EL approved NT$11.989.453. Apa arti EL approved, dan dari probabilitas apa ia dihitung?",
          options: [
            { text: "Kerugian yang PASTI terjadi atas nasabah yang disetujui, dihitung dari probabilitas mentah GBM", why: "Salah dua hal: EL adalah HARAPAN (rata-rata atas banyak dunia yang mungkin), bukan kepastian — dan ia dihitung dari probabilitas TERKALIBRASI, bukan mentah, karena probabilitas yang dipakai untuk keputusan uang harus jujur (ECE test 0,0087)." },
            { text: "Kerugian yang diharapkan atas nasabah yang disetujui — Σ p_cal × LGD 0,45 × LIMIT_BAL — dihitung dari probabilitas terkalibrasi; EL rate-nya 2,83% dari approved limit", why: "Benar: EL = Σ p_cal × LGD × LIMIT_BAL atas 1.710 nasabah yang disetujui = NT$11.989.453, atau 0,0283 dari approved limit. Realised loss-nya NT$11.695.500 — EL hanya 2,51% di atas realised di test ini.", correct: true },
            { text: "Total limit yang disetujui dikurangi margin — NT$424.180.000 − NT$19.909.500", why: "Salah: itu bukan EL. EL dihitung per nasabah dari peluang default × LGD × limit, lalu dijumlahkan — bukan dari pengurangan agregat." },
            { text: "Kerugian atas SEMUA 6.000 nasabah test, bukan hanya yang disetujui", why: "Salah: EL atas semua test adalah NT$78.675.378 — jauh lebih besar. EL approved (NT$11.989.453) hanya 15,24% dari jumlah itu; selisihnya (NT$66.685.925) adalah EL yang DITAHAN model dengan menolak 57,91% limit." },
          ],
        },
        {
          q: "Dalam matriks exposure × kompleksitas lesson ini, model dengan exposure TINGGI dan kompleksitas RENDAH jatuh di tier berapa — dan kenapa?",
          options: [
            { text: "Tier 3 — modelnya sederhana, jadi tidak butuh pengawasan", why: "Salah: ini jebakan langkah 9 — menilai nama/kompleksitas model, bukan dampak keputusannya. Model sederhana yang memutuskan uang besar tetap berbahaya bila salah." },
            { text: "Tier 2 — dampak keputusannya besar walau modelnya sederhana; kesalahannya berskala besar", why: "Benar: sel kanan-bawah (exposure tinggi=2, kompleksitas rendah=0) jumlah levelnya 2 → Tier 2. Exposure tinggi berarti dampak besar; kompleksitas rendah hanya berarti modelnya mudah dipahami — bukan berarti keputusannya tidak berdampak.", correct: true },
            { text: "Tier 1 — semua model dengan exposure tinggi otomatis Tier 1", why: "Salah: exposure tinggi + kompleksitas rendah jumlah levelnya 2 → Tier 2, bukan Tier 1 — Tier 1 butuh jumlah level ≥ 3 (exposure tinggi DAN kompleksitas sedang/tinggi, atau kompleksitas tinggi dengan exposure sedang). Matriks adalah saringan kasar; skor langkah 7 yang mengikat." },
            { text: "Tidak bisa ditentukan dari matriks — matriks hanya untuk model kompleks", why: "Salah: matriks justru dibuat untuk KEDUA sumbu — exposure dan kompleksitas. Sel kanan-bawah ada dan terisi: Tier 2, «dampak besar, model sederhana»." },
          ],
        },
        {
          q: "Skor tiering flagship adalah 2,70 (M=3, C=2, B=3; bobot 0,50/0,30/0,20). Bila breadth dinilai B=2 bukan B=3, skor menjadi 2,50 — tepat di ambang Tier 1. Apa yang harus dilakukan?",
          options: [
            { text: "Langsung kunci Tier 1 — 2,50 sudah memenuhi «≥ 2,5»", why: "Salah prosedur: skor tepat di ambang adalah sinyal untuk peninjauan manual (langkah 7), bukan vonis otomatis. Ambang 2,5 adalah kebijakan, bukan konstanta alam — selisih 0,20 dari satu komponen tidak boleh memutuskan sendiri." },
            { text: "Langsung kunci Tier 2 — skor 2,50 terlalu dekat dengan ambang untuk dipercaya", why: "Salah juga: membulatkan ke bawah karena «tidak yakin» sama sewenang-wenangnya dengan membulatkan ke atas. Yang benar adalah peninjauan manusia atas komponen yang diperdebatkan (apakah B memang 2 atau 3?), bukan menebak tier." },
            { text: "Tinjau manual oleh risk manager: periksa apakah B=2 atau B=3 yang benar dari data laju keputusan, lalu kunci tier dari skor yang sudah diperiksa", why: "Benar: aturan lesson ini — skor dalam 0,1 dari ambang → peninjauan manual. Skor adalah alat bantu keputusan, bukan pengganti keputusan; yang diperiksa adalah KOMPONEN-nya (B), bukan hasil akhirnya.", correct: true },
            { text: "Ubah bobot breadth dari 0,20 menjadi 0,10 supaya skor menjauh dari ambang", why: "Salah: mengubah bobot untuk menghindari ambang adalah memanipulasi kebijakan demi hasil yang diinginkan. Bobot ditulis dulu dan diubah hanya lewat revisi kebijakan yang tercatat — bukan per model." },
          ],
        },
        {
          q: "Manakah yang BUKAN pemicu re-tiering event-driven menurut lesson ini?",
          options: [
            { text: "Model Tier 3 yang tiba-tiba dipakai untuk keputusan kredit (penggunaan baru)", why: "Salah: penggunaan baru ADALAH pemicu re-tiering — dan yang paling sering terlewat, karena yang berubah bukan modelnya melainkan cara model itu dipakai." },
            { text: "Approved limit melewati band materiality sehingga M naik satu tingkat", why: "Salah: exposure melewati band ADALAH pemicu — misal approved limit melewati NT$600 juta, M menjadi 4 dan skor naik." },
            { text: "PSI skor di atas 0,25 yang bertahan, atau temuan validasi material", why: "Salah: drift besar [M7.5] dan temuan validasi ADALAH pemicu — keduanya menandakan model berperilaku di luar yang divalidasi." },
            { text: "Model sudah tiga tahun tidak bermasalah dan tidak ada alert monitoring", why: "Benar: «sudah lama aman» BUKAN pemicu re-tiering turun — tier turun hanya bila skor tieringnya turun, yaitu bila materiality, kompleksitas, atau breadth-nya sendiri turun. Tidak adanya insiden adalah bukti kontrol bekerja, bukan bukti risiko inheren mengecil.", correct: true },
          ],
        },
        {
          q: "Model churn marketing [ilustrasi] mendapat skor 1,20 (M=1, C=1, B=2) → Tier 3. Mengapa ia Tier 3?",
          options: [
            { text: "Karena ia memakai regresi logistik — model sederhana selalu Tier 3", why: "Salah: ini jebakan langkah 9. Regresi logistik yang memutuskan limit miliaran adalah Tier 1. Tier churn adalah Tier 3 karena DAMPAK keputusannya kecil, bukan karena algoritmanya sederhana." },
            { text: "Karena dampak keputusannya kecil — keputusan terburuknya adalah promo yang salah sasaran, bukan kredit macet; skor 1,20 di bawah ambang 1,5", why: "Benar: M=1 (exposure kecil), C=1, B=2 → 0,50 + 0,30 + 0,40 = 1,20 < 1,5 → Tier 3. Self-assessment + review 3-tahunan sudah memadai untuk dampak sebesar itu.", correct: true },
            { text: "Karena breadth-nya hanya B=2 — model yang jarang dipakai tidak butuh pengawasan", why: "Salah sebagian: B=2 hanya menyumbang 0,40 dari 1,20. Yang menentukan adalah KOMBINASI ketiganya — dan yang terbesar adalah M=1: exposure kecil. Model yang jarang dipakai tapi memutuskan uang besar tetap Tier 1." },
            { text: "Karena model churn tidak ada di inventory — model yang tidak terdaftar otomatis Tier 3", why: "Salah: model yang tidak ada di inventory tidak punya tier SAMA SEKALI — ia shadow model (langkah 2). Tier 3 adalah rating untuk model yang TERDAFTAR dengan dampak kecil, bukan label untuk model yang luput." },
          ],
        },
        {
          q: "Feature pipeline dipakai bersama oleh flagship (Tier 1), fraud (Tier 1), dan churn (Tier 3). Pipeline itu rusak diam-diam selama seminggu. Apa implikasi governance-nya?",
          options: [
            { text: "Tidak ada implikasi — pipeline bukan model, jadi tidak masuk inventory dan tidak perlu diawasi", why: "Salah: shared dependency MASUK inventory sebagai kolom — «bergantung pada» dan «dipakai oleh». Pipeline yang bukan model pun bisa menjadi single point of failure bagi tiga model sekaligus." },
            { text: "Turunkan tier flagship menjadi Tier 2 — pipeline-nya sudah diperbaiki, jadi risikonya sudah mengecil", why: "Salah: perbaikan bukan pemicu turun tier (langkah 8) — tier ditetapkan dari risiko inheren, dan kontrol menurunkan risiko residual, bukan tier. Yang naik adalah pengawasan komponennya, bukan turun tier modelnya." },
            { text: "Ini shared failure mode: tiga model gagal bersamaan dari satu penyebab; pipeline diperlakukan sebagai komponen Tier 1-kritis (setinggi dependen tertingginya), dan aggregate exposure-nya dicatat sebagai konsentrasi — bukan hanya risiko per model", why: "Benar: dua dependennya Tier 1, jadi komponen bersama itu sendiri Tier 1-kritis — dengan review yang sama dalamnya. Aggregate exposure-nya (flagship NT$424.180.000 + alert fraud [ilustrasi] + promo [ilustrasi]) dicatat di inventory, dan munculnya shared dependency baru adalah pemicu re-tiering.", correct: true },
            { text: "Cukup catat sebagai insiden churn — dampaknya kecil karena churn hanya Tier 3", why: "Salah: insidennya BUKAN insiden churn — pipeline yang sama memberi makan flagship dan fraud, keduanya Tier 1. Menilai insiden dari model yang paling kecil dampaknya adalah cara yang sama sekali salah membaca risiko agregat." },
          ],
        },
      ],
      summary: [
        "Inventory adalah daftar lengkap semua model (nama, pemilik, versi, tujuan, data, tier, tanggal validasi terakhir, tanggal review berikutnya, status) — tanpa inventory, model tak terdaftar lolos tanpa pengawasan.",
        "Tiering adalah rating risiko: Tier 1 validasi independen penuh + review tahunan + sign-off CRO; Tier 2 validasi lebih ringan + review tiap 2 tahun + sign-off Head of Risk; Tier 3 self-assessment + review 3-tahunan + sign-off pemilik [kebijakan lesson ini].",
        "Tier ditetapkan dari RISIKO INHEREN — kontrol (validasi, monitoring [M7.5], champion-challenger M8.1) menurunkan risiko RESIDUAL, bukan tier; tier turun hanya bila skor tieringnya turun, yaitu bila materiality/kompleksitas/breadth-nya sendiri turun.",
        "Materiality flagship [notebook]: total limit NT$1.007.777.680; approved limit NT$424.180.000 (42,09%, 1.710 dari 6.000 nasabah, 28,5%); EL approved NT$11.989.453 (Σ p_cal × LGD 0,45 × LIMIT_BAL; EL rate 0,0283); EL seluruh test NT$78.675.378; realised loss approved NT$11.695.500; laba bersih approved NT$8.214.000; total cost pada threshold 0,10 NT$33.046.500 [M6.4].",
        "Matriks exposure × kompleksitas: Tier 1 bila jumlah level (kompleksitas + exposure) ≥ 3; Tier 3 bila jumlah level ≤ 1; Tier 2 bila jumlah level = 2 — flagship (M=3, C=2) di sel Tier 1; exposure tinggi + kompleksitas rendah tetap Tier 2.",
        "Skor tiering [kebijakan lesson ini]: 0,50×M + 0,30×C + 0,20×B; ≥ 2,5 Tier 1; 1,5–2,5 Tier 2; < 1,5 Tier 3. Flagship 2,70 → Tier 1; churn [ilustrasi] 1,20 → Tier 3; fraud [ilustrasi] 3,20 → Tier 1. Skor dalam 0,1 dari ambang → peninjauan manual.",
        "Re-tiering: terjadwal tahunan + event-driven (penggunaan baru, exposure melewati band, temuan validasi, drift besar PSI skor di atas 0,25 [kebijakan M7.5], insiden, regulasi). «Sudah lama aman» bukan pemicu turun.",
        "Jebakan: tiering dari nama/kompleksitas bukan dampak; tiering sekali lalu dilupakan; semua Tier 1; tiering tanpa inventory; tier disamakan dengan kualitas.",
        "Risiko agregat: shared dependency (feature pipeline [M6.2], kalibrasi Platt [M6.4], snapshot UCI) + downstream models + aggregate exposure + concentration_flag — satu bug di pipeline menjatuhkan flagship (NT$424.180.000) + fraud + churn sekaligus; concentration_flag ditegakkan bila ≥2 Tier 1 berbagi satu komponen, aggregate melewati band, atau single point of failure tanpa fallback; komponen bersama = Tier 1-kritis.",
        "Model vendor: tetap butuh owner internal + inventory + tier (mengikuti keputusan yang ia beri makan); intake 10 item (owner, version identifier yang dipin, input-output contract, bukti validasi vendor + internal, SLA, incident notification, audit rights, data residency, fallback/exit plan, re-tiering tiap perubahan versi); perubahan vendor tanpa pemberitahuan = risiko yang tidak bisa divalidasi.",
        "Skala: test 6.000 adalah sampel stratified 1/5 dari data 30.000 — BUKAN buku live; skala ke buku penuh dengan ×(ukuran buku / 6.000): approved limit buku penuh 30.000 = NT$2.120.900.000, EL approved NT$59.947.265.",
        "Lab: approved_share=0.4209, el_rate_approved=0.0283, el_share=0.1524, el_full_book=59947265, el_sample=9225; skor tiering flagship 2,70 → Tier 1, churn 1,20 → Tier 3, fraud 3,20 → Tier 1.",
      ],
      next: {
        label: "Lanjut: MLF-M8.3 — Model Card & Documentation",
        href: "/v2/learn/mlf-m83-model-card-documentation",
      },
    },
  ],
};

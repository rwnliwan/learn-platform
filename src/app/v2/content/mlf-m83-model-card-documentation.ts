import type { V2Lesson } from "../lib/types";

export const mlfM83: V2Lesson = {
  slug: "mlf-m83-model-card-documentation",
  track: "Machine Learning Finance",
  module: "Model risk & deployment",
  title: "MLF-M8.3 — Model Card & Documentation: Buktikan Modelmu, Bukan Sekadar Klaim",
  estMinutes: 90,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Auditor datang dua tahun kemudian — dan tidak ada yang bisa dibuktikan",
      prose: [
        "Bayangkan ini: dua tahun lalu, timmu meluncurkan model kredit. Di laporan lama tertulis: ROC-AUC GBM mentah 0,7823, model keputusan terkalibrasi 0,7816, threshold 0,10 menyetujui 28,5% nasabah dengan bad rate 6,67% dan profit +NT$8.214.000 [M6.4]. Model itu masih live. Lalu auditor datang dan bertanya empat hal sederhana: model versi berapa yang sedang berjalan? Data snapshot yang mana yang dipakai melatihnya? Threshold 0,10 itu diputuskan siapa, kapan, dan dari perhitungan apa? Dan bila model ini dicabut hari ini, versi apa yang menggantikannya?",
        "Tidak ada yang bisa menjawab. Notebook-nya sudah ditimpa tiga kali sejak itu. Datanya sudah bertambah baris baru dan dua kolom diganti definisinya. Threshold 0,10 «katanya dari analisis biaya» — tapi file analisisnya tidak ketemu. Angka 0,7823 masih ada di slide — tapi tidak ada yang bisa membuktikan angka itu berasal dari model, data, dan kode yang mana. Modelnya bekerja; buktinya tidak ada. Dan di mata auditor, model yang tidak bisa dibuktikan sama dengan model yang tidak bisa dipercaya.",
        "Itulah masalah yang dipecahkan lesson ini: model card dan dokumentasi. Bukan brosur marketing tentang «model kami akurat» — melainkan satu artefak yang menjawab, untuk SETIAP versi model yang pernah live: apa modelnya, data apa yang melatihnya, seberapa bagus ia diukur, apa batasannya, siapa yang menyetujuinya, dan bagaimana cara mengembalikannya bila gagal. Lesson ini memakai model flagship kita sendiri sebagai contoh: semua angka model card-nya sudah dihitung dari data (kanonis M8), dan kolom yang bukan hasil hitung dilabeli [ilustrasi] — bukan dikarang seolah angka nyata.",
        "Peta lesson: cerita auditor → isi model card (10 kolom template G10 [M7.4] + 7 kolom penggunaan) → reproducibility: definisi dan cara mengujinya → seed sensitivity: angka kanonis lintas seed 42–46 → data snapshot dan skema fitur → versioning dan rollback → limitations: apa yang TIDAK bisa model lakukan → audit trail: jejak keputusan → lifecycle linkage: ID konsisten lintas artefak → jebakan dokumentasi sesudah deploy → mini-case: model card flagship yang terisi → 3 lab → checkpoint.",
        "Nilai: model card adalah selisih antara «kami mengklaim model ini bagus» dan «inilah buktinya, periksa sendiri». Klaim tanpa bukti bergantung pada ingatan orang yang sudah pindah tim; bukti tertulis bergantung pada artefak yang bisa dibuka siapa pun, kapan pun.",
        "Baik atau buruk: ROC-AUC 0,7823 di laporan itu bagus sebagai angka — tapi buruk sebagai BUKTI bila tidak ada yang bisa merekonstruksinya. Angka tanpa data snapshot, tanpa versi kode, dan tanpa penyetuju adalah angka yang tidak bisa diaudit — dan angka yang tidak bisa diaudit, saat ditanya auditor, bernilai nol.",
        "Mitigasi: tulis model card SEBELUM model live, isi angkanya dari run yang sama yang menghasilkan model itu, dan kunci bersama kodenya. Lesson ini menunjukkan caranya — lab 2 membangun kartu itu sebagai JSON yang divalidasi mesin, bukan diketik tangan di slide.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: model card adalah brosur «model kami akurat»",
        type: "pitfall",
        body: "Yang benar: model card adalah CATATAN BUKTI — ia memuat angka yang bagus (ROC-AUC GBM mentah 0,7823) DAN angka yang tidak bagus (AIR SEX GBM terkalibrasi 0,8694 [M7.1], gap train-test 0,0646), batasan, dan risiko yang diterima. Kartu yang hanya memuat kabar baik adalah brosur — dan auditor membaca brosur sebagai tanda ada yang disembunyikan.",
      },
    },
    {
      id: "model-card-isi",
      eyebrow: "Langkah 2 · Isi model card",
      title: "Sepuluh kolom G10: apa yang wajib ada di setiap kartu",
      prose: [
        "Template tata kelola satu halaman dari M7.4 (G10) punya SEPULUH kolom wajib — dan lesson ini memakainya sebagai kerangka model card, karena sepuluh kolom itu persis menjawab empat pertanyaan auditor di langkah 1. (1) Model version: model apa, algoritma apa, seed berapa — contoh: GBM terkalibrasi Platt/sigmoid, seed 42, 31 fitur flagship v1 [notebook]. (2) Feature schema version: daftar fitur dan definisinya — 31 fitur (23 mentah + 8 turunan) [notebook] — bila satu fitur berubah definisinya, versinya naik. (3) Calibration version: metode kalibrasi dan parameternya — Platt/sigmoid, CalibratedClassifierCV cv=3 [notebook]. (4) Threshold policy version: kebijakan threshold dan versinya — v1 threshold tunggal 0,10 [M6.4]. (5) Data snapshot: data apa, berapa baris, split bagaimana — UCI Default of Credit Card Clients, 30.000 baris, split stratified seed 42 (train 24.000, test 6.000). (6) Code/notebook hash: hash commit atau hash notebook yang menghitung angka-angka itu — bukan «notebook terbaru». (7) Approval date: tanggal komite menyetujui versi ini. (8) Owner: nama penanggung jawab versi ini. (9) Rollback version: versi yang berlaku bila versi ini dicabut. (10) Alasan perubahan: mengapa versi ini dibuat — metrik apa yang memicunya, dan harga apa yang diterima.",
        "Di samping sepuluh kolom itu, kartu yang lengkap memuat LIMA isi yang wajib: TUJUAN — untuk keputusan apa model ini dipakai (di sini: menyetujui atau menolak pengajuan kartu kredit, threshold 0,10); DATA — snapshot, ukuran, base rate (0,2212), dan skema fitur; METRIK — paket lengkap, bukan satu angka: ROC-AUC mentah 0,7823 dan terkalibrasi 0,7816, PR-AUC 0,5597 dan 0,5558, ECE 0,0087 [M6.4], Brier 0,1345, approval 28,5%, bad rate 6,67%, profit +NT$8.214.000 [M6.4], plus seed sensitivity (langkah 4) dan fairness (langkah 7); BATASAN — apa yang tidak bisa model lakukan (langkah 7); PEMILIK — siapa yang bertanggung jawab bila kartu ini ditanya (kolom 8).",
        "Sepuluh kolom G10 menjawab «APA modelnya, BAGAIMANA mereproduksi dan mengembalikannya, SIAPA & KAPAN, MENGAPA» — tapi tidak menjawab pertanyaan kelima auditor: «model ini BOLEH dipakai untuk apa — dan untuk apa TIDAK?» Tujuh kolom penggunaan melengkapi template itu, sehingga kartu yang lengkap punya 17 kolom wajib. (11) intended_users: siapa yang memakai model ini — analis kredit + komite risiko [ilustrasi] — BUKAN nasabah langsung, dan bukan tim pemasaran. (12) decision_context: keputusan apa yang diambil — persetujuan pengajuan kartu kredit baru, threshold v1 0,10 [M6.4]. (13) affected_population: siapa yang terkena keputusan itu — nasabah pengaju kartu kredit baru, populasi UCI Taiwan 2005 — BUKAN nasabah eksisting yang meminta kenaikan limit. (14) approved_use: penggunaan yang disetujui — menyetujui/menolak pengajuan kartu kredit baru pada threshold v1 0,10. (15) prohibited_use: penggunaan yang DILARANG — menentukan limit kredit; menaikkan limit eksisting; memakai di luar populasi pengaju baru; memakai untuk penawaran produk lain. (16) human_review_required: kapan manusia wajib turun tangan — ya, untuk banding nasabah yang ditolak dan kasus skor di dekat threshold [kebijakan lesson ini]. (17) out_of_scope_trigger: pemicu yang membuat kartu ini TIDAK BERLAKU — populasi bergeser dari UCI, atau model dipakai untuk produk lain — yang terjadi: revalidasi + kartu baru, bukan «tetap dipakai sambil menunggu».",
        "Nilai: tujuh kolom ini bagus karena mereka mengubah «model yang benar» menjadi «model yang dipakai dengan benar»: model yang sama bisa benar untuk pengajuan baru dan salah untuk kenaikan limit — bukan karena angkanya berubah, melainkan karena keputusannya berubah. Kartu tanpa prohibited_use adalah kartu yang mengizinkan segalanya — dan «mengizinkan segalanya» bukan kelalaian kecil: ia adalah izin tertulis untuk memakai model di luar yang divalidasi. Karena itu lab 2 lesson ini punya ATURAN KERAS: kartu dengan prohibited_use kosong GAGAL validasi, walau 16 kolom lain lengkap — kelengkapan tanpa batas penggunaan adalah kartu yang belum selesai ditulis.",
        "Baik atau buruk: kolom penggunaan bagus bila ditulis dengan NAMA yang spesifik — «nasabah pengaju kartu kredit baru» — bukan «pengguna». Buruk bila ditulis sebagai formalitas («prohibited_use: tidak ada») — klaim «tidak ada yang dilarang» untuk model kredit adalah kartu yang tidak dipikirkan: selalu ada penggunaan yang dilarang, minimal «memakai di luar populasi yang divalidasi». Dan buruk bila human_review_required dijawab «tidak» tanpa syarat — keputusan yang sepenuhnya otomatis atas nasabah yang ditolak adalah keputusan yang tidak punya jalan banding.",
        "Mitigasi: sebelum deploy, baca kolom (15) dengan suara keras di depan komite: «model ini DILARANG dipakai untuk …». Bila daftar itu kosong, kartu belum siap. Dan di M8.4, gerbang deploy memeriksa kolom ini — model yang kartunya tidak menulis larangan tidak lolos gerbang."
,
        "Nilai: sepuluh kolom G10 bagus karena ia mengubah «keputusan» menjadi «artefak» — sesuatu yang bisa dicari, dibandingkan antar versi, dan dibuka saat audit [M7.4]. Tanpa kolom (5) data snapshot dan (6) code hash, angka AIR 0,9999 di M7.4 tidak bisa direproduksi: tidak ada yang bisa membuktikan data dan kode mana yang menghasilkannya. Sembilan dari sepuluh kolom bukan «hampir lengkap» — untuk reproduksi, satu kolom yang hilang bisa berarti seluruh paket tidak bisa diverifikasi.",
        "Baik atau buruk: template ini bagus karena ia MEMAKSA kelengkapan — kartu yang kehilangan satu kolom langsung terlihat kosong, tidak bisa disembunyikan di balik kalimat. Buruk bila diisi sebagai formalitas: kolom «alasan perubahan» yang berisi «perbaikan model» tanpa metrik pemicu dan tanpa harga yang diterima adalah kolom yang kosong dengan kata-kata di dalamnya. Dan buruk bila rollback version kosong: perubahan tanpa versi pengembali adalah perubahan yang tidak bisa dibatalkan — bila v2 gagal, tim akan mengarang penggantinya di tengah krisis [M7.4].",
        "Mitigasi: jadikan kartu ini CHECKLIST GERBANG deploy (M8.4): tidak ada kartu lengkap = tidak ada deploy. Lab 2 lesson ini memvalidasi kelengkapan itu dengan mesin — daftar kolom wajib diperiksa satu per satu, bukan dibaca mata.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Anatomi model card: sepuluh kolom wajib template G10 — model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, alasan perubahan">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Anatomi model card — 10 kolom wajib G10 [M7.4]</text>
<rect x="14" y="34" width="220" height="28" fill="var(--c1)"/>
<text x="24" y="52" font-size="11" fill="var(--text)" font-family="var(--font-ui)">1 · model version</text>
<rect x="246" y="34" width="220" height="28" fill="var(--c4)"/>
<text x="256" y="52" font-size="11" fill="var(--text)" font-family="var(--font-ui)">6 · code / notebook hash</text>
<rect x="14" y="68" width="220" height="28" fill="var(--c1)"/>
<text x="24" y="86" font-size="11" fill="var(--text)" font-family="var(--font-ui)">2 · feature schema version</text>
<rect x="246" y="68" width="220" height="28" fill="var(--c4)"/>
<text x="256" y="86" font-size="11" fill="var(--text)" font-family="var(--font-ui)">7 · approval date</text>
<rect x="14" y="102" width="220" height="28" fill="var(--c1)"/>
<text x="24" y="120" font-size="11" fill="var(--text)" font-family="var(--font-ui)">3 · calibration version</text>
<rect x="246" y="102" width="220" height="28" fill="var(--c4)"/>
<text x="256" y="120" font-size="11" fill="var(--text)" font-family="var(--font-ui)">8 · owner</text>
<rect x="14" y="136" width="220" height="28" fill="var(--c1)"/>
<text x="24" y="154" font-size="11" fill="var(--text)" font-family="var(--font-ui)">4 · threshold policy version</text>
<rect x="246" y="136" width="220" height="28" fill="var(--c4)"/>
<text x="256" y="154" font-size="11" fill="var(--text)" font-family="var(--font-ui)">9 · rollback version</text>
<rect x="14" y="170" width="220" height="28" fill="var(--c1)"/>
<text x="24" y="188" font-size="11" fill="var(--text)" font-family="var(--font-ui)">5 · data snapshot</text>
<rect x="246" y="170" width="220" height="28" fill="var(--c4)"/>
<text x="256" y="188" font-size="11" fill="var(--text)" font-family="var(--font-ui)">10 · alasan perubahan</text>
<text x="240" y="216" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Satu kolom hilang = paket tidak bisa diverifikasi.</text>
<text x="240" y="232" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Kolom 1–5: APA modelnya · kolom 6 & 9: BAGAIMANA mereproduksi/mengembalikan · kolom 7–8: SIAPA & KAPAN · kolom 10: MENGAPA.</text>
</svg>`,
        alt: "Anatomi model card: sepuluh kolom wajib template G10 — model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, alasan perubahan.",
        caption: "Cara membaca: kolom 1–5 menjawab «APA modelnya» (model, fitur, kalibrasi, threshold, data); kolom 6 & 9 menjawab «BAGAIMANA mereproduksi dan mengembalikannya» (kode/hash, rollback); kolom 7–8 menjawab «SIAPA & KAPAN» (tanggal persetujuan, pemilik); kolom 10 menjawab «MENGAPA» (alasan perubahan). Satu kolom hilang berarti paket tidak bisa diverifikasi — bukan «hampir lengkap».",
      },
      tasks: [],
    },
    {
      id: "reproducibility",
      eyebrow: "Langkah 3 · Reproducibility",
      title: "Reproducibility: orang lain + data sama + kode sama = angka sama",
      prose: [
        "Reproducibility punya definisi yang bisa diuji, bukan sekadar slogan: ORANG LAIN, dengan DATA YANG SAMA dan KODE YANG SAMA, mendapatkan ANGKA YANG SAMA. Bukan «angka yang mirip» — angka yang sama, dalam toleransi yang ditulis dulu. Lesson ini memakai toleransi 0,001 untuk ROC-AUC: replikasi flagship GBM mentah harus menghasilkan 0,7823 ± 0,001, dan GBM terkalibrasi 0,7816 ± 0,001. Toleransi ini diasumsikan seed 42 terkunci — bila seed-nya berbeda, ayunan antar-seed (sd 0,0028, langkah 4) sudah bisa melampaui toleransi ini, jadi replikasi WAJIB memakai seed 42. Bila replikasi menghasilkan 0,7900, ada yang berbeda — seed, versi library, urutan fitur, atau data — dan tugasmu adalah menemukan apa yang berbeda itu, bukan membulatkan hasilnya supaya cocok.",
        "Tiga bahan yang membuat angka bisa direproduksi. Satu — SEED yang ditulis: split seed 42, GBM random_state 42. Seed yang tidak ditulis adalah angka yang tidak bisa direproduksi (langkah 4 mengukur seberapa besar taruhannya). Dua — VERSI yang ditulis: library dan versinya (di kanonis M8: scikit-learn 1.9.1, numpy 1.26.4, pandas 2.1.4, scipy 1.11.4) — karena versi library yang berbeda bisa mengubah hasil latih meski kode dan datanya sama. Tiga — DATA SNAPSHOT yang ditulis (langkah 5): data yang sama berarti baris dan definisi kolom yang sama, bukan «file dengan nama yang sama» yang isinya sudah berubah.",
        "Nilai: rumus ujinya ditulis eksplisit di bawah — selisih absolut antara ROC-AUC replikasi dan ROC-AUC yang dilaporkan harus di bawah 0,001. Uji ini murah (jalankan ulang notebook, bandingkan dua angka) dan ia menangkap seluruh kelas kesalahan diam-diam: seed yang tertukar, fitur yang definisinya berubah, library yang naik versi tanpa dicatat. Notebook guided task lesson ini menjalankan uji itu di check 2: GBM mentah 0,7823, PR-AUC 0,5597, terkalibrasi 0,7816 / 0,5558 — semuanya cocok dengan kanonis dalam 0,001.",
        "Baik atau buruk: definisi ini bagus karena ia mengubah «bisa direproduksi» dari klaim menjadi UJI — ada angka, ada ambang, ada lolos/gagal. Buruk bila dibaca sebagai «reproducible berarti benar»: model yang salah secara konseptual bisa direproduksi dengan sempurna — reproducibility membuktikan ANGKAnya bisa diulang, bukan KEPUTUSANnya benar. Model yang memakai fitur bocor (leakage) tetap reproducible; ia tetap salah. Dan buruk bila toleransinya tidak ditulis: «kurang-lebih sama» bukan ambang — 0,001 adalah ambang, «kurang-lebih» adalah negosiasi.",
        "Mitigasi: simpan uji replikasi ini sebagai CHECK OTOMATIS di notebook (assert, bukan eyeballing): setiap kali kartu ditulis, notebook menegaskan angka-angkanya cocok dengan kanonis dalam 0,001 — dan gagal keras bila tidak. Itulah yang dilakukan notebook lesson ini, dan itulah yang dilakukan lab 1–2: angka diketik dari kanonis, lalu dieksekusi dan diperiksa mesin.",
      ],
      formula: String.raw`|\,\mathrm{ROC\text{-}AUC}_{\text{replikasi}} - \mathrm{ROC\text{-}AUC}_{\text{dilaporkan}}\,| \le 0{,}001, \qquad \text{contoh: } |0{,}7823 - 0{,}7823| = 0 \le 0{,}001`,
      formulaNote: "Uji reproducibility lesson ini: replikasi flagship (GBM mentah, split seed 42) harus menghasilkan ROC-AUC 0,7823 ± 0,001. Toleransi 0,001 adalah keputusan kebijakan lesson ini — ditulis dulu, bukan dinegosiasikan sesudah melihat hasil — dan diasumsikan seed 42 terkunci.",
      tasks: [],
      note: {
        title: "Miskonsepsi: reproducible = akurat = benar",
        type: "pitfall",
        body: "Yang benar: reproducibility hanya membuktikan ANGKAnya bisa diulang oleh orang lain — bukan modelnya akurat (itu dibuktikan metrik test: ROC-AUC 0,7823) dan bukan keputusannya benar (itu dibuktikan analisis biaya [M6.4], audit fairness [M7.1], dan monitoring [M7.5]). Tiga klaim yang berbeda, tiga bukti yang berbeda — jangan biarkan satu bukti mengklaim ketiganya.",
      },
    },
    {
      id: "seed-sensitivity",
      eyebrow: "Langkah 4 · Seed sensitivity",
      title: "Seed sensitivity: «0,7823» itu pengukuran, bukan lotre",
      prose: [
        "Split TETAP seed 42 — hanya random_state GBM yang berubah, 42 sampai 46 [kanonis M8]. ROC-AUC GBM mentah per seed: 42 → 0,7823; 43 → 0,7807; 44 → 0,7782; 45 → 0,7754; 46 → 0,7770. Rentang 0,7754–0,7823; spread (maks − min) 0,0069; rata-rata 0,7787; simpangan baku (ddof=1) 0,0028. Model terkalibrasi lebih stabil lagi: 42 → 0,7816; 43 → 0,7810; 44 → 0,7826; 45 → 0,7796; 46 → 0,7796 — rentang 0,7796–0,7826, spread 0,0030. Approval rate (terkalibrasi, threshold 0,10): 28,50% / 28,93% / 28,30% / 28,85% / 28,67% — spread 0,63 poin persen.",
        "Bacalah angka-angka itu dengan benar. Spread 0,0069 berarti: bila kamu melatih ulang model yang sama dengan 5 seed yang diuji (42–46), ROC-AUC-nya bergerak dalam pita selebar 0,0069 — pita ini adalah rentang lima seed yang diuji, bukan batas populasi seed yang mungkin. Simpangan baku 0,0028 berarti: satu seed yang «beruntung» atau «sial» menggeser angka sekitar ±0,003. Jadi «0,7823» — angka seed 42 — adalah SATU pengukuran di dalam pita itu, bukan nilai sejati model. Ia pengukuran yang JUJUR bila pita itu ditulis di sampingnya («0,7823, spread lintas seed 0,0069»); ia menyesatkan bila ditulis sendirian seolah presisi empat desimal berarti kepastian empat desimal.",
        "Nilai: bandingkan pita seed ini dengan ambang yang sudah kamu kenal. Ambang alert monitoring [kebijakan M7.5] untuk penurunan ROC-AUC adalah 0,02 — spread seed 0,0069 hanya sekitar sepertiga dari ambang itu. Artinya: ayunan karena seed saja TIDAK PERNAH menyalakan alert monitoring — bila alert menyala, penyebabnya bukan seed. Dan bandingkan dengan ayunan antar-periode [M7.5]: ROC-AUC chunk waktu semu berayun 0,0710 — rentang (maks−min) antar-chunk [m75_pseudo_time_roc_spread], BUKAN drop vs full-test (drop itu 0,0388: 0,7816 − 0,7428); 0,0710/0,0069 ≈ 10,3× spread seed — sepuluh kali lipat. Seed noise adalah sumber noise yang PALING KECIL di antara yang lesson ini ukur — dan justru karena itu ia mudah dilupakan: orang menulis 0,7823 seolah angka itu eksak, sementara noise yang sepuluh kali lebih besar (periode) tidak ditulis sama sekali.",
        "Baik atau buruk: analisis seed sensitivity ini bagus karena ia memberi ANGKA pada keraguan yang biasanya hanya firasat — «apakah 0,7823 ini kebetulan seed?» kini terjawab: tidak, pitanya hanya 0,0069. Buruk bila dibaca sebagai «jadi seed tidak penting»: seed tidak penting DI SINI karena spread-nya kecil — pada model lain, dengan data lain, spread seed bisa 0,05, dan di sana angka seed tunggal adalah lotre. Buruk juga bila seed sensitivity disamakan dengan validasi: mengganti seed TIDAK mengganti data — validasi belah dua A/B (kanonis M8) menunjukkan ayunan yang lebih besar (ROC-AUC terkalibrasi 0,7885 vs 0,7746, selisih 0,0139) karena datanya yang berbeda, bukan seed-nya. Seed sensitivity mengukur kestabilan LATIH; validasi belah dua mengukur kestabilan DATA.",
        "Mitigasi: tulis SELALU tiga angka di model card, bukan satu: nilai yang dilaporkan (seed 42: 0,7823), spread lintas seed (0,0069), dan simpangan baku (0,0028). Dan tetapkan aturan tim: bila spread lintas 5 seed melewati 0,02 — ambang alert [kebijakan M7.5] yang sama dengan monitoring — angka seed tunggal TIDAK BOLEH dilaporkan sendirian; laporkan rata-rata dan pitanya, atau cari tahu mengapa modelmu begitu goyah.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="ROC-AUC GBM mentah per seed: seed 42 0,7823; seed 43 0,7807; seed 44 0,7782; seed 45 0,7754; seed 46 0,7770; garis putus-putus mean 0,7787">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">ROC-AUC GBM mentah per seed — split tetap seed 42</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="96.3" x2="466" y2="96.3" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,79</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,78</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,77</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,76</text>
<rect x="66" y="75.1" width="44" height="130.9" fill="var(--c1)"/>
<text x="88" y="70.1" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7823</text>
<text x="88" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">seed 42</text>
<rect x="132" y="84.6" width="44" height="121.4" fill="var(--c1)"/>
<text x="154" y="79.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7807</text>
<text x="154" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">seed 43</text>
<rect x="198" y="99.2" width="44" height="106.8" fill="var(--c1)"/>
<text x="220" y="94.2" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7782</text>
<text x="220" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">seed 44</text>
<rect x="264" y="115.7" width="44" height="90.3" fill="var(--c1)"/>
<text x="286" y="110.7" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7754</text>
<text x="286" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">seed 45</text>
<rect x="330" y="106.3" width="44" height="99.7" fill="var(--c1)"/>
<text x="352" y="101.3" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7770</text>
<text x="352" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">seed 46</text>
<text x="410" y="92" font-size="10" fill="var(--text)" font-family="var(--font-ui)">mean 0,7787</text>
<text x="410" y="106" font-size="10" fill="var(--text)" font-family="var(--font-ui)">spread 0,0069</text>
</svg>`,
        alt: "ROC-AUC GBM mentah per seed: seed 42 0,7823; seed 43 0,7807; seed 44 0,7782; seed 45 0,7754; seed 46 0,7770; garis putus-putus mean 0,7787; spread 0,0069.",
        caption: "Cara membaca: hanya random_state GBM yang berubah (split tetap seed 42). Lima batang berayun dalam pita selebar 0,0069 di sekitar mean 0,7787 — seed 42 (0,7823) adalah ujung atas pita itu, bukan nilai sejati. Model terkalibrasi lebih stabil lagi: spread 0,0030. Bandingkan dengan ambang alert monitoring 0,02 [kebijakan M7.5]: noise seed tidak pernah menyalakan alert.",
      },
      tasks: [],
    },
    {
      id: "data-snapshot",
      eyebrow: "Langkah 5 · Data snapshot",
      title: "Data snapshot: «data yang sama» berarti baris dan definisi yang sama",
      prose: [
        "Kolom (5) template G10 — data snapshot — adalah kolom yang sering diisi asal-asalan («data UCI») dan mahal akibatnya. Snapshot yang benar menjawab tiga hal: DATA APA — UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; SPLIT BAGAIMANA — stratified 80/20, seed 42 (train 24.000, test 6.000); dan SKEMA FITUR APA — 31 fitur flagship v1, yaitu 23 kolom mentah (LIMIT_BAL, SEX, EDUCATION, MARRIAGE, AGE, PAY_0, PAY_2–PAY_6, BILL_AMT1–BILL_AMT6, PAY_AMT1–PAY_AMT6) ditambah 8 fitur turunan (PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT, UTILIZATION, PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, BILL_TREND). Tiga jawaban itu, ditulis persis, adalah yang membuat «data yang sama» di langkah 3 bisa diperiksa.",
        "Mengapa snapshot penting? Karena data BERGERAK diam-diam. Baris baru masuk tiap bulan; label lama dikoreksi; definisi kolom berubah — UTILIZATION hari ini BILL_AMT1 / LIMIT_BAL, bulan depan seseorang «memperbaiki» definisinya menjadi BILL_MEAN / LIMIT_BAL dan tidak memberi tahu siapa pun. Model yang dilatih ulang di atas data yang «sama namanya» tapi berbeda isinya akan menghasilkan angka yang berbeda — dan tanpa snapshot, tidak ada yang bisa membuktikan data mana yang menghasilkan 0,7823. Snapshot adalah foto data yang dibekukan: salinan (atau hash + tanggal + query) dari data persis yang dipakai latih, disimpan bersama model card.",
        "Nilai: snapshot yang baik punya TIGA sifat. Satu — BEKU: isinya tidak berubah setelah ditulis; bila data berubah, snapshot BARU dibuat dengan versi baru, snapshot lama tidak ditimpa. Dua — LENGKAP: mencakup skema fitur beserta definisi tiap fitur turunan (rumus UTILIZATION, PAY_RATIO, BILL_TREND) — karena fitur turunan yang definisinya berubah adalah fitur yang berbeda, walau namanya sama. Tiga — TERUKUR: base rate, ukuran train/test, dan PSI train-vs-test [M7.5] dicatat di sampingnya — PSI tertinggi AGE 0,0029 [m75_psi_features_train_vs_test.AGE.psi] membuktikan split seed 42 sehat, dan menjadi baseline bila snapshot berikutnya dibandingkan.",
        "Baik atau buruk: snapshot bagus karena ia membuat klaim «data yang sama» bisa DIPERIKSA — bandingkan hash, bandingkan jumlah baris, bandingkan definisi. Buruk bila snapshot hanya berupa nama file («uci_default_credit.xls»): nama file bisa menunjuk ke isi yang berbeda besok pagi, dan «file yang sama» bukan bukti apa-apa. Dan buruk bila skema fitur tidak ditulis: 31 fitur tanpa daftar adalah 31 fitur yang tidak bisa diverifikasi — satu fitur yang tertukar diam-diam (PAY_2 dengan PAY_3, misalnya) tidak akan ketahuan sampai angkanya sudah salah.",
        "Mitigasi: di model card-mu, tulis snapshot dalam SATU baris yang lengkap — sumber, jumlah baris, base rate, split + seed, dan versi skema fitur — lalu simpan hash file datanya di kolom (6) code/notebook hash. Bila satu pun dari ketiganya berubah, naikkan versi skema dan tulis alasannya di kolom (10).",
      ],
      tasks: [],
      note: {
        title: "Jebakan: «datanya kan itu-itu saja»",
        type: "risk",
        body: "Yang benar: data yang «itu-itu saja» adalah asumsi yang sering salah di model risk. Label dikoreksi, definisi kolom berubah, baris baru masuk — semuanya tanpa pengumuman. Tanpa snapshot yang dibekukan, replikasi yang gagal akan disalahkan pada seed atau library, padahal datanya yang sudah bukan data yang sama.",
      },
    },
    {
      id: "versioning",
      eyebrow: "Langkah 6 · Versioning",
      title: "Versioning: versi model, kalibrasi, dan threshold adalah identitas — rollback butuh ini",
      prose: [
        "Tiga kolom G10 — (1) model version, (3) calibration version, (4) threshold policy version — bersama-sama adalah IDENTITAS sebuah versi model. Bukan sekadar label: identitas adalah yang memungkinkanmu menunjuk satu versi di antara banyak dan berkata «yang ini yang live, yang itu yang dicabut». Contoh dari M7.4 [M7.4]: v1 = threshold tunggal 0,10; v2 = threshold per grup 0,1058/0,0965 (target approval 0,285, AIR SEX 0,8694 → 0,9999). v1 dan v2 memakai model yang sama (GBM terkalibrasi, seed 42) dan data yang sama — yang berubah HANYA kebijakan threshold. Tanpa versi threshold policy, v1 dan v2 tidak bisa dibedakan — dan rollback dari v2 ke v1 tidak bisa dilakukan, karena tidak ada yang tahu «v1» itu apa.",
        "Aturan penomoran yang dipakai lesson ini [keputusan kebijakan lesson ini]: MAJOR naik bila model atau kebijakan threshold berubah (v1 threshold tunggal → v2 threshold per grup; GBM → model lain); MINOR naik bila kalibrasi di-fit ulang atau fitur ditambah/dihapus tanpa mengubah kebijakan (skema fitur v1 → v2); PATCH naik bila hanya dokumentasi yang diperbaiki tanpa mengubah angka apa pun. Aturan ini bukan standar industri universal — ia standar TIM ini, ditulis di model card, dan dipakai konsisten. Yang penting bukan skemanya; yang penting adalah SETIAP perubahan punya nomor, dan nomor itu menunjuk ke SATU paket lengkap (model + kalibrasi + threshold + data snapshot + kode).",
        "Nilai: versioning yang disiplin membuat TIGA hal menjadi mungkin. Satu — ROLLBACK: kolom (9) rollback version selalu menunjuk ke versi sebelumnya yang sudah terbukti (v2 → v1 threshold tunggal 0,10 [M7.4]); tanpa itu, pencabutan versi gagal berarti mengarang pengganti di tengah krisis. Dua — PERBANDINGAN: dua versi bisa dibandingkan apel-dengan-apel karena masing-masing punya paket metrik lengkap di kartunya (v1: profit +NT$8.214.000 [M6.4]; v2: +NT$8.504.500 [M7.4]). Tiga — AKUNTABILITAS: setiap versi punya owner dan approval date — bila v2 bermasalah, jelas siapa yang menyetujuinya dan kapan.",
        "Baik atau buruk: versioning bagus karena ia mengubah «model terbaru» — frasa yang tidak berarti apa-apa — menjadi «v2, threshold per grup 0,1058/0,0965, disetujui [ilustrasi]» — sesuatu yang bisa dicari dan dibuka. Buruk bila versi hanya ditempel di nama file («model_final_v2_FINAL.ipynb»): nama file bukan versi — ia tidak terikat pada data snapshot, tidak terikat pada metrik, dan «FINAL» ketiga kalinya adalah lelucon yang sudah tidak lucu. Dan buruk bila minor dan patch dicampur: kalibrasi yang di-fit ulang diam-diam di bawah nomor versi yang sama berarti dua model berbeda mengaku sebagai satu versi.",
        "Mitigasi: satu versi = satu kartu = satu paket (model + kalibrasi + threshold + snapshot + hash kode). Bila satu komponen berubah, kartu baru dibuat — tidak ada «edit kecil» pada kartu yang sudah disetujui. Dan tulis rollback version SEBELUM deploy, bukan sesudah gagal: kolom (9) yang kosong saat deploy adalah janji yang tidak bisa ditepati saat krisis.",
      ],
      tasks: [],
    },
    {
      id: "limitations",
      eyebrow: "Langkah 7 · Limitations",
      title: "Limitations: kartu yang jujur menulis apa yang TIDAK bisa model lakukan",
      prose: [
        "Bagian limitations adalah bagian yang membedakan model card dari brosur — dan bagian yang sering dikosongkan. Tiga batasan flagship yang WAJIB ditulis. Satu — DATA SATU SNAPSHOT, TANPA DERET WAKTU [M7.5]: data UCI ini satu foto tanpa tanggal; model tidak tahu tren waktu, tidak bisa menilai apakah kinerjanya membaik atau memburuk dari waktu ke waktu, dan semua analisis «per periode» di lesson ini memakai waktu semu (urutan ID, bukan tanggal nyata). Model yang dilatih di snapshot tidak boleh diklaim memahami musim, resesi, atau perubahan perilaku dari waktu ke waktu. Dua — FAIRNESS TERBATAS [M7.1]: AIR SEX (GBM terkalibrasi) 0,8694 (approval laki-laki 26,14% vs perempuan 30,07%) berada di atas ambang 0,80 (aturan four-fifths — ambang standar, bukan konstanta alam), tapi AIR EDUCATION serendah 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max] — rasio approval terendah (SMA) terhadap tertinggi (Lainnya) — — model ini TIDAK adil secara merata antar grup pendidikan, dan klaim «model adil» tanpa menyebut grup dan angkanya adalah klaim yang salah. Tiga — PENJELASAN BUKAN KAUSAL [M7.3]: SHAP dan koefisien menjelaskan apa yang dipakai model untuk memutuskan, bukan apa yang MENYEBABKAN default di dunia — kartu yang menulis «UTILIZATION menyebabkan default» sudah berbohong.",
        "Tambahkan dua batasan lagi yang berlaku untuk hampir semua model kredit. Empat — LABEL BUTUH WAKTU [M7.5]: label «default bulan depan» baru tersedia setelah jendela observasi 1 bulan lewat; metrik berlabel (ROC-AUC, bad rate) untuk periode terbaru belum bisa dihitung, dan kartu yang melaporkan metrik itu tanpa menyebut kematangan labelnya menyesatkan. Lima — POPULASI TERBATAS: model dilatih pada nasabah kartu kredit Taiwan 2005 (data UCI) — menerapkannya pada populasi lain (negara lain, produk lain, tahun lain) tanpa validasi ulang adalah ekstrapolasi, bukan penerapan.",
        "Nilai: limitations yang ditulis dengan jujur adalah PERLINDUNGAN — bagi pengguna (mereka tahu kapan tidak memakai model), bagi tim (mereka tahu apa yang harus diuji sebelum ekspansi), dan bagi auditor (mereka melihat tim ini memahami modelnya, bukan menyembahnya). Kartu tanpa limitations dibaca auditor sebagai salah satu dari dua hal: tim tidak tahu batasannya, atau tim tahu dan menyembunyikannya. Keduanya buruk.",
        "Baik atau buruk: menulis batasan bagus karena ia membuat kartu bisa DIPERCAYA — angka baiknya (ROC-AUC 0,7823) menjadi lebih kredibel justru karena angka buruknya (AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max]) ditulis di sampingnya. Buruk bila batasan ditulis sebagai kalimat penghibur («model mungkin kurang akurat pada beberapa grup») tanpa angka dan tanpa grup yang disebut: batasan tanpa angka adalah basa-basi, bukan batasan. Tulis grupnya, tulis angkanya, tulis konsekuensinya.",
        "Mitigasi: setiap batasan ditulis dalam format tiga bagian — APA batasannya, ANGKA berapa yang membuktikannya, dan APA KONSEKUENSINYA (kapan model tidak boleh dipakai). Bila satu batasan tidak punya angka, tuliskan «belum diukur» — itu lebih jujur daripada kalimat penghibur.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: batasan membuat model terlihat buruk",
        type: "pitfall",
        body: "Yang benar: batasan membuat model terlihat JUJUR — dan kejujuran adalah yang membuat angka baiknya dipercaya. Model dengan ROC-AUC 0,7823 DAN batasan yang ditulis lengkap lebih dipercaya daripada model dengan ROC-AUC 0,79 tanpa batasan sama sekali. Auditor tidak menghukum batasan; auditor menghukum batasan yang disembunyikan lalu ketahuan.",
      },
    },
    {
      id: "audit-trail",
      eyebrow: "Langkah 8 · Audit trail",
      title: "Audit trail: siapa, kapan, mengapa — dan angka apa yang berubah",
      prose: [
        "Model card adalah FOTO satu versi; audit trail adalah FILMnya — catatan berurutan dari setiap keputusan yang mengubah model, lengkap dengan siapa yang memutuskan, kapan, mengapa, dan angka apa yang berubah. Satu entri audit yang lengkap punya LIMA field: TANGGAL, KEPUTUSAN (apa yang berubah — misalnya threshold tunggal 0,10 → threshold per grup 0,1058/0,0965 [M7.4]), PEMICU (metrik apa yang memintanya — AIR SEX 0,8694 pada v1), ANGKA SEBELUM DAN SESUDAH (AIR 0,8694 → 0,9999; profit +NT$8.214.000 → +NT$8.504.500 [M7.4]; selisih approval 0,0393 → 0,0000), dan PENYETUJU (nama + jabatan). Tanpa kelimanya, entri itu adalah rumor dengan tanggal.",
        "Audit trail dipasangkan dengan workflow change control ENAM gerbang dari M7.4 [M7.4]: (1) proposal — template G10 ditulis DULU, sebelum satu baris kode berubah; (2) offline validation — paket lengkap diukur oleh validator independen (fungsi model risk/compliance, tidak melapor ke owner) pada validation yang belum dipakai memilih; (3) legal/risk approval — penasihat hukum dan fungsi legal/risk (lini kedua, independen dari owner) menandatangani template-nya, bukan slide-nya — tanda tangan ini adalah sign-off atas hasil validasi independen, bukan persetujuan diri sendiri; (4) shadow/canary — v2 berjalan berdampingan dengan v1 pada sebagian trafik (detailnya M8.4); (5) production — v2 berlaku, v1 menjadi rollback version; (6) rollback criteria — DITETAPKAN sebelum gerbang (5) (ditulis di gerbang (1), bersama proposal) dan DIVERIFIKASI di sini: cabut v2 bila AIR SEX jatuh di bawah 0,80 (aturan four-fifths) selama 2 periode berturut-turut, atau ECE di atas 0,02 [kebijakan M7.5] bertahan, atau review hukum menolak — dan kembalikan v1. Setiap gerbang yang dilewati meninggalkan jejak di audit trail: siapa yang menandatangani, kapan, dan atas angka apa.",
        "Nilai: audit trail bagus karena ia menjawab pertanyaan yang TIDAK BISA dijawab model card sendirian: «mengapa threshold laki-laki 0,1058 dan perempuan 0,0965?» — jawabannya ada di entri M7.4-01: pemicu AIR 0,8694, alternatif yang dipertimbangkan (reweighing AIR 0,9567, hapus fitur AIR 0,9211 — keduanya tidak menutup kesenjangan), risiko yang diterima (pita inversi 92 laki-laki vs 151 perempuan, pertimbangan legalitas threshold per grup). Tanpa trail itu, angka 0,1058/0,0965 adalah angka ajaib yang tidak ada yang berani ubah — dan tidak ada yang berani pertahankan.",
        "Baik atau buruk: trail yang lengkap bagus karena ia membuat keputusan BISA DITINJAU ULANG — enam bulan lagi, seseorang bisa membuka entri itu dan menilai apakah alasan waktu itu masih berlaku. Buruk bila trail hanya berisi angka sesudahnya («AIR kini 0,9999!»): tanpa angka sebelumnya, tanpa alternatif yang dipertimbangkan, dan tanpa risiko yang diterima, dokumen itu adalah brosur — bukan catatan keputusan [M7.4]. Dan buruk bila penyetujunya kosong: keputusan tanpa nama penanggung jawab adalah keputusan yang tidak ada yang berani mempertahankannya saat ditanya.",
        "Mitigasi: simpan audit trail BERSAMA model card — satu halaman per keputusan, dengan tanggal dan versi modelnya. Bila model dilatih ulang, trail-nya dibuka lagi: apakah AIR-nya masih 0,9999? Apakah threshold per grupnya masih 0,1058/0,0965? Bila tidak, keputusan itu sudah kedaluwarsa — dan harus dibuat ulang, bukan diwarisi diam-diam.",
      ],
      tasks: [],
    },
    {
      id: "lifecycle-linkage",
      eyebrow: "Langkah 8a · Setelah audit trail",
      title: "Lifecycle linkage: satu ID yang sama di semua artefak — mismatch adalah governance failure",
      prose: [
        "Model card (lesson ini), validation report (M8.1), tiering record (M8.2), deployment record (M8.4), monitoring config (M7.5), revalidation report (M8.5) — enam artefak, satu lifecycle. LIFECYCLE LINKAGE adalah aturan yang mengikat keenamnya: enam field ID yang SAMA harus muncul di semua artefak — (1) model_id: identitas model di seluruh lifecycle («credit-scorecard-flagship»); (2) model_version: versi model («gbm-calibrated-v1»); (3) feature_schema_version: versi skema fitur («flagship-v1»); (4) calibration_version: versi kalibrasi («platt-cv3»); (5) threshold_policy_version: versi kebijakan threshold («threshold-v1»); (6) deployment_id: identitas deployment («deploy-2026-11-13»). Bila satu artefak menulis ID yang berbeda, itu bukan «data error kecil» — itu GOVERNANCE FAILURE: artefak-artefak itu tidak lagi menceritakan model yang sama.",
        "Contoh yang diajarkan lab 3: monitoring config membaca model_version «gbm-calibrated-v2» sementara model card, validation report, tiering record, dan deployment record semuanya «gbm-calibrated-v1». Apa yang terjadi? Yang dimonitor BUKAN model yang divalidasi — keputusan sedang diambil oleh versi yang tidak punya kartu, tidak punya validasi independen, dan tidak punya persetujuan komite. Vonisnya: deployment DIBEKUKAN sampai ID-nya dicocokkan — bukan «monitoring salah ketik» (mismatch tidak boleh diasumsikan salah ketik: yang berjalan bisa jadi benar-benar v2 yang naik tanpa kartu), bukan «perbarui kartu menjadi v2 supaya cocok» (mengubah kartu agar cocok dengan yang berjalan adalah memalsukan jejak audit), dan bukan «v2 pasti lebih baru dan lebih baik» («lebih baru» bukan «tervalidasi»). Yang benar adalah menghentikan deployment yang tidak cocok dan menyelidiki: versi mana yang benar-benar berjalan, siapa yang menaikkannya, dan atas persetujuan apa.",
        "Nilai: linkage bagus karena ia membuat satu pertanyaan audit menjadi pertanyaan yang bisa dijawab mesin: «apakah model yang berjalan adalah model yang divalidasi?» — jawabannya adalah perbandingan enam string, bukan penyelidikan berminggu-minggu. Tanpa linkage, pertanyaan itu tidak bisa dijawab sama sekali: tiap artefak menceritakan versinya sendiri, dan tidak ada yang tahu versi mana yang live. Dan linkage adalah yang membuat rollback (G10 di M8.4) bisa dilakukan: deployment_id menunjuk ke bundle konfigurasi yang tepat — tanpa itu, «kembalikan ke versi sebelumnya» tidak tahu harus mengembalikan apa.",
        "Baik atau buruk: linkage bagus bila ID-nya ditulis OTOMATIS oleh pipeline deploy — manusia tidak mengetik «gbm-calibrated-v1» enam kali di enam tempat (satu ketikan yang salah menciptakan mismatch palsu). Buruk bila ID ditulis manual di tiap artefak: mismatch yang ditemukan adalah mismatch ketikan, dan mismatch yang sebenarnya (v2 yang naik diam-diam) tidak pernah ketahuan karena semua orang sibuk memperbaiki ketikan. Buruk juga bila linkage hanya diperiksa saat audit tahunan — ia harus diperiksa di SETIAP deployment dan di SETIAP revalidasi (lab 3), karena mismatch yang ditemukan setahun kemudian berarti setahun keputusan yang diambil model yang tidak divalidasi.",
        "Mitigasi: jadikan pengecekan linkage GERBANG deploy (M8.4) dan GERBANG revalidasi (M8.5): tidak ada deployment bila satu ID pun tidak cocok dengan kartu. Dan simpan keenam ID itu di SATU tempat kebenaran (deployment record) — artefak lain MEMBACA dari sana, bukan menulis versinya sendiri.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Rantai lifecycle: model card, validation report, tiering record, deployment record, monitoring, revalidation — model_id dan model_version identik di keenam artefak">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Lifecycle chain — satu ID yang sama di semua artefak</text>
<rect x="20" y="36" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="85" y="52" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Model card</text>
<text x="85" y="66" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M8.3</text>
<rect x="175" y="36" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="240" y="52" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Validation report</text>
<text x="240" y="66" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M8.1</text>
<rect x="330" y="36" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="395" y="52" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tiering record</text>
<text x="395" y="66" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M8.2</text>
<line x1="150" y1="56" x2="175" y2="56" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="305" y1="56" x2="330" y2="56" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="395" y1="76" x2="395" y2="130" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="330" y="130" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="395" y="146" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Deployment record</text>
<text x="395" y="160" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M8.4</text>
<rect x="175" y="130" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="240" y="146" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Monitoring</text>
<text x="240" y="160" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M7.5</text>
<rect x="20" y="130" width="130" height="40" rx="6" fill="var(--c1)" opacity="0.25"/>
<text x="85" y="146" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Revalidation</text>
<text x="85" y="160" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">M8.5</text>
<line x1="330" y1="150" x2="305" y2="150" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="175" y1="150" x2="150" y2="150" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="240" y="196" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Aturan: model_id + model_version IDENTIK di keenam artefak</text>
<text x="240" y="212" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">model_id, model_version, feature_schema_version, calibration_version,</text>
<text x="240" y="226" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">threshold_policy_version, deployment_id — mismatch = governance failure</text>
</svg>`,
        alt: "Rantai lifecycle: model card, validation report, tiering record, deployment record, monitoring, revalidation — model_id dan model_version identik di keenam artefak; mismatch adalah governance failure.",
        caption: "Cara membaca: enam artefak satu lifecycle — kartu (M8.3) → laporan validasi (M8.1) → catatan tiering (M8.2) → catatan deployment (M8.4) → monitoring (M7.5) → revalidasi (M8.5). Keenam field ID (model_id, model_version, feature_schema_version, calibration_version, threshold_policy_version, deployment_id) harus IDENTIK di semua artefak. Bila satu artefak menulis versi yang berbeda, model yang berjalan bukan model yang divalidasi — itu governance failure, bukan data error.",
      },
      tasks: [],
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 9 · Jebakan",
      title: "Jebakan: dokumentasi ditulis SETELAH deploy — saat ingatan sudah pudar",
      prose: [
        "Jebakan yang umum — dan mahal — di lesson ini: dokumentasi ditulis SETELAH deploy. Alasannya selalu masuk akal: «deploy dulu, dokumentasi menyusul», «tenggatnya mepet», «kan sudah ada di kepala». Akibatnya bisa ditebak: dua minggu kemudian, tidak ada yang ingat seed berapa yang dipakai (42? 43?), data snapshot yang mana (sebelum atau sesudah koreksi label?), atau siapa yang menyetujui threshold 0,10 (komite? analis sendirian? «katanya sudah disetujui»?). Angka 0,7823 masih ada di slide — tapi tidak ada yang bisa mereproduksinya, karena bahan reproduksinya (langkah 3) tidak pernah ditulis saat masih segar.",
        "Nilai: ada TIGA kerugian yang terukur dari dokumentasi yang terlambat. Satu — ANGKA YANG TIDAK BISA DIREPRODUKSI: replikasi yang dijalankan dua minggu kemudian menghasilkan angka berbeda, dan tidak ada yang tahu apakah yang berubah adalah seed, data, atau library — karena ketiganya tidak dicatat. Dua — KEPUTUSAN YANG TIDAK BISA DITINJAU: alasan threshold 0,10 (dari analisis biaya [M6.4]) tidak tertulis, jadi threshold itu tidak bisa dipertahankan saat ditanya — dan tidak bisa diubah dengan percaya diri, karena tidak ada yang tahu apa yang akan rusak bila ia diubah. Tiga — AUDIT YANG GAGAL: auditor di langkah 1 tidak bertanya «apakah modelmu akurat?» — ia bertanya «buktikan» — dan bukti yang ditulis dari ingatan dua tahun kemudian bukan bukti, melainkan rekonstruksi.",
        "Baik atau buruk: menulis dokumentasi sesudah deploy terasa efisien — karena deploy-nya memang lebih cepat sehari. Buruknya: biaya keterlambatan itu dibayar berkali-kali lipat kemudian — dalam jam kerja mencari ulang angka, dalam keputusan yang tidak bisa dipertahankan, dan dalam audit yang gagal. Satu hari yang «dihemat» di awal berubah menjadi berminggu-minggu rekonstruksi di akhir. Dan buruk bila dokumentasi sesudah deploy ditulis dari ingatan TANPA menjalankan ulang: angka yang «diingat» 0,7823 bisa saja sebenarnya 0,7787 (rata-rata lintas seed) — dan kesalahan ingatan sekecil itu sudah cukup untuk membuat kartu tidak cocok dengan replikasi.",
        "Mitigasi: balik urutannya — kartu ditulis SEBELUM deploy, sebagai GERBANG (M8.4): tidak ada kartu lengkap = tidak ada deploy. Dan hasilkan kartu dari KODE, bukan dari ingatan: lab 2 lesson ini membangun kartu sebagai JSON dari angka kanonis, divalidasi mesin — notebook guided task melakukan hal yang sama untuk flagship (check 4: 10 kolom ada, metrik cocok). Bila angkanya berasal dari run yang sama yang menghasilkan model, kartu tidak bisa salah ingat — karena ia tidak mengingat apa-apa.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: «dokumentasi menyusul» dalam praktik berarti «dokumentasi tidak pernah»",
        type: "risk",
        body: "Yang benar: setelah deploy, insentif untuk menulis dokumentasi hilang — model sudah live, bisnis sudah senang, tenggat berikutnya sudah datang. «Menyusul» dalam praktik berarti «bila sempat» — dan «bila sempat» berarti «tidak pernah». Satu-satunya dokumentasi yang pasti ada adalah dokumentasi yang menjadi syarat deploy.",
      },
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: model card flagship — terisi dari angka kanonis",
      prose: [
        "Sekarang isi kartu flagship selengkapnya — semua angka dari kanonis M8 dan modul lain yang dilabeli sumbernya; kolom yang bukan hasil hitung dilabeli [ilustrasi]. (1) Model version: gbm-calibrated-v1 — HistGradientBoostingClassifier random_state=42, 31 fitur flagship v1 [notebook]. (2) Feature schema version: flagship-v1 — 31 fitur (23 mentah + 8 turunan [notebook]: PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT, UTILIZATION, PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, BILL_TREND). (3) Calibration version: Platt/sigmoid, CalibratedClassifierCV cv=3 [notebook]. (4) Threshold policy version: v1 threshold tunggal 0,10 [M6.4]. (5) Data snapshot: UCI Default of Credit Card Clients, 30.000 baris, base rate 0,2212, split stratified seed 42 (train 24.000, test 6.000). (6) Code/notebook hash: [ilustrasi] — hash commit notebook flagship. (7) Approval date: [ilustrasi] — tanggal komite menyetujui v1. (8) Owner: [ilustrasi] — Model Owner (peran bisnis/model development — owner tidak menandatangani persetujuannya sendiri; legal/risk approval di gerbang (3) datang dari fungsi independen). (9) Rollback version: tidak ada versi model sebelumnya — v1 adalah versi produksi pertama; rollback plan: nonaktifkan skor model, kembali ke keputusan manual [ilustrasi]. (10) Alasan perubahan: versi produksi pertama model flagship [M6.4].",
        "METRIK (test 6.000, threshold 0,10): GBM mentah ROC-AUC 0,7823, PR-AUC 0,5597, Brier 0,1342; GBM terkalibrasi ROC-AUC 0,7816, PR-AUC 0,5558, Brier 0,1345, ECE 0,0087 [M6.4]; LR mentah (tidak terkalibrasi) ROC-AUC 0,7426, PR-AUC 0,5049, Brier 0,1427; approval rate 28,5% (1.710 dari 6.000), bad rate yang disetujui 6,67%, biaya NT$33.046.500, profit +NT$8.214.000 [M6.4]; GBM train ROC-AUC 0,8469, gap train-test 0,0646; seed sensitivity: ROC-AUC mentah lintas seed 42–46 spread 0,0069, mean 0,7787, sd 0,0028; terkalibrasi spread 0,0030; approval spread 0,63 poin persen; fairness (GBM terkalibrasi): AIR SEX 0,8694 [M7.1] (approval laki-laki 26,14% vs perempuan 30,07%), AIR EDUCATION terendah 0,3572 (SMA) [m71_by_group.EDUCATION.summary.air_min_over_max].",
        "BATASAN (langkah 7): data satu snapshot tanpa deret waktu [M7.5]; label butuh jendela observasi 1 bulan [M7.5]; AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max] — tidak adil merata antar grup pendidikan (SMA vs Lainnya; ambang 0,80 aturan four-fifths) [M7.1]; penjelasan (SHAP/koefisien) bukan kausal [M7.3]; populasi latih nasabah kartu kredit Taiwan 2005 — ekstrapolasi ke populasi lain butuh validasi ulang. TUJUAN: keputusan setujui/tolak pengajuan kartu kredit pada threshold 0,10. Perhatikan apa yang TIDAK ada di kartu ini: tidak ada klaim «model terbaik», tidak ada angka tanpa sumber, tidak ada kolom kosong yang disembunyikan — kolom yang belum diketahui ditulis [ilustrasi] dengan jujur.",
        "Nilai: kartu ini bagus karena SIAPA PUN bisa memverifikasinya tanpa meneleponmu: jalankan notebook guided task, bandingkan angka-angkanya dengan kartu ini dalam toleransi 0,001 (check 2–4), dan semua angka hitung cocok — GBM 0,7823, terkalibrasi 0,7816, approval 28,5%, bad rate 6,67%, spread seed 0,0069. Yang tidak bisa diverifikasi dari data — approval date, owner, hash — dilabeli [ilustrasi] sehingga tidak ada yang mengira itu angka nyata.",
        "Baik atau buruk: mini-case ini bagus sebagai CONTOH LENGKAP — ia menunjukkan kartu yang terisi penuh, bukan template kosong. Buruk bila disalin mentah ke produksi lain: angka-angka ini milik flagship UCI; kartu produksimu harus diisi dari run-mu sendiri. Dan buruk bila kolom [ilustrasi] dibiarkan [ilustrasi] saat deploy: [ilustrasi] adalah tanda «isi sebelum deploy», bukan isi yang boleh live.",
        "Mitigasi: pakai kartu ini sebagai TEMPLATE TERISI untuk modelmu sendiri — ganti angka kanonis dengan angka run-mu, ganti [ilustrasi] dengan tanggal, nama, dan hash yang nyata, lalu jalankan validasi lab 2: 17 kolom ada (10 G10 + 7 penggunaan), tidak ada yang kosong, metrik cocok dengan notebook.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 11 · Lab 1",
      title: "Lab: hitung seed sensitivity — spread, mean, dan simpangan baku",
      prose: [
        "Sekarang hitung sendiri angka langkah 4 dari nilai kanonis [kanonis M8]. Split TETAP seed 42; hanya random_state GBM yang berubah (42–46). ROC-AUC GBM mentah: 0,7823 / 0,7807 / 0,7782 / 0,7754 / 0,7770. ROC-AUC GBM terkalibrasi: 0,7816 / 0,7810 / 0,7826 / 0,7796 / 0,7796. Approval rate terkalibrasi (persen): 28,50 / 28,93 / 28,30 / 28,85 / 28,67. Yang dihitung: spread = maks − min; mean = rata-rata; sd = simpangan baku dengan ddof=1 (pembagi n−1, bukan n — `statistics.stdev` memakai ddof=1 secara default).",
        "Hasil yang diharapkan [lab]: spread_raw=0.0069; mean_raw=0.7787; sd_raw=0.0028; spread_cal=0.0030; approval_spread_pp=0.63. Perhatikan: mean mentah 0,7787 — LEBIH RENDAH dari angka seed 42 (0,7823) yang dilaporkan di kartu. Itu bukan kesalahan: 0,7823 adalah satu pengukuran (seed 42, ujung atas pita), 0,7787 adalah rata-rata lima pengukuran. Keduanya benar — dan kartu yang jujur menulis keduanya (langkah 4). Approval spread 0,63 poin persen berarti: keputusan bisnis (berapa yang disetujui) bergerak kurang dari satu poin persen hanya karena seed — kecil, tapi bukan nol.",
        "Setelah lab jalan, bandingkan spread mentah (0,0069) dengan spread terkalibrasi (0,0030): kalibrasi tidak hanya memperbaiki kejujuran probabilitas — ia juga MENSTABILKAN angka lintas seed. Dan bandingkan keduanya dengan ambang alert monitoring 0,02 [kebijakan M7.5]: noise seed tidak pernah menyalakan alert — bila alert menyala, penyebabnya bukan seed.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi spread_raw (maks − min) dan mean_raw (rata-rata) dari RAW_ROC_AUC" },
        { id: "t2", text: "Lengkapi sd_raw: simpangan baku RAW_ROC_AUC dengan ddof=1 (statistics.stdev)" },
        { id: "t3", text: "Lengkapi spread_cal dan approval_spread_pp, jalankan dan bandingkan dengan kanonis" },
      ],
      expected: "spread_raw=0.0069\nmean_raw=0.7787\nsd_raw=0.0028\nspread_cal=0.0030\napproval_spread_pp=0.63",
      hints: [
        "spread = max(nilai) − min(nilai): mentah 0,7823 − 0,7754 = 0,0069; terkalibrasi 0,7826 − 0,7796 = 0,0030.",
        "mean = sum(nilai) / len(nilai): (0,7823 + 0,7807 + 0,7782 + 0,7754 + 0,7770) / 5 = 0,7787.",
        "Gunakan statistics.stdev (ddof=1, pembagi n−1) — BUKAN pstdev (ddof=0, pembagi n). stdev yang benar = 0,0028; pstdev memberi 0,0025 dan check akan gagal.",
      ],
      code: {
        starter: `# Seed sensitivity: ROC-AUC GBM lintas seed 42-46 [kanonis M8]
# Split TETAP seed 42; hanya random_state GBM yang berubah (42..46)
import statistics
RAW_ROC_AUC = [0.7823, 0.7807, 0.7782, 0.7754, 0.7770]  # seed 42..46
CAL_ROC_AUC = [0.7816, 0.7810, 0.7826, 0.7796, 0.7796]  # seed 42..46
APPROVAL_PCT = [28.50, 28.93, 28.30, 28.85, 28.67]  # persen, model terkalibrasi, threshold 0,10

spread_raw = 0.0  # TODO: max - min RAW_ROC_AUC
mean_raw = 0.0  # TODO: rata-rata RAW_ROC_AUC
sd_raw = 0.0  # TODO: statistics.stdev(RAW_ROC_AUC) — ddof=1
spread_cal = 0.0  # TODO: max - min CAL_ROC_AUC
approval_spread_pp = 0.0  # TODO: max - min APPROVAL_PCT (poin persen)
print(f"spread_raw={spread_raw:.4f}")
print(f"mean_raw={mean_raw:.4f}")
print(f"sd_raw={sd_raw:.4f}")
print(f"spread_cal={spread_cal:.4f}")
print(f"approval_spread_pp={approval_spread_pp:.2f}")`,
        lockLines: 7,
        solution: `# Seed sensitivity: ROC-AUC GBM lintas seed 42-46 [kanonis M8]
# Split TETAP seed 42; hanya random_state GBM yang berubah (42..46)
import statistics
RAW_ROC_AUC = [0.7823, 0.7807, 0.7782, 0.7754, 0.7770]  # seed 42..46
CAL_ROC_AUC = [0.7816, 0.7810, 0.7826, 0.7796, 0.7796]  # seed 42..46
APPROVAL_PCT = [28.50, 28.93, 28.30, 28.85, 28.67]  # persen, model terkalibrasi, threshold 0,10

spread_raw = max(RAW_ROC_AUC) - min(RAW_ROC_AUC)
mean_raw = sum(RAW_ROC_AUC) / len(RAW_ROC_AUC)
sd_raw = statistics.stdev(RAW_ROC_AUC)
spread_cal = max(CAL_ROC_AUC) - min(CAL_ROC_AUC)
approval_spread_pp = max(APPROVAL_PCT) - min(APPROVAL_PCT)
print(f"spread_raw={spread_raw:.4f}")
print(f"mean_raw={mean_raw:.4f}")
print(f"sd_raw={sd_raw:.4f}")
print(f"spread_cal={spread_cal:.4f}")
print(f"approval_spread_pp={approval_spread_pp:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "spread_raw", value: 0.0069, tol: 0.00005, label: "`spread_raw` seharusnya 0.0069", msg: "Spread mentah: 0,7823 − 0,7754 = 0,0069 — pita seed lima seed." },
          { kind: "equal", task: "t1", name: "mean_raw", value: 0.7787, tol: 0.00005, label: "`mean_raw` seharusnya 0.7787", msg: "Rata-rata mentah 0,7787 — lebih rendah dari angka seed 42 (0,7823, ujung atas pita)." },
          { kind: "equal", task: "t2", name: "sd_raw", value: 0.0028, tol: 0.00005, label: "`sd_raw` seharusnya 0.0028", msg: "Simpangan baku ddof=1 = 0,0028. Bila kamu memakai pstdev (ddof=0) hasilnya 0,0025 — salah pembagi." },
          { kind: "stdout_matches", task: "t3", pattern: "spread_cal=0.0030", label: "Output menampilkan spread_cal=0.0030", msg: "Spread terkalibrasi 0,0030 — kalibrasi menstabilkan angka lintas seed." },
          { kind: "stdout_matches", task: "t3", pattern: "approval_spread_pp=0.63", label: "Output menampilkan approval_spread_pp=0.63", msg: "Approval bergerak 28,30%–28,93%: spread 0,63 poin persen karena seed saja." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 12 · Lab 2",
      title: "Lab: bangun model-card JSON flagship + validasi 17 kolom wajib (10 G10 + 7 penggunaan)",
      prose: [
        "Lab kedua membangun model card flagship sebagai JSON — dari angka kanonis, bukan dari ingatan — lalu memvalidasi kelengkapan 17 kolom wajib (10 G10 [M7.4] + 7 penggunaan) dengan mesin. Kartunya berisi: model version gbm-calibrated-v1; feature schema flagship-v1 (31 fitur [notebook]); calibration Platt/sigmoid cv=3 [notebook]; threshold policy v1 threshold tunggal 0,10 [M6.4]; data snapshot UCI 30.000 baris split seed 42; code hash, approval date, dan owner [ilustrasi]; rollback version: tidak ada versi model sebelumnya — v1 versi produksi pertama (rollback plan: kembali ke keputusan manual [ilustrasi]); change reason versi produksi pertama. Tujuh kolom penggunaan: intended_users (analis kredit + komite risiko [ilustrasi] — bukan nasabah langsung); decision_context (persetujuan pengajuan kartu kredit baru, threshold v1 0,10 [M6.4]); affected_population (nasabah pengaju kartu kredit baru, populasi UCI Taiwan 2005 — bukan nasabah eksisting); approved_use (menyetujui/menolak pengajuan baru pada threshold v1 0,10); prohibited_use (DILARANG: menentukan limit kredit; menaikkan limit eksisting; memakai di luar populasi pengaju baru; memakai untuk penawaran produk lain); human_review_required (ya — banding nasabah yang ditolak + kasus skor di dekat threshold [kebijakan lesson ini]); out_of_scope_trigger (populasi bergeser dari UCI / model dipakai untuk produk lain → kartu ini tidak berlaku; revalidasi + kartu baru). Metriknya: ROC-AUC mentah 0,7823, terkalibrasi 0,7816, PR-AUC terkalibrasi 0,5558, approval 0,285, bad rate 0,0667, profit +NT$8.214.000 [M6.4].",
        "Hasil yang diharapkan [lab]: n_fields=17; missing=[]; all_required=True; prohibited_use_ok=True; roc_auc_raw=0.7823; roc_auc_cal=0.7816; pr_auc_cal=0.5558; approval_rate=0.2850; bad_rate_approved=0.0667; profit_nt=8214000. Validasi bekerja dengan cara: `missing` = kolom REQUIRED yang tidak ada di kartu ATAU nilainya kosong — kartu lolos hanya bila `missing` kosong. Aturan keras: `prohibited_use_ok` harus True — kartu dengan penggunaan-terlarang kosong GAGAL walau 16 kolom lain lengkap: kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya. Perhatikan: validasi ini memeriksa KEBERADAAN kolom, bukan KEBENARAN isinya — kolom approval date berisi «[ilustrasi] 2026-11-13» tetap lolos karena ada dan tidak kosong. Itulah batas validasi mesin: ia menangkap kartu yang tidak lengkap, bukan kartu yang berbohong. Kebenaran isi tetap tanggung jawab manusia (dan replikasi notebook).",
        "Setelah lab jalan, coba sendiri: hapus satu kolom dari kartu (misalnya data_snapshot) dan jalankan ulang — `missing` akan berisi ['data_snapshot'] dan `all_required` menjadi False. Coba juga: kosongkan prohibited_use — `missing` berisi ['prohibited_use'] DAN `prohibited_use_ok` menjadi False: kartu GAGAL walau 16 kolom lain lengkap. Itulah yang dibuktikan notebook guided task di langkah 5: sembilan dari sepuluh kolom bukan «hampir lengkap».",
      ],
      tasks: [
        { id: "t1", text: "Periksa validasi: n_fields harus 17 dan missing harus kosong (all_required=True)" },
        { id: "t4", text: "Periksa hard rule: prohibited_use_ok harus True — kartu dengan penggunaan-terlarang kosong GAGAL walau 16 kolom lain lengkap" },
        { id: "t2", text: "Lengkapi metrik: roc_auc_raw, roc_auc_cal, pr_auc_cal, approval_rate" },
        { id: "t3", text: "Lengkapi bad_rate_approved dan profit_nt, jalankan dan bandingkan dengan kanonis" },
      ],
      expected: "n_fields=17\nmissing=[]\nall_required=True\nprohibited_use_ok=True\nroc_auc_raw=0.7823\nroc_auc_cal=0.7816\npr_auc_cal=0.5558\napproval_rate=0.2850\nbad_rate_approved=0.0667\nprofit_nt=8214000",
      hints: [
        "Kartu sudah lengkap di starter — tugas validasi (t1) adalah MEMBACA hasilnya: n_fields=17, missing=[], all_required=True.",
        "Hard rule G6: prohibited_use TIDAK BOLEH kosong — kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya. Coba kosongkan nilainya dan jalankan ulang: missing berisi ['prohibited_use'] dan prohibited_use_ok=False.",
        "Metrik dari kanonis M8: GBM mentah 0,7823; terkalibrasi 0,7816; PR-AUC terkalibrasi 0,5558; approval 0,285 (threshold 0,10).",
        "bad rate yang disetujui 0,0667; profit +NT$8.214.000 [M6.4] — tulis 8214000 (tanpa pemisah ribuan).",
      ],
      code: {
        starter: `# Bangun model card flagship sebagai JSON + validasi kolom wajib G10 [M7.4]
# Kolom yang bukan hasil hitung diisi [ilustrasi] — JANGAN dikarang seolah angka nyata
import json

REQUIRED = ["model_version", "feature_schema_version", "calibration_version",
            "threshold_policy_version", "data_snapshot", "code_notebook_hash",
            "approval_date", "owner", "rollback_version", "change_reason",
            "intended_users", "decision_context", "affected_population",
            "approved_use", "prohibited_use", "human_review_required", "out_of_scope_trigger"]

card = {
    "model_version": "gbm-calibrated-v1 (HistGradientBoostingClassifier, random_state=42)",
    "feature_schema_version": "flagship-v1 (31 fitur: 23 mentah + 8 turunan)",
    "calibration_version": "Platt/sigmoid, CalibratedClassifierCV cv=3",
    "threshold_policy_version": "v1 threshold tunggal 0,10 [M6.4]",
    "data_snapshot": "UCI Default of Credit Card Clients, 30.000 baris, split stratified seed 42 (train 24.000, test 6.000)",
    "code_notebook_hash": "[ilustrasi] <hash commit>",
    "approval_date": "[ilustrasi] 2026-11-13",
    "owner": "[ilustrasi] Model Owner (bisnis)",
    "rollback_version": "tidak ada versi model sebelumnya — v1 versi produksi pertama; rollback plan: kembali ke keputusan manual [ilustrasi]",
    "change_reason": "versi produksi pertama model flagship [M6.4]",
    "intended_users": "Analis kredit + komite risiko [ilustrasi] — bukan nasabah langsung",
    "decision_context": "Persetujuan pengajuan kartu kredit baru, threshold v1 0,10 [M6.4]",
    "affected_population": "Nasabah pengaju kartu kredit baru (populasi UCI Taiwan 2005) — bukan nasabah eksisting",
    "approved_use": "Menyetujui/menolak pengajuan kartu kredit baru pada threshold v1 0,10",
    "prohibited_use": "DILARANG: menentukan limit kredit; menaikkan limit eksisting; memakai di luar populasi pengaju baru; memakai untuk penawaran produk lain",
    "human_review_required": "Ya — banding nasabah yang ditolak + kasus skor di dekat threshold [kebijakan lesson ini]",
    "out_of_scope_trigger": "Populasi bergeser dari UCI / model dipakai untuk produk lain — kartu ini tidak berlaku; revalidasi + kartu baru",
}

metrics = {
    "roc_auc_raw": 0.0,  # TODO: GBM mentah 0,7823
    "roc_auc_cal": 0.0,  # TODO: GBM terkalibrasi 0,7816
    "pr_auc_cal": 0.0,  # TODO: 0,5558
    "approval_rate": 0.0,  # TODO: 0,285 (threshold 0,10)
    "bad_rate_approved": 0.0,  # TODO: 0,0667
    "profit_nt": 0,  # TODO: +NT$8.214.000 [M6.4]
}
# Nama top-level untuk checks (nilai sama dengan metrics)
roc_auc_raw = metrics["roc_auc_raw"]
roc_auc_cal = metrics["roc_auc_cal"]
pr_auc_cal = metrics["pr_auc_cal"]
approval_rate = metrics["approval_rate"]
bad_rate_approved = metrics["bad_rate_approved"]
profit_nt = metrics["profit_nt"]

missing = [c for c in REQUIRED if c not in card or not str(card[c]).strip()]
prohibited_use_ok = bool(str(card.get("prohibited_use", "")).strip())
all_required = len(missing) == 0 and prohibited_use_ok
n_fields = len(card)
card_json = json.dumps(card, indent=2, sort_keys=True)
print(card_json)
print(f"n_fields={n_fields}")
print(f"missing={missing}")
print(f"all_required={all_required}")
print(f"prohibited_use_ok={prohibited_use_ok}")
print(f"roc_auc_raw={metrics['roc_auc_raw']:.4f}")
print(f"roc_auc_cal={metrics['roc_auc_cal']:.4f}")
print(f"pr_auc_cal={metrics['pr_auc_cal']:.4f}")
print(f"approval_rate={metrics['approval_rate']:.4f}")
print(f"bad_rate_approved={metrics['bad_rate_approved']:.4f}")
print(f"profit_nt={metrics['profit_nt']}")`,
        lockLines: 31,
        solution: `# Bangun model card flagship sebagai JSON + validasi kolom wajib G10 [M7.4]
# Kolom yang bukan hasil hitung diisi [ilustrasi] — JANGAN dikarang seolah angka nyata
import json

REQUIRED = ["model_version", "feature_schema_version", "calibration_version",
            "threshold_policy_version", "data_snapshot", "code_notebook_hash",
            "approval_date", "owner", "rollback_version", "change_reason",
            "intended_users", "decision_context", "affected_population",
            "approved_use", "prohibited_use", "human_review_required", "out_of_scope_trigger"]

card = {
    "model_version": "gbm-calibrated-v1 (HistGradientBoostingClassifier, random_state=42)",
    "feature_schema_version": "flagship-v1 (31 fitur: 23 mentah + 8 turunan)",
    "calibration_version": "Platt/sigmoid, CalibratedClassifierCV cv=3",
    "threshold_policy_version": "v1 threshold tunggal 0,10 [M6.4]",
    "data_snapshot": "UCI Default of Credit Card Clients, 30.000 baris, split stratified seed 42 (train 24.000, test 6.000)",
    "code_notebook_hash": "[ilustrasi] <hash commit>",
    "approval_date": "[ilustrasi] 2026-11-13",
    "owner": "[ilustrasi] Model Owner (bisnis)",
    "rollback_version": "tidak ada versi model sebelumnya — v1 versi produksi pertama; rollback plan: kembali ke keputusan manual [ilustrasi]",
    "change_reason": "versi produksi pertama model flagship [M6.4]",
    "intended_users": "Analis kredit + komite risiko [ilustrasi] — bukan nasabah langsung",
    "decision_context": "Persetujuan pengajuan kartu kredit baru, threshold v1 0,10 [M6.4]",
    "affected_population": "Nasabah pengaju kartu kredit baru (populasi UCI Taiwan 2005) — bukan nasabah eksisting",
    "approved_use": "Menyetujui/menolak pengajuan kartu kredit baru pada threshold v1 0,10",
    "prohibited_use": "DILARANG: menentukan limit kredit; menaikkan limit eksisting; memakai di luar populasi pengaju baru; memakai untuk penawaran produk lain",
    "human_review_required": "Ya — banding nasabah yang ditolak + kasus skor di dekat threshold [kebijakan lesson ini]",
    "out_of_scope_trigger": "Populasi bergeser dari UCI / model dipakai untuk produk lain — kartu ini tidak berlaku; revalidasi + kartu baru",
}

metrics = {
    "roc_auc_raw": 0.7823,
    "roc_auc_cal": 0.7816,
    "pr_auc_cal": 0.5558,
    "approval_rate": 0.285,
    "bad_rate_approved": 0.0667,
    "profit_nt": 8214000,
}
# Nama top-level untuk checks (nilai sama dengan metrics)
roc_auc_raw = metrics["roc_auc_raw"]
roc_auc_cal = metrics["roc_auc_cal"]
pr_auc_cal = metrics["pr_auc_cal"]
approval_rate = metrics["approval_rate"]
bad_rate_approved = metrics["bad_rate_approved"]
profit_nt = metrics["profit_nt"]

missing = [c for c in REQUIRED if c not in card or not str(card[c]).strip()]
prohibited_use_ok = bool(str(card.get("prohibited_use", "")).strip())
all_required = len(missing) == 0 and prohibited_use_ok
n_fields = len(card)
card_json = json.dumps(card, indent=2, sort_keys=True)
print(card_json)
print(f"n_fields={n_fields}")
print(f"missing={missing}")
print(f"all_required={all_required}")
print(f"prohibited_use_ok={prohibited_use_ok}")
print(f"roc_auc_raw={metrics['roc_auc_raw']:.4f}")
print(f"roc_auc_cal={metrics['roc_auc_cal']:.4f}")
print(f"pr_auc_cal={metrics['pr_auc_cal']:.4f}")
print(f"approval_rate={metrics['approval_rate']:.4f}")
print(f"bad_rate_approved={metrics['bad_rate_approved']:.4f}")
print(f"profit_nt={metrics['profit_nt']}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_fields", value: 17, tol: 0.5, label: "`n_fields` seharusnya 17", msg: "Kartu punya tepat 17 kolom wajib — 10 G10 + 7 penggunaan — tidak kurang, tidak lebih." },
          { kind: "stdout_matches", task: "t4", pattern: "prohibited_use_ok=True", label: "Output menampilkan prohibited_use_ok=True", msg: "Hard rule G6: prohibited_use tidak kosong — kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya." },
          { kind: "stdout_matches", task: "t1", pattern: "all_required=True", label: "Output menampilkan all_required=True", msg: "Semua 10 kolom wajib ada dan tidak kosong — kartu lolos validasi kelengkapan." },
          { kind: "stdout_matches", task: "t1", pattern: "threshold_policy_version", label: "Output menampilkan threshold_policy_version", msg: "Kolom threshold policy version ada di JSON kartu — v1 threshold tunggal 0,10 [M6.4]." },
          { kind: "equal", task: "t2", name: "roc_auc_raw", value: 0.7823, tol: 0.00005, label: "`roc_auc_raw` seharusnya 0.7823", msg: "ROC-AUC GBM mentah 0,7823 — angka seed 42, kanonis M8." },
          { kind: "equal", task: "t2", name: "approval_rate", value: 0.285, tol: 0.0005, label: "`approval_rate` seharusnya 0.285", msg: "Approval 28,5% pada threshold 0,10 [M6.4] — 1.710 dari 6.000 nasabah test." },
          { kind: "equal", task: "t3", name: "profit_nt", value: 8214000, tol: 0.5, label: "`profit_nt` seharusnya 8214000", msg: "Profit +NT$8.214.000 [M6.4] — tulis tanpa pemisah ribuan." },
        ],
      },
    },
    {
      id: "lab3",
      eyebrow: "Langkah 13 · Lab 3",
      title: "Lab: lifecycle linkage — deteksi mismatch sebagai governance failure",
      prose: [
        "Lab ketiga memeriksa lifecycle linkage end-to-end (langkah 8a): enam artefak, enam field ID. Lima artefak menulis model_version «gbm-calibrated-v1» — kartu, validation report, tiering record, deployment record, revalidation report. Satu artefak — monitoring_config — menulis «gbm-calibrated-v2» [ilustrasi]. Tugasmu: hitung berapa pasangan (artefak, field) yang cocok dengan kartu, daftarkan mismatch-nya, dan putuskan apakah ini governance failure. Lalu skenario perbaikan: betulkan monitoring_config ke v1 dan hitung ulang — mismatch harus menjadi 0.",
        "Hasil yang diharapkan [lab]: n_artifacts=6; n_fields_checked=6; n_consistent=35; mismatches=['monitoring_config.model_version: gbm-calibrated-v1 vs gbm-calibrated-v2']; governance_failure=True; n_mismatches_fixed=0; governance_failure_fixed=False. Dari 36 pasangan (6 artefak × 6 field), 35 cocok dan 1 tidak — dan SATU mismatch itu sudah cukup: governance_failure=True. Itulah sifat linkage: ia bukan skor (35/36 = 97% bukan «hampir lolos») — ia gerbang biner. Satu ID yang tidak cocok berarti satu artefak menceritakan model yang berbeda, dan deployment dibekukan sampai ID-nya dicocokkan.",
        "Setelah lab jalan, tanyakan pada dirimu: siapa yang seharusnya menangkap mismatch ini SEBELUM lab — pipeline deploy (M8.4) yang menulis ID otomatis, atau revalidasi (M8.5) yang memeriksa linkage tiap kali? Jawabannya: keduanya — deploy menolak deployment yang ID-nya tidak cocok dengan kartu, dan revalidasi memeriksa linkage sebagai gerbang pertama. Lab ini adalah latihan untuk keduanya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi n_artifacts, n_fields_checked, n_consistent, dan mismatches dari perbandingan tiap artefak dengan kartu" },
        { id: "t2", text: "Lengkapi governance_failure: True bila mismatches tidak kosong" },
        { id: "t3", text: "Lengkapi n_mismatches_fixed dan governance_failure_fixed setelah monitoring_config dibetulkan ke v1" },
      ],
      expected: "n_artifacts=6\nn_fields_checked=6\nn_consistent=35\nmismatches=['monitoring_config.model_version: gbm-calibrated-v1 vs gbm-calibrated-v2']\ngovernance_failure=True\nn_mismatches_fixed=0\ngovernance_failure_fixed=False",
      hints: [
        "n_consistent = pasangan (artefak, field) yang nilainya SAMA dengan kartu — hitung dengan sum() atas semua artefak × FIELDS, membandingkan a.get(f) == card.get(f). Kartu itu sendiri menyumbang 6.",
        "mismatches = daftar string 'artefak.field: nilai-kartu vs nilai-artefak' untuk tiap pasangan yang beda — hanya ada satu: monitoring_config.model_version.",
        "governance_failure = len(mismatches) > 0 — bukan skor, melainkan gerbang biner: satu mismatch saja sudah cukup. Skenario perbaikan: fixed sudah dibetulkan ke v1, hitung mismatch yang tersisa dengan cara yang sama.",
      ],
      code: {
        starter: `# Lab 3 — lifecycle linkage: satu ID yang sama di semua artefak (langkah 8a)
# Enam artefak, enam field ID. Satu mismatch [ilustrasi] disisipkan di
# monitoring_config: model_version "gbm-calibrated-v2" padahal kartu v1.
FIELDS = ["model_id", "model_version", "feature_schema_version",
          "calibration_version", "threshold_policy_version", "deployment_id"]

artifacts = {
    "model_card": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "validation_report": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "tiering_record": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "deployment_record": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "monitoring_config": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v2", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "revalidation_report": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
}

card = artifacts["model_card"]
n_artifacts = 0  # TODO: len(artifacts)
n_fields_checked = 0  # TODO: len(FIELDS)
n_consistent = 0  # TODO: pasangan (artefak, field) yang nilainya SAMA dengan kartu
mismatches = []  # TODO: "artefak.field: nilai-kartu vs nilai-artefak" untuk tiap yang beda
governance_failure = False  # TODO: True bila mismatches tidak kosong
# Skenario: perbaiki monitoring_config ke v1, hitung ulang
fixed = {k: dict(v) for k, v in artifacts.items()}
fixed["monitoring_config"]["model_version"] = "gbm-calibrated-v1"
n_mismatches_fixed = 0  # TODO: mismatch tersisa setelah perbaikan
governance_failure_fixed = True  # TODO: False bila n_mismatches_fixed == 0
print(f"n_artifacts={n_artifacts}")
print(f"n_fields_checked={n_fields_checked}")
print(f"n_consistent={n_consistent}")
print(f"mismatches={mismatches}")
print(f"governance_failure={governance_failure}")
print(f"n_mismatches_fixed={n_mismatches_fixed}")
print(f"governance_failure_fixed={governance_failure_fixed}")`,
        lockLines: 15,
        solution: `# Lab 3 — lifecycle linkage: satu ID yang sama di semua artefak (langkah 8a)
# Enam artefak, enam field ID. Satu mismatch [ilustrasi] disisipkan di
# monitoring_config: model_version "gbm-calibrated-v2" padahal kartu v1.
FIELDS = ["model_id", "model_version", "feature_schema_version",
          "calibration_version", "threshold_policy_version", "deployment_id"]

artifacts = {
    "model_card": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "validation_report": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "tiering_record": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "deployment_record": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "monitoring_config": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v2", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
    "revalidation_report": {"model_id": "credit-scorecard-flagship", "model_version": "gbm-calibrated-v1", "feature_schema_version": "flagship-v1", "calibration_version": "platt-cv3", "threshold_policy_version": "threshold-v1", "deployment_id": "deploy-2026-11-13"},
}

card = artifacts["model_card"]
n_artifacts = len(artifacts)
n_fields_checked = len(FIELDS)
n_consistent = sum(1 for a in artifacts.values() for f in FIELDS if a.get(f) == card.get(f))
mismatches = [f"{name}.{f}: {card.get(f)} vs {a.get(f)}" for name, a in artifacts.items() for f in FIELDS if a.get(f) != card.get(f)]
governance_failure = len(mismatches) > 0
# Skenario: perbaiki monitoring_config ke v1, hitung ulang
fixed = {k: dict(v) for k, v in artifacts.items()}
fixed["monitoring_config"]["model_version"] = "gbm-calibrated-v1"
n_mismatches_fixed = sum(1 for a in fixed.values() for f in FIELDS if a.get(f) != card.get(f))
governance_failure_fixed = n_mismatches_fixed > 0
print(f"n_artifacts={n_artifacts}")
print(f"n_fields_checked={n_fields_checked}")
print(f"n_consistent={n_consistent}")
print(f"mismatches={mismatches}")
print(f"governance_failure={governance_failure}")
print(f"n_mismatches_fixed={n_mismatches_fixed}")
print(f"governance_failure_fixed={governance_failure_fixed}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_artifacts", value: 6, tol: 0.5, label: "`n_artifacts` seharusnya 6", msg: "Enam artefak satu lifecycle: kartu, validation report, tiering record, deployment record, monitoring, revalidation." },
          { kind: "equal", task: "t1", name: "n_consistent", value: 35, tol: 0.5, label: "`n_consistent` seharusnya 35", msg: "Dari 36 pasangan (6 artefak × 6 field), 35 cocok dengan kartu — hanya satu yang tidak: monitoring_config.model_version." },
          { kind: "stdout_matches", task: "t1", pattern: "monitoring_config.model_version: gbm-calibrated-v1 vs gbm-calibrated-v2", label: "Output menampilkan mismatch monitoring_config.model_version", msg: "Satu-satunya mismatch: monitoring membaca v2 sementara kartu, validasi, tiering, deployment, dan revalidasi semuanya v1." },
          { kind: "stdout_matches", task: "t2", pattern: "governance_failure=True", label: "Output menampilkan governance_failure=True", msg: "Satu mismatch saja sudah cukup — linkage adalah gerbang biner, bukan skor: 35/36 bukan «hampir lolos». Model yang dimonitor bukan model yang divalidasi." },
          { kind: "equal", task: "t3", name: "n_mismatches_fixed", value: 0, tol: 0.5, label: "`n_mismatches_fixed` seharusnya 0", msg: "Setelah monitoring_config dibetulkan ke v1, tidak ada mismatch tersisa — keenam artefak kembali menceritakan model yang sama." },
          { kind: "stdout_matches", task: "t3", pattern: "governance_failure_fixed=False", label: "Output menampilkan governance_failure_fixed=False", msg: "Perbaikan yang benar adalah mencocokkan artefak dengan kartu — bukan mengubah kartu agar cocok dengan yang berjalan." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: kartu yang lengkap, angka yang bisa diulang, jejak yang bisa diaudit",
      prose: [
        "Rangkuman: model card adalah catatan bukti — bukan brosur: ia memuat angka baik (ROC-AUC mentah 0,7823) DAN angka yang tidak baik (AIR SEX GBM terkalibrasi 0,8694 [M7.1], gap train-test 0,0646). Sepuluh kolom wajib G10 [M7.4]: model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, alasan perubahan — satu kolom hilang berarti paket tidak bisa diverifikasi. Reproducibility = orang lain + data sama + kode sama = angka sama, diuji |ROC-AUC replikasi − ROC-AUC dilaporkan| ≤ 0,001 (flagship: |0,7823 − 0,7823| = 0). Seed sensitivity [kanonis M8]: ROC-AUC mentah lintas seed 42–46 = 0,7823 / 0,7807 / 0,7782 / 0,7754 / 0,7770 — spread 0,0069, mean 0,7787, sd (ddof=1) 0,0028; terkalibrasi spread 0,0030; approval spread 0,63 poin persen — «0,7823» adalah satu pengukuran di dalam pita, bukan nilai sejati. Data snapshot: UCI 30.000 baris, base rate 0,2212, split stratified seed 42 (train 24.000, test 6.000), 31 fitur (23 mentah + 8 turunan) — snapshot dibekukan, lengkap dengan definisi fitur turunan, dan terukur (PSI train-vs-test tertinggi AGE 0,0029 [m75_psi_features_train_vs_test.AGE.psi]). Versioning [keputusan kebijakan lesson ini]: major = model/threshold berubah, minor = kalibrasi/skema berubah, patch = dokumentasi saja; v2 threshold per grup 0,1058/0,0965 [M7.4] rollback ke v1 threshold tunggal 0,10. Limitations: satu snapshot tanpa deret waktu [M7.5]; AIR EDUCATION terendah 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max]; penjelasan bukan kausal [M7.3]; label butuh jendela 1 bulan [M7.5]; populasi latih Taiwan 2005. Audit trail: tanggal, keputusan, pemicu, angka sebelum-sesudah, penyetuju — dipasangkan dengan change control enam gerbang [M7.4]. Jebakan: dokumentasi sesudah deploy berarti dokumentasi tidak pernah — kartu ditulis SEBELUM deploy, sebagai gerbang, dan dihasilkan dari kode. Mini-case flagship: metrik lengkap (terkalibrasi 0,7816 / 0,5558, ECE 0,0087 [M6.4], Brier 0,1345, approval 28,5%, bad rate 6,67%, profit +NT$8.214.000 [M6.4]) dengan kolom non-hitung dilabeli [ilustrasi]. Lab: spread mentah 0,0069, mean 0,7787, sd 0,0028, spread terkalibrasi 0,0030, approval spread 0,63 poin persen; kartu JSON 17 kolom (10 G10 + 7 penggunaan), missing kosong, all_required=True, prohibited_use_ok=True. Lifecycle linkage: enam artefak (kartu, validation report, tiering record, deployment record, monitoring, revalidation) memakai model_id + model_version yang SAMA — lab 3 mendeteksi satu mismatch [ilustrasi] di monitoring_config (v2 vs v1) sebagai governance failure: model yang dimonitor bukan model yang divalidasi.",
        "Guided task di Colab — notebook mlf-m83-guided-task.ipynb mereplikasi flagship GBM + kalibrasi Platt, menghitung seed sensitivity lintas seed 42–46, membangun model-card JSON flagship dan memvalidasi 10 kolom wajibnya, lalu menguji apa yang terjadi bila satu kolom dihapus — semuanya dengan checks. Tautan Colab: https://colab.research.google.com/drive/1ohuSzlFkpi8OI5YUcfHYm_clOxxUAm9_",
        "Yang tersisa adalah kebiasaan: sebelum model apa pun live, buka kartunya — bila satu kolom kosong, modelnya belum siap. Angka yang tidak bisa dibuktikan adalah klaim; kartu yang lengkap adalah bukti.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Manakah yang BUKAN satu dari sepuluh kolom wajib template G10 [M7.4]?",
          options: [
            { text: "Model version — model apa, algoritma apa, seed berapa", why: "Salah: ini kolom (1) — kolom wajib. Tanpa ini tidak jelas model mana yang dimaksud kartu itu." },
            { text: "Data snapshot — data apa, berapa baris, split bagaimana", why: "Salah: ini kolom (5) — kolom wajib. Tanpa ini angka 0,7823 tidak bisa direproduksi." },
            { text: "Rollback version — versi apa yang berlaku bila versi ini dicabut", why: "Salah: ini kolom (9) — kolom wajib. Tanpa ini perubahan tidak bisa dibatalkan." },
            { text: "Skor kepuasan pengguna terhadap model", why: "Benar: ini BUKAN kolom G10. Sepuluh kolomnya adalah model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, dan alasan perubahan — kepuasan pengguna tidak ada di antaranya.", correct: true },
          ],
        },
        {
          q: "Tim lain menjalankan kode dan datamu dan mendapat ROC-AUC GBM mentah 0,7823 — sama persis dengan yang kamu laporkan. Apa artinya?",
          options: [
            { text: "Modelmu akurat — 0,7823 membuktikan model ini bagus", why: "Salah: reproducibility membuktikan ANGKAnya bisa diulang, bukan modelnya akurat. Akurasi dibuktikan metrik test; kebenaran keputusan dibuktikan analisis biaya [M6.4] dan audit fairness [M7.1]." },
            { text: "Modelmu reproducible — definisi terpenuhi: orang lain + data sama + kode sama = angka sama (selisih 0 ≤ 0,001)", why: "Benar: selisih replikasi vs laporan = 0, di bawah toleransi 0,001 lesson ini. Itulah definisi reproducibility — dan ia tidak berkata apa-apa tentang apakah modelnya benar.", correct: true },
            { text: "Seed tidak penting — seed berapa pun hasilnya sama", why: "Salah: hasil replikasi yang sama justru MEMBUKTIKAN seed-nya sama (42). Seed yang berbeda memberi hasil berbeda — lintas seed 42–46, ROC-AUC mentah berayun 0,7754–0,7823." },
            { text: "Data snapshot tidak perlu — yang penting kodenya sama", why: "Salah: definisi reproducibility mensyaratkan DATA YANG SAMA juga. Kode sama di atas data yang berbeda (label dikoreksi, definisi kolom berubah) bisa memberi angka berbeda." },
          ],
        },
        {
          q: "Spread ROC-AUC mentah lintas seed 42–46 adalah 0,0069 dan simpangan bakunya (ddof=1) 0,0028. Bacaan yang benar?",
          options: [
            { text: "Seed 45 (0,7754) membuktikan model rusak — angkanya jatuh dari 0,7823", why: "Salah: 0,7754 adalah ujung bawah pita seed yang sama — model yang sama, seed yang berbeda. Penurunan 0,0069 dari seed 42 adalah noise latih, bukan kerusakan." },
            { text: "«0,7823» adalah satu pengukuran di dalam pita selebar 0,0069 — angka yang stabil dan jujur bila pitanya ditulis di sampingnya", why: "Benar: mean 0,7787, sd 0,0028 — satu seed yang beruntung/sial menggeser angka sekitar ±0,003. Kartu yang jujur menulis nilai (0,7823) BESERTA spread (0,0069) dan sd (0,0028).", correct: true },
            { text: "Simpangan baku 0,0028 berarti model tidak reproducible", why: "Salah: sebaliknya — sd 0,0028 yang KECIL adalah bukti model stabil lintas seed. Model yang tidak reproducible punya spread besar (misalnya 0,05), bukan 0,0069." },
            { text: "Spread 0,0069 lebih besar dari ambang alert monitoring 0,02 [kebijakan M7.5]", why: "Salah hitung: 0,0069 LEBIH KECIL dari 0,02 [kebijakan M7.5] — sekitar sepertiganya. Noise seed tidak pernah menyalakan alert monitoring." },
          ],
        },
        {
          q: "Model card-mu tidak mencantumkan data snapshot — hanya tertulis «data UCI». Apa yang hilang?",
          options: [
            { text: "Tidak ada — «data UCI» sudah cukup, semua orang tahu datasetnya", why: "Salah: «data UCI» tidak menjawab berapa baris, split bagaimana, seed berapa, dan skema fitur apa. Nama dataset bukan snapshot." },
            { text: "Tidak ada yang bisa membuktikan data mana yang menghasilkan 0,7823 — angka itu menjadi klaim tanpa bukti, dan replikasi tidak bisa diperiksa", why: "Benar: tanpa snapshot (30.000 baris, base rate 0,2212, split stratified seed 42, 31 fitur), «data yang sama» tidak bisa diperiksa — hash, jumlah baris, dan definisi fitur tidak ada yang bisa dibandingkan.", correct: true },
            { text: "Model tidak bisa dilatih ulang sama sekali", why: "Salah: model tetap BISA dilatih ulang — masalahnya hasilnya belum tentu sama, dan tidak ada yang bisa membuktikan apakah data yang dipakai ulang adalah data yang sama." },
            { text: "ROC-AUC otomatis berubah menjadi 0", why: "Salah: angka di kartu tidak berubah hanya karena snapshot tidak ditulis — yang hilang adalah KEMAMPUAN MEMBUKTIKANNYA, bukan angkanya." },
          ],
        },
        {
          q: "v2 threshold per grup 0,1058/0,0965 [M7.4] gagal di produksi. Apa yang dilakukan, menurut model card-nya?",
          options: [
            { text: "Latih ulang dari nol dengan seed baru dan laporkan angka yang baru", why: "Salah: latih ulang dari nol adalah versi BARU yang butuh kartu dan persetujuan baru — bukan rollback. Rollback memakai versi yang SUDAH terbukti." },
            { text: "Rollback ke v1 — threshold tunggal 0,10 — karena kolom rollback version di kartu v2 menunjuk ke sana", why: "Benar: itulah fungsi kolom (9): v2 dicabut, v1 berlaku kembali. Rollback criteria-nya sudah ditulis sebelum produksi (AIR SEX di bawah 0,80 dua periode, ECE di atas 0,02 bertahan, atau review hukum menolak).", correct: true },
            { text: "Hapus model card v2 supaya tidak ada yang tahu v2 pernah ada", why: "Salah: menghapus kartu adalah menghapus jejak audit — v2 yang gagal justru HARUS tercatat, lengkap dengan alasan pencabutannya, supaya kesalahan yang sama tidak diulang." },
            { text: "Tunggu sampai drift hilang sendiri, lalu v2 dipakai lagi", why: "Salah: menunggu tanpa aksi bukan rollback — dan v2 yang gagal tidak boleh dipakai lagi tanpa kartu baru, validasi baru, dan persetujuan baru." },
          ],
        },
        {
          q: "Manakah batasan yang WAJIB ditulis di model card flagship?",
          options: [
            { text: "Model tidak pernah salah pada nasabah dengan PAY_MAX tinggi", why: "Salah: ini klaim yang salah — PAY_MAX tinggi justru paling banyak dipakai model untuk memutuskan (mean |SHAP| PAY_MAX 0,4946 [m73_shap_gbm.global_mean_abs_shap_top12[0]] — atribusi terbesar, bukan bukti kausal dan bukan korelasi), dan «tidak pernah salah» adalah frasa absolut yang tidak bisa dibuktikan." },
            { text: "Model card tidak perlu batasan bila ROC-AUC di atas 0,78", why: "Salah: ROC-AUC tinggi tidak menghapus batasan — model dengan ROC-AUC 0,7823 tetap punya AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max] dan tetap dilatih pada satu snapshot tanpa deret waktu [M7.5]." },
            { text: "Data satu snapshot tanpa deret waktu [M7.5] — model tidak memahami tren waktu — dan AIR EDUCATION serendah 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max], jadi model tidak adil merata antar grup pendidikan", why: "Benar: kedua batasan ini punya ANGKA dan SUMBER — snapshot tanpa tanggal [M7.5] dan AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max]. Batasan yang baik ditulis dengan angka, grup yang disebut, dan konsekuensinya.", correct: true },
            { text: "AIR EDUCATION 0,3572 berarti model adil untuk semua grup", why: "Salah: 0,3572 JAUH di bawah ambang 0,80 (aturan four-fifths) — itu bukti model TIDAK adil merata antar grup pendidikan (SMA vs Lainnya). Membaca angka itu sebagai «adil» adalah membaca terbalik." },
          ],
        },
        {
          q: "Auditor bertanya: siapa yang menyetujui threshold 0,10, dan kapan? Di mana jawaban yang benar berada?",
          options: [
            { text: "Diingat-ingat oleh tim — siapa pun yang paling lama di tim pasti tahu", why: "Salah: ingatan bukan bukti — dua tahun kemudian, tidak ada yang ingat dengan pasti, dan «katanya sudah disetujui» bukan jawaban audit." },
            { text: "Di slide presentasi peluncuran model", why: "Salah: slide adalah brosur — ia memuat angka baiknya (0,7823) tanpa penyetuju, tanpa tanggal, dan tanpa versi. Slide bukan artefak audit." },
            { text: "Di audit trail dan kolom approval date + owner pada model card — tanggal, nama penyetuju, dan angka yang disetujui tercatat bersama versi modelnya", why: "Benar: itulah fungsi kolom (7) dan (8) G10 plus audit trail — siapa, kapan, mengapa, dan angka apa yang berubah, tercatat bersama versi modelnya dan bisa dibuka saat audit.", correct: true },
            { text: "Di nama file model — misalnya model_final_disetujui.ipynb", why: "Salah: nama file bukan versi dan bukan bukti persetujuan — ia tidak terikat pada tanggal, nama penyetuju, atau angka yang disetujui." },
          ],
        },
        {
          q: "Di mini-case flagship, kolom mana yang diisi [ilustrasi] — dan mengapa?",
          options: [
            { text: "ROC-AUC 0,7823 — karena itu hanya ilustrasi, bukan angka nyata", why: "Salah: 0,7823 adalah angka kanonis M8 — dihitung dari data, direplikasi notebook (check 2), dan cocok dalam 0,001. Bukan ilustrasi." },
            { text: "Approval 28,5% — karena itu hanya perkiraan", why: "Salah: 28,5% adalah hasil hitung [M6.4] — 1.710 dari 6.000 nasabah test pada threshold 0,10. Bukan perkiraan." },
            { text: "Approval date, owner, dan code/notebook hash — karena itu bukan hasil hitung dari data, melainkan keputusan dan artefak organisasi yang belum ditetapkan di lesson ini", why: "Benar: tanggal persetujuan, nama penanggung jawab, dan hash commit tidak bisa dihitung dari dataset UCI — ketiganya harus diisi dari proses organisasi yang nyata sebelum deploy, dan sampai saat itu dilabeli [ilustrasi] dengan jujur.", correct: true },
            { text: "Semua kolom diisi [ilustrasi] — kartu ini hanya contoh", why: "Salah: hanya kolom non-hitung yang [ilustrasi]. Semua angka hitung — ROC-AUC, approval, bad rate, profit, spread seed — adalah angka kanonis yang bisa diverifikasi dari notebook." },
          ],
        },
        {
          q: "Model card flagship tidak menulis prohibited_use — kolomnya kosong. Apa konsekuensinya menurut lesson ini?",
          options: [
            { text: "Tidak apa-apa — prohibited_use hanya dokumentasi tambahan, bukan kolom wajib", why: "Salah: prohibited_use adalah kolom (15) dari 17 kolom wajib — satu dari tujuh kolom penggunaan. Kartu tanpa kolom penggunaan bukan kartu yang lengkap." },
            { text: "Cukup isi approved_use — dari yang diizinkan, yang dilarang sudah jelas dengan sendirinya", why: "Salah: yang tidak ditulis sebagai dilarang akan dianggap diizinkan — itulah sebabnya larangan harus ditulis eksplisit. «Disetujui untuk pengajuan baru» tidak dengan sendirinya melarang «dipakai untuk kenaikan limit»." },
            { text: "Lab GAGAL: kartu dengan penggunaan-terlarang kosong tidak lolos validasi — kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya; model itu tidak boleh deploy sampai kolomnya diisi", why: "Benar: aturan keras lab 2 — prohibited_use_ok harus True. Kelengkapan tanpa batas penggunaan adalah kartu yang belum selesai ditulis.", correct: true },
            { text: "Isi dengan «tidak ada yang dilarang» supaya lolos validasi", why: "Salah: itu berbohong — dan validasi mesin tidak menangkap kebohongan, hanya ketidaklengkapan. Klaim «tidak ada yang dilarang» untuk model kredit adalah kartu yang tidak dipikirkan: selalu ada penggunaan yang dilarang, minimal «memakai di luar populasi yang divalidasi»." },
          ],
        },
        {
          q: "Monitoring config membaca model_version «gbm-calibrated-v2» sementara model card, validation report, tiering record, dan deployment record semuanya «gbm-calibrated-v1». Apa vonisnya?",
          options: [
            { text: "Data error kecil — monitoring hanya salah ketik, modelnya tetap v1", why: "Salah: mismatch ID tidak boleh diasumsikan salah ketik — yang berjalan bisa jadi benar-benar v2 yang naik tanpa kartu, tanpa validasi, dan tanpa persetujuan. Asumsi «salah ketik» adalah cara tercepat melewatkan governance failure." },
            { text: "Bukan masalah — v2 pasti lebih baru dan lebih baik dari v1", why: "Salah: «lebih baru» bukan «tervalidasi». v2 yang tidak punya kartu dan validasi adalah model yang tidak dikenal — berapa pun angkanya, ia tidak boleh memutuskan." },
            { text: "Cukup perbarui kartu menjadi v2 supaya cocok dengan yang berjalan", why: "Salah: mengubah kartu agar cocok dengan yang berjalan adalah memalsukan jejak audit — kartu ditulis dari validasi, bukan dari yang kebetulan berjalan. Yang benar adalah menghentikan deployment yang tidak cocok dan menyelidiki." },
            { text: "Governance failure: model yang dimonitor bukan model yang divalidasi — keputusan sedang diambil oleh versi yang tidak punya kartu, validasi, dan persetujuan; deployment dibekukan sampai ID-nya dicocokkan", why: "Benar: linkage adalah gerbang biner — satu ID yang tidak cocok berarti satu artefak menceritakan model yang berbeda. Vonisnya: bekukan deployment, selidiki versi mana yang benar-benar berjalan, siapa yang menaikkannya, dan atas persetujuan apa.", correct: true },
          ],
        },
      ],
      summary: [
        "Model card adalah catatan bukti — bukan brosur: ia memuat angka baik (ROC-AUC mentah 0,7823) DAN angka yang tidak baik (AIR SEX GBM terkalibrasi 0,8694 [M7.1], gap train-test 0,0646).",
        "Sepuluh kolom wajib G10 [M7.4]: model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, alasan perubahan — satu kolom hilang berarti paket tidak bisa diverifikasi.",
        "Tujuh kolom penggunaan melengkapi G10 (total 17 kolom wajib): intended_users, decision_context, affected_population, approved_use, prohibited_use, human_review_required, out_of_scope_trigger — kartu tanpa prohibited_use GAGAL validasi (hard rule lab 2): kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya.",
        "Lifecycle linkage: model_id, model_version, feature_schema_version, calibration_version, threshold_policy_version, deployment_id IDENTIK di keenam artefak (kartu, validation report, tiering record, deployment record, monitoring, revalidation) — mismatch = governance failure, bukan data error; deployment dibekukan sampai ID dicocokkan.",
        "Reproducibility = orang lain + data sama + kode sama = angka sama, diuji |ROC-AUC replikasi − ROC-AUC dilaporkan| ≤ 0,001 (flagship: |0,7823 − 0,7823| = 0).",
        "Seed sensitivity [kanonis M8]: ROC-AUC mentah lintas seed 42–46 = 0,7823 / 0,7807 / 0,7782 / 0,7754 / 0,7770 — spread 0,0069, mean 0,7787, sd (ddof=1) 0,0028; terkalibrasi spread 0,0030; approval spread 0,63 poin persen.",
        "Data snapshot: UCI 30.000 baris, base rate 0,2212, split stratified seed 42 (train 24.000, test 6.000), 31 fitur (23 mentah + 8 turunan) — dibekukan, lengkap dengan definisi fitur turunan, dan terukur (PSI train-vs-test tertinggi AGE 0,0029 [m75_psi_features_train_vs_test.AGE.psi]).",
        "Versioning [keputusan kebijakan lesson ini]: major = model/threshold berubah, minor = kalibrasi/skema berubah, patch = dokumentasi saja; v2 threshold per grup 0,1058/0,0965 [M7.4] rollback ke v1 threshold tunggal 0,10.",
        "Limitations: satu snapshot tanpa deret waktu [M7.5]; AIR EDUCATION terendah 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max]; penjelasan bukan kausal [M7.3]; label butuh jendela 1 bulan [M7.5]; populasi latih Taiwan 2005.",
        "Audit trail: tanggal, keputusan, pemicu, angka sebelum-sesudah, penyetuju — dipasangkan dengan change control enam gerbang [M7.4].",
        "Jebakan: dokumentasi sesudah deploy berarti dokumentasi tidak pernah — kartu ditulis SEBELUM deploy, sebagai gerbang, dan dihasilkan dari kode.",
        "Mini-case flagship: metrik lengkap (terkalibrasi 0,7816 / 0,5558, ECE 0,0087 [M6.4], Brier 0,1345, approval 28,5%, bad rate 6,67%, profit +NT$8.214.000 [M6.4]) dengan kolom non-hitung dilabeli [ilustrasi].",
        "Lab: spread mentah 0,0069, mean 0,7787, sd 0,0028, spread terkalibrasi 0,0030, approval spread 0,63 poin persen; kartu JSON 17 kolom (10 G10 + 7 penggunaan), missing kosong, all_required=True, prohibited_use_ok=True; lab 3: 35/36 pasangan ID cocok, 1 mismatch (monitoring_config v2 vs v1) = governance failure.",
      ],
      next: { label: "Lanjut: MLF-M8.4 — Deployment: Shadow / Canary / Champion-Challenger", href: "/v2/learn/mlf-m84-deployment-shadow-canary-champion" },
    },
  ],
};

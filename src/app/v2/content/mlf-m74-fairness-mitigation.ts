import type { V2Lesson } from "../lib/types";

export const mlfM74: V2Lesson = {
  slug: "mlf-m74-fairness-mitigation",
  track: "Machine Learning Finance",
  module: "Fairness, explainability & monitoring",
  title: "MLF-M7.4 — Mitigasi Fairness: Tiga Keluarga Obat untuk Model yang Tidak Adil",
  estMinutes: 80,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "AIR 0,869: ketika model yang akurat tetap tidak adil",
      prose: [
        "Bayangkan kamu manajer risiko. Model kreditmu punya ROC-AUC 0,7823 — ranking yang lumayan — dan threshold operasional 0,10 yang memaksimalkan laba (+NT$8.214.000 di test 6.000). Lalu audit fairness M7.1 datang: pada threshold yang sama, nasabah laki-laki disetujui 26,1% sementara nasabah perempuan disetujui 30,1%. Adverse-impact ratio (AIR) laki-laki 0,869 — di bawah ambang four-fifths rule 0,80? Belum — tapi cukup dekat untuk diselidiki, dan arahnya konsisten: satu kelompok sistematis lebih jarang disetujui daripada kelompok lain, dari SATU model yang sama.",
        "Konteks angka lesson ini [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05. Approval berarti probabilitas default prediksi DI BAWAH threshold. Audit M7.1–M7.3 menemukan: SEX — laki-laki approval 26,1% (n = 2.402), perempuan 30,1% (n = 3.598), AIR 0,869; EDUCATION — Pascasarjana AIR 0,603 (approval 35,3%) terhadap kelompok acuan «Lainnya» yang approval-nya 58,5% namun hanya n = 82 — TERTANDA flag, baca langkah 10 sebelum menindaklanjutinya; MARRIAGE — «Lainnya» AIR 0,656 (n = 68, kecil juga); AGE — kelompok 45+ AIR 0,700. Dan satu pengingat arah: audit scorecard M2.2 mengukur celah yang sama dari sisi berlawanan — AIR 1,1502 (perempuan/laki-laki), approval perempuan 0,3007 vs laki-laki 0,2614 — angka yang SAMA dengan 0,869 dibalik (1/0,8693 ≈ 1,150): selalu nyatakan arah AIR-mu, karena 0,869 dan 1,1502 adalah satu kesenjangan yang sama.",
        "Peta lesson: cerita AIR 0,869 → protokol validasi mitigasi (pilih di validation, laporkan di test yang belum tersentuh) → peta tiga keluarga mitigasi (pre-processing, in-processing, post-processing) → reweighing → resampling → hapus fitur sensitif dan kebocoran proxy → in-processing (reductions versi sederhana) → INTI: threshold per grup SEX, reproduksi mitigasi notebook flagship → biaya, profit, dan ROC-AUC/PR-AUC setelah mitigasi → kurva Pareto dari data → kapan mitigasi SALAH (kalibrasi rusak, legalitas, n kecil) → dokumentasi keputusan mitigasi → template tata kelola satu halaman (versi, snapshot, rollback) → 2 lab → checkpoint.",
        "Nilai: mitigasi bukan «membuat model adil» dalam arti abstrak — ia adalah mengubah SATU angka yang bisa diuji (AIR, selisih FPR, selisih FNR) dengan SATU intervensi yang bisa diulang, lalu melaporkan harganya (biaya, profit, ROC-AUC) dengan jujur. Lesson ini menghitung keempat keluarga angka itu untuk setiap mitigasi, pada data yang sama, supaya kamu bisa membandingkan apel dengan apel.",
        "Baik atau buruk: AIR 0,869 itu «buruk» sebagai sinyal — ia berada di bawah 1,0 dan mendekati ambang 0,80 — tapi «baik» sebagai diagnosis: ia terukur, bisa direproduksi, dan menunjuk ke satu keputusan konkret (threshold 0,10 yang sama untuk semua orang). Buruk bila dibaca sebagai «modelnya diskriminatif, buang saja»: audit M7.1 menunjukkan selisih FPR laki-laki vs perempuan hanya 0,0383 dan selisih FNR hanya 0,0191 — kesenjangan approval-nya nyata, tapi kemampuan model menangkap nasabah bermasalah (FNR) hampir setara antar kelompok.",
        "Mitigasi: jangan mulai dari obatnya — mulai dari diagnosisnya. Tiga keluarga mitigasi di lesson ini masing-masing bekerja di titik pipeline yang berbeda, dan masing-masing punya harga yang berbeda. Pilih berdasarkan DIAGNOSIS (langkah 3), bukan berdasarkan mana yang paling mudah dihitung.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: AIR di bawah 0,8 berarti model melanggar hukum",
        type: "pitfall",
        body: "Yang benar: four-fifths rule (AIR di bawah 0,80) adalah ATURAN PRAKTIS Amerika (EEOC) — lampu peringatan, bukan vonis hukum, dan bukan hukum Indonesia. AIR SEX 0,869 di sini bahkan masih DI ATAS 0,80. Yang ia katakan: «selidiki» — bukan «bersalah». Sebaliknya, AIR di atas 0,80 juga bukan bukti «sudah adil»: celah FPR/FNR dan bad rate antar kelompok tetap harus dibaca (langkah 10).",
      },
    },
    {
      id: "protokol-validasi",
      eyebrow: "Langkah 2 · Protokol validasi",
      title: "Protokol validasi mitigasi: pilih di validation, laporkan di test yang belum tersentuh",
      prose: [
        "Semua angka mitigasi di lesson ini — reweighing AIR 0,9567, resampling 0,9788, hapus fitur 0,9211, in-processing 0,9233, threshold per grup 0,9999, lima titik Pareto — dihitung pada test 6.000 yang SAMA. Itu bukan kecelakaan: satu test yang sama membuat kelima mitigasi bisa dibandingkan apel dengan apel (M7.1). Tapi ada harga yang harus dibayar untuk kenyamanan itu: begitu kamu MEMILIH mitigasi, target AIR, λ, atau threshold dengan melihat hasil di test yang sama, angka yang kamu laporkan bukan lagi estimasi yang jujur — ia estimasi yang sudah memilih dirinya sendiri sebagai yang terbaik. Seperti M7.1 dan M7.3 yang sudah melabelinya, angka-angka mitigasi lesson ini adalah HASIL ILUSTRASI PROTOKOL LESSON: mereka mengilustrasikan METODE — cara menghitung reweighing, cara kerja threshold per grup, bentuk kurva Pareto — bukan hasil final yang boleh dilaporkan ke komite sebagai «model kami mencapai AIR 0,9999».",
        "Nilai: protokol yang benar memakai TIGA bagian data, bukan dua. TRAIN (24.000): latih model, hitung bobot reweighing, pasang kalibrasi. VALIDATION / KALIBRASI: pilih keluarga mitigasi, pilih target AIR, pilih λ, pilih threshold per grup — SEMUA keputusan pemilihan terjadi di sini. TEST FINAL (6.000): belum tersentuh selama pemilihan — dipakai SEKALI untuk melaporkan hasil akhir. Inilah three-way split M6.4 (langkah 4) — lesson ini tidak mengajar ulang split-nya, hanya menerapkan aturannya ke mitigasi: data yang dipakai MEMILIH kebijakan harus berbeda dari data yang dipakai MELAPORKAN hasil kebijakan itu. Bila datanya sama, yang dilaporkan adalah skor terbaik dari sekian percobaan — dan skor terbaik dari sekian percobaan selalu terlihat lebih baik daripada kenyataannya (winner's curse, M6.5).",
        "Gambar: tiap keluarga menyentuh pipeline di titik yang berbeda — dan tiap titik punya «data pemilihan»-nya sendiri. Pre-processing (reweighing, resampling, hapus fitur) dihitung dari TRAIN — di lesson ini reweighing memang dihitung dari train 24.000, dan itu sudah benar. In-processing (constraint saat latih) dipilih dan ditala di VALIDATION. Post-processing (threshold per grup, λ Pareto) dipilih di VALIDATION, lalu dilaporkan di TEST. Yang SALAH di lesson ini — dan diakui terbuka sebagai ilustrasi — adalah λ dan threshold per grup dipilih sambil melihat test 6.000 yang sama: lima titik λ dievaluasi di test, lalu λ = 1 (AIR 0,9999, profit +NT$8.504.500) dilaporkan sebagai «titik terbaik». Titik itu memang terbaik DI TEST — tapi tanpa holdout yang belum tersentuh, kamu tidak tahu berapa yang tersisa bila diukur ulang.",
        "Baik atau buruk: tiga bagian data ini bagus karena ia membuat satu pertanyaan yang tajam — «angka ini dipilih di mana, dilaporkan di mana?» — dan jawaban yang jujur selalu bisa ditulis dalam satu baris. Buruk bila dibaca sebagai «jadi angka lesson ini tidak berguna»: angka ilustrasi tetap berguna untuk MEMBANDINGKAN metode (reweighing vs threshold per grup) dan untuk mempelajari BENTUK trade-off-nya (kurva Pareto yang menurun, biaya yang turun) — yang tidak boleh adalah membawanya ke komite sebagai estimasi final tanpa pengukuran ulang. Dan buruk bila protokol ini dibaca sebagai birokrasi: memisahkan validation dari test tidak butuh data baru — cukup potong test-mu menjadi dua SEBELUM memilih apa pun (M6.2, nested CV, adalah versi yang sama untuk tuning).",
        "Mitigasi: sebelum mitigasi apa pun masuk produksi, jawab TIGA pertanyaan ini secara tertulis — dan tulis jawabannya di samping angka hasilmu. (1) Threshold / λ / target AIR dipilih dari data apa? (2) Kalibrasi (Platt/sigmoid) dipasang pada data apa? (3) Metrik fairness yang dilaporkan (AIR, selisih FPR/FNR) dihitung pada data apa — dan apakah data itu sudah dipakai untuk satu dari dua pertanyaan sebelumnya? Bila jawaban (3) sama dengan jawaban (1) atau (2), angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON — beri label itu, dan ukur ulang pada holdout sebelum melaporkannya sebagai hasil final.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Alur data tiga bagian: train 24 ribu untuk latih dan pre-processing, validasi untuk memilih lambda dan threshold, test 6 ribu yang belum tersentuh untuk laporan final">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Pilih di VALIDASI — laporkan di TEST yang belum tersentuh</text>
<rect x="16" y="48" width="128" height="52" fill="var(--c1)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="176" y="48" width="128" height="52" fill="var(--c4)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="336" y="48" width="128" height="52" fill="var(--c2)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="146" y1="74" x2="174" y2="74" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="174,74 166,70 166,78" fill="var(--chart-text)"/>
<line x1="306" y1="74" x2="334" y2="74" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="334,74 326,70 326,78" fill="var(--chart-text)"/>
<text x="80" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TRAIN</text>
<text x="80" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">24.000 baris</text>
<text x="240" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">VALIDASI</text>
<text x="240" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">kalibrasi</text>
<text x="400" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TEST</text>
<text x="400" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">6.000, belum tersentuh</text>
<line x1="80" y1="100" x2="80" y2="122" stroke="var(--c1)" stroke-width="2"/>
<polygon points="80,130 75,120 85,120" fill="var(--c1)"/>
<text x="80" y="146" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PRE + IN</text>
<text x="80" y="160" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">reweighing, resampling,</text>
<text x="80" y="174" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">hapus fitur, constraint</text>
<line x1="240" y1="100" x2="240" y2="122" stroke="var(--c4)" stroke-width="2"/>
<polygon points="240,130 235,120 245,120" fill="var(--c4)"/>
<text x="240" y="146" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">POST: PILIH</text>
<text x="240" y="160" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">λ, threshold per grup,</text>
<text x="240" y="174" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">target AIR</text>
<line x1="400" y1="100" x2="400" y2="122" stroke="var(--c2)" stroke-width="2"/>
<polygon points="400,130 395,120 405,120" fill="var(--c2)"/>
<text x="400" y="146" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">LAPOR: SEKALI</text>
<text x="400" y="160" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">hasil final, tanpa</text>
<text x="400" y="174" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">pemilihan ulang</text>
<text x="240" y="206" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Yang dipilih di TEST bukan lagi estimasi yang jujur — ia skor terbaik dari sekian percobaan.</text>
<text x="240" y="222" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Di lesson ini λ dan threshold dipilih sambil melihat test — angka-angkanya ilustrasi, bukan evaluasi final.</text>
<text x="240" y="238" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Three-way split: M6.4 langkah 4. Winner's curse: M6.5.</text>
</svg>`,
        alt: "Alur data tiga bagian: train 24 ribu untuk latih dan pre-processing, validasi untuk memilih lambda dan threshold, test 6 ribu yang belum tersentuh untuk laporan final.",
        caption: "Cara membaca: panah mengalir dari train ke validasi ke test. Pre-processing dan in-processing dihitung/ditala di train; pemilihan λ, threshold per grup, dan target AIR terjadi di validasi; test yang belum tersentuh dipakai SEKALI untuk laporan final. Di lesson ini λ dan threshold dipilih sambil melihat test 6.000 yang sama — angka-angkanya adalah HASIL ILUSTRASI PROTOKOL LESSON, bukan evaluasi final (three-way split: M6.4 langkah 4).",
      },
      tasks: [],
    },
    {
      id: "peta-mitigasi",
      eyebrow: "Langkah 3 · Peta tiga keluarga",
      title: "Tiga keluarga mitigasi — dan di mana masing-masing bekerja",
      prose: [
        "Semua mitigasi fairness masuk ke satu dari tiga keluarga, dibedakan oleh DI MANA ia menyentuh pipeline. Pre-processing menyentuh DATA sebelum model dilatih: ubah bobot baris (reweighing), ubah komposisi baris (resampling), atau ubah kolomnya (hapus/ubah fitur sensitif). In-processing menyentuh PELATIHAN itu sendiri: latih model dengan constraint fairness di dalam fungsi objektifnya — model belajar sambil «dihukum» bila ia tidak adil. Post-processing menyentuh KEPUTUSAN sesudah model jadi: ubah threshold per grup, atau ubah label keluarannya — modelnya tidak disentuh sama sekali.",
        "Nilai: peta ini penting karena ia menentukan APA yang bisa diperbaiki dan APA harganya. Pre-processing memperbaiki sumber masalah (data yang timpang) tapi tidak menjamin model hasil akhirnya adil — model bisa menemukan kembali kesenjangan itu lewat proxy. In-processing menjamin constraint-nya dipenuhi saat pelatihan, tapi mengubah pelatihan berarti mengubah model — dan butuh implementasi yang tidak selalu tersedia di library standar. Post-processing adalah yang paling mudah diterapkan (tidak perlu latih ulang) dan paling transparan (threshold per grup bisa ditulis di satu baris), tapi ia tidak memperbaiki modelnya — ia hanya memperbaiki KEPUTUSANNYA, dan ia bisa merusak kalibrasi (langkah 10).",
        "Baik atau buruk: tidak ada keluarga yang «terbaik» secara umum — yang ada hanyalah yang paling cocok dengan diagnosis. Data latihmu timpang antar kelompok? Pre-processing. Modelmu sudah bagus tapi keputusannya timpang? Post-processing. Kamu punya akses ke kode pelatihan dan butuh jaminan matematis? In-processing. Buruk bila kamu memilih keluarga berdasarkan yang paling mudah di-demo — post-processing yang dipilih karena «tinggal ubah threshold» tanpa memeriksa apakah kalibrasi dan legalitasnya tahan, adalah mitigasi yang akan dicabut di review pertama.",
        "Mitigasi: sebelum memilih keluarga, jawab tiga pertanyaan diagnosis — (1) Di mana kesenjangan itu berasal: dari data, dari model, atau dari keputusan? (2) Atribut sensitif apa yang tersedia, dan seberapa besar n per kelompoknya? (3) Metrik fairness mana yang kamu kejar — AIR (approval), FPR/FNR (kesalahan), atau keduanya? Jawaban ketiganya menentukan keluarga; lesson ini menghitung ketiganya untuk SEX supaya kamu bisa melihat perbedaannya.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Pipeline kredit dengan tiga titik intervensi mitigasi: pre-processing pada data, in-processing pada pelatihan, post-processing pada keputusan">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tiga keluarga mitigasi — tiga titik sentuh yang berbeda</text>
<rect x="16" y="48" width="88" height="52" fill="var(--c1)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="128" y="48" width="88" height="52" fill="var(--c4)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="240" y="48" width="88" height="52" fill="var(--c2)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="352" y="48" width="112" height="52" fill="var(--c1)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="106" y1="74" x2="126" y2="74" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="126,74 118,70 118,78" fill="var(--chart-text)"/>
<line x1="218" y1="74" x2="238" y2="74" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="238,74 230,70 230,78" fill="var(--chart-text)"/>
<line x1="330" y1="74" x2="350" y2="74" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="350,74 342,70 342,78" fill="var(--chart-text)"/>
<text x="60" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">DATA</text>
<text x="60" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">30.000 baris</text>
<text x="172" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">LATIH</text>
<text x="172" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">GBM + Platt</text>
<text x="284" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">SKOR</text>
<text x="284" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">probabilitas</text>
<text x="408" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">KEPUTUSAN</text>
<text x="408" y="86" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">threshold 0,10</text>
<line x1="60" y1="100" x2="60" y2="122" stroke="var(--c1)" stroke-width="2"/>
<polygon points="60,130 55,120 65,120" fill="var(--c1)"/>
<text x="60" y="146" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PRE</text>
<text x="60" y="160" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">reweighing</text>
<text x="60" y="174" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">resampling</text>
<text x="60" y="188" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">hapus fitur</text>
<line x1="172" y1="100" x2="172" y2="122" stroke="var(--c4)" stroke-width="2"/>
<polygon points="172,130 167,120 177,120" fill="var(--c4)"/>
<text x="172" y="146" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">IN</text>
<text x="172" y="160" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">constraint saat</text>
<text x="172" y="174" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">pelatihan</text>
<line x1="408" y1="100" x2="408" y2="122" stroke="var(--c1)" stroke-width="2"/>
<polygon points="408,130 403,120 413,120" fill="var(--c1)"/>
<text x="408" y="146" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">POST</text>
<text x="408" y="160" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">threshold per grup</text>
<text x="408" y="174" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">(langkah 7–8)</text>
<text x="240" y="206" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Pre memperbaiki SUMBERNYA (data) · In memperbaiki PROSESNYA (latih) · Post memperbaiki HASILNYA (keputusan).</text>
<text x="240" y="222" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Semakin ke kanan, semakin mudah diterapkan — dan semakin sedikit yang diperbaiki di akarnya.</text>
</svg>`,
        alt: "Pipeline kredit dengan tiga titik intervensi: pre-processing pada data (reweighing, resampling, hapus fitur), in-processing pada pelatihan (constraint saat pelatihan), post-processing pada keputusan (threshold per grup).",
        caption: "Cara membaca: panah mengalir dari data ke latih ke skor ke keputusan. Pre-processing menyentuh data sebelum model dilatih; in-processing menyentuh pelatihan; post-processing menyentuh keputusan sesudah model jadi. Semakin ke kanan, semakin mudah diterapkan — dan semakin sedikit yang diperbaiki di akarnya.",
      },
      tasks: [],
    },
    {
      id: "pre-reweighing",
      eyebrow: "Langkah 4 · Pre-processing (1)",
      title: "Reweighing: timbang ulang barisnya, bukan modelnya",
      prose: [
        "Reweighing (Kamiran dan Calders, 2012) adalah mitigasi pre-processing yang paling bersih secara konseptual: bila kombinasi kelompok dan label tertentu TERWAKILI BERLEBIH atau KURANG di data latih, beri bobot pada baris-baris itu sehingga — dari sudut pandang model — kelompok dan label menjadi independen. Bobotnya satu rumus: w(g, y) = P(g) × P(y) / P(g, y). Bila laki-laki yang default lebih jarang dari yang diharapkan bila kelompok dan label independen, baris-baris itu mendapat bobot DI ATAS 1 (suaranya diperbesar); bila lebih sering, bobot DI BAWAH 1. Modelnya sendiri tidak berubah — HistGradientBoostingClassifier yang sama, hanya dipanggil dengan sample_weight.",
        "Nilai [notebook] — bobot dihitung dari TRAIN 24.000 (SEX × default): laki-laki-default w = 0,9076, laki-laki-lancar w = 1,0298, perempuan-default w = 1,0713, perempuan-lancar w = 0,9815. Perhatikan: keempat bobot mengelilingi 1,0 — reweighing di data ini adalah koreksi KECIL, bukan operasi besar, karena ketimpangan kelompok × label di train memang tidak ekstrem. Setelah dilatih ulang dengan bobot itu lalu dikalibrasi Platt seperti biasa, hasilnya di test 6.000: AIR SEX 0,9567 (dari 0,869), ROC-AUC 0,7806 (dari 0,7816 terkalibrasi), PR-AUC 0,5590 (dari 0,5558), biaya NT$32.956.500 (dari NT$33.046.500), profit +NT$8.304.000 (dari +NT$8.214.000).",
        "Baik atau buruk: reweighing bagus karena ia tidak mengubah fitur, tidak mengubah model, dan tidak mengubah threshold — ia hanya mengubah seberapa keras setiap baris «berbicara» saat pelatihan, sehingga ia mudah dijelaskan ke komite kredit («kami menimbang ulang data latih agar kelompok dan label independen»). Buruk bila dibaca sebagai jaminan: bobot dihitung dari train, dan tidak ada yang menjamin model hasil akhirnya adil di test — di data ini AIR bergerak dari 0,869 ke 0,9567, yaitu naik 0,0877 namun belum menutup kesenjangan. Reweighing juga diam-diam mengubah distribusi efektif data latihmu: baris dengan bobot 1,3 dihitung 1,3 kali — bila bobotmu ekstrem (misal 5×), kamu sebenarnya melatih model pada data yang jauh lebih kecil secara efektif.",
        "Mitigasi: laporkan SELALU keempat bobotnya di samping hasil akhirnya — bobot adalah bagian dari keputusan mitigasi, bukan detail implementasi. Bila satu bobot di atas 2 atau di bawah 0,5, tanyakan dulu apakah ketimpangan datamu memang sebesar itu, atau apakah kamu sedang menambal masalah data dengan bobot (lebih baik perbaiki datanya).",
      ],
      formula: String.raw`w(g, y) = \frac{\mathbb{P}(g)\,\mathbb{P}(y)}{\mathbb{P}(g, y)}, \qquad \text{latih GBM dengan } \texttt{sample\_weight} = w`,
      formulaNote: "Reweighing Kamiran–Calders: bobot tiap kombinasi kelompok g dan label y membuat kelompok dan label independen dari sudut pandang model. Bobot di atas 1 memperbesar suara kombinasi itu; di bawah 1 memperkecilnya.",
      tasks: [],
    },
    {
      id: "pre-resampling-hapus",
      eyebrow: "Langkah 5 · Pre-processing (2)",
      title: "Resampling dan hapus fitur sensitif — plus jebakan proxy",
      prose: [
        "Resampling adalah saudara kasar reweighing: alih-alih menimbang baris, ia MENAMBAH atau MENGHAPUS baris sampai tiap kombinasi kelompok × label berukuran sama. Di lesson ini: tiap sel SEX × default di train di-oversample (dengan pengembalian, seed 42) sampai sebesar sel terbesar, sehingga train tumbuh dari 24.000 menjadi 46.068 baris. Hasilnya di test 6.000: AIR SEX 0,9788 (dari 0,869), ROC-AUC 0,7784, PR-AUC 0,5598, biaya NT$33.943.500, profit +NT$7.317.000. Tapi baca juga kolom approval-nya: approval laki-laki 0,1661 dan perempuan 0,1626 — JAUH di bawah 0,285 semula — dan probabilitas prediksi rata-rata naik ke 0,387 (dari 0,22): menyamakan sel membuat base rate latih menjadi 50%, sehingga skornya membengkak dan threshold 0,10 yang dikalibrasi untuk base rate 22% tidak lagi berarti sama. Brier score-nya 0,1758 (dari 0,1345) mengonfirmasi kalibrasinya rusak. AIR-nya memang 0,9788 — tapi harga yang dibayar adalah operating point yang runtuh dan profit yang turun.",
        "Nilai: bandingkan resampling dengan reweighing (langkah 4) — keduanya menyasar ketimpangan yang sama, tapi resampling menduplikasi baris secara harfiah. Duplikasi berarti model melihat baris yang SAMA berulang kali: ia bisa overfit pada baris-baris yang diduplikasi itu, dan ukuran train yang membengkak (46.068 baris) memperlambat pelatihan tanpa menambah informasi baru. Reweighing melakukan hal yang sama secara matematis tanpa menduplikasi apa pun — itulah mengapa reweighing biasanya dipilih lebih dulu, dan resampling dipakai bila library pelatihanmu tidak mendukung sample_weight.",
        "Mitigasi kedua di keluarga pre-processing — hapus fitur sensitif — terdengar paling aman: buang SEX, MARRIAGE, dan EDUCATION dari fitur, maka model tidak bisa mendiskriminasi berdasarkan ketiganya. Notebook flagship sudah menghitungnya (sel ⭐): GBM mentah tanpa atribut sensitif ROC-AUC 0,7781 / PR-AUC 0,5516 — hanya turun 0,0042 / 0,0081 dari GBM penuh (0,7823 / 0,5597). Murah. Tapi versi terkalibrasi yang dihitung di lesson ini menunjukkan sisi lainnya: AIR SEX setelah hapus fitur adalah 0,9211 (dari 0,869), ROC-AUC terkalibrasi 0,7789, biaya NT$32.209.000, profit +NT$9.051.500. Kesenjangan approval TIDAK hilang — ia hanya mengecil. Mengapa? Karena proxy.",
        "Baik atau buruk: hapus fitur bagus sebagai pengurang risiko regulasi — model yang tidak pernah melihat SEX tidak bisa dituduh memakai SEX secara langsung, dan harganya di sini kecil (ROC-AUC turun 0,0042 mentah). Buruk bila dibaca sebagai «sekarang modelnya adil»: fitur lain membawa informasi yang sama — LIMIT_BAL, PAY_0, dan pola pembayaran berkorelasi dengan SEX, dan model belajar dari korelasi itu. Buktinya [notebook]: probe GBM yang memprediksi SEX HANYA dari fitur tersisa (tanpa SEX) mencapai ROC-AUC 0,6261 — jauh di atas 0,5 (tebakan acak). Bahkan skor PD model tanpa-fitur-sensitif itu sendiri memprediksi SEX dengan ROC-AUC 0,4817. SEX sudah «bocor» ke dalam model lewat proxy — menghapus kolomnya tidak menghapus informasinya.",
        "Mitigasi: hapus fitur sensitif BOLEH dilakukan — dan di produksi sering memang dilakukan — tapi JANGAN klaim «model kini buta terhadap kelompok». Uji butanya: latih probe yang memprediksi atribut sensitif dari fitur tersisa (atau dari skor model). Bila probe-nya bisa (ROC-AUC jauh di atas 0,5), modelmu tidak buta — ia hanya tidak melihat labelnya secara langsung. Itulah juga jawaban kuis kunci M2.2: IV SEX yang rendah (0,0092) tidak membuktikan model fair, karena bias masuk lewat proxy, dan IV hanya mengukur prediksi univariat, bukan perlakuan model per grup.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: «kami sudah hapus SEX dari model»",
        type: "pitfall",
        body: "Yang benar: menghapus kolom SEX tidak menghapus informasi SEX. Probe GBM memprediksi SEX dari fitur tersisa dengan ROC-AUC 0,6261 [notebook] — model tanpa SEX tetap «tahu» kelompok nasabahnya lewat proxy (limit, pola bayar). Hapus fitur mengurangi risiko regulasi langsung, tapi bukan bukti keadilan — buktinya tetap audit per grup (AIR, FPR, FNR) SESUDAH penghapusan.",
      },
    },
    {
      id: "in-processing",
      eyebrow: "Langkah 6 · In-processing",
      title: "In-processing: hukum model saat ia berlatih",
      prose: [
        "In-processing memindahkan fairness ke DALAM pelatihan: bukan data yang diubah, bukan keputusan yang diubah — melainkan fungsi yang dioptimasi model. Gagasan standarnya (reductions, Agarwal dkk. 2018) adalah mengubah masalah ber-constraint — «maksimalkan akurasi DENGAN SYARAT selisih FNR antar kelompok kecil» — menjadi serangkaian masalah TANPA constraint yang dibobot ulang: tiap ronde, kelompok yang FNR-nya lebih buruk mendapat bobot lebih besar pada nasabah default-nya, model dilatih ulang, lalu constraint diukur lagi. Model belajar sambil dihukum bila ia tidak adil.",
        "Nilai [notebook] — versi SEDERHANA dari gagasan itu (fairlearn TIDAK terpasang di VM ini, jadi lesson ini memakai pembobotan ulang iteratif yang sama idenya dalam bentuk mini — BUKAN ExponentiatedGradient penuh; label ini jujur dan penting): tiap ronde, nasabah default dari kelompok dengan FNR train lebih tinggi mendapat bobot ×1,5; berhenti bila selisih FNR train di bawah 0,005 atau setelah 6 ronde. Hasilnya: 2 ronde, selisih FNR train dari 0,0231 menjadi 0,0010. Model final (GBM + Platt) di test 6.000: AIR SEX 0,9233 (dari 0,869), ROC-AUC 0,7810, PR-AUC 0,5581, biaya NT$33.770.000, profit +NT$7.490.500. Dan perhatikan DUA hal yang tidak terlihat dari AIR-nya saja: approval KEDUA kelompok TURUN (laki-laki 0,2065, perempuan 0,1907 — dari 0,2614/0,3007), karena menaikkan bobot nasabah default menggeser seluruh distribusi probabilitas ke atas; dan arah kesenjangan BERBALIK — perempuan kini LEBIH JARANG disetujui daripada laki-laki. Menargetkan selisih FNR di train berhasil (0,0231 ke 0,0010), tapi AIR test hanya 0,9233 dan operating point-nya bergeser — constraint yang dipenuhi di train tidak menjamin keputusan yang diinginkan di test.",
        "Baik atau buruk: in-processing bagus karena constraint-nya eksplisit dan terukur SELAMA pelatihan — kamu tidak berharap model «kebetulan» adil, kamu memaksanya. Ia juga satu-satunya keluarga yang bisa menargetkan metrik kesalahan (FNR/FPR) secara langsung, bukan hanya approval. Buruk bila dibaca sebagai solusi siap-pakai: implementasi penuhnya (ExponentiatedGradient di fairlearn) butuh library tambahan, melatih BANYAK model (satu per ronde, lalu merandomisasi di antaranya), dan hasilnya adalah model yang dirandomisasi — sulit dijelaskan ke komite kredit («keputusan untuk nasabah ini tergantung lemparan dadu antar model»). Versi sederhana di lesson ini menghindari randomisasi, tapi harganya: tidak ada jaminan matematis bahwa constraint terpenuhi di test — dan di data ini AIR hanya bergerak ke 0,9233.",
        "Mitigasi: bila kamu memakai in-processing, laporkan SELALU tiga hal — constraint yang ditargetkan (di sini: selisih FNR), nilai constraint di TRAIN per ronde, dan nilai constraint yang sama di TEST sesudahnya. Bila train patuh tapi test tidak, constraint-mu overfit pada train — sama seperti akurasi yang overfit. Dan bila library fairness-mu tidak tersedia, jangan pura-pura memakai algoritmanya: sebut versimu apa adanya («reductions versi sederhana»), seperti yang dilakukan lesson ini.",
      ],
      formula: String.raw`\min_{\theta}\; \mathcal{L}(\theta) \quad \text{dengan syarat} \quad \bigl|\mathrm{FNR}_{\text{laki-laki}} - \mathrm{FNR}_{\text{perempuan}}\bigr| \le \epsilon, \qquad w \leftarrow 1{,}5\,w \text{ untuk default kelompok yang lebih buruk tiap ronde}`,
      formulaNote: "In-processing (reductions): masalah ber-constraint diubah menjadi ronde-ronde pembobotan ulang — kelompok dengan FNR lebih buruk mendapat bobot lebih besar pada nasabah default-nya. Versi lesson ini: pembobotan iteratif sederhana (fairlearn tidak terpasang), bukan ExponentiatedGradient penuh.",
      tasks: [],
    },
    {
      id: "post-threshold",
      eyebrow: "Langkah 7 · Post-processing — INTI",
      title: "Threshold per grup: reproduksi mitigasi notebook flagship",
      prose: [
        "Inilah inti lesson ini — dan satu-satunya mitigasi yang direproduksi PERSIS dari notebook flagship (Tahap 13, sel 45). Idenya sederhana: bila satu threshold 0,10 menghasilkan approval 26,1% untuk laki-laki dan 30,1% untuk perempuan, maka BERI TIAP KELOMPOK threshold-nya sendiri sehingga keduanya disetujui pada tingkat yang sama. Caranya: ambil approval rate keseluruhan pada threshold tunggal (0,285) sebagai target, lalu untuk tiap kelompok pilih threshold = kuantil ke-0,285 dari distribusi probabilitas kelompok itu — yaitu, setujui 28,5% nasabah BERISIKO TERENDAH di tiap kelompok. Modelnya tidak dilatih ulang, datanya tidak diubah, fiturnya tidak disentuh — hanya aturan keputusannya.",
        "Nilai [notebook] — threshold per grup SEX (target approval 0,285): laki-laki 0,1058, perempuan 0,0965. Perhatikan arahnya: threshold laki-laki NAIK (0,10 ke 0,1058 — lebih longgar, lebih banyak disetujui) dan threshold perempuan TURUN (0,10 ke 0,0965 — lebih ketat, lebih sedikit disetujui). Hasilnya di test 6.000: approval laki-laki 26,1% ke 28,5%, approval perempuan 30,1% ke 28,5%; selisih approval antar kelompok 0,0393 ke 0,0000; AIR laki-laki 0,869 ke 0,9999. Tabel sebelum/sesudah selengkapnya ada di bawah — dan inilah SATU-SATUNYA mitigasi di lesson ini yang benar-benar menutup kesenjangan approval sampai mendekati nol.",
        "Baik atau buruk: threshold per grup bagus karena ia transparan (dua angka, bisa ditulis di satu baris kebijakan), tidak butuh latih ulang, dan efeknya langsung terukur — AIR 0,9999 adalah hasil, bukan janji. Buruk bila dibaca sebagai «model kini adil»: yang disamakan hanyalah APPROVAL RATE. Selisih FPR antar kelompok bergerak 0,0383 ke 0,0076 dan selisih FNR 0,0191 ke 0,0024 — keduanya mengecil, tapi tidak nol, dan arahnya bisa berbalik pada kelompok lain. Dan yang lebih penting: dua nasabah dengan skor yang SAMA kini bisa menerima keputusan yang BERBEDA hanya karena kelompoknya (langkah 10) — itulah harga yang dibayar, dan ia harus ditulis berdampingan dengan AIR-nya.",
        "Mitigasi: bila kamu memakai threshold per grup, jangan pernah laporkan AIR-nya sendirian. Laporkan paket LENGKAP: threshold tiap kelompok, approval tiap kelompok, AIR, selisih FPR, selisih FNR, biaya, dan profit — sebelum dan sesudah. Bila salah satu dari paket itu tidak bisa kamu tulis, mitigasi itu belum siap dipresentasikan.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Approval rate SEX sebelum dan sesudah threshold per grup: laki-laki 26,1 persen ke 28,5 persen, perempuan 30,1 persen ke 28,5 persen">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Approval rate SEX — sebelum vs sesudah threshold per grup</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="170.8" x2="52" y2="170.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="173.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<line x1="48" y1="135.6" x2="52" y2="135.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="138.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="100.4" x2="52" y2="100.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="103.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<line x1="48" y1="65.2" x2="52" y2="65.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="68.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<rect x="90" y="113.8" width="52" height="92.2" fill="var(--c2)"/>
<text x="116" y="108" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">26,1%</text>
<rect x="160" y="102.3" width="52" height="103.7" fill="var(--c2)"/>
<text x="186" y="96" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">28,5%</text>
<rect x="268" y="100.2" width="52" height="105.8" fill="var(--c1)"/>
<text x="294" y="94" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">30,1%</text>
<rect x="338" y="102.3" width="52" height="103.7" fill="var(--c1)"/>
<text x="364" y="96" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">28,5%</text>
<text x="116" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">laki-laki sblm</text>
<text x="186" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">laki-laki ssdh</text>
<text x="294" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">perempuan sblm</text>
<text x="364" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">perempuan ssdh</text>
<text x="240" y="36" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">threshold tunggal 0,10 → threshold per grup 0,1058 (laki-laki) / 0,0965 (perempuan) [notebook]</text>
</svg>`,
        alt: "Approval rate SEX sebelum dan sesudah threshold per grup: laki-laki 26,1 persen ke 28,5 persen; perempuan 30,1 persen ke 28,5 persen; selisih approval 0,0393 ke 0,0000.",
        caption: "Cara membaca: dua bar kiri = laki-laki (sebelum, sesudah), dua bar kanan = perempuan (sebelum, sesudah). Threshold tunggal 0,10 memberi 26,1% vs 30,1%; threshold per grup (0,1058 laki-laki / 0,0965 perempuan) menyamakan keduanya di 28,5% [notebook]. Yang disamakan adalah approval rate — bukan FPR/FNR (langkah 8) dan bukan modelnya.",
      },
      tasks: [],
    },
    {
      id: "post-biaya",
      eyebrow: "Langkah 8 · Post-processing — harganya",
      title: "Biaya, profit, dan ROC-AUC setelah mitigasi: tabel sebelum/sesudah",
      prose: [
        "Threshold per grup menutup kesenjangan approval — tapi berapa harganya? Tabel ini adalah jawaban jujur notebook flagship, dihitung ulang di lesson ini pada test 6.000 yang sama. Sebelum mitigasi (threshold tunggal 0,10): selisih approval 0,0393; selisih FPR 0,0383; selisih FNR 0,0191; total biaya NT$33.046.500; net profit +NT$8.214.000; akurasi (definisi flagship: prediksi default sama dengan label, pada threshold keputusan) 0,4682. Sesudah mitigasi (threshold per grup 0,1058 / 0,0965): selisih approval 0,0000; selisih FPR 0,0076; selisih FNR 0,0024; total biaya NT$32.756.000; net profit +NT$8.504.500; akurasi 0,4687.",
        "Nilai: baca baris biayanya dua kali — karena ia melawan intuisi. Notebook flagship sendiri menulis «biasanya menaikkan biaya» — tapi DI DATA INI biayanya TURUN: NT$33.046.500 ke NT$32.756.000 (selisih NT$−290.500), dan profit NAIK NT$+290.500. Mengapa? Threshold per grup menyetujui LEBIH BANYAK laki-laki berisiko rendah (yang tadinya ditolak di bawah 0,10 padahal lancar — tiap penolakan nasabah lancar merugikan margin 5% dari limitnya) dan menolak LEBIH BANYAK perempuan berisiko sedang. Di data ini, pertukaran itu menguntungkan secara biaya — tapi itu KEBETULAN data, bukan sifat metode: pada data lain, atau pada target approval lain, biayanya bisa naik. Jangan hafal arahnya; hitung selalu.",
        "ROC-AUC dan PR-AUC setelah mitigasi — baca dengan hati-hati, karena ada DUA jawaban yang benar. Pada probabilitas MODEL (terkalibrasi — skor yang tidak berubah), ROC-AUC tetap 0,7816 dan PR-AUC tetap 0,5558 — threshold tidak mengubah skor, jadi ranking tidak berubah. «Mentah» di sini berarti «sebelum penyesuaian ambang», bukan «GBM tak terkalibrasi» (yang ROC-AUC-nya 0,7823). Pada skor keputusan yang DISESUAIKAN (s = p / threshold_kelompok — skor yang benar-benar menentukan siapa disetujui), ROC-AUC menjadi 0,7808 dan PR-AUC 0,5566. Yang pertama menjawab «apakah MODELNYA berubah?» (tidak). Yang kedua menjawab «apakah ATURAN KEPUTUSANNYA masih mengurutkan dengan baik?» (sedikit berubah — karena aturan kini memberi «diskon» pada satu kelompok). Bila seseorang hanya menyodorkan satu angka ROC-AUC «sesudah mitigasi» tanpa menyebut skor yang mana, tanyakan: probabilitas model atau skor keputusan?",
        "Baik atau buruk: tabel sebelum/sesudah ini bagus karena ia memaksa kejujuran dua arah — fairness membaik DAN biaya membaik di data ini, dan keduanya ditulis apa adanya, termasuk fakta bahwa perbaikan biaya ini kebetulan data. Buruk bila tabel ini dibaca sebagai «mitigasi itu gratis»: bad rate di antara yang disetujui BERGESER per kelompok — laki-laki 0,0669 ke 0,0686, perempuan 0,0665 ke 0,0643. Kesenjangan approval tertutup, tapi komposisi risiko buku yang disetujui berubah — dan komite kredit berhak tahu ke arah mana.",
        "Mitigasi: untuk SETIAP mitigasi yang kamu usulkan, isi tabel yang sama persis: selisih approval, selisih FPR, selisih FNR, biaya, profit, akurasi, ROC-AUC/PR-AUC (probabilitas model dan skor keputusan disesuaikan). Bila satu sel tidak bisa kamu isi, mitigasi itu belum selesai dihitung.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: «biaya turun, jadi mitigasi ini gratis»",
        type: "risk",
        body: "Yang benar: DI DATA INI biaya turun NT$33.046.500 ke NT$32.756.000 — tapi itu kebetulan pertukaran spesifik (menyetujui lebih banyak laki-laki berisiko rendah, menolak lebih banyak perempuan berisiko sedang). Notebook flagship sendiri memperingatkan «biasanya menaikkan biaya». Jangan jual mitigasi sebagai «gratis» berdasarkan satu dataset: hitung ulang di data calibration/validation, dan laporkan arah perubahannya sebagai TEMUAN, bukan sebagai sifat metode.",
      },
    },
    {
      id: "pareto",
      eyebrow: "Langkah 9 · Trade-off fairness vs performa",
      title: "Kurva Pareto: dari threshold tunggal ke threshold per grup, selangkah demi selangkah",
      prose: [
        "Satu titik «sebelum» dan satu titik «sesudah» belum membentuk kurva — dan tanpa kurva, kamu tidak tahu apakah ada titik tengah yang lebih baik. Lesson ini menghitung LIMA titik di antaranya: parameter λ menginterpolasi threshold tiap kelompok dari threshold tunggal (λ = 0) ke threshold per grup penuh (λ = 1) — threshold_kelompok(λ) = 0,10 + λ × (threshold_kelompok* − 0,10). Tiap λ adalah satu kebijakan yang bisa dipilih, dengan AIR dan biayanya sendiri — semuanya dihitung dari data, bukan ilustrasi.",
        "Nilai [notebook] — lima titik Pareto (SEX, test 6.000): λ = 0,00 → threshold 0,1000/0,1000, AIR 0,869, biaya NT$33.046.500, profit +NT$8.214.000, akurasi 0,4682. λ = 0,25 → threshold 0,1014/0,0991, AIR 0,8945, biaya NT$33.057.500, profit +NT$8.203.000, akurasi 0,4670. λ = 0,50 → threshold 0,1029/0,0982, AIR 0,9328, biaya NT$33.035.000, profit +NT$8.225.500, akurasi 0,4685. λ = 0,75 → threshold 0,1043/0,0974, AIR 0,9675, biaya NT$32.752.000, profit +NT$8.508.500, akurasi 0,4693. λ = 1,00 → threshold 0,1058/0,0965, AIR 0,9999, biaya NT$32.756.000, profit +NT$8.504.500, akurasi 0,4687. ROC-AUC skor keputusan bergerak 0,7816 ke 0,7808 di sepanjang kurva — perubahan kecil, karena interpolasi hanya menggeser ambang antar kelompok.",
        "Baik atau buruk: kurva ini bagus karena ia mengubah perdebatan «adil vs menguntungkan» dari opini menjadi pilihan titik: bila komite menargetkan AIR 0,95, λ = 0,62 (interpolasi) adalah titiknya, dengan biaya ≈ NT$32.899.000 (interpolasi) — dan semua orang bisa melihat harganya sebelum menyetujui. Buruk bila kurva ini dibaca sebagai «semakin adil semakin mahal»: di data ini biayanya TURUN sepanjang kurva (langkah 8) — kurva Pareto yang «salah arah» menurut intuisi adalah pengingat bahwa trade-off fairness vs performa adalah temuan empiris, bukan hukum alam. Pada data lain kurvanya bisa menanjak; di sini ia menurun — dan keduanya harus dilaporkan apa adanya.",
        "Mitigasi: jangan pernah sajikan SATU titik mitigasi tanpa kurvanya. Hitung minimal 5 titik interpolasi (λ = 0 / 0,25 / 0,5 / 0,75 / 1) dan biarkan pengambil keputusan memilih titiknya — dengan harga tiap titik tertulis di sampingnya. Mitigasi yang hanya punya satu titik adalah ultimatum, bukan rekomendasi.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Kurva Pareto: AIR naik dari 0,869 ke 1,000 sementara biaya turun dari NT$33.046.500 ke NT$32.756.000 sepanjang lima titik lambda">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Kurva Pareto — AIR vs biaya, lima titik λ (SEX, test 6.000)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">32,7 jt</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">32,9 jt</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">33,0 jt</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">33,1 jt</text>
<text x="259" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">AIR (makin ke kanan, makin adil) →</text>
<polyline points="77.9,53.5 147.2,48.7 252.9,58.6 348.7,183.1 438.1,181.4" fill="none" stroke="var(--c1)" stroke-width="2"/>
<circle cx="77.9" cy="53.5" r="5" fill="var(--c1)"/>
<circle cx="147.2" cy="48.7" r="5" fill="var(--c1)"/>
<circle cx="252.9" cy="58.6" r="5" fill="var(--c1)"/>
<circle cx="348.7" cy="183.1" r="5" fill="var(--c1)"/>
<circle cx="438.1" cy="181.4" r="5" fill="var(--c1)"/>
<text x="77.9" y="40" font-size="10" fill="var(--text)" font-family="var(--font-ui)">λ=0 · AIR 0,869</text>
<text x="252.9" y="45" font-size="10" fill="var(--text)" font-family="var(--font-ui)">λ=0,5 · AIR 0,9328</text>
<text x="352" y="168" font-size="10" fill="var(--text)" font-family="var(--font-ui)">λ=1 · AIR 0,9999</text>
<text x="240" y="196" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Di data ini kurva TURUN: makin adil, makin murah (biaya 33.046.500 → 32.756.000) — kebetulan data, bukan hukum.</text>
</svg>`,
        alt: "Kurva Pareto lima titik lambda: AIR naik dari 0,869 ke 1,000 sementara biaya turun dari NT$33.046.500 ke NT$32.756.000.",
        caption: "Cara membaca: sumbu-x = AIR (makin ke kanan, makin adil), sumbu-y = total biaya NT$ (makin ke bawah, makin murah). Lima titik λ = 0 / 0,25 / 0,5 / 0,75 / 1 dihitung dari data [notebook]. Di data ini kurva TURUN — makin adil, makin murah — karena pertukaran threshold-nya menguntungkan secara biaya; pada data lain kurva bisa menanjak. Trade-off adalah temuan empiris, bukan hukum alam.",
      },
      tasks: [],
    },
    {
      id: "kapan-salah",
      eyebrow: "Langkah 10 · Kapan mitigasi salah",
      title: "Kapan mitigasi SALAH: metrik membaik, kepercayaan rusak",
      prose: [
        "Mitigasi bisa «berhasil» menurut angkanya dan tetap salah. Ada tiga cara ia salah — dan ketiganya terjadi di lesson ini atau di sebelahnya. Pertama: memperbaiki metrik tapi merusak kalibrasi dan kepercayaan. Threshold per grup membuat SATU skor berarti DUA keputusan: nasabah laki-laki dengan probabilitas 0,10 DISETUJUI (di bawah threshold laki-laki 0,1058) sementara nasabah perempuan dengan probabilitas 0,10 DITOLAK (di atas threshold perempuan 0,0965). Skor yang sama, keputusan berbeda — hanya karena kelompok. Hitungannya [notebook]: di pita skor (0,0965–0,1058] ada 92 laki-laki yang disetujui padahal perempuan dengan skor yang sama persis ditolak (151 perempuan ditolak di pita itu). Setiap kali nasabah membandingkan surat keputusannya dengan tetangganya, pita inilah yang akan ditemukan — dan tidak ada penjelasan kalibrasi yang bisa membenarkannya, karena kalibrasi modelnya sendiri TIDAK berubah (ECE tetap 0,0087; yang berubah adalah aturan keputusan di atasnya).",
        "Kedua: legalitas threshold per grup. Memberlakukan threshold berbeda berdasarkan jenis kelamin adalah perlakuan berbeda berdasarkan atribut yang dilindungi — di beberapa yurisdiksi (misalnya Amerika Serikat, Equal Credit Opportunity Act) hal semacam ini bermasalah secara hukum, dan di yurisdiksi lain statusnya abu-abu atau berbeda. Lesson ini MENCATAT pertimbangan itu — bukan memberi nasihat hukum. Yang pasti: sebelum memakai threshold per grup di produksi, konsultasikan ke penasihat hukum dan regulator yang berlaku (di Indonesia: OJK), dan pertimbangkan rute yang lebih aman — perbaiki sumber masalah (fitur yang lebih baik, reweighing saat pelatihan, model tanpa atribut sensitif) — seperti yang disarankan notebook flagship sendiri. Mitigasi yang tidak lolos review hukum adalah mitigasi yang akan dicabut — dan pencabutan yang terlambat lebih mahal daripada mitigasi yang tidak pernah dipakai.",
        "Ketiga: mitigasi pada kelompok dengan n kecil — flag EDUCATION. Kelompok acuan «Lainnya» (EDUCATION) hanya n = 82 di test, approval 58,5% dengan standard error ±5,44 poin persen — selang kepercayaannya lebar. Lebih tajam lagi: bila kamu mencoba menghitung threshold per grup untuk «Lainnya» (kuantil approval 0,285), bootstrap 500 ulangan memberi simpangan baku 0,0078 dan selang 95% ((0,0452, 0,0782)) — threshold-nya bergoyang lebar hanya karena 82 baris itu di-resample. Bandingkan dengan SEX: threshold laki-laki simpangan baku bootstrap 0,0022 (n = 2.402) dan perempuan 0,0016 (n = 3.598). Aturannya: JANGAN samakan approval untuk kelompok dengan n kecil — threshold kuantilnya tidak stabil, AIR-nya tidak stabil, dan «mitigasi»-mu adalah noise yang dibungkus keputusan. Tindakan yang benar untuk Pascasarjana (AIR 0,603): SELIDIKI dulu — kumpulkan data lebih banyak, atau audit dengan metrik yang tidak bergantung pada kelompok acuan kecil (misalnya selisih FPR/FNR langsung, atau AIR terhadap kelompok terbesar, bukan terhadap «Lainnya»).",
        "Baik atau buruk: ketiga kegagalan ini bagus sebagai pengingat bahwa «AIR membaik» bukan vonis akhir — ia satu baris dari paket keputusan. Buruk bila ketiganya dibaca sebagai alasan untuk TIDAK memitigasi sama sekali: AIR 0,869 yang dibiarkan juga adalah keputusan — keputusan untuk menerima kesenjangan itu. Yang benar adalah memitigasi dengan paket lengkap (langkah 8), dengan catatan legalitas, dan dengan ambang n minimum yang ditulis dulu.",
        "Mitigasi: tetapkan TIGA gerbang sebelum mitigasi apa pun masuk produksi — (1) gerbang kalibrasi: apakah aturan keputusan barumu masih bisa dijelaskan dari skornya? (2) gerbang legalitas: apakah penasihat hukum sudah membaca rencanamu? (3) gerbang n minimum: apakah tiap kelompok yang kamu samakan punya n cukup besar sehingga threshold-nya stabil (bootstrap SD kecil)? Satu gerbang gagal berarti mitigasi ditunda — bukan dibatalkan diam-diam, melainkan didokumentasikan (langkah 11) sebagai «ditunda karena …».",
      ],
      tasks: [],
      note: {
        title: "Peringatan: threshold per grup bukan nasihat hukum",
        type: "risk",
        body: "Threshold berbeda per kelompok (jenis kelamin) adalah perlakuan berbeda berdasarkan atribut yang dilindungi — status hukumnya berbeda-beda antar yurisdiksi dan bisa bermasalah (misalnya ECOA di Amerika Serikat). Lesson ini menampilkannya sebagai LATIHAN ANALITIS dan reproduksi notebook flagship, BUKAN sebagai rekomendasi hukum. Sebelum produksi: konsultasi penasihat hukum dan regulator (di Indonesia: OJK). Rute yang lebih aman: perbaiki sumber masalah — fitur lebih baik, reweighing, atau model tanpa atribut sensitif.",
      },
    },
    {
      id: "dokumentasi",
      eyebrow: "Langkah 11 · Dokumentasi keputusan",
      title: "Dokumentasi keputusan mitigasi: alasan, angka, dan siapa yang menyetujui",
      prose: [
        "Mitigasi yang tidak didokumentasikan adalah mitigasi yang tidak terjadi — karena enam bulan lagi tidak ada yang ingat mengapa threshold laki-laki 0,1058 dan perempuan 0,0965, atau siapa yang menyetujui angka itu. Dokumentasi keputusan mitigasi punya EMPAT bagian wajib. Satu — ALASAN: metrik apa yang memicu mitigasi (di sini: AIR SEX 0,869 pada threshold tunggal 0,10; selisih approval 0,0393), dan mengapa keluarga ini yang dipilih (post-processing: transparan, tanpa latih ulang, efek langsung terukur). Dua — ANGKA SEBELUM DAN SESUDAH: paket lengkap langkah 8 (AIR, selisih FPR/FNR, biaya, profit, akurasi, ROC-AUC/PR-AUC probabilitas model dan skor keputusan disesuaikan) — bukan hanya AIR-nya. Tiga — HARGA DAN RISIKO YANG DITERIMA: pita inversi 92 laki-laki vs 151 perempuan (langkah 10), pertimbangan legalitas threshold per grup, dan catatan bahwa perbaikan biaya di data ini adalah kebetulan data. Empat — PENYETUJU: nama, jabatan, tanggal, dan ambang yang disetujui (misalnya «AIR minimum 0,95 pada SEX, ditinjau ulang tiap kuartal»).",
        "Nilai: contoh terisi dari lesson ini — Keputusan M7.4-01 (SEX, threshold per grup): pemicu AIR 0,869 (approval laki-laki 26,1% vs perempuan 30,1%, test 6.000, threshold 0,10); intervensi threshold per grup 0,1058/0,0965 menarget approval 0,285; hasil AIR 0,9999, selisih approval 0,0000, selisih FPR 0,0076, selisih FNR 0,0024, biaya NT$33.046.500 ke NT$32.756.000, profit +NT$8.214.000 ke +NT$8.504.500, ROC-AUC probabilitas model (terkalibrasi) 0,7816 (tetap) / skor keputusan disesuaikan 0,7808; risiko diterima pita inversi (0,0965–0,1058] dan pertimbangan legalitas (konsultasi hukum sebelum produksi); alternatif yang dipertimbangkan reweighing (AIR 0,9567) dan hapus fitur (AIR 0,9211) — keduanya TIDAK menutup kesenjangan, jadi post-processing dipilih meski risikonya lebih besar; penyetuju: [diisi komite kredit — NAMA, TANGGAL].",
        "Baik atau buruk: dokumentasi empat bagian ini bagus karena ia mengubah mitigasi dari «angka di slide» menjadi «keputusan yang bisa diaudit» — siapa pun bisa merekonstruksi alasan, angka, dan penanggung jawabnya. Buruk bila dokumentasi hanya berisi angka sesudahnya («AIR kini 1,00!»): tanpa angka sebelumnya, tanpa alternatif yang dipertimbangkan, dan tanpa risiko yang diterima, dokumen itu adalah brosur — bukan catatan keputusan. Dan buruk bila penyetujunya kosong: mitigasi tanpa nama penanggung jawab adalah mitigasi yang tidak ada yang berani mempertahankannya saat ditanya.",
        "Mitigasi: simpan dokumen ini BERSAMA model card (M8) — satu halaman per keputusan mitigasi, dengan tanggal dan versi modelnya. Bila model dilatih ulang, dokumennya dibuka lagi: apakah AIR-nya masih 0,9999? Apakah threshold per grupnya masih 0,1058/0,0965? Bila tidak, keputusan mitigasi itu sudah kedaluwarsa — dan harus dibuat ulang, bukan diwarisi diam-diam.",
      ],
      tasks: [],
    },
    {
      id: "governance-template",
      eyebrow: "Langkah 12 · Template tata kelola",
      title: "Template tata kelola: satu halaman yang membuat keputusanmu bisa direproduksi",
      prose: [
        "Dokumentasi keputusan (langkah 11) menjawab «mengapa mitigasi ini dipilih» — tapi ia belum menjawab «model dan data MANA yang menghasilkan keputusan ini, dan bagaimana cara mengembalikannya bila gagal». Enam bulan lagi, seseorang membuka file ini dan bertanya: threshold 0,1058/0,0965 itu berlaku untuk model versi berapa? Data snapshot yang mana? Kode notebook yang mana — yang sebelum atau sesudah perbaikan bug terakhir? Tanpa jawaban itu, keputusanmu tidak bisa direproduksi — dan keputusan yang tidak bisa direproduksi tidak bisa diaudit. Template tata kelola satu halaman ini adalah jawabannya: sepuluh kolom wajib, diisi untuk SETIAP perubahan yang masuk produksi.",
        "Nilai: sepuluh kolom wajib — diisi dengan contoh keputusan M7.4-01 dari lesson ini. (1) Model version: GBM terkalibrasi Platt/sigmoid, seed 42, 31 fitur flagship v1. (2) Feature schema version: 31 fitur (23 mentah + 8 turunan, M1) — bila satu fitur berubah definisinya, versinya naik. (3) Calibration version: Platt/sigmoid, CalibratedClassifierCV cv=3. (4) Threshold policy version: v1 threshold tunggal 0,10 → v2 threshold per grup 0,1058/0,0965 (target approval 0,285). (5) Data snapshot: UCI Default of Credit Card Clients, 30.000 baris, split stratified seed 42 (train 24.000, test 6.000). (6) Code/notebook hash: hash commit atau hash notebook yang menghitung angka-angka itu — bukan «notebook terbaru». (7) Approval date: tanggal komite menyetujui v2. (8) Owner: nama penanggung jawab mitigasi ini. (9) Rollback version: threshold tunggal 0,10 (v1) — versi yang berlaku bila v2 dicabut. (10) Alasan perubahan: AIR SEX 0,869 pada v1, target AIR minimum 0,95, harga yang diterima (pita inversi 92 vs 151, pertimbangan legalitas). Sepuluh kolom, satu halaman — dan siapa pun bisa merekonstruksi keputusan itu tanpa meneleponmu.",
        "Baik atau buruk: template ini bagus karena ia mengubah «keputusan» menjadi «artefak» — sesuatu yang bisa dicari, dibandingkan antar versi, dan dibuka saat audit. Buruk bila diisi SEBAGIAN: paket yang berisi model version, threshold policy, approval date, dan owner — tapi tanpa data snapshot dan code hash — TIDAK bisa direproduksi: tidak ada yang bisa membuktikan data dan kode mana yang menghasilkan angka AIR 0,9999 itu. Sembilan dari sepuluh kolom bukan «hampir lengkap» — untuk reproduksi, satu kolom yang hilang bisa berarti seluruh paket tidak bisa diverifikasi. Dan buruk bila rollback version kosong: perubahan tanpa versi pengembali adalah perubahan yang tidak bisa dibatalkan — bila v2 gagal (AIR jatuh, ECE rusak, review hukum menolak), tim akan mengarang penggantinya di tengah krisis.",
        "Mitigasi: pasangkan template ini dengan workflow change control ENAM gerbang — (1) proposal: tuliskan template ini DULU, sebelum satu baris kode berubah; (2) offline validation: ukur paket lengkap (AIR, FPR/FNR, biaya, profit, kalibrasi) pada validation yang belum dipakai memilih; (3) legal/risk approval: penasihat hukum dan risk manager menandatangani template-nya — bukan slide-nya; (4) shadow/canary: jalankan v2 berdampingan dengan v1 pada sebagian trafik, bandingkan keputusan per nasabah; (5) production: v2 berlaku, v1 menjadi rollback version; (6) rollback criteria — ditulis SEBELUM produksi: cabut v2 bila AIR SEX jatuh di bawah 0,80 selama 2 periode berturut-turut, atau ECE di atas 0,02 bertahan, atau review hukum menolak — dan kembalikan v1 (threshold tunggal 0,10). Monitoring M7.5 adalah yang memberi sinyal untuk gerbang (6): alert WASPADA/KRITIS di sana adalah pemicu peninjauan template ini. Detail model card dan model risk governance adalah materi M8 — template ini hanya memastikan keputusan M7.4 bisa DIBAWA ke sana tanpa kehilangan jejak.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 13 · Lab 1",
      title: "Lab: AIR dan bobot reweighing dari hitungan train",
      prose: [
        "Sekarang hitung sendiri dua angka kunci pre-processing — dari hitungan TRAIN 24.000 [notebook]. Pertama, AIR SEX pada threshold tunggal 0,10: approval laki-laki 0,2614 (628 dari 2.402) dan perempuan 0,3007 (1.082 dari 3.598) di test 6.000 — AIR (laki-laki terhadap maksimum) dan AIR (perempuan/laki-laki, arah M2.2) dari kedua angka itu. Kedua, bobot reweighing Kamiran-Calders untuk sel (laki-laki, default): hitungan train — laki-laki-default 2312, laki-laki-lancar 7174, perempuan-default 2997, perempuan-lancar 11517; total laki-laki 9.486, total perempuan 14.514, total default 5.309, total lancar 18.691, total train 24.000.",
        "Hasil yang diharapkan [lab]: air_male_vs_max=0.8693; air_female_over_male=1.1503; w_male_default=0,9076; w_male_good=1,0298; w_female_default=1,0713; w_female_good=0,9815. Perhatikan: kedua AIR itu adalah SATU kesenjangan yang sama dari dua arah (1/0,8693 ≈ 1,1503 dari rate yang ditampilkan; hitungan penuh 1,1502) — selalu nyatakan arah AIR-mu. Dan perhatikan bobotnya: semuanya dekat 1,0 — reweighing di data ini adalah koreksi kecil, dan AIR sesudahnya (0,9567) menunjukkan seberapa jauh koreksi kecil itu membawa.",
        "Setelah lab jalan, bandingkan bobotmu dengan bobot kanonis di langkah 4. Bila berbeda, periksa dulu: apakah kamu memakai hitungan TRAIN (bukan test), dan apakah P(g) × P(y) / P(g, y) memakai proporsi (bukan hitungan mentah)?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi air_male_vs_max dan air_female_over_male dari approval 0,2614 dan 0,3007" },
        { id: "t2", text: "Lengkapi keempat bobot reweighing dari hitungan sel TRAIN" },
        { id: "t3", text: "Jalankan dan bandingkan dengan nilai kanonis (AIR 0,8693 / 1,1502)" },
      ],
      expected: "air_male_vs_max=0.8693\nair_female_over_male=1.1503\nw_male_default=0.9076\nw_male_good=1.0298\nw_female_default=1.0713\nw_female_good=0.9815",
      hints: [
        "AIR (laki-laki vs maks) = approval laki-laki / approval perempuan = 0,2614 / 0,3007 — perempuan adalah kelompok maksimumnya.",
        "AIR (perempuan/laki-laki) = kebalikannya: 0,3007 / 0,2614 = 1,1503 (hitungan penuh 1,1502 — selisih 0,0001 murni pembulatan) — arah M2.2. Keduanya satu kesenjangan yang sama.",
        "Bobot sel = (n_kelompok / 24.000) × (n_label / 24.000) / (n_sel / 24.000) — proporsi, bukan hitungan mentah.",
      ],
      code: {
        starter: `# AIR + bobot reweighing Kamiran-Calders dari hitungan TRAIN 24.000 [notebook]
# Test 6.000, threshold 0,10: approval laki-laki 0,2614; perempuan 0,3007
APPR_MALE = 0.2614
APPR_FEMALE = 0.3007
# Hitungan sel TRAIN (SEX x default):
N_MALE_DEFAULT = 2312
N_MALE_GOOD = 7174
N_FEMALE_DEFAULT = 2997
N_FEMALE_GOOD = 11517
N_TRAIN = 24000

air_male_vs_max = 0.0  # TODO: APPR_MALE / max(APPR_MALE, APPR_FEMALE)
air_female_over_male = 0.0  # TODO: APPR_FEMALE / APPR_MALE (arah M2.2)
w_male_default = 0.0  # TODO: P(laki-laki) * P(default) / P(laki-laki, default)
w_male_good = 0.0  # TODO: P(laki-laki) * P(lancar) / P(laki-laki, lancar)
w_female_default = 0.0  # TODO: P(perempuan) * P(default) / P(perempuan, default)
w_female_good = 0.0  # TODO: P(perempuan) * P(lancar) / P(perempuan, lancar)
print(f"air_male_vs_max={air_male_vs_max:.4f}")
print(f"air_female_over_male={air_female_over_male:.4f}")
print(f"w_male_default={w_male_default:.4f}")
print(f"w_male_good={w_male_good:.4f}")
print(f"w_female_default={w_female_default:.4f}")
print(f"w_female_good={w_female_good:.4f}")`,
        lockLines: 9,
        solution: `# AIR + bobot reweighing Kamiran-Calders dari hitungan TRAIN 24.000 [notebook]
# Test 6.000, threshold 0,10: approval laki-laki 0,2614; perempuan 0,3007
APPR_MALE = 0.2614
APPR_FEMALE = 0.3007
# Hitungan sel TRAIN (SEX x default):
N_MALE_DEFAULT = 2312
N_MALE_GOOD = 7174
N_FEMALE_DEFAULT = 2997
N_FEMALE_GOOD = 11517
N_TRAIN = 24000

air_male_vs_max = APPR_MALE / max(APPR_MALE, APPR_FEMALE)
air_female_over_male = APPR_FEMALE / APPR_MALE
w_male_default = ((N_MALE_DEFAULT + N_MALE_GOOD) / N_TRAIN) * ((N_MALE_DEFAULT + N_FEMALE_DEFAULT) / N_TRAIN) / (N_MALE_DEFAULT / N_TRAIN)
w_male_good = ((N_MALE_DEFAULT + N_MALE_GOOD) / N_TRAIN) * ((N_MALE_GOOD + N_FEMALE_GOOD) / N_TRAIN) / (N_MALE_GOOD / N_TRAIN)
w_female_default = ((N_FEMALE_DEFAULT + N_FEMALE_GOOD) / N_TRAIN) * ((N_MALE_DEFAULT + N_FEMALE_DEFAULT) / N_TRAIN) / (N_FEMALE_DEFAULT / N_TRAIN)
w_female_good = ((N_FEMALE_DEFAULT + N_FEMALE_GOOD) / N_TRAIN) * ((N_MALE_GOOD + N_FEMALE_GOOD) / N_TRAIN) / (N_FEMALE_GOOD / N_TRAIN)
print(f"air_male_vs_max={air_male_vs_max:.4f}")
print(f"air_female_over_male={air_female_over_male:.4f}")
print(f"w_male_default={w_male_default:.4f}")
print(f"w_male_good={w_male_good:.4f}")
print(f"w_female_default={w_female_default:.4f}")
print(f"w_female_good={w_female_good:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "air_male_vs_max", value: 0.8693, tol: 0.00005, label: "`air_male_vs_max` seharusnya 0.8693", msg: "AIR laki-laki terhadap maksimum (perempuan): 0,2614 / 0,3007 = 0,8693." },
          { kind: "equal", task: "t1", name: "air_female_over_male", value: 1.1503, tol: 0.0005, label: "`air_female_over_male` seharusnya 1.1503", msg: "AIR arah M2.2 (perempuan/laki-laki): solusi membagi approval yang ditampilkan (0,3007 / 0,2614) = 1,1503; hitungan penuh dari rate tak dibulatkan = 1,1502 (kanonik m74) — selisih 0,0001 murni pembulatan." },
          { kind: "equal", task: "t2", name: "w_male_default", value: 0.9076, tol: 0.00005, label: "`w_male_default` seharusnya 0,9076", msg: "Bobot (laki-laki, default) dari hitungan train — P(g) × P(y) / P(g, y)." },
          { kind: "equal", task: "t2", name: "w_female_good", value: 0.9815, tol: 0.00005, label: "`w_female_good` seharusnya 0,9815", msg: "Bobot (perempuan, lancar) dari hitungan train — sel terbesar, bobotnya di bawah 1." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 14 · Lab 2",
      title: "Lab: threshold per grup dan trade-off-nya",
      prose: [
        "Lab kedua mereproduksi inti lesson ini — threshold per grup SEX dari notebook flagship [notebook]. Tiga TODO: threshold tiap kelompok dari kuantil approval 0,285 (diberikan sebagai angka kanonis: laki-laki 0,1058, perempuan 0,0965 — tugasmu adalah MEMAKAINYA, bukan menghitung kuantilnya dari data mentah, karena data mentah probabilitas tidak tersedia di lab ini); approval baru tiap kelompok (targetnya 0,285 untuk keduanya — hitung dari angka kanonis yang diberikan); dan perubahan biaya serta profit (biaya sebelum NT$33.046.500, sesudah NT$32.756.000; profit sebelum +NT$8.214.000, sesudah +NT$8.504.500).",
        "Hasil yang diharapkan [lab]: thr_male=0.1058; thr_female=0.0965; air_after=0,9999; cost_change=−290.500; profit_change=+290.500. Perhatikan tanda cost_change: NEGATIF (biaya TURUN) — di data ini mitigasi menghemat NT$290.500. Jangan «perbaiki» tandanya karena terasa salah: itulah temuan datanya, dan lab ini mengujimu apakah kamu melaporkan apa yang dihitung, bukan apa yang kamu harapkan.",
        "Setelah lab jalan, coba ubah target approval di kepalamu: bila targetnya 0,30 (bukan 0,285), threshold tiap kelompok ikut naik — dan AIR-nya tetap 1,0 selama kedua kelompok disamakan pada target yang sama. Target approval menentukan SEBERAPA BANYAK yang disetujui; threshold per grup menentukan SIAPA yang disetujui di tiap kelompok.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi thr_male dan thr_female dari angka kanonis threshold per grup" },
        { id: "t2", text: "Lengkapi air_after dari approval baru kedua kelompok (target 0,285)" },
        { id: "t3", text: "Lengkapi cost_change dan profit_change (sesudah - sebelum), lalu periksa tandanya" },
      ],
      expected: "thr_male=0.1058\nthr_female=0.0965\nair_after=0.9999\ncost_change=-290500\nprofit_change=290500",
      hints: [
        "Threshold per grup kanonis [notebook]: laki-laki 0,1058 (lebih longgar dari 0,10), perempuan 0,0965 (lebih ketat).",
        "Approval baru kedua kelompok = target 0,285 — AIR sesudah = 0,285 / 0,285.",
        "cost_change = biaya sesudah − biaya sebelum = 32.756.000 − 33.046.500 (negatif = biaya turun). profit_change = profit sesudah − profit sebelum.",
      ],
      code: {
        starter: `# Threshold per grup SEX + trade-off (angka kanonis notebook flagship) [notebook]
# Threshold tunggal 0,10: biaya NT$33.046.500, profit +NT$8.214.000, AIR 0,869
# Threshold per grup: biaya NT$32.756.000, profit +NT$8.504.500
TARGET_APPROVAL = 0.285
COST_BEFORE = 33046500
COST_AFTER = 32756000
PROFIT_BEFORE = 8214000
PROFIT_AFTER = 8504500

thr_male = 0.0  # TODO: threshold kanonis laki-laki (kuantil 0,285)
thr_female = 0.0  # TODO: threshold kanonis perempuan (kuantil 0,285)
appr_male_after = 0.0  # TODO: approval laki-laki sesudah mitigasi (= TARGET_APPROVAL)
appr_female_after = 0.0  # TODO: approval perempuan sesudah mitigasi (= TARGET_APPROVAL)
air_after = 0.0  # TODO: min(appr_male_after, appr_female_after) / max(...)
cost_change = 0  # TODO: COST_AFTER - COST_BEFORE (perhatikan tandanya!)
profit_change = 0  # TODO: PROFIT_AFTER - PROFIT_BEFORE
print(f"thr_male={thr_male:.4f}")
print(f"thr_female={thr_female:.4f}")
print(f"air_after={air_after:.4f}")
print(f"cost_change={cost_change}")
print(f"profit_change={profit_change}")`,
        lockLines: 7,
        solution: `# Threshold per grup SEX + trade-off (angka kanonis notebook flagship) [notebook]
# Threshold tunggal 0,10: biaya NT$33.046.500, profit +NT$8.214.000, AIR 0,869
# Threshold per grup: biaya NT$32.756.000, profit +NT$8.504.500
TARGET_APPROVAL = 0.285
COST_BEFORE = 33046500
COST_AFTER = 32756000
PROFIT_BEFORE = 8214000
PROFIT_AFTER = 8504500

thr_male = 0.1058
thr_female = 0.0965
appr_male_after = TARGET_APPROVAL
appr_female_after = TARGET_APPROVAL
air_after = min(appr_male_after, appr_female_after) / max(appr_male_after, appr_female_after)
cost_change = COST_AFTER - COST_BEFORE
profit_change = PROFIT_AFTER - PROFIT_BEFORE
print(f"thr_male={thr_male:.4f}")
print(f"thr_female={thr_female:.4f}")
print(f"air_after={air_after:.4f}")
print(f"cost_change={cost_change}")
print(f"profit_change={profit_change}")`,
        checks: [
          { kind: "equal", task: "t1", name: "thr_male", value: 0.1058, tol: 0.00005, label: "`thr_male` seharusnya 0.1058", msg: "Threshold laki-laki NAIK dari 0,10 ke 0,1058 — lebih longgar, lebih banyak disetujui." },
          { kind: "equal", task: "t1", name: "thr_female", value: 0.0965, tol: 0.00005, label: "`thr_female` seharusnya 0.0965", msg: "Threshold perempuan TURUN dari 0,10 ke 0,0965 — lebih ketat, lebih sedikit disetujui." },
          { kind: "equal", task: "t2", name: "air_after", value: 0.9999, tol: 0.0005, label: "`air_after` seharusnya 0,9999", msg: "Kedua kelompok disetujui pada 0,285 — AIR mendekati 1 (dari target 0,285 / 0,285 hasilnya 1,0000; nilai kanonis dari hitungan penuh 0,9999)." },
          { kind: "equal", task: "t3", name: "cost_change", value: -290500, tol: 0.5, label: "`cost_change` seharusnya −290.500", msg: "Biaya TURUN sesudah mitigasi di data ini — tandanya negatif, dan itu temuan datanya, bukan kesalahan hitung." },
          { kind: "equal", task: "t3", name: "profit_change", value: 290500, tol: 0.5, label: "`profit_change` seharusnya +290.500", msg: "Profit NAIK sebesar selisih yang sama (biaya turun = profit naik, karena profit = margin semua nasabah lancar − biaya)." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 15 · Checkpoint",
      title: "Checkpoint: tiga keluarga, satu tabel sebelum/sesudah, tiga gerbang",
      prose: [
        "Rangkuman: audit M7.1–M7.3 menemukan AIR SEX 0,869 (approval laki-laki 26,1% vs perempuan 30,1%, threshold 0,10, test 6.000) [notebook]; EDUCATION Pascasarjana AIR 0,603 TERTANDA flag (kelompok acuan «Lainnya» n = 82); skor yang sama dari arah berlawanan adalah AIR 1,1502 (perempuan/laki-laki, M2.2) — selalu nyatakan arah AIR-mu. Tiga keluarga mitigasi: pre-processing (reweighing w = P(g)×P(y)/P(g,y) → AIR 0,9567; resampling → AIR 0,9788; hapus fitur sensitif → AIR 0,9211, tapi probe memprediksi SEX dari fitur tersisa dengan ROC-AUC 0,6261 — proxy bocor); in-processing (reductions versi sederhana, 2 ronde → AIR 0,9233); post-processing (threshold per grup 0,1058/0,0965 → AIR 0,9999, selisih approval 0,0000, selisih FPR 0,0076, selisih FNR 0,0024, biaya NT$33.046.500 ke NT$32.756.000, profit +NT$8.214.000 ke +NT$8.504.500, akurasi 0,4682 ke 0,4687, ROC-AUC probabilitas model (terkalibrasi) tetap 0,7816 / skor keputusan disesuaikan 0,7808). Kurva Pareto: lima titik λ = 0 / 0,25 / 0,5 / 0,75 / 1 — di data ini makin adil makin murah, kebetulan data, bukan hukum. Kapan mitigasi salah: pita inversi (0,0965–0,1058] berisi 92 laki-laki disetujui vs 151 perempuan ditolak pada skor yang sama; legalitas threshold per grup adalah pertimbangan (konsultasi hukum + OJK), bukan nasihat hukum; kelompok n kecil (EDUCATION «Lainnya» n = 82, SE approval ±5,44, bootstrap SD threshold 0,0078) tidak boleh disamakan threshold-nya. Dokumentasi: alasan + angka sebelum/sesudah + harga dan risiko yang diterima + penyetuju (nama, tanggal) — disimpan bersama model card. Lab: AIR 0,8693 / 1,1502 dan bobot reweighing dari hitungan train; threshold per grup 0,1058/0,0965 dengan cost_change −290.500 (negatif = biaya turun).",
        "Guided task di Colab — notebook mlf-m74-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data UCI: flagship GBM terkalibrasi + audit SEX, reweighing, resampling, hapus fitur + probe proxy, in-processing reductions sederhana, threshold per grup + tabel sebelum/sesudah, dan kurva Pareto lima titik λ. Tautan Colab: https://colab.research.google.com/drive/1qJmOQVXieKQOFgjwSsHN3KaVQft4Jndn",
        "Lanjut: MLF-M7.5 — Monitoring dan Drift: model yang adil hari ini belum tentu adil bulan depan — bagaimana populasi bergeser, AIR bergeser, dan kapan mitigasi harus dihitung ulang.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Audit SEX pada threshold 0,10: approval laki-laki 26,1%, perempuan 30,1%. Berapa AIR (laki-laki terhadap maksimum) dan AIR arah M2.2 (perempuan/laki-laki)?",
          options: [
            { text: "0,869 dan 1,1502 — satu kesenjangan yang sama dari dua arah", why: "Benar: 0,2614/0,3007 = 0,8693 dan 0,3007/0,2614 = 1,1502. Keduanya mendeskripsikan kesenjangan yang sama — selalu nyatakan arah AIR-mu.", correct: true },
            { text: "0,869 dan 0,869 — arah tidak mengubah AIR", why: "Salah: membalik pembilang dan penyebut membalik rasionya (1/0,8693 ≈ 1,1503 dari rate yang ditampilkan; hitungan penuh 1,1502). AIR tanpa arah yang dinyatakan adalah angka yang ambigu." },
            { text: "1,1502 dan 0,869 — laki-laki terhadap maksimum adalah 1,1502", why: "Terbalik: laki-laki adalah kelompok yang LEBIH RENDAH approval-nya, jadi AIR-nya terhadap maksimum (perempuan) adalah 0,869, bukan 1,1502." },
            { text: "0,040 dan 0,040 — AIR adalah selisih approval antar kelompok", why: "Salah: 0,040 (tepatnya 0,0393) adalah SELISIH approval, bukan rasio. AIR adalah RASIO approval terhadap kelompok tertinggi (atau terhadap kelompok lain, bila arahnya dinyatakan)." },
          ],
        },
        {
          q: "Reweighing Kamiran-Calders memberi bobot w(g, y) = P(g) × P(y) / P(g, y). Apa yang terjadi pada kombinasi kelompok-label yang TERWAKILI BERLEBIH di train?",
          options: [
            { text: "Bobotnya di atas 1 — suaranya diperbesar agar model lebih memperhatikannya", why: "Terbalik: kombinasi yang terwakili berlebih punya P(g, y) LEBIH BESAR dari P(g)×P(y), sehingga bobotnya DI BAWAH 1 — suaranya diperkecil. Kombinasi yang KURANG terwakili yang mendapat bobot di atas 1." },
            { text: "Bobotnya di bawah 1 — suaranya diperkecil karena sudah terlalu sering muncul", why: "Benar: bila P(g, y) > P(g)×P(y), penyebut lebih besar dari pembilang, w < 1. Di data ini semua bobot dekat 1,0 — ketimpangan train memang kecil.", correct: true },
            { text: "Bobotnya 0 — baris-baris itu dibuang dari pelatihan", why: "Salah: reweighing tidak pernah membuang baris (itu resampling/downsampling). Bobot 0 hanya terjadi bila P(g, y) tak berhingga — tidak mungkin." },
            { text: "Bobotnya tidak berpengaruh karena GBM mengabaikan sample_weight", why: "Salah: HistGradientBoostingClassifier MENDUKUNG sample_weight, dan lesson ini memakainya. Yang tidak selalu mendukung sample_weight adalah langkah kalibrasi (CalibratedClassifierCV) — di VM ini didukung." },
          ],
        },
        {
          q: "GBM tanpa atribut sensitif (SEX, MARRIAGE, EDUCATION) punya ROC-AUC mentah 0,7781 vs 0,7823 penuh — dan AIR SEX sesudahnya 0,9211 (dari 0,869). Apa kesimpulan yang benar?",
          options: [
            { text: "Model kini adil karena tidak pernah melihat SEX — AIR yang tersisa pasti noise", why: "Salah: AIR 0,9211 masih menunjukkan kesenjangan, dan probe memprediksi SEX dari fitur tersisa dengan ROC-AUC 0,6261 — informasi SEX bocor lewat proxy. Menghapus kolom tidak menghapus informasinya." },
            { text: "Menghapus fitur sensitif murah (ROC-AUC turun 0,0042) tapi TIDAK menghilangkan kesenjangan — proxy membocorkan informasi kelompok", why: "Benar: harga performanya kecil, tapi kesenjangan approval tetap ada (AIR 0,9211) karena LIMIT_BAL, PAY_0, dan pola bayar berkorelasi dengan SEX. Bukti: probe ROC-AUC 0,6261.", correct: true },
            { text: "ROC-AUC turun membuktikan fitur sensitif adalah fitur terpenting model", why: "Salah: turun 0,0042 adalah penurunan KECIL — SEX/MARRIAGE/EDUCATION justru bukan fitur terpenting. Dan IV SEX yang rendah (0,0092, M2.2) tidak membuktikan model fair — itu dua hal berbeda." },
            { text: "Model tanpa fitur sensitif tidak perlu diaudit lagi — tidak ada yang bisa didiskriminasi", why: "Salah: justru model inilah yang WAJIB diaudit — audit per grup sesudah penghapusan adalah satu-satunya bukti apakah penghapusan itu bekerja. Tanpa audit, «sudah dihapus» hanyalah klaim." },
          ],
        },
        {
          q: "Threshold per grup SEX: laki-laki 0,1058, perempuan 0,0965 (target approval 0,285). Nasabah laki-laki dengan probabilitas 0,10 dan nasabah perempuan dengan probabilitas 0,10 menerima keputusan apa?",
          options: [
            { text: "Keduanya disetujui — 0,10 di bawah kedua threshold", why: "Salah: 0,10 memang di bawah threshold laki-laki (0,1058) tapi DI ATAS threshold perempuan (0,0965). Skor sama, keputusan berbeda — itulah pita inversi." },
            { text: "Laki-laki disetujui, perempuan ditolak — skor sama, keputusan berbeda karena kelompok", why: "Benar: 0,10 < 0,1058 (disetujui) tapi 0,10 > 0,0965 (ditolak). Di pita (0,0965–0,1058] ada 92 laki-laki disetujui vs 151 perempuan ditolak pada skor yang sama.", correct: true },
            { text: "Keduanya ditolak — 0,10 di atas kedua threshold", why: "Salah: 0,10 di BAWAH threshold laki-laki 0,1058, jadi laki-laki itu disetujui. Yang ditolak hanyalah perempuannya." },
            { text: "Laki-laki ditolak, perempuan disetujui — threshold perempuan lebih longgar", why: "Terbalik: threshold perempuan (0,0965) LEBIH KETAT dari laki-laki (0,1058) — karena approval perempuan tadinya lebih tinggi dan harus diturunkan ke 0,285." },
          ],
        },
        {
          q: "Sesudah threshold per grup, biaya total NT$33.046.500 ke NT$32.756.000 (TURUN) dan profit naik. Apa pembacaan yang benar?",
          options: [
            { text: "Mitigasi fairness selalu menghemat biaya — ini sifat metodenya", why: "Salah: notebook flagship sendiri memperingatkan «biasanya menaikkan biaya». Turunnya biaya di data ini adalah kebetulan pertukaran spesifik — jangan hafal arahnya, hitung selalu." },
            { text: "Di data ini mitigasi menghemat biaya — tapi itu temuan empiris, bukan sifat metode; pada data lain biayanya bisa naik", why: "Benar: pertukaran di sini (menyetujui lebih banyak laki-laki berisiko rendah, menolak lebih banyak perempuan berisiko sedang) kebetulan menguntungkan secara biaya. Arahnya harus dihitung ulang di tiap dataset.", correct: true },
            { text: "Angkanya pasti salah hitung — mitigasi tidak mungkin menurunkan biaya dan menaikkan profit sekaligus", why: "Salah: tidak ada hukum yang melarangnya. Biaya turun karena komposisi yang disetujui/ditolak berubah menguntungkan; profit = margin semua nasabah lancar − biaya, jadi keduanya bergerak berlawanan arah secara mekanis." },
            { text: "Biaya turun karena ROC-AUC membaik sesudah mitigasi", why: "Salah: ROC-AUC pada probabilitas model (terkalibrasi) TETAP 0,7816 — modelnya tidak berubah sama sekali. Yang berubah hanyalah aturan keputusannya." },
          ],
        },
        {
          q: "ROC-AUC sesudah threshold per grup: pada probabilitas model (terkalibrasi) tetap 0,7816, pada skor keputusan yang disesuaikan (s = p / threshold_kelompok) menjadi 0,7808. Mengapa ada dua angka?",
          options: [
            { text: "Karena model dilatih ulang saat mitigasi — ROC-AUC mentah seharusnya ikut berubah", why: "Salah: model TIDAK dilatih ulang dalam post-processing. ROC-AUC probabilitas model tetap karena skornya tidak berubah; yang berubah adalah skor keputusan (p dibagi threshold kelompoknya)." },
            { text: "Karena ROC-AUC probabilitas model mengukur MODELNYA (tidak berubah) dan ROC-AUC disesuaikan mengukur ATURAN KEPUTUSANNYA (sedikit berubah)", why: "Benar: threshold tidak menyentuh skor, jadi ranking model tetap. Skor keputusan s = p/t_kelompok adalah ranking yang benar-benar menentukan persetujuan — dan ia sedikit berubah karena tiap kelompok punya ambang berbeda.", correct: true },
            { text: "Karena salah satu angkanya salah hitung — ROC-AUC hanya punya satu definisi", why: "Salah: ROC-AUC memang satu definisi, tapi ia dihitung ATAS SKOR yang berbeda — probabilitas model (terkalibrasi) vs skor keputusan. Keduanya sah; yang penting menyebut skornya." },
            { text: "Karena PR-AUC dan ROC-AUC tertukar — 0,7808 sebenarnya PR-AUC", why: "Salah: PR-AUC disesuaikan adalah 0,5566, angka yang berbeda. Tidak ada yang tertukar — hanya ada dua skor yang berbeda." },
          ],
        },
        {
          q: "EDUCATION: kelompok acuan «Lainnya» n = 82, approval 58,5%. Mengapa Pascasarjana (AIR 0,603) DITANDAI flag dan tidak langsung dimitigasi dengan threshold per grup?",
          options: [
            { text: "Karena AIR 0,603 masih di atas ambang 0,80 — tidak perlu dimitigasi", why: "Salah: 0,603 JAUH di bawah 0,80 — justru itu yang membuatnya tampak mendesak. Alasan flag-nya bukan AIR-nya, melainkan n kelompok acuannya." },
            { text: "Karena threshold kuantil kelompok n = 82 tidak stabil (bootstrap SD 0,0078) dan SE approval-nya ±5,44 — mitigasi di atasnya adalah noise yang dibungkus keputusan", why: "Benar: dengan n = 82, approval 58,5% punya SE ±5,44 poin persen dan threshold kuantilnya bergoyang (bootstrap SD 0,0078, selang 95% (0,0452, 0,0782)). Selidiki dulu atau kumpulkan data lebih banyak.", correct: true },
            { text: "Karena EDUCATION bukan atribut yang dilindungi — hanya SEX yang boleh dimitigasi", why: "Salah: pendidikan memang bukan atribut yang dilindungi seperti SEX dalam banyak kerangka hukum, tapi alasan flag di lesson ini adalah STATISTIK (n kecil), bukan legalitas. Dan «bukan dilindungi» bukan berarti «tidak boleh diaudit»." },
            { text: "Karena threshold per grup hanya bisa dipakai untuk dua kelompok, bukan empat", why: "Salah: threshold per grup bisa dipakai untuk berapa pun kelompok — satu kuantil per kelompok. Masalahnya di sini adalah n = 82, bukan jumlah kelompoknya." },
          ],
        },
        {
          q: "Kurva Pareto lesson ini (λ = 0 → 1) menunjukkan biaya TURUN saat AIR naik. Apa yang harus dilakukan komite kredit dengan kurva seperti ini?",
          options: [
            { text: "Memilih λ = 1 — karena di data ini makin adil makin murah, tidak ada trade-off yang perlu diputuskan", why: "Salah: biaya bukan satu-satunya harga — pita inversi, risiko legalitas, dan pergeseran bad rate per kelompok tetap ada di λ = 1. «Murah» tidak berarti «gratis». Komite tetap harus memilih titiknya dengan paket lengkap." },
            { text: "Memakai kurva untuk memilih titik (misalnya AIR target) dengan harganya tertulis — sambil mencatat bahwa arah kurva ini adalah temuan data, bukan hukum", why: "Benar: kurva mengubah perdebatan menjadi pilihan titik dengan harga tertulis. Dan arahnya yang «salah» menurut intuisi (makin adil makin murah) harus dicatat sebagai temuan data — pada data lain kurva bisa menanjak.", correct: true },
            { text: "Mengabaikan kurva — lima titik interpolasi bukan kurva Pareto yang sah", why: "Salah: lima titik yang dihitung dari data (λ = 0 / 0,25 / 0,5 / 0,75 / 1) ADALAH kurva Pareto yang sah untuk keluarga kebijakan ini — tiap titik adalah satu kebijakan dengan AIR dan biayanya sendiri." },
            { text: "Memilih λ = 0 — karena kurva yang menurun pasti salah hitung", why: "Salah: tidak ada yang salah hitung. Biaya turun karena komposisi persetujuan berubah menguntungkan. Memilih λ = 0 berarti mempertahankan AIR 0,869 tanpa alasan." },
          ],
        },
        {
          q: "Lima λ dicoba di test 6.000; titik terbaik λ = 1 (AIR 0,9999, profit +NT$8.504.500) dilaporkan sebagai hasil final tanpa holdout yang belum tersentuh. Bolehkah titik itu dilaporkan sebagai estimasi final yang unbiased?",
          options: [
            { text: "Tidak — titik terbaik yang dipilih dari test yang sama itu optimistis (winner's curse): protokol yang benar memilih λ di validation dan melaporkannya di test yang belum tersentuh", why: "Benar: λ = 1 dipilih KARENA terlihat terbaik di test 6.000 yang sama — skor terbaik dari sekian percobaan selalu terlihat lebih baik daripada kenyataannya (M6.5). Angka-angka mitigasi lesson ini adalah HASIL ILUSTRASI PROTOKOL LESSON: mereka mengilustrasikan metode dan bentuk trade-off-nya, bukan hasil final. Evaluasi final butuh holdout yang belum dipakai memilih (three-way split, M6.4 langkah 4).", correct: true },
            { text: "Boleh — λ = 1 juga memberi profit tertinggi (+NT$8.504.500), jadi ia terbaik menurut dua metrik sekaligus", why: "Salah: profit tertinggi DI TEST yang sama adalah bagian dari masalah yang sama — ia juga dipilih dari data yang sama. Dua metrik yang optimistis tidak saling mengoreksi; keduanya perlu diukur ulang pada holdout." },
            { text: "Boleh — AIR 0,9999 sudah melewati ambang 0,80 dengan jauh, jadi tidak ada lagi yang perlu dibuktikan", why: "Salah: melewati ambang tidak memperbaiki bias seleksi. AIR 0,9999 yang dipilih dari lima percobaan di test yang sama bisa jadi lebih rendah bila diukur pada data yang belum dipakai memilih — ambang yang dilewati angka optimistis bukan bukti." },
            { text: "Tidak boleh — λ yang benar adalah 0,62 (interpolasi), bukan 1, jadi titik λ = 1 salah", why: "Salah alasan: λ = 0,62 adalah titik untuk TARGET AIR 0,95 — bukan «λ yang benar» secara umum. Masalahnya bukan nilai λ-nya, melainkan PROTOKOLNYA: titik mana pun yang dipilih dari test yang sama lalu dilaporkan sebagai final adalah optimistis, termasuk λ = 0,62." },
          ],
        },
        {
          q: "Paket keputusan mitigasi berisi model version, threshold policy (0,1058/0,0965), approval date, dan owner — tapi TIDAK berisi data snapshot dan code/notebook hash. Apa risikonya?",
          options: [
            { text: "Keputusan tidak bisa direproduksi — tidak ada yang bisa membuktikan data dan kode mana yang menghasilkan angka AIR 0,9999 itu", why: "Benar: reproduksi butuh SEPULUH kolom — data snapshot (UCI 30.000, split seed 42) dan code hash adalah yang mengikat angka ke sumbernya. Tanpa keduanya, paket itu hanya klaim dengan nama penanggung jawab: angkanya tidak bisa diperiksa ulang, dan audit setahun kemudian tidak bisa membedakan «angka dari model v2» dari «angka dari model yang lain».", correct: true },
            { text: "Tidak ada risiko — angka hasil (AIR, biaya, profit) sudah cukup untuk membuktikan keputusan itu benar", why: "Salah: angka hasil tanpa sumbernya tidak bisa diperiksa ulang. AIR 0,9999 bisa berasal dari model, data, atau kode apa saja — tanpa snapshot dan hash, tidak ada yang bisa membuktikan ia berasal dari v2." },
            { text: "Risikonya hanya administratif — audit akan meminta dokumen tambahan, tapi keputusannya tetap sah", why: "Salah arah: audit yang tidak bisa mereproduksi angka adalah audit yang GAGAL — bukan yang «meminta dokumen tambahan». Keputusan yang tidak bisa diperiksa ulang bukan keputusan yang sah secara tata kelola." },
            { text: "Risikonya kecil — cukup tambahkan nama penyetuju kedua dan paketnya lengkap", why: "Salah: nama penyetuju tidak menggantikan data snapshot dan code hash. Dua nama tidak membuat angka bisa direproduksi; yang membuat bisa direproduksi adalah jejak data dan kode." },
          ],
        },
      ],
      summary: [
        "Audit M7.1–M7.3 [notebook]: AIR SEX 0,869 (approval laki-laki 26,1% vs perempuan 30,1%, threshold 0,10, test 6.000); EDUCATION Pascasarjana AIR 0,603 TERTANDA flag (kelompok acuan «Lainnya» n = 82); arah berlawanan dari celah yang sama adalah AIR 1,1502 (perempuan/laki-laki, M2.2) — selalu nyatakan arah AIR-mu.",
        "Pre-processing [notebook]: reweighing (w = P(g)×P(y)/P(g, y)) → AIR 0,9567; resampling (train 24.000 ke 46.068 baris) → AIR 0,9788; hapus fitur sensitif → AIR 0,9211, ROC-AUC mentah 0,7781 (dari 0,7823) — tapi probe memprediksi SEX dari fitur tersisa dengan ROC-AUC 0,6261: proxy bocor, hapus kolom tidak menghapus informasi.",
        "In-processing [notebook]: reductions versi sederhana (fairlearn tidak terpasang), 2 ronde pembobotan ulang ×1,5 → AIR 0,9233, ROC-AUC 0,7810 — constraint eksplisit saat pelatihan, tanpa jaminan di test dan tanpa randomisasi model.",
        "Post-processing [notebook]: threshold per grup SEX 0,1058/0,0965 (target approval 0,285) → AIR 0,9999, selisih approval 0,0393 ke 0,0000, selisih FPR 0,0383 ke 0,0076, selisih FNR 0,0191 ke 0,0024, biaya NT$33.046.500 ke NT$32.756.000, profit +NT$8.214.000 ke +NT$8.504.500, akurasi 0,4682 ke 0,4687.",
        "ROC-AUC/PR-AUC sesudah mitigasi [notebook]: probabilitas model (terkalibrasi) tetap 0,7816/0,5558 (model tidak berubah); skor keputusan disesuaikan (s = p/threshold_kelompok) 0,7808/0,5566 — sebut skornya bila menyodorkan angka.",
        "Kurva Pareto [notebook]: lima titik λ = 0 / 0,25 / 0,5 / 0,75 / 1 — di data ini makin adil makin murah (biaya 33.046.500 ke 32.756.000), kebetulan data, bukan hukum; pilih titik dengan harga tertulis.",
        "Kapan mitigasi salah [notebook]: pita inversi (0,0965–0,1058] — 92 laki-laki disetujui vs 151 perempuan ditolak pada skor yang sama; legalitas threshold per grup adalah pertimbangan (konsultasi hukum + OJK), bukan nasihat hukum; EDUCATION «Lainnya» n = 82 (SE approval ±5,44, bootstrap SD threshold 0,0078) tidak boleh disamakan threshold-nya.",
        "Dokumentasi: alasan + angka sebelum/sesudah + harga dan risiko yang diterima + penyetuju (nama, tanggal) — disimpan bersama model card, dibuka lagi tiap model dilatih ulang.",
        "Protokol validasi [ilustrasi protokol lesson]: SEMUA angka mitigasi di lesson ini dihitung pada test 6.000 yang sama — reweighing dihitung dari train (benar), tapi λ, target AIR, dan threshold per grup dipilih sambil melihat test. Protokol benar: train → validation (pilih mitigasi/λ/threshold) → test final yang belum tersentuh (laporkan sekali); three-way split M6.4.",
        "Template tata kelola: sepuluh kolom wajib (model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, alasan perubahan) + change control enam gerbang (proposal → offline validation → legal/risk approval → shadow/canary → production → rollback criteria); rollback v2 = threshold tunggal 0,10.",
        "Lab: AIR 0,8693 / 1,1502 dan bobot reweighing dari hitungan train 24.000; threshold per grup 0,1058/0,0965 dengan cost_change −290.500 (negatif = biaya turun di data ini).",
      ],
      next: { label: "Lanjut: MLF-M7.5 — Monitoring & Drift", href: "/v2/learn/mlf-m75-monitoring-drift" },
    },
  ],
};

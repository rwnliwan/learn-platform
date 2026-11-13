import type { V2Lesson } from "../lib/types";

export const mlfM64: V2Lesson = {
  slug: "mlf-m64-calibration-threshold-selection",
  track: "Machine Learning Finance",
  module: "Tuning & model selection",
  title: "MLF-M6.4 — Kalibrasi & Threshold: Ketika Skor 0,8 Berbohong",
  estMinutes: 75,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Skor 0,8 yang berbohong — ranking bagus, probabilitas palsu",
      prose: [
        "Bayangkan kamu analis kredit. Modelmu memberi seorang nasabah skor 0,8 — dan kamu membaca: «nasabah ini punya peluang default 80%». Kamu menolaknya. Lalu kamu memeriksa: dari 100 nasabah lain yang juga mendapat skor sekitar 0,8, hanya 52 yang benar-benar default. [Ilustrasi: angka 52 ini ilustrasi model yang mis-kalibrasi — GBM di lesson ini justru terkalibrasi baik di bin skor tinggi (aktual 0,7481 vs prediksi 0,7441), lihat langkah 6.] Skor 0,8 itu ternyata bukan peluang 80% — ia hanya berarti «nasabah ini LEBIH berisiko daripada yang berskor 0,3». Modelmu pandai mengurutkan, tapi berbohong soal angka.",
        "Itulah beda antara ranking dan kalibrasi. Ranking menjawab «siapa lebih berisiko dari siapa» — diukur ROC-AUC dan PR-AUC. Kalibrasi menjawab «apakah angka 0,8 itu sungguh berarti 80 dari 100 kejadian» — diukur reliability diagram, ECE, dan Brier score. Lesson ini tentang pertanyaan kedua — plus pertanyaan lanjutannya yang menentukan uang: setelah probabilitasnya bisa dipercaya, di ambang berapa kamu menyetujui pinjaman?",
        "Konteks angka lesson ini [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model flagship dari M1–M3 — logistic regression (LR) dan gradient boosting (GBM). ROC-AUC test: LR 0,7426, GBM 0,7823. PR-AUC: LR 0,5049, GBM 0,5597. Brier score: LR 0,1427, GBM mentah 0,1342 (terbaik); GBM + Platt 0,1345. Semua angka kalibrasi dan threshold di lesson ini dihitung pada test 6.000 yang sama — angka-angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON, bukan template evaluasi final yang bebas seleksi; dalam praktik, calibration + threshold dipilih di data calibration/validation, dan test final hanya dibuka sekali. Model keputusan untuk tabel threshold adalah GBM terkalibrasi (Platt/sigmoid).",
        "Peta lesson: cerita skor yang berbohong → apa itu kalibrasi → ECE + Brier dengan angka kanonis → three-way split: calibration dan threshold dipilih tanpa melihat final test → Platt vs isotonic (yang di data ini TIDAK membantu) → worked example dua bin reliability → kapan kalibrasi diperlukan dan kapan tidak → threshold bukan 0,5 → threshold cost-sensitive (LGD 45% vs margin 5%) → operating points: threshold dari constraint bisnis → jebakan expected-loss minimum yang degenerat → peta keputusan → 4 lab → checkpoint.",
        "Nilai: kalibrasi adalah jembatan antara «model yang pandai mengurutkan» dan «keputusan yang bisa dipertanggungjawabkan». Threshold 0,10 yang optimal di lesson ini hanya bermakna bila probabilitas 0,10 itu sendiri jujur — bila skor 0,10 sebenarnya berarti peluang default 20%, seluruh perhitungan biaya di langkah 8–9 runtuh.",
        "Baik atau buruk: ROC-AUC 0,7823 (GBM) itu bagus sebagai ukuran ranking — model memisahkan nasabah default dari yang tidak dengan cukup baik. Buruk bila dibaca sebagai «probabilitasnya bisa dipercaya»: ROC-AUC TIDAK mengukur itu sama sekali. Model dengan ROC-AUC 0,99 pun bisa terkalibrasi buruk — misal semua skornya menumpuk di 0,49 dan 0,51 sementara peluang sebenarnya 0,05 dan 0,95.",
        "Mitigasi: jangan pernah memakai probabilitas model untuk keputusan uang sebelum memeriksa kalibrasinya — reliability diagram + ECE dulu (langkah 2–3), baru putuskan apakah kalibrasi ulang diperlukan (langkah 7).",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: ROC-AUC tinggi berarti probabilitasnya benar",
        type: "pitfall",
        body: "Yang benar: ROC-AUC hanya mengukur URUTAN — apakah nasabah yang default mendapat skor lebih tinggi daripada yang tidak. Ia tidak peduli apakah skor 0,8 berarti 80% atau 52%. Di data ini GBM punya ROC-AUC 0,7823 [notebook] — ranking yang lumayan — dan kalibrasinya baru terbukti lewat reliability diagram di langkah 6, bukan lewat ROC-AUC.",
      },
    },
    {
      id: "apa-kalibrasi",
      eyebrow: "Langkah 2 · Apa itu kalibrasi",
      title: "Kalibrasi: ketika model berkata 0,8, sungguhkah 80 dari 100?",
      prose: [
        "Model terkalibrasi sempurna berarti: kumpulkan semua nasabah yang modelnya berkata «peluang default 0,3» — tepat 30 dari 100 di antaranya benar-benar default. Kumpulkan yang dikatakan 0,7 — tepat 70 dari 100 default. Probabilitas yang keluar dari model sama dengan frekuensi kejadian yang sebenarnya.",
        "Alat untuk memeriksanya adalah reliability diagram: bagi prediksi ke dalam bin (misal [0,0–0,1), [0,1–0,2), dan seterusnya sampai [0,9–1,0]), lalu untuk tiap bin plot prediksi rata-rata (sumbu-x) melawan tingkat aktual (sumbu-y). Model yang terkalibrasi sempurna menempel pada garis diagonal — prediksi = aktual. Titik di ATAS diagonal berarti model MEREMEHKAN risiko (aktual lebih tinggi dari prediksi); titik di BAWAH diagonal berarti model MELEBIH-LEBIHKAN risiko.",
        "Nilai: reliability diagram adalah SATU gambar yang menjawab pertanyaan kalibrasi tanpa satu pun asumsi tambahan — ia hanya menghitung frekuensi. Tidak ada model yang «diasumsikan» benar, tidak ada distribusi yang ditebak: bin, hitung rata-rata prediksi, hitung frekuensi aktual, bandingkan.",
        "Baik atau buruk: reliability diagram bagus karena jujur dan mudah dibaca — penyimpangan dari diagonal langsung terlihat. Buruk bila dibaca tanpa memperhatikan n per bin: bin [0,8–0,9) GBM mentah di data ini hanya berisi 33 nasabah [notebook] — satu nasabah pindah kelompok mengubah tingkat aktualnya 3 poin persen. Bin dengan n kecil adalah rumor, bukan bukti (langkah 6).",
        "Mitigasi: selalu baca reliability diagram BERSAMA n per bin dan ECE (langkah 3). Bin besar yang menyimpang = masalah nyata; bin kecil yang menyimpang = kemungkinan besar noise.",
      ],
      formula: String.raw`\text{terkalibrasi sempurna} \iff \mathbb{P}(y = 1 \mid \hat{p} = p) = p \quad \text{untuk semua } p`,
      formulaNote: "Definisi kalibrasi sempurna: di antara semua kasus yang modelnya memprediksi probabilitas p, tepat p fraksinya benar-benar berlabel 1. Reliability diagram memeriksa definisi ini per bin.",
      tasks: [],
    },
    {
      id: "ece-brier",
      eyebrow: "Langkah 3 · ECE + Brier",
      title: "ECE dan Brier: dua angka untuk «seberapa bohong» probabilitasmu",
      prose: [
        "ECE (Expected Calibration Error) sudah kamu kenal dari MLE4 — ringkasnya: ECE adalah rata-rata |prediksi − aktual| per bin, dibobot jumlah nasabah di tiap bin. ECE 0 berarti sempurna; makin besar, makin bohong. Brier score adalah rata-rata kuadrat selisih antara probabilitas prediksi dan label aktual (0/1) — ia menghukum probabilitas yang salah DAN yang terlalu percaya diri sekaligus, dan ia mengukur kalibrasi sekaligus ketajaman (sharpness). Fokus baru lesson ini: membaca keduanya BERSAMA pada model yang sama, dan membandingkan sebelum vs sesudah kalibrasi ulang.",
        "Nilai [notebook] — test 6.000 nasabah, 10 bin: LR mentah Brier 0,1427, ECE 0,0160. LR + Platt Brier 0,1427, ECE 0,0160. LR + isotonic Brier 0,1427, ECE 0,0163. GBM mentah Brier 0,1342, ECE 0,0073 — TERBAIK di antara semuanya. GBM + Platt Brier 0,1345, ECE 0,0087. Perhatikan: ECE GBM mentah (0,0073) kurang dari SETENGAH ECE LR (0,0160) — dan Brier GBM (0,1342) juga lebih rendah dari LR (0,1427). GBM bukan hanya ranking-nya lebih baik (ROC-AUC 0,7823 vs 0,7426); probabilitasnya juga lebih jujur.",
        "Baik atau buruk: ECE 0,0073 itu bagus — artinya rata-rata tertimbang, probabilitas GBM meleset hanya 0,73 poin persen dari frekuensi aktual. Sebagai band acuan: ECE 0,0160 (LR) berarti meleset 1,6 poin persen — masih kecil dalam nilai absolut, tapi lebih dari dua kali lipat GBM. Buruk bila ECE dibaca sendirian: ECE 0 bisa terjadi pada model yang selalu memprediksi base rate 0,2212 untuk semua orang — terkalibrasi sempurna, tapi tidak berguna (tidak membedakan siapa pun). Itulah mengapa Brier ikut dibaca: Brier menghukum model yang tidak tajam.",
        "Mitigasi: laporkan ECE dan Brier berpasangan, dan bandingkan antar model pada data calibration/validation yang SAMA. Bila ECE kecil tapi Brier besar, modelmu jujur tapi tumpul — ia tidak berani membedakan. Bila Brier kecil tapi ECE besar, modelmu tajam tapi berbohong — berbahaya untuk keputusan uang.",
      ],
      formula: String.raw`\mathrm{ECE} = \sum_{b=1}^{B} \frac{n_b}{N}\, \bigl|\bar{p}_b - \bar{y}_b\bigr|, \qquad \mathrm{Brier} = \frac{1}{N} \sum_{i=1}^{N} (\hat{p}_i - y_i)^2`,
      formulaNote: "ECE: selisih |prediksi rata-rata − tingkat aktual| per bin b, dibobot n_b/N. Brier: rata-rata kuadrat (probabilitas prediksi − label aktual) per nasabah. Keduanya makin kecil makin baik.",
      tasks: [],
    },
    {
      id: "three-way-split",
      eyebrow: "Langkah 4 · Three-way split",
      title: "Three-way split: calibration dan threshold dipilih tanpa melihat final test",
      prose: [
        "Sebelum masuk ke Platt vs isotonic, berhenti sejenak — karena ada yang janggal dengan cara lesson ini menghitung angkanya. Threshold 0,10 «dipilih» karena ia terlihat terbaik pada test 6.000 yang sama tempat ia dinilai. Sementara M6.5 melarang keras memakai test «untuk memilih model, memilih threshold, atau memilih konfigurasi». Jadi: apakah lesson ini melanggar aturannya sendiri? Jawabannya: ya, bila angka-angka ini dibaca sebagai template evaluasi final — dan tidak, bila dibaca sebagaimana mestinya: sebagai HASIL ILUSTRASI PROTOKOL LESSON. Labelnya, ditulis eksplisit agar tidak ada yang salah baca: semua angka kalibrasi dan threshold di lesson ini dihitung pada test 6.000 yang sama — angka-angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON, bukan template evaluasi final yang bebas seleksi; dalam praktik, calibration + threshold dipilih di data calibration/validation, dan test final hanya dibuka sekali.",
        "Protokol yang benar memakai TIGA bagian data, bukan dua. Train — tempat model dilatih. Calibration/validation — tempat SEMUA pilihan dibuat: metode kalibrasi (Platt, isotonic, atau tanpa kalibrasi), konfigurasi model, dan threshold. Final test — tempat seluruh prosedur dievaluasi, dibuka SEKALI di akhir, dan tidak ada satu pun keputusan yang diambil sesudahnya. Bila setelah melihat final test kamu mengubah threshold dari 0,15 menjadi 0,10 karena 0,10 «kelihatan lebih baik», final test-mu sudah bukan test lagi — ia sudah menjadi validation kedua, dan angka yang kamu laporkan adalah angka yang sudah dipilih-untuk-terlihat-baik (winner's curse, topik M6.5).",
        "Nilai [ilustrasi]: contoh pembagian 30.000 nasabah menjadi train 18.000, calibration/validation 6.000, dan final test 6.000. Angka ini BUKAN dari notebook — ia contoh pembagian, bukan angka kanonis. Yang kanonis adalah PRINSIPNYA: pilihan dibuat sebelum final test dibuka, evaluasi dilakukan sesudahnya, dan keduanya tidak pernah memakai data yang sama. Harga yang dibayar: train-mu lebih kecil (18.000 bukan 24.000), jadi modelmu sedikit lebih lemah — tapi angka evaluasimu jujur. Itulah tukar-tambah yang benar: sedikit data latihan ditukar dengan evaluasi yang bisa dipercaya.",
        "Baik atau buruk: three-way split bagus karena ia memisahkan «memilih» dari «menilai» secara fisik — tidak ada godaan untuk mengintip, karena datanya memang belum dibuka. Buruk bila dibaca sebagai «buang-buang data»: pada data kecil, menyisihkan 6.000 baris untuk calibration/validation terasa mahal — alternatifnya adalah cross-validation di dalam train untuk memilih, lalu satu final test di akhir (itulah yang dilakukan M6.2 dengan nested CV). Yang TIDAK boleh adalah jalan pintas lesson ini: memilih di test yang sama dengan tempat menilai. Lesson ini memakai jalan pintas itu HANYA agar angkanya bisa dihitung dalam satu notebook — dan karena itu semua angkanya berlabel ilustrasi protokol, bukan vonis final.",
        "Mitigasi: sebelum membuka final test, jawab checklist ini — «Apakah calibration, threshold, dan model dipilih tanpa melihat final test?» — ketiganya harus YA: (1) Apakah calibration method (Platt/isotonic/tanpa kalibrasi) dipilih tanpa melihat final test? (2) Apakah threshold dipilih tanpa melihat final test? (3) Apakah model (LR vs GBM, dan konfigurasinya) dipilih tanpa melihat final test? Satu jawaban TIDAK berarti final test-mu sudah bocor — apa pun yang kamu laporkan sesudahnya bukan evaluasi, melainkan laporan latihan. Tulis jawaban checklist ini di samping setiap model yang masuk produksi, lengkap dengan tanggal dan pembagian datanya.",
        "Lab langkah ini memakai angka kalibrasi [ilustrasi] — biaya total per threshold di data calibration 6.000: 0,10 → NT$34.200.000; 0,15 → NT$33.800.000; 0,20 → NT$41.000.000 — melawan biaya final test kanonis [notebook]: 0,10 → NT$33.046.500; 0,15 → NT$35.770.000; 0,20 → NT$41.477.000. Hasil yang diharapkan [lab]: best_calib_threshold=0.15; final_cost_chosen=35770000; best_test_threshold=0.10; optimism_gap=2723500. Perhatikan: threshold TERBAIK di kalibrasi (0,15) BUKAN yang terbaik di test (0,10) — dan laporan yang jujur adalah biaya 0,15 di test (NT$35.770.000), bukan biaya 0,10 yang baru kamu pilih setelah mengintip test.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Three-way split: train 18.000 untuk latih model, calibration-validation 6.000 untuk memilih kalibrasi dan threshold, final test 6.000 terkunci dan dibuka sekali untuk evaluasi akhir">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Three-way split — pilih dulu, nilai belakangan</text>
<rect x="387" y="24" width="18" height="13" rx="2" fill="var(--c2)"/>
<path d="M390 24 v-3 a6 6 0 0 1 12 0 v3" fill="none" stroke="var(--c2)" stroke-width="2"/>
<rect x="16" y="48" width="136" height="84" fill="var(--c1)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="172" y="48" width="136" height="84" fill="var(--c4)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="328" y="48" width="136" height="84" fill="var(--c2)" opacity="0.18" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="154" y1="90" x2="168" y2="90" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="168,90 160,86 160,94" fill="var(--chart-text)"/>
<line x1="310" y1="90" x2="324" y2="90" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="324,90 316,86 316,94" fill="var(--chart-text)"/>
<text x="84" y="70" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TRAIN</text>
<text x="84" y="88" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">latih model</text>
<text x="84" y="106" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">n = 18.000</text>
<text x="240" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">CALIBRATION</text>
<text x="240" y="84" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">VALIDATION</text>
<text x="240" y="102" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">pilih kalibrasi</text>
<text x="240" y="116" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">+ threshold</text>
<text x="396" y="70" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">FINAL TEST</text>
<text x="396" y="88" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TERKUNCI</text>
<text x="396" y="106" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">dibuka SEKALI</text>
<text x="240" y="152" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Semua pilihan — model, Platt/isotonic, threshold — dibuat di train + validation.</text>
<text x="240" y="170" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Final test dibuka SEKALI, di akhir, untuk evaluasi seluruh prosedur.</text>
<text x="240" y="188" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Memilih ulang setelah melihat final test = seleksi di test (dilarang M6.5).</text>
<text x="240" y="206" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Contoh pembagian 30.000: train 18.000 · calibration/validation 6.000 · final test 6.000 [ilustrasi].</text>
<text x="240" y="224" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Harga: train lebih kecil — tapi angka evaluasinya jujur.</text>
</svg>`,
        alt: "Three-way split: train 18.000 untuk latih model; calibration-validation 6.000 untuk memilih kalibrasi dan threshold; final test 6.000 terkunci, dibuka sekali untuk evaluasi akhir.",
        caption: "Cara membaca: panah mengalir dari train ke calibration/validation ke final test — dan TIDAK PERNAH kembali. Final test yang sudah dibuka tidak bisa dipakai untuk memilih ulang; memilih ulang sesudahnya berarti test-mu sudah menjadi validation. Contoh pembagian 30.000 [ilustrasi]; yang kanonis adalah prinsip pemisahannya, bukan angkanya.",
      },
      tasks: [
        { id: "t1", text: "Pilih threshold terbaik di data kalibrasi: biaya total TERKECIL" },
        { id: "t2", text: "Laporkan biaya threshold itu di final test — TANPA memilih ulang" },
        { id: "t3", text: "Hitung optimism gap: selisih biaya threshold pilihan-kalibrasi vs threshold terbaik-di-test" },
      ],
      expected: "best_calib_threshold=0.15\nfinal_cost_chosen=35770000\nbest_test_threshold=0.10\noptimism_gap=2723500",
      hints: [
        "Threshold terbaik di kalibrasi = biaya TERKECIL di CALIB_COST: 0,10 → 34.200.000; 0,15 → 33.800.000; 0,20 → 41.000.000.",
        "final_cost_chosen = TEST_COST[best_calib_threshold] — baca dari tabel test, jangan pilih ulang minimumnya.",
        "optimism_gap = final_cost_chosen − TEST_COST[best_test_threshold]: harga yang dibayar bila kamu memilih ulang di test (NT$2.723.500).",
      ],
      code: {
        starter: `# Three-way split: pilih threshold di data kalibrasi, evaluasi SEKALI di final test
# CALIB_COST [ilustrasi] vs TEST_COST [notebook] — biaya total (NT$) per threshold
CALIB_COST = {0.10: 34200000, 0.15: 33800000, 0.20: 41000000}
TEST_COST = {0.10: 33046500, 0.15: 35770000, 0.20: 41477000}

best_calib_threshold = 0.0  # TODO: threshold dengan biaya TERKECIL di CALIB_COST
final_cost_chosen = 0  # TODO: biaya threshold itu di TEST_COST (tanpa memilih ulang!)
best_test_threshold = 0.0  # TODO: threshold dengan biaya TERKECIL di TEST_COST
optimism_gap = 0  # TODO: final_cost_chosen - TEST_COST[best_test_threshold]
print(f"best_calib_threshold={best_calib_threshold:.2f}")
print(f"final_cost_chosen={final_cost_chosen}")
print(f"best_test_threshold={best_test_threshold:.2f}")
print(f"optimism_gap={optimism_gap}")`,
        lockLines: 5,
        solution: `# Three-way split: pilih threshold di data kalibrasi, evaluasi SEKALI di final test
# CALIB_COST [ilustrasi] vs TEST_COST [notebook] — biaya total (NT$) per threshold
CALIB_COST = {0.10: 34200000, 0.15: 33800000, 0.20: 41000000}
TEST_COST = {0.10: 33046500, 0.15: 35770000, 0.20: 41477000}

best_calib_threshold = min(CALIB_COST, key=CALIB_COST.get)
final_cost_chosen = TEST_COST[best_calib_threshold]
best_test_threshold = min(TEST_COST, key=TEST_COST.get)
optimism_gap = final_cost_chosen - TEST_COST[best_test_threshold]
print(f"best_calib_threshold={best_calib_threshold:.2f}")
print(f"final_cost_chosen={final_cost_chosen}")
print(f"best_test_threshold={best_test_threshold:.2f}")
print(f"optimism_gap={optimism_gap}")`,
        checks: [
          { kind: "equal", task: "t1", name: "best_calib_threshold", value: 0.15, tol: 0.00005, label: "`best_calib_threshold` seharusnya 0.15", msg: "Di data kalibrasi [ilustrasi], biaya terendah ada di 0,15 (NT$33.800.000) — bukan 0,10." },
          { kind: "equal", task: "t2", name: "final_cost_chosen", value: 35770000, tol: 0.5, label: "`final_cost_chosen` seharusnya 35770000", msg: "Threshold 0,15 yang dipilih di kalibrasi biayanya NT$35.770.000 di final test [notebook] — dilaporkan apa adanya, tanpa memilih ulang." },
          { kind: "stdout_matches", task: "t3", pattern: "optimism_gap=2723500", label: "Output menampilkan optimism_gap=2723500", msg: "Memilih ulang di test akan mengklaim 0,10 (NT$33.046.500) — optimistis NT$2.723.500 dibanding laporan jujur 0,15." },
          { kind: "equal", task: "t3", name: "optimism_gap", value: 2723500, tol: 0.5, label: "`optimism_gap` seharusnya 2723500", msg: "35.770.000 − 33.046.500 = 2.723.500 — itulah harga seleksi-di-test pada contoh ini." },
        ],
      },
      note: {
        title: "Kontradiksi M6.4 vs M6.5 — diselesaikan, bukan disembunyikan",
        type: "risk",
        body: "M6.5 melarang memakai test untuk memilih threshold; M6.4 memilih threshold 0,10 pada test 6.000 yang sama. Keduanya benar sekaligus HANYA bila angka M6.4 dibaca sebagai ilustrasi protokol lesson — bukan sebagai evaluasi final. Bila kamu meniru cara lesson ini menghitung angka (pilih di test, nilai di test yang sama) pada pekerjaan nyata, kamu melanggar M6.5 — dan angka labamu optimistis sebesar optimism gap di lab ini (NT$2.723.500 pada contoh).",
      },
    },
    {
      id: "platt-vs-isotonic",
      eyebrow: "Langkah 5 · Platt vs isotonic",
      title: "Platt vs isotonic: dua cara memperbaiki — yang di data ini tidak memperbaiki apa pun",
      prose: [
        "Bila reliability diagram menunjukkan modelmu berbohong, ada dua perbaikan standar. Platt scaling (sigmoid): pasang kurva logistik pada skor mentah — ia belajar dua parameter (a, b) yang memetakan skor menjadi probabilitas lewat p_kal = 1 / (1 + exp(a·s + b)). Bentuknya kaku (satu kurva-S), tapi hanya butuh sedikit data dan tidak mudah overfit. Isotonic regression: pasang fungsi tangga MONOTON (naik terus, tidak pernah turun) yang bebas bentuknya — jauh lebih fleksibel, tapi butuh BANYAK data kalibrasi dan mudah overfit bila datanya sedikit. Keduanya dipasang pada data kalibrasi yang terpisah dari training — di sini lewat CalibratedClassifierCV dengan cv=3 (detail implementasi notebook, bukan angka kanonis) — dan keduanya TIDAK mengubah ranking: keduanya monoton terhadap skor mentah, jadi urutannya tetap — perubahan ROC-AUC 0,0007 (0,7823 → 0,7816) berasal dari rata-rata 3 fold kalibrasi, bukan dari pergeseran ranking.",
        "Nilai [notebook] — dan inilah kejujuran utama lesson ini: kalibrasi ulang TIDAK memperbaiki apa pun di data ini. LR mentah Brier 0,1427 / ECE 0,0160 → LR + Platt 0,1427 / 0,0160 (IDENTIK sampai 4 desimal), LR + isotonic 0,1427 / 0,0163 (ECE malah sedikit MEMBURUK). GBM mentah 0,1342 / 0,0073 → GBM + Platt 0,1345 / 0,0087 (Brier naik 0,0003, ECE naik 0,0014 — keduanya MEMBURUK sedikit). Model terbaik menurut Brier adalah GBM MENTAH, tanpa kalibrasi ulang apa pun.",
        "Baik atau buruk: Platt bagus bila skor mentahnya berbentuk kurva-S yang bergeser — misal SVM atau boosting yang skornya terlalu ekstrem. Buruk bila dipakai buta-buta: di sini ia menggeser probabilitas GBM yang SUDAH benar, sehingga ECE naik dari 0,0073 ke 0,0087. Isotonic bagus bila datanya besar dan bentuk mis-kalibrasinya aneh. Buruk di data ini: ECE LR + isotonic 0,0163 vs mentah 0,0160 — fleksibilitasnya justru menangkap noise, bukan sinyal.",
        "Mitigasi: JANGAN ajarkan — dan jangan lakukan — «Platt/isotonic selalu membantu». Urutan yang benar: cek dulu (reliability diagram + ECE, langkah 2–3); kalibrasi ulang HANYA bila ECE-nya besar; lalu bandingkan sebelum vs sesudah pada data calibration/validation yang sama — dan berani membuang hasil kalibrasi bila angkanya memburuk, seperti yang terjadi di sini. Di data ini keputusan yang benar adalah: pakai GBM mentah.",
      ],
      formula: String.raw`p_{\mathrm{Platt}} = \frac{1}{1 + \exp(a\, s + b)}, \qquad p_{\mathrm{iso}} = g(s), \; g \text{ monoton naik (fungsi tangga)}`,
      formulaNote: "Platt: dua parameter (a, b) memetakan skor s lewat kurva logistik. Isotonic: fungsi tangga monoton bebas bentuk — fleksibel, tapi rakus data. Keduanya monoton, jadi ranking (ROC-AUC) nyaris tak berubah: GBM 0,7823 → 0,7816 setelah Platt.",
      tasks: [],
      note: {
        title: "Miskonsepsi: kalibrasi ulang selalu memperbaiki model",
        type: "pitfall",
        body: "Yang benar: di data ini TIDAK. GBM mentah sudah terkalibrasi baik (ECE 0,0073, terbaik) — Platt malah menaikkan Brier 0,1342 → 0,1345 dan ECE 0,0073 → 0,0087; isotonic menaikkan ECE LR 0,0160 → 0,0163. Kalibrasi ulang adalah OBAT, bukan vitamin: diminum bila ada penyakitnya (ECE besar), bukan sebagai rutinitas. Cek dulu, baru putuskan.",
      },
    },
    {
      id: "worked-bins",
      eyebrow: "Langkah 6 · Worked example",
      title: "Membaca reliability diagram GBM: dua bin, dua cerita",
      prose: [
        "Sekarang baca gambarnya. Reliability diagram di bawah memplot 9 bin GBM mentah yang berisi nasabah (bin [0,9–1,0) kosong — tidak ada nasabah yang diprediksi di atas 0,9) [notebook]. Titik-titiknya menempel dekat diagonal — itulah ECE 0,0073 yang kamu lihat sebagai gambar.",
        "Nilai [notebook] — dua bin contoh. Bin [0,2–0,3): n = 752 nasabah, prediksi rata-rata 0,2419, tingkat aktual 0,2221. Selisihnya 0,0198 — model sedikit MELEBIH-LEBIHKAN risiko di bin ini: dari 752 nasabah, yang benar-benar default 167 orang (0,2221 × 752), sementara prediksi rata-rata menyiratkan sekitar 182 orang. Bin [0,7–0,8): n = 258 nasabah, prediksi rata-rata 0,7441, tingkat aktual 0,7481. Selisihnya hanya 0,0040 — nyaris sempurna: 193 dari 258 benar-benar default (0,7481 × 258), dan prediksinya 0,7441. Bin kecil tapi akurat — inilah yang ECE hargai: bin ini menyumbang hanya (258/6.000) × 0,0040 = 0,0002 ke ECE.",
        "Perhatikan juga bin-bin lain [notebook]: [0,0–0,1) n = 1.791, prediksi 0,0647 vs aktual 0,0670 (selisih 0,0023 — sangat baik, dan bin TERBESAR, jadi buktinya kuat); [0,5–0,6) n = 156, prediksi 0,5545 vs aktual 0,5064 (selisih 0,0481 — penyimpangan terbesar KEDUA setelah bin [0,8–0,9) sebesar 0,0485, tapi n kecil, jadi sumbangannya ke ECE hanya (156/6.000) × 0,0481 = 0,0013); [0,8–0,9) n = 33, prediksi 0,8303 vs aktual 0,8788 (selisih 0,0485 — besar, tapi n = 33: satu nasabah pindah mengubah aktual 3 poin persen, jadi jangan ditafsir berlebihan).",
        "Baik atau buruk: bin [0,2–0,3) bagus sebagai contoh «penyimpangan kecil yang nyata» — n = 752 cukup besar sehingga selisih 0,0198 bukan sekadar noise, tapi cukup kecil sehingga tidak mengubah keputusan. Bin [0,7–0,8) bagus sebagai contoh «kalibrasi yang bisa dipercaya di ujung berisiko» — justru di daerah yang menentukan penolakan pinjaman. Buruk bila kamu membaca bin [0,8–0,9) sebagai «model meremehkan risiko tinggi»: n = 33 terlalu kecil untuk vonis itu.",
        "Mitigasi: untuk tiap bin, tanyakan dua hal sebelum bereaksi: (1) berapa n-nya? (2) berapa sumbangan tertimbangnya ke ECE? Reaksi hanya untuk bin dengan n besar DAN sumbangan besar. Di data ini tidak ada bin seperti itu — itulah alasan GBM mentah lolos tanpa kalibrasi ulang.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Reliability diagram GBM mentah: 9 bin menempel dekat diagonal; bin 0,2 sampai 0,3 prediksi 0,2419 vs aktual 0,2221; bin 0,7 sampai 0,8 prediksi 0,7441 vs aktual 0,7481">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Reliability diagram — GBM mentah, test 6.000 (ECE 0,0073)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="30" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="170.8" x2="52" y2="170.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="173.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="135.6" x2="52" y2="135.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="138.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="100.4" x2="52" y2="100.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="103.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<line x1="48" y1="65.2" x2="52" y2="65.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="68.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,8</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1,0</text>
<text x="259" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">prediksi rata-rata per bin (sumbu-x) vs tingkat aktual (sumbu-y)</text>
<circle cx="78.8" cy="194.2" r="4" fill="var(--c1)"/>
<circle cx="111.0" cy="180.7" r="4" fill="var(--c1)"/>
<circle cx="152.1" cy="166.9" r="5" fill="var(--c1)"/>
<circle cx="195.7" cy="141.4" r="4" fill="var(--c1)"/>
<circle cx="236.9" cy="128.6" r="4" fill="var(--c1)"/>
<circle cx="281.6" cy="116.9" r="4" fill="var(--c1)"/>
<circle cx="322.7" cy="90.1" r="4" fill="var(--c1)"/>
<circle cx="360.1" cy="74.3" r="5" fill="var(--c1)"/>
<circle cx="395.7" cy="51.3" r="4" fill="var(--c1)"/>
<text x="160" y="156" font-size="10" fill="var(--text)" font-family="var(--font-ui)">[0,2–0,3): 0,2419 vs 0,2221 (n=752)</text>
<text x="360" y="62" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">[0,7–0,8): 0,7441 vs 0,7481 (n=258)</text>
<line x1="330" y1="42" x2="350" y2="42" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="354" y="45" font-size="10" fill="var(--text)" font-family="var(--font-ui)">kalibrasi sempurna (prediksi = aktual)</text>
</svg>`,
        alt: "Reliability diagram GBM mentah: 9 titik bin menempel dekat garis diagonal; bin 0,2 sampai 0,3 prediksi 0,2419 vs aktual 0,2221 (n=752); bin 0,7 sampai 0,8 prediksi 0,7441 vs aktual 0,7481 (n=258).",
        caption: "Cara membaca: sumbu-x = prediksi rata-rata per bin, sumbu-y = tingkat default aktual; garis putus-putus = kalibrasi sempurna. Titik di ATAS diagonal = model meremehkan risiko; di BAWAH = melebih-lebihkan. GBM mentah menempel dekat diagonal di semua bin besar [notebook] — ECE 0,0073. Bin [0,9–1,0) kosong (tidak ada nasabah diprediksi di atas 0,9).",
      },
      tasks: [],
    },
    {
      id: "kapan-kalibrasi",
      eyebrow: "Langkah 7 · Peta keputusan kalibrasi",
      title: "Kapan kalibrasi DIPERLUKAN — dan kapan tidak",
      prose: [
        "Keputusan kalibrasi bukan «selalu» atau «tidak pernah» — ia peta keputusan tiga cabang. Cabang 1: ECE kecil (seperti GBM mentah 0,0073 di data ini) DAN reliability diagram menempel diagonal di bin-bin besar → TIDAK PERLU kalibrasi ulang. Pakai model mentah; kalibrasi ulang hanya menambah risiko overfit pada data kalibrasi. Cabang 2: ECE besar ATAU ada bin besar yang menyimpang jauh dari diagonal → kalibrasi ulang DIPERLUKAN. Pilih Platt bila datamu kecil dan bentuk mis-kalibrasinya diduga kurva-S; pilih isotonic bila datamu besar dan bentuknya aneh. Lalu bandingkan sebelum vs sesudah pada data calibration/validation yang sama — kalibrasi yang ECE-nya tidak membaik adalah kalibrasi yang GAGAL, buang.",
        "Cabang 3 — yang paling sering dilupakan: bila yang kamu butuhkan hanya RANKING (misal memilih 10% nasabah paling berisiko untuk ditinjau manual), kalibrasi tidak relevan sama sekali — ROC-AUC sudah cukup, dan Platt/isotonic tidak mengubah ranking. Kalibrasi baru menjadi wajib saat angka probabilitasnya sendiri dipakai: threshold keputusan (langkah 8–9), expected loss (langkah 11), harga, cadangan, atau pelaporan risiko ke regulator.",
        "Nilai: di data ini kita berada di cabang 1 untuk GBM (ECE 0,0073) dan nyaris cabang 1 untuk LR (ECE 0,0160 — kecil dalam nilai absolut, dan Platt tidak mengubahnya: tetap 0,0160). Tidak ada cabang 2 di lesson ini — dan justru itu pelajarannya: peta keputusan yang baik kadang menjawab «tidak usah diapa-apakan».",
        "Baik atau buruk: peta tiga cabang ini bagus karena ia mengubah kalibrasi dari ritual menjadi keputusan berbasis bukti — ECE dan n per bin adalah buktinya. Buruk bila ECE dibaca tanpa ambang konteks: «ECE besar» itu relatif terhadap keputusanmu. Bila threshold-mu 0,10 dan ECE-mu 0,0073, kesalahan kalibrasi rata-rata 0,73 poin persen tidak akan mengubah banyak keputusan. Bila kamu memberi harga per 0,01 probabilitas, ECE yang sama bisa berarti uang.",
        "Mitigasi: tetapkan ambang ECE-mu SEBELUM melihat angkanya, dan tulis alasannya (misal «ECE di bawah 0,01 dapat diterima karena biaya kesalahan klasifikasi di sekitar threshold kecil»). Tanpa ambang yang ditulis dulu, kamu akan menafsir ulang angkanya sampai cocok dengan yang kamu inginkan.",
      ],
      tasks: [],
    },
    {
      id: "threshold-bukan-05",
      eyebrow: "Langkah 8 · Threshold bukan 0,5",
      title: "Threshold bukan 0,5: menyetujui di 0,10 vs 0,50",
      prose: [
        "Setelah probabilitasnya bisa dipercaya, pertanyaan berikutnya: di ambang berapa kamu menyetujui pinjaman? Konvensi di lesson ini — dan di flagship — adalah: setujui bila probabilitas default prediksi DI BAWAH threshold (threshold = batas atas risiko yang masih diterima). Threshold 0,5 adalah default yang paling umum dipakai — dan di data ini ia menghancurkan laba. Bukan karena modelnya buruk, melainkan karena biaya kedua jenis kesalahan sangat tidak seimbang (langkah 9).",
        "Nilai [notebook] — GBM terkalibrasi (Platt/sigmoid), test 6.000: threshold 0,10 → approval rate 28,5% (1.710 dari 6.000 disetujui), bad rate di antara yang disetujui 6,67% (114 dari 1.710 ternyata default), total biaya NT$33.046.500, net profit +NT$8.214.000. Threshold 0,50 → approval rate 88,05% (5.283 dari 6.000 disetujui), bad rate 15,96% (843 dari 5.283 default), total biaya NT$60.254.956, net profit −NT$18.994.456. Selisih labanya NT$27.208.456 — dari keputusan SATU angka.",
        "Perhatikan apa yang berubah di antara keduanya: menaikkan threshold dari 0,10 ke 0,50 menyetujui 3.573 nasabah tambahan — dan 729 di antaranya default (843 − 114). Setiap nasabah tambahan yang disetujui membawa margin 5% bila lancar, tapi kerugian 45% dari limit bila default. Bad rate kelompok tambahan 729/3.573 = 20,4% — dua kali lipat ambang impas 10% — jadi terlalu berisiko untuk margin 5%.",
        "Baik atau buruk: threshold 0,10 bagus di data ini — ia menyetujui hanya 28,5% nasabah, tapi yang disetujui 93,33%-nya lancar, dan labanya positif NT$8.214.000. Buruk bila dibaca sebagai «model yang pelit»: 0,10 bukan sifat model, melainkan sifat BIAYA (langkah 9) — dengan margin yang lebih besar atau LGD yang lebih kecil, threshold optimalnya akan naik. Threshold 0,50 buruk di sini — rugi NT$18.994.456 — tapi buruknya bukan karena «0,5 itu angka yang salah secara universal»; buruk karena di bawah asumsi biaya lesson ini, 0,5 menyetujui terlalu banyak risiko.",
        "Mitigasi: JANGAN PERNAH memakai 0,5 sebagai default tanpa menghitung biaya. Threshold adalah keputusan bisnis, bukan parameter model — ia diturunkan dari biaya (langkah 9), bukan dari kebiasaan.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Net profit per threshold GBM terkalibrasi (Platt): 0,10 plus NT$8.214.000; 0,15 plus NT$5.490.500; 0,20 minus NT$216.500; 0,25 minus NT$3.107.456; 0,30 minus NT$6.311.956; 0,50 minus NT$18.994.456">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Net profit vs threshold — GBM terkalibrasi (Platt), test 6.000</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="88.7" x2="466" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">+10 jt</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−10 jt</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−20 jt</text>
<rect x="66" y="40.5" width="44" height="48.2" fill="var(--c4)"/>
<text x="88" y="36.5" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+8.214.000</text>
<text x="88" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">t = 0,10</text>
<rect x="132" y="56.5" width="44" height="32.2" fill="var(--c4)"/>
<text x="154" y="52.5" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+5.490.500</text>
<text x="154" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">t = 0,15</text>
<rect x="198" y="88.7" width="44" height="1.2" fill="var(--c2)"/>
<text x="220" y="104" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">−216.500</text>
<text x="220" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">t = 0,20</text>
<rect x="264" y="88.7" width="44" height="18.2" fill="var(--c2)"/>
<text x="286" y="120" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">−3.107.456</text>
<text x="286" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">t = 0,25</text>
<rect x="330" y="88.7" width="44" height="37.0" fill="var(--c2)"/>
<text x="352" y="139" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">−6.311.956</text>
<text x="352" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">t = 0,30</text>
<rect x="396" y="88.7" width="44" height="111.4" fill="var(--c2)"/>
<text x="418" y="214" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">−18.994.456</text>
<text x="418" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">t = 0,50</text>
</svg>`,
        alt: "Net profit per threshold: 0,10 plus NT$8.214.000; 0,15 plus NT$5.490.500; 0,20 minus NT$216.500; 0,25 minus NT$3.107.456; 0,30 minus NT$6.311.956; 0,50 minus NT$18.994.456.",
        caption: "Cara membaca: bar di ATAS garis nol = laba, di BAWAH = rugi (NT$, test 6.000) [notebook]. Laba hanya positif di threshold rendah (0,10 dan 0,15); di 0,20 sudah negatif (−NT$216.500) dan makin dalam saat threshold naik. Threshold 0,5 — default yang paling umum — adalah yang paling merugikan di gambar ini.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: threshold 0,5 itu netral dan aman",
        type: "pitfall",
        body: "Yang benar: 0,5 hanya «netral» bila kedua jenis kesalahan biayanya SAMA. Di sini tidak: satu default yang disetujui merugikan 45% dari limit (LGD), sementara satu nasabah lancar yang ditolak hanya kehilangan margin 5%. Rasio biayanya 9 banding 1 — jadi threshold yang seimbang secara biaya jauh di bawah 0,5, yaitu 0,10 (langkah 9).",
      },
    },
    {
      id: "cost-sensitive",
      eyebrow: "Langkah 9 · Threshold cost-sensitive",
      title: "LGD 45% vs margin 5%: dari mana datangnya 0,10",
      prose: [
        "Threshold optimal 0,10 bukan angka yang jatuh dari langit — ia bisa diturunkan dari biaya dengan satu baris aljabar. Setujui satu nasabah dengan probabilitas default p: bila ia lancar (peluang 1 − p), kamu mendapat margin 5% dari limitnya; bila ia default (peluang p), kamu kehilangan 45% dari limitnya (LGD). Keuntungan harapan = (1 − p) × 0,05 − p × 0,45. Setujui bila keuntungan harapan positif: (1 − p) × 0,05 > p × 0,45, yaitu p < 0,05 / (0,05 + 0,45) = 0,10. Itulah ambang impas (break-even) — dan ia sama persis dengan threshold optimal empiris di data ini.",
        "Nilai [notebook]: profit-max threshold = 0,10 (net profit +NT$8.214.000, approval 28,5%, bad rate 6,67%, total biaya NT$33.046.500) dan cost-optimal threshold = 0,10 (total biaya NT$33.046.500, terendah pada grid 0,05–0,90 langkah 0,05) — keduanya SEPAKAT. Ini bukan kebetulan: meminimalkan total biaya (kerugian default yang disetujui + margin yang hilang karena menolak nasabah lancar) dan memaksimalkan laba adalah dua sisi koin yang sama di bawah asumsi biaya ini. Bukti tambahannya: biaya pada threshold 0,05 adalah NT$37.163.000 dan pada 0,15 NT$35.770.000 — keduanya lebih tinggi dari NT$33.046.500 di 0,10; biaya pada 0,50 adalah NT$60.254.956, hampir dua kali lipat. Sebagai pembanding, menyetujui SEMUA nasabah biayanya NT$82.155.456 dan menolak SEMUA nasabah biayanya NT$41.260.500 — threshold 0,10 mengalahkan keduanya.",
        "Baik atau buruk: kesepakatan profit-max dan cost-optimal di 0,10 itu bagus — dua kriteria yang dihitung dengan cara berbeda menunjuk angka yang sama, dan angka itu juga sama dengan ambang impas teoretis 0,05/(0,05+0,45). Tiga jalur, satu jawaban: keyakinan naik. Buruk bila kesepakatan ini dibaca sebagai «0,10 adalah threshold yang benar secara universal»: ubah LGD menjadi 20% dan margin menjadi 15%, dan ambang impasnya berubah (0,15/(0,15+0,20) = 0,43). Threshold mengikuti biaya, bukan model.",
        "Mitigasi: nyatakan asumsi biaya secara eksplisit di samping setiap threshold yang kamu rekomendasikan — «threshold 0,10, dengan LGD 45% dan margin 5%». Bila asumsi biaya berubah (misal LGD turun karena agunan lebih baik), hitung ulang thresholdnya; jangan mewarisi angka lama.",
      ],
      formula: String.raw`p^* = \frac{\text{margin}}{\text{margin} + \text{LGD}} = \frac{0{,}05}{0{,}05 + 0{,}45} = 0{,}10, \qquad \text{setujui bila } \hat{p} < p^*`,
      formulaNote: "Ambang impas: setujui bila keuntungan harapan (1 − p)·margin − p·LGD positif. Dengan margin 5% dan LGD 45% (asumsi flagship), p* = 0,10 — sama dengan threshold profit-max dan cost-optimal empiris [notebook].",
      tasks: [],
    },
    {
      id: "operating-points",
      eyebrow: "Langkah 10 · Operating points",
      title: "Operating points: threshold dari constraint bisnis, bukan hanya maksimum profit",
      prose: [
        "Satu model, banyak operating point. ROC-AUC GBM 0,7823 [notebook] adalah angka TUNGGAL — ia menilai ranking model tanpa peduli di ambang berapa kamu memotong. Tapi setiap threshold memotong ranking itu di tempat berbeda, dan menghasilkan confusion matrix yang berbeda: nasabah yang disetujui, yang ditolak, yang default di antara yang disetujui — semuanya berubah. Threshold adalah OPERATING POINT: satu titik di kurva ROC (dan di kurva PR) tempat kamu memilih beroperasi. Langkah 8–9 memilih operating point dari BIAYA (profit-max / cost-min). Langkah ini menambahkan cara kedua: memilih dari CONSTRAINT bisnis — dan menunjukkan kapan keduanya bertentangan.",
        "Nilai [notebook] — tabel kebijakan GBM terkalibrasi (Platt/sigmoid), test 6.000: t = 0,10 → approval 28,5%, bad rate 6,67%, biaya NT$33.046.500, laba +NT$8.214.000. t = 0,15 → approval 49,88%, bad rate 8,99%, biaya NT$35.770.000, laba +NT$5.490.500. t = 0,20 → approval 65,13%, bad rate 11,13%, biaya NT$41.477.000, laba −NT$216.500. t = 0,50 → approval 88,05%, bad rate 15,96%, biaya NT$60.254.956, laba −NT$18.994.456. Baca kolom demi kolom: approval rate NAIK seiring threshold (makin banyak disetujui), bad rate NAIK (yang disetujui makin berisiko), laba TURUN. Keempat baris ini adalah empat operating point dari SATU ranking yang sama — ROC-AUC-nya tetap 0,7823 di keempatnya.",
        "Sekarang terapkan tiga constraint bisnis — dan lihat operating point-nya bergeser. Constraint 1: approval rate MINIMUM 50% (misal target pangsa pasar). Yang lolos: 0,20 (65,13%) dan 0,50 (88,05%) — 0,15 (49,88%) GUGUR, selisih 0,12 poin persen dari ambang. Terbaik di antara yang lolos: 0,20, laba −NT$216.500. Constraint 2: bad rate MAKSIMUM 10% (misal batas risiko dari komite kredit). Yang lolos: 0,10 (6,67%) dan 0,15 (8,99%); terbaik: 0,10, laba +NT$8.214.000 — sama dengan profit-max, karena constraint-nya tidak mengikat. Constraint 3: recall (menangkap default) MINIMUM 80% — dari confusion matrix kanonis, recall = TP/(TP+FN): 0,10 → 1.213/1.327 = 91,41%; 0,15 → 1.058/1.327 = 79,73% (gugur, selisih 0,27 poin persen); 0,20 → 67,22%; 0,50 → 36,47%. Hanya 0,10 yang lolos. Tiga constraint, tiga jawaban — dan hanya constraint 2 yang sepakat dengan profit-max.",
        "Baik atau buruk: operating point dari constraint bagus karena ia jujur soal apa yang bisnis butuhkan: «kami butuh approval 50%» adalah syarat yang bisa diuji, sementara «maksimalkan profit» diam-diam mengasumsikan tidak ada syarat lain. Buruk bila constraint ditulis SESUDAH melihat tabel — memilih ambang 49,88% sebagai «minimum» karena 0,15 terlihat menarik adalah cherry-picking yang sama buruknya dengan memilih threshold di test (langkah 4). Constraint yang sah ditetapkan SEBELUM melihat angka, dari kebutuhan bisnis — dan harganya dihitung terbuka: constraint approval 50% mengorbankan 8.214.000 − (−216.500) = NT$8.430.500 laba dibanding profit-max. Bila harga itu terlalu mahal, yang dinegosiasi adalah constraint-nya — bukan angkanya.",
        "Mitigasi: untuk setiap threshold yang kamu rekomendasikan, laporkan TIGA hal berdampingan: (1) confusion matrix-nya (threshold-dependent), (2) metrik ranking-nya — ROC-AUC/PR-AUC (threshold-independent, sama di semua threshold), dan (3) constraint yang ia penuhi dan yang ia langgar. Bila seseorang hanya menyodorkan satu angka — «approval 88%!» atau «profit +8 juta!» — tanyakan operating point-nya: di threshold berapa, dan constraint apa yang dikorbankan untuk sampai ke sana.",
        "Lab langkah ini memakai tabel kebijakan kanonis di atas [notebook]. Hasil yang diharapkan [lab]: best_profit_threshold=0.10; best_constrained_threshold=0.20; constraint_cost=8430500; approved_020=3908; bad_020=435; roc_auc_at_010=0.7823; roc_auc_at_020=0.7823. Perhatikan dua baris terakhir: ROC-AUC 0,7823 SAMA di t = 0,10 dan t = 0,20 — ranking tidak berubah saat threshold bergerak; yang berubah hanya confusion matrix-nya (disetujui 1.710 vs 3.908 nasabah, default di antaranya 114 vs 435).",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="ROC curve GBM dengan empat operating point: threshold 0,10 di FPR 0,6585 dan TPR 0,9141; 0,15 di FPR 0,4171 dan TPR 0,7973; 0,20 di FPR 0,2568 dan TPR 0,6722; 0,50 di FPR 0,0499 dan TPR 0,3647; ROC-AUC 0,7823 sama di semua threshold">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">ROC curve GBM — satu ranking, empat operating point (test 6.000)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="30" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="170.8" x2="52" y2="170.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="173.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="135.6" x2="52" y2="135.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="138.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="100.4" x2="52" y2="100.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="103.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<line x1="48" y1="65.2" x2="52" y2="65.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="68.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,8</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1,0</text>
<text x="259" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">false positive rate (FPR) — makin ke kanan, makin banyak nasabah lancar yang ditolak</text>
<polyline points="52,206 72.6,141.8 158.3,87.7 224.7,65.7 324.6,45.1 466,30" fill="none" stroke="var(--c1)" stroke-width="2"/>
<circle cx="72.6" cy="141.8" r="5" fill="var(--c1)"/>
<circle cx="158.3" cy="87.7" r="5" fill="var(--c1)"/>
<circle cx="224.7" cy="65.7" r="5" fill="var(--c1)"/>
<circle cx="324.6" cy="45.1" r="5" fill="var(--c1)"/>
<text x="80" y="136" font-size="10" fill="var(--text)" font-family="var(--font-ui)">t = 0,50</text>
<text x="166" y="82" font-size="10" fill="var(--text)" font-family="var(--font-ui)">t = 0,20</text>
<text x="232" y="60" font-size="10" fill="var(--text)" font-family="var(--font-ui)">t = 0,15</text>
<text x="332" y="40" font-size="10" fill="var(--text)" font-family="var(--font-ui)">t = 0,10</text>
</svg>`,
        alt: "ROC curve GBM: empat operating point — t = 0,10 di FPR 0,6585 dan TPR 0,9141; t = 0,15 di FPR 0,4171 dan TPR 0,7973; t = 0,20 di FPR 0,2568 dan TPR 0,6722; t = 0,50 di FPR 0,0499 dan TPR 0,3647. ROC-AUC 0,7823 sama di semua threshold.",
        caption: "Cara membaca: sumbu-x = false positive rate, sumbu-y = true positive rate; garis putus-putus = tebakan acak (ROC-AUC 0,5). Setiap titik adalah satu operating point — confusion matrix yang berbeda dari ranking yang sama. Keempat titik dihitung dari confusion matrix kanonis [notebook]; kurva di antara titik-titik adalah sketsa [ilustrasi]. ROC-AUC 0,7823 tidak berubah saat kamu berpindah titik — yang berubah hanya di mana kamu beroperasi.",
      },
      tasks: [
        { id: "t1", text: "Pilih threshold profit-max TANPA constraint (net profit terbesar)" },
        { id: "t2", text: "Pilih threshold TERBAIK di bawah constraint approval rate minimum 50%" },
        { id: "t3", text: "Hitung constraint cost + confusion matrix pada t = 0,20 (disetujui & default di antaranya)" },
      ],
      expected: "best_profit_threshold=0.10\nbest_constrained_threshold=0.20\nconstraint_cost=8430500\napproved_020=3908\nbad_020=435\nroc_auc_at_010=0.7823\nroc_auc_at_020=0.7823",
      hints: [
        "Profit-max tanpa constraint: bandingkan kolom net profit POLICY — 0,10 (+8.214.000) vs 0,15 (+5.490.500) vs 0,20 (−216.500) vs 0,50 (−18.994.456).",
        "Constraint approval ≥ 0,50: 0,15 (0,4988) TIDAK lolos — hanya 0,20 (0,6513) dan 0,50 (0,8805) yang lolos; pilih yang profitnya terbesar di antara keduanya.",
        "Disetujui pada t = 0,20 = TN + FN = 3473 + 435 = 3908; yang default di antaranya = FN = 435. ROC-AUC 0,7823 SAMA di kedua threshold — ranking tidak bergantung threshold.",
      ],
      code: {
        starter: `# Operating points: pilih threshold dari CONSTRAINT bisnis, bukan hanya maksimum profit [notebook]
# POLICY: threshold -> (approval rate, bad rate, total biaya NT$, net profit NT$) [notebook]
# CONFUSION: threshold -> (TN, FP, FN, TP) [notebook]
POLICY = {0.10: (0.285, 0.0667, 33046500, 8214000), 0.15: (0.4988, 0.0899, 35770000, 5490500),
          0.20: (0.6513, 0.1113, 41477000, -216500), 0.50: (0.8805, 0.1596, 60254956, -18994456)}
CONFUSION = {0.10: (1596, 3077, 114, 1213), 0.15: (2724, 1949, 269, 1058),
             0.20: (3473, 1200, 435, 892), 0.50: (4440, 233, 843, 484)}
N_TEST = 6000
ROC_AUC = 0.7823  # ranking model — TIDAK bergantung pada threshold
MIN_APPROVAL = 0.50  # constraint bisnis: approval rate minimum 50%

best_profit_threshold = 0.0  # TODO: threshold dengan net profit TERBESAR (tanpa constraint)
best_constrained_threshold = 0.0  # TODO: threshold dengan net profit TERBESAR di antara yang approval rate-nya >= MIN_APPROVAL
constraint_cost = 0  # TODO: POLICY[best_profit_threshold][3] - POLICY[best_constrained_threshold][3]
approved_020 = 0  # TODO: nasabah disetujui pada t = 0,20 (TN + FN dari CONFUSION)
bad_020 = 0  # TODO: nasabah disetujui yang ternyata default (FN) pada t = 0,20
print(f"best_profit_threshold={best_profit_threshold:.2f}")
print(f"best_constrained_threshold={best_constrained_threshold:.2f}")
print(f"constraint_cost={constraint_cost}")
print(f"approved_020={approved_020}")
print(f"bad_020={bad_020}")
print(f"roc_auc_at_010={ROC_AUC:.4f}")
print(f"roc_auc_at_020={ROC_AUC:.4f}")`,
        lockLines: 11,
        solution: `# Operating points: pilih threshold dari CONSTRAINT bisnis, bukan hanya maksimum profit [notebook]
# POLICY: threshold -> (approval rate, bad rate, total biaya NT$, net profit NT$) [notebook]
# CONFUSION: threshold -> (TN, FP, FN, TP) [notebook]
POLICY = {0.10: (0.285, 0.0667, 33046500, 8214000), 0.15: (0.4988, 0.0899, 35770000, 5490500),
          0.20: (0.6513, 0.1113, 41477000, -216500), 0.50: (0.8805, 0.1596, 60254956, -18994456)}
CONFUSION = {0.10: (1596, 3077, 114, 1213), 0.15: (2724, 1949, 269, 1058),
             0.20: (3473, 1200, 435, 892), 0.50: (4440, 233, 843, 484)}
N_TEST = 6000
ROC_AUC = 0.7823  # ranking model — TIDAK bergantung pada threshold
MIN_APPROVAL = 0.50  # constraint bisnis: approval rate minimum 50%

best_profit_threshold = max(POLICY, key=lambda t: POLICY[t][3])
best_constrained_threshold = max(
    (t for t in POLICY if POLICY[t][0] >= MIN_APPROVAL), key=lambda t: POLICY[t][3])
constraint_cost = POLICY[best_profit_threshold][3] - POLICY[best_constrained_threshold][3]
approved_020 = CONFUSION[0.20][0] + CONFUSION[0.20][2]
bad_020 = CONFUSION[0.20][2]
print(f"best_profit_threshold={best_profit_threshold:.2f}")
print(f"best_constrained_threshold={best_constrained_threshold:.2f}")
print(f"constraint_cost={constraint_cost}")
print(f"approved_020={approved_020}")
print(f"bad_020={bad_020}")
print(f"roc_auc_at_010={ROC_AUC:.4f}")
print(f"roc_auc_at_020={ROC_AUC:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "best_profit_threshold", value: 0.1, tol: 0.00005, label: "`best_profit_threshold` seharusnya 0.10", msg: "Tanpa constraint, profit terbesar ada di 0,10 (+NT$8.214.000)." },
          { kind: "equal", task: "t2", name: "best_constrained_threshold", value: 0.2, tol: 0.00005, label: "`best_constrained_threshold` seharusnya 0.20", msg: "Constraint approval ≥ 50% menggugurkan 0,15 (49,88%); di antara 0,20 dan 0,50, profit terbesar ada di 0,20 (−NT$216.500)." },
          { kind: "equal", task: "t3", name: "constraint_cost", value: 8430500, tol: 0.5, label: "`constraint_cost` seharusnya 8430500", msg: "Constraint approval 50% mengorbankan 8.214.000 − (−216.500) = NT$8.430.500 laba." },
          { kind: "stdout_matches", task: "t3", pattern: "approved_020=3908", label: "Output menampilkan approved_020=3908", msg: "Pada t = 0,20 disetujui 3.908 nasabah (TN 3.473 + FN 435) — confusion matrix BERGANTUNG pada threshold." },
          { kind: "stdout_matches", task: "t3", pattern: "roc_auc_at_020=0.7823", label: "Output menampilkan roc_auc_at_020=0.7823", msg: "ROC-AUC 0,7823 sama di t = 0,10 dan t = 0,20 — ranking TIDAK bergantung pada threshold." },
        ],
      },
    },
    {
      id: "jebakan-min-el",
      eyebrow: "Langkah 11 · Jebakan",
      title: "Jebakan: expected-loss minimum yang degenerat",
      prose: [
        "Ada satu angka lagi di file kanonis yang tampak seperti «threshold optimal» ketiga: min-expected-loss threshold = 0,10, dengan expected loss atas buku yang disetujui NT$11.989.453 [notebook]. Kedengarannya meyakinkan — tiga kriteria sepakat di 0,10! Tapi yang ketiga ini harus dibaca dengan curiga, karena ia degenerat.",
        "Alasannya: expected loss di sini dihitung HANYA atas buku yang disetujui (jumlah atas nasabah yang disetujui dari p × LGD × limit). Makin sedikit yang kamu setujui, makin kecil expected loss-nya — secara mekanis. Setujui NOL nasabah, expected loss-mu NOL — «sempurna» menurut kriteria ini, dan bangkrut menurut kriteria apa pun yang waras, karena kamu juga kehilangan seluruh margin. Kriteria ini tidak menghukum penolakan sama sekali: ia tidak menghitung margin yang hilang dari nasabah lancar yang ditolak. Karena itu minimumnya selalu terdorong ke tepi grid — ke threshold TERENDAH yang tersedia (di grid kebijakan 0,10–0,90, tepi bawahnya 0,10; di grid yang lebih lebar, ia akan terdorong ke 0,05 atau lebih rendah lagi).",
        "Nilai [notebook] yang membuktikan degenerasi ini: expected loss atas buku yang disetujui di threshold 0,10 adalah NT$11.989.453, dan di 0,50 adalah NT$56.668.700. Ya, 0,10 lebih kecil — tapi itu sebagian besar karena di 0,10 kamu hanya menyetujui 1.710 nasabah sementara di 0,50 kamu menyetujui 5.283. Expected loss PER nasabah yang disetujui: NT$7.011 di 0,10 vs NT$10.727 di 0,50 — perbedaannya nyata tapi jauh lebih kecil daripada perbandingan totalnya, dan kriteria ini tetap tidak pernah bertanya «berapa margin yang hilang karena menolak 4.290 nasabah?»",
        "Baik atau buruk: min-expected-loss bagus sebagai DIAGNOSIS — ia memberitahumu berapa kerugian harapan yang kamu bawa di buku yang disetujui. Buruk sebagai KRITERIA OPTIMASI — ia menghargai bank yang tidak meminjamkan apa pun. Perbandingan yang bermakna adalah profit-max vs cost-min (langkah 9): keduanya menghitung KEDUA sisi — keuntungan dari yang disetujui DAN biaya dari yang ditolak — dan keduanya sepakat di 0,10. Itulah kesepakatan yang boleh dipercaya.",
        "Mitigasi: setiap kali seseorang menyodorkan «threshold optimal» dari satu kriteria, tanyakan: apakah kriteria ini menghukum KEDUA jenis kesalahan? Bila ia hanya menghitung satu sisi (hanya kerugian yang disetujui, atau hanya margin yang hilang), ia akan terdorong ke tepi — dan jawabannya adalah artefak, bukan keputusan.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: «tiga kriteria sepakat di 0,10» — yang ketiga tidak dihitung",
        type: "pitfall",
        body: "Yang benar: profit-max (0,10) dan cost-optimal (0,10) sepakat karena keduanya menghitung kedua sisi biaya — dan keduanya cocok dengan ambang impas teoretis 0,10. Min-expected-loss (0,10) HANYA menghitung kerugian buku yang disetujui, jadi minimumnya terdorong ke tepi grid secara mekanis: menyetujui nol nasabah memberi expected loss nol. Jangan sajikan ketiganya sebagai tiga bukti yang setara — yang ketiga adalah diagnosis, bukan optimasi.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 12 · Peta keputusan",
      title: "Peta keputusan: kalibrasi + threshold dalam satu alur",
      prose: [
        "Gabungkan kedua setengah lesson ini menjadi satu alur kerja. Langkah A — latih model dan ukur ranking (ROC-AUC, PR-AUC). Langkah B — cek kalibrasi: reliability diagram + ECE + Brier pada data calibration/validation. Bila ECE kecil dan bin besar menempel diagonal (seperti GBM mentah di sini, ECE 0,0073), lanjut dengan model mentah. Bila tidak, kalibrasi ulang (Platt untuk data kecil, isotonic untuk data besar) dan bandingkan sebelum vs sesudah — buang kalibrasi bila tidak membaik. (Di lesson ini angka-angka langkah B dihitung pada test 6.000 sebagai ilustrasi protokol — lihat langkah 4.)",
        "Langkah C — tulis asumsi biaya secara eksplisit: LGD, margin, dan biaya tiap jenis kesalahan. Langkah D — hitung ambang impas teoretis p* = margin/(margin + LGD) sebagai tebakan awal. Langkah E — jalankan grid threshold pada probabilitas TERKALIBRASI (di sini grid 0,05–0,90 langkah 0,05), hitung total biaya dan net profit per threshold, dan pilih yang meminimalkan biaya / memaksimalkan laba. Langkah F — verifikasi: apakah profit-max dan cost-optimal sepakat? Apakah keduanya dekat dengan p* teoretis? Di data ini ketiganya 0,10 — alur ditutup dengan keyakinan. Bila ketiganya BERBEDA jauh, jangan pilih salah satunya begitu saja — selidiki: mungkin kalibrasinya masih buruk, mungkin asumsi biayanya salah, mungkin grid-nya terlalu kasar.",
        "Nilai: alur ini mengubah dua keputusan yang biasanya dibuat dengan firasat — «modelnya sudah cukup bagus?» dan «threshold-nya berapa?» — menjadi urutan pemeriksaan yang masing-masing punya angka dan ambang. Tidak ada langkah yang mengandalkan «rasanya».",
        "Baik atau buruk: alur ini bagus karena urutannya penting — threshold (langkah C–F) HANYA bermakna bila kalibrasi (langkah B) sudah beres. Grid threshold pada probabilitas yang berbohong menghasilkan threshold yang salah dengan penuh percaya diri. Buruk bila alur ini dibaca sebagai sekali-jalan: kalibrasi bergeser saat populasi bergeser (misal resesi menaikkan base rate dari 0,2212), dan biaya berubah saat kebijakan agunan berubah — jadi langkah B–F adalah pekerjaan BERKALA, bukan sekali seumur hidup. Itulah topik M6.7 (monitoring) — tapi kebiasaan memeriksanya dimulai di sini.",
        "Mitigasi: dokumentasikan keempat angka ini di samping setiap model yang masuk produksi — ECE, Brier, threshold, dan asumsi biaya (LGD + margin) — lengkap dengan tanggal dan data evaluasinya. Bila salah satunya tidak bisa kamu tulis, model itu belum siap diputuskan.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 13 · Lab 1",
      title: "Lab: ECE manual dari tiga bin kanonis",
      prose: [
        "Sekarang hitung ECE dengan tanganmu sendiri — dari tiga bin kanonis GBM mentah [notebook]. Rumusnya dari langkah 3: tiap bin menyumbang (n_bin / N) × |prediksi − aktual|, lalu dijumlahkan. Tiga bin ini: [0,0–0,1) n = 1.791, prediksi 0,0647, aktual 0,0670; [0,2–0,3) n = 752, prediksi 0,2419, aktual 0,2221; [0,7–0,8) n = 258, prediksi 0,7441, aktual 0,7481. N = 6.000.",
        "Hasil yang diharapkan [lab]: gap_00_01=0.0023; gap_02_03=0.0198; gap_07_08=0.0040; partial_ece_3bins=0.0033. Perhatikan: ini ECE PARSIAL — hanya 3 dari 10 bin. ECE penuh GBM mentah adalah 0,0073 [notebook]; ketiga bin ini menyumbang 0,0033 dari 0,0073 itu. Bin [0,2–0,3) adalah penyumbang terbesar di antara ketiganya: (752/6.000) × 0,0198 = 0,0025 — lebih besar dari dua bin lain digabung.",
        "Setelah lab jalan, bandingkan dengan ECE penuh 0,0073: 7 bin lainnya menyumbang ≈0,0039–0,0040 sisanya (selisih pembulatan). Bila hasilmu berbeda, periksa dulu: apakah kamu memakai nilai ABSOLUT selisihnya, dan apakah bobotnya n/6.000 (bukan n/752 atau n/2.801)?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi gap tiap bin: nilai absolut |prediksi - aktual|" },
        { id: "t2", text: "Lengkapi partial_ece_3bins: jumlah (n_bin / N_TEST) * gap tiap bin" },
        { id: "t3", text: "Jalankan dan bandingkan dengan ECE parsial kanonis 0.0033 (ECE penuh 0.0073)" },
      ],
      expected: "gap_00_01=0.0023\ngap_02_03=0.0198\ngap_07_08=0.0040\npartial_ece_3bins=0.0033",
      hints: [
        "Gap = abs(prediksi - aktual): misal bin [0.2,0.3) -> abs(0.2419 - 0.2221) = 0.0198.",
        "Bobot tiap bin = n_bin / 6000 — bukan n_bin dibagi jumlah ketiga bin.",
        "ECE parsial hanya menjumlahkan 3 bin ini; ECE penuh (10 bin) adalah 0,0073 — jangan samakan keduanya.",
      ],
      code: {
        starter: `# ECE manual dari 3 bin kanonis GBM mentah (test 6.000 nasabah) [notebook]
# Bin: (label, n, prediksi rata-rata, tingkat aktual)
BINS = [
    ("[0.0,0.1)", 1791, 0.0647, 0.0670),
    ("[0.2,0.3)", 752, 0.2419, 0.2221),
    ("[0.7,0.8)", 258, 0.7441, 0.7481),
]
N_TEST = 6000

gap_00_01 = 0.0  # TODO: |prediksi - aktual| bin [0.0,0.1)
gap_02_03 = 0.0  # TODO: |prediksi - aktual| bin [0.2,0.3)
gap_07_08 = 0.0  # TODO: |prediksi - aktual| bin [0.7,0.8)
partial_ece_3bins = 0.0  # TODO: jumlah (n_bin / N_TEST) * gap tiap bin
print(f"gap_00_01={gap_00_01:.4f}")
print(f"gap_02_03={gap_02_03:.4f}")
print(f"gap_07_08={gap_07_08:.4f}")
print(f"partial_ece_3bins={partial_ece_3bins:.4f}")`,
        lockLines: 8,
        solution: `# ECE manual dari 3 bin kanonis GBM mentah (test 6.000 nasabah) [notebook]
# Bin: (label, n, prediksi rata-rata, tingkat aktual)
BINS = [
    ("[0.0,0.1)", 1791, 0.0647, 0.0670),
    ("[0.2,0.3)", 752, 0.2419, 0.2221),
    ("[0.7,0.8)", 258, 0.7441, 0.7481),
]
N_TEST = 6000

gap_00_01 = abs(BINS[0][2] - BINS[0][3])
gap_02_03 = abs(BINS[1][2] - BINS[1][3])
gap_07_08 = abs(BINS[2][2] - BINS[2][3])
partial_ece_3bins = (BINS[0][1] * gap_00_01 + BINS[1][1] * gap_02_03
                     + BINS[2][1] * gap_07_08) / N_TEST
print(f"gap_00_01={gap_00_01:.4f}")
print(f"gap_02_03={gap_02_03:.4f}")
print(f"gap_07_08={gap_07_08:.4f}")
print(f"partial_ece_3bins={partial_ece_3bins:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "gap_02_03", value: 0.0198, tol: 0.00005, label: "`gap_02_03` seharusnya 0.0198", msg: "Bin [0,2–0,3): |0,2419 − 0,2221| = 0,0198 — penyimpangan terbesar di antara ketiga bin." },
          { kind: "stdout_matches", task: "t1", pattern: "gap_00_01=0.0023", label: "Output menampilkan gap_00_01=0.0023", msg: "Bin [0,0–0,1): |0,0647 − 0,0670| = 0,0023 — bin terbesar, selisih terkecil." },
          { kind: "stdout_matches", task: "t1", pattern: "gap_07_08=0.0040", label: "Output menampilkan gap_07_08=0.0040", msg: "Bin [0,7–0,8): |0,7441 − 0,7481| = 0,0040 — nyaris sempurna di ujung berisiko." },
          { kind: "equal", task: "t3", name: "partial_ece_3bins", value: 0.0033, tol: 0.00005, label: "`partial_ece_3bins` seharusnya 0.0033", msg: "ECE parsial 3 bin = 0,0033 — dari ECE penuh 0,0073; bin [0,2–0,3) menyumbang paling besar (0,0025)." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 14 · Lab 2",
      title: "Lab: profit vs threshold — dari mana 0,10 menang",
      prose: [
        "Lab kedua menghitung ulang alasan threshold 0,10 menang — dari angka kanonis GBM terkalibrasi (Platt/sigmoid) [notebook]. Tiga TODO: ambang impas teoretis p* = margin/(margin + LGD); approval rate dan bad rate pada t = 0,10 dari confusion matrix (TN 1.596, FN 114 — yang disetujui adalah TN + FN, karena «disetujui» berarti probabilitas prediksi DI BAWAH threshold); dan selisih laba antara t = 0,10 (+NT$8.214.000) dan t = 0,50 (−NT$18.994.456).",
        "Hasil yang diharapkan [lab]: p_star=0.1000; approval_010=0.2850; bad_rate_010=0.0667; profit_gap=27208456. Perhatikan: p* teoretis (0,1000) sama dengan threshold empiris yang memaksimalkan laba — tiga jalur (teori, profit-max, cost-min) menunjuk angka yang sama. Dan profit_gap NT$27.208.456 sama persis dengan selisih total biaya (NT$60.254.956 − NT$33.046.500) — dua sisi koin yang sama.",
        "Setelah lab jalan, coba ubah LGD menjadi 0,20 di kepalamu: p* menjadi 0,05/(0,05+0,20) = 0,20 — threshold optimal ikut naik. Threshold mengikuti biaya, bukan model.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi p_star: ambang impas = MARGIN / (MARGIN + LGD)" },
        { id: "t2", text: "Lengkapi approval_010 dan bad_rate_010 dari TN 1596 dan FN 114 pada t = 0,10" },
        { id: "t3", text: "Lengkapi profit_gap: selisih net profit t = 0,10 vs t = 0,50, lalu bandingkan dengan selisih total biaya" },
      ],
      expected: "p_star=0.1000\napproval_010=0.2850\nbad_rate_010=0.0667\nprofit_gap=27208456",
      hints: [
        "Ambang impas: p* = MARGIN / (MARGIN + LGD) = 0,05 / 0,50 = 0,10.",
        "Disetujui pada t = 0,10 = TN + FN = 1596 + 114 = 1710; approval rate = 1710 / 6000.",
        "Bad rate = FN / disetujui = 114 / 1710 = 0,0667; profit_gap = 8214000 - (-18994456).",
      ],
      code: {
        starter: `# Profit vs threshold dari angka kanonis GBM terkalibrasi (Platt/sigmoid, test 6.000) [notebook]
# t = 0,10: TN 1596, FN 114 (disetujui = TN + FN); t = 0,50: TN 4440, FN 843
# Net profit kanonis: t = 0,10 -> +NT$8.214.000; t = 0,50 -> -NT$18.994.456
LGD = 0.45
MARGIN = 0.05
N_TEST = 6000
PROFIT_010 = 8214000
PROFIT_050 = -18994456

p_star = 0.0  # TODO: ambang impas = MARGIN / (MARGIN + LGD)
approved_010 = 0  # TODO: nasabah disetujui pada t = 0,10 (TN + FN = 1596 + 114)
approval_010 = 0.0  # TODO: approved_010 / N_TEST
bad_010 = 0  # TODO: nasabah disetujui yang ternyata default (FN) pada t = 0,10
bad_rate_010 = 0.0  # TODO: bad_010 / approved_010
profit_gap = 0  # TODO: PROFIT_010 - PROFIT_050
print(f"p_star={p_star:.4f}")
print(f"approval_010={approval_010:.4f}")
print(f"bad_rate_010={bad_rate_010:.4f}")
print(f"profit_gap={profit_gap}")`,
        lockLines: 8,
        solution: `# Profit vs threshold dari angka kanonis GBM terkalibrasi (Platt/sigmoid, test 6.000) [notebook]
# t = 0,10: TN 1596, FN 114 (disetujui = TN + FN); t = 0,50: TN 4440, FN 843
# Net profit kanonis: t = 0,10 -> +NT$8.214.000; t = 0,50 -> -NT$18.994.456
LGD = 0.45
MARGIN = 0.05
N_TEST = 6000
PROFIT_010 = 8214000
PROFIT_050 = -18994456

p_star = MARGIN / (MARGIN + LGD)
approved_010 = 1596 + 114
approval_010 = approved_010 / N_TEST
bad_010 = 114
bad_rate_010 = bad_010 / approved_010
profit_gap = PROFIT_010 - PROFIT_050
print(f"p_star={p_star:.4f}")
print(f"approval_010={approval_010:.4f}")
print(f"bad_rate_010={bad_rate_010:.4f}")
print(f"profit_gap={profit_gap}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_star", value: 0.1, tol: 0.00005, label: "`p_star` seharusnya 0.1000", msg: "Ambang impas 0,05/(0,05+0,45) = 0,10 — sama dengan threshold profit-max empiris." },
          { kind: "equal", task: "t2", name: "approval_010", value: 0.285, tol: 0.00005, label: "`approval_010` seharusnya 0.2850", msg: "Pada t = 0,10 hanya 28,5% nasabah disetujui (1.710 dari 6.000)." },
          { kind: "equal", task: "t2", name: "bad_rate_010", value: 0.0667, tol: 0.00005, label: "`bad_rate_010` seharusnya 0.0667", msg: "Bad rate di antara yang disetujui pada t = 0,10: 114/1.710 = 6,67%." },
          { kind: "stdout_matches", task: "t3", pattern: "profit_gap=27208456", label: "Output menampilkan profit_gap=27208456", msg: "Selisih laba 0,10 vs 0,50: NT$27.208.456 — sama dengan selisih total biaya (60.254.956 − 33.046.500)." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 15 · Checkpoint",
      title: "Checkpoint: probabilitas yang jujur, threshold yang dibayar biaya",
      prose: [
        "Rangkuman: ranking ≠ kalibrasi — ROC-AUC GBM 0,7823 [notebook] mengukur urutan, bukan kejujuran probabilitas. Kalibrasi diperiksa dengan reliability diagram + ECE + Brier: GBM mentah Brier 0,1342 / ECE 0,0073 (terbaik); LR mentah 0,1427 / 0,0160; LR + Platt 0,1427 / 0,0160; LR + isotonic 0,1427 / 0,0163; GBM + Platt 0,1345 / 0,0087. Kalibrasi ulang TIDAK memperbaiki apa pun di data ini — GBM mentah sudah terkalibrasi baik, dan Platt/isotonic malah sedikit memburuk. Cek dulu, baru putuskan; kalibrasi adalah obat, bukan vitamin. Worked example: bin [0,2–0,3) n = 752, prediksi 0,2419 vs aktual 0,2221 (selisih 0,0198); bin [0,7–0,8) n = 258, prediksi 0,7441 vs aktual 0,7481 (selisih 0,0040) — baca bin bersama n-nya. Peta keputusan: ECE kecil + bin besar menempel diagonal → pakai mentah; ECE besar → Platt (data kecil) atau isotonic (data besar), lalu bandingkan sebelum vs sesudah; ranking saja → kalibrasi tidak relevan. Threshold: setujui bila probabilitas prediksi DI BAWAH threshold. t = 0,10 → approval 28,5%, bad rate 6,67%, biaya NT$33.046.500, laba +NT$8.214.000; t = 0,50 → approval 88,05%, bad rate 15,96%, biaya NT$60.254.956, laba −NT$18.994.456. Ambang impas p* = 0,05/(0,05+0,45) = 0,10 — profit-max dan cost-optimal SEPAKAT di 0,10, dan keduanya cocok dengan teori. Min-expected-loss (0,10, NT$11.989.453) adalah DEGENERAT: ia hanya menghitung kerugian buku yang disetujui, jadi minimumnya terdorong ke tepi grid — menyetujui nol nasabah memberi expected loss nol. Perbandingan yang bermakna adalah profit-max vs cost-min. Lab: ECE parsial 3 bin GBM mentah = 0,0033 (dari ECE penuh 0,0073); p* = 0,1000, approval 0,10 = 0,2850, bad rate = 0,0667, selisih laba 0,10 vs 0,50 = NT$27.208.456. Three-way split: semua pilihan (model, kalibrasi, threshold) dibuat di train + calibration/validation; final test dibuka SEKALI di akhir — dan semua angka lesson ini adalah HASIL ILUSTRASI PROTOKOL LESSON, bukan template evaluasi final, karena dihitung pada test 6.000 yang sama (lab: threshold terbaik di kalibrasi 0,15, biaya jujur di test NT$35.770.000, optimism gap NT$2.723.500). Operating points: satu ranking (ROC-AUC 0,7823) punya banyak operating point — confusion matrix threshold-dependent, ranking threshold-independent. Constraint approval minimum 50% memilih 0,20 (laba −NT$216.500) dengan harga NT$8.430.500 dibanding profit-max 0,10; constraint bad rate maksimum 10% dan recall minimum 80% memilih 0,10.",
        "Guided task di Colab — notebook mlf-m64-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data UCI: flagship LR/GBM, kalibrasi mentah vs Platt vs isotonic, reliability bins + ECE + Brier, dan grid threshold + profit/cost dengan LGD 45% dan margin 5%. Tautan Colab: https://colab.research.google.com/drive/1N696GImKxjq1c8j7ItL7OUyfyzTmHrz_",
        "Lanjut: MLF-M6.5 — AutoML & Selection Bias: apa yang terjadi bila kamu memilih model dari skor test yang sama berulang kali — winner's curse, uji McNemar LR vs GBM, dan protokol perbandingan yang adil.",
      ],
      tasks: [],
      quiz: [
        {
          q: "GBM mentah di test 6.000 punya Brier 0,1342 dan ECE 0,0073; GBM + Platt punya Brier 0,1345 dan ECE 0,0087. Kesimpulan yang benar?",
          options: [
            { text: "Platt memperbaiki kalibrasi GBM — ECE turun", why: "Terbalik: ECE GBM naik 0,0073 → 0,0087 setelah Platt, dan Brier naik 0,1342 → 0,1345. Keduanya memburuk, bukan membaik." },
            { text: "Kalibrasi ulang tidak membantu di data ini — GBM mentah sudah yang terbaik", why: "Benar: GBM mentah punya Brier dan ECE TERENDAH di antara semua varian; Platt menaikkan keduanya. Keputusan yang benar adalah memakai GBM mentah.", correct: true },
            { text: "GBM mentah harus dibuang karena ECE-nya bukan nol", why: "ECE 0,0073 berarti rata-rata meleset hanya 0,73 poin persen — kecil. ECE nol hampir tidak pernah terjadi pada data nyata dan bukan syarat untuk memakai model." },
            { text: "Brier dan ECE bertentangan, jadi keduanya tidak bisa dipercaya", why: "Keduanya SEPAKAT di sini: GBM mentah terbaik menurut Brier (0,1342) maupun ECE (0,0073). Tidak ada pertentangan." },
          ],
        },
        {
          q: "Bin [0,2–0,3) GBM mentah: n = 752, prediksi rata-rata 0,2419, tingkat aktual 0,2221. Berapa selisihnya, dan apa artinya?",
          options: [
            { text: "0,0198 — model sedikit melebih-lebihkan risiko di bin ini", why: "Benar: |0,2419 − 0,2221| = 0,0198. Prediksi di ATAS aktual berarti model melebih-lebihkan risiko (titik di bawah diagonal).", correct: true },
            { text: "0,0198 — model meremehkan risiko di bin ini", why: "Terbalik: meremehkan berarti prediksi DI BAWAH aktual. Di sini prediksi 0,2419 LEBIH TINGGI dari aktual 0,2221 — jadi melebih-lebihkan." },
            { text: "0,4640 — jumlah prediksi dan aktual", why: "Menjumlahkan keduanya tidak bermakna. Yang diukur kalibrasi adalah SELISIH |prediksi − aktual| = 0,0198." },
            { text: "0,0023 — sama dengan selisih bin [0,0–0,1)", why: "0,0023 adalah selisih bin [0,0–0,1) (0,0647 vs 0,0670). Bin [0,2–0,3) selisihnya 0,0198 — hampir sembilan kali lebih besar." },
          ],
        },
        {
          q: "Threshold 0,10 memberi net profit +NT$8.214.000, threshold 0,50 memberi −NT$18.994.456 (GBM terkalibrasi (Platt/sigmoid), test 6.000). Apa penyebab utama perbedaan ini?",
          options: [
            { text: "Model pada threshold 0,50 menjadi lebih buruk — ROC-AUC-nya turun", why: "Modelnya SAMA (GBM terkalibrasi); yang berubah hanya threshold keputusannya. ROC-AUC tidak bergantung pada threshold." },
            { text: "Threshold 0,50 menyetujui 3.573 nasabah tambahan, 729 di antaranya default — dan satu default merugikan 45% limit vs margin 5%", why: "Benar: approval naik 28,5% → 88,05%; bad rate naik 6,67% → 15,96%. Dengan LGD 45% vs margin 5%, kelompok tambahan itu terlalu berisiko untuk margin sekecil itu.", correct: true },
            { text: "Threshold 0,50 menyetujui lebih sedikit nasabah sehingga margin hilang", why: "Terbalik: 0,50 menyetujui LEBIH BANYAK (88,05% vs 28,5%). Kerugiannya datang dari default tambahan, bukan dari margin yang hilang." },
            { text: "Base rate default naik dari 0,2212 menjadi 0,50", why: "Base rate tetap 0,2212 — yang berubah adalah threshold keputusan, bukan datanya." },
          ],
        },
        {
          q: "Dengan margin 5% dan LGD 45%, berapa ambang impas teoretis p* — dan bagaimana hubungannya dengan threshold empiris?",
          options: [
            { text: "p* = 0,50 — sama dengan default klasifikasi biasa", why: "0,50 hanya benar bila margin = LGD. Di sini 0,05/(0,05+0,45) = 0,10, bukan 0,50." },
            { text: "p* = 0,05/(0,05+0,45) = 0,10 — sama dengan profit-max dan cost-optimal empiris", why: "Benar: setujui bila (1−p)×0,05 − p×0,45 > 0, yaitu p < 0,10. Tiga jalur — teori, profit-max, cost-min — semuanya menunjuk 0,10.", correct: true },
            { text: "p* = 0,45/(0,05+0,45) = 0,90 — kebalikan dari rumus yang benar", why: "Terbalik: pembilangnya margin (0,05), bukan LGD. p* = 0,05/0,50 = 0,10." },
            { text: "p* = 0,2212 — sama dengan base rate default", why: "Base rate 0,2212 adalah frekuensi default di data, bukan ambang keputusan. Ambang impas diturunkan dari BIAYA, bukan dari base rate." },
          ],
        },
        {
          q: "Min-expected-loss threshold juga 0,10 (expected loss NT$11.989.453). Mengapa angka ini TIDAK boleh disajikan sebagai bukti ketiga yang setara dengan profit-max dan cost-optimal?",
          options: [
            { text: "Karena angkanya salah — expected loss di 0,10 seharusnya lebih besar dari di 0,50", why: "Angkanya benar (NT$11.989.453 di 0,10 vs NT$56.668.700 di 0,50). Masalahnya bukan angkanya, melainkan apa yang dihitung kriteria itu." },
            { text: "Karena kriteria ini hanya menghitung kerugian buku yang disetujui — menyetujui nol nasabah memberi expected loss nol, jadi minimumnya degenerat ke tepi grid", why: "Benar: kriteria ini tidak menghukum penolakan (margin yang hilang tidak dihitung). Minimumnya terdorong ke threshold terendah secara mekanis — ia diagnosis, bukan optimasi.", correct: true },
            { text: "Karena expected loss tidak pernah dipakai di industri kredit", why: "Expected loss dipakai luas — sebagai diagnosis dan cadangan. Yang salah adalah memakainya sebagai KRITERIA OPTIMASI threshold, bukan memakainya sama sekali." },
            { text: "Karena 0,10 di sini berbeda dengan 0,10 profit-max — kebetulan angkanya sama", why: "Angkanya memang sama (0,10), tapi alasannya berbeda: profit-max menghitung kedua sisi biaya, min-EL hanya satu sisi. Kesamaan angkanya adalah kebetulan tepi grid, bukan kesepakatan independen." },
          ],
        },
        {
          q: "ROC-AUC GBM 0,7823. Apa yang TIDAK bisa disimpulkan dari angka ini?",
          options: [
            { text: "GBM mengurutkan nasabah default lebih tinggi daripada yang tidak, lebih baik dari LR (0,7426)", why: "Itu justru YANG bisa disimpulkan — ROC-AUC mengukur ranking, dan 0,7823 > 0,7426." },
            { text: "Probabilitas 0,8 dari GBM berarti peluang default 80%", why: "Benar: ROC-AUC tidak mengukur kejujuran probabilitas sama sekali. Klaim «0,8 berarti 80%» baru terbukti lewat reliability diagram (di sini: bin [0,7–0,8) aktual 0,7481 vs prediksi 0,7441 — dekat, tapi itu bukti reliability diagram, bukan ROC-AUC).", correct: true },
            { text: "GBM lebih baik dari tebakan acak (0,5)", why: "Itu bisa disimpulkan: 0,7823 jauh di atas 0,5." },
            { text: "GBM layak dipertimbangkan sebagai model keputusan", why: "Itu bisa disimpulkan sebagai langkah awal — ranking yang lumayan adalah syarat perlu, walau bukan syarat cukup (kalibrasi masih harus dicek)." },
          ],
        },
        {
          q: "Tiga bin GBM mentah menyumbang ECE parsial 0,0033; ECE penuh (10 bin) adalah 0,0073. Bin mana penyumbang TERBESAR di antara ketiganya?",
          options: [
            { text: "Bin [0,0–0,1): (1.791/6.000) × 0,0023 = 0,0007", why: "Bin ini sumbangannya 0,0007 — terkecil kedua. Gap-nya memang kecil (0,0023) walau n-nya terbesar." },
            { text: "Bin [0,2–0,3): (752/6.000) × 0,0198 = 0,0025", why: "Benar: 0,0025 — lebih besar dari dua bin lain digabung (0,0007 + 0,0002 = 0,0009). Gap terbesar (0,0198) mengalahkan n yang lebih kecil.", correct: true },
            { text: "Bin [0,7–0,8): (258/6.000) × 0,0040 = 0,0002", why: "Bin ini sumbangannya paling kecil (0,0002) — gap kecil dan n kecil." },
            { text: "Ketiganya sama besar karena ECE membobot rata", why: "ECE membobot per n_bin/N — sumbangannya berbeda: 0,0007 vs 0,0025 vs 0,0002. Tidak sama besar." },
          ],
        },
        {
          q: "Kapan kalibrasi ulang (Platt/isotonic) DIPERLUKAN menurut peta keputusan lesson ini?",
          options: [
            { text: "Selalu — setiap model harus dikalibrasi ulang sebelum dipakai", why: "Salah: di data ini GBM mentah (ECE 0,0073) tidak butuh kalibrasi ulang, dan Platt malah memburukkannya (ECE 0,0087). Kalibrasi ulang adalah obat, bukan vitamin." },
            { text: "Bila ECE besar atau ada bin besar yang menyimpang jauh dari diagonal — lalu bandingkan sebelum vs sesudah pada data calibration/validation yang sama", why: "Benar: itu cabang 2 peta keputusan. Dan kalibrasi yang tidak membaik pada data calibration/validation adalah kalibrasi yang gagal — buang.", correct: true },
            { text: "Hanya bila yang dibutuhkan adalah ranking nasabah paling berisiko", why: "Terbalik: bila hanya ranking yang dibutuhkan, kalibrasi TIDAK relevan — Platt/isotonic tidak mengubah ranking." },
            { text: "Bila ROC-AUC di bawah 0,75", why: "ROC-AUC mengukur ranking, bukan kalibrasi. Model dengan ROC-AUC rendah bisa terkalibrasi baik, dan sebaliknya. Pemicu kalibrasi ulang adalah ECE/reliability diagram, bukan ROC-AUC." },
          ],
        },
        {
          q: "Semua angka kalibrasi dan threshold di lesson ini dihitung pada test 6.000 yang sama, dan threshold 0,10 dipilih karena terlihat terbaik di test itu. Bagaimana status angka-angka ini menurut protokol yang benar?",
          options: [
            { text: "Angka-angka itu adalah evaluasi final yang sah — test 6.000 cukup besar sehingga memilih di sana tidak apa-apa", why: "Salah: besarnya test tidak menghapus seleksi. Memilih threshold pada data yang sama dengan tempat menilai adalah seleksi-di-test — angkanya optimistis, sebesar apa pun test-nya." },
            { text: "Angka-angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON — dalam praktik, calibration + threshold dipilih di data calibration/validation, dan test final hanya dibuka sekali", why: "Benar: itulah label eksplisit langkah 1 dan langkah 4. Angka-angkanya benar sebagai perhitungan dan berguna untuk belajar membaca tabel — tapi bukan template evaluasi final yang bebas seleksi.", correct: true },
            { text: "Angka-angka itu harus dibuang — lesson ini tidak mengajarkan apa pun yang benar", why: "Berlebihan: angka-angkanya benar sebagai perhitungan (ECE 0,0073, biaya NT$33.046.500) dan berguna untuk belajar — yang salah hanyalah bila dibaca sebagai template evaluasi final." },
            { text: "Angka-angka itu sah karena M6.5 mengizinkan memilih threshold di test asal hanya sekali", why: "Terbalik: M6.5 MELARANG memakai test untuk memilih threshold. «Dibuka sekali, di akhir» berarti untuk evaluasi, bukan untuk memilih." },
          ],
        },
        {
          q: "Bisnis menetapkan constraint approval rate minimum 50%. Threshold kanonis mana yang memenuhi constraint itu, dan mana yang terbaik di antaranya?",
          options: [
            { text: "0,15 (approval 49,88%) — hampir 50%, jadi cukup dekat", why: "Salah: 49,88% < 50% — constraint adalah ambang keras, bukan «hampir». Yang lolos hanya 0,20 (65,13%) dan 0,50 (88,05%)." },
            { text: "0,20 — satu-satunya yang lolos", why: "Tidak tepat: 0,50 juga lolos (88,05%). Tapi 0,20 yang TERBAIK di antara yang lolos (laba −NT$216.500 vs −NT$18.994.456 di 0,50)." },
            { text: "0,20 — terbaik di antara 0,20 dan 0,50 yang lolos; harganya NT$8.430.500 laba dibanding profit-max 0,10", why: "Benar: 0,20 dan 0,50 lolos constraint approval ≥ 50%; 0,20 profitnya terbesar (−NT$216.500). Harganya: 8.214.000 − (−216.500) = NT$8.430.500 dibanding profit-max.", correct: true },
            { text: "0,10 — profit-max, jadi constraint tidak mengubah apa pun", why: "Salah: 0,10 approval-nya hanya 28,5% — ia MELANGGAR constraint approval 50%. Profit-max tanpa constraint dan pilihan-dengan-constraint adalah dua jawaban berbeda." },
          ],
        },
      ],
      summary: [
        "Ranking ≠ kalibrasi: ROC-AUC GBM 0,7823 [notebook] mengukur urutan, bukan kejujuran probabilitas — kejujuran dibuktikan reliability diagram, bukan ROC-AUC.",
        "Kalibrasi [notebook]: GBM mentah Brier 0,1342 / ECE 0,0073 (terbaik); LR mentah 0,1427 / 0,0160; LR + Platt 0,1427 / 0,0160; LR + isotonic 0,1427 / 0,0163; GBM + Platt 0,1345 / 0,0087.",
        "Kalibrasi ulang TIDAK memperbaiki apa pun di data ini — GBM mentah sudah terkalibrasi baik; Platt/isotonic malah sedikit memburuk. Cek dulu (reliability diagram + ECE), baru putuskan.",
        "Reliability bins GBM mentah [notebook]: [0,2–0,3) n = 752, prediksi 0,2419 vs aktual 0,2221 (selisih 0,0198); [0,7–0,8) n = 258, prediksi 0,7441 vs aktual 0,7481 (selisih 0,0040). Baca bin bersama n-nya.",
        "Threshold (GBM terkalibrasi (Platt/sigmoid)) [notebook]: t = 0,10 → approval 28,5%, bad rate 6,67%, biaya NT$33.046.500, laba +NT$8.214.000; t = 0,50 → approval 88,05%, bad rate 15,96%, biaya NT$60.254.956, laba −NT$18.994.456.",
        "Ambang impas p* = 0,05/(0,05+0,45) = 0,10 (LGD 45%, margin 5%) — profit-max dan cost-optimal SEPAKAT di 0,10, cocok dengan teori.",
        "Min-expected-loss (0,10, NT$11.989.453) DEGENERAT: hanya menghitung kerugian buku yang disetujui — menyetujui nol nasabah memberi expected loss nol. Perbandingan yang bermakna: profit-max vs cost-min.",
        "Lab: ECE parsial 3 bin GBM mentah = 0,0033 (dari ECE penuh 0,0073); p* = 0,1000, approval 0,10 = 0,2850, bad rate = 0,0667, selisih laba 0,10 vs 0,50 = NT$27.208.456.",
        "Three-way split: calibration + threshold + model dipilih di train/calibration-validation; final test dibuka SEKALI di akhir. Semua angka lesson ini adalah HASIL ILUSTRASI PROTOKOL LESSON (dihitung pada test 6.000 yang sama), bukan template evaluasi final — lab: threshold terbaik di kalibrasi 0,15, biaya jujur di test NT$35.770.000, optimism gap NT$2.723.500.",
        "Operating points: satu ranking (ROC-AUC 0,7823) punya banyak operating point — confusion matrix threshold-dependent, ranking threshold-independent. Constraint approval minimum 50% memilih 0,20 (laba −NT$216.500, harga NT$8.430.500); bad rate maksimum 10% dan recall minimum 80% memilih 0,10.",
      ],
      next: { label: "Lanjut: MLF-M6.5 — AutoML & Selection Bias", href: "/v2/learn/mlf-m65-automl-selection-bias" },
    },
  ],
};

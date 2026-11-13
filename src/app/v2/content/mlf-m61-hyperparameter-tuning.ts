import type { V2Lesson } from "../lib/types";

export const mlfM61: V2Lesson = {
  slug: "mlf-m61-hyperparameter-tuning",
  track: "Machine Learning Finance",
  module: "Tuning & model selection",
  title: "MLF-M6.1 — Hyperparameter Tuning: Mencari Setting Terbaik, Bukan Model Terbaik",
  estMinutes: 75,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Tuning bukan mencari model terbaik — tapi setting terbaik untuk satu model",
      prose: [
        "Modul M6 adalah tuning & model selection: dari «model apa yang dipakai» (M1–M5) ke «setting berapa yang dipakai model itu» — dan, yang lebih penting, «bagaimana membandingkan model dengan jujur». Lesson ini membuka modul itu dengan hyperparameter tuning: mencari nilai setting terbaik untuk satu model yang sudah dipilih.",
        "Kamu sudah punya dua model flagship dari proyek credit scoring (data UCI Default of Credit Card Clients, 30.000 baris, base rate gagal bayar 0,2212; train 24.000, test 6.000, 31 fitur [notebook]): logistic regression (LR) dengan ROC-AUC test 0,7426 / PR-AUC 0,5049, dan gradient boosting machine (GBM) dengan ROC-AUC test 0,7823 / PR-AUC 0,5597. GBM train ROC-AUC 0,8469 vs test 0,7823 — gap 0,0646 [notebook]. Threshold operasional 0,10. Pertanyaan lesson ini: bisakah tuning menaikkan angka-angka itu — dan berapa harga yang dibayar untuk kenaikannya?",
        "Jawaban singkatnya, dari angka kanonis [notebook]: tuning menaikkan GBM hanya sekitar 0,0025 di CV (0,7840 → grid terbaik 0,7865; ingat, default dinilai 5-fold CV sedangkan grid 3-fold CV, jadi selisih ini orde besaran, bukan selisih eksak), dan di test kenaikannya NOL — GBM tertala tetap 0,7823, sama persis dengan GBM default. Lesson ini menjelaskan mengapa hasil yang «mengecewakan» itu justru normal, dan mengapa tuning tetap layak dilakukan — asal caranya jujur.",
        "Peta lesson: pilih metrik utama → hyperparameter vs parameter → grid search → random search → merancang search space → worked example LR (grid C) → worked example GBM (grid 18 konfigurasi) → shrinking random search → budget & kapan berhenti → jebakan tuning (termasuk tuning di test = leakage, jembatan ke M6.2) → peta keputusan → 3 lab → checkpoint.",
        "Nilai: tuning adalah pekerjaan yang paling sering disalahpahami di ML — ia terlihat seperti «optimasi gratis», padahal setiap konfigurasi yang dicoba adalah satu kesempatan untuk overfitting ke validasi. Memahami tuning berarti memahami batas antara «mencari» dan «menghafal».",
        "Baik atau buruk: tuning bagus bila ia mengubah setting yang memang berpengaruh dan diukur dengan CV yang jujur. Buruk bila ia dijadikan ritual — mencoba ratusan konfigurasi sampai satu skor terlihat bagus, lalu melaporkan skor itu seolah-olah itulah kemampuan modelnya.",
        "Mitigasi: sebelum tuning, catat dulu skor default sebagai baseline (di sini: GBM CV 0,7840, test 0,7823). Tanpa baseline, setiap angka tuning terlihat seperti kemenangan — termasuk kemenangan yang sebenarnya tidak ada.",
      ],
      tasks: [],
    },
    {
      id: "pilih-metrik",
      eyebrow: "Langkah 2 · Pilih metrik utama",
      title: "Sebelum tuning: tetapkan SATU metrik utama — metrik dipilih dari tujuan, bukan dari yang paling besar angkanya",
      prose: [
        "Tuning mengoptimasi apa yang kamu ukur — jadi metrik yang kamu pilih SEBELUM search menentukan apa arti «terbaik». Lesson ini sejauh ini memakai ROC-AUC sebagai metrik utama tanpa pernah menjelaskan mengapa ROC-AUC, bukan yang lain. Langkah ini menutup celah itu: metrik utama dipilih dari TUJUAN bisnis, ditulis sebelum satu konfigurasi pun dicoba, dan tidak diganti di tengah jalan hanya karena konfigurasi favoritmu kalah di metrik itu.",
        "Decision table — tujuan → metrik utama. (a) MERANKING nasabah dari paling berisiko ke paling aman → ROC-AUC: ia mengukur kualitas urutan, bukan keputusan pada satu ambang. (b) Kelas positif langka dan yang dicari adalah sedikit yang benar-benar gagal bayar → PR-AUC sebagai pendamping utama: di data ini base rate hanya 0,2212, jadi PR-AUC membedakan model jauh lebih tajam daripada ROC-AUC. (c) Probabilitas DIPAKAI SEBAGAI ANGKA — penetapan harga, pencadangan, keputusan berbasis ambang → Brier score dan ECE: mengukur apakah probabilitas 0,30 benar-benar berarti 30 dari 100 nasabah gagal bayar. (d) Keputusan PUNYA BIAYA → expected cost atau expected profit: metriknya adalah rupiah, bukan skor statistik — cara menghitungnya di M6.4. (e) Imbalance → JANGAN hanya accuracy: accuracy mengabaikan kelas mana yang salah.",
        "Paket metrik lesson ini [notebook]: GBM test ROC-AUC 0,7823 / PR-AUC 0,5597 / Brier 0,1342; LR test ROC-AUC 0,7426 / PR-AUC 0,5049 / Brier 0,1427. Baca ketiganya bersama: GBM menang di ROC-AUC (+0,0397 atas LR), menang LEBIH BESAR secara relatif di PR-AUC (+0,0548), dan menang di Brier (−0,0085; lebih kecil lebih baik). Bila kamu hanya melihat ROC-AUC, kamu meremehkan seberapa besar keunggulan GBM di wilayah yang langka — dan bila kamu hanya melihat accuracy, kamu bahkan tidak melihat apa-apa: lihat jebakan di bawah.",
        "Nilai: model yang selalu memprediksi «tidak gagal bayar» mendapat accuracy 0,7788 (1 − 0,2212) — terlihat bagus, padahal ia tidak menemukan SATU PUN nasabah gagal bayar. Accuracy 0,7788 itu bukan kemampuan; itu cerminan base rate. Inilah mengapa «jangan hanya accuracy» bukan nasihat gaya — di data imbalance, accuracy adalah metrik yang memberi nilai tinggi pada model yang tidak melakukan apa-apa.",
        "Yang harus ditetapkan SEBELUM search — tiga baris: (1) METRIK UTAMA, satu saja, yang menentukan pemenang; (2) DIAGNOSTIK SEKUNDER, untuk memeriksa apakah pemenang juga sehat di dimensi lain; (3) BUSINESS CONSTRAINT, batas yang tidak boleh dilanggar pemenang, ditulis sebagai syarat, bukan sebagai metrik yang dioptimasi — misal [ilustrasi] bad rate maksimum pada nasabah yang disetujui, atau approval rate minimum. Paket lesson ini: utama ROC-AUC, sekunder PR-AUC + Brier; constraint sebagai syarat bisnis dibahas di M6.4.",
        "Baik atau buruk: metrik yang ditulis sebelum search bagus — ia mengubah «terbaik» dari selera menjadi kontrak, dan membuat hasil tuning bisa diaudit orang lain. Buruk bila metrik diganti di tengah jalan: mencoba ROC-AUC, kalah, lalu pindah ke accuracy karena di situ menang — itu selection bias dengan baju metrik, sama tidak jujurnya dengan tuning di test (langkah 11).",
        "Mitigasi: tulis tiga baris itu sebelum search, dan laporkan SELALU metrik sekunder pemenang bersama metrik utamanya: GBM tertala yang menang di ROC-AUC (CV 0,7865) tetap harus menunjukkan PR-AUC dan Brier-nya di test (0,5598 / 0,1342) agar kemenangan itu bisa diperiksa — bila pemenang ROC-AUC ternyata kalah telak di Brier, kamu harus tahu sebelum memakainya, bukan sesudahnya.",
      ],
      formula: String.raw`\text{accuracy}_{\text{mayoritas}} = 1 - 0,2212 = 0,7788`,
      formulaNote: "Accuracy model yang selalu memprediksi «tidak gagal bayar»: 1 − base rate (0,2212) = 0,7788. Angka yang terlihat bagus untuk model yang tidak menemukan satu pun nasabah gagal bayar — bukti accuracy saja tidak cukup di data imbalance.",
      tasks: [],
      quiz: [
        {
          q: "Tim kredit memakai skor model untuk mengurutkan nasabah dari paling berisiko, lalu petugas meninjau 10% teratas. Metrik utama yang tepat ditetapkan SEBELUM tuning?",
          options: [
            { text: "ROC-AUC — karena tugasnya meranking, bukan memutuskan pada satu ambang", why: "Benar: ROC-AUC mengukur kualitas urutan di semua ambang — persis yang dibutuhkan saat petugas meninjau persentil teratas.", correct: true },
            { text: "Accuracy — karena yang penting adalah berapa banyak prediksi yang benar", why: "Salah: accuracy mengabaikan kelas mana yang salah; di data imbalance, model mayoritas saja sudah 0,7788 tanpa menemukan satu pun gagal bayar." },
            { text: "Brier score — karena skor model adalah probabilitas", why: "Brier mengukur kualitas probabilitas sebagai angka — itu metrik utama bila probabilitasnya DIPAKAI sebagai angka (harga, cadangan), bukan bila tugasnya mengurutkan untuk ditinjau." },
            { text: "Expected profit — karena akhirnya semua soal uang", why: "Expected profit adalah metrik utama bila keputusan punya biaya dan threshold sudah ditetapkan (M6.4) — di sini tugasnya baru mengurutkan untuk ditinjau, bukan memutuskan dengan biaya." },
          ],
        },
        {
          q: "Base rate gagal bayar 0,2212. Model yang selalu memprediksi «tidak gagal bayar» mendapat accuracy 0,7788. Apa bacaan yang benar?",
          options: [
            { text: "Model itu bagus — accuracy 0,7788 sudah di atas 0,75", why: "Salah: accuracy itu hanya cerminan base rate (1 − 0,2212). Model tersebut tidak menemukan SATU PUN nasabah gagal bayar — ia tidak melakukan apa-apa." },
            { text: "Accuracy menipu di data imbalance: model itu menemukan nol gagal bayar — pakai PR-AUC (dan ROC-AUC) untuk menilai, bukan accuracy saja", why: "Benar: di base rate 0,2212, accuracy 0,7788 adalah hadiah gratis untuk model mayoritas. PR-AUC GBM 0,5597 vs LR 0,5049 menunjukkan perbedaan nyata yang disembunyikan accuracy.", correct: true },
            { text: "Model itu harus ditala — tuning akan memperbaiki accuracy-nya", why: "Tuning tidak memperbaiki masalahnya: masalahnya adalah METRIK-nya, bukan setting-nya. Model mayoritas tidak punya hyperparameter yang membuatnya menemukan gagal bayar." },
            { text: "Accuracy 0,7788 membuktikan GBM (0,7823) hanya sedikit lebih baik", why: "Salah membandingkan: 0,7823 adalah ROC-AUC GBM, bukan accuracy-nya — membandingkan ROC-AUC dengan accuracy adalah membandingkan dua metrik yang berbeda." },
          ],
        },
      ],
    },
    {
      id: "hyperparameter",
      eyebrow: "Langkah 3 · Hyperparameter vs parameter",
      title: "Parameter dipelajari dari data; hyperparameter dipilih sebelum latihan",
      prose: [
        "Satu model punya dua jenis angka. PARAMETER dipelajari dari data saat latihan: koefisien logistic regression, atau struktur pohon-pohon di GBM. HYPERPARAMETER dipilih SEBELUM latihan, oleh kamu: seberapa kuat regularisasi, berapa dalam pohonnya, berapa banyak pohonnya, seberapa besar learning rate-nya. Hyperparameter mengendalikan CARA model belajar; parameter adalah HASIL belajarnya.",
        "Nilai: logistic regression dengan regularisasi L2 meminimalkan loss + penalti pada besar koefisien [notebook]: koefisien θ dipelajari dari data, tapi λ (kekuatan penalti) harus kamu tetapkan dulu. Di sklearn, yang kamu setel bukan λ melainkan C = 1/λ (hingga faktor ½ pada suku L2) — C besar berarti penalti kecil (model lebih bebas), C kecil berarti penalti besar (model lebih terkekang). Grid C di lesson ini: 0,01; 0,1; 1; 10; 100 [notebook].",
        "Di GBM (HistGradientBoostingClassifier) ada tiga hyperparameter yang ditala di lesson ini [notebook]: jumlah pohon (max_iter) — 50, 100, atau 200; kedalaman maksimum pohon (max_depth) — tanpa batas, 3, atau 5; dan learning rate — 0,05 atau 0,1. Perhatikan penamaan yang jujur: parameter jumlah pohon di sini adalah max_iter, BUKAN n_estimators — HistGradientBoostingClassifier tidak punya n_estimators. Menulis n_estimators untuk model ini adalah kesalahan API, bukan sekadar salah istilah (langkah 8).",
        "Baik atau buruk: pemisahan ini bagus karena ia menjelaskan mengapa tuning tidak bisa «dipelajari» oleh model itu sendiri — model tidak bisa memilih caranya sendiri belajar dari data yang sama tanpa melingkar. Buruk bila pemisahan ini diabaikan: siapa pun yang «menyetel» hyperparameter dengan melihat skor test sedang mencampur dua peran itu — dan itulah leakage (langkah 11).",
        "Mitigasi: perlakukan hyperparameter seperti keputusan desain, bukan seperti parameter. Tuliskan grid yang akan dicoba SEBELUM melihat hasilnya, dan nilai tiap konfigurasi dengan cross-validation di train — bukan dengan test.",
      ],
      formula: String.raw`\hat{\theta}(\lambda) = \arg\min_{\theta}\; \left[ \mathcal{L}(\theta) + \lambda\, \|\theta\|_2^2 \right], \qquad C = \frac{1}{\lambda}`,
      formulaNote: "Logistic regression L2: θ (koefisien) dipelajari dari data dengan λ tetap; λ — atau C = 1/λ (hingga faktor ½ pada suku L2) di sklearn — adalah hyperparameter yang kamu pilih sebelum latihan. C besar = penalti kecil.",
      tasks: [],
      note: {
        title: "Miskonsepsi: hyperparameter bisa dipelajari dari data seperti parameter",
        type: "pitfall",
        body: "Yang benar: bila λ ikut «dipelajari» dengan meminimalkan loss yang sama, jawabannya selalu λ = 0 — tanpa penalti, loss latihan selalu paling kecil. Itulah mengapa hyperparameter harus dipilih dengan kriteria LUAR (cross-validation), bukan dengan loss latihan. Parameter menjawab «berapa koefisiennya»; hyperparameter menjawab «seberapa bebas model boleh memakai data».",
      },
    },
    {
      id: "grid-search",
      eyebrow: "Langkah 4 · Grid search",
      title: "Grid search: coba semua kombinasi — dan bayar harga eksponensialnya",
      prose: [
        "Grid search adalah cara paling mudah diaudit (lengkap dan deterministik) untuk tuning: tentukan beberapa nilai untuk tiap hyperparameter, lalu coba SEMUA kombinasinya — mahal bila dimensinya banyak. Setiap kombinasi dinilai dengan cross-validation, dan yang terbaik menang. Tidak ada tebakan, tidak ada adaptasi — hanya pencacahan yang sistematis.",
        "Nilai: grid GBM di lesson ini [notebook]: max_iter {50, 100, 200} × max_depth {tanpa batas, 3, 5} × learning_rate {0,05; 0,1} = 3 × 3 × 2 = 18 konfigurasi. Tiap konfigurasi dinilai dengan 3-fold CV, jadi total 18 × 3 = 54 fits. Satu angka itu — 54 fits — adalah harga yang dibayar untuk jawaban «yang terbaik dari 18 kombinasi ini».",
        "Baik atau buruk: grid search bagus karena ia lengkap dan bisa direproduksi — siapa pun yang menjalankan grid yang sama mendapat jawaban yang sama, dan tidak ada konfigurasi di dalam grid yang terlewat. Buruk karena biayanya MELEDAK secara eksponensial: tambah satu hyperparameter dengan 5 nilai, dan jumlah konfigurasi dikali 5 [ilustrasi: 4 hyperparameter × 5 nilai = 625 konfigurasi; dengan 3-fold CV = 1.875 fits]. Di dimensi tinggi, grid search menghabiskan budget untuk kombinasi-kombinasi yang sebagian besar tidak penting.",
        "Mitigasi: pakai grid search bila jumlah hyperparameternya SEDIKIT (1–3) dan tiap nilai punya alasan — seperti di lesson ini. Bila hyperparameternya banyak atau rentangnya kontinu, grid adalah cara termahal untuk mencari di ruang yang sebagian besar kosong (langkah 5).",
      ],
      formula: String.raw`N_{\mathrm{total}} = \left( \prod_{j=1}^{d} |G_j| \right) \times K`,
      formulaNote: "Total fits grid search: hasil kali jumlah nilai tiap hyperparameter (|G_j|, d = jumlah hyperparameter) dikali K = jumlah fold CV. Grid GBM lesson ini: 3 × 3 × 2 × 3 = 54 fits.",
      tasks: [],
    },
    {
      id: "random-search",
      eyebrow: "Langkah 5 · Random search",
      title: "Random search: acak yang menang atas grid di dimensi tinggi",
      prose: [
        "Random search mengganti pencacahan dengan undian: tiap konfigurasi diambil acak dari distribusi tiap hyperparameter, sebanyak budget yang kamu tetapkan. Kedengarannya ceroboh — tapi ada alasan matematis mengapa ia sering mengalahkan grid pada budget yang sama.",
        "Alasannya: biasanya hanya SEDIKIT hyperparameter yang benar-benar berpengaruh. Grid dengan 5 nilai per hyperparameter hanya mencoba 5 nilai BERBEDA untuk hyperparameter yang penting — sisanya adalah pengulangan nilai yang sama dalam kombinasi berbeda. Random search dengan 27 undian mencoba 27 nilai BERBEDA untuk hyperparameter yang penting itu. Di dimensi yang penting, random search menjelajah lebih halus; di dimensi yang tidak penting, variasinya tidak merugikan.",
        "Nilai [ilustrasi]: peluang melewatkan 5% wilayah terbaik setelah n undian adalah (1 − 0,05)^n. Dengan n = 27 undian (budget random search lesson ini), peluang melewatkannya 0,2503 — artinya peluang MENEMUKAN setidaknya satu konfigurasi di 5% teratas adalah 0,7497, sekitar 3 dari 4 kali. Dengan n = 60, peluangnya naik ke 0,9539. Rumus sederhana ini menjelaskan mengapa random search yang «asal» tetap bisa diandalkan: ia tidak perlu mencoba semuanya, cukup cukup banyak.",
        "Nilai [notebook]: random search GBM — 27 konfigurasi, 3-fold CV, 81 fits, seed 42 — konfigurasi terbaiknya (jumlah pohon (max_iter) 100, max_depth 5, learning rate 0,0425) mendapat CV 0,7866, hanya 0,0001 di atas grid terbaik (0,7865). Dan dari 27 konfigurasi itu, hanya 1 yang mengalahkan grid terbaik. Random search di sini TIDAK menghancurkan grid — ia hanya sedikit lebih baik, dengan budget fits 1,5× lipat (81 vs 54).",
        "Baik atau buruk: random search bagus bila hyperparameternya banyak, sebagian kontinu, dan kamu tidak tahu mana yang penting — ia memberi cakupan yang lebih merata per budget. Buruk bila dipakai tanpa seed yang dicatat (tidak bisa direproduksi) atau bila distribusinya salah — mengundi learning rate secara uniform di 0,01–1,0 memboroskan sebagian besar undian di nilai yang terlalu besar; skala log-uniform lebih masuk akal (lesson ini memakai log-uniform 0,03–0,20 [notebook]).",
        "Mitigasi: tetapkan seed (di sini 42), catat distribusi tiap hyperparameter, dan bandingkan random search dengan grid pada METRIK YANG SAMA (CV yang sama, fold yang sama). Tanpa itu, «random menang» bisa jadi hanya «CV-nya berbeda».",
      ],
      formula: String.raw`P(\text{melewatkan } q \text{ teratas}) = (1 - q)^n`,
      formulaNote: "Peluang random search melewatkan q-fraksi wilayah terbaik setelah n undian. Untuk q = 0,05 dan n = 27: (0,95)^27 = 0,2503 — peluang menemukan setidaknya satu konfigurasi di 5% teratas adalah 0,7497.",
      tasks: [],
    },
    {
      id: "search-space",
      eyebrow: "Langkah 6 · Merancang search space",
      title: "Merancang search space: kasar dulu, log untuk yang multiplikatif, dan hormati interaksinya",
      prose: [
        "Grid dan random search menjawab «bagaimana mencari», tapi keduanya diam soal «di mana mencari». Search space — himpunan nilai yang BOLEH dicoba tiap hyperparameter — adalah keputusan desain yang menentukan apakah pencarianmu bisa menemukan apa pun. Search space yang buruk tidak diperbaiki oleh metode pencarian yang bagus: grid yang sempurna di wilayah yang salah tetap memberi jawaban yang salah.",
        "Nilai: mulai KASAR, lalu PERSEMPIT (coarse-to-fine). Tahap kasar lesson ini adalah grid 18 konfigurasi [notebook]: max_iter {50, 100, 200} × max_depth {tanpa batas, 3, 5} × learning_rate {0,05; 0,1}. Tahap halusnya adalah shrinking random search: 9 konfigurasi di sekitar pemenang (100, 5, 0,0425) → terbaik (200, 5, 0,0297) CV 0,7869. Aturannya: tahap kasar memetakan WILAYAH (mana yang menjanjikan), tahap halus menjelajah TITIK di dalam wilayah itu. Membalik urutannya — halus dulu — berarti mengoptimasi titik di wilayah yang belum terbukti menjanjikan.",
        "Nilai: parameter MULTIPLIKATIF — yang efeknya bekerja lewat perkalian, seperti learning rate dan C — dirancang dalam skala LOG, bukan linear. Lesson ini memakai log-uniform 0,03–0,20 untuk learning rate [notebook]: jarak 0,03 → 0,06 sama pentingnya dengan 0,10 → 0,20 (sama-sama ×2), sementara grid linear memboroskan titik di ujung besar dan melewatkan wilayah kecil. [ilustrasi] Lima titik yang merata dalam log di 0,03–0,20 adalah 0,03; 0,05; 0,08; 0,12; 0,20 — bandingkan dengan lima titik linear 0,03; 0,07; 0,12; 0,16; 0,20 yang menumpuk di atas. Kebalikannya: max_iter dan max_depth adalah parameter diskrit — skala linear/diskrit sudah benar untuk mereka.",
        "Nilai: sebagian nilai hanya bermakna BERSYARAT — conditional space. Contoh yang benar dari GBM: batas jumlah daun per pohon (max_leaf_nodes) hanya mengikat bila pohonnya cukup dalam untuk mencapai batas itu — pohon max_depth 3 punya paling banyak 2³ = 8 daun, jadi batas daun di atas 8 TIDAK PERNAH mengikat di situ; memasukkan batas daun ke grid untuk depth 3 adalah mengundi parameter yang tidak berpengaruh. Aturan umumnya: bila satu hyperparameter hanya aktif dalam kondisi tertentu (misal parameter early stopping hanya bermakna bila early stopping menyala), tuliskan kondisinya di desain search space — jangan biarkan grid mencoba kombinasi yang secara struktural tidak bisa berpengaruh.",
        "Nilai: sebagian kombinasi TAK LAYAK dan harus dikeluarkan dari desain, bukan dibiarkan gagal di tengah jalan. [ilustrasi] Learning rate sangat kecil + max_iter kecil = pohon terlalu sedikit dengan langkah terlalu kecil — model berhenti sebelum belajar (underfit struktural, bukan karena data). Sebaliknya max_depth tanpa batas + learning rate besar + max_iter besar = pohon dalam yang masing-masing melangkah besar, resep overfitting yang mahal. Keduanya bukan «konfigurasi yang kalah» — keduanya adalah kombinasi yang seharusnya tidak masuk grid sejak awal, karena menghabiskan fits untuk jawaban yang sudah bisa diduga.",
        "Nilai [notebook]: interaksi itu NYATA di grid 18 konfigurasi — dan bisa dihitung dari hasil grid yang sama (lab 3). Rata-rata per learning rate hampir sama (0,05 → 0,7851; 0,10 → 0,7850). Tapi DI DALAM tiap kedalaman, arahnya BERBALIK: pada max_depth 5, learning rate 0,05 lebih baik 0,0010 (rata-rata 0,78613 vs 0,78517); pada max_depth 3, learning rate 0,10 lebih baik 0,0012 (rata-rata 0,7860 vs 0,7848). Membaca «learning rate 0,05 lebih baik» tanpa menyebut kedalamannya adalah kesimpulan yang salah separuh — efek learning rate BERGANTUNG pada kedalaman. Interaksi kedua: learning rate × max_iter — pada lr 0,05, rata-rata naik dengan pohon (50 → 0,7841; 100 → 0,7855; 200 → 0,7858), sedangkan pada lr 0,10 rata-ratanya DATAR (50 → 0,7849; 100 → 0,7850; 200 → 0,7850): lr kecil butuh pohon lebih banyak untuk mencapai efek yang sama — persis hubungan yang diprediksi teori boosting. Interaksi ketiga, depth × regularisasi, berlaku konseptual: pohon yang lebih dalam (depth 5 / tanpa batas) lebih butuh regularisasi (learning rate kecil, min_samples_leaf besar) daripada pohon dangkal — karena tiap pohon dalam lebih mampu menghafal; tanpa angka karangan di sini, ini adalah arah yang harus DIUJI di grid berikutnya, bukan diklaim.",
        "Gambar di bawah memetakan search space lesson ini dalam 2D — learning rate (skala log) vs max_depth — dengan 6 titik grid, 3 titik random search terbaik di depth 5, dan kotak zoom coarse-to-fine di sekitar pemenang (0,05; 5). Perhatikan: sumbu-x-nya log, bukan linear — itulah mengapa titik 0,05 dan 0,10 tidak berjarak sama dengan 0,10 dan 0,20.",
        "Baik atau buruk: search space yang dirancang dengan baik bagus karena ia memperkecil ruang SEBELUM menghabiskan budget — tiap fits dipakai di wilayah yang punya alasan. Buruk bila grid ditulis dari kebiasaan («nilai yang biasa dipakai») tanpa alasan — nilai default tutorial belum tentu wilayah yang relevan untuk datamu. Dan buruk bila interaksi diabaikan: grid yang menilai tiap hyperparameter sendirian (one-at-a-time) tidak akan pernah menemukan bahwa learning rate terbaik BERGANTUNG pada kedalaman.",
        "Mitigasi: sebelum menulis grid, tulis empat baris: (1) rentang tiap parameter + alasannya (log atau linear?); (2) kondisi antar-parameter (mana yang hanya aktif bila …); (3) kombinasi yang dikeluarkan + alasannya; (4) tahap kasar vs halus + budget tiap tahap. Bila satu baris tidak bisa ditulis, search space-mu belum dirancang — baru ditebak.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Search space 2D learning rate skala log 0,03 sampai 0,20 vs max_depth 3, 5, tanpa batas: grid 6 titik; terbaik di learning rate 0,05 dan depth 5; kotak zoom coarse-to-fine di sekitarnya; tiga titik random search di depth 5">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Search space: learning rate (log) × max_depth</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="70" x2="52" y2="70" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="73" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<line x1="48" y1="125" x2="52" y2="125" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="128" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5</text>
<line x1="48" y1="180" x2="52" y2="180" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="183" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">None</text>
<text x="20" y="30" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">depth</text>
<text x="52" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,03</text>
<text x="163" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,05</text>
<text x="315" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<text x="458" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,20</text>
<text x="259" y="236" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">learning rate (skala log)</text>
<rect x="105" y="100" width="125" height="50" fill="none" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 3"/>
<text x="167" y="95" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">zoom coarse-to-fine</text>
<circle cx="163" cy="70" r="7" fill="var(--c1)"/>
<circle cx="163" cy="125" r="7" fill="var(--c4)"/>
<circle cx="163" cy="180" r="7" fill="var(--c1)"/>
<circle cx="315" cy="70" r="7" fill="var(--c1)"/>
<circle cx="315" cy="125" r="7" fill="var(--c1)"/>
<circle cx="315" cy="180" r="7" fill="var(--c1)"/>
<circle cx="128" cy="125" r="4" fill="var(--c2)"/>
<circle cx="72" cy="125" r="4" fill="var(--c2)"/>
<circle cx="211" cy="125" r="4" fill="var(--c2)"/>
<text x="163" y="145" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">terbaik (0,05; 5) ★</text>
<text x="315" y="145" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">(0,10; 5)</text>
</svg>`,
        alt: "Search space 2D: learning rate (skala log 0,03–0,20) vs max_depth (3, 5, tanpa batas). Grid 6 titik; terbaik di (0,05; 5); kotak zoom coarse-to-fine di sekitarnya; tiga titik random search di depth 5.",
        caption: "Cara membaca: sumbu-x log — jarak 0,03→0,05 sama bobotnya dengan 0,10→0,20 (sama-sama penggandaan). Lingkaran besar = 6 titik grid (lr {0,05; 0,1} × depth {3, 5, None}); titik kecil = 3 konfigurasi random-search terbaik, semuanya di depth 5 [notebook]. Kotak putus-putus = wilayah zoom coarse-to-fine di sekitar pemenang (0,05; 5).",
      },
      tasks: [],
      quiz: [
        {
          q: "Learning rate diundi log-uniform 0,03–0,20. Mengapa skala log, bukan linear 0,03–0,20?",
          options: [
            { text: "Karena efek learning rate bekerja lewat perkalian: skala log memberi bobot sama pada tiap penggandaan (0,03→0,06 sama pentingnya dengan 0,10→0,20)", why: "Benar: parameter multiplikatif dirancang dalam log — grid linear memboroskan titik di ujung besar dan melewatkan wilayah kecil.", correct: true },
            { text: "Karena skala log selalu memberi skor CV yang lebih tinggi", why: "Salah: skala pencarian tidak mengubah skor konfigurasi mana pun — ia hanya mengubah WILAYAH mana yang dijelajahi. Log tidak «menaikkan» skor." },
            { text: "Karena learning rate harus selalu di bawah 0,20", why: "Tidak ada aturan itu — 0,20 adalah batas atas search space lesson ini, bukan batas universal learning rate." },
            { text: "Karena grid linear tidak bisa dipakai untuk random search", why: "Salah: random search bisa mengundi dari distribusi apa pun, linear maupun log. Pilihannya soal bobot wilayah, bukan soal bisa/tidak." },
          ],
        },
        {
          q: "Pada grid GBM, learning rate 0,05 lebih baik pada depth 5 (+0,0010) tapi lebih buruk pada depth 3 (−0,0012 dibanding lr 0,10). Apa artinya?",
          options: [
            { text: "Learning rate 0,05 adalah yang terbaik secara umum — depth 3 adalah pengecualian yang bisa diabaikan", why: "Salah: «pengecualian» itu justru buktinya — efek learning rate BERGANTUNG pada kedalaman. Mengabaikannya berarti mengklaim separuh kesimpulan." },
            { text: "Ada interaksi learning rate × max_depth: efek learning rate bergantung pada kedalaman, jadi kesimpulan harus menyebut kedalamannya", why: "Benar [notebook]: pada depth 5 lr 0,05 menang 0,0010, pada depth 3 lr 0,10 menang 0,0012 — arah efeknya berbalik. Itulah interaksi.", correct: true },
            { text: "Grid-nya salah hitung — satu learning rate tidak bisa menang dan kalah sekaligus", why: "Tidak ada yang salah hitung: rata-rata per kelompok dihitung dari 18 skor grid yang sama (lab 3). Menang di satu kondisi dan kalah di kondisi lain adalah definisi interaksi." },
            { text: "Depth 3 harus dihapus dari grid karena hasilnya bertentangan", why: "Salah: menghapus kondisi yang «bertentangan» adalah menyembunyikan interaksi, bukan menyelesaikannya. Depth 3 tetap bagian dari peta wilayah." },
          ],
        },
      ],
    },
    {
      id: "lr-c-grid",
      eyebrow: "Langkah 7 · Worked example 1",
      title: "Grid C logistic regression: kurva yang datar setelah C = 1",
      prose: [
        "Contoh pertama memakai model yang paling sederhana: logistic regression dengan satu hyperparameter, C. Grid-nya lima nilai: 0,01; 0,1; 1; 10; 100 — masing-masing dinilai dengan 5-fold CV di train (24.000 baris) [notebook]. Hasilnya:",
        "C = 0,01 → CV ROC-AUC 0,7568 (sd 0,0089; test 0,7411). C = 0,1 → 0,7579 (sd 0,0083; test 0,7424). C = 1 → 0,7581 (sd 0,0083; test 0,7426). C = 10 → 0,7581 (sd 0,0083; test 0,7426). C = 100 → 0,7581 (sd 0,0083; test 0,7426). Grid terbaik: C = 1, CV 0,7581 [notebook].",
        "Nilai: rentang seluruh grid hanya 0,0013 (0,7581 − 0,7568) — lebih kecil dari standar deviasi antar-fold (0,0083; sd populasi atas 5 fold). Artinya: dari sudut pandang CV, kelima nilai C itu praktis TIDAK BISA DIBEDAKAN. Dan dari C = 1 ke atas, kurvanya DATAR TOTAL: C = 1, 10, dan 100 memberi CV yang sama persis (0,7581) dan test yang sama persis (0,7426). Begitu penalti cukup kecil, melonggarkannya lebih jauh tidak mengubah apa-apa — koefisiennya sudah jenuh (norma L2 koefisien: 0,9684 di C = 1 vs 0,9695 di C = 100 [notebook]).",
        "Perhatikan juga fold-fold CV untuk C = 1 [notebook]: 0,7665; 0,7601; 0,7442; 0,7538; 0,7656 — satu fold (0,7442) sekitar 0,022 di bawah fold terbaik. Variasi antar-fold ini LEBIH BESAR dari seluruh efek tuning C (0,0013). Siapa pun yang memilih C berdasarkan satu fold, atau berdasarkan selisih 0,0002 antar konfigurasi, sedang membaca noise.",
        "Gambar di bawah memplot CV ROC-AUC per nilai C. Sumbu-y-nya sengaja diperbesar (0,7500–0,7600) agar perbedaan kecil terlihat — dan justru di situlah pelajarannya: perbedaannya terlihat (≈23 px pada skala ini) tetapi tetap di bawah noise antar-fold 0,0083.",
        "Baik atau buruk: grid satu dimensi seperti ini bagus sebagai DIAGNOSIS — ia menunjukkan dengan cepat apakah hyperparameter itu berpengaruh atau tidak. Di sini jawabannya: hampir tidak. Buruk bila dibaca sebagai «C = 1 adalah setting terbaik yang terbukti»: dengan sd 0,0083, klaim «C = 1 mengalahkan C = 0,1» (selisih 0,0002) tidak punya dukungan statistik.",
        "Mitigasi: bila grid satu dimensi datar, BERHENTI — jangan memperhalus grid di sekitar C = 1 dengan harapan menemukan puncak yang tersembunyi. Puncak itu tidak ada; yang ada adalah dataran. Pindah ke hyperparameter lain, atau ke model lain.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="CV ROC-AUC logistic regression per nilai C: C 0,01 ke 0,7568; C 0,1 ke 0,7579; C 1, 10, 100 ke 0,7581">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Grid C logistic regression — CV ROC-AUC (5-fold)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,7500</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,7525</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,7550</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,7575</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,7600</text>
<text x="259" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">nilai C (skala log)</text>
<rect x="95" y="86.3" width="55" height="119.7" fill="var(--c1)"/>
<text x="122.5" y="82.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7568</text>
<text x="122.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">C = 0,01</text>
<rect x="175" y="67.0" width="55" height="139.0" fill="var(--c1)"/>
<text x="202.5" y="63.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7579</text>
<text x="202.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">C = 0,1</text>
<rect x="255" y="63.4" width="55" height="142.6" fill="var(--c4)"/>
<text x="282.5" y="59.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7581</text>
<text x="282.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">C = 1 ★</text>
<rect x="335" y="63.4" width="55" height="142.6" fill="var(--c1)"/>
<text x="362.5" y="59.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7581</text>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">C = 10</text>
<rect x="415" y="63.4" width="55" height="142.6" fill="var(--c1)"/>
<text x="442.5" y="59.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7581</text>
<text x="442.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">C = 100</text>
</svg>`,
        alt: "CV ROC-AUC logistic regression per nilai C: 0,01 ke 0,7568; 0,1 ke 0,7579; 1, 10, 100 ke 0,7581 — kurva datar setelah C = 1.",
        caption: "Cara membaca: sumbu-y diperbesar (0,7500–0,7600) agar selisih kecil terlihat. C = 1 adalah yang terbaik (0,7581, ★), tapi C = 10 dan C = 100 sama persis — kurva DATAR setelah C = 1 [notebook]. Rentang seluruh grid hanya 0,0013, lebih kecil dari sd antar-fold 0,0083.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: C lebih besar berarti regularisasi lebih kuat",
        type: "pitfall",
        body: "Yang benar: di sklearn, C adalah KEBALIKAN kekuatan regularisasi (C = 1/λ). C = 0,01 berarti penalti SANGAT KUAT (koefisien ditekan keras, CV 0,7568); C = 100 berarti penalti nyaris tidak ada (CV 0,7581). Membaca arahnya terbalik membuatmu «memperkuat regularisasi» justru saat kamu melemahkannya — dan diagnosis overfitting-mu ikut terbalik.",
      },
    },
    {
      id: "gbm-grid",
      eyebrow: "Langkah 8 · Worked example 2",
      title: "Grid GBM 18 konfigurasi: yang terbaik hanya 0,0038 di atas yang terburuk",
      prose: [
        "Contoh kedua memakai GBM dengan tiga hyperparameter sekaligus — grid penuh 18 konfigurasi, 3-fold CV, 54 fits [notebook]. Tiga teratas:",
        "Terbaik: jumlah pohon (max_iter) 100, max_depth 5, learning rate 0,05 → CV 0,7865. Kedua: max_iter 200, max_depth 3, learning rate 0,05 → CV 0,7864. Ketiga: max_iter 200, max_depth 5, learning rate 0,05 → CV 0,7864. Tiga teratas hanya terpaut 0,0001 — praktis seri.",
        "Nilai: konfigurasi TERBURUK di grid — max_iter 50, max_depth 3, learning rate 0,05 — mendapat CV 0,7827. Jadi rentang SELURUH grid hanya 0,0038 (0,7865 − 0,7827). Bandingkan dengan baseline: GBM default (tanpa tuning, 5-fold CV) 0,7840 [notebook]. Grid terbaik hanya sekitar 0,0025 di atas default — dan konfigurasi terburuk grid justru 0,0013 DI BAWAH default. Tuning di sini bukan «menemukan setting ajaib»; ia hanya menggeser skor dalam pita sempit sekitar default. (Catatan kejujuran: default diukur dengan 5-fold CV, grid dengan 3-fold CV — bandingkan sebagai orde besaran, bukan selisih eksak.)",
        "Perhatikan juga pola di dalam grid [notebook]: learning rate 0,05 mengisi seluruh 3 besar, sementara keenam konfigurasi max_depth tanpa batas (None) menempati peringkat 12–17 dari 18 — tidak satu pun masuk 11 besar — pohon yang tidak dibatasi kedalamannya cenderung lebih buruk di data ini. Pola seperti ini lebih berharga daripada «pemenang» tunggal: ia memberi tahu ARAH mana yang menjanjikan bila kamu melanjutkan pencarian (langkah 9).",
        "Gambar di bawah merangkum seluruh cerita M6.1 dalam lima batang: default, grid terburuk, grid terbaik, random terbaik, dan shrinking terbaik. Perhatikan skalanya: sumbu-y 0,7800–0,7880 — seluruh drama tuning terjadi dalam pita 0,008.",
        "Baik atau buruk: grid 3 dimensi seperti ini bagus karena ia menunjukkan peta wilayahnya — bukan hanya puncaknya, tapi juga lembahnya dan pola per hyperparameter. Buruk bila «terbaik dari 18» dilaporkan tanpa konteks: tanpa rentang 0,0038 dan tanpa baseline 0,7840, angka 0,7865 terlihat seperti kemenangan besar. Ia bukan.",
        "Mitigasi: laporkan SELALU tiga angka bersama: baseline default, terbaik grid, dan terburuk grid. Bila rentangnya sempit, katakan terus terang — «tuning hampir tidak mengubah apa-apa di model ini» adalah temuan, bukan kegagalan.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Tangga tuning GBM: default 0,7840; grid terburuk 0,7827; grid terbaik 0,7865; random terbaik 0,7866; shrinking terbaik 0,7869">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tangga tuning GBM — CV ROC-AUC per tahap</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,7800</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,7820</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,7840</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,7860</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,7880</text>
<rect x="95" y="118.0" width="55" height="88.0" fill="var(--c2)"/>
<text x="122.5" y="114.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7840</text>
<text x="122.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">default</text>
<rect x="175" y="146.6" width="55" height="59.4" fill="var(--c1)"/>
<text x="202.5" y="142.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7827</text>
<text x="202.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">grid terburuk</text>
<rect x="255" y="63.0" width="55" height="143.0" fill="var(--c4)"/>
<text x="282.5" y="59.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7865</text>
<text x="282.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">grid terbaik</text>
<rect x="335" y="60.8" width="55" height="145.2" fill="var(--c4)"/>
<text x="362.5" y="56.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7866</text>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">random terbaik</text>
<rect x="415" y="54.2" width="55" height="151.8" fill="var(--c4)"/>
<text x="442.5" y="50.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7869</text>
<text x="442.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">shrinking ★</text>
</svg>`,
        alt: "Tangga tuning GBM: default 0,7840; grid terburuk 0,7827; grid terbaik 0,7865; random terbaik 0,7866; shrinking terbaik 0,7869.",
        caption: "Cara membaca: sumbu-y 0,7800–0,7880 — seluruh drama tuning terjadi dalam pita 0,008. Grid terbaik hanya ~0,0025 di atas default; random dan shrinking masing-masing menambah 0,0001 dan 0,0003 [notebook]. Grid terburuk (0,7827) justru di bawah default.",
      },
      tasks: [],
      note: {
        title: "Jebakan API: n_estimators tidak ada di HistGradientBoostingClassifier",
        type: "pitfall",
        body: "Yang benar: di GBM sklearn yang dipakai di track ini (HistGradientBoostingClassifier), parameter jumlah pohonnya bernama max_iter — jumlah iterasi boosting. n_estimators adalah nama parameter di RandomForestClassifier dan GradientBoostingClassifier (yang lama), BUKAN di sini. Menulis HistGradientBoostingClassifier(n_estimators=100) menghasilkan TypeError. Bila kamu menyalin kode tuning dari tutorial lain, periksa dulu nama parameter di model YANG KAMU PAKAI — nama yang sama di model berbeda bisa berarti hal yang berbeda.",
      },
    },
    {
      id: "shrinking",
      eyebrow: "Langkah 9 · Refinement",
      title: "Shrinking random search: mengecilkan wilayah, bukan menebak lebih banyak",
      prose: [
        "Setelah grid dan random search memberi tahu wilayah yang menjanjikan, langkah berikutnya bukan mengundi lagi di seluruh ruang — melainkan mengundi di SEKITAR pemenang. Itulah shrinking random search: ambil konfigurasi terbaik sejauh ini, lalu ambil 9 konfigurasi acak di sekitarnya (jumlah pohon di dekatnya, kedalaman di dekatnya, learning rate di dekatnya) [notebook].",
        "Nilai: titik awalnya adalah random-search terbaik — max_iter 100, max_depth 5, learning rate 0,0425 (CV 0,7866). Sembilan konfigurasi di sekitarnya menghasilkan yang terbaik: max_iter 200, max_depth 5, learning rate 0,0297 → CV 0,7869 [notebook]. Mengalahkan stage-1 (0,7866) — tapi hanya sebesar 0,0003. Sekali lagi: arahnya benar, besarnya kecil.",
        "Kejujuran yang wajib dicatat: ini BUKAN Bayesian optimization. Bayesian optimization (BO) membangun model pengganti (surrogate) atas skor yang sudah dicoba, lalu memakai acquisition function untuk memilih titik berikutnya yang paling menjanjikan — ia BELAJAR dari riwayat pencarian. Shrinking random search tidak membangun model apa pun: ia hanya mengundi di kotak yang lebih kecil. Eksperimen lesson ini memakai shrinking random search karena library BO (scikit-optimize) TIDAK terpasang di lingkungan kanonis [notebook]. Bila kamu membaca «Bayesian optimization» di tempat lain, periksa apakah yang dilakukan benar-benar BO — atau hanya random search di wilayah yang menyempit seperti di sini.",
        "Baik atau buruk: shrinking bagus sebagai tahap KEDUA yang murah — 9 konfigurasi, 27 fits — setelah tahap pertama memetakan wilayahnya. Buruk bila dipakai sebagai tahap pertama (kamu belum tahu wilayah mana yang menjanjikan) atau bila diulang berkali-kali tanpa henti: tiap putaran menyempit mengunci kamu di satu lembah, dan kamu berhenti menjelajah — persis seperti GD yang terjebak di minimum lokal.",
        "Mitigasi: batasi refinement ke satu atau dua putaran, lalu berhenti dan evaluasi di test (langkah 10). Bila putaran kedua hanya menambah 0,0003, putaran ketiga hampir pasti menambah lebih sedikit lagi — itu sinyal berhenti, bukan sinyal mengulang.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: shrinking random search = Bayesian optimization",
        type: "pitfall",
        body: "Yang benar: keduanya «mempersempit pencarian di sekitar yang terbaik», tapi mekanismenya berbeda. Bayesian optimization memakai model surrogate + acquisition function yang belajar dari SEMUA skor sebelumnya; shrinking random search hanya mengundi acak di kotak yang lebih kecil di sekitar pemenang — tanpa model, tanpa memori selain titik awalnya. Menyebut shrinking sebagai BO adalah klaim metode yang salah, dan di review sejawat klaim seperti itu meruntuhkan kepercayaan pada seluruh laporan.",
      },
    },
    {
      id: "budget",
      eyebrow: "Langkah 10 · Budget & kapan berhenti",
      title: "Search budget: tiap fit punya harga, dan keuntungannya menyusut",
      prose: [
        "Tuning bukan gratis — harganya adalah jumlah fits. Tabel usaha lesson ini [notebook]: grid LR — 5 konfigurasi × 5-fold = 25 fits, terbaik CV 0,7581. Grid GBM — 18 konfigurasi × 3-fold = 54 fits, terbaik CV 0,7865. Random search GBM — 27 konfigurasi × 3-fold = 81 fits, terbaik CV 0,7866. Shrinking — 9 konfigurasi × 3-fold = 27 fits, terbaik CV 0,7869.",
        "Nilai: hitung keuntungan per tahap. Grid GBM (54 fits) mengangkat CV dari default 0,7840 ke 0,7865: +0,0025. Random search (81 fits, 1,5× fits grid) menambah +0,0001. Shrinking (27 fits) menambah +0,0003. Total: 162 fits GBM untuk +0,0029 CV — dan, yang paling penting, +0,0000 di test: GBM tertala (grid terbaik, dilatih ulang di seluruh train) mendapat ROC-AUC test 0,7823, PR-AUC 0,5598, Brier 0,1342 [notebook] — ROC-AUC dan Brier-nya sama persis dengan GBM default (0,7823; 0,1342); PR-AUC naik 0,0001 (0,5597 → 0,5598). Selisih CV grid terbaik vs test-nya sendiri adalah 0,0042 (0,7865 − 0,7823) — itulah optimism dari memilih yang terbaik (langkah 11).",
        "Kapan berhenti? Tiga sinyal. Pertama, PLATEAU: dua tahap berturut-turut masing-masing menambah kurang dari 0,0005 — seperti random (+0,0001) lalu shrinking (+0,0003) di sini. Kedua, BUDGET: tetapkan jumlah fits maksimum SEBELUM mulai (misal 200 fits), dan berhenti saat habis — bukan saat «merasa» sudah cukup. Ketiga, UJI DI TEST — sekali saja, di akhir: bila test tidak bergerak sementara CV naik, tuning sudah mengoptimasi CV, bukan modelnya.",
        "Baik atau buruk: budget yang eksplisit bagus — ia mengubah tuning dari «coba sampai bosan» menjadi eksperimen dengan harga yang diketahui. Buruk bila budget ditentukan oleh hasil: «tambah 50 fits lagi karena hampir menang» adalah cara paling pasti untuk overfitting ke validasi — tiap tambahan pencarian adalah tambahan kesempatan menemukan konfigurasi yang KEBETULAN bagus di CV itu.",
        "Mitigasi: alokasikan budget dalam TAHAP (peta kasar → refinement), bukan sekaligus. Misal: 60% budget untuk tahap pertama (grid/random), 40% untuk satu putaran refinement — dan nol untuk putaran ketiga kecuali tahap kedua memberi lompatan yang nyata (di sini tidak: +0,0003).",
      ],
      tasks: [],
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 11 · Jebakan tuning",
      title: "Dua jebakan: overfitting ke validasi, dan tuning di test",
      prose: [
        "Jebakan pertama — OVERFITTING KE VALIDASI (winner's curse). Skor CV yang kamu pakai untuk MEMILIH konfigurasi bukanlah estimasi yang netral atas konfigurasi itu: dari 18 konfigurasi, yang kamu pilih adalah yang skor CV-nya tertinggi — dan skor tertinggi dari 18 undian cenderung mengandung keberuntungan. Buktinya di data ini [notebook]: grid terbaik punya CV 0,7865 tapi test 0,7823 — selisih 0,0042. Skor CV itu «benar» sebagai hasil CV, tapi ia melebih-lebihkan kemampuan model yang dipilih, karena pemilihannya sendiri memakai skor yang sama. Makin banyak konfigurasi yang dicoba, makin besar bias optimis ini.",
        "Nilai: angka yang sama terlihat dari sisi lain — grid terbaik di test (0,7823) sama persis dengan GBM default di test (0,7823). Bila tuning «berhasil», test seharusnya naik mengikuti CV; di sini test diam sementara CV naik 0,0025. Itulah pola khas overfitting ke validasi: CV membaik, test tidak.",
        "Jebakan kedua — TUNING DI TEST (leakage). Bila kamu memilih konfigurasi berdasarkan skor TEST — misal mencoba 18 konfigurasi dan mengambil yang test-nya tertinggi — test itu berhenti menjadi pengukur yang jujur. Ia sudah dipakai untuk memilih, jadi ia sudah «bocor» ke dalam keputusan. Skor test yang dilaporkan setelah itu bukan lagi estimasi kemampuan model pada data baru; ia adalah skor terbaik dari 18 percobaan pada SATU test set itu. Di lesson ini, pemilihan selalu memakai CV di train, dan test hanya dibuka sekali di akhir untuk evaluasi — itulah yang membuat angka 0,7823 itu bisa dipercaya sebagai «tuning tidak mengubah test».",
        "Baik atau buruk: mengenali kedua jebakan ini bagus — sebagian besar «tuning yang berhasil besar» di laporan-laporan adalah salah satu dari keduanya, bukan perbaikan model. Buruk bila kamu mengabaikannya: model yang «menang» karena overfitting ke validasi akan mengecewakan saat dipakai, dan kamu tidak akan tahu mengapa — karena skor yang kamu laporkan terlihat bagus.",
        "Mitigasi: pisahkan tiga peran data dengan tegas — train untuk melatih, validation (CV di train) untuk memilih, test untuk menilai SEKALI di akhir. Bila kamu butuh estimasi yang jujur atas SELURUH proses tuning (termasuk pemilihannya), itulah nested CV — topik M6.2, lesson berikutnya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: skor CV konfigurasi terbaik adalah estimasi kemampuan model itu",
        type: "pitfall",
        body: "Yang benar: skor CV dipakai DUA kali bila kamu memilih dengannya — sekali untuk memilih, sekali untuk melaporkan. Pemakaian ganda itu membiaskan skor ke atas — tapi hati-hati membaca besarnya: di sini gap CV-vs-test pemenangnya 0,0042 (CV 0,7865 vs test 0,7823), SAMA dengan rata-rata gap ke-18 konfigurasi (juga 0,0042), jadi 0,0042 adalah gap protokol CV-vs-holdout yang dimiliki semua kandidat, bukan ukuran eksklusif bias seleksi; bukti seleksi yang sebenarnya adalah ketidakstabilan peringkat (M6.5). Estimasi yang jujur butuh data yang TIDAK dipakai untuk memilih — test yang disimpan, atau nested CV (M6.2). «Terbaik di CV» berarti «terbaik di antara yang dicoba pada lipatan itu», bukan «sebaik ini di data baru».",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 12 · Peta keputusan",
      title: "Kapan grid, kapan random, kapan cukup",
      prose: [
        "Setelah semua angka di atas, ini peta keputusannya — empat pertanyaan, empat jawaban.",
        "Kapan GRID? Bila hyperparameternya SEDIKIT (1–3), nilainya diskrit dan punya alasan, dan kamu butuh hasil yang bisa direproduksi persis oleh orang lain. Contoh lesson ini: grid C (5 nilai) dan grid GBM (18 konfigurasi) — keduanya grid yang masuk akal. Grid juga tepat untuk DIAGNOSIS: satu dimensi yang datar (langkah 7) memberi tahu kamu untuk berhenti.",
        "Kapan RANDOM? Bila hyperparameternya BANYAK, sebagian kontinu, dan kamu tidak tahu mana yang penting. Random search memberi cakupan lebih halus per budget di dimensi yang penting (langkah 5). Pakai distribusi yang masuk akal (log-uniform untuk learning rate dan C), catat seed-nya, dan tetapkan jumlah undian sebagai budget — bukan sebagai «sampai menemukan yang bagus».",
        "Kapan SHRINKING / refinement? Bila tahap pertama sudah menemukan wilayah yang menjanjikan DAN kamu masih punya budget. Satu putaran, 9 konfigurasi di sekitar pemenang (langkah 9). Bila putaran itu hanya menambah 0,0003, berhenti — putaran berikutnya hampir pasti menambah lebih sedikit.",
        "Kapan CUKUP — dan kapan Bayesian optimization? Cukup bila: grid satu dimensi datar, dua tahap berturut-turut menambah kurang dari 0,0005, atau test tidak bergerak sementara CV naik. Bayesian optimization adalah tahap refinement yang LEBIH PINTAR dari shrinking — ia membangun model surrogate dan memilih titik berikutnya dengan acquisition function — dan layak dipakai bila tiap fit MAHAL (model besar, data besar) sehingga tiap evaluasi harus diperhitungkan. Di lesson ini ia tidak dipakai: library-nya (scikit-optimize) tidak terpasang, dan dengan fit yang murah, shrinking random search sudah cukup untuk menunjukkan polanya. Jangan memaksakan BO hanya karena namanya terdengar canggih — bila fit-mu murah, random + shrinking memberi hampir semua manfaatnya dengan kerumitan yang jauh lebih kecil.",
        "Baik atau buruk: peta ini bagus karena ia mengubah tuning dari kebiasaan menjadi keputusan — tiap metode punya kondisi pakainya. Buruk bila dibaca sebagai urutan wajib: tidak semua proyek butuh ketiga tahap. Proyek kecil dengan satu hyperparameter cukup berhenti di grid (langkah 7).",
        "Mitigasi: sebelum tuning apa pun, tulis dulu di satu baris: metode apa, budget berapa fits, dan kriteria berhenti apa. Bila baris itu tidak bisa ditulis, kamu belum siap tuning — kamu siap mengundi.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 13 · Lab 1",
      title: "Lab: grid search manual atas skor C logistic regression",
      prose: [
        "Sekarang giliranmu menjalankan grid search — dengan tangan, tanpa sklearn, di atas skor yang sudah dihitung. Lima pasangan (C, skor CV) dari langkah 7 sudah diberikan sebagai konstanta [notebook]. Tugasmu: cari C terbaik, rentang skornya, dan gain dari C = 0,01 ke C = 1.",
        "Hasil yang diharapkan [lab]: C terbaik: 1 (CV 0.7581); rentang CV: 0.0013; gain C=0.01 -> C=1: 0.0013. Tiga TODO: best_c dan best_score (maksimum dari daftar), spread (maksimum − minimum), gain (skor C = 1 − skor C = 0,01).",
        "Setelah lab jalan, perhatikan apa arti angka-angka itu: rentang 0,0013 melawan sd antar-fold 0,0083 (langkah 7) — grid ini hampir tidak membedakan apa-apa. Itulah yang harus kamu bawa pulang: grid search yang dijalankan dengan benar kadang menjawab «tidak ada yang perlu ditala di sini».",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi best_c dan best_score: C dengan skor CV tertinggi dari C_SCORES" },
        { id: "t2", text: "Lengkapi spread: skor CV tertinggi - skor CV terendah" },
        { id: "t3", text: "Lengkapi gain: skor C=1 - skor C=0,01, lalu jalankan dan bandingkan dengan angka kanonis (0,7581 / 0,0013 / 0,0013)" },
      ],
      expected: "C terbaik: 1 (CV 0.7581)\nrentang CV: 0.0013\ngain C=0.01 -> C=1: 0.0013",
      hints: [
        "Maksimum dari daftar pasangan: max(C_SCORES, key=lambda p: p[1]) memberi pasangan terbaik; [0]-nya adalah C, [1]-nya skor.",
        "spread = max(skor) - min(skor); ambil skornya saja dengan [s for _, s in C_SCORES].",
        "gain: ubah daftar menjadi dict dulu — dict(C_SCORES)[1] - dict(C_SCORES)[0.01].",
      ],
      code: {
        starter: `# Grid search manual atas skor CV logistic regression (grid C) [notebook]
# Skor CV ROC-AUC (5-fold) per nilai C — dari m6_canonical.json:
#   C = 0.01 -> 0.7568 | C = 0.1 -> 0.7579 | C = 1 -> 0.7581
#   C = 10 -> 0.7581 | C = 100 -> 0.7581
C_SCORES = [(0.01, 0.7568), (0.1, 0.7579), (1, 0.7581), (10, 0.7581), (100, 0.7581)]

best_c = 0  # TODO: C dengan skor CV tertinggi
best_score = 0.0  # TODO: skor CV tertinggi
spread = 0.0  # TODO: skor tertinggi - skor terendah
gain = 0.0  # TODO: skor C=1 - skor C=0.01
print(f"C terbaik: {best_c} (CV {best_score:.4f})")
print(f"rentang CV: {spread:.4f}")
print(f"gain C=0.01 -> C=1: {gain:.4f}")`,
        lockLines: 6,
        solution: `# Grid search manual atas skor CV logistic regression (grid C) [notebook]
# Skor CV ROC-AUC (5-fold) per nilai C — dari m6_canonical.json:
#   C = 0.01 -> 0.7568 | C = 0.1 -> 0.7579 | C = 1 -> 0.7581
#   C = 10 -> 0.7581 | C = 100 -> 0.7581
C_SCORES = [(0.01, 0.7568), (0.1, 0.7579), (1, 0.7581), (10, 0.7581), (100, 0.7581)]

best_c = max(C_SCORES, key=lambda p: p[1])[0]
best_score = max(s for _, s in C_SCORES)
spread = max(s for _, s in C_SCORES) - min(s for _, s in C_SCORES)
gain = dict(C_SCORES)[1] - dict(C_SCORES)[0.01]
print(f"C terbaik: {best_c} (CV {best_score:.4f})")
print(f"rentang CV: {spread:.4f}")
print(f"gain C=0.01 -> C=1: {gain:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "best_score", value: 0.7581, tol: 0.00005, label: "`best_score` seharusnya 0.7581", msg: "Skor CV tertinggi grid C: 0,7581 (C = 1)." },
          { kind: "equal", task: "t2", name: "spread", value: 0.0013, tol: 0.00005, label: "`spread` seharusnya 0.0013", msg: "Rentang skor seluruh grid C hanya 0,0013." },
          { kind: "stdout_matches", task: "t3", pattern: "C terbaik: 1(\\.0)? \\(CV 0\\.7581\\)", label: "Output menampilkan C terbaik 1 (CV 0,7581)", msg: "C terbaik grid: 1, CV 0,7581." },
          { kind: "stdout_matches", task: "t3", pattern: "gain C=0\\.01 -> C=1: 0\\.0013", label: "Output menampilkan gain 0,0013", msg: "Gain C = 0,01 ke C = 1 hanya 0,0013 — grid ini hampir datar." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 14 · Lab 2",
      title: "Lab: random vs grid pada budget yang sama — siapa menang, seberapa besar",
      prose: [
        "Lab kedua membandingkan dua metode pencarian pada angka kanonis GBM [notebook]. Grid: 18 konfigurasi (daftar skornya diberikan), 54 fits, terbaik 0,7865. Random: 27 konfigurasi, 81 fits, terbaik 0,7866 — dan hanya 1 dari 27 konfigurasi yang mengalahkan grid terbaik.",
        "Hasil yang diharapkan [lab]: grid terbaik: 0.7865; selisih random - grid: 0.0001; proporsi random mengalahkan grid: 0.0370; rasio fits random/grid: 1.5. Empat TODO: grid_best (maksimum daftar), diff (RANDOM_BEST − grid_best), beat_share (RANDOM_BEAT / RANDOM_N), fits_ratio (RANDOM_FITS / GRID_FITS).",
        "Bacaan yang benar: random search menang — tapi hanya 0,0001, dengan 1,5× fits, dan hanya 1 dari 27 undian yang mengalahkan grid terbaik (proporsi 0,0370). Bila seseorang mengklaim «random search jauh lebih baik», angka-angka ini adalah jawabannya: di data ini, tidak.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi grid_best: skor tertinggi dari GRID_SCORES (18 konfigurasi)" },
        { id: "t2", text: "Lengkapi diff: RANDOM_BEST - grid_best" },
        { id: "t3", text: "Lengkapi beat_share dan fits_ratio, lalu jalankan dan bandingkan dengan angka kanonis (0,7865 / 0,0001 / 0,0370 / 1,5)" },
      ],
      expected: "grid terbaik: 0.7865\nselisih random - grid: 0.0001\nproporsi random mengalahkan grid: 0.0370\nrasio fits random/grid: 1.5",
      hints: [
        "grid_best = max(GRID_SCORES) — daftarnya sudah terurut menurun, tapi hitung tetap dari daftarnya.",
        "diff = RANDOM_BEST - grid_best; hasilnya 0,0001 — kecil, dan itulah poinnya.",
        "beat_share = RANDOM_BEAT / RANDOM_N (1/27 ≈ 0,0370); fits_ratio = RANDOM_FITS / GRID_FITS (81/54 = 1,5).",
      ],
      code: {
        starter: `# Random vs grid pada GBM — skor CV ROC-AUC (3-fold) [notebook]
# Grid: 18 konfigurasi, 54 fits, terbaik 0.7865
# Random: 27 konfigurasi, 81 fits, terbaik 0.7866; hanya 1 dari 27 yang mengalahkan grid terbaik
GRID_SCORES = [0.7865, 0.7864, 0.7864, 0.7862, 0.7862, 0.7856, 0.7855, 0.7854, 0.7853, 0.7851, 0.7851, 0.7845, 0.7845, 0.7842, 0.7838, 0.7837, 0.7837, 0.7827]
RANDOM_BEST = 0.7866
RANDOM_N = 27
RANDOM_BEAT = 1
GRID_FITS = 54
RANDOM_FITS = 81

grid_best = 0.0  # TODO: skor grid tertinggi
diff = 0.0  # TODO: RANDOM_BEST - grid_best
beat_share = 0.0  # TODO: RANDOM_BEAT / RANDOM_N
fits_ratio = 0.0  # TODO: RANDOM_FITS / GRID_FITS
print(f"grid terbaik: {grid_best:.4f}")
print(f"selisih random - grid: {diff:.4f}")
print(f"proporsi random mengalahkan grid: {beat_share:.4f}")
print(f"rasio fits random/grid: {fits_ratio:.1f}")`,
        lockLines: 11,
        solution: `# Random vs grid pada GBM — skor CV ROC-AUC (3-fold) [notebook]
# Grid: 18 konfigurasi, 54 fits, terbaik 0.7865
# Random: 27 konfigurasi, 81 fits, terbaik 0.7866; hanya 1 dari 27 yang mengalahkan grid terbaik
GRID_SCORES = [0.7865, 0.7864, 0.7864, 0.7862, 0.7862, 0.7856, 0.7855, 0.7854, 0.7853, 0.7851, 0.7851, 0.7845, 0.7845, 0.7842, 0.7838, 0.7837, 0.7837, 0.7827]
RANDOM_BEST = 0.7866
RANDOM_N = 27
RANDOM_BEAT = 1
GRID_FITS = 54
RANDOM_FITS = 81

grid_best = max(GRID_SCORES)
diff = RANDOM_BEST - grid_best
beat_share = RANDOM_BEAT / RANDOM_N
fits_ratio = RANDOM_FITS / GRID_FITS
print(f"grid terbaik: {grid_best:.4f}")
print(f"selisih random - grid: {diff:.4f}")
print(f"proporsi random mengalahkan grid: {beat_share:.4f}")
print(f"rasio fits random/grid: {fits_ratio:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "grid_best", value: 0.7865, tol: 0.00005, label: "`grid_best` seharusnya 0.7865", msg: "Grid GBM terbaik: CV 0,7865." },
          { kind: "equal", task: "t2", name: "diff", value: 0.0001, tol: 0.00005, label: "`diff` seharusnya 0.0001", msg: "Random search hanya 0,0001 di atas grid terbaik." },
          { kind: "stdout_matches", task: "t3", pattern: "proporsi random mengalahkan grid: 0\\.0370", label: "Output menampilkan proporsi 0,0370", msg: "Hanya 1 dari 27 konfigurasi random (0,0370) yang mengalahkan grid terbaik." },
          { kind: "stdout_matches", task: "t3", pattern: "rasio fits random/grid: 1\\.5", label: "Output menampilkan rasio fits 1,5", msg: "Random search memakai 1,5× fits grid (81 vs 54) untuk kemenangan 0,0001 itu." },
        ],
      },
    },
    {
      id: "lab3",
      eyebrow: "Langkah 15 · Lab 3",
      title: "Lab: membedah grid GBM — rata-rata per kelompok dan interaksi learning rate × depth",
      prose: [
        "Lab ketiga memakai 18 skor grid GBM [notebook] — bukan sebagai daftar, melainkan sebagai data: kelompokkan per learning_rate, per max_depth, dan per pasangan (learning_rate, max_depth), lalu baca interaksinya. Tiga TODO: rata-rata per learning rate, rata-rata per max_depth, dan dua selisih interaksi.",
        "Hasil yang diharapkan [lab]: rata-rata lr 0.05: 0.7851; rata-rata lr 0.10: 0.7850; rata-rata depth 5: 0.7856; rata-rata depth tanpa batas: 0.7841; interaksi depth 5 (lr 0.05 - lr 0.10): 0.0010; interaksi depth 3 (lr 0.10 - lr 0.05): 0.0012.",
        "Bacaan yang benar: rata-rata per learning rate hampir sama (selisihnya di bawah 0,0002) — tapi arah efeknya BERBALIK menurut kedalaman: pada depth 5, lr 0,05 menang 0,0010; pada depth 3, lr 0,10 menang 0,0012. Itulah interaksi — dan alasan grid yang menilai tiap hyperparameter sendirian tidak pernah menemukannya. Tambahan: rata-rata depth tanpa batas (0,7841) paling rendah, 0,0016 di bawah depth 5 — sejalan dengan pola langkah 8 bahwa keenam konfigurasi tanpa batas menempati peringkat 12–17.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi mean_lr005 dan mean_lr010: rata-rata skor CV per learning_rate" },
        { id: "t2", text: "Lengkapi mean_d5 dan mean_dnone: rata-rata skor CV untuk max_depth 5 dan tanpa batas (None)" },
        { id: "t3", text: "Lengkapi inter_d5 dan inter_d3: selisih rata-rata antar learning rate di dalam tiap kedalaman, lalu jalankan dan bandingkan dengan angka kanonis (0.7851 / 0.7850 / 0.7856 / 0.7841 / 0.0010 / 0.0012)" },
      ],
      expected: "rata-rata lr 0.05: 0.7851\nrata-rata lr 0.10: 0.7850\nrata-rata depth 5: 0.7856\nrata-rata depth tanpa batas: 0.7841\ninteraksi depth 5 (lr 0.05 - lr 0.10): 0.0010\ninteraksi depth 3 (lr 0.10 - lr 0.05): 0.0012",
      hints: [
        "mean(rows) sudah disediakan: mean([r for r in GRID if r[2] == 0.05]) memberi rata-rata lr 0,05; r[2] adalah learning_rate, r[1] adalah max_depth.",
        "max_depth tanpa batas ditulis None di Python: filter dengan r[1] is None — bukan r[1] == None dan bukan string.",
        "inter_d5 = rata-rata (lr 0,05, depth 5) − rata-rata (lr 0,10, depth 5); inter_d3 dibalik — lr 0,10 minus lr 0,05 — karena di depth 3 justru lr 0,10 yang lebih baik.",
      ],
      code: {
        starter: `# Bedah grid GBM 18 konfigurasi: rata-rata per kelompok + interaksi [notebook]
# Tiap baris: (max_iter, max_depth, learning_rate, cv_roc_auc)
# max_depth None = tanpa batas; skor CV ROC-AUC (3-fold)
GRID = [
    (100, 5, 0.05, 0.7865), (200, 3, 0.05, 0.7864), (200, 5, 0.05, 0.7864),
    (100, 3, 0.10, 0.7862), (200, 3, 0.10, 0.7862), (50, 3, 0.10, 0.7856),
    (50, 5, 0.05, 0.7855), (100, 3, 0.05, 0.7854), (50, 5, 0.10, 0.7853),
    (100, 5, 0.10, 0.7851), (200, 5, 0.10, 0.7851), (100, None, 0.05, 0.7845),
    (200, None, 0.05, 0.7845), (50, None, 0.05, 0.7842), (50, None, 0.10, 0.7838),
    (100, None, 0.10, 0.7837), (200, None, 0.10, 0.7837), (50, 3, 0.05, 0.7827),
]

def mean(rows):
    return sum(r[3] for r in rows) / len(rows)

mean_lr005 = 0.0  # TODO: rata-rata skor konfigurasi learning_rate 0.05
mean_lr010 = 0.0  # TODO: rata-rata skor konfigurasi learning_rate 0.10
mean_d5 = 0.0  # TODO: rata-rata skor konfigurasi max_depth 5
mean_dnone = 0.0  # TODO: rata-rata skor konfigurasi max_depth None
inter_d5 = 0.0  # TODO: mean(lr 0.05, depth 5) - mean(lr 0.10, depth 5)
inter_d3 = 0.0  # TODO: mean(lr 0.10, depth 3) - mean(lr 0.05, depth 3)
print(f"rata-rata lr 0.05: {mean_lr005:.4f}")
print(f"rata-rata lr 0.10: {mean_lr010:.4f}")
print(f"rata-rata depth 5: {mean_d5:.4f}")
print(f"rata-rata depth tanpa batas: {mean_dnone:.4f}")
print(f"interaksi depth 5 (lr 0.05 - lr 0.10): {inter_d5:.4f}")
print(f"interaksi depth 3 (lr 0.10 - lr 0.05): {inter_d3:.4f}")`,
        lockLines: 14,
        solution: `# Bedah grid GBM 18 konfigurasi: rata-rata per kelompok + interaksi [notebook]
# Tiap baris: (max_iter, max_depth, learning_rate, cv_roc_auc)
# max_depth None = tanpa batas; skor CV ROC-AUC (3-fold)
GRID = [
    (100, 5, 0.05, 0.7865), (200, 3, 0.05, 0.7864), (200, 5, 0.05, 0.7864),
    (100, 3, 0.10, 0.7862), (200, 3, 0.10, 0.7862), (50, 3, 0.10, 0.7856),
    (50, 5, 0.05, 0.7855), (100, 3, 0.05, 0.7854), (50, 5, 0.10, 0.7853),
    (100, 5, 0.10, 0.7851), (200, 5, 0.10, 0.7851), (100, None, 0.05, 0.7845),
    (200, None, 0.05, 0.7845), (50, None, 0.05, 0.7842), (50, None, 0.10, 0.7838),
    (100, None, 0.10, 0.7837), (200, None, 0.10, 0.7837), (50, 3, 0.05, 0.7827),
]

def mean(rows):
    return sum(r[3] for r in rows) / len(rows)

mean_lr005 = mean([r for r in GRID if r[2] == 0.05])
mean_lr010 = mean([r for r in GRID if r[2] == 0.10])
mean_d5 = mean([r for r in GRID if r[1] == 5])
mean_dnone = mean([r for r in GRID if r[1] is None])
mean_lr005_d5 = mean([r for r in GRID if r[2] == 0.05 and r[1] == 5])
mean_lr010_d5 = mean([r for r in GRID if r[2] == 0.10 and r[1] == 5])
mean_lr005_d3 = mean([r for r in GRID if r[2] == 0.05 and r[1] == 3])
mean_lr010_d3 = mean([r for r in GRID if r[2] == 0.10 and r[1] == 3])
inter_d5 = mean_lr005_d5 - mean_lr010_d5
inter_d3 = mean_lr010_d3 - mean_lr005_d3
print(f"rata-rata lr 0.05: {mean_lr005:.4f}")
print(f"rata-rata lr 0.10: {mean_lr010:.4f}")
print(f"rata-rata depth 5: {mean_d5:.4f}")
print(f"rata-rata depth tanpa batas: {mean_dnone:.4f}")
print(f"interaksi depth 5 (lr 0.05 - lr 0.10): {inter_d5:.4f}")
print(f"interaksi depth 3 (lr 0.10 - lr 0.05): {inter_d3:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean_lr005", value: 0.7851, tol: 0.00005, label: "`mean_lr005` seharusnya 0.7851", msg: "Rata-rata skor grid pada learning rate 0,05 adalah 0,7851." },
          { kind: "equal", task: "t1", name: "mean_lr010", value: 0.785, tol: 0.00005, label: "`mean_lr010` seharusnya 0.7850", msg: "Rata-rata skor grid pada learning rate 0,10 adalah 0,7850 — hampir sama dengan lr 0,05." },
          { kind: "equal", task: "t2", name: "mean_dnone", value: 0.7841, tol: 0.00005, label: "`mean_dnone` seharusnya 0.7841", msg: "Rata-rata skor grid pada max_depth tanpa batas adalah 0,7841 — paling rendah." },
          { kind: "stdout_matches", task: "t2", pattern: "rata-rata depth 5: 0\\.7856", label: "Output menampilkan rata-rata depth 5 sebesar 0,7856", msg: "Rata-rata skor grid pada max_depth 5 adalah 0,7856 — tertinggi di antara kedalaman." },
          { kind: "stdout_matches", task: "t3", pattern: "interaksi depth 5 \\(lr 0\\.05 - lr 0\\.10\\): 0\\.0010", label: "Output menampilkan interaksi depth 5 sebesar 0,0010", msg: "Pada depth 5, lr 0,05 lebih baik 0,0010 daripada lr 0,10." },
          { kind: "stdout_matches", task: "t3", pattern: "interaksi depth 3 \\(lr 0\\.10 - lr 0\\.05\\): 0\\.0012", label: "Output menampilkan interaksi depth 3 sebesar 0,0012", msg: "Pada depth 3, arahnya berbalik: lr 0,10 lebih baik 0,0012 — itulah interaksi." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 16 · Checkpoint",
      title: "Checkpoint: tuning yang jujur",
      prose: [
        "Rangkuman: parameter dipelajari dari data, hyperparameter dipilih sebelum latihan (C = 1/λ untuk LR; jumlah pohon GBM adalah max_iter, bukan n_estimators). Grid search mencoba semua kombinasi — 18 konfigurasi GBM × 3-fold = 54 fits — tapi biayanya eksponensial. Random search mengundi: dengan 27 undian, peluang menemukan 5% wilayah teratas adalah 0,7497 [ilustrasi]. Grid C logistic regression [notebook]: C = 0,01 → 0,7568; 0,1 → 0,7579; 1/10/100 → 0,7581 — datar setelah C = 1, rentang hanya 0,0013 melawan sd antar-fold 0,0083. Grid GBM [notebook]: terbaik (max_iter 100, max_depth 5, lr 0,05) CV 0,7865; terburuk 0,7827; rentang 0,0038; hanya ~0,0025 di atas default 0,7840 (default 5-fold CV vs grid 3-fold CV — orde besaran, bukan selisih eksak). Random search [notebook]: 27 konfigurasi, 81 fits, terbaik (100, 5, 0,0425) CV 0,7866 — hanya 0,0001 di atas grid, 1 dari 27 mengalahkan grid terbaik. Shrinking random search [notebook]: 9 konfigurasi di sekitar pemenang, terbaik (200, 5, 0,0297) CV 0,7869 — mengalahkan stage-1 sebesar 0,0003; ini BUKAN Bayesian optimization (scikit-optimize tidak terpasang). Budget: LR grid 25 fits, GBM grid 54, random 81, shrinking 27 — total 162 fits GBM untuk +0,0029 CV dan +0,0000 di test: GBM tertala test ROC-AUC 0,7823 dan Brier 0,1342 sama dengan default; PR-AUC 0,5598 vs 0,5597 (naik 0,0001). Optimism konfigurasi terbaik: CV 0,7865 − test 0,7823 = 0,0042. Jebakan: overfitting ke validasi (winner's curse) dan tuning di test = leakage. Peta keputusan: grid untuk sedikit hyperparameter, random untuk banyak/ kontinu, shrinking satu putaran untuk refinement, berhenti saat plateau atau test diam. Metrik utama (langkah 2): dipilih dari tujuan SEBELUM search — ranking → ROC-AUC, probabilitas → Brier/ECE, keputusan biaya → expected cost/profit, imbalance → jangan hanya accuracy (model mayoritas saja accuracy 0,7788 dari base rate 0,2212); paket lesson ini: utama ROC-AUC, sekunder PR-AUC + Brier, constraint bisnis sebagai syarat. Search space (langkah 6): coarse-to-fine, skala log untuk parameter multiplikatif (learning rate log-uniform 0,03–0,20), conditional space, kombinasi tak layak dikeluarkan; interaksi learning rate × max_depth nyata — arah efek lr berbalik antara depth 5 (+0,0010 untuk lr 0,05) dan depth 3 (+0,0012 untuk lr 0,10) [notebook]; lab 3 membedahnya dari 18 skor grid.",
        "Guided task di Colab — notebook mlf-m61-guided-task.ipynb — mereplikasi semua angka kanonis lesson ini dari data UCI: pipeline flagship (LR 0,7426 / GBM 0,7823 di test), grid C, grid GBM 18 konfigurasi, random search 27 konfigurasi (seed 42), shrinking random search 9 konfigurasi, dan evaluasi GBM tertala di test. Jalur file notebook: colab/mlf-m61-guided-task.ipynb. Tautan Colab: https://colab.research.google.com/drive/12s3A6nPT2qCW2GGiZHhBNMsLWPeFSimW",
        "Lanjut: MLF-M6.2 — Cross-Validation & Nested CV: bagaimana mendapatkan estimasi yang jujur atas SELURUH proses tuning — termasuk pemilihannya — dan mengapa CV biasa tidak cukup untuk itu.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Grid GBM 18 konfigurasi (3-fold CV) memberi konfigurasi terbaik yang mana?",
          options: [
            { text: "max_iter 100, max_depth 5, learning rate 0,05 — CV 0,7865", why: "Benar: itu grid terbaik [notebook] — 0,7865, hanya 0,0001 di atas dua konfigurasi berikutnya (0,7864).", correct: true },
            { text: "max_iter 200, max_depth 3, learning rate 0,05 — CV 0,7864", why: "Itu peringkat KEDUA (0,7864), bukan terbaik — terpaut 0,0001 di bawah (100, 5, 0,05)." },
            { text: "max_iter 50, max_depth 3, learning rate 0,05 — CV 0,7827", why: "Itu justru konfigurasi TERBURUK di grid (0,7827) — 0,0038 di bawah yang terbaik." },
            { text: "max_iter 100, max_depth tanpa batas, learning rate 0,1 — CV 0,7837", why: "Konfigurasi itu ada di grid (0,7837), tapi jauh di bawah terbaik — keenam konfigurasi max_depth tanpa batas menempati peringkat 12–17 dari 18 — tidak satu pun masuk 11 besar." },
          ],
        },
        {
          q: "Grid C logistic regression: C = 1, 10, dan 100 semuanya memberi CV 0,7581. Apa bacaan yang benar?",
          options: [
            { text: "C = 100 pasti lebih baik karena penalti paling kecil", why: "Tidak — ketiganya memberi CV dan test yang SAMA PERSIS (0,7581 / 0,7426). Tidak ada bukti C = 100 lebih baik." },
            { text: "Kurva datar setelah C = 1: melonggarkan penalti lebih jauh tidak mengubah apa-apa", why: "Benar: koefisien sudah jenuh (norma L2 0,9684 di C = 1 vs 0,9695 di C = 100) — grid ini tidak membedakan C ≥ 1.", correct: true },
            { text: "C = 1 terbaik karena CV-nya paling tinggi secara signifikan", why: "Selisihnya terhadap C = 0,1 hanya 0,0002, sementara sd antar-fold 0,0083 — perbedaan itu tidak signifikan." },
            { text: "Grid-nya salah karena C seharusnya dicoba sampai 1000", why: "Tidak ada indikasi itu: dari C = 1 ke 100 kurva sudah datar total. Memperlebar grid di wilayah datar hanya membuang fits." },
          ],
        },
        {
          q: "Random search GBM (27 konfigurasi, seed 42) vs grid terbaik (0,7865). Apa hasil yang benar?",
          options: [
            { text: "Random terbaik 0,7866 — hanya 0,0001 di atas grid, dan hanya 1 dari 27 konfigurasi yang mengalahkan grid terbaik", why: "Benar [notebook]: random menang tipis (100, 5, 0,0425 → 0,7866) dengan 1,5× fits (81 vs 54) — bukan kemenangan besar.", correct: true },
            { text: "Random terbaik 0,7869 — mengalahkan grid dengan jelas", why: "0,7869 adalah hasil SHRINKING random search (tahap refinement), bukan random search tahap pertama (0,7866)." },
            { text: "Random search mengalahkan grid karena mencoba 27 nilai BERBEDA untuk tiap hyperparameter", why: "Hampir benar soal mekanisme — tapi hasilnya di data ini hanya +0,0001 dengan 1 dari 27 menang. Mekanisme yang bagus tidak menjamin kemenangan besar." },
            { text: "Random search kalah dari grid karena 27 < 54 fits", why: "Terbalik: random memakai 81 fits (27 × 3-fold), LEBIH BANYAK dari grid (54 fits) — dan tetap hanya menang 0,0001." },
          ],
        },
        {
          q: "Shrinking random search lesson ini mencapai CV 0,7869 (max_iter 200, max_depth 5, learning rate 0,0297). Apa pernyataan yang jujur tentang metode ini?",
          options: [
            { text: "Itu Bayesian optimization, karena ia mempersempit pencarian di sekitar yang terbaik", why: "Salah: shrinking TIDAK membangun model surrogate dan tidak memakai acquisition function — ia hanya mengundi acak di kotak yang lebih kecil. Menyebutnya BO adalah klaim metode yang salah." },
            { text: "Itu shrinking random search — 9 konfigurasi di sekitar random-search terbaik — BUKAN Bayesian optimization; scikit-optimize tidak terpasang", why: "Benar: metodenya jujur bernama shrinking random search [notebook], dan BO tidak dipakai karena library-nya tidak tersedia.", correct: true },
            { text: "Itu grid search putaran kedua dengan grid yang lebih halus", why: "Bukan grid: 9 konfigurasinya DIUNDI acak (seed 43) dari nilai-nilai di sekitar pemenang, bukan dicacah sistematis." },
            { text: "Itu tidak valid karena hanya memakai 9 konfigurasi", why: "9 konfigurasi adalah desain tahap refinement yang disengaja — murah (27 fits) setelah tahap pertama memetakan wilayahnya. Validitasnya tidak ditentukan jumlahnya, melainkan kejujuran evaluasinya (CV di train)." },
          ],
        },
        {
          q: "Di HistGradientBoostingClassifier, parameter apa yang mengatur jumlah pohon?",
          options: [
            { text: "n_estimators — seperti di RandomForest", why: "Salah: HistGradientBoostingClassifier TIDAK punya n_estimators; menulisnya menghasilkan TypeError. Nama itu milik RandomForest dan GradientBoostingClassifier (lama)." },
            { text: "max_iter — jumlah iterasi boosting (= jumlah pohon)", why: "Benar: max_iter adalah parameter jumlah pohon di HistGradientBoostingClassifier [notebook].", correct: true },
            { text: "max_depth — makin dalam pohonnya, makin banyak pohonnya", why: "Salah: max_depth mengatur kedalaman TIAP pohon, bukan jumlah pohon. Pohon yang dalam belum tentu banyak." },
            { text: "learning_rate — makin kecil, makin banyak pohon yang dibutuhkan", why: "Ada hubungan tidak langsung (lr kecil biasanya butuh pohon lebih banyak), tapi learning_rate bukan parameter yang MENGATUR jumlah pohon — max_iter yang mengaturnya." },
          ],
        },
        {
          q: "Tuning menaikkan CV GBM dari default 0,7840 ke grid terbaik 0,7865 (+0,0025), tapi ROC-AUC test GBM tertala tetap 0,7823 — sama dengan default. Apa bacaan yang benar?",
          options: [
            { text: "Tuning gagal total dan seharusnya tidak pernah dilakukan", why: "Terlalu jauh: tuning memberi informasi (peta wilayah, pola learning rate 0,05, max_depth tanpa batas yang buruk) meski test tidak naik. «Tidak menaikkan test» adalah temuan, bukan alasan melarang tuning." },
            { text: "Gain CV tidak bertahan di test — pola khas overfitting ke validasi; konfigurasi terbaik punya optimism 0,0042 (CV 0,7865 − test 0,7823)", why: "Benar: CV dipakai untuk memilih, jadi skornya bias optimis; test yang disimpan menunjukkan perbaikan sebenarnya: nol di data ini. Catatan: default dinilai 5-fold CV sedangkan grid 3-fold CV, jadi selisih 0,0025 itu orde besaran, bukan selisih eksak.", correct: true },
            { text: "Test-nya salah karena seharusnya test juga naik 0,0025", why: "Tidak ada hukum yang mengharuskan test mengikuti CV — justru selisih CV−test inilah yang mengukur optimism pemilihan. Test tidak «salah»; ia jujur." },
            { text: "Grid terbaik seharusnya dipilih dari test, bukan dari CV, agar test ikut naik", why: "Itu leakage (langkah 11): memilih dari test membuat test berhenti menjadi pengukur jujur — skornya akan terlihat naik padahal itu hanya pemilihan atas test itu sendiri." },
          ],
        },
        {
          q: "Berapa total fits untuk grid GBM (18 konfigurasi, 3-fold) dan grid LR (5 nilai C, 5-fold)?",
          options: [
            { text: "GBM: 54 fits; LR: 25 fits", why: "Benar: 18 × 3 = 54 dan 5 × 5 = 25 [notebook]. Total fits = konfigurasi × fold.", correct: true },
            { text: "GBM: 18 fits; LR: 5 fits", why: "Itu jumlah KONFIGURASI, bukan fits — tiap konfigurasi dilatih sekali per fold (3× untuk GBM, 5× untuk LR)." },
            { text: "GBM: 162 fits; LR: 25 fits", why: "162 adalah total SEMUA fits GBM (grid 54 + random 81 + shrinking 27) — bukan grid saja." },
            { text: "GBM: 54 fits; LR: 15 fits", why: "LR: 5 nilai C × 5-fold = 25 fits, bukan 15." },
          ],
        },
        {
          q: "Kamu mencoba 18 konfigurasi dan memilih yang skor TEST-nya tertinggi, lalu melaporkan skor test itu sebagai kemampuan model. Apa masalahnya?",
          options: [
            { text: "Tidak ada — test memang tempat memilih model terbaik", why: "Salah: test yang dipakai untuk memilih berhenti menjadi pengukur yang netral. Itulah leakage — skor yang dilaporkan adalah «terbaik dari 18 percobaan pada test itu», bukan kemampuan pada data baru." },
            { text: "Itu leakage: test sudah bocor ke keputusan; estimasi yang jujur butuh CV di train untuk memilih dan test yang disimpan (atau nested CV, M6.2)", why: "Benar: pisahkan peran data — train melatih, CV di train memilih, test menilai sekali di akhir.", correct: true },
            { text: "Tidak ada — selama 18 konfigurasi itu semuanya masuk akal", why: "Jumlah atau kewajaran konfigurasi tidak mengubah masalahnya: pemilihan berbasis test tetap membiaskan skor test ke atas, berapa pun konfigurasinya." },
            { text: "Itu overfitting biasa pada train, bukan leakage", why: "Overfitting pada train adalah soal model menghafal train; ini soal PEMILIHAN yang memakai test — kategorinya leakage (informasi test bocor ke keputusan)." },
          ],
        },
        {
          q: "Manajer risiko ingin memakai probabilitas model untuk penetapan harga kredit — probabilitas dipakai sebagai angka. Metrik utama yang tepat ditetapkan SEBELUM tuning?",
          options: [
            { text: "Brier score (dan ECE) — karena yang dinilai adalah kualitas probabilitas sebagai angka", why: "Benar: bila probabilitas dipakai sebagai angka, metrik utamanya mengukur kalibrasi — Brier/ECE (langkah 2).", correct: true },
            { text: "ROC-AUC — karena ROC-AUC selalu menjadi metrik utama", why: "Salah: tidak ada metrik utama universal — ROC-AUC mengukur ranking, bukan kualitas probabilitas sebagai angka." },
            { text: "Accuracy — karena harga harus didasarkan pada prediksi yang benar", why: "Salah: accuracy mengabaikan seberapa jauh probabilitasnya meleset — model yang «benar» 80% waktu bisa tetap salah harga bila probabilitasnya tidak terkalibrasi." },
            { text: "PR-AUC — karena gagal bayar adalah kelas langka", why: "PR-AUC mengukur ranking di kelas langka — berguna sebagai diagnostik sekunder di sini, tapi bukan metrik utama bila yang dipakai adalah nilai probabilitasnya." },
          ],
        },
        {
          q: "Kamu merancang grid learning rate secara linear: 0,01; 0,26; 0,51; 0,76; 1,00 [ilustrasi]. Apa masalahnya, dan apa perbaikannya?",
          options: [
            { text: "Tidak ada masalah — lima titik linear sudah merata", why: "Salah: «merata» dalam linear berarti menumpuk di nilai besar — jarak 0,51→0,76 sama bobotnya dengan 0,01→0,26 padahal efek learning rate bekerja lewat perkalian." },
            { text: "Skala linear memboroskan titik di nilai besar dan melewatkan wilayah kecil — pakai skala log (misal log-uniform 0,03–0,20 seperti lesson ini)", why: "Benar: parameter multiplikatif dirancang dalam log — tiap penggandaan mendapat bobot yang sama (langkah 6).", correct: true },
            { text: "Grid-nya terlalu kecil — harus 10 titik, bukan 5", why: "Jumlah titik bukan masalah utamanya: 5 titik linear tetap menumpuk di atas; 5 titik log sudah merata. Masalahnya skala, bukan jumlah." },
            { text: "Learning rate tidak boleh di atas 0,20", why: "Tidak ada batas universal itu — 0,20 adalah batas search space lesson ini. Masalah grid di atas adalah skalanya, bukan batas atasnya." },
          ],
        },
      ],
      summary: [
        "Parameter dipelajari dari data; hyperparameter dipilih sebelum latihan (C = 1/λ untuk LR; jumlah pohon GBM adalah max_iter, bukan n_estimators).",
        "Grid search: semua kombinasi — 18 konfigurasi GBM × 3-fold = 54 fits — biayanya eksponensial; random search: 27 undian memberi peluang 0,7497 menemukan 5% wilayah teratas [ilustrasi].",
        "Grid C LR [notebook]: 0,01 → 0,7568; 0,1 → 0,7579; 1/10/100 → 0,7581 — datar setelah C = 1, rentang 0,0013 vs sd antar-fold 0,0083.",
        "Grid GBM [notebook]: terbaik (100, 5, 0,05) CV 0,7865; terburuk 0,7827; rentang 0,0038; ~0,0025 di atas default 0,7840 (default 5-fold CV vs grid 3-fold CV — orde besaran, bukan selisih eksak).",
        "Random search [notebook]: 27 konfigurasi, 81 fits, terbaik (100, 5, 0,0425) CV 0,7866 — hanya +0,0001 atas grid, 1 dari 27 mengalahkan grid terbaik.",
        "Shrinking random search [notebook]: 9 konfigurasi, terbaik (200, 5, 0,0297) CV 0,7869 — BUKAN Bayesian optimization (scikit-optimize tidak terpasang).",
        "Budget: LR grid 25 fits, GBM grid 54, random 81, shrinking 27 — 162 fits GBM untuk +0,0029 CV dan +0,0000 di test (GBM tertala test 0,7823 / PR-AUC 0,5598 / Brier 0,1342).",
        "Jebakan: overfitting ke validasi (optimism konfigurasi terbaik 0,0042) dan tuning di test = leakage; estimasi jujur butuh nested CV (M6.2).",
        "Lab: grid C manual — C terbaik 1 (CV 0.7581), rentang 0.0013; random vs grid — grid 0.7865, selisih 0.0001, proporsi 0.0370, rasio fits 1.5.",
        "Metrik utama (langkah 2): dipilih dari tujuan SEBELUM search — ranking → ROC-AUC, probabilitas → Brier/ECE, keputusan biaya → expected cost/profit, imbalance → jangan hanya accuracy (mayoritas saja 0,7788).",
        "Search space (langkah 6): coarse-to-fine, skala log untuk parameter multiplikatif (lr log-uniform 0,03–0,20), conditional space, kombinasi tak layak dikeluarkan; interaksi lr × depth nyata (arah berbalik antara depth 5 dan depth 3).",
        "Lab 3: bedah grid — rata-rata lr 0,05: 0.7851 vs lr 0,10: 0.7850; depth 5: 0.7856 vs tanpa batas: 0.7841; interaksi depth 5: 0.0010, depth 3: 0.0012.",
      ],
      next: { label: "Lanjut: MLF-M6.2 — Cross-Validation & Nested CV", href: "/v2/learn/mlf-m62-cross-validation-nested-cv" },
    },
  ],
};

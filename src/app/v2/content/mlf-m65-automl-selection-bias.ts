import type { V2Lesson } from "../lib/types";

export const mlfM65: V2Lesson = {
  slug: "mlf-m65-automl-selection-bias",
  track: "Machine Learning Finance",
  module: "Tuning & model selection",
  title: "MLF-M6.5 — AutoML & Selection Bias: Pemenang yang Menyanjung Dirinya Sendiri",
  estMinutes: 85,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Delapan belas kandidat, satu pemenang — dan pemenang itu menyanjung dirinya sendiri",
      prose: [
        "Kamu sudah menghabiskan modul M6 untuk mencari model terbaik: grid search 18 konfigurasi GBM (M6.1), validasi silang dan nested CV (M6.2), regularisasi (M6.3), kalibrasi dan threshold (M6.4). Di ujung semua itu ada satu pertanyaan yang belum dijawab dengan jujur: bila kamu memilih pemenang dari 18 kandidat berdasarkan skor validasi, seberapa besar skor itu melebih-lebihkan kemampuan sang pemenang? Lesson ini menjawabnya — dan jawabannya mengubah cara kamu membaca leaderboard apa pun, termasuk leaderboard-mu sendiri.",
        "Peta lesson: cerita 18 kandidat → apa yang diotomasi AutoML dan apa yang tidak → winner's curse dengan angka kanonis → mengapa validasi menyanjung pemenang → uji McNemar LR vs GBM → uji McNemar GBM vs GBM-tertala → signifikan vs penting → protokol perbandingan yang adil → single vs ensemble sebagai opsi seleksi → worked example: putuskan pemenang yang jujur → finalisasi model + lab selection record → jebakan + audit registry lintas sesi → 2 lab (McNemar, winner's curse) → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M6.5 dan file kanonis M6 [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate 0,2212, split stratified 80/20 (train 24.000, test 6.000, seed 42), 31 fitur. Baseline flagship: LR ROC-AUC 0,7426 / PR-AUC 0,5049; GBM default ROC-AUC 0,7823 / PR-AUC 0,5597; GBM train ROC-AUC 0,8469 vs test 0,7823 — gap 0,0646.",
        "Nilai: lesson ini mengajarkan satu keterampilan yang membedakan analis yang bisa dipercaya dari analis yang hanya bisa menang di leaderboard: membedakan «skor tertinggi» dari «menang signifikan», dan «pemenang validasi» dari «pemenang yang jujur». Tanpa keterampilan ini, seluruh modul M6 — tuning, validasi, kalibrasi — berakhir pada keputusan yang terlihat meyakinkan tapi bertumpu pada noise.",
        "Baik atau buruk: memilih dari 18 kandidat itu bagus — ia memakai data, bukan firasat, dan 18 konfigurasi yang dicoba jauh lebih baik daripada satu tebakan. Buruk bila skor pemenangnya dibaca sebagai estimasi yang tak-bias: skor validasi TERBAIK dari 18 kandidat secara sistematis melebih-lebihkan skor test-nya, karena kandidat yang terpilih adalah kandidat yang kebetulan diuntungkan noise validasi (langkah 3–4).",
        "Mitigasi: jangan pernah melaporkan skor validasi pemenang sebagai «performa model». Laporkan tiga angka sekaligus: skor validasi pemenang, skor test-nya, dan selisihnya (optimisme) — lalu putuskan pemenang dengan protokol yang adil (langkah 8), bukan dengan satu leaderboard.",
      ],
      tasks: [],
    },
    {
      id: "automl",
      eyebrow: "Langkah 2 · AutoML",
      title: "AutoML: apa yang diotomasi, apa yang tetap menjadi pekerjaanmu",
      prose: [
        "AutoML adalah payung untuk semua yang mengotomasi pencarian model: grid search dan random search atas hyperparameter (M6.1), pemilihan algoritma (LR vs GBM vs random forest), kadang sampai feature engineering dan ensembling. Yang diotomasi adalah PENCARIAN — mencoba banyak kombinasi, menilai tiap kombinasi dengan validasi silang, dan mengembalikan yang terbaik. Yang TIDAK diotomasi adalah PERUMUSAN: masalah bisnis apa yang diselesaikan, metrik apa yang benar (ROC-AUC? PR-AUC? biaya? — M6.4 menunjukkan threshold 0,10 mengalahkan 0,50 secara biaya), data mana yang boleh dipakai tanpa leakage, dan apakah «terbaik» itu bermakna atau hanya noise.",
        "Nilai: di data UCI ini [notebook], grid search GBM mencoba 18 konfigurasi (3-fold CV, 54 fit) dan menemukan yang terbaik: max_iter 100, max_depth 5, learning_rate 0,05, skor CV 0,7865. Random search dengan 27 konfigurasi (81 fit) menemukan yang terbaik di antara 27 konfigurasi random search, 0,7866 — hanya 0,0001 di atas grid. Pesannya: pencarian yang lebih luas tidak otomatis memberi model yang lebih baik; begitu kandidat-kandidatnya sudah berdekatan, tambahan pencarian hanya mengaduk noise (langkah 4).",
        "Baik atau buruk: AutoML bagus karena ia membuat pencarian menjadi sistematis dan bisa direplikasi — 18 konfigurasi dengan protokol yang sama jauh lebih jujur daripada «saya coba-coba sampai dapat yang bagus». Buruk bila ia dipakai sebagai kotak hitam: «AutoML yang memilih, jadi pasti benar» adalah penyerahan keputusan, bukan keputusan. AutoML tidak tahu bahwa threshold 0,50 yang ia pakai untuk membandingkan model adalah threshold yang salah secara biaya (M6.4), dan tidak tahu bahwa test set sudah kamu intip tiga kali (langkah 12).",
        "Mitigasi: pakai AutoML untuk pencarian, tapi pegang sendiri tiga hal: (1) metrik utama yang ditetapkan SEBELUM pencarian dimulai (di sini ROC-AUC); (2) protokol evaluasi yang tidak bocor (nested CV untuk yang di-tuning, test terkunci untuk keputusan akhir — langkah 8); (3) uji signifikansi sebelum mengklaim satu model mengalahkan model lain (langkah 5–7).",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: AutoML menghilangkan kebutuhan memahami model",
        type: "pitfall",
        body: "Yang benar: AutoML menghilangkan pekerjaan MEKANIS — menjalankan banyak kombinasi dan mencatat skornya. Ia tidak menghilangkan pekerjaan PENILAIAN: apakah skor itu bisa dipercaya, apakah selisihnya bermakna, apakah pemenangnya jujur. Lesson ini seluruhnya adalah pekerjaan penilaian itu — dan tidak ada tombol AutoML yang mengerjakannya untukmu.",
      },
    },
    {
      id: "winners-curse",
      eyebrow: "Langkah 3 · Winner's curse",
      title: "Winner's curse: skor validasi terbaik melebih-lebihkan skor test sebesar 0,0042",
      prose: [
        "Winner's curse adalah nama untuk satu fakta statistik yang sederhana: bila kamu memilih yang TERBAIK dari banyak kandidat berdasarkan skor yang berisik, skor kandidat terpilih itu melebih-lebihkan kemampuan sebenarnya. «Kutukan»-nya: justru karena ia menang, skornya paling tidak bisa dipercaya.",
        "Nilai: dari 18 konfigurasi GBM [notebook], konfigurasi CV-terbaik (max_iter 100, max_depth 5, learning_rate 0,05) punya skor CV 0,7865 — tapi ketika model yang sama dilatih ulang di train penuh dan diuji di test 6.000 baris, skor test-nya 0,7823. Optimisme = 0,7865 − 0,7823 = 0,0042. Dan ini bukan kasus khusus satu konfigurasi: rata-rata optimisme (CV − test) di KE-18 konfigurasi juga 0,0042 — setiap konfigurasi, tanpa kecuali, punya skor CV di atas skor test-nya. Optimisme terkecil 0,0014 — dua konfigurasi max_depth tanpa batas dengan learning_rate 0,10 (max_iter 100 dan 200; yang max_iter 50 memberi 0,0015), terbesar 0,0066 (max_iter 50, max_depth 3, learning_rate 0,05). Satu koreksi atribusi: 0,0042 adalah gap protokol CV-vs-holdout yang dimiliki semua 18 kandidat (rata-rata optimisme juga 0,0042) — karena itu ia bukan estimasi eksklusif winner's curse. Bukti curse yang sebenarnya adalah ketidakstabilan peringkat: K15 (peringkat-15 CV) menyamai skor test tertinggi, dan empat konfigurasi seri di test 0,7823.",
        "Gambar di bawah memplot skor CV vs test untuk 6 dari 18 konfigurasi — yang terbaik, yang tengah, dan yang terbawah menurut CV. Perhatikan dua hal: pertama, batang CV selalu lebih tinggi dari batang test — optimisme itu sistematis, bukan kebetulan satu konfigurasi. Kedua, peringkatnya BERUBAH: konfigurasi peringkat-15 menurut CV (max_iter 50, tanpa batas depth, learning_rate 0,10; CV 0,7838) menyamai skor test tertinggi 0,7823 — sama dengan skor test sang juara CV (0,7823), meski skor CV-nya 0,7838. «Pemenang tunggal» ternyata seri empat arah di test: empat konfigurasi berbagi skor test 0,7823.",
        "Baik atau buruk: optimisme 0,0042 di sini KECIL — ia jauh lebih kecil dari selisih antar model yang penting (LR 0,7426 vs GBM 0,7823, selisih 0,0397) dan jauh lebih kecil dari simpangan baku antar-fold nested CV (0,0068, langkah 7). Buruk bila angka kecil ini dibaca sebagai «winner's curse tidak penting»: ia kecil DI SINI karena gain tuning-nya kecil (seluruh grid hanya merentang 0,7827–0,7865 di CV). Bila kandidatnya ratusan, validasinya kecil, atau selisih antar kandidatnya tipis, optimisme yang sama bisa membengkak sampai menelan seluruh «kemenangan» (langkah 4).",
        "Mitigasi: laporkan optimisme bersama skornya — «CV 0,7865, test 0,7823, optimisme 0,0042» — bukan skor CV saja. Dan bila kamu membandingkan BANYAK kandidat, jangan pakai skor validasi yang sama untuk memilih DAN untuk melaporkan: pisahkan (nested CV, langkah 8), atau setidaknya sadari bahwa laporanmu melebih-lebihkan.",
      ],
      formula: String.raw`\mathrm{optimisme} = \mathrm{skor_{CV}} - \mathrm{skor_{test}}, \qquad \mathbb{E}[\max_k \hat{S}_k] \geq \max_k \mathbb{E}[\hat{S}_k]`,
      formulaNote: "Optimisme pemenang = skor CV-nya dikurangi skor test-nya (di sini 0,7865 − 0,7823 = 0,0042). Ketaksamaan kedua adalah inti winner's curse: nilai harapan dari skor TERBAIK yang diamati selalu ≥ skor terbaik yang sebenarnya — maksimum atas estimasi yang berisik bias ke atas.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Skor CV vs test 6 konfigurasi GBM: K1 CV 0,7865 test 0,7823; K2 0,7864 dan 0,7816; K4 0,7862 dan 0,7802; K9 0,7853 dan 0,7814; K15 0,7838 dan 0,7823; K18 0,7827 dan 0,7761">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Winner's curse — skor CV vs test (6 dari 18 konfigurasi GBM)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,770</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,775</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,780</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,785</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,790</text>
<rect x="62" y="60.8" width="26" height="145.2" fill="var(--c1)"/>
<text x="75" y="56.8" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7865</text>
<rect x="90" y="97.8" width="26" height="108.2" fill="var(--c2)"/>
<text x="103" y="93.8" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7823</text>
<text x="89" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">K1</text>
<rect x="131" y="61.7" width="26" height="144.3" fill="var(--c1)"/>
<text x="144" y="57.7" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7864</text>
<rect x="159" y="103.9" width="26" height="102.1" fill="var(--c2)"/>
<text x="172" y="99.9" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7816</text>
<text x="158" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">K2</text>
<rect x="200" y="63.4" width="26" height="142.6" fill="var(--c1)"/>
<text x="213" y="59.4" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7862</text>
<rect x="228" y="116.2" width="26" height="89.8" fill="var(--c2)"/>
<text x="241" y="112.2" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7802</text>
<text x="227" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">K4</text>
<rect x="269" y="71.4" width="26" height="134.6" fill="var(--c1)"/>
<text x="282" y="67.4" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7853</text>
<rect x="297" y="105.7" width="26" height="100.3" fill="var(--c2)"/>
<text x="310" y="101.7" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7814</text>
<text x="296" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">K9</text>
<rect x="338" y="84.6" width="26" height="121.4" fill="var(--c1)"/>
<text x="351" y="80.6" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7838</text>
<rect x="366" y="97.8" width="26" height="108.2" fill="var(--c2)"/>
<text x="379" y="93.8" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7823</text>
<text x="365" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">K15</text>
<rect x="407" y="94.2" width="26" height="111.8" fill="var(--c1)"/>
<text x="420" y="90.2" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7827</text>
<rect x="435" y="152.3" width="26" height="53.7" fill="var(--c2)"/>
<text x="448" y="148.3" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,7761</text>
<text x="434" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">K18</text>
<rect x="300" y="34" width="14" height="10" fill="var(--c1)"/>
<text x="318" y="43" font-size="10" fill="var(--text)" font-family="var(--font-ui)">skor CV (3-fold)</text>
<rect x="300" y="48" width="14" height="10" fill="var(--c2)"/>
<text x="318" y="57" font-size="10" fill="var(--text)" font-family="var(--font-ui)">skor test (6.000)</text>
</svg>`,
        alt: "Skor CV selalu di atas skor test pada 6 konfigurasi GBM: K1 0,7865 vs 0,7823; K2 0,7864 vs 0,7816; K4 0,7862 vs 0,7802; K9 0,7853 vs 0,7814; K15 0,7838 vs 0,7823; K18 0,7827 vs 0,7761.",
        caption: "Cara membaca: tiap kelompok = satu konfigurasi (peringkat CV: K1 terbaik, K18 terbawah; K15 = max_iter 50, tanpa batas depth, learning_rate 0,10). Batang gelap = skor CV 3-fold (evaluasi pada lipatan held-out di dalam train), batang warna = skor test 6.000 baris [notebook]. Dua bacaan: (1) batang CV SELALU lebih tinggi — optimisme sistematis, rata-rata 0,0042 di 18 konfigurasi; (2) peringkat berubah — K15 (peringkat-15 CV) menyamai skor test tertinggi 0,7823, dan empat konfigurasi berbagi skor test itu.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: skor CV pemenang adalah estimasi tak-bias",
        type: "pitfall",
        body: "Yang benar: skor CV SATU konfigurasi yang ditetapkan sebelum melihat data memang (hampir) tak-bias. Tapi skor CV dari konfigurasi yang DIPILIH karena skornya tertinggi di antara 18 kandidat adalah bias ke atas — ia adalah maksimum dari 18 estimasi berisik, dan maksimum itu hampir selalu mengandung noise positif. Di sini gap CV-vs-test pemenangnya 0,0042 [notebook] — kecil, tapi nyata dan sistematis: semua 18 konfigurasi punya CV di atas test-nya (rata-rata juga 0,0042). Jadi 0,0042 adalah gap protokol CV-vs-holdout yang dimiliki semua kandidat, bukan ukuran eksklusif winner's curse — bukti curse-nya adalah ketidakstabilan peringkat (K15 menyamai skor test tertinggi; seri 4 arah).",
      },
    },
    {
      id: "seleksi-noise",
      eyebrow: "Langkah 4 · Mengapa validasi menyanjung pemenang",
      title: "Seleksi atas noise: pemenang dipilih justru karena noise-nya positif",
      prose: [
        "Mekanismenya sederhana bila ditulis sebagai rumus: skor CV yang kamu amati untuk konfigurasi k adalah skor sejati + noise, Ŝ_k = S_k + ε_k. Noise ε_k berasal dari lipatan CV yang itu-itu juga, dari sampel train yang terbatas (24.000 baris), dan dari keacakan pelatihan. Bila kamu memilih k dengan Ŝ_k terbesar, kamu tidak hanya memilih S_k yang besar — kamu juga, secara sistematis, memilih ε_k yang positif. Konfigurasi yang «menang» adalah konfigurasi yang kebetulan diuntungkan noise — dan di test set yang baru, noise itu tidak ikut.",
        "Nilai: di grid GBM [notebook], seluruh 18 konfigurasi punya skor CV dalam rentang sempit 0,7827–0,7865 — lebar rentang hanya 0,0038, LEBIH KECIL dari optimisme rata-rata 0,0042 dan lebih kecil dari simpangan baku antar-fold nested CV 0,0068. Artinya: perbedaan antar konfigurasi di grid ini sebagian besar ADALAH noise. Memilih «yang terbaik» dari 18 angka yang berbeda tipis karena noise, lalu melaporkan skornya, hampir pasti melebih-lebihkan. Bukti paling jujur: empat konfigurasi berbagi skor test tertinggi 0,7823 — termasuk K15 yang peringkat CV-nya hanya 15 dari 18.",
        "Kapan winner's curse BESAR? Tiga kondisi memperbesarnya, dan ketiganya bisa kamu periksa sebelum percaya pada leaderboard: (1) BANYAK kandidat — makin banyak yang dipilih, makin besar peluang salah satunya mendapat noise positif yang ekstrem; grid 18 di sini kecil, AutoML modern bisa mencoba ratusan; (2) VALIDASI KECIL — makin kecil lipatan validasi, makin besar noise tiap skor (sd antar-fold 0,0068 di sini sudah memberi gambaran); (3) SELISIH ANTAR KANDIDAT KECIL — bila kandidat-kandidatnya memang hampir setara (rentang CV 0,0038), maka rankingnya ditentukan noise, bukan kemampuan. Sebaliknya, curse KECIL bila kandidatnya sedikit, validasinya besar, dan selisih antar kandidatnya lebar — persis seperti perbandingan LR vs GBM (selisih 0,0397), yang tidak terancam curse (langkah 5).",
        "Baik atau buruk: seleksi atas skor validasi itu bagus sebagai CARA MEMILIH — ia tetap memilih konfigurasi yang masuk akal (di sini sang juara CV juga berbagi skor test tertinggi). Buruk sebagai CARA MELAPORKAN — skor yang dilaporkan adalah skor yang sudah «dipilih karena tinggi», dan pembaca yang tidak tahu itu akan mengira modelnya sebagus 0,7865, padahal test-nya 0,7823.",
        "Mitigasi: tiga penawar, dari yang paling murah ke yang paling mahal. (1) Laporkan optimisme (langkah 3) — murah, jujur, dan cukup bila curse-nya kecil. (2) Ulangi seleksi di lipatan yang berbeda dan lihat apakah pemenangnya stabil — bila pemenang berganti tiap lipatan, rankingnya adalah noise (di nested CV langkah 8, konfigurasi terbaik BERGANTI di tiap outer fold — bukti langsung). (3) Nested CV: seleksi di dalam, evaluasi di luar — mahal (270 fit untuk GBM di sini) tapi memberi estimasi yang tidak tercemar seleksi.",
      ],
      tasks: [],
    },
    {
      id: "mcnemar",
      eyebrow: "Langkah 5 · McNemar: LR vs GBM",
      title: "McNemar: membandingkan dua model pada data yang SAMA",
      prose: [
        "Skor ROC-AUC berkata GBM (0,7823) mengalahkan LR (0,7426) [notebook] — selisih 0,0397. Tapi apakah selisih itu NYATA, atau hanya kebetulan test set 6.000 baris ini? Membandingkan dua skor dari test set yang sama dengan uji-t biasa adalah salah: kedua model diuji pada NASABAH YANG SAMA, jadi kesalahan mereka berkorelasi. Uji yang benar adalah McNemar — sudah kamu pelajari di MLF-M4 (MLE4) — dan di sini ringkasannya: McNemar hanya memakai pasangan DISCORDANT, yaitu nasabah di mana kedua model TIDAK SEPAKAT dan satu benar satu salah. Pasangan di mana keduanya benar atau keduanya salah tidak memberi informasi tentang siapa yang lebih baik, dan tidak masuk rumus.",
        "Nilai: pada test 6.000 baris, threshold 0,5 [notebook] — b = 132 (LR benar, GBM salah), c = 199 (LR salah, GBM benar). Total pasangan discordant: 331. Statistik uji dengan koreksi kontinuitas: χ² = (|132 − 199| − 1)² / 331 = 66² / 331 = 13,1601. Nilai p (metode chi2, df = 1) = 0,0003 — dan uji binomial eksak atas pasangan yang sama memberi p = 0,0003 juga, jadi kesimpulannya tidak bergantung pada pilihan metode. Karena 0,0003 < 0,05, tolak H₀: GBM menang SIGNIFIKAN atas LR. Perhatikan arahnya: c > b — GBM benar di 199 nasabah yang LR-nya salah, sementara LR hanya benar di 132 nasabah yang GBM-nya salah. Selisih bersih 67 nasabah dari 6.000.",
        "Gambar di bawah menampilkan kedua tabel McNemar lesson ini berdampingan — LR vs GBM di kiri, GBM vs GBM-tertala di kanan (langkah 6). Bacalah sel b dan c saja: hanya itulah yang masuk rumus. Sel a (keduanya benar) dan d (keduanya salah) digambarkan kosong — bukan karena tidak ada, melainkan karena uji ini tidak memakainya.",
        "Baik atau buruk: McNemar bagus karena ia memakai struktur PASANGAN — ia membandingkan model pada nasabah yang sama, sehingga variasi antar-nasabah (ada nasabah yang memang sulit) saling meniadakan dan ujinya lebih peka daripada membandingkan dua skor mentah. Buruk bila dipakai di luar syaratnya: McNemar membandingkan prediksi KLASIFIKASI (benar/salah pada satu threshold, di sini 0,5), bukan skor ROC-AUC — ia tidak berkata apa-apa tentang ranking probabilitas. Dan ia menguji «apakah berbeda», bukan «seberapa besar bedanya» (langkah 7).",
        "Mitigasi: laporkan selalu b dan c-nya, bukan hanya p-value — «b = 132, c = 199» memberi tahu pembaca BESARNYA keunggulan (67 nasabah bersih), sementara «p = 0,0003» saja tidak. Dan tetapkan threshold SEBELUM menguji: McNemar di 0,5 menjawab pertanyaan di 0,5; di threshold biaya-optimal 0,10 (M6.4), tabelnya berbeda dan kesimpulannya bisa berbeda.",
      ],
      formula: String.raw`\chi^2 = \frac{(|b - c| - 1)^2}{b + c}, \qquad \text{tolak } H_0 \text{ bila } \chi^2 > 3{,}8415`,
      formulaNote: "Uji McNemar dengan koreksi kontinuitas (Yates): b dan c adalah pasangan discordant; −1 di pembilang adalah koreksi kontinuitas. Nilai kritis χ² (df = 1, α = 0,05) = 3,8415. Di sini χ² = 13,1601 > 3,8415, p (metode chi2) = 0,0003.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Tabel McNemar LR vs GBM: b sama dengan 132, c sama dengan 199, chi2 13,1601, p 0,0003 signifikan; GBM vs tertala: b 36, c 30, chi2 0,3788, p 0,5383 tidak signifikan">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">McNemar — hanya pasangan discordant (b, c) yang diuji</text>
<text x="102" y="36" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">GBM benar</text>
<text x="182" y="36" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">GBM salah</text>
<text x="58" y="68" text-anchor="end" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">LR benar</text>
<text x="58" y="108" text-anchor="end" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">LR salah</text>
<rect x="62" y="44" width="80" height="40" fill="none" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="70" y="58" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">a</text>
<text x="102" y="74" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">keduanya benar</text>
<rect x="142" y="44" width="80" height="40" fill="var(--c2)"/>
<text x="150" y="58" font-size="11" fill="var(--text)" font-family="var(--font-ui)">b</text>
<text x="182" y="74" text-anchor="middle" font-size="14" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">132</text>
<rect x="62" y="84" width="80" height="40" fill="var(--c4)"/>
<text x="70" y="98" font-size="11" fill="var(--text)" font-family="var(--font-ui)">c</text>
<text x="102" y="114" text-anchor="middle" font-size="14" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">199</text>
<rect x="142" y="84" width="80" height="40" fill="none" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="150" y="98" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">d</text>
<text x="182" y="114" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">keduanya salah</text>
<text x="142" y="146" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">LR vs GBM — χ² = 13,1601 · p = 0,0003</text>
<text x="142" y="164" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">GBM menang SIGNIFIKAN</text>
<text x="342" y="36" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">tert. benar</text>
<text x="422" y="36" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">tert. salah</text>
<text x="298" y="68" text-anchor="end" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">def. benar</text>
<text x="298" y="108" text-anchor="end" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">def. salah</text>
<rect x="302" y="44" width="80" height="40" fill="none" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="310" y="58" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">a</text>
<text x="342" y="74" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">keduanya benar</text>
<rect x="382" y="44" width="80" height="40" fill="var(--c2)"/>
<text x="390" y="58" font-size="11" fill="var(--text)" font-family="var(--font-ui)">b</text>
<text x="422" y="74" text-anchor="middle" font-size="14" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">36</text>
<rect x="302" y="84" width="80" height="40" fill="var(--c4)"/>
<text x="310" y="98" font-size="11" fill="var(--text)" font-family="var(--font-ui)">c</text>
<text x="342" y="114" text-anchor="middle" font-size="14" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">30</text>
<rect x="382" y="84" width="80" height="40" fill="none" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="390" y="98" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">d</text>
<text x="422" y="114" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">keduanya salah</text>
<text x="382" y="146" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">GBM vs tertala — χ² = 0,3788 · p = 0,5383</text>
<text x="382" y="164" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TIDAK signifikan</text>
<text x="240" y="196" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Sel a dan d (keduanya benar / keduanya salah) tidak masuk rumus — hanya b dan c yang diuji.</text>
<text x="240" y="212" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Threshold 0,5 · test 6.000 baris · p dari metode chi2 [notebook].</text>
</svg>`,
        alt: "Dua tabel McNemar. LR vs GBM: b 132, c 199, chi2 13,1601, p 0,0003, GBM menang signifikan. GBM default vs tertala: b 36, c 30, chi2 0,3788, p 0,5383, tidak signifikan. Sel a dan d tidak dipakai.",
        caption: "Cara membaca: tiap tabel 2×2 membandingkan dua model pada nasabah yang sama (threshold 0,5, test 6.000 baris [notebook]). Sel berwarna adalah pasangan discordant: b = model pertama benar & kedua salah, c = sebaliknya. Kiri: c (199) jauh di atas b (132) — χ² = 13,1601, p = 0,0003, GBM menang signifikan. Kanan: b (36) vs c (30) hampir berimbang — χ² = 0,3788, p = 0,5383, tidak signifikan. Sel a dan d (garis putus-putus) tidak memengaruhi uji sama sekali.",
      },
      tasks: [],
    },
    {
      id: "mcnemar-tuned",
      eyebrow: "Langkah 6 · McNemar: GBM vs GBM-tertala",
      title: "«Menang» yang tidak signifikan: tuning GBM vs GBM default",
      prose: [
        "Sekarang uji yang sama untuk pertanyaan yang lebih tajam: apakah GBM tertala (konfigurasi grid-terbaik, max_iter 100, max_depth 5, learning_rate 0,05) benar-benar lebih baik daripada GBM default? Di skor ROC-AUC, tertala 0,7823 vs default 0,7823 — SAMA PERSIS di test 6.000 baris [notebook]. Di PR-AUC, tertala 0,5598 vs default 0,5597 — selisih 0,0001. Sekilas, tuning tampak tidak menghasilkan apa-apa. McNemar mengujinya secara formal pada prediksi klasifikasi (threshold 0,5).",
        "Nilai: b = 36 (GBM default benar, tertala salah), c = 30 (default salah, tertala benar). Total pasangan discordant hanya 66 — jauh lebih sedikit daripada 331 pada LR vs GBM, karena kedua model ini hampir selalu sepakat. χ² = (|36 − 30| − 1)² / 66 = 25 / 66 = 0,3788. Nilai p (metode chi2) = 0,5383 — uji binomial eksak memberi 0,5386, lagi-lagi sejalan. Karena 0,5383 jauh di atas 0,05, H₀ tidak ditolak: perbedaan GBM default vs tertala TIDAK SIGNIFIKAN. Perhatikan: ini bukan bukti bahwa tuning «tidak berpengaruh sama sekali» — ini adalah ketiadaan bukti bahwa ia berpengaruh. Dua pernyataan itu berbeda, dan mencampurnya adalah kesalahan yang paling umum dalam membaca uji statistik.",
        "Baik atau buruk: hasil «tidak signifikan» ini bagus sebagai KOREKSI — ia mencegahmu mengklaim kemenangan tuning yang tidak ada. Tanpa McNemar, kamu mungkin melaporkan «GBM tertala menang (CV 0,7865 vs default 0,7840)» dan menghabiskan biaya komputasi tuning di produksi untuk keuntungan yang tidak terbukti. Buruk bila «tidak signifikan» dibaca sebagai «modelnya identik»: p = 0,5383 tidak membuktikan kesetaraan — ia hanya berkata data ini (66 pasangan discordant) terlalu sedikit untuk membedakan keduanya. Dengan test yang jauh lebih besar, selisih sekecil apa pun bisa menjadi signifikan — dan tetap tidak penting (langkah 7).",
        "Mitigasi: bila dua model hampir selalu sepakat (discordant kecil), jangan paksa membedakannya dengan satu test set — laporkan «tidak terbukti berbeda» dan pilih berdasarkan kriteria lain: kesederhanaan, kecepatan, stabilitas, atau biaya. Di sini, GBM default dan tertala sama-sama sah; alasan memilih tertala datang dari nested CV (langkah 8 dan 10), bukan dari McNemar — dan alasan itu pun lemah (langkah 7).",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: p > 0,05 berarti kedua model terbukti sama",
        type: "pitfall",
        body: "Yang benar: p = 0,5383 berarti «data ini tidak cukup untuk membuktikan keduanya berbeda» — bukan «keduanya terbukti sama». Membuktikan kesetaraan butuh uji yang berbeda (equivalence test) dengan ambang yang ditetapkan sebelumnya. Di sini yang benar dikatakan adalah: kemenangan tuning TIDAK TERBUKTI — bukan: tuning TIDAK BERGUNA.",
      },
    },
    {
      id: "signifikan-penting",
      eyebrow: "Langkah 7 · Signifikan vs penting",
      title: "Signifikan vs penting: p-value mengukur bukti, bukan ukuran efek",
      prose: [
        "Dua hasil McNemar tadi mengajarkan satu pasangan konsep yang harus selalu dibedakan: SIGNIFIKAN (apakah perbedaan ini nyata, bukan kebetulan?) dan PENTING (apakah perbedaan ini cukup besar untuk mengubah keputusan?). LR vs GBM: signifikan (p = 0,0003) DAN penting (selisih ROC-AUC 0,0397, selisih bersih 67 nasabah). GBM vs tertala: tidak signifikan (p = 0,5383) dan tidak penting (selisih ROC-AUC 0,0000 di test, 0,0018 di nested CV). Tapi ada kombinasi ketiga yang paling berbahaya: signifikan tapi TIDAK penting — dan kombinasi itu muncul begitu sampelmu besar.",
        "Nilai: bandingkan selisih dengan noise-nya, bukan hanya dengan nol. Di protokol adil (langkah 8), GBM tertala 0,7858 ± 0,0068 vs GBM default 0,7840 ± 0,0059: selisihnya 0,0018, sementara simpangan baku antar-fold-nya 0,0068 — selisih itu hanya sekitar seperempat dari satu simpangan baku (0,0018 / 0,0068 ≈ 0,26). Dengan kata lain, selisih antar modelnya jauh lebih kecil daripada variasi skor yang sama dari satu lipatan ke lipatan lain. Model yang «menang» 0,0018 hari ini bisa «kalah» besok hanya karena lipatannya berbeda — dan McNemar p = 0,5383 berkata persis itu.",
        "Baik atau buruk: p-value bagus sebagai PENJAGA GERBANG — ia mencegahmu mengklaim kemenangan dari noise (langkah 6). Buruk bila ia menjadi SATU-SATUNYA kriteria: dengan test 6.000 baris, selisih kecil bisa signifikan; dengan test 600.000 baris, selisih yang tidak berarti apa-apa secara bisnis pun akan signifikan. Sebaliknya, effect size tanpa uji signifikansi juga berbahaya — selisih 0,0397 (LR vs GBM) terlihat besar, tapi tanpa McNemar kamu tidak tahu apakah ia nyata.",
        "Mitigasi: laporkan selalu PASANGAN ini — (1) ukuran efek dengan satuannya («selisih ROC-AUC 0,0018, sekitar 0,26× sd antar-fold 0,0068») dan (2) uji signifikansinya («McNemar p = 0,5383»). Keputusan «pakai model mana» diambil dari pasangan itu bersama biaya dan kesederhanaan — bukan dari salah satunya saja. Aturan praktis di lesson ini: selisih yang jauh di bawah sd antar-fold (seperti 0,0018 vs 0,0068) diperlakukan sebagai «belum terbukti berbeda», apa pun ranking skornya.",
      ],
      formula: String.raw`\Delta = 0{,}7858 - 0{,}7840 = 0{,}0018 \ll \mathrm{sd} = 0{,}0068, \qquad \frac{\Delta}{\mathrm{sd}} \approx 0{,}26`,
      formulaNote: "Selisih nested-CV GBM tertala vs GBM default (0,0018) dibandingkan dengan simpangan baku antar-fold (0,0068): selisihnya hanya ~0,26× sd. Kemenangan sebesar ini berada di dalam noise lipatan — McNemar p = 0,5383 berkata hal yang sama dari sisi lain.",
      tasks: [],
      note: {
        title: "Miskonsepsi: skor tertinggi berarti menang — titik",
        type: "pitfall",
        body: "Yang benar: «skor tertinggi» adalah ranking; «menang signifikan» adalah klaim statistik; «penting» adalah penilaian bisnis. GBM tertala punya skor nested-CV tertinggi (0,7858) — itu ranking. McNemar p = 0,5383 berkata kemenangannya tidak signifikan — itu statistik. Selisih 0,0018 vs sd 0,0068 berkata kemenangannya tidak penting — itu bisnis. Ketiganya harus dibaca bersama; ranking saja tidak pernah cukup untuk mengklaim kemenangan.",
      },
    },
    {
      id: "protokol-adil",
      eyebrow: "Langkah 8 · Protokol perbandingan yang adil",
      title: "Protokol adil: nested CV, test terkunci, satu metrik utama",
      prose: [
        "Setelah semua jebakan di langkah 1–7, inilah protokol yang menghindarinya — tiga aturan yang, bila dilanggar satu saja, perbandinganmu tidak lagi adil. Aturan pertama: SELEKSI DI DALAM, EVALUASI DI LUAR (nested CV). Bila sebuah model butuh tuning, tuning itu dilakukan di dalam tiap outer fold, dan skor yang dilaporkan adalah skor di outer fold yang TIDAK PERNAH dipakai memilih. Di sini, nested CV 5-fold (inner 3-fold grid 18 konfigurasi) memberi GBM tertala 0,7858 ± 0,0068 — dan bukti bahwa seleksi itu sendiri tidak stabil: konfigurasi terbaik BERGANTI di tiap outer fold (misal fold 1 memilih max_iter 50, max_depth 5, learning_rate 0,10; fold 2 memilih max_iter 200, max_depth 3, learning_rate 0,05). Bila pemenang berganti tiap lipatan, «konfigurasi terbaik» adalah artefak lipatan, bukan sifat model.",
        "Nilai: tiga model dinilai dengan protokol yang sama [notebook] — LR tertala (nested CV) 0,7560 ± 0,0056 (outer fold: 0,7635; 0,7476; 0,7600; 0,7523; 0,7568); GBM default (tanpa tuning, 5-fold CV biasa sudah tak-bias karena tidak ada seleksi) 0,7840 ± 0,0059 (fold: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808); GBM tertala (nested CV) 0,7858 ± 0,0068 (outer fold: 0,7974; 0,7782; 0,7878; 0,7859; 0,7799). Perhatikan bahwa skor-skor ini TIDAK SAMA dengan skor test tunggal 6.000 baris (GBM 0,7823): nested CV memakai seluruh 30.000 baris dalam 5 lipatan, jadi ia mengukur sesuatu yang sedikit berbeda — performa rata-rata di berbagai lipatan, bukan performa di satu split.",
        "Aturan kedua: TEST TERKUNCI. Test set 6.000 baris dibuka SEKALI, di akhir, untuk keputusan final — dan tidak pernah dipakai untuk memilih model, memilih threshold, atau memilih konfigurasi. Begitu sebuah angka test memengaruhi satu keputusan, test itu bukan lagi test: ia adalah validasi kedua, dan skornya tercemar seleksi (langkah 12). Aturan ketiga: SATU METRIK UTAMA, ditetapkan sebelum pencarian. Di sini ROC-AUC — karena metrik itulah yang dipakai grid search untuk memilih, dan mengganti metrik sesudah melihat hasil (misal pindah ke PR-AUC karena di situ model favoritmu menang) adalah seleksi yang sama berbahayanya, hanya tersembunyi.",
        "Baik atau buruk: nested CV bagus karena ia adalah satu-satunya estimasi untuk model yang DI-TUNING yang tidak tercemar seleksi — 0,7858 adalah angka yang boleh kamu laporkan sebagai «performa GBM tertala». Buruk karena MAHAL: 5 outer fold × 18 konfigurasi × 3 inner fold = 270 fit GBM, ditambah nested LR — dan mahal bukan hanya komputasi, tapi juga waktu dan kesabaran. Dan nested CV tetap punya sd 0,0068 — ia jujur, bukan presisi: ia berkata «0,7858, tapi lipatan berikutnya bisa memberi 0,7799 atau 0,7974».",
        "Mitigasi: bila nested CV terlalu mahal, pakai jalan tengah yang jujur: SATU split train/validasi/test yang dipisah sejak awal — tuning hanya di validasi, test hanya dibuka sekali di akhir. Yang tidak boleh dilakukan dalam versi murah apa pun: memilih di test, lalu melaporkan skor test itu sebagai performa.",
      ],
      formula: String.raw`\bar{S}_{\mathrm{nested}} = \frac{1}{5} \sum_{f=1}^{5} S_f, \qquad S_f = \text{skor outer fold } f \text{ (seleksi hanya di inner fold)}`,
      formulaNote: "Estimasi nested CV: rata-rata skor 5 outer fold; di tiap outer fold, konfigurasi terbaik dipilih HANYA dari inner fold-nya. GBM tertala: (0,7974 + 0,7782 + 0,7878 + 0,7859 + 0,7799) / 5 = 0,7858, sd 0,0068 (sd populasi, ddof=0).",
      tasks: [],
    },
    {
      id: "single-vs-ensemble",
      eyebrow: "Langkah 9 · Single vs ensemble",
      title: "Single vs ensemble: kapan kompleksitas tambahan layak dibayar?",
      prose: [
        "Di M4.1 kamu sudah belajar random forest, bagging, boosting, stacking — di sini kita tidak mengulang materinya, hanya menempatkan ensemble sebagai OPSI seleksi. Sampai langkah 8, semua kandidatmu adalah single model: satu LR, satu GBM. Tapi seleksi tidak berhenti di situ: kamu selalu bisa bertanya «bagaimana kalau beberapa model digabung?» — dan pertanyaan itu harus dijawab dengan cara yang sama seperti semua pertanyaan seleksi di lesson ini: dengan protokol yang adil, bukan dengan firasat.",
        "Nilai: gambar di bawah menempatkan tiga kandidat kanonis pada frontier Pareto — performa (nested CV ROC-AUC) melawan kompleksitas (komputasi + operasional). LR tertala 0,7560 di ujung murah; GBM default 0,7840 di tengah; GBM tertala 0,7858 sedikit lebih mahal dan sedikit lebih baik. Ketiganya ada di frontier: tidak ada yang mendominasi yang lain, karena tiap kenaikan performa dibayar dengan kompleksitas. Ensemble TIDAK ADA di gambar sebagai titik — hanya sebagai zona bertanda tanya [ilustrasi]: tidak ada angka ensemble di file kanonis, jadi posisinya belum diukur dan tidak boleh diklaim. Perbandingan single vs ensemble harus dilakukan pada ENAM dimensi, semuanya kualitatif di sini: (1) ROC-AUC/PR-AUC — ensemble BISA memperbaiki ranking, tapi tidak ada jaminan; (2) calibration — rata-rata probabilitas sering memperbaiki kalibrasi, tapi harus diukur (GBM mentah saja sudah ECE 0,0073 — jangan asumsikan ensemble lebih baik); (3) cost — melatih dan menyimpan N model; (4) latency — N prediksi tiap scoring; (5) explainability — satu GBM saja sudah sulit dijelaskan, ensemble heterogen lebih sulit lagi; (6) operational complexity — versioning N artefak, monitoring drift per komponen, rollback yang melibatkan banyak model.",
        "Baik atau buruk: ensemble bagus bila ia menggeser frontier secara NYATA — peningkatan yang jauh di atas noise (bandingkan dengan sd antar-fold 0,0068 dan selisih 0,0018 yang tidak signifikan di langkah 7) dan stabil di lipatan yang berbeda. Buruk bila ia hanya menempel di frontier: «ensemble» yang menaikkan ROC-AUC sebesar 0,0002 sambil menggandakan biaya, latency, dan kerumitan operasional adalah kemunduran yang dibungkus sebagai kemajuan. Dan paling buruk bila ensemble dipakai sebagai jalan pintas untuk menghindari keputusan: «gabung saja semuanya» adalah penyerahan seleksi, bukan seleksi.",
        "Mitigasi: perlakukan ensemble sebagai SATU kandidat lagi — dengan nama, search space, dan protokol yang sama: nested CV, test terkunci, satu metrik utama, uji McNemar vs pesaing terdekat. Aturan keputusannya: ensemble hanya layak bila peningkatannya cukup besar DAN stabil untuk membayar kompleksitas tambahannya. Bila tidak, single model menang — bukan karena ensemble «buruk», melainkan karena harganya tidak terbayar. Di data ini, GBM tertala vs GBM default saja sudah tidak terbukti berbeda (langkah 6–7); menambahkan ensemble di atas selisih sekecil itu adalah membayar kompleksitas untuk noise.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Pareto frontier performa vs kompleksitas: LR tertala 0,7560 kompleksitas rendah; GBM default 0,7840; GBM tertala 0,7858; ensemble posisinya belum diukur, tanpa angka kanonis, ditandai ilustrasi">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Pareto frontier — performa vs kompleksitas (nested CV ROC-AUC)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,74</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,76</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,78</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,80</text>
<polyline points="110,159 240,77 320,72 395,58" fill="none" stroke="var(--chart-text)" stroke-width="1.5" stroke-dasharray="5 4"/>
<circle cx="110" cy="159" r="6" fill="var(--c1)"/>
<text x="110" y="180" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">LR tertala 0,7560</text>
<circle cx="240" cy="77" r="6" fill="var(--c2)"/>
<text x="240" y="62" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">GBM default 0,7840</text>
<circle cx="320" cy="72" r="6" fill="var(--c4)"/>
<text x="320" y="57" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">GBM tertala 0,7858</text>
<ellipse cx="425" cy="52" rx="38" ry="18" fill="none" stroke="var(--chart-text)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="425" y="56" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">ensemble?</text>
<text x="425" y="86" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">posisi belum diukur</text>
<text x="425" y="99" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">[ilustrasi]</text>
<text x="259" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">kompleksitas (komputasi + operasional) →</text>
</svg>`,
        alt: "Frontier Pareto: LR tertala 0,7560 (kompleksitas rendah), GBM default 0,7840, GBM tertala 0,7858 — ketiganya di frontier, tidak ada yang mendominasi. Ensemble hanya zona bertanda tanya: posisinya belum diukur, tanpa angka kanonis.",
        caption: "Cara membaca: sumbu tegak = nested CV ROC-AUC [notebook]; sumbu datar = kompleksitas (komputasi + operasional: berapa model dilatih, berapa prediksi per scoring, berapa artefak di-versioning). Ketiga titik kanonis membentuk frontier Pareto: tiap titik membeli performa lebih tinggi dengan kompleksitas lebih tinggi, dan tidak ada yang mendominasi yang lain. Zona ensemble (garis putus-putus) adalah PERTANYAAN, bukan jawaban — [ilustrasi]: tidak ada angka ensemble di file kanonis, jadi posisinya tidak diketahui dan tidak boleh digambar seolah sudah diukur. Ensemble hanya layak bila titiknya mendarat CUKUP JAUH di atas frontier single-model DAN stabil — bila hanya menempel di frontier (misal +0,0002, di dalam noise sd 0,0068), kompleksitas tambahannya tidak terbayar.",
      },
      tasks: [],
      quiz: [
        {
          q: "Apa yang TIDAK BOLEH kamu klaim tentang ensemble di lesson ini?",
          options: [
            { text: "Posisi ensemble di frontier Pareto — tidak ada angka ensemble di file kanonis, jadi posisinya belum diukur", why: "Benar: zona ensemble di gambar adalah [ilustrasi] — pertanyaan, bukan jawaban. Tanpa skor nested CV + uji signifikansi dengan protokol yang sama, tidak ada klaim posisi yang sah.", correct: true },
            { text: "Bahwa ensemble selalu lebih baik dari single model", why: "Itu juga tidak boleh diklaim — tapi bukan jawaban yang paling tepat: yang paling mendasar adalah posisi ensemble TIDAK DIKETAHUI, jadi «selalu lebih baik» maupun «selalu lebih buruk» sama-sama tanpa dasar." },
            { text: "Bahwa ensemble selalu lebih buruk dari single model", why: "Itu juga tidak boleh diklaim — tapi bukan jawaban yang paling tepat: yang paling mendasar adalah posisi ensemble TIDAK DIKETAHUI, jadi kedua klaim mutlak itu sama-sama tanpa dasar." },
            { text: "Bahwa GBM tertala 0,7858 adalah single model terbaik menurut nested CV", why: "Itu BOLEH diklaim — angka kanonis [notebook]: GBM tertala 0,7858 (sd antar-fold 0,0068) adalah pemenang ranking dalam protokol adil (langkah 8), dengan catatan keunggulannya atas default tidak signifikan." },
          ],
        },
        {
          q: "Misalkan [ilustrasi] sebuah ensemble menaikkan ROC-AUC dari 0,7858 menjadi 0,7860 (selisih 0,0002) dengan biaya komputasi 5× lipat. Keputusan yang benar?",
          options: [
            { text: "Tolak — selisih 0,0002 berada di dalam noise (sd antar-fold 0,0068) dan tidak membayar kompleksitas 5× lipat", why: "Benar: 0,0002 hanya ~0,03× sd 0,0068 — jauh di bawah selisih 0,0018 yang saja sudah tidak signifikan (langkah 7). Ensemble yang menempel di frontier sambil menggandakan biaya adalah kemunduran yang dibungkus kemajuan.", correct: true },
            { text: "Terima — setiap kenaikan ROC-AUC, sekecil apa pun, layak dibayar", why: "Salah: «setiap kenaikan» mengabaikan noise dan harga. Selisih 0,0002 tidak terbukti berbeda dari nol, dan harganya 5× komputasi + latency + kerumitan operasional." },
            { text: "Terima — ensemble menggabungkan banyak model, jadi pasti lebih stabil", why: "Salah: «pasti lebih stabil» adalah asumsi, bukan hasil ukur. Stabilitas harus dibuktikan di lipatan yang berbeda dengan protokol yang sama — dan di sini angkanya sendiri (0,0002) berada di dalam noise." },
            { text: "Tolak — ensemble dilarang dipakai di lesson ini", why: "Salah: ensemble tidak dilarang — ia hanya harus MEMBAYAR harganya dengan peningkatan yang cukup besar dan stabil. Larangan mutlak sama salahnya dengan penerimaan mutlak." },
          ],
        },
      ],
    },
    {
      id: "worked-example",
      eyebrow: "Langkah 10 · Worked example",
      title: "Putuskan pemenang yang jujur: GBM tertala — dengan catatan",
      prose: [
        "Sekarang satukan semuanya dan putuskan: dari tiga kandidat — LR tertala, GBM default, GBM tertala — siapa pemenangnya, dan apa yang boleh diklaim tentang kemenangan itu? Bekerja dengan angka kanonis, langkah demi langkah.",
        "Langkah A — ranking yang adil. Pakai skor nested CV (langkah 8), bukan skor test tunggal dan bukan skor CV pemenang: LR tertala 0,7560 ± 0,0056; GBM default 0,7840 ± 0,0059; GBM tertala 0,7858 ± 0,0068. Pemenang ranking: GBM tertala, 0,7858. LR tertinggal 0,0298 di belakang GBM tertala — selisih yang lebar, jauh di atas sd, dan konsisten dengan McNemar LR vs GBM (p = 0,0003, langkah 5): LR kalah secara meyakinkan.",
        "Langkah B — apakah kemenangan atas GBM default nyata? Selisihnya 0,7858 − 0,7840 = 0,0018, sementara sd antar-fold GBM tertala 0,0068. Rasio 0,26× sd. McNemar GBM vs tertala (langkah 6): p = 0,5383, tidak signifikan. Kesimpulan langkah B: kemenangan tuning atas default TIDAK TERBUKTI — bukan «tuning tidak berguna», melainkan «data ini tidak membuktikan tuning lebih baik». Keputusan memakai tertala atau default tidak boleh didasarkan pada klaim keunggulan; ia didasarkan pada hal lain (langkah C).",
        "Langkah C — putuskan dengan jujur. Pemenang yang jujur (nested CV): GBM tertala, 0,7858 ± 0,0068 — kalimat lengkapnya adalah: «GBM tertala adalah pemenang ranking dalam protokol yang adil, TETAPI keunggulannya atas GBM default (0,0018) berada di dalam noise (sd 0,0068) dan tidak signifikan (McNemar p = 0,5383); bila kesederhanaan, kecepatan, atau biaya dihitung, GBM default adalah pilihan yang sama sahnya.» Dan satu koreksi terakhir atas angka yang mungkin kamu laporkan: jangan laporkan 0,7865 (skor CV pemenang) sebagai performa — angka itu melebih-lebihkan sebesar 0,0042 (langkah 3); laporkan 0,7858 (nested CV) atau 0,7823 (test tunggal), dengan menjelaskan yang mana.",
        "Baik atau buruk: keputusan ini bagus karena ia memisahkan tiga pertanyaan yang biasanya dicampur: siapa ranking-1 (GBM tertala), apakah ia terbukti lebih baik (atas default: tidak), dan apa yang dilaporkan (0,7858 ± 0,0068, bukan 0,7865). Buruk bila kalimat «pemenang jujur GBM tertala» dibaca tanpa catatannya — tanpa «tetapi» di langkah C, kalimat itu menjadi klaim kemenangan tuning yang justru dibantah oleh McNemar.",
        "Mitigasi: biasakan menulis keputusan model dalam TIGA BARIS: (1) ranking + skor protokol adil; (2) uji signifikansi vs pesaing terdekat; (3) ukuran efek vs noise. Bila baris (2) dan (3) berkata «tidak terbukti», tuliskan itu — «tidak terbukti berbeda» adalah hasil yang sah, bukan kegagalan.",
      ],
      tasks: [],
    },
    {
      id: "finalisasi-model",
      eyebrow: "Langkah 11 · Finalisasi model",
      title: "Finalisasi model: dari pemenang ranking menjadi artefak yang bisa di-deploy",
      prose: [
        "Nilai: setelah protokol adil memilih prosedur (langkah 8) dan worked example memutuskan pemenang (langkah 10), masih ada satu langkah yang memisahkan «pemenang ranking» dari «model yang boleh di-deploy»: finalisasi. Finalisasi berarti tiga hal: (1) REFIT FINAL — latih ulang konfigurasi terpilih (max_iter 100, max_depth 5, learning_rate 0,05) pada SELURUH train 24.000 baris, karena model yang dievaluasi di nested CV adalah lima model lipatan yang berbeda, bukan satu artefak; artefak yang di-deploy adalah hasil refit ini, bukan salah satu model lipatan. (2) ARTEFAK + RECORD — simpan modelnya beserta selection record / model card: dataset version, seed, folds, search space, primary metric, konfigurasi terpilih, calibration method, threshold, dan skor final. Tanpa record, tidak ada yang bisa mengaudit keputusanmu enam bulan kemudian (M8). (3) ATURAN PROMOSI — tetapkan SEBELUM deploy kapan model baru menggantikan model lama: di sini, keunggulan GBM tertala atas GBM default (0,0018) tidak signifikan (McNemar p = 0,5383) dan tidak penting (0,26× sd) — jadi promosi tertala atas default tidak boleh beralasan «lebih baik»; alasan yang jujur adalah «setara, dan dipilih karena prosedurnya sudah tervalidasi» — atau tetap memakai default yang lebih sederhana.",
        "Tiga angka, tiga arti — dan record harus memuat ketiganya dengan label yang benar: skor CV 0,7865 adalah skor PEMILIHAN (3-fold, di train): ia bias ke atas karena pemenangnya dipilih justru karena skor ini tertinggi (langkah 3). Skor nested 0,7858 adalah ESTIMASI JUJUR performa prosedur tuning: seleksi di dalam, evaluasi di luar — inilah angka yang boleh dilaporkan sebagai «performa model». Skor test 0,7823 adalah SATU PENGUKURAN di test 6.000 baris — dan test itu sudah dipakai untuk analisis McNemar di lesson ini, jadi bacalah dengan kesadaran itu (langkah 12). Menukar ketiganya — misalnya melaporkan 0,7865 sebagai «performa» — adalah kesalahan yang sama persis dengan yang diperingatkan langkah 3, hanya terjadi di menit terakhir.",
        "Checklist deployment-readiness — semua harus tercentang sebelum model dipromosikan: (1) dataset version tercatat (di sini: UCI Default of Credit Card Clients, 30.000 baris, split 80/20 seed 42); (2) seed tercatat (42) — tanpanya, refit tidak bisa direplikasi; (3) folds tercatat (nested CV 5 outer × 3 inner); (4) search space tercatat (grid 18 konfigurasi GBM); (5) primary metric tercatat (ROC-AUC) — ditetapkan sebelum pencarian, bukan dipilih sesudahnya; (6) konfigurasi terpilih tercatat (max_iter 100, max_depth 5, learning_rate 0,05); (7) calibration method tercatat — termasuk bila «tidak diterapkan», karena «tidak dicatat» dan «tidak dilakukan» adalah dua hal yang berbeda; (8) threshold tercatat (di sini 0,50 — threshold klasifikasi untuk uji McNemar; threshold biaya-optimal 0,10 dari M6.4 adalah analisis biaya yang terpisah dan tidak boleh diam-diam menggantikannya); (9) skor final tercatat dengan labelnya — nested 0,7858 ± 0,0068 sebagai performa, CV 0,7865 dan test 0,7823 sebagai konteks.",
        "Baik atau buruk: finalisasi yang lengkap itu bagus karena ia mengubah keputusan dari «kata-kata» menjadi «artefak yang bisa diaudit» — siapa pun bisa memeriksa record-nya, melatih ulang dengan seed yang sama, dan mendapatkan model yang sama. Buruk bila finalisasi dilewati: model «terbaik» yang di-deploy tanpa record adalah kotak hitam (langkah 12, jebakan ketiga), dan skor 0,7865 yang dilaporkan sebagai performa adalah klaim yang sudah dibantah lesson ini sendiri. Mitigasi: isi selection record di lab di bawah — untuk GBM tertala, dengan tiga skor yang benar — dan jadikan template itu syarat promosi: tidak ada record, tidak ada deploy.",
        "Sekarang giliranmu mengisi selection record untuk GBM tertala. Record-nya sudah berisi metadata yang tetap (dataset version, seed 42, folds, search space, primary metric, konfigurasi terpilih, calibration method, threshold 0,50) — tugasmu mengisi TIGA SKOR dan menentukan mana yang boleh dilaporkan.",
        "Hasil yang diharapkan [lab]: skor CV 0,7865; skor nested 0,7858; skor test 0,7823; optimisme CV vs test 0,0042; skor yang boleh dilaporkan sebagai performa: 0,7858 (nested) — BUKAN 0,7865.",
        "Setelah lab jalan, periksa record-mu terhadap checklist di atas: adakah kolom yang kosong? Satu kolom kosong — misalnya calibration method yang tidak ditulis — berarti keputusan itu tidak tercatat, dan yang tidak tercatat tidak bisa diaudit.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi tiga skor: skor_cv (pemilihan), skor_nested (estimasi jujur), skor_test (satu pengukuran)" },
        { id: "t2", text: "Lengkapi optimisme: skor_cv - skor_test" },
        { id: "t3", text: "Lengkapi skor_lapor: skor yang BOLEH dilaporkan sebagai performa model" },
      ],
      expected: "skor CV (pemilihan): 0.7865\nskor nested (estimasi jujur): 0.7858\nskor test (satu pengukuran): 0.7823\noptimisme CV vs test: 0.0042\nskor yang boleh dilaporkan sebagai performa: 0.7858",
      hints: [
        "Tiga skor dari file kanonis [notebook]: CV 0,7865 (langkah 3), nested 0,7858 (langkah 8), test 0,7823 (langkah 3).",
        "Optimisme = skor CV − skor test = 0,7865 − 0,7823 = 0,0042 — sama seperti lab 2.",
        "Yang boleh dilaporkan sebagai performa adalah skor NESTED — estimasi jujur prosedur tuning. Skor CV bias ke atas (dipilih karena tertinggi); skor test hanya satu pengukuran, dan test-nya sudah dipakai untuk analisis McNemar.",
      ],
      code: {
        starter: `# Selection record / model card - GBM tertala [notebook]
# Konfigurasi terpilih: max_iter 100, max_depth 5, learning_rate 0,05
# Tiga skor mengukur hal BERBEDA - jangan tertukar:
#   skor CV 0,7865     = skor validasi 3-fold saat PEMILIHAN (bias ke atas: pemenang dipilih karena skor ini tertinggi)
#   skor nested 0,7858 = estimasi JUJUR performa prosedur tuning (seleksi di dalam, evaluasi di luar)
#   skor test 0,7823   = SATU pengukuran di test 6.000 baris (test sudah dipakai untuk analisis McNemar - baca dengan kesadaran itu)

RECORD = {
    "dataset_version": "uci-default-credit-v1",
    "seed": 42,
    "folds": "nested CV 5 outer x 3 inner",
    "search_space": "grid 18 konfigurasi GBM",
    "primary_metric": "ROC-AUC",
    "config_terpilih": {"max_iter": 100, "max_depth": 5, "learning_rate": 0.05},
    "calibration_method": "tidak diterapkan (skor mentah)",
    "threshold": 0.50,
}

skor_cv = 0.0       # TODO t1: skor CV konfigurasi terpilih (pemilihan, 3-fold)
skor_nested = 0.0   # TODO t1: skor nested CV GBM tertala (estimasi jujur)
skor_test = 0.0     # TODO t1: skor test konfigurasi terpilih (satu pengukuran, 6.000 baris)

optimisme = 0.0     # TODO t2: skor_cv - skor_test

skor_lapor = 0.0    # TODO t3: skor yang BOLEH dilaporkan sebagai performa model
print(f"skor CV (pemilihan): {skor_cv:.4f}")
print(f"skor nested (estimasi jujur): {skor_nested:.4f}")
print(f"skor test (satu pengukuran): {skor_test:.4f}")
print(f"optimisme CV vs test: {optimisme:.4f}")
print(f"skor yang boleh dilaporkan sebagai performa: {skor_lapor:.4f}")`,
        lockLines: 18,
        solution: `# Selection record / model card - GBM tertala [notebook]
# Konfigurasi terpilih: max_iter 100, max_depth 5, learning_rate 0,05
# Tiga skor mengukur hal BERBEDA - jangan tertukar:
#   skor CV 0,7865     = skor validasi 3-fold saat PEMILIHAN (bias ke atas: pemenang dipilih karena skor ini tertinggi)
#   skor nested 0,7858 = estimasi JUJUR performa prosedur tuning (seleksi di dalam, evaluasi di luar)
#   skor test 0,7823   = SATU pengukuran di test 6.000 baris (test sudah dipakai untuk analisis McNemar - baca dengan kesadaran itu)

RECORD = {
    "dataset_version": "uci-default-credit-v1",
    "seed": 42,
    "folds": "nested CV 5 outer x 3 inner",
    "search_space": "grid 18 konfigurasi GBM",
    "primary_metric": "ROC-AUC",
    "config_terpilih": {"max_iter": 100, "max_depth": 5, "learning_rate": 0.05},
    "calibration_method": "tidak diterapkan (skor mentah)",
    "threshold": 0.50,
}

skor_cv = 0.7865
skor_nested = 0.7858
skor_test = 0.7823

optimisme = skor_cv - skor_test

skor_lapor = skor_nested
print(f"skor CV (pemilihan): {skor_cv:.4f}")
print(f"skor nested (estimasi jujur): {skor_nested:.4f}")
print(f"skor test (satu pengukuran): {skor_test:.4f}")
print(f"optimisme CV vs test: {optimisme:.4f}")
print(f"skor yang boleh dilaporkan sebagai performa: {skor_lapor:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor_cv", value: 0.7865, tol: 0.00005, label: "`skor_cv` seharusnya 0.7865", msg: "Skor CV konfigurasi terpilih (pemilihan, 3-fold): 0,7865 [notebook]." },
          { kind: "equal", task: "t1", name: "skor_nested", value: 0.7858, tol: 0.00005, label: "`skor_nested` seharusnya 0.7858", msg: "Skor nested CV GBM tertala (estimasi jujur): 0,7858 [notebook]." },
          { kind: "equal", task: "t1", name: "skor_test", value: 0.7823, tol: 0.00005, label: "`skor_test` seharusnya 0.7823", msg: "Skor test konfigurasi terpilih (satu pengukuran, 6.000 baris): 0,7823 [notebook]." },
          { kind: "stdout_matches", task: "t1", pattern: "skor nested \\(estimasi jujur\\): 0\\.7858", label: "Output menampilkan skor nested 0,7858", msg: "Skor nested 0,7858 — estimasi jujur prosedur tuning." },
          { kind: "equal", task: "t2", name: "optimisme", value: 0.0042, tol: 0.00005, label: "`optimisme` seharusnya 0.0042", msg: "Optimisme = 0,7865 − 0,7823 = 0,0042." },
          { kind: "stdout_matches", task: "t2", pattern: "optimisme CV vs test: 0\\.0042", label: "Output menampilkan optimisme 0,0042", msg: "Optimisme CV vs test: 0,0042 — sama seperti lab 2." },
          { kind: "stdout_matches", task: "t3", pattern: "skor yang boleh dilaporkan sebagai performa: 0\\.7858", label: "Output menampilkan skor lapor 0,7858 (nested)", msg: "Yang boleh dilaporkan sebagai performa adalah skor NESTED 0,7858 — bukan CV 0,7865." },
        ],
      },
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 12 · Jebakan",
      title: "Tiga jebakan: leaderboard-chasing, test peeking, AutoML sebagai kotak hitam",
      prose: [
        "Jebakan pertama — leaderboard-chasing. Begitu ada leaderboard (skor CV 18 konfigurasi, atau papan peringkat kompetisi), godaan terbesar adalah mengoptimasi leaderboard itu sendiri: menambah kandidat sampai satu «menang», menyetel seed sampai skor naik, mencoba metrik lain sampai model favoritmu di atas. Setiap putaran itu adalah seleksi atas noise (langkah 4) — dan winner's curse tumbuh bersama jumlah putaran. Tanda bahayanya: skor validasi naik terus sementara skor test tidak bergerak. Di data ini, random search 27 konfigurasi hanya menaikkan CV terbaik dari 0,7865 ke 0,7866 (+0,0001) — leaderboard «membaik» tanpa model yang membaik. Mitigasinya: tetapkan JUMLAH kandidat dan metrik sebelum mulai, dan berhenti bila tambahan kandidat hanya menggerakkan skor di bawah sd.",
        "Jebakan pertama punya saudara yang lebih licin: leaderboard-chasing LINTAS SESI. Di dalam satu sesi, kamu masih bisa menghitung kandidatmu — 18 konfigurasi (langkah 1). Tapi bila minggu lalu kamu mencoba grid 18 (terbaik CV 0,7865), kemarin random search 27 (terbaik 0,7866), hari ini shrinking random 9 (terbaik 0,7869, seed 43) — dan tiap kali kamu mengecek skor test yang sama untuk memutuskan «lanjut atau berhenti» — maka laporan akhirmu bukan lagi «satu pencarian, 18 kandidat», melainkan «tiga sesi, 54 konfigurasi, 1 yang dilaporkan». Jumlah percobaan EFEKTIF — berapa kali kamu sebenarnya mencoba sebelum menemukan yang «terbaik» — jauh lebih besar dari yang tertulis di laporan, dan konsepnya kualitatif [ilustrasi]: tidak ada rumus tunggal yang mengubah «54 percobaan» menjadi satu angka koreksi, tapi arahnya pasti — winner's curse tumbuh bersama jumlah percobaan (langkah 4), dan test yang dipakai berulang kali untuk menilai tiap sesi ikut terintip berulang kali (jebakan kedua di bawah). Penawarnya bukan larangan bereksperimen — melainkan registry: setiap run dicatat (seed, search space, metrik, keputusan), TERMASUK yang gagal, sehingga siapa pun bisa menghitung sendiri berapa kali kamu mencoba. Gambar di bawah merangkai tiga sesi kanonis itu menjadi satu timeline — plus satu sesi gagal [ilustrasi] yang dalam laporan biasa akan hilang tanpa jejak.",
        "Jebakan kedua — test peeking. Test set 6.000 baris di sini sudah dipakai berkali-kali di lesson ini: memilih konfigurasi terbaik-menurut-test, membandingkan LR vs GBM, menguji McNemar. Setiap pemakaian itu sah SEBAGAI ANALISIS — tapi begitu satu keputusan (model mana yang dipakai) didasarkan pada skor test, test itu kehilangan statusnya sebagai pengukur yang tak-bias. Contoh konkret dari data ini: konfigurasi terbaik-menurut-test adalah (max_iter 100, max_depth 5, learning_rate 0,05) dengan 0,7823 — sama dengan juara CV, jadi di sini peeking tidak mengubah pilihan. Tapi itu kebetulan yang beruntung, bukan jaminan: di 18 konfigurasi, empat berbagi skor test 0,7823, dan memilih di antaranya berdasarkan test adalah memilih berdasarkan noise test. Mitigasinya: test dibuka sekali, di akhir, untuk SATU keputusan final — dan bila kamu sudah mengintip, katakan itu di laporan («test sudah dipakai untuk analisis; skor test bukan estimasi tak-bias»).",
        "Jebakan ketiga — AutoML sebagai kotak hitam. AutoML yang mengembalikan «model terbaik + skor 0,7865» tanpa jejak (konfigurasi apa yang dicoba? metrik apa? berapa kandidat? berapa kali test diintip?) adalah laporan yang tidak bisa diaudit — dan yang tidak bisa diaudit tidak bisa dipercaya. Di produksi, kotak hitam ini berubah menjadi risiko model (M8): model yang «menang» di leaderboard tapi gagal di data baru, tanpa ada yang tahu mengapa. Mitigasinya: simpan JEJAK seleksi — daftar kandidat, skor tiap kandidat, protokol evaluasi, dan uji signifikansi — persis seperti yang dilakukan notebook lesson ini (semua 18 konfigurasi + optimisme + kedua McNemar + nested CV). Jejak itu adalah bukti kejujuranmu.",
        "Baik atau buruk: mengenali ketiga jebakan ini bagus — sebagian besar «model terbaik» yang gagal di produksi adalah salah satu dari ketiganya, bukan modelnya yang rusak. Buruk bila kamu mengira jebakan ini hanya menimpa orang lain: di lesson ini saja, test set sudah diintip berkali-kali, dan satu-satunya yang menyelamatkan kesimpulan adalah nested CV (langkah 8) yang tidak memakai test sama sekali.",
        "Mitigasi (ringkas): (1) tetapkan kandidat dan metrik sebelum mulai, berhenti bila gerakannya di bawah sd; (2) test dibuka sekali di akhir — bila sudah diintip, laporkan itu; (3) simpan jejak seleksi lengkap, dan laporkan optimisme + uji signifikansi bersama skornya.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Timeline experiment registry lintas sesi: S1 grid 18 seed 42 terbaik CV 0,7865; S2 random 27 seed 7 ilustrasi terbaik 0,7866; S3 shrinking 9 seed 43 terbaik 0,7869 dan dilaporkan; S4 grid 18 seed 123 ilustrasi gagal karena kebocoran target, tetap dicatat">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Experiment registry lintas sesi — 54 percobaan, 1 yang dilaporkan</text>
<line x1="40" y1="130" x2="460" y2="130" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="460,130 450,125 450,135" fill="var(--chart-text)"/>
<circle cx="90" cy="130" r="6" fill="var(--c1)"/>
<text x="90" y="52" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">S1 · grid 18</text>
<text x="90" y="66" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">seed 42 · ROC-AUC</text>
<text x="90" y="152" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">terbaik CV 0,7865</text>
<circle cx="195" cy="130" r="6" fill="var(--c1)"/>
<text x="195" y="52" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">S2 · random 27</text>
<text x="195" y="66" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">seed 7 [ilustrasi] · ROC-AUC</text>
<text x="195" y="152" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">terbaik CV 0,7866</text>
<circle cx="300" cy="130" r="6" fill="var(--c2)"/>
<text x="300" y="52" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">S3 · shrinking 9</text>
<text x="300" y="66" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">seed 43 · ROC-AUC</text>
<text x="300" y="152" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">terbaik CV 0,7869 ★</text>
<text x="300" y="166" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">yang dilaporkan</text>
<circle cx="405" cy="130" r="6" fill="none" stroke="var(--c4)" stroke-width="2"/>
<line x1="401" y1="126" x2="409" y2="134" stroke="var(--c4)" stroke-width="2"/>
<line x1="409" y1="126" x2="401" y2="134" stroke="var(--c4)" stroke-width="2"/>
<text x="405" y="52" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">S4 · grid 18</text>
<text x="405" y="66" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">seed 123 [ilustrasi]</text>
<text x="405" y="152" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">GAGAL — kebocoran target</text>
<text x="405" y="166" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">tetap dicatat</text>
<text x="240" y="198" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">54 konfigurasi dicoba (18+27+9), hanya 1 dilaporkan — «effective attempts» kualitatif [ilustrasi]</text>
<text x="240" y="214" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Registry lengkap di lab audit (langkah 13) — skor kanonis [notebook], sesi gagal [ilustrasi].</text>
</svg>`,
        alt: "Timeline empat sesi eksperimen: S1 grid 18 (0,7865), S2 random 27 (0,7866), S3 shrinking 9 (0,7869, yang dilaporkan), S4 gagal karena kebocoran target tapi tetap dicatat. Total 54 konfigurasi dicoba, hanya 1 yang dilaporkan.",
        caption: "Cara membaca: tiap titik = satu sesi eksperimen dengan seed, search space, dan metriknya. Tiga sesi pertama memakai skor kanonis [notebook] — grid 18 → 0,7865; random 27 → 0,7866; shrinking random 9 (seed 43) → 0,7869. Sesi keempat (GAGAL — kebocoran target) dan seed sesi 2 dan 4 adalah [ilustrasi]. Yang dilaporkan dalam laporan biasa hanyalah S3 (★) — 53 percobaan lain dan 1 run gagal menghilang. «Effective number of attempts» adalah konsep KUALITATIF [ilustrasi]: tidak ada rumus tunggal yang mengubah «54 percobaan» menjadi satu angka koreksi — tapi arahnya pasti: makin banyak percobaan yang disembunyikan, makin besar winner's curse atas skor yang dilaporkan, dan makin sering test yang sama dipakai untuk menilai tiap sesi.",
      },
      tasks: [],
      note: {
        title: "Jebakan: test set yang sudah diintip masih disebut «test»",
        type: "pitfall",
        body: "Yang benar: begitu skor test memengaruhi satu keputusan — model mana, threshold berapa, konfigurasi apa — test itu menjadi bagian dari proses seleksi, dan skornya tercemar winner's curse seperti skor validasi. Di lesson ini, test 6.000 baris dipakai untuk analisis McNemar dan perbandingan — sah sebagai analisis, tapi skor test 0,7823 yang dilaporkan di sampingnya harus dibaca dengan kesadaran itu. Estimasi yang TIDAK memakai test sama sekali hanyalah nested CV (0,7858, sd antar-fold 0,0068).",
      },
    },
    {
      id: "audit-eksperimen",
      eyebrow: "Langkah 13 · Lab — audit registry",
      title: "Lab: audit experiment registry lintas sesi",
      prose: [
        "Sekarang giliranmu mengaudit registry. Datanya merangkai tiga sesi kanonis [notebook] — grid 18 (terbaik CV 0,7865), random 27 (terbaik 0,7866), shrinking random 9 seed 43 (terbaik 0,7869) — ditambah satu sesi gagal [ilustrasi]. Setiap run tercatat, TERMASUK yang gagal: sesi, seed, search space, metrik, jumlah konfigurasi, skor CV terbaik, dan status. Seed sesi 2 dan sesi 4 adalah [ilustrasi] — yang kanonis hanya skor terbaik tiap sesi. Tugasmu: hitung berapa konfigurasi yang sebenarnya dicoba, berapa run gagal yang tetap tercatat, dan putuskan apakah laporan yang hanya menampilkan run terbaik masih valid.",
        "Hasil yang diharapkan [lab]: total konfigurasi dicoba (3 sesi selesai) = 54; run gagal yang tetap tercatat = 1; skor terbaik yang dilaporkan = 0,7869; laporan valid: False — hanya run terbaik dari 54 percobaan yang dilaporkan, dan test yang sama dipakai berulang kali untuk menilai tiap sesi. Yang dilaporkan harus seluruh registry, bukan hanya run terbaik.",
        "Setelah lab jalan, tulis sendiri seperti apa laporan yang VALID untuk registry ini: «54 konfigurasi dicoba dalam 3 sesi (grid 18, random 27, shrinking 9) + 1 run gagal karena kebocoran target; skor CV terbaik lintas sesi 0,7869 (S3); test 6.000 baris dipakai untuk menilai tiap sesi, jadi skor itu bukan estimasi tak-bias.» Bandingkan panjang kalimat itu dengan «model terbaik: 0,7869» — selisih panjangnya adalah selisih kejujurannya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi total_percobaan (sesi selesai saja) dan skor_terbaik_dilaporkan (maks skor CV lintas sesi)" },
        { id: "t2", text: "Lengkapi n_run_gagal: berapa run gagal yang tetap tercatat di registry" },
        { id: "t3", text: "Tentukan laporan_valid: True/False — laporan yang hanya menampilkan run terbaik dari 54 percobaan" },
      ],
      expected: "total konfigurasi dicoba (3 sesi selesai): 54\nrun gagal yang tetap tercatat: 1\nskor terbaik yang dilaporkan: 0.7869\nlaporan valid: False\nkesimpulan: TIDAK VALID - hanya run terbaik dari 54 percobaan yang dilaporkan; test yang sama dipakai berulang kali untuk menilai tiap sesi",
      hints: [
        "Total percobaan = 18 + 27 + 9 = 54 — sesi S4 GAGAL, jadi konfigurasinya tidak dihitung sebagai percobaan selesai, tapi run-nya TETAP dicatat.",
        "Skor terbaik lintas sesi = max(0,7865; 0,7866; 0,7869) = 0,7869 — dari S3, shrinking random (seed 43).",
        "Laporan hanya menampilkan 1 dari 54 percobaan + menyembunyikan 1 run gagal — dan test yang sama dipakai berulang kali untuk menilai tiap sesi. Itu TIDAK VALID: yang dilaporkan harus seluruh registry, bukan hanya run terbaik.",
      ],
      code: {
        starter: `# Experiment registry lintas sesi [ilustrasi: registry dirangkai dari 3 sesi kanonis + 1 sesi gagal]
# Setiap run dicatat, TERMASUK yang gagal. Skor terbaik lintas sesi TIDAK BOLEH dilaporkan sendirian.
# (sesi, seed, search_space, metrik, n_konfigurasi, skor_cv_terbaik, status)
# Skor kanonis: grid 18 -> 0,7865 ; random 27 -> 0,7866 ; shrinking random 9 (seed 43) -> 0,7869
# Seed sesi 2 dan sesi 4 [ilustrasi] - yang kanonis hanya skor terbaik tiap sesi.
RUNS = [
    ("S1", 42, "grid 18 GBM", "ROC-AUC", 18, 0.7865, "selesai"),
    ("S2", 7, "random 27 GBM", "ROC-AUC", 27, 0.7866, "selesai"),
    ("S3", 43, "shrinking random 9 GBM", "ROC-AUC", 9, 0.7869, "selesai"),
    ("S4", 123, "grid 18 GBM", "ROC-AUC", 18, None, "gagal - kebocoran target"),
]

total_percobaan = 0  # TODO t1: jumlah konfigurasi yang dicoba di sesi yang SELESAI
n_run_gagal = 0  # TODO t2: berapa run gagal yang tetap tercatat di registry
skor_terbaik_dilaporkan = 0.0  # TODO t1: skor CV terbaik lintas sesi yang selesai
laporan_valid = True  # TODO t3: True/False - laporan yang hanya menampilkan run terbaik, validkah?
print(f"total konfigurasi dicoba (3 sesi selesai): {total_percobaan}")
print(f"run gagal yang tetap tercatat: {n_run_gagal}")
print(f"skor terbaik yang dilaporkan: {skor_terbaik_dilaporkan:.4f}")
print(f"laporan valid: {laporan_valid}")
print("kesimpulan: TIDAK VALID - hanya run terbaik dari 54 percobaan yang dilaporkan; test yang sama dipakai berulang kali untuk menilai tiap sesi" if not laporan_valid else "kesimpulan: laporan valid")`,
        lockLines: 12,
        solution: `# Experiment registry lintas sesi [ilustrasi: registry dirangkai dari 3 sesi kanonis + 1 sesi gagal]
# Setiap run dicatat, TERMASUK yang gagal. Skor terbaik lintas sesi TIDAK BOLEH dilaporkan sendirian.
# (sesi, seed, search_space, metrik, n_konfigurasi, skor_cv_terbaik, status)
# Skor kanonis: grid 18 -> 0,7865 ; random 27 -> 0,7866 ; shrinking random 9 (seed 43) -> 0,7869
# Seed sesi 2 dan sesi 4 [ilustrasi] - yang kanonis hanya skor terbaik tiap sesi.
RUNS = [
    ("S1", 42, "grid 18 GBM", "ROC-AUC", 18, 0.7865, "selesai"),
    ("S2", 7, "random 27 GBM", "ROC-AUC", 27, 0.7866, "selesai"),
    ("S3", 43, "shrinking random 9 GBM", "ROC-AUC", 9, 0.7869, "selesai"),
    ("S4", 123, "grid 18 GBM", "ROC-AUC", 18, None, "gagal - kebocoran target"),
]

total_percobaan = sum(r[4] for r in RUNS if r[6] == "selesai")
n_run_gagal = sum(1 for r in RUNS if r[6].startswith("gagal"))
skor_terbaik_dilaporkan = max(r[5] for r in RUNS if r[5] is not None)
laporan_valid = False
print(f"total konfigurasi dicoba (3 sesi selesai): {total_percobaan}")
print(f"run gagal yang tetap tercatat: {n_run_gagal}")
print(f"skor terbaik yang dilaporkan: {skor_terbaik_dilaporkan:.4f}")
print(f"laporan valid: {laporan_valid}")
print("kesimpulan: TIDAK VALID - hanya run terbaik dari 54 percobaan yang dilaporkan; test yang sama dipakai berulang kali untuk menilai tiap sesi" if not laporan_valid else "kesimpulan: laporan valid")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_percobaan", value: 54, label: "`total_percobaan` seharusnya 54", msg: "Total percobaan sesi selesai: 18 + 27 + 9 = 54 — sesi gagal tidak dihitung sebagai percobaan selesai." },
          { kind: "equal", task: "t1", name: "skor_terbaik_dilaporkan", value: 0.7869, tol: 0.00005, label: "`skor_terbaik_dilaporkan` seharusnya 0.7869", msg: "Skor CV terbaik lintas sesi: max(0,7865; 0,7866; 0,7869) = 0,7869 (S3)." },
          { kind: "equal", task: "t2", name: "n_run_gagal", value: 1, label: "`n_run_gagal` seharusnya 1", msg: "Satu run gagal (S4, kebocoran target) — dan ia TETAP tercatat di registry." },
          { kind: "stdout_matches", task: "t3", pattern: "laporan valid: False", label: "Output menampilkan laporan valid: False", msg: "Laporan yang hanya menampilkan run terbaik dari 54 percobaan TIDAK VALID." },
          { kind: "stdout_matches", task: "t3", pattern: "kesimpulan: TIDAK VALID", label: "Output menampilkan kesimpulan TIDAK VALID", msg: "Alasannya: jumlah percobaan disembunyikan dan test yang sama dipakai berulang kali untuk menilai tiap sesi." },
        ],
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 14 · Lab 1",
      title: "Lab: uji McNemar manual — LR vs GBM",
      prose: [
        "Sekarang giliranmu menghitung McNemar dengan tangan. Datanya dari test 6.000 baris, threshold 0,5 [notebook]: b = 132 (LR benar, GBM salah), c = 199 (LR salah, GBM benar). Rumusnya dengan koreksi kontinuitas: χ² = (|b − c| − 1)² / (b + c). Nilai kritis χ² (df = 1, α = 0,05) adalah 3,8415.",
        "Hasil yang diharapkan [lab]: χ² = 13,1601; karena 13,1601 > 3,8415, putusannya signifikan — GBM menang signifikan atas LR, konsisten dengan p-value kanonis (metode chi2) 0,0003 [notebook]. Perhatikan: di lab ini kamu TIDAK menghitung p-value — bukan karena tidak bisa (untuk df=1, p-value punya bentuk tertutup p = erfc(√(χ²/2)) ≈ 0,0003, tersedia di modul math stdlib) — melainkan agar fokus pada perbandingan χ² dengan nilai kritis 3,8415; p-value 0,0003 dikutip dari file kanonis sebagai cek silang.",
        "Setelah lab jalan, ubah-ubah b dan c sendiri: coba b = 36, c = 30 (GBM vs tertala, langkah 6) — χ² berapa, dan apa putusannya? (Petunjuk: (|36 − 30| − 1)² / 66 = 0,3788 — jauh di bawah 3,8415.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi chi2: (|B - C| - 1)^2 / (B + C) — koreksi kontinuitas" },
        { id: "t2", text: "Lengkapi signifikan: True bila chi2 > CHI2_KRITIS (3,8415)" },
        { id: "t3", text: "Jalankan dan baca kesimpulan: bandingkan dengan p-value kanonis 0,0003 (metode chi2)" },
      ],
      expected: "chi2: 13.1601\nsignifikan: True\nkesimpulan: GBM menang signifikan atas LR (p=0.0003)",
      hints: [
        "Koreksi kontinuitas: kurangi 1 dari |b - c| SEBELUM dikuadratkan — (|132 - 199| - 1)^2 = 66^2 = 4356.",
        "Penyebutnya adalah jumlah pasangan discordant: b + c = 132 + 199 = 331.",
        "Bandingkan chi2 dengan 3,8415 (nilai kritis df=1, alpha=0,05) — bukan dengan 0,05; 0,05 adalah ambang p-value, bukan ambang chi2.",
      ],
      code: {
        starter: `# McNemar manual: LR vs GBM pada test 6.000 baris, threshold 0,5 [notebook]
# b = LR benar & GBM salah = 132 ; c = LR salah & GBM benar = 199
# Rumus dengan koreksi kontinuitas: chi2 = (|b - c| - 1)^2 / (b + c)
# Nilai kritis chi2 (df=1, alpha=0,05) = 3,8415 ; p-value kanonis (metode chi2) = 0,0003
B = 132
C = 199
CHI2_KRITIS = 3.8415

chi2 = 0.0  # TODO: hitung chi2 McNemar dengan koreksi kontinuitas
signifikan = False  # TODO: True bila chi2 > CHI2_KRITIS
print(f"chi2: {chi2:.4f}")
print(f"signifikan: {signifikan}")
print("kesimpulan: GBM menang signifikan atas LR (p=0.0003)" if signifikan else "kesimpulan: perbedaan tidak signifikan")`,
        lockLines: 8,
        solution: `# McNemar manual: LR vs GBM pada test 6.000 baris, threshold 0,5 [notebook]
# b = LR benar & GBM salah = 132 ; c = LR salah & GBM benar = 199
# Rumus dengan koreksi kontinuitas: chi2 = (|b - c| - 1)^2 / (b + c)
# Nilai kritis chi2 (df=1, alpha=0,05) = 3,8415 ; p-value kanonis (metode chi2) = 0,0003
B = 132
C = 199
CHI2_KRITIS = 3.8415

chi2 = (abs(B - C) - 1) ** 2 / (B + C)
signifikan = chi2 > CHI2_KRITIS
print(f"chi2: {chi2:.4f}")
print(f"signifikan: {signifikan}")
print("kesimpulan: GBM menang signifikan atas LR (p=0.0003)" if signifikan else "kesimpulan: perbedaan tidak signifikan")`,
        checks: [
          { kind: "equal", task: "t1", name: "chi2", value: 13.1601, tol: 0.00005, label: "`chi2` seharusnya 13.1601", msg: "McNemar LR vs GBM: (|132 − 199| − 1)² / 331 = 66² / 331 = 13,1601." },
          { kind: "stdout_matches", task: "t1", pattern: "chi2: 13\\.1601", label: "Output menampilkan chi2 13,1601", msg: "χ² = 13,1601 — jauh di atas nilai kritis 3,8415." },
          { kind: "stdout_matches", task: "t2", pattern: "signifikan: True", label: "Output menampilkan signifikan: True", msg: "13,1601 > 3,8415 — tolak H₀ pada α = 0,05." },
          { kind: "stdout_matches", task: "t3", pattern: "kesimpulan: GBM menang signifikan atas LR \\(p=0\\.0003\\)", label: "Output menampilkan kesimpulan GBM menang signifikan (p=0,0003)", msg: "Konsisten dengan p-value kanonis (metode chi2) 0,0003 — GBM menang signifikan atas LR." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 15 · Lab 2",
      title: "Lab: winner's curse dari 18 konfigurasi kanonis",
      prose: [
        "Lab kedua memakai SEMUA 18 konfigurasi GBM dari file kanonis [notebook] — skor CV (3-fold, train) dan skor test (6.000 baris) tiap konfigurasi sudah diberikan sebagai data. Tugasmu: hitung optimisme tiap konfigurasi (CV − test), rata-ratanya, dan tentukan «pemenang yang jujur» menurut skor test.",
        "Hasil yang diharapkan [lab]: optimisme konfigurasi CV-terbaik (K1) = 0,0042; optimisme rata-rata 18 konfigurasi = 0,0042; pemenang jujur (skor test tertinggi) = K1 = 0,7823 — dan empat konfigurasi seri di skor test tertinggi itu (K1, K15, K16, K17). Perhatikan pelajarannya: di data ini sang juara CV KEBETULAN juga berbagi skor test tertinggi — tapi skor CV-nya (0,7865) tetap melebih-lebihkan sebesar 0,0042, dan «pemenang tunggal» ternyata seri empat arah. Memilih di antara keempatnya berdasarkan test adalah memilih berdasarkan noise test (langkah 12).",
        "Setelah lab jalan, bandingkan dengan protokol adil (langkah 8): pemenang jujur menurut nested CV adalah GBM tertala 0,7858 ± 0,0068 — BUKAN menurut skor test tunggal. Lab ini menunjukkan optimisme; langkah 8 menunjukkan penawarnya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi optimisme: tiap konfigurasi, CV - test; lalu optimisme konfigurasi CV-terbaik" },
        { id: "t2", text: "Lengkapi rata_optimisme: rata-rata optimisme ke-18 konfigurasi" },
        { id: "t3", text: "Lengkapi pemenang_jujur (skor test tertinggi) dan n_seri (berapa konfigurasi yang seri di skor itu)" },
      ],
      expected: "optimisme konfigurasi CV-terbaik (K1  it100 d5 lr0.05): 0.0042\noptimisme rata-rata: 0.0042\npemenang jujur (skor test tertinggi): K1  it100 d5 lr0.05 = 0.7823\nkonfigurasi yang seri di skor test tertinggi: 4",
      hints: [
        "Optimisme satu konfigurasi = cv - test; untuk K1: 0,7865 - 0,7823 = 0,0042.",
        "Rata-rata = jumlah semua optimisme dibagi 18 — jangan rata-ratakan skor CV dan skor test dulu lalu dikurangkan (hasilnya sama di sini, tapi optimisme per konfigurasi yang diminta).",
        "Pemenang jujur = max() dengan kunci skor test (elemen ke-2 tiap baris); n_seri = hitung berapa baris yang skor test-nya sama dengan skor test pemenang.",
      ],
      code: {
        starter: `# Winner's curse: 18 konfigurasi GBM — skor CV (3-fold, train) vs skor test [notebook]
# Tiap baris: (nama, cv_roc_auc, test_roc_auc). d = max_depth (d- = tanpa batas)
KONFIG = [
    ("K1  it100 d5 lr0.05", 0.7865, 0.7823),
    ("K2  it200 d3 lr0.05", 0.7864, 0.7816),
    ("K3  it200 d5 lr0.05", 0.7864, 0.7820),
    ("K4  it100 d3 lr0.10", 0.7862, 0.7802),
    ("K5  it200 d3 lr0.10", 0.7862, 0.7799),
    ("K6  it50  d3 lr0.10", 0.7856, 0.7795),
    ("K7  it50  d5 lr0.05", 0.7855, 0.7804),
    ("K8  it100 d3 lr0.05", 0.7854, 0.7807),
    ("K9  it50  d5 lr0.10", 0.7853, 0.7814),
    ("K10 it100 d5 lr0.10", 0.7851, 0.7817),
    ("K11 it200 d5 lr0.10", 0.7851, 0.7817),
    ("K12 it100 d- lr0.05", 0.7845, 0.7806),
    ("K13 it200 d- lr0.05", 0.7845, 0.7812),
    ("K14 it50  d- lr0.05", 0.7842, 0.7790),
    ("K15 it50  d- lr0.10", 0.7838, 0.7823),
    ("K16 it100 d- lr0.10", 0.7837, 0.7823),
    ("K17 it200 d- lr0.10", 0.7837, 0.7823),
    ("K18 it50  d3 lr0.05", 0.7827, 0.7761),
]

optimisme = []  # TODO: tiap konfigurasi, cv - test
rata_optimisme = 0.0  # TODO: rata-rata optimisme ke-18 konfigurasi
terbaik_cv = KONFIG[0]  # konfigurasi CV-terbaik (K1, sudah terurut)
optimisme_terbaik_cv = 0.0  # TODO: optimisme konfigurasi CV-terbaik
pemenang_jujur = KONFIG[0]  # TODO: konfigurasi dengan skor test tertinggi
n_seri = 0  # TODO: berapa konfigurasi yang seri di skor test tertinggi
print(f"optimisme konfigurasi CV-terbaik ({terbaik_cv[0]}): {optimisme_terbaik_cv:.4f}")
print(f"optimisme rata-rata: {rata_optimisme:.4f}")
print(f"pemenang jujur (skor test tertinggi): {pemenang_jujur[0]} = {pemenang_jujur[2]:.4f}")
print(f"konfigurasi yang seri di skor test tertinggi: {n_seri}")`,
        lockLines: 23,
        solution: `# Winner's curse: 18 konfigurasi GBM — skor CV (3-fold, train) vs skor test [notebook]
# Tiap baris: (nama, cv_roc_auc, test_roc_auc). d = max_depth (d- = tanpa batas)
KONFIG = [
    ("K1  it100 d5 lr0.05", 0.7865, 0.7823),
    ("K2  it200 d3 lr0.05", 0.7864, 0.7816),
    ("K3  it200 d5 lr0.05", 0.7864, 0.7820),
    ("K4  it100 d3 lr0.10", 0.7862, 0.7802),
    ("K5  it200 d3 lr0.10", 0.7862, 0.7799),
    ("K6  it50  d3 lr0.10", 0.7856, 0.7795),
    ("K7  it50  d5 lr0.05", 0.7855, 0.7804),
    ("K8  it100 d3 lr0.05", 0.7854, 0.7807),
    ("K9  it50  d5 lr0.10", 0.7853, 0.7814),
    ("K10 it100 d5 lr0.10", 0.7851, 0.7817),
    ("K11 it200 d5 lr0.10", 0.7851, 0.7817),
    ("K12 it100 d- lr0.05", 0.7845, 0.7806),
    ("K13 it200 d- lr0.05", 0.7845, 0.7812),
    ("K14 it50  d- lr0.05", 0.7842, 0.7790),
    ("K15 it50  d- lr0.10", 0.7838, 0.7823),
    ("K16 it100 d- lr0.10", 0.7837, 0.7823),
    ("K17 it200 d- lr0.10", 0.7837, 0.7823),
    ("K18 it50  d3 lr0.05", 0.7827, 0.7761),
]

optimisme = [cv - test for _, cv, test in KONFIG]
rata_optimisme = sum(optimisme) / len(optimisme)
terbaik_cv = KONFIG[0]  # konfigurasi CV-terbaik (K1, sudah terurut)
optimisme_terbaik_cv = terbaik_cv[1] - terbaik_cv[2]
pemenang_jujur = max(KONFIG, key=lambda r: r[2])
n_seri = sum(1 for r in KONFIG if r[2] == pemenang_jujur[2])
print(f"optimisme konfigurasi CV-terbaik ({terbaik_cv[0]}): {optimisme_terbaik_cv:.4f}")
print(f"optimisme rata-rata: {rata_optimisme:.4f}")
print(f"pemenang jujur (skor test tertinggi): {pemenang_jujur[0]} = {pemenang_jujur[2]:.4f}")
print(f"konfigurasi yang seri di skor test tertinggi: {n_seri}")`,
        checks: [
          { kind: "equal", task: "t1", name: "optimisme_terbaik_cv", value: 0.0042, tol: 0.00005, label: "`optimisme_terbaik_cv` seharusnya 0.0042", msg: "Optimisme juara CV (K1): 0,7865 − 0,7823 = 0,0042." },
          { kind: "equal", task: "t2", name: "rata_optimisme", value: 0.0042, tol: 0.00005, label: "`rata_optimisme` seharusnya 0.0042", msg: "Rata-rata optimisme 18 konfigurasi: 0,0042 — sama dengan optimisme juaranya." },
          { kind: "stdout_matches", task: "t2", pattern: "optimisme rata-rata: 0\\.0042", label: "Output menampilkan optimisme rata-rata 0,0042", msg: "Optimisme rata-rata 18 konfigurasi: 0,0042." },
          { kind: "stdout_matches", task: "t3", pattern: "pemenang jujur \\(skor test tertinggi\\): K1  it100 d5 lr0\\.05 = 0\\.7823", label: "Output menampilkan pemenang jujur K1 = 0,7823", msg: "Pemenang menurut skor test: K1, 0,7823 — sama dengan juara CV, tapi skornya 0,0042 di bawah klaim CV-nya." },
          { kind: "stdout_matches", task: "t3", pattern: "konfigurasi yang seri di skor test tertinggi: 4", label: "Output menampilkan 4 konfigurasi seri di skor test tertinggi", msg: "Empat konfigurasi berbagi skor test 0,7823 — «pemenang tunggal» adalah ilusi." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 16 · Checkpoint",
      title: "Checkpoint: pemenang yang jujur, bukan pemenang yang menyanjung diri",
      prose: [
        "Rangkuman: AutoML mengotomasi PENCARIAN (18 konfigurasi grid GBM, 54 fit; random search 27 konfigurasi, terbaik di antara 27 konfigurasi itu 0,7866 — hanya 0,0001 di atas grid 0,7865), bukan PERUMUSAN — metrik, protokol, dan penilaian tetap pekerjaanmu. Winner's curse [notebook]: konfigurasi CV-terbaik (max_iter 100, max_depth 5, learning_rate 0,05) skor CV 0,7865 → test 0,7823, optimisme 0,0042; rata-rata optimisme 18 konfigurasi juga 0,0042 (terkecil 0,0014, terbesar 0,0066) — 0,0042 adalah gap protokol CV-vs-holdout yang dimiliki semua 18 kandidat, bukan estimasi eksklusif curse; bukti curse adalah ketidakstabilan peringkat. Curse KECIL di sini karena gain tuning kecil, dan BESAR bila kandidat banyak, validasi kecil, atau selisih antar kandidat tipis. Penyebabnya: seleksi atas noise — Ŝ = S + ε, dan yang terpilih adalah yang ε-nya positif; buktinya, peringkat berubah (K15 peringkat-15 CV menyamai skor test tertinggi) dan empat konfigurasi seri di test 0,7823. McNemar (threshold 0,5, test 6.000) — LR vs GBM: b = 132, c = 199, χ² = 13,1601, p (metode chi2) = 0,0003 (binomial eksak 0,0003) → GBM menang SIGNIFIKAN; GBM vs tertala: b = 36, c = 30, χ² = 0,3788, p (metode chi2) = 0,5383 (eksak 0,5386) → TIDAK signifikan, kemenangan tuning TIDAK TERBUKTI (bukan «terbukti sama»). Signifikan ≠ penting: selisih nested-CV tertala vs default 0,0018 hanya ~0,26× sd antar-fold 0,0068. Protokol adil: nested CV — LR tertala 0,7560 ± 0,0056; GBM default 0,7840 ± 0,0059; GBM tertala 0,7858 ± 0,0068; konfigurasi terbaik BERGANTI tiap outer fold; test terkunci; satu metrik utama (ROC-AUC). Pemenang jujur: GBM tertala, 0,7858 ± 0,0068 — DENGAN CATATAN keunggulannya atas default tidak signifikan dan tidak penting, jadi GBM default sama sahnya bila kesederhanaan dihitung. Jebakan: leaderboard-chasing, test peeking (test yang sudah diintip bukan lagi test yang tak-bias), AutoML kotak hitam tanpa jejak. Lab: McNemar manual χ² = 13,1601, signifikan; winner's curse 18 konfigurasi — optimisme rata-rata 0,0042, pemenang test K1 = 0,7823, seri 4 arah. Single vs ensemble: di M4.1 kamu sudah belajar random forest, bagging, boosting, stacking — di sini ensemble hanya ditempatkan sebagai OPSI seleksi pada frontier Pareto, tanpa angka baru; ensemble hanya layak bila peningkatannya cukup besar dan stabil untuk membayar kompleksitas tambahannya (cost, latency, explainability, operational complexity). Finalisasi model: refit konfigurasi terpilih di train penuh, simpan selection record (dataset version, seed 42, folds, search space, primary metric, konfigurasi terpilih, calibration method, threshold 0,50, skor final) — dan laporkan skor nested 0,7858 sebagai performa, bukan CV 0,7865 atau test 0,7823 tanpa label. Experiment tracking lintas sesi: tiga sesi kanonis (grid 18 → 0,7865; random 27 → 0,7866; shrinking 9 seed 43 → 0,7869) berarti 54 percobaan — laporan yang hanya menampilkan run terbaik (0,7869) TIDAK VALID, karena menyembunyikan jumlah percobaan dan test ikut terintip berulang kali; setiap run dicatat, termasuk yang gagal.",
        "Guided task di Colab — notebook mlf-m65-guided-task.ipynb — mereplikasi semua angka kanonis lesson ini dari dataset UCI: flagship LR/GBM, grid 18 konfigurasi (CV vs test), kedua uji McNemar (manual + cek silang scipy), dan nested CV untuk ketiga kandidat protokol adil. Jalur file notebook: colab/mlf-m65-guided-task.ipynb. Tautan Colab: https://colab.research.google.com/drive/1iOHEx9XKctH-1Wd_tmkDi7Wx8gX75cWs",
        "Lanjut: MLF-M7.1 — modul berikutnya (M7: Fairness, Explainability & Monitoring) — di mana pertanyaan bergeser dari «model mana yang menang» ke «apakah kemenangan itu adil, bisa dijelaskan, dan tetap bertahan setelah dipakai».",
      ],
      tasks: [],
      quiz: [
        {
          q: "Konfigurasi GBM CV-terbaik (max_iter 100, max_depth 5, learning_rate 0,05) punya skor CV 0,7865 dan skor test 0,7823 [notebook]. Berapa optimisme winner's curse-nya?",
          options: [
            { text: "0,0042", why: "Benar: optimisme = skor CV − skor test = 0,7865 − 0,7823 = 0,0042. Rata-rata optimisme ke-18 konfigurasi juga 0,0042.", correct: true },
            { text: "0,0646", why: "Itu gap train-test GBM (train 0,8469 vs test 0,7823) — ukuran overfitting model, bukan optimisme seleksi pemenang." },
            { text: "0,0000 — skor CV pemenang adalah estimasi tak-bias", why: "Salah: skor CV dari konfigurasi yang DIPILIH karena tertinggi adalah bias ke atas — maksimum dari 18 estimasi berisik. Semua 18 konfigurasi punya CV di atas test-nya." },
            { text: "0,0400", why: "Salah hitung desimal: 0,7865 − 0,7823 = 0,0042, bukan 0,0400 — selisihnya empat per seribu, bukan empat per seratus." },
          ],
        },
        {
          q: "McNemar LR vs GBM (threshold 0,5, test 6.000): b = 132, c = 199, χ² = 13,1601, p = 0,0003 [notebook]. Apa kesimpulan yang benar?",
          options: [
            { text: "GBM menang signifikan atas LR", why: "Benar: χ² = 13,1601 > 3,8415 dan p = 0,0003 < 0,05. Arahnya dari c > b: GBM benar di 199 nasabah yang LR-nya salah, LR hanya benar di 132 yang GBM-nya salah.", correct: true },
            { text: "LR menang signifikan atas GBM", why: "Terbalik: c (LR salah, GBM benar = 199) lebih besar dari b (LR benar, GBM salah = 132) — yang lebih sering benar pada pasangan discordant adalah GBM." },
            { text: "Tidak signifikan, karena p = 0,0003 lebih besar dari 0,05", why: "Salah baca ambang: 0,0003 JAUH lebih kecil dari 0,05 — karena itulah H₀ ditolak." },
            { text: "Tidak bisa diputuskan karena pasangan discordant (331) terlalu sedikit", why: "Salah: 331 pasangan discordant sudah cukup — χ² = 13,1601 sudah memperhitungkan ukuran itu, dan hasilnya signifikan." },
          ],
        },
        {
          q: "McNemar GBM default vs GBM tertala: b = 36, c = 30, χ² = 0,3788, p = 0,5383 [notebook]. Apa bacaan yang benar?",
          options: [
            { text: "Tuning terbukti lebih baik — skor CV tertala lebih tinggi", why: "Salah: p = 0,5383 jauh di atas 0,05 — perbedaan tidak signifikan. Skor CV yang lebih tinggi adalah ranking, bukan bukti." },
            { text: "Perbedaan tidak signifikan; kemenangan tuning TIDAK TERBUKTI", why: "Benar: χ² = 0,3788 < 3,8415, p = 0,5383. Hanya 66 pasangan discordant — kedua model hampir selalu sepakat. «Tidak terbukti berbeda» bukan «terbukti sama».", correct: true },
            { text: "GBM default terbukti lebih baik, karena b (36) > c (30)", why: "Salah: b > c sedikit tidak berarti apa-apa bila ujinya tidak signifikan — selisih 6 dari 66 pasangan discordant berada di dalam noise." },
            { text: "χ² = 0,3788 berarti kedua model identik", why: "Salah: uji yang tidak signifikan tidak membuktikan kesetaraan — ia hanya berkata data ini tidak cukup untuk membuktikan perbedaan." },
          ],
        },
        {
          q: "Protokol adil (nested CV) [notebook]: LR tertala 0,7560 ± 0,0056; GBM default 0,7840 ± 0,0059; GBM tertala 0,7858 ± 0,0068. Siapa «pemenang jujur», dan apa catatannya?",
          options: [
            { text: "GBM tertala (0,7858) — tapi keunggulannya atas default (0,0018) jauh di bawah sd 0,0068 dan tidak signifikan (McNemar p = 0,5383)", why: "Benar: pemenang ranking dalam protokol adil adalah GBM tertala — DENGAN CATATAN selisih 0,0018 hanya ~0,26× sd dan kemenangannya tidak terbukti. GBM default sama sahnya bila kesederhanaan dihitung.", correct: true },
            { text: "GBM default — karena tuning tidak signifikan, default otomatis menang", why: "Salah: «tidak signifikan» tidak membalik ranking. Pemenang ranking tetap GBM tertala (0,7858); yang benar adalah keunggulannya tidak terbukti, bukan bahwa default menang." },
            { text: "LR tertala — karena paling sederhana dan paling mudah dijelaskan", why: "Salah: LR tertala skornya paling rendah (0,7560), tertinggal 0,0298 dari GBM tertala — dan McNemar membuktikan LR kalah signifikan dari GBM (p = 0,0003)." },
            { text: "Tidak ada pemenang, karena semua simpangan baku saling tumpang tindih", why: "Salah: sd yang tumpang tindih membatasi klaim keunggulan, bukan menghapus ranking. Ranking nested CV tetap ada: tertala 0,7858 > default 0,7840 > LR 0,7560." },
          ],
        },
        {
          q: "Kapan winner's curse menjadi BESAR?",
          options: [
            { text: "Bila kandidatnya banyak, validasinya kecil, dan selisih antar kandidatnya tipis", why: "Benar: banyak kandidat → peluang noise positif ekstrem naik; validasi kecil → noise tiap skor besar; selisih tipis → ranking ditentukan noise. Di sini gap CV-vs-test pemenangnya 0,0042 — kecil karena hanya 18 kandidat dan gain tuning kecil; ingat, 0,0042 adalah gap protokol yang dimiliki semua 18 kandidat (rata-rata juga 0,0042), bukan ukuran eksklusif curse — bukti curse-nya adalah ketidakstabilan peringkat.", correct: true },
            { text: "Bila kandidatnya sedikit dan validasinya besar", why: "Terbalik: itu kondisi curse KECIL — sedikit yang dipilih, dan tiap skornya stabil." },
            { text: "Bila hanya ada satu kandidat — tanpa pesaing, tidak ada yang menyanjung", why: "Salah: dengan satu kandidat tidak ada seleksi, jadi tidak ada winner's curse sama sekali — tapi juga tidak ada yang dipilih." },
            { text: "Bila test set-nya besar", why: "Salah: test yang besar mengurangi noise skor TEST, bukan optimisme seleksi di validasi — curse lahir di tahap pemilihan (validasi), bukan di tahap pelaporan test." },
          ],
        },
        {
          q: "Apa yang TIDAK diotomasi oleh AutoML?",
          options: [
            { text: "Merumuskan masalah, memilih metrik utama, dan menjaga protokol evaluasi tidak bocor", why: "Benar: AutoML mengotomasi pencarian (mencoba kombinasi, menilai dengan CV, mengembalikan yang terbaik). Perumusan — metrik apa yang benar, data mana yang boleh dipakai, apakah selisihnya bermakna — tetap pekerjaan manusia.", correct: true },
            { text: "Mencoba banyak kombinasi hyperparameter", why: "Itu justru yang DIOTOMASI — grid search 18 konfigurasi GBM (54 fit) adalah contohnya." },
            { text: "Menjalankan cross-validation untuk tiap kombinasi", why: "Itu juga diotomasi — tiap konfigurasi dinilai dengan 3-fold CV tanpa campur tangan manusia." },
            { text: "Melatih ulang model terbaik di data train penuh", why: "Itu pun diotomasi — refit adalah langkah standar pipeline AutoML setelah konfigurasi terbaik dipilih." },
          ],
        },
        {
          q: "Kamu memilih konfigurasi berdasarkan skor test 6.000 baris, lalu melaporkan skor test itu sebagai «performa model». Apa masalahnya?",
          options: [
            { text: "Tidak ada — test 6.000 baris cukup besar sehingga tidak bisa bias", why: "Salah: ukuran tidak menghapus seleksi. Begitu skor test memengaruhi keputusan, test menjadi bagian dari seleksi dan skornya tercemar winner's curse." },
            { text: "Test menjadi bagian dari seleksi (test peeking) — skornya tidak lagi mengukur generalisasi secara tak-bias", why: "Benar: test yang sudah dipakai memilih bukan lagi test. Di sini empat konfigurasi berbagi skor test 0,7823 — memilih di antaranya berdasarkan test adalah memilih berdasarkan noise test.", correct: true },
            { text: "Masalahnya hanya bila test-nya kecil; 6.000 baris aman", why: "Salah: peeking adalah masalah PROTOKOL, bukan ukuran. Test besar hanya memperkecil biasnya, tidak menghilangkannya." },
            { text: "Test peeking justru disarankan untuk model final", why: "Salah: yang disarankan adalah test TERKUNCI — dibuka sekali di akhir untuk satu keputusan final, bukan dipakai berulang untuk memilih." },
          ],
        },
        {
          q: "Pelajaran dari pasangan hasil ini: LR vs GBM signifikan (p = 0,0003, selisih ROC-AUC 0,0397) vs GBM tertala vs default tidak signifikan (p = 0,5383, selisih nested 0,0018). Apa yang harus selalu dilaporkan bersama?",
          options: [
            { text: "Hanya p-value — bila p < 0,05, efeknya pasti penting", why: "Salah: p kecil tidak berarti efek besar. Dengan sampel besar, selisih yang tidak berarti apa-apa secara bisnis pun bisa signifikan." },
            { text: "Ukuran efek beserta noise-nya DAN uji signifikansinya — «skor tertinggi» saja tidak pernah cukup", why: "Benar: laporkan selisih dengan satuannya (0,0018, ~0,26× sd 0,0068) bersama McNemar p = 0,5383. Ranking berkata siapa nomor satu; statistik berkata apakah itu terbukti; bisnis berkata apakah itu penting.", correct: true },
            { text: "Hanya selisih skor — 0,0018 sudah cukup untuk memutuskan", why: "Salah: 0,0018 tanpa pembanding noise tidak berarti apa-apa — ia hanya ~0,26× sd antar-fold 0,0068, alias berada di dalam noise lipatan." },
            { text: "Sd antar-fold 0,0068 membuktikan skor 0,7858 itu salah", why: "Salah: sd mengukur VARIASI skor antar lipatan (0,7782–0,7974), bukan kesalahan skor rata-rata. Nested CV 0,7858 (sd antar-fold 0,0068) adalah estimasi yang jujur, bukan estimasi yang salah." },
          ],
        },
        {
          q: "Selection record GBM tertala: skor CV 0,7865, skor nested 0,7858, skor test 0,7823 [notebook]. Skor mana yang boleh dilaporkan sebagai «performa model», dan mengapa?",
          options: [
            { text: "Skor nested 0,7858 — estimasi jujur prosedur tuning (seleksi di dalam, evaluasi di luar)", why: "Benar: nested CV (0,7858) adalah satu-satunya estimasi untuk model yang di-tuning yang tidak tercemar seleksi. Skor CV bias ke atas (pemenang dipilih karena tertinggi); skor test hanya satu pengukuran, dan test-nya sudah dipakai untuk analisis McNemar.", correct: true },
            { text: "Skor CV 0,7865 — itu skor tertinggi, jadi itu performa modelnya", why: "Salah: skor CV pemenang bias ke atas sebesar 0,0042 — ia adalah skor PEMILIHAN, bukan performa. Melaporkannya sebagai performa adalah kesalahan yang diperingatkan langkah 3." },
            { text: "Skor test 0,7823 — karena test adalah pengukur terakhir yang paling jujur", why: "Salah: test hanya satu pengukuran di satu split — dan di lesson ini test sudah dipakai berkali-kali untuk analisis. Yang tidak memakai test sama sekali hanyalah nested CV (0,7858)." },
            { text: "Rata-rata ketiganya (0,7849) — paling adil karena memakai semua informasi", why: "Salah: merata-ratakan tiga angka yang mengukur hal berbeda (pemilihan, estimasi jujur, satu pengukuran) tidak menghasilkan estimasi yang bermakna — record harus melabeli ketiganya, bukan mencampurnya." },
          ],
        },
        {
          q: "Tiga sesi eksperimen: grid 18 (terbaik CV 0,7865), random 27 (0,7866), shrinking 9 seed 43 (0,7869) — total 54 percobaan, plus 1 run gagal yang tercatat. Laporan hanya menampilkan run terbaik, 0,7869. Apakah laporan itu valid?",
          options: [
            { text: "Tidak — hanya 1 dari 54 percobaan yang dilaporkan, dan test yang sama dipakai berulang kali untuk menilai tiap sesi", why: "Benar: yang dilaporkan harus seluruh registry, termasuk run yang gagal. Menyembunyikan 53 percobaan menyembunyikan winner's curse lintas sesi — dan test yang dipakai berulang kali ikut terintip berulang kali.", correct: true },
            { text: "Valid — 0,7869 adalah skor tertinggi, dan skor tertinggi adalah yang terbaik", why: "Salah: «tertinggi» dari 54 percobaan yang disembunyikan bukanlah bukti — ia adalah maksimum dari 54 estimasi berisik, dan justru karena itulah ia paling tidak bisa dipercaya (langkah 3–4, lintas sesi)." },
            { text: "Valid — asalkan run yang gagal tidak dicatat, supaya laporan tetap bersih", why: "Salah: menyembunyikan run gagal justru menghilangkan informasi tentang berapa kali kamu mencoba — registry yang jujur mencatat SEMUA run, termasuk yang gagal." },
            { text: "Valid — karena tiap sesi memakai metrik yang sama (ROC-AUC)", why: "Salah: metrik yang sama tidak memperbaiki seleksi lintas sesi. Masalahnya bukan metriknya, melainkan jumlah percobaan yang disembunyikan (54 dicoba, 1 dilaporkan)." },
          ],
        },
        {
          q: "Di M4.1 kamu sudah belajar random forest, bagging, boosting, stacking. Di lesson ini ensemble ditempatkan sebagai OPSI seleksi pada frontier Pareto — tanpa angka ensemble di file kanonis. Kapan ensemble layak dipilih atas single model?",
          options: [
            { text: "Bila peningkatannya cukup besar DAN stabil (diukur dengan protokol yang sama: nested CV + uji signifikansi) untuk membayar kompleksitas tambahannya", why: "Benar: ensemble harus dinilai sebagai satu kandidat lagi — cost, latency, explainability, operational complexity adalah harganya, dan hanya peningkatan yang besar dan stabil yang membayar harga itu.", correct: true },
            { text: "Selalu — ensemble menggabungkan banyak model, jadi pasti lebih baik", why: "Salah: tanpa angka dengan protokol yang sama, posisi ensemble di frontier TIDAK DIKETAHUI — klaim «pasti lebih baik» adalah asumsi, bukan bukti." },
            { text: "Bila peningkatannya 0,0002 — setiap peningkatan, sekecil apa pun, layak dibayar", why: "Salah: 0,0002 berada di dalam noise (sd antar-fold 0,0068) — jauh di bawah selisih 0,0018 yang saja sudah tidak signifikan. Membayar kompleksitas untuk noise adalah kemunduran." },
            { text: "Tidak pernah — ensemble selalu terlalu kompleks untuk dipakai", why: "Salah: larangan mutlak sama salahnya dengan penerimaan mutlak. Bila peningkatan besar dan stabil, ensemble layak — yang dilarang adalah mengklaimnya tanpa angka." },
          ],
        },
      ],
      summary: [
        "AutoML mengotomasi pencarian (grid 18 konfigurasi GBM, 54 fit; random search 27 konfigurasi, terbaik di antara 27 konfigurasi itu 0,7866 — hanya 0,0001 di atas grid), bukan perumusan: metrik, protokol, dan penilaian tetap pekerjaan manusia.",
        "Winner's curse [notebook]: juara CV (max_iter 100, max_depth 5, learning_rate 0,05) skor CV 0,7865 → test 0,7823, optimisme 0,0042; rata-rata optimisme 18 konfigurasi juga 0,0042 — 0,0042 adalah gap protokol CV-vs-holdout yang dimiliki semua 18 kandidat, bukan estimasi eksklusif curse; bukti curse adalah ketidakstabilan peringkat (K15 menyamai skor test tertinggi; seri 4 arah). Curse kecil di sini karena gain tuning kecil; besar bila kandidat banyak, validasi kecil, selisih antar kandidat tipis.",
        "Penyebabnya seleksi atas noise (Ŝ = S + ε): peringkat berubah (K15 peringkat-15 CV menyamai skor test tertinggi) dan empat konfigurasi seri di test 0,7823.",
        "McNemar (threshold 0,5, test 6.000) [notebook]: LR vs GBM b = 132, c = 199, χ² = 13,1601, p (metode chi2) = 0,0003 → GBM menang SIGNIFIKAN; GBM vs tertala b = 36, c = 30, χ² = 0,3788, p = 0,5383 → TIDAK signifikan, kemenangan tuning TIDAK TERBUKTI.",
        "Signifikan ≠ penting: selisih nested-CV tertala vs default 0,0018 hanya ~0,26× sd antar-fold 0,0068.",
        "Protokol adil: nested CV — LR tertala 0,7560 ± 0,0056; GBM default 0,7840 ± 0,0059; GBM tertala 0,7858 ± 0,0068; konfigurasi terbaik berganti tiap outer fold; test terkunci; satu metrik utama (ROC-AUC).",
        "Pemenang jujur: GBM tertala, 0,7858 ± 0,0068 — dengan catatan keunggulannya atas default tidak signifikan dan tidak penting; GBM default sama sahnya bila kesederhanaan dihitung. Jangan laporkan 0,7865 sebagai performa.",
        "Jebakan: leaderboard-chasing, test peeking (test yang diintip bukan lagi test tak-bias), AutoML kotak hitam tanpa jejak seleksi.",
        "Lab: McNemar manual χ² = 13,1601, signifikan (p kanonis 0,0003); winner's curse 18 konfigurasi — optimisme rata-rata 0,0042, pemenang test K1 = 0,7823, seri 4 arah.",
        "Single vs ensemble (M4.1 sudah mengajarkan ensembles — di sini hanya opsi seleksi, tanpa angka baru): tiga kandidat kanonis di frontier Pareto — LR tertala 0,7560, GBM default 0,7840, GBM tertala 0,7858; posisi ensemble belum diukur [ilustrasi]; bandingkan pada ROC-AUC/PR-AUC, calibration, cost, latency, explainability, operational complexity — semuanya kualitatif; ensemble hanya layak bila peningkatan cukup besar dan stabil untuk membayar kompleksitas tambahannya.",
        "Finalisasi model: refit konfigurasi terpilih (max_iter 100, max_depth 5, learning_rate 0,05) di train penuh; selection record (dataset version, seed 42, folds, search space, primary metric, konfigurasi terpilih, calibration method, threshold 0,50, skor final); yang boleh dilaporkan sebagai performa adalah skor nested 0,7858 — CV 0,7865 adalah skor pemilihan (bias ke atas), test 0,7823 satu pengukuran.",
        "Experiment tracking lintas sesi: registry mencatat setiap run termasuk yang gagal (seed, search space, metrik, keputusan); tiga sesi kanonis = 54 percobaan (18+27+9); laporan yang hanya menampilkan run terbaik (0,7869) TIDAK VALID — jumlah percobaan disembunyikan dan test ikut terintip berulang kali; «effective number of attempts» kualitatif [ilustrasi].",
      ],
    },
  ],
}; 

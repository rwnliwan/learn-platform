import type { V2Lesson } from "../lib/types";

export const mlfM62: V2Lesson = {
  slug: "mlf-m62-cross-validation-nested-cv",
  track: "Machine Learning Finance",
  module: "Tuning & model selection",
  title: "MLF-M6.2 — Cross-Validation & Nested CV: Satu Split Bisa Menipu",
  estMinutes: 75,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Satu split bisa menipu — cerita dua angka yang tidak sepakat",
      prose: [
        "Di M6.1 kamu menala model dan mendapat dua angka dari SATU split train-test: logistic regression (LR) ROC-AUC 0,7426 dan gradient boosting (GBM) 0,7823 pada 6.000 baris test [notebook]. Angka-angka itu terasa final — seperti nilai ujian. Tapi lesson ini dimulai dengan kabar yang mengganggu: bila kamu mengukur model yang SAMA dengan 5-fold cross-validation pada seluruh 30.000 baris, LR mendapat 0,7560 dan GBM 0,7840 [notebook]. LR «naik» 0,0134 hanya karena cara mengukurnya berubah — modelnya sama, datanya sama, yang berbeda hanya pembagian train-test-nya.",
        "Itulah masalah yang dipecahkan lesson ini: satu split train-test adalah SATU undian. Test set 6.000 baris itu bisa saja sedikit lebih sulit (atau lebih mudah) dari rata-rata — dan kamu tidak akan pernah tahu dari satu angka saja. Cross-validation (CV) adalah jawabannya: ukur berkali-kali pada pembagian yang berbeda, lalu rata-ratakan. Nested CV melangkah lebih jauh: ia mengukur dengan jujur BAHKAN SETELAH kamu menala hyperparameter. Dan time-series split menutup lesson ini dengan peringatan: untuk data berurutan waktu, CV acak adalah kebocoran (leakage) yang menyamar sebagai validasi.",
        "Peta lesson: K-fold — apa dan mengapa → stratified vs biasa (base rate 0,2212) → membaca mean ± sd → ketidakpastian tuning (sd fold / SE / CI naif) → worked example CV 5-fold → single-split vs CV → nested CV (dua loop) → worked example nested → workflow anti-leakage (Pipeline) → leakage DALAM tuning → time-series split BBCA → 3 lab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M6.2 dan file kanonis M6: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate gagal bayar 0,2212, 31 fitur [notebook, rincian fitur] (23 mentah + 8 turunan), split stratified 24.000 train / 6.000 test, seed 42. Flagship single-split [notebook]: LR ROC-AUC 0,7426 / PR-AUC 0,5049; GBM 0,7823 / 0,5597; GBM train 0,8469 vs test 0,7823, gap 0,0646.",
        "Nilai: satu angka dari satu split memberi kepastian palsu — ia menyembunyikan betapa goyangnya pengukuranmu. CV mengubah satu angka menjadi DISTRIBUSI (lima skor fold) — dan dari distribusi itu kamu bisa membaca bukan hanya «berapa bagusnya», tapi juga «seberapa stabilnya».",
        "Baik atau buruk: single-split bagus karena murah (satu kali latih) dan mudah dijelaskan. Buruk bila dijadikan vonis akhir: selisih 0,0134 pada LR di atas menunjukkan vonis dari satu split bisa meleset lebih besar dari selisih antar-model yang sedang kamu bandingkan. CV bagus karena merata-ratakan lima undian — tapi tetap bukan obat mujarab: ia mengukur model yang dilatih pada 24.000 baris, bukan pada 30.000 baris penuh, dan skor-skor fold-nya saling berkorelasi (langkah 4).",
        "Mitigasi: jangan pernah melaporkan skor dari satu split tanpa menyebutnya apa adanya — «skor pada SATU test set 6.000 baris». Bila keputusanmu bergantung pada perbandingan dua model, ukur keduanya dengan CV yang sama (fold yang sama, seed yang sama) dan laporkan mean ± sd-nya.",
      ],
      tasks: [],
    },
    {
      id: "kfold",
      eyebrow: "Langkah 2 · K-fold: apa + mengapa",
      title: "K-fold cross-validation: lima kali latih, lima kali uji, semua baris teruji sekali",
      prose: [
        "K-fold CV bekerja seperti ini: bagi data menjadi K lipatan (fold) yang besarnya sama. Untuk tiap fold k, latih model pada K−1 fold lainnya dan uji pada fold k. Ulangi sampai tiap fold pernah menjadi test tepat satu kali. Dengan K = 5 pada 30.000 baris, tiap fold berisi 6.000 baris; tiap model dilatih pada 24.000 baris dan diuji pada 6.000 baris yang belum pernah ia lihat — lima kali, dengan lima test set yang berbeda.",
        "Nilai: lima skor fold GBM default di data ini [notebook] adalah 0,7940; 0,7762; 0,7832; 0,7856; 0,7808 — mean 0,7840, sd 0,0059. Lima skor fold LR [notebook] adalah 0,7634; 0,7476; 0,7600; 0,7523; 0,7568 — mean 0,7560, sd 0,0056. Bandingkan dengan single-split: LR 0,7426 (di BAWAH skor fold TERENDAH 0,7476!) dan GBM 0,7823 (di dalam rentang fold 0,7762–0,7940). Single-split LR ternyata lebih pesimis daripada seluruh lima fold CV — test set tunggal itu memang sedikit lebih sulit dari rata-rata.",
        "Baik atau buruk: K-fold bagus karena SETIAP baris data pernah menjadi test tepat sekali — tidak ada baris yang «terbuang» sebagai test saja, dan tidak ada baris yang tidak pernah diuji. Buruk bila K terlalu kecil (K = 2: tiap model hanya dilatih pada separuh data — terlalu jauh dari model final yang dilatih pada semua data) atau K terlalu besar (K = 30.000 alias leave-one-out: 30.000 kali latih, mahal, dan skor-skornya hampir identik sehingga sd-nya menipu). K = 5 atau 10 adalah kompromi standar: cukup banyak lipatan untuk merata-ratakan, cukup besar tiap train set untuk menyerupai model final.",
        "Mitigasi: pakai K = 5 sebagai default, K = 10 bila kamu butuh estimasi yang sedikit lebih stabil dan sanggup membayar dua kali lipat biaya komputasi. Dan selalu tetapkan seed (di sini seed 42) — tanpa seed yang dicatat, CV-mu tidak bisa direplikasi oleh orang lain, termasuk dirimu sendiri minggu depan.",
      ],
      tasks: [],
    },
    {
      id: "stratified",
      eyebrow: "Langkah 3 · Stratified vs biasa",
      title: "Stratified K-fold: menjaga base rate 0,2212 di tiap lipatan",
      prose: [
        "Base rate gagal bayar di data ini adalah 0,2212 [notebook] — dari 30.000 nasabah, 6.636 gagal bayar dan 23.364 tidak. Stratified K-fold memastikan tiap fold mewarisi proporsi yang sama: tiap fold 6.000 baris berisi sekitar 1.327 nasabah gagal bayar (22,12%). Tanpa stratifikasi, K-fold biasa (apa lagi tanpa shuffle) membagi data apa adanya — dan bila baris-baris data kebetulan tidak tercampur sempurna, satu fold bisa berisi 19% nasabah gagal bayar sementara fold lain 25%, sehingga skor fold-nya tidak lagi sebanding: fold yang «mudah» (sedikit default) memberi skor tinggi bukan karena modelnya bagus, melainkan karena test-nya mudah.",
        "Nilai: seberapa besar goyangan itu bila kamu TIDAK menstratifikasi? Sebagai gambaran [ilustrasi]: bila 6.000 baris diambil acak dari populasi dengan p = 0,2212, simpangan baku proporsi default-nya adalah √(p(1−p)/n) ≈ 0,0054 (aproksimasi binomial; dengan koreksi populasi-terbatas ≈ 0,0048) — jadi satu fold bisa dengan wajar berisi 21,0%–23,2% nasabah gagal bayar (rentang ±2 simpangan baku). Stratifikasi menghapus goyangan itu sampai nol: tiap fold persis 22,12% (atau sedekat mungkin dengan itu). Harga yang dibayar: nol — stratifikasi tidak menambah biaya komputasi sama sekali.",
        "Baik atau buruk: stratified bagus untuk data klasifikasi dengan kelas yang tidak seimbang — ia menghilangkan satu sumber noise yang tidak perlu dari perbandinganmu. Buruk bila dipakai buta-buta pada data dengan kelas yang SANGAT langka (misal 30 kejadian positif dari 30.000 baris): stratifikasi memaksa tiap fold berisi 6 kejadian positif — dan satu kejadian yang pindah fold sudah mengubah skor fold itu secara kasar. Pada kasus ekstrem begitu, yang kamu butuhkan adalah lebih banyak data, bukan lipatan yang lebih pintar.",
        "Mitigasi: untuk klasifikasi, pakai StratifiedKFold sebagai default — bukan KFold biasa. Untuk regresi (target kontinu), stratifikasi tidak berlaku langsung; bila distribusi targetnya miring, pertimbangkan membagi target menjadi beberapa bin lalu menstratifikasi berdasarkan bin itu.",
      ],
      tasks: [],
    },
    {
      id: "mean-sd",
      eyebrow: "Langkah 4 · Membaca mean ± sd",
      title: "Membaca mean ± sd: skor rata-rata, dan seberapa goyang ia",
      prose: [
        "Lima skor fold diringkas menjadi dua angka: mean (rata-rata) dan sd (simpangan baku antar-fold). Mean menjawab «seberapa bagus model ini, rata-rata?»; sd menjawab «seberapa goyang pengukuran ini dari satu fold ke fold lain?». GBM default [notebook]: mean 0,7840, sd 0,0059 — band satu-sd-nya [0,7781; 0,7899]. LR [notebook]: mean 0,7560, sd 0,0056 — band [0,7504; 0,7616]. Kedua band itu TIDAK bersinggungan: pada data ini, GBM lebih baik daripada LR dengan jarak yang jauh melampaui goyangan antar-fold (selisih mean 0,0280 vs sd sekitar 0,006).",
        "Nilai: band mean ± sd adalah alat baca cepat, bukan uji statistik. Ia memberi tahu kamu apakah selisih dua model «besar» dibanding goyangan pengukuran: selisih 0,0280 (GBM vs LR) adalah sekitar 5× sd — meyakinkan. Sebaliknya, selisih 0,0018 antara nested CV GBM (0,7858) dan CV biasa GBM (0,7840) adalah sekitar seperempat sd — kecil dibanding goyangan, jadi jangan membesar-besarkannya (langkah 9). Sebagai gambaran turunan [ilustrasi]: standard error dari mean itu kira-kira sd/√5 ≈ 0,0025–0,0026 — TAPI angka itu terlalu optimis, karena kelima skor fold saling berkorelasi (train set-nya tumpang tindih 75%: tiap dua fold berbagi 14.400 dari 19.200 baris tiap training set).",
        "Baik atau buruk: mean beserta sd antar-fold-nya bagus karena jujur tentang goyangan SATU skor fold — bukan tentang ketidakpastian mean; satu angka mean tanpa sd menyembunyikan goyangan. Buruk bila dibaca sebagai interval kepercayaan formal: sd antar-fold BUKAN standard error, dan band yang tumpang tindih BUKAN berarti «tidak ada beda» (uji perbandingan model yang benar memakai skor fold BERPASANGAN — model yang sama di fold yang sama — dibahas di M6.5).",
        "Mitigasi: laporkan SELALU mean beserta sd antar-fold-nya (dan K-nya), jangan pernah mean saja. Bila dua model berselisih kurang dari satu sd, jangan menyatakan pemenang dari angka itu saja — laporkan selisihnya sebagai «kecil dibanding goyangan antar-fold» dan lanjutkan ke perbandingan berpasangan.",
      ],
      formula: String.raw`\bar{s} = \frac{1}{K}\sum_{k=1}^{K} s_k, \qquad \mathrm{sd} = \sqrt{\frac{1}{K}\sum_{k=1}^{K} (s_k - \bar{s})^2}`,
      formulaNote: "Mean dan sd (populasi, pembagi K) dari K skor fold. Di lesson ini sd dihitung dengan pembagi K = 5 — sama seperti numpy std default — bukan sd sampel (pembagi K−1).",
      tasks: [],
      note: {
        title: "Miskonsepsi: sd antar-fold adalah ketidakpastian mean",
        type: "pitfall",
        body: "Yang benar: sd 0,0059 (GBM) adalah sebaran skor dari satu fold ke fold lain — seberapa goyang SATU pengukuran fold. Ketidakpastian MEAN-nya lebih kecil (kira-kira sd/√5 ≈ 0,0026 [ilustrasi]) — dan bahkan itu masih optimis karena skor-skor fold saling berkorelasi (train set tumpang tindih). Jangan memakai sd antar-fold sebagai error bar mean, dan jangan memakai band yang tumpang tindih sebagai vonis «tidak berbeda».",
      },
    },
    {
      id: "uncertainty",
      eyebrow: "Langkah 5 · Ketidakpastian hasil tuning",
      title: "Ketidakpastian hasil tuning: sd fold, SE, dan CI naif — empat angka, empat pertanyaan",
      prose: [
        "Mean nested CV GBM adalah 0,7858 — tapi angka itu diringkas dari lima skor outer yang BERBEDA: 0,7974; 0,7782; 0,7878; 0,7859; 0,7799 [notebook]. Seberapa yakin kamu boleh pada 0,7858? Langkah ini memisahkan empat besaran yang sering dicampuradukkan: sd antar-fold, standard error (SE) dari mean, confidence interval (CI), dan variabilitas akibat split. Keempatnya menjawab pertanyaan yang berbeda — dan mencampuradukkannya adalah cara tercepat mengubah angka jujur menjadi klaim berlebih.",
        "Nilai: hitung dari lima skor outer [notebook]. Jumlahnya 3,9292; bagi 5 → mean 0,7858. Selisih tiap skor dari mean: +0,0116; −0,0076; +0,0020; +0,0001; −0,0059 — kuadratkan, rata-ratakan (pembagi 5, konvensi yang sama dengan langkah 4), akarkan → sd antar-fold 0,0068. Rentang fold: terendah 0,7782, tertinggi 0,7974 — lebar 0,0192. Lalu tiga turunan: (1) sd antar-fold 0,0068 = seberapa goyang SATU skor fold; (2) SE dari mean = sd/√5 = 0,0068/√5 ≈ 0,0030 = seberapa goyang RATA-RATA lima fold itu; (3) CI 95% naif = mean ± 1,96 × SE = 0,7858 ± 0,0060 → [0,7799; 0,7918]. Perhatikan: dengan SE tak-dibulatkan (0,00304), setengah-lebarnya 1,96 × 0,00304 ≈ 0,0060, jadi batasnya [0,7799; 0,7918].",
        "Sekarang peringatan yang membuat CI di atas disebut NAIF: rumus SE = sd/√5 mengasumsikan kelima skor fold adalah lima pengukuran yang INDEPENDEN — dan itu SALAH. Dua outer fold mana pun berbagi 14.400 dari 19.200 baris tiap training set-nya (tumpang tindih 75%): model-model fold itu dilatih pada data yang sebagian besar SAMA, sehingga skor-skornya bergerak bersama — bila satu fold «beruntung», fold lain cenderung ikut beruntung. Fold test-nya memang tidak tumpang tindih (tiap baris menjadi outer-test tepat sekali), tapi korelasi lewat train yang tumpang tindih sudah cukup untuk merusak asumsi independen. Akibatnya ukuran sampel efektifnya KURANG dari 5, SE yang benar LEBIH BESAR dari 0,0030, dan CI yang benar LEBIH LEBAR dari [0,7799; 0,7918]. CI naif itu menjawab pertanyaan «bagaimana bila kelima fold independen?» — pertanyaan yang premisnya salah, jadi jawabannya optimistis. Tambahan lagi: sd-nya sendiri diestimasi dari hanya 5 titik, jadi SE itu sendiri goyang.",
        "Baik atau buruk: melaporkan mean beserta sd antar-fold-nya dan skor per-fold itu bagus — pembaca bisa melihat sendiri rentang 0,7782–0,7974 dan menilai goyangannya. Buruk bila CI naif [0,7799; 0,7918] dilaporkan sebagai interval kepercayaan formal («skor sebenarnya 95% berada di dalam») — ia bukan itu, dan mengklaimnya berarti mengklaim presisi yang tidak kamu miliki. Buruk juga membandingkan dua model dari CI yang tumpang tindih: dua CI naif yang bersinggungan TIDAK berarti kedua model «tidak berbeda» — perbandingan yang benar memakai skor BERPASANGAN pada fold yang sama (dibahas di M6.5). Dan perhatikan skala: selisih nested vs CV biasa hanya 0,0018 — LEBIH KECIL dari SE naif 0,0030 — jadi klaim «tuning memperbaiki model» tidak bisa ditegakkan dari angka ini saja; selisih nested vs single-split 0,0035 pun hanya sekitar satu SE naif.",
        "Mitigasi: laporkan PAKET lengkapnya, bukan satu angka: skor outer per fold (0,7974; 0,7782; 0,7878; 0,7859; 0,7799), mean 0,7858, sd 0,0068, dan rentang 0,7782–0,7974. Bila kamu menyebut CI, labeli eksplisit «CI naif — mengasumsikan fold independen, jadi optimistis» dan JANGAN memakainya sebagai klaim formal. Untuk mengukur variabilitas akibat split secara jujur, ulangi CV dengan seed berbeda (repeated CV) dan lihat seberapa jauh mean-nya bergeser — itu variabilitas split yang sesungguhnya, bukan yang diasumsikan rumus. Dan bila keputusanmu adalah «model A vs model B», jangan bandingkan CI-nya — bandingkan selisih skor BERPASANGAN per fold, seperti di M6.5.",
      ],
      formula: String.raw`\mathrm{SE} = \frac{\mathrm{sd}}{\sqrt{K}}, \qquad \mathrm{CI}_{95\%}^{\mathrm{naif}} = \bar{s} \pm 1{,}96 \times \mathrm{SE}`,
      formulaNote: "SE dari mean dan CI 95% naif (K = 5, sd populasi pembagi K). CI ini NAIF: rumusnya mengasumsikan kelima skor fold independen — padahal train set antar-fold tumpang tindih 75% — sehingga CI yang benar lebih lebar. Jangan laporkan CI naif sebagai klaim formal.",
      tasks: [],
      note: {
        title: "Miskonsepsi: CI naif [0,7799; 0,7918] berarti skor sebenarnya 95% ada di dalamnya",
        type: "pitfall",
        body: "Yang benar: CI itu dihitung dengan SE = sd/√5 yang mengasumsikan lima skor fold independen. Train set antar-fold tumpang tindih 75% (14.400 dari 19.200 baris tiap training set), jadi skor-skornya berkorelasi, ukuran sampel efektif kurang dari 5, dan CI yang benar lebih lebar. [0,7799; 0,7918] adalah «bagaimana bila independen» — bukan interval kepercayaan yang sah. Laporkan skor per fold + mean + sd + rentang, dan labeli CI apa pun sebagai naif.",
      },
    },
    {
      id: "worked-cv",
      eyebrow: "Langkah 6 · Worked example",
      title: "Worked example: CV 5-fold, dihitung dari lima skor fold",
      prose: [
        "Sekarang hitung sendiri dari angka kanonis [notebook]. Skor fold GBM default: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808. Jumlahnya 3,9198; bagi 5 → mean 0,78396, dibulatkan 0,7840. Selisih tiap skor dari mean: +0,0100; −0,0078; −0,0008; +0,0016; −0,0032. Kuadratkan, rata-ratakan, akarkan → sd 0,0059. Skor fold LR: 0,7634; 0,7476; 0,7600; 0,7523; 0,7568 — jumlah 3,7801, mean 0,75602 → 0,7560, sd 0,0056.",
        "Nilai: perhatikan fold 1 GBM, 0,7940 — tertinggi, dan fold 2, 0,7762 — terendah. Rentang GBM 0,7940 − 0,7762 = 0,0178; rentang LR 0,7634 − 0,7476 = 0,0158. Rentang itu adalah goyangan yang disembunyikan single-split: satu test set memberi satu titik di dalam rentang itu, dan kamu tidak tahu di mana. Fold 1 yang «mudah» memberi GBM 0,7940 — bila test set tunggalmu kebetulan semudah fold 1, kamu akan melaporkan 0,7940 dan merasa modelmu lebih bagus 0,0100 dari yang sebenarnya.",
        "Gambar di bawah memplot lima skor fold GBM beserta garis mean 0,7840. Satu diagnosis: sebaran skor fold — seberapa goyang satu pengukuran fold.",
        "Baik atau buruk: worked example ini bagus karena angkanya bisa kamu periksa dengan kalkulator — tidak ada yang disembunyikan di balik library. Buruk bila kamu mengira mean 0,7840 adalah «skor model final»: model final dilatih pada SELURUH 30.000 baris, sementara tiap model fold hanya dilatih pada 24.000 baris. CV mengestimasi kinerja model yang dilatih pada 24.000 baris — sedikit lebih pesimis daripada model final (yang melihat 25% data lebih banyak). Selisihnya kecil pada data sebesar ini, tapi arahnya perlu dicatat.",
        "Mitigasi: bila kamu butuh skor untuk model final (yang dilatih pada semua data), CV tetap estimasi terbaik yang kamu punya — tapi sebutkan dengan jujur: «CV mengestimasi model yang dilatih pada 80% data». Jangan mengklaim CV mengukur model final secara persis.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Lima skor fold GBM: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808; garis mean 0,7840">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Skor fold GBM default — 5-fold stratified CV (ROC-AUC)</text>
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
<line x1="52" y1="76.9" x2="466" y2="76.9" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="460" y="70.9" text-anchor="end" font-size="10" fill="var(--c2)" font-family="var(--font-ui)">mean 0,7840</text>
<rect x="90" y="47.6" width="50" height="158.4" fill="var(--c1)"/>
<text x="115" y="43.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7940</text>
<text x="115" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Fold 1</text>
<rect x="170" y="99.8" width="50" height="106.2" fill="var(--c1)"/>
<text x="195" y="95.8" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7762</text>
<text x="195" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Fold 2</text>
<rect x="250" y="79.3" width="50" height="126.7" fill="var(--c1)"/>
<text x="275" y="75.3" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7832</text>
<text x="275" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Fold 3</text>
<rect x="330" y="72.2" width="50" height="133.8" fill="var(--c1)"/>
<text x="355" y="68.2" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7856</text>
<text x="355" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Fold 4</text>
<rect x="410" y="86.3" width="50" height="119.7" fill="var(--c1)"/>
<text x="435" y="82.3" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7808</text>
<text x="435" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Fold 5</text>
</svg>`,
        alt: "Lima skor fold GBM: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808; garis putus-putus mean 0,7840.",
        caption: "Cara membaca: sumbu-x = fold 1–5, sumbu-y = ROC-AUC 0,74–0,80. Garis putus-putus = mean 0,7840 [notebook]. Interpretasi: satu fold saja memberi angka di mana saja dalam rentang 0,7762–0,7940 (lebar 0,0178) — mean lima fold jauh lebih stabil daripada satu titik mana pun.",
      },
      tasks: [],
    },
    {
      id: "single-vs-cv",
      eyebrow: "Langkah 7 · Single-split vs CV",
      title: "Single-split vs CV: kapan satu split menyesatkan, kapan tidak",
      prose: [
        "Letakkan kedua pengukuran berdampingan [notebook]. LR: single-split 0,7426 vs CV 0,7560 — single-split lebih RENDAH 0,0134. GBM: single-split 0,7823 vs CV 0,7840 — single-split lebih rendah 0,0017. Pada data ini, single-split ternyata PESIMIS untuk kedua model — test set 6.000 baris itu sedikit lebih sulit daripada rata-rata kelima fold CV. LR «dirugikan» 0,0134, GBM hanya 0,0017: model yang sama, test set yang sama, tapi besarnya bias berbeda — karena tiap model bereaksi berbeda terhadap baris-baris sulit di test set itu.",
        "Nilai: selisih 0,0134 pada LR itu BESAR dalam konteks lesson ini: ia lebih besar daripada selisih antara GBM default dan GBM tertala di test (0,7823 vs 0,7823 — nol), dan hampir setengah dari selisih GBM vs LR (0,0280). Artinya: bila kamu membandingkan dua model dengan SATU split, noise pengukuranmu bisa lebih besar daripada sinyal yang kamu cari. CV tidak menghilangkan noise itu — ia merata-ratakannya ke seperlima.",
        "Baik atau buruk: single-split bagus sebagai pemeriksaan cepat dan murah — satu kali latih, langsung ada angka. Buruk bila dipakai untuk MEMILIH model: pemenang single-split bisa jadi hanya pemenang undian test set. CV bagus untuk pemilihan dan pelaporan. Buruk bila kamu lupa bahwa angka CV dihitung pada seluruh 30.000 baris sementara single-split hanya pada 6.000 baris test — keduanya mengestimasi hal yang sama (kinerja pada data baru) tapi dari jendela yang berbeda, jadi selisih 0,0134 itu sendiri juga mengandung noise.",
        "Mitigasi: untuk keputusan pemilihan model, pakai CV dengan fold dan seed yang SAMA untuk semua kandidat — perbandingan berpasangan pada fold yang sama menghilangkan sebagian besar noise (tiap model diuji pada test set yang identik). Single-split tetap boleh dipakai — sebagai pemeriksaan kewarasan (sanity check) setelah CV, bukan sebagai vonis.",
      ],
      tasks: [],
    },
    {
      id: "nested",
      eyebrow: "Langkah 8 · Nested CV: dua loop",
      title: "Nested CV: loop dalam memilih, loop luar mengukur — jangan tertukar",
      prose: [
        "CV biasa punya satu lubang: bila kamu memakai skor CV untuk MEMILIH hyperparameter terbaik (seperti grid 18 konfigurasi GBM di M6.1), skor CV dari konfigurasi pemenang itu sudah «terkontaminasi» oleh pemilihan — kamu memilih konfigurasi yang skor CV-nya paling tinggi, dan nilai maksimum dari 18 pengukuran berisik cenderung terlalu tinggi. Itulah selection bias (dikenal juga sebagai winner's curse): skor yang kamu laporkan bukan lagi estimasi jujur, melainkan estimasi yang sudah kamu pilih karena ia terlihat bagus.",
        "Nested CV menutup lubang itu dengan DUA loop. Loop DALAM (inner, 3-fold): pada tiap outer-train set, jalankan grid search penuh — pilih hyperparameter terbaik menurut inner CV. Loop LUAR (outer, 5-fold): latih model dengan hyperparameter pilihan inner itu pada outer-train set, lalu uji SEKALI pada outer-test set yang tidak pernah dipakai untuk memilih apa pun. Skor outer itu mengukur KINERJA PROSEDUR TUNING — bukan kinerja satu konfigurasi tertentu — karena konfigurasi yang diuji di tiap outer fold boleh berbeda-beda (dan memang berbeda, lihat langkah 9).",
        "Nilai: biaya nested CV di sini [notebook]: 5 outer fold × (18 konfigurasi × 3 inner fold + 1 refit) = 275 kali latih GBM — itu grid PENUH kanonis; notebook memakai subset 8 konfigurasi (125 kali latih) — detail implementasi notebook, bukan angka kanonis — dan membandingkan hasilnya ke kanonis 0,7858 dalam toleransi 0,005 (lihat Langkah 3 notebook). Bandingkan dengan CV biasa: 5 kali latih. Nested CV berharga 55× lipat dibanding satu CV 5-fold untuk satu konfigurasi (275 vs 5 kali latih) — atau hanya ≈5× dibanding grid search CV3 penuh (275 vs 54 fits) — itulah mengapa ia dipakai untuk LAPORAN AKHIR yang jujur, bukan untuk eksplorasi sehari-hari. Selama eksplorasi, CV biasa sudah cukup; nested CV adalah gerbang sebelum kamu mengumumkan «model ini ROC-AUC-nya sekian» ke pemangku kepentingan.",
        "Baik atau buruk: nested CV bagus karena ia adalah satu-satunya estimasi yang tidak memakai data yang sama untuk memilih DAN menilai — pemisahan tugasnya bersih. Buruk bila disalahartikan: nested CV TIDAK memilihkanmu satu konfigurasi final. Ia memberimu skor jujur untuk prosedurnya; konfigurasi final tetap harus dipilih dengan satu grid search pada SELURUH data (dan skornya tidak boleh dilaporkan sebagai «skor model» tanpa kualifikasi).",
        "Mitigasi: pakai nested CV bila (a) kamu menala hyperparameter DAN (b) kamu akan melaporkan satu angka kinerja sebagai klaim. Bila modelmu TIDAK ditala (GBM default, tanpa grid search), CV biasa sudah tak-bias — nested CV tidak menambah apa-apa kecuali biaya.",
      ],
      formula: String.raw`\hat{\theta}_{\mathrm{nested}} = \frac{1}{K}\sum_{k=1}^{K} s_k^{\mathrm{outer}}, \qquad \hat{\lambda}_k = \arg\max_{\lambda}\, \mathrm{CV}_{\mathrm{inner}}^{(k)}(\lambda)`,
      formulaNote: "Estimasi nested CV: rata-rata K skor outer. Tiap skor outer s_k memakai hyperparameter λ̂_k yang dipilih HANYA oleh inner CV pada outer-train fold k — outer-test fold k tidak pernah menyentuh pemilihan.",
      tasks: [],
    },
    {
      id: "worked-nested",
      eyebrow: "Langkah 9 · Worked example nested",
      title: "Worked example nested: 0,7858 — dan mengapa ia LEBIH TINGGI dari single-split",
      prose: [
        "Skor outer nested CV untuk GBM tertala [notebook]: fold 1: 0,7974; fold 2: 0,7782; fold 3: 0,7878; fold 4: 0,7859; fold 5: 0,7799. Mean 0,7858, sd 0,0068. Konfigurasi terbaik yang dipilih inner CV di tiap outer fold: fold 1 → max_iter 50, max_depth 5, learning_rate 0,1; fold 2 → 200, 3, 0,05; fold 3 → 100, 5, 0,05; fold 4 → 100, 3, 0,1; fold 5 → 50, 5, 0,05. Lima fold, lima konfigurasi berbeda — tuning-nya TIDAK stabil. Tapi skor outer-nya stabil (rentang 0,7782–0,7974): karena permukaan tuningnya DATAR — skor CV grid terbaik 0,7865 vs terburuk 0,7827, selisih hanya 0,0038 [notebook] — jadi konfigurasi mana pun yang terpilih, hasilnya hampir sama.",
        "Sekarang bandingkan tiga estimasi GBM [notebook]: single-split 0,7823; CV biasa (default, tanpa tuning) 0,7840; nested CV (tertalla) 0,7858. Nested LEBIH TINGGI dari single-split sebesar 0,0035 — single-split di sini justru sedikit PESIMIS, bukan optimis. Dan nested hanya 0,0018 di atas CV biasa — gain tuning yang jujur ternyata kecil, sekitar seperempat sd antar-fold (0,0068). Gambar di bawah memplot ketiganya.",
        "Nilai: inilah kejujuran yang WAJIB dipegang: nested CV memberi estimasi JUJUR (tak-bias) — dan estimasi jujur itu BISA di atas atau di bawah single-split. Di data ini ia di atas, karena gain tuning-nya kecil dan single-split-nya sial (test set yang sedikit lebih sulit). Pada data lain, nested bisa di bawah single-split bila single-split-nya kebetulan mudah atau tuning-nya agresif. Jangan pernah mengajarkan «nested selalu memberi skor LEBIH RENDAH» — itu salah, dan data ini adalah bukti langsungnya.",
        "Baik atau buruk: nested CV bagus karena ia memisahkan pemilihan dan penilaian secara bersih — skor 0,7858 adalah klaim yang bisa kamu pertahankan di depan pemangku kepentingan. Buruk bila dibaca sebagai «skor model final»: model final dilatih pada semua data dengan satu konfigurasi pilihan grid penuh — skornya TIDAK diukur oleh nested CV, dan melaporkannya sebagai 0,7858 tanpa kualifikasi adalah klaim berlebih.",
        "Mitigasi: laporkan ketiganya berdampingan — single-split, CV biasa, nested — beserta apa yang diukur masing-masing. Bila nested dan single-split berselisih kurang dari satu sd, sebutkan selisihnya sebagai «kecil dibanding goyangan antar-fold», bukan sebagai bukti satu metode «lebih benar» dari yang lain.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Tiga estimasi GBM: single-split 0,7823; CV biasa 0,7840; nested CV 0,7858">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tiga estimasi kinerja GBM — single-split vs CV vs nested (ROC-AUC)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,77</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,78</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,79</text>
<rect x="110" y="97.8" width="65" height="108.2" fill="var(--c1)"/>
<text x="142.5" y="93.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7823</text>
<text x="142.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Single-split</text>
<rect x="215" y="82.8" width="65" height="123.2" fill="var(--c4)"/>
<text x="247.5" y="78.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7840</text>
<text x="247.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">CV biasa</text>
<rect x="320" y="67.0" width="65" height="139.0" fill="var(--c2)"/>
<text x="352.5" y="63.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7858</text>
<text x="352.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Nested CV</text>
<text x="240" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">nested − single-split = +0,0035 · nested − CV biasa = +0,0018</text>
</svg>`,
        alt: "Tiga estimasi GBM: single-split 0,7823; CV biasa 0,7840; nested CV 0,7858; selisih nested minus single-split +0,0035.",
        caption: "Cara membaca: sumbu-y = ROC-AUC 0,77–0,79 (diperbesar agar selisih kecil terlihat). Interpretasi: nested CV (0,7858) justru LEBIH TINGGI dari single-split (0,7823) — selisih +0,0035 [notebook]. Nested memberi estimasi JUJUR, bukan estimasi yang selalu lebih rendah.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: nested CV selalu memberi skor lebih rendah",
        type: "pitfall",
        body: "Yang benar: nested CV memberi estimasi JUJUR (tak-bias) untuk prosedur tuning — yang bisa di atas ATAU di bawah single-split. Di data ini nested 0,7858 LEBIH TINGGI dari single-split 0,7823 (+0,0035), karena gain tuning kecil dan single-split-nya kebetulan pesimis. Yang «selalu lebih rendah» itu hanya terjadi bila single-split-mu kebetulan optimis atau tuning-mu agresif — bukan hukum alam.",
      },
    },
    {
      id: "anti-leakage",
      eyebrow: "Langkah 10 · Workflow anti-leakage",
      title: "Workflow anti-leakage: transformer di-fit DI DALAM fold — Pipeline menjaminnya",
      prose: [
        "Leakage dalam tuning (langkah 11) adalah memakai TEST untuk memilih. Tapi ada kebocoran yang lebih senyap dan jauh lebih sering terjadi — dan ia bersembunyi di baris kode SEBELUM CV dimulai: preprocessing yang di-fit pada SELURUH data. StandardScaler yang menghitung mean dan sd dari 30.000 baris, SelectKBest yang memilih fitur dari 30.000 baris, imputer yang menghitung rata-rata dari 30.000 baris — semuanya sudah «melihat» validation fold sebelum model diuji padanya. Skor CV-mu lalu mengukur model yang diam-diam sudah dibantu oleh data test-nya sendiri.",
        "Nilai: workflow anti-leakage yang benar, untuk SETIAP fold: (1) data mentah → (2) split/fold → (3) fit transformer HANYA pada train fold → (4) transform validation fold dengan transformer yang sudah di-fit itu → (5) fit estimator pada train fold yang sudah di-transform → (6) score pada validation fold. Gambar di bawah memplot alur ini. Perhatikan posisi langkah 3: transformer di-fit SETELAH split, DI DALAM fold — bukan sebelum split. Apa pun yang «belajar» dari data — mean/sd scaler, rata-rata imputer, skor seleksi fitur, komponen PCA, target encoding — WAJIB di-fit di dalam fold. Yang BOLEH di luar fold hanyalah aturan TETAP yang tidak belajar dari data: misal transformasi log yang kamu tetapkan dari pengetahuan domain, atau bin edges yang kamu tentukan sebelum melihat data.",
        "Di sklearn, pola yang menjamin aturan ini adalah Pipeline: Pipeline([(\"sc\", StandardScaler()), (\"sel\", SelectKBest(k=5)), (\"clf\", LogisticRegression(...))]) — lalu cross_val_score(pipe, X, y, cv=...) me-refit SELURUH pipeline di tiap fold: scaler dan selektor di-fit ulang hanya pada train fold, validation fold hanya di-transform. Bila fiturmu campuran numerik dan kategorikal, ColumnTransformer di dalam Pipeline yang sama: kolom numerik → StandardScaler, kolom kategorikal → OneHotEncoder — keduanya tetap di dalam fold. Dan untuk nested CV, pipeline itu masuk ke DALAM loop dalam juga: GridSearchCV(pipe, ...) memastikan tiap inner fold me-refit transformernya sendiri. Aturannya satu kalimat: transformer adalah BAGIAN dari model — ia masuk CV bersama estimator, bukan mendahului CV.",
        "Baik atau buruk: Pipeline bagus karena ia membuat kebocoran menjadi MUSTAHIL secara struktural — kamu tidak bisa «lupa» me-refit scaler, karena refit itu terjadi otomatis di tiap fold. Buruk bila kamu mengira membungkus estimator saja sudah cukup: Pipeline([(\"clf\", ...)]) tanpa transformer di dalamnya tidak melindungi apa-apa — scaler yang kamu fit manual sebelum cross_val_score tetap bocor. Buruk juga bila transformer-nya memakai LABEL: seleksi fitur atau target encoding yang di-fit memakai y dari seluruh data membocorkan label validation fold — dan itu kebocoran yang paling besar efeknya (lab 3 menunjukkan inflasi 0,14 pada data tanpa sinyal sama sekali [ilustrasi]).",
        "Mitigasi: sebelum menjalankan CV apa pun, jalankan checklist tiga pertanyaan: (1) Adakah langkah yang menghitung sesuatu dari data (mean, sd, skor, frekuensi) SEBELUM split? Bila ya, pindahkan ke dalam Pipeline. (2) Apakah transformer-ku memakai label y untuk fit? Bila ya, ia harus di dalam Pipeline — dan pikirkan dua kali apakah ia memang dibutuhkan. (3) Apakah fiturku memakai informasi dari baris lain (lag, rolling, target encoding)? Bila ya, pastikan jendelanya tidak melewati batas fold — untuk data waktu, ini beririsan dengan time-series split (langkah 12). Bila ketiga jawabanmu bersih, skor CV-mu mengukur model — bukan mengukur kebocoranmu sendiri.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Alur anti-leakage: data mentah, split atau fold, fit transformer pada train fold, transform validation fold, fit estimator, score; kunci: transformer di-fit hanya pada train fold">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Workflow anti-leakage — transformer di-fit DI DALAM fold</text>
<rect x="14" y="44" width="140" height="46" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="84" y="72" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Data mentah</text>
<rect x="168" y="44" width="140" height="46" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="238" y="72" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Split / fold</text>
<rect x="322" y="44" width="144" height="46" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<text x="394" y="64" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Fit transformer</text>
<text x="394" y="80" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">pada TRAIN fold</text>
<line x1="154" y1="67" x2="166" y2="67" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="166,63 166,71 174,67" fill="var(--chart-text)"/>
<line x1="308" y1="67" x2="320" y2="67" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="320,63 320,71 328,67" fill="var(--chart-text)"/>
<line x1="394" y1="90" x2="394" y2="106" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="390,106 398,106 394,114" fill="var(--chart-text)"/>
<rect x="322" y="108" width="144" height="46" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="394" y="128" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Transform</text>
<text x="394" y="144" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">VALIDATION fold</text>
<rect x="168" y="108" width="140" height="46" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="238" y="136" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Fit estimator</text>
<rect x="14" y="108" width="140" height="46" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="84" y="128" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Score</text>
<text x="84" y="144" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">(outer fold)</text>
<line x1="322" y1="131" x2="310" y2="131" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="310,127 310,135 302,131" fill="var(--chart-text)"/>
<line x1="168" y1="131" x2="156" y2="131" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="156,127 156,135 148,131" fill="var(--chart-text)"/>
<text x="240" y="182" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">KUNCI: transformer di-fit HANYA pada train fold</text>
<text x="240" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">validation fold hanya di-transform, tidak pernah dipakai untuk fit</text>
<text x="240" y="222" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">SALAH: fit scaler / selektor pada SEMUA data sebelum split — skor CV jadi optimistis (lab 3)</text>
</svg>`,
        alt: "Alur anti-leakage: data mentah → split/fold → fit transformer pada train fold → transform validation fold → fit estimator → score. Kunci: transformer di-fit hanya pada train fold.",
        caption: "Cara membaca: ikuti panah dari kiri atas (data mentah) ke kanan, turun, lalu ke kiri (score). Kotak bergaris tebal adalah kuncinya: fit transformer HANYA pada train fold. Interpretasi: transformer yang di-fit sebelum split sudah melihat validation fold — skor CV sesudahnya mengukur kebocoran, bukan model.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: «scaler itu preprocessing netral, bukan bagian model»",
        type: "pitfall",
        body: "Yang benar: StandardScaler MEMPELAJARI mean dan sd dari data — ia adalah bagian model yang di-fit, sama seperti koefisien LR. Fit scaler pada semua data sebelum CV sama bocornya dengan fit estimator pada semua data: validation fold sudah memengaruhi angka yang dipakai untuk mengubahnya. Di sklearn, letakkan scaler DI DALAM Pipeline supaya ia di-fit ulang di tiap fold — dan jangan pernah memanggil .fit() pada transformer di luar CV.",
      },
    },
    {
      id: "leakage",
      eyebrow: "Langkah 11 · Leakage dalam tuning",
      title: "Leakage dalam tuning: memilih dari test — dan mengapa biasnya di sini ~0",
      prose: [
        "Leakage dalam tuning terjadi bila kamu memakai test set untuk MEMILIH hyperparameter — misal mencoba 18 konfigurasi GBM, melihat skor test masing-masing, lalu melaporkan skor test konfigurasi terbaik sebagai «skor model». Itu curang: test set sudah tidak lagi menjadi wasit netral, ia sudah ikut memilih pemenang. Demo di data ini mengukur seberapa besar curangnya [notebook]. Untuk LR (grid C = 0,01; 0,1; 1; 10; 100): C terbaik menurut TEST adalah 1 (skor test 0,7426) — dan C terbaik menurut CV train adalah JUGA 1 (skor test 0,7426). Bias optimis: 0,7426 − 0,7426 = 0,0000. Untuk GBM: konfigurasi terbaik menurut test adalah (max_iter 100, max_depth 5, learning_rate 0,05) dengan skor test 0,7823 — konfigurasi yang SAMA dengan yang dipilih CV (skor CV 0,7865) — jadi bias optimisnya menurut rumus di bawah adalah 0,7823 − 0,7823 = 0,0000, sama seperti LR. Jangan tertukar dengan selisih 0,7823 − 0,7858 = −0,0035: 0,7858 adalah rata-rata nested CV atas lima outer-test yang berbeda, bukan skor test konfigurasi pilihan CV pada test set yang sama — selisih itu membandingkan dua PROTOKOL estimasi (single-split vs nested), bukan mengukur bias leakage.",
        "Nilai: MENGAPA biasnya ~0 di sini? Tiga alasan. Pertama, gain tuning-nya KECIL: skor CV antar-konfigurasi GBM hanya bergerak dalam rentang 0,7827–0,7865 (lebar 0,0038) — tidak ada konfigurasi «ajaib» yang bisa dipilih secara curang untuk mendongkrak skor. Kedua, konfigurasi terbaiknya SAMA baik dipilih lewat test maupun lewat CV — memilih lewat test tidak mengubah pilihan, jadi tidak ada yang bisa dibiaskan. Ketiga, datanya BESAR: train 24.000 dan test 6.000 baris membuat skor test stabil — noise pengukuran tiap skor kecil, dan selisih antar-konfigurasi pun hanya 0,0038.",
        "Baik atau buruk: bias ~0 di sini bagus sebagai HASIL, tapi berbahaya sebagai PELAJARAN bila disalahbaca: «leakage tidak berbahaya» adalah kesimpulan yang SALAH dari satu angka nol. Bias leakage MEMBESAR bila tiga kondisi di atas berbalik: (a) search space BESAR — ratusan konfigurasi, bukan 18; (b) data KECIL — test 500 baris, bukan 6.000, sehingga noise skornya besar; (c) kandidat-kandidatnya hampir SETARA — selisih antar-konfigurasi KECIL (di sini hanya 0,0038) sehingga ranking ditentukan noise, bukan sinyal: memilih yang «terlihat» terbaik lewat test sangat mungkin memilih noise. Sebagai gambaran [ilustrasi]: bila 100 konfigurasi yang sebenarnya setara masing-masing diukur dengan noise sd 0,01, nilai maksimum yang terpilih bisa terangkat sekitar 0,02–0,03 di atas nilai sebenarnya — semata-mata karena kamu mengambil yang tertinggi dari 100 undian.",
        "Mitigasi: JANGAN PERNAH memilih hyperparameter dari test set — pakai CV (atau nested CV) untuk memilih, dan sentuh test set hanya sekali, di akhir, untuk melaporkan. Bila kamu terlanjur memilih dari test, jangan laporkan skor test itu sebagai kinerja — laporkan nested CV sebagai angka jujurnya. Dan bila search space-mu besar atau datamu kecil, nested CV bukan lagi «nice-to-have» — ia wajib.",
      ],
      formula: String.raw`\mathrm{bias} = s_{\mathrm{test}}(\hat{\lambda}_{\mathrm{test}}) - s_{\mathrm{test}}(\hat{\lambda}_{\mathrm{CV}})`,
      formulaNote: "Bias optimis leakage: skor test dari konfigurasi yang dipilih LEWAT test, dikurangi skor test dari konfigurasi yang dipilih lewat CV — keduanya pada test set YANG SAMA. LR di sini: 0,7426 − 0,7426 = 0,0000. GBM di sini: 0,7823 − 0,7823 = 0,0000 (pemenang yang sama). Selisih 0,7823 − 0,7858 = −0,0035 adalah selisih protokol (single-split vs nested), bukan bias leakage.",
      tasks: [],
      note: {
        title: "Miskonsepsi: «bias leakage di sini 0, jadi leakage tidak berbahaya»",
        type: "pitfall",
        body: "Yang benar: bias 0,0000 (LR dan GBM) adalah hasil dari TIGA kondisi yang menguntungkan — gain tuning kecil (rentang CV hanya 0,0038), konfigurasi terbaik yang sama, dan data besar (test 6.000 baris). Ubah satu kondisi — search space ratusan konfigurasi, atau test 500 baris — dan biasnya membesar. Satu angka nol tidak membuktikan leakage aman; ia membuktikan leakage TIDAK SELALU besar — dan «tidak selalu» bukan «tidak pernah».",
      },
    },
    {
      id: "timeseries",
      eyebrow: "Langkah 12 · Time-series split",
      title: "Time-series split: CV acak pada data waktu adalah kebocoran",
      prose: [
        "Semua CV sejauh ini mengacak baris. Pada data UCI itu sah: baris nasabah tidak punya urutan waktu yang bermakna. Pada harga saham, mengacak adalah KEBOCORAN: bila baris «besok» masuk train dan baris «hari ini» masuk test, model belajar dari masa depan — dan fitur lag (harga kemarin) membuat kebocoran itu semakin parah, karena lag dari baris test bisa mengandung informasi yang tumpang tindih dengan train. Solusinya: time-series split dengan expanding window — train hanya memakai masa lalu, test hanya masa depan, dan jendela train MEMBESAR dari fold ke fold.",
        "Demo BBCA [notebook]: 480 return SIMPLE harian → 460 observasi setelah warm-up 20 baris untuk vol20/ma20; target = return besok naik (1) atau tidak (0), base rate naik 0,4196 (dihitung pada 460 observasi). Fitur (semuanya hanya memakai informasi sampai hari ini): lag1 (return kemarin), lag5_mean (rata-rata return 5 hari), vol20 (volatilitas 20 hari), ma20_dist (jarak harga ke rata-rata 20 hari), gspc_lag1 (return S&P 500 kemarin). Expanding window 5 fold: train membesar 80 → 156 → 232 → 308 → 384 baris, test selalu 76 baris berikutnya. Hasil per fold (ROC-AUC): fold 1: 0,5434; fold 2: 0,5056; fold 3: 0,5811; fold 4: 0,6279; fold 5: 0,5000. Mean ROC-AUC 0,5516; mean akurasi 0,5894 vs naive-majority 0,5710.",
        "Nilai: baca angka itu dengan jujur — sinyal arah BBCA hampir TIDAK ADA. ROC-AUC 0,5516 hanya sedikit di atas 0,5 (acak); keunggulan akurasi atas naive-majority hanya 0,5894 − 0,5710 = 0,0184; dan fold 5 tepat di 0,5000 — modelnya tidak lebih baik dari koin pada 76 hari terakhir. Fold 4 (0,6279) memang terlihat bagus, tapi ia satu dari lima — dan fold 3 punya akurasi 0,6842 dengan ROC hanya 0,5811, tanda akurasi di sini banyak dibantu oleh base rate, bukan oleh ranking yang bagus. Ini BUKAN model yang berhasil — ini model yang hampir tidak punya sinyal, dan lesson ini menyajikannya persis seperti itu.",
        "Gambar di bawah memplot ROC-AUC lima fold beserta garis acak 0,5 dan garis mean 0,5516. Satu diagnosis: sebaran skor fold time-series — dan seberapa dekat ia dengan acak.",
        "Baik atau buruk: expanding window bagus karena ia meniru cara model dipakai di dunia nyata — dilatih pada masa lalu, diuji pada masa depan yang belum terlihat. Buruk bila fold awalnya terlalu kecil (fold 1 hanya 80 baris train — modelnya hampir tidak belajar apa-apa) atau bila kamu mengabaikan regime change: 460 baris yang mencakup dua tahun bisa berisi rezim yang berbeda, dan mean lima fold menyembunyikan itu.",
        "Mitigasi: untuk data berurutan waktu, JANGAN PERNAH memakai K-fold acak — pakai TimeSeriesSplit (expanding) atau walk-forward dengan jendela geser. Laporkan skor PER FOLD, bukan hanya mean — fold yang memburuk di akhir (seperti fold 5 di 0,5000) adalah sinyal regime change yang layak diselidiki, bukan noise yang boleh dirata-ratakan begitu saja.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="ROC-AUC lima fold time-series BBCA: 0,5434; 0,5056; 0,5811; 0,6279; 0,5000; garis acak 0,5 dan mean 0,5516">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">ROC-AUC per fold — expanding window BBCA, target naik/tidak (LR)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,45</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,50</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,55</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,60</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,65</text>
<line x1="52" y1="162.0" x2="466" y2="162.0" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="460" y="156.0" text-anchor="end" font-size="10" fill="var(--c2)" font-family="var(--font-ui)">acak = 0,5</text>
<line x1="52" y1="116.6" x2="466" y2="116.6" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="460" y="110.6" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">mean 0,5516</text>
<polyline points="100.0,123.8 180.0,157.1 260.0,90.6 340.0,49.4 420.0,162.0" fill="none" stroke="var(--c1)" stroke-width="2"/>
<circle cx="100.0" cy="123.8" r="4" fill="var(--c1)"/>
<text x="100" y="110.8" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5434</text>
<circle cx="180.0" cy="157.1" r="4" fill="var(--c1)"/>
<text x="180" y="144.1" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5056</text>
<circle cx="260.0" cy="90.6" r="4" fill="var(--c1)"/>
<text x="260" y="77.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5811</text>
<circle cx="340.0" cy="49.4" r="4" fill="var(--c1)"/>
<text x="340" y="36.4" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6279</text>
<circle cx="420.0" cy="162.0" r="4" fill="var(--c1)"/>
<text x="420" y="180.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5000</text>
<text x="100" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Fold 1</text>
<text x="180" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Fold 2</text>
<text x="260" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Fold 3</text>
<text x="340" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Fold 4</text>
<text x="420" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Fold 5</text>
</svg>`,
        alt: "ROC-AUC lima fold time-series BBCA: 0,5434; 0,5056; 0,5811; 0,6279; 0,5000; garis acak 0,5 dan garis mean 0,5516.",
        caption: "Cara membaca: sumbu-x = fold 1–5 (waktu berjalan ke kanan, train membesar 80 → 384 baris), sumbu-y = ROC-AUC 0,45–0,65. Garis putus-putus bawah = acak (0,5), garis putus-putus atas = mean 0,5516 [notebook]. Interpretasi: semua fold dekat dengan acak — fold 5 tepat di 0,5000. Sinyal arah BBCA hampir tidak ada; ini bukan model yang berhasil.",
      },
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 13 · Lab 1",
      title: "Lab: K-fold manual — mean ± sd dari lima skor fold",
      prose: [
        "Sekarang giliranmu menghitung ringkasan CV dengan tangan — tanpa library, hanya aritmetika. Lima skor fold GBM default (5-fold stratified CV) sudah diberikan [notebook]: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808. Tugasmu tiga baris: rata-rata, sd populasi, dan band mean ± sd.",
        "Hasil yang diharapkan [lab]: mean 0,7840; sd 0,0059; band [0,7781; 0,7899]. Perhatikan: sd di sini memakai pembagi n = 5 (sd POPULASI, seperti numpy std default) — bukan pembagi n−1. Bila kamu memakai pembagi 4, sd-mu 0,0066 dan check akan gagal — dan itu memang sengaja: lesson ini memakai konvensi yang sama dengan file kanonis.",
        "Setelah lab jalan, bandingkan dengan single-split 0,7823: ia berada DI DALAM band [0,7781; 0,7899] — konsisten dengan CV, bukan kejutan. Bandingkan juga dengan LR (mean 0,7560, sd 0,0056, band [0,7504; 0,7616]): band LR dan GBM tidak bersinggungan sama sekali.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi mean_cv: rata-rata 5 skor fold" },
        { id: "t2", text: "Lengkapi sd_cv: sd populasi = akar rata-rata kuadrat selisih dari mean (pembagi n, bukan n-1)" },
        { id: "t3", text: "Lengkapi lo dan hi: band mean +/- sd, lalu bandingkan single-split 0,7823 dengan band itu" },
      ],
      expected: "mean: 0.7840\nsd: 0.0059\nband: [0.7781, 0.7899]",
      hints: [
        "Rata-rata: sum(folds) / n — jumlahnya 3,9198, bagi 5.",
        "sd populasi: (sum((s - mean_cv) ** 2 for s in folds) / n) ** 0.5 — pembagi n = 5, bukan 4.",
        "Band: lo = mean_cv - sd_cv; hi = mean_cv + sd_cv. Single-split 0,7823 ada di dalam band — konsisten dengan CV.",
      ],
      code: {
        starter: `# K-fold manual: mean +/- sd dari 5 skor fold GBM (5-fold stratified CV) [notebook]
# Skor fold kanonis (ROC-AUC): 0.7940, 0.7762, 0.7832, 0.7856, 0.7808
# sd di sini = sd POPULASI (pembagi n, seperti numpy std default) — bukan sd sampel.

folds = [0.7940, 0.7762, 0.7832, 0.7856, 0.7808]
n = len(folds)

mean_cv = 0.0  # TODO: rata-rata 5 skor fold
sd_cv = 0.0  # TODO: sd populasi = akar rata-rata kuadrat selisih dari mean
lo = 0.0  # TODO: ujung bawah band = mean - sd
hi = 0.0  # TODO: ujung atas band = mean + sd
print(f"mean: {mean_cv:.4f}")
print(f"sd: {sd_cv:.4f}")
print(f"band: [{lo:.4f}, {hi:.4f}]")`,
        lockLines: 6,
        solution: `# K-fold manual: mean +/- sd dari 5 skor fold GBM (5-fold stratified CV) [notebook]
# Skor fold kanonis (ROC-AUC): 0.7940, 0.7762, 0.7832, 0.7856, 0.7808
# sd di sini = sd POPULASI (pembagi n, seperti numpy std default) — bukan sd sampel.

folds = [0.7940, 0.7762, 0.7832, 0.7856, 0.7808]
n = len(folds)

mean_cv = sum(folds) / n
sd_cv = (sum((s - mean_cv) ** 2 for s in folds) / n) ** 0.5
lo = mean_cv - sd_cv
hi = mean_cv + sd_cv
print(f"mean: {mean_cv:.4f}")
print(f"sd: {sd_cv:.4f}")
print(f"band: [{lo:.4f}, {hi:.4f}]")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean_cv", value: 0.784, tol: 0.0001, label: "`mean_cv` seharusnya 0.7840", msg: "Mean 5 skor fold GBM: 0,7840." },
          { kind: "equal", task: "t2", name: "sd_cv", value: 0.0059, tol: 0.0001, label: "`sd_cv` seharusnya 0.0059", msg: "SD populasi 5 skor fold GBM: 0,0059 (pembagi n = 5)." },
          { kind: "stdout_matches", task: "t3", pattern: "mean: 0\\.7840", label: "Output menampilkan mean 0,7840", msg: "Mean CV GBM 5-fold: 0,7840." },
          { kind: "stdout_matches", task: "t3", pattern: "sd: 0\\.0059", label: "Output menampilkan sd 0,0059", msg: "SD antar-fold GBM: 0,0059." },
          { kind: "stdout_matches", task: "t3", pattern: "band: \\[0\\.7781, 0\\.7899\\]", label: "Output menampilkan band [0,7781; 0,7899]", msg: "Band mean ± sd: [0,7781; 0,7899] — single-split 0,7823 ada di dalamnya." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 14 · Lab 2",
      title: "Lab: nested vs single-split — selisihnya, dan mana yang dilaporkan",
      prose: [
        "Lab kedua memakai tiga angka kanonis GBM [notebook]: nested CV 0,7858; single-split 0,7823; CV biasa 0,7840. Tugasmu dua selisih — lalu satu keputusan: angka mana yang kamu laporkan sebagai klaim kinerja model tertala?",
        "Hasil yang diharapkan [lab]: nested − single-split = 0,0035; nested − CV biasa = 0,0018; laporkan: nested CV 0,7858. Perhatikan TANDA selisih pertama: POSITIF — nested lebih TINGGI dari single-split. Bila kamu menulis −0,0035, kamu mengulang miskonsepsi langkah 9 (bahwa nested «selalu lebih rendah»).",
        "Keputusannya: laporkan nested CV 0,7858 — karena hanya nested yang mengukur prosedur tuning tanpa memakai data yang sama untuk memilih dan menilai. Single-split 0,7823 tetap boleh disebut sebagai pemeriksaan kewarasan, tapi bukan klaim utama. Dan ingat: selisih 0,0018 terhadap CV biasa itu kecil dibanding sd antar-fold 0,0068 — gain tuning yang jujur di sini kecil.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi d_single: selisih nested CV minus single-split (perhatikan tandanya)" },
        { id: "t2", text: "Lengkapi d_plain: selisih nested CV minus CV biasa" },
        { id: "t3", text: "Jalankan dan putuskan: angka mana yang dilaporkan sebagai klaim kinerja model tertala" },
      ],
      expected: "nested - single-split: 0.0035\nnested - cv biasa: 0.0018\nlaporkan: nested CV 0.7858",
      hints: [
        "d_single = nested - single = 0,7858 - 0,7823 — positif, bukan negatif.",
        "d_plain = nested - plain = 0,7858 - 0,7840.",
        "Yang dilaporkan adalah nested CV 0,7858: hanya ia yang memisahkan pemilihan dan penilaian.",
      ],
      code: {
        starter: `# Nested vs single-split vs CV biasa (GBM, ROC-AUC) [notebook]
# nested = 0.7858 | single-split = 0.7823 | cv biasa = 0.7840

nested = 0.7858
single = 0.7823
plain = 0.7840

d_single = 0.0  # TODO: nested - single-split
d_plain = 0.0  # TODO: nested - cv biasa
print(f"nested - single-split: {d_single:.4f}")
print(f"nested - cv biasa: {d_plain:.4f}")
print(f"laporkan: nested CV {nested:.4f}")`,
        lockLines: 6,
        solution: `# Nested vs single-split vs CV biasa (GBM, ROC-AUC) [notebook]
# nested = 0.7858 | single-split = 0.7823 | cv biasa = 0.7840

nested = 0.7858
single = 0.7823
plain = 0.7840

d_single = nested - single
d_plain = nested - plain
print(f"nested - single-split: {d_single:.4f}")
print(f"nested - cv biasa: {d_plain:.4f}")
print(f"laporkan: nested CV {nested:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "d_single", value: 0.0035, tol: 0.0001, label: "`d_single` seharusnya 0.0035", msg: "Nested − single-split = +0,0035: nested LEBIH TINGGI, bukan lebih rendah." },
          { kind: "equal", task: "t2", name: "d_plain", value: 0.0018, tol: 0.0001, label: "`d_plain` seharusnya 0.0018", msg: "Nested − CV biasa = 0,0018 — gain tuning yang jujur itu kecil." },
          { kind: "stdout_matches", task: "t1", pattern: "nested - single-split: 0\\.0035", label: "Output menampilkan nested − single-split 0,0035", msg: "Selisih nested vs single-split: +0,0035." },
          { kind: "stdout_matches", task: "t2", pattern: "nested - cv biasa: 0\\.0018", label: "Output menampilkan nested − CV biasa 0,0018", msg: "Selisih nested vs CV biasa: 0,0018." },
          { kind: "stdout_matches", task: "t3", pattern: "laporkan: nested CV 0\\.7858", label: "Output menampilkan laporkan nested CV 0,7858", msg: "Klaim yang dilaporkan: nested CV 0,7858." },
        ],
      },
    },
    {
      id: "lab-pipeline",
      eyebrow: "Langkah 15 · Lab 3",
      title: "Lab: Pipeline — scaler & seleksi fitur DI DALAM fold, bukan sebelum CV",
      requires: ["scikit-learn", "numpy"],
      prose: [
        "Sekarang buktikan sendiri bahwa preprocessing di luar fold BUKAN masalah teori — ia menggelembungkan skor secara terukur. Lab ini memakai data SINTETIS [ilustrasi]: 200 baris, 50 fitur PURE NOISE (tidak ada satu pun fitur yang berhubungan dengan label), y acak 0/1. Pada data seperti ini, model yang jujur HARUS mendapat ROC-AUC sekitar 0,5 — tidak ada sinyal yang bisa dipelajari. Bila satu cara pengukuran memberi 0,63, selisih itu BUKAN sinyal — itu leakage.",
        "Hasil yang diharapkan [lab]: cara SALAH (scaler + SelectKBest k=5 di-fit pada SEMUA data sebelum CV) memberi skor_bocor 0,6340; cara BENAR (keduanya di dalam Pipeline, di-fit ulang tiap fold) memberi skor_benar 0,4915 — dekat dengan 0,5, seperti seharusnya pada data tanpa sinyal. Selisihnya 0,1425: itulah harga kebocoran — pada data yang TIDAK PUNYA sinyal sama sekali, preprocessing yang bocor menciptakan «sinyal» palsu sebesar 0,14. Perhatikan: scaler-nya sendiri hampir tidak berperan di sini (fitur sudah N(0,1)) — yang membocorkan adalah SelectKBest: ia memakai label y dari SEMUA 200 baris, termasuk validation fold, untuk memilih 5 fitur yang «kebetulan» paling berkorelasi dengan y.",
        "Setelah lab jalan, bandingkan dengan lesson ini: di data UCI yang asli, leakage dari preprocessing tidak akan se-dramatis 0,14 — karena di sana ada sinyal asli yang mendominasi. Tapi arahnya sama: skor yang diukur dengan preprocessing bocor SELALU terlalu tinggi, dan besarnya membesar bila fitur banyak, data kecil, atau seleksinya memakai label. Itulah mengapa aturannya tanpa pengecualian: transformer di dalam Pipeline, selalu.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi X_bocor dan skor_bocor: SelectKBest(f_classif, k=5) di-fit pada X_scaled + y SEBELUM CV, lalu cross_val_score" },
        { id: "t2", text: "Lengkapi pipe dan skor_benar: Pipeline scaler + SelectKBest + LR, lalu cross_val_score pada X mentah" },
        { id: "t3", text: "Lengkapi selisih dan bocor_lebih_tinggi, lalu jalankan dan baca vonisnya" },
      ],
      expected: "skor_bocor=0.6340\nskor_benar=0.4915\nselisih=0.1425\nbocor_lebih_tinggi=True",
      hints: [
        "X_bocor = SelectKBest(f_classif, k=5).fit(X_scaled, y).transform(X_scaled) — fit memakai y dari SEMUA baris, itulah bocornya.",
        "skor_bocor = cross_val_score(LogisticRegression(max_iter=1000), X_bocor, y, cv=cv, scoring=\"roc_auc\").mean().",
        "pipe = Pipeline([(\"sc\", StandardScaler()), (\"sel\", SelectKBest(f_classif, k=5)), (\"clf\", LogisticRegression(max_iter=1000))]) — cross_val_score me-refit pipeline di tiap fold.",
        "selisih = skor_bocor - skor_benar (positif, sekitar 0,14); bocor_lebih_tinggi = skor_bocor > skor_benar.",
      ],
      code: {
        starter: `# Lab 3: Pipeline — scaler & seleksi fitur DI DALAM fold [ilustrasi]
# Data SINTETIS: 200 baris, 50 fitur PURE NOISE (tanpa sinyal), y acak 0/1.
# AUC berapa pun di atas 0,5 di sini adalah artefak leakage, bukan sinyal.

import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(7)
X = rng.normal(0, 1, size=(200, 50))
y = rng.integers(0, 2, size=200)
cv = StratifiedKFold(5, shuffle=True, random_state=42)

# CARA SALAH: scaler + seleksi fitur di-fit pada SEMUA data, SEBELUM CV
X_scaled = StandardScaler().fit(X).transform(X)
X_bocor = None  # TODO: SelectKBest(f_classif, k=5) di-fit pada X_scaled + y, lalu transform
skor_bocor = 0.0  # TODO: cross_val_score LR pada X_bocor (cv=cv, scoring="roc_auc"), lalu .mean()

# CARA BENAR: scaler + seleksi fitur DI DALAM Pipeline — di-fit ulang tiap fold
pipe = None  # TODO: Pipeline([("sc", StandardScaler()), ("sel", SelectKBest(f_classif, k=5)), ("clf", LogisticRegression(max_iter=1000))])
skor_benar = 0.0  # TODO: cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc").mean()

selisih = 0.0  # TODO: skor_bocor - skor_benar
bocor_lebih_tinggi = False  # TODO: skor_bocor > skor_benar
print(f"skor_bocor={skor_bocor:.4f}")
print(f"skor_benar={skor_benar:.4f}")
print(f"selisih={selisih:.4f}")
print(f"bocor_lebih_tinggi={bocor_lebih_tinggi}")`,
        lockLines: 18,
        solution: `# Lab 3: Pipeline — scaler & seleksi fitur DI DALAM fold [ilustrasi]
# Data SINTETIS: 200 baris, 50 fitur PURE NOISE (tanpa sinyal), y acak 0/1.
# AUC berapa pun di atas 0,5 di sini adalah artefak leakage, bukan sinyal.

import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(7)
X = rng.normal(0, 1, size=(200, 50))
y = rng.integers(0, 2, size=200)
cv = StratifiedKFold(5, shuffle=True, random_state=42)

# CARA SALAH: scaler + seleksi fitur di-fit pada SEMUA data, SEBELUM CV
X_scaled = StandardScaler().fit(X).transform(X)
X_bocor = SelectKBest(f_classif, k=5).fit(X_scaled, y).transform(X_scaled)
skor_bocor = cross_val_score(LogisticRegression(max_iter=1000), X_bocor, y, cv=cv, scoring="roc_auc").mean()

# CARA BENAR: scaler + seleksi fitur DI DALAM Pipeline — di-fit ulang tiap fold
pipe = Pipeline([("sc", StandardScaler()), ("sel", SelectKBest(f_classif, k=5)), ("clf", LogisticRegression(max_iter=1000))])
skor_benar = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc").mean()

selisih = skor_bocor - skor_benar
bocor_lebih_tinggi = skor_bocor > skor_benar
print(f"skor_bocor={skor_bocor:.4f}")
print(f"skor_benar={skor_benar:.4f}")
print(f"selisih={selisih:.4f}")
print(f"bocor_lebih_tinggi={bocor_lebih_tinggi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor_bocor", value: 0.634, tol: 0.01, label: "`skor_bocor` seharusnya sekitar 0.6340", msg: "Cara SALAH (seleksi fitur sebelum CV): skor 0,6340 — pada data TANPA sinyal." },
          { kind: "equal", task: "t2", name: "skor_benar", value: 0.4915, tol: 0.01, label: "`skor_benar` seharusnya sekitar 0.4915", msg: "Cara BENAR (Pipeline, di-fit ulang tiap fold): skor 0,4915 — dekat dengan 0,5, seperti seharusnya." },
          { kind: "equal", task: "t3", name: "selisih", value: 0.1425, tol: 0.01, label: "`selisih` seharusnya sekitar 0.1425", msg: "Inflasi akibat leakage: 0,1425 — «sinyal» palsu sebesar itu dari data tanpa sinyal." },
          { kind: "stdout_matches", task: "t1", pattern: "skor_bocor=0\\.63", label: "Output menampilkan skor_bocor sekitar 0,63", msg: "Skor bocor: 0,6340." },
          { kind: "stdout_matches", task: "t2", pattern: "skor_benar=0\\.49", label: "Output menampilkan skor_benar sekitar 0,49", msg: "Skor benar (Pipeline): 0,4915." },
          { kind: "stdout_matches", task: "t3", pattern: "selisih=0\\.14", label: "Output menampilkan selisih sekitar 0,14", msg: "Selisih bocor − benar: 0,1425." },
          { kind: "stdout_matches", task: "t3", pattern: "bocor_lebih_tinggi=True", label: "Output menampilkan bocor_lebih_tinggi=True", msg: "Vonis: cara yang bocor memberi skor LEBIH TINGGI — padahal datanya tanpa sinyal." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 16 · Checkpoint",
      title: "Checkpoint: ukur berkali-kali, pilih dengan jujur, hormati waktu",
      prose: [
        "Rangkuman: satu split train-test adalah satu undian — LR single-split 0,7426 vs CV 0,7560 (selisih 0,0134) dan GBM 0,7823 vs 0,7840 (selisih 0,0017) [notebook]. K-fold membagi data menjadi K lipatan, tiap baris menjadi test tepat sekali; K = 5 adalah default yang wajar. Stratified K-fold menjaga base rate 0,2212 (sekitar 1.327 default per fold 6.000 baris) — tanpa stratifikasi, proporsi default satu fold bisa bergoyang ±0,0054 (1 sd) [ilustrasi]. Mean beserta sd antar-fold-nya dibaca berdampingan: GBM 0,7840 (sd antar-fold 0,0059; band [0,7781; 0,7899]) vs LR 0,7560 (sd antar-fold 0,0056; band [0,7504; 0,7616]) — band tidak bersinggungan, GBM lebih baik dengan jelas; sd antar-fold bukan ketidakpastian mean. Ketidakpastian tuning: lima skor outer nested GBM (0,7974; 0,7782; 0,7878; 0,7859; 0,7799) memberi mean 0,7858, sd 0,0068, rentang 0,7782–0,7974 — SE dari mean ≈ 0,0030 dan CI 95% NAIF [0,7799; 0,7918], naif karena kelima fold tidak independen (train tumpang tindih 75%), jadi CI yang benar lebih lebar; selisih nested vs CV biasa (0,0018) lebih kecil dari SE — klaim «tuning memperbaiki model» tidak bisa ditegakkan dari angka ini saja. Nested CV (outer 5 / inner 3, grid 18 konfigurasi, 275 kali latih) memberi estimasi JUJUR untuk prosedur tuning: GBM 0,7858 (sd antar-fold 0,0068) — LEBIH TINGGI dari single-split 0,7823 (+0,0035) dan hanya 0,0018 di atas CV biasa 0,7840; konfigurasi terbaik berganti-ganti tiap outer fold (fold 1: 50/5/0,1; fold 2: 200/3/0,05; fold 3: 100/5/0,05; fold 4: 100/3/0,1; fold 5: 50/5/0,05) karena permukaan tuningnya datar (rentang CV grid 0,7827–0,7865). Workflow anti-leakage: transformer apa pun yang belajar dari data (scaler, imputer, seleksi fitur, PCA) WAJIB di-fit DI DALAM fold — Pipeline/ColumnTransformer menjaminnya secara struktural; lab 3 membuktikannya pada data sintetis tanpa sinyal [ilustrasi]: seleksi fitur sebelum CV memberi 0,6340, di dalam Pipeline 0,4915 — inflasi leakage 0,1425 dari «sinyal» yang tidak ada. Leakage dalam tuning di sini hampir nol — LR bias 0,0000 (C terbaik menurut test = menurut CV = 1), GBM bias 0,0000 (konfigurasi terbaik menurut test = menurut CV = 100/5/0,05; skor test yang sama 0,7823) — karena gain tuning kecil, pilihan yang sama, dan data besar; bias MEMBESAR bila search space besar, data kecil, atau kandidat-kandidatnya hampir setara (selisih antar-konfigurasi kecil dibanding noise test). Time-series BBCA (expanding window 5 fold, train 80 → 384, test 76): mean ROC-AUC 0,5516, akurasi 0,5894 vs naive-majority 0,5710, fold 5 tepat 0,5000 — sinyal arah hampir tidak ada, dan itu disajikan jujur sebagai bukan-model-yang-berhasil. Lab: K-fold manual — mean 0,7840, sd 0,0059, band [0,7781; 0,7899]; nested vs single-split — selisih +0,0035 dan +0,0018, laporkan nested CV 0,7858; Pipeline — skor bocor 0,6340 vs benar 0,4915, selisih 0,1425.",
        "Guided task di Colab — notebook mlf-m62-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data UCI dan harga BBCA: flagship single-split, CV 5-fold, nested CV GBM, demo leakage, dan time-series split BBCA. Catatan: cell nested CV di notebook memakai subset 8 konfigurasi (detail implementasi notebook, bukan angka kanonis) dari grid kanonis 18 (dinyatakan di notebook, Langkah 3) karena grid penuh tidak selesai dalam batas waktu VM bersama — hasilnya dibandingkan ke kanonis 0,7858 dalam toleransi 0,005. Tautan Colab: https://colab.research.google.com/drive/1aDGhlbTOMl_BXGcpnFRsvZNNkrx8ynbu",
        "Lanjut: MLF-M6.3 — Regularisasi & Early Stopping: bagaimana menahan model agar tidak menghafal train — dari penalti L1/L2 sampai berhenti sebelum overfitting.",
      ],
      tasks: [],
      quiz: [
        {
          q: "LR pada data UCI: 5-fold stratified CV memberi mean ROC-AUC 0,7560 (sd antar-fold 0,0056). Apa bacaan yang benar?",
          options: [
            { text: "Rata-rata lima skor fold 0,7560, dengan sebaran antar-fold sd 0,0056 — band satu-sd [0,7504; 0,7616]", why: "Benar: mean 0,7560 dari fold 0,7634; 0,7476; 0,7600; 0,7523; 0,7568 [notebook]; sd 0,0056 adalah sebaran antar-fold, dan bandnya [0,7504; 0,7616].", correct: true },
            { text: "Skor LR yang sebenarnya 0,7560, dengan ketidakpastian ±0,0056 pada mean-nya", why: "Salah: 0,0056 adalah sd ANTAR-FOLD, bukan ketidakpastian mean. Ketidakpastian mean kira-kira sd/√5 ≈ 0,0025 [ilustrasi] — dan itu pun masih optimis karena skor fold saling berkorelasi." },
            { text: "LR pasti lebih buruk dari GBM karena 0,7560 < 0,7840, tanpa perlu melihat sd", why: "Kesimpulannya benar pada data ini, tapi alasannya tidak lengkap: yang membuatnya meyakinkan adalah band keduanya TIDAK bersinggungan ([0,7504; 0,7616] vs [0,7781; 0,7899]) — selisih 0,0280 jauh melampaui sd ~0,006." },
            { text: "Mean 0,7560 adalah skor model final yang dilatih pada seluruh 30.000 baris", why: "Salah: tiap model fold hanya dilatih pada 24.000 baris. CV mengestimasi model yang dilatih pada 80% data — sedikit lebih pesimis daripada model final." },
          ],
        },
        {
          q: "Mengapa dipakai StratifiedKFold, bukan KFold biasa, pada data UCI (base rate 0,2212)?",
          options: [
            { text: "Agar tiap fold berisi sekitar 1.327 nasabah gagal bayar (22,12%) — skor fold jadi sebanding", why: "Benar: stratifikasi menjaga base rate 0,2212 di tiap fold 6.000 baris [notebook]. Tanpa itu, proporsi default satu fold bisa bergoyang ±0,0054 (1 sd) [ilustrasi] dan skor fold tidak lagi sebanding.", correct: true },
            { text: "Agar tiap fold berisi jumlah nasabah gagal bayar yang SAMA PERSIS sampai satu baris", why: "Salah: stratifikasi menjaga proporsi sedekat mungkin — 6.636 default dibagi 5 fold tidak bisa persis sama (1.327,2 per fold), jadi ada fold berisi 1.327 dan ada yang 1.328." },
            { text: "Karena KFold biasa tidak bisa dipakai pada data klasifikasi sama sekali", why: "Salah: KFold biasa BISA dipakai pada klasifikasi — hanya saja ia tidak menjamin keseimbangan kelas tiap fold, sehingga skor fold-nya lebih berisik." },
            { text: "Agar model dilatih lebih cepat — stratifikasi mengurangi jumlah fit", why: "Salah: stratifikasi tidak mengubah jumlah fit sama sekali (tetap 5 kali latih untuk CV 5-fold) — ia hanya mengubah CARA baris dibagi ke fold." },
          ],
        },
        {
          q: "Single-split LR 0,7426 vs CV 0,7560 (selisih 0,0134). Apa yang ditunjukkan selisih ini?",
          options: [
            { text: "CV salah — skor yang benar adalah single-split karena test set-nya belum pernah dipakai", why: "Salah: test set single-split JUGA dipakai sebagai satu-satunya pengukuran — dan ia kebetulan sedikit lebih sulit (0,7426 bahkan di bawah skor fold CV terendah 0,7476). Satu split tidak lebih «benar» daripada rata-rata lima split." },
            { text: "Satu split adalah satu undian: test set tunggal itu sedikit lebih sulit, sehingga single-split meremehkan LR sebesar 0,0134", why: "Benar: single-split 0,7426 berada di bawah seluruh lima skor fold CV (terendah 0,7476) [notebook]. CV merata-ratakan lima undian — itulah mengapa ia lebih stabil.", correct: true },
            { text: "Model LR memburuk saat diuji dengan CV karena CV melatih pada data yang lebih sedikit", why: "Salah arah: model fold CV dilatih pada 24.000 baris (SAMA dengan train single-split) — bukan lebih sedikit. Selisihnya berasal dari test set yang berbeda, bukan dari ukuran train." },
            { text: "Selisih 0,0134 membuktikan LR tidak stabil dan tidak boleh dipakai", why: "Salah: 0,0134 adalah goyangan PENGUKURAN, bukan ketidakstabilan model — sd antar-fold LR hanya 0,0056. Yang goyang adalah satu test set tunggal, bukan LR-nya." },
          ],
        },
        {
          q: "Apa yang diestimasi oleh loop LUAR (outer) pada nested CV?",
          options: [
            { text: "Skor konfigurasi hyperparameter terbaik yang dipilih loop dalam", why: "Hampir — tapi tidak tepat: skor outer mengukur kinerja PROSEDUR tuning (pilih-lewat-inner lalu latih), bukan satu konfigurasi tertentu. Buktinya: konfigurasi terbaik berbeda-beda di tiap outer fold (fold 1: 50/5/0,1; fold 2: 200/3/0,05; dst.)." },
            { text: "Kinerja prosedur tuning secara keseluruhan — karena tiap outer fold memakai konfigurasi yang dipilih HANYA oleh inner CV-nya", why: "Benar: outer-test fold tidak pernah menyentuh pemilihan hyperparameter. Skor outer 0,7974; 0,7782; 0,7878; 0,7859; 0,7799 [notebook] mengukur «seberapa bagus proses pilih-dan-latih ini», bukan satu konfigurasi.", correct: true },
            { text: "Skor model final yang dilatih pada seluruh data", why: "Salah: nested CV tidak pernah melatih model final pada seluruh data — ia melatih lima model pada 24.000 baris (outer-train). Model final dipilih terpisah dengan grid search pada semua data." },
            { text: "Rata-rata skor inner CV dari kelima outer fold", why: "Salah: rata-rata skor INNER adalah skor yang terkontaminasi pemilihan (dipakai untuk memilih). Yang dilaporkan adalah rata-rata skor OUTER (0,7858) — skor pada data yang tidak ikut memilih." },
          ],
        },
        {
          q: "Nested CV GBM 0,7858 vs single-split 0,7823 (selisih +0,0035). Apa bacaan yang benar?",
          options: [
            { text: "Nested CV gagal — seharusnya ia lebih rendah dari single-split karena ia «menghukum» tuning", why: "Salah: tidak ada aturan bahwa nested harus lebih rendah. Nested memberi estimasi JUJUR (tak-bias), yang bisa di atas atau di bawah single-split tergantung data dan keberuntungan split-nya." },
            { text: "Nested memberi estimasi jujur yang di sini justru LEBIH TINGGI — karena gain tuning kecil dan single-split-nya kebetulan pesimis", why: "Benar: selisih +0,0035 [notebook]; gain tuning jujur hanya 0,0018 atas CV biasa, dan single-split 0,7823 berada di bawah mean CV 0,7840. Jujur ≠ selalu lebih rendah.", correct: true },
            { text: "Selisih +0,0035 membuktikan tuning GBM merugikan — model tertala lebih buruk dari default", why: "Salah: yang dibandingkan di sini adalah METODE ESTIMASI (nested vs single-split), bukan model (tertalla vs default). Perbandingan model yang benar: nested tertala 0,7858 vs CV biasa default 0,7840 — tertala sedikit LEBIH BAIK (+0,0018)." },
            { text: "Angka 0,7858 adalah skor model final dan boleh dilaporkan tanpa kualifikasi", why: "Salah: 0,7858 mengestimasi prosedur tuning pada model yang dilatih pada 24.000 baris per fold. Model final (seluruh data, satu konfigurasi) skornya tidak diukur oleh nested CV." },
          ],
        },
        {
          q: "Demo leakage LR: C terbaik menurut test = 1, C terbaik menurut CV train = 1, bias optimis 0,0000. Mengapa biasnya nol?",
          options: [
            { text: "Karena test set tidak pernah dipakai sama sekali dalam demo ini", why: "Salah: demo ini SENGAJA memakai test untuk memilih (itulah definisi leakage yang diukur) — lalu membandingkannya dengan pilihan lewat CV. Test dipakai; yang nol adalah SELISIH hasilnya." },
            { text: "Karena gain tuning kecil, konfigurasi terbaiknya sama lewat kedua cara, dan datanya besar (test 6.000 baris)", why: "Benar: rentang CV antar-C hanya 0,7568–0,7581; C = 1 menang lewat test maupun CV (skor test 0,7426 di kedua cara) [notebook]; test 6.000 baris membuat skornya stabil. Ketiganya bersama-sama membuat bias 0,0000.", correct: true },
            { text: "Karena LR tidak punya hyperparameter yang bisa bocor", why: "Salah: LR punya C (lima nilai diuji: 0,01; 0,1; 1; 10; 100) — dan skor CV-nya memang berbeda-beda (0,7568–0,7581). Leakage mungkin; hanya saja di sini hasilnya nol." },
            { text: "Karena bias 0,0000 membuktikan memilih hyperparameter dari test itu aman", why: "Salah — ini miskonsepsi yang diperingatkan lesson ini: bias nol di sini bergantung pada tiga kondisi yang menguntungkan. Dengan search space ratusan konfigurasi atau test 500 baris, biasnya membesar." },
          ],
        },
        {
          q: "Kapan bias leakage dalam tuning MEMBESAR?",
          options: [
            { text: "Bila search space besar (ratusan konfigurasi), data kecil (test ratusan baris), atau kandidat-kandidatnya hampir setara (selisih antar-konfigurasi kecil)", why: "Benar: makin banyak konfigurasi yang dicoba lewat test, makin besar peluang memilih noise tertinggi; makin kecil test, makin besar noise tiap skor; makin setara kandidat-kandidatnya, makin besar peluang ranking ditentukan noise — selisih besar justru memudahkan pemilihan yang benar.", correct: true },
            { text: "Bila memakai nested CV — karena loop dalamnya memakai data yang sama berulang kali", why: "Salah: nested CV justru OBAT leakage — loop dalam memilih, loop luar menilai pada data yang tidak ikut memilih. Biasnya tidak membesar karena nested; ia mengecil." },
            { text: "Bila datanya besar dan search space-nya kecil — seperti demo LR di lesson ini", why: "Terbalik: demo LR (test 6.000 baris, 5 nilai C) memberi bias 0,0000 PERSIS karena datanya besar dan search space-nya kecil." },
            { text: "Bila memakai stratified K-fold — karena stratifikasi membocorkan label ke fold test", why: "Salah: stratifikasi hanya memakai label untuk MEMBAGI baris secara seimbang — ia tidak membocorkan label ke model. Model tetap tidak melihat label test saat berlatih." },
          ],
        },
        {
          q: "Time-series BBCA: expanding window 5 fold memberi mean ROC-AUC 0,5516, akurasi 0,5894 vs naive-majority 0,5710, dan fold 5 tepat 0,5000. Apa bacaan yang benar?",
          options: [
            { text: "Model berhasil — ROC 0,5516 di atas 0,5 dan akurasi mengalahkan naive-majority", why: "Salah: 0,5516 hanya sedikit di atas acak (0,5); keunggulan akurasi hanya 0,0184; dan fold 5 tepat 0,5000 — model tidak lebih baik dari koin pada 76 hari terakhir. Ini hampir-tidak-ada-sinyal, bukan keberhasilan." },
            { text: "Sinyal arah BBCA hampir tidak ada — model ini tidak layak dipakai untuk trading, dan angka itu dilaporkan jujur apa adanya", why: "Benar: mean ROC 0,5516 [notebook] dekat dengan acak; akurasi 0,5894 vs naive 0,5710 (selisih 0,0184); fold 5 di 0,5000. Kesimpulan yang jujur: fitur lag/vol/GSPC ini hampir tidak memprediksi arah besok.", correct: true },
            { text: "Fold 4 (ROC 0,6279) membuktikan modelnya bagus — fold lain hanya noise", why: "Salah: memilih fold terbaik sesudah melihat hasil adalah cherry-picking — leakage dalam bentuk lain. Mean lima fold (0,5516) adalah bacaannya, bukan fold terbaik." },
            { text: "K-fold acak akan memberi hasil yang sama, jadi time-series split tidak diperlukan", why: "Salah: K-fold acak pada data waktu membocorkan masa depan ke train (baris «besok» melatih model yang menguji «hari ini») — skornya akan terlihat lebih bagus secara palsu. Expanding window adalah yang benar untuk data berurutan waktu." },
          ],
        },
        {
          q: "Nested CV GBM: lima skor outer 0,7974; 0,7782; 0,7878; 0,7859; 0,7799 — mean 0,7858, sd 0,0068. Mana pernyataan yang benar tentang ketidakpastian mean ini?",
          options: [
            { text: "sd 0,0068 adalah ketidakpastian mean — jadi mean 0,7858 dengan ketidakpastian 0,0068", why: "Salah: 0,0068 adalah sd ANTAR-FOLD — sebaran satu skor fold. Ketidakpastian mean-nya lebih kecil: SE = sd/√5 ≈ 0,0030." },
            { text: "SE mean ≈ 0,0030 dan CI 95% naif [0,7799; 0,7918] — tapi CI itu optimistis karena kelima fold tidak independen (train tumpang tindih 75%)", why: "Benar: SE = 0,0068/√5 ≈ 0,0030; CI naif dari angka penuh (mean 0,78584; SE 0,00304) = 0,78584 ± 1,96 × 0,00304 → [0,7799; 0,7918]. Dengan angka yang sudah dibulatkan (0,7858 ± 1,96 × 0,0030) batas atasnya 0,7917 — selisih 0,0001 murni pembulatan. Naif karena dua fold mana pun berbagi 14.400 dari 19.200 baris tiap training set — skor-skornya berkorelasi, ukuran sampel efektif < 5, CI yang benar lebih lebar.", correct: true },
            { text: "CI [0,7799; 0,7918] adalah interval kepercayaan formal — skor sebenarnya 95% pasti di dalamnya", why: "Salah: CI itu NAIF — rumusnya mengasumsikan fold independen, padahal train antar-fold tumpang tindih 75%. Jangan laporkan sebagai klaim formal; laporkan skor per fold + mean + sd + rentang." },
            { text: "Rentang fold 0,7782–0,7974 membuktikan mean 0,7858 salah — mean harus sama dengan salah satu skor fold", why: "Salah: mean adalah RATA-RATA lima skor fold — ia tidak harus sama dengan satu skor mana pun. Rentang 0,7782–0,7974 justru menunjukkan goyangan antar-fold yang diringkas sd 0,0068." },
          ],
        },
        {
          q: "Kamu menstandardisasi fitur dan memilih 5 fitur terbaik SEBELUM menjalankan cross_val_score. Apa yang terjadi — dan apa perbaikannya?",
          options: [
            { text: "Tidak ada masalah — standardisasi dan seleksi fitur adalah preprocessing netral, bukan bagian model", why: "Salah: scaler MEMPELAJARI mean/sd dan SelectKBest MEMPELAJARI skor dari data — keduanya adalah bagian model yang di-fit. Di-fit sebelum split berarti validation fold sudah memengaruhi transformasinya: itu leakage." },
            { text: "Skor CV jadi optimistis karena transformer sudah melihat validation fold — perbaikannya: letakkan scaler + selektor DI DALAM Pipeline, supaya di-fit ulang tiap fold", why: "Benar: Pipeline([(\"sc\", StandardScaler()), (\"sel\", SelectKBest(k=5)), (\"clf\", ...)]) membuat cross_val_score me-refit seluruh pipeline di tiap fold. Lab 3 membuktikannya pada data tanpa sinyal [ilustrasi]: sebelum CV 0,6340, di dalam Pipeline 0,4915 — inflasi 0,1425 dari «sinyal» yang tidak ada.", correct: true },
            { text: "Skor CV jadi pesimis — perbaikannya: fit scaler pada train saja, tapi seleksi fitur boleh pada semua data", why: "Salah dua kali: skor CV yang bocor jadi OPTIMISTIS (bukan pesimis), dan seleksi fitur yang memakai label y dari semua data adalah kebocoran yang paling besar efeknya — ia harus di dalam Pipeline sama seperti scaler." },
            { text: "Cukup membungkus estimatornya saja dalam Pipeline — transformer di luar Pipeline tidak memengaruhi skor", why: "Salah: Pipeline([(\"clf\", ...)]) tanpa transformer di dalamnya tidak melindungi apa-apa — scaler yang di-fit manual sebelum cross_val_score tetap bocor, berapa pun lapis Pipeline di sekitar estimatornya." },
          ],
        },
      ],
      summary: [
        "Satu split adalah satu undian: LR single-split 0,7426 vs CV 0,7560 (selisih 0,0134); GBM 0,7823 vs 0,7840 (selisih 0,0017) [notebook].",
        "K-fold: K lipatan, tiap baris menjadi test tepat sekali; K = 5 default. Stratified menjaga base rate 0,2212 (~1.327 default per fold 6.000 baris).",
        "Mean beserta sd antar-fold-nya: GBM 0,7840 (sd antar-fold 0,0059; band [0,7781; 0,7899]) vs LR 0,7560 (sd antar-fold 0,0056; band [0,7504; 0,7616]) — band tidak bersinggungan; sd antar-fold bukan ketidakpastian mean.",
        "Nested CV (outer 5 / inner 3, 18 konfigurasi, 275 kali latih): GBM 0,7858 (sd antar-fold 0,0068) — estimasi JUJUR prosedur tuning, LEBIH TINGGI dari single-split 0,7823 (+0,0035), hanya +0,0018 atas CV biasa.",
        "Konfigurasi terbaik berganti tiap outer fold (50/5/0,1; 200/3/0,05; 100/5/0,05; 100/3/0,1; 50/5/0,05) — permukaan tuning datar (rentang CV grid 0,7827–0,7865).",
        "Leakage dalam tuning: LR bias 0,0000 (C terbaik menurut test = menurut CV = 1); GBM bias 0,0000 (konfigurasi terbaik menurut test = menurut CV = 100/5/0,05; skor test yang sama 0,7823) — bias ~0 karena gain tuning kecil, pilihan sama, data besar; bias MEMBESAR bila search space besar / data kecil.",
        "Time-series BBCA (expanding window 5 fold): mean ROC-AUC 0,5516, akurasi 0,5894 vs naive-majority 0,5710, fold 5 tepat 0,5000 — sinyal arah hampir tidak ada; K-fold acak pada data waktu adalah kebocoran.",
        "Lab: K-fold manual — mean 0,7840, sd 0,0059 (populasi), band [0,7781; 0,7899]; nested vs single-split — +0,0035 dan +0,0018, laporkan nested CV 0,7858; Pipeline — skor bocor 0,6340 vs benar 0,4915, selisih 0,1425 [ilustrasi].",
        "Ketidakpastian tuning: skor outer nested GBM 0,7974; 0,7782; 0,7878; 0,7859; 0,7799 — mean 0,7858, sd antar-fold 0,0068, SE mean ≈ 0,0030, CI 95% NAIF [0,7799; 0,7918]; CI naif optimistis karena train antar-fold tumpang tindih 75% — laporkan skor per fold + mean + sd + rentang, jangan klaim CI formal.",
        "Workflow anti-leakage: transformer yang belajar dari data (scaler, imputer, seleksi fitur, PCA) di-fit DI DALAM fold — Pipeline/ColumnTransformer menjaminnya; yang di-fit sebelum split sudah melihat validation fold.",
      ],
      next: { label: "Lanjut: MLF-M6.3 — Regularisasi & Early Stopping", href: "/v2/learn/mlf-m63-regularization-early-stopping" },
    },
  ],
};

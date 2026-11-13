import type { V2Lesson } from "../lib/types";

export const mlfM73: V2Lesson = {
  slug: "mlf-m73-explainability-shap-lime",
  track: "Machine Learning Finance",
  module: "Fairness, explainability & monitoring",
  title: "MLF-M7.3 — Explainability (SHAP/LIME): Membaca Model yang Tidak Bisa Bicara",
  estMinutes: 85,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Nasabah 858 ditolak — dan tidak ada yang bisa menjelaskan kenapa",
      prose: [
        "Bayangkan nasabah nomor 858 di test set. Usia 32 tahun, limit NT$20.000, status bayar enam bulan terakhir 3, 2, 2, 7, 7, 7 (terbaru→terlama) — tiga bulan terbaru 3, 2, 2, tiga bulan tertua 7, 7, 7 — dengan PAY_AMT 0 di semua enam bulan, tagihan NT$2.400 setiap bulan. Model keputusan kita — GBM terkalibrasi Platt/sigmoid — memberinya probabilitas default 0,8492 [notebook]. Threshold operasional 0,10 (M6.4): di atas threshold berarti ditolak. Ia ditolak — dan memang benar-benar default (label aktual 1). Modelnya benar. Tapi bila nasabah itu bertanya «kenapa saya ditolak?», apa jawabanmu? «Karena model berkata begitu» bukan jawaban — itu pengakuan bahwa kamu tidak mengerti modelmu sendiri.",
        "Konteks angka lesson ini [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model keputusan = GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10. ROC-AUC test: GBM mentah 0,7823, GBM terkalibrasi 0,7816; LR 0,7426. PR-AUC: GBM mentah 0,5597, GBM terkalibrasi 0,5558; LR 0,5049. Brier: GBM mentah 0,1342, GBM terkalibrasi 0,1345. Semua angka explainability di lesson ini dihitung pada test 6.000 yang sama — angka-angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON, bukan template evaluasi final yang bebas seleksi; dalam praktik, penjelasan model dihitung di data evaluasi yang tidak dipakai untuk memilih model atau threshold (lihat M6.4 langkah 4). Nilai SHAP di lesson ini NYATA: dihitung dengan shap 0.54.1 (TreeExplainer) atas GBM mentah — model keputusan adalah versi terkalibrasi Platt-nya, transformasi monoton, jadi ranking PREDIKSI nasabahnya sama, walau nilai SHAP eksak — dan urutan fitur teratas — pada skor terkalibrasi bisa berbeda (langkah 6).",
        "Peta lesson: cerita nasabah 858 → global vs lokal: dua pertanyaan yang berbeda → permutation importance: fitur mana yang paling diandalkan model → jebakan permutation: fitur berkorelasi membelah pentingnya → PDP: bagaimana satu fitur menggeser prediksi → SHAP: pembagian kredit yang adil antar fitur — dengan angka yang nyata → LIME: surrogate lokal yang menunjuk fitur yang salah — dan kenapa → koefisien LR: model yang memang bisa dibaca, termasuk tanda koefisien yang berbalik → penjelasan yang menyesatkan: empat jebakan → explainability untuk fairness: apa yang bisa dan tidak bisa dijawab penjelasan → counterfactual: descriptive vs counterfactual vs causal — dengan contoh nasabah 858 yang dihitung ulang → alur komunikasi keputusan (adverse action): dari reason codes ke surat penolakan → 3 lab → checkpoint.",
        "Nilai: explainability adalah SATU-SATUNYA cara menjawab «mengapa model memutuskan begitu?» dengan sesuatu yang bisa diperiksa — bukan dengan firasat, bukan dengan «modelnya kompleks». Nasabah yang ditolak berhak atas alasan yang bisa ia baca (reason codes, langkah 8); auditor berhak tahu fitur mana yang mendorong keputusan (permutation, langkah 3); dan kamu berhak tahu kapan penjelasanmu sendiri sedang berbohong (langkah 9). Tanpa itu, model yang akurat pun tidak bisa dipertanggungjawabkan.",
        "Baik atau buruk: GBM dengan ROC-AUC 0,7823 itu bagus sebagai mesin ranking — tapi ia tidak bisa bicara. Ia tidak punya koefisien, tidak punya «alasan» bawaan. Setiap penjelasan untuk GBM adalah alat TAMBAHAN (permutation, PDP, SHAP, LIME) — dan tiap alat punya asumsi yang bisa gagal diam-diam. LIME di lesson ini menunjuk fitur yang salah (langkah 7) — dan penjelasan yang menunjuk fitur yang salah adalah penjelasan yang menyesatkan, walau surrogate-nya cukup fit dan stabil.",
        "Mitigasi: jangan pernah menyajikan SATU penjelasan sendirian. Setiap klaim «fitur X yang menyebabkan keputusan ini» harus lolos minimal dua alat yang berbeda (misal permutation + PDP, atau LR lokal + SHAP) — dan bila keduanya tidak sepakat, laporkan ketidaksepakatan itu, bukan salah satunya. Aturan ini berlaku di semua langkah lesson ini.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «model yang akurat pasti bisa dijelaskan»",
        type: "pitfall",
        body: "Yang benar: akurasi dan explainability adalah dua sifat yang berbeda. GBM di lesson ini akurat (ROC-AUC 0,7823) dan bisu — penjelasannya harus dibangun dengan alat tambahan, dan tiap alat bisa gagal (LIME menunjuk fitur yang salah di langkah 7, permutation terbelah di langkah 4). Akurasi tidak pernah membuktikan penjelasanmu benar.",
      },
    },
    {
      id: "global-vs-lokal",
      eyebrow: "Langkah 2 · Global vs lokal",
      title: "Global vs lokal: dua pertanyaan yang berbeda — jangan jawab yang satu dengan yang lain",
      prose: [
        "Explainability menjawab dua pertanyaan yang berbeda, dan mencampuradukkan keduanya adalah kesalahan pertama yang paling umum. Pertanyaan GLOBAL: «secara umum, fitur mana yang paling penting bagi model ini?» — jawabannya berlaku untuk semua nasabah sekaligus: permutation importance (langkah 3), PDP (langkah 5), rata-rata nilai absolut SHAP (langkah 6). Pertanyaan LOKAL: «mengapa model menolak NASABAH INI, nasabah 858?» — jawabannya spesifik untuk satu baris data: dekomposisi log-odds LR (langkah 8), SHAP waterfall untuk satu nasabah (langkah 6), surrogate LIME di sekitar satu titik (langkah 7).",
        "Nilai: memisahkan global dari lokal membuatmu memilih alat yang benar. Bila regulator bertanya «fitur apa yang paling menentukan keputusan kredit kalian?», itu pertanyaan global — jawab dengan permutation importance, bukan dengan satu contoh nasabah. Bila nasabah 858 bertanya «kenapa SAYA ditolak?», itu pertanyaan lokal — jawab dengan reason codes dari dekomposisi lokal, bukan dengan «PAY_MAX adalah fitur terpenting secara global». Jawaban global untuk pertanyaan lokal adalah jawaban yang benar untuk orang yang salah.",
        "Baik atau buruk: jawaban global itu bagus karena stabil — dihitung dari 6.000 baris test, bukan dari satu nasabah, jadi tidak goyah oleh satu baris yang aneh. Buruk bila dibaca sebagai jawaban lokal: PAY_MAX memang fitur terpenting secara global (penurunan ROC-AUC 0,0569 bila diacak), tapi untuk nasabah tertentu, fitur yang mendorong keputusannya bisa jadi LIMIT_BAL atau PAY_AMT1 — dan angka global tidak akan pernah memberitahumu itu. Sebaliknya jawaban lokal itu bagus karena spesifik dan bisa ditindaklanjuti nasabah — buruk bila digeneralisasi: alasan penolakan nasabah 858 bukan alasan penolakan semua nasabah.",
        "Mitigasi: setiap kali kamu menulis penjelasan, tulis dulu di baris pertama: «ini penjelasan GLOBAL» atau «ini penjelasan LOKAL untuk nasabah X». Bila kamu tidak bisa menulis baris itu, kamu belum tahu pertanyaan apa yang sedang kamu jawab — berhenti dan tentukan dulu.",
      ],
      tasks: [],
    },
    {
      id: "permutation",
      eyebrow: "Langkah 3 · Permutation importance",
      title: "Permutation importance: acak satu fitur, lihat berapa banyak model rusak",
      prose: [
        "Permutation importance adalah alat global yang paling jujur secara intuisi: ambil satu fitur, acak nilainya di seluruh test set (sehingga hubungannya dengan label hancur, tapi distribusinya tetap), lalu ukur berapa banyak skor model turun. Bila mengacak PAY_MAX membuat ROC-AUC jatuh jauh, model SANGAT mengandalkan PAY_MAX. Bila mengacak SEX hampir tidak mengubah apa-apa, model hampir tidak mengandalkan SEX — setidaknya tidak lewat kolom itu secara langsung. Definisi ini tidak peduli modelnya GBM atau LR: ia mengukur ketergantungan model pada fitur, apa pun arsitekturnya.",
        "Nilai [notebook] — GBM terkalibrasi, test 6.000, skor ROC-AUC, 10 ulangan, baseline ROC-AUC 0,7823. Lima besar: PAY_MAX 0,0569 (simpangan baku 0,0043); PAY_0 0,0241 (0,0021); UTILIZATION 0,0130 (0,0019); PAY_AMT_MEAN 0,0069 (0,0011); LIMIT_BAL 0,0062 (0,0013). Tiga berikutnya: BILL_AMT1 0,0053; BILL_MEAN 0,0048; BILL_TREND 0,0044. PAY_MAX mendominasi: penurunannya lebih dari dua kali PAY_0, dan lebih dari empat kali UTILIZATION. Di ujung bawah: PAY_2 0,0001, PAY_3 0,0002, PAY_4 −0,0001, PAY_6 0,0004 — praktis nol, dan PAY_4 yang negatif berarti mengacaknya justru sedikit MEMBANTU skor (noise semata). Sebagai pembanding, permutation importance LR (baseline ROC-AUC 0,7426): PAY_DELAY_COUNT 0,1422 (0,0061) — jauh di atas semua yang lain; PAY_MAX 0,0127; LIMIT_BAL 0,0098; PAY_0 0,0063; PAY_AMT1 0,0046.",
        "Baik atau buruk: permutation importance itu bagus karena ia model-agnostic (cara yang sama untuk GBM dan LR, sehingga keduanya bisa dibandingkan apel-dengan-apel) dan karena ia diukur pada data yang TIDAK dipakai melatih (test 6.000), jadi ia mengukur ketergantungan yang sesungguhnya, bukan hafalan train. Buruk bila dibaca sebagai «pentingnya fitur di dunia nyata»: ia mengukur seberapa besar MODEL mengandalkan fitur itu — bukan seberapa besar fitur itu MENYEBABKAN default. Dan buruk bila dibaca tanpa simpangan bakunya: PAY_MAX 0,0569 dengan simpangan baku 0,0043 adalah sinyal yang kokoh; PAY_4 −0,0001 adalah nol yang berisik.",
        "Mitigasi: laporkan permutation importance SELALU dengan tiga pendamping: (1) baseline skornya (di sini ROC-AUC 0,7823), (2) jumlah ulangan (di sini 10), (3) simpangan baku tiap fitur. Dan jangan pernah bandingkan angka permutation antar model tanpa menyebut baseline-nya: PAY_DELAY_COUNT 0,1422 di LR vs 0,0012 di GBM (langkah 9) bukan berarti fiturnya berubah — berarti KEDUA MODEL memakai sinyal yang sama dengan cara yang berbeda.",
      ],
      formula: String.raw`\text{Permutation importance}(j) = \text{skor}_{\text{baseline}} - \text{skor}_{\text{setelah fitur } j \text{ diacak}} \quad \text{(rata-rata atas 10 ulangan)}`,
      formulaNote: "Permutation importance: selisih skor (di sini ROC-AUC test) sebelum dan sesudah satu fitur diacak. Makin besar penurunannya, makin model mengandalkan fitur itu. Baseline GBM 0,7823, 10 ulangan [notebook].",
      figure: {
        svg: `<svg viewBox="0 0 480 260" role="img" aria-label="Permutation importance GBM 8 besar: PAY_MAX 0,0569, PAY_0 0,0241, UTILIZATION 0,0130, PAY_AMT_MEAN 0,0069, LIMIT_BAL 0,0062, BILL_AMT1 0,0053, BILL_MEAN 0,0048, BILL_TREND 0,0044">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Permutation importance GBM — 8 besar (penurunan ROC-AUC test, 10 ulangan)</text>
<text x="240" y="30" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Baseline ROC-AUC 0,7823 — test 6.000 — nilai ± simpangan baku</text>
<text x="112" y="56" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)">PAY_MAX</text>
<rect x="118" y="44" width="312.9" height="15" fill="var(--c1)"/>
<text x="435.9" y="56" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0569 ± 0,0043</text>
<text x="112" y="80" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)">PAY_0</text>
<rect x="118" y="68" width="132.6" height="15" fill="var(--c1)"/>
<text x="255.6" y="80" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0241 ± 0,0021</text>
<text x="112" y="104" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)">UTILIZATION</text>
<rect x="118" y="92" width="71.5" height="15" fill="var(--c1)"/>
<text x="194.5" y="104" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0130 ± 0,0019</text>
<text x="112" y="128" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)">PAY_AMT_MEAN</text>
<rect x="118" y="116" width="38.0" height="15" fill="var(--c4)"/>
<text x="161.0" y="128" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0069 ± 0,0011</text>
<text x="112" y="152" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)">LIMIT_BAL</text>
<rect x="118" y="140" width="34.1" height="15" fill="var(--c4)"/>
<text x="157.1" y="152" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0062 ± 0,0013</text>
<text x="112" y="176" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)">BILL_AMT1</text>
<rect x="118" y="164" width="29.1" height="15" fill="var(--c4)"/>
<text x="152.1" y="176" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0053 ± 0,0009</text>
<text x="112" y="200" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)">BILL_MEAN</text>
<rect x="118" y="188" width="26.4" height="15" fill="var(--c4)"/>
<text x="149.4" y="200" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0048 ± 0,0009</text>
<text x="112" y="224" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)">BILL_TREND</text>
<rect x="118" y="212" width="24.2" height="15" fill="var(--c4)"/>
<text x="147.2" y="224" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0044 ± 0,0008</text>
<text x="240" y="246" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">PAY_MAX mendominasi: 0,0569 — lebih dari dua kali PAY_0 (0,0241). Sisanya di bawah 0,0130.</text>
</svg>`,
        alt: "Permutation importance GBM 8 besar: PAY_MAX 0,0569, PAY_0 0,0241, UTILIZATION 0,0130, PAY_AMT_MEAN 0,0069, LIMIT_BAL 0,0062, BILL_AMT1 0,0053, BILL_MEAN 0,0048, BILL_TREND 0,0044.",
        caption: "Cara membaca: panjang bar = berapa banyak ROC-AUC test turun bila fitur itu diacak (10 ulangan) [notebook]. PAY_MAX 0,0569 mendominasi — lebih dari dua kali PAY_0. Tiga bar teratas memakai warna pertama, sisanya warna kedua; pemisahnya bukan ambang resmi, hanya untuk membantu mata melihat jurang antara tiga besar dan sisanya.",
      },
      tasks: [],
    },
    {
      id: "jebakan-permutation",
      eyebrow: "Langkah 4 · Jebakan permutation",
      title: "Jebakan permutation: fitur berkorelasi membelah pentingnya menjadi serpihan",
      prose: [
        "Permutation importance punya satu kelemahan yang sistematis — dan di data ini kelemahan itu terlihat jelas. Bila dua fitur berkorelasi kuat, model bisa memakai salah satunya secara bergantian; mengacak SATU di antaranya hampir tidak merusak model, karena fitur pasangannya masih membawa sinyal yang sama. Hasilnya: masing-masing terlihat «tidak penting», padahal sinyal yang mereka bawa bersama-sama penting. Inilah yang terjadi pada enam kolom tagihan: BILL_AMT1 sampai BILL_AMT6.",
        "Nilai [notebook]: korelasi BILL_AMT1..6 dengan BILL_MEAN adalah r = 0,9463 — hampir sempurna. Permutation importance GBM untuk keenam kolom itu masing-masing kecil — BILL_AMT1 0,0053 yang tertinggi, BILL_AMT6 0,0000 — tapi JUMLAH keenamnya 0,0116, hampir sama besar dengan UTILIZATION (0,0130, peringkat tiga). BILL_MEAN sendiri 0,0048. Jadi «sinyal tagihan» yang jujur besarnya sekitar 0,0116, tapi bila kamu membaca kolomnya satu per satu, tidak satu pun yang tampak penting. Pola yang sama pada fitur bayar: korelasi PAY_MEAN dengan PAY_MAX r = 0,8194; permutation PAY_MAX 0,0569, PAY_MEAN hanya 0,0003 — sinyal «keterlambatan bayar» hampir seluruhnya diserap PAY_MAX, dan PAY_MEAN tampak tidak penting padahal ia mengukur hal yang hampir sama.",
        "Baik atau buruk: perilaku ini bagus bila kamu memahaminya — ia memberitahu bahwa model punya BANYAK jalan menuju sinyal yang sama, dan itu justru ketahanan (robustness). Buruk bila kamu membacanya secara naif: «PAY_MEAN tidak penting, hapus saja» adalah kesimpulan yang salah — menghapus PAY_MEAN tidak mengubah apa-apa karena PAY_MAX sudah membawa sinyalnya, tapi juga tidak membuktikan PAY_MEAN tidak informatif. Buruk pula bila kamu membandingkan fitur berkorelasi dengan fitur yang berdiri sendiri: kolom tagihan yang terpecah enam akan selalu kalah melawan satu kolom seperti UTILIZATION, walau sinyal totalnya sebanding.",
        "Mitigasi: sebelum membaca ranking permutation, hitung korelasi antar fitur teratas — dan KELOMPOKKAN fitur yang berkorelasi kuat (di sini r di atas 0,8) menjadi satu «keluarga sinyal», lalu jumlahkan importance-nya. Laporkan keduanya: angka per kolom DAN angka per keluarga. Aturan praktis di lesson ini: bila satu keluarga beranggotakan enam kolom dan jumlahnya 0,0116, tuliskan «keluarga tagihan 0,0116 (terpecah ke enam kolom, masing-masing 0,0000–0,0053)» — bukan «BILL_AMT1 0,0053».",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «importance kecil berarti fitur tidak informatif»",
        type: "pitfall",
        body: "Yang benar: importance kecil bisa berarti dua hal yang berlawanan — fitur memang tidak informatif, ATAU fitur sangat informatif tapi sinyalnya sudah dibawa fitur lain yang berkorelasi (PAY_MEAN 0,0003 vs PAY_MAX 0,0569, r = 0,8194). Permutation importance mengukur apa yang HILANG bila satu fitur diacak dengan yang lain tetap ada — bukan apa yang fitur itu ketahui sendirian. Untuk membedakannya, periksa korelasinya dulu.",
      },
    },
    {
      id: "pdp",
      eyebrow: "Langkah 5 · Partial dependence",
      title: "PDP: bagaimana satu fitur menggeser prediksi — dan kapan kurvanya berbohong",
      prose: [
        "Permutation importance berkata «fitur ini penting» tapi tidak berkata «ke arah mana». Partial dependence plot (PDP) menjawab arah itu: paksa satu fitur ke satu nilai untuk SEMUA 6.000 baris test, hitung rata-rata probabilitas default prediksi, ulangi untuk tiap nilai pada grid — dan kamu mendapat kurva «bila fitur ini berubah, prediksi rata-rata berubah bagaimana». Kurva ini global (rata-rata atas semua nasabah) dan satu fitur dalam satu waktu — dua batas yang harus selalu diingat.",
        "Nilai [notebook] — PDP 1D PAY_MAX, grid −2 sampai 8, rata-rata P(default) test 6.000. GBM terkalibrasi: datar 0,1589 pada PAY_MAX −2, −1, dan 0 — lalu naik ke 0,1986 pada 1, 0,2782 pada 2, dan 0,2897 pada 3 sampai 4 — lalu datar lagi 0,2892 dari 5 sampai 8. Bentuknya tangga: datar–naik–datar. LR: naik mulus 0,1456 pada −2, 0,1966 pada 0, 0,2593 pada 2, 0,3334 pada 4, 0,5063 pada 8 — tanpa dataran, tanpa lompatan. Kedua model sepakat arahnya (makin telat, makin berisiko), tapi bentuknya berbeda total: GBM belajar ambang (sampai 0 bulan telat tidak mengubah apa-apa, lalu risiko melompat dan jenuh), LR memaksakan kenaikan mulus karena ia linear dalam log-odds. PDP 1D UTILIZATION, grid 0 sampai 5 [notebook]: GBM terkalibrasi 0,1990 pada 0, naik ke 0,2572 pada 1,0, lalu datar 0,2627 dari 1,5 sampai 5 — jenuh lagi. LR 0,2089 pada 0 sampai 0,3518 pada 5 — terus naik, tanpa jenuh.",
        "PDP 2D — dua fitur sekaligus — menunjukkan apakah efek keduanya menumpuk atau berinteraksi [notebook]. PAY_MAX (baris 0–4) kali UTILIZATION (kolom 0,2 / 0,5 / 1,0 / 2,0), GBM terkalibrasi, rata-rata P(default): pada PAY_MAX 0, utilisasi 0,2 memberi 0,1389 dan utilisasi 2,0 memberi 0,2103 (selisih 0,0714); pada PAY_MAX 4, utilisasi 0,2 memberi 0,2788 dan utilisasi 2,0 memberi 0,3275 (selisih 0,0487). Sebaliknya, efek PAY_MAX pada utilisasi 0,2 adalah 0,1389 naik ke 0,2788 (selisih 0,1399), dan pada utilisasi 2,0 adalah 0,2103 naik ke 0,3275 (selisih 0,1172). Kedua efek mengecil sekitar sepertiga (0,0714→0,0487) saat fitur pasangannya sudah tinggi — pada skala absolut kecil; kurvanya hampir sejajar, TIDAK ada interaksi kuat: efek keduanya menumpuk secara hampir aditif, interaksi lemah, bukan nol. Bila ada interaksi kuat, selisihnya akan membesar atau berbalik arah — di sini tidak.",
        "Satu peringatan kejujuran soal PDP: ia memaksa satu fitur ke satu nilai untuk SEMUA baris — termasuk kombinasi yang tidak pernah ada di dunia nyata. PDP PAY_MAX = 8 dipasangkan dengan baris-baris yang utilisasinya rendah dan tagihannya kecil, kombinasi yang hampir tidak ada di data. PDP PAY_MEAN kini memakai grid BERSIH hasil perbaikan (grid pertama mengandung 0,0 yang terduplikasi dan TIDAK dipakai) [notebook]: grid −2, −1, −0,5, 0, 0,5, 1, 2, 4 — GBM terkalibrasi 0,2084; 0,2132; 0,2133; 0,2162; 0,2200; 0,2370; 0,2460; 0,2399. Kurvanya naik pelan dari 0,2084 ke puncak 0,2460 pada 2, lalu sedikit turun ke 0,2399 pada 4 — efek PAY_MEAN jauh lebih kecil dan lebih datar daripada PAY_MAX (0,1589 ke 0,2897), sejalan dengan korelasinya: PAY_MEAN membawa sinyal yang hampir sama dengan PAY_MAX (r = 0,8194) tapi lebih lemah. Duplikasi sekecil itu mudah lolos bila grid tidak diperiksa — dan PDP dari grid yang salah adalah kurva yang salah.",
        "Baik atau buruk: PDP bagus karena ia menunjukkan BENTUK hubungan (tangga vs mulus, jenuh vs terus naik) — sesuatu yang tidak bisa ditangkap angka importance saja. GBM yang jenuh pada 0,2892 di atas PAY_MAX 4 adalah informasi bisnis yang nyata: keterlambatan di atas 4 bulan tidak lagi menambah prediksi risiko rata-rata. Buruk bila dibaca sebagai hubungan sebab-akibat: PDP berkata «bila semua orang dipaksa telat 4 bulan, prediksi rata-ratanya 0,2897» — bukan «telat 4 bulan MENYEBABKAN risiko 0,2897». Dan buruk bila dibaca tanpa memeriksa korelasi: PDP PAY_MAX menggerakkan PAY_MAX sambil membiarkan fitur lain apa adanya — padahal di dunia nyata, PAY_MAX yang tinggi datang bersama PAY_MEAN yang tinggi (r = 0,8194), jadi kurva itu mencampur efek PAY_MAX dengan efek teman-temannya.",
        "Mitigasi: baca PDP selalu berpasangan dengan tiga hal: (1) distribusi fitur itu sendiri — di mana datanya padat dan di mana kurvanya hanya ekstrapolasi; (2) korelasi dengan fitur lain (langkah 4); (3) PDP model pembanding (di sini LR) — bila GBM dan LR sepakat arahnya tapi beda bentuknya, bentuk itulah yang perlu dijelaskan, bukan arahnya. Dan periksa grid-nya sebelum mempercayai kurvanya.",
      ],
      formula: String.raw`\mathrm{PDP}_j(v) = \frac{1}{n} \sum_{i=1}^{n} \hat{f}(v, \, x_{i,-j}) \quad \text{— rata-rata prediksi bila fitur } j \text{ dipaksa ke } v`,
      formulaNote: "Partial dependence: rata-rata prediksi model atas semua n baris (di sini n = 6.000) dengan fitur j dipaksa ke nilai v dan fitur lain dibiarkan apa adanya. PDP 2D memakai dua fitur yang dipaksa sekaligus.",
      figure: {
        svg: `<svg viewBox="0 0 480 260" role="img" aria-label="PDP 1D PAY_MAX: GBM terkalibrasi datar 0,1589 pada minus 2 sampai 0, naik ke 0,2897 pada 4, datar 0,2892 sampai 8; LR naik mulus 0,1456 sampai 0,5063">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PDP 1D PAY_MAX — rata-rata P(default), test 6.000</text>
<rect x="330" y="24" width="12" height="12" fill="var(--c1)"/>
<text x="346" y="34" font-size="10" fill="var(--text)" font-family="var(--font-ui)">GBM terkalibrasi</text>
<rect x="330" y="40" width="12" height="12" fill="var(--c2)"/>
<text x="346" y="50" font-size="10" fill="var(--text)" font-family="var(--font-ui)">LR</text>
<line x1="52" y1="222.0" x2="452" y2="222.0" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="179.8" x2="452" y2="179.8" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="52" y1="137.6" x2="452" y2="137.6" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="52" y1="95.3" x2="452" y2="95.3" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="52" y1="53.1" x2="452" y2="53.1" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="3 3"/>
<text x="46" y="225.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<text x="46" y="182.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<text x="46" y="140.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<text x="46" y="98.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<text x="46" y="56.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<polyline points="52.0,197.1 92.0,197.1 132.0,197.1 172.0,180.4 212.0,146.8 252.0,141.9 292.0,141.9 332.0,142.1 372.0,142.1 412.0,142.1 452.0,142.1" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<polyline points="52.0,202.7 92.0,192.6 132.0,181.2 172.0,168.6 212.0,154.7 252.0,139.7 292.0,123.5 332.0,106.2 372.0,88.2 412.0,69.5 452.0,50.5" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<circle cx="52.0" cy="197.1" r="3" fill="var(--c1)"/>
<circle cx="132.0" cy="197.1" r="3" fill="var(--c1)"/>
<circle cx="292.0" cy="141.9" r="3" fill="var(--c1)"/>
<circle cx="452.0" cy="142.1" r="3" fill="var(--c1)"/>
<circle cx="52.0" cy="202.7" r="3" fill="var(--c2)"/>
<circle cx="292.0" cy="123.5" r="3" fill="var(--c2)"/>
<circle cx="452.0" cy="50.5" r="3" fill="var(--c2)"/>
<text x="52" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−2</text>
<text x="92" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−1</text>
<text x="132" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="172" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<text x="212" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<text x="252" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<text x="292" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<text x="332" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5</text>
<text x="372" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6</text>
<text x="412" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">7</text>
<text x="452" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">8</text>
<text x="252" y="254" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">PAY_MAX (keterlambatan terburuk, bulan) — GBM: datar–naik–datar; LR: naik mulus.</text>
</svg>`,
        alt: "PDP 1D PAY_MAX: GBM terkalibrasi datar 0,1589 pada minus 2 sampai 0, naik ke 0,2897 pada 4, datar 0,2892 sampai 8; LR naik mulus 0,1456 sampai 0,5063.",
        caption: "Cara membaca: tiap titik = rata-rata P(default) prediksi atas 6.000 baris test bila PAY_MAX dipaksa ke nilai itu [notebook]. GBM terkalibrasi (garis pertama): datar 0,1589 pada −2 sampai 0, naik ke 0,2897 pada 4, lalu datar 0,2892 sampai 8 — bentuk tangga dengan kejenuhan. LR (garis kedua): naik mulus 0,1456 ke 0,5063. Kedua model sepakat arahnya, beda bentuknya — dan bentuk itulah yang perlu dijelaskan.",
      },
      tasks: [],
    },
    {
      id: "shap",
      eyebrow: "Langkah 6 · SHAP",
      title: "SHAP: membagi kredit secara adil antar fitur — dengan angka yang nyata",
      prose: [
        "SHAP (SHapley Additive exPlanations) menjawab pertanyaan yang lebih tajam daripada permutation atau PDP: «dari prediksi model untuk nasabah INI, berapa kontribusi MASING-MASING fitur — dan apakah pembagian itu adil?» Jawabannya dipinjam dari teori permainan kooperatif: nilai Shapley. Bayangkan 31 fitur sebagai 31 pemain yang bekerja sama menghasilkan satu prediksi; nilai Shapley adalah SATU-SATUNYA pembagian kredit yang memenuhi empat aksioma sekaligus: efisiensi (jumlah semua kontribusi = prediksi dikurangi prediksi rata-rata — tidak ada kredit yang hilang atau tercipta), simetri (dua fitur yang selalu berkontribusi sama mendapat nilai sama), dummy (fitur yang tidak pernah mengubah prediksi mendapat nol), dan aditivitas (nilai untuk dua model yang digabung = jumlah nilai masing-masing). Bila kamu percaya keempat aksioma itu adil, maka pembagian Shapley adalah pembagian yang adil — dan itulah klaim SHAP.",
        "Nilai [notebook] — GLOBAL, mean |SHAP| atas test 6.000, dihitung dengan shap 0.54.1 (TreeExplainer), dalam satuan log-odds. Lima besar: PAY_MAX 0,4946; PAY_0 0,2385; UTILIZATION 0,1574; LIMIT_BAL 0,1113; PAY_AMT_MEAN 0,0892. Berikutnya: PAY_AMT2 0,0779; BILL_TREND 0,0745; PAY_AMT1 0,0670; BILL_MEAN 0,0658; PAY_DELAY_COUNT 0,0585. Bandingkan dengan permutation importance GBM (langkah 3): lima besar yang SAMA — PAY_MAX, PAY_0, UTILIZATION, PAY_AMT_MEAN, LIMIT_BAL — hanya urutan keempat dan kelima yang bertukar (permutation: PAY_AMT_MEAN keempat, LIMIT_BAL kelima; SHAP: sebaliknya). Dua alat yang berbeda, dari prinsip yang berbeda, menunjuk lima fitur yang sama: itulah konvergensi yang membuat klaim «PAY_MAX adalah pendorong utama model ini» bisa dipercaya. Di ujung bawah, PAY_2 sampai PAY_6 kecil sekali (0,0104; 0,0058; 0,0064; 0,0067; 0,0113) — konsisten dengan langkah 4 dan 8: sinyal keterlambatan diserap PAY_MAX dan PAY_0, dan SHAP membagi kredit dengan cara yang sama.",
        "Nilai [notebook] — LOKAL, nasabah 858, waterfall yang bisa diperiksa. Probabilitas GBM mentah 0,8599, log-odds 1,8148. Base value −1,555 log-odds (probabilitas 0,1744 — prediksi rata-rata model). Jumlah semua nilai SHAP nasabah ini 3,3699 — dan base + jumlah ≈ −1,555 + 3,3699 ≈ 1,8148, sama dengan log-odds model (tanpa pembulatan, galat absolut maksimum 0,0 atas semua baris; selisih 0,0001 pada angka yang ditampilkan murni pembulatan). Inilah aksioma efisiensi yang bisa kamu VERIFIKASI, bukan sekadar percaya: bila jumlah kontribusi tidak sama dengan prediksi dikurangi base value, ada yang salah dengan perhitunganmu. Lima kontribusi lokal terbesar: PAY_MAX +1,1368; PAY_0 +0,9280; PAY_AMT3 +0,1553; PAY_MEAN +0,1418; PAY_AMT_MEAN +0,1309. Dua fitur pertama saja menyumbang 1,1368 + 0,9280 = 2,0648 — lebih dari 60% dari total 3,3699. Dan perhatikan PAY_AMT3: ketiga terbesar secara lokal (+0,1553) padahal secara global hanya 0,0503 (peringkat 11) — lokal tidak sama dengan global, dan waterfall nasabah 858 tidak bisa dibaca dari ranking global.",
        "Satu caveat yang wajib dicatat — dan lesson ini mencatatnya, bukan menyembunyikannya: SHAP dihitung pada GBM MENTAH (tidak terkalibrasi), sementara model keputusan adalah versi terkalibrasinya (Platt/sigmoid). Kalibrasi Platt adalah transformasi MONOTON atas skor mentah — ranking nasabah dan fitur teratasnya sama — tapi nilai SHAP eksak pada skor terkalibrasi akan BERBEDA dari angka-angka di atas, karena kalibrasi mengubah skala log-odds secara non-linear. Jadi: ranking dan cerita (PAY_MAX dan PAY_0 mendominasi) berlaku untuk model keputusan; angka 0,4946 dan +1,1368 adalah angka pada GBM mentah. Detail teknis [notebook]: TreeExplainer, feature_perturbation tree_path_dependent (default), nilai dalam satuan log-odds, base value = rata-rata log-odds atas background training yang tersirat dari pohon.",
        "Baik atau buruk: SHAP bagus karena ia punya fondasi aksiomatik — bila kamu menerima empat aksiomanya, pembagiannya adil menurut definisi, bukan menurut firasat. Bagus karena ia menyatukan global dan lokal dalam satu kerangka: ranking global dan waterfall lokal adalah dua agregasi dari nilai yang sama — dan di data ini keduanya sepakat (PAY_MAX pertama di keduanya). Bagus karena efisiensinya bisa diverifikasi (galat 0,0). Buruk bila dibaca sebagai kebenaran kausal: nilai Shapley membagi kredit PREDIKSI model — bukan sebab-akibat di dunia nyata. Fitur dengan SHAP besar adalah fitur yang modelnya andalkan, bukan fitur yang menyebabkan default. Dan buruk bila caveat kalibrasinya dihilangkan: mengutip +1,1368 tanpa menyebut «pada GBM mentah» adalah kutipan yang tidak lengkap.",
        "Mitigasi: sebelum memakai angka SHAP apa pun, tanyakan tiga hal: (1) dihitung dengan explainer apa (di sini TreeExplainer) dan pada model yang mana (di sini GBM mentah — bukan versi terkalibrasi)? (2) atas data apa (di sini test 6.000 untuk global, nasabah 858 untuk lokal)? (3) apakah jumlah kontribusi lokalnya benar-benar sama dengan prediksi dikurangi base value (di sini ya — galat 0,0)? Bila salah satu tidak bisa dijawab, angka itu belum bisa dipakai. Dan bila SHAP belum dihitung sama sekali, katakan itu secara terbuka — jangan mengarangnya.",
      ],
      formula: String.raw`\phi_j = \sum_{S \subseteq N \setminus \{j\}} \frac{|S|! \, (n - |S| - 1)!}{n!} \left[ v(S \cup \{j\}) - v(S) \right]`,
      formulaNote: "Nilai Shapley fitur j: rata-rata tertimbang kontribusi marginal fitur j atas SEMUA koalisi S yang tidak mengandung j. Empat aksioma — efisiensi, simetri, dummy, aditivitas — membuat pembagian ini unik. Di lesson ini: base value −1,555 log-odds; nasabah 858: −1,555 + 3,3699 ≈ 1,8148 (tanpa pembulatan, galat 0,0; selisih 0,0001 pada angka yang ditampilkan murni pembulatan) [notebook].",
      tasks: [],
      note: {
        title: "Caveat: SHAP dihitung pada GBM mentah, bukan pada skor terkalibrasi",
        type: "risk",
        body: "Angka SHAP lesson ini (global PAY_MAX 0,4946; lokal nasabah 858 PAY_MAX +1,1368) dihitung dengan shap 0.54.1 pada GBM MENTAH. Model keputusan adalah versi terkalibrasi Platt-nya — transformasi monoton, jadi ranking PREDIKSI nasabahnya sama (itu sebabnya ROC-AUC nyaris sama), tapi nilai SHAP eksak dan urutan fitur teratas pada skor terkalibrasi bisa berbeda. Kutip angkanya selalu dengan label «GBM mentah» — dan jangan pernah memakai angka ini sebagai nilai SHAP pada probabilitas terkalibrasi 0,8492.",
      },
    },
    {
      id: "lime",
      eyebrow: "Langkah 7 · LIME",
      title: "LIME: surrogate lokal yang menunjuk fitur yang salah",
      prose: [
        "LIME (Local Interpretable Model-agnostic Explanations) menjawab pertanyaan lokal dengan cara yang berbeda dari SHAP: alih-alih membagi kredit, ia membangun MODEL PENGGANTI yang sederhana di sekitar satu nasabah. Caranya: buat 2.000 versi tetangga [notebook] nasabah 858 dengan mengacak-acak fiturnya, minta GBM memprediksi semuanya, lalu latih model linear (Ridge) yang meniru GBM HANYA di sekitar titik itu — dengan tetangga yang lebih dekat diberi bobot lebih besar lewat kernel. Koefisien model linear itulah «penjelasan» LIME: fitur dengan koefisien besar (positif atau negatif) adalah yang paling memengaruhi prediksi di sekitar nasabah itu. Syaratnya satu: surrogate itu harus benar-benar meniru GBM di sekitar titik itu. Bila tidak, koefisiennya menjelaskan surrogate yang salah — bukan GBM.",
        "Nilai [notebook] — surrogate manual gaya LIME untuk nasabah 858, dengan kernel yang BENAR: 2.000 sampel perturbasi di ruang 31 fitur yang distandardisasi, kernel exp(−(d/kw)²) dengan kw = 0,75 × akar(31) = 4,18 (default LIME), Ridge berbobot. Weighted R² = 0,4396 — surrogate menjelaskan 44% variasi prediksi GBM di sekitar titik itu: cukup baik untuk dibaca, jauh dari sempurna. Intercept surrogate 0,6197; prediksi surrogate pada titik itu sendiri 0,5475, sementara probabilitas GBM 0,8599 — selisih (fidelity gap) 0,3124: surrogate-nya MEREMEHKAN nasabah itu sendiri dengan selisih besar. Delapan koefisien terbesar: BILL_AMT1 +0,0637; PAY_AMT3 −0,0298; MARRIAGE +0,0237; PAY_AMT_MEAN −0,0191; PAY_0 +0,0168; UTILIZATION +0,0157; BILL_AMT6 +0,0156; PAY_AMT1 −0,0154. Tiga terbesar: BILL_AMT1, PAY_AMT3, MARRIAGE.",
        "Dan inilah vonis langkah ini: tiga teratas LIME TIDAK SATU PUN merupakan pendorong model yang sebenarnya. Menurut SHAP (langkah 6) dan permutation (langkah 3), pendorong GBM adalah PAY_MAX (SHAP global 0,4946; lokal +1,1368) dan PAY_0 (0,2385; +0,9280). Di daftar LIME, PAY_0 hanya peringkat lima (+0,0168) dan PAY_MAX bahkan tidak masuk delapan besar. MARRIAGE — fitur yang koefisien LR-nya hanya −0,0565 dan SHAP global-nya 0,0259 — justru peringkat tiga LIME (+0,0237). Surrogate yang fit-nya lumayan (R² 0,4396) menunjuk fitur yang salah. Mengapa? GBM belajar bentuk TANGGA (PDP langkah 5: datar–naik–datar), sementara LIME memaksakan BIDANG linear di sekitar titik itu — arah tercuram bidang itu belum tentu arah pendorong model yang sebenarnya. Di sekitar nasabah 858 yang sudah jauh di atas ambang, bidang linear itu menangkap kemiringan lokal dari fitur-fitur kecil, bukan lompatan tangga PAY_MAX. Stabilitas tidak menyelamatkan vonis ini: seed 7 memberi top-3 BILL_AMT1, BILL_AMT6, MARRIAGE — overlap 2 dari 3 dengan seed 42 — dan R² seed 7 0,4374, hampir sama dengan 0,4396. Surrogate-nya STABIL dan tetap SALAH: stabilitas bukan kebenaran.",
        "Catatan kehati-hatian tentang bagaimana angka di atas didapat — karena percobaan pertamalah yang mengajarkan pelajaran paling mahal di langkah ini. Upaya pertama memakai kernel naive exp(−d²) dengan kw = 1,0: di ruang 31 dimensi, hampir semua tetangga berada «jauh», sehingga bobotnya praktis NOL untuk semua sampel — weighted R² = 0,0003, semua koefisien 0,0000, surrogate yang tidak belajar apa-apa. Itu BUG kernel width, bukan vonis atas LIME — dan ia diperbaiki dengan kw = 4,18 (default LIME). Pelajarannya: kernel width adalah hiperparameter yang bisa MENGHAPUS penjelasanmu secara diam-diam; LIME tidak memberi peringatan bila bobotnya runtuh — ia tetap mengeluarkan koefisien. Selalu laporkan kw dan R² berdampingan dengan koefisiennya.",
        "Baik atau buruk: LIME bagus sebagai IDE — model pengganti lokal yang sederhana dan bisa dibaca siapa pun, dan model-agnostic (bekerja untuk GBM apa pun). Buruk bila fidelity-nya tidak diperiksa: surrogate dengan R² 0,4396 dan fidelity gap 0,3124 pada titiknya sendiri adalah surrogate yang «cukup baik secara rata-rata, buruk tepat di titik yang dijelaskan» — dan koefisiennya menunjuk fitur yang salah (BILL_AMT1, bukan PAY_MAX). Buruk pula bila stabilitas dibaca sebagai kebenaran: overlap 2 dari 3 dan R² yang hampir sama antar seed membuktikan surrogate-nya konsisten — bukan bahwa ia benar.",
        "Mitigasi: JANGAN PERNAH melaporkan koefisien LIME tanpa empat angka pendamping: (1) kernel width kw (di sini 4,18), (2) weighted R² (di sini 0,4396), (3) fidelity gap pada titik itu sendiri (di sini 0,5475 vs 0,8599 — selisih 0,3124), (4) stabilitas top-k antar seed (di sini overlap 2 dari 3). Dan yang terpenting: SILANGKAN top fitur LIME dengan metode global (SHAP/permutation) — bila top-3 LIME tidak beririsan dengan lima besar global, percayai metode globalnya, bukan LIME-nya. Di data ini, LIME gagal uji silang itu — dan lesson ini mencatat kegagalan itu sebagai temuan, bukan menyembunyikannya.",
      ],
      formula: String.raw`\text{LIME: } \hat{g} = \arg\min_{g} \sum_{i} w_i \, \big( \hat{f}(z_i) - g(z_i) \big)^2 + \Omega(g), \qquad w_i = \exp\big(-(d_i / kw)^2\big)`,
      formulaNote: "LIME: latih model sederhana g (di sini Ridge linear) yang meniru model f di sekitar satu titik, dengan tetangga z_i dibobot kernel w_i menurut jarak d_i dan lebar kernel kw. Di sini kw = 0,75 × akar(31) = 4,18 (default LIME); weighted R² = 0,4396 [notebook]. Upaya pertama dengan kw = 1,0 memberi R² = 0,0003 — bug kernel width.",
      tasks: [],
      note: {
        title: "Miskonsepsi: «R² 0,44 dan stabil antar seed berarti LIME-nya benar»",
        type: "pitfall",
        body: "Yang benar: R² 0,4396 dan overlap top-3 2 dari 3 (R² seed 7 0,4374) membuktikan surrogate-nya KONSISTEN — bukan BENAR. Top-3 LIME (BILL_AMT1, PAY_AMT3, MARRIAGE) tidak mengandung pendorong model yang sebenarnya (PAY_MAX, PAY_0 menurut SHAP dan permutation). Stabilitas mengukur apakah surrogate yang sama terulang — bukan apakah ia meniru model yang benar. Uji yang benar adalah uji silang dengan metode global.",
      },
    },
    {
      id: "koefisien-lr-lokal",
      eyebrow: "Langkah 8 · LR yang bisa dibaca",
      title: "Koefisien LR: model yang memang bisa dibaca — termasuk tanda yang berbalik",
      prose: [
        "GBM butuh alat tambahan untuk dijelaskan; regresi logistik (LR) tidak. Koefisien LR ADALAH penjelasannya: log-odds prediksi = intercept + jumlah (koefisien × nilai fitur yang distandardisasi). Setiap koefisien berkata «bila fitur ini naik satu simpangan baku dan yang lain tetap, log-odds naik sebesar ini». Tidak ada pengacakan, tidak ada surrogate, tidak ada sampling — dekomposisi ini eksak untuk model itu. Harganya: LR mengasumsikan hubungan yang linear dalam log-odds (langkah 5 menunjukkan GBM menangkap bentuk tangga yang tidak bisa ditangkap LR), dan akurasinya lebih rendah (ROC-AUC 0,7426 vs GBM 0,7823).",
        "Nilai [notebook] — koefisien LR (fitur distandardisasi), intercept −1,485. Empat besar: PAY_DELAY_COUNT +0,756 (odds ratio 2,1297 — satu simpangan baku kenaikan jumlah bulan telat melipatgandakan odds default lebih dari dua kali); PAY_MAX +0,2741 (OR 1,3154); PAY_0 +0,2434 (OR 1,2756); LIMIT_BAL −0,2402 (OR 0,7865 — limit lebih besar, risiko lebih rendah). Berikutnya: PAY_AMT1 −0,1614; BILL_AMT2 +0,1334; PAY_AMT2 −0,1294; PAY_3 −0,1184. Dan inilah yang paling penting untuk dipahami: PAY_2 (−0,0969), PAY_3 (−0,1184), PAY_4 (−0,0711), PAY_5 (−0,1015), PAY_6 (−0,0901), dan PAY_MEAN (−0,0484) semuanya NEGATIF — padahal secara univariat, SETIAP fitur PAY menaikkan risiko [notebook]: nasabah yang telat di PAY_0 default 0,4985 vs yang tidak telat 0,1426 (n telat 1.324); PAY_2 telat 0,5542 vs tidak telat 0,1635; PAY_MEAN telat 0,4717 vs tidak telat 0,1427. Tidak ada satu pun fitur PAY yang «melindungi» secara univariat. Ini bukan kesalahan data: ini multikolinearitas. PAY_DELAY_COUNT (+0,756) dan PAY_MAX (+0,2741) sudah menyerap hampir seluruh sinyal «keterlambatan»; begitu keduanya masuk model, koefisien PAY_2 sampai PAY_6 mengukur sisa yang tidak dijelaskan keduanya — dan sisanya itu negatif. Koefisien LR adalah efek KONDISIONAL (dengan fitur lain tetap), bukan efek univariat.",
        "Dekomposisi lokal untuk nasabah 858 [notebook] — LR memberi probabilitas 0,7187 (log-odds 0,9378; periksa: sigmoid(0,9378) = 0,7187). Log-odds itu = intercept −1,485 + kontribusi tiap fitur. Delapan kontribusi terbesar: PAY_DELAY_COUNT +2,5175 (nilai terstandardisasi 3,3301 × koefisien 0,756); PAY_MAX +1,3426 (4,8980 × 0,2741); PAY_0 +0,6532 (2,6837 × 0,2434); LIMIT_BAL +0,2733 (−1,1379 × −0,2402 — limit rendah menaikkan log-odds karena koefisiennya negatif); PAY_5 −0,6558; PAY_6 −0,5738; PAY_4 −0,4421; PAY_MEAN −0,2403. Jumlah kedelapan itu 2,8746; ditambah intercept −1,485 menjadi 1,3896; 23 fitur lainnya menyumbang −0,4518; totalnya 0,9378 — tepat sama dengan log-odds model. Tiga reason code teratas untuk nasabah ini (bahasa awam): PAY_DELAY_COUNT — «Jumlah bulan dengan keterlambatan pembayaran»; PAY_MAX — «Keterlambatan pembayaran terburuk dalam 6 bulan terakhir»; PAY_0 — «Status pembayaran bulan terakhir». Perhatikan: reason codes ini berasal dari LR — GBM yang memutuskan 0,8492 tidak punya dekomposisi log-odds seperti ini; untuk GBM, reason codes yang setara datang dari SHAP lokal (langkah 6: PAY_MAX +1,1368, PAY_0 +0,9280).",
        "Baik atau buruk: dekomposisi LR bagus karena eksak, stabil (tidak ada seed, tidak ada sampling), dan langsung menjadi reason codes berbahasa awam — inilah yang bisa diserahkan ke nasabah dan auditor. Buruk bila koefisiennya dibaca sebagai efek univariat: PAY_5 −0,1015 TIDAK berarti «telat 5 bulan lalu menurunkan risiko» — ia berarti «setelah mengontrol jumlah bulan telat dan keterlambatan terburuk, sisa PAY_5 berkorelasi negatif». Dan buruk bila dilupakan bahwa LR ini model yang lebih lemah: penjelasannya eksak untuk MODEL yang menjelaskan 0,7426 ROC-AUC — bukan untuk GBM yang memutuskan.",
        "Mitigasi: bila kamu memakai reason codes dari LR untuk menjelaskan keputusan GBM, tulis itu secara eksplisit: «reason codes ini dari model LR pendamping (ROC-AUC 0,7426), bukan dari GBM keputusan (0,7823)». Jangan pernah menyajikan dekomposisi satu model sebagai penjelasan model lain tanpa label itu. Dan bila koefisien bertanda «salah» secara univariat, jangan «memperbaiki» tandanya — laporkan multikolinearitasnya (langkah 4) dan biarkan koefisien apa adanya.",
      ],
      formula: String.raw`\log \frac{\hat{p}}{1 - \hat{p}} = -1{,}485 + \sum_j \beta_j \, x_j, \qquad \text{kontribusi fitur } j = \beta_j \, x_j`,
      formulaNote: "Dekomposisi log-odds LR: prediksi = intercept + jumlah kontribusi tiap fitur (koefisien × nilai terstandardisasi). Untuk nasabah 858: −1,485 + 2,8746 (8 terbesar) − 0,4518 (23 sisanya) = 0,9378 → sigmoid = 0,7187 [notebook].",
      tasks: [],
    },
    {
      id: "penjelasan-menyesatkan",
      eyebrow: "Langkah 9 · Empat jebakan",
      title: "Penjelasan yang menyesatkan: empat cara penjelasanmu berbohong sambil terlihat benar",
      prose: [
        "Setelah lima alat (langkah 3–8), inilah langkah yang mengikat semuanya: empat jebakan yang membuat penjelasan terlihat meyakinkan padahal menyesatkan. Jebakan pertama — importance yang terpecah (langkah 4, diulang sebagai vonis): enam kolom tagihan berkorelasi r = 0,9463 dengan BILL_MEAN, sehingga permutation importance GBM terpecah menjadi serpihan (jumlah keenam kolom 0,0116, masing-masing 0,0000–0,0053) sementara BILL_MEAN sendiri 0,0048. Pembaca yang hanya melihat ranking akan menyimpulkan «tagihan tidak penting» — padahal keluarga tagihan sebesar 0,0116, hampir menyamai UTILIZATION (0,0130). Penjelasan yang tidak mengelompokkan fitur berkorelasi adalah penjelasan yang meremehkan sinyal yang terpecah.",
        "Jebakan kedua — model buruk tetap memberi ranking yang masuk akal. GBM yang sengaja dibuat underfit (max_iter 5) [notebook]: ROC-AUC test 0,7725 — hanya 0,0098 di bawah GBM penuh 0,7823 — dan ranking permutation-nya tampak sangat masuk akal: PAY_MAX 0,0582, PAY_0 0,0379, PAY_AMT_MEAN 0,0165. Tiga besar yang sama, urutan yang sama. Bila kamu hanya melihat ranking-nya, kamu tidak akan tahu modelnya underfit. Kualitas penjelasan DIBATASI oleh kualitas model: penjelasan dari model yang buruk adalah penjelasan yang rapi tentang model yang salah — dan tidak ada alat explainability yang bisa memperbaiki modelnya. Periksa dulu ROC-AUC, PR-AUC, dan kalibrasinya (M6.4) SEBELUM mempercayai penjelasannya.",
        "Jebakan ketiga — dua model, dua cerita. Lima besar LR (dari koefisien |β|): PAY_DELAY_COUNT, PAY_MAX, PAY_0, LIMIT_BAL, PAY_AMT1. Lima besar GBM (permutation): PAY_MAX, PAY_0, UTILIZATION, PAY_AMT_MEAN, LIMIT_BAL. Lima besar LR (permutation): PAY_DELAY_COUNT, PAY_MAX, LIMIT_BAL, PAY_0, PAY_AMT1. Ketiganya tidak sama: UTILIZATION peringkat tiga di GBM tapi hampir nol di LR (koefisien +0,0726; permutation LR 0,0002); PAY_DELAY_COUNT peringkat satu di LR (permutation 0,1422) tapi hampir nol di GBM (permutation 0,0012). Ini bukan kontradiksi — ini dua model yang memakai sinyal yang sama dengan cara berbeda (langkah 3): GBM menyerap sinyal keterlambatan lewat PAY_MAX dan PAY_0, LR lewat PAY_DELAY_COUNT. Penjelasan yang benar selalu menyebut MODELNYA: «menurut GBM…» atau «menurut LR…» — tanpa itu, «fitur terpenting» adalah frasa yang tidak punya arti.",
        "Jebakan keempat — model yang kehilangan sinyal utamanya tetap menjelaskan dirinya dengan percaya diri. Buang SEMUA fitur PAY (PAY_0, PAY_2–PAY_6, PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT — sembilan fitur) [notebook]: LR jatuh dari ROC-AUC 0,7426 ke 0,6467, GBM dari 0,7823 ke 0,7343. Modelnya jauh lebih buruk — tapi penjelasannya tetap terlihat meyakinkan: LR tanpa PAY menjelaskan dirinya dengan LIMIT_BAL −0,3923, PAY_AMT1 −0,2921, PAY_AMT2 −0,2745, BILL_AMT2 +0,2543; GBM tanpa PAY menjelaskan dirinya dengan permutation PAY_AMT2 0,0402, UTILIZATION 0,0351, BILL_TREND 0,0269. Tidak ada yang «salah» dari angka-angka itu — masing-masing benar untuk modelnya — tapi model yang dijelaskan itu bukan lagi model yang bagus. Inilah jebakan yang paling berbahaya: penjelasan yang benar tentang model yang buruk dibaca sebagai pembenaran model itu. Penjelasan tidak pernah membuktikan modelnya layak dipakai; kelayakan dibuktikan metrik (M6.4) SEBELUM penjelasan dibaca.",
        "Baik atau buruk: keempat jebakan ini bagus bila kamu mengenalinya — masing-masing punya uji yang murah: korelasi antar fitur (jebakan 1), metrik model sebelum penjelasan (jebakan 2 dan 4), dan perbandingan antar model (jebakan 3). Buruk bila kamu tidak mengenalinya: keempatnya menghasilkan penjelasan yang TERLIHAT benar — ranking yang rapi, angka yang presisi, bahasa yang yakin — dan kesalahan yang terlihat benar adalah kesalahan yang paling lama bertahan. LIME di langkah 7 mengikuti pola yang sama: surrogate yang menunjuk fitur yang salah dengan format yang rapi.",
        "Mitigasi: sebelum menyajikan penjelasan apa pun, jalankan daftar periksa empat butir: (1) korelasi — apakah fitur teratas berkorelasi kuat dengan fitur lain (r di atas 0,8)? Bila ya, laporkan per keluarga. (2) kualitas model — apakah ROC-AUC / PR-AUC / Brier model ini sudah diperiksa? Bila belum, penjelasan ditunda. (3) antar-model — apakah model pembanding sepakat? Bila tidak, laporkan keduanya. (4) fidelity — bila penjelasannya dari surrogate (LIME), berapa weighted R²-nya? Bila di bawah 0,1, buang. Empat butir, lima menit — dan penjelasanmu berubah dari «terlihat benar» menjadi «bisa diperiksa».",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «dua alat sepakat, jadi penjelasannya pasti benar»",
        type: "pitfall",
        body: "Yang benar: dua alat bisa sepakat karena keduanya memakai sinyal yang sama — bukan karena sinyal itu kausal. Permutation dan PDP sama-sama menunjuk PAY_MAX (0,0569; PDP naik 0,1589 ke 0,2897) — keduanya mengukur ketergantungan MODEL pada PAY_MAX. Tidak satu pun membuktikan PAY_MAX MENYEBABKAN default. Kesepakatan antar alat memperkuat klaim tentang model — bukan klaim tentang dunia.",
      },
    },
    {
      id: "explainability-untuk-fairness",
      eyebrow: "Langkah 10 · Explainability untuk fairness",
      title: "Explainability untuk fairness: penjelasan bisa menunjukkan DI MANA — bukan APAKAH adil",
      prose: [
        "Tiga lesson M7 membentuk satu rantai: M7.1 mengukur ketimpangan (AIR, TPR, FPR, kalibrasi per grup), M7.2 menyelidiki asalnya (lima sumber bias), dan lesson ini menjawab «fitur apa yang mendorong keputusan itu». Rantai itu hanya berguna bila tiap mata rantai tahu batasnya. Explainability TIDAK mengukur fairness — tidak ada angka SHAP, permutation, atau PDP yang berkata «model ini adil». Yang bisa dilakukan penjelasan adalah menunjukkan DI MANA ketimpangan itu hidup: fitur apa yang mendorong keputusan, dan apakah pendorong itu variabel bisnis yang sah atau proxy dari atribut grup.",
        "Nilai [notebook] — kontribusi kolom demografis pada prediksi GBM (mean |SHAP|, test 6.000, GBM mentah): SEX 0,0314; EDUCATION 0,0169; MARRIAGE 0,0259; AGE 0,0304 — semuanya di bawah 0,032, lawan PAY_MAX 0,4946 (lebih dari lima belas kali lipat). Keputusan model didorong luar biasa dominan oleh perilaku bayar, bukan oleh kolom demografis. Namun ketimpangan yang diukur M7.1 tetap ada: AIR SEX 0,8693; EDUCATION Pascasarjana AIR 0,603 (flag — dengan koreksi M7.1: n = 82 adalah grup Lainnya, pembandingnya, bukan Pascasarjana yang n-nya 2.130); FPR SMA 0,7463 vs Pascasarjana 0,5867. Kedua fakta itu konsisten — bukan bertentangan: ketimpangan mengalir LEWAT fitur perilaku bayar (limit, pola bayar, tagihan) yang distribusinya berbeda antar grup — temuan measurement bias M7.2. Penjelasan menunjukkan jalurnya: bukan kolom SEX yang mendorong penolakan, melainkan fitur-fitur yang berkorelasi dengan grup.",
        "Yang BISA dilakukan penjelasan untuk fairness ada tiga. Pertama, reason codes untuk adverse action: nasabah yang ditolak berhak atas alasan berbahasa awam — dari LR (langkah 8: PAY_DELAY_COUNT, PAY_MAX, PAY_0) atau dari SHAP lokal GBM (nasabah 858: PAY_MAX +1,1368, PAY_0 +0,9280). Kedua, memeriksa apakah pendorong keputusan adalah variabel bisnis yang sah: di sini ya — keterlambatan bayar adalah alasan kredit yang sah, bukan proxy yang terselubung. Ketiga, memberi input mitigasi M7.4: bila pendorongnya adalah fitur yang bias pengukurannya (M7.2), mitigasi akar-masalah menyentuh fitur itu — threshold hanya menutupi gejala. Catatan: M7.4 memperlihatkan penyesuaian threshold per grup memang menaikkan AIR (0,8694→0,9999) dengan biaya nyaris netral, tetapi itu bukan perbaikan akar-masalah. Yang TIDAK BISA dilakukan penjelasan ada tiga juga. Pertama, membuktikan fairness: model yang sepenuhnya bisa dijelaskan bisa tetap tidak adil — AIR tidak membaik karena dijelaskan. Kedua, mendeteksi label bias: SHAP membagi kredit prediksi, bukan kebenaran label — bila labelnya mewarisi keputusan manusia yang bias (M7.2 langkah 6), SHAP akan membagi bias itu dengan rapi. Ketiga, mendeteksi selection bias: PSI M2 (G9) 0,0104 dan PSI train vs test 0,0001–0,0008 (M7.2) menunjukkan tidak ada drift — tapi PSI tidak pernah melihat pengaju yang ditolak dulu dan tidak ada di data.",
        "Satu konsistensi lintas lesson yang patut dicatat: di M2 (scorecard), AIR perempuan/laki-laki 1,1502 — arah yang SAMA dengan model ini (perempuan lebih sering disetujui), dengan model dan definisi grup yang berbeda. Catatan arah: 0,8693 = laki-laki/perempuan (AIR M7.1), 1,1502 = perempuan/laki-laki (kebalikannya, arah M2.2) — selalu nyatakan arah AIR-mu. Konsistensi arah antar lesson memperkuat bahwa pola itu sifat data, bukan artefak satu model — dan penjelasan lesson ini (perilaku bayar sebagai pendorong, kolom demografis kecil) memberi mekanisme yang konsisten dengan pola itu.",
        "Baik atau buruk: memakai penjelasan untuk fairness itu bagus bila dipakai sebagai DIAGNOSIS LOKASI — «ketimpangan ini hidup di fitur perilaku bayar, bukan di kolom demografis» adalah informasi yang mengarahkan mitigasi. Buruk bila dipakai sebagai PEMBUKTIAN — «model kami bisa dijelaskan, jadi model kami adil» adalah non sequitur yang berbahaya, karena penjelasan dan keadilan adalah dua pertanyaan yang berbeda (langkah 2). Dan buruk bila reason codes disajikan tanpa menyebut model asalnya: reason codes LR (ROC-AUC 0,7426) bukan reason codes GBM (0,7823) — label modelnya wajib menyertai (langkah 8).",
        "Mitigasi: dalam setiap laporan fairness, sertakan SATU paragraf explainability dengan empat isi: (1) lima pendorong global model (di sini PAY_MAX, PAY_0, UTILIZATION, LIMIT_BAL, PAY_AMT_MEAN — SHAP dan permutation sepakat); (2) kontribusi kolom demografis (di sini semuanya di bawah 0,032 mean |SHAP|); (3) reason codes untuk contoh adverse action (di sini nasabah 858: PAY_MAX, PAY_0); (4) batas yang diakui — penjelasan tidak membuktikan fairness, tidak mendeteksi label bias, dan tidak mendeteksi selection bias. Bila laporan fairness tidak punya paragraf itu, ia belum menjelaskan dari mana ketimpangannya berasal — dan bila laporan explainability mengklaim membuktikan fairness, ia sudah melampaui batasnya.",
      ],
      tasks: [],
    },
    {
      id: "counterfactual",
      eyebrow: "Langkah 11 · Counterfactual",
      title: "Counterfactual: «apa yang harus berubah» — bukan «apa penyebabnya»",
      prose: [
        "Tiga jenis penjelasan yang sering dicampuradukkan — dan mencampurkannya adalah kesalahan yang mahal. DESCRIPTIVE: «fitur apa yang mendorong keputusan ini?» — SHAP menjawabnya (PAY_MAX +1,1368, PAY_0 +0,9280 untuk nasabah 858, langkah 6). Ia mendeskripsikan PENALARAN MODEL. COUNTERFACTUAL: «perubahan input minimal apa yang membalikkan keputusan?» — «seandainya riwayat bayar 858 sempurna, apakah ia disetujui?» Ia tetap pertanyaan tentang MODEL — what-if atas inputnya. CAUSAL: «PAY_MAX MENYEBABKAN default» — klaim tentang DUNIA, bukan tentang model. Klaim kausal butuh intervensi atau eksperimen — sesuatu yang lesson ini tidak pernah lakukan. SHAP yang besar tidak pernah membuktikan kausalitas: ia hanya berkata «model ini mengandalkan fitur itu», bukan «fitur itu menyebabkan hasilnya».",
        "Nilai [notebook] — counterfactual nasabah 858, dihitung ulang dari data (bukan ditebak). Baseline: GBM terkalibrasi 0,8492 — ditolak (threshold 0,10). CF-A, «seandainya enam bulan terakhir semuanya dibayar tepat waktu» (PAY_0..6 = −1, PAY_AMT tetap 0): LR 0,1382, GBM mentah 0,3707, GBM terkalibrasi 0,3325 — TETAP DITOLAK. CF-B, ditambah «dibayar penuh tiap bulan» (PAY_AMT1..6 = BILL_AMT): LR 0,1456, GBM mentah 0,1406, GBM terkalibrasi 0,1535 — TETAP DITOLAK. Bahkan riwayat yang SEMPURNA pun tidak membalikkan keputusan: limit NT$20.000 yang sangat rendah dan fitur-fitur lain tetap mendorong skor di atas 0,10. Dan perhatikan kejutan kecilnya: membayar penuh justru MENAIKKAN probabilitas LR (0,1382 → 0,1456) — arah counterfactual tidak bisa ditebak, ia harus dihitung ulang. Inilah gunanya counterfactual sebagai DIAGNOSIS: ia mengukur seberapa jauh keputusan ini dari ambang — dan jawabannya di sini: jauh.",
        "Baik atau buruk: counterfactual itu bagus bila dipakai sebagai diagnosis model — «seberapa besar perubahan yang dibutuhkan untuk membalikkan keputusan?» adalah pertanyaan yang sah dan terukur. Buruk bila dijual sebagai RENCANA AKSI untuk nasabah: nasabah 858 TIDAK BISA mengubah riwayat PAY_0..6-nya — enam bulan itu sudah terjadi. «Turunkan PAY_MAX-mu menjadi 0» bukan saran — itu manipulasi fitur: PAY_MAX adalah fitur TURUNAN (maksimum dari enam kolom PAY), bukan tombol yang bisa diputar. Dan buruk bila dibaca sebagai klaim kausal: «PAY_MAX yang menyebabkan penolakan» terdengar seperti fakta dunia, padahal yang ditunjukkan hanyalah «model ini sensitif terhadap PAY_MAX». Tiga aturan feasibility sebelum counterfactual apa pun ditulis sebagai saran: (1) fitur sensitif TIDAK PERNAH diubah — «jadi perempuan» atau «jadi 10 tahun lebih muda» bukan tindakan; (2) fitur historis tidak bisa diubah mundur — counterfactual atas masa lalu adalah diagnosis, bukan rencana; (3) hanya perilaku MASA DEPAN yang bisa disarankan — «bayar tepat waktu di bulan-bulan ke depan» — dan itu pun harus jujur: model ini menilai enam bulan TERAKHIR, jadi perbaikan perilaku baru terlihat di penilaian MENDATANG, bukan di keputusan hari ini.",
        "Mitigasi: setiap counterfactual yang kamu tulis wajib membawa TIGA label — modelnya (GBM terkalibrasi? LR?), perubahan eksaknya (kolom apa, dari berapa ke berapa), dan statusnya («what-if model, bukan janji» — keputusan masa depan memakai data masa depan). Jangan pernah menulis counterfactual tanpa ketiganya. Dan bila counterfactual-mu bahkan tidak membalikkan keputusan (seperti CF-A dan CF-B di sini), LAPORKAN itu apa adanya: «bahkan dengan riwayat sempurna, model ini tetap menolak» adalah informasi yang jauh lebih jujur — dan lebih berguna — daripada counterfactual yang dipilih-pilih sampai menemukan satu yang berhasil.",
      ],
      tasks: [],
    },
    {
      id: "adverse-action-workflow",
      eyebrow: "Langkah 12 · Alur komunikasi keputusan",
      title: "Dari penjelasan ke surat penolakan: alur komunikasi keputusan (adverse action)",
      prose: [
        "Penjelasan yang benar belum tentu surat penolakan yang baik. Nasabah 858 tidak butuh waterfall SHAP — ia butuh surat yang berkata, dalam bahasa yang ia mengerti, KENAPA ia ditolak, APA yang bisa ia lakukan, dan KEPADA SIAPA ia bisa banding. Alur komunikasi keputusan (adverse action) punya ENAM gerbang, dan penjelasan model hanya gerbang pertamanya: (1) keputusan: ditolak, skor GBM terkalibrasi 0,8492 ≥ threshold 0,10; (2) reason codes top-3 — DENGAN label model asalnya; (3) terjemahan ke bahasa awam; (4) langkah yang bisa dilakukan nasabah; (5) reviewer manusia yang memeriksa surat itu sebelum dikirim; (6) suratnya sendiri: keputusan, alasan, tindakan, jangka waktu banding, dan cara banding.",
        "Nilai [notebook] — template surat untuk nasabah 858. Keputusan: ditolak — probabilitas default prediksi 0,8492, di atas threshold 0,10. Tiga reason codes teratas (dari LR, ROC-AUC 0,7426): PAY_DELAY_COUNT — «Jumlah bulan dengan keterlambatan pembayaran»; PAY_MAX — «Keterlambatan pembayaran terburuk dalam 6 bulan terakhir»; PAY_0 — «Status pembayaran bulan terakhir». Langkah yang bisa dilakukan: bayar tepat waktu di bulan-bulan ke depan; bayar penuh bila memungkinkan; ajukan peninjauan limit setelah riwayat membaik. Yang TIDAK BOLEH tertulis: «ubah jenis kelaminmu», «ubah riwayat pembayaranmu» — keduanya bukan tindakan (langkah 11). Reviewer: nama peninjau manusia + tanggal. Banding: jangka waktu dan caranya, tertulis eksplisit. Dan footer-nya wajib: «reason codes ini dari model LR pendamping (ROC-AUC 0,7426), bukan dari GBM keputusan (0,7823)» — karena reason codes dari model lain tanpa label adalah penjelasan yang menyesatkan (langkah 8).",
        "Baik atau buruk: alur ini bagus karena ia memisahkan DUA dokumen yang sering dicampur: PENJELASAN (untuk analis dan auditor — waterfall SHAP, dekomposisi LR, permutation) dan SURAT PENOLAKAN (untuk nasabah — top-3 reason codes bahasa awam + tindakan + banding). Buruk bila keduanya dicampur: surat yang berisi waterfall SHAP lengkap (base −1,555, jumlah SHAP 3,3699, lima kontribusi terbesar) bukan surat yang baik — ia dokumen analis yang salah alamat. Dan buruk bila reason codes LR dan SHAP GBM dicampur tanpa label: top-3 LR adalah PAY_DELAY_COUNT, PAY_MAX, PAY_0 — top-3 SHAP GBM lokal adalah PAY_MAX, PAY_0, PAY_AMT3. Keduanya sepakat dua dari tiga — tapi PAY_DELAY_COUNT hanya ada di LR, PAY_AMT3 hanya ada di SHAP GBM. Surat yang menulis ketiganya seolah-olah dari satu model adalah surat yang berbohong soal sumbernya.",
        "Mitigasi: jadikan alur ini PROSEDUR OPERASIONAL, bukan kebiasaan. Setiap surat penolakan wajib lolos TIGA pemeriksaan sebelum dikirim: (1) apakah tiap reason code menyebut MODEL asalnya? (2) apakah tiap langkah yang disarankan BENAR-BENAR bisa dilakukan nasabah (uji feasibility langkah 11 — sensitif dan historis tidak lolos)? (3) apakah suratnya berisi reviewer, tanggal, dan cara banding? Satu pemeriksaan gagal berarti surat dikembalikan ke draf. Dan simpan salinan suratnya bersama model version dan threshold policy-nya (M7.4, langkah 12) — bila nasabah banding setahun kemudian, yang dibuka adalah surat DAN template tata kelolanya, bukan ingatan seseorang.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 13 · Lab 1",
      title: "Lab: permutation importance + PDP PAY_MAX + silang dengan SHAP",
      prose: [
        "Sekarang hitung sendiri tiga alat global — dari angka kanonis [notebook]. Permutation GBM (test 6.000, ROC-AUC, 10 ulangan, baseline 0,7823): PAY_MAX 0,0569; PAY_0 0,0241; UTILIZATION 0,0130. Permutation LR (baseline 0,7426): PAY_DELAY_COUNT 0,1422. PDP 1D PAY_MAX, rata-rata P(default): GBM terkalibrasi 0,1589 pada 0 dan 0,2897 pada 4; LR 0,1966 pada 0 dan 0,3334 pada 4. SHAP global (GBM mentah, mean |SHAP|): PAY_MAX 0,4946.",
        "Hasil yang diharapkan [lab]: top1_gbm=PAY_MAX; drop1_gbm=0.0569; top1_lr=PAY_DELAY_COUNT; drop1_lr=0.1422; pdp_delta_gbm=0.1308; pdp_delta_lr=0.1368; shap_top1=PAY_MAX; shap_top1_value=0.4946. Perhatikan tiga hal: pertama, GBM dan LR menunjuk fitur nomor satu yang BERBEDA (PAY_MAX vs PAY_DELAY_COUNT) — importance itu milik model, bukan milik fitur. Kedua, kenaikan PDP dari 0 ke 4 hampir sama besar di kedua model (0,1308 vs 0,1368) walau bentuk kurvanya berbeda (tangga vs mulus, langkah 5). Ketiga, SHAP dan permutation SEPAKAT soal nomor satu GBM (PAY_MAX) — konvergensi dua alat yang berbeda prinsip.",
        "Setelah lab jalan, bandingkan dengan langkah 9: bila seseorang hanya menyodorkan satu angka («PAY_MAX terpenting, 0,0569»), tanyakan tiga angka lainnya — permutation LR-nya, PDP-nya, dan SHAP-nya. Bila ketiganya tidak kamu hitung, klaim «terpenting»-mu hanya satu alat yang berbicara.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi top1_gbm, drop1_gbm, top1_lr, drop1_lr: fitur nomor satu + penurunannya, GBM vs LR" },
        { id: "t2", text: "Lengkapi pdp_delta_gbm dan pdp_delta_lr: PDP PAY_MAX pada 4 dikurangi pada 0, GBM terkalibrasi vs LR" },
        { id: "t3", text: "Lengkapi shap_top1 dan shap_top1_value: fitur nomor satu SHAP global + mean |SHAP|-nya" },
      ],
      expected: "top1_gbm=PAY_MAX\ndrop1_gbm=0.0569\ntop1_lr=PAY_DELAY_COUNT\ndrop1_lr=0.1422\npdp_delta_gbm=0.1308\npdp_delta_lr=0.1368\nshap_top1=PAY_MAX\nshap_top1_value=0.4946",
      hints: [
        "Permutation GBM tertinggi: PAY_MAX 0,0569. Permutation LR tertinggi: PAY_DELAY_COUNT 0,1422 — fitur nomor satunya berbeda antar model.",
        "PDP delta = nilai pada 4 dikurangi nilai pada 0: GBM 0,2897 − 0,1589 = 0,1308; LR 0,3334 − 0,1966 = 0,1368.",
        "SHAP global tertinggi: PAY_MAX, mean |SHAP| 0,4946 — sama dengan nomor satu permutation GBM.",
      ],
      code: {
        starter: `# Permutation + PDP PAY_MAX + silang SHAP — angka kanonis [notebook]
# Permutation (penurunan ROC-AUC test, 10 ulangan); PDP = rata-rata P(default)
PERM_GBM = {"PAY_MAX": 0.0569, "PAY_0": 0.0241, "UTILIZATION": 0.0130}
PERM_LR = {"PAY_DELAY_COUNT": 0.1422, "PAY_MAX": 0.0127, "LIMIT_BAL": 0.0098}
PDP_GBM = {0: 0.1589, 4: 0.2897}  # GBM terkalibrasi, PAY_MAX 0 dan 4
PDP_LR = {0: 0.1966, 4: 0.3334}  # LR, PAY_MAX 0 dan 4
SHAP_GLOBAL = {"PAY_MAX": 0.4946, "PAY_0": 0.2385, "UTILIZATION": 0.1574}

top1_gbm = ""  # TODO: fitur dengan permutation GBM tertinggi
drop1_gbm = 0.0  # TODO: nilai permutation GBM tertinggi
top1_lr = ""  # TODO: fitur dengan permutation LR tertinggi
drop1_lr = 0.0  # TODO: nilai permutation LR tertinggi
pdp_delta_gbm = 0.0  # TODO: PDP GBM pada 4 dikurangi pada 0
pdp_delta_lr = 0.0  # TODO: PDP LR pada 4 dikurangi pada 0
shap_top1 = ""  # TODO: fitur dengan mean |SHAP| tertinggi
shap_top1_value = 0.0  # TODO: nilai mean |SHAP| tertinggi
print(f"top1_gbm={top1_gbm}")
print(f"drop1_gbm={drop1_gbm:.4f}")
print(f"top1_lr={top1_lr}")
print(f"drop1_lr={drop1_lr:.4f}")
print(f"pdp_delta_gbm={pdp_delta_gbm:.4f}")
print(f"pdp_delta_lr={pdp_delta_lr:.4f}")
print(f"shap_top1={shap_top1}")
print(f"shap_top1_value={shap_top1_value:.4f}")`,
        lockLines: 8,
        solution: `# Permutation + PDP PAY_MAX + silang SHAP — angka kanonis [notebook]
# Permutation (penurunan ROC-AUC test, 10 ulangan); PDP = rata-rata P(default)
PERM_GBM = {"PAY_MAX": 0.0569, "PAY_0": 0.0241, "UTILIZATION": 0.0130}
PERM_LR = {"PAY_DELAY_COUNT": 0.1422, "PAY_MAX": 0.0127, "LIMIT_BAL": 0.0098}
PDP_GBM = {0: 0.1589, 4: 0.2897}  # GBM terkalibrasi, PAY_MAX 0 dan 4
PDP_LR = {0: 0.1966, 4: 0.3334}  # LR, PAY_MAX 0 dan 4
SHAP_GLOBAL = {"PAY_MAX": 0.4946, "PAY_0": 0.2385, "UTILIZATION": 0.1574}

top1_gbm = max(PERM_GBM, key=PERM_GBM.get)
drop1_gbm = PERM_GBM[top1_gbm]
top1_lr = max(PERM_LR, key=PERM_LR.get)
drop1_lr = PERM_LR[top1_lr]
pdp_delta_gbm = PDP_GBM[4] - PDP_GBM[0]
pdp_delta_lr = PDP_LR[4] - PDP_LR[0]
shap_top1 = max(SHAP_GLOBAL, key=SHAP_GLOBAL.get)
shap_top1_value = SHAP_GLOBAL[shap_top1]
print(f"top1_gbm={top1_gbm}")
print(f"drop1_gbm={drop1_gbm:.4f}")
print(f"top1_lr={top1_lr}")
print(f"drop1_lr={drop1_lr:.4f}")
print(f"pdp_delta_gbm={pdp_delta_gbm:.4f}")
print(f"pdp_delta_lr={pdp_delta_lr:.4f}")
print(f"shap_top1={shap_top1}")
print(f"shap_top1_value={shap_top1_value:.4f}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "top1_gbm=PAY_MAX", label: "Output menampilkan top1_gbm=PAY_MAX", msg: "Permutation GBM tertinggi adalah PAY_MAX (0,0569)." },
          { kind: "equal", task: "t1", name: "drop1_gbm", value: 0.0569, tol: 0.00005, label: "`drop1_gbm` seharusnya 0.0569", msg: "Mengacak PAY_MAX menurunkan ROC-AUC GBM sebesar 0,0569." },
          { kind: "stdout_matches", task: "t1", pattern: "top1_lr=PAY_DELAY_COUNT", label: "Output menampilkan top1_lr=PAY_DELAY_COUNT", msg: "Permutation LR tertinggi adalah PAY_DELAY_COUNT (0,1422) — fitur nomor satu yang berbeda dari GBM." },
          { kind: "equal", task: "t1", name: "drop1_lr", value: 0.1422, tol: 0.00005, label: "`drop1_lr` seharusnya 0.1422", msg: "Mengacak PAY_DELAY_COUNT menurunkan ROC-AUC LR sebesar 0,1422 — jauh di atas semua fitur lain di LR." },
          { kind: "equal", task: "t2", name: "pdp_delta_gbm", value: 0.1308, tol: 0.00005, label: "`pdp_delta_gbm` seharusnya 0.1308", msg: "PDP GBM: 0,2897 − 0,1589 = 0,1308 — kenaikan rata-rata P(default) dari PAY_MAX 0 ke 4." },
          { kind: "equal", task: "t2", name: "pdp_delta_lr", value: 0.1368, tol: 0.00005, label: "`pdp_delta_lr` seharusnya 0.1368", msg: "PDP LR: 0,3334 − 0,1966 = 0,1368 — hampir sama besar dengan GBM, walau bentuk kurvanya berbeda." },
          { kind: "stdout_matches", task: "t3", pattern: "shap_top1=PAY_MAX", label: "Output menampilkan shap_top1=PAY_MAX", msg: "SHAP global tertinggi juga PAY_MAX — SHAP dan permutation sepakat soal nomor satu GBM." },
          { kind: "equal", task: "t3", name: "shap_top1_value", value: 0.4946, tol: 0.00005, label: "`shap_top1_value` seharusnya 0.4946", msg: "Mean |SHAP| PAY_MAX 0,4946 — lebih dari dua kali PAY_0 (0,2385)." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 14 · Lab 2",
      title: "Lab: dekomposisi lokal nasabah 858 — LR, SHAP, dan vonis LIME",
      prose: [
        "Lab kedua membedah SATU nasabah (858, label aktual 1) dengan tiga alat lokal — dari angka kanonis [notebook]. LR: intercept −1,485; delapan kontribusi terbesar berjumlah 2,8746 (PAY_DELAY_COUNT +2,5175; PAY_MAX +1,3426; PAY_0 +0,6532; LIMIT_BAL +0,2733; PAY_5 −0,6558; PAY_6 −0,5738; PAY_4 −0,4421; PAY_MEAN −0,2403); 23 fitur sisanya −0,4518; log-odds 0,9378; probabilitas 0,7187. SHAP (GBM mentah): base value −1,555; jumlah SHAP 3,3699; log-odds GBM 1,8148; probabilitas GBM mentah 0,8599; dua SHAP lokal terbesar PAY_MAX +1,1368 dan PAY_0 +0,9280. LIME (kw 4,18): weighted R² 0,4396; prediksi surrogate pada titik itu 0,5475 vs GBM 0,8599; top-1 BILL_AMT1 (+0,0637).",
        "Hasil yang diharapkan [lab]: logodds_lr=0.9378; proba_lr=0.7187; shap_logodds_gbm=1.8149; shap_top1_local=PAY_MAX; shap_top2_local=PAY_0; lime_top1=BILL_AMT1; lime_ok=False. Catatan pembulatan: dari angka yang dibulatkan di lesson ini, −1,555 + 3,3699 = 1,8149 — selisih 0,0001 dari 1,8148 kanonis (yang dihitung dari nilai tak dibulatkan, galat efisiensi 0,0); check memakai toleransi 0,0005 sehingga keduanya lolos. Perhatikan tiga hal: pertama, dekomposisi LR dan SHAP sama-sama «menjumlah» dengan tepat — LR: −1,485 + 2,8746 − 0,4518 = 0,9378; SHAP: −1,555 + 3,3699 ≈ 1,8148 (kanonis). Kedua, dua alat yang berbeda itu SEPAKAT soal dua pendorong teratas nasabah 858 (PAY_MAX dan PAY_0 — walau angkanya berbeda karena model dan skalanya berbeda: LR memberi probabilitas 0,7187, GBM 0,8599). Ketiga, LIME TIDAK sepakat — top-1-nya BILL_AMT1, bukan PAY_MAX — dan vonisnya False: penjelasan LIME untuk nasabah ini tidak lolos uji silang.",
        "Setelah lab jalan, bandingkan dengan langkah 10: reason codes untuk nasabah 858 adalah PAY_DELAY_COUNT, PAY_MAX, PAY_0 (dari LR) — dan SHAP GBM mengonfirmasi dua dari tiga teratas (PAY_MAX, PAY_0). Itulah reason codes yang bisa diserahkan ke nasabah, lengkap dengan label model asalnya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi logodds_lr dan proba_lr: intercept + 8 kontribusi terbesar + 23 fitur sisanya, lalu sigmoid" },
        { id: "t2", text: "Lengkapi shap_logodds_gbm, shap_top1_local, shap_top2_local: base + jumlah SHAP dan dua SHAP lokal terbesar" },
        { id: "t3", text: "Lengkapi lime_top1 dan lime_ok: top-1 LIME dan apakah ia lolos uji silang (top-3 LIME mengandung PAY_MAX atau PAY_0?)" },
      ],
      expected: "logodds_lr=0.9378\nproba_lr=0.7187\nshap_logodds_gbm=1.8149\nshap_top1_local=PAY_MAX\nshap_top2_local=PAY_0\nlime_top1=BILL_AMT1\nlime_ok=False",
      hints: [
        "Log-odds LR = −1,485 + 2,8746 + (−0,4518) = 0,9378; probabilitas = 1 / (1 + exp(−log-odds)) = 0,7187.",
        "SHAP log-odds = base −1,555 + jumlah SHAP 3,3699 = 1,8149 dari angka bulat (1,8148 kanonis — selisih pembulatan 0,0001, dalam toleransi check 0,0005); dua terbesar: PAY_MAX +1,1368, PAY_0 +0,9280.",
        "Top-1 LIME adalah BILL_AMT1 (+0,0637); top-3 LIME (BILL_AMT1, PAY_AMT3, MARRIAGE) tidak mengandung PAY_MAX maupun PAY_0 — jadi lime_ok = False.",
      ],
      code: {
        starter: `# Dekomposisi lokal nasabah 858 — angka kanonis [notebook]
# LR: intercept + kontribusi; SHAP: base + jumlah SHAP (GBM mentah); LIME: kw 4,18
import math
INTERCEPT_LR = -1.485
TOP8_SUM_LR = 2.8746  # jumlah 8 kontribusi LR terbesar
REST23_LR = -0.4518  # jumlah kontribusi 23 fitur LR sisanya
BASE_SHAP = -1.555  # base value SHAP (log-odds)
SUM_SHAP = 3.3699  # jumlah SHAP nasabah 858
SHAP_LOCAL = {"PAY_MAX": 1.1368, "PAY_0": 0.9280, "PAY_AMT3": 0.1553}
LIME_TOP3 = ["BILL_AMT1", "PAY_AMT3", "MARRIAGE"]  # top-3 koefisien LIME

logodds_lr = 0.0  # TODO: INTERCEPT_LR + TOP8_SUM_LR + REST23_LR
proba_lr = 0.0  # TODO: sigmoid(logodds_lr)
shap_logodds_gbm = 0.0  # TODO: BASE_SHAP + SUM_SHAP
shap_top1_local = ""  # TODO: fitur dengan SHAP lokal terbesar
shap_top2_local = ""  # TODO: fitur dengan SHAP lokal terbesar kedua
lime_top1 = ""  # TODO: top-1 LIME (elemen pertama LIME_TOP3)
lime_ok = True  # TODO: False bila top-3 LIME TIDAK mengandung PAY_MAX maupun PAY_0
print(f"logodds_lr={logodds_lr:.4f}")
print(f"proba_lr={proba_lr:.4f}")
print(f"shap_logodds_gbm={shap_logodds_gbm:.4f}")
print(f"shap_top1_local={shap_top1_local}")
print(f"shap_top2_local={shap_top2_local}")
print(f"lime_top1={lime_top1}")
print(f"lime_ok={lime_ok}")`,
        lockLines: 11,
        solution: `# Dekomposisi lokal nasabah 858 — angka kanonis [notebook]
# LR: intercept + kontribusi; SHAP: base + jumlah SHAP (GBM mentah); LIME: kw 4,18
import math
INTERCEPT_LR = -1.485
TOP8_SUM_LR = 2.8746  # jumlah 8 kontribusi LR terbesar
REST23_LR = -0.4518  # jumlah kontribusi 23 fitur LR sisanya
BASE_SHAP = -1.555  # base value SHAP (log-odds)
SUM_SHAP = 3.3699  # jumlah SHAP nasabah 858
SHAP_LOCAL = {"PAY_MAX": 1.1368, "PAY_0": 0.9280, "PAY_AMT3": 0.1553}
LIME_TOP3 = ["BILL_AMT1", "PAY_AMT3", "MARRIAGE"]  # top-3 koefisien LIME

logodds_lr = INTERCEPT_LR + TOP8_SUM_LR + REST23_LR
proba_lr = 1 / (1 + math.exp(-logodds_lr))
shap_logodds_gbm = BASE_SHAP + SUM_SHAP
shap_top1_local = max(SHAP_LOCAL, key=SHAP_LOCAL.get)
shap_top2_local = sorted(SHAP_LOCAL, key=SHAP_LOCAL.get, reverse=True)[1]
lime_top1 = LIME_TOP3[0]
lime_ok = ("PAY_MAX" in LIME_TOP3) or ("PAY_0" in LIME_TOP3)
print(f"logodds_lr={logodds_lr:.4f}")
print(f"proba_lr={proba_lr:.4f}")
print(f"shap_logodds_gbm={shap_logodds_gbm:.4f}")
print(f"shap_top1_local={shap_top1_local}")
print(f"shap_top2_local={shap_top2_local}")
print(f"lime_top1={lime_top1}")
print(f"lime_ok={lime_ok}")`,
        checks: [
          { kind: "equal", task: "t1", name: "logodds_lr", value: 0.9378, tol: 0.0005, label: "`logodds_lr` seharusnya 0.9378", msg: "Log-odds LR nasabah 858: −1,485 + 2,8746 − 0,4518 = 0,9378 — dekomposisi yang menjumlah tepat." },
          { kind: "equal", task: "t1", name: "proba_lr", value: 0.7187, tol: 0.0005, label: "`proba_lr` seharusnya 0.7187", msg: "Sigmoid(0,9378) = 0,7187 — probabilitas LR untuk nasabah 858." },
          { kind: "equal", task: "t2", name: "shap_logodds_gbm", value: 1.8148, tol: 0.0005, label: "`shap_logodds_gbm` seharusnya 1.8148", msg: "SHAP: −1,555 + 3,3699 ≈ 1,8148 — aksioma efisiensi terverifikasi (tanpa pembulatan, galat 0,0; selisih 0,0001 pada angka yang ditampilkan murni pembulatan)." },
          { kind: "stdout_matches", task: "t2", pattern: "shap_top1_local=PAY_MAX", label: "Output menampilkan shap_top1_local=PAY_MAX", msg: "SHAP lokal terbesar nasabah 858 adalah PAY_MAX (+1,1368)." },
          { kind: "stdout_matches", task: "t2", pattern: "shap_top2_local=PAY_0", label: "Output menampilkan shap_top2_local=PAY_0", msg: "SHAP lokal terbesar kedua adalah PAY_0 (+0,9280) — dua pendorong yang sama dengan LR." },
          { kind: "stdout_matches", task: "t3", pattern: "lime_top1=BILL_AMT1", label: "Output menampilkan lime_top1=BILL_AMT1", msg: "Top-1 LIME adalah BILL_AMT1 (+0,0637) — bukan pendorong model yang sebenarnya." },
          { kind: "stdout_matches", task: "t3", pattern: "lime_ok=False", label: "Output menampilkan lime_ok=False", msg: "Top-3 LIME (BILL_AMT1, PAY_AMT3, MARRIAGE) tidak mengandung PAY_MAX maupun PAY_0 — LIME gagal uji silang untuk nasabah ini." },
        ],
      },
    },
    {
      id: "lab3",
      eyebrow: "Langkah 15 · Lab 3",
      title: "Lab: dari fitur kanonis ke bahasa pelanggan — reason codes untuk nasabah 858",
      prose: [
        "Lab ketiga mengubah angka kanonis menjadi surat. LR top-3 untuk nasabah 858 [notebook]: PAY_DELAY_COUNT +2,5175; PAY_MAX +1,3426; PAY_0 +0,6532 (log-odds 0,9378; probabilitas 0,7187). SHAP GBM top-3 lokal: PAY_MAX +1,1368; PAY_0 +0,9280; PAY_AMT3 +0,1553 (base −1,555; jumlah SHAP 3,3699; log-odds 1,8148). GBM terkalibrasi 0,8492 — ditolak, threshold 0,10. Tugasmu: terjemahkan top-3 LR ke bahasa awam, hitung berapa yang tumpang tindih dengan top-3 SHAP GBM, dan tandai tiap usulan tindakan sebagai feasible atau tidak — dengan aturan feasibility langkah 11.",
        "Hasil yang diharapkan [lab]: reason_lr_1=Jumlah bulan dengan keterlambatan pembayaran; reason_lr_2=Keterlambatan pembayaran terburuk dalam 6 bulan terakhir; reason_lr_3=Status pembayaran bulan terakhir; overlap_lr_shap=2; feasible_bayar_tepat_waktu=True; feasible_ubah_sex=False; feasible_ubah_riwayat_pay=False. Perhatikan tiga hal: pertama, reason codes LR dan SHAP GBM sepakat dua dari tiga (PAY_MAX, PAY_0) — PAY_DELAY_COUNT hanya di LR, PAY_AMT3 hanya di SHAP GBM — jadi label model di surat TIDAK BOLEH dihilangkan. Kedua, «bayar tepat waktu di bulan-bulan ke depan» feasible karena ia perilaku MASA DEPAN — sementara «ubah riwayat PAY» tidak, karena riwayat sudah terjadi. Ketiga, reason code yang baik tidak menyebut nama fitur mentahnya: nasabah tidak tahu apa itu PAY_MAX — ia tahu «keterlambatan pembayaran terburuk dalam 6 bulan terakhir».",
        "Setelah lab jalan, bandingkan dengan langkah 12: surat penolakan yang baik berisi KETIGA reason codes ini dalam bahasa awam + langkah yang bisa dilakukan + reviewer + jangka waktu banding — dan footer yang menyebut model asalnya (LR, ROC-AUC 0,7426). Bila satu pun dari ketiganya hilang, surat itu belum siap dikirim.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi reason_lr_1..3: terjemahan bahasa awam untuk top-3 LR (PAY_DELAY_COUNT, PAY_MAX, PAY_0)" },
        { id: "t2", text: "Lengkapi overlap_lr_shap: jumlah fitur yang ada di top-3 LR DAN top-3 SHAP GBM" },
        { id: "t3", text: "Lengkapi tiga flag feasibility: bayar tepat waktu (masa depan), ubah SEX, ubah riwayat PAY" },
      ],
      expected: "reason_lr_1=Jumlah bulan dengan keterlambatan pembayaran\nreason_lr_2=Keterlambatan pembayaran terburuk dalam 6 bulan terakhir\nreason_lr_3=Status pembayaran bulan terakhir\noverlap_lr_shap=2\nfeasible_bayar_tepat_waktu=True\nfeasible_ubah_sex=False\nfeasible_ubah_riwayat_pay=False",
      hints: [
        "Terjemahan kanonis (langkah 8): PAY_DELAY_COUNT — «Jumlah bulan dengan keterlambatan pembayaran»; PAY_MAX — «Keterlambatan pembayaran terburuk dalam 6 bulan terakhir»; PAY_0 — «Status pembayaran bulan terakhir».",
        "Top-3 LR: PAY_DELAY_COUNT, PAY_MAX, PAY_0. Top-3 SHAP GBM lokal: PAY_MAX, PAY_0, PAY_AMT3. Yang sama: PAY_MAX dan PAY_0 — jadi overlap = 2.",
        "Feasibility (langkah 11): perilaku masa depan (bayar tepat waktu bulan depan) = True; atribut sensitif (SEX) = False; riwayat (PAY_0..6) = False — masa lalu tidak bisa diubah mundur.",
      ],
      code: {
        starter: `# Reason codes untuk nasabah 858 — dari fitur kanonis ke bahasa pelanggan
# LR top-3: PAY_DELAY_COUNT +2,5175; PAY_MAX +1,3426; PAY_0 +0,6532
# SHAP GBM top-3 lokal: PAY_MAX +1,1368; PAY_0 +0,9280; PAY_AMT3 +0,1553
# GBM terkalibrasi: 0,8492 (ditolak, threshold 0,10); LR: 0,7187
LR_TOP3 = ["PAY_DELAY_COUNT", "PAY_MAX", "PAY_0"]
SHAP_TOP3 = ["PAY_MAX", "PAY_0", "PAY_AMT3"]
PLAIN = {
    "PAY_DELAY_COUNT": "Jumlah bulan dengan keterlambatan pembayaran",
    "PAY_MAX": "Keterlambatan pembayaran terburuk dalam 6 bulan terakhir",
    "PAY_0": "Status pembayaran bulan terakhir",
    "PAY_AMT3": "Jumlah yang dibayar 3 bulan lalu",
}

reason_lr_1 = ""  # TODO: PLAIN[LR_TOP3[0]]
reason_lr_2 = ""  # TODO: PLAIN[LR_TOP3[1]]
reason_lr_3 = ""  # TODO: PLAIN[LR_TOP3[2]]
overlap_lr_shap = 0  # TODO: jumlah fitur yang ada di LR_TOP3 DAN SHAP_TOP3
feasible_bayar_tepat_waktu = None  # TODO: True — perilaku masa depan yang bisa dilakukan
feasible_ubah_sex = None  # TODO: False — atribut sensitif tidak diubah
feasible_ubah_riwayat_pay = None  # TODO: False — riwayat tidak bisa diubah mundur
print(f"reason_lr_1={reason_lr_1}")
print(f"reason_lr_2={reason_lr_2}")
print(f"reason_lr_3={reason_lr_3}")
print(f"overlap_lr_shap={overlap_lr_shap}")
print(f"feasible_bayar_tepat_waktu={feasible_bayar_tepat_waktu}")
print(f"feasible_ubah_sex={feasible_ubah_sex}")
print(f"feasible_ubah_riwayat_pay={feasible_ubah_riwayat_pay}")`,
        lockLines: 13,
        solution: `# Reason codes untuk nasabah 858 — dari fitur kanonis ke bahasa pelanggan
# LR top-3: PAY_DELAY_COUNT +2,5175; PAY_MAX +1,3426; PAY_0 +0,6532
# SHAP GBM top-3 lokal: PAY_MAX +1,1368; PAY_0 +0,9280; PAY_AMT3 +0,1553
# GBM terkalibrasi: 0,8492 (ditolak, threshold 0,10); LR: 0,7187
LR_TOP3 = ["PAY_DELAY_COUNT", "PAY_MAX", "PAY_0"]
SHAP_TOP3 = ["PAY_MAX", "PAY_0", "PAY_AMT3"]
PLAIN = {
    "PAY_DELAY_COUNT": "Jumlah bulan dengan keterlambatan pembayaran",
    "PAY_MAX": "Keterlambatan pembayaran terburuk dalam 6 bulan terakhir",
    "PAY_0": "Status pembayaran bulan terakhir",
    "PAY_AMT3": "Jumlah yang dibayar 3 bulan lalu",
}

reason_lr_1 = PLAIN[LR_TOP3[0]]
reason_lr_2 = PLAIN[LR_TOP3[1]]
reason_lr_3 = PLAIN[LR_TOP3[2]]
overlap_lr_shap = len(set(LR_TOP3) & set(SHAP_TOP3))
feasible_bayar_tepat_waktu = True
feasible_ubah_sex = False
feasible_ubah_riwayat_pay = False
print(f"reason_lr_1={reason_lr_1}")
print(f"reason_lr_2={reason_lr_2}")
print(f"reason_lr_3={reason_lr_3}")
print(f"overlap_lr_shap={overlap_lr_shap}")
print(f"feasible_bayar_tepat_waktu={feasible_bayar_tepat_waktu}")
print(f"feasible_ubah_sex={feasible_ubah_sex}")
print(f"feasible_ubah_riwayat_pay={feasible_ubah_riwayat_pay}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "reason_lr_1=Jumlah bulan dengan keterlambatan pembayaran", label: "Output menampilkan reason_lr_1 dalam bahasa awam", msg: "Reason code pertama LR: «Jumlah bulan dengan keterlambatan pembayaran» (PAY_DELAY_COUNT +2,5175)." },
          { kind: "stdout_matches", task: "t1", pattern: "reason_lr_2=Keterlambatan pembayaran terburuk dalam 6 bulan terakhir", label: "Output menampilkan reason_lr_2 dalam bahasa awam", msg: "Reason code kedua LR: «Keterlambatan pembayaran terburuk dalam 6 bulan terakhir» (PAY_MAX +1,3426)." },
          { kind: "stdout_matches", task: "t1", pattern: "reason_lr_3=Status pembayaran bulan terakhir", label: "Output menampilkan reason_lr_3 dalam bahasa awam", msg: "Reason code ketiga LR: «Status pembayaran bulan terakhir» (PAY_0 +0,6532)." },
          { kind: "equal", task: "t2", name: "overlap_lr_shap", value: 2, tol: 0, label: "`overlap_lr_shap` seharusnya 2", msg: "Top-3 LR dan top-3 SHAP GBM sepakat dua dari tiga (PAY_MAX, PAY_0) — PAY_DELAY_COUNT hanya di LR, PAY_AMT3 hanya di SHAP GBM." },
          { kind: "stdout_matches", task: "t3", pattern: "feasible_bayar_tepat_waktu=True", label: "Output menampilkan feasible_bayar_tepat_waktu=True", msg: "Bayar tepat waktu di bulan-bulan ke depan adalah perilaku masa depan — feasible." },
          { kind: "stdout_matches", task: "t3", pattern: "feasible_ubah_sex=False", label: "Output menampilkan feasible_ubah_sex=False", msg: "Atribut sensitif (SEX) tidak pernah diubah dalam counterfactual — bukan tindakan." },
          { kind: "stdout_matches", task: "t3", pattern: "feasible_ubah_riwayat_pay=False", label: "Output menampilkan feasible_ubah_riwayat_pay=False", msg: "Riwayat PAY_0..6 sudah terjadi — tidak bisa diubah mundur; counterfactual atasnya adalah diagnosis, bukan rencana." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 16 · Checkpoint",
      title: "Checkpoint: lima alat, satu nasabah, dan penjelasan yang bisa diperiksa",
      prose: [
        "Rangkuman: model keputusan = GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 [notebook]. ROC-AUC GBM mentah 0,7823 / PR-AUC 0,5597; LR 0,7426 / 0,5049. Global vs lokal: pertanyaan global dijawab permutation, PDP, dan mean |SHAP|; pertanyaan lokal dijawab dekomposisi LR, SHAP waterfall, dan LIME — jangan jawab yang satu dengan yang lain. Permutation GBM (10 ulangan, baseline 0,7823): PAY_MAX 0,0569; PAY_0 0,0241; UTILIZATION 0,0130; PAY_AMT_MEAN 0,0069; LIMIT_BAL 0,0062. Permutation LR: PAY_DELAY_COUNT 0,1422 — fitur nomor satu yang berbeda antar model. Jebakan permutation: BILL_AMT1..6 berkorelasi r = 0,9463 dengan BILL_MEAN — jumlah keenam kolom 0,0116, masing-masing tampak kecil; PAY_MEAN vs PAY_MAX r = 0,8194 (PAY_MEAN 0,0003 vs PAY_MAX 0,0569). PDP 1D PAY_MAX: GBM terkalibrasi datar 0,1589 pada −2..0, naik ke 0,2897 pada 4, datar 0,2892 sampai 8 (tangga); LR naik mulus 0,1456 ke 0,5063. PDP UTILIZATION: GBM 0,1990 ke 0,2627 (jenuh); PDP PAY_MEAN (grid bersih): 0,2084 ke puncak 0,2460 pada 2, lalu 0,2399 pada 4. PDP 2D PAY_MAX kali UTILIZATION: (0; 0,2) 0,1389 sampai (4; 2,0) 0,3275 — hampir aditif, tanpa interaksi kuat. SHAP (shap 0.54.1, TreeExplainer, GBM mentah — caveat: nilai eksak pada skor terkalibrasi berbeda): global mean |SHAP| PAY_MAX 0,4946; PAY_0 0,2385; UTILIZATION 0,1574; LIMIT_BAL 0,1113; PAY_AMT_MEAN 0,0892 — lima besar yang sama dengan permutation. Lokal nasabah 858: base −1,555 + jumlah SHAP 3,3699 ≈ 1,8148 (tanpa pembulatan, galat 0,0); PAY_MAX +1,1368, PAY_0 +0,9280. LIME (kw 4,18): R² 0,4396, prediksi surrogate 0,5475 vs GBM 0,8599 (gap 0,3124), top-3 BILL_AMT1, PAY_AMT3, MARRIAGE — menunjuk fitur yang salah; stabil (seed 7 overlap 2 dari 3, R² 0,4374) tapi tetap salah. Upaya pertama kw 1,0 memberi R² 0,0003 — bug kernel width, bukan vonis atas LIME. LR: intercept −1,485; PAY_DELAY_COUNT +0,756 (OR 2,1297); PAY_2..PAY_6 dan PAY_MEAN negatif — BUKAN efek protektif: univariat, PAY_0 telat default 0,4985 vs tidak telat 0,1426 (n telat 1.324); PAY_MEAN telat 0,4717 vs tidak telat 0,1427 — ini multikolinearitas. Nasabah 858 (LR): log-odds 0,9378 = −1,485 + 2,8746 − 0,4518; probabilitas 0,7187; reason codes PAY_DELAY_COUNT, PAY_MAX, PAY_0. Empat jebakan: importance terpecah; model underfit (max_iter 5, ROC-AUC 0,7725) tetap memberi ranking masuk akal; dua model dua cerita; model tanpa fitur PAY (LR 0,6467, GBM 0,7343) tetap menjelaskan dirinya dengan percaya diri (PAY_AMT2 0,0402). Fairness: mean |SHAP| kolom demografis di bawah 0,032 (SEX 0,0314; EDUCATION 0,0169; MARRIAGE 0,0259; AGE 0,0304) — ketimpangan M7.1 (AIR SEX 0,8693; EDUCATION Pascasarjana AIR 0,603 flag) mengalir lewat fitur perilaku bayar. Lab: permutation + PDP + SHAP sepakat PAY_MAX nomor satu GBM; dekomposisi lokal menjumlah tepat; LIME gagal uji silang (lime_ok=False). Counterfactual [notebook]: seandainya riwayat 858 sempurna pun (PAY_0..6 = −1), GBM terkalibrasi tetap 0,3325 — tetap ditolak; counterfactual adalah diagnosis model, bukan rencana aksi. Adverse action: surat penolakan berisi reason codes top-3 bahasa awam + langkah yang bisa dilakukan + reviewer + jangka waktu banding — bukan waterfall SHAP.",
        "Guided task di Colab — notebook mlf-m73-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data UCI: flagship GBM + GBM terkalibrasi, permutation importance GBM dan LR, PDP 1D PAY_MAX/UTILIZATION/PAY_MEAN (grid bersih) dan PDP 2D, SHAP global dan lokal nasabah 858 dengan TreeExplainer (shap 0.54.1), surrogate LIME dengan kw 4,18, dekomposisi log-odds LR, serta model tanpa fitur PAY. Tautan Colab: https://colab.research.google.com/drive/1ZEWaXFQcJoAeGfyYhddJEC5czKLV2pjx",
        "Lanjut: MLF-M7.4 — Fairness Mitigation: setelah tahu fitur apa yang mendorong keputusan dan di mana ketimpangan hidup, bagaimana memperbaikinya — reweighting, pengumpulan data, perbaikan fitur — tanpa threshold per grup.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Permutation importance GBM: PAY_MAX 0,0569 (baseline ROC-AUC 0,7823, 10 ulangan). Apa arti angka 0,0569?",
          options: [
            { text: "Mengacak PAY_MAX di test set menurunkan ROC-AUC rata-rata sebesar 0,0569 — model sangat mengandalkan PAY_MAX", why: "Benar: itulah definisi permutation importance — selisih skor sebelum dan sesudah satu fitur diacak, rata-rata atas 10 ulangan.", correct: true },
            { text: "PAY_MAX menyebabkan 5,69% dari semua default", why: "Salah: permutation mengukur ketergantungan MODEL pada fitur, bukan sebab-akibat di dunia nyata. Tidak ada klaim kausal di sini." },
            { text: "PAY_MAX adalah 5,69% dari total importance semua fitur", why: "Salah: 0,0569 adalah penurunan ROC-AUC absolut, bukan pangsa dari total. Jumlah importance semua fitur tidak dinormalisasi ke 1." },
            { text: "ROC-AUC model menjadi 0,0569 bila PAY_MAX dihapus dari data", why: "Salah hitung: ROC-AUC setelah pengacakan adalah 0,7823 − 0,0569 = 0,7254 — bukan 0,0569. Dan pengacakan bukan penghapusan fitur." },
          ],
        },
        {
          q: "PAY_DELAY_COUNT: permutation LR 0,1422 (tertinggi di LR) tapi permutation GBM 0,0012 (hampir nol). Penjelasan yang benar?",
          options: [
            { text: "PAY_DELAY_COUNT hanya penting untuk LR — GBM mengabaikannya karena tidak informatif", why: "Salah: PAY_DELAY_COUNT sangat informatif (korelasi univariat dengan default 0,3882, tertinggi di antara fitur PAY). GBM tidak mengabaikannya — GBM menyerap sinyal yang sama lewat PAY_MAX dan PAY_0." },
            { text: "Importance itu milik model, bukan milik fitur: LR memakai sinyal keterlambatan lewat PAY_DELAY_COUNT, GBM lewat PAY_MAX dan PAY_0", why: "Benar: dua model memakai sinyal yang sama dengan cara berbeda. Itulah mengapa «fitur terpenting» selalu harus menyebut modelnya.", correct: true },
            { text: "Angka GBM-nya salah hitung — seharusnya sama dengan LR karena datanya sama", why: "Salah: datanya sama, modelnya berbeda. Permutation mengukur ketergantungan MODEL itu — dan dua model yang berbeda boleh bergantung pada fitur yang berbeda." },
            { text: "LR lebih baik dari GBM karena importance tertingginya lebih besar (0,1422 vs 0,0569)", why: "Salah: besarnya importance tertinggi bukan ukuran kualitas model. GBM justru lebih baik (ROC-AUC 0,7823 vs 0,7426) — dan baseline-nya berbeda, jadi angkanya tidak sebanding langsung." },
          ],
        },
        {
          q: "PDP 1D PAY_MAX: GBM terkalibrasi datar 0,1589 pada −2..0, naik ke 0,2897 pada 4, datar 0,2892 sampai 8; LR naik mulus 0,1456 ke 0,5063. Apa kesimpulan yang benar?",
          options: [
            { text: "GBM salah — kurva yang datar berarti model tidak belajar apa-apa dari PAY_MAX di bawah 0", why: "Salah: datar berarti prediksi rata-rata tidak berubah pada rentang itu — GBM belajar AMBANG: sampai 0 bulan telat tidak mengubah prediksi, lalu risiko melompat. Itu bentuk yang dipelajari, bukan kegagalan belajar." },
            { text: "GBM menangkap efek ambang (tangga): sampai 0 tidak mengubah apa-apa, lalu risiko melompat dan jenuh; LR memaksakan kenaikan mulus karena linear dalam log-odds", why: "Benar: kedua model sepakat arahnya (makin telat, makin berisiko) tapi beda bentuknya — dan bentuk tangga dengan kejenuhan di 0,2892 adalah informasi bisnis yang nyata.", correct: true },
            { text: "LR lebih benar karena kurvanya mulus — risiko di dunia nyata selalu naik mulus", why: "Salah: tidak ada hukum yang berkata risiko naik mulus. GBM yang jenuh di atas PAY_MAX 4 bisa jadi benar — dan kedua model ini punya ROC-AUC berbeda (GBM lebih baik), jadi «mulus» bukan bukti benar." },
            { text: "PDP membuktikan PAY_MAX menyebabkan default — makin telat, makin berisiko, jadi sebab-akibat terbukti", why: "Salah: PDP berkata «bila semua orang dipaksa telat 4 bulan, prediksi rata-ratanya 0,2897» — itu pernyataan tentang MODEL, bukan sebab-akibat di dunia nyata." },
          ],
        },
        {
          q: "SHAP lokal nasabah 858 (GBM mentah): base value −1,555 log-odds, jumlah SHAP 3,3699, log-odds model 1,8148. Apa yang dibuktikan angka-angka ini?",
          options: [
            { text: "Aksioma efisiensi terverifikasi: base + jumlah SHAP = prediksi, tepat (galat 0,0) — pembagiannya menjumlah tanpa ada kredit yang hilang", why: "Benar: −1,555 + 3,3699 ≈ 1,8148 (tanpa pembulatan, galat 0,0 — selisih 0,0001 pada angka yang ditampilkan murni pembulatan), sama dengan log-odds model. Inilah uji yang membedakan SHAP yang dihitung dengan benar dari SHAP yang dikarang.", correct: true },
            { text: "SHAP membuktikan PAY_MAX menyebabkan default nasabah 858", why: "Salah: SHAP membagi kredit PREDIKSI model — bukan sebab-akibat. PAY_MAX +1,1368 berarti model mengandalkan PAY_MAX untuk nasabah ini, bukan bahwa PAY_MAX menyebabkan defaultnya." },
            { text: "Nilai-nilai ini berlaku apa adanya untuk skor terkalibrasi (probabilitas 0,8492)", why: "Salah: SHAP dihitung pada GBM MENTAH. Kalibrasi Platt adalah transformasi monoton — ranking PREDIKSI nasabahnya sama, tapi nilai SHAP eksak dan urutan fitur teratas pada skor terkalibrasi bisa berbeda." },
            { text: "Base value −1,555 berarti nasabah rata-rata punya probabilitas default negatif", why: "Salah: −1,555 adalah LOG-odds, bukan probabilitas. Probabilitasnya 0,1744 — base value adalah prediksi rata-rata model dalam satuan log-odds." },
          ],
        },
        {
          q: "LIME (kw 4,18) untuk nasabah 858: weighted R² 0,4396, top-3 BILL_AMT1, PAY_AMT3, MARRIAGE; SHAP dan permutation menunjuk PAY_MAX dan PAY_0. Seed 7: top-3 BILL_AMT1, BILL_AMT6, MARRIAGE (overlap 2 dari 3), R² 0,4374. Apa vonis yang benar?",
          options: [
            { text: "LIME benar — BILL_AMT1 adalah pendorong utama, dan SHAP/permutation salah", why: "Salah: dua metode global yang independen (SHAP 0,4946 dan permutation 0,0569) sepakat PAY_MAX nomor satu. LIME yang menyendiri — dengan fidelity gap 0,3124 pada titiknya sendiri (0,5475 vs 0,8599) — yang harus dicurigai." },
            { text: "LIME stabil (overlap 2 dari 3, R² hampir sama) tapi menunjuk fitur yang salah — stabilitas bukan kebenaran; LIME gagal uji silang dengan metode global", why: "Benar: surrogate yang konsisten belum tentu benar. Uji yang benar adalah menyilangkan top fitur LIME dengan SHAP/permutation — dan di sini LIME gagal uji itu.", correct: true },
            { text: "LIME gagal karena kernel width-nya salah — seharusnya kw 1,0 seperti upaya pertama", why: "Terbalik: upaya pertama dengan kw 1,0 memberi R² 0,0003 (bug kernel width). kw 4,18 adalah perbaikannya (default LIME) — dan walau fit-nya membaik ke 0,4396, top fiturnya tetap salah." },
            { text: "R² 0,4396 berarti LIME menjelaskan 43,96% keputusan nasabah 858 dengan benar", why: "Salah: R² mengukur seberapa baik surrogate meniru PREDIKSI GBM di sekitar titik itu — bukan seberapa benar penjelasannya. Surrogate bisa fit lumayan dan tetap menunjuk fitur yang salah." },
          ],
        },
        {
          q: "Koefisien LR: PAY_2 −0,0969, PAY_3 −0,1184, PAY_5 −0,1015, PAY_MEAN −0,0484 — semuanya negatif. Univariat: PAY_0 telat default 0,4985 vs tidak telat 0,1426 (n telat 1.324); PAY_MEAN telat 0,4717 vs tidak telat 0,1427. Apa arti koefisien negatif itu?",
          options: [
            { text: "Telat bayar 2–6 bulan lalu MELINDUNGI dari default — nasabah yang pernah telat justru lebih aman", why: "Salah dan berbahaya: univariat, setiap fitur PAY menaikkan risiko — tidak ada satu pun yang melindungi. Koefisien negatif tidak boleh dibaca sebagai efek univariat." },
            { text: "Multikolinearitas: PAY_DELAY_COUNT (+0,756) dan PAY_MAX (+0,2741) sudah menyerap sinyal keterlambatan; koefisien PAY_2..PAY_6 mengukur sisa kondisional, bukan efek univariat", why: "Benar: koefisien LR adalah efek KONDISIONAL (dengan fitur lain tetap). Begitu jumlah bulan telat dan keterlambatan terburuk masuk model, sisa PAY_2..PAY_6 berkorelasi negatif — artefak, bukan efek protektif.", correct: true },
            { text: "Data salah — koefisien negatif untuk fitur telat bayar pasti bug pipeline", why: "Salah: bukan bug. Ini perilaku standar regresi dengan fitur berkorelasi kuat — dan justru itulah yang diajarkan lesson ini: koefisien tidak boleh dibaca tanpa memeriksa korelasi." },
            { text: "LR salah memilih fitur — PAY_2..PAY_6 seharusnya dikeluarkan dari model", why: "Salah: mengeluarkan fitur berkorelasi tidak «memperbaiki» tanda koefisien — ia hanya memindahkan sinyal ke fitur yang tersisa. Yang benar adalah memahami koefisien sebagai kondisional, bukan menghapus fitur." },
          ],
        },
        {
          q: "BILL_AMT1..6 berkorelasi r = 0,9463 dengan BILL_MEAN. Permutation GBM: keenam kolom berjumlah 0,0116 (masing-masing 0,0000–0,0053); BILL_MEAN sendiri 0,0048. Apa kesimpulan yang benar?",
          options: [
            { text: "Tagihan tidak penting — tidak satu pun kolom tagihan masuk lima besar permutation", why: "Salah baca: sinyal tagihan TERPECAH ke enam kolom. Jumlahnya 0,0116 — hampir sama dengan UTILIZATION (0,0130, peringkat tiga). Membaca per kolom meremehkan sinyal yang terpecah." },
            { text: "Importance terpecah antar kolom berkorelasi: laporkan per KELUARGA (0,0116), bukan per kolom — dan jangan bandingkan kolom yang terpecah dengan fitur yang berdiri sendiri", why: "Benar: model bisa memakai salah satu dari enam kolom secara bergantian, sehingga mengacak satu kolom hampir tidak merusak model. Yang jujur adalah angka keluarga.", correct: true },
            { text: "BILL_MEAN 0,0048 adalah importance tagihan yang sebenarnya — keenam kolom lainnya nol dan boleh dihapus", why: "Salah: 0,0048 adalah importance BILL_MEAN SAJA, bukan total keluarga. Menghapus keenam kolom tidak «membersihkan» apa-apa — sinyalnya pindah ke BILL_MEAN dan fitur lain." },
            { text: "Permutation importance rusak bila ada korelasi — jangan pernah memakainya pada data dengan fitur berkorelasi", why: "Berlebihan: permutation tetap valid — yang rusak adalah PEMBACAAN naifnya. Dengan pengelompokan keluarga, permutation tetap memberi ranking yang bisa dipercaya." },
          ],
        },
        {
          q: "Dua model menjelaskan dirinya dengan rapi: GBM underfit (max_iter 5, ROC-AUC 0,7725, top PAY_MAX 0,0582) dan model tanpa fitur PAY (GBM ROC-AUC 0,7343, top PAY_AMT2 0,0402; LR 0,6467, top LIMIT_BAL −0,3923). Apa kesimpulan yang benar?",
          options: [
            { text: "Kedua model itu bagus — rankingnya masuk akal, jadi penjelasannya membuktikan modelnya layak", why: "Salah: ranking yang masuk akal bukan bukti model layak. GBM underfit 0,7725 masih di bawah GBM penuh 0,7823, dan model tanpa PAY kehilangan banyak ranking (LR 0,7426 ke 0,6467). Penjelasan tidak membuktikan kelayakan." },
            { text: "Keduanya menjelaskan model yang lebih buruk dengan percaya diri — kualitas penjelasan dibatasi kualitas model; periksa metrik dulu sebelum mempercayai penjelasan", why: "Benar: penjelasan yang benar tentang model yang buruk dibaca sebagai pembenaran model itu bila metriknya tidak diperiksa dulu. Urutannya: metrik (M6.4) dulu, penjelasan kemudian.", correct: true },
            { text: "Model tanpa PAY lebih jujur karena tidak memakai fitur keterlambatan yang bias", why: "Salah: «jujur» bukan soal fitur apa yang dipakai — model tanpa PAY jauh lebih buruk (LR 0,6467) dan menjelaskan dirinya dengan proxy (LIMIT_BAL, BILL_AMT2). Menghapus sinyal utama bukan kejujuran, melainkan kehilangan informasi." },
            { text: "GBM underfit lebih baik dari GBM penuh karena importance PAY_MAX-nya lebih besar (0,0582 vs 0,0569)", why: "Salah: besarnya importance tertinggi bukan ukuran kualitas model. GBM penuh ROC-AUC-nya lebih tinggi (0,7823 vs 0,7725) — dan selisih 0,0013 pada importance adalah noise." },
          ],
        },
        {
          q: "Seorang analis menulis saran untuk nasabah 858: «Turunkan PAY_MAX-mu menjadi 0». Apakah saran itu actionable atau manipulasi fitur?",
          options: [
            { text: "Manipulasi fitur — PAY_MAX adalah fitur turunan (maksimum enam kolom PAY) atas riwayat yang sudah terjadi; yang actionable adalah perilaku masa depan («bayar tepat waktu di bulan-bulan ke depan»)", why: "Benar: PAY_MAX bukan tombol yang bisa diputar — ia dihitung dari PAY_0..6, dan keenam bulan itu sudah terjadi. «Turunkan PAY_MAX» meminta nasabah mengubah angka di dalam model, bukan perilakunya. Versi yang jujur: «bayar tepat waktu ke depan, sehingga PAY_MAX di penilaian mendatang turun» — dan itu pun harus jujur bahwa model ini menilai enam bulan TERAKHIR, jadi perbaikan baru terlihat di penilaian mendatang. Counterfactual CF-A/CF-B membuktikan diagnosisnya: bahkan riwayat sempurna pun tetap ditolak (0,3325 / 0,1535).", correct: true },
            { text: "Actionable — PAY_MAX adalah fitur yang bisa diubah, dan menurunkannya adalah cara paling langsung membalikkan keputusan", why: "Salah: PAY_MAX adalah fitur TURUNAN dari riwayat — tidak ada tindakan nasabah yang «menurunkan PAY_MAX» secara langsung. Yang bisa diubah adalah perilaku masa depan; riwayatnya tidak." },
            { text: "Keduanya benar — tergantung modelnya: untuk LR ia actionable, untuk GBM ia manipulasi", why: "Salah: actionable vs manipulasi bukan sifat model — ia sifat SARANnya. Saran yang meminta nasabah mengubah angka turunan atas riwayat adalah manipulasi fitur di model mana pun." },
            { text: "Bukan keduanya — counterfactual bukan saran sama sekali, jadi pertanyaannya tidak berlaku", why: "Salah arah: benar bahwa counterfactual BUKAN saran otomatis — tapi saran «turunkan PAY_MAX» tetap bisa dinilai, dan vonisnya manipulasi fitur. Aturan feasibility ada justru untuk menyaring saran yang lahir dari counterfactual." },
          ],
        },
        {
          q: "Surat penolakan untuk nasabah 858 berisi waterfall SHAP lengkap (base −1,555, jumlah SHAP 3,3699, lima kontribusi terbesar). Apakah itu adverse-action notice yang baik?",
          options: [
            { text: "Tidak — notice yang baik berisi top-3 reason codes dalam bahasa awam + langkah yang bisa dilakukan + reviewer + jangka waktu banding; waterfall SHAP adalah penjelasan untuk analis, bukan surat untuk nasabah", why: "Benar: penjelasan dan surat penolakan adalah DUA dokumen yang berbeda. Waterfall SHAP menjawab «mengapa model memutuskan begitu» untuk analis/auditor; surat penolakan harus menjawab «kenapa saya ditolak, apa yang bisa saya lakukan, kepada siapa saya banding» dalam bahasa nasabah. Surat yang berisi base value dan jumlah SHAP adalah dokumen analis yang salah alamat — dan ia tidak berisi satu pun dari tiga hal yang dibutuhkan nasabah.", correct: true },
            { text: "Ya — semakin lengkap penjelasannya, semakin baik suratnya; nasabah berhak tahu semua angka", why: "Salah: lengkap tidak sama dengan bisa dipakai. Nasabah tidak bisa bertindak berdasarkan «base −1,555» — ia bisa bertindak berdasarkan «keterlambatan pembayaran terburuk dalam 6 bulan terakhir» + «bayar tepat waktu ke depan» + cara banding." },
            { text: "Ya — SHAP adalah penjelasan yang paling akurat, jadi surat berbasis SHAP adalah surat yang paling benar", why: "Salah: akurasi penjelasan tidak membuatnya menjadi surat yang baik. SHAP lokal 858 memang benar (aksioma efisiensi terverifikasi) — tapi kebenaran untuk analis bukan kebenaran untuk nasabah." },
            { text: "Tidak — karena SHAP salah untuk nasabah ini (LIME yang benar)", why: "Salah alasan: SHAP TIDAK salah untuk nasabah 858 — dekomposisinya menjumlah tepat (galat 0,0). Yang salah adalah LIME (top-1 BILL_AMT1). Masalah surat itu bukan kebenaran angkanya, melainkan BENTUKnya: waterfall bukan notice." },
          ],
        },
      ],
      summary: [
        "Model keputusan: GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 [notebook]. ROC-AUC GBM mentah 0,7823 / PR-AUC 0,5597; LR 0,7426 / 0,5049.",
        "Global vs lokal [notebook]: pertanyaan global dijawab permutation, PDP, dan mean |SHAP|; pertanyaan lokal dijawab dekomposisi LR, SHAP waterfall, dan LIME.",
        "Permutation GBM (10 ulangan, baseline 0,7823) [notebook]: PAY_MAX 0,0569; PAY_0 0,0241; UTILIZATION 0,0130; PAY_AMT_MEAN 0,0069; LIMIT_BAL 0,0062. Permutation LR: PAY_DELAY_COUNT 0,1422 — fitur nomor satu yang berbeda antar model.",
        "Jebakan permutation [notebook]: BILL_AMT1..6 berkorelasi r = 0,9463 dengan BILL_MEAN — jumlah keenam kolom 0,0116, masing-masing tampak kecil; PAY_MEAN vs PAY_MAX r = 0,8194.",
        "PDP 1D PAY_MAX [notebook]: GBM terkalibrasi datar 0,1589 pada −2..0, naik ke 0,2897 pada 4, datar 0,2892 sampai 8 (tangga); LR naik mulus 0,1456 ke 0,5063. PDP UTILIZATION: GBM 0,1990 ke 0,2627 (jenuh). PDP PAY_MEAN (grid bersih): 0,2084 ke puncak 0,2460 pada 2, lalu 0,2399 pada 4. PDP 2D: (0; 0,2) 0,1389 sampai (4; 2,0) 0,3275 — hampir aditif.",
        "SHAP (shap 0.54.1, TreeExplainer, GBM mentah) [notebook]: global mean |SHAP| PAY_MAX 0,4946; PAY_0 0,2385; UTILIZATION 0,1574; LIMIT_BAL 0,1113; PAY_AMT_MEAN 0,0892 — lima besar yang sama dengan permutation. Lokal nasabah 858: base −1,555 + jumlah SHAP 3,3699 ≈ 1,8148 (tanpa pembulatan, galat 0,0); PAY_MAX +1,1368, PAY_0 +0,9280. Caveat: nilai eksak pada skor terkalibrasi berbeda.",
        "LIME (kw 4,18) [notebook]: R² 0,4396, prediksi surrogate 0,5475 vs GBM 0,8599 (gap 0,3124), top-3 BILL_AMT1, PAY_AMT3, MARRIAGE — menunjuk fitur yang salah; stabil (seed 7 overlap 2 dari 3, R² 0,4374) tapi tetap salah. Upaya pertama kw 1,0 memberi R² 0,0003 — bug kernel width.",
        "LR [notebook]: intercept −1,485; PAY_DELAY_COUNT +0,756 (OR 2,1297); PAY_2..PAY_6 dan PAY_MEAN negatif — BUKAN efek protektif: univariat, PAY_0 telat default 0,4985 vs tidak telat 0,1426; PAY_MEAN telat 0,4717 vs tidak telat 0,1427 — ini multikolinearitas. Nasabah 858: log-odds 0,9378, probabilitas 0,7187; reason codes PAY_DELAY_COUNT, PAY_MAX, PAY_0.",
        "Empat jebakan [notebook]: importance terpecah; model underfit (max_iter 5, ROC-AUC 0,7725) tetap memberi ranking masuk akal; dua model dua cerita; model tanpa fitur PAY (LR 0,6467, GBM 0,7343) tetap menjelaskan dirinya dengan percaya diri.",
        "Fairness [notebook]: mean |SHAP| kolom demografis di bawah 0,032 (SEX 0,0314; EDUCATION 0,0169; MARRIAGE 0,0259; AGE 0,0304) — ketimpangan M7.1 (AIR SEX 0,8693; EDUCATION Pascasarjana AIR 0,603 flag) mengalir lewat fitur perilaku bayar, bukan kolom demografis.",
        "Counterfactual [notebook]: seandainya riwayat 858 sempurna (PAY_0..6 = −1), GBM terkalibrasi 0,3325 — tetap ditolak; ditambah bayar penuh 0,1535 — tetap ditolak. Counterfactual adalah diagnosis model, bukan rencana aksi dan bukan klaim kausal; aturan feasibility: sensitif tidak diubah, historis tidak diubah mundur, hanya perilaku masa depan yang disarankan.",
        "Adverse action: surat penolakan berisi top-3 reason codes bahasa awam (PAY_DELAY_COUNT, PAY_MAX, PAY_0 — dari LR, ROC-AUC 0,7426) + langkah yang bisa dilakukan + reviewer + jangka waktu banding; waterfall SHAP adalah penjelasan untuk analis, bukan surat untuk nasabah; overlap top-3 LR vs SHAP GBM = 2 dari 3.",
        "Lab: permutation + PDP + SHAP sepakat PAY_MAX nomor satu GBM (0,0569 / delta 0,1308 / 0,4946); dekomposisi lokal menjumlah tepat (LR 0,9378; SHAP 1,8148); LIME gagal uji silang (lime_ok=False).",
      ],
      next: { label: "Lanjut: MLF-M7.4 — Fairness Mitigation", href: "/v2/learn/mlf-m74-fairness-mitigation" },
    },
  ],
};

# MLF-M7.3: Explainability (SHAP/LIME) — Membaca Model yang Tidak Bisa Bicara

## Masalah: Nasabah 858 Ditolak — dan Tidak Ada yang Bisa Menjelaskan Kenapa

Nasabah nomor 858 di test set. Usia 32 tahun, limit NT$20.000, status bayar enam bulan terakhir 3, 2, 2, 7, 7, 7 (terbaru→terlama) — tiga bulan terbaru 3, 2, 2, tiga bulan tertua 7, 7, 7 — dengan PAY_AMT 0 di semua enam bulan, tagihan NT$2.400 setiap bulan. Model keputusan — GBM terkalibrasi Platt/sigmoid — memberinya probabilitas default 0,8492 [notebook]. Threshold operasional 0,10 (M6.4): di atas threshold berarti ditolak. Ia ditolak — dan memang benar-benar default (label aktual 1). Modelnya benar. Tapi bila nasabah itu bertanya «kenapa saya ditolak?», apa jawabanmu? «Karena model berkata begitu» bukan jawaban — itu pengakuan bahwa kamu tidak mengerti modelmu sendiri.

Angka acuan [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model keputusan = GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10. ROC-AUC test: GBM mentah 0,7823, GBM terkalibrasi 0,7816; LR 0,7426. PR-AUC: GBM mentah 0,5597, GBM terkalibrasi 0,5558; LR 0,5049. Brier: GBM mentah 0,1342, GBM terkalibrasi 0,1345. Semua angka explainability di lesson ini dihitung pada test 6.000 yang sama — angka-angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON, bukan template evaluasi final yang bebas seleksi; dalam praktik, penjelasan model dihitung di data evaluasi yang tidak dipakai untuk memilih model atau threshold (lihat M6.4 langkah 4). Nilai SHAP di lesson ini NYATA: dihitung dengan shap 0.54.1 (TreeExplainer) atas GBM mentah — model keputusan adalah versi terkalibrasi Platt-nya, transformasi monoton, jadi ranking PREDIKSI nasabahnya sama, walau nilai SHAP eksak — dan urutan fitur teratas — pada skor terkalibrasi bisa berbeda.

---

## 1. Nasabah 858 Ditolak

**Nilai:** explainability adalah SATU-SATUNYA cara menjawab «mengapa model memutuskan begitu?» dengan sesuatu yang bisa diperiksa — bukan dengan firasat, bukan dengan «modelnya kompleks». Nasabah yang ditolak berhak atas alasan yang bisa ia baca (reason codes); auditor berhak tahu fitur mana yang mendorong keputusan; dan kamu berhak tahu kapan penjelasanmu sendiri sedang berbohong.

**Baik/buruk:** GBM dengan ROC-AUC 0,7823 itu bagus sebagai mesin ranking — tapi ia tidak bisa bicara. Ia tidak punya koefisien, tidak punya «alasan» bawaan. Setiap penjelasan untuk GBM adalah alat TAMBAHAN (permutation, PDP, SHAP, LIME) — dan tiap alat punya asumsi yang bisa gagal diam-diam. LIME di lesson ini menunjuk fitur yang salah — dan penjelasan yang menunjuk fitur yang salah adalah penjelasan yang menyesatkan, walau surrogate-nya cukup fit dan stabil.

**Mitigasi:** jangan pernah menyajikan SATU penjelasan sendirian. Setiap klaim «fitur X yang menyebabkan keputusan ini» harus lolos minimal dua alat yang berbeda (misal permutation + PDP, atau LR lokal + SHAP) — dan bila keduanya tidak sepakat, laporkan ketidaksepakatan itu, bukan salah satunya.

---

## 2. Global vs Lokal: Dua Pertanyaan yang Berbeda

Explainability menjawab dua pertanyaan yang berbeda, dan mencampuradukkan keduanya adalah kesalahan pertama yang paling umum. Pertanyaan GLOBAL: «secara umum, fitur mana yang paling penting bagi model ini?» — jawabannya berlaku untuk semua nasabah sekaligus: permutation importance, PDP, rata-rata nilai absolut SHAP. Pertanyaan LOKAL: «mengapa model menolak NASABAH INI, nasabah 858?» — jawabannya spesifik untuk satu baris data: dekomposisi log-odds LR, SHAP waterfall untuk satu nasabah, surrogate LIME di sekitar satu titik.

**Nilai:** memisahkan global dari lokal membuatmu memilih alat yang benar. Bila regulator bertanya «fitur apa yang paling menentukan keputusan kredit kalian?», itu pertanyaan global — jawab dengan permutation importance, bukan dengan satu contoh nasabah. Bila nasabah 858 bertanya «kenapa SAYA ditolak?», itu pertanyaan lokal — jawab dengan reason codes dari dekomposisi lokal, bukan dengan «PAY_MAX adalah fitur terpenting secara global».

**Baik/buruk:** jawaban global itu bagus karena stabil — dihitung dari 6.000 baris test, bukan dari satu nasabah. Buruk bila dibaca sebagai jawaban lokal: PAY_MAX memang fitur terpenting secara global (penurunan ROC-AUC 0,0569 bila diacak), tapi untuk nasabah tertentu, fitur yang mendorong keputusannya bisa jadi LIMIT_BAL atau PAY_AMT1. Sebaliknya jawaban lokal itu bagus karena spesifik dan bisa ditindaklanjuti nasabah — buruk bila digeneralisasi.

**Mitigasi:** setiap kali kamu menulis penjelasan, tulis dulu di baris pertama: «ini penjelasan GLOBAL» atau «ini penjelasan LOKAL untuk nasabah X». Bila kamu tidak bisa menulis baris itu, kamu belum tahu pertanyaan apa yang sedang kamu jawab.

---

## 3. Permutation Importance: Acak Satu Fitur, Lihat Berapa Banyak Model Rusak

Permutation importance adalah alat global yang paling jujur secara intuisi: ambil satu fitur, acak nilainya di seluruh test set (sehingga hubungannya dengan label hancur, tapi distribusinya tetap), lalu ukur berapa banyak skor model turun. Bila mengacak PAY_MAX membuat ROC-AUC jatuh jauh, model SANGAT mengandalkan PAY_MAX.

$$\text{Permutation importance}(j) = \text{skor}_{\text{baseline}} - \text{skor}_{\text{setelah fitur } j \text{ diacak}} \quad \text{(rata-rata atas 10 ulangan)}$$

**Nilai [notebook]** — GBM terkalibrasi, test 6.000, skor ROC-AUC, 10 ulangan, baseline ROC-AUC 0,7823. Lima besar: PAY_MAX 0,0569 (simpangan baku 0,0043); PAY_0 0,0241 (0,0021); UTILIZATION 0,0130 (0,0019); PAY_AMT_MEAN 0,0069 (0,0011); LIMIT_BAL 0,0062 (0,0013). Tiga berikutnya: BILL_AMT1 0,0053; BILL_MEAN 0,0048; BILL_TREND 0,0044. PAY_MAX mendominasi: penurunannya lebih dari dua kali PAY_0, dan lebih dari empat kali UTILIZATION. Di ujung bawah: PAY_2 0,0001, PAY_3 0,0002, PAY_4 −0,0001, PAY_6 0,0004 — praktis nol. Sebagai pembanding, permutation importance LR (baseline ROC-AUC 0,7426): PAY_DELAY_COUNT 0,1422 (0,0061) — jauh di atas semua yang lain; PAY_MAX 0,0127; LIMIT_BAL 0,0098; PAY_0 0,0063; PAY_AMT1 0,0046.

**Gambar:** permutation importance GBM 8 besar — PAY_MAX 0,0569 ± 0,0043; PAY_0 0,0241 ± 0,0021; UTILIZATION 0,0130 ± 0,0019; PAY_AMT_MEAN 0,0069 ± 0,0011; LIMIT_BAL 0,0062 ± 0,0013; BILL_AMT1 0,0053 ± 0,0009; BILL_MEAN 0,0048 ± 0,0009; BILL_TREND 0,0044 ± 0,0008. PAY_MAX mendominasi: 0,0569 — lebih dari dua kali PAY_0 (0,0241). Sisanya di bawah 0,0130.

**Baik/buruk:** permutation importance itu bagus karena ia model-agnostic (cara yang sama untuk GBM dan LR, sehingga keduanya bisa dibandingkan apel-dengan-apel) dan karena ia diukur pada data yang TIDAK dipakai melatih (test 6.000). Buruk bila dibaca sebagai «pentingnya fitur di dunia nyata»: ia mengukur seberapa besar MODEL mengandalkan fitur itu — bukan seberapa besar fitur itu MENYEBABKAN default.

**Mitigasi:** laporkan permutation importance SELALU dengan tiga pendamping: (1) baseline skornya (di sini ROC-AUC 0,7823), (2) jumlah ulangan (di sini 10), (3) simpangan baku tiap fitur. Dan jangan pernah bandingkan angka permutation antar model tanpa menyebut baseline-nya.

---

## 4. Jebakan Permutation: Fitur Berkorelasi Membelah Pentingnya

Permutation importance punya satu kelemahan yang sistematis. Bila dua fitur berkorelasi kuat, model bisa memakai salah satunya secara bergantian; mengacak SATU di antaranya hampir tidak merusak model, karena fitur pasangannya masih membawa sinyal yang sama. Hasilnya: masing-masing terlihat «tidak penting», padahal sinyal yang mereka bawa bersama-sama penting.

**Nilai [notebook]:** korelasi BILL_AMT1..6 dengan BILL_MEAN adalah r = 0,9463 — hampir sempurna. Permutation importance GBM untuk keenam kolom itu masing-masing kecil — BILL_AMT1 0,0053 yang tertinggi, BILL_AMT6 0,0000 — tapi JUMLAH keenamnya 0,0116, hampir sama besar dengan UTILIZATION (0,0130, peringkat tiga). BILL_MEAN sendiri 0,0048. Pola yang sama pada fitur bayar: korelasi PAY_MEAN dengan PAY_MAX r = 0,8194; permutation PAY_MAX 0,0569, PAY_MEAN hanya 0,0003 — sinyal «keterlambatan bayar» hampir seluruhnya diserap PAY_MAX.

**Baik/buruk:** perilaku ini bagus bila kamu memahaminya — ia memberitahu bahwa model punya BANYAK jalan menuju sinyal yang sama, dan itu justru ketahanan (robustness). Buruk bila kamu membacanya secara naif: «PAY_MEAN tidak penting, hapus saja» adalah kesimpulan yang salah.

**Mitigasi:** sebelum membaca ranking permutation, hitung korelasi antar fitur teratas — dan KELOMPOKKAN fitur yang berkorelasi kuat (di sini r di atas 0,8) menjadi satu «keluarga sinyal», lalu jumlahkan importance-nya. Laporkan keduanya: angka per kolom DAN angka per keluarga.

---

## 5. PDP: Bagaimana Satu Fitur Menggeser Prediksi

Permutation importance berkata «fitur ini penting» tapi tidak berkata «ke arah mana». Partial dependence plot (PDP) menjawab arah itu: paksa satu fitur ke satu nilai untuk SEMUA 6.000 baris test, hitung rata-rata probabilitas default prediksi, ulangi untuk tiap nilai pada grid.

$$\mathrm{PDP}_j(v) = \frac{1}{n} \sum_{i=1}^{n} \hat{f}(v, \, x_{i,-j}) \quad \text{— rata-rata prediksi bila fitur } j \text{ dipaksa ke } v$$

**Nilai [notebook]** — PDP 1D PAY_MAX, grid −2 sampai 8, rata-rata P(default) test 6.000. GBM terkalibrasi: datar 0,1589 pada PAY_MAX −2, −1, dan 0 — lalu naik ke 0,1986 pada 1, 0,2782 pada 2, dan 0,2897 pada 3 sampai 4 — lalu datar lagi 0,2892 dari 5 sampai 8. Bentuknya tangga: datar–naik–datar. LR: naik mulus 0,1456 pada −2, 0,1966 pada 0, 0,2593 pada 2, 0,3334 pada 4, 0,5063 pada 8. PDP 1D UTILIZATION, grid 0 sampai 5: GBM terkalibrasi 0,1990 pada 0, naik ke 0,2572 pada 1,0, lalu datar 0,2627 dari 1,5 sampai 5 — jenuh lagi. LR 0,2089 pada 0 sampai 0,3518 pada 5 — terus naik, tanpa jenuh. PDP PAY_MEAN (grid BERSIH hasil perbaikan — grid pertama mengandung 0,0 yang terduplikasi dan tidak dipakai): grid −2, −1, −0,5, 0, 0,5, 1, 2, 4 — GBM terkalibrasi 0,2084; 0,2132; 0,2133; 0,2162; 0,2200; 0,2370; 0,2460; 0,2399. Kurvanya naik pelan ke puncak 0,2460 pada 2, lalu sedikit turun ke 0,2399 pada 4 — efek PAY_MEAN jauh lebih kecil dan lebih datar daripada PAY_MAX.

**Gambar:** PDP 1D PAY_MAX — GBM terkalibrasi datar 0,1589 pada −2 sampai 0, naik ke 0,2897 pada 4, datar 0,2892 sampai 8; LR naik mulus 0,1456 sampai 0,5063. Kedua model sepakat arahnya, beda bentuknya — dan bentuk itulah yang perlu dijelaskan.

PDP 2D — dua fitur sekaligus [notebook]. PAY_MAX (baris 0–4) kali UTILIZATION (kolom 0,2 / 0,5 / 1,0 / 2,0), GBM terkalibrasi: pada PAY_MAX 0, utilisasi 0,2 memberi 0,1389 dan utilisasi 2,0 memberi 0,2103 (selisih 0,0714); pada PAY_MAX 4, utilisasi 0,2 memberi 0,2788 dan utilisasi 2,0 memberi 0,3275 (selisih 0,0487). Efek PAY_MAX pada utilisasi 0,2 adalah 0,1389 naik ke 0,2788 (selisih 0,1399), dan pada utilisasi 2,0 adalah 0,2103 naik ke 0,3275 (selisih 0,1172). Kedua efek mengecil sekitar sepertiga (0,0714→0,0487) saat fitur pasangannya sudah tinggi — pada skala absolut kecil; kurvanya hampir sejajar, TIDAK ada interaksi kuat: efek keduanya menumpuk secara hampir aditif, interaksi lemah, bukan nol.

**Baik/buruk:** PDP bagus karena ia menunjukkan BENTUK hubungan (tangga vs mulus, jenuh vs terus naik) — sesuatu yang tidak bisa ditangkap angka importance saja. GBM yang jenuh pada 0,2892 di atas PAY_MAX 4 adalah informasi bisnis yang nyata. Buruk bila dibaca sebagai hubungan sebab-akibat: PDP berkata «bila semua orang dipaksa telat 4 bulan, prediksi rata-ratanya 0,2897» — bukan «telat 4 bulan MENYEBABKAN risiko 0,2897». Dan buruk bila dibaca tanpa memeriksa korelasi: PDP PAY_MAX menggerakkan PAY_MAX sambil membiarkan fitur lain apa adanya — padahal di dunia nyata, PAY_MAX yang tinggi datang bersama PAY_MEAN yang tinggi (r = 0,8194).

**Mitigasi:** baca PDP selalu berpasangan dengan tiga hal: (1) distribusi fitur itu sendiri; (2) korelasi dengan fitur lain; (3) PDP model pembanding (di sini LR). Dan periksa grid-nya sebelum mempercayai kurvanya.

---

## 6. SHAP: Membagi Kredit Secara Adil Antar Fitur — dengan Angka yang Nyata

SHAP (SHapley Additive exPlanations) menjawab: «dari prediksi model untuk nasabah INI, berapa kontribusi MASING-MASING fitur — dan apakah pembagian itu adil?» Jawabannya dipinjam dari teori permainan kooperatif: nilai Shapley. Bayangkan 31 fitur sebagai 31 pemain yang bekerja sama menghasilkan satu prediksi; nilai Shapley adalah SATU-SATUNYA pembagian kredit yang memenuhi empat aksioma sekaligus: efisiensi, simetri, dummy, dan aditivitas.

$$\phi_j = \sum_{S \subseteq N \setminus \{j\}} \frac{|S|! \, (n - |S| - 1)!}{n!} \left[ v(S \cup \{j\}) - v(S) \right]$$

**Nilai [notebook]** — GLOBAL, mean |SHAP| atas test 6.000, dihitung dengan shap 0.54.1 (TreeExplainer), dalam satuan log-odds. Lima besar: PAY_MAX 0,4946; PAY_0 0,2385; UTILIZATION 0,1574; LIMIT_BAL 0,1113; PAY_AMT_MEAN 0,0892. Berikutnya: PAY_AMT2 0,0779; BILL_TREND 0,0745; PAY_AMT1 0,0670; BILL_MEAN 0,0658; PAY_DELAY_COUNT 0,0585. Bandingkan dengan permutation importance GBM: lima besar yang SAMA — hanya urutan keempat dan kelima yang bertukar. Dua alat yang berbeda, dari prinsip yang berbeda, menunjuk lima fitur yang sama.

**Nilai [notebook]** — LOKAL, nasabah 858, waterfall yang bisa diperiksa. Probabilitas GBM mentah 0,8599, log-odds 1,8148. Base value −1,555 log-odds (probabilitas 0,1744 — prediksi rata-rata model). Jumlah semua nilai SHAP nasabah ini 3,3699 — dan base + jumlah ≈ −1,555 + 3,3699 ≈ 1,8148, sama dengan log-odds model (tanpa pembulatan, galat absolut maksimum 0,0 atas semua baris; selisih 0,0001 pada angka yang ditampilkan murni pembulatan). Lima kontribusi lokal terbesar: PAY_MAX +1,1368; PAY_0 +0,9280; PAY_AMT3 +0,1553; PAY_MEAN +0,1418; PAY_AMT_MEAN +0,1309. Dua fitur pertama saja menyumbang 2,0648 — lebih dari 60% dari total 3,3699. Dan perhatikan PAY_AMT3: ketiga terbesar secara lokal (+0,1553) padahal secara global hanya 0,0503 (peringkat 11) — lokal tidak sama dengan global.

Caveat yang wajib dicatat: SHAP dihitung pada GBM MENTAH (tidak terkalibrasi), sementara model keputusan adalah versi terkalibrasinya (Platt/sigmoid). Kalibrasi Platt adalah transformasi MONOTON atas skor mentah — ranking nasabah dan fitur teratasnya sama — tapi nilai SHAP eksak pada skor terkalibrasi akan BERBEDA dari angka-angka di atas. Detail teknis [notebook]: TreeExplainer, feature_perturbation tree_path_dependent (default), nilai dalam satuan log-odds, base value = rata-rata log-odds atas background training yang tersirat dari pohon.

**Baik/buruk:** SHAP bagus karena ia punya fondasi aksiomatik, menyatukan global dan lokal dalam satu kerangka, dan efisiensinya bisa diverifikasi (galat 0,0). Buruk bila dibaca sebagai kebenaran kausal: nilai Shapley membagi kredit PREDIKSI model — bukan sebab-akibat di dunia nyata. Dan buruk bila caveat kalibrasinya dihilangkan: mengutip +1,1368 tanpa menyebut «pada GBM mentah» adalah kutipan yang tidak lengkap.

**Mitigasi:** sebelum memakai angka SHAP apa pun, tanyakan tiga hal: (1) dihitung dengan explainer apa (di sini TreeExplainer) dan pada model yang mana (di sini GBM mentah)? (2) atas data apa (di sini test 6.000 untuk global, nasabah 858 untuk lokal)? (3) apakah jumlah kontribusi lokalnya benar-benar sama dengan prediksi dikurangi base value (di sini ya — galat 0,0)?

---

## 7. LIME: Surrogate Lokal yang Menunjuk Fitur yang Salah

LIME (Local Interpretable Model-agnostic Explanations) membangun MODEL PENGGANTI yang sederhana di sekitar satu nasabah: buat 2.000 versi tetangga [notebook] nasabah 858, minta GBM memprediksi semuanya, lalu latih model linear (Ridge) yang meniru GBM HANYA di sekitar titik itu — dengan tetangga yang lebih dekat diberi bobot lebih besar lewat kernel.

$$\text{LIME: } \hat{g} = \arg\min_{g} \sum_{i} w_i \, \big( \hat{f}(z_i) - g(z_i) \big)^2 + \Omega(g), \qquad w_i = \exp\big(-(d_i / kw)^2\big)$$

**Nilai [notebook]** — surrogate manual gaya LIME untuk nasabah 858, dengan kernel yang BENAR: 2.000 sampel perturbasi di ruang 31 fitur yang distandardisasi, kernel exp(−(d/kw)²) dengan kw = 0,75 × akar(31) = 4,18 (default LIME), Ridge berbobot. Weighted R² = 0,4396 — surrogate menjelaskan 44% variasi prediksi GBM di sekitar titik itu: cukup baik untuk dibaca, jauh dari sempurna. Intercept surrogate 0,6197; prediksi surrogate pada titik itu sendiri 0,5475, sementara probabilitas GBM 0,8599 — selisih (fidelity gap) 0,3124. Delapan koefisien terbesar: BILL_AMT1 +0,0637; PAY_AMT3 −0,0298; MARRIAGE +0,0237; PAY_AMT_MEAN −0,0191; PAY_0 +0,0168; UTILIZATION +0,0157; BILL_AMT6 +0,0156; PAY_AMT1 −0,0154. Tiga terbesar: BILL_AMT1, PAY_AMT3, MARRIAGE.

Dan inilah vonis langkah ini: tiga teratas LIME TIDAK SATU PUN merupakan pendorong model yang sebenarnya. Menurut SHAP dan permutation, pendorong GBM adalah PAY_MAX (SHAP global 0,4946; lokal +1,1368) dan PAY_0 (0,2385; +0,9280). Di daftar LIME, PAY_0 hanya peringkat lima (+0,0168) dan PAY_MAX bahkan tidak masuk delapan besar. MARRIAGE — fitur yang koefisien LR-nya hanya −0,0565 dan SHAP global-nya 0,0259 — justru peringkat tiga LIME (+0,0237). Surrogate yang fit-nya lumayan (R² 0,4396) menunjuk fitur yang salah. Mengapa? GBM belajar bentuk TANGGA (PDP: datar–naik–datar), sementara LIME memaksakan BIDANG linear di sekitar titik itu. Stabilitas tidak menyelamatkan vonis ini: seed 7 memberi top-3 BILL_AMT1, BILL_AMT6, MARRIAGE — overlap 2 dari 3 dengan seed 42 — dan R² seed 7 0,4374, hampir sama dengan 0,4396. Surrogate-nya STABIL dan tetap SALAH: stabilitas bukan kebenaran.

Catatan kehati-hatian: upaya pertama memakai kernel naive exp(−d²) dengan kw = 1,0: di ruang 31 dimensi, hampir semua tetangga berada «jauh», sehingga bobotnya praktis NOL untuk semua sampel — weighted R² = 0,0003, semua koefisien 0,0000. Itu BUG kernel width, bukan vonis atas LIME — dan ia diperbaiki dengan kw = 4,18 (default LIME). Kernel width adalah hiperparameter yang bisa MENGHAPUS penjelasanmu secara diam-diam.

**Baik/buruk:** LIME bagus sebagai IDE — model pengganti lokal yang sederhana dan bisa dibaca siapa pun, dan model-agnostic. Buruk bila fidelity-nya tidak diperiksa: surrogate dengan R² 0,4396 dan fidelity gap 0,3124 pada titiknya sendiri adalah surrogate yang «cukup baik secara rata-rata, buruk tepat di titik yang dijelaskan» — dan koefisiennya menunjuk fitur yang salah (BILL_AMT1, bukan PAY_MAX).

**Mitigasi:** JANGAN PERNAH melaporkan koefisien LIME tanpa empat angka pendamping: (1) kernel width kw (di sini 4,18), (2) weighted R² (di sini 0,4396), (3) fidelity gap pada titik itu sendiri (di sini 0,5475 vs 0,8599 — selisih 0,3124), (4) stabilitas top-k antar seed (di sini overlap 2 dari 3). Dan yang terpenting: SILANGKAN top fitur LIME dengan metode global (SHAP/permutation) — bila top-3 LIME tidak beririsan dengan lima besar global, percayai metode globalnya, bukan LIME-nya.

---

## 8. Koefisien LR: Model yang Memang Bisa Dibaca — Termasuk Tanda yang Berbalik

GBM butuh alat tambahan untuk dijelaskan; regresi logistik (LR) tidak. Koefisien LR ADALAH penjelasannya: log-odds prediksi = intercept + jumlah (koefisien × nilai fitur yang distandardisasi). Tidak ada pengacakan, tidak ada surrogate, tidak ada sampling — dekomposisi ini eksak untuk model itu.

$$\log \frac{\hat{p}}{1 - \hat{p}} = -1{,}485 + \sum_j \beta_j \, x_j, \qquad \text{kontribusi fitur } j = \beta_j \, x_j$$

**Nilai [notebook]** — koefisien LR (fitur distandardisasi), intercept −1,485. Empat besar: PAY_DELAY_COUNT +0,756 (odds ratio 2,1297); PAY_MAX +0,2741 (OR 1,3154); PAY_0 +0,2434 (OR 1,2756); LIMIT_BAL −0,2402 (OR 0,7865). Berikutnya: PAY_AMT1 −0,1614; BILL_AMT2 +0,1334; PAY_AMT2 −0,1294; PAY_3 −0,1184. Dan inilah yang paling penting: PAY_2 (−0,0969), PAY_3 (−0,1184), PAY_4 (−0,0711), PAY_5 (−0,1015), PAY_6 (−0,0901), dan PAY_MEAN (−0,0484) semuanya NEGATIF — padahal secara univariat, SETIAP fitur PAY menaikkan risiko [notebook]: nasabah yang telat di PAY_0 default 0,4985 vs yang tidak telat 0,1426 (n telat 1.324); PAY_2 telat 0,5542 vs tidak telat 0,1635; PAY_MEAN telat 0,4717 vs tidak telat 0,1427. Tidak ada satu pun fitur PAY yang «melindungi» secara univariat. Ini bukan kesalahan data: ini multikolinearitas. PAY_DELAY_COUNT (+0,756) dan PAY_MAX (+0,2741) sudah menyerap hampir seluruh sinyal «keterlambatan»; begitu keduanya masuk model, koefisien PAY_2 sampai PAY_6 mengukur sisa yang tidak dijelaskan keduanya — dan sisanya itu negatif.

Dekomposisi lokal untuk nasabah 858 [notebook] — LR memberi probabilitas 0,7187 (log-odds 0,9378; periksa: sigmoid(0,9378) = 0,7187). Log-odds itu = intercept −1,485 + kontribusi tiap fitur. Delapan kontribusi terbesar: PAY_DELAY_COUNT +2,5175 (nilai terstandardisasi 3,3301 × koefisien 0,756); PAY_MAX +1,3426 (4,8980 × 0,2741); PAY_0 +0,6532 (2,6837 × 0,2434); LIMIT_BAL +0,2733 (−1,1379 × −0,2402); PAY_5 −0,6558; PAY_6 −0,5738; PAY_4 −0,4421; PAY_MEAN −0,2403. Jumlah kedelapan itu 2,8746; ditambah intercept −1,485 menjadi 1,3896; 23 fitur lainnya menyumbang −0,4518; totalnya 0,9378 — tepat sama dengan log-odds model. Tiga reason code teratas untuk nasabah ini (bahasa awam): PAY_DELAY_COUNT — «Jumlah bulan dengan keterlambatan pembayaran»; PAY_MAX — «Keterlambatan pembayaran terburuk dalam 6 bulan terakhir»; PAY_0 — «Status pembayaran bulan terakhir». Perhatikan: reason codes ini berasal dari LR — GBM yang memutuskan 0,8492 tidak punya dekomposisi log-odds seperti ini; untuk GBM, reason codes yang setara datang dari SHAP lokal (langkah 6: PAY_MAX +1,1368, PAY_0 +0,9280).

**Baik/buruk:** dekomposisi LR bagus karena eksak, stabil (tidak ada seed, tidak ada sampling), dan langsung menjadi reason codes berbahasa awam. Buruk bila koefisiennya dibaca sebagai efek univariat: PAY_5 −0,1015 TIDAK berarti «telat 5 bulan lalu menurunkan risiko». Dan buruk bila dilupakan bahwa LR ini model yang lebih lemah: penjelasannya eksak untuk MODEL yang menjelaskan 0,7426 ROC-AUC — bukan untuk GBM yang memutuskan.

**Mitigasi:** bila kamu memakai reason codes dari LR untuk menjelaskan keputusan GBM, tulis itu secara eksplisit: «reason codes ini dari model LR pendamping (ROC-AUC 0,7426), bukan dari GBM keputusan (0,7823)». Dan bila koefisien bertanda «salah» secara univariat, jangan «memperbaiki» tandanya — laporkan multikolinearitasnya dan biarkan koefisien apa adanya.

---

## 9. Penjelasan yang Menyesatkan: Empat Cara Penjelasanmu Berbohong

Jebakan pertama — importance yang terpecah: enam kolom tagihan berkorelasi r = 0,9463 dengan BILL_MEAN, sehingga permutation importance GBM terpecah menjadi serpihan (jumlah keenam kolom 0,0116, masing-masing 0,0000–0,0053) sementara BILL_MEAN sendiri 0,0048. Pembaca yang hanya melihat ranking akan menyimpulkan «tagihan tidak penting» — padahal keluarga tagihan sebesar 0,0116, hampir menyamai UTILIZATION (0,0130).

Jebakan kedua — model buruk tetap memberi ranking yang masuk akal. GBM yang sengaja dibuat underfit (max_iter 5) [notebook]: ROC-AUC test 0,7725 — hanya 0,0098 di bawah GBM penuh 0,7823 — dan ranking permutation-nya tampak sangat masuk akal: PAY_MAX 0,0582, PAY_0 0,0379, PAY_AMT_MEAN 0,0165. Tiga besar yang sama, urutan yang sama. Kualitas penjelasan DIBATASI oleh kualitas model: penjelasan dari model yang buruk adalah penjelasan yang rapi tentang model yang salah.

Jebakan ketiga — dua model, dua cerita. Lima besar LR (dari koefisien |β|): PAY_DELAY_COUNT, PAY_MAX, PAY_0, LIMIT_BAL, PAY_AMT1. Lima besar GBM (permutation): PAY_MAX, PAY_0, UTILIZATION, PAY_AMT_MEAN, LIMIT_BAL. Lima besar LR (permutation): PAY_DELAY_COUNT, PAY_MAX, LIMIT_BAL, PAY_0, PAY_AMT1. Ketiganya tidak sama: UTILIZATION peringkat tiga di GBM tapi hampir nol di LR (koefisien +0,0726; permutation LR 0,0002); PAY_DELAY_COUNT peringkat satu di LR (permutation 0,1422) tapi hampir nol di GBM (permutation 0,0012). Penjelasan yang benar selalu menyebut MODELNYA: «menurut GBM…» atau «menurut LR…».

Jebakan keempat — model yang kehilangan sinyal utamanya tetap menjelaskan dirinya dengan percaya diri. Buang SEMUA fitur PAY (PAY_0, PAY_2–PAY_6, PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT — sembilan fitur) [notebook]: LR jatuh dari ROC-AUC 0,7426 ke 0,6467, GBM dari 0,7823 ke 0,7343. Modelnya jauh lebih buruk — tapi penjelasannya tetap terlihat meyakinkan: LR tanpa PAY menjelaskan dirinya dengan LIMIT_BAL −0,3923, PAY_AMT1 −0,2921, PAY_AMT2 −0,2745, BILL_AMT2 +0,2543; GBM tanpa PAY menjelaskan dirinya dengan permutation PAY_AMT2 0,0402, UTILIZATION 0,0351, BILL_TREND 0,0269. Penjelasan yang benar tentang model yang buruk dibaca sebagai pembenaran model itu bila metriknya tidak diperiksa dulu.

**Baik/buruk:** keempat jebakan ini bagus bila kamu mengenalinya — masing-masing punya uji yang murah: korelasi antar fitur (jebakan 1), metrik model sebelum penjelasan (jebakan 2 dan 4), dan perbandingan antar model (jebakan 3). Buruk bila kamu tidak mengenalinya: keempatnya menghasilkan penjelasan yang TERLIHAT benar — ranking yang rapi, angka yang presisi, bahasa yang yakin. LIME di langkah 7 mengikuti pola yang sama: surrogate yang menunjuk fitur yang salah dengan format yang rapi.

**Mitigasi:** sebelum menyajikan penjelasan apa pun, jalankan daftar periksa empat butir: (1) korelasi — apakah fitur teratas berkorelasi kuat dengan fitur lain (r di atas 0,8)? Bila ya, laporkan per keluarga. (2) kualitas model — apakah ROC-AUC / PR-AUC / Brier model ini sudah diperiksa? Bila belum, penjelasan ditunda. (3) antar-model — apakah model pembanding sepakat? Bila tidak, laporkan keduanya. (4) fidelity — bila penjelasannya dari surrogate (LIME), berapa weighted R²-nya? Bila di bawah 0,1, buang.

---

## 10. Explainability untuk Fairness: Penjelasan Bisa Menunjukkan DI MANA — Bukan APAKAH Adil

Tiga lesson M7 membentuk satu rantai: M7.1 mengukur ketimpangan (AIR, TPR, FPR, kalibrasi per grup), M7.2 menyelidiki asalnya (lima sumber bias), dan lesson ini menjawab «fitur apa yang mendorong keputusan itu». Explainability TIDAK mengukur fairness — tidak ada angka SHAP, permutation, atau PDP yang berkata «model ini adil». Yang bisa dilakukan penjelasan adalah menunjukkan DI MANA ketimpangan itu hidup.

**Nilai [notebook]** — kontribusi kolom demografis pada prediksi GBM (mean |SHAP|, test 6.000, GBM mentah): SEX 0,0314; EDUCATION 0,0169; MARRIAGE 0,0259; AGE 0,0304 — semuanya di bawah 0,032, lawan PAY_MAX 0,4946 (lebih dari lima belas kali lipat). Keputusan model didorong luar biasa dominan oleh perilaku bayar, bukan oleh kolom demografis. Namun ketimpangan yang diukur M7.1 tetap ada: AIR SEX 0,8693; EDUCATION Pascasarjana AIR 0,603 (flag — dengan koreksi M7.1: n = 82 adalah grup Lainnya, pembandingnya, bukan Pascasarjana yang n-nya 2.130); FPR SMA 0,7463 vs Pascasarjana 0,5867. Kedua fakta itu konsisten: ketimpangan mengalir LEWAT fitur perilaku bayar (limit, pola bayar, tagihan) yang distribusinya berbeda antar grup — temuan measurement bias M7.2.

Yang BISA dilakukan penjelasan untuk fairness ada tiga. Pertama, reason codes untuk adverse action: nasabah yang ditolak berhak atas alasan berbahasa awam — dari LR (PAY_DELAY_COUNT, PAY_MAX, PAY_0) atau dari SHAP lokal GBM (nasabah 858: PAY_MAX +1,1368, PAY_0 +0,9280). Kedua, memeriksa apakah pendorong keputusan adalah variabel bisnis yang sah: di sini ya — keterlambatan bayar adalah alasan kredit yang sah. Ketiga, memberi input mitigasi M7.4. Yang TIDAK BISA dilakukan penjelasan ada tiga juga. Pertama, membuktikan fairness: model yang sepenuhnya bisa dijelaskan bisa tetap tidak adil. Kedua, mendeteksi label bias: SHAP membagi kredit prediksi, bukan kebenaran label. Ketiga, mendeteksi selection bias: PSI M2 (G9) 0,0104 dan PSI train vs test 0,0001–0,0008 (M7.2) menunjukkan tidak ada drift — tapi PSI tidak pernah melihat pengaju yang ditolak dulu dan tidak ada di data.

Satu konsistensi lintas lesson: di M2 (scorecard), AIR perempuan/laki-laki 1,1502 — arah yang SAMA dengan model ini (perempuan lebih sering disetujui), dengan model dan definisi grup yang berbeda. Catatan arah: 0,8693 = laki-laki/perempuan (AIR M7.1), 1,1502 = perempuan/laki-laki (kebalikannya, arah M2.2) — selalu nyatakan arah AIR-mu.

**Baik/buruk:** memakai penjelasan untuk fairness itu bagus bila dipakai sebagai DIAGNOSIS LOKASI — «ketimpangan ini hidup di fitur perilaku bayar, bukan di kolom demografis» adalah informasi yang mengarahkan mitigasi. Buruk bila dipakai sebagai PEMBUKTIAN — «model kami bisa dijelaskan, jadi model kami adil» adalah non sequitur yang berbahaya.

**Mitigasi:** dalam setiap laporan fairness, sertakan SATU paragraf explainability dengan empat isi: (1) lima pendorong global model (di sini PAY_MAX, PAY_0, UTILIZATION, LIMIT_BAL, PAY_AMT_MEAN — SHAP dan permutation sepakat); (2) kontribusi kolom demografis (di sini semuanya di bawah 0,032 mean |SHAP|); (3) reason codes untuk contoh adverse action (di sini nasabah 858: PAY_MAX, PAY_0); (4) batas yang diakui — penjelasan tidak membuktikan fairness, tidak mendeteksi label bias, dan tidak mendeteksi selection bias.

---

## 11. Counterfactual: «Apa yang Harus Berubah» — Bukan «Apa Penyebabnya»

Tiga jenis penjelasan yang sering dicampuradukkan. DESCRIPTIVE: «fitur apa yang mendorong keputusan ini?» — SHAP menjawabnya (PAY_MAX +1,1368, PAY_0 +0,9280 untuk nasabah 858). COUNTERFACTUAL: «perubahan input minimal apa yang membalikkan keputusan?» — tetap pertanyaan tentang MODEL. CAUSAL: «PAY_MAX MENYEBABKAN default» — klaim tentang DUNIA, yang butuh intervensi atau eksperimen. SHAP yang besar tidak pernah membuktikan kausalitas.

**Counterfactual nasabah 858, dihitung ulang dari data [notebook]:** baseline GBM terkalibrasi 0,8492 — ditolak. CF-A, «seandainya enam bulan terakhir semuanya dibayar tepat waktu» (PAY_0..6 = −1, PAY_AMT tetap 0): LR 0,1382, GBM mentah 0,3707, GBM terkalibrasi 0,3325 — TETAP DITOLAK. CF-B, ditambah «dibayar penuh tiap bulan»: LR 0,1456, GBM mentah 0,1406, GBM terkalibrasi 0,1535 — TETAP DITOLAK. Bahkan riwayat yang SEMPURNA pun tidak membalikkan keputusan. Dan membayar penuh justru MENAIKKAN probabilitas LR (0,1382 → 0,1456) — arah counterfactual tidak bisa ditebak, ia harus dihitung ulang.

**Baik/buruk:** counterfactual bagus sebagai diagnosis model — «seberapa jauh keputusan ini dari ambang?» Buruk bila dijual sebagai RENCANA AKSI: nasabah 858 TIDAK BISA mengubah riwayat PAY_0..6-nya. «Turunkan PAY_MAX-mu menjadi 0» bukan saran — itu manipulasi fitur: PAY_MAX adalah fitur TURUNAN dari enam kolom PAY. Dan buruk bila dibaca sebagai klaim kausal.

**Mitigasi:** tiga aturan feasibility — (1) fitur sensitif TIDAK PERNAH diubah; (2) fitur historis tidak bisa diubah mundur — counterfactual atas masa lalu adalah diagnosis, bukan rencana; (3) hanya perilaku MASA DEPAN yang bisa disarankan. Setiap counterfactual wajib membawa tiga label: modelnya, perubahan eksaknya, dan statusnya («what-if model, bukan janji»).

---

## 12. Alur Komunikasi Keputusan: Dari Penjelasan ke Surat Penolakan

Penjelasan yang benar belum tentu surat penolakan yang baik. Nasabah 858 tidak butuh waterfall SHAP — ia butuh surat yang berkata, dalam bahasa yang ia mengerti, KENAPA ia ditolak, APA yang bisa ia lakukan, dan KEPADA SIAPA ia bisa banding. Alur adverse action punya ENAM gerbang: (1) keputusan: ditolak, skor 0,8492 ≥ threshold 0,10; (2) reason codes top-3 — DENGAN label model asalnya; (3) terjemahan ke bahasa awam; (4) langkah yang bisa dilakukan nasabah; (5) reviewer manusia; (6) suratnya sendiri: keputusan, alasan, tindakan, jangka waktu banding, cara banding.

**Template surat untuk nasabah 858 [notebook]:** tiga reason codes teratas (dari LR, ROC-AUC 0,7426): PAY_DELAY_COUNT — «Jumlah bulan dengan keterlambatan pembayaran»; PAY_MAX — «Keterlambatan pembayaran terburuk dalam 6 bulan terakhir»; PAY_0 — «Status pembayaran bulan terakhir». Langkah yang bisa dilakukan: bayar tepat waktu di bulan-bulan ke depan; bayar penuh bila memungkinkan; ajukan peninjauan limit setelah riwayat membaik. Footer wajib: «reason codes ini dari model LR pendamping (ROC-AUC 0,7426), bukan dari GBM keputusan (0,7823)».

**Baik/buruk:** alur ini bagus karena ia memisahkan PENJELASAN (untuk analis/auditor) dan SURAT PENOLAKAN (untuk nasabah). Buruk bila dicampur: surat berisi waterfall SHAP lengkap bukan surat yang baik — ia dokumen analis yang salah alamat. Dan buruk bila reason codes LR dan SHAP GBM dicampur tanpa label: top-3 LR adalah PAY_DELAY_COUNT, PAY_MAX, PAY_0 — top-3 SHAP GBM lokal adalah PAY_MAX, PAY_0, PAY_AMT3; keduanya sepakat dua dari tiga.

**Mitigasi:** jadikan alur ini PROSEDUR OPERASIONAL — setiap surat lolos TIGA pemeriksaan: (1) tiap reason code menyebut MODEL asalnya? (2) tiap langkah yang disarankan BENAR-BENAR bisa dilakukan nasabah? (3) surat berisi reviewer, tanggal, dan cara banding? Simpan salinan surat bersama model version dan threshold policy-nya (M7.4, langkah 12).

---

## Lab 1: Permutation Importance + PDP PAY_MAX + Silang dengan SHAP

Hitung tiga alat global — dari angka kanonis [notebook]. Permutation GBM (test 6.000, ROC-AUC, 10 ulangan, baseline 0,7823): PAY_MAX 0,0569; PAY_0 0,0241; UTILIZATION 0,0130. Permutation LR (baseline 0,7426): PAY_DELAY_COUNT 0,1422. PDP 1D PAY_MAX, rata-rata P(default): GBM terkalibrasi 0,1589 pada 0 dan 0,2897 pada 4; LR 0,1966 pada 0 dan 0,3334 pada 4. SHAP global (GBM mentah, mean |SHAP|): PAY_MAX 0,4946.

Hasil [lab]: top1_gbm=PAY_MAX; drop1_gbm=0.0569; top1_lr=PAY_DELAY_COUNT; drop1_lr=0.1422; pdp_delta_gbm=0.1308; pdp_delta_lr=0.1368; shap_top1=PAY_MAX; shap_top1_value=0.4946. GBM dan LR menunjuk fitur nomor satu yang BERBEDA (PAY_MAX vs PAY_DELAY_COUNT) — importance itu milik model, bukan milik fitur. Kenaikan PDP dari 0 ke 4 hampir sama besar di kedua model (0,1308 vs 0,1368) walau bentuk kurvanya berbeda. SHAP dan permutation SEPAKAT soal nomor satu GBM (PAY_MAX).

## Lab 2: Dekomposisi Lokal Nasabah 858 — LR, SHAP, dan Vonis LIME

Bedah SATU nasabah (858, label aktual 1) dengan tiga alat lokal — dari angka kanonis [notebook]. LR: intercept −1,485; delapan kontribusi terbesar berjumlah 2,8746; 23 fitur sisanya −0,4518; log-odds 0,9378; probabilitas 0,7187. SHAP (GBM mentah): base value −1,555; jumlah SHAP 3,3699; log-odds GBM 1,8148; probabilitas GBM mentah 0,8599; dua SHAP lokal terbesar PAY_MAX +1,1368 dan PAY_0 +0,9280. LIME (kw 4,18): weighted R² 0,4396; prediksi surrogate pada titik itu 0,5475 vs GBM 0,8599; top-1 BILL_AMT1 (+0,0637).

Hasil [lab]: logodds_lr=0.9378; proba_lr=0.7187; shap_logodds_gbm=1.8149; shap_top1_local=PAY_MAX; shap_top2_local=PAY_0; lime_top1=BILL_AMT1; lime_ok=False. Catatan pembulatan: dari angka yang dibulatkan, −1,555 + 3,3699 = 1,8149 — selisih 0,0001 dari 1,8148 kanonis (dihitung dari nilai tak dibulatkan, galat efisiensi 0,0). Dekomposisi LR dan SHAP sama-sama «menjumlah» dengan tepat — LR: −1,485 + 2,8746 − 0,4518 = 0,9378; SHAP: −1,555 + 3,3699 ≈ 1,8148. Dua alat yang berbeda itu SEPAKAT soal dua pendorong teratas nasabah 858 (PAY_MAX dan PAY_0). LIME TIDAK sepakat — top-1-nya BILL_AMT1 — dan vonisnya False: penjelasan LIME untuk nasabah ini tidak lolos uji silang.

## Lab 3: Dari Fitur Kanonis ke Bahasa Pelanggan — Reason Codes untuk Nasabah 858

Lab ketiga mengubah angka kanonis menjadi surat. LR top-3 untuk nasabah 858 [notebook]: PAY_DELAY_COUNT +2,5175; PAY_MAX +1,3426; PAY_0 +0,6532. SHAP GBM top-3 lokal: PAY_MAX +1,1368; PAY_0 +0,9280; PAY_AMT3 +0,1553. Terjemahkan top-3 LR ke bahasa awam, hitung tumpang tindihnya dengan top-3 SHAP GBM (overlap = 2), dan tandai tiap usulan tindakan sebagai feasible atau tidak: bayar tepat waktu di bulan-bulan ke depan = feasible; ubah SEX = tidak; ubah riwayat PAY = tidak.

---

## Guided Task di Colab

Notebook: colab/mlf-m73-guided-task.ipynb — flagship GBM + GBM terkalibrasi, permutation importance GBM dan LR, PDP 1D PAY_MAX/UTILIZATION/PAY_MEAN (grid bersih) dan PDP 2D, SHAP global dan lokal nasabah 858 dengan TreeExplainer (shap 0.54.1), surrogate LIME dengan kw 4,18, dekomposisi log-odds LR, serta model tanpa fitur PAY. Tautan Colab: https://colab.research.google.com/drive/1ZEWaXFQcJoAeGfyYhddJEC5czKLV2pjx

## Rangkuman

- Model keputusan: GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 [notebook]. ROC-AUC GBM mentah 0,7823 / PR-AUC 0,5597; LR 0,7426 / 0,5049.
- Global vs lokal [notebook]: pertanyaan global dijawab permutation, PDP, dan mean |SHAP|; pertanyaan lokal dijawab dekomposisi LR, SHAP waterfall, dan LIME.
- Permutation GBM (10 ulangan, baseline 0,7823) [notebook]: PAY_MAX 0,0569; PAY_0 0,0241; UTILIZATION 0,0130; PAY_AMT_MEAN 0,0069; LIMIT_BAL 0,0062. Permutation LR: PAY_DELAY_COUNT 0,1422 — fitur nomor satu yang berbeda antar model.
- Jebakan permutation [notebook]: BILL_AMT1..6 berkorelasi r = 0,9463 dengan BILL_MEAN — jumlah keenam kolom 0,0116, masing-masing tampak kecil; PAY_MEAN vs PAY_MAX r = 0,8194.
- PDP 1D PAY_MAX [notebook]: GBM terkalibrasi datar 0,1589 pada −2..0, naik ke 0,2897 pada 4, datar 0,2892 sampai 8 (tangga); LR naik mulus 0,1456 ke 0,5063. PDP UTILIZATION: GBM 0,1990 ke 0,2627 (jenuh). PDP PAY_MEAN (grid bersih): 0,2084 ke puncak 0,2460 pada 2, lalu 0,2399 pada 4. PDP 2D: (0; 0,2) 0,1389 sampai (4; 2,0) 0,3275 — hampir aditif.
- SHAP (shap 0.54.1, TreeExplainer, GBM mentah) [notebook]: global mean |SHAP| PAY_MAX 0,4946; PAY_0 0,2385; UTILIZATION 0,1574; LIMIT_BAL 0,1113; PAY_AMT_MEAN 0,0892 — lima besar yang sama dengan permutation. Lokal nasabah 858: base −1,555 + jumlah SHAP 3,3699 ≈ 1,8148 (tanpa pembulatan, galat 0,0); PAY_MAX +1,1368, PAY_0 +0,9280. Caveat: nilai eksak pada skor terkalibrasi berbeda.
- LIME (kw 4,18) [notebook]: R² 0,4396, prediksi surrogate 0,5475 vs GBM 0,8599 (gap 0,3124), top-3 BILL_AMT1, PAY_AMT3, MARRIAGE — menunjuk fitur yang salah; stabil (seed 7 overlap 2 dari 3, R² 0,4374) tapi tetap salah. Upaya pertama kw 1,0 memberi R² 0,0003 — bug kernel width.
- LR [notebook]: intercept −1,485; PAY_DELAY_COUNT +0,756 (OR 2,1297); PAY_2..PAY_6 dan PAY_MEAN negatif — BUKAN efek protektif: univariat, PAY_0 telat default 0,4985 vs tidak telat 0,1426; PAY_MEAN telat 0,4717 vs tidak telat 0,1427 — ini multikolinearitas. Nasabah 858: log-odds 0,9378, probabilitas 0,7187; reason codes PAY_DELAY_COUNT, PAY_MAX, PAY_0.
- Empat jebakan [notebook]: importance terpecah; model underfit (max_iter 5, ROC-AUC 0,7725) tetap memberi ranking masuk akal; dua model dua cerita; model tanpa fitur PAY (LR 0,6467, GBM 0,7343) tetap menjelaskan dirinya dengan percaya diri.
- Fairness [notebook]: mean |SHAP| kolom demografis di bawah 0,032 (SEX 0,0314; EDUCATION 0,0169; MARRIAGE 0,0259; AGE 0,0304) — ketimpangan M7.1 (AIR SEX 0,8693; EDUCATION Pascasarjana AIR 0,603 flag) mengalir lewat fitur perilaku bayar, bukan kolom demografis.
- Counterfactual [notebook]: seandainya riwayat 858 sempurna (PAY_0..6 = −1), GBM terkalibrasi 0,3325 — tetap ditolak; ditambah bayar penuh 0,1535 — tetap ditolak. Counterfactual adalah diagnosis model, bukan rencana aksi dan bukan klaim kausal.
- Adverse action: surat penolakan berisi top-3 reason codes bahasa awam (dari LR) + langkah yang bisa dilakukan + reviewer + jangka waktu banding; waterfall SHAP adalah penjelasan untuk analis, bukan surat untuk nasabah.
- Lab: permutation + PDP + SHAP sepakat PAY_MAX nomor satu GBM (0,0569 / delta 0,1308 / 0,4946); dekomposisi lokal menjumlah tepat (LR 0,9378; SHAP 1,8148); LIME gagal uji silang (lime_ok=False).

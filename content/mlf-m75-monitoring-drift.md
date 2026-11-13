# MLF-M7.5: Monitoring & Drift — Model yang Kemarin Akurat, Hari Ini Menolak Semua Orang

## Masalah: Approval Anjlok, Model Tidak Disentuh Siapa Pun

Model GBM sudah live tiga bulan. Di test, ROC-AUC GBM mentah 0,7823 dan PR-AUC 0,5597 [notebook] — setelah kalibrasi Platt, model keputusan 0,7816 / 0,5558 — lumayan. Threshold operasional 0,10 menyetujui 28,5% nasabah dengan bad rate 6,67% [notebook]. Lalu suatu pagi, tim bisnis menelepon: «Approval rate anjlok ke 7% — hampir semua pengajuan ditolak. Apa yang rusak?» Modelnya tidak disentuh siapa pun. Datanya yang berubah: para nasabah mulai terlambat membayar satu bulan lebih lama dari biasanya — dan skor model ikut bergeser.

Itulah drift. Model yang sama, kode yang sama, threshold yang sama — tapi populasi yang datang sudah bukan populasi yang dulu dipakai melatihnya.

Angka acuan [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05. Baseline monitoring [notebook]: test ROC-AUC 0,7816, PR-AUC 0,5558, ECE 0,0087, approval rate 28,5%, bad rate 6,67%, skor rata-rata 0,2217.

Satu peringatan jujur di depan: data UCI ini SATU snapshot — tidak ada tanggal, tidak ada deret waktu. Semua analisis «per periode» di lesson ini memakai WAKTU SEMU — urutan ID baris, BUKAN tanggal nyata — dan semua skenario geser memakai SIMULASI yang dilabeli [simulasi] dengan parameternya ditulis eksplisit. Jangan pernah mengklaim ada data deret waktu bila tidak ada.

---

## 1. Model yang Kemarin Akurat, Hari Ini Menolak Semua Orang

**Nilai:** monitoring adalah selisih antara «model yang pernah bagus» dan «model yang masih bagus». Tanpa monitoring, kamu baru tahu modelmu rusak dari keluhan bisnis — berminggu-minggu setelah kerugian terjadi. Dengan monitoring, PSI skor 0,5811 dan approval yang anjlok memberi tahu lebih dulu, lengkap dengan angka dan penanggung jawabnya.

**Baik/buruk:** ROC-AUC GBM mentah 0,7823 di test itu bagus sebagai foto SATU titik waktu (model keputusan terkalibrasi: 0,7816). Buruk bila dibaca sebagai «model ini akan selamanya 0,7823»: angka test adalah foto, bukan jaminan. Populasi bergerak, dan foto lama tidak melindungi dari drift baru.

**Mitigasi:** pasang dashboard monitoring SEBELUM model live — PSI skor, ROC-AUC/PR-AUC per periode, approval rate, bad rate — dengan ambang alert yang ditulis dulu. Model tanpa monitoring adalah model yang kamu serahkan pada nasib.

---

## 2. Tiga Jenis Drift

**Data drift (covariate shift):** DISTRIBUSI FITUR berubah, hubungan fitur-ke-label tetap. Contoh: limit kartu rata-rata naik 30% karena bank menaikkan limit massal — UTILIZATION turun, skor turun, approval naik.

**Prior shift (label shift):** BASE RATE berubah, hubungan fitur-ke-label tetap. Contoh: resesi menaikkan base rate default dari 0,2212 ke 0,30 — model yang sama akan under-predict peluang default (kalibrasi bergeser meski ranking-nya utuh) dan bad rate yang disetujui naik; arah approval bergantung pada pergeseran distribusi X, jadi jangan diasumsikan otomatis turun.

**Concept drift:** HUBUNGAN fitur-ke-label berubah. Contoh: pola «terlambat 1 bulan» yang dulu hampir pasti berujung default, kini tidak lagi karena ada program restrukturisasi — fitur yang sama kini berarti lain. Inilah yang paling berbahaya: modelmu mempelajari dunia yang sudah tidak ada.

Ketiga jenis ini butuh alat deteksi yang berbeda. Data drift terdeteksi PSI per fitur dan PSI skor. Prior shift terdeteksi base rate dan skor rata-rata per periode. Concept drift TIDAK terdeteksi PSI sama sekali — distribusi fitur bisa stabil sempurna sementara hubungannya dengan label berubah — ia hanya terdeteksi lewat decay performa: ROC-AUC/PR-AUC per periode yang turun padahal PSI stabil. Itulah alasan monitoring butuh KEDUA keluarga metrik: PSI tanpa metrik performa buta terhadap concept drift; metrik performa tanpa PSI buta terhadap penyebabnya.

**Baik/buruk:** taksonomi tiga drift ini bagus karena ia memberi nama pada tiga kegagalan yang berbeda — dan nama yang tepat adalah separuh diagnosis. Buruk bila dipakai sebagai label tempelan tanpa bukti: «ini concept drift» harus dibuktikan dengan PSI stabil + performa turun, bukan sekadar ditebak karena performa turun.

**Mitigasi:** untuk setiap alert, catat dulu JENIS drift yang dicurigai beserta buktinya — PSI fitur, PSI skor, base rate, ROC-AUC per periode — sebelum memutuskan aksi.

---

## 3. PSI: Satu Angka untuk «Seberapa Jauh Populasi Bergeser»

Population Stability Index (PSI) membandingkan distribusi sebuah variabel di dua populasi — biasanya train (yang diharapkan, expected) vs live atau test (yang aktual, actual). Caranya: bagi variabel ke dalam bin (di lesson ini 10 bin desil dari kuantil TRAIN — bin-nya ditetapkan sekali dari train, lalu dipakai untuk kedua populasi), hitung pangsa tiap bin di kedua populasi, lalu jumlahkan (aktual − expected) × ln(aktual / expected) per bin. Bin yang pangsanya tidak berubah menyumbang nol; bin yang pangsanya bergeser menyumbang positif. PSI tidak pernah negatif; PSI 0 berarti distribusi IDENTIK.

$$\mathrm{PSI} = \sum_{b=1}^{B} (a_b - e_b)\, \ln\!\left(\frac{a_b}{e_b}\right), \qquad \begin{array}{ll} \mathrm{PSI} < 0{,}1 & \text{stabil} \\ 0{,}1 \le \mathrm{PSI} \le 0{,}25 & \text{waspada} \\ \mathrm{PSI} > 0{,}25 & \text{geser besar} \end{array}$$

Band yang dipakai lesson ini — band standar industri, ditulis dulu sebelum melihat angka: PSI di bawah 0,1 = STABIL; 0,1 sampai 0,25 = WASPADA; di atas 0,25 = GESER BESAR.

**Nilai:** PSI bagus karena ia SATU angka per variabel yang bisa dipantau otomatis setiap hari — tanpa label. Itu krusial: label default baru diketahui berminggu-minggu kemudian, sementara PSI bisa dihitung begitu skor keluar. PSI adalah sistem peringatan dini; metrik performa adalah konfirmasi yang datang terlambat.

**Baik/buruk:** PSI bagus sebagai alarm — murah, tanpa label, dan langsung menunjuk variabel mana yang bergeser. Buruk bila dibaca tanpa n: pada sampel kecil, pangsa bin berayun liar karena noise dan PSI membesar tanpa ada drift nyata. Buruk juga bila bin-nya dibuat dari LIVE (bukan train): bin yang menyesuaikan diri dengan populasi baru akan menyembunyikan gesernya sendiri. Bin SELALU dari train.

**Mitigasi:** tetapkan bin dari train, kunci, dan jangan pernah mengubahnya saat membandingkan. Bila n per periode kecil (di bawah 1.000), naikkan ambang waspadamu atau gabungkan periode — PSI dari sampel kecil adalah rumor.

---

## 4. PSI per Fitur Train vs Test: Semuanya Stabil — dan Itu Justru Pelajarannya

**Nilai [notebook]** — 16 fitur kunci, train (24.000) vs test (6.000), bin desil dari kuantil train: SEMUA 16 fitur STABIL — tidak satu pun melewati 0,1, bahkan tidak satu pun melewati 0,01. Tertinggi AGE 0,0029, lalu PAY_AMT1 0,0022, BILL_AMT1 0,0021, PAY_AMT_MEAN 0,0020, LIMIT_BAL 0,0016, BILL_TREND 0,0014, UTILIZATION 0,0013, PAY_MAX 0,0012, EDUCATION 0,0011, PAY_0 0,0011, PAY_DELAY_COUNT 0,0010, PAY_MEAN 0,0008, BILL_MEAN 0,0007, MARRIAGE 0,0007, PAY_RATIO 0,0004, SEX 0,0001. Rata-rata LIMIT_BAL train NT$167.365 vs test NT$167.963; UTILIZATION train 0,4234 vs test 0,4257 — nyaris identik.

Hasil «membosankan» ini adalah pelajaran PENTING, bukan kegagalan. Train vs test di sini berasal dari SATU split acak (stratified, seed 42) — keduanya ditarik dari populasi yang sama, jadi PSI-nya HARUS mendekati nol. PSI train-vs-test yang besar justru akan menjadi tanda ada yang salah dengan split-mu. Pembanding yang dikunci koordinator: M2 G9 PSI 0,0104 — juga di band STABIL (di bawah 0,1), sejalan dengan hasil di sini.

**Baik/buruk:** PSI per fitur yang semuanya stabil itu bagus sebagai BASELINE — ia membuktikan split-mu sehat dan memberi titik nol untuk perbandingan live nanti. Buruk bila dibaca sebagai «populasi live stabil»: test BUKAN live. PSI train-vs-test menguji split-mu; PSI live-vs-train menguji duniamu.

**Mitigasi:** simpan PSI train-vs-test ini sebagai BASELINE (tertinggi AGE 0,0029) dan bandingkan PSI live-vs-train terhadapnya. Bila PSI live-vs-train untuk AGE tiba-tiba 0,15, kamu tahu itu bukan noise split — karena noise split hanya 0,0029.

---

## 5. PSI Skor: Satu Angka yang Merangkum Semua Fitur Sekaligus

PSI per fitur memberi 16 angka — terlalu banyak untuk dipantau tiap pagi. PSI SKOR memberi SATU angka: bandingkan distribusi probabilitas prediksi model di train vs test (atau live), dengan bin desil dari kuantil skor train.

**Nilai [notebook]:** PSI skor GBM terkalibrasi (Platt/sigmoid) train vs test = 0,0017 (stabil); PSI skor GBM mentah = 0,0024 (stabil). Skor rata-rata train 0,2214 vs test 0,2217 — selisih 0,0003.

PSI skor adalah METRIK MONITORING UTAMA lesson ini, karena tiga alasan. Pertama, ia SATU angka — cukup untuk satu baris dashboard dan satu ambang alert. Kedua, ia merangkum SEMUA fitur: bila satu fitur bergeser cukup besar untuk menggerakkan skor, PSI skor menangkapnya walau kamu tidak memantau fitur itu. Ketiga, ia bisa dihitung TANPA label.

**Baik/buruk:** PSI skor bagus sebagai alarm pertama — murah dan menyeluruh. Buruk bila dipakai sendirian: ia memberitahumu ADA yang bergeser, tapi tidak memberitahumu APA yang bergeser. Bila PSI skor 0,5811 seperti di simulasi S2, kamu masih butuh PSI per fitur untuk diagnosis. Buruk juga bila skornya sendiri tidak stabil karena kalibrasi: di sini skornya terkalibrasi (ECE test 0,0087), jadi PSI skornya bisa dipercaya.

**Mitigasi:** pantau PSI skor HARIAN sebagai alarm pertama; bila melewati 0,1, turun ke PSI per fitur untuk diagnosis — fitur dengan PSI terbesar adalah tersangka utama. Urutannya selalu: skor dulu (alarm), fitur kemudian (diagnosis).

---

## 6. Attribution Drift: Ketika Alasannya Berubah — Walau Skornya Tidak

PSI skor memberitahumu populasi bergeser; PSI per fitur memberitahumu fitur mana yang bergeser. Attribution drift adalah perubahan pada PENJELASAN model dari waktu ke waktu — fitur yang dulu menjadi pendorong utama kini bukan lagi — sementara skor dan metrik performa bisa tampak stabil.

**Monitor dua hal [simulasi atas SHAP kanonis M7.3]:** proporsi top reason codes per periode (baseline mean |SHAP|: PAY_MAX 0,4946; PAY_0 0,2385; UTILIZATION 0,1574; LIMIT_BAL 0,1113; PAY_AMT_MEAN 0,0892; periode baru: PAY_MAX 0,2500, UTILIZATION 0,3100 — top-1 BERGANTI) dan PSI atas mean |SHAP| per keluarga fitur. Dan monitor per grup: reason codes per grup (SEX/EDUCATION).

**Baik/buruk:** monitoring atribusi bagus karena menangkap perubahan yang tidak terlihat di metrik performa. Buruk bila dibaca sebagai BUKTI KAUSAL: «UTILIZATION kini menyebabkan default» adalah klaim tentang dunia — yang ditunjukkan hanyalah «model ini kini lebih mengandalkan UTILIZATION». Attribution drift adalah DIAGNOSIS.

**Mitigasi:** tambahkan tiga baris ke dashboard — (1) top-3 reason codes per periode (global dan per grup); (2) PSI mean |SHAP| per keluarga fitur; (3) selisih mean |SHAP| top-1 antar-periode. Aturan alert sama seperti alerting: satu periode = WASPADA, dua periode berturut-turut = selidiki.

---

## 7. Waktu Semu: Lima Periode, Satu Kejutan — dan Kenapa Kejutan Itu Noise

Data UCI tidak punya tanggal. Untuk mempelajari «dari waktu ke waktu» tanpa berbohong, lesson ini memakai WAKTU SEMU: test 6.000 diurutkan menurut ID baris, lalu dipotong menjadi 5 chunk berurutan @ 1.200 nasabah [waktu semu — urutan ID, BUKAN tanggal nyata]. ID di sini hanyalah nomor urut baris di file, bukan waktu pengajuan — jadi pola antar-chunk adalah VARIASI SAMPLING, bukan tren waktu. Justru itu yang membuatnya berguna sebagai latihan: ia menunjukkan betapa berisiknya metrik per periode, bahkan saat tidak ada drift sama sekali.

**Gambar:** ROC-AUC per chunk — chunk 1 0,7449; chunk 2 0,7428; chunk 3 0,8138; chunk 4 0,8041; chunk 5 0,8006; garis baseline test 0,7816.

**Nilai [notebook]** — GBM terkalibrasi (Platt/sigmoid), threshold 0,10, per chunk [waktu semu]: Chunk 1 (ID 1–6.069): base rate 0,2200, ROC-AUC 0,7449, PR-AUC 0,4982, approval 26,92%, bad rate 8,05%. Chunk 2 (ID 6.072–12.246): base rate 0,2375, ROC-AUC 0,7428, PR-AUC 0,5137, approval 27,17%, bad rate 10,74%. Chunk 3 (ID 12.250–18.115): base rate 0,2450, ROC-AUC 0,8138, PR-AUC 0,6314, approval 25,17%, bad rate 5,63%. Chunk 4 (ID 18.117–24.223): base rate 0,2092, ROC-AUC 0,8041, PR-AUC 0,5985, approval 33,67%, bad rate 5,20%. Chunk 5 (ID 24.235–29.996): base rate 0,1942, ROC-AUC 0,8006, PR-AUC 0,5458, approval 29,58%, bad rate 4,23%. Rentang ROC-AUC 0,7428–0,8138 (lebar 0,0710); rentang PR-AUC 0,4982–0,6314 (lebar 0,1332); base rate 0,1942–0,2450 (lebar 5,08 poin persen). PSI chunk 1 vs chunk 5 [waktu semu]: skor 0,0161, PAY_MEAN 0,0193, UTILIZATION 0,0191, BILL_AMT1 0,0153, LIMIT_BAL 0,0129 — semuanya STABIL.

Perhatikan chunk 1 dan 2: ROC-AUC 0,7449 dan 0,7428 — turun 0,0367 dan 0,0388 dari baseline test 0,7816. Bila kamu hanya melihat dua chunk itu, kamu akan menyimpulkan «model decay». Lalu chunk 3 datang: ROC-AUC 0,8138 — NAIK 0,0322 di atas baseline. Model yang sama, tidak disentuh, berayun 0,0710 antar-periode karena n per chunk hanya 1.200. Bad rate chunk 2 (10,74%) melewati ambang 10% — lalu chunk 3 (5,63%) dan chunk 5 (4,23%) jauh di bawahnya.

**Baik/buruk:** analisis per periode bagus karena ia satu-satunya cara melihat decay — metrik agregat 6.000 menyembunyikan ayunan ini. Buruk bila satu periode dibaca sebagai vonis: n = 1.200 terlalu kecil untuk vonis retrain. Aturan lesson ini: satu periode buruk = waspada + pantau periode berikutnya; DUA periode buruk berturut-turut = aksi.

**Mitigasi:** laporkan metrik per periode SELALU bersama n dan intervalnya (di sini n = 1.200 per chunk), dan jangan ambil keputusan retrain dari satu periode.

---

## 8. Matured Cohort: Label yang Belum Matang Tidak Boleh Dipakai untuk Menilai

Semua metrik performa — ROC-AUC, PR-AUC, bad rate, dan semua metrik fairness — butuh LABEL. Dan label butuh WAKTU. Label di dataset ini adalah «default bulan depan» — jendela observasi 1 bulan. Nasabah yang aplikasinya 2 minggu lalu BELUM PUNYA label. Garis waktunya: aplikasi (bulan 0) → skor/keputusan (saat itu juga) → jendela observasi (1 bulan) → label tersedia (matang).

**Nilai:** cohort MATANG adalah aplikasi yang jendela observasinya sudah lewat — hanya cohort inilah yang boleh dipakai untuk ROC-AUC, PR-AUC, bad rate, dan metrik fairness. Cohort BELUM MATANG hanya boleh dimonitor TANPA label: PSI, approval rate, distribusi skor, dan proporsi label matang itu sendiri. Laporkan «proporsi label matang» per periode: bila 0%, tulis «belum matang», bukan 0. Bila 60%, metriknya adalah metrik atas 60% itu — dan 60% itu BUKAN sampel acak (default cenderung ketahuan lebih dulu).

**Baik/buruk:** pemisahan ini bagus karena ia membuat satu pertanyaan tajam — «periode ini boleh dipakai untuk metrik apa?» Buruk bila dibaca sebagai «jadi periode terbaru tidak berguna»: periode terbaru justru yang paling penting untuk monitoring TANPA label.

**Mitigasi:** pisahkan DUA kolom per periode — «monitoring tanpa label» (selalu tersedia) dan «monitoring dengan label» (hanya cohort matang). Periode yang belum matang TIDAK PERNAH menaikkan level alert berbasis label.

---

## 9. Decay Performa: Kapan Penurunan Itu Nyata, dan Kapan Itu Hanya Noise

Decay performa adalah penurunan ROC-AUC/PR-AUC (atau naiknya bad rate, ECE, Brier) dari waktu ke waktu pada model yang tidak berubah. Bedakan tiga pola. **Pola 1 — noise:** penurunan satu periode lalu rebound (chunk 2 ROC-AUC 0,7428 lalu chunk 3 0,8138). Bukan decay. **Pola 2 — decay bertahap:** penurunan kecil tapi KONSISTEN dua-tiga periode berturut-turut, PSI skor merangkak naik melewati 0,1. Ini decay. **Pola 3 — patahan:** penurunan besar dalam satu periode BERSAMA PSI skor di atas 0,25 (seperti simulasi S2: ROC-AUC turun 0,0256, PR-AUC turun 0,0582, PSI skor 0,5811). Ini decay mendadak.

$$\Delta\mathrm{ROC} = \mathrm{ROC}_{\text{baseline}} - \mathrm{ROC}_{\text{periode}}, \qquad \text{decay bila } \Delta\mathrm{ROC} > 0{,}02 \text{ dalam 2 periode berturut-turut}$$

**Nilai [notebook] — baseline vs train:** GBM terkalibrasi (Platt/sigmoid) ROC-AUC train 0,8501 vs test 0,7816 — selisih 0,0685. Hati-hati: ini BUKAN decay; ini GAP TRAIN-TEST (overfitting) — model yang sama diukur pada data yang pernah dilihat vs belum. Decay diukur dengan membandingkan periode live yang satu dengan periode live BERIKUTNYA, atau live vs baseline test — bukan train vs test. Satu lagi angka yang sering disalahbaca: ECE train 0,0415 vs ECE test 0,0087. ECE train yang LEBIH BURUK bukan bukti kalibrasi rusak — kalibrasi tidak boleh diukur di train, karena model sudah melihat data itu. Ukur kalibrasi selalu di data yang belum dilihat model.

**Baik/buruk:** ROC-AUC per periode bagus sebagai detektor concept drift — satu-satunya alat yang menangkap hubungan fitur-label yang berubah sementara PSI diam. Buruk bila dipakai tanpa pembanding PSI: ROC-AUC turun + PSI stabil = concept drift; ROC-AUC turun + PSI besar = data drift. PR-AUC lebih sensitif daripada ROC-AUC di data tidak seimbang ini: di chunk [waktu semu], PR-AUC berayun 0,4982–0,6314 (lebar 0,1332) sementara ROC-AUC hanya 0,0710 — dan di simulasi S2, PR-AUC turun 0,0582, lebih dari dua kali penurunan ROC-AUC (0,0256).

**Mitigasi:** tetapkan baseline performa (test: ROC-AUC 0,7816, PR-AUC 0,5558, ECE 0,0087, bad rate 6,67%) dan ukur penurunan RELATIF terhadap baseline itu, bukan terhadap train. Simpan juga lebar ayunan noise-mu: ROC-AUC ±0,04 antar-periode n = 1.200 adalah NORMAL di data ini.

---

## 10. Dua Simulasi Geser: Limit Naik vs Keterlambatan Naik — Hasil yang Berlawanan

Karena UCI tidak punya deret waktu, lesson ini mensimulasikan geser secara eksplisit — DILABELI [simulasi], parameternya ditulis, modelnya dibekukan (tidak di-retrain), dan skornya dihitung ulang. **Simulasi S1 «limit naik» [simulasi]:** LIMIT_BAL × 1,30 untuk semua baris test, fitur turunan dihitung ulang (UTILIZATION turun karena limit naik). **Simulasi S2 «keterlambatan naik» [simulasi]:** PAY_0 sampai PAY_6 + 1 (dibatasi maks 8) untuk semua baris test, fitur turunan dihitung ulang (PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT naik). Keduanya memakai GBM terkalibrasi yang sama, threshold 0,10, dan dibandingkan dengan baseline test.

**Gambar:** PSI skor — baseline train-vs-test 0,0017; S1 0,0358; S2 0,5811; garis waspada 0,1 dan geser besar 0,25.

**Nilai [notebook] — S1 [simulasi]:** PSI skor 0,0358 (stabil), ROC-AUC 0,7796 (turun 0,0020 dari baseline 0,7816), PR-AUC 0,5551 (turun 0,0007), skor rata-rata 0,2108 (turun 0,0109), approval rate 36,32% (NAIK 7,82 poin persen dari 28,5%), bad rate 7,94% (naik 1,27 poin persen), ECE 0,0148 (dari 0,0087). **S2 [simulasi]:** PSI skor 0,5811 (GESER BESAR), ROC-AUC 0,7560 (turun 0,0256), PR-AUC 0,4976 (turun 0,0582), skor rata-rata 0,3210 (NAIK 0,0993), approval rate 7,05% (ANJLOK 21,45 poin persen dari 28,5%), bad rate 6,62% (turun 0,05 poin persen), ECE 0,1003 (11,5× baseline 0,0087), Brier 0,1538 (dari 0,1345). Pada S2, pangsa desil skor terendah jatuh dari 10% ke 1,83% sementara desil ke-8 naik dari 10% ke 22,55% — seluruh distribusi skor bergeser ke kanan.

Bacalah kedua simulasi berdampingan. **S1:** populasi bergeser, skor bergeser sedikit (PSI 0,0358), ranking UTUH (ROC-AUC turun 0,0020), tapi approval NAIK 7,82 poin persen — dampak BISNIS nyata tanpa kerusakan MODEL. Respons yang benar: sesuaikan ekspektasi bisnis, mungkin tinjau threshold — bukan retrain. **S2:** populasi bergeser besar (PSI 0,5811), ranking TURUN (ROC-AUC −0,0256, PR-AUC −0,0582), approval ANJLOK 21,45 poin persen, dan KALIBRASI RUSAK (ECE 0,1003) — threshold 0,10 tidak lagi berarti apa yang dulu ia artikan. Respons yang benar: retrain. Perhatikan juga bad rate S2: 6,62%, nyaris sama dengan baseline 6,67% — bad rate TIDAK menangkap bencana ini, karena yang disetujui tinggal 423 nasabah paling aman. Metrik yang tidak bergerak bisa sama berbahayanya dengan metrik yang bergerak.

**Baik/buruk:** simulasi bagus karena ia satu-satunya cara berlatih menghadapi drift saat datamu hanya satu snapshot — ia memberi angka yang bisa dihitung dan dibandingkan. Buruk bila hasilnya dibaca sebagai «bukti» tentang dunia nyata: S1 dan S2 adalah skenario YANG KAMU TULIS parameternya, bukan observasi. Mereka membuktikan «BILA limit naik 30%, MAKA approval naik 7,82 poin persen» — bukan «limit AKAN naik 30%».

**Mitigasi:** sebelum live, jalankan simulasi geser pada modelmu sendiri — geser satu fitur kunci, ukur PSI skor + ROC-AUC + approval. Hasilnya adalah PETA SENSITIVITAS: fitur mana yang bila bergeser akan menghancurkan bisnismu, dan mana yang tidak.

---

## 11. Alerting: Ambang Ditulis Dulu, Penanggung Jawab Ditulis Dulu

Alert yang baik punya empat bagian: METRIK, AMBANG, FREKUENSI, dan PENANGGUNG JAWAB. Tabel alert lesson ini [keputusan kebijakan lesson ini — ambang dipilih dari angka lesson, bukan konstanta alam]: PSI skor di atas 0,1 = WASPADA (analis memeriksa PSI per fitur dalam 1 hari kerja); PSI skor di atas 0,25 = KRITIS (analis + risk manager, investigasi dalam 1 hari kerja, keputusan retrain dalam 1 minggu). ROC-AUC turun lebih dari 0,02 dari baseline 0,7816 dalam 1 periode = WASPADA; dalam 2 periode berturut-turut = KRITIS. PR-AUC turun lebih dari 0,03 = WASPADA; 2 periode = KRITIS. Bad rate di atas 10% dalam 1 periode = WASPADA; 2 periode = KRITIS. ECE di atas 0,02 = WASPADA (kalibrasi perlu dicek ulang — threshold 0,10 bergantung padanya). Approval rate bergerak lebih dari 5 poin persen dari baseline 28,5% = PANTAU (bukan alarm model — tapi beri tahu bisnis, karena ini memengaruhi volume).

Uji tabel ini pada angka lesson. **Chunk 2 [waktu semu]:** ROC-AUC turun 0,0388, PR-AUC turun 0,0421, bad rate 10,74% — TIGA alarm waspada menyala sekaligus. Tapi chunk 3 membaik (ROC-AUC 0,8138) — tidak ada yang bertahan 2 periode, jadi tidak ada yang naik ke KRITIS dan tidak ada retrain. **S1 [simulasi]:** approval naik 7,82 poin persen — alarm PANTAU menyala, tapi PSI skor 0,0358 dan ROC-AUC turun 0,0020 tidak menyalakan apa pun. Respons: beri tahu bisnis, bukan retrain. **S2 [simulasi]:** PSI skor 0,5811, ROC-AUC turun 0,0256, PR-AUC turun 0,0582, ECE 0,1003 — KRITIS di empat metrik sekaligus. Respons: retrain.

Dua jebakan alerting. Pertama, ALERT FATIGUE: ambang yang terlalu ketat akan berteriak tiap periode — di data ini ayunan noise antar-periode mencapai 0,0388 — dan tim akan berhenti mendengar. Kedua, ALERT TANPA PEMILIK: PSI 0,5811 tanpa nama penanggung jawab adalah angka di dashboard yang tidak dibaca siapa pun. Tiap alert di tabel ini punya pemilik: analis untuk WASPADA, analis + risk manager untuk KRITIS, dan bisnis diberitahu untuk PANTAU approval.

**Dashboard monitoring minimal** — dibaca SETIAP PAGI oleh analis, MINGGUAN oleh risk manager: (1) PSI skor harian vs train (ambang 0,1 / 0,25); (2) ROC-AUC dan PR-AUC per periode vs baseline 0,7816 / 0,5558; (3) approval rate dan bad rate per periode vs 28,5% / 6,67%; (4) skor rata-rata dan ECE per periode vs 0,2217 / 0,0087; (5) PSI 5 fitur kunci (LIMIT_BAL, PAY_MEAN, UTILIZATION, BILL_AMT1, AGE) mingguan. Lima baris, satu halaman, tanpa grafik yang tidak dibaca.

**Baik/buruk:** tabel alert ini bagus karena ambangnya DITULIS DULU dari angka lesson (noise 0,0388, baseline 0,7816) — bukan ditebak sesudah melihat angka. Buruk bila ambang ini disalin mentah ke produksi lain: ambang yang benar untuk n = 1.200 per periode belum tentu benar untuk n = 100.000 per hari. Hitung noise-mu sendiri, baru tulis ambangmu.

**Mitigasi:** tinjau ambang tiap kuartal — bila alarm WASPADA tidak pernah menyala dalam 6 bulan, ambangmu mungkin terlalu longgar; bila menyala tiap minggu, terlalu ketat atau modelmu memang sedang decay.

---

## 12. Fairness Monitoring: Overall yang Stabil Bisa Menyembunyikan Ketidakadilan yang Bergerak

Monitoring sejauh ini memonitor POPULASI — PSI, ROC-AUC, approval, bad rate — semuanya OVERALL. Fairness monitoring memonitor apakah model ini tetap adil UNTUK SETIAP GRUP, di setiap periode. Keduanya bisa bergerak berlawanan arah: overall stabil sementara fairness memburuk.

**Nilai:** dashboard fairness per periode/grup — lima baris per grup (SEX, EDUCATION, AGE, MARRIAGE): approval rate, AIR, gap TPR, gap FPR/FNR, ECE/Brier per grup — masing-masing dengan n dan label matangnya. Aturan alert: AIR grup mana pun di bawah 0,80 selama 2 periode berturut-turut, ATAU gap TPR/FPR melewati 0,05 dan bertahan 2 periode — dan alert itu TIDAK PERNAH digabung dengan alert overall. Gambar dua panelnya: approval overall per chunk [waktu semu] berayun 25,17%–33,67% tanpa tren, sementara AIR SEX [simulasi] bergerak 0,869 → 0,710 → 0,830 → 0,910 → 0,940, dan chunk 2 (0,710) jatuh DI BAWAH 0,80.

**Baik/buruk:** dashboard ini bagus karena membuat ketidakadilan yang bergerak menjadi TERLIHAT. Buruk bila AIR per-periode dihitung tanpa n dan tanpa label matang — tulis keduanya di samping AIR-nya, atau jangan laporkan AIR itu sama sekali.

**Mitigasi:** tambahkan fairness monitoring SEBELUM model live — lima baris per grup, per periode; alert fairness terpisah dari alert overall; keputusan retrain/rollback yang dipicu alert fairness DITINJAU manusia.

---

## 13. Kapan Retrain — dan Kapan JANGAN Retrain

**Pemicu retraining [keputusan kebijakan lesson ini]:** RETRAIN bila SATU dari tiga ini terjadi — (1) PSI skor di atas 0,25 (geser besar, seperti S2 0,5811); (2) ROC-AUC turun lebih dari 0,02 dari baseline 0,7816 dalam 2 periode berturut-turut, ATAU PR-AUC turun lebih dari 0,03 dalam 2 periode berturut-turut; (3) ECE di atas 0,02 dalam 2 periode berturut-turut (kalibrasi rusak — threshold 0,10 tidak lagi bisa dipercaya, seperti S2 ECE 0,1003). Jadwal: tinjau metrik MINGGUAN, evaluasi retrain BULANAN, dan retrain TERJADWAL tiap kuartal bila tidak ada pemicu yang menyala. Retrain memakai data terbaru + protokol yang sama (stratified split, GBM + Platt, threshold dari biaya) dan dievaluasi dengan champion-challenger: model baru hanya menggantikan model lama bila mengalahkannya di data validation yang sama — bukan karena «lebih baru».

**Kapan JANGAN retrain.** JANGAN retrain karena SATU periode buruk (chunk 2: ROC-AUC 0,7428, PR-AUC 0,5137, bad rate 10,74% — lalu chunk 3 membaik; retrain di chunk 2 berarti membuang model bagus karena noise). JANGAN retrain saat label BELUM MATANG: label default butuh waktu — melatih ulang pada label yang belum matang berarti melatih pada label yang salah. JANGAN retrain saat penyebabnya BUG PIPELINE: bila PSI LIMIT_BAL melonjak karena satuan berubah atau kolom tertukar, perbaiki pipelinenya — retrain hanya akan mengabadikan bug itu ke dalam model. JANGAN retrain saat drift-nya SEMENTARA dan diketahui penyebabnya (misal program restrukturisasi satu bulan) — tunggu program selesai, atau sesuaikan threshold sementara.

**Nilai:** gerbang retrain yang kuantitatif mengubah retrain dari «perasaan» menjadi «keputusan». S2 [simulasi] lolos gerbang (1) PSI 0,5811 dan gerbang (3) ECE 0,1003 — retrain. S1 [simulasi] tidak lolos satu pun gerbang — jangan retrain, beri tahu bisnis soal approval yang naik. Chunk 2 tidak lolos gerbang (2) karena hanya 1 periode — jangan retrain. Tiga kasus, tiga jawaban, semuanya dari angka yang sama.

**Baik/buruk:** retrain terjadwal tiap kuartal bagus karena ia mencegah model menua diam-diam — decay bertahap yang tidak pernah melewati ambang harian tetap tertangkap kuartalan. Buruk bila retrain terjadwal dibaca sebagai «retrain apa pun yang terjadi»: retrain kuartalan tetap harus lewat champion-challenger. Model baru yang kalah dari champion di validation TIDAK naik ke produksi.

**Mitigasi:** setiap retrain dicatat — tanggal, pemicu yang menyala (nomor gerbangnya), data yang dipakai, skor champion vs challenger, dan siapa yang menyetujui.

---

## Lab 1: PSI Manual dari Tiga Bin UTILIZATION

Tiap bin menyumbang (actual − expected) × ln(actual / expected), lalu dijumlahkan. Tiga bin UTILIZATION (BILL_AMT1 / LIMIT_BAL), train vs test [notebook]: bin 1 (0–0,0012): expected 0,1000, actual 0,0977; bin 3 (0,0111–0,0407): expected 0,1000, actual 0,1072; bin 10 (0,9814–5,0): expected 0,1000, actual 0,1023.

Hasil [lab]: term_bin1=0.000054; term_bin3=0.000501; term_bin10=0.000052; partial_psi_3bins=0.0006. Ini PSI PARSIAL — hanya 3 dari 10 bin. PSI penuh UTILIZATION adalah 0,0013; ketiga bin ini menyumbang 0,0006 dari 0,0013 itu. Bin 3 adalah penyumbang terbesar: (0,1072 − 0,1000) × ln(0,1072 / 0,1000) = 0,000501.

## Lab 2: Putuskan Alert — Chunk 2, S1, dan S2

Aturan level alert [keputusan kebijakan lesson ini]: KRITIS (2) bila PSI skor di atas 0,25 ATAU (penurunan ROC-AUC lebih dari 0,02 DAN penurunan PR-AUC lebih dari 0,03) DALAM 2 PERIODE BERTURUT-TURUT; WASPADA (1) bila salah satu pemicu terpenuhi dalam 1 periode (penurunan ROC-AUC lebih dari 0,02 ATAU penurunan PR-AUC lebih dari 0,03 ATAU bad rate di atas 0,10 ATAU PSI skor di atas 0,10); AMAN (0) bila tidak satu pun terpenuhi. Keputusan retrain: retrain = 1 bila PSI skor di atas 0,25 ATAU (level KRITIS dan terkonfirmasi 2 periode berturut-turut).

Tiga kasus [notebook, kecuali S1/S2 yang [simulasi]]: Kasus A — chunk 2 [waktu semu]: ROC-AUC 0,7428 (baseline 0,7816), PR-AUC 0,5137 (baseline 0,5558), bad rate 0,1074, PSI skor antar-periode [waktu semu] 0,0161 (chunk 1 vs chunk 5 — pembanding stabil yang tersedia), terkonfirmasi 2 periode = TIDAK (chunk 3 membaik: ROC-AUC 0,8138). Kasus B — S1 [simulasi]: PSI skor 0,0358, ROC-AUC 0,7796, PR-AUC 0,5551, bad rate 0,0794, terkonfirmasi 2 periode = TIDAK. Kasus C — S2 [simulasi]: PSI skor 0,5811, ROC-AUC 0,7560, PR-AUC 0,4976, bad rate 0,0662, terkonfirmasi 2 periode = TIDAK (tapi gerbang PSI sudah cukup).

Hasil [lab]: roc_drop_A=0.0388; pr_drop_A=0.0421; alert_A=1; retrain_A=0; alert_B=0; retrain_B=0; psi_C=0.5811; pr_drop_C=0.0582; alert_C=2; retrain_C=1. Kasus A menyalakan alert WASPADA TAPI retrain-nya 0 — karena tidak terkonfirmasi 2 periode. Alert memanggilmu; gerbang yang memutuskan. Kasus C retrain-nya 1 walau tidak terkonfirmasi 2 periode — karena PSI 0,5811 melewati gerbang 1 sendirian.

## Lab 3: Monitoring Overall vs Per-Grup — Mana yang Berteriak Duluan?

Approval overall per chunk [waktu semu]: C1 26,92%, C2 27,17%, C3 25,17%, C4 33,67%, C5 29,58% — ayunan 8,50 poin persen tanpa tren. AIR SEX per chunk [simulasi]: 0,869, 0,710, 0,830, 0,910, 0,940 — ayunan 0,230, chunk 2 di bawah 0,80. Ayunan overall adalah NOISE periode-kecil; AIR 0,710 adalah FLAG yang harus diselidiki.

---

## Lab 4 (ringkas): Attribution Drift — Top-1 Berganti, Apa Artinya?

Baseline mean |SHAP| global (GBM mentah): PAY_MAX 0,4946; UTILIZATION 0,1574. Periode baru [simulasi]: PAY_MAX 0,2500; UTILIZATION 0,3100 — top-1 BERGANTI. Selisih: PAY_MAX −0,2446, UTILIZATION +0,1526. Top-1 yang berganti adalah DIAGNOSIS — selidiki, bukan bukti kausal.

---

## Guided Task di Colab

Notebook: colab/mlf-m75-guided-task.ipynb — flagship GBM + kalibrasi Platt, PSI per fitur dan PSI skor train vs test, metrik per chunk waktu semu, dan dua simulasi geser S1/S2 dengan checks. Tautan Colab: https://colab.research.google.com/drive/1Qz1fYeAS-IdY6DLPya78Y_ikQ6_36VAg

## Rangkuman

- Drift ada tiga: data drift (distribusi fitur berubah), prior shift (base rate berubah), concept drift (hubungan fitur-label berubah — hanya terdeteksi lewat decay performa, bukan PSI).
- PSI = jumlah (aktual − expected) × ln(aktual / expected) per bin, bin dari kuantil train; band: di bawah 0,1 stabil, 0,1–0,25 waspada, di atas 0,25 geser besar.
- PSI per fitur train vs test [notebook]: semua 16 fitur STABIL, tertinggi AGE 0,0029 — bukti split acak sehat, BUKAN bukti live aman. Pembanding yang dikunci: M2 G9 PSI 0,0104, juga stabil.
- PSI skor GBM terkalibrasi train vs test 0,0017 (GBM mentah 0,0024); skor rata-rata train 0,2214 vs test 0,2217 — alarm pertama monitoring, tanpa label.
- Waktu semu [waktu semu — urutan ID, BUKAN tanggal nyata], 5 chunk @ 1.200: ROC-AUC 0,7449 / 0,7428 / 0,8138 / 0,8041 / 0,8006 (rentang 0,0710); PR-AUC 0,4982 / 0,5137 / 0,6314 / 0,5985 / 0,5458 (rentang 0,1332); bad rate chunk 2 10,74%; PSI chunk 1 vs chunk 5 semuanya stabil (skor 0,0161, PAY_MEAN 0,0193).
- Decay diukur live vs baseline test (ROC-AUC 0,7816, PR-AUC 0,5558, ECE 0,0087, bad rate 6,67%) — bukan train vs test (gap 0,0685 itu overfitting). ECE train 0,0415 tidak boleh dipakai menilai kalibrasi.
- Simulasi [simulasi]: S1 limit ×1,30 → PSI skor 0,0358, ROC-AUC 0,7796 (turun 0,0020), approval 36,32% (naik 7,82 poin persen) — pantau bisnis, jangan retrain. S2 PAY +1 → PSI skor 0,5811, ROC-AUC 0,7560 (turun 0,0256), PR-AUC 0,4976 (turun 0,0582), approval 7,05% (anjlok 21,45 poin persen), ECE 0,1003 (11,5× baseline) — retrain.
- Alerting [keputusan kebijakan lesson ini]: PSI skor di atas 0,1 waspada / di atas 0,25 kritis; ROC-AUC turun lebih dari 0,02, PR-AUC turun lebih dari 0,03, bad rate di atas 10%, ECE di atas 0,02 — waspada 1 periode, kritis 2 periode. Dashboard minimal: PSI skor harian, ROC-AUC/PR-AUC + approval/bad rate per periode, skor rata-rata + ECE, PSI 5 fitur kunci mingguan — dibaca tiap pagi oleh analis, mingguan oleh risk manager.
- Retrain: PSI skor di atas 0,25, atau ROC-AUC turun lebih dari 0,02 / PR-AUC turun lebih dari 0,03 dalam 2 periode, atau ECE di atas 0,02 dalam 2 periode; retrain terjadwal tiap kuartal; champion-challenger sebelum naik produksi. JANGAN retrain: 1 periode buruk, label belum matang, bug pipeline, drift sementara yang diketahui.
- Attribution drift [simulasi]: mean |SHAP| PAY_MAX 0,4946 → 0,2500, UTILIZATION 0,1574 → 0,3100 — top-1 berganti; drift atribusi adalah diagnosis, bukan bukti kausal.
- Matured cohort: label baru tersedia setelah jendela observasi 1 bulan; metrik berlabel hanya untuk cohort matang; periode terbaru hanya dimonitor tanpa label.
- Fairness monitoring: dashboard per periode/grup dengan alert fairness terpisah; AIR SEX [simulasi] 0,710 di chunk 2 — overall diam, fairness bergerak.
- Lab: PSI parsial 3 bin UTILIZATION = 0,0006 (dari PSI penuh 0,0013); alert chunk 2 = waspada (1) tapi retrain = 0; S1 aman (0) retrain 0; S2 kritis (2) retrain 1.

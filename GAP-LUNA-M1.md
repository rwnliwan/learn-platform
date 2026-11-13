# Gap Analysis Luna — Modul 1 "Machine Learning Finance"

- **Analis:** Luna via Kelontong AI (`gpt-6-luna`, streaming, max-tokens 8000) — kursi digging/gap analysis
- **Tanggal:** 12 Nov 2026
- **Materi yang dianalisis:** spec `SPEC-MLF-M1.md` + 4 lesson ringkas `content/mlf1-tiga-tipe-satu-alur.md`, `mlf2-membaca-angka.md`, `mlf3-evaluasi-model.md`, `mlf4-overfitting-underfitting.md`
- **Panggilan:** satu panggilan, selesai utuh (tidak terpotong, tidak perlu continuation, tidak perlu fallback). Output mentah: `/tmp/luna_gap_raw.md`
- **Metode:** cakupan vs spec §3.1–§3.2, kesiapan menuju M2, ide materi tambahan konkret, cek overlap L0/M2–M9/track lain
- **Tidak ada file lesson yang diedit.**

## Caveat penting (catatan agen — baca dulu)

Luna bekerja dari **versi ringkas `.md`**, bukan file TS penuh. Satu klaimnya sudah terbukti artefak ringkasan saat dicek ke TS: **G26 (formula jarak MLF1)** — TS penuh justru menghubungkan formula secara eksplisit ke Lab 1 (`formulaNote`: "1-NN memprediksi label tetangga terdekat menurut jarak ini"; prose Lab 1 menjelaskan 1-NN via jarak Euclidean; tugas + kuis memakainya). Karena itu, semua temuan bertanda "TIPIS / hanya disebut" di bawah ini **wajib dicek ulang ke file TS penuh sebelum di-fill** — sebagian bisa jadi sudah ada di TS dan hanya hilang saat diringkas ke `.md`. Temuan bertanda "HILANG" (tidak ada di `.md` maupun, sejauh yang bisa dicek, di TS) lebih dapat dipercaya.

## Ringkasan eksekutif

M1 memenuhi kerangka yang dijanjikan: tiga tipe ML, workflow end-to-end, statistik baca hasil, metrik evaluasi, diagnosis overfitting — objectives (a)–(e) tersentuh. Namun ada gap besar sebelum pembelajar masuk M2:

1. **Framing masalah kredit belum formal**: target, unit observasi, observation/performance window, label default, dan leakage belum diajarkan.
2. **Probabilitas kredit belum dibedakan dari skor/ranking**: akan menyulitkan kalibrasi, PD, dan Expected Loss.
3. **Threshold bisnis ada, tetapi decision rule belum lengkap**: hubungan threshold–approval rate–FN/FP–profit/risk appetite belum ada.
4. **Evaluasi belum membedakan random split vs temporal/vintage split** untuk kredit.
5. **Konsep domain M2 hampir seluruhnya belum ada**: PD/LGD/EAD, scorecard, WoE/IV, vintage, roll-rate, IFRS 9/ECL, reject inference.
6. Beberapa angka/contoh berpotensi membentuk miskonsepsi: band ROC-AUC yang terbaca universal, Brier tanpa terjemahan numerik, dan angka notebook vs lab vs ilustrasi yang tidak dilabeli.

**Hitungan temuan:** 7 must-add, 19 should-add (1 di antaranya ter-flag artefak ringkasan, lihat G26), 4 nice-to-have — total 30.

---

## Daftar gap

### MUST-ADD — menghambat pemahaman M2 bila tidak diisi

#### G1. Definisi target default & temporal framing — MLF1 §4 "Workflow End-to-End"
- **Yang hilang:** Framing hanya "siapa boleh diberi kredit?" — belum ada: unit observasi (nasabah/aplikasi/rekening), definisi label default pada horizon tertentu, kapan fitur boleh diambil, kapan outcome diamati, observation window vs performance window, aplikasi yang belum cukup lama diamati, beda "default" vs "late payment" vs "fraud" vs "bad account".
- **Mengapa penting:** Logistic regression dan scorecard tidak bisa dipahami bila target `default` belum didefinisikan secara temporal. Prasyarat untuk PD, temporal validation, dan pencegahan leakage.
- **Tambahan konkret:** Diagram tiga waktu (tanggal aplikasi → observation window fitur → performance window default) di §4 sebelum pemetaan notebook. Pakai dataset kanonis 30.000 baris / test 6.000; jangan karang horizon — labeli horizon sebagai hal yang harus didefinisikan. Kuis: "Saldo tunggakan setelah tanggal aplikasi boleh jadi fitur?" → tidak, informasi masa depan.

#### G2. Score vs probability vs PD vs decision — MLF1 §4 Workflow + MLF3 §4 "Kalibrasi dan Brier Score"
- **Yang hilang:** MLF1 menyebut skor LR/GBM dan threshold 0,10 tanpa membedakan: (1) skor ranking, (2) probabilitas default, (3) keputusan approve/review/reject. Vocabulary PD, calibrated probability, threshold, approval policy belum dibangun.
- **Mengapa penting:** M2 butuh logistic regression sebagai penghasil probabilitas, PD sebagai probabilitas bermakna, kalibrasi, threshold operasional, dan Expected Loss — semuanya bertumpu pada pembedaan ini.
- **Tambahan konkret:** Pipeline score → probability → threshold 0,10 → approve/review/reject → biaya FN/FP → keputusan bisnis (di MLF3 §1, pakai confusion matrix yang sudah ada: 0,5 → TP 700/FP 400/FN 627/TN 4.273; 0,10 → TP 1.080/FP 1.420/FN 247/TN 3.253). Tekankan: model tidak otomatis menghasilkan keputusan.

#### G3. Leakage & temporal validation — MLF1 §4 Workflow + MLF3 §5 "Cross-Validation" + MLF4 §1 "Diagnosis: Gap Train-Test"
- **Yang hilang:** M1 baru mengajarkan test-set separation. Belum ada: contoh leakage fitur (saldo/status tunggakan setelah tanggal aplikasi, fitur yang baru tersedia setelah kredit disetujui, imputasi/scaling sebelum split, outcome masa depan dalam fitur, random split pada data berwaktu), dan beda leakage vs overfitting vs distribution shift vs sampling noise. MLF3 menyebut "CV acak buruk untuk data berwaktu" tanpa contoh alur waktu kredit (train bulan awal → validasi bulan berikut → test bulan akhir; vintage/macro regime membuat random CV terlalu optimistis).
- **Mengapa penting:** Tanpa ini pembelajar bisa membangun model kredit dengan ROC-AUC tinggi tetapi tidak valid. Leakage adalah risiko utama credit scoring — dan gap train-test kecil TIDAK membuktikan bebas leakage.
- **Tambahan konkret:** (a) Subsection baru MLF1 "Leakage sebelum model dilatih" dengan contoh-contoh di atas. (b) Figure dua panel di MLF4 §1: Panel A overfitting (train 0,8469 vs test 0,7823, gap 0,0646); Panel B leakage (train dan test sama-sama tampak tinggi karena fitur masa depan) — konseptual, tanpa angka baru. Kuis: "Gap train-test kecil selalu berarti model aman?" → tidak. (c) Figure temporal validation di MLF3 §5 (random CV vs masa lalu → train / berikut → validation / akhir → test), memakai test set kanonis 6.000 dari 30.000 sebagai pengingat bahwa split saja belum menjamin validitas temporal.

#### G4. PD / LGD / EAD + Expected Loss sebagai keputusan — MLF1 Mini-case "Tiga Pelamar"
- **Yang hilang:** Mini-case sudah memakai rumus EL = PD × LGD × exposure (PD ilustrasi 0,5/0,1; LGD 45%; EAD Rp10.000.000; EL Rp2.250.000/Rp450.000) tetapi ketiga komponen tidak pernah didefinisikan secara sistematis; tidak dibedakan margin, loss, dan capital/risk appetite.
- **Mengapa penting:** Ini gap paling langsung menuju M2 — Expected Loss adalah bahasa keputusan kredit.
- **Tambahan konkret:** Perkuat mini-case yang sama (jangan tambah domain baru): definisi eksplisit PD = probability of default, LGD = loss given default, EAD = exposure at default, EL = PD × LGD × EAD, dengan angka yang sudah ada. Tandai PD, LGD, dan margin sebagai **ilustrasi**, bukan angka notebook kanonis. Pengajaran penuh (pengukuran, analisis kredit mendalam) tetap di M2.

#### G5. Scorecard & WoE/IV preview — MLF1 §1 "Supervised Learning" (atau section penutup "Peta M2")
- **Yang hilang:** Tidak ada preview tentang binning, monotonic relationship, Weight of Evidence, Information Value, dan interpretability scorecard.
- **Mengapa penting:** Tanpa peta ini, M2 akan sulit — dan pembelajar bisa mengira credit scoring hanya berarti memilih model dengan AUC terbesar.
- **Tambahan konkret:** Kartu konsep ringkas (raw feature → bin → WoE → IV → scorecard point → keputusan). Jangan ajarkan formula penuh; cukup jelaskan bahwa M2 akan mengubah fitur menjadi bin yang lebih stabil dan dapat dijelaskan.

#### G6. Reject inference & selection bias — MLF1 §1 "Supervised Learning"
- **Yang hilang:** MLF1 menyebut "model hanya melihat pinjaman yang disetujui" — bagus sebagai pengenalan, tetapi konsekuensinya belum dijelaskan: label default hanya tersedia untuk approved applicants; rejected applicants tidak punya outcome; performa pada approved population belum tentu berlaku pada rejected population.
- **Mengapa penting:** Ini USP M2 (reject inference: extrapolation, reweighting, fuzzy augmentation) — harus dipersiapkan sejak M1.
- **Tambahan konkret:** Paragraf lanjutan tepat setelah kalimat selection bias di §1, plus peta ringkas di section penutup MLF1 bersama G5. Jangan ajarkan teknik penuh.

#### G7. AUC = ranking, bukan kualitas probabilitas — MLF3 §2 "ROC-AUC" + §4 "Kalibrasi dan Brier Score"
- **Yang hilang:** M1 mengajarkan ROC-AUC tanpa menekankan bahwa AUC terutama mengukur ranking, bukan kualitas probabilitas.
- **Mengapa penting:** Akan membingungkan ketika M2 menghubungkan AUC, kalibrasi, dan PD.
- **Tambahan konkret:** Kuis konsep: "Model dapat memiliki ROC-AUC tinggi tetapi probabilitas tidak terkalibrasi. Benar atau salah?" — feedback: AUC mengukur ranking; Brier/reliability mengukur kualitas probabilitas; PD/Expected Loss butuh probabilitas yang dapat dipercaya. (Lihat juga G14, G15.)

---

### SHOULD-ADD — memperkuat fondasi

#### G8. Logistic regression secara konseptual — MLF1 §1 "Supervised Learning"
- **Yang hilang:** LR disebut dengan AUC 0,7426 tanpa penjelasan: output sigmoid, log-odds, koefisien sebagai arah hubungan, mengapa LR cocok untuk binary default.
- **Tambahan konkret:** Preview minimal (satu paragraf + figure sigmoid); pengajaran penuh tetap di M2.

#### G9. Klasifikasi vs regresi — MLF1 §1 "Supervised Learning"
- **Yang hilang:** Objective (a) meminta tipe ML, tetapi M1 hanya memberi supervised classification secara konkret. Belum ada contoh regresi (loss amount, recovery rate, exposure, return/volatilitas).
- **Tambahan konkret:** Satu subsection singkat dengan contoh regresi finance.

#### G10. Class imbalance vs calibration — MLF3 §3 "PR-AUC vs Base Rate"
- **Yang hilang:** Base rate dan PR-AUC sudah dijelaskan, tetapi belum dibedakan: class imbalance, probability calibration, resampling, class weight, threshold adjustment.
- **Tambahan konkret:** Paragraf pembeda singkat; M2 yang memakai saat membandingkan LR, tree, GBM.

#### G11. Stability by segment & time — MLF3 §5 "Cross-Validation" (preview)
- **Yang hilang:** Metrik agregat dapat menyembunyikan performa berbeda menurut cohort, vintage, risk segment, periode waktu.
- **Tambahan konkret:** Preview satu paragraf; analisis penuh (vintage analysis) di M2, slice evaluation di M7.

#### G12. Roll-rate & state transition preview — MLF1 (peta M2 / mini-case tambahan)
- **Yang hilang:** Tidak ada preview migrasi status (current → 1–30 DPD → 31–60 DPD → 61–90 DPD → default).
- **Tambahan konkret:** Peta konsep singkat; pengajaran penuh di M2.

#### G13. Band ROC-AUC dilabeli heuristik, bukan standar universal — MLF3 §2 "ROC-AUC"
- **Yang hilang:** Band "0,5 acak; 0,7–0,8 lumayan; 0,8–0,9 bagus; > 0,9 curigai leakage" mudah dibaca sebagai standar universal. Kualitas AUC bergantung pada use case, horizon, biaya keputusan, populasi, stabilitas, acceptance rate.
- **Tambahan konkret:** Labeli bands sebagai heuristik untuk konteks ini; hubungkan dengan threshold dan business outcome.

#### G14. Brier: discrimination vs calibration + tautan PD/EL — MLF3 §4 "Kalibrasi dan Brier Score"
- **Yang hilang:** "Makin kecil makin baik" tanpa interpretasi numerik apa arti 0,1342 vs 0,1427; belum dijelaskan Brier dipengaruhi prevalensi dan tidak boleh dibandingkan lintas populasi sembarangan; belum dibedakan discrimination vs calibration; belum dijelaskan ROC-AUC tinggi tidak menjamin probabilitas terkalibrasi.
- **Tambahan konkret:** Paragraf pembeda + tautan ke pemakaian PD dan Expected Loss di M2.

#### G15. Worked reading reliability diagram — MLF3 §4 "Kalibrasi dan Brier Score"
- **Yang hilang:** Ada 4 bin kalibrasi tetapi belum ada worked reading: apakah bin 0,850 vs observed 0,667 berarti overprediction; mengapa kalibrasi penting sebelum mengalikan PD × LGD × EAD; risiko keputusan bila model overconfident.
- **Tambahan konkret:** Satu paragraf worked reading memakai bin yang sudah ada.

#### G16. Threshold → approval rate & policy — MLF3 §1 "Confusion Matrix" / mini-case
- **Yang hilang:** Threshold 0,5 vs 0,10 menunjukkan perubahan confusion matrix, tetapi belum menunjukkan: berapa banyak aplikasi yang approve/review/reject, bagaimana threshold memengaruhi portfolio mix, beda threshold vs policy rule, mengapa threshold bukan angka "benar" universal.
- **Tambahan konkret:** Tabel approval/review/reject per threshold + satu paragraf policy. (Berkaitan dengan G2.)

#### G17. Label asal angka: [notebook] / [lab] / [ilustrasi] — MLF3 di seluruh lesson
- **Yang hilang:** Angka lab, mini-case, notebook, dan biaya NT$ tercampur tanpa label — mis. "threshold 0,10 hemat 45,2% vs 0,5 dan 59,8% vs approve-all" (notebook) berdampingan dengan "hemat 39,7%" (mini-case). Spec mensyaratkan angka narasi punya derivasi.
- **Tambahan konkret:** Setiap angka diberi label asal + derivasi singkat. Ini disiplin penulisan, bukan materi baru.

#### G18. Underfitting ≠ performa rendah — MLF4 §2 "Underfitting"
- **Yang hilang:** MLF4 menyebut LR 0,7426 vs GBM 0,7823 sebagai baseline yang "bisa diterima", tetapi AUC 0,7426 bisa saja model yang sesuai kebutuhan bisnis, bukan underfit. Performa rendah tidak otomatis berarti underfitting.
- **Tambahan konkret:** Satu paragraf: bandingkan dengan baseline, feature set, business requirement, dan validation stability sebelum menyebut underfitting.

#### G19. CI untuk metrik model / bootstrap teaser — MLF2 §3 "Interval Kepercayaan (Wilson)"
- **Yang hilang:** CI hanya diterapkan pada default rate (Wilson [0,2108, 0,2318]). Belum ada contoh ketidakpastian pada ROC-AUC, PR-AUC, recall/precision, atau perbandingan LR vs GBM — selisih 0,0397 tampak pasti padahal belum menunjukkan uncertainty/significance.
- **Tambahan konkret:** Satu paragraf teaser: AUC 0,7823 adalah estimasi dari test set, bukan konstanta populasi. Prosedur bootstrap penuh tetap di M9.

#### G20. Bayes → expected-loss reasoning — MLF2 §2 "Base Rate dan Bayes (PPV)"
- **Yang hilang:** PPV sudah baik, tetapi hubungan base rate → probabilitas default/fraud → biaya FN/FP → expected loss → threshold belum dibuat.
- **Tambahan konkret:** Satu paragraf penghubung memakai mini-case yang sama dengan MLF1/MLF3 (jangan tambah domain baru).

#### G21. Korelasi → feature redundancy & scorecard — MLF2 §4 "Korelasi dan Signifikansi"
- **Yang hilang:** Korelasi 0,899 dibahas sebagai bukan-bukti-kausal, tetapi implikasinya belum dibahas: fitur redundant, multicollinearity pada logistic regression, stabilitas koefisien, pemilihan fitur scorecard.
- **Tambahan konkret:** Satu paragraf pengantar; feature selection dan WoE/IV tetap di M2.

#### G22. Tabel mitigasi berdasarkan model — MLF4 §4 "Overfitting" (Mitigasi)
- **Yang hilang:** Regularisasi hanya ridge pada polynomial regression (λ=1,0: test MSE 0,0531 → 0,0425). Belum dijelaskan mitigasi berbeda menurut model: LR (L1/L2), tree/GBM (depth, learning rate, jumlah estimator, early stopping), data (leakage control, temporal validation).
- **Tambahan konkret:** Tabel ringkas (masalah → mitigasi) tanpa mengajarkan tuning mendalam — itu scope M6.

#### G23. Model comparison card — MLF3, setelah §4 "Kalibrasi dan Brier Score"
- **Yang hilang:** Angka kanonis tersebar di beberapa section; belum ada satu kartu perbandingan.
- **Tambahan konkret:** Tabel LR vs GBM vs GBM terkalibrasi (ROC-AUC 0,7426/0,7823/0,7816; PR-AUC 0,5049/0,5597/0,5558; Brier 0,1427/0,1342/0,1345) + pertanyaan: model mana ranking terbaik? Brier terbaik? Apakah GBM terkalibrasi otomatis lebih baik di semua metrik?

#### G24. Kuis "AUC tinggi, probabilitas buruk" — MLF3 §2/§4
- **Yang hilang:** Lihat G7. (Item ini adalah bentuk kuis dari G7; bila G7 diisi, kuis ini bagian dari pengisiannya.)
- **Tambahan konkret:** Kuis seperti dirumuskan di G7.

#### G25. Boundary box scope MLF2 vs L0.3 — MLF2 §1 "Mean vs Median"
- **Yang hilang:** MLF2 menyebut "transformasi log untuk menarik ekor" — L0.2/L0.3 akan mengajarkan distribusi, QQ plot, skewness/kurtosis, IQR/z-score, log-transform, outlier secara penuh. Tanpa batas eksplisit, MLF2 bisa berubah menjadi pengulangan L0.3.
- **Tambahan konkret:** Boundary box: "M1 membaca implikasi; L0 mengajarkan diagnosis distribusi dan transformasi secara mendalam." Jangan tambah QQ plot, Shapiro-Wilk, IQR, z-score mendalam ke MLF2.

#### G26. Formula jarak: fungsi dalam supervised learning — MLF1 §1 — ⚠️ TER-FLAG ARTEFAK RINGKASAN
- **Klaim Luna:** Formula jarak Euclidean ditampilkan tanpa dihubungkan eksplisit ke Lab 1-NN atau keterbatasan distance-based method (skala fitur, fitur kategorikal, outlier, standardisasi).
- **Hasil cek agen ke TS penuh:** Klaim ini **tidak berlaku untuk lesson web** — TS `mlf1` menghubungkan formula ke Lab 1 secara eksplisit (`formulaNote` baris 54; prose Lab 1 baris 289; tugas lab + kuis memakai jarak). Yang hilang di `.md` hanyalah penjelasannya saat diringkas.
- **Tindakan:** Verifikasi induk sebelum fill. Kemungkinan besar **tidak ada aksi** pada lesson web; paling jauh tambahkan satu kalimat penghubung di `.md` bila dianggap perlu. Keterbatasan distance-based method (skala, kategorikal, outlier, standardisasi) memang belum diajarkan — itu bisa masuk sebagai satu kalimat mitigasi bila diinginkan.

---

### NICE-TO-HAVE

#### G27. Explainability & reason-code preview — MLF3 mini-case threshold
- **Yang hilang:** Mini-case menyebut "adverse-action reason codes" tanpa menjelaskan apa itu reason code.
- **Tambahan konkret:** Satu panel: "Jika aplikasi ditolak, keputusan perlu dapat dijelaskan melalui alasan yang valid." Jangan ajarkan SHAP/explainability penuh — itu M7.

#### G28. Fairness & approval-bias warning — MLF1
- **Yang hilang:** Selection bias sudah disebut, tetapi fairness antar kelompok belum.
- **Tambahan konkret:** Satu kalimat warning; audit fairness penuh tetap di M7.

#### G29. Market-risk temporal framing — MLF1 §3 "Reinforcement Learning"
- **Yang hilang:** Trading dan reward disebut, tetapi belum ditunjukkan mengapa data time series tidak boleh diperlakukan seperti data i.i.d.
- **Tambahan konkret:** Satu paragraf pengantar; pendalaman di M4 dan M9.

#### G30. Domain comparison matrix — MLF1, setelah workflow
- **Yang hilang:** MLF1 memakai kredit, fraud, dan trading sebagai ilustrasi tipe ML, tetapi belum membandingkan ketiga domain dalam satu decision table (target, risiko keputusan, validasi).
- **Tambahan konkret:** Tabel: Credit (target default; risiko loss & approval; validasi temporal/cohort) | Fraud (target suspicious/fraud; risiko false positive & triase; validasi alert investigation) | Market risk (target return/loss/risk; risiko drawdown & regime; validasi time-series/walk-forward). Memperjelas USP MLF vs MLE.

---

## Cek overlap / duplikasi

### Dengan L0 (prasyarat, dibangun setelah M1)
- **Distribusi/skewness/outlier/transformasi:** MLF2 §1 menyebut log-transform — L0.2/L0.3 mengajarkan penuh (mean vs median, skewness/kurtosis, QQ plot, IQR/z-score, log-transform). Batas: MLF2 membaca implikasi terhadap hasil model; L0.3 diagnosis + preprocessing metodologis. Jangan tambah QQ plot, Shapiro-Wilk, IQR, z-score mendalam ke MLF2. (Lihat G25.)
- **Data cleaning, imputasi, encoding, wrangling:** MLF1 sudah benar hanya merujuk L0 ("bersihkan label dulu (L0)"). Jangan ajarkan prosedur cleaning/missing/encoding/merge di M1.
- **A/B testing:** Tidak muncul substantif di M1. Tidak ada overlap.

### Dengan M2 (credit scoring)
- MLF3 metrik tetap ringkasan + angka notebook + keputusan threshold; jangan perluas teori metrik (ECE, Wilson, McNemar, slice evaluation dari MLE4) atau scorecard penuh.
- LR/GBM di MLF1/MLF3 hanya sebagai model pembanding dengan angka kanonis — jangan tambah derivasi gradient logistic regression, hyperparameter tree, detail boosting, atau implementasi model dari nol.
- Kalibrasi: MLF3 pengantar Brier + reliability; pendalaman kalibrasi model kredit tetap di M2.
- PD/LGD/EAD: M1 definisi + satu worked example (G4); pengukuran dan analisis kredit mendalam di M2; stress/scenario dan validasi di M9.
- WoE/IV, vintage, roll-rate, IFRS 9/ECL, reject inference: belum ada pengajaran substansial di M1 — cukup peta konsep + motivasi (G5, G6, G12); pengajaran penuh di M2.

### Dengan M3–M9
- **M3 Fraud:** MLF1 anomaly/z-score dan PPV fraud boleh sebagai pengantar. Jangan tambah clustering fraud penuh, graph/network features, velocity analysis, Benford's law, alert triage economics mendalam.
- **M4 Market risk:** MLF1 RL/trading hanya pengenalan. Jangan tambah VaR, Expected Shortfall, GARCH, Greeks, regime analysis, correlation-breakdown stress test.
- **M5 Optimization:** Tidak ada overlap berarti; reward function MLF1 bukan pengajaran optimasi.
- **M6 Tuning:** MLF4 boleh memakai CV + pemilihan derajat polynomial sebagai fondasi diagnosis; jangan tambah nested CV, pencarian hyperparameter ekstensif, uji perbandingan model formal.
- **M7 Fairness/explainability/monitoring:** MLF1 menyebut monitoring, MLF3 menyebut reason codes — pertahankan sebagai preview; jangan tambah SHAP, fairness audit, drift metrics, production monitoring.
- **M8 Model risk/deployment:** Tidak ada pengajaran penuh di M1; pertahankan hanya prinsip governance + monitoring.
- **M9 Simulation/backtesting/validation:** MLF4 menyebut backtest trading (Sharpe 4,2 → −18% live) hanya sebagai cerita pembuka — jangan kembangkan backtesting atau CI bootstrap di M1. Temporal validation MLF3 cukup sebagai prasyarat ringan.

### Dengan track lain
- **MLE4 (Evaluasi di Luar Akurasi):** MLF3 sudah sesuai batas spec bila tetap ringkasan + angka notebook. Jangan salin ECE mendalam, Wilson/McNemar, slice evaluation, teori confusion-matrix panjang.
- **MLE15 (ML Klasik & Model Selection):** MLF4 tidak mengulang teori bias-variance; fokus tetap diagnosis gap nyata 0,0646 + learning curve + mitigasi finance.
- **MLE25, MLE23, MLE12, MLE19:** MLF1 menyebut unsupervised, matematika jarak, fairness, explainability sebagai peta — jangan ajarkan ulang materi inti track-track tersebut.
- **CR46 dan FR7:** M1 adalah fondasi sebelum credit scoring dan fraud — contoh kredit/fraud bukan duplikasi selama tidak masuk ke scorecard penuh, XGBoost/GBM mendalam, walk-forward credit modeling, atau supervised fraud implementation.
- **Track A (Statistika):** MLF2 memakai statistik sebagai alat baca hasil model — jangan ajarkan ulang teori statistik umum (distribusi formal, inferensi lengkap, hypothesis testing mendalam).

---

## Top 5 must-add (terurut)

1. **Definisi target default dan temporal framing** — MLF1 "Workflow End-to-End": observation window, performance window, label default, unit observasi. (G1)
2. **Score / probability / PD / threshold / decision pipeline** — MLF1 + MLF3: bedakan ranking, probabilitas, PD, threshold 0,10, dan keputusan approve/review/reject. (G2)
3. **Leakage vs overfitting + temporal validation** — MLF3 "Cross-Validation" + MLF4 "Diagnosis: Gap Train-Test": gap kecil tidak membuktikan bebas leakage; angka GBM 0,8469 vs 0,7823, gap 0,0646. (G3)
4. **Worked example PD × LGD × EAD = Expected Loss** — MLF1 mini-case: definisi komponen + angka yang sudah ada (LGD 45%, EAD ilustrasi Rp10.000.000, PD ilustrasi 0,5/0,1, EL Rp2.250.000/Rp450.000). (G4)
5. **Preview credit-scoring concepts yang menjadi USP M2** — MLF1 "Supervised Learning" / section penutup: peta ringkas scorecard, WoE/IV, vintage, roll-rate, dan terutama reject inference; motivasi + hubungan dengan selection bias, tanpa teknik penuh. (G5 + G6)

# SPEC — Track "Machine Learning Finance" (MLF)

> Track baru di Learn platform. Dibuat 2026-11-12 atas instruksi Septian.
> Modul 1 = pilot (build ini). L0 + Modul 2–9 = outline, dibangun belakangan (L0 dibangun SETELAH M1).
> Standar: `WORKFLOW.md` v2.0 (spec-first, QA per lesson). TIDAK deploy sebelum verifikasi + ACC Septian.

## 1. Track

- **Nama track:** Machine Learning Finance
- **Slug prefix:** `mlf` (lesson: `mlf1-...`, `mlf2-...`, ...)
- **Registry:** `src/app/v2/lib/reg-mlf.ts` → `REG_MLF`, didaftarkan di `src/app/v2/lib/registry.ts`
- **Audiens:** Septian — pemula ML (dasar WQU: Python, pandas, statistik dasar), jalur Data Analyst / financial risk (fraud, credit, market risk). Narasi Indonesia, istilah teknis English, kode English + penjelasan Indonesia.
- **Prinsip pembeda vs track MLE (Machine Learning Engineer):** MLE = engineering produksi generik (serving, CI/CD, scaling, RAG, LLM serving). MLF = **keputusan finance**: setiap konsep diajarkan lewat credit / fraud / market risk, dengan angka dan contoh dari proyek nyata Septian (notebook credit scoring). MLF bukan duplikat MLE — ia jembatan "ML untuk analis risiko".

## 2. Outline track (L0 + 9 modul)

**L0 "Data Foundations" = prasyarat M1** (M1 mengasumsikan L0 selesai). Dibangun SETELAH M1. Standar Learn v2 sama (narasi ID, istilah EN, lab Pyodide, kuis, guided task di Colab). Worked examples L0 memakai ulang langkah cleaning notebook credit scoring bila relevan.

| Modul | Judul | Isi (ringkas) |
|---|---|---|
| **L0** | **Data Foundations (prasyarat M1)** | 5 lesson: L0.1 Data Cleaning — kapan hapus, kapan perbaiki: aturan keputusan untuk missing, duplikat, tipe salah, inkonsistensi. L0.2 Missing Data & Imputasi — mean vs median (mean kalau distribusi simetris, median kalau skew/ada outlier), kapan keduanya salah, teknik lain (mode, forward-fill, model-based), MCAR/MAR/MNAR. L0.3 Distribusi & Outlier — cek normal atau tidak (QQ plot, Shapiro-Wilk, skewness/kurtosis), deteksi outlier (IQR, z-score), kapan transformasi (log, dsb.). L0.4 Data Wrangling — reshape, merge/join, encoding, tipe data, dari raw ke analysis-ready. L0.5 A/B Testing — dari hipotesis sampai keputusan: p-value, signifikansi, power & ukuran sampel, jebakan (peeking, multiple testing). |
| **M1** | **Foundations — ML end-to-end in finance** | (build ini — lihat §3) |
| M2 | Supervised / credit scoring | Klasifikasi & regresi, logistic regression, tree/GBM, scorecard, kalibrasi, threshold bisnis — pendalaman dari notebook credit scoring.<br>Analisis domain kredit: PD / LGD / EAD dan Expected Loss = PD × LGD × EAD (trio Basel); scorecard via Weight of Evidence & Information Value; vintage analysis (kohort per bulan origination); roll-rate analysis (migrasi antar bucket keterlambatan); IFRS 9 staging + ECL.<br>⭐ USP: Reject inference — model hanya pernah melihat pinjaman yang DISETUJUI, jadi data latih punya selection bias. Ajarkan reject inference (extrapolation, reweighting, fuzzy augmentation): menginferensi apa yang akan terjadi pada pelamar yang ditolak. Jarang diajarkan di kursus, langsung relevan dengan credit scoring nyata. (USP notebook yang sudah ada: stress test, policy simulator, fairness audit, reason codes, counterfactual.) |
| M3 | Unsupervised / fraud | Clustering, anomaly detection, deteksi fraud tanpa label; semi-supervised.<br>Analisis domain fraud: network / link analysis (graf akun, device, IP — fraud ring, mule account); velocity analysis (lonjakan frekuensi transaksi); Benford's law (analisis digit pertama); behavioral profiling & peer-group analysis; alert triage & false-positive analysis (catatan: Siskamling Septian adalah sistem triase nyata — jadikan referensi).<br>⭐ USP: (1) Graph features di dalam model — pakai fitur jaringan (degree, shared device/IP, community) sebagai input model, bukan sekadar analisis terpisah: menggabungkan link analysis dengan supervised ML. (2) Alert triage economics — prioritaskan antrean triase berdasarkan expected value (biaya false positive vs fraud yang terlewat), bukan sekadar skor model: lapisan bisnis yang kebanyakan kursus fraud lewatkan. Rujuk Siskamling Septian sebagai sistem triase nyata. |
| M4 | Random Forest & ensembles / market risk & trading | RF, bagging, boosting, stacking; aplikasi market risk & sinyal trading; validasi time-series.<br>Analisis domain market risk: VaR trio (parametrik, historis, Monte Carlo) + Expected Shortfall; VaR backtesting (Kupiec); Greeks & sensitivitas (derivatif); volatility modelling (EWMA, GARCH); dekomposisi risiko portofolio (risk contribution, marginal VaR); drawdown dan regime analysis.<br>⭐ USP: (1) Correlation-breakdown stress test — dalam krisis korelasi mendekati 1 dan diversifikasi hilang: stress-test dengan mengguncang korelasi, bukan sekadar return. (2) Regime-conditional VaR — VaR yang berubah mengikuti regime pasar (GARCH + regime switching), karena VaR statis meremehkan risiko tepat saat paling penting. |
| **M5** | **Optimization & portfolio construction** | Teori optimasi — apa itu optimasi, gradient descent, constrained optimization — diterapkan ke Markowitz mean-variance, efficient frontier, risk parity, intro Black-Litterman, dengan code. Catatan: optimasi juga menggerakkan training ML itu sendiri dan hyperparameter tuning. |
| M6 | Tuning & model selection | Hyperparameter tuning, cross-validation lanjutan, nested CV, perbandingan model (McNemar dkk.) |
| M7 | Fairness / explainability / monitoring | Audit bias, SHAP/reason codes, drift & monitoring produksi |
| M8 | Model risk & deployment | Validasi model (SR 11-7), dokumentasi model, deployment & governance |
| **M9** | **Simulation, Backtesting & Validation in Finance** | Monte Carlo simulation, scenario analysis, stress testing (teori + praktik bank — notebook credit scoring sudah mengimplementasikannya), backtesting & walk-forward validation, sensitivity analysis, historical simulation, bootstrap / resampling untuk confidence interval metrik, VaR & Expected Shortfall (CVaR). Catatan: Monte Carlo juga dipakai di M5 (simulasi portofolio); regime analysis di M4. |

## 3. Modul 1 — Foundations (build ini)

### 3.1 Learning objectives

Setelah M1, Septian bisa:
- (a) Menyebutkan tipe-tipe ML dan penggunaannya di finance.
- (b) Menjelaskan workflow ML end-to-end (framing → data → fitur → model → evaluasi → threshold → monitoring).
- (c) Membaca nilai-nilai statistik dalam hasil model (distribusi, base rate, CI, p-value vs effect size).
- (d) Mengevaluasi model dengan metrik yang tepat + nilai acuannya.
- (e) Mendiagnosis dan memitigasi overfitting / underfitting.

### 3.2 Pemetaan objective → lesson

| Lesson | Judul | Objective | Durasi |
|---|---|---|---|
| MLF1 | ML di Finance: Tiga Tipe, Satu Alur Kerja | (a), (b) | 55 mnt |
| MLF2 | Membaca Angka: Statistik untuk Hasil Model | (c) | 55 mnt |
| MLF3 | Evaluasi Model: Metrik yang Jujur | (d) | 60 mnt |
| MLF4 | Overfitting & Underfitting: Diagnosis dan Obat | (e) | 55 mnt |

### 3.3 Angka kanonis (dari notebook credit scoring Septian — terverifikasi dari file .ipynb)

- Dataset: UCI Default of Credit Card Clients, 30.000 baris, default rate (base rate) **0,2212**
- Test set: 6.000 nasabah
- Logistic Regression: ROC-AUC **0,7426**, PR-AUC **0,5049**, Brier 0,1427
- Gradient Boosting: ROC-AUC **0,7823**, PR-AUC **0,5597**, Brier 0,1342
- GBM terkalibrasi: ROC-AUC 0,7816, PR-AUC 0,5558, Brier 0,1345
- Train ROC-AUC GBM 0,8469 vs test 0,7823 → gap **0,0646** (overfitting ringan)
- Threshold operasional: **0,10**

### 3.4 Batas non-duplikasi (hasil cek track yang ada, 12 Nov 2026)

- **MLE4** (Evaluasi di Luar Akurasi): sudah ajarkan confusion matrix, precision/recall/F1, kalibrasi ECE, Wilson/McNemar, slice evaluation — MLF3 TIDAK mengulang itu secara mendalam; MLF3 memberi ringkasan 2–3 kalimat per konsep (F2: self-contained) lalu fokus ke yang baru: ROC-AUC bands, PR-AUC vs base rate, Brier/log-loss, CV, dan worked example angka notebook.
- **MLE15** (ML Klasik & Model Selection): sudah ajarkan bias-variance + pipeline anti-leakage — MLF4 TIDAK mengulang teori bias-variance; fokus ke diagnosis via gap train-test nyata + menu mitigasi dengan contoh finance.
- **MLE25** (Unsupervised), **MLE23** (Matematika ML), **MLE12** (Fairness), **MLE19** (SHAP): MLF1 menyebut ketiganya seperlunya sebagai peta (tanpa mengajarkan ulang); pendalaman di M3/M7.
- **CR46** (ML credit scoring, XGBoost + walk-forward) dan **FR7** (supervised ML fraud): MLF1–MLF4 adalah fondasi DI BAWAH keduanya — tidak menduplikasi kontennya.
- **Track A (Statistika)**: MLF2 memakai konsep distribusi/korelasi/CI sebagai alat baca, bukan mengajar ulang teori A-track.

### 3.5 Format per lesson (WORKFLOW.md v2.0)

- TS `V2Lesson` di `src/app/v2/content/mlf<N>-<slug>.ts` (steps: mulai → cerita → konsep → lab → peta keputusan → mini-case → checkpoint quiz).
- **Pembagian web vs Colab (dikunci Septian 12 Nov 08:39):** WEB = konsep + potongan code + interaktivitas (lab Pyodide, kuis, mini-case) — TANPA guided task di dalam lesson web. COLAB = guided task (notebook `.ipynb` penuh per lesson, step-by-step + checks) di `colab/mlf<N>-guided-task.ipynb`; tiap lesson web punya section "Guided task di Colab" dengan placeholder `<!-- COLAB-LINK-MLFN -->` (link Drive disisipkan setelah upload — jangan karang URL Colab). Link Colab notebook credit scoring (https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO) tetap jadi companion full-code bila topik memetakan ke notebook itu.
- Minimal: cover + TOC + tujuan + cerita pembuka + konsep berkepribadian + rumus KaTeX (String.raw) + ≥2 miskonsepsi + ≥2 tips + ≥1 lab Python runnable (Pyodide, seed deterministik, checks) + ≥1 figure SVG (cara membaca + interpretasi) + peta keputusan + mini-case + ≥5 quiz (feedback "why") + rangkuman + progress.
- Versi ringkas `.md` di `content/mlf<N>-<slug>.md` + regenerasi `chapters.ts` (`scripts/build-content.py`) dan `lessonMeta.json` (esbuild + `gen-lesson-meta.mjs`).
- **Aturan figure per diagnosis (dikunci Septian 12 Nov 08:43):** MLF2 — tiap statistik (mean vs median saat skew, base rate, CI) punya contoh visual sendiri. MLF4 — tiga figure learning curve terpisah: underfitting (kedua skor rendah, plateau), good fit (kurva konvergen), overfitting (train tinggi, validasi jatuh, gap membesar — pakai angka GBM nyata: train ROC-AUC 0,8469 vs test 0,7823, gap 0,0646). L0.3 (dibangun nanti) — satu figure per diagnosis: normal (histogram + QQ lurus), right-skew (ekor kanan panjang + QQ melengkung, sebelum/sesudah log-transform), left-skew (kasus cermin + fix), outlier (boxplot / IQR). Tiap figure menunjukkan bentuk + cara membaca + fix-nya.
- **Pola per konsep — Nilai + Gambar + Baik/Buruk + Mitigasi (dikunci Septian 12 Nov 08:43, berlaku untuk SEMUA konsep kunci di M1, L0, dan modul berikut):** tiap konsep diajarkan sebagai (1) konsepnya, (2) contoh nilai/angka nyata (pakai angka kanonis notebook bila relevan: mis. ROC-AUC LR 0,7426 vs GBM 0,7823; PR-AUC 0,5597 vs base rate 0,2212; gap train-test 0,0646), (3) gambarnya, (4) bacaan baik-vs-buruk eksplisit dengan band/threshold acuan, (5) mitigasi bila nilainya buruk. Contoh: ROC-AUC bands (0,5 acak; 0,7–0,8 lumayan; 0,8–0,9 bagus; >0,9 curigai leakage) + mitigasi skor buruk; nilai skewness + histogram + baik/buruk + mitigasi log-transform; gap overfitting + learning curve + baik/buruk + mitigasi regularisasi/CV/model lebih sederhana/data lebih banyak. Nilai dan gambar TIDAK dipisah dari penjelasan konsep — keduanya tertenun di dalam konsep itu sendiri.
- Narasi Indonesia, istilah EN; kode English + komentar; no black-on-dark; hindari frasa absolut (guard GG-7); label jumlah harus cocok isi (guard GG-18); angka narasi wajib ada derivasi (GG-21).

## 4. QA (wajib ALL PASS sebelum lapor)

`qa_learn_counts.py` (tambah "Machine Learning Finance" ke NONSPEC), `qa_learn_numbers.py` (fixture angka kanonis §3.3), `qa_lab_regression.py`, `qa_lab_expected_check.py`, `qa_lab_starter_compile.py`, `qa_quiz_numeric_keys.py`, `qa_absolute_claims.py`, `qa_gg17_minus_ascii.py`, `qa_gg18_label_counts.py`, `qa_gg19_svg_geometry.py`, `qa_gg20_starter_solution.py`, `qa_gg21_narrative_derivation.py`, `concept_gate.py --files <4 lesson>` — plus `npx tsc --noEmit`.

## 5. Batasan

- TIDAK deploy. TIDAK push. Delivery = spec ini + file lesson + hasil QA.
- Deploy belakangan setelah verifikasi induk + ACC Septian.

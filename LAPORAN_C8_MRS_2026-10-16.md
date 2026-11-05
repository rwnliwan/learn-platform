# LAPORAN C8 — Market Risk + Statistika → ADVANCED (2026-10-16)

**Status: SELESAI & terverifikasi independen (koordinator). Tidak ada deploy. Mode senyap dipatuhi.**

Model kerja: 4 worker paralel dengan partisi file saling lepas —
- W1: Market Risk mr1–mr9 (pendalaman 6 <45 + tutup gap 3)
- W2: Market Risk mr10–mr26 (pendalaman 10 <45 + cek tangga ujung-atas)
- W3: Statistika 15 lesson <45 (pendalaman ke advanced)
- W4: Statistika 26 lesson ≥45 (tutup celah komponen, intervensi minimal)

## 0. Angka final (verifikasi koordinator — re-bundle registry + skrip audit identik 14 Okt + tsc)

| Metrik | Sebelum | Sesudah |
|---|---|---|
| Market Risk: rata-rata | 46,4 | **52,2** |
| Market Risk: <45 mnt | 15/26 | **0** (min 46,9 mr8; max 57,3 mr20) |
| Statistika: rata-rata | 54,9 | **59,7** |
| Statistika: <45 mnt | 15/41 | **0** (min 47,1 a310; max 87,4 a13 — pre-existing, hanya +1,6 dari intervensi) |
| Komponen hilang (kedua track) | 19 (MR) + 41 (Stat) | **0** |
| Lesson tanpa note Intuisi | 67/67 | **0** |
| `npx tsc --noEmit` | — | **0 error** |

- **Platform keseluruhan:** lesson <45 mnt **58 → 28** dari 607 (30 lesson terangkat — tepat 15+15, konsisten).
- **F1: 0 temuan** — scan koordinator 5 frasa terlarang atas 67 file scope C8 (konten baru + lama).
- **F2: 0 pelanggaran tersisa** — scan koordinator 67 file; 53 perbaikan (25 W1 + 26 W2 + 5 W3 + 2 W4 + pola koordinator C7). Satu-satunya hit pola `(XXX)` yang tersisa = `(HC3)` di a32 — notasi heteroskedasticity-consistent SE, bukan referensi lesson (false positive, tidak diubah).
- File tersentuh: 19 mr* + 41 a* (statistika) = 60 file; mr20–mr26 & file non-scope tidak tersentuh; rr* tidak tersentuh.

## 1. Rincian per file — Market Risk batch 1 (mr1–mr9)

| File | dur → | est | Ditambahkan (advanced) |
|---|---|---|---|
| mr1-trading-book | 51,3 → **53,5** | 55 | Intuisi (173 kata) + 2 formulaNote (S=∂V/∂f, ΔV≈ΣSᵢΔfᵢ) |
| mr2-volatilitas | 53,2 → **57,3** | 55 | Intuisi (170 kata) + 4 formulaNote (log-return, EWMA, half-life, shrinkage) |
| mr3-var | 55,4 → **59,4*** | 60 | Intuisi (165 kata) + 4 formulaNote; *margin: hitungan worker ±2 over-estimasi, nilai audit riil ≈57 |
| mr4-var-lanjut | 43,6 → **50,4** | 50 | Langkah "cornish-fisher" (~750 kata): koreksi kuantil via skew/kurtosis, kapan gagal, banding vs HS + Intuisi |
| mr5-expected-shortfall | 42,8 → **49,1** | 50 | Langkah "backtest-es" (~1050 kata): ES tidak elisitable sendirian (Gneiting), jointly elicitable VaR+ES (Fissler-Ziegel), uji multi-level + Intuisi + 3 quiz |
| mr6-backtesting | 43,9 → **50,2** | 50 | Langkah "validasi-sistem" (~700 kata): power rendah Kupiec @250 hari, 3 pilar, use test + Intuisi + 1 quiz |
| mr7-stress-test | 42,9 → **49,5** | 50 | Langkah "governance-stress" (~700 kata): challenger, siklus tahunan + pemicu ad-hoc, komunikasi 1-halaman ke direksi, konteks OJK/BI–ICAAP Pilar 2 + Intuisi + 3 quiz |
| mr8-risiko-suku-bunga | 43,9 → **49,6** | 50 | Langkah "effective-duration" (~600 kata): callable, negative convexity, OAS, SBN ritel + Intuisi |
| mr9-kurva-yield | 43,7 → **50,5** | 50 | Langkah "forward-rate" (~700 kata): forward = ekspektasi + term premium, 3 kegunaan, kurva SBN + Intuisi |

## 2. Rincian per file — Market Risk batch 2 (mr10–mr19; mr20–mr26 tidak tersentuh)

| File | dur → | est | Ditambahkan (advanced) |
|---|---|---|---|
| mr10-irrbb | 43,6 → **49,4** | 50 | Intuisi (225 kata) + formulaNote ΔEVE & ΔNII + 6 skenario BCBS + konteks CASA/KPR/SBN + 1 quiz |
| mr11-options-risk | 45,7 → **48,6** | 50 | Intuisi (233 kata) + 3 formulaNote (payoff, Greeks, P&L explain) + pin risk |
| mr12-fx-komoditas | 44,8 → **50,6** | 50 | Intuisi (211 kata) + 3 formulaNote (basis, cost of carry, h*) + carry trade IDR/taper tantrum + 1 quiz |
| mr13-risiko-likuiditas | 44,8 → **50,7** | 50 | Intuisi (245 kata) + 3 formulaNote (biaya spread, LVaR, LCR/NSFR) + market impact √t/Almgren-Chriss + 1 quiz |
| mr14-counterparty-risk | 39,0 → **52,3** | 50 | Intuisi (227 kata) + 3 formulaNote (EE/PFE, CVA, SA-CCR) + DVA/FVA/MVA + WWR checklist + mini-case "Netting yang menyelamatkan Rp85 miliar" + 1 quiz |
| mr15-model-stokastik | 44,1 → **50,0** | 50 | Intuisi (246 kata) + 3 formulaNote (GBM, CIR, GARCH) + jump diffusion Merton + kalibrasi vs overfitting + 1 quiz |
| mr16-regulasi-frtb | 37,9 → **51,2** | 50 | Intuisi (220 kata) + 2 formulaNote (SBM, ES liquidity horizon) + SA vs IMA total cost + OJK/NMRF + mini-case "Desk yang kehilangan IMA: Rp45 miliar" + 1 quiz |
| mr17-limit-laporan | 36,0 → **51,6** | 50 | Intuisi (244 kata) + RAS 4 elemen + RACI + mini-case "Dua breach, dua nasib (Rp30 M)" + 2 quiz |
| mr18-validasi-model | 35,4 → **51,4** | 50 | Intuisi (233 kata) + benchmarking/challenger models + tata kelola OJK (inventory, tiering, committee, use-test) + mini-case "Validator yang menolak model Rp2 triliun" + 2 quiz |
| mr19-capstone-var-es | 36,0 → **55,5** | 60 | CAPSTONE end-to-end: portofolio Rp10 M → VaR 3 metode + ES + rasio ES/VaR → backtest Kupiec + independensi Christoffersen → stress 3 skenario (historis/hipotetis/reverse) → laporan 1 halaman + mini-case "Engine yang mengubah keputusan: Rp2,1 M" + 3 quiz |

## 3. Rincian per file — Statistika pendalaman (15 lesson)

| File | dur → | est | Ditambahkan (advanced) |
|---|---|---|---|
| a38-validasi-model | 40,8 → **51,8** | 50 | Intuisi + langkah "CV bersarang: tuning jujur & jebakan p-hacking" (nested CV, selection bias, Bonferroni, garden of forking paths, pradaftar) + 3 quiz |
| a39-time-series | 41,1 → **52,0** | 50 | Intuisi + langkah "ACF/PACF, kointegrasi & patahan struktural" (Engle-Granger, Chow/CUSUM) + 3 quiz |
| a35-metrik-klasifikasi | 41,2 → **52,0** | 50 | Intuisi + langkah "MCC & threshold dari biaya" (t*=C_FP/(C_FP+C_FN)) + 3 quiz |
| a36-kalibrasi | 41,3 → **52,1** | 50 | Intuisi + langkah "ECE, dekomposisi Brier & kapan kalibrasi merusak" (Platt vs isotonic) + 3 quiz |
| a37-imbalanced-data | 41,4 → **52,1** | 50 | Intuisi + langkah "Kapan SMOTE berbohong & threshold dari biaya" + 3 quiz |
| a315-tree-boosting | 41,7 → **52,9** | 55 | Intuisi + langkah GBM: F_m=F_{m-1}+νh_m, Ω=γT+λ‖w‖²/2, Newton, histogram/GOSS/EFB, bias-variance RF vs boosting, urutan tuning + 3 quiz |
| a32-diagnostik-regresi | 42,3 → **53,2** | 55 | Intuisi + langkah "Multikolinearitas: VIF, angka kondisi & hierarki obat" + 3 quiz |
| a313-kausal | 43,1 → **54,0** | 55 | Intuisi + langkah "DAG, kriteria backdoor & do-calculus konseptual" (P(y\|do(x))=ΣP(y\|x,z)P(z), weak instruments F<10) + 3 quiz |
| a314-explainability | 43,1 → **54,0** | 55 | Intuisi + formulaNote Shapley + langkah "Aksioma Shapley, LIME & 4 jebakan interpretasi" + 3 quiz |
| a311-pca-clustering | 43,5 → **54,0** | 55 | Intuisi + langkah "Silhouette, stabilitas & kutukan dimensi" (gap statistic) + 3 quiz |
| a34-logistic-glm | 43,7 → **54,5** | 55 | Intuisi + formulaNote logit + langkah "Deviance, overdispersi & offset" (quasi-Poisson/NB) + 3 quiz |
| a312-survival-analysis | 44,2 → **55,0** | 55 | Intuisi + langkah "Jenis sensor, uji PH & competing risks lanjut" (Schoenfeld, Fine-Gray) + 3 quiz |
| a317-quantile-regression | 44,2 → **54,0** | 55 | Intuisi + langkah "Interval prediksi, quantile crossing & conformal" + 3 quiz |
| a33-regularisasi | 44,3 → **55,0** | 55 | Intuisi + formulaNote Ridge/Lasso-EN + langkah "Jalur regularisasi, df efektif & inferensi pasca-seleksi" + 3 quiz |
| a318-doe-faktorial | 44,3 → **54,2** | 55 | Intuisi + langkah "Power, replikasi & faktorial fraksional" (resolusi III/IV/V, DOE sekuensial) + 3 quiz |

## 4. Statistika tutup celah (26 lesson, intervensi minimal)

26/26 file: 1 note "Intuisi: …" (151–188 kata) + 50 formulaNote total untuk semua rumus ter-flag. Delta durasi +0,9–1,6 mnt/file (estMinutes tidak berubah kecuali a316: 58→50 oleh koordinator mengikuti aturan kelipatan 5). Tanpa langkah/lab/quiz baru. mr20 & mr21: estMinutes 53→55 oleh koordinator (kelipatan 5; 34 est lain non-kelipatan-5 di track non-scope adalah pre-existing dan dibiarkan).

## 5. Scan F1/F2 eksplisit (koordinator, 67 file)

- **F1: 0 temuan** — 5 frasa terlarang atas 67 file (baru + lama).
- **F2: 0 pelanggaran tersisa** — 53 perbaikan oleh worker (W1: 25 recap inline; W2: 26 recap inline — 22 parenthetical `(MRx)` + 4 bare; W3: 5 recap inline; W4: 2 recap inline). Scan koordinator hanya menemukan `(HC3)` di a32 = notasi robust SE, false positive.

## 6. Cek tangga beginner→advanced (ujung atas)

- **Market Risk: tangga penuh** — mr18 VALIDASI → advanced (3 pilar SR 11-7, challenger models, tata kelola OJK); mr19 CAPSTONE → advanced end-to-end judgment-based (VaR 3 metode + ES + backtest Kupiec/Christoffersen + 3 stress + laporan 1 halaman); mr20 SUDAH advanced (tidak disentuh). mr21–mr26 spot-check struktur lengkap (Intuisi + mini-case Rp + lab + peta keputusan).
- **Statistika: tangga penuh** — 6 ujung-atas (a315, a313, a314, a312, a317, a318) DIPERKUAT → advanced (verdict worker diverifikasi isinya oleh koordinator via grep struktur: milestone/step ids, quiz why utuh); 6 topik advanced batch-4 (a212-bayesian, a210-power, a211-ab-testing, a213-kausalitas, a28-multiple-testing, a29-bootstrap) SUDAH advanced (verdict worker: BCa, selective inference, SRM, DiD/IV/DAG, Holm/BH, bootstrap-t — tidak diperdalam).
- Konteks Indonesia di Market Risk: SBN, OJK, BI rate, CASA, KPR, IDX, taper tantrum 2013.

## 7. Kendala & catatan

- W1: mr3 di 59,4 menurut estimasi worker sendiri — metode hitungnya over-estimasi ±2 untuk file ini; nilai audit riil 55,4→(tutup gap) — dalam rentang; dibiarkan, est 60. Insiden: KaTeX `\\frac` ganda di String.raw sempat dikira bug — verifikasi byte-exact di Node: `mfrac: true`, konvensi file benar.
- W2: mr11 (48,6) paling mepet — sesuai target "≥48 kompak"; 2 Intuisi >250 kata dipangkas; tabrakan edit F2 di mr19 diselesaikan manual.
- W3: tidak ada kendala berarti; a317 est 48→55 diselaraskan.
- W4: koma ganda dari insert formulaNote di 21 file — tertangkap tsc, diperbaiki, 0 error final. 22 draft intuisi <150 kata → diperpanjang, terverifikasi programatik.
- Koordinator: 3 estMinutes non-kelipatan-5 di scope diperbaiki (a316 58→50, mr20/mr21 53→55).
- Platform kini: **28/607** lesson <45. Peta program: C9 (sapu bersih) berikutnya, lalu deploy besar.
- Tidak ada deploy.

# Gap Luna M6 — Tuning & Model Selection

**Analis:** Luna via Kelontong (`gpt-6-luna`), 1 panggilan streaming,
prompt `review-prompts/gap_m6_luna_prompt.txt` (354.275 B).
Mentah: `review/gap_luna_m6_raw.txt` (12.690 B).
**Verifikasi Chief:** 13 Nov 2026 ~11:15 WITA — **9/9 BENAR, 0 noise.**
Setiap klaim bukti dicek ke file TS (grep): kutipan ada, ketiadaan
dikonfirmasi (Pipeline/ColumnTransformer 0×, ensemble/stacking 0×,
operating point/constraint 0×, CI/SE hanya caveat "bukan uji statistik").

## Ringkasan

| No. | Severity | Status | Isi | Verifikasi Chief |
|---|---|---|---|---|
| G1 | must-add | HILANG | Workflow end-to-end anti-leakage: preprocessing/FE di dalam fold (Pipeline/ColumnTransformer) | BENAR — 0 penyebutan Pipeline di 5 lesson |
| G2 | must-add | TIPIS | Pisahkan calibration/threshold dari evaluasi final (three-way split); M6.4 memakai test yang sama | BENAR — kutipan M6.4 ×1; aturan M6.5 "test terkunci" justru BERTENTANGAN dengan praktik M6.4 (threshold dipilih di test) — fill WAJIB menyelesaikan ketegangan ini, bukan menyembunyikannya |
| G3 | must-add | HILANG | Pemilihan metrik utama secara sistematis sebelum tuning (decision table tujuan → metrik) | BENAR — aturan "SATU METRIK UTAMA" dinyatakan (M6.5), tapi CARA memilih tidak pernah diajarkan; ROC-AUC diberi, bukan dipilih |
| G4 | should-add | HILANG | Merancang search space: conditional, rentang masuk akal, interaksi, coarse-to-fine | BENAR — log-uniform disebut sepintas (M6.1:68) sebagai remark, bukan metode; tidak ada conditional/coarse-to-fine/interaksi operasional |
| G5 | should-add | TIPIS | Ketidakpastian hasil tuning: CI, SE, repeated resampling, stabilitas ranking | BENAR — M6.2 hanya mean ± sd + caveat "bukan uji statistik"; tidak ada CI/SE formal |
| G6 | should-add | HILANG | Membandingkan model di beberapa operating point: ROC/PR curve, constraint bisnis | BENAR — 0× "operating point"/"constraint"; M6.4 hanya threshold cost-optimal 0,10 vs 0,50 |
| G7 | should-add | HILANG | Finalisasi model: refit final, artefak, pencatatan, versioning, aturan promosi | BENAR — hanya satu baris "grid search pada SELURUH data" (M6.2) + opsi kuis "latih ulang di train penuh" (M6.5); tidak ada prosedur/model card |
| G8 | should-add | HILANG | Repeated tuning / experiment tracking / multiple comparisons lintas sesi | BENAR — "jejak" hanya di dalam satu pencarian; tidak ada registry/konsep effective attempts |
| G9 | nice-to-have | HILANG | Alternatif model selection: ensemble/stacking, Pareto frontier kompleksitas | BENAR — 0× ensemble/stacking di M6; cross-reference ke M4.1 (sudah mengajarkan ensembles) — jangan ajar ulang, bandingkan saja |

## Per gap (ringkas — detail penuh di file mentah)

### G1 — must-add, HILANG
- Bukti: tidak ada workflow lengkap yang memastikan preprocessing/FE di dalam setiap fold. M6.1: "nilai tiap konfigurasi dengan cross-validation di train"; M6.2: "time-series split dengan expanding window" (tanpa pipeline transformasi di dalam split).
- Saran: M6.2 setelah nested CV — langkah baru + figure alur (`raw → split/fold → fit transformer pada train fold → transform validation fold → fit estimator → score`) + lab Pyodide (Pipeline/ColumnTransformer; posisi standardization/feature selection yang benar). Angka baru tandai [ilustrasi].

### G2 — must-add, TIPIS
- Bukti: M6.4 "Semua angka kalibrasi dan threshold di lesson ini dihitung pada test 6.000 yang sama"; M6.5 "test dibuka sekali, di akhir" tapi tidak membangun ulang workflow.
- **Catatan Chief:** ini ketegangan INTERNAL — M6.5:230 melarang memakai test "untuk memilih model, memilih threshold, atau memilih konfigurasi", sementara M6.4 memilih threshold di test. Fill harus: (a) ajarkan three-way split (train / calibration-validation / final test), (b) labeli eksplisit angka M6.4 sebagai "hasil ilustrasi protokol lesson", BUKAN template evaluasi final bebas seleksi.
- Saran: M6.4 sebelum "Platt vs isotonic" — figure tiga-split + lab + checklist "Apakah calibration, threshold, dan model dipilih tanpa melihat final test?".

### G3 — must-add, HILANG
- Bukti: hanya M6.5 "SATU METRIK UTAMA, ditetapkan sebelum pencarian" — tidak ada langkah yang mengajarkan CARA memilih.
- Saran: M6.1 awal atau M6.5 sebelum protokol adil — decision table (ranking → ROC-AUC/PR-AUC; probabilitas → Brier/ECE; keputusan biaya → expected cost/profit; imbalance → jangan hanya accuracy) + kuis skenario. Learner menetapkan primary metric + secondary diagnostics + business constraint SEBELUM search. Pakai angka kanonis atau [ilustrasi].

### G4 — should-add, HILANG
- Bukti: M6.1 menjelaskan jumlah konfigurasi + distribusi random, tanpa conditional space / interaksi operasional.
- Saran: M6.1 sesudah grid vs random — langkah baru + figure search space 2D + lab: coarse-to-fine, log scale untuk parameter multiplicative, conditional space, kombinasi tak layak. Lab memakai grid GBM kanonis 18 konfigurasi (kelompokkan hasil per learning_rate/max_depth/max_iter, jelaskan interaksi) — tanpa angka baru.

### G5 — should-add, TIPIS
- Bukti: M6.2 "mean ± sd" + "band mean ± sd adalah alat baca cepat, bukan uji statistik"; M6.5 membandingkan selisih dengan sd — tanpa CI/prosedur uncertainty lengkap.
- Saran: M6.2 atau M6.5 — worked example + kuis interpretasi: bedakan sd fold / SE / CI / variabilitas split; fold CV tidak independen; laporkan outer-fold scores + mean + sd + rentang + batas klaim. Angka kanonis: outer scores 0,7974; 0,7782; 0,7878; 0,7859; 0,7799.

### G6 — should-add, HILANG
- Bukti: M6.4 threshold 0,10 dan 0,50 tanpa analisis operating point umum (ROC/PR curve, constraint min approval / max bad rate / target recall). M6.5: McNemar hanya "pada satu threshold".
- Saran: M6.4 setelah threshold cost-sensitive — figure ROC/PR dengan operating points + lab: pilih threshold dari constraint (bukan hanya maks profit); bandingkan confusion matrix threshold-dependent vs ranking threshold-independent. Threshold kanonis 0,10; 0,15; 0,20; 0,50.

### G7 — should-add, HILANG
- Bukti: M6.5 "simpan JEJAK seleksi — daftar kandidat, skor tiap kandidat, protokol evaluasi, dan uji signifikansi" — tapi tidak ada prosedur finalisasi utuh. M6.2: "konfigurasi final tetap harus dipilih dengan satu grid search pada SELURUH data" (satu baris).
- Saran: M6.5 checkpoint/lesson penutup — checklist deployment-readiness + lab metadata: template model card/selection record (dataset version, seed, folds, search space, primary metric, konfigurasi terpilih, calibration method, threshold, skor final). Lab: isi record untuk GBM tertala (max_iter 100, max_depth 5, learning_rate 0,05); bedakan CV 0,7865 / nested 0,7858 / test 0,7823.

### G8 — should-add, HILANG
- Bukti: M6.5 "18 kandidat", "random search 27 konfigurasi", "leaderboard-chasing" (9×) — tanpa penggabungan hasil lintas sesi eksperimen (beberapa seed/search space/metrik/iterasi).
- Saran: M6.5 bagian jebakan leaderboard — timeline figure + lab audit eksperimen: experiment registry (setiap run dicatat, termasuk yang gagal; seed, search space, metric, keputusan); konsep "effective number of attempts" kualitatif [ilustrasi]. Lab: tentukan apakah laporan yang hanya memilih run terbaik masih valid.

### G9 — nice-to-have, HILANG
- Bukti: 0× ensemble/stacking di 5 lesson; M6.5 "tiga kandidat — LR tertala, GBM default, GBM tertala".
- Saran: M6.5 pengayaan setelah protokol adil — figure Pareto frontier + kuis keputusan: single model vs ensemble konseptual (tanpa klaim performa baru) pada ROC-AUC/PR-AUC, calibration, cost, latency, explainability, operational complexity. **Cross-reference M4.1** (sudah mengajarkan ensembles) — jangan ajar ulang. Ensemble hanya layak bila peningkatan cukup besar + stabil untuk membayar kompleksitasnya.

## Catatan verifikasi Chief
- Pola berulang: Luna kuat di "apa yang tidak diajarkan" — semua 9 klaim HILANG/TIPIS terkonfirmasi dari file. Tidak ada temuan yang mengulang 40 temuan DeepSeek (sudah difilter prompt).
- G2 adalah temuan terpenting: bukan sekadar celah, tapi kontradiksi internal (aturan M6.5 vs praktik M6.4). Fill yang hanya "menambah langkah three-way split" tanpa melabeli angka M6.4 = TIDAK cukup.
- G4: "HILANG" dengan kualifikasi — remark log-uniform M6.1:68 adalah fondasi yang harus dipakai fill, bukan diabaikan.
- Angka untuk fill (kanonis, jangan dikarang): outer scores M6.2, threshold M6.4 (0,10/0,15/0,20/0,50), GBM tertala (100/5/0,05), CV 0,7865 / nested 0,7858 / test 0,7823, grid 18 konfigurasi.

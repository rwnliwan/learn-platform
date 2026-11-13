# Review DeepSeek M7 — Laporan Chief (verifikasi induk)

**Tanggal:** 13 Nov 2026, ~15:25 WITA
**Reviewer:** DeepSeek v4.1-flash via Kelontong AI (5 panggilan, prompt pola M6: kanonik M7 penuh + TS lesson)
**Status:** m71 selesai 15:18, m72 GAGAL HTTP 520 (15:18) → **re-run 15:22–15:25 sukses**, m73 15:21, m74 15:22, m75 15:24
**Output mentah:** `review_deepseek_m7m71.txt` … `review_deepseek_m7m75.txt`

## Vonis per lesson

| Lesson | Vonis DeepSeek | MUST | SHOULD | NIT |
|---|---|---|---|---|
| M7.1 Fairness Metrics | **REVISE** | 1 | 1→NIT* | 2 |
| M7.2 Bias Audit Sources | **REVISE** | 1 | 2 (1→NIT*) | 1 |
| M7.3 Explainability SHAP/LIME | APPROVE-WITH-FIXES | 0 | 2 | 4 |
| M7.4 Fairness Mitigation | APPROVE-WITH-FIXES | 0 | 1 | 4 |
| M7.5 Monitoring & Drift | **REVISE** | 1 | 3 | 2 |
| **Total** | **3 REVISE, 2 APPROVE-WITH-FIXES** | **3** | **7** | **15** |

\* Dua temuan SHOULD DeepSeek **DITURUNKAN jadi NIT oleh Chief** (lihat § Verifikasi Chief): angka ekonomi threshold 0,50/0,20 **ADA** di `m6_canonical.json` — reviewer tidak diberi kanonik M6, jadi tidak bisa memverifikasi. Fix = label sumber `[M6.4]` eksplisit, bukan hapus angka.

## Temuan TERVERIFIKASI (wajib fix)

### MUST-FIX

**M1 (M7.1 + M7.2, satu kesalahan konsep yang sama — kelas GG-5).**
Premis "model tidak memakai SEX/EDUCATION/AGE sebagai fitur" SALAH dan menjalar ke 2 lesson + 1 kuis.
Bukti kanonik (`m7_canonical.json`): `m73_lr_coef.all` SEX −0,0626, EDUCATION −0,0575, MARRIAGE −0,0565, AGE +0,0547; `m73_perm_importance_gbm.all` SEX 0,0008, EDUCATION 0,0013, AGE 0,0022 (>0 = dipakai GBM); `m73_shap_gbm.global_mean_abs_shap_all` SEX 0,0314; `m74_drop_sensitive` drop [SEX, MARRIAGE, EDUCATION] → 28 fitur tersisa (31−3) — eksperimen drop hanya masuk akal bila baseline memakai ketiganya.
Lokasi yang salah:
- M7.1:15 — "Modelmu tidak pernah «melihat» kolom itu secara langsung — SEX bukan fitur yang dipakai untuk memprediksi."
- M7.1:26 (pitfall note) — "model di lesson ini tidak memakai SEX, EDUCATION, atau AGE sebagai fitur prediksi" + klaim "Menghapus kolom sensitif dari fitur TIDAK menghapus ketidakadilan — ia hanya menyembunyikannya" (juga salah, lihat S1 M7.2).
- M7.1:533 (kuis, why distraktor) — "Model ini tidak memakai SEX sebagai fitur dan tetap menunjukkan keempat gap itu."
- M7.2:24/26 (note "Miskonsepsi: model tidak memakai SEX sebagai fitur, jadi pasti adil") — body sama seperti M7.1:26.
- M7.2:495/497/498 (Q6) — jawaban "benar" A ("bocor lewat fitur lain") tidak tepat; why distraktor B ("pipeline flagship tidak menyertakan SEX/EDUCATION/AGE sebagai fitur (31 fitur dari kolom transaksi dan perilaku)") SALAH — 4 dari 31 fitur adalah demografis mentah.
Perbaikan (arah DeepSeek, disetujui Chief): reframe jujur — model **memakai** SEX/EDUCATION/MARRIAGE/AGE langsung (bobot kecil: SEX −0,0626 dst.); approval 26,1%/30,1% = campuran perbedaan risiko terukur + kontribusi langsung fitur demografis + proxy. Pesan yang tetap valid: "menghapus kolom sensitif tidak menuntaskan ketidakadilan" — buktikan dengan `m74_drop_sensitive` (AIR 0,8694 → 0,9211, masih <1). Teorema impossibility (base-rate) tetap benar, dipertahankan.

**M1 (M7.5). Kontradiksi tingkat alert chunk 2: langkah 9 vs lab2/checkpoint.**
- Langkah 9 (TS:211–212): "ROC-AUC turun >0,02 dalam 1 periode = WASPADA; dalam 2 periode = KRITIS" + "Chunk 2 … TIGA alarm waspada … tidak ada yang naik ke KRITIS."
- Lab2 (TS:307/309/317/319): "KRITIS (2) bila PSI>0,25 ATAU (ROC-drop>0,02 DAN PR-drop>0,03)" + `expected: alert_A=2` + "alert_A = 2 (kritis)".
- Hitung ulang Chief: chunk 2 roc_drop = 0,7816−0,7428 = 0,0388; pr_drop = 0,5558−0,5137 = 0,0421 — keduanya melewati ambang.
- Perbaikan (pilihan termudah, konsisten dengan narasi langkah 9 + pedagogi "alert ≠ retrain"): ubah `alert_level()` lab2 + `expected` menjadi `alert_A=1` (WASPADA), dan sesuaikan teks checkpoint "alert chunk 2 = waspada (1)". `retrain_A=0` tidak berubah.

### SHOULD-FIX

**S1 (M7.2). Klaim "menghapus kolom sensitif TIDAK menghapus ketidakadilan, hanya menyembunyikan" bertentangan dengan `m74_drop_sensitive`.**
Bukti: `m74_drop_sensitive.air = 0,9211` (audit_sex: laki-laki approval 0,2706, perempuan 0,2938 → 0,2706/0,2938 = 0,9211), naik dari 0,8694 dan melewati ambang 0,80; `proxy_probe_sex_from_features_roc_auc = 0,6261` (proxy masih ada, tapi tidak sekuat klaim "hanya menyembunyikan").
Perbaikan: "Menghapus kolom sensitif **menurunkan** disparitas (AIR 0,8694 → 0,9211 di m74) tetapi tidak menuntaskannya — proxy masih terdeteksi (AUC 0,6261)." Berlaku untuk M7.1:26 + M7.2:26 (teks sama di kedua lesson).

**S1 (M7.3). Salah label temporal studi kasus pembuka.**
Bukti: TS:15 "status bayar enam bulan terakhir 3, 2, 2, 7, 7, 7 — tiga bulan terakhir bahkan tidak membayar sama sekali". Kanonik `m73_local_case.raw_features`: PAY_0=3, PAY_2=2, PAY_3=2, PAY_4=7, PAY_5=7, PAY_6=7. Urutan PAY_0→PAY_6 = terbaru→terlama → 7,7,7 = tiga bulan TERTUA; tiga bulan terbaru = 3,2,2. (PAY_AMT 0 di semua enam bulan benar.)
Perbaikan: "status bayar enam bulan terakhir 3, 2, 2, 7, 7, 7 (terbaru→terlama); tiga bulan terbaru 3,2,2 dan tiga bulan tertua 7,7,7 — PAY_AMT 0 di semua enam bulan."

**S2 (M7.3). Frasa "bukan threshold-nya" bertentangan dengan hasil kanonik M7.4.**
Bukti: TS:246 "mitigasinya menyentuh fitur itu — bukan threshold-nya." Kanonik `m74_post_processing`: air_before 0,8694 → air_after 0,9999, approval_gap_after 0,0, cost 33.046.500 → 32.756.000, profit 8.214.000 → 8.504.500 — penyesuaian threshold per grup TERBUKTI memperbaiki AIR (bahkan profit naik).
Perbaikan: "untuk bias pengukuran, threshold hanya menutupi gejala — akarnya di fitur. Catatan: M7.4 memperlihatkan penyesuaian threshold per grup memang menurunkan AIR (0,8694→0,9999) dengan biaya nyaris netral, tetapi itu bukan perbaikan akar-masalah."

**S1 (M7.4). Angka biaya interpolasi tidak konsisten dengan λ.**
Bukti: TS:199 "λ = 0,62 (interpolasi) … biaya NT$32.895.000 (interpolasi)". Hitung ulang Chief dari `m74_pareto_lambda`: cost(λ=0,5)=33.035.000, cost(λ=0,75)=32.752.000 → interpolasi linear λ=0,62 = 33.035.000 + (0,12/0,25)×(−283.000) = **32.899.160**, bukan 32.895.000. (32.895.000 cocok untuk λ≈0,624; λ eksak AIR=0,95 adalah 0,6239.)
Perbaikan: konsistenkan — tulis `λ = 0,62, biaya ≈ NT$32.899.000`, atau `λ = 0,624, biaya ≈ NT$32.895.000`. Tetap beri label `[interpolasi]`.

**S1 (M7.5). Dua ROC-AUC "test" berbeda dalam satu langkah tanpa penanda model.**
Bukti: langkah 1 prose[0] "ROC-AUC test 0,7823 / PR-AUC 0,5597" (GBM mentah, `repro_flagship.gbm_roc_auc`) vs prose[2] "test ROC-AUC 0,7816 / PR-AUC 0,5558" (GBM terkalibrasi, `repro_flagship.gbm_cal_roc_auc`/`gbm_cal_pr_auc`). Model keputusan live memakai skor terkalibrasi.
Perbaikan: di prose[0] gunakan 0,7816/0,5558, atau tulis eksplisit "GBM mentah 0,7823/0,5597; setelah kalibrasi Platt 0,7816/0,5558 (model keputusan)".

**S2 (M7.5). Arah klaim contoh prior shift tidak berdasar / berpotensi terbalik.**
Bukti: langkah 2 prose "Prior shift … base rate default 0,2212 → 0,30 — model yang sama akan menolak lebih banyak orang". Mekanika label shift murni (model + threshold tetap): model under-predict P(default) → cenderung **menaikkan** approval, sementara bad rate yang disetujui naik dan kalibrasi bergeser.
Perbaikan: "model yang sama akan **under-predict** peluang default (kalibrasi bergeser meski ranking utuh) dan **bad rate yang disetujui naik**; arah approval bergantung pada pergeseran distribusi X, jadi jangan diasumsikan otomatis turun." (Atau hapus klaim arah.)

**S3 (M7.5). Angka PSI 0,0161 di lab2 diatributkan ke "chunk 2", padahal kanonik 0,0161 = chunk 1 vs chunk 5.**
Bukti: lab2 CASES "A" psi 0,0161 untuk chunk 2. Hunt Chief di kanonik: satu-satunya 0,0161 adalah `.m75_psi_chunk1_vs_chunk5_pseudo_time.score_calibrated.psi = 0,0161` — bukan PSI chunk 2 vs train (tidak ada di kanonik). Dampak nihil pada hasil (0,0161 < 0,1, alert tak terpicu).
Perbaikan: relabel "PSI skor antar-periode [waktu semu] ≈0,0161 (chunk 1 vs chunk 5)" atau tandai `[ilustrasi]` untuk PSI chunk 2.

### NIT (terverifikasi, fix ringan)

- **M7.1 N1** — AIR SEX tiga bentuk (0,869 / 0,8693 / 0,8694): 0,2614/0,3007 = 0,869305; kanonik sendiri dual (m71_by_group 0,8693 vs m71_air_sex_by_threshold["0.1"] 0,8694). Seragamkan ke 0,8693, atau catat keduanya dari presisi berbeda.
- **M7.1 N2** — "dua dari tiga nasabah lancar ditolak" untuk FPR 0,6585 (3077/4673 = 0,65846; "dua dari tiga" = 0,667). Ganti "sekitar dua pertiga (65,85%)".
- **M7.1 S1 → NIT (downgrade Chief)** — Angka ekonomi threshold 0,50/0,20 ADA di `m6_canonical.json` (dicek Chief: −18994456 ✓, −216500 ✓, 0,8805 ✓, 0,1596 ✓, 0,6513 ✓, 0,1113 ✓). Reviewer tidak diberi kanonik M6. Fix: pastikan label sumber `[M6.4]` eksplisit di langkah 10 (sudah ada per reviewer — verifikasi + seragamkan).
- **M7.2 N1** — "CalibratedClassifierCV cv=3" tak ada di kanonik M7. Verifikasi ke notebook flagship; bila tak ada bukti, turunkan ke "(detail implementasi)".
- **M7.2 S2 → NIT (downgrade Chief)** — Profit@0,50 −NT$18.994.456, 843 default, bad rate 15,96% ADA di `m6_canonical.json` (angka mentah di atas). 88,05% terhitung ulang benar. Fix: pastikan label `(M6.4)` eksplisit di lab2 + Q8 (sudah ada per reviewer — verifikasi + seragamkan).
- **M7.3 N1** — "CalibratedClassifierCV cv=3" (sama seperti M7.2 N1; 3 lesson mengulang klaim yang sama — verifikasi sekali ke notebook, terapkan ke semua).
- **M7.3 N2** — "2.000 versi tetangga / 2.000 sampel perturbasi" LIME tak ada di kanonik (`m73_lime_style` hanya kw=4,18, R²=0,4396). Tandai `[notebook]` atau samakan dengan notebook.
- **M7.3 N3** — Konvensi AIR campur: "AIR SEX 0,869" (laki/perempuan) vs "AIR perempuan/laki-laki 1,1502" (kebalikannya; kanonik 1,1502 vs hitung 0,3007/0,2614 = 1,1503 — selisih pembulatan, sudah didisclose di tempat lain). Tambah catatan eksplisit arah.
- **M7.3 N4** — "mengecil sedikit / hampir aditif" pada PDP 2D: efek UTILIZATION 0,0714 → 0,0487 = turun ~32% relatif, bukan "sedikit". Ganti "mengecil sekitar sepertiga (0,0714→0,0487) pada skala absolut kecil; interaksi lemah, bukan nol."
- **M7.4 N1** — Lab 1 expected `air_female_over_male=1.1502`, solusi mencetak `0.3007/0.2614 = 1.15034` → `1.1503` (kanonik m74 = 1,1502, m72 = 1,1503). Check tol 0,0005 lolos, tapi teks expected ≠ output. Samakan expected/label ke `1.1503`.
- **M7.4 N2** — "IV SEX 0,0092 (M2.2)" tidak ada di kanonik M7 (bukan salah angka — atribusi M2.2 sudah eksplisit). Pertahankan atribusi, pastikan label `[M2.2]` jelas.
- **M7.4 N3** — MARRIAGE "Lainnya" n=68 (lesson, cocok `m74_audit_mar`, air 0,6555) vs n=75 di `m72_audit_*` — **diskrepansi di dalam kanonik, bukan kesalahan lesson**. Lesson benar mengutip m74. Tidak wajib fix; pastikan konsisten memakai `m74_audit_mar` untuk M7.4. (Dicatat sebagai catatan kanonik, bukan temuan lesson.)
- **M7.4 N4** — "1/0,869 = 1,151": 1/0,869 = 1,1508; 1/0,8693 = 1,1504; kanonik 1,1502. Tulis `1/0,8693 ≈ 1,150`.
- **M7.5 N1** — "CalibratedClassifierCV cv=3" (sama seperti M7.2/M7.3 N1; default sklearn cv=5 — verifikasi ke notebook).
- **M7.5 N2** — "sekitar 230–290 default per chunk": chunk 3 base rate 0,245 × 1.200 = 294. Ganti "≈230–295 default per chunk" atau "≈230–300".

## Noise: 0

Semua 25 temuan diverifikasi Chief ke kanonik M7/M6 + teks lesson (TS:baris). Dua temuan diturunkan tingkatnya (bukan ditolak): angka M6.4 memang ada di kanonik M6 — reviewer hanya tidak diberi kanonik itu. Satu catatan kanonik (M7.4 N3) bukan kesalahan lesson.

## Catatan Chief untuk ronde fix

1. **M1 M7.1/M7.2 adalah kesalahan konsep kelas GG-5** (konsep diajarkan salah, menjalar ke kuis). Fix WAJIB mencakup: prose langkah 1 + pitfall note (kedua lesson), Q6 M7.2 (soal + jawaban benar + why semua opsi), why distraktor M7.1:533. Setelah fix, concept gate WAJIB punya kelas baru: "model flagship memakai atribut sensitif sebagai fitur" (must-not: "model tidak memakai SEX", "tidak pernah melihat kolom", "31 fitur dari kolom transaksi dan perilaku" tanpa demografis).
2. **Kelas QA baru dari ronde ini** (aturan standing: masuk QA di ronde fix yang sama):
   - Concept gate: (a) flagship memakai SEX/EDUCATION/MARRIAGE/AGE; (b) drop kolom sensitif MENURUNKAN disparitas (AIR 0,8694→0,9211), bukan "hanya menyembunyikan"; (c) PAY_0→PAY_6 = terbaru→terlama; (d) threshold per grup TERBUKTI memperbaiki AIR (M7.4); (e) alert 1-periode vs 2-periode — satu aturan konsisten; (f) raw vs calibrated ROC-AUC dilabeli; (g) prior shift: under-predict → approval naik, bukan turun.
   - Fixture must-not (string-lockable): "tidak memakai SEX", "tidak pernah «melihat» kolom", "tiga bulan terakhir … 7, 7, 7", "bukan threshold-nya", "λ = 0,62 … 32.895.000", "alert chunk 2 = kritis (2)" (bila fix memilih opsi waspada), "menolak lebih banyak orang" (konteks prior shift).
   - Kanonik: pertimbangkan tambah kunci silang M6.4 (threshold table) ke `m7_canonical.json` sebagai `m6_crossref` agar reviewer berikutnya bisa memverifikasi tanpa kanonik M6.
3. **Notebook TIDAK diubah** di ronde fix (pola M6) — kecuali bila notebook memuat klaim yang sama (cek: bila notebook M7.1/M7.2 juga menyatakan "model tidak memakai SEX", laporkan ke Chief, jangan ubah diam-diam).
4. **Biaya Kelontong ronde ini:** review 5 panggilan + 1 re-run m72 (HTTP 520, transient) — estimasi ~5–6 coin dari saldo 27 (Septian cek terakhir 12:41 WITA). Saldo pasti hanya Septian yang bisa cek (helper tak punya endpoint saldo).

## Langkah berikut

Fix coordinator → verifikasi Chief → gap Luna → fill → verifikasi ulang → deploy M7 (971 lesson) → M8.

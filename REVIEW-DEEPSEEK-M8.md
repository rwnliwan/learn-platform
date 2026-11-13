# REVIEW DEEPSEEK M8 — Laporan Chief (verifikasi induk)

**Tanggal:** 13 Nov 2026 ~20:00 WITA. Reviewer: DeepSeek `deepseek-v4.1-flash` via Kelontong (5 panggilan, prompt `review-prompts/review_m8_m8{1..5}_prompt.txt`, ~84–91 KB per lesson — lebih kecil dari M7 karena `m8_canonical.json` hanya 9 kunci + appendix cross-ref ringkas).

## Vonis per lesson (reviewer)

| Lesson | Vonis reviewer | Temuan |
|---|---|---|
| M8.1 Model validation framework | **REVISE** | 1M + 4S + 10N = 15 |
| M8.2 Model risk rating & inventory | **REVISE** | 1M + 7S + 6N = 14 |
| M8.3 Model card & documentation | APPROVE-WITH-FIXES | 1M + 5S + 9N = 15 |
| M8.4 Deployment: shadow/canary/champion | APPROVE-WITH-FIXES | 3M + 7S + 7N = 17 |
| M8.5 Governance & approval workflow | APPROVE-WITH-FIXES | 3M + 6S + 7N = 16 |
| **Total** | | **9M + 29S + 39N = 77** |

## Verifikasi Chief: 68 BENAR, 9 NOISE

**9 noise — semuanya satu kelas sistemik: "tidak tertelusur" karena reviewer hanya diberi appendix cross-ref ringkas, BUKAN `m7_canonical.json` penuh.** Angka-angka itu ADA di kanonik; fix-nya sitir kunci kanoniknya, BUKAN labeli [ilustrasi]:

- M8.1 S3 — ECE per grup (0,1208/0,0312/0,0455/0,0362/0,0210) = `m71_by_group.*.ece`; SEX coef −0,0626 = `m73_lr_coef.all.SEX`; SHAP SEX 0,0314 = `m73_shap_gbm.global_mean_abs_shap_all.SEX`; PSI train-vs-test 0,0017 = `m75_psi_score_calibrated_train_vs_test.psi`.
- M8.3 S2 — PSI AGE 0,0029 = `m75_psi_features_train_vs_test.AGE.psi` (juga `psi_features_max`).
- M8.3 S4 — AIR EDUCATION 0,3572 = `m71_by_group.EDUCATION.summary.air_min_over_max`.
- M8.3 N3 — `cv=3` ADA di notebook (terverifikasi sejak review M7); N4 — SHAP PAY_MAX 0,4946 = `m73_shap_gbm.global_mean_abs_shap_top12[0]`; N9 — sklearn 1.9.1 BENAR terpasang di venv (`python3 -c "import sklearn"` → 1.9.1).
- M8.4 S1 — 0,2217 = mean_score GBM terkalibrasi di output notebook M8.1 (bukan base rate 0,2212); fix = labeli "mean calibrated proba", bukan ganti angka. S5 — ECE 0,1003 = `m75_drift_simulations.S2_pay_plus1.ece_10bin` (simulasi S2, sudah dilabeli begitu di lesson).
- M8.5 S6 — AIR SEX 0,15 = 0,8906 (`m71_air_sex_by_threshold.0.15.air`); chunk 3 ROC 0,8138 & chunk 2 0,7428 = `m75_pseudo_time_chunks_test`; rentang 0,0710 = `m75_pseudo_time_roc_spread`; roc_drop 0,0388 = 0,7816 − 0,7428 (turunan kanonik).
- "31 fitur" (M8.2 S7, M8.4 N5, M8.5 N1) = `n_features: 31` di kanonik — fix = label [notebook], bukan hapus.

**Pelajaran proses untuk M9:** appendix prompt WAJIB memuat SEMUA angka cross-ref yang dikutip lesson (dicek ke kanonik M6/M7/M8), atau sertakan kanonik penuh. Jangan ulangi kelas noise ini.

## Temuan BENAR yang terpenting (ringkas — detail penuh di file review mentah)

### M8.1 (REVISE) — M1 PALING SERIUS di M8
- **M1 (MUST):** band "ECE ≥ 0,05 = MERAH" tanpa batas cakupan + jebakan "ambang 0,02 yang sama berlaku per grup" + ECE AGE 60+ 0,1208 (n=76) → menurut aturan lesson sendiri verdict = MERAH, tapi lesson menulis KUNING "satu-satunya pemicu bad rate" + "TIDAK SATU PUN kondisi MERAH terpenuhi" (menjalar ke mini-case, checkpoint, summary, kuis Q6/Q8). **Fix terpilih (opsi a reviewer):** batasi band ECE pada overall + per half (n=3.000–6.000); per grup berlaku gate ukuran sampel (n ≥ 200 → masuk band; n < 200 → TEMUAN-INVESTIGASI, bukan pemicu band). Ubah jebakan, mini-case, checkpoint, summary, Q6/Q8, lab 2.
- S1: band |Δapproval| tak punya KUNING/MERAH (HIJAU ≤ 1,0 pp saja; lab 2 bahkan tak menerima input approval). S2: bad rate monitoring tak menyebut kematangan label ("matang" 0× di lesson) — bandingkan bad rate 3 bulan pertama vs baseline 6,67% = alarm palsu negatif. S4: "≈2× sd antar-fold" — pembanding salah (selisih dua estimasi vs sd satu skor; yang benar ≈1,2× galat sampling selisih). N1: selisih default 53 vs 61 = **8**, bukan 9. N2: posisi label sumbu figure. N3–N10: wording (definisi SR 11-7 "adverse consequences", OCC 2011-12, veto lini 2, lini 3 → komite audit, "pilar" vs "elemen", sitasi ECE overall [M6.4]).

### M8.2 (REVISE)
- **M1 (MUST):** aturan matriks "Tier 1 … (exposure tinggi dan/atau kompleksitas tinggi)" bertentangan dengan figure (exposure tinggi × kompleksitas rendah = Tier 2) dan kuis Q5 (jawaban benar = Tier 2, distraktor "semua exposure tinggi otomatis Tier 1" = yang didukung prose). Aturan benar: jumlah level C+M ≥ 3 → Tier 1; = 2 → Tier 2; ≤ 1 → Tier 3 (figure konsisten 9/9).
- S1: M=3 dari skala sampel (approved limit NT$424,18 jt) vs lesson sendiri menghitung buku penuh NT$2.120.900.000 → M=4 (skor 3,20); B juga 3→4 → skor 3,40. Dua skala tanpa pernyataan mana yang dipakai. S2: "shadow" dua makna (shadow-mode tercatat vs model tak terdaftar). S3: sitasi salah — ECE 0,0087 [M7.5] → [M6.4]; PSI 0,25 & ECE 0,02 sebagai [M7.5] → [kebijakan lesson ini]. S4: "nilai model dalam uang" = EL ditahan 66.685.925 adalah overclaim bruto (nilai bersih vs t=0,50 = 27.208.456; margin nasabah baik yang ditolak tak dikurangkan). S5: "total cost 33.046.500" tampil tanpa definisi di samping margin 19.909.500 → tampak 19.909.500 − 33.046.500 = −13.137.000 vs laba +8.214.000. S6: matriks vs rumus skor bertentangan (DL laporan internal: matriks Tier 2, rumus 1,20 → Tier 3). S7: "31 fitur"/"cv=3" — traceable (lihat noise); fix = label [notebook]. N1–N6: basis 2,51% (realised loss), "Rp" 1× → NT$, margin 19.909.500 = 5% × 398.190.000 (basis tak disebut), band M tumpang tindih di 150/300/600, "5 hari kerja" tanpa label, PSI vs bad rate tanpa beda label.

### M8.3 (APPROVE-WITH-FIXES)
- **M1 (MUST, reklasifikasi):** angka 0,0710 BENAR sebagai `m75_pseudo_time_roc_spread` (rentang antar-chunk 0,8138−0,7428), BUKAN roc_drop 0,0388 (0,7816−0,7428). Masalahnya definisi: "ayunan antar-periode" ambigu. Fix = tulis eksplisit "rentang (maks−min) antar-chunk 0,0710; drop vs full-test 0,0388" + "sepuluh kali lipat" tetap konsisten (0,0710/0,0069 = 10,3×).
- S1: ECE 0,0087 [M7.5] → [M6.4]. S3: ambang alert 0,02 sebagai [M7.5] → [kebijakan M7.5]/[kebijakan lesson ini]. S5: peran bocor — Owner = Risk Manager SEKALIGUS penandatangan legal/risk approval; validator tak dinyatakan independen di gerbang (2). N1: gerbang rollback (6) dinomori setelah production tapi "ditulis SEBELUM produksi" (sama kelas dengan M8.5 M2). N2/N5/N6/N7/N8: caption figure, "reweighing AIR 0,9567" & "pita inversi 92 vs 151" tak tertelusur (cek ke M7.4 / labeli [ilustrasi]), rollback version "[ilustrasi] tidak ada" vs aturan "tidak boleh kosong", "pita selebar 0,0069" = range 5 seed (bukan batas populasi), toleransi 0,001 vs sd antar-seed 0,0028 (hanya bermakna bila seed terkunci).

### M8.4 (APPROVE-WITH-FIXES)
- **M1 (MUST):** "gagal 4 gate, 2 belum diuji, 0 lolos" — enumerasi di atasnya G1, G2, G3, G4, **G7** gagal = **5**; 4+2=6 ≠ 7. Checkpoint & kuis Q5 sudah menulis 5. **M2 (MUST):** baseline monitoring champion (0,7816/0,5558, 28,5%/6,67%) diterapkan juga ke challenger → challenger selalu alert (ROC selisih 0,0390 > 0,02; approval 8,25 pp > 5 pp). Fix = baseline per model + gap champion−challenger sebagai metrik tersendiri. **M3 (MUST):** "LR terkalibrasi menyetujui 1.166 nasabah" — TIDAK ADA di kanonik maupun notebook mana pun (grep penuh 5 notebook: 0 kemunculan). Fix = hitung dari data (tambah ke kanonik) atau lunakkan klaim.
- S2: n ramp 120/600/3.000 menyiratkan basis traffic 12.000, bukan test 6.000; n=3.000 pada "ramp 5% diperpanjang" = 50% dari 6.000 (melewati ramp 25%). S3: toleransi bad rate 1,33 pp (canary, ambang 8,00%) vs 1,00 pp (gate naik, 7,67%) tanpa penjelasan. S4: AIR [M7.5] → [M7.1]/[M7.4]. S6: approve-all 82.155.456 tak tertelusur (TIDAK ADA di notebook mana pun); reject-all 41.260.500 terverifikasi via identitas (19.909.500 + 33.046.500 − 11.695.500). Fix S6 = hitung realised loss semua default dari data (atau labeli). S7: lubang gate canary — PSI 0,10–0,25 + bad rate baik tak terdefinisi di prosa (kode lab mengembalikan TAHAN). N1–N7: figure (batang berhenti y=200 vs sumbu 206), "14 kali" = 13,84 → "≈14 kali", G4 "GAGAL ISI" butuh rujukan silang, ECE WASPADA vs KRITIS tak konsisten, "31 fitur" (label [notebook]), "di bawah 30 menit" (label kebijakan), 0,1058/0,0965 (label [ilustrasi]).

### M8.5 (APPROVE-WITH-FIXES)
- **M1 (MUST):** figure langkah 6 — konektor 3→6 (`<line x1="394" y1="88" x2="394" y2="112">` + arrowhead) melewati gerbang 4–5; kotak 4 tak punya konektor masuk. Caption mengklaim "ikuti panahnya, berurutan". **M2 (MUST):** gerbang 6 "Rollback criteria" dinomori setelah production tapi "ditulis SEBELUM produksi". Fix = rumuskan ulang gerbang 6 sebagai VERIFIKASI (rollback criteria ditulis di gerbang 1; produksi batal bila kolom rollback version kosong). **M3 (MUST):** PSI 0,5811 disitasi telanjang [M7.5] di langkah 3 — nilainya BENAR sebagai simulasi S2 (`m75_drift_simulations.S2_pay_plus1.psi_score_vs_baseline_test`), tapi tanpa label "simulasi" ia menyiratkan flagship bergeser 0,58 (kanonik flagship 0,0161 = stabil). Fix = label "PSI simulasi drift S2 = 0,5811 [ilustrasi/simulasi]" di semua kemunculan.
- S1: ambang kebijakan (PSI 0,25; ROC 0,02; PR 0,03; ECE 0,02; AIR 0,80; 10%) tanpa label [kebijakan lesson ini]. S2: kadensi monitoring mencampur metrik berlabel (ROC/PR/bad rate butuh label matang, tak bisa harian) dengan tanpa-label. S3: legal/risk penandatangan (langkah 5) tapi hanya "Consulted" di RACI sign-off (langkah 3). S4: tugas validator hanya outcomes analysis — SR 11-7 mencakup conceptual soundness + ongoing monitoring + outcomes analysis; tak ada pemetaan three lines. S5: 5 tahap (langkah 4) vs 6 gerbang (langkah 6) tanpa pemetaan (keputusan komite tak punya gerbang padanan). N1–N7: "31 fitur" (label), argumen "0,10 berarti beda" via selisih ROC-AUC (non-sequitur — pakai Brier 0,1342 vs 0,1345), disagreement 19,42% dipakai untuk perubahan threshold (padahal itu dua model), tier tanpa angka materialitas M8.2, "tanpa drift" (kuis 6) vs roc_drop 0,0388, "C = validator" di baris proposal, RACI "Validasi independen" A = komite (validator tak Accountable atas opininya sendiri).

## Yang sudah benar (diverifikasi ulang Chief)
- Semua angka flagship/halves/tiering/seed/champion-challenger/shadow cocok kanonik (M8.1 halves, M8.2 approved/EL/realised/skor, M8.3 spread 0,0069/mean 0,7787/sd 0,0028, M8.4 McNemar χ²=209,4730 + sel shadow 830/335 + identitas profit, M8.5 ekonomi threshold + split-half + disagreement).
- Tidak ada penyajian "mean ± sd" sebagai ketidakpastian mean di M8 (M8.1 S4 hanya pembanding yang kurang tepat, bukan salah tafsir).
- McNemar diinterpretasi benar di M8.4 (keputusan ≠ kualitas); PSI dipakai benar tanpa label di M8.3.

## Tindak lanjut (ronde fix — lihat brief koordinator fix)
1. Perbaiki 68 temuan BENAR (TS + .md; notebook TIDAK diubah kecuali patch find_file M7.5).
2. 9 noise: JANGAN ubah angka — sitir kunci kanoniknya (atau label [notebook] untuk cv=3 / 31 fitur / 0,2217).
3. Hitung dari data: LR terkalibrasi approvals (1.166?) + approve-all realised loss (82.155.456?) — bila cocok, simpan ke kanonik + sitir; bila tidak, koreksi angkanya.
4. Batch ke ronde fix ini: sweep "± sd" M6.2/M6.5 (lihat AGENTS.md) + patch notebook M7.5 (find_file) — keduanya ikut deploy M8.
5. QA: gate diff-scoped (M8 + M6.2/M6.5) + fixture must-not baru + guards ALL PASS + tsc 0.

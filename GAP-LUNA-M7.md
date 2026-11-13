# Gap Luna M7 — Laporan Chief (verifikasi induk)

**Tanggal:** 13 Nov 2026, ~16:10 WITA
**Analis:** Luna via Kelontong (`gpt-6-luna`), 1 panggilan streaming, prompt `review-prompts/gap_m7_luna_prompt.txt` (500.372 B).
**Mentah:** `review/gap_luna_m7_raw.txt` (13.673 B).

## Ringkasan

| No. | Severity | Status | Isi |
|---|---|---|---|
| G1 | must-add | HILANG | Monitoring fairness per periode dan per grup di produksi |
| G2 | must-add | HILANG | Intersectional fairness dan audit irisan beberapa atribut |
| G3 | should-add | TIPIS | Ketidakpastian statistik untuk gap fairness selain approval rate |
| G4 | must-add | TIPIS | Monitoring dengan label terlambat, cohort alignment, dan label maturity |
| G5 | should-add | HILANG | Monitoring drift pada explainability/reason codes |
| G6 | must-add | TIPIS | Protokol validasi mitigasi tanpa leakage dan tanpa memilih mitigasi dari test |
| G7 | should-add | TIPIS | Operasionalisasi adverse action: reason code, human review, appeal, dan override |
| G8 | should-add | TIPIS | Data quality dan missingness per grup sebagai bagian audit fairness |
| G9 | should-add | HILANG | Counterfactual/actionable explanations |
| G10 | nice-to-have | HILANG | Model risk governance: versioning, rollback, change control, audit trail teknis |

**Total: 10 gap — 10/10 TERVERIFIKASI BENAR, 0 noise.**

## Verifikasi Chief (grep + hitung dari disk)

- **G1 BENAR (HILANG):** "AIR" 0 kemunculan di M7.5 — dashboard monitoring (PSI, ROC-AUC, approval/bad rate, ECE) tanpa satu pun metrik fairness per grup/periode.
- **G2 BENAR (HILANG):** "intersectional" 0 kemunculan di 5 lesson. Stratifikasi satu atribut ada (M7.2: selisih approval per AGE band, per EDUCATION), irisan SEX×EDUCATION / SEX×AGE tidak ada.
- **G3 BENAR (TIPIS):** Wilson + uji-z hanya untuk approval rate SEX. "bootstrap" 7× hanya di M7.4 (SE threshold 0,0078) — tidak ada CI untuk gap TPR/FPR/FNR/PPV/ECE/Brier/AIR.
- **G4 BENAR (TIPIS):** "label belum matang" hanya peringatan (4 sebutan di M7.5), "cohort" 0 kemunculan — tidak ada prosedur matured cohort / alignment waktu observasi.
- **G5 BENAR (HILANG):** "reason code" 17× di M7.3, 0× di M7.5 — tidak ada monitoring drift atribusi/SHAP/reason-code.
- **G6 BENAR (TIPIS):** M7.4 menyajikan semua mitigasi pada test 6.000 yang sama; M7.3 sudah melabeli angka "HASIL ILUSTRASI PROTOKOL LESSON" (pengakuan ada, protokol tidak diajarkan). Cerminan G2 M6 (three-way split) — di M7 bentuknya protokol pemilihan mitigasi/λ.
- **G7 BENAR (TIPIS):** reason codes diajarkan (M7.3), "human review" hanya implisit via komite (M7.4). Tidak ada workflow operasional (kapan reason code dikirim, eskalasi, appeal, pencatatan override). Catatan: hit grep "banding" adalah false positive — "banding" di lesson = "membandingkan", bukan appeal.
- **G8 BENAR (TIPIS):** "nilai hilang" 1× di M7.2 (satu sebutan dalam measurement bias) — tidak ada tabel/checklist data quality per grup.
- **G9 BENAR (HILANG):** "counterfactual" 0×, "what-if" 0× di 5 lesson. (Notebook flagship punya counterfactual sebagai ⭐ opsional — lesson web tidak mengajarkannya.)
- **G10 BENAR (HILANG, nice):** "rollback" 0×, "versi model" 1× di M7.4 (sebutan, bukan template). Isi berupa template + cross-ref M8 (model risk), bukan materi M8 penuh.

## Catatan Chief untuk ronde fill

1. **Angka fill:** G2 WAJIB dihitung dari data (bukan [ilustrasi]) — buat skrip kalkulasi (pola `m5_gap_fill_calc.py` / `m6_canonical_calc.py`): audit irisan SEX×EDUCATION dan SEX×AGE pada test 6.000 (n, approval, AIR, base rate, FPR, TPR, Wilson CI), simpan sebagai kunci baru di `m7_canonical.json`. G1: lab bandingkan monitoring overall vs per-grup memakai angka kanonis M7.1 + [simulasi] untuk per-periode (kanonik tak punya AIR per chunk — JANGAN mengarang; labeli [simulasi] eksplisit). G3: bootstrap CI — hitung dari data bila memungkinkan (skrip kalkulasi), atau ajarkan prosedur + [notebook]. G4/G6/G7/G10: konseptual + template, tanpa angka baru (kecuali [ilustrasi] yang dilabeli). G5: lab memakai output SHAP kanonis M7.3 + skenario [simulasi]. G8: hitung missingness per grup dari data bila memungkinkan, atau checklist + [notebook]. G9: contoh nasabah 858 konseptual, [ilustrasi]/[notebook], JANGAN mengarang nilai baru.
2. **Jangan ajar ulang M8:** G10 hanya template satu halaman + kuis + cross-ref M8. G6 cross-ref M6.2/M6.4 (three-way split) — jangan ajar ulang split, rujuk.
3. **QA ronde fill (aturan standing):** concept gate kelas baru bila ada (mis. "fairness monitoring ≠ population monitoring", "intersectional audit", "label maturity", "counterfactual ≠ causal"), fixture must-not bila string-lockable; kunci kuis baru di `qa_quiz_numeric_keys.py` bila ada angka baru; re-run concept gate (diff-scoped) + guards (numbers, counts, chapters_legacy, next_hrefs, quiz_keys, lab_regression, tsc) — SEMUA PASS.
4. **Notebook TIDAK diubah** (pola M6) — kecuali bila fill butuh angka [notebook] baru, maka hitung + cantumkan di kanonik, jangan ubah notebook.
5. **Biaya Kelontong ronde M7 sejauh ini:** review 6 panggilan (5 + 1 re-run m72 HTTP 520) + gate fix 3 panggilan + gap Luna 1 panggilan = 10 panggilan. Saldo pasti hanya Septian yang bisa cek (27 coin per 12:41 WITA).

## Langkah berikut

Fill coordinator → verifikasi Chief → deploy M7 (971 lesson) → M8.

# GAP LUNA M8 — Laporan Chief (verifikasi induk)

**Tanggal:** 13 Nov 2026 ~21:00 WITA. Model: `gpt-6-luna` via Kelontong (1 panggilan, prompt `review-prompts/gap_m8_luna_prompt.txt` 410.114 B). Mentah: `review/gap_luna_m8_raw.txt`.

## Ringkasan: 14 gap — 14/14 TERVERIFIKASI BENAR, 0 noise

| No. | Severity | Status | Isi |
|---|---|---|---|
| G1 | must | HILANG | Quantification of uncertainty: CI/bootstrap interval untuk metrik validasi |
| G2 | must | TIPIS | Validation design anti-leakage + temporal/population shift |
| G3 | should | TIPIS | Issue remediation & closure (issue register) |
| G4 | should | HILANG | Risk aggregation: konsentrasi + shared dependency |
| G5 | should | HILANG | Vendor/third-party model |
| G6 | must | TIPIS | Model card: intended users, decision context, prohibited use |
| G7 | should | TIPIS | Production readiness: parity, latency, observability |
| G8 | must | TIPIS | Canary/shadow experiment design: assignment, power, stopping |
| G9 | must | HILANG | Decision policy champion-challenger: non-inferiority, trade-off |
| G10 | must | TIPIS | Operational rollback drill (runbook, replay, reconciliation) |
| G11 | must | TIPIS | Exception/override management |
| G12 | should | HILANG | Governance operating evidence: quorum, CoI, SLA |
| G13 | should | TIPIS | Lifecycle linkage: ID konsisten lintas artefak |
| G14 | nice | HILANG | End-to-end capstone |

## Verifikasi Chief (grep atas 5 lesson TS pasca-fix)

- **G1 BENAR:** "confidence interval"/"bootstrap"/"interval kepercayaan" = 0× di seluruh M8. Kutipan Luna ("sd satu skor ROC-AUC ≈ 0,008–0,009 [ilustrasi]", "0,0139 hanya sekitar 1,1–1,3 sd selisih") ADA di M8.1 pasca-fix S4 — Luna mengutip teks fix dengan benar. Catatan: M6.2 SUDAH mengajarkan CI naif nested CV [0,7799; 0,7918] — fill WAJIB cross-ref M6.2, jangan ajar ulang CI dari nol; yang baru = bootstrap CI untuk bad rate/ECE/profit + aturan verdict bila interval melintasi ambang.
- **G2 BENAR:** "leakage" 1× (M8.3, sebutan sepintas), "temporal split"/"group split"/"feature availability" 0×. M6.2 SUDAH mengajarkan anti-leakage (Pipeline) + time-series CV — fill cross-ref M6.2; yang baru di M8 = desain validasi (temporal/group split, feature availability check, larangan reuse test final untuk memilih challenger).
- **G3 BENAR:** "issue register"/"due date"/"closure" 0×. Konsep temuan/kondisi ada (M8.1, M8.5), format register + closure discipline tidak ada.
- **G4 BENAR:** "aggregation" 1× (M8.1, bukan agregasi risiko model); "concentration"/"shared dependency"/"kegagalan bersama" 0×.
- **G5 BENAR:** "vendor"/"third-party"/"pihak ketiga" 0×.
- **G6 BENAR:** "intended user"/"prohibited use"/"penggunaan terlarang" 0×. M8.3 punya tujuan + limitations, tanpa seksi intended users/prohibited use.
- **G7 BENAR:** "latency"/"feature parity"/"schema validation"/"throughput"/"observability" 0×.
- **G8 BENAR:** "random assignment"/"statistical power"/"contamination" 0×; "ukuran sampel" 6× di M8.1 hanya soal n belahan/sampel kecil, bukan desain eksperimen canary.
- **G9 BENAR:** "non-inferiority"/"equivalence" 0×; "trade-off" 1× (sebutan sepintas di M8.4).
- **G10 BENAR:** "replay"/"runbook" 0×; "rekonsiliasi" 1× di M8.4 = rekonsiliasi sel shadow ke profit, bukan replay pasca-rollback.
- **G11 BENAR:** "exception tertulis" 1× + "override" 1× (M8.1, disebut tanpa prosedur).
- **G12 BENAR:** "quorum" 0×; "konflik kepentingan" 2× (M8.1, disebut tanpa protokol keputusan).
- **G13 BENAR:** "model_version" 4× (M8.3, field kartu saja); "model_id"/"deployment_id" 0×; tidak ada latihan linking lintas artefak.
- **G14 BENAR:** "capstone" 0×.

## Catatan untuk ronde fill
- G1/G2: angka interval baru dihitung dari data (bootstrap) via skrip kalkulasi, label [turunan]; cross-ref M6.2 (CI naif + Pipeline anti-leakage) — JANGAN ajar ulang.
- G8/G9/G12: angka/threshold baru = [kebijakan lesson ini] / [kebijakan organisasi] / [ilustrasi] — JANGAN disajikan sebagai angka data.
- G6/G13: perluasan template JSON model card + lab yang gagal bila field kosong / ID mismatch.
- G14: capstone di akhir M8.5 (wajib + rubric); bukan lesson baru.
- Struktur akhir yang diharapkan (indikasi): M8.1 +2 langkah (G1, G2) + G3; M8.2 + G4, G5; M8.3 + G6, G13; M8.4 + G7, G8, G9, G10; M8.5 + G11, G12, G13, G14. Koordinator fill boleh menyesuaikan penempatan bila ada alasan yang dicatat.

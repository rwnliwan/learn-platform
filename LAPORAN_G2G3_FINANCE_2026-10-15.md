# LAPORAN G2+G3 KLASTER FINANCE/RISK — 2026-10-15

Koordinator: subagent klaster finance/risk. Scope dari AUDIT_GAP_SEMUA_TRACK_2026-10-15.md: klaster (cr, mr, fr/aml, rr, mk, fm, pm) hanya punya **12 item G2 dan 0 item G3**. cr/rr/fr-aml sudah 100% selesai di G1. Total klaster setelah gelombang ini: 12/12.

## Ringkasan hasil

| Tim | Lesson | File | Langkah | Quiz | Lab | Status |
|---|---|---|---|---|---|---|
| A | mr26 — Tail Risk Hedging | mr26-tail-risk-hedging.ts | 10 | 5 | 2 | ✅ |
| A | mk20 — GA4: Pengukuran Berbasis Event | mk20-ga4.ts | 9 | 5 | 2 | ✅ |
| A | mk21 — Server-Side Tracking & CAPI | mk21-server-side.ts | 10 | 5 | 1 | ✅ |
| A | mk22 — CDP & Identity Resolution | mk22-cdp.ts | 9 | 5 | 1 | ✅ |
| B | e19 — Real Estate & REIT | e19-real-estate-reit.ts | 8 | 6 | lab | ✅ |
| B | e20 — Asuransi & Dana Pensiun | e20-asuransi-dana-pensiun.ts | 8 | 6 | lab | ✅ |
| B | e21 — Investment Banking | e21-investment-banking.ts | 9 | 6 | lab | ✅ |
| B | e22 — Reksa Dana & ETF | e22-reksa-dana-etf.ts | 8 | 6 | lab | ✅ |
| C | pm-d7 — Factor Investing | pm-d7-factor-investing.ts | 9 | 5 | 2 | ✅ |
| C | pm-d8 — Risk Parity & Risk Budgeting | pm-d8-risk-parity-budgeting.ts | 9 | 5 | 2 | ✅ |
| C | pm-d9 — CPPI & Asuransi Portofolio | pm-d9-cppi.ts | 9 | 5 | 2 | ✅ |
| C | pm-d10 — Rebalancing | pm-d10-rebalancing.ts | 9 | 5 | 2 | ✅ |

## Verifikasi koordinator (independen, bukan klaim tim)

- **tsc --noEmit: 0 error** di 12 file + reg-mr/reg-mk/reg-e/reg-pm2. Error pre-existing HANYA di file klaster lain yang masih dikerjakan tim paralel (de20-access-control.ts, dm20-reference-data.ts, b19-mcmc.ts, a317-quantile-regression.ts) — tidak disentuh.
- **tasks:** setiap langkah di semua 12 file punya properti `tasks` (10/10, 9/9, dst.).
- **summary:** ada di checkpoint 12/12 (panel "Poin penting" terisi sejak LANGKAH 1).
- **F1:** bersih 12/12. Satu temuan & perbaikan koordinator: `mk22-cdp.ts` baris 88 mengandung "(lihat lesson server-side)" → diganti ringkasan inline 1 kalimat tentang tracking server-side (F2 mewajibkan ringkasan, bukan referensi).
- **Quiz:** tiap soal tepat 4 opsi + 1 correct + feedback why spesifik; total 20 (A) + 24 (B) + 20 (C) soal.
- **Lab:** semua kode Python lolos `compile()`; Tim A 6/6 solusi dieksekusi match output; Tim C menemukan & memperbaiki bug model CPPI (cushion negatif di-clamp `max(0, m×C)`); Tim B mengekstrak solusi dari .ts dan menguji stdout nyata.
- **Registrasi:** hanya reg-mr.ts (mr26), reg-mk.ts (mk20–22), reg-e.ts (e19–22), reg-pm2.ts (pm-d7–d10 — Tier D memang di reg-pm2, diverifikasi via grep sebelum ditulis). Tidak menyentuh registry.ts, Workspace.tsx, reg lain, atau lesson existing.
- **Duplikat slug:** 587 slug di registry, 0 duplikat; 12 slug baru terdaftar 12/12.
- **F2 / matriks kepemilikan:** mitigasi (a) ditulis inline di semua lesson (mr11/mr5, mk2, mk4, e2/e3/e6/e7, pm-a2/a8/a10/b1/b6/c3/c4); mk21 memuat ringkasan model event GA4 (urutan mengikat mk20→mk21 terpenuhi); mk22 tidak membahas two-tower engineering (milik mle20); e21 sudut FM tetap milik FM.

## Catatan
- cr, mr25, aml20/21, fr24, rr25/26: G1, sudah live — tidak dibangun ulang.
- Urutan mengikat mk20→mk21: terpenuhi dua arah (mk20 selesai duluan + mk21 self-contained).
- Browser test (KaTeX/quiz/lab di mobile+desktop+dark) belum dilakukan — di luar wewenang tim; diserahkan ke gerbang parent.

Laporan per tim: LAPORAN_G2G3_FINANCE_TEAM-A/B/C_2026-10-15.md.

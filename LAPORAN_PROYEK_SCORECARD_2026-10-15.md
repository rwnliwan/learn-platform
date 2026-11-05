# LAPORAN PROYEK #3 — "Credit Scorecard End-to-End" (`pj-scorecard-kredit`)

Tanggal: 2026-10-15 · Status: **KONTEN SELESAI, TERVERIFIKASI** — wiring (registry/route/galeri) & deploy di tangan parent.

## 1. Struktur proyek

16 langkah, `estMinutes: 300` (multi-sesi, dinyatakan di briefing), track `Credit Risk`, module `Proyek Terpandu`.

| # | ID | Jenis |
|---|----|-------|
| 1 | `briefing` | Briefing (peran analis risiko kredit, CRO, ScoreFast Pro; multi-sesi 300 mnt; prereqSummary; datasetNote) |
| 2 | `dataroom` | Data room + Miskonsepsi #1 (holdout untuk seleksi fitur) |
| 3 | `lab-eda` | **Lab 1** — EDA & data quality (4 checks) |
| 4 | `lab-binning` | **Lab 2** — binning/WOE/IV + quiz (3 soal) + Miskonsepsi #2 |
| 5 | `lab-model` | **Lab 3** — IRLS logistic + skala skor PDO + KaTeX + Miskonsepsi #3 (5 checks, forbids sklearn) |
| 6 | `keputusan-fitur` | Decision 1: pakai vs buang fitur leakage |
| 7 | `jalan-pakai` / `jalan-buang` | Cabang konsekuensi (`goto: "lab-validasi"`) |
| 8 | `lab-validasi` | **Lab 4** — holdout AUC/KS/PSI + tradeoff cutoff + quiz (3 soal) + Miskonsepsi #4 (6 checks) |
| 9 | `keputusan-cutoff` | Decision 2: cutoff 500 (longgar) vs 560 (ketat) |
| 10 | `konsekuensi-longgar` / `konsekuensi-ketat` | Cabang konsekuensi (`goto: "audit-vendor"`) |
| 11 | `audit-vendor` | `auditDossier` vendor ScoreFast Pro: 6 baris + 4 injections (I1–I4) |
| 12 | `deliverable` | Memo scorecard (template 5 paragraf, rubrik 4 kriteria @ 25%) |
| 13 | `debrief` | Reveal 4 injections + Miskonsepsi #5 |
| 14 | `rangkuman` | 7 poin rangkuman |

Ekspor: `export const pjScorecardKredit: V2Lesson` + `export const pjScorecardKreditMeta = { role, client, tagline }`.

## 2. Sumber data + atribusi

- **Statlog German Credit Data** (Prof. Dr. Hans Hofmann), via UCI Machine Learning Repository — lisensi **CC BY 4.0**, **DOI 10.24432/C5NC77** (keduanya terverifikasi dari halaman UCI, bukan dari ingatan). Atribusi dicantumkan di briefing (`datasetNote`) dan `METODE.md`.
- Snapshot deterministik di `public/proyek/pj-scorecard-kredit/`: `train.csv` (700 baris, bad rate 30%), `holdout.csv` (300 baris, bad rate 30%) — split stratified seed 42. Total ~131 KB (< 5 MB).
- Kejujuran yang didokumentasikan di briefing + METODE.md: (1) mata uang Deutsche Mark, data historis Jerman — generalisasi butuh caveat; (2) train.csv **sengaja dikotori** (8 `age` kosong, 3 `duration`=999) untuk latihan data quality — holdout bersih; (3) kolom `status_kolektibilitas` adalah **sintetis** (seed 42) sebagai latihan deteksi leakage — bukan bagian German Credit asli.

## 3. Hasil harness (ekstrak solusi dari .ts → run vs CSV, CPython)

**22/22 checks PASS, 0 failures** (diulang setelah semua edit; starter code juga compile OK, `\${` = 0):

- Lab 1: n_baris=700 ✓, bad_rate=0.30 ✓, missing_age=8 ✓, outlier_dur=3 ✓
- Lab 2: iv_checking=0.6396 ✓, iv_savings=0.2294 ✓, **iv_leak=3.2576** ✓ (tersangka kebocoran), `woe_iv` defined ✓
- Lab 3: beta0=−0.8540 ✓, auc_train=0.7958 ✓, factor=28.8539 ✓, offset=487.12 ✓, no sklearn ✓
- Lab 4: auc_holdout=0.7790 ✓, ks_holdout=0.4905 ✓, psi=0.0437 ✓, appr_500=0.67 ✓, bad_500=0.1493 ✓, tabel cutoff tercetak ✓
- `npx tsc --noEmit`: **0 errors** project-wide (tidak ada error baru; baseline bersih).

## 4. Angka performa jujur scorecard (model kanonis, 9 fitur)

| Metrik | Train | Holdout |
|---|---|---|
| AUC | 0.7958 | 0.7790 |
| KS | 0.4952 | 0.4905 |
| PSI (desil train→holdout) | — | 0.0437 (stabil) |

Gap train–holdout 0.02 = noise wajar pada 300 baris holdout, bukan overfit. Skala: PDO 20, basis 600 @ odds 50:1 → factor 28.8539, offset 487.12.

**Tradeoff cutoff (holdout):** 480 → approval 83.0% / bad 21.3% · **500 → 67.0% / 14.9%** · 520 → 49.3% / 12.8% · 540 → 32.3% / 11.3% · **560 → 17.0% / 13.7%** · 580 → 4.7% / 7.1%.

**Model leakage** (dengan `status_kolektibilitas`): train AUC 0.9449 / holdout 0.9096 — inilah angka yang meng-grounding klaim vendor "0.94" di dossier audit.

## 5. Impostor (dossier ScoreFast Pro) — 4 injections

- **I1**: `status_kolektibilitas` IV 3.21 — definisi "status pada akhir periode observasi" → fitur post-origination (paralel dengan godaan Decision 1).
- **I2**: AUC 0.94 pada "development sample" → angka training dijual sebagai validasi.
- **I3**: PSI 0.04 "development vs out-of-time" dengan kedua periode Jan–Jun 2019 → klaim stabilitas palsu.
- **I4**: bad rate 2.8% @ cutoff 620 pada "segmen prime" (definisi internal) → cherry-picked population.

2 baris jujur sebagai umpan: checking_status IV 0.64, metodologi WOE+logistik.

## 6. File yang dihasilkan

- [pj-scorecard-kredit.ts](sandbox://workspace/learn-platform/src/app/v2/content/pj-scorecard-kredit.ts) — konten (1000+ baris, 16 langkah)
- Data snapshot: `~/workspace/learn-platform/public/proyek/pj-scorecard-kredit/` (train.csv, holdout.csv, METODE.md)
- Harness: `/tmp/harness_scorecard.py` (ephemeral; pola: ekstrak `solution` via regex+ast, rewrite URL → path lokal)

## 7. Catatan untuk parent (wiring)

- Registry/route/galeri **belum** dikerjakan (sesuai instruksi).
- Semua `nextStepId`/`goto` menunjuk ke step id yang ada (jalan-pakai/jalan-buang → lab-validasi; konsekuensi-* → audit-vendor).
- AGENTS.md lesson baru yang relevan: pola `\${`=0 sudah dipatuhi; `auditDossier` memakai shape `{version, snapshotDate, intro, columns, rows: [{rowId, cells, claims}], injections: [{key, rowIds, title, clue, danger}]}`; `deliverable` = `{template: string[], rubric: [{criterion, weight, levels}]}`; rangkuman step = `summary: string[]` (bukan `rangkuman:`).
- Lab memakai `requires: ["pandas"]` saja; CSV di-load via `open_url("/proyek/pj-scorecard-kredit/...")` — route statis public/ sudah ada.

# RAPAT VERIFIKASI TOTAL — Learn v2 + Brain (2026-10-14)

Instruksi Septian 2026-10-14 05:06 WITA. Koordinator: subagent 94b3a0d9. Standar: verifikasi penuh dulu, baru kabari.
Deploy live: https://583dd001.learn-platform-cyo.pages.dev (kanonik https://learn-platform-cyo.pages.dev)

## Ringkasan eksekutif

| Item | Sebelum | Sesudah |
|---|---|---|
| Total lesson | 442 | **473** (+31) |
| Total track | 24 | 24 (tetap) |
| Dashboard /v2 tampilkan track baru | TIDAK (0 dari 12) | **YA — 24/24 track** |
| Lesson di bawah standar (<45 mnt) | 146/148 (median 36,5) | **0** (re-audit semua ≥45) |
| Lab lolos Pyodide asli | 148/148 (batch lama) | **179/179** (semua baru+diperdalam) |
| Render KaTeX/SVG (179 lesson, tiap step) | spot-check | **penuh: 0 katex-error, 0 SVG rusak, 0 overflow** |
| Regulasi rr10 | caveat belum terverifikasi | **11 klaim terverifikasi ke sumber primer, caveat dihapus** |
| Brain decay 2 vs 4 | belum jelas | **keduanya 0 eligible — tidak ada yang perlu dihabiskan** |

## TUGAS 1 — Visibilitas dashboard v2: SELESAI

**Akar masalah** (`src/app/v2/page.tsx`, fungsi `trackCounts()`): dashboard menghitung track dari `fs.readdirSync("src/app/learn")` — folder v1 legacy yang hanya berisi 13 track lama. Track baru hidup di `src/app/v2/content/*.ts` + registry, tak punya folder di sana → tak pernah terbaca. Plus `TRACK_NAMES` hardcoded 13 label lama.

**Fix**: agregasi dinamis dari `getV2Lessons()`, dikelompokkan per `l.track`; hapus `TRACK_NAMES` hardcoded; deep-link ke `/v2/learn?track=track-<slug>`. Tidak ada angka hardcode tersisa (total lesson dinamis).

**Bukti live** (domain kanonik, curl 2026-10-14): `/v2` → 24 baris track, 12 nama track baru hadir; `/v2/learn` → 24 accordion, hitungan per track benar (38/36/34/29/20/20/19×4/18×3/17×2/16/15×2/14×2/13×3 = 473).

## TUGAS 2 — Audit kedalaman + gap analysis: SELESAI

**Audit** (`AUDIT_KEDALAMAN_2026-10-14.json`, parser TS langsung dari content files):
- Model durasi terukur: `menit = kata_terbaca/180 + lab×8 + quiz×2 + chart×2,5 + case×6 + rumus×1` (180 kpm = baca studi konten teknis).
- Hasil: **2/148 memenuhi standar; 146/148 di bawah** (min 32,7 · median 36,5 · max 55,1). `estMinutes` deklarasi (median 50) tidak didukung isi.
- Komponen hilang tersering: 💡 tips (89 lesson, 7 track nol total), objectives (74 lesson, 5 track nol), chart tanpa panduan (36), rumus tanpa penjelasan simbol (23), quiz feedback lemah (17).

**Gap analysis** (deep research lowongan + silabus sertifikasi, tiap gap diverifikasi via grep isi — bukan judul):
- Kelompok A (`GAP_ANALYSIS_KELOMPOK_A_2026-10-14.md`): BI tanpa DAX/Power Query/RLS (gap job-readiness terbesar); RR tanpa ECL/RWA/VaR/CAR; DE tanpa dbt/CI/CD; DBA hanya butuh scripting + partitioning; Fraud & AML hanya butuh topik CAMS baru.
- Kelompok B (`GAP_ANALYSIS_KELOMPOK_B_2026-10-14.md`): AAI tanpa MCP; AIE tanpa hybrid search+reranking; MLE tanpa algoritma klasik/tuning/tracking; DLE tanpa YOLO/U-Net; MLOps tanpa experiment tracking; LLMOps tanpa vLLM; BCD tanpa cross-chain tracing/indexing/oracle.

**Perdalaman 146 lesson** (4 agen penulis, WORKFLOW.md penuh, tanpa padding):
- Grup Risk: 22 lesson 34–38 → 46,9–53,8 mnt (+step pendalaman, lab kedua, 2 tips/lesson).
- Grup Data: 40 lesson → 45,6–52,8 mnt (+objectives 40/40, tips 40/40, lab kedua 40/40, panduan chart semua figure DE).
- Grup AI: 50 lesson → 46,2–55,9 mnt (+tips, formulaNote, quiz diperkuat).
- Grup Ops: 36 lesson → 45,9–48,3 mnt (+objectives, panduan chart).
- Re-audit: **semua ≥45 menit**.

**31 lesson gap baru** (semua WORKFLOW.md penuh, lab dieksekusi):
- RR: rr15 risk appetite & limit, rr16 ECL/RWA, rr17 BCBS 239, rr18 market risk (VaR) · AML: aml9 VASP, aml10 IRA, aml11 terrorist financing.
- BI: biz15 DAX, biz16 Power Query/M, biz17 RLS · DE: de15 CI/CD, de16 dbt, de17 backfill · DBA: dba13 otomasi, dba14 partitioning.
- AAI: aai13 MCP, aai14 context engineering, aai15 hardening · AIE: aie13 hybrid search · MLE: mle15 ML klasik, mle16 Optuna, mle17 tracking, mle18 systems design, mle19 SHAP · DLE: dle13 YOLO, dle14 U-Net.
- MLOps: mlops13 experiment tracking · LLMOps: llmops13 vLLM/TGI · BCD: bcd13 cross-chain, bcd14 indexing, bcd15 oracle.
- Registry: 473 slug unik, 0 duplikat, 0 import hilang (terverifikasi via script).

## TUGAS 3 — Verifikasi teknis: SELESAI

**Lab Pyodide** (runtime asli: `pyodide@0.26.4` npm = versi persis app, WASM lokal, harness = salinan persis `buildScript()` dari `pyodide.worker.ts`, sha256 paket terverifikasi):
- 179/179 lesson PASS (semua lab step, checks dari output nyata). 0 missingRequires.
- 13 lesson diperbaiki koordinator pasca-tulis penulis: aai13 (slice [:17]→[:18]), bcd14 (expected 6→9 baris, (460,6)→(560,5)), bcd15 (narasi TWAP diselaraskan ke data aktual: 4110,3, bukan 4207,3), biz17 (variabel s_nilai→saran), aml11 (set→sorted list), aml5 (tuple→list + pattern), aml7 (pattern regex `\['kapan'\]`), mlops13 (check equal→defined untuk fungsi), rr12 (check equal→stdout), rr13 (pattern regex invalid `\>`), rr17 (kurung tak escape), rr8 (check equal→stdout).
- Temuan pola untuk build lesson berikutnya: check `equal` tak bisa untuk tuple (JSON), pattern regex butuh backslash ganda di source TS, `requires` wajib untuk paket unvendored.

**Render KaTeX/SVG** (Playwright Chromium 390×844, tiap step dari 179 lesson di-klik):
- 237 render KaTeX, 210 figure SVG: **0 katex-error, 0 SVG rusak, 0 overflow, 0 page error**.
- Bug sistemik ditemukan & diperbaiki: 40 file pakai `String.raw` + backslash ganda (KaTeX terima `\\` = line break); bcd2-data campur tunggal/ganda + backtick dalam formula (diperbaiki, render ulang 0 error).
- Catatan: WORKFLOW.md baris 108 sudah benar (contoh backslash tunggal); tuduhan agen Ops tidak terbukti.

**Durasi**: model eksplisit di atas; semua 179 lesson baru/diubah ≥45 menit (re-audit).

## TUGAS 4 — rr10 regulasi: SELESAI

11 klaim diverifikasi ke sumber primer (peraturan.go.id, ojk.go.id, bi.go.id, diakses 13 Okt 2026):
- APOLO (POJK 37/2019); LHBU dicabut → **PBI 21/9/PBI/2019**; SLIK = POJK 18/2017 (dikelola OJK sejak 1 Jan 2018, tenggat **tgl 12**); KPMM min 8% (POJK 11/2016); LCR min 100% (POJK 42/2015); NSFR min 100% (POJK 50/2017); BMPK ≤10% modal (POJK 32/2018); LPBBTI bulanan ≤10 hari kerja / tahunan 30 April (POJK 10/2022); denda SLIK Rp1 jt/100 rb per hari kerja (Pasal 32–33).
- 1 diperbaiki (tenggat SLIK), caveat dihapus, `tsc` 0 error.

## TUGAS 5 — Brain decay: SELESAI

- `vm_batch.py` baris 69: **decay = 4** (terverifikasi readback; tidak diubah).
- Stok eligible (replikasi EXACT preflight `next_batch()`, Turso, dedup per decay): **decay=2 → 0; decay=4 → 0**. Breakdown identik: 928 sudah disimulasikan, 17 field invalid, 8 dead field, 15 frozen family.
- **Temuan teknis baru**: preflight-b (hash ekspresi lintas setting APAPUN) selalu terpicu sebelum cek dedup per-decay → flip decay 2↔4 **tidak bisa membuka stok baru** dalam logika live. Jawaban untuk Septian: **decay 2 habis, decay 4 juga habis — tidak ada yang perlu "dihabiskan dulu".**
- Tidak ada flip, tidak ada wave baru, tidak ada perubahan filter. Batch idle & sehat. Hasil di-append ke `~/memory/2026-10-14.md`. Cron 06:46 tidak disentuh.

## Build & deploy

- `npx tsc --noEmit`: 0 error. `npm run build`: exit 0, **473 route `/v2/learn/*` terprerender**.
- `next-on-pages` (NODE_OPTIONS 4GB): exit 0. `wrangler pages deploy` → **https://583dd001.learn-platform-cyo.pages.dev** (bundle 800 KB).
- QA pasca-deploy (kanonik): 6/6 URL 200; dashboard 24 track; kurikulum 24 accordion + hitungan benar; regresi `/learn/*` 200.
- check-responsive: `/v2/learn` 0 temuan; `/v2` hanya noise `.tblwrap` yang sudah didokumentasikan (verifikasi Playwright: `documentElement.scrollWidth` = 390 = viewport → halaman tidak scroll).

## Yang masih jujur belum

1. Wrapper JS Pyodide worker di browser/HP sungguhan (load dari CDN di perangkat Septian, timeout 10 dtk) — ranah uji on-device.
2. QA ini menguji solution (kode benar); tidak membuktikan setiap jawaban salah learner ditolak dengan pesan tepat.
3. Durasi = model estimasi terukur, bukan pengukuran baca manusia.
4. Keputusan Brain berikutnya (wave baru / reset family / ubah filter) menunggu ACC Septian — tidak dieksekusi.

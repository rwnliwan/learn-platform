# LAPORAN — Proyek Terpandu #2: Audit Portofolio & Konsentrasi Tersembunyi
`pj-audit-portofolio` · dibangun 2026-10-15 · TIDAK ADA DEPLOY (konten saja; wiring registry/route/galeri dikerjakan parent)

## 1. Ringkasan
- File konten: [src/app/v2/content/pj-audit-portofolio.ts](sandbox://workspace/learn-platform/src/app/v2/content/pj-audit-portofolio.ts)
  — `export const pjAuditPortofolio: V2Lesson` (track `Portfolio Management`, module `Proyek`, estMinutes 300)
  — `export const pjAuditPortofolioMeta = { role, client, tagline }`
- Snapshot: `public/proyek/pj-audit-portofolio/` — fund.csv, industri.csv, faktor.csv, deck_manajer.csv, METODE.md (total < 20 KB, batas 5 MB)
- 15 langkah (rentang wajib 13–16): briefing(1) → data room(2) → 4 lab Python(3–6) → checkpoint keputusan bercabang(7) → 3 konsekuensi(8, eyebrow sama, `goto: "audit"`) → dossier audit(9) → deliverable memo ber-rubrik(10) → debrief(11) → rangkuman(12) → kuis 4 soal(13)
- Peran: auditor independen; klien: Komite Investasi Dana Pensiun Nusantara (fiktif), alokasi Rp 400 miliar. Multi-sesi dinyatakan eksplisit di briefing.

## 2. Sumber data & lisensi/atribusi
- **NYATA — Kenneth French Data Library** (Kenneth R. French, Dartmouth; https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/), data publik untuk riset & edukasi. File primer: `10_Industry_Portfolios.txt` (blok Average Value Weighted Returns — Monthly) + `F-F_Research_Data_Factors.txt` (Mkt-RF, SMB, HML, RF), vintage CRSP 202608 — salinan mentah di `~/workspace/portfolio-audit/data/raw/` (unduh 2026-09-29, SHA-256 di `DATA_VERSION.md` proyek itu; dipakai ulang = karya Day-1 Septian sendiri). Slice 2015-01–2024-12 (120 bulan). Atribusi penuh di briefing `datasetNote` + METODE.md.
- **SINTETIS deterministik — seri "dana manajer"** (seed 42, `numpy.random.default_rng(42)`): campuran berbobot 10 industri + noise N(0; 0,25%/bln). Bobot: HiTec 0,45 · Enrgy 0,25 · Manuf 0,06 · NoDur 0,05 · Shops 0,05 · Hlth 0,05 · Telcm 0,04 · Utils 0,03 · Durbl 0,01 · Other 0,01 → 2 teratas = 70%, HHI(true) = 0,2788.
- **FIKTIF — klaim deck** (`deck_manajer.csv`): 9 baris rekaan pedagogis; 5 di antaranya suntikan impostor.
- Kejujuran metodologi dinyatakan di METODE.md + briefing: portofolio French = konstruksi riset (bukan ETF investable); seri dana sintetis; yang nyata = seri pasar & semua statistik turunannya. Repro: `/tmp/pj_build_final.py` (seed 42) → CSV identik.

## 3. Angka kunci konsentrasi (menjadi nilai acuan checks)
| Metrik | Nilai hitung | Klaim deck | Vonis |
|---|---|---|---|
| Sharpe annualized (excess), 2015–2024 | **0,73** | 1,42 | Runtuh |
| Sharpe jendela klaim (2020–2021) | **0,99** | 1,42 | Runtuh 2× (cherry-pick + gelembung) |
| Bobot efektif (OLS): HiTec / Enrgy | **0,44 / 0,25** | "merata di 10 sektor" | Runtuh |
| HHI / N efektif | **0,27 / 3,66** | 10 sektor | Runtuh |
| Regresi Mkt-RF+SMB+HML: R² / alpha | **0,93 / +0,65%/thn** | alpha +4,2% | Runtuh (beta, bukan skill) |
| Beta pasar | **1,04** | — | — |
| Maximum drawdown | **−25,85%** | −8% | Runtuh |
| Korelasi rata-rata antar-industri | **0,61** | 0,32 | Runtuh (angka karangan) |

## 4. Hasil harness lab (bukti)
Skrip: `/tmp/pj_harness.py` — mengekstrak 4 solusi Python langsung dari file TS (termasuk resolusi konkatenasi `"..." + BASE + "..."`), menjalankan dengan CPython vs CSV snapshot, mereplikasi semantik checks (`defined`, `equal`+tol):
- **ALL PASS — 18/18 checks**: Lab 1 (6: 120 baris, 2015-01–2024-12, Sharpe 0,73, DD −25,85) · Lab 2 (7: HiTec/Enrgy, bobot 0,44/0,25, HHI 0,27, N-eff 3,66, korelasi 0,61) · Lab 3 (3: R² 0,93, alpha 0,65, beta 1,04) · Lab 4 (2: Sharpe cherry 0,99, full 0,73)
- Solusi memakai pola misi (`from pyodide.http import open_url`, `requires: ["pandas"]`, `lockLines: 8`, `print` ringkasan) — siap jalan di Pyodide browser.

## 5. Verifikasi struktur & standar
- `npx tsc --noEmit` repo-wide: **0 error** (file baru tidak menambah error)
- nextStepId (3 opsi keputusan) → id cabang (vonis-aman/eskalasi/tunda) cocok; ketiga cabang `goto: "audit"`
- Dossier: 10 baris, 5 suntikan (rowIds 1–5) dengan clue + danger per pola misi
- Rubrik deliverable: 30+25+25+20 = **100**
- Kuis: 4 soal, masing-masing tepat 1 jawaban benar + `why` spesifik (F4)
- Pola `\${` = 0 · tanpa entitas HTML di prosa (RAW) · KaTeX mengikuti konvensi byte file misi terverifikasi · frasa F1 tidak ditemukan · setiap langkah punya `tasks` · `summary` di langkah rangkuman
- Tidak menyentuh registry, route, galeri, maupun konten rr19 (flagship #1 utuh)

## 6. Catatan untuk parent (wiring)
- Daftarkan `pjAuditPortofolio` di registry proyek/galeri Proyek; route `/v2/proyek` kini galeri — proyek ini kandidat kartu #2.
- Formula KaTeX memakai backslash ganda di byte file = konvensi identik `misi-var-backtest.ts` (terverifikasi render di produksi).
- Estimasi bobot OLS di Lab 2 memakai `np.linalg.lstsq` tanpa intercept — di debrief/memo dinyatakan sebagai ESTIMASI (bukan holdings aktual); kejujuran ini bagian dari rubrik.

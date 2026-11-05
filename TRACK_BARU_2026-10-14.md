# Track Baru Learn v2 — Laporan Pagi 2026-10-14

> ⚠️ KOREKSI BATCH BRAIN (baca SEBELUM langkah 2 cron): hitungan Turso mentah malam ini MENYESATKAN (36 baris semua terfilter preflight) — status "batch selesai" cek via `decay_watch_count.py` (hasil 01:55 WITA: pending 0, batch SELESAI). Decay SUDAH dikembalikan 2→4 (01:55 WITA, terverifikasi) — jangan flip ulang. Detail: `~/workspace/goals/batch-brain-overnight-laporan-pagi/hidden_files/KOREKSI_LAPORAN_PAGI_2026-10-14.md`.
>
> ⚠️ ADDENDUM RAPAT VERIFIKASI 2026-10-14 (instruksi Septian 05:06 WITA, koordinator 94b3a0d9): angka di bawah ini DIPERBARUI. Total lesson kini **473** (+31 lesson gap baru, 146 lesson diperdalam hingga ≥45 mnt). Dashboard /v2 kini menampilkan 24 track (fix: agregasi dari registry, bukan folder v1). Lab 179/179 PASS di Pyodide asli; render KaTeX/SVG penuh 0 error; rr10 terverifikasi ke sumber primer (caveat dihapus). Brain: decay=4 terverifikasi; stok eligible decay=2 → 0, decay=4 → 0 (preflight-b membuat flip decay tak bisa buka stok baru). Detail: `~/workspace/learn-platform/RAPAT_VERIFIKASI_2026-10-14.md`. Deploy live: https://583dd001.learn-platform-cyo.pages.dev.

Instruksi Septian (2026-10-14 00:23): rename Fraud & ML → Fraud & AML + pendalaman, track Risk Reporting, 10 track peran baru. Koordinator: subagent 0deb6ef2. Total: **294 → 442 lesson** (+148).

## 1. Rename — SELESAI
- "Fraud & ML Analytics" → **"Fraud & AML Analytics"** di 23 file `src/app/v2/content/fr1–fr23.ts` (field `track` + 1 referensi prose di fr23).
- Verifikasi: 0 sisa kemunculan string lama di `src/`. Breadcrumb live terkonfirmasi ("Fraud & AML Analytics / Anti Money Laundering / AML1 …").

## 2. Track baru — 12/12 agen selesai, semua 148 lesson tertulis

| Track | Lesson | File konten | Registry | Status |
|---|---|---|---|---|
| Fraud & AML Analytics (pendalaman) | +8 (aml1–aml8) | `content/aml*.ts` | append `reg-fr.ts` (31 entri) | ✅ |
| Risk Reporting | 14 (rr1–rr14) | `content/rr*.ts` | `reg-rr.ts` (REG_RR) | ✅ |
| Agentic AI Engineer | 12 (aai1–aai12) | `content/aai*.ts` | `reg-aai.ts` (REG_AAI) | ✅ |
| AI Engineering | 12 (aie1–aie12) | `content/aie*.ts` | `reg-aie.ts` (REG_AIE) | ✅ |
| Machine Learning Engineer | 14 (mle1–mle14) | `content/mle*.ts` | `reg-mle.ts` (REG_MLE) | ✅ |
| Deep Learning Engineer | 12 (dle1–dle12) | `content/dle*.ts` | `reg-dle.ts` (REG_DLE) | ✅ |
| MLOps | 12 (mlops1–mlops12) | `content/mlops*.ts` | `reg-mlops.ts` (REG_MLOPS) | ✅ |
| LLMOps | 12 (llmops1–llmops12) | `content/llmops*.ts` | `reg-llmops.ts` (REG_LLMOPS) | ✅ |
| Blockchain Data Scientist | 12 (bcd1–bcd12) | `content/bcd*.ts` | `reg-bcd.ts` (REG_BCD) | ✅ |
| Business Intelligence | 14 (biz1–biz14) | `content/biz*.ts` | `reg-biz.ts` (REG_BIZ) | ✅ |
| Data Engineer | 14 (de1–de14) | `content/de*.ts` | `reg-de.ts` (REG_DE) | ✅ |
| Database Administrator | 12 (dba1–dba12) | `content/dba*.ts` | `reg-dba.ts` (REG_DBA) | ✅ |

- Semua masuk kelompok **Track Peran** di Kurikulum (FOUNDATION set tidak berubah).
- Tidak ada slug duplikat (442 unik, diverifikasi via script).
- "Data Management" tidak dibuat ulang (sudah ada, 20 lesson). "Blockchain Data Scientist" yang disebut 2x oleh user hanya dibuat 1x.

## 3. Build & deploy — SELESAI
- `npx tsc --noEmit`: **0 error** (3 error `value: True` → `value: true` di bcd2/bcd5/bcd7 diperbaiki koordinator).
- `npm run build`: exit 0. `next-on-pages` (NODE_OPTIONS 4GB): exit 0.
- Deploy wrangler → **https://8574c075.learn-platform-cyo.pages.dev** (bundle 800 KB; auth via surrogate transient, tidak ditulis ke disk).
- Satu 404 transient (`aai1-lanskap`) sesaat setelah deploy — edge propagation, terverifikasi 200 beberapa menit kemudian.

## 4. QA

### Playwright (mirror lokal, 390×844 + 1440×900)
- **12/12 lesson baru**: judul benar, 6–8 steps, drawer hamburger terbuka (`aria-expanded=true`), step jump + drawer menutup, **0 pageerror, 0 horizontal overflow**.
- **Kurikulum /v2/learn**: grup Fondasi/Track Peran tampil, 12 nama track baru terdeteksi, accordion toggle OK, **full-row tap terverifikasi** (klik area kosong baris → navigasi ke lesson).
- Lesson aml1: drawer, KaTeX render (`.katex` ada, 0 `.katex-error`), tombol Lanjut + alasan inline, quiz Checkpoint.
- **Regresi rute lama: 294/294 `/learn/*` = HTTP 200.**

### check-responsive (runs di `~/workspace/responsive-qa/check-responsive-runs/2026-10-14/`)
- `/v2/learn`: **0 temuan**.
- Lesson baru (rr1, mle1, de1): hanya 3 warning 4px pada handle resize panel di viewport desktop — noise, bukan defect.
- `/v2` dashboard: 7 "CRITICAL" pada `.tblwrap` (111px/30px) = **noise tool yang sudah didokumentasikan**: tabel di dalam wrapper scrollable, halaman sendiri tidak scroll (scrollWidth = viewport). Bukan defect.

### Koreksi penting saat koordinasi
- Instruksi escaping di brief awal SALAH untuk v2: `Workspace.tsx` render prose via `renderInline()` ke React text nodes (auto-escape) → prose harus karakter MENTAH. 44 entity di file AML di-unescape; koreksi dikirim ke 10 agen berjalan. Aturan dicatat di `~/AGENTS.md`.

## 5. Yang BELUM terverifikasi penuh (jujur)
- **Eksekusi lab di Pyodide browser sungguhan** belum diuji (lab hanya lolos CPython lokal; checks mengikuti pola a12).
- **Render visual KaTeX/SVG** hanya spot-check 1 lesson (aml1); dark theme & quiz interaktif per-lesson belum diuji satu per satu.
- Durasi 45–60 menit adalah estimasi penulis, bukan pengukuran baca.
- Angka regulasi di rr10 (OJK/BI) diberi caveat di konten untuk verifikasi ke ketentuan terbaru.
- Brain/batch TIDAK disentuh (sedang berjalan sendiri).

## 6. File & artefak
- Laporan ini: `~/workspace/learn-platform/TRACK_BARU_2026-10-14.md`
- QA script: `~/workspace/responsive-qa/qa_newtracks.py`, hasil `qa_newtracks.json`
- check-responsive runs: `~/workspace/responsive-qa/check-responsive-runs/2026-10-14/`
- Mirror QA: `~/workspace/responsive-qa/mirror2/` (server 8902, sudah dimatikan setelah QA bila perlu dinyalakan ulang)

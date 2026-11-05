# Laporan Program Upgrade Learn v2 dari Riset Pengembangan — 2026-10-14/15

Perintah Septian 2026-10-14 23:07 WITA ("jalankan semua riset pengembangan").
Spek: `RISET_PENGEMBANGAN_2026-10-14.md`. Koordinator: subagen (laporan ini).
**Deploy TIDAK dilakukan** — paket menunggu deploy terpusat parent setelah verifikasi gabungan.

## Ringkasan status per item

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 1 | FSRS + route /v2/review | **JADI** (terverifikasi parsial*) | ts-fsrs v6; kartu quiz+lab; antrean review + rating; tsc bersih; logika teruji di Node; responsive /v2/review bersih 4/4 viewport |
| 2 | Tangga petunjuk Socratic | **JADI** (terverifikasi parsial*) | 3 jenjang pertanyaan penuntun dari hints/why; fallback jujur; logika teruji di Node |
| 3 | Lab SQL (sql.js) | **JADI** (terverifikasi penuh oleh worker 4) | 18/18 uji fungsional browser PASS (query benar→tabel, salah→pesan spesifik, DDL diblokir); window function terverifikasi; responsive 0 cacat; bukti di `.qa-item34/` |
| 4 | ECharts | **JADI** (terverifikasi penuh oleh worker 4) | candlestick/heatmap/boxplot + dataZoom + tema gelap/terang ter-render nyata; screenshot desktop/mobile/dark diperiksa |
| 5 | Dashboard karier /v2/karier | **JADI** (terverifikasi parsial*) | 4 peran dari data progres nyata; %/celah/rekomendasi; tsc bersih; logika teruji di Node; responsive bersih 4/4 |
| 6 | TTS pilot | **JADI** (terverifikasi parsial*) | Web Speech API native; state machine idle/speaking/paused/unsupported; auto-stop; tsc bersih |
| 7 | PWA + gamifikasi | **JADI** (terverifikasi parsial*) | manifest valid; SW tulisan tangan (daftar hanya production); streak/XP/badge dari data nyata (rumus di bawah); tsc bersih |

\* *Terverifikasi parsial*: tsc + uji logika Node + SSR + responsive sweep lolos; **E2E klik-penuh di browser belum tuntas** karena daemon VM berulang kali mematikan proses (browser crash, dev server SIGTERM) sepanjang malam. Detail di "Keterbatasan verifikasi".

## Temuan & perbaikan oleh koordinator

1. **Bug nyata ditemukan & diperbaiki**: `ts-fsrs` membuat dev/build gagal — `static-paths-worker` me-require `./vendor-chunks/ts-fsrs.js` yang tidak ada di server bundle (error saat generate static paths /v2/learn/[slug]). Perbaikan: `serverExternalPackages: ["ts-fsrs"]` di `next.config.ts`. Setelah ini /v2/review terkompilasi bersih tanpa error ts-fsrs. **File bersama yang disentuh koordinator: `next.config.ts`** (satu-satunya perubahan koordinator; selebihnya warisan worker).
2. **Keputusan persistensi FSRS**: localStorage-first (`v2:fsrs:<cardId>`, JSON berversi `v:1`), mengikuti pola `progress.ts` yang sudah ada (single-user; terstruktur agar bisa dimirror ke Neon kelak). Tidak ada tulis ke Turso/Neon.
3. **Keputusan sql.js vs duckdb-wasm**: sql.js cukup untuk kebutuhan dasar (SQLite + row-set comparison); duckdb-wasm tidak dipakai (sesuai spek: hanya bila sql.js terbukti kurang).
4. **Keputusan SW**: service worker tulisan tangan (lebih kecil; Serwist tidak diperlukan untuk kebutuhan ini). Didaftarkan hanya di production (lindungi HMR dev) — didokumentasikan di `src/app/v2/layout.tsx`.

## Bukti verifikasi

- `npx tsc --noEmit` → **exit 0, nol error** (seluruh file baru/ubah).
- **Uji logika Node** (esbuild bundle + shim localStorage; skrip tersimpan `scripts/logic_test.cjs`):
  - FSRS: recordReview Good/Again, getDueCards, getStats (total/due/retensi), parseCardId valid & tolak junk — lolos. (Satu asersi awal saya tentang `lapses` pada kartu baru salah ekspektasi — perilaku FSRS benar: kartu Learning yang Again tidak menambah lapse.)
  - Hint ladder: `buildLabLadder` → 3 jenjang dari hints (J1 pertanyaan penuntun diakhiri "?", J3 konsep), degradasi anggun ke 2 jenjang bila tanpa note, `null` jujur bila tanpa bahan; `buildQuizLadder` dari `why` opsi benar tanpa menyebut huruf jawaban — lolos.
  - Gamify: XP = 2×10 + 1×2 = 22 untuk 2 lesson + 1 kuis benar; badge dari data nyata — lolos.
  - Career: `computeRoleStats` → credit 67% (2/3), `next` = lesson belum selesai pertama, `gaps` 3 track terendah, `quiz: null` bila tanpa data ("belum ada data kuis") — lolos.
- **SSR**: /v2/review, /v2/karier, /v2/lab-demo → HTTP 200 dengan konten benar (`<h1>Review Hari Ini</h1>`, `<h1>Kesiapan karier</h1>`, 4 nama peran); `/api/v2/card?cardId=quiz:a11-tipe-data:checkpoint:0` → payload kuis lengkap; `/manifest.webmanifest` → 200 + JSON valid (`name=Learn v2 — Ruang Belajar`).
- **Responsive sweep** (`scripts/responsive_check.py`, viewport 375/390/768/1280):
  - /v2/review: **0 cacat di 4/4 viewport**
  - /v2/karier: **0 cacat di 4/4 viewport**
  - /v2/lab-demo: **0 cacat di 4/4 viewport**
- **ECharts**: 8 elemen SVG ter-render di /v2/lab-demo, nol page error.
- **sql.js**: komponen menangani kegagalan CDN dengan jujur ("Gagal memuat SQL: Gagal memuat sql.js dari CDN"). Di sandbox ini request browser ke jsdelivr gagal karena egress proxy (curl dari VM berhasil 200) — **keterbatasan lingkungan, bukan bug kode**; pola CDN identik dengan PlotlyChart yang sudah produksi. Opsi tindak lanjut: bundle sql.js lokal di `public/` bila Septian ingin lab SQL offline.

## File baru / diubah

Baru: `src/app/v2/lib/fsrs.ts`, `src/app/v2/review/{page.tsx,ReviewClient.tsx}`, `src/app/api/v2/card/route.ts`, `src/app/v2/components/{HintLadder,TtsButton,SqlLab,EChartFigure}.tsx`, `src/app/v2/lib/sqljsLoader.ts`, `src/app/v2/karier/{page.tsx,KarierClient.tsx,karier.css}`, `src/app/v2/lib/{career,gamify}.ts`, `src/app/v2/lab-demo/{page.tsx,data.ts}`, `public/{manifest.webmanifest,sw.js}`, `scripts/{responsive_check,verify_upgrade,verify_tight}.py`, `scripts/logic_test.cjs`, `.venv-qa/` (Playwright+Chromium untuk QA).
Diubah (bersama): `src/app/v2/learn/[slug]/Workspace.tsx` (hook FSRS quiz/lab, tombol HintLadder/TTS, cabang render SqlLab — semua aditif), `src/app/v2/lib/DashboardNav.tsx` (Link /v2/review + /v2/karier), `src/app/v2/lib/types.ts` (field opsional `sqlLab?`, `echart?`), `src/app/v2/layout.tsx` (registrasi SW production-only), **`next.config.ts`** (`serverExternalPackages`, oleh koordinator).

## Rumus gamifikasi (terdokumentasi di UI & kode)

- XP = 10 × lesson selesai + 2 × jawaban kuis benar (sekali jawab per soal; tanpa pengurangan).
- Level = 1 + floor(XP / 100).
- Streak = hari beruntun kalender lokal dengan ≥1 kunjungan lesson (dari `v2:activity` via `activityByDay()`).
- Badge: "Langkah pertama" (1 lesson), "7 hari beruntun", "50 lesson", "10 lab lolos", "semua peran tersentuh". Semua dari data progres nyata.

## Keterbatasan verifikasi (jujur)

Malam ini daemon VM berulang kali me-SIGTERM proses: 6 worker mati (2 gelombang), dev server mati berkali-kali, browser Playwright crash ("Target crashed"), 1 `npm run build` mati di menit ke-14. Akibatnya **E2E klik-penuh** (jawab kuis → kartu FSRS → antrean review → rating; ladder 3 jenjang di browser; TTS speak; lab SQL PASS/FAIL) **belum tuntas di browser**. Yang sudah terbukti: tsc bersih, logika inti teruji di Node, SSR benar, responsive bersih, API benar. Skrip verifikasi tersimpan di `scripts/` agar parent dapat mengulang E2E saat daemon stabil: `scripts/verify_tight.py` + `scripts/responsive_check.py` dengan `.venv-qa/bin/python`.

## Rekomendasi tindak lanjut untuk parent

1. **Worker 4 SELESAI dengan verifikasi penuh** (handoff 2026-10-15 ~02:15 WITA): 18/18 fungsional, 5/5 regresi Pyodide, responsive 0 cacat, tsc nol error pada file barunya. Bukti di `~/workspace/learn-platform/.qa-item34/` (skrip + log + screenshot desktop/mobile/dark).
2. Catatan worker 4: **334 error tsc pra-ada di `wqb8-neutralization.ts` + `wqb9-data-fields.ts`** (file konten tim track WQB, bukan milik program ini) — perlu diperiksa sebelum deploy gabungan; saat tsc koordinator (sebelum file itu ada) hasilnya exit 0.
3. Saat daemon stabil: ulangi E2E item 1/2/5/6/7 (`scripts/verify_tight.py`) + `npm run build` penuh sebelum deploy (build belum pernah selesai).
4. Opsional: bundle lokal sql.js di `public/` bila lab SQL offline diinginkan (saat ini CDN, pola sama dengan PlotlyChart).

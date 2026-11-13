<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Learn MLF — notebook cwd + eksekusi paralel (2026-11-13, M8 build)
- nbconvert menjalankan kernel dengan cwd `colab/`, sehingga path relatif `data/...` GAGAL. Notebook WAJIB tahan terhadap itu: helper `find_file` (coba repo-root dulu, lalu relatif). M8 sudah pakai; M7.5 punya masalah laten yang sama bila dieksekusi ulang — patch di ronde fix M8 + re-upload di deploy M8.
- JANGAN eksekusi 5 notebook paralel: load 9–28, timeout, kernel mati. Stagger + `OMP_NUM_THREADS=2`; eksekusi ulang sebaiknya saat VM sepi.

## Learn MLF — kelas "± sd" di lesson LIVE M6 (2026-11-13, temuan build M8)
- "0,7858 ± 0,0068" (mean ± sd antar-fold) MASIH ADA di M6.2/M6.5 live (TS + .md + chapters.ts) — menyajikan sd sebagai ketidakpastian mean; yang benar SE ≈ 0,0030. M6.2:546 sudah mengajarkan bedanya secara eksplisit, jadi ini perbaikan kejelasan penyajian, bukan kesalahan angka.
- Fixture must-not repo-wide TIDAK BISA ditambahkan sebelum sweep: akan FAIL pada konten live M6, dan M6.2:627 adalah distraktor kuis yang SENGAJA mengajarkan kesalahan ini (fixture string false-positive). Sweep M6.2/M6.5 dibatch ke ronde fix M8 (gate diff-scoped M6.2/M6.5 + guards, ikut deploy M8); fixture baru HANYA setelah sweep + distraktor dirombak.
- Konvensi yang benar (dipakai M8): "0,7858 (sd antar-fold 0,0068)".

## Learn MLF — concept gate TIDAK membaca prose langkah (2026-11-13, fill M8)
- Ekstraktor `concept_gate.py` hanya mengambil klaim dari field `body` (note), `formulaNote`/`formula`, dan `why` kuis yang mengandung kata kunci statistik — prose langkah (`prose:` array) TIDAK PERNAH diekstrak. Gate fill M8 PASS 67 OK hampir tidak mencakup prose baru fill (hanya note G2 + 2 why kuis).
- ATURAN: ronde fill WAJIB ditambah prose-level review (DeepSeek 1 panggilan atas blok konten baru saja, prompt dibangun dari ekstraksi langkah baru) ATAU perluasan ekstraktor ke prose. Prose review fill M8 menemukan 2 MUST yang gate lewatkan: F1 (CI [−1,26; +3,35] "mendekati MERAH" padahal batas atas 3,35 > 3,0 — interval MELINTASI MERAH; distraktor kuis why-nya juga salah aritmetika) dan F2 (mini-case suara 2–2 mustahil dari 2 pemilih sah setelah recusal).
- Kelas baru: (a) batas atas CI yang melewati ambang ≠ "mendekati ambang" — tulis "melintasi/mencakup"; (b) aritmetika suara/kuorum dalam mini-case WAJIB konsisten dengan aturan yang sama — hitung pemilih sah setelah recusal SEBELUM menulis hasil suara.
- Fixture must-not baru: "mendekati ambang MERAH" (M8.1).

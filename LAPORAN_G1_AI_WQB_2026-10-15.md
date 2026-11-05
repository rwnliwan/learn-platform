# LAPORAN GELOMBANG 1 — Kelompok AI/ML + WorldQuant Brain
Tanggal: 2026-10-15 · Koordinator: build G1 AI/WQB
Batas: 12 slug terkunci audit, 7 registry file, tanpa menyentuh registry.ts/Workspace.tsx/rr19/file existing.

## 1. Ringkasan
**12/12 lesson dibangun, terdaftar, dan lolos verifikasi independen parent.**
- File baru: `src/app/v2/content/{wqb22-margin-kapasitas, wqb23-vector-datafields, wqb24-alpha-di-produksi, wqb25-tipe-submit-konsultan, aie14-advanced-rag, aie15-synthetic-eval-data, aie16-embedding-selection, llmops14-smart-routing, aai16-tool-security, mlops16-triton-serving, mle20-recommender-systems, dle15-distributed-training}.ts`
- Registrasi (hanya reg-* yang sesuai): reg-wqb (4), reg-aie (3), reg-llmops (1), reg-aai (1), reg-mlops (1), reg-mle (1), reg-dle (1).
- Lab checks independen: **58/58 PASS** (setiap `solution` diekstrak dari file & dijalankan `python3`, pola `checks` dicocokkan).
- `summary:` = 1 per file, masing-masing 5–6 butir spesifik di langkah checkpoint.
- F1 scan (4 frasa terlarang WORKFLOW): **0 hit** di semua 12 file.
- `npx tsc --noEmit`: **0 error** di 12 file + 7 registry file.
- Duplikat slug: 0 (baru maupun lintas seluruh content/).
- estMinutes: 46–56 mnt (semua dalam rentang 45–60; formula kata/180 + lab×8 + kuis×2 + chart×2,5 + case×6 + rumus×1 dilaporkan per lesson oleh tim bangun).

## 2. Bukti per lesson (verifikasi independen parent, /tmp/verify_g1.py)

| Lesson | File | Langkah | Est | Lab (harness parent) | summary | F1 | tsc |
|---|---|---|---|---|---|---|---|
| wqb22-margin-kapasitas | wqb22 | 9 | 55 | 4/4 + 3/3 PASS | 6 butir ✓ | 0 | ✓ |
| wqb23-vector-datafields | wqb23 | 9 | 54 | 3/3 + 2/2 PASS | 6 butir ✓ | 0 | ✓ |
| wqb24-alpha-di-produksi | wqb24 | 9 | 55 | 5/5 + 3/3 PASS | 6 butir ✓ | 0 | ✓ |
| wqb25-tipe-submit-konsultan | wqb25 | 9 | 56 | 4/4 + 3/3 PASS | 6 butir ✓ | 0 | ✓ |
| aie14-advanced-rag | aie14 | 7 | 47 | 4/4 PASS | 5 butir ✓ | 0 | ✓ |
| aie15-synthetic-eval-data | aie15 | 7 | 46 | 3/3 PASS | 5 butir ✓ | 0 | ✓ |
| aie16-embedding-selection | aie16 | 7 | 47 | 4/4 PASS | 5 butir ✓ | 0 | ✓ |
| llmops14-smart-routing | llmops14 | 9 | 48 | 3/3 PASS | 6 butir ✓ | 0 | ✓ |
| aai16-tool-security | aai16 | 9 | 50 | 3/3 PASS | 6 butir ✓ | 0 | ✓ |
| mlops16-triton-serving | mlops16 | 9 | 48 | 3/3 PASS | 6 butir ✓ | 0 | ✓ |
| mle20-recommender-systems | mle20 | 8 | 52 | 3/3 + 2/2 PASS | 6 butir ✓ | 0 | ✓ |
| dle15-distributed-training | dle15 | 8 | 54 | 3/3 + 3/3 PASS | 6 butir ✓ | 0 | ✓ |

Judul per lesson sesuai slug terkunci audit (variasi sepele: "dan" vs "&" di MLE20).

## 3. Kepatuhan kepemilikan & F2
- Setiap lesson mematuhi matriks kepemilikan audit: sudut milik track sendiri; topik track lain hanya dirujuk 1–3 kalimat (mis. aie14 → aai5; aai16 → aai9/aie9 prompt injection TIDAK dibangun ulang; mle20 → mk8 sudut bisnis; mlops16 → llmops13 vLLM/TGI dibatasi 3 kalimat; wqb23 → mk17/aai).
- F2: prasyarat diringkas 2–3 kalimat inline di dalam lesson (mis. wqb22: wqb5/wqb11/wqb4; aie14: aie3/aie13; mle20: mle2/mle4). Tidak ada referensi ke lesson yang belum ada.

## 4. Sumber yang dibuka (bukan dari ingatan)
- wqb: alexisdpc/worldquant-alpha-trading (ImprovingAlphas.md "Margin and IC"); khushalx/brain-mcp-docs (parameters-simulation-results.md, vector-datafields.md, brain-genius.md, alpha-submission.md "Special Alpha Types"); jslijb/worldquantalpha docs (01_alpha-submission.md, lifecycle doc). Batas pengetahuan dicatat jujur di lesson (biaya ilustratif; perilaku butuh login konsultan ditandai).
- aie14: arXiv 2401.15884 (CRAG) + ar5iv full; arXiv 2212.10496v1 (HyDE). aie15: helicone/ragas testset_generation.md. aie16: arXiv 2210.07316 (MTEB) + HF leaderboard; arXiv 2205.13147 (Matryoshka). RTEB tidak dibuka → tidak diklaim.
- llmops14: dev.to 2026 routing-tools benchmark. aai16: NSA CSI MCP security v1.0 (Mei 2026). mlops16: triton-inference-server/server.
- mle20: Google Cloud two-towers blog; developers.google.com/.../matrix-factorization 404 saat dibuka → fakta MF diambil dari seksi blog yang sama (dicatat). dle15: PyTorch FSDP docs (update Mei 2026).

## 5. Perbaikan nyata selama verifikasi (ditemukan & diperbaiki sebelum diterima)
- Parent: bug harness pada template-literal backtick (escape `\n` tidak didekode) — diperbaiki di /tmp/verify_g1.py; validasi ulang terhadap wqb21 (2/2 PASS) lalu seluruh 12 lesson.
- Tim C: bug `${...}` interpolasi TS di f-string Python dalam template literal → di-escape `\${`; tsc bersih.
- Tim D: rounding precision_at_k 4 vs 3 desimal vs pola checks → diselaraskan, 5/5 PASS.
- Tim A: angka lab diselaraskan ke stdout aktual python; wqb25 B3 ternyata lolos Power Pool → dijadikan poin ajar eksplisit.
- Tim B: seed lab aie16 diganti agar konsisten dengan chart (titik patah dim=2).

## 6. Catatan untuk parent (di luar wewenang saya)
- Error tsc project-wide dari file tim lain paralel (aml21-proliferation-financing.ts, hd21-farmakovigilans.ts, bcd17-concentrated-liquidity.ts) — TIDAK disentuh, di luar scope saya. File saya 0 error.
- Label kejujuran simulasi: lab mlops16/dle15 dinyatakan eksplisit "SIMULASI keputusan kapasitas, bukan software asli"; mini-case & angka chart berlabel ilustratif/simulasi.

## 7. File & registrasi
- Konten: `~/workspace/learn-platform/src/app/v2/content/` (12 file baru)
- Registry yang diubah: `src/app/v2/lib/reg-{wqb,aie,llmops,aai,mlops,mle,dle}.ts` (import + entry saja)
- Harness verifikasi: `/tmp/verify_g1.py` (+ `/tmp/verify_g1_results.json`)
- Tidak disentuh: registry.ts, Workspace.tsx, rr19, lesson existing, file tim lain.

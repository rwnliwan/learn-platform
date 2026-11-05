# LAPORAN KOORDINATOR G2/G3 — Klaster AI/WQB (2026-10-15)

Koordinator: subagent AI/WQB · Untuk: parent agent

## 1. Ekstraksi item G2/G3 klaster AI/WQB (dari AUDIT_GAP_SEMUA_TRACK_2026-10-15.md)

Hasil: **10 lesson, semuanya G2. Nol G3 di klaster ini** (12 item G3 seluruhnya milik track lain: dm21, de18, dba15, dba18, biz19, de20, a316, b19, b20, d17, a317, a318).

| Track | Item G2 | Catatan |
|---|---|---|
| WorldQuant Brain | — (0) | wqb22–25 semuanya sudah di G1 & live; G2/G3 wqb tidak ada |
| AI Engineering | aie17-visual-retrieval | ColPali & dokumen multimodal (sudut retrieval) |
| Agentic AI | aai17-a2a-protocol | A2A protocol interop antar-agen |
| LLMOps | llmops15-latency-slo, llmops16-speculative-decoding | TTFT/TPOT + capacity; EAGLE speculative decoding |
| MLOps | mlops14-terraform-iac, mlops15-finops-ml | Terraform sudut ML infra (beda dari de18 sudut platform data); FinOps GPU |
| ML Engineer | mle21-ann-vector-search, mle22-active-learning | HNSW/ANN at scale; active learning & labeling |
| Deep Learning | dle16-multimodal-clip, dle17-gradcam | CLIP sudut MODEL (beda dari aie17 sudut retrieval); Grad-CAM/saliency |

Matriks anti-tumpang-tindih mengikat: aie17 vs dle16 (sudut retrieval vs model — pembeda ditulis eksplisit di lesson), mlops14 vs de18 (sudut ML infra vs platform data), mlops15 vs llmops6 (FinOps vs token economics), dle17 vs mle19 (Grad-CAM vs SHAP/LIME klasik), mle21 vs aie3 (ANN scale vs cosine dasar).

## 2. Pembagian kerja

5 builder paralel (satu per track-pasangan, tanpa delegasi lebih dalam):

1. aie+aai → aie17-visual-retrieval, aai17-a2a-protocol
2. llmops → llmops15-latency-slo, llmops16-speculative-decoding
3. mlops → mlops14-terraform-iac, mlops15-finops-ml
4. mle → mle21-ann-vector-search, mle22-active-learning
5. dle → dle16-multimodal-clip, dle17-gradcam

Setiap builder menerima brief self-contained: item spec (slug, judul, gap, sumber audit, mitigasi F2, sudut anti-overlap), template acuan per track (file G1: aie14/aai16/llmops14/mlops16/mle20/dle15), aturan keras:

- `tasks: []` di SETIAP langkah (pelajaran dari 4 file G1 wqb22–25 yang gagal tsc)
- `summary:` WAJIB di checkpoint; panel "Poin penting" berisi sejak LANGKAH 1
- Prosa RAW (`<>&` apa adanya; entitas hanya di const SVG); KaTeX String.raw
- Registrasi HANYA di reg-*.ts track sendiri; larangan sentuh registry.ts/reg lain/Workspace.tsx/lesson existing
- WORKFLOW.md v2.0, flag F1–F6 auto-reject; F2 self-contained (prasyarat diringkas 2-3 kalimat di dalam lesson)
- Verifikasi wajib per file: compile snippet Python lab (python3), `npx tsc --noEmit` bersih, grep `summary:`; lapor jujur

## 3. Status hasil build (diperbarui saat laporan builder masuk)

- [x] **llmops** (builder 2/5, selesai 10:31 WITA): llmops15-latency-slo + llmops16-speculative-decoding — 8 langkah tiap lesson, estMinutes 52/54, 1 lab + 6 kuis ber-feedback per lesson. Verifikasi koordinator: `tasks:` 8/8 per file ✅, `summary:` di checkpoint ✅, registrasi hanya di reg-llmops.ts (2 import + 2 entri) ✅, tsc bersih ✅, tidak ada pola `\${` (bug template-literal sudah diperbaiki builder) ✅. Anti-overlap: mlops7/llmops13 hanya dirujuk 2-3 kalimat.
- [x] **mlops** (builder 3/5, selesai 10:30 WITA): mlops14-terraform-iac + mlops15-finops-ml — 9 langkah tiap lesson, estMinutes 54/52, 1 lab + 6 kuis ber-feedback per lesson. Verifikasi koordinator: `tasks:` 9/9 per file ✅, `summary:` di checkpoint ✅, registrasi hanya di reg-mlops.ts (2 import + 2 entri) ✅, tsc bersih untuk kedua file ✅. Pembeda sudut anti-overlap ditulis eksplisit (mlops14 = IaC untuk infra komputasi ML vs de18 aliran data; mlops15 = framework FinOps finops.org vs llmops6 token economics & mle11 training cost). Lab dinyatakan jujur sebagai simulator Python di prosa masing-masing.
- [x] **dle** (builder 5/5, selesai 10:28 WITA): dle16-multimodal-clip + dle17-gradcam — 8 langkah tiap lesson, estMinutes 56/55, 2 lab + 5 kuis ber-feedback per lesson. Verifikasi koordinator: `tasks:` 8/8 per file ✅, `summary:` di checkpoint ✅, registrasi hanya di reg-dle.ts (2 import + 2 entri) ✅, tsc bersih untuk kedua file ✅. Lab: builder menjalankan solution di python3, output cocok `expected`/`checks` (InfoNCE loss 0.164 vs baseline 2.079; Grad-CAM audit watermark: 0,780→0,170). Sudut anti-overlap ditulis eksplisit di lesson (dle16 sudut MODEL vs aie17 sudut retrieval; dle17 vs mle19 SHAP/LIME).
- [x] **aie+aai** (builder 1/5, selesai 10:31 WITA): aie17-visual-retrieval + aai17-a2a-protocol — 8 langkah tiap lesson, estMinutes 50/48, 1 lab + 6 kuis ber-feedback per lesson. Verifikasi koordinator: `tasks:` di semua langkah ✅ (8 di aie17, 12 di aai17), `summary:` di checkpoint ✅, registrasi hanya di reg-aie.ts + reg-aai.ts ✅, tsc bersih ✅, tidak ada pola `\${` ✅. Fakta angka (ViDoRe, A2A) diverifikasi builder via web search hari ini. Pembeda sudut vs dle16 ditulis eksplisit.
- [x] **mle** (builder 4/5, selesai 10:34 WITA): mle21-ann-vector-search + mle22-active-learning — 8 langkah tiap lesson, estMinutes 55/55, 2 lab numpy + 5 kuis per lesson. Verifikasi koordinator: `tasks:` 8/8 per file ✅, `summary:` 6 item di checkpoint ✅, registrasi hanya di reg-mle.ts ✅, tsc bersih ✅, tidak ada pola `\${` ✅. Fakta kunci (HNSW/FAISS/ScaNN/Settles 2009/Snorkel) diverifikasi builder dari sumber, bukan dikarang; caveat `akurasi_label_LF=1.000` dinyatakan eksplisit di prosa lesson.

## 4. Verifikasi silang koordinator (SEMUA builder selesai)

- tsc: 10/10 file klaster bersih (0 error). Error repo-wide tersisa milik tim lain (lihat §3).
- `tasks:` di SEMUA langkah: 10/10 ✅. `summary:` di checkpoint: 10/10 ✅.
- Registrasi: hanya reg-aie, reg-aai, reg-llmops, reg-mlops, reg-mle, reg-dle (import + entri per file); registry.ts/reg lain/Workspace.tsx/lesson existing tidak disentuh; tidak ada slug duplikat di reg klaster.
- Scan frasa F1 (5 pola terlarang): 0 hit di 10/10 file ✅.
- Pola `\${` (bug template-literal): 0 di 10/10 file ✅.

Estimasi cakupan akhir klaster: WQB 25, AIE 17, AAI 17, LLMOps 16, MLOps 16, MLE 22, DLE 17. Total klaster: 130 lesson.

**Temuan untuk parent (pre-existing, milik tim koordinator lain — BUKAN klaster AI/WQB):**
1. `src/app/v2/content/dm20-reference-data.ts` baris 122 — 6 error sintaks TS1005 (track Data Management).
2. `src/app/v2/content/a317-quantile-regression.ts` baris 270 — error TS1005 `']' expected` (track Statistika, muncul setelah builder MLOps selesai; pre-existing di file tim lain).

Semua file klaster AI/WQB bersih dari error tsc.

Setelah semua laporan masuk, koordinator melakukan verifikasi silang penuh lalu menyerahkan ke parent untuk gerbang induk.

## 4. Estimasi cakupan akhir klaster

Setelah 10 item ini selesai: WQB 25, AIE 17, AAI 17, LLMOps 16, MLOps 16, MLE 22, DLE 17.

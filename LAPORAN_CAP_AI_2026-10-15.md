# LAPORAN KOORDINATOR — CAPSTONE Grup AI: 8/8 Misi Kombinasi Selesai & Terverifikasi

**Tanggal:** 2026-10-15 · **Tidak ada deploy** · Registry di-append oleh koordinator (builder dilarang menyentuhnya).

## Ringkasan

| # | Slug | Kombinasi | Judul | Langkah | Est |
|---|---|---|---|---|---|
| 1 | misi-gabung-atribusi-model | Marketing Analytics × ML Engineer | Misi Atribusi: Model yang Mengklaim Semua Kredit | 14 | 180 mnt |
| 2 | misi-gabung-notebook-produksi | ML Engineer × MLOps | Misi Notebook: Skor yang Tak Bisa Diulang di Produksi | 14 | 170 mnt |
| 3 | misi-gabung-training-skala | Deep Learning Engineer × ML Engineer | Misi Cluster: Training yang Membakar Uang | 15 | 180 mnt |
| 4 | misi-gabung-serving-llm | MLOps × LLMOps | Misi Serving: Latensi yang Membunuh Pengalaman | 15 | 200 mnt |
| 5 | misi-gabung-evaluasi-agen | LLMOps × AI Engineering | Misi Judge: Evaluator yang Menilai Dirinya Sendiri | 14 | 180 mnt |
| 6 | misi-gabung-rag-agen | AI Engineering × Agentic AI | Misi Tool: Agen yang Membuka Pintu yang Salah | 14 | 180 mnt |
| 7 | misi-gabung-biaya-agen | Agentic AI × LLMOps | Misi Tagihan: Agen yang Berpikir Terlalu Lama | 14 | 180 mnt |
| 8 | misi-gabung-pipeline-alpha | WorldQuant Brain × ML Engineer | Misi Pipeline: Dari Notebook ke Antrean yang Jujur | 15 | 195 mnt |

File konten: `src/app/v2/content/misi-gabung-*.ts` (8 file) · snapshot: `public/misi/<slug>/` (CSV/JSON + METODE.md) · total snapshot 8–460 KB per misi, semua < 5 MB.

## Verifikasi koordinator (mandiri, bukti)

1. **tsc --noEmit: 0 error** repo-wide (termasuk setelah append registry).
2. **Pola `\${`: 0** di 8 file (grep langsung).
3. **Struktur:** briefing (prereqSummary 2–3 kalimat + datasetNote) 8/8; `tasks` di semua langkah 8/8; `summary` 8/8; `decision` nextStepId valid + `goto: "audit"` 8/8; `auditDossier` 4 sabotase 8/8; `deliverable` rubrik total 100 8/8; langkah debrief 8/8.
4. **Prosa RAW:** 0 entitas HTML di luar SVG; 0 frasa F1; narasi Indonesia + istilah teknis Inggris; F2–F6 dipatuhi.
5. **Harness lab:** semua builder mengeksekusi solution code VERBATIM vs data asli — semua checks lolos (atribusi 9/9 incl. deteksi leakage; notebook gap AUC 0,19 + skew pelaku 1,094; training eff_batch 512 + straggler w5; serving TTFT/TPOT + varian INT8 19% lebih mahal; evaluasi kappa 0,129; RAG refund benar 4.750.000 vs terkirim 500.000; biaya-agen $4,20/tiket; pipeline ambang 94→168 + CV==train AUC).
6. **Dataset:** 8/8 SINTETIS eksplisit (seed 42 di METODE.md + briefing + prose). Khusus misi-gabung-pipeline-alpha: batas WQB dipatuhi — agregat fiksi, TANPA ekspresi alpha mentah, TANPA data antrean/akun, TANPA kredensial (replika pola misi-triage-alpha M2).
7. **Registry:** 66 record unik (58 sebelum grup ini + 8), mapping const→file 8/8 benar. Catatan: append sempat menimbulkan duplikat 2 baris record grup DATA (kesalahan koordinator saat restrukturisasi) — diperbaiki, tsc 0 setelahnya.
8. **Slug:** 682 slug konten unik (607 lesson + 75 misi), 0 duplikat. Catatan: 75 file misi sudah ada di disk sementara registry 66 — 9 file milik grup capstone lain yang masih berjalan, di luar wewenang grup ini.

## Temuan untuk parent

1. Builder sempat melaporkan error tsc di file grup lain (`misi-gabung-feature-store.ts`, `misi-gabung-jejak-lapis.ts`) saat file-file itu masih ditulis — saat verifikasi final tsc 0, jadi sudah diperbaiki pemiliknya. Tidak disentuh grup ini.
2. Bug tertangkap builder rag-agen (`events` tak terdefinisi di lab 1) — diperbaiki sebelum laporan final; harness final PASS.
3. Kejujuran data builder biaya-agen: kalibrasi faktor skala S=7,2243 agar mean = $4,20/tiket dinyatakan eksplisit di METODE.md.
4. Gerbang browser (server :3111 + gate_panel + E2E/FSRS) belum dijalankan untuk 8 misi ini — ranah gerbang parent.

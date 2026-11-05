# LAPORAN KOORDINATOR — CAPSTONE Grup DATA: 8/8 Misi Kombinasi Selesai

**Tanggal:** 2026-10-15 · **Koordinator:** capstone-data · **Tugas selesai.** 8 misi kombinasi (Misi C) dibangun oleh 8 builder paralel, diverifikasi ulang oleh saya, dan diregistrasi (append ke `reg-misi.ts`, record lama tidak diubah). **Tidak ada deploy.**

## Yang dibangun

| # | Slug | Track rumah × pasangan | Judul | Langkah | Mnt |
|---|---|---|---|---|---|
| 1 | `misi-gabung-pipeline-kotor` | Python × Data Engineer | Misi Pipeline Kotor: Dari Laptop Pendahulu ke Produksi | 14 | 180 |
| 2 | `misi-gabung-query-ke-dashboard` | SQL × Business Intelligence | Misi Kanonis: Dari Query Mentah ke Dashboard Keputusan | 16 | 180 |
| 3 | `misi-gabung-lineage-governance` | Data Management × Data Engineer | Misi Jejak Data: Pipeline yang Tak Punya Tuan | 13 | 180 |
| 4 | `misi-gabung-feature-store` | Data Engineer × MLOps | Misi Feature Store: Model yang Bagus di Notebook, Anjlok di Produksi | 14 | 180 |
| 5 | `misi-gabung-migrasi-warisan` | Database Administrator × Data Management | Misi Migrasi Warisan: Audit Dulu Sebelum Pindah | 13 | 180 |
| 6 | `misi-gabung-dashboard-jujur` | Business Intelligence × Marketing Analytics | Misi Dashboard Jujur: Satu Definisi Kebenaran | 13 | 180 |
| 7 | `misi-gabung-surveilans-genomik` | Health Data Science × Bioinformatika | Misi Surveilans Genomik: Wabah yang Terlihat dari Sekuensnya | 13 | 180 |
| 8 | `misi-gabung-vcf-ke-laporan` | Bioinformatika × Health Data Science | Misi Translational: Dari VCF ke Laporan Program | 15 | 200 |

File konten: `src/app/v2/content/misi-gabung-*.ts` (8 file) · data: `public/misi/<slug>/` (CSV/VCF + METODE.md, 16 KB–904 KB, semua < 5 MB) · const export terverifikasi 8/8.

## Verifikasi koordinator (mandiri)

1. **Struktur:** 8/8 file + folder data + METODE.md ada; setiap langkah punya `tasks` non-kosong (klaim builder, konsisten di 8 laporan); `summary` di langkah terakhir; `briefing` (prereqSummary 2–3 kalimat, tanpa rujukan lesson), `decision` ≥3 opsi dengan `nextStepId` valid, `auditDossier` 3–5 suntikan, `deliverable` (rubrik total 100), `debrief` + bahaya nyata.
2. **`grep '\${'` = 0** di semua 8 file; prosa RAW (HTML entity = 0 per laporan builder); KaTeX `String.raw` backslash tunggal.
3. **Harness lab:** semua builder menjalankan solusi yang diekstrak dari TS final terhadap data asli — LAB LOLOS semua: cap1 13/13, cap2 (SQL 2 lab + Pyodide 7/7), cap3 12/12, cap4 (4 lab: PIT 9, SQL 5 baris, leakage, PSI), cap5 24/24, cap6 (18/18 + SQL), cap7 (3 lab QC/cluster/kurva), cap8 (Lab 1 + Lab 2 6 checks).
4. **Dataset:** 8/8 SINTETIS 100% dinyatakan eksplisit di briefing datasetNote + METODE.md (+ permukaan rangkuman). Capstone kesehatan: patogen fiktif "patogen X", gen fiktif FIC1–FIC4 — tidak ada data pasien, tidak ada patogen nyata, tidak ada data GISAID/registrasi.
5. **`npx tsc --noEmit` repo-wide: 0 error** (setelah append registry).
6. **Registry:** 58 record (50 lama + 8 baru), key unik semua; 50 record lama tidak diubah isinya.

## Catatan untuk parent

1. Satu error tsc sempat muncul di `misi-gabung-notebook-produksi.ts` (bukan grup saya — milik koordinator capstone grup lain, masih dibangun saat builder saya melaporkan); saat verifikasi akhir saya tsc sudah 0 error repo-wide — pemiliknya memperbaikinya sendiri.
2. Estimasi seragam 180–200 mnt per capstone (jujur untuk 13–16 langkah + 2–4 lab + dossier + deliverable).
3. Mini-case F6 di beberapa misi diintegrasikan sebagai cabang konsekuensi keputusan (bukan langkah case terpisah) — disengaja agar tetap dalam batas langkah.
4. Folder data misi capstone grup lain sudah muncul di `public/misi/` (mis. `misi-gabung-berkas-ganda`, `misi-gabung-jejak-lapis`) — milik 2 koordinator capstone lain; saya tidak menyentuhnya; gerbang QA capstone penuh harus menunggu mereka selesai.
5. Tidak ada pesan ke Septian, tidak ada deploy.

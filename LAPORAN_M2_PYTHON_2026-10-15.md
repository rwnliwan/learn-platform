# LAPORAN M2 — Grup DATA-ENGINEERING, Track PYTHON (2 misi)

**Tanggal:** 2026-10-15 · **Koordinator/builder:** subagent M2 DATA-ENGINEERING (track Python)
**Status:** SELESAI bangun + verifikasi mandiri · **TIDAK ADA DEPLOY** (sesuai instruksi)

## Ringkasan misi

| # | Slug | Judul | Langkah | Durasi | XP | Export const | File |
|---|---|---|---|---|---|---|---|
| A (core) | `misi-pipeline-kotor-python` | Misi Pipeline: CSV yang Menolak Dibersihkan | 12 | 130 mnt | 500 | `misiPipelineKotor` | `src/app/v2/content/misi-pipeline-kotor-python.ts` |
| B (edge) | `misi-kegagalan-diam-pipeline` | Misi Pipeline: Kegagalan yang Diam | 13 | 150 mnt | 600 | `misiKegagalanDiam` | `src/app/v2/content/misi-kegagalan-diam-pipeline.ts` |

Keduanya: `track: "Python"`, `module: "Misi"`, mengikuti pola `misi-var-backtest.ts`
(briefing → dataroom → lab ber-gate → decision 3 opsi → 3 langkah cabang
`goto:"audit"` → auditDossier → deliverable → debrief → rangkuman `summary[]`).

## Dataset — 100% SINTETIS (dinyatakan di briefing, METODE.md, tiap permukaan)

- **A:** `public/misi/misi-pipeline-kotor-python/` (40 KB) — `tagihan_mentah.csv`
  (248 baris: 240 invoice + 8 duplikat persis; tipe campur, 4 format tanggal,
  kolom `total` = subtotal / `total_rp` = grand total benar),
  `kpi_dashboard.csv` (artefak fiksi: angka dashboard salah),
  `gen_tagihan.py` (seed 42), `METODE.md`.
  KPI benar Maret 2026: **115.252.500** (89 invoice) vs dashboard 71.080.575
  (selisih −44.171.925).
- **B:** `public/misi/misi-kegagalan-diam-pipeline/` (52 KB) —
  `transaksi_harian.csv` (600 baris, 3 format waktu: naive WITA / +08:00 / Z),
  `master_pelanggan.csv` (80 baris), `log_pipeline.txt` (artefak fiksi: log
  "RUN OK — dropped=0" yang berbohong), `gen_pipeline.py` (seed 42), `METODE.md`.
  Join membuang 12 (Rp 7.625.000), dedup key `(pelanggan_id, nominal, tanggal)`
  menghapus 23 transaksi sah, 58 baris UTC salah hari (WITA = UTC+8, Asia/Makassar).

## Hasil verifikasi mandiri

1. **tsc:** `npx tsc --noEmit` → exit 0, **0 error** (termasuk 0 error di kedua file misi).
2. **Harness lab:** solusi Python diekstrak *dari file .ts* (bukan diketik ulang)
   dan dijalankan dengan pandas 2.1.4 terhadap CSV asli:
   - A Lab 1: 248 / 8 / 14 / 68 / 14 ✓ · A Lab 2: 240 / 89 / 115252500 / −44171925 ✓
   - B Lab 1: 600 / 12 / 7625000 ✓ · B Lab 3: 58 / 58 / 56200000 / 48500000 / −7700000 ✓
   - B Lab 2 (SQL): seedData + solution via sqlite3 → kolom + 7 baris **persis**
     cocok dengan `expectedRows` (orderMatters) ✓
   - Semua blok starter lolos `compile()` ✓
3. **grep:** `grep -c '\${'` = **0** pada kedua file (f-string Python pakai `{var}` polos).
4. **Ukuran:** 40 KB dan 52 KB — jauh di bawah 5 MB per misi.
5. **Struktur:** A 12 langkah / B 13 langkah; decision 3 opsi → 3 cabang
   `goto:"audit"`; dossier 16 dan 14 baris, 3 injections tiap misi; deliverable
   5 template + 4 rubric; `summary[]` 5 poin di langkah terakhir; "SINTETIS"
   disebut di briefing + METODE.md.

## Catatan untuk parent

- **Registrasi BELUM dilakukan** — `src/app/v2/lib/reg-misi.ts` tidak disentuh
  (koordinator paralel lain kemungkinan menyentuhnya; hindari konflik merge).
  Parent tinggal tambah: `import { misiPipelineKotor } from "../content/misi-pipeline-kotor-python";`
  `import { misiKegagalanDiam } from "../content/misi-kegagalan-diam-pipeline";`
  + 2 entri di `REG_MISI`.
- **Peringatan /tmp:** file generik `/tmp/harness.py` sempat ter-overwrite oleh
  agen koordinator lain di tengah sesi (output tercampur). Saya pakai nama unik
  (`/tmp/harness_m2_py.py`, `/tmp/analisis_a.py`, `/tmp/analisis_b.py`) setelahnya.
  Disarankan tiap builder memakai nama file scratch ber-prefix unik.
- **Koreksi faktual saat build:** WITA = UTC+8 (Asia/Makassar) — generator B
  sempat memakai +07:00, sudah diperbaiki sebelum final. Bug generator A
  (`fmt_diskon` mengembalikan `""` untuk diskon non-nol) juga sudah diperbaiki
  dan CSV diregenerasi; semua expected values dihitung ulang dari data final.
- Browser test / E2E tidak dilakukan (di luar wewenang subagent generik).

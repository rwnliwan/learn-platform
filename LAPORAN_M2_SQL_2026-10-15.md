# LAPORAN M2 — Grup DATA-ENGINEERING · Track SQL (2026-10-15)

Builder subagent. TIDAK ADA DEPLOY. Tidak ada pesan ke Septian.

## Ringkasan

| # | Slug | Judul | Langkah | Durasi | XP | Export |
|---|------|-------|---------|--------|----|--------|
| A | `misi-laporan-bulanan-sql` | Misi Laporan: Dari Tabel Mentah ke Angka Bulanan | 11 | 120 mnt | 500 | `misiLaporanBulanan` |
| B | `misi-dua-sumber-tidak-cocok` | Misi Rekonsiliasi: Dua Sumber, Dua Kebenaran | 13 | 150 mnt | 600 | `misiDuaSumber` |

File: `src/app/v2/content/misi-laporan-bulanan-sql.ts`, `src/app/v2/content/misi-dua-sumber-tidak-cocok.ts`
(track: `"SQL"`, module: `"Misi"`). Keduanya mengikuti pola persis `misi-var-backtest.ts`:
briefing → data room → lab ber-gate → checkpoint keputusan (3 opsi → 3 langkah cabang `goto:"audit"`)
→ audit dossier impostor → deliverable ber-rubrik → debrief → rangkuman (`summary[]` 5 poin).

**Registrasi `reg-misi.ts` TIDAK disentuh** — diserahkan ke koordinator/parent (penggabungan + gerbang).

## Dataset — 100% SINTETIS

Dinyatakan eksplisit di: briefing `datasetNote` (kedua misi), `METODE.md` tiap misi, dan rangkuman.
Generator: `m2-sql-gen/gen.py` (seed tetap **42**, deterministik). BUKAN data nyata.

- **A** — `public/misi/misi-laporan-bulanan-sql/` (16 KB): `orders.csv` (72 baris, Jan–Jun 2025),
  `customers.csv` (24 baris; C004 & C019 sama-sama "Toko Berkah Jaya" = 1 pelanggan 2 ID),
  `refunds.csv` (13 baris; R004 Rp 1.048.000 muncul 2× identik), `METODE.md`.
  Status: paid/Paid/PAID (sah) + payed (typo), pending, cancelled/canceled, void.
- **B** — `public/misi/misi-dua-sumber-tidak-cocok/` (12 KB): `billing.csv` (41 baris, timestamp **UTC**;
  3 kunci berspasi `"K-107 "`/`"K-110 "`, 1 kunci NULL, 1 baris koreksi `KOR-01` −200.000 tanpa jejak),
  `crm.csv` (20 baris, timestamp **WIB lokal** tanpa penanda zona; kunci `K-109` duplikat,
  1 kunci NULL, `K-118` hanya di CRM), `METODE.md`.

Aturan bisnis benar (kunci jawaban): A — status sah `LOWER(TRIM(status))='paid'`, refund didedup
per `refund_id` via `ROW_NUMBER()`, refund dibebankan pada bulan `refund_date`;
B — kunci di-`TRIM` sebelum join, NULL tidak pernah cocok, FULL OUTER JOIN manual
(`UNION` dua `LEFT JOIN`), billing +7 jam → WIB, baris koreksi dilaporkan terpisah.

## Hasil verifikasi mandiri

1. **`npx tsc --noEmit` → 0 error** di seluruh proyek (termasuk kedua file misi).
2. **Harness SQL** (`m2-sql-gen/test_labs.py` — mengekstrak `sqlLab` LANGSUNG dari file `.ts`,
   menjalankan schema+seedData+solution di sqlite3, membandingkan dengan
   `expectedColumns`/`expectedRows` yang ikut diekstrak): **SEMUA LULUS**
   - A lab (CTE + window + agregasi berlapis): 6 baris cocok persis — kumulatif akhir Rp 67.521.000.
   - B lab 1 (profiling kunci): `[null,1],[ok,37],[spasi,3]` cocok persis.
   - B lab 2 (FULL OUTER JOIN manual): 16 baris cocok persis (12 klop, K-110 & KOREKSI
     hanya_billing, K-118 hanya_crm, 2 baris kunci_null).
   - B lab Python (pandas, `open_url` di-stub ke CSV asli): n_baris=41, n_pindah_hari=17,
     total_wib_2025-03-04=6.738.000 — semua cocok dengan `checks` di TS.
3. **`grep -c '\${'` = 0** di kedua file (prosa RAW, KaTeX `String.raw` backslash tunggal).
4. **Ukuran snapshot**: 16 KB (A) dan 12 KB (B) — jauh di bawah 5 MB.
5. **Struktur**: decision 3 opsi → `nextStepId` valid ke 3 langkah cabang (`goto:"audit"`);
   dossier 16 baris/4 injections (A), 14 baris/4 injections (B); deliverable template 5 poin +
   rubric 4 kriteria total bobot 100; langkah terakhir `summary[]` 5 poin; F1 bersih.

## Impostor (dibuka di debrief + skor deteksi x/4)

- **A**: refund ganda R004 (baris 1,9) · typo `payed` via `LIKE 'pai%'` (baris 1,5,8) ·
  pelanggan dua ID C004/C019 (baris 10) · cutoff 25 Juni (baris 6,11).
  Selisih terurai: laporan lama Rp 68.665.000 vs hitungan benar Rp 67.521.000 (Δ Rp 1.144.000).
- **B**: kunci berspasi vs klaim "join mentah" (baris 3,9) · cutoff "sama" untuk UTC vs WIB
  (baris 10,12) · koreksi −200.000 tanpa jejak (baris 6,11) · klaim "100% tercakup" di atas
  INNER JOIN yang membuang NULL (baris 8,9). Total benar Rp 48.280.000 vs memo Rp 44.597.000
  (Δ Rp 3.683.000).

## Catatan untuk koordinator/parent

- Daftarkan kedua misi di `src/app/v2/lib/reg-misi.ts` (pola `REG_MISI` existing) bila gerbang
  menghendaki; file konten sudah final dan lolos tsc.
- File pendukung di `m2-sql-gen/`: `gen.py` (generator), `gen_output.txt`,
  `manifest_a.json`/`manifest_b.json` (angka kunci), `test_labs.py` (harness),
  `blkA_*`/`blkB_*` (blok INSERT sumber — sudah ditempel ke file TS).
- Selama build sempat ada error tsc di `misi-biaya-inferensi.ts` (milik koordinator lain);
  pada verifikasi akhir sudah 0 error proyek-wide.

# LAPORAN KOORDINATOR — M2 Grup DATA-ENGINEERING (2026-10-15)

**Tugas:** 12 misi solo (Misi A=core + Misi B=edge per track) untuk 6 track: Python, SQL, Data Management, Data Engineer, Database Administrator, Business Intelligence.
**Status:** SELESAI. 12/12 dibangun, verifikasi mandiri lolos, terdaftar di `reg-misi.ts`. TIDAK ADA DEPLOY.

## Daftar misi

| Track | Slug | Judul | Langkah | Mnt | XP | Dataset |
|---|---|---|---|---|---|---|
| Python | `misi-pipeline-kotor-python` | Misi Pipeline: CSV yang Menolak Dibersihkan | 12 | 130 | 500 | SINTETIS (seed 42), 40 KB |
| Python | `misi-kegagalan-diam-pipeline` | Misi Pipeline: Kegagalan yang Diam | 13 | 150 | 600 | SINTETIS (seed 42), 52 KB |
| SQL | `misi-laporan-bulanan-sql` | Misi Laporan: Dari Tabel Mentah ke Angka Bulanan | 11 | 120 | 500 | SINTETIS (seed 42), 16 KB |
| SQL | `misi-dua-sumber-tidak-cocok` | Misi Rekonsiliasi: Dua Sumber, Dua Kebenaran | 13 | 150 | 600 | SINTETIS (seed 42), 12 KB |
| Data Management | `misi-katalog-data-hilang` | Misi Katalog: Siapa Pemilik Kolom Ini? | 11 | 120 | 500 | SINTETIS (seed 42), 7 KB |
| Data Management | `misi-lineage-terputus` | Misi Lineage: Skema Berubah, Tak Ada yang Tahu | 13 | 150 | 600 | SINTETIS (seed 7), 4 KB |
| Data Engineer | `misi-etl-telat-backfill` | Misi ETL: Batch yang Datang Terlambat | 12 | 135 | 500 | SINTETIS (seed 42), 1,1 MB |
| Data Engineer | `misi-kontrak-skema-retak` | Misi Kontrak: Skema Berubah di Tengah Jalan | 13 | 150 | 600 | SINTETIS (seed 7), 28 KB |
| DBA | `misi-migrasi-tanpa-downtime` | Misi Migrasi: Pindah Basis Data Tanpa Mati Lampu | 12 | 135 | 500 | SINTETIS (seed 42), 692 KB |
| DBA | `misi-indeks-hantu` | Misi Indeks: Query Lambat dan Indeks Hantu | 13 | 150 | 600 | SINTETIS (seed 42), 16 KB |
| BI | `misi-dashboard-regulator` | Misi Dashboard: Angka yang Bisa Dipertahankan | 12 | 135 | 500 | SINTETIS (seed 42), 100 KB |
| BI | `misi-dua-definisi-revenue` | Misi Metrik: Dua Definisi, Satu Kebohongan | 13 | 150 | 600 | SINTETIS (seed 42), 24 KB |

Semua snapshot di `public/misi/<slug>/` (<5 MB per misi) + METODE.md. Kata SINTETIS dinyatakan di briefing `datasetNote`, METODE.md, dan permukaan lain (pola misi-kartu-hantu).

## Verifikasi koordinator (mandiri, bukan klaim builder)
1. **tsc --noEmit**: 0 error repo-wide (setelah perbaikan koordinator, lihat §3).
2. **Keberadaan file**: 12 file konten + 12 folder dataset terkonfirmasi di disk.
3. **Pola `\${`**: 0 kemunculan di 12 file misi (grep).
4. **Registry**: `reg-misi.ts` memuat 50 record (14 lama + 36 M2: DataEng 12 + AI-ML 14 + FinStat 10) — semua slug misi grup ini resolve ke const yang benar, `slug` cocok dengan key, `summary[]` hadir di langkah terakhir.
5. **Snapshot**: terbesar 1,1 MB (misi-etl-telat-backfill) — semua < 5 MB.

Verifikasi harness lab (solusi Python dieksekusi vs CSV asli, solusi SQL via sqlite3 vs expectedRows) dilakukan tiap builder; hasil detail di laporan per track:
- `LAPORAN_M2_PYTHON_2026-10-15.md`
- `LAPORAN_M2_SQL_2026-10-15.md`
- `LAPORAN_M2_DATAMGMT_2026-10-15.md`
- `LAPORAN_M2_DATAENG-DE_2026-10-15.md`
- `LAPORAN_M2_DBA_2026-10-15.md`
- `LAPORAN_M2_BI_2026-10-15.md`

## Perbaikan koordinator selama verifikasi
- **Duplikat identifier**: builder SQL menamai const `misiDuaSumber` — tabrakan dengan misi M1 `misi-laporan-dua-sumber` (sudah live). Di-rename jadi `misiDuaSumberSql` di file konten + import + registry. tsc bersih setelahnya.

## Catatan untuk parent (di luar wewenang koordinator)
1. Koordinator AI-ML mendaftarkan 14 misinya langsung ke `reg-misi.ts` secara paralel; FinStat 10 misi juga sudah terdaftar. Total 50 = target pas (14 + 36). Tidak ada duplikat key.
2. Error tsc `misi-biaya-inferensi.ts` (5 error) yang dilaporkan builder DataEng sudah hilang saat verifikasi final saya — koordinator AI-ML tampaknya memperbaikinya sendiri.
3. Builder Python melaporkan: file scratch `/tmp/harness.py` sempat ter-overwrite agen lain — sarankan prefix unik per builder untuk file /tmp pada gelombang berikutnya.
4. Gerbang parent yang masih terbuka: E2E browser runner + gate panel untuk 12 misi ini (diserahkan ke parent; pola M1: server lokal :3111 + gate_panel.py yang diperluas).

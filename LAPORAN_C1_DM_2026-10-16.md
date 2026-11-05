# LAPORAN C1 — Pendalaman Track Data Management (2026-10-16)

**Status: SELESAI & terverifikasi.** 24/24 lesson kini ≥45 menit model durasi. Rata-rata track: **33,3 → 45,6**. Tidak ada deploy (sesuai perintah).

## Ringkasan angka
| Metrik | Sebelum | Sesudah |
|---|---|---|
| Rata-rata track (model) | 33,3 mnt | **45,6 mnt** |
| Lesson <45 mnt | 24 | **0** |
| Lesson tanpa note intuisi | 24 | **0** |
| Lesson dengan rumus tanpa penjelasan simbol | 1 (dm18) | **0** |
| tsc --noEmit (seluruh repo) | — | **0 error** |

Model durasi identik audit 2026-10-14/16: kata_terbaca/180 + lab×8 + quiz×2 + chart×2,5 + (mini-case?6:0) + rumus×1.

## Per lesson (durasi model sebelum → sesudah, hasil audit pasca-kerja)

| Lesson | Sblm → Ssdh | Quiz | Lab | Komponen hilang |
|---|---|---|---|---|
| dm16-bi-analytics-engineering | 30,2 → **45,7** | 6 | 1 | — |
| dm19-capstone-dwh | 30,5 → **45,7** | 6 | 1 | — |
| dm6-batch-streaming | 30,6 → **46,1** | 6 | 1 | — |
| dm9-governance | 30,7 → **45,7** | 6 | 1 | — |
| dm13-data-risiko-regulasi | 30,7 → **46,0** | 6 | 1 | — |
| dm7-kualitas-data | 30,8 → **45,6** | 6 | 1 | — |
| dm8-data-contract | 30,8 → **45,7** | 6 | 1 | — |
| dm5-orkestrasi-dbt | 30,9 → **46,1** | 6 | 1 | — |
| dm14-arsitektur-modern | 30,9 → **45,7** | 6 | 1 | — |
| dm15-cloud-dataops | 30,9 → **45,7** | 6 | 1 | — |
| dm4-data-warehouse | 31,1 → **45,2** | 6 | 1 | — |
| dm10-metadata-lineage | 31,1 → **45,2** | 6 | 1 | — |
| dm11-master-data | 31,1 → **45,2** | 6 | 1 | — |
| dm17-strategi-data | 31,1 → **45,5** | 6 | 1 | — |
| dm1-data-lifecycle | 31,2 → **45,4** | 6 | 1 | — |
| dm3b-database-nosql | 31,3 → **45,3** | 6 | 1 | — |
| dm12-keamanan-privasi | 31,3 → **45,4** | 6 | 1 | — |
| dm18-spark-pyspark | 31,4 → **45,2** | 6 | 1 | — |
| dm2-pemodelan-data | 31,5 → **45,9** | 6 | 1 | — |
| dm3a-database-relasional | 39,2 → **45,5** | 5 | 2 | — |
| dm23-retensi-arsip | 42,1 → **45,4** | 5 | 1 | — |
| dm21-document-management | 42,4 → **45,3** | 5 | 1 | — |
| dm22-data-sharing | 43,4 → **45,5** | 5 | 1 | — |
| dm20-reference-data | 44,5 → **45,5** | 5 | 1 | — |

## Apa yang ditambahkan (per kelompok)
- **19 lesson tipis** (30,2–31,5): 1 note "Intuisi: …" (150–250 kata, heuristik non-obvious), 1 langkah baru berisi ±1.900–2.400 kata prose (contoh terapan kedua berangka Rp Indonesia: bank/fintech/UMKM — biaya, SLA, denda OJK; kontras salah-vs-benar; mode kegagalan + aturan keputusan), 1 quiz baru (6 total; 4 opsi × `why` spesifik; menguji materi baru).
- **5 lesson hampir-target** (39,2–44,5): note intuisi + prose secukupnya menutup gap (±180–1.120 kata); quiz baru hanya bila diperlukan (tidak diperlukan — tercapai tanpa); dm18 mendapat formulaNote untuk rumus Amdahl (S(n), p, (1−p), n + interpretasi plafon 1/(1−p)); formulaNote dm20–dm23 terverifikasi sudah lengkap.
- `estMinutes` semua lesson diperbarui ke 45 (kelipatan 5 terdekat dari durasi model baru).

## Metode kerja
- 3 subagent paralel (8 lesson per batch), brief mandiri dengan aturan F1–F6, larangan tulis-ulang isi, dan acuan 2 lesson emas Probabilitas (b1, b6) untuk gaya kedalaman.
- Verifikasi dilakukan PARENT, bukan klaim worker: re-bundle registry + skrip audit (angka di atas), `npx tsc --noEmit` = 0 error di SELURUH repo, scan frasa terlarang F1 = 0 temuan di 24 file, 24 judul "Intuisi:" terkonfirmasi, sample struktur quiz baru diverifikasi (4 opsi × why, 1 correct), tidak ada file non-DM yang tersentuh (kecuali paths.ts/placement.ts milik Gelombang A — tidak disentuh pekerja ini).

## Kendala & temuan selama kerja
1. **Worker 1 sempat merusak array quiz** (baris penutup `},` terduplikasi saat insert) → tsc error di 8 file; sudah diperbaiki sendiri oleh worker, tsc bersih.
2. **Worker 3 meninggalkan koma ganda** di dm22 (elemen `undefined` di prose) → tertangkap tsc saat verifikasi parent, diperbaiki parent langsung.
3. **Margin tipis**: sebagian besar lesson mendarat di 45,2–45,9. Model durasi adalah estimasi (±); bila Septian ingin margin keamanan, gelombang lanjutan bisa menambah ~5 mnt per lesson. Untuk standar 45–60, semua lolos.
4. Perkiraan kata per paragraf worker meleset ~40% pada draft pertama (2–4 iterasi per lesson) — tidak memengaruhi hasil akhir.
5. Pola "intuition tips" lama (catatan tanpa judul "Intuisi:") tidak dihitung audit — semua 24 lesson kini punya note berjudul "Intuisi:" agar terukur.

# DM7: Kualitas Data — Garbage In, Keputusan Ngaco Out

## Masalah: Rp14 Miliar Melayang karena Satu Kolom
Kolom status_hidup basi 3 tahun → KUR cair ke debitur yang sudah meninggal. Semua query benar — akurat menggambarkan data yang salah.

## 1. Enam Dimensi
**Akurasi** (benar di dunia nyata), **kelengkapan** (yang harus ada), **konsistensi** (tak bertentangan), **ketepatan waktu** (cukup segar), **validitas** (format benar), **keunikan** (tak ganda). Ukur per dimensi; perbaiki yang berdampak.

## 2. Profiling
CT scan sebelum percaya: null%, min/max, distinct, distribusi, drift. Due diligence wajib untuk dataset baru.

## 3. Rule & Test
Kontrak sebagai kode di pintu medallion: unique, not_null, rentang, referensi, rekonsiliasi. Gagal = berhenti + alert, bukan auto-fix diam-diam. Aturan 1-10-100: perbaiki di hulu (1×), bukan hilir (100×).

## 4. Observability
CCTV untuk anomali tak terduga: freshness, volume, distribution, schema, lineage. Test = penjaga gerbang; observability = CCTV.

## Kesimpulan
1. Profiling dulu sebelum percaya.
2. Definisi "benar" milik bisnis; engineer mengeksekusi.
3. NULL ≠ 0 — jangan campur tanpa persetujuan.

**Next:** DM8 — Data Contract & SLA

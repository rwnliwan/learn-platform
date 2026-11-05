# BI6: Alignment & BLAST: Menyelaraskan Sekuens

## Tujuan
- Membedakan alignment global vs lokal dan memilih yang tepat.
- Menjalankan Needleman-Wunsch manual pada sekuens pendek (dynamic programming).
- Menjelaskan peran matriks substitusi (BLOSUM) dan gap penalty.
- Menggunakan logika BLAST (seed-and-extend, E-value) dan membaca hasil MSA.

## Ringkasan
- Global (NW): ujung-ke-ujung; lokal (SW): segmen terbaik; keduanya DP + traceback.
- Rekurens: max(diagonal + substitusi, atas/kiri − gap).
- BLOSUM: skor dari evolusi nyata; tidak semua mismatch sama.
- Gap affine: buka mahal, perpanjang murah.
- BLAST: seed-and-extend; E-value = hit acak yang diharapkan.
- Cek identitas + coverage + konteks sebelum vonis.
- MSA: kolom konservatif = posisi fungsional.
- Kemiripan = hipotesis tercepat; validasi = kewajiban.

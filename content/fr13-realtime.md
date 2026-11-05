# FR13: Real-Time — Berpacu dalam 200 Milidetik

## Mengapa Ini Penting?

Model NusaBank menangkap transfer ke-3 (skor 0,91) — tapi skor keluar 47 detik kemudian. 14 transfer lolos. Model yang benar + terlambat = model yang salah.

---

## Tujuan Pembelajaran

- Menyusun anggaran latency 200 ms
- Menggambarkan streaming pipeline
- Menjelaskan point-in-time correctness & feature store
- Memilih real-time vs near-real-time vs batch

---

## Konsep Kunci

- Fitur (55%) > model (20%) dalam anggaran — optimasi data dulu
- Hitung saat mengalir (stream), bukan saat ditanya
- Feature store = kontrak training-serving; tanpa itu = train-serving skew
- Fallback ditentukan bisnis sebelum insiden; panggilan eksternal sinkron = pembunuh real-time

---

## Catatan

Versi ringkas. Versi interaktif lengkap (lab, chart, quiz, mini-case) tersedia di halaman lesson.

# DM18: Spark & PySpark — Mesin Data Raksasa yang Wajib Dikuasai

## Kenapa Ada Lesson Ini
Riset lowongan 2026: Spark/PySpark muncul di hampir semua posting data engineer, berpasangan dengan Kafka. Lesson tambahan dari gap analysis — jembatan DM4 (lakehouse), DM5 (orkestrasi), DM6 (streaming).

## Masalah: Laptop yang Menyerah di 50 GB
pandas freeze di 50 GB; Spark cluster 10 mesin selesai 20 menit dengan kode lebih pendek. Tapi Spark ≠ pandas paralel — cara berpikirnya beda.

## 1. Kapan Spark
Data < ~10 GB → pandas/DuckDB. Data puluhan GB+ → Spark. Pilih dari ukuran, bukan gengsi.

## 2. Arsitektur
**Driver** (rencana) + **executor** (data, partisi). Aturan emas: data tinggal di executor; driver hanya hasil kecil.

## 3. Lazy Evaluation
Transformasi = rencana (murah); aksi = eksekusi (mahal). Catalyst mengoptimasi: predicate pushdown, column pruning. Debug dengan aksi kecil lebih awal (show(5)).

## 4. Shuffle = Operasi Termahal
groupBy/join/sort memindahkan data via jaringan. Aturan: filter dulu, broadcast join untuk tabel kecil, waspadai skew. 80% tuning = kurangi shuffle. Jangan collect() data besar!

## 5. Structured Streaming
Stream = tabel tak terbatas; kode batch = kode streaming. Kafka → Spark → Delta. Watermark + checkpoint wajib.

## Kesimpulan
1. Transformasi = rencana; aksi = bayar.
2. Shuffle = musuh. Ukuran data menentukan engine.

**Next:** DM19 — Capstone

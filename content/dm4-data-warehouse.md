# DM4: Warehouse & Lakehouse — Rumah Kedua untuk Data Analitik

## Masalah: Data Mentah yang Terbuang
ETL klasik membuang data mentah; 2 tahun kemudian tim fraud butuh "noise" yang dibuang itu — sudah hilang permanen. Pelajaran: simpan mentahnya dulu.

## 1. ETL vs ELT
- **ETL**: masak dulu, baru simpan (mentah hilang).
- **ELT**: simpan mentah dulu, masak belakangan (bisa re-transform).
- Industri bergeser ke ELT (storage murah), tapi ETL tetap tepat jika mentah tak boleh disimpan (compliance).

## 2. Warehouse vs Lake vs Lakehouse
- **Warehouse**: apartemen rapi, schema-on-write, mahal (Snowflake/BigQuery).
- **Lake**: gudang murah, schema-on-read — tanpa governance jadi **data swamp**.
- **Lakehouse**: lake + transaksi (Delta/Iceberg) — arah industri 2026.

## 3. Medallion: Bronze → Silver → Gold
Mentah → bersih → siap bisnis. Aliran satu arah, test kualitas di tiap pintu. Laporan resmi = Gold saja.

## 4. Parquet & Tabel Terbuka
**Parquet** (columnar): baca hanya kolom dipakai → hemat byte = hemat tagihan cloud. **Delta/Iceberg**: ACID + time travel + upsert + schema evolution di atas file terbuka — skill yang dicari 2026.

## Kesimpulan
1. Simpan mentah (ELT) kecuali regulasi melarang.
2. Laporan resmi = Gold. Jangan query Bronze untuk angka resmi.
3. Format = uang: Parquet untuk analitik.

**Next:** DM5 — Orkestrasi & dbt

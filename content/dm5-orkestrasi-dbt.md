# DM5: Orkestrasi & dbt — Pipelinemu Butuh Konduktor

## Masalah: Dashboard Pagi yang Kosong
Script cron mati jam 2 pagi; tak ada yang tahu sampai direksi buka dashboard jam 7. Script-nya benar — yang gagal orkestrasinya.

## 1. Orkestrasi (Airflow/Dagster/Prefect)
Konduktor orkestra: jadwal + dependensi + retry + alert + visibilitas + backfill. Cron = pemain main sendiri tanpa mendengar.

## 2. DAG
Directed Acyclic Graph: task jalan hanya jika SEMUA dependensi sukses. Desain dari data (sensor), bukan dari jam.

## 3. dbt
Transformasi SQL sebagai kode: git, test (`unique`, `not_null`), dokumentasi otomatis, urutan dari `ref()`. Airflow = orkestrasi antar sistem; dbt = transformasi di warehouse. Pasangan, bukan saingan.

## 4. Idempotency: f(f(x)) = f(x)
Job aman diulang: DELETE+INSERT / MERGE / INSERT OVERWRITE per partisi. Prasyarat retry & backfill.

## 5. Retry & Backfill
Retry untuk gagal transien (backoff + batas + alert). Backfill = mesin waktu untuk perbaiki masa lalu (butuh idempoten + partisi tanggal).

## Kesimpulan
1. Produksi = orkestrator. Cron hanya untuk mainan.
2. Idempoten dulu, baru nyalakan retry.
3. dbt untuk transformasi; Airflow untuk orkestrasi.

**Next:** DM6 — Batch vs Streaming

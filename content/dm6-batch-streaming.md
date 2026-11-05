# DM6: Batch vs Streaming — Koran Pagi atau Kabar Detik Ini?

## Masalah: Rp2 Miliar yang Lolos Semalam
Fraud batch ketahuan jam 1 pagi — uang sudah kabur jam 6. Sistem bekerja sempurna; masalahnya waktu. Jawaban telat = jawaban salah.

## 1. Batch vs Streaming
- **Batch**: murah, sederhana, telat = interval jadwal. Default untuk 80% kasus.
- **Streaming**: detik, mahal, kompleks — hanya jika nilai waktu membenarkannya.
- **Micro-batch** (5–15 mnt): 90% manfaat dengan 20% kompleksitas.
- Konsep: event time vs processing time, window, watermark.

## 2. Kafka
Distributed event log: **topic → partition** (urutan hanya per partisi!) → **consumer group** → **offset** (replay!) → retention. Beda dengan queue: banyak consumer independen baca dengan kecepatan sendiri.

## 3. CDC
Baca WAL (bukan SELECT * berkala) → replikasi ringan, real-time, lengkap. Pola standar OLTP → warehouse (Debezium → Kafka).

## 4. Semantik Pengiriman
At-most-once / at-least-once / exactly-once (mahal!). Rumus praktis: at-least-once + consumer idempoten ≈ exactly-once.

## Kesimpulan
1. Default = batch. Naik ke streaming jika ada nilai bisnis per jam-nya.
2. Duplikat pasti terjadi → consumer wajib idempoten.
3. Butuh urutan → partition key = ID entitas.

**Next:** DM7 — Kualitas Data

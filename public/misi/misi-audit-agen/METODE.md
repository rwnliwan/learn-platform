# METODE — Misi Agen: Tool yang Disalahgunakan (misi-audit-agen)

- **Sumber data:** SINTETIS — dibuat dengan generator Python (seed 42) khusus untuk misi ini; BUKAN trace produksi agen mana pun.
- **File:** `jejak_agen.csv` — 92 langkah × 6 sesi customer-service (kolom: sesi, langkah, tool, argumen, waktu), rentang 2026-10-14 08:06–16:07.
- **Metode:** tiap sesi dibangun dari alur tool resmi (cari_pelanggan, cek_pesanan, ringkasan_riwayat, buat_tiket, kirim_email) dengan argumen acak dari template aman; pola serangan disuntik di posisi tetap: 5 pemanggilan tool tak diotorisasi (eksekusi_sql, kirim_webhook ×2, baca_file, ubah_hak_akses) dan 10 argumen mengandung PII (pola: NIK 16 digit `\b\d{16}\b`, nomor HP `08\d{8,11}` — pola yang SAMA dipakai solution lab).
- **Seed:** 42.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 5437 byte.
- **Batas jujur:** pola serangan disederhanakan untuk latihan (serangan dunia nyata lebih halus — mis. eksfiltrasi bertahap, PII terfragmentasi); NIK/nomor HP/URL semuanya fiktif; jejak hanya 1 hari sehingga tidak mewakili perilaku jangka panjang.

# DM15: Cloud & DataOps — Infrastruktur sebagai Kode, Tagihan Terkendali

## Masalah: Tagihan $48.000 di Bulan Pertama
Warehouse 24/7 tanpa auto-suspend, data dingin di tier panas, egress antar-region tak disadari. Cloud tak mahal — cloud tak dikelola yang mahal.

## 1. Object Storage
Fondasi lake: tiering (hot→cool→archive) + lifecycle policy otomatis. Aturan: data diam = murah, data bergerak = mahal (waspadai egress!).

## 2. IaC (Terraform)
Infra sebagai kode berversi: reproducibility + audit via git + rebuild cepat + review. Klik console = utang operasional.

## 3. CI/CD untuk Data
Test otomatis (dbt test, data test, preview) → review → blue/green (tulis baru, validasi, swap) + rollback via time travel. Breaking change tertangkap di CI.

## 4. FinOps
Tagihan = metrik teknik per tim (tagging!). Compute 55% = tuas terbesar. Optimasi = desain (40–70%), bukan diskon (10–20%).

## 5. Backup & DR
**RPO** (data boleh hilang) & **RTO** (boleh down) ditentukan bisnis. Biaya proteksi < ekspektasi rugi. Backup yang tak pernah di-restore = harapan.

## Kesimpulan
1. Tagihan = metrik. Infra = kode. Deploy = test + rollback.

**Next:** DM16 — BI & Analytics Engineering

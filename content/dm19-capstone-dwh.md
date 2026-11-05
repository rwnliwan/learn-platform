# DM19 (Capstone): Mini Data Warehouse — Dari Nol sampai Dipercaya

## Misi
Bangun mini-DWH "Bank Maju": 3 sumber berantakan → 1 mart tepercaya. Hasil: pipeline staging→silver→gold + test terbukti + katalog & lineage + README 1 halaman (portofolio!).

## Fase 1–3: Staging → Silver → Gold
- **Bronze**: terima mentah (ELT).
- **Silver**: dedup, standarisasi, validasi.
- **Gold**: star schema (dim + fakta + agregat). Kasus tepi: duplikat T002, nasabah hantu N999 → catat + alert, jangan silent drop.
- Keputusan tertulis: grain, SCD, survivorship, idempotency, toleransi rekonsiliasi.

## Fase 4: Test Kualitas
≥5 test (unik, not null, rentang, FK, rekonsiliasi). **Buktikan**: rusak 1 data → FAIL + berhenti → perbaiki → PASS. Test yang tak pernah gagal = belum terbukti.

## Fase 5: Katalog & Lineage
Tiap tabel: deskripsi + owner + label kualitas. Lineage sumber → gold. Uji "orang asing": bisakah jawab tanpa bertanya padamu?

## Rubrik (target ≥10/14)
Pipeline jalan (2), keputusan tertulis (2), test terbukti (2), katalog (2), lineage (2), kasus tepi (2), README (2).

## Kesimpulan Track 8
DM1 lifecycle → DM2 model → DM3 database → DM4 lakehouse → DM5 orkestrasi → DM6 streaming → DM7 kualitas → DM8 kontrak → DM9 governance → DM10 metadata → DM11 master → DM12 keamanan → DM13 regulasi → DM14 arsitektur → DM15 DataOps → DM16 BI → DM17 strategi → DM18 Spark → DM19 bukti. Selamat! 🎓

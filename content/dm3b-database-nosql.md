# DM3B: NoSQL, BASE & CAP — Ketika Satu Server Tidak Lagi Cukup

## Masalah: 12.12 dan Database yang Menyerah
2 juta orang serbu flash sale; database satu server tersedak. Scale-up ada plafon — NoSQL lahir untuk scale-out (tambah banyak server murah).

## 1. Empat Tipe NoSQL
- **Document** (MongoDB): baca utuh, skema fleksibel. Prinsip: model by query.
- **Key-Value** (Redis): O(1) by key, sub-milidetik — cache/session.
- **Wide-Column** (Cassandra): tulis masif tersebar — time-series.
- **Graph** (Neo4j): relasi dalam — fraud detection.
- Pilih dari **pola baca**, bukan hype. NoSQL = "Not Only SQL".

## 2. BASE
**Basically Available, Soft state, Eventually consistent.** "Paket pasti sampai, jamnya tak dijamin." Cocok untuk feed/foto; bencana untuk saldo.

## 3. Teorema CAP
Saat partition: pilih **Consistency** atau **Availability** (P tak terhindarkan). CP = bank (lebih baik tak jawab daripada salah); AP = feed (lebih baik basi daripada mati). Keputusan per fitur, bukan label abadi.

## 4. Polyglot Persistence
Banyak DB untuk banyak kekuatan (Postgres + Redis + Elasticsearch). Mulai dari satu DB; tambah hanya jika pola akses terbukti tak terlayani.

## Kesimpulan
1. Default = Postgres. Uang → CP/ACID.
2. Pilih NoSQL dari pola baca.
3. CAP = keputusan per fitur.

**Next:** DM4 — Warehouse & Lakehouse

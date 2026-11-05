# METODE — Dataset misi-indeks-hantu (Database Administrator · Misi B)

## Pernyataan kejujuran data (baca dulu)

**Data 100% SINTETIS.** Seluruh baris dibangkitkan oleh generator
`/tmp/build_misi_dba.py` (seed 42) — meniru **pola** keluaran `EXPLAIN`,
`pg_stat_user_indexes`, dan `pg_stat_all_tables` PostgreSQL untuk skenario
latihan tuning indeks. **Bukan hasil EXPLAIN sungguhan, bukan statistik dari
database produksi nyata.** Nama tabel/indeks fiktif ("Toko Warisan" yang sama
dengan Misi A). Angka ms, baris, dan hitungan pemakaian adalah bilangan yang
dipilih untuk mengilustrasikan pola (full scan, indeks hantu, statistik basi),
**bukan pengukuran nyata**. Jangan pernah menyebut dataset ini "data nyata".

## Parameter generator (seed 42)

- `query_log.csv`: 40 baris — `query_id` (Q01–Q40), `teks`, `tabel`,
  `operasi` (Index Scan / Seq Scan), `baris_dipindai`, `baris_total`,
  `ms` (waktu), `indeks_dipakai`. 8 baris pertama dirancang manual
  (pola pedagogis); 32 baris sisanya acak berpola (seed 42).
- `indeks.csv`: 12 baris — `nama`, `tabel`, `kolom` (termasuk ekspresi
  `LOWER(email)` dan komposit `(kota, total)`), `dipakai_30_hari`,
  `ukuran_kb`, `tulis_per_hari`.
- `statistik_tabel.csv`: 3 baris — `tabel`, `baris_tercatat` (menurut
  planner), `baris_aktual`, `terakhir_analyze`. Tabel orders disengaja basi.

## Pola yang disuntikkan (disengaja — ini bahan latihannya)

| Kode | Lokasi | Deskripsi |
|------|--------|-----------|
| P1 | query_log Q02, Q03, Q05 | Seq Scan penuh: baris_dipindai = baris_total |
| P2 | idx_cust_email_lower | Indeks di atas LOWER(email), dipakai 0× — query memakai UPPER(email) |
| P3 | idx_cust_kota, idx_orders_total, idx_cust_nama | Indeks hantu: dipakai 0×, membebani write |
| P4 | statistik orders | Basi: tercatat 10.000 vs aktual 2.100.000, analyze 2026-01-02 |
| P5 | Q03 (laporan per kota) | Cepat di staging (sampel 1%), lambat di prod (skew: 90% order 1 kota) |
| P6 | idx_orders_kodepos | Kolom TEXT di-join ke INTEGER — cast implisit mematikan indeks |
| P7 | idx_orders_kota_total | Duplikat leftmost dari idx_orders_kota (kolom pertama sama) |

P1–P3 dipakai di Lab SQL (versi mini inline di konten, pola sama).
P2, P4–P6 dipakai di misi audit (dossier).

## Skema kolom

- `query_log.csv`: query_id TEXT · teks TEXT · tabel TEXT · operasi TEXT ·
  baris_dipindai INTEGER · baris_total INTEGER · ms INTEGER · indeks_dipakai TEXT
- `indeks.csv`: nama TEXT · tabel TEXT · kolom TEXT · dipakai_30_hari INTEGER ·
  ukuran_kb INTEGER · tulis_per_hari INTEGER
- `statistik_tabel.csv`: tabel TEXT · baris_tercatat INTEGER · baris_aktual INTEGER ·
  terakhir_analyze TEXT

## Catatan jujur

- sql.js di browser tidak menjalankan EXPLAIN sungguhan — Lab 1 memakai
  **tabel simulasi rencana eksekusi** (`rencana`), dan itu dinyatakan eksplisit
  di langkah lab.
- Mini-seed lab SQL memakai pola yang sama pada skala kecil agar expectedRows
  bisa diverifikasi tangan.

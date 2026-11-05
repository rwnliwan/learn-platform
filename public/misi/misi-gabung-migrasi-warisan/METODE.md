# METODE — Dataset misi-gabung-migrasi-warisan (Database Administrator x Data Management · Capstone)

## Pernyataan kejujuran data (baca dulu)

**Data 100% SINTETIS.** Seluruh baris dibangkitkan oleh generator
`/tmp/cap5_gen_dataset.py` (seed 42) — meniru **pola** database ritel warisan
10 tahun: tabel pelanggan/produk/orders/pembayaran, log query, katalog indeks,
statistik planner, profil kualitas, dan register kepemilikan. **Bukan data
produksi nyata, bukan hasil EXPLAIN sungguhan, bukan statistik dari database
nyata.** Nama perusahaan ("Toko Warisan") fiktif dan dipakai bersama misi-misi
DBA lain sebagai benang merah narasi. Angka ms, baris, dan hitungan pemakaian
adalah bilangan yang dipilih untuk mengilustrasikan pola (nilai NULL, duplikat,
baris yatim, full scan, indeks hantu, statistik basi), **bukan pengukuran
nyata**. Jangan pernah menyebut dataset ini "data nyata".

## Parameter generator (seed 42)

- `pelanggan.csv`: 2000 baris — id, nama, email, telepon, kota, tanggal_daftar
  (2016-01-01 s.d. 2026-09-30). Disuntik: 60 email NULL (3.0%),
  40 email duplikat lintas id (jejak CRM-merge 2019), ~4% telepon format liar.
- `produk.csv`: 300 baris — id, nama, kategori, harga (semua valid; kontrol).
- `orders.csv`: 8000 baris — id, pelanggan_id, tanggal, total, status.
  Disuntik: ~1% pelanggan_id yatim (9001-9999), ~1% tanggal masa depan (2027),
  ~1,5% total negatif (refund dicatat sebagai order negatif), ~2% status liar
  ('X', 'DIBATALKAN', 'selesai ' dengan spasi, 'PENDING').
- `pembayaran.csv`: 7500 baris — id, order_id, metode, jumlah, tanggal_bayar.
  Disuntik: ~1% order_id yatim (90001+).
- `profil_kualitas.csv`: 8 baris — agregat profil kualitas DIHITUNG dari data
  di atas (null_pct, duplikat, nilai_tak_valid) + kolom aturan_yang_seharusnya_ada.
- `query_audit.csv`: 30 baris — query_id, teks, tabel, operasi, baris_dipindai,
  baris_total, ms, indeks_dipakai. 12 baris pertama dirancang manual (pola
  pedagogis); 18 sisanya acak berpola (seed 42).
- `indeks.csv`: 10 baris — nama, tabel, kolom, dipakai_30_hari, ukuran_kb,
  tulis_per_hari.
- `statistik_tabel.csv`: 4 baris — baris_tercatat vs baris_aktual vs terakhir_analyze.
- `kepemilikan.csv`: 6 baris — pemilik_bisnis, steward_teknis, status.
  `retur` dan `voucher_lama` disengaja TANPA pemilik (warisan 2018/2019).
- `skema.sql`: DDL hasil reverse-engineering + catatan constraint yang hilang.

## Pola yang disuntikkan (disengaja — ini bahan latihannya)

| Kode | Lokasi | Deskripsi |
|------|--------|-----------|
| K1 | pelanggan.email | 60 NULL + 40 duplikat lintas id |
| K2 | pelanggan.telepon | ~4% format liar (huruf, terlalu pendek) |
| K3 | orders.pelanggan_id | ~1% yatim — FK tidak pernah ditegakkan |
| K4 | orders.tanggal | ~1% masa depan (2027) — bug jam 2021 |
| K5 | orders.total | ~1,5% negatif — refund sebagai order negatif |
| K6 | orders.status | ~2% nilai liar di luar daftar tertutup |
| K7 | pembayaran.order_id | ~1% yatim |
| P1 | query_audit Q03, Q07, Q11 (+ acak) | Seq Scan penuh: baris_dipindai = baris_total |
| P2 | idx_pelanggan_telp_lower | Indeks ekspresi LOWER(telepon), dipakai 0x — query memakai UPPER(telepon) |
| P3 | idx_orders_status, idx_produk_nama | Indeks hantu: 0x dipakai 30 hari, membebani write + dump |
| P4 | statistik orders | Basi: tercatat 50.000 vs aktual 8.012, analyze 2026-01-02 |
| P5 | idx_orders_tanggal(_status) | Duplikat leftmost: kolom pertama sama |
| G1 | kepemilikan retur, voucher_lama | Tabel warisan tanpa pemilik bisnis maupun steward |

K1–K7 dipakai di Lab 1 SQL (versi mini inline di konten, pola sama).
P1–P4 dipakai di Lab 2 SQL (versi mini inline di konten, pola sama).
G1 dipakai di langkah tata kelola (kepemilikan).

# METODE — Dataset misi-migrasi-tanpa-downtime (Database Administrator · Misi A)

## Pernyataan kejujuran data (baca dulu)

**Data 100% SINTETIS.** Seluruh baris dibangkitkan oleh generator
`/tmp/build_misi_dba.py` (seed 42, Python `random.Random(42)`) — meniru **skema**
database warisan toko daring fiktif ("Toko Warisan"). **Tidak ada data nasabah,
transaksi, atau perusahaan nyata.** Nama orang (`Ayu Saputra`, …), email
(`...@contoh.id`), dan kota adalah label fiktif. Angka absolut (total, jumlah)
adalah bilangan acak, **bukan kejadian nyata**. Jangan pernah menyebut dataset
ini "data nyata".

## Parameter generator (seed 42)

- `customers`: 1.000 baris — `id` (1–1000), `nama`, `email`, `kota`
  (7 kota Indonesia), `tanggal_daftar` (acak, 2024).
- `orders`: 5.000 baris + 5 baris duplikat suntikan — `id`, `customer_id`
  (acak 1–1000), `tanggal` (acak, Jan–Okt 2025), `total` (Rp 50 rb–2,5 jt),
  `status` ∈ {baru, diproses, kirim, selesai, batal}.
- `payments`: 8.000 baris — `id`, `order_id` (acak 1–5000), `jumlah`,
  `metode` ∈ {transfer, kartu, ewallet, cod}, `tanggal`.
- `orders_target`: salinan `orders` SETELAH "migrasi" — dipakai Lab Python
  untuk verifikasi checksum sumber vs target. Disuntik 129 baris hilang
  (id 7, 44, 81, … — kelipatan 37) dan 5 baris rusak isi (id 100, 2000, 3000,
  4000, 4500 — kolom `total` diubah).
- Skala kecil disengaja agar file < 5 MB dan bisa dibuka di browser.

## Kotoran yang disuntikkan (disengaja — ini bahan latihannya)

| Kode | Lokasi | Jumlah | Deskripsi |
|------|--------|--------|-----------|
| D1 | orders.customer_id | 12 | FK yatim: customer_id 9000–9011 tak ada di customers |
| D2 | payments.order_id | 9 | FK yatim: order_id 60000–60008 tak ada di orders |
| D3 | orders.id | 5 | Duplikat PK: id 55, 808, 2024, 3300, 4444 muncul 2× |
| D4 | customers.email | 7 | NULL di kolom NOT NULL: id 42, 137, 256, 389, 511, 700, 923 |
| D5 | orders.status | 4 | Nilai di luar enum: 'dibatalkan_x', 'pending_?', 'kirim!', 'Selesai' |

D1–D4 dipakai di Lab SQL (versi mini inline di konten, pola sama).
D5 dipakai di misi audit (dossier).

## Skema kolom

- `customers.csv`: id INTEGER PK · nama TEXT · email TEXT NOT NULL · kota TEXT · tanggal_daftar TEXT
- `orders.csv`: id INTEGER PK · customer_id INTEGER FK→customers(id) · tanggal TEXT · total INTEGER · status TEXT CHECK ∈ enum
- `payments.csv`: id INTEGER PK · order_id INTEGER FK→orders(id) · jumlah INTEGER · metode TEXT · tanggal TEXT

## Catatan jujur

- Constraint di atas adalah **aturan bisnis yang seharusnya**, bukan constraint
  yang ditegakkan file CSV — justru itu poin misinya: database warisan dengan
  constraint longgar.
- Mini-seed lab SQL di file konten memakai pola kotoran yang sama pada skala
  kecil (10–14 baris per tabel) agar expectedRows bisa diverifikasi tangan.

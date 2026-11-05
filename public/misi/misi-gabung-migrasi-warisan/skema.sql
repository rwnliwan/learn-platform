-- SKEMA WARISAN "Si Warisan" (Toko Warisan) — dokumentasi hasil reverse-engineering 2026-10-15.
-- 100% SINTETIS. Catatan: TIDAK ADA foreign key aktif, TIDAK ADA CHECK constraint
-- di database produksi warisan (aturan hanya ada di kepala 3 generasi DBA).

CREATE TABLE pelanggan (
  id             INTEGER PRIMARY KEY,
  nama           TEXT NOT NULL,
  email          TEXT,              -- seharusnya NOT NULL + UNIQUE (bocor: NULL & duplikat)
  telepon        TEXT,              -- seharusnya format ^08[0-9]{9,13}$
  kota           TEXT,
  tanggal_daftar DATE
);

CREATE TABLE produk (
  id      INTEGER PRIMARY KEY,
  nama    TEXT NOT NULL,
  kategori TEXT,
  harga   INTEGER                -- seharusnya CHECK (harga > 0)
);

CREATE TABLE orders (
  id           INTEGER PRIMARY KEY,
  pelanggan_id INTEGER,            -- seharusnya FK -> pelanggan(id); yatim ditemukan
  tanggal      DATE,               -- seharusnya CHECK (tanggal <= CURRENT_DATE)
  total        INTEGER,            -- seharusnya CHECK (total >= 0)
  status       TEXT                -- seharusnya IN ('baru','diproses','selesai','batal')
);

CREATE TABLE pembayaran (
  id           INTEGER PRIMARY KEY,
  order_id     INTEGER,            -- seharusnya FK -> orders(id); yatim ditemukan
  metode       TEXT,
  jumlah       INTEGER,
  tanggal_bayar DATE
);

-- Tabel warisan tanpa pemilik (lihat kepemilikan.csv): retur, voucher_lama.

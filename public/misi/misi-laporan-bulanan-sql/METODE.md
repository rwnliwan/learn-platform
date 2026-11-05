# METODE — Misi Laporan: Dari Tabel Mentah ke Angka Bulanan (misi-laporan-bulanan-sql)

- **Status data: 100% SINTETIS.** Seluruh baris di `orders.csv`, `customers.csv`, `refunds.csv`
  dibuat oleh generator `m2-sql-gen/gen.py` (seed tetap **42**) — BUKAN data transaksi nyata,
  BUKAN dari perusahaan mana pun. Nama toko, nominal, dan tanggal semuanya fiktif.
- **Tujuan sintetis:** melatih teknik rekonstruksi laporan (CTE, window function, agregasi
  berlapis) dan audit kualitas data pada data yang *sengaja* dikotori — tanpa risiko
  membocorkan data asli.
- **Skema:**
  - `orders(order_id TEXT, customer_id TEXT, order_date TEXT, amount INTEGER, status TEXT)`
    — 72 baris, Jan–Jun 2025, nominal IDR bilangan bulat. Varian status: paid/Paid/PAID
    (sah), pending, cancelled/canceled, void, payed (typo).
  - `customers(customer_id TEXT, customer_name TEXT, join_date TEXT, region TEXT)`
    — 24 baris; `C007` dan `C019` bernama sama ("Toko Berkah Jaya") = satu pelanggan dua ID.
  - `refunds(refund_id TEXT, order_id TEXT, refund_date TEXT, amount INTEGER)`
    — 13 baris; `R004` muncul DUA KALI identik (duplikat yang harus didedup).
- **Aturan bisnis benar (kunci jawaban lab):** status sah = `LOWER(TRIM(status))='paid'`;
  refund didedup per `refund_id` (ambil 1 via `ROW_NUMBER()`); refund dibebankan pada
  bulan `refund_date`; agregat bulanan + kolom kumulatif (`SUM() OVER (ORDER BY bulan)`).
- **Tanggal snapshot:** 2026-10-15. Ukuran total < 50 KB.
- **Batas jujur:** angka "laporan lama" di dossier audit adalah fiksi yang dirancang
  mengandung 4 suntikan impostor; tidak merepresentasikan laporan perusahaan mana pun.

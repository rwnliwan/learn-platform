# METODE — Misi Rekonsiliasi: Dua Sumber, Dua Kebenaran (misi-dua-sumber-tidak-cocok)

- **Status data: 100% SINTETIS.** Seluruh baris di `billing.csv` dan `crm.csv`
  dibuat oleh generator `m2-sql-gen/gen.py` (seed tetap **42**) — BUKAN data billing/CRM
  nyata, BUKAN dari perusahaan mana pun. Kunci pelanggan, nominal, dan timestamp fiktif.
- **Tujuan sintetis:** melatih audit rekonsiliasi dua sumber (join key inkonsisten, NULL,
  timezone berbeda, duplikat kunci, baris koreksi tanpa jejak) pada data yang *sengaja*
  dikotori — tanpa risiko data asli.
- **Skema:**
  - `billing(bill_id TEXT, customer_key TEXT, billed_at TEXT, amount INTEGER, status TEXT)`
    — 41 baris, 2025-03-01 s.d. 2025-03-07, timestamp **UTC**. Nominal IDR bilangan bulat
    (boleh negatif: baris koreksi). Sengaja: 3 kunci berspasi (`"K-107 "`, `"K-110 "`),
    1 kunci NULL, 1 baris `KOR-01` berkunci `KOREKSI` senilai −200.000 tanpa referensi.
  - `crm(customer_id TEXT, customer_key TEXT, customer_name TEXT, created_at TEXT, segment TEXT)`
    — 20 baris, timestamp **WIB lokal** (tanpa penanda zona). Sengaja: kunci `K-109`
    duplikat (2 customer_id), 1 kunci NULL, kunci `K-118` hanya ada di CRM.
- **Aturan bisnis benar (kunci jawaban lab):** kunci dinormalisasi `TRIM()` sebelum join;
  NULL tidak pernah cocok di join; FULL OUTER JOIN manual = `UNION` dari dua `LEFT JOIN`
  (SQLite tidak punya sintaks `FULL OUTER JOIN`); timestamp billing +7 jam → WIB sebelum
  agregat harian; baris koreksi dilaporkan terpisah, bukan dilebur diam-diam.
- **Tanggal snapshot:** 2026-10-15. Ukuran total < 50 KB.
- **Batas jujur:** "memo analis senior" di dossier audit adalah fiksi yang dirancang
  mengandung 4 suntikan impostor; tidak merepresentasikan memo perusahaan mana pun.

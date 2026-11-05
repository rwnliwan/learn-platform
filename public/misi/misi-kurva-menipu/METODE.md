# METODE — Misi Kurva yang Menipu (misi-kurva-menipu)

- **Sumber data:** FRED, Federal Reserve Bank of St. Louis (fred.stlouisfed.org) — data publik pemerintah federal AS. Seri diunduh via fredgraph CSV (https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS2 dan ?id=DGS10) pada 2026-10-15 dan dibekukan tanpa perubahan. Atribusi: Federal Reserve Bank of St. Louis.
- **Seri:** DGS2 (Treasury 2 tahun, harian) & DGS10 (Treasury 10 tahun, harian), 2021-01-01 s.d. 2024-12-31.
- **Metode:** gabung kedua seri per tanggal; hanya hari bursa yang ada di KEDUA seri (1000 baris); kolom `tanggal,dgs2_pct,dgs10_pct`. File `portofolio_obligasi.csv` = data INTERNAL bank (ilustratif untuk misi: 5 obligasi fiktif — id, nama, kupon_pct, tenor_thn, nominal_jt); kolomnya dipakai Lab 3 apa adanya.
- **Seed:** 42 (tidak ada sampling acak — seri dipakai penuh).
- **Tanggal tangkapan:** 2026-10-15. Ukuran: kurva_imbal_hasil.csv 21840 byte; portofolio_obligasi.csv 221 byte.
- **Batas jujur:** yield Treasury AS dipakai sebagai PROXY kurva pasar (bukan kurva domestik aktual bank); angka-angka "klaim treasury" di misi (yield 3,42%, durasi 8,12, dsb.) adalah konstruksi misi, bukan data FRED; portofolio_obligasi.csv fiktif ilustratif.

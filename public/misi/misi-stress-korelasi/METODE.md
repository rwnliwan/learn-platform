# METODE — Misi Badai: Ketika Semua Korelasi Menuju Satu (misi-stress-korelasi)

- **Sumber data:** Sumber: FRED, Federal Reserve Bank of St. Louis (fred.stlouisfed.org) — data publik pemerintah federal AS. Seri diunduh via fredgraph CSV pada 2026-10-15 dan dibekukan tanpa perubahan.
- **Seri:** SP500 (S&P 500 harian), VIXCLS (VIX harian), DGS10 (yield obligasi 10 thn AS, harian), 2019-01-01 s.d. 2021-06-30; digabung per tanggal, hanya tanggal yang ada di ketiga seri.
- **Metode:** `spx_ret` = imbal hasil log harian (%); `vix_chg` = perubahan poin VIX; `y10_chg` = perubahan yield (pp). Tidak ada smoothing — angka mentah apa adanya.
- **Seed:** 42 (tidak ada sampling acak). **Tanggal tangkapan:** 2026-10-15.
- **Batas jujur:** tiga seri makro dipakai sebagai proksi kondisi pasar; bukan portofolio spesifik bank mana pun.

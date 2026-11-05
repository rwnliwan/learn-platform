# METODE — Misi VaR: Model yang Terlalu Tenang (misi-var-backtest)

- **Sumber data:** Sumber: FRED, Federal Reserve Bank of St. Louis (fred.stlouisfed.org) — data publik pemerintah federal AS. Seri diunduh via fredgraph CSV pada 2026-10-15 dan dibekukan tanpa perubahan.
- **Seri:** SP500 (S&P 500, harian), 2019-01-01 s.d. 2021-06-30.
- **Metode:** imbal hasil log harian `100*ln(Pt/Pt-1)`; kolom `tanggal,harga_penutupan,imbal_hasil_pct`. File `laporan_var_mesin.csv`: VaR99 parametrik mesin bank = 2.3263 * std dev 250 hari berjalan (kolom `tanggal,var99_pct`).
- **Seed:** 42 (tidak ada sampling acak — seri dipakai penuh).
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 15920 byte.
- **Batas jujur:** S&P 500 dipakai sebagai PROXY portofolio ekuitas (bukan portofolio bank yang sebenarnya); VaR mesin disederhanakan untuk misi ini.

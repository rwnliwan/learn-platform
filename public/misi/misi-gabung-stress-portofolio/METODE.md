# METODE — Misi Portofolio Terbakar: Stress Test di Tengah Badai (misi-gabung-stress-portofolio)

- **Sumber data:** SINTETIS — seri pasar DIBANGKITKAN SENDIRI dengan generator Python seed 42 (`/tmp/cap3-stress/gen.py`, pola proyek: tidak disimpan di repo). BUKAN data FRED asli. Seri meniru POLA FRED 2020 (SP500: puncak Feb → crash Maret ≈ −35% → rebound → akhir tahun; DGS10: 1,88 → 0,50 → 0,83) — pola meniru, angka sintetis.
- **Seri:** sp500 (harian, 2020-01-02 s.d. 2020-12-31, 253 hari perdagangan NYSE), dgs10 (yield %, harian, window sama).
- **Metode:** imbal hasil log harian `100*ln(Pt/Pt-1)`; kolom sp500.csv = `tanggal,sp500,ret_sp500_pct`; dgs10.csv = `tanggal,yield_pct`. holdings.csv = 40 posisi sintetis (`id,kelas,bobot,beta_sp500,durasi,haircut_pct`): ekuitas 55%, obligasi 40%, kas 5%; bobot ternormalisasi total = 1.
- **Imbal hasil portofolio harian (Lab 1):** `r_p = Σ_ekuitas w·beta·r_sp500 + Σ_obligasi w·(−durasi·Δyield_pp)`; kas = 0.
- **Skenario (Lab 2):** S1 crash ekuitas −30% → `30%·Σ(w·beta)`; S2 spike yield +150bps → `1,5%·Σ(w·durasi)`; S3 gabungan → S1+S2+`Σ(w·haircut_pct)`. Limit stress komite = 10% NAV (NAV = Rp 1 triliun).
- **Seed:** 42 (deret pasar + holdings; SQL seed diambil dari 10 hari terburuk aktual + 4 baris pengecoh).
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 12655 byte.
- **Batas jujur:** seluruh deret pasar SINTETIS (bukan FRED asli) — dipakai agar misi bisa berjalan offline dan angkanya deterministik; holdings & skenario fiktif untuk misi ini.

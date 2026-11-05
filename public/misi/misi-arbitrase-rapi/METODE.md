# METODE — Misi Arbitrase yang Terlalu Rapi (misi-arbitrase-rapi)

- **Sumber data:** DATA SINTETIS 100% — tidak ada data pasar nyata di misi ini. Dibangkitkan dengan `generator.py` (di folder yang sama), numpy `default_rng(42)`.
- **Seri:** `pasangan_sintetis.csv` (tanggal, harga_a, harga_b; 1000 hari bursa 2021-01-04 s.d. 2024-11-01) + `laporan_backtest.csv` (tanggal, zscore_laporan, posisi) yang MENIRU laporan internal curang.
- **Metode:** x_t = random walk (x_0 = 4,0; inovasi N(0, 0,02^2)); spread s_t = Ornstein-Uhlenbeck (s_t = 0,97·s_{t-1} + N(0, 0,006^2); half-life teoritis ln(0,5)/ln(0,97) = 22,76 hari); beta_t = 1,0 untuk t < 650 lalu 1,35 (STRUCTURAL BREAK disuntikkan pada 2023-07-03); y_t = beta_t·x_t + s_t; harga = exp(). Disimulasi 4000 hari, dipakai segmen [2570:3570] agar statistik sampel sesuai parameter target (half-life pra-break ~25 hari). File laporan: spread dihitung dengan beta basi 1,0 untuk SELURUH periode (break diabaikan) + z-score memakai mean & std SELURUH sampel (lookahead — memakai masa depan); posisi = SHORT_SPREAD/LONG_SPREAD bila |z| > 2, else FLAT.
- **Seed:** 42 (terdokumentasi di generator.py; segmen dipilih sesuai kriteria di atas).
- **Tanggal tangkapan:** 2026-10-15. Ukuran: pasangan_sintetis.csv 28129 byte; laporan_backtest.csv 24561 byte; generator.py 2436 byte.
- **Batas jujur:** SEMUA angka buatan — pola break & lookahead-nya dirancang agar bisa diverifikasi pasti (simulator, bukan pasar nyata); perilaku strategi di pasar nyata bisa berbeda; risiko eksekusi/likuiditas tidak dimodelkan.

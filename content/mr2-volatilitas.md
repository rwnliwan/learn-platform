# MR2: Volatilitas & Kovarians — EWMA dan Shrinkage

Volatilitas berkelompok (clustering): estimator statis terlambat membaca perubahan rezim. EWMA memberi bobot eksponensial ke data terbaru; shrinkage (Ledoit-Wolf) menstabilkan matriks kovarians.

- EWMA: s2_t = l*s2_{t-1} + (1-l)*r2_{t-1}; l=0.94 standar harian
- Trade-off abadi: kecepatan adaptasi vs stabilitas
- Shrinkage: S* = d*F + (1-d)*S — kompromi bias vs estimation error
- Banyak aset + data pendek -> kovarians sampel noisy & bisa singular
- Log-return aditif terhadap waktu — memudahkan scaling horizon

*(Lesson interaktif lengkap tersedia di halaman /learn/mr2-volatilitas.)*

# METODE — Misi Markowitz yang Terlalu Optimis (misi-markowitz-optimis)

- **Sumber data:** SINTETIS 100% — dibangkitkan oleh `generator.py` (seed 42) di folder ini. BUKAN data pasar nyata; semua angka adalah hasil simulasi.
- **Seri:** 8 aset fiktif (BANK-A, KONSUM, ENERGI, TELEKOM, PROPERTI, TAMBANG, INFRA, RITEL); imbal hasil bulanan.
- **Metode:** model faktor tunggal — imbal hasil bulanan aset i = mu_true_i + beta_i * F + eps_i; F ~ Normal(0, (18%/sqrt(12))^2); eps_i ~ Normal(0, var_idio_i/12) dengan var_idio_i dipilih agar vol tahunan total = vol_true_i. Periode estimasi (in-sample): 60 bulan, 2019-01 s.d. 2023-12 (`returns_in.csv`: tanggal,BANK-A,...,RITEL dalam persen). Periode uji (out-of-sample): 60 bulan, 2024-01 s.d. 2028-12, tarikan BARU dari proses yang sama (`returns_oos.csv`). `true_params.csv`: parameter TRUE yang dipakai generator (mu/vol/Sharpe tahunan) — di dunia nyata parameter ini tidak pernah diketahui.
- **Seed:** 42 (numpy default_rng; satu seed untuk seluruh pembangkitan).
- **Tanggal tangkapan:** 2026-10-15. Ukuran: returns_in.csv 9772 byte; returns_oos.csv 9828 byte; true_params.csv 342 byte.
- **Batas jujur:** data SINTETIS — tidak ada kesimpulan tentang pasar nyata yang boleh ditarik; biaya transaksi, larangan short-selling parsial, dan pajak diabaikan; model faktor tunggal adalah penyederhanaan ekstrem dari pasar sesungguhnya.

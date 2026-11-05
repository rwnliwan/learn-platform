# METODE — Misi Kehancuran Penjudi (misi-kehancuran-penjudi)

- **Sumber data:** SINTETIS 100% — hasil simulasi Monte Carlo, bukan riwayat trading nyata. Tidak ada data pasar sungguhan di misi ini.
- **Seri:** satu file `kurva_ruin.csv`: 7 baris ringkasan simulasi per fraksi taruhan; kolom `fraksi,n_simulasi,n_ruin,n_sukses,prob_ruin,prob_sukses,median_modal_akhir`.
- **Metode:** tiap path: modal awal 100; tiap trade taruhan = fraksi × modal saat itu; menang (+taruhan) dengan peluang 0,55, kalah (−taruhan) 0,45 (payoff 1:1); ruin bila modal < 50 (stop-loss desk); sukses bila modal ≥ 200; maks 2000 trade per path; 2000 path per fraksi (fraksi 0,02–0,30). Fungsi simulasi di generator IDENTIK dengan kode solusi Lab 1 (vektorisasi NumPy, seed 42).
- **Seed:** 42 (NumPy default_rng; deterministik penuh).
- **Tanggal pembuatan:** 2026-10-15. Ukuran: 352 byte.
- **Tabel SQL Lab 2** (`hasil_fraksi`, inline di file misi): 7 baris yang SAMA PERSIS dengan isi kurva_ruin.csv — untuk melatih saringan mandat risiko.
- **Batas jujur:** pasar nyata tidak punya peluang menang konstan; biaya, slippage, dan korelasi antar trade diabaikan; ruin didefinisikan sebagai stop-loss desk (50% modal), bukan kebangkrutan harfiah; hasil Monte Carlo adalah estimasi (standard error ±1% pada 2000 path).

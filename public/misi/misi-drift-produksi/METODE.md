# METODE — Misi Drift: Model yang Kedaluwarsa Diam-Diam (misi-drift-produksi)

- **Sumber data:** SINTETIS — generator Python (numpy, seed 42). BUKAN data produksi nyata.
- **File:** `distribusi_mingguan.csv` (240 baris = 10 minggu × 4 fitur × 6 bin; kolom `minggu,fitur,bin,n_ref,n_cur`; `n_ref` = 2000 sampel populasi referensi, `n_cur` ≈ 1000 sampel minggu berjalan). `akurasi_mingguan.csv` (10 baris; kolom `minggu,acc_proxy,n_prediksi`).
- **Metode:** distribusi referensi = normal baku N(0,1) dibagi 6 bin (batas −1,2/−0,6/0/0,6/1,2). Distribusi mingguan = normal dengan pergeseran mean sesuai jadwal: `skor_kredit_internal` bergeser mulai minggu 5 hingga +0,9σ di minggu 10; `pendapatan` mulai minggu 7 hingga +0,45σ; `umur_pemohon` dan `jumlah_transaksi_30d` stabil (noise sampling saja). Akurasi proxy menurun dari ≈0,87 ke ≈0,79 selama 10 minggu.
- **Seed:** 42.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 7112 byte + 178 byte.
- **Batas jujur:** pola drift dirancang untuk misi ini (pergeseran mean yang rapi). Di produksi nyata, drift bisa datang dari perubahan perilaku populasi, definisi fitur, atau pipeline — tidak selalu berbentuk pergeseran distribusi yang bersih.

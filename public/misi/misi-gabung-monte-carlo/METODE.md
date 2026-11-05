# METODE — Misi Seribu Masa Depan: Distribusi, Bukan Titik (misi-gabung-monte-carlo)

- **Sumber data:** 100% SINTETIS — dibuat khusus untuk misi ini dengan seed 42. BUKAN data pasar nyata; semua parameter (ekspektasi return, volatilitas, korelasi, fee) adalah angka fiktif yang dipilih agar pola pedagogisnya jelas (perbedaan ekor distribusi antar-alokasi).
- **File:** params.csv (19 baris kunci-nilai: mu/sigma 3 aset, 3 korelasi, fee 1%/tahun, bobot 3 alokasi).
- **Metode simulasi:** Geometric Brownian Motion tahunan, T=10 tahun, N=10.000 jalur, seed 42 (numpy default_rng); korelasi via dekomposisi Cholesky; portofolio buy-and-hold; fee drag = faktor bruto tahunan − 0,01. Target shortfall = 1,8× modal awal.
- **Tanggal pembuatan:** 2026-10-15. Ukuran: 362 byte.
- **Batas jujur:** parameter sintetis — JANGAN dipakai untuk keputusan investasi nyata; misi ini melatih logika distribusi, bukan memberi angka pasar.

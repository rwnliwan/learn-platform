# METODE — Misi Bayes yang Terbalik (misi-bayes-terbalik)

- **Sumber data:** SINTETIS 100% — tidak ada data pasien nyata. Dibangkitkan dengan generator Python (NumPy `default_rng`, seed 42) khusus untuk misi ini.
- **Seri:** satu file `skrining_simulasi.csv`: 10.000 baris hasil skrining simulasi; kolom `id,hasil_tes,status_sebenarnya`.
- **Metode:** tiap baris: status sebenarnya Sakit dengan peluang 0,01 (prevalensi); bila Sakit, tes Positif dengan peluang 0,99 (sensitivitas); bila Sehat, tes Positif dengan peluang 0,01 (1 − spesifisitas). Ground truth simulasi: TP=100, FP=114, FN=1, TN=9785 → PPV empiris 46,73% vs PPV rumus Bayes 50,00%.
- **Seed:** 42 (NumPy default_rng; deterministik penuh).
- **Tanggal pembuatan:** 2026-10-15. Ukuran: 198926 byte.
- **Tabel SQL Lab 2** (`skrining_klinik`, inline di file misi): agregat SINTETIS 6 fasilitas dari dunia simulasi yang sama (seed 42) — untuk melatih efek prevalensi pada PPV.
- **Batas jujur:** seluruh klaim "akurasi 99%" milik vendor TestX adalah fiksi misi; dataset ini simulasi edukasi, bukan data pasien; sensitivitas/spesifisitas dibuat konstan (di dunia nyata bervariasi antar populasi); biaya tindak lanjut tidak dimodelkan.

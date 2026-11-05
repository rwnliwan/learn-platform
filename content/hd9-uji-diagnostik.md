# HD9: Sensitivitas, Spesifisitas, ROC: Seberapa Bagus Tes Diagnostik

## Tujuan
- Menghitung sensitivitas, spesifisitas, PPV, NPV, LR+, LR− dari tabel 2×2.
- Menjelaskan mengapa PPV anjlok saat prevalensi rendah walau tesnya “akurat”.
- Membaca kurva ROC/AUC dan memilih threshold sesuai konteks klinis.
- Memilih metrik yang tepat untuk 4 skenario (skrining vs konfirmasi).

## Ringkasan
- Sens = TP/(TP+FN) — sifat tes. Spes = TN/(TN+FP) — sifat tes.
- PPV/NPV = yang dirasakan pasien; tergantung prevalensi (Bayes).
- SnNout: sens tinggi untuk rule out. SpPin: spes tinggi untuk rule in.
- ROC/AUC: diskriminasi di semua threshold; threshold dipilih oleh konteks.
- LR: update odds pre → post untuk pasien individual.
- Akurasi tanpa prevalensi = angka hiburan. Minta tabel 2×2.
- Validasi AI diagnostik: prospektif, populasi target, threshold operasional, decision curve.
- Fondasi untuk HD12 (evaluasi model klinis) dan HD14 (NLP ekstraksi).

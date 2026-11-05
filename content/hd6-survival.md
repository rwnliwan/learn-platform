# HD6: Kaplan-Meier & Cox: Analisis Waktu Kejadian

## Tujuan
- Menjelaskan sensor kanan dan mengapa menghapus pasien tersensor merusak analisis.
- Menghitung estimasi Kaplan-Meier langkah-demi-langkah dari data kecil.
- Menafsirkan kurva survival, median survival, dan hazard ratio Cox dengan bahasa sendiri.
- Mengenali kapan competing risks membuat KM standar menipu.

## Ringkasan
- Sensor kanan = info parsial yang tetap dipakai KM; jangan dibuang.
- KM: S(t) = produk peluang bertahan; turun hanya saat kejadian.
- Median survival: waktu kurva menyentuh 0,5. Tampilkan number at risk.
- Log-rank: bandingkan kurva (uji beda); Cox: kuantifikasi efek (HR) multivariabel.
- HR = rasio laju sesaat; cek asumsi proportional hazards.
- Competing risks: KM standar melebih-lebihkan bila ada kejadian pencegah.
- Kejadian berulang butuh model recurrent, bukan KM biasa.
- Lesson ini fondasi HD12 (prediksi), HD16 (waktu wabah), dan HD20 (capstone).

# HD12: TRIPOD & Kalibrasi: Model Prediksi yang Dipercaya Dokter

## Tujuan
- Membedakan diskriminasi vs kalibrasi dan menjelaskan kenapa dokter butuh keduanya.
- Membaca calibration plot dan menghitung konsep Brier score.
- Merancang skema validasi yang benar (temporal/eksternal) dan menghindari leakage.
- Menilai utilitas klinis via decision curve dan melapor sesuai TRIPOD.

## Ringkasan
- Kalibrasi (kejujuran angka) sama pentingnya dengan diskriminasi (AUC).
- Brier score menghukum overconfidence; calibration plot menampakkannya.
- Validasi: internal . Klaim generalisasi butuh eksternal.
- Cegah leakage: prediction time eksplisit, fitur dibekukan sebelumnya.
- Decision curve: net benefit pada threshold operasional = bukti utilitas.
- Threshold dari biaya klinis, bukan default 0,5.
- Waspadai drift: monitoring berkala + rencana rekalibrasi.
- Lapor sesuai TRIPOD; libatkan klinisi sebelum deploy.

# FR9: Evaluasi — Berhenti Memuja Akurasi

## Mengapa Ini Penting?

Model ROC-AUC 0,97 dimatikan setelah 3 bulan — investigator mogok: 1.000 alert/hari, hanya 40 yang benar. Penggantinya ROC-AUC 0,94 tapi PR-AUC jauh lebih tinggi — dan dipercaya.

---

## Tujuan Pembelajaran

- Menjelaskan mengapa ROC-AUC menipu di imbalance
- Membaca kurva PR dan PR-AUC
- Menggunakan recall@FPR dan alert rate untuk kapasitas
- Menghitung lift dan net uang terselamatkan

---

## Konsep Kunci

- FPR = FP/(FP+TN) terhibur TN massal; PR-AUC tanpa TN = metrik jujur fraud
- Alert rate x volume = nyawa investigator; tetapkan dari kapasitas
- Lift = precision_segmen/fraud_rate — bahasa bisnis & dasar prioritas antrian
- Net = TP*L - FP*C - FN*L — metrik direksi; model yang membunuh tim = gagal

---

## Catatan

Versi ringkas. Versi interaktif lengkap (lab, chart, quiz, mini-case) tersedia di halaman lesson.

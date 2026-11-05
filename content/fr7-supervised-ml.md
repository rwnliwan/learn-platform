# FR7: Supervised ML — Gradient Boosting & Cost-Sensitive

## Mengapa Ini Penting?

Model XGBoost 40 fitur, recall 41%. Satu baris diubah — scale_pos_weight 1 ke 25 — recall melonjak ke 78%. Modelnya sudah pintar; aturan mainnya yang salah.

---

## Tujuan Pembelajaran

- Menjelaskan mengapa gradient boosting raja tabel fraud
- Menangani class imbalance 1:500
- Mengatur class weight dan membaca trade-off-nya
- Menurunkan threshold dari matriks biaya

---

## Konsep Kunci

- F_m = F_{m-1} + eta*h_m — pohon memperbaiki kesalahan pendahulunya
- Mulai scale_pos_weight dari akar rasio; weight = kenop trade-off, bukan tombol ajaib
- Biaya = FN*C_FN + FP*C_FP; threshold optimal = ambang termurah, bukan 0,5
- SMOTE waspada untuk fraud; optimasi dengan kendala kapasitas

---

## Catatan

Versi ringkas. Versi interaktif lengkap (lab, chart, quiz, mini-case) tersedia di halaman lesson.

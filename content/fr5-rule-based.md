# FR5: Rule-Based — Senjata Pertama yang Tak Pernah Pensiun

## Mengapa Ini Penting?

Model Rp500 juta (AUC 0,97) menangkap 12% fraud; rule 3 baris analis senior menangkap 34%. Dua tahun kemudian rule itu masih jalan — modelnya sudah diganti 3x.

---

## Tujuan Pembelajaran

- Merancang rule lengkap: kondisi, aksi, prioritas, expiry, owner
- Menghitung hit rate dan trade-off dengan detection rate
- Tuning ambang berdasar kapasitas investigasi
- Menjalankan champion-challenger via shadow mode

---

## Konsep Kunci

- Velocity relatif terhadap baseline (bukan absolut!) = sinyal universal serangan
- Hit rate = presisi rule; detection rate = recall rule — keduanya bertentangan
- Tuning = pilih ambang dengan detection maksimal pada budget alert <= kapasitas
- Challenger wajib shadow mode; rule jelek sendirian bisa jadi fitur bagus dalam kombinasi

---

## Catatan

Versi ringkas. Versi interaktif lengkap (lab, chart, quiz, mini-case) tersedia di halaman lesson.

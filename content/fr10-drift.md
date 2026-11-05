# FR10: Validasi Temporal & Concept Drift

## Mengapa Ini Penting?

Model PR-AUC validasi 0,93 mati jadi 0,65 dalam 8 bulan. Penipu belajar dari tiap kekalahan — model tidak pernah ikut les. Dan validasi 0,93 itu sendiri bohong: random split.

---

## Tujuan Pembelajaran

- Menjelaskan mengapa random split tidak valid untuk fraud
- Membedakan concept/data/label drift
- Menjelaskan adversarial adaptation
- Menghitung PSI dan ambang aksinya

---

## Konsep Kunci

- Time-based split + embargo = satu-satunya validasi jujur
- Drift fraud disengaja oleh lawan adaptif — siklus 2-6 bulan, selamanya
- PSI = alarm asap (<0,1 aman; >0,25 bertindak); investigasi sebelum retrain
- Serangan baru -> rule darurat dulu, retrain setelah label matang

---

## Catatan

Versi ringkas. Versi interaktif lengkap (lab, chart, quiz, mini-case) tersedia di halaman lesson.

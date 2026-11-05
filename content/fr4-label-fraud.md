# FR4: Masalah Label — Kebenaran yang Datang Terlambat

## Mengapa Ini Penting?

Model PayKu akurasi 99,2% di training — meledak di produksi. 40% label 'bukan fraud' ternyata fraud yang chargeback-nya belum datang. Model belajar dari setengah kebenaran.

---

## Tujuan Pembelajaran

- Menjelaskan chargeback lag dan dampaknya (undercounted positives)
- Mengidentifikasi 3 sumber label noise
- Menjelaskan ide inti PU learning
- Merancang strategi embargo, maturation, feedback loop

---

## Konsep Kunci

- Chargeback lag 30-120 hari: label 3-4 bulan terakhir belum matang — embargo 90-120 hari
- Noisy label 5-15%: ukur via blind review; perbaiki proses sebelum tuning model
- PU learning: P(y=1|x) = P(s=1|x)/c — untuk positif sedikit-tepercaya + sisanya tak berlabel
- ROI memperbaiki label > ROI mengganti algoritma

---

## Catatan

Versi ringkas. Versi interaktif lengkap (lab, chart, quiz, mini-case) tersedia di halaman lesson.

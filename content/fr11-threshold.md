# FR11: Threshold & Kapasitas Investigasi

## Mengapa Ini Penting?

Senin pagi: 2.125 alert, 10 investigator (800 slot). 17 kasus fraud yang DITANGKAP model dibuang manusia tanpa dibaca. Model bekerja; sistem mati — karena tak ada yang menghitung kapasitas.

---

## Tujuan Pembelajaran

- Menghitung alert rate maksimal dari kapasitas
- Merancang prioritas antrian (skor tertinggi dulu)
- Menurunkan threshold optimal dari matriks biaya
- Merancang SLA dan aging antrian

---

## Konsep Kunci

- Alert rate(tau) x volume <= kapasitas — threshold = kontrak dengan kapasitas
- Antrian terurut skor = knapsack: maksimalkan hasil per slot terbatas
- tau* = C_FP/(C_FP + C_FN), lalu cek muat kapasitas
- Antrian = UGD: triase, bukan FIFO; kunci urutan cegah cherry-picking

---

## Catatan

Versi ringkas. Versi interaktif lengkap (lab, chart, quiz, mini-case) tersedia di halaman lesson.

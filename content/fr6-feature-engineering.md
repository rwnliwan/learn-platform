# FR6: Feature Engineering — Mengubah Jejak Menjadi Senjata

## Mengapa Ini Penting?

Satu fitur baru — device_age_days — menaikkan AUC 0,81 ke 0,89 dan menemukan ring Rp1,2 miliar. 40 fitur lama semuanya menjawab 'bagaimana transaksinya'; tak satu pun bertanya 'seberapa baru pelakunya'.

---

## Tujuan Pembelajaran

- Membangun window agregat pada horizon yang tepat
- Menghitung deviasi dari baseline per user (z-score personal)
- Menghitung impossible travel (haversine)
- Merancang fitur recency untuk warming/farming

---

## Konsep Kunci

- Window selaras tempo serangan: carding = menit, warming = jam-hari, bust-out = minggu
- z_user = (x - mu_user)/sigma_user — anomali itu relatif, bukan absolut
- Impossible travel = fitur fisika (>900 km/jam) yang tak bisa di-tune penipu
- Kenaikan besar datang dari sudut pandang baru, bukan tuning

---

## Catatan

Versi ringkas. Versi interaktif lengkap (lab, chart, quiz, mini-case) tersedia di halaman lesson.

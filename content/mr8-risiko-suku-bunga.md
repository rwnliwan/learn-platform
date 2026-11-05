# MR8: Risiko Suku Bunga — Duration, DV01, Convexity

Toolkit risiko suku bunga: Macaulay duration (rata-rata waktu tertimbang), modified duration & DV01 (sensitivitas rupiah), convexity (koreksi orde-2), key-rate duration (bedah per titik kurva).

- DV01 = D_mod * P * 0.0001 — bahasa limit
- Convexity selalu menguntungkan pemegang obligasi biasa; wajib untuk shock besar
- Key-rate duration: jumlah KRD = D_mod; untuk risiko bentuk kurva (twist)
- Duration-netral != hedged — cek KRD per bucket
- Waspada negative convexity pada obligasi ber-embedded-option

*(Lesson interaktif lengkap tersedia di halaman /learn/mr8-risiko-suku-bunga.)*

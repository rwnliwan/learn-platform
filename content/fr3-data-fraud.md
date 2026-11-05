# FR3: Data Fraud — 6 Sumber Sinyal

## Mengapa Ini Penting?

40 transaksi Rp50 ribu lolos dari rule DanaKita — tiga hari kemudian 40 akun itu menarik Rp5 juta masing-masing. Data untuk menangkapnya sudah ada semua; hanya belum dirakit.

---

## Tujuan Pembelajaran

- Menyebutkan 6 sumber sinyal fraud beserta contoh atributnya
- Menjelaskan device fingerprinting dan jebakan exact-match
- Menggabungkan sinyal menjadi skor risiko tertimbang
- Memilih kombinasi sinyal per tipe fraud

---

## Konsep Kunci

- 6 sumber: transaksi, device, sesi/login, perilaku, geolokasi, graph relasi
- Sinyal terkuat = perubahan + kecepatan (velocity, device baru), bukan nominal
- Skor risiko S = sum(w_i * s_i) = opini analis yang dikuantifikasi — kalibrasi sebelum dianggap probabilitas
- Device fingerprint pakai fuzzy matching; satu sinyal = gosip, tiga sinyal = bukti

---

## Catatan

Versi ringkas. Versi interaktif lengkap (lab, chart, quiz, mini-case) tersedia di halaman lesson.

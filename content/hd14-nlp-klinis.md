# HD14: NER & LLM Klinis: Membaca Catatan Dokter

## Tujuan
- Menjelaskan pipeline NER klinis: tokenisasi, pengenalan entitas, normalisasi ke terminologi.
- Menerapkan teknik de-identifikasi (Safe Harbor) dan mengukur sisa risiko.
- Menilai kapan LLM/foundation model cocok untuk tugas klinis — dan batasannya (halusinasi, privasi).
- Merancang evaluasi ekstraksi: precision/recall/F1 per tipe entitas.

## Ringkasan
- NER klinis: entitas + normalisasi (SNOMED/RxNorm) + deteksi negasi.
- Evaluasi per tipe entitas; negasi biasanya titik lemah.
- De-identifikasi: 18 identifier + ukur sisa risiko + lapisan pertahanan.
- Jangan kirim teks teridentifikasi ke API LLM publik.
- LLM: kuat untuk draf/ekstraksi awal; halusinasi = wajib human-in-the-loop.
- Mulai dari aturan + kamus sebagai baseline jujur.
- Anotasi sedikit berkualitas > banyak ngawur (ukur kappa).
- Definisikan “apa bila salah” sebelum memilih tingkat otonomi.

# BI16: Leakage & p >> n: Machine Learning untuk Biologi

## Tujuan
- Menjelaskan tantangan p >> n dan strategi seleksi fitur/regularisasi.
- Mengenali data leakage khas bio: homologi, batch, seleksi fitur di luar CV.
- Merancang validasi grouped (split by protein/pasien/studi).
- Menjelaskan aplikasi deep learning: CNN sekuens, protein language models.

## Ringkasan
- p >> n: regularisasi + seleksi + mulai sederhana.
- Leakage bio: homologi, batch, seleksi-di-luar-fold, duplikat.
- Grouped/nested CV: split by unit independen.
- Curigai akurasi >95% — audit dulu.
- Validasi independen untuk klaim performa.
- DL: untuk n besar; transfer via embedding untuk n kecil.
- Baseline sederhana dulu; kalahkan baru naik kelas.
- Simpan seed + versi + kode (BI17).

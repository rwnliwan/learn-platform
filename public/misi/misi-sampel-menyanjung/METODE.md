# METODE — Misi Sampel yang Menyanjung (misi-sampel-menyanjung)

- **Sumber data:** Palmer penguins — Horst, A. M., Hill, A. P. & Gorman, K. B. (2020), via repo GitHub `allisonhorst/palmerpenguins` (file `inst/extdata/penguins.csv`), diunduh 2026-10-15 dan dibekukan tanpa perubahan.
- **Lisensi/atribusi:** CC0 (domain publik). Dataset boleh dipakai, dimodifikasi, dan disebarluaskan tanpa izin — atribusi ke Horst, Hill & Gorman (2020) + Palmer Station LTER.
- **Seri:** 344 penguin (Adelie, Chinstrap, Gentoo) × 3 pulau (Biscoe, Dream, Torgersen), Palmer Station, Antartika, 2007–2009. Kolom: species, island, bill_length_mm, bill_depth_mm, flipper_length_mm, body_mass_g, sex, year.
- **Metode:** `penguins.csv` = file mentah utuh (2 baris tanpa flipper_length_mm dipertahankan apa adanya; dikeluarkan saat hitung mean). `sampel_stratifikasi.csv` = sampel acak terstratifikasi proporsional per spesies (Adelie 53, Gentoo 43, Chinstrap 24; total 120), seed 42, dibuat dengan pandas `sample(random_state=42)` per spesies lalu diacak ulang (`frac=1, random_state=42`).
- **Seed:** 42 (hanya untuk sampel_stratifikasi.csv; data mentah dipakai penuh).
- **Tanggal tangkapan:** 2026-10-15. Ukuran: penguins.csv 15241 byte; sampel_stratifikasi.csv 5902 byte.
- **Batas jujur:** “Sampel konsultan” (Adelie × Pulau Torgersen, n=51) adalah definisi skenario misi — sesuai lampiran laporan fiktif PT Citra Ekodata, bukan subset resmi dataset. Data 2007–2009: populasi penguin bisa berubah sejak itu; tiga pulau bukan seluruh Antartika.

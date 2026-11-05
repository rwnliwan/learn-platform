# HD11: Fenotipe & OMOP: Menjinakkan Data EHR Mentah

## Tujuan
- Menulis aturan fenotipe (definisi kohort komputabel) dari definisi klinis, dengan logika inklusi/eksklusi eksplisit.
- Menjelaskan struktur OMOP CDM (person, condition_occurrence, drug_exposure, measurement) dan menulis query kohort sederhana.
- Mengidentifikasi masalah harmonisasi unit dan time series tak beraturan pada data EHR.
- Mengevaluasi kualitas fenotipe via chart review / validasi silang sumber.

## Ringkasan
- Fenotipe: aturan inklusi/eksklusi multi-sumber, berversi, tervalidasi chart review.
- Kode mentah saja PPV rendah — kombinasikan kode + lab + obat.
- OMOP CDM: skema standar untuk riset multi-situs yang reproducible.
- Harmonisasi: LOINC/RxNorm + konversi unit; simpan unit asli.
- Informed presence bias: frekuensi ukur ∼ keparahan — agregasi + perlakukan eksplisit.
- Waspadai target leakage: fitur dari masa depan relatif terhadap prediction time.
- Kurasi > kuantitas: 20 fitur dipahami > 2.000 fitur mentah.
- Lesson ini adalah “pekerjaan kotor” yang menentukan kualitas semua lesson pemodelan (HD12, HD20).

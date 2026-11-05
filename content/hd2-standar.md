# HD2: ICD, SNOMED, FHIR: Bahasa Bersama Data Kesehatan

## Tujuan
- Membedakan peran ICD, SNOMED CT, LOINC, RxNorm: apa yang dikodekan masing-masing dan kapan dipakai.
- Menjelaskan konsep interoperabilitas (FHIR/SATUSEHAT) dan common data model (OMOP CDM) dengan bahasa sendiri.
- Melakukan mapping kode lokal ke standar dan mengidentifikasi kode yang ambigu.
- Menilai risiko analisis yang memakai kode billing (ICD) sebagai proksi diagnosis klinis.

## Ringkasan
- ICD: klasifikasi diagnosis untuk billing/statistik (~14rb kategori).
- SNOMED CT: ontologi klinis 350rb+ konsep untuk dokumentasi presisi.
- LOINC: standar nama tes lab/pengukuran. RxNorm: standar nama obat.
- FHIR/SATUSEHAT: standar pertukaran (sintaks); OMOP CDM: standar model data untuk riset multi-situs.
- Interoperabilitas = sintaks standar + makna standar. Satu saja tidak cukup.
- Kode billing (ICD) dioptimasi untuk pembayaran — validasi silang sebelum jadi label klinis.
- Perubahan administratif (pelatihan coding, ganti tarif) meniru wabah/tren di data klaim.
- Alokasikan 30–50% waktu proyek multi-RS untuk harmonisasi — itu normal.

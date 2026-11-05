# HD8: MICE & MNAR: Ketika Data Klinis Berlubang

## Tujuan
- Mengklasifikasikan pola missing ke MCAR/MAR/MNAR dari skenario nyata.
- Menjelaskan mengapa imputasi mean tunggal merusak variansi dan mengapa MICE lebih baik.
- Menjalankan logika multiple imputation + Rubin's rules secara konseptual.
- Merancang analisis sensitivitas MNAR sederhana untuk temuan kunci.

## Ringkasan
- MCAR: acak (hapus OK). MAR: terlacak via variabel teramati (MICE). MNAR: terkait nilai hilang (sensitivitas).
- Jangan imputasi mean tunggal; jangan complete-case diam-diam.
- MICE: m dataset → analisis → gabung via Rubin's rules (W + B).
- Sertakan outcome dalam model imputasi; m ≈ % missing.
- Buat indikator missing — kadang hilangnya sendiri adalah sinyal.
- MNAR butuh tipping-point sensitivity, bukan MICE lebih banyak.
- Laporkan: % missing, asumsi mekanisme + alasan, metode, sensitivitas.
- Prasyarat untuk HD11 (EHR kotor) dan HD12 (model dengan missing).

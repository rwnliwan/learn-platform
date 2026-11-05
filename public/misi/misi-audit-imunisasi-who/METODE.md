# Metode Snapshot — Misi Audit Imunisasi WHO

Sumber: WHO Global Health Observatory OData API, diunduh 2026-10-15:
- WHS4_100 — DTP3 immunization coverage among 1-year-olds (%), WUENIC
- MCV2 — Measles-containing-vaccine second-dose coverage by the locally recommended age (%), WUENIC
- MDG_0000000007 — Under-five mortality rate per 1000 live births, UN IGME (Dim1=SEX_BTSX; Dim3=WEALTHQUINTILE_TOTL/WQ1/WQ5)
Endpoint: https://ghoapi.azureedge.net/api/{kode} — diakses 2026-10-15.

Lisensi/ketentuan: teks halaman terms WHO — "WHO grants the royalty-free, worldwide, non-exclusive right to use, reproduce, extract, download, copy, distribute, display or include the Datasets for public health purposes" + atribusi wajib. Snapshot kecil ini dipakai untuk pendidikan/audit kesehatan masyarakat (public health purposes). Atribusi: "Data: WHO Global Health Observatory, diakses 2026-10-15".

## Seleksi
- 12 negara: IDN, MYS, THA, PHL, VNM, SGP, IND, BGD, BRA, NGA, KEN, ETH.
- Tahun 2000–2024. Nilai = NumericValue API (1 desimal imunisasi, 2 desimal U5MR).
- Kolom: negara, tahun, indikator, nilai, sumber, catatan (jadwal usia lokal utk MCV2; interval ketidakpastian utk U5MR).
- Hasil: 1400 baris.

## Kejujuran data
- MCV2 "by the locally recommended age": JADWAL BERBEDA antar negara — perbandingan lintas negara mentah TIDAK VALID (jebakan desain misi).
- U5MR adalah ESTIMASI MODEL UN IGME dengan interval ketidakpastian lebar — bukan hitungan sensus.
- DTP3/MCV2 WUENIC = estimasi WHO/UNICEF, BUKAN angka laporan negara (yang sering lebih tinggi).
- `who_imunisasi.csv` = data bersih apa adanya dari API.
- `who_imunisasi_audit.csv` = data yang diaudit pelajar; memuat 3 injeksi terdokumentasi:
  I1 source-swap (IDN 2022 DTP3 91->96, sumber tetap ditulis WUENIC);
  I2 revision-ghost (duplikat baris U5MR IDN 2020 nasional tanpa catatan revisi);
  I3 fabricated-point (IDN 2024 DTP3 diobservasi->97).

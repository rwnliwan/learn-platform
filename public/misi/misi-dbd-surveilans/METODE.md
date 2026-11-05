# Metode Snapshot — Misi DBD: Laporan Surveilans

Sumber: OpenDengue v1.3, Spatial_extract_V1_3.csv (diunduh 2026-10-15 dari
https://github.com/OpenDengue/master-repo/raw/main/data/releases/V1.3/Spatial_extract_V1_3.zip).
Lisensi: **CC BY-SA** (Clarke et al., Scientific Data 2024). Atribusi: "Data: OpenDengue (Clarke et al. 2024), CC BY-SA".

## Seleksi
- Filter: adm_0=INDONESIA, S_res=Admin1, T_res=Month, tahun 2020–2023.
- 51 varian nama adm_1 mentah dipetakan ke 38 provinsi kanonis — Indonesia kini
  38 provinsi (4 provinsi baru di Papua sejak 2022: Papua Selatan, Papua Tengah,
  Papua Pegunungan, Papua Barat Daya; lihat PROV_MAP di skrip build); varian contoh:
  'D.I YOGYA'/'DI YOGYAKARTA'/'DAERAH ISTIMEWA YOGYAKARTA' -> 'DI Yogyakarta';
  'KALIMANTAN SELATA' (typo) -> 'Kalimantan Selatan'.
- Baris ganda per provinsi-bulan (akibat varian nama) dijumlahkan.
- Hasil: 1646 baris (provinsi × bulan), kolom: provinsi, tahun, bulan,
  tanggal_mulai, tanggal_akhir, total_kasus, definisi_kasus.

## Kejujuran data
- OpenDengue v1.3 TIDAK memuat kadens mingguan untuk Indonesia (hanya Month/Year).
  Misi ini memakai laporan BULANAN — dinyatakan eksplisit di briefing.
- `laporan_bulanan.csv` = data bersih ternormalisasi.
- `laporan_bulanan_audit.csv` = data yang diaudit pelajar; memuat 8 injeksi
  terdokumentasi (I1: 3 baris duplikat; I2: 2 baris tanggal tertukar;
  I3: 2 lonjakan ×12+500 mustahil; I4: 2 baris varian nama tak dinormalisasi).
  Kunci injeksi: ['I1-duplikat', 'I1-duplikat', 'I1-duplikat', 'I2-tanggal-tertukar', 'I2-tanggal-tertukar', 'I3-lonjakan-mustahil', 'I3-lonjakan-mustahil', 'I4-varian-nama', 'I4-varian-nama']

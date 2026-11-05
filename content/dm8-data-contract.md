# DM8: Data Contract & SLA — Perjanjian Tertulis Antar Tim Data

## Masalah: Kolom yang Hilang di Hari Gajian
Tim HR rename gaji_pokok → basic_salary tanpa pemberitahuan → payroll gagal → 3.000 karyawan terima gaji telat 4 hari. Tak ada perjanjian tertulis tentang siapa boleh ubah apa.

## 1. Data Contract
Akta nikah produsen & konsumen: skema berversi + semantik + SLO + kebijakan perubahan + pemilik. Ditulis sebelum insiden, mulai dari 1 tabel kritis.

## 2. SLA / SLO / SLI
- **SLI**: ukuran mentah (fakta). **SLO**: target internal ("95% hari ≤ 2 jam"). **SLA**: janji kontraktual + konsekuensi.
- Skor SLO = periode lolos / total × 100%. SLO 100% = tidak jujur atau boros.

## 3. Error Budget
100% − SLO = jatah gagal sehat. Banyak → boleh rilis; habis → freeze. Rem objektif, bukan debat.

## 4. Breaking vs Non-breaking
Hapus/rename/ubah tipe/makna = breaking → versi baru + masa transisi + umumkan via lineage. Tambah kolom nullable = non-breaking. Rename = breaking, selalu.

## Kesimpulan
1. Tulis kontrak sebelum insiden.
2. SLO = angka, bukan kata sifat. Budget habis = freeze.
3. Tiga serangkai: kontrak + lineage + pintu otomatis.

**Next:** DM9 — Data Governance

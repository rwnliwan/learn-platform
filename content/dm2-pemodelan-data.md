# DM2: Pemodelan Data — Dari Coretan ER ke Star Schema

## Masalah: Kolom "alamat2_final_FINAL"
Tabel warisan punya 5 kolom alamat, tak ada yang tahu mana benar. Akar: tidak ada model sejak awal. Pemodelan = menggambar peta sebelum membangun.

## 1. ER Model
Entity, atribut, relasi. Kardinalitas: 1-N (umum), N-M (butuh tabel jembatan), 1-1 (jarang). Alur: konseptual → logis → fisik.

## 2. Normalisasi (untuk OLTP)
- **1NF**: sel atomik. **2NF**: tak ada dependensi parsial. **3NF**: tak ada dependensi transitif.
- Membunuh 3 anomali: **update** (inkonsisten), **sisip** (tak bisa catat), **hapus** (info hilang).

## 3. Dimensional Modeling / Kimball (untuk OLAP)
- **Tabel fakta**: kejadian yang diukur (angka + FK). Grain = "satu baris = satu ___".
- **Tabel dimensi**: konteks (siapa/di mana/kapan).
- **Star schema**: 1 fakta + dimensi denormalisasi → query ~14× lebih cepat (2 join vs 5+).

## 4. SCD (Slowly Changing Dimensions)
- **Type 1**: timpa (koreksi typo). **Type 2**: baris baru + tanggal berlaku (histori analitik, time travel). **Type 3**: kolom berdampingan.
- Overwrite menghancurkan laporan historis — pilih Type 2 untuk atribut analisis.

## 5. Data Vault (sekilas)
Hub (identitas) + Link (relasi) + Satellite (atribut+histori). Untuk warehouse raksasa yang skemanya labil — bukan untuk tim kecil.

## Kesimpulan
1. Menulis → normalisasi (3NF). Membaca → star schema.
2. Tetapkan grain dulu, satu kalimat.
3. Atribut berubah + dipakai analisis → SCD Type 2.

**Next:** DM3A — Database Relasional & ACID

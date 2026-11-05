# DM10: Metadata & Lineage — Peta Harta Karun Dataran Data

## Masalah: 45 Menit untuk Satu Tabel
Analis baru butuh 45 menit menemukan tabel yang benar di antara penjualan, penjualan_v2, penjualan_final, penjualan_final_beneran — lalu pakai tabel percobaan intern 2023. 2.000 tabel, nol katalog.

## 1. Tiga Jenis Metadata
**Teknis** (skema, tipe — otomatis), **bisnis** (definisi, owner — ditulis manusia, paling berharga & paling bolong), **operasional** (jadwal, freshness).

## 2. Katalog
Google untuk data: searchable, ber-owner (nama orang!), berlabel kualitas (mentah/terkurasi/gold). 45 → 8 menit per pencarian. Tool hanya rak — isi harus ditulis manusia. Mulai dari 50 tabel kritis.

## 3. Glossary Bisnis
Satu istilah, satu definisi berangka ("≥1 transaksi dalam 30 hari"), satu owner, berversi. Definisi yang bisa di-test mesin; sisanya puisi.

## 4. Lineage
Silsilah dua arah: downstream (dampak → siapa di-alert) & upstream (akar → di mana bug). Hasilkan otomatis dari kode (dbt ref()), bukan gambar manual yang basi seminggu. Kolom-level untuk audit.

## Kesimpulan
1. Tiap tabel: deskripsi 1 kalimat + owner + label kualitas.
2. Definisi = angka. Lineage = otomatis.

**Next:** DM11 — Master Data & Golden Record

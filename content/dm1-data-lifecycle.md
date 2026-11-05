# DM1: Siklus Hidup Data — Dari Log Mentah ke Keputusan Direksi

## Masalah: 181 Zettabyte, 0 Keputusan
Dunia menghasilkan 181 ZB/tahun (2025). Bank menyimpan semuanya tapi butuh 3 minggu menjawab "berapa nasabah aktif?" — karena tidak ada yang tahu tabel mana benar dan definisinya beda-beda. Masalahnya bukan kurang data, tapi data tak terkelola.

## 1. Siklus Hidup Data (5 Tahap)
**Generate → Store → Process → Analyze → Archive/Delete.** Tiap tahap punya keputusan biaya & tanggung jawab. Biaya terbesar: Store (35%) + Process (25%) — keputusan arsitektur menentukan 60% tagihan.

## 2. DIKW
**Data** (fakta mentah) → **Information** (data + konteks) → **Knowledge** (informasi + pola) → **Wisdom** (pengetahuan + judgment). Nilai naik, usaha manusia ikut naik. Knowledge → Wisdom tidak bisa diotomasi penuh.

## 3. Tiga Jenis Data
- **Terstruktur** (10%): tabel, SQL — si kutu buku.
- **Semi-terstruktur** (20%): JSON, log — si seniman.
- **Tidak terstruktur** (70%): teks, gambar, video — si liar, butuh ML.

## 4. OLTP vs OLAP
- **OLTP**: si kasir — transaksi kecil real-time, konsisten (core banking).
- **OLAP**: si analis — agregasi historis masif (warehouse).
- **Jangan campur**: query OLAP mengunci tabel OLTP → transaksi gagal.

## 5. Peran
**Owner** (akuntabilitas, disalahkan) vs **Steward** (operasional harian). Setiap dataset butuh keduanya tertulis.

## Kesimpulan
1. Data tak terkelola = liabilitas, bukan aset.
2. Simpan mentah kecuali regulasi melarang; tetapkan retensi.
3. OLTP vs OLAP dipisah; pilih penyimpanan sesuai sifat data.

**Next:** DM2 — Pemodelan Data (ER, normalisasi, star schema, SCD)

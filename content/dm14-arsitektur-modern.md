# DM14: Arsitektur Modern — Mesh, Produk Data & Toko Fitur

## Masalah: Antrean 12 Minggu ke Tim Data
1 tim pusat melayani 40 tim → bottleneck → pipeline bayangan di mana-mana. Solusi: data mesh — desentralisasi pembangun, sentralisasi standar.

## 1. Data Mesh (4 Prinsip)
**Domain ownership** + **data as a product** + **self-serve platform** + **federated governance**. Seperti federalisme. Tepat untuk skala organisasi besar; berlebihan untuk tim kecil. Mesh tanpa standar = anarki.

## 2. Data Product
Dataset sebagai produk: discoverable, addressable, trustworthy (SLO), self-serve, interoperable. Tabel tanpa komitmen = liabilitas.

## 3. Metrics Layer
Satu definisi metrik tereksekusi untuk semua dashboard — akhir sengketa "pendapatan beda-beda". Glossary yang dijalankan mesin.

## 4. Feature Store
Satu definisi fitur untuk training (offline) & serving (online) — membunuh training-serving skew, pembunuh model #1.

## Kesimpulan
1. Mesh = obat skala organisasi; rasakan sakitnya dulu.
2. Metrics layer sebelum debat definisi berikutnya.

**Next:** DM15 — Cloud & DataOps

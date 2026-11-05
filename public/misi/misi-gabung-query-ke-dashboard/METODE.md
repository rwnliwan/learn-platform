# METODE — misi-gabung-query-ke-dashboard

## Status data
100% SINTETIS. Tidak ada data perusahaan nyata. Dibangkitkan oleh skrip
`build-misi/misi-gabung-query-ke-dashboard/gen.py` (disalin ke /tmp/cap2_gen.py
saat build) dengan seed tetap **42** — deterministik: dijalankan ulang
menghasilkan file yang identik baris-per-baris.

## Skenario
Perusahaan fiktif "NusaCloud" (SaaS). Tiga tim mewarisi tiga query SQL yang
masing-masing mengklaim menghitung "MRR Juni 2026" — hasilnya bertentangan.
Tugas analis: rekonsiliasi, temukan penyebab selisih, bangun query kanonis.

## Tabel
- `pelanggan.csv` — 36 pelanggan fiktif (customer_id, nama, segmen, mulai).
- `langganan.csv` — 49 langganan (sub_id, customer_id, plan, mrr,
  mulai, berakhir kosong = masih aktif, status: aktif/berakhir/trial).
- `pembayaran.csv` — 152 pembayaran (pay_id, customer_id, tanggal,
  jumlah, jenis: langganan/setup, status: berhasil/gagal/dikembalikan,
  ref_gateway: referensi gateway pembayaran).

## Jebakan yang dirancang (by design, bukan noise)
1. **Duplikat webhook**: beberapa pembayaran Juni tercatat dua kali dengan
   `ref_gateway` yang sama (webhook gateway terkirim ganda). Query Finance
   menjumlah keduanya.
2. **Biaya setup**: 3 pembayaran `jenis='setup'` di Juni — bukan recurring,
   tapi ikut terjumlah di query Finance.
3. **Trial**: 6 langganan `status='trial'` — ikut terjumlah di query Product.
4. **Batas periode**: 2 langganan berakhir pertengahan Juni — query Product
   memakai batas `berakhir >= '2026-06-01'` sehingga ikut terhitung penuh.
5. **Join fan-out**: query Growth menggabungkan pelanggan × langganan ×
   pembayaran lalu `SUM(mrr)` — setiap langganan terhitung sebanyak jumlah
   pembayaran sukses pelanggan itu di Juni.

## Angka kunci (Juni 2026, diverifikasi dari generator)
- Query Finance (kas): Rp 64,000,000
- Query Product (langganan): Rp 67,800,000
- Query Growth (join fan-out): Rp 102,800,000
- Query kanonis: Rp 49,150,000 (34 langganan aktif berbayar)

## Lisensi
Data sintetis milik misi ini — bebas dipakai untuk pembelajaran di dalam
platform Learn v2. Bukan data nyata; tidak ada atribusi pihak ketiga.

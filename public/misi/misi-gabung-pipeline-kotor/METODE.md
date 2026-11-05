# METODE — Misi Pipeline Kotor: Dari Laptop ke Produksi (misi-gabung-pipeline-kotor)

## Deklarasi SINTETIS
**Seluruh file di folder ini 100% SINTETIS** — dibuat khusus sebagai materi
edukasi Learn v2 (capstone Python × Data Engineer). Tidak ada pelanggan,
perusahaan, transaksi, atau angka keuangan nyata. "PT Kopi Nusantara",
nama produk, kota, dan ID transaksi adalah fiktif belaka dan tidak merujuk
ke entitas nyata mana pun.

## Generator
- Skrip: `gen_transaksi.py` (di folder ini). Seed tetap: `random.Random(42)` →
  output deterministik byte-per-byte. Jalankan ulang: `python3 gen_transaksi.py`.
- September: 1500 transaksi dasar (`TRX-202609-0001` s.d. `TRX-202609-1500`),
  tanggal acak 2026-09-01 s.d. 2026-09-30, lalu **60 baris duplikat persis**
  ditambahkan di akhir → total **1560 baris**.
- Oktober: 1400 transaksi dasar (`TRX-202610-0001` s.d. `TRX-202610-1400`),
  tanggal acak 2026-10-01 s.d. 2026-10-31, lalu **40 duplikat** → total
  **1440 baris**. Skema file Oktober SENGAJA diubah total (simulasi vendor
  yang mengganti format export tanpa pemberitahuan).

## Skema kolom (`transaksi_2026-09.csv`)
| Kolom | Arti | Kekotoran disengaja |
|---|---|---|
| order_id | ID transaksi | 60 ID muncul 2× (duplikat baris persis) |
| tanggal | tanggal transaksi | format campur: `YYYY-MM-DD` (70%), `DD/MM/YYYY` (15%), `D Sep YYYY` (10%), kosong (5%) |
| customer_id | ID pelanggan | 2% kosong |
| produk | nama produk | 8% baris "Es Céndol" tertulis mojibake `Es CÃ©ndol` (byte UTF-8 dibaca sebagai latin-1) |
| qty | jumlah item | 3% kosong; 2% ada spasi di kiri-kanan (`" 3 "`) |
| harga | harga satuan (IDR) | format campur: `15000`, `Rp 25.000`, `" 15000 "` (spasi), kosong (5%) |
| kota | kota gerai | 5% kosong |

## Skema kolom (`transaksi_2026-10.csv`) — SKEMA BERUBAH
| Kolom | Padanan kanonik | Catatan |
|---|---|---|
| id_pesanan | order_id | nama diganti |
| tgl | tanggal | format campur: `YYYY/MM/DD` (60%), `DD-MM-YYYY` (25%), `D Okt/Oct YYYY` (10%, locale campur), kosong (5%) |
| cust_id | customer_id | nama diganti |
| nama_produk | produk | nama diganti; mojibake yang sama (8% "Es Céndol") |
| jumlah | qty | nama diganti; 3% kosong |
| price | harga | format campur: angka, `IDR 25.000`, spasi, kosong (5%) |
| channel | — | **kolom BARU**: Online/Toko/Aplikasi — harus diabaikan dengan anggun, bukan crash |

Skema kanonik (kontrak ke downstream): `order_id, tanggal, customer_id, produk, qty, harga`.

## Aturan pembersihan kanonik (kunci jawaban lab)
1. `tanggal`: parse multi-format (`dayfirst=True`); baris tanpa tanggal
   dibuang (tidak bisa diatribusikan ke periode) — 91 baris.
2. Duplikat baris penuh dibuang (simpan kemunculan pertama) — 60 baris.
3. `produk`: `Es CÃ©ndol` → `Es Céndol`.
4. `qty` kosong → 1; `harga` kosong → median harga produk tersebut;
   `kota` kosong → `TIDAK_DIKETAHUI`.
5. `pendapatan = qty × harga`.
6. Hasil September bersih: **1418 baris**, 8 produk unik,
   **total pendapatan Rp 45.830.000** (2026-09-01 s.d. 2026-09-30).
   Tanpa dedup totalnya Rp 47.442.000 (selisih Rp 1.612.000 — dipakai di dossier audit).
7. Hasil Oktober bersih: **1320 baris**, **total Rp 43.347.000**.

## Lisensi
Data sintetis orisinal untuk misi ini — bebas dipakai untuk pembelajaran
dan modifikasi. Ukuran total folder: ±200 KB (<5 MB).

## Batas jujur
Kekotoran dan perubahan skema dirancang untuk latihan — pola tanggal campur,
mojibake, dan rename kolom meniru kasus nyata export POS/ERP, tetapi
distribusinya disederhanakan. Total pendapatan BUKAN angka bisnis nyata.

# METODE — Misi Kontrak: Skema Berubah di Tengah Jalan (misi-kontrak-skema-retak)

- **Status data: 100% SINTETIS.** Seluruh file di folder ini dibuat oleh generator Python (`seed=42`) khusus untuk misi ini. BUKAN data perusahaan nyata, BUKAN skema produksi siapa pun. Setiap kolom, tipe, dan angka adalah fiksi yang dirancang untuk latihan.
- **Generator:** Python 3, modul `random` dengan `random.seed(42)`. Skema ditulis langsung sebagai JSON (bukan sampling). Baris event dibuat dari daftar amount tetap yang ditulis eksplisit di generator (bukan acak): v1 = 6 amount integer polos; v2 = 4 amount polos + 4 amount format Indonesia ("150.000"); v3 = 6 amount gross (pre-tax × 1,11, dibulatkan) + kolom `status`/`channel`.
- **Metode sampling:** tidak ada sampling dari populasi nyata — populasi dibuat dari nol.
- **Perubahan skema yang disengaja (bagian dari desain misi):**
  - v1 → v2: kolom baru `promo_code` (opsional — kompatibel); tipe `amount` berubah diam-diam `int` → `string` (format "12.500"); di `events_v2.csv` 4 baris pertama masih polos, 4 baris terakhir sudah berformat — tipe berubah **di tengah file**.
  - v2 → v3: kolom baru `status` (payment status) dan `channel`; **makna** `amount` berubah diam-diam dari PRE-TAX menjadi GROSS (termasuk pajak 11%) tanpa pemberitahuan — lolos dari compatibility checker berbasis tipe.
  - Jebakan penamaan: `orders.status` (payment status) vs `shipments.status` di sistem lain (shipment status) — nama sama, makna beda.
- **Skema kolom:**
  - `skema_v*.json`: `version`, `fields[]` dengan `name`, `type`, `required`, `desc`, plus `unit`/`includes_tax` untuk `amount`.
  - `events_v*.csv`: `order_id`, `customer_id`, `amount`, `currency`, `created_at` (+ `promo_code` di v2/v3, + `status`, `channel` di v3).
- **Nilai referensi (dipakai checks lab):** compatibility v1→v2 = BREAKING (1 isu: `amount` TYPE_CHANGE); v2→v3 = OK menurut checker (jebakan — makna berubah); kontrak: v2 melanggar 1 aturan, v3 melanggar 2 aturan; total SQL benar = 413750 (query lama `SUM(amount)` diam-diam menghasilkan 413,75).
- **Ukuran:** total ±3,5 KB. Jauh di bawah 5 MB.
- **Tanggal pembuatan:** 2026-10-15.
- **Catatan jujur:** skenario "producer mengubah skema tanpa pemberitahuan" adalah pola nyata di industri (disebut schema drift); semua nama tabel/konsumen di misi ini fiktif.

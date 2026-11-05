# METODE — Misi Pipeline: CSV yang Menolak Dibersihkan (misi-pipeline-kotor-python)

## Deklarasi SINTETIS
**Seluruh file di folder ini 100% SINTETIS** — dibuat khusus sebagai materi
edukasi Learn v2. Tidak ada pelanggan, perusahaan, invoice, atau angka
keuangan nyata. Nama perusahaan ("PT Maju Bersama", "CV Sinar Karya", …)
dibangkitkan acak dari daftar kata dan tidak merujuk ke entitas nyata mana pun.

## Generator
- Skrip: `gen_tagihan.py` (di folder ini). Seed tetap: `random.Random(42)` →
  output deterministik byte-per-byte. Jalankan ulang: `python3 gen_tagihan.py`.
- 240 invoice dasar (`INV-2026-0001` s.d. `INV-2026-0004`…`INV-2026-0240`),
  tanggal acak 2026-01-01 s.d. 2026-03-31, lalu **8 baris duplikat persis**
  ditambahkan di akhir → total 248 baris.

## Skema kolom (`tagihan_mentah.csv`)
| Kolom | Arti | Catatan kekotoran (disengaja) |
|---|---|---|
| invoice_id | ID invoice | 8 ID muncul 2× (duplikat persis) |
| tanggal | tanggal transaksi | format campur: `YYYY-MM-DD` (60%), `DD/MM/YYYY` (15%), `DD-MM-YYYY` (10%), `D Mon YYYY` Indonesia (10%), kosong (5%) |
| pelanggan | nama pelanggan | sintetis |
| paket | Basic/Pro/Enterprise | harga dasar 150rb / 450rb / 1,5jt |
| qty | jumlah | kadang ada spasi di kiri-kanan |
| harga_satuan | harga per unit | format campur: `150000`, `Rp 150.000`, `150,000`, ` 150000 ` |
| diskon_pct | diskon persen | `10`, `10%`, atau kosong (= 0; hanya untuk diskon 0) |
| subtotal | qty × harga × (1−diskon) | 10% ditulis format Indonesia `1.250.000` |
| pajak | PPN | 8% baris kosong (sistem "belum menghitung") |
| total | **SENGAJA SALAH** | = subtotal (pajak tidak ditambahkan) — impostor misi |
| total_rp | grand total benar | string `Rp 1.100.000` = subtotal + pajak |

- PPN disederhanakan **10%** (bukan 11%) agar angka harapan bulat untuk misi.
- Aturan parse yang dipakai solusi lab: `""` = 0 untuk diskon; `""` tanggal =
  baris tidak bisa dimasukkan ke KPI bulanan; pajak selalu dihitung ulang
  10% dari subtotal (kolom pajak tidak dipercaya).

## Artefak fiksi skenario (`kpi_dashboard.csv`)
File ini adalah **properti skenario** (bukan data nyata): angka "dashboard
finance" yang salah, dibuat generator dengan metode naive yang didokumentasikan:
hanya baris bertanggal format ISO yang terbaca (format lain **dibuang diam-diam**),
tanpa dedup, memakai kolom `total` yang salah, dan nilai `1.250.000` gagal
diparse menjadi 0. Hasil: total_pendapatan 71.080.575 (2026-03) — jauh di bawah
angka benar 115.252.500.

## Angka kunci (verifikasi)
- Baris CSV: 248 (240 unik + 8 duplikat) · tanggal kosong: 14 · harga format Rp: 68
- Setelah dedup: 240 baris · tanggal tak valid: 13
- KPI benar Maret 2026: **115.252.500** (89 invoice) · selisih dashboard: **−44.171.925**

## Batas jujur
- Ini simulasi file ekspor billing, bukan data perusahaan nyata.
- PPN 10% adalah penyederhanaan pedagogis.
- Ukuran: tagihan_mentah.csv ±40 KB, kpi_dashboard.csv < 1 KB (jauh di bawah 5 MB).

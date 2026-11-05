# METODE — Misi Pipeline: Kegagalan yang Diam (misi-kegagalan-diam-pipeline)

## Deklarasi SINTETIS
**Seluruh file di folder ini 100% SINTETIS** — dibuat khusus sebagai materi
edukasi Learn v2. Tidak ada pelanggan, transaksi, atau perusahaan nyata.
Nama pelanggan dibangkitkan acak dan tidak merujuk ke orang nyata mana pun.

## Generator
- Skrip: `gen_pipeline.py` (di folder ini). Seed tetap: `random.Random(42)` →
  output deterministik. Jalankan ulang: `python3 gen_pipeline.py`.

## Skema
- `master_pelanggan.csv`: 80 pelanggan (`pelanggan_id` C001–C080, nama, segmen,
  tanggal_daftar).
- `transaksi_harian.csv`: 600 transaksi 2026-03-01 s.d. 2026-03-10
  (`txn_id`, `waktu`, `pelanggan_id`, `nominal`, `kanal`).
- `log_pipeline.txt`: **ARTEFAK FIKSI SKENARIO** — log pipeline yang mengklaim
  "RUN OK" padahal berbohong (bagian dari jebakan misi, bukan kebenaran).

## Tiga format `waktu` (disengaja)
| Format | Contoh | Arti |
|---|---|---|
| naive | `2026-03-05 14:23:11` | waktu lokal WITA (Asia/Makassar = UTC+8) |
| offset | `2026-03-05T14:23:11+08:00` | eksplisit WITA |
| UTC | `2026-03-04T19:30:00Z` | 16:00–23:59 UTC di hari sebelumnya = 00:00–07:59 WITA |

Pipeline lama mengambil 10 karakter pertama sebagai tanggal → 58 baris UTC
salah hari (+1 hari WITA).

## Jebakan yang ditanam (untuk lab)
1. **Join salah:** 12 transaksi ber-`pelanggan_id` `CX-9xx` (tidak ada di master)
   → `INNER JOIN` membuangnya diam-diam. Nominal hilang: **7.625.000**.
2. **Dedup salah:** key `(pelanggan_id, nominal, tanggal)` — asumsi "satu
   pelanggan satu nominal per hari = duplikat" — menghapus **23 transaksi sah**
   (termasuk 7 pasangan yang memang transaksi berulang).
3. **Timezone shift:** 58 baris UTC bergeser +1 hari → total harian 2026-03-05:
   naive **56.200.000** vs benar **48.500.000** (selisih −7.700.000).

## Angka kunci (verifikasi)
- Input 600 → join: 588 (drop 12) → dedup: 565 (drop 23). Log mengklaim
  `dropped=0` — kebohongan yang harus ditemukan.
- n_utc = 58, n_pindah_tanggal = 58.

## Batas jujur
- Ini simulasi pipeline batch, bukan sistem produksi nyata.
- WITA = UTC+8 (Asia/Makassar) — dipakai konsisten di generator dan solusi.
- Ukuran total folder < 100 KB (jauh di bawah 5 MB).

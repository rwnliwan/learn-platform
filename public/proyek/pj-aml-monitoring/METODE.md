# METODE — Proyek AML Transaction Monitoring

Data 100% SINTETIS untuk proyek ini (generator: gen di `/tmp/aml_wip/gen_aml.py`,
`numpy.random.default_rng(42)` — deterministik). Bukan data nasabah nyata;
perusahaan, nama, dan angka semuanya fiktif. Lisensi: data sintetis orisinal
untuk misi ini.

## File
- `transaksi.csv` — 5.997 transaksi, kolom:
  `tx_id, tanggal (YYYY-MM-DD), pengirim, penerima, jumlah (Rp, integer),
  channel (transfer/QRIS/e-wallet), label`
- `akun.csv` — 305 akun, kolom:
  `akun_id, tipe (perorangan/bisnis), tgl_buka, is_dorman, saldo_awal`

Periode: 2026-07-01 s.d. 2026-09-28 (90 hari).

## Ground truth (`label` di transaksi.csv)
`label` = hasil investigasi manual tim AML (bukan fitur prediktif — dipakai
hanya untuk evaluasi, seperti "kasus yang sudah diputus"):

| label | arti | jumlah |
|---|---|---|
| 0 | normal | 5.903 |
| 1 | structuring (fragmentasi di bawah ambang) | 9 |
| 2 | layering (fan-in → fan-out via mule) | 10 |
| 3 | anomali akun dorman | 75 |

Total mencurigakan: 94.

## Pola yang ditanam (terukur, untuk acuan checks)
1. **Structuring A** — `SRC01` → 5 penerima berbeda, Rp 95–99 jt per transfer
   (tepat di bawah ambang lapor Rp 100 jt), hari ke-21 s.d. 26
   (satu bucket 7-hari = bucket 3). 5 transaksi, label 1.
2. **Structuring B** — `SRC02` → 4 penerima berbeda, Rp 95–99 jt,
   hari ke-56 s.d. 60 (bucket 8). 4 transaksi, label 1.
3. **Layering** — `FAN01`–`FAN06` → `MULE01` (hari 40–41, Rp 12–28 jt),
   lalu `MULE01` → `END01`–`END04` (hari 42, Rp 40–70 jt).
   Fan-in 6 pengirim berbeda, fan-out 4 penerima berbeda, semua dana masuk
   SEBELUM semua dana keluar (strict flow-through). 10 transaksi, label 2.
4. **Dorman burst** — `DOR01`–`DOR03` (akun dorman: tanpa transaksi hari 1–70),
   masing-masing 25 transaksi pada hari 71–90. 75 transaksi, label 3.
   `QZD01`–`QZD09` dorman tapi tetap sepi (negatif yang benar).

## Umpan palsu (false positive yang disengaja)
- Satu transaksi normal Rp 120 jt (`A0042` → `A0100`, hari 15) — tertangkap
  aturan ambang tunggal padahal legit.
- `A0123` melakukan dua transfer Rp 92 jt & Rp 93,5 jt dalam satu minggu
  (hari 30 & 33) — legit, tetapi tertangkap detector longgar (ambang ≥ 2).

## Angka acuan (dari harness, seed 42)
- Lab 1: n_baris 5997 · n_akun 305 · n_dorman 12 · pct_transfer 0,5898 ·
  median_jumlah 515000 · n_ambang100 = 1
- Lab 2: pengirim ter-flag ketat (≥3) = 2 (SRC01, SRC02) · tx structuring = 9 ·
  pengirim ter-flag longgar (≥2) = 3 (+A0123)
- Lab 3: kandidat strict flow-through = 10 · risk MULE01 = 0,50 ·
  final (risk ≥ 0,45) = 1 (MULE01)
- Lab 4: alert ketat = 20 (TP 19, FP 1) · precision 0,95 · recall 0,2021 ·
  alert longgar = 22 · precision 0,8636 · dorman ter-flag = 3 (75 tx) ·
  alert final = 95 (TP 94, FP 1) · precision 0,9895 · recall 1,0

## Kejujuran batas
- `label` adalah "kebenaran" yang di dunia nyata TIDAK tersedia saat monitoring
  berjalan — ia ada di sini sebagai pengganti hasil investigasi, agar
  precision/recall bisa dihitung. Angka sempurna di lab ≠ angka produksi.
- Pola disederhanakan untuk latihan (3 pola, jendela waktu rapi); pencucian
  nyata memakai campuran pola, jumlah lebih besar, dan adaptasi terhadap aturan.

# METODE — Dataset misi-kartu-hantu (Fraud/AML Misi A)

## Pernyataan kejujuran data (baca dulu)

**Data SINTETIS.** Seluruh 20.000 transaksi dibangkitkan oleh generator
berparameter `misi-data/build_misi-kartu-hantu.py` (seed 42) yang meniru
**skema** dataset riset fraud kartu kredit publik (pola Sparkov: velocity,
mismatch kategori, anomali amount) — **TANPA data nasabah asli dan TANPA
kolom PII.** Nomor kartu berupa token sintetis (`card_0001` … `card_2000`),
merchant FIKTIF (nama generik, bukan merek dagang asli), kota hanya label
geografis kasar. Pola fraud-nya realistis, tetapi **angka absolutnya BUKAN
kejadian nyata**. Jangan pernah menyebut dataset ini "data nyata".

## Parameter generator (seed 42)

- 2.000 kartu token, jendela 60 hari (2026-08-17 s.d. 2026-10-15).
- Profil kartu: median belanja lognormal(mu=12,5, sigma=0,5–1,0) per kartu
  (median ≈ Rp 268 rb); 3–5 kategori "kebiasaan" per kartu.
- Transaksi legit: 80% merchant dari kategori kebiasaan kartu, 20% acak;
  channel 60% chip / 40% online; kota 85% kota asal kartu.
- Pola fraud (30 kartu, masing-masing 1 burst):
  - (a) **velocity**: burst 5–8 transaksi dalam <10 menit (rentang seragam 0–8 menit);
  - (b) **mismatch**: 40% burst ditaruh jam 02:00–05:00 dengan 1–2 transaksi luxury;
  - (c) **amount anomaly**: 5% transaksi fraud ber-amount > 4× median kartu tsb;
  - (d) **channel online + merchant baru** (di luar kategori kebiasaan kartu).
- Total: 20.000 baris; fraud rate TERUKUR lihat ringkasan build di bawah
  (target desain ≈ 0,8–1,0%).

## File

- `transaksi.csv` — 20.000 baris bersih. Kolom: `trans_id` (TX-000001 …),
  `trans_time` (YYYY-MM-DD HH:MM:SS), `card_id` (token), `merchant`,
  `category` (groceries/dining/travel/electronics/luxury/fashion/fuel/health),
  `amount` (IDR), `channel` (chip/online), `city`, `is_fraud` (0/1).
- `transaksi_audit.csv` — salinan transaksi.csv + 17 baris injeksi
  TERDOKUMENTASI di bawah (total 20.017 baris). Dipakai untuk misi audit.

## Injeksi terdokumentasi (hanya di transaksi_audit.csv)

| Kode | trans_id terdampak | Deskripsi |
|------|-------------------|-----------|
| I1-velocity-1 | `TX-020001`, `TX-020002`, `TX-020003`, `TX-020004`, `TX-020005`, `TX-020006` | burst 6 transaksi dalam 8 menit, kartu card_0986, is_fraud=1 |
| I1-velocity-2 | `TX-020007`, `TX-020008`, `TX-020009`, `TX-020010`, `TX-020011`, `TX-020012` | burst 6 transaksi dalam 8 menit, kartu card_1858, is_fraud=1 |
| I2-luxury-dini-hari | `TX-020013`, `TX-020014` | transaksi luxury jam 03:12 dan 03:47 (category mismatch), is_fraud=1 |
| I3-amount-anomaly | `TX-020015`, `TX-020016` | amount = 40x median PROFIL kartu (parameter generator; rasio vs median realisasi sampel bisa berbeda), is_fraud=1 |
| I4-duplikat-trans-id | `TX-005839` | salinan persis baris TX-005839 (trans_id ganda = double-charge/replay) |

Catatan: injeksi I1–I3 memakai pola fraud yang sama dengan generator
(is_fraud=1) sehingga konsisten secara label; I4 adalah masalah integritas
data (trans_id ganda), bukan pola fraud.
Catatan I3: "40x median" = 40x median PROFIL kartu (parameter generator,
mis. card_1180: profil Rp 277.000 -> Rp 11.080.000). Median REALISASI dari
sampel transaksi legit kartu tsb bisa berbeda (card_1180: Rp 427.500,
rasio realisasi ~26x) — perbedaan ini wajar dan didokumentasikan apa adanya.

## Ukuran

- transaksi.csv: 20.000 baris
- transaksi_audit.csv: 20.017 baris (20.000 + 17 injeksi)
- Total folder < 5 MB.

## Lisensi / atribusi

Dataset SINTETIS 100% — tidak ada sumber pihak ketiga, tidak ada lisensi
eksternal yang perlu dikutip. Generator: `misi-data/build_misi-kartu-hantu.py`.

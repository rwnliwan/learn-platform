# Metode Snapshot — Misi B Fraud/AML: Jaring Mule

Sumber primer: BitcoinHeist Ransomware Address Dataset (UCI ML Repository),
diunduh 2026-10-15 dari https://archive.ics.uci.edu/static/public/526/bitcoinheistransomwareaddressdataset.zip
(2.916.697 alamat). Lisensi: **CC BY 4.0** (badge terverifikasi di halaman
dataset pada 2026-10-15; atribusi: "UCI ML Repository").

Orakel: daftar alamat digital currency yang disanksi OFAC (tool 0xB10C, MIT;
data OFAC = karya pemerintah federal AS, public domain 17 U.S.C. §105),
pin BARU 2026-10-15 13:34 WITA, cabang `lists` commit 6ae2472c439b:
532 alamat XBT + 120 alamat ETH. (Pin pilot misi-jejak-dana-blockchain:
2026-10-15 tanpa commit tercatat; pin ini didokumentasikan dengan commit hash.)

## Seleksi (BERBEDA dari pilot)
Pilot memakai semua baris ransomware + baris cocok-OFAC + white acak (fokus
ATRIBUSI). Misi ini memakai slice TIPOLOGI LAYERING (fokus POLA TRANSAKSI),
seed 42, nilai fitur asli TIDAK diubah:
- (a) 1000 alamat `looped` tertinggi (pola split -> jalur berbeda -> merge)
- (b) 1000 alamat `neighbors` tertinggi di luar (a) (fan-out / fan-in ekstrem)
- (c) 1000 alamat acak dari pool income < P25 & count > P75 populasi
      (smurfing proxy), di luar (a)+(b); pool = 193483 alamat unik
Threshold populasi: looped P95=1884, neighbors P95=3, income P25=74.285.590
satoshi, count P75=56. Total 3000 alamat unik. Kolom `klaster` menandai asal
grup; `is_sanctioned` = join persis vs daftar OFAC XBT (0 cocok di slice;
alamat dataset adalah BTC sehingga hanya XBT yang bisa cocok — daftar ETH
dibundel sebagai referensi lintas-rantai).

## Injeksi dompet_audit.csv (terdokumentasi; JANGAN dibaca sebelum audit)
- I1 label disanitasi (2): 12kVzMMhb7DG... (asli: princetonLocky); 12wTNADReWF6... (asli: princetonCerber)
- I2 income -> 0 padahal count tinggi (2): 1AhehiaSerNj... (income asli 300787173, count 14497); 3QvRa9SqDFuE... (income asli 1852316384, count 14496)
- I3 alamat duplikat, statistik berbeda (2 baris tambahan): 112xVY6eegcN...; 114BK6TkPGNe...
- I4 klaim "mixing_rounds (length) = 0 -> aman" pada neighbors ekstrem (2):
  3Mfiqcgbvs8P... (neighbors=147, length=0); 1Mzd27i56uEX... (neighbors=100, length=0)
  (length memang 0 di data asli — jebakan ada di penalaran satu-fitur,
  bukan di angkanya.)

## Kejujuran
- BitcoinHeist TIDAK memuat edge list / graph transaksi — misi ini analisis
  TIPOLOGI berbasis fitur agregat per alamat, BUKAN literal hop-tracing.
- `white` = "tidak teridentifikasi sebagai ransomware oleh peneliti", BUKAN
  "terbukti bersih". Sebaliknya, pola ekstrem (looped/neighbors tertinggi)
  di populasi hampir seluruhnya berlabel white — bentuk transaksi != kejahatan.
- Fitur looped/neighbors/count/weight/income adalah agregat per alamat per
  hari; tidak ada identitas pemilik di dataset.

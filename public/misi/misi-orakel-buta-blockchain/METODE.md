# Metode Snapshot — Misi Orakel Buta (BitcoinHeist + OFAC)

Sumber primer: BitcoinHeist Ransomware Address Dataset, UCI ML Repository
(https://archive.ics.uci.edu/dataset/526/bitcoinheist+ransomware+address+dataset),
diunduh 2026-10-15. Lisensi: **CC BY 4.0** — "sharing and adaptation for any
purpose, provided that the appropriate credit is given."
Atribusi: "Data: Akcora et al., BitcoinHeist, UCI ML Repository, CC BY 4.0".

Orakel: OFAC sanctioned digital currency addresses (XBT), branch `lists`,
repo 0xB10C/ofac-sanctioned-digital-currency-addresses, di-pin 2026-10-15
(532 alamat; commit tercatat di repo). Data OFAC = karya pemerintah
federal AS (public domain, 17 U.S.C. §105); tool repo MIT.

## Seleksi (seed 42)
- Semua baris berlabel ransomware tahun 2016–2017: 19117 baris
  (era gelombang Locky/Cerber: princetonLocky, princetonCerber dominan).
- SEMUA alamat berlabel `white` yang cocok daftar OFAC (semua tahun): 21 alamat.
- Sampel `white` non-sanksi tahun 2016–2017: 5.000 baris acak (stratified per chunk).
- Kolom: address, year, label, length, weight, count, looped, neighbors, income,
  is_sanctioned (1 bila cocok daftar OFAC XBT per 2026-10-15).
- Total: 22738 baris.

## Kejujuran data
- TEMUAN KUNCI (bukan injeksi): 21 alamat berlabel `white` cocok daftar
  sanksi OFAC; 0 alamat berlabel ransomware yang cocok. Label `white` di dataset
  riset BUKAN penilaian risiko dunia nyata.
- Daftar OFAC adalah snapshot 2026; transaksi dataset 2011–2018 — ketidakcocokan
  temporal ini AMBIGUITAS NYATA (alamat disanksi 2022 bisa jadi "bersih" pada 2016,
  atau label white memang salah sejak awal; data ini tidak bisa memutuskan).
- Signature perilaku (weight,count,neighbors,looped) ber Kardinalitas rendah:
  6 signature dipakai bersama alamat sanksi & ribuan alamat ransomware
  (terbesar: 7.072 baris) — clustering naif = false-positive massal.
- `entitas.csv` = data bersih. `entitas_audit.csv` memuat 4 injeksi terdokumentasi:
  I1 label-tamper (3 princetonLocky -> white); I2 income-x10 (5 sanctioned);
  I3 ghost-dup (4 alamat ganda beda label); I4 oracle-suppress (2 flag sanksi di-nol-kan).

# Metode Snapshot — Misi Investigasi: Jejak Dana Peretasan

Sumber primer: BitcoinHeist Ransomware Address Dataset (UCI ML Repository),
diunduh 2026-10-15 dari https://archive.ics.uci.edu/static/public/526/bitcoinheistransomwareaddressdataset.zip
(2.916.697 alamat). Lisensi: **CC BY 4.0** (atribusi: UCI ML Repository).

Orakel: daftar alamat digital currency yang disanksi OFAC (tool 0xB10C, MIT;
data OFAC = karya pemerintah federal AS, public domain), snapshot 2026-10-15
(cabang `lists`): 532 alamat XBT + 120 alamat ETH.

## Seleksi
- Semua 41413 alamat berlabel ransomware + 67 baris yang cocok
  daftar OFAC (oversampling disengaja & terdokumentasi — agar misi "laporan bersih
  vs daftar sanksi" bisa dikerjakan) + 4933 alamat `white` acak (seed 42).
- Total 46413 baris. Nilai fitur asli tidak diubah.
- Kolom `is_sanctioned` = join persis vs daftar OFAC XBT (67 cocok di sampel).

## Kejujuran
- BitcoinHeist tidak memuat edge list / graph transaksi — misi dibingkai sebagai
  AUDIT LAPORAN (bukan literal hop-tracing), dinyatakan di briefing.
- Label entitas pihak ketiga (kptlamzn) hanya referensi, tidak dibundel.

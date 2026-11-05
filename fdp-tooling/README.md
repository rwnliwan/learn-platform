# FDP Tooling — Financial Data Pipeline

Checker + dataset untuk track "Financial Data Pipeline" (FDP6 capstone).
Dibuat 4 Nov 2026.

## File

| File | Isi |
|---|---|
| `benchmark.csv` | 35 angka terverifikasi builder dari filing asli (KLBF FY2024 auditan, BBRI FY2024 auditan, BBCA H1 2026 interim unaudited). Kolom: emiten, periode, pos, nilai, satuan, sumber_filing, halaman. Rasio berlabel `[T]` = terhitung builder. |
| `reconcile.py` | Checker 5 cek (C1–C5). Lihat `--help`. |
| `dataset_sampel_klbf.csv` | Output pipeline CONTOH yang benar (KLBF, Rp penuh) → LULUS. |
| `dataset_sampel_klbf_juta.csv` | Sama, dalam Rp-juta presisi penuh → LULUS (uji normalisasi satuan). |
| `dataset_jebakan_satuan.csv` | JEBAKAN: angka Rp-juta dideklarasikan "Rp" → GAGAL + pesan KETIDAKCOCOKAN SATUAN. |

## Cara pakai

```bash
python3 reconcile.py --benchmark benchmark.csv --input <output-pipeline-kamu.csv> [--out laporan_rekonsiliasi.md]
```

Format input pipeline: `emiten,periode,pos,nilai,satuan,sumber`
Satuan yang dikenal: `Rp`, `Rp-ribu`, `Rp-juta`, `Rp-miliar`, `persen`.

## 5 cek

- **C1** angka level-1 vs benchmark: EKSAK setelah normalisasi satuan (Decimal, anti float).
- **C2** rasio vs benchmark: ±0,5 pp.
- **C3** konsistensi internal (neraca balance, aritmetika laba).
- **C4** provenance: tiap angka wajib bawa sumber.
- **C5** jebakan satuan: bila C1 gagal dengan rasio kelipatan 1000 yang bersih → pesan "KETIDAKCOCOKAN SATUAN".

Pelajaran dari build: JANGAN pakai float untuk uang (4218874269.523 × 1e6 ≠ integer eksak dalam
float). Checker ini memakai Decimal. Jangan membulatkan angka mentah — C1 menuntut presisi penuh.

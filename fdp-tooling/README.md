# FDP Tooling — Financial Data Pipeline

Checker + dataset untuk track "Financial Data Pipeline" (FDP6 capstone).
Dibuat 4 Nov 2026.

## File

| File | Isi |
|---|---|
| `benchmark.csv` | 41 angka terverifikasi builder dari filing asli (KLBF FY2024 auditan, BBRI FY2024 auditan, BBCA H1 2026 interim unaudited). Kolom: emiten, periode, pos, nilai, satuan, sumber_filing, halaman. Rasio berlabel `[T]` = terhitung builder. |
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

## Sinkronisasi benchmark 2026-11-05 — satu sumber kebenaran

File ini (`benchmark.csv`) dan `public/v2/data/benchmark.csv` (yang tampil di web)
sebelumnya DUA salinan yang menyimpang: file ini 35 angka, file web 41 angka, dengan
pilihan pos dan pembulatan yang berbeda. Sejak 5 Nov 2026, **isi keduanya identik
(41 angka)** — file web adalah sumber kebenaran, file ini adalah port-nya ke format
yang dipakai `reconcile.py`. Bila ada angka baru, ubah file web DULU, lalu port ke sini.

Konvensi port (format `reconcile.py` dipertahankan, bukan sebaliknya):
- `pos` snake_case; rasio ber-prefix `rasio:` (wajib — `reconcile.py` memakai prefix ini
  untuk membedakan C2 ±0,5 pp dari C1 eksak).
- Satuan bank: `Rp-juta` (tanda hubung — yang dikenali `UNIT_FACTOR`), bukan `Rp juta`.
- Periode BBCA: `H1-2026` (tanda hubung), bukan `H1 2026`.
- Rasio ditulis 2 desimal dari hitungan filing: gross margin 39,71 (bukan 39,7),
  net margin 9,93, ROE 14,70 — sama dengan ekspektasi lab FDP5. Nilai level-1 tidak
  dibulatkan.
- Satuan baru di `reconcile.py`: `Rp/saham` (EPS) dan `x` (current ratio) — keduanya
  tanpa konversi.

Baris lama yang DIHAPUS karena tidak ada di file web (12): KLBF `laba_sebelum_pajak`,
`total_aset_lancar`, `total_aset_tidak_lancar`, `persediaan_neto`, `rasio:roa`; BBRI
`rasio:roe`, `rasio:roa`, `rasio:loan_to_asset`; BBCA `total_aset`, `total_ekuitas`,
`rasio:casa_ratio`, `rasio:ldr_naive`. Semuanya angka filing yang valid, tetapi bukan
bagian dari benchmark kanonis 41 angka — dan `rasio:ldr_naive` (80,65, hitungan
kredit/DPK) sengaja diganti rasio LDR resmi bank 88,85. Catatan: cek C3 di
`reconcile.py` membaca INPUT learner (bukan benchmark), jadi aturan konsistensi
(neraca balance KLBF dkk.) tetap jalan selama input mengandung pos-posnya — dataset
sampel tetap memuat `total_aset_lancar`/`total_aset_tidak_lancar` karena itu.

Dataset sampel KLBF (ketiganya) diperbarui bersamaan: ditambah 8 baris agar mencakup
semua 17 pos benchmark KLBF (EPS, total liabilitas, total ekuitas, kas neto operasi,
belanja modal, dividen, ROE, current ratio) — tanpanya sampel akan GAGAL C1 ("HILANG").

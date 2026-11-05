# Metode Snapshot — Misi Lab: Sampel yang Tertukar

Sumber: paket data eksperimen Bioconductor `seqc` v1.46.0 (SEQC/MAQC-III),
diunduh 2026-10-15 dari https://bioconductor.org/packages/3.23/data/experiment/src/contrib/seqc_1.46.0.tar.gz.
Lisensi: **GPL-3** (halaman Bioconductor).

## Seleksi
- Platform ILM (Illumina), situs BGI + MAY, sampel A (UHRR)/B (HBRR) × 4 replika.
- Kolom lane/flowcell (mis. A_1_L01_FlowCellA) diagregasi (jumlah) per (grup, replika) -> 16 sampel.
- Top 3.000 gen non-ERCC tervariabel (varians CPM lintas 16 sampel) + 92 ERCC -> 3092 gen.
- `samples.csv`: metrik QC per sampel (library_size, gen_terdeteksi, fraksi_ercc).
- `taqman_subset.csv`: nilai TaqMan RT-PCR (ground truth independen) untuk gen yang overlap.
- Seed: 42. Tidak ada PII.

## Injeksi audit (hanya di samples_audit.csv & counts_audit.csv)
- J1: label grup A/B tertukar di 2 sampel (BGI_A_R2 <-> BGI_B_R2).
- J2: kolom MAY_B_R3 adalah salinan diam-diam dari MAY_A_R1 (duplikat terselubung).
- J3: seluruh sampel BGI digandakan ×0.25 (batch berkualitas rendah).

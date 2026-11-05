# Metode Snapshot — Misi Kontaminasi Platform (SEQC ROC)

Sumber: Bioconductor experiment data package `seqc` 1.46.0, diunduh 2026-10-15
dari https://bioconductor.org/packages/release/data/experiment/src/contrib/seqc_1.46.0.tar.gz.
File: ROC_refseq_gene_{MGP,NYU,SQW}.rda (platform ROC/Roche 454, anotasi RefSeq);
kolom impostor platform dari ILM_aceview_gene_BGI.rda (platform ILM/Illumina).
Lisensi: **GPL-3** (tabel Details halaman Bioconductor seqc).

## Seleksi
- Platform ROC, 3 center (MGP, NYU, SQW) × sampel A (UHRR)/B (HBRR) × 2 replika = 12 sampel.
- Gen: top 3000 variansi (log1p) lintas 12 sampel + 92 ERCC spike-in = 3092 gen.
- File: counts.csv (gen × 12 sampel), samples.csv (metadata), ercc_qc.csv
  (library size + fraksi ERCC per sampel — tabel QC ground truth).

## Kejujuran data
- Matriks count ROC asli tidak diubah di file bersih. ERCC adalah spike-in
  sintetik dengan konsentrasi diketahui — perilakunya adalah "kebenaran"
  teknis independen dari biologi sampel.
- `counts_audit.csv` / `samples_audit.csv` memuat 4 injeksi terdokumentasi:
  I1 wrong-center (NYU_B_1_R01 diklaim sebagai MGP);
  I2 ercc-failure (seluruh count ERCC SQW_A_1_R02 di-nol-kan);
  I3 platform-contam (satu kolom ILM BGI, 677080 reads, dilabeli SQW_B_1_R03);
  I4 jittered-dup (MGP_B_R02 disalin + noise 1% sebagai replika baru MGP_B_R03).

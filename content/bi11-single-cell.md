# BI11: Seurat, UMAP & Trajectory: Single-Cell RNA-seq

## Tujuan
- Menjelaskan perbedaan bulk vs single-cell RNA-seq dan kapan masing-masing.
- Menerapkan QC sel: nFeature, nCount, %MT, doublet.
- Menjelaskan alur HVG → PCA → neighbor → clustering → UMAP → anotasi marker.
- Menjelaskan konsep trajectory/pseudotime dan spatial transcriptomics.

## Ringkasan
- scRNA-seq = heterogenitas per sel; bulk = rata-rata.
- QC: nFeature, nCount, %MT, doublet — buang 30% sampah itu normal.
- Alur: HVG → PCA → Louvain/Leiden → UMAP → anotasi marker.
- Klaster = hipotesis; anotasi butuh marker + referensi + validasi.
- Trajectory: urutan diferensiasi (inferensi!); RNA velocity: arah.
- Spatial: ekspresi + posisi — skill terpanas lowongan.
- Resolusi clustering = parameter; pilih yang bermakna biologis.
- Waspadai doublet menyamar sebagai “tipe sel baru”.

# BI9: DESeq2 & Volcano Plot: RNA-seq: Gen Apa yang Berubah

## Tujuan
- Menjelaskan mengapa normalisasi RNA-seq tidak bisa sekadar dibagi total read.
- Menjelaskan model negative binomial dan alur DESeq2 (size factor, dispersi, shrinkage).
- Membaca volcano plot & MA plot dan menerapkan FDR.
- Menafsirkan GSEA / enrichment GO-KEGG dari daftar gen.

## Ringkasan
- Normalisasi DE = size factor/TMM; waspadai artefak komposisi.
- Count overdispersed → Negative Binomial + shrinkage (DESeq2/edgeR).
- Jangan uji-t pada count mentah.
- FDR (BH) wajib untuk 20.000 uji.
- Volcano: baca efek DAN signifikansi bersamaan.
- Desain: batch dalam formula; PCA sebelum DE.
- Interpretasi: GSEA/GO/KEGG — dari gen ke cerita.
- Desain eksperimen > analisis: batch confounded = tidak terselamatkan.

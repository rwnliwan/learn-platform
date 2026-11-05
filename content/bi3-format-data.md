# BI3: FASTA, FASTQ, VCF: Format File Genomik

## Tujuan
- Membaca dan menjelaskan struktur FASTA, FASTQ, SAM/BAM, VCF, GFF/GTF, BED.
- Menjelaskan skor kualitas Phred dan menghitung probabilitas error.
- Memfilter VCF berdasarkan QUAL, DP, dan frekuensi alel.
- Memilih format yang tepat untuk tiap tahap pipeline NGS.

## Ringkasan
- FASTA: sekuens; FASTQ: sekuens + kualitas (Q=−10log P).
- SAM/BAM: hasil mapping (posisi, CIGAR, MAPQ).
- VCF: katalog varian (QUAL, DP, GT); filter QUAL≥30, DP≥10.
- GFF/GTF: anotasi; BED: interval 0-based; count matrix: input DE.
- Waspadai off-by-one: BED 0-based vs VCF 1-based.
- Jangan buka di Excel; parse dengan library; stream file besar.
- Ts/Tv ~2 sebagai QC variant calling manusia.
- Format = kontrak; salah baca kontrak = salah sains.

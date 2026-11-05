# BI8: QC sampai Variant Calling: Pipeline NGS End-to-End

## Tujuan
- Menjelaskan alur pipeline NGS: QC → trimming → mapping → calling → anotasi.
- Membedakan short-read (Illumina) vs long-read (PacBio/ONT) dan memilih sesuai kebutuhan.
- Menjelaskan logika mapping (BWT) dan variant calling (model probabilistik, bukan hitung suara).
- Merancang QC checkpoint tiap tahap dan membaca metriknya (FastQC, MAPQ, Ts/Tv, Ti).

## Ringkasan
- Pipeline: QC → trim → map → call → anotasi; checkpoint QC tiap tahap.
- Illumina untuk SNP/indel; long-read untuk struktural/repetitif.
- BWA DNA, STAR RNA (splice-aware); filter MAPQ.
- Caller = Bayes (likelihood × prior), bukan voting.
- Best practice: mark duplicates, BQSR, VQSR; anotasi dengan VEP.
- Validasi kandidat kunci: IGV + orthogonal.
- Coverage >30–50x diminishing return (germline).
- Referensi konsisten (hg38); workflow manager + container untuk produksi.

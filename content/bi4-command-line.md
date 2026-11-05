# BI4: Terminal, Git & Nextflow: Senjata Wajib Bioinformatikawan

## Tujuan
- Menjelaskan mengapa command line wajib untuk data genomik skala besar.
- Menggunakan pola pikir pipe & streaming untuk file besar tanpa memuat ke RAM.
- Menjelaskan peran conda/Docker (reproducibility lingkungan) dan Git (versi kode).
- Merancang workflow DAG (Snakemake/Nextflow) dan menjelaskan eksekusi di HPC/Slurm.

## Ringkasan
- Terminal: bahasa ibu bioinformatika; pipe = streaming tanpa beban RAM.
- Kuasai 20 perintah inti; jangan timpa file mentah.
- Conda/Docker: bekukan lingkungan (versi tool) untuk reproducibility.
- Git: version control; commit tiap langkah logis.
- Snakemake/Nextflow: pipeline sebagai DAG — paralel, resume, portabel.
- HPC/Slurm: submit ribuan job; test 1 sampel dulu.
- Reproducibility = kode + data + lingkungan.
- “Berhasil di laptopku” bukan bukti — bukti = orang lain bisa jalan dari nol.

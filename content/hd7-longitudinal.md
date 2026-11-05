# HD7: Mixed Models & GEE: Data yang Diukur Berulang

## Tujuan
- Menjelaskan mengapa pengukuran berulang tidak independen dan apa akibatnya bila diabaikan.
- Membedakan efek tetap vs efek acak serta kapan memakai mixed model vs GEE.
- Menafsirkan ICC dan menghitung n efektif data berklaster.
- Memilih metode yang tepat untuk 4 skenario data longitudinal kesehatan.

## Ringkasan
- Pengukuran berulang tidak independen — abaikan = SE palsu.
- ICC mengukur redundansi; n efektif = n/(1+(m−1)ICC).
- Mixed model: efek tetap (populasi) + efek acak (subjek) — untuk pertanyaan individual/hierarkis.
- GEE: efek rata-rata populasi dengan SE robust — untuk pertanyaan kebijakan.
- Untuk biner, koefisien mixed vs GEE beda interpretasi (non-collapsibility).
- ICC tinggi → belanjakan anggaran untuk tambah subjek.
- Waspadai drop-out informatif pada data longitudinal (sambung ke HD8).
- Alur kerja: plot spaghetti → ICC → pilih model sesuai pertanyaan.

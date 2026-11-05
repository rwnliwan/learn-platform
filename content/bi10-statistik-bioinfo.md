# BI10: FDR & Batch Effect: Statistik yang Menyelamatkanmu

## Tujuan
- Membedakan FWER (Bonferroni) vs FDR (BH) dan memilih yang tepat.
- Mengenali batch effect dari plot dan merancang koreksinya.
- Menggunakan PCA/UMAP + clustering untuk QC dan eksplorasi.
- Menghitung power & ukuran sampel untuk eksperimen genomik.

## Ringkasan
- Multiple testing: tanpa koreksi = banjir false positive.
- Bonferroni (FWER) untuk klaim final; FDR/BH untuk penemuan.
- Batch effect: deteksi via PCA; cegah via desain interleaved.
- Batch confounded total = tidak terselamatkan.
- PCA untuk QC/struktur global; UMAP untuk klaster (jarak antar-klaster tak bermakna).
- Power: hitung sebelum eksperimen dengan m terkoreksi.
- Laporkan: metode koreksi + ambang + m.
- Dua cek due diligence: batch + multiple testing sebelum percaya hasil.

# METODE — Proyek E2: Pipeline VCF ke Laporan Varian

Data 100% SINTETIS untuk proyek ini (generator: `scripts/gen_vcf_data.py`,
`numpy.random.default_rng(2026)` — deterministik). BUKAN data pasien nyata;
file VCF mencantumkan peringatan sumber sintetis di header. Gen (G6PD, HBB,
CFTR, dsb.) dipakai sebagai label ilustrasi — BUKAN hasil sekuensing nyata.
**Penyederhanaan yang dinyatakan**: (1) klasifikasi memakai aturan
mirip-ACMG yang sangat disederhanakan (AF + consequence saja) — praktik
klinik memakai puluhan kriteria + kurasi manual; (2) anotasi referensi
disediakan sebagai file (di dunia nyata: database seperti ClinVar/gnomAD);
(3) pohon filogenetik dari 6 sampel ilustratif. Proyek ini melatih
*pipeline thinking*, bukan alat diagnosis.

## File
- `proband.vcf` — 400 varian, kolom:
  `CHROM, POS, ID (var_0001–var_0400), REF, ALT, QUAL, FILTER, INFO`
  (INFO: `DP;GQ;AF;GENE;CSQ`).
- `anotasi_referensi.csv` — 400 baris (kunci jawaban), kolom:
  `ID, gen, consequence, frekuensi_populasi, status_klinis`
  (Patogenik / VUS / Benign).
- `laporan_vendor.csv` — klasifikasi vendor impostor, kolom:
  `ID, gen, klasifikasi_vendor, keyakinan, catatan`.
- `jarak_genetik.csv` — matriks jarak 6×6 simetris
  (S1_proband, S2–S6), diagonal 0.

## Ground truth (dari harness, seed 2026)
1. **QC** (DP ≥ 20, QUAL ≥ 30, FILTER = PASS): lolos 375, gagal 25.
   Ketiga varian patogenik lolos QC.
2. **Kandidat** (AF < 0,01 & consequence relevan — stop_gained,
   frameshift_variant, splice_donor_variant, missense_variant): **11 varian**,
   terdiri dari 3 Patogenik + 8 VUS.
3. **Varian patogenik tertanam**: var_0042 (G6PD, stop_gained, AF 0,0001),
   var_0177 (HBB, frameshift_variant, AF 0,0004),
   var_0331 (CFTR, splice_donor_variant, AF 0,0002).
4. **Aturan klasifikasi sederhana** (AF < 0,001 & consequence high →
   Patogenik; AF < 0,01 & missense → VUS; lainnya Benign): cocok 11/11
   dengan referensi.
5. **Vendor impostor**: FP = 2 (var_0108 — synonymous, AF 35,25%;
   var_0256 — upstream, AF 13,43%; keduanya diklaim "Patogenik"),
   FN = 1 (var_0177 — frameshift HBB dilabel "VUS").
6. **UPGMA** dari matriks jarak: merge pertama S2+S5 (0,008);
   tetangga terdekat S1_proband = S3 (0,015). Urutan merge lengkap:
   S2+S5 → S1+S3 → S4+S6 → [S2+S5]+[S4+S6] → final.
7. **Pelanggaran vendor** (ground truth eksplisit): (I1–I2) dua false
   positive pada varian umum (AF 35% & 13% — tidak mungkin patogenik
   fully-penetrant; vendor "mengabaikan frekuensi populasi"); (I3) satu
   false negative: frameshift HBB (var_0177) diturunkan jadi VUS;
   (I4) klaim "akurasi 99%" tanpa denominator — dihitung dari mayoritas
   varian benign yang mudah; (I5) laporan tanpa jejak QC (tak menyebut
   DP/QUAL/FILTER — varian gagal QC tak jelas nasibnya).

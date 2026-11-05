# METODE — Misi: Dari VCF ke Laporan Program (misi-gabung-vcf-ke-laporan)

- **Sumber data:** SINTETIS 100% — data sintetis orisinal untuk misi ini. Dibangkitkan oleh generator Python (`cap8_gen.py`, NumPy `default_rng`, seed 42). BUKAN data genom manusia nyata; tidak ada individu, pasien, atau populasi sungguhan di balik angka-angka ini.
- **Gen & varian:** 8 varian FIKTIF (V1–V8) pada 4 gen FIKTIF (FIC1–FIC4). Simbol gen FIC* bukan simbol gen manusia nyata — sengaja fiktif agar tidak ada klaim klinis atas gen nyata yang sensitif. Konsekuensi, dampak, frekuensi referensi, prediksi, dan klasifikasi semuanya fiktif dan dirancang untuk misi edukasi ini.
- **File:**
  - `skrining_vcf.vcf` — VCF 4.2: 8 baris varian × 61 kolom sampel (S001–S061). Kolom FORMAT hanya GT (0/0, 0/1, 1/1). Kolom INFO membawa AF (peringatan: nilai INFO belum tentu cocok dengan genotipe — memverifikasinya adalah bagian dari misi).
  - `annotasi_varian.csv` — kolom: varian_id, gen, konsekuensi_draf, dampak_draf, af_kohort_draf, af_referensi_fiktif, prediksi_fiktif, klasifikasi_draf, rekomendasi_draf. Ini adalah ANNOTASI DRAF analis sebelumnya — belum tentu benar.
  - `metadata_kohort.csv` — 60 baris peserta (S001–S060): usia, jenis_kelamin, puskesmas, tanggal_skrining. Kebenaran jumlah peserta.
- **Seed:** 42. **Tanggal pembuatan:** 2026-10-15. **Ukuran total:** < 20 KB.
- **Kejujuran:** dataset ini SENGAJA mengandung masalah kualitas data (duplikat sampel, annotasi yang salah, klaim klasifikasi tanpa dasar bukti, angka INFO yang tidak cocok dengan genotipe). Menemukan, membuktikan, dan menanganinya — lalu menerjemahkan temuan menjadi rekomendasi program yang proporsional — adalah inti misi ini. Detail masalah TIDAK diungkap di sini agar misi audit tetap bermakna; semuanya dibuka di debrief.
- **Lisensi:** data sintetis orisinal untuk misi ini — bebas dipakai untuk pembelajaran di dalam platform.

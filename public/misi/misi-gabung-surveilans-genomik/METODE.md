# METODE — Misi Surveilans Genomik: Wabah yang Terlihat dari Sekuensnya (misi-gabung-surveilans-genomik)

- **Sumber data:** DATA SINTETIS ORISINAL UNTUK MISI INI — 100% dibuat-buat oleh generator di bawah. BUKAN data pasien nyata, BUKAN dari GISAID atau repositori ber-registrasi mana pun. Patogen disebut "patogen X" (fiktif); JANGAN menafsirkannya sebagai patogen nyata mana pun.
- **Generator:** skrip Python deterministik, seed 42. 24 sampel fiktif dari 3 lab daerah (Lab Utara, Lab Selatan, Lab Timur) × 4 wilayah (A–D), dikumpulkan Januari–Februari 2026 (kalender fiktif wabah).
- **File:**
  - `sampel.csv` — metadata + metrik QC per sampel: sample_id, lab, wilayah, tgl_koleksi, tgl_kirim, coverage_x, pct_genom, n_ambigu, skor_kontaminasi.
  - `matriks_jarak.csv` — format panjang: sample_a, sample_b, jarak_snp (276 pasangan; jarak = jumlah posisi SNP yang berbeda, sintetis).
  - `kasus_mingguan.csv` — wilayah, minggu (1–8), kasus (kurva sintetis; Wilayah C dirancang naik pada minggu 6–8).
- **Anomali yang disengaja (bagian dari desain pedagogis):** S09 terkontaminasi (skor 0,23); S17 gagal coverage (12,4×); S05 metadata tanggal mustahil (tgl_kirim < tgl_koleksi); klaster S13–S16 adalah artefak batch-effect Lab Timur (bukan transmisi); duplikat terselubung S11/S11B hanya muncul di dossier audit.
- **Ambang yang dipakai misi:** QC lolos bila coverage ≥ 30×, pct_genom ≥ 90%, n_ambigu ≤ 500, skor_kontaminasi < 0,05; klaster genetik = single-linkage dengan jarak ≤ 5 SNP; sinyal kurva = rasio kasus (minggu 7+8)/(minggu 5+6) ≥ 2.
- **Seed:** 42. **Tanggal pembuatan:** 2026-10-15.
- **Lisensi:** data sintetis orisinal — bebas dipakai untuk misi ini (dinyatakan eksplisit di briefing).
- **Batas jujur:** angka-angka ini TIDAK menggambarkan wabah nyata mana pun; ambang QC/klaster disederhanakan untuk misi; di dunia nyata ambang ditentukan pedoman lab dan konteks patogen.

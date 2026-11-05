# METODE — Misi Atribusi: Model yang Mengklaim Semua Kredit (misi-gabung-atribusi-model)

- **Sumber data:** SINTETIS 100% — dibangkitkan oleh skrip generator Python (numpy, seed 42) khusus untuk misi ini: `/tmp/cap1-atribusi-gen.py` (artefak build, bukan bagian snapshot). BUKAN data observasi nyata; perusahaan "PT Sinar Ritel", channel, minggu, dan semua angka adalah fiksi. Dinyatakan SINTETIS di briefing misi, di sini, dan di data room.
- **Lisensi/atribusi:** dataset sintetis dibuat untuk Learn v2; bebas dipakai untuk pembelajaran. Atribusi: Learn v2 — Misi Marketing Analytics × ML Engineer (capstone kombinasi).
- **File:**
  - `kinerja_mingguan.csv` — 96 baris (4 channel × 24 minggu). Kolom: `channel` (search/social/display/email), `minggu` (1–24), `spend_rp_jt`, `konversi_teratribusi` (last-touch), `nilai_teratribusi_rp_jt` (Rp 250.000 per konversi).
  - `geo_experiment.csv` — 60 baris (5 pasang geo × 6 minggu × 2 grup). Kolom: `pair_id`, `geo_id`, `grup` (perlakuan/kontrol), `minggu` (1–6), `spend_rp_jt` (spend search+social yang diuji; kontrol = 0), `konversi`, `prediksi_uplift` (prediksi model ML, satuan konversi).
- **Metode generator:**
  - Spend per channel per minggu: baseline (search 45 / social 30 / display 25 / email 5 Rp juta) × (1 + Normal(0; 0,06)).
  - Konversi organik per minggu: 900 + Normal(0; 60), ditambah 650 pada minggu 20–24 (musim liburan — inilah "musiman" yang menggelembungkan atribusi).
  - Konversi incremental SEJATI per channel: spend × ROAS-kausal × 4 konversi/Rp1jt, dengan ROAS-kausal search 3,0 / social 1,8 / display 1,0 / email 3,6, plus noise Normal(0; 12).
  - Konversi TERATRIBUSI (last-touch): incremental + organik × 0,82 × (spend channel / total spend minggu itu) — fraksi organik yang "tertangkap" atribusi inilah yang membuat ROAS klaim (4,21) jauh di atas ROAS kausal.
  - Geo experiment: 5 pasang geo; grup perlakuan spend search+social ≈ 10 + Normal(0; 1,5) Rp juta; efek kausal SEJATI 9,5 konversi per Rp1jt + noise Normal(0; 20); baseline geo 350–700 + Normal(0; 25). Hasil: incremental ROAS ≈ 2,47.
  - Prediksi uplift model (SENGAJA BOCOR): 0,16 × konversi aktual + Normal(0; 8) — meniru model yang dilatih dengan fitur post-treatment: korelasi prediksi vs konversi ≈ 0,91 tetapi korelasi prediksi vs lift aktual ≈ 0,01.
- **Seed:** 42 (numpy `default_rng(42)` — deterministik penuh).
- **Tanggal tangkapan:** 2026-10-15.
- **Batas jujur:** angka "ground truth kausal" (ROAS-kausal, efek 9,5 konversi/Rp1jt) diketahui HANYA karena data ini simulasi. Di dunia nyata tidak ada kolom ground truth — incrementality harus dibuktikan lewat eksperimen yang dirancang benar, bukan lewat atribusi observasional maupun model yang divalidasi terhadap konversi mentah.

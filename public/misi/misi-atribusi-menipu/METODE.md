# METODE — Misi Atribusi yang Menipu (misi-atribusi-menipu)

- **Sumber data:** SINTETIS 100% — dibangkitkan oleh skrip generator Python (seed 42) khusus untuk misi ini. BUKAN data observasi nyata; tidak ada pengguna, perusahaan, atau kampanye sungguhan di balik angka-angka ini.
- **Lisensi/atribusi:** dataset sintetis dibuat untuk Learn v2; bebas dipakai untuk pembelajaran. Atribusi: Learn v2 — Misi Marketing Analytics.
- **Seri:** 4.000 customer journey, jendela 30 hari; channel: display, social, email, search.
- **Metode:** tiap journey: paparan per channel ~ Bernoulli (display 0,45; social 0,35; email 0,22; search 0,30); hari sentuhan ~ uniform pada jendela channel (display 1–10, social 5–18, email 10–25, search 15–30); konversi ~ Bernoulli(sigmoid(−2,5 + 0,9·display + 0,5·social + 0,7·email + 0,1·search)); nilai Rp 250.000 per konversi; journey tanpa sentuhan dicatat "-". Kolom: perjalanan.csv (journey_id,sentuhan,n_sentuhan,konversi,nilai_rp); sentuhan.csv (journey_id,urutan,channel,hari_ke); belanja.csv (channel,spend_rp); efek_kausal.csv (channel,koefisien_logit,kenaikan_peluang_pp — efek marginal pada peluang baseline).
- **Seed:** 42.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 186185 byte (total 4 file CSV).
- **Batas jujur:** efek kausal tiap channel diketahui HANYA karena data ini simulasi — di dunia nyata tidak ada file efek_kausal.csv; incrementality harus dibuktikan lewat eksperimen (mis. geo holdout), bukan lewat atribusi observasional.

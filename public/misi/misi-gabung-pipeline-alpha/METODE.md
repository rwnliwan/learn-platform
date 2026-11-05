# METODE — Misi Pipeline: Dari Notebook ke Antrean yang Jujur (misi-gabung-pipeline-alpha)

- **Sumber data:** SINTETIS 100% — dibuat dengan generator Python (`random.Random(42)`, seed 42).
  BUKAN data asli, BUKAN antrean submit siapa pun, TANPA ekspresi alpha mentah,
  TANPA kredensial/data akun. Dinyatakan SINTETIS di briefing, di sini, dan di data room.
- **Isi:** 8 baris statistik AGREGAT fiksi (4 family fiksi: rv-1d, mom-5d, vb-or, sqz-x —
  nama family rekaan, bukan family strategi nyata) x 2 versi pipeline (v1 = jujur, v2 = "diperbaiki").
  Kolom: `version,family,n_sims,sharpe_mean,fitness_mean,turnover_pct_mean,dedup_hits,antrian,penalti,tahan,buang,cv_auc,train_auc`.
- **Metode:** nilai dasar tetap per (versi, family) + jitter kecil deterministik dari RNG seed 42
  (±0,004 untuk Sharpe/fitness, ±0,15 untuk turnover v1 agar hasil lab deterministik).
  Jumlah kategori per baris selalu = n_sims (antrian+penalti+tahan+buang).
- **Empat pola yang disuntikkan ke baris v2 (ditemukan di lab + audit):**
  1. ambang triase dilonggarkan tanpa catatan (ANTRIAN naik, PENALTI jadi 0);
  2. `cv_auc == train_auc` di semua family v2 (evaluasi bocor ke data training);
  3. `dedup_hits = 0` + n_sims membengkak (kunci dedup kehilangan satu field → duplikat terhitung);
  4. `turnover_pct_mean` v2 ditulis sebagai fraksi (0,284 dst) — satuan salah.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 576 byte.
- **Batas jujur:** ambang triase, bobot, dan aturan praktis self-corr >0,7 disederhanakan untuk
  latihan — bukan aturan resmi platform mana pun. Dataset ini ilustrasi audit pipeline, bukan
  cerminan pipeline nyata siapa pun.

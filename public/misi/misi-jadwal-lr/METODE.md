# METODE — Misi Learning Rate: Jadwal yang Membunuh Training (misi-jadwal-lr)

- **Sumber data:** SINTETIS — digenerasi khusus untuk misi ini dengan NumPy `default_rng(42)` (generator: `/tmp/gen_misi_m2.py`). Bukan log training nyata; setiap angka di file ini adalah hasil simulasi.
- **Cakupan:** 200 step × 4 jadwal (`konstan_tinggi`, `konstan_rendah`, `cosine_warmup`, `step_decay`) = 800 baris. Kolom: `step, schedule, loss`.
- **Metode:** `konstan_tinggi` turun sampai step 60 lalu divergen eksponensial dan menjadi NaN dari step 170 (31 NaN); `konstan_rendah` turun nyaris datar (2,29 → 2,00); `cosine_warmup` naik tipis 10 step pertama (warmup) lalu meluruh mengikuti kurva cosinus menuju ~0,34; `step_decay` turun bertangga di step 70 dan 140 menuju ~0,74. Semua plus noise Gaussian kecil.
- **Seed:** 42.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 19149 byte.
- **Batas jujur:** pola tiap jadwal ditanam secara sengaja dan disederhanakan agar perbandingan bisa direproduksi persis — uji coba LR nyata lebih berisik dan sering butuh ratusan step lebih banyak. Nilai `expected`/checks di misi dihitung langsung dari file ini.

# METODE — Misi Tagihan: Inferensi yang Membakar Uang (misi-biaya-inferensi)

- **Sumber data:** SINTETIS — dibuat khusus untuk misi ini dengan generator Python (`numpy.random.default_rng`, seed 42). BUKAN data tagihan vendor sungguhan; semua angka (volume, token, latensi, skor kualitas, harga) adalah ilustrasi yang dirancang agar konsisten secara internal.
- **File:** `log_inferensi.csv` — 2.400 baris log request inferensi LLM: `request_id, model, token_in, token_out, cache_hit, latensi_ms, skor_kualitas`.
- **Model sintetis:** `apex-ultra` (premium, 1.680 request) dan `blink-mini` (murah, 720 request).
- **Distribusi (seed 42):** token lognormal; `cache_hit` Bernoulli (0,35 apex / 0,15 blink); latensi normal (apex mean 900 ms; blink mean 600 ms + 5% ekor +2.200 ms); skor kualitas normal terpotong (apex mean 0,93; blink mean 0,875).
- **Harga (USD per 1 jt token, ilustratif):** kontrak apex-ultra $8/$32, blink-mini $0,50/$1,50 (token cache-hit = $0); tarif list vendor apex-ultra $16,25/$65, blink-mini $0,65/$1,95.
- **Baseline "6 bulan lalu":** 1.000 request sintetis (semua apex-ultra, harga kontrak, tanpa cache) = $25,21 — dipakai sebagai pembanding tagihan.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 92617 byte.
- **Batas jujur:** data sintetis — pola (double-count cache, p99 tersembunyi, cherry-picked eval, tarif list vs kontrak) adalah skenario latihan yang disengaja, bukan temuan audit terhadap vendor nyata mana pun. Jangan pakai angka harga di sini sebagai acuan pasar.

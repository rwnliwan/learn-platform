# METODE — Misi Turnover: Sharpe Tinggi yang Menipu (misi-turnover-trap)

- **Sumber data:** SINTETIS — dibuat dengan generator acak (Python/numpy, seed 42). BUKAN data asli, BUKAN kandidat submit siapa pun, TANPA ekspresi alpha mentah, TANPA kredensial/data akun. Dinyatakan SINTETIS di briefing, di sini, dan di data room.
- **Baris:** 15 kandidat alpha fiksi (kolom: `id,sharpe,fitness,turnover,decay,universe`). Distribusi: Sharpe ~ Uniform(1.70, 2.40); fitness ~ Normal(1.20, 0.18); turnover ~ Uniform(5, 55) dalam persen; decay ∈ {1,3,5}; satu kandidat memakai universe "TEST" (tak terverifikasi, bahan audit).
- **Metode:** Sharpe efektif = S − k × TO/100 dengan k=2 (model biaya sederhana, ilustratif). Kategori triase memakai Sharpe EFEKTIF dengan ambang yang sama seperti misi triase (BUANG bila S_eff<1.25 atau F<1; PENALTI bila TO>40%; ANTRIAN bila S_eff≥1.4 & F≥1.1 & TO≤40%; sisanya TAHAN). Komposisi hasil: ANTRIAN 6, TAHAN 4, BUANG 3, PENALTI 2.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 548 byte.
- **Batas jujur:** model biaya (k=2) adalah penyederhanaan ekstrem untuk latihan — biaya nyata tergantung broker, slippage, dan kapasitas; ambang disederhanakan, bukan aturan resmi platform mana pun.

# METODE — Misi Triase: Antrean yang Penuh Sesak (misi-triage-alpha)

- **Sumber data:** SINTETIS — dibuat dengan generator acak (Python/numpy, seed 42). BUKAN data asli, BUKAN antrean submit siapa pun, TANPA ekspresi alpha mentah, TANPA kredensial/data akun. Dinyatakan SINTETIS di briefing, di sini, dan di data room.
- **Baris:** 40 kandidat alpha fiksi (kolom: `id,sharpe,fitness,turnover,self_corr_bucket,universe`). Distribusi: Sharpe ~ Normal(1.55, 0.30); fitness ~ Normal(1.15, 0.22); turnover ~ Normal(33, 13) dalam persen; bucket self-corr kategorikal (<0.3 / 0.3-0.5 / 0.5-0.7 / >0.7); universe kategorikal dengan USA ≤50%.
- **Metode:** kategori triase dihitung deterministik dari ambang (BUANG bila S<1.25 atau F<1; PENALTI bila TO>40%; ANTRIAN bila S≥1.4 & F≥1.1 & TO≤40%; sisanya TAHAN) — kategori TIDAK disimpan di CSV; pelajar menghitungnya sendiri di lab. Komposisi hasil: ANTRIAN 13, TAHAN 13, BUANG 9, PENALTI 5.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 1342 byte.
- **Batas jujur:** angka-angka ini ilustrasi untuk latihan triase; ambang, bobot skor gabungan (0,6 S + 0,4 F), dan aturan praktis self-corr >0.7 disederhanakan untuk misi ini — bukan aturan resmi platform mana pun.

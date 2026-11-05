# METODE — Misi Dashboard: Angka yang Bisa Dipertahankan (misi-dashboard-regulator)

- **Status data: 100% SINTETIS.** Tidak ada data transaksi nyata, tidak ada nasabah nyata, tidak ada regulator nyata. Seluruh baris dibangkitkan oleh skrip `build-misi/misi-dashboard-regulator/gen.py` dengan seed tetap 42 — dijalankan ulang kapan pun menghasilkan file yang identik byte-per-byte.
- **Periode:** 2026-01-01 s.d. 2026-03-31 (90 hari). Pengguna: 400 ID sintetis (U0001–U0400). Transaksi per hari: 12–28 baris acak.
- **Metode sampling:** nominal = lognormal(mu=12.0, sigma=0.8) dibulatkan ke rupiah, dijepit pada [20000, 5000000]; status ~ valid 78% / gagal 10% / pending 7% / void 5%; kanal ~ aplikasi 50% / web 30% / agen 20%; wilayah seragam {JKT, SBY, BDG, MDN}.
- **Kotoran yang disengaja:** ±20% baris berstatus void diberi nominal 0 (entri rusak) — pelajar harus memutuskan perlakuan yang benar via definisi metrik.
- **Skema `transaksi.csv`:** transaksi_id (TX#####), tanggal (YYYY-MM-DD), user_id, nominal (integer rupiah), status, kanal, wilayah.
- **Skema `definisi_metrik.csv`:** metric_id, nama_metrik, definisi, versi, berlaku_mulai — kamus definisi resmi (v1) yang dipakai Lab 1.
- **Tanggal pembuatan:** 2026-10-15. Lisensi: sintetis untuk misi ini — bebas dipakai ulang dengan atribusi ke misi ini.
- **Batas jujur:** angka-angka di misi ini (termasuk di dossier audit) adalah angka mainan untuk latihan audit; tidak mencerminkan kinerja perusahaan mana pun. Dossier audit berisi suntikan impostor yang disengaja.

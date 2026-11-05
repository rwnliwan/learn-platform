# METODE — Misi Pipeline: Angka yang Tak Bisa Diulang (misi-pipeline-tak-reproduksibel)

- **Sumber data:** SINTETIS — 13 baris log run eksperimen yang dirancang manual untuk misi ini (seed 42 dinyatakan sebagai seed generator klaim, bukan hasil sampling acak).
- **File:** `run_eksperimen.csv` (13 baris; kolom `run_id,seed,paket_sklearn,hash_data,metrik_auc,status`). Satu run berstatus FAILED (metrik kosong).
- **Metode:** 4 run "konsensus" berkonfigurasi identik (seed 42, sklearn 1.4.0, hash a3f9c1) dengan metrik identik 0,8724; 5 run berkonfigurasi tercatat identik dengan metrik bervariasi (mensimulasikan seed yang dicatat tapi tidak diteruskan ke kode); 1 run beda versi paket; 1 run beda hash snapshot; 1 run gagal; 1 run kontrol beda seed.
- **Seed:** 42.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 559 byte.
- **Batas jujur:** nilai metrik dirancang untuk mengilustrasikan empat pola kegagalan reproduksibilitas — bukan log eksperimen nyata. Pola-polanya (seed tak dipakai, dependensi tak di-pin, snapshot beda, run gagal disembunyikan) adalah pola yang umum terjadi di industri.

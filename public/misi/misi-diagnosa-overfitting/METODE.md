# METODE — Misi Overfitting: Akurasi 99% yang Rapuh (misi-diagnosa-overfitting)

- **Sumber data:** SINTETIS — dibuat dengan generator NumPy (seed 42, skrip `/tmp/gen_overfit.py`). BUKAN data vendor nyata; pola kurva direkayasa menyerupai kasus overfitting klasik agar bisa dihitung ulang.
- **File:** `kurva.csv` — 500 baris (50 epoch × 5 seed × 2 split `train`/`val`), kolom `epoch,seed,split,loss,acc`. `metrik_seed.csv` — 5 baris (satu per seed), kolom `seed,train_acc,val_acc,test_acc,val_loss_min_epoch`; `val_acc` = akurasi validasi terbaik per seed, `test_acc` = akurasi pada held-out bersih (simulasi evaluasi jujur).
- **Metode:** kurva train = pertumbuhan logistik jenuh ~99,5% + noise; kurva val = naik ke puncak epoch 13–19 lalu turun perlahan (overfitting), val_loss berbentuk U dengan minimum sekitar epoch 17. Konstanta narasi dossier (duplikat validasi 18,4%, 50.000 baris pra-split) adalah bagian skenario, bukan kolom data.
- **Seed:** 42 (deterministik penuh).
- **Tanggal tangkapan:** 2026-10-15. Ukuran: kurva.csv 11821 byte, metrik_seed.csv 180 byte (total <5MB).
- **Batas jujur:** angka "klaim vendor 99%" adalah fiksi misi; yang nyata dan bisa diverifikasi pelajar hanyalah pola di kedua CSV (gap train−test ±27,9 poin, val_loss naik lagi setelah epoch 17, varians antar-seed).

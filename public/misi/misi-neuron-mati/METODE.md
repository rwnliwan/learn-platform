# METODE — Misi Neuron Mati: Jaringan yang Berhenti Belajar (misi-neuron-mati)

- **Sumber data:** SINTETIS — digenerasi khusus untuk misi ini dengan NumPy `default_rng(42)` (generator: `/tmp/gen_misi_m2.py`). Bukan log training nyata; setiap angka di file ini adalah hasil simulasi.
- **Cakupan:** 40 epoch × 5 layer (fc1, fc2, fc3, fc4, out) = 200 baris. Kolom: `epoch, layer, grad_norm, dead_frac, loss`.
- **Metode:** loss dibuat datar di sekitar 2,25 (turun hanya ~0,16 selama 40 epoch + noise Gaussian kecil); `grad_norm` menyusut dari layer `out` ke `fc1` (rasio rata-rata fc1/out ≈ 0,005 — pola vanishing gradient); `dead_frac` tumbuh dengan kedalaman layer (rata-rata fc4 ≈ 0,86 — pola dead ReLU) plus noise kecil, dibatasi [0, 0,97]; `loss` sama untuk semua layer dalam satu epoch.
- **Seed:** 42.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 5937 byte.
- **Batas jujur:** pola kegagalan (dead ReLU + vanishing gradient) ditanam secara sengaja dan disederhanakan agar diagnosis bisa direproduksi persis — training nyata jauh lebih berisik dan kedua patologi jarang tampil sebersih ini. Nilai `expected`/checks di misi dihitung langsung dari file ini.

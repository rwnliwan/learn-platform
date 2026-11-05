# METODE — Misi Rebalance yang Frenetik (misi-rebalance-frenesi)

- **Sumber data:** SINTETIS 100% — dibangkitkan oleh `generator.py` (seed 42) di folder ini. BUKAN data pasar nyata; semua harga adalah hasil simulasi.
- **Seri:** 4 kelas aset fiktif (SAHAM, OBLIGASI, EMAS, KAS); harga penutupan harian bursa, 1303 hari: 2021-01-04 s.d. 2025-12-31 (`harga.csv`: tanggal,SAHAM,OBLIGASI,EMAS,KAS; harga awal 100).
- **Metode:** Gerak Brown Geometrik harian berkorelasi (Cholesky): drift tahunan SAHAM 10% / OBLIGASI 5% / EMAS 4% / KAS 3%; vol tahunan 20% / 6% / 16% / 0,5%; korelasi SAHAM-OBLIGASI −0,10, SAHAM-EMAS +0,10, sisanya 0. Strategi di lab: target bobot 25% tiap aset; rebalance HARIAN / BULANAN (akhir bulan) / KUARTALAN (akhir kuartal) / TIDAK-PERNAH (buy & hold) / BAND-5pp (cek harian, rebalance hanya bila ada bobot menyimpang >5pp dari target). Biaya transaksi 20 bps dari nilai yang diperdagangkan; turnover satu event = 0,5 * jumlah |perubahan bobot|.
- **Seed:** 42 (numpy default_rng; satu seed untuk seluruh pembangkitan).
- **Tanggal tangkapan:** 2026-10-15. Ukuran: harga.csv 110527 byte (di bawah 5 MB).
- **Batas jujur:** data SINTETIS — bukan pasar nyata; drift/vol/korelasi konstan selama 5 tahun (di dunia nyata semuanya berubah); tidak ada dividen, pajak, bid-ask spread di luar 20 bps, atau dampak pasar (market impact); frekuensi rebalance bulanan memakai akhir bulan kalender bursa.

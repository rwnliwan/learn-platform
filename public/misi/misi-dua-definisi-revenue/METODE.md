# METODE — Misi Metrik: Dua Definisi, Satu Kebohongan (misi-dua-definisi-revenue)

- **Status data: 100% SINTETIS.** Tidak ada pendapatan perusahaan nyata. Seluruh baris dibangkitkan oleh skrip `build-misi/misi-dua-definisi-revenue/gen.py` dengan seed tetap 42 — deterministik penuh.
- **Rancangan:** 140 order sintetis, Jan–Jun 2026 (30/28/26/20/18/18 per bulan). Q1 memakai deal BESAR (lognormal mu=13.2) dengan porsi langganan 75%; Q2 deal lebih kecil (mu=12.7) dan seluruhnya sekali bayar; nominal dijepit [50000, 8000000] rupiah. Langganan hanya untuk order Jan–Mar, diakui rata selama 4 bulan (bulan order + 3 bulan berikut) agar seluruh pengakuan tetap di dalam semester.
- **Dua file, dua definisi:** `kas_masuk.csv` (order_id, tanggal_order, nominal, tipe) = definisi Finance "revenue = kas masuk"; `pengakuan.csv` (order_id, bulan_pengakuan, nominal_diakui) = definisi Product "revenue = pengakuan". Keduanya turun dari order yang SAMA — selisihnya murni soal waktu pengakuan, bukan data berbeda.
- **Skema `definisi_metrik.csv`:** definisi_id, nama, definisi, dipakai_oleh, versi — kamus dua definisi yang bersaing.
- **Baseline pembanding Q4-2025** (ditetapkan di misi, bukan dari data): kas_masuk = 55% dari kas Q1; diakui = 90% dari diakui Q1 — dipakai Lab 2 untuk menguji klaim "tumbuh vs kuartal lalu".
- **Tanggal pembuatan:** 2026-10-15. Lisensi: sintetis untuk misi ini — bebas dipakai ulang dengan atribusi ke misi ini.
- **Batas jujur:** pola "Q1 kas tinggi / Q2 pengakuan tinggi" dirancang agar jebakan dashboard (definisi bergantian) terlihat jelas. Di dunia nyata, selisih pengakuan vs kas biasanya lebih halus — pelajar tetap harus memeriksa definisi, bukan mengasumsikan pola.

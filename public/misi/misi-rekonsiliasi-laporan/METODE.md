# METODE — Misi Rekonsiliasi: Laporan yang Harus Klop (misi-rekonsiliasi-laporan)

- **Sumber data:** Sumber: Statlog German Credit Data, UCI Machine Learning Repository (https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data) — lisensi CC BY 4.0 (terverifikasi di halaman dataset pada 2026-10-15). Atribusi: Prof. Dr. Hans Hofmann, Universitaet Hamburg, via UCI ML Repository.
- **Metode:** `german.data` (1.000 baris, kode kategorikal) didekode via `german.doc`; kolom status (lancar/macet) dari `german.data-numeric` kolom terakhir (1=lancar, 2=macet); digabung per urutan baris. Kolom akhir: id, rekening_giro, durasi_bulan, riwayat_kredit, tujuan, plafon_kredit, tabungan, lama_kerja, cicilan_pct, usia, hunian, kredit_berjalan, pekerjaan, status.
- **Seed:** 42 (tidak ada sampling — 1.000 baris dipakai penuh). **Tanggal tangkapan:** 2026-10-15.
- **Batas jujur:** data tahun 1994 (DM sebagai satuan) — dipakai sebagai BAHAN LATIH pelaporan (struktur loan book nyata), bukan potret portofolio saat ini. NPL di sini = status "macet" per definisi dataset, bukan definisi regulator.

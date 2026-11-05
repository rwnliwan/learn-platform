# METODE — Misi Dua Sumber: Laporan di Tengah Perang Data (misi-laporan-dua-sumber)

- **Sumber data:** Sumber: Statlog German Credit Data, UCI Machine Learning Repository (https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data) — lisensi CC BY 4.0 (terverifikasi di halaman dataset pada 2026-10-15). Atribusi: Prof. Dr. Hans Hofmann, Universitaet Hamburg, via UCI ML Repository. (basis sama dengan Misi A Risk Reporting).
- **Metode:** dari loan book 1.000 baris dibuat DUA ekstrak: `core_banking.csv` (status per definisi core banking) dan `risk_mart.csv` (30 baris status dibalik — mensimulasikan perbedaan definisi as-of antar sistem; seed 42, daftar baris terdokumentasi di skrip build). `koreksi_bisnis.csv`: 12 baris "koreksi" dari unit bisnis atas data mart.
- **Seed:** 42. **Tanggal tangkapan:** 2026-10-15.
- **Batas jujur:** perbedaan definisi antar-sistem DISIMULASIKAN (bukan perbedaan nyata dua sistem bank) — dinyatakan eksplisit di briefing agar pelajar tidak mengira ini temuan forensik atas bank sungguhan. Tujuannya melatih PENILAIAN di tengah ambiguitas, bukan menemukan "jawaban benar" yang tersembunyi.

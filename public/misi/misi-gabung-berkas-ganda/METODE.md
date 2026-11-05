# METODE — Misi Berkas Ganda: Satu Pengajuan, Dua Vonis (misi-gabung-berkas-ganda)

- **Sumber data:** 100% SINTETIS — bukan data nasabah asli, bukan data publik. Dibangkitkan dengan generator Python `/tmp/cap1-berkas/gen.py`, seed 42, tanpa PII nyata (nama = kombinasi acak nama depan/belakang Indonesia).
- **File:** `aplikasi.csv` — 150 baris, kolom `id, nama, pendapatan, total_utang, nilai_agunan, lama_kerja_thn, no_hp, dokumen_pendapatan, skor_kredit_eksternal`.
- **Pola fraud DISISIPKAN SENGAJA** (dinyatakan eksplisit di briefing & data room): satu `no_hp` dipakai ulang di 6 berkas; 3 berkas `pendapatan` ±2,5× `dokumen_pendapatan`; 1 nilai `nilai_agunan` (Rp 175 jt) dipakai 2 berkas; 1 berkas `skor_kredit_eksternal` digelembungkan manual ke 850 (di atas rentang wajar 410–800).
- **PD proxy:** rumus misi `0,15 + 0,5×DTI − 0,02×lama_kerja_thn − 0,0005×(skor−600)`, dijepit 0,01–0,99; DTI = total_utang / (12 × pendapatan). Bukan model PD resmi/kalibrasi nyata.
- **Seed:** 42. **Tanggal pembuatan:** 2026-10-15. Ukuran: <50KB.
- **Batas jujur:** seluruh angka, nama, dan pola adalah fiksi untuk latihan; kemiripan dengan data nyata adalah kebetulan. Verifikasi lapangan (telepon independen, cek fisik agunan, konfirmasi biro) tidak tercakup misi ini.

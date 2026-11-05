# METODE — Misi Katalog: Siapa Pemilik Kolom Ini? (misi-katalog-data-hilang)

- **STATUS DATA: 100% SINTETIS.** Seluruh isi folder ini adalah data fiktif yang dibuat khusus untuk misi ini. Tidak ada data nyata, tidak ada data nasabah asli, tidak ada PII nyata. "PT Bank Cakrawala Digital", semua nama tim, kolom, angka, dan insiden (termasuk "surat regulator") adalah fiktif.
- **Generator:** `build-misi/gen_misi_katalog.py` (dari root `learn-platform`: `python3 build-misi/gen_misi_katalog.py`).
- **Seed:** 42. Isi skema & lineage sepenuhnya deklaratif (deterministik); seed hanya dipakai untuk pengacakan internal yang tidak memengaruhi isi.
- **Metode:** skema ditulis manual sebagai spesifikasi deklaratif di dalam generator — bukan sampling dari database nyata. Setiap kolom dirancang membawa tepat satu "pelajaran" (tanpa pemilik, duplikat, deprecated, deskripsi kosong, beda satuan).
- **File:**
  - `skema_kolom.csv` — 37 kolom × 6 tabel. Kolom: `tabel,kolom,tipe_data,deskripsi,pemilik,laporan_kritis,status`. Nilai `pemilik` kosong = tanpa pemilik; `status` = aktif/deprecated.
  - `lineage.csv` — 12 relasi `kolom_asal → kolom_tujuan` + `transformasi` + `relasi` (duplikat/turunan/agregasi).
  - `audit_log.csv` — 8 baris kronologi fiktif 2023 → 2026.
- **Aturan klasifikasi sensitivitas (dipakai Lab 1):**
  - `rahasia` bila nama kolom mengandung: nik, nama, full_name, alamat, lahir, no_hp, no_rekening, acct_no
  - `terbatas` bila mengandung: saldo, nominal, jumlah, skor, pd_
  - `internal` bila mengandung: id, kode, code, status, segmen, segment, channel, jenis, currency, tgl, date
  - selain itu `publik`
  - Hasil pada dataset ini: rahasia=9, terbatas=6, internal=20, publik=2.
  - Catatan heuristik: `risiko.tgl_skor` ikut terklasifikasi `terbatas` karena mengandung substring "skor" — false positive yang disengaja sebagai bahan diskusi (aturan berbasis nama butuh review manusia).
- **Angka kunci (verifikasi):** total kolom 37 · tanpa pemilik 8 · kritis tanpa pemilik 2 (`risiko.skor_risiko_internal`, `risiko.id_nasabah`) · deprecated tapi dipakai laporan kritis 1 (`nasabah.kode_cabang_lama`) · pasangan duplikat 5.
- **Tanggal snapshot:** 2026-10-15. Ukuran total folder: < 10 KB.
- **Batas jujur:** klasifikasi berbasis pola nama adalah heuristik (contoh di dunia nyata memakai pemindaian isi + persetujuan pemilik data); angka "37 kolom" adalah miniatur — katalog bank nyata berisi ribuan kolom.

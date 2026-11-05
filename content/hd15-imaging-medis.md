# HD15: DICOM & Klasifikasi Citra: Melihat Seperti Radiolog

## Tujuan
- Menjelaskan struktur DICOM (piksel + metadata) dan mengapa metadata sama pentingnya dengan gambar.
- Menjelaskan cara kerja CNN untuk klasifikasi citra secara konseptual (konvolusi, pooling, transfer learning).
- Mengevaluasi model citra dengan metrik klinis (sens/spes, bukan cuma akurasi) + validasi eksternal.
- Mengidentifikasi jebakan khas: shortcut learning, label berisik, spectrum bias.

## Ringkasan
- DICOM = piksel + metadata; metadata = PII yang wajib dianonimisasi.
- CNN: fitur bertingkat via konvolusi; transfer learning standar untuk data kecil.
- Label dari radiolog (multi-reader), bukan kode billing.
- Split per pasien/RS; evaluasi per mesin/RS.
- Shortcut learning adalah mode gagal #1 — uji crop + Grad-CAM + eksternal.
- Metrik klinis: sens/spes + PPV pada prevalensi target.
- AI citra = second reader/triase, bukan pengganti untuk kasus kompleks.
- Performa lab ≠ lapangan: validasi eksternal + monitoring wajib.

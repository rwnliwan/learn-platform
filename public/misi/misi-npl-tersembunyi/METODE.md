# METODE — misi-npl-tersembunyi (Misi B Credit Risk)

## Sumber data
- Statlog German Credit, Prof. Dr. Hans Hofmann, Universität Hamburg (1994).
- Diunduh (tanpa login): https://archive.ics.uci.edu/static/public/144/statlog+german+credit+data.zip
  (german.data 1000 baris + german.doc kamus kode; class 1 = good, 2 = bad).
- File mentah saat build: /tmp/german_dl/german.data (dicek ulang bila hilang).

## Lisensi (tiga pengecekan, 2026-10-15)
1. Halaman dataset UCI id 144 (https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data):
   badge lisensi eksplisit — "This dataset is licensed under a Creative Commons
   Attribution 4.0 International (CC BY 4.0) license." (diverifikasi live via curl).
2. Metadata ucimlrepo (fetch_ucirepo id 144): TIDAK memuat field license.
3. OpenML credit-g (dataset IDENTIK, kreator Dr. Hans Hofmann,
   https://www.openml.org/d/31): field licence = "Public" (diverifikasi via API).
- Atribusi bundel: "Statlog German Credit (Hofmann, UCI ML Repository, CC BY 4.0)".

## Metode
- Kode kategorikal didekode ke label Inggris deskriptif (lihat skrip
  misi-data/build_misi-npl-tersembunyi.py); kolom numerik tidak diubah.
- loanbook.csv = data bersih, 1000 baris. seed acak = 42 (random Python).
- facility_ref di restrukturisasi.csv = "F-" + nomor baris data (1-based) di loanbook.csv.

## Injeksi kotoran (HANYA di loanbook_audit.csv; loanbook.csv murni)
- K1 missing values: 50 baris employment_since kosong (baris data: 7, 26, 28, 31, 33, 90, 95, 96, ...) dan 50 baris savings kosong (baris data: 45, 47, 72, 81, 82, 100, 104, 128, ...).
- K2 duplikat konflik: baris data 1001 = salinan baris 697 dengan class dibalik; baris data 1002 = salinan baris 728 dengan class dibalik.
- K3 installment_rate mustahil: baris 700 -> 88, baris 719 -> 75, baris 960 -> 92 (nilai asli 1-4 di data bersih).
- K4 kode purpose tak valid: baris 74 -> 'A99', baris 664 -> 'BOGUS'.

## File restrukturisasi.csv — SINTETIS
40 baris fasilitas yang direstrukturisasi, dibangkitkan berparameter (seed 42):
facility_ref, debitur (nama samaran Indonesia), tanggal_restrukturisasi (2024),
status_sebelum (macet/diragukan/kurang_lancar), keterangan.
Bukan data nyata — dipakai untuk melatih skeptisisme: dua fasilitas di file ini
(F-0012 milik "PT Maju Jaya", F-0047 milik "D. Prasetyo") diklaim "tidak pernah direstrukturisasi"
dalam dossier audit misi. Total <5MB untuk seluruh folder.

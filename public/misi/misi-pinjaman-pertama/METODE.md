# METODE — misi-pinjaman-pertama

## Sumber data
- Dataset: **Statlog German Credit Data** (Prof. Dr. Hans Hofmann,
  Institut für Statistik und Ökonometrie, Universität Hamburg).
- Unduhan: https://archive.ics.uci.edu/static/public/144/statlog+german+credit+data.zip
  (berisi `german.data` = 1000 baris, 20 atribut berkode + class 1=good/2=bad;
  `german.doc` = kamus kode).
- Atribusi: "Data: Prof. Dr. Hans Hofmann, Statlog German Credit Data (UCI ML Repository)".

## Lisensi — hasil 3 pengecekan (2026-10-15)
1. Halaman dataset UCI (https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data)
   menampilkan seksi **License**: "This dataset is licensed under a
   **Creative Commons Attribution 4.0 International (CC BY 4.0)** license."
   (CC BY 4.0 mengizinkan berbagi & adaptasi untuk tujuan apa pun dengan atribusi.)
2. Metadata `ucimlrepo` (`fetch_ucirepo(id=144)`): **tidak punya field license**
   (nilai `None`; daftar key metadata tidak memuat `license`).
3. OpenML credit-g (https://www.openml.org/d/31 — dataset IDENTIK,
   kreator Dr. Hans Hofmann): API openml.org mengembalikan **licence = "Public"**.

Bundel snapshot ini dibenarkan atas dasar (1) dan (3).

## Metode decode kolom
- Setiap baris `german.data` (21 field dipisah spasi) dipetakan 1:1 ke kolom deskriptif
  Inggris memakai kamus `german.doc` (A11..A410, dst.). Class: 1 -> "good", 2 -> "bad".
- Kode purpose yang muncul di data asli: A40, A41, A410, A42–A46, A48, A49
  (A47 "vacation" memang tidak ada di data — sesuai catatan german.doc).
- `application_id` (APP-0001..APP-1000) adalah **ID sintetis** dari urutan baris —
  bukan bagian data asli; ditambahkan agar injeksi duplikat "ID aplikasi identik"
  dapat dideteksi secara bermakna.
- Seed: 42 (pemilihan baris injeksi via `random.sample`).

## Injeksi audit (hanya di kredit_audit.csv)
| Jenis | Jumlah | application_id terdampak |
|---|---|---|
| Baris duplikat persis (ID aplikasi identik) | 3 pasang | APP-0655, APP-0115, APP-0026 |
| installment_rate mustahil (99%) | 2 baris | APP-0760, APP-0282 |
| Kode purpose tak valid ("A412", tak ada di kamus) | 2 baris | APP-0251, APP-0229 |
| Umur mustahil (120 tahun) | 1 baris | APP-0143 |

`kredit_audit.csv` = 1003 baris (1000 + 3 duplikat). File dasar `kredit.csv` murni data publik.

## Statistik kunci (untuk checks lab — dihitung dari CSV asli)
- n_baris = 1000
- bad_rate keseluruhan = 0.30 (300 bad / 1000)
- bad_rate per credit_history tertinggi: "no credits / all paid duly" (A30) = 0.625 (25/40)
- median credit_amount: good = 2244.0, bad = 2574.5

## Ukuran file
- kredit.csv: 227996 bytes
- kredit_audit.csv: 228631 bytes

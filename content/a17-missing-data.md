# A1.7: Missing Data & Imputasi

## Data Hilang: Abaikan atau Isi?

Dataset nyata selalu punya lubang. Gaji kosong, tanggal lahir hilang, sensor rusak.

**Pilihan naif:** Hapus semua baris yang ada missing-nya.
**Masalah:** Kalau 30% baris punya minimal satu missing, kamu buang 30% data!

---

## 1. Tiga Mekanisme Missing

### MCAR (Missing Completely At Random)
Hilangnya **tidak berhubungan** dengan apapun.

**Contoh:** Sensor rusak acak, file corrupt.

**Ciri:** Data yang tersisa representatif. Hapus baris masih OK (tapi buang informasi).

### MAR (Missing At Random)
Hilangnya **berhubungan dengan variabel lain** yang teramati.

**Contoh:** Orang berpenghasilan tinggi cenderung tidak mengisi kolom gaji. Missing-nya berhubungan dengan variabel lain (misal: jabatan, wilayah).

**Ciri:** Bisa diprediksi dari variabel lain. Imputasi cerdas bekerja baik.

### MNAR (Missing Not At Random)
Hilangnya **berhubungan dengan nilai yang hilang itu sendiri**.

**Contoh:** Orang yang bangkrut tidak melaporkan kebangkrutan. Nilai yang hilang (bangkrut) menyebabkan missing-nya.

**Ciri:** Paling berbahaya. Tidak bisa diperbaiki sepenuhnya dari data yang ada.

---

## 2. Strategi Penanganan

### Hapus (Deletion)
- **Listwise:** Hapus baris dengan missing apapun. Simple, tapi boros.
- **Pairwise:** Pakai data tersedia per analisis. Inkonsisten.

**Kapan OK:** MCAR dan missing < 5%.

### Imputasi Sederhana
- **Mean/Median:** Cepat tapi merusak variansi (semua imputasi sama → underestimasi sebaran).
- **Modus:** Untuk kategori.
- **Forward/Backward fill:** Untuk time series.

### Imputasi Cerdas
- **Regresi:** Prediksi missing dari variabel lain.
- **KNN:** Ambil dari tetangga terdekat.
- **Multiple Imputation (MICE):** Buat beberapa versi imputasi → gabungkan hasil. Gold standard.

---

## 3. Jangan Lakukan Ini

❌ **Imputasi mean lalu hitung SD** — SD akan underestimate (data imputasi tidak bervariasi).
❌ **Hapus tanpa cek mekanisme** — bisa bias sistematis (MNAR).
❌ **Isi dengan 0** — 0 adalah nilai, bukan "tidak tahu"!

---

## 4. Praktik Terbaik

1. **Laporkan % missing per kolom.** Transparansi dulu.
2. **Cek pola.** Apakah missing berkelompok? (heatmap missing)
3. **Pilih metode sesuai mekanisme.** MCAR → hapus OK. MAR → imputasi cerdas. MNAR → waspada, laporkan keterbatasan.
4. **Buat indikator.** Tambah kolom `gaji_missing` (1/0). Kadang "hilangnya" sendiri adalah sinyal!

---

## Latihan

### Quiz 1
Kolom gaji kosong lebih sering untuk jabatan direktur. Mekanisme apa?

A. MCAR
B. MAR
C. MNAR
D. Tidak ada missing

<details>
<summary>Jawaban</summary>

**B. MAR.** Missing berhubungan dengan variabel teramati (jabatan). Bisa diprediksi.
</details>

### Quiz 2
Kenapa imputasi mean merusak analisis?

A. Mean selalu salah
B. Mengurangi variansi artifisial
C. Terlalu lambat
D. Tidak ada masalah

<details>
<summary>Jawaban</summary>

**B.** Semua nilai imputasi = mean → tidak ada variasi → SD underestimate → p-value terlalu optimis.
</details>

---

## Kesimpulan

1. **Kenali mekanisme dulu** (MCAR/MAR/MNAR) sebelum pilih strategi.
2. **Imputasi mean = merusak variansi.** Pakai MICE untuk serius.
3. **Missing itu sendiri bisa jadi feature.**

**Next:** A1.8 — Memilih Visualisasi yang Tepat

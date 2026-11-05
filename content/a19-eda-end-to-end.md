# A1.9: EDA End-to-End — Studi Kasus Kredit

## Menggabungkan Semua: Dari Data Mentah ke Insight

Kamu dapat dataset pengajuan kredit: 10.000 baris, 15 kolom. Bos minta: "Kasih tahu pola apa yang kamu temukan."

Ini workflow EDA sistematis.

---

## 1. Langkah 1: Pahami Grain & Kamus Data

**Tanya dulu:**
- Satu baris = ? → Satu pengajuan kredit
- Periode? → Jan 2024 - Des 2025
- Target? → `default_12m` (1=gagal bayar dalam 12 bulan)

**Kamus data:** Dokumentasikan setiap kolom (tipe, skala, definisi bisnis).

---

## 2. Langkah 2: Cek Kualitas Data

- **Missing:** Kolom apa yang banyak kosong? (`penghasilan` 15% missing)
- **Duplikat:** Ada nasabah ganda?
- **Outlier:** Umur 250? Penghasilan negatif?
- **Konsistensi:** Tanggal lahir > tanggal pengajuan?

---

## 3. Langkah 3: Univariate — Satu Variabel

Untuk setiap kolom penting:
- **Numerik:** Histogram + boxplot. Skewed? Outlier?
- **Kategori:** Bar chart frekuensi. Imbalanced?

**Temuan contoh:**
- `penghasilan`: right-skewed, median 8jt, ada outlier 500jt
- `tujuan_kredit`: 60% modal kerja, 25% konsumsi, 15% investasi

---

## 4. Langkah 4: Bivariate — Hubungan dengan Target

**Default rate per segmen:**
- Penghasilan < 5jt: default 18%
- Penghasilan 5-10jt: default 9%
- Penghasilan > 10jt: default 4%

**Insight:** Penghasilan rendah = risiko 4.5x lipat!

**Korelasi:** Cek antar variabel numerik (waspadai multikolinearitas).

---

## 5. Langkah 5: Insight & Rekomendasi

**Temuan:**
1. Default terkonsentrasi di penghasilan < 5jt (18% vs 4%)
2. Tujuan konsumsi default 2x modal kerja
3. Missing penghasilan sendiri prediktif (default 22%!)

**Rekomendasi:**
- Perketat verifikasi penghasilan < 5jt
- Bedakan pricing per tujuan kredit
- Jangan abaikan missing — itu sinyal

---

## Checklist EDA

- [ ] Grain didokumentasikan
- [ ] Missing/lengkap per kolom
- [ ] Distribusi setiap variabel (plot!)
- [ ] Hubungan dengan target
- [ ] Outlier diinvestigasi (bukan langsung hapus)
- [ ] Insight ditulis dalam bahasa bisnis

---

## Kesimpulan

EDA bukan sekadar "lihat-lihat data". Ini **investigasi sistematis** yang menghasilkan hipotesis untuk modeling.

**Next:** A2.1 — Sampling, Bias & Standard Error

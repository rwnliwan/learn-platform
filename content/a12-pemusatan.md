# A1.2: Ukuran Pemusatan — Mean, Median, Modus & Kawan-kawan

## Masalah: Satu Angka untuk Mewakili Seribu

Kamu punya data gaji 100 karyawan. Bos bertanya: "Gaji karyawan kita berapa?"

Kamu tidak bisa sebutkan 100 angka. Kamu butuh **satu angka** yang mewakili. Tapi angka mana?

Jawabannya: tergantung distribusi data dan tujuanmu. Salah pilih → kesimpulan salah → keputusan salah.

---

## 1. Mean (Rata-rata Hitung)

$$\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$$

**Kapan pakai:** Data simetris, tidak ada outlier ekstrem, skala interval/rasio.

**Contoh:**
Gaji (juta Rp): 8, 9, 10, 11, 12
$$\bar{x} = \frac{8+9+10+11+12}{5} = 10$$

**Kelemahan fatal:** Sangat sensitif terhadap outlier.

Gaji: 8, 9, 10, 11, **100** (direktur masuk data)
$$\bar{x} = \frac{138}{5} = 27.6$$

Rata-rata 27.6 juta — padahal 4 dari 5 karyawan gajinya di bawah 12 juta! Mean berbohong di sini.

---

## 2. Median (Nilai Tengah)

Urutkan data, ambil yang di tengah.

**Contoh:**
8, 9, 10, 11, 100 → median = **10** (tidak terpengaruh direktur!)

**Kapan pakai:** Data skewed (miring) atau ada outlier. Standar untuk data pendapatan, harga rumah.

**Sifat:** Robust — 50% data bisa "rusak" sebelum median bergeser (breakdown point 50%).

---

## 3. Modus (Nilai Tersering)

**Contoh:**
Rating kepuasan: Puas, Puas, Netral, Puas, Tidak Puas → modus = **Puas**

**Kapan pakai:** Data nominal/ordinal. Satu-satunya ukuran pemusatan yang valid untuk nominal.

---

## 4. Kawan-kawan: Trimmed, Geometric, Harmonic, Weighted

### Trimmed Mean
Potong x% terkecil dan terbesar, lalu rata-ratakan sisanya.

**Contoh:** Trimmed mean 20% dari [8, 9, 10, 11, 100]:
- Potong 1 terkecil (8) dan 1 terbesar (100)
- Rata-rata [9, 10, 11] = **10**

**Kapan pakai:** Ingin robust seperti median tapi tetap pakai lebih banyak informasi.

### Geometric Mean
$$G = \sqrt[n]{x_1 \times x_2 \times \cdots \times x_n}$$

**Kapan pakai:** Data perkalian/pertumbuhan (return investasi, rasio).

**Contoh:** Return tahunan: +10%, -5%, +20%
$$G = \sqrt[3]{1.10 \times 0.95 \times 1.20} - 1 = 7.7\%$$

Jangan pakai mean aritmatika untuk return! (10 - 5 + 20)/3 = 8.3% — melebih-lebihkan.

### Harmonic Mean
$$H = \frac{n}{\frac{1}{x_1} + \frac{1}{x_2} + \cdots + \frac{1}{x_n}}$$

**Kapan pakai:** Rata-rata kecepatan/rate.

**Contoh:** Pergi 60 km/jam, pulang 40 km/jam (jarak sama).
$$H = \frac{2}{\frac{1}{60} + \frac{1}{40}} = 48 \text{ km/jam}$$

Bukan (60+40)/2 = 50! Karena lebih banyak waktu dihabiskan pada kecepatan lambat.

### Weighted Mean
$$\bar{x}_w = \frac{\sum w_i x_i}{\sum w_i}$$

**Kapan pakai:** Data punya bobot berbeda.

**Contoh:** Portofolio: 60% saham (return 12%), 40% obligasi (return 5%)
$$\bar{x}_w = 0.6 \times 12 + 0.4 \times 5 = 9.2\%$$

---

## 5. Kapan Pakai Apa?

| Situasi | Pakai |
|---------|-------|
| Data simetris, no outlier | Mean |
| Data skewed / ada outlier | Median |
| Data kategori | Modus |
| Rata-rata pertumbuhan | Geometric mean |
| Rata-rata kecepatan | Harmonic mean |
| Data berbobot | Weighted mean |
| Ingin robust tapi informatif | Trimmed mean |

**Hubungan untuk distribusi unimodal:**
- Simetris: mean ≈ median ≈ modus
- Miring kanan (right skew): mean > median > modus
- Miring kiri (left skew): mean < median < modus

---

## 6. Latihan

### Quiz 1
Data: 5, 5, 5, 5, 100. Mana yang paling mewakili "tipikal"?

A. Mean = 24
B. Median = 5
C. Modus = 5
D. B dan C benar

<details>
<summary>Jawaban</summary>

**D.** Mean 24 tidak mewakili siapa pun (4 data = 5, 1 data = 100). Median dan modus = 5 jauh lebih representatif.
</details>

### Quiz 2
Investasi naik 100% tahun 1, turun 50% tahun 2. Berapa rata-rata return tahunan yang benar?

A. 25% ((100 - 50) / 2)
B. 0% (geometric mean)
C. 50%
D. Tidak bisa dihitung

<details>
<summary>Jawaban</summary>

**B. 0%.** Rp 100 → Rp 200 (naik 100%) → Rp 100 (turun 50%). Kembali ke awal = return 0%.
Geometric: √(2.0 × 0.5) - 1 = √1 - 1 = 0%. Mean aritmatika (25%) salah total!
</details>

---

## Kesimpulan

1. **Mean untuk simetris, median untuk skewed, modus untuk kategori.**
2. **Outlier membunuh mean** — selalu cek distribusi dulu.
3. **Return pakai geometric, kecepatan pakai harmonic.**

**Next:** A1.3 — Ukuran Sebaran (variansi, SD, IQR, dan kawan-kawan)

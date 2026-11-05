# A1.3: Ukuran Sebaran — Variansi, SD, IQR, MAD, CV

## Masalah: Rata-rata Saja Tidak Cukup

Dua kelas punya rata-rata nilai 75. Kelas A: semua nilai 73-77. Kelas B: nilai 40-100.

Rata-rata sama, tapi kelas B jauh lebih "berisiko" — hasilnya tidak bisa diprediksi. **Sebaran** mengukur ketidakpastian ini.

Dalam risiko kredit: dua portofolio dengan expected loss sama tapi volatilitas beda → modal yang dibutuhkan beda jauh.

---

## 1. Range (Jangkauan)

$$\text{Range} = \max - \min$$

**Contoh:** 40, 73, 75, 77, 100 → Range = 100 - 40 = 60

**Kelemahan:** Hanya pakai 2 titik ekstrem. Satu outlier merusak total.

---

## 2. Variansi & Standar Deviasi

### Variansi Populasi
$$\sigma^2 = \frac{1}{N}\sum_{i=1}^{N}(x_i - \mu)^2$$

### Variansi Sampel
$$s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2$$

**Mengapa n-1?** Koreksi Bessel — sampel cenderung underestimate variansi populasi. Pembagi n-1 membuat estimator unbiased.

### Standar Deviasi
$$s = \sqrt{s^2}$$

**Mengapa SD lebih intuitif?** Variansi dalam satuan kuadrat (Rp² tidak bermakna). SD kembali ke satuan asli (Rp).

**Contoh:**
Data: 8, 10, 12 (juta Rp). Mean = 10.
$$s^2 = \frac{(8-10)^2 + (10-10)^2 + (12-10)^2}{2} = \frac{4+0+4}{2} = 4$$
$$s = \sqrt{4} = 2 \text{ juta Rp}$$

**Aturan empiris (data normal):**
- ±1 SD: ~68% data
- ±2 SD: ~95% data
- ±3 SD: ~99.7% data

---

## 3. IQR (Interquartile Range)

$$IQR = Q_3 - Q_1$$

**Contoh:** Data: 1, 3, 5, 7, 9, 11, 13, 100
- Q1 (kuartil 1) = 4
- Q3 (kuartil 3) = 10
- IQR = 10 - 4 = 6

Outlier 100 tidak mempengaruhi IQR! **Robust** seperti median.

---

## 4. MAD (Median Absolute Deviation)

$$\text{MAD} = \text{median}(|x_i - \text{median}(x)|)$$

**Contoh:** 1, 3, 5, 7, 100. Median = 5.
Deviasi absolut: |1-5|=4, |3-5|=2, |5-5|=0, |7-5|=2, |100-5|=95
MAD = median(4, 2, 0, 2, 95) = **2**

**Kapan pakai:** Deteksi outlier yang sangat robust. Breakdown point 50%.

---

## 5. Coefficient of Variation (CV)

$$CV = \frac{s}{\bar{x}} \times 100\%$$

**Kapan pakai:** Bandingkan sebaran relatif antar dataset dengan skala beda.

**Contoh:**
- Saham A: mean Rp 10.000, SD Rp 1.000 → CV = 10%
- Saham B: mean Rp 100.000, SD Rp 5.000 → CV = 5%

SD B lebih besar (5000 > 1000), tapi **relatif** terhadap harganya, A lebih volatil (10% > 5%).

---

## 6. Semi-Deviation (Downside Risk)

Hanya hitung deviasi di bawah target/mean.

$$\text{Semidev} = \sqrt{\frac{1}{n}\sum_{x_i < T}(x_i - T)^2}$$

**Kapan pakai:** Risiko keuangan — investor peduli downside, bukan upside volatility.

---

## 7. Ringkasan

| Ukuran | Robust? | Satuan | Kapan Pakai |
|--------|---------|--------|-------------|
| Range | ❌ | Asli | Cepat, kasar |
| Variansi | ❌ | Kuadrat | Perhitungan teoretis |
| SD | ❌ | Asli | Umum, data simetris |
| IQR | ✅ | Asli | Data skewed, outlier |
| MAD | ✅✅ | Asli | Sangat robust |
| CV | ❌ | % | Bandingkan skala beda |
| Semi-dev | ❌ | Asli | Downside risk |

---

## Latihan

### Quiz 1
Dua reksadana: A (mean 10%, SD 2%), B (mean 10%, SD 8%). Mana lebih berisiko?

A. Sama, mean-nya sama
B. B, karena sebarannya lebih lebar
C. A, karena lebih stabil
D. Tidak bisa ditentukan

<details>
<summary>Jawaban</summary>

**B.** Mean sama tapi B punya SD 4x lipat — hasilnya jauh lebih tidak pasti.
</details>

### Quiz 2
Data gaji ada outlier (direktur). Ukuran sebaran apa yang paling tepat?

A. Standar deviasi
B. IQR atau MAD
C. Range
D. Variansi

<details>
<summary>Jawaban</summary>

**B.** IQR/MAD robust terhadap outlier. SD dan range akan meledak karena direktur.
</details>

---

## Kesimpulan

1. **SD untuk umum, IQR/MAD untuk robust.**
2. **CV untuk bandingkan apel vs jeruk.**
3. **Selalu laporkan pemusatan + sebaran bersamaan.** Mean tanpa SD = setengah cerita.

**Next:** A1.4 — Skewness, Kurtosis & Transformasi

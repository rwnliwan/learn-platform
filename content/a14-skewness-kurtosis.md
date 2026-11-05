# A1.4: Skewness, Kurtosis & Transformasi Data

## Bentuk Distribusi Bercerita

Mean dan SD memberi tahu lokasi dan sebaran. Tapi **bentuk** distribusi memberi tahu cerita yang lebih dalam: apakah data miring? Apakah ada ekor tebal yang menyimpan risiko?

---

## 1. Skewness (Kemiringan)

$$\gamma_1 = \frac{1}{n}\sum_{i=1}^{n}\left(\frac{x_i - \bar{x}}{s}\right)^3$$

**Interpretasi:**
- $\gamma_1 = 0$: Simetris (normal)
- $\gamma_1 > 0$: Miring kanan (right skew) — ekor panjang di kanan
- $\gamma_1 < 0$: Miring kiri (left skew) — ekor panjang di kiri

**Contoh nyata:**
- **Pendapatan:** Miring kanan. Kebanyakan orang gaji UMR-10jt, sedikit yang 100jt+. Mean > median.
- **Usia pensiun:** Miring kiri. Kebanyakan pensiun 55-60, sedikit yang lebih awal.
- **Nilai ujian (mudah):** Miring kiri. Kebanyakan nilai tinggi, sedikit yang rendah.

**Implikasi:**
- Right skew → mean > median. Pakai median untuk "tipikal".
- Dalam risiko: right skew pada loss = bahaya (ekor kanan = loss besar).

---

## 2. Kurtosis (Ketajaman Ekor)

$$\gamma_2 = \frac{1}{n}\sum_{i=1}^{n}\left(\frac{x_i - \bar{x}}{s}\right)^4 - 3$$

(-3 agar normal = 0, disebut *excess kurtosis*)

**Interpretasi:**
- $\gamma_2 = 0$: Normal (mesokurtik)
- $\gamma_2 > 0$: Ekor tebal (leptokurtik) — lebih banyak outlier
- $\gamma_2 < 0$: Ekor tipis (platikurtik) — lebih sedikit outlier

**Contoh nyata:**
- **Return saham:** Leptokurtik. Crash -10% terjadi lebih sering dari prediksi normal.
- **Tinggi badan:** Mesokurtik (mendekati normal).

**Mengapa penting untuk risiko?**
Model normal underestimate kejadian ekstrem. Jika data leptokurtik tapi kamu pakai asumsi normal, kamu **meremehkan risiko**.

---

## 3. Transformasi Data

### Log Transform
$$y = \log(x)$$

**Kapan:** Data right-skewed positif (pendapatan, harga).

**Efek:** Menarik ekor kanan, membuat lebih simetris.

**Contoh:**
Pendapatan: 5jt, 8jt, 12jt, 50jt, 200jt (sangat skew)
Log: 15.4, 15.9, 16.3, 17.7, 19.1 (jauh lebih simetris)

**Catatan:** Hanya untuk x > 0. Untuk data dengan nol, pakai log(x+1).

### Square Root
$$y = \sqrt{x}$$

**Kapan:** Data count (jumlah kejadian). Lebih lembut dari log.

### Box-Cox
$$y = \frac{x^\lambda - 1}{\lambda}$$

**Kapan:** Cari transformasi optimal otomatis. λ=0 → log, λ=1 → tidak transform, λ=0.5 → sqrt.

---

## 4. Kapan Transformasi Dibutuhkan?

**Ya, transform jika:**
- Model asumsi normalitas (regresi linear)
- Skewness ekstrem (|γ₁| > 2)
- Ingin stabilkan variansi

**Tidak perlu jika:**
- Model nonparametrik / tree-based (tidak peduli distribusi)
- Interpretasi asli lebih penting
- Transformasi merusak makna bisnis

---

## Latihan

### Quiz 1
Data loss kredit: kebanyakan kecil, sedikit sangat besar. Skewness?

A. Negatif (miring kiri)
B. Nol (simetris)
C. Positif (miring kanan)
D. Tidak bisa ditentukan

<details>
<summary>Jawaban</summary>

**C. Positif.** Ekor panjang di kanan (loss besar). Ini pola umum data risiko.
</details>

### Quiz 2
Kamu pakai model normal untuk return saham (leptokurtik). Apa risikonya?

A. Overestimate risiko
B. Underestimate kejadian ekstrem
C. Tidak ada masalah
D. Model jadi lebih akurat

<details>
<summary>Jawaban</summary>

**B.** Ekor tebal = crash terjadi lebih sering dari prediksi normal. Model meremehkan risiko.
</details>

---

## Kesimpulan

1. **Skewness → pilih mean vs median.** Kurtosis → waspadai ekor tebal.
2. **Log transform untuk right-skew positif.**
3. **Jangan buta asumsi normal** — cek bentuk distribusi dulu.

**Next:** A1.5 — Kuantil, Boxplot & Deteksi Outlier

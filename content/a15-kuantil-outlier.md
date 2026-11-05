# A1.5: Kuantil, Boxplot & Deteksi Outlier

## Outlier: Musuh atau Sinyal?

Outlier bisa jadi:
- **Error:** Salah input (umur 250 tahun)
- **Sinyal:** Fraud, peluang, atau risiko yang belum terlihat

Membedakannya butuh metode sistematis, bukan "feeling".

---

## 1. Kuantil & Persentil

**Kuantil** membagi data menjadi bagian sama besar.

- **Kuartil:** 4 bagian (Q1=25%, Q2=median=50%, Q3=75%)
- **Desil:** 10 bagian
- **Persentil:** 100 bagian

**Contoh:** Skor 90 = persentil 95 → lebih tinggi dari 95% peserta.

**Rumus posisi persentil ke-p:**
$$\text{Posisi} = \frac{p}{100} \times (n+1)$$

---

## 2. Boxplot: Visual 5 Angka

Boxplot merangkum: min, Q1, median, Q3, max (atau outlier).

```
        ┌─────┐
        │     │  Q3 (75%)
  ──────┤     ├──────  Median (50%)
        │     │  Q1 (25%)
        └─────┘
    ●              Outlier
```

**Cara baca:**
- **Kotak:** 50% data tengah (IQR)
- **Garis tengah:** Median
- **Whisker:** Jangkauan data "normal"
- **Titik di luar:** Outlier

**Contoh interpretasi:**
Boxplot gaji dengan median di bawah tengah kotak → right skew (banyak gaji kecil, sedikit besar).

---

## 3. Metode Deteksi Outlier

### Metode 1: Z-Score
$$z = \frac{x - \bar{x}}{s}$$

**Aturan:** |z| > 3 → outlier.

**Contoh:** Mean=50, SD=10. Nilai 85 → z = 3.5 → outlier.

**Kelemahan:** Mean dan SD sendiri terpengaruh outlier! (masking effect)

### Metode 2: IQR
**Aturan Tukey:**
- Bawah: Q1 - 1.5 × IQR
- Atas: Q3 + 1.5 × IQR

Di luar ini → outlier.

**Contoh:** Q1=40, Q3=60, IQR=20
- Batas bawah: 40 - 30 = 10
- Batas atas: 60 + 30 = 90
- Nilai 95 → outlier. Nilai 5 → outlier.

**Kelebihan:** Robust (pakai kuartil, bukan mean/SD).

### Metode 3: MAD (Modified Z-Score)
$$M_i = \frac{0.6745 \times (x_i - \text{median})}{\text{MAD}}$$

**Aturan:** |M| > 3.5 → outlier.

**Kelebihan:** Paling robust. Cocok untuk data sangat kotor.

---

## 4. Perbandingan Metode

| Metode | Robust? | Kapan Pakai |
|--------|---------|-------------|
| Z-score | ❌ | Data bersih, normal |
| IQR | ✅ | Umum, eksplorasi cepat |
| MAD | ✅✅ | Data kotor, banyak outlier |

---

## 5. Setelah Deteksi, Apa?

**Jangan langsung hapus!** Investigasi dulu:

1. **Error?** (umur 250) → Perbaiki atau hapus, dokumentasikan.
2. **Valid tapi ekstrem?** (transaksi 1M) → Pertahankan, tapi gunakan metode robust.
3. **Sinyal fraud?** → Eskalasi ke tim fraud.

**Pilihan penanganan:**
- **Hapus:** Hanya jika terbukti error.
- **Winsorize:** Potong ke persentil 1%/99% (nilai ekstrem diganti batas).
- **Transform:** Log untuk kurangi pengaruh.
- **Biarkan:** Pakai model robust (median, IQR).

---

## Latihan

### Quiz 1
Q1=20, Q3=40. Berapa batas atas outlier (IQR method)?

A. 60
B. 70
C. 80
D. 100

<details>
<summary>Jawaban</summary>

**B. 70.** IQR = 20. Batas atas = 40 + 1.5×20 = 70.
</details>

### Quiz 2
Data ada banyak outlier. Metode deteksi terbaik?

A. Z-score
B. IQR
C. MAD
D. Range

<details>
<summary>Jawaban</summary>

**C. MAD.** Paling robust — tidak terpengaruh outlier lain (tidak ada masking effect).
</details>

---

## Kesimpulan

1. **Boxplot = ringkasan visual terbaik** untuk distribusi + outlier.
2. **IQR untuk umum, MAD untuk data kotor.**
3. **Investigasi sebelum hapus.** Outlier bisa jadi sinyal fraud.

**Next:** A1.6 — Korelasi (Pearson, Spearman, Kendall)

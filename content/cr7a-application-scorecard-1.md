# CR7a: Application Scorecard — Binning, WoE & IV (Part 1)


## Cerita: Menilai Tanpa Bertemu

Bank menerima 10.000 aplikasi/bulan. Tidak mungkin wawancara semua. **Scorecard** = menerjemahkan data aplikasi menjadi **skor** — konsisten, cepat, adil. Tapi sebelum regresi, data harus dipotong-potong: **binning**.

---

## 1. Binning

**Binning** = mengelompokkan variabel kontinu menjadi interval. Contoh: penghasilan → [<5jt, 5–10jt, >10jt]. Syarat: tiap bin **cukup isi** (>5% populasi) dan **monoton** terhadap risiko.

---

## 2. WoE (Weight of Evidence)

$$WoE = \ln\left(\frac{\%\ Good\ di\ bin}{\%\ Bad\ di\ bin}\right)$$

WoE positif = bin "aman", negatif = "berisiko". Mengubah kategori menjadi **angka bermakna risiko**.

---

## 3. IV (Information Value)

$$IV = \sum (\%\ Good - \%\ Bad) \times WoE$$

Kekuatan prediksi variabel: <0,02 tidak berguna; 0,1–0,3 sedang; >0,3 kuat (curigai overfit!).

---

## 4. Logistic Regression

$$P(default) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 x_1 + ...)}}$$

Regresi logistik = standar industri: output peluang 0–1, koefisien **dapat dijelaskan** ke regulator.

---

## Mini-case

Variabel "kode pos" IV = 0,45 (sangat kuat). Haruskah dipakai?

<details>
<summary>Jawaban</summary>

**Jangan langsung.** IV tinggi + kode pos = curigai **proxy discrimination** (CR24). Uji: apakah prediktif di luar korelasi wilayah/etnis? Jika tidak → buang.
</details>

---

## Quiz

### Quiz 1
WoE sebuah bin = −0,8. Artinya?

A. Bin aman
B. Bin berisiko — bad lebih terkonsentrasi di sini (WoE negatif = berbahaya)
C. Tidak ada informasi
D. Data salah

<details>
<summary>Jawaban</summary>

**B.** WoE negatif = proporsi bad lebih tinggi. Makin negatif makin merah.
</details>

### Quiz 2
IV 0,015. Keputusan?

A. Variabel bintang — pakai
B. Buang — di bawah 0,02, tidak prediktif
C. Pakai sendirian
D. Gabungkan paksa

<details>
<summary>Jawaban</summary>

**B.** IV < 0,02 = noise. Jangan paksakan variabel lemah ke model.
</details>

---

## Kesimpulan

1. **Binning → WoE → IV** = fondasi scorecard.
2. **WoE** mengubah kategori jadi bahasa risiko.
3. **Logistik** = standar karena explainable.

**Next:** CR7b — Skoring, Cut-off & Monitoring (Part 2)

# A1.6: Korelasi — Pearson, Spearman, Kendall & Jebakannya

## Korelasi ≠ Kausalitas (Tapi Tetap Berguna)

"Es krim dan tenggelam berkorelasi tinggi!" — karena keduanya naik saat musim panas. Korelasi tidak membuktikan sebab-akibat, tapi tetap berguna untuk:
- Feature selection (variabel mana yang berhubungan dengan target?)
- Deteksi multikolinearitas (variabel yang redundan)
- Risk: korelasi antar aset menentukan diversifikasi

---

## 1. Pearson (r)

$$r = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum(x_i - \bar{x})^2 \sum(y_i - \bar{y})^2}}$$

**Mengukur:** Hubungan **linear**.

**Rentang:** -1 (negatif sempurna) hingga +1 (positif sempurna). 0 = tidak ada hubungan linear.

**Contoh:**
- Tinggi vs berat: r ≈ 0.8 (positif kuat)
- Harga vs permintaan: r ≈ -0.7 (negatif kuat)

**Syarat:** Data interval/rasio, hubungan linear, tidak ada outlier ekstrem.

**Kelemahan:** Buta terhadap hubungan non-linear!

---

## 2. Spearman (ρ)

Ubah data jadi **ranking**, lalu hitung Pearson dari ranking.

**Mengukur:** Hubungan **monotonik** (tidak harus linear).

**Contoh:**
x: 1, 2, 3, 4, 5
y: 1, 4, 9, 16, 25 (kuadrat — non-linear!)

- Pearson: r ≈ 0.98 (tinggi tapi tidak sempurna karena non-linear)
- Spearman: ρ = 1.0 (sempurna! karena monotonik naik)

**Kapan pakai:** Data ordinal, atau hubungan monotonik non-linear.

---

## 3. Kendall (τ)

Hitung pasangan **konkordan** (searah) vs **diskordan** (berlawanan).

$$\tau = \frac{\text{konkordan} - \text{diskordan}}{\text{total pasangan}}$$

**Kapan pakai:** Sampel kecil, banyak ties (nilai sama). Lebih robust dari Spearman.

---

## 4. Perbandingan

| | Pearson | Spearman | Kendall |
|---|---|---|---|
| Hubungan | Linear | Monotonik | Monotonik |
| Data | Interval/Rasio | Ordinal+ | Ordinal+ |
| Outlier | Sensitif | Robust | Sangat robust |
| Sampel kecil | OK | OK | Terbaik |

---

## 5. Jebakan Korelasi

### Anscombe's Quartet
Empat dataset dengan **statistik identik**:
- Mean x = 9, mean y = 7.5
- Pearson r = 0.816
- Regresi sama persis

Tapi scatterplot-nya **sangat beda**: satu linear, satu kurva, satu dengan outlier, satu vertikal!

**Pelajaran:** Selalu plot data. Angka saja menipu.

### Simpson's Paradox
Korelasi di level agregat **berlawanan** dengan korelasi per grup.

**Contoh:** Obat vs kesembuhan.
- Agregat: obat berkorelasi negatif dengan sembuh (terlihat buruk!)
- Per grup usia: obat positif di setiap grup usia

Penjelasan: pasien lebih sakit (dan lebih tua) cenderung diberi obat. Usia adalah confounder.

### Korelasi Spurious
Dua hal berkorelasi tanpa hubungan logis (common cause atau kebetulan).

**Contoh klasik:** Konsumsi keju vs kematian terlilit sprei (r=0.95!). Keduanya naik seiring populasi/waktu.

---

## 6. Korelasi dalam Risiko

**Diversifikasi portofolio:**
- Korelasi rendah/negatif antar aset → risiko portofolio turun
- Krisis 2008: korelasi yang "rendah" tiba-tiba jadi tinggi (correlation breakdown)

**Peringatan:** Korelasi Pearson asumsi linear dan stabil. Dalam krisis, korelasi berubah!

---

## Latihan

### Quiz 1
Hubungan y = x² untuk x positif. Korelasi terbaik?

A. Pearson (linear)
B. Spearman (monotonik)
C. Keduanya sama
D. Tidak ada korelasi

<details>
<summary>Jawaban</summary>

**B. Spearman.** Hubungan monotonik naik tapi non-linear. Pearson underestimate.
</details>

### Quiz 2
Apa pelajaran dari Anscombe's Quartet?

A. Korelasi selalu akurat
B. Selalu visualisasikan data
C. Mean tidak penting
D. Outlier tidak masalah

<details>
<summary>Jawaban</summary>

**B.** Statistik identik bisa menyembunyikan pola sangat beda. Plot dulu!
</details>

---

## Kesimpulan

1. **Pearson untuk linear, Spearman/Kendall untuk monotonik.**
2. **Selalu plot.** Anscombe membuktikan angka saja tidak cukup.
3. **Waspadai Simpson & spurious.** Korelasi butuh konteks.

**Next:** A1.7 — Missing Data & Imputasi

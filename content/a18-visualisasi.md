# A1.8: Memilih Visualisasi yang Tepat

## Chart yang Salah = Kebohongan Visual

Pie chart dengan 20 slice. Bar chart dengan sumbu Y tidak mulai dari nol. Line chart untuk data kategori.

Visualisasi yang salah lebih berbahaya dari tidak ada visualisasi — karena terlihat meyakinkan.

---

## 1. Prinsip Dasar

### Pilih Berdasarkan Tujuan

| Tujuan | Chart |
|--------|-------|
| Perbandingan kategori | Bar chart (horizontal jika label panjang) |
| Tren waktu | Line chart |
| Distribusi | Histogram, boxplot, density |
| Hubungan 2 variabel | Scatterplot |
| Komposisi | Stacked bar (bukan pie jika >5 kategori!) |
| Peta | Choropleth (waspadai bias populasi) |

### Aturan Emas

1. **Sumbu Y mulai dari nol** untuk bar chart. (Line chart boleh tidak, tapi beri anotasi.)
2. **Jangan pakai pie > 5 slice.** Manusia buruk bandingkan sudut.
3. **Satu chart, satu pesan.** Kalau butuh 3 paragraf menjelaskan chart, chart-nya gagal.
4. **Label langsung**, jangan pakai legend jika bisa.

---

## 2. Jebakan Umum

### Sumbu Terpotong
Bar chart dengan Y mulai dari 50 membuat perbedaan 51 vs 52 terlihat 2x lipat!

### Dual Axis Menyesatkan
Dua sumbu Y dengan skala berbeda bisa "membuktikan" apapun.

### 3D Chart
Distorsi perspektif. Tidak pernah dibutuhkan. Jangan pakai.

### Warna Pelangi
Gunakan warna sekuensial untuk numerik, diverging untuk deviasi, kategorikal secukupnya.

---

## 3. Untuk Data Risiko

- **Waterfall:** Attribution P&L (apa yang menggerakkan hasil?)
- **Heatmap:** Korelasi matriks, vintage analysis
- **Cumulative:** Loss distribution, backtesting

---

## Latihan

### Quiz 1
Bandingkan penjualan 15 produk. Chart terbaik?

A. Pie chart 15 slice
B. Horizontal bar chart, urut terbesar-terkecil
C. 3D pie chart
D. Line chart

<details>
<summary>Jawaban</summary>

**B.** Bar horizontal mudah dibaca, urutan membantu. Pie 15 slice tidak terbaca.
</details>

---

## Kesimpulan

1. **Tujuan dulu, chart kemudian.**
2. **Y dari nol untuk bar. Jangan 3D. Pie maksimal 5.**
3. **Satu chart satu pesan.**

**Next:** A1.9 — EDA End-to-End (Studi Kasus)

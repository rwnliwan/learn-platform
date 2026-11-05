# CR19: Validasi Model — 4 Pilar


## Cerita: Siapa Mengawasi Pengawas?

Model memutuskan Rp triliun kredit. **Siapa memastikan modelnya benar?** Validasi independen = **rem** atas gas model. Tanpa itu: model rusak = bank rusak.

---

## 1. Empat Pilar Validasi

1. **Evaluasi konseptual** — logika & asumsi masuk akal?
2. **Verifikasi proses** — data & kode benar?
3. **Backtest** — prediksi vs aktual (kalibrasi, Gini).
4. **Benchmark** — bandingkan model alternatif.

---

## 2. Hosmer-Lemeshow

Uji **kalibrasi**: bagi prediksi ke 10 grup → bandingkan default aktual vs ekspektasi per grup. p-value kecil = **miskalibrasi**.

---

## 3. PSI (Stabilitas)

$$PSI > 0{,}25 \Rightarrow \text{population shift}$$

Model yang populasinya bergeser = **kedaluwarsa** — rebuild.

---

## 4. Independensi & SR 11-7

Validasi oleh **unit independen** (bukan pembuat model). Standar global: **SR 11-7** (Federal Reserve) — dokumentasi, uji, governance.

---

## Mini-case

Model Gini 0,5 tapi HL test p-value 0,01. Layak pakai?

<details>
<summary>Jawaban</summary>

**Belum.** Gini = daya beda OK; HL gagal = **miskalibrasi** (probabilitasnya salah). Perbaiki kalibrasi dulu — keputusan memakai PD absolut.
</details>

---

## Quiz

### Quiz 1
Hosmer-Lemeshow menguji?

A. Diskriminasi
B. Kalibrasi — apakah PD prediksi cocok dengan default aktual per grup
C. Kecepatan
D. Biaya

<details>
<summary>Jawaban</summary>

**B.** Gini = ranking; HL = kebenaran angka. Keduanya perlu.
</details>

### Quiz 2
Mengapa validasi harus independen?

A. Formalitas
B. Pembuat model bias membela karyanya — "penjual menilai dagangannya" tidak objektif
C. Agar lama
D. Syarat ISO

<details>
<summary>Jawaban</summary>

**B.** Independensi = syarat mutlak. Three lines of defense.
</details>

---

## Kesimpulan

1. **4 pilar:** konsep, proses, backtest, benchmark.
2. **HL** = kalibrasi; **PSI** = stabilitas.
3. **Independen** = non-negotiable.

**Next:** CR20 — Monitoring & KRI

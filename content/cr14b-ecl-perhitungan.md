# CR14b: Perhitungan ECL End-to-End (Part 2)


## Cerita: Dari Teori ke Jurnal

CR14a memberi kerangka. Kini: **hitung** ECL sebuah kredit, **catat jurnalnya**, dan **uji sensitivitasnya**. Inilah pekerjaan bulanan tim akuntansi risiko.

---

## 1. Langkah Perhitungan

1. Tentukan **stage** (SICR? default?).
2. Proyeksikan **PD per tahun** (marginal), **LGD**, **EAD** (amortisasi).
3. Kalikan per tahun → **diskon** → jumlahkan.
4. **Bobot skenario** makro.

$$ECL = \sum_{t} w_{skenario} \times PD_t \times LGD_t \times EAD_t \times DF_t$$

---

## 2. Jurnal Akuntansi

- Pembentukan: **Dr Beban CKPN / Cr CKPN** (cadangan naik, laba turun).
- Write-off: **Dr CKPN / Cr Kredit** (NPL turun, cadangan turun).

---

## 3. Sensitivitas

ECL sensitif terhadap: **PD** (skenario makro), **LGD** (agunan), **staging** (cliff effect). Uji ±: PD +50% → ECL naik berapa?

---

## 4. Backtest

Bandingkan **ECL lalu** vs **kerugian aktual kini**. ECL konsisten di bawah aktual = **model optimis** → kalibrasi ulang.

---

## Mini-case

ECL Stage 1 Rp 100 jt. Pindah Stage 2 (tenor 5 thn, PD tahunan 2%). Estimasi ECL baru?

<details>
<summary>Jawaban</summary>

Lifetime ≈ 5 × Rp 100 jt (kasar, sebelum diskonto/amortisasi) ≈ **Rp 400–500 jt** — naik 4–5×. Inilah cliff effect yang harus dijelaskan ke direksi.
</details>

---

## Quiz

### Quiz 1
Jurnal pembentukan CKPN Rp 1 M?

A. Dr Kredit / Cr Kas
B. Dr Beban CKPN / Cr CKPN — laba turun Rp 1 M
C. Dr Modal / Cr Kredit
D. Tidak ada jurnal

<details>
<summary>Jawaban</summary>

**B.** Cadangan = beban kini untuk kerugian masa depan. Laba langsung tergerus.
</details>

### Quiz 2
Backtest: ECL 2024 Rp 500 M, aktual 2025 Rp 800 M. Artinya?

A. Model bagus
B. Model optimis/understated — kalibrasi ulang (PD/LGD/scenario weight)
C. Normal
D. Naikkan suku bunga

<details>
<summary>Jawaban</summary>

**B.** Backtest = cermin. Selisih besar = model perlu diperbaiki, bukan disembunyikan.
</details>

---

## Kesimpulan

1. **ECL** = jumlahkan per tahun, diskon, bobot skenario.
2. **Jurnal:** Dr Beban / Cr CKPN.
3. **Backtest** = disiplin kejujuran model.

**Next:** CR15 — Risiko Portofolio

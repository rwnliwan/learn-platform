# CR4b: IFRS 9 / PSAK 71 — ECL & Staging


## Cerita: Menunggu Tabrakan

Aturan lama (PSAK 55): cadangan dibentuk **setelah** kerugian terjadi — seperti memasang sabuk pengaman **setelah** tabrakan. Krisis 2008 membuktikan ini terlambat. **PSAK 71** (IFRS 9) membalik logika: cadangkan **sebelum** macet, berdasar **ekspektasi**.

---

## 1. Tiga Stage

| Stage | Kriteria | ECL |
|---|---|---|
| 1 | Lancar, tanpa SICR | 12 bulan |
| 2 | SICR (Significant Increase in Credit Risk) | Lifetime |
| 3 | Sudah default/macet | Lifetime |

---

## 2. SICR & Cliff Effect

**SICR** = risiko naik signifikan sejak awal (misal: DPD 30+, rating turun 2 notch). Pindah Stage 1→2 = ECL melonjak dari 12 bulan ke **lifetime** — inilah **cliff effect**: cadangan bisa naik 3–5× dalam sekejap.

---

## 3. ECL Formula

$$ECL = \sum_t PD_t \times LGD_t \times EAD_t \times DF_t$$

Dibobot **skenario makro** (forward-looking): ECL = 40%×skenario baik + 40%×dasar + 20%×buruk.

---

## Mini-case

Debitur DPD 35 hari (sebelumnya lancar). Analis ragu pindahkan ke Stage 2 ("nanti saja kalau 90 hari"). Apa risikonya?

<details>
<summary>Jawaban</summary>

DPD 30+ adalah **backstop SICR**. Menunda = ECL understated + cliff effect tertunda (ledakan nanti lebih besar). PSAK 71 menghukum penundaan.
</details>

---

## Quiz

### Quiz 1
Apa pemicu utama pindah Stage 1 → Stage 2?

A. Sudah macet (kolek 5)
B. SICR — kenaikan risiko signifikan, misal DPD 30+ atau rating turun tajam
C. Permintaan direksi
D. Akhir tahun

<details>
<summary>Jawaban</summary>

**B.** Stage 2 = belum macet tapi memburuk. Macet = Stage 3.
</details>

### Quiz 2
Cliff effect adalah?

A. Tebing di pantai
B. Lonjakan ECL saat pindah Stage 1→2 (12 bulan → lifetime) — bisa 3–5× lipat
C. Penurunan suku bunga
D. Efek domino

<details>
<summary>Jawaban</summary>

**B.** Inilah mengapa SICR harus tepat waktu — menunda memperbesar ledakan.
</details>

---

## Kesimpulan

1. **PSAK 71:** cadangkan ekspektasi, bukan realisasi.
2. **3 stage** berdasar SICR & default.
3. **Cliff effect** menghukum penundaan.

**Next:** CR5 — Definisi Default

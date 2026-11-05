# CR10: Pemodelan PD — TTC vs PIT & Kalibrasi


## Cerita: Ramalan Cuaca vs Iklim

"Iklim Jakarta: hujan 150 hari/tahun" (jangka panjang) vs "besok 80% hujan" (kondisi kini). **TTC** = iklim (through-the-cycle, stabil). **PIT** = cuaca besok (point-in-time, responsif). Keduanya benar — untuk **tujuan berbeda**.

---

## 1. TTC vs PIT

- **TTC** — PD rata-rata siklus ekonomi. Untuk **modal** (Basel) — stabil, tidak procyclical.
- **PIT** — PD kondisi kini. Untuk **ECL/PSAK 71** — forward-looking, responsif.

---

## 2. Master Scale

**Master scale** = tangga rating internal (AAA–D) dengan **PD terkalibrasi** tiap anak tangga. Memetakan skor → rating → PD.

---

## 3. Kalibrasi

**Kalibrasi** = memastikan PD prediksi ≈ default aktual per rating. Diuji dengan **binomial test**: jika PD 2% tapi default 5% → **under-calibrated** → perbaiki.

---

## 4. Lifetime PD

$$PD_{lifetime} = 1 - \prod_t (1 - PD_t)$$

Untuk **Stage 2** (PSAK 71): PD kumulatif sepanjang sisa tenor — selalu > PD 12 bulan.

---

## Mini-case

PD TTC 2%, PD PIT 5% (resesi). Untuk ECL pakai yang mana? Untuk modal?

<details>
<summary>Jawaban</summary>

**ECL → PIT 5%** (mencerminkan kondisi kini, PSAK 71). **Modal → TTC 2%** (stabil, hindari procyclicality Basel).
</details>

---

## Quiz

### Quiz 1
Untuk ECL PSAK 71, PD yang dipakai?

A. TTC — stabil
B. PIT — forward-looking, mencerminkan kondisi kini
C. Selalu 5%
D. Random

<details>
<summary>Jawaban</summary>

**B.** ECL = ekspektasi kini → PIT. Modal = TTC.
</details>

### Quiz 2
Rating PD 2%, aktual default 5%. Artinya?

A. Kalibrasi bagus
B. Under-calibrated — model meremehkan; perbaiki mapping/kalibrasi
C. Over-calibrated
D. Normal

<details>
<summary>Jawaban</summary>

**B.** Prediksi < realisasi = under. Kalibrasi = janji model harus ditepati data.
</details>

---

## Kesimpulan

1. **TTC** untuk modal; **PIT** untuk ECL.
2. **Master scale** = skor → rating → PD.
3. **Kalibrasi** diuji vs aktual; **lifetime PD** untuk Stage 2.

**Next:** CR11 — Forward-Looking

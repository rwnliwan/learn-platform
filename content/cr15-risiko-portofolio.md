# CR15: Risiko Portofolio — Konsentrasi & Credit VaR


## Cerita: Semua Telur di Properti

Bank A: 100 debitur Rp 1 M tersebar. Bank B: 1 debitur Rp 100 M properti. Keduanya "Rp 100 M" — tapi Bank B bisa **mati** oleh satu kejadian. **Konsentrasi** = risiko yang tidak terlihat di total.

---

## 1. HHI (Herfindahl-Hirschman Index)

$$HHI = \sum_i s_i^2$$

$s_i$ = pangsa tiap debitur/sektor. HHI 0 = tersebar sempurna; 1 = satu nama. Makin tinggi = makin terkonsentrasi.

---

## 2. Korelasi Default & Vasicek

Default **berkorelasi**: resesi menjatuhkan banyak debitur bersamaan. **Model Vasicek** (satu faktor) = standar Basel untuk modal risiko kredit.

---

## 3. Credit VaR

**Credit VaR 99,9%** = kerugian maksimum dengan keyakinan 99,9% — **inilah dasar modal** (UL). Bukan rata-rata, melainkan **ekor**.

---

## Mini-case

Sektor properti = 40% portofolio. Harga properti turun 20%. Apa yang terjadi?

<details>
<summary>Jawaban</summary>

**Korelasi membunuh:** 40% portofolio terpukul bersamaan → default serentak + LGD naik (agunan jatuh). Inilah yang diukur HHI + stress test sektoral (CR16).
</details>

---

## Quiz

### Quiz 1
HHI 0,02 vs 0,25. Mana lebih terkonsentrasi?

A. 0,02
B. 0,25 — mendekati 1 = terkonsentrasi
C. Sama
D. Tidak bisa dibandingkan

<details>
<summary>Jawaban</summary>

**B.** HHI = jumlah kuadrat pangsa. 0,25 ≈ satu nama dominan.
</details>

### Quiz 2
Mengapa korelasi default penting untuk modal?

A. Tidak penting
B. Default serentak (krisis) = kerugian ekor — modal dihitung dari VaR 99,9%, bukan rata-rata
C. Agar laporan tebal
D. Syarat marketing

<details>
<summary>Jawaban</summary>

**B.** Rata-rata menipu; krisis = ekor. Modal = untuk ekor.
</details>

---

## Kesimpulan

1. **HHI** = ukuran konsentrasi.
2. **Korelasi** = default datang berombongan.
3. **Credit VaR** = dasar modal (ekor, bukan rata-rata).

**Next:** CR16 — Stress Testing

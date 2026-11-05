# CR7b: Application Scorecard — Skoring, Cut-off & Monitoring (Part 2)


## Cerita: Dari Peluang ke Keputusan

Model berkata "PD 8%". Lalu? **Terima atau tolak?** Lesson ini: mengubah peluang menjadi **skor**, menetapkan **cut-off**, dan **memantau** model yang menua.

---

## 1. PDO Scaling

$$Skor = Offset + Faktor \times \ln(odds)$$

**PDO** (Points to Double Odds) = berapa poin untuk melipatgandakan odds baik:buruk. PDO 20 → skor 700 = 2× lebih aman dari 680. Skor = **bahasa bisnis** dari peluang.

---

## 2. Cut-off

Cut-off = skor minimum untuk ACC. Trade-off: cut-off tinggi → **sedikit default tapi sedikit bisnis**; rendah → sebaliknya. Ditetapkan dari **risk appetite + pricing** (CR21).

---

## 3. KS & Gini

**KS** = jarak maksimum distribusi good vs bad. **Gini** = 2×AUC − 1. Gini 0,4–0,6 = bagus untuk retail.

---

## 4. Monitoring: PSI

$$PSI = \sum (Aktual\% - Ekspektasi\%) \times \ln\frac{Aktual\%}{Ekspektasi\%}$$

**PSI** = apakah populasi berubah? PSI > 0,25 = **population shift** → model menua → rebuild.

---

## Mini-case

Gini 0,55 tapi PSI 0,35. Model bagus atau rusak?

<details>
<summary>Jawaban</summary>

**Rusak (menua).** Gini = daya beda masih OK, tapi PSI > 0,25 = populasi BERGESER — skor tidak lagi berarti sama. Rebuild/rekalibrasi segera.
</details>

---

## Quiz

### Quiz 1
PDO 20, skor 700. Skor berapa yang odds-nya 2× lipat?

A. 680
B. 720
C. 700
D. 740

<details>
<summary>Jawaban</summary>

**B.** PDO 20 = 20 poin melipatgandakan odds. 700 + 20 = 720.
</details>

### Quiz 2
Cut-off diturunkan. Dampak?

A. Default turun, bisnis turun
B. Bisnis naik, default naik — trade-off abadi cut-off
C. Tidak ada dampak
D. Model rusak

<details>
<summary>Jawaban</summary>

**B.** Cut-off = keran. Longgarkan = volume naik + risiko naik. Ditetapkan dari appetite.
</details>

---

## Kesimpulan

1. **Skor (PDO)** = bahasa bisnis peluang.
2. **Cut-off** = trade-off volume vs risiko.
3. **PSI > 0,25** = model menua.

**Next:** CR8 — Reject Inference

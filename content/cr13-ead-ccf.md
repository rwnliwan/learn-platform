# CR13: EAD & CCF — Eksposur Saat Default


## Cerita: Tamu yang Menambah Porsi

Kartu kredit limit Rp 50 jt, terpakai Rp 10 jt. Saat default, tagihan = **Rp 45 jt** — nasabah **menarik** limit sebelum macet! **EAD** = eksposur **saat** default, bukan saat ini.

---

## 1. CCF (Credit Conversion Factor)

$$EAD = Tertarik + CCF \times Belum\ tertarik$$

$$CCF = \frac{EAD - Tertarik}{Limit - Tertarik}$$

CCF = % sisa limit yang **akan ditarik** sebelum default. Kartu kredit: ~40–60%.

---

## 2. Utilisasi

Makin tinggi utilisasi menjelang default → CCF makin tinggi. **EWS** (CR9): utilisasi melonjak = tarikan sebelum badai.

---

## 3. EAD untuk Term Loan

Term loan (KPR, KI): EAD ≈ **outstanding** (tidak ada tarikan tambahan) — sederhana.

---

## Mini-case

Limit 50jt, terpakai 10jt, CCF 50%. EAD?

<details>
<summary>Jawaban</summary>

EAD = 10jt + 50% × 40jt = **Rp 30 jt**. Bukan 10jt (saat ini), bukan 50jt (limit penuh).
</details>

---

## Quiz

### Quiz 1
Mengapa EAD > outstanding untuk revolving?

A. Bunga
B. Nasabah cenderung menarik limit sebelum default (distress) — CCF menangkap perilaku ini
C. Kesalahan sistem
D. Inflasi

<details>
<summary>Jawaban</summary>

**B.** EAD mengantisipasi "tarikan terakhir" sebelum karam.
</details>

### Quiz 2
CCF 0% artinya?

A. Tidak ada limit
B. Sisa limit tidak akan ditarik (misal: fasilitas committed dicabut / term loan)
C. EAD = 0
D. Default pasti

<details>
<summary>Jawaban</summary>

**B.** CCF 0% = tidak ada tarikan tambahan. Umum untuk term loan.
</details>

---

## Kesimpulan

1. **EAD** = eksposur saat default (bukan kini).
2. **CCF** = % sisa limit yang ditarik.
3. Term loan: EAD ≈ outstanding.

**Next:** CR14a — ECL & Staging

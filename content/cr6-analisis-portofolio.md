# CR6: Analisis Portofolio — Vintage, Roll Rate & SQL


## Cerita: Dokter Portofolio

Dokter tidak mendiagnosis dari satu pasien — ia melihat **pola populasi**. Analis portofolio sama: vintage, roll rate, flow rate = **rontgen** kesehatan ribuan kredit sekaligus.

---

## 1. Vintage (MOB) Analysis

**Vintage** = kelompokkan kredit berdasar **bulan pencairan** (Month on Book). Lacak NPL tiap vintage seiring umur. Vintage 2024 yang NPL-nya naik cepat = **kebijakan underwriting 2024 bermasalah**.

---

## 2. Roll Rate & Flow Rate

$$Roll\ rate_{i \to j} = \frac{\text{saldo pindah bucket i ke j}}{\text{saldo bucket i}}$$

**Roll rate** = % saldo yang **memburuk** ke bucket berikutnya. **Flow rate** = versi bersih (dikurangi yang sembuh). Naiknya roll rate DPD 30→60 = **alarm dini**.

---

## 3. Static Pool

**Static pool** = vintage yang **dikunci** (tidak tambah akun baru) — mengukur murni kualitas underwriting tanpa polusi pertumbuhan.

---

## Mini-case

Vintage Q1-2024 NPL 5% di MOB 12; vintage Q1-2023 NPL 2% di MOB 12. Kesimpulan?

<details>
<summary>Jawaban</summary>

**Underwriting 2024 lebih buruk** (atau segmen berubah). Bandingkan di MOB yang sama — itulah gunanya vintage. Selidiki: cut-off dilonggarkan? Segmen baru?
</details>

---

## Quiz

### Quiz 1
Roll rate DPD 30→60 naik 15% → 25%. Artinya?

A. Membaik
B. Alarm: debitur menunggak makin sulit sembuh — selidiki sebab (ekonomi? kebijakan?)
C. Tidak berarti apa-apa
D. Langsung write-off

<details>
<summary>Jawaban</summary>

**B.** Roll rate = termometer arus pemburukan. Naik = masalah mengalir deras.
</details>

### Quiz 2
Mengapa static pool "dikunci"?

A. Agar rapi
B. Mengisolasi kualitas underwriting dari efek pertumbuhan akun baru
C. Syarat OJK
D. Menghemat storage

<details>
<summary>Jawaban</summary>

**B.** Akun baru (DPD 0) mengencerkan NPL — static pool mencegah ilusi.
</details>

---

## Kesimpulan

1. **Vintage** = rontgen per angkatan pencairan.
2. **Roll rate** = alarm dini arus pemburukan.
3. **Static pool** = kualitas murni tanpa polusi.

**Next:** CR7a — Application Scorecard (Part 1)

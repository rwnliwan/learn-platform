# CR5: Definisi Default & Jendela Observasi


## Cerita: Kapan Dinyatakan Gagal?

Atlet dinyatakan gugur setelah 3x gagal angkat — aturannya jelas. Debitur? Bank butuh definisi **default** yang konsisten, kalau tidak: model PD melatih data yang definisinya berubah-ubah = sampah.

---

## 1. Definisi Default Basel

Default jika **salah satu** terjadi:
1. **DPD 90+** (kewajiban material), atau
2. **Unlikely to pay** — bank menilai tidak akan dibayar penuh tanpa eksekusi agunan (misal: restrukturisasi paksa, kebangkrutan).

---

## 2. Observation vs Performance Window

- **Observation window** = periode sifat debitur diamati (misal: 12 bulan perilaku).
- **Performance window** = periode ke depan dilihat apakah default (misal: 12 bulan berikutnya).

---

## 3. Right-Censoring

Akun yang **belum selesai diamati** (baru 6 bulan dari 12) = **censored** — tidak boleh dianggap "tidak default" penuh. Abaikan ini = PD **understated**.

---

## Mini-case

Model PD dilatih dengan akun 2024 (baru 6 bulan) diberi label "tidak default". Apa masalahnya?

<details>
<summary>Jawaban</summary>

**Right-censoring diabaikan.** Akun 6 bulan belum melewati jendela 12 bulan — bisa default di bulan 7–12. Label "sehat" = salah → PD understated → ECL kurang.
</details>

---

## Quiz

### Quiz 1
Debitur DPD 60 hari tapi bank sudah yakin tidak akan bayar (usaha bangkrut). Status?

A. Belum default — tunggu 90 hari
B. Default via "unlikely to pay" — DPD 90 bukan satu-satunya kriteria
C. Lancar
D. Stage 1 selamanya

<details>
<summary>Jawaban</summary>

**B.** Unlikely to pay = default meski DPD < 90. Definisi Basel punya dua pintu.
</details>

### Quiz 2
Apa itu right-censoring?

A. Data dihapus
B. Akun yang periode pengamatannya belum selesai — tidak boleh dilabeli final
C. Sensor kamera
D. Data rahasia

<details>
<summary>Jawaban</summary>

**B.** Censored = "belum tahu". Memaksakan label = bias.
</details>

---

## Kesimpulan

1. **Default** = DPD 90+ ATAU unlikely to pay.
2. **Observation** (sifat) vs **performance** (hasil).
3. **Censoring** harus ditangani — jangan labeli prematur.

**Next:** CR6 — Analisis Portofolio & SQL

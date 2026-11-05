# CR8: Reject Inference — Bias Seleksi


## Cerita: Survei Kepuasan yang Menipu

Restoran survei "kepuasan pelanggan" — hanya ke yang **datang kembali**. Yang kecewa tidak kembali = tidak disurvei. Hasil: 95% puas! **Sampelnya bias.** Model kredit punya masalah identik: hanya belajar dari yang **diterima**.

---

## 1. Selection Bias

Model dilatih dari **accepted only** — yang ditolak (cenderung lebih berisiko) **tidak terlihat**. Model meremehkan risiko populasi penuh.

---

## 2. Empat Metode

1. **Augmentation** — boboti accepted yang mirip rejected.
2. **Parceling** — asumsikan default rate rejected = x× accepted.
3. **Fuzzy** — label probabilistik untuk rejected.
4. **Heckman** — model seleksi dua tahap (ekonometrik).

---

## 3. Augmentation (Praktis)

Beri **bobot lebih** pada accepted yang "mirip" profil rejected (skor rendah). Murah, transparan, cukup untuk kebanyakan kasus.

---

## Mini-case

Model tanpa reject inference punya Gini 0,5 di accepted, tapi default aktual 2× lipat. Penjelasannya?

<details>
<summary>Jawaban</summary>

**Selection bias.** Model tidak pernah melihat rejected yang berisiko — Gini di sampel bias menipu. Perlu reject inference atau cut-off konservatif.
</details>

---

## Quiz

### Quiz 1
Mengapa model "accepted only" meremehkan risiko?

A. Data kurang
B. Sampel bias: yang ditolak (lebih berisiko) tidak ada di data latih — model buta terhadap ekor risiko
C. Komputer lambat
D. Variabel salah

<details>
<summary>Jawaban</summary>

**B.** Seperti survei restoran — yang kecewa tidak terjaring sampel.
</details>

### Quiz 2
Metode reject inference PALING sederhana?

A. Heckman
B. Augmentation — boboti accepted yang mirip rejected
C. Deep learning
D. Hapus data

<details>
<summary>Jawaban</summary>

**B.** Augmentation: murah, transparan, cukup untuk praktik.
</details>

---

## Kesimpulan

1. **Accepted-only = bias** — rejected tak terlihat.
2. **4 metode:** augmentation termudah.
3. Tanpa koreksi → risiko understated.

**Next:** CR9 — Behavioral Scorecard

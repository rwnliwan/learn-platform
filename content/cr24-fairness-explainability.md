# CR24: Fairness & Explainability Model


## Cerita: Dua Sahabat, Satu Penolakan

Rina diterima, Sari ditolak — data sama, beda **kode pos**. Model tak berniat jahat, tapi **mendiskriminasi via proxy**. Dan bank menjawab protes: "keputusan sistem." Dua kegagalan: **tidak adil + tidak bisa dijelaskan**.

---

## 1. Disparate Impact & Aturan 80%

$$\frac{Approval\ minoritas}{Approval\ mayoritas} < 0{,}8 \Rightarrow investigasi$$

Rasio < 0,8 = **picu investigasi** (bukan vonis): bias model atau beda risiko riil?

---

## 2. Proxy Discrimination

**Proxy** = variabel pengganti atribut sensitif: kode pos (etnis/wilayah), pekerjaan (gender). **Fairness through unawareness gagal** — menghapus variabel SARA tidak cukup.

---

## 3. Explainability (SHAP)

**SHAP** = kontribusi tiap fitur (+/−) terhadap skor. **Adverse action notice**: tiap penolakan = 2–3 alasan spesifik yang **bisa ditindaklanjuti** nasabah.

---

## Mini-case

Gini 0,5 tapi rasio approval 0,50 + kode pos IV tertinggi. Tindakan?

<details>
<summary>Jawaban</summary>

**Bekukan + bedah proxy.** Gini bagus ≠ boleh dipakai. Uji tanpa kode pos: Gini 0,45→0,43 tapi rasio →0,85 = tukar. Bangun fairness test otomatis.
</details>

---

## Quiz

### Quiz 1
Rasio approval 0,74. Artinya?

A. Diskriminasi terbukti
B. Investigasi wajib — bedakan bias model vs risiko riil
C. Aman
D. Naikkan manual

<details>
<summary>Jawaban</summary>

**B.** < 0,8 = bertanya, bukan memvonis. Tapi wajib dijawab.
</details>

### Quiz 2
Nasabah ditolak. Respons benar?

A. "Keputusan sistem"
B. Adverse action notice: alasan spesifik + actionable
C. Diam
D. Terima semua

<details>
<summary>Jawaban</summary>

**B.** Hak nasabah = tahu alasan. Jika tak bisa dijelaskan ke nasabah, tak bisa dipertahankan ke OJK.
</details>

---

## Kesimpulan

1. **Rasio < 0,8** = investigasi.
2. **Proxy** = diskriminasi bertopeng.
3. **Tiap tolak = alasan spesifik.**

**Next:** CR25 — Capstone

# Review DeepSeek — Modul M2 "Supervised / credit scoring" (Learn v2)

**Tanggal:** 12 November 2026, ~14:44–15:05 WITA
**Reviewer:** DeepSeek (`deepseek-v4.1-flash`) via Kelontong AI — 1 panggilan, streaming, tanpa fallback.
**Scope:** 5 lesson TS (`mlf-m21` s.d. `mlf-m25`) + 5 `.md` ringkas + 5 notebook guided-task + notebook kanonis credit scoring.
**Verdict: APPROVE-WITH-FIXES**

## Ringkasan

Struktur, alur, dan hampir semua angka kanonis terverifikasi ulang (WoE/IV, poin scorecard, confusion matrix, ECL staging, simulasi reject inference — semuanya konsisten secara aritmetika). Ada **satu angka salah** (total transisi roll-rate), **satu band yang tumpang tindih** (IV), **satu definisi horizon PD yang keliru** (12 bulan vs 1 bulan — ini yang paling serius secara konseptual), dan beberapa klaim/istilah yang menyesatkan. Tidak ada kesalahan konseptual fatal → bukan REJECT.

**Jumlah temuan: 20** — must-fix 4 (F1–F4), should-fix 10 (F5–F14), nit 6 (F15–F20).

## Catatan verifikasi (oleh agen review, independen dari model)

Setiap temuan di bawah ini **diverifikasi ulang ke sumber** sebelum masuk laporan ini: file lesson TS/`.md`, output 5 notebook guided-task, notebook kanonis, dan — untuk angka yang tidak ada di output notebook — **dataset UCI mentah diunduh dan dihitung ulang langsung** (30.000 baris). Laporan mentah model tersimpan di `/tmp/review_m2_deepseek_raw.txt`.

**Tiga koreksi terhadap laporan model (penting):**

1. **F3 — klaim reviewer "Stage 3 = 120+ DPD" SALAH.** PAY_0 = 4 berarti telat 4 bulan ≈ 91–120 hari, jadi PAY_0 ≥ 4 → **91+ DPD (> 90 DPD)**, bukan ≥ 120 DPD. Yang benar-benar salah di lesson adalah batas bucket "3 = 61–90 hari, 4+ = 90 hari ke atas" (90 masuk dua bucket). Perbaikan yang benar: "3 = 61–90 hari, 4+ = 91 hari ke atas"; "Stage 3 (PAY_0 ≥ 4, 91+ DPD)".
2. **F7 — status RAGU reviewer dinaikkan menjadi TERKONFIRMASI SALAH.** Notebook kanonis cell 15 mencetak "Jumlah fitur model: 31" (train 24.000 × 31). LR yang ditampilkan lesson (guided-task M2.1) memakai 6 fitur. "Sembilan koefisien" tidak cocok dengan keduanya.
3. **F11 — 0,0252 dipertajam.** Angka itu tidak tercetak di notebook mana pun. Replikasi independen (latih ulang GBM mentah, split & fitur sama seperti notebook M2.3) memberi selisih desil terburuk mentah **0,0251** (desil 7, dari nilai tak-terbulatkan); 0,0252 adalah selisih dari nilai desil yang sudah dibulatkan (0,2035 − 0,1783). Selisih 0,0001 — tapi angka itu tidak bisa ditelusur ke output notebook mana pun.

---

## MUST-FIX

### F1. Total transisi roll-rate salah: 150.798 vs 150.000

- **Lokasi:** `src/app/v2/content/mlf-m24-vintage-rollrate-ifrs9.ts`, langkah `lab1`, baris 225.
- **Klaim salah:** *"Lab pertama menghitung matriks roll-rate dari tabel counts transisi yang sesungguhnya — total 5 transisi April–September 2005, **150.798 transisi**."*
- **Yang benar + hitung ulang** (dari matriks counts di lesson itu sendiri, langkah `rollrate`):
  - current: 123.723 + 1.860 + 6.209 = 131.792
  - bucket 1: 34 · bucket 2: 4.130 + 1.676 + 9.460 + 1.031 = 16.297 · bucket 3: 176 + 109 + 362 + 176 + 285 = 1.108 · bucket 4+: 24 + 43 + 167 + 39 + 496 = 769
  - Total = 131.792 + 34 + 16.297 + 1.108 + 769 = **150.000** (= 30.000 nasabah × 5 transisi).
  - Lesson yang sama juga menulis *"n = 34 dari **150.000** transisi"* (baris 109) → **kontradiksi internal**.
- **Perbaikan:** ganti "150.798" → "150.000" (dan sebutkan "= 30.000 nasabah × 5 transisi").

### F2. Band IV tumpang tindih di titik 0,1; 0,3; 0,5 — dan "di atas 0,5" tidak bisa divalidasi

- **Lokasi:** `src/app/v2/content/mlf-m22-scorecard-woe-iv.ts`, langkah `woe-iv`, baris 67 (juga baris 468 `checkpoint/summary`, dan `content/mlf-m22-scorecard-woe-iv.md` §2 + Rangkuman).
- **Klaim salah:** *"Band IV-nya — dibuat kontinu, tanpa lubang: di bawah 0,02 tidak prediktif; 0,02–0,1 lemah; 0,1–0,3 sedang; 0,3–0,5 kuat; di atas 0,5 curigai."*
- **Yang benar:** IV = 0,1 masuk **dua** band ("0,02–0,1" dan "0,1–0,3"); IV = 0,3 juga dua band; IV = 0,5 ambigu antara "0,3–0,5" dan "di atas 0,5". Lesson mengklaim "kontinu, tanpa lubang" tetapi tidak menyatakan konvensi half-open. Band kata-kata "di atas/di bawah" tanpa batas eksplisit tidak bisa divalidasi otomatis (guard).
- **Perbaikan:** *"IV < 0,02 tidak prediktif; 0,02 ≤ IV < 0,1 lemah; 0,1 ≤ IV < 0,3 sedang; 0,3 ≤ IV < 0,5 kuat; IV ≥ 0,5 curigai."* (tanpa lubang, tanpa tumpang tindih).

### F3. Definisi bucket DPD tumpang tindih di 90 hari (dan label Stage 3 tidak konsisten dengan bucket)

- **Lokasi:** `mlf-m24-vintage-rollrate-ifrs9.ts`, langkah `cerita`, baris 36; langkah `ifrs9`, baris 197.
- **Klaim salah:** *"current = 0 hari, 1 = 1–30 hari, 2 = 31–60 hari, 3 = 61–90 hari, 4+ = 90 hari ke atas"* → 90 hari masuk bucket 3 **dan** 4+.
- **Yang benar:** batas harus "3 = 61–90 hari, 4+ = **91 hari ke atas**". PAY_0 = 4 berarti telat 4 bulan ≈ 91–120 hari, jadi Stage 3 (PAY_0 ≥ 4) = **91+ DPD (> 90 DPD)**. Label lesson "Stage 3 (PAY_0 ≥ 4, 90+ DPD)" secara kasar masih bisa dibaca sebagai "> 90 DPD", tetapi tidak konsisten dengan definisi bucket-nya sendiri. (Catatan: usulan awal reviewer "≥ 120 DPD" **salah** dan sudah dikoreksi di sini — PAY_0 = 4 mencakup 91–120 hari, bukan ≥ 120.)
- **Perbaikan:** "3 = 61–90 hari, 4+ = 91 hari ke atas"; dan "Stage 3 (PAY_0 ≥ 4, 91+ DPD)".

### F4. Horizon PD salah label: data UCI adalah default 1 bulan ke depan, bukan 12 bulan

- **Lokasi:** `mlf-m23-pd-lgd-ead-expected-loss.ts`, langkah `pd-lgd-ead`, baris 45; `mlf-m24-vintage-rollrate-ifrs9.ts`, langkah `ifrs9`, baris 197–199, 204, 212–214, 376, 401, 433, 451, 464.
- **Klaim salah:** *"PD (probability of default): peluang nasabah default dalam horizon yang didefinisikan. Di notebook, PD adalah output model — GBM terkalibrasi — **untuk horizon 12 bulan ke depan**. PD 0,20 berarti: dari 100 nasabah seperti ini, sekitar 20 akan default dalam 12 bulan."* — dan di M2.4: *"PD 12m 0,1659"*, *"PD 12m 0,6986"*, *"Total ECL 12 bulan: NT$457.366.208"*.
- **Yang benar + bukti:** label UCI = *default payment next month* (Oktober 2005), dan PD di lesson dihitung `defaults/n` dari kolom itu — mis. Stage 1 0,1659 = 4.459/26.870 (default Oktober). Jadi PD-nya **1 bulan**, bukan 12 bulan. Ini juga bertabrakan dengan aturan lesson sendiri di M2.3 baris 35: *"EL bagus bila ketiga komponennya diukur pada definisi yang sama — PD 12 bulan dikali LGD dan EAD yang juga 12 bulan."* EL/ECL yang dihitung di M2.3–M2.4 adalah EL/ECL **1 bulan** (PD 1 bulan × LGD × EAD saat ini). Analisis threshold (optimum 0,10) tetap sah sebagai aturan keputusan 1 bulan — yang salah adalah label horizonnya, bukan aritmetikanya.
- **Perbaikan:** tulis eksplisit "PD 1 bulan (label UCI: default bulan berikutnya) dipakai sebagai **proksi**; EL/ECL di bawah adalah EL/ECL 1 bulan, bukan 12 bulan" — dan ganti semua "PD 12m"/"ECL 12m"/"Total ECL 12 bulan" menjadi "PD 1 bln"/"ECL 1 bln" (termasuk kuis Q4/Q5 M2.4 dan rangkuman), atau beri label [ilustrasi] bila 12 bulan memang diniatkan sebagai skala hipotetis.

---

## SHOULD-FIX

### F5. Klaim proteksi clip bobot tidak berdasar (bobot aktual maks 4,27, bukan 20)

- **Lokasi:** `mlf-m25-reject-inference.ts`, langkah `reweighting`, baris 117 (juga baris 115).
- **Klaim salah:** *"Nasabah dengan P(approve) = 0,05 mendapat bobot 20 — satu orang mewakili 20 orang. … Itulah kenapa bobot di-clip pada 0,05 (bobot maksimal 20) di simulasi ini — tanpa clip, varians model meledak."*
- **Yang benar + bukti:** bobot reweighting di notebook M2.5: min 1,00 / median 1,02 / **maks 4,27** → P(approve) minimum ≈ 0,234, jadi clip 0,05 **tidak pernah aktif** di simulasi ini. Tidak ada nasabah dengan P(approve) = 0,05. Klaim "tanpa clip varians meledak" tidak punya dukungan di notebook ini.
- **Perbaikan:** ganti dengan distribusi bobot sebenarnya ("min 1,00 / median 1,02 / maks 4,27 — clip 0,05 tidak aktif di sini; clip relevan bila ada P(approve) sangat kecil") dan hapus klaim varians meledak, atau beri label [ilustrasi] bila memang skenario hipotetis.

### F6. "Hampir pasti bermasalah" untuk PAY_0 = 3 — overclaim

- **Lokasi:** `mlf-m22-scorecard-woe-iv.ts`, langkah `woe-iv`, baris 65.
- **Klaim salah:** *"bin 3 (−2,3991) adalah yang paling negatif: nasabah yang telat 3 bulan hampir pasti bermasalah."*
- **Yang benar:** default rate bin 3 = 244/322 = **0,7578** (24% lancar). "Hampir pasti" terlalu kuat untuk 3 dari 4.
- **Perbaikan:** "…tiga dari empat nasabah di bin ini default (0,7578)."

### F7. "Sembilan koefisien" tidak cocok dengan model mana pun (TERKONFIRMASI SALAH)

- **Lokasi:** `mlf-m21-supervised-logistic-regression.ts`, langkah `gbm-tradeoff`, baris 173.
- **Klaim salah:** *"LR adalah sembilan koefisien yang bisa dicetak di satu halaman."*
- **Yang benar + bukti:** notebook kanonis cell 15 mencetak "Jumlah fitur model: **31**" (train 24.000 × 31; 23 kolom mentah + 8 fitur engineered). LR yang ditampilkan lesson (guided-task M2.1) memakai **6 fitur** (PAY_DELAY_COUNT, PAY_MAX, PAY_0, LIMIT_BAL, PAY_AMT1, BILL_AMT2). "Sembilan" tidak cocok dengan keduanya.
- **Perbaikan:** "…enam koefisien…" (bila merujuk LR yang ditampilkan lesson) — atau "31 koefisien" bila merujuk LR kanonis. Jangan biarkan angka tanpa rujukan.

### F8. "300 iterasi — cukup untuk konvergen" bertentangan dengan data separable

- **Lokasi:** `mlf-m21-supervised-logistic-regression.ts`, langkah `lab1`, baris 225–226.
- **Klaim salah:** *"Learning rate 0,5, 300 iterasi — cukup untuk konvergen pada data sekecil ini."* Bandingkan paragraf berikutnya di lesson yang sama: *"bobotnya terus membesar selama iterasi"* (konsekuensi data separable).
- **Yang benar:** pada data separable sempurna, gradient descent **tidak** konvergen — tidak ada MLE berhingga, bobot divergen pelan. Lesson mengontradiksi dirinya sendiri dalam dua paragraf berurutan. (Hasil lab terverifikasi: w0 = −3,2068, w1 = 4,3549 setelah 300 iterasi — bobot besar adalah gejala separabilitas, seperti yang diakui lesson.)
- **Perbaikan:** "300 iterasi cukup untuk **stabil secara praktis** — bukan konvergen: pada data yang separable sempurna, bobot terus membesar."

### F9. "Points-to-double-odds" untuk angka 20 tidak tepat

- **Lokasi:** `mlf-m22-scorecard-woe-iv.ts`, langkah `scorecard`, baris 126.
- **Klaim salah:** *"Angka 20 adalah skala (points-to-double-odds yang disederhanakan)."*
- **Yang benar (teori):** poin = factor × WoE dengan factor = PDO/ln 2. Dengan factor = 20 → PDO = 20 × ln 2 ≈ **13,86**, bukan 20. (Base 500 sendiri konsisten — lihat tabel rekap.)
- **Perbaikan:** "20 adalah faktor skala (PDO implisit ≈ 13,9 poin per doubling odds); 500 adalah base score."

### F10. Aritmetika "why" kuis M2.4 tidak mereproduksi hasilnya

- **Lokasi:** `mlf-m24-vintage-rollrate-ifrs9.ts`, quiz Q4 (Stage 2), `why` opsi benar, baris 437.
- **Klaim salah:** *"Benar: 0,6986 × 0,45 × 108.269 = 34.035."*
- **Yang benar + hitung ulang:** 0,6986 × 0,45 × 108.269 = **34.036,4** → 34.036. Angka 34.035 benar hanya bila memakai PD eksak 2.088/2.989 = 0,698561 → 34.034,7 → 34.035.
- **Perbaikan:** "2.088/2.989 × 0,45 × 108.269 = 34.035" (pakai PD eksak, bukan 0,6986 yang sudah dibulatkan).

### F11. Angka 0,0252 (selisih desil terburuk GBM mentah) tidak terverifikasi

- **Lokasi:** `mlf-m23-pd-lgd-ead-expected-loss.ts`, langkah `kalibrasi` + `note`, dan `content/mlf-m23-pd-lgd-ead-expected-loss.md` §2.
- **Klaim:** *"selisih desil terburuk: 0,0252 (mentah) menjadi 0,0181 (terkalibrasi)."*
- **Yang benar + bukti:** 0,0181 terverifikasi (desil 6 terkalibrasi: |0,1636 − 0,1817|). **0,0252 tidak ada di angka kanonis dan tidak tercetak di notebook mana pun** (notebook kanonis cell 26 hanya menggambar reliability diagram; guided-task M2.3 cell 7 hanya menghitung desil model terkalibrasi). Replikasi independen (latih ulang GBM mentah, split & fitur sama): desil mentah terburuk = **0,0251** (desil 7, dari nilai tak-terbulatkan); 0,0252 = selisih nilai desil 7 yang sudah dibulatkan (0,2035 − 0,1783). Selisih hanya 0,0001, tetapi angka lesson tidak bisa ditelusur ke output notebook.
- **Perbaikan:** tandai [notebook] dengan rujukan sel hanya bila memang ada di notebook, atau ganti dengan klaim yang bisa diverifikasi (mis. "selisih desil terbesar terkalibrasi 0,0181"), atau tulis 0,0251 dengan catatan replikasi.

### F12. "Daun kiri (PAY_0 ≤ 1, tidak telat)" — PAY_0 = 1 berarti telat 1 bulan

- **Lokasi:** `mlf-m21-supervised-logistic-regression.ts`, langkah `tree`, baris 135 (juga caption figure "Daun kiri: lancar", baris 152).
- **Klaim salah:** *"Daun kirinya (PAY_0 ≤ 1, tidak telat): default rate 0,1659, n = 26.870."*
- **Yang benar:** PAY_0 = 1 = payment delay 1 month (1–30 DPD). Yang "tidak telat" adalah PAY_0 ≤ 0. Daun kiri berisi 26.870 nasabah dengan PAY_0 ≤ 1 — termasuk 3.688 yang telat 1 bulan.
- **Perbaikan:** "Daun kiri (PAY_0 ≤ 1, telat ≤ 1 bulan)".

### F13. Label figure bertumpuk (dua `<text>` pada x,y identik) — 4 figure kena

- **Lokasi:** figure di `mlf-m21` (langkah `gbm-tradeoff`: "Stump"/"depth 1", "Depth-2"/"depth 2", "LR"/"linear", "GBM"/"ensemble" — baris 194–195, 199–200, 204), `mlf-m22` (`"<460"` dan `"n=2.205"` — baris 164–165), `mlf-m24` (`"current"`/`"n=26.921"`, `"2"`/`"n=2.766"`, dst. — baris ±70–72), `mlf-m25` (figure perbandingan metode: `"Aktual"`/`"target"`, `"Model-A"`/`"bias"`, `"Reweight"`/`"parsial"`, `"Fuzzy"`/`"gema"`, `"Oracle"`/`"batas atas"` — semua di `y="222"`).
- **Yang benar:** dua string tercetak di koordinat sama → tidak terbaca (pola sistematis dari generator figure, bukan satu figure saja).
- **Perbaikan:** geser label kedua ke `y="234"` (atau satu `<text>` dengan `tspan`).

### F14. Notasi batas bin LIMIT_BAL / AGE ambigu

- **Lokasi:** `mlf-m22-scorecard-woe-iv.ts`, langkah `binning` dan `scorecard`.
- **Klaim salah:** *"≤50 ribu, 50–100 ribu, 100–200 ribu…"* (50.000 masuk dua bin); *"46–60, 60+"* (60 masuk dua bin).
- **Yang benar:** kode `pts_lim`/`pts_age` menyelesaikannya (≤50.000 → −10; ≤60 → −3), tapi prosa tidak.
- **Perbaikan:** "≤50; >50–100; >100–200…" dan "46–60; >60".

---

## NIT

### F15. "Empat kali lipat" — seharusnya "empat setengah kali lipat"

- **Lokasi:** `mlf-m21-supervised-logistic-regression.ts`, langkah `cerita`, baris 33.
- **Klaim:** *"Pelamar dengan peluang default 0,11 dan pelamar dengan peluang 0,49 … risikonya berbeda empat kali lipat."*
- **Yang benar:** 0,49/0,11 = **4,45** → "empat setengah kali lipat" lebih tepat.

### F16. "Skor min/maks 437/532" di `.md` tanpa label asal

- **Lokasi:** `content/mlf-m22-scorecard-woe-iv.md` §4 (baris 53) — tidak ada di TS.
- **Yang benar:** aritmetika cocok (500 − 48 − 10 − 5 = 437; 500 + 13 + 16 + 3 = 532), tetapi tanpa label asal dan tidak ada di TS.
- **Perbaikan:** beri "[notebook, turunan tabel poin]".

### F17. Komentar starter `lab1` M2.4 — "5 bulan" seharusnya "5 transisi"

- **Lokasi:** `mlf-m24-vintage-rollrate-ifrs9.ts`, baris 240 dan 259 (starter + solution).
- **Klaim:** *"Matriks counts transisi 5 bulan (Apr->Sep 2005)"* — itu 5 **transisi** lintas 6 bulan.
- **Perbaikan:** "5 transisi" (konsisten dengan prosa lesson yang sudah benar di baris 107/225).

### F18. "Monoton berarti bin-nya benar" — overclaim

- **Lokasi:** `mlf-m22-scorecard-woe-iv.ts`, langkah `binning`, baris 51.
- **Klaim:** *"Monoton berarti bin-nya benar: makin besar limit, makin kecil risiko — tanpa lompatan aneh di tengah."*
- **Yang benar:** monoton adalah indikasi, bukan bukti; bin bisa monoton tetapi salah (mis. bin terlalu kasar menyembunyikan non-monotonitas di dalam bin).
- **Perbaikan:** "Monoton berarti bin-nya wajar".

### F19. Output `lab2` M2.4 mencetak `Rp…` untuk nilai NT$

- **Lokasi:** `mlf-m24-vintage-rollrate-ifrs9.ts`, baris 297 (`expected`), 318–325 (starter/solution).
- **Klaim:** output `"Stage 1: PD=0.1659 ECL/nasabah=Rp13031 ECL total=Rp350133169…"` — prefiks mata uang tidak konsisten dengan [notebook] (NT$) yang dipakai di seluruh lesson.
- **Perbaikan:** ganti `Rp` → `NT$` (atau beri catatan eksplisit bila Rp memang diniatkan).

### F20. Mini-case M2.4 — angka 0,4258 tidak pernah ditampilkan

- **Lokasi:** `mlf-m24-vintage-rollrate-ifrs9.ts`, langkah `minicase`, baris 376.
- **Klaim:** *"0,0998 dari bucket 2 kembali current di September"* — konsisten (0,0998 + 0,4258 + 0,4051 + 0,0693 = 1,0000), tapi angka 0,4258 (ke bucket 1) tidak pernah ditampilkan sehingga pembaca tidak bisa memverifikasi jumlahnya.
- **Yang benar (verifikasi dari data UCI mentah):** transisi Agustus→September dari bucket 2: ke current 0,0998; ke 1: 0,4258; tetap 2: 0,4051; ke 3: 0,0693; ke 4+: 0,0000.
- **Perbaikan:** tambahkan "(sisa baris: 0,4258 ke bucket 1)".

---

## Sinkronisasi TS vs .md

Tidak ditemukan kontradiksi angka antara TS dan `.md` pada kelima lesson. Satu-satunya angka `.md` yang tidak ada di TS adalah "skor min/maks 437/532" (F16), dan satu-satunya angka TS yang tidak ada di `.md` adalah "150.798" (F1) — jadi `.md` justru lebih bersih pada titik itu.

---

## Tabel rekap hitung ulang

| Angka di lesson | Hitung ulang | Status |
|---|---|---|
| OR PAY_DELAY_COUNT 2,13 | e^0,7560 = 2,1288 | cocok |
| OR PAY_MAX 1,32 / PAY_0 1,28 | e^0,2741 = 1,3153; e^0,2434 = 1,2756 | cocok |
| OR LIMIT_BAL 0,79 / PAY_AMT1 0,85 / BILL_AMT2 1,14 | 0,7865 / 0,8510 / 1,1427 | cocok |
| Sigmoid z=2→0,88; z=−2→0,12 | 0,8808 / 0,1192 | cocok |
| Stump kanan n = 3.130 | 2.989 (PAY_0 2–3) + 141 (PAY_0 ≥ 4) | cocok |
| Default rate daun kanan 0,6955 | 2.177/3.130 = 0,69553 (6.636−4.459) | cocok |
| PD lab P1 0,1741 / P2 0,9864 / P3 0,0000 | z = −1,5566 / 4,2852 / −11,394 dari w,b lesson | cocok |
| OR lab 0,0405 / 77,8599 | e^−3,2068 = 0,04049; e^4,3549 = 77,854 | cocok (selisih 0,006% pada OR kedua) |
| EL P2 Rp4.438.800 / P1 Rp783.450 | 0,9864×0,45×10jt; 0,1741×0,45×10jt | cocok |
| WoE PAY_0 (7 bin) | ln(pg/pb) dari counts 23.364/6.636 | cocok semua |
| IV PAY_0 0,8761 | Σ(pg−pb)×WoE = 0,87613 | cocok |
| Kontribusi IV bin 2 = 0,5012 | 0,50118 | cocok |
| Poin PAY_0 −2…4+ | 12 / 7 / 13 / −12 / −41 / −48 / −36 | cocok semua |
| Skor A 524 / B 444 / C 519 | 500+13+8+3; 500−41−10−5; 500+7+12+0 | cocok |
| Band n 2.205+6.263+15.834+5.698 | 30.000 | cocok |
| 0,6993/0,0892 ≈ delapan kali | 7,84 | cocok |
| EL 5 pelamar Rp67.500.000 | 2,25+2,25+18+12,6+32,4 jt | cocok |
| Precision 0,2828 / recall 0,9141 / F1 0,4319 / akurasi 0,4682 | 1.213/4.290; 1.213/1.327; 0,43187; 2.809/6.000 | cocok |
| Approval 0,285; bad rate 0,0667 | 1.710/6.000; 114/1.710 | cocok |
| Adverse +49,0% / Severe +194,2% | 38.581.671/78.675.378; 152.764.805/78.675.378 | cocok |
| Selisih desil terbesar 0,0181 | D6: 0,1817−0,1636 | cocok |
| Selisih desil terburuk mentah 0,0252 | replikasi: 0,0251 (D7, nilai eksak); 0,0252 = selisih nilai bulat | **RAGU — lihat F11** |
| Vintage current 0,1867 / 4+ 0,7132 | rata-rata berbobot PAY_6 (−2,−1,0) / (4…8) | cocok |
| Matriks roll-rate 5×5 (semua sel) | count/total baris | cocok semua |
| **Total transisi 150.798** | Σ counts = **150.000** | **TIDAK — F1** |
| Roll Agu→Sep total 3.130 | 992+0+1.863+170+106 = 3.131 | cocok (pembulatan) |
| ECL Stage 1 NT$350.133.169 | 0,16595×0,45×4.688.683.680 | cocok |
| ECL Stage 2 NT$101.729.540 (34.035/nsb) | 0,698561×0,45×323.616.000 | cocok |
| Stage 3 PD=1 NT$5.503.500 | 0,45×12.230.000 | cocok persis |
| Koreksi NT$2.029.660 / total NT$457.366.208 | 5.503.500−3.473.840; jumlah 3 stage | cocok |
| Stage 2 lifetime NT$41.413 / 123.783.120 | 0,85×0,45×108.269 = 41.412,9 | cocok |
| Approval rate 0,7804 | 23.412/30.000 | cocok |
| Default disetujui 0,1495 / ditolak 0,4759 / semua 0,2212 | berbobot: 0,7804·0,1495+0,2196·0,4759 = 0,2212 | cocok |
| Gap ditolak 0,2422 / gap semua 0,0532 | 0,4759−0,2337; 0,2212−0,1680 | cocok |
| "1.596 default hilang" | 0,0532×30.000 | cocok |
| HT lab 0,3333; bobot 1 & 3 | (1/1+1/0,3333)/12 = 4/12 | cocok |
| Selisih baku reject sampling 0,028 | √(0,4759·0,5241/329) = 0,0275 | cocok |
| "Tiga kali lebih berisiko" | 0,4759/0,1495 = 3,18 | cocok |
| Base skor 500 | 524−24 = 500; skor kanonis 524/444/519 hanya konsisten dengan base 500 | cocok (500) |
| "20 = points-to-double-odds" | PDO = 20×ln2 ≈ 13,86 | **istilah tidak tepat — F9** |
| Bobot reweighting maks 20 (clip 0,05) | kanonis: maks 4,27 → clip tidak aktif | **klaim menyesatkan — F5** |
| "Sembilan koefisien" (LR) | kanonis: 31 fitur; guided: 6 fitur | **TIDAK — F7** |
| PD "12 bulan" (M2.3:45, M2.4:197–198) | label UCI = default bulan berikutnya (1 bulan) | **TIDAK — F4** |
| Band IV "kontinu, tanpa lubang" | 0,1 / 0,3 / 0,5 masuk dua band | **TIDAK — F2** |

**Satu hal yang dinyatakan benar dan penting:** band skor `<460 / 460–499 / 500–519 / 520+` **kontinu untuk skor integer** (fungsi `band()` di lab memakai `<460 / <500 / <520 / else`, jadi tidak ada lubang maupun tumpang tindih) — berbeda dengan band IV yang memang cacat.

---

## Lampiran: verifikasi independen agen review (di luar laporan model)

Angka-angka berikut dihitung ulang agen review dari **dataset UCI mentah** (diunduh dari `archive.ics.uci.edu`, 30.000 baris) atau dengan **mengeksekusi ulang kode lab/notebook** — semuanya cocok dengan lesson, kecuali yang sudah masuk temuan di atas:

- **LIMIT_BAL bins:** default rate 0,3179 → 0,1117; WoE −0,4951 → +0,8153; IV 0,1567 — cocok.
- **AGE bins:** WoE −0,2467 / 0,1386 / 0,0165 / −0,1670 / −0,2558; IV 0,0213 — cocok.
- **EDUCATION:** kode 0 = 14 baris, 0 default; IV dengan 0 digabung ke "Lainnya" (0,4,5,6) = 0,0373 — cocok.
- **PAY_6 per nilai:** −2: 0,2004; −1: 0,1699; 0: 0,1884; 2: 0,5065; 3: 0,6413; 4: 0,6327; 5: 0,5385; 6: 0,7368; 7: 0,8261; 8: 1,0000 (n=2) — cocok semua.
- **Transisi Agustus→September (bucket):** dari 2: ke current 0,0998; ke 1: 0,4258; tetap 2: 0,4051; ke 3: 0,0693 — cocok (lihat F20).
- **Aturan approval M2.5** (PAY_0 ≤ 1 DAN LIMIT_BAL ≥ 50.000): disetujui 23.412, ditolak 6.588, approval 0,7804; default disetujui 0,1495, ditolak 0,4759 — cocok.
- **Staging M2.4:** Stage 1 n=26.870, default 4.459 (0,1659), EAD total NT$4.688.683.680; Stage 2 n=2.989, default 2.088 (0,6986), EAD NT$323.616.000; Stage 3 n=141, default 89 (0,6312), EAD NT$12.230.000 — cocok.
- **M2.1 Lab 1 dieksekusi ulang:** w0 = −3,2068, w1 = 4,3549, b = −1,2418; OR 0,0405 / 77,8599; PD test 0,1741 / 0,9864 / 0,0000 — cocok.
- **M2.1 Lab 2 dieksekusi ulang:** income ≤ 2,35 err 0; late ≥ 1,50 err 0 — cocok.
- **M2.3 Lab 2 dieksekusi ulang (seed 7):** threshold 0,10 → approval 0,20, bad rate 0,0000, profit Rp2.000.000; 0,30 → 0,50 / 0,2000 / −Rp5.000.000; 0,50 → 0,65 / 0,3077 / −Rp13.500.000 — cocok.
- **Replikasi desil GBM mentah** (latih ulang, split & fitur sama seperti notebook M2.3): D1 0,0427 vs 0,0450; D7 0,2035 vs 0,1783 (gap 0,0251); D10 0,6997 vs 0,7017; Brier mentah 0,1342, terkalibrasi 0,1345 — cocok kecuali 0,0252 (lihat F11).
- **Fuzzy augmentation M2.5:** kode notebook memakai `wf = [1…; 0,5 × pA_rej; 0,5 × (1 − pA_rej)]` — deskripsi lesson "bobot 0,5 × p" **cocok dengan notebook**, bukan temuan.

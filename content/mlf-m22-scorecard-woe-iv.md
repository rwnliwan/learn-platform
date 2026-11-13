# MLF-M2.2: Scorecard, WoE & IV — Model yang Bisa Dijumlahkan Tangan

## Masalah: Nasabah Bertanya «Kenapa Skor Saya 444?»

Nasabah ditolak dan bertanya kenapa. Bank yang memakai GBM mentah hanya bisa menjawab «model berkata begitu». Bank yang memakai scorecard bisa menjawab: «Skor Anda 444 — minus 41 poin karena telat 2 bulan, minus 10 karena limit di bawah Rp50 ribu, minus 5 karena usia di bawah 25 tahun.» Skor adalah alasan yang bisa diaudit, diperdebatkan, dan diperbaiki.

---

## 1. Binning

Fitur mentah dipotong menjadi bin. PAY_0 sudah diskret (nilai −2 sampai 8; ≥ 4 digabung «4+», n = 141). LIMIT_BAL dipotong manual: ≤50 ribu, >50–100 ribu, >100–200 ribu, >200–300 ribu, >300–500 ribu, >500 ribu.

**Nilai:** bin LIMIT_BAL monoton [notebook] — default rate 0,3179 (≤50 ribu) → 0,1117 (500 ribu+); WoE −0,4951 → 0,8153. AGE berbentuk U terbalik: WoE −0,2467 (≤25), 0,1386 (26–35), 0,0165 (36–45), −0,1670 (46–60), −0,2558 (>60).

**Baik/buruk:** bagus bila tiap bin punya n cukup dan pola stabil. Buruk bila bin terlalu halus (WoE goyah oleh noise).

**Mitigasi:** tiap bin minimal 5% populasi atau 100 default; gabungkan bin tetangga bila WoE-nya hampir sama; tampilkan n per bin. EDUCATION kode 0 (14 baris, 0 default) — WoE tak terdefinisi, gabungkan binnya dulu.

---

## 2. Weight of Evidence & Information Value

WoE = ln(porsi lancar di bin / porsi default di bin). IV = jumlah (porsi lancar − porsi default) × WoE di semua bin.

**Nilai:** PAY_0 [notebook] — WoE −2: 0,6221; −1: 0,3428; 0: 0,6591; 1: −0,5931; 2: −2,0654; 3: −2,3991; 4+: −1,7961. IV total 0,8761. IV fitur lain: PAY_DELAY_COUNT 0,8618; LIMIT_BAL 0,1567; EDUCATION 0,0373 (setelah kode 0 digabung ke «Lainnya» bersama kode 4, 5, 6); AGE 0,0213; SEX 0,0092; MARRIAGE 0,0072.

**Gambar:** bar WoE per bin PAY_0 — bin 0 paling hijau (0,6591), bin 3 paling merah (−2,3991); satu bulan telat membalik tanda WoE.

**Baik/buruk:** IV bagus untuk menyaring fitur sebelum melatih. Buruk bila dipakai sendirian: tidak melihat interaksi dan korelasi (PAY_0 dan PAY_DELAY_COUNT mengukur hal yang hampir sama).

**Mitigasi:** band IV kontinu — IV < 0,02 tidak prediktif; 0,02 ≤ IV < 0,1 lemah; 0,1 ≤ IV < 0,3 sedang; 0,3 ≤ IV < 0,5 kuat; IV ≥ 0,5 curigai. «Curigai» berarti selidiki dulu, bukan buang: PAY_0 0,8761 sahih (PAY_0 Sep 2005 memprediksi default Okt 2005 — bukan info masa depan). Periksa korelasi antar fitur yang lolos; hitung IV di latih, verifikasi di validasi.

$$WoE = \ln\frac{\% \text{lancar di bin}}{\% \text{default di bin}}, \quad IV = \sum (\% \text{lancar} - \% \text{default}) \times WoE$$

---

## 3. Scorecard

Poin = round(20 × WoE); skor = 500 + jumlah poin.

**Nilai:** poin PAY_0 [notebook] — −2: +12, −1: +7, 0: +13, 1: −12, 2: −41, 3: −48, 4+: −36. LIMIT_BAL — ≤50 ribu: −10, >50–100 ribu: −4, >100–200 ribu: +3, >200–300 ribu: +8, >300–500 ribu: +12, >500 ribu: +16. AGE — ≤25: −5, 26–35: +3, 36–45: 0, 46–60: −3, >60: −5. A = 524, B = 444, C = 519.

**Baik/buruk:** bagus bila skor dipakai konsisten di semua cabang. Buruk bila poin diubah diam-diam tanpa recalibration.

**Mitigasi:** kunci tabel poin ke versi data dan tanggal; hitung ulang tiap kali populasi berubah. Bin 4+ (−36) yang «lebih baik» dari bin 3 (−48) adalah noise n kecil — tampilkan apa adanya, jangan paksa monoton.

**Reason codes dan counterfactual [notebook]:** reason codes = 2–4 kontribusi poin terendah pada skor pelamar — itulah «alasan penolakan» yang bisa diaudit. Pelamar B skor 444 = 500 − 41 − 10 − 5: reason codes-nya PAY_0 = 2 (−41), limit ≤50 ribu (−10), usia ≤25 (−5). Counterfactual — «apa yang harus berubah agar skor naik»: PAY_0 2 → 0: −41 → +13 = +54 poin (444 → 498); limit ≤50 ribu → 200–300 ribu: −10 → +8 = +18; usia ≤25 → 26–35: −5 → +3 = +8; ketiganya diperbaiki: 444 → 524. Counterfactual bukan janji («lakukan ini maka pasti disetujui») — melainkan arah perbaikan yang terukur.

**Konstruksi scorecard standar:** PDO = 20, base score 600 pada base odds 50:1 (good:bad) → factor = 20/ln2 = 28,8539; offset = 600 − 28,8539 × ln(50) = 487,1229. Rumus: score = offset + factor × ln(odds good/bad). PD 0,05 → odds 19,00 → skor 572; PD 0,10 → odds 9,00 → 551; PD 0,20 → odds 4,00 → 527. Odds naik 2× → skor +20 (itulah arti PDO). Pedagogis: WoE = 0 → skor 500 (odds 1:1); WoE = 0,6931 (odds 2:1) → 513,9. Scorecard lesson ini (500 + 20 × WoE) adalah kasus khusus konstruksi ini dengan factor 20 dan offset 500 — bukan rumus yang berbeda.

**Gambar:** waterfall 500 → 444 (PAY_0 −41, limit −10, usia −5) dan kurva PD → skor (572 / 551 / 527).

---

## 4. Kalibrasi Band Skor

Skor tinggi harus berarti default rendah — diuji per band.

**Nilai:** empat band [notebook] — di bawah 460: default 0,6993 (n = 2.205); 460–499: 0,3511 (n = 6.263); 500–519: 0,1508 (n = 15.834); 520+: 0,0892 (n = 5.698). Monoton sempurna. Korelasi skor-default −0,4204. Skor min/maks 437/532 [notebook, turunan tabel poin].

**Gambar:** bar default rate per band — dari 0,6993 ke 0,0892.

**Baik/buruk:** bagus bila monoton DAN tiap band punya n cukup. Buruk bila band tidak monoton — biasanya satu bin WoE-nya terbalik karena n kecil.

**Mitigasi:** bila tidak monoton, kembali ke tabel WoE dan cari bin penyebabnya; uji monoton pada data validasi, bukan hanya latih.

**Fairness audit per grup (GBM terkalibrasi, threshold 0,10, test set) [notebook]:** SEX = 1 (laki-laki): n = 2.402, default rate 0,2336, approval 0,2614, bad rate approved 0,0669, mean PD 0,2313, calibration gap −0,0022, FPR 0,6817, FNR 0,0749, FP (lancar ditolak) 1.255, FN (default lolos) 42, mean score 503,4. SEX = 2 (perempuan): n = 3.598, default 0,2129, approval 0,3007, bad rate 0,0665, mean PD 0,2153, cal gap +0,0024, FPR 0,6434, FNR 0,0940, FP 1.822, FN 72, mean score 504,4. AIR (approval perempuan/laki-laki) = 1,1502. Full data: default SEX = 1 adalah 0,2417 vs SEX = 2 adalah 0,2078; mean score full 502,9 vs 504,7. Definisi FP/FN harus eksplisit: FP = nasabah lancar yang ditolak (PD ≥ threshold padahal tidak default); FN = nasabah default yang lolos (PD < threshold padahal default). Kuis kunci: «Mengapa IV SEX rendah (0,0092) tidak membuktikan model fair?» — karena bias bisa masuk lewat proxy (fitur lain yang berkorelasi dengan SEX), dan IV hanya mengukur prediksi univariat, bukan perlakuan model per grup.

**Interval Wilson 95% [notebook]:** rate dari n kecil harus disertai interval, bukan angka telanjang. p = 1,0000, n = 2 → [0,3424; 1,0000], lebar 0,6576. p = 0,6993, n = 2.205 (band <460, 1.542 default) → [0,6798; 0,7181], lebar 0,0383. Kohort 4+ 92/129 (0,7132) → [0,6299; 0,7842], lebar 0,1543. Roll-rate bucket 1, 34/34 (1,0000) → [0,8985; 1,0000], lebar 0,1015. Pelajaran: «100 persen» dari 2 observasi hampir tidak berarti apa-apa; dari 2.205 observasi, intervalnya sempit. Wilson mengoreksi ketidakpastian yang disembunyikan rate telanjang — dipakai lagi di M2.4 untuk roll-rate dan vintage.

**Gambar:** bar approval rate per grup (SEX = 1 vs 2) berdampingan dengan error bar Wilson untuk rate kecil vs besar.

---

## Lab 1: WoE dan IV dari Tabel Counts PAY_0

Bin 2 menyumbang IV 0,5012 — lebih dari separuh total IV 0,8761 [lab]. WoE per bin sama dengan tabel lesson.

## Lab 2: Scorecard Tiga Pelamar

A = 524 (band 520+), B = 444 (band di bawah 460), C = 519 (band 500–519) [lab]. Default rate band masing-masing: 0,0892 / 0,6993 / 0,1508. Tugas tambahan: fairness audit dari counts (approval, bad rate, FP/FN per grup → AIR 1,1502); top-3 reason codes + counterfactual pelamar B (444 → 498 / 524); konversi PD → skor standar (0,05 → 572; 0,10 → 551; 0,20 → 527) [lab].

## Mini-case: Tiga Pelamar, Satu Scorecard

A (524, band 520+): setujui — risiko 0,0892. B (444, di bawah 460): tolak — 0,6993. C (519, 500–519): setujui bersyarat — 0,1508. Scorecard memakai default rate band, bukan PD individu — lebih kasar dari LR, jauh lebih mudah dijelaskan.

## Guided Task di Colab

Notebook: colab/mlf-m22-guided-task.ipynb — WoE/IV semua fitur dari data UCI 30.000 nasabah, scorecard tiga fitur, validasi monotonitas band. Tautan Colab: Buka di Colab: https://colab.research.google.com/drive/1pTgaTvxQETcZTDibwzffmjzDNbrsaSii. Companion: notebook credit scoring (https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO).

## Rangkuman

- Binning: tiap bin butuh n cukup; bin dengan nol default/lancar digabung dulu.
- WoE = ln(porsi lancar / porsi default); IV menjumlahkan semua bin satu fitur.
- Band IV kontinu: IV < 0,02 tidak prediktif; 0,02 ≤ IV < 0,1 lemah; 0,1 ≤ IV < 0,3 sedang; 0,3 ≤ IV < 0,5 kuat; IV ≥ 0,5 curigai.
- Scorecard: poin = round(20 × WoE), skor = 500 + jumlah poin; A 524, B 444, C 519.
- Band skor monoton: 0,6993 → 0,3511 → 0,1508 → 0,0892; korelasi skor-default −0,4204.
- Reason codes B: PAY_0 −41, limit −10, usia −5; counterfactual PAY_0 2 → 0 menaikkan 444 → 498; ketiganya → 524.
- Konstruksi standar: PDO 20, factor 28,8539, offset 487,1229; PD 0,05 → 572; 0,10 → 551; 0,20 → 527.
- Fairness: AIR 1,1502; bad rate approved 0,0669 vs 0,0665; IV SEX 0,0092 tidak membuktikan fair.
- Wilson 95%: n = 2 → lebar 0,6576; n = 2.205 → lebar 0,0383; bucket 1 34/34 → [0,8985; 1,0000].
- Bin PAY_0 = 2 menyumbang IV 0,5012 — 57,2% dari total 0,8761.

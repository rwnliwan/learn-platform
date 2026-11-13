# Review DeepSeek — Modul M3 "Unsupervised / fraud" (Learn v2)

**Tanggal:** 12 November 2026, ~17:20 WITA
**Reviewer:** DeepSeek (`deepseek-v4.1-flash`) via Kelontong AI — 1 panggilan, streaming, tanpa fallback.
**Scope:** 5 lesson TS (`mlf-m31` s.d. `mlf-m35`) + notebook guided-task (angka kunci).
**Laporan mentah model:** `/tmp/review_m3_deepseek_raw.txt`
**Verdict: APPROVE-WITH-FIXES — 11 temuan (2 must-fix, 5 should-fix, 4 nit)**

## Verifikasi induk (semua temuan dicek ke sumber + hitung ulang)

**11/11 BENAR.** Satu koreksi induk atas laporan reviewer: F3 menulis EV acak analitik "NT$6.747.720" — itu typo; yang benar **NT$6.747.320** (110,6 × 61.910,67 − 100.000 = 6.747.319,8). Lift 3,32x tidak berubah.

### Must-fix

**F1 — Aritmetika EV M3.5 salah tulis (derivasi vs hasil).** Lesson :67 mendefinisikan C_missed = NT$61.911 (bulat), tapi semua hasil EV dihitung dengan C tak-dibulatkan 61.910,67 (= 0,45 × mean LIMIT_BAL default test NT$137.579,26 — sesuai notebook). Akibatnya derivasi tertulis salah: 363 × 61.911 − 100.000 = 22.473.693 − 100.000 = **22.373.693**, bukan 22.373.572 seperti tertulis di :68 dan kuis Q1 opsi B (kuis mengontradiksi dirinya sendiri: opsi A menyebut produk 22.473.693). Hitung ulang induk: 363 × 61.910,667 − 100.000 = 22.373.572,1 ✓; 86 × 61.910,667 − 20.000 = 5.304.317,4 ✓; 606 × 61.910,667 − 200.000 = 37.317.864,2 (lesson tulis 37.317.865 — selisih 1 rupiah = artefak pembulatan C eksak notebook, diterima); 91 × 61.910,667 − 100.000 = 5.533.870,7 ✓; blok :89: 277 × 61.910,667 − 80.000 = 17.069.254,8 → 17.069.255 ✓ (dengan 61.911 → 17.069.347, salah); 243 × 61.910,667 − 100.000 = 14.944.292,1 → lesson tulis 14.944.293 (selisih 1 rupiah, artefak pembulatan, diterima); :315: 221,2 × 61.910,667 − 200.000 = 13.494.639,5 → 13.494.640 ✓ (dengan 61.911 → 13.494.713, salah). **Fix opsi (a):** definisikan C_missed = NT$61.910,67 di :67 dan tulis ulang semua derivasi (:68, :69, :89, :315, formulaNote :75, derivasi kuis Q1) dengan 61.910,67. **Lab 1 JANGAN diubah** — expected-nya (185.133/246.444/307.555) sudah benar dengan 61.911; tambahkan catatan eksplisit di intro lab bahwa lab memakai 61.911 bulat sementara prosa memakai 61.910,67.

**F2 — Kontradiksi pengecualian bill jump M3.3.** Lesson :119/:120: 1.512 nasabah (mean 5 bln ≤ 0) dikeluarkan, analisis pada 28.488 (R≥2 n=4.056, R<2 n=24.432). Lesson :122: 867 nasabah "ditetapkan R = 0" dan 390 nasabah "R tak hingga dan masuk kelompok R ≥ 2" — keduanya punya mean = 0, jadi bagian dari 1.512 yang dikeluarkan; tidak mungkin sekaligus dikeluarkan dan dimasukkan. Notebook cell 6 terverifikasi: mengeluarkan SEMUA 1.512 (mean ≤ 0), dianalisis 28.488; cell 5: dormant (mean = 0) 1.258 + negatif 254 = 1.512. Catatan: 867 + 390 = 1.257, bukan 1.258 — breakdown lesson sendiri tidak menjumlah ke angka notebook. **Fix opsi (a):** pertahankan n = 28.488 / 4.056 / 24.432, hapus klaim "ditetapkan R=0"/"masuk R≥2", nyatakan keduanya bagian dari 1.512 yang dikecualikan.

### Should-fix

**F3 — "91 dekat dengan ekspektasi" + klaim "4x".** Lesson :69: random-500 menangkap 91 default — "dekat dengan ekspektasi 110,6". Hitung ulang induk: hipergeometrik (N=6.000, K=1.327, n=500) sd = √(500·0,2212·0,7788·5500/5999) = 8,89 → 91 berada −2,2 sd di bawah ekspektasi (P(≤91) ≈ 1,5%) — bukan "dekat". Rasio 4,04 ada karena undian acak yang apes, bukan properti ranking. EV acak analitik = 110,6 × 61.910,67 − 100.000 = NT$6.747.320 → lift = 22.373.572 / 6.747.320 = **3,32x**. **Fix:** "≈3,3x terhadap ekspektasi acak (EV NT$6.747.320); 4,0x terhadap undian seed 7 yang kebetulan 2,2 sd di bawah ekspektasi", dan "dekat dengan ekspektasi" → "di bawah ekspektasi (≈ −2,2 sd)".

**F4 — Dekomposisi EV tidak menutup.** Lesson :70: "(0,7260 − 0,2212) × 500 × 61.911 adalah selisih EV-nya". Hitung ulang induk: 0,5048 × 500 × 61.911 = NT$15.626.336, sedangkan selisih EV yang diklaim NT$16.839.701. Selisih 1,21 juta = (110,6 − 91) × 61.911 — kalimat mencampur base rate analitik dengan undian aktual. **Fix:** "(363 − 91) × 61.910,67 = 272 × 61.910,67 = NT$16.839.701".

**F5 — sd pembagi-n salah.** Lesson M3.4 lab1 check + kuis Q5: "bila memakai pembagi n, hasilnya 1,1466". Hitung ulang induk: UTIL = {0,4; 0,7; 0,6; 3,2}, mean 1,225, Σ(x−x̄)² = 5,2475; pembagi n=4 → √(5,2475/4) = **1,1454** (bukan 1,1466); pembagi n−1=3 → 1,3226 ✓. **Fix:** 1,1466 → 1,1454 di dua tempat.

**F6 — Klaim degree ring bertentangan dengan ring lesson sendiri.** Lesson M3.2:47: "degree tiap anggota ring sama dengan jumlah anggota ring dikurangi satu". Ring lesson ini: 60 akun di 6 device (ukuran 8/16/16/16/17/19) — tidak ada anggota ber-degree 59; degree mereka 7–18. **Fix:** batasi klaim ke klika satu-device (seperti gambar R1–R4), tambahkan "di data sintetis lesson ini ring tersebar di 6 device, jadi degree anggota = ukuran device-nya − 1, bukan 59".

**F7 — Tabrakan istilah "velocity".** M3.3: V = jumlah bulan dengan PAY_AMT > 0; M3.4:51: VELOCITY = BILL_AMT1 / rata-rata BILL_AMT1..6; M3.3 R = BILL_AMT1 / mean(BILL_AMT2..6). Tiga nama, dua penyebut, satu modul. **Fix:** ganti nama fitur M3.4 menjadi `BILL_TREND` (atau `REL_BILL`) + satu kalimat pembeda eksplisit terhadap V dan R.

### Nit

**F8 — Band silhouette berlubang.** M3.1:165: "0,71–1,00 kuat; 0,51–0,70 wajar; 0,26–0,50 lemah; 0,25 ke bawah tidak ada struktur" — lubang di 0,70–0,71; 0,50–0,51; 0,25–0,26 (kelas yang sama dengan F2 M2). **Fix:** half-open Kaufman–Rousseeuw: >0,70 kuat; (0,50; 0,70] wajar; [0,26; 0,50] lemah; <0,26 tidak ada struktur. Perbaiki juga why kuis Q2 bila memakai band lama.

**F9 — Definisi community salah.** M3.2:45: "Community adalah component yang lebih rapat dari sekitarnya". Community bukan subtype connected component; ia subset node dengan kepadatan internal > eksternal (modularity), bisa memotong satu component atau tersebar di beberapa. **Fix:** "Community adalah kelompok node yang jauh lebih rapat terhubung ke dalam daripada ke luar — ia bisa berada di dalam satu component, dan satu component bisa memuat beberapa community."

**F10 — Gambar vs lab: A3 ber-degree beda.** Figure M3.2:103: A3 d = 4 (D1 = {A1,A2,A3}, D2 = {A3,A4,A5}); Lab 1 :197–198: A3 d = 5 (D1 = {A1,A2,A3,A4}, D2 = {A3,A5,A6}). **Fix:** samakan graf gambar dengan Lab 1 (D1 4 anggota), atau beri label eksplisit "contoh A"/"contoh B" di badan teks, bukan hanya caption.

**F11 — "Enam status bayar" tanpa PAY_1.** M3.1:52: "enam status bayar PAY_0, PAY_2, PAY_3, PAY_4, PAY_5, PAY_6" — benar (UCI memang tidak punya kolom PAY_1), tapi pembaca mengira typo. **Fix:** tambahkan "(dataset UCI memang tidak punya kolom PAY_1 — penomoran aslinya melompat dari PAY_0 ke PAY_2)".

## Angka yang terverifikasi cocok (30 item, hitung ulang DeepSeek — spot-check induk cocok)

Cluster KMeans (3.183+9.837+16.971+9 = 30.000; Σ n·default ≈ 6.636 pembulatan); IsolationForest 655/1.500 = 0,4367, 655/6.636 = 9,87%; rata-rata UTIL 0,4238 lintas M3.1→M3.4; lab M3.1 (centroid, z 2,2431/1,6679); M3.2 (36/60 = 0,60; rasio 32,3x; lift +0,1817; exp(0,2877) = 1,3334; lab degrees [3,3,5,3,2,2,1,1]); M3.3 bands Σ n = 30.000; Benford BILL_AMT1 chi2 = 92,3, MAD 0,0051; lab Benford chi2 = 4,9577; M3.4 peer bands Σ n = 30.000; |z|>2: 788 (2,63%), 580/788 = 73,60%; z(13252) = 6,67; lab M3.4 (mean 1,2250, sd 1,3226, z 1,4933); M3.5 precision@100/500/1000 (0,8600/0,7260/0,6060); confusion threshold 0,10 (TP 1.199 + FP 2.963 + TN 1.710 + FN 128 = 6.000); fairness SEX (FPR 0,6888 vs 0,5985); lab M3.5 EV (185.133/246.444/307.555 dengan 61.911 — benar, jangan diubah); Siskamling (PR-AUC 0,986; t_close 0,010; t_esc 0,135; ≥2 sinyal — konsisten penulisan).

## Angka yang TIDAK cocok (5)

(a) EV M3.5 vs 61.911 (F1); (b) 22.473.693 − 100.000 (F1); (c) 1,1466 (F5); (d) dekomposisi "selisih precision × k × C" (F4); (e) 867/390 vs 1.512/28.488 (F2).

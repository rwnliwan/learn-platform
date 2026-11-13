# REVIEW DEEPSEEK M5 — Optimization & Portfolio Construction
# Laporan gabungan + VERIFIKASI INDUK (Chief)
# Dibuat: 13 Nov 2026 ~00:50 WITA. Mentah per lesson:
#   ~/workspace/learn-platform/review_deepseek_m5m5{1..5}.txt

## Vonis per lesson
- M5.1 Gradient Descent: **APPROVE-WITH-FIXES** (0M / 1S / 4N)
- M5.2 Constrained Optimization / Lagrange: **REVISE** (2M / 2S / 3N)
- M5.3 Markowitz / Efficient Frontier: **APPROVE-WITH-FIXES** (1M / 1S / 3N)
- M5.4 Risk Parity / Budgeting: **APPROVE-WITH-FIXES** (1M / 3S / 2N)
- M5.5 Black-Litterman / Shrinkage: **APPROVE-WITH-FIXES** (1M / 1S / 2N)
- **Total: 5 MUST-FIX / 8 SHOULD-FIX / 14 NIT = 27 temuan**

## Hasil verifikasi induk (Chief) — 26/27 BENAR, 1 perlu jalankan lab
Semua temuan diverifikasi ke sumber: hitung ulang independen dari
`qa-learn/m5_canonical.json` + rumus, dan grep kutipan persis di file TS.
Ringkasan hitung ulang kunci (semua cocok dengan DeepSeek):
- M5.1 S1: f langkah-11 η=0,05 = **1,5756** (bukan 1,9452 = nilai langkah-10);
  η=0,09 langkah-11 = **1,3838** ✓. N1: 133869,2748/180 = **743,7 ≈ 744×**
  (bukan 700×). N3: 0,4251² = **0,180710** ≠ 0,180734 (pembulatan).
- M5.2 M1: S([0;0;1]) = **0,0590** vs S(2·[0;0;1]) = **0,1089** → TIDAK
  sama; klaim homogenitas SALAH. Bukti tambahan Chief: lesson KONTRADIKSI
  INTERNAL — prose Langkah 7 (:163) mengklaim homogen, sementara opsi kuis
  Q6 (:503, ditandai "salah") memuat penalaran yang BENAR (0,0590 vs 0,1089).
  Fix harus memperbaiki prose DAN menandai ulang Q6.
- M5.2 M2: V(1,01)−V(1) = **+0,00192 (NAIK)** — "menurunkan" salah arah;
  kesalahan juga ada di opsi kuis Q2 (:466, ditandai correct).
- M5.2 S1: closed-form return **−0,19003 ≈ −0,1900** vs SLSQP **−0,19026
  ≈ −0,1903** — "keduanya sepakat −0,1903" salah; vol sama 0,2966.
- M5.3 M1: frontier kanonis [ret, vol, w]: return −0,1903; −0,1517; −0,1132;
  −0,0746; −0,0361; **+0,0025; +0,0410; +0,0796** → **TIGA titik positif**,
  bukan satu. Lesson sendiri (:74) mendaftar 8 titik itu, tapi prose (:75,
  :121), caption, dan stem Q7 (:560) mengklaim "hanya ujung UNVR".
- M5.4: kanonis gmv_rc [0,5526; 0,27; 0,1774], maxsharpe_rc [0; 0; 1],
  equalweight_rc [0,2499; 0,3364; 0,4137]. M1: MS 1,0000 > GMV 0,5526 →
  "GMV paling terkonsentrasi" SALAH (lesson :145/:347 sendiri menulis MS
  100%). M2: spread GMV 0,3752 > EW 0,1638 → "EW paling timpang" SALAH.
  S1: efek sum-preserving = **+0,0011** (bukan 0,0039; 0,0039 hanya bila
  bobot lain TETAP). S2: lab `risk_contrib` = w_i·(Σw)_i TANPA /σ_p
  (:247/:253/:277) vs rumus Langkah 3.
- M5.5 M1: lab2 prose (:324) label "rf = 0,05", tapi kode `max_sharpe_w`
  (:383-384) = Σ⁻¹·Mu TANPA (μ−rf) → bobot [0,7836; 0,2164] adalah rf=0;
  bila rf=0,05 benar, long-only max-Sharpe = [1,0]. S1: w·M = **0,2354**,
  +rf = **0,2854** (M = excess return, tak dijelaskan).

### Per temuan (verdict Chief)
- **M5.1 S1 BENAR** — ganti "(f 1,3838 vs 1,9452 di langkah ke-10)" →
  "(f 1,3838 vs 1,5756, keduanya langkah ke-11)".
- **M5.1 N1 BENAR** — "700 kali" → "±740 kali".
- **M5.1 N2 BENAR** — korelasi 0,3488 bukan "searah sepertiga waktu".
- **M5.1 N3 BENAR** — tambah catatan pembulatan (vol presisi 0,425128).
- **M5.1 N4 BENAR** — longgarkan klaim GD untuk LR/GBM.
- **M5.2 M1 BENAR** — ganti argumen homogenitas dengan argumen
  skala-asimptotik (→ supremum 0,6718); perbaiki juga Q6 (opsi C yang
  ditandai "salah" justru benar — tulis ulang opsi/penanda).
- **M5.2 M2 BENAR** — "menurunkan" → "menaikkan" (+0,0019); perbaiki Q2.
- **M5.2 S1 BENAR** — tulis closed-form −0,1900 vs SLSQP −0,1903
  (selisih 0,0003); vol sama 0,2966.
- **M5.2 S2 PERLU JALANKAN LAB** — hitung ulang dari bobot kanonis:
  selisih w3 tak-bulat = 0,00077 → `{:.4f}` = **0,0008**. Tapi guard
  lab_regression saat ini PASS (1937/0), jadi lab kemungkinan mencetak
  0,0007 dari Σ lab (dibulatkan 6 desimal). Koordinator fix WAJIB
  menjalankan lab, melaporkan angka tercetak sebenarnya, lalu
  menyelaraskan prose (:114), expected (:342), pola check (:436) dan
  summary (:537) ke angka itu. Jangan ubah angka tanpa bukti run.
- **M5.2 N1 BENAR** — sebutkan basis persen (0,15% dari bobot / 0,08%
  dari total dana).
- **M5.2 N2 BENAR (nit visual)** — caption vs marker + spacing sumbu-x
  log; perbaiki caption/marker.
- **M5.2 N3 BENAR** — tag "[notebook]" → "[turunan/derived]" (kanonis
  hanya punya two_asset_gmv_w_*).
- **M5.3 M1 BENAR** — 4 tempat: Langkah 1, Langkah 4 prose, caption,
  stem Q7 → "tiga titik teratas (0,0025; 0,0410; 0,0796) di atas return
  0; lima sisanya negatif".
- **M5.3 S1 BENAR** — "Tiga titik aset tunggal (BBCA, KLBF)" → "Dua".
- **M5.3 N1 BENAR** — catatan pembulatan diagonal Σ.
- **M5.3 N2 BENAR** — "rata-rata volatilitas (yang akan menjadi vol EW
  bila korelasi = 1)".
- **M5.3 N3 BENAR** — tambah kalimat: bobot lab bergeser hingga ~0,003
  dari kanonis akibat pembulatan Σ (vol ≤0,0001).
- **M5.4 M1 BENAR** — hapus superlatif atau batasi ke "di antara tiga
  portofolio terdiversifikasi (GMV/RP/EW)"; prose + caption.
- **M5.4 M2 BENAR** — hapus "paling" atau batasi ke "di antara EW dan RP".
- **M5.4 S1 BENAR** — "dengan bobot lain menyesuaikan" → "dengan bobot
  lain TETAP (ceteris paribus)".
- **M5.4 S2 BENAR** — selaraskan definisi `risk_contrib` (bagi σ_p) atau
  labeli eksplisit "RC tak-ternormalisasi; share = rc/vol²".
- **M5.4 N1 KONDISIONAL** — shares komponen VaR M4.4 (0,2532/0,3370/
  0,4098 vs pembagian langsung 0,2531/0,3364/0,4105): cek ke kanonis
  M4.4 saat fix; selisih ≤0,0007 (pembulatan).
- **M5.4 N2 KONDISIONAL** — klaim perilaku default SLSQP tak
  terverifikasi dari kanonik: verifikasi di environment target atau
  turunkan ke kualitatif.
- **M5.5 M1 BENAR** — hapus "rf = 0,05" dari label lab2 (atau "rf
  diabaikan / rf = 0 untuk ilustrasi"); selaraskan dengan hints.
- **M5.5 S1 BENAR** — tambah klausa: "return 0,2854 = w·M + rf (M
  adalah excess return)".
- **M5.5 N1 BENAR** — "SE-nya sebesar estimasinya" → "SE bahkan lebih
  besar dari estimasinya (0,5807 vs 0,4831)" (lesson :97 sudah benar,
  :100 salah — kontradiksi internal).
- **M5.5 N2 BENAR** — bedakan "delta shrinkage" vs "delta risk-aversion".

### Catatan proses (Chief) — triase gate build MELeset
Saat build, concept gate mem-flag homogenitas Sharpe dan koordinator
men-triase-nya NOISE. Verifikasi ini membuktikan flag itu BENAR:
prose M5.2 :163 salah secara matematis dan bertentangan dengan kuis Q6
di lesson yang sama. Pelajaran: triase "noise" atas flag gate WAJIB
menyertakan hitung ulang dari angka lesson sendiri (di sini Q6 sudah
memuat buktinya); bila ragu, flag diteruskan ke Chief, bukan ditriase
sendiri. QA ronde fix: kunci klaim homogenitas sebagai must-not
("Sharpe ratio adalah HOMOGEN derajat nol", "pembilang dan penyebut
sama-sama diskalakan") + kelas concept gate baru.

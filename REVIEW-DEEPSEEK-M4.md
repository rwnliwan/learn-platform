# Review DeepSeek M4 — Machine Learning Finance (12 Nov 2026)

**Reviewer:** DeepSeek via Kelontong (`deepseek-v4.1-flash`), 5 panggilan terpisah
satu per lesson, input sama (file TS lesson + `qa-learn/m4_canonical.json`).
**Verifikasi induk:** SEMUA 37 temuan diverifikasi ke sumber (hitung ulang dari
data lab/CSV pin `data/m4_prices.csv`, grep kutipan di file TS, `m4_canonical.json`).
**Vonis per lesson:** 5/5 APPROVE-WITH-FIXES.
**Total:** 5 must-fix, 16 should-fix, 16 nit = **37 temuan, 37/37 BENAR**
(dengan 2 koreksi/nuansa chief pada M4.1-N9 dan M4.5-M1, lihat bawah).

Catatan chief: DeepSeek TIDAK menangkap catatan induk soal korelasi M4.2
tanpa label log-return (masuk fix dari catatan induk). Korelasi antar saham
kanonis (0,361/0,285/0,3001) adalah korelasi LOG-return; lesson M4.2
mengutip "korelasi 0,285–0,361" tanpa label basis sementara VaR di lesson
yang sama berbasis simple return.

---

## M4.1 `mlf-m41-random-forest-ensembles` — APPROVE-WITH-FIXES (2 must, 6 should, 2 nit)

### Must-fix
- **M1 (lab1, prose):** "dua titik bandel (x = 4 label 1, x = 7 label 0,
  x = 11 label 0)". SALAH dua hal: ada TIGA titik, dan x = 7 label **1**,
  bukan 0. Bukti: `ys = [0,0,0,1,0,0,1,0,1,1,0,1]` → y(4)=1, y(7)=1,
  y(11)=0 (x 1-based). Perbaiki prose (array benar, jangan diubah).
- **M2 (langkah 7 leakage, Tips):** "anggap skornya sebagai batas ATAS
  yang optimistis" BERTENTANGAN dengan paragraf yang sama di langkah itu:
  "di dataset lain ia bisa menggelembungkan 10pp atau — bila rezim berubah
  — justru meremehkan". Random CV tidak dijamin batas atas. Perbaiki:
  "skor optimistis yang tidak dapat diandalkan; sering menjadi batas atas,
  tetapi bisa juga meremehkan".

### Should-fix
- **S3 (langkah 1 & 12):** tanggal window "2024-11-01 sampai 2026-11-12"
  vs kanonis `last = 2026-11-11`. Bedakan eksplisit tanggal unduhan/pin
  (2026-11-12) vs baris data terakhir (2026-11-11). Kelas sama dengan
  M4.2-S2 / M4.3-N4.
- **S4 (langkah 2):** "menebak turun terus-menerus saja sudah benar 58,04
  persen hari. Itulah patokan ... naive-majority ... mencapai 0,5625".
  58,04% = base rate turun KESELURUHAN (267/460); 0,5625 = naive
  walk-forward (90/160 hari uji). Patokan model = 0,5625, bukan 0,5804.
  Jelaskan kedua angka.
- **S5 (langkah 11 lab2):** "hari 3, 4, 7, 9, 11, 13, 14, 19" adalah
  INDEKS 0-based dari `random.Random(7).sample(range(3, 20), 8)`,
  bukan nomor hari 1-based. Hari 1-based-nya: 4, 5, 8, 10, 12, 14, 15, 20.
  Beri label "indeks" atau konversi. (Uji kronologis memakai hari 13–20
  1-based = indeks 12–19, sesuai hint — konvensi dicampur.)
- **S6 (langkah 3 bagging, quiz why):** "300 pohon sudah jauh melewati
  titik jenuh" TANPA bukti — tidak ada kurva OOB-vs-n_estimators di
  lesson/notebook/kanonis (notebook hanya memakai n_estimators=300).
  Lunakkan atau tampilkan kurva.
- **S7 (langkah 4 boosting):** "Boosting menghafal noise lebih cepat
  daripada bagging" tidak diukur — tidak ada train accuracy GBM di
  kanonis (hanya RF train 1,0000). Lunakkan ("GBM paling lemah di sini")
  atau beri bukti train accuracy / learning curve.
- **S8 (langkah 8 importance):** "tidak ada pula fitur yang bisa dibuang
  tanpa kehilangan apa-apa" melebihi angka — importance 0,1901–0,2084
  nonzero tidak membuktikan fitur itu perlu; tidak ada ablation.
  Lunakkan ("perlu uji ablation").

### Nit
- **N9 (langkah 1, catatan replikasi):** "skor model pohon dari unduhan
  ulang bisa bergeser ±1–2 poin persentase" — **KOREKSI CHIEF: angkanya
  BENAR** (re-run live builder: RF 0,5250 → 0,5063–0,5188 = −1,87pp;
  GBM 0,5062 → 0,4938–0,5125; OOB ±0,65pp). Yang kurang: spread itu
  tidak DITAMPILKAN di lesson. Fix = tampilkan spread observasi,
  bukan hapus klaim.
- **N10 (langkah 5 figure):** bar naive di y=62,6 (tinggi 143,4),
  seharusnya y=63,0 (tinggi 143,0). Skala sumbu: 0,40→206, 0,60→30 =
  880 px/unit; 0,5625 → 206 − 0,1625×880 = 63,0. Saat ini 62,6 = 0,5630.

---

## M4.2 `mlf-m42-var-expected-shortfall` — APPROVE-WITH-FIXES (1 must, 2 should, 4 nit)

### Must-fix
- **M1 (lab2, checks[2].msg):** "ES95 historis 0,1200 — rata-rata dua
  hari crash (-0,08 dan -0,12)". Rata-rata keduanya = 0,10, bukan 0,12.
  Hitung ulang dari data lab2 (20 return): q05 = −0,0820 (pos 0,95),
  tail = [−0,12] saja → ES95 = 0,1200 dari SATU observasi. Angkanya
  benar, penjelasannya kontradiksi dengan angka itu sendiri.

### Should-fix
- **S1 (lab1, prose):** "tambah satu hari -0,08 ke data ini, dan ES95
  berubah banyak sementara VaR95 nyaris tidak bergerak". Hitung ulang:
  n=21 → q05 = −0,0500 → VaR95 0,0405 → 0,0500 (**+23,5%**);
  ES95 0,0500 → 0,0650 (tail [−0,08, −0,05]). VaR TIDAK "nyaris tidak
  bergerak". Perbaiki klaim (pakai n jauh lebih besar / titik di dalam
  ekor yang ada).
- **S2:** tanggal tidak konsisten — colab "window 2024-11-01 sampai
  2026-11-12" vs cerita/var "1 Nov 2024–11 Nov 2026". Kanonis
  `last = 2026-11-11` (480 return); 2026-11-12 = window harga (481
  baris). Bedakan eksplisit.

### Nit
- **N1:** rupiah dari VaR tak-dibulatkan: 0,0286 × Rp100 jt = 2.860.000
  ≠ Rp2.856.323 (dari 0,028563). Nyatakan basis tak-dibulatkan di
  samping angka rupiah (horizon sudah menyebut 0,028563).
- **N2:** "sekitar 22 persen lebih rendah" — (0,036933−0,0286)/0,036933
  = 22,56% → seharusnya ~23%.
- **N3:** trio95 "mean dan kovarians historis" vs montecarlo "matriks
  kovarians return log" — basis tidak konsisten antar langkah.
- **N4:** "kerugiannya bisa berapa saja, termasuk 0,0775 (ES99 historis)
  atau lebih" — ES99 adalah rata-rata ekor, bukan kerugian satu hari.

---

## M4.3 `mlf-m43-var-backtesting-volatility` — APPROVE-WITH-FIXES (1 must, 2 should, 5 nit)

### Must-fix
- **M1 (langkah 8 garch, "Baik atau buruk"):** "forecast 1 hari (0,0203)
  berada di antara volatilitas terakhir (0,0225) dan level jangka panjang
  (0,0231)". SALAH: 0,0203 < 0,0225 < 0,0231 — forecast DI BAWAH
  keduanya. Verifikasi: long-run var = 7,454e-5/(1−0,8602) = 5,33e-4
  → vol 0,0231; forecast var 0,0203² = 4,12e-4 < σ²_t 0,0225² = 5,06e-4.
  Cerita mean-reversion-nya justru dibantah angka ini (suku α·r²_t kecil
  karena return terakhir kecil).

### Should-fix
- **S1 (langkah 8 garch):** "volatilitas ditarik kembali ke level jangka
  panjang ω / (1 − α − β)" — ω/(1−α−β) = 5,33e-4 adalah long-run
  VARIANCE; long-run VOL = √5,33e-4 = 0,0231. formulaNote sendiri sudah
  benar ("Long-run variance = ..."). Perbaiki prose.
- **S2 (langkah 9 ewma-vs-garch):** "GARCH memakai forecast 1 hari
  (0,0203) yang sudah ditarik ke bawah menuju level jangka panjang" —
  menyesatkan: 0,0203 sudah DI BAWAH level jangka panjang 0,0231, bukan
  sedang menuju ke sana dari atas. Turun karena return terakhir kecil.

### Nit
- **N1 (langkah ewma):** "0,06 × 0,94^9 ≈ 0,035" — benar 0,06 × 0,5730
  = 0,0344 ≈ **0,034**.
- **N2 (langkah cerita):** "VaR95 historisnya 0,0286 … Di atas Rp100
  juta, itu Rp2.856.323" — 0,0286 × 100 jt = 2.860.000 (kelas sama
  dengan M4.2-N1).
- **N3 (langkah garch + kuis Q6):** "hampir seminggu" untuk half-life
  4,6 hari (ln(0,5)/ln(0,8602) = 4,60). Ganti "sekitar 4–5 hari".
- **N4 (mulai vs colab):** "480 hari 2024-11-01 sampai 2026-11-11" vs
  "window 2024-11-01 sampai 2026-11-12" — sama-sama benar untuk deret
  berbeda (return vs harga), tapi tidak dijelaskan. Tambah satu klausa.
- **N5 (cerita/ewma):** "0,0196 (tahunan 0,3114)" dan "0,0366 …
  tahunan 0,5804" — 0,0196×√252 = 0,3111; 0,0366×√252 = 0,5810.
  Angka tahunan dari daily tak-dibulatkan (0,019617 → 0,3114;
  0,036561 → 0,5804). Catatan satu baris cukup.

---

## M4.4 `mlf-m44-greeks-risk-decomposition` — APPROVE-WITH-FIXES (0 must, 3 should, 2 nit)

Angka kanonis + kedua lab terverifikasi cocok persis (d1 = 0,1750,
d2 = 0,0750, call = 4,6150; lab 2 port_sd = 0,02110, VaR95 = 0,03470,
share B 64,04%).

### Should-fix
- **S1 (langkah 5 vega-theta-rho):** "dalam 3 bulan, theta saja
  menggerogoti sekitar $214 bila semua input lain diam, lebih dari
  separuh harga call 388,03". Linear 2,3801 × 90 = 214,21 — TAPI theta
  mempercepat saat T→0; dengan S tetap = K, di expiry call = 0
  (intrinsik 0), jadi peluruhan total = **388,03 (100%)**, bukan ~55%.
  Estimasi linear meremehkan ~45% dan menyiratkan sisa ~$174 yang
  tidak ada. Perbaiki: peluruhan kumulatif 388,03; "lebih dari
  separuh" tetap benar.
- **S2 (langkah 5 Tips):** "vega paling besar pada opsi ATM dan jangka
  menengah". SALAH: vega ATM = S·√T·φ(d1) tumbuh dengan √T.
  T=0,25 → 14,99; T=1 → d1 = 0,3351, φ = 0,3774, vega/1pp ≈ **28,74**
  (hampir 2×). Vega puncak di jangka PANJANG, bukan menengah.
- **S3 (langkah 7 beta):** "Beta … memakai korelasi yang sama dengan
  yang dipakai dekomposisi di langkah 6". SALAH: dekomposisi memakai
  kovarians ANTAR saham (0,361/0,285/0,3001); beta memakai korelasi
  saham vs ^GSPC (0,0570/0,0706/0,0076). Dua himpunan korelasi yang
  sama sekali berbeda. Perbaiki: keduanya memakai kovarians, tapi
  pasangan berbeda.

### Nit
- **N1 (langkah 4 delta-gamma):** "persis perkiraan delta: 0,5665 ×
  76,19 ≈ $43,16" — "persis" bertentangan dengan "≈"; 0,5665×76,19
  = 43,156 → 43,16, sementara realisasi 43,17. Hapus "persis".
- **N2 (kuis Q4, distractor):** "Jumlah VaR tiap aset (0,0290 + 0,0380
  + 0,0438) jauh lebih besar dari 0,0324" — penjumlahan VaR tanpa
  bobot (0,1108) vs VaR portofolio equal-weight. Yang setara:
  (0,029+0,038+0,0438)/3 = 0,0369, hanya sedikit di atas 0,0324.
  Timbang atau rumuskan ulang.

---

## M4.5 `mlf-m45-drawdown-regime-stress` — APPROVE-WITH-FIXES (1 must, 3 should, 3 nit)

### Must-fix
- **M1 (langkah 2 cerita + kuis Q7):** "BBCA jatuh dengan log return
  −0,1603 (sekitar −16,0%), KLBF −0,1573 (−15,7%), UNVR −0,1344
  (−13,4%)" dan "BBCA jatuh dengan log return −0,0892 (sekitar −8,9%)".
  Verifikasi dari CSV pin (2026-10-16): BBCA simple −0,1481 / log
  −0,1603; KLBF simple −0,1456 / log −0,1573; UNVR simple −0,1258 /
  log −0,1344. Angka −0,1603 dst. adalah LOG return; persen yang
  benar: BBCA **−14,8%**, KLBF **−14,6%**, UNVR **−12,6%**, 8-Apr
  **−8,5%** (exp(−0,0892)−1 = −0,0853). **KOREKSI CHIEF atas saran
  DeepSeek:** "relabel ke simple return" SAJA tidak cukup — bila
  dilabel simple, ANGKANYA juga harus diganti (−0,1481/−0,1456/
  −0,1258). Fix paling bersih: pertahankan angka log, perbaiki
  persennya (−14,8/−14,6/−12,6/−8,5). Langkah 1 sendiri menyatakan
  drawdown memakai simple return.

### Should-fix
- **S1 (langkah 2):** "pada hari itu, korelasi antar saham mendekati 1"
  — korelasi rata-rata regime high-vol hanya 0,3752 (low 0,2775);
  tidak ada angka korelasi harian 16-Okt di kanonis. Overstate.
- **S2 (langkah 4, diulang 5/13 + kuis Q2):** "UNVR maxDD −0,4925
  (2024-12-10 → 2025-02-28), PULIH 2025-10-16, saat ini −0,4051" —
  kedua angka benar (rec 2025-10-16, dd_current −0,4051), tapi
  berdampingan menyesatkan tanpa penjelasan "pulih lalu jatuh lagi
  −40,51% dari puncak baru". Tambah klarifikasi.
- **S3 (langkah 5):** "BBCA belum pulih setelah lebih dari 1 tahun
  (lembah 2026-06-08, masih −0,4441 di bawah puncak pada 2026-11-11)"
  — lembah→sekarang hanya ~5 bulan; ">1 tahun" hanya benar dari
  puncak 2024-11-05 (>2 tahun). Basis waktu dicampur dengan UNVR
  (8 bulan DARI lembah). Perjelas basisnya.

### Nit
- **N1 (langkah 2 note vs langkah 9):** "volatilitas harian yang biasa
  (0,0196)" vs "vol harian portofolio (log return) normal 0,0197" —
  0,0196 = sd simple return, 0,0197 = sd log return. Beri label.
- **N2 (langkah 6):** "persentil 75 … 105 hari high-vol vs 375 hari
  low-vol" — 25% dari 480 = 120, tapi high-vol = 105 (21,9%) karena
  persentil dihitung atas 421 nilai rolling-vol valid (480−60+1).
  25% × 421 = 105,25 → 105. Jelaskan mekanismenya.
- **N3 (langkah 9/13):** "0,0267 (+35,3%)" dan "0,0262 (+33,1%)" —
  dari angka tampil: 0,0267/0,0197−1 = +35,5%; 0,0262/0,0197−1 =
  +33,0%. Angka +35,3%/+33,1% dari nilai unrounded (kelas sama
  dengan M4.2-N1/M4.3-N2/N5).

---

## Ringkasan

| Lesson | Must | Should | Nit | Vonis |
|---|---|---|---|---|
| M4.1 | 2 | 6 | 2 | APPROVE-WITH-FIXES |
| M4.2 | 1 | 2 | 4 | APPROVE-WITH-FIXES |
| M4.3 | 1 | 2 | 5 | APPROVE-WITH-FIXES |
| M4.4 | 0 | 3 | 2 | APPROVE-WITH-FIXES |
| M4.5 | 1 | 3 | 3 | APPROVE-WITH-FIXES |
| **Total** | **5** | **16** | **16** | **37 temuan** |

**Tugas ronde fix:** perbaiki 37 temuan + catatan induk korelasi M4.2
(label basis log-return); sinkronkan TS + .md; update QA (fixture
must-not untuk frasa salah yang string-lockable + kelas concept gate
baru untuk pola semantik); concept gate re-run sampai PASS; lalu gap
Luna.

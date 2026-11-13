# MLF-M4.3: Backtesting VaR & Volatilitas — Apakah VaR-mu Jujur?

## Masalah: VaR yang Lolos di Atas Kertas — Lalu Oktober 2026 Datang

Risk manager portofolio saham Indonesia (BBCA, KLBF, UNVR, bobot sama, rebalance harian) melaporkan satu angka tiap pagi: VaR95 satu hari. Selama hampir dua tahun angka itu terlihat masuk akal. Lalu Oktober 2026 datang: pasar jatuh, volatilitas meledak, dan kerugian yang «seharusnya» terjadi sekali dalam 20 hari tiba-tiba datang beruntun.

Portofolio equal-weight ini, 480 hari perdagangan 2024-11-01 sampai 2026-11-11 (window harga sampai 2026-11-12 = 481 baris; return-nya berakhir 2026-11-11, jadi 480 return), punya volatilitas harian 0,0196 (tahunan 0,3114) dan return tahunan −0,1406 [notebook]. VaR95 historisnya 0,0286 — pada Rp100 juta, Rp2.856.323 (dari VaR tak-dibulatkan 0,028563; memakai 0,0286 yang dibulatkan hasilnya Rp2.860.000). Tapi angka itu rata-rata atas dua tahun yang tidak homogen: ada masa tenang dan ada masa badai. Volatilitas BBCA yang diukur EWMA pada hari terakhir mencapai 0,0366 per hari (tahunan 0,5804) — hampir dua kali rata-rata EWMA-nya 0,0200 [notebook]. VaR yang dihitung dari rata-rata dua tahun meremehkan risiko tepat di hari-hari ketika risiko itu paling besar. Catatan: angka tahunan dihitung dari daily tak-dibulatkan — 0,019617 × √252 = 0,3114 dan 0,036561 × √252 = 0,5804.

---

## 1. Uji Kupiec

Backtesting VaR paling sederhana: apakah pelanggaran terjadi sesering yang dijanjikan VaR? VaR95 menjanjikan pelanggaran pada 5 persen hari (p = 0,05). Uji Kupiec (1995) membandingkan dua penjelasan atas data: H0 — pelanggaran terjadi dengan probabilitas p yang dijanjikan — melawan H1 — pelanggaran terjadi dengan probabilitas x/n yang teramati. Statistiknya likelihood ratio (LR); di bawah H0, LR menyebar kira-kira chi-square 1 derajat kebebasan, p-value = P(chi2(1) ≥ LR). Tolak H0 bila p < 0,05; bila p ≥ 0,05, H0 TIDAK ditolak — «tidak ada bukti VaR-mu bohong», bukan «terbukti VaR-mu benar».

**Nilai:** bila x sama dengan ekspektasi n×p, LR = 0 — tidak ada bukti melawan H0. Bila x jauh dari ekspektasi, LR membesar.

**Baik/buruk:** Kupiec bagus karena sederhana dan langsung menjawab «apakah frekuensinya benar?». Buruk karena ia HANYA menguji frekuensi, bukan independensi: pelanggaran beruntun lima hari berturut-turut bisa lolos selama jumlah totalnya tepat.

**Mitigasi:** pakai Kupiec sebagai gerbang pertama, bukan terakhir. §4 mengajarkannya penuh: uji Christoffersen menambahkan uji independensi (apakah pelanggaran hari ini bergantung pada pelanggaran kemarin) di samping uji frekuensi Kupiec.

$$LR_{POF} = -2\ln\left[(1-p)^{n-x} p^{x}\right] + 2\ln\left[\left(1-\frac{x}{n}\right)^{n-x} \left(\frac{x}{n}\right)^{x}\right]$$

(n = jumlah hari, x = jumlah pelanggaran, p = probabilitas pelanggaran yang dijanjikan VaR. Di bawah H0, LR ~ chi2(1).)

---

## 2. Jebakan In-Sample: VaR Historis SELALU Lolos

**Nilai [notebook]:** seluruh 480 hari, VaR95 historis dari data itu sendiri, diuji pada 480 hari YANG SAMA: n = 480, pelanggaran 24, ekspektasi 24,0, LR = 0,0000, p = 1,0000.

**Baik/buruk:** backtesting in-sample bagus untuk SATU hal — memeriksa apakah kode hitungmu benar (bila in-sample saja gagal, ada bug). Buruk sebagai bukti validitas model: ia tidak menguji kemampuan model memprediksi hari yang BELUM dilihat.

**Mitigasi:** aturan keras — VaR HARUS diuji out-of-sample: hitung VaR dari jendela masa lalu, uji pada hari BERIKUTNYA yang tidak ikut menghitung VaR itu, geser jendela maju satu hari, ulangi. Bila seseorang menunjukkan backtesting yang «sempurna» (p = 1,0000), pertanyaan pertamamu bukan «bagaimana caranya?» melainkan «apakah ini in-sample?». p-value 1,0000 adalah alarm, bukan piala.

---

## 3. Kupiec Out-of-Sample + Zona Basel

Prosedur jujur: untuk tiap hari ke-t dari hari ke-251 sampai ke-480, hitung VaR historis dari 250 hari SEBELUMNYA, periksa apakah return hari ke-t menembus VaR itu. Total 230 hari uji.

**Nilai [notebook]:** VaR95 — pelanggaran 15 dari 230 hari, ekspektasi 11,5, LR = 1,0275, p = 0,3108 → H0 TIDAK ditolak. VaR99 — pelanggaran 4 dari 230 hari, ekspektasi 2,3, LR = 1,0398, p = 0,3079 → H0 TIDAK ditolak. Zona Basel 99% pada 250 hari terakhir: 3 pelanggaran → GREEN (0–4 hijau, 5–9 kuning, ≥10 merah).

**Gambar:** bar pelanggaran teramati vs ekspektasi — VaR95 15 vs 11,5; VaR99 4 vs 2,3. Pelanggaran di atas ekspektasi pada keduanya, tapi selisihnya tidak cukup besar untuk menolak — p ≈ 0,31 pada keduanya.

**Baik/buruk:** backtesting rolling bagus karena meniru cara model dipakai di produksi. Buruk bila jendela uji terlalu pendek: 230 hari hanya memberi ekspektasi 2,3 pelanggaran pada VaR99, sehingga uji VaR99 hampir tidak punya kuasa — ia hampir selalu «tidak menolak», bahkan untuk model yang buruk.

**Mitigasi:** laporkan SELALU tiga angka berdampingan — jumlah pelanggaran, ekspektasi, dan p-value — plus panjang jendela uji. Jalankan backtesting pada DUA tingkat keyakinan (95 dan 99): model yang lolos di 95 tapi gagal di 99 memberitahumu ekornya yang bermasalah, bukan badannya.

---

## 4. Uji Christoffersen — Kupiec Lolos, tapi Pelanggaran Datang Beruntun

Kupiec §3 bilang VaR95 historis «lolos»: 15 pelanggaran vs ekspektasi 11,5, p = 0,3108. Tapi tanggal pelanggarannya: 26–28 Januari 2026 — TIGA hari beruntun. Lalu 2 dan 4 Maret, 23–24 April, 3 dan 5 Juni, 16 dan 19 Oktober — pelanggaran datang berpasangan, bergerombol di sekitar guncangan. Kupiec hanya menghitung jumlah total, bukan urutannya.

**Nilai [notebook]:** uji Christoffersen (1998) mengubah deret pelanggaran menjadi deret 0/1 (0 = hari tenang, 1 = pelanggaran), lalu menghitung transisi antar hari berurutan. Dari 230 hari uji ada 229 transisi: n00 = 203 (tenang setelah tenang), n01 = 11 (pelanggaran setelah tenang), n10 = 11 (tenang setelah pelanggaran), n11 = 4 (pelanggaran setelah pelanggaran). π01 = n01 / (n00 + n01) = 11 / 214 = 0,0514 — peluang pelanggaran setelah hari tenang, nyaris sama dengan 5 persen yang dijanjikan VaR95. π11 = n11 / (n10 + n11) = 4 / 15 = 0,2667 — peluang pelanggaran setelah pelanggaran: 26,67 persen, LIMA KALI LEBIH BESAR.

**Contoh tersebar vs beruntun:** bila 15 pelanggaran tersebar merata (satu tiap ~15 hari), π11 akan mendekati π01 ≈ 0,05. Yang terjadi: selisih antar pelanggaran berurutan adalah 1, 1, 21, 2, 3, 9, 18, 1, 20, 2, 2, 92, 1, 8 hari — delapan dari empat belas selisih hanya 1–3 hari. Tanggal pelanggaran: 26–28 Jan 2026 (tiga beruntun), 2 Mar, 4 Mar, 9 Mar, 27 Mar, 23–24 Apr, 29 Mei, 3 Jun, 5 Jun, 16 Okt, 19 Okt, 29 Okt.

**Hasil [notebook]:** LR independensi = 6,6456, p = 0,0099 → TOLAK independensi. LR conditional coverage = LR_uc + LR_ind = 7,7056, p = 0,0212 → TOLAK. (Komponen frekuensi LR_uc = 1,0601, p = 0,3032 — sedikit berbeda dari Kupiec §3, LR = 1,0275, p = 0,3108, karena Christoffersen menghitung 229 transisi, bukan 230 hari; kesimpulannya sama.) Vonis lengkap atas VaR95 historis rolling: frekuensi lolos, TAPI model gagal — pelanggaran bergerombol.

**VaR99 — kontras yang jujur [notebook]:** n00 = 222, n01 = 3, n10 = 3, n11 = 1; π01 = 0,0133, π11 = 0,2500; LR independensi = 3,9457, p = 0,0470; LR conditional coverage = 5,0006, p = 0,0821 → TIDAK ditolak. Caveat: n11 = 1 — seluruh «bukti» clustering di VaR99 adalah SATU pasangan beruntun (26–27 Jan). Dengan hanya 4 pelanggaran dari 230 hari, «tidak ditolak» di sini berarti «data terlalu sedikit untuk menuduh», bukan «terbukti independen».

**Sensitivitas Kupiec VaR99 (G9) [notebook]:** n = 230, ekspektasi 2,3 — x = 2 → LR = 0,0413, p = 0,8389; x = 4 (teramati) → LR = 1,0398, p = 0,3079; x = 6 → LR = 4,1667, p = 0,0412 (TOLAK). Dua pelanggaran ekstra membalik keputusan. VaR95 (ekspektasi 11,5): x = 11 → p = 0,8789; x = 15 (teramati) → p = 0,3108; x = 19 → p = 0,0372 (tolak). «Tidak ditolak» pada VaR99 dengan n = 230 hampir tidak memberi informasi — ia kompatibel dengan model jujur MAUPUN model yang pelanggarannya 2,6 kali ekspektasi.

**Baik/buruk:** Christoffersen menguji DUA hal sekaligus — frekuensi (LR_uc) dan independensi (LR_ind) — digabung dalam LR_cc (chi2 2 df). Buruk karena butuh data cukup: pada VaR99, n11 = 1 membuat uji independensi bergantung pada satu pasangan hari. Seperti Kupiec, ia menguji pelanggaran sebagai 0/1: BESARNYA kerugian tidak masuk hitungan.

**Mitigasi:** jalankan Christoffersen berdampingan dengan Kupiec pada SETIAP backtest. Bila LR_ind menolak sementara Kupiec lolos, masalahnya model yang tidak mengikuti volatilitas — pindah ke VaR kondisional (EWMA/GARCH, §6–§9) dan uji lagi. Bila LR_cc tidak menolak pada VaR99, tulis caveat eksplisit: «n = 230, ekspektasi 2,3, kuasa rendah — dua pelanggaran ekstra akan membalik keputusan».

$$LR_{ind} = -2\ln\left[(1-\pi)^{n_{00}+n_{10}} \pi^{n_{01}+n_{11}}\right] + 2\ln\left[(1-\pi_{01})^{n_{00}} \pi_{01}^{n_{01}} (1-\pi_{11})^{n_{10}} \pi_{11}^{n_{11}}\right]$$

(π = peluang pelanggaran tak-bersyarat; π01 = n01/(n00+n01); π11 = n11/(n10+n11). LR_ind ~ chi2(1); LR_cc = LR_uc + LR_ind ~ chi2(2). Tolak bila p < 0,05.)

---

## 5. Volatility Clustering

**Nilai [notebook]:** autokorelasi squared return portofolio (log return) lag 1 = 0,1043, lag 5 = −0,0094, lag 10 = −0,0099. Guncangan volatilitas kemarin masih terasa hari ini, tapi lima hari kemudian jejaknya sudah hilang.

**Gambar:** bar autokorelasi — lag 1 menjulang positif (0,1043); lag 5 dan lag 10 menempel di garis nol.

**Baik/buruk:** klastering bagus untuk model yang mengikutinya — bila volatilitas kemarin tinggi, VaR hari ini SEHARUSNYA lebih besar. Buruk untuk model yang mengabaikannya: VaR tak-kondisional terlalu besar di masa tenang dan terlalu kecil di masa badai, tepat ketika kerugian besar datang. Pelanggaran VaR beruntun bukan karena modelnya «sial», melainkan karena volatilitasnya memang bergerombol sementara VaR-nya diam.

**Mitigasi:** begitu klastering terdeteksi (lag 1 positif), VaR harus dibuat KONDIONAL — EWMA atau GARCH.

---

## 6. EWMA (λ = 0,94)

Varians hari ini = 0,94 × varians kemarin + 0,06 × kuadrat return kemarin. Bobot lama meluruh eksponensial. Dipakai RiskMetrics (J.P. Morgan, 1994).

**Nilai [notebook]:** EWMA BBCA — volatilitas terakhir 0,0366 per hari (tahunan 0,5804), rata-rata 0,0200. VaR95 kondisional-EWMA 0,0601 vs VaR95 parametrik tak-kondisional 0,0372 — VaR kondisional 62 persen LEBIH BESAR. Selisih 0,0229 tepat di hari ketika kerugian besar paling mungkin datang.

**Baik/buruk:** EWMA bagus karena satu parameter, tanpa optimasi numerik, bereaksi cepat terhadap guncangan. Buruk karena TIDAK punya mean-reversion: tidak ada «volatilitas jangka panjang» yang ditarik kembali; persistensinya 1, guncangan secara teori tidak pernah hilang sepenuhnya.

**Mitigasi:** pakai EWMA untuk VaR 1 hari ke depan — di situlah ia paling kuat. Untuk horizon lebih panjang atau bila butuh level jangka panjang yang eksplisit, pindah ke GARCH. Asumsi di sini: VaR kondisional memakai asumsi normal dan mean nol (VaR95 = 1,6449 × vol kondisional) — ekor gemuk tidak ditangkap.

$$\sigma_t^2 = \lambda \sigma_{t-1}^2 + (1-\lambda) r_{t-1}^2$$

(λ = 0,94. VaR95 kondisional, normal, mean 0 = 1,6449 × σ_t.)

---

## 7. GARCH(1,1) — MLE Manual dengan scipy

Varians kondisional = konstanta ω + reaksi terhadap guncangan kemarin (α × kuadrat return kemarin) + ingatan varians kemarin (β × varians kemarin). Bobotnya DIESTIMASI dari data dengan maximum likelihood — bukan dipatok. Paket `arch` TIDAK terpasang di VM dan tidak bisa di-install bersih (PEP 668) — likelihood ditulis eksplisit dan dioptimasi dengan scipy L-BFGS-B dari 3 nilai awal.

**Nilai [notebook]:** GARCH(1,1) BBCA (log return): ω = 0,000075, α = 0,2113, β = 0,6489, persistensi α + β = 0,8602. Volatilitas jangka panjang 0,0231, volatilitas kondisional terakhir 0,0225, forecast volatilitas 1 hari 0,0203, volatilitas tak-kondisional 0,0218. VaR95 kondisional 1 hari 0,0334, VaR99 0,0472. GARCH portofolio: α = 0,1094, β = 0,5833, forecast volatilitas 0,0184.

**Persistensi dan half-life:** half-life = ln(0,5) / ln(0,8602) ≈ 4,6 hari — separuh guncangan volatilitas masih terasa sekitar 4–5 hari kemudian. Konsisten dengan autokorelasi yang menghilang di lag 5.

**Baik/buruk:** GARCH bagus karena punya mean-reversion eksplisit — varians ditarik kembali ke long-run variance ω / (1 − α − β) = 5,33e-4, setara long-run vol 0,0231. Tapi forecast 1 hari (0,0203) justru berada DI BAWAH volatilitas terakhir (0,0225) DAN di bawah level jangka panjang (0,0231) — cerita mean-reversion «ditarik naik menuju 0,0231» dibantah angka ini, karena return terakhir kecil sehingga suku α·r²_t nyaris nol. Buruk karena estimasinya butuh optimasi numerik yang bisa gagal konvergen dan sensitif terhadap nilai awal; asumsi normal bersyarat tetap meremehkan ekor gemuk. GARCH memprediksi BESARNYA pergerakan, bukan ARAHNYA.

**Mitigasi:** jalankan MLE dari beberapa nilai awal dan ambil likelihood terbaik (notebook: 3 start). Laporkan persistensi α + β berdampingan dengan α dan β: α besar + β kecil = «kagetan»; α kecil + β besar = «pelupa lambat». BBCA: α 0,2113, β 0,6489 — bereaksi cukup kuat DAN ingat cukup lama.

$$\sigma_t^2 = \omega + \alpha r_{t-1}^2 + \beta \sigma_{t-1}^2$$

(Persistensi = α + β = 0,8602. Long-run variance = ω / (1 − α − β).)

---

## 8. EWMA vs GARCH — dan VaR Kondisional vs Tak-Kondisional

EWMA ADALAH GARCH dengan parameter yang ditetapkan, bukan diestimasi: ω = 0, α = 1 − λ = 0,06, β = λ = 0,94. Data BBCA bilang: guncangan kemarin lebih penting daripada yang dipatok EWMA (α 0,2113 vs 0,06), dan ingatan varians lebih pendek (β 0,6489 vs 0,94).

**Nilai [notebook]:** VaR95 BBCA — kondisional-EWMA 0,0601, parametrik tak-kondisional 0,0372, kondisional-GARCH 0,0334; VaR99 kondisional-GARCH 0,0472. EWMA memberi VaR95 jauh lebih besar daripada GARCH (0,0601 vs 0,0334) karena EWMA memakai volatilitas TERAKHIR (0,0366, pasca-crash) sebagai titik awal, sementara GARCH memakai forecast 1 hari (0,0203) yang turun karena return terakhir kecil (suku α·r²_t kecil) — bukan karena ditarik menuju level jangka panjang 0,0231; forecast ini justru sudah di bawah level itu. Keduanya «kondisional», tapi kondisional pada hal yang berbeda.

**Gambar:** bar keempat VaR BBCA — EWMA VaR95 0,0601; Param VaR95 0,0372; GARCH VaR95 0,0334; GARCH VaR99 0,0472.

**Baik/buruk:** VaR kondisional bagus karena menjawab «berapa risiko BESOK, given hari ini?» — bukan «berapa risiko rata-rata?». Buruk bila dipakai tanpa memahami horizonnya: EWMA 0,0601 adalah VaR untuk hari ini dengan vol hari ini; GARCH 0,0334 adalah VaR untuk besok dengan forecast besok.

**Mitigasi:** untuk limit harian dan laporan risiko harian, pakai VaR kondisional (EWMA atau GARCH 1-hari). Untuk modal dan stress test, pakai VaR tak-kondisional ATAU VaR kondisional pada skenario volatilitas stress (M4.5). Backtest KEDUANYA dengan Kupiec out-of-sample sudah dijalankan — hasilnya di §9.

---

## 9. Backtest EWMA + GARCH — Frekuensi Membaik, Clustering Tetap Hidup

VaR kondisional EWMA dan GARCH diuji pada jendela yang SAMA dengan VaR historis §3: log return portofolio, hari 251–480, 230 hari uji.

**Nilai — metode, dinyatakan jujur [notebook]:** EWMA λ = 0,94, varians awal = varians 250 log return pertama, VaR95 = 1,6449 × σ dan VaR99 = 2,3263 × σ. GARCH direfit tiap 20 hari pada 250 log return terakhir (12 refit); antar refit parameter tetap, varians difilter maju dengan return terealisasi. Parameter GARCH BERGERAK: α dari 0,1087 (refit 25 Nov 2025) ke 0,333 (refit 1 Okt 2026), β dari 0,7919 ke 0,4264 — model «belajar» pasar makin reaktif.

**Nilai — hasil [notebook]:** VaR95 — historis 15/230 (LR = 1,0275, p = 0,3108), EWMA 12/230 (ekspektasi 11,5; LR = 0,0226, p = 0,8806 — frekuensi TERBAIK dari ketiganya), GARCH 13/230 (LR = 0,1980, p = 0,6564). VaR99 — historis 4/230 (LR = 1,0398, p = 0,3079), EWMA 5/230 (LR = 2,3974, p = 0,1215), GARCH 3/230 (LR = 0,1964, p = 0,6577 — ekor-99 TERBAIK). SEMUA model lolos Kupiec pada kedua level — frekuensi bukan lagi pembeda; yang membedakan adalah DI MANA mereka menang (EWMA di 95, GARCH di 99). Peringkat «terbaik» di ekor-99 rapuh: selisih 5 vs 3 pelanggaran adalah p = 0,1215 vs 0,6577, dan dua pelanggaran ekstra membalik vonis (§4).

**Christoffersen (§4) [notebook]:** EWMA VaR95 — n00 = 208, n01 = 9, n10 = 9, n11 = 3; π01 = 0,0415, π11 = 0,2500; LR_ind = 5,7259, p = 0,0167 → MASIH menolak independensi. GARCH VaR95 — n00 = 206, n01 = 10, n10 = 10, n11 = 3; π01 = 0,0463, π11 = 0,2308; LR_ind = 4,8068, p = 0,0283 → MASIH menolak. VaR kondisional memperbaiki frekuensi, tapi TIDAK menyembuhkan clustering: 26–28 Januari menembus ketiga model sekaligus.

**Cerita 16 Oktober 2026 [notebook]:** return log portofolio −0,1506. VaR95 hari itu: historis rolling 0,0286, EWMA 0,0169, GARCH 0,0228 — VaR KONDISIONAL berada DI BAWAH VaR statis pada hari crash itu sendiri, karena sebelum 16 Oktober pasar sedang TENANG. VaR kondisional bereaksi SETELAH guncangan, bukan sebelum. VaR95 maksimum selama jendela uji: EWMA 0,0664 (21 Okt 2026), GARCH 0,1439 (19 Okt 2026 — overshoot pasca-crash karena α naik ke 0,333). VaR hari terakhir (11 Nov 2026): EWMA VaR95 0,0490, GARCH 0,0315; VaR99: EWMA 0,0694, GARCH 0,0446.

**Baik/buruk:** VaR kondisional bagus untuk LIMIT HARIAN — frekuensinya terbukti paling jujur. Buruk sebagai PERINGATAN DINI: pada hari crash itu sendiri ia justru paling kecil. Buruk bila dipakai mentah-mentah pasca-crash: GARCH 0,1439 sebagai limit harian berarti menahan 14,39 persen modal untuk satu hari.

**Mitigasi — keputusan praktis:** untuk limit harian, pakai VaR kondisional — EWMA bila yang dijaga frekuensi VaR95, GARCH bila yang dijaga ekor-99. Eskalasi bila VaR95 kondisional melebihi 2× VaR statis, atau setelah klaster pelanggaran (dua pelanggaran dalam tiga hari = model tertinggal dari pasar). Selalu laporkan pasangan angkanya: Kupiec untuk frekuensi, Christoffersen untuk independensi.

---

## Lab 1: Uji Kupiec dari Nol

100 hari mainan, 9 pelanggaran VaR95 (hari ke-3, 11, 18, 27, 34, 52, 63, 79, 94), ekspektasi 5,0. LR = 2,7510, p-value = 0,0972 [lab] — TIDAK ditolak pada taraf 5 persen. p-value chi2(1) dihitung tanpa scipy: p = erfc(√(LR/2)) dengan math.erfc. «Lebih banyak dari ekspektasi» belum tentu «ditolak».

## Lab 2: EWMA dari Nol

6 return mainan (+0,010, −0,020, +0,015, −0,005, +0,030, −0,010), λ = 0,94, varians awal 0,0004 (vol awal 0,0200). Vol akhir 0,0192 [lab]. Return +0,030 pada hari ke-5 menaikkan vol dari 0,0188 ke 0,0196 — EWMA bereaksi, tapi tidak panik: bobot return terbaru hanya 0,06.

## Guided Task di Colab

Notebook: colab/mlf-m43-guided-task.ipynb — Kupiec in-sample + out-of-sample + zona Basel + autokorelasi squared return + EWMA + GARCH(1,1) manual MLE dengan scipy di data BBCA/KLBF/UNVR (window 2024-11-01 sampai 2026-11-12 — 481 baris harga; return-nya 480 hari sampai 2026-11-11), lengkap dengan checks. Tautan Colab: https://colab.research.google.com/drive/1kWn66EK-dFYQJRoeo2hmnP9WAv7X5MQL

## Rangkuman

- Kupiec menguji frekuensi pelanggaran dengan likelihood ratio; tolak bila p < 0,05; ia hanya menguji frekuensi, bukan independensi (§4: Christoffersen — dan VaR95 historis justru GAGAL di sana, LR_cc = 7,7056, p = 0,0212).
- Kupiec in-sample: n = 480, pelanggaran 24, ekspektasi 24,0, LR = 0,0000, p = 1,0000 — jebakan konstruksi, bukan bukti.
- Kupiec out-of-sample (rolling 250 hari, 230 hari uji): VaR95 pelanggaran 15 vs 11,5 (LR = 1,0275, p = 0,3108), VaR99 pelanggaran 4 vs 2,3 (LR = 1,0398, p = 0,3079) — keduanya tidak ditolak, dan kali ini artinya sesuatu.
- Zona Basel 99% pada 250 hari terakhir: 3 pelanggaran → GREEN (0–4 hijau, 5–9 kuning, ≥10 merah).
- Christoffersen VaR95 OOS: n00 = 203, n01 = 11, n10 = 11, n11 = 4; π01 = 0,0514 vs π11 = 0,2667 — LR independensi 6,6456 (p = 0,0099), LR conditional coverage 7,7056 (p = 0,0212): TOLAK. VaR99: LR_cc = 5,0006 (p = 0,0821) tidak ditolak — tapi n11 = 1, rapuh.
- Sensitivitas Kupiec VaR99 (n = 230, ekspektasi 2,3): x = 2 → p = 0,8389; x = 4 → p = 0,3079; x = 6 → p = 0,0412 (TOLAK) — dua pelanggaran ekstra membalik keputusan.
- Volatility clustering: autokorelasi squared return lag 1 0,1043, lag 5 −0,0094, lag 10 −0,0099.
- EWMA BBCA (λ = 0,94): vol terakhir 0,0366 (tahunan 0,5804) vs rata-rata 0,0200 — VaR95 kondisional 0,0601 vs tak-kondisional 0,0372.
- GARCH(1,1) manual MLE BBCA: ω = 0,000075, α = 0,2113, β = 0,6489, persistensi 0,8602 (half-life ≈ 4,6 hari), long-run vol 0,0231, forecast vol 0,0203, VaR95 kondisional 0,0334, VaR99 0,0472.
- EWMA = GARCH dengan ω = 0, α = 1 − λ, β = λ.
- Backtest EWMA/GARCH OOS (230 hari): EWMA VaR95 12/230 (p = 0,8806, frekuensi terbaik), GARCH VaR95 13/230 (p = 0,6564), GARCH VaR99 3/230 (p = 0,6577, ekor-99 terbaik). Christoffersen MASIH menolak independensi: EWMA p = 0,0167, GARCH p = 0,0283. 16 Okt 2026: return log −0,1506; VaR95 EWMA 0,0169, GARCH 0,0228, historis 0,0286 — VaR kondisional bereaksi setelah guncangan, bukan sebelum. VaR95 maks OOS: EWMA 0,0664 (21 Okt), GARCH 0,1439 (19 Okt). Limit harian: pakai VaR kondisional; eskalasi bila >2× statis atau setelah klaster pelanggaran.
- Lab: Kupiec 100 hari (LR = 2,7510, p = 0,0972, TIDAK ditolak); EWMA 6 hari (vol akhir 0,0192).

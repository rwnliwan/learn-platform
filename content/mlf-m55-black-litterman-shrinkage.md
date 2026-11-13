# MLF-M5.5: Black-Litterman & Shrinkage — Melawan Estimation Error

## Masalah: Optimizer yang Memaksimalkan Noise

Modul M5 adalah optimisasi portofolio: dari mean-variance dan efficient frontier, ke risk parity dan kendala, ke optimisasi numerik, ke shrinkage dan evaluasi out-of-sample. Lesson ini adalah penutup modul — dan wadah tema yang mengikat seluruh modul: estimation error, atau optimizer's curse. Optimizer bukan musuh; ia hanya melakukan persis apa yang diminta: memaksimalkan Sharpe atas angka-angka yang kamu berikan. Bila angka-angka itu sebagian besar noise, optimizer akan memaksimalkan noise — dengan penuh keyakinan.

Angka acuan lesson ini datang dari notebook M5.5 dan file kanonis m5_canonical.json [notebook]: BBCA.JK + KLBF.JK + UNVR.JK, 480 hari return SIMPLE, window unduhan 2024-11-01 sampai 2026-11-12 (480 hari return: 2024-11-04 s.d. 2026-11-11), rf = 0,05. Split out-of-sample: 240 hari pertama untuk estimasi, 240 hari berikut untuk uji. Return tahunan periode 1: BBCA −0,1257, KLBF −0,1006, UNVR +0,4831. Periode 2: BBCA −0,3634, KLBF −0,4134, UNVR −0,3239. Ledoit-Wolf delta shrinkage 0,0955. Black-Litterman: delta (risk-aversion) 2,5, tau 0,05, view [ilustrasi] «BBCA mengungguli KLBF 2pp per tahun», market proxy equal-weight karena data pin tidak memuat market cap.

---

## 1. Optimizer's Curse: Frontier yang Indah, Realisasi yang Kejam

Optimizer pada 240 hari pertama melihat UNVR naik +48,31 persen per tahun dan berkata: taruh semua uang di UNVR. Max-Sharpe in-sample: return 0,4831, vol 0,5667, Sharpe 0,7644 [notebook]. Lalu 240 hari berikutnya datang, dan UNVR justru −32,39 persen per tahun. Max-Sharpe OOS: return −0,3239, vol 0,4259, Sharpe −0,8780 [notebook].

**Nilai [notebook] — in-sample vs out-of-sample, rf 0,05:**

- **Max-Sharpe [0,0,1]:** IN 0,4831 / 0,5667 / 0,7644 → OOS −0,3239 / 0,4259 / −0,8780.
- **GMV [0,6914; 0,2069; 0,1017]:** IN −0,0586 / 0,2624 / −0,4139 → OOS −0,3697 / 0,3372 / −1,2447.
- **Risk parity [0,4632; 0,2986; 0,2382]:** IN 0,0268 / 0,2812 / −0,0825 → OOS −0,3689 / 0,3160 / −1,3258.
- **Equal-weight [1/3; 1/3; 1/3]:** IN 0,0856 / 0,3088 / 0,1154 → OOS −0,3669 / 0,3140 / −1,3278.
- **GMV-Ledoit-Wolf [0,6282; 0,2409; 0,1308]:** IN −0,0400 / 0,2637 / −0,3412 → OOS −0,3703 / 0,3296 / −1,2752.

**Gambar:** bar return IN vs OOS keempat portofolio pertama — bar IN tersebar dari −0,06 sampai +0,48, bar OOS menumpuk di −0,32 sampai −0,37.

**Kejujuran yang wajib dicatat:** periode 2 adalah crash merata — ketiga saham jatuh −32 persen sampai −41 persen per tahun. TIDAK ADA portofolio yang menyelamatkan return OOS: semua −32 persen sampai −37 persen. Yang berhasil dikendalikan hanya VOL: GMV OOS 0,3372 vs max-Sharpe OOS 0,4259 — kontrol risiko bekerja, prediksi return gagal.

**Baik/buruk:** optimisasi bagus bila inputnya punya sinyal. Buruk bila inputnya didominasi noise: optimizer justru MEMPERBESAR kesalahan estimasi, karena ia menaruh bobot terbesar pada aset yang estimasinya paling berlebihan (UNVR +48 persen).

**Mitigasi:** jangan pernah menilai portofolio dari statistik in-sample-nya saja. Selalu minta statistik out-of-sample-nya — dan bila OOS tidak ada, anggap janji in-sample sebagai janji yang belum teruji.

---

## 2. Mengapa Mean Sulit Diestimasi

Volatilitas dan korelasi bisa diestimasi dengan cukup baik dari 240 hari. Mean dihitung dari jumlah return — dan return harian didominasi noise: satu hari +5 persen atau −4 persen menggeser rata-rata jauh lebih besar daripada sinyal tahunannya.

**Nilai [notebook] — periode 1:** UNVR mean tahunan +0,4831 dengan vol 0,5667. Standard error mean tahunan 0,5807 — LEBIH BESAR dari estimasinya sendiri. t-statistik 0,83: angka +48 persen itu tidak bisa dibedakan dari nol. BBCA: mean −0,1257, SE 0,2992, t −0,42. KLBF: mean −0,1006, SE 0,4546, t −0,22. Ketiga mean periode 1 tidak ada satu pun yang signifikan secara statistik.

$$\mathrm{SE}(\hat{\mu}_{ann}) = \sigma_{ann} \cdot \frac{\sqrt{252}}{\sqrt{n}}, \qquad t = \frac{\hat{\mu}_{ann}}{\mathrm{SE}(\hat{\mu}_{ann})}$$

(Standard error mean return tahunan dan t-statistiknya; n = 240 hari. SE menyusut sebanding 1/akar(n) — memangkas SE UNVR dari 0,58 menjadi 0,29 butuh sekitar 960 hari, hampir 4 tahun — dan itu pun mengasumsikan mean-nya tidak berubah, asumsi yang justru dibantah data ini.)

**Nilai tambahan [notebook]:** korelasi antar saham NAIK di periode crash — BBCA-KLBF dari 0,2431 menjadi 0,4457, BBCA-UNVR dari 0,2027 menjadi 0,3735, KLBF-UNVR dari 0,2489 menjadi 0,3506. Diversifikasi melemah tepat saat paling dibutuhkan.

**Baik/buruk:** mean sampel bagus sebagai deskripsi masa lalu. Buruk sebagai ramalan: SE-nya bahkan lebih besar dari estimasinya (0,5807 vs 0,4831) pada 240 hari, dan rezim bisa berbalik. Vol dan korelasi jauh lebih stabil antar periode — karena itu metode yang TIDAK memakai mean (GMV, risk parity) lebih bisa diandalkan daripada max-Sharpe.

**Mitigasi:** sebelum percaya mean sampel, hitung SE dan t-statistiknya. Bila t-statistik di bawah 2, perlakukan mean itu sebagai nol — atau shrink ke arah nol / ke arah equilibrium (itulah yang dilakukan Black-Litterman di bagian 5).

---

## 3. Shrinkage: Ledoit-Wolf

Shrinkage: gabungkan estimasi sampel dengan sebuah target yang stabil tapi bias, dengan bobot yang dihitung dari data. Ledoit-Wolf adalah shrinkage untuk matriks kovarians: kovarians yang di-shrink = (1 − delta) × kovarians sampel + delta × target, dengan delta diestimasi dari data.

$$\hat{\Sigma}_{LW} = (1 - \delta)\,\hat{\Sigma}_{sample} + \delta\,F, \qquad \delta = 0{,}0955 \ \text{[notebook]}$$

**Nilai [notebook]:** delta shrinkage = 0,0955 pada window penuh 480 hari (implementasi sklearn di notebook memberi 0,0957 — selisih 0,0002 antar varian estimator, kesimpulan sama) — shrinkage KECIL: hanya 9,55 persen bobot pada target. Full-window: GMV biasa [0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966. GMV-Ledoit-Wolf [0,5185; 0,2852; 0,1963], return −0,1845, vol 0,2969. Bobot bergeser beberapa poin persentase; vol NYARIS SAMA (0,2969 vs 0,2966). Pada split OOS: GMV-LW OOS vol 0,3296 vs GMV OOS 0,3372 — perbaikan 0,0076, kecil tapi searah teori. Return OOS: GMV-LW −0,3703 vs GMV −0,3697 — TIDAK membaik, bahkan sedikit lebih buruk.

**Baik/buruk:** shrinkage bagus bila estimasi sampel berisik dan targetnya masuk akal. Buruk bila dipakai sebagai jimat: delta 0,0955 yang kecil adalah sinyal bahwa kovarians sampel di sini tidak terlalu bermasalah; memaksa shrinkage besar justru menambah bias tanpa alasan.

**Mitigasi:** laporkan delta-nya, bukan hanya hasil akhirnya. Dan ukur perbaikan pada metrik yang shrinkage janjikan — stabilitas vol — bukan pada return, yang bukan urusannya. JANGAN tulis klaim «shrinkage memperbaiki return OOS»: data berkata sebaliknya.

---

## 4. Kendala sebagai Regularisasi

Kendala biasanya diajarkan sebagai «aturan bisnis»: manajer dana tidak boleh short, regulator membatasi konsentrasi. Tapi ada pembacaan kedua yang lebih dalam: kendala adalah REGULARISASI — membatasi seberapa jauh optimizer boleh pergi mengikuti noise.

**Nilai [notebook]:** max-Sharpe TANPA kendala long-only pada window penuh punya bobot [−3154,746; −3786,1043; 6941,8503] — leverage ribuan kali, return 2296,983, vol 3429,6914, Sharpe 0,6697. Satu kendala sederhana — bobot tidak boleh negatif, jumlah bobot = 1 — memotongnya menjadi [0,0,1]: 100 persen UNVR, Sharpe 0,059. GMV tanpa kendala vs dengan kendala long-only IDENTIK [0,5523; 0,2699; 0,1777] — GMV tidak butuh short di data ini, jadi kendala tidak mengikatnya. Kendala mengikat justru pada portofolio yang paling rakus pada mean — dan itulah portofolio yang paling membutuhkan ikatan.

**Baik/buruk:** kendala bagus karena murah, transparan, dan bekerja tanpa asumsi statistik baru. Buruk bila dipakai membabi buta: batas bobot maksimum yang terlalu ketat mengubah optimizer menjadi equal-weight yang mahal.

**Mitigasi:** perlakukan kendala sebagai prior yang eksplisit. Tanyakan: «kendala mana yang mengikat, dan apa yang terjadi bila dilonggarkan?» Bila jawabannya bobot melonjak ke ribuan, kendala itu sedang menyelamatkanmu dari noise.

---

## 5. Black-Litterman: Mulai dari Equilibrium, Bukan dari Nol

Black-Litterman menyerang masalah dari arah berlawanan: jangan mulai dari estimasi sampel sama sekali. Titik awalnya adalah EQUILIBRIUM: bila pasar sudah efisien, bobot pasar pastilah optimal — dan dari bobot itu, lewat reverse optimization, kita menyimpulkan return ekspektasi yang DIIMPLIKASIKAN pasar (Pi). Baru setelah itu, view investor dicampurkan ke Pi lewat rumus Bayes, menghasilkan posterior mean M.

**Asumsi yang wajib dinyatakan:** data pin tidak memuat market cap, jadi market proxy di sini adalah EQUAL-WEIGHT [1/3; 1/3; 1/3]. Itu asumsi, bukan fakta pasar.

$$M = \left[(\tau\Sigma)^{-1} + P'\Omega^{-1}P\right]^{-1} \left[(\tau\Sigma)^{-1}\Pi + P'\Omega^{-1}Q\right], \qquad \Pi = \delta\,\Sigma\,w_{mkt}$$

**Nilai [notebook] — delta risk-aversion 2,5, tau 0,05, kovarians sampel window penuh:** Pi (equilibrium excess return) = [0,1817; 0,2447; 0,3009]. View [ilustrasi] — WAJIB dilabeli ilustrasi: «BBCA mengungguli KLBF 2pp per tahun», P = [1, −1, 0], Q = 0,02, Omega mengikuti konvensi He-Litterman (Omega = tau × P Sigma P-transpos). Posterior mean M = [0,196; 0,2175; 0,298]. BBCA naik dari 0,1817 menjadi 0,196, KLBF turun dari 0,2447 menjadi 0,2175, UNVR nyaris tidak bergerak 0,3009 → 0,298. Bobot BL (max-Sharpe long-only atas M): [0,4173; 0,2493; 0,3334].

**Baik/buruk:** Black-Litterman bagus karena memaksa investor menyatakan view secara eksplisit lengkap dengan ketidakpastiannya, dan prior equilibrium mencegah optimizer lari ke sudut ekstrem. Buruk bila view-nya sendiri adalah noise yang dibungkus rapi: rumus Bayes tidak bisa membedakan view yang beralasan dari tebakan.

**Mitigasi:** selalu laporkan Pi, view, dan M berdampingan, sehingga siapa pun bisa melihat seberapa jauh view menggeser prior.

---

## 6. Membaca Posterior dengan Jujur: Sharpe 0,77 yang Berubah Menjadi −0,62

Bobot BL [0,4173; 0,2493; 0,3334] dievaluasi dua cara [notebook]:

- **Pada statistik POSTERIOR** (M sebagai mean, kovarians sampel sebagai vol): return 0,2854, vol 0,3068, Sharpe 0,7671 — return 0,2854 = w·M + rf = 0,2354 + 0,05, karena M adalah excess return.
- **Pada statistik SAMPLE** (mean sampel window penuh sebagai mean, vol yang sama): return −0,1396, Sharpe −0,6178.

**Gambar:** dua bar Sharpe berdampingan — 0,7671 vs −0,6178, satu portofolio, satu vol 0,3068, selisih 1,38 poin Sharpe yang seluruhnya berasal dari satu pilihan: mean mana yang dipakai untuk menilai.

**Nilai:** Sharpe 0,7671 pada statistik posterior BUKAN hasil investasi — ia adalah konsistensi internal: «bila keyakinan posterior benar, inilah Sharpe-nya». Sharpe −0,6178 pada statistik sample adalah evaluasi yang jujur terhadap realisasi: mean sampel window penuh adalah BBCA −0,2445, KLBF −0,2570, UNVR +0,0796 — dan bobot BL yang menaruh 41,73 persen di BBCA serta 24,93 persen di KLBF menelan dua mean negatif itu. Posterior BUKAN ramalan.

**Baik/buruk:** evaluasi pada posterior bagus sebagai CEK KONSISTENSI. Buruk bila dibaca sebagai EKSPEKTASI return. Evaluasi pada statistik sample (atau lebih baik lagi, OOS) adalah yang menguji apakah keyakinan itu benar.

**Mitigasi:** setiap kali melihat Sharpe dari portofolio BL, tanyakan SELALU: «Sharpe ini dihitung pada mean yang mana?» Bila jawabannya «pada posterior», mintalah angka keduanya.

---

## 7. Sensitivitas Black-Litterman: Tau Tidak Menggerakkan Apa-Apa

Posterior M = [0,196; 0,2175; 0,298] dihitung dengan tau 0,05. Dengan konvensi He-Litterman (Omega = tau × PΣP-transpos), tau SENDIRIAN TIDAK mengubah apa-apa: tau 0,01, 0,05, dan 0,20 memberi M yang SAMA PERSIS [0,196; 0,2175; 0,298], bobot yang sama [0,4173; 0,2493; 0,3334], dan Sharpe posterior yang sama 0,7671 [notebook]. Alasannya: prior masuk lewat (τΣ)⁻¹ dan view lewat Ω⁻¹ — keduanya berskala 1/τ, jadi τ saling meniadakan. Banyak yang mengira tau adalah "bobot view" — di konvensi ini BUKAN.

$$M = \left[(\tau\Sigma)^{-1} + P'\Omega^{-1}P\right]^{-1} \left[(\tau\Sigma)^{-1}\Pi + P'\Omega^{-1}Q\right], \qquad \Omega = \tau\,P\Sigma P'$$

**Nilai [notebook] — yang BENAR-BENAR menggerakkan M adalah keyakinan RELATIF (skala Omega):** Omega ×0,5 (lebih yakin) → M [0,2007; 0,2084; 0,2971], bobot [0,4453; 0,2212; 0,3335]; Omega ×2 → M [0,1912; 0,2265; 0,2990], bobot [0,3893; 0,2773; 0,3334]; Omega ×4 → M [0,1874; 0,2338; 0,2998], bobot [0,3669; 0,2997; 0,3334]. Bobot UNVR nyaris tidak bergerak (0,3334–0,3335) — view hanya menyebut BBCA vs KLBF.

**Ukuran view Q:** Q = 0,01 → M [0,1943; 0,2207; 0,2984], bobot [0,4072; 0,2594; 0,3334]; Q = 0,02 (baseline) → M [0,196; 0,2175; 0,298]; Q = 0,05 → M [0,2011; 0,2076; 0,2970], bobot [0,4477; 0,2189; 0,3335].

**Proxy pasar — yang paling menggerakkan M:** proxy equal-weight → Pi [0,1817; 0,2447; 0,3009], M [0,196; 0,2175; 0,298], bobot [0,4173; 0,2493; 0,3334]. GMV sebagai proxy → Pi [0,2201; 0,2200; 0,2196] (nyaris RATA — karena GMV hampir meminimalkan w'Σw, implied return-nya hampir sama), M [0,2235; 0,2135; 0,2189], bobot [0,5722; 0,2497; 0,1782] (≈ bobot GMV!). Proxy [0,5; 0,3; 0,2] [ilustrasi] → Pi [0,2110; 0,2304; 0,2320], M [0,2178; 0,2175; 0,2306], bobot [0,5395; 0,2601; 0,2003]. Pi (dan karena itu BL) SANGAT sensitif terhadap proxy — proxy bukan detail teknis, ia adalah asumsi yang menentukan jawaban.

**Baik/buruk:** BL transparan — setiap input punya efek yang bisa dihitung. Buruk bila proxy yang tidak disadari (equal-weight, karena data pin tidak memuat market cap) ternyata menentukan jawaban — maka "jawaban BL" sebenarnya adalah "jawaban proxy".

**Mitigasi:** laporkan tabel sensitivitas (tau, skala Omega, Q, proxy) setiap kali melaporkan hasil BL. Bila M bergerak besar saat proxy diganti, akui jawabanmu adalah jawaban proxy, bukan jawaban pasar.

---

## 8. Robust Optimization: Bila Mean Salah Sebesar Satu Standard Error

Inilah topik yang dijanjikan M5.2: robust optimization — optimisasi yang tidak percaya pada satu titik estimasi, melainkan pada satu HIMPUNAN kemungkinan. Daripada mengoptimalkan atas mean sampel μ̂, optimalkan atas kasus TERBURUK dalam suatu uncertainty set di sekitar μ̂.

$$\mathrm{SE}_i = \sigma_i\sqrt{252/n}, \qquad \mu^{wc} = \hat{\mu} - k\cdot\mathrm{SE}, \qquad R^{wc}(w) = w'\mu^{wc}$$

**Nilai [notebook] — uncertainty set (box):** SE return tahunan (n = 480, SE = vol × √(252/480)): BBCA 0,2499, KLBF 0,3080, UNVR 0,3633. Worst-case μ (k = 1, μ − SE): [−0,4944; −0,5650; −0,2837].

**Ranking flip (k = 1):** worst-case return GMV −0,4760 vs EW −0,4477 vs RP −0,4579 vs MS −0,2837 — GMV yang "terbaik" secara nominal menjadi TERBURUK secara worst-case; EW yang "biasa saja" menjadi terbaik kedua. Pada k = 0,5: GMV −0,3332 vs EW −0,2942 (flip sudah terjadi); k = 1,5: GMV −0,6189 vs EW −0,6012. Optimasi nominal memaksimalkan kesalahan estimasi — robust optimization mengubah PERINGKAT, bukan hanya angkanya. Kenapa GMV kalah? GMV mengorbankan return untuk vol (bobot terbesar di BBCA 0,5523, worst-case −0,4944); worst-case menghukum return, bukan vol.

**Robust max-Sharpe (worst-case μ, k = 1):** bobot tetap [0; 0; 1] (UNVR least-bad), worst-case Sharpe −0,6655 — robust tidak selalu mengubah bobot; ia mengubah KEYAKINAN pada bobot itu (Sharpe nominal 0,059 vs worst-case −0,6655).

**Robust GMV dengan lantai worst-case return −0,35:** bobot [0,3147; 0; 0,6853], return nominal −0,0224, vol 0,3880, worst-case −0,3500. Dengan lantai −0,40: bobot [0,4866; 0,0490; 0,4645], return nominal −0,0946, vol 0,3313. KLBF dibuang (worst-case-nya paling buruk) — robust optimization "membayar" vol (0,2966 → 0,3880) untuk jaminan worst-case.

**Gambar:** bar worst-case return (k = 1) GMV/EW/RP/MS (−0,4760 / −0,4477 / −0,4579 / −0,2837) vs nominalnya (−0,1903 / −0,1406 / −0,1575 / +0,0796).

**Baik/buruk:** robust optimization bagus karena mengubah ketidakpastian tersembunyi (SE mean) menjadi bagian masalah — lengkap dengan harganya. Buruk bila uncertainty set dipilih sembarangan: k = 1,5 terlalu pesimistis sehingga hampir tidak ada portofolio yang layak.

**Mitigasi:** laporkan selalu k dan SE-nya, dan tunjukkan bagaimana jawaban berubah dari k = 0,5 ke k = 1,5. Bila peringkat berbalik pada k kecil, peringkat nominalmu memang rapuh.

---

## 9. Walk-Forward: Enam Lipatan, Satu Rezim

Split 240/240 di bagian 1 adalah SATU ujian. Walk-forward mengulang ujian itu enam kali — evaluasi kedua di samping split tunggal, yang TIDAK dihapus.

**Desain [notebook]:** 6 lipatan × 40 hari; train expanding dari 240 hari (lipatan 1: hari 1–240 → test 241–280; lipatan 6: hari 1–440 → test 441–480); bobot dipegang selama 40 hari test; strategi GMV / max-Sharpe / risk parity / EW, diestimasi ulang tiap lipatan. Rolling window 240 hari juga dihitung — hasilnya nyaris sama.

**Tabel lipatan (expanding, total return per lipatan):**

- **L1:** GMV −0,0363, MS +0,0710, RP −0,0212, EW −0,0104.
- **L2:** GMV −0,1650, MS −0,2366, RP −0,1734, EW −0,1799.
- **L3:** GMV −0,1068, MS −0,1225, RP −0,1169, EW −0,1218.
- **L4:** GMV +0,0611, MS +0,0613, RP +0,0462, EW +0,0400.
- **L5:** GMV −0,0215, MS −0,0663, RP −0,0264, EW −0,0298.
- **L6:** GMV −0,0984, MS −0,0525, RP −0,0762, EW −0,0656.

**Agregat 240 hari (expanding):** GMV total −0,3272, vol 0,3321, Sharpe −1,2342, maxDD −0,4045, menang vs EW 4/6 lipatan; MS total −0,3264, vol 0,4259, Sharpe −0,8780, maxDD −0,4865, 3/6; RP total −0,3276, vol 0,3145, Sharpe −1,3231, maxDD −0,4107, 4/6; EW total −0,3279, vol 0,3140, Sharpe −1,3278, maxDD −0,4218. Rolling: GMV total −0,3192, Sharpe −1,2123; MS −0,3264; RP −0,3253; EW −0,3279.

**JUJUR:** walk-forward TIDAK membalikkan vonis split 240/240 — semua strategi total ≈ −0,32 sampai −0,33 (crash merata periode 2); yang membedakan hanya vol/maxDD (GMV maxDD −0,4045 vs MS −0,4865). Nilai walk-forward: ia menunjukkan KONSISTENSI (GMV menang 4/6 lipatan vs EW) bukan kemenangan sekali-split; dan 6 lipatan tetap SATU rezim — bukan bukti lintas-rezim.

**Gambar:** bar total return per lipatan GMV vs EW (6 pasang).

**Baik/buruk:** walk-forward bagus karena mengubah satu angka OOS menjadi distribusi hasil — "menang berapa dari 6" jauh lebih sulit dimanipulasi oleh pemilihan jendela. Buruk bila dibaca sebagai bukti lebih kuat daripada sebenarnya: lipatan expanding yang tumpang tindih TIDAK independen — 4/6 bukan 4 percobaan independen.

**Mitigasi:** laporkan selalu desainnya (expanding vs rolling, ukuran lipatan, berapa kali estimasi ulang) berdampingan dengan split tunggal, dan jangan pernah menukar "konsisten di 6 lipatan" dengan "benar di semua rezim".

---

## 10. Checklist Sebelum Percaya Optimizer

1. **Out-of-sample:** max-Sharpe IN Sharpe 0,7644 menjadi OOS −0,8780 [notebook]. Tanpa OOS, jangan percaya.
2. **Turnover:** GMV periode 1 [0,6914; 0,2069; 0,1017] vs GMV window penuh [0,5523; 0,2699; 0,1777] — jarak L1 0,2783 [notebook] (dari bobot tak-bulat; dari bobot yang dibulatkan ke 4 desimal: 0,2781). Bobot yang bergerak 28 persen antar jendela adalah bobot yang tidak stabil.
3. **Leverage dan short:** max-Sharpe tanpa kendala mencapai [−3154,746; −3786,1043; 6941,8503] [notebook].
4. **Konsentrasi:** max-Sharpe IN adalah 100 persen UNVR — konsentrasi penuh pada satu angka yang t-statistiknya 0,83.
5. **Mean:** ketiga mean periode 1 punya t-statistik −0,42, −0,22, dan 0,83 [notebook] — semuanya tidak signifikan. Bila t di bawah 2, shrink atau buang mean-nya.
6. **Vol vs return:** shrinkage memperbaiki vol OOS sedikit (GMV-LW 0,3296 vs GMV 0,3372) dan tidak memperbaiki return. Klaim metode harus cocok dengan metrik yang ia perbaiki.
7. **Mean penilai:** BL 0,7671 pada posterior vs −0,6178 pada sample [notebook].

---

## Lab 1: Split OOS pada Data Mainan

Tiga aset A, B, C; 6 hari periode 1, 6 hari periode 2 [lab]. Periode 1 — mean harian A 0,0117, B 0,0050, C 0,0250; vol harian A 0,0232, B 0,0187, C 0,0243; Sharpe harian (rf harian 0,05/252) A 0,4950, B 0,2567, C 1,0211. Pemenang in-sample adalah C. Periode 2 — mean harian A −0,0250, B −0,0217, C −0,0250. C yang dijanjikan +0,0250 per hari justru −0,0250 per hari. Equal-weight periode 2: −0,0239 per hari — sedikit LEBIH BAIK daripada C. Total 6 hari: C −0,15, equal-weight −0,1433.

Nuansa dari data nyata: di sana max-Sharpe OOS return −0,3239 justru sedikit LEBIH BAIK daripada equal-weight OOS −0,3669, dan Sharpe OOS-nya −0,8780 lebih baik daripada equal-weight −1,3278. Jadi equal-weight tidak selalu menang OOS — yang selalu kalah adalah JANJINYA: max-Sharpe dijanjikan +48 persen dan Sharpe 0,76, realisasinya −32 persen dan Sharpe −0,88.

## Lab 2: Ledoit-Wolf dan Black-Litterman pada 2 Aset

Kovarians sampel S = [[0,04; 0,01], [0,01; 0,09]] [ilustrasi], target diagonal 0,065, delta 0,20 [ilustrasi]. GMV sampel: bobot aset 1 = 0,7273. Kovarians Ledoit-Wolf: [[0,045; 0,008], [0,008; 0,085]]; GMV-LW: bobot aset 1 = 0,6754. Varians pada kovarians sampel: GMV 0,0318 vs GMV-LW 0,0321 — GMV-LW sedikit LEBIH BURUK in-sample, seperti yang diharapkan. Black-Litterman [ilustrasi]: prior Pi = [0,06; 0,04], tau = 0,05, view «aset 1 mengungguli aset 2 sebesar 5pp» (P = [1, −1], Q = 0,05), Omega = 0,0057. Posterior mean M = [0,0649; 0,0299] — selisih 0,035, di antara prior 0,02 dan view 0,05. Bobot max-Sharpe long-only: prior [0,7836; 0,2164], BL [0,8647; 0,1353].

## Peta Modul M5: Lima Lesson, Satu Tema

- **M5.1 — Mean-variance dan efficient frontier:** GMV window penuh [0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966; max-Sharpe long-only [0,0,1], return 0,0796, vol 0,5014, Sharpe 0,059.
- **M5.2 — Risk parity dan kendala:** risk parity [0,398; 0,3212; 0,2808], kontribusi risiko sama [1/3; 1/3; 1/3], return −0,1575, vol 0,3037; kendala long-only mengubah max-Sharpe tanpa kendala [−3154,746; −3786,1043; 6941,8503] menjadi [0,0,1].
- **M5.3 — Optimisasi numerik:** gradient descent pada fungsi mangkuk — sensitivitas terhadap learning rate, dan satu langkah gradien yang menurunkan varians dari 0,1005 menjadi 0,0994 dengan bobot [0,5193; 0,4807] [notebook].
- **M5.4 — Shrinkage dan evaluasi out-of-sample:** Ledoit-Wolf delta 0,0955; GMV-LW [0,5185; 0,2852; 0,1963]; split OOS 240/240.
- **M5.5 — Lesson ini:** Black-Litterman dan penutup — Pi [0,1817; 0,2447; 0,3009], posterior M [0,196; 0,2175; 0,298], bobot BL [0,4173; 0,2493; 0,3334], Sharpe posterior 0,7671 vs sample −0,6178 — plus sensitivitas BL (tau tidak mengubah M; Omega dan proxy yang menggerakkan), robust optimization (worst-case GMV −0,4760), dan walk-forward 6 lipatan (GMV total −0,3272, 4/6 vs EW).

Satu tema mengikat kelimanya: estimation error. Bila kamu hanya mengingat satu kalimat dari modul ini, ingatlah ini: optimizer memaksimalkan angka yang kamu berikan — dan sebagian besar angka itu adalah noise.

## Guided Task di Colab

Notebook: colab/mlf-m55-guided-task.ipynb — CSV pin 480 hari return SIMPLE + split OOS 240/240 lengkap (max-Sharpe, GMV, risk parity, equal-weight, GMV-LW) + SE/t-statistik mean + korelasi naik di crash + Ledoit-Wolf (delta 0,0955) + Black-Litterman (Pi, posterior M, bobot BL, Sharpe posterior 0,7671 vs sample −0,6178), lengkap dengan 9 checks. Tautan Colab: https://colab.research.google.com/drive/1dbuYEjcTChCwzxTi-qs5VFYa8vQE2vKe.

## Rangkuman

- Optimizer's curse: max-Sharpe IN return 0,4831 / Sharpe 0,7644 → OOS −0,3239 / −0,8780 [notebook]; semua portofolio OOS −0,32 sampai −0,37 — crash merata, tidak ada yang menyelamatkan return.
- Mean sulit diestimasi: UNVR periode 1 +0,4831 dengan SE 0,5807, t 0,83 — tidak bisa dibedakan dari nol; BBCA t −0,42, KLBF t −0,22 [notebook].
- Shrinkage Ledoit-Wolf delta 0,0955 (kecil): GMV [0,5523; 0,2699; 0,1777] → GMV-LW [0,5185; 0,2852; 0,1963]; vol OOS 0,3296 vs 0,3372 (membantu sedikit), return OOS −0,3703 vs −0,3697 (tidak membaik).
- Kendala = regularisasi: max-Sharpe tanpa kendala [−3154,746; −3786,1043; 6941,8503] → long-only [0,0,1]; GMV tidak berubah [0,5523; 0,2699; 0,1777].
- Black-Litterman: Pi [0,1817; 0,2447; 0,3009], view [ilustrasi] BBCA mengungguli KLBF 2pp, posterior M [0,196; 0,2175; 0,298], bobot BL [0,4173; 0,2493; 0,3334] (delta 2,5, tau 0,05, market proxy equal-weight).
- Posterior bukan ramalan: Sharpe BL 0,7671 pada statistik posterior vs −0,6178 pada statistik sample (return 0,2854 vs −0,1396, vol 0,3068; return posterior 0,2854 = w·M + rf = 0,2354 + 0,05, karena M adalah excess return).
- Sensitivitas BL: tau 0,01 / 0,05 / 0,20 memberi M yang sama persis [0,196; 0,2175; 0,298] (tau saling meniadakan di konvensi He-Litterman); Omega ×0,5 → M [0,2007; 0,2084; 0,2971]; proxy GMV → Pi nyaris rata [0,2201; 0,2200; 0,2196].
- Robust optimization: worst-case μ (k = 1) [−0,4944; −0,5650; −0,2837]; worst-case GMV −0,4760 (terburuk) vs EW −0,4477 — peringkat berbalik; robust GMV lantai −0,35: w [0,3147; 0; 0,6853], vol 0,3880.
- Walk-forward 6 lipatan: GMV total −0,3272, menang 4/6 vs EW; semua strategi ≈ −0,32 sampai −0,33 — TIDAK membalikkan vonis split 240/240; 6 lipatan tetap satu rezim.
- Checklist 7 butir: OOS, turnover (GMV L1 0,2783), leverage, konsentrasi, SE/t mean, vol-vs-return, mean penilai.
- Lab: pemenang in-sample C +0,0250/hari → OOS −0,0250/hari, equal-weight OOS −0,0239; GMV-LW 2 aset 0,6754 vs GMV 0,7273; posterior mainan [0,0649; 0,0299], bobot BL [0,8647; 0,1353].
- Korelasi naik di crash: BBCA-KLBF 0,2431 → 0,4457 — diversifikasi melemah saat paling dibutuhkan.
- Jembatan: M6 tuning & seleksi model, M7 fairness/explainability/monitoring, M9 backtesting & validasi — estimation error berganti nama, tidak hilang.

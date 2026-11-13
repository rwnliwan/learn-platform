# MLF-M4.2: VaR & Expected Shortfall — Seberapa Buruk Besok?

## Masalah: Manajer Risiko yang Ditanya «Seberapa Buruk Besok?»

Seorang manajer risiko memegang BBCA, KLBF, dan UNVR dalam porsi sama — Rp100 juta total, rebalance tiap hari. Direksi bertanya dua hal setiap sore. Pertama: «dengan keyakinan 95 persen, berapa kerugian maksimum kita besok?» Kedua: «bila besok termasuk 5 persen hari terburuk itu, rata-rata kita rugi berapa?»

Pertanyaan pertama dijawab VaR95. Pertanyaan kedua dijawab ES95 — dan keduanya memakai data yang sama: 480 return harian portofolio itu (return 4 November 2024 sampai 11 November 2026; dari 481 baris harga 1 November 2024 sampai 11 November 2026; data diunduh dengan batas akhir 12 November 2026 yang eksklusif) [notebook]. Simpangan baku hariannya 0,0196, volatilitas tahunannya 0,3114. VaR95 historis 0,0286 (Rp2.856.323 per Rp100 jt — dari nilai tak-dibulatkan 0,028563; 0,0286 yang dibulatkan memberi Rp2.860.000); ES95 historis 0,0445 (Rp4.451.285 per Rp100 jt) [notebook].

---

## 1. Value at Risk

VaR pada tingkat keyakinan alpha adalah kerugian sedemikian rupa sehingga peluang kerugian melebihinya adalah (1 − alpha). VaR95 0,0286 berarti: peluang kerugian harian melebihi 2,86 persen adalah 5 persen. Dalam 480 hari [notebook], sekitar 24 hari kerugiannya lebih besar dari 0,0286 — dan 456 hari lebih kecil.

**Nilai [notebook]:** VaR95 historis 0,0286 (Rp2.856.323 per Rp100 jt); VaR99 historis 0,0479 (Rp4.792.081 per Rp100 jt). Cara historis: urutkan 480 return dari terburuk ke terbaik, ambil return pada persentil ke-5 (VaR95) dan persentil ke-1 (VaR99), ubah tandanya menjadi kerugian. Tidak ada asumsi distribusi — data berbicara sendiri.

**Baik/buruk:** VaR historis bagus karena tanpa asumsi — ia tidak peduli distribusinya normal atau tidak. Buruk bila datanya pendek atau rezimnya berubah: VaR historis dari 480 hari yang tenang meremehkan risiko bila besok rezimnya berubah (lihat M4.3).

**Mitigasi:** jangan pernah melaporkan VaR tanpa n dan tanpa window-nya. «VaR95 0,0286» tanpa «n = 480 return, 4 Nov 2024–11 Nov 2026 (harga 1 Nov 2024–11 Nov 2026)» adalah angka tanpa konteks.

$$\mathrm{VaR}_{\alpha} = -\inf\{x : P(R \leq x) \geq 1 - \alpha\}$$

(VaR pada tingkat keyakinan alpha: minus kuantil (1 − alpha) dari distribusi return R. Untuk alpha 95%: minus persentil ke-5 return.)

---

## 2. Expected Shortfall

VaR diam tentang apa yang terjadi SETELAH garisnya dilewati. VaR95 0,0286 tidak membedakan dunia di mana 24 hari terburuk itu rugi 0,03 dan dunia di mana mereka rugi 0,15. Expected Shortfall (ES, juga disebut Conditional VaR) menutup lubang itu: ES95 adalah RATA-RATA kerugian pada hari-hari ketika kerugian melebihi VaR95 — jawaban atas «seberapa buruk, bila buruk».

**Nilai [notebook]:** ES95 historis 0,0445 (Rp4.451.285 per Rp100 jt) vs VaR95 historis 0,0286. ES99 historis 0,0775 (Rp7.750.165) vs VaR99 historis 0,0479. ES selalu lebih besar dari VaR pada alpha yang sama — karena ES adalah rata-rata ekor. Pada 99%, ES99 0,0775 adalah 1,62 kali VaR99 0,0479.

**Baik/buruk:** ES bagus karena ia «koheren» — menghukum ekor yang tebal dan menghargai diversifikasi dengan benar, dua hal yang VaR gagal lakukan. Buruk bila dihitung dari sedikit observasi: ES99 historis adalah rata-rata dari hanya sekitar 5 hari terburuk.

**Mitigasi:** pakai ES sebagai pendamping VaR, bukan pengganti. Bila ES jauh lebih besar dari VaR (seperti 0,0775 vs 0,0479 di 99%), bacalah itu sebagai sinyal: ekormu tebal, dan VaR sendirian akan menipumu.

$$\mathrm{ES}_{\alpha} = E[-R \mid -R > \mathrm{VaR}_{\alpha}]$$

(Expected Shortfall: ekspektasi kerugian, bersyarat pada kerugian yang melebihi VaR pada alpha yang sama. Untuk alpha 95%: rata-rata kerugian di 5% hari terburuk.)

---

## 3. Alur Operasional: Posisi → P&L → Loss → VaR/ES

VaR dan ES sejauh ini tampil sebagai angka jadi. Di meja risiko nyata, angka-angka itu adalah UJUNG dari sebuah rantai: posisi → return portofolio → P&L rupiah → loss → kuantil. Satu kesalahan definisi di awal merambat ke semua angka di akhir.

**Alur enam langkah:**

1. **Posisi & bobot:** nilai portofolio dan bobot tiap saham — di sini equal-weight BBCA, KLBF, UNVR, masing-masing sepertiga dari Rp100 juta, rebalance harian sehingga exposure kembali ke bobot target setiap sore.
2. **Return portofolio berbobot:** return portofolio hari t adalah rata-rata berbobot return tiap saham hari itu — untuk equal-weight, (r_BBCA + r_KLBF + r_UNVR) / 3.
3. **P&L rupiah:** P&L hari t = return portofolio hari t × nilai portofolio. Return −0,02 pada portofolio Rp100 juta berarti P&L −Rp2.000.000.
4. **Loss L = −P&L:** balik tandanya supaya kerugian menjadi bilangan positif — loss 0,02 berarti rugi 2 persen. VaR adalah kuantil dari loss, bukan dari return.
5. **Kuantil = VaR:** urutkan 480 loss dari terkecil ke terbesar; VaR95 adalah loss pada persentil ke-95; VaR99 pada persentil ke-99.
6. **Rata-rata ekor = ES:** ES95 adalah rata-rata loss pada hari-hari ketika loss melebihi VaR95; ES99 rata-rata loss di atas VaR99.

**Nilai [notebook] — worked example Rp100 juta:** VaR95 historis 0,0286 → Rp2.856.323; ES95 historis 0,0445 → Rp4.451.285; VaR99 historis 0,0479 → Rp4.792.081; ES99 historis 0,0775 → Rp7.750.165. Di 95 persen hari, kerugian tidak melebihi Rp2.856.323; di 5 persen hari terburuk, rata-rata kerugian Rp4.451.285; di 1 persen hari terburuk, rata-rata kerugian Rp7.750.165 — hampir tiga kali VaR95.

**Checklist implementasi:** (a) harga — pakai adjusted close, BUKAN close mentah: dividen dan stock split yang tidak disesuaikan menciptakan «return» palsu di hari ex-date; (b) penyebut — portfolio value tetap sebagai penyebut P&L (return × nilai portofolio); (c) biaya — biaya transaksi dan funding DIABAIKAN dalam perhitungan ini, dan itu dinyatakan eksplisit: VaR di sini adalah VaR sebelum biaya; (d) rebalance — rebalance harian berarti exposure kembali ke bobot target setiap hari.

**Baik/buruk:** alur ini bagus karena bisa diaudit tiap langkah — bila VaR terlihat aneh, periksa satu per satu: return berbobotnya, P&L-nya, kuantilnya. Buruk bila satu langkah salah definisi — misal close mentah dipakai sebagai pengganti adjusted close — karena kesalahan itu tidak berhenti di langkah itu: return salah, P&L salah, loss salah, VaR dan ES ikut salah.

**Mitigasi:** tulis konvensi tiap langkah di samping angkanya — «return = rata-rata berbobot simple return dari adjusted close; P&L = return × Rp100 juta; loss = −P&L» — dan uji ujung-ke-ujung dengan satu hari yang dihitung tangan. Bila satu hari tidak cocok, jangan percaya 480 hari.

---

## 4. Tiga Cara Menghitung VaR/ES 95%

Historis: urutkan 480 return nyata, ambil kuantilnya — tanpa asumsi. Parametrik: asumsikan return normal dengan mean dan simpangan baku dari data (0,0196 per hari), hitung kuantil normal. Monte Carlo: simulasikan 10.000 hari dari distribusi normal gabungan ketiga saham dengan mean dan matriks kovarians return log historis (seed 42), lalu hitung kuantil dari hasil simulasi.

**Nilai [notebook]:** VaR95 — historis 0,0286, parametrik 0,0328, Monte Carlo 0,0336. ES95 — historis 0,0445, parametrik 0,0410, Monte Carlo 0,0424. Untuk VaR95, parametrik dan Monte Carlo LEBIH TINGGI dari historis — normal «mengira» ekor 5% lebih buruk daripada kenyataan. Untuk ES95, sebaliknya: historis LEBIH TINGGI — ekor nyata lebih buruk daripada ekor normal.

**Gambar:** bar keenam angka — pasangan historis: VaR-nya paling rendah, ES-nya paling tinggi — ciri khas distribusi berekor tebal.

**Baik/buruk:** historis bagus bila datanya cukup panjang dan rezimnya stabil. Parametrik bagus bila datanya pendek. Monte Carlo bagus bila portofolionya punya payoff non-linear (misal mengandung opsi — M4.4); di portofolio saham lurus seperti ini, ia hanya mengulang jawaban parametrik dengan tambahan noise simulasi.

**Mitigasi:** hitung minimal DUA metode dan bandingkan. Bila historis dan parametrik jauh berbeda, jangan pilih yang lebih kecil karena «lebih enak» — selidiki kenapa berbeda. Di sini perbedaannya adalah sinyal: ekor nyata lebih tebal dari normal.

---

## 5. VaR99 & ES99: Ekor Nyata Jauh Lebih Tebal dari Normal

**Nilai [notebook]:** VaR99 historis 0,0479 (Rp4.792.081), ES99 historis 0,0775 (Rp7.750.165). Parametrik: VaR99 0,0462, ES99 0,0528. Monte Carlo: VaR99 0,0479, ES99 0,0546. Bukti ekor tebal ada pada ES99: historis 0,0775 vs parametrik 0,0528 — selisih 0,0247, historis 47 persen lebih besar. Normal meremehkan rata-rata kerugian di 1% hari terburuk hampir setengahnya. Untuk VaR99, ketiga metode nyaris sepakat (0,0479 / 0,0462 / 0,0479) — ambang masuk ekornya sama, tapi ISI ekornya berbeda jauh.

**Baik/buruk:** 99% bagus bila yang dijaga adalah bencana — modal minimum, batas kerugian ekstrem. Buruk bila dipakai untuk keputusan harian: angka yang goyah karena 5 observasi akan membuat batas risiko bergerak-gerak tanpa alasan jelas. Trade-off-nya: 99% lebih konservatif tapi lebih berisik (hanya ~5 observasi di ekor, melawan 24 di ekor 95%).

**Mitigasi:** laporkan 95% untuk pemantauan harian dan 99% untuk ketahanan terhadap bencana — berdampingan, dengan n ekornya dinyatakan («ES99 dari ~5 observasi»). Bila ES historis jauh di atas ES parametrik, jangan «menghaluskan» dengan mengganti ke parametrik — itu membuang sinyal ekor tebal yang paling berharga.

$$\mathrm{VaR}_{99}^{\mathrm{hist}} = 0{,}0479 \quad < \quad \mathrm{ES}_{99}^{\mathrm{hist}} = 0{,}0775 \quad \gg \quad \mathrm{ES}_{99}^{\mathrm{param}} = 0{,}0528$$

(Bukti empiris ekor tebal [notebook]: ES99 historis jauh di atas ES99 parametrik (normal) — distribusi nyata berekor tebal, normal meremehkan ekor.)

---

## 6. VaR per Saham

**Nilai [notebook]:** VaR95 historis per saham — BBCA 0,0290, KLBF 0,0380, UNVR 0,0438. VaR95 historis portofolio equal-weight: 0,0286 — LEBIH RENDAH dari VaR saham yang paling aman sekalipun (BBCA 0,0290). UNVR paling berisiko sendiri (0,0438), konsisten dengan volatilitas tahunan tertinggi (0,4981 vs BBCA 0,3471 dan KLBF 0,4244). Rata-rata sederhana ketiga VaR per saham adalah 0,0369 — tapi VaR portofolio hanya 0,0286, sekitar 23 persen lebih rendah. Selisih itu adalah manfaat diversifikasi: korelasi log-return antar saham 0,285–0,361 — hari buruk UNVR sering bukan hari buruk BBCA.

**Gambar:** bar keempat VaR95 — bar portofolio paling pendek, padahal ia berisi saham yang sama.

**Baik/buruk:** VaR per saham bagus untuk menetapkan batas per posisi. Buruk bila dipakai menilai risiko portofolio keseluruhan — menjumlahkan VaR per saham melebih-lebihkan risiko karena mengabaikan korelasi di bawah 1.

**Mitigasi:** bila satu saham mendominasi VaR portofolio (di sini UNVR), pertimbangkan mengurangi bobotnya — atau terima risikonya secara sadar dengan batas yang dinyatakan.

---

## 7. Monte Carlo sebagai Salah Satu Metode VaR

Monte Carlo di lesson ini HANYA salah satu metode menghitung VaR/ES — sejajar dengan historis dan parametrik. Caranya: ambil mean dan matriks kovarians return log ketiga saham, simulasikan 10.000 hari dari distribusi normal gabungan (joint normal) dengan seed 42, bentuk portofolio equal-weight tiap hari simulasi, lalu hitung kuantilnya seperti VaR historis — hanya saja datanya simulasi, bukan kenyataan.

**Nilai [notebook]:** Monte Carlo VaR95 0,0336, ES95 0,0424; VaR99 0,0479, ES99 0,0546 (10.000 simulasi, seed 42). Dekat dengan parametrik (VaR95 0,0328, ES95 0,0410) — wajar, keduanya berangkat dari asumsi normal yang sama. Selisih kecil (0,0336 vs 0,0328) adalah noise simulasi.

**Baik/buruk:** Monte Carlo bagus bila payoff-nya non-linear atau distribusinya tidak punya rumus kuantil yang mudah. Buruk bila dipakai sebagai «hiasan canggih» di portofolio linear: ia menjawab pertanyaan yang sama dengan parametrik, hanya lebih lambat dan dengan noise tambahan.

**Mitigasi:** nyatakan selalu seed dan jumlah simulasi (seed 42, 10.000 simulasi) — tanpa keduanya, hasil Monte Carlo tidak bisa direplikasi. Teori Monte Carlo penuh TIDAK diajarkan di sini — itu materi M9 (Simulation, Backtesting & Validation).

---

## 8. Scaling Horizon: Aturan Akar-10

VaR95 10-hari = VaR95 1-hari × √10.

**Nilai [notebook]:** VaR95 historis 1-hari (tak-dibulatkan 0,028563) × √10 ≈ 0,0903 — sekitar Rp9.030.000 per Rp100 juta untuk 10 hari. Memakai 0,0286 yang sudah dibulatkan, hasilnya 0,0904 — selisih 0,0001 itu pembulatan, bukan kesalahan. 0,0903 adalah 3,16 kali VaR 1-hari — BUKAN 10 kali, karena aturan ini mengasumsikan kerugian harian saling meniadakan sebagian.

**Baik/buruk:** akar-10 bagus sebagai perkiraan cepat untuk horizon pendek (2–10 hari) dalam kondisi normal. Buruk untuk horizon panjang atau saat volatilitas sedang tidak normal.

**Mitigasi:** akar-10 mengasumsikan return IID (independen dan berdistribusi identik) — padahal return nyata TIDAK iid: volatilitas bergerombol (autokorelasi return kuadrat lag-1 0,1043) dan korelasi antar saham naik saat pasar stres. Pakai akar-10 hanya sebagai angka pertama, lalu tanyakan «bagaimana bila volatilitas besok seperti minggu lalu?» — pertanyaan itu dijawab model kondisional di M4.3.

$$\mathrm{VaR}_{\alpha}(T) = \mathrm{VaR}_{\alpha}(1) \times \sqrt{T}$$

(Aturan akar-T untuk scaling horizon; di sini T = 10 hari: 0,028563 × √10 ≈ 0,0903; 0,0286 yang dibulatkan memberi 0,0904 — selisih pembulatan 0,0001. Berlaku bila return iid — asumsi yang dilanggar return nyata.)

---

## Lab 1: VaR95/ES95 Historis dari 20 Return Mainan

20 return harian mainan, kuantil 5% dengan interpolasi linear (posisi 0,05 × 19 = 0,95 — 95% jalan dari return terburuk -0,05 ke terburuk kedua -0,04). Kuantil 5% = -0,0405, jadi VaR95 = 0,0405 [lab]. Ekornya hanya berisi satu observasi (-0,05), jadi ES95 = 0,0500. Dalam rupiah per Rp100 juta: VaR Rp4.050.000, ES Rp5.000.000. ES95 hanya dari SATU observasi — sama seperti ES99 di notebook yang hanya dari ~5 observasi: ekor yang tipis membuat ES goyah. Tambah satu hari -0,08 ke data ini (n menjadi 21), dan VaR95 naik dari 0,0405 menjadi 0,0500 (+23,5%) sementara ES95 naik dari 0,0500 menjadi 0,0650 (rata-rata kerugian -0,08 dan -0,05) — di n sekecil ini, satu observasi ekstrem menggerakkan keduanya.

## Lab 2: Parametrik vs Historis pada Data Mainan

20 return mainan: 18 hari tenang (+0,7% sampai +1,5%) lalu 2 hari crash (-0,08 dan -0,12). Mean -0,0003, simpangan baku 0,0348. VaR95 historis 0,0820, ES95 historis 0,1200. VaR95 parametrik (mean − 1,6449 × simpangan baku) hanya 0,0575. Selisih 0,0245 [lab]. Normal meremehkan karena simpangan baku «diencerkan» 18 hari tenang — kuantil normal jatuh DI ANTARA hari tenang dan crash yang sebenarnya. Bandingkan dengan notebook: di sana VaR95 parametrik (0,0328) justru LEBIH TINGGI dari historis (0,0286) — normal tidak selalu meremehkan VaR; yang konsisten diremehkan adalah ES di ekor jauh (ES99 historis 0,0775 vs parametrik 0,0528).

## Mini-case: Batas Risiko untuk Direksi

Direksi meminta satu angka batas kerugian harian untuk portofolio Rp100 juta. Pilihannya: VaR95 historis (Rp2.856.323), VaR95 parametrik (Rp3.280.000), atau ES95 historis (Rp4.451.285). Keputusan yang jujur: laporkan ketiganya dengan peran berbeda — VaR95 historis sebagai batas pemantauan harian (24 observasi di ekor, cukup stabil), ES95 historis sebagai angka «bila buruk, seberapa buruk» (Rp4,45 juta), dan ES99 historis (Rp7.750.165) sebagai angka ketahanan bencana dengan catatan «dari ~5 observasi». Yang TIDAK boleh dilakukan: memakai VaR95 parametrik sendirian karena «lebih tinggi jadi lebih aman» (ia lebih tinggi di 95% tapi meremehkan ekor 99% hampir setengahnya), atau memakai VaR95 sebagai «kerugian maksimum» (24 hari dalam 480 melampauinya).

## Guided Task di Colab

Notebook: colab/mlf-m42-guided-task.ipynb — portofolio equal-weight BBCA–KLBF–UNVR (n = 480, sd harian 0,0196) + trio VaR/ES 95% (historis 0,0286/0,0445; parametrik 0,0328/0,0410; Monte Carlo 0,0336/0,0424) dan 99% (historis 0,0479/0,0775; parametrik 0,0462/0,0528; Monte Carlo 0,0479/0,0546) + VaR95 per saham (BBCA 0,0290, KLBF 0,0380, UNVR 0,0438) + VaR95 10-hari 0,0903, lengkap dengan checks. Tautan Colab: https://colab.research.google.com/drive/1gcCKsWRbyJnCJ5jniYHb028dBTAg7cI5

## Rangkuman

- VaR adalah kuantil kerugian: VaR95 historis 0,0286 (Rp2.856.323 per Rp100 jt) — 5% hari (sekitar 24 dari 480) kerugiannya lebih besar; VaR bukan kerugian maksimum.
- ES adalah rata-rata kerugian bila VaR terlampaui: ES95 historis 0,0445 (Rp4.451.285); ES99 historis 0,0775 (Rp7.750.165).
- Alur operasional: posisi & bobot → return portofolio berbobot → P&L rupiah → loss L = −P&L → kuantil (VaR) → rata-rata ekor (ES); VaR95 Rp2.856.323, ES95 Rp4.451.285, VaR99 Rp4.792.081, ES99 Rp7.750.165 per Rp100 jt [notebook]; checklist: adjusted close, portfolio value tetap sebagai penyebut, biaya transaksi/funding diabaikan (dinyatakan), rebalance harian.
- Trio 95% [notebook]: historis 0,0286/0,0445; parametrik 0,0328/0,0410; Monte Carlo 0,0336/0,0424 (10.000 simulasi, seed 42).
- Trio 99%: historis 0,0479/0,0775; parametrik 0,0462/0,0528; Monte Carlo 0,0479/0,0546 — ES99 historis jauh di atas parametrik: bukti empiris ekor tebal.
- 99% lebih konservatif tapi lebih berisik: hanya ~5 observasi di ekor, melawan 24 di ekor 95%.
- VaR95 per saham: BBCA 0,0290, KLBF 0,0380, UNVR 0,0438 — portofolio 0,0286 lebih rendah dari saham teraman: diversifikasi bekerja (korelasi log-return 0,285–0,361).
- VaR95 10-hari (akar-10) 0,0903 — dengan caveat return tidak iid (volatilitas bergerombol, lihat M4.3).
- Lab: VaR95/ES95 historis dari 20 return mainan (0,0405/0,0500); parametrik vs historis pada data crash (0,0575 vs 0,0820 — normal meremehkan).

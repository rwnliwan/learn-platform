# MLF-M2.4: Vintage, Roll-Rate & IFRS 9 — Bagaimana Kredit Menua

## Masalah: Satu Nasabah Telat — Ke Mana Ia Pergi Bulan Depan?

Nasabah lancar April–Juli, telat 2 bulan Agustus, telat 3 bulan September. Bank tidak menunggu Oktober; ia memantau perjalanan. Tiga alat: vintage (kohort mana paling cepat memburuk), roll-rate (migrasi antar bucket), IFRS 9 staging (status menjadi cadangan kerugian).

---

## 1. Vintage Analysis

Bandingkan kohort (kelompok yang mulai bersama) dan lacak default rate mereka seiring waktu.

**Caveat:** UCI tidak punya tanggal origination — kohort di sini didefinisikan dari status bayar bulan paling awal teramati (April 2005, PAY_6). Ini proksi, bukan vintage sejati; nyatakan caveat ini di samping angka.

**Nilai:** kohort April 2005 [notebook] — current (n = 26.921): default Oktober 0,1867. Kohort 2 (n = 2.766): 0,5065. Kohort 3 (n = 184): 0,6413. Kohort 4+ (n = 129): 0,7132. Per nilai PAY_6: −2: 4.895 → 0,2004; −1: 5.740 → 0,1699; 0: 16.286 → 0,1884; 2: 2.766 → 0,5065; 3: 184 → 0,6413; 4: 49 → 0,6327; 5: 13 → 0,5385; 6: 19 → 0,7368; 7: 46 → 0,8261; 8: 2 → 1,0000 (n = 2 — benar tapi tidak bisa dipakai).

**Gambar:** bar default per kohort — current 0,1867 vs 4+ 0,7132.

**Baik/buruk:** bagus bila kohort dari origination sesungguhnya dan dilacak ≥ 12 bulan. Buruk bila proksi dibaca seolah-olah origination.

**Mitigasi:** nyatakan definisi kohort di samping angkanya — selalu.

---

## 2. Roll-Rate Analysis

Matriks transisi: baris status bulan ini, kolom status bulan depan, sel = peluang pindah.

**Nilai:** matriks pooled, 5 transisi Apr–Sep 2005 [notebook]. Current (n 131.792): 0,9388 / 0,0141 / 0,0471 / 0,0000 / 0,0000. 2 (n 16.297): 0,2534 / 0,1028 / 0,5805 / 0,0633 / 0,0000. 3 (n 1.108): 0,1588 / 0,0984 / 0,3267 / 0,1588 / 0,2572. 4+ (n 769): 0,0312 / 0,0559 / 0,2172 / 0,0507 / 0,6450. Bucket 1: n total 34 — jangan dibaca.

**Gambar:** heatmap 5×5 — diagonal persisten; 4+ bertahan 0,6450.

**Quirk PAY = 1:** PAY = 1 tercatat 3.688 baris di Sep (PAY_0) tapi 28 di Agu, 4 di Jul, 2 di Jun, 0 di Mei/Apr [notebook]. Penyebabnya tidak diketahui dari data — dicatat sebagai quirk, bukan dijelaskan. Roll ke PAY_0 ≥ 2 dari status Agu: current 0,0388 (default Okt 0,1627); 1: 0,0000 (0,1786); 2: 0,4744 (0,5561); 3: 0,5215 (0,6166); 4+: 0,6752 (0,5478 — sedikit lebih rendah dari bucket 3 karena sebagian sudah charge-off/direstrukturisasi).

**Baik/buruk:** bagus bila tiap baris punya n cukup (current n 131.792 sangat bisa dipercaya; 4+ n 769 masih bisa dibaca; 1 n 34 tidak). Buruk bila matriks dibaca tanpa n.

**Mitigasi:** tampilkan n per baris; ambang minimum (misal n ≥ 100) di bawah itu baris tidak dibaca; selidiki bulan anomali sebelum merata-rata.

**Jembatan dari M2.2 — interval Wilson 95%:** ambang «n ≥ 100» adalah rule of thumb, bukan pengganti interval statistik. 34/34 (roll-rate bucket 1) → [0,8985; 1,0000], lebar 0,1015 — «pasti bertahan» dari 34 transisi masih menyisakan 10 persen kemungkinan sebaliknya. Kohort 4+ 92/129 (0,7132) → [0,6299; 0,7842], lebar 0,1543. Band skor di bawah 460: 0,6993 dari n = 2.205 → [0,6798; 0,7181], lebar 0,0383. Rumus dan contoh kerja lengkapnya di M2.2; lab menghitung Wilson-nya ada di Lab 2 lesson ini.

---

## 3. IFRS 9 Staging & ECL

Stage 1: performing, PD 12 bulan. Stage 2: SICR, PD lifetime. Stage 3: credit-impaired, PD = 1.

**Nilai:** staging dari PAY_0, Sep 2005, LGD 45% [ilustrasi] [notebook]. Stage 1 (PAY_0 ≤ 1): n = 26.870 (89,6%), PD 0,1659, EAD NT$174.495, ECL/nasabah NT$13.031, total NT$350.133.169. Stage 2 (PAY_0 = 2, 3): n = 2.989 (10,0%), PD 0,6986, EAD NT$108.269, ECL/nasabah NT$34.035, total NT$101.729.540. Stage 3 (PAY_0 ≥ 4): n = 141 (0,5%), EAD NT$86.738, ECL/nasabah NT$39.032 (PD = 1), total NT$5.503.500. Total ECL NT$457.366.208.

**Koreksi Stage 3:** PD observasi 0,6312 TIDAK dipakai — nasabah sudah impaired, kerugiannya sudah terjadi. PD = 1 → ECL/nasabah NT$39.032 (bukan NT$24.637). Koreksi menambah NT$2.029.660 (dari NT$455.336.548). Stage 2 lifetime [ilustrasi PD 0,85]: NT$41.413/nasabah, total NT$123.783.120 — PD lifetime butuh model multi-tahun (M9).

**Baik/buruk:** bagus bila definisi stage eksplisit dan konsisten. Buruk bila SICR kabur tanpa angka — stage menjadi negosiasi.

**Mitigasi:** kunci definisi stage ke angka (DPD dan/atau kenaikan PD relatif) dan dokumentasikan.

$$ECL = PD \times LGD \times EAD, \quad \text{Stage 3: } PD = 1$$

---

## 4. ECL vs EL

Rumus sama (PD × LGD × EAD), tujuan berbeda. EL = ekonomi (keputusan bisnis). ECL = akuntansi (IFRS 9: staging, PD 12m vs lifetime, PD = 1 untuk Stage 3). EL baseline stress test NT$78.675.378 (test 6.000) vs total ECL 1 bln NT$457.366.208 (30.000 nasabah) — tidak bisa dibandingkan langsung: populasi dan horizon berbeda. Nasabah pindah Stage 1 → 2 melompat dari PD 12m ke PD lifetime: ECL naik tajam meski PD 12m nyaris tidak bergerak.

**Mitigasi:** laporkan EL dan ECL berdampingan dengan populasi dan horizon yang dinyatakan; uji sensitivitas ambang Stage 2.

---

## 5. Monitoring: PSI dan Drift (jembatan ke M7)

Monitoring penuh adalah modul M7 — di sini hanya jembatan singkat. Yang dipantau dari scorecard: base-rate drift, distribution drift per bin, PSI sebagai indikator, perubahan approval rate dan bad rate, serta calibration drift.

**PSI (Population Stability Index)** = jumlah (actual − expected) × ln(actual/expected) per bin. Band PSI: PSI < 0,1 stabil; 0,1 ≤ PSI < 0,25 waspada; PSI ≥ 0,25 drift besar.

**Nilai:** contoh drift yang BENAR [notebook] — share PAY_0 = 2 naik dari 8,89% menjadi 12% → PSI 0,0104 (stabil). Mean PD test 0,2217 naik menjadi 0,29 [ilustrasi] — calibration drift yang harus diselidiki. Lab PSI sintetis: expected [0,60; 0,25; 0,15] vs actual [0,52; 0,28; 0,20] → PSI 0,0292 (stabil). Koreksi: angka 4,9% yang sempat tertulis di laporan gap untuk share awal PAY_0 = 2 SALAH — share sebenarnya 8,89% (2.667 dari 30.000).

**Gambar:** bar berkelompok expected vs actual tiga bin — 0,60 vs 0,52; 0,25 vs 0,28; 0,15 vs 0,20; PSI 0,0292.

**Kapan threshold dan scorecard perlu dikaji ulang:** bila PSI melewati 0,25, atau bad rate bergerak jauh dari yang diprediksi, atau calibration gap membesar. Bedakan tiga drift: performance drift (metrik memburuk), population drift (komposisi berubah — yang diukur PSI), calibration drift (PD tidak lagi jujur).

---

## Lab 1: Matriks Roll-Rate dari Tabel Counts

Tiap baris dibagi total barisnya. 4+ bertahan 0,6450; roll ke 4+ dari bucket 3: 0,2572 [lab]. Baris bucket 1 (n = 34) dihitung tapi jangan dibaca.

## Lab 2: Staging IFRS 9 dan Total ECL

Stage 1 NT$350.133.169, Stage 2 NT$101.729.540, Stage 3 (PD observasi) NT$3.473.840 — total NT$455.336.548. Koreksi Stage 3 (PD = 1): NT$5.503.500 — total terkoreksi NT$457.366.208 [lab]. Tugas tambahan: interval Wilson 95% untuk (k=2, n=2), (1.542, 2.205), (92, 129), (34, 34) → lebar 0,6576 / 0,0383 / 0,1543 / 0,1015; PSI dari expected [0,60; 0,25; 0,15] vs actual [0,52; 0,28; 0,20] → 0,0292 [lab].

## Mini-case: Nasabah Telat 2 Bulan di Agustus

Roll ke PAY_0 ≥ 2: 0,4744; default Oktober 0,5561 [notebook]. Bila PAY_0 = 2 di September → Stage 2, ECL/nasabah NT$34.035 (PD 1 bln) atau NT$41.413 (PD lifetime ilustrasi 0,85). Nasabah current: roll 0,0388, default 0,1627. Selisih itulah alasan bank menelepon yang telat 2 bulan jauh sebelum default. Roll-rate dipakai untuk perencanaan portofolio dan stage — keputusan per nasabah tetap memakai PD modelnya.

## Guided Task di Colab

Notebook: colab/mlf-m24-guided-task.ipynb — kohort dari PAY_6, matriks roll-rate 5 bucket (termasuk menemukan quirk PAY = 1), staging IFRS 9, total ECL dengan koreksi Stage 3. Tautan Colab: Buka di Colab: https://colab.research.google.com/drive/1tGsOY-Wpy9nQYeVVbDvTVvI5AFUEtHRw. Companion: notebook credit scoring (https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO).

## Rangkuman

- Vintage: kohort current 0,1867 vs kohort 4+ 0,7132 — dengan caveat tanpa tanggal origination.
- Roll-rate: 4+ bertahan 0,6450; baris bucket 1 (n = 34) jangan dibaca — quirk PAY = 1.
- Roll ke ≥ 2 dari Agustus: current 0,0388 vs bucket 2: 0,4744 — dan default Oktober 0,1627 vs 0,5561.
- IFRS 9: Stage 1 (PD 12m), Stage 2 (PD lifetime), Stage 3 (PD = 1); total ECL 1 bln NT$457.366.208.
- ECL = akuntansi (staging + aturan); EL = ekonomi (keputusan bisnis).
- Wilson 95%: n kecil berarti interval lebar — 34/34 memberi [0,8985; 1,0000], bukan kepastian.
- PSI: < 0,1 stabil, 0,1–0,25 waspada, > 0,25 drift besar; share PAY_0 = 2 naik 8,89% → 12% memberi PSI 0,0104.

# REVIEW DeepSeek M9 — Verifikasi Chief

**Tanggal:** 13 Nov 2026 ~23:12 WITA. Review 5 panggilan selesai (23:09, exit 0 semua).
**Vonis:** M9.1 REVISE (3M+4S+5N), M9.2 APPROVE-WITH-FIXES (2M+2S+4N), M9.3 APPROVE-WITH-FIXES (1M+2S+4N), M9.4 REVISE (1M+4S+2N), M9.5 APPROVE-WITH-FIXES (1M+2S+5N). **Total 8M+14S+20N = 42 temuan.**
**Verifikasi Chief (dari sumber, satu per satu): 41 BENAR, 1 NOISE.**

**Koreksi Chief 23:50 WITA 13 Nov:** header di atas awalnya tertulis "8M+14S+16N = 38" dan "37 BENAR" — salah aritmetika induk sendiri (N total = 5+4+4+2+5 = 20, bukan 16; rincian per lesson di bawah berjumlah 41 BENAR + 1 noise = 42). Koordinator fix yang menangkapnya; diperbaiki di sini. Angka 41/42 inilah yang benar.

Pelajaran proses: prompt M9 memuat kanonik PENUH M4/M6/M8/M9 + appendix M7 terpilih — noise turun dari 9/77 (M8) menjadi 1/42. Satu-satunya noise adalah salah baca figure (M9.3 N4).

## Temuan BENAR (41) — semua masuk ronde fix

### M9.1 (12/12)
- **M1** — Range "ketiganya" tidak mencakup M4: VaR gap ke M4 = 0,0050 (bukan 0,0043), ES gap ke M4 = 0,0021 (di luar 0,0035–0,0038). Teks di :59. Fix: ganti "ketiganya" → "parametrik dan MC univariat", atau perluas range (VaR 0,0042–0,0050; ES 0,0021–0,0038).
- **M2** — Kontradiksi iid: :49 (autokorelasi 0,1043 menyangkal iid) vs :95 ("syarat pertama hampir terpenuhi" untuk "return iid antar hari"). Fix: :95 ganti "return iid antar hari" → "return tidak berkorelasi (level) antar hari" + "iid penuh tidak".
- **M3** — Dekomposisi drift 10-hari: 10 × 0,000752 = 0,00752, bukan "0,005 dalam log"; 0,0043 × √10 = 0,0136, bukan 0,0133 (0,0133 = 0,0042 × √10). Teks :94. Fix: "0,0075 dalam log" + "≈ 0,0136" (atau basis 0,0042); sebaiknya tulis dekomposisi eksplisit: start 0,0136 + drift +0,0075 − skew ≈0,0076 ⇒ net ≈0,0135.
- **S1** — Sitasi [M4.2] menempel pada MC 0,0329 (itu MC M9, N=100.000); MC M4.2 = 0,0336. Teks :27. Fix: [M4.2] hanya untuk 0,0328; 0,0329 → [m9_canonical.json].
- **S2** — Range mini-case [0,0286; 0,0329] mengabaikan MC joint M4 0,0336 yang didaftar sebagai fakta. Fix: sebut eksplisit rentang tiga estimator utama + "bila M4 ikut, [0,0286; 0,0336]". Kuis :520 ("rentang [0,0286; 0,0329]") ikut diperbarui.
- **S3** — Dua toleransi (0,01 lab vs 0,002 notebook) tanpa kalimat pembeda. Teks :274/:276. Fix: satu kalimat pembeda (checks lab 0,01, N=10.000; notebook 0,002, N=100.000).
- **S4** — Label "ES95 MC 0,0407" di Figure 1 di x=100 (return ≈ −0,064), seharusnya x≈155 (skala 2333,3 px/unit; x=250 ↔ 0). Fix: pindahkan label ke x≈155 atau tambah penanda titik.
- **N1** — Tanggal 2024-11-04→2026-11-11 disitasi [m9_canonical.json] (:15), padahal tanggal tidak ada di kanonik M9 (M4: first 2024-11-01). Fix: sitasi → [M4] / [turunan].
- **N2** — "Selisih 0,0007 adalah ukuran aproksimasi" tanpa penjelasan (:59). Fix: tambah klausa (MC univariat mengaproksimasi log-return portofolio sebagai normal; MC joint M4 mensimulasikan tiga saham).
- **N3** — Sama dengan M3 (0,0043 × √10 ≈ 0,0133). Tertutup bila M3 diperbaiki.
- **N4** — Label "mean −0,0006" di x=250, seharusnya x≈248,6 (1,4 px). NIT — boleh dibiarkan, perbaiki bila figure disentuh.
- **N5** — Caption "garis tebal = VaR95 parametrik 0,0328 ≈ MC 0,0329": garis tebal (stroke-width 2, x=173,4) hanya parametrik; MC 0,0329 adalah batas polygon (x=173,2). Fix caption.

### M9.2 (8/8)
- **M1** — Figure 2: garis σ* di x=185 (≈1,27×), seharusnya x≈258 (skala 280 px per 1,0×; x=110 ↔ 1,0×, x=250 ↔ 1,5×). Fix: pindahkan line + text ke x≈258.
- **M2** — "Keduanya adalah stress korelasi yang sama" (:94): 0,0431 = ρ=0,95 LOG; 0,0445 = ρ→1 SIMPLE. Kanonik M4: stress_var95_100 = 0,0438 (ρ=1,0 LOG). Dekomposisi benar: 0,0431 → 0,0438 (skenario ρ) → 0,0445 (konvensi log→simple). Fix: rumuskan ulang kalimat itu.
- **S1** — Beta 0,1272 [M4.4] tanpa label konvensi; M9 punya beta_bbca_gspc_simple = 0,1209. Fix: tambah label basis ("[M4.4, basis M4]" vs "0,1209 [m9_canonical]") atau pakai 0,1209. Lokasi: checkpoint + kuis 9 (:545) + :555.
- **S2** — "Vol pernah berlipat ganda dalam rezim krisis" (:109) tanpa sumber; data modul: rezim 0,4131 vs 0,2777 = 1,49×. Fix: labeli ("≈1,5× di data ini [M4.5]; krisis lebih besar pernah terjadi di pasar lain [ilustrasi]").
- **N1** — "Rata-rata kerugian ketiga saham Rp7.432.406": (8.529.401+7.048.462+6.719.357)/3 = 7.432.406,67 → Rp7.432.407. Selisih Rp1 pembulatan. Fix: tambah klausa penjelas.
- **N2** — "σ* = 0,0301, yaitu 1,53× σ saat ini (0,0196)": 1,5323 × 0,0196 = 0,03003 → 0,0300 (rasio 1,5323 dihitung dari σ eksak 0,0196172). Fix: "(0,0196; rasio 1,5323 dari σ eksak 0,0196172)".
- **N3** — Lab 2: `expected` sigma_star=0.0300 vs checks label "seharusnya 0.0301" (:342 vs :257). Keduanya lolos (tol 0,0005) dan sudah dijelaskan di prose — hanya label. Fix: "seharusnya ≈0,0300–0,0301 (kanonis 0,0301)".
- **N4** — Presisi y Figure 2 (1–1,5 px). NIT, perbaiki bila figure disentuh.
- **Bukan temuan (dicatat reviewer, benar):** kasus μ bulat Lab 2 (0,0300 vs 0,0301) sudah dijelaskan memadai — TIDAK divonis. Tanggal 2024-11-04 vs M4 first 2024-11-01 konsisten (harga pertama vs return pertama).

### M9.3 (6/7)
- **M1** — "Single-split test 0,7816 / selisih 0,0042" (:100, :596): kanonis M6 `single_split_test_roc_auc = 0,7823`, `optimism_single_split_minus_nested = −0,0035`. 0,7816 = GBM terkalibrasi (gbm_platt_sigmoid.roc_auc / gbm_cal_roc_auc); 0,0042 = winners-curse optimism (0,7865−0,7823) — kuantitas lain. Fix: "0,7823 [M6.2], selisih 0,0035"; summary :596 ganti "[M6.4]" → "[M6.2]". JANGAN ubah pemakaian 0,7816 di :101 (roc_drop 0,0388 = 0,7816−0,7428 [M7.5] — benar). Perhatian: kuis :559 distraktor "rata-ratanya 0,7816 sama dengan single-split test" ikut terdampak — perbarui why-nya (single-split kini 0,7823).
- **S1** — "4,5× lebih dalam daripada VaR-nya" (:494 caption, :514 kuis): VaR hari 212 (x=417) y=105,3 → 0,0286 (skala 850,5 px/unit; 0-line y=81; titik terdalam y=199,9). Rasio = 0,1398/0,0286 = 4,89× ≈ 4,9×. Fix: "≈ 4,9×" atau nyatakan basis (terhadap VaR maksimum 0,0311).
- **S2** — "250 hari KALENDER" (:119): Basel memakai 250 hari perdagangan. Fix: "250 hari perdagangan".
- **N1** — Label "+6%" Figure 2 di y=43; +6% seharusnya y≈30 (skala 850,5 px/unit); titik maks +5,9% di y≈30,7 — DI ATAS label. Fix: pindahkan ke y≈30 atau ubah jadi "+5,9%".
- **N2** — Lab 1 hints[0]: `np.quantile(RETURNS[t-250:t], 0,05)` — koma desimal di kode (Python: "0, 05" = dua argumen / syntax error). Fix: `0.05`.
- **N3** — Tanggal "n=480 (2024-11-04 → 2026-11-11)" (:503 dkk.) tanpa penjelasan harga pertama 2024-11-01. Fix: klausa "(return pertama 2024-11-04; harga pertama 2024-11-01)".
- **N4 — NOISE (tidak diperbaiki):** "Rentang VaR −2,5% tidak tersentuh garis" — SALAH. Garis VaR (polyline width 2) mencapai y_min = 102,5 di x=86,9 → 0,0253 persis (kanonik rolling_var95_min). Reviewer hanya membaca titik awal garis (y=103,5). Prose "≈ −2,5% s.d. −3,1%" BENAR.

### M9.4 (7/7)
- **M1** — Langkah 6 + note + kuis Q7: klaim "sensitivitas μ naik di titik μ_d besar" SALAH. VaR95 = −μ_d + 1,645·σ_d LINEAR dalam μ → dVaR/dμ = −1 konstan. Basis: ΔVaR ±0,0005 = 0,0005 (1,52% relatif); di μ_d=−0,005: ΔVaR sama 0,0005 (1,34% — justru TURUN). Yang naik hanya PORSI suku μ (1,7% → 13,4%). Fix: ganti contoh ke input non-linear, ATAU tulis jujur ("porsi naik 1,7%→13,4%, sensitivitas tetap 0,0005 konstan / relatif turun 1,52%→1,34%"). Perbaiki note :122 + opsi benar Q7 (:550) + why distraktor :549/:551. Pertahankan bagian "tornado menyembunyikan interaksi" (valid).
- **S1** — "Langkah yang sama besar" (:132): 90→95 = 5 pp, 95→97,5 = 2,5 pp — bukan sama besar. Angka z benar (1,282→1,645→1,96; Δz 0,363/0,315). Fix: "langkah 5 pp memberi Δz 0,363, langkah 2,5 pp memberi Δz 0,315 — per pp ekor naik lebih cepat (0,073 vs 0,126 per pp)".
- **S2** — Figure 2 (:413): "skala profit sama ⇒ kemiringan bisa dibandingkan" menyesatkan — sumbu-x beda (LGD 0,20 vs margin 0,02 pada lebar 180 px yang sama). Visual ≈1,5× (Δprofit rentang-penuh 5,19 jt vs 7,97 jt), bukan 15× (per 0,01). Fix: klarifikasi kedua sumbu harus sama; 15× hanya dari angka per 0,01 (langkah 4), bukan dari mata.
- **S3** — Ranking "terbesar" tidak konsisten: Langkah 2 (:35) urut |Δ| (σ−10% posisi 3), Figure 1 + lab urut signed Δ (σ−10% posisi terakhir). Fix: tetapkan konvensi eksplisit di tiap tempat ("|ΔVaR|" vs "ΔVaR bertanda").
- **S4** — "Kanonis memakai nilai tak-bulat, seperti di lab 1" (:35) bertentangan dengan Langkah 8 (lab 1 memakai 0,0208 bulat → 0,0348 vs kanonis 0,0347). Fix: "berbeda dari lab 1 yang memakai 0,0208 bulat".
- **N1** — "Sepuluh kali lipat" (:111): 0,005/0,000558 = 8,96× ≈ 9×. Fix: "sekitar sembilan kali lipat".
- **N2** — "Estimasi 0,0284" (:93) vs "VaR95 historis (0,0286)" tanpa penjelasan transisi. Fix: satu klausa ("titik estimasi historis 0,0286; mean bootstrap 0,0284").
- **Bukan temuan (dicatat reviewer, benar):** selisih lab σ_port 0,0348 vs kanonis 0,0347 hanya pembulatan, sudah dijelaskan (Langkah 8) — TIDAK divonis.

### M9.5 (8/8)
- **M1** — "Selisih HS vs param (0,0042) lebih besar dari lebar setengah CI" (:95): setengah lebar CI iid = (0,0322−0,0229)/2 = 0,00465 > 0,0042. Alasan salah (kesimpulan "param di luar CI" tetap benar). Fix: "VaR95 parametrik 0,0328 melebihi batas atas CI iid 0,0322 (kelebihan 0,0006)" atau jarak HS→batas atas 0,0036 < 0,0042.
- **S1** — Step 1 (:15) memakai "0,0284 ± 0,0022" padahal step 12 (:449) melarangnya (dan step 5 note). Kontradiksi internal. Fix step 1: "Bootstrap tidak memberi jawaban keempat; ia memberi pita: CI95 [0,0229; 0,0322] di sekitar 0,0286".
- **S2** — Step 9 (:236): "+32% lebar sd, 0,0093 menjadi 0,0117" — +32% adalah kenaikan sd (0,0022→0,0029; kanonik 31,8%), sedangkan lebar CI 0,0093→0,0117 = +26% (step 6 sendiri menulis 26%). Fix: pisahkan ("sd naik +32%, lebar CI melebar +26%").
- **N1** — "Selisih terbesar 0,0043" (:15): maks−min = 0,0328−0,0284 = 0,0044. Fix: 0,0044.
- **N2** — "33 kali" (:217, :530): rasio eksak 0,0196172/0,000558 = 35,2 (kanonik sd_over_abs_mean_exact); 32,7 hanya dengan μ terbulat 0,0006. Fix: "≈33 kali (dengan μ terbulat 0,0006; dengan μ eksak ≈35 kali)".
- **N3** — "Kenapa CI-nya selebar itu (0,0117)? Karena 480 hari hanya memberi 24 hari ekor untuk ES95" (:449): 0,0117 adalah lebar CI VaR95 block; "24 hari ekor" menjelaskan CI ES95 (0,0239), bukan VaR95. Fix: pisahkan (lebar CI VaR95 dari autokorelasi 0,1043 + n=480; lebar CI ES95 dari 24 hari ekor).
- **N4** — "Hanya urutan ANTAR-blok yang diacak" (:113): kode lab 2 (`starts = rng.integers(0, N-BLOCK+1, ...)`) menarik blok DENGAN pengembalian (boleh berulang/hilang). Fix: "blok ditarik ulang DENGAN pengembalian".
- **N5** — "ES99 dirata-rata dari sekitar satu hari" (:59, :173, :235): 1% dari 120 = 1,2 hari; ES99 window-120 = 0,0941 (bukan hari terburuk tunggal 0,1398 — merata-rata ≈2 observasi). Fix: "sekitar satu-dua observasi terburuk (≈1,2 hari)".

## Kelas kesalahan baru untuk QA (masuk guard di ronde fix yang sama)
- (a) **Range "ketiganya/semua estimator" WAJIB mencakup estimator yang baru saja didaftar** (M9.1 M1/S2) — bila satu estimator dikeluarkan dari range, sebut eksplisit.
- (b) **Label "iid" vs "uncorrelated level" WAJIB dibedakan** (M9.1 M2) — "hampir terpenuhi" untuk iid penuh kontradiksi dengan autokorelasi squared return yang menyangkalnya.
- (c) **Dekomposisi aritmetika WAJIB menutup** (M9.1 M3, M9.4 M1, M9.5 M1/S2) — komponen harus dijumlahkan ke total; "sekitar X" tidak boleh menyembunyikan selisih 50% (0,005 vs 0,0075).
- (d) **Sensitivitas vs porsi WAJIB dibedakan** (M9.4 M1) — untuk fungsi linear, turunan konstan; yang naik adalah porsi, bukan sensitivitas.
- (e) **"Langkah yang sama besar" WAJIB dicek pp-nya** (M9.4 S1) — 5 pp ≠ 2,5 pp.
- (f) **Perbandingan kemiringan visual WAJIB samakan KEDUA sumbu** (M9.4 S2) — samakan sumbu-y saja tidak cukup.
- (g) **Konvensi ranking ("terbesar") WAJIB eksplisit |Δ| vs signed** (M9.4 S3).
- (h) **Koma desimal di hint kode WAJIB titik** (M9.3 N2) — hint yang berisi kode Python memakai 0.05, bukan 0,05.
- (i) **"250 hari" Basel = hari perdagangan, bukan kalender** (M9.3 S2).
- (j) **Figure label WAJIB dicek posisinya terhadap skala sumbu** (M9.1 S4, M9.2 M1, M9.3 N1) — label di luar titiknya menyesatkan.
- (k) **Format "mean ± sd bootstrap" WAJIB tidak dipakai di step pembuka bila lesson melarangnya di step akhir** (M9.5 S1) — kontradiksi internal step 1 vs step 12.

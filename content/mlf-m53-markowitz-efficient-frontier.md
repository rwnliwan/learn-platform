# MLF-M5.3: Markowitz Mean-Variance & Efficient Frontier

## Masalah: Tiga Saham, Satu Pertanyaan — Kombinasi Bobot Mana yang «Terbaik»?

Sebelum 1952, nasihat investasi yang dominan adalah: cari saham dengan return tertinggi, lalu beli sebanyak-banyaknya. Harry Markowitz — dalam paper «Portfolio Selection» (Journal of Finance, 1952) — menunjukkan bahwa nasihat itu salah secara logis: investor tidak hanya peduli return, ia peduli return DAN risiko. Dua saham yang masing-masing berisiko bisa digabung menjadi portofolio yang risikonya LEBIH KECIL dari masing-masing — bila keduanya tidak bergerak searah.

**Konvensi data — WAJIB dibaca dulu [notebook]:** SIMPLE return (bukan log), 480 hari perdagangan bersama 2024-11-04 s.d. 2026-11-11 (unduhan 2024-11-01 s.d. 2026-11-12, file pin data/m4_prices.csv), annualisasi ×252 untuk return dan √252 untuk volatilitas, risk-free rate rf = 0,05. Perhatian: M4.4 memakai LOG return untuk VaR — M5 memakai SIMPLE return untuk mean/variance; keduanya dilabeli di mana pun keduanya muncul.

**Kejujuran soal data:** ini window pasar TURUN. Dua dari tiga saham punya return tahunan negatif (BBCA −0,2445, KLBF −0,2570); hanya UNVR yang positif (0,0796). Frontier di lesson ini sebagian besar berada di return negatif — tiga titik teratasnya (return 0,0025; 0,0410; 0,0796) berada di atas return 0; lima titik sisanya negatif. Frontier di sini menjawab «risiko minimum untuk tiap target return», bukan «return tinggi». Portofolio «terbaik» di window ini tetap merugi — hanya merugi dengan risiko sekecil mungkin.

---

## 1. Input Optimasi: Expected Return dan Kovarians dari Data Pin

Optimasi Markowitz hanya butuh DUA input: vektor expected return μ dan matriks kovarians Σ. Di lesson ini keduanya dihitung dari data pin: rata-rata return harian SIMPLE ×252, dan kovarians harian ×252 [notebook].

**Nilai — per-aset, tahunan [notebook]:** BBCA return −0,2445, vol 0,3449, Sharpe −0,8540; KLBF return −0,2570, vol 0,4251, Sharpe −0,7221; UNVR return 0,0796, vol 0,5014, Sharpe 0,0590. Sharpe terhadap rf = 0,05. BBCA punya vol TERKECIL (0,3449) tapi Sharpe TERBURUK (−0,8540) — vol kecil tidak otomatis berarti «bagus».

**Nilai — korelasi [notebook]:** BBCA–KLBF 0,3488; BBCA–UNVR 0,2774; KLBF–UNVR 0,2897. Ketiganya positif tapi jauh dari 1 — diversifikasi bekerja sebagian: rata-rata volatilitas ketiga saham (yang akan menjadi vol EW bila korelasi = 1) adalah 0,4238, tapi volatilitas portofolio equal-weight hanya 0,3114 [notebook]. Selisih 0,1124 itu adalah hadiah diversifikasi.

**Nilai — matriks kovarians tahunan Σ [notebook]:** baris BBCA [0,118956; 0,051145; 0,047974]; baris KLBF [0,051145; 0,180734; 0,061751]; baris UNVR [0,047974; 0,061751; 0,251375]. Diagonalnya adalah varians (vol²).

$$R_p = w'\mu \qquad \sigma_p = \sqrt{w'\Sigma w} \qquad S_p = \frac{R_p - r_f}{\sigma_p}$$

**Baik/buruk:** μ dan Σ historis bagus karena konkret dan bisa direplikasi. Buruk bila μ historis dibaca sebagai «return yang AKAN datang»: rata-rata return 480 hari adalah ESTIMASI yang berisik — standard error return tahunan BBCA saja ≈ 0,25, sebesar return-nya sendiri.

**Mitigasi:** laporkan SELALU window dan konvensi di samping μ dan Σ — «return tahunan BBCA −0,2445» tanpa «simple return, 480 hari, 2024-11-04 s.d. 2026-11-11» adalah angka tanpa alamat.

---

## 2. Efficient Frontier: Satu Titik untuk Tiap Target Return

Untuk TIAP target return: minimalkan varians w'Σw, dengan syarat bobot berjumlah 1, bobot ≥ 0 (long-only), dan w'μ = target. Kurva yang menghubungkan semua titik itu adalah frontier.

**Nilai — 8 titik frontier [notebook]:** (return −0,1903, vol 0,2966, w [0,5522; 0,2701; 0,1778]); (−0,1517, 0,3021, w [0,4890; 0,2164; 0,2946]); (−0,1132, 0,3179, w [0,4258; 0,1627; 0,4115]); (−0,0746, 0,3428, w [0,3624; 0,1092; 0,5284]); (−0,0361, 0,3749, w [0,2985; 0,0562; 0,6453]); (0,0025, 0,4125, w [0,2352; 0,0026; 0,7622]); (0,0410, 0,4548, w [0,1189; 0,0000; 0,8811]); (0,0796, 0,5014, w [0,0000; 0,0000; 1,0000]). Makin tinggi target return, makin besar bobot UNVR; pada target 0,0410 bobot KLBF sudah nol; pada target tertinggi hanya UNVR yang tersisa.

**Gambar:** frontier (sumbu-x vol, sumbu-y return) — equal-weight (return −0,1406, vol 0,3114) duduk sedikit di bawah kurva; BBCA dan KLBF jauh di bawah kurva; garis putus-putus = CML dari rf 0,05 ke titik tangency; tiga titik teratas frontier (return 0,0025; 0,0410; 0,0796) berada di atas return 0.

**Baik/buruk:** frontier bagus karena ia MEMISAHKAN «portofolio mana yang efisien?» (di atas kurva) dari «target return mana yang kamu mau?» (di mana pada kurva). Buruk bila dibaca sebagai «janji»: kurva ini dihitung dari μ dan Σ MASA LALU.

**Mitigasi:** bila seseorang menunjukkan frontier yang seluruhnya di return positif dan mulus, tanyakan dulu window dan konvensinya. Frontier yang «terlalu bagus» biasanya berarti inputnya yang terlalu optimistis.

---

## 3. GMV: Portofolio dengan Risiko Terkecil yang Mungkin

Global Minimum Variance portfolio — portofolio long-only dengan volatilitas TERKECIL dari semua kombinasi bobot. Ia hanya memakai Σ, bukan μ — sehingga lebih bisa diandalkan daripada portofolio yang bergantung pada μ.

**Nilai — GMV long-only [notebook]:** bobot [0,5523; 0,2699; 0,1777]; return −0,1903, vol 0,2966, Sharpe −0,8100. Vol-nya lebih kecil dari vol aset tunggal terkecil (BBCA 0,3449) dengan selisih 0,0483. Sama dengan GMV tak-terkendala closed-form M5.2 ([0,5518; 0,2698; 0,1785], selisih maks 0,0008) — kendala «tanpa short» TIDAK MENGIKAT di sini.

$$w^*_{GMV} = \frac{\Sigma^{-1}\mathbf{1}}{\mathbf{1}'\Sigma^{-1}\mathbf{1}} = [0{,}5523;\; 0{,}2699;\; 0{,}1777]$$

**Baik/buruk:** GMV bagus sebagai JANGKAR — titik awal yang jujur («inilah risiko terkecil yang mungkin»). Buruk bila dijadikan TUJUAN tanpa melihat return: return-nya −0,1903 (terendah di frontier) dan Sharpe-nya −0,8100 (terburuk dari ketiganya). «Paling tenang» bukan «paling baik».

**Mitigasi:** pakai GMV sebagai pembanding: «vol-nya berapa di atas GMV (0,2966), dan return tambahan apa yang kamu dapat untuk vol ekstra itu?»

---

## 4. Tangency / Max-Sharpe dan CML: Mengapa Jawabannya 100% UNVR

Titik tangency = portofolio dengan Sharpe ratio TERTINGGI. Garis lurus dari (vol 0, return rf) yang MENYINGGUNG frontier di titik itu adalah Capital Market Line (CML); setiap campuran aset bebas risiko + portofolio tangency duduk di CML dengan Sharpe yang sama.

**Nilai — max-Sharpe long-only [notebook]:** bobot [0; 0; 1] — 100% UNVR; return 0,0796, vol 0,5014, Sharpe 0,0590. Ini CORNER SOLUTION: hanya UNVR yang punya excess return POSITIF (0,0796 − 0,05 = +0,0296); BBCA (−0,2945) dan KLBF (−0,3070) negatif — menambahkan keduanya hanya menurunkan Sharpe.

$$S^* = \max_w \frac{w'\mu - r_f}{\sqrt{w'\Sigma w}} = 0{,}0590 \qquad R_{CML} = r_f + S^* \cdot \sigma_p$$

**Bacaan yang jujur:** Sharpe maksimum 0,0590 itu SANGAT KECIL (Sharpe 1,0 sudah dianggap bagus untuk strategi aktif) — CML-nya nyaris DATAR. «Portofolio optimal» di window ini Sharpe-nya nyaris nol, karena tidak ada aset yang memberi excess return berarti.

**Nilai — contoh CML [notebook]:** 50% aset bebas risiko + 50% tangency → return 0,0648, vol 0,2507, Sharpe TETAP 0,0590. Setengah risiko, setengah excess return — rasio yang sama.

**Catatan penghubung ke M5.2:** max-Sharpe TAK-TERKENDALA di data ini adalah ill-posed — SLSQP «berhenti» di bobot raksasa [−3154; −3786; 6941] dengan Sharpe 0,6697, yang bukan solusi apa-apa. Kendala long-only-lah yang membuat max-Sharpe di lesson ini punya jawaban yang waras.

**Baik/buruk:** tangency bagus karena ia memberi SATU portofolio berisiko yang «cukup» untuk semua investor. Buruk bila corner solution dibaca sebagai «rekomendasi beli 100% UNVR»: itu jawaban optimasi terhadap μ historis 480 hari — bukan nasihat investasi.

---

## 5. Membaca Frontier: Dominasi, dan Portofolio di Bawah Kurva

Portofolio A DIDOMINASI bila ada portofolio B dengan return LEBIH TINGGI dan vol LEBIH RENDAH. Setiap portofolio DI BAWAH kurva didominasi oleh titik frontier tepat di atasnya.

**Nilai — perbandingan tiga portofolio [notebook]:** equal-weight return −0,1406, vol 0,3114, Sharpe −0,6122; GMV return −0,1903, vol 0,2966, Sharpe −0,8100; max-Sharpe return 0,0796, vol 0,5014, Sharpe 0,0590. GMV punya vol TERKECIL tapi return TERENDAH dan Sharpe TERBURUK; max-Sharpe punya return TERTINGGI tapi vol TERBESAR; equal-weight di tengah pada keduanya.

**Nilai — vonis atas equal-weight [notebook]:** pada return yang SAMA (−0,1406), frontier memberi vol 0,3056 (bobot [0,4708; 0,2009; 0,3283]) — equal-weight membayar vol EKSTRA 0,0058 untuk return yang sama: TIDAK EFISIEN, meski hanya sedikit.

**Nilai — vonis atas aset tunggal [notebook]:** BBCA (return −0,2445, vol 0,3449) didominasi GMV (return −0,1903, vol 0,2966) di kedua sisi. KLBF (return −0,2570, vol 0,4251) didominasi GMV juga — dan bahkan didominasi portofolio [0,5; 0,5; 0] (return −0,2508, vol 0,3170).

**Gambar:** batang return dan vol EW vs GMV vs max-Sharpe — GMV vol terkecil (0,2966) tapi return terendah (−0,1903); max-Sharpe return tertinggi (0,0796) tapi vol terbesar (0,5014).

**Baik/buruk:** vonis dominasi bagus karena ia TIDAK BUTUH preferensi risiko. Buruk bila diterapkan tanpa menyebut «dalam model mean-variance»: di dunia nyata, portofolio yang didominasi bisa dipegang karena alasan lain (misal larangan memegang aset tertentu).

**Mitigasi:** bila portofolio-mu duduk di bawah frontier, tanya «berapa vol ekstra yang kubayar, dan untuk apa?» Bila jawabannya «tidak untuk apa-apa», pindahlah ke titik frontier di atasnya.

---

## 6. Biaya Transaksi: Frontier yang Belum Membayar Apa-apa

Semua yang dihitung sejauh ini hidup di dunia tanpa gesekan: bobot berubah gratis, berapa pun besarnya. Setiap kali bobot berubah, seseorang harus membeli dan menjual saham — dan tiap perdagangan membayar spread, komisi, dan slippage.

**Model biaya [ilustrasi]:** spread 10bp + komisi 5bp + slippage 5bp = 20bp sekali jalan per unit notional. Turnover diukur dengan norma L1 (jumlah seluruh perubahan bobot, nilai absolut); notional sekali jalan adalah L1/2 — bukan L1. Rumus: biaya = (L1/2) × 20bp [ilustrasi].

**Nilai — tabel turnover dari equal-weight [notebook]:** EW→GMV L1 0,4380 → biaya 4,38bp (Rp43.796 per Rp100jt); EW→RP L1 0,1294 → 1,29bp (Rp12.943); EW→MS L1 1,3333 → 13,33bp (Rp133.333); GMV→RP L1 0,3085 → 3,09bp (Rp30.853). GMV periode-1 → GMV window penuh L1 0,2783 → 2,78bp.

**Nilai — budget turnover (dari EW) [notebook]:** L1 ≤ 0,05 → w [0,3583; 0,3333; 0,3083], vol 0,3078 (+112bp vs GMV bebas 0,2966); L1 ≤ 0,10 → w [0,3833; 0,3333; 0,2833], vol 0,3048 (+82bp); L1 ≤ 0,20 → w [0,4333; 0,3333; 0,2334], vol 0,3003 (+37bp).

**Gambar:** kurva budget turnover (sumbu-x) vs vol GMV (sumbu-y) — titik (0,05; 0,3078), (0,10; 0,3048), (0,20; 0,3003), (bebas 0,4380; 0,2966); garis putus-putus = vol GMV bebas 0,2966.

**Baik/buruk:** memasukkan biaya mengubah jawaban ke arah yang bisa DIJALANKAN (EW→MS membayar 13,33bp tiap dibentuk — tiga kali lipat EW→GMV). Buruk bila dipakai sebagai alasan untuk tidak pernah bergerak: budget L1 ≤ 0,05 mengunci portofolio 112bp di atas vol minimum.

**Mitigasi:** hitung turnover SEBELUM menyetujui perpindahan; bila membatasi turnover, laporkan harganya dalam vol — supaya «hemat biaya» tidak terlihat gratis.

---

## 7. Rebalancing: Dari Satu Optimasi ke Proses yang Berjalan Terus

Siklusnya: estimasi → optimasi → eksekusi → monitor → rebalance — lalu kembali ke estimasi. Dua pemicu: kalender (bulanan/kuartalan) vs ambang drift (rebalance bila bobot menyimpang > ambang dari target).

**Nilai — drift buy-and-hold 240 hari, periode 2, target tetap [notebook]:** GMV [0,5523; 0,2699; 0,1777] → [0,5575; 0,2585; 0,1839], L1 drift hanya 0,0228, drift aset terbesar 0,0114 (1,14pp). Risk parity: L1 0,0272. Equal-weight: L1 0,0286. Drift-nya KECIL karena ketiga saham jatuh BERSAMA (crash merata) — drift kecil saat aset bergerak searah; drift BESAR muncul saat satu aset bergerak berlawanan arah dengan yang lain.

**Nilai — simulasi 480 hari, target GMV tetap, biaya [ilustrasi] 20bp sekali jalan [notebook]:** ambang drift 2pp → 39 rebalance, biaya total 18,76bp (~9,85bp/tahun); ambang 5pp → 5 rebalance, 5,59bp (~2,93bp/tahun); kalender bulanan → 22 rebalance, 9,66bp (~5,07bp/tahun); kalender kuartalan → 7 rebalance, 3,68bp (~1,93bp/tahun). Ambang 5pp dan kuartalan berada di orde yang sama — ambang longgar ≈ kuartalan. Ambang 2pp memakan biaya tahunan 9,85bp — hampir DUA KALI bulanan (5,07bp) dan LIMA KALI kuartalan (1,93bp).

**Baik/buruk:** pemicu kalender bisa dijadwalkan dan biayanya bisa diprediksi — tapi rebalance meski tidak ada yang berubah. Pemicu ambang hanya bergerak saat perlu — tapi ambang 2pp menangkap noise harian dan memicu 39 kali.

**Mitigasi:** pilih ambang dari ukuran drift yang WAJAR di datamu — di sini drift aset terbesar 240 hari hanya 0,0114, jadi ambang 2pp hanya sekitar 2× drift itu, sementara ambang 5pp sekitar 4×. Laporkan SELALU biaya rebalancing dalam bp/tahun di samping vol-nya.

---

## 8. Dari Bobot ke Perdagangan: Lot, Sisa Kas, dan Trade List

Bobot adalah jawaban matematika; perdagangan adalah jawaban yang dieksekusi. Contoh [ilustrasi] Rp100.000.000 dengan harga penutupan 2026-11-11: BBCA Rp5.325, KLBF Rp770, UNVR Rp1.535; lot IDX 100 lembar, dibulatkan KE BAWAH.

**Nilai — GMV [ilustrasi]:** BBCA target Rp55.231.188 → 10.300 lbr (Rp54.847.500); KLBF target Rp26.994.283 → 35.000 lbr (Rp26.950.000); UNVR target Rp17.774.529 → 11.500 lbr (Rp17.652.500); total terinvestasi Rp99.450.000, sisa kas Rp550.000 (0,55%). Tanpa lot (1 lembar): sisa kas hanya Rp1.445. Max-Sharpe: UNVR 65.100 lbr, sisa Rp71.500 (0,07%). Equal-weight: sisa Rp411.500 (0,41%).

**Nilai — trade list EW → GMV [ilustrasi]:** BBCA BELI 4.100 lbr (Rp21.832.500); KLBF JUAL 8.200 lbr (Rp6.314.000); UNVR JUAL 10.200 lbr (Rp15.657.000). Trade list TIDAK BISA dihitung dari bobot saja — ia butuh holdings AWAL (EW: BBCA 6.200 lbr, KLBF 43.200 lbr, UNVR 21.700 lbr). Cek feasibility: total terinvestasi (Rp99.450.000) ≤ nilai portofolio (Rp100.000.000), sisa kas ≥ 0 — keduanya lolos karena pembulatan ke bawah tidak pernah membeli melebihi target.

**Baik/buruk:** membulatkan ke bawah MENJAMIN feasibility — tidak pernah over-budget. Buruk bila sisa kas dibiarkan menganggur tanpa dicatat: 0,55% kas adalah 0,55% portofolio yang tidak mengikuti strategi — satu lot BBCA saja Rp532.500.

**Mitigasi:** laporkan SELALU tiga angka di samping bobot — jumlah lembar per aset, nilai terinvestasi, dan sisa kas.

---

## 9. Risiko Downside: Bila yang Ditakuti Bukan Naik-Turun, Tapi Jatuh

Varians menghukum naik dan turun dengan sama. Downside deviation hanya menghitung return DI BAWAH target minimum (MAR). Di sini MAR = 0: hanya hari-hari negatif yang dihitung.

**Nilai — per-aset, MAR = 0, tahunan [notebook]:** BBCA downside deviation 0,2506 (vol penuh 0,3449), KLBF 0,2914 (0,4251), UNVR 0,3242 (0,5014). Sortino (excess atas rf dibagi downside deviation): BBCA −1,1754, KLBF −1,0536, UNVR 0,0913.

**Nilai — min-semivarians [notebook]:** w [0,6031; 0,2262; 0,1707], return −0,1920, vol 0,2974, downside deviation 0,2343, Sortino −1,0331 — vs GMV downside deviation 0,2345, Sortino −1,0244; EW downside deviation 0,2427, Sortino −0,7856. Kejujuran yang wajib ditulis: min-semivarians NYARIS SAMA dengan GMV (0,2343 vs 0,2345, selisih 0,0002) karena downside bergerak seiring vol penuh — downside optimization bukan sihir.

**Nilai — ES95-min [notebook]:** optimasi Expected Shortfall 95% (LP, 480 skenario) memberi w [0,4868; 0,3710; 0,1423], return −0,2030, vol 0,2996, VaR95 harian 0,0280, ES95 harian 0,0429 — vs GMV VaR95 0,0267, ES95 0,0437. ES-min menukar SEDIKIT VaR (0,0267 → 0,0280, naik) dengan SEDIKIT ES (0,0437 → 0,0429, turun).

**Gambar:** batang downside deviation GMV (0,2345) vs min-semivarians (0,2343) vs EW (0,2427) + Sortino tiap portofolio.

**Baik/buruk:** ukuran downside menjawab ketakutan yang sebenarnya («berapa dalam aku bisa jatuh?»). Buruk bila dipakai sebagai «pengganti varians yang lebih canggih» tanpa memeriksa: di data ini ia memberi jawaban yang nyaris sama dengan GMV.

**Mitigasi:** laporkan downside deviation dan Sortino DI SAMPING vol dan Sharpe — bukan menggantikannya.

---

## 10. Sensitivitas: Input Mana yang Paling Menggerakkan Jawaban?

Sensitivitas BUKAN «angka berubah» — tapi «input mana yang paling menggerakkan jawaban». Satu input berubah pada satu waktu, selalu.

**Nilai — rf [notebook]:** rf 0,03 → MS long-only tetap [0; 0; 1], return 0,0796, vol 0,5014, Sharpe 0,0989; rf 0,05 → Sharpe 0,0590; rf 0,07 → Sharpe 0,0192. Bobotnya TIDAK BERGERAK SAMA SEKALI — hanya UNVR yang excess return-nya positif pada semua rf itu.

**Nilai — target return [notebook]:** target −0,10 → w [0,4042; 0,1443; 0,4514], vol 0,3255; target 0,00 → w [0,2393; 0,0061; 0,7546], vol 0,4099.

**Nilai — vol [notebook]:** vol UNVR ×1,2 → GMV [0,6004; 0,3016; 0,0981]; vol KLBF ×1,2 → GMV [0,6332; 0,1556; 0,2112]; SEMUA vol ×1,1 → GMV TETAP [0,5523; 0,2699; 0,1777] (skala seragam tidak mengubah GMV — hanya rasio yang penting).

**Nilai — cap dan shrinkage [notebook]:** cap w_UNVR ≤ 0,50 pada max-Sharpe → w [0; 0,5; 0,5], return −0,0887, vol 0,3727, Sharpe −0,3721 (vs tanpa cap [0; 0; 1] Sharpe 0,0590). Shrinkage δ 0 → GMV [0,5523; 0,2699; 0,1777]; δ 0,0955 → [0,5185; 0,2852; 0,1963] (= GMV Ledoit-Wolf kanonis); δ 0,3 → [0,4597; 0,3080; 0,2323]; δ 0,5 → [0,4147; 0,3213; 0,2640].

**Gambar:** batang bobot BBCA (GMV) di bawah tiap skenario — garis putus-putus = GMV dasar 0,5523.

**Pesan:** di sini yang paling menggerakkan jawaban adalah cap UNVR dan vol relatif; rf hampir tidak menggerakkan MS long-only karena hanya UNVR yang excess-nya positif.

**Mitigasi:** sebelum mempercayai satu portofolio «optimal», jalankan tabel ini: ubah rf ±0,02, target ±0,10, tiap vol ×1,2, tambah cap yang relevan, dan shrinkage 0 → 0,5.

---

## 11. Two-Fund Separation — dan Batasan Markowitz

Two-fund separation: SELURUH efficient frontier bisa dibangun dari DUA portofolio efisien mana pun. Campur dua titik frontier — hasilnya tetap di frontier (tanpa aset bebas risiko) atau di CML (dengan aset bebas risiko).

**Nilai — contoh campuran [notebook]:** 50% GMV + 50% max-Sharpe → bobot [0,2762; 0,1349; 0,5888], return −0,0553, vol 0,3588, Sharpe −0,2935 — duduk DI frontier. 50% tunai (rf 0,05) + 50% tangency → return 0,0648, vol 0,2507, Sharpe TETAP 0,0590 — duduk di CML.

**Batasan pertama — estimasi:** μ adalah statistik PALING BERISIK (standard error return tahunan BBCA ≈ 0,25). Optimasi memaksimalkan kesalahan estimasi: membebani aset yang return historisnya «kebetulan» tinggi. Mitigasi: shrinkage dan Black-Litterman (M5.5).

**Batasan kedua — normalitas:** mean-variance hanya peduli dua momen pertama. Bila return punya ekor tebal, varians MEREMEHKAN risiko sebenarnya. Mitigasi: lengkapi dengan VaR/ES (M4.2–M4.3).

**Batasan ketiga — satu periode:** tidak ada rebalancing, biaya transaksi, atau pajak. Mitigasi: uji out-of-sample (M5.5).

**Batasan keempat — tanpa gesekan:** tidak ada biaya transaksi, semua aset bisa dibeli/dijual berapa pun pada harga yang sama. Di data ini, kendala long-only justru yang menyelamatkan max-Sharpe dari jawaban tak-berhingga.

---

## Lab 1: Hitung Frontier dengan SLSQP

SLSQP pada μ dan Σ dari data pin [notebook] (Σ dibulatkan ke 6 desimal — menggeser satu titik frontier sebesar 0,0001: titik kelima tercetak 0,3748, kanonis dari Σ penuh 0,3749; di notebook, yang menghitung Σ langsung dari CSV, nilainya 0,3749 persis).

**Hasil [lab]:** GMV w = [0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966, Sharpe −0,8100; 8 titik frontier dengan vol 0,2966; 0,3021; 0,3179; 0,3428; 0,3748; 0,4125; 0,4548; 0,5014. Titik terakhir: target 0,0796 memaksa w = [0; 0; 1] — SLSQP sendiri yang menemukan corner solution itu.

**Bacaan yang jujur:** SLSQP di sini bekerja pada masalah konveks (kuadratik + kendala linear) — hampir selalu menemukan optimum global. Bandingkan dengan M5.2: SLSQP pada max-Sharpe TAK-TERKENDALA (non-konveks, tanpa batas) «berhasil» sambil mengembalikan [−3154; −3786; 6941]. Solver yang sama, masalah yang berbeda — selalu tanyakan dulu: apakah masalahku konveks?

## Lab 2: Bandingkan EW vs GMV vs Max-Sharpe

**Hasil [lab]:** EW return −0,1406, vol 0,3114, Sharpe −0,6122; GMV return −0,1903, vol 0,2966, Sharpe −0,8100; max-Sharpe return 0,0796, vol 0,5014, Sharpe 0,0590. Vol TERKECIL: GMV. Return TERTINGGI: max-Sharpe. Sharpe TERTINGGI: max-Sharpe — satu-satunya yang positif. Tidak ada yang menang di semua ukuran.

**Vonis dominasi [lab]:** pada return EW (−0,1406), vol frontier adalah 0,3056 — EW membayar vol ekstra 0,0058. CML 50% tunai + 50% tangency: return 0,0648, vol 0,2507, Sharpe 0,0590 — Sharpe yang sama dengan tangency, dengan vol SETENGAH dari 100% UNVR.

---

## Jebakan: Frontier In-Sample Bukan Janji

Frontier di lab 1 adalah frontier IN-SAMPLE — dari μ dan Σ yang diestimasi dari 480 hari yang SAMA dengan hari-hari yang dinilai. Optimasi memaksimalkan kesalahan estimasi μ: ia membuang BBCA sampai nol dan menumpuk UNVR sampai 100% — persis pada aset yang «kebetulan» terlihat terbaik.

**Nilai — ukuran masalahnya [notebook, M5.5]:** max-Sharpe in-sample (240 hari pertama) punya return 0,4831 dan Sharpe 0,7644. Out-of-sample (240 hari berikutnya) return-nya −0,3239 dan Sharpe −0,8780. Equal-weight in-sample (return 0,0856, Sharpe 0,1154) menjadi −0,3669 / −1,3278 out-of-sample. GMV jatuh dari Sharpe in-sample −0,4139 ke −1,2447 out-of-sample. Tidak ada yang selamat — karena seluruh window ini adalah pasar turun.

**Mitigasi — tiga lapis (M5.5):** (1) uji out-of-sample SELALU — split waktu, bukan split acak; (2) shrinkage — GMV Ledoit-Wolf [0,5185; 0,2852; 0,1963] vs GMV biasa [0,5523; 0,2699; 0,1777]; (3) Black-Litterman — campur μ historis dengan pandangan investor dan equilibrium. Aturan praktis yang paling murah: bila frontier-mu bergantung pada SATU aset (corner 100% UNVR), anggap itu sebagai peringatan, bukan sebagai jawaban.

---

## Guided Task di Colab

Notebook: colab/mlf-m53-guided-task.ipynb — memuat harga BBCA, KLBF, UNVR (window 2024-11-01 sampai 2026-11-12; file pin diunduh 2026-11-12), menghitung SIMPLE return dan annualisasi ×252/√252, membangun μ dan Σ dari nol, mereplikasi GMV long-only, max-Sharpe long-only, kedelapan titik frontier, perbandingan EW vs GMV vs max-Sharpe, dan CML — lengkap dengan 6 checks. Tautan Colab: https://colab.research.google.com/drive/1wSLMqtoIRBolkbjJtQjqMAoh87Jqnw1J

---

## Rangkuman

- Markowitz 1952: investor peduli return DAN risiko; diversifikasi bekerja karena korelasi di bawah 1 (0,2774–0,3488 [notebook]) — vol equal-weight 0,3114 vs rata-rata vol anggota 0,4238.
- Input dari data pin [notebook]: SIMPLE return, 480 hari 2024-11-04 s.d. 2026-11-11, annualisasi ×252/√252, rf 0,05. BBCA return −0,2445, vol 0,3449, Sharpe −0,8540; KLBF −0,2570, vol 0,4251, Sharpe −0,7221; UNVR 0,0796, vol 0,5014, Sharpe 0,0590. (M4.4 memakai LOG return untuk VaR — konvensi berbeda, jangan dicampur.)
- Efficient frontier 8 titik [notebook]: dari GMV (return −0,1903, vol 0,2966) ke 100% UNVR (return 0,0796, vol 0,5014); makin tinggi target, makin besar bobot UNVR.
- GMV long-only [0,5523; 0,2699; 0,1777]: vol terkecil 0,2966, return −0,1903, Sharpe −0,8100 — jangkar dan pembanding, bukan tujuan; hanya memakai Σ.
- Max-Sharpe long-only [0; 0; 1] (100% UNVR): Sharpe 0,0590, CML nyaris datar — corner solution karena hanya UNVR yang excess return-nya positif (+0,0296).
- Dominasi: equal-weight (return −0,1406, vol 0,3114) didominasi — pada return yang sama frontier memberi vol 0,3056 (gap 0,0058); BBCA dan KLBF didominasi GMV di kedua sisi.
- Two-fund separation: 50% GMV + 50% max-Sharpe → return −0,0553, vol 0,3588 (tetap di frontier); 50% tunai + 50% tangency → return 0,0648, vol 0,2507, Sharpe tetap 0,0590 (di CML).
- Batasan: μ berisik (standard error return tahunan BBCA ≈ 0,25), normalitas, satu periode, tanpa gesekan — mitigasinya shrinkage, Black-Litterman, dan uji out-of-sample (M5.5).
- Biaya transaksi [ilustrasi]: spread 10bp + komisi 5bp + slippage 5bp = 20bp sekali jalan; biaya = (L1/2) × 20bp — EW→GMV 4,38bp (Rp43.796 per Rp100jt), EW→MS 13,33bp; budget turnover L1 ≤ 0,10 → vol 0,3048 (+82bp vs GMV bebas).
- Rebalancing: lifecycle estimasi → optimasi → eksekusi → monitor → rebalance; drift GMV 240 hari hanya L1 0,0228 (crash merata); ambang 2pp 39×/9,85bp per tahun vs ambang 5pp 5×/2,93bp per tahun — ambang longgar ≈ kuartalan.
- Dari bobot ke perdagangan [ilustrasi]: harga 2026-11-11 BBCA Rp5.325, KLBF Rp770, UNVR Rp1.535; lot 100, bulatkan ke bawah — GMV sisa kas Rp550.000 (0,55%) vs Rp1.445 tanpa lot; trade list EW→GMV butuh holdings awal.
- Risiko downside: downside deviation MAR=0 BBCA 0,2506, KLBF 0,2914, UNVR 0,3242; min-semivarians DD 0,2343 vs GMV 0,2345 — nyaris sama, downside optimization bukan sihir; ES95-min w [0,4868; 0,3710; 0,1423], ES95 harian 0,0429 vs GMV 0,0437.
- Sensitivitas: rf 0,03–0,07 tidak mengubah MS long-only [0; 0; 1]; semua vol ×1,1 TIDAK mengubah GMV [0,5523; 0,2699; 0,1777]; cap UNVR ≤ 0,50 menjatuhkan Sharpe MS ke −0,3721; shrinkage δ 0,5 → GMV [0,4147; 0,3213; 0,2640].
- Jebakan: frontier in-sample bukan janji — max-Sharpe in-sample Sharpe 0,7644 menjadi −0,8780 out-of-sample (M5.5).
- Lab: SLSQP frontier 8 titik (GMV 0,2966; ujung 100% UNVR 0,5014); perbandingan EW vs GMV vs MS + gap EW 0,0058 + CML 50/50 Sharpe 0,0590.

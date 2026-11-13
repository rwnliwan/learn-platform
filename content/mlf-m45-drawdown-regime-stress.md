# MLF-M4.5: Drawdown, Regime & Stress Test — Saat Diversifikasi Menghilang

## Masalah: 16 Oktober 2026 — Semua Jatuh Bersamaan

Manajer risiko portofolio equal-weight BBCA/KLBF/UNVR membuka layar pada 16 Oktober 2026: BBCA jatuh dengan log return −0,1603 (sekitar −14,8%), KLBF −0,1573 (sekitar −14,6%), UNVR −0,1344 (sekitar −12,6%) — dalam SATU hari [notebook]. Bukan satu saham yang jatuh; ketiganya jatuh bersamaan. Diversifikasi tidak menolong — karena pada hari itu korelasi antar saham melonjak bersamaan: korelasi rata-rata antar pasangan saham di regime high-vol 0,3752, vs 0,2775 di low-vol [notebook]. Di akhir window portofolio itu masih terendam −35,28% di bawah puncak tertingginya [notebook]. Pertanyaan lesson ini: «seberapa dalam kamu jatuh, berapa lama kamu terendam, dan apa yang terjadi pada risikomu ketika dunia berubah regime?»

Portofolio equal-weight 3 saham IDX punya maximum drawdown −0,4363 (puncak 2025-11-05 → lembah 2026-10-19), BELUM pulih, terendam 243 hari [notebook]. Bandingkan ^GSPC: maxDD hanya −0,1890, pulih 2025-06-27, saat ini hanya −0,0255 [notebook]. Drawdown menjawab pertanyaan yang tidak dijawab VaR: «seberapa dalam dan berapa lama kamu menderita?»

---

## 1. Apa Itu Drawdown

Drawdown dihitung dari deret kekayaan, bukan dari return. Mulai dari kekayaan 1,0; tiap hari kekayaan dikalikan (1 + simple return). Running max = puncak tertinggi yang pernah dicapai sampai hari itu. Drawdown hari itu = kekayaan / running max − 1 (selalu ≤ 0). Maximum drawdown (maxDD) = drawdown paling negatif sepanjang window; durasi terendam = jumlah hari berurutan terlama dengan drawdown < 0.

**Nilai [notebook]:** definisi ini — kekayaan dari 1,0, simple return, running max — dipakai untuk SEMUA angka drawdown lesson ini. Tiga besaran turunan: maxDD, durasi terendam, dan status pemulihan (apakah kekayaan pernah kembali menyentuh puncak, dan kapan).

**Baik/buruk:** bagus bila yang ditanya adalah pengalaman dan ketahanan investor — berapa dalam, berapa lama. Buruk bila dipakai sendirian sebagai ukuran risiko: drawdown tidak berkata apa-apa tentang seberapa sering kerugian terjadi, dan ia sensitif terhadap SATU puncak di awal window.

**Mitigasi:** laporkan selalu empat hal berdampingan — maxDD, tanggal puncak → lembah, status pulih/belum, dan durasi terendam terlama. MaxDD tanpa tanggal adalah angka tanpa cerita; tanpa durasi, kamu tidak tahu apakah −40% itu berlangsung seminggu atau setahun.

$$DD_t = \frac{W_t}{\max_{s \le t} W_s} - 1$$

(Drawdown hari t: kekayaan dibagi puncak tertinggi sejauh ini, minus 1. Maximum drawdown = nilai DD paling negatif sepanjang window.)

---

## 2. Angka Drawdown — Lima Aset, Lima Cerita Terendam

**Nilai [notebook]:** BBCA maxDD −0,4973 (puncak 2024-11-05 → lembah 2026-06-08), BELUM pulih, saat ini −0,4441, terendam terlama 478 hari — hampir seluruh window 480 hari. KLBF maxDD −0,5791 (2025-06-04 → 2026-10-19), belum pulih, saat ini −0,5052, terendam 347 hari — yang terdalam. UNVR maxDD −0,4925 (2024-12-10 → 2025-02-28), PULIH 2025-10-16, namun jatuh lagi sesudahnya dan saat ini −0,4051 di bawah puncak baru, terendam 211 hari. Portofolio maxDD −0,4363 (2025-11-05 → 2026-10-19), belum pulih, saat ini −0,3528, terendam 243 hari. ^GSPC maxDD −0,1890 (2025-02-19 → 2025-04-08), pulih 2025-06-27, saat ini −0,0255, terendam 88 hari.

**Gambar:** bar maxDD kelima aset — KLBF terdalam (−0,5791), portofolio lebih dangkal dari saham terburuknya (−0,4363 vs −0,5791), ^GSPC jauh paling dangkal (−0,1890). Diversifikasi MEMBANTU tapi tidak menyelamatkan.

**Baik/buruk:** bagus untuk membandingkan «penderitaan» antar aset dalam window yang sama. Buruk bila membandingkan window yang berbeda — maxDD sangat bergantung pada di mana window dimulai. Caveat: ^GSPC diukur dalam USD sementara portofolio dalam Rp — efek kurs diabaikan; perbandingan ini membandingkan pergerakan pasar, bukan pengalaman investor Rupiah yang membeli S&P 500.

**Mitigasi:** saat membaca drawdown, tanyakan «puncak mana yang dipakai?» — puncak di awal window yang tinggi membuat semua drawdown sesudahnya terlihat dalam. Jangan bandingkan maxDD antar window yang berbeda panjangnya: window yang lebih panjang hampir selalu punya maxDD yang lebih dalam.

---

## 3. Matematika Pemulihan — Pulih Butuh Lebih dari yang Hilang

Kerugian dan keuntungan tidak simetris. Turun 50% butuh naik 100% untuk kembali. Rumusnya: dari drawdown d (negatif), return yang dibutuhkan untuk kembali ke puncak adalah 1 / (1 + d) − 1.

**Nilai [notebook]:** portofolio maxDD −0,4363 butuh +77,40% untuk pulih. BBCA −0,4973 butuh +98,93% — praktis harus naik dua kali lipat dari lembah. KLBF −0,5791 butuh +137,59%. UNVR −0,4925 butuh +97,04% — dan ia memang pulih, pada 2025-10-16, sekitar 8 bulan setelah lembah 2025-02-28 — namun setelah pulih ia jatuh lagi, hingga −0,4051 di bawah puncak baru pada 2026-11-11. ^GSPC −0,1890 hanya butuh +23,30% — pulih dalam waktu kurang dari 3 bulan (lembah 2025-04-08 → pulih 2025-06-27).

**Baik/buruk:** bagus untuk mengomunikasikan risiko ke investor awam — «turun 43% berarti harus naik 77%» jauh lebih terasa daripada «volatilitas 31% per tahun». Buruk bila dibaca sebagai janji: rumus ini hanya berkata berapa yang DIBUTUHKAN, bukan berapa lama — waktu pemulihan bergantung pada return masa depan yang tidak diketahui.

**Mitigasi:** saat mengevaluasi strategi, tanyakan dua angka — berapa dalam (maxDD) DAN berapa lama (durasi terendam + waktu pemulihan). UNVR dan BBCA punya maxDD hampir sama (−0,4925 vs −0,4973), tapi UNVR pulih dalam ~8 bulan sementara BBCA belum pulih setelah lebih dari 2 tahun dari puncak 2024-11-05 (lembah 2026-06-08 → sekarang ~5 bulan).

$$R_{pulih} = \frac{1}{1 + d} - 1$$

(Contoh portofolio: d = −0,4363 → R = 1 / 0,5637 − 1 = 0,7740 (+77,40%).)

---

## 4. Regime — Saat Parameter Risiko Berubah

Regime bukan ramalan — ini klasifikasi ex-post: hitung vol rolling 60 hari portofolio (log return, disetahunkan), tandai hari sebagai high-vol bila vol rolling-nya di atas persentil 75 — yaitu 0,3316 per tahun [notebook]. Sisanya low-vol.

**Nilai [notebook]:** 105 hari high-vol vs 375 hari low-vol — bukan 120 hari (25% dari 480), karena persentil dihitung atas 421 nilai vol rolling yang valid: jendela 60 hari baru menghasilkan nilai pertama pada hari ke-60, jadi hanya ada 480 − 60 + 1 = 421 nilai; 25% × 421 = 105,25, dibulatkan ke 105 hari. Low-vol 375 hari = 316 hari bervol di bawah ambang + 59 hari pertama yang belum punya vol rolling (jendela 60 hari) — kode menghitungnya sebagai low-vol karena tidak melewati ambang. High-vol: mean return harian +0,003215, vol harian 0,0260 (0,4131 tahunan), VaR95 historis 0,0261, VaR99 historis 0,0761. Low-vol: mean harian −0,001863, vol harian 0,0175 (0,2777 tahunan), VaR95 0,0294, VaR99 0,0456. Korelasi rata-rata antar pasangan saham: high-vol 0,3752 vs low-vol 0,2775 — di masa bergejolak, saham-saham bergerak lebih bersamaan.

**Gambar:** bar VaR95 dan VaR99 per regime + garis VaR99 statis M4.2 (0,0479) — VaR95 nyaris sama antar regime, VaR99 jauh berbeda.

**Baik/buruk:** bagus untuk memahami bahwa parameter risiko BERUBAH — VaR, korelasi, dan vol dari seluruh window adalah rata-rata dari dua dunia yang berbeda. Buruk bila dipakai untuk meramal: label high-vol baru diketahui SETELAH vol rolling 60 hari terbentuk.

**Mitigasi:** laporkan selalu definisi regime (window rolling, ambang, jumlah hari tiap regime) berdampingan dengan hasilnya. Jangan pernah memakai label regime ex-post untuk mengklaim «modelku tahu kapan regime berubah» — itu look-ahead bias. Kaitan dengan M4.3: regime ada karena vol clustering — autokorelasi squared return portofolio lag 1 adalah 0,1043 [notebook]; hari bergejolak cenderung diikuti hari bergejolak.

---

## 5. Regime Real-Time Tanpa Look-Ahead

Ambang persentil 75 dari SELURUH window (0,3316 [notebook]) sah untuk memahami sejarah, tapi tidak bisa dipakai untuk keputusan di tengah jalan: pada 16 Oktober 2026, kamu belum tahu bahwa 0,3316 adalah persentil 75 dari window yang baru berakhir November 2026. Memakai ambang full-sample untuk keputusan historis adalah look-ahead bias. Prosedur real-time memperbaikinya: hanya memakai data yang sudah tersedia saat itu.

**Prosedur (timeline):** (1) Data — tiap hari, hitung vol rolling 60 hari portofolio dari log return. (2) Ambang expanding — pada hari t, ambang = persentil 75 dari SEMUA nilai rolling-vol yang tersedia sampai hari t, baru mulai setelah 60 nilai terkumpul agar persentilnya stabil. (3) Label hari ini — hari t disebut high-vol bila vol rolling hari t di atas ambang hari t. (4) Keputusan besok — label hari t dipakai untuk keputusan posisi/buffer pada hari t+1 (BESOK), bukan hari ini: label terbentuk dari data yang termasuk hari t, jadi ia tidak bisa melindungi dari kerugian hari t itu sendiri.

**Nilai:** ambang full-sample p75 = 0,3316 (105 hari high dari 421 nilai rolling-vol valid) [notebook]. Prosedur real-time menilai 361 hari (421 − 60 nilai pertama yang membangun ambang). Kesepakatan label real-time vs full-sample: 94,46% (341 dari 361 hari). Real-time mendeteksi 54 hari high vs 70 hari high full-sample pada periode yang sama: UNDER-detect — 16 hari high terlewat, harga dari tanpa-look-ahead. Vol terealisasi ESOK hari setelah label HIGH real-time: 0,0192 (n=53), vs setelah label LOW: 0,0191 (n=307) — HAMPIR IDENTIK: label regime TIDAK memprediksi vol besok; nilainya untuk keputusan buffer/posisi SAAT INI (risiko kontemporer), bukan ramalan. Episode Sep–Nov 2026: high full-sample pertama 2026-10-16 DAN high real-time pertama juga 2026-10-16 (lag 0 hari) — tapi label terbentuk DARI data yang termasuk 16 Okt, jadi tetap tidak melindungi dari kerugian 16 Okt itu sendiri. Ambang real-time terakhir (11 Nov 2026): 0,3316 = ambang full-sample (konvergen).

**Latihan walk-forward kecil:** bandingkan label real-time vs full-sample pada 361 hari yang dinilai — (1) 341 hari sepakat dari 361, berapa persen? (2) 70 − 54 = 16 hari high terlewat; (3) bandingkan vol esok hari setelah HIGH (0,0192) vs LOW (0,0191) dan simpulkan apakah label meramal besok. Jawaban: (1) 94,46%; (2) 16 hari — ambang expanding baru naik setelah data vol tinggi masuk, jadi keterlambatan wajar di awal episode; (3) hampir identik — label bukan ramalan.

**Baik/buruk:** bagus untuk keputusan hari ini tanpa mengintip masa depan; buruk sebagai sinyal «besok akan bergejolak». **Mitigasi:** pakai prosedur real-time (ambang expanding, keputusan t+1), laporkan kesepakatan (94,46%) DAN under-detect-nya (16 hari), dan jangan klaim label meramal vol besok tanpa menguji vol esok hari setelah tiap label.

---

## 6. Stress Test Korelasi — Guncang Struktur, Bukan Level

Stress test biasa mengguncang LEVEL return («semua saham turun 10%»). Correlation-breakdown stress test mengguncang STRUKTUR: vol tiap saham dan mean return dibiarkan sama seperti sejarah, yang diubah hanya matriks korelasi — semua korelasi antar pasangan dipaksa menjadi 0,95, lalu 1,00.

**Nilai [notebook]:** vol harian portofolio (log return) normal 0,0197 → korelasi 0,95: 0,0262 (+33,0%) → korelasi 1,0: 0,0267 (+35,5%). Persen dihitung dari angka tampil yang dibulatkan empat desimal; dari nilai tak-dibulatkan di notebook, kenaikannya sedikit berbeda. Diversification ratio 1,3530 → 1,0169 pada korelasi 0,95 — hampir 1, diversifikasi hampir hilang. VaR95 parametrik 0,0324 → 0,0431 (korelasi 0,95) → 0,0438 (korelasi 1,0). Pada portofolio Rp100 juta, VaR95 harian naik dari Rp3.240.000 menjadi Rp4.310.000 — tanpa satu pun saham yang «jatuh» di skenario ini.

**Gambar:** bar vol harian di tiga kondisi korelasi + diversification ratio — dari korelasi 0,95 ke 1,00 vol hanya naik sedikit lagi (0,0262 → 0,0267): pada 0,95 diversifikasi praktis sudah hilang. Kerusakan terbesar terjadi pada lompatan pertama.

**Baik/buruk:** bagus bila yang ditanya adalah ketahanan struktur portofolio — ia mengungkap risiko yang tidak terlihat di VaR normal. Buruk bila dibaca sebagai prediksi: korelasi 0,95 untuk SEMUA pasangan secara permanen adalah skenario ekstrem, bukan kondisi yang diharapkan setiap hari.

**Mitigasi:** jalankan stress korelasi berdampingan dengan VaR biasa, dan laporkan keduanya — «VaR95 normal 0,0324, VaR95 stress-korelasi 0,0431». Bila selisihnya besar, portofoliomu bergantung pada diversifikasi yang rapuh.

---

## 7. Stress Return & Gabungan

Stress korelasi mengguncang STRUKTUR dan membiarkan level return apa adanya. Sekarang sebaliknya: guncang LEVEL — semua saham turun 10% dalam satu hari — dan lihat apa yang berubah, dan apa yang TIDAK berubah. Lalu campur keduanya dengan sadar, berlabel [ilustrasi].

Semua angka memakai portofolio Rp100 juta dan VaR/ES parametrik normal (mean 0): VaR95 = 1,6449 × vol, VaR99 = 2,3263 × vol, ES95 = 2,0627 × vol. Normal [notebook]: vol 0,0197; VaR95 0,0324 (Rp3.240.000); VaR99 0,0458; ES95 0,0406; diversification ratio 1,3530.

**Skenario 1 — return shock −10% semua saham [ilustrasi]:** P&L langsung −Rp10.000.000. VaR95 tetap 0,0324, VaR99 tetap 0,0458, ES95 tetap 0,0406, DR tetap 1,3530 — TIDAK BERUBAH. Shock return adalah kerugian TEREALISASI, bukan ukuran risiko: VaR/ES mengukur distribusi return yang mungkin terjadi, dan satu guncangan titik tidak mengubah vol/distribusi. Skalanya: −Rp10.000.000 setara 3,1× VaR95 harian dan ~23% dari maximum drawdown portofolio (−0,4363 × Rp100 juta = Rp43.630.000).

**Skenario 2 — vol shock ×1,5 [ilustrasi]:** vol 0,0197 → 0,0295; VaR95 0,0486 (Rp4.860.000); VaR99 0,0687; ES95 0,0610; DR tetap 1,3530 (korelasi tidak berubah). VaR95 naik +50%, sebanding dengan kenaikan vol. Catatan pembulatan: 0,0197 × 1,5 = 0,02955 — skrip membulatkan ke 0,0295 pada 4 desimal; bila kamu menghitung 0,02955 atau 0,0296, itu soal pembulatan, bukan kesalahan.

**Skenario 3 — gabungan [ilustrasi] (korelasi 0,95 + vol ×1,5 + return −10%):** vol 0,0393 (= 0,0262 × 1,5); VaR95 0,0646 (Rp6.460.000); VaR99 0,0914; ES95 0,0811; DR 1,0169; P&L langsung −Rp10.000.000. Kerugian risiko (VaR95 Rp6.460.000) dan kerugian terealisasi (−Rp10.000.000) dijumlahkan dalam pengalaman investor, tapi TIDAK BOLEH dijumlahkan dalam satu angka VaR.

**Tabel — empat kondisi, portofolio Rp100 juta:**

- **Normal [notebook]:** vol 0,0197 · VaR95 0,0324 (Rp3.240.000) · VaR99 0,0458 · ES95 0,0406 · DR 1,3530 · P&L langsung —.
- **Return −10% [ilustrasi]:** vol 0,0197 · VaR95 0,0324 (Rp3.240.000) · VaR99 0,0458 · ES95 0,0406 · DR 1,3530 · P&L langsung −Rp10.000.000.
- **Vol ×1,5 [ilustrasi]:** vol 0,0295 · VaR95 0,0486 (Rp4.860.000) · VaR99 0,0687 · ES95 0,0610 · DR 1,3530 · P&L langsung —.
- **Gabungan [ilustrasi]:** vol 0,0393 · VaR95 0,0646 (Rp6.460.000) · VaR99 0,0914 · ES95 0,0811 · DR 1,0169 · P&L langsung −Rp10.000.000.

**Peringatan jujur — satu guncangan, satu pertanyaan:** gabungan hanya menjawab «seberapa buruk bila semuanya memburuk bersamaan?» — bukan kontribusi tiap guncangan. Jalankan ketiganya terpisah DULU, baru gabungkan, dan labeli tiap angka dengan skenarionya.

---

## 8. Regime-Conditional VaR — Ekor yang Membedakan Regime

**Nilai [notebook]:** VaR95 high-vol 0,0261 vs low-vol 0,0294 — nyaris SAMA, bahkan sedikit lebih kecil di high-vol. Tapi VaR99 high-vol 0,0761 vs low-vol 0,0456 — jauh BERBEDA, hampir 1,7 kali lipat. VaR99 statis M4.2 (0,0479, seluruh window) berada DI ANTARA keduanya: ia meremehkan ekor tepat di regime high-vol (0,0479 vs 0,0761) dan melebih-lebihkan ekor di regime low-vol (0,0479 vs 0,0456). Dalam Rupiah pada Rp100 juta: kerugian 1-dari-100-hari di high-vol adalah Rp7.610.000, bukan Rp4.790.000 seperti kata VaR statis.

**Baik/buruk:** regime-conditional VaR bagus bila yang ditanya adalah «berapa buruk hari yang sangat buruk, di kondisi saat ini?» — ia jujur tentang ekor. Buruk bila dipakai sebagai angka tunggal untuk semua kondisi: VaR high-vol dihitung dari hanya 105 hari — kuantil 1% dari 105 hari praktis ditentukan oleh 1 hari terburuk, jadi angkanya tidak stabil.

**Mitigasi:** laporkan VaR95 DAN VaR99, dan laporkan keduanya per regime — empat angka, bukan satu. Bila VaR99 high-vol jauh di atas VaR99 statis (di sini 0,0761 vs 0,0479), naikkan buffer modal atau turunkan eksposur selama episode high-vol.

$$\text{VaR}_{99}^{high} = 0{,}0761 \gg \text{VaR}_{99}^{statis} = 0{,}0479 \gg \text{VaR}_{99}^{low} = 0{,}0456$$

(VaR99 historis per regime vs VaR99 statis M4.2. VaR95 nyaris sama antar regime (0,0261 vs 0,0294) — yang membedakan regime adalah ekor, bukan risiko biasa.)

---

## 9. Matriks Skenario

Satu tabel, empat dunia — baris adalah kondisi, kolom adalah ukuran. VaR/ES high-vol dan low-vol adalah historis [notebook]; VaR/ES normal dan stress-korelasi adalah parametrik normal; portofolio Rp100 juta.

**Normal [notebook]:** VaR95 0,0324 · VaR99 0,0458 · ES95 0,0406 · ES99 — · maxDD −0,4363 · DR 1,3530 · Mitigasi: baseline harian — VaR95/ES95 sebagai patokan, tapi jangan sendirian; cek ekor dan drawdown.

**High-vol (n=105) [notebook]:** VaR95 0,0261 · VaR99 0,0761 · ES95 0,0609 · ES99 0,1139 · maxDD −0,4363 † · DR — · Mitigasi: naikkan buffer ke VaR99/ES99 high-vol (Rp7.610.000 / Rp11.390.000 per Rp100 juta); turunkan eksposur selama episode high-vol.

**Low-vol (n=375) [notebook]:** VaR95 0,0294 · VaR99 0,0456 · ES95 0,0401 · ES99 0,0561 · maxDD −0,4363 † · DR — · Mitigasi: buffer statis memadai (VaR99 Rp4.560.000); waspada — ekor ES99 Rp5.610.000 tetap ada.

**Stress korelasi 0,95:** VaR95 0,0431 · VaR99 0,0610 · ES95 0,0540 · ES99 0,0698 · maxDD — · DR 1,0169 · Mitigasi: uji ketahanan struktur — kurangi konsentrasi pada saham yang korelasinya melonjak bersamaan; diversifikasi antar kelas aset atau negara.

**Catatan:** ES99 baris normal tidak dihitung di skrip fill — pembandingnya ES99 historis M4.2 atas seluruh window, 0,0775 [notebook]. † maxDD −0,4363 adalah drawdown portofolio sepanjang window (puncak 2025-11-05 → lembah 2026-10-19), terbentuk melintasi kedua regime dan tidak dipecah per regime di notebook — angka yang sama di ketiga baris terealisasi menandai satu sejarah drawdown yang sama. DR baris high/low tidak dihitung di skrip fill. MaxDD baris stress korelasi «—» karena stress korelasi adalah skenario 1 hari — stress 1 hari bukan drawdown.

**Yang dibaca dari matriks:** ranking ekor — ES99 high-vol 0,1139 adalah angka terbesar di tabel, hampir 2× ES99 low-vol (0,0561) dan di atas ES99 stress-korelasi (0,0698); dunia paling berbahaya adalah regime high-vol yang benar-benar terjadi, bukan skenario hipotetis. VaR95 menipu: high-vol terlihat PALING aman (0,0261) bila hanya melihat VaR95 — ES99 membalik ranking itu. Mitigasi berbeda per baris; dan matriks ini tidak memberi peluang tiap dunia — high-vol terjadi 105 dari 480 hari (21,9%), stress korelasi 0,95 adalah skenario hipotetis tanpa peluang yang dinyatakan.

---

## Lab 1: Drawdown dari Nol

8 return harian mainan, kekayaan awal 1,0, satu kejatuhan besar di hari ke-4 (−30%). Kekayaan memuncak di 1,254 (hari ke-3), jatuh ke 0,8778 (hari ke-4) — drawdown −0,3000 [lab]. Sesudahnya kekayaan naik sampai 1,1466 tapi tidak pernah menyentuh puncak — drawdown saat ini −0,1771, belum pulih [lab]. Terendam terlama 5 hari (hari ke-4 sampai ke-8) [lab]. Butuh pulih dari maxDD: +42,86% [lab].

## Lab 2: Stress Korelasi dari Nol

Portofolio 2 aset mainan, bobot 50/50, vol harian 0,02 dan 0,03. Korelasi 0,30 → vol 0,0204, rasio diversifikasi 1,2272, VaR95 0,0335 [lab]. Korelasi 0,95 → vol 0,0247 (+21,24%), rasio 1,0122, VaR95 0,0406 [lab]. Korelasi 1,00 → vol 0,0250, rasio 1,0000, VaR95 0,0411 [lab] — diversifikasi hilang sepenuhnya. TIDAK ADA satu pun return yang diguncang — hanya korelasi.

## Mini-case: Rp100 Juta, Berapa Buffer yang Jujur?

Portofolio Rp100 juta pada 2026-11-11 — masih terendam −35,28% di bawah puncak [notebook]. VaR statis (M4.2): VaR99 0,0479 → Rp4.790.000. Regime-conditional: high-vol VaR99 0,0761 → Rp7.610.000; low-vol 0,0456 → Rp4.560.000. Stress korelasi: VaR95 naik dari Rp3.240.000 menjadi Rp4.310.000. Buffer yang jujur memakai angka paling konservatif untuk kondisi saat ini: di episode high-vol, Rp7.610.000. Dan drawdown berkata: nilai pernah menyentuh Rp56.370.000, dan untuk kembali ke Rp100 juta dibutuhkan +77,40%. Keputusan: laporkan empat angka — maxDD −43,63% (belum pulih, terendam 243 hari), VaR99 high-vol Rp7.610.000 vs statis Rp4.790.000, VaR95 stress-korelasi Rp4.310.000, dan kebutuhan pulih +77,40%.

**Tabel keputusan — M4.2 + M4.3 + M4.5 dalam satu tempat (portofolio Rp100 juta):**

- **Statis, historis (M4.2):** VaR95 0,0286 (Rp2.860.000) · VaR99 0,0479 (Rp4.790.000) · ES95 0,0445 (Rp4.450.000) · Buffer: Rp4.790.000 (VaR99) sebagai angka dasar bila tidak ada informasi kondisi.
- **Kondisional EWMA, 11 Nov 2026 (M4.3):** VaR95 0,0490 (Rp4.900.000) · VaR99 0,0694 (Rp6.940.000) · Buffer: Rp6.940.000 — EWMA bereaksi cepat pada vol terbaru.
- **Kondisional GARCH, 11 Nov 2026 (M4.3):** VaR95 0,0315 (Rp3.150.000) · VaR99 0,0446 (Rp4.460.000) · Buffer: Rp4.460.000 — GARCH lebih tenang daripada EWMA pada tanggal yang sama.
- **Regime high-vol (M4.5):** VaR95 0,0261 (Rp2.610.000) · VaR99 0,0761 (Rp7.610.000) · Buffer: Rp7.610.000 — angka paling konservatif; pakai ini selama episode high-vol.
- **Regime low-vol (M4.5):** VaR95 0,0294 (Rp2.940.000) · VaR99 0,0456 (Rp4.560.000) · Buffer: Rp4.560.000 — sedikit di bawah buffer statis.
- **Stress korelasi 0,95 (M4.5):** VaR95 0,0431 (Rp4.310.000) · Bukan buffer harian, melainkan uji ketahanan — «bila diversifikasi berhenti bekerja, VaR95 harianmu Rp4.310.000, bukan Rp3.240.000».

**Contoh kegagalan agregasi:** manajer yang hanya memakai SATU angka — VaR99 statis Rp4.790.000 — dan merasa aman, padahal portofolio sedang di episode high-vol yang ekornya Rp7.610.000. Kekurangannya Rp2.820.000 — buffer kurang 37% dari yang dibutuhkan (2.820.000 / 7.610.000). VaR statis tidak «salah hitung» — ia benar sebagai rata-rata seluruh window — melainkan satu angka rata-rata dipakai untuk kondisi yang bukan rata-rata. Dan EWMA vs GARCH pun tidak sepakat pada 11 November 2026 (VaR95 0,0490 vs 0,0315): model kondisional yang berbeda memberi jawaban berbeda — itulah alasan tabel ini menampilkan semuanya, bukan memilih satu «pemenang» secara diam-diam.

## Jembatan ke M9

Tiga alat M4 adalah pintu masuk ke dua modul berikutnya. **Peta koneksi:** walk-forward (M4.1) → validasi out-of-sample di M9 (berapa lipatan, berapa lama window, kapan validasi itu sendiri menipu). Backtesting Kupiec/Christoffersen (M4.3) → backtesting diperdalam di M9 (gerbang validasi lain + kuasa uji dengan sampel sekecil 230 hari). Monte Carlo (M4.2) → simulasi diperdalam di M9 (skenario multi-hari, jalur kekayaan, validasi strategi). Dan ke M5: optimasi portofolio formal (objective dan constraint) adalah materi M5, BUKAN M4 — bahan bakunya adalah marginal VaR dan component VaR (M4.4).

**Tugas integratif — tanpa klaim hasil optimasi:** (1) Dari M4.4, component VaR share: UNVR 0,4098, KLBF 0,3370, BBCA 0,2532 [notebook] — UNVR kontributor risiko terbesar walau bobotnya sama (1/3). (2) Susun bobot baru yang MENGURANGI UNVR dan menambah BBCA — sebagai usulan, bukan hasil optimasi. (3) Validasi out-of-sample: backtest VaR95/VaR99 bobot baru pada 230 hari OOS yang sama dengan M4.3, dengan Kupiec — apakah pelanggaran bobot baru lebih dekat ke yang dijanjikan (11,5 dan 2,3)? (4) Stress korelasi: jalankan stress korelasi 0,95 pada bobot baru, bandingkan DR dan VaR95 stress dengan bobot lama (DR 1,0169, VaR95 0,0431). (5) Laporkan dengan jujur: bila bobot baru TIDAK lebih baik, itu juga hasil.

**Yang belum dijawab — dan sengaja belum dijawab:** apakah bobot baru itu OPTIMAL? Tidak ada jawaban di M4 — optimasi formal menunggu M5. Apakah validasi OOS cukup kuat dengan 230 hari? Tidak sepenuhnya — M9 akan mengajarimu mengukur kuasa ujinya. Apakah skenario stress itu cukup? Tidak — M9 akan mengajarimu membangun skenario dari simulasi.

## Guided Task di Colab

Notebook: colab/mlf-m45-guided-task.ipynb — drawdown semua aset (BBCA maxDD −0,4973, KLBF −0,5791, UNVR −0,4925, portofolio −0,4363, ^GSPC −0,1890) + matematika pemulihan (+77,40% untuk portofolio) + regime (105 vs 375 hari, ambang 0,3316) + VaR per regime + correlation-breakdown stress test (vol 0,0197 → 0,0262, diversification ratio 1,3530 → 1,0169), lengkap dengan checks (8 checks lolos, 0 error). Tautan Colab: https://colab.research.google.com/drive/1YWmATA1sg5eVGMQFNZEIhHy53mWfn-8b

## Rangkuman

- Drawdown mengukur penderitaan: portofolio maxDD −0,4363 (2025-11-05 → 2026-10-19), belum pulih, saat ini −0,3528, terendam 243 hari; KLBF terdalam −0,5791, BBCA −0,4973 (terendam 478 hari); hanya UNVR (pulih 2025-10-16, lalu jatuh lagi hingga −0,4051 dari puncak baru) dan ^GSPC (pulih 2025-06-27) yang sudah pulih dari maxDD-nya.
- Pulih butuh lebih dari yang hilang: −43,63% butuh +77,40%; BBCA +98,93%, KLBF +137,59%, ^GSPC +23,30%.
- Regime (vol rolling 60 hari, ambang persentil 75 = 0,3316 tahunan): 105 hari high-vol vs 375 low-vol (low-vol 375 = 316 bervol + 59 hari awal tanpa vol rolling); korelasi rata-rata 0,3752 vs 0,2775.
- VaR95 nyaris sama antar regime (0,0261 high vs 0,0294 low) tapi VaR99 jauh berbeda (0,0761 vs 0,0456) — risiko EKOR yang membedakan regime; VaR99 statis M4.2 (0,0479) meremehkan ekor high-vol.
- Stress korelasi: vol harian 0,0197 → 0,0262 (+33,0%) pada korelasi 0,95 → 0,0267 (+35,5%) pada korelasi 1,0; diversification ratio 1,3530 → 1,0169; VaR95 parametrik 0,0324 → 0,0431 → 0,0438.
- Regime bukan ramalan — klasifikasi ex-post; vol clustering (autokorelasi squared return lag 1 0,1043) adalah alasan regime itu ada.
- Lab: drawdown dari nol — maxDD −0,3000 di hari ke-4, terendam terlama 5 hari, butuh pulih +42,86%; stress korelasi 2-aset — vol 0,0204 → 0,0247 (+21,24%), diversification ratio 1,2272 → 1,0122 → 1,0000.
- Aturan: laporkan VaR95 DAN VaR99, per regime bila datanya cukup; laporkan drawdown (maxDD + durasi + status pulih) berdampingan dengan VaR; stress test korelasi mengguncang STRUKTUR, bukan level.
- Stress return & gabungan [ilustrasi]: shock return −10% → P&L langsung −Rp10.000.000, VaR/ES tidak berubah (0,0324); shock vol ×1,5 → vol 0,0295, VaR95 0,0486; gabungan (korelasi 0,95 + vol ×1,5 + return −10%) → vol 0,0393, VaR95 0,0646, DR 1,0169 — satu guncangan, satu pertanyaan.
- Regime real-time (tanpa look-ahead): ambang expanding p75 mulai setelah 60 nilai; 361 hari dinilai, kesepakatan 94,46% (341/361) dengan full-sample, 54 vs 70 hari high (under-detect 16 hari); vol esok hari setelah label HIGH 0,0192 vs LOW 0,0191 — label bukan ramalan; ambang real-time terakhir 0,3316 = ambang full-sample.
- Matriks skenario: ES99 high-vol 0,1139 vs low-vol 0,0561; stress korelasi 0,95 ES99 0,0698; maxDD portofolio −0,4363; DR normal 1,3530 vs stress 1,0169.
- Tabel keputusan (M4.2 + M4.3 + M4.5): statis VaR99 0,0479; EWMA 11 Nov 2026 VaR99 0,0694; GARCH VaR99 0,0446; high-vol VaR99 0,0761; low-vol VaR99 0,0456; stress korelasi VaR95 0,0431 — buffer statis Rp4.790.000 kurang 37% (Rp2.820.000) dari ekor high-vol Rp7.610.000.
- Jembatan ke M9: walk-forward, backtesting, dan Monte Carlo diperdalam di M9; tugas integratif memakai marginal/component VaR M4.4 — tanpa klaim optimasi sebelum M5.

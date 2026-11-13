# MLF-M4.1: Random Forest & Ensembles — Kekuatan Kerumunan Pohon

## Masalah: Menebak Arah BBCA Besok — dengan Lima Angka dari Kemarin

Setiap sore setelah penutupan, seorang pengelola dana kecil di saham BBCA harus memutuskan: besok pagi, apakah BBCA naik atau tidak? Ia tidak punya berita orang dalam — hanya lima angka dari data kemarin: return BBCA kemarin (lag1), rata-rata return 5 hari terakhir (lag5_mean), volatilitas 20 hari (vol20), jarak harga ke rata-rata 20 hari (ma20_dist), dan return S&P 500 terakhir yang tersedia sebelum penutupan IDX (gspc_lag1).

Dari 460 hari yang bisa dipakai [notebook], BBCA naik pada 41,96 persen hari — base rate up 0,4196. Menebak «turun» terus-menerus saja sudah benar 58,04 persen hari secara keseluruhan (267 dari 460 hari turun). Tapi bedakan dua angka: 58,04 persen itu base rate turun KESELURUHAN, sedangkan patokan model adalah naive-majority di walk-forward — selalu prediksi turun — yang mencapai 0,5625, yaitu 90 dari 160 hari uji. Patokan yang harus dikalahkan model adalah 0,5625, bukan 0,5804 — dan tiga dari empat model «canggih» kalah darinya.

Catatan replikasi: Yahoo merevisi adjusted close pada orde 1e-7 antar unduhan, sehingga skor model pohon (RF/tree/GBM/OOB) dari unduhan ulang bisa bergeser ±1–2 poin persentase — dan itu teramati pada re-run live: RF 0,5250 → 0,5063–0,5188 (−1,87pp sampai −0,62pp), GBM 0,5062 → 0,4938–0,5125 (−1,24pp sampai +0,63pp), OOB bergeser ±0,65pp; angka di lesson ini memakai file pin 2026-11-12. LR dan naive stabil.

---

## 1. Bagging & Random Forest

Satu pohon keputusan itu seperti satu analis yang terlalu yakin: ia menghafal data train sampai ke daun-daunnya, lalu goyah begitu data baru datang sedikit berbeda. Variansnya tinggi. Bagging (bootstrap aggregating) adalah obat untuk varians itu: latih BANYAK pohon, masing-masing pada sampel bootstrap yang berbeda (ambil n baris dari data train DENGAN pengembalian), lalu gabungkan lewat voting mayoritas.

Random Forest menambahkan satu putaran acak lagi: di tiap split, pohon hanya boleh mempertimbangkan SUBSET fitur acak. Tanpa itu, semua pohon memilih fitur terkuat yang sama di split pertama — pohon-pohonnya menjadi mirip, dan voting dari pohon yang mirip tidak mengurangi varians sebanyak voting dari pohon yang beragam.

**Nilai [notebook]:** Random Forest 300 pohon (seed 42). OOB score 0,5261 — akurasi pada baris-baris yang TIDAK terambil dalam bootstrap tiap pohon, semacam validasi gratis. OOB 0,5261 nyaris sama dengan walk-forward 0,5250 — dua cara ukur yang berbeda sepakat bahwa RF di data ini sekitar 0,53.

**Baik/buruk:** bagus bila model dasarnya varians tinggi dan tidak bias — seperti pohon dalam. Buruk bila model dasarnya sudah bias: merata-rata banyak model yang sama-sama salah tidak memperbaiki kesalahan sistematisnya.

**Mitigasi:** jangan menambah pohon tanpa batas — setelah 300 pohon, tambahan pohon hanya menstabilkan voting. Bila OOB dan walk-forward sama-sama rendah, masalahnya bukan jumlah pohon — melainkan fitur atau targetnya.

$$\hat{y} = \mathrm{mode}\{T_1(x), T_2(x), \dots, T_B(x)\}$$

(Prediksi Random Forest: voting mayoritas atas B pohon; tiap pohon dilatih pada satu bootstrap sample dan hanya melihat subset fitur acak di tiap split.)

---

## 2. Boosting vs Bagging

Boosting bekerja dengan logika berlawanan: pohon dilatih SECARA BERURUTAN — pohon kedua mengoreksi KESALAHAN pohon pertama, pohon ketiga mengoreksi sisa kesalahan pohon kedua, dan seterusnya. GBM (Gradient Boosting Machine) mengoreksi kesalahan mengikuti gradien fungsi loss. Bagging melatih pohon paralel dan independen (obat varians); boosting melatih pohon berurutan (obat bias).

**Nilai [notebook]:** GBM walk-forward 0,5062 — paling rendah dari semua model, di bawah satu pohon tunggal (0,5188) dan jauh di bawah naive (0,5625). Boosting yang seharusnya «lebih kuat» justru paling lemah: di data berisik seperti return harian, «kesalahan» yang dikejar itu sebagian besar noise — GBM paling lemah di sini (0,5062), tapi tanpa angka train accuracy GBM, kita tidak bisa memastikan apakah itu hafalan noise atau sekadar tidak adanya sinyal yang bisa dipelajari.

**Baik/buruk:** boosting bagus bila sinyalnya nyata dan model dasarnya lemah tapi tidak berisik. Buruk bila datanya berisik dan targetnya nyaris acak: tiap pohon baru mengoreksi kesalahan yang sebenarnya tidak punya pola.

**Mitigasi:** bila boosting kalah dari satu pohon dan dari naive, jangan «menyetel learning rate» dulu — tanyakan dulu apakah targetnya punya sinyal yang bisa dipelajari. Di data ini jawabannya tampaknya tidak — dan itu kesimpulan, bukan kegagalan penyetelan.

---

## 3. Hasil Walk-Forward

Walk-forward adalah cara evaluasi yang jujur untuk deret waktu: train mengembang dari 300 hari pertama, test 20 hari berikutnya, geser 20 hari, ulangi — 8 folds [notebook]. Model hanya pernah dilatih pada masa lalu saat memprediksi masa depan.

**Nilai [notebook]:** RF 0,5250, LR 0,5688, satu pohon 0,5188, GBM 0,5062, naive-majority 0,5625. LR satu-satunya model yang mengalahkan naive — dan hanya +0,6 poin persentase (0,5688 vs 0,5625). RF kalah 3,75 poin dari naive; GBM kalah 5,6 poin.

**Gambar:** bar kelima skor dengan garis naive 0,5625 — hanya satu bar yang melewati garis itu, dan hanya sedikit.

**Baik/buruk:** walk-forward bagus karena meniru penggunaan nyata. Buruk bila dibaca sebagai «skor akhir»: 8 folds × 20 hari = 160 hari test; keunggulan +0,6pp LR atas naive belum tentu nyata secara statistik.

**Mitigasi:** laporkan SELALU skor naive berdampingan dengan skor model — tanpa patokan itu, 0,5688 terlihat «lumayan» dan 0,5250 terlihat «di atas acak». Dengan patokan itu, keduanya terbaca apa adanya.

---

## 4. Dari Probabilitas ke Aturan Trading

Skor akurasi menjawab «seberapa sering model benar». Trader bertanya hal lain: «bila aku mengikuti model ini dengan uang sungguhan, berapa return-nya setelah biaya?» Aturannya: tiap sore, LR mengeluarkan P(naik) untuk BBCA besok. Bila P(naik) > threshold, beli BBCA (long) untuk esok hari; bila tidak, pegang tunai (flat) — tidak ada short. Threshold tidak harus 0,50: 0,50 berarti «beli bila naik lebih mungkin daripada turun», sedangkan threshold yang lebih tinggi berarti «beli hanya bila model cukup yakin». Contoh: P(naik) = 0,57 — pada threshold 0,50 kamu long, pada threshold 0,60 kamu flat.

**Nilai [notebook] — walk-forward 160 hari (8 folds × 20 hari):** up-rate aktual 0,4375 (70 dari 160 hari BBCA naik); probabilitas rata-rata model 0,4842 — model melebih-lebihkan peluang naik (catatan kalibrasi).

- **Threshold 0,50:** long 53 hari; TP = 27, FP = 26, FN = 43, TN = 64; akurasi 0,5688 (91/160); presisi 0,5094; recall 0,3857; turnover 11 transaksi; gross +11,16%; biaya 1,10% [ilustrasi]; NET +10,06%; maxDD strategi −22,56%.
- **Threshold 0,55:** long 45 hari; TP = 25, FP = 20, FN = 45, TN = 70; akurasi 0,5938; presisi 0,5556; recall 0,3571; turnover 9 transaksi; gross +4,21%; biaya 0,90% [ilustrasi]; NET +3,31%; maxDD strategi −21,93%.
- **Threshold 0,60:** long 34 hari; TP = 21, FP = 13, FN = 49, TN = 77; akurasi 0,6125; presisi 0,6176; recall 0,3000; turnover 7 transaksi; gross −11,18%; biaya 0,70% [ilustrasi]; NET −11,88%; maxDD strategi −20,49%.

**Cara membaca confusion matrix:** TP = hari long yang benar naik; FP = hari long yang ternyata turun; FN = hari flat padahal BBCA naik (peluang terlewat); TN = hari flat yang benar turun. Presisi 0,5094 pada threshold 0,50 berarti dari 53 hari long, hanya 27 yang benar naik — nyaris koin. Recall 0,3857 berarti dari 70 hari BBCA naik, kamu hanya ikut 27.

**Biaya:** turnover dihitung dari perubahan posisi — tiap long → flat atau flat → long adalah satu transaksi. Biaya transaksi 0,10% per transaksi sekali jalan [ilustrasi]: threshold 0,50 berpindah 11 kali → biaya 1,10% dari modal.

**Pembanding:** buy-and-hold BBCA pada 160 hari yang sama −14,57% (maxDD −32,05%) [notebook] — strategi threshold 0,50 (+10,06%) mengalahkannya bukan karena sering benar, melainkan karena flat di banyak hari jatuh besar. Naive-majority sebagai aturan trading — selalu prediksi turun, selalu flat — return 0,00% dengan 0 transaksi: lantai yang harus dikalahkan strategi apa pun.

**Pelajaran yang jujur:** threshold TERTINGGI (0,60) punya akurasi TERBAIK (0,6125) dan presisi TERBAIK (0,6176), tapi return TERBURUK (−11,88%). Akurasi ≠ profit. Keuntungan +10,06% di threshold 0,50 datang dari MENGHINDARI hari-hari jatuh besar (flat saat crash), BUKAN dari presisi prediksi — presisinya hanya 0,5094, nyaris koin — dan bisa jadi keberuntungan fold. Tanpa simulasi P&L di sampel lain, JANGAN klaim strategi ini profitable. Akurasi saja tidak membuktikan profitable.

**Ketidakpastian:** akurasi LR 91/160 = 0,5688 dengan interval Wilson 95% [0,4913; 0,6430] — lebar 15,2 poin persentase. Naive-majority 90/160 = 0,5625 dengan interval [0,4851; 0,6370]. Kedua selang hampir sepenuhnya tumpang tindih: keunggulan +0,6pp LR atas naive jauh dari signifikan secara statistik. «Tidak ditolak» ≠ presisi tinggi — interval yang lebar berarti akurasi sebenarnya bisa 0,49 atau 0,64.

**Baik/buruk:** evaluasi ekonomi bagus karena menguji return setelah biaya, bukan skor klasifikasi. Buruk bila dibaca sebagai bukti strategi bekerja: satu sampel 160 hari, satu saham, satu periode — dan biaya 0,10% adalah ilustrasi, bukan tarif broker sebenarnya.

**Mitigasi:** sebelum memakai aturan trading apa pun dengan uang sungguhan, uji di sampel lain (periode berbeda, saham berbeda), laporkan return SETELAH biaya berdampingan dengan akurasi, dan laporkan interval ketidakpastiannya.

---

## 5. Diagnosis Overfitting: Train 1,0000 vs Walk-Forward 0,5250

**Nilai [notebook]:** RF yang dilatih pada SELURUH 460 baris mencapai train accuracy 1,0000. RF yang sama, dievaluasi walk-forward, mencapai 0,5250. Gap 0,4750. OOB 0,5261 sepakat dengan walk-forward. Pohon-pohon yang dalam, tanpa batas kedalaman, menghafal: tiap daun akhirnya hanya berisi satu-dua baris train, dan prediksi «sempurna» itu hanyalah ingatan, bukan pola.

**Gambar:** bar train 1,0000 vs walk-forward 0,5250 vs OOB 0,5261 — jurang antara bar pertama dan dua bar lainnya adalah overfitting yang bisa dilihat mata.

**Baik/buruk:** train accuracy 1,0000 bagus sebagai TANDA BAHAYA — ia memberi tahu segera bahwa model menghafal. Buruk bila dibaca sebagai «model bekerja»: akurasi train tidak pernah menjadi bukti apa-apa tentang masa depan.

**Mitigasi:** batasi kedalaman pohon (max_depth), minta jumlah minimum baris per daun (min_samples_leaf). Tapi mitigasi yang jujur di data ini: bahkan setelah regularisasi, walk-forward RF kemungkinan tetap sekitar 0,53 — regularisasi menyembuhkan overfitting, bukan ketiadaan sinyal.

---

## 6. Jebakan Random CV

**Nilai [notebook]:** random 5-fold CV pada fitur dan model yang SAMA — LR 0,6000, RF 0,5326. Walk-forward: LR 0,5688, RF 0,5250. Random CV menggelembungkan LR +3,1pp dan RF +0,76pp. Dua kebocoran: (1) fold acak melatih model pada MASA DEPAN — baris test hari ke-100 dilatih dengan baris hari ke-200 dan ke-300; (2) window yang tumpang tindih — fitur vol20 dan ma20_dist dihitung dari 20 hari yang sama, jadi baris hari ke-100 dan ke-101 berbagi 19 dari 20 hari window itu.

**Gambar:** bar random CV vs walk-forward untuk RF dan LR berdampingan.

**Baik/buruk:** random CV bagus untuk data yang baris-barisnya independen. Buruk untuk deret waktu apa pun: return, harga, volatilitas — semuanya punya urutan, dan urutan yang diacak adalah informasi yang dibuang.

**Mitigasi:** untuk deret waktu, pakai walk-forward (expanding window) atau TimeSeriesSplit. Dan pegang prinsipnya: angka yang dekat tidak membuat metode jadi benar — untuk RF selisihnya kecil (+0,76pp), tapi metodenya TETAP SALAH, karena arah dan besar bias random CV tidak bisa diketahui sebelumnya.

---

## 7. Feature Importance

Feature importance Random Forest mengukur seberapa besar tiap fitur mengurangi impurity di semua split semua pohon — dijumlahkan dan dinormalisasi sehingga totalnya 1.

**Nilai [notebook]:** vol20 0,2084, ma20_dist 0,2050, gspc_lag1 0,1989, lag1 0,1976, lag5_mean 0,1901. Rentang hanya 0,1901–0,2084: selisih tertinggi dan terendah 0,0183. Tidak ada satu fitur yang mendominasi; apakah ada fitur yang bisa dibuang tanpa kehilangan apa-apa hanya bisa dijawab lewat uji ablation — importance yang nonzero saja tidak membuktikannya.

**Baik/buruk:** importance yang merata bagus sebagai sinyal bahwa model memakai semua informasi yang ada. Buruk bila dibaca sebagai «semua fitur sama-sama berguna»: merata di sekitar 1/5 juga bisa berarti model tidak menemukan satu pun fitur yang benar-benar membedakan — tiap fitur hanya sedikit lebih baik daripada acak.

**Mitigasi:** jangan menambah fitur teknikal yang mirip (lag2, lag3, vol10, vol30) dengan harapan importance «menemukan» yang terbaik — fitur berkorelasi tinggi berbagi importance dan membuat bacaannya kabur. Uji fitur dari keluarga yang berbeda (fundamental, sentimen, arus dana) sebelum menambah varian dari keluarga yang sama.

---

## 8. Stacking

Stacking adalah ensemble tingkat kedua: latih beberapa model dasar yang BERBEDA (di sini RF dan GBM), kumpulkan prediksi probabilitas mereka sebagai fitur baru, lalu latih model meta (di sini Logistic Regression) untuk menggabungkannya. Yang wajib dijaga: prediksi model dasar untuk melatih meta-learner harus OUT-OF-FOLD — bila meta-learner dilatih pada prediksi in-sample model dasar (yang sudah menghafal, seperti RF train 1,0000), ia belajar mempercayai model yang menghafal — leakage tingkat kedua.

**Nilai [notebook]:** stacking RF + GBM → LR mencapai random-CV 0,5761. Bandingkan dengan random-CV model tunggal: RF 0,5326, LR 0,6000. Stacking (0,5761) berada DI ANTARA keduanya — lebih baik dari RF, lebih buruk dari LR sendirian. Dan 0,5761 ini adalah random-CV yang menggelembung — angka walk-forward-nya kemungkinan lebih rendah lagi.

**Baik/buruk:** stacking bagus bila model dasarnya beragam DAN masing-masing punya kelebihan di wilayah berbeda. Buruk bila semua model dasar lemah pada sinyal yang sama: menggabungkan tiga model yang tidak tahu apa-apa tidak menghasilkan model yang tahu.

**Mitigasi:** sebelum stacking, pastikan tiap model dasar mengalahkan naive sendirian di walk-forward. Di sini hanya LR yang lolos (0,5688 vs 0,5625) — RF dan GBM tidak.

---

## Lab 1: Bagging dari Nol

12 titik (x = 1..12, label naik/tidak), 5 bootstrap sample eksplisit (seed 0), tiap pohon = decision stump dengan threshold terbaik pada bootstrap sample-nya. Threshold kelima pohon: 6,5; 5,5; 6,5; 8,5; 11,5 — akurasi 0,7500; 0,6667; 0,7500; 0,7500; 0,6667, rata-rata 0,7167 [lab]. Voting mayoritas: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], akurasi 0,7500 — lebih baik dari RATA-RATA pohon tunggal (0,7167), sama dengan pohon tunggal terbaik (0,7500). Janji bagging yang sebenarnya: bukan «lebih baik dari yang terbaik», melainkan «lebih stabil dari rata-rata».

## Lab 2: Walk-Forward Mini vs Random Split

20 hari arah return: 12 hari pertama tenang (rentetan panjang), 8 hari terakhir bergejolak (bolak-balik tiap hari). Aturan momentum: arah hari ini = arah mayoritas 3 hari sebelumnya. Uji kronologis (8 hari terakhir): 0,2500 — 2 dari 8 benar. Uji acak (8 hari, seed 7 — indeks 3, 4, 7, 9, 11, 13, 14, 19 (0-based), yaitu hari 4, 5, 8, 10, 12, 14, 15, 20): 0,6250 — 5 dari 8 benar. Selisih 0,3750 [lab]. Aturan yang SAMA, data yang SAMA — hanya cara memilih hari test yang berbeda. Uji acak terlihat bagus karena sebagian besar hari test-nya dari periode tenang; uji kronologis menguji pada rezim baru.

## Mini-case: Model Apa yang Dipakai Besok Pagi?

Dana kecil itu harus memutuskan besok pagi. Pilihannya: RF (walk-forward 0,5250), LR (0,5688), GBM (0,5062), atau naive «selalu bilang turun» (0,5625). Keputusan yang jujur: tidak ada model yang meyakinkan — LR hanya +0,6pp di atas naive dengan 160 hari test, dan keunggulan itu belum tentu nyata secara statistik. Yang TIDAK boleh dilakukan: memakai RF karena «Random Forest itu canggih» (ia kalah dari naive), atau memakai train accuracy 1,0000 sebagai bukti (itu hafalan). Bila harus memilih satu, LR dengan ukuran posisi kecil — dan laporkan skor naive berdampingan setiap kali. Bila ada waktu, cari sinyal dari keluarga fitur yang berbeda sebelum menambah model yang lebih kompleks: stacking (0,5761, random-CV) sudah membuktikan kompleksitas tidak menyelamatkan.

## Guided Task di Colab

Notebook: colab/mlf-m41-guided-task.ipynb — 5 fitur BBCA (lag1, lag5_mean, vol20, ma20_dist, gspc_lag1) + walk-forward 8 folds (RF 0,5250, LR 0,5688, tree 0,5188, GBM 0,5062, naive 0,5625) + random 5-fold CV (RF 0,5326, LR 0,6000) + OOB 0,5261 + train accuracy 1,0000 + feature importance + stacking (0,5761), lengkap dengan checks. Tautan Colab: https://colab.research.google.com/drive/10dcxO45cK6ie1tbUdB6ukyjJphszA8lC

## Rangkuman

- Random Forest = bagging: banyak pohon + bootstrap + subset fitur acak di tiap split; voting mayoritas menurunkan varians karena pohon-pohonnya beragam.
- Boosting (GBM) = pohon berurutan yang mengoreksi kesalahan sebelumnya; di data berisik ia paling lemah (walk-forward 0,5062).
- Walk-forward 8 folds [notebook]: RF 0,5250, LR 0,5688, pohon 0,5188, GBM 0,5062, naive-majority 0,5625 — hanya LR di atas naive (+0,6pp).
- Aturan trading (probabilitas LR → long vs flat): threshold 0,50 NET +10,06% (biaya 1,10% [ilustrasi]); threshold 0,60 — akurasi & presisi terbaik (0,6125 / 0,6176) — justru NET −11,88%: akurasi ≠ profit; buy-and-hold −14,57%, naive-flat 0,00%.
- Ketidakpastian: interval Wilson 95% akurasi LR [0,4913; 0,6430] vs naive [0,4851; 0,6370] — hampir sepenuhnya tumpang tindih; keunggulan +0,6pp jauh dari signifikan.
- Overfitting ekstrem: RF train 1,0000 vs walk-forward 0,5250 (gap 0,4750); OOB 0,5261 sepakat dengan walk-forward.
- Random 5-fold CV menggelembungkan LR +3,1pp (0,6000 vs 0,5688); RF +0,76pp — selisih kecil tidak membuat metode jadi benar.
- Feature importance merata (0,1901–0,2084): vol20 tertinggi, lag5_mean terendah — tidak ada fitur yang mendominasi.
- Stacking RF + GBM → LR: random-CV 0,5761 — di antara RF (0,5326) dan LR sendirian (0,6000).
- Lab: bagging 5 stump — voting 0,7500 vs rata-rata pohon tunggal 0,7167; walk-forward mini — uji kronologis 0,2500 vs uji acak 0,6250 (selisih 0,3750).

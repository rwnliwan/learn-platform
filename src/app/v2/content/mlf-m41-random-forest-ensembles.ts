import type { V2Lesson } from "../lib/types";

export const mlfM41: V2Lesson = {
  slug: "mlf-m41-random-forest-ensembles",
  track: "Machine Learning Finance",
  module: "Random Forest & ensembles",
  title: "MLF-M4.1 — Random Forest & Ensembles: Kekuatan Kerumunan Pohon",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M4 adalah random forest & ensembles untuk market risk & trading: dari satu pohon keputusan yang rapuh, ke kerumunan pohon yang saling mengoreksi — lalu ke pertanyaan yang lebih jujur: apakah kerumunan itu benar-benar menambah apa-apa di pasar saham? Lesson ini membuka modul itu dengan satu eksperimen nyata: memprediksi arah BBCA esok hari.",
        "Tujuan lesson ini:",
        "• Menjelaskan bagging: banyak pohon + bootstrap + subset fitur acak — dan kenapa itu menurunkan varians.",
        "• Menjelaskan perbedaan bagging (Random Forest) dan boosting (GBM): pohon paralel yang independen vs pohon berurutan yang mengoreksi kesalahan sebelumnya.",
        "• Membaca hasil walk-forward yang jujur: Random Forest 0,5250, Logistic Regression 0,5688, satu pohon 0,5188, GBM 0,5062, naive-majority 0,5625 — dan apa artinya bila model kalah dari naive.",
        "• Mendiagnosis overfitting lewat gap train-test: Random Forest train accuracy 1,0000 vs walk-forward 0,5250 — gap 0,4750.",
        "• Menunjukkan kenapa random cross-validation menggelembungkan skor di data deret waktu — dan kenapa angka yang dekat pun tidak membuat metode yang salah jadi benar.",
        "• Membaca feature importance dengan benar: kelima fitur nyaris sama penting (0,1901–0,2084) — tidak ada satu fitur yang mendominasi.",
        "• Memahami stacking (RF + GBM → LR) sebagai konsep, beserta hasilnya di data ini.",
        "• Menjalankan dua lab dari nol: bagging pada 12 titik, dan walk-forward mini vs random split pada deret mainan.",
        "Isi lesson: cerita trader yang ingin menebak arah BBCA → bagging dan Random Forest → boosting vs bagging → hasil walk-forward → aturan trading (probabilitas → keputusan, biaya, return setelah biaya) → diagnosis overfitting → jebakan random CV → feature importance → stacking → 2 lab → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M4.1: BBCA.JK + KLBF.JK + UNVR.JK + ^GSPC, window 2024-11-01 sampai 2026-11-11 (baris data terakhir; file pin diunduh 2026-11-12), 460 baris fitur, base rate naik 0,4196. Walk-forward 8 folds (train mengembang, test 20 hari, step 20): RF 0,5250, LR 0,5688, tree 0,5188, GBM 0,5062, naive-majority 0,5625. Random 5-fold CV: RF 0,5326, LR 0,6000. RF OOB 0,5261, RF train accuracy 1,0000. Catatan replikasi: Yahoo merevisi adjusted close pada orde 1e-7 antar unduhan, sehingga skor model pohon (RF/tree/GBM/OOB) dari unduhan ulang bisa bergeser ±1–2 poin persentase — dan itu teramati pada re-run live: RF 0,5250 → 0,5063–0,5188 (−1,87pp sampai −0,62pp), GBM 0,5062 → 0,4938–0,5125 (−1,24pp sampai +0,63pp), OOB bergeser ±0,65pp; angka di lesson ini memakai file pin 2026-11-12. LR dan naive stabil.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Menebak arah BBCA besok — dengan lima angka dari kemarin",
      prose: [
        "Bayangkan kamu mengelola dana kecil di saham BBCA. Setiap sore, setelah penutupan, kamu harus memutuskan: besok pagi, apakah BBCA naik atau tidak? Kamu tidak punya berita orang dalam — hanya lima angka dari data kemarin: return BBCA kemarin (lag1), rata-rata return 5 hari terakhir (lag5_mean), volatilitas 20 hari (vol20), jarak harga ke rata-rata 20 hari (ma20_dist), dan return S&P 500 terakhir yang tersedia sebelum penutupan IDX (gspc_lag1).",
        "Targetnya sederhana dan brutal: BBCA naik atau tidak esok hari. Dari 460 hari yang bisa dipakai [notebook], BBCA naik pada 41,96 persen hari — base rate up 0,4196. Artinya, menebak «turun» terus-menerus saja sudah benar 58,04 persen hari secara keseluruhan (267 dari 460 hari turun). Tapi hati-hati membedakan dua angka: 58,04 persen itu base rate turun KESELURUHAN, sedangkan patokan model adalah naive-majority di walk-forward — selalu prediksi turun — yang mencapai 0,5625, yaitu 90 dari 160 hari uji. Patokan yang harus dikalahkan model adalah 0,5625, bukan 0,5804.",
        "Nilai: lima fitur itu — lag1, lag5_mean, vol20, ma20_dist, gspc_lag1 — adalah semua yang dimiliki model [notebook]. Tidak ada fitur fundamental (laba, valuasi), tidak ada berita, tidak ada sentimen. Lesson ini menguji seberapa jauh lima angka teknikal itu bisa membawa kita — dan jawabannya, seperti akan kamu lihat di langkah 5, adalah: tidak jauh.",
        "Baik atau buruk: prediksi arah harian bagus sebagai latihan yang jujur — hasilnya bisa diukur besok pagi, tanpa menunggu berbulan-bulan. Buruk bila dipakai sebagai dasar keputusan uang sungguhan tanpa memahami bahwa akurasi 0,52–0,57 di pasar yang berisik hampir tidak berbeda dari menebak mayoritas.",
        "Mitigasi: tetapkan dulu patokan naive-nya (di sini 0,5625) SEBELUM melihat skor model. Model yang tidak mengalahkan naive bukan «model yang perlu disetel» — ia adalah model yang tidak menambah apa-apa, dan itu sendiri adalah temuan yang berharga.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: akurasi di atas 50 persen berarti model bekerja",
        type: "pitfall",
        body: "Yang benar: di data dengan base rate up 0,4196, menebak «turun» terus sudah benar 58,04 persen hari secara keseluruhan (267 dari 460). Tapi pada 160 hari uji walk-forward, mayoritas turun hanya 90 hari (56,25%) — jadi akurasi 0,5250 (RF) bukan «sedikit di atas acak», ia di BAWAH menebak mayoritas walk-forward (0,5625). Patokan yang benar adalah naive-majority walk-forward, bukan 0,50 — dan bukan 58,04% keseluruhan.",
      },
    },
    {
      id: "bagging",
      eyebrow: "Langkah 3 · Bagging & Random Forest",
      title: "Bagging: banyak pohon, bootstrap, dan subset fitur acak",
      prose: [
        "Satu pohon keputusan (decision tree) itu seperti satu analis yang terlalu yakin: ia menghafal data train sampai ke daun-daunnya, lalu goyah begitu data baru datang sedikit berbeda. Variansnya tinggi — ubah sedikit data train, pohonnya berubah banyak. Bagging (bootstrap aggregating) adalah obat untuk varians itu: latih BANYAK pohon, masing-masing pada sampel bootstrap yang berbeda (ambil n baris dari data train DENGAN pengembalian — ada baris yang muncul dua-tiga kali, ada yang tidak muncul sama sekali), lalu gabungkan prediksi mereka lewat voting mayoritas.",
        "Random Forest menambahkan satu putaran acak lagi: di tiap split, pohon hanya boleh mempertimbangkan SUBSET fitur acak (bukan semua lima fitur). Kenapa? Tanpa subset acak, semua pohon akan memilih fitur terkuat yang sama di split pertama — pohon-pohonnya menjadi mirip satu sama lain, dan voting dari pohon-pohon yang mirip tidak mengurangi varians sebanyak voting dari pohon-pohon yang beragam. Korelasi antar pohon adalah musuh bagging; subset fitur acak menurunkannya.",
        "Nilai: Random Forest di notebook memakai 300 pohon (n_estimators = 300, seed 42) [notebook]. OOB score-nya 0,5261 — OOB (out-of-bag) adalah akurasi pada baris-baris yang TIDAK terambil dalam bootstrap tiap pohon, jadi ia semacam validasi gratis tanpa split terpisah. Perhatikan: OOB 0,5261 nyaris sama dengan walk-forward 0,5250 — dua cara ukur yang berbeda sepakat bahwa RF di data ini sekitar 0,53.",
        "Tips: bila kamu memakai Random Forest, baca OOB dulu sebelum membangun split validasi yang rumit — OOB adalah perkiraan jujur yang murah. Tapi ingat: OOB tetap memakai baris-baris dari periode yang sama (acak), bukan masa depan — untuk data deret waktu, walk-forward tetap patokan akhirnya (langkah 8).",
        "Baik atau buruk: bagging bagus bila model dasarnya varians tinggi dan tidak bias — seperti pohon dalam. Buruk bila model dasarnya sudah bias (misal stump yang terlalu sederhana): merata-rata banyak model yang sama-sama salah tidak memperbaiki kesalahan sistematisnya — ia hanya membuat kesalahan itu stabil.",
        "Mitigasi: jangan menambah pohon tanpa batas dengan harapan akurasi naik terus — setelah 300 pohon, tambahan pohon hanya menstabilkan voting, bukan memperbaiki model. Bila OOB dan walk-forward sama-sama rendah, masalahnya bukan jumlah pohon — melainkan fitur atau targetnya (langkah 6).",
      ],
      formula: String.raw`\hat{y} = \mathrm{mode}\{T_1(x), T_2(x), \dots, T_B(x)\}`,
      formulaNote: "Prediksi Random Forest (klasifikasi): voting mayoritas atas B pohon. Tiap pohon T_b dilatih pada satu bootstrap sample dan hanya melihat subset fitur acak di tiap split.",
      tasks: [],
      note: {
        title: "Miskonsepsi: makin banyak pohon, makin pintar modelnya",
        type: "pitfall",
        body: "Yang benar: menambah pohon mengurangi varians voting sampai titik jenuh — setelah itu akurasinya datar. Di notebook dipakai 300 pohon — pilihan praktis yang umum; titik jenuhnya tidak diukur di lesson ini. Masalah RF di sini bukan jumlah pohon, melainkan sinyalnya yang memang lemah.",
      },
    },
    {
      id: "boosting",
      eyebrow: "Langkah 4 · Boosting vs bagging",
      title: "Boosting (GBM): pohon berurutan yang mengoreksi kesalahan",
      prose: [
        "Boosting bekerja dengan logika berlawanan dari bagging. Bagging melatih banyak pohon SECARA PARALEL dan independen, lalu merata-rata — obat untuk varians. Boosting melatih pohon SECARA BERURUTAN: pohon pertama memprediksi, pohon kedua dilatih untuk mengoreksi KESALAHAN (residual) pohon pertama, pohon ketiga mengoreksi sisa kesalahan pohon kedua, dan seterusnya. Tiap pohon baru fokus pada baris-baris yang masih salah diprediksi. GBM (Gradient Boosting Machine) adalah versi boosting yang mengoreksi kesalahan mengikuti gradien fungsi loss.",
        "Nilai: di walk-forward notebook, GBM mencapai 0,5062 — paling rendah dari semua model, di bawah satu pohon tunggal (0,5188) dan jauh di bawah naive (0,5625) [notebook]. Boosting yang seharusnya «lebih kuat» justru paling lemah di sini. Kenapa? Boosting mengejar kesalahan train dengan agresif — di data berisik seperti return harian, «kesalahan» yang dikejar itu sebagian besar adalah noise, bukan sinyal. GBM paling lemah di sini (0,5062) — tapi tanpa angka train accuracy GBM, kita tidak bisa memastikan apakah itu hafalan noise atau sekadar tidak adanya sinyal yang bisa dipelajari.",
        "Baik atau buruk: boosting bagus bila sinyalnya nyata dan model dasarnya lemah tapi tidak berisik — ia menurunkan bias langkah demi langkah. Buruk bila datanya berisik dan targetnya nyaris acak: tiap pohon baru mengoreksi kesalahan yang sebenarnya tidak punya pola, dan model akhirnya overfit lebih dalam daripada satu pohon.",
        "Mitigasi: bila boosting kalah dari satu pohon dan dari naive, jangan «menyetel learning rate» dulu — tanyakan dulu apakah targetnya punya sinyal yang bisa dipelajari (langkah 5 dan 7). Di data ini, jawabannya tampaknya tidak — dan itu kesimpulan, bukan kegagalan penyetelan.",
      ],
      tasks: [],
    },
    {
      id: "walkforward",
      eyebrow: "Langkah 5 · Hasil walk-forward",
      title: "Walk-forward: semua model kalah — atau nyaris kalah — dari naive",
      prose: [
        "Walk-forward adalah cara evaluasi yang jujur untuk deret waktu: train mengembang dari 300 hari pertama, test 20 hari berikutnya, lalu geser 20 hari dan ulangi — 8 folds [notebook]. Model hanya pernah dilatih pada masa lalu saat memprediksi masa depan. Tidak ada baris masa depan yang bocor ke train.",
        "Nilai: walk-forward 8 folds [notebook] — RF 0,5250, LR 0,5688, satu pohon 0,5188, GBM 0,5062, naive-majority (selalu prediksi turun) 0,5625. Baca dengan benar: LR adalah satu-satunya model yang mengalahkan naive — dan hanya +0,6 poin persentase (0,5688 vs 0,5625). RF kalah 3,75 poin dari naive; GBM kalah 5,6 poin. Satu pohon kalah 4,4 poin. Tiga dari empat model «canggih» kalah dari aturan «selalu bilang turun».",
        "Gambar di bawah membandingkan kelima skor itu, dengan garis putus-putus pada skor naive 0,5625. Perhatikan: hanya satu bar yang melewati garis itu — dan hanya sedikit.",
        "Baik atau buruk: walk-forward bagus karena ia meniru penggunaan nyata — model dipakai besok, dilatih dari kemarin. Buruk bila dibaca sebagai «skor akhir model»: 8 folds × 20 hari = 160 hari test; tiap fold hanya 20 hari, jadi satu fold yang beruntung bisa menaikkan rata-rata. Rata-rata 0,5688 dengan 160 hari test masih punya selang ketidakpastian yang lebar — keunggulan +0,6pp LR atas naive belum tentu nyata secara statistik.",
        "Mitigasi: laporkan SELALU skor naive berdampingan dengan skor model — tanpa patokan itu, 0,5688 terlihat «lumayan» dan 0,5250 terlihat «di atas acak». Dengan patokan itu, keduanya terbaca apa adanya: satu nyaris tidak menambah apa-apa, satu lagi merugikan.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar akurasi walk-forward: RF 0,5250; LR 0,5688; pohon 0,5188; GBM 0,5062; naive 0,5625">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Akurasi walk-forward (8 folds × 20 hari) — hanya LR di atas naive</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,40</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,45</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,50</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,55</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,60</text>
<line x1="52" y1="63.0" x2="466" y2="63.0" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="56.0" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">naive 0,5625</text>
<rect x="80" y="96.0" width="55" height="110.0" fill="var(--c1)"/>
<text x="107.5" y="92.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5250</text>
<text x="107.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">RF</text>
<rect x="160" y="57.5" width="55" height="148.5" fill="var(--c4)"/>
<text x="187.5" y="53.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5688</text>
<text x="187.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">LR</text>
<rect x="240" y="101.5" width="55" height="104.5" fill="var(--c1)"/>
<text x="267.5" y="97.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5188</text>
<text x="267.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Pohon</text>
<rect x="320" y="112.5" width="55" height="93.5" fill="var(--c1)"/>
<text x="347.5" y="108.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5062</text>
<text x="347.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GBM</text>
<rect x="400" y="63.0" width="55" height="143.0" fill="var(--c2)"/>
<text x="427.5" y="59.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5625</text>
<text x="427.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Naive</text>
</svg>`,
        alt: "Bar akurasi walk-forward: RF 0,5250; LR 0,5688; pohon 0,5188; GBM 0,5062; naive 0,5625.",
        caption: "Cara membaca: tiap bar = rata-rata akurasi 8 folds walk-forward [notebook]; garis putus-putus = naive-majority 0,5625. Interpretasi: hanya LR yang melewati garis naive (+0,6pp); RF, pohon, dan GBM semuanya di bawahnya.",
      },
      tasks: [],
    },
    {
      id: "aturan-trading",
      eyebrow: "Langkah 6 · Dari prediksi ke trading",
      title: "Aturan trading: probabilitas → keputusan → return setelah biaya",
      prose: [
        "Skor akurasi menjawab «seberapa sering model benar». Trader bertanya hal lain: «bila aku mengikuti model ini dengan uang sungguhan, berapa return-nya setelah biaya?» Langkah ini mengubah probabilitas Logistic Regression menjadi aturan trading yang bisa dihitung — dan jawabannya tidak seindah akurasinya.",
        "Aturannya: tiap sore, LR mengeluarkan P(naik) — probabilitas BBCA naik besok. Bila P(naik) > threshold, beli BBCA (long) untuk esok hari; bila tidak, pegang tunai (flat) — tidak ada short. Threshold tidak harus 0,50: 0,50 berarti «beli bila naik lebih mungkin daripada turun», sedangkan threshold yang lebih tinggi berarti «beli hanya bila model cukup yakin». Contoh: P(naik) = 0,57 — pada threshold 0,50 kamu long, pada threshold 0,60 kamu flat. Keputusan yang sama, ambang yang berbeda, hasil yang berbeda.",
        "Semua angka di bawah dihitung dari walk-forward yang sama: 160 hari test (8 folds × 20 hari) [notebook]. Up-rate aktual di 160 hari itu 0,4375 (70 dari 160 hari BBCA naik); probabilitas rata-rata model 0,4842 — model melebih-lebihkan peluang naik: ia meramal naik rata-rata 48,42 persen, padahal kenyataannya hanya 43,75 persen hari yang naik. Itu catatan kalibrasi: model ini terlalu optimistis tentang peluang naik.",
        "Threshold 0,50 [notebook]: long 53 hari; TP = 27, FP = 26, FN = 43, TN = 64; akurasi 0,5688 (91/160); presisi 0,5094; recall 0,3857; turnover 11 transaksi; gross +11,16%; biaya 1,10% [ilustrasi]; NET +10,06%; maxDD strategi −22,56%.",
        "Threshold 0,55 [notebook]: long 45 hari; TP = 25, FP = 20, FN = 45, TN = 70; akurasi 0,5938; presisi 0,5556; recall 0,3571; turnover 9 transaksi; gross +4,21%; biaya 0,90% [ilustrasi]; NET +3,31%; maxDD strategi −21,93%.",
        "Threshold 0,60 [notebook]: long 34 hari; TP = 21, FP = 13, FN = 49, TN = 77; akurasi 0,6125; presisi 0,6176; recall 0,3000; turnover 7 transaksi; gross −11,18%; biaya 0,70% [ilustrasi]; NET −11,88%; maxDD strategi −20,49%.",
        "Cara membaca confusion matrix-nya: TP = hari long yang benar naik; FP = hari long yang ternyata turun; FN = hari flat padahal BBCA naik (peluang yang terlewat); TN = hari flat yang benar turun. Presisi 0,5094 pada threshold 0,50 berarti: dari 53 hari kamu long, hanya 27 yang benar naik — nyaris koin. Recall 0,3857 berarti: dari 70 hari BBCA naik, kamu hanya ikut 27 — 43 hari naik terlewat karena kamu flat.",
        "Turnover dihitung dari perubahan posisi: tiap kali posisi berubah long → flat atau flat → long, satu transaksi terjadi. Threshold 0,50 berpindah 11 kali; dengan biaya transaksi 0,10% per transaksi sekali jalan [ilustrasi], biayanya 11 × 0,10% = 1,10% dari modal. Biaya ini kecil dibanding gross +11,16% — tapi pada threshold 0,60, gross −11,18% ditambah biaya 0,70% menjadi NET −11,88%: biaya memperburuk kerugian yang sudah ada.",
        "Pembandingnya: buy-and-hold BBCA pada 160 hari yang sama menghasilkan −14,57% (maxDD −32,05%) [notebook] — jadi strategi threshold 0,50 (+10,06%) mengalahkan buy-and-hold dengan selisih besar, BUKAN karena ia sering benar, melainkan karena ia flat di banyak hari jatuh besar: menghindari kerugian lebih berharga daripada menebak kenaikan. Naive-majority sebagai aturan trading — selalu prediksi turun, selalu flat — menghasilkan return 0,00% dengan 0 transaksi: ia tidak untung, tapi juga tidak rugi, dan ia adalah lantai yang harus dikalahkan strategi apa pun.",
        "Pelajaran yang jujur — dan yang paling penting di lesson ini: threshold TERTINGGI (0,60) punya akurasi TERBAIK (0,6125) dan presisi TERBAIK (0,6176), tapi return TERBURUK (−11,88%). Akurasi ≠ profit. Keuntungan +10,06% di threshold 0,50 datang dari MENGHINDARI hari-hari jatuh besar (flat saat crash), BUKAN dari presisi prediksi — presisinya hanya 0,5094, nyaris koin — dan bisa jadi keberuntungan fold: pada 160 hari lain, hari-hari jatuh besar itu mungkin jatuh pada hari-hari kamu long. Tanpa simulasi P&L di sampel lain, JANGAN klaim strategi ini profitable. Akurasi saja tidak membuktikan profitable.",
        "Ketidakpastian: akurasi LR 91/160 = 0,5688 [notebook] dengan interval Wilson 95% [0,4913; 0,6430] — lebar 15,2 poin persentase. Naive-majority 90/160 = 0,5625 dengan interval [0,4851; 0,6370] — lebar yang sama. Kedua selang hampir sepenuhnya tumpang tindih: keunggulan +0,6pp LR atas naive jauh dari signifikan secara statistik. Dan «tidak ditolak» ≠ presisi tinggi — interval yang lebar berarti akurasi sebenarnya bisa 0,49 (di bawah naive) atau 0,64; data 160 hari tidak cukup untuk membedakan.",
        "Baik atau buruk: evaluasi ekonomi bagus karena ia menguji apa yang sebenarnya dipedulikan trader — return setelah biaya, bukan skor klasifikasi. Buruk bila dibaca sebagai bukti strategi bekerja: satu sampel 160 hari, satu saham, satu periode — dan biaya 0,10% di sini adalah ilustrasi, bukan tarif broker yang sebenarnya.",
        "Mitigasi: sebelum memakai aturan trading apa pun dengan uang sungguhan, uji di sampel lain (periode berbeda, saham berbeda), laporkan return SETELAH biaya berdampingan dengan akurasi, dan laporkan interval ketidakpastiannya — strategi yang «menang» 0,6pp dengan interval selebar 15,2pp belum menang apa-apa.",
      ],
      tasks: [],
    },
    {
      id: "overfitting",
      eyebrow: "Langkah 7 · Diagnosis overfitting",
      title: "Train 1,0000 vs walk-forward 0,5250 — pohon yang menghafal",
      prose: [
        "Ini diagnosis paling penting di lesson ini — dan tidak memerlukan teori bias-variance yang sudah kamu pelajari di MLF4. Cukup dua angka dari notebook yang sama: Random Forest yang dilatih pada SELURUH 460 baris mencapai train accuracy 1,0000 [notebook]. Random Forest yang sama, dievaluasi walk-forward pada masa depan yang belum dilihat, mencapai 0,5250. Gap-nya 0,4750 — hampir setengah dari skala akurasi.",
        "Nilai: train 1,0000, walk-forward 0,5250, OOB 0,5261 [notebook]. Tiga angka itu bercerita lengkap: model menghafal train sampai sempurna (1,0000), dan begitu diuji pada baris yang tidak ikut melatihnya — baik OOB maupun masa depan — ia jatuh ke sekitar 0,53. Pohon-pohon yang dalam, tanpa batas kedalaman, memang bisa menghafal: tiap daun akhirnya hanya berisi satu-dua baris train, dan prediksi «sempurna» itu hanyalah ingatan, bukan pola.",
        "Gambar di bawah membandingkan ketiga angka itu. Jurang antara bar pertama dan dua bar lainnya adalah overfitting yang bisa dilihat mata — tanpa satu pun rumus.",
        "Baik atau buruk: train accuracy 1,0000 bagus sebagai TANDA BAHAYA — ia memberi tahu kamu dengan segera bahwa model menghafal. Buruk bila dibaca sebagai «model bekerja»: akurasi train tidak pernah menjadi bukti apa-apa tentang masa depan. Satu-satunya angka yang berbicara tentang masa depan adalah walk-forward.",
        "Mitigasi: batasi kedalaman pohon (max_depth), minta jumlah minimum baris per daun (min_samples_leaf), atau kurangi jumlah fitur per split — semuanya memaksa pohon untuk menggeneralisasi, bukan menghafal. Tapi mitigasi yang jujur di data ini: bahkan setelah regularisasi, walk-forward RF kemungkinan tetap sekitar 0,53 — karena masalahnya bukan hanya menghafal, melainkan sinyalnya yang memang lemah (langkah 5). Regularisasi menyembuhkan overfitting, bukan ketiadaan sinyal.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar akurasi RF: train 1,0000; walk-forward 0,5250; OOB 0,5261">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">RF: train 1,0000 vs walk-forward 0,5250 — gap 0,4750</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,50</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1,00</text>
<rect x="110" y="30.0" width="70" height="176.0" fill="var(--c4)"/>
<text x="145" y="26.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1,0000</text>
<text x="145" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Train (hafalan)</text>
<rect x="230" y="113.6" width="70" height="92.4" fill="var(--c1)"/>
<text x="265" y="109.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5250</text>
<text x="265" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Walk-forward</text>
<rect x="350" y="113.4" width="70" height="92.6" fill="var(--c2)"/>
<text x="385" y="109.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5261</text>
<text x="385" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">OOB</text>
</svg>`,
        alt: "Bar akurasi RF: train 1,0000; walk-forward 0,5250; OOB 0,5261.",
        caption: "Cara membaca: bar kiri = akurasi pada data yang dipakai melatih (1,0000 — hafalan); dua bar kanan = akurasi pada data yang tidak dipakai melatih. Interpretasi: gap 0,4750 adalah overfitting ekstrem; OOB dan walk-forward sepakat di sekitar 0,53.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: train accuracy tinggi berarti model bagus",
        type: "pitfall",
        body: "Yang benar: train accuracy 1,0000 pada pohon yang dalam hampir selalu berarti hafalan, bukan pembelajaran. Uji yang jujur adalah data yang tidak ikut melatih — OOB 0,5261 dan walk-forward 0,5250 di sini sepakat: model ini tidak tahu apa-apa tentang besok yang belum pernah ia lihat.",
      },
    },
    {
      id: "leakage",
      eyebrow: "Langkah 8 · Jebakan random CV",
      title: "Random CV menggelembungkan skor — dan angka yang dekat tidak menyelamatkan metodenya",
      prose: [
        "Sekarang bandingkan dua cara evaluasi pada fitur dan model yang SAMA [notebook]. Random 5-fold CV: LR 0,6000, RF 0,5326. Walk-forward: LR 0,5688, RF 0,5250. Untuk LR, random CV menggelembungkan skor +3,1 poin persentase (0,6000 vs 0,5688). Untuk RF, selisihnya kecil: +0,76pp (0,5326 vs 0,5250).",
        "Kenapa random CV menggelembung? Dua kebocoran. Pertama, fold acak melatih model pada MASA DEPAN: baris test hari ke-100 bisa dilatih dengan baris hari ke-200 dan ke-300 — model sudah «melihat» apa yang terjadi setelah test. Kedua, window yang tumpang tindih: fitur vol20 dan ma20_dist dihitung dari 20 hari yang sama; baris hari ke-100 dan hari ke-101 berbagi 19 dari 20 hari window itu. Fold acak menaruh «kembaran» baris test di dalam train — model tidak memprediksi masa depan, ia mengenali tetangga.",
        "Poin yang paling penting — dan paling sering disalahpahami: untuk RF selisihnya KECIL (0,5326 vs 0,5250), tapi metodenya TETAP SALAH. Angka yang dekat tidak membuat metode jadi benar. Arah dan besar bias random CV tidak bisa diketahui sebelumnya: di sini ia menggelembungkan LR +3,1pp dan RF +0,76pp; di dataset lain ia bisa menggelembungkan 10pp atau — bila rezim berubah — justru meremehkan. Metode evaluasi yang biasnya tidak diketahui besarnya tidak bisa dipercaya, berapa pun selisih yang terlihat di satu eksperimen.",
        "Gambar di bawah membandingkan random CV vs walk-forward untuk RF dan LR berdampingan.",
        "Tips: bila kamu melihat laporan model deret waktu yang memakai random KFold tanpa walk-forward, anggap skornya sebagai skor optimistis yang tidak dapat diandalkan; sering menjadi batas atas, tetapi bisa juga meremehkan — bukan perkiraan kinerja nyata. Dan bila seseorang membela random CV dengan «selisihnya kecil kok», jawabannya: kecil di eksperimen ini, tidak diketahui di eksperimen berikutnya.",
        "Baik atau buruk: random CV bagus untuk data yang baris-barisnya independen (misal nasabah yang tidak saling memengaruhi) — di sana tidak ada «masa depan» yang bisa bocor. Buruk untuk deret waktu apa pun: return, harga, volatilitas — semuanya punya urutan, dan urutan yang diacak adalah informasi yang dibuang.",
        "Mitigasi: untuk deret waktu, pakai walk-forward (expanding window, seperti di sini) atau, bila data pendek, setidaknya TimeSeriesSplit — fold yang train-nya selalu sebelum test-nya. Random CV hanya boleh dipakai untuk membandingkan model secara kasar, tidak pernah sebagai bukti kinerja.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar perbandingan random CV vs walk-forward: RF 0,5326 vs 0,5250; LR 0,6000 vs 0,5688">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Random CV vs walk-forward — LR menggelembung +3,1pp</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,40</text>
<line x1="48" y1="170.8" x2="52" y2="170.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="173.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,45</text>
<line x1="48" y1="135.6" x2="52" y2="135.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="138.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,50</text>
<line x1="48" y1="100.4" x2="52" y2="100.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="103.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,55</text>
<line x1="48" y1="65.2" x2="52" y2="65.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="68.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,60</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,65</text>
<rect x="110" y="112.7" width="55" height="93.3" fill="var(--c4)"/>
<text x="137.5" y="108.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5326</text>
<text x="137.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">RF · CV acak</text>
<rect x="180" y="118.0" width="55" height="88.0" fill="var(--c1)"/>
<text x="207.5" y="114.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5250</text>
<text x="207.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">RF · walk-forward</text>
<rect x="280" y="65.2" width="55" height="140.8" fill="var(--c4)"/>
<text x="307.5" y="61.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6000</text>
<text x="307.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">LR · CV acak</text>
<rect x="350" y="87.2" width="55" height="118.8" fill="var(--c1)"/>
<text x="377.5" y="83.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5688</text>
<text x="377.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">LR · walk-forward</text>
</svg>`,
        alt: "Bar perbandingan random CV vs walk-forward: RF 0,5326 vs 0,5250; LR 0,6000 vs 0,5688.",
        caption: "Cara membaca: bar gelap = random 5-fold CV, bar terang = walk-forward pada model yang sama [notebook]. Interpretasi: random CV menggelembungkan LR +3,1pp (0,6000 vs 0,5688) dan RF +0,76pp — selisih kecil pada RF tidak membuat random CV jadi benar.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: «selisihnya kecil, jadi random CV tidak apa-apa»",
        type: "pitfall",
        body: "Yang benar: metode yang salah tetap salah walau hasilnya kebetulan dekat. Random CV melatih pada masa depan dan pada «kembaran» baris test (window 20 hari yang tumpang tindih) — besar biasnya tidak bisa diketahui dari satu eksperimen. Yang benar dipakai untuk deret waktu adalah walk-forward.",
      },
    },
    {
      id: "importance",
      eyebrow: "Langkah 9 · Feature importance",
      title: "Feature importance: kelima fitur nyaris sama penting — tidak ada pahlawan",
      prose: [
        "Feature importance Random Forest mengukur seberapa besar tiap fitur mengurangi impurity (ketidakmurnian) di semua split semua pohon — dijumlahkan dan dinormalisasi sehingga totalnya 1. Fitur yang sering dipakai untuk memisahkan naik vs turun, dan memisahkannya dengan bersih, mendapat importance tinggi.",
        "Nilai: RF 300 pohon di notebook [notebook] — vol20 0,2084, ma20_dist 0,2050, gspc_lag1 0,1989, lag1 0,1976, lag5_mean 0,1901. Rentangnya hanya 0,1901–0,2084: selisih tertinggi dan terendah hanya 0,0183. Tidak ada satu fitur yang mendominasi; apakah ada fitur yang bisa dibuang tanpa kehilangan apa-apa hanya bisa dijawab lewat uji ablation — importance yang nonzero saja tidak membuktikannya.",
        "Baik atau buruk: importance yang merata bagus sebagai sinyal bahwa model memakai semua informasi yang ada — tidak ada fitur «sampah» yang menyesatkan. Buruk bila dibaca sebagai «semua fitur sama-sama berguna»: importance yang merata di angka sekitar 0,20 (sama dengan 1/5 = pembagian rata) juga bisa berarti model tidak menemukan satu pun fitur yang benar-benar membedakan — tiap fitur hanya sedikit lebih baik daripada acak, dan pohon memilihnya bergantian karena tidak ada yang menonjol.",
        "Mitigasi: jangan menambah fitur teknikal yang mirip (lag2, lag3, vol10, vol30) dengan harapan importance «menemukan» yang terbaik — fitur-fitur yang berkorelasi tinggi akan berbagi importance dan membuat bacaannya kabur. Bila semua importance merata di sekitar 1/jumlah fitur, pertimbangkan bahwa masalahnya adalah sinyal, bukan pilihan fitur — dan uji fitur dari keluarga yang berbeda (fundamental, sentimen, arus dana) sebelum menambah varian dari keluarga yang sama.",
      ],
      tasks: [],
    },
    {
      id: "stacking",
      eyebrow: "Langkah 10 · Stacking",
      title: "Stacking: model yang mempelajari model lain — dan tetap tidak menyelamatkan",
      prose: [
        "Stacking adalah ensemble tingkat kedua: latih beberapa model dasar yang BERBEDA (di sini RF dan GBM), kumpulkan prediksi probabilitas mereka sebagai fitur baru, lalu latih satu model meta (di sini Logistic Regression) untuk menggabungkan prediksi itu. Idenya: meta-learner belajar kapan harus percaya RF dan kapan harus percaya GBM — misal, «bila RF yakin dan GBM ragu, ikuti RF».",
        "Yang wajib dijaga: prediksi model dasar untuk melatih meta-learner harus OUT-OF-FOLD — tiap baris diprediksi oleh model yang tidak pernah melihat baris itu saat dilatih. Bila meta-learner dilatih pada prediksi in-sample model dasar (yang sudah menghafal, seperti RF train 1,0000), ia akan belajar mempercayai model yang menghafal — leakage tingkat kedua.",
        "Nilai: stacking RF + GBM → LR di notebook mencapai random-CV 0,5761 [notebook]. Bandingkan dengan random-CV model tunggal: RF 0,5326, LR 0,6000. Stacking (0,5761) berada DI ANTARA keduanya — lebih baik dari RF, lebih buruk dari LR sendirian. Dan ingat: 0,5761 ini adalah random-CV, yang menggelembung (langkah 8) — angka walk-forward-nya kemungkinan lebih rendah lagi.",
        "Baik atau buruk: stacking bagus bila model dasarnya beragam DAN masing-masing punya kelebihan di wilayah berbeda — meta-learner bisa memilih yang terbaik per wilayah. Buruk bila semua model dasar lemah pada sinyal yang sama: menggabungkan tiga model yang tidak tahu apa-apa tidak menghasilkan model yang tahu — ia hanya menghasilkan rata-rata ketidaktahuan yang lebih stabil.",
        "Mitigasi: sebelum stacking, pastikan tiap model dasar mengalahkan naive sendirian di walk-forward. Di sini hanya LR yang lolos syarat itu (0,5688 vs 0,5625) — RF dan GBM tidak. Stacking dari model-model yang kalah dari naive adalah menara yang dibangun di atas fondasi yang sudah kalah.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: ensemble yang lebih kompleks pasti lebih baik",
        type: "pitfall",
        body: "Yang benar: stacking RF + GBM → LR (0,5761, random-CV) kalah dari LR sendirian (0,6000, random-CV) di data ini. Kompleksitas menambah peluang overfit dan leakage tingkat kedua — ia hanya dibenarkan bila tiap model dasar sudah terbukti berguna dan beragam.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 11 · Lab 1",
      title: "Lab: bagging dari nol pada 12 titik",
      prose: [
        "Sekarang giliranmu membangun bagging. Datanya 12 titik dengan satu fitur x (1 sampai 12) dan label naik/tidak — dengan tiga titik «bandel» (x = 4 label 1, x = 7 label 1, x = 11 label 0) yang membuat satu threshold pun tidak bisa sempurna. Lima bootstrap sample sudah ditulis eksplisit (diambil acak dengan seed 0) — tiap pohon adalah decision stump: prediksi 1 bila x >= threshold, dengan threshold terbaik pada bootstrap sample-nya sendiri.",
        "Hasilnya [lab]: threshold kelima pohon adalah 6,5; 5,5; 6,5; 8,5; 11,5 — akurasi masing-masing 0,7500; 0,6667; 0,7500; 0,7500; 0,6667, rata-rata 0,7167. Voting mayoritas (minimal 3 dari 5 pohon bilang 1) menghasilkan [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1] dengan akurasi 0,7500 — lebih baik dari RATA-RATA pohon tunggal (0,7167), dan sama dengan pohon tunggal terbaik (0,7500).",
        "Bacaan yang jujur: bagging di sini TIDAK mengalahkan pohon terbaik — ia mengalahkan rata-rata. Itulah janji bagging yang sebenarnya: bukan «lebih baik dari yang terbaik», melainkan «lebih stabil dari rata-rata» — varians berkurang karena kesalahan tiap pohon yang berbeda-beda saling meniadakan dalam voting. Pohon 5 (threshold 11,5) nyaris selalu memprediksi 0; pohon 2 dan 3 berbeda pendapat di x = 6; voting merapikan perbedaan itu.",
        "Bandingkan dengan notebook: di sana 300 pohon dengan subset fitur acak juga tidak mengalahkan LR sendirian — bagging menstabilkan, bukan menyulap sinyal yang tidak ada.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi best_threshold: untuk tiap kandidat threshold, hitung error pada bootstrap sample, pilih yang terkecil (bila seri, ambil yang pertama)" },
        { id: "t2", text: "Lengkapi voting mayoritas: tiap titik diprediksi 1 bila minimal 3 dari 5 pohon memprediksi 1" },
        { id: "t3", text: "Jalankan dan bandingkan akurasi voting (0,7500) dengan rata-rata pohon tunggal (0,7167)" },
      ],
      expected: "pohon 1: threshold=6.5 akurasi=0.7500\npohon 2: threshold=5.5 akurasi=0.6667\npohon 3: threshold=6.5 akurasi=0.7500\npohon 4: threshold=8.5 akurasi=0.7500\npohon 5: threshold=11.5 akurasi=0.6667\nrata-rata pohon tunggal: 0.7167\nvoting: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]\nakurasi voting: 0.7500",
      hints: [
        "Error satu threshold pada satu bootstrap sample: jumlah baris sample yang prediksinya (1 bila x >= t, 0 bila tidak) berbeda dari labelnya — ingat sample berisi indeks, dan ada indeks yang muncul dua kali.",
        "Kandidat threshold adalah 1.5, 2.5, ..., 11.5 — titik tengah antar nilai x yang berurutan.",
        "Voting: untuk tiap x, hitung berapa pohon yang memprediksi 1; bila >= 3, voting = 1.",
      ],
      code: {
        starter: `# 12 titik (x, label): x = fitur tunggal, label = naik (1) / tidak (0) esok hari
xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
ys = [0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1]
# 5 bootstrap sample (indeks 1-based, diambil acak dengan seed 0 — ditulis eksplisit)
boots = [
    [7, 7, 1, 5, 9, 8, 7, 5, 8, 6, 10, 4],
    [9, 3, 5, 3, 2, 10, 5, 9, 12, 10, 3, 5],
    [2, 12, 2, 11, 6, 8, 9, 2, 6, 7, 6, 10],
    [11, 4, 9, 8, 8, 9, 5, 1, 9, 1, 2, 12],
    [7, 12, 11, 11, 1, 10, 8, 6, 4, 12, 6, 12],
]

def predict(t, x):
    return 1 if x >= t else 0

def best_threshold(idxs):
    best_t, best_err = None, None
    for t in [i + 0.5 for i in range(1, 12)]:
        err = 0  # TODO: jumlah baris sample yang prediksinya salah
        if best_err is None or err < best_err:
            best_t, best_err = t, err
    return best_t

thresholds = [best_threshold(b) for b in boots]
single_accs = []
for t in thresholds:
    acc = sum(1 for x, y in zip(xs, ys) if predict(t, x) == y) / len(xs)
    single_accs.append(acc)
    print(f"pohon {len(single_accs)}: threshold={t} akurasi={acc:.4f}")
mean_single = sum(single_accs) / len(single_accs)
print(f"rata-rata pohon tunggal: {mean_single:.4f}")
votes = []
for x in xs:
    v = 0  # TODO: jumlah pohon yang memprediksi 1 untuk x ini
    votes.append(1 if v >= 3 else 0)
voting_acc = sum(1 for v, y in zip(votes, ys) if v == y) / len(ys)
print(f"voting: {votes}")
print(f"akurasi voting: {voting_acc:.4f}")`,
        lockLines: 18,
        solution: `# 12 titik (x, label): x = fitur tunggal, label = naik (1) / tidak (0) esok hari
xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
ys = [0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1]
# 5 bootstrap sample (indeks 1-based, diambil acak dengan seed 0 — ditulis eksplisit)
boots = [
    [7, 7, 1, 5, 9, 8, 7, 5, 8, 6, 10, 4],
    [9, 3, 5, 3, 2, 10, 5, 9, 12, 10, 3, 5],
    [2, 12, 2, 11, 6, 8, 9, 2, 6, 7, 6, 10],
    [11, 4, 9, 8, 8, 9, 5, 1, 9, 1, 2, 12],
    [7, 12, 11, 11, 1, 10, 8, 6, 4, 12, 6, 12],
]

def predict(t, x):
    return 1 if x >= t else 0

def best_threshold(idxs):
    best_t, best_err = None, None
    for t in [i + 0.5 for i in range(1, 12)]:
        err = sum(1 for i in idxs if predict(t, xs[i - 1]) != ys[i - 1])
        if best_err is None or err < best_err:
            best_t, best_err = t, err
    return best_t

thresholds = [best_threshold(b) for b in boots]
single_accs = []
for t in thresholds:
    acc = sum(1 for x, y in zip(xs, ys) if predict(t, x) == y) / len(xs)
    single_accs.append(acc)
    print(f"pohon {len(single_accs)}: threshold={t} akurasi={acc:.4f}")
mean_single = sum(single_accs) / len(single_accs)
print(f"rata-rata pohon tunggal: {mean_single:.4f}")
votes = []
for x in xs:
    v = sum(1 for t in thresholds if predict(t, x) == 1)
    votes.append(1 if v >= 3 else 0)
voting_acc = sum(1 for v, y in zip(votes, ys) if v == y) / len(ys)
print(f"voting: {votes}")
print(f"akurasi voting: {voting_acc:.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "votes", value: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], label: "`votes` seharusnya [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]", msg: "Voting mayoritas 5 pohon: 0 untuk x = 1..6, 1 untuk x = 7..12." },
          { kind: "equal", task: "t3", name: "voting_acc", value: 0.75, label: "`voting_acc` seharusnya 0.75", msg: "Akurasi voting 0,7500 — di atas rata-rata pohon tunggal 0,7167." },
          { kind: "stdout_matches", task: "t3", pattern: "rata-rata pohon tunggal: 0\\.7167", label: "Output menampilkan rata-rata pohon tunggal 0,7167", msg: "Rata-rata akurasi kelima pohon tunggal: 0,7167." },
          { kind: "stdout_matches", task: "t3", pattern: "akurasi voting: 0\\.7500", label: "Output menampilkan akurasi voting 0,7500", msg: "Akurasi voting: 0,7500." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 12 · Lab 2",
      title: "Lab: walk-forward mini vs random split pada deret mainan",
      prose: [
        "Lab kedua menunjukkan jebakan random CV pada deret yang bisa kamu hitung dengan tangan. Datanya 20 hari arah return: 12 hari pertama TENANG — rentetan panjang turun lalu rentetan panjang naik — dan 8 hari terakhir BERGEJOLAK — arah bolak-balik tiap hari. Aturannya sederhana (aturan momentum): arah hari ini = arah mayoritas 3 hari sebelumnya.",
        "Evaluasi dua cara pada 8 hari test. Kronologis: 8 hari TERAKHIR (hari 13–20) — masa depan yang belum pernah dilihat. Acak: 8 hari yang dipilih acak dengan seed 7 — indeks 3, 4, 7, 9, 11, 13, 14, 19 (0-based), yaitu hari 4, 5, 8, 10, 12, 14, 15, 20 — sebagian besar dari periode tenang, sebagian kecil dari periode bergejolak.",
        "Hasilnya [lab]: uji kronologis 0,2500 — hanya 2 dari 8 benar. Uji acak 0,6250 — 5 dari 8 benar. Selisih 0,3750. Aturan yang SAMA, data yang SAMA — hanya cara memilih hari test yang berbeda. Uji acak terlihat bagus karena sebagian besar hari test-nya berasal dari periode tenang, di mana momentum bekerja (rentetan panjang mudah ditebak), dan karena hari-hari test itu bertetangga dengan hari-hari train dari rezim yang sama. Uji kronologis menguji pada rezim baru — periode bergejolak, di mana momentum gagal.",
        "Inilah yang terjadi di notebook dalam skala besar: random CV LR 0,6000 vs walk-forward 0,5688. Di lab mainan, selisihnya 0,3750 dan sebabnya terlihat jelas — rezim berubah. Di data nyata, selisihnya lebih kecil (+3,1pp) tapi sebabnya sama: random split menguji pada campuran masa lalu, walk-forward menguji pada masa depan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi predict(t): arah mayoritas 3 hari sebelumnya (jumlah > 0 berarti 1, < 0 berarti -1, 0 berarti arah hari sebelumnya)" },
        { id: "t2", text: "Hitung akurasi pada 8 hari kronologis terakhir (hari 13-20, indeks 12-19)" },
        { id: "t3", text: "Hitung akurasi pada 8 hari acak (seed 7) dan bandingkan dengan uji kronologis" },
      ],
      expected: "uji kronologis (hari 13-20): 0.2500\nuji acak (indeks [3, 4, 7, 9, 11, 13, 14, 19]): 0.6250\nselisih (acak - kronologis): 0.3750",
      hints: [
        "Mayoritas 3 hari sebelumnya: jumlahkan signs[t-3], signs[t-2], signs[t-1] — bila jumlahnya positif, prediksi 1; negatif, prediksi -1; nol, pakai signs[t-1].",
        "Hari dihitung dari indeks 0: hari 13-20 adalah indeks 12 sampai 19.",
        "8 hari acak: random.Random(7).sample(range(3, 20), 8), lalu diurutkan.",
      ],
      code: {
        starter: `import random

# Arah return harian 20 hari (1 = naik, -1 = turun): 12 hari pertama tenang
# (rentetan panjang), 8 hari terakhir bergejolak (bolak-balik tiap hari)
signs = [-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, 1, -1, 1, -1]

def predict(t):
    # Aturan momentum: arah hari t = arah mayoritas 3 hari sebelumnya
    s = sum(signs[t - 3:t])
    if s > 0:
        return 1
    if s < 0:
        return -1
    return signs[t - 1]

def accuracy(test_days):
    ok = 0  # TODO: jumlah hari test yang prediksinya benar
    return ok / len(test_days)

test_chrono = list(range(12, 20))  # 8 hari TERAKHIR (masa depan)
test_random = sorted(random.Random(7).sample(range(3, 20), 8))  # 8 hari acak
chrono_acc = accuracy(test_chrono)
random_acc = accuracy(test_random)
print(f"uji kronologis (hari 13-20): {chrono_acc:.4f}")
print(f"uji acak (indeks {test_random}): {random_acc:.4f}")
print(f"selisih (acak - kronologis): {random_acc - chrono_acc:.4f}")`,
        lockLines: 16,
        solution: `import random

# Arah return harian 20 hari (1 = naik, -1 = turun): 12 hari pertama tenang
# (rentetan panjang), 8 hari terakhir bergejolak (bolak-balik tiap hari)
signs = [-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, 1, -1, 1, -1]

def predict(t):
    # Aturan momentum: arah hari t = arah mayoritas 3 hari sebelumnya
    s = sum(signs[t - 3:t])
    if s > 0:
        return 1
    if s < 0:
        return -1
    return signs[t - 1]

def accuracy(test_days):
    ok = sum(1 for t in test_days if predict(t) == signs[t])
    return ok / len(test_days)

test_chrono = list(range(12, 20))  # 8 hari TERAKHIR (masa depan)
test_random = sorted(random.Random(7).sample(range(3, 20), 8))  # 8 hari acak
chrono_acc = accuracy(test_chrono)
random_acc = accuracy(test_random)
print(f"uji kronologis (hari 13-20): {chrono_acc:.4f}")
print(f"uji acak (indeks {test_random}): {random_acc:.4f}")
print(f"selisih (acak - kronologis): {random_acc - chrono_acc:.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "chrono_acc", value: 0.25, label: "`chrono_acc` seharusnya 0.25", msg: "Uji kronologis: 2 dari 8 benar (0,2500) — momentum gagal di periode bergejolak." },
          { kind: "equal", task: "t3", name: "random_acc", value: 0.625, label: "`random_acc` seharusnya 0.625", msg: "Uji acak: 5 dari 8 benar (0,6250) — sebagian besar hari test dari periode tenang." },
          { kind: "stdout_matches", task: "t3", pattern: "uji kronologis \\(hari 13-20\\): 0\\.2500", label: "Output menampilkan uji kronologis 0,2500", msg: "Format: uji kronologis (hari 13-20): 0.2500." },
          { kind: "stdout_matches", task: "t3", pattern: "selisih \\(acak - kronologis\\): 0\\.3750", label: "Output menampilkan selisih 0,3750", msg: "Selisih acak minus kronologis: 0,3750." },
        ],
      },
    },
    {
      id: "colab",
      eyebrow: "Langkah 13 · Guided task di Colab",
      title: "Guided task di Colab: Random Forest & ensembles di BBCA",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada 12 dan 20 titik. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m41-guided-task.ipynb.",
        "Di notebook itu kamu memuat harga BBCA, KLBF, UNVR, dan ^GSPC yang sesungguhnya (window 2024-11-01 sampai 2026-11-11; file pin diunduh 2026-11-12), membangun 5 fitur yang sama (lag1, lag5_mean, vol20, ma20_dist, gspc_lag1), mereplikasi walk-forward 8 folds (RF 0,5250, LR 0,5688, tree 0,5188, GBM 0,5062, naive 0,5625), random 5-fold CV (RF 0,5326, LR 0,6000), OOB 0,5261, train accuracy 1,0000, feature importance, dan stacking RF + GBM → LR (0,5761) — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "https://colab.research.google.com/drive/10dcxO45cK6ie1tbUdB6ukyjJphszA8lC",
        "Jalur file notebook: colab/mlf-m41-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 14 · Checkpoint",
      title: "Checkpoint: kerumunan pohon vs patokan naive",
      prose: [
        "Rangkuman: Random Forest adalah bagging — banyak pohon + bootstrap + subset fitur acak — yang menurunkan varians lewat voting mayoritas; boosting (GBM) melatih pohon berurutan untuk mengoreksi kesalahan, dan di data berisik ia justru paling lemah (walk-forward 0,5062). Walk-forward 8 folds [notebook]: RF 0,5250, LR 0,5688, pohon 0,5188, GBM 0,5062, naive-majority 0,5625 — hanya LR yang mengalahkan naive, dan hanya +0,6pp. Aturan trading dari probabilitas LR: threshold 0,50 memberi NET +10,06% setelah biaya 1,10% [ilustrasi] — tapi threshold 0,60, dengan akurasi & presisi terbaik (0,6125 / 0,6176), justru NET −11,88%: akurasi ≠ profit, dan tanpa simulasi P&L di sampel lain, strategi ini tidak boleh diklaim profitable. Interval Wilson 95% akurasi LR [0,4913; 0,6430] dan naive [0,4851; 0,6370] hampir sepenuhnya tumpang tindih — keunggulan +0,6pp LR jauh dari signifikan. RF train accuracy 1,0000 vs walk-forward 0,5250 (gap 0,4750) adalah overfitting ekstrem; OOB 0,5261 sepakat dengan walk-forward. Random 5-fold CV menggelembungkan LR +3,1pp (0,6000 vs 0,5688) — untuk RF selisihnya kecil (+0,76pp) tapi metodenya tetap salah. Feature importance merata (0,1901–0,2084): tidak ada fitur yang mendominasi. Stacking RF + GBM → LR mencapai random-CV 0,5761 — di antara RF dan LR sendirian.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Walk-forward 8 folds: RF 0,5250, LR 0,5688, naive-majority 0,5625. Apa kesimpulan yang paling tepat?",
          options: [
            { text: "RF bekerja dengan baik karena di atas 0,50", why: "Patokannya bukan 0,50 — naive-majority (selalu prediksi turun) mencapai 0,5625, dan RF 0,5250 berada DI BAWAH itu." },
            { text: "Hanya LR yang mengalahkan naive — dan hanya +0,6pp (0,5688 vs 0,5625)", why: "Benar: LR satu-satunya model di atas naive, dengan keunggulan tipis 0,6 poin persentase; RF, pohon, dan GBM semuanya di bawah naive.", correct: true },
            { text: "GBM adalah model terbaik karena boosting paling canggih", why: "GBM justru paling rendah: 0,5062 — di bawah satu pohon tunggal (0,5188) dan naive (0,5625)." },
            { text: "Semua model mengalahkan naive karena akurasinya di atas 0,50", why: "Tiga dari empat model berada di bawah naive 0,5625 — «di atas 0,50» bukan patokan yang benar bila base rate up hanya 0,4196." },
          ],
        },
        {
          q: "RF train accuracy 1,0000 vs walk-forward 0,5250 (gap 0,4750). Apa diagnosisnya?",
          options: [
            { text: "Model bekerja sempurna di train dan cukup baik di test", why: "Walk-forward 0,5250 berada di bawah naive 0,5625 — itu bukan «cukup baik»." },
            { text: "Overfitting ekstrem: pohon menghafal train sampai sempurna, lalu jatuh ke sekitar 0,53 pada data yang tidak ikut melatih", why: "Benar: gap 0,4750 antara train dan walk-forward — diperkuat OOB 0,5261 yang sepakat dengan walk-forward — adalah hafalan, bukan pembelajaran.", correct: true },
            { text: "Data test-nya terlalu sulit — train accuracy yang benar adalah 1,0000", why: "Train accuracy tidak pernah menjadi bukti tentang masa depan; yang berbicara tentang masa depan hanyalah walk-forward (dan OOB)." },
            { text: "Jumlah pohon (300) terlalu sedikit sehingga model underfit", why: "Underfit ditandai train accuracy RENDAH; di sini train accuracy 1,0000 — masalahnya kebalikan: hafalan." },
          ],
        },
        {
          q: "Mengapa subset fitur acak di tiap split penting dalam Random Forest?",
          options: [
            { text: "Agar tiap pohon lebih cepat dilatih", why: "Kecepatan adalah efek samping, bukan alasan utamanya — alasan utamanya adalah keragaman antar pohon." },
            { text: "Agar pohon-pohon tidak semuanya memilih fitur terkuat yang sama — keragaman antar pohon menurunkan varians voting", why: "Benar: tanpa subset acak, semua pohon mirip satu sama lain dan voting tidak mengurangi varians sebanyak voting dari pohon yang beragam.", correct: true },
            { text: "Agar feature importance tiap fitur menjadi sama besar", why: "Importance di notebook memang merata (0,1901–0,2084), tapi itu HASIL, bukan tujuan subset acak." },
            { text: "Agar bootstrap sample tiap pohon berbeda", why: "Bootstrap sample yang berbeda sudah dijamin oleh pengambilan dengan pengembalian — subset fitur adalah lapisan acak yang kedua, di tiap split." },
          ],
        },
        {
          q: "Apa perbedaan mendasar bagging dan boosting?",
          options: [
            { text: "Bagging melatih pohon berurutan, boosting melatih pohon paralel", why: "Terbalik: bagging paralel dan independen, boosting berurutan dan saling mengoreksi." },
            { text: "Bagging melatih banyak pohon paralel lalu voting (obat varians); boosting melatih pohon berurutan yang masing-masing mengoreksi kesalahan sebelumnya (obat bias)", why: "Benar: bagging merata-rata pohon independen; GBM menambahkan pohon baru untuk mengoreksi residual pohon sebelumnya.", correct: true },
            { text: "Bagging memakai pohon dalam, boosting memakai pohon yang sama dalamnya", why: "Boosting umumnya memakai pohon dangkal (weak learner) yang dikoreksi berulang — bukan pohon dalam seperti bagging." },
            { text: "Keduanya sama — hanya nama dagang yang berbeda", why: "Keduanya ensemble pohon, tapi mekanismenya berlawanan: paralel vs berurutan, varians vs bias." },
          ],
        },
        {
          q: "Random 5-fold CV: LR 0,6000 vs walk-forward 0,5688 (+3,1pp); RF 0,5326 vs 0,5250 (+0,76pp). Apa yang benar tentang random CV di sini?",
          options: [
            { text: "Random CV boleh dipakai karena untuk RF selisihnya kecil", why: "Selisih kecil pada RF tidak membuat metodenya benar — arah dan besar bias random CV tidak bisa diketahui dari satu eksperimen." },
            { text: "Random CV menggelembungkan skor karena fold acak melatih pada masa depan dan window 20 hari yang tumpang tindih menaruh «kembaran» baris test di train", why: "Benar: dua kebocoran itu — melatih pada masa depan + window tumpang tindih — membuat random CV optimistis; untuk LR +3,1pp, untuk RF +0,76pp.", correct: true },
            { text: "Random CV lebih jujur karena memakai seluruh data untuk evaluasi", why: "Memakai seluruh data justru masalahnya: baris test ikut «dilihat» lewat train masa depan dan window yang tumpang tindih." },
            { text: "Walk-forward yang salah karena hanya memakai 160 hari test", why: "160 hari test (8 × 20) memang kecil dan membuat rata-rata berisik — tapi itu keterbatasan presisi, bukan kebocoran seperti random CV." },
          ],
        },
        {
          q: "Feature importance RF: vol20 0,2084, ma20_dist 0,2050, gspc_lag1 0,1989, lag1 0,1976, lag5_mean 0,1901. Apa bacaan yang paling tepat?",
          options: [
            { text: "vol20 adalah fitur pahlawan yang harus dipakai sendirian", why: "Selisih vol20 (0,2084) dan lag5_mean (0,1901) hanya 0,0183 — tidak ada yang mendominasi." },
            { text: "Kelima fitur nyaris sama penting (rentang 0,1901–0,2084) — tidak ada yang mendominasi, dan merata di sekitar 1/5 juga bisa berarti tidak ada fitur yang benar-benar membedakan", why: "Benar: rentang sempit + dekat dengan pembagian rata 0,20 berarti model memakai semua fitur sedikit-sedikit, tanpa satu pun yang menonjol.", correct: true },
            { text: "lag5_mean harus dibuang karena importance-nya terendah", why: "Terendah 0,1901 masih nyaris sama dengan tertinggi 0,2084 — membuangnya tidak didukung angka ini." },
            { text: "Importance membuktikan vol20 menyebabkan BBCA naik", why: "Importance mengukur kontribusi pada split, bukan kausalitas — ia tidak membuktikan sebab-akibat." },
          ],
        },
        {
          q: "Stacking RF + GBM → LR mencapai random-CV 0,5761, sementara LR sendirian 0,6000 (random-CV) dan RF 0,5326. Apa kesimpulannya?",
          options: [
            { text: "Stacking membuktikan ensemble kompleks selalu menang", why: "Stacking (0,5761) KALAH dari LR sendirian (0,6000) — kompleksitas tidak selalu menang." },
            { text: "Stacking berada di antara RF dan LR — menggabungkan model-model yang kalah dari naive tidak menghasilkan model yang tahu", why: "Benar: 0,5761 di antara 0,5326 (RF) dan 0,6000 (LR); dan keduanya diukur dengan random-CV yang menggelembung pula.", correct: true },
            { text: "Meta-learner LR adalah penyebab stacking kalah", why: "LR sebagai model TUNGGAL justru yang terbaik (0,6000); yang lemah adalah model dasarnya (RF dan GBM), bukan meta-learner-nya." },
            { text: "Stacking harus memakai GBM sebagai meta-learner agar menang", why: "Tidak ada bukti untuk itu — GBM sebagai model dasar justru paling lemah (walk-forward 0,5062)." },
          ],
        },
        {
          q: "OOB score RF adalah 0,5261, walk-forward 0,5250, train accuracy 1,0000. Mengapa OOB dan walk-forward sepakat?",
          options: [
            { text: "Karena keduanya mengukur akurasi pada baris yang tidak ikut melatih pohon yang bersangkutan", why: "Benar: OOB memakai baris yang tidak terambil dalam bootstrap tiap pohon; walk-forward memakai masa depan yang belum dilihat — keduanya menguji generalisasi, dan keduanya sepakat di sekitar 0,53.", correct: true },
            { text: "Karena keduanya memakai 300 pohon yang sama", why: "Jumlah pohon yang sama tidak menjelaskan kesepakatan — train accuracy memakai 300 pohon yang sama juga, tapi 1,0000." },
            { text: "Karena OOB dihitung dari walk-forward folds", why: "OOB dan walk-forward adalah dua prosedur yang berbeda — OOB dari bootstrap, walk-forward dari split kronologis." },
            { text: "Kebetulan semata — keduanya mengukur hal yang berbeda", why: "Keduanya mengukur hal yang sama secara konseptual (generalisasi ke data tak terlihat) dengan cara berbeda — kesepakatan di 0,5250 vs 0,5261 memperkuat kesimpulan, bukan kebetulan." },
          ],
        },
        {
          q: "Threshold 0,60 punya akurasi 0,6125 dan presisi 0,6176 — terbaik dari ketiganya — tapi NET −11,88%, terburuk. Apa pelajarannya?",
          options: [
            { text: "Akurasi ≠ profit: akurasi dan presisi terbaik tidak menjamin return terbaik — return ditentukan hari-hari mana kamu long, bukan seberapa sering kamu benar", why: "Benar: akurasi menghitung seberapa sering prediksi benar, sementara return menghitung seberapa besar pergerakan pada hari-hari kamu long — keduanya mengukur hal yang berbeda, dan di sini keduanya berlawanan arah.", correct: true },
            { text: "Threshold 0,60 salah hitung — akurasi tinggi pasti untung", why: "Tidak ada yang salah hitung: akurasi 0,6125 dan NET −11,88% dihitung dari 160 hari yang sama — keduanya benar, dan keduanya bersama-sama membuktikan akurasi bukan profit." },
            { text: "Biaya transaksi 0,70% yang menyebabkan kerugian −11,88%", why: "Biaya hanya 0,70% dari kerugian itu — gross-nya sendiri sudah −11,18%: kerugiannya datang dari hari-hari long yang jatuh, bukan dari biaya." },
            { text: "Presisi 0,6176 terlalu rendah untuk trading", why: "0,6176 adalah presisi TERTINGGI dari ketiga threshold — bila itu «terlalu rendah», threshold lain yang presisinya lebih rendah lebih buruk lagi." },
          ],
        },
        {
          q: "Interval Wilson 95% akurasi LR adalah [0,4913; 0,6430] dan naive-majority [0,4851; 0,6370]. Apa kesimpulannya?",
          options: [
            { text: "Kedua selang hampir sepenuhnya tumpang tindih — keunggulan +0,6pp LR atas naive jauh dari signifikan secara statistik", why: "Benar: selang LR dan naive sama-sama selebar 15,2pp dan hampir berhimpit — data 160 hari tidak cukup untuk membedakan 0,5688 dari 0,5625.", correct: true },
            { text: "LR terbukti lebih baik karena 0,5688 > 0,5625", why: "Perbandingan titik tanpa interval menyesatkan: interval LR mencakup 0,49 (di bawah naive) sampai 0,64 — «lebih besar» di sini belum tentu nyata." },
            { text: "Interval yang lebar berarti akurasinya presisi tinggi", why: "Terbalik: interval lebar (15,2pp) berarti presisi RENDAH — «tidak ditolak» ≠ presisi tinggi." },
            { text: "Karena selangnya tumpang tindih, kedua model sama persis", why: "Tumpang tindih berarti perbedaan keduanya tidak bisa dibedakan dari data ini — bukan berarti keduanya identik." },
          ],
        },
      ],
      summary: [
        "Random Forest = bagging: banyak pohon + bootstrap + subset fitur acak di tiap split; voting mayoritas menurunkan varians karena pohon-pohonnya beragam.",
        "Boosting (GBM) = pohon berurutan yang mengoreksi kesalahan sebelumnya; di data berisik ia paling lemah (walk-forward 0,5062) — tanpa angka train accuracy GBM, hafalan noise tidak dapat dipastikan.",
        "Walk-forward 8 folds [notebook]: RF 0,5250, LR 0,5688, pohon 0,5188, GBM 0,5062, naive-majority 0,5625 — hanya LR di atas naive (+0,6pp).",
        "Aturan trading (probabilitas LR → long vs flat): threshold 0,50 NET +10,06% (biaya 1,10% [ilustrasi]); threshold 0,60 — akurasi & presisi terbaik (0,6125 / 0,6176) — justru NET −11,88%: akurasi ≠ profit; buy-and-hold −14,57%, naive-flat 0,00%.",
        "Ketidakpastian: interval Wilson 95% akurasi LR [0,4913; 0,6430] vs naive [0,4851; 0,6370] — hampir sepenuhnya tumpang tindih; keunggulan +0,6pp jauh dari signifikan.",
        "Overfitting ekstrem: RF train 1,0000 vs walk-forward 0,5250 (gap 0,4750); OOB 0,5261 sepakat dengan walk-forward.",
        "Random 5-fold CV menggelembungkan LR +3,1pp (0,6000 vs 0,5688); RF +0,76pp — selisih kecil tidak membuat metode jadi benar.",
        "Feature importance merata (0,1901–0,2084): vol20 tertinggi, lag5_mean terendah — tidak ada fitur yang mendominasi.",
        "Stacking RF + GBM → LR: random-CV 0,5761 — di antara RF (0,5326) dan LR sendirian (0,6000).",
        "Lab: bagging 5 stump — voting 0,7500 vs rata-rata pohon tunggal 0,7167; walk-forward mini — uji kronologis 0,2500 vs uji acak 0,6250 (selisih 0,3750).",
      ],
      next: { label: "Lanjut: MLF-M4.2 — VaR & Expected Shortfall", href: "/v2/learn/mlf-m42-var-expected-shortfall" },
    },
  ],
};

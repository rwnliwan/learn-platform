import type { V2Lesson } from "../lib/types";

export const mlfM71: V2Lesson = {
  slug: "mlf-m71-fairness-metrics",
  track: "Machine Learning Finance",
  module: "Fairness, explainability & monitoring",
  title: "MLF-M7.1 — Fairness Metrics: Ketika Model yang Sama Memperlakukan Grup Berbeda",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Dua nasabah, satu skor, dua vonis — model yang sama, perlakuan yang berbeda",
      prose: [
        "Bayangkan dua nasabah. Keduanya 35 tahun, limit sama, riwayat bayar sama persis — satu-satunya yang membedakan mereka: kolom jenis kelamin di data. Yang satu disetujui pinjamannya, yang satu ditolak. Modelmu MEMAKAI kolom itu sebagai fitur [notebook]: koefisien LR SEX −0,0626, SHAP GBM 0,0314 — bobotnya kecil, tapi bukan nol. Dan itu bukan satu-satunya jalur: modelmu juga membedakan kedua grup lewat fitur-fitur lain yang berkorelasi dengan grup — limit, pola bayar, tagihan. Inilah pertanyaan lesson ini: bila ketidakadilan bisa masuk lewat kolom sensitif itu sendiri MAUPUN lewat proxy-nya, bagaimana kamu mengukurnya? Jawabannya, di data ini: kamu bisa — dan angka-angkanya ada di langkah berikut.",
        "Konteks angka lesson ini [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model keputusan = GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05. Approval = probabilitas default prediksi DI BAWAH threshold. ROC-AUC test: GBM mentah 0,7823, GBM terkalibrasi 0,7816. PR-AUC: GBM mentah 0,5597, GBM terkalibrasi 0,5558. Brier: GBM mentah 0,1342, GBM terkalibrasi 0,1345, ECE GBM terkalibrasi 0,0087. Semua angka fairness di lesson ini dihitung pada test 6.000 yang sama — angka-angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON, bukan template evaluasi final yang bebas seleksi; dalam praktik, metrik fairness dihitung di data evaluasi yang tidak dipakai untuk memilih model atau threshold (lihat M6.4 langkah 4).",
        "Peta lesson: cerita dua nasabah → apa itu fairness dan grup apa yang diperiksa → demographic parity: apakah approval-nya sama → AIR dan four-fifths rule 0,8 → equal opportunity: TPR per grup → equalized odds: TPR dan FPR, plus PPV → kalibrasi per grup: ECE dan Brier per grup → impossibility: kenapa tidak bisa puas semua sekaligus bila base rate beda → kapan tiap metrik yang tepat → threshold menggeser AIR, tapi bukan obat fairness → 2 lab → checkpoint.",
        "Nilai: fairness metrics adalah SATU-SATUNYA cara menjawab «apakah model ini adil?» dengan angka, bukan dengan firasat. «Model tidak memakai kolom SEX» bukan bukti adil — buktinya adalah approval rate, TPR, FPR, dan kalibrasi PER GRUP, dihitung dan dilaporkan berdampingan. Tanpa angka per grup, ketidakadilan tidak terlihat — dan yang tidak terlihat tidak pernah diperbaiki.",
        "Baik atau buruk: model dengan ROC-AUC 0,7823 itu bagus sebagai ukuran ranking — tapi ROC-AUC keseluruhan TIDAK berkata apa-apa soal fairness. Model yang ranking-nya bagus bisa sekaligus menyetujui satu grup jauh lebih jarang, salah menolak nasabah baik dari satu grup jauh lebih sering, dan berbohong soal probabilitas di satu grup. Ketiganya terjadi di data ini dalam derajat yang berbeda — dan lesson ini mengukur ketiganya satu per satu.",
        "Mitigasi: jangan pernah melaporkan metrik model HANYA secara keseluruhan. Setiap metrik yang penting — approval rate, TPR, FPR, PPV, ECE, Brier — laporkan juga PER GRUP (di sini: SEX, EDUCATION, AGE band), lengkap dengan n tiap grup. Bila satu grup n-nya kecil, laporkan n-nya dan tahan vonis (langkah 4 dan 7).",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «model tidak memakai atribut sensitif, jadi pasti adil»",
        type: "pitfall",
        body: "Yang benar: model di lesson ini MEMAKAI SEX, EDUCATION, MARRIAGE, dan AGE sebagai fitur prediksi — koefisien LR: SEX −0,0626, EDUCATION −0,0575, MARRIAGE −0,0565, AGE +0,0547; SHAP GBM SEX 0,0314 [notebook] — dan tetap menghasilkan approval rate laki-laki 26,1% vs perempuan 30,1% [notebook], serta AIR EDUCATION 0,357 [notebook]. Atribut sensitif memengaruhi keputusan lewat DUA jalur: langsung (kolomnya sendiri, bobot kecil) dan lewat proxy (limit, pola bayar, tagihan yang berkorelasi dengannya). Menghapus kolom sensitif dari fitur MENURUNKAN disparitas — AIR SEX 0,8694 → 0,9211 (M7.4) — tetapi TIDAK menuntaskannya: probe GBM masih memprediksi SEX dari fitur tersisa dengan ROC-AUC 0,6261, dan AIR tetap di bawah 1,0. Buktinya ada di angka per grup, bukan di daftar fitur.",
      },
    },
    {
      id: "apa-fairness",
      eyebrow: "Langkah 2 · Apa itu fairness",
      title: "Fairness: grup yang dilindungi, outcome yang diukur, dan pertanyaan yang benar",
      prose: [
        "Fairness dalam machine learning bukan satu definisi — ia satu KELUARGA definisi, dan tiap definisi menjawab pertanyaan yang berbeda. Semuanya memakai pola yang sama: bagi nasabah ke dalam GRUP menurut satu atribut (di sini SEX, EDUCATION, AGE band), lalu bandingkan OUTCOME model antar grup. Bila outcome-nya sama, model lolos definisi itu; bila berbeda jauh, model gagal definisi itu. Kuncinya: «outcome» itu bisa banyak hal — approval rate, TPR, FPR, PPV, atau kalibrasi — dan tiap pilihan menghasilkan jawaban yang berbeda.",
        "Grup yang diperiksa di lesson ini [notebook]: SEX (laki-laki n = 2.402, perempuan n = 3.598 di test 6.000); EDUCATION (Pascasarjana n = 2.130, Universitas n = 2.774, SMA n = 1.014, Lainnya n = 82 — gabungan kode 0/4/5/6, yaitu «lainnya/tidak diketahui»); AGE band (di bawah 30 tahun n = 1.912; 30–39 n = 2.198; 40–49 n = 1.341; 50–59 n = 473; 60+ n = 76). Perhatikan dua grup kecil itu — Lainnya n = 82 dan 60+ n = 76: keduanya akan muncul lagi sebagai peringatan di langkah 4, 5, dan 7, karena angka dari 82 atau 76 orang sangat mudah berubah oleh segelintir orang.",
        "Satu catatan kejujuran soal data: dataset UCI ini juga punya kolom MARRIAGE (status perkawinan) — dan flagship menyebutkannya dalam daftar audit fairness. Lesson ini TIDAK menghitung metrik per MARRIAGE: tiga variabel (SEX, EDUCATION, AGE) sudah cukup untuk mengajarkan kelima metrik, dan menambah variabel keempat hanya menambah tabel tanpa menambah konsep. Bila kamu mengaudit model sendiri, periksa juga MARRIAGE — polanya sama persis dengan yang kamu pelajari di sini.",
        "Nilai: memisahkan «grup» dari «outcome» adalah langkah yang membuat fairness bisa diukur. Tanpa grup yang didefinisikan dulu, «adil» hanya kata sifat; dengan grup dan outcome yang didefinisikan, «adil» menjadi angka yang bisa dibandingkan dengan ambang — dan ambang itulah yang dibahas di langkah 3 sampai 7.",
        "Baik atau buruk: definisi fairness yang banyak itu bagus karena tiap definisi menangkap satu jenis kerugian yang berbeda — ditolak padahal layak (FPR), tidak tertangkap padahal default (TPR), probabilitas yang bohong (kalibrasi). Buruk bila kamu memilih definisi SETELAH melihat angka — «metrik ini angkanya bagus, pakai yang ini saja» adalah cherry-picking yang sama buruknya dengan memilih threshold di test (M6.4 langkah 4). Metrik primer ditetapkan SEBELUM melihat angka (langkah 9).",
        "Mitigasi: sebelum menghitung apa pun, tulis tiga hal: (1) grup apa yang diperiksa, (2) outcome apa yang dibandingkan, (3) metrik PRIMER yang akan dipakai untuk vonis. Tulis ketiganya sebelum membuka angka — dan laporkan SEMUA metrik lain sebagai konteks, bukan sebagai pengganti vonis.",
      ],
      tasks: [],
    },
    {
      id: "demographic-parity",
      eyebrow: "Langkah 3 · Demographic parity",
      title: "Demographic parity: apakah approval-nya sama antar grup?",
      prose: [
        "Definisi pertama — dan yang paling intuitif — adalah demographic parity (juga disebut statistical parity): approval rate harus SAMA antar grup. Bila 30% perempuan disetujui, maka 30% laki-laki juga harus disetujui — tanpa peduli siapa yang sebenarnya default. Pertanyaannya bukan «apakah keputusan model benar?», melainkan «apakah model membagikan persetujuan secara merata?». Ini metrik tentang AKSES: siapa yang mendapat pinjaman, bukan siapa yang layak mendapatkannya.",
        "Nilai [notebook] — GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000: approval keseluruhan 28,5% (1.710 dari 6.000 disetujui). Per SEX: laki-laki 26,1% (628 dari 2.402 disetujui), perempuan 30,1% (1.082 dari 3.598 disetujui) — selisih 3,93 poin persen. Per EDUCATION: Pascasarjana 35,3% (752 dari 2.130), Universitas 25,2% (698 dari 2.774), SMA 20,9% (212 dari 1.014), Lainnya 58,5% (48 dari 82) — selisih terbesar 37,63 poin persen, dari SMA 20,9% sampai Lainnya 58,5%. Per AGE band: di bawah 30 tahun 26,6%, 30–39 tahun 33,1%, 40–49 tahun 27,0%, 50–59 tahun 20,3%, 60+ tahun 19,7% — selisih 13,38 poin persen.",
        "Baik atau buruk: selisih SEX 3,93 poin persen itu KECIL dalam nilai absolut — dan AIR-nya 0,8693, di atas ambang four-fifths 0,8 (langkah 4). Buruk bila dibaca sebagai «tidak ada masalah»: selisih 3,93 poin persen pada 6.000 nasabah berarti sekitar 94 nasabah laki-laki lebih sedikit yang disetujui dibanding bila ratenya sama dengan perempuan — dan pada skala portofolio nyata (ratusan ribu nasabah), selisih sekecil ini menjadi ribuan orang. Selisih EDUCATION 37,63 poin persen itu BESAR — tapi sebagian besar didorong oleh grup Lainnya (n = 82, approval 58,5%): tanpa grup kecil itu, selisih terbesar tinggal 14,40 poin persen (Pascasarjana 35,3% vs SMA 20,9%). Gambar di bawah menunjukkan keduanya — dan kenapa keduanya harus dibaca bersama n-nya.",
        "Mitigasi: laporkan demographic parity BERSAMA n tiap grup dan base rate tiap grup (langkah 8). Approval yang tidak sama BELUM tentu berarti model tidak adil — bisa jadi base rate default tiap grup memang beda (SMA base rate 0,2574 vs Pascasarjana 0,1901 [notebook]). Itulah mengapa demographic parity tidak pernah dibaca sendirian: ia selalu dipasangkan dengan AIR (langkah 4) dan dengan metrik berbasis kesalahan (langkah 5–6).",
      ],
      formula: String.raw`\text{Demographic parity: } \mathbb{P}(\hat{Y} = \text{setuju} \mid A = a) = \mathbb{P}(\hat{Y} = \text{setuju} \mid A = b) \quad \text{untuk semua grup } a, b`,
      formulaNote: "Demographic parity: peluang disetujui harus sama di semua grup — tanpa melihat label aktual. Di sini «disetujui» berarti probabilitas default prediksi DI BAWAH threshold 0,10.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Approval rate per grup: SEX laki-laki 26,1 persen dan perempuan 30,1 persen; EDUCATION Pascasarjana 35,3 persen, Universitas 25,2 persen, SMA 20,9 persen, Lainnya 58,5 persen dengan n 82">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Approval rate per grup — GBM terkalibrasi, threshold 0,10 (test 6.000)</text>
<text x="98" y="28" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">SEX</text>
<text x="330" y="28" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">EDUCATION</text>
<line x1="24" y1="30" x2="24" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="24" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="228" y1="34" x2="228" y2="206" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="20" y1="206.0" x2="24" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="16" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="20" y1="147.3" x2="24" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="16" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="20" y1="88.7" x2="24" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="16" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="20" y1="30.0" x2="24" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="16" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<rect x="66" y="129.3" width="44" height="76.7" fill="var(--c1)"/>
<text x="88" y="125.3" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">26,1%</text>
<text x="88" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Laki-laki</text>
<rect x="130" y="117.8" width="44" height="88.2" fill="var(--c1)"/>
<text x="152" y="113.8" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">30,1%</text>
<text x="152" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Perempuan</text>
<rect x="246" y="102.4" width="40" height="103.6" fill="var(--c4)"/>
<text x="266" y="98.4" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">35,3%</text>
<text x="266" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Pascasarjana</text>
<rect x="302" y="132.2" width="40" height="73.8" fill="var(--c4)"/>
<text x="322" y="128.2" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">25,2%</text>
<text x="322" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Universitas</text>
<rect x="358" y="144.7" width="40" height="61.3" fill="var(--c4)"/>
<text x="378" y="140.7" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">20,9%</text>
<text x="378" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">SMA</text>
<rect x="414" y="34.3" width="40" height="171.7" fill="var(--c2)"/>
<text x="434" y="30.3" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">58,5%</text>
<text x="434" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Lainnya*</text>
<text x="240" y="236" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">*Lainnya n = 82 (kode 0/4/5/6) — bar tertinggi, bukti terlemah. Approval keseluruhan 28,5%.</text>
</svg>`,
        alt: "Approval rate per grup: SEX laki-laki 26,1 persen dan perempuan 30,1 persen; EDUCATION Pascasarjana 35,3 persen, Universitas 25,2 persen, SMA 20,9 persen, Lainnya 58,5 persen dengan n 82.",
        caption: "Cara membaca: tinggi bar = approval rate grup itu (disetujui bila probabilitas default prediksi DI BAWAH 0,10) [notebook]. SEX selisihnya kecil (26,1% vs 30,1%); EDUCATION selisihnya besar — tapi bar tertinggi (Lainnya 58,5%) berasal dari 82 orang saja, jadi jangan jadikan ia patokan. Approval keseluruhan 28,5%.",
      },
      tasks: [],
    },
    {
      id: "air-four-fifths",
      eyebrow: "Langkah 4 · AIR + four-fifths rule",
      title: "AIR dan four-fifths rule: 0,8 sebagai garis merah",
      prose: [
        "Demographic parity bertanya «apakah approval-nya sama?» — tapi «sama» itu relatif terhadap apa? Jawabannya adalah AIR (adverse impact ratio, juga disebut disparate impact ratio): approval rate grup TERENDAH dibagi approval rate grup TERTINGGI. AIR 1,0 berarti persis sama; AIR 0,5 berarti grup yang paling jarang disetujui hanya mendapat setengah peluang dibanding grup yang paling sering disetujui. Ambang yang dipakai luas adalah four-fifths rule: AIR DI BAWAH 0,80 berarti ada adverse impact — model di-flag dan wajib diselidiki. Aturan ini berasal dari pedoman ketenagakerjaan Amerika (EEOC, 1978) — ia KONVENSI, bukan hukum kredit dan bukan ambang statistik: ia tidak berkata «di bawah 0,8 pasti diskriminasi», melainkan «di bawah 0,8, jangan lewatkan begitu saja».",
        "Nilai [notebook] — GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000. SEX: approval laki-laki 0,2614 vs perempuan 0,3007 → AIR = 0,2614 / 0,3007 = 0,8693 — LOLOS four-fifths (di atas 0,80), tapi bukan 1,0: laki-laki disetujui 13,1% lebih jarang secara relatif. Catatan presisi: nilai 0,8694 pada deret threshold (langkah 10) dihitung dari rate tak dibulatkan — selisih 0,0001 dari 0,8693 murni pembulatan. EDUCATION: approval terendah SMA 0,2091, tertinggi Lainnya 0,5854 → AIR = 0,2091 / 0,5854 = 0,357 — FLAG, jauh di bawah 0,80. AGE band: terendah 60+ 0,1974, tertinggi 30–39 tahun 0,3312 → AIR = 0,1974 / 0,3312 = 0,596 — FLAG. Dua flag, satu lolos — dan ketiganya harus dibaca dengan catatan n di bawah.",
        "Sekarang uji ketahanan kedua flag itu — karena keduanya memakai grup kecil sebagai pembanding. EDUCATION tanpa Lainnya (n = 82): tertinggi berikutnya adalah Pascasarjana 0,3531, terendah tetap SMA 0,2091 → AIR = 0,2091 / 0,3531 = 0,592 — MASIH flag, jauh di bawah 0,80. Flag EDUCATION bukan artefak satu grup kecil: bahkan di antara tiga grup besar (n = 1.014 sampai 2.774), SMA disetujui jauh lebih jarang daripada Pascasarjana. Perbandingan berpasangan lain [notebook]: Universitas vs Pascasarjana 0,7125 (di bawah 0,80 — flag juga), SMA vs Universitas 0,8311 (lolos, tipis). AGE tanpa 60+ (n = 76): tertinggi tetap 30–39 tahun 0,3312, terendah berikutnya 50–59 tahun 0,2030 → AIR = 0,2030 / 0,3312 = 0,613 — MASIH flag. Dan di bawah 30 tahun vs 30–39 tahun: 0,8037 — lolos, tipis sekali (selisih 0,0037 dari ambang).",
        "Satu catatan koreksi terhadap angka kunci lesson ini: catatan pengunci menulis «EDUCATION Pascasarjana AIR 0,603 TERTANDA flag (n=82 kecil)». AIR Pascasarjana 0,6032 itu TERVERIFIKASI persis (0,3531 / 0,5854 = 0,6032) — tapi n = 82 itu BUKAN n Pascasarjana (n Pascasarjana = 2.130); n = 82 adalah n grup Lainnya, yang dipakai sebagai pembanding tertinggi dalam perhitungan AIR itu. Flag-nya benar, angka AIR-nya benar, atribusi n-nya yang keliru di catatan — dan lesson ini mencatat koreksi itu secara terbuka, karena angka yang dikutip dengan n yang salah akan menyesatkan pembaca berikutnya. Sebagai pembanding lintas lesson: di M2 (scorecard), AIR G4 perempuan/laki-laki 1,1502 — arah yang SAMA (perempuan lebih sering disetujui) dengan model dan definisi grup yang berbeda; konsistensi arah antar lesson, bukan kesamaan angka.",
        "Baik atau buruk: AIR bagus karena ia SATU angka yang bisa dibandingkan dengan SATU ambang (0,80) — mudah dilaporkan, mudah diaudit. Buruk bila dibaca tanpa menyebut pembandingnya: AIR EDUCATION 0,357 memakai Lainnya (n = 82) sebagai tertinggi — bila Lainnya dikeluarkan, AIR-nya 0,592; keduanya flag, tapi besarnya berbeda jauh. AIR yang dilaporkan tanpa menyebut grup tertinggi dan n-nya adalah angka yang tidak bisa diperiksa ulang.",
        "Mitigasi: laporkan AIR SELALU dengan tiga pendamping: (1) approval rate tiap grup, (2) n tiap grup, (3) AIR robust tanpa grup kecil (n di bawah 100) — bila flag-nya hilang tanpa grup kecil, flag itu lemah; bila flag-nya bertahan (seperti di sini: 0,357 menjadi 0,592, tetap flag), flag itu kuat. Dan tetapkan ambang 0,80 SEBELUM melihat angka — four-fifths rule adalah konvensi yang dipilih dulu, bukan ambang yang digeser sampai angkanya lolos.",
      ],
      formula: String.raw`\mathrm{AIR} = \frac{\min_g \, \mathbb{P}(\hat{Y} = \text{setuju} \mid A = g)}{\max_g \, \mathbb{P}(\hat{Y} = \text{setuju} \mid A = g)}, \qquad \text{flag bila } \mathrm{AIR} < 0{,}80 \text{ (four-fifths rule)}`,
      formulaNote: "AIR: approval rate terendah dibagi tertinggi di dalam satu variabel. Four-fifths rule: AIR di bawah 0,80 = adverse impact, wajib diselidiki. Aturan ini konvensi (EEOC 1978), bukan hukum kredit.",
      tasks: [],
      note: {
        title: "Koreksi: n = 82 itu grup Lainnya, bukan Pascasarjana",
        type: "risk",
        body: "Catatan pengunci menulis «Pascasarjana AIR 0,603 (n=82 kecil)». Yang terverifikasi: AIR Pascasarjana = 0,3531 / 0,5854 = 0,6032 (cocok sampai 4 desimal) — dan n Pascasarjana = 2.130, BUKAN 82. Yang n-nya 82 adalah grup Lainnya (kode EDUCATION 0/4/5/6), yang dipakai sebagai pembanding tertinggi. Flag-nya benar; atribusi n-nya keliru di catatan. Lesson ini memakai angka yang benar (Pascasarjana n = 2.130; Lainnya n = 82) dan mencatat koreksi ini agar tidak diteruskan.",
      },
    },
    {
      id: "equal-opportunity",
      eyebrow: "Langkah 5 · Equal opportunity",
      title: "Equal opportunity: TPR — di antara yang default, siapa yang berhasil ditangkap?",
      prose: [
        "Demographic parity dan AIR tidak peduli apakah keputusan model BENAR — keduanya hanya menghitung siapa yang disetujui. Equal opportunity bertanya hal yang berbeda: di antara nasabah yang BENAR-BENAR default, berapa fraksi yang berhasil ditangkap (ditolak) model — dan apakah fraksi itu sama antar grup? Ukurannya adalah TPR (true positive rate): TP / (TP + FN), dengan «positif» = default. TPR yang sama antar grup berarti model sama pandainya menangkap nasabah bermasalah di tiap grup. TPR yang timpang berarti satu grup «lolos» dari penolakan lebih sering — dan default yang lolos itu menjadi kerugian bank.",
        "Nilai [notebook] — GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000. SEX: TPR laki-laki 0,9251 (519 dari 561 nasabah laki-laki yang default berhasil ditangkap), perempuan 0,9060 (694 dari 766) — gap 0,0191, kecil. AGE band: TPR tertinggi 60+ 0,9565 (22 dari 23), terendah 40–49 tahun 0,9006 (281 dari 312) — spread 0,0559, kecil. EDUCATION: TPR Pascasarjana 0,9037 (366 dari 405), Universitas 0,9207 (604 dari 656), SMA 0,9195 (240 dari 261) — ketiganya rapat di 0,90–0,92. Lalu ada Lainnya: TPR 0,6000 — dan di sinilah n kecil berbicara: Lainnya hanya punya 5 nasabah yang default (TP 3, FN 2), jadi SATU nasabah pindah kelompok mengubah TPR-nya 20 poin persen (dari 0,6000 menjadi 0,8000). Spread EDUCATION 0,3207 itu hampir seluruhnya artefak 5 orang.",
        "Baik atau buruk: TPR SEX yang rapat (gap 0,0191) itu bagus — model sama pandainya menangkap default di kedua grup, dan angka itu didukung n yang besar (561 dan 766 nasabah default). TPR Lainnya 0,6000 itu buruk sebagai VONIS — bukan karena angkanya rendah, melainkan karena ia dihitung dari 5 orang: ia rumor, bukan bukti. Buruk bila kamu membaca spread EDUCATION 0,3207 sebagai «model gagal equal opportunity di EDUCATION» tanpa melihat bahwa tiga grup besarnya rapat (0,9037–0,9207) dan satu grup kecilnya yang menarik spread itu.",
        "Mitigasi: untuk TPR, selalu laporkan JUMLAH nasabah default per grup (TP + FN) di samping TPR-nya. Aturan praktis di lesson ini: grup dengan nasabah default di bawah 30 orang TIDAK dipakai untuk vonis equal opportunity — angkanya dilaporkan, tapi dengan label «n terlalu kecil untuk vonis». Di data ini, Lainnya (5 nasabah default) dan 60+ (23 nasabah default) masuk kategori itu; tiga grup EDUCATION besar dan kedua grup SEX tidak.",
      ],
      formula: String.raw`\text{Equal opportunity: } \mathrm{TPR}_g = \mathbb{P}(\hat{Y} = \text{tolak} \mid Y = \text{default}, A = g) = \frac{\mathrm{TP}_g}{\mathrm{TP}_g + \mathrm{FN}_g} \text{ sama untuk semua grup } g`,
      formulaNote: "Equal opportunity: di antara nasabah yang benar-benar default, fraksi yang berhasil ditangkap (ditolak) harus sama antar grup. «Positif» di sini = default; prediksi default = ditolak.",
      tasks: [],
    },
    {
      id: "equalized-odds",
      eyebrow: "Langkah 6 · Equalized odds",
      title: "Equalized odds: TPR dan FPR — kedua sisi kesalahan harus sama",
      prose: [
        "Equal opportunity hanya memeriksa satu sisi kesalahan: default yang lolos (FN). Equalized odds memeriksa KEDUA sisi: TPR harus sama antar grup DAN FPR (false positive rate) harus sama antar grup. FPR = FP / (FP + TN): di antara nasabah yang LANCAR, berapa fraksi yang SALAH ditolak. Di kredit, FPR adalah ukuran kerugian nasabah: nasabah baik yang ditolak kehilangan akses pinjaman — dan bila satu grup FPR-nya jauh lebih tinggi, grup itu ditolak secara keliru jauh lebih sering. PPV (positive predictive value) = TP / (TP + FP) ikut dilaporkan: di antara yang ditolak, berapa fraksi yang benar-benar default — ia mengukur apakah penolakan model bisa dipercaya, dan ia terkait dengan base rate (langkah 8).",
        "Nilai [notebook] — GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000. SEX: FPR laki-laki 0,6817 (1.255 dari 1.841 nasabah laki-laki yang lancar salah ditolak), perempuan 0,6434 (1.822 dari 2.832) — gap 0,0383. Perhatikan besarnya: FPR keseluruhan 0,6585 — sekitar dua pertiga (65,85%) nasabah LANCAR ditolak pada threshold 0,10 (harga dari threshold yang rendah, lihat M6.4). PPV laki-laki 0,2926 vs perempuan 0,2758 — gap 0,0168. EDUCATION: FPR Pascasarjana 0,5867, Universitas 0,6950, SMA 0,7463 — spread 0,3437 bila Lainnya (0,4026, n kecil) dihitung, dan 0,1596 di antara tiga grup besar saja (0,7463 − 0,5867). SMA adalah grup yang paling sering salah ditolak: 74,63% nasabah SMA yang lancar ditolak, lawan 58,67% pada Pascasarjana. PPV EDUCATION: Pascasarjana 0,2656, Universitas 0,2909, SMA 0,2993 — spread 0,2111 bila Lainnya (0,0882, n kecil) dihitung, dan hanya 0,0337 di antara tiga grup besar. AGE band: FPR spread 0,1478 (terendah 30–39 tahun 0,6057, tertinggi 50–59 tahun 0,7535); PPV spread 0,0822 (terendah 50–59 tahun 0,2785, tertinggi 60+ 0,3607, n kecil).",
        "Baik atau buruk: gap FPR SEX 0,0383 itu kecil — model salah menolak nasabah baik dengan frekuensi yang hampir sama di kedua grup. Gap FPR EDUCATION di antara tiga grup besar (0,1596) itu BESAR dan BUKAN artefak n kecil — SMA salah ditolak 74,63% vs Pascasarjana 58,67%, dengan n ribuan di tiap grup. Inilah temuan equalized odds yang paling kuat di lesson ini: bukan di SEX, melainkan di EDUCATION — dan ia sejalan dengan temuan AIR (langkah 4): grup yang paling jarang disetujui (SMA) juga yang paling sering salah ditolak. PPV yang rapat di antara tiga grup besar EDUCATION (spread 0,0337) itu bagus — penolakan model sama bisa dipercayanya di tiap grup; PPV Lainnya 0,0882 (hanya 3 dari 34 yang ditolak benar-benar default) sekali lagi adalah rumor dari n kecil.",
        "Mitigasi: equalized odds dibaca sebagai PASANGAN (TPR gap, FPR gap) — jangan pernah laporkan satu tanpa yang lain. Bila TPR rapat tapi FPR timpang (seperti EDUCATION di sini: TPR tiga grup besar rapat 0,9037–0,9207, FPR timpang 0,5867–0,7463), vonisnya spesifik: model menangkap default sama baiknya, tapi membebani satu grup dengan penolakan keliru yang jauh lebih banyak. Mitigasi modelnya (threshold per grup, fitur tambahan, atau pengumpulan data) adalah topik M7.2 — di sini tugasmu adalah mengukur dan menamai masalahnya dengan tepat.",
      ],
      formula: String.raw`\text{Equalized odds: } \mathrm{TPR}_g \text{ sama } \forall g \quad \text{DAN} \quad \mathrm{FPR}_g = \frac{\mathrm{FP}_g}{\mathrm{FP}_g + \mathrm{TN}_g} \text{ sama } \forall g`,
      formulaNote: "Equalized odds: TPR dan FPR harus sama antar grup. FPR = di antara nasabah yang lancar, fraksi yang salah ditolak. PPV = TP / (TP + FP): di antara yang ditolak, fraksi yang benar-benar default.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="TPR dan FPR per grup: SEX TPR laki-laki 0,93 dan perempuan 0,91, FPR 0,68 dan 0,64; EDUCATION TPR Pascasarjana 0,90, Universitas 0,92, SMA 0,92, FPR 0,59, 0,70, 0,75">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TPR vs FPR per grup — GBM terkalibrasi, threshold 0,10 (test 6.000)</text>
<rect x="330" y="24" width="12" height="12" fill="var(--c1)"/>
<text x="346" y="34" font-size="10" fill="var(--text)" font-family="var(--font-ui)">TPR (menangkap default)</text>
<rect x="330" y="40" width="12" height="12" fill="var(--c2)"/>
<text x="346" y="50" font-size="10" fill="var(--text)" font-family="var(--font-ui)">FPR (salah menolak yang lancar)</text>
<line x1="24" y1="30" x2="24" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="24" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="228" y1="58" x2="228" y2="206" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="20" y1="206.0" x2="24" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="16" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="20" y1="118.0" x2="24" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="16" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="20" y1="30.0" x2="24" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="16" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1,0</text>
<text x="126" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">SEX</text>
<text x="356" y="70" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">EDUCATION (3 grup besar)</text>
<rect x="52" y="43.2" width="28" height="162.8" fill="var(--c1)"/>
<text x="66" y="39.2" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,93</text>
<rect x="84" y="86.0" width="28" height="120.0" fill="var(--c2)"/>
<text x="98" y="82.0" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,68</text>
<text x="82" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Laki-laki</text>
<rect x="140" y="46.6" width="28" height="159.4" fill="var(--c1)"/>
<text x="154" y="42.6" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,91</text>
<rect x="172" y="92.8" width="28" height="113.2" fill="var(--c2)"/>
<text x="186" y="88.8" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,64</text>
<text x="170" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Perempuan</text>
<rect x="258" y="46.9" width="24" height="159.1" fill="var(--c1)"/>
<text x="270" y="42.9" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,90</text>
<rect x="286" y="102.8" width="24" height="103.2" fill="var(--c2)"/>
<text x="298" y="98.8" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,59</text>
<text x="284" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Pascasarjana</text>
<rect x="322" y="44.0" width="24" height="162.0" fill="var(--c1)"/>
<text x="334" y="40.0" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,92</text>
<rect x="350" y="83.7" width="24" height="122.3" fill="var(--c2)"/>
<text x="362" y="79.7" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,70</text>
<text x="348" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Universitas</text>
<rect x="386" y="44.2" width="24" height="161.8" fill="var(--c1)"/>
<text x="398" y="40.2" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,92</text>
<rect x="414" y="74.7" width="24" height="131.3" fill="var(--c2)"/>
<text x="426" y="70.7" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,75</text>
<text x="412" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">SMA</text>
<text x="240" y="236" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">TPR rapat di semua grup (0,90–0,93) — FPR timpang di EDUCATION (SMA 0,75 vs Pascasarjana 0,59).</text>
</svg>`,
        alt: "TPR dan FPR per grup: SEX TPR laki-laki 0,93 dan perempuan 0,91, FPR 0,68 dan 0,64; EDUCATION TPR Pascasarjana 0,90, Universitas 0,92, SMA 0,92, FPR 0,59, 0,70, 0,75.",
        caption: "Cara membaca: bar biru = TPR (di antara yang default, fraksi yang ditangkap); bar merah = FPR (di antara yang lancar, fraksi yang salah ditolak) [notebook]. TPR rapat di semua grup (0,90–0,93) — equal opportunity hampir lolos. FPR timpang di EDUCATION: SMA 0,75 vs Pascasarjana 0,59 — equalized odds gagal di sisi FPR. Grup Lainnya (n = 82) tidak digambar: TPR/FPR-nya rumor dari 5 nasabah default.",
      },
      tasks: [],
    },
    {
      id: "kalibrasi-per-grup",
      eyebrow: "Langkah 7 · Kalibrasi per grup",
      title: "Kalibrasi per grup: probabilitas yang bohong di satu grup",
      prose: [
        "Empat metrik sebelumnya mengukur KEPUTUSAN (disetujui/ditolak). Kalibrasi per grup mengukur PROBABILITASNYA: bila model berkata «peluang default 0,4» kepada nasabah dari satu grup, apakah sungguh 40 dari 100 nasabah grup itu yang default? ECE per grup dihitung dengan 10 bin DI DALAM grup itu saja (definisi yang sama seperti M6.4); Brier per grup = rata-rata kuadrat (probabilitas − label) di dalam grup. Model yang terkalibrasi baik secara keseluruhan (ECE 0,0087) bisa bohong di satu grup — dan kebohongan itu berbahaya justru karena probabilitasnya dipakai untuk keputusan uang (threshold, expected loss, harga).",
        "Nilai [notebook] — GBM terkalibrasi (Platt/sigmoid), test 6.000. SEX: ECE laki-laki 0,0127 vs perempuan 0,0139 (gap 0,0012 — rapat); Brier laki-laki 0,1431 vs perempuan 0,1288 (gap 0,0143 — perempuan lebih baik, sejalan dengan base rate perempuan yang lebih rendah 0,2129 vs 0,2336). EDUCATION: ECE Pascasarjana 0,0210, Universitas 0,0100 (terbaik), SMA 0,0362, Lainnya 0,0455 (n = 82) — spread 0,0355; Brier Pascasarjana 0,1190, Universitas 0,1390, SMA 0,1609 (terburuk), Lainnya 0,0576 (n kecil, base rate rendah 0,0610 — Brier kecil karena hampir semua labelnya 0) — spread 0,1033. AGE band: ECE di bawah 30 tahun 0,0148; 30–39 tahun 0,0156; 40–49 tahun 0,0166; 50–59 tahun 0,0312; 60+ tahun 0,1208 — spread 0,1060, seluruhnya didorong 60+ (n = 76). Brier AGE: 60+ 0,1620 (terburuk), 30–39 tahun 0,1286 (terbaik).",
        "Dua bin contoh dari reliability per grup SEX [notebook] — yang menunjukkan kalibrasi BUKAN sekadar satu angka ECE. Perempuan, bin [0,4–0,5): n = 99, prediksi rata-rata 0,4436 vs tingkat aktual 0,3737 — selisih 0,0699, model MELEBIH-LEBIHKAN risiko perempuan di bin ini: dari 99 nasabah, yang benar-benar default 37 orang, sementara prediksinya menyiratkan sekitar 44 orang. Perempuan, bin [0,7–0,8): n = 159, prediksi 0,7398 vs aktual 0,7987 — selisih 0,0589 ke arah sebaliknya, model MEREMEHKAN risiko perempuan di ujung berisiko. Laki-laki, bin [0,1–0,2): n = 882, prediksi 0,1463 vs aktual 0,1599 — selisih 0,0136, kecil dan didukung n besar. Perempuan, bin [0,0–0,1): n = 1.082, prediksi 0,0665 vs aktual 0,0665 — selisih 0,0000, sempurna di bin terbesar. Jadi: kalibrasi perempuan bagus di bin besar, meleset di bin menengah — dan ECE 0,0139 merangkum keduanya menjadi satu angka yang menyembunyikan cerita itu.",
        "Baik atau buruk: ECE SEX yang rapat (0,0127 vs 0,0139) itu bagus — probabilitas model sama jujurnya di kedua grup. ECE SMA 0,0362 dan Brier SMA 0,1609 (terburuk di antara grup besar) itu buruk — grup yang sama yang paling jarang disetujui (langkah 4) dan paling sering salah ditolak (langkah 6) JUGA yang probabilitasnya paling tidak bisa dipercaya. Tiga metrik menunjuk grup yang sama: SMA. ECE 60+ 0,1208 itu buruk sebagai VONIS — n = 76, dan bin-binning di dalam 76 orang itu berisi belasan orang per bin; satu nasabah pindah bin mengubah tingkat aktual 1,3 poin persen lebih. Brier Lainnya 0,0576 yang «terbaik» itu menyesatkan — ia kecil karena base rate Lainnya 0,0610 (hampir semua lancar), bukan karena modelnya jujur di grup itu.",
        "Mitigasi: kalibrasi per grup dibaca sebagai PASANGAN ECE + Brier + n — dan SELALU bersama reliability bins-nya (dua bin contoh di atas). Bila ECE satu grup jauh lebih besar, jangan langsung kalibrasi ulang per grup (itu topik M7.2 — dan berisiko overfit pada grup kecil): pertama periksa apakah bin-bin besarnya yang meleset atau bin-bin kecilnya, lalu periksa apakah grup itu kekurangan data (n kecil) atau memang pola risikonya berbeda. Di data ini, SMA adalah kandidat pertama untuk penyelidikan lanjutan — bukan 60+, yang angkanya didominasi noise.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="ECE per grup: SEX laki-laki 0,013 dan perempuan 0,014; EDUCATION Pascasarjana 0,021, Universitas 0,010, SMA 0,036, Lainnya 0,046; AGE di bawah 30 tahun 0,015, 30 sampai 39 tahun 0,016, 40 sampai 49 tahun 0,017, 50 sampai 59 tahun 0,031, 60 plus 0,121; garis ECE keseluruhan 0,0087">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">ECE per grup — GBM terkalibrasi, 10 bin di dalam tiap grup (test 6.000)</text>
<line x1="24" y1="30" x2="24" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="24" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="24" y1="194.2" x2="466" y2="194.2" stroke="var(--c2)" stroke-width="1" stroke-dasharray="4 3"/>
<text x="462" y="190.2" text-anchor="end" font-size="9" fill="var(--text)" font-family="var(--font-ui)">ECE keseluruhan 0,0087</text>
<line x1="262" y1="34" x2="262" y2="206" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="20" y1="206.0" x2="24" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="16" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="20" y1="138.3" x2="24" y2="138.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="16" y="141.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,05</text>
<line x1="20" y1="70.6" x2="24" y2="70.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="16" y="73.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<text x="143" y="28" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">SEX + EDUCATION</text>
<text x="364" y="28" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">AGE band</text>
<rect x="32" y="188.8" width="30" height="17.2" fill="var(--c1)"/>
<text x="47" y="184.8" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,013</text>
<text x="47" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Laki-laki</text>
<rect x="70" y="187.2" width="30" height="18.8" fill="var(--c1)"/>
<text x="85" y="183.2" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,014</text>
<text x="85" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Perempuan</text>
<rect x="108" y="177.6" width="30" height="28.4" fill="var(--c4)"/>
<text x="123" y="173.6" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,021</text>
<text x="123" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Pasca</text>
<rect x="146" y="192.5" width="30" height="13.5" fill="var(--c4)"/>
<text x="161" y="188.5" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,010</text>
<text x="161" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Univ</text>
<rect x="184" y="157.0" width="30" height="49.0" fill="var(--c4)"/>
<text x="199" y="153.0" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,036</text>
<text x="199" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">SMA</text>
<rect x="222" y="144.4" width="30" height="61.6" fill="var(--c2)"/>
<text x="237" y="140.4" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,046</text>
<text x="237" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Lainnya*</text>
<rect x="280" y="186.0" width="30" height="20.0" fill="var(--c1)"/>
<text x="295" y="182.0" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,015</text>
<text x="295" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">di bawah 30</text>
<rect x="318" y="184.9" width="30" height="21.1" fill="var(--c1)"/>
<text x="333" y="180.9" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,016</text>
<text x="333" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">30–39</text>
<rect x="356" y="183.5" width="30" height="22.5" fill="var(--c1)"/>
<text x="371" y="179.5" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,017</text>
<text x="371" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">40–49</text>
<rect x="394" y="163.8" width="30" height="42.2" fill="var(--c1)"/>
<text x="409" y="159.8" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,031</text>
<text x="409" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">50–59</text>
<rect x="432" y="42.4" width="30" height="163.6" fill="var(--c2)"/>
<text x="447" y="38.4" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)">0,121</text>
<text x="447" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">60+*</text>
<text x="240" y="236" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">*Lainnya n = 82, 60+ n = 76 — dua bar tertinggi, bukti terlemah. SMA (n = 1.014) yang patut diselidiki.</text>
</svg>`,
        alt: "ECE per grup: SEX laki-laki 0,013 dan perempuan 0,014; EDUCATION Pascasarjana 0,021, Universitas 0,010, SMA 0,036, Lainnya 0,046; AGE di bawah 30 tahun 0,015, 30 sampai 39 tahun 0,016, 40 sampai 49 tahun 0,017, 50 sampai 59 tahun 0,031, 60 plus 0,121; garis ECE keseluruhan 0,0087.",
        caption: "Cara membaca: tinggi bar = ECE di dalam grup itu (10 bin, makin kecil makin jujur) [notebook]; garis putus-putus = ECE keseluruhan 0,0087. SEX rapat (0,013 vs 0,014). SMA 0,036 adalah yang terburuk di antara grup besar — grup yang sama yang paling jarang disetujui dan paling sering salah ditolak. Dua bar tertinggi (Lainnya 0,046 dan 60+ 0,121) berasal dari n = 82 dan n = 76 — jangan jadikan vonis.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: ECE keseluruhan yang kecil berarti kalibrasi merata",
        type: "pitfall",
        body: "Yang benar: ECE keseluruhan GBM terkalibrasi 0,0087 itu kecil — tapi ECE SMA 0,0362 (empat kali lipat) dan ECE 60+ 0,1208 (empat belas kali lipat) bersembunyi di baliknya. ECE keseluruhan adalah rata-rata tertimbang: grup besar yang terkalibrasi baik menutupi grup kecil yang terkalibrasi buruk. Selalu hitung ECE per grup — satu angka keseluruhan tidak pernah cukup.",
      },
    },
    {
      id: "impossibility",
      eyebrow: "Langkah 8 · Impossibility",
      title: "Impossibility: tidak bisa puas semua sekaligus bila base rate beda",
      prose: [
        "Sekarang pertanyaan yang paling tidak nyaman di lesson ini: bisakah model lolos SEMUA metrik sekaligus — demographic parity (approval sama), equalized odds (TPR dan FPR sama), DAN kalibrasi per grup (ECE kecil di semua grup)? Jawabannya adalah teorema impossibility (Kleinberg–Mullainathan–Raghavan, 2016; juga Chouldechova, 2017): bila base rate default BERBEDA antar grup, ketiga syarat itu TIDAK BISA dipenuhi sekaligus — kecuali dalam kasus degenerat (model sempurna, atau base rate sama). Ini bukan kekurangan data atau kekurangan tuning — ini matematika. Memilih metrik berarti memilih kerugian mana yang kamu terima.",
        "Nilai [notebook] — SEX adalah bukti numeriknya di data ini. Base rate: laki-laki 0,2336 vs perempuan 0,2129 — gap 0,0207, beda dan tidak bisa dihapus (ia sifat populasi, bukan sifat model). Dan keempat gap berikut TIDAK NOL sekaligus: approval gap 0,0393 (demographic parity gagal), TPR gap 0,0191 (equal opportunity gagal tipis), FPR gap 0,0383 (equalized odds gagal), PPV gap 0,0168. Bila kamu memaksa approval sama (demographic parity) dengan menggeser threshold laki-laki, TPR dan FPR-nya bergeser — dan PPV-nya ikut bergeser, karena PPV terkait dengan base rate lewat teorema Bayes: dengan TPR dan FPR yang sama persis pun, grup dengan base rate lebih tinggi akan punya PPV lebih tinggi. Di data ini: PPV laki-laki 0,2926 vs perempuan 0,2758 — selisih 0,0168 yang sebagian besar dijelaskan oleh base rate 0,2336 vs 0,2129, bukan oleh model yang «lebih bisa dipercaya» pada laki-laki.",
        "Contoh tandingan yang membuktikan ini bukan soal data kecil: bayangkan dua grup dengan base rate 0,10 dan 0,30, dan model yang TPR dan FPR-nya SAMA PERSIS di kedua grup. PPV grup pertama dan kedua TETAP berbeda — karena dari 100 yang ditolak, fraksi yang benar-benar default bergantung pada berapa banyak default yang ada di populasi grup itu. [Ilustrasi: angka 0,10 dan 0,30 ini contoh hitung, bukan angka UCI — dipakai untuk menunjukkan mekanisme Bayes, bukan untuk mengklaim sesuatu tentang data.] Satu-satunya jalan keluar: ubah TPR/FPR per grup (threshold berbeda per grup — dan itu membuka masalah hukum dan etika baru, langkah 10), atau terima bahwa satu metrik harus dikorbankan.",
        "Baik atau buruk: impossibility itu bagus sebagai PEMBEBAS — ia mengakhiri pencarian model yang «adil di semua metrik» yang tidak pernah ada, dan memindahkan pekerjaan ke tempat yang benar: memilih metrik PRIMER secara eksplisit dan mempertanggungjawabkannya (langkah 9). Buruk bila dipakai sebagai ALASAN untuk tidak berbuat apa-apa — «toh tidak bisa sempurna, jadi tidak usah diukur». Yang benar: ukur semuanya, pilih satu sebagai primer, dan laporkan harga yang dibayar di metrik lain.",
        "Mitigasi: di setiap laporan fairness, tulis SATU kalimat impossibility: «Base rate grup A 0,2336 vs grup B 0,2129, sehingga demographic parity, equalized odds, dan kalibrasi per grup tidak bisa sempurna sekaligus; metrik primer laporan ini adalah ___ , dan harga yang dibayar di metrik lain adalah ___ .» Bila laporan fairness tidak punya kalimat itu, ia belum jujur soal trade-off-nya.",
      ],
      formula: String.raw`\text{Bila } \mathbb{P}(Y=1 \mid A=a) \neq \mathbb{P}(Y=1 \mid A=b) \text{, maka demographic parity } + \text{ equalized odds } + \text{ kalibrasi per grup tidak bisa ketiganya sempurna.}`,
      formulaNote: "Teorema impossibility (Kleinberg dkk., 2016): bila base rate beda antar grup, ketiga syarat fairness itu tidak bisa dipenuhi sekaligus — kecuali model sempurna atau base rate sama. Di data ini base rate SEX 0,2336 vs 0,2129 [notebook].",
      tasks: [],
      note: {
        title: "Miskonsepsi: «tambah data / tuning lagi, nanti semua metrik lolos»",
        type: "pitfall",
        body: "Yang benar: tidak — bila base rate beda, ini teorema, bukan soal jumlah data. Data lebih banyak membuat estimasi gap-nya lebih presisi, bukan membuat gap-nya hilang. Yang bisa diubah hanyalah DI MANA trade-off itu diletakkan: metrik mana yang diprioritaskan, dan berapa harga yang dibayar di metrik lain. Itulah keputusan langkah 9 — dan ia keputusan manusia, bukan keputusan model.",
      },
    },
    {
      id: "kapan-metrik-tepat",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Kapan tiap metrik yang tepat: peta keputusan sebelum melihat angka",
      prose: [
        "Karena tidak semua metrik bisa lolos sekaligus (langkah 8), pekerjaanmu adalah MEMILIH — dan pilihan itu dibuat SEBELUM melihat angka, dari jenis kerugian yang paling penting dalam konteksmu. Peta keputusannya empat cabang. Cabang 1 — demographic parity + AIR: pakai bila yang dipertaruhkan adalah AKSES. Regulator, auditor, dan publik pertama-tama bertanya «siapa yang disetujui?» — dan AIR di bawah 0,80 adalah flag yang harus dijawab apa pun metrik lainmu. Di data ini, EDUCATION dan AGE memicu cabang ini. Cabang 2 — equal opportunity (TPR): pakai bila kerugian utamanya adalah default yang LOLOS — nasabah bermasalah yang disetujui dan merugikan bank. Di data ini TPR rapat (gap SEX 0,0191), jadi cabang ini lolos tanpa perdebatan.",
        "Cabang 3 — equalized odds (TPR + FPR): pakai bila KEDUA jenis kesalahan sama pentingnya — menangkap default DAN tidak salah menolak nasabah baik. Ini metrik yang paling menuntut, dan di data ini ia gagal di EDUCATION lewat sisi FPR (SMA 0,7463 vs Pascasarjana 0,5867 di antara grup besar). Cabang 4 — kalibrasi per grup (ECE + Brier): pakai bila PROBABILITASNYA dipakai ke hilir — threshold keputusan, expected loss, harga, cadangan, atau pelaporan ke regulator. Bila probabilitas SMA bohong (ECE 0,0362, Brier 0,1609), maka expected loss dan harga untuk nasabah SMA juga bohong — walau ranking-nya benar.",
        "Nilai: di data ini peta itu menunjuk SATU grup yang sama dari tiga arah: SMA. AIR EDUCATION flag (0,357; robust 0,592 tanpa Lainnya) — akses. FPR SMA 0,7463 vs Pascasarjana 0,5867 — penolakan keliru. ECE SMA 0,0362 dan Brier 0,1609 — kalibrasi terburuk di antara grup besar. Tiga metrik, satu grup, satu arah: SMA adalah prioritas penyelidikan pertama (M7.2: dari mana bias itu berasal — data, fitur, atau label?). SEX, sebaliknya, lolos di hampir semua metrik: AIR 0,8693 (lolos), TPR gap 0,0191, FPR gap 0,0383, ECE gap 0,0012 — «lolos» bukan berarti «nol»: approval gap 3,93 poin persen tetap dilaporkan dan dipantau.",
        "Baik atau buruk: peta empat cabang ini bagus karena ia mengubah «pilih metrik yang angkanya bagus» menjadi «pilih metrik dari kerugiannya» — keputusan yang bisa dipertahankan di depan auditor. Buruk bila dibaca sebagai «cukup satu metrik»: metrik primer adalah vonis, tapi metrik lain tetap dilaporkan sebagai konteks — laporan yang hanya menampilkan AIR tanpa TPR/FPR/kalibrasi menyembunyikan separuh cerita, sama seperti laporan yang hanya menampilkan ROC-AUC.",
        "Mitigasi: tulis peta keputusanmu dalam SATU tabel sebelum menghitung: kolomnya metrik, metrik primer (ya/tidak), ambang (misal AIR 0,80), dan alasan (kerugian apa yang dilindungi). Di kredit ritel, rekomendasi default lesson ini: primer = AIR + equal opportunity (akses dan penangkapan default), konteks = equalized odds + kalibrasi per grup. Bila konteksmu berbeda (misal probabilitas dipakai untuk penetapan harga), primernya berubah — dan tabel itu yang menjelaskan kenapa.",
      ],
      tasks: [],
    },
    {
      id: "threshold-air",
      eyebrow: "Langkah 10 · Threshold vs AIR",
      title: "Threshold menggeser AIR — tapi bukan obat fairness",
      prose: [
        "Godaan terakhir: bila AIR di threshold 0,10 kurang bagus, kenapa tidak geser saja threshold-nya sampai AIR membaik? Di data ini, godaan itu TERLIHAT berhasil. AIR SEX pada GBM terkalibrasi [notebook]: threshold 0,05 → 0,9183 (approval laki-laki 6,7% vs perempuan 7,3%); 0,10 → 0,8694 (26,1% vs 30,1%) — titik TERBURUK; 0,15 → 0,8906 (46,5% vs 52,2%); 0,20 → 0,9432 (62,9% vs 66,7%); 0,30 → 0,9526 (75,0% vs 78,7%); 0,50 → 0,9898 (87,5% vs 88,4%) — nyaris sempurna. Menaikkan threshold menaikkan approval kedua grup menuju 100% — dan bila semua orang disetujui, AIR-nya 1,0 secara mekanis. Fairness yang «diperbaiki» dengan menyetujui semua orang bukanlah fairness — itu penyerahan.",
        "Nilai [notebook + M6.4]: harga dari menggeser threshold itu dihitung di M6.4, dan ia mahal. Threshold 0,10 → approval 28,5%, bad rate 6,67%, net profit +NT$8.214.000. Threshold 0,50 → approval 88,05%, bad rate 15,96%, net profit −NT$18.994.456 — selisih NT$27.208.456, dari keputusan SATU angka. Threshold 0,20 (AIR SEX 0,9432, sudah jauh lebih baik dari 0,8694) → approval 65,13%, bad rate 11,13%, laba −NT$216.500 — masih rugi, walau tipis. Jadi: «memperbaiki» AIR dari 0,8694 menjadi 0,9432 dengan menggeser threshold ke 0,20 mengorbankan 8.214.000 − (−216.500) = NT$8.430.500 laba. Dan «memperbaiki» sampai 0,9898 di 0,50 mengorbankan NT$27.208.456. AIR yang dibeli dengan laba bukanlah perbaikan fairness — ia subsidi silang yang tidak tercatat.",
        "Ada pula jalan yang lebih berbahaya: threshold BERBEDA per grup — misal threshold 0,08 untuk laki-laki dan 0,12 untuk perempuan, supaya approval-nya sama persis. Secara matematis ia «menyelesaikan» demographic parity; secara hukum dan etika ia disparate treatment — memperlakukan orang berbeda EXPLICIT karena grupnya — dan di banyak yurisdiksi ia dilarang untuk keputusan kredit. Lesson ini TIDAK merekomendasikan threshold per grup; ia mencatatnya sebagai opsi yang ada, dengan peringatan: bila kamu mempertimbangkannya, konsultasikan penasihat hukum dan regulator DULU, dan jangan pernah menyembunyikannya dari laporan (M7.2 membahas sumber bias dan mitigasi yang sah — reweighting, pengumpulan data, perbaikan fitur — tanpa threshold per grup).",
        "Baik atau buruk: tabel AIR per threshold itu bagus sebagai DIAGNOSIS — ia menunjukkan seberapa sensitif AIR terhadap threshold, dan bahwa AIR terburuk justru di threshold operasional 0,10. Buruk bila dibaca sebagai «naikkan threshold sampai AIR lolos» — threshold adalah keputusan bisnis dari biaya (M6.4: p* = 0,10 dari LGD 45% dan margin 5%), bukan tuas fairness. Fairness yang diperbaiki lewat threshold adalah fairness yang dibayar dari laba — dan bila harganya tidak ditulis berdampingan, itu bukan perbaikan, itu penyembunyian biaya.",
        "Mitigasi: untuk setiap perubahan threshold yang diusulkan «demi fairness», laporkan TIGA angka berdampingan: (1) AIR sebelum vs sesudah, (2) approval rate dan bad rate sebelum vs sesudah, (3) net profit sebelum vs sesudah (M6.4). Bila seseorang hanya menyodorkan (1), tanyakan (2) dan (3) — dan bila (3)-nya negatif besar, yang dinegosiasi adalah constraint bisnisnya, bukan angkanya.",
      ],
      formula: String.raw`\mathrm{AIR}(t) = \frac{\min_g \, \mathbb{P}(\hat{p} < t \mid A = g)}{\max_g \, \mathbb{P}(\hat{p} < t \mid A = g)} \quad \xrightarrow[t \,\uparrow\,]{}\quad 1{,}0 \text{ secara mekanis (semua disetujui)}`,
      formulaNote: "AIR sebagai fungsi threshold t: menaikkan t menaikkan approval semua grup menuju 100%, sehingga AIR menuju 1,0 secara mekanis — bukan karena model menjadi lebih adil. Di data ini AIR SEX 0,8694 di t = 0,10 dan 0,9898 di t = 0,50 [notebook].",
      tasks: [],
      note: {
        title: "Miskonsepsi: «AIR membaik saat threshold naik, jadi modelnya makin adil»",
        type: "pitfall",
        body: "Yang benar: AIR membaik karena approval kedua grup sama-sama menuju 100% — bukan karena model membedakan grup dengan lebih adil. Di t = 0,50, AIR SEX 0,9898 «nyaris sempurna», tapi bad rate 15,96% dan laba −NT$18.994.456 (M6.4). Threshold yang menyetujui semua orang memang adil secara demographic parity — dan bangkrut secara bisnis. Jangan pernah menilai fairness dari AIR sendirian tanpa approval rate, bad rate, dan laba di sampingnya.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 11 · Lab 1",
      title: "Lab: AIR + four-fifths rule dari tabel kanonis",
      prose: [
        "Sekarang hitung AIR dengan tanganmu sendiri — dari approval rate kanonis GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 [notebook]. SEX: laki-laki 0,2614, perempuan 0,3007. EDUCATION: Pascasarjana 0,3531, Universitas 0,2516, SMA 0,2091, Lainnya 0,5854 (n = 82). Rumusnya dari langkah 4: AIR = approval terendah / tertinggi; flag bila AIR di bawah 0,80.",
        "Hasil yang diharapkan [lab]: air_sex=0.8693; air_edu=0.3572; flag_sex=False; flag_edu=True; air_edu_robust=0.5922; flag_edu_robust=True. Perhatikan dua hal: pertama, AIR SEX 0,8693 LOLOS four-fifths — tapi bukan 1,0, jadi «lolos» bukan «tidak ada gap». Kedua, air_edu_robust (tanpa Lainnya, n = 82) = 0,5922 — MASIH flag: flag EDUCATION bukan artefak satu grup kecil.",
        "Setelah lab jalan, bandingkan dengan ambang 0,80: SEX lolos dengan margin 0,0693; EDUCATION gagal dengan margin 0,4428 (atau 0,2078 tanpa Lainnya). Bila hasilmu berbeda, periksa dulu: apakah pembilangnya approval TERENDAH dan penyebutnya approval TERTINGGI — bukan sebaliknya — dan apakah air_edu_robust benar-benar mengeluarkan Lainnya dari min DAN max?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi air_sex: approval SEX terendah / tertinggi" },
        { id: "t2", text: "Lengkapi air_edu + flag_edu: AIR EDUCATION dan flag four-fifths-nya" },
        { id: "t3", text: "Lengkapi air_edu_robust + flag_edu_robust: AIR EDUCATION tanpa grup Lainnya (n = 82)" },
      ],
      expected: "air_sex=0.8693\nair_edu=0.3572\nflag_sex=False\nflag_edu=True\nair_edu_robust=0.5922\nflag_edu_robust=True",
      hints: [
        "AIR = min(approval) / max(approval): SEX → 0,2614 / 0,3007 = 0,8693.",
        "EDUCATION: terendah SMA 0,2091, tertinggi Lainnya 0,5854 → 0,2091 / 0,5854 = 0,3572.",
        "Robust: keluarkan Lainnya dulu — tertinggi berikutnya Pascasarjana 0,3531 → 0,2091 / 0,3531 = 0,5922; flag = air di bawah 0,80.",
      ],
      code: {
        starter: `# AIR + four-fifths rule dari approval rate kanonis (GBM terkalibrasi, t = 0,10) [notebook]
# Approval rate per grup; N = jumlah nasabah test per grup
APPROVAL_SEX = {"Laki-laki": 0.2614, "Perempuan": 0.3007}
APPROVAL_EDU = {"Pascasarjana": 0.3531, "Universitas": 0.2516,
                "SMA": 0.2091, "Lainnya": 0.5854}
N_EDU = {"Pascasarjana": 2130, "Universitas": 2774, "SMA": 1014, "Lainnya": 82}
FOUR_FIFTHS = 0.80  # ambang four-fifths rule: AIR < 0,80 -> flag

air_sex = 0.0  # TODO: min / max approval SEX
flag_sex = False  # TODO: True bila air_sex < FOUR_FIFTHS
air_edu = 0.0  # TODO: min / max approval EDUCATION
flag_edu = False  # TODO: True bila air_edu < FOUR_FIFTHS
air_edu_robust = 0.0  # TODO: min / max approval EDUCATION TANPA grup Lainnya (n = 82)
flag_edu_robust = False  # TODO: True bila air_edu_robust < FOUR_FIFTHS
print(f"air_sex={air_sex:.4f}")
print(f"air_edu={air_edu:.4f}")
print(f"flag_sex={flag_sex}")
print(f"flag_edu={flag_edu}")
print(f"air_edu_robust={air_edu_robust:.4f}")
print(f"flag_edu_robust={flag_edu_robust}")`,
        lockLines: 8,
        solution: `# AIR + four-fifths rule dari approval rate kanonis (GBM terkalibrasi, t = 0,10) [notebook]
# Approval rate per grup; N = jumlah nasabah test per grup
APPROVAL_SEX = {"Laki-laki": 0.2614, "Perempuan": 0.3007}
APPROVAL_EDU = {"Pascasarjana": 0.3531, "Universitas": 0.2516,
                "SMA": 0.2091, "Lainnya": 0.5854}
N_EDU = {"Pascasarjana": 2130, "Universitas": 2774, "SMA": 1014, "Lainnya": 82}
FOUR_FIFTHS = 0.80  # ambang four-fifths rule: AIR < 0,80 -> flag

air_sex = min(APPROVAL_SEX.values()) / max(APPROVAL_SEX.values())
flag_sex = air_sex < FOUR_FIFTHS
air_edu = min(APPROVAL_EDU.values()) / max(APPROVAL_EDU.values())
flag_edu = air_edu < FOUR_FIFTHS
edu_robust = {g: v for g, v in APPROVAL_EDU.items() if g != "Lainnya"}
air_edu_robust = min(edu_robust.values()) / max(edu_robust.values())
flag_edu_robust = air_edu_robust < FOUR_FIFTHS
print(f"air_sex={air_sex:.4f}")
print(f"air_edu={air_edu:.4f}")
print(f"flag_sex={flag_sex}")
print(f"flag_edu={flag_edu}")
print(f"air_edu_robust={air_edu_robust:.4f}")
print(f"flag_edu_robust={flag_edu_robust}")`,
        checks: [
          { kind: "equal", task: "t1", name: "air_sex", value: 0.8693, tol: 0.00005, label: "`air_sex` seharusnya 0.8693", msg: "AIR SEX = 0,2614 / 0,3007 = 0,8693 — lolos four-fifths (di atas 0,80), tapi bukan 1,0." },
          { kind: "equal", task: "t2", name: "air_edu", value: 0.3572, tol: 0.00005, label: "`air_edu` seharusnya 0.3572", msg: "AIR EDUCATION = 0,2091 / 0,5854 = 0,3572 — jauh di bawah 0,80, flag." },
          { kind: "stdout_matches", task: "t2", pattern: "flag_edu=True", label: "Output menampilkan flag_edu=True", msg: "AIR EDUCATION 0,3572 di bawah ambang 0,80 — flag adverse impact." },
          { kind: "equal", task: "t3", name: "air_edu_robust", value: 0.5922, tol: 0.00005, label: "`air_edu_robust` seharusnya 0.5922", msg: "Tanpa Lainnya (n = 82): 0,2091 / 0,3531 = 0,5922 — masih di bawah 0,80, flag bertahan." },
          { kind: "stdout_matches", task: "t3", pattern: "flag_edu_robust=True", label: "Output menampilkan flag_edu_robust=True", msg: "Flag EDUCATION bukan artefak grup kecil — tanpa Lainnya pun AIR-nya 0,5922, tetap flag." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 12 · Lab 2",
      title: "Lab: gap TPR / FPR / PPV — equal opportunity dan equalized odds",
      prose: [
        "Lab kedua menghitung gap antar grup — dari angka kanonis GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 [notebook]. SEX: TPR laki-laki 0,9251 vs perempuan 0,9060; FPR 0,6817 vs 0,6434; PPV 0,2926 vs 0,2758. EDUCATION: TPR Pascasarjana 0,9037, Universitas 0,9207, SMA 0,9195, Lainnya 0,6000 (n = 82, hanya 5 nasabah default); FPR Pascasarjana 0,5867, Universitas 0,6950, SMA 0,7463, Lainnya 0,4026.",
        "Hasil yang diharapkan [lab]: tpr_gap_sex=0.0191; fpr_gap_sex=0.0383; ppv_gap_sex=0.0168; tpr_spread_edu=0.3207; fpr_spread_edu=0.3437; worst_fpr_group_edu=SMA. Perhatikan: tpr_spread_edu 0,3207 hampir seluruhnya didorong Lainnya (0,6000 dari 5 nasabah default) — sementara fpr_spread_edu 0,3437 juga didorong Lainnya di sisi bawah (0,4026), tapi FPR di antara tiga grup besar saja tetap timpang (0,5867–0,7463, spread 0,1596). Grup dengan FPR tertinggi adalah SMA — grup yang sama yang paling jarang disetujui di lab 1.",
        "Setelah lab jalan, bandingkan dengan lab 1: SEX lolos AIR (0,8693) DAN gap-gapsnya kecil (TPR 0,0191, FPR 0,0383, PPV 0,0168) — konsisten. EDUCATION gagal AIR (0,3572) DAN FPR-nya timpang — konsisten juga, dan menunjuk grup yang sama (SMA). Bila hasilmu berbeda, periksa dulu: apakah gap = max − min (bukan selisih dua grup yang kamu pilih sembarangan)?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi tpr_gap_sex, fpr_gap_sex, ppv_gap_sex: |grup A - grup B| per metrik SEX" },
        { id: "t2", text: "Lengkapi tpr_spread_edu dan fpr_spread_edu: max - min di antara keempat grup EDUCATION" },
        { id: "t3", text: "Lengkapi worst_fpr_group_edu: grup EDUCATION dengan FPR tertinggi" },
      ],
      expected: "tpr_gap_sex=0.0191\nfpr_gap_sex=0.0383\nppv_gap_sex=0.0168\ntpr_spread_edu=0.3207\nfpr_spread_edu=0.3437\nworst_fpr_group_edu=SMA",
      hints: [
        "Gap SEX = |laki-laki − perempuan|: TPR |0,9251 − 0,9060| = 0,0191.",
        "Spread EDUCATION = max − min di antara keempat grup: TPR max 0,9207 (Universitas) − min 0,6000 (Lainnya) = 0,3207.",
        "FPR tertinggi EDUCATION: bandingkan 0,5867 / 0,6950 / 0,7463 / 0,4026 — SMA 0,7463 yang tertinggi.",
      ],
      code: {
        starter: `# Gap TPR / FPR / PPV antar grup — angka kanonis (GBM terkalibrasi, t = 0,10) [notebook]
# SEX: TPR/FPR/PPV laki-laki vs perempuan. EDUCATION: empat grup.
TPR_SEX = {"Laki-laki": 0.9251, "Perempuan": 0.9060}
FPR_SEX = {"Laki-laki": 0.6817, "Perempuan": 0.6434}
PPV_SEX = {"Laki-laki": 0.2926, "Perempuan": 0.2758}
TPR_EDU = {"Pascasarjana": 0.9037, "Universitas": 0.9207, "SMA": 0.9195, "Lainnya": 0.6000}
FPR_EDU = {"Pascasarjana": 0.5867, "Universitas": 0.6950, "SMA": 0.7463, "Lainnya": 0.4026}

tpr_gap_sex = 0.0  # TODO: |TPR laki-laki - TPR perempuan|
fpr_gap_sex = 0.0  # TODO: |FPR laki-laki - FPR perempuan|
ppv_gap_sex = 0.0  # TODO: |PPV laki-laki - PPV perempuan|
tpr_spread_edu = 0.0  # TODO: max - min TPR EDUCATION (keempat grup)
fpr_spread_edu = 0.0  # TODO: max - min FPR EDUCATION (keempat grup)
worst_fpr_group_edu = ""  # TODO: grup EDUCATION dengan FPR tertinggi
print(f"tpr_gap_sex={tpr_gap_sex:.4f}")
print(f"fpr_gap_sex={fpr_gap_sex:.4f}")
print(f"ppv_gap_sex={ppv_gap_sex:.4f}")
print(f"tpr_spread_edu={tpr_spread_edu:.4f}")
print(f"fpr_spread_edu={fpr_spread_edu:.4f}")
print(f"worst_fpr_group_edu={worst_fpr_group_edu}")`,
        lockLines: 7,
        solution: `# Gap TPR / FPR / PPV antar grup — angka kanonis (GBM terkalibrasi, t = 0,10) [notebook]
# SEX: TPR/FPR/PPV laki-laki vs perempuan. EDUCATION: empat grup.
TPR_SEX = {"Laki-laki": 0.9251, "Perempuan": 0.9060}
FPR_SEX = {"Laki-laki": 0.6817, "Perempuan": 0.6434}
PPV_SEX = {"Laki-laki": 0.2926, "Perempuan": 0.2758}
TPR_EDU = {"Pascasarjana": 0.9037, "Universitas": 0.9207, "SMA": 0.9195, "Lainnya": 0.6000}
FPR_EDU = {"Pascasarjana": 0.5867, "Universitas": 0.6950, "SMA": 0.7463, "Lainnya": 0.4026}

tpr_gap_sex = abs(TPR_SEX["Laki-laki"] - TPR_SEX["Perempuan"])
fpr_gap_sex = abs(FPR_SEX["Laki-laki"] - FPR_SEX["Perempuan"])
ppv_gap_sex = abs(PPV_SEX["Laki-laki"] - PPV_SEX["Perempuan"])
tpr_spread_edu = max(TPR_EDU.values()) - min(TPR_EDU.values())
fpr_spread_edu = max(FPR_EDU.values()) - min(FPR_EDU.values())
worst_fpr_group_edu = max(FPR_EDU, key=FPR_EDU.get)
print(f"tpr_gap_sex={tpr_gap_sex:.4f}")
print(f"fpr_gap_sex={fpr_gap_sex:.4f}")
print(f"ppv_gap_sex={ppv_gap_sex:.4f}")
print(f"tpr_spread_edu={tpr_spread_edu:.4f}")
print(f"fpr_spread_edu={fpr_spread_edu:.4f}")
print(f"worst_fpr_group_edu={worst_fpr_group_edu}")`,
        checks: [
          { kind: "equal", task: "t1", name: "tpr_gap_sex", value: 0.0191, tol: 0.00005, label: "`tpr_gap_sex` seharusnya 0.0191", msg: "TPR SEX: |0,9251 − 0,9060| = 0,0191 — equal opportunity hampir lolos." },
          { kind: "equal", task: "t1", name: "fpr_gap_sex", value: 0.0383, tol: 0.00005, label: "`fpr_gap_sex` seharusnya 0.0383", msg: "FPR SEX: |0,6817 − 0,6434| = 0,0383 — kecil, model salah menolak dengan frekuensi hampir sama." },
          { kind: "equal", task: "t1", name: "ppv_gap_sex", value: 0.0168, tol: 0.00005, label: "`ppv_gap_sex` seharusnya 0.0168", msg: "PPV SEX: |0,2926 − 0,2758| = 0,0168 — kecil, sebagian dijelaskan base rate yang beda." },
          { kind: "equal", task: "t2", name: "tpr_spread_edu", value: 0.3207, tol: 0.00005, label: "`tpr_spread_edu` seharusnya 0.3207", msg: "TPR EDUCATION spread 0,3207 — hampir seluruhnya didorong Lainnya (0,6000 dari 5 nasabah default); tiga grup besar rapat 0,9037–0,9207." },
          { kind: "equal", task: "t2", name: "fpr_spread_edu", value: 0.3437, tol: 0.00005, label: "`fpr_spread_edu` seharusnya 0.3437", msg: "FPR EDUCATION spread 0,3437 — tapi di antara tiga grup besar saja tetap timpang (0,5867–0,7463, spread 0,1596)." },
          { kind: "stdout_matches", task: "t3", pattern: "worst_fpr_group_edu=SMA", label: "Output menampilkan worst_fpr_group_edu=SMA", msg: "FPR tertinggi EDUCATION adalah SMA (0,7463) — grup yang sama yang paling jarang disetujui di lab 1." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: lima metrik, tiga flag, satu grup yang menonjol",
      prose: [
        "Rangkuman: model keputusan = GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 [notebook]. ROC-AUC GBM mentah 0,7823 / PR-AUC 0,5597 — ranking bagus, tapi tidak berkata apa-apa soal fairness. Demographic parity: approval keseluruhan 28,5%; SEX laki-laki 26,1% vs perempuan 30,1% (selisih 3,93 poin persen); EDUCATION Pascasarjana 35,3%, Universitas 25,2%, SMA 20,9%, Lainnya 58,5% (n = 82); AGE 30–39 tahun 33,1% tertinggi, 60+ 19,7% terendah. AIR + four-fifths rule (ambang 0,80): SEX 0,8693 (lolos); EDUCATION 0,357 (FLAG — robust 0,592 tanpa Lainnya, tetap flag); AGE 0,596 (FLAG — robust 0,613 tanpa 60+, tetap flag). Equal opportunity (TPR): SEX gap 0,0191 (0,9251 vs 0,9060); EDUCATION tiga grup besar rapat 0,9037–0,9207, Lainnya 0,6000 dari 5 nasabah default (rumor, bukan vonis); AGE spread 0,0559. Equalized odds (TPR + FPR): FPR SEX gap 0,0383 (0,6817 vs 0,6434); FPR EDUCATION tiga grup besar 0,5867–0,7463 (SMA tertinggi — paling sering salah ditolak); PPV SEX gap 0,0168 (0,2926 vs 0,2758). Kalibrasi per grup: ECE SEX 0,0127 vs 0,0139 (rapat); ECE EDUCATION Pascasarjana 0,0210, Universitas 0,0100, SMA 0,0362, Lainnya 0,0455 (n = 82); ECE AGE 60+ 0,1208 (n = 76 — rumor); Brier SMA 0,1609 terburuk di antara grup besar. Impossibility: base rate SEX 0,2336 vs 0,2129 (gap 0,0207) — demographic parity, equalized odds, dan kalibrasi per grup tidak bisa ketiganya sempurna sekaligus; pilih metrik primer SEBELUM melihat angka. Threshold: AIR SEX 0,8694 di 0,10 (terburuk) → 0,9898 di 0,50 — tapi menaikkan threshold ke 0,50 merugikan NT$27.208.456 laba (M6.4); threshold bukan obat fairness. Lab: AIR SEX 0,8693, AIR EDUCATION 0,3572 (robust 0,5922, tetap flag); gap SEX TPR 0,0191 / FPR 0,0383 / PPV 0,0168; spread EDUCATION TPR 0,3207 / FPR 0,3437; FPR tertinggi SMA. Satu grup menonjol dari tiga arah — SMA: paling jarang disetujui, paling sering salah ditolak, kalibrasi terburuk di antara grup besar. Penyelidikan asalnya adalah M7.2.",
        "Guided task di Colab — notebook mlf-m71-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data UCI: flagship GBM + GBM terkalibrasi, approval rate + AIR per SEX/EDUCATION/AGE, gap TPR/FPR/PPV, ECE + Brier per grup SEX, dan AIR SEX pada berbagai threshold. Tautan Colab: https://colab.research.google.com/drive/1h7ZqXA4IQjdiVjUwplAXb27BMl0KHpCJ",
        "Lanjut: MLF-M7.2 — Bias Audit Sources: dari mana bias SMA itu berasal — data, fitur, label, atau sampling — dan mitigasi apa yang sah tanpa threshold per grup.",
      ],
      tasks: [],
      quiz: [
        {
          q: "AIR SEX = 0,8693 (approval laki-laki 26,1% vs perempuan 30,1%). Apa vonis four-fifths rule-nya?",
          options: [
            { text: "Flag — 0,8693 di bawah 1,0 berarti ada adverse impact", why: "Salah ambang: four-fifths rule mem-flag AIR DI BAWAH 0,80. 0,8693 di atas 0,80 — lolos, walau bukan 1,0 dan gap 3,93 poin persen tetap dilaporkan." },
            { text: "Lolos — 0,8693 di atas ambang 0,80, tapi gap 3,93 poin persen tetap dilaporkan dan dipantau", why: "Benar: ambang four-fifths adalah 0,80; 0,8693 lolos. «Lolos» bukan «tidak ada gap» — laki-laki disetujui 13,1% lebih jarang secara relatif, dan itu tetap dicatat.", correct: true },
            { text: "Lolos dan tidak ada masalah sama sekali — AIR di atas 0,8 berarti model adil", why: "Berlebihan: four-fifths rule hanya satu metrik (akses). TPR gap 0,0191, FPR gap 0,0383, dan ECE gap 0,0012 tetap diperiksa — «lolos AIR» bukan «adil di semua metrik»." },
            { text: "Tidak bisa dinilai — AIR hanya berlaku untuk EDUCATION, bukan SEX", why: "Salah: AIR berlaku untuk variabel grup apa pun — SEX, EDUCATION, AGE. Di lesson ini AIR dihitung untuk ketiganya." },
          ],
        },
        {
          q: "AIR EDUCATION = 0,357 (terendah SMA 20,9%, tertinggi Lainnya 58,5%, n = 82). Bila Lainnya dikeluarkan, AIR-nya 0,592. Apa kesimpulan yang benar?",
          options: [
            { text: "Flag-nya hilang — 0,592 sudah di atas ambang 0,80", why: "Salah hitung ambang: 0,592 MASIH di bawah 0,80. Flag bertahan." },
            { text: "Flag-nya bertahan — 0,592 tetap di bawah 0,80, jadi flag EDUCATION bukan artefak satu grup kecil", why: "Benar: tanpa Lainnya, tertinggi berikutnya Pascasarjana 35,3% dan AIR-nya 0,2091 / 0,3531 = 0,592 — tetap flag. Ketiga grup besar pun timpang.", correct: true },
            { text: "Flag-nya batal karena Lainnya n = 82 terlalu kecil untuk dipakai sebagai pembanding", why: "Separuh benar: Lainnya memang terlalu kecil untuk vonis — tapi flag-nya TIDAK batal, karena tanpa Lainnya pun AIR-nya 0,592, tetap di bawah 0,80." },
            { text: "AIR EDUCATION seharusnya 1,0 karena semua grup EDUCATION punya base rate yang sama", why: "Salah fakta: base rate EDUCATION beda jauh — SMA 0,2574 vs Pascasarjana 0,1901 vs Lainnya 0,0610. Dan AIR mengukur approval, bukan base rate." },
          ],
        },
        {
          q: "TPR laki-laki 0,9251 berarti: dari 561 nasabah laki-laki yang benar-benar default, 519 berhasil ditangkap (ditolak). Apa arti equal opportunity di sini?",
          options: [
            { text: "TPR harus sama antar grup — model sama pandainya menangkap nasabah default di tiap grup", why: "Benar: equal opportunity = TPR sama antar grup. Di data ini TPR SEX 0,9251 vs 0,9060 (gap 0,0191) — hampir lolos.", correct: true },
            { text: "TPR harus 1,0 — semua nasabah default harus tertangkap", why: "Tidak realistis: TPR 1,0 berarti tidak satu pun default lolos — tidak ada model di data ini yang mencapainya, dan bukan syarat equal opportunity. Syaratnya adalah TPR SAMA antar grup, bukan 1,0." },
            { text: "TPR mengukur berapa fraksi nasabah yang disetujui", why: "Terbalik: itu approval rate. TPR mengukur, di antara yang benar-benar default, berapa fraksi yang ditangkap (ditolak)." },
            { text: "TPR Lainnya 0,6000 membuktikan model gagal equal opportunity di EDUCATION", why: "Terburu-buru: TPR Lainnya dihitung dari 5 nasabah default (TP 3, FN 2) — satu orang pindah mengubahnya 20 poin persen. Tiga grup besar EDUCATION rapat (0,9037–0,9207); vonis dari n = 5 adalah rumor." },
          ],
        },
        {
          q: "FPR SMA 0,7463 vs Pascasarjana 0,5867 (di antara grup besar EDUCATION). Apa arti angka ini bagi nasabah SMA?",
          options: [
            { text: "74,63% nasabah SMA yang lancar salah ditolak — grup SMA menanggung penolakan keliru jauh lebih banyak", why: "Benar: FPR = di antara yang lancar, fraksi yang salah ditolak. SMA 0,7463 vs Pascasarjana 0,5867 — selisih 15,96 poin persen, dengan n ribuan di tiap grup, jadi bukan noise.", correct: true },
            { text: "74,63% nasabah SMA default — SMA adalah grup paling berisiko", why: "Salah metrik: 74,63% itu FPR, bukan base rate. Base rate SMA 0,2574 — sekitar seperempat, bukan tiga perempat." },
            { text: "Tidak ada arti — FPR hanya relevan bila TPR-nya juga timpang", why: "Salah: equalized odds menuntut TPR DAN FPR sama. Di sini TPR rapat tapi FPR timpang — vonisnya spesifik: model menangkap default sama baiknya, tapi salah menolak satu grup jauh lebih sering." },
            { text: "Angka ini kecil — FPR di bawah 0,80 selalu aman", why: "Tidak ada ambang 0,80 untuk FPR — 0,80 adalah ambang AIR (four-fifths rule), bukan FPR. Yang dibandingkan adalah FPR antar grup, bukan terhadap 0,80." },
          ],
        },
        {
          q: "PPV laki-laki 0,2926 vs perempuan 0,2758 (gap 0,0168), padahal TPR dan FPR kedua grup hampir sama. Penjelasan yang paling tepat?",
          options: [
            { text: "Model lebih bisa dipercaya pada laki-laki — PPV lebih tinggi berarti penolakannya lebih akurat", why: "Terburu-buru: gap PPV 0,0168 ini sebagian besar dijelaskan base rate (laki-laki 0,2336 vs perempuan 0,2129), bukan kualitas model. Dengan TPR/FPR sama, grup ber-base-rate-tinggi otomatis ber-PPV-lebih-tinggi (Bayes)." },
            { text: "Base rate beda (0,2336 vs 0,2129): dengan TPR/FPR yang sama, grup ber-base-rate-lebih-tinggi otomatis ber-PPV-lebih-tinggi", why: "Benar: PPV bergantung pada base rate lewat teorema Bayes. Inilah salah satu wajah impossibility — PPV tidak bisa disamakan begitu saja bila base rate beda.", correct: true },
            { text: "PPV gap membuktikan model gagal equalized odds di SEX", why: "Salah definisi: equalized odds menuntut TPR dan FPR sama — bukan PPV. PPV yang beda karena base rate beda adalah konsekuensi matematis, bukan bukti model gagal." },
            { text: "PPV tidak ada hubungannya dengan base rate — gap ini pasti berasal dari threshold yang salah", why: "Salah: PPV = TP / (TP + FP), dan komposisi TP vs FP bergantung pada berapa banyak default di populasi grup itu — yaitu base rate. Threshold yang sama (0,10) dipakai di kedua grup." },
          ],
        },
        {
          q: "ECE 60+ = 0,1208 — empat belas kali ECE keseluruhan (0,0087). Apa vonis yang benar?",
          options: [
            { text: "Model jelas gagal kalibrasi pada 60+ — ECE 0,1208 adalah bukti kuat", why: "Terburu-buru: 60+ hanya n = 76. Bin-binning di dalam 76 orang berisi belasan orang per bin — satu nasabah pindah mengubah tingkat aktual lebih dari 1 poin persen. ECE-nya dilaporkan, tapi bukan vonis." },
            { text: "Bukan vonis — n = 76 terlalu kecil; angka dilaporkan dengan label n kecil, dan kandidat penyelidikan pertama tetap SMA (n = 1.014, ECE 0,0362)", why: "Benar: ECE 60+ didominasi noise dari n kecil. SMA punya n besar DAN ECE terburuk di antara grup besar (0,0362) — itulah yang patut diselidiki.", correct: true },
            { text: "ECE 60+ harus diabaikan — grup kecil tidak perlu dilaporkan", why: "Salah: grup kecil tetap DILAPORKAN lengkap dengan n-nya — yang dilarang adalah menjadikannya vonis. Menghapusnya dari laporan justru menyembunyikan ketidakpastian." },
            { text: "ECE 60+ membuktikan model harus dikalibrasi ulang per grup usia", why: "Terburu-buru: kalibrasi ulang per grup pada n = 76 hampir pasti overfit. Langkah pertama adalah memeriksa bin-binnya dan mengumpulkan data — bukan langsung kalibrasi ulang (topik M7.2)." },
          ],
        },
        {
          q: "Base rate SEX beda (laki-laki 0,2336 vs perempuan 0,2129). Menurut teorema impossibility, apa konsekuensinya?",
          options: [
            { text: "Demographic parity, equalized odds, dan kalibrasi per grup tidak bisa ketiganya sempurna sekaligus", why: "Benar: itu teorema Kleinberg dkk. (2016) — bila base rate beda, ketiga syarat itu tidak bisa dipenuhi sekaligus kecuali model sempurna. Di data ini keempat gap (approval 0,0393, TPR 0,0191, FPR 0,0383, PPV 0,0168) tidak nol sekaligus.", correct: true },
            { text: "Tidak ada konsekuensi — base rate beda 0,0207 terlalu kecil untuk memicu impossibility", why: "Salah: teorema tidak punya ambang «beda yang cukup besar» — base rate yang beda SEDIKIT pun membuat ketiganya tidak bisa sempurna sekaligus. Besarnya gap hanya menentukan seberapa besar trade-off-nya." },
            { text: "Solusinya adalah menambah data sampai base rate kedua grup sama", why: "Salah: base rate adalah sifat populasi, bukan sifat sampel. Data lebih banyak membuat estimasi gap lebih presisi — bukan membuat gap-nya hilang." },
            { text: "Impossibility hanya berlaku bila model memakai SEX sebagai fitur — model ini hanya memakai proxy, jadi tidak berlaku", why: "Salah: teorema berlaku untuk outcome model apa pun yang diukur per grup — tidak peduli fitur apa yang dipakai model. Dan premisnya keliru: model ini MEMAKAI SEX secara langsung (koefisien LR −0,0626, SHAP 0,0314), bukan hanya lewat proxy — dan tetap menunjukkan keempat gap itu." },
          ],
        },
        {
          q: "AIR SEX membaik dari 0,8694 (threshold 0,10) menjadi 0,9898 (threshold 0,50). Mengapa menaikkan threshold BUKAN perbaikan fairness?",
          options: [
            { text: "Karena AIR 0,9898 masih di bawah 1,0 — belum sempurna", why: "Bukan alasannya: 0,9898 sudah jauh di atas ambang 0,80. Masalahnya bukan angkanya, melainkan harganya." },
            { text: "Karena approval kedua grup sama-sama menuju 100% — AIR membaik secara mekanis — sementara laba jatuh dari +NT$8.214.000 menjadi −NT$18.994.456", why: "Benar: di t = 0,50 approval 88,05% dan bad rate 15,96% — «fairness» yang dibeli dengan menyetujui hampir semua orang dan merugi NT$27.208.456 bukanlah perbaikan, melainkan subsidi silang yang tidak tercatat.", correct: true },
            { text: "Karena threshold 0,50 melanggar four-fifths rule", why: "Salah: four-fifths rule menilai AIR, bukan threshold. AIR 0,9898 justru lolos four-fifths dengan mudah — masalahnya ada di laba dan bad rate, bukan di AIR." },
            { text: "Karena threshold tidak memengaruhi AIR sama sekali — angka 0,9898 itu salah hitung", why: "Salah fakta: AIR SEX per threshold dihitung dari probabilitas yang sama [notebook] — 0,05 → 0,9183; 0,10 → 0,8694; 0,50 → 0,9898. Threshold jelas memengaruhi AIR; masalahnya adalah HARGA perbaikannya." },
          ],
        },
      ],
      summary: [
        "Model keputusan: GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 [notebook]. ROC-AUC GBM mentah 0,7823 / PR-AUC 0,5597 — ranking bagus, tapi tidak berkata apa-apa soal fairness.",
        "Demographic parity [notebook]: approval keseluruhan 28,5%; SEX laki-laki 26,1% vs perempuan 30,1%; EDUCATION Pascasarjana 35,3%, Universitas 25,2%, SMA 20,9%, Lainnya 58,5% (n = 82); AGE 30–39 tahun 33,1% tertinggi, 60+ 19,7% terendah.",
        "AIR + four-fifths rule (ambang 0,80) [notebook]: SEX 0,8693 (lolos); EDUCATION 0,357 (FLAG — robust 0,592 tanpa Lainnya, tetap flag); AGE 0,596 (FLAG — robust 0,613 tanpa 60+, tetap flag). Koreksi catatan: n = 82 adalah grup Lainnya, bukan Pascasarjana (n = 2.130).",
        "Equal opportunity (TPR) [notebook]: SEX gap 0,0191 (0,9251 vs 0,9060); EDUCATION tiga grup besar rapat 0,9037–0,9207, Lainnya 0,6000 dari 5 nasabah default (rumor); AGE spread 0,0559.",
        "Equalized odds (TPR + FPR) [notebook]: FPR SEX gap 0,0383 (0,6817 vs 0,6434); FPR EDUCATION tiga grup besar 0,5867–0,7463 (SMA tertinggi); PPV SEX gap 0,0168 (0,2926 vs 0,2758).",
        "Kalibrasi per grup [notebook]: ECE SEX 0,0127 vs 0,0139; ECE EDUCATION Pascasarjana 0,0210, Universitas 0,0100, SMA 0,0362, Lainnya 0,0455 (n = 82); ECE AGE 60+ 0,1208 (n = 76 — rumor); Brier SMA 0,1609 terburuk di antara grup besar.",
        "Impossibility [notebook]: base rate SEX 0,2336 vs 0,2129 — demographic parity, equalized odds, dan kalibrasi per grup tidak bisa ketiganya sempurna sekaligus; pilih metrik primer SEBELUM melihat angka.",
        "Threshold [notebook]: AIR SEX 0,8694 di 0,10 → 0,9898 di 0,50 — tapi menaikkan threshold ke 0,50 merugikan NT$27.208.456 laba (M6.4); threshold bukan obat fairness.",
        "Lab: AIR SEX 0,8693, AIR EDUCATION 0,3572 (robust 0,5922, tetap flag); gap SEX TPR 0,0191 / FPR 0,0383 / PPV 0,0168; spread EDUCATION TPR 0,3207 / FPR 0,3437; FPR tertinggi SMA.",
        "Satu grup menonjol dari tiga arah — SMA: paling jarang disetujui, paling sering salah ditolak, kalibrasi terburuk di antara grup besar. Penyelidikan asalnya adalah M7.2.",
      ],
      next: { label: "Lanjut: MLF-M7.2 — Bias Audit Sources", href: "/v2/learn/mlf-m72-bias-audit-sources" },
    },
  ],
};

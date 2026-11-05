# Chunk 2: fr7 - fr12
CONTENT2 = {}

# ================================================================= FR7
CONTENT2["fr7-supervised-ml"] = {
"toc_worked": ("worked", "📐 Worked Example: Class Weight & Threshold Biaya"),
"worked": """
      <h2 id="worked">📐 Worked Example: Melatih Model di Data 1:500</h2>
      <p>Dua perhitungan yang mengubah model &ldquo;malas&rdquo; (prediksi semua normal, akurasi 99,8%) menjadi model yang benar-benar bekerja.</p>

      <details className="worked">
        <summary>📐 Contoh 1: menghitung scale_pos_weight dari rasio imbalance</summary>
        <p>Data training: 500.000 transaksi, 1.000 fraud → rasio 1:500. Model XGBoost/LightGBM tanpa penyesuaian akan mengabaikan kelas minoritas.</p>
        <p><strong>Langkah 1 — rumus bobot.</strong> <Tex math={String.raw`\\text{scale\\_pos\\_weight} = \\frac{\\text{negatif}}{\\text{positif}} = \\frac{499.000}{1.000} = 499`} block /> Artinya: setiap kesalahan pada satu fraud dihukum <strong>499×</strong> lebih berat daripada kesalahan pada satu transaksi normal — model &ldquo;dipaksa peduli&rdquo;.</p>
        <p><strong>Langkah 2 — efeknya.</strong> Tanpa bobot: recall 4%, precision 61% (model hampir tidak pernah berani memprediksi fraud). Dengan bobot 499: recall 71%, precision 18%. Precision turun — tapi itu <em>trade-off yang benar</em>: 18% dari flag adalah fraud vs 0,2% base rate = <strong>90× lebih baik dari acak</strong>.</p>
        <p><strong>Langkah 3 — jebakannya.</strong> Bobot 499 membuat skor probabilitas <em>tidak terkalibrasi</em> (skor 0,8 bukan berarti peluang 80%). Jika skor dipakai untuk threshold biaya (contoh 2), <strong>kalibrasi ulang dulu</strong> (Platt scaling / isotonic) atau gunakan ranking, bukan nilai absolutnya. Analis junior lupa langkah ini — lalu heran kenapa rumus threshold &ldquo;tidak bekerja&rdquo;.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: threshold dari biaya — kapan &ldquo;tahan&rdquo; transaksi?</summary>
        <p>Untuk skor terkalibrasi <Tex math={String.raw`p`} /> (peluang fraud), ambang optimal meminimalkan biaya ekspektasian:</p>
        <Tex math={String.raw`\\tau^* = \\frac{C_{FP}}{C_{FP} + C_{FN}}`} block />
        <p><Tex math={String.raw`C_{FP}`} /> = biaya false positive (review sia-sia Rp25rb). <Tex math={String.raw`C_{FN}`} /> = biaya false negative (fraud lolos Rp1,1jt). Maka τ* = 25.000/(25.000 + 1.100.000) = <strong>0,022</strong>.</p>
        <p><strong>Interpretasi:</strong> tahan transaksi jika peluang fraud &gt; <strong>2,2%</strong> — jauh di bawah 50%! Intuisinya: karena meloloskan fraud 44× lebih mahal daripada review sia-sia, kita rela &ldquo;mengganggu&rdquo; banyak transaksi normal demi menangkap fraud. Angka ini artinya <strong>threshold optimal hampir tidak pernah 0,5</strong> di fraud — 0,5 hanya benar jika biaya FP = FN, yang tidak pernah terjadi.</p>
        <p><strong>Coba pikir:</strong> untuk transaksi Rp50rb (C_FN kecil), τ* naik → lebih permisif. Untuk transaksi Rp50jt, τ* turun → lebih ketat. Inilah dasar <strong>threshold per-segmen nominal</strong> (FR11): satu ambang global = menghukum transaksi kecil dan membiarkan transaksi besar.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Memilih Senjata ML"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: GBM, LogReg, atau Neural Net?</h2>
      <p>Tiga skenario pemilihan model yang dihadapi tim fraud Indonesia:</p>
      <p><strong>Skenario A — butuh dijelaskan ke regulator/auditor.</strong> Pilih <strong>logistic regression / shallow tree</strong> meski AUC 2–3 poin lebih rendah dari GBM. Di Indonesia, ketika OJK/BI bertanya &ldquo;kenapa nasabah ini diblokir&rdquo;, jawaban &ldquo;SHAP bilang begitu&rdquo; lebih lemah daripada &ldquo;koefisien velocity 15 menit = +2,1&rdquo;. Aturan: <strong>di industri teregulasi, explainability adalah fitur, bukan aksesori</strong> (FR17).</p>
      <p><strong>Skenario B — data tabular + imbalance ekstrem + butuh cepat.</strong> Pilih <strong>GBM (LightGBM/XGBoost)</strong>. Ia juara dunia data tabular fraud: menangani missing value, interaksi fitur otomatis, training menit bukan jam. 90% model skor fraud produksi di Indonesia adalah GBM — bukan karena paling canggih, tapi karena <strong>rasio akurasi-per-rupiah-biaya-operasional</strong> terbaik.</p>
      <p><strong>Skenario C — data sekuensial kaya (urutan klik, teks).</strong> Baru pertimbangkan <strong>neural net / sequence model</strong> — dan hanya jika datamu cukup besar (&gt; 1 juta sampel) dan timmu bisa mengoperasikannya (FR18). Neural net yang tidak terawat di produksi lebih berbahaya daripada GBM sederhana yang terpantau.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Model dengan AUC 0,99 pasti bagus.&rdquo;<br /><strong>Yang benar:</strong> di data imbalance 1:500, AUC-ROC 0,99 bisa berarti precision 5% — model &ldquo;hebat&rdquo; yang 19 dari 20 flag-nya salah. Selalu lihat <strong>PR-AUC dan precision@recall-operasional</strong> (FR9). AUC-ROC di fraud seperti nilai ujian tanpa melihat soalnya: terlihat bagus, belum tentu bermakna.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Skor Transaksi Bank Digital"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Model Skor di Bank Digital</h2>
      <p>Bank digital Indonesia dengan 8 juta transaksi/bulan menerapkan model GBM untuk skor fraud real-time. Angka-angka operasionalnya (ilustratif dari pola umum industri):</p>
      <ol>
        <li><strong>Sebelum model:</strong> 40 rule manual, precision 6%, 12.000 flag/hari, tim 45 investigator kewalahan, fraud loss Rp4,2 M/bulan.</li>
        <li><strong>Sesudah model (GBM, 28 fitur):</strong> precision 23%, flag turun ke 5.500/hari (model memprioritaskan), recall naik dari 31% ke 58%, fraud loss turun ke Rp2,6 M/bulan.</li>
        <li><strong>Biaya:</strong> tim model 4 orang + infra Rp180 jt/bulan. Penghematan loss Rp1,6 M/bulan → <strong>ROI 9×</strong>.</li>
      </ol>
      <p><strong>Yang tidak terlihat di angka:</strong> 3 bulan pertama, investigator <em>tidak percaya</em> model — mereka me-review ulang semua skor tinggi manual (menggandakan kerja). Kepercayaan baru tumbuh setelah tim model duduk 2 minggu bersama investigator, menjelaskan 10 contoh &ldquo;kenapa skor ini tinggi&rdquo; dengan bahasa fitur. Pelajaran: <strong>adopsi model = 50% teknis + 50% antropologi</strong>. Model terbaik yang tidak dipercaya = model yang tidak dipakai.</p>
      <p><strong>Fitur yang paling berkontribusi</strong> (dari analisis SHAP): velocity 1 jam ternormalisasi, device baru + nominal di atas persentil-95 nasabah, dan <em>perubahan pola jam transaksi</em>. Tiga fitur &ldquo;murah&rdquo; — lagi-lagi membuktikan FR6: kemenangan ada di fitur, bukan di algoritma.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dalam supervised fraud, <strong>urutan dampaknya: label (40%) &gt; fitur (40%) &gt; algoritma (15%) &gt; tuning (5%)</strong>. Tim yang menghabiskan 80% waktu untuk tuning XGBoost tapi labelnya kotor sedang mengoptimasi 5% sambil mengabaikan 80%. Kerja dari kiri ke kanan.</p>
      </div>
""",
},

# ================================================================= FR8
CONTENT2["fr8-unsupervised"] = {
"toc_worked": ("worked", "📐 Worked Example: Isolation Forest & Contamination"),
"worked": """
      <h2 id="worked">📐 Worked Example: Berpikir Seperti Isolation Forest</h2>
      <p>Unsupervised tidak &ldquo;belajar fraud&rdquo; — ia belajar <em>apa itu normal</em>, lalu menunjuk yang tidak normal. Dua contoh cara memakainya dengan benar.</p>

      <details className="worked">
        <summary>📐 Contoh 1: intuisi path length — kenapa anomali &ldquo;terisolasi&rdquo; lebih cepat</summary>
        <p>Bayangkan 100 titik transaksi di ruang 2D (sumbu: nominal, velocity). Isolation Forest memotong ruang secara acak berulang-ulang sampai tiap titik sendirian di kotaknya. Jumlah potongan = <em>path length</em>.</p>
        <p><strong>Titik normal</strong> (nominal Rp200rb, velocity 2/hari): bergerombol dengan 90 titik lain — butuh <strong>±12 potongan</strong> untuk mengisolasinya. <strong>Titik anomali</strong> (nominal Rp45jt, velocity 40/jam): sendirian di sudut ruang — cukup <strong>±4 potongan</strong>.</p>
        <p><strong>Skor anomali</strong> = fungsi dari path length relatif terhadap rata-rata: makin pendek path, makin anomali. Rumus intuisinya:</p>
        <Tex math={String.raw`s(x) = 2^{-\\frac{E[h(x)]}{c(n)}}`} block />
        <p><Tex math={String.raw`E[h(x)]`} /> = rata-rata path length titik x, <Tex math={String.raw`c(n)`} /> = path rata-rata normal untuk n titik. Jika s(x) mendekati 1 → anomali; mendekati 0,5 → normal. Angka ini artinya: <strong>seberapa &ldquo;murah&rdquo; mengisolasi titik ini dibanding titik biasa</strong> — anomali itu murah diisolasi karena ia memang tidak punya teman.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: memilih contamination — parameter yang paling sering salah</summary>
        <p><em>Contamination</em> = tebakanmu: berapa % data yang anomali. Model akan mem-flag tepat sebesar itu. Salah tebak = salah hasil, seakurat apa pun algoritmanya.</p>
        <p><strong>Kasus:</strong> 200.000 transaksi merchant, kamu set contamination = 5% → 10.000 flag. Investigasi sampel 500 flag: hanya 60 fraud (precision 12%). Tim protes.</p>
        <p><strong>Langkah 1 — estimasi base rate riil.</strong> Dari audit historis (FR4), fraud aktual ±0,8%. Anomali &ldquo;menarik&rdquo; (termasuk error sistem &amp; perilaku unik legit) mungkin 2–3× lipatnya.</p>
        <p><strong>Langkah 2 — set ulang.</strong> contamination = 2% → 4.000 flag. Precision naik ke 21% (840 fraud tertangkap dari sampel yang sama proporsinya) — <em>dan</em> beban review turun 60%.</p>
        <p><strong>Langkah 3 — validasi dengan injeksi.</strong> Selipkan 200 kasus fraud <em>diketahui</em> ke data, jalankan model: berapa yang tertangkap di 2%? Jika &lt; 70%, contamination terlalu kecil atau fitur kurang. Ini <strong>kalibrasi unsupervised dengan supervised spot-check</strong> — praktik yang membedakan pemakaian serius vs asal jalan.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Kapan Tanpa Label?"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Memilih Metode Tanpa Label</h2>
      <p>Tiga skenario di mana unsupervised adalah jawaban — dan satu di mana ia bukan:</p>
      <p><strong>Skenario A — serangan baru tanpa contoh (cold start).</strong> Modus refund fiktif muncul minggu ini, nol label. Isolation Forest di atas fitur velocity + amount langsung bisa dipakai <em>hari ini</em> untuk triage — supervised butuh 200+ label (FR4: butuh berminggu-minggu). Aturan: <strong>unsupervised untuk minggu pertama, supervised untuk bulan berikutnya</strong>.</p>
      <p><strong>Skenario B — Isolation Forest vs Autoencoder.</strong> Data tabular murni (angka-angka fitur) → Isolation Forest: cepat, stabil, mudah dijelaskan. Data kompleks berdimensi tinggi (urutan event, embedding teks) → Autoencoder: reconstruction error sebagai skor anomali. Jangan pakai autoencoder untuk data tabular sederhana — seperti memakai truk kontainer untuk belanja sayur.</p>
      <p><strong>Skenario C — clustering untuk triage, bukan vonis.</strong> 10.000 anomali dari Isolation Forest terlalu banyak di-review. Cluster menjadi 20 grup → investigator memeriksa <em>perwakilan tiap cluster</em>. Sering ditemukan: 3 cluster = pola fraud jelas (blokir massal), 12 cluster = perilaku unik tapi legit (whitelist), 5 cluster = abu-abu. Clustering mengubah 10.000 keputusan menjadi <strong>20 keputusan</strong>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>anomali ≠ fraud</strong> — anomali = &ldquo;tidak biasa&rdquo;, fraud = &ldquo;jahat&rdquo;. Sultan yang belanja Rp500jt/tahun adalah anomali statistik tapi pelanggan terbaikmu. Unsupervised menemukan yang <em>aneh</em>; investigator (dan label) menentukan yang <em>jahat</em>. Jangan pernah auto-block dari skor unsupervised murni.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Toko Fiktif & Settlement Aneh"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Merchant Fiktif Ketahuan dari Pola Settlement</h2>
      <p>Modus yang merugikan agregator pembayaran lokal: &ldquo;merchant&rdquo; fiktif mendaftarkan toko online abal-abal, lalu menggesek kartu-kartu curian di tokonya sendiri — dana settlement mengalir ke rekeningnya sebagai &ldquo;hasil penjualan&rdquo; yang sah. Tidak ada label fraud di awal: kartu-kartunya baru dilaporkan hilang berminggu-minggu kemudian.</p>
      <p><strong>Yang ditemukan clustering + Isolation Forest</strong> (pola umum dari temuan sejenis):</p>
      <ol>
        <li><strong>Settlement velocity ekstrem:</strong> merchant umur 12 hari dengan settlement Rp380jt — vs median merchant seumur Rp4jt (95× lipat).</li>
        <li><strong>Ticket size seragam:</strong> 95% transaksi tepat Rp1.850.000 — toko asli punya variasi nominal.</li>
        <li><strong>Jam transaksi:</strong> 80% terjadi 01.00–04.00 — toko &ldquo;online&rdquo; yang ramainya jam 2 pagi.</li>
        <li><strong>Refund rate 0%:</strong> toko dengan ratusan transaksi tanpa satu pun refund/komplain = tidak ada pelanggan sungguhan.</li>
      </ol>
      <p><strong>Angka ilustratif:</strong> 35 merchant fiktif × Rp380jt = <strong>Rp13,3 miliar</strong> settlement fraud dalam 1 kuartal — semuanya lolos dari rule &amp; model supervised karena <em>tidak ada label</em> saat itu. Ditemukan justru oleh analis yang menjalankan clustering rutin tiap minggu atas merchant baru.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Unsupervised learning sudah ketinggalan zaman sejak ada deep learning.&rdquo;<br /><strong>Yang benar:</strong> untuk <em>cold-start detection</em> dan <em>eksplorasi</em>, Isolation Forest 2008 masih mengalahkan banyak model modern — karena masalahnya bukan kecanggihan algoritma, tapi <strong>ketiadaan label</strong>. Pilih senjata sesuai medan, bukan sesuai tahun publikasi paper-nya.</p>
      </div>
""",
},

# ================================================================= FR9
CONTENT2["fr9-evaluasi"] = {
"toc_worked": ("worked", "📐 Worked Example: Confusion Matrix & Metrik Rupiah"),
"worked": """
      <h2 id="worked">📐 Worked Example: Dari Confusion Matrix ke Keputusan Bisnis</h2>
      <p>Metrik bukan hiasan laporan — tiap angka harus bisa diterjemahkan ke <strong>rupiah dan headcount</strong>. Dua contohnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: membaca confusion matrix sampai tuntas</summary>
        <p>Hasil evaluasi 7 hari (100.000 transaksi): TP = 160, FP = 640, FN = 40, TN = 99.160.</p>
        <p><strong>Langkah 1 — metrik dasar.</strong> Precision = 160/(160+640) = <strong>20%</strong>. Recall = 160/(160+40) = <strong>80%</strong>. F1 = 2×(0,2×0,8)/(0,2+0,8) = <strong>0,32</strong>. Akurasi = (160+99.160)/100.000 = <strong>99,32%</strong> — angka yang terlihat hebat dan <em>tidak berguna</em>.</p>
        <p><strong>Langkah 2 — terjemahkan ke operasional.</strong> 800 flag → dengan 10 investigator × 80 review/hari = 800/hari: <strong>pas 1 hari kerja</strong> untuk 7 hari data. Artinya kapasitas review 7× lipat lebih besar dari kebutuhan — atau: threshold bisa dilonggarkan untuk recall lebih tinggi (FR11).</p>
        <p><strong>Langkah 3 — yang disembunyikan F1.</strong> F1 = 0,32 terlihat &ldquo;jelek&rdquo;. Tapi bandingkan dengan baseline acak: flag 800 acak dari 100.000 → ekspektasi TP = 800 × 0,2% = 1,6. Model menangkap 160 = <strong>100× lebih baik dari acak</strong>. Pelajaran: di imbalance ekstrem, <strong>bandingkan dengan baseline, bukan dengan 1,0</strong>.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: memilih model dengan metrik rupiah (bukan F1)</summary>
        <p>Dua model kandidat, dievaluasi di data yang sama (100.000 transaksi, 200 fraud aktual, biaya review Rp25rb, rata-rata loss per fraud Rp1,1jt):</p>
        <p><strong>Model A:</strong> precision 35%, recall 60% → TP=120, FP=223. <strong>Model B:</strong> precision 20%, recall 85% → TP=170, FP=680.</p>
        <p><strong>Langkah 1 — hitung nilai.</strong> Nilai = (TP × Rp1,1jt) − ((TP+FP) × Rp25rb). Model A: (120 × 1,1jt) − (343 × 25rb) = Rp132jt − Rp8,6jt = <strong>Rp123,4jt</strong>. Model B: (170 × 1,1jt) − (850 × 25rb) = Rp187jt − Rp21,25jt = <strong>Rp165,75jt</strong>.</p>
        <p><strong>Langkah 2 — keputusan.</strong> Model B menang <strong>Rp42jt per 100rb transaksi</strong> meski precision-nya lebih rendah dan F1-nya (0,32 vs 0,44) lebih jelek! Karena di fraud, <strong>satu fraud tertangkap (Rp1,1jt) bernilai 44× satu review sia-sia (Rp25rb)</strong> — recall dihargai jauh lebih mahal daripada precision.</p>
        <p><strong>Langkah 3 — syaratnya.</strong> Ini hanya benar jika kapasitas review mencukupi (850 flag vs 343). Jika tim hanya mampu 400 review, Model B tidak bisa dioperasikan — dan Model A menang secara <em>operasional</em>. <strong>Metrik terbaik = metrik yang menghormati kendala operasional.</strong></p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Metrik untuk Tiap Penonton"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Satu Model, Banyak Metrik</h2>
      <p>Metrik yang tepat tergantung <em>siapa yang bertanya</em> dan <em>keputusan apa</em> yang diambil:</p>
      <p><strong>Skenario A — ROC-AUC vs PR-AUC.</strong> Data imbalance 1:500 → pakai <strong>PR-AUC</strong>. ROC-AUC terlihat bagus karena TN raksasa &ldquo;mengencerkan&rdquo; FP. Aturan praktis: jika positif &lt; 5% dari data, ROC-AUC dilarang jadi metrik utama — ia menipu (lihat mitos FR7).</p>
      <p><strong>Skenario B — lift untuk meyakinkan bisnis.</strong> Direksi tidak paham F1. Katakan: &ldquo;Di 1% skor tertinggi, fraud 40× lebih pekat daripada rata-rata&rdquo; — itu <strong>lift@1% = 40</strong>. Lift menerjemahkan kualitas model ke bahasa <em>efisiensi operasional</em>: makin tinggi lift, makin sedikit investigator untuk hasil yang sama.</p>
      <p><strong>Skenario C — metrik rupiah untuk keputusan investasi.</strong> &ldquo;Model ini menghemat Rp165jt per 100rb transaksi&rdquo; (contoh 2) adalah satu-satunya metrik yang bisa menjawab &ldquo;layak tidak tambah 5 investigator?&rdquo;. Semua metrik statistik adalah <em>proksi</em>; rupiah adalah <em>tujuan</em>. Evaluasi yang berhenti di F1 belum selesai — ia baru setengah jalan.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>evaluasi yang baik menjawab pertanyaan keputusan, bukan pertanyaan statistik.</strong> Sebelum menghitung metrik apa pun, tulis dulu keputusannya: &ldquo;model A vs B?&rdquo;, &ldquo;threshold berapa?&rdquo;, &ldquo;tambah headcount?&rdquo;. Metrik yang tidak mengubah keputusan apa pun = metrik hiasan.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Klaim Asuransi & Biaya Investigasi"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Model Deteksi Klaim Fiktif Asuransi</h2>
      <p>Perusahaan asuransi umum Indonesia menerapkan model untuk memprioritaskan investigasi klaim kendaraan. Angka operasionalnya (pola umum industri):</p>
      <ol>
        <li><strong>Volume:</strong> 12.000 klaim/bulan, estimasi 4% bermasalah (fraud/ inflated).</li>
        <li><strong>Biaya investigasi:</strong> Rp1,5jt per klaim (surveyor + bengkel rekanan verifikasi).</li>
        <li><strong>Model:</strong> precision@500 = 38% — dari 500 klaim prioritas teratas, 190 terbukti bermasalah, rata-rata nilai yang diselamatkan Rp8jt per kasus = <strong>Rp1,52 M/bulan</strong>.</li>
        <li><strong>Biaya:</strong> 500 × Rp1,5jt = Rp750jt → <strong>net Rp770jt/bulan</strong>.</li>
      </ol>
      <p><strong>Yang menarik:</strong> recall model hanya 40% (290 kasus bermasalah lolos). Direksi awalnya kecewa — sampai analis menunjukkan matematikanya: mengejar recall 80% butuh investigasi 2.000 klaim (biaya Rp3 M) untuk menyelamatkan tambahan Rp1,16 M → <strong>rugi Rp1,84 M</strong>. Titik optimal <em>bukan</em> recall maksimal, melainkan <strong>di mana rupiah marginal investigasi = rupiah marginal penyelamatan</strong>.</p>
      <p><strong>Pelajaran evaluasi:</strong> &ldquo;model kurang bagus&rdquo; (recall 40%) ternyata adalah <strong>keputusan bisnis yang optimal</strong>. Evaluasi tanpa biaya = opini; evaluasi dengan biaya = keputusan. Inilah kenapa FR9 menutup dengan rupiah, bukan dengan F1.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Akurasi 99% berarti model bagus.&rdquo;<br /><strong>Yang benar:</strong> dengan 99,8% transaksi normal, model yang memprediksi &ldquo;semua normal&rdquo; mendapat akurasi 99,8% sambil <strong>tidak menangkap satu pun fraud</strong>. Akurasi di data imbalance bukan metrik — ia <em>jebakan</em>. Lihat precision, recall, dan rupiahnya.</p>
      </div>
""",
},

# ================================================================= FR10
CONTENT2["fr10-drift"] = {
"toc_worked": ("worked", "📐 Worked Example: Menghitung PSI Manual"),
"worked": """
      <h2 id="worked">📐 Worked Example: Mengukur Drift dengan Tangan</h2>
      <p>PSI (Population Stability Index) terlihat rumit sampai kamu menghitungnya sekali secara manual. Setelah itu, ia jadi intuisi.</p>

      <details className="worked">
        <summary>📐 Contoh 1: PSI distribusi nominal transaksi (10 bin)</summary>
        <p>Distribusi <em>expected</em> (training, Januari) vs <em>actual</em> (produksi, Oktober) untuk fitur nominal — disederhanakan ke 4 bin:</p>
        <p>Bin A (&lt;Rp100rb): exp 40%, act 38%. Bin B (Rp100–500rb): exp 35%, act 30%. Bin C (Rp500rb–2jt): exp 20%, act 22%. Bin D (&gt;Rp2jt): exp 5%, act 10%.</p>
        <p><strong>Langkah 1 — rumus per bin:</strong> <Tex math={String.raw`\\text{PSI}_{bin} = (\\text{act} - \\text{exp}) \\times \\ln\\left(\\frac{\\text{act}}{\\text{exp}}\\right)`} block /></p>
        <p><strong>Langkah 2 — hitung.</strong> A: (0,38−0,40)×ln(0,38/0,40) = (−0,02)×(−0,051) = 0,001. B: (−0,05)×ln(0,30/0,35) = (−0,05)×(−0,154) = 0,0077. C: (0,02)×ln(0,22/0,20) = 0,02×0,095 = 0,0019. D: (0,05)×ln(0,10/0,05) = 0,05×0,693 = <strong>0,0347</strong>.</p>
        <p><strong>Langkah 3 — total &amp; interpretasi.</strong> PSI = 0,045. Aturan umum: &lt; 0,1 = aman; 0,1–0,25 = waspada; &gt; 0,25 = drift signifikan. <strong>0,045 = aman</strong> — tapi perhatikan: <strong>77% PSI disumbang bin D</strong> (transaksi &gt; Rp2jt berlipat ganda dari 5% ke 10%). Intuisi: PSI total &ldquo;aman&rdquo; bisa menyembunyikan <em>pergeseran berbahaya di ekor distribusi</em> — dan ekor itulah tempat fraud tinggal. Selalu lihat kontribusi per bin, bukan cuma totalnya.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: drift vs serangan — membaca pola perubahan</summary>
        <p>Dua kejadian, sama-sama &ldquo;distribusi berubah&rdquo;, responsnya berlawanan:</p>
        <p><strong>Kejadian X:</strong> selama 3 minggu, proporsi transaksi &gt; Rp2jt naik perlahan 5% → 6% → 7% → 8%, tersebar di semua merchant, semua jam, semua device. <strong>Ini drift:</strong> gradual, menyebar, konsisten dengan musim (misal menjelang Lebaran daya beli naik). Respons: pantau, kalibrasi ulang threshold, jadwalkan retrain.</p>
        <p><strong>Kejadian Y:</strong> dalam 6 jam, proporsi transaksi &gt; Rp2jt melonjak 5% → 18%, terkonsentrasi di 40 merchant baru, jam 01.00–05.00, dari 200 device yang sama. <strong>Ini serangan</strong> (atau adversarial drift): tiba-tiba, terkonsentrasi, berkorelasi antar fitur. Respons: <em>bukan</em> retrain — tapi <strong>blokir darurat + investigasi</strong> (FR5 rule darurat). Me-retrain model dengan data serangan = mengajari model bahwa serangan adalah &ldquo;normal baru&rdquo;.</p>
        <p><strong>Pelajaran:</strong> deteksi drift menjawab &ldquo;<em>apakah</em> berubah&rdquo;; analisis pola menjawab &ldquo;<em>bagaimana</em> berubahnya&rdquo; — dan hanya yang kedua yang menentukan respons. Dashboard drift tanpa kolom &ldquo;konsentrasi &amp; kecepatan perubahan&rdquo; = alarm tanpa arti.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Respons terhadap Drift"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Retrain, Recalibrate, atau Rollback?</h2>
      <p>Drift terdeteksi. Tiga respons, tiga situasi:</p>
      <p><strong>Skenario A — drift gradual &amp; perilaku legit berubah (musiman).</strong> Contoh: Ramadan — jam belanja bergeser ke malam hari, false positive naik 3×. Respons: <strong>recalibrate</strong> (sesuaikan threshold &amp; kalibrasi, bukan retrain penuh) + <strong>kalender regime</strong> (FR5). Retrain penuh dengan data Ramadan akan merusak performa di bulan normal — <em>drift musiman ≠ drift permanen</em>.</p>
      <p><strong>Skenario B — drift permanen (perilaku berubah selamanya).</strong> Contoh: QRIS menggantikan tunai di warung — pola nominal &amp; frekuensi berubah struktural. Respons: <strong>retrain terjadwal</strong> dengan data baru yang cukup (≥ 3 bulan), via champion-challenger (FR18), bukan replace buta. Tandanya: PSI &gt; 0,25 bertahan &gt; 2 bulan dan analis bisnis mengonfirmasi &ldquo;dunia memang berubah&rdquo;.</p>
      <p><strong>Skenario C — performa anjlok tiba-tiba setelah deploy.</strong> Bukan drift — kemungkinan <strong>bug pipeline</strong> (fitur salah hitung, timezone bergeser, join rusak). Respons: <strong>rollback dulu, investigasi kemudian</strong>. Aturan emas: <em>jangan pernah me-retrain untuk menutupi bug</em> — model baru yang dilatih dari data rusak = kerusakan yang dilembagakan.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> model tidak kedaluwarsa karena <em>umur</em> — ia kedaluwarsa karena <strong>dunia berubah</strong>. Pertanyaan monitoring yang benar bukan &ldquo;model ini umur berapa?&rdquo; melainkan &ldquo;dunia hari ini masih sama dengan dunia saat ia dilatih?&rdquo;. PSI hanyalah cara mengukur jawaban pertanyaan itu.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Ramadan & False Positive Massal"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Model Kaget Saat Ramadan</h2>
      <p>Pola yang dialami beberapa bank &amp; e-commerce Indonesia: model fraud yang tenang 11 bulan tiba-tiba mem-flag <strong>5–8× lipat</strong> transaksi normal di minggu pertama Ramadan.</p>
      <p><strong>Yang berubah (semuanya legit):</strong> jam belanja bergeser (buka puasa–sahur menjadi prime time), nominal naik (belanja Lebaran, THR), velocity naik (borong parsel), lokasi berubah (mudik — transaksi dari kota yang &ldquo;tidak biasa&rdquo; bagi nasabah), device baru (HP baru untuk Lebaran).</p>
      <p><strong>Angka ilustratif:</strong> flag harian normal 2.000 → melonjak ke 13.000. Precision anjlok dari 22% ke 4%. Tim 30 investigator butuh 6 hari untuk membersihkan backlog — sementara 11.000 nasabah legit menunggu review dengan transaksi tertahan. Biaya: CS overload + komplain viral di media sosial (&ldquo;bank X blokir THR saya!&rdquo;).</p>
      <p><strong>Solusi yang benar (diterapkan tahun berikutnya):</strong> (1) <strong>regime calendar</strong> — 2 minggu sebelum Ramadan, threshold otomatis dilonggarkan 30% dan bobot fitur &ldquo;jam tidak wajar&rdquo; diturunkan; (2) <strong>fitur musiman</strong> — tambahkan fitur &ldquo;deviasi dari pola Ramadan tahun lalu&rdquo;, bukan dari rata-rata tahunan; (3) <strong>komunikasi</strong> — notifikasi proaktif ke nasabah: &ldquo;transaksi besar Anda mungkin ditahan sebentar, hubungi kami&rdquo;. Pelajaran: <strong>drift yang bisa diprediksi kalendernya bukan drift — ia jadwal</strong>. Yang memalukan bukan modelnya kaget, tapi timnya tidak menyiapkan kalender.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Retrain tiap bulan pasti bikin model tetap segar.&rdquo;<br /><strong>Yang benar:</strong> retrain buta tiap bulan bisa <em>merusak</em>: melatih dengan data yang terkontaminasi label-lag (FR4), menghafal serangan sementara sebagai normal, dan menutupi bug pipeline. Retrain adalah <strong>obat dengan dosis</strong> — perlu diagnosis (jenis drift apa?) sebelum resep, bukan vitamin harian.</p>
      </div>
""",
},

# ================================================================= FR11
CONTENT2["fr11-threshold"] = {
"toc_worked": ("worked", "📐 Worked Example: Threshold dari Kurva & Kapasitas"),
"worked": """
      <h2 id="worked">📐 Worked Example: Memilih Threshold Seperti Profesional</h2>
      <p>Threshold bukan angka tebakan — ia hasil perhitungan dari kurva validasi dan kendala operasional. Dua contohnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: membaca kurva alert-rate vs recall</summary>
        <p>Dari data validasi (skor model terkalibrasi), tim membuat tabel kandidat threshold:</p>
        <p>τ = 0,01 → alert rate 4,2%, recall 94%. τ = 0,03 → alert rate 2,4%, recall 88%. τ = 0,05 → alert rate 1,5%, recall 79%. τ = 0,10 → alert rate 0,7%, recall 61%. τ = 0,20 → alert rate 0,25%, recall 38%.</p>
        <p><strong>Langkah 1 — terapkan kendala kapasitas.</strong> Volume 50.000 trx/hari, 10 investigator × 80 review/hari = 800 review/hari = alert rate maksimal <strong>1,6%</strong>. Kandidat τ = 0,01 dan 0,03 <em>gugur</em> — bukan karena jelek, tapi karena <strong>tidak bisa dioperasikan</strong>.</p>
        <p><strong>Langkah 2 — pilih recall maksimal di sisa kandidat.</strong> τ = 0,05 (recall 79%) mengalahkan τ = 0,10 (61%). <strong>Threshold operasional = 0,05.</strong></p>
        <p><strong>Langkah 3 — bandingkan dengan threshold teoretis.</strong> Rumus biaya (FR7) memberi τ* = 0,022 — di bawah 0,05. Artinya: secara biaya, kita <em>ingin</em> lebih agresif (recall 88%), tapi kapasitas tidak mengizinkan. <strong>Threshold final = max(τ* biaya, τ kapasitas)</strong> — biaya bilang 0,022, kapasitas bilang 0,05, maka 0,05. Pelajaran: threshold adalah <em>negosiasi</em> antara matematika biaya dan realitas SDM — dan pemenangnya adalah yang lebih ketat.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: dua threshold — auto-block, review, auto-approve</summary>
        <p>Satu threshold membuang informasi: skor 0,06 dan skor 0,95 diperlakukan sama (&ldquo;review&rdquo;). Desain yang lebih baik memakai <strong>dua ambang</strong>:</p>
        <p><strong>Langkah 1 — tentukan τ_block.</strong> Dari kurva: pada τ = 0,70, precision = 82% — dari 100 yang diblokir, 82 benar fraud. Biaya 18 kesalahan blokir (kompensasi + CS) masih jauh di bawah nilai 82 fraud dicegah. → <strong>skor ≥ 0,70: auto-block</strong>.</p>
        <p><strong>Langkah 2 — tentukan τ_review.</strong> τ = 0,05 dari contoh 1 (batas kapasitas). → <strong>0,05 ≤ skor &lt; 0,70: review manual</strong>.</p>
        <p><strong>Langkah 3 — sisanya.</strong> Skor &lt; 0,05: <strong>auto-approve</strong> — tapi <em>catat &amp; sampling</em> 0,1% untuk audit blind spot (FR4).</p>
        <p><strong>Hasil operasional:</strong> dari 50.000 trx/hari: ~120 auto-block (precision 82%), ~680 review (pas kapasitas 800), sisanya lewat. Investigator tidak lagi membuang waktu untuk skor 0,95 yang &ldquo;sudah jelas&rdquo; — <strong>dua threshold mengubah antrian dari FIFO menjadi triage medis</strong>: yang kritis langsung operasi, yang sedang observasi, yang sehat pulang.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Threshold Dinamis"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Kapan Satu Threshold Tidak Cukup</h2>
      <p>Threshold global itu seperti satu ukuran sepatu untuk semua orang. Tiga skenario yang butuh lebih:</p>
      <p><strong>Skenario A — threshold per segmen nominal.</strong> Transaksi Rp50rb vs Rp50jt punya C_FN berbeda 1.000× lipat — rumus τ* (FR7) memberi ambang berbeda. Praktik: 3 tier (mikro &lt; Rp500rb: longgar; menengah: standar; besar &gt; Rp10jt: ketat). <em>Jangan</em> buat 50 segmen — tiap segmen butuh data validasi sendiri, dan segmen kecil = threshold tidak stabil.</p>
      <p><strong>Skenario B — threshold dinamis mengikuti serangan.</strong> Saat serangan terkoordinasi terdeteksi (flag rate naik 5× dalam 1 jam), turunkan threshold sementara 50% selama 4 jam — <em>mode darurat</em>. Ini kebalikan dari intuisi (&ldquo;kan kapasitas terbatas?&rdquo;): saat serangan, <strong>P(fraud|flag) naik drastis</strong> (FR2, contoh Bayes) sehingga tiap slot review jauh lebih berharga. Setelah serangan reda, kembalikan. Tanpa mode darurat, sistem &ldquo;tenang&rdquo; saat seharusnya &ldquo;siaga&rdquo;.</p>
      <p><strong>Skenario C — threshold vs kapasitas: negosiasi kuartalan.</strong> Jika threshold kapasitas (0,05) jauh lebih ketat dari threshold biaya (0,022), selisihnya = <strong>uang yang tertinggal di meja</strong>: fraud yang <em>menguntungkan untuk ditangkap</em> tapi tidak tertangkap karena kurang investigator. Hitung nilainya dalam rupiah (FR9) dan bawa ke direksi sebagai <em>business case</em> tambah headcount — bukan keluhan, tapi proposal investasi.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> threshold bukan angka sakti yang &ldquo;ditemukan&rdquo; sekali lalu abadi — ia <strong>kontrak dengan kapasitas</strong> yang dinegosiasi ulang tiap kuartal, tiap ada serangan, tiap ada perubahan biaya. Tim yang me-review threshold-nya berkala mengalahkan tim dengan model lebih bagus tapi threshold usang.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Weekend Attack & Antrian Meledak"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Serangan Sabtu Dini Hari</h2>
      <p>Pola yang dikenali tim fraud beberapa bank Indonesia: serangan terkoordinasi <strong>Sabtu 01.00–05.00</strong> — jam dengan investigator paling sedikit (shift malam weekend = 3 orang vs 15 di jam kerja).</p>
      <p><strong>Anatomi serangan (ilustratif):</strong> 02.10: 400 kartu curian mulai dipakai serentak, pola sama (e-commerce, nominal Rp1,8–2,2jt). Sistem dengan threshold normal mem-flag 380 → antrian 3 investigator langsung penuh (kapasitas 240/jam). 02.40: antrian 900+, SLA jebol. 03.00: pelaku sudah meraup ±Rp700jt sebelum tim darurat bangun.</p>
      <p><strong>Yang seharusnya terjadi (mode darurat threshold):</strong> (1) <strong>detektor serangan</strong>: flag rate &gt; 3× baseline 30 menit → otomatis aktifkan mode darurat; (2) <strong>threshold darurat</strong>: τ_block sementara diturunkan + pola serangan (merchant + nominal + jam yang sama) jadi rule auto-block sementara; (3) <strong>on-call</strong>: investigator cadangan dipanggil otomatis, bukan menunggu seseorang &ldquo;sadar&rdquo;.</p>
      <p><strong>Pelajaran:</strong> penjahat <em>membaca jadwal shiftmu</em> — mereka menyerang saat pertahanan paling tipis. Threshold statis = pertahanan yang tidak tahu hari Sabtu ada. Sistem yang baik punya <strong>dua kepribadian</strong>: tenang di hari kerja, siaga di jam sepi. Dan kepribadian siaga itu = threshold dinamis + detektor serangan + on-call — bukan sekadar angka.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Threshold 0,5 itu netral dan adil.&rdquo;<br /><strong>Yang benar:</strong> 0,5 hanya &ldquo;netral&rdquo; jika biaya salah positif = biaya salah negatif — yang <em>tidak pernah</em> terjadi di fraud (selisihnya 40×+). Threshold 0,5 di fraud bukan netral — ia <strong>keputusan bisnis yang ekstrem</strong> (sangat permisif) yang diambil tanpa sadar. Setiap threshold adalah keputusan; pastikan ia keputusan yang disengaja.</p>
      </div>
""",
},

# ================================================================= FR12
CONTENT2["fr12-graph-analytics"] = {
"toc_worked": ("worked", "📐 Worked Example: Menemukan Ring dari 6 Node"),
"worked": """
      <h2 id="worked">📐 Worked Example: Menghitung Sinyal Graph dengan Tangan</h2>
      <p>Graph analytics terdengar canggih sampai kamu menghitungnya manual untuk 6 node — lalu polanya menjadi intuisi permanen.</p>

      <details className="worked">
        <summary>📐 Contoh 1: shared-device — 6 rekening, 2 device</summary>
        <p>Data: rekening R1–R6. Device D1 dipakai R1, R2, R3. Device D2 dipakai R4, R5, R6. R2 juga pernah login dari D2.</p>
        <p><strong>Langkah 1 — bangun graph bipartit.</strong> Node: 6 rekening + 2 device. Edge: R1–D1, R2–D1, R3–D1, R4–D2, R5–D2, R6–D2, R2–D2.</p>
        <p><strong>Langkah 2 — hitung fitur.</strong> <em>device_count(R)</em>: R1=1, R3=1, R4=1, R5=1, R6=1, <strong>R2=2</strong> (jembatan!). <em>device_sharing(D)</em>: D1 dipakai 3 rekening, D2 dipakai 4 rekening.</p>
        <p><strong>Langkah 3 — baca polanya.</strong> R2 adalah <strong>jembatan</strong> antara dua cluster — dalam investigasi nyata, ini pola &ldquo;operator&rdquo; yang mengelola dua batch rekening mule. Tanpa graph, R2 terlihat seperti nasabah biasa dengan 2 device (wajar!). Dengan graph, ia penghubung dua komunitas mencurigakan.</p>
        <p><strong>Langkah 4 — skor risiko.</strong> Aturan sederhana: <em>risk(R) = jumlah tetangga-berisiko / total tetangga</em>. Jika R4, R5, R6 sudah terkonfirmasi mule, maka risk(R2) = 3/4 = <strong>0,75</strong> — R2 &ldquo;ketularan&rdquo; risiko dari jaringannya. Inilah <strong>guilt by association</strong>: bukan bukti pengadilan, tapi prioritas investigasi yang sangat efektif.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: satu iterasi label propagation</summary>
        <p>Graph rantai pencucian: A(terkonfirmasi jahat) → B → C → D, plus E (nasabah biasa) → C (kebetulan transfer ke C untuk jual-beli motor).</p>
        <p><strong>Langkah 1 — inisialisasi.</strong> Label: A=1 (jahat), E=0 (bersih), B/C/D = belum tahu (0,5).</p>
        <p><strong>Langkah 2 — iterasi 1 (rata-rata tetangga).</strong> B = rata-rata(A=1) = 1,0. C = rata-rata(B=0,5, E=0) = 0,25. D = rata-rata(C=0,5) = 0,5.</p>
        <p><strong>Langkah 3 — iterasi 2.</strong> B = 1,0 (tetap). C = rata-rata(B=1,0, E=0) = <strong>0,5</strong>. D = rata-rata(C=0,25) = 0,25.</p>
        <p><strong>Interpretasi:</strong> risiko &ldquo;mengalir&rdquo; dari A ke D tetapi <strong>melemah dengan jarak</strong> (1,0 → 0,5 → 0,25) — dan E yang bersih <em>menarik turun</em> skor C. Inilah kenapa label propagation butuh <strong>iterasi terbatas + damping</strong>: tanpa itu, seluruh graph akan &ldquo;ketularan&rdquo; dan E yang tidak bersalah ikut tercemar. Pelajaran praktis: batasi propagasi 2–3 hop dan selalu gabungkan dengan fitur tabular — graph memberi <em>konteks</em>, bukan vonis.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Kapan Graph Dibutuhkan"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Graph vs Tabular</h2>
      <p>Graph itu mahal (infra, komputasi, keahlian). Tiga skenario kapan ia layak — dan kapan tidak:</p>
      <p><strong>Skenario A — layak: fraud terorganisir (sindikat).</strong> Ciri: banyak entitas, berbagi resource (device, rekening, alamat), pola fan-in/fan-out. Contoh: 500 KTP dari 3 device (FR6), jaringan mule judol (FR1). Di sini graph bukan opsional — <strong>tanpa graph kamu hanya melihat daun, bukan hutannya</strong>. ROI: satu ring yang terbongkar = ratusan kasus sekaligus.</p>
      <p><strong>Skenario B — tidak layak: fraud individual oportunis.</strong> Kartu curian dipakai satu orang untuk belanja pribadi — tidak ada jaringan. Graph tidak menambah apa-apa selain biaya komputasi. Model tabular + velocity sudah cukup. Aturan: <strong>jangan bayar harga graph untuk masalah yang tidak punya struktur jaringan</strong>.</p>
      <p><strong>Skenario C — real-time graph query vs batch.</strong> Query &ldquo;apakah device ini dipakai 10 rekening lain?&rdquo; butuh graph database (Neo4j/Memgraph) untuk &lt; 50ms. Tapi <em>community detection</em> &amp; label propagation cukup batch harian — hasilnya disimpan sebagai fitur di feature store (FR13). Praktik terbaik: <strong>online untuk lookup 1–2 hop, batch untuk analisis komunitas</strong>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> penjahat bisa ganti <em>identitas</em> (nama, KTP, nomor HP) dalam sehari — tapi sulit mengganti <em>jaringannya</em> (device, rekening penampung, pola aliran). Graph menyerang <strong>hal yang paling mahal diganti musuh</strong>. Itulah kenapa ia senjata anti-sindikat terbaik.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Sindikat Pinjol Ilegal & Graph Device"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Membongkar &ldquo;Pabrik Pengajuan&rdquo; Pinjol</h2>
      <p>Temuan tim risk P2P lending (pola umum 2023–2025): aplikasi pinjaman diserbu ribuan pengajuan yang <em>terlihat</em> independen — nama berbeda, KTP berbeda, selfie berbeda. Model tabular memberi skor rendah karena tiap pengajuan individual &ldquo;wajar&rdquo;.</p>
      <p><strong>Yang ditemukan analisis graph:</strong> 2.300 pengajuan dalam 30 hari terhubung ke hanya <strong>41 device</strong> — rata-rata 56 pengajuan per device. Lebih dalam: device-device itu berbagi pola: jam pengajuan sama (09.00–17.00, &ldquo;jam kerja&rdquo; sindikat), versi aplikasi sama, dan 80% KTP-nya berasal dari 3 kabupaten yang sama.</p>
      <p><strong>Angka ilustratif:</strong> 2.300 × Rp2,5jt = <strong>Rp5,75 miliar</strong> eksposur dari satu &ldquo;pabrik&rdquo;. Setelah device-device itu di-blacklist + graph query real-time (&ldquo;tolak jika device pernah dipakai &gt; 5 KTP berbeda&rdquo;), pengajuan dari pola ini turun 94% dalam 2 minggu — sindikat pindah ke platform lain yang belum punya pertahanan graph.</p>
      <p><strong>Pelajaran:</strong> tiap pengajuan <em>individual</em> lolos semua rule tabular — karena sindikat tahu cara terlihat &ldquo;normal&rdquo; satu per satu. Yang tidak bisa mereka sembunyikan: <strong>mereka berbagi infrastruktur</strong>. Graph adalah satu-satunya lensa yang melihat <em>kolektivitas</em> — dan kolektivitas adalah definisi sindikat.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Graph analytics butuh GNN deep learning.&rdquo;<br /><strong>Yang benar:</strong> 80% nilai graph di fraud datang dari <strong>fitur sederhana</strong>: degree, shared-device count, 2-hop risk propagation (seperti contoh di atas). GNN baru dibutuhkan untuk pola sangat kompleks — dan butuh data + keahlian besar. Mulai dari graph feature engineering; naik ke GNN hanya jika fitur sederhana mentok.</p>
      </div>
""",
},

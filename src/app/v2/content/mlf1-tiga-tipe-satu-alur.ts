import type { V2Lesson } from "../lib/types";

export const mlf1: V2Lesson = {
  slug: "mlf1-tiga-tipe-satu-alur",
  track: "Machine Learning Finance",
  module: "Foundations — ML end-to-end in finance",
  title: "MLF1 — ML di Finance: Tiga Tipe, Satu Alur Kerja",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Machine learning di finance bukan sulap: ia adalah cara sistematis mengubah data masa lalu menjadi keputusan — siapa yang diberi kredit, transaksi mana yang diperiksa, kapan risiko naik.",
        "Tujuan lesson ini:",
        "• Menyebutkan tiga tipe machine learning dan penggunaannya di finance.",
        "• Menjelaskan workflow ML end-to-end: framing, data, fitur, model, evaluasi, threshold, monitoring.",
        "• Membedakan supervised, unsupervised, dan reinforcement learning lewat contoh kredit, fraud, dan trading.",
        "• Menjalankan dua lab dari nol: klasifikasi 1-NN dan deteksi anomali z-score.",
        "Isi lesson: cerita dua pelamar kredit → supervised → unsupervised → reinforcement learning → workflow 7 tahap → 2 lab → peta keputusan → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook credit scoring Septian: dataset UCI 30.000 nasabah, default rate 0,2212, test set 6.000 nasabah, Gradient Boosting ROC-AUC 0,7823, Logistic Regression ROC-AUC 0,7426.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Dua pelamar, satu keputusan — dan 12 nasabah masa lalu",
      prose: [
        "Seorang analis kredit menerima tiga pengajuan. P1: penghasilan 2,4 juta per bulan, 1 kali terlambat 90 hari. P2: penghasilan 1,7 juta, 2 kali terlambat. P3: penghasilan 4,2 juta, belum pernah terlambat. Insting berkata: P3 aman, P2 berisiko, P1 di tengah. Tapi insting tidak bisa menjelaskan kenapa — dan tidak bisa diuji.",
        "Model machine learning menjawab dengan cara yang bisa diuji: ia belajar dari 12 nasabah masa lalu yang hasilnya sudah diketahui — 7 lancar, 5 default. Base rate default di sampel kecil ini 5 dari 12, yaitu 0,4167. Bandingkan dengan notebook credit scoring: 30.000 nasabah dengan default rate 0,2212. Sampel 12 orang itu berisik; sampel 30.000 orang jauh lebih stabil. Itulah kenapa ukuran data penting — dan kenapa lesson ini dimulai dari data, bukan dari model.",
        "Di akhir lesson ini kamu akan memprediksi ketiga pelamar itu dengan 1-NN dari nol — dan hasilnya: P1 lancar, P2 default, P3 lancar. Bukan karena insting, melainkan karena tetangga terdekat masing-masing di data latih.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: model menggantikan penilaian manusia",
        type: "pitfall",
        body: "Yang benar: model mengubah penilaian menjadi sesuatu yang bisa diuji dan diaudit. Keputusan akhir — threshold, kebijakan, pengecualian — tetap milik manusia. Di credit scoring, model memberi skor; manusialah yang memutuskan ambang setuju dan tolak.",
      },
    },
    {
      id: "supervised",
      eyebrow: "Langkah 3 · Supervised learning",
      title: "Supervised: belajar dari jawaban yang sudah diketahui",
      prose: [
        "Supervised learning berarti: tiap baris data latih sudah punya label — jawabannya. Model belajar memetakan fitur ke label. Contoh: 30.000 nasabah kartu kredit, tiap nasabah berlabel default (1) atau lancar (0). Modelnya: logistic regression dan gradient boosting di notebook credit scoring.",
        "Nilai: pada test set 6.000 nasabah, Logistic Regression mencapai ROC-AUC 0,7426 dan Gradient Boosting 0,7823. Selisihnya 0,7823 dikurangi 0,7426, yaitu 0,0397. Keduanya model supervised yang sama-sama belajar dari label yang sama — bedanya di cara mereka memetakan fitur ke peluang default. ROC-AUC 0,7823 berarti: bila diambil satu nasabah default dan satu nasabah lancar secara acak, peluang model memberi skor lebih tinggi ke nasabah default adalah 0,7823. Band acuannya ada di MLF3: 0,5 sama dengan tebak acak, 0,7 sampai 0,8 lumayan, 0,8 sampai 0,9 bagus.",
        "Logistic regression — model supervised yang dipakai notebook — bekerja dengan mengubah skor menjadi probabilitas lewat fungsi sigmoid: keluarannya bukan skor mentah, melainkan log-odds, yaitu log(p dibagi (1 − p)). Koefisien tiap fitur menunjukkan arah hubungan: koefisien positif berarti fitur itu menaikkan log-odds default, negatif berarti menurunkannya. Inilah kenapa LR cocok untuk default biner: keluarannya langsung probabilitas yang bisa dikalibrasi, dipakai untuk PD, dan dihitung expected loss-nya. Pengajaran penuh LR ada di M2.",
        "Supervised tidak hanya klasifikasi. Bila jawabannya angka, tugasnya regresi: memprediksi besar kerugian (loss amount) bila nasabah default, recovery rate, exposure saat default, atau return dan volatilitas saham. Klasifikasi menjawab 'apakah terjadi?', regresi menjawab 'seberapa besar?'. Keduanya supervised — bedanya di jenis labelnya. Di M2, keduanya dipakai: klasifikasi untuk PD, regresi untuk LGD dan EAD.",
        "Gambar di bawah memakai 12 nasabah latih dari cerita pembuka: sumbu X penghasilan, sumbu Y keterlambatan 90 hari, warna hijau lancar dan merah default. Polanya langsung terlihat: nasabah dengan keterlambatan 2 kali atau lebih hampir semuanya merah. Versi bar-nya — default rate 0 persen untuk keterlambatan 0 dan 1 kali, lalu 100 persen untuk keterlambatan 2 kali dan 3 kali atau lebih — ada di langkah lab pertama. Sinyalnya kuat — tapi ingat, tiap bucket berisi: 0 kali 4 orang, 1 kali 3 orang, 2 kali 2 orang, 3+ kali 3 orang (gabungan 0–1: 7 orang).",
        "Baik atau buruk: supervised bagus bila labelnya benar dan mewakili masa depan. Label yang salah catat — misal nasabah default tercatat lancar karena restrukturisasi — meracuni model tanpa suara. Buruk bila labelnya bias: model hanya belajar dari pinjaman yang pernah disetujui, bukan dari semua pelamar. Itu selection bias, dan modul M2 membahas obatnya: reject inference.",
        "Konsekuensi selection bias itu konkret: label default hanya tersedia untuk pinjaman yang disetujui — pelamar yang ditolak tidak punya outcome yang bisa dipelajari. Performa model pada populasi yang disetujui belum tentu berlaku pada populasi yang ditolak, karena keduanya berbeda secara sistematis. M2 membahas obatnya — reject inference: extrapolation, reweighting, dan fuzzy augmentation — cara menginferensi apa yang akan terjadi pada pelamar yang ditolak. Peringatan yang sama berlaku antar kelompok: bila approval rate berbeda jauh antar kelompok nasabah, audit fairness sebelum model dipakai — audit penuhnya di M7.",
        "Mitigasi: sebelum melatih, bersihkan label (cek inkonsistensi, duplikat, definisi default yang berubah). Itu pekerjaan L0 Data Cleaning. Selama melatih, pisahkan data test yang tidak pernah dilihat model — notebook memakai 6.000 nasabah test dari 30.000 — supaya skor evaluasi jujur. Satu catatan untuk metode berbasis jarak seperti 1-NN: jarak Euclidean sensitif terhadap skala fitur, fitur kategorikal, dan outlier — standardisasi dan encoding yang tepat adalah prasyaratnya, dan detailnya di L0.",
      ],
      formula: String.raw`d = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}`,
      formulaNote: "Jarak Euclidean antara dua nasabah: selisih penghasilan dan selisih keterlambatan dikuadratkan, dijumlah, lalu diakarkan. 1-NN memprediksi label tetangga terdekat menurut jarak ini.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Scatter 12 nasabah latih: hijau lancar, merah default; 3 pelamar baru berbentuk berlian">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Nasabah kartu kredit: pendapatan vs keterlambatan</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="155.5" y1="206" x2="155.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="155.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<line x1="362.5" y1="206" x2="362.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5</text>
<line x1="48" y1="188.4" x2="52" y2="188.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="191.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="153.2" x2="52" y2="153.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="156.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<line x1="48" y1="82.8" x2="52" y2="82.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="85.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<line x1="48" y1="47.6" x2="52" y2="47.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="50.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">pendapatan (juta/bulan)</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">keterlambatan 90 hari</text>
<circle cx="207.2" cy="188.4" r="6" fill="var(--c3)"/>
<circle cx="259.0" cy="188.4" r="6" fill="var(--c3)"/>
<circle cx="238.3" cy="153.2" r="6" fill="var(--c3)"/>
<circle cx="362.5" cy="188.4" r="6" fill="var(--c3)"/>
<circle cx="176.2" cy="118.0" r="6" fill="var(--c4)"/>
<circle cx="134.8" cy="82.8" r="6" fill="var(--c4)"/>
<circle cx="155.5" cy="118.0" r="6" fill="var(--c4)"/>
<circle cx="310.8" cy="153.2" r="6" fill="var(--c3)"/>
<circle cx="103.8" cy="47.6" r="6" fill="var(--c4)"/>
<circle cx="414.2" cy="188.4" r="6" fill="var(--c3)"/>
<circle cx="217.6" cy="153.2" r="6" fill="var(--c3)"/>
<circle cx="145.1" cy="82.8" r="6" fill="var(--c4)"/>
<rect x="189.9" y="146.2" width="14" height="14" fill="none" stroke="var(--c2)" stroke-width="2.5" transform="rotate(45 196.9 153.2)"/>
<text x="196.9" y="141.2" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">P1</text>
<rect x="117.4" y="111.0" width="14" height="14" fill="none" stroke="var(--c2)" stroke-width="2.5" transform="rotate(45 124.4 118.0)"/>
<text x="124.4" y="106.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">P2</text>
<rect x="376.2" y="181.4" width="14" height="14" fill="none" stroke="var(--c2)" stroke-width="2.5" transform="rotate(45 383.2 188.4)"/>
<text x="383.2" y="176.4" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">P3</text>
<circle cx="60" cy="224" r="5" fill="var(--c3)"/><text x="70" y="227" font-size="10" fill="var(--text)" font-family="var(--font-ui)">lancar (0)</text>
<circle cx="140" cy="224" r="5" fill="var(--c4)"/><text x="150" y="227" font-size="10" fill="var(--text)" font-family="var(--font-ui)">default (1)</text>
<text x="232" y="227" font-size="10" fill="var(--text)" font-family="var(--font-ui)">◆ = pelamar baru P1–P3</text>
</svg>`,
        alt: "Scatter 12 nasabah latih: hijau lancar, merah default; 3 pelamar baru berbentuk berlian.",
        caption: "Cara membaca: tiap titik satu nasabah; X penghasilan, Y keterlambatan 90 hari. Interpretasi: titik merah menumpuk di keterlambatan 2 ke atas — keterlambatan adalah sinyal default yang kuat di sampel ini.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: makin banyak fitur, makin bagus",
        type: "pitfall",
        body: "Yang benar: fitur yang salah justru menambah noise. Satu fitur yang bermakna bisnis — riwayat keterlambatan — sering mengalahkan sepuluh fitur yang asal ada. Feature engineering dibahas di M2.",
      },
    },
    {
      id: "unsupervised",
      eyebrow: "Langkah 4 · Unsupervised learning",
      title: "Unsupervised: mencari pola tanpa label",
      prose: [
        "Unsupervised learning berarti: data tidak punya label, dan tugasnya menemukan struktur — kelompok, atau sesuatu yang menyimpang. Tidak ada jawaban benar untuk dicocokkan; yang ada hanya pola yang berguna atau tidak.",
        "Nilai: pada lab kedua lesson ini, 15 transaksi diperiksa dengan z-score. Rata-ratanya 733,47 dan simpangan bakunya 1523,95 — simpangan baku yang besar menandakan ada nilai ekstrem. Dua transaksi ter-flag sebagai anomali: 5.000 dengan z 2,80 dan 4.200 dengan z 2,27. Keduanya lebih dari 2 simpangan baku di atas rata-rata. Tanpa label fraud sama sekali, statistik sederhana ini sudah menyaring 2 dari 15 transaksi untuk diperiksa manusia.",
        "Gambar di bawah menunjukkan clustering: tiga gugus titik tanpa label, plus satu titik terpencil di pojok. Clustering menjawab: transaksi mana yang mirip satu sama lain. Anomaly detection menjawab: transaksi mana yang tidak mirip siapa pun. Keduanya unsupervised — dan keduanya adalah pintu masuk deteksi fraud sebelum ada label, yang didalami di M3.",
        "Baik atau buruk: unsupervised bagus bila polanya stabil dan bisa dijelaskan — misal satu gugus ternyata transaksi tengah malam dari satu device. Buruk bila gugusnya artefak: beda skala fitur, bukan beda perilaku. Contoh: clustering tanpa normalisasi akan mengelompokkan berdasarkan nominal transaksi saja, karena nominal angkanya jauh lebih besar dari jam transaksi.",
        "Mitigasi: normalisasi fitur sebelum clustering, dan selalu validasi hasil dengan domain knowledge — tanyakan ke analis fraud apakah gugus itu masuk akal. Anomali yang ter-flag bukan vonis; ia antrean untuk diperiksa manusia.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Tiga gugus titik tanpa label plus satu titik terpencil">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Clustering: tiga kelompok tanpa label</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="155.5" y1="206" x2="155.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="155.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<line x1="362.5" y1="206" x2="362.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">8</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">fitur 1</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">fitur 2</text>
<circle cx="101.1" cy="69.0" r="5" fill="var(--c1)"/>
<circle cx="152.8" cy="80.8" r="5" fill="var(--c1)"/>
<circle cx="98.7" cy="74.9" r="5" fill="var(--c1)"/>
<circle cx="140.8" cy="59.5" r="5" fill="var(--c1)"/>
<circle cx="101.3" cy="91.1" r="5" fill="var(--c1)"/>
<circle cx="146.1" cy="67.7" r="5" fill="var(--c1)"/>
<circle cx="165.3" cy="61.0" r="5" fill="var(--c1)"/>
<circle cx="127.3" cy="77.6" r="5" fill="var(--c1)"/>
<circle cx="189.5" cy="77.8" r="5" fill="var(--c1)"/>
<circle cx="318.3" cy="80.2" r="5" fill="var(--c3)"/>
<circle cx="338.8" cy="63.3" r="5" fill="var(--c3)"/>
<circle cx="328.6" cy="66.0" r="5" fill="var(--c3)"/>
<circle cx="343.0" cy="56.1" r="5" fill="var(--c3)"/>
<circle cx="362.2" cy="62.4" r="5" fill="var(--c3)"/>
<circle cx="294.9" cy="55.9" r="5" fill="var(--c3)"/>
<circle cx="303.6" cy="67.5" r="5" fill="var(--c3)"/>
<circle cx="302.3" cy="65.2" r="5" fill="var(--c3)"/>
<circle cx="318.5" cy="62.4" r="5" fill="var(--c3)"/>
<circle cx="310.0" cy="171.4" r="5" fill="var(--c2)"/>
<circle cx="252.7" cy="188.3" r="5" fill="var(--c2)"/>
<circle cx="226.4" cy="162.1" r="5" fill="var(--c2)"/>
<circle cx="231.0" cy="165.9" r="5" fill="var(--c2)"/>
<circle cx="235.5" cy="184.1" r="5" fill="var(--c2)"/>
<circle cx="246.3" cy="181.5" r="5" fill="var(--c2)"/>
<circle cx="276.7" cy="177.5" r="5" fill="var(--c2)"/>
<circle cx="249.1" cy="170.8" r="5" fill="var(--c2)"/>
<circle cx="255.3" cy="178.7" r="5" fill="var(--c2)"/>
<circle cx="445.3" cy="188.4" r="6" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<text x="445.3" y="176.4" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">outlier?</text>
</svg>`,
        alt: "Tiga gugus titik tanpa label plus satu titik terpencil.",
        caption: "Cara membaca: titik yang berdekatan dianggap mirip. Interpretasi: tiga gugus = tiga pola perilaku; titik terpencil di pojok kanan bawah = kandidat anomali untuk diperiksa, bukan otomatis fraud.",
      },
      tasks: [],
      note: {
        title: "Tip: unsupervised dulu sebelum supervised",
        body: "Saat label belum ada atau mahal, mulai dari unsupervised: clustering dan anomaly detection memberi peta wilayah sebelum kamu meminta manusia memberi label. Label yang diberi ke wilayah yang sudah dipetakan jauh lebih konsisten.",
      },
    },
    {
      id: "rl",
      eyebrow: "Langkah 5 · Reinforcement learning",
      title: "Reinforcement learning: belajar dari reward, bukan label",
      prose: [
        "Reinforcement learning berarti: tidak ada label, tidak ada jawaban benar per baris — yang ada agen yang mengambil aksi, menerima reward, dan belajar memaksimalkan reward jangka panjang. Cocok untuk keputusan berurutan: trading, penetapan harga dinamis, penjadwalan.",
        "Nilai: contoh agen trading dengan tiga aksi — beli, jual, tahan. Reward satu langkah didefinisikan sebagai profit dikurangi setengah risiko: reward = profit − 0,5 × risiko. Misal aksi beli menghasilkan profit 0,08 dengan risiko 0,10, maka reward = 0,08 − 0,5 × 0,10 = 0,03. Aksi tahan memberi profit 0 dengan risiko 0, maka reward 0. Agen memilih beli karena 0,03 lebih besar dari 0. Angka 0,5 di sini adalah pilihan desain — seberapa takut risiko agen itu — bukan hukum alam.",
        "Satu peringatan untuk data berwaktu: harga saham dan return adalah time series — pengamatan hari ini bergantung pada kemarin, bukan sampel independen yang bisa diacak. Model yang dilatih dengan split acak pada data seperti ini bisa mengintip masa depan lewat tetangga waktunya. Aturan yang sama dengan validasi kredit: latih di masa lalu, uji di masa depan. Pendalamannya di M4 (regime dan volatilitas) dan M9 (walk-forward validation).",
        "Gambar di bawah menunjukkan loop-nya: state (posisi portofolio) → aksi (beli, jual, tahan) → reward (profit dikurangi risiko) → state berikutnya (harga bergerak). Loop ini berulang ribuan kali di simulasi sebelum agen dipakai.",
        "Baik atau buruk: reinforcement learning bagus bila reward benar-benar mencerminkan tujuan bisnis dan lingkungan simulasinya mirip pasar nyata. Buruk bila reward-nya bisa diakali — agen menemukan celah simulator yang tidak ada di pasar nyata. Itu disebut reward hacking: skor naik, uang nyata hilang.",
        "Mitigasi: desain reward bersama orang yang paham bisnis, tambahkan penalti risiko secara eksplisit, dan uji agen di data yang tidak pernah dilihatnya selama latihan — termasuk periode krisis. Reinforcement learning untuk trading didalami di M4.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Diagram loop: state, aksi, reward, state berikutnya">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Reinforcement learning: loop state-aksi-reward</text>

<rect x="30" y="90" width="110" height="52" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="85.0" y="110" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">STATE</text><text x="85.0" y="126" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">posisi portofolio</text>
<rect x="190" y="90" width="110" height="52" rx="8" fill="none" stroke="var(--c3)" stroke-width="2"/><text x="245.0" y="110" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">AKSI</text><text x="245.0" y="126" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">beli / jual / tahan</text>
<rect x="350" y="90" width="100" height="52" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/><text x="400.0" y="110" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">REWARD</text><text x="400.0" y="126" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">profit − risiko</text>
<line x1="140" y1="116" x2="190" y2="116" stroke="var(--chart-text)" stroke-width="1.5"/><polygon points="190,116 182,112 182,120" fill="var(--chart-text)"/>
<line x1="300" y1="116" x2="350" y2="116" stroke="var(--chart-text)" stroke-width="1.5"/><polygon points="350,116 342,112 342,120" fill="var(--chart-text)"/>
<path d="M 400 142 L 400 190 L 85 190 L 85 142" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="85,142 81,150 89,150" fill="var(--chart-text)"/>
<text x="242" y="182" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">state berikutnya (harga bergerak)</text>
</svg>`,
        alt: "Diagram loop: state, aksi, reward, state berikutnya.",
        caption: "Cara membaca: ikuti panah searah jarum jam. Interpretasi: agen tidak belajar dari label benar-salah, melainkan dari reward yang diterimanya setelah tiap aksi.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: reinforcement learning = supervised yang lebih canggih",
        type: "pitfall",
        body: "Yang benar: keduanya belajar dari sinyal yang berbeda. Supervised belajar dari label per baris; reinforcement belajar dari reward yang sering datang belakangan dan jarang. Model supervised yang bagus tidak otomatis menjadi agen yang bagus.",
      },
    },
    {
      id: "workflow",
      eyebrow: "Langkah 6 · Workflow end-to-end",
      title: "Satu alur kerja: framing sampai monitoring",
      prose: [
        "Tiga tipe ML di atas hanyalah komponen. Yang membuat mereka berguna adalah alur kerja end-to-end: framing, data, fitur, model, evaluasi, threshold, monitoring. Tujuh tahap, berurutan, dan tiap tahap punya keputusan bisnis.",
        "Framing: ubah masalah bisnis menjadi pertanyaan ML. Notebook credit scoring: siapa yang boleh diberi kredit? menjadi klasifikasi biner default atau lancar. Data: 30.000 nasabah UCI, default rate 0,2212. Fitur: utilisasi limit, riwayat keterlambatan, jumlah tagihan — fitur yang bermakna bisnis, bukan sekadar kolom yang tersedia. Model: mulai dari logistic regression (ROC-AUC 0,7426) lalu gradient boosting (0,7823). Evaluasi: ROC-AUC dan PR-AUC 0,5597 dibaca relatif terhadap base rate 0,2212. Threshold: 0,10 — bukan 0,5 default — karena biaya salah menolak berbeda dari biaya salah menyetujui. Monitoring: performa model di data baru dipantau terus; bila bergeser, model dilatih ulang.",
        "Sebelum model apa pun, framing kredit harus menjawab empat hal. Satu, unit observasi: satu baris = satu aplikasi, satu rekening, atau satu nasabah? Dua, definisi label: apa itu 'default' — terlambat berapa hari, dalam horizon berapa lama? Tiga, observation window: fitur hanya boleh diambil dari informasi yang tersedia pada tanggal aplikasi — saldo tunggakan setelah tanggal itu adalah masa depan, bukan fitur. Empat, performance window: outcome diamati setelah jendela itu berlalu; aplikasi yang belum cukup lama diamati belum punya label yang sah. 'Default' bukan 'late payment', bukan 'fraud', bukan 'bad account' — ketiganya label yang berbeda dengan konsekuensi yang berbeda. Horizon yang dipakai harus didefinisikan di framing — bukan ditebak belakangan. Gambar di bawah menunjukkan tiga waktu ini.",
        "Dari skor ke keputusan, alurnya berantai: model mengeluarkan skor (ranking) → skor dikalibrasi menjadi probabilitas default (PD) → PD dibandingkan dengan threshold 0,10 [notebook] → keputusan approve, review, atau reject → biaya FN/FP dihitung dari keputusan itu. Model tidak otomatis menghasilkan keputusan: threshold dan kebijakan adalah pilihan manusia yang memakai skor sebagai input. Di MLF3, rantai ini dihitung penuh dengan confusion matrix 6.000 nasabah [mini-case].",
        "Leakage sebelum model dilatih. Leakage berarti informasi masa depan bocor ke fitur atau ke data latih — dan ia berbeda dari overfitting. Contoh yang paling sering terjadi di kredit: saldo atau status tunggakan setelah tanggal aplikasi dipakai sebagai fitur; fitur yang baru tersedia setelah kredit disetujui (misal perilaku pembayaran bulan pertama); imputasi atau scaling dihitung pada seluruh data sebelum split, sehingga statistik test ikut mengajari train; random split pada data berwaktu, sehingga baris masa depan masuk ke train. Leakage bukan overfitting (model menghafal data latih), bukan distribution shift (populasi berubah), bukan sampling noise (undian split yang sial). Bedanya: overfitting masih bisa dideteksi dari gap train-test — leakage tidak, karena test ikut bocor dan skornya tampak tinggi di kedua sisi. Gap kecil tidak membuktikan model bebas leakage.",
        "Gambar di bawah merangkum ketujuh tahap. Perhatikan: model hanyalah tahap keempat dari tujuh. Sebagian besar pekerjaan ML finance ada di luar model: framing yang salah membuat model yang benar menjawab pertanyaan yang salah.",
        "Baik atau buruk: workflow bagus bila tiap tahap punya angka dan pemilik keputusan — misal threshold 0,10 diputuskan bersama tim risiko, bukan oleh data scientist sendirian. Buruk bila ada tahap yang dilompati: model tanpa monitoring akan diam-diam memburuk saat perilaku nasabah berubah.",
        "Mitigasi: dokumentasikan tiap tahap (model card), dan jadwalkan review berkala — mingguan untuk monitoring, kuartalan untuk retraining. Validasi model dan governance dibahas di M8.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 360" role="img" aria-label="Tujuh kotak berurutan: framing, data, fitur, model, evaluasi, threshold, monitoring; plus tiga waktu framing kredit">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Workflow ML end-to-end (7 tahap)</text>

<rect x="8" y="90" width="58" height="56" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="37.0" y="112" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Framing</text>
<text x="37.0" y="128" text-anchor="middle" font-size="8.5" fill="var(--chart-text)" font-family="var(--font-ui)">masalah bisnis</text>
<line x1="66" y1="118" x2="74" y2="118" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="74,118 68,114 68,122" fill="var(--chart-text)"/>
<rect x="74" y="90" width="58" height="56" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="103.0" y="112" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Data</text>
<text x="103.0" y="128" text-anchor="middle" font-size="8.5" fill="var(--chart-text)" font-family="var(--font-ui)">30.000 baris</text>
<line x1="132" y1="118" x2="140" y2="118" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="140,118 134,114 134,122" fill="var(--chart-text)"/>
<rect x="140" y="90" width="58" height="56" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="169.0" y="112" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Fitur</text>
<text x="169.0" y="128" text-anchor="middle" font-size="8.5" fill="var(--chart-text)" font-family="var(--font-ui)">utilisasi, telat</text>
<line x1="198" y1="118" x2="206" y2="118" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="206,118 200,114 200,122" fill="var(--chart-text)"/>
<rect x="206" y="90" width="58" height="56" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="235.0" y="112" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Model</text>
<text x="235.0" y="128" text-anchor="middle" font-size="8.5" fill="var(--chart-text)" font-family="var(--font-ui)">LR → GBM</text>
<line x1="264" y1="118" x2="272" y2="118" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="272,118 266,114 266,122" fill="var(--chart-text)"/>
<rect x="272" y="90" width="58" height="56" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="301.0" y="112" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Evaluasi</text>
<text x="301.0" y="128" text-anchor="middle" font-size="8.5" fill="var(--chart-text)" font-family="var(--font-ui)">ROC-AUC 0,78</text>
<line x1="330" y1="118" x2="338" y2="118" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="338,118 332,114 332,122" fill="var(--chart-text)"/>
<rect x="338" y="90" width="58" height="56" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="367.0" y="112" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Threshold</text>
<text x="367.0" y="128" text-anchor="middle" font-size="8.5" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<line x1="396" y1="118" x2="404" y2="118" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="404,118 398,114 398,122" fill="var(--chart-text)"/>
<rect x="404" y="90" width="58" height="56" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="433.0" y="112" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Monitoring</text>
<text x="433.0" y="128" text-anchor="middle" font-size="8.5" fill="var(--chart-text)" font-family="var(--font-ui)">drift</text>
<text x="240" y="180" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Setiap tahap punya keputusan bisnis — bukan sekadar code.</text>
<line x1="52" y1="200" x2="466" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<text x="240.0" y="222" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Framing kredit: tiga waktu yang tidak boleh tertukar</text>
<rect x="30" y="236" width="125" height="52" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="92.5" y="256" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TANGGAL APLIKASI</text><text x="92.5" y="272" text-anchor="middle" font-size="9.5" fill="var(--chart-text)" font-family="var(--font-ui)">nasabah mengajukan</text>
<rect x="177" y="236" width="126" height="52" rx="8" fill="none" stroke="var(--c3)" stroke-width="2"/><text x="240.0" y="256" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">OBSERVATION WINDOW</text><text x="240.0" y="272" text-anchor="middle" font-size="9.5" fill="var(--chart-text)" font-family="var(--font-ui)">fitur diambil di sini</text>
<rect x="325" y="236" width="125" height="52" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/><text x="387.5" y="256" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PERFORMANCE WINDOW</text><text x="387.5" y="272" text-anchor="middle" font-size="9.5" fill="var(--chart-text)" font-family="var(--font-ui)">default diamati di sini</text>
<line x1="155" y1="262" x2="177" y2="262" stroke="var(--chart-text)" stroke-width="1.5"/><polygon points="177,262 169,258 169,266" fill="var(--chart-text)"/>
<line x1="303" y1="262" x2="325" y2="262" stroke="var(--chart-text)" stroke-width="1.5"/><polygon points="325,262 317,258 317,266" fill="var(--chart-text)"/>
<text x="240" y="312" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)">Saldo tunggakan SETELAH tanggal aplikasi bukan fitur — itu masa depan.</text>
<text x="240" y="330" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)">Horizon default harus didefinisikan di framing, bukan ditebak belakangan.</text>
</svg>`,
        alt: "Tujuh kotak berurutan: framing, data, fitur, model, evaluasi, threshold, monitoring; plus tiga waktu framing kredit.",
        caption: "Cara membaca: baca dari kiri ke kanan; tiap kotak satu tahap dengan contohnya dari notebook. Interpretasi: model hanya satu dari tujuh tahap — framing dan monitoring sama pentingnya. Panel bawah: tiga waktu framing kredit — tanggal aplikasi, observation window tempat fitur diambil, performance window tempat default diamati; saldo tunggakan setelah tanggal aplikasi bukan fitur.",
      },
      tasks: [],
      note: {
        title: "Tip: mulai dari baseline yang sederhana",
        body: "Sebelum gradient boosting, latih dulu logistic regression. Baseline memberi dua hal: angka pembanding yang jujur (ROC-AUC 0,7426 pada test set 6.000 nasabah) dan model yang bisa dijelaskan ke regulator. Model kompleks harus membuktikan dirinya lebih baik dari baseline — bukan sebaliknya.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab: klasifikasi 1-NN dari nol",
      prose: [
        "Sekarang giliranmu. Data latihnya 12 nasabah dari cerita pembuka; tiga pelamar baru menunggu prediksi. Algoritmanya 1-NN: untuk tiap pelamar, cari nasabah latih terdekat (jarak Euclidean) dan salin labelnya.",
        "Gambar bar di bawah menunjukkan sinyal yang dipakai model: default rate 0 persen saat keterlambatan 0 atau 1 kali, 100 persen saat 2 kali atau 3 kali lebih. Perhatikan ukuran tiap bucket: n sama dengan 4, 3, 2, dan 3. Dengan n sekecil itu, 100 persen berarti 2 dari 2 — bukan bukti sekuat 100 persen dari 2.000 orang.",
        "Skema evaluasinya eksplisit: latih 12 nasabah, test 3 pelamar baru. Akurasi 1,0000 dihitung pada 3 pelamar itu — dan itu bukti yang sangat lemah: tiga prediksi benar belum membuktikan model bagus. Baseline mayoritas yang sebanding pada test yang sama adalah 2 dari 3 lancar, yaitu 0,6667; angka 0,5833 di bawah adalah baseline train (7 lancar dari 12 data latih), bukan pembanding akurasi test.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar: default rate 0% untuk keterlambatan 0-1, 100% untuk 2 dan 3+">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Default rate per bucket keterlambatan</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="103.8" y1="206" x2="103.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="103.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="207.2" y1="206" x2="207.2" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="207.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="310.8" y1="206" x2="310.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="310.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<line x1="414.2" y1="206" x2="414.2" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="414.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3+</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">100%</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">keterlambatan 90 hari (kali)</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">default rate</text>
<text x="103.8" y="200.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0%</text>
<text x="103.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=4</text>
<text x="207.2" y="200.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0%</text>
<text x="207.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=3</text>
<rect x="282.3" y="30.0" width="56.9" height="176.0" fill="var(--c4)"/>
<text x="310.8" y="24.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">100%</text>
<text x="310.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=2</text>
<rect x="385.8" y="30.0" width="56.9" height="176.0" fill="var(--c4)"/>
<text x="414.2" y="24.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">100%</text>
<text x="414.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=3</text>
</svg>`,
        alt: "Bar: default rate 0% untuk keterlambatan 0-1, 100% untuk 2 dan 3+.",
        caption: "Cara membaca: tinggi bar = default rate per bucket keterlambatan; label n = jumlah nasabah di bucket itu. Interpretasi: sinyalnya tajam tapi tiap bucket kecil — jangan overpercaya pada 100 persen dari 2 orang.",
      },
      tasks: [
        { id: "t1", text: "Lengkapi rumus jarak Euclidean di `knn1`" },
        { id: "t2", text: "Lengkapi update `best` dan `best_d` saat jarak lebih kecil" },
        { id: "t3", text: "Jalankan dan bandingkan `preds` dengan baseline train (mayoritas)" },
      ],
      expected: "prediksi: [0, 1, 0]\nakurasi test: 1.0000\nbaseline train: 0.5833",
      hints: [
        "Jarak Euclidean: akar dari jumlah kuadrat selisih tiap fitur.",
        "Baseline train (mayoritas di data latih): 7 lancar dari 12, yaitu 0,5833.",
      ],
      code: {
        starter: `import math

# Data latih: (pendapatan_jt_per_bulan, keterlambatan_90hr, default)
# default: 1 = gagal bayar, 0 = lancar
train = [
    (2.5, 0, 0), (3.0, 0, 0), (2.8, 1, 0), (4.0, 0, 0),
    (2.2, 2, 1), (1.8, 3, 1), (2.0, 2, 1), (3.5, 1, 0),
    (1.5, 4, 1), (4.5, 0, 0), (2.6, 1, 0), (1.9, 3, 1),
]
# Tiga pelamar baru (tanpa label): siapa yang diprediksi default?
test = [(2.4, 1, 0), (1.7, 2, 1), (4.2, 0, 0)]

def knn1(data, x):
    best, best_d = None, float("inf")
    for inc, late, y in data:
        d = 0.0  # TODO: jarak Euclidean antara (inc, late) dan x
        if d < best_d:
            best_d, best = best_d, best  # TODO: update bila d lebih kecil
    return best

preds = [knn1(train, (inc, late)) for inc, late, _ in test]
print("prediksi:", preds)
acc = sum(knn1(train, (inc, late)) == y for inc, late, y in test) / len(test)
print(f"akurasi test: {acc:.4f}")
baseline = max(sum(1 for _, _, y in train if y == 0),
               sum(1 for _, _, y in train if y == 1)) / len(train)
print(f"baseline train: {baseline:.4f}")`,
        lockLines: 15,
        solution: `import math

# Data latih: (pendapatan_jt_per_bulan, keterlambatan_90hr, default)
# default: 1 = gagal bayar, 0 = lancar
train = [
    (2.5, 0, 0), (3.0, 0, 0), (2.8, 1, 0), (4.0, 0, 0),
    (2.2, 2, 1), (1.8, 3, 1), (2.0, 2, 1), (3.5, 1, 0),
    (1.5, 4, 1), (4.5, 0, 0), (2.6, 1, 0), (1.9, 3, 1),
]
# Tiga pelamar baru (tanpa label): siapa yang diprediksi default?
test = [(2.4, 1, 0), (1.7, 2, 1), (4.2, 0, 0)]

def knn1(data, x):
    best, best_d = None, float("inf")
    for inc, late, y in data:
        d = math.sqrt((inc - x[0]) ** 2 + (late - x[1]) ** 2)
        if d < best_d:
            best_d, best = d, y
    return best

preds = [knn1(train, (inc, late)) for inc, late, _ in test]
print("prediksi:", preds)
acc = sum(knn1(train, (inc, late)) == y for inc, late, y in test) / len(test)
print(f"akurasi test: {acc:.4f}")
baseline = max(sum(1 for _, _, y in train if y == 0),
               sum(1 for _, _, y in train if y == 1)) / len(train)
print(f"baseline train: {baseline:.4f}")`,
        checks: [
          { kind: "equal", task: "t3", name: "preds", value: [0, 1, 0], label: "`preds` seharusnya [0, 1, 0]", msg: "P1 dekat dengan (2,6, 1, 0); P2 dekat dengan (2,0, 2, 1); P3 dekat dengan (4,0, 0, 0)." },
          { kind: "equal", task: "t3", name: "acc", value: 1, tol: 1e-9, label: "`acc` seharusnya 1.0", msg: "Ketiga prediksi cocok dengan label test: 3 dari 3." },
          { kind: "stdout_matches", task: "t3", pattern: "akurasi test: 1\\.0000", label: "Output menampilkan akurasi test 1.0000", msg: "Format: akurasi test: {acc:.4f}." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab: deteksi anomali dengan z-score",
      prose: [
        "Tanpa label pun kamu bisa menyaring transaksi yang patut diperiksa. Z-score mengukur seberapa jauh satu nilai dari rata-rata, dalam satuan simpangan baku: z sama dengan (x dikurangi mean) dibagi sd. Aturan praktis: nilai absolut z di atas 2 layak diperiksa.",
        "Data lab ini 15 nominal transaksi. Dua di antaranya jauh lebih besar dari yang lain — dan z-score menangkap keduanya. Perhatikan: mean 733,47 ikut tertarik ke atas oleh kedua outlier itu sendiri; itulah kenapa z-score adalah penyaring awal, bukan vonis. Sebagai pembanding: z tertinggi berikutnya yang tidak ter-flag hanya −0,42 — jauh di bawah ambang |z| > 2. Untuk data skewed seperti ini, pakai median/MAD atau log-transform.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `var` (rata-rata kuadrat selisih dari mean) dan `sd`" },
        { id: "t2", text: "Hitung `flagged`: transaksi dengan |z| lebih dari 2" },
        { id: "t3", text: "Jalankan dan baca z tiap transaksi yang ter-flag" },
      ],
      expected: "mean=733.47 sd=1523.95\nflagged: [5000, 4200]\nz(5000)=2.80 z(4200)=2.27",
      hints: [
        "var = jumlah (a - mean) kuadrat untuk semua a, dibagi banyaknya data.",
        "z = (a - mean) / sd; flag bila nilai absolutnya lebih dari 2.",
      ],
      code: {
        starter: `amounts = [120, 95, 210, 88, 150, 175, 130, 99, 5000, 145, 180, 110, 4200, 160, 140]
mean = sum(amounts) / len(amounts)
var = 1.0  # TODO: rata-rata kuadrat selisih dari mean
sd = var ** 0.5
flagged = []  # TODO: transaksi dengan |z| > 2
print(f"mean={mean:.2f} sd={sd:.2f}")
print("flagged:", flagged)
print(f"z(5000)={(5000 - mean) / sd:.2f} z(4200)={(4200 - mean) / sd:.2f}")`,
        lockLines: 2,
        solution: `amounts = [120, 95, 210, 88, 150, 175, 130, 99, 5000, 145, 180, 110, 4200, 160, 140]
mean = sum(amounts) / len(amounts)
var = sum((a - mean) ** 2 for a in amounts) / len(amounts)
sd = var ** 0.5
flagged = [a for a in amounts if abs((a - mean) / sd) > 2]
print(f"mean={mean:.2f} sd={sd:.2f}")
print("flagged:", flagged)
print(f"z(5000)={(5000 - mean) / sd:.2f} z(4200)={(4200 - mean) / sd:.2f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "flagged", value: [5000, 4200], label: "`flagged` seharusnya [5000, 4200]", msg: "z(5000) = 2,80 dan z(4200) = 2,27 — keduanya di atas 2." },
          { kind: "stdout_matches", task: "t3", pattern: "flagged: \\[5000, 4200\\]", label: "Output menampilkan flagged [5000, 4200]", msg: "Cek rumus z-score dan ambang 2." },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: tipe ML apa untuk masalah apa?",
      prose: [
        "Punya label dan mau memprediksi sesuatu? Supervised — klasifikasi bila jawabannya kategori (default atau lancar), regresi bila jawabannya angka (berapa besar kerugian).",
        "Tidak punya label dan mau tahu strukturnya? Unsupervised — clustering untuk pengelompokan, anomaly detection untuk penyimpangan. Di fraud, ini langkah pertama sebelum label tersedia.",
        "Keputusan berurutan dan umpan baliknya reward? Reinforcement learning — trading, penetapan harga, penjadwalan. Harganya: butuh simulator dan reward yang dirancang hati-hati.",
        "Data kecil dan hasil harus bisa dijelaskan ke regulator? Mulai dari model sederhana yang interpretable — logistic regression — sebelum model kompleks. Notebook credit scoring membuktikan polanya: LR 0,7426 dulu, GBM 0,7823 kemudian.",
        "Tidak yakin labelmu benar? Jangan melatih dulu — bersihkan label dan datanya (L0). Model yang dilatih di atas label yang salah akan salah dengan percaya diri.",
        "Peta M2 — apa yang menanti di modul credit scoring. Scorecard: fitur mentah diubah menjadi bin, tiap bin diberi Weight of Evidence (WoE), lalu Information Value (IV) mengukur seberapa kuat fitur itu membedakan default dan lancar; skor akhirnya dijumlahkan menjadi scorecard yang bisa dijelaskan ke nasabah dan regulator. Roll-rate: migrasi status keterlambatan — current → 1–30 DPD → 31–60 DPD → 61–90 DPD → default — menunjukkan seberapa cepat tunggakan memburuk. Reject inference: karena model hanya melihat pinjaman yang disetujui, M2 mengajarkan cara menginferensi outcome pelamar yang ditolak (extrapolation, reweighting, fuzzy augmentation). Vintage analysis dan IFRS 9 staging menyusul di modul yang sama. Ini peta konsep saja — pengajaran penuhnya di M2.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: tiga pelamar, satu keputusan",
      prose: [
        "Empat istilah yang dipakai di seluruh modul kredit — definisikan sekali, pakai terus. PD (probability of default): peluang nasabah default dalam horizon yang didefinisikan. LGD (loss given default): porsi exposure yang hilang bila default terjadi. EAD (exposure at default): besar exposure saat default terjadi. Expected Loss = PD × LGD × EAD. Angka di mini-case ini adalah ilustrasi, bukan angka notebook kanonis: PD 0,5 dan 0,1, LGD 45 persen, EAD Rp10.000.000, margin 5 persen — semuanya asumsi ilustrasi [ilustrasi]. Margin bukan loss dan bukan capital: margin adalah pendapatan bila lancar; loss adalah yang hilang bila default; capital dan risk appetite menentukan seberapa besar expected loss yang boleh diambil — itu keputusan bisnis di M2 dan M8.",
        "Kembali ke tiga pelamar dari cerita pembuka. Lab 1 memprediksi: P1 lancar, P2 default, P3 lancar. Sekarang ubah prediksi menjadi keputusan dengan biaya. Asumsi ilustrasi (bukan angka notebook): limit Rp10.000.000, LGD 45 persen, margin bila lancar 5 persen dari limit.",
        "P2 diprediksi default. Bila disetujui, peluang default diilustrasikan 0,5 — expected loss = 0,5 × 45 persen × Rp10.000.000 = Rp2.250.000. Bila ia ternyata lancar, margin = 5 persen × Rp10.000.000 = Rp500.000. Kerugian yang diharapkan (Rp2.250.000) empat setengah kali margin (Rp500.000). Keputusan: tolak P2.",
        "P1 diprediksi lancar. Peluang default diilustrasikan 0,1 — expected loss = 0,1 × 45 persen × Rp10.000.000 = Rp450.000. Margin bila lancar Rp500.000. Expected loss (Rp450.000) sedikit di bawah margin (Rp500.000). Keputusan: setujui dengan syarat — misal limit lebih kecil atau monitoring lebih ketat.",
        "P3 diprediksi lancar dengan penghasilan tertinggi dan tanpa keterlambatan. Keputusan: setujui. Pelajaran mini-case ini: prediksi tanpa biaya hanyalah skor; keputusan lahir saat skor bertemu biaya. Threshold 0,10 di notebook adalah versi formal dari perhitungan yang sama.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab: bangun klasifikasi kredit mini end-to-end",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf1-guided-task.ipynb.",
        "Di notebook itu kamu membangun klasifikasi kredit mini end-to-end: memuat data, memeriksa label, melatih 1-NN dan decision stump, mengevaluasi dengan akurasi dan baseline mayoritas, lalu menuliskan keputusan untuk tiga pelamar baru — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "Buka di Colab: https://colab.research.google.com/drive/1NA4DmvLx3Tr8YPgYqkOalEJlka8SJXMD",
        "Jalur file notebook: colab/mlf1-guided-task.ipynb.",
        "Companion full-code untuk topik yang memetakan ke proyek nyata: notebook credit scoring end-to-end di Colab: https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO — di sana workflow 7 tahap lesson ini dijalankan penuh pada 30.000 nasabah.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint: tiga tipe, satu alur",
      prose: [
        "Rangkuman: supervised belajar dari label; unsupervised mencari pola tanpa label; reinforcement belajar dari reward. Workflow end-to-end punya tujuh tahap dan model hanya satu di antaranya. Angka acuan: GBM ROC-AUC 0,7823 vs LR 0,7426 pada 6.000 nasabah test.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Manakah contoh supervised learning?",
          options: [
            { text: "Mengelompokkan transaksi tanpa label", why: "Itu unsupervised: tidak ada label yang dipelajari." },
            { text: "Memprediksi default dari riwayat nasabah berlabel", why: "Benar: tiap nasabah latih punya label default atau lancar, dan model belajar memetakannya.", correct: true },
            { text: "Agen trading belajar dari reward", why: "Itu reinforcement learning: sinyalnya reward, bukan label." },
            { text: "Menghitung rata-rata return bulanan", why: "Itu statistik deskriptif, bukan machine learning." },
          ],
        },
        {
          q: "Dalam workflow ML end-to-end, tahap apa yang datang pertama?",
          options: [
            { text: "Melatih model", why: "Model adalah tahap keempat; tanpa framing dan data, model menjawab pertanyaan yang salah." },
            { text: "Framing masalah bisnis", why: "Benar: ubah dulu masalah bisnis menjadi pertanyaan ML sebelum menyentuh data.", correct: true },
            { text: "Memilih threshold", why: "Threshold adalah tahap keenam, setelah evaluasi." },
            { text: "Monitoring", why: "Monitoring adalah tahap ketujuh, setelah model dipakai." },
          ],
        },
        {
          q: "12 nasabah latih: 5 default, 7 lancar. Berapa base rate default di sampel ini?",
          options: [
            { text: "0,4167", why: "Benar: 5 dibagi 12 sama dengan 0,4167. Jangan tertukar dengan 0,2212 — itu base rate notebook 30.000 nasabah.", correct: true },
            { text: "0,5833", why: "Itu porsi lancar (7 dari 12), bukan default." },
            { text: "0,2212", why: "Itu default rate notebook UCI 30.000 nasabah, bukan sampel 12 orang ini." },
            { text: "0,5000", why: "5 dari 12 bukan setengah; hitung 5 dibagi 12." },
          ],
        },
        {
          q: "Pelamar P2 (penghasilan 1,7 juta, 2 kali terlambat) diprediksi 1-NN sebagai default. Nasabah latih mana yang paling memengaruhi prediksi itu?",
          options: [
            { text: "Nasabah (2,0 juta, 2 kali telat, default)", why: "Benar: jaraknya akar dari (0,3 kuadrat + 0 kuadrat) = 0,3 — tetangga terdekat P2, dan labelnya default.", correct: true },
            { text: "Nasabah (4,5 juta, 0 kali telat, lancar)", why: "Jaraknya jauh: selisih penghasilan 2,8 juta saja sudah besar." },
            { text: "Nasabah (1,5 juta, 4 kali telat, default)", why: "Memang default, tapi jaraknya akar dari (0,04 + 4) = 2,01 — lebih jauh dari tetangga terdekat." },
            { text: "Tidak bisa ditentukan tanpa threshold", why: "1-NN tidak memakai threshold; ia memakai jarak ke tetangga terdekat." },
          ],
        },
        {
          q: "Kapan unsupervised learning paling tepat dipakai?",
          options: [
            { text: "Saat label tersedia dan mau memprediksi", why: "Itu supervised: label adalah bahan bakarnya." },
            { text: "Saat tidak ada label dan mau menemukan pola atau anomali", why: "Benar: clustering dan anomaly detection bekerja tanpa label.", correct: true },
            { text: "Saat keputusan berurutan dan ada reward", why: "Itu reinforcement learning." },
            { text: "Saat model harus bisa dijelaskan ke regulator", why: "Itu alasan memilih model interpretable, bukan alasan memilih unsupervised." },
          ],
        },
        {
          q: "Apa yang dimaksud reward hacking pada reinforcement learning?",
          options: [
            { text: "Agen meretas sistem reward bank", why: "Bukan peretasan sistem; ini soal desain reward yang diakali agen." },
            { text: "Agen memaksimalkan reward dengan cara yang merusak tujuan bisnis", why: "Benar: skor naik di simulator, tapi uang nyata hilang karena reward-nya tidak mencerminkan tujuan.", correct: true },
            { text: "Agen lupa reward yang sudah diterima", why: "Agen justru mengingat reward — masalahnya reward-nya yang salah desain." },
            { text: "Reward terlalu kecil sehingga agen tidak belajar", why: "Itu masalah skala reward, bukan hacking." },
          ],
        },
        {
          q: "Saldo tunggakan setelah tanggal aplikasi boleh dipakai sebagai fitur?",
          options: [
            { text: "Tidak — itu informasi masa depan (leakage)", why: "Benar: fitur hanya boleh memakai informasi yang tersedia pada tanggal aplikasi; data setelah itu adalah outcome, bukan fitur.", correct: true },
            { text: "Boleh — makin banyak fitur, makin bagus", why: "Makin banyak fitur bukan makin bagus bila fiturnya bocor dari masa depan — skor test-nya akan tampak tinggi tapi tidak valid." },
            { text: "Boleh bila skor test-nya tinggi", why: "Skor test yang tinggi justru ciri leakage: test ikut bocor, jadi gap train-test tidak bisa mendeteksinya." },
            { text: "Tidak — karena tunggakan bukan sinyal default", why: "Tunggakan adalah sinyal default yang kuat; masalahnya bukan sinyalnya, melainkan WAKTU pengambilannya." },
          ],
        },
      ],
      summary: [
        "Supervised = belajar dari label; unsupervised = mencari pola tanpa label; reinforcement = belajar dari reward.",
        "Workflow end-to-end: framing → data → fitur → model → evaluasi → threshold → monitoring.",
        "Notebook credit scoring: 30.000 nasabah, base rate 0,2212, GBM ROC-AUC 0,7823 vs LR 0,7426.",
        "Lab: 1-NN memprediksi P1 lancar, P2 default, P3 lancar; z-score men-flag 5.000 dan 4.200.",
        "Framing kredit: definisikan unit, label, observation window, performance window — dan jangan biarkan masa depan bocor ke fitur.",
      ],
      next: { label: "Lanjut: MLF2 — Membaca Angka", href: "/v2/learn/mlf2-membaca-angka" },
    },
  ],
};

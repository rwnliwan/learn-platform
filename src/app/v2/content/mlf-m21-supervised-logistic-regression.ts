import type { V2Lesson } from "../lib/types";

export const mlfM21: V2Lesson = {
  slug: "mlf-m21-supervised-logistic-regression",
  track: "Machine Learning Finance",
  module: "Supervised — credit scoring",
  title: "MLF-M2.1 — Supervised & Logistic Regression: dari Skor ke Probabilitas",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M2 adalah pendalaman notebook credit scoring: dari model yang sudah kamu kenal di MLF1, ke mesin credit scoring yang dipakai bank — logistic regression, decision tree, gradient boosting, scorecard, kalibrasi, dan threshold bisnis.",
        "Tujuan lesson ini:",
        "• Membedakan klasifikasi dan regresi dalam konteks kredit: PD adalah klasifikasi, LGD dan EAD adalah regresi.",
        "• Menjelaskan logistic regression: sigmoid, log-odds, koefisien, dan odds ratio — dengan angka kanonis notebook.",
        "• Membaca decision tree: stump PAY_0 ≥ 1,5, depth-2, dan feature importance.",
        "• Membandingkan LR, tree, dan GBM pada metrik yang sama — dan tahu kapan model sederhana menang.",
        "• Menjalankan dua lab dari nol: logistic regression dengan gradient descent, dan decision stump.",
        "Isi lesson: cerita tiga pelamar → klasifikasi vs regresi → logistic regression → decision tree → GBM dan trade-off → 2 lab → peta keputusan → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook credit scoring: dataset UCI 30.000 nasabah, default rate 0,2212, test set 6.000 nasabah. Logistic Regression ROC-AUC 0,7426; Gradient Boosting 0,7823; GBM terkalibrasi 0,7816.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Tiga pelamar kembali — kali ini bank minta probabilitas",
      prose: [
        "Tiga pelamar dari MLF1 kembali: P1 penghasilan 2,4 juta per bulan, 1 kali terlambat 90 hari. P2 penghasilan 1,7 juta, 2 kali terlambat. P3 penghasilan 4,2 juta, belum pernah terlambat. 1-NN di MLF1 memprediksi: P1 lancar, P2 default, P3 lancar. Keputusan itu benar — tapi bank tidak bisa memakainya begitu saja.",
        "Kenapa? Karena label 0/1 tidak punya harga. Bank tidak bertanya «default atau lancar?» — bank bertanya «berapa peluangnya default, dan berapa kerugian bila ia default?». Pelamar dengan peluang default 0,11 dan pelamar dengan peluang 0,49 sama-sama berlabel «lancar» bila threshold-nya 0,5 — padahal risikonya berbeda empat setengah kali lipat. Label menyembunyikan perbedaan itu; probabilitas menampakkannya.",
        "Nilai: pada test set 6.000 nasabah, model yang mengeluarkan probabilitas — logistic regression — mencapai ROC-AUC 0,7426 [notebook]. Angka itu mengukur ranking: seberapa baik model mengurutkan nasabah berisiko di atas nasabah aman. Tapi ranking saja belum cukup: probabilitasnya juga harus jujur — nasabah dengan PD 0,20 harus benar-benar default sekitar 20 persen. Itu kalibrasi, dan pengajaran penuhnya di M2.3.",
        "Baik atau buruk: prediksi label bagus bila keputusannya memang biner dan biayanya simetris — misal flag fraud untuk diperiksa manusia. Buruk bila keputusan melibatkan uang dengan besaran berbeda: menyetujui limit Rp200 juta dan Rp10 juta adalah dua keputusan yang berbeda, meski labelnya sama-sama «lancar». Probabilitas + exposure-lah yang membedakan.",
        "Mitigasi: latih model yang mengeluarkan probabilitas (logistic regression, GBM terkalibrasi), lalu ubah probabilitas menjadi keputusan lewat threshold bisnis — bukan lewat label mentah. Threshold 0,10 di notebook adalah contohnya: di bawah itu disetujui, di atas itu ditolak atau diperiksa.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: model klasifikasi hanya mengeluarkan label",
        type: "pitfall",
        body: "Yang benar: hampir semua classifier modern mengeluarkan skor atau probabilitas, dan label hanyalah skor yang dipotong threshold. Memakai label tanpa tahu threshold-nya sama dengan memakai keputusan tanpa tahu harganya.",
      },
    },
    {
      id: "klasifikasi-regresi",
      eyebrow: "Langkah 3 · Klasifikasi vs regresi",
      title: "Klasifikasi menjawab «apakah?», regresi menjawab «seberapa besar?»",
      prose: [
        "Trio Basel memecah risiko kredit menjadi tiga pertanyaan — dan ketiganya dijawab model yang berbeda. PD (probability of default): peluang nasabah default dalam horizon yang didefinisikan — ini klasifikasi, jawabannya peluang antara 0 dan 1. LGD (loss given default): porsi exposure yang hilang bila default terjadi — ini regresi, jawabannya angka antara 0 dan 1. EAD (exposure at default): besar exposure saat default terjadi — ini regresi, jawabannya nominal rupiah.",
        "Nilai: ketiganya dikalikan menjadi Expected Loss: EL = PD × LGD × EAD. Contoh dari mini-case MLF1 [ilustrasi]: PD 0,5, LGD 45 persen, EAD Rp10.000.000 → EL = 0,5 × 0,45 × 10.000.000 = Rp2.250.000. Satu rumus, tiga model, satu keputusan. Bila PD-nya salah 0,10, EL-nya meleset Rp450.000 per nasabah — pada 6.000 nasabah test, itu Rp2,7 miliar.",
        "Gambar mentalnya: klasifikasi memisahkan (default vs lancar), regresi mengukur (berapa besar kerugiannya). Model yang sama tidak bisa menjawab keduanya dengan baik: logistic regression hebat untuk PD karena keluarannya probabilitas; untuk LGD dan EAD, bank memakai regresi linear, tree regressor, atau model khusus recovery.",
        "Baik atau buruk: klasifikasi bagus bila horizon dan definisi default-nya jelas — misal «default = 90+ hari tunggakan dalam 12 bulan ke depan». Buruk bila definisinya berubah-ubah antar periode: model belajar dari label yang artinya tidak konsisten. Regresi bagus bila targetnya terukur — LGD teramati dari recovery historis. Buruk bila targetnya nyaris tidak teramati: LGD hanya ada untuk nasabah yang default, jadi datanya sedikit dan bias.",
        "Mitigasi: definisikan PD, LGD, dan EAD sekali — di framing, sebelum melatih — dan pakai definisi yang sama di evaluasi, di scorecard, dan di laporan ke regulator. Horizon PD (12 bulan vs lifetime) dibedakan eksplisit: PD 12 bulan dipakai Stage 1 IFRS 9, PD lifetime dipakai Stage 2 — pengajaran penuhnya di M2.4.",
        "Sebelum melatih, kenali dulu datanya. Tabel data dictionary UCI yang ringkas [notebook] — PAY_0 (status bayar Sep 2005): −2: 2.759 nasabah (default 0,1323); −1: 5.686 (0,1678); 0: 14.737 (0,1281); 1: 3.688; 2: 2.667; 3: 322; 4: 76; 5: 26; 6: 11; 7: 9; 8: 19. Nilai negatif BUKAN tunggakan: −2 berarti bayar lunas dua bulan berturut-turut (revolving, dibayar penuh), −1 berarti bayar lunas satu bulan, 0 berarti memakai revolving tanpa telat. Nilai positif adalah jumlah bulan telat — 1 berarti telat 1 bulan, 2 berarti telat 2 bulan, dan seterusnya. Salah membaca tanda ini berarti salah membaca seluruh dataset.",
        "Dua jebakan lain dari kamus data yang sama [notebook]: EDUCATION kode 0 — hanya 14 baris, 0 default — adalah kategori unknown/other, bukan «tidak berpendidikan»; jangan beri ia makna yang tidak dimilikinya. LIMIT_BAL berkisar 10.000 sampai 1.000.000 (mean 167.484) dan PAY_AMT1 berkisar 0 sampai 873.552 — keduanya berekor kanan panjang (gambar di bawah): sebagian besar nasabah berkumpul di nilai kecil, segelintir di nilai sangat besar. Missing beda dengan nol: PAY_AMT1 = 0 berarti nasabah memang tidak membayar apa-apa bulan itu — bukan data yang hilang.",
        "Aturan preprocessing sebagai bagian dari versi scorecard — jembatan dari L0, bukan ulangan L0: (1) imputasi hanya memakai statistik train — mean/median yang dihitung dari seluruh data sebelum split adalah leakage (pengajaran penuhnya di langkah 9); (2) kategori unknown dipertahankan sebagai bin tersendiri, atau digabung dengan aturan eksplisit yang didokumentasikan — EDUCATION = 0 digabung ke «Lainnya» bersama kode 4, 5, 6; (3) outlier limit/payment ditangani SEBELUM scaling/binning — capping atau winsorization dihitung dari train, lalu diterapkan sama ke test; (4) kategori yang muncul di test tapi tidak ada di train (kategori baru) dipetakan ke bin «unknown», bukan dibuang dan bukan ditebak. Dokumentasikan keempat aturan ini sebagai bagian dari scorecard version — «scorecard v1, data Sep 2005, aturan preprocessing v1» — supaya model yang sama bisa dibangun ulang persis oleh orang lain.",
      ],
      formula: String.raw`EL = PD \times LGD \times EAD`,
      formulaNote: "Expected Loss: peluang default dikali porsi yang hilang dikali besar exposure. Ketiga komponennya dijawab model yang berbeda — PD klasifikasi, LGD dan EAD regresi.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Batang jangkauan: LIMIT_BAL dari 10.000 sampai 1.000.000 dengan mean 167.484; PAY_AMT1 dari 0 sampai 873.552">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Jangkauan LIMIT_BAL &amp; PAY_AMT1 — ekor kanan panjang</text>
<text x="52" y="52" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">LIMIT_BAL (skala log)</text>
<line x1="52" y1="66" x2="466" y2="66" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="52.0" y1="60" x2="52.0" y2="72" stroke="var(--c1)" stroke-width="2.5"/>
<text x="52.0" y="86" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">min 10.000</text>
<line x1="302.6" y1="60" x2="302.6" y2="72" stroke="var(--c2)" stroke-width="2.5"/>
<text x="302.6" y="86" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">mean 167.484</text>
<line x1="450.0" y1="60" x2="450.0" y2="72" stroke="var(--c1)" stroke-width="2.5"/>
<text x="450.0" y="86" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">maks 1.000.000</text>
<text x="240" y="106" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">mean jauh dari maks: sebagian besar nasabah berlimit kecil,</text>
<text x="240" y="122" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">segelintir berlimit sangat besar — distribusi miring kanan.</text>
<text x="52" y="152" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PAY_AMT1 (skala linear 0–900.000)</text>
<line x1="52" y1="166" x2="466" y2="166" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="52.0" y1="160" x2="52.0" y2="172" stroke="var(--c1)" stroke-width="2.5"/>
<text x="52.0" y="186" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">min 0</text>
<line x1="438.8" y1="160" x2="438.8" y2="172" stroke="var(--c1)" stroke-width="2.5"/>
<text x="438.8" y="186" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">maks 873.552</text>
<text x="240" y="206" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">0 berarti tidak membayar apa-apa bulan itu — bukan data hilang.</text>
<text x="240" y="222" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Ekor kanan: segelintir pembayaran sangat besar menarik mean ke atas.</text>
</svg>`,
        alt: "Batang jangkauan: LIMIT_BAL dari 10.000 sampai 1.000.000 dengan mean 167.484; PAY_AMT1 dari 0 sampai 873.552.",
        caption: "Cara membaca: tiap garis = jangkauan satu fitur; tanda tebal = min, mean, maks [notebook]. Interpretasi: kedua fitur miring kanan — mean jauh dari maks; dan PAY_AMT1 = 0 adalah nilai yang sah (tidak membayar), bukan missing.",
      },
      tasks: [],
    },
    {
      id: "logistic-regression",
      eyebrow: "Langkah 4 · Logistic regression",
      title: "Logistic regression: skor linear, keluar probabilitas",
      prose: [
        "Logistic regression adalah model supervised paling jujur di credit scoring — dan baseline yang harus dikalahkan model apa pun. Cara kerjanya dua langkah: pertama hitung skor linear z = w·x + b dari fitur-fitur nasabah; lalu lewatkan z lewat fungsi sigmoid sehingga keluarannya probabilitas antara 0 dan 1.",
        "Nilai: pada test set 6.000 nasabah, LR mencapai ROC-AUC 0,7426 [notebook]. Koefisiennya — setelah standardisasi fitur — bisa dibaca langsung: PAY_DELAY_COUNT 0,756, PAY_MAX 0,274, PAY_0 0,243, LIMIT_BAL −0,240, PAY_AMT1 −0,161. Koefisien positif menaikkan log-odds default; negatif menurunkannya. PAY_DELAY_COUNT — jumlah bulan yang telat dalam 6 bulan — adalah sinyal terkuat di LR.",
        "Gambar di bawah adalah kurva sigmoid: sumbu X log-odds z, sumbu Y probabilitas p. Tiga titiknya patut dihafal: z = 0 → p = 0,50 (tepat di tengah, model ragu); z = 2 → p = 0,88 (yakin default); z = −2 → p = 0,12 (yakin lancar). Di sekitar z = 0 kurva curam — perubahan kecil pada skor mengubah probabilitas besar-besaran; di ujung-ujungnya kurva datar — skor yang sudah ekstrem sulit diubah.",
        "Odds ratio menerjemahkan koefisien ke bahasa bisnis: OR = e pangkat koefisien. PAY_DELAY_COUNT 0,756 → OR 2,13: tiap tambahan satu simpangan baku jumlah bulan telat, odds default naik 2,13 kali. PAY_MAX 0,274 → OR 1,32. LIMIT_BAL −0,240 → OR 0,79: limit lebih besar satu simpangan baku justru menurunkan odds default — nasabah berlimit besar cenderung lebih mapan. Tanda koefisiennya lebih penting dari besarnya: tanda yang salah arah dengan logika bisnis adalah alarm — periksa leakage atau multikolinearitas.",
        "Baik atau buruk: LR bagus bila hubungannya mendekati linear dalam log-odds dan bila penjelasannya harus sampai ke regulator — tiap koefisien bisa ditunjukkan, diuji, dan dipertahankan. Buruk bila hubungannya non-linear atau ada interaksi kuat antar fitur: LR tidak bisa menangkap «telat itu berbahaya hanya bila limitnya juga besar» tanpa fitur interaksi yang dibuat manual.",
        "Mitigasi: standardisasi fitur sebelum membandingkan koefisien — koefisien fitur mentah tidak bisa dibandingkan karena satuannya berbeda (rupiah vs jumlah bulan). Dan selalu laporkan odds ratio beserta arahnya, bukan koefisien mentah saja. Untuk interaksi dan non-linearitas, naik ke tree/GBM — dengan harga interpretabilitas.",
      ],
      formula: String.raw`p = \frac{1}{1 + e^{-z}}, \quad z = w \cdot x + b, \quad \text{log-odds} = \log\frac{p}{1-p}`,
      formulaNote: "Sigmoid mengubah skor linear z menjadi probabilitas p. Log-odds adalah log dari p dibagi (1 − p) — skala tempat LR benar-benar linear.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Kurva sigmoid dari log-odds -6 sampai 6 menjadi probabilitas 0 sampai 1">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Fungsi sigmoid: log-odds menjadi probabilitas</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">-6</text>
<line x1="121.0" y1="206" x2="121.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="121.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">-4</text>
<line x1="190.0" y1="206" x2="190.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="190.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">-2</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="328.0" y1="206" x2="328.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="328.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<line x1="397.0" y1="206" x2="397.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="397.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6</text>
<polyline points="52.0,205.6 58.9,205.5 65.8,205.4 72.7,205.2 79.6,205.0 86.5,204.8 93.4,204.6 100.3,204.2 107.2,203.9 114.1,203.4 121.0,202.8 127.9,202.1 134.8,201.3 141.7,200.3 148.6,199.1 155.5,197.7 162.4,195.9 169.3,193.8 176.2,191.4 183.1,188.4 190.0,185.0 196.9,181.0 203.8,176.4 210.7,171.2 217.6,165.3 224.5,158.7 231.4,151.4 238.3,143.6 245.2,135.4 252.1,126.8 259.0,118.0 265.9,109.2 272.8,100.6 279.7,92.4 286.6,84.6 293.5,77.3 300.4,70.7 307.3,64.8 314.2,59.6 321.1,55.0 328.0,51.0 334.9,47.6 341.8,44.6 348.7,42.2 355.6,40.1 362.5,38.3 369.4,36.9 376.3,35.7 383.2,34.7 390.1,33.9 397.0,33.2 403.9,32.6 410.8,32.1 417.7,31.8 424.6,31.4 431.5,31.2 438.4,31.0 445.3,30.8 452.2,30.6 459.1,30.5 466.0,30.4" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="259.0" y1="118.0" x2="259.0" y2="206" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="52" y1="118.0" x2="259.0" y2="118.0" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<circle cx="259.0" cy="118.0" r="5" fill="var(--c2)"/>
<text x="269.0" y="110.0" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">z=0 → p=0,50</text>
<line x1="328.0" y1="51.0" x2="328.0" y2="206" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="52" y1="51.0" x2="328.0" y2="51.0" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<circle cx="328.0" cy="51.0" r="5" fill="var(--c2)"/>
<text x="338.0" y="43.0" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">z=2 → p=0,88</text>
<line x1="190.0" y1="185.0" x2="190.0" y2="206" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="52" y1="185.0" x2="190.0" y2="185.0" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<circle cx="190.0" cy="185.0" r="5" fill="var(--c2)"/>
<text x="200.0" y="177.0" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">z=-2 → p=0,12</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">log-odds z = w·x + b</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">probabilitas p</text>
</svg>`,
        alt: "Kurva sigmoid dari log-odds -6 sampai 6 menjadi probabilitas 0 sampai 1.",
        caption: "Cara membaca: X log-odds z, Y probabilitas p. Interpretasi: z = 0 → p = 0,50 (ragu); z = 2 → p = 0,88; z = −2 → p = 0,12. Di tengah kurva curam, di ujung datar.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: koefisien besar berarti fitur penting",
        type: "pitfall",
        body: "Yang benar: koefisien hanya bisa dibandingkan bila fiturnya distandardisasi. Koefisien LIMIT_BAL mentah tampak kecil karena satuannya rupiah (ratusan ribu), bukan karena limit tidak penting. Setelah standardisasi, LIMIT_BAL −0,240 adalah sinyal keempat terkuat di LR.",
      },
    },
    {
      id: "tree",
      eyebrow: "Langkah 5 · Decision tree",
      title: "Decision tree: belah data, baca daunnya",
      prose: [
        "Decision tree bekerja seperti analis yang bertanya berurutan: «Apakah nasabah ini telat ≥ 2 bulan?» — ya ke kanan, tidak ke kiri — lalu bertanya lagi di tiap cabang sampai ke daun, tempat keputusan dibaca. Tidak ada rumus; yang ada hanya belahan dan daun.",
        "Nilai: pohon depth-1 (stump) pada data UCI hanya punya satu belahan — PAY_0 ≥ 1,5 — dan mencapai ROC-AUC test 0,6443 [notebook]. Daun kirinya (PAY_0 ≤ 1, telat ≤ 1 bulan): default rate 0,1659, n = 26.870. Daun kanannya (PAY_0 ≥ 2, telat): default rate 0,6955, n = 3.130. Satu pertanyaan sudah memisahkan 0,1659 dari 0,6955 — tapi ROC-AUC-nya baru 0,6443, jauh di bawah LR 0,7426. Satu belahan tidak cukup.",
        "Gambar di bawah adalah stump itu: akar PAY_0 ≥ 1,5, dua daun dengan default rate masing-masing. Perhatikan: daun kanan tidak berisi 100 persen default — 0,6955 berarti 30 persen nasabah telat ternyata tetap lancar. Daun bukan vonis; daun adalah kelompok dengan risiko yang sama.",
        "Depth-2 menambah satu belahan lagi dan naik ke ROC-AUC test 0,7153 [notebook] — masih di bawah LR. Feature importance depth-2: PAY_0 0,788, PAY_MAX 0,198, BILL_AMT1 0,014. Pesannya konsisten: riwayat telat mendominasi, tagihan hampir tidak berpengaruh. Tapi hati-hati: importance mengukur seberapa sering fitur dipakai membelah, bukan seberapa besar pengaruh kausalnya.",
        "Baik atau buruk: tree bagus bila aturannya harus dibaca manusia — «telat ≥ 2 bulan DAN limit kecil → tolak» adalah bahasa komite kredit. Buruk bila dibiarkan tumbuh dalam: pohon dalam menghafal noise latih (overfitting) — gap train-test depth-2 sudah 0,7318 vs 0,7153, dan makin dalam makin lebar.",
        "Mitigasi: batasi depth, tetapkan jumlah minimum nasabah per daun, dan selalu bandingkan dengan LR sebagai baseline. Pohon adalah fondasi GBM — gradient boosting hanyalah banyak pohon dangkal yang saling mengoreksi — dan GBM-lah yang mencapai 0,7823 di notebook.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Diagram decision stump: PAY_0 lebih besar sama dengan 1,5 membelah nasabah menjadi daun lancar dan daun default">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Decision stump: satu belahan, dua daun</text>
<rect x="150" y="34" width="180" height="46" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="240" y="54" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PAY_0 ≥ 1,5 ?</text>
<text x="240" y="70" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">telat ≥ 2 bulan di Sep 2005?</text>
<line x1="195" y1="80" x2="120" y2="110" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="285" y1="80" x2="360" y2="110" stroke="var(--chart-text)" stroke-width="1"/>
<text x="150" y="100" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Tidak</text>
<text x="330" y="100" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Ya</text>
<rect x="30" y="110" width="180" height="64" rx="8" fill="none" stroke="var(--c3)" stroke-width="2"/>
<text x="120" y="132" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Daun kiri: telat ≤ 1 bulan</text>
<text x="120" y="150" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">default rate 0,1659</text>
<text x="120" y="166" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n = 26.870 (89,6%)</text>
<rect x="270" y="110" width="180" height="64" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="360" y="132" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Daun kanan: default</text>
<text x="360" y="150" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">default rate 0,6955</text>
<text x="360" y="166" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n = 3.130 (10,4%)</text>
<text x="240" y="198" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Satu belahan sudah memisahkan 0,1659 dari 0,6955 —</text>
<text x="240" y="214" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">tapi ROC-AUC-nya baru 0,6443 [notebook].</text>
</svg>`,
        alt: "Diagram decision stump: PAY_0 lebih besar sama dengan 1,5 membelah nasabah menjadi daun lancar dan daun default.",
        caption: "Cara membaca: akar bertanya PAY_0 ≥ 1,5; daun kiri default rate 0,1659 (n = 26.870), daun kanan 0,6955 (n = 3.130). Interpretasi: satu belahan memisahkan risiko, tapi belum cukup — ROC-AUC baru 0,6443.",
      },
      tasks: [],
    },
    {
      id: "gbm-tradeoff",
      eyebrow: "Langkah 6 · GBM dan trade-off",
      title: "LR vs tree vs GBM: skor naik, penjelasan menipis",
      prose: [
        "Empat model, satu metrik, satu dataset — inilah tangga performa credit scoring di notebook. Stump (depth-1): ROC-AUC test 0,6443. Depth-2: 0,7153. Logistic regression: 0,7426. Gradient boosting: 0,7823. Tiap anak tangga membeli skor dengan harga yang berbeda.",
        "Nilai: GBM mengungguli LR sebesar 0,7823 − 0,7426 = 0,0397 [notebook]. Selisih itu nyata — tapi bandingkan dengan harganya: GBM adalah ratusan pohon yang tidak bisa dibaca satu per satu, sedangkan LR adalah enam koefisien yang bisa dicetak di satu halaman dan dijelaskan ke regulator. Train ROC-AUC GBM 0,8469 vs test 0,7823 — gap 0,0646 — mengingatkan bahwa sebagian keunggulan GBM adalah hafalan, bukan generalisasi.",
        "Gambar di bawah membandingkan keempat ROC-AUC test itu. Baca dari kiri ke kanan: lompatan terbesar datang dari stump ke depth-2 (0,6443 → 0,7153), lalu mengecil — LR ke GBM hanya 0,0397. Pola ini umum: 80 persen performa datang dari model sederhana; 20 persen sisanya mahal.",
        "Tapi ROC-AUC bukan satu-satunya lensa — dan pada data yang tidak seimbang, ia bisa menipu. Base rate default di UCI hanya 0,2212: dari 100 nasabah, 22 default dan 78 lancar. ROC-AUC mengukur ranking atas SEMUA nasabah; precision-recall (PR) mengukur seberapa baik model menemukan 22 default itu tanpa terlalu banyak menuduh yang lancar. PR-AUC test [notebook]: stump 0,3763; depth-2 0,4343; LR 0,5049; GBM mentah 0,5597; GBM terkalibrasi 0,5558. Garis dasar PR-AUC adalah base rate 0,2212 — model acak mendapat PR-AUC 0,2212. Perhatikan urutannya sama dengan ROC-AUC, tapi jaraknya lebih jujur: stump 0,3763 hanya 0,1551 di atas acak, sementara ROC-AUC-nya 0,6443 tampak jauh lebih meyakinkan. Kalibrasi sedikit menurunkan PR-AUC GBM (0,5597 → 0,5558) — harga kecil untuk probabilitas yang jujur, dan PR-AUC memang tidak dirancang untuk mengukur kalibrasi.",
        "Contoh kerja — balanced accuracy pada threshold yang sama [notebook]. Balanced accuracy (BA) = (recall + specificity) / 2: ia menimbang kelas default dan lancar sama berat, sehingga tidak bisa «curang» dengan memprediksi semua lancar. LR threshold 0,10: precision 0,2541, recall 0,9164, specificity 0,2363, BA 0,5763, akurasi 0,3867 (TP 1.216, FP 3.569, TN 1.104, FN 111). LR threshold 0,50: precision 0,6482, recall 0,2916, specificity 0,9551, BA 0,6233, akurasi 0,8083 (TP 387, FP 210, TN 4.463, FN 940). GBM terkalibrasi threshold 0,10: precision 0,2828, recall 0,9141, specificity 0,3415, BA 0,6278, akurasi 0,4682 (TP 1.213, FP 3.077, TN 1.596, FN 114). GBM terkalibrasi threshold 0,50: precision 0,6750, recall 0,3647, specificity 0,9501, BA 0,6574, akurasi 0,8207 (TP 484, FP 233, TN 4.440, FN 843).",
        "Baca tabel itu dengan benar: akurasi 0,8083 pada LR threshold 0,50 tampak hebat — tapi recall-nya hanya 0,2916: 940 default lolos. Akurasi 0,3867 pada threshold 0,10 tampak buruk — tapi recall-nya 0,9164 dan BA-nya 0,5763. Akurasi memihak kelas mayoritas (lancar): memprediksi semua lancar saja sudah memberi akurasi 0,7788. Karena itu, pada data tidak seimbang, jangan pernah membandingkan model dengan akurasi — bandingkan dengan PR-AUC (tanpa threshold) dan balanced accuracy (dengan threshold). Dan ingat: metrik yang «lebih baik» di sini tetap harus dibaca bersama biaya — threshold 0,10 dipilih bukan karena BA-nya tertinggi, melainkan karena profitnya tertinggi (M2.3).",
        "Baik atau buruk: GBM bagus bila yang dikejar skor mentah dan penjelasan bisa diganti alat bantu — SHAP, partial dependence, reason codes (ketiganya ada di notebook credit scoring). Buruk bila keputusan harus dijelaskan kata per kata tanpa alat bantu — di situlah LR dan scorecard menang, dan di situlah regulator biasanya berdiri.",
        "Mitigasi: selalu mulai dari LR sebagai baseline yang jujur — angka 0,7426 adalah garis yang harus dilewati GBM, bukan angka yang disembunyikan. Bila GBM hanya menang 0,0397, tanyakan: apakah 0,0397 itu sepadan dengan kehilangan penjelasan? Jawabannya tergantung konteks — dan konteks itu keputusan bisnis, bukan keputusan model.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar berkelompok ROC-AUC dan PR-AUC test: stump 0,6443 dan 0,3763; depth-2 0,7153 dan 0,4343; LR 0,7426 dan 0,5049; GBM 0,7823 dan 0,5597; GBM terkalibrasi 0,7816 dan 0,5558">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">ROC-AUC vs PR-AUC test — ranking vs menemukan default</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,8</text>
<line x1="52" y1="157.3" x2="466" y2="157.3" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="150.0" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">base rate 0,2212</text>
<rect x="72" y="64.3" width="26" height="141.7" fill="var(--c1)"/>
<text x="85" y="60.3" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6443</text>
<rect x="102" y="123.2" width="26" height="82.8" fill="var(--c2)"/>
<text x="115" y="119.2" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3763</text>
<text x="100" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Stump</text>
<rect x="144" y="48.6" width="26" height="157.4" fill="var(--c1)"/>
<text x="157" y="44.6" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7153</text>
<rect x="174" y="110.5" width="26" height="95.5" fill="var(--c2)"/>
<text x="187" y="106.5" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,4343</text>
<text x="172" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Depth-2</text>
<rect x="216" y="42.6" width="26" height="163.4" fill="var(--c1)"/>
<text x="229" y="38.6" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7426</text>
<rect x="246" y="94.9" width="26" height="111.1" fill="var(--c2)"/>
<text x="259" y="90.9" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5049</text>
<text x="244" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">LR</text>
<rect x="288" y="33.9" width="26" height="172.1" fill="var(--c1)"/>
<text x="301" y="29.9" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7823</text>
<rect x="318" y="82.9" width="26" height="123.1" fill="var(--c2)"/>
<text x="331" y="78.9" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5597</text>
<text x="316" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GBM</text>
<rect x="360" y="34.0" width="26" height="172.0" fill="var(--c1)"/>
<text x="373" y="30.0" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7816</text>
<rect x="390" y="83.7" width="26" height="122.3" fill="var(--c2)"/>
<text x="403" y="79.7" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5558</text>
<text x="388" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GBMcal</text>
<text x="240" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">biru = ROC-AUC · hijau = PR-AUC · garis putus-putus = base rate 0,2212</text>
</svg>`,
        alt: "Bar berkelompok ROC-AUC dan PR-AUC test: stump 0,6443 dan 0,3763; depth-2 0,7153 dan 0,4343; LR 0,7426 dan 0,5049; GBM 0,7823 dan 0,5597; GBM terkalibrasi 0,7816 dan 0,5558.",
        caption: "Cara membaca: tiap model punya dua bar — ROC-AUC (biru) dan PR-AUC (hijau); garis putus-putus = base rate 0,2212 (PR-AUC model acak). Interpretasi: urutan model sama di kedua metrik, tapi PR-AUC lebih jujur — stump hanya 0,3763, tak jauh di atas acak; kalibrasi sedikit menurunkan PR-AUC GBM (0,5597 → 0,5558).",
      },
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab: logistic regression dari nol dengan gradient descent",
      prose: [
        "Sekarang giliranmu melatih LR. Datanya 12 nasabah dari cerita pembuka — sama seperti 1-NN di MLF1 — tapi kali ini modelnya mengeluarkan probabilitas, bukan label tetangga.",
        "Skema evaluasinya eksplisit: latih 12 nasabah, test 3 pelamar baru. Fitur distandardisasi dulu (mean dan sd populasi dari data latih) — tanpa standardisasi, gradient descent berjalan miring karena skala penghasilan (jutaan) jauh lebih besar dari skala keterlambatan (satuan). Learning rate 0,5, 300 iterasi — cukup untuk stabil secara praktis pada data sekecil ini — bukan konvergen: pada data yang separable sempurna, bobot terus membesar.",
        "Perhatikan odds ratio yang keluar: income 0,0405 dan late 77,8599 [lab]. Angka-angka ekstrem itu BUKAN bukti fitur yang super kuat — itu gejala data kecil yang separable sempurna: 12 nasabah bisa dipisah tanpa satu pun kesalahan, jadi bobotnya terus membesar selama iterasi. Bandingkan dengan notebook 30.000 nasabah: PAY_DELAY_COUNT OR 2,13, PAY_MAX OR 1,32 — jauh lebih kalem, dan jauh lebih bisa dipercaya.",
        "Akurasi test 1,0000 di sini sama lemahnya dengan di MLF1: tiga prediksi benar belum membuktikan model bagus. Yang membuktikan adalah 6.000 nasabah test di notebook — dan di sana LR 0,7426, bukan 1,0000.",
        "Tugas keempat berlatih preprocessing yang aman pada data kecil: satu income kosong di train dan satu kode edukasi baru (9) di test. Isi yang kosong dengan mean TRAIN saja — mean seluruh data (train + test) adalah leakage kecil yang sama berbahayanya dengan yang besar — dan petakan kode baru ke «unknown», bukan dibuang dan bukan ditebak.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi gradien gw[0], gw[1], dan gb di dalam loop" },
        { id: "t2", text: "Jalankan dan baca w, b, serta odds ratio kedua fitur" },
        { id: "t3", text: "Prediksi tiga pelamar dan hitung akurasi test" },
        { id: "t4", text: "Preprocessing yang aman: isi income kosong dengan mean TRAIN saja, dan petakan kode edukasi baru (9) di test ke «unknown»" },
      ],
      expected: "w0=-3.2068 w1=4.3549 b=-1.2418\nodds ratio income: 0.0405\nodds ratio late: 77.8599\npelamar (2.4, 1): PD=0.1741\npelamar (1.7, 2): PD=0.9864\npelamar (4.2, 0): PD=0.0000\nprediksi: [0, 1, 0]\nakurasi test: 1.0000\nmean income train (tanpa kosong): 2.3000\nincome terisi: 2.3000\nkategori test 9 -> unknown",
      hints: [
        "Gradien logistic loss terhadap w: (p − y) × x; terhadap b: (p − y).",
        "Odds ratio = e pangkat koefisien — pakai math.exp.",
      ],
      code: {
        starter: `import math

# Data latih: (pendapatan_jt_per_bulan, keterlambatan_90hr, default)
train = [
    (2.5, 0, 0), (3.0, 0, 0), (2.8, 1, 0), (4.0, 0, 0),
    (2.2, 2, 1), (1.8, 3, 1), (2.0, 2, 1), (3.5, 1, 0),
    (1.5, 4, 1), (4.5, 0, 0), (2.6, 1, 0), (1.9, 3, 1),
]
# Tiga pelamar baru (label diketahui untuk evaluasi)
test = [(2.4, 1, 0), (1.7, 2, 1), (4.2, 0, 0)]

# Standardisasi (mean & sd populasi dari data latih)
mx = [sum(x[i] for x in train) / len(train) for i in range(2)]
sx = [math.sqrt(sum((x[i] - mx[i]) ** 2 for x in train) / len(train)) for i in range(2)]
X = [[(x[0] - mx[0]) / sx[0], (x[1] - mx[1]) / sx[1]] for x in train]
ys = [y for _, _, y in train]

w = [0.0, 0.0]
b = 0.0
lr = 0.5
for it in range(300):
    gw = [0.0, 0.0]
    gb = 0.0
    for xi, yi in zip(X, ys):
        z = w[0] * xi[0] + w[1] * xi[1] + b
        p = 1 / (1 + math.exp(-z))
        e = p - yi
        gw[0] += 0.0  # TODO: gradien w0 = e * xi[0]
        gw[1] += 0.0  # TODO: gradien w1 = e * xi[1]
        gb += 0.0  # TODO: gradien b = e
    w[0] -= lr * gw[0] / len(X)
    w[1] -= lr * gw[1] / len(X)
    b -= lr * gb / len(X)

print(f"w0={w[0]:.4f} w1={w[1]:.4f} b={b:.4f}")
print(f"odds ratio income: {math.exp(w[0]):.4f}")
print(f"odds ratio late: {math.exp(w[1]):.4f}")
preds = []
for inc, late, _ in test:
    xi = [(inc - mx[0]) / sx[0], (late - mx[1]) / sx[1]]
    z = w[0] * xi[0] + w[1] * xi[1] + b
    p = 1 / (1 + math.exp(-z))
    preds.append(1 if p >= 0.5 else 0)
    print(f"pelamar ({inc}, {late}): PD={p:.4f}")
print("prediksi:", preds)
acc = sum(p == y for p, (_, _, y) in zip(preds, test)) / len(test)
print(f"akurasi test: {acc:.4f}")

# --- Tugas 4: preprocessing yang aman (G3) ---
# Data kecil: (income_jt, edu_kode, default). Income ada yang kosong (None);
# test mengandung kode edukasi baru (9) yang tidak ada di train.
train2 = [(2.5, 1, 0), (3.0, 2, 0), (None, 1, 0), (2.2, 2, 1), (1.8, 3, 1), (2.0, 2, 1)]
test2 = [(2.4, 1, 0), (1.7, 9, 1)]
known_edu = {1, 2, 3}  # kode yang ada di train
mean_train2 = 0.0  # TODO: mean income train dari nilai yang TIDAK kosong
filled = 0.0  # TODO: isi income kosong dengan mean train
mapped = ""  # TODO: petakan kode 9 ke "unknown" bila tidak ada di train
print(f"mean income train (tanpa kosong): {mean_train2:.4f}")
print(f"income terisi: {filled:.4f}")
print(f"kategori test 9 -> {mapped}")`,
        lockLines: 21,
        solution: `import math

# Data latih: (pendapatan_jt_per_bulan, keterlambatan_90hr, default)
train = [
    (2.5, 0, 0), (3.0, 0, 0), (2.8, 1, 0), (4.0, 0, 0),
    (2.2, 2, 1), (1.8, 3, 1), (2.0, 2, 1), (3.5, 1, 0),
    (1.5, 4, 1), (4.5, 0, 0), (2.6, 1, 0), (1.9, 3, 1),
]
# Tiga pelamar baru (label diketahui untuk evaluasi)
test = [(2.4, 1, 0), (1.7, 2, 1), (4.2, 0, 0)]

# Standardisasi (mean & sd populasi dari data latih)
mx = [sum(x[i] for x in train) / len(train) for i in range(2)]
sx = [math.sqrt(sum((x[i] - mx[i]) ** 2 for x in train) / len(train)) for i in range(2)]
X = [[(x[0] - mx[0]) / sx[0], (x[1] - mx[1]) / sx[1]] for x in train]
ys = [y for _, _, y in train]

w = [0.0, 0.0]
b = 0.0
lr = 0.5
for it in range(300):
    gw = [0.0, 0.0]
    gb = 0.0
    for xi, yi in zip(X, ys):
        z = w[0] * xi[0] + w[1] * xi[1] + b
        p = 1 / (1 + math.exp(-z))
        e = p - yi
        gw[0] += e * xi[0]
        gw[1] += e * xi[1]
        gb += e
    w[0] -= lr * gw[0] / len(X)
    w[1] -= lr * gw[1] / len(X)
    b -= lr * gb / len(X)

print(f"w0={w[0]:.4f} w1={w[1]:.4f} b={b:.4f}")
print(f"odds ratio income: {math.exp(w[0]):.4f}")
print(f"odds ratio late: {math.exp(w[1]):.4f}")
preds = []
for inc, late, _ in test:
    xi = [(inc - mx[0]) / sx[0], (late - mx[1]) / sx[1]]
    z = w[0] * xi[0] + w[1] * xi[1] + b
    p = 1 / (1 + math.exp(-z))
    preds.append(1 if p >= 0.5 else 0)
    print(f"pelamar ({inc}, {late}): PD={p:.4f}")
print("prediksi:", preds)
acc = sum(p == y for p, (_, _, y) in zip(preds, test)) / len(test)
print(f"akurasi test: {acc:.4f}")

# --- Tugas 4: preprocessing yang aman (G3) ---
# Data kecil: (income_jt, edu_kode, default). Income ada yang kosong (None);
# test mengandung kode edukasi baru (9) yang tidak ada di train.
train2 = [(2.5, 1, 0), (3.0, 2, 0), (None, 1, 0), (2.2, 2, 1), (1.8, 3, 1), (2.0, 2, 1)]
test2 = [(2.4, 1, 0), (1.7, 9, 1)]
known_edu = {1, 2, 3}  # kode yang ada di train
mean_train2 = sum(x for x, _, _ in train2 if x is not None) / sum(1 for x, _, _ in train2 if x is not None)
filled = mean_train2  # isi income kosong dengan mean train
mapped = "unknown" if test2[1][1] not in known_edu else str(test2[1][1])
print(f"mean income train (tanpa kosong): {mean_train2:.4f}")
print(f"income terisi: {filled:.4f}")
print(f"kategori test 9 -> {mapped}")`,
        checks: [
          { kind: "equal", task: "t3", name: "preds", value: [0, 1, 0], label: "`preds` seharusnya [0, 1, 0]", msg: "P1 lancar (PD 0,1741), P2 default (PD 0,9864), P3 lancar (PD 0,0000)." },
          { kind: "equal", task: "t3", name: "acc", value: 1, tol: 1e-9, label: "`acc` seharusnya 1.0", msg: "Ketiga prediksi cocok dengan label test: 3 dari 3 — tapi ingat, n = 3 adalah bukti yang lemah." },
          { kind: "stdout_matches", task: "t3", pattern: "akurasi test: 1\\.0000", label: "Output menampilkan akurasi test 1.0000", msg: "Format: akurasi test: {acc:.4f}." },
          { kind: "equal", task: "t4", name: "mean_train2", value: 2.3, tol: 0.0001, label: "`mean_train2` seharusnya 2,3", msg: "Mean income train dari 5 nilai yang tidak kosong: (2,5 + 3,0 + 2,2 + 1,8 + 2,0) / 5 = 2,3 — test TIDAK ikut dihitung." },
          { kind: "stdout_matches", task: "t4", pattern: "kategori test 9 -> unknown", label: "Output menampilkan kategori baru dipetakan ke unknown", msg: "Kode 9 tidak ada di train — petakan ke «unknown», jangan dibuang dan jangan ditebak." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab: decision stump — satu belahan terbaik",
      prose: [
        "Lab kedua mencari belahan terbaik dengan cara yang sama seperti pohon sungguhan: coba semua threshold di semua fitur, hitung kesalahan tiap belahan, ambil yang paling kecil.",
        "Datanya sama — 12 nasabah, dua fitur — supaya hasilnya bisa dibandingkan langsung dengan Lab 1. Stump tidak mengenal probabilitas: ia hanya membelah dan menghitung.",
        "Hasilnya: dua belahan sempurna. Income ≤ 2,35 (err 0) dan late ≥ 1,5 (err 0) — keduanya memisahkan 12 nasabah tanpa satu pun kesalahan [lab]. Dua belahan sempurna dari data yang sama adalah peringatan: dengan n = 12, «terbaik» tidak berarti «benar». Di data UCI 30.000 nasabah, stump hanya mencapai ROC-AUC 0,6443 — jauh dari sempurna.",
        "Pelajaran lab ini: stump memilih fitur yang paling memisahkan data latih — tapi «paling memisahkan» di 12 orang belum tentu «paling memisahkan» di 30.000 orang. Itulah kenapa pohon butuh depth, pruning, dan test set yang besar.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi baris `pred` di dalam `best_split`" },
        { id: "t2", text: "Jalankan dan bandingkan belahan terbaik kedua fitur" },
        { id: "t3", text: "Prediksi tiga pelamar dengan stump late ≥ 1,5 dan hitung akurasi" },
      ],
      expected: "fitur income: err=0 threshold=2.35 arah=le akurasi=1.0000\nfitur late: err=0 threshold=1.50 arah=ge akurasi=1.0000\nprediksi: [0, 1, 0]\nakurasi test: 1.0000",
      hints: [
        "pred = 1 bila (arah ge dan x[feat] >= t) atau (arah le dan x[feat] <= t), selain itu 0.",
        "Threshold dicoba di titik tengah antar nilai unik — sudah ditulis di loop.",
      ],
      code: {
        starter: `# Data latih: (pendapatan_jt_per_bulan, keterlambatan_90hr, default)
train = [
    (2.5, 0, 0), (3.0, 0, 0), (2.8, 1, 0), (4.0, 0, 0),
    (2.2, 2, 1), (1.8, 3, 1), (2.0, 2, 1), (3.5, 1, 0),
    (1.5, 4, 1), (4.5, 0, 0), (2.6, 1, 0), (1.9, 3, 1),
]
# Tiga pelamar baru (label diketahui untuk evaluasi)
test = [(2.4, 1, 0), (1.7, 2, 1), (4.2, 0, 0)]

def best_split(data, feat):
    vals = sorted(set(x[feat] for x in data))
    best = None
    for t in [(a + b) / 2 for a, b in zip(vals, vals[1:])]:
        for direction in ("ge", "le"):
            err = 0
            for x in data:
                pred = 0  # TODO: 1 bila (ge dan x[feat] >= t) atau (le dan x[feat] <= t)
                err += (pred != x[2])
            if best is None or err < best[0]:
                best = (err, t, direction)
    return best

for feat, name in [(0, "income"), (1, "late")]:
    err, t, direction = best_split(train, feat)
    print(f"fitur {name}: err={err} threshold={t:.2f} arah={direction} akurasi={1 - err / len(train):.4f}")

# Prediksi tiga pelamar dengan stump terbaik (late >= 1,5)
preds = [1 if late >= 1.5 else 0 for _, late, _ in test]
print("prediksi:", preds)
acc = sum(p == y for p, (_, _, y) in zip(preds, test)) / len(test)
print(f"akurasi test: {acc:.4f}")`,
        lockLines: 10,
        solution: `# Data latih: (pendapatan_jt_per_bulan, keterlambatan_90hr, default)
train = [
    (2.5, 0, 0), (3.0, 0, 0), (2.8, 1, 0), (4.0, 0, 0),
    (2.2, 2, 1), (1.8, 3, 1), (2.0, 2, 1), (3.5, 1, 0),
    (1.5, 4, 1), (4.5, 0, 0), (2.6, 1, 0), (1.9, 3, 1),
]
# Tiga pelamar baru (label diketahui untuk evaluasi)
test = [(2.4, 1, 0), (1.7, 2, 1), (4.2, 0, 0)]

def best_split(data, feat):
    vals = sorted(set(x[feat] for x in data))
    best = None
    for t in [(a + b) / 2 for a, b in zip(vals, vals[1:])]:
        for direction in ("ge", "le"):
            err = 0
            for x in data:
                pred = 1 if (x[feat] >= t if direction == "ge" else x[feat] <= t) else 0
                err += (pred != x[2])
            if best is None or err < best[0]:
                best = (err, t, direction)
    return best

for feat, name in [(0, "income"), (1, "late")]:
    err, t, direction = best_split(train, feat)
    print(f"fitur {name}: err={err} threshold={t:.2f} arah={direction} akurasi={1 - err / len(train):.4f}")

# Prediksi tiga pelamar dengan stump terbaik (late >= 1,5)
preds = [1 if late >= 1.5 else 0 for _, late, _ in test]
print("prediksi:", preds)
acc = sum(p == y for p, (_, _, y) in zip(preds, test)) / len(test)
print(f"akurasi test: {acc:.4f}")`,
        checks: [
          { kind: "equal", task: "t3", name: "preds", value: [0, 1, 0], label: "`preds` seharusnya [0, 1, 0]", msg: "Stump late ≥ 1,5: P1 lancar, P2 default, P3 lancar — sama seperti 1-NN dan LR." },
          { kind: "equal", task: "t3", name: "acc", value: 1, tol: 1e-9, label: "`acc` seharusnya 1.0", msg: "Ketiga prediksi cocok: 3 dari 3." },
          { kind: "stdout_matches", task: "t2", pattern: "fitur late: err=0 threshold=1\\.50 arah=ge", label: "Output menampilkan belahan terbaik late", msg: "Belahan terbaik late: threshold 1,50, arah ge, err 0." },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: model apa untuk masalah kredit apa?",
      prose: [
        "Butuh probabilitas yang bisa dijelaskan ke regulator? Logistic regression — koefisiennya bisa dicetak, odds ratio-nya bisa dibaca, dan ROC-AUC 0,7426 adalah baseline yang jujur.",
        "Butuh aturan yang bisa dibaca komite kredit? Decision tree — «telat ≥ 2 bulan DAN limit kecil → tolak» — dengan catatan depth dibatasi dan test set-nya besar.",
        "Butuh skor setinggi mungkin dan penjelasan bisa dibantu alat (SHAP, reason codes)? Gradient boosting — 0,7823 di notebook — dengan catatan gap train-test 0,0646 diawasi.",
        "Butuh angka kerugian, bukan peluang? Regresi — LGD dan EAD dijawab model regresi, bukan classifier. PD × LGD × EAD baru menjadi expected loss.",
        "Tidak yakin fitur mana yang penting? Mulai dari LR dan baca koefisiennya — PAY_DELAY_COUNT 0,756 sudah memberi tahu jawabannya sebelum GBM dijalankan.",
        "Validasi temporal — cara menguji yang tidak bisa ditipu waktu. Random stratified split (yang dipakai notebook, seed 42) mengacak 30.000 nasabah tanpa peduli bulan: nasabah September bisa masuk train, nasabah April masuk test. Itu mencampur pola waktu — model bisa «mengingat» pola akhir periode dan tampak lebih baik dari seharusnya. Validasi yang benar memotong WAKTU: latih pada bulan-bulan awal (train), verifikasi pada periode setelahnya (validation), dan uji terakhir pada periode paling akhir yang belum pernah dilihat model (out-of-time test). Aturannya keras: jangan hitung WoE, IV, mean, sd, atau threshold dari seluruh data sebelum split — semua itu harus dihitung dari train saja, lalu diterapkan ke validation dan OOT. Dan jangan pernah membuat fitur dari info sesudah cutoff: fitur yang memakai Oktober untuk memprediksi Oktober adalah leakage, bukan sinyal.",
        "Fakta struktural yang wajib jujur tentang UCI: dataset ini adalah SATU snapshot — fitur observasi September 2005, label default Oktober 2005. Tidak ada bulan-bulan berikutnya untuk dijadikan out-of-time test yang sesungguhnya. Jadi split OOT sungguhan TIDAK mungkin di dataset ini — yang diajarkan di sini adalah prinsip, timeline, dan aturannya, plus satu demonstrasi temporal dari dalam data: LR yang hanya memakai fitur April–Juli (cutoff Juli) mencapai ROC-AUC test 0,6922, sementara LR dengan semua fitur sampai September (cutoff September) mencapai 0,7426 [notebook] — selisih −0,0504. Dua bulan fitur terbaru membeli 0,05 ROC-AUC. Di produksi, efek ini jauh lebih besar: model yang dinilai dengan random split terlihat bagus, lalu jatuh saat dipakai bulan depan karena polanya sudah bergeser.",
        "Nilai: stabilitas IV PAY_0 (7 bin, nilai 4+ digabung) dihitung terpisah per split [notebook] — FULL 0,8761, TRAIN 0,8881, TEST 0,8363. IV yang turun dari train ke test adalah normal dan sehat — binning-nya tidak overfit. Dan profit per pelamar pada threshold 0,10 [notebook]: train NT$1.338 vs test NT$1.315 — selisih kecil, keputusan yang sama. Bila IV jatuh separuh atau profit berbalik tanda antara train dan test, itu alarm: binning atau threshold-nya bocor dari test.",
        "Peta M2.2 — apa yang menanti. Scorecard: mengubah LR menjadi poin yang bisa dijumlahkan tangan — Weight of Evidence (WoE) per bin, Information Value (IV) per fitur, dan skor akhir 500 + jumlah poin. Peta konsep saja — pengajaran penuhnya di lesson berikut.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Timeline Apr sampai Okt 2005: fitur Apr-Jul, fitur Agu-Sep, cutoff 30 Sep, label default Okt 2005">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Timeline: fitur observasi → cutoff → label masa depan</text>
<rect x="52" y="34" width="207" height="34" fill="var(--c3)" fill-opacity="0.35"/>
<text x="155.5" y="47" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">FITUR CUTOFF JULI</text>
<text x="155.5" y="62" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Apr–Jul 2005</text>
<rect x="259" y="34" width="138" height="34" fill="var(--c2)" fill-opacity="0.35"/>
<text x="328" y="47" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">FITUR AGU–SEP</text>
<text x="328" y="62" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2 bulan terbaru</text>
<rect x="397" y="34" width="69" height="34" fill="var(--c4)" fill-opacity="0.35"/>
<text x="431.5" y="47" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">LABEL</text>
<text x="431.5" y="62" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Okt 2005</text>
<line x1="52" y1="90" x2="466" y2="90" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="52.0" y1="84" x2="52.0" y2="96" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="110" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Apr</text>
<line x1="121.0" y1="84" x2="121.0" y2="96" stroke="var(--chart-text)" stroke-width="1"/>
<text x="121.0" y="110" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Mei</text>
<line x1="190.0" y1="84" x2="190.0" y2="96" stroke="var(--chart-text)" stroke-width="1"/>
<text x="190.0" y="110" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Jun</text>
<line x1="259.0" y1="84" x2="259.0" y2="96" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="110" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Jul</text>
<line x1="328.0" y1="84" x2="328.0" y2="96" stroke="var(--chart-text)" stroke-width="1"/>
<text x="328.0" y="110" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Agu</text>
<line x1="397.0" y1="76" x2="397.0" y2="104" stroke="var(--c4)" stroke-width="2.5"/>
<text x="397.0" y="126" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">cutoff 30 Sep</text>
<line x1="466.0" y1="84" x2="466.0" y2="96" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="110" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Okt</text>
<text x="240" y="150" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">LR cutoff Juli: ROC-AUC test 0,6922 · cutoff September: 0,7426 (selisih −0,0504)</text>
<text x="240" y="168" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">IV PAY_0: train 0,8881 · test 0,8363 (full 0,8761) — stabil, binning tidak overfit</text>
<text x="240" y="186" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Profit/pelamar @threshold 0,10: train NT$1.338 · test NT$1.315 — keputusan sama</text>
<text x="240" y="212" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">UCI = satu snapshot: split OOT sungguhan tidak mungkin di sini —</text>
<text x="240" y="228" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">yang diajarkan adalah prinsip + timeline + aturan, didemonstrasikan cutoff Juli vs September.</text>
</svg>`,
        alt: "Timeline Apr sampai Okt 2005: fitur Apr-Jul, fitur Agu-Sep, cutoff 30 Sep, label default Okt 2005.",
        caption: "Cara membaca: kotak = periode fitur dan label; garis merah = cutoff 30 Sep 2005 — tidak ada info sesudahnya yang boleh dipakai. Interpretasi: dua bulan fitur terbaru membeli 0,05 ROC-AUC; IV dan profit stabil train→test; OOT sungguhan tidak mungkin di satu snapshot UCI.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: tiga pelamar, dari PD ke keputusan",
      prose: [
        "Kembali ke tiga pelamar — sekarang dengan probabilitas, bukan label. Asumsi ilustrasi [ilustrasi] dari MLF1 dipakai lagi: limit Rp10.000.000, LGD 45 persen, margin bila lancar 5 persen dari limit (Rp500.000). PD tiap pelamar diilustrasikan dari hasil Lab 1: P1 PD 0,1741, P2 PD 0,9864, P3 PD 0,0000 — ingat, ini PD dari model 12 nasabah, dipakai sebagai ilustrasi cara berpikir, bukan sebagai angka produksi.",
        "P2: PD 0,9864 → EL = 0,9864 × 0,45 × Rp10.000.000 = Rp4.438.800. Margin bila lancar hanya Rp500.000. Kerugian yang diharapkan hampir sembilan kali margin. Keputusan: tolak.",
        "P1: PD 0,1741 → EL = 0,1741 × 0,45 × Rp10.000.000 = Rp783.450. Margin Rp500.000. EL masih di atas margin — meski model memprediksi «lancar» pada threshold 0,5, perhitungan EL berkata lain. Keputusan: tolak, atau setujui dengan limit jauh lebih kecil sehingga EL-nya turun di bawah margin.",
        "P3: PD 0,0000 → EL ≈ Rp0. Keputusan: setujui. Pelajaran mini-case ini: label «lancar» pada threshold 0,5 tidak sama dengan «menguntungkan». P1 lolos label tapi gagal EL — dan justru itulah gunanya probabilitas: ia mengubah keputusan dari «ya/tidak» menjadi «berapa besar risikonya, berapa besar untungnya». Threshold bisnis formal — 0,10 di notebook — adalah versi disiplin dari perhitungan ini, dan pengajaran penuhnya di M2.3.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab: LR dan tree di data UCI 30.000 nasabah",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada 12 nasabah. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m21-guided-task.ipynb.",
        "Di notebook itu kamu memuat dataset UCI yang sesungguhnya (30.000 nasabah), mereplikasi LR (ROC-AUC 0,7426) dan decision tree (stump 0,6443, depth-2 0,7153) dengan sklearn, membaca koefisien dan odds ratio, lalu membandingkan ketiganya dengan GBM 0,7823 — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "Buka di Colab: https://colab.research.google.com/drive/1q2p5KbstLASt8nATfSDsAx8VHs0LJmnu",
        "Jalur file notebook: colab/mlf-m21-guided-task.ipynb.",
        "Companion full-code untuk topik yang memetakan ke proyek nyata: notebook credit scoring end-to-end di Colab: https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO — di sana LR, tree, dan GBM dijalankan penuh pada 30.000 nasabah.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint: dari skor ke probabilitas",
      prose: [
        "Rangkuman: klasifikasi menjawab PD, regresi menjawab LGD dan EAD, ketiganya dikali menjadi EL. Logistic regression mengubah skor linear menjadi probabilitas lewat sigmoid; koefisiennya dibaca sebagai odds ratio. Stump PAY_0 ≥ 1,5 memisahkan default rate 0,1659 dari 0,6955 tapi ROC-AUC-nya baru 0,6443. GBM menang 0,0397 atas LR — dengan harga interpretabilitas.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Apa output logistic regression sebelum dipotong threshold?",
          options: [
            { text: "Label 0 atau 1", why: "Label baru muncul setelah probabilitas dipotong threshold — LR sendiri mengeluarkan probabilitas." },
            { text: "Probabilitas antara 0 dan 1", why: "Benar: sigmoid mengubah skor linear menjadi probabilitas; label adalah langkah berikutnya, bukan output LR.", correct: true },
            { text: "Skor tanpa batas", why: "Skor linear z memang tanpa batas, tapi sigmoid memetakannya ke 0–1." },
            { text: "Odds ratio", why: "Odds ratio adalah cara membaca koefisien, bukan output model untuk satu nasabah." },
          ],
        },
        {
          q: "Koefisien PAY_DELAY_COUNT pada LR (standardisasi) adalah 0,756. Berapa odds ratio-nya?",
          options: [
            { text: "0,756", why: "Itu koefisiennya, bukan odds ratio — odds ratio adalah e pangkat koefisien." },
            { text: "1,32", why: "Itu odds ratio PAY_MAX (koefisien 0,274), bukan PAY_DELAY_COUNT." },
            { text: "2,13", why: "Benar: e pangkat 0,756 sama dengan 2,13 — tiap tambahan satu simpangan baku jumlah bulan telat, odds default naik 2,13 kali.", correct: true },
            { text: "0,47", why: "1 dibagi 2,13 adalah 0,47 — itu kebalikan odds ratio, bukan odds ratio-nya." },
          ],
        },
        {
          q: "Stump PAY_0 ≥ 1,5: berapa default rate daun kanan (PAY_0 ≥ 2)?",
          options: [
            { text: "0,1659", why: "Itu default rate daun kiri (PAY_0 ≤ 1), bukan daun kanan." },
            { text: "0,2212", why: "Itu base rate seluruh dataset, bukan daun mana pun." },
            { text: "0,6955", why: "Benar: 2.177 default dari 3.130 nasabah telat — daun kanan berisi risiko tinggi, tapi bukan 100 persen default.", correct: true },
            { text: "0,6443", why: "Itu ROC-AUC stump, bukan default rate daun." },
          ],
        },
        {
          q: "LR ROC-AUC 0,7426, GBM 0,7823. Kenapa bank tetap memakai LR?",
          options: [
            { text: "Karena LR selalu lebih akurat", why: "Tidak — di notebook ini GBM lebih akurat (0,7823 vs 0,7426)." },
            { text: "Karena koefisien LR bisa dijelaskan ke regulator", why: "Benar: tiap koefisien bisa ditunjukkan dan dipertahankan; GBM butuh alat bantu penjelasan seperti SHAP.", correct: true },
            { text: "Karena GBM tidak mengeluarkan probabilitas", why: "GBM mengeluarkan probabilitas — masalahnya bukan outputnya, melainkan penjelasannya." },
            { text: "Karena LR tidak butuh data latih", why: "LR tetap butuh data latih — sama seperti model supervised lainnya." },
          ],
        },
        {
          q: "Mana yang dijawab regresi, bukan klasifikasi?",
          options: [
            { text: "PD — peluang default", why: "PD adalah klasifikasi: jawabannya peluang default atau tidak." },
            { text: "LGD — porsi exposure yang hilang bila default", why: "Benar: LGD adalah angka kontinu (berapa besar kerugiannya), jadi dijawab regresi.", correct: true },
            { text: "Default atau lancar", why: "Itu label klasifikasi biner." },
            { text: "Approve atau reject", why: "Itu keputusan dari threshold, bukan target regresi." },
          ],
        },
        {
          q: "PD 0,2, LGD 0,45, EAD Rp100.000.000. Berapa Expected Loss?",
          options: [
            { text: "Rp9.000.000", why: "Benar: 0,2 × 0,45 × 100.000.000 = 9.000.000.", correct: true },
            { text: "Rp45.000.000", why: "Itu LGD × EAD tanpa PD — kehilangan peluang defaultnya." },
            { text: "Rp20.000.000", why: "Itu PD × EAD tanpa LGD — menganggap seluruh exposure hilang." },
            { text: "Rp4.500.000", why: "Itu 0,1 × 0,45 × 100.000.000 — PD-nya setengah dari yang ditanya." },
          ],
        },
        {
          q: "GBM train ROC-AUC 0,8469, test 0,7823 — gap 0,0646. Apa diagnosis yang paling tepat?",
          options: [
            { text: "Model rusak — harus dibuang", why: "Test 0,7823 tetap lumayan; gap 0,0646 bukan tanda model rusak." },
            { text: "Overfitting perlu perhatian — gap 0,0646", why: "Benar: gap 0,8469 − 0,7823 = 0,0646 masuk band perlu perhatian 0,05–0,10 (MLF4); model sedikit overfit, masih layak dipakai dengan monitoring.", correct: true },
            { text: "Underfitting — model terlalu sederhana", why: "Underfitting ditandai train DAN test rendah; di sini train 0,8469 tinggi." },
            { text: "Tidak ada masalah — gap selalu ada", why: "Gap 0,0646 memang wajar, tapi bandnya berkata «perlu perhatian» — monitoring lebih ketat, bukan mengabaikan." },
          ],
        },
        {
          q: "P1 PD 0,1741. Apa keputusan pada threshold 0,50 versus threshold 0,10?",
          options: [
            { text: "0,50: tolak; 0,10: setujui", why: "Terbalik — threshold lebih tinggi berarti lebih banyak yang lolos, bukan sebaliknya." },
            { text: "Keduanya menolak P1", why: "Pada 0,50 P1 lolos: 0,1741 < 0,50." },
            { text: "0,50: setujui (lancar, 0,1741 < 0,50); 0,10: tolak (0,1741 > 0,10)", why: "Benar: 0,1741 < 0,50 → lancar/disetejui; 0,1741 > 0,10 → ditolak. «Lancar» bukan sifat pelamar, melainkan hasil threshold yang dipilih.", correct: true },
            { text: "Keduanya menyetujui P1", why: "Pada 0,10 P1 ditolak: 0,1741 > 0,10." },
          ],
        },
      ],
      summary: [
        "Klasifikasi menjawab PD, regresi menjawab LGD dan EAD; EL = PD × LGD × EAD.",
        "LR: sigmoid mengubah skor linear menjadi probabilitas; koefisien dibaca sebagai odds ratio (PAY_DELAY_COUNT 0,756 → OR 2,13).",
        "Stump PAY_0 ≥ 1,5: daun kiri 0,1659, daun kanan 0,6955; ROC-AUC baru 0,6443.",
        "GBM 0,7823 vs LR 0,7426 — selisih 0,0397 dengan harga interpretabilitas.",
        "PR-AUC lebih jujur pada data tak seimbang (GBM 0,5597 vs base rate 0,2212); balanced accuracy menimbang kedua kelas sama berat.",
        "Validasi temporal: latih di bulan awal, uji di periode akhir; WoE/IV/mean/threshold dihitung dari train saja — UCI satu snapshot, OOT sungguhan tidak mungkin.",
        "Lab: LR dari nol memprediksi P1 lancar, P2 default, P3 lancar; odds ratio lab ekstrem karena n = 12 dan separable.",
      ],
      next: { label: "Lanjut: MLF-M2.2 — Scorecard, WoE & IV", href: "/v2/learn/mlf-m22-scorecard-woe-iv" },
    },
  ],
};

import type { V2Lesson } from "../lib/types";

export const mlfM33: V2Lesson = {
  slug: "mlf-m33-velocity-benford",
  track: "Machine Learning Finance",
  module: "Unsupervised — fraud",
  title: "MLF-M3.3 — Velocity & Benford's Law: Sinyal dari Kecepatan dan Digit",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M3 adalah unsupervised — fraud: sinyal yang tidak butuh label. Dua lesson sebelumnya mengajarkan cara menemukan kelompok (clustering) dan cara menemukan yang aneh (anomaly detection). Lesson ini mengajarkan dua sinyal fraud klasik yang tidak butuh label sama sekali: velocity — seberapa cepat sesuatu terjadi — dan Benford's law — pola digit pertama yang dipatuhi angka-angka alami.",
        "Tujuan lesson ini:",
        "• Mendefinisikan velocity dengan jendela waktu yang eksplisit — dan menjelaskan kenapa velocity tanpa jendela adalah angka tanpa arti.",
        "• Membaca default rate per velocity band dari data UCI — termasuk kejutan bahwa arahnya tidak seperti dugaan.",
        "• Menghitung bill jump: tagihan melonjak vs rata-rata 5 bulan — dan membaca arahnya yang juga kontra-intuitif.",
        "• Menurunkan ekspektasi Benford P(d) = log10(1 + 1/d) dan menguji distribusi digit dengan chi-square — serta menjelaskan kenapa p-value kecil bukan vonis.",
        "• Menjalankan dua lab dari nol: velocity + band, dan uji Benford pada 20 angka — Lab 1 diperluas ke rolling velocity 1 jam/24 jam dengan ambang contoh.",
        "• Menghitung rolling velocity: jendela 1 jam/24 jam yang bergeser, rasio vs baseline pribadi, dan kenapa ambang harus dikalibrasi vs kapasitas review.",
        "• Memeriksa kelayakan Benford sebelum menguji: rentang, angka bulat, minimum n, dan koreksi multiple testing Benjamini–Hochberg.",
        "Isi lesson: cerita kartu 40x → velocity → velocity bands → bill jump → Benford & chi-square → 2 lab → rolling velocity → peta keputusan → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook: dataset UCI 30.000 nasabah, default rate 0,2212. Velocity diukur dari 6 bulan Apr–Sep 2005; Benford diuji pada BILL_AMT1 (n = 27.402, chi2 = 92,3) dan PAY_AMT1 (n = 24.751, chi2 = 995,5). Satuan mata uang UCI adalah NT$ (dolar Taiwan).",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Kartu yang tiba-tiba bertransaksi 40x sehari",
      prose: [
        "Kartu nasabah D selama ini tenang: rata-rata 2 transaksi per hari, tagihan bulanan stabil di kisaran yang sama. Selasa pagi, dalam 24 jam kartu itu dipakai 40 kali — dua puluh kali lipat dari biasanya — di merchant yang berbeda-beda. Sistem fraud menahan kartu dan menelepon nasabah. Ternyata memang nasabahnya sendiri: ia sedang belanja perlengkapan acara keluarga besar. Kartu dibuka lagi, acara berjalan, tidak ada fraud sama sekali.",
        "Cerita ini mengajukan tiga pertanyaan — dan ketiganya adalah isi lesson ini. Pertama, seberapa cepat? 40 transaksi dalam sehari adalah velocity: hitung kejadian dalam jendela waktu. Kedua, seberapa melonjak? Tagihan bulan itu dibanding rata-rata lima bulan sebelumnya adalah bill jump. Ketiga, seberapa wajar digitnya? Digit pertama angka-angka tagihan itu mengikuti Benford's law atau tidak?",
        "Nilai: ketiga sinyal ini tidak butuh label fraud. Tidak ada yang memberi tahu sistem mana transaksi yang fraud dan mana yang bukan — sinyalnya dibaca dari pola kecepatannya, lonjakannya, dan digitnya. Itulah kenapa ketiganya disebut unsupervised: mereka bekerja di tempat yang belum punya riwayat fraud berlabel.",
        "Baik atau buruk: sinyal cepat bagus untuk menangkap perubahan perilaku mendadak — 40x dalam sehari tidak menunggu laporan bulanan. Buruk bila dipakai sebagai vonis otomatis: nasabah D tidak melakukan fraud apa pun, dan pemblokiran otomatis tanpa verifikasi manusia adalah biaya yang dibayar nasabah yang tidak bersalah.",
        "Mitigasi: sinyal mengantrekan verifikasi manusia — telepon, konfirmasi, pemeriksaan pola merchant — bukan memblokir dan menghukum. Kecepatan sinyal harus diimbangi dengan kehati-hatian keputusan.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: sinyal fraud sama dengan bukti fraud",
        type: "pitfall",
        body: "Yang benar: velocity, bill jump, dan Benford adalah screening — mereka mengantrekan kasus untuk diperiksa. Bukti fraud datang dari investigasi (konfirmasi nasabah, pola merchant, device), bukan dari satu angka yang melewati ambang.",
      },
    },
    {
      id: "velocity",
      eyebrow: "Langkah 3 · Velocity",
      title: "Velocity: hitung kejadian dalam jendela waktu",
      prose: [
        "Velocity adalah hitungan kejadian dalam jendela waktu yang dinyatakan eksplisit. Di lesson ini velocity V didefinisikan sebagai jumlah bulan — dari 6 bulan observasi Apr–Sep 2005 — dengan PAY_AMT > 0. Tiga bagian definisi itu wajib ada: jendelanya (6 bulan, Apr–Sep 2005), satuannya (satu hitungan per bulan), dan ambangnya (membayar berapa pun dihitung 1; tidak membayar dihitung 0). V adalah bilangan bulat 0 sampai 6.",
        "Nilai: dari 30.000 nasabah UCI, 69,77% membayar di 5–6 bulan (band [5,7)) — membayar tiap bulan adalah perilaku normal di data ini [notebook]. Hanya 4,77% yang hampir tidak pernah membayar (band [0,1)). Velocity di sini mengukur frekuensi MEMBAYAR per bulan — bukan frekuensi TRANSAKSI fraud. UCI tidak punya stempel waktu transaksi, jadi velocity transaksi per jam tidak bisa dihitung dari dataset ini; V adalah versi yang bisa diukur dari UCI. Jangan klaim V mengukur apa yang tidak diukurnya.",
        "Gambar mentalnya: velocity tanpa jendela adalah angka tanpa arti. «40 transaksi» itu velocity 40/hari bila jendelanya sehari — tapi biasa saja bila jendelanya sebulan. Jendela lain untuk sinyal yang sama: 1 jam atau 24 jam untuk transaksi kartu (real-time), 7 hari untuk login, 6 bulan untuk pembayaran. Jendela yang berbeda mengukur perilaku yang berbeda — jangan campur.",
        "Baik atau buruk: velocity bagus untuk mendeteksi perubahan perilaku mendadak — lonjakan dari 2 menjadi 40 transaksi per hari terlihat dalam hitungan jam. Buruk bila jendelanya tidak dinyatakan (angka yang tidak bisa dibandingkan) atau bila musim tidak dikoreksi: belanja naik saat Harbolnas dan Lebaran tanpa ada fraud.",
        "Mitigasi: selalu tulis jendela + ambang bersama angkanya — «V = 3 dalam 6 bulan, ambang PAY_AMT > 0» — dan bandingkan dengan baseline nasabah itu sendiri, bukan hanya dengan populasi. Nasabah yang biasanya 2 transaksi sehari lalu menjadi 40 adalah cerita yang berbeda dari nasabah yang memang selalu 40 transaksi sehari.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: velocity tinggi berarti fraud",
        type: "pitfall",
        body: "Yang benar: velocity mengukur frekuensi, bukan niat. Nasabah D bertransaksi 40x sehari tanpa fraud. Velocity yang tinggi adalah alasan untuk bertanya, bukan jawaban.",
      },
    },
    {
      id: "bands",
      eyebrow: "Langkah 4 · Velocity bands",
      title: "Velocity bands: baca default rate per band — dan terkejutlah",
      prose: [
        "V mentah (0–6) terlalu halus untuk dibaca sebagai aturan, jadi ia dikelompokkan ke band half-open: [0,1), [1,3), [3,5), [5,7). Half-open berarti ujung kiri termasuk, ujung kanan tidak: V = 1 masuk [1,3), V = 3 masuk [3,5), V = 5 masuk [5,7). Tidak ada V yang masuk dua band, tidak ada V yang jatuh di antaranya.",
        "Nilai: default rate per band [notebook] — [0,1): n = 1.432 (4,77%), default 0,3799. [1,3): n = 2.306 (7,69%), default 0,2628. [3,5): n = 5.331 (17,77%), default 0,3281. [5,7): n = 20.931 (69,77%), default 0,1785. Base rate keseluruhan 0,2212.",
        "Gambar di bawah adalah kejutan lesson ini: band yang JARANG membayar justru default paling tinggi. [0,1) — nasabah yang hampir tidak pernah membayar dalam 6 bulan — default 0,3799, jauh di atas base rate. [5,7) — yang membayar tiap bulan — default 0,1785, terendah. Dan polanya tidak monoton: [1,3) 0,2628 lebih RENDAH dari [3,5) 0,3281. Band bukan tangga yang rapi — ia deskripsi data, bukan teori.",
        "Dugaan mekanisme [hipotesis, bukan fakta]: nasabah yang jarang membayar mungkin sedang kesulitan likuiditas — tagihannya tetap jalan, pembayarannya yang macet. Sebaliknya nasabah yang membayar tiap bulan menunjukkan kemampuan bayar. Dugaan ini masuk akal, tapi tetap dugaan: data ini tidak membuktikan sebabnya, hanya menunjukkan kelompoknya.",
        "Baik atau buruk: bands bagus untuk membaca risiko per kelompok dari data sendiri — 0,3799 vs 0,1785 adalah pemisah yang nyata. Buruk bila dipakai sebagai aturan tolak otomatis: 62% nasabah band [0,1) TIDAK default (1 − 0,3799 = 0,6201). Band berisi risiko, bukan vonis.",
        "Mitigasi: baca default rate per band dari datamu sendiri — jangan hafal arahnya. Di data ini velocity RENDAH yang berisiko; di data lain bisa sebaliknya, karena velocity mengukur frekuensi bayar, bukan frekuensi transaksi fraud. Dan baca ulang band-nya tiap periode: perilaku nasabah bergeser (drift), band yang dulu tajam bisa menumpul.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar default rate per velocity band: 0,3799; 0,2628; 0,3281; 0,1785">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Default rate per velocity band — jarang bayar justru paling berisiko</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="108.7" x2="466" y2="108.7" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="101.7" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">base rate 0,2212</text>
<rect x="78" y="38.8" width="64" height="167.2" fill="var(--c1)"/>
<text x="110" y="32.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3799</text>
<text x="110" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[0,1)</text>
<text x="110" y="236" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">n = 1.432</text>
<rect x="163" y="90.4" width="64" height="115.6" fill="var(--c1)"/>
<text x="195" y="84.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2628</text>
<text x="195" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[1,3)</text>
<text x="195" y="236" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">n = 2.306</text>
<rect x="248" y="61.6" width="64" height="144.4" fill="var(--c1)"/>
<text x="280" y="55.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3281</text>
<text x="280" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[3,5)</text>
<text x="280" y="236" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">n = 5.331</text>
<rect x="333" y="127.5" width="64" height="78.5" fill="var(--c1)"/>
<text x="365" y="121.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,1785</text>
<text x="365" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[5,7)</text>
<text x="365" y="236" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">n = 20.931</text>
</svg>`,
        alt: "Bar default rate per velocity band: 0,3799; 0,2628; 0,3281; 0,1785.",
        caption: "Cara membaca: X = band velocity half-open, Y = default rate; garis putus-putus = base rate 0,2212; n tiap band tertulis di bawah label. Interpretasi: band [0,1) tertinggi (0,3799) dan [5,7) terendah (0,1785) — jarang membayar justru paling berisiko; polanya tidak monoton ([1,3) 0,2628 di bawah [3,5) 0,3281).",
      },
      tasks: [],
    },
    {
      id: "bill-jump",
      eyebrow: "Langkah 5 · Bill jump",
      title: "Bill jump: tagihan melonjak vs rata-rata 5 bulan",
      prose: [
        "Bill jump mengukur lonjakan, bukan frekuensi: R = BILL_AMT1 / mean(BILL_AMT2..BILL_AMT6). Tagihan September 2005 dibagi rata-rata tagihan lima bulan sebelumnya (Apr–Agu 2005). R ≥ 2 berarti tagihan bulan terakhir sedikitnya dua kali rata-rata sebelumnya — «melonjak». R di bawah 2 berarti tagihannya biasa saja. Satu syarat: R hanya dihitung bila rata-rata lima bulan sebelumnya POSITIF. Bila rata-ratanya nol atau negatif (kartu dormant atau saldo kredit), rasionya tidak bermakna — 1.512 nasabah seperti itu dikeluarkan dari analisis ini, dan analisis berjalan pada 28.488 nasabah.",
        "Nilai: R ≥ 2: n = 4.056, default 0,1593. R < 2: n = 24.432, default 0,2261 [notebook] — dihitung pada 28.488 nasabah yang baseline-nya positif; 1.512 nasabah dengan rata-rata tagihan 5 bulan ≤ 0 dikeluarkan, karena rasio terhadap baseline nol atau negatif tidak bermakna. Lagi-lagi kontra-intuitif: tagihan yang melonjak justru default LEBIH RENDAH — 0,1593 vs 0,2261. Nasabah yang tagihannya melonjak dua kali lipat ternyata lebih aman daripada nasabah yang tagihannya datar.",
        "Dugaan mekanisme [hipotesis, bukan fakta]: belanja besar yang melonjak sering kali direncanakan — naik limit, beli barang tahan lama, bayar biaya tahunan — oleh nasabah aktif yang mampu. Sementara tagihan yang datar bisa berarti kartu dormant dengan saldo lama yang macet: tidak ada belanja baru, tapi saldo lama tidak kunjung lunas.",
        "Dua kasus batas yang ditangani eksplisit di notebook [notebook]: 867 nasabah adalah kartu dormant — BILL_AMT1 = 0 DAN kelima tagihan sebelumnya 0 — sehingga R = 0/0 tak terdefinisi. Dan 390 nasabah punya BILL_AMT1 > 0 sementara mean 5 bulan sebelumnya 0 — tagihan muncul dari nol — sehingga R tak hingga. Keduanya punya mean 5 bulan = 0, jadi keduanya termasuk dalam 1.512 nasabah yang dikeluarkan dari analisis — bukan dimasukkan ke kelompok R mana pun, bukan ditetapkan sebagai R = 0, bukan dimasukkan ke kelompok R ≥ 2. Hitungannya: nasabah dormant (mean = 0) ada 1.258 — 867 + 390 = 1.257 di antaranya dijelaskan di atas, 1 sisanya juga dikeluarkan; ditambah 254 nasabah bermean negatif, total yang dikeluarkan 1.258 + 254 = 1.512.",
        "Baik atau buruk: bill jump bagus sebagai pemicu review — «tagihan nasabah ini dua kali rata-rata, periksa» — karena ia menangkap perubahan, bukan level. Buruk sebagai vonis: 15,93% kelompok melonjak tetap default (bukan nol), dan 22,61% kelompok tidak melonjak juga default. Sinyal ini tidak memisahkan dengan bersih — ia memisahkan 0,1593 dari 0,2261, bukan 0 dari 1.",
        "Mitigasi: perlakukan bill jump sebagai satu suara dalam paduan suara, bukan solois. Gabungkan dengan velocity (apakah ia juga jarang membayar?), dengan riwayat telat (PAY_0), dan dengan verifikasi manusia — dan ingat pelajaran band tadi: arah sinyal dibaca dari data, bukan dihafal.",
      ],
      tasks: [],
    },
    {
      id: "benford",
      eyebrow: "Langkah 6 · Benford's law & uji chi-square",
      title: "Benford's law: digit pertama yang bercerita — dan uji yang mengujinya",
      prose: [
        "Benford's law berkata: pada angka-angka yang muncul secara alami — bukan hasil penetapan manusia — digit pertama d muncul dengan peluang P(d) = log10(1 + 1/d). Digit 1 paling sering, digit 9 paling jarang. Tabel ekspektasi lengkapnya (4 desimal): digit 1: 0,3010; digit 2: 0,1761; digit 3: 0,1249; digit 4: 0,0969; digit 5: 0,0792; digit 6: 0,0669; digit 7: 0,0580; digit 8: 0,0512; digit 9: 0,0458. Jumlahnya 1,0000.",
        "Kenapa digit 1 paling sering? Karena angka tumbuh secara perkalian: dari 100 ke 199 semua berdigit pertama 1 — seratus angka — sementara dari 900 ke 999 juga seratus angka, tapi angka-angka itu lebih jarang dicapai bila pertumbuhannya proporsional. Tagihan kartu kredit — angka yang tumbuh dari pemakaian — diharapkan mengikuti pola ini bila tidak ada yang memanipulasinya.",
        "Uji chi-square membandingkan count observasi per digit dengan count ekspektasi (n × P(d)): chi2 = jumlah atas 9 digit dari (O − E)² / E, dengan df = 8 (9 digit dikurangi 1). Ambang kritisnya 15,51 pada α = 0,05: chi2 di atas itu berarti distribusi digit menyimpang dari Benford secara statistik. Yang diuji adalah distribusi — bukan satu nasabah, bukan satu transaksi.",
        "Nilai: BILL_AMT1 (n = 27.402, hanya tagihan > 0) [notebook] — chi2 = 92,3, df = 8, p ≈ 1,1e-16. Jauh di atas 15,51: distribusi digit tagihan MENYIMPANG dari Benford secara statistik. Tapi baca besarnya: digit 1 observasi 0,3075 vs ekspektasi 0,3010 — selisih hanya 0,0065. Digit 9 observasi 0,0435 vs ekspektasi 0,0458. Selisih digit terbesar di sembilan digit hanya 0,0130 (digit 4), dan MAD (rata-rata selisih absolut) hanya 0,0051 [notebook].",
        "Nilai: PAY_AMT1 (n = 24.751, hanya pembayaran > 0) [notebook] — chi2 = 995,5, df = 8, p ≈ 0. Penyimpangannya jauh lebih besar: digit 1 observasi 0,3305 vs ekspektasi 0,3010 (selisih 0,0295), dan digit 9 observasi 0,0226 vs ekspektasi 0,0458 — SETENGAH dari ekspektasi. Selisih digit terbesar 0,0295 dan MAD 0,0193 — hampir empat kali MAD tagihan. Gambar di bawah membandingkan observasi vs ekspektasi per digit untuk BILL_AMT1.",
        "Kenapa digit 9 pembayaran begitu jarang? Karena pembayaran adalah angka yang DIPILIH manusia: orang membayar 10.000, 50.000, atau lunas penuh — angka bulat yang digit pertamanya 1 atau 5. Digit 9 jarang jadi digit pertama angka bulat. Ini perilaku normal, bukan fraud — dan justru itulah pelajaran Benford: penyimpangan dari Benford sering kali bercerita tentang perilaku manusia, bukan tentang kejahatan.",
        "Dan inilah pelajaran statistiknya: dengan n = 27.402, chi-square hampir selalu «signifikan». Selisih digit 1 sebesar 0,0065 sudah cukup menghasilkan p ≈ 1,1e-16 — karena chi-square tumbuh bersama n. Jadi p-value kecil bukan vonis: ia menjawab «apakah penyimpangannya nyata secara statistik?», bukan «apakah penyimpangannya BESAR?». Untuk besarnya, baca effect size: selisih per digit dan MAD — berdampingan dengan p-value, tidak pernah sendirian.",
        "Baik atau buruk: Benford bagus sebagai screening portofolio tanpa label — «segmen ini digitnya aneh, antrekan untuk audit». Buruk bila dipakai menuduh satu nasabah (uji ini tentang distribusi, bukan individu) atau bila datanya memang hasil penetapan manusia — harga, limit, dan angka bulat tidak wajib mengikuti Benford.",
        "Mitigasi: laporkan p-value + effect size berdampingan; tindak lanjut dari penyimpangan Benford adalah antrean audit, bukan blokir. Dan sebelum menuduh, tanyakan dulu: apakah angka-angka ini memang seharusnya mengikuti Benford?",
        "Kelayakan Benford — sebelum menguji, tanyakan apakah datanya memang seharusnya mengikuti Benford. Checklistnya: (1) rentang log10 — angka harus menjangkau beberapa orde besaran (tagihan NT$100–100.000 menjangkau tiga orde; harga yang dipatok 10.000–12.000 tidak); (2) proporsi angka bulat — bila sebagian besar angka berakhiran 000, digit pertamanya ditentukan manusia, bukan alam; (3) pisahkan angka yang dibatasi aturan — limit, harga minimum, dan biaya tetap tidak mengikuti Benford; (4) minimum n — dengan n = 20, selisih digit 1 sebesar 0,15 pun tidak signifikan (Lab 2); (5) koreksi multiple testing bila menguji banyak segmen; (6) laporkan effect size + CI + jumlah segmen berdampingan dengan p-value.",
        "Contoh multiple testing [ilustrasi]: 100 merchant diuji satu per satu pada α = 0,05 — 12 merchant punya p < 0,05. Tanpa koreksi, 12 itu akan dilaporkan sebagai «menyimpang». Dengan Benjamini–Hochberg (q = 0,05): urutkan p dari terkecil — rank 1: p = 0,0003 ≤ 1/100 × 0,05 = 0,0005 lolos; rank 2: p = 0,0009 ≤ 2/100 × 0,05 = 0,0010 lolos; rank 3: p = 0,004 > 3/100 × 0,05 = 0,0015 gugur — dan semua rank sesudahnya ikut gugur. Hasil: 2 dari 12 merchant tetap signifikan. Dari 2 yang lolos, hanya 1 yang effect size-nya besar untuk diaudit [ilustrasi]. Pelajarannya: menguji 100 segmen tanpa koreksi sama dengan menguji dengan α = 0,05 sebanyak 100 kali — false positive adalah kepastian statistik, bukan kecelakaan.",
      ],
      formula: String.raw`P(d) = \log_{10}\left(1 + \frac{1}{d}\right), \quad d = 1, \dots, 9`,
      formulaNote: "Peluang Benford digit pertama d. Digit 1: 0,3010; digit 9: 0,0458. Uji chi-square-nya: chi2 = jumlah (O − E)² / E atas 9 digit, E = n × P(d), df = 8, ambang kritis 15,51 pada α = 0,05.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar berkelompok Benford BILL_AMT1: observasi vs ekspektasi per digit 1 sampai 9">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Benford BILL_AMT1 — observasi vs ekspektasi per digit</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="155.7" x2="52" y2="155.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="158.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<line x1="48" y1="105.4" x2="52" y2="105.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="108.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="55.1" x2="52" y2="55.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="58.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="62" y="51.4" width="18" height="154.6" fill="var(--c1)"/>
<rect x="84" y="54.6" width="18" height="151.4" fill="var(--c2)"/>
<text x="71" y="47.4" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,3075</text>
<text x="93" y="50.6" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,3010</text>
<text x="82" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<rect x="108" y="120.2" width="18" height="85.8" fill="var(--c1)"/>
<rect x="130" y="117.4" width="18" height="88.6" fill="var(--c2)"/>
<text x="117" y="116.2" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,1707</text>
<text x="139" y="113.4" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,1761</text>
<text x="128" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<rect x="154" y="147.0" width="18" height="59.0" fill="var(--c1)"/>
<rect x="176" y="143.2" width="18" height="62.8" fill="var(--c2)"/>
<text x="163" y="143.0" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,1174</text>
<text x="185" y="139.2" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,1249</text>
<text x="174" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<rect x="200" y="150.7" width="18" height="55.3" fill="var(--c1)"/>
<rect x="222" y="157.3" width="18" height="48.7" fill="var(--c2)"/>
<text x="209" y="146.7" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,1099</text>
<text x="231" y="153.3" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,0969</text>
<text x="220" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<rect x="246" y="167.0" width="18" height="39.0" fill="var(--c1)"/>
<rect x="268" y="166.2" width="18" height="39.8" fill="var(--c2)"/>
<text x="255" y="163.0" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,0776</text>
<text x="277" y="162.2" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,0792</text>
<text x="266" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5</text>
<rect x="292" y="175.5" width="18" height="30.5" fill="var(--c1)"/>
<rect x="314" y="172.4" width="18" height="33.6" fill="var(--c2)"/>
<text x="301" y="171.5" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,0607</text>
<text x="323" y="168.4" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,0669</text>
<text x="312" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6</text>
<rect x="338" y="175.4" width="18" height="30.6" fill="var(--c1)"/>
<rect x="360" y="176.8" width="18" height="29.2" fill="var(--c2)"/>
<text x="347" y="171.4" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,0608</text>
<text x="369" y="172.8" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,0580</text>
<text x="358" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">7</text>
<rect x="384" y="180.0" width="18" height="26.0" fill="var(--c1)"/>
<rect x="406" y="180.3" width="18" height="25.7" fill="var(--c2)"/>
<text x="393" y="176.0" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,0518</text>
<text x="415" y="176.3" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,0512</text>
<text x="404" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">8</text>
<rect x="430" y="184.1" width="18" height="21.9" fill="var(--c1)"/>
<rect x="452" y="183.0" width="18" height="23.0" fill="var(--c2)"/>
<text x="439" y="180.1" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,0435</text>
<text x="461" y="179.0" text-anchor="middle" font-size="8" fill="var(--text)" font-family="var(--font-ui)">0,0458</text>
<text x="450" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">9</text>
<text x="240" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">biru = observasi BILL_AMT1 (n = 27.402) · hijau = ekspektasi Benford</text>
</svg>`,
        alt: "Bar berkelompok Benford BILL_AMT1: observasi vs ekspektasi per digit 1 sampai 9.",
        caption: "Cara membaca: tiap digit punya dua bar — observasi BILL_AMT1 (biru) dan ekspektasi Benford (hijau); n = 27.402. Interpretasi: batang-batangnya berdekatan — selisih terbesar hanya 0,0130 (digit 4) — meski chi2 = 92,3 dan p ≈ 1,1e-16; p-value kecil dengan effect size kecil adalah screening, bukan bukti fraud.",
      },
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab: velocity dari 6 bulan pembayaran + rolling 1 jam",
      prose: [
        "Sekarang giliranmu menghitung velocity. Datanya 3 nasabah dengan pembayaran 6 bulan (Apr–Sep, NT$) — 0 berarti tidak membayar bulan itu. Hitung V tiap nasabah (jumlah bulan dengan pembayaran > 0), tentukan band-nya dengan fungsi velocity_band(), lalu baca default rate band-nya dari notebook UCI.",
        "Perhatikan nasabah A: ia hanya membayar sekali dalam 6 bulan (V = 1, band [1,3)) — tapi default rate band-nya 0,2628, lebih rendah dari band [0,1) 0,3799. Satu bulan membayar saja sudah membedakannya dari nasabah yang tidak membayar sama sekali. Dan nasabah C membayar tiap bulan (V = 6, band [5,7)) — default rate band-nya 0,1785, terendah.",
        "Tugas ketiga tidak butuh kode — hanya membaca: band mana di antara A, B, C yang default rate-nya tertinggi, dan apakah itu band dengan V tertinggi? Jawabannya mengulang pelajaran langkah 4: tidak — band B ([3,5), 0,3281) mengalahkan band A dan C, dan di data UCI band [0,1)-lah yang tertinggi.",
        "Bagian 2 — rolling velocity 1 jam pada akun F (hari ke-7) dari langkah 9 [ilustrasi]: 12 transaksi burst 10:01–10:45 di 6 merchant, NT$8.446–14.216, 3 device. Hitung max1h dengan jendela 1 jam yang BERGESER (tiap transaksi jadi awal jendela), merchant unik dalam jendela tersibuk, total 24 jam, lalu terapkan ketiga ambang [ilustrasi] (≥10 txn/1j; ≥5 merchant unik/1j; total 24j > NT$100.000). Semua dengan stdlib saja — datetime untuk parsing jam.",
      ],
      tasks: [
        { id: "t1", text: "Hitung V tiap nasabah: jumlah bulan dengan pembayaran > 0" },
        { id: "t2", text: "Tentukan band tiap nasabah dengan velocity_band() dan baca default rate band-nya" },
        { id: "t3", text: "Bandingkan: band mana yang default rate-nya tertinggi di antara A, B, C — dan apakah itu band dengan V tertinggi?" },
        { id: "t4", text: "Hitung max1h akun F: jumlah transaksi terbanyak dalam jendela 1 jam yang bergeser" },
        { id: "t5", text: "Hitung merchant unik dalam jendela tersibuk, total 24 jam, dan device unik burst" },
        { id: "t6", text: "Terapkan ketiga ambang [ilustrasi] dan tentukan: apakah akun F di-alert?" },
      ],
      expected: "nasabah A: V=1 band=[1,3) default rate band=0.2628\nnasabah B: V=3 band=[3,5) default rate band=0.3281\nnasabah C: V=6 band=[5,7) default rate band=0.1785\nnasabah B bulan bayar: 3 dari 6 bulan\nband nasabah C: [5,7)\nmax1h: 12 transaksi (jendela 10:01-10:45)\nmerchant unik 1 jam tersibuk: 6\ntotal 24 jam: NT$139.233\ndevice unik (12 txn burst): 3\nambang terlampaui: 3 dari 3 — >=10 txn/1j (12); >=5 merchant/1j (6); total 24j > NT$100.000 (139.233)",
      hints: [
        "Velocity = jumlah bulan dengan p > 0 — sum(1 for p in pays if p > 0).",
        "Band mengikuti batas half-open: v < 1 → [0,1); v < 3 → [1,3); v < 5 → [3,5); selain itu [5,7).",
      ],
      code: {
        starter: `# Pembayaran 6 bulan (Apr-Sep, NT$) untuk 3 nasabah; 0 = tidak membayar bulan itu
payments = {
    "A": [0, 0, 0, 0, 0, 5000],
    "B": [12000, 0, 8000, 0, 15000, 0],
    "C": [5000, 3000, 7000, 2000, 4000, 6000],
}
# Default rate per band dari notebook UCI (30.000 nasabah)
band_default = {"[0,1)": 0.3799, "[1,3)": 0.2628, "[3,5)": 0.3281, "[5,7)": 0.1785}

def velocity_band(v):
    if v < 1:
        return "[0,1)"
    if v < 3:
        return "[1,3)"
    if v < 5:
        return "[3,5)"
    return "[5,7)"

velocity_list = []
band_list = []
for name, pays in payments.items():
    v = 0  # TODO t1: jumlah bulan dengan p > 0
    band = "[0,1)"  # TODO t2: velocity_band(v)
    velocity_list.append(v)
    band_list.append(band)
    print(f"nasabah {name}: V={v} band={band} default rate band={band_default[band]:.4f}")
print(f"nasabah B bulan bayar: {velocity_list[1]} dari 6 bulan")
print(f"band nasabah C: {band_list[2]}")

# --- Bagian 2: rolling velocity 1 jam (akun F, hari ke-7) ---
from datetime import datetime

# 12 transaksi burst akun F, hari ke-7 [ilustrasi]: (jam, merchant, NT$, device)
burst = [
    ("10:01", "M1", 10817, "D-F0"),
    ("10:05", "M2", 13760, "D-F1"),
    ("10:09", "M3", 11818, "D-F2"),
    ("10:13", "M4", 11104, "D-F0"),
    ("10:17", "M5", 11153, "D-F1"),
    ("10:21", "M6", 9590, "D-F2"),
    ("10:25", "M1", 8645, "D-F0"),
    ("10:29", "M2", 11882, "D-F1"),
    ("10:33", "M3", 14216, "D-F2"),
    ("10:37", "M4", 8446, "D-F0"),
    ("10:41", "M5", 14008, "D-F1"),
    ("10:45", "M6", 13794, "D-F2"),
]
mins = [datetime.strptime(t, "%H:%M").hour * 60 + datetime.strptime(t, "%H:%M").minute for t, _, _, _ in burst]

def idr(n):
    return f"{n:,}".replace(",", ".")

# max1h: jendela 1 jam yang bergeser — tiap transaksi jadi awal jendela
max1h = 0  # TODO t4: jumlah transaksi terbanyak dalam jendela 1 jam
best_start = 0  # TODO t4: menit awal jendela tersibuk
best_end = 0  # TODO t4: menit akhir jendela tersibuk
# TODO t4: loop tiap transaksi sebagai awal jendela m0,
# hitung transaksi dalam [m0, m0+60), simpan yang terbanyak
window = [(t, m, a, d) for (t, m, a, d), mm in zip(burst, mins) if best_start <= mm < best_start + 60]
uniq_merch = 0  # TODO t5: merchant unik dalam jendela tersibuk
total24 = 0  # TODO t5: total NT$ 24 jam hari ke-7
dev_burst = 0  # TODO t5: device unik dalam 12 txn burst
print(f"max1h: {max1h} transaksi (jendela {best_start // 60:02d}:{best_start % 60:02d}-{best_end // 60:02d}:{best_end % 60:02d})")
print(f"merchant unik 1 jam tersibuk: {uniq_merch}")
print("total 24 jam: NT$" + idr(total24))
print(f"device unik (12 txn burst): {dev_burst}")
hit = []  # TODO t6: terapkan ketiga ambang [ilustrasi] (>=10 txn/1j; >=5 merchant/1j; total 24j > NT$100.000)
print(f"ambang terlampaui: {len(hit)} dari 3 — {'; '.join(hit)}")`,
        lockLines: 21,
        solution: `# Pembayaran 6 bulan (Apr-Sep, NT$) untuk 3 nasabah; 0 = tidak membayar bulan itu
payments = {
    "A": [0, 0, 0, 0, 0, 5000],
    "B": [12000, 0, 8000, 0, 15000, 0],
    "C": [5000, 3000, 7000, 2000, 4000, 6000],
}
# Default rate per band dari notebook UCI (30.000 nasabah)
band_default = {"[0,1)": 0.3799, "[1,3)": 0.2628, "[3,5)": 0.3281, "[5,7)": 0.1785}

def velocity_band(v):
    if v < 1:
        return "[0,1)"
    if v < 3:
        return "[1,3)"
    if v < 5:
        return "[3,5)"
    return "[5,7)"

velocity_list = []
band_list = []
for name, pays in payments.items():
    v = sum(1 for p in pays if p > 0)
    band = velocity_band(v)
    velocity_list.append(v)
    band_list.append(band)
    print(f"nasabah {name}: V={v} band={band} default rate band={band_default[band]:.4f}")
print(f"nasabah B bulan bayar: {velocity_list[1]} dari 6 bulan")
print(f"band nasabah C: {band_list[2]}")

# --- Bagian 2: rolling velocity 1 jam (akun F, hari ke-7) ---
from datetime import datetime

# 12 transaksi burst akun F, hari ke-7 [ilustrasi]: (jam, merchant, NT$, device)
burst = [
    ("10:01", "M1", 10817, "D-F0"),
    ("10:05", "M2", 13760, "D-F1"),
    ("10:09", "M3", 11818, "D-F2"),
    ("10:13", "M4", 11104, "D-F0"),
    ("10:17", "M5", 11153, "D-F1"),
    ("10:21", "M6", 9590, "D-F2"),
    ("10:25", "M1", 8645, "D-F0"),
    ("10:29", "M2", 11882, "D-F1"),
    ("10:33", "M3", 14216, "D-F2"),
    ("10:37", "M4", 8446, "D-F0"),
    ("10:41", "M5", 14008, "D-F1"),
    ("10:45", "M6", 13794, "D-F2"),
]
mins = [datetime.strptime(t, "%H:%M").hour * 60 + datetime.strptime(t, "%H:%M").minute for t, _, _, _ in burst]

def idr(n):
    return f"{n:,}".replace(",", ".")

# max1h: jendela 1 jam yang bergeser — tiap transaksi jadi awal jendela
max1h = 0
best_start = 0
best_end = 0
for i, m0 in enumerate(mins):
    c = sum(1 for m in mins if m0 <= m < m0 + 60)
    if c > max1h:
        max1h = c
        best_start = m0
        best_end = max(m for m in mins if m0 <= m < m0 + 60)
window = [(t, m, a, d) for (t, m, a, d), mm in zip(burst, mins) if best_start <= mm < best_start + 60]
uniq_merch = len({m for _, m, _, _ in window})
total24 = sum(a for _, _, a, _ in burst)
dev_burst = len({d for _, _, _, d in burst})
print(f"max1h: {max1h} transaksi (jendela {best_start // 60:02d}:{best_start % 60:02d}-{best_end // 60:02d}:{best_end % 60:02d})")
print(f"merchant unik 1 jam tersibuk: {uniq_merch}")
print("total 24 jam: NT$" + idr(total24))
print(f"device unik (12 txn burst): {dev_burst}")
hit = []
if max1h >= 10:
    hit.append(f">=10 txn/1j ({max1h})")
if uniq_merch >= 5:
    hit.append(f">=5 merchant/1j ({uniq_merch})")
if total24 > 100000:
    hit.append(f"total 24j > NT$100.000 ({idr(total24)})")
print(f"ambang terlampaui: {len(hit)} dari 3 — {'; '.join(hit)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "velocity_list", value: [1, 3, 6], label: "`velocity_list` seharusnya [1, 3, 6]", msg: "A membayar 1 bulan, B 3 bulan, C 6 bulan — hitung bulan dengan p > 0." },
          { kind: "equal", task: "t2", name: "band_list", value: ["[1,3)", "[3,5)", "[5,7)"], label: "`band_list` seharusnya [[1,3), [3,5), [5,7)]", msg: "V = 1 masuk [1,3); V = 3 masuk [3,5); V = 6 masuk [5,7) — batas half-open." },
          { kind: "stdout_matches", task: "t2", pattern: "nasabah B: V=3 band=\\[3,5\\) default rate band=0\\.3281", label: "Output menampilkan nasabah B di band [3,5) dengan default rate 0.3281", msg: "Format: nasabah B: V=3 band=[3,5) default rate band=0.3281." },
          { kind: "equal", task: "t4", name: "max1h", value: 12, label: "`max1h` seharusnya 12", msg: "12 transaksi burst F jatuh dalam 44 menit (10:01–10:45) — semuanya masuk satu jendela 1 jam." },
          { kind: "equal", task: "t5", name: "uniq_merch", value: 6, label: "`uniq_merch` seharusnya 6", msg: "Jendela tersibuk memakai 6 merchant berbeda (M1–M6)." },
          { kind: "equal", task: "t5", name: "total24", value: 139233, label: "`total24` seharusnya 139.233", msg: "Jumlah 12 transaksi burst F: NT$139.233." },
          { kind: "stdout_matches", task: "t6", pattern: "ambang terlampaui: 3 dari 3", label: "Output menampilkan ambang terlampaui: 3 dari 3", msg: "Akun F melampaui ketiga ambang [ilustrasi] — ≥10 txn/1j, ≥5 merchant/1j, total 24j > NT$100.000." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab: uji Benford pada 20 angka",
      prose: [
        "Lab kedua menguji Benford pada 20 angka tagihan kecil. Ambil digit pertama tiap angka, hitung proporsi observasi per digit, bandingkan dengan ekspektasi Benford, lalu jumlahkan chi-square-nya.",
        "Hasilnya: chi2 = 4,9577 dengan df = 8 [lab]. Ambang kritisnya 15,51 pada α = 0,05 — 4,9577 jauh di bawah itu, jadi 20 angka ini TIDAK menyimpang dari Benford. Perhatikan digit 1: observasi 0,1500 vs ekspektasi 0,3010 — separuh dari yang diharapkan — tapi dengan n = 20, selisih itu belum cukup untuk signifikan. Inilah kebalikan dari pelajaran langkah 6: n kecil membuat selisih besar tampak tidak signifikan, n besar membuat selisih kecil tampak signifikan. Chi-square selalu dibaca bersama n.",
        "Pelajaran lab ini: uji Benford butuh n yang cukup. Dua puluh angka tidak cukup untuk menuduh apa pun — dan 27.402 angka cukup untuk membuat selisih 0,0065 menjadi «signifikan». Keduanya benar secara statistik; keduanya harus dibaca dengan effect size.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi first_digit: ambil digit pertama tiap angka" },
        { id: "t2", text: "Lengkapi penjumlahan chi-square tiap digit" },
        { id: "t3", text: "Bandingkan chi2 = 4,9577 dengan ambang kritis df = 8 (15,51 pada α = 0,05): apakah 20 angka ini menyimpang dari Benford?" },
      ],
      expected: "digit 1: observasi=0.1500 ekspektasi=0.3010 count=3\ndigit 2: observasi=0.1500 ekspektasi=0.1761 count=3\ndigit 3: observasi=0.1000 ekspektasi=0.1249 count=2\ndigit 4: observasi=0.1000 ekspektasi=0.0969 count=2\ndigit 5: observasi=0.1000 ekspektasi=0.0792 count=2\ndigit 6: observasi=0.1000 ekspektasi=0.0669 count=2\ndigit 7: observasi=0.1000 ekspektasi=0.0580 count=2\ndigit 8: observasi=0.1000 ekspektasi=0.0512 count=2\ndigit 9: observasi=0.1000 ekspektasi=0.0458 count=2\nn=20 chi2=4.9577 df=8\nekspektasi digit 2: 0.1761\ndigit 1 observasi: 0.1500",
      hints: [
        "Digit pertama: bagi x dengan 10 sampai x < 10.",
        "Chi-square = jumlah (O − E)² / E atas 9 digit; E = n × ekspektasi.",
      ],
      code: {
        starter: `import math

# 20 angka tagihan (NT$) — digit pertama sengaja tersebar 1..9
amounts = [1234, 256, 3890, 45, 512, 678, 71, 890, 923, 1050,
           2345, 312, 478, 59, 612, 745, 82, 917, 133, 276]
# Ekspektasi Benford P(d) = log10(1 + 1/d), 4 desimal
benford = {d: math.log10(1 + 1 / d) for d in range(1, 10)}

def first_digit(x):
    d = 1  # TODO t1: ambil digit pertama (bagi 10 sampai < 10)
    return d

counts = {d: 0 for d in range(1, 10)}
for a in amounts:
    counts[first_digit(a)] += 1
n = len(amounts)
chi2 = 0.0
for d in range(1, 10):
    obs = counts[d] / n
    exp = benford[d]
    chi2 += 0.0  # TODO t2: (counts[d] - n * exp) ** 2 / (n * exp)
    print(f"digit {d}: observasi={obs:.4f} ekspektasi={exp:.4f} count={counts[d]}")
print(f"n={n} chi2={chi2:.4f} df=8")
print(f"ekspektasi digit 2: {benford[2]:.4f}")
print(f"digit 1 observasi: {counts[1] / n:.4f}")`,
        lockLines: 9,
        solution: `import math

# 20 angka tagihan (NT$) — digit pertama sengaja tersebar 1..9
amounts = [1234, 256, 3890, 45, 512, 678, 71, 890, 923, 1050,
           2345, 312, 478, 59, 612, 745, 82, 917, 133, 276]
# Ekspektasi Benford P(d) = log10(1 + 1/d), 4 desimal
benford = {d: math.log10(1 + 1 / d) for d in range(1, 10)}

def first_digit(x):
    while x >= 10:
        x //= 10
    return x

counts = {d: 0 for d in range(1, 10)}
for a in amounts:
    counts[first_digit(a)] += 1
n = len(amounts)
chi2 = 0.0
for d in range(1, 10):
    obs = counts[d] / n
    exp = benford[d]
    chi2 += (counts[d] - n * exp) ** 2 / (n * exp)
    print(f"digit {d}: observasi={obs:.4f} ekspektasi={exp:.4f} count={counts[d]}")
print(f"n={n} chi2={chi2:.4f} df=8")
print(f"ekspektasi digit 2: {benford[2]:.4f}")
print(f"digit 1 observasi: {counts[1] / n:.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "chi2", value: 4.9577, tol: 0.0001, label: "`chi2` seharusnya 4.9577", msg: "Jumlah (O − E)² / E atas 9 digit dengan n = 20 — di bawah ambang kritis 15,51." },
          { kind: "stdout_matches", task: "t2", pattern: "n=20 chi2=4\\.9577 df=8", label: "Output menampilkan n = 20, chi2 = 4.9577, df = 8", msg: "Format: n={n} chi2={chi2:.4f} df=8." },
          { kind: "stdout_matches", task: "t1", pattern: "digit 1: observasi=0\\.1500 ekspektasi=0\\.3010 count=3", label: "Output menampilkan digit 1: observasi 0.1500, ekspektasi 0.3010", msg: "Tiga dari 20 angka berdigit pertama 1 — separuh dari ekspektasi Benford." },
        ],
      },
    },
    {
      id: "rolling",
      eyebrow: "Langkah 9 · Rolling velocity",
      title: "Rolling velocity: jendela 1 jam/24 jam yang bergeser — dan ambang yang harus dikalibrasi",
      prose: [
        "Lesson ini mengukur velocity dalam 6 bulan (V = bulan membayar). Tapi fraud kartu bergerak dalam JAM — dan UCI tidak punya stempel waktu transaksi. Langkah ini memakai data sintetis [ilustrasi] (seed 42) dengan stempel waktu: tiga akun selama 7 hari. N normal: 14 transaksi (2/hari, 09:00 + 19:00, merchant M1, NT$1.000–5.000). F burst fraud: 24 transaksi (6 hari normal + hari ke-7 burst 12 transaksi 10:01–10:45, 6 merchant M1–M6, NT$8.446–14.216, device D-F0/1/2). S acara keluarga: 22 transaksi (6 hari normal + hari ke-7 10 transaksi 09:05–20:00, 3 merchant, NT$2.000–6.000). Label fraud hanya untuk evaluasi — model tidak pernah melihatnya.",
        "Rolling velocity = hitungan dalam jendela yang BERGESER: tiap transaksi menjadi pusat jendela 1 jam/24 jam ke belakang — count, unique merchant, unique tujuan, total amount, device. Dan rasio vs baseline pribadi: total 24 jam hari ini dibagi rata-rata total 24 jam hari-hari sebelumnya. Tiga metrik itu — max1h, merchant unik, rasio vs baseline — yang membedakan burst dari acara keluarga.",
        "Nilai [ilustrasi] — hari ke-7: N: n = 2, max1h = 1, total 24 jam NT$7.988, baseline 2,0, rasio 1,0, device 1, merchant 1 → tidak ada ambang terlampaui. F: n = 12, max1h = 12 (10:45, 6 merchant), total 24 jam NT$139.233, rasio 6,0, device 4, merchant 6 → melampaui KETIGA ambang [ilustrasi] (≥10 transaksi/1 jam; ≥5 merchant unik/1 jam; total 24 jam > NT$100.000). S: n = 10, max1h = 2, total 24 jam NT$37.815, rasio 5,0, device 1, merchant 3 → tidak ada ambang terlampaui — rasio 5,0 saja bukan aturan alert.",
        "Perhatikan S: rasio vs baseline-nya 5,0 — hampir sama besarnya dengan F (6,0) — tapi max1h-nya hanya 2 dan merchant-nya 3. Rasio saja akan menandai S sebagai fraud; kombinasi max1h + merchant unik yang menyelamatkannya. Itulah kenapa velocity selalu dilaporkan sebagai PAKET metrik, bukan satu angka. Gambar di bawah membandingkan max1h ketiganya dengan garis ambang 10.",
        "Baik atau buruk: ambang contoh ini bagus sebagai ilustrasi — tiga ambang bersama menangkap F dan meloloskan N dan S. Buruk bila ambang disalin mentah ke produksi: ambang ≥10 transaksi/1 jam di bank dengan 1 juta nasabah bisa menghasilkan ribuan alert per hari — tim tidak sanggup memeriksanya, dan alert yang tidak diperiksa sama dengan tidak ada alert. Ambang harus dikalibrasi vs kapasitas review: hitung berapa alert per hari yang dihasilkan tiap ambang, lalu pilih ambang yang tim sanggup periksa — atau ganti ambang keras dengan skor yang diurutkan (M3.5).",
        "Mitigasi: selalu tulis jendela + ambang + baseline bersama angkanya — «max1h = 12, ambang ≥10, baseline pribadi 2,0» — dan laporkan paket metriknya (count, merchant unik, total, device), bukan satu angka. Bila satu metrik berteriak tapi yang lain tenang (seperti S: rasio 5,0 tapi max1h 2), itu pertanyaan untuk manusia, bukan vonis.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar max1h hari ke-7: N 1, F 12, S 2; garis ambang 10 transaksi per jam">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">max1h hari ke-7 — hanya F yang melewati ambang 10</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">8</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">12</text>
<line x1="52" y1="59.3" x2="466" y2="59.3" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="52.3" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">ambang ≥10 txn/1j</text>
<rect x="110" y="191.3" width="60" height="14.7" fill="var(--c1)"/>
<text x="140" y="187.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1</text>
<text x="140" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">N · normal</text>
<rect x="210" y="30.0" width="60" height="176.0" fill="var(--c2)"/>
<text x="240" y="26.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">12</text>
<text x="240" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">F · burst fraud</text>
<rect x="310" y="176.7" width="60" height="29.3" fill="var(--c1)"/>
<text x="340" y="172.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2</text>
<text x="340" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">S · acara keluarga</text>
<text x="240" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">S rasio vs baseline 5,0 tapi max1h hanya 2 — rasio saja bukan aturan alert.</text>
</svg>`,
        alt: "Bar max1h hari ke-7: N 1, F 12, S 2; garis ambang 10 transaksi per jam.",
        caption: "Cara membaca: tiap bar = transaksi terbanyak dalam satu jendela 1 jam pada hari ke-7 [ilustrasi]; garis putus-putus = ambang ≥10 transaksi/1 jam. Interpretasi: hanya F yang melewati ambang; S (acara keluarga) punya rasio vs baseline 5,0 tapi max1h hanya 2 — velocity dilaporkan sebagai paket metrik, bukan satu angka.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: rasio vs baseline tinggi berarti fraud",
        type: "pitfall",
        body: "Yang benar: rasio mengukur perubahan, bukan niat. Akun S rasionya 5,0 — hampir sama dengan F (6,0) — tapi ia sedang belanja acara keluarga: max1h-nya 2, merchant-nya 3, device-nya 1. Rasio tinggi adalah alasan untuk melihat metrik lainnya, bukan jawaban.",
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: sinyal apa untuk masalah apa?",
      prose: [
        "Butuh sinyal real-time — kartu meledak dalam hitungan jam? Velocity transaksi dengan jendela pendek (1 jam / 24 jam) + baseline nasabah itu sendiri. Bukan V bulanan UCI — jendelanya beda, perilakunya beda.",
        "Butuh membaca risiko per kelompok dari data historis? Velocity bands + bill jump, dengan default rate dibaca dari data sendiri — dan arahnya jangan dihafal. Di UCI, velocity rendah dan tagihan melonjak justru kelompok yang lebih aman dari dugaan.",
        "Butuh screening portofolio tanpa label? Benford chi-square per segmen; selisih digit besar + n cukup → antrean audit. Selisih kecil + n besar → catat, jangan kejar.",
        "Butuh bukti fraud? Tidak satu pun dari ketiganya — investigasi: konfirmasi nasabah, pola merchant, device, dan riwayat. Sinyal mengantrekan; investigasi memutuskan.",
        "Jendela velocity tidak dinyatakan? Jangan pakai angkanya — velocity tanpa jendela tidak bisa dibandingkan dengan apa pun.",
        "n terlalu kecil untuk chi-square? Kumpulkan n dulu, atau baca MAD (rata-rata selisih absolut) sebagai pendamping: MAD BILL_AMT1 0,0051 vs PAY_AMT1 0,0193 [notebook] sudah bercerita tanpa p-value.",
        "Arah sinyal tidak seperti dugaan? Percaya data, bukan hafalan — tapi cari mekanismenya sebelum bertindak. Korelasi tanpa mekanisme adalah antrean pertanyaan, bukan jawaban.",
        "Peta M3.4 — apa yang menanti. Behavioral profiling & peer-group: dari sinyal satu nasabah ke profil perilaku (jam transaksi, merchant favorit, pola mingguan) dan perbandingan dengan kelompok sebaya — «aneh untuk nasabah ini» vs «aneh untuk semua orang» adalah dua pertanyaan yang berbeda. Pengajaran penuhnya di lesson berikut.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Mini-case: 40x transaksi, tiga sinyal tenang",
      prose: [
        "Kembali ke nasabah D dari cerita pembuka. Fakta [ilustrasi]: baseline-nya 2 transaksi per hari; Selasa itu 40 transaksi dalam 24 jam — velocity 20x baseline dalam jendela 24 jam. Sistem menahan kartu. Sekarang periksa tiga sinyal bulanan dari lesson ini — semuanya tenang.",
        "Velocity bayar: D membayar di 6 dari 6 bulan — V = 6, band [5,7), default rate band 0,1785 [notebook]. Ia nasabah yang membayar tiap bulan, kelompok paling rendah risikonya. Bill jump: tagihan bulan itu R = 0,8 — di bawah 2, kelompok R < 2 dengan default 0,2261 [notebook]. Tagihannya tidak melonjak. Benford: digit pertama tagihan terakhirnya 1 — digit yang paling umum (ekspektasi 0,3010). Tidak ada yang aneh dari digitnya.",
        "Keputusan: eskalasi ke verifikasi manusia — telepon nasabah — BUKAN blokir otomatis dan BUKAN vonis fraud. Alasannya satu: velocity transaksi real-time (40x dalam 24 jam) yang berteriak. Tiga sinyal bulanan yang tenang tidak membatalkan eskalasi itu — jendelanya berbeda (24 jam vs 6 bulan), yang diukurnya berbeda (transaksi vs pembayaran). Dan eskalasi bukan hukuman: nasabah D ternyata memang sedang belanja acara keluarga.",
        "Pelajaran mini-case ini: jangan campur definisi velocity. Sinyal yang tenang tidak membatalkan sinyal yang berteriak bila jendelanya berbeda — dan sinyal yang berteriak tidak membuktikan fraud bila yang ditanya adalah niat, bukan frekuensi.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 12 · Guided task di Colab",
      title: "Guided task di Colab: velocity & Benford di data UCI 30.000 nasabah",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada 3 nasabah dan 20 angka. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m33-guided-task.ipynb.",
        "Di notebook itu kamu memuat dataset UCI yang sesungguhnya (30.000 nasabah), menghitung velocity V dan default rate per band half-open ([0,1) 0,3799; [1,3) 0,2628; [3,5) 0,3281; [5,7) 0,1785), menghitung bill jump R dan default rate per kelompok, lalu menguji Benford pada BILL_AMT1 (chi2 = 92,3) dan PAY_AMT1 (chi2 = 995,5) — lengkap dengan checks yang menegaskan tiap langkah, termasuk perbandingan effect size vs p-value.",
        "Tautan Colab:",
        "https://colab.research.google.com/drive/1pvLHDgrrIk_8L28fHhHGzYbbyLhADqr-",
        "Jalur file notebook: colab/mlf-m33-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: dari kecepatan dan digit ke keputusan",
      prose: [
        "Rangkuman: velocity menghitung kejadian dalam jendela yang eksplisit — V di UCI adalah bulan dengan PAY_AMT > 0 dalam 6 bulan. Band [0,1) default 0,3799, tertinggi — velocity rendah (jarang membayar) justru paling berisiko. Bill jump R ≥ 2 default 0,1593 vs R < 2 default 0,2261 — tagihan melonjak justru lebih aman. Benford P(d) = log10(1 + 1/d): BILL_AMT1 chi2 = 92,3 (p ≈ 1,1e-16) tapi selisih digit 1 hanya 0,0065; PAY_AMT1 chi2 = 995,5 dengan digit 9 hanya 0,0226 — manusia membayar angka bulat. p-value kecil bukan vonis; baca effect size-nya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Nasabah membayar di 2 dari 6 bulan (Apr–Sep). Berapa velocity V dan band-nya?",
          options: [
            { text: "V = 2, band [0,1)", why: "Salah: [0,1) hanya berisi V = 0 — nasabah yang tidak membayar sama sekali." },
            { text: "V = 2, band [1,3)", why: "Benar: V = 2 masuk [1,3) karena 1 ≤ 2 < 3; default rate band ini 0,2628 [notebook].", correct: true },
            { text: "V = 2, band [3,5)", why: "Salah: [3,5) berisi V = 3 atau 4 — bukan 2." },
            { text: "V = 12, band [5,7)", why: "Salah: V menghitung bulan, bukan transaksi — maksimal 6, bukan 12." },
          ],
        },
        {
          q: "Berapa ekspektasi Benford untuk digit 2?",
          options: [
            { text: "0,3010", why: "Salah: itu ekspektasi digit 1 — P(1) = log10(2)." },
            { text: "0,1761", why: "Benar: P(2) = log10(1 + 1/2) = log10(1,5) = 0,1761.", correct: true },
            { text: "0,1249", why: "Salah: itu ekspektasi digit 3 — P(3) = log10(1 + 1/3)." },
            { text: "0,0458", why: "Salah: itu ekspektasi digit 9 — digit yang paling jarang." },
          ],
        },
        {
          q: "BILL_AMT1: chi2 = 92,3, df = 8, p ≈ 1,1e-16. Mana kesimpulan yang tepat?",
          options: [
            { text: "Terbukti ada fraud di tagihan", why: "Salah: chi-square menguji distribusi digit, bukan fraud — tidak ada vonis individu di sini." },
            { text: "Distribusi digit menyimpang dari Benford secara statistik, tapi selisihnya kecil (digit 1 hanya 0,0065) — ini screening, bukan bukti fraud", why: "Benar: p ≈ 1,1e-16 berkata penyimpangannya nyata; selisih 0,0065 berkata penyimpangannya kecil. Keduanya dibaca bersamaan.", correct: true },
            { text: "Tidak ada penyimpangan karena selisih digit 1 kecil", why: "Salah: p ≈ 1,1e-16 berkata penyimpangannya nyata secara statistik; yang kecil adalah BESARNYA, bukan keberadaannya." },
            { text: "Uji ini gagal karena n terlalu besar", why: "Salah: n besar bukan kegagalan uji — justru itu yang membuat selisih kecil terdeteksi; yang harus dibaca adalah effect size-nya." },
          ],
        },
        {
          q: "Mengapa digit 9 pada PAY_AMT1 hanya 0,0226 — setengah dari ekspektasi Benford 0,0458?",
          options: [
            { text: "Karena nasabah menunggak", why: "Salah: tunggakan tidak mengubah digit pertama pembayaran — ini soal angka yang dipilih, bukan soal telat." },
            { text: "Karena orang membayar angka bulat (10.000, 50.000, lunas) — digit 9 jarang jadi digit pertama", why: "Benar: pembayaran adalah angka yang DIPILIH manusia; angka bulat jarang berdigit pertama 9 — perilaku normal, bukan fraud.", correct: true },
            { text: "Karena datanya lebih sedikit (n = 24.751)", why: "Salah: n = 24.751 sudah besar; kekurangan digit 9 adalah pola perilaku, bukan kekurangan sampel." },
            { text: "Karena Benford tidak berlaku untuk pembayaran", why: "Salah: Benford adalah pembandingnya — justru penyimpangan dari pembanding itulah yang bercerita tentang perilaku." },
          ],
        },
        {
          q: "Band velocity mana yang default rate-nya tertinggi di data UCI?",
          options: [
            { text: "[5,7) — yang paling sering membayar", why: "Salah, terbalik: [5,7) justru terendah, 0,1785." },
            { text: "[0,1) — yang hampir tidak pernah membayar", why: "Benar: 0,3799 [notebook] — velocity rendah (jarang membayar) justru default tertinggi.", correct: true },
            { text: "[1,3)", why: "Salah: 0,2628 — lebih rendah dari [0,1) 0,3799." },
            { text: "[3,5)", why: "Salah: 0,3281 — tinggi kedua, tapi masih di bawah [0,1)." },
          ],
        },
        {
          q: "Bill jump: R ≥ 2 default 0,1593, R < 2 default 0,2261. Apa kesimpulan yang tepat?",
          options: [
            { text: "Tagihan melonjak menyebabkan nasabah lebih aman", why: "Salah: korelasi bukan kausalitas — R hanya membagi kelompok, tidak menjelaskan mengapa." },
            { text: "Tagihan melonjak justru default lebih rendah — sinyal mentah tanpa mekanisme hanya korelasi; jangan jadikan aturan tolak", why: "Benar: 0,1593 vs 0,2261 adalah pemisah kelompok, bukan sebab-akibat — dan arahnya jangan dihafal.", correct: true },
            { text: "R ≥ 2 berarti nasabah pasti lancar", why: "Salah: 0,1593 dari kelompok ini tetap default — bukan nol." },
            { text: "Bill jump tidak berguna karena arahnya terbalik", why: "Salah: arah yang terbalik dari dugaan justru informasinya — sinyal ini memisahkan kelompok, hanya saja jangan dihafal arahnya." },
          ],
        },
        {
          q: "Nasabah dengan V = 0 masuk band mana, dan apa artinya?",
          options: [
            { text: "[0,1); tidak membayar sama sekali dalam 6 bulan — default rate band 0,3799, tertinggi", why: "Benar: V = 0 masuk [0,1); band ini default 0,3799 — tertinggi, tapi 62% anggotanya tidak default.", correct: true },
            { text: "[1,3); membayar sekali", why: "Salah: V = 0 bukan 1 — band [1,3) berisi V = 1 atau 2." },
            { text: "[0,1); pasti default", why: "Salah: 0,3799 berarti 62% nasabah band ini TIDAK default — band berisi risiko, bukan vonis." },
            { text: "[5,7); membayar tiap bulan", why: "Salah, terbalik: V = 0 adalah ujung yang tidak membayar." },
          ],
        },
        {
          q: "Chi-square PAY_AMT1 = 995,5 jauh lebih besar dari BILL_AMT1 = 92,3 (keduanya df = 8). Mana tafsir yang paling tepat?",
          options: [
            { text: "PAY_AMT1 pasti mengandung fraud, BILL_AMT1 tidak", why: "Salah: chi-square tidak membuktikan fraud pada data mana pun — ia hanya mengukur penyimpangan digit." },
            { text: "Penyimpangan digit PAY_AMT1 jauh lebih besar (MAD 0,0193 vs 0,0051) — konsisten dengan angka pilihan manusia (angka bulat), bukan bukti fraud", why: "Benar: effect size-nya yang dibandingkan — MAD PAY hampir 4 kali MAD BILL — dan mekanismenya perilaku normal.", correct: true },
            { text: "BILL_AMT1 lebih bisa dipercaya karena chi2-nya lebih kecil", why: "Salah: chi2 kecil berarti lebih dekat ke Benford — tapi «bisa dipercaya» bukan kesimpulan uji ini." },
            { text: "Kedua angka itu sama-sama tidak berarti karena p-value keduanya kecil", why: "Salah, terbalik: p kecil berarti penyimpangannya nyata secara statistik; yang dibandingkan adalah BESAR penyimpangannya." },
          ],
        },
        {
          q: "Akun F: 12 transaksi dalam 44 menit (10:01–10:45), 6 merchant unik, total 24 jam NT$139.233. Akun S (acara keluarga): 10 transaksi dalam sehari, max1h 2, total NT$37.815, rasio vs baseline 5,0. Mana yang di-alert oleh ketiga ambang [ilustrasi] — dan kenapa S lolos?",
          options: [
            { text: "Keduanya di-alert — rasio S 5,0 sudah cukup", why: "Salah: rasio 5,0 saja bukan aturan alert — S tidak melewati satu pun dari ketiga ambang (max1h 2 < 10, merchant 3 < 5, total NT$37.815 < NT$100.000)." },
            { text: "F di-alert (ketiga ambang terlampaui: 12 txn/1j, 6 merchant, NT$139.233); S lolos — rasio 5,0 saja bukan aturan alert, dan max1h-nya hanya 2", why: "Benar: F melewati ≥10 txn/1j (12), ≥5 merchant/1j (6), dan total 24j > NT$100.000 (139.233); S hanya tinggi rasionya — velocity dinilai sebagai paket metrik.", correct: true },
            { text: "S di-alert dan F lolos — F hanya 12 transaksi", why: "Salah, terbalik: 12 transaksi dalam 44 menit di 6 merchant adalah burst; S tersebar sepanjang hari (max1h 2)." },
            { text: "Tidak ada yang di-alert — ambang hanya berlaku untuk transaksi di atas NT$100.000 per transaksi", why: "Salah: ambang total 24 jam adalah JUMLAH harian (NT$139.233), bukan per transaksi — transaksi F NT$8.446–14.216 satu per satu." },
          ],
        },
        {
          q: "100 merchant diuji Benford satu per satu pada α = 0,05; 12 punya p < 0,05. Setelah Benjamini–Hochberg (q = 0,05), berapa yang tetap signifikan — dan kenapa?",
          options: [
            { text: "12 — semuanya signifikan karena p < 0,05", why: "Salah: tanpa koreksi, menguji 100 segmen pada α = 0,05 menghasilkan ~5 false positive yang diharapkan — 12 «signifikan» itu sebagian besar noise." },
            { text: "2 dari 12 — rank 1 (p 0,0003 ≤ 0,0005) dan rank 2 (p 0,0009 ≤ 0,0010) lolos; rank 3 (p 0,004 > 0,0015) gugur dan semua sesudahnya ikut gugur", why: "Benar: BH membandingkan p rank-i dengan i/100 × 0,05 — hanya dua rank pertama yang lolos; dari 2 itu, hanya 1 yang effect size-nya besar untuk diaudit.", correct: true },
            { text: "0 — koreksi BH selalu menggugurkan semuanya", why: "Salah: BH tidak menggugurkan semuanya — rank 1 dan 2 lolos karena p-nya cukup kecil dibanding ambang rank-nya." },
            { text: "1 — hanya p terkecil yang boleh lolos", why: "Salah: BH bukan «hanya yang terkecil» — rank 2 juga lolos (0,0009 ≤ 0,0010); yang gugur adalah rank 3 dan sesudahnya." },
          ],
        },
      ],
      summary: [
        "Velocity = hitungan kejadian dalam jendela yang eksplisit — V di UCI adalah bulan dengan PAY_AMT > 0 dalam 6 bulan Apr–Sep 2005.",
        "Band velocity half-open [0,1) 0,3799; [1,3) 0,2628; [3,5) 0,3281; [5,7) 0,1785 — jarang membayar justru paling berisiko; arah sinyal dibaca dari data, bukan dihafal.",
        "Bill jump R = BILL_AMT1 / mean(BILL_AMT2..BILL_AMT6): R ≥ 2 default 0,1593 vs R < 2 default 0,2261 — tagihan melonjak justru lebih aman; sinyal mentah tanpa mekanisme hanya korelasi.",
        "Benford P(d) = log10(1 + 1/d): digit 1 ekspektasi 0,3010, digit 9 ekspektasi 0,0458.",
        "BILL_AMT1 chi2 = 92,3 (p ≈ 1,1e-16) tapi selisih digit 1 hanya 0,0065; PAY_AMT1 chi2 = 995,5, digit 9 hanya 0,0226 — manusia membayar angka bulat.",
        "p-value kecil bukan vonis: baca effect size berdampingan — selisih digit terbesar BILL 0,0130 vs PAY 0,0295; MAD 0,0051 vs 0,0193.",
        "Lab: velocity 3 nasabah [1, 3, 6] → band [[1,3), [3,5), [5,7)]; Benford 20 angka chi2 = 4,9577 — di bawah ambang kritis 15,51, tidak menyimpang; rolling: akun F max1h 12, merchant unik 6, total NT$139.233 — 3 dari 3 ambang terlampaui.",
        "Rolling velocity [ilustrasi]: hari ke-7 — N max1h 1, total NT$7.988, rasio 1,0 (tidak ada ambang); F max1h 12, total NT$139.233, rasio 6,0 (ketiga ambang terlampaui); S max1h 2, total NT$37.815, rasio 5,0 (tidak ada ambang — rasio saja bukan aturan alert).",
        "Kelayakan Benford [ilustrasi]: checklist rentang log10, angka bulat, angka dibatasi aturan, minimum n, koreksi multiple testing, effect size + CI + jumlah segmen — 100 merchant, 12 p < 0,05 → setelah Benjamini–Hochberg (q = 0,05) hanya 2 yang signifikan.",
      ],
      next: { label: "Lanjut: MLF-M3.4 — Behavioral Profiling & Peer-Group", href: "/v2/learn/mlf-m34-behavioral-peer-group" },
    },
  ],
};

import type { V2Lesson } from "../lib/types";

// Taksonomi arsitektur: pilih dari bentuk data.
const TAXONOMY_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Pohon keputusan arsitektur: bentuk data menentukan keluarga model.">
<rect x="200" y="8" width="160" height="40" rx="8" fill="var(--c1)" opacity="0.85"/>
<text x="280" y="33" text-anchor="middle" font-size="13" fill="#fff" font-family="var(--font-ui)" font-weight="600">Bentuk datamu apa?</text>
<g stroke="var(--chart-grid)" stroke-width="1.5"><line x1="280" y1="48" x2="80" y2="76"/><line x1="280" y1="48" x2="220" y2="76"/><line x1="280" y1="48" x2="360" y2="76"/><line x1="280" y1="48" x2="490" y2="76"/></g>
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="20" y="76" width="120" height="34" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/><text x="80" y="97" fill="var(--text)">Tabel / fitur</text>
<rect x="160" y="76" width="120" height="34" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/><text x="220" y="97" fill="var(--text)">Citra</text>
<rect x="300" y="76" width="120" height="34" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/><text x="360" y="97" fill="var(--text)">Teks / audio</text>
<rect x="440" y="76" width="110" height="34" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/><text x="495" y="97" fill="var(--text)">Graf / sekuens</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5"><line x1="80" y1="110" x2="80" y2="132"/><line x1="220" y1="110" x2="220" y2="132"/><line x1="360" y1="110" x2="360" y2="132"/><line x1="495" y1="110" x2="495" y2="132"/></g>
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="10" y="132" width="140" height="52" rx="8" fill="var(--c2)" opacity="0.9"/><text x="80" y="153" fill="#fff" font-weight="600">MLP / GBM</text><text x="80" y="170" fill="#fff" font-size="11">klasik sering menang</text>
<rect x="160" y="132" width="120" height="52" rx="8" fill="var(--c3)" opacity="0.9"/><text x="220" y="153" fill="#fff" font-weight="600">CNN</text><text x="220" y="170" fill="#fff" font-size="11">atau Vision Transformer</text>
<rect x="300" y="132" width="120" height="52" rx="8" fill="var(--c4)" opacity="0.9"/><text x="360" y="153" fill="#fff" font-weight="600">Transformer</text><text x="360" y="170" fill="#fff" font-size="11">RNN sudah pensiun</text>
<rect x="430" y="132" width="130" height="52" rx="8" fill="var(--c5)" opacity="0.9"/><text x="495" y="153" fill="#fff" font-weight="600">GNN / RNN / TCN</text><text x="495" y="170" fill="#fff" font-size="11">struktur jadi fitur</text>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)">
<text x="80" y="210">data &lt; 100 rb baris:</text><text x="80" y="226" font-weight="600" fill="var(--text)">coba klasik dulu</text>
<text x="220" y="210">butuh jutaan gambar</text><text x="220" y="226">untuk kalahkan klasik</text>
<text x="360" y="210">pretrained model</text><text x="360" y="226">hampir selalu tersedia</text>
<text x="495" y="210">fitur = relasi</text><text x="495" y="226">antar entitas</text>
</g>
<text x="280" y="272" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">Aturan nol: arsitektur mengikuti bentuk data, bukan tren.</text>
</svg>`;

export const dle1: V2Lesson = {
  slug: "dle1-lanskap",
  track: "Deep Learning Engineer",
  module: "Fondasi",
  title: "DLE1 — Peta Medan Deep Learning",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-pinjol",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Model Rp 2 miliar yang kalah dari random forest",
      prose: [
        "Tahun 2024, sebuah startup pinjol di Jakarta merekrut tim deep learning: tiga engineer, GPU cloud Rp 180 juta per bulan, target ambisius — model skor kredit berbasis neural network 12 lapis. Datanya? 4.200 baris riwayat pinjaman, 38 kolom fitur tabel: usia, tenor, gaji, riwayat telat bayar.",
        "Enam bulan kemudian modelnya jadi. AUC 0,81. Sementara itu satu analis iseng melatih random forest di laptopnya selama dua hari — tanpa GPU, tanpa 12 lapis. AUC 0,83. Model Rp 2 miliar kalah dari model Rp 0.",
        "Twist-nya bukan deep learning itu jelek. Twist-nya: deep learning adalah senjata yang salah untuk medan perang ini. Data tabel kecil + fitur terstruktur = wilayah kekuasaan ML klasik. Deep learning menang di medan lain: citra, teks, audio — tempat data mentah dan berlimpah. Lesson ini memberimu petanya, supaya kamu tidak menghabiskan enam bulan menembak dengan meriam ke sasaran lalat.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) memetakan lima keluarga arsitektur deep learning ke jenis data; (2) menilai tiga syarat kemenangan DL (data, kompleksitas pola, komputasi); (3) memutuskan DL vs ML klasik untuk kasus baru dengan alasan tertulis; (4) menghitung kebutuhan data dan komputasi kasar sebelum mengusulkan DL.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Memilih arsitektur yang salah adalah risiko model: biaya komputasi, waktu tim, dan — yang paling mahal — keputusan bisnis yang telat enam bulan. Peta di lesson ini adalah kontrol risiko pertamamu sebagai DL engineer.",
      },
      reference: "Medan perang menentukan senjata: bentuk data dulu, arsitektur kemudian.",
    },
    {
      id: "taksonomi",
      eyebrow: "Langkah 2 · Taksonomi arsitektur",
      title: "Lima keluarga, lima kepribadian",
      prose: [
        "MLP (multilayer perceptron) adalah si generalis tua: tumpukan lapisan fully-connected, tidak punya asumsi soal struktur data. Cocok untuk fitur tabel yang sudah rapi, lemah untuk data mentah berdimensi besar — ia harus belajar semuanya dari nol, termasuk hal yang sebenarnya sudah jelas seperti posisi piksel bertetangga.",
        "CNN adalah si tukang pola visual: filter kecil yang digeser ke seluruh gambar, bobotnya dipakai ulang (weight sharing). Ia berasumsi pola lokal itu penting — tepat untuk citra. RNN adalah si pencerita yang pelupa: membaca sekuens satu per satu sambil membawa ingatan, tetapi ingatannya bocor untuk sekuens panjang. Transformer adalah si diplomat: setiap posisi boleh berunding langsung dengan posisi lain lewat attention — tidak ada antrean, tidak ada lupa.",
        "GNN adalah si analis jaringan: belajar dari relasi antar entitas, cocok untuk graf transaksi atau jaringan sosial. Kepribadian tiap keluarga = asumsi struktural (inductive bias) yang ia bawa. Memilih arsitektur = memilih asumsi yang cocok dengan datamu.",
        "💡 Intuisi: inductive bias adalah tebakan gratis. CNN menebak pola lokal itu penting; Transformer menebak semua posisi boleh saling bicara. Tebakan yang benar menghemat jutaan data training. Tebakan yang salah = model buta.",
        "💡 Intuisi: jumlah parameter bukan ukuran kepintaran, melainkan ukuran kapasitas hafal. Model 100 ribu parameter pada 10 ribu data bisa menghafal, bukan menggeneralisasi — kecuali arsitekturnya punya tebakan struktural yang tepat.",
        "Cara membaca: mulai dari kotak biru paling atas (Bentuk datamu apa?), ikuti garis ke jenis datamu, lalu turun ke kotak berwarna: itulah keluarga arsitektur yang disarankan. Teks kecil di bawah tiap kotak = syarat kapan ia menang.",
        "Interpretasi: peta ini memaksa keputusan arsitektur dimulai dari data, bukan dari tren. Bila datamu tabel kecil, panah menunjuk ML klasik — dan itu jawaban yang benar, bukan kegagalan.",
        "Data tabular — pengecualian penting. Untuk 800 ribu transaksi × 40 fitur TABEL: gradient boosting (XGBoost/LightGBM) SERING mengalahkan deep learning (dan 10x lebih murah!). DL unggul di data TIDAK TERSTRUKTUR (citra, teks, audio) — bukan tabel. Kesalahan Rp2 miliar = memakai DL untuk data tabular. Aturan: tabel → boosting dulu; citra/teks/audio → DL dulu. Jenis DATA menentukan keluarga, bukan gengsi.",
        "Transfer learning mengubah syarat #1 (data). Tanpa pretraining: butuh 100 ribu+ citra. Dengan pretraining (ImageNet): 500 citra cukup (kasus batik!). Tiga syarat kemenangan = untuk training DARI NOL. Dengan transfer: syarat data turun 100x. Sebelum menolak DL karena “data sedikit”: cek apakah ada pretrained untuk domainmu. Sering ada — dan mengubah seluruh kalkulasi.",
      ],
      formula: String.raw`P = \sum_{\ell=1}^{L} (d_{\ell-1} + 1)\, d_{\ell}`,
      formulaNote: "P = total parameter yang bisa dilatih; L = jumlah lapisan; d_l = jumlah neuron di lapisan l (d_0 = dimensi input); +1 = bias per neuron. Setiap koneksi antar lapisan menyumbang bobot, setiap neuron menyumbang satu bias.",
      figure: {
        svg: TAXONOMY_SVG,
        alt: "Pohon keputusan: bentuk data menentukan keluarga arsitektur.",
        caption: "Peta nol deep learning: mulai dari bentuk data, bukan dari model yang sedang tren.",
      },
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `total_param` MLP berlapis [784, 128, 64, 10]" },
        { id: "t2", text: "Hitung `rasio` = total_param / n_data (10.000 gambar), 2 desimal" },
      ],
      expected: "total_param=109386  rasio=10.94",
      note: {
        title: "🚨 Mitos: makin banyak parameter makin pintar",
        type: "pitfall",
        body: "Yang benar: parameter = kapasitas, bukan kepintaran. MLP di atas punya 109.386 parameter untuk 10.000 gambar — hampir 11 parameter per sampel. Tanpa inductive bias yang tepat (seperti weight sharing di CNN), kapasitas sebesar ini justru mengundang overfitting: model menghafal noise training.",
      },
      hints: [
        "Tiap lapisan l: (masuk + 1) x keluar.",
        "Jumlahkan untuk ketiga transisi lapisan.",
        "total_param = sum((lapisan[i]+1)*lapisan[i+1] for i in range(3))",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(7)\n\nlapisan = [784, 128, 64, 10]  # arsitektur MLP\nn_data = 10000                # gambar training\n\n# TULIS KODEMU: total parameter (bobot + bias) dan rasio terhadap data\ntotal_param = \nrasio = \n\nprint(f"total_param={total_param}  rasio={rasio}")`,
        lockLines: 5,
        solution: `import numpy as np\nnp.random.seed(7)\n\nlapisan = [784, 128, 64, 10]  # arsitektur MLP\nn_data = 10000                # gambar training\n\n# TULIS KODEMU: total parameter (bobot + bias) dan rasio terhadap data\ntotal_param = sum((lapisan[i] + 1) * lapisan[i+1] for i in range(len(lapisan) - 1))\nrasio = round(total_param / n_data, 2)\n\nprint(f"total_param={total_param}  rasio={rasio}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_param", value: 109386, tol: 1e-9, label: "`total_param` seharusnya 109386", msg: "(784+1)x128 + (128+1)x64 + (64+1)x10 = 109386. Jangan lupa +1 untuk bias." },
          { kind: "equal", task: "t2", name: "rasio", value: 10.94, tol: 0.01, label: "`rasio` seharusnya 10.94", msg: "109386 / 10000 = 10.94 parameter per sampel." },
          { kind: "stdout_matches", task: "t2", pattern: "total_param=109386\\s+rasio=10\\.94", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Parameter per lapisan = (masuk + 1) x keluar. Rasio parameter/data mengukur risiko hafalan.",
    },
    {
      id: "kapan-menang",
      eyebrow: "Langkah 3 · Kapan DL menang",
      title: "Tiga syarat kemenangan deep learning",
      prose: [
        "Syarat pertama: data mentah dan berlimpah. Deep learning bersinar saat fitur belum jelas — piksel, waveform, token teks — dan kamu punya ratusan ribu hingga jutaan sampel. Pada data tabel 4.200 baris dengan 38 fitur rapi, gradient boosting hampir selalu menang: fiturnya sudah diekstrak manusia, sisanya soal decision boundary.",
        "Syarat kedua: ada pola hierarkis untuk dipelajari. Citra tersusun dari tepi → tekstur → objek → adegan; teks dari karakter → kata → frasa → makna. Lapisan dalam network memetakan langsung ke hierarki ini: lapisan awal belajar tepi, lapisan akhir belajar konsep. Kalau datamu tidak hierarkis, kedalaman hanya menambah biaya.",
        "Syarat ketiga: kamu sanggup membayar ongkosnya — GPU, waktu eksperimen, dan talenta debugging. Model DL yang setengah dilatih sering kalah dari model klasik yang fully-tuned. Anggaran yang sama, hasil berbeda.",
        "💡 Intuisi: scaling law — error DL turun mengikuti hukum pangkat terhadap data dan komputasi, tetapi hanya setelah melewati ambang data tertentu. Di bawah ambang itu, kurva DL datar di bawah ML klasik. Pertanyaan pertamamu selalu: apakah dataku melewati ambang itu?",
        "💡 Intuisi: transfer learning menggeser ambang. Model pretrained (ResNet, BERT) membawa pengetahuan dari jutaan data, sehingga 500 gambarmu tiba-tiba cukup. Tanpa pretrained, 500 gambar untuk CNN dari nol = bunuh diri statistik.",
        "Contoh kegagalan syarat #3 (komputasi). Startup pinjol: data 800 ribu transaksi (cukup!), pola kompleks (ya!) — tetapi budget GPU Rp180 juta/bulan DITOLAK direksi. Hasil: training di CPU 3 pekan per eksperimen → 2 eksperimen/bulan → tuning mustahil → DL kalah dari XGBoost yang tuning 50x sehari. Syarat komputasi = bukan “punya GPU”, melainkan “cukup compute untuk ITERASI”. Satu training sukses ≠ bisa tuning.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: deep learning selalu mengalahkan ML klasik",
        type: "pitfall",
        body: "Yang benar: pada data tabel kecil-menengah (< 100 ribu baris), gradient boosting (XGBoost/LightGBM) adalah baseline yang wajib dikalahkan — dan sering tidak terkalahkan. DL menang dominan di citra, teks, audio, dan video. Klaim kemenangan DL tanpa baseline klasik = eksperimen yang tidak jujur.",
      },
      reference: "Tiga syarat: data mentah berlimpah, pola hierarkis, sanggup bayar ongkos komputasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: arsitektur apa untuk dataku?",
      prose: [
        "Skenario 1 — Data tabel, < 100 ribu baris, fitur sudah bermakna (skor kredit, churn). → Mulai dari gradient boosting. Alasan: inductive bias DL tidak membantu di sini; GBM lebih cepat, lebih stabil, lebih mudah dijelaskan ke regulator. Contoh nyata: startup pinjol di cerita pembuka.",
        "Skenario 2 — Citra (KTP, citra medis, CCTV), > 50 ribu gambar. → CNN, atau Vision Transformer bila > 1 juta gambar. Alasan: weight sharing menangkap pola lokal; data besar mengkompensasi lemahnya tebakan struktural ViT. Contoh nyata: verifikasi e-KTP otomatis.",
        "Skenario 3 — Teks (keluhan nasabah, laporan analis). → Transformer pretrained (fine-tune), hampir tanpa kecuali. Alasan: pretraining di miliaran token memberi pemahaman bahasa gratis; training dari nol hanya untuk bahasa/domain yang benar-benar tak terwakili. Contoh nyata: klasifikasi tiket complaint bank.",
        "Skenario 4 — Sekuens pendek terstruktur (deret harga 60 hari, sensor IoT). → LSTM/GRU atau TCN; Transformer bila sekuens > 500 langkah dan data besar. Alasan: RNN cukup untuk memori pendek; attention O(n²) mahal untuk sekuens panjang tanpa kebutuhan dependensi jauh. Contoh nyata: prediksi NPL cabang dari deret 36 bulan.",
        "Skenario 5 — Relasi antar entitas (graf transaksi, jaringan pemasok). → GNN. Alasan: fitur terpentingnya adalah siapa terhubung dengan siapa — struktur yang hilang bila diratakan jadi tabel. Contoh nyata: deteksi ring fraud dari graf transfer.",
        "Aturan praktis 10 detik: (1) sebut bentuk datamu dalam satu kata; (2) cek kolom kiri peta — arsitektur mengikuti bentuk data; (3) tanya apakah data melewati ambang (ratusan ribu sampel mentah); (4) bila tidak, baseline klasik dulu; (5) catat asumsi yang kamu pilih dan kenapa — itu dokumentasi risiko modelmu.",
      ],
      note: {
        title: "💡 Intuisi: tiga syarat, bukan satu",
        body: "Deep learning menang hanya jika TIGA syarat terpenuhi bersamaan: data BANYAK, pola KOMPLEKS (non-linear, hierarkis), dan komputasi ADA. Dua dari tiga = jebakan: data banyak + pola sederhana = random forest menang (kasus Rp2 miliar!); pola kompleks + data sedikit = overfit. Ceklist ketiganya SEBELUM mengusulkan DL — dua YA dan satu TIDAK = jangan DL.",
      },
      tasks: [],
      reference: "Lima skenario di atas + aturan 10 detik. Tulis pilihan arsitekturmu beserta alasannya.",
    },
    {
      id: "minicase-fraud",
      eyebrow: "Langkah 5 · Mini-case",
      title: "800 ribu transaksi, 40 fitur: DL atau klasik?",
      prose: [
        "Kamu lead analis di fintech. Datanya: 800.000 transaksi setahun, 40 fitur tabel (nominal, jam, merchant, histori nasabah), fraud rate 0,8%. VP Engineering mengusulkan deep learning — katanya biar kekinian. Kamu diminta rekomendasi tertulis besok pagi.",
        "Hitung dulu dua angka: berapa transaksi fraud yang sebenarnya ada, dan berapa akurasi baseline tolol (selalu prediksi bukan-fraud). Dua angka ini menentukan segalanya: baseline menentukan apakah akurasi layak dijadikan metrik, dan jumlah fraud menentukan apakah DL punya cukup sinyal untuk dipelajari.",
        "Pembahasan: hanya 6.400 fraud dari 800 ribu transaksi. Baseline selalu-menebak-bukan-fraud sudah 99,2% akurat — jadi akurasi adalah metrik menipu di sini (pakai precision/recall/AUC-PR). Dengan 40 fitur tabel yang sudah bermakna dan 6.400 sampel positif, gradient boosting + sampling strategy adalah pilihan rasional; DL menambah kompleksitas tanpa menambah sinyal. Rekomendasi: tolak DL untuk kasus ini, kecuali ada data mentah tambahan (teks/device fingerprint) yang hierarkis.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `n_fraud` = jumlah transaksi fraud" },
        { id: "t2", text: "Hitung `baseline` = akurasi tebakan selalu-bukan-fraud (3 desimal)" },
      ],
      expected: "n_fraud=6400  baseline=0.992",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Fraud rate 0,8% berarti 99,2% akurasi = nol nilai. Dalam risiko, metrik yang salah lebih berbahaya daripada model yang salah — ia membuat direksi tenang padahal tidak ada yang terdeteksi.",
      },
      hints: [
        "n_fraud = total transaksi x fraud rate.",
        "Baseline benar untuk semua yang bukan fraud.",
        "n_fraud = int(n_trx * fraud_rate)",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(7)\n\nn_trx = 800_000\nfraud_rate = 0.008\n\n# TULIS KODEMU\nn_fraud = \nbaseline = \n\nprint(f"n_fraud={n_fraud}  baseline={baseline}")`,
        lockLines: 5,
        solution: `import numpy as np\nnp.random.seed(7)\n\nn_trx = 800_000\nfraud_rate = 0.008\n\n# TULIS KODEMU\nn_fraud = int(n_trx * fraud_rate)\nbaseline = round(1 - fraud_rate, 3)\n\nprint(f"n_fraud={n_fraud}  baseline={baseline}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_fraud", value: 6400, tol: 1e-9, label: "`n_fraud` seharusnya 6400", msg: "800000 x 0.008 = 6400." },
          { kind: "equal", task: "t2", name: "baseline", value: 0.992, tol: 1e-9, label: "`baseline` seharusnya 0.992", msg: "1 - 0.008 = 0.992." },
          { kind: "stdout_matches", task: "t2", pattern: "n_fraud=6400\\s+baseline=0\\.992", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "n_fraud = total x rate. Baseline = 1 - rate. Akurasi menipu pada data imbalance.",
    },    {
      id: "embedding-kategorikal",
      eyebrow: "Langkah 6 · Embedding kategorikal",
      title: "Embedding kategorikal: angka untuk yang tak bisa diurutkan",
      prose: [
        "MLP tabular di lesson ini memakai fitur numerik — tetapi data kredit penuh dengan kategorikal: sektor usaha, jenis agunan, provinsi, status perkawinan. One-hot mengubah tiap kategori menjadi vektor 0/1 — tetapi one-hot punya dua masalah: dimensinya meledak (40 sektor berarti 40 kolom) dan ia menganggap semua kategori sama jauhnya (retail dan grosir sama jauhnya dengan retail dan tambang).",
        "Embedding kategorikal menyelesaikan keduanya: tiap nilai kategori dipetakan ke vektor padat berdimensi kecil (misal 4 dimensi untuk 40 sektor) yang DILATIH bersama model. Dua kategori yang berperilaku mirip (retail dan grosir — sama-sama sensitif terhadap daya beli) akan punya vektor yang berdekatan; yang berbeda jauh akan berjauhan. Model belajar KESAMAAN dari data, bukan dari urutan alfabet.",
        "Aturan praktis dimensinya: min(50, (kardinalitas + 1) // 2) — kategori dengan 40 nilai memakai sekitar 20 dimensi atau kurang; dalam praktik 4–8 dimensi sering cukup untuk puluhan nilai. Dan satu peringatan: embedding butuh data — kategori yang hanya muncul 3 kali dalam 10.000 baris tidak punya cukup contoh untuk mempelajari vektor yang bermakna; gabungkan kategori langka menjadi “lainnya” sebelum di-embed.",
        "Rangkaian lengkap fondasi — tensor, autodiff, backprop, optimizer, inisialisasi, normalisasi, regularisasi, sampai representation learning — dirangkai dalam satu lesson khusus: DLE27 — Fondasi yang Tersebar. Lesson ini (DLE1) adalah petanya; DLE27 adalah jahitannya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memberi kode numerik arbitrer ke kategori (retail=1, grosir=2, tambang=3) lalu memasukkannya sebagai fitur numerik. Model mengira grosir “di antara” retail dan tambang — urutan palsu yang tidak ada di data. Kategorikal harus one-hot atau embedding, tidak pernah bilangan urut.",
      },
      reference: "Kategorikal = embedding (atau one-hot), bukan bilangan urut. Dimensi sekitar min(50, (k+1)//2).",
    },

    {
      id: "lab-embedding-kategorikal",
      eyebrow: "Langkah 7 · Lab embedding",
      title: "Lab: one-hot vs embedding — hitung parameternya",
      prose: [
        "Tiga kolom kategorikal: sektor (40 nilai), jenis agunan (12 nilai), provinsi (8 nilai); layer hidden pertama 16 unit. Tugasmu: hitung parameter layer pertama untuk (a) one-hot (dimensi input 60) dan (b) embedding (dimensi 4, 3, 2 — total input 9 — plus parameter tabel embedding sendiri). Lalu hitung penghematannya.",
        "Hasilnya: one-hot 976 parameter, embedding 372 — hemat 604 parameter (sekitar 62 persen) — DAN embedding belajar kesamaan antar kategori, yang one-hot tidak bisa. Penghematan parameter adalah bonus; kemenangan sebenarnya adalah representasi yang bermakna.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `onehot` (input 60 -> 16 unit) dan `embedding` (tabel + input 9 -> 16 unit)" },
        { id: "t2", text: "Hitung `hemat` = onehot - embedding dan cetak ketiganya" },
      ],
      expected: "onehot=976\nembedding=372\nhemat=604",
      note: {
        title: "💡 Intuisi",
        body: "One-hot membayar 60 kolom untuk informasi yang sebenarnya 9 dimensi; embedding membayar 212 parameter tabel untuk representasi yang lebih kaya. Di deep learning, parameter yang dihemat di input bisa dipakai di tempat yang lebih penting — atau tidak dipakai sama sekali.",
      },
      hints: [
        "Parameter layer = input_dim x 16 + 16 (bias).",
        "Tabel embedding = 40x4 + 12x3 + 8x2.",
        "Dimensi input embedding = 4 + 3 + 2 = 9.",
      ],
      code: {
        starter: `# DATA — jangan diubah
# 3 kolom kategorikal: kardinalitas 40, 12, 8; unit hidden 16

# TULIS KODEMU: parameter one-hot vs embedding
onehot_dim = ...
onehot = ...
emb_param = ...
emb_dim = ...
embedding = ...
hemat = ...

print(f"onehot={onehot}")
print(f"embedding={embedding}")
print(f"hemat={hemat}")`,
        lockLines: 2,
        solution: `# DATA — jangan diubah
# 3 kolom kategorikal: kardinalitas 40, 12, 8; unit hidden 16

# TULIS KODEMU: parameter one-hot vs embedding
onehot_dim = 40 + 12 + 8
onehot = onehot_dim * 16 + 16
emb_param = 40 * 4 + 12 * 3 + 8 * 2
emb_dim = 4 + 3 + 2
embedding = emb_param + emb_dim * 16 + 16
hemat = onehot - embedding

print(f"onehot={onehot}")
print(f"embedding={embedding}")
print(f"hemat={hemat}")`,
        checks: [
          { kind: "equal", task: "t1", name: "onehot", value: 976, tol: 1e-9, label: "`onehot` = 976", msg: "60 x 16 + 16 = 976." },
          { kind: "equal", task: "t1", name: "embedding", value: 372, tol: 1e-9, label: "`embedding` = 372", msg: "Tabel 212 + layer 9 x 16 + 16 = 372." },
          { kind: "equal", task: "t2", name: "hemat", value: 604, tol: 1e-9, label: "`hemat` = 604", msg: "976 − 372 = 604." },
          { kind: "stdout_matches", task: "t2", pattern: "onehot=976\\nembedding=372\\nhemat=604", label: "output tiga baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "One-hot 60 -> 16 = 976 param; embedding 212 + 9 -> 16 = 372 param.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari peta medan lesson ini. Setiap opsi punya alasan — baca semuanya, bahkan yang salah.",
      ],
      note: {
        title: "💡 Intuisi: baseline klasik dulu, selalu",
        body: "Sebelum melatih neural network, latih random forest / XGBoost dulu (1 jam). Ini BASELINE yang harus dikalahkan DL — dengan MARGIN yang membenarkan biayanya (10x compute, 5x waktu). Jika DL hanya menang 0,5 poin: JANGAN DL. Baseline klasik = jangkar kewarasan yang mencegah proyek Rp180 juta/bulan untuk +0,5 poin.",
      },
      tasks: [],
      summary: [
        "Arsitektur mengikuti bentuk data: tabel → MLP/GBM, citra → CNN, teks/audio → Transformer, graf → GNN.",
        "Inductive bias = tebakan struktural gratis; tebakan yang benar menghemat jutaan data.",
        "Parameter = kapasitas hafal, bukan kepintaran; rasio parameter/data mengukur risiko overfitting.",
        "DL menang bila: data mentah berlimpah + pola hierarkis + sanggup bayar ongkos komputasi.",
        "Pada data tabel kecil, gradient boosting adalah baseline wajib — klaim DL tanpa baseline klasik tidak jujur.",
      ],
      next: { label: "DLE18 — PyTorch: Cara Model Ditulis di Dunia Nyata", href: "/v2/learn/dle18-pytorch" },
      quiz: [
        {
          q: "Dataset 4.200 baris, 38 fitur tabel untuk skor kredit. Pilihan pertama yang paling rasional?",
          options: [
            { text: "Neural network 12 lapis", why: "Kapasitas raksasa untuk 4.200 baris = overfitting mahal; cerita pembuka membuktikan ini kalah." },
            { text: "Gradient boosting (XGBoost/LightGBM)", why: "Data tabel kecil + fitur bermakna = wilayah GBM: cepat, stabil, mudah dijelaskan.", correct: true },
            { text: "CNN dari nol", why: "CNN berasumsi pola spasial lokal — tidak ada pada fitur tabel." },
            { text: "Transformer dari nol", why: "Tanpa pretraining dan tanpa sekuens, Transformer hanya menambah biaya O(n²)." },
          ],
        },
        {
          q: "MLP [784, 128, 64, 10] punya 109.386 parameter untuk 10.000 gambar. Artinya?",
          options: [
            { text: "Model pasti pintar", why: "Parameter = kapasitas hafal, bukan kepintaran." },
            { text: "Risiko overfitting tinggi tanpa inductive bias yang tepat", why: "10,94 parameter per sampel: model bisa menghafal noise bila strukturnya tidak membatasi.", correct: true },
            { text: "Model pasti underfit", why: "Kapasitasnya justru berlebih, bukan kurang." },
            { text: "Harus tambah lapisan", why: "Menambah kapasitas memperparah risiko hafalan." },
          ],
        },
        {
          q: "Kapan CNN lebih tepat daripada MLP untuk citra?",
          options: [
            { text: "Selalu, karena lebih modern", why: "Modernitas bukan argumen; yang penting asumsi strukturalnya." },
            { text: "Karena weight sharing menangkap pola lokal di mana pun posisinya", why: "Filter yang sama mendeteksi tepi di kiri atas maupun kanan bawah — MLP harus belajar ulang per posisi.", correct: true },
            { text: "Karena CNN tidak butuh data banyak", why: "CNN tetap butuh puluhan ribu gambar; hanya lebih efisien dari MLP." },
            { text: "Tidak pernah", why: "Untuk citra, CNN memang unggul secara struktural atas MLP." },
          ],
        },
        {
          q: "Fraud rate 0,8%. Model dengan akurasi 99,2% bisa jadi tidak berguna karena?",
          options: [
            { text: "Akurasi selalu metrik terbaik", why: "Pada imbalance ekstrem, akurasi didominasi kelas mayoritas." },
            { text: "Tebakan selalu-bukan-fraud juga 99,2% tanpa mendeteksi satu fraud pun", why: "Baseline tolol menyamai skornya — metriknya yang menipu, bukan modelnya.", correct: true },
            { text: "Fraud tidak bisa dideteksi", why: "Bisa, dengan metrik yang tepat: precision, recall, AUC-PR." },
            { text: "Datanya terlalu besar", why: "Ukuran data bukan masalahnya; distribusi kelaslah masalahnya." },
          ],
        },
        {
          q: "Inductive bias yang TEPAT menghemat data training karena?",
          options: [
            { text: "Model jadi lebih cepat di GPU", why: "Kecepatan komputasi tidak terkait dengan kebutuhan data." },
            { text: "Tebakan struktural yang benar menghilangkan hipotesis-hipotesis salah sejak awal", why: "CNN tak perlu belajar bahwa tepi di kanan bawah sama dengan tepi di kiri atas — sudah bawaan.", correct: true },
            { text: "Parameter berkurang otomatis", why: "Parameter bisa tetap banyak; yang berkurang adalah ruang hipotesis efektif." },
            { text: "Tidak perlu validasi", why: "Validasi tetap wajib; bias hanya mengurangi kebutuhan data, bukan kebutuhan evaluasi." },
          ],
        },
        {
          q: "Tiga kolom kategorikal (40, 12, 8 nilai) ke layer 16 unit. Parameter one-hot vs embedding (dimensi 4/3/2)?",
          options: [
            { text: "One-hot 976, embedding 372 — hemat 604 parameter", why: "Benar: one-hot 60x16+16 = 976; embedding (160+36+16) + 9x16+16 = 372.", correct: true },
            { text: "One-hot 372, embedding 976", why: "Terbalik: one-hot-lah yang boros karena dimensinya 60.", },
            { text: "Keduanya 976 — embedding tidak menghemat", why: "Salah: tabel embedding hanya 212 parameter, dan input menyusut dari 60 ke 9.", },
            { text: "One-hot 60, embedding 9", why: "Itu dimensinya, bukan parameternya — parameter = dimensi x 16 + bias + tabel.", },
          ],
        },
        {
          q: "Kenapa kode numerik arbitrer (retail=1, grosir=2, tambang=3) SALAH untuk kategori?",
          options: [
            { text: "Karena angkanya terlalu kecil", why: "Besar angka bukan masalahnya — urutan palsunya.", },
            { text: "Karena model mengira grosir “di antara” retail dan tambang — urutan palsu yang tidak ada di data", why: "Benar: bilangan membawa urutan dan jarak; kategori tidak punya keduanya. Pakai one-hot atau embedding.", correct: true },
            { text: "Karena model tidak bisa membaca bilangan", why: "Model justru hanya membaca bilangan — itulah masalahnya: ia membaca makna urutan yang tidak ada.", },
            { text: "Tidak salah — itu praktik standar", why: "Salah: itu kesalahan klasik tabular DL — label encoding untuk model linear/neural tanpa urutan.", },
          ],
        },
      ],
    },
  ],
};

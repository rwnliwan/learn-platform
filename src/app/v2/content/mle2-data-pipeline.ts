import type { V2Lesson } from "../lib/types";

export const mle2: V2Lesson = {
  slug: "mle2-data-pipeline",
  track: "Machine Learning Engineer",
  module: "Fondasi Produksi",
  title: "MLE2 — Data Pipeline & Feature Engineering",
  estMinutes: 70,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model hanya sebaik data yang mengalir ke dalamnya — dan di produksi, data mengalir terus, berubah, dan kadang berbohong. Lesson ini tentang membangun pipa data yang jujur.",
        "Tujuan lesson ini:",
        "• Menjelaskan data leakage dalam 3 bentuk dan cara mendeteksinya sebelum merugikan.",
        "• Membangun pipeline yang reproducible: idempotent, berversion, dan teruji.",
        "• Mengukur train-serve skew dengan angka, bukan firasat.",
        "• Menerapkan prinsip point-in-time correctness pada feature engineering.",
        "• Memutuskan kapan membangun feature store vs pipeline sederhana.",
        "Isi lesson: cerita model '95% akurat' yang bocor → 3 jenis leakage + lab detektor → pipeline reproducible & train-serve skew + lab → feature engineering point-in-time → feature store (konsep + produksi) → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model 95% akurat yang ternyata mencontek",
      prose: [
        "Tim churn sebuah e-commerce melompat kegirangan: model prediksi churn mereka mencapai akurasi 95% di validasi. Fitur terpentingnya, menurut feature importance, adalah `hari_sejak_login_terakhir` — masuk akal, pelanggan yang lama tidak login memang cenderung churn.",
        "Minggu pertama di produksi, akurasinya 51%. Hampir setara lempar koin. Investigasi menemukan twist yang memalukan: fitur itu dihitung dari snapshot database yang diambil SETELAH periode churn diketahui. Untuk pelanggan yang sudah churn, 'login terakhir' tercatat jauh di masa lalu — informasinya berasal dari masa depan.",
        "Inilah data leakage: fitur yang mengandung informasi label yang seharusnya belum tersedia saat prediksi dibuat. Model tidak belajar pola pelanggan — ia belajar membaca kunci jawaban.",
        "Yang menyakitkan: leakage tidak menimbulkan error. Kode jalan mulus, metrik terlihat fantastis. Satu-satunya gejala adalah kejatuhan brutal saat bertemu dunia nyata.",
        "Pelajaran yang tidak tertulis di postmortem: fitur `hari_sejak_login_terakhir` punya korelasi 0,97 dengan label — dan TIDAK ADA yang curiga! Korelasi 0,97 = alarm leakage yang berteriak, tetapi tim merayakannya sebagai “fitur terbaik”. Aturan: korelasi >0,9 = investigasi WAJIB sebelum selebrasi. Fitur yang “terlalu bagus” hampir selalu terlalu bagus untuk jadi kenyataan. Skeptisisme = skill data yang paling undervalued.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'kalau metrik validasinya bagus, modelnya bagus'",
        type: "pitfall",
        body: "Yang benar: metrik validasi hanya sejujur pemisahan data dan fiturmu. Leakage membuat validasi terlihat sempurna sambil menyembunyikan bahwa model tidak belajar apa-apa. Selalu curigai akurasi yang 'terlalu bagus untuk jadi kenyataan'.",
      },
    },
    {
      id: "leakage",
      eyebrow: "Langkah 3 · Tiga wajah leakage",
      title: "Target leakage, kontaminasi, dan kebocoran waktu",
      prose: [
        "Leakage punya tiga wajah. Pertama, target leakage: fitur yang merupakan fungsi dari label atau dihitung setelah label diketahui — seperti cerita di atas. Cirinya: korelasi fitur-label mendekati sempurna (|r| > 0.9 patut dicurigai).",
        "Kedua, kontaminasi train-test: data test bocor ke training. Penyebab klasik: split acak pada data berurutan waktu (pelanggan yang sama muncul di train dan test), atau imputasi/scaling yang di-fit di seluruh data sebelum split.",
        "Ketiga, kebocoran waktu (temporal leakage): fitur memakai informasi yang belum ada pada saat prediksi. Contoh: memprediksi default kredit bulan Juni memakai 'total tunggakan hingga Desember'. Solusinya adalah point-in-time correctness: setiap fitur harus bisa direkonstruksi persis seperti keadaannya pada timestamp prediksi.",
        "Aturan praktis: untuk setiap fitur, tanyakan 'kapan informasi ini tersedia?' Jika jawabannya 'setelah kita tahu hasilnya', buang fitur itu.",
      ],
      formula: String.raw`\text{curigai leakage jika } |r_{x,y}| > 0{,}9`,
      formulaNote: "|r_x,y| = korelasi absolut antara fitur x dan label y (0–1); 0,9 = ambang curiga. Korelasi di atas 0,9 hampir selalu berarti LEAKAGE (fitur “terlalu bagus untuk jadi kenyataan” — biasanya fungsi dari label atau dihitung setelah label diketahui), bukan fitur brilian. Fitur brilian berkorelasi 0,3–0,6; fitur curiga berkorelasi 0,95.",
      figure: {
        svg: `<svg viewBox="0 0 480 200" role="img" aria-label="Korelasi fitur vs label (contoh)">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Korelasi fitur vs label (contoh)</text>
<line x1="46" y1="166.0" x2="466" y2="166.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="170.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<line x1="46" y1="131.0" x2="466" y2="131.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="135.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.2</text>
<line x1="46" y1="96.0" x2="466" y2="96.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="100.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.5</text>
<line x1="46" y1="61.0" x2="466" y2="61.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="65.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.7</text>
<line x1="46" y1="26.0" x2="466" y2="26.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="30.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1.0</text>
<rect x="83.8" y="122.2" width="134.4" height="43.8" fill="var(--c2)" rx="3"/>
<text x="151.0" y="116.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0.31</text>
<text x="151.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">x1 legit</text>
<rect x="293.8" y="26.0" width="134.4" height="140.0" fill="var(--c4)" rx="3"/>
<text x="361.0" y="20.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0.99</text>
<text x="361.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">x2 bocor</text>
<line x1="46" y1="166" x2="466" y2="166" stroke="var(--chart-grid)" stroke-width="1"/>
</svg>`,
        alt: "Bar chart: fitur x1 berkorelasi 0.31 dengan label, fitur x2 berkorelasi 0.99.",
        caption: "Cara membaca: tinggi batang = korelasi Pearson fitur terhadap label. Interpretasi: x1 (0,31) wajar untuk fitur prediktif; x2 (0,99) nyaris sempurna — terlalu bagus untuk jadi kenyataan, indikasi kuat leakage.",
      },
      tasks: [
        { id: "t1", text: "Hitung korelasi Pearson `c1` (fitur legit) dan `c2` (fitur curiga) terhadap label" },
        { id: "t2", text: "Terapkan aturan: |korelasi| > 0.9 → `verdict` = fitur yang bocor" },
        { id: "t3", text: "Cetak kedua korelasi dan verdict" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: leakage detector termurah",
        body: "Sebelum training apa pun, hitung korelasi tiap fitur terhadap label. Fitur dengan |r| > 0.9 hampir selalu bocor atau duplikat label — investigasi 10 menit ini menyelamatkan 10 minggu kerja sia-sia.",
      },
      hints: [
        "Pearson r = Σ((x-x̄)(y-ȳ)) / √(Σ(x-x̄)² · Σ(y-ȳ)²).",
        "Fungsi pearson(xs, ys) sudah disediakan dan terkunci.",
        "verdict = 'x2 BOCOR' jika abs(c2) > 0.9, else 'aman'.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random, math
random.seed(7)
n = 1000
churn = [1 if random.random() < 0.2 else 0 for _ in range(n)]
x1 = [c + random.gauss(0, 2) for c in churn]      # fitur legit
x2 = [c * 10 + random.gauss(0, 0.5) for c in churn]  # fitur CURIGA
def pearson(xs, ys):
    m = len(xs); mx = sum(xs)/m; my = sum(ys)/m
    num = sum((x-mx)*(y-my) for x, y in zip(xs, ys))
    den = math.sqrt(sum((x-mx)**2 for x in xs) * sum((y-my)**2 for y in ys))
    return num/den
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU
c1 = 
c2 = 
verdict = 

print(f"corr_x1={c1:.2f}  corr_x2={c2:.2f}  verdict={verdict}")`,
        lockLines: 12,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random, math
random.seed(7)
n = 1000
churn = [1 if random.random() < 0.2 else 0 for _ in range(n)]
x1 = [c + random.gauss(0, 2) for c in churn]      # fitur legit
x2 = [c * 10 + random.gauss(0, 0.5) for c in churn]  # fitur CURIGA
def pearson(xs, ys):
    m = len(xs); mx = sum(xs)/m; my = sum(ys)/m
    num = sum((x-mx)*(y-my) for x, y in zip(xs, ys))
    den = math.sqrt(sum((x-mx)**2 for x in xs) * sum((y-my)**2 for y in ys))
    return num/den
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU
c1 = pearson(x1, churn)
c2 = pearson(x2, churn)
verdict = "x2 BOCOR" if abs(c2) > 0.9 else "aman"

print(f"corr_x1={c1:.2f}  corr_x2={c2:.2f}  verdict={verdict}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`c2` ≈ 0.99 (bocor)",
            "name": "c2",
            "value": 0.9929306308730413,
            "tol": 0.02,
            "msg": "x2 nyaris fungsi linear dari label — korelasinya mendekati 1.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` memvonis x2",
            "pattern": "verdict=x2 BOCOR",
            "msg": "|c2| > 0.9 → verdict 'x2 BOCOR'.",
          },
        ],
      },
      reference: "Korelasi Pearson mengukur hubungan linear. |r|>0.9 pada fitur = lampu merah.",
    },
    {
      id: "pipeline-repro",
      eyebrow: "Langkah 4 · Pipeline reproducible",
      title: "Idempotent, berversion, teruji — dan train-serve skew",
      prose: [
        "Pipeline yang reproducible punya tiga sifat. Idempotent: dijalankan 1x atau 5x hasilnya sama (tidak ada append ganda, tidak ada state nyasar). Berversion: input, kode, dan parameter tercatat sehingga run mana pun bisa diulang. Teruji: ada test otomatis yang gagal berisik saat data berubah.",
        "Musuh terbesarnya adalah train-serve skew: fitur di training dihitung dengan kode A, di serving dengan kode B — hasilnya 'mirip tapi tidak sama'. Contoh klasik: training memakai SQL dengan timezone UTC, serving memakai kode Python dengan timezone lokal. Model menerima angka yang tidak pernah ia lihat saat training.",
        "Cara mengukurnya sederhana: bandingkan statistik fitur training vs serving. Skew ternormalisasi = |μ_serve − μ_train| / σ_train. Di atas 1.0 berarti rata-rata serving bergeser lebih dari satu standar deviasi — investigasi wajib.",
        "Solusi struktural: satu kode feature engineering dipakai di training DAN serving (shared library), atau feature store yang menyajikan fitur point-in-time yang sama untuk keduanya.",
      ],
      formula: String.raw`\text{skew} = \frac{|\mu_{serve} - \mu_{train}|}{\sigma_{train}}`,
      formulaNote: "skew = pergeseran train-serve; μ_serve vs μ_train = rata-rata fitur di serving vs training; σ_train = standar deviasi di training (pembagi agar skew tak berdimensi). Skew <0,2 = aman; 0,2–0,5 = investigasi; >0,5 = darurat (model pada dasarnya melihat dunia yang berbeda dari yang ia pelajari).",
      tasks: [
        { id: "t1", text: "Hitung `serve_mean` dari 10 batch serving" },
        { id: "t2", text: "Hitung `skew` ternormalisasi dan tentukan `verdict` (ambang 1.0)" },
        { id: "t3", text: "Cetak skew dan verdict" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'pipeline-ku deterministik karena kodenya sama'",
        type: "pitfall",
        body: "Yang benar: kode sama ≠ hasil sama. Timezone, urutan baris, versi library, dan pembulatan floating point bisa mengubah fitur diam-diam. Deterministik harus DIBUKTIKAN dengan test, bukan diasumsikan.",
      },
      hints: [
        "serve_mean = sum(serve) / len(serve).",
        "skew = abs(serve_mean - train_mean) / train_std.",
        "verdict = 'SKEW' jika skew > 1.0, else 'OK'.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 3 baris berikut ===
train_mean, train_std = 35.0, 5.0
serve = [42.1, 41.5, 43.0, 40.8, 42.6, 41.9, 42.3, 41.2, 42.8, 41.7]

# TULIS KODEMU
serve_mean = 
skew = 
verdict = 

print(f"skew={skew:.2f}  verdict={verdict}")`,
        lockLines: 3,
        solution: `# === SEED TERKUNCI: jangan ubah 3 baris berikut ===
train_mean, train_std = 35.0, 5.0
serve = [42.1, 41.5, 43.0, 40.8, 42.6, 41.9, 42.3, 41.2, 42.8, 41.7]

# TULIS KODEMU
serve_mean = sum(serve) / len(serve)
skew = abs(serve_mean - train_mean) / train_std
verdict = "SKEW" if skew > 1.0 else "OK"

print(f"skew={skew:.2f}  verdict={verdict}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t2",
            "label": "`skew` ≈ 1.40",
            "name": "skew",
            "value": 1.397999999999999,
            "tol": 0.02,
            "msg": "|41.99 − 35| / 5 = 1.40. Rata-rata serving bergeser 1.4 SD.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` memvonis SKEW",
            "pattern": "verdict=SKEW",
            "msg": "skew > 1.0 → verdict 'SKEW'.",
          },
        ],
      },
      reference: "abs() untuk nilai mutlak. Ambang 1.0 SD adalah aturan praktis, bukan hukum alam.",
    },
    {
      id: "feature-eng",
      eyebrow: "Langkah 5 · Feature engineering",
      title: "Point-in-time correctness: fitur yang jujur terhadap waktu",
      prose: [
        "Feature engineering untuk produksi punya satu aturan emas: nilai fitur pada timestamp T harus sama persis dengan nilai yang tersedia pada saat T — tidak boleh memakai data yang baru muncul setelah T.",
        "Contoh konkret: fitur 'rata-rata transaksi 30 hari' untuk prediksi tanggal 10 Juni harus dihitung dari 11 Mei–10 Juni, BUKAN dari data hingga hari ini. Kesalahan umum: join dengan tabel agregat 'terkini' yang sudah mencakup masa depan.",
        "Praktiknya: setiap baris training membawa `timestamp_prediksi`, dan semua agregasi di-filter `event_time <= timestamp_prediksi`. Feature store modern (Feast, Tecton) mengotomatiskan ini dengan 'point-in-time join'.",
        "Biaya mengabaikannya: model yang terlihat hebat di backtest tetapi buta di produksi — varian temporal dari leakage di Langkah 3.",
        "Point-in-time correctness — uji 3 menit. Untuk 10 sampel acak: hitung fitur DENGAN pipeline produksi pada timestamp T, bandingkan dengan nilai yang dipakai training. Jika beda >0 — SKEW, stop. Uji ini (disebut “PIT test”) menangkap 90% train-serve skew sebelum deploy. Biaya: 30 menit setup. Nilai: mencegah insiden “konversi turun 11% selama 3 bulan”. PIT test = unit test untuk kejujuran temporal.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: backtest yang jujur itu mahal, backtest yang murah itu bohong",
        body: "Kalau backtest-mu tidak mensimulasikan ketersediaan data per timestamp, angkanya adalah fiksi optimistis. Alokasikan waktu membangun backtest point-in-time — ia adalah asuransi termurah dalam ML.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Membangun pipeline: seberapa serius infrastrukturnya?",
      prose: [
        "Skenario 1 — Startup 5 orang, 1 model, retrain bulanan → pipeline sederhana: script terjadwal + test dasar + versioning manual yang disiplin. Alasan: biaya feature store tidak sebanding; yang penting reproducible dan terpantau.",
        "Skenario 2 — Bank dengan 40 model kredit, retrain mingguan, diaudit regulator → feature store + training pipeline terorkestrasi + model registry. Alasan: skala dan compliance menuntut lineage penuh; satu definisi fitur dipakai train dan serve.",
        "Skenario 3 — Fitur real-time (mis. 'transaksi 1 jam terakhir') untuk fraud → streaming pipeline (Kafka/Flink) + online feature store. Alasan: batch harian terlalu lambat; fitur harus tersedia dalam detik dengan point-in-time yang benar.",
        "Skenario 4 — Eksperimen riset, belum tahu apakah model akan dipakai → notebook rapi + seed + config file. Alasan: jangan bangun infrastruktur untuk model yang mungkin mati minggu depan; tetapi siapkan fondasi reproducibility sejak hari pertama.",
        "Aturan praktis 10 detik: (1) Berapa model dan seberapa sering retrain? (2) Apakah ada fitur real-time? (3) Apakah diaudit? Jawaban 'banyak/ya' → investasi infrastruktur; 'sedikit/tidak' → kesederhanaan yang disiplin.",
        "Skenario 3 — tim 20 orang, 5 model, retrain harian, TANPA feature store → JANGAN langsung bangun feature store. Mulai dari “kontrak definisi” tertulis + test kesetaraan train-serve (skew check otomatis). Feature store = investasi Rp100 juta+; kontrak + test = Rp5 juta. Naik ke feature store hanya jika kontrak + test terbukti tidak cukup (biasanya di >15 model). Tangga yang benar: disiplin → tooling, bukan sebaliknya.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "E-commerce Kilat: fitur yang berubah diam-diam",
      prose: [
        "E-commerce Kilat punya model rekomendasi voucher. Tiga bulan lalu tim data mengubah definisi 'pelanggan aktif' dari 'transaksi 90 hari terakhir' menjadi 'transaksi 30 hari terakhir' — di kode training. Kode serving tidak diubah.",
        "Dampaknya: distribusi fitur `is_aktif` di serving bergeser — proporsi 'aktif' turun dari 62% ke 38%. Model yang dilatih dengan definisi baru menerima input berdefinisi lama. Konversi voucher turun 11% dalam sebulan sebelum ada yang sadar.",
        "Pertanyaan: (a) Ini jenis kegagalan apa? (b) Test otomatis apa yang akan menangkapnya dalam 1 hari? (c) Perubahan proses apa yang mencegah terulang?",
        "Pembahasan: (a) Train-serve skew akibat definisi fitur ganda. (b) Test distribusi fitur train vs serve harian (skew > 1.0 → alarm) atau contract test: proporsi tiap kategori fitur harus dalam rentang historis. (c) Single source of truth: satu definisi fitur di shared library/feature store yang dipakai training dan serving — perubahan definisi menjadi perubahan berversion yang terdeploy bersamaan.",
        "Kuantifikasi dampak: konversi voucher turun 11%. Jika baseline 50.000 voucher/bulan × Rp20.000 margin = Rp1 miliar/bulan, penurunan 11% = Rp110 juta/bulan HILANG — karena satu definisi berubah di satu tempat. Dan butuh 3 bulan untuk menyadari! Total: Rp330 juta. Satu baris kontrak definisi (“pelanggan aktif = transaksi 30 hari”) yang dishare antara training dan serving = Rp330 juta. Dokumentasi definisi bukan birokrasi — ia adalah asuransi Rp330 juta.",
      ],
      tasks: [
      ],
    },
    {
      id: "feature-store-konsep",
      eyebrow: "Langkah 8 · Feature store",
      title: "Feature store: kenapa fitur butuh rumah sendiri",
      prose: [
        "Lima tim, lima definisi, satu kata yang sama. Di perusahaan yang sudah agak besar, `pelanggan_aktif` bisa dihitung dengan lima cara berbeda oleh lima tim — karena tiap tim menulis ulang logika fiturnya sendiri. Hasilnya, model A dan model B diklaim 'memakai fitur yang sama' padahal tidak. Feature store lahir dari masalah ini: satu rumah untuk semua fitur, dengan satu definisi yang berlaku sama untuk training dan serving.",
        "Arsitekturnya memakai DUA penyimpanan untuk dua kebutuhan. Offline store menyimpan riwayat lengkap fitur — murah, lambat, dipakai untuk training dan backtest. Online store menyimpan nilai TERKINI tiap fitur — key-value super cepat dengan latensi milidetik, dipakai untuk serving. Keduanya diberi makan oleh pipeline yang sama, sehingga 'fitur X' berarti hal yang persis sama di mana pun ia dipakai. Feature registry adalah katalognya: setiap fitur tercatat dengan definisi kodenya, pemiliknya, dan versinya — tidak ada lagi definisi yang hanya hidup di kepala seseorang.",
        "Fitur paling berharganya adalah point-in-time join — senjata melawan leakage temporal di Langkah 3. Saat membangun data training, feature store tidak mengambil 'nilai fitur terkini', melainkan 'nilai fitur SEPERTI PADA timestamp kejadian': query (entitas, timestamp) mengembalikan nilai fitur yang berlaku pada timestamp itu dari offline store. Tanpa mekanisme ini, fitur 'terkini' diam-diam menyelinapkan masa depan ke training.",
        "💡 Intuisi: feature store adalah perpustakaan, bukan gudang. Di gudang, setiap orang mengambil barang dengan caranya sendiri. Di perpustakaan, satu katalog mencatat tiap buku: judul (nama fitur), pengarang (pemilik), edisi (versi). Peminjam — training atau serving — menerima salinan yang sama persis. Kalau ada yang salah, pustakawan tahu edisi mana yang bermasalah, bukan menyalahkan seluruh rak.",
        "Fitur bisa basi. 'Transaksi 1 jam terakhir' yang terakhir dihitung 6 jam lalu bukan fitur — ia kebohongan yang sopan. Setiap fitur butuh SLA freshness: selang maksimum antara nilai dihitung dan dipakai. Bila staleness melebihi SLA, pipeline harus menolak nilai itu atau menandai prediksi sebagai tidak tepercaya. Fitur basi tidak menimbulkan error — ia hanya menurunkan performa diam-diam, dan itulah yang membuatnya berbahaya.",
      ],
      formula: String.raw`\text{staleness} = t_{serve} - t_{hitung}`,
      formulaNote: "staleness = usia nilai fitur saat dipakai (berapa lama sejak terakhir dihitung); t_serve = timestamp saat fitur dipakai untuk prediksi; t_hitung = timestamp terakhir fitur dihitung/di-materialisasi. Interpretasi: staleness 0 = segar; staleness melebihi SLA freshness (mis. 1 jam) = fitur basi — pipeline harus menolaknya atau menandai prediksi sebagai tidak tepercaya.",
      tasks: [
        { id: "t1", text: "Tulis 3 fitur yang di pekerjaan/proyekmu (atau kasus mini-case e-commerce) dihitung ulang di lebih dari satu tempat" },
        { id: "t2", text: "Untuk tiap fitur, putuskan: cukup offline store, atau butuh online store? Tulis alasannya (kebutuhan latensi)" },
        { id: "t3", text: "Tentukan SLA freshness tiap fitur (mis. 'maksimal basi 1 jam') dan apa yang harus terjadi bila SLA dilanggar" },
      ],
      expected: "Contoh: `is_aktif` → online store (serving real-time), SLA 1 jam, bila dilanggar → tolak prediksi; `avg_trx_30d` → offline cukup (training harian), SLA 24 jam. Yang penting: alasannya menyebut latensi dan konsekuensi, bukan sekadar 'butuh cepat'.",
      note: {
        title: "🚨 Mitos: 'feature store = database biasa untuk fitur'",
        type: "pitfall",
        body: "Yang benar: database biasa menyimpan nilai; feature store menyimpan nilai + waktu berlakunya + definisi berversion + mekanisme point-in-time join. Tanpa keempatnya, itu hanya tabel mahal yang diberi nama keren.",
      },
      reference: "Offline store = bahan training (riwayat lengkap); online store = bahan serving (nilai terkini); registry = definisi tunggal berversion.",
    },
    {
      id: "feature-store-produksi",
      eyebrow: "Langkah 9 · Feature store di produksi",
      title: "Feature store di produksi: serving & materialisasi",
      prose: [
        "Fitur harus sampai ke online store — prosesnya disebut materialisasi. Dua pola: TERJADWAL (batch job tiap N menit/jam menghitung ulang dan menimpa online store; murah, sederhana, latensinya = interval jadwal) dan ON-DEMAND/streaming (setiap event memicu pembaruan; latensi detik, mahal, kompleks). 'Transaksi 1 jam terakhir' untuk fraud butuh streaming; 'rata-rata belanja 30 hari' untuk churn cukup batch harian. Pola dipilih dari kebutuhan latensi — bukan dari gengsi.",
        "Setelah fitur tayang, awasi tiga hal. Drift: distribusi fitur serving bergeser dari training — pakai rumus skew di Langkah 4, ambang 1.0 tetap berlaku. Missing rate: berapa persen prediksi yang fiturnya tidak tersedia — kenaikannya berarti pipeline hulu bermasalah. Staleness: nilai fitur lebih tua dari SLA-nya. Ketiganya butuh dashboard dan alarm; fitur yang tidak dimonitor adalah fitur yang akan mengkhianatimu diam-diam.",
        "Fitur baru butuh backfill: menghitung nilai historisnya untuk semua entitas agar bisa dipakai training. Backfill itu mahal (menghitung ulang seluruh riwayat), harus idempotent (bisa diulang tanpa duplikasi), dan WAJIB point-in-time — backfill yang memakai nilai 'kini' untuk masa lalu berarti menyuntik leakage ke seluruh riwayat sekaligus. Jalankan PIT test dari Langkah 5 pada hasil backfill sebelum dipakai training.",
        "Mini peta keputusan — kapan TIDAK perlu feature store: (1) 1–3 model, fitur batch, retrain bulanan → shared library + kontrak definisi tertulis + test skew sudah cukup. (2) Satu-dua fitur real-time → cache/DB sederhana dengan TTL. (3) Tim di bawah 5 orang → biaya operasi feature store (infra, migrasi, on-call) lebih besar dari masalahnya. Naik ke feature store ketika: model belasan, definisi fitur mulai berlipat, atau audit menuntut lineage penuh. Tangganya: disiplin dulu, tooling kemudian — sama seperti pelajaran di Langkah 6.",
        "💡 Intuisi: feature store adalah asuransi armada. Untuk satu sepeda (satu model), asuransi armada adalah pemborosan — kunci gembok (shared library + test) sudah cukup. Untuk armada 50 truk (50 model), beroperasi tanpa asuransi adalah kecerobohan. Premi asuransi selalu terasa mahal — sampai hari kamu membutuhkannya. Dan hari itu selalu datang.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `pit_value(hist, t)`: nilai fitur point-in-time = entri terbaru dengan timestamp ≤ t" },
        { id: "t2", text: "Hitung `pit` (nilai point-in-time tiap event) dan `naive` (nilai 'kini' untuk SEMUA event)" },
        { id: "t3", text: "Cetak tiap event dengan status BOCOR/OK, lalu `jumlah_bocor`" },
      ],
      expected: "pit = [100, 200, 150]; naive = [300, 300, 300]; jumlah_bocor = 3 dari 3. Join naif mengambil nilai 'kini' (t=25) untuk semua event — termasuk event di masa lalu — itulah leakage temporal.",
      note: {
        title: "🚨 Mitos: 'pindah ke feature store = leakage selesai otomatis'",
        type: "pitfall",
        body: "Yang benar: feature store adalah alat, bukan mantra. Tanpa point-in-time join yang benar-benar dipakai dan definisi tunggal yang disiplin, ia hanya memindahkan kekacauan ke tempat yang lebih mahal. Leakage di Langkah 3 terjadi karena logika waktu yang salah — feature store tidak memperbaiki logika, ia hanya mengeksekusinya lebih cepat.",
      },
      hints: [
        "pit_value: iterasi history; simpan val terakhir yang ts-nya <= t.",
        "terbaru = nilai dengan timestamp TERBESAR (bukan nilai terbesar!) — hati-hati.",
        "status = 'BOCOR' jika p != n; jumlahkan yang BOCOR.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
# Riwayat fitur (timestamp, nilai) — nilai fitur berubah seiring waktu
history = [(0, 100), (10, 200), (15, 150), (25, 300)]
# Event prediksi: (id_event, timestamp_prediksi)
events = [("e1", 5), ("e2", 12), ("e3", 20)]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU
def pit_value(hist, t):
    # kembalikan nilai fitur terbaru dengan timestamp <= t
    

pit =   # daftar nilai point-in-time untuk tiap event
terbaru =   # nilai fitur "kini" (timestamp terbesar di history)
naive =   # daftar nilai join naif: terbaru untuk SEMUA event
jumlah_bocor = 0  # hitung berapa event yang pit-nya != naive

print(f"jumlah_bocor={jumlah_bocor} dari {len(events)}")`,
        lockLines: 6,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
# Riwayat fitur (timestamp, nilai) — nilai fitur berubah seiring waktu
history = [(0, 100), (10, 200), (15, 150), (25, 300)]
# Event prediksi: (id_event, timestamp_prediksi)
events = [("e1", 5), ("e2", 12), ("e3", 20)]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU
def pit_value(hist, t):
    v = None
    for ts, val in hist:
        if ts <= t:
            v = val
    return v

pit = [pit_value(history, t) for _, t in events]
terbaru = history[-1][1]  # nilai fitur "kini" — yang dipakai join naif
naive = [terbaru] * len(events)

jumlah_bocor = 0
for (eid, _), p, n in zip(events, pit, naive):
    status = "OK" if p == n else "BOCOR"
    if status == "BOCOR":
        jumlah_bocor += 1
    print(f"{eid}: pit={p} naive={n} {status}")
print(f"jumlah_bocor={jumlah_bocor} dari {len(events)}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`pit` = [100, 200, 150]",
            "name": "pit",
            "value": [100, 200, 150],
            "msg": "e1@t5 → 100, e2@t12 → 200, e3@t20 → 150: nilai yang berlaku PADA timestamp event.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`jumlah_bocor` = 3",
            "name": "jumlah_bocor",
            "value": 3,
            "msg": "Join naif memakai nilai 'kini' (t=25) untuk semua event — ketiganya bocor.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` melaporkan 3 bocor",
            "pattern": "jumlah_bocor=3 dari 3",
            "msg": "Cetak format: jumlah_bocor=<n> dari <total>.",
          },
        ],
      },
      reference: "Point-in-time: nilai fitur = yang berlaku PADA timestamp event, bukan yang terkini.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Model akurasi validasi 95% tetapi 51% di produksi. Diagnosis paling mungkin?",
          options: [
            {
              text: "Overfitting biasa",
              why: "Overfitting menurunkan beberapa poin, bukan dari 95% ke 51% (setara acak).",
            },
            {
              text: "Data leakage pada fitur",
              why: "Tepat: validasi fantastis + produksi setara acak adalah sidik jari klasik leakage.",
              correct: true,
            },
            {
              text: "Learning rate terlalu besar",
              why: "Itu masalah training, akan terlihat juga di validasi.",
            },
            {
              text: "Data terlalu sedikit",
              why: "Akan terlihat di validasi, bukan hanya di produksi.",
            },
          ],
        },
        {
          q: "Fitur 'total denda hingga akhir tahun' untuk prediksi default bulan Juni adalah…",
          options: [
            {
              text: "Fitur yang bagus karena informatif",
              why: "Informatif justru karena bocor — ia memakai masa depan.",
            },
            {
              text: "Temporal leakage",
              why: "Tepat: memakai informasi yang belum ada saat prediksi dibuat.",
              correct: true,
            },
            {
              text: "Train-serve skew",
              why: "Skew adalah beda definisi train vs serve, bukan masalah waktu ketersediaan.",
            },
            {
              text: "Data drift",
              why: "Drift adalah perubahan distribusi seiring waktu, bukan kebocoran masa depan.",
            },
          ],
        },
        {
          q: "Imputasi missing value memakai mean dari SELURUH data sebelum train-test split menyebabkan…",
          options: [
            {
              text: "Kontaminasi train-test",
              why: "Tepat: statistik test bocor ke training lewat mean global.",
              correct: true,
            },
            {
              text: "Target leakage",
              why: "Target leakage soal fitur dari label, bukan soal split.",
            },
            {
              text: "Tidak masalah",
              why: "Mean global membawa informasi test ke train — validasi jadi optimistis.",
            },
            {
              text: "Underfitting",
              why: "Tidak berhubungan dengan kapasitas model.",
            },
          ],
        },
        {
          q: "skew = 1.4 untuk fitur usia. Artinya?",
          options: [
            {
              text: "Rata-rata serving bergeser 1.4 SD dari training — investigasi wajib",
              why: "Tepat: di atas ambang 1.0, distribusi serving berbeda bermakna dari training.",
              correct: true,
            },
            {
              text: "Model pasti rusak",
              why: "Skew adalah sinyal investigasi, bukan vonis — bisa jadi pergeseran legitimate.",
            },
            {
              text: "Tidak ada masalah",
              why: "1.4 > 1.0 melewati ambang alarm.",
            },
            {
              text: "Harus retrain sekarang juga",
              why: "Investigasi dulu penyebabnya; retrain buta bisa mengulang kesalahan.",
            },
          ],
        },
        {
          q: "Tim kecil dengan 1 model dan retrain bulanan sebaiknya…",
          options: [
            {
              text: "Membangun feature store enterprise",
              why: "Overkill: biaya dan kompleksitas tidak sebanding untuk 1 model.",
            },
            {
              text: "Pipeline sederhana yang disiplin: terjadwal, teruji, berversion",
              why: "Tepat: reproducibility dulu, skala infrastruktur mengikuti kebutuhan.",
              correct: true,
            },
            {
              text: "Tetap manual via notebook",
              why: "Manual = tidak reproducible = bom waktu seperti cerita MLE1.",
            },
            {
              text: "Tidak perlu versioning",
              why: "Versioning adalah fondasi termurah untuk debugging masa depan.",
            },
          ],
        },
      ],
      summary: [
        "Data leakage: fitur mengandung info label dari masa depan → metrik validasi fantastis, produksi hancur.",
        "Tiga wajah leakage: target leakage, kontaminasi train-test, kebocoran temporal.",
        "Detektor murah: |korelasi fitur-label| > 0.9 = investigasi wajib.",
        "Pipeline reproducible = idempotent + berversion + teruji.",
        "Train-serve skew diukur: |μ_serve − μ_train| / σ_train; > 1.0 = alarm.",
        "Point-in-time correctness: fitur di timestamp T hanya boleh memakai data ≤ T.",
      ],
      next: { label: "MLE3 — Training yang Reproducible", href: "/v2/learn/mle3-training" },
    },
  ],
};

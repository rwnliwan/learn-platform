import type { V2Lesson } from "../lib/types";

// Keras: dua cara merakit model — Sequential (tumpukan linear) vs Functional (graf bebas).
const KERAS_SVG = `<svg viewBox="0 0 640 220" role="img" aria-label="Sequential vs Functional API: tumpukan linear lawan graf dengan skip connection.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<text x="160" y="30" fill="var(--text)" font-weight="600">Sequential — Si Tukang Lego</text>
<rect x="110" y="50" width="100" height="34" rx="8" fill="var(--c1)" opacity="0.9"/><text x="160" y="72" fill="#fff">Dense(64)</text>
<rect x="110" y="94" width="100" height="34" rx="8" fill="var(--c1)" opacity="0.9"/><text x="160" y="116" fill="#fff">Dense(32)</text>
<rect x="110" y="138" width="100" height="34" rx="8" fill="var(--c1)" opacity="0.9"/><text x="160" y="160" fill="#fff">Dense(1)</text>
<text x="480" y="30" fill="var(--text)" font-weight="600">Functional — Si Arsitek</text>
<rect x="400" y="50" width="90" height="34" rx="8" fill="var(--c2)" opacity="0.9"/><text x="445" y="72" fill="#fff">Input</text>
<rect x="400" y="104" width="90" height="34" rx="8" fill="var(--c3)" opacity="0.9"/><text x="445" y="126" fill="#fff">Dense(64)</text>
<rect x="520" y="104" width="90" height="34" rx="8" fill="var(--c3)" opacity="0.9"/><text x="565" y="126" fill="#fff">Dense(64)</text>
<rect x="460" y="158" width="90" height="34" rx="8" fill="var(--c4)" opacity="0.9"/><text x="505" y="180" fill="#fff">Concat</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5">
<line x1="160" y1="84" x2="160" y2="92"/><line x1="160" y1="128" x2="160" y2="136"/>
<line x1="445" y1="84" x2="445" y2="102"/>
<path d="M490 121 C 520 121 520 90 555 84" fill="none"/>
<line x1="445" y1="138" x2="470" y2="156"/><line x1="565" y1="138" x2="540" y2="156"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)" text-anchor="middle">
<text x="320" y="212">kiri: satu jalur lurus. kanan: dua jalur yang bertemu lagi — mustahil di Sequential</text>
</g>
</svg>`;

export const dle25: V2Lesson = {
  slug: "dle25-tensorflow-keras",
  track: "Deep Learning Engineer",
  module: "Framework",
  title: "DLE25 — TensorFlow & Keras untuk Deep Learning Engineer",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta lesson",
      title: "Peta lesson dan tujuan",
      prose: [
        "Track ini selama ini PyTorch-sentris — dan itu wajar untuk riset. Tetapi pasar kerja Indonesia menyebut TensorFlow/Keras di 4 dari 10 lowongan deep learning: deployment Android (TFLite), serving skala besar (TF Serving), dan training di TPU. Lesson ini bukan “PyTorch vs TensorFlow, siapa menang” — melainkan peta transfer: intuisi PyTorch-mu diterjemahkan ke Keras dalam satu lesson, plus bagian yang memang hanya dimiliki TensorFlow (ekosistem produksi).",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) memilih antara Keras Sequential dan Functional API untuk arsitektur apa pun; (2) merancang tf.data pipeline (map, batch, prefetch) dan menjelaskan kenapa input pipeline sering menjadi bottleneck; (3) memetakan training loop PyTorch manual ke model.fit() + callbacks Keras; (4) menjelaskan apa itu SavedModel dan kapan TF Serving / TFLite menjadi pilihan deployment; (5) memutuskan framework berdasarkan kebutuhan deployment, bukan fanatisme.",
        "Prasyarat yang diringkas di sini (lesson ini self-contained): training loop = ulangi {prediksi → hitung loss → turunkan gradien → update bobot}; Sequential = model sebagai tumpukan layer berurutan; callback = fungsi yang dipanggil otomatis di titik tertentu training (tiap epoch, tiap batch) — mis. early stopping.",
        "Isi lesson: cerita model yang harus jalan di HP Android → Sequential vs Functional → tf.data pipeline → fit() vs loop manual → SavedModel & deployment → lab training loop ala Keras dengan numpy → peta keputusan framework → mini-case tim fraud → checkpoint.",
      ],
      tasks: [],
      reference: "PyTorch untuk riset, TensorFlow untuk produksi — kuasai peta transfernya, bukan fanatismenya.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model yang harus jalan di HP Android",
      prose: [
        "Tim data “KirimCepat” punya model prediksi permintaan paket yang bagus — PyTorch, dilatih di GPU kantor, akurasi memuaskan. Lalu datang kontrak dengan mitra bank: model harus jalan di dua tempat. Pertama, di aplikasi Android para kurir (offline, HP kentang). Kedua, di klaster TPU milik mitra untuk scoring batch malam hari.",
        "Tim mencoba mengekspor model PyTorch ke HP: TorchScript, lalu ONNX, lalu konversi manual — dua minggu, hasilnya model 180 MB yang crash di HP RAM 3 GB. Jalur TPU lebih menyedihkan: XLA compilation error yang tidak jelas, dokumentasi komunitasnya tipis untuk kasus mereka.",
        "Seorang engineer yang pernah memakai Keras mengusulkan porting: arsitektur yang sama ditulis ulang dalam Keras Functional API (4 hari), dikonversi ke TFLite dengan kuantisasi int8 → 11 MB, jalan mulus di HP kentang. SavedModel yang sama di-deploy ke TF Serving di klaster mitra — TPU didukung kelas satu. Akurasi turun 0,004 — tidak ada yang protes.",
        "Twist-nya: TensorFlow tidak “mengalahkan” PyTorch di kasus ini — ia hanya punya pintu keluar yang berbeda. PyTorch unggul di fleksibilitas riset; TensorFlow unggul di ekosistem produksi (TFLite, TF Serving, TPU). Engineer yang hanya bisa satu framework akan memaksakan pintu yang salah; engineer yang bisa peta transfernya memilih pintu yang tepat dalam 4 hari, bukan 2 minggu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan framework adalah keputusan arsitektur yang sulit dibalik: model yang sudah produksi dalam format yang tidak didukung target deployment = rewrite. Tanyakan KEBUTUHAN DEPLOYMENT (HP? TPU? latensi?) sebelum memilih framework — bukan setelah model jadi.",
      },
      reference: "Pilih framework dari pintu keluar (deployment), bukan dari kenyamanan training.",
    },
    {
      id: "api",
      eyebrow: "Langkah 3 · Keras API",
      title: "Sequential vs Functional: Si Tukang Lego & Si Arsitek",
      prose: [
        "Keras punya dua cara merakit model. Sequential — Si Tukang Lego: tumpukan layer berurutan, satu input, satu output, satu jalur lurus. Cocok untuk 80% kasus: MLP, CNN sederhana, LSTM tunggal. Kelebihannya: kode 5 baris, sulit salah.",
        "Functional API — Si Arsitek: model sebagai graf — tiap layer adalah fungsi yang dipanggil pada tensor. Bisa multi-input (gambar + teks), multi-output (klasifikasi + regresi), dan skip connection (jalur yang melompati layer, seperti ResNet). Kelebihannya: arsitektur apa pun bisa diekspresikan; harganya kode lebih panjang.",
        "Aturan praktisnya sederhana: mulai dari Sequential; pindah ke Functional saat kamu butuh SESUATU yang bukan garis lurus — input kedua, output kedua, atau koneksi yang melompat. Jangan mulai dari Functional “untuk jaga-jaga”: kompleksitas yang tidak dipakai adalah bug yang menunggu.",
        "💡 Intuisi: Sequential adalah kasus khusus dari Functional (graf berupa garis lurus). Semua yang bisa dibuat Sequential bisa dibuat Functional — tetapi tidak sebaliknya. Jadi belajar Functional = belajar keduanya sekaligus.",
        "Cara membaca: panel kiri = tiga layer bertumpuk lurus; panel kanan = input bercabang ke dua Dense lalu bertemu lagi di Concat — pola yang mustahil di Sequential.",
        "Interpretasi: kalau arsitekturmu bisa digambar sebagai satu garis lurus, Sequential cukup. Begitu ada cabang atau lompatan, Functional wajib.",
      ],
      figure: {
        svg: KERAS_SVG,
        alt: "Perbandingan Sequential (tumpukan linear) vs Functional API (graf dengan dua cabang dan concat).",
        caption: "Sequential = satu garis lurus; Functional = graf bebas. Pilih berdasarkan bentuk arsitekturmu.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: Functional selalu lebih baik karena lebih fleksibel",
        type: "pitfall",
        body: "Yang benar: fleksibilitas yang tidak dipakai = permukaan bug yang tidak perlu. Model Sequential 3 layer yang ditulis dalam Functional API tidak menjadi lebih baik — hanya lebih panjang dan lebih mudah salah wiring. Fleksibilitas adalah alat, bukan nilai.",
      },
      reference: "Garis lurus → Sequential. Cabang/lompatan/multi → Functional.",
    },
    {
      id: "tfdata",
      eyebrow: "Langkah 4 · tf.data",
      title: "tf.data — Si Ban Berjalan: bottleneck yang tak terlihat",
      prose: [
        "Banyak training yang lambat bukan karena GPU-nya kecil, melainkan karena GPU-nya MENUNGGU data. tf.data adalah API pipeline input TensorFlow: dataset dibaca → .map(preprocessing) → .batch() → .prefetch(). Prefetch inilah kuncinya: batch berikutnya disiapkan (di CPU) sementara GPU memproses batch saat ini — seperti ban berjalan pabrik yang tidak pernah berhenti.",
        "Pola yang benar: cache() untuk data yang muat di memori (baca sekali dari disk), map() dengan num_parallel_calls untuk preprocessing paralel, prefetch() di ujung. Pola yang salah — dan sangat umum: memuat seluruh dataset ke memori Python lalu memakai fit() biasa, atau preprocessing di dalam training loop.",
        "Ukur dulu sebelum mengoptimasi: waktu per step training = yang TERLAMBAT antara komputasi dan input. Kalau GPU utilization 40%, masalahmu bukan model — melainkan ban berjalan yang tersendat.",
      ],
      formula: String.raw`T_{step} = \max(T_{komputasi}, T_{input})`,
      formulaNote: "T_step = waktu per training step; T_komputasi = waktu GPU menghitung forward+backward; T_input = waktu menyiapkan batch (baca disk, decode, augmentasi). Step berjalan secepat komponen TERLAMBAT — prefetch() membuat T_input tumpang tindih dengan T_komputasi sehingga tidak menambah waktu.",
      tasks: [],
      note: {
        title: "🚨 Mitos: training lambat = butuh GPU lebih besar",
        type: "pitfall",
        body: "Yang benar: cek GPU utilization dulu. Di bawah 70% dengan model kecil, 90% penyebabnya input pipeline — tambah prefetch dan paralel map sebelum mengusulkan GPU baru. GPU mahal yang menunggu data adalah pemborosan termahal di deep learning.",
      },
      reference: "Cache → map paralel → batch → prefetch. Ukur utilization sebelum beli GPU.",
    },
    {
      id: "fit",
      eyebrow: "Langkah 5 · Training & deployment",
      title: "fit() vs loop manual, SavedModel & pintu keluar produksi",
      prose: [
        "Di PyTorch kamu menulis training loop manual: for epoch → forward → loss → backward → optimizer.step(). Di Keras, model.fit() melakukan semuanya — plus callback: EarlyStopping (berhenti saat val_loss tak membaik), ModelCheckpoint (simpan terbaik), ReduceLROnPlateau (kecilkan LR saat plateau). Peta transfernya: yang kamu tulis manual di PyTorch = yang dikonfigurasi di Keras.",
        "Kapan loop manual masih perlu di Keras? Saat training tidak standar: dua optimizer, loss custom per-batch yang aneh, atau gradient surgery. Keras menyediakannya via custom train_step — 95% kasus cukup fit(), 5% sisanya pakai train_step, bukan pindah framework.",
        "SavedModel adalah format standar TensorFlow: graf komputasi + bobot + signature (input/output) dalam satu direktori. Dari sinilah semua pintu keluar produksi terbuka: TF Serving (server HTTP/gRPC untuk model), TFLite (HP/edge, dengan kuantisasi), TF.js (browser), TPU (didukung kelas satu). Inilah keunggulan struktural TensorFlow: satu format, banyak pintu.",
        "💡 Intuisi: PyTorch = laboratorium terbaik; TensorFlow = pabrik terbaik. Riset mutakhir lahir di PyTorch, lalu banyak yang “naik kelas” ke format produksi. Karier deep learning engineer yang lengkap menguasai kedua sisi meja ini.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: model.fit() berarti tidak perlu paham training loop",
        type: "pitfall",
        body: "Yang benar: fit() menyembunyikan loop, bukan menghapuskannya. Saat loss NaN, gradien meledak, atau callback bertingkah aneh, yang men-debug adalah pemahamanmu tentang forward-backward-update — persis yang dilatih lab lesson ini. Abstraksi tanpa fondasi = helpless saat rusak.",
      },
      reference: "fit() + callbacks untuk 95% kasus; SavedModel = paspor ke semua pintu produksi.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: training loop ala Keras dengan numpy",
      prose: [
        "Waktunya praktik. Kamu akan menulis training loop seperti yang dilakukan model.fit() di balik layar: forward pass jaringan 2-3-1 dengan aktivasi sigmoid, MSE loss, backprop manual, dan gradient descent — 300 epoch atas 4 contoh. Tujuannya bukan akurasi (datanya mainan), melainkan merasakan apa yang disembunyikan fit(): loss yang turun epoch demi epoch karena gradien yang benar.",
        "Perhatikan tiga angka loss yang dicetak: epoch 1, 50, dan 300. Pola yang benar: 0,0527 → 0,0505 → 0,0274 — turun, melambat, lalu turun lagi. Kalau loss-mu NAIK atau NaN, tersangka utama: tanda update bobot terbalik (ditambah bukan dikurang) atau turunan sigmoid yang salah.",
        "Cara membaca output: tiap baris = loss rata-rata setelah epoch itu. Baris terakhir (0,0274) = bukti loop-mu bekerja.",
        "Interpretasi: inilah yang terjadi di dalam model.fit() setiap kali kamu memanggilnya — hanya saja di Keras, 15 baris kodemu ini digantikan satu baris, plus callback, plus optimasi graf. Memahami isinya membuatmu bisa men-debug saat fit() bertingkah.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi forward pass: hitung `a1` (sigmoid dari X@W1+b1) dan `a2` (sigmoid dari a1@W2+b2)" },
        { id: "t2", text: "Lengkapi backward: gradien MSE + turunan sigmoid, lalu update W1, b1, W2, b2 dengan learning rate" },
        { id: "t3", text: "Simpan tiap loss ke `riwayat`, cetak loss epoch 1, 50, 300 dengan format persis contoh" },
      ],
      expected: "epoch   1 loss=0.0527\nepoch  50 loss=0.0505\nepoch 300 loss=0.0274",
      hints: [
        "Turunan sigmoid dari output s adalah s*(1-s) — fungsi dsig() sudah disediakan.",
        "Gradien MSE terhadap prediksi: d = (a2 - y) * (2/n) * dsig(a2).",
        "Update: W -= lr * dW. Pastikan dikurang, bukan ditambah.",
      ],
      code: {
        starter: `import numpy as np

def sig(x):
    return 1 / (1 + np.exp(-x))

def dsig(s):
    return s * (1 - s)

# Data mainan: 4 contoh, 2 fitur -> 1 target
X = np.array([[0.2, 0.8], [0.9, 0.1], [0.4, 0.5], [0.7, 0.7]])
y = np.array([[0.3], [0.9], [0.5], [0.8]])

# Bobot awal TETAP (JANGAN UBAH) - deterministik, tanpa random
W1 = np.array([[0.5, -0.3, 0.2], [0.1, 0.4, -0.2]])
b1 = np.array([0.0, 0.1, -0.1])
W2 = np.array([[0.6], [-0.4], [0.3]])
b2 = np.array([0.2])

lr = 0.5
riwayat = []

# TULIS KODEMU di dalam loop (ganti ... dengan kodemu)
for ep in range(1, 301):
    # --- forward ---
    a1 = ...
    a2 = ...
    loss = float(np.mean((a2 - y) ** 2))
    riwayat.append(loss)
    # --- backward ---
    ...
    if ep in (1, 50, 300):
        print(f"epoch {ep:3d} loss={loss:.4f}")`,
        lockLines: 22,
        solution: `import numpy as np

def sig(x):
    return 1 / (1 + np.exp(-x))

def dsig(s):
    return s * (1 - s)

# Data mainan: 4 contoh, 2 fitur -> 1 target
X = np.array([[0.2, 0.8], [0.9, 0.1], [0.4, 0.5], [0.7, 0.7]])
y = np.array([[0.3], [0.9], [0.5], [0.8]])

# Bobot awal TETAP (JANGAN UBAH) - deterministik, tanpa random
W1 = np.array([[0.5, -0.3, 0.2], [0.1, 0.4, -0.2]])
b1 = np.array([0.0, 0.1, -0.1])
W2 = np.array([[0.6], [-0.4], [0.3]])
b2 = np.array([0.2])

lr = 0.5
riwayat = []

# TULIS KODEMU di dalam loop (ganti ... dengan kodemu)
for ep in range(1, 301):
    # --- forward ---
    a1 = sig(X @ W1 + b1)
    a2 = sig(a1 @ W2 + b2)
    loss = float(np.mean((a2 - y) ** 2))
    riwayat.append(loss)
    # --- backward ---
    d2 = (a2 - y) * (2 / len(X)) * dsig(a2)
    dW2 = a1.T @ d2
    db2 = d2.sum(axis=0)
    d1 = (d2 @ W2.T) * dsig(a1)
    dW1 = X.T @ d1
    db1 = d1.sum(axis=0)
    W2 -= lr * dW2
    b2 -= lr * db2
    W1 -= lr * dW1
    b1 -= lr * db1
    if ep in (1, 50, 300):
        print(f"epoch {ep:3d} loss={loss:.4f}")

loss_akhir = riwayat[-1]`,
        checks: [
          { kind: "defined", task: "t3", name: "riwayat", label: "`riwayat` terdefinisi", msg: "Simpan loss tiap epoch ke list riwayat." },
          { kind: "equal", task: "t3", name: "loss_akhir", value: 0.0274, tol: 0.0005, label: "loss akhir ≈ 0,0274", msg: "Loss epoch 300 harus 0,0274 — cek tanda update dan turunan sigmoid." },
          { kind: "stdout_matches", task: "t3", pattern: "epoch\\s+1 loss=0\\.0527", label: "Loss epoch 1 benar", msg: "Samakan format print dengan starter." },
          { kind: "stdout_matches", task: "t3", pattern: "epoch\\s+300 loss=0\\.0274", label: "Loss epoch 300 benar", msg: "Loss harus turun — cek arah update gradien." },
          { kind: "uses", task: "t1", token: "sig", label: "Memakai fungsi aktivasi `sig`", msg: "Forward pass harus memakai aktivasi sigmoid." },
        ],
      },
      note: {
        title: "Bingkai jujur lab ini",
        type: "risk",
        body: "Lab ini memakai numpy untuk mensimulasikan training loop — TensorFlow tidak tersedia di browser. Logika forward-backward-update-nya identik dengan yang dijalankan model.fit(); yang berbeda hanya skalanya. Untuk menjalankan Keras sungguhan, salin logika ini ke notebook dengan tensorflow terinstall.",
      },
      reference: "fit() = loop ini + callback. Pahami isinya agar bisa debug saat rusak.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: framework apa untuk kebutuhanku?",
      prose: [
        "Skenario 1 — riset arsitektur baru, eksperimen cepat, butuh fleksibilitas penuh. → PyTorch. Alasan: eager execution dan ekosistem paper terbaru masih PyTorch-sentris.",
        "Skenario 2 — model harus jalan di HP Android / edge device. → Keras → TFLite (+ kuantisasi). Alasan: jalur TFLite adalah yang paling matang untuk edge; PyTorch Mobile ada tetapi komunitasnya lebih kecil.",
        "Skenario 3 — serving skala besar di server / klaster, butuh versioning model. → SavedModel + TF Serving. Alasan: TF Serving dirancang untuk itu (model versioning, batching otomatis).",
        "Skenario 4 — training di TPU. → TensorFlow/JAX. Alasan: dukungan TPU kelas satu; PyTorch XLA ada tetapi tidak semulus.",
        "Skenario 5 — tim sudah PyTorch dan butuh deploy cepat tanpa porting. → TorchScript / ONNX Runtime. Alasan: jangan porting 4 hari untuk kebutuhan yang bisa dipenuhi ekspor 4 jam — porting hanya bila targetnya (TPU, TFLite) memang butuh.",
        "Aturan praktis 10 detik: (1) tanya dulu target deployment-nya apa; (2) riset murni → PyTorch; (3) HP/edge/TPU/serving → TensorFlow; (4) ragu → mulai PyTorch, porting nanti (lebih mudah dari TF ke PyTorch? tidak — rencanakan dari awal).",
      ],
      note: {
        title: "💡 Intuisi: framework = keputusan arsitektur, bukan preferensi",
        body: "Tim yang memilih framework karena “yang dikuasai tim” lalu menemukan target deployment tidak didukung akan membayar rewrite. Masukkan baris “target deployment” di dokumen desain SEBELUM baris “framework”.",
      },
      tasks: [],
      reference: "Riset → PyTorch. HP/TPU/serving → TensorFlow. Tanya deployment dulu.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Tim fraud: dari PyTorch riset ke TF Serving produksi",
      prose: [
        "Tim fraud paylater punya model deteksi PyTorch (AUC 0,903) yang dilatih di GPU kantor. Kebutuhan produksi: scoring real-time 2.000 QPS di server CPU, plus versi ringan untuk aplikasi Android agen lapangan. Tim menimbang dua jalur: (A) TorchScript + optimasi manual, estimasi 3 minggu; (B) porting ke Keras (4 hari) → SavedModel ke TF Serving + TFLite int8 untuk Android.",
        "Tim memilih B. Hasil: porting 4 hari kerja; TF Serving menangani 2.000 QPS dengan latensi p95 38ms; TFLite int8 11 MB jalan di HP RAM 3 GB dengan latensi 12ms (dari 45ms versi float); AUC turun 0,903 → 0,900 — selisih 0,003 yang tidak mengubah keputusan bisnis apa pun (ambang operasional jauh lebih kasar).",
        "Yang menarik: 2 hari dari 4 hari porting dihabiskan bukan untuk arsitektur (itu 1:1), melainkan untuk preprocessing — pipeline PyTorch memakai transform custom yang harus ditulis ulang sebagai layer preprocessing Keras agar ikut tersimpan di SavedModel. Pelajaran: preprocessing yang tidak ikut tersimpan = train-serve skew menunggu terjadi.",
        "Pembahasan: keputusan B benar bukan karena TensorFlow “lebih baik”, melainkan karena targetnya (CPU serving + Android) adalah wilayah TensorFlow. Jika targetnya hanya server GPU internal, jalur A (TorchScript) akan menang karena tanpa porting. Framework mengikuti target — selalu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Preprocessing yang tidak ikut tersimpan dalam artefak model adalah sumber klasik train-serve skew: training memakai satu kode, serving memakai kode lain. SavedModel menyimpan preprocessing sebagai bagian graf — inilah nilai yang sering diremehkan dari format standar.",
      },
      reference: "Porting 4 hari mengalahkan optimasi 3 minggu — karena targetnya memang wilayah TensorFlow.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang TensorFlow & Keras — dari API sampai keputusan framework.",
      ],
      tasks: [],
      summary: [
        "Sequential untuk tumpukan linear; Functional untuk graf bebas (multi-input/output, skip connection).",
        "tf.data: cache → map paralel → batch → prefetch; T_step = max(T_komputasi, T_input).",
        "model.fit() + callbacks menggantikan loop manual; pahami loop-nya agar bisa debug.",
        "SavedModel = format standar → TF Serving, TFLite, TF.js, TPU.",
        "Pilih framework dari target deployment, bukan dari kenyamanan.",
      ],
      next: { label: "DLE26 — Video CV: Multi-Object Tracking & Action Recognition", href: "/v2/learn/dle26-video-tracking" },
      quiz: [
        {
          q: "Arsitektur membutuhkan dua input (gambar + teks) yang digabung sebelum output. API Keras yang tepat?",
          options: [
            { text: "Sequential — tumpuk saja dua-duanya", why: "Sequential hanya menerima satu jalur lurus — dua input tidak bisa diekspresikan.", correct: false },
            { text: "Functional API — model sebagai graf", why: "Functional memungkinkan multi-input, penggabungan, dan pola non-linear lainnya.", correct: true },
            { text: "Tidak bisa di Keras, harus PyTorch", why: "Functional API dirancang persis untuk kasus ini." },
            { text: "Dua model Sequential terpisah tanpa penggabungan", why: "Itu menghindari masalah, bukan menyelesaikannya — penggabungan adalah inti arsitekturnya." },
          ],
        },
        {
          q: "GPU utilization 40% saat training model kecil. Langkah pertama yang benar?",
          options: [
            { text: "Minta GPU yang lebih besar", why: "GPU-nya menganggur — masalahnya bukan kapasitas komputasi.", correct: false },
            { text: "Perbaiki input pipeline: cache, map paralel, prefetch", why: "Utilization rendah = GPU menunggu data; T_step ditentukan T_input yang lambat.", correct: true },
            { text: "Perkecil batch size", why: "Batch lebih kecil justru memperparah rasio overhead input per step." },
            { text: "Ganti optimizer", why: "Optimizer tidak berhubungan dengan GPU yang menganggur menunggu data." },
          ],
        },
        {
          q: "Apa peran callbacks seperti EarlyStopping dalam model.fit()?",
          options: [
            { text: "Menggantikan kebutuhan akan data validasi", why: "EarlyStopping justru MEMBUTUHKAN data validasi untuk memantau val_loss.", correct: false },
            { text: "Otomatisasi keputusan training (berhenti, simpan terbaik, turunkan LR) di titik tertentu", why: "Callback = fungsi yang dipanggil otomatis tiap epoch/batch — mengotomatiskan apa yang ditulis manual di loop PyTorch.", correct: true },
            { text: "Mempercepat komputasi GPU", why: "Callback tidak mengubah kecepatan komputasi — ia mengubah KEPUTUSAN training." },
            { text: "Menggantikan backpropagation", why: "Backprop tetap berjalan di dalam fit(); callback hanya mengorkestrasi." },
          ],
        },
        {
          q: "Mengapa SavedModel penting dalam ekosistem TensorFlow?",
          options: [
            { text: "Karena ukurannya selalu lebih kecil", why: "Ukuran bukan poinnya — formatnya yang standar.", correct: false },
            { text: "Satu format (graf + bobot + signature) yang membuka semua pintu produksi: TF Serving, TFLite, TF.js, TPU", why: "Standarisasi inilah keunggulan struktural TensorFlow di produksi.", correct: true },
            { text: "Karena hanya SavedModel yang bisa training", why: "Training bisa dari checkpoint biasa; SavedModel adalah format DEPLOYMENT." },
            { text: "Karena PyTorch tidak punya format model", why: "PyTorch punya TorchScript/ONNX — poinnya adalah ekosistem pintu keluar TensorFlow yang lebih lengkap." },
          ],
        },
        {
          q: "Startup butuh model di aplikasi iOS/Android dengan HP kentang. Keputusan framework yang paling tepat?",
          options: [
            { text: "PyTorch karena tim sudah bisa", why: "Kenyamanan tim tidak mengubah kendala deployment — jalur TFLite lebih matang untuk edge.", correct: false },
            { text: "Keras → TFLite dengan kuantisasi", why: "Jalur edge TensorFlow paling matang: konversi + kuantisasi int8 = 11 MB yang jalan di RAM 3 GB.", correct: true },
            { text: "Latih model 10× lebih besar agar akurat", why: "Model besar justru mustahil di HP kentang — arahnya salah.", correct: false },
            { text: "Jalankan inference di server saja, tanpa model di HP", why: "Itu alternatif valid bila offline tidak dibutuhkan — tetapi soalnya meminta jalan di HP." },
          ],
        },
      ],
    },
  ],
};

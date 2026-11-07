import type { V2Lesson } from "../lib/types";

// DLE18 — PyTorch hands-on: tensor, autograd, nn.Module, DataLoader,
// training loop, GPU, mixed precision, debugging. Lab: emulasi training
// loop dengan numpy (Pyodide tidak punya PyTorch) yang meniru semantik
// zero_grad -> forward -> loss -> backward -> step.

export const dle18: V2Lesson = {
  slug: "dle18-pytorch",
  track: "Deep Learning Engineer",
  module: "Fondasi",
  title: "DLE18 — PyTorch: Cara Model Ditulis di Dunia Nyata",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta lesson",
      title: "Peta lesson: dari tensor sampai model yang jalan di GPU",
      prose: [
        "Latar singkat (cukup ini untuk mengikuti lesson): PyTorch adalah framework deep learning paling dipakai di industri dan riset. Ide intinya tiga: tensor (array yang bisa mengingat perhitungannya), autograd (mesin turunan otomatis), dan pola training loop yang sama di semua proyek. Lesson ini mengajarkannya hands-on — cara berpikirnya, bukan sekadar API.",
        "Setelah lesson ini kamu bisa:",
        "• Menjelaskan peran tensor, autograd, nn.Module, dan DataLoader dalam satu kalimat kerja.",
        "• Menulis training loop lima gerakan (zero_grad → forward → loss → backward → step) tanpa mencontek.",
        "• Memindahkan model ke GPU dan menjelaskan kapan mixed precision layak dipakai.",
        "• Mendiagnosis tiga bug PyTorch paling umum: gradien menumpuk, tensor beda device, dan loss NaN.",
        "• Memutuskan kapan PyTorch tepat dipakai — dan kapan sklearn, Keras, atau JAX lebih masuk akal.",
        "Isi lesson: cerita bug satu baris yang membuang tiga malam GPU → tensor & autograd → nn.Module & DataLoader → training loop + GPU + mixed precision → lab emulasi loop → peta keputusan framework → mini-case migrasi tim fraud → checkpoint.",
      ],
      tasks: [],
      reference: "PyTorch = tensor + autograd + loop lima gerakan. Sisanya detail.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Malam ketika GPU bekerja, tetapi modelnya tidak belajar",
      prose: [
        "Dimas, data scientist di sebuah bank digital, baru saja memigrasikan model skor fraud timnya dari numpy manual ke PyTorch. Dataset: 2.048.000 transaksi, 40 fitur. Ia menyewa satu GPU A100: Rp1,2 juta per malam, tiga malam berturut-turut — Rp3,6 juta untuk satu eksperimen. Setiap pagi ia mengecek dashboard: loss 0,6931. Malam pertama: 0,6931. Malam kedua: 0,6931. Malam ketiga: 0,6931.",
        "Ia menyalahkan learning rate, arsitektur, data — diganti semua, tidak ada yang berubah. GPU-nya bekerja (utilisasi 98%, kipas meraung), datanya mengalir, kodenya jalan tanpa error. Modelnya sekadar menolak belajar. Malam keempat, frustrasi, ia menambahkan satu baris print: norma gradien tiap batch. Hasilnya: 4,7 → 9,2 → 18,5 → 40,1. Gradiennya MENUMPUK, berlipat tiap batch.",
        "Twist-nya: bug-nya satu baris yang hilang — `optimizer.zero_grad()`. Di PyTorch, gradien tidak di-reset otomatis; setiap `loss.backward()` MENAMBAH ke gradien lama. Tiga malam GPU mahal dikalahkan satu baris kode. Dan angka 0,6931 itu sendiri adalah petunjuk yang ia abaikan: ln 2 = loss model yang memprediksi 0,5 untuk semua orang — model yang tidak belajar apa-apa.",
        "Lesson ini dimulai dari sana: memahami training loop PyTorch sedalam itu, sehingga angka seperti 0,6931 langsung terbaca sebagai diagnosis, bukan misteri.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model fraud/kredit yang 'jalan tapi tidak belajar' adalah risiko operasional: metriknya terlihat hidup (loss tercatat, GPU sibuk) padahal keputusannya setara koin. Engineer yang paham loop training bisa membedakan model sehat dari model zombie dalam 10 detik — dari pola loss dan norma gradien.",
      },
      reference: "loss macet di 0,6931 ≈ ln 2 = model menebak 0,5 untuk semua. Itu diagnosis, bukan nasib.",
    },
    {
      id: "tensor-autograd",
      eyebrow: "Langkah 3 · Tensor & autograd",
      title: "Tensor: array yang bisa ingat; autograd: akuntan yang mencatat",
      prose: [
        "`torch.Tensor` adalah numpy.ndarray yang punya ingatan: setiap operasi padanya dicatat ke dalam computational graph bila `requires_grad=True`. Setelah forward pass, satu panggilan `loss.backward()` menelusuri catatan itu mundur dan mengisi `.grad` tiap parameter. Inilah bedanya PyTorch dari numpy: turunannya gratis, tidak ditulis manual.",
        "💡 Intuisi: bayangkan autograd sebagai akuntan yang berdiri di belakangmu dan mencatat setiap transaksi. `loss.backward()` = akuntan itu menyerahkan laporan: 'transaksi w₁ menyumbang sekian pada kerugian'. Kamu tidak pernah menghitung turunan dengan tangan — kamu hanya harus memastikan akuntannya menyala (`requires_grad=True`) dan catatannya tidak dihapus sebelum waktunya.",
        "Contoh angka: w = 2,0, x = 3,0, y = 10,0, ŷ = w·x = 6,0. Loss MSE: L = (ŷ − y)² = 16,0. Autograd menghitung dL/dw = 2(ŷ − y)·x = 2(−4)(3) = −24,0. Satu langkah SGD dengan η = 0,1: w ← 2,0 − 0,1×(−24,0) = 4,4. Loss baru: (13,2 − 10)² = 10,24 — turun dari 16,0. Itu seluruh magisnya: catat, turunkan, geser.",
        "Peran `requires_grad`: parameter model (w, b) menyalakannya — mereka yang dioptimasi. Data input (x, y) mematikannya — mereka fakta, bukan variabel keputusan. Menyalakannya di data = membuang memori untuk gradien yang tidak pernah dipakai.",
      ],
      formula: String.raw`L = \frac{1}{n}\sum_{i=1}^{n}(\hat{y}_i - y_i)^2, \qquad w \leftarrow w - \eta\,\nabla_w L`,
      formulaNote: "L = loss MSE (rata-rata kuadrat error); n = jumlah sampel; ŷᵢ (y-hat) = prediksi sampel ke-i; yᵢ = target; w = parameter; η (eta) = learning rate; ∇_w L = gradien loss terhadap w (dihitung autograd, bukan manual).",
      requires: ["numpy"],
      tasks: [],
      note: {
        title: "🚨 Mitos: operasi in-place itu cuma gaya penulisan, hasilnya sama",
        type: "pitfall",
        body: "Yang benar: operasi in-place seperti `x.add_(1)` atau `w *= 0.9` pada tensor yang masuk computational graph MERUSAK catatan autograd — PyTorch melempar error 'one of the variables needed for gradient computation has been modified by an inplace operation'. Pakai versi out-of-place (`x = x + 1`) kecuali kamu paham betul graph-nya. Bug ini tidak muncul di numpy — ia khas PyTorch.",
      },
      reference: "requires_grad=True hanya untuk parameter. In-place ops = racun bagi autograd.",
    },
    {
      id: "modul-dataloader",
      eyebrow: "Langkah 4 · nn.Module & DataLoader",
      title: "nn.Module: rumah dengan blueprint; DataLoader: kasir yang antrekan batch",
      prose: [
        "`nn.Module` adalah cara PyTorch membungkus model: sebuah class dengan dua bagian. `__init__` mendefinisikan lapisan (`self.fc = nn.Linear(40, 1)` — 40 fitur masuk, 1 skor keluar). `forward(x)` mendefinisikan alur data (`return torch.sigmoid(self.fc(x))`). Semua parameter terdaftar otomatis di `model.parameters()` — optimizer mengambil dari sana, kamu tidak pernah mengumpulkannya manual.",
        "💡 Intuisi: `__init__` adalah blueprint rumah (berapa kamar, di mana), `forward` adalah denah alirnya (tamu masuk pintu depan, keluar pintu belakang). PyTorch memisahkan keduanya supaya arsitektur bisa dibaca tanpa mengeksekusi apa pun — dan autograd tahu persis jalur mana yang harus ditelusuri mundur.",
        "Contoh angka: dataset 2.048.000 transaksi tidak muat di memori GPU 16 GB sekaligus (2.048.000 × 40 fitur × 4 byte ≈ 328 MB data — sebenarnya muat, tapi aktivasi + gradien tiap lapisan melipatgandakannya 3–5×). `DataLoader(dataset, batch_size=512, shuffle=True)` memotongnya jadi 4.000 batch per epoch: tiap batch hanya 512 × 40 × 4 byte ≈ 82 KB data mentah. Satu epoch = 4.000 langkah update, bukan 1 — model mendapat 4.000 koreksi per putaran data.",
        "`shuffle=True` bukan kosmetik: tanpa shuffle, model melihat semua transaksi normal dulu baru semua fraud di akhir — ia belajar urutan, bukan pola. DataLoader mengacak tiap epoch (dengan seed bila perlu reproducibility) dan bisa memuat batch berikutnya di background (`num_workers>0`) selagi GPU menghitung batch sekarang.",
      ],
      formula: String.raw`\theta \leftarrow \theta - \eta\,\frac{1}{|B|}\sum_{i \in B}\nabla_\theta\,\ell_i`,
      formulaNote: "θ (theta) = semua parameter model sekaligus; η = learning rate; B = satu mini-batch; |B| = ukuran batch (mis. 512); ℓᵢ = loss sampel ke-i dalam batch. Mini-batch SGD: gradien dirata-ratakan atas batch, bukan seluruh dataset — lebih cepat dan lebih berisik (noise-nya justru membantu).",
      tasks: [],
      note: {
        title: "💡 Intuisi: DataLoader adalah kontrak, bukan sekadar loop",
        body: "Tiga janji DataLoader: (1) tiap sampel muncul tepat sekali per epoch — tidak ada yang terlewat atau ganda; (2) urutannya acak tiap epoch — model tidak bisa menghafal posisi; (3) batch terakhir yang lebih kecil (drop_last=False) tetap diproses. Menulis loop manual yang melanggar satu saja dari ini = bug training yang sulit dilacak.",
      },
      reference: "__init__ = lapisan, forward = alur. DataLoader = batch 512, shuffle tiap epoch.",
    },
    {
      id: "training-loop",
      eyebrow: "Langkah 5 · Training loop, GPU & mixed precision",
      title: "Lima gerakan ritual: zero_grad → forward → loss → backward → step",
      prose: [
        "Setiap proyek PyTorch di dunia — dari skripsi sampai model produksi bank — menjalankan loop yang sama persis, tiap batch: (1) `optimizer.zero_grad()` — hapus gradien lama; (2) `pred = model(xb)` — forward; (3) `loss = criterion(pred, yb)` — hitung loss; (4) `loss.backward()` — isi gradien; (5) `optimizer.step()` — geser parameter. Lima baris. Kuasai ini = bisa membaca 90% kode PyTorch yang ada.",
        "Urutan itu tidak bisa ditukar: `step()` sebelum `backward()` = menggeser dengan gradien basi; lupa `zero_grad()` = gradien menumpuk seperti kasus Dimas (norma gradien 4,7 → 40,1). Satu-satunya pengecualian yang disengaja: gradient accumulation — menumpuk gradien K batch kecil untuk meniru batch besar, lalu `step()` sekali. Itu teknik, bukan kelalaian.",
        "GPU: `device = torch.device('cuda')`, lalu `model.to(device)`, `xb, yb = xb.to(device), yb.to(device)`. Satu aturan keras: SEMUA tensor dalam satu operasi harus di device yang sama. Error 'Expected all tensors to be on the same device' = model di GPU tapi data masih di CPU (atau sebaliknya). Kecepatan tipikal: matmul 40×512 di CPU ~2 ms, di GPU ~0,05 ms — 40× lebih cepat untuk operasi yang paralel.",
        "Mixed precision: `torch.amp.autocast` menjalankan forward dalam float16 (setengah memori, ~1,5–2× lebih cepat di GPU modern), tapi gradien kecil bisa underflow menjadi nol di FP16. Solusinya `GradScaler`: kalikan loss dengan faktor s (mis. 1024) sebelum backward agar gradien 'terangkat' dari zona underflow, lalu bagi lagi sebelum `step()`. Formula kerjanya: L_scaled = s·L; step memakai ∇L_scaled/s = ∇L — matematikanya identik, hanya aritmetikanya yang aman.",
        "Debugging checklist PyTorch (tempel di dinding): (1) loss NaN? → cek learning rate terlalu besar, atau pembagian dengan nol di loss custom; (2) loss macet di ln 2 ≈ 0,693 (biner) atau −ln(1/K) (K kelas)? → model tidak belajar: cek zero_grad, cek label tidak tertukar, cek data masuk benar; (3) shape mismatch? → print `xb.shape` dan arsitektur lapisan pertama — 9 dari 10 kasus salah di dimensi fitur; (4) device error? → print `next(model.parameters()).device` vs `xb.device`; (5) lambat padahal GPU? → cek `torch.cuda.is_available()`, DataLoader `num_workers`, dan apakah datanya benar-benar `.to(device)`.",
      ],
      formula: String.raw`L_{\text{scaled}} = s \cdot L, \qquad \theta \leftarrow \theta - \eta\,\frac{\nabla_\theta L_{\text{scaled}}}{s}`,
      formulaNote: "s = faktor skala GradScaler (mis. 1024, disesuaikan otomatis); L = loss asli; θ = parameter; η = learning rate. Karena ∇(s·L)/s = ∇L, update-nya identik dengan full precision — scaler hanya mencegah underflow float16, bukan mengubah matematika.",
      tasks: [],
      note: {
        title: "🚨 Mitos: lupa zero_grad cuma bikin training sedikit lebih lambat",
        type: "pitfall",
        body: "Yang benar: gradien di PyTorch MENUMPUK secara default — `loss.backward()` menambahkan ke `.grad`, bukan menggantikannya. Lupa `zero_grad()` berarti tiap batch memakai gradien gabungan semua batch sebelumnya: arah update makin kacau, norma gradien meledak (4,7 → 40,1 di cerita Dimas), dan loss macet. Ini bug nomor satu pemula PyTorch — dan tidak ada warning apa pun.",
      },
      reference: "zero_grad → forward → loss → backward → step. Semua tensor di device yang sama.",
    },
    {
      id: "lab-loop",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: emulasi training loop PyTorch dari nol",
      prose: [
        "Pyodide (Python di browser) tidak punya PyTorch, jadi lab ini mengemulasi semantiknya dengan numpy: dataset kecil, `iter_batches` yang meniru `DataLoader` (shuffle tiap epoch), dan loop lima gerakan — forward, loss, backward manual, step — dengan gradien yang dihitung ulang tiap batch (itulah arti `zero_grad` di sini: gradien tidak menumpuk).",
        "Perhatikan dua angka yang akan keluar: `loss_awal` dan `loss_akhir`. Dengan bobot awal nol, model memprediksi 0,5 untuk semua orang → loss awal = −ln(0,5) = ln 2 ≈ 0,6931. Itulah angka 'model zombie' dari cerita Dimas. Tugasmu: buat loss akhirnya turun di bawah itu — bukti loop-mu benar-benar belajar.",
        "Cara membaca: bila `loss_akhir` macet di 0,6931, loop-mu tidak belajar — cek urutan lima gerakanmu, persis seperti debugging checklist langkah 5.",
        "Interpretasi: penurunan 0,6931 → ~0,40 dalam 5 epoch pada 2.000 sampel menunjukkan gradien mengalir dengan benar dari loss ke tiap parameter. Di PyTorch asli, `loss.backward()` melakukan persis perhitungan `err`, `dw`, `db` yang kamu tulis manual di sini.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Implementasikan forward + loss per batch: `pred` = sigmoid(xb @ w + b), `loss` = bce(pred, yb)" },
        { id: "t2", text: "Implementasikan backward + step: `err` = pred − yb, `dw`, `db`, lalu update `w` dan `b` dengan lr" },
        { id: "t3", text: "Cetak `loss_awal` dan `loss_akhir` dengan 4 desimal" },
      ],
      expected: "loss_awal=0.6931  loss_akhir=0.3987",
      hints: [
        "Forward: pred = sigmoid(xb @ w + b).",
        "Gradien BCE+sigmoid menyederhanakan jadi err = pred - yb; dw = xb.T @ err / len(yb); db = err.mean().",
        "Step: w = w - lr * dw; b = b - lr * db — gradien dihitung baru tiap batch (zero_grad implisit).",
      ],
      code: {
        starter: `import numpy as np

rng = np.random.default_rng(42)
N = 2000
X = rng.normal(0, 1, (N, 3))
w_true = np.array([1.5, -2.0, 0.8]); b_true = -0.5
p = 1 / (1 + np.exp(-(X @ w_true + b_true)))
y = (rng.random(N) < p).astype(float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def bce(pred, target):
    return -(target * np.log(pred + 1e-12) + (1 - target) * np.log(1 - pred + 1e-12)).mean()

def iter_batches(X, y, bs, seed):
    # meniru torch.utils.data.DataLoader: shuffle tiap epoch
    r = np.random.default_rng(seed)
    idx = r.permutation(len(X))
    for i in range(0, len(X), bs):
        j = idx[i:i+bs]
        yield X[j], y[j]

# "parameter model": di PyTorch ini tensor dengan requires_grad=True
w = np.zeros(3); b = 0.0
lr = 0.5

loss_awal = bce(sigmoid(X @ w + b), y)

# TULIS KODEMU: training loop 5 epoch, batch 64 (zero_grad -> forward -> loss -> backward -> step)
for epoch in range(5):
    for xb, yb in iter_batches(X, y, 64, seed=epoch):
        pred =
        loss =
        err =
        dw =
        db =
        w =
        b =

loss_akhir = bce(sigmoid(X @ w + b), y)
print(f"loss_awal={loss_awal:.4f}")
print(f"loss_akhir={loss_akhir:.4f}")`,
        lockLines: 29,
        solution: `import numpy as np

rng = np.random.default_rng(42)
N = 2000
X = rng.normal(0, 1, (N, 3))
w_true = np.array([1.5, -2.0, 0.8]); b_true = -0.5
p = 1 / (1 + np.exp(-(X @ w_true + b_true)))
y = (rng.random(N) < p).astype(float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def bce(pred, target):
    return -(target * np.log(pred + 1e-12) + (1 - target) * np.log(1 - pred + 1e-12)).mean()

def iter_batches(X, y, bs, seed):
    # meniru torch.utils.data.DataLoader: shuffle tiap epoch
    r = np.random.default_rng(seed)
    idx = r.permutation(len(X))
    for i in range(0, len(X), bs):
        j = idx[i:i+bs]
        yield X[j], y[j]

# "parameter model": di PyTorch ini tensor dengan requires_grad=True
w = np.zeros(3); b = 0.0
lr = 0.5

loss_awal = bce(sigmoid(X @ w + b), y)

# TULIS KODEMU: training loop 5 epoch, batch 64 (zero_grad -> forward -> loss -> backward -> step)
for epoch in range(5):
    for xb, yb in iter_batches(X, y, 64, seed=epoch):
        pred = sigmoid(xb @ w + b)   # forward
        loss = bce(pred, yb)         # loss
        err = pred - yb              # dL/dz (backward: turunan BCE + sigmoid)
        dw = xb.T @ err / len(yb)    # gradien untuk w
        db = err.mean()              # gradien untuk b
        w = w - lr * dw              # optimizer.step()
        b = b - lr * db

loss_akhir = bce(sigmoid(X @ w + b), y)
print(f"loss_awal={loss_awal:.4f}")
print(f"loss_akhir={loss_akhir:.4f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "pred", label: "`pred` terdefinisi", msg: "Hitung pred = sigmoid(xb @ w + b) di dalam loop batch." },
          { kind: "defined", task: "t2", name: "dw", label: "`dw` terdefinisi", msg: "Hitung dw = xb.T @ err / len(yb)." },
          { kind: "equal", task: "t2", name: "loss_awal", value: 0.6931, tol: 0.0001, label: "`loss_awal` seharusnya 0.6931", msg: "Dengan w=0, model memprediksi 0.5 untuk semua: BCE = ln 2 = 0.6931." },
          { kind: "equal", task: "t2", name: "loss_akhir", value: 0.3987, tol: 0.002, label: "`loss_akhir` sekitar 0.3987", msg: "Urutan per batch: pred -> loss -> err = pred - yb -> dw, db -> w = w - lr*dw. Jangan menumpuk gradien antar batch." },
          { kind: "stdout_matches", task: "t3", pattern: "loss_awal=0\\.6931\\s*\\n\\s*loss_akhir=0\\.3987", label: "`print` menampilkan kedua loss", msg: "Format: loss_awal=0.6931 di baris pertama, loss_akhir=0.3987 di baris kedua." },
        ],
      },
      reference: "pred = sigmoid(xb@w+b); err = pred-yb; dw = xb.T@err/n; w -= lr*dw. Gradien baru tiap batch.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "PyTorch, JAX, Keras, atau sklearn? Peta keputusannya",
      prose: [
        "Skenario 1 — Data tabel di bawah 100 ribu baris, model harus bisa dijelaskan ke auditor. → sklearn (logistic regression, gradient boosting). Alasan: tidak butuh GPU, training hitungan detik, koefisien bisa ditunjuk satu per satu. PyTorch di sini = meriam untuk nyamuk.",
        "Skenario 2 — Arsitektur custom, butuh debugging granular, riset atau model non-standar. → PyTorch. Alasan: dynamic graph + Pythonic — kamu bisa print tensor di tengah forward, pasang breakpoint di backward. Fleksibilitasnya tak tertandingi untuk eksperimen.",
        "Skenario 3 — Training raksasa multi-TPU/GPU, transformer atau workload yang butuh kompilasi XLA. → JAX. Alasan: transformasi fungsi (jit, grad, vmap) dan performa mentah terbaik di skala besar. Harganya: API fungsional yang lebih curam dipelajari.",
        "Skenario 4 — Prototyping cepat oleh tim yang bukan spesialis DL, deadline dua minggu. → Keras. Alasan: API paling ringkas (`model.fit`), sekarang berjalan di atas JAX/TF/PyTorch. Harganya: lebih sulit keluar dari pola bakunya saat butuh custom.",
        "Skenario 5 — Model PyTorch harus jalan di HP atau edge device. → PyTorch + export (TorchScript/ONNX). Alasan: training tetap di PyTorch yang fleksibel, inferensi dikompilasi ke runtime ringan. Jangan training langsung di framework mobile.",
        "Aturan praktis 10 detik: (1) tabel kecil + audit → sklearn; (2) custom/deep → PyTorch; (3) skala raksasa → JAX; (4) cepat jadi → Keras; (5) pilih framework dari KEBUTUHAN DEPLOY, bukan dari hype — 80% proyek industri tidak butuh lebih dari sklearn atau PyTorch standar.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: framework = kendaraan, bukan tujuan",
        body: "Tidak ada framework yang 'lebih pintar' — semuanya mengimplementasikan matematika yang sama (SGD, backprop). Yang membedakan: seberapa cepat kamu bisa eksperimen (PyTorch), seberapa cepat training raksasa (JAX), seberapa cepat sampai demo (Keras), seberapa mudah diaudit (sklearn). Pilih berdasarkan bottleneck timmu, bukan benchmark internet.",
      },
      reference: "sklearn = tabel & audit. PyTorch = custom. JAX = skala. Keras = cepat jadi.",
    },
    {
      id: "minicase-fraud",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Tim fraud 2,1 juta transaksi pindah dari numpy ke PyTorch",
      prose: [
        "Tim fraud Bank Nusantara memelihara model skor transaksi yang ditulis manual dengan numpy: 900 baris kode — forward, backward turunan tangan, batching, checkpointing, semuanya buatan sendiri. Setiap perubahan arsitektur butuh dua minggu karena turunannya harus diturunkan ulang di kertas. Dataset: 2,1 juta transaksi, 40 fitur, label fraud 1,8%.",
        "Migrasi ke PyTorch memangkas kode jadi 170 baris: `nn.Linear` menggantikan matmul manual, autograd menggantikan turunan tangan, `DataLoader` menggantikan batching manual. Waktu training 30 epoch: CPU 11 menit/epoch → 5,5 jam total; GPU 40 detik/epoch → 20 menit total. Iterasi eksperimen yang dulu 2 minggu menjadi 2 hari.",
        "Tapi minggu pertama migrasi, tim mengulang persis tragedi Dimas: loss macet di 0,6931 selama tiga malam. Penyebabnya sama — `optimizer.zero_grad()` tidak tertulis. Yang menyelamatkan mereka bukan dokumentasi PyTorch, melainkan kebiasaan baru yang mereka adopsi: print norma gradien tiap 100 batch. Norma yang menumpuk (4,7 → 40,1) langsung menunjuk biang keroknya dalam 10 menit.",
        "Pembahasan: angka migrasi (900 → 170 baris, 5,5 jam → 20 menit) adalah alasan bisnis memakai PyTorch. Tapi angka 0,6931 adalah alasan memahami loop-nya: framework mempercepat yang benar dan mempercepat yang salah dengan sama efisiennya. Checklist debugging langkah 5 + print norma gradien = dua kebiasaan yang memisahkan engineer PyTorch senior dari pemula.",
      ],
      tasks: [],
      reference: "Framework mempercepat kode benar dan kode salah sama cepatnya. Pahami loop-nya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan tentang PyTorch hands-on. Fokus pada lima gerakan loop dan tiga bug klasik.",
      ],
      tasks: [],
      summary: [
        "Tensor = array dengan ingatan (computational graph); autograd menghitung turunan otomatis via loss.backward().",
        "nn.Module memisahkan arsitektur (__init__) dari alur data (forward); DataLoader memberi batch yang di-shuffle tiap epoch.",
        "Training loop = lima gerakan berurutan: zero_grad → forward → loss → backward → step.",
        "Gradien PyTorch menumpuk secara default — lupa zero_grad() = bug nomor satu, gejalanya loss macet di ln 2.",
        "Semua tensor dalam satu operasi harus di device yang sama; mixed precision butuh GradScaler agar gradien tidak underflow di FP16.",
        "Pilih framework dari kebutuhan: sklearn untuk tabel & audit, PyTorch untuk custom, JAX untuk skala, Keras untuk prototyping cepat.",
      ],
      next: { label: "DLE2 — Neural Network: Forward & Backprop", href: "/v2/learn/dle2-nn" },
      quiz: [
        {
          q: "Apa fungsi optimizer.zero_grad() dalam training loop?",
          options: [
            { text: "Menghentikan training lebih awal", why: "Itu early stopping — konsep yang sama sekali berbeda." },
            { text: "Menghapus gradien lama agar tidak menumpuk dengan gradien batch baru", why: "Tepat: loss.backward() MENAMBAH ke .grad. Tanpa reset, gradien menumpuk dan update makin kacau — bug Dimas.", correct: true },
            { text: "Mengacak ulang bobot model", why: "Bobot diacak sekali saat inisialisasi, bukan tiap batch." },
            { text: "Memindahkan model ke GPU", why: "Itu tugas .to(device), bukan zero_grad." },
          ],
        },
        {
          q: "Error 'Expected all tensors to be on the same device' artinya?",
          options: [
            { text: "GPU-nya rusak dan harus diganti", why: "Error ini 100% soal penempatan tensor, bukan hardware." },
            { text: "Sebagian tensor di CPU, sebagian di GPU dalam satu operasi", why: "Tepat: mis. model .to('cuda') tapi batch lupa .to(device). Solusinya: samakan device semua tensor.", correct: true },
            { text: "Batch size terlalu besar untuk memori", why: "Itu error out-of-memory, pesannya berbeda." },
            { text: "Learning rate terlalu besar", why: "Learning rate besar menyebabkan loss NaN/divergen, bukan device error." },
          ],
        },
        {
          q: "Kapan memakai torch.no_grad()?",
          options: [
            { text: "Saat inferensi/evaluasi, agar autograd tidak mencatat dan menghemat memori", why: "Tepat: tanpa gradien, inferensi lebih cepat dan hemat memori. Lupa memakainya = memori bocor saat evaluasi.", correct: true },
            { text: "Untuk menonaktifkan dropout saat training", why: "Dropout dikendalikan model.train()/model.eval(), bukan no_grad." },
            { text: "Untuk menghentikan training", why: "Training dihentikan dengan break/early stopping, bukan no_grad." },
            { text: "Agar loss tidak dihitung", why: "Loss tetap dihitung di dalam no_grad — yang dimatikan hanya pencatatan gradien." },
          ],
        },
        {
          q: "Mengapa DataLoader memakai shuffle=True tiap epoch?",
          options: [
            { text: "Agar training lebih cepat", why: "Shuffle tidak mempercepat komputasi — justru sedikit menambah overhead." },
            { text: "Agar model tidak belajar urutan data, melainkan polanya", why: "Tepat: tanpa shuffle, model bisa menghafal 'fraud selalu di akhir file' — bias urutan yang fatal.", correct: true },
            { text: "Agar ukuran batch selalu sama", why: "Batch terakhir bisa lebih kecil (drop_last=False); shuffle tidak menjamin ukuran." },
            { text: "Agar loss selalu turun monoton", why: "Loss mini-batch berfluktuasi secara alami; shuffle tidak menjamin monoton." },
          ],
        },
        {
          q: "Mixed precision memakai autocast + GradScaler karena?",
          options: [
            { text: "Float16 punya rentang kecil sehingga gradien bisa underflow menjadi nol; scaler mengangkat skalanya agar selamat", why: "Tepat: L_scaled = s·L, lalu dibagi s sebelum step — matematika identik, aritmetika aman.", correct: true },
            { text: "Agar akurasi model selalu naik", why: "Mixed precision soal kecepatan/memori, bukan akurasi." },
            { text: "Agar training bisa tanpa GPU", why: "Mixed precision justru fitur GPU modern (Tensor Cores); di CPU tidak relevan." },
            { text: "Agar batch size bisa tak terbatas", why: "Memori memang hemat ~setengah, tapi tetap terbatas." },
          ],
        },
        {
          q: "50 ribu baris data tabular, model harus bisa dijelaskan ke auditor. Pilihan terbaik?",
          options: [
            { text: "PyTorch dengan 12 hidden layer", why: "Overkill untuk tabel kecil dan sulit dijelaskan per-keputusan ke auditor." },
            { text: "sklearn: logistic regression atau gradient boosting", why: "Tepat: training detik, koefisien/feature importance bisa ditunjuk ke auditor. Aturan peta keputusan skenario 1.", correct: true },
            { text: "JAX dengan kompilasi XLA", why: "JAX untuk skala raksasa — 50 ribu baris tidak butuh itu." },
            { text: "Keras di TPU", why: "TPU untuk workload masif; biaya dan kompleksitasnya tidak sebanding di sini." },
          ],
        },
      ],
    },
  ],
};

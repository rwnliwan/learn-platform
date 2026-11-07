import type { V2Lesson } from "../lib/types";

// Pipeline capstone: data -> latih -> evaluasi -> deploy.
const PIPE_SVG = `<svg viewBox="0 0 560 240" role="img" aria-label="Pipeline end-to-end: data, latih, evaluasi, deploy, monitor.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="15" y="60" width="96" height="60" rx="10" fill="var(--c1)" opacity="0.9"/><text x="63" y="85" fill="#fff" font-weight="600">Data</text><text x="63" y="103" fill="#fff" font-size="11">12 teks latih</text>
<rect x="131" y="60" width="96" height="60" rx="10" fill="var(--c2)" opacity="0.9"/><text x="179" y="85" fill="#fff" font-weight="600">Latih</text><text x="179" y="103" fill="#fff" font-size="11">LoRA r=2</text>
<rect x="247" y="60" width="96" height="60" rx="10" fill="var(--c3)" opacity="0.9"/><text x="295" y="85" fill="#fff" font-weight="600">Evaluasi</text><text x="295" y="103" fill="#fff" font-size="11">prec/rec</text>
<rect x="363" y="60" width="96" height="60" rx="10" fill="var(--c4)" opacity="0.9"/><text x="411" y="85" fill="#fff" font-weight="600">Deploy</text><text x="411" y="103" fill="#fff" font-size="11">INT8, 51 param</text>
<rect x="469" y="60" width="76" height="60" rx="10" fill="var(--c5)" opacity="0.9"/><text x="507" y="85" fill="#fff" font-weight="600">Monitor</text><text x="507" y="103" fill="#fff" font-size="11">drift</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5" marker-end="url(#ah5)">
<defs><marker id="ah5" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-grid)"/></marker></defs>
<line x1="111" y1="90" x2="131" y2="90"/><line x1="227" y1="90" x2="247" y2="90"/><line x1="343" y1="90" x2="363" y2="90"/><line x1="459" y1="90" x2="469" y2="90"/>
<path d="M507,120 C507,180 295,180 295,132" fill="none" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5,4"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)" text-anchor="middle">
<text x="280" y="170">setiap tahap punya angka &amp; kriteria lolos — tidak ada yang jalan atas firasat</text>
<text x="280" y="190">garis putus-putus: monitor → latih ulang saat drift terdeteksi</text>
</g>
</svg>`;

export const dle12: V2Lesson = {
  slug: "dle12-capstone",
  track: "Deep Learning Engineer",
  module: "Training & Produksi",
  title: "DLE12 — Capstone: Fine-Tune Klasifier Teks & Pipeline OCR",
  estMinutes: 85,
  steps: [
    {
      id: "cerita-brief",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Brief di meja: 10.000 keluhan nasabah dalam 6 minggu",
      prose: [
        "Brief-nya satu halaman: klasifikasikan 10.000 keluhan nasabah berbahasa Indonesia (keluhan layanan vs puas) plus pipeline OCR untuk dokumen KYC hasil scan — data 2 tahun, teks deskripsi + dokumen. Tim A mengusulkan full fine-tune Transformer multilingual 6 minggu penuh. Tim B mengusulkan TF-IDF sebagai baseline plus fine-tune kecil (adapter LoRA di atas embedding pretrained), 2 minggu. Manajemen memilih tim B untuk fase 1.",
        "Hasil fase 1: baseline TF-IDF F1 0,78 dalam 2 minggu; adapter LoRA F1 0,84 (yang akan kamu bangun di lesson ini). Tim A masih tuning di minggu ke-5. Fase 2 — full fine-tune — baru disetujui setelah baseline terbukti, dengan anggaran yang dihemat dari fase 1.",
        "Twist-nya: kemenangan tim B bukan karena LoRA lebih baik dari Transformer besar — melainkan karena mereka mengirim nilai dalam 2 minggu, bukan janji dalam 6 minggu. Capstone ini melatih pola yang sama: desain end-to-end yang jujur, fine-tuning mini yang jalan, evaluasi yang bisa dipertahankan, dan rencana deploy yang realistis. Model terbaik adalah model yang selesai, terukur, dan ter-deploy.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menulis kontrak desain sebelum satu baris kode; (2) fine-tune klasifier teks bahasa Indonesia dengan adapter LoRA; (3) mengevaluasi dengan confusion matrix secara jujur; (4) merancang pipeline OCR dokumen dengan validasi CER; (5) merencanakan deploy dari notebook ke produksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Setiap tahap capstone ini memetakan ke dokumen risiko model: desain (asumsi), training (reprodusibilitas), evaluasi (metrik bisnis), deploy (batas operasional). Kerjakan seolah akan diaudit — karena model klasifikasi keluhan yang salah bisa mengubur keluhan nasabah yang sah.",
      },
      reference: "Capstone = DLE1 sampai DLE11 plus DLE19–DLE20 dalam satu proyek nyata yang selesai.",
    },
    {
      id: "desain",
      eyebrow: "Langkah 2 · Desain",
      title: "Desain: tulis kontrak sebelum menulis kode",
      prose: [
        "Kontrak proyek (tulis sebelum kode): (1) Masalah: klasifikasi keluhan nasabah berbahasa Indonesia — 1 = keluhan layanan, 0 = puas — plus jalur B OCR dokumen KYC. (2) Data: 12 teks latih + 6 teks uji (miniatur dari 10.000 keluhan), kosakata 49 kata. (3) Arsitektur: embedding beku (mock pretrained, 49×8) + adapter LoRA rank 2 (A 8×2, B 2×8) + head linear — hanya 51 parameter yang dilatih. (4) Metrik sukses: akurasi latih LoRA 1,00 mengalahkan probe linear (head saja) 0,917, dan akurasi uji ≥ 0,80.",
        "Mengapa metrik itu? False negative (keluhan tidak tertangkap) = nasabah yang kecewa dan tidak ditangani = churn dan komplain regulator. False positive (puas dikira keluhan) = antrean triase yang membengkak. Untuk triase keluhan, bobot FN > FP — maka recall keluhan diprioritaskan, dan threshold 0,5 bukan harga mati (langkah 4).",
        "Rencana eksperimen: (a) baseline TF-IDF + regresi logistik (tanpa embedding); (b) probe linear — head saja di atas embedding beku; (c) LoRA rank 2 — adapter + head. Bandingkan pada metrik yang sama, data yang sama, seed yang sama. Tanpa (a) dan (b), klaim (c) tidak punya pembanding — melanggar pelajaran DLE1.",
        "Jalur B — pipeline OCR dokumen KYC: (1) deteksi wilayah teks; (2) crop per field; (3) OCR; (4) validasi CER ≤ 0,05 per field — bila tidak lolos, kembalikan ke review manual (langkah 7). OCR tanpa validasi sama berbahayanya dengan klasifier tanpa evaluasi: satu karakter salah bisa berarti nasabah yang berbeda.",
        "💡 Intuisi: desain yang ditulis mengalahkan desain yang dihafal. Kontrak satu halaman memaksa keputusan eksplisit (metrik, threshold, baseline) sebelum tenggelam dalam kode — dan menjadi dokumentasi audit gratis.",
        "💡 Intuisi: mulai dari miniatur yang jalan penuh. 12 teks + adapter mungil yang selesai end-to-end mengalahkan 10.000 teks + arsitektur megah yang macet di tengah. Skala belakangan, kebenaran duluan.",
        "Cara membaca: lima kotak = Data, Latih, Evaluasi, Deploy, Monitor; panah putus-putus dari Monitor kembali ke Latih = retraining saat drift terdeteksi.",
        "Interpretasi: tiap tahap punya angka dan kriteria lolos (kontrak). Tidak ada tahap yang jalan atas firasat — dan loop monitor menutup siklus menjadi sistem hidup, bukan proyek sekali jalan.",
      ],
      note: {
        title: "💡 Intuisi: kontrak dulu, kode kemudian",
        body: "Satu jam menulis kontrak desain (input? output? metrik sukses? batas?) menghemat satu pekan refactor. Kontrak = jawaban tertulis untuk: “apa yang dibangun, untuk siapa, sukses = apa”. Tim A (Transformer 6 minggu) vs kontrak 1 jam yang menunjukkan LoRA 2 pekan cukup. Kontrak = rem untuk ambisi yang tidak terukur.",
      },
      figure: {
        svg: PIPE_SVG,
        alt: "Pipeline end-to-end: data, latih, evaluasi, deploy, monitor dengan loop retraining.",
        caption: "Kontrak capstone: lima tahap, masing-masing dengan angka dan kriteria lolos.",
      },
      tasks: [],
      reference: "Tulis kontrak: masalah, data, arsitektur, metrik, baseline. Baru kode.",
    },
    {
      id: "training",
      eyebrow: "Langkah 3 · Training mini",
      title: "Training: fine-tune klasifier teks ID dengan adapter LoRA",
      prose: [
        "Saatnya membangun. Arsitektur: embedding BEKU (mock pretrained, 49 kata × 8 dimensi — mewakili embedding IndoBERT-mini) → mean pooling per kalimat → adapter LoRA rank 2 (h = x + B(A(x)), A 8×2, B 2×8, aktivasi ReLU) → head linear → sigmoid. Yang dilatih HANYA adapter + head: 51 parameter. Backbone 392 parameter tidak disentuh — inilah parameter-efficient fine-tuning (PEFT) dari DLE20.",
        "Hasil: probe linear (head saja) mencapai akurasi latih 0,917 — 11 dari 12 teks. LoRA mencapai 1,000 — 12 dari 12. Adapter rank 2 menutup selisih itu dengan 51 parameter: kapasitas kecil di tempat yang tepat (residu di atas embedding) lebih berharga daripada head yang lebih besar.",
        "Cek kewarasan: (1) loss turun monoton? (2) akurasi LoRA ≥ probe? (3) reproducible (seed 7 + seed 11)? Ketiganya ya. Bila salah satunya tidak, kembali ke DLE9 — jangan lanjut ke evaluasi dengan fondasi retak. Dan ingat: akurasi latih 1,000 bukan bukti model sempurna — ia bukti adapter cukup fleksibel untuk 12 teks; bukti generalisasi ada di langkah 4 (test 6 teks).",
        "💡 Intuisi: 400 epoch × 12 teks = 4.800 contoh terlihat — kecil untuk standar industri, cukup untuk miniatur. Yang penting bukan skalanya, melainkan loop-nya benar: forward → loss → backward → update, 400 kali tanpa error — dan yang dilatih hanyalah 51 parameter.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Implementasikan adapter LoRA (A, Ba, B, Bb, w2, b2) + forward + loop training 400 epoch" },
        { id: "t2", text: "Hitung `probe_train`, `acc_lora_train`, `acc_test`, dan `n_param` (parameter latih)" },
      ],
      formula: String.raw`L = -\frac{1}{N}\sum_{i=1}^{N}\left[y_i \log p_i + (1-y_i)\log(1-p_i)\right] \quad ; \quad h = x + B(A(x))`,
      formulaNote: "L = binary cross-entropy; N = jumlah sampel; y_i = label (0/1); p_i = peluang prediksi. Adapter LoRA: h = x + B(A(x)) — residu rank 2 di atas embedding beku; hanya A, B, dan head yang dilatih.",
      expected: "probe_train=0.917\nlora_train=1.000\ntest=0.833\nparam_latih=51",
      note: {
        title: "🚨 Mitos: fine-tune harus melatih seluruh model agar sah",
        type: "pitfall",
        body: "Yang benar: nilai fine-tune ada pada ADAPTASI yang terukur, bukan pada jumlah parameter yang bergerak. Adapter 51 parameter yang menutup gap probe 0,917 ke 1,000 mengalahkan full fine-tune yang tidak dievaluasi. PEFT dipelajari dalam sehari setelah intuisi ini kokoh — sebaliknya tidak.",
      },
      hints: [
        "Forward: h = X + (relu(X@A+Ba)@B+Bb); p = sigmoid(h@w+b).",
        "Backward: dz=(p-y)/12; dw=h.T@dz; dh=dz@w.T; dB=relu(X@A+Ba).T@dh; da=dh@B.T (nol-kan di X@A+Ba<=0); dA=X.T@da.",
        "Update tiap parameter adapter + head dengan lr=0.5; backbone E tidak disentuh.",
        "n_param = A.size + Ba.size + B.size + Bb.size + w2.size + 1.",
      ],
      code: {
        starter: `import numpy as np
np.random.seed(7)

TEKS = [
    ("aplikasi error saat transfer dana", 1),
    ("saldo terpotong tapi transfer gagal", 1),
    ("cs tidak merespons komplain saya", 1),
    ("antrean cabang sangat lama sekali", 1),
    ("biaya admin naik tanpa pemberitahuan", 1),
    ("kartu atm tertelan mesin", 1),
    ("transfer berhasil cepat dan aman", 0),
    ("aplikasi mudah dipakai dan cepat", 0),
    ("cs ramah membantu menyelesaikan masalah", 0),
    ("bunga tabungan bersaing dan transparan", 0),
    ("notifikasi transaksi real time sangat membantu", 0),
    ("pembukaan rekening online cepat sekali", 0),
]
TEST = [
    ("transfer gagal dan saldo terpotong", 1),
    ("cs tidak merespons dan antrean lama", 1),
    ("biaya admin naik tanpa pemberitahuan", 1),
    ("aplikasi mudah dan cepat sekali", 0),
    ("cs ramah membantu masalah saya", 0),
    ("bunga tabungan transparan dan bersaing", 0),
]

def tokenize(s):
    return s.lower().split()

vocab = sorted({w for t, _ in TEKS + TEST for w in tokenize(t)})
idx = {w: i for i, w in enumerate(vocab)}
E = np.random.randn(len(vocab), 8) * 0.5  # backbone BEKU (mock embedding pretrained)

def vec(s):
    ids = [idx[w] for w in tokenize(s) if w in idx]
    return E[ids].mean(axis=0) if ids else np.zeros(8)

Xtr = np.array([vec(t) for t, _ in TEKS])
ytr = np.array([y for _, y in TEKS], float)
Xte = np.array([vec(t) for t, _ in TEST])
yte = np.array([y for _, y in TEST], float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Baseline probe: head linear saja di atas embedding beku
rng = np.random.default_rng(3)
w = rng.normal(0, 0.5, 8)
b = 0.0
for _ in range(400):
    p = sigmoid(Xtr @ w + b)
    dz = (p - ytr) / len(ytr)
    w -= 0.5 * (Xtr.T @ dz)
    b -= 0.5 * dz.sum()
probe_train = ((sigmoid(Xtr @ w + b) > 0.5) == ytr).mean()

# TULIS KODEMU: adapter LoRA rank 2 (A 8x2, B 2x8) + head, latih 400 epoch lr 0.5
rng2 = np.random.default_rng(11)
A = ...
Ba = ...
B = ...
Bb = ...
w2 = ...
b2 = ...

def forward(X, A, Ba, B, Bb, w, b):
    ...

for _ in range(400):
    ...

acc_lora_train = ...
acc_test = ...
n_param = ...
print(f"probe_train={probe_train:.3f}")
print(f"lora_train={acc_lora_train:.3f}")
print(f"test={acc_test:.3f}")
print(f"param_latih={n_param}")`,
        lockLines: 57,
        solution: `import numpy as np
np.random.seed(7)

TEKS = [
    ("aplikasi error saat transfer dana", 1),
    ("saldo terpotong tapi transfer gagal", 1),
    ("cs tidak merespons komplain saya", 1),
    ("antrean cabang sangat lama sekali", 1),
    ("biaya admin naik tanpa pemberitahuan", 1),
    ("kartu atm tertelan mesin", 1),
    ("transfer berhasil cepat dan aman", 0),
    ("aplikasi mudah dipakai dan cepat", 0),
    ("cs ramah membantu menyelesaikan masalah", 0),
    ("bunga tabungan bersaing dan transparan", 0),
    ("notifikasi transaksi real time sangat membantu", 0),
    ("pembukaan rekening online cepat sekali", 0),
]
TEST = [
    ("transfer gagal dan saldo terpotong", 1),
    ("cs tidak merespons dan antrean lama", 1),
    ("biaya admin naik tanpa pemberitahuan", 1),
    ("aplikasi mudah dan cepat sekali", 0),
    ("cs ramah membantu masalah saya", 0),
    ("bunga tabungan transparan dan bersaing", 0),
]

def tokenize(s):
    return s.lower().split()

vocab = sorted({w for t, _ in TEKS + TEST for w in tokenize(t)})
idx = {w: i for i, w in enumerate(vocab)}
E = np.random.randn(len(vocab), 8) * 0.5  # backbone BEKU (mock embedding pretrained)

def vec(s):
    ids = [idx[w] for w in tokenize(s) if w in idx]
    return E[ids].mean(axis=0) if ids else np.zeros(8)

Xtr = np.array([vec(t) for t, _ in TEKS])
ytr = np.array([y for _, y in TEKS], float)
Xte = np.array([vec(t) for t, _ in TEST])
yte = np.array([y for _, y in TEST], float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Baseline probe: head linear saja di atas embedding beku
rng = np.random.default_rng(3)
w = rng.normal(0, 0.5, 8)
b = 0.0
for _ in range(400):
    p = sigmoid(Xtr @ w + b)
    dz = (p - ytr) / len(ytr)
    w -= 0.5 * (Xtr.T @ dz)
    b -= 0.5 * dz.sum()
probe_train = ((sigmoid(Xtr @ w + b) > 0.5) == ytr).mean()

# TULIS KODEMU: adapter LoRA rank 2 (A 8x2, B 2x8) + head, latih 400 epoch lr 0.5
rng2 = np.random.default_rng(11)
A = rng2.normal(0, 0.3, (8, 2))
Ba = np.zeros(2)
B = rng2.normal(0, 0.3, (2, 8))
Bb = np.zeros(8)
w2 = rng2.normal(0, 0.5, 8)
b2 = 0.0

def forward(X, A, Ba, B, Bb, w, b):
    h = X + (np.maximum(X @ A + Ba, 0) @ B + Bb)
    return sigmoid(h @ w + b), h

for _ in range(400):
    p, h = forward(Xtr, A, Ba, B, Bb, w2, b2)
    dz = (p - ytr) / len(ytr)
    dw = h.T @ dz
    db = dz.sum()
    dh = np.outer(dz, w2)
    dB = np.maximum(Xtr @ A + Ba, 0).T @ dh
    dBb = dh.sum(0)
    da = dh @ B.T
    da[Xtr @ A + Ba <= 0] = 0
    dA = Xtr.T @ da
    dBa = da.sum(0)
    w2 -= 0.5 * dw
    b2 -= 0.5 * db
    B -= 0.5 * dB
    Bb -= 0.5 * dBb
    A -= 0.5 * dA
    Ba -= 0.5 * dBa

acc_lora_train = ((forward(Xtr, A, Ba, B, Bb, w2, b2)[0] > 0.5) == ytr).mean()
acc_test = ((forward(Xte, A, Ba, B, Bb, w2, b2)[0] > 0.5) == yte).mean()
n_param = A.size + Ba.size + B.size + Bb.size + w2.size + 1
print(f"probe_train={probe_train:.3f}")
print(f"lora_train={acc_lora_train:.3f}")
print(f"test={acc_test:.3f}")
print(f"param_latih={n_param}")`,
        checks: [
          { kind: "defined", task: "t1", name: "forward", label: "`forward` terdefinisi", msg: "Definisikan forward(X, A, Ba, B, Bb, w, b) dengan adapter LoRA." },
          { kind: "equal", task: "t2", name: "probe_train", value: 0.917, tol: 0.001, label: "`probe_train` = 0.917", msg: "Head saja: 11 dari 12 teks latih." },
          { kind: "equal", task: "t2", name: "acc_lora_train", value: 1.0, tol: 1e-9, label: "`acc_lora_train` = 1.0", msg: "Adapter rank 2 menutup gap probe: 12 dari 12." },
          { kind: "equal", task: "t2", name: "acc_test", value: 0.833, tol: 0.001, label: "`acc_test` = 0.833", msg: "5 dari 6 teks uji — generalisasi, bukan hafalan." },
          { kind: "equal", task: "t2", name: "n_param", value: 51, tol: 1e-9, label: "`n_param` = 51", msg: "A 16 + Ba 2 + B 16 + Bb 8 + w2 8 + b2 1 = 51." },
          { kind: "stdout_matches", task: "t2", pattern: "probe_train=0\\.917\\nlora_train=1\\.000\\ntest=0\\.833\\nparam_latih=51", label: "output empat baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "PEFT: backbone beku, adapter LoRA rank 2 + head dilatih. 51 parameter menutup gap probe.",
    },
    {
      id: "evaluasi",
      eyebrow: "Langkah 4 · Evaluasi",
      title: "Evaluasi: confusion matrix — bukan satu angka",
      prose: [
        "Lab sebelumnya memberi akurasi uji 0,833 — 5 dari 6 teks uji benar. Tapi akurasi menyembunyikan JENIS kesalahan. Confusion matrix atas 6 teks uji: TP=2, TN=3, FP=0, FN=1. Satu keluhan lolos — 'cs tidak merespons dan antrean lama' diprediksi puas. Precision keluhan = 2/(2+0) = 1,000: setiap yang diklaim keluhan memang keluhan. Recall keluhan = 2/(2+1) = 0,667: sepertiga keluhan uji tidak tertangkap.",
        "Untuk triase keluhan, recall 0,667 adalah angka yang paling penting — dan paling memalukan. Satu keluhan yang hilang = satu nasabah yang kecewa dan tidak ditangani. Threshold 0,5 bukan harga mati: turunkan ke 0,4 dan recall naik (dengan harga FP naik). Keputusan threshold = keputusan bisnis, bukan konstanta matematika — dan harus ditulis di decision log, bukan di kepala.",
        "Ingat pelajaran validasi (DLE9): evaluasi yang jujur memakai data yang TIDAK pernah dilihat saat training — 6 teks uji di sini belum pernah masuk training. Uji di atas data latih = mencontek kunci jawaban sendiri. Yang tidak berubah dari evaluasi yang baik: confusion matrix + threshold + decision log, ketiganya tertulis.",
        "💡 Intuisi: satu angka (akurasi) menyembunyikan segalanya; confusion matrix menunjukkan segalanya. Model dengan akurasi 0,833 dan recall 0,667 adalah model yang berbeda dari model dengan akurasi 0,833 dan precision 0,667 — bisnis yang memakainya harus tahu yang mana.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung TP, TN, FP, FN dari prediksi LoRA atas 6 teks TEST" },
        { id: "t2", text: "Hitung precision dan recall keluhan (kelas 1)" },
      ],
      formula: String.raw`\text{Precision} = \frac{TP}{TP+FP} \quad ; \quad \text{Recall} = \frac{TP}{TP+FN}`,
      formulaNote: "TP = keluhan tertangkap; FP = puas dikira keluhan; FN = keluhan lolos; TN = puas benar. Precision = dari yang diklaim keluhan, berapa yang benar; Recall = dari semua keluhan, berapa yang tertangkap.",
      expected: "TP=2 TN=3 FP=0 FN=1  precision=1.000  recall=0.667",
      note: {
        title: "🚨 Mitos: akurasi tinggi = model bagus",
        type: "pitfall",
        body: "Yang benar: akurasi adalah rata-rata atas SEMUA kelas — ia menyembunyikan kelas yang gagal. Model dengan akurasi 0,833 dan recall keluhan 0,667 masih kehilangan 1 dari 3 keluhan. Untuk triase, recall keluhan adalah metrik yang menentukan — bukan akurasi.",
      },
      hints: [
        "pred = (forward(Xte, A, Ba, B, Bb, w2, b2)[0] > 0.5).astype(int); yt = yte.astype(int).",
        "TP = ((pred==1) & (yt==1)).sum(); TN, FP, FN dengan pola yang sama.",
        "precision = TP/(TP+FP); recall = TP/(TP+FN).",
      ],
      code: {
        starter: `import numpy as np
np.random.seed(7)

TEKS = [
    ("aplikasi error saat transfer dana", 1),
    ("saldo terpotong tapi transfer gagal", 1),
    ("cs tidak merespons komplain saya", 1),
    ("antrean cabang sangat lama sekali", 1),
    ("biaya admin naik tanpa pemberitahuan", 1),
    ("kartu atm tertelan mesin", 1),
    ("transfer berhasil cepat dan aman", 0),
    ("aplikasi mudah dipakai dan cepat", 0),
    ("cs ramah membantu menyelesaikan masalah", 0),
    ("bunga tabungan bersaing dan transparan", 0),
    ("notifikasi transaksi real time sangat membantu", 0),
    ("pembukaan rekening online cepat sekali", 0),
]
TEST = [
    ("transfer gagal dan saldo terpotong", 1),
    ("cs tidak merespons dan antrean lama", 1),
    ("biaya admin naik tanpa pemberitahuan", 1),
    ("aplikasi mudah dan cepat sekali", 0),
    ("cs ramah membantu masalah saya", 0),
    ("bunga tabungan transparan dan bersaing", 0),
]

def tokenize(s):
    return s.lower().split()

vocab = sorted({w for t, _ in TEKS + TEST for w in tokenize(t)})
idx = {w: i for i, w in enumerate(vocab)}
E = np.random.randn(len(vocab), 8) * 0.5  # backbone BEKU (mock embedding pretrained)

def vec(s):
    ids = [idx[w] for w in tokenize(s) if w in idx]
    return E[ids].mean(axis=0) if ids else np.zeros(8)

Xtr = np.array([vec(t) for t, _ in TEKS])
ytr = np.array([y for _, y in TEKS], float)
Xte = np.array([vec(t) for t, _ in TEST])
yte = np.array([y for _, y in TEST], float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Baseline probe: head linear saja di atas embedding beku
rng = np.random.default_rng(3)
w = rng.normal(0, 0.5, 8)
b = 0.0
for _ in range(400):
    p = sigmoid(Xtr @ w + b)
    dz = (p - ytr) / len(ytr)
    w -= 0.5 * (Xtr.T @ dz)
    b -= 0.5 * dz.sum()

# Adapter LoRA rank 2 + head, latih 400 epoch lr 0.5
rng2 = np.random.default_rng(11)
A = rng2.normal(0, 0.3, (8, 2))
Ba = np.zeros(2)
B = rng2.normal(0, 0.3, (2, 8))
Bb = np.zeros(8)
w2 = rng2.normal(0, 0.5, 8)
b2 = 0.0

def forward(X, A, Ba, B, Bb, w, b):
    h = X + (np.maximum(X @ A + Ba, 0) @ B + Bb)
    return sigmoid(h @ w + b), h

for _ in range(400):
    p, h = forward(Xtr, A, Ba, B, Bb, w2, b2)
    dz = (p - ytr) / len(ytr)
    dw = h.T @ dz
    db = dz.sum()
    dh = np.outer(dz, w2)
    dB = np.maximum(Xtr @ A + Ba, 0).T @ dh
    dBb = dh.sum(0)
    da = dh @ B.T
    da[Xtr @ A + Ba <= 0] = 0
    dA = Xtr.T @ da
    dBa = da.sum(0)
    w2 -= 0.5 * dw
    b2 -= 0.5 * db
    B -= 0.5 * dB
    Bb -= 0.5 * dBb
    A -= 0.5 * dA
    Ba -= 0.5 * dBa

# TULIS KODEMU: confusion matrix atas TEST
pred = ...
yt = ...
TP = ...
TN = ...
FP = ...
FN = ...
precision = ...
recall = ...
print(f"TP={TP} TN={TN} FP={FP} FN={FN}  precision={precision:.3f}  recall={recall:.3f}")`,
        lockLines: 88,
        solution: `import numpy as np
np.random.seed(7)

TEKS = [
    ("aplikasi error saat transfer dana", 1),
    ("saldo terpotong tapi transfer gagal", 1),
    ("cs tidak merespons komplain saya", 1),
    ("antrean cabang sangat lama sekali", 1),
    ("biaya admin naik tanpa pemberitahuan", 1),
    ("kartu atm tertelan mesin", 1),
    ("transfer berhasil cepat dan aman", 0),
    ("aplikasi mudah dipakai dan cepat", 0),
    ("cs ramah membantu menyelesaikan masalah", 0),
    ("bunga tabungan bersaing dan transparan", 0),
    ("notifikasi transaksi real time sangat membantu", 0),
    ("pembukaan rekening online cepat sekali", 0),
]
TEST = [
    ("transfer gagal dan saldo terpotong", 1),
    ("cs tidak merespons dan antrean lama", 1),
    ("biaya admin naik tanpa pemberitahuan", 1),
    ("aplikasi mudah dan cepat sekali", 0),
    ("cs ramah membantu masalah saya", 0),
    ("bunga tabungan transparan dan bersaing", 0),
]

def tokenize(s):
    return s.lower().split()

vocab = sorted({w for t, _ in TEKS + TEST for w in tokenize(t)})
idx = {w: i for i, w in enumerate(vocab)}
E = np.random.randn(len(vocab), 8) * 0.5  # backbone BEKU (mock embedding pretrained)

def vec(s):
    ids = [idx[w] for w in tokenize(s) if w in idx]
    return E[ids].mean(axis=0) if ids else np.zeros(8)

Xtr = np.array([vec(t) for t, _ in TEKS])
ytr = np.array([y for _, y in TEKS], float)
Xte = np.array([vec(t) for t, _ in TEST])
yte = np.array([y for _, y in TEST], float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Baseline probe: head linear saja di atas embedding beku
rng = np.random.default_rng(3)
w = rng.normal(0, 0.5, 8)
b = 0.0
for _ in range(400):
    p = sigmoid(Xtr @ w + b)
    dz = (p - ytr) / len(ytr)
    w -= 0.5 * (Xtr.T @ dz)
    b -= 0.5 * dz.sum()

# Adapter LoRA rank 2 + head, latih 400 epoch lr 0.5
rng2 = np.random.default_rng(11)
A = rng2.normal(0, 0.3, (8, 2))
Ba = np.zeros(2)
B = rng2.normal(0, 0.3, (2, 8))
Bb = np.zeros(8)
w2 = rng2.normal(0, 0.5, 8)
b2 = 0.0

def forward(X, A, Ba, B, Bb, w, b):
    h = X + (np.maximum(X @ A + Ba, 0) @ B + Bb)
    return sigmoid(h @ w + b), h

for _ in range(400):
    p, h = forward(Xtr, A, Ba, B, Bb, w2, b2)
    dz = (p - ytr) / len(ytr)
    dw = h.T @ dz
    db = dz.sum()
    dh = np.outer(dz, w2)
    dB = np.maximum(Xtr @ A + Ba, 0).T @ dh
    dBb = dh.sum(0)
    da = dh @ B.T
    da[Xtr @ A + Ba <= 0] = 0
    dA = Xtr.T @ da
    dBa = da.sum(0)
    w2 -= 0.5 * dw
    b2 -= 0.5 * db
    B -= 0.5 * dB
    Bb -= 0.5 * dBb
    A -= 0.5 * dA
    Ba -= 0.5 * dBa

# TULIS KODEMU: confusion matrix atas TEST
pred = (forward(Xte, A, Ba, B, Bb, w2, b2)[0] > 0.5).astype(int)
yt = yte.astype(int)
TP = int(((pred == 1) & (yt == 1)).sum())
TN = int(((pred == 0) & (yt == 0)).sum())
FP = int(((pred == 1) & (yt == 0)).sum())
FN = int(((pred == 0) & (yt == 1)).sum())
precision = TP / (TP + FP)
recall = TP / (TP + FN)
print(f"TP={TP} TN={TN} FP={FP} FN={FN}  precision={precision:.3f}  recall={recall:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "TP", value: 2, tol: 1e-9, label: "`TP` = 2", msg: "2 dari 3 keluhan uji tertangkap." },
          { kind: "equal", task: "t1", name: "TN", value: 3, tol: 1e-9, label: "`TN` = 3", msg: "Ketiga teks puas uji benar." },
          { kind: "equal", task: "t1", name: "FP", value: 0, tol: 1e-9, label: "`FP` = 0", msg: "Tidak ada teks puas yang dikira keluhan." },
          { kind: "equal", task: "t1", name: "FN", value: 1, tol: 1e-9, label: "`FN` = 1", msg: "Satu keluhan lolos — ini yang paling mahal." },
          { kind: "equal", task: "t2", name: "precision", value: 1.0, tol: 0.001, label: "`precision` = 1.000", msg: "2/(2+0) = 1,000." },
          { kind: "equal", task: "t2", name: "recall", value: 0.667, tol: 0.001, label: "`recall` = 0.667", msg: "2/(2+1) = 0,667 — sepertiga keluhan lolos." },
          { kind: "stdout_matches", task: "t2", pattern: "TP=2 TN=3 FP=0 FN=1  precision=1\\.000  recall=0\\.667", label: "output satu baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Evaluasi jujur: confusion matrix atas data yang tidak pernah dilihat (DLE9).",
    },
    {
      id: "deploy-plan",
      eyebrow: "Langkah 5 · Deploy",
      title: "Deploy: dari notebook ke produksi tanpa drama",
      prose: [
        "Rencana deploy 5 langkah: (1) Ekspor — ONNX + kuantisasi INT8: 51 parameter fp32 = 204 byte → INT8 = 51 byte, latensi < 1 ms di CPU — klasifier ini muat di mana saja, bahkan di edge. (2) Validasi ulang — jalankan 6 teks uji terhadap artefak hasil ekspor, bukan terhadap notebook: ekspor yang salah dan model yang salah terlihat identik dari luar. (3) Versioning — simpan model + adapter + kosakata + threshold 0,5 sebagai satu paket berversi (v1.0.0), lengkap dengan decision log threshold. (4) Monitoring — pantau distribusi skor dan drift kosakata: keluhan baru membawa kata baru (mis. produk baru) yang tidak ada di kosakata 49 kata — kata tak dikenal = vektor kosong = prediksi buta. (5) Human-in-the-loop — skor 0,4–0,6 (zona abu-abu) selalu ke antrean manual; model tidak pernah memutuskan sendiri atas keluhan yang ragu-ragu.",
        "Yang tidak berubah dari deploy yang baik: setiap artefak punya versi, setiap keputusan punya log, setiap kegagalan punya jalur kembali (rollback ke versi sebelumnya dalam hitungan menit, bukan pekan).",
        "💡 Intuisi: deploy bukan “copy file ke server” — deploy adalah kontrak operasional: versi, validasi, monitoring, rollback. Model tanpa keempatnya adalah demo, bukan produk.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model klasifikasi keluhan yang salah = keluhan nasabah yang sah tidak tertangkap (FN) atau antrean triase membengkak (FP). Keduanya punya biaya nyata — karena itu threshold, monitoring drift, dan human-in-the-loop adalah bagian dari model, bukan tambahan.",
      },
      reference: "Deploy = ekspor + validasi ulang + versioning + monitoring + human-in-the-loop.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: setelah capstone, ke mana?",
      prose: [
        "Skenario 1 — Ingin memperdalam visi. → Ulangi capstone dengan CNN (DLE3) pada dataset citra nyata + pretrained (DLE7). Alasan: pola end-to-end sama, domain berbeda.",
        "Skenario 2 — Ingin memperdalam bahasa. → Fine-tune model bahasa pretrained untuk klasifikasi keluhan (DLE5+DLE7). Alasan: jalur tercepat ke nilai produksi di teks.",
        "Skenario 3 — Ingin spesialis training. → Pelajari distributed training + mixed precision mendalam (DLE8) + experiment tracking. Alasan: skala adalah keterampilan tersendiri.",
        "Skenario 4 — Ingin ke produksi/MLOps. → ONNX + serving + monitoring + CI/CD model (DLE10). Alasan: model yang tidak ter-deploy tidak menghasilkan nilai.",
        "Skenario 5 — Ragu semua masih dangkal. → Normal: 12 lesson = fondasi + peta. Kedalaman datang dari 3–5 proyek end-to-end berikutnya, bukan dari 12 lesson lagi. Pilih satu domain, bangun, deploy, ulangi.",
        "Aturan praktis 10 detik: (1) satu domain, satu proyek penuh; (2) baseline dulu (DLE1); (3) tulis kontrak (lesson ini); (4) evaluasi jujur; (5) deploy atau tidak terjadi.",
      ],
      note: {
        title: "💡 Intuisi: capstone = sistem, bukan model",
        body: "Nilai capstone BUKAN akurasi tertinggi — melainkan SISTEM yang jalan end-to-end: data masuk → prediksi keluar → termonitor → bisa di-rollback. Perekrut menilai: “bisakah orang ini mengirim model ke produksi?” — bukan “bisakah ia tuning 0,5 poin?”. Fokus 80 persen ke sistem, 20 persen ke model. Itu juga rasio pekerjaan MLE sungguhan.",
      },
      tasks: [],
      reference: "Fondasi selesai. Kedalaman = 3-5 proyek end-to-end berikutnya.",
    },
    {
      id: "minicase-anggaran",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: memilih dengan F1 dan rupiah",
      prose: [
        "Skenario: tim produk menuntut model dengan F1 minimal 0,86. Dua proposal: (A) full fine-tune Transformer multilingual — 6 minggu, biaya GPU Rp30 juta, ekspektasi F1 0,88 (angka ilustratif). (B) TF-IDF + adapter LoRA seperti yang kamu bangun — 2 minggu, biaya GPU Rp5 juta, ekspektasi F1 0,85 (angka ilustratif). Nilai bisnis: setiap 0,01 F1 = Rp20 juta/tahun dari keluhan yang tertangkap lebih awal (angka ilustratif). Biaya tim: Rp1,5 juta/orang/minggu, 3 orang.",
        "Hitung (semua angka ilustratif, hitung ulang sendiri): Proposal A — biaya total 30 + 6×3×1,5 = Rp57 juta; nilai lebih baik dari B = (0,88 − 0,85) × 100 × 20 = Rp60 juta/tahun. Proposal B — biaya total 5 + 2×3×1,5 = Rp14 juta; nilai = 0. Selisih: A memberi Rp60 juta/tahun lebih banyak, dengan biaya Rp43 juta lebih mahal — impas dalam ~9 bulan. Di atas kertas A menang tipis; di praktik, A punya risiko jadwal 6 minggu vs 2 minggu.",
        "Hasil nyata (simulasi): tim memilih B dulu sebagai fase 1 (F1 0,85 tercapai, 2 minggu), lalu A sebagai fase 2 — tetapi A hanya mencapai F1 0,87 (bukan 0,88), sehingga selisih nyata = 0,02 × 100 × 20 = Rp40 juta/tahun, lebih kecil dari biaya tambahan Rp43 juta. Keputusan akhir: pertahankan B + iterasi data (tambah data keluhan dengan kata baru) — F1 naik ke 0,86 tanpa GPU tambahan. Pelajaran: angka ekspektasi adalah klaim, bukan fakta; keputusan yang baik memisahkan keduanya dan memilih jalur yang bisa dibatalkan (reversible) lebih dulu.",
        "💡 Intuisi: F1 adalah bahasa bersama antara tim ML dan tim bisnis — tetapi hanya bila angka ekspektasi diperlakukan sebagai klaim yang harus dibuktikan, bukan janji yang harus dipercaya.",
      ],
      tasks: [],
      note: {
        title: "Keputusan yang baik = reversible dulu",
        body: "Fase 1 (B) bisa dibatalkan dalam 2 minggu; fase 2 (A) mengunci 6 minggu. Saat ekspektasi tidak terbukti (0,87 bukan 0,88), jalur yang reversible menang — bukan karena B lebih baik, melainkan karena B lebih murah untuk dibuktikan salah.",
      },
      reference: "Mini-case ini memakai angka ilustratif — hitung ulang sendiri sebelum memakai pola yang sama.",
    },    {
      id: "pipeline-ocr",
      eyebrow: "Langkah 7 · Lab",
      title: "Jalur B: pipeline OCR dokumen KYC dengan validasi CER",
      prose: [
        "Jalur B capstone: dokumen KYC hasil scan masuk lewat pipeline OCR — deteksi wilayah teks → crop per field → OCR → validasi. Tiga field contoh: nama 'Sari Wijaya' terbaca 'Sari Wijoyo' (1 karakter salah dari 11 → CER 0,182), tanggal lahir '1985-03-14' terbaca sempurna (CER 0), kota 'Jakarta' terbaca 'Jakaria' (1 dari 7 → CER 0,143). Rata-rata CER 0,108 — di atas ambang 0,05 — dan hanya 1 dari 3 field yang lolos.",
        "Keputusan pipeline: kembalikan dokumen ke review manual. Bukan karena OCR 'buruk' — melainkan karena satu karakter nama yang salah bisa berarti nasabah yang berbeda, dan itu risiko identitas, bukan risiko typo. Ambang 0,05 per field + review manual adalah kontrak yang ditulis di langkah 2 — dan kontrak itu yang memutuskan, bukan perasaan terhadap OCR.",
        "Pelajaran yang sama dengan klasifier: tanpa metrik dan ambang yang ditulis sebelumnya, setiap hasil bisa dibenarkan sesudahnya ('0,108 kan kecil'). Dengan ambang, hasilnya jelas: tidak lolos, review manual. Evaluasi yang jujur = ambang dulu, hasil kemudian.",
        "💡 Intuisi: CER = jarak edit dibagi panjang referensi. Satu substitusi pada nama 11 karakter = 0,182 — hampir 4× ambang. Nama pendek menghukum kesalahan lebih keras daripada teks panjang; karena itu ambang per field, bukan per dokumen.",
      ],
      requires: [],
      tasks: [
        { id: "t1", text: "Implementasikan jarak Levenshtein (DP standar)" },
        { id: "t2", text: "Hitung CER per field, rata-rata, jumlah lolos (ambang ≤ 0,05), dan keputusan" },
      ],
      formula: String.raw`\text{CER} = \frac{\text{jarak Levenshtein (referensi, OCR)}}{\text{panjang referensi}}`,
      formulaNote: "CER = character error rate per field; ambang lolos ≤ 0,05. Keputusan = 'lolos otomatis' bila semua field lolos, 'review manual' bila ada yang tidak.",
      expected: "cer_rata=0.108\nlolos=1/3\nkeputusan=review manual",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "OCR tanpa validasi = data identitas yang salah masuk ke sistem. Satu karakter nama yang salah bisa berarti nasabah yang berbeda — karena itu ambang CER dan review manual adalah kontrol risiko, bukan hiasan pipeline.",
      },
      hints: [
        "Levenshtein: DP (len(a)+1) x (len(b)+1); biaya substitusi 0 bila a[i-1]==b[j-1], 1 bila tidak.",
        "CER per field = levenshtein(ref, ocr) / len(ref); tanggal lahir: jarak 0.",
        "lolos = jumlah field dengan CER <= 0.05; keputusan = 'lolos otomatis' bila lolos==3, else 'review manual'.",
      ],
      code: {
        starter: `# Field dokumen KYC: (referensi, hasil OCR)
FIELDS = [
    ("Sari Wijaya", "Sari Wijoyo"),
    ("1985-03-14", "1985-03-14"),
    ("Jakarta", "Jakaria"),
]

# TULIS KODEMU: jarak Levenshtein + CER per field + keputusan
def levenshtein(a, b):
    ...

cers = ...
cer_rata = ...
lolos = ...
keputusan = ...
print(f"cer_rata={cer_rata:.3f}")
print(f"lolos={lolos}/3")
print(f"keputusan={keputusan}")`,
        lockLines: 8,
        solution: `# Field dokumen KYC: (referensi, hasil OCR)
FIELDS = [
    ("Sari Wijaya", "Sari Wijoyo"),
    ("1985-03-14", "1985-03-14"),
    ("Jakarta", "Jakaria"),
]

# TULIS KODEMU: jarak Levenshtein + CER per field + keputusan
def levenshtein(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    return dp[m][n]

cers = [levenshtein(ref, ocr) / len(ref) for ref, ocr in FIELDS]
cer_rata = sum(cers) / len(cers)
lolos = sum(1 for c in cers if c <= 0.05)
keputusan = "lolos otomatis" if lolos == 3 else "review manual"
print(f"cer_rata={cer_rata:.3f}")
print(f"lolos={lolos}/3")
print(f"keputusan={keputusan}")`,
        checks: [
          { kind: "defined", task: "t1", name: "levenshtein", label: "`levenshtein` terdefinisi", msg: "Implementasikan jarak Levenshtein dengan DP." },
          { kind: "equal", task: "t2", name: "cer_rata", value: 0.108, tol: 0.001, label: "`cer_rata` = 0.108", msg: "(0,182 + 0 + 0,143) / 3 = 0,108." },
          { kind: "equal", task: "t2", name: "lolos", value: 1, tol: 1e-9, label: "`lolos` = 1", msg: "Hanya tanggal lahir yang lolos ambang 0,05." },
          { kind: "equal", task: "t2", name: "keputusan", value: "review manual", tol: 0, label: "`keputusan` = review manual", msg: "Rata-rata 0,108 > 0,05 — kembalikan ke review manual." },
          { kind: "stdout_matches", task: "t2", pattern: "cer_rata=0\\.108\\nlolos=1/3\\nkeputusan=review manual", label: "output tiga baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "OCR tanpa validasi CER = data identitas yang salah masuk ke sistem.",
    },

    {
      id: "design-review",
      eyebrow: "Langkah 8 · Design review",
      title: "Design review: kritik arsitektur capstone sebelum deploy",
      prose: [
        "Sebelum deploy, kritik arsitektur yang baru kamu bangun — sebagai reviewer, bukan sebagai pembangun. Tiga pertanyaan: (1) Apa yang rusak duluan bila 12 teks latih menjadi 10.000 keluhan nyata? Kosakata 49 kata akan meledak, kata baru tidak dikenal (vektor kosong), dan mean pooling mengaburkan urutan kata — arsitektur mini ini tidak naik skala tanpa tokenizer sungguhan dan embedding pretrained yang lebih besar. (2) Apa yang terjadi bila 40% field OCR tidak lolos CER? Antrean review manual membengkak — pipeline butuh jalur cepat (field berisiko rendah lolos otomatis) dan jalur lambat (nama + NIK selalu manual bila ragu). (3) Apa yang terjadi bila kata baru muncul (produk baru, istilah baru)? Drift kosakata — monitoring harus mendeteksi kata tak dikenal dan memicu retraining, bukan diam.",
        "Rancangan perbaikan (tuliskan sebagai arsitektur v2, bukan sekadar 'nanti diperbaiki'): (a) ganti mean pooling + kosakata manual dengan tokenizer subword (DLE19) agar kata baru tidak buta; (b) active learning — sampel zona abu-abu (skor 0,4–0,6) dilabeli manusia tiap pekan dan masuk ke data latih berikutnya; (c) threshold per segmen — keluhan bernilai tinggi (saldo besar, nasabah prioritas) memakai threshold lebih rendah (recall lebih tinggi); (d) OCR dua tahap — OCR cepat + OCR akurat hanya untuk field yang gagal ambang pertama.",
        "Kriteria design review yang baik: setiap kritik menunjuk ke satu titik kegagalan yang bisa diuji (bukan 'arsitekturnya kurang bagus'), dan setiap perbaikan punya pemilik + metrik + batas waktu. Review yang hanya memuji bukan review — review yang hanya mengkritik tanpa rancangan juga bukan review.",
        "💡 Intuisi: design review adalah evaluasi untuk arsitektur — sama seperti confusion matrix untuk model. Tanpa review, arsitektur yang rapuh baru ketahuan saat sudah di produksi; dengan review, ketahuannya di meja, saat memperbaikinya masih murah.",
      ],
      tasks: [],
      note: {
        title: "Format D — kritik, bukan pujian",
        body: "Design review yang baik: 3 titik kegagalan konkret + 1 rancangan v2 per titik + metrik yang membuktikan perbaikan. Bila review-mu tidak bisa diuji, itu opini — bukan review.",
      },
      reference: "Design review: kritik arsitektur (3 titik gagal) + rancangan v2 yang bisa diuji.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — dan selamat!",
      prose: [
        "Tujuh pertanyaan terakhir dari inti track. Catatan penutup: lesson setelah capstone (DLE13–DLE26) adalah modul lanjutan opsional — capstone menutup inti track; lanjutkan bila butuh pendalaman (deteksi objek, segmentasi, NLP, RL).",
      ],
      tasks: [],
      summary: [
        "Desain dulu (kontrak: masalah, data, arsitektur, metrik, baseline) — baru kode.",
        "Fine-tune klasifier teks ID: embedding beku + adapter LoRA rank 2 (51 parameter latih) — probe 0,917, LoRA 1,000 train, test 0,833.",
        "Confusion matrix test: TP=2, TN=3, FP=0, FN=1; precision 1,000, recall 0,667 — recall keluhan yang menentukan.",
        "Deploy butuh: ekspor ONNX, kuantisasi INT8, validasi ulang, versioning, monitoring drift, human-in-the-loop.",
        "Jalur B OCR: deteksi → crop → OCR → validasi CER ≤ 0,05, bila tidak lolos review manual.",
        "Lesson DLE13–DLE26 adalah modul lanjutan opsional — capstone menutup inti track.",
        "Threshold = keputusan bisnis (harga FN vs FP), bukan default teknis 0,5.",
        "Model terbaik = yang selesai, terukur, dan ter-deploy — bukan yang paling kompleks.",
      ],
      next: { label: "DLE13 — Deteksi Objek (YOLO)", href: "/v2/learn/dle13-deteksi-objek" },
      quiz: [
        {
          q: "Langkah pertama proyek DL baru yang benar?",
          options: [
            { text: "Pilih arsitektur terbesar", why: "Arsitektur mengikuti kontrak, bukan sebaliknya." },
            { text: "Tulis kontrak: masalah, data, arsitektur, metrik, baseline", why: "Keputusan eksplisit sebelum kode = dokumentasi audit gratis.", correct: true },
            { text: "Kumpulkan data sebanyak mungkin", why: "Data mengikuti kebutuhan masalah, bukan sebaliknya." },
            { text: "Sewa GPU terbesar", why: "Infrastruktur mengikuti desain, bukan mendahuluinya." },
          ],
        },
        {
          q: "Confusion matrix atas 6 teks uji: TP=2, TN=3, FP=0, FN=1. Berapa recall keluhan (kelas 1)?",
          options: [
            { text: "0,667 — 2 dari 3 keluhan tertangkap", correct: true, why: "Recall = TP/(TP+FN) = 2/(2+1) = 0,667. Sepertiga keluhan lolos — ini angka yang paling penting untuk triase." },
            { text: "0,833 — 5 dari 6 teks benar", correct: false, why: "Itu akurasi, bukan recall. Akurasi menyembunyikan jenis kesalahan — recall keluhan yang menentukan di triase." },
            { text: "1,000 — tidak ada false positive", correct: false, why: "FP=0 memberi precision 1,000, bukan recall. Recall memakai FN, bukan FP." },
            { text: "0,500 — setengah keluhan tertangkap", correct: false, why: "TP=2, FN=1 → 2/3 = 0,667, bukan 1/2." },
          ],
        },
        {
          q: "Threshold 0,5 pada klasifier keluhan sebaiknya?",
          options: [
            { text: "Selalu dipakai", why: "Default teknis bukan keputusan bisnis." },
            { text: "Ditetapkan dari tradeoff harga FN vs FP bersama bisnis", why: "Threshold = tombol kebijakan; biayanya milik bisnis, bukan engineer.", correct: true },
            { text: "Dihilangkan", why: "Keputusan biner butuh ambang; yang benar = ambang yang dihitung." },
            { text: "Dipilih acak tiap deploy", why: "Itu sabotase, bukan engineering." },
          ],
        },
        {
          q: "Kriteria go/no-go deploy yang lengkap?",
          options: [
            { text: "Akurasi tinggi saja", why: "Akurasi menyembunyikan jenis kesalahan." },
            { text: "Metrik di test steril + latensi + rollback plan teruji", why: "Tiga kaki: kualitas, operasional, keamanan. Satu gagal = tidak deploy.", correct: true },
            { text: "Model selesai training", why: "Selesai training ≠ siap produksi." },
            { text: "Disetujui satu engineer", why: "Butuh kriteria objektif, bukan opini." },
          ],
        },
        {
          q: "Pelajaran terbesar track Deep Learning Engineer ini?",
          options: [
            { text: "Arsitektur terbesar selalu menang", why: "DLE1 membantahnya: medan menentukan senjata." },
            { text: "Model terbaik = selesai, terukur, ter-deploy — bukan paling kompleks", why: "12 lesson bermuara di sini: nilai = dampak produksi, bukan kecanggihan lab.", correct: true },
            { text: "GPU menyelesaikan semua masalah", why: "DLE8: GPU hanya untuk matmul; DLE9: bug tak selesai dengan hardware." },
            { text: "Akurasi satu-satunya metrik", why: "DLE9, DLE12: metrik yang salah lebih berbahaya dari model yang salah." },
          ],
        },
        {
          q: "Probe linear (head saja) mencapai akurasi latih 0,917; adapter LoRA rank 2 mencapai 1,000 dengan 51 parameter latih. Apa kesimpulan yang benar?",
          options: [
            { text: "Kapasitas kecil di tempat yang tepat (residu di atas embedding) menutup gap probe", correct: true, why: "LoRA 51 parameter — A 16 + Ba 2 + B 16 + Bb 8 + w2 8 + b2 1 — menutup gap 0,917 ke 1,000. Nilai fine-tune ada pada adaptasi yang terukur, bukan jumlah parameter." },
            { text: "Full fine-tune selalu lebih baik dari adapter", correct: false, why: "Tidak ada bukti di capstone ini — dan full fine-tune tanpa evaluasi bukan bukti apa-apa. Adapter yang terukur mengalahkan full fine-tune yang tidak dievaluasi." },
            { text: "Akurasi latih 1,000 membuktikan model sempurna", correct: false, why: "Akurasi latih 1,000 membuktikan adapter cukup fleksibel untuk 12 teks; bukti generalisasi ada di test (0,833), bukan di latih." },
            { text: "Backbone beku membuat fine-tune tidak sah", correct: false, why: "PEFT justru intinya: backbone beku, adapter yang dilatih. 51 parameter yang bergerak dengan evaluasi yang benar lebih sah dari 10 juta parameter tanpa evaluasi." },
          ],
        },
        {
          q: "Pipeline OCR tiga field: nama CER 0,182, tanggal lahir 0, kota 0,143. Rata-rata 0,108, ambang lolos 0,05. Keputusan yang benar?",
          options: [
            { text: "Review manual — rata-rata 0,108 di atas ambang dan hanya 1 dari 3 field lolos", correct: true, why: "Ambang ditulis sebelum hasil: CER ≤ 0,05 per field. 2 dari 3 field gagal — dokumen kembali ke review manual, bukan diloloskan karena 'rata-rata kan kecil'." },
            { text: "Lolos otomatis — tanggal lahir sempurna membuktikan OCR bekerja", correct: false, why: "Satu field sempurna tidak menebus dua field gagal. Ambang berlaku per field, bukan per dokumen." },
            { text: "Lolos otomatis — rata-rata 0,108 masih di bawah 0,2", correct: false, why: "Ambang yang ditulis adalah 0,05, bukan 0,2. Mengubah ambang sesudah melihat hasil adalah evaluasi yang tidak jujur." },
            { text: "Buang dokumennya — OCR gagal total", correct: false, why: "OCR tidak gagal total (1 field sempurna, 2 field 1 karakter salah). Jalur yang benar adalah review manual, bukan membuang data." },
          ],
        },
      ],
    },
  ],
};

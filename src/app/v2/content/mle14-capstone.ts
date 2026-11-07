import type { V2Lesson } from "../lib/types";

export const mle14: V2Lesson = {
  slug: "mle14-capstone",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE14 — Capstone: Sistem ML End-to-End",
  estMinutes: 70,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "13 lesson membangun kepingan puzzle: pipeline, reproducibility, evaluasi, serving, monitoring, testing, versioning, CI/CD, scaling, cost, fairness, LLM. Capstone merakitnya menjadi satu sistem yang hidup.",
        "Tujuan lesson ini:",
        "• Menjalankan pipeline mini end-to-end: data → training → evaluasi → gate → monitoring.",
        "• Menghubungkan setiap tahap dengan lesson yang membahasnya.",
        "• Merancang proyek capstone mandiri dengan checklist deliverables.",
        "• Menyajikan model lewat API FastAPI dan melacak setiap eksperimen (MLflow) sampai ke registry.",
        "• Menyusun roadmap 90 hari menjadi MLE yang siap produksi.",
        "Isi lesson: cerita 'toko' mini-MLOps → lab pipeline end-to-end → brief proyek capstone → peta keputusan karir → mini-case insiden → checkpoint.",
        "Cara memakai capstone ini — tiga jalur. JALUR A (mahasiswa/fresh): ikuti roadmap 90 hari berurutan, bangun SATU sistem penuh. JALUR B (profesional sibuk): pilih SATU komponen yang paling relevan dengan pekerjaanmu (lihat diagram kritikalitas di roadmap), dalami 2 pekan, implementasikan di tempat kerja. JALUR C (tim): bagi komponen per orang, integrasikan di akhir bulan. Tidak ada jalur yang “benar” — ada yang SELESAI. Capstone yang selesai 80% > capstone sempurna yang tidak dimulai.",
        "Prasyarat jujur — cek sebelum mulai. (1) Python menengah (bisa menulis pipeline 200 baris tanpa tutorial). (2) SQL dasar (join + agregasi). (3) Git (branch + merge). (4) Docker (build + run). Jika ada yang belum: 1 pekan per item, SEBELUM capstone. Capstone = integrasi, bukan tempat belajar dasar. Fondasi retak × 13 lesson = menara yang runtuh. Jujur pada dirimu di sini menghemat 2 bulan frustrasi.",
        "Anti-tujuan — yang BUKAN capstone. (1) Tutorial yang diikuti 100% (tanpa keputusan sendiri = tanpa belajar). (2) Kaggle SOTA (capstone = sistem, bukan leaderboard). (3) 13 komponen “sempurna” yang tidak selesai (selesai 80% > sempurna 0%). Capstone yang baik = 1 sistem BERFUNGSI + 10 keputusan TERDOKUMENTASI + 3 kegagalan DICERITAKAN. Kegagalan yang didokumentasikan = pembelajaran; yang disembunyikan = sia-sia.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Toko kelontong dan sistem ML pertamamu",
      prose: [
        "Bayangkan kamu diminta membangun sistem ML untuk toko kelontong: prediksi stok harian. Kedengarannya sepele — sampai kamu daftar apa saja yang dibutuhkan: pipeline data penjualan (MLE2), training yang bisa diulang (MLE3), evaluasi yang jujur (MLE4), serving ke aplikasi kasir (MLE5), monitoring saat pola belanja berubah (MLE6), test agar tidak kacau (MLE7), versioning (MLE8), retrain otomatis (MLE9).",
        "Twist-nya: 'proyek kecil' ini menyentuh SEMUA 13 lesson. Tidak ada sistem ML produksi yang 'hanya butuh model bagus' — selalu butuh sistem di sekelilingnya.",
        "Kabar baik: kamu sekarang punya peta lengkapnya. Lab berikut adalah simulasi satu putaran hidup sistem itu — dari data mentah hingga keputusan deploy dan sinyal monitoring.",
        "Setiap baris output lab terhubung ke satu lesson. Bacalah output-nya sebagai cerita, bukan sekadar angka.",
        "Daftar kebutuhan toko kelontong — yang “sepele” ternyata 13 komponen. Pipeline data penjualan harian (MLE2 — kasir input manual, format berantakan!). Training reproducible (MLE3 — “model minggu lalu kok beda?”). Evaluasi (MLE4 — akurasi vs stockout cost). Serving batch jam 5 pagi (MLE5 — tidak ada yang menunggu real-time). Monitoring drift (MLE6 — promo mengubah pola). Testing (MLE7 — prediksi negatif = bug). Versioning (MLE8 — “model yang mana yang jalan?”). CI/CD (MLE9 — retrain mingguan otomatis). Cost (MLE11 — budget Rp500 ribu/bln). Fairness (MLE12 — semua cabang diperlakukan adil). LLM (MLE13 — chatbot tanya stok). “Sepele” = 13 lesson. Tidak ada sistem ML yang sepele — hanya yang belum dianalisis.",
        "Estimasi realistis — 2–4 minggu itu KETAT. Rinci: pipeline 4 hari, training+eval 3 hari, serving 3 hari, monitoring+testing 4 hari, versioning+CI/CD 3 hari, integrasi + dokumentasi 3 hari = 20 hari kerja = 4 pekan. Itu untuk yang SUDAH menguasai prasyarat. Buffer 25%: 5 pekan. Jika belum pernah Docker: +1 pekan. Sampaikan estimasi ini ke atasan/klien — estimasi yang jujur = kepercayaan; estimasi optimis = lembur + kecewa. Capstone = latihan estimasi juga.",
        "Budget realistis — toko kelontong Rp500 ribu/bln. Rincian: compute batch (laptop/server kecil) Rp200 ribu, storage Rp50 ribu, monitoring (gratis tier) Rp0, backup Rp50 ribu, cadangan Rp200 ribu. Tanpa GPU (tidak butuh!). Tanpa LLM API mahal (aturan + model kecil cukup). Capstone yang butuh Rp5 juta/bln = over-engineering untuk toko kelontong. Kendala budget = KREATIVITAS: ia memaksamu memilih yang tepat, bukan yang keren.",
      ],
      tasks: [
      ],
    },
    {
      id: "pipeline",
      eyebrow: "Langkah 3 · Lab end-to-end",
      title: "Satu putaran hidup sistem ML",
      prose: [
        "Pipeline mini ini mensimulasikan kasus persetujuan kredit mikro (600 aplikasi, fitur usia + gaji):",
        "Tahap 1 — Data (MLE2): generate 600 sampel dengan seed terkunci, split 80/20. Tahap 2 — Training (MLE3): logistic regression dari nol, 500 epoch, seed tetap → reproducible.",
        "Tahap 3 — Evaluasi (MLE4): akurasi 0,783, precision 0,800, recall 0,800 — bukan akurasi semata. Tahap 4 — Quality gate (MLE9): syarat acc ≥ 0,75 dan precision ≥ 0,6 → DEPLOY.",
        "Tahap 5 — Monitoring (MLE6): 400 sampel 'serving' dengan distribusi usia bergeser → PSI 0,213 = 'waspada'. Sistem deploy TETAPI memberi peringatan dini — persis seperti seharusnya: deploy bukan akhir, melainkan awal pengawasan.",
        "Coba ubah: naikkan ambang gate ke 0,85 — apa keputusannya? Turunkan pergeseran serving — apa kata PSI?",
        "Bedah pipeline mini — 600 aplikasi, fitur usia + gaji. Langkah 1: validasi (usia 17–70, gaji >0 — MLE7!). Langkah 2: split TEMPORAL (bukan acak — MLE2 leakage!). Langkah 3: training dengan seed + config tercatat (MLE3). Langkah 4: evaluasi precision/recall + slice (MLE4). Langkah 5: simpan ke registry dengan lineage (MLE8). Lima langkah, lima lesson — dalam 1 lab. Inilah gunanya capstone: melihat kepingan MENJADI sistem. Satu lab ini = 50% nilai seluruh track.",
        "Tantangan ekstensi — setelah lab jalan. (1) Tambah fitur ke-3 (tenor) — ukur dampaknya (apakah +AUC? atau +noise?). (2) Simulasikan drift: ubah distribusi gaji 20% — apakah monitoring menangkap? (3) Tukar 2 kolom — apakah testing menangkap? Tiga ekstensi = tiga lesson (MLE4/MLE6/MLE7) yang “hidup” di capstone-mu. Lab yang tidak diutak-atik = lab yang tidak dipahami. Rusak lab-mu dengan sengaja — lalu perbaiki. Itulah belajar.",
        "Kontrak data — dengan kasir. Input manual = berantakan (typo, format beda). Solusi: (1) form input TERBATASI (dropdown, bukan teks bebas); (2) validasi saat input (bukan saat training!); (3) contoh terisi. “Garbage in, garbage out” = hukum. 80% masalah data ML = masalah di TITIK INPUT, bukan di pipeline. Perbaiki di hulu (formulir) = 10× lebih murah dari memperbaiki di hilir (cleaning).",
        "Testing untuk pipeline mini — 5 test wajib. (1) Schema: kolom + tipe benar. (2) Range: usia/gaji masuk akal. (3) Determinisme: run 2× = sama. (4) Invariant: gaji ↑ → skor tidak turun. (5) Leakage: split temporal, bukan acak. Lima test = 1 jam. Tanpa: “kok hasilnya aneh ya?” 3 hari. Capstone tanpa test = demo; dengan test = SISTEM. Bedakan dari hari pertama.",
      ],
      tasks: [
        { id: "t1", text: "Jalankan training logistic regression (kode terkunci), hitung `acc`, `precision`, `recall`" },
        { id: "t2", text: "Terapkan quality gate → `gate` ('DEPLOY'/'DITAHAN')" },
        { id: "t3", text: "Hitung `psi` distribusi usia train vs serving, cetak laporan 3 baris" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: pipeline yang baik bercerita",
        body: "Setiap tahap menghasilkan artefak + keputusan yang bisa dijelaskan ke orang lain. Jika ada tahap yang 'pokoknya jalan', di situlah insiden masa depan bersembunyi.",
      },
      hints: [
        "Kode training/evaluasi terkunci — fokus pada gate dan PSI.",
        "gate = 'DEPLOY' jika acc >= 0.75 and precision >= 0.6.",
        "PSI: binning 8 bin, jumlahkan (a-e)*ln(a/e).",
      ],
      code: {
        starter: `# === SEED TERKUNCI: blok data + training, jangan ubah ===
import random, math
random.seed(71)
n = 600
X = [(random.gauss(35, 8), random.gauss(8, 3)) for _ in range(n)]
y = [1 if 0.05*u + 0.3*g + random.gauss(0, 0.8) > 4.0 else 0 for u, g in X]
split = int(n*0.8)
Xtr_raw, ytr = X[:split], y[:split]
Xte_raw, yte = X[split:], y[split:]
mu = [sum(c)/len(Xtr_raw) for c in zip(*Xtr_raw)]
sd = [math.sqrt(sum((r[i]-mu[i])**2 for r in Xtr_raw)/len(Xtr_raw)) for i in range(2)]
def std(Xs):
    return [[(r[i]-mu[i])/sd[i] for i in range(2)] for r in Xs]
Xtr, Xte = std(Xtr_raw), std(Xte_raw)
w = [0.0, 0.0]; b = 0.0; lr = 0.5
for _ in range(500):
    gw = [0.0, 0.0]; gb = 0.0
    for (x1, x2), t in zip(Xtr, ytr):
        p = 1/(1+math.exp(-(w[0]*x1+w[1]*x2+b)))
        e = p - t
        gw[0] += e*x1; gw[1] += e*x2; gb += e
    m = len(Xtr)
    w[0] -= lr*gw[0]/m; w[1] -= lr*gw[1]/m; b -= lr*gb/m
def pred(xs):
    return [1 if 1/(1+math.exp(-(w[0]*x1+w[1]*x2+b))) >= 0.5 else 0 for x1, x2 in xs]
yp = pred(Xte)
srv = [random.gauss(38, 8) for _ in range(400)]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: evaluasi
tp = sum(1 for t, p in zip(yte, yp) if t == 1 and p == 1)
fp = sum(1 for t, p in zip(yte, yp) if t == 0 and p == 1)
fn = sum(1 for t, p in zip(yte, yp) if t == 1 and p == 0)
acc = 
precision = 
recall = 

# TULIS KODEMU: quality gate (MLE9)
gate = 

# TULIS KODEMU: monitoring PSI usia (MLE6)
def bins(xs, lo=10, hi=65, nb=8):
    c = [0]*nb
    for x in xs:
        c[min(nb-1, max(0, int((x-lo)/(hi-lo)*nb)))] += 1
    return [v/len(xs) for v in c]
pe = bins([r[0] for r in Xtr_raw])
pa = bins(srv)
psi = 0.0
for a, e in zip(pa, pe):
    if a > 0 and e > 0:
        psi += 

print(f"acc={acc:.3f}  precision={precision:.3f}  recall={recall:.3f}")
print(f"gate={gate}")
print(f"psi_usia={psi:.3f}")`,
        lockLines: 29,
        solution: `# === SEED TERKUNCI: blok data + training, jangan ubah ===
import random, math
random.seed(71)
n = 600
X = [(random.gauss(35, 8), random.gauss(8, 3)) for _ in range(n)]
y = [1 if 0.05*u + 0.3*g + random.gauss(0, 0.8) > 4.0 else 0 for u, g in X]
split = int(n*0.8)
Xtr_raw, ytr = X[:split], y[:split]
Xte_raw, yte = X[split:], y[split:]
mu = [sum(c)/len(Xtr_raw) for c in zip(*Xtr_raw)]
sd = [math.sqrt(sum((r[i]-mu[i])**2 for r in Xtr_raw)/len(Xtr_raw)) for i in range(2)]
def std(Xs):
    return [[(r[i]-mu[i])/sd[i] for i in range(2)] for r in Xs]
Xtr, Xte = std(Xtr_raw), std(Xte_raw)
w = [0.0, 0.0]; b = 0.0; lr = 0.5
for _ in range(500):
    gw = [0.0, 0.0]; gb = 0.0
    for (x1, x2), t in zip(Xtr, ytr):
        p = 1/(1+math.exp(-(w[0]*x1+w[1]*x2+b)))
        e = p - t
        gw[0] += e*x1; gw[1] += e*x2; gb += e
    m = len(Xtr)
    w[0] -= lr*gw[0]/m; w[1] -= lr*gw[1]/m; b -= lr*gb/m
def pred(xs):
    return [1 if 1/(1+math.exp(-(w[0]*x1+w[1]*x2+b))) >= 0.5 else 0 for x1, x2 in xs]
yp = pred(Xte)
srv = [random.gauss(38, 8) for _ in range(400)]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: evaluasi
tp = sum(1 for t, p in zip(yte, yp) if t == 1 and p == 1)
fp = sum(1 for t, p in zip(yte, yp) if t == 0 and p == 1)
fn = sum(1 for t, p in zip(yte, yp) if t == 1 and p == 0)
acc = sum(1 for t, p in zip(yte, yp) if t == p) / len(yte)
precision = tp / (tp + fp)
recall = tp / (tp + fn)

# TULIS KODEMU: quality gate (MLE9)
gate = "DEPLOY" if acc >= 0.75 and precision >= 0.6 else "DITAHAN"

# TULIS KODEMU: monitoring PSI usia (MLE6)
def bins(xs, lo=10, hi=65, nb=8):
    c = [0]*nb
    for x in xs:
        c[min(nb-1, max(0, int((x-lo)/(hi-lo)*nb)))] += 1
    return [v/len(xs) for v in c]
pe = bins([r[0] for r in Xtr_raw])
pa = bins(srv)
psi = 0.0
for a, e in zip(pa, pe):
    if a > 0 and e > 0:
        psi += (a - e) * math.log(a/e)

print(f"acc={acc:.3f}  precision={precision:.3f}  recall={recall:.3f}")
print(f"gate={gate}")
print(f"psi_usia={psi:.3f}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`acc` ≈ 0.783",
            "name": "acc",
            "value": 0.7833333333333333,
            "tol": 0.002,
            "msg": "Evaluasi pada 120 sampel test.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`gate` = DEPLOY",
            "name": "gate",
            "value": "DEPLOY",
            "tol": 1e-09,
            "msg": "0.783 ≥ 0.75 dan 0.800 ≥ 0.6 → lolos gate.",
          },
          {
            "kind": "equal",
            "task": "t3",
            "label": "`psi` ≈ 0.213",
            "name": "psi",
            "value": 0.21328716367120357,
            "tol": 0.01,
            "msg": "Zona waspada — deploy dengan pengawasan.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "Laporan menampilkan gate",
            "pattern": "gate=DEPLOY",
            "msg": "Tiga baris: metrik, gate, psi.",
          },
        ],
      },
      reference: "End-to-end = data → train → eval → gate → monitor. Satu putaran hidup sistem.",
    },
    {
      id: "fastapi-tracking",
      eyebrow: "Langkah 4 · Serving & tracking",
      title: "FastAPI + experiment tracking: model yang bisa dipanggil dan dibuktikan",
      prose: [
        "Lab Langkah 3 membuktikan pipeline-mu jalan. Tetapi pipeline yang hanya jalan di laptop bukan sistem: orang lain harus bisa MEMANGGIL modelmu lewat jaringan, dan kamu harus bisa MEMBUKTIKAN run mana yang menghasilkan model yang sedang live. Dua komponen ini — serving API dan experiment tracking — yang membedakan 'notebook yang dirapikan' dari 'sistem ML'. Keduanya adalah deliverable wajib capstone (lihat Langkah 5).",
        "FastAPI sebagai pintu masuk (MLE5). Endpoint-nya satu: POST /predict, menerima JSON berisi fitur (usia, gaji), mengembalikan skor + versi model + request id. Validasi memakai Pydantic: usia harus int 17 sampai 70, gaji harus angka di atas 0 — request yang melanggar ditolak dengan 422 dan pesan yang jelas, BUKAN diproses diam-diam menjadi skor sampah. Tiga aturan: (1) response SELALU memuat model_version — tanpa itu, tidak ada yang tahu model mana yang menjawab saat insiden; (2) jangan pernah unpickle file model dari sumber luar (MLE5: ONNX atau format aman); (3) log tiap request (versi, latensi, skor) — log inilah bahan monitoring MLE6. FastAPI dipilih karena validasi otomatis + dokumentasi OpenAPI gratis + async — tetapi prinsipnya berlaku untuk framework apa pun: validasi dulu, model belakangan.",
        "Experiment tracking sebagai memori sistem (MLE17). Setiap run training dicatat di MLflow (atau W&B): parameter (learning rate, seed), metrik (akurasi, precision, recall), hash dataset, versi kode, dan artefak model. Registry menambahkan stage: staging vs production — model hanya naik ke production lewat promosi eksplisit, bukan karena 'file terbaru'. Lab berikut mensimulasikan keduanya dalam Python murni: empat run tercatat, run terbaik dipilih dari log (bukan dari ingatan), dan validasi request meniru perilaku FastAPI/Pydantic — 200 untuk request valid, 422 untuk yang melanggar kontrak.",
        "Hasil lab (ilustratif): dari empat run, yang terbaik adalah r4 (lr 0,05, seed 42) dengan akurasi 0,791 — BUKAN r2 yang learning rate-nya sama tetapi seed-nya berbeda (0,783). Tanpa tracking, perbedaan 0,008 ini tidak akan pernah bisa dijelaskan — 'kok model minggu lalu lebih bagus?' menjadi misteri. Dengan tracking, jawabannya satu baris: run r4, seed 42, dataset hash tercatat. Dan validasi: usia 15 ditolak 422 (di bawah 17), gaji negatif ditolak 422 — pagar yang sama yang dipasang FastAPI di produksi.",
        "Aturan capstone: (1) tidak ada model yang di-deploy tanpa run id di MLflow; (2) tidak ada endpoint tanpa validasi input dan tanpa model_version di response; (3) promosi staging ke production dicatat (siapa, kapan, atas dasar metrik apa). Tiga aturan ini murah di capstone — dan mustahil dipasang belakangan di produksi yang sudah berjalan tanpa keduanya.",
      ],
      tasks: [
        { id: "t1", text: "Dari log `runs`, tentukan `best_run` dan `best_acc` (akurasi tertinggi)" },
        { id: "t2", text: "Implementasikan `validate_request(usia, gaji)`: kembalikan 200 bila valid, 422 bila usia di luar 17–70 atau gaji tidak di atas 0" },
        { id: "t3", text: "Cetak run terbaik dan tiga kode status validasi" },
      ],
      expected: "best_run=r4  best_acc=0.791  valid_req=200  bad_age=422  bad_salary=422",
      note: {
        title: "🚨 Mitos: 'tracking = dokumentasi, nanti saja'",
        type: "pitfall",
        body: "Yang benar: tracking adalah SATU-SATUNYA cara membuktikan model yang live berasal dari run yang mana, dengan data apa. Tanpa itu, audit, rollback, dan debat 'model siapa yang lebih bagus' semuanya berbasis ingatan — dan ingatan adalah sumber kebenaran yang paling buruk.",
      },
      hints: [
        "best = max(runs, key=lambda r: r['acc']).",
        "Valid: 17 <= usia <= 70 dan gaji > 0; selain itu 422.",
        "Uji tiga kasus: (25, 8) valid; (15, 8) usia melanggar; (30, -1) gaji melanggar.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
runs = [
    {"run": "r1", "lr": 0.01, "seed": 7, "acc": 0.781},
    {"run": "r2", "lr": 0.05, "seed": 7, "acc": 0.783},
    {"run": "r3", "lr": 0.10, "seed": 7, "acc": 0.772},
    {"run": "r4", "lr": 0.05, "seed": 42, "acc": 0.791},
]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: run terbaik dari log tracking
best_run = 
best_acc = 

# TULIS KODEMU: validasi request gaya FastAPI/Pydantic (200 valid, 422 melanggar)
def validate_request(usia, gaji):
    return 

valid_req = validate_request(25, 8)
bad_age = validate_request(15, 8)
bad_salary = validate_request(30, -1)

print(f"best_run={best_run}  best_acc={best_acc:.3f}  valid_req={valid_req}  bad_age={bad_age}  bad_salary={bad_salary}")`,
        lockLines: 7,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
runs = [
    {"run": "r1", "lr": 0.01, "seed": 7, "acc": 0.781},
    {"run": "r2", "lr": 0.05, "seed": 7, "acc": 0.783},
    {"run": "r3", "lr": 0.10, "seed": 7, "acc": 0.772},
    {"run": "r4", "lr": 0.05, "seed": 42, "acc": 0.791},
]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: run terbaik dari log tracking
best = max(runs, key=lambda r: r["acc"])
best_run = best["run"]
best_acc = best["acc"]

# TULIS KODEMU: validasi request gaya FastAPI/Pydantic (200 valid, 422 melanggar)
def validate_request(usia, gaji):
    return 200 if (17 <= usia <= 70 and gaji > 0) else 422

valid_req = validate_request(25, 8)
bad_age = validate_request(15, 8)
bad_salary = validate_request(30, -1)

print(f"best_run={best_run}  best_acc={best_acc:.3f}  valid_req={valid_req}  bad_age={bad_age}  bad_salary={bad_salary}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`best_run` = r4",
            "name": "best_run",
            "value": "r4",
            "tol": 1e-09,
            "msg": "Akurasi tertinggi 0,791 adalah r4 (lr 0,05, seed 42).",
          },
          {
            "kind": "equal",
            "task": "t1",
            "label": "`best_acc` = 0.791",
            "name": "best_acc",
            "value": 0.791,
            "tol": 1e-09,
            "msg": "Dipilih dari log, bukan dari ingatan.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`bad_age` = 422",
            "name": "bad_age",
            "value": 422,
            "tol": 1e-09,
            "msg": "Usia 15 di bawah batas 17 → ditolak.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`bad_salary` = 422",
            "name": "bad_salary",
            "value": 422,
            "tol": 1e-09,
            "msg": "Gaji negatif → ditolak.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan run terbaik + status",
            "pattern": "best_run=r4\\s+best_acc=0\\.791\\s+valid_req=200",
            "msg": "Format: best_run=...  best_acc=...  valid_req=...  bad_age=...  bad_salary=....",
          },
        ],
      },
      reference: "FastAPI (MLE5): validasi dulu, model belakangan; response selalu bawa model_version. Tracking (MLE17): tiap run tercatat, promosi lewat registry.",
    },
    {
      id: "brief",
      eyebrow: "Langkah 5 · Brief proyek capstone",
      title: "Proyek mandiri: sistem ML produksi mini",
      prose: [
        "Tugas capstone (kerjakan 2–4 minggu): bangun SATU sistem ML end-to-end untuk kasus pilihanmu (skor kredit mikro, prediksi churn, atau screening CV). Deliverables wajib:",
        "1. Pipeline data reproducible: script + seed + validasi data (MLE2, MLE7). 2. Training reproducible: config file + experiment log + dataset berversion (MLE3, MLE8). 3. Evaluasi jujur: bukan cuma akurasi — precision/recall, kalibrasi, slice (MLE4).",
        "4. Serving: pilih pola (batch/online) dengan justifikasi biaya-latency (MLE5, MLE11). 5. Monitoring: dashboard PSI + alarm anti-noise + runbook (MLE6). 6. CI/CD: training pipeline + quality gate + canary plan (MLE9). 7. Fairness check: metrik per grup + mitigasi jika perlu (MLE12).",
        "8. Serving API FastAPI: endpoint POST /predict dengan validasi Pydantic (tolak 422 bila melanggar kontrak) dan model_version di setiap response (MLE5, Langkah 4). 9. Experiment tracking: setiap run tercatat di MLflow — params, metrik, hash dataset, versi kode — dan model yang live bisa dilacak ke run id-nya lewat registry (MLE17, Langkah 4).",
        "Kriteria kelulusan: orang lain bisa menjalankan ulang pipeline-mu dari nol dan mendapat hasil sama (reproducibility); setiap keputusan desain ada justifikasi angka (bukan opini); ada runbook untuk 3 skenario kegagalan.",
        "Ini adalah portofolio yang membedakanmu: 90% kandidat menunjukkan notebook; kamu menunjukkan SISTEM.",
        "Memilih kasus — matriks 3×3. Baris: skor kredit mikro / churn / screening CV. Kolom: data tersedia? / risiko? / relevansi karier? Skor kredit: data (sulit, privacy!) / risiko TINGGI / relevansi TINGGI (fintech). Churn: data (sedang, sintetis OK) / risiko RENDAH / relevansi SEDANG. Screening CV: data (mudah) / risiko TINGGI (fairness!) / relevansi SEDANG. Rekomendasi: CHURN untuk pertama kali (risiko rendah, selesai), KREDIT untuk portofolio karier (risiko tinggi = pembelajaran tinggi). Pilih sesuai TUJUANMU — bukan yang “keren”.",
        "Definisi SELESAI — tulis sebelum mulai. Contoh: (1) pipeline jalan end-to-end tanpa intervensi manual; (2) 5 invariant lolos; (3) monitoring menangkap drift simulasi; (4) rollback berhasil diuji; (5) README 2 halaman (arsitektur + keputusan + trade-off). Lima kriteria, terukur. Tanpa ini: “selesai” = “lelah”. Capstone tanpa definisi selesai = proyek yang tidak pernah selesai — hanya ditinggalkan.",
        "Scope creep — musuh capstone. “Tambah fitur X, sekalian Y, oh Z juga bagus…” → tidak selesai. Aturan: scope DITULIS + DIKUNCI di hari 1; perubahan = lewat “change request” tertulis (apa, kenapa, dampak ke timeline). 90% scope creep = ide bagus di waktu yang salah. Catat di “backlog v2” — bukan dikerjakan sekarang. Capstone selesai = karir dimulai; capstone sempurna yang mangkrak = tidak ada.",
        "Contoh deliverable “cukup baik” — standar kelulusan. (1) Repo GitHub: README (arsitektur + keputusan), pipeline/ (kode), tests/ (5 invariant), Dockerfile, docker-compose.yml. (2) Demo 5 menit: data masuk → prediksi keluar → monitoring menunjukkan drift simulasi tertangkap. (3) Postmortem 1 halaman (1 insiden simulasi). Tidak perlu: UI cantik, 99% akurasi, paper. CUKUP = berfungsi + terdokumentasi + teruji. Standar ini = standar industri untuk MLE junior.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'capstone = model dengan akurasi tertinggi'",
        type: "pitfall",
        body: "Yang benar: capstone dinilai dari sistemnya — reproducibility, testing, monitoring, dan justifikasi keputusan. Model 85% dengan sistem rapi mengalahkan model 92% tanpa sistem.",
      },
    },
    {
      id: "roadmap",
      eyebrow: "Langkah 6 · Roadmap 90 hari",
      title: "Dari sini ke MLE yang siap produksi",
      prose: [
        "Hari 1–30 — Fondasi: kuasai Python packaging, Docker, git advanced, SQL. Bangun 1 pipeline batch end-to-end (data → model → API sederhana). Target: deploy 1 model ke server/VPS.",
        "Hari 31–60 — Operasi: tambah monitoring (PSI + alarm), testing (validasi data + invariant), CI/CD (training otomatis + gate). Target: pipeline berjalan sendiri 2 minggu tanpa disentuh.",
        "Hari 61–90 — Tanggung jawab: fairness audit, cost optimization, dokumentasi + runbook. Target: capstone selesai dan bisa didemokan — termasuk simulasi kegagalan dan rollback.",
        "Prinsip sepanjang jalan: setiap minggu, satu artefak yang bisa ditunjukkan. Bukan tutorial yang ditonton — sistem yang dibangun.",
        "Peta keputusan karir: (1) Suka sistem + data → MLE. (2) Suka modeling murni → Data Scientist/Research. (3) Suka infra tanpa model → Platform/DevOps. Ketiganya valid — pilih yang membuatmu bertahan 10 tahun.",
        "Cara membaca: panjang batang = skor kritikalitas 1–10 (seberapa fatal jika komponen ini hilang); angka di kanan = skornya. Urutkan roadmap-mu mengikuti batang TERPANJANG — bukan urutan lesson.",
        "Interpretasi: testing (10) dan monitoring (9) di atas — keduanya adalah JARING PENGAMAN. Pola umum kegagalan: tim membangun pipeline + training + serving (yang “seru”), menunda testing + monitoring (yang “membosankan”) — lalu insiden Rp187 juta datang dari yang ditunda. Roadmap yang benar: bangun jaring pengaman SEBELUM atraksi. Urutan: testing → monitoring → pipeline → serving → sisanya.",
        "Prioritas 90 hari — ikuti diagram kritikalitas, bukan urutan lesson. Pekan 1–2: testing + invariant (skor 10 — jaring pengaman dulu!). Pekan 3–4: pipeline data + validasi (skor 9). Pekan 5–6: monitoring + alerting (skor 9). Pekan 7–8: training reproducible + evaluasi jujur. Pekan 9–10: serving + versioning. Pekan 11–12: CI/CD + cost + fairness + integrasi. Pola: PENGAMAN dulu (pekan 1–6), KEMAMPUAN kemudian (pekan 7–12). Kebanyakan roadmap terbalik — dan membayarnya saat insiden.",
        "Satu hari dalam hidup MLE — gambaran realistis. 09.00: cek dashboard monitoring (15 menit). 09.30: investigasi 1 alert PSI. 11.00: review PR pipeline. 13.00: eksperimen tuning (mle16!). 15.00: tulis invariant baru. 16.00: update registry + dokumentasi. 17.00: cek canary deploy. Perhatikan: 70% = OPERASI (monitor, investigasi, review), 30% = BANGUN (eksperimen). Ekspektasi “90% modeling” = salah jurusan. MLE = 70% insinyur keandalan, 30% ilmuwan data. Pilih dengan mata terbuka.",
        "Implikasi rumus keandalan: jika monitoring-mu 95 persen (alert sering telat) sementara yang lain 99,9 persen, R_sistem menjadi sekitar 95 persen — monitoring adalah mata terlemah. Perbaiki monitoring DULU sebelum mengoptimasi training dari 99,9 ke 99,95 persen (yang hampir tidak mengubah R_sistem). Setiap kuartal: ukur R tiap komponen, urutkan, perbaiki yang terbawah. Satu ritual, keandalan naik terus.",
        "Minggu 13 — yang tidak ada di roadmap: ISTIRAHAT + REVIEW. Lihat kembali 12 pekan: apa yang dipelajari? apa yang gagal? Tulis 1 halaman refleksi. Lalu: update CV/LinkedIn (proyek capstone = bukti), tulis 1 artikel (mengajar = belajar 2×), presentasikan ke komunitas. Capstone yang tidak diceritakan = setengah nilai. “Selesai” = sistem jalan + didokumentasikan + DICERITAKAN. Tiga bagian, tidak kurang.",
      ],
      formula: String.raw`R_{\text{sistem}} = R_{\text{data}} \times R_{\text{train}} \times R_{\text{serve}} \times R_{\text{monitor}}`,
      formulaNote: "R_sistem = keandalan sistem end-to-end (0-1); R_data/R_train/R_serve/R_monitor = keandalan tiap komponen. Contoh: tiap 99% menjadi R_sistem = 0,99^4 = 96 persen — sistem gagal 4 persen! Untuk sistem 99,9 persen: tiap komponen butuh 99,975 persen. Keandalan sistem < komponen TERLEMAH — investasi keandalan = ke mata terlemah DULU, bukan ke yang paling seru.",
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Skor kritikalitas komponen sistem ML (1–10)">
<text x="240" y="20" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Skor kritikalitas komponen sistem ML (1–10)</text>
<text x="142" y="64" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Testing + invariant</text>
<rect x="150" y="52" width="300" height="22" fill="var(--c1)" rx="4"/>
<text x="458" y="68" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">10</text>
<text x="142" y="108" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Monitoring</text>
<rect x="150" y="96" width="270" height="22" fill="var(--c1)" rx="4"/>
<text x="428" y="112" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">9</text>
<text x="142" y="152" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Data pipeline</text>
<rect x="150" y="140" width="270" height="22" fill="var(--c1)" rx="4"/>
<text x="428" y="156" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">9</text>
<text x="142" y="196" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Evaluasi</text>
<rect x="150" y="184" width="240" height="22" fill="var(--c1)" rx="4"/>
<text x="398" y="200" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">8</text>
<text x="142" y="240" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Serving</text>
<rect x="150" y="228" width="240" height="22" fill="var(--c1)" rx="4"/>
<text x="398" y="244" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">8</text>
<text x="142" y="284" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Reproducibility</text>
<rect x="150" y="272" width="210" height="22" fill="var(--c1)" rx="4"/>
<text x="368" y="288" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">7</text>
</svg>`,
        alt: "Diagram batang: skor kritikalitas tiap komponen — testing dan monitoring tertinggi.",
        caption: "Prioritaskan komponen berskor tinggi dulu: testing (10) dan monitoring (9) melindungi dari bencana.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: portofolio sistem > sertifikat",
        body: "Pewawancara MLE tidak bertanya 'berapa akurasimu?' — mereka bertanya 'ceritakan sistem tersulit yang pernah kamu operasikan'. Capstone-mu adalah jawaban itu.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Membawa pulang: kapan memakai apa",
      prose: [
        "Skenario 1 — 'Modelku bagus di notebook, mau produksi minggu depan' → mulai dari MLE1+MLe5: definisikan kontrak serving + latency budget DULU, baru training ulang yang reproducible.",
        "Skenario 2 — 'Model produksiku performanya turun' → MLE6: cek drift input dulu (PSI), bukan langsung retrain. 70% kasus = masalah data, bukan model.",
        "Skenario 3 — 'Timku 1 orang, 3 model' → MLE2+MLE9: pipeline sederhana yang terjadwal + quality gate. Otomatisasi menggantikan tim yang tidak ada.",
        "Skenario 4 — 'Mau pindah karir ke MLE' → ikuti roadmap 90 hari di Langkah 6 + capstone. Satu sistem rapi > 10 sertifikat.",
        "Aturan praktis 10 detik untuk SEMUA lesson: (1) Apa buktinya (angka)? (2) Apa yang bisa gagal diam-diam? (3) Bagaimana cara kembali (rollback/reproduce)? Tiga pertanyaan ini adalah inti berpikir MLE.",
        "Skenario 2 — “tim 1 orang, mau bangun semua 13 komponen” → JANGAN. Prioritas: testing (10) + monitoring (9) + pipeline (9) = 3 komponen, 6 pekan. Sisanya: versi MINIMAL (serving = script cron, versioning = folder + README, CI/CD = cron + notifikasi). “Semua komponen” untuk tim 1 orang = tidak ada yang selesai. Sempurna = musuh selesai. Minimal yang BERFUNGSI > maksimal yang mangkrak.",
        "Skenario 3 — “perusahaan mau hire MLE pertama” → cari yang bisa OPERASI, bukan yang bisa MODELING. Interview: “ceritakan insiden terburukmu dan bagaimana kamu mencegahnya terulang” > “jelaskan transformer”. MLE pertama = membangun fondasi (pipeline + testing + monitoring), bukan SOTA model. Salah hire (ilmuwan murni) = 6 bulan model bagus yang tidak bisa deploy. Hire untuk KEBUTUHAN (keandalan), bukan untuk PRESTISE (paper).",
        "Skenario 4 — “mau pakai semua yang dipelajari (13 lesson) dalam 1 capstone” → JANGAN SEKALIGUS. Prioritas bertingkat: TINGKAT 1 (wajib): pipeline + testing + monitoring + serving. TINGKAT 2 (penting): versioning + evaluasi + reproducibility. TINGKAT 3 (nice): CI/CD penuh + scaling + LLM + fairness deep-dive. Selesaikan tingkat 1 DULU (2 pekan), baru naik. “Semua sekaligus” = tidak ada yang selesai. Bertingkat = selalu ada yang berfungsi.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'lulus track ini = siap jadi MLE'",
        type: "pitfall",
        body: "Yang benar: track ini memberi peta — kesiapan dibuktikan dengan sistem yang kamu operasikan sendiri (capstone). Tools berganti tiap 2 tahun; yang awet adalah prinsipnya: reproducibility, quality gate, monitoring, rollback.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Insiden 02.14: semua lesson dalam satu malam",
      prose: [
        "Sebuah e-commerce mengalami insiden: rekomendasi voucher kacau jam 02.14. Investigasi menemukan RANTAI kegagalan: (1) ETL partner mengubah format diam-diam → (2) validasi data tidak ada → (3) fitur korup masuk training otomatis → (4) quality gate hanya cek AUC (naik palsu) → (5) auto-deploy 100% langsung → (6) monitoring PSI ada tetapi alarm di-mute (alert fatigue).",
        "Kerugian: 9 jam, Rp2,8 miliar voucher salah sasaran.",
        "Pertanyaan: (a) Sebutkan lesson yang dilanggar di tiap rantai! (b) Satu perubahan mana yang memutus rantai paling awal? (c) Berapa 'harga' setiap pertahanan yang absen?",
        "Pembahasan: (a) MLE2 (validasi/pipeline), MLE7 (test), MLE9 (gate + canary), MLE6 (alarm). (b) Validasi data di ingestion — rantai putus di mata rantai pertama, biaya termurah. (c) Inilah pelajaran pertahanan berlapis: tiap lapisan murah sendiri-sendiri; absennya SEMUA yang mahal. Sistem yang baik tidak mengandalkan satu pahlawan — ia mengandalkan lapisan.",
        "Rantai kegagalan — bedah 5 mata. (1) ETL partner ubah format diam-diam → (2) validasi data TIDAK ADA → (3) fitur korup masuk model → (4) monitoring TIDAK ADA → (5) 12 jam rekomendasi kacau sebelum ada yang sadar. Lima mata, TIGA bisa dicegah murah: (2) schema test 30 menit (MLE7), (4) distribusi output monitor 2 jam (MLE6), + circuit breaker (pause jika output aneh). Total investasi: 1 hari. Biaya insiden: 12 jam × Rp50 juta = Rp600 juta. 1 hari vs Rp600 juta — asuransi termurah di track ini.",
        "Postmortem yang benar — template 5 bagian. (1) Timeline (02.14 apa terjadi — faktual, tanpa menyalahkan). (2) Root cause (5 whys: format berubah → kenapa tidak terdeteksi? → tidak ada schema test → kenapa? → …). (3) Dampak (Rp600 juta + 12 jam). (4) Action items (schema test [pemilik, deadline], monitor output [pemilik, deadline] — TANPA pemilik = tidak dikerjakan). (5) Pelajaran dibagikan (presentasi 15 menit ke seluruh tim). Postmortem tanpa action item = arsip; dengan pemilik + deadline = perbaikan.",
        "Simulasi “bagaimana jika” — tiga skenario alternatif. JIKA ada schema test: insiden berhenti di mata (2) — 0 kerugian. JIKA ada monitoring output: berhenti di mata (4) — 2 jam × Rp50 juta = Rp100 juta (bukan 600). JIKA ada keduanya: Rp0. Tiga skenario = tiga nilai investasi. Presentasikan ke direksi sebagai: “Rp600 juta ATAU 1 hari kerja tim” — keputusan menjadi mudah. Postmortem yang baik = proposal investasi yang disamarkan.",
        "Biaya TIDAK punya postmortem — yang tidak terlihat. Insiden Rp600 juta TANPA postmortem = akan terulang (rata-rata 8 bulan kemudian, biaya serupa). Total 3 tahun: Rp1,8 miliar. DENGAN postmortem (1 hari, Rp1,5 juta): tidak terulang. ROI postmortem: 1.200×. Postmortem = bukan “menyalahkan”, melainkan “membeli masa depan yang lebih murah”. Tim yang tidak postmortem = membayar biaya yang sama berulang-ulang.",
      ],
      tasks: [
      ],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — ujian akhir track",
      prose: [
        "Enam pertanyaan dari seluruh track. Kelulusan: ≥ 5 benar.",
        "Catatan posisi capstone: lesson ini menutup inti track (MLE1–MLE14). Lesson MLE15–MLE28 sesudahnya adalah modul lanjutan opsional — ML klasik, tuning, tracking, systems design, matematika, recommender, vector search, dan LLM — yang memperdalam, bukan syarat kelulusan capstone ini.",
        "Kelulusan sejati — bukan ≥5/6 quiz. (1) Sistem jalan end-to-end. (2) 1 insiden disimulasikan + ditangani. (3) Rollback diuji. (4) Postmortem ditulis. (5) Bisa menjelaskan SETIAP keputusan (“kenapa batch? kenapa threshold ini?”). Lima ini = MLE junior yang siap kerja. Quiz = pengetahuan; lima ini = KOMPETENSI. Kejar kompetensinya.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Model 'bagus' tetapi 3 bulan tidak di-retrain karena SOP manual. Solusi sistemik?",
          options: [
            {
              text: "Ingatkan tim lebih tegas",
              why: "Mengandalkan ingatan manusia = mengulang kegagalan.",
            },
            {
              text: "Training pipeline otomatis + quality gate (CI/CD untuk ML)",
              why: "Tepat (MLE9): detak jantung otomatis, bukan SOP Jumat.",
              correct: true,
            },
            {
              text: "Naikkan akurasi model",
              why: "Akurasi bukan masalahnya; kebasian model yang masalah.",
            },
            {
              text: "Beli GPU lebih banyak",
              why: "Tidak berhubungan dengan proses retraining.",
            },
          ],
        },
        {
          q: "Akurasi validasi 95%, produksi 51%. Diagnosis pertama?",
          options: [
            {
              text: "Data leakage",
              why: "Tepat (MLE2): sidik jari klasik — validasi fantastis, produksi acak.",
              correct: true,
            },
            {
              text: "Learning rate",
              why: "Akan terlihat di validasi juga.",
            },
            {
              text: "Kurang epoch",
              why: "Validasi 95% menunjukkan training cukup.",
            },
            {
              text: "Server lambat",
              why: "Latency tidak mengubah akurasi menjadi 51%.",
            },
          ],
        },
        {
          q: "8 GPU lebih lambat dari 4 GPU. Penjelasan?",
          options: [
            {
              text: "GPU rusak",
              why: "Pola sistematis, bukan kerusakan acak.",
            },
            {
              text: "Overhead komunikasi melewati titik optimal (Hukum Amdahl + overhead)",
              why: "Tepat (MLE10): tambah GPU di atas n* = lebih lambat + lebih mahal.",
              correct: true,
            },
            {
              text: "Data terlalu kecil",
              why: "Mungkin berkontribusi, tetapi penjelasan utamanya overhead.",
            },
            {
              text: "Model terlalu sederhana",
              why: "Tidak menjelaskan pembalikan tren 4→8 GPU.",
            },
          ],
        },
        {
          q: "DI ratio 0,60 pada model hiring. Tindakan?",
          options: [
            {
              text: "Abaikan, akurasi global bagus",
              why: "Akurasi global menyembunyikan ketidakadilan (MLE12).",
            },
            {
              text: "Investigasi + mitigasi (ukur per grup, cek proxy, sesuaikan)",
              why: "Tepat (MLE12): di bawah 0,8 = investigasi wajib.",
              correct: true,
            },
            {
              text: "Hapus data grup minoritas",
              why: "Menyembunyikan masalah, bukan menyelesaikan.",
            },
            {
              text: "Naikkan akurasi global",
              why: "Bisa tetap timpang bahkan jika akurasi naik.",
            },
          ],
        },
        {
          q: "Alarm monitoring berbunyi 50x/hari, semua diabaikan. Perbaikan?",
          options: [
            {
              text: "Tambah alarm lagi",
              why: "Memperparah alert fatigue.",
            },
            {
              text: "Anti-noise: smoothing, deadband, multi-window + runbook per alarm",
              why: "Tepat (MLE6): alarm yang dipercaya > alarm yang banyak.",
              correct: true,
            },
            {
              text: "Matikan monitoring",
              why: "Buta total lebih buruk dari noise.",
            },
            {
              text: "Ganti tim",
              why: "Masalah desain sistem, bukan orangnya.",
            },
          ],
        },
        {
          q: "Satu prinsip yang merangkum seluruh track?",
          options: [
            {
              text: "Akurasi adalah segalanya",
              why: "14 lesson membuktikan sebaliknya.",
            },
            {
              text: "Kejar model terbesar",
              why: "Biaya dan latency adalah batas nyata.",
            },
            {
              text: "Bangun sistem yang jujur, terukur, dan bisa kembali — bukan cuma model yang akurat",
              why: "Tepat: reproducibility, testing berlapis, monitoring, dan angka di setiap keputusan.",
              correct: true,
            },
            {
              text: "Otomatisasi semuanya tanpa gate",
              why: "Otomatisasi tanpa gate = bencana yang cepat (MLE9).",
            },
          ],
        },
        {
          q: "Model live memberi skor aneh untuk usia 15 tahun, dan tidak ada yang tahu run mana yang menghasilkan model itu. Dua pelanggaran capstone apa?",
          options: [
            {
              text: "Endpoint tanpa validasi Pydantic (usia 15 harus ditolak 422) + model tanpa run id di MLflow/registry",
              why: "Tepat: validasi input dan tracking adalah deliverable wajib — tanpanya, insiden tidak bisa dicegah dan tidak bisa dilacak.",
              correct: true,
            },
            {
              text: "Model kurang akurat + dashboard kurang cantik",
              why: "Akurasi bukan penyebab skor aneh untuk input yang seharusnya ditolak; dashboard bukan alat pelacak run.",
            },
            {
              text: "Training terlalu singkat + tidak ada canary",
              why: "Canary penting, tetapi tidak menjawab 'run mana' dan tidak menolak input invalid.",
            },
            {
              text: "Response tidak memuat latensi",
              why: "Latensi berguna, tetapi yang hilang di sini adalah validasi dan ketertelusuran run.",
            },
          ],
        },
      ],
      summary: [
        "Sistem ML = model + pipeline + serving + monitoring + testing + versioning + CI/CD.",
        "Kegagalan termahal selalu silent — pertahanan berlapis adalah jawabannya.",
        "Setiap keputusan butuh angka: cost matrix, latency budget, PSI, gate.",
        "Reproducibility, versioning, dan lineage = kemampuan kembali ke masa lalu.",
        "FastAPI: validasi dulu, model belakangan; response selalu bawa model_version. Tracking: tiap run tercatat, model live bisa dilacak ke run id-nya.",
        "Fairness dan cost bukan tambahan — mereka bagian dari definisi 'sistem yang baik'.",
        "Mulai dari yang termurah: validasi data, seed, config — baru yang mahal.",
      ],
      next: { label: "MLE15 — Algoritma ML Klasik", href: "/v2/learn/mle15-ml-klasik" },
    },
  ],
};

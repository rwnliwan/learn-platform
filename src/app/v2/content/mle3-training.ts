import type { V2Lesson } from "../lib/types";

export const mle3: V2Lesson = {
  slug: "mle3-training",
  track: "Machine Learning Engineer",
  module: "Fondasi Produksi",
  title: "MLE3 — Training yang Reproducible",
  estMinutes: 50,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "'Kode yang sama, data yang sama, hasil yang berbeda' adalah kalimat yang seharusnya tidak pernah terucap di tim ML profesional. Lesson ini membuatnya tidak terucap.",
        "Tujuan lesson ini:",
        "• Menjelaskan 4 sumber non-determinisme dalam training dan cara menguncinya.",
        "• Menerapkan seed management yang benar (bukan sekadar random.seed(42) di satu tempat).",
        "• Merancang config file dan experiment tracking yang membuat setiap run bisa diulang.",
        "• Menghitung config ID dari hash untuk versioning eksperimen.",
        "• Memutuskan tingkat reproducibility yang dibutuhkan per konteks (riset vs regulated).",
        "Isi lesson: cerita run ketiga yang misterius → seed & determinisme + lab → config & experiment tracking + lab → environment → peta keputusan → mini-case audit → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Run ketiga yang tidak bisa dijelaskan siapa pun",
      prose: [
        "Rina, analis di sebuah multifinance, melatih model scoring dua kali dengan kode yang sama persis. Hasilnya identik: AUC 0,812. Ia melapor ke atasannya dengan percaya diri.",
        "Seminggu kemudian, diminta mendemokan ulang, ia menjalankan kode yang sama untuk ketiga kalinya. AUC: 0,797. Tidak ada yang diubah — tidak ada satu baris kode pun. Ruangan hening.",
        "Twist-nya: dua run pertama 'kebetulan' identik karena dijalankan dalam sesi yang sama tanpa restart — state random yang tersisa sama. Run ketiga dimulai dari kernel fresh dengan seed tak terinisialisasi. Modelnya tidak pernah reproducible; ia hanya terlihat reproducible.",
        "Yang lebih dalam: seed hanyalah satu dari empat sumber keacakan. Tiga lainnya — urutan shuffle data, versi library, dan nondeterminisme hardware (GPU) — tetap bisa menggeser hasil walau seed sudah dikunci. Reproducibility adalah sistem, bukan satu baris kode.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'cukup tambah random.seed(42) di awal'",
        type: "pitfall",
        body: "Yang benar: seed harus dikunci di SEMUA sumber keacakan (Python, NumPy, framework DL), shuffle data harus deterministik, dan versi environment tercatat. Satu sumber bocor = hasil tetap bergeser antar run.",
      },
    },
    {
      id: "seed",
      eyebrow: "Langkah 3 · Seed dan determinisme",
      title: "Mengunci keacakan: dari 0,028 menjadi 0,000",
      prose: [
        "Empat sumber non-determinisme dalam training: (1) inisialisasi bobot acak, (2) urutan shuffle data tiap epoch, (3) operasi stokastik (dropout, augmentasi), (4) nondeterminisme hardware — operasi paralel GPU yang urutan penjumlahannya tidak dijamin.",
        "Strategi penguncian: seed terpusat (satu seed mengendalikan semua library), deterministic algorithms di framework (dengan catatan: sedikit lebih lambat), dan pencatatan environment (versi library + hardware).",
        "Lab berikut mensimulasikan training dengan gradient ber-noise. Tanpa seed terkunci, tiga run menghasilkan bobot akhir yang tersebar (rentang 0,028). Dengan seed yang sama, rentang = 0,000000 — identik bit-per-bit.",
        "Cara membaca chart: tinggi batang = rentang (max − min) bobot akhir dari 3 run. Interpretasi: batang kiri menunjukkan variansi yang harus dijelaskan ke regulator; batang kanan menunjukkan reproducibility yang bisa dipertanggungjawabkan.",
        "Biaya determinisme — angka jujur. Deterministic ops di GPU: 10–30% lebih lambat. Untuk training 9 hari: +1–3 hari. Mahal? Bandingkan dengan biaya NON-determinisme: 1 insiden “tidak bisa reproduce” = 3 hari debug × 2 orang × Rp1,5 juta = Rp9 juta + kepercayaan audit hilang. Aturan: deterministic ON untuk model kandidat produksi; OFF untuk eksplorasi awal (kecepatan > reproducibility saat masih mencari arah). Pilih per FASE, bukan per keyakinan.",
        "Seed terpusat — implementasi 5 baris. Satu `SEED = 42` → set ke Python random, NumPy, framework (torch.manual_seed), dan hash untuk split data. Satu seed mengendalikan SEMUA — tidak ada “seed lupa di-set di satu library”. Plus: CATAT seed di config (bukan hardcode tersebar). 5 baris + 1 baris config = reproducibility dimensi keacakan. Yang tersebar = yang terlupakan.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 200" role="img" aria-label="Rentang bobot akhir, 3 run (simulasi)">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Rentang bobot akhir, 3 run (simulasi)</text>
<line x1="46" y1="166.0" x2="466" y2="166.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="170.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<line x1="46" y1="131.0" x2="466" y2="131.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="135.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<line x1="46" y1="96.0" x2="466" y2="96.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="100.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<line x1="46" y1="61.0" x2="466" y2="61.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="65.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<line x1="46" y1="26.0" x2="466" y2="26.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="30.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<rect x="83.8" y="26.0" width="134.4" height="140.0" fill="var(--c4)" rx="3"/>
<text x="151.0" y="20.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0.028</text>
<text x="151.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">tanpa seed</text>
<rect x="293.8" y="166.0" width="134.4" height="0.0" fill="var(--c2)" rx="3"/>
<text x="361.0" y="160.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0</text>
<text x="361.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">seed=42</text>
<line x1="46" y1="166" x2="466" y2="166" stroke="var(--chart-grid)" stroke-width="1"/>
</svg>`,
        alt: "Bar chart: rentang bobot tanpa seed 0,028; dengan seed tetap 0.",
        caption: "Tanpa seed terkunci, tiga run 'kode yang sama' menghasilkan bobot akhir yang berbeda (rentang 0,028). Dengan seed tetap, hasilnya identik. Inilah perbedaan antara 'kebetulan sama' dan 'terjamin sama'.",
      },
      tasks: [
        { id: "t1", text: "Jalankan `train()` dengan 3 seed berbeda, hitung `rentang_bebas` (max − min)" },
        { id: "t2", text: "Jalankan `train(42)` tiga kali, hitung `rentang_kunci`" },
        { id: "t3", text: "Cetak kedua rentang dengan 6 desimal" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: seed adalah kontrak, bukan angka mistis",
        body: "Angka 42 tidak istimewa — yang istimewa adalah seed TERCATAT bersama run-nya. Run tanpa seed tercatat = run yang tidak bisa dipertahankan di depan auditor.",
      },
      hints: [
        "rentang = max(daftar) - min(daftar).",
        "List comprehension: [train(s) for s in (1, 2, 3)].",
        "f-string {x:.6f} menampilkan 6 desimal.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
def train(seed):
    random.seed(seed)
    w = random.gauss(0, 1)          # inisialisasi bobot acak
    for _ in range(50):
        grad = 2 * (w - 3.0) + random.gauss(0, 0.1)  # gradient ber-noise
        w = w - 0.1 * grad
    return w
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: 3 run dengan seed berbeda
bebas = 
rentang_bebas = 

# TULIS KODEMU: 3 run dengan seed yang sama
kunci = 
rentang_kunci = 

print(f"rentang_bebas={rentang_bebas:.6f}  rentang_kunci={rentang_kunci:.6f}")`,
        lockLines: 9,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
def train(seed):
    random.seed(seed)
    w = random.gauss(0, 1)          # inisialisasi bobot acak
    for _ in range(50):
        grad = 2 * (w - 3.0) + random.gauss(0, 0.1)  # gradient ber-noise
        w = w - 0.1 * grad
    return w
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: 3 run dengan seed berbeda
bebas = [train(s) for s in (1, 2, 3)]
rentang_bebas = max(bebas) - min(bebas)

# TULIS KODEMU: 3 run dengan seed yang sama
kunci = [train(42) for _ in range(3)]
rentang_kunci = max(kunci) - min(kunci)

print(f"rentang_bebas={rentang_bebas:.6f}  rentang_kunci={rentang_kunci:.6f}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`rentang_bebas` ≈ 0.028",
            "name": "rentang_bebas",
            "value": 0.028042587472811853,
            "tol": 0.002,
            "msg": "max−min dari train(1), train(2), train(3). Seed berbeda → hasil berbeda.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`rentang_kunci` = 0",
            "name": "rentang_kunci",
            "value": 0.0,
            "tol": 1e-12,
            "msg": "Seed sama → hasil identik bit-per-bit, rentang nol.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan kedua rentang",
            "pattern": "rentang_kunci=0\\.000000",
            "msg": "Format 6 desimal: rentang_bebas=...  rentang_kunci=0.000000.",
          },
        ],
      },
      reference: "random.seed() mengunci semua angka acak sesudahnya. max()/min() untuk rentang.",
    },
    {
      id: "config",
      eyebrow: "Langkah 4 · Config dan experiment tracking",
      title: "Setiap run punya KTP: config + ID unik",
      prose: [
        "Hyperparameter yang tersebar di kode ('lr = 0.01' di baris 47, diubah jadi 0.02 minggu lalu, atau was it 0.03?') adalah cara tercepat kehilangan reproducibility. Solusinya: SEMUA parameter di satu config file (YAML/JSON) — tidak ada angka ajaib di kode.",
        "Setiap run mencatat: config lengkap, hash dataset, seed, versi kode (git commit), metrik, dan artefak (model file). Inilah experiment tracking — MLflow, Weights & Biases, atau bahkan CSV yang disiplin, semuanya lebih baik daripada ingatan.",
        "Config ID dari hash SHA-256 membuat setiap kombinasi parameter punya identitas unik: ubah satu angka, ID berubah. Tidak ada lagi 'run yang kemarin sore itu pakai lr berapa ya?'",
        "Aturan: kode membaca config; manusia tidak mengedit kode untuk mengganti parameter. Jika kamu perlu membuka file .py untuk mengubah learning rate, arsitekturnya salah.",
        "Config yang baik — contoh struktur. {model: {nama: xgb, max_depth: 6}, data: {id: sha256:abc123, query_hash: def456}, train: {seed: 42, lr: 0,01}, env: {docker: img:v3}}. Lima kunci, tidak lebih. Yang sering dilupakan: data.query_hash — query SQL yang BERUBAH tanpa disadari (kolom baru di warehouse). Config tanpa query_hash = “data yang mana?” tidak terjawab. Setiap run = 1 file config; file config = 1 baris di experiment tracker. Sederhana, anti-pelupa.",
      ],
      formula: String.raw`\text{config\_id} = \text{sha256}(\text{canonical\_json(config)})[0:8]`,
      formulaNote: "config_id = 8 karakter pertama SHA256 dari JSON kanonis config — sidik jari unik eksperimen. Dua run dengan config_id SAMA berarti parameter identik; jika hasilnya beda, non-determinisme ada di tempat lain (seed, data, environment). config_id = cara tercepat menjawab “apakah ini eksperimen yang sama?” — tanpa ia, setiap perbandingan = tebak-tebakan.",
      tasks: [
        { id: "t1", text: "Buat `canonical` = JSON config dengan key terurut" },
        { id: "t2", text: "Hitung `config_id` = 8 karakter pertama SHA-256" },
        { id: "t3", text: "Cetak config_id" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'experiment tracking = overkill untuk tim kecil'",
        type: "pitfall",
        body: "Yang benar: tim kecil justru paling butuh — karena satu orang memegang banyak eksperimen di kepala. CSV dengan kolom (run_id, git_commit, config_id, metric) sudah menyelamatkan banyak tim dari 'lupa run mana yang terbaik'.",
      },
      hints: [
        "json.dumps(config, sort_keys=True) untuk canonical form.",
        "hashlib.sha256(teks.encode()).hexdigest() → hex string.",
        "Ambil 8 karakter pertama dengan [:8].",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
import json, hashlib
config = {"model": "logreg", "lr": 0.01, "epochs": 50, "seed": 42, "features": ["usia", "tenor", "gaji"]}

# TULIS KODEMU
canonical = 
config_id = 

print(f"config_id={config_id}")`,
        lockLines: 3,
        solution: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
import json, hashlib
config = {"model": "logreg", "lr": 0.01, "epochs": 50, "seed": 42, "features": ["usia", "tenor", "gaji"]}

# TULIS KODEMU
canonical = json.dumps(config, sort_keys=True)
config_id = hashlib.sha256(canonical.encode()).hexdigest()[:8]

print(f"config_id={config_id}")`,
        checks: [
          {
            "kind": "defined",
            "task": "t1",
            "label": "`canonical` terdefinisi",
            "name": "canonical",
            "msg": "Buat canonical = json.dumps(config, sort_keys=True).",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan config_id",
            "pattern": "config_id=fc084cce",
            "msg": "SHA-256 dari canonical JSON, 8 karakter pertama.",
          },
        ],
      },
      reference: "sort_keys=True menjamin urutan key konsisten → hash stabil.",
    },
    {
      id: "environment",
      eyebrow: "Langkah 5 · Environment",
      title: "Library, container, dan GPU yang 'kadang beda'",
      prose: [
        "Sumber non-determinisme keempat: environment. Versi library yang berbeda bisa mengubah hasil numerik; GPU yang berbeda (atau bahkan run yang berbeda di GPU yang sama, tanpa deterministic flag) bisa menggeser digit terakhir.",
        "Praktik standar: lockfile (pip freeze / poetry.lock) mencatat versi eksak setiap dependensi; container (Docker) membekukan OS + library; CI membangun ulang dari definisi ini — bukan dari 'laptop yang kemarin bisa'.",
        "Untuk GPU: framework menyediakan mode deterministik (mis. torch.use_deterministic_algorithms) dengan biaya 10–30% lebih lambat. Keputusan: riset eksploratif boleh longgar; model yang diaudit regulator atau menjadi champion produksi wajib deterministik.",
        "Catat juga hardware dalam metadata run. 'Berhasil di-reproduce di A100 tapi tidak di T4' adalah informasi berharga, bukan kegagalan — ia memberitahumu ada operasi yang sensitif hardware.",
        "Docker untuk training — Dockerfile minimal 15 baris: base image TERVERSION (python:3.11-slim, bukan latest!), pip install dari lockfile, copy kode, set working dir. “Latest” = non-determinisme yang dilegalkan: build hari ini vs bulan depan = library berbeda. Pin SEMUA: base image digest (sha256:…), bukan hanya tag. Reproducibility = tidak ada kata “latest” di mana pun.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: reproducibility = kemampuan menjelaskan, bukan bit-identik sempurna",
        body: "Target praktis: orang lain dengan config + data + environment yang sama mendapatkan hasil dalam toleransi yang disepakati. Bit-identik adalah bonus; yang wajib adalah 'tidak ada kejutan'.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Seberapa reproducible harusnya?",
      prose: [
        "Skenario 1 — Eksperimen eksploratif pribadi → seed tercatat + config file. Alasan: murah, dan kebiasaan baik dimulai sebelum dibutuhkan.",
        "Skenario 2 — Model kandidat champion untuk produksi → seed terkunci semua library + deterministic ops + lockfile + experiment tracking penuh. Alasan: model ini akan di-debug, dibandingkan, dan dipertahankan orang lain.",
        "Skenario 3 — Model untuk regulator (kredit, asuransi) → semua di atas + dataset berversion (hash) + environment container + run log yang bisa diaudit. Alasan: 'hasilnya beda waktu di-run ulang' adalah temuan audit yang serius.",
        "Skenario 4 — Training raksasa multi-hari yang mahal → checkpointing + resume deterministik + toleransi: bit-identik dikorbankan demi kecepatan, tetapi config dan data tetap terkunci. Alasan: biaya compute mengalahkan perfeksionisme numerik.",
        "Aturan praktis 10 detik: tanyakan 'siapa yang akan me-reproduce run ini 6 bulan lagi, dan apa taruhannya?' Taruhan kecil → seed + config. Taruhan besar (uang, regulasi) → kunci semuanya.",
        "Skenario 3 — regulasi ketat (model kredit diaudit OJK) → SEMUA kunci + BUKTI TERTULIS. Auditor tidak percaya “sudah di-seed” — ia minta BUKTI: config file + hash dataset + log training + Dockerfile digest. Siapkan “reproducibility package” (1 folder, 5 file) SEBELUM diminta. Audit yang siap = 1 hari; yang tidak = 2 pekan panik. Reproducibility = bukan untukmu, melainkan untuk yang MENANYAIMU.",
        "Skenario 4 — kolaborasi tim (5 orang training model yang sama) → seed + config TERPUSAT di repo (bukan di laptop masing-masing). “Di laptopku jalan” = kalimat yang dilarang. Semua training via CI/CD yang sama, dari config yang sama. Standarisasi = menghilangkan “tapi di tempatku bisa”. 1 hari setup template = menghemat 100 jam “kok beda ya?” per tahun.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Audit Multifinance: 'tolong run ulang model champion'",
      prose: [
        "Tim audit internal multifinance meminta: run ulang training model champion scoring (AUC 0,83) dan buktikan hasilnya sama. Tim data mencoba — dan gagal total.",
        "Investigasi menemukan 4 masalah: (1) learning rate diubah langsung di kode tanpa catatan — nilai aslinya tidak diketahui; (2) dataset diambil dari warehouse yang sudah di-overwrite 2 bulan lalu; (3) tidak ada yang mencatat seed; (4) library di-upgrade dari 1.12 ke 1.15 di tengah jalan.",
        "Hasil run ulang: AUC 0,79 — selisih 4 poin. Tidak ada yang bisa menjelaskan apakah selisih itu dari parameter, data, atau library. Model champion 'terbaik' itu secara formal tidak bisa dipertanggungjawabkan.",
        "Pertanyaan: (a) Dari 4 masalah, mana yang paling fatal untuk audit? (b) Berapa minimal artefak yang harus ada agar run bisa diulang? (c) Proses apa yang mencegah ini terulang?",
        "Pembahasan: (a) Dataset yang hilang (2) — tanpa data yang sama, tidak ada pembanding yang valid; parameter bisa ditebak, data tidak. (b) Minimal: config lengkap + hash/versi dataset + seed + versi kode (git commit) + versi environment. (c) Training pipeline yang otomatis mencatat kelimanya setiap run — disiplin manual tidak bertahan di bawah deadline.",
        "Rekonstruksi biaya audit: 4 masalah × investigasi. (1) LR tak tercatat: 2 hari me-reverse-engineer dari log + tebakan. (2) Dataset ter-overwrite: data HILANG permanen — tidak bisa dipulihkan (biaya: kepercayaan auditor). (3) Seed tak dikunci: 5 run ulang untuk “membuktikan” varians. (4) Environment beda: 1 hari setup ulang. Total: 8 hari × Rp1,5 juta = Rp12 juta + 1 temuan audit mayor. Bandingkan: MLflow setup 4 jam (Rp600 ribu) + disiplin config. Rasio 20:1 — untuk masalah yang sama.",
      ],
      tasks: [
      ],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah.",
        "Refleksi: reproducibility = 5 kunci. (1) Seed terkunci semua library. (2) Config satu file + config_id. (3) Data berversion (hash + snapshot). (4) Environment terkunci (lockfile + Docker digest). (5) Deterministic ops untuk kandidat produksi. Lima kunci, nol alasan “tidak bisa reproduce”. Audit yang meminta bukti = tunjukkan 5 kunci. Yang tidak bisa = belum profesional. Keras? Ya. Itulah standar.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Dua run kode identik hasil beda, run ketiga beda lagi. Penyebab paling mungkin?",
          options: [
            {
              text: "Kode rusak",
              why: "Kode rusak biasanya gagal konsisten, bukan menghasilkan angka yang masuk akal tapi berbeda.",
            },
            {
              text: "Seed tidak dikunci di semua sumber keacakan",
              why: "Tepat: tanpa seed terkunci, init/shuffle acak membuat tiap run berbeda.",
              correct: true,
            },
            {
              text: "Data terlalu besar",
              why: "Ukuran data tidak membuat hasil run-to-run berbeda.",
            },
            {
              text: "Komputer terlalu lambat",
              why: "Kecepatan tidak mengubah hasil numerik.",
            },
          ],
        },
        {
          q: "Run A: lr=0.01 diubah langsung di kode, tidak tercatat. Masalahnya?",
          options: [
            {
              text: "Tidak masalah selama hasilnya bagus",
              why: "Hasil bagus yang tidak bisa diulang = tidak bisa dipertahankan.",
            },
            {
              text: "Melanggar prinsip config-driven; run tidak bisa direproduksi",
              why: "Tepat: parameter harus di config berversion, bukan di kode yang berubah diam-diam.",
              correct: true,
            },
            {
              text: "Learning rate 0.01 terlalu kecil",
              why: "Bukan soal nilainya, melainkan tidak tercatatnya nilai itu.",
            },
            {
              text: "Harus pakai 0.02",
              why: "Tidak ada nilai 'harus' — yang harus adalah pencatatan.",
            },
          ],
        },
        {
          q: "Dataset training sudah di-overwrite dan tidak berversion. Dampak terburuk?",
          options: [
            {
              text: "Training jadi lebih lambat",
              why: "Tidak berhubungan dengan kecepatan.",
            },
            {
              text: "Run historis tidak bisa dibandingkan atau diaudit secara valid",
              why: "Tepat: tanpa data yang sama, tidak ada baseline pembanding yang sah.",
              correct: true,
            },
            {
              text: "Model jadi overfit",
              why: "Overfit soal pola data, bukan soal versioning.",
            },
            {
              text: "Seed tidak berfungsi",
              why: "Seed dan data versioning adalah masalah berbeda.",
            },
          ],
        },
        {
          q: "Kapan mode deterministik GPU (yang 10–30% lebih lambat) WAJIB dipakai?",
          options: [
            {
              text: "Selalu, tanpa kecuali",
              why: "Untuk eksplorasi cepat, biaya keterlambatan bisa lebih mahal daripada manfaatnya.",
            },
            {
              text: "Model champion/audit yang hasilnya harus bisa dipertanggungjawabkan",
              why: "Tepat: ketika hasil harus dijelaskan ke pihak lain, determinisme sepadan dengan biayanya.",
              correct: true,
            },
            {
              text: "Tidak pernah",
              why: "Ada konteks (audit, debugging) di mana ia sangat berharga.",
            },
            {
              text: "Hanya saat GPU menganggur",
              why: "Keputusan berbasis kebutuhan akuntabilitas, bukan ketersediaan GPU.",
            },
          ],
        },
        {
          q: "Config ID dari hash SHA-256 berguna untuk…",
          options: [
            {
              text: "Mempercepat training",
              why: "Hash tidak memengaruhi kecepatan training.",
            },
            {
              text: "Memberi identitas unik tiap kombinasi parameter agar run bisa dilacak",
              why: "Tepat: ubah satu parameter → ID berubah → tidak ada run yang tertukar.",
              correct: true,
            },
            {
              text: "Mengenkripsi model",
              why: "Hash bukan enkripsi dan tidak melindungi model.",
            },
            {
              text: "Mengompresi config",
              why: "Hash 8 karakter bukan kompresi config.",
            },
          ],
        },
      ],
      summary: [
        "4 sumber non-determinisme: init acak, shuffle, operasi stokastik, hardware/GPU.",
        "Seed harus mengunci SEMUA library, bukan cuma random.",
        "Semua hyperparameter di config file — tidak ada angka ajaib di kode.",
        "Setiap run: config + hash data + seed + git commit + versi env + metrik + artefak.",
        "Config ID dari hash = identitas unik tiap kombinasi parameter.",
        "Tingkat reproducibility mengikuti taruhan: riset longgar, regulated ketat.",
      ],
      next: { label: "MLE4 — Evaluasi di Luar Akurasi", href: "/v2/learn/mle4-evaluasi" },
    },
  ],
};

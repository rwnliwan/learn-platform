import type { V2Mission } from "../lib/types";

// ── MISI NEURON MATI: Jaringan yang Berhenti Belajar ─────────────────────
// M2 — Deep Learning Engineer Misi A (core). Dataset: SINTETIS, seed 42
// (bukan log training nyata) — dinyatakan di briefing + METODE.md + data room.
// File: public/misi/misi-neuron-mati/training_log.csv (200 baris =
// 40 epoch × 5 layer). Metode: METODE.md.

const BASE = "/misi/misi-neuron-mati";

export const misiDeadNeuron: V2Mission = {
  slug: "misi-neuron-mati",
  track: "Deep Learning Engineer",
  module: "Misi",
  title: "Misi Neuron Mati: Jaringan yang Berhenti Belajar",
  estMinutes: 150,
  role: "Deep learning engineer — auditor training run model visi",
  client:
    "Head of ML — training run model klasifikasi citra produk 40 epoch menghasilkan loss yang 'mulus tapi tidak turun'; keputusan lanjut/henti/rancang-ulang ditunggu minggu ini",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Loss yang mulus tapi tidak turun",
      prose: [],
      tasks: [],
      briefing: {
        role: "Deep learning engineer — auditor training run model visi",
        client:
          "Head of ML di sebuah startup retail-tech. Model klasifikasi citra produk (MLP 5 layer) sudah training 40 epoch — loss-nya mulus seperti jalan tol, tapi tidak turun-turun dan akurasi validasi mentok di 41%. Engineer yang melatihnya mengusulkan “coba learning rate lebih besar”. Head of ML tidak yakin — dan memintamu mengaudit log training sebelum GPU dibakar untuk 40 epoch berikutnya.",
        story: [
          "Jumat, 16:40. Head of ML melempar link dashboard training ke chat: kurva loss 40 epoch yang nyaris datar — mulus, tanpa spike, tanpa drama. “Lihat,” katanya, “training-nya stabil banget.” Kamu menatap lebih lama. Stabil memang. Tapi loss mulai di 2,25 dan berakhir di 2,09 — untuk klasifikasi 10 kelas, tebakan acak pun loss-nya sekitar 2,30. Model ini nyaris tidak belajar apa-apa selama 40 epoch.",
          "Yang lebih mengganggu: engineer-nya mengusulkan menaikkan learning rate — obat standar untuk “training lambat”. Tapi kalau masalahnya bukan kecepatan melainkan arsitektur yang sekarat, LR lebih besar justru mempercepat kematian. Kamu meminta log mentah per epoch per layer: grad norm dan statistik aktivasi. Dari situlah kebenaran bisa dihitung — bukan dari kurva loss yang “terlihat stabil”.",
          "Misi ini memakai data sintetis (seed 42) yang meniru pola kegagalan nyata: dead ReLU + vanishing gradient. Tugasmu: hitung fraksi neuron mati per layer, ukur rasio grad norm antar-layer, putuskan nasib training run ini, temukan 4 sabotase di laporan “training sehat” dari tim, dan tulis memo diagnosis + rencana perbaikan.",
        ],
        objectives: [
          "Menghitung fraksi neuron mati rata-rata per layer dan rasio grad norm fc1/out dari log training, lalu mendiagnosis vanishing gradient dan dead ReLU dengan angka (bukan firasat).",
          "Mengagregasi metrik training per layer dengan SQL dan mengidentifikasi layer yang paling bermasalah.",
          "Menemukan 4 sabotase di laporan training internal yang mengklaim “semua sehat”, lalu menulis memo diagnosis + rencana perbaikan yang dipertahankan bukti.",
        ],
        prereqSummary:
          "Neuron ReLU “mati” bila keluarannya nol untuk semua input — dan karena gradien ReLU di titik nol = 0, neuron itu berhenti belajar selamanya. Vanishing gradient = gradien menyusut drastis dari layer akhir ke layer awal, sehingga layer awal nyaris tidak pernah di-update. Yang penting di sini bukan rumusnya: fraksi neuron mati yang besar + grad norm layer awal ≈ 0 berarti jaringan berhenti belajar — dan loss yang “mulus tapi datar” adalah gejalanya, bukan buktinya.",
        datasetNote:
          "Sumber: SINTETIS — digenerasi dengan NumPy seed 42 khusus untuk misi ini (bukan log training nyata).\nSlice: 40 epoch × 5 layer (fc1, fc2, fc3, fc4, out) → 200 baris (file training_log.csv: epoch, layer, grad_norm, dead_frac, loss).\nPola yang ditanam: loss datar (2,25 → 2,09), grad norm menyusut ke arah layer awal (vanishing), fraksi neuron mati membesar ke layer dalam (dead ReLU).\nKejujuran: pola disederhanakan agar diagnosis bisa direproduksi persis — training nyata lebih berisik. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Satu file, lima layer, dua patologi",
      prose: [
        "`training_log.csv` adalah kebenaran mentah: 200 baris, satu baris per epoch per layer. Kolom `grad_norm` = norma L2 gradien layer itu pada epoch tersebut (seberapa besar update yang diterima layer). Kolom `dead_frac` = fraksi neuron di layer itu yang aktivasinya nol untuk seluruh batch (neuron “mati”). Kolom `loss` sama untuk semua layer dalam satu epoch — ia metrik run, bukan metrik layer.",
        "Dua patologi yang kamu cari punya sidik jari berbeda. Dead ReLU meninggalkan `dead_frac` tinggi — neuron yang mati tidak berkontribusi apa-apa, kapasitas model menyusut diam-diam. Vanishing gradient meninggalkan `grad_norm` yang runtuh dari layer akhir ke layer awal — layer awal “dibekukan” bukan karena sudah optimal, melainkan karena sinyal belajar tidak sampai.",
        "Aturan main: (1) diagnosis dibangun dari agregat per layer di file mentah, bukan dari kurva loss dashboard; (2) “mati” berarti angka, bukan kesan — fraksi dan rasio yang dihitung; (3) vonis atas laporan “training sehat” dijatuhkan di Langkah 7 dengan membandingkan klaimnya terhadap angka-angka ini.",
      ],
      tasks: [
        { id: "t1", text: "Buka `training_log.csv`: catat jumlah baris, jumlah epoch, dan daftar layer" },
        { id: "t2", text: "Bandingkan `grad_norm` fc1 vs out pada epoch 1 — kira-kira berapa lipat selisihnya?" },
      ],
      note: {
        title: "Miskonsepsi #1: loss datar = sudah konvergen",
        type: "pitfall",
        body: "“Loss-nya datar, berarti model sudah konvergen.” BELUM TENTU — dan asumsi ini mahal. Loss datar + grad norm sehat + akurasi validasi tinggi = konvergen. Loss datar + grad norm ≈ 0 di layer awal + akurasi validasi 41% = model mati, bukan model selesai. Bedakan keduanya dengan melihat grad norm, bukan kurvanya. Di misi ini loss turun hanya 0,16 dalam 40 epoch sementara tebakan acak saja 2,30 — itu bukan konvergensi, itu kematian yang tenang.",
      },
      reference:
        "training_log.csv (200 baris, sintetis seed 42). Diagnosis dari angka mentah per layer; vonis untuk klaim “training sehat”.",
    },
    {
      id: "lab-neuron",
      eyebrow: "Langkah 3 · Lab 1 — Otopsi neuron",
      title: "Berapa banyak neuron yang sudah mati?",
      prose: [
        "Sekarang otopsi dengan tanganmu sendiri. Dari `training_log.csv`: hitung rata-rata `dead_frac` per layer (berapa persen neuron yang mati), rata-rata `grad_norm` per layer, lalu rasio grad norm fc1 terhadap out. Terakhir: bandingkan loss epoch 1 vs epoch 40 — seberapa “datar” sebenarnya kurva yang “stabil” itu.",
        "Dua rumus diagnosismu sudah disiapkan di bawah — kamu tinggal menerjemahkannya ke kode. Patokan kasar: `dead_frac` di atas 0,5 = layer kehilangan separuh kapasitasnya; rasio grad di bawah 0,01 = sinyal belajar nyaris tidak sampai ke layer awal.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris`, `n_epoch`, `daftar_layer`" },
        { id: "t2", text: "Hitung rata-rata `dead_frac` per layer: `dead_fc1` … `dead_fc4`, `dead_out`" },
        { id: "t3", text: "Hitung `rasio_fc1_out` (grad fc1 / grad out) + `loss_awal` dan `loss_akhir`" },
      ],
      expected:
        "200 baris, 40 epoch, 5 layer; dead frac rata-rata: fc1=0,2655, fc2=0,4593, fc3=0,6625, fc4=0,8625, out=0,0807; rasio grad norm fc1/out = 0,0052 (gradien menyusut ±200× dari out ke fc1 — vanishing gradient); loss 2,2497 → 2,0947 (turun 0,155 dalam 40 epoch — datar)",
      formula: String.raw`d_{\ell} = \frac{N_{\text{mati},\ell}}{N_{\text{total},\ell}} \quad\text{dan}\quad r = \frac{\lVert\nabla_{\text{fc1}}\rVert}{\lVert\nabla_{\text{out}}\rVert}`,
      formulaNote:
        "d_l = fraksi neuron mati di layer l (aktivasi nol untuk seluruh batch); r = rasio grad norm layer awal vs layer akhir — r jauh di bawah 1 berarti sinyal gradien “menguap” sebelum sampai ke layer awal (vanishing gradient). Di sini r ≈ 0,005: layer awal menerima update 200× lebih kecil dari layer akhir.",
      note: {
        title: "Miskonsepsi #2: neuron mati = pruning alami yang bagus",
        type: "pitfall",
        body: "“Neuron mati kan seperti pruning otomatis — model jadi efisien.” SALAH arah. Pruning itu disengaja, terukur, dan dipilih neuron yang tidak penting. Dead ReLU itu acak dan tak terkendali: di sini 86% neuron fc4 mati — layer itu praktis tidak ada. Kapasitas yang hilang tanpa keputusan sadar bukan efisiensi, melainkan kerusakan yang tidak tercatat di mana-mana kecuali di kolom dead_frac.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))` — URL sudah disiapkan di starter.",
        "Rata-rata per layer: `df.groupby(\"layer\")[\"dead_frac\"].mean()` — lalu ambil tiap layer dengan `[\"fc1\"]` dst., bungkus `float(...)`.",
        "Rasio: rata-rata grad_norm fc1 dibagi rata-rata grad_norm out.",
        "Loss per epoch sama di semua baris layer — ambil satu baris per epoch, mis. `df[df[\"epoch\"]==1][\"loss\"].iloc[0]`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-neuron-mati/training_log.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...",
          "n_epoch = ...",
          "daftar_layer = ...",
          "",
          "g = df.groupby(\"layer\")",
          "dead = ...   # rata-rata dead_frac per layer",
          "grad = ...   # rata-rata grad_norm per layer",
          "",
          "dead_fc1 = ...",
          "dead_fc2 = ...",
          "dead_fc3 = ...",
          "dead_fc4 = ...",
          "dead_out = ...",
          "",
          "rasio_fc1_out = ...   # grad fc1 / grad out (rata-rata)",
          "",
          "loss_awal = ...    # loss pada epoch 1",
          "loss_akhir = ...   # loss pada epoch 40",
          "",
          "print(\"baris:\", n_baris, \"| epoch:\", n_epoch, \"| layer:\", daftar_layer)",
          "print(\"dead frac:\", round(dead_fc1,4), round(dead_fc2,4), round(dead_fc3,4), round(dead_fc4,4), round(dead_out,4))",
          "print(\"rasio grad fc1/out:\", round(rasio_fc1_out,6))",
          "print(\"loss:\", loss_awal, \"->\", loss_akhir)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-neuron-mati/training_log.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "n_epoch = int(df[\"epoch\"].nunique())",
          "daftar_layer = sorted(df[\"layer\"].unique())",
          "",
          "g = df.groupby(\"layer\")",
          "dead = g[\"dead_frac\"].mean()   # rata-rata dead_frac per layer",
          "grad = g[\"grad_norm\"].mean()   # rata-rata grad_norm per layer",
          "",
          "dead_fc1 = float(dead[\"fc1\"])",
          "dead_fc2 = float(dead[\"fc2\"])",
          "dead_fc3 = float(dead[\"fc3\"])",
          "dead_fc4 = float(dead[\"fc4\"])",
          "dead_out = float(dead[\"out\"])",
          "",
          "rasio_fc1_out = float(grad[\"fc1\"] / grad[\"out\"])   # grad fc1 / grad out (rata-rata)",
          "",
          "loss_awal = float(df[df[\"epoch\"] == 1][\"loss\"].iloc[0])    # loss pada epoch 1",
          "loss_akhir = float(df[df[\"epoch\"] == 40][\"loss\"].iloc[0])   # loss pada epoch 40",
          "",
          "print(\"baris:\", n_baris, \"| epoch:\", n_epoch, \"| layer:\", daftar_layer)",
          "print(\"dead frac:\", round(dead_fc1,4), round(dead_fc2,4), round(dead_fc3,4), round(dead_fc4,4), round(dead_out,4))",
          "print(\"rasio grad fc1/out:\", round(rasio_fc1_out,6))",
          "print(\"loss:\", loss_awal, \"->\", loss_akhir)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris` = 200", name: "n_baris", value: 200, msg: "File punya 200 baris (40 epoch × 5 layer)." },
          { kind: "equal", task: "t1", label: "`n_epoch` = 40", name: "n_epoch", value: 40, msg: "Gunakan df[\"epoch\"].nunique()." },
          { kind: "equal", task: "t2", label: "`dead_fc4` ≈ 0,8625", name: "dead_fc4", value: 0.8625, tol: 0.001, msg: "Rata-rata dead_frac layer fc4 — 86% neuron mati." },
          { kind: "equal", task: "t2", label: "`dead_fc1` ≈ 0,2655", name: "dead_fc1", value: 0.2655, tol: 0.001, msg: "Rata-rata dead_frac layer fc1 via groupby." },
          { kind: "equal", task: "t3", label: "`rasio_fc1_out` ≈ 0,0052", name: "rasio_fc1_out", value: 0.005158, tol: 0.0005, msg: "Grad fc1 dibagi grad out (rata-rata) — bukti vanishing gradient." },
          { kind: "equal", task: "t3", label: "`loss_awal` ≈ 2,2497", name: "loss_awal", value: 2.2497, tol: 0.001, msg: "Loss pada epoch 1." },
          { kind: "equal", task: "t3", label: "`loss_akhir` ≈ 2,0947", name: "loss_akhir", value: 2.0947, tol: 0.001, msg: "Loss pada epoch 40 — turun cuma 0,155." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Agregasi per layer",
      title: "Layer mana yang paling sekarat?",
      prose: [
        "Head of ML tidak mau membaca 200 baris log — ia mau satu tabel ringkas: metrik rata-rata per layer, diurut dari yang paling bermasalah. Di sinilah agregasi SQL bekerja: dari log mentah menjadi tabel keputusan.",
        "Tabel `layer_stats(layer TEXT, avg_grad_norm REAL, avg_dead_frac REAL, n_epoch INT)` sudah berisi rata-rata per layer dari file mentah. Tampilkan layer, avg_grad_norm, dan avg_dead_frac untuk semua layer, urut dari `avg_grad_norm` terkecil — layer dengan gradien terkecil adalah yang paling “sekarat”.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query: semua layer + avg_grad_norm + avg_dead_frac, urut grad norm menaik" },
      ],
      expected: "5 baris — fc1 paling kecil (grad 0,0061, dead 0,2655), lalu fc2, fc3, fc4, out",
      sqlLab: {
        task: "Tampilkan layer, avg_grad_norm, avg_dead_frac untuk SEMUA layer, urut dari avg_grad_norm TERKECIL (layer paling sekarat duluan).",
        schema: "CREATE TABLE layer_stats (layer TEXT, avg_grad_norm REAL, avg_dead_frac REAL, n_epoch INT);",
        seedData: [
          "INSERT INTO layer_stats VALUES",
          "('fc1',0.0061,0.2655,40),",
          "('fc2',0.0299,0.4593,40),",
          "('fc3',0.1173,0.6625,40),",
          "('fc4',0.4414,0.8625,40),",
          "('out',1.1806,0.0807,40);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT layer, avg_grad_norm, avg_dead_frac\nFROM layer_stats\n",
        solution: [
          "SELECT layer, avg_grad_norm, avg_dead_frac",
          "FROM layer_stats",
          "ORDER BY avg_grad_norm;",
        ].join("\n"),
        expectedColumns: ["layer", "avg_grad_norm", "avg_dead_frac"],
        expectedRows: [
          ["fc1", 0.0061, 0.2655],
          ["fc2", 0.0299, 0.4593],
          ["fc3", 0.1173, 0.6625],
          ["fc4", 0.4414, 0.8625],
          ["out", 1.1806, 0.0807],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiDeadNeuron;

// ── lanjutan misiDeadNeuron: langkah 5–10 ────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_DEAD: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Training run ini mau kamu apakan?",
    prose: [
      "Angkanya tidak berbohong: 86% neuron fc4 mati, gradien layer awal 200× lebih kecil dari layer akhir, loss turun 0,155 dalam 40 epoch. Ini bukan “training lambat” — ini jaringan yang berhenti belajar. Tapi “berhenti belajar” dan “apa yang harus dilakukan tim” adalah dua keputusan berbeda — dan Head of ML menunggumu memilih. Tiap opsi mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke Head of ML atas training run ini? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-ganti",
          label: "Ganti aktivasi ke LeakyReLU + init ulang He, lanjutkan training",
          rationale:
            "Dead ReLU adalah biang keladi yang terukur (86% neuron fc4 mati). LeakyReLU memberi gradien kecil untuk input negatif sehingga neuron bisa “hidup kembali”. Init ulang + lanjutkan = murah, tidak membuang 40 epoch yang sudah jalan.",
          nextStepId: "temuan-ganti",
          consequenceNote:
            "LeakyReLU memang menurunkan dead frac — tapi vanishing gradient tidak ikut sembuh: rasio grad norm fc1/out tetap di kisaran 0,005. Loss turun dari 2,09 ke 1,95 lalu mentok lagi. Dua minggu GPU terbakar untuk perbaikan setengah jalan: kamu mengobati satu patologi dari dua.",
        },
        {
          id: "opt-lanjut",
          label: "Lanjutkan 40 epoch lagi dengan learning rate 10× lebih besar",
          rationale:
            "Usulan engineer: kalau training lambat, besarkan LR. Paling murah — tidak perlu ubah kode, tinggal lanjutkan run yang sama dengan LR baru.",
          nextStepId: "temuan-lanjut",
          consequenceNote:
            "Epoch 47: loss meledak ke NaN. Dengan 86% neuron mati dan gradien yang timpang 200× antar-layer, LR besar justru melempar sisa neuron yang masih hidup keluar dari wilayah stabil. Run hangus total — 40 epoch + 7 epoch terbuang, dan kamu menjelaskan ke Head of ML kenapa “obat standar” membunuh pasiennya.",
        },
        {
          id: "opt-rancang",
          label: "Hentikan run — rancang ulang init, aktivasi, dan monitoring",
          rationale:
            "Dua patologi sekaligus (dead ReLU + vanishing gradient) = fondasi yang salah dari awal, bukan hyperparameter yang kurang pas. Berhenti sekarang lebih murah daripada membakar GPU untuk run yang fondasinya retak.",
          nextStepId: "temuan-rancang",
          consequenceNote:
            "Redesign satu sprint: He init, LeakyReLU, gradient clipping, dan monitor dead_frac per epoch. Run baru: loss 2,25 → 0,62 dalam 40 epoch, dead frac di bawah 5% di semua layer. Keputusan paling mahal di muka, paling murah di akhir — dan satu-satunya yang menyembuhkan kedua patologi.",
        },
      ],
    },
  },
  {
    id: "temuan-ganti",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: ganti aktivasi, lanjutkan",
    prose: [
      "Tim mengganti ReLU ke LeakyReLU dan init ulang He, lalu melanjutkan training. Kabar baik: dead frac turun drastis — neuron-neuron “bangun” kembali. Kabar buruk: loss turun dari 2,09 ke 1,95, lalu datar lagi. Rasio grad norm fc1/out tetap di kisaran 0,005 — vanishing gradient tidak peduli aktivasi apa yang kamu pakai.",
      "Dua minggu GPU kemudian, Head of ML bertanya kenapa akurasi validasi masih mentok di 52%. Jawabannya pahit: kamu mendiagnosis dengan benar (dead ReLU memang ada), tapi mengobati hanya separuh penyakit. Satu patologi yang tidak diobati cukup untuk membunuh satu training run.",
    ],
    tasks: [],
    note: {
      title: "Obati semua patologi, bukan yang paling kelihatan",
      body: "Dead ReLU itu “kelihatan” (86% mati, dramatis); vanishing gradient itu “tenang” (rasio 0,005, butuh dihitung). Godaan terbesar engineer adalah memperbaiki yang dramatis lalu berhenti. Di memo-mu, setiap diagnosis wajib ditemani daftar patologi yang SUDAH disingkirkan — bukan cuma yang ditemukan.",
    },
  },
  {
    id: "temuan-lanjut",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: LR 10× lebih besar",
    prose: [
      "Run dilanjutkan dengan LR 10×. Tujuh epoch pertama terlihat menjanjikan — loss turun ke 1,98, tercepat sejauh ini. Engineer yang mengusulkan tersenyum. Epoch 47: loss = NaN. Dengan 86% neuron mati, sisa kapasitas model bertumpu pada sedikit neuron yang masih hidup; LR besar melempar mereka keluar dari wilayah stabil dalam sekali update.",
      "Run hangus total. Pelajaran yang mahal: “besarkan LR” adalah obat untuk training yang SEHAT tapi lambat. Untuk jaringan yang sekarat, LR besar bukan obat — itu suntikan mati. Diagnosis sebelum resep, selalu.",
    ],
    tasks: [],
    note: {
      title: "Resep tanpa diagnosis = judi",
      body: "Setiap hyperparameter punya “indikasi” seperti obat: LR besar untuk plateau yang sehat, bukan untuk jaringan mati. Di memo-mu, setiap perubahan hyperparameter wajib ditemani kalimat “perubahan ini tepat KARENA diagnosisnya adalah …”. Tanpa itu, tuning = judi berbayar GPU.",
    },
  },
  {
    id: "temuan-rancang",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: hentikan & rancang ulang",
    prose: [
      "Kamu menghentikan run — keputusan yang tidak populer di minggu itu. Satu sprint redesign: He initialization (dirancang untuk ReLU), LeakyReLU, gradient clipping, dan — yang paling penting — monitor `dead_frac` + rasio grad norm di dashboard training, bukan cuma loss.",
      "Run baru: loss 2,25 → 0,62 dalam 40 epoch, dead frac di bawah 5% di semua layer, akurasi validasi 78%. Head of ML tidak lagi bertanya “kenapa loss-nya datar” — karena sekarang dashboard-nya menunjukkan ANGKA yang menjawab sebelum ditanya. Keputusan paling mahal di muka ternyata paling murah di akhir.",
    ],
    tasks: [],
    note: {
      title: "Monitoring yang benar mencegah misi seperti ini",
      body: "Ironisnya, misi ini tidak perlu terjadi: kalau dead_frac dan rasio grad norm dimonitor sejak epoch 1, patologi tertangkap di minggu pertama, bukan setelah 40 epoch. Di memo-mu, sertakan “apa yang dimonitor mulai sekarang” — diagnosis tanpa perbaikan sistem = menunggu kejadian berikutnya.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 16 baris: laporan “training sehat” itu bohong",
    prose: [
      "Sebelum menulis memo, satu misi audit. Di bawah ini 16 baris “Kutipan Laporan Training Q3”, dokumen internal tim ML yang mengklaim training “sehat dan stabil” dan merekomendasikan menaikkan LR. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri — angka tidak bisa berbohong dua kali.",
      "Senjatamu: dead frac per layer (fc4 = 0,8625), rasio grad fc1/out = 0,0052, dan loss yang turun cuma 0,155.",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-neuron-mati-m2a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai kutipan Laporan Training Q3 tim ML yang menyatakan training “sehat dan stabil”.",
      columns: ["No", "Pernyataan", "Nilai"],
      rows: [
        { rowId: 1, cells: { "No": "1", "Pernyataan": "Loss awal (epoch 1)", "Nilai": "2,25" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 2, cells: { "No": "2", "Pernyataan": "Loss akhir (epoch 40)", "Nilai": "2,09" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 3, cells: { "No": "3", "Pernyataan": "Penurunan loss", "Nilai": "0,16 — stabil" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I1: grad norm skala salah ──
        { rowId: 4, cells: { "No": "4", "Pernyataan": "Grad norm fc1 (rata-rata)", "Nilai": "0,61" }, claims: [{ label: "Tercatat", value: "Ya — normal" }] },
        { rowId: 5, cells: { "No": "5", "Pernyataan": "Grad norm out (rata-rata)", "Nilai": "1,18" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 6, cells: { "No": "6", "Pernyataan": "Rasio grad fc1/out", "Nilai": "0,52 — sehat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I2: histogram di-clip ──
        { rowId: 7, cells: { "No": "7", "Pernyataan": "Histogram aktivasi fc4", "Nilai": "Terdistribusi normal" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 8, cells: { "No": "8", "Pernyataan": "Catatan histogram", "Nilai": "Di-clip pada 0,01" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 9, cells: { "No": "9", "Pernyataan": "Fraksi neuron mati fc4", "Nilai": "3%" }, claims: [{ label: "Tercatat", value: "Ya — rendah" }] },
        // ── I3: early stopping di train ──
        { rowId: 10, cells: { "No": "10", "Pernyataan": "Early stopping", "Nilai": "Epoch 40 — train loss stabil" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 11, cells: { "No": "11", "Pernyataan": "Metrik early stopping", "Nilai": "Train loss" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 12, cells: { "No": "12", "Pernyataan": "Akurasi validasi", "Nilai": "41% (dalam target)" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I4: layer duplikat ──
        { rowId: 13, cells: { "No": "13", "Pernyataan": "Log layer fc3 (split A)", "Nilai": "grad 0,1173, dead 0,6625" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 14, cells: { "No": "14", "Pernyataan": "Log layer fc3 (split B)", "Nilai": "grad 0,1173, dead 0,6625" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 15, cells: { "No": "15", "Pernyataan": "Log layer fc2", "Nilai": "— (tidak ada di tabel)" }, claims: [{ label: "Tercatat", value: "Tidak ada" }] },
        { rowId: 16, cells: { "No": "16", "Pernyataan": "Rekomendasi", "Nilai": "Lanjutkan training, naikkan LR" }, claims: [{ label: "Keputusan", value: "Disetujui" }] },
      ],
      injections: [
        { key: "skala-salah", rowIds: [4, 6], title: "Grad norm dicatat dalam skala salah", clue: "Laporan menulis grad norm fc1 = 0,61 — log mentahmu: 0,0061. Selisih tepat ×100. Dengan angka palsu itu rasio fc1/out terlihat “sehat” 0,52; angka aslinya 0,0052.", danger: "Satu kolom dengan skala salah menghapus seluruh bukti vanishing gradient. Di produksi: model yang tidak belajar dikira sehat, dan keputusan “naikkan LR” diambil di atas angka bohong." },
        { key: "histogram-clip", rowIds: [7, 8, 9], title: "Histogram di-clip menyembunyikan spike nol", clue: "“Di-clip pada 0,01” — clipping memotong tepat di titik yang menyembunyikan spike nol. Hasilnya distribusi terlihat “normal” dan neuron mati dilaporkan 3% vs kenyataan 86%.", danger: "Visualisasi yang di-clip adalah kebohongan yang terlihat jujur — pembaca tidak bisa tahu apa yang dipotong tanpa membaca catatan metode yang disembunyikan di baris 8." },
        { key: "earlystop-train", rowIds: [10, 11], title: "Early stopping dilaporkan pada metrik train", clue: "Early stopping memakai train loss — yang “stabil” justru karena model berhenti belajar. Metrik yang benar: val loss / akurasi validasi (mentok 41%).", danger: "Early stopping di train loss menghentikan training tepat saat model sekarat dan menyebutnya “selesai dengan baik” — kegagalan dibungkus sebagai prosedur." },
        { key: "layer-duplikat", rowIds: [13, 14, 15], title: "Satu layer duplikat di log, satu hilang", clue: "fc3 muncul dua kali dengan angka IDENTIK persis (grad 0,1173, dead 0,6625) — copy-paste. fc2 tidak ada sama sekali di tabel.", danger: "Baris ganda + baris hilang = semua agregat “rata-rata per layer” di atasnya salah total. Obatnya semurah di misi lain: constraint unik (epoch, layer)." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Memo diagnosis untuk Head of ML",
    prose: [
      "Semua bukti di tangan. Tulis memo diagnosis satu halaman untuk Head of ML — artefak portofoliomu. Memo yang baik tidak hanya bilang “modelnya mati”, tapi menunjukkan ANGKA kematiannya, apa yang disembunyikan laporan internal, dan apa yang harus diubah agar tidak terulang.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): diagnosis utama, angka kunci (dead frac, rasio grad), vonis atas training run.",
        "Bukti kuantitatif: fraksi neuron mati per layer, rasio grad norm fc1/out, loss awal vs akhir — dari log mentah, bukan dari laporan.",
        "Temuan audit laporan: 4 sabotase di laporan “training sehat”, baris per baris.",
        "Rencana perbaikan: apa yang diubah (aktivasi, init, clipping, monitoring) + keputusan atas run saat ini (rujuk pilihanmu di Langkah 5).",
        "Batas & risiko sisa: apa yang TIDAK dibuktikan analisis ini (mis. data sintetis — pola di data nyata lebih berisik; dead frac dihitung per batch, bukan per seluruh dataset).",
      ],
      rubric: [
        { criterion: "Kebenaran diagnosis", weight: 25, levels: ["Diagnosis salah/tidak ada angka", "Satu patologi benar, satunya hilang", "Dead ReLU (fc4 = 0,8625) + vanishing gradient (rasio 0,0052) — keduanya tepat dengan angka"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa nomor baris", "Keempat sabotase disebut dengan nomor baris"] },
        { criterion: "Kualitas rencana perbaikan", weight: 25, levels: ["“Naikkan LR” tanpa diagnosis", "Ada perbaikan tapi hanya satu patologi", "Aktivasi + init + clipping + monitoring dead_frac/grad — mencakup kedua patologi + pencegahan"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim analisis membuktikan segalanya", "Menyebut sebagian batas", "Batas (data sintetis, dead frac per batch) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan training internal:",
      "1) **Skala salah** (baris 4 & 6): grad norm fc1 ditulis 0,61 — aslinya 0,0061. Selisih ×100 mengubah “vanishing gradient” menjadi “sehat”. Satu kolom, satu kesimpulan hilang.",
      "2) **Histogram di-clip** (baris 7–9): “di-clip pada 0,01” menyembunyikan spike nol; neuron mati dilaporkan 3% vs kenyataan 86%. Visualisasi yang dipotong di titik yang tepat adalah cara paling elegan untuk berbohong dengan grafik.",
      "3) **Early stopping di train** (baris 10–11): berhenti karena train loss “stabil” — padahal stabil karena model berhenti belajar. Early stopping yang benar memakai metrik validasi.",
      "4) **Layer duplikat** (baris 13–15): fc3 dua kali identik, fc2 hilang. Klasik — dan obatnya constraint unik.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim laporan terhadap log mentah, atau memercayai stempel “training sehat”. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis — bahkan opsi “benar” (rancang ulang) membayar dengan satu sprint. Engineer terbaik bukan yang paling cepat memperbaiki, melainkan yang diagnosanya paling tidak bisa dibantah.",
      "Bahaya nyata terakhir: model mati di produksi adalah silent failure. Ia tidak error, tidak crash — ia hanya memberi prediksi buruk dengan percaya diri, hari demi hari, sampai seseorang menyadari akurasinya tidak pernah bergerak. Itulah kenapa monitoring dead_frac dan rasio grad norm belongs di dashboard, bukan di misi audit.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: ReLU “aman” karena populer",
      type: "risk",
      body: "ReLU dipakai di mana-mana — tapi “populer” bukan “bebas masalah”. Dead ReLU adalah mode kegagalan yang diketahui sejak 2013 dan masih membunuh training run sampai hari ini, terutama dengan init yang buruk atau LR yang terlalu besar di awal. Alternatif (LeakyReLU, GELU) ada bukan karena tren, melainkan karena setiap aktivasi punya cara matinya sendiri — dan engineer yang baik tahu cara mati dari perkakasnya.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Diagnosis kuantitatif: dead frac rata-rata fc4 = 0,8625 (86% neuron mati), rasio grad norm fc1/out = 0,0052 (vanishing gradient ±200×), loss 2,2497 → 2,0947 dalam 40 epoch.",
      "Empat pola sabotase laporan training: skala salah (×100), histogram di-clip, early stopping di metrik train, layer duplikat + satu hilang.",
      "Keputusan atas run yang sekarat selalu punya harga: ganti aktivasi saja (setengah sembuh), LR besar (NaN di epoch 47), rancang ulang (mahal di muka, murah di akhir).",
      "Loss datar bukan bukti konvergensi — tanpa grad norm yang sehat dan akurasi validasi yang naik, “stabil” = “mati dengan tenang”.",
      "Data: SINTETIS seed 42 (bukan log nyata), 200 baris, dibekukan 2026-10-15; pola disederhanakan agar diagnosis bisa direproduksi persis.",
    ],
  },
];

(misiDeadNeuron.steps as V2Step[]).push(...LANJUTAN_DEAD);

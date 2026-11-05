import type { V2Mission } from "../lib/types";
import type { V2Step } from "../lib/types";

// ── MISI Cluster: Training yang Membakar Uang ────────────────────────────
// Misi CAPSTONE kombinasi: Deep Learning Engineer × ML Engineer.
// Sudut kombinasi: training skala besar — distribusi, kegagalan, biaya.
// Dataset SINTETIS (seed 42) — BUKAN log klaster nyata.
// File: public/misi/misi-gabung-training-skala/ (training_log.csv,
// comm_overhead.csv, events.csv, gpu_pricing.csv, run_config.csv).
// Metode: METODE.md di folder yang sama.

const BASE = "/misi/misi-gabung-training-skala";

export const misiGabungTraining: V2Mission = {
  slug: "misi-gabung-training-skala",
  track: "Deep Learning Engineer",
  module: "Misi",
  title: "Misi Cluster: Training yang Membakar Uang",
  estMinutes: 180,
  role: "Deep learning engineer",
  client:
    "VP Engineering — distributed training 8 GPU macet, burn $12rb/minggu, loss divergen di step 40rb",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Delapan GPU, satu loss yang meledak",
      prose: [],
      tasks: [],
      briefing: {
        role: "Deep learning engineer — pemilik teknis run training terdistribusi TR-8847",
        client:
          "VP Engineering. Run TR-8847 (8× A100, target 50k step) loss-nya divergen di step 40rb — tiga hari GPU hangus. Klaster membakar $12rb/minggu dan setiap hari macet = $1.700 terbang. Tim infra mengirim “laporan insiden” yang mengklaim config sudah benar: batch 64, LR 0,0006 yang “konservatif & aman”, schedule “sudah di-rescale”, overhead komunikasi “sehat”, biaya “$516 on-demand”. Angka-angkanya terlalu rapi — dan kerapian adalah bau yang kamu kenal. Tugasmu: hitung ulang SEMUA klaim itu dari data mentah, putuskan nasib run ini (resume / restart / downscale), dan tulis runbook agar tidak terulang.",
        story: [
          "Rabu, 02:14. Pager-mu bunyi: alert loss run TR-8847. Kamu buka dashboard — kurva loss yang tiga hari turun mulus tiba-tiba menanjak seperti roket mulai step 40.000. Delapan worker, semuanya ikut meledak. Bukan satu GPU rusak; ini sistemik.",
          "Pagi harinya laporan insiden dari tim infra sudah rapi di mejamu: batch 64, LR 0,0006 (“2× dari base, konservatif & aman”), LR schedule “sudah di-rescale untuk batch 512”, overhead komunikasi “rata-rata 12,4 ms — sehat”, dan biaya run “$516 (on-demand)”. Setiap barisnya menjawab pertanyaan sebelum kamu sempat bertanya. Laporan yang terlalu siap biasanya menyembunyikan sesuatu.",
          "Kamu meminta data mentah: log training per step per worker, overhead komunikasi, event preemption, tabel harga, dan config run. Mereka memberikannya — 5 file CSV. Misi ini: audit laporan itu baris per baris dengan kode, bukan dengan firasat. Empat kebohongan menunggu ditemukan; satu keputusan menunggumu di ujung.",
        ],
        objectives: [
          "Menghitung ulang effective batch size dan learning rate yang benar menurut linear scaling rule dari data mentah run TR-8847.",
          "Menganalisis biaya per 1k step (on-demand vs spot), mengidentifikasi straggler worker, dan menentukan step divergensi dari log training.",
          "Menemukan 4 sabotase di laporan insiden TR-8847, memilih keputusan nasib run (resume/restart/downscale), dan menulis runbook training + model biaya.",
        ],
        prereqSummary:
          "Data parallelism = tiap GPU (worker) memproses sebagian batch yang berbeda, lalu gradiennya dirata-ratakan lewat all-reduce — batch yang “dirasakan” model adalah effective batch = jumlah worker × batch per worker. Linear scaling rule (aturan praktis standar): kalau effective batch dikali k, learning rate ikut dikali k — tiap step melihat k× data lebih banyak, jadi langkah update boleh k× lebih besar tanpa mengubah dinamika training. Warmup = menaikkan LR perlahan di awal agar update besar tidak meledak sebelum model stabil.",
        datasetNote:
          "Data 100% SINTETIS: log training fiksi hasil generator acak (seed 42) — BUKAN log klaster nyata, BUKAN milik perusahaan mana pun, TANPA kredensial.\nFile: training_log.csv (800 baris: step, worker, loss, grad_norm), comm_overhead.csv (800 baris: step, worker, step_time_s, comm_overhead_ms), events.csv (preemption spot-instance), gpu_pricing.csv (harga fiksi USD per GPU-jam), run_config.csv (konfigurasi run TR-8847).\nMetode & batas jujur: file METODE.md di folder yang sama. Harga GPU fiksi mendekati kisaran pasar, bukan kutipan resmi.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Lima file kebenaran mentah",
      prose: [
        "Lima file CSV adalah satu-satunya sumber kebenaran di misi ini. `run_config.csv` berisi fakta konfigurasi run TR-8847 (8 worker, batch per-worker 64, base LR 3e-4 untuk batch 64 single-GPU — plus klaim dossier untuk dibandingkan). `training_log.csv` mencatat loss dan grad_norm per step per worker (100 titik × 8 worker). `comm_overhead.csv` mencatat step_time dan overhead komunikasi per step per worker. `events.csv` mencatat preemption spot-instance. `gpu_pricing.csv` mencatat harga on-demand vs spot per tipe instance.",
        "Cara membaca chart di bawah: sumbu X = step training (0–50k), sumbu Y = loss rata-rata 8 worker. Garis kuning = loss; garis merah putus-putus = step 40.000. Pola yang sehat = turun mulus lalu mendatar; pola run ini = turun mulus lalu MENANJAK tajam.",
        "Interpretasi: sampai step 40k semuanya terlihat normal — inilah yang membuat laporan insiden berani menulis “anomali tak terduga”. Tapi “tak terduga” bukan penjelasan; ia hanya nama lain untuk “tidak dianalisis”. Di lab kamu akan membuktikan bahwa tanda-tandanya (grad_norm, schedule, straggler) sudah ada jauh sebelum kurva menanjak.",
        "Fakta run yang tidak bisa dinegosiasi (dari `run_config.csv`): 8 worker, batch per-worker 64 → effective batch 512. Resep dasar single-GPU: LR 3e-4 untuk batch 64. Klaim dossier yang akan kamu uji: batch “64”, LR 0,0006, schedule “sudah di-rescale”, overhead “12,4 ms sehat”, biaya “$516 on-demand”.",
      ],
      tasks: [
        { id: "t1", text: "Buka `run_config.csv`: catat `n_workers`, `batch_per_worker`, dan `effective_batch`" },
        { id: "t2", text: "Buka `training_log.csv`: di step berapa loss rata-rata mulai naik lagi?" },
        { id: "t3", text: "Buka `gpu_pricing.csv`: berapa harga spot vs on-demand untuk `tr-cluster-a100`?" },
      ],
      figure: {
        svg: "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Kurva loss rata-rata run TR-8847\"><line x1=\"40\" y1=\"260\" x2=\"600\" y2=\"260\" stroke=\"#3a3f4a\" stroke-width=\"1\"/><text x=\"30\" y=\"264\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"end\">0</text><line x1=\"40\" y1=\"216\" x2=\"600\" y2=\"216\" stroke=\"#3a3f4a\" stroke-width=\"1\"/><text x=\"30\" y=\"220\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"end\">1</text><line x1=\"40\" y1=\"172\" x2=\"600\" y2=\"172\" stroke=\"#3a3f4a\" stroke-width=\"1\"/><text x=\"30\" y=\"176\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"end\">2</text><line x1=\"40\" y1=\"128\" x2=\"600\" y2=\"128\" stroke=\"#3a3f4a\" stroke-width=\"1\"/><text x=\"30\" y=\"132\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"end\">3</text><line x1=\"40\" y1=\"84\" x2=\"600\" y2=\"84\" stroke=\"#3a3f4a\" stroke-width=\"1\"/><text x=\"30\" y=\"88\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"end\">4</text><line x1=\"40\" y1=\"40\" x2=\"600\" y2=\"40\" stroke=\"#3a3f4a\" stroke-width=\"1\"/><text x=\"30\" y=\"44\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"end\">5</text><text x=\"40\" y=\"282\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"middle\">0k</text><text x=\"152\" y=\"282\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"middle\">10k</text><text x=\"264\" y=\"282\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"middle\">20k</text><text x=\"376\" y=\"282\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"middle\">30k</text><text x=\"488\" y=\"282\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"middle\">40k</text><text x=\"600\" y=\"282\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"middle\">50k</text><line x1=\"488\" y1=\"40\" x2=\"488\" y2=\"260\" stroke=\"#f85149\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"494\" y=\"56\" fill=\"#f85149\" font-size=\"12\">divergen: step 40.000</text><polyline points=\"40.0,57.6 45.6,63.5 51.2,70.0 56.8,75.8 62.4,81.0 68.0,86.5 73.6,91.3 79.2,96.2 84.8,100.8 90.4,105.9 96.0,109.9 101.6,114.3 107.2,118.0 112.8,122.2 118.4,125.7 124.0,129.1 129.6,132.5 135.2,136.1 140.8,138.4 146.4,141.7 152.0,144.1 157.6,147.3 163.2,150.0 168.8,152.7 174.4,154.8 180.0,157.4 185.6,159.5 191.2,162.0 196.8,163.5 202.4,166.1 208.0,167.8 213.6,169.2 219.2,170.9 224.8,172.4 230.4,173.8 236.0,175.9 241.6,177.6 247.2,178.8 252.8,180.2 258.4,181.5 264.0,182.1 269.6,183.8 275.2,184.8 280.8,186.4 286.4,186.9 292.0,187.4 297.6,189.5 303.2,190.3 308.8,190.4 314.4,191.8 320.0,193.2 325.6,193.1 331.2,194.6 336.8,194.1 342.4,195.1 348.0,195.8 353.6,196.8 359.2,198.0 364.8,198.3 370.4,198.2 376.0,198.8 381.6,199.1 387.2,200.1 392.8,200.1 398.4,200.3 404.0,201.2 409.6,202.0 415.2,202.7 420.8,202.6 426.4,203.3 432.0,202.8 437.6,203.7 443.2,204.4 448.8,203.7 454.4,204.7 460.0,204.8 465.6,205.6 471.2,205.0 476.8,205.5 482.4,206.2 488.0,199.9 493.6,194.4 499.2,190.4 504.8,184.6 510.4,181.1 516.0,176.3 521.6,173.2 527.2,167.3 532.8,163.2 538.4,158.7 544.0,153.0 549.6,147.9 555.2,143.5 560.8,139.8 566.4,134.1 572.0,129.0 577.6,125.9 583.2,119.1 588.8,115.8 594.4,110.3\" fill=\"none\" stroke=\"#e8b339\" stroke-width=\"2\"/><text x=\"40\" y=\"24\" fill=\"#c9d1d9\" font-size=\"13\">Loss rata-rata 8 worker — run TR-8847 (data sintetis)</text><text x=\"320\" y=\"298\" fill=\"#8b949e\" font-size=\"11\" text-anchor=\"middle\">step training</text></svg>",
        alt: "Kurva loss rata-rata run TR-8847: turun mulus lalu menanjak tajam mulai step 40.000",
        caption: "Pola loss run TR-8847 (data sintetis misi ini). Cara membaca: sumbu X = step, sumbu Y = loss. Interpretasi: divergensi mulai step 40k — gejala, bukan diagnosis.",
      },
      reference:
        "training_log.csv, comm_overhead.csv, events.csv, gpu_pricing.csv, run_config.csv — 100% SINTETIS (seed 42). Fakta run: 8 worker × batch 64 = effective batch 512.",
    },
    {
      id: "teori-scaling",
      eyebrow: "Langkah 3 · Teori — lensa arsitektur training",
      title: "Delapan worker, satu batch raksasa",
      prose: [
        "Data parallelism bekerja seperti ini: 8 worker masing-masing memproses 64 sampel yang BERBEDA di satu step, menghitung gradien lokal, lalu gradien itu dirata-ratakan lewat all-reduce sebelum update bobot. Model tidak pernah “melihat” batch 64 — ia selalu melihat effective batch = 8 × 64 = 512 sampel per step. Melaporkan “batch 64” untuk run ini sama dengan melaporkan kecepatan satu roda sebagai kecepatan mobil.",
        "Karena tiap step melihat 8× data lebih banyak dibanding resep single-GPU (batch 64), gradiennya 8× lebih stabil — dan update-nya boleh 8× lebih besar tanpa mengubah dinamika training. Itulah linear scaling rule: LR_eff = LR_base × (B_eff / B_base). Dengan angka run ini: 3e-4 × 512/64 = 2,4e-3. Dossier memakai 0,0006 — hanya seperempat dari yang benar. Training-nya bukan “konservatif & aman”; ia merangkak dengan kecepatan seperempat.",
        "Satu jebakan lagi: LR schedule hidup dalam satuan STEP, tapi “usaha training” hidup dalam satuan DATA. Schedule warmup 2000 step yang dirancang untuk batch 64 berarti model melihat 2000 × 64 sampel selama warmup; dipakai mentah di batch 512, warmup yang sama memaksa model melihat 8× data sebelum LR penuh — dan horizon cosine 200k step untuk run yang cuma 50k step berarti LR tidak pernah turun ke target. Schedule tidak bisa di-copy-paste antar ukuran batch tanpa di-rescale.",
      ],
      tasks: [
        { id: "t1", text: "Hitung di kepala: 4 worker × batch 32, base LR 1e-3 @ batch 32 — berapa LR yang benar menurut linear scaling rule?" },
        { id: "t2", text: "Jelaskan dengan kata-katamu: kenapa schedule dalam step harus di-rescale saat batch berubah?" },
      ],
      formula: String.raw`\text{LR}_{\text{eff}} = \text{LR}_{\text{base}} \times \frac{B_{\text{eff}}}{B_{\text{base}}}`,
      formulaNote:
        "LR_eff = learning rate untuk run terdistribusi; LR_base = 3e-4 (resep single-GPU); B_eff = effective batch = 512 (8 worker × 64); B_base = 64 (batch resep dasar). Contoh: 3e-4 × 512/64 = 2,4e-3. Angka ini artinya tiap step melihat 8× data lebih banyak sehingga langkah update boleh 8× lebih besar — dossier memakai 6e-4 (hanya 2×), artinya training berjalan 4× lebih lambat dari seharusnya dan membakar 4× GPU-hours untuk progres yang sama.",
      note: {
        title: "Miskonsepsi #1: LR lebih kecil selalu lebih aman",
        type: "pitfall",
        body: "“0,0006 kan di bawah 0,0024 — lebih kecil = lebih aman dari divergensi.” Salah dua kali. Pertama, LR yang terlalu kecil untuk batch besar bukan aman — ia membuat training merangkak: 50k step dengan LR seperempat = progres setara ~12k step yang benar, sisanya GPU-hours terbuang. Kedua, “aman” yang benar bukan LR kecil, melainkan LR yang di-scale dengan tepat PLUS warmup yang cukup. Dossier menjual kelambatan sebagai kehati-hatian.",
      },
    },
    {
      id: "teori-biaya",
      eyebrow: "Langkah 4 · Teori — lensa eksperimen & ekonomi",
      title: "Setiap step punya harga",
      prose: [
        "Di training skala besar, mata uangnya bukan dolar — melainkan GPU-hours. Model biayanya sederhana: biaya = (step_time × n_step / 3600) × n_GPU × harga_per_jam. Tiga tuasnya: step_time (seberapa cepat satu step), n_step (berapa lama run), dan harga (on-demand vs spot). Siapa pun yang salah di satu tuas akan salah total di tagihan — seperti yang akan kamu buktikan di lab.",
        "Spot instance 60–90% lebih murah dari on-demand karena provider bisa menariknya kapan saja (preemption). Itu taruhan yang bagus HANYA bila dua syarat terpenuhi: checkpoint rapat (tiap 5k step atau kurang) dan resume yang teruji. Tanpa keduanya, “hemat 70%” berubah menjadi “kehilangan 3 hari progres”. Dan satu fakta arsitektur yang tidak bisa ditawar: all-reduce itu sinkron — step_time klaster ditentukan oleh worker PALING LAMBAT. Satu straggler = delapan GPU berjalan secepat satu GPU yang pincang.",
        "Mini-case angka: bayangkan run berikutnya memakai 64 GPU on-demand $3,20/jam selama 14 hari tanpa validasi rapat — 64 × 3,20 × 24 × 14 = $68.812. Satu run buta bisa membakar $50rb+ TANPA hasil apa pun. Itulah taruhan di misi ini dalam skala kecil: keputusanmu di Langkah 8 bernilai ribuan dolar sungguhan bila pola yang sama terulang di klaster besar.",
      ],
      tasks: [
        { id: "t1", text: "Hitung di kepala: 8 GPU × step_time 1,45 dtk × 50k step — berapa GPU-hours? (jawab: ±161 jam)" },
        { id: "t2", text: "Sebutkan 2 syarat agar spot instance menjadi taruhan yang bagus" },
      ],
      note: {
        title: "Miskonsepsi #2: rata-rata overhead rendah = tidak ada worker lambat",
        type: "pitfall",
        body: "“Rata-rata 12,4 ms — sehat.” Rata-rata adalah alat penyamaran terbaik: tujuh worker @ 12 ms + satu worker @ 87 ms = rata-rata 21 ms, tapi kalau si 87 ms “dikecualikan sebagai outlier”, rata-ratanya kembali 12 ms dan masalahnya hilang dari laporan — bukan dari klaster. Karena all-reduce sinkron, klaster tetap menunggu si 87 ms di SETIAP step. Aturan: untuk overhead, lihat MAKSIMUM per worker, bukan rata-rata klaster.",
      },
    },
  ],
};

// ── lanjutan misi-gabung-training-skala: langkah 5–15 ─────────────────────

const LANJUTAN_CAP3: V2Step[] = [
  {
    id: "lab-scaling",
    eyebrow: "Langkah 5 · Lab 1 — Hitung ulang batch & LR",
    title: "Berapa batch yang sebenarnya? Berapa LR yang benar?",
    prose: [
      "Dossier mengklaim batch 64 dan LR 0,0006. Kamu tidak akan berdebat — kamu akan menghitung. Muat `run_config.csv`, baca fakta konfigurasinya, lalu terapkan linear scaling rule: effective batch = n_worker × batch per-worker, dan LR_benar = base_LR × effective_batch / base_batch.",
      "Setelah itu bandingkan dengan klaim dossier dan hitung FAKTOR kesalahannya: berapa kali lipat LR dossier menyimpang dari yang benar? Angka tunggal ini adalah inti sabotase #1.",
    ],
    tasks: [
      { id: "t1", text: "Muat `run_config.csv` ke `cfg`; buat dict `C` param → value" },
      { id: "t2", text: "Hitung `eff_batch` dan `correct_lr` (linear scaling rule)" },
      { id: "t3", text: "Hitung `lr_salah_faktor` = correct_lr / LR dossier" },
    ],
    expected:
      "eff_batch=512; LR benar 0,0024 (8× dari base 3e-4); LR dossier 0,0006 = 4× TERLALU KECIL — “batch 64” di laporan adalah batch per-worker, bukan effective batch",
    formula: String.raw`\text{LR}_{\text{eff}} = \text{LR}_{\text{base}} \times \frac{B_{\text{eff}}}{B_{\text{base}}}`,
    formulaNote:
      "LR_eff = learning rate run terdistribusi; LR_base = 3e-4 (resep single-GPU); B_eff = 512 (8 × 64); B_base = 64. Contoh: 3e-4 × 512/64 = 2,4e-3 — angka ini artinya tiap step melihat 8× data lebih banyak sehingga update boleh 8× lebih besar.",
    hints: [
      "Muat config: `cfg = pd.read_csv(open_url(BASE + \"/run_config.csv\"))`, lalu `C = dict(zip(cfg[\"param\"], cfg[\"value\"]))`.",
      "Ambil angka: `n_workers = int(C[\"n_workers\"])` — semua value di CSV ini string, konversi dulu.",
      "Effective batch = jumlah worker × batch per worker.",
      "Linear scaling: `correct_lr = base_lr * eff_batch / base_batch`; faktor salah = `correct_lr / dossier_lr`.",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/misi/misi-gabung-training-skala\"",
        "",
        "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
        "cfg = pd.read_csv(open_url(BASE + \"/run_config.csv\"))",
        "C = dict(zip(cfg[\"param\"], cfg[\"value\"]))",
        "",
        "n_workers = ...           # int(C[\"n_workers\"])",
        "batch_per_worker = ...    # int(C[\"batch_per_worker\"])",
        "base_lr = ...             # float(C[\"base_lr_single_gpu\"])",
        "base_batch = ...          # int(C[\"base_batch_single_gpu\"])",
        "",
        "eff_batch = ...           # n_workers x batch per worker",
        "correct_lr = ...          # linear scaling rule",
        "",
        "dossier_lr = float(C[\"dossier_claimed_lr\"])",
        "lr_salah_faktor = ...     # correct_lr / dossier_lr",
        "",
        "print(\"effective batch:\", eff_batch)",
        "print(\"LR benar:\", correct_lr)",
        "print(\"LR dossier:\", dossier_lr, \"| meleset\", round(lr_salah_faktor, 1), \"x\")",
      ].join("\n"),
      lockLines: 8,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/misi/misi-gabung-training-skala\"",
        "",
        "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
        "cfg = pd.read_csv(open_url(BASE + \"/run_config.csv\"))",
        "C = dict(zip(cfg[\"param\"], cfg[\"value\"]))",
        "",
        "n_workers = int(C[\"n_workers\"])",
        "batch_per_worker = int(C[\"batch_per_worker\"])",
        "base_lr = float(C[\"base_lr_single_gpu\"])",
        "base_batch = int(C[\"base_batch_single_gpu\"])",
        "",
        "eff_batch = n_workers * batch_per_worker",
        "correct_lr = base_lr * eff_batch / base_batch",
        "",
        "dossier_lr = float(C[\"dossier_claimed_lr\"])",
        "lr_salah_faktor = correct_lr / dossier_lr",
        "",
        "print(\"effective batch:\", eff_batch)",
        "print(\"LR benar:\", correct_lr)",
        "print(\"LR dossier:\", dossier_lr, \"| meleset\", round(lr_salah_faktor, 1), \"x\")",
      ].join("\n"),
      checks: [
        { kind: "defined", task: "t1", label: "`C` termuat", name: "C", msg: "C harus berisi dict param → value dari run_config.csv." },
        { kind: "equal", task: "t2", label: "`eff_batch` = 512", name: "eff_batch", value: 512, msg: "8 worker × 64 = 512 — bukan 64 seperti klaim dossier." },
        { kind: "equal", task: "t2", label: "`correct_lr` = 0,0024", name: "correct_lr", value: 0.0024, tol: 1e-9, msg: "3e-4 × 512/64 = 2,4e-3 menurut linear scaling rule." },
        { kind: "equal", task: "t3", label: "`lr_salah_faktor` = 4", name: "lr_salah_faktor", value: 4.0, tol: 0.01, msg: "LR dossier 6e-4 adalah SEPEREMPAT dari 2,4e-3 — training merangkak 4× lebih lambat." },
      ],
    },
  },
  {
    id: "lab-biaya",
    eyebrow: "Langkah 6 · Lab 2 — Biaya, straggler & divergensi",
    title: "Siapa yang lambat, berapa harganya, kapan meledaknya?",
    prose: [
      "Tiga pertanyaan, satu lab. Pertama: overhead komunikasi rata-rata PER WORKER — siapa yang paling lambat, dan apakah ia outlier sesekali atau straggler persisten? Kedua: dari step_time rata-rata, hitung biaya per 1.000 step untuk on-demand vs spot memakai harga `tr-cluster-a100` — lalu bandingkan dengan klaim dossier “$516 on-demand”. Ketiga: dari `training_log.csv`, tentukan step pertama di mana rata-rata grad_norm melewati 2,2 — itulah titik divergensi yang terukur, bukan tebakan.",
      "Tiga angka ini — nama straggler, dua harga, satu step — adalah amunisi auditmu untuk sabotase #2, #3, dan #4.",
    ],
    tasks: [
      { id: "t1", text: "Overhead rata-rata per worker → temukan `straggler` (worker paling lambat)" },
      { id: "t2", text: "Hitung `cost_ondemand_1k` dan `cost_spot_1k` (USD per 1.000 step)" },
      { id: "t3", text: "Temukan `diverge_step`: step pertama dengan rata-rata grad_norm > 2,2" },
    ],
    expected:
      "straggler = w5 (±87 ms vs ±12 ms worker lain — persisten, bukan outlier); biaya per 1k step: on-demand $10,34 vs spot $3,10 (3,33×); divergensi terukur di step 40.000",
    hints: [
      "Overhead per worker: `comm.groupby(\"worker\")[\"comm_overhead_ms\"].mean()` lalu `.idxmax()`.",
      "Biaya: `gpu_hours_1k = mean_step * 1000 / 3600 * 8`, lalu kali harga per jam dari baris `tr-cluster-a100`.",
      "Harga: `row = price[price[\"instance\"] == \"tr-cluster-a100\"].iloc[0]` lalu `row[\"on_demand_usd_per_hr\"]`.",
      "Divergensi: `gmean = log.groupby(\"step\")[\"grad_norm\"].mean()` lalu `int(gmean[gmean > 2.2].index[0])`.",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/misi/misi-gabung-training-skala\"",
        "",
        "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
        "comm = pd.read_csv(open_url(BASE + \"/comm_overhead.csv\"))",
        "log = pd.read_csv(open_url(BASE + \"/training_log.csv\"))",
        "price = pd.read_csv(open_url(BASE + \"/gpu_pricing.csv\"))",
        "",
        "overhead = ...          # rata-rata comm_overhead_ms per worker",
        "straggler = ...         # worker dengan overhead tertinggi",
        "",
        "mean_step = ...         # rata-rata step_time_s keseluruhan",
        "gpu_hours_1k = ...      # GPU-hours per 1.000 step (8 GPU)",
        "row = ...               # baris tr-cluster-a100 dari price",
        "cost_ondemand_1k = ...  # gpu_hours_1k x harga on-demand",
        "cost_spot_1k = ...      # gpu_hours_1k x harga spot",
        "",
        "gmean = ...             # rata-rata grad_norm per step",
        "diverge_step = ...      # step pertama dengan gmean > 2.2",
        "",
        "print(\"straggler:\", straggler)",
        "print(\"on-demand / 1k step: $\", round(cost_ondemand_1k, 2))",
        "print(\"spot / 1k step: $\", round(cost_spot_1k, 2))",
        "print(\"divergen di step:\", diverge_step)",
      ].join("\n"),
      lockLines: 9,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/misi/misi-gabung-training-skala\"",
        "",
        "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
        "comm = pd.read_csv(open_url(BASE + \"/comm_overhead.csv\"))",
        "log = pd.read_csv(open_url(BASE + \"/training_log.csv\"))",
        "price = pd.read_csv(open_url(BASE + \"/gpu_pricing.csv\"))",
        "",
        "overhead = comm.groupby(\"worker\")[\"comm_overhead_ms\"].mean()",
        "straggler = overhead.idxmax()",
        "",
        "mean_step = comm[\"step_time_s\"].mean()",
        "gpu_hours_1k = mean_step * 1000 / 3600 * 8",
        "row = price[price[\"instance\"] == \"tr-cluster-a100\"].iloc[0]",
        "cost_ondemand_1k = gpu_hours_1k * row[\"on_demand_usd_per_hr\"]",
        "cost_spot_1k = gpu_hours_1k * row[\"spot_usd_per_hr\"]",
        "",
        "gmean = log.groupby(\"step\")[\"grad_norm\"].mean()",
        "diverge_step = int(gmean[gmean > 2.2].index[0])",
        "",
        "print(\"straggler:\", straggler)",
        "print(\"on-demand / 1k step: $\", round(cost_ondemand_1k, 2))",
        "print(\"spot / 1k step: $\", round(cost_spot_1k, 2))",
        "print(\"divergen di step:\", diverge_step)",
      ].join("\n"),
      checks: [
        { kind: "defined", task: "t1", label: "`overhead` terhitung", name: "overhead", msg: "overhead harus berisi rata-rata per worker." },
        { kind: "equal", task: "t1", label: "`straggler` = w5", name: "straggler", value: "w5", msg: "w5 ≈ 87 ms di semua titik — persisten, bukan outlier." },
        { kind: "equal", task: "t2", label: "`cost_ondemand_1k` ≈ 10,34", name: "cost_ondemand_1k", value: 10.34, tol: 0.05, msg: "±3,23 GPU-hours × $3,20." },
        { kind: "equal", task: "t2", label: "`cost_spot_1k` ≈ 3,10", name: "cost_spot_1k", value: 3.10, tol: 0.05, msg: "±3,23 GPU-hours × $0,96 — 3,33× lebih murah." },
        { kind: "equal", task: "t3", label: "`diverge_step` = 40000", name: "diverge_step", value: 40000, msg: "Step pertama dengan rata-rata grad_norm > 2,2." },
      ],
    },
  },
  {
    id: "peta-keputusan",
    eyebrow: "Langkah 7 · Peta keputusan",
    title: "Gejala → diagnosis → aksi",
    prose: [
      "Sebelum memilih nasib run TR-8847, petakan dulu polanya. Empat skenario yang akan terus kamu temui di training skala besar:",
      "Skenario 1 — loss divergen + grad_norm meledak di tengah run. Kondisi: kurva menanjak setelah periode normal, gradien ikut naik. Aksi: cek LR & schedule DULU (apakah di-rescale untuk batch-mu?) — JANGAN tambah GPU atau restart buta. Contoh nyata misi ini: divergensi step 40k + grad_norm 1,8 → 3,4 = pola schedule yang tidak di-rescale.",
      "Skenario 2 — satu worker konsisten lambat di semua step. Kondisi: overhead satu worker 5–10× worker lain, persisten. Aksi: isolasi/ganti worker itu (preemption spot? jaringan?) — bukan menaikkan batch atau mengganti optimizer. Contoh nyata: w5 @ 87 ms vs 12 ms; all-reduce sinkron membuat 8 GPU secepat 1 GPU pincang.",
      "Skenario 3 — tagihan tidak masuk akal vs harga yang dipakai. Kondisi: laporan biaya memakai harga on-demand padahal run memakai spot (atau sebaliknya). Aksi: audit baris tagihan ke tabel harga SEBELUM memotong eksperimen. Contoh nyata: $516 (on-demand) vs $155 (spot) — selisih 3,3× mengubah “restart terlalu mahal” menjadi “restart murah”.",
      "Skenario 4 — checkpoint tersedia tapi resume tetap gagal. Kondisi: bobot checkpoint sudah terkontaminasi SEBELUM gejala terlihat (gradien beracun itu laten). Aksi: resume hanya dari checkpoint yang tervalidasi bersih; bila tidak ada, restart dari nol lebih murah daripada 2–3× resume beracun. Contoh nyata: checkpoint step 35k terlihat sehat padahal gradien sudah anomali.",
      "Aturan praktis 10 detik: batch salah → hitung ulang effective; loss meledak → curigai schedule; satu worker lambat → lihat max bukan mean; tagihan aneh → cek harga; resume gagal 1× → jangan resume ke-2× tanpa diagnosis baru.",
    ],
    tasks: [
      { id: "t1", text: "Untuk tiap skenario di atas, tulis satu baris: gejala apa yang kamu lihat di run TR-8847?" },
    ],
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 8 · Checkpoint keputusan",
    title: "Nasib run TR-8847 ada di tanganmu",
    prose: [
      "Faktanya sekarang jelas: effective batch 512 (bukan 64), LR yang benar 2,4e-3 (bukan 6e-4), schedule tidak di-rescale, w5 straggler, biaya riil $155 (bukan $516). Run berhenti di step 50k dengan loss divergen sejak 40k. Checkpoint “sehat” terakhir di step 35k. Klaster burn $12rb/minggu — setiap hari menunda = $1.700.",
      "Keputusan ini tercatat seperti memo yang sudah dikirim — tiap opsi membuka konsekuensi berbeda di langkah berikut.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Apa langkahmu untuk run TR-8847?",
      options: [
        {
          id: "opt-resume",
          label: "Perbaiki config (LR 2,4e-3, warmup 250, cosine 50k) lalu resume dari checkpoint step 35k",
          rationale:
            "Membuang 35k step itu mahal. Bobot step 35k masih sehat — divergensi baru terlihat di 40k — jadi perbaiki config dan lanjutkan. Hemat 70% progres dibanding restart.",
          nextStepId: "kons-resume",
          consequenceNote:
            "Resume berjalan 3 hari, lalu loss DIVERGEN LAGI di step setara 44k. Bobot step 35k ternyata sudah terkontaminasi gradien beracun — racunnya laten, gejalanya telat. $2.100 GPU-hours hangus untuk pelajaran ini.",
        },
        {
          id: "opt-restart",
          label: "Restart dari nol dengan config yang benar + validasi tiap 2k step",
          rationale:
            "Checkpoint 35k tidak bisa dipercaya — gradien sudah anomali sebelum loss terlihat. Satu-satunya fondasi bersih adalah step 0. Dengan config benar dan validasi rapat, run kedua tidak mengulang kegagalan pertama.",
          nextStepId: "kons-restart",
          consequenceNote:
            "Run kedua konvergen mulus hingga 50k step dalam 4 hari, biaya $155 (spot). Validasi tiap 2k step menangkap anomali kecil di step 18k sebelum membesar. 50k step pertama hangus — tapi menjadi run termurah yang pernah gagal di tim ini, karena kegagalannya berhenti di situ.",
        },
        {
          id: "opt-downscale",
          label: "Downscale ke 4 GPU (batch 256, LR 1,2e-3) dan lanjutkan dari step 50k",
          rationale:
            "Burn rate turun setengah; batch 256 masih besar; LR di-scale ulang ke 1,2e-3. Straggler w5 bisa dibuang dari pool 4 GPU. Hemat biaya sambil tetap jalan.",
          nextStepId: "kons-downscale",
          consequenceNote:
            "Burn rate turun, tapi akar masalah tidak tersentuh: schedule tetap tidak di-rescale dan bobot step 50k sudah terkontaminasi — loss divergen lagi di step setara 40k. Downscale menghemat dolar per jam, bukan memperbaiki training yang rusak. $900 tambahan hangus.",
        },
      ],
    },
  },
  {
    id: "kons-resume",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: perbaiki config, resume dari 35k",
    prose: [
      "Config diperbaiki (LR 2,4e-3, warmup 250, cosine 50k), checkpoint step 35k dimuat, run dilanjutkan. Tiga hari berjalan mulus — lalu di step setara 44k, kurva menanjak lagi. Grad_norm meledak lagi. Pola yang sama persis.",
      "Post-mortem-nya pahit: gradien di step 35k SUDAH anomali (rata-rata grad_norm mulai merangkak naik sejak 32k — datanya ada di training_log.csv kalau kamu lihat lagi), hanya saja loss belum bereaksi. Kamu me-resume dari bobot yang sudah keracunan. $2.100 GPU-hours — tiga hari klaster — hangus untuk mengulang kegagalan yang sama dengan config yang lebih baik.",
      "Pelajaran yang mahal: checkpoint yang “terlihat sehat” bukan checkpoint yang bersih. Resume tanpa validasi gradien = mewarisi racun.",
    ],
    tasks: [],
    note: {
      title: "Kapan resume masuk akal",
      body: "Resume masuk akal hanya bila (1) checkpoint tervalidasi bersih — cek grad_norm & loss di sekitar step checkpoint, bukan cuma “file-nya ada”; (2) penyebab kegagalan sudah diperbaiki DAN terbukti tidak meracuni bobot; (3) satu resume gagal = stop, diagnosis ulang. Dua resume beracun = pola, bukan nasib sial.",
    },
  },
  {
    id: "kons-restart",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: restart dari nol",
    prose: [
      "Keputusan yang paling tidak populer di rapat — “membuang 50k step” — ternyata yang paling murah. Run kedua dengan config benar (effective batch 512, LR 2,4e-3, warmup 250, cosine 50k, spot $0,96) konvergen mulus. Validasi tiap 2k step menangkap grad_norm yang merangkak di step 18k; investigasi 20 menit menemukan satu batch data korup — dibuang, run lanjut bersih.",
      "Total biaya run kedua: $155. Total biaya kegagalan pertama: $155 + 3 hari waktu tim. Bandingkan dengan skenario resume-beracun ($2.100) atau downscale-buta ($900): keberanian membuang yang rusak menghemat ribuan dolar.",
      "Pelajaran yang mahal dengan harga murah: di training skala besar, sunk cost adalah penasihat terburuk. Bobot yang terkontaminasi tidak bisa “diperbaiki” dengan config yang benar — ia harus dibuang.",
    ],
    tasks: [],
    note: {
      title: "Kenapa restart menang di sini",
      body: "Tiga kondisi membuat restart optimal: (1) akar masalah meracuni bobot (bukan sekadar config), (2) biaya run ulang kecil ($155 spot — fakta yang hanya terlihat setelah audit biaya!), (3) validasi rapat mencegah pengulangan. Tanpa audit biaya, $516 (angka dossier) akan membuat restart terlihat mahal dan keputusan ini tidak akan diambil.",
    },
  },
  {
    id: "kons-downscale",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: downscale ke 4 GPU",
    prose: [
      "Pool dikecilkan ke 4 GPU, batch 256, LR 1,2e-3 (di-scale dengan benar — satu-satunya hal yang benar di keputusan ini), w5 dibuang. Burn rate turun setengah. Dua hari berjalan — lalu loss menanjak lagi di step setara 40k.",
      "Downscale mengobati gejala biaya tanpa menyentuh penyakit: schedule tetap tidak di-rescale untuk batch berapa pun, dan bobot step 50k yang dilanjutkan sudah terkontaminasi sejak 40k. Kamu menghemat dolar per jam untuk menjalankan training yang rusak lebih murah — $900 untuk kegagalan yang sama dengan separuh kecepatan.",
      "Pelajaran yang mahal: efisiensi tidak bisa memperbaiki kebenaran. Klaster yang murah + config yang salah = kegagalan yang murah, tetap kegagalan.",
    ],
    tasks: [],
    note: {
      title: "Kapan downscale masuk akal",
      body: "Downscale masuk akal bila masalahnya MURNI throughput/biaya (mis. eksperimen eksplorasi yang memang belum butuh 8 GPU) — bukan bila modelnya divergen. Aturan: perbaiki kebenaran dulu (config, data, schedule), baru optimalkan biaya. Urutan terbalik = membayar untuk gagal lebih hemat.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 10 · Misi audit",
    title: "Dossier 10 baris: laporan insiden yang “rapi” itu bohong",
    prose: [
      "Sebelum menulis runbook, satu misi audit. Di bawah ini 10 baris “Laporan Insiden TR-8847” dari tim infra — dokumen yang terlalu rapi itu. Empat sabotase disuntikkan ke dalamnya. Senjatamu: hasil lab-mu sendiri — effective batch 512, LR benar 2,4e-3, straggler w5, biaya spot $3,10/1k step, divergensi step 40k.",
      "Cara kerja: untuk setiap baris berstatus “Periksa”, cocokkan klaim dossier dengan data MENTAH (bukan dengan ingatanmu tentang dossier) dan temukan di mana mereka berbohong.",
    ],
    tasks: [],
    auditDossier: {
      version: "cap3-training-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Insiden run TR-8847 yang akurat dan lengkap. Data dossier dinyatakan SINTETIS — turunan dari dataset misi ini.",
      columns: ["#", "Aspek", "Klaim laporan", "Angka laporan", "Status"],
      rows: [
        { rowId: 1, cells: { "#": "1", "Aspek": "Konfigurasi klaster", "Klaim laporan": "8× A100 40GB, data-parallel", "Angka laporan": "8 GPU", "Status": "Fakta" }, claims: [{ label: "Klaim", value: "Sesuai config" }] },
        { rowId: 2, cells: { "#": "2", "Aspek": "Batch size", "Klaim laporan": "64 — “cukup besar untuk run ini”", "Angka laporan": "64", "Status": "Periksa" }, claims: [{ label: "Klaim", value: "Batch 64" }] },
        { rowId: 3, cells: { "#": "3", "Aspek": "Learning rate", "Klaim laporan": "0,0006 — “2× dari base, konservatif & aman”", "Angka laporan": "0,0006", "Status": "Periksa" }, claims: [{ label: "Klaim", value: "LR aman" }] },
        { rowId: 4, cells: { "#": "4", "Aspek": "LR schedule", "Klaim laporan": "warmup 2000 step + cosine 200k — “sudah di-rescale untuk batch 512”", "Angka laporan": "2000 / 200000", "Status": "Periksa" }, claims: [{ label: "Klaim", value: "Schedule tepat" }] },
        { rowId: 5, cells: { "#": "5", "Aspek": "Overhead komunikasi", "Klaim laporan": "rata-rata 12,4 ms — “sehat (w5 dikecualikan sebagai outlier)”", "Angka laporan": "12,4 ms", "Status": "Periksa" }, claims: [{ label: "Klaim", value: "Klaster sehat" }] },
        { rowId: 6, cells: { "#": "6", "Aspek": "Preemption spot", "Klaim laporan": "3 event, 0 kehilangan progres — “ditangani mulus”", "Angka laporan": "3 event", "Status": "Fakta" }, claims: [{ label: "Klaim", value: "Sesuai events.csv" }] },
        { rowId: 7, cells: { "#": "7", "Aspek": "Biaya run 50k step", "Klaim laporan": "$516 — “8 GPU × $3,20 on-demand”", "Angka laporan": "$516", "Status": "Periksa" }, claims: [{ label: "Klaim", value: "Biaya akurat" }] },
        { rowId: 8, cells: { "#": "8", "Aspek": "Loss", "Klaim laporan": "divergen di step 40.000 — “anomali tak terduga”", "Angka laporan": "step 40000", "Status": "Fakta (gejala)" }, claims: [{ label: "Klaim", value: "Gejala terkonfirmasi" }] },
        { rowId: 9, cells: { "#": "9", "Aspek": "Checkpoint", "Klaim laporan": "tersimpan tiap 5k step — “resume kapan saja”", "Angka laporan": "tiap 5k", "Status": "Fakta" }, claims: [{ label: "Klaim", value: "Sesuai config" }] },
        { rowId: 10, cells: { "#": "10", "Aspek": "Durasi run", "Klaim laporan": "6,5 hari untuk 50k step", "Angka laporan": "6,5 hari", "Status": "Fakta" }, claims: [{ label: "Klaim", value: "Sesuai log" }] },
      ],
      injections: [
        { key: "batch-per-worker", rowIds: [2, 3], title: "Batch size dilaporkan per-worker, bukan effective", clue: "Dossier menulis batch 64 dan LR 0,0006 (“2× dari base 3e-4 — aman”). run_config.csv: 8 worker × 64 = effective batch 512. Linear scaling rule: LR benar = 3e-4 × 512/64 = 0,0024. LR dossier 4× TERLALU KECIL — dan “batch 64” adalah batch per-worker yang disulap menjadi batch keseluruhan.", danger: "LR 4× terlalu kecil = training merangkak = GPU-hours terbakar untuk progres semu. Di skala 64 GPU, kesalahan “batch” seperti ini mengubah $5rb menjadi $20rb sebelum ada yang sadar — dan dossier menjualnya sebagai kehati-hatian." },
        { key: "schedule-tak-di-rescale", rowIds: [4], title: "LR schedule tidak di-rescale untuk batch yang di-scale", clue: "Dossier mengklaim schedule “sudah di-rescale untuk batch 512”. run_config.csv: warmup 2000 step & horizon cosine 200k — parameter yang dirancang untuk baseline batch-64 single-GPU. Untuk effective batch 512 tiap step melihat 8× data: warmup 2000 step = 8× terlalu lama, horizon 200k untuk run 50k = LR tidak pernah decay ke target. Bukti di data: grad_norm meledak dan loss divergen tepat di step 40k.", danger: "Schedule yang tidak di-rescale adalah penyebab divergensi paling klasik di training skala besar. Copy-paste schedule dari run kecil ke run besar tanpa rescale = cara tercepat membakar satu run penuh — dan “anomali tak terduga” adalah nama lain untuk schedule yang tidak pernah dihitung ulang." },
        { key: "straggler-rata-rata", rowIds: [5], title: "Straggler disembunyikan oleh rata-rata", clue: "Dossier: “rata-rata 12,4 ms — sehat (w5 dikecualikan sebagai outlier)”. comm_overhead.csv: w5 = ±87 ms di SEMUA 100 titik — itu bukan outlier pengukuran, itu worker yang persisten lambat. Rata-rata 7 worker “sehat” memang 12 ms; rata-rata 8 worker yang jujur = ±21 ms. Satu catatan kaki menghapus satu masalah nyata.", danger: "All-reduce itu sinkron: step_time klaster ditentukan worker PALING LAMBAT. Menyembunyikan straggler di balik rata-rata = membayar 8 GPU untuk kecepatan 7 — dan setiap run berikutnya ikut melambat tanpa ada yang tahu kenapa." },
        { key: "biaya-on-demand", rowIds: [7], title: "Biaya dihitung on-demand padahal pakai spot", clue: "Dossier: $516 = 8 GPU × $3,20 on-demand. gpu_pricing.csv (kolom notes): run TR-8847 memakai SPOT $0,96. Biaya riil ≈ $155 — dossier menggelembungkan 3,3×. Dengan angka $516, restart terlihat “mahal”; dengan $155, restart dari nol tiba-tiba menjadi opsi termurah.", danger: "Laporan biaya yang salah membuat keputusan ikut salah: tim memilih resume beracun ($2.100) karena restart “terlihat mahal” ($516) — padahal restart riil cuma $155. Kebohongan $361 di spreadsheet berubah menjadi kerugian $2.100 di klaster." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 11 · Deliverable",
    title: "Runbook training + model biaya TR-8847",
    prose: [
      "Semua bukti di tangan: effective batch 512 & LR 2,4e-3 dari Lab 1; straggler w5, biaya $3,10/1k step (spot), dan divergensi step 40k dari Lab 2; keputusanmu di Langkah 8; dan 4 sabotase dari audit. Tulis runbook — artefak portofoliomu. Runbook yang baik bukan dokumen pajangan, melainkan dokumen yang mencegah run berikutnya terbakar: setiap barisnya bisa dieksekusi, setiap angkanya bisa diverifikasi.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Diagnosis akar (maks 1 halaman): 3 penyebab run TR-8847 gagal — masing-masing dengan bukti file + baris/angka (bukan opini).",
        "Config koreksi: tabel parameter (n GPU, batch per-worker, effective batch, LR max, warmup, horizon cosine) — kolom SEBELUM vs SESUDAH + satu kalimat alasan per baris.",
        "Model biaya: rumus biaya per 1k step dan per full run (50k step) untuk on-demand vs spot (pakai angka lab-mu); titik impas: pada tingkat preemption berapa spot tidak lagi worth it?",
        "Runbook operasi: checklist pre-launch (verifikasi effective batch, LR schedule di-rescale, harga tercatat), monitoring tiap 2k step (metrik + ambang alert), prosedur preemption & resume yang aman.",
        "Batas & risiko sisa: apa yang TIDAK bisa disimpulkan dari data sintetis ini (mis. harga fiksi, pola divergensi buatan).",
      ],
      rubric: [
        { criterion: "Diagnosis ber-bukti", weight: 30, levels: ["Penyebab tanpa bukti data", "Sebagian penyebab ber-bukti", "3 penyebab, masing-masing dengan file + angka pembanding dari data mentah"] },
        { criterion: "Config koreksi benar", weight: 25, levels: ["Config salah/tidak lengkap", "Sebagian parameter benar", "Tabel sebelum vs sesudah lengkap & benar (batch 512, LR 2,4e-3, warmup & horizon di-rescale) + alasan per baris"] },
        { criterion: "Model biaya", weight: 25, levels: ["Biaya tanpa rumus/angka", "Rumus ada, angka salah", "Rumus + angka benar (spot $3,10/1k, on-demand $10,34/1k) + analisis titik impas preemption"] },
        { criterion: "Runbook operasional", weight: 20, levels: ["Dokumen pajangan, tidak executable", "Checklist sebagian", "Checklist pre-launch + monitoring 2k step + prosedur preemption/resume yang bisa dieksekusi"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 12 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan insiden TR-8847:",
      "1) **Batch per-worker disulap jadi batch keseluruhan** (baris 2–3): dossier menulis batch 64, LR 0,0006 (“aman”). Data mentah: 8 × 64 = effective batch 512 → LR benar 2,4e-3. LR dossier 4× terlalu kecil — training merangkak dan membakar GPU-hours untuk progres semu.",
      "2) **Schedule tidak di-rescale** (baris 4): dossier mengklaim “sudah di-rescale untuk batch 512”. Data mentah: warmup 2000 + horizon 200k adalah parameter baseline batch-64. Untuk batch 512, warmup 8× terlalu lama dan LR tidak pernah decay ke target dalam run 50k — grad_norm meledak, loss divergen di step 40k.",
      "3) **Straggler disembunyikan rata-rata** (baris 5): dossier menulis 12,4 ms “sehat” dengan w5 “dikecualikan sebagai outlier”. Data mentah: w5 = ±87 ms di semua 100 titik — persisten, bukan outlier. All-reduce sinkron = 8 GPU secepat 1 GPU pincang.",
      "4) **Biaya digelembungkan 3,3×** (baris 7): dossier menulis $516 on-demand. Data mentah: run memakai spot $0,96 → biaya riil ±$155. Kebohongan $361 di spreadsheet membuat restart “terlihat mahal” dan mendorong tim ke resume beracun senilai $2.100.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap data mentah, atau memercayai kerapian laporan.",
      "Bahaya nyata terakhir: skalakan misi ini. 64 GPU × $3,20/jam × 14 hari = $68.812 untuk satu run. Tanpa verifikasi effective batch, tanpa rescale schedule, tanpa audit biaya — satu run buta bisa membakar $50rb+ TANPA hasil apa pun, dan laporannya akan tetap terlihat rapi. Itulah kenapa runbook yang kamu tulis di Langkah 11 lebih berharga daripada satu run yang sukses: ia mencegah sepuluh run yang gagal.",
      "Refleksi keputusan: apa yang berubah jika kamu memilih opsi lain di Langkah 8? Resume menghemat progres tapi mewarisi racun ($2.100). Restart membuang sunk cost tapi termurah ($155). Downscale menghemat burn rate tapi tidak menyentuh akar ($900). Tidak ada opsi yang gratis — yang ada hanya opsi yang harganya JUJUR.",
    ],
    tasks: [],
    note: {
      title: "Bahaya nyata: laporan rapi ≠ laporan benar",
      type: "risk",
      body: "Keempat sabotase punya satu pola: semuanya membuat laporan terlihat LEBIH RAPI (angka bulat, klaim menenangkan, catatan kaki yang masuk akal). Di pekerjaan nyata, kerapian adalah sinyal untuk memverifikasi, bukan untuk percaya. Aturan yang dibawa pulang: setiap angka di laporan insiden harus bisa ditelusuri ke satu baris data mentah — kalau tidak bisa, ia opini yang menyamar sebagai fakta.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 13 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Effective batch = n_worker × batch per-worker (8 × 64 = 512); linear scaling rule: LR_eff = LR_base × B_eff/B_base → LR benar run TR-8847 = 2,4e-3, bukan 0,0006 (dossier 4× terlalu kecil).",
      "LR schedule hidup dalam step tapi usaha training hidup dalam data — schedule baseline batch-64 (warmup 2000, horizon 200k) tidak bisa dipakai mentah untuk batch 512; pola klasiknya: grad_norm meledak & loss divergen (di sini step 40k).",
      "Straggler terdeteksi dari MAKSIMUM overhead per worker (w5 ±87 ms persisten), bukan rata-rata klaster — all-reduce sinkron membuat 8 GPU secepat worker paling lambat.",
      "Model biaya: ±3,23 GPU-hours per 1k step → on-demand $10,34 vs spot $3,10 (3,33×); run 50k step riil ±$155 (spot), bukan $516 (dossier menggelembungkan 3,3×).",
      "Keputusan nasib run: resume mewarisi racun ($2.100), restart dari nol termurah ($155) bila bobot terkontaminasi, downscale hemat burn rate tapi tak menyentuh akar ($900) — pilih harga yang JUJUR, bukan yang murah terlihat.",
      "Data: 100% SINTETIS (seed 42) — log, overhead, event, harga, dan config fiksi; pola dibuat menyerupai pola nyata agar bisa dianalisis — file METODE.md.",
    ],
  },
];

(misiGabungTraining.steps as V2Step[]).push(...LANJUTAN_CAP3);


export default misiGabungTraining;
